"use client";

import { useState } from "react";
import Link from "next/link";

import { DoeFall26DeskAnnounceStrip } from "@/components/doe-fall26-desk/DoeFall26DeskAnnounceStrip";
import { DesktopNavActionRow } from "@/components/nav/DesktopNavActionRow";
import { DOEPHONE_DESKTOP_PAGE_INSET_X } from "@/lib/doephone/section-styles";
import {
  DOE_FALL26_DESK_NAV_CENTER_LINKS,
  DOE_FALL26_DESK_NAV_PRIMARY_CTA,
} from "@/lib/doefall26/doefall26-desk-nav-copy";
import { useDoeFall26DeskBannerHeight } from "@/lib/doefall26/use-doefall26-desk-banner-height";
import { inter, lora } from "@/lib/home/fonts";

/** DesktopHome top bar — cream chrome, no hero scroll coupling. */
export function DoeFall26DeskDesktopNavBar({
  logoLink = true,
  navActionLinksEnabled = true,
}: {
  logoLink?: boolean;
  navActionLinksEnabled?: boolean;
} = {}) {
  const heroWaitlistBg = "var(--fall26-nav-button-bg, #281910)";
  const heroWaitlistFg = "var(--fall26-nav-button-fg, #fffcf1)";
  const heroWaitlistShadow = "none";
  const heroCtaDivider = "var(--fall26-nav-button-line, rgba(255, 252, 241, 0.22))";
  const [dismissed, setDismissed] = useState(false);
  useDoeFall26DeskBannerHeight(dismissed);

  return (
    <div className={`doefall26-desk-chrome${dismissed ? " is-dismissed" : ""}`}>
      <DoeFall26DeskAnnounceStrip onDismiss={() => setDismissed(true)} />
    <nav className="desktop-home-nav" aria-label="Site">
      <div
        className={`doefall26-desk-nav__bar relative z-10 py-6 ${DOEPHONE_DESKTOP_PAGE_INSET_X} ${inter.className}`}
      >
        {logoLink ? (
          <Link
            href="/"
            className={`doefall26-desk-nav__mark text-4xl font-normal no-underline ${lora.className}`}
          >
            Doe
          </Link>
        ) : (
          <span className={`doefall26-desk-nav__mark text-4xl font-normal ${lora.className}`}>
            Doe
          </span>
        )}

        <nav className="doefall26-desk-nav__links" aria-label="Page sections">
          {DOE_FALL26_DESK_NAV_CENTER_LINKS.map((item) => (
            <Link key={item.href + item.label} href={item.href} className="doefall26-desk-nav__link">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="doefall26-desk-nav__end flex shrink-0 items-center">
          <DesktopNavActionRow
            bg={heroWaitlistBg}
            fg={heroWaitlistFg}
            shadow={heroWaitlistShadow}
            divider={heroCtaDivider}
            linksEnabled={navActionLinksEnabled}
            primaryCtaLabel={DOE_FALL26_DESK_NAV_PRIMARY_CTA.label}
            primaryCtaHref={DOE_FALL26_DESK_NAV_PRIMARY_CTA.href}
          />
        </div>
      </div>
    </nav>
    </div>
  );
}
