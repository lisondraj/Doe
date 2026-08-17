"use client";

import { useEffect, useLayoutEffect, useState } from "react";

import { applyPhoneLayoutViewportMeta, phoneLayoutViewportContent } from "@/lib/doephone/phone-layout-viewport";
import {
  DOEPHONE_DESKTOP_MEDIA_QUERY,
  readBootstrappedDoePhoneVariant,
  resolveDoePhoneVariant,
  type DoePhoneVariant,
} from "@/lib/doephone/resolve-doe-phone-variant";

export type DoeInsurePageVariant = DoePhoneVariant;

function applyPhoneDocumentAttrs() {
  const html = document.documentElement;
  const body = document.body;
  html.setAttribute("data-doeinsure-page", "true");
  html.removeAttribute("data-home-page");
  html.removeAttribute("data-about-page");
  html.setAttribute("data-doeforvc-always-phone", "true");
  html.removeAttribute("data-layout");
  body.classList.remove("desktop-route");
}

function applyDesktopDocumentAttrs() {
  const html = document.documentElement;
  const body = document.body;
  html.setAttribute("data-doeinsure-page", "true");
  html.removeAttribute("data-home-page");
  html.removeAttribute("data-about-page");
  html.removeAttribute("data-doeforvc-always-phone");
  html.removeAttribute("data-doephone-pinching");
  html.setAttribute("data-layout", "desktop");
  body.classList.add("desktop-route");
}

function resolveVariant(): DoeInsurePageVariant {
  return resolveDoePhoneVariant();
}

export function useDoeInsurePageVariant(): DoeInsurePageVariant {
  const [variant, setVariant] = useState<DoeInsurePageVariant>(() => {
    if (typeof window === "undefined") return "phone";
    return readBootstrappedDoePhoneVariant();
  });

  useLayoutEffect(() => {
    setVariant(readBootstrappedDoePhoneVariant());
  }, []);

  useEffect(() => {
    const sync = () => setVariant(resolveVariant());
    sync();
    const mq = window.matchMedia(DOEPHONE_DESKTOP_MEDIA_QUERY);
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useLayoutEffect(() => {
    if (variant === "desktop") {
      applyDesktopDocumentAttrs();
      return;
    }
    applyPhoneDocumentAttrs();
    applyPhoneLayoutViewportMeta();
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
