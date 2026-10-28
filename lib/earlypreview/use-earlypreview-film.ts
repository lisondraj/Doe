"use client";

import { useEffect, useState } from "react";

import type { EarlyPreviewFilmId } from "@/lib/earlypreview/earlypreview-films";

/** The route signs for six hours; a cached link is dropped well before that. */
const URL_MAX_AGE_MS = 5 * 60 * 60 * 1000;

type Cached = { at: number; url?: string; pending?: Promise<string | undefined> };

/** One signed link per film for the whole page, so tiles that share a film (or mount together) ask once. */
const cache = new Map<EarlyPreviewFilmId, Cached>();

function freshUrl(id: EarlyPreviewFilmId) {
  const hit = cache.get(id);
  return hit?.url && Date.now() - hit.at < URL_MAX_AGE_MS ? hit.url : undefined;
}

/** For each HLS playlist handed out, the signed mp4 it falls back to if streaming fails (see `useAdaptiveSrc`). */
const mp4ForPlaylist = new Map<string, string>();

export function filmFallback(src: string): string | undefined {
  return mp4ForPlaylist.get(src);
}

let streamable: boolean | null = null;

/** Whether this browser plays HLS: natively (Safari, iOS) or through Media Source (everything else, via hls.js). */
export function canStreamHls(): boolean {
  if (streamable !== null) return streamable;
  if (typeof window === "undefined") return false;
  try {
    const native = document.createElement("video").canPlayType("application/vnd.apple.mpegurl") !== "";
    const w = window as typeof window & { ManagedMediaSource?: typeof MediaSource };
    const Source = w.ManagedMediaSource ?? w.MediaSource;
    const mse = !!Source && Source.isTypeSupported('video/mp4; codecs="avc1.640028,mp4a.40.2"');
    streamable = native || mse;
  } catch {
    streamable = false;
  }
  return streamable;
}

/** The URL the player should load: the HLS ladder when there is one and the browser streams it, otherwise the mp4. */
function pick(body: { url?: string; hls?: string }): string | undefined {
  if (!body.url) return undefined;
  if (body.hls && canStreamHls()) {
    mp4ForPlaylist.set(body.hls, body.url);
    return body.hls;
  }
  return body.url;
}

const connected = new Set<string>();

/** Opens the connection to the video host as soon as a film's link is known, so the first bytes don't wait for it. */
function preconnect(url: string) {
  try {
    const origin = new URL(url).origin;
    if (connected.has(origin) || origin === window.location.origin) return;
    connected.add(origin);
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = origin;
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);
  } catch {
    // Not a URL; nothing to connect to.
  }
}

/** Asks the route once per film at a time. Failures are not kept, so the next call tries again. */
export function loadEarlyPreviewFilm(id: EarlyPreviewFilmId): Promise<string | undefined> {
  const url = freshUrl(id);
  if (url) return Promise.resolve(url);
  const pending = cache.get(id)?.pending;
  if (pending) return pending;
  const request = fetch(`/api/earlypreview/film/${id}`)
    .then(async (response) => (response.ok ? ((await response.json()) as { url?: string; hls?: string }) : null))
    .then((body) => {
      const url = body ? pick(body) : undefined;
      if (url) {
        cache.set(id, { at: Date.now(), url });
        preconnect(url);
        return url;
      }
      cache.delete(id);
      return undefined;
    })
    .catch(() => {
      cache.delete(id);
      return undefined;
    });
  cache.set(id, { at: 0, pending: request });
  return request;
}

/**
 * The playback URL for one film: its HLS playlist (auto quality) or the signed mp4. Pass it through `useAdaptiveSrc`
 * before it reaches a <video>. Empty until the route answers; instant when it already has.
 */
export function useEarlyPreviewFilm(id: EarlyPreviewFilmId) {
  const [src, setSrc] = useState<string | undefined>(() => freshUrl(id));

  useEffect(() => {
    let active = true;
    void loadEarlyPreviewFilm(id).then((url) => {
      if (active && url) setSrc(url);
    });
    return () => {
      active = false;
    };
  }, [id]);

  return src;
}
