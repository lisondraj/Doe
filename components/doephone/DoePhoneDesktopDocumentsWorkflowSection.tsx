"use client";

import { DoePhoneDesktopFrostPlusBadge } from "@/components/doephone/DoePhoneDesktopFrostPlusBadge";
import { DoePhoneSectionTitle } from "@/components/doephone/DoePhoneSectionText";
import { DoePhoneWorkflowVisual } from "@/components/doephone/DoePhoneWorkflowVisual";
import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import {
  DESKTOP_FULLSCREEN_SECTION_BADGE_INSET,
  DESKTOP_FULLSCREEN_SECTION_TITLE_PT,
  DESKTOP_FULLSCREEN_SECTION_TITLE_TW,
  DOEPHONE_DESKTOP_PAGE_INSET_X,
} from "@/lib/doephone/section-styles";
import { doephoneSectionRevealStyleVars } from "@/lib/doephone/section-reveal-timing";
import {
  doePhoneSectionRevealSegmentClass,
  useDoePhoneSectionReveal,
} from "@/lib/doephone/use-doe-phone-section-reveal";
import { DOEPHONE_HERO_BACKDROP } from "@/lib/workflow-carousel-design-backdrops";
import type { CSSProperties } from "react";

const DOCUMENTS_BAND_BACKDROP = {
  ...DOEPHONE_HERO_BACKDROP,
  grid: "wave" as const,
};

/** Desktop documents band — Build hero gradient with wave overlay and workflow UI centered. */
export function DoePhoneDesktopDocumentsWorkflowSection() {
  const { ref: sectionRef, revealed } = useDoePhoneSectionReveal();

  return (
    <section
      className="relative isolate z-10 min-h-[112vh] w-full overflow-hidden bg-[#1E343A]"
      style={doephoneSectionRevealStyleVars() as CSSProperties}
      aria-label="Documents workflow"
    >
      <div className="pointer-events-none absolute -inset-[3%] overflow-hidden" aria-hidden>
        <WorkflowCarouselDesignBackdrop
          backdrop={DOCUMENTS_BAND_BACKDROP}
          embedded
          gradientScale={1.18}
          patternScale={1.12}
        />
      </div>

      <div
        ref={sectionRef}
        className={`relative z-[20] min-h-[112vh] w-full ${DOEPHONE_DESKTOP_PAGE_INSET_X}`}
      >
        <DoePhoneDesktopFrostPlusBadge
          className={`absolute z-30 ${DESKTOP_FULLSCREEN_SECTION_BADGE_INSET} ${doePhoneSectionRevealSegmentClass("badge", revealed)}`}
        />

        <div className={`relative z-[20] flex flex-col ${DESKTOP_FULLSCREEN_SECTION_TITLE_PT}`}>
          <div className="relative pr-[clamp(5.5rem,8vw,7rem)]">
            <DoePhoneSectionTitle
              line1="Every document."
              line2="routed automatically."
              color="text-white"
              copyClassName={DESKTOP_FULLSCREEN_SECTION_TITLE_TW}
              segmentedReveal
              revealed={revealed}
            />
          </div>
        </div>

        <div
          className={`pointer-events-none absolute inset-0 z-[20] flex items-center justify-center px-[clamp(1.5rem,3vw,3rem)] ${doePhoneSectionRevealSegmentClass("input", revealed)}`}
        >
          <div className="pointer-events-auto w-full max-w-[min(100%,40rem)]">
            <DoePhoneWorkflowVisual layout="desktop" />
          </div>
        </div>
      </div>
    </section>
  );
}
