"use client";

import { DoePhoneSectionBoxCluster } from "@/components/doephone/DoePhoneSectionBoxCluster";
import { DoePhoneSectionTitle } from "@/components/doephone/DoePhoneSectionText";
import {
  DOEPHONE_SECTION_CAROUSEL_INSET_X,
  DOEPHONE_SECTION_CONTENT_INSET,
  DOEPHONE_SECTION_TITLE_CAROUSEL_GAP,
  DOEPHONE_SECTION_TITLE_PB,
  DOEPHONE_SECTION_TITLE_PT,
} from "@/lib/doephone/section-styles";

/** Second beige section — overall-page title + three-box cluster. */
export function DoePhoneCustomizationSection() {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className={`shrink-0 ${DOEPHONE_SECTION_CONTENT_INSET} ${DOEPHONE_SECTION_TITLE_PT}`}>
        <DoePhoneSectionTitle line1="Your practice," line2="your rules." />
      </div>

      <div
        className={`shrink-0 ${DOEPHONE_SECTION_TITLE_CAROUSEL_GAP} ${DOEPHONE_SECTION_CAROUSEL_INSET_X} ${DOEPHONE_SECTION_TITLE_PB}`}
      >
        <DoePhoneSectionBoxCluster />
      </div>
    </div>
  );
}
