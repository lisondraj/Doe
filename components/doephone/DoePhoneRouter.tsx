"use client";

import { useEffect, useState } from "react";

import { DoePhoneDesktopView } from "./DoePhoneDesktopView";
import { DoePhoneMobileView } from "./DoePhoneMobileView";

type Variant = "phone" | "desktop";
const QUERY = "(min-width: 1024px)";

export function DoePhoneRouter({
  initialVariant,
  staticNav = false,
}: {
  initialVariant: Variant;
  staticNav?: boolean;
}) {
  const [variant, setVariant] = useState<Variant>(initialVariant);

  useEffect(() => {
    if (variant !== "phone") return;

    const html = document.documentElement;
    const body = document.body;
    const meta = document.querySelector('meta[name="viewport"]');
    const prevViewport = meta?.getAttribute("content") ?? "";
    const pinchViewport =
      "width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover";

    html.setAttribute("data-doephone-pinching", "true");
    body.classList.add("doephone-route");
    meta?.setAttribute("content", pinchViewport);

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
    const mq = window.matchMedia(QUERY);
    const sync = () => setVariant(mq.matches ? "desktop" : "phone");
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

  return variant === "desktop" ? (
    <DoePhoneDesktopView staticNav={staticNav} />
  ) : (
    <DoePhoneMobileView staticNav={staticNav} />
  );
}
