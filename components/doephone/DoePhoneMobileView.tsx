"use client";

import DoeIphoneSiteNav from "@/components/DoeIphoneSiteNav";
import { DoePhoneClosingSection } from "@/components/doephone/DoePhoneClosingSection";
import { DoePhoneCommunicationIntelligenceSection } from "@/components/doephone/DoePhoneCommunicationIntelligenceSection";
import { DoePhoneIntegrationsSection } from "@/components/doephone/DoePhoneIntegrationsSection";
import { DoePhoneCommunicationSection } from "@/components/doephone/DoePhoneCommunicationSection";
import { DoePhoneCustomizationSection } from "@/components/doephone/DoePhoneCustomizationSection";
import { DoePhoneHeroSection } from "@/components/doephone/DoePhoneHeroSection";
import { HomeFooter } from "@/components/home/sections/HomeFooter";
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

      <DoePhoneCommunicationIntelligenceSection />

      <section
        className="relative z-10 flex min-h-[100svh] w-full flex-col bg-[#F7F6F3] iphone-page:min-h-[100dvh]"
        aria-label="Customization"
      >
        <DoePhoneCustomizationSection />
      </section>

      <DoePhoneIntegrationsSection />

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
