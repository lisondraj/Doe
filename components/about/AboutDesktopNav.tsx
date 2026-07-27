"use client";

import { DesktopPunchedSiteNav } from "@/components/nav/DesktopPunchedSiteNav";

/** Desktop /about nav — same scroll morph + gold mail as /doehealth. */
export function AboutDesktopNav() {
  return (
    <DesktopPunchedSiteNav
      ariaLabel="Site"
      navShowMailIcon
      navShowInvestorsCta={false}
    />
  );
}
