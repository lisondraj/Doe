"use client";

import { useEffect } from "react";

import {
  DOEHEALTH_DESK_PAGE_BACKGROUND,
  DOEHEALTH_DESK_SURFACE,
} from "@/lib/doehealth/doehealth-desk-colors";

/** Brown blocks whose Safari rubber-band should read as desk brown (not cream). */
const BROWN_OVERFLOW_HIT =
  ".doehealth-desk-nav-wash-surface, .doehealth-desk-invite__panel";

function applyOverflowSurface(color: string) {
  const html = document.documentElement;
  html.style.backgroundColor = color;
  if (document.body) document.body.style.backgroundColor = color;
  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) themeColor.setAttribute("content", color);
}

/** iPhone /doehealthdesk — cream overscroll on light bands, brown on brown sections + footer. */
export function useDoeHealthDeskPhoneOverflowChrome(enabled: boolean) {
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const cream = DOEHEALTH_DESK_PAGE_BACKGROUND.toLowerCase();
    const brown = DOEHEALTH_DESK_SURFACE.toLowerCase();
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    const themeBefore = themeMeta?.getAttribute("content") ?? "";

    let raf = 0;
    let last = "";

    const pickSurface = () => {
      const vh = window.innerHeight;
      const scrollY = window.scrollY;
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - vh);
      const cx = Math.min(window.innerWidth - 1, Math.max(1, Math.round(window.innerWidth * 0.5)));

      let probeY = Math.round(vh * 0.5);
      if (scrollY < 12) probeY = 4;
      else if (scrollY > maxScroll - 12) probeY = Math.max(4, vh - 4);

      const hit = document.elementFromPoint(cx, probeY);
      const onBrown = hit?.closest(BROWN_OVERFLOW_HIT) != null;
      return onBrown ? brown : cream;
    };

    const update = () => {
      raf = 0;
      const next = pickSurface();
      if (next === last) return;
      last = next;
      applyOverflowSurface(next);
    };

    const schedule = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };

    applyOverflowSurface(cream);
    last = cream;
    schedule();

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.visualViewport?.addEventListener("resize", schedule);

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.visualViewport?.removeEventListener("resize", schedule);
      document.documentElement.style.backgroundColor = "";
      if (document.body) document.body.style.backgroundColor = "";
      if (themeMeta) {
        if (themeBefore) themeMeta.setAttribute("content", themeBefore);
        else themeMeta.removeAttribute("content");
      }
    };
  }, [enabled]);
}
