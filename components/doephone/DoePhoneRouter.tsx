"use client";

import { useEffect, useState } from "react";

import { DoePhoneDesktopView } from "./DoePhoneDesktopView";
import { DoePhoneMobileView } from "./DoePhoneMobileView";

type Variant = "phone" | "desktop";
const QUERY = "(min-width: 1024px)";

export function DoePhoneRouter({ initialVariant }: { initialVariant: Variant }) {
  const [variant, setVariant] = useState<Variant>(initialVariant);

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

  return variant === "desktop" ? <DoePhoneDesktopView /> : <DoePhoneMobileView />;
}
