"use client";

import { useEffect, useLayoutEffect, useState } from "react";

import {
  DOEINSURE_DESKTOP_MEDIA_QUERY,
  DOEINSURE_DEVICE_VIEWPORT,
  resolveDoeInsurePageVariant,
  type DoeInsurePageVariant,
} from "@/lib/doeinsure/doeinsure-page-variant";
import { applyPhoneLayoutViewportMeta, phoneLayoutViewportContent } from "@/lib/doephone/phone-layout-viewport";

export type DoeHomePageVariant = DoeInsurePageVariant;

function applyPhoneDocumentAttrs() {
  const html = document.documentElement;
  const body = document.body;
  html.setAttribute("data-doeinsure-page", "true");
  html.setAttribute("data-doehome-page", "true");
  html.removeAttribute("data-home-page");
  html.removeAttribute("data-about-page");
  html.setAttribute("data-doeforvc-always-phone", "true");
  html.removeAttribute("data-layout");
  body.classList.remove("desktop-route");
}

function applyDesktopDocumentAttrs() {
  const html = document.documentElement;
  const body = document.body;
  const meta = document.querySelector('meta[name="viewport"]');

  html.setAttribute("data-doeinsure-page", "true");
  html.setAttribute("data-doehome-page", "true");
  html.removeAttribute("data-home-page");
  html.removeAttribute("data-about-page");
  html.removeAttribute("data-doeforvc-always-phone");
  html.removeAttribute("data-doephone-pinching");
  html.setAttribute("data-layout", "desktop");
  body.classList.add("desktop-route");
  html.style.removeProperty("--app-vw");
  html.style.removeProperty("--app-vh");
  html.style.removeProperty("--app-vv-offset-top");
  meta?.setAttribute("content", DOEINSURE_DEVICE_VIEWPORT);
}

export function useDoeHomePageVariant() {
  const [variant, setVariant] = useState<DoeHomePageVariant>("phone");
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    setVariant(resolveDoeInsurePageVariant());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return undefined;
    const sync = () => setVariant(resolveDoeInsurePageVariant());
    sync();
    const mq = window.matchMedia(DOEINSURE_DESKTOP_MEDIA_QUERY);
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [ready]);

  useLayoutEffect(() => {
    if (!ready) return;
    if (variant === "desktop") {
      applyDesktopDocumentAttrs();
      return;
    }
    applyPhoneDocumentAttrs();
    applyPhoneLayoutViewportMeta();
  }, [ready, variant]);

  useEffect(() => {
    if (!ready || variant !== "phone") return undefined;
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
  }, [ready, variant]);

  return { variant, ready };
}
