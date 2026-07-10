"use client";

import { DoePhoneClosingFeatureStack } from "@/components/doephone/DoePhoneClosingFeatureStack";
import { DoePhoneSectionTitle } from "@/components/doephone/DoePhoneSectionText";
import {
  DOEPHONE_SECTION_CAROUSEL_INSET_X,
  DOEPHONE_SECTION_CONTENT_INSET,
  DOEPHONE_SECTION_TITLE_CAROUSEL_GAP,
  DOEPHONE_SECTION_TITLE_PB,
  DOEPHONE_SECTION_TITLE_PT,
} from "@/lib/doephone/section-styles";

/** Closing beige section — title and stacked feature cards. */
export function DoePhoneClosingSection({ suppressTitleReveal = false }: { suppressTitleReveal?: boolean }) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className={`shrink-0 ${DOEPHONE_SECTION_CONTENT_INSET} ${DOEPHONE_SECTION_TITLE_PT}`}>
        <DoePhoneSectionTitle
          line1="More about"
          line2="the Doe vision."
          suppressReveal={suppressTitleReveal}
        />
      </div>

      <div
        className={`shrink-0 ${DOEPHONE_SECTION_TITLE_CAROUSEL_GAP} ${DOEPHONE_SECTION_CAROUSEL_INSET_X} ${DOEPHONE_SECTION_TITLE_PB}`}
      >
        <DoePhoneClosingFeatureStack />
      </div>
    </div>
  );
}
