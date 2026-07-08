"use client";

import { DoeDesktopFeatureSectionCopy } from "@/components/doephone/DoeDesktopFeatureSectionCopy";
import { DoeDesktopPanelSection } from "@/components/doephone/DoeDesktopPanelSection";
import type { DoePhoneCommunicationSlide } from "@/lib/doephone/communication-carousel";
import type { DoeDesktopFeatureCopy } from "@/lib/doephone/doe-desktop-feature-copy";
import {
  DOE_DESKTOP_FEATURE_BAND_H,
  DOE_DESKTOP_FEATURE_COPY_PT,
  DOE_DESKTOP_FEATURE_SECTION_PAD,
  DOE_DESKTOP_PAGE_INSET_X,
} from "@/lib/doephone/doe-desktop-layout-styles";
import { DESKTOP_HOME_FIXED_NAV_HEIGHT } from "@/lib/doephone/section-styles";

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
      <div className="shrink-0" style={{ height: DESKTOP_HOME_FIXED_NAV_HEIGHT }} aria-hidden />
      <div
        className={`flex min-h-0 flex-1 flex-col justify-center ${DOE_DESKTOP_PAGE_INSET_X} ${DOE_DESKTOP_FEATURE_SECTION_PAD}`}
      >
        <div className="flex min-h-0 w-full flex-none flex-col">
          <DoeDesktopPanelSection slide={slide} />
        </div>

        <div className={`shrink-0 ${DOE_DESKTOP_FEATURE_COPY_PT}`}>
          <DoeDesktopFeatureSectionCopy copy={copy} />
        </div>
      </div>
    </section>
  );
}
