"use client";

import { useLayoutEffect } from "react";

import { BlogMobileShell } from "@/components/blog/BlogMobileShell";
import { CampusAmbassadorPageContent } from "@/components/join/CampusAmbassadorPageContent";
import { DoeHealthTopBanner } from "@/components/doehealth/DoeHealthTopBanner";
import { ABOUT_STYLE_PHONE_SHELL_PROPS } from "@/lib/about/about-style-phone-shell-props";
import "@/lib/about/about-doehealth-iphone.css";
import { BROADER_DOE_VISION_CONTENT_PT } from "@/lib/blog/broader-doe-vision-layout-styles";
import { CAMPUS_AMBASSADOR_TOP_BANNER } from "@/lib/join/campus-ambassador-copy";
import "@/lib/join/campus-ambassador-page.css";
import "@/lib/doehealth/doehealth-landing.css";
import { applyPhoneOverflowChrome } from "@/lib/doephone/phone-layout-viewport";
import { useDoePhoneLayoutViewport } from "@/lib/doephone/use-doe-phone-layout-viewport";
import { ABOUT_BROWN_OVERFLOW_SURFACE } from "@/lib/home/doe-page-colors";
import { useDoePhoneStableViewport } from "@/lib/doephone/use-doe-phone-stable-viewport";

/** iPhone /join on doe.care — campus ambassador program (premed-style shell). */
export function CampusAmbassadorMobileView() {
  useDoePhoneLayoutViewport();
  useDoePhoneStableViewport(true);

  useLayoutEffect(() => {
    applyPhoneOverflowChrome(ABOUT_BROWN_OVERFLOW_SURFACE);

    try {
      sessionStorage.removeItem(`doephone-app-viewport-lock:${location.hostname}`);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <BlogMobileShell
      {...ABOUT_STYLE_PHONE_SHELL_PROPS}
      footerShowIncorporationLines
      topBanner={<DoeHealthTopBanner {...CAMPUS_AMBASSADOR_TOP_BANNER} />}
    >
      <main className={`w-full ${BROADER_DOE_VISION_CONTENT_PT}`}>
        <CampusAmbassadorPageContent />
      </main>
    </BlogMobileShell>
  );
}
