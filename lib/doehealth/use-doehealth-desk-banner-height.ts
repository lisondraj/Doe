"use client";

import { useEffect } from "react";

/** Syncs `--desk-banner-h` for main padding and fixed chrome (dismiss = 0). */
export function useDoeHealthDeskBannerHeight(dismissed: boolean) {
  useEffect(() => {
    document.documentElement.style.setProperty("--desk-banner-h", dismissed ? "0px" : "2.85rem");
    return () => {
      document.documentElement.style.removeProperty("--desk-banner-h");
    };
  }, [dismissed]);
}
