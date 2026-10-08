"use client";

import { useLayoutEffect, useState } from "react";

import DoeIphoneSiteNav from "@/components/DoeIphoneSiteNav";
import { DoeCareFall26DeskAnnounceStrip } from "@/components/doe-carefall26-desk/DoeCareFall26DeskAnnounceStrip";
import { useDoePhoneLayoutViewport } from "@/lib/doephone/use-doe-phone-layout-viewport";
import {
  DOECAREFALL26_DESK_NAV_CENTER_LINKS,
  DOECAREFALL26_DESK_NAV_PRIMARY_CTA,
} from "@/lib/doecarefall26/doecarefall26-desk-nav-copy";
import { useDoeCareFall26DeskBannerHeight } from "@/lib/doecarefall26/use-doecarefall26-desk-banner-height";
import { lora } from "@/lib/home/fonts";

/** PhoneHome hero strip — Doe, Join Waitlist, menu (no page sections). */
export function DoeCareFall26DeskPhoneNavBar() {
  const [dismissed, setDismissed] = useState(false);
  useDoePhoneLayoutViewport();
  useDoeCareFall26DeskBannerHeight(dismissed);

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
      className={`doecarefall26-desk-chrome doecarefall26-desk-chrome--phone doephone-mobile-root relative min-h-0${dismissed ? " is-dismissed" : ""}`}
      data-doeforvc-view="iphone"
    >
      <DoeCareFall26DeskAnnounceStrip compact onDismiss={() => setDismissed(true)} />
      <DoeIphoneSiteNav
        pinchSafe
        menuScrimInsetTop="var(--carefall26-phone-nav-clearance)"
        homeHref="/doecarefall26"
        showMenu={false}
        showJoinCta={false}
        ctaLayout="single"
        navChromeTheme="light"
        logoLink
        brandFontClass={lora.className}
        navSheetItems={[...DOECAREFALL26_DESK_NAV_CENTER_LINKS, DOECAREFALL26_DESK_NAV_PRIMARY_CTA]}
      />
    </div>
  );
}
