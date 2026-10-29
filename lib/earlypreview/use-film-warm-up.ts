"use client";

import { type RefObject, useEffect } from "react";

/** Fired on a film's <video> when it should start filling its buffer ahead of a press of play. */
export const FILM_WARM_EVENT = "earlypreview-film-warm";
/** Fired on a film's <video> when another film takes the screen (see `useFilmCinema`): stop fetching. */
export const FILM_PARK_EVENT = "earlypreview-film-park";
/** Fired when that film is done: fetch again. */
export const FILM_RESUME_EVENT = "earlypreview-film-resume";

/** Whether this connection can afford to fetch a film nobody has pressed play on yet. */
function canWarm(): boolean {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (!connection) return true;
  return !connection.saveData && !/^(slow-2g|2g|3g)$/.test(connection.effectiveType ?? "");
}

/**
 * Warms a film just before it is needed: once its frame is within `margin` of the screen, its <video> is told to load
 * ahead (`preload="auto"` for an mp4, a few seconds of buffer for an HLS stream, see `useAdaptiveSrc`), so the first
 * press of play starts from a buffer instead of from nothing. It only ever fetches the first seconds, never the whole
 * film, and not at all on data saver or a slow connection. `ready` is false until the film has a source.
 */
export function useFilmWarmUp(
  videoRef: RefObject<HTMLVideoElement>,
  frameRef: RefObject<HTMLElement>,
  ready: boolean,
  margin = "60% 0px",
) {
  useEffect(() => {
    const frame = frameRef.current;
    if (!ready || !frame || typeof IntersectionObserver === "undefined" || !canWarm()) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        const video = videoRef.current;
        if (!video) return;
        if (video.preload !== "auto") video.preload = "auto";
        video.dispatchEvent(new Event(FILM_WARM_EVENT));
      },
      { rootMargin: margin },
    );
    observer.observe(frame);
    return () => observer.disconnect();
  }, [videoRef, frameRef, ready, margin]);
}
