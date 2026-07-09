"use client";

import { useLayoutEffect } from "react";

/** /desktop — native desktop layout; restores phone canvas attrs on leave. */
export function DesktopRouteLayout({ children }: { children: React.ReactNode }) {
  useLayoutEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    html.removeAttribute("data-doeforvc-always-phone");
    html.setAttribute("data-layout", "desktop");
    html.setAttribute("data-route-desktop", "true");
    body.classList.add("desktop-route");

    return () => {
      html.setAttribute("data-doeforvc-always-phone", "true");
      html.removeAttribute("data-layout");
      html.removeAttribute("data-route-desktop");
      body.classList.remove("desktop-route");
    };
  }, []);

  return children;
}
