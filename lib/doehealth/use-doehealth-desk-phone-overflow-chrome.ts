"use client";

import { useEffect } from "react";

import {
  DOEHEALTH_DESK_PAGE_BACKGROUND,
  DOEHEALTH_DESK_SURFACE,
} from "@/lib/doehealth/doehealth-desk-colors";

/** Full-bleed brown bands (Genome, Sunday, footer) — the bottom rubber-band reads as desk brown under these. */
const BROWN_OVERFLOW_HIT = ".doehealth-desk-nav-wash-surface";

/** Same curve and duration as the nav wash (`DoeHealthDeskNavWash`). */
const OVERFLOW_FADE = "background-color 360ms cubic-bezier(0.33, 1, 0.68, 1)";

/**
 * iPhone /doehealthdesk — Safari's bottom overscroll follows the band at the bottom edge of the
 * viewport: brown over brown sections and the footer, cream elsewhere. `theme-color` is left alone
 * so the top chrome is unaffected.
 */
export function useDoeHealthDeskPhoneOverflowChrome(enabled: boolean) {
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const html = document.documentElement;
    const body = document.body;
    const cream = DOEHEALTH_DESK_PAGE_BACKGROUND.toLowerCase();
    const brown = DOEHEALTH_DESK_SURFACE.toLowerCase();

    let raf = 0;
    let last = "";

    const paint = (color: string) => {
      html.style.backgroundColor = color;
      body.style.backgroundColor = color;
    };

    const pickSurface = () => {
      const cx = Math.round(window.innerWidth / 2);
      const hit = document.elementFromPoint(cx, Math.max(0, window.innerHeight - 2));
      return hit?.closest(BROWN_OVERFLOW_HIT) != null ? brown : cream;
    };

    const update = () => {
      raf = 0;
      const next = pickSurface();
      if (next === last) return;
      last = next;
      paint(next);
    };

    const schedule = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };

    paint(cream);
    last = cream;
    html.style.transition = OVERFLOW_FADE;
    body.style.transition = OVERFLOW_FADE;
    schedule();

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.visualViewport?.addEventListener("resize", schedule);

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.visualViewport?.removeEventListener("resize", schedule);
      html.style.backgroundColor = "";
      body.style.backgroundColor = "";
      html.style.transition = "";
      body.style.transition = "";
    };
  }, [enabled]);
}
