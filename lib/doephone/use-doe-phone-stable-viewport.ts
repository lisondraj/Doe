"use client";

import { vbIsVisualViewportPinching } from "@/lib/home/vertical-bento";
import { useLayoutEffect } from "react";

const SHRINK_DEFER_PX = 120;
const SETTLE_MS = 220;

/**
 * Locks `--app-vh` / `--app-vw` so iOS Safari URL-bar show/hide and rubber-band
 * overscroll do not reflow /doephone. Height never grows after the first commit
 * except on orientation change; it only shrinks after scroll settles.
 */
export function useDoePhoneStableViewport() {
  useLayoutEffect(() => {
    const stable = { width: 0, height: 0 };
    let scrollActive = false;
    let settleTimer: number | null = null;
    let scrollQuietTimer: number | null = null;

    const apply = (width: number, height: number) => {
      document.documentElement.style.setProperty("--app-vw", `${width}px`);
      document.documentElement.style.setProperty("--app-vh", `${height}px`);
    };

    const read = () => {
      const vv = window.visualViewport;
      const innerW = window.innerWidth;
      const innerH = window.innerHeight;

      if (vbIsVisualViewportPinching()) {
        return {
          width: Math.max(innerW, 280),
          height: Math.max(innerH, 320),
        };
      }

      const width =
        vv && vv.width > 0 && vv.width <= innerW + 16 ? Math.round(vv.width) : innerW;
      const height =
        vv && vv.height >= 240 && vv.height <= innerH + 16
          ? Math.round(vv.height)
          : innerH;

      return {
        width: Math.max(width, 280),
        height: Math.max(height, 320),
      };
    };

    const commit = (next: { width: number; height: number }, force = false) => {
      if (!force && scrollActive) return;

      if (force || stable.height === 0) {
        stable.width = next.width;
        stable.height = next.height;
        apply(stable.width, stable.height);
        return;
      }

      if (next.width !== stable.width) {
        stable.width = next.width;
        apply(stable.width, stable.height);
        return;
      }

      if (next.height >= stable.height) return;

      const shrinkPx = stable.height - next.height;
      if (scrollActive || shrinkPx < SHRINK_DEFER_PX) return;

      stable.height = next.height;
      apply(stable.width, stable.height);
    };

    const measure = (force = false) => {
      commit(read(), force);
    };

    const markScrollActive = () => {
      scrollActive = true;
      if (scrollQuietTimer !== null) window.clearTimeout(scrollQuietTimer);
      scrollQuietTimer = window.setTimeout(() => {
        scrollQuietTimer = null;
        scrollActive = false;
        measure(false);
      }, SETTLE_MS);
    };

    const onOrientation = () => {
      stable.height = 0;
      stable.width = 0;
      if (settleTimer !== null) {
        window.clearTimeout(settleTimer);
        settleTimer = null;
      }
      measure(true);
    };

    const onViewportResize = () => {
      if (vbIsVisualViewportPinching()) return;
      measure(false);
    };

    measure(true);
    window.addEventListener("orientationchange", onOrientation);
    window.addEventListener("resize", onViewportResize);
    window.visualViewport?.addEventListener("resize", onViewportResize);
    window.visualViewport?.addEventListener("scroll", markScrollActive);
    window.addEventListener("scroll", markScrollActive, { passive: true });

    return () => {
      window.removeEventListener("orientationchange", onOrientation);
      window.removeEventListener("resize", onViewportResize);
      window.visualViewport?.removeEventListener("resize", onViewportResize);
      window.visualViewport?.removeEventListener("scroll", markScrollActive);
      window.removeEventListener("scroll", markScrollActive);
      if (settleTimer !== null) window.clearTimeout(settleTimer);
      if (scrollQuietTimer !== null) window.clearTimeout(scrollQuietTimer);
    };
  }, []);
}
