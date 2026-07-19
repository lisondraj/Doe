"use client";

import { Fragment } from "react";

import { DoePhoneHomeFeatureCardSection } from "@/components/doephone/DoePhoneHomeFeatureCardSection";
import { DoePhoneHomeShaderBandSection } from "@/components/doephone/DoePhoneHomeShaderBandSection";
import {
  DOEPHONE_HOME_FEATURE_SLIDES,
  DOEPHONE_HOME_FEATURE_SLIDES_DESKTOP,
} from "@/lib/doephone/communication-carousel";
import { HOME_FEATURE_SECTION_TITLES } from "@/lib/doephone/home-feature-sections";
import type { DoePhoneVariant } from "@/lib/doephone/resolve-doe-phone-variant";

/** Home feature bands — iPhone uses default slide order; desktop swaps call history and specialty. */
export function DoePhoneHomeFeatureStack({
  shaderTheme = "default",
  variant = "phone",
  shaderBeforeCardSlideIds = [],
  disableCarouselInteractions = false,
  activeAgentsDescription,
}: {
  shaderTheme?: "default" | "dusk";
  variant?: DoePhoneVariant;
  shaderBeforeCardSlideIds?: readonly string[];
  disableCarouselInteractions?: boolean;
  activeAgentsDescription?: string;
}) {
  const slides = variant === "desktop" ? DOEPHONE_HOME_FEATURE_SLIDES_DESKTOP : DOEPHONE_HOME_FEATURE_SLIDES;

  return (
    <>
      {slides.map((slide, index) => {
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
          />
        );
        const shaderSection = (
          <DoePhoneHomeShaderBandSection
            slideId={slide.id}
            shaderTheme={shaderTheme}
            activeAgentsDescription={slide.id === "agents" ? activeAgentsDescription : undefined}
          />
        );

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
