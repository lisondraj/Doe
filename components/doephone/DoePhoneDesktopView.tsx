"use client";

import { DoeDesktopHome } from "@/components/doephone/DoeDesktopHome";
import { DoeHomeTopBanner } from "@/components/doephone/DoeHomeTopBanner";
import type { DoeHomeHeroHeadline } from "@/components/doephone/DoePhoneMobileView";
import type { DoeHomeTopBannerComponent } from "@/components/doephone/DoePhoneRouter";
import { useDesignersStaticNav } from "@/lib/designers/use-designers-static-nav";
import { useDoeHealthLandingNavContext } from "@/lib/doehealth/doehealth-nav-chrome";

export function DoePhoneDesktopView({
  TopBanner = DoeHomeTopBanner,
  heroHeadline,
  shaderBeforeCardSlideIds,
  disableCarouselInteractions,
  hideActiveAgentsVisual,
  activeAgentsDescription,
  activeAgentsBeyond,
  activeAgentsSubheading,
  activeAgentsRoadmapDiagram,
  activeAgentsClosingLabelCarousel,
}: {
  TopBanner?: DoeHomeTopBannerComponent;
  heroHeadline?: DoeHomeHeroHeadline;
  shaderBeforeCardSlideIds?: readonly string[];
  disableCarouselInteractions?: boolean;
  hideActiveAgentsVisual?: boolean;
  activeAgentsDescription?: string;
  activeAgentsBeyond?: string;
  activeAgentsSubheading?: string;
  activeAgentsRoadmapDiagram?: boolean;
  activeAgentsClosingLabelCarousel?: boolean;
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
        shaderBeforeCardSlideIds={shaderBeforeCardSlideIds}
        disableCarouselInteractions={disableCarouselInteractions}
        hideActiveAgentsVisual={hideActiveAgentsVisual}
        activeAgentsDescription={activeAgentsDescription}
        activeAgentsBeyond={activeAgentsBeyond}
        activeAgentsSubheading={activeAgentsSubheading}
        activeAgentsRoadmapDiagram={activeAgentsRoadmapDiagram}
        activeAgentsClosingLabelCarousel={activeAgentsClosingLabelCarousel}
      />
    </>
  );
}
