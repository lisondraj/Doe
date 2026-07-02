"use client";

import { useLayoutEffect, type ReactNode } from "react";

import DoeIphoneSiteNav from "@/components/DoeIphoneSiteNav";
import { useDoePhoneLayoutViewport } from "@/lib/doephone/use-doe-phone-layout-viewport";
import { useDoePhoneStableViewport } from "@/lib/doephone/use-doe-phone-stable-viewport";
import { PROTO_INVEST_PATH } from "@/lib/site-domains";
import { PROTO_FONT_CLASS, PROTO_NAV_LOGO_FONT_CLASS } from "@/lib/proto/proto-font";

/** Shared /proto chrome — dark nav, phone viewport, stable scroll height. */
export function ProtoRouteShell({
  children,
  homeHref = "/proto",
  investorsHref = PROTO_INVEST_PATH,
}: {
  children: ReactNode;
  homeHref?: string;
  investorsHref?: string;
}) {
  useDoePhoneLayoutViewport();
  useDoePhoneStableViewport(true);

  useLayoutEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    html.setAttribute("data-doeforvc-always-phone", "true");
    html.removeAttribute("data-layout");
    html.setAttribute("data-doephone-pinching", "true");
    html.setAttribute("data-proto-page", "true");
    body.classList.add("doephone-route", "proto-route");

    try {
      sessionStorage.removeItem(`doephone-app-viewport-lock:${location.hostname}`);
    } catch {
      /* ignore */
    }

    return () => {
      html.removeAttribute("data-doephone-pinching");
      html.removeAttribute("data-proto-page");
      body.classList.remove("doephone-route", "proto-route");
    };
  }, []);

  return (
    <div
      className={`doephone-mobile-root relative z-0 min-h-[var(--app-vh,100lvh)] overflow-x-hidden bg-[#121819] ${PROTO_FONT_CLASS}`}
      suppressHydrationWarning
      data-doeforvc-view="iphone"
    >
      <DoeIphoneSiteNav
        pinchSafe
        showMenu={false}
        ctaLayout="main-home"
        showJoinCta={false}
        brandName="Proto"
        brandFontClass={PROTO_NAV_LOGO_FONT_CLASS}
        homeHref={homeHref}
        investorsHref={investorsHref}
        navChromeTheme="dark"
        logoLink
        navActionLinksEnabled
      />
      {children}
    </div>
  );
}
