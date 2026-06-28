"use client";

import { DoePhoneDesktopFrostPlusBadge } from "@/components/doephone/DoePhoneDesktopFrostPlusBadge";
import { DoePhoneSectionTitle } from "@/components/doephone/DoePhoneSectionText";
import { DoePhoneWorkflowVisual } from "@/components/doephone/DoePhoneWorkflowVisual";
import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import { DOEPHONE_COMMUNICATION_SLIDES } from "@/lib/doephone/communication-carousel";
import {
  DOEPHONE_DESKTOP_PAGE_INSET_X,
  DOEPHONE_SECTION_TITLE_PT,
} from "@/lib/doephone/section-styles";
import { doephoneSectionRevealStyleVars } from "@/lib/doephone/section-reveal-timing";
import {
  doePhoneSectionRevealSegmentClass,
  useDoePhoneSectionReveal,
} from "@/lib/doephone/use-doe-phone-section-reveal";
import type { CSSProperties } from "react";

const DOCUMENTS_SLIDE =
  DOEPHONE_COMMUNICATION_SLIDES.find((slide) => slide.id === "inbox") ??
  (() => {
    throw new Error("Missing documents communication slide");
  })();

const DESKTOP_DOCUMENTS_BADGE_INSET =
  "right-10 md:right-20 lg:right-28 xl:right-36 top-10 md:top-14 lg:top-16 xl:top-20";

/** Desktop documents band — mirrors integrations layout with Documents slide gradient, overlay, and workflow UI. */
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
          backdrop={DOCUMENTS_SLIDE.backdrop}
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
          className={`absolute z-30 ${DESKTOP_DOCUMENTS_BADGE_INSET} ${doePhoneSectionRevealSegmentClass("badge", revealed)}`}
        />

        <div className={`relative z-[20] flex flex-col ${DOEPHONE_SECTION_TITLE_PT}`}>
          <div className="relative pr-[clamp(5.5rem,8vw,7rem)]">
            <DoePhoneSectionTitle
              line1="Every document."
              line2="routed automatically."
              color="text-white"
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
