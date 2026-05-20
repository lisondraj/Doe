"use client";

import { useEffect } from "react";

/** /mainpage only — desktop layout attrs; restores phone canvas attrs on leave. */
export function MainpageRouteLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    html.removeAttribute("data-doeforvc-always-phone");
    html.setAttribute("data-layout", "desktop");
    html.setAttribute("data-route-mainpage", "true");
    body.classList.add("mainpage-route");

    return () => {
      html.setAttribute("data-doeforvc-always-phone", "true");
      html.removeAttribute("data-layout");
      html.removeAttribute("data-route-mainpage");
      body.classList.remove("mainpage-route");
    };
  }, []);

  return children;
}
