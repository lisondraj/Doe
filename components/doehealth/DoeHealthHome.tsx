import { DoeHealthBlankViewportBand } from "@/components/doehealth/DoeHealthBlankViewportBand";
import { DoePhoneRouter } from "@/components/doephone/DoePhoneRouter";
import { DoeHealthTopBanner } from "@/components/doehealth/DoeHealthTopBanner";
import { DesignersPhoneCanvas } from "@/lib/designers/DesignersPhoneCanvas";
import { DOEHEALTH_DISABLE_CAROUSEL_INTERACTIONS, DOEHEALTH_SHADER_BEFORE_CARD_SLIDE_IDS } from "@/lib/doehealth/doehealth-feature-stack";
import { DOEHEALTH_HERO_HEADLINE } from "@/lib/doehealth/doehealth-hero-copy";

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
        afterHero={<DoeHealthBlankViewportBand />}
        shaderBeforeCardSlideIds={DOEHEALTH_SHADER_BEFORE_CARD_SLIDE_IDS}
        disableCarouselInteractions={DOEHEALTH_DISABLE_CAROUSEL_INTERACTIONS}
      />
    </DesignersPhoneCanvas>
  );
}
