"use client";

import { useLayoutEffect } from "react";

const PROP = "--desk2-phone-screen-h";

/**
 * iPhone /doehealthdesk2 — Safari draws the page under its floating toolbar and the home indicator,
 * but `innerHeight`, `lvh` and `dvh` all stop above that strip, so a section sized by any of them ends
 * short of the bottom of the screen. `screen` is the one measure that reaches the glass, so full-bleed
 * sections size to it (in portrait or landscape) and simply run a little past the visible area.
 * Touch devices only: on a narrow desktop window `screen` is the monitor, so innerHeight is used.
 */
export function useDoeHealthDesk2PhoneScreenHeight(enabled: boolean) {
  useLayoutEffect(() => {
    if (!enabled) return;
    const html = document.documentElement;
    const touch = window.matchMedia("(pointer: coarse)");

    const apply = () => {
      const inner = window.innerHeight;
      let height = inner;
      if (touch.matches) {
        const { width, height: tall } = window.screen;
        const portrait = window.innerWidth <= window.innerHeight;
        height = Math.max(inner, portrait ? Math.max(width, tall) : Math.min(width, tall));
      }
      html.style.setProperty(PROP, `${Math.round(height)}px`);
    };

    apply();
    window.addEventListener("orientationchange", apply);
    window.addEventListener("resize", apply);
    return () => {
      window.removeEventListener("orientationchange", apply);
      window.removeEventListener("resize", apply);
      html.style.removeProperty(PROP);
    };
  }, [enabled]);
}
