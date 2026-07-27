"use client";

import { DoeSchedulesAppMock } from "@/components/doe-schedules-app-mock";
import "@/lib/product/product-brown-mock.css";
import "@/lib/product/product-landing.css";
import "@/lib/product2/product2-inbox.css";
import "@/lib/product2/product2-schedule.css";

/** Desktop /product — unchanged doebuildnew brown app shell. */
export function ProductDesktopView() {
  return (
    <main className="product-page-root h-dvh min-h-0 w-full overflow-hidden bg-transparent">
      <DoeSchedulesAppMock variant="product-brown" />
    </main>
  );
}
