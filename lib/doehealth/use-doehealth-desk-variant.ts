"use client";

import { useEffect, useState } from "react";

export type DoeHealthDeskVariant = "phone" | "desktop";

const QUERY = "(min-width: 1024px)";

/** Desk pages — desktop vs iPhone layout, synced to the viewport and the shared html/body flags. */
export function useDoeHealthDeskVariant(initialVariant: DoeHealthDeskVariant) {
  const [variant, setVariant] = useState<DoeHealthDeskVariant>(initialVariant);

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
      html.removeAttribute("data-doephone-pinching");
      html.setAttribute("data-layout", "desktop");
      body.classList.add("desktop-route");
      body.classList.remove("doephone-route");
    } else {
      html.setAttribute("data-doeforvc-always-phone", "true");
      html.removeAttribute("data-layout");
      body.classList.remove("desktop-route");
    }

    return () => {
      html.setAttribute("data-doeforvc-always-phone", "true");
      html.removeAttribute("data-layout");
      html.removeAttribute("data-doephone-pinching");
      body.classList.remove("desktop-route", "doephone-route");
    };
  }, [variant]);

  return variant;
}
