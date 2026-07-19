"use client";

import { useLayoutEffect, useState } from "react";

import { isDoeHealthLandingPath } from "@/lib/doehealth/doehealth-landing-paths";
import { isDesignersHost } from "@/lib/site-domains";

/** /doehealth preview and doehealth.care root. */
export function isDoeHealthLandingNavContext(): boolean {
  if (typeof window === "undefined") return false;
  const path = window.location.pathname;
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
