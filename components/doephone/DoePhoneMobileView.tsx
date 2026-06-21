"use client";

import DoeIphoneSiteNav from "@/components/DoeIphoneSiteNav";
import { DoePhoneClosingSection } from "@/components/doephone/DoePhoneClosingSection";
import { DoePhoneCommunicationSection } from "@/components/doephone/DoePhoneCommunicationSection";
import { DoePhoneCustomizationSection } from "@/components/doephone/DoePhoneCustomizationSection";
import { DoePhoneHeroSection } from "@/components/doephone/DoePhoneHeroSection";
import { DoePhoneSectionPlus, DoePhoneSectionText } from "@/components/doephone/DoePhoneSectionText";
import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import { HomeFooter } from "@/components/home/sections/HomeFooter";
import {
  CARE_COORDINATION_BACKDROP,
  DIAGNOSTIC_ASSISTANT_BACKDROP,
} from "@/lib/workflow-carousel-design-backdrops";
import { DOEPHONE_VIEWPORT_SECTION } from "@/lib/doephone/section-styles";
import { useLayoutEffect } from "react";

export function DoePhoneMobileView() {
  /** Set viewport vars once + on orientation change only — avoids pinch-zoom layout jumps. */
  useLayoutEffect(() => {
    const measure = () => {
      document.documentElement.style.setProperty("--app-vw", `${window.innerWidth}px`);
      document.documentElement.style.setProperty("--app-vh", `${window.innerHeight}px`);
    };
    measure();
    window.addEventListener("orientationchange", measure);
    return () => window.removeEventListener("orientationchange", measure);
  }, []);

  return (
    <div
      className="doephone-mobile-root relative z-0 min-h-[100dvh] overflow-x-hidden bg-[#F7F6F3]"
      suppressHydrationWarning
      data-doeforvc-view="iphone"
    >
      <DoeIphoneSiteNav pinchSafe />

      <DoePhoneHeroSection />

      <div className="w-full border-t border-[#E6E6E6]" aria-hidden />

      <section
        className="relative z-10 flex min-h-[100svh] w-full flex-col bg-[#F7F6F3] iphone-page:min-h-[100dvh]"
        aria-label="Labs"
      >
        <DoePhoneCommunicationSection />
      </section>

      <div className="w-full border-t border-[#E6E6E6]" aria-hidden />

      <section className={`${DOEPHONE_VIEWPORT_SECTION} overflow-hidden bg-[#F7F6F3]`} aria-label="Communication">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <WorkflowCarouselDesignBackdrop
            backdrop={CARE_COORDINATION_BACKDROP}
            embedded
            gradientScale={1.38}
          />
        </div>
        <DoePhoneSectionText
          line1="Communication"
          line2={
            <>
              <DoePhoneSectionPlus />
              Intelligence.
            </>
          }
          color="text-white"
        />
      </section>

      <div className="w-full border-t border-[#E6E6E6]" aria-hidden />

      <section
        className="relative z-10 flex min-h-[100svh] w-full flex-col bg-[#F7F6F3] iphone-page:min-h-[100dvh]"
        aria-label="Customization"
      >
        <DoePhoneCustomizationSection />
      </section>

      <div className="w-full border-t border-[#E6E6E6]" aria-hidden />

      <section className={`${DOEPHONE_VIEWPORT_SECTION} overflow-hidden bg-[#F7F6F3]`} aria-label="Integrations">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <WorkflowCarouselDesignBackdrop backdrop={DIAGNOSTIC_ASSISTANT_BACKDROP} embedded />
        </div>
        <DoePhoneSectionText line1="Intelligence built." line2="into your stack." color="text-white" />
      </section>

      <div className="w-full border-t border-[#E6E6E6]" aria-hidden />

      <section
        className="relative z-10 flex min-h-[100svh] w-full flex-col bg-[#F7F6F3] iphone-page:min-h-[100dvh]"
        aria-label="Closing"
      >
        <DoePhoneClosingSection />
      </section>

      <HomeFooter />
    </div>
  );
}
