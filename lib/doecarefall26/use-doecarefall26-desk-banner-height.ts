"use client";

import { useEffect } from "react";

/** Syncs `--carefall26-banner-h` for main padding and fixed chrome (dismiss = 0). */
export function useDoeCareFall26DeskBannerHeight(dismissed: boolean) {
  useEffect(() => {
    document.documentElement.style.setProperty("--carefall26-banner-h", dismissed ? "0px" : "2.85rem");
    return () => {
      document.documentElement.style.removeProperty("--carefall26-banner-h");
    };
  }, [dismissed]);
}
