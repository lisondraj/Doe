"use client";

import { useLayoutEffect } from "react";

import { DoeInsureFooter } from "@/components/doeinsure/DoeInsureFooter";
import { DoeInsureNav } from "@/components/doeinsure/DoeInsureNav";
import { DoeInsurePageContent } from "@/components/doeinsure/DoeInsurePageContent";
import { applyPhoneOverflowChrome } from "@/lib/doephone/phone-layout-viewport";
import { useDoePhoneLayoutViewport } from "@/lib/doephone/use-doe-phone-layout-viewport";
import { useDoePhoneStableViewport } from "@/lib/doephone/use-doe-phone-stable-viewport";
import { dmSans } from "@/lib/home/fonts";

const WHITE = "#ffffff";

export function DoeInsureMobileView() {
  useDoePhoneLayoutViewport();
  useDoePhoneStableViewport(true);

  useLayoutEffect(() => {
    applyPhoneOverflowChrome(WHITE);
    try {
      sessionStorage.removeItem(`doephone-app-viewport-lock:${location.hostname}`);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <div
      className={`doeinsure-root doeinsure-root--iphone doephone-mobile-root ${dmSans.variable} ${dmSans.className}`}
      data-doeforvc-view="iphone"
    >
      <DoeInsureNav />
      <main>
        <DoeInsurePageContent />
      </main>
      <DoeInsureFooter />
    </div>
  );
}
