"use client";

import type { ReactNode } from "react";

import { DoePhoneClosingSection } from "@/components/doephone/DoePhoneClosingSection";
import { DoePhoneHeroSection } from "@/components/doephone/DoePhoneHeroSection";
import { DoePhoneHomeFeatureStack } from "@/components/doephone/DoePhoneHomeFeatureStack";
import { HomeFooter } from "@/components/home/sections/HomeFooter";
import { DesktopPunchedSiteNav } from "@/components/nav/DesktopPunchedSiteNav";
import type { DoePhoneCommunicationSlide } from "@/lib/doephone/communication-carousel";
import { DOEPHONE_BEIGE_SECTION } from "@/lib/doephone/section-styles";
import type { DoeHomeHeroHeadline } from "@/components/doephone/DoePhoneMobileView";

/** Desktop home — light Doe layout mirroring /proto, driven by the iPhone home content. */
export function DoeDesktopHome({
  logoLink = true,
  navActionLinksEnabled = true,
  navShowMailIcon = true,
  navShowInvestorsCta = true,
  heroHeadline,
  afterHero,
  shaderBeforeCardSlideIds,
  disableCarouselInteractions,
  hideActiveAgentsVisual,
  activeAgentsDescription,
  activeAgentsBeyond,
  activeAgentsSubheading,
  activeAgentsRoadmapDiagram,
  activeAgentsCallHistoryDiagram,
  activeAgentsClosingLabelCarousel,
  featureSlidesPhone,
  specialtyBeforeAgentsWorkflow = false,
  freezeSpecialtyMarquee = false,
  priorAuthAfterSpecialty = false,
  hideSectionsBelowIntro = false,
}: {
  logoLink?: boolean;
  navActionLinksEnabled?: boolean;
  navShowMailIcon?: boolean;
  navShowInvestorsCta?: boolean;
  heroHeadline?: DoeHomeHeroHeadline;
  afterHero?: ReactNode;
  shaderBeforeCardSlideIds?: readonly string[];
  disableCarouselInteractions?: boolean;
  hideActiveAgentsVisual?: boolean;
  activeAgentsDescription?: string;
  activeAgentsBeyond?: string;
  activeAgentsSubheading?: string;
  activeAgentsRoadmapDiagram?: boolean;
  activeAgentsCallHistoryDiagram?: boolean;
  activeAgentsClosingLabelCarousel?: boolean;
  featureSlidesPhone?: readonly DoePhoneCommunicationSlide[];
  specialtyBeforeAgentsWorkflow?: boolean;
  freezeSpecialtyMarquee?: boolean;
  priorAuthAfterSpecialty?: boolean;
  hideSectionsBelowIntro?: boolean;
} = {}) {
  const isDoeHealthLanding = featureSlidesPhone !== undefined;

  return (
    <div
      className={`doe-desktop-root relative overflow-x-hidden bg-[#faf0d8]${isDoeHealthLanding ? " doe-desktop-root--doehealth" : ""}`}
    >
      <div className="relative z-[40] overflow-x-clip overflow-y-visible">
        <DoePhoneHeroSection
          variant="desktop"
          iphoneBackdrop
          heroLine1={heroHeadline?.line1}
          heroLine2={heroHeadline?.line2}
          heroHeadlineClassName={heroHeadline?.className}
          heroHeadlineFitToContainer={heroHeadline?.fitToContainer}
          disableHeroOrbInteractions={disableCarouselInteractions}
        />

        <DesktopPunchedSiteNav
          logoLink={logoLink}
          navActionLinksEnabled={navActionLinksEnabled}
          navShowMailIcon={navShowMailIcon}
          navShowInvestorsCta={navShowInvestorsCta}
        />
      </div>

      <div className="relative z-10">
        {afterHero}

        {hideSectionsBelowIntro ? null : (
          <DoePhoneHomeFeatureStack
            shaderTheme="dusk"
            variant="desktop"
            shaderBeforeCardSlideIds={shaderBeforeCardSlideIds}
            disableCarouselInteractions={disableCarouselInteractions}
            hideActiveAgentsVisual={hideActiveAgentsVisual}
            activeAgentsDescription={activeAgentsDescription}
            activeAgentsBeyond={activeAgentsBeyond}
            activeAgentsSubheading={activeAgentsSubheading}
            activeAgentsRoadmapDiagram={activeAgentsRoadmapDiagram}
            activeAgentsCallHistoryDiagram={activeAgentsCallHistoryDiagram}
            activeAgentsClosingLabelCarousel={activeAgentsClosingLabelCarousel}
            featureSlidesPhone={featureSlidesPhone}
            specialtyBeforeAgentsWorkflow={specialtyBeforeAgentsWorkflow}
            freezeSpecialtyMarquee={freezeSpecialtyMarquee}
            priorAuthAfterSpecialty={priorAuthAfterSpecialty}
          />
        )}

        {hideSectionsBelowIntro ? null : (
          <section id="doe-vision" className={DOEPHONE_BEIGE_SECTION} aria-label="Closing">
            <DoePhoneClosingSection disableCarouselInteractions={disableCarouselInteractions} />
          </section>
        )}

        <HomeFooter linksDisabled={!navActionLinksEnabled} shaderTheme="dusk" />
      </div>
    </div>
  );
}
