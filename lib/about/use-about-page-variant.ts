"use client";

import { useEffect, useLayoutEffect, useState } from "react";

import { shouldLockAboutTouchPhoneLayout } from "@/lib/about/about-page-context";
import { applyPhoneLayoutViewportMeta } from "@/lib/doephone/phone-layout-viewport";
import { DOEPHONE_DESKTOP_MEDIA_QUERY } from "@/lib/doephone/resolve-doe-phone-variant";

export type AboutPageVariant = "phone" | "desktop";

export function resolveAboutPageVariant(): AboutPageVariant {
  if (typeof window === "undefined") return "phone";
  if (shouldLockAboutTouchPhoneLayout()) return "phone";
  if (window.matchMedia(DOEPHONE_DESKTOP_MEDIA_QUERY).matches) return "desktop";
  return "phone";
}

/** /about — always boot phone on SSR/first paint, then resolve before paint on client. */
export function useAboutPageVariant() {
  const [variant, setVariant] = useState<AboutPageVariant>("phone");

  useLayoutEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-about-page", "true");
    html.removeAttribute("data-home-page");
    setVariant(resolveAboutPageVariant());
    return () => html.removeAttribute("data-about-page");
  }, []);

  useEffect(() => {
    const sync = () => setVariant(resolveAboutPageVariant());
    sync();
    if (shouldLockAboutTouchPhoneLayout()) return;
    const mq = window.matchMedia(DOEPHONE_DESKTOP_MEDIA_QUERY);
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useLayoutEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (variant === "desktop") {
      html.removeAttribute("data-doeforvc-always-phone");
      html.setAttribute("data-layout", "desktop");
      body.classList.add("desktop-route");
      return;
    }

    html.setAttribute("data-doeforvc-always-phone", "true");
    html.removeAttribute("data-layout");
    body.classList.remove("desktop-route");
    applyPhoneLayoutViewportMeta();
  }, [variant]);

  useEffect(() => {
    if (variant !== "phone") return;

    const html = document.documentElement;
    const meta = document.querySelector('meta[name="viewport"]');
    const prevViewport = meta?.getAttribute("content") ?? "";
    const pinchViewport =
      "width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover";

    html.setAttribute("data-doephone-pinching", "true");
    meta?.setAttribute("content", pinchViewport);

    return () => {
      html.removeAttribute("data-doephone-pinching");
      if (meta) {
        if (prevViewport) meta.setAttribute("content", prevViewport);
        else meta.removeAttribute("content");
      }
    };
  }, [variant]);

  return variant;
}
