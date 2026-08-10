"use client";

import { useEffect, useLayoutEffect, useState } from "react";

import { isTouchPrimaryDevice, shouldLockAboutTouchPhoneLayout } from "@/lib/about/about-page-context";
import { applyPhoneLayoutViewportMeta, phoneLayoutViewportContent } from "@/lib/doephone/phone-layout-viewport";
import {
  DOEPHONE_DESKTOP_MEDIA_QUERY,
  readBootstrappedDoePhoneVariant,
} from "@/lib/doephone/resolve-doe-phone-variant";

export type AboutPageVariant = "phone" | "desktop";

export function resolveAboutPageVariant(): AboutPageVariant {
  if (typeof window === "undefined") return "phone";
  if (shouldLockAboutTouchPhoneLayout()) return "phone";
  if (isTouchPrimaryDevice()) return "phone";
  if (window.matchMedia(DOEPHONE_DESKTOP_MEDIA_QUERY).matches) return "desktop";
  return "phone";
}

function applyAboutPhoneDocumentAttrs() {
  const html = document.documentElement;
  const body = document.body;
  html.setAttribute("data-about-page", "true");
  html.removeAttribute("data-home-page");
  html.setAttribute("data-doeforvc-always-phone", "true");
  html.removeAttribute("data-layout");
  body.classList.remove("desktop-route");
}

function applyAboutDesktopDocumentAttrs() {
  const html = document.documentElement;
  const body = document.body;
  html.setAttribute("data-about-page", "true");
  html.removeAttribute("data-home-page");
  html.removeAttribute("data-doeforvc-always-phone");
  html.removeAttribute("data-doephone-pinching");
  html.setAttribute("data-layout", "desktop");
  body.classList.add("desktop-route");
}

/** /about-style pages — read bootstrap before paint, then keep document attrs in sync. */
export function useAboutPageVariant(): AboutPageVariant | null {
  /**
   * Always start at null (matches SSR) — reading window here would make the client's
   * first hydration render diverge from the server-rendered null, which trips a full
   * hydration-failure remount (see React hydration mismatch docs) on every load.
   */
  const [variant, setVariant] = useState<AboutPageVariant | null>(null);

  useLayoutEffect(() => {
    setVariant(readBootstrappedDoePhoneVariant());
  }, []);

  useEffect(() => {
    if (variant === null) return;

    const sync = () => setVariant(resolveAboutPageVariant());
    sync();

    if (shouldLockAboutTouchPhoneLayout() || isTouchPrimaryDevice()) return;

    const mq = window.matchMedia(DOEPHONE_DESKTOP_MEDIA_QUERY);
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [variant]);

  useLayoutEffect(() => {
    if (variant === null) return;

    if (variant === "desktop") {
      applyAboutDesktopDocumentAttrs();
      return;
    }

    applyAboutPhoneDocumentAttrs();
    applyPhoneLayoutViewportMeta();
  }, [variant]);

  useEffect(() => {
    if (variant !== "desktop") return;
    applyAboutDesktopDocumentAttrs();
  }, [variant]);

  useEffect(() => {
    if (variant !== "phone") return undefined;

    const html = document.documentElement;
    const meta = document.querySelector('meta[name="viewport"]');
    const prevViewport = meta?.getAttribute("content") ?? "";

    html.setAttribute("data-doephone-pinching", "true");
    meta?.setAttribute("content", phoneLayoutViewportContent());

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
