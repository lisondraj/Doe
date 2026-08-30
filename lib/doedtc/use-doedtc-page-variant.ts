"use client";

import { useEffect, useLayoutEffect, useState } from "react";

import {
  DOEDTC_DESKTOP_MEDIA_QUERY,
  DOEDTC_DEVICE_VIEWPORT,
  resolveDoeDtcPageVariant,
  type DoeDtcPageVariant,
} from "@/lib/doedtc/doedtc-page-variant";
import { applyPhoneLayoutViewportMeta } from "@/lib/doephone/phone-layout-viewport";

export function useDoeDtcPageVariant() {
  const [variant, setVariant] = useState<DoeDtcPageVariant>("phone");
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    setVariant(resolveDoeDtcPageVariant());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return undefined;

    const sync = () => setVariant(resolveDoeDtcPageVariant());
    sync();
    const mq = window.matchMedia(DOEDTC_DESKTOP_MEDIA_QUERY);
    mq.addEventListener("change", sync);
    window.addEventListener("resize", sync);
    return () => {
      mq.removeEventListener("change", sync);
      window.removeEventListener("resize", sync);
    };
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    const html = document.documentElement;
    const body = document.body;
    html.setAttribute("data-doedtc-page", "true");

    if (variant === "desktop") {
      html.removeAttribute("data-doeforvc-always-phone");
      html.setAttribute("data-layout", "desktop");
      body.classList.add("desktop-route");
      const meta = document.querySelector('meta[name="viewport"]');
      meta?.setAttribute("content", DOEDTC_DEVICE_VIEWPORT);
      return;
    }

    html.setAttribute("data-doeforvc-always-phone", "true");
    html.removeAttribute("data-layout");
    body.classList.remove("desktop-route");
    applyPhoneLayoutViewportMeta();
  }, [ready, variant]);

  return { variant, ready };
}
