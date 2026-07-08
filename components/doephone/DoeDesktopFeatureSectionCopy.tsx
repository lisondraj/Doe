"use client";

import type { DoeDesktopFeatureCopy } from "@/lib/doephone/doe-desktop-feature-copy";
import {
  DOE_DESKTOP_FEATURE_DESC_TW,
  DOE_DESKTOP_FEATURE_TITLE_TW,
} from "@/lib/doephone/doe-desktop-layout-styles";
import { inter, suisseIntl } from "@/lib/home/fonts";

/** Two-line title + short description beneath a desktop feature panel. */
export function DoeDesktopFeatureSectionCopy({ copy }: { copy: DoeDesktopFeatureCopy }) {
  return (
    <div className="w-full min-w-0">
      <h2 className={`${DOE_DESKTOP_FEATURE_TITLE_TW} ${suisseIntl.className}`}>
        <span className="block">{copy.titleLine1}</span>
        <span className="block">{copy.titleLine2}</span>
      </h2>
      <p className={`${DOE_DESKTOP_FEATURE_DESC_TW} ${inter.className}`}>{copy.description}</p>
    </div>
  );
}
