"use client";

import { type ReactNode, useState } from "react";
import Link from "next/link";

import { DoeHealthDesk2AnnounceStrip } from "@/components/doehealth-desk2/DoeHealthDesk2AnnounceStrip";
import { DesktopNavActionRow } from "@/components/nav/DesktopNavActionRow";
import { DOEPHONE_DESKTOP_PAGE_INSET_X } from "@/lib/doephone/section-styles";
import {
  DOEHEALTH_DESK2_NAV_PRIMARY_CTA,
  DOEHEALTH_DESK2_NAV_PRIMARY_CTA_DROPDOWN_ITEMS,
  doehealthDesk2NavPages,
} from "@/lib/doehealthdesk2/doehealthdesk2-nav-copy";
import { useDoeHealthDesk2BannerHeight } from "@/lib/doehealthdesk2/use-doehealthdesk2-banner-height";
import { inter, lora } from "@/lib/home/fonts";

/** The split-button CTA at the end of the bar: its label, link, and chevron menu. */
export type DoeHealthDesk2NavCta = {
  label: string;
  href: string;
  dropdownItems: readonly { readonly label: string; readonly href: string }[];
};

const DEFAULT_PRIMARY_CTA: DoeHealthDesk2NavCta = {
  label: "Waitlist",
  href: DOEHEALTH_DESK2_NAV_PRIMARY_CTA.href,
  dropdownItems: DOEHEALTH_DESK2_NAV_PRIMARY_CTA_DROPDOWN_ITEMS,
};

/** DesktopHome top bar — cream chrome, no hero scroll coupling. */
export function DoeHealthDesk2DesktopNavBar({
  logoLink = true,
  logoHref = "/",
  navActionLinksEnabled = true,
  sectionHrefBase = "",
  centerLinks = true,
  primaryCta = DEFAULT_PRIMARY_CTA,
  belowBar,
}: {
  logoLink?: boolean;
  /** Where the "Doe" mark goes. Defaults to the site root. */
  logoHref?: string;
  navActionLinksEnabled?: boolean;
  /** Prefix for `#section` links when the sections live on another page. */
  sectionHrefBase?: string;
  /** The page links in the middle of the bar. Off for pages that only need the mark and the CTA. */
  centerLinks?: boolean;
  primaryCta?: DoeHealthDesk2NavCta;
  /** Content under the bar that shares its surface and blur, so the two read as one bar. */
  belowBar?: ReactNode;
} = {}) {
  const heroWaitlistBg = "var(--desk2-nav-button-bg, #281910)";
  const heroWaitlistFg = "var(--desk2-nav-button-fg, #fffcf1)";
  const heroWaitlistShadow = "none";
  const heroCtaDivider = "var(--desk2-nav-button-line, rgba(255, 252, 241, 0.22))";
  const [dismissed, setDismissed] = useState(false);
  useDoeHealthDesk2BannerHeight(dismissed);

  return (
    <div className={`doehealth-desk2-chrome${dismissed ? " is-dismissed" : ""}`}>
      <DoeHealthDesk2AnnounceStrip onDismiss={() => setDismissed(true)} />
      <nav className="desktop-home-nav" aria-label="Site">
        <div
          className={`doehealth-desk2-nav__bar relative z-10 py-6 ${DOEPHONE_DESKTOP_PAGE_INSET_X} ${inter.className}`}
        >
          {logoLink ? (
            <Link
              href={logoHref}
              className={`doehealth-desk2-nav__mark text-4xl font-normal no-underline ${lora.className}`}
            >
              Doe
            </Link>
          ) : (
            <span className={`doehealth-desk2-nav__mark text-4xl font-normal ${lora.className}`}>
              Doe
            </span>
          )}

          {centerLinks ? (
            <nav className="doehealth-desk2-nav__links" aria-label="Page sections">
              {doehealthDesk2NavPages(sectionHrefBase).map((item) => (
                <Link key={item.href + item.label} href={item.href} className="doehealth-desk2-nav__link">
                  {item.label}
                </Link>
              ))}
            </nav>
          ) : (
            <span aria-hidden />
          )}

          <div className="doehealth-desk2-nav__end flex shrink-0 items-center">
            <DesktopNavActionRow
              bg={heroWaitlistBg}
              fg={heroWaitlistFg}
              shadow={heroWaitlistShadow}
              divider={heroCtaDivider}
              linksEnabled={navActionLinksEnabled}
              showMailIcon={false}
              showWaitlistButton={false}
              primaryCtaLabel={primaryCta.label}
              primaryCtaHref={primaryCta.href}
              primaryCtaDropdownItems={primaryCta.dropdownItems}
            />
          </div>
        </div>
        {belowBar}
      </nav>
    </div>
  );
}
