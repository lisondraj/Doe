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
  DOEPHONE_BEIGE_SECTION,
  DOEPHONE_MAIN_PAGE_BEIGE_SECTION,
  DOEPHONE_MAIN_PAGE_VIEWPORT_SECTION,
} from "@/lib/doephone/section-styles";
import { useDoePhoneStableViewport } from "@/lib/doephone/use-doe-phone-stable-viewport";
import { useDesignersStaticNav } from "@/lib/designers/use-designers-static-nav";

export function DoePhoneMobileView() {
  useDoePhoneStableViewport();
  const staticNav = useDesignersStaticNav();

  return (
    <div
      className="doephone-mobile-root relative z-0 min-h-[var(--app-vh,100lvh)] overflow-x-hidden bg-[#F7F6F3]"
      suppressHydrationWarning
      data-doeforvc-view="iphone"
    >
      <DoeIphoneSiteNav
        pinchSafe
        showMenu={false}
        ctaLayout="main-home"
        showJoinCta={false}
        logoLink={!staticNav}
        navActionLinksEnabled={!staticNav}
      />

      <DoePhoneHeroSection />

      <section className={DOEPHONE_MAIN_PAGE_BEIGE_SECTION} aria-label="Labs">
        <DoePhoneCommunicationSection />
      </section>

      <DoePhoneCommunicationIntelligenceSection />

      <section className={DOEPHONE_MAIN_PAGE_BEIGE_SECTION} aria-label="Customization">
        <DoePhoneCustomizationSection />
      </section>

      <DoePhoneIntegrationsSection sectionClassName={DOEPHONE_MAIN_PAGE_VIEWPORT_SECTION} />

      <section className={DOEPHONE_BEIGE_SECTION} aria-label="Closing">
        <DoePhoneClosingSection />
      </section>

      <HomeFooter />
    </div>
  );
}
