"use client";

import { DoeSchedulesAppMock } from "@/components/doe-schedules-app-mock";
import "@/lib/product/product-brown-mock.css";
import "@/lib/product/product-landing.css";
import "@/lib/story/story-page.css";

/** Desktop /story — product brown shell with one blank tab. */
export function StoryDesktopView() {
  return (
    <main className="product-page-root h-dvh min-h-0 w-full overflow-hidden bg-transparent">
      <DoeSchedulesAppMock variant="story" />
    </main>
  );
}
