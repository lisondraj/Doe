"use client";

import { type ReactNode, useLayoutEffect, useState } from "react";

import DoeIphoneSiteNav from "@/components/DoeIphoneSiteNav";
import { DoeHealthDesk2AnnounceStrip } from "@/components/doehealth-desk2/DoeHealthDesk2AnnounceStrip";
import { useDoePhoneLayoutViewport } from "@/lib/doephone/use-doe-phone-layout-viewport";
import {
  DOEHEALTH_DESK2_NAV_PRIMARY_CTA,
  doehealthDesk2NavPages,
} from "@/lib/doehealthdesk2/doehealthdesk2-nav-copy";
import { useDoeHealthDesk2BannerHeight } from "@/lib/doehealthdesk2/use-doehealthdesk2-banner-height";
import { lora } from "@/lib/home/fonts";

/** PhoneHome hero strip — Doe, Join Waitlist, menu (no page sections). */
export function DoeHealthDesk2PhoneNavBar({
  logoHref = "/doehealthdesk",
  sectionHrefBase = "",
  primaryCta = DOEHEALTH_DESK2_NAV_PRIMARY_CTA,
  belowBar,
  menuMailTo,
}: {
  /** Replace the menu button with a mail icon that opens this address (used on /earlypreview). */
  menuMailTo?: string;
  /** Where the "Doe" mark goes. Defaults to the legacy desk home. */
  logoHref?: string;
  /** Prefix for `#section` links when the sections live on another page. */
  sectionHrefBase?: string;
  /** The last row of the expanded menu: a button-styled link. */
  primaryCta?: { readonly label: string; readonly href: string };
  /** Content under the bar that shares its surface and blur, so the two read as one bar. */
  belowBar?: ReactNode;
} = {}) {
  const [dismissed, setDismissed] = useState(false);
  useDoePhoneLayoutViewport();
  useDoeHealthDesk2BannerHeight(dismissed);

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
      className={`doehealth-desk2-chrome doehealth-desk2-chrome--phone doephone-mobile-root relative min-h-0${dismissed ? " is-dismissed" : ""}`}
      data-doeforvc-view="iphone"
    >
      <DoeHealthDesk2AnnounceStrip compact onDismiss={() => setDismissed(true)} />
      <DoeIphoneSiteNav
        pinchSafe
        menuScrimInsetTop="var(--desk2-phone-nav-clearance)"
        homeHref={logoHref}
        showJoinCta={false}
        ctaLayout="single"
        navChromeTheme="light"
        logoLink
        brandFontClass={lora.className}
        navSheetItems={[...doehealthDesk2NavPages(sectionHrefBase), primaryCta]}
        navExtra={belowBar}
        menuMailTo={menuMailTo}
      />
    </div>
  );
}
