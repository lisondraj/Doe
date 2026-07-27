"use client";

import { DesktopPunchedSiteNav } from "@/components/nav/DesktopPunchedSiteNav";

/** Desktop /about nav — always-punched gold Doe + mail chrome (matches /doehealth). */
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
