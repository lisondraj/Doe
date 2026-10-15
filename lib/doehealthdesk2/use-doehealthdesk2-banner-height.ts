"use client";

import { useEffect } from "react";

/** Syncs `--desk2-banner-h` for main padding and fixed chrome (dismiss = 0). */
export function useDoeHealthDesk2BannerHeight(dismissed: boolean) {
  useEffect(() => {
    document.documentElement.style.setProperty("--desk2-banner-h", dismissed ? "0px" : "2.85rem");
    return () => {
      document.documentElement.style.removeProperty("--desk2-banner-h");
    };
  }, [dismissed]);
}
