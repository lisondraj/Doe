"use client";

import { Fragment } from "react";

import { DoePhoneHomeFeatureCardSection } from "@/components/doephone/DoePhoneHomeFeatureCardSection";
import { DoePhoneHomeShaderBandSection } from "@/components/doephone/DoePhoneHomeShaderBandSection";
import { DOEPHONE_COMMUNICATION_SLIDES } from "@/lib/doephone/communication-carousel";
import { HOME_FEATURE_SECTION_TITLES } from "@/lib/doephone/home-feature-sections";

/** iPhone home — six feature cards on sand bands, shader spacers between. */
export function DoePhoneHomeFeatureStack() {
  return (
    <>
      {DOEPHONE_COMMUNICATION_SLIDES.map((slide, index) => {
        const title = HOME_FEATURE_SECTION_TITLES[slide.id];

        return (
          <Fragment key={slide.id}>
            <DoePhoneHomeFeatureCardSection
              slide={slide}
              titleLine1={title.line1}
              titleLine2={title.line2}
            />
            {index < DOEPHONE_COMMUNICATION_SLIDES.length - 1 ? (
              <DoePhoneHomeShaderBandSection slideId={slide.id} />
            ) : null}
          </Fragment>
        );
      })}
    </>
  );
}
