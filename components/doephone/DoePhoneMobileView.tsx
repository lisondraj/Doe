"use client";

import DoeIphoneSiteNav from "@/components/DoeIphoneSiteNav";
import { DoePhoneClosingSection } from "@/components/doephone/DoePhoneClosingSection";
import { DoePhoneCommunicationIntelligenceSection } from "@/components/doephone/DoePhoneCommunicationIntelligenceSection";
import { DoePhoneIntegrationsSection } from "@/components/doephone/DoePhoneIntegrationsSection";
import { DoePhoneCommunicationSection } from "@/components/doephone/DoePhoneCommunicationSection";
import { DoePhoneCustomizationSection } from "@/components/doephone/DoePhoneCustomizationSection";
import { DoePhoneHeroSection } from "@/components/doephone/DoePhoneHeroSection";
import { HomeFooter } from "@/components/home/sections/HomeFooter";
import {
  DOEPHONE_MAIN_PAGE_BEIGE_SECTION,
  DOEPHONE_MAIN_PAGE_SECTION_HEIGHT,
  DOEPHONE_MAIN_PAGE_VIEWPORT_SECTION,
} from "@/lib/doephone/section-styles";
import { useDoePhoneStableViewport } from "@/lib/doephone/use-doe-phone-stable-viewport";
import type { CSSProperties } from "react";

export function DoePhoneMobileView() {
  useDoePhoneStableViewport();

  return (
    <div
      className="doephone-mobile-root relative z-0 min-h-[var(--app-vh,100lvh)] overflow-x-hidden bg-[#F7F6F3]"
      style={{ "--doephone-main-section-height": DOEPHONE_MAIN_PAGE_SECTION_HEIGHT } as CSSProperties}
      suppressHydrationWarning
      data-doeforvc-view="iphone"
    >
      <DoeIphoneSiteNav pinchSafe showMenu ctaLayout="main-home" showJoinCta={false} />

      <DoePhoneHeroSection />

      <section className={DOEPHONE_MAIN_PAGE_BEIGE_SECTION} aria-label="Labs">
        <DoePhoneCommunicationSection />
      </section>

      <DoePhoneCommunicationIntelligenceSection sectionClassName={DOEPHONE_MAIN_PAGE_VIEWPORT_SECTION} />

      <section className={DOEPHONE_MAIN_PAGE_BEIGE_SECTION} aria-label="Customization">
        <DoePhoneCustomizationSection />
      </section>

      <DoePhoneIntegrationsSection sectionClassName={DOEPHONE_MAIN_PAGE_VIEWPORT_SECTION} />

      <section className={DOEPHONE_MAIN_PAGE_BEIGE_SECTION} aria-label="Closing">
        <DoePhoneClosingSection />
      </section>

      <HomeFooter />
    </div>
  );
}
