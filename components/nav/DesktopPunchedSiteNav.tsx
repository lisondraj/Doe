"use client";

import Link from "next/link";
import type { CSSProperties } from "react";

import { DesktopNavActionRow } from "@/components/nav/DesktopNavActionRow";
import { DOE_DESKTOP_NAV_LOGO_TW } from "@/lib/doephone/doe-desktop-layout-styles";
import {
  DOE_HOME_DUSK_INK,
  DOE_HOME_DUSK_SURFACE_RAISED,
} from "@/lib/home/doe-page-colors";
import { lora } from "@/lib/home/fonts";

/** Dusk capsule CTA chrome — matches iPhone always-punched sand pills. */
const PUNCHED_CTA = {
  bg: DOE_HOME_DUSK_SURFACE_RAISED,
  fg: DOE_HOME_DUSK_INK,
  shadow: "none",
  divider: "rgba(26, 18, 8, 0.14)",
} as const;

const ALWAYS_PUNCHED_STYLE = {
  ["--proto-nav-frost-progress" as string]: 1,
  ["--proto-nav-frost-shell-progress" as string]: 1,
} as CSSProperties;

/** Desktop home + about — floating dusk capsule nav matching iPhone punched chrome. */
export function DesktopPunchedSiteNav({
  logoLink = true,
  navActionLinksEnabled = true,
  className = "",
  ariaLabel = "Primary",
}: {
  logoLink?: boolean;
  navActionLinksEnabled?: boolean;
  className?: string;
  ariaLabel?: string;
} = {}) {
  return (
    <nav
      className={`desktop-punched-nav desktop-home-nav fixed top-0 left-0 right-0 z-[50] proto-nav-scroll-frost proto-nav-always-punched proto-nav--scrolled ${className}`.trim()}
      style={ALWAYS_PUNCHED_STYLE}
      aria-label={ariaLabel}
    >
      <div className="proto-nav-frost-shell">
        <div className="desktop-punched-nav__strip flex items-center justify-between">
          {logoLink ? (
            <Link
              href="/"
              className={`proto-nav-chrome-logo ${lora.className} ${DOE_DESKTOP_NAV_LOGO_TW}`}
            >
              Doe
            </Link>
          ) : (
            <span className={`proto-nav-chrome-logo ${lora.className} ${DOE_DESKTOP_NAV_LOGO_TW}`}>
              Doe
            </span>
          )}

          <div className="proto-nav-chrome-actions">
            <DesktopNavActionRow
              {...PUNCHED_CTA}
              punched
              linksEnabled={navActionLinksEnabled}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
