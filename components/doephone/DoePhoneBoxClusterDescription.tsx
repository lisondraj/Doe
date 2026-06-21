"use client";

import { DOEPHONE_BOX_CLUSTER_PRESETS } from "@/lib/doephone/section-box-cluster-backdrops";
import { DOEPHONE_SECTION_MENU_DESCRIPTION_TW } from "@/lib/doephone/section-styles";

/** Right-aligned three-line copy — tracks the active customization preset. */
export function DoePhoneBoxClusterDescription({ activeIndex }: { activeIndex: number }) {
  const preset = DOEPHONE_BOX_CLUSTER_PRESETS[activeIndex] ?? DOEPHONE_BOX_CLUSTER_PRESETS[0];

  return (
    <p
      key={preset.id}
      className={`ml-auto max-w-[min(100%,17.5rem)] text-right transition-opacity duration-300 ${DOEPHONE_SECTION_MENU_DESCRIPTION_TW}`}
      aria-live="polite"
    >
      {preset.description.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </p>
  );
}
