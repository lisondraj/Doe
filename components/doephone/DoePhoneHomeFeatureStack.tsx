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
}: {
  shaderTheme?: "default" | "dusk";
  variant?: DoePhoneVariant;
}) {
  const slides = variant === "desktop" ? DOEPHONE_HOME_FEATURE_SLIDES_DESKTOP : DOEPHONE_HOME_FEATURE_SLIDES;

  return (
    <>
      {slides.map((slide, index) => {
        const title = HOME_FEATURE_SECTION_TITLES[slide.id];
        const showSpecialtyColumns = slide.id === "front-desk";
        const showAgentsCarousel = slide.id === "agents";

        return (
          <Fragment key={slide.id}>
            <DoePhoneHomeFeatureCardSection
              slide={slide}
              titleLine1={title.line1}
              titleLine2={title.line2}
              shaderTheme={shaderTheme}
              showSpecialtyColumns={showSpecialtyColumns}
              showAgentsCarousel={showAgentsCarousel}
              isFirstBelowHero={index === 0}
            />
            <DoePhoneHomeShaderBandSection slideId={slide.id} shaderTheme={shaderTheme} />
          </Fragment>
        );
      })}
    </>
  );
}
