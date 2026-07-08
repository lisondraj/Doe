"use client";

import { DoeDesktopFeatureSectionCopy } from "@/components/doephone/DoeDesktopFeatureSectionCopy";
import { DoeDesktopPanelSection } from "@/components/doephone/DoeDesktopPanelSection";
import type { DoePhoneCommunicationSlide } from "@/lib/doephone/communication-carousel";
import type { DoeDesktopFeatureCopy } from "@/lib/doephone/doe-desktop-feature-copy";
import {
  DOE_DESKTOP_FEATURE_BAND_H,
  DOE_DESKTOP_FEATURE_COPY_PT,
  DOE_DESKTOP_PAGE_INSET_X,
} from "@/lib/doephone/doe-desktop-layout-styles";
import { DESKTOP_HOME_FIXED_NAV_HEIGHT } from "@/lib/doephone/section-styles";
import type { CSSProperties } from "react";

const FEATURE_SECTION_PAD_STYLE: CSSProperties = {
  paddingTop: `calc(${DESKTOP_HOME_FIXED_NAV_HEIGHT} + var(--desktop-section-pad-y, 2.5rem))`,
  paddingBottom: "var(--desktop-section-pad-y, 2.5rem)",
};

/** Desktop home — one feature slide: gradient panel + title/description copy. */
export function DoeDesktopFeatureSection({
  slide,
  copy,
}: {
  slide: DoePhoneCommunicationSlide;
  copy: DoeDesktopFeatureCopy;
}) {
  return (
    <section
      className={`box-border flex w-full flex-col overflow-hidden bg-[var(--doe-page-surface,#EDE8DF)] ${DOE_DESKTOP_FEATURE_BAND_H}`}
      aria-label={slide.menuLabel}
    >
      <div
        className={`flex h-full min-h-0 flex-1 flex-col ${DOE_DESKTOP_PAGE_INSET_X}`}
        style={FEATURE_SECTION_PAD_STYLE}
      >
        <div className="flex min-h-0 flex-1 flex-col">
          <DoeDesktopPanelSection slide={slide} />
        </div>

        <div className={`shrink-0 ${DOE_DESKTOP_FEATURE_COPY_PT}`}>
          <DoeDesktopFeatureSectionCopy copy={copy} />
        </div>
      </div>
    </section>
  );
}
