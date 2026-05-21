"use client";

import { useEffect, useState } from "react";
import { DesktopHome } from "./DesktopHome";
import { PhoneHome } from "./PhoneHome";

type Variant = "phone" | "desktop";
const QUERY = "(min-width: 1024px)";

export function HomeRouter({ initialVariant }: { initialVariant: Variant }) {
  const [variant, setVariant] = useState<Variant>(initialVariant);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const sync = () => setVariant(mq.matches ? "desktop" : "phone");
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  /** Tailwind `iphone-page:` variant + globals.css body.desktop-route overflow. */
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

    /** Root layout SSR default — avoids carrying desktop attrs onto /features, etc. */
    return () => {
      html.setAttribute("data-doeforvc-always-phone", "true");
      html.removeAttribute("data-layout");
      body.classList.remove("desktop-route");
    };
  }, [variant]);

  return variant === "desktop" ? <DesktopHome /> : <PhoneHome />;
}
