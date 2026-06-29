"use client";

import { useEffect, useLayoutEffect, useState } from "react";

import {
  DOEPHONE_DESKTOP_MEDIA_QUERY,
  resolveDoePhoneVariant,
  type DoePhoneVariant,
} from "@/lib/doephone/resolve-doe-phone-variant";

import { DoePhoneDesktopView } from "./DoePhoneDesktopView";
import { DoePhoneMobileView } from "./DoePhoneMobileView";

const PINCH_VIEWPORT =
  "width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover";

export function DoePhoneRouter({
  initialVariant,
}: {
  initialVariant: DoePhoneVariant;
}) {
  const [variant, setVariant] = useState<DoePhoneVariant>(initialVariant);

  useLayoutEffect(() => {
    setVariant(resolveDoePhoneVariant());
  }, []);

  useEffect(() => {
    if (variant !== "phone") return;

    const html = document.documentElement;
    const body = document.body;
    const meta = document.querySelector('meta[name="viewport"]');
    const prevViewport = meta?.getAttribute("content") ?? "";

    html.setAttribute("data-doephone-pinching", "true");
    body.classList.add("doephone-route");
    meta?.setAttribute("content", PINCH_VIEWPORT);

    return () => {
      html.removeAttribute("data-doephone-pinching");
      body.classList.remove("doephone-route");
      if (meta) {
        if (prevViewport) meta.setAttribute("content", prevViewport);
        else meta.removeAttribute("content");
      }
    };
  }, [variant]);

  useEffect(() => {
    const mq = window.matchMedia(DOEPHONE_DESKTOP_MEDIA_QUERY);
    const sync = () => setVariant(resolveDoePhoneVariant());
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    if (variant === "desktop") {
      html.removeAttribute("data-doeforvc-always-phone");
      html.setAttribute("data-layout", "desktop");
      body.classList.add("desktop-route");
    } else {
      html.setAttribute("data-doeforvc-always-phone", "true");
      html.removeAttribute("data-layout");
      body.classList.remove("desktop-route");
    }

    return () => {
      html.setAttribute("data-doeforvc-always-phone", "true");
      html.removeAttribute("data-layout");
      body.classList.remove("desktop-route");
    };
  }, [variant]);

  return variant === "desktop" ? <DoePhoneDesktopView /> : <DoePhoneMobileView />;
}
