"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { DesktopNavActionRow } from "@/components/nav/DesktopNavActionRow";
import { DoeLinkArrow } from "@/components/shared/DoeLinkArrow";
import { DOEPHONE_DESKTOP_PAGE_INSET_X } from "@/lib/doephone/section-styles";
import {
  DOEHEALTH_DESK_ANNOUNCEMENT,
  DOEHEALTH_DESK_NAV_CENTER_LINKS,
  DOEHEALTH_DESK_NAV_PRIMARY_CTA,
} from "@/lib/doehealth/doehealth-desk-nav-copy";
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

  useEffect(() => {
    document.documentElement.style.setProperty("--desk-banner-h", dismissed ? "0px" : "2.85rem");
    return () => {
      document.documentElement.style.removeProperty("--desk-banner-h");
    };
  }, [dismissed]);

  return (
    <div className={`doehealth-desk-chrome${dismissed ? " is-dismissed" : ""}`}>
      <div className={`doehealth-desk-announce ${inter.className}`}>
        <p>
          <span>{DOEHEALTH_DESK_ANNOUNCEMENT.message}</span>
          <Link href={DOEHEALTH_DESK_ANNOUNCEMENT.href} className="doehealth-desk-announce__link">
            {DOEHEALTH_DESK_ANNOUNCEMENT.linkLabel}
            <DoeLinkArrow className="doehealth-desk-announce__arrow" width={13} height={13} />
          </Link>
        </p>
        <button type="button" aria-label="Dismiss announcement" onClick={() => setDismissed(true)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
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
