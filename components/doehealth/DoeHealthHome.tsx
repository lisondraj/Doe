import { DoeHealthBrownBandStack } from "@/components/doehealth/DoeHealthBrownBandStack";
import { DoePhoneRouter } from "@/components/doephone/DoePhoneRouter";
import { DoeHealthTopBanner } from "@/components/doehealth/DoeHealthTopBanner";
import { DesignersPhoneCanvas } from "@/lib/designers/DesignersPhoneCanvas";
import { DOEHEALTH_DISABLE_CAROUSEL_INTERACTIONS, DOEHEALTH_HIDE_SECTIONS_BELOW_INTRO, DOEHEALTH_HOME_FEATURE_SLIDES } from "@/lib/doehealth/doehealth-feature-stack";
import { DOEHEALTH_HERO_HEADLINE } from "@/lib/doehealth/doehealth-hero-copy";
import "@/lib/doehealth/doehealth-landing.css";

/**
 * doehealth.care landing — fork of the primary home.
 * Edit this file (and app/doehealth/*) without changing doe.care/.
 */
export function DoeHealthHome() {
  return (
    <DesignersPhoneCanvas>
      <DoePhoneRouter
        TopBanner={DoeHealthTopBanner}
        heroHeadline={DOEHEALTH_HERO_HEADLINE}
        afterHero={<DoeHealthBrownBandStack />}
        hideSectionsBelowIntro={DOEHEALTH_HIDE_SECTIONS_BELOW_INTRO}
        featureSlidesPhone={DOEHEALTH_HOME_FEATURE_SLIDES}
        disableCarouselInteractions={DOEHEALTH_DISABLE_CAROUSEL_INTERACTIONS}
      />
    </DesignersPhoneCanvas>
  );
}
