"use client";

import { useLayoutEffect } from "react";

import { applyPhoneLayoutViewportMeta, applyPhoneOverflowChrome } from "@/lib/doephone/phone-layout-viewport";
import { useDoePhoneLayoutViewport } from "@/lib/doephone/use-doe-phone-layout-viewport";
import { useDoePhoneStableViewport } from "@/lib/doephone/use-doe-phone-stable-viewport";
import { ABOUT_BROWN_OVERFLOW_SURFACE } from "@/lib/home/doe-page-colors";

/** iPhone /about-style pages — viewport, overflow chrome, and data-about-page before hero shaders mount. */
export function useAboutStylePhonePageChrome() {
  useDoePhoneLayoutViewport();
  useDoePhoneStableViewport(true);

  useLayoutEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-about-page", "true");
    html.removeAttribute("data-home-page");
    html.setAttribute("data-doeforvc-always-phone", "true");
    html.removeAttribute("data-layout");
    applyPhoneLayoutViewportMeta();
    applyPhoneOverflowChrome(ABOUT_BROWN_OVERFLOW_SURFACE);

    try {
      sessionStorage.removeItem(`doephone-app-viewport-lock:${location.hostname}`);
    } catch {
      /* ignore */
    }

    return () => {
      html.removeAttribute("data-about-page");
      html.removeAttribute("data-doeforvc-always-phone");
    };
  }, []);
}
