"use client";

import { useLayoutEffect, useState } from "react";

import DoeIphoneSiteNav from "@/components/DoeIphoneSiteNav";
import { DoeFall26DeskAnnounceStrip } from "@/components/doe-fall26-desk/DoeFall26DeskAnnounceStrip";
import { useDoePhoneLayoutViewport } from "@/lib/doephone/use-doe-phone-layout-viewport";
import {
  DOE_FALL26_DESK_NAV_CENTER_LINKS,
  DOE_FALL26_DESK_NAV_PRIMARY_CTA,
} from "@/lib/doefall26/doefall26-desk-nav-copy";
import { useDoeFall26DeskBannerHeight } from "@/lib/doefall26/use-doefall26-desk-banner-height";
import { lora } from "@/lib/home/fonts";

/** PhoneHome hero strip — Doe, Join Waitlist, menu (no page sections). */
export function DoeFall26DeskPhoneNavBar() {
  const [dismissed, setDismissed] = useState(false);
  useDoePhoneLayoutViewport();
  useDoeFall26DeskBannerHeight(dismissed);

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
      className={`doefall26-desk-chrome doefall26-desk-chrome--phone doephone-mobile-root relative min-h-0${dismissed ? " is-dismissed" : ""}`}
      data-doeforvc-view="iphone"
    >
      <DoeFall26DeskAnnounceStrip compact onDismiss={() => setDismissed(true)} />
      <DoeIphoneSiteNav
        pinchSafe
        menuScrimInsetTop="var(--fall26-phone-nav-clearance)"
        homeHref="/doefall26"
        showJoinCta={false}
        ctaLayout="single"
        navChromeTheme="light"
        logoLink
        brandFontClass={lora.className}
        navSheetItems={[...DOE_FALL26_DESK_NAV_CENTER_LINKS, DOE_FALL26_DESK_NAV_PRIMARY_CTA]}
      />
    </div>
  );
}
