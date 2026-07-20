"use client";

import { useLayoutEffect } from "react";

import { DoeSchedulesAppMock } from "@/components/doe-schedules-app-mock";
import "@/lib/product/product-brown-mock.css";
import "@/lib/product/product-landing.css";

/** /product — doebuildnew app shell in brown-only theme with voice landing. */
export function ProductPage() {
  useLayoutEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-product-page", "true");
    html.setAttribute("data-layout", "desktop");
    return () => {
      html.removeAttribute("data-product-page");
    };
  }, []);

  return (
    <main className="product-page-root h-dvh min-h-0 w-full overflow-hidden bg-transparent">
      <DoeSchedulesAppMock variant="product-brown" />
    </main>
  );
}
