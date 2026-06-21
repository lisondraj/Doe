"use client";

import { useLayoutEffect } from "react";

const SHRINK_DEFER_PX = 120;
const SETTLE_MS = 220;

/**
 * Locks `--app-vh` / `--app-vw` so iOS Safari URL-bar show/hide does not reflow /doephone.
 * Height only shrinks after scroll settles or when the shrink exceeds a threshold.
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
      const width = vv && vv.width > 0 ? Math.round(vv.width) : innerW;
      const height = Math.round(Math.max(innerH, vv?.height ?? 0));
      return {
        width: Math.max(width, 280),
        height: Math.max(height, 320),
      };
    };

    const commit = (next: { width: number; height: number }, force = false) => {
      if (force || stable.height === 0) {
        stable.width = next.width;
        stable.height = next.height;
        apply(stable.width, stable.height);
        return;
      }

      if (next.width !== stable.width) {
        stable.width = next.width;
        stable.height = Math.max(stable.height, next.height);
        apply(stable.width, stable.height);
        return;
      }

      if (next.height >= stable.height) {
        stable.height = next.height;
        apply(stable.width, stable.height);
        return;
      }

      const shrinkPx = stable.height - next.height;
      if (scrollActive || shrinkPx < SHRINK_DEFER_PX) return;

      stable.height = next.height;
      apply(stable.width, stable.height);
    };

    const measure = (force = false) => {
      commit(read(), force);
    };

    const onScroll = () => {
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

    const onViewportResize = () => measure(false);

    measure(true);
    window.addEventListener("orientationchange", onOrientation);
    window.addEventListener("resize", onViewportResize);
    window.visualViewport?.addEventListener("resize", onViewportResize);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("orientationchange", onOrientation);
      window.removeEventListener("resize", onViewportResize);
      window.visualViewport?.removeEventListener("resize", onViewportResize);
      window.removeEventListener("scroll", onScroll);
      if (settleTimer !== null) window.clearTimeout(settleTimer);
      if (scrollQuietTimer !== null) window.clearTimeout(scrollQuietTimer);
    };
  }, []);
}
