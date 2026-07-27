"use client";

import { DesktopPunchedSiteNav } from "@/components/nav/DesktopPunchedSiteNav";

/** Desktop /about nav — punched capsule with gold mail (matches iPhone /about). */
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
