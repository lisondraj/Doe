"use client";

import { useState } from "react";
import Link from "next/link";

import { DoeCareFall26DeskAnnounceStrip } from "@/components/doe-carefall26-desk/DoeCareFall26DeskAnnounceStrip";
import { DesktopNavActionRow } from "@/components/nav/DesktopNavActionRow";
import { DOEPHONE_DESKTOP_PAGE_INSET_X } from "@/lib/doephone/section-styles";
import {
  DOECAREFALL26_DESK_NAV_CENTER_LINKS,
  DOECAREFALL26_DESK_NAV_PRIMARY_CTA,
} from "@/lib/doecarefall26/doecarefall26-desk-nav-copy";
import { useDoeCareFall26DeskBannerHeight } from "@/lib/doecarefall26/use-doecarefall26-desk-banner-height";
import { inter, lora } from "@/lib/home/fonts";

/** DesktopHome top bar — cream chrome, no hero scroll coupling. */
export function DoeCareFall26DeskDesktopNavBar({
  logoLink = true,
  navActionLinksEnabled = true,
}: {
  logoLink?: boolean;
  navActionLinksEnabled?: boolean;
} = {}) {
  const heroWaitlistBg = "var(--carefall26-nav-button-bg, #281910)";
  const heroWaitlistFg = "var(--carefall26-nav-button-fg, #fffcf1)";
  const heroWaitlistShadow = "none";
  const heroCtaDivider = "var(--carefall26-nav-button-line, rgba(255, 252, 241, 0.22))";
  const [dismissed, setDismissed] = useState(false);
  useDoeCareFall26DeskBannerHeight(dismissed);

  return (
    <div className={`doecarefall26-desk-chrome${dismissed ? " is-dismissed" : ""}`}>
      <DoeCareFall26DeskAnnounceStrip onDismiss={() => setDismissed(true)} />
    <nav className="desktop-home-nav" aria-label="Site">
      <div
        className={`doecarefall26-desk-nav__bar relative z-10 py-6 ${DOEPHONE_DESKTOP_PAGE_INSET_X} ${inter.className}`}
      >
        {logoLink ? (
          <Link
            href="/"
            className={`doecarefall26-desk-nav__mark text-4xl font-normal no-underline ${lora.className}`}
          >
            Doe
          </Link>
        ) : (
          <span className={`doecarefall26-desk-nav__mark text-4xl font-normal ${lora.className}`}>
            Doe
          </span>
        )}

        <nav className="doecarefall26-desk-nav__links" aria-label="Page sections">
          {DOECAREFALL26_DESK_NAV_CENTER_LINKS.map((item) => (
            <Link key={item.href + item.label} href={item.href} className="doecarefall26-desk-nav__link">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="doecarefall26-desk-nav__end flex shrink-0 items-center">
          <DesktopNavActionRow
            bg={heroWaitlistBg}
            fg={heroWaitlistFg}
            shadow={heroWaitlistShadow}
            divider={heroCtaDivider}
            linksEnabled={navActionLinksEnabled}
            showMailIcon={false}
            primaryCtaLabel={DOECAREFALL26_DESK_NAV_PRIMARY_CTA.label}
            primaryCtaHref={DOECAREFALL26_DESK_NAV_PRIMARY_CTA.href}
          />
        </div>
      </div>
    </nav>
    </div>
  );
}
