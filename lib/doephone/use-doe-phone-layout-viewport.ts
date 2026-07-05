"use client";

import { useLayoutEffect } from "react";

import { applyPhoneLayoutViewportMeta } from "@/lib/doephone/phone-layout-viewport";

/** Keeps phone-layout vmin/rem scaling aligned with a real iPhone when layout width is inflated. */
export function useDoePhoneLayoutViewport() {
  useLayoutEffect(() => {
    applyPhoneLayoutViewportMeta();
    const raf = requestAnimationFrame(() => applyPhoneLayoutViewportMeta());

    const sync = () => applyPhoneLayoutViewportMeta();
    const syncAfterOrientation = () => {
      sync();
      requestAnimationFrame(sync);
      window.setTimeout(sync, 120);
      window.setTimeout(sync, 280);
    };

    window.addEventListener("resize", sync);
    window.visualViewport?.addEventListener("resize", sync);
    window.addEventListener("orientationchange", syncAfterOrientation);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", sync);
      window.visualViewport?.removeEventListener("resize", sync);
      window.removeEventListener("orientationchange", syncAfterOrientation);
    };
  }, []);
}
