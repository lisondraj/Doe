"use client";

import { type RefObject, useEffect } from "react";

import { FILM_PARK_EVENT, FILM_RESUME_EVENT } from "@/lib/earlypreview/use-film-warm-up";

/** How long the page takes to fade to black around a playing film, and back. Matches earlypreview-films.css. */
const CINEMA_FADE_MS = 600;

/**
 * Cinema mode for every film under `rootRef`: while one plays and is at least half on screen, nothing else competes with
 * it. Every other film is paused and, if nobody has played it yet, unloaded (a plain file's download is cut off, a stream
 * stops fetching), and the rest of the page fades to black and is then hidden, so it is no longer drawn. Pausing, the
 * film ending, scrolling it off screen or a tap on the black brings everything back, and the other films load again.
 *
 * The playing film's frame is marked `data-cinema-film` and every element between it and the page `data-cinema-path`;
 * the CSS (earlypreview-films.css) hides whatever is beside that path and turns the path itself black.
 */
export function useFilmCinema(rootRef: RefObject<HTMLElement>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    let film: HTMLVideoElement | null = null;
    let visible = false;
    let active: HTMLVideoElement | null = null;
    let leaving = 0;
    /** Films unloaded for cinema, with the source to give back. */
    const parked = new Map<HTMLVideoElement, string | null>();

    const clearPath = () => {
      root.querySelectorAll("[data-cinema-path], [data-cinema-film]").forEach((el) => {
        el.removeAttribute("data-cinema-path");
        el.removeAttribute("data-cinema-film");
      });
    };

    const markPath = (video: HTMLVideoElement) => {
      clearPath();
      const frame = video.closest("figure") ?? video.parentElement ?? video;
      frame.setAttribute("data-cinema-film", "");
      for (let el = frame.parentElement; el && el !== root; el = el.parentElement) el.setAttribute("data-cinema-path", "");
    };

    const park = (keep: HTMLVideoElement) => {
      root.querySelectorAll("video").forEach((video) => {
        if (video === keep || parked.has(video)) return;
        video.pause();
        video.dispatchEvent(new Event(FILM_PARK_EVENT));
        // A film nobody has played yet is unloaded, its download cut off. One already played is only paused: reloading
        // it would start it over, and its player would play it again on its own. A stream played through hls.js (a
        // blob: source) stops fetching on the event above instead.
        const src = video.getAttribute("src");
        const unload = !!src && !src.startsWith("blob:") && video.played.length === 0;
        if (unload) {
          video.removeAttribute("src");
          video.load();
        }
        parked.set(video, unload ? src : null);
      });
    };

    const unpark = () => {
      parked.forEach((src, video) => {
        if (src && !video.getAttribute("src")) {
          video.setAttribute("src", src);
          video.load();
        }
        video.dispatchEvent(new Event(FILM_RESUME_EVENT));
      });
      parked.clear();
    };

    const update = () => {
      const on = film && visible ? film : null;
      if (on === active) return;
      window.clearTimeout(leaving);
      root.removeAttribute("data-cinema-leaving");
      if (on) {
        active = on;
        markPath(on);
        root.setAttribute("data-cinema", "");
        park(on);
        return;
      }
      active = null;
      root.removeAttribute("data-cinema");
      root.setAttribute("data-cinema-leaving", "");
      unpark();
      leaving = window.setTimeout(() => {
        root.removeAttribute("data-cinema-leaving");
        clearPath();
      }, CINEMA_FADE_MS);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.target === film) visible = entry.intersectionRatio >= 0.5;
        update();
      },
      { threshold: [0, 0.5, 1] },
    );

    // Media events don't bubble, so they are caught on the way down.
    const onPlaying = (event: Event) => {
      const video = event.target;
      if (!(video instanceof HTMLVideoElement) || parked.has(video)) return;
      if (film && film !== video) observer.unobserve(film);
      film = video;
      visible = false;
      observer.observe(video);
    };
    const onStop = (event: Event) => {
      if (event.target !== film || !film) return;
      observer.unobserve(film);
      film = null;
      visible = false;
      update();
    };

    // A tap on the black pauses the film, which ends cinema. The film's own frame, with its controls, keeps its taps.
    const onTap = (event: MouseEvent) => {
      if (!active || !(event.target instanceof Element) || event.target.closest("[data-cinema-film]")) return;
      active.pause();
    };

    root.addEventListener("click", onTap);
    root.addEventListener("playing", onPlaying, true);
    root.addEventListener("pause", onStop, true);
    root.addEventListener("ended", onStop, true);
    root.addEventListener("emptied", onStop, true);
    return () => {
      observer.disconnect();
      root.removeEventListener("click", onTap);
      root.removeEventListener("playing", onPlaying, true);
      root.removeEventListener("pause", onStop, true);
      root.removeEventListener("ended", onStop, true);
      root.removeEventListener("emptied", onStop, true);
      window.clearTimeout(leaving);
      unpark();
      root.removeAttribute("data-cinema");
      root.removeAttribute("data-cinema-leaving");
      clearPath();
    };
  }, [rootRef]);
}
