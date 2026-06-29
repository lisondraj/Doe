"use client";

import { useLayoutEffect } from "react";

import {
  DESIGNERS_PHONE_VMIN_VAR,
  computeDesignersVminPx,
  isDesignersLayoutWide,
} from "@/lib/designers/designers-phone-vmin";

/** Pins designers phone vertical spacing to iPhone reference when layout width is inflated. */
export function useDesignersPhoneVmin() {
  useLayoutEffect(() => {
    const html = document.documentElement;

    const sync = () => {
      const layoutW = html.clientWidth;
      const vmin = computeDesignersVminPx(layoutW);
      html.style.setProperty(DESIGNERS_PHONE_VMIN_VAR, `${vmin}px`);
      html.toggleAttribute("data-designers-layout-wide", isDesignersLayoutWide(layoutW));
    };

    sync();
    const raf = requestAnimationFrame(sync);

    window.addEventListener("resize", sync);
    window.visualViewport?.addEventListener("resize", sync);
    window.addEventListener("orientationchange", sync);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", sync);
      window.visualViewport?.removeEventListener("resize", sync);
      window.removeEventListener("orientationchange", sync);
      html.style.removeProperty(DESIGNERS_PHONE_VMIN_VAR);
      html.removeAttribute("data-designers-layout-wide");
    };
  }, []);
}
