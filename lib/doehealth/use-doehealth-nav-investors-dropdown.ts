"use client";

import { isDoeHealthLandingNavContext } from "@/lib/doehealth/doehealth-nav-chrome";
import { useLayoutEffect, useState } from "react";

/** @deprecated Investors CTA removed on Doe home nav — kept for callers that still pass dropdownEnabled. */
export function isDoeHealthNavInvestorsDropdownDisabled(): boolean {
  return isDoeHealthLandingNavContext();
}

/** @deprecated Prefer {@link useDoeHealthLandingNavContext} + navShowInvestorsCta. */
export function useDoeHealthNavInvestorsDropdownDisabled(): boolean {
  const [disabled, setDisabled] = useState(false);

  useLayoutEffect(() => {
    setDisabled(isDoeHealthNavInvestorsDropdownDisabled());
  }, []);

  return disabled;
}
