"use client";

import { useEffect } from "react";

const PINCH_SCALE_THRESHOLD = 1.005;
const SETTLE_MS = 350;
const RESTORE_MS = 250;

const DEFAULT_VIEWPORT_CONTENT =
  "width=device-width, initial-scale=1, viewport-fit=cover";
const LOCK_VIEWPORT_CONTENT =
  "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover";

/**
 * After a pinch gesture settles on iOS Safari, briefly lock the viewport meta tag so
 * visual scale snaps back to 1, then restore pinch capability.
 */
export function useVisualViewportPinchSnapBack(): void {
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const meta = document.querySelector<HTMLMetaElement>('meta[name="viewport"]');
    if (!meta) return;

    const defaultContent =
      meta.getAttribute("content") ?? DEFAULT_VIEWPORT_CONTENT;

    let settleTimer: number | null = null;
    let restoreTimer: number | null = null;

    const snapBack = () => {
      meta.setAttribute("content", LOCK_VIEWPORT_CONTENT);
      if (restoreTimer !== null) window.clearTimeout(restoreTimer);
      restoreTimer = window.setTimeout(() => {
        restoreTimer = null;
        meta.setAttribute("content", defaultContent);
      }, RESTORE_MS);
    };

    const onVVResize = () => {
      if (vv.scale <= PINCH_SCALE_THRESHOLD) return;
      if (settleTimer !== null) window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        settleTimer = null;
        if (vv.scale > PINCH_SCALE_THRESHOLD) snapBack();
      }, SETTLE_MS);
    };

    vv.addEventListener("resize", onVVResize);
    return () => {
      vv.removeEventListener("resize", onVVResize);
      if (settleTimer !== null) window.clearTimeout(settleTimer);
      if (restoreTimer !== null) window.clearTimeout(restoreTimer);
      meta.setAttribute("content", defaultContent);
    };
  }, []);
}
