"use client";

import { DoeDesktopFeatureSection } from "@/components/doephone/DoeDesktopFeatureSection";
import { DOEPHONE_COMMUNICATION_SLIDES } from "@/lib/doephone/communication-carousel";
import { doeDesktopFeatureCopy } from "@/lib/doephone/doe-desktop-feature-copy";

/** Desktop home — stacked feature sections matching the iPhone slide order and copy. */
export function DoeDesktopFeatureStack() {
  return (
    <>
      {DOEPHONE_COMMUNICATION_SLIDES.map((slide) => {
        const copy = doeDesktopFeatureCopy(slide.id);
        if (!copy) return null;

        return <DoeDesktopFeatureSection key={slide.id} slide={slide} copy={copy} />;
      })}
    </>
  );
}
