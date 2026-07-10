"use client";

import { useLayoutEffect } from "react";

import { DoePhoneDesktopView } from "@/components/doephone/DoePhoneDesktopView";

/** Legacy /desktop route — same iPhone home content tree with desktop layout + scaling. */
export default function DesktopPage() {
  useLayoutEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-home-page", "true");
    return () => {
      html.removeAttribute("data-home-page");
    };
  }, []);

  return <DoePhoneDesktopView />;
}
