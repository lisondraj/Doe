"use client";

import { useEffect } from "react";

/** Syncs `--fall26-banner-h` for main padding and fixed chrome (dismiss = 0). */
export function useDoeFall26DeskBannerHeight(dismissed: boolean) {
  useEffect(() => {
    document.documentElement.style.setProperty("--fall26-banner-h", dismissed ? "0px" : "2.85rem");
    return () => {
      document.documentElement.style.removeProperty("--fall26-banner-h");
    };
  }, [dismissed]);
}
