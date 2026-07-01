"use client";

import { shouldLockDesignersTouchPhoneLayout } from "@/lib/designers/designers-page-context";

import { vbIsVisualViewportPinching } from "@/lib/home/vertical-bento";
import { useLayoutEffect } from "react";

const SETTLE_MS = 220;

function viewportStorageKey(): string {
  if (typeof window === "undefined") return "doephone-app-viewport-lock";
  return `doephone-app-viewport-lock:${window.location.hostname}`;
}

type ViewportLock = { width: number; height: number };

function readStoredLock(): ViewportLock | null {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(viewportStorageKey());
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ViewportLock;
    if (typeof parsed.width === "number" && typeof parsed.height === "number") {
      return parsed;
    }
  } catch {
    /* ignore */
  }
  return null;
}

function storeLock(lock: ViewportLock) {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.setItem(viewportStorageKey(), JSON.stringify(lock));
  } catch {
    /* ignore */
  }
}

function clearStoredLock() {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.removeItem(viewportStorageKey());
  } catch {
    /* ignore */
  }
}

/**
 * Locks `--app-vh` / `--app-vw` so iOS Safari URL-bar show/hide, rubber-band
 * overscroll, and tab background/foreground do not reflow /doephone.
 * Height is committed once per session (restored from sessionStorage) and only
 * resets on orientation change.
 */
export function useDoePhoneStableViewport(enabled = true) {
  useLayoutEffect(() => {
    if (!enabled) return;

    const stable: ViewportLock = { width: 0, height: 0 };
    let scrollActive = false;
    let scrollQuietTimer: number | null = null;

    const apply = (width: number, height: number) => {
      document.documentElement.style.setProperty("--app-vw", `${width}px`);
      document.documentElement.style.setProperty("--app-vh", `${height}px`);
    };

    const read = (): ViewportLock => {
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

    const reapplyStable = () => {
      if (stable.height <= 0) return;
      apply(stable.width, stable.height);
    };

    const commit = (next: ViewportLock, force = false) => {
      if (!force && scrollActive) return;
      if (document.hidden && !force) return;

      if (force || stable.height === 0) {
        stable.width = next.width;
        stable.height = next.height;
        apply(stable.width, stable.height);
        storeLock(stable);
        return;
      }

      if (next.width !== stable.width) {
        stable.width = next.width;
        apply(stable.width, stable.height);
        storeLock(stable);
      }
    };

    const measure = (force = false) => {
      if (!force && document.hidden) return;
      commit(read(), force);
    };

    const markScrollActive = () => {
      scrollActive = true;
      if (scrollQuietTimer !== null) window.clearTimeout(scrollQuietTimer);
      scrollQuietTimer = window.setTimeout(() => {
        scrollQuietTimer = null;
        scrollActive = false;
      }, SETTLE_MS);
    };

    const onOrientation = () => {
      clearStoredLock();
      stable.height = 0;
      stable.width = 0;
      measure(true);
    };

    const onViewportResize = () => {
      if (document.hidden || vbIsVisualViewportPinching()) return;
      measure(false);
    };

    const onVisibilityChange = () => {
      if (document.hidden) return;
      reapplyStable();
    };

    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) reapplyStable();
    };

    if (shouldLockDesignersTouchPhoneLayout()) {
      clearStoredLock();
      measure(true);
    } else {
      const stored = readStoredLock();
      if (stored) {
        const current = read();
        const widthDrift = stored.width > current.width * 1.12;
        const heightDrift = stored.height > current.height * 1.12;

        if (widthDrift || heightDrift) {
          clearStoredLock();
          measure(true);
        } else {
          stable.width = stored.width;
          stable.height = stored.height;
          apply(stable.width, stable.height);
        }
      } else {
        measure(true);
      }
    }

    window.addEventListener("orientationchange", onOrientation);
    window.addEventListener("resize", onViewportResize);
    window.visualViewport?.addEventListener("resize", onViewportResize);
    window.visualViewport?.addEventListener("scroll", markScrollActive);
    window.addEventListener("scroll", markScrollActive, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pageshow", onPageShow);
    window.addEventListener("focus", reapplyStable);

    return () => {
      window.removeEventListener("orientationchange", onOrientation);
      window.removeEventListener("resize", onViewportResize);
      window.visualViewport?.removeEventListener("resize", onViewportResize);
      window.visualViewport?.removeEventListener("scroll", markScrollActive);
      window.removeEventListener("scroll", markScrollActive);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("focus", reapplyStable);
      if (scrollQuietTimer !== null) window.clearTimeout(scrollQuietTimer);
    };
  }, [enabled]);
}
