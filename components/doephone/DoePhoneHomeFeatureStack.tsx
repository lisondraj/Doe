"use client";

import { Fragment } from "react";

import { DoePhoneHomeFeatureCardSection } from "@/components/doephone/DoePhoneHomeFeatureCardSection";
import { DoePhoneHomeShaderBandSection } from "@/components/doephone/DoePhoneHomeShaderBandSection";
import { DoePhoneScrollRevealLift } from "@/components/doephone/DoePhoneScrollRevealLift";
import { DOEPHONE_HOME_FEATURE_SLIDES } from "@/lib/doephone/communication-carousel";
import { HOME_FEATURE_SECTION_TITLES } from "@/lib/doephone/home-feature-sections";

/** iPhone home — feature cards on sand bands with full-viewport shader bands after each. */
export function DoePhoneHomeFeatureStack({
  shaderTheme = "default",
}: {
  shaderTheme?: "default" | "dusk";
}) {
  return (
    <>
      {DOEPHONE_HOME_FEATURE_SLIDES.map((slide) => {
        const title = HOME_FEATURE_SECTION_TITLES[slide.id];
        const showSpecialtyColumns = slide.id === "front-desk";
        const showAgentsCarousel = slide.id === "agents";

        return (
          <Fragment key={slide.id}>
            <DoePhoneScrollRevealLift className="w-full shrink-0">
              <DoePhoneHomeFeatureCardSection
                slide={slide}
                titleLine1={title.line1}
                titleLine2={title.line2}
                shaderTheme={shaderTheme}
                showSpecialtyColumns={showSpecialtyColumns}
                showAgentsCarousel={showAgentsCarousel}
              />
            </DoePhoneScrollRevealLift>
            <DoePhoneScrollRevealLift className="w-full shrink-0">
              <DoePhoneHomeShaderBandSection slideId={slide.id} shaderTheme={shaderTheme} />
            </DoePhoneScrollRevealLift>
          </Fragment>
        );
      })}
    </>
  );
}
