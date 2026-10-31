"use client";

import { type RefObject, useEffect, useState } from "react";

import "@/lib/earlypreview/earlypreview-cinema.css";
import { FILM_PARK_EVENT, FILM_RESUME_EVENT } from "@/lib/earlypreview/use-film-warm-up";

/** How long the page takes to fade to black around a playing film, and back. Matches earlypreview-cinema.css. */
const CINEMA_FADE_MS = 600;
/** The room a film's caption needs above it, in px: the title's two lines and the link, with a gap under them. */
const CAPTION_ROOM_PX = 140;

/** What cinema mode puts on the black above a playing film: its title, one entry per line, and its article link. */
export type CinemaCaption = { title: string[]; label?: string; href?: string };

type CinemaOptions = {
  /** Off, the hook does nothing. */
  enabled?: boolean;
  /** iPhone: the playing film is scrolled to the middle of the screen and the page is locked until cinema ends. */
  phone?: boolean;
  /** Centre and lock on every screen size, not just iPhone (/indexconvert). Defaults to `phone`. */
  lock?: boolean;
};

/** Keys that scroll a page; blocked while cinema has it locked, unless they're aimed at the film's own controls. */
const SCROLL_KEYS = new Set(["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "]);

/** The root itself when it is the thing that scrolls (a fixed page with its own scroll box), else null: the window. */
function scrollBox(root: HTMLElement): HTMLElement | null {
  const overflow = window.getComputedStyle(root).overflowY;
  return overflow === "auto" || overflow === "scroll" ? root : null;
}

/**
 * Cinema mode for every film under `rootRef` (/earlypreview, and the articles it links to at /preview-<slug> and
 * /news): while one plays and is at least half on screen, nothing else competes with it. Every other film is paused and, if nobody has played it yet, unloaded (a plain file's download is cut off, a stream
 * stops fetching), and the rest of the page fades to black and is then hidden, so it is no longer drawn. Pausing, the
 * film ending, scrolling it off screen or a tap on the black brings everything back, and the other films load again.
 *
 * On an iPhone (`phone`) the film is also centred on the screen and the page can't be scrolled until cinema ends. The
 * returned caption is the playing film's title and article link, for the page to show on the black.
 *
 * The playing film's frame is marked `data-cinema-film` and every element between it and the page `data-cinema-path`;
 * the CSS (earlypreview-cinema.css) hides whatever is beside that path and turns the path itself black.
 */
export function useFilmCinema(rootRef: RefObject<HTMLElement>, { enabled = true, phone = false, lock }: CinemaOptions = {}) {
  const locks = lock ?? phone;
  const [caption, setCaption] = useState<CinemaCaption | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !enabled) return undefined;
    root.setAttribute("data-cinema-root", "");
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

    /**
     * Centres the film and stops the page scrolling until cinema ends: touches off the film's frame are cancelled (its
     * own drag can only go sideways), and so are the wheel and the scroll keys. Works whether the window scrolls or the
     * root is its own scroll box (a fixed page like /indexconvert), which `overflow: hidden` on <html> can't reach.
     */
    let unlock: (() => void) | null = null;
    const lockPage = (video: HTMLVideoElement) => {
      const frame = video.closest("figure") ?? video.parentElement ?? video;
      const rect = frame.getBoundingClientRect();
      const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const box = scrollBox(root);
      if (box) {
        const boxRect = box.getBoundingClientRect();
        const top = box.scrollTop + rect.top - boxRect.top + rect.height / 2 - box.clientHeight / 2;
        box.scrollTo({ top: Math.max(0, top), behavior: calm ? "auto" : "smooth" });
      } else {
        const top = window.scrollY + rect.top + rect.height / 2 - window.innerHeight / 2;
        window.scrollTo({ top: Math.max(0, top), behavior: calm ? "auto" : "smooth" });
      }
      const onFilm = (target: EventTarget | null) => target instanceof Element && !!target.closest("[data-cinema-film]");
      const stopTouch = (event: TouchEvent) => {
        if (!onFilm(event.target)) event.preventDefault();
      };
      const stopWheel = (event: WheelEvent) => {
        // A sideways wheel on the film is left alone; anything that would move the page up or down is not.
        if (!(onFilm(event.target) && Math.abs(event.deltaX) > Math.abs(event.deltaY))) event.preventDefault();
      };
      const stopKeys = (event: KeyboardEvent) => {
        if (SCROLL_KEYS.has(event.key) && !onFilm(document.activeElement)) event.preventDefault();
      };
      document.addEventListener("touchmove", stopTouch, { passive: false });
      document.addEventListener("wheel", stopWheel, { passive: false });
      document.addEventListener("keydown", stopKeys);
      // The window's own scrollbar goes; a scroll box keeps its scrollbar (no layout jump) and is held by the listeners.
      const html = document.documentElement;
      const was = html.style.overflow;
      if (!box) html.style.overflow = "hidden";
      root.setAttribute("data-cinema-locked", "");
      unlock = () => {
        document.removeEventListener("touchmove", stopTouch);
        document.removeEventListener("wheel", stopWheel);
        document.removeEventListener("keydown", stopKeys);
        if (!box) html.style.overflow = was;
        root.removeAttribute("data-cinema-locked");
        unlock = null;
      };
    };

    /** Desktop: a film too near the top of the screen for its caption is moved down a little, by scrolling the page. */
    const makeRoom = (video: HTMLVideoElement) => {
      const frame = video.closest("figure") ?? video.parentElement ?? video;
      const short = frame.getBoundingClientRect().top - CAPTION_ROOM_PX;
      if (short < -1 && frame.getBoundingClientRect().height + CAPTION_ROOM_PX <= window.innerHeight) {
        window.scrollBy({ top: short, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      }
    };

    const readCaption = (video: HTMLVideoElement): CinemaCaption | null => {
      const frame = video.closest("figure") ?? video.parentElement;
      const card = frame?.matches("[data-cinema-title]") ? (frame as HTMLElement) : frame?.querySelector<HTMLElement>("[data-cinema-title]");
      if (!card?.dataset.cinemaTitle) return null;
      return {
        title: card.dataset.cinemaTitle.split("|"),
        label: card.dataset.cinemaLabel,
        href: card.dataset.cinemaHref,
      };
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
        const next = readCaption(on);
        setCaption(next);
        if (locks) lockPage(on);
        else if (next) makeRoom(on);
        park(on);
        return;
      }
      active = null;
      unlock?.();
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
      if (!active || !(event.target instanceof Element)) return;
      if (event.target.closest("[data-cinema-film], [data-cinema-keep]")) return;
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
      unlock?.();
      unpark();
      root.removeAttribute("data-cinema");
      root.removeAttribute("data-cinema-leaving");
      root.removeAttribute("data-cinema-root");
      clearPath();
    };
  }, [rootRef, enabled, locks]);

  return caption;
}
