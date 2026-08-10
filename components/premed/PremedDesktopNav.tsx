"use client";

import { DesktopPunchedSiteNav } from "@/components/nav/DesktopPunchedSiteNav";

/** Desktop /premed nav — always-punched gold Doe + mail chrome. */
export function PremedDesktopNav() {
  return (
    <DesktopPunchedSiteNav
      ariaLabel="Site"
      alwaysPunched
      navShowMailIcon
      navShowInvestorsCta={false}
    />
  );
}
