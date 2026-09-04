"use client";

import { useEffect, useLayoutEffect, useState } from "react";

import { applyDoeDtcOverflowChrome } from "@/lib/doedtc/doedtc-chrome";
import {
  DOEDTC_DESKTOP_MEDIA_QUERY,
  DOEDTC_DEVICE_VIEWPORT,
  resolveDoeDtcPageVariant,
  type DoeDtcPageVariant,
} from "@/lib/doedtc/doedtc-page-variant";
import { applyPhoneLayoutViewportMeta } from "@/lib/doephone/phone-layout-viewport";

type UseDoeDtcPageVariantOptions = {
  profile?: boolean;
  brandFooter?: boolean;
  forcePhone?: boolean;
};

export function useDoeDtcPageVariant(options: UseDoeDtcPageVariantOptions = {}) {
  const { forcePhone = false } = options;
  const [variant, setVariant] = useState<DoeDtcPageVariant>("phone");
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    setVariant(forcePhone ? "phone" : resolveDoeDtcPageVariant());
    setReady(true);
  }, [forcePhone]);

  useEffect(() => {
    if (!ready || forcePhone) return undefined;

    const sync = () => setVariant(resolveDoeDtcPageVariant());
    sync();
    const mq = window.matchMedia(DOEDTC_DESKTOP_MEDIA_QUERY);
    mq.addEventListener("change", sync);
    window.addEventListener("resize", sync);
    return () => {
      mq.removeEventListener("change", sync);
      window.removeEventListener("resize", sync);
    };
  }, [forcePhone, ready]);

  useLayoutEffect(() => {
    if (!ready) return;
    const resolvedVariant = forcePhone ? "phone" : variant;
    const html = document.documentElement;
    const body = document.body;
    html.setAttribute("data-doedtc-page", "true");
    html.setAttribute("data-doedtc-variant", resolvedVariant);

    if (resolvedVariant === "desktop") {
      html.removeAttribute("data-doeforvc-always-phone");
      html.setAttribute("data-layout", "desktop");
      body.classList.add("desktop-route");
      const meta = document.querySelector('meta[name="viewport"]');
      meta?.setAttribute("content", DOEDTC_DEVICE_VIEWPORT);
      applyDoeDtcOverflowChrome(window.location.pathname);
      return;
    }

    html.setAttribute("data-doeforvc-always-phone", "true");
    html.removeAttribute("data-layout");
    body.classList.remove("desktop-route");
    applyPhoneLayoutViewportMeta();
    applyDoeDtcOverflowChrome(window.location.pathname);
  }, [forcePhone, ready, variant]);

  return { variant: forcePhone ? "phone" : variant, ready };
}
