"use client";

import DoeIphoneSiteNav from "@/components/DoeIphoneSiteNav";
import { DoePhoneClosingSection } from "@/components/doephone/DoePhoneClosingSection";
import { DoePhoneCommunicationIntelligenceSection } from "@/components/doephone/DoePhoneCommunicationIntelligenceSection";
import { DoePhoneIntegrationsSection } from "@/components/doephone/DoePhoneIntegrationsSection";
import { DoePhoneCommunicationSection } from "@/components/doephone/DoePhoneCommunicationSection";
import { DoePhoneCustomizationSection } from "@/components/doephone/DoePhoneCustomizationSection";
import { DoePhoneHeroSection } from "@/components/doephone/DoePhoneHeroSection";
import { HomeFooter } from "@/components/home/sections/HomeFooter";
import { DOEPHONE_BEIGE_SECTION } from "@/lib/doephone/section-styles";
import { useDoePhoneStableViewport } from "@/lib/doephone/use-doe-phone-stable-viewport";

export function DoePhoneMobileView() {
  useDoePhoneStableViewport();

  return (
    <div
      className="doephone-mobile-root relative z-0 min-h-[var(--app-vh,100lvh)] overflow-x-hidden bg-[#F7F6F3]"
      suppressHydrationWarning
      data-doeforvc-view="iphone"
    >
      <DoeIphoneSiteNav pinchSafe showMenu={false} ctaLayout="triple" />

      <DoePhoneHeroSection />

      <section className={DOEPHONE_BEIGE_SECTION} aria-label="Labs">
        <DoePhoneCommunicationSection />
      </section>

      <DoePhoneCommunicationIntelligenceSection />

      <section className={DOEPHONE_BEIGE_SECTION} aria-label="Customization">
        <DoePhoneCustomizationSection />
      </section>

      <DoePhoneIntegrationsSection />

      <section className={DOEPHONE_BEIGE_SECTION} aria-label="Closing">
        <DoePhoneClosingSection />
      </section>

      <HomeFooter />
    </div>
  );
}
