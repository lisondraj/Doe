"use client";

import { useLayoutEffect } from "react";

import { applyPhoneLayoutViewportMeta } from "@/lib/doephone/phone-layout-viewport";

const RESIZE_DEBOUNCE_MS = 140;

/** Keeps phone-layout vmin/rem scaling aligned with a real iPhone when layout width is inflated. */
export function useDoePhoneLayoutViewport() {
  useLayoutEffect(() => {
    applyPhoneLayoutViewportMeta();
    const raf = requestAnimationFrame(() => applyPhoneLayoutViewportMeta());

    let debounceTimer: number | undefined;
    const sync = () => {
      if (debounceTimer !== undefined) window.clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(() => {
        debounceTimer = undefined;
        applyPhoneLayoutViewportMeta();
      }, RESIZE_DEBOUNCE_MS);
    };

    const syncAfterOrientation = () => {
      applyPhoneLayoutViewportMeta();
      requestAnimationFrame(() => applyPhoneLayoutViewportMeta());
      window.setTimeout(() => applyPhoneLayoutViewportMeta(), 120);
      window.setTimeout(() => applyPhoneLayoutViewportMeta(), 280);
    };

    window.addEventListener("resize", sync);
    window.visualViewport?.addEventListener("resize", sync);
    window.addEventListener("orientationchange", syncAfterOrientation);

    return () => {
      cancelAnimationFrame(raf);
      if (debounceTimer !== undefined) window.clearTimeout(debounceTimer);
      window.removeEventListener("resize", sync);
      window.visualViewport?.removeEventListener("resize", sync);
      window.removeEventListener("orientationchange", syncAfterOrientation);
    };
  }, []);
}
