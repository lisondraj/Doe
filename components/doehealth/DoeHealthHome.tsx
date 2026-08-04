import { HomeBlogFeaturedCarouselSection } from "@/components/blog/HomeBlogFeaturedCarouselSection";
import { DoeHealthBrownBandStack } from "@/components/doehealth/DoeHealthBrownBandStack";
import { DoeHealthHomeTopBanner } from "@/components/doehealth/DoeHealthTopBanner";
import { DoePhoneRouter } from "@/components/doephone/DoePhoneRouter";
import { DesignersPhoneCanvas } from "@/lib/designers/DesignersPhoneCanvas";
import { DOEHEALTH_DISABLE_CAROUSEL_INTERACTIONS, DOEHEALTH_HIDE_SECTIONS_BELOW_INTRO, DOEHEALTH_HOME_FEATURE_SLIDES } from "@/lib/doehealth/doehealth-feature-stack";
import { DOEHEALTH_HERO_HEADLINE } from "@/lib/doehealth/doehealth-hero-copy";
import "@/lib/doehealth/doehealth-landing.css";

/**
 * doe.care and doehealth.care landing — fork of the primary home.
 * Edit this file (and app/doehealth/*) without changing /legacymain.
 */
export function DoeHealthHome() {
  return (
    <DesignersPhoneCanvas>
      <DoePhoneRouter
        TopBanner={DoeHealthHomeTopBanner}
        heroHeadline={DOEHEALTH_HERO_HEADLINE}
        afterHero={
          <>
            <HomeBlogFeaturedCarouselSection />
            <DoeHealthBrownBandStack />
          </>
        }
        hideSectionsBelowIntro={DOEHEALTH_HIDE_SECTIONS_BELOW_INTRO}
        featureSlidesPhone={DOEHEALTH_HOME_FEATURE_SLIDES}
        disableCarouselInteractions={DOEHEALTH_DISABLE_CAROUSEL_INTERACTIONS}
      />
    </DesignersPhoneCanvas>
  );
}
