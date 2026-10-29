"use client";

import { type RefObject, useEffect, useState } from "react";

import { canStreamHls, filmFallback } from "@/lib/earlypreview/use-earlypreview-film";
import { FILM_PARK_EVENT, FILM_RESUME_EVENT, FILM_WARM_EVENT } from "@/lib/earlypreview/use-film-warm-up";

/**
 * hls.js from a pinned CDN build, loaded only when a film actually streams through it. The light build has no subtitle
 * or alternate-audio support, which these films do not use.
 */
const HLS_SCRIPT = "https://cdn.jsdelivr.net/npm/hls.js@1.6.11/dist/hls.light.min.js";

type HlsInstance = {
  config: { maxBufferLength: number };
  loadSource(url: string): void;
  attachMedia(media: HTMLMediaElement): void;
  stopLoad(): void;
  startLoad(): void;
  on(event: string, handler: (event: string, data: { fatal?: boolean }) => void): void;
  destroy(): void;
};

type HlsConstructor = {
  new (config: Record<string, unknown>): HlsInstance;
  isSupported(): boolean;
  Events: { ERROR: string };
};

let hlsLoading: Promise<HlsConstructor | null> | null = null;

function loadHls(): Promise<HlsConstructor | null> {
  const w = window as typeof window & { Hls?: HlsConstructor };
  if (w.Hls) return Promise.resolve(w.Hls);
  if (!hlsLoading) {
    hlsLoading = new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = HLS_SCRIPT;
      script.async = true;
      script.crossOrigin = "anonymous";
      script.onload = () => resolve(w.Hls ?? null);
      script.onerror = () => {
        hlsLoading = null;
        script.remove();
        resolve(null);
      };
      document.head.appendChild(script);
    });
  }
  return hlsLoading;
}

let native: boolean | null = null;

/** Safari and iOS play HLS themselves, with their own quality switching. */
function playsHlsNatively() {
  if (native === null) {
    try {
      native = document.createElement("video").canPlayType("application/vnd.apple.mpegurl") !== "";
    } catch {
      native = false;
    }
  }
  return native;
}

/** Seconds of film buffered ahead before anyone presses play, and once they have. */
const IDLE_BUFFER_S = 3;
/** Once the film is near the screen (see `useFilmWarmUp`), enough to start smoothly without pulling the whole film. */
const WARM_BUFFER_S = 8;
const PLAYING_BUFFER_S = 30;

function split(src: string) {
  const hash = src.indexOf("#");
  const base = hash === -1 ? src : src.slice(0, hash);
  const fragment = hash === -1 ? "" : src.slice(hash);
  const t = /[#&]t=(\d+(?:\.\d+)?)/.exec(fragment);
  return { base, fragment, startAt: t ? Number(t[1]) : undefined };
}

function isPlaylist(url: string) {
  return /\.m3u8(?:$|\?)/i.test(url);
}

/**
 * Turns a film URL into what the <video> should get as `src`. An mp4 passes straight through. An HLS playlist (auto
 * quality: the player picks the rendition that fits the connection and the size of the frame, and changes it as they
 * change) is handed to Safari as it is, and elsewhere played through hls.js, in which case `src` is left unset because
 * hls.js feeds the element itself. If streaming fails for any reason the film falls back to its mp4.
 *
 * A `#t=` on the URL (the thumbnail frame) is kept: it becomes hls.js's start position.
 *
 * Spread the result onto the <video>. While a playlist streams it also asks for CORS: the segments come from the blob
 * store's origin, and Chrome's native HLS only plays cross-origin segments in CORS mode. The mp4 is loaded as before.
 */
export type AdaptiveSource = { src: string | undefined; crossOrigin: "anonymous" | undefined };

export function useAdaptiveSrc(videoRef: RefObject<HTMLVideoElement>, src: string | undefined): AdaptiveSource {
  const [failed, setFailed] = useState<string | null>(null);
  const parts = src ? split(src) : null;
  const playlist = !!parts && isPlaylist(parts.base);
  const fallback = parts && playlist ? filmFallback(parts.base) : undefined;
  const useFallback = playlist && (failed === parts?.base || !canStreamHls());
  const viaHlsJs = playlist && !useFallback && typeof window !== "undefined" && !playsHlsNatively();

  useEffect(() => {
    if (!viaHlsJs || !parts) return;
    const video = videoRef.current;
    if (!video) return;
    const base = parts.base;
    let hls: HlsInstance | null = null;
    let cancelled = false;
    const fail = () => {
      hls?.destroy();
      hls = null;
      setFailed(base);
    };
    const onPlay = () => {
      if (hls) hls.config.maxBufferLength = PLAYING_BUFFER_S;
    };
    const onWarm = () => {
      if (hls) hls.config.maxBufferLength = Math.max(hls.config.maxBufferLength, WARM_BUFFER_S);
    };
    // While another film plays in cinema mode this stream fetches nothing.
    const onPark = () => hls?.stopLoad();
    const onResume = () => hls?.startLoad();
    video.addEventListener("play", onPlay);
    video.addEventListener(FILM_WARM_EVENT, onWarm);
    video.addEventListener(FILM_PARK_EVENT, onPark);
    video.addEventListener(FILM_RESUME_EVENT, onResume);
    void loadHls().then((Hls) => {
      if (cancelled) return;
      if (!Hls || !Hls.isSupported()) {
        setFailed(base);
        return;
      }
      // A film that is already warm or playing when its stream is built starts with the larger buffer.
      const eager = !video.paused;
      const warm = video.preload === "auto";
      hls = new Hls({
        startPosition: parts.startAt ?? -1,
        // A small tile never pulls the top rendition; full screen lifts the cap.
        capLevelToPlayerSize: true,
        // Most visitors are on fast links; starting from a 4 Mbps guess opens on a sharp rendition instead of the lowest.
        abrEwmaDefaultEstimate: 4_000_000,
        maxBufferLength: eager ? PLAYING_BUFFER_S : warm ? WARM_BUFFER_S : IDLE_BUFFER_S,
        maxMaxBufferLength: 60,
        backBufferLength: 30,
      });
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) fail();
      });
      hls.loadSource(base);
      hls.attachMedia(video);
    });
    return () => {
      cancelled = true;
      video.removeEventListener("play", onPlay);
      video.removeEventListener(FILM_WARM_EVENT, onWarm);
      video.removeEventListener(FILM_PARK_EVENT, onPark);
      video.removeEventListener(FILM_RESUME_EVENT, onResume);
      hls?.destroy();
      hls = null;
    };
    // `parts` is derived from `src`; the stream is rebuilt only when the playlist itself changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viaHlsJs, parts?.base, videoRef]);

  // Native HLS: a playlist the browser cannot open falls back to the mp4.
  useEffect(() => {
    if (!playlist || useFallback || viaHlsJs || !parts) return;
    const video = videoRef.current;
    if (!video) return;
    const base = parts.base;
    const onError = () => setFailed(base);
    video.addEventListener("error", onError);
    return () => video.removeEventListener("error", onError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlist, useFallback, viaHlsJs, parts?.base, videoRef]);

  if (!src || !parts) return { src: undefined, crossOrigin: undefined };
  if (!playlist) return { src, crossOrigin: undefined };
  if (useFallback) return { src: fallback ? fallback + parts.fragment : undefined, crossOrigin: undefined };
  return { src: viaHlsJs ? undefined : src, crossOrigin: "anonymous" };
}
