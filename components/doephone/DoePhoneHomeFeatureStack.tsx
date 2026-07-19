"use client";

import { Fragment } from "react";

import { DoePhoneHomeFeatureCardSection } from "@/components/doephone/DoePhoneHomeFeatureCardSection";
import { DoePhoneHomeShaderBandSection } from "@/components/doephone/DoePhoneHomeShaderBandSection";
import {
  DOEPHONE_HOME_FEATURE_SLIDES,
  DOEPHONE_HOME_FEATURE_SLIDES_DESKTOP,
  type DoePhoneCommunicationSlide,
} from "@/lib/doephone/communication-carousel";
import { HOME_FEATURE_SECTION_TITLES } from "@/lib/doephone/home-feature-sections";
import type { DoePhoneVariant } from "@/lib/doephone/resolve-doe-phone-variant";

/** Home feature bands — iPhone uses default slide order; desktop swaps call history and specialty. */
export function DoePhoneHomeFeatureStack({
  shaderTheme = "default",
  variant = "phone",
  shaderBeforeCardSlideIds = [],
  disableCarouselInteractions = false,
  hideActiveAgentsVisual = false,
  activeAgentsDescription,
  activeAgentsBeyond,
  activeAgentsSubheading,
  activeAgentsRoadmapDiagram,
  activeAgentsClosingLabelCarousel,
  featureSlidesPhone,
  specialtyBeforeAgentsWorkflow = false,
  freezeSpecialtyMarquee = false,
  priorAuthAfterSpecialty = false,
}: {
  shaderTheme?: "default" | "dusk";
  variant?: DoePhoneVariant;
  shaderBeforeCardSlideIds?: readonly string[];
  disableCarouselInteractions?: boolean;
  hideActiveAgentsVisual?: boolean;
  activeAgentsDescription?: string;
  activeAgentsBeyond?: string;
  activeAgentsSubheading?: string;
  activeAgentsRoadmapDiagram?: boolean;
  activeAgentsClosingLabelCarousel?: boolean;
  /** Overrides default phone feature slide order (e.g. /doehealth). */
  featureSlidesPhone?: readonly DoePhoneCommunicationSlide[];
  /** /doehealth — specialty band between Built by doctors shader and workflow carousel. */
  specialtyBeforeAgentsWorkflow?: boolean;
  freezeSpecialtyMarquee?: boolean;
  /** /doehealth — inbox card + prior auth shader immediately after specialty band. */
  priorAuthAfterSpecialty?: boolean;
}) {
  const slides =
    variant === "desktop"
      ? DOEPHONE_HOME_FEATURE_SLIDES_DESKTOP
      : (featureSlidesPhone ?? DOEPHONE_HOME_FEATURE_SLIDES);

  const frontDeskSlide = slides.find((entry) => entry.id === "front-desk");
  const frontDeskTitle = HOME_FEATURE_SECTION_TITLES["front-desk"];
  const inboxSlide = slides.find((entry) => entry.id === "inbox");
  const inboxTitle = inboxSlide ? HOME_FEATURE_SECTION_TITLES[inboxSlide.id] : undefined;

  return (
    <>
      {slides.map((slide, index) => {
        if (specialtyBeforeAgentsWorkflow && slide.id === "front-desk") {
          return null;
        }
        if (priorAuthAfterSpecialty && slide.id === "inbox") {
          return null;
        }

        const title = HOME_FEATURE_SECTION_TITLES[slide.id];
        const showSpecialtyColumns = slide.id === "front-desk";
        const showAgentsCarousel = slide.id === "agents";
        const shaderFirst = shaderBeforeCardSlideIds.includes(slide.id);

        const cardSection = (
          <DoePhoneHomeFeatureCardSection
            slide={slide}
            titleLine1={title.line1}
            titleLine2={title.line2}
            shaderTheme={shaderTheme}
            showSpecialtyColumns={showSpecialtyColumns}
            showAgentsCarousel={showAgentsCarousel}
            isFirstBelowHero={index === 0 && !shaderFirst}
            disableCarouselInteractions={disableCarouselInteractions}
            freezeSpecialtyMarquee={freezeSpecialtyMarquee}
          />
        );
        const shaderSection = (
          <DoePhoneHomeShaderBandSection
            slideId={slide.id}
            shaderTheme={shaderTheme}
            activeAgentsDescription={slide.id === "agents" ? activeAgentsDescription : undefined}
            activeAgentsBeyond={slide.id === "agents" ? activeAgentsBeyond : undefined}
            activeAgentsSubheading={slide.id === "agents" ? activeAgentsSubheading : undefined}
            activeAgentsRoadmapDiagram={slide.id === "agents" ? activeAgentsRoadmapDiagram : undefined}
            activeAgentsClosingLabelCarousel={
              slide.id === "agents" ? activeAgentsClosingLabelCarousel : undefined
            }
            hideActiveAgentsVisual={slide.id === "agents" ? hideActiveAgentsVisual : undefined}
          />
        );

        const specialtyBand =
          specialtyBeforeAgentsWorkflow && frontDeskSlide && frontDeskTitle ? (
            <DoePhoneHomeFeatureCardSection
              key="front-desk-in-agents-flow"
              slide={frontDeskSlide}
              titleLine1={frontDeskTitle.line1}
              titleLine2={frontDeskTitle.line2}
              shaderTheme={shaderTheme}
              showSpecialtyColumns
              disableCarouselInteractions={disableCarouselInteractions}
              freezeSpecialtyMarquee={freezeSpecialtyMarquee}
            />
          ) : null;

        const priorAuthAfterSpecialtyBlock =
          priorAuthAfterSpecialty && inboxSlide && inboxTitle ? (
            <Fragment key="inbox-after-specialty">
              <DoePhoneHomeFeatureCardSection
                slide={inboxSlide}
                titleLine1={inboxTitle.line1}
                titleLine2={inboxTitle.line2}
                shaderTheme={shaderTheme}
                disableCarouselInteractions={disableCarouselInteractions}
              />
              <DoePhoneHomeShaderBandSection slideId={inboxSlide.id} shaderTheme={shaderTheme} />
            </Fragment>
          ) : null;

        if (specialtyBeforeAgentsWorkflow && slide.id === "agents" && shaderFirst) {
          return (
            <Fragment key={slide.id}>
              {shaderSection}
              {specialtyBand}
              {priorAuthAfterSpecialtyBlock}
              {cardSection}
            </Fragment>
          );
        }

        return (
          <Fragment key={slide.id}>
            {shaderFirst ? shaderSection : cardSection}
            {shaderFirst ? cardSection : shaderSection}
          </Fragment>
        );
      })}
    </>
  );
}
