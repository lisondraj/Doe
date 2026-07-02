"use client";

import { useEffect, useLayoutEffect, useState } from "react";

import { DoePhoneMobileView } from "@/components/doephone/DoePhoneMobileView";
import { ProtoDesktopHome } from "@/components/proto/ProtoDesktopHome";
import {
  applyPhoneLayoutViewportMeta,
  phoneLayoutViewportContent,
} from "@/lib/doephone/phone-layout-viewport";
import {
  DOEPHONE_DESKTOP_MEDIA_QUERY,
  resolveDoePhoneVariant,
  type DoePhoneVariant,
} from "@/lib/doephone/resolve-doe-phone-variant";
import { shouldLockDesignersTouchPhoneLayout } from "@/lib/designers/designers-page-context";

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

/** /proto — phone or desktop layout based on viewport, matching Doe home routing. */
export function ProtoRouter() {
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
    const html = document.documentElement;
    const body = document.body;
    html.setAttribute("data-proto-page", "true");
    body.classList.add("proto-route");

    if (variant === "phone") {
      applyPhoneDocumentAttrs();
      applyPhoneLayoutViewportMeta();
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

  return variant === "desktop" ? <ProtoDesktopHome /> : <DoePhoneMobileView variant="proto" />;
}
