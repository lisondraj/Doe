"use client";

import { useLayoutEffect } from "react";

import { doeDtcTopOverflowSurface } from "@/lib/doedtc/doedtc-chrome";
import {
  applyPhoneLayoutViewportMeta,
  applyPhoneOverflowChrome,
} from "@/lib/doephone/phone-layout-viewport";
import { useDoePhoneLayoutViewport } from "@/lib/doephone/use-doe-phone-layout-viewport";
import { useDoePhoneStableViewport } from "@/lib/doephone/use-doe-phone-stable-viewport";

/** All /doedtc pages stay in iPhone view with cream (or landing white) top overflow. */
export function useDoeDtcPhonePageChrome() {
  useDoePhoneLayoutViewport();
  useDoePhoneStableViewport(true);

  useLayoutEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    html.setAttribute("data-doedtc-page", "true");
    html.setAttribute("data-doeforvc-always-phone", "true");
    html.removeAttribute("data-home-page");
    html.removeAttribute("data-about-page");
    html.removeAttribute("data-doeinsure-page");
    html.removeAttribute("data-doehome-page");
    html.removeAttribute("data-layout");
    html.removeAttribute("data-doephone-pinching");
    body.classList.remove("desktop-route");

    applyPhoneLayoutViewportMeta();
    applyPhoneOverflowChrome(doeDtcTopOverflowSurface(window.location.pathname));

    try {
      sessionStorage.removeItem(`doephone-app-viewport-lock:${location.hostname}`);
    } catch {
      /* ignore */
    }
  }, []);
}
