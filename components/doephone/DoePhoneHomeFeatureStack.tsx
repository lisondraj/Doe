"use client";

import { Fragment } from "react";

import { DoePhoneHomeFeatureCardSection } from "@/components/doephone/DoePhoneHomeFeatureCardSection";
import { DoePhoneHomeShaderBandSection } from "@/components/doephone/DoePhoneHomeShaderBandSection";
import { DOEPHONE_COMMUNICATION_SLIDES } from "@/lib/doephone/communication-carousel";
import { HOME_FEATURE_SECTION_TITLES } from "@/lib/doephone/home-feature-sections";

/** iPhone home — feature cards on sand bands with full-viewport shader bands after each. */
export function DoePhoneHomeFeatureStack({
  shaderTheme = "default",
}: {
  shaderTheme?: "default" | "dusk";
}) {
  return (
    <>
      {DOEPHONE_COMMUNICATION_SLIDES.map((slide) => {
        const title = HOME_FEATURE_SECTION_TITLES[slide.id];
        const moveCardToBand = slide.id === "front-desk";

        return (
          <Fragment key={slide.id}>
            {moveCardToBand ? null : (
              <DoePhoneHomeFeatureCardSection
                slide={slide}
                titleLine1={title.line1}
                titleLine2={title.line2}
                shaderTheme={shaderTheme}
              />
            )}
            <DoePhoneHomeShaderBandSection
              slideId={slide.id}
              shaderTheme={shaderTheme}
              featureSlide={moveCardToBand ? slide : undefined}
              titleLine1={moveCardToBand ? title.line1 : undefined}
              titleLine2={moveCardToBand ? title.line2 : undefined}
            />
          </Fragment>
        );
      })}
    </>
  );
}
