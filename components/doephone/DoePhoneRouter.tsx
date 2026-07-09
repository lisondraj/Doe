"use client";

import { useEffect, useLayoutEffect, useState } from "react";

import {
  DOEPHONE_DESKTOP_MEDIA_QUERY,
  readBootstrappedDoePhoneVariant,
  resolveDoePhoneVariant,
  type DoePhoneVariant,
} from "@/lib/doephone/resolve-doe-phone-variant";
import { shouldLockDoeTouchPhoneLayout } from "@/lib/doephone/doe-touch-phone-layout";
import { shouldLockDesignersTouchPhoneLayout } from "@/lib/designers/designers-page-context";

import {
  applyPhoneLayoutViewportMeta,
  phoneLayoutViewportContent,
} from "@/lib/doephone/phone-layout-viewport";

import { DoePhoneDesktopView } from "./DoePhoneDesktopView";
import { DoePhoneMobileView } from "./DoePhoneMobileView";
import { DoeHomeTopBanner } from "./DoeHomeTopBanner";

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
  html.removeAttribute("data-doephone-pinching");
  html.setAttribute("data-layout", "desktop");
  html.style.overflow = "";
  body.classList.remove("doephone-route");
  body.classList.add("desktop-route");
  body.style.overflow = "";
}

function applyPhonePinchViewport() {
  const html = document.documentElement;
  const body = document.body;
  const meta = document.querySelector('meta[name="viewport"]');
  html.setAttribute("data-doephone-pinching", "true");
  body.classList.add("doephone-route");
  meta?.setAttribute("content", phoneLayoutViewportContent());
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
  /** SSR stays phone; client reads bootstrap `data-layout` to avoid phone→desktop remount flash. */
  const [variant, setVariant] = useState<DoePhoneVariant>(readBootstrappedDoePhoneVariant);

  useLayoutEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-home-page", "true");
    html.removeAttribute("data-about-page");
    html.removeAttribute("data-route-desktop");
    return () => {
      html.removeAttribute("data-home-page");
    };
  }, []);

  useLayoutEffect(() => {
    setVariant(readBootstrappedDoePhoneVariant());
  }, []);

  useEffect(() => {
    const sync = () => setVariant(resolveDoePhoneVariant());
    sync();

    if (shouldLockDesignersTouchPhoneLayout() || shouldLockDoeTouchPhoneLayout()) {
      return;
    }

    const mq = window.matchMedia(DOEPHONE_DESKTOP_MEDIA_QUERY);
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useLayoutEffect(() => {
    if (variant === "phone") {
      applyPhoneDocumentAttrs();
      applyPhoneLayoutViewportMeta();
      applyPhonePinchViewport();
      return;
    }

    const meta = document.querySelector('meta[name="viewport"]');
    const prevViewport = meta?.getAttribute("content") ?? "";
    clearPhonePinchViewport(prevViewport);
    applyDesktopDocumentAttrs();
  }, [variant]);

  /** Re-apply after subpage layout cleanups that run in the same navigation tick. */
  useEffect(() => {
    if (variant !== "desktop") return;
    applyDesktopDocumentAttrs();
  }, [variant]);

  useEffect(() => {
    if (variant !== "phone") return undefined;

    const meta = document.querySelector('meta[name="viewport"]');
    const prevViewport = meta?.getAttribute("content") ?? "";

    return () => {
      clearPhonePinchViewport(prevViewport);
    };
  }, [variant]);

  if (variant === "desktop") {
    return <DoePhoneDesktopView />;
  }

  return (
    <>
      <DoeHomeTopBanner />
      <DoePhoneMobileView />
    </>
  );
}
