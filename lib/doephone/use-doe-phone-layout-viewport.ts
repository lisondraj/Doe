"use client";

import { useLayoutEffect } from "react";

import { applyPhoneLayoutViewportMeta } from "@/lib/doephone/phone-layout-viewport";

/** Keeps phone-layout vmin/rem scaling aligned with a real iPhone when layout width is inflated. */
export function useDoePhoneLayoutViewport() {
  useLayoutEffect(() => {
    applyPhoneLayoutViewportMeta();
    const raf = requestAnimationFrame(() => applyPhoneLayoutViewportMeta());

    const sync = () => applyPhoneLayoutViewportMeta();
    window.addEventListener("resize", sync);
    window.visualViewport?.addEventListener("resize", sync);
    window.addEventListener("orientationchange", sync);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", sync);
      window.visualViewport?.removeEventListener("resize", sync);
      window.removeEventListener("orientationchange", sync);
    };
  }, []);
}
