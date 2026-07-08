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
      className={`flex w-full flex-col bg-[var(--doe-page-surface,#EDE8DF)] ${DOE_DESKTOP_FEATURE_BAND_H}`}
      aria-label={slide.menuLabel}
    >
      <div
        className={`flex h-full min-h-0 flex-1 flex-col ${DOE_DESKTOP_PAGE_INSET_X} ${DOE_DESKTOP_FEATURE_SECTION_PAD}`}
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
