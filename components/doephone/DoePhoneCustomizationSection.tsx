"use client";

import { DoePhoneBoxClusterDescription } from "@/components/doephone/DoePhoneBoxClusterDescription";
import { DoePhoneBoxClusterMenu } from "@/components/doephone/DoePhoneBoxClusterMenu";
import { DoePhoneSectionBoxCluster } from "@/components/doephone/DoePhoneSectionBoxCluster";
import { DoePhoneSectionTitle } from "@/components/doephone/DoePhoneSectionText";
import {
  DOEPHONE_BOX_CLUSTER_VIEWPORT_HEIGHT,
  DOEPHONE_SECTION_CAROUSEL_INSET_X,
  DOEPHONE_SECTION_CAROUSEL_MENU_GAP,
  DOEPHONE_SECTION_CONTENT_INSET,
  DOEPHONE_VIEWPORT_SECTION_INNER,
  DOEPHONE_VIEWPORT_SECTION_STACK_GAP,
} from "@/lib/doephone/section-styles";
import { useState } from "react";

/** Customization beige section — title, box cluster, description, and feature menu. */
export function DoePhoneCustomizationSection() {
  const [activePreset, setActivePreset] = useState(0);

  return (
    <div className={DOEPHONE_VIEWPORT_SECTION_INNER}>
      <div className={DOEPHONE_SECTION_CAROUSEL_INSET_X}>
        <div className={DOEPHONE_SECTION_CONTENT_INSET}>
          <DoePhoneSectionTitle line1="Your practice," line2="your rules." />
        </div>

        <div className={DOEPHONE_VIEWPORT_SECTION_STACK_GAP}>
          <DoePhoneSectionBoxCluster
            activeIndex={activePreset}
            stageHeightClass={DOEPHONE_BOX_CLUSTER_VIEWPORT_HEIGHT}
          />

          <div className={DOEPHONE_VIEWPORT_SECTION_STACK_GAP}>
            <DoePhoneBoxClusterDescription activeIndex={activePreset} />
          </div>

          <div className={DOEPHONE_SECTION_CAROUSEL_MENU_GAP}>
            <DoePhoneBoxClusterMenu activeIndex={activePreset} onSelect={setActivePreset} />
          </div>
        </div>
      </div>
    </div>
  );
}
