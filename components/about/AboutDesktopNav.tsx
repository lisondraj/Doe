"use client";

import { DesktopPunchedSiteNav } from "@/components/nav/DesktopPunchedSiteNav";

/** Desktop /about nav — always-punched dusk capsule (hero-band positioning). */
export function AboutDesktopNav() {
  return (
    <DesktopPunchedSiteNav
      ariaLabel="Site"
      alwaysPunched
      navShowMailIcon
      navShowInvestorsCta={false}
    />
  );
}
