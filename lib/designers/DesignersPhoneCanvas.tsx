"use client";

import { useLayoutEffect } from "react";

import { useDesignersPhoneVmin } from "@/lib/designers/use-designers-phone-vmin";

/** Designers route — iPhone canvas corrections scoped to /doehealth and /designers. */
export function DesignersPhoneCanvas({ children }: { children: React.ReactNode }) {
  useDesignersPhoneVmin();

  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-designers-page", "true");
    return () => {
      document.documentElement.removeAttribute("data-designers-page");
      document.documentElement.removeAttribute("data-designers-layout-wide");
    };
  }, []);

  return children;
}
