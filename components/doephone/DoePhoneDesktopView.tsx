"use client";

import { DoeDesktopHome } from "@/components/doephone/DoeDesktopHome";
import { DoeHomeTopBanner } from "@/components/doephone/DoeHomeTopBanner";
import type { DoeHomeHeroHeadline } from "@/components/doephone/DoePhoneMobileView";
import type { DoeHomeTopBannerComponent } from "@/components/doephone/DoePhoneRouter";
import { useDesignersStaticNav } from "@/lib/designers/use-designers-static-nav";

export function DoePhoneDesktopView({
  TopBanner = DoeHomeTopBanner,
  heroHeadline,
  shaderBeforeCardSlideIds,
  disableCarouselInteractions,
}: {
  TopBanner?: DoeHomeTopBannerComponent;
  heroHeadline?: DoeHomeHeroHeadline;
  shaderBeforeCardSlideIds?: readonly string[];
  disableCarouselInteractions?: boolean;
} = {}) {
  const staticNav = useDesignersStaticNav();
  return (
    <>
      <TopBanner dismissPastHero />
      <DoeDesktopHome
        logoLink={!staticNav}
        navActionLinksEnabled={!staticNav}
        heroHeadline={heroHeadline}
        shaderBeforeCardSlideIds={shaderBeforeCardSlideIds}
        disableCarouselInteractions={disableCarouselInteractions}
      />
    </>
  );
}
