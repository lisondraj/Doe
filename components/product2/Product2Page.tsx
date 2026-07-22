"use client";

import { useLayoutEffect } from "react";

import { DoeSchedulesAppMockProduct2 } from "@/components/doe-schedules-app-mock-product2";
import "@/lib/product2/product2-brown-mock.css";
import "@/lib/product2/product2-landing.css";

/** /product2 — doebuildnew app shell in brown-only theme with voice landing. */
export function Product2Page() {
  useLayoutEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-product2-page", "true");
    html.setAttribute("data-layout", "desktop");
    return () => {
      html.removeAttribute("data-product2-page");
    };
  }, []);

  return (
    <main className="product2-page-root h-dvh min-h-0 w-full overflow-hidden bg-transparent">
      <DoeSchedulesAppMockProduct2 variant="product-brown" />
    </main>
  );
}
