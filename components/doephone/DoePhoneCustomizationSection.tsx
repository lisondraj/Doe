"use client";

import { DoePhoneBoxClusterDescription } from "@/components/doephone/DoePhoneBoxClusterDescription";
import { DoePhoneBoxClusterMenu } from "@/components/doephone/DoePhoneBoxClusterMenu";
import { DoePhoneSectionBoxCluster } from "@/components/doephone/DoePhoneSectionBoxCluster";
import { DoePhoneSectionTitle } from "@/components/doephone/DoePhoneSectionText";
import {
  DOEPHONE_SECTION_CAROUSEL_INSET_X,
  DOEPHONE_SECTION_CAROUSEL_MENU_GAP,
  DOEPHONE_SECTION_CONTENT_INSET,
  DOEPHONE_SECTION_TITLE_CAROUSEL_GAP,
  DOEPHONE_SECTION_TITLE_PB,
  DOEPHONE_SECTION_TITLE_PT,
} from "@/lib/doephone/section-styles";
import { useState } from "react";

/** Second beige section — title, box cluster, description, and feature menu. */
export function DoePhoneCustomizationSection() {
  const [activePreset, setActivePreset] = useState(0);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className={`shrink-0 ${DOEPHONE_SECTION_CONTENT_INSET} ${DOEPHONE_SECTION_TITLE_PT}`}>
        <DoePhoneSectionTitle line1="Your practice," line2="your rules." />
      </div>

      <div
        className={`shrink-0 ${DOEPHONE_SECTION_TITLE_CAROUSEL_GAP} ${DOEPHONE_SECTION_CAROUSEL_INSET_X} ${DOEPHONE_SECTION_TITLE_PB}`}
      >
        <DoePhoneSectionBoxCluster activeIndex={activePreset} />

        <div className={DOEPHONE_SECTION_TITLE_CAROUSEL_GAP}>
          <DoePhoneBoxClusterDescription activeIndex={activePreset} />
        </div>

        <div className={DOEPHONE_SECTION_CAROUSEL_MENU_GAP}>
          <DoePhoneBoxClusterMenu activeIndex={activePreset} onSelect={setActivePreset} />
        </div>
      </div>
    </div>
  );
}
