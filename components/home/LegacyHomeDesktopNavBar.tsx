"use client";

import { useState } from "react";
import Link from "next/link";

import { DoeHealthDeskAnnounceStrip } from "@/components/doehealth-desk/DoeHealthDeskAnnounceStrip";
import { DesktopNavActionRow } from "@/components/nav/DesktopNavActionRow";
import { DOEPHONE_DESKTOP_PAGE_INSET_X } from "@/lib/doephone/section-styles";
import {
  DOEHEALTH_DESK_NAV_CENTER_LINKS,
  DOEHEALTH_DESK_NAV_PRIMARY_CTA,
} from "@/lib/doehealth/doehealth-desk-nav-copy";
import { useDoeHealthDeskBannerHeight } from "@/lib/doehealth/use-doehealth-desk-banner-height";
import { inter, lora } from "@/lib/home/fonts";

/** DesktopHome top bar — cream chrome, no hero scroll coupling. */
export function LegacyHomeDesktopNavBar({
  logoLink = true,
  navActionLinksEnabled = true,
}: {
  logoLink?: boolean;
  navActionLinksEnabled?: boolean;
} = {}) {
  const heroWaitlistBg = "var(--desk-nav-button-bg, #281910)";
  const heroWaitlistFg = "var(--desk-nav-button-fg, #fffcf1)";
  const heroWaitlistShadow = "none";
  const heroCtaDivider = "var(--desk-nav-button-line, rgba(255, 252, 241, 0.22))";
  const [dismissed, setDismissed] = useState(false);
  useDoeHealthDeskBannerHeight(dismissed);

  return (
    <div className={`doehealth-desk-chrome${dismissed ? " is-dismissed" : ""}`}>
      <DoeHealthDeskAnnounceStrip onDismiss={() => setDismissed(true)} />
    <nav className="desktop-home-nav" aria-label="Site">
      <div
        className={`doehealth-desk-nav__bar relative z-10 py-6 ${DOEPHONE_DESKTOP_PAGE_INSET_X} ${inter.className}`}
      >
        {logoLink ? (
          <Link
            href="/"
            className={`doehealth-desk-nav__mark text-4xl font-normal no-underline ${lora.className}`}
          >
            Doe
          </Link>
        ) : (
          <span className={`doehealth-desk-nav__mark text-4xl font-normal ${lora.className}`}>
            Doe
          </span>
        )}

        <nav className="doehealth-desk-nav__links" aria-label="Page sections">
          {DOEHEALTH_DESK_NAV_CENTER_LINKS.map((item) => (
            <Link key={item.href + item.label} href={item.href} className="doehealth-desk-nav__link">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="doehealth-desk-nav__end flex shrink-0 items-center">
          <DesktopNavActionRow
            bg={heroWaitlistBg}
            fg={heroWaitlistFg}
            shadow={heroWaitlistShadow}
            divider={heroCtaDivider}
            linksEnabled={navActionLinksEnabled}
            primaryCtaLabel={DOEHEALTH_DESK_NAV_PRIMARY_CTA.label}
            primaryCtaHref={DOEHEALTH_DESK_NAV_PRIMARY_CTA.href}
          />
        </div>
      </div>
    </nav>
    </div>
  );
}
