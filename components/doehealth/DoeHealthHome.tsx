import { DoeHealthBlankViewportBand } from "@/components/doehealth/DoeHealthBlankViewportBand";
import { DoePhoneRouter } from "@/components/doephone/DoePhoneRouter";
import { DoeHealthTopBanner } from "@/components/doehealth/DoeHealthTopBanner";
import { DesignersPhoneCanvas } from "@/lib/designers/DesignersPhoneCanvas";
import { DOEHEALTH_ACTIVE_AGENTS_BEYOND, DOEHEALTH_ACTIVE_AGENTS_DESCRIPTION, DOEHEALTH_ACTIVE_AGENTS_SUBHEADING } from "@/lib/doehealth/doehealth-built-by-doctors-copy";
import { DOEHEALTH_DISABLE_CAROUSEL_INTERACTIONS, DOEHEALTH_HIDE_ACTIVE_AGENTS_VISUAL, DOEHEALTH_SHOW_CLOSING_LABEL_CAROUSEL, DOEHEALTH_SHOW_VOICE_ROADMAP_DIAGRAM, DOEHEALTH_SHADER_BEFORE_CARD_SLIDE_IDS } from "@/lib/doehealth/doehealth-feature-stack";
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
        hideActiveAgentsVisual={DOEHEALTH_HIDE_ACTIVE_AGENTS_VISUAL}
        activeAgentsDescription={DOEHEALTH_ACTIVE_AGENTS_DESCRIPTION}
        activeAgentsBeyond={DOEHEALTH_ACTIVE_AGENTS_BEYOND}
        activeAgentsSubheading={DOEHEALTH_ACTIVE_AGENTS_SUBHEADING}
        activeAgentsRoadmapDiagram={DOEHEALTH_SHOW_VOICE_ROADMAP_DIAGRAM}
        activeAgentsClosingLabelCarousel={DOEHEALTH_SHOW_CLOSING_LABEL_CAROUSEL}
      />
    </DesignersPhoneCanvas>
  );
}
