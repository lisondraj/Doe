"use client";

import { useEffect, useLayoutEffect, useState } from "react";

import {
  DOEPHONE_DESKTOP_MEDIA_QUERY,
  resolveDoePhoneVariant,
  type DoePhoneVariant,
} from "@/lib/doephone/resolve-doe-phone-variant";
import { shouldLockDesignersTouchPhoneLayout } from "@/lib/designers/designers-page-context";

import { DoePhoneDesktopView } from "./DoePhoneDesktopView";
import { DoePhoneMobileView } from "./DoePhoneMobileView";

const PINCH_VIEWPORT =
  "width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover";

function applyPhoneDocumentAttrs() {
  const html = document.documentElement;
  const body = document.body;
  html.setAttribute("data-doeforvc-always-phone", "true");
  html.removeAttribute("data-layout");
  body.classList.remove("desktop-route");
}

function applyDesktopDocumentAttrs() {
  const html = document.documentElement;
  const body = document.body;
  html.removeAttribute("data-doeforvc-always-phone");
  html.setAttribute("data-layout", "desktop");
  body.classList.add("desktop-route");
}

function applyPhonePinchViewport() {
  const html = document.documentElement;
  const body = document.body;
  const meta = document.querySelector('meta[name="viewport"]');
  html.setAttribute("data-doephone-pinching", "true");
  body.classList.add("doephone-route");
  meta?.setAttribute("content", PINCH_VIEWPORT);
}

function clearPhonePinchViewport(prevViewport: string) {
  const html = document.documentElement;
  const body = document.body;
  const meta = document.querySelector('meta[name="viewport"]');
  html.removeAttribute("data-doephone-pinching");
  body.classList.remove("doephone-route");
  if (meta) {
    if (prevViewport) meta.setAttribute("content", prevViewport);
    else meta.removeAttribute("content");
  }
}

export function DoePhoneRouter() {
  /** Always boot phone on SSR + first client paint to avoid desktop/mobile hydration splits. */
  const [variant, setVariant] = useState<DoePhoneVariant>("phone");

  useLayoutEffect(() => {
    setVariant(resolveDoePhoneVariant());
  }, []);

  useEffect(() => {
    const sync = () => setVariant(resolveDoePhoneVariant());
    sync();

    if (shouldLockDesignersTouchPhoneLayout()) {
      return;
    }

    const mq = window.matchMedia(DOEPHONE_DESKTOP_MEDIA_QUERY);
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useLayoutEffect(() => {
    if (variant === "phone") {
      applyPhoneDocumentAttrs();
      applyPhonePinchViewport();
      return;
    }

    applyDesktopDocumentAttrs();
  }, [variant]);

  useEffect(() => {
    if (variant !== "phone") return;

    const meta = document.querySelector('meta[name="viewport"]');
    const prevViewport = meta?.getAttribute("content") ?? "";

    return () => {
      clearPhonePinchViewport(prevViewport);
      applyPhoneDocumentAttrs();
    };
  }, [variant]);

  return variant === "desktop" ? <DoePhoneDesktopView /> : <DoePhoneMobileView />;
}
