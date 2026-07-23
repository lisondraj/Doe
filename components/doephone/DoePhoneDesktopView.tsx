"use client";

import type { ReactNode } from "react";

import { DoeDesktopHome } from "@/components/doephone/DoeDesktopHome";
import { DoeHomeTopBanner } from "@/components/doephone/DoeHomeTopBanner";
import type { DoeHomeHeroHeadline } from "@/components/doephone/DoePhoneMobileView";
import type { DoeHomeTopBannerComponent } from "@/components/doephone/DoePhoneRouter";
import type { DoePhoneCommunicationSlide } from "@/lib/doephone/communication-carousel";
import { useDesignersStaticNav } from "@/lib/designers/use-designers-static-nav";
import { useDoeHealthLandingNavContext } from "@/lib/doehealth/doehealth-nav-chrome";

export function DoePhoneDesktopView({
  TopBanner = DoeHomeTopBanner,
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
  specialtyBeforeAgentsWorkflow,
  freezeSpecialtyMarquee,
  priorAuthAfterSpecialty,
  hideSectionsBelowIntro,
}: {
  TopBanner?: DoeHomeTopBannerComponent;
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
  const staticNav = useDesignersStaticNav();
  const isDoeHealthNav = useDoeHealthLandingNavContext();
  return (
    <>
      <TopBanner dismissPastHero />
      <DoeDesktopHome
        logoLink={!staticNav}
        navActionLinksEnabled={!staticNav}
        navShowInvestorsCta={false}
        navShowMailIcon={isDoeHealthNav}
        heroHeadline={heroHeadline}
        afterHero={afterHero}
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
        hideSectionsBelowIntro={hideSectionsBelowIntro}
      />
    </>
  );
}
