"use client";

import { useLayoutEffect } from "react";

import { DoeHomeFooter } from "@/components/doehome/DoeHomeFooter";
import { DoeHomeNav } from "@/components/doehome/DoeHomeNav";
import { DoeHomePageContent } from "@/components/doehome/DoeHomePageContent";
import { DOEHOME_FOOTER } from "@/lib/doehome/doehome-copy";
import { applyPhoneOverflowChrome } from "@/lib/doephone/phone-layout-viewport";
import { useDoePhoneLayoutViewport } from "@/lib/doephone/use-doe-phone-layout-viewport";
import { useDoePhoneStableViewport } from "@/lib/doephone/use-doe-phone-stable-viewport";
import { dmSans } from "@/lib/home/fonts";

export function DoeHomeMobileView() {
  useDoePhoneLayoutViewport();
  useDoePhoneStableViewport(true);

  useLayoutEffect(() => {
    applyPhoneOverflowChrome(DOEHOME_FOOTER.fill);
    try {
      sessionStorage.removeItem(`doephone-app-viewport-lock:${location.hostname}`);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <div
      className={`doehome-root doeinsure-root doeinsure-root--iphone doephone-mobile-root ${dmSans.variable} ${dmSans.className}`}
      data-doeforvc-view="iphone"
    >
      <DoeHomeNav />
      <main>
        <DoeHomePageContent />
      </main>
      <DoeHomeFooter />
    </div>
  );
}
