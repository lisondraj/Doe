"use client";

import { useLayoutEffect, useState } from "react";

import DoeIphoneSiteNav from "@/components/DoeIphoneSiteNav";
import { DoeHealthDeskAnnounceStrip } from "@/components/doehealth-desk/DoeHealthDeskAnnounceStrip";
import { useDoePhoneLayoutViewport } from "@/lib/doephone/use-doe-phone-layout-viewport";
import { DOEHEALTH_DESK_PAGE_BACKGROUND } from "@/lib/doehealth/doehealth-desk-colors";
import {
  DOEHEALTH_DESK_NAV_CENTER_LINKS,
  DOEHEALTH_DESK_NAV_PRIMARY_CTA,
} from "@/lib/doehealth/doehealth-desk-nav-copy";
import { useDoeHealthDeskBannerHeight } from "@/lib/doehealth/use-doehealth-desk-banner-height";
import { lora } from "@/lib/home/fonts";

/** PhoneHome hero strip — Doe, Join Waitlist, menu (no page sections). */
export function LegacyHomePhoneNavBar() {
  const [dismissed, setDismissed] = useState(false);
  useDoePhoneLayoutViewport();
  useDoeHealthDeskBannerHeight(dismissed);

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
      className={`doehealth-desk-chrome doehealth-desk-chrome--phone doephone-mobile-root relative z-0 min-h-0 overflow-x-hidden${dismissed ? " is-dismissed" : ""}`}
      style={{ backgroundColor: DOEHEALTH_DESK_PAGE_BACKGROUND }}
      data-doeforvc-view="iphone"
    >
      <DoeHealthDeskAnnounceStrip onDismiss={() => setDismissed(true)} />
      <DoeIphoneSiteNav
        pinchSafe
        homeHref="/doehealthdesk"
        showJoinCta={false}
        ctaLayout="single"
        navChromeTheme="light"
        logoLink
        brandFontClass={lora.className}
        navSheetItems={[...DOEHEALTH_DESK_NAV_CENTER_LINKS, DOEHEALTH_DESK_NAV_PRIMARY_CTA]}
      />
    </div>
  );
}
