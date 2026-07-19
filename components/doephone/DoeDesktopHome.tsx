"use client";

import { DoePhoneClosingSection } from "@/components/doephone/DoePhoneClosingSection";
import { DoePhoneHeroSection } from "@/components/doephone/DoePhoneHeroSection";
import { DoePhoneHomeFeatureStack } from "@/components/doephone/DoePhoneHomeFeatureStack";
import { HomeFooter } from "@/components/home/sections/HomeFooter";
import { DesktopPunchedSiteNav } from "@/components/nav/DesktopPunchedSiteNav";
import { DOEPHONE_BEIGE_SECTION } from "@/lib/doephone/section-styles";

/** Desktop home — light Doe layout mirroring /proto, driven by the iPhone home content. */
export function DoeDesktopHome({
  logoLink = true,
  navActionLinksEnabled = true,
}: {
  logoLink?: boolean;
  navActionLinksEnabled?: boolean;
} = {}) {
  return (
    <div className="doe-desktop-root relative overflow-x-hidden bg-[#faf0d8]">
      <div className="relative z-[40] overflow-x-clip overflow-y-visible">
        <DoePhoneHeroSection variant="desktop" iphoneBackdrop />

        <DesktopPunchedSiteNav
          logoLink={logoLink}
          navActionLinksEnabled={navActionLinksEnabled}
        />
      </div>

      <div className="relative z-10">
        <DoePhoneHomeFeatureStack shaderTheme="dusk" variant="desktop" />

        <section className={DOEPHONE_BEIGE_SECTION} aria-label="Closing">
          <DoePhoneClosingSection />
        </section>

        <HomeFooter linksDisabled={!navActionLinksEnabled} shaderTheme="dusk" />
      </div>
    </div>
  );
}
