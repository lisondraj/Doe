"use client";

import { DoePhoneClosingFeatureStack } from "@/components/doephone/DoePhoneClosingFeatureStack";
import { DoePhoneScrollRevealContent } from "@/components/doephone/DoePhoneScrollRevealLift";
import { DoePhoneSectionTitle } from "@/components/doephone/DoePhoneSectionText";
import {
  DOEPHONE_SECTION_CAROUSEL_INSET_X,
  DOEPHONE_SECTION_CONTENT_INSET,
  DOEPHONE_SECTION_TITLE_CAROUSEL_GAP,
  DOEPHONE_SECTION_TITLE_PB,
  DOEPHONE_SECTION_TITLE_PT,
} from "@/lib/doephone/section-styles";
import { doephoneHomeScrollRevealStyleVars } from "@/lib/doephone/section-reveal-timing";
import { useDoePhoneSectionReveal } from "@/lib/doephone/use-doe-phone-section-reveal";
import type { CSSProperties } from "react";

/** Closing beige section — title and stacked feature cards. */
export function DoePhoneClosingSection() {
  const { ref: revealRef, revealed } = useDoePhoneSectionReveal(0.18, {
    rootMargin: "0px 0px 8% 0px",
  });

  return (
    <div
      ref={revealRef}
      className="flex h-full min-h-0 flex-col"
      style={doephoneHomeScrollRevealStyleVars() as CSSProperties}
    >
      <div className={`shrink-0 ${DOEPHONE_SECTION_CONTENT_INSET} ${DOEPHONE_SECTION_TITLE_PT}`}>
        <DoePhoneScrollRevealContent revealed={revealed} segment="title">
          <DoePhoneSectionTitle line1="More about" line2="the Doe vision." suppressReveal />
        </DoePhoneScrollRevealContent>
      </div>

      <div
        className={`shrink-0 ${DOEPHONE_SECTION_TITLE_CAROUSEL_GAP} ${DOEPHONE_SECTION_CAROUSEL_INSET_X} ${DOEPHONE_SECTION_TITLE_PB}`}
      >
        <DoePhoneScrollRevealContent revealed={revealed} segment="carousel">
          <DoePhoneClosingFeatureStack />
        </DoePhoneScrollRevealContent>
      </div>
    </div>
  );
}
