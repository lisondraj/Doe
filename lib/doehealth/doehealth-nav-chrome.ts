"use client";

import { useLayoutEffect, useState } from "react";

import { isAboutStylePagePath } from "@/lib/about/about-style-page-paths";
import { isDoeHealthLandingPath } from "@/lib/doehealth/doehealth-landing-paths";
import { isDoeHealthMarketingRoot } from "@/lib/site-domains";

/** /doehealth, /about-style pages, and doehealth.care marketing `/`. */
export function isDoeHealthLandingNavContext(): boolean {
  if (typeof window === "undefined") return false;
  const path = window.location.pathname;
  const host = window.location.hostname;
  if (isAboutStylePagePath(path, host)) return true;
  if (isDoeHealthLandingPath(path)) return true;
  return isDoeHealthMarketingRoot(host, path);
}

export function useDoeHealthLandingNavContext(): boolean {
  const [isDoeHealth, setIsDoeHealth] = useState(false);

  useLayoutEffect(() => {
    setIsDoeHealth(isDoeHealthLandingNavContext());
  }, []);

  return isDoeHealth;
}
