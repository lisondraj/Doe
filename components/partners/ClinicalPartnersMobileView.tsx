"use client";

import { useLayoutEffect } from "react";

import { BlogMobileShell } from "@/components/blog/BlogMobileShell";
import { ClinicalPartnersPageContent } from "@/components/partners/ClinicalPartnersPageContent";
import { DoeHealthTopBanner } from "@/components/doehealth/DoeHealthTopBanner";
import { ABOUT_STYLE_PHONE_SHELL_PROPS } from "@/lib/about/about-style-phone-shell-props";
import "@/lib/about/about-doehealth-iphone.css";
import { BROADER_DOE_VISION_CONTENT_PT } from "@/lib/blog/broader-doe-vision-layout-styles";
import { CLINICAL_PARTNERS_TOP_BANNER } from "@/lib/partners/clinical-partners-copy";
import "@/lib/join/campus-ambassador-page.css";
import "@/lib/premed/premed-page.css";
import "@/lib/doehealth/doehealth-landing.css";
import { applyPhoneOverflowChrome } from "@/lib/doephone/phone-layout-viewport";
import { useDoePhoneLayoutViewport } from "@/lib/doephone/use-doe-phone-layout-viewport";
import { ABOUT_BROWN_OVERFLOW_SURFACE } from "@/lib/home/doe-page-colors";
import { useDoePhoneStableViewport } from "@/lib/doephone/use-doe-phone-stable-viewport";

/** iPhone /partners on doe.care — clinical partners program (premed-style shell). */
export function ClinicalPartnersMobileView() {
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
      topBanner={<DoeHealthTopBanner {...CLINICAL_PARTNERS_TOP_BANNER} />}
    >
      <main className={`campus-ambassador-page-main min-w-0 max-w-full overflow-x-clip w-full ${BROADER_DOE_VISION_CONTENT_PT}`}>
        <ClinicalPartnersPageContent />
      </main>
    </BlogMobileShell>
  );
}
