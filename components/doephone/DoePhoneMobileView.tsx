"use client";

import DoeIphoneSiteNav from "@/components/DoeIphoneSiteNav";
import { DoePhoneClosingSection } from "@/components/doephone/DoePhoneClosingSection";
import { DoePhoneCommunicationIntelligenceSection } from "@/components/doephone/DoePhoneCommunicationIntelligenceSection";
import { DoePhoneIntegrationsSection } from "@/components/doephone/DoePhoneIntegrationsSection";
import { DoePhoneCommunicationSection } from "@/components/doephone/DoePhoneCommunicationSection";
import { DoePhoneCustomizationSection } from "@/components/doephone/DoePhoneCustomizationSection";
import { DoePhoneHeroSection } from "@/components/doephone/DoePhoneHeroSection";
import type { MobileNavActionChrome } from "@/components/nav/MobileNavActionRow";
import { HomeFooter } from "@/components/home/sections/HomeFooter";
import {
  DOEPHONE_BEIGE_SECTION,
  DOEPHONE_MAIN_PAGE_BEIGE_SECTION,
  DOEPHONE_MAIN_PAGE_VIEWPORT_SECTION,
} from "@/lib/doephone/section-styles";
import { useDoePhoneStableViewport } from "@/lib/doephone/use-doe-phone-stable-viewport";
import { useEffect, useMemo, useState } from "react";

const MOBILE_HERO_NAV_FADE_START_RATIO = 0.8;

const MOBILE_HERO_NAV_CHROME: MobileNavActionChrome = {
  bg: "#ffffff",
  fg: "#000000",
  shadow: "0 2px 6px rgba(0, 0, 0, 0.12)",
  divider: "rgba(0, 0, 0, 0.12)",
};

const MOBILE_DEFAULT_NAV_CHROME: MobileNavActionChrome = {
  bg: "#000000",
  fg: "#ffffff",
  shadow: "none",
  divider: "rgba(255, 255, 255, 0.22)",
};

export function DoePhoneMobileView() {
  useDoePhoneStableViewport();
  const [navOnHero, setNavOnHero] = useState(true);

  useEffect(() => {
    const syncNavChrome = () => {
      setNavOnHero(window.scrollY < window.innerHeight * MOBILE_HERO_NAV_FADE_START_RATIO);
    };

    syncNavChrome();
    window.addEventListener("scroll", syncNavChrome, { passive: true });
    window.addEventListener("resize", syncNavChrome);
    return () => {
      window.removeEventListener("scroll", syncNavChrome);
      window.removeEventListener("resize", syncNavChrome);
    };
  }, []);

  const mobileNavChrome = useMemo(
    () => (navOnHero ? MOBILE_HERO_NAV_CHROME : MOBILE_DEFAULT_NAV_CHROME),
    [navOnHero],
  );

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
        mobileNavChrome={mobileNavChrome}
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
