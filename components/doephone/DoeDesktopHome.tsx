"use client";

import { DoePhoneClosingSection } from "@/components/doephone/DoePhoneClosingSection";
import { DoePhoneHeroSection } from "@/components/doephone/DoePhoneHeroSection";
import { DoePhoneHomeFeatureStack } from "@/components/doephone/DoePhoneHomeFeatureStack";
import { DoePhoneScrollRevealLift } from "@/components/doephone/DoePhoneScrollRevealLift";
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
    <div className="doe-desktop-root relative overflow-x-hidden bg-[var(--doe-page-surface,#EDE8DF)]">
      <div className="relative z-[40] overflow-x-clip overflow-y-visible">
        <DoePhoneHeroSection variant="desktop" iphoneBackdrop />

        <DesktopPunchedSiteNav
          logoLink={logoLink}
          navActionLinksEnabled={navActionLinksEnabled}
        />
      </div>

      <div className="relative z-10">
        <DoePhoneHomeFeatureStack shaderTheme="dusk" />

        <DoePhoneScrollRevealLift className="w-full shrink-0">
          <section className={DOEPHONE_BEIGE_SECTION} aria-label="Closing">
            <DoePhoneClosingSection suppressTitleReveal />
          </section>
        </DoePhoneScrollRevealLift>

        <DoePhoneScrollRevealLift className="w-full shrink-0">
          <HomeFooter linksDisabled={!navActionLinksEnabled} shaderTheme="dusk" />
        </DoePhoneScrollRevealLift>
      </div>
    </div>
  );
}
