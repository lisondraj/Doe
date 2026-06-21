"use client";

import { DOEPHONE_BOX_CLUSTER_PRESETS } from "@/lib/doephone/section-box-cluster-backdrops";
import {
  DOEPHONE_SECTION_MENU_DESCRIPTION_HEADING_TW,
  DOEPHONE_SECTION_MENU_DESCRIPTION_TW,
} from "@/lib/doephone/section-styles";

/** Preset heading + three-line copy — sits below the box cluster. */
export function DoePhoneBoxClusterDescription({ activeIndex }: { activeIndex: number }) {
  const preset = DOEPHONE_BOX_CLUSTER_PRESETS[activeIndex] ?? DOEPHONE_BOX_CLUSTER_PRESETS[0];

  return (
    <div key={preset.id} className="text-left" aria-live="polite">
      <h3 className={DOEPHONE_SECTION_MENU_DESCRIPTION_HEADING_TW}>{preset.menuLabel}</h3>
      <p className={DOEPHONE_SECTION_MENU_DESCRIPTION_TW}>
        {preset.description.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </p>
    </div>
  );
}
