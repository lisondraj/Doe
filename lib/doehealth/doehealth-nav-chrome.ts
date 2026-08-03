"use client";

import { useLayoutEffect, useState } from "react";

import { isAboutStylePagePath } from "@/lib/about/about-style-page-paths";
import { isDoeHealthLandingPath } from "@/lib/doehealth/doehealth-landing-paths";
import { isDesignersHost } from "@/lib/site-domains";

/** /doehealth, /about-style pages, and doehealth.care root — brown/gold nav chrome. */
export function isDoeHealthLandingNavContext(): boolean {
  if (typeof window === "undefined") return false;
  const path = window.location.pathname;
  if (isAboutStylePagePath(path)) return true;
  if (isDoeHealthLandingPath(path)) return true;
  return isDesignersHost(window.location.hostname) && path === "/";
}

export function useDoeHealthLandingNavContext(): boolean {
  const [isDoeHealth, setIsDoeHealth] = useState(false);

  useLayoutEffect(() => {
    setIsDoeHealth(isDoeHealthLandingNavContext());
  }, []);

  return isDoeHealth;
}
