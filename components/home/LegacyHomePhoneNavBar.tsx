"use client";

import { useLayoutEffect } from "react";

import DoeIphoneSiteNav from "@/components/DoeIphoneSiteNav";
import { useDoePhoneLayoutViewport } from "@/lib/doephone/use-doe-phone-layout-viewport";
import { DOEHEALTH_DESK_PAGE_BACKGROUND } from "@/lib/doehealth/doehealth-desk-colors";

/** PhoneHome hero strip — Doe, Join Waitlist, menu (no page sections). */
export function LegacyHomePhoneNavBar() {
  useDoePhoneLayoutViewport();

  useLayoutEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    html.setAttribute("data-doeforvc-always-phone", "true");
    html.removeAttribute("data-layout");
    html.setAttribute("data-doephone-pinching", "true");
    body.classList.add("doephone-route");

    return () => {
      html.removeAttribute("data-doephone-pinching");
      body.classList.remove("doephone-route");
    };
  }, []);

  return (
    <div
      className="doephone-mobile-root relative z-0 min-h-0 overflow-x-hidden"
      style={{ backgroundColor: DOEHEALTH_DESK_PAGE_BACKGROUND }}
      data-doeforvc-view="iphone"
    >
      <DoeIphoneSiteNav showJoinCta ctaLayout="single" navChromeTheme="light" logoLink />
    </div>
  );
}
