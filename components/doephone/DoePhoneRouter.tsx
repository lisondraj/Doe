"use client";

import { useEffect, useLayoutEffect, useState } from "react";

import {
  DOEPHONE_DESKTOP_MEDIA_QUERY,
  resolveDoePhoneVariant,
  type DoePhoneVariant,
} from "@/lib/doephone/resolve-doe-phone-variant";
import { isDesignersHost } from "@/lib/site-domains";

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

function applyDesignersDocumentAttrs(enabled: boolean) {
  document.documentElement.toggleAttribute("data-doe-designers-site", enabled);
}

export function DoePhoneRouter({
  initialVariant,
  staticNav = false,
}: {
  initialVariant: DoePhoneVariant;
  staticNav?: boolean;
}) {
  const [variant, setVariant] = useState<DoePhoneVariant>(initialVariant);
  const [resolvedStaticNav, setResolvedStaticNav] = useState(staticNav);

  useLayoutEffect(() => {
    const designers =
      staticNav || isDesignersHost(window.location.hostname);
    setResolvedStaticNav(designers);
    applyDesignersDocumentAttrs(designers);
    setVariant(resolveDoePhoneVariant());
  }, [staticNav]);

  useEffect(() => {
    const mq = window.matchMedia(DOEPHONE_DESKTOP_MEDIA_QUERY);
    const sync = () => setVariant(resolveDoePhoneVariant());
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useLayoutEffect(() => {
    if (variant === "phone") {
      applyPhoneDocumentAttrs();
      const html = document.documentElement;
      const body = document.body;
      const meta = document.querySelector('meta[name="viewport"]');
      html.setAttribute("data-doephone-pinching", "true");
      body.classList.add("doephone-route");
      meta?.setAttribute("content", PINCH_VIEWPORT);
      return;
    }

    applyDesktopDocumentAttrs();
    document.documentElement.removeAttribute("data-doephone-pinching");
    document.body.classList.remove("doephone-route");
  }, [variant]);

  useEffect(() => {
    return () => {
      applyDesignersDocumentAttrs(false);
      applyPhoneDocumentAttrs();
    };
  }, []);

  return variant === "desktop" ? (
    <DoePhoneDesktopView staticNav={resolvedStaticNav} />
  ) : (
    <DoePhoneMobileView staticNav={resolvedStaticNav} />
  );
}
