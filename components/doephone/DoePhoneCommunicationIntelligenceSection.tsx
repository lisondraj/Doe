"use client";

import { DoePhoneCommIntelGrid } from "@/components/doephone/DoePhoneCommIntelGrid";
import { DoePhoneSectionPlus, DoePhoneSectionTitle } from "@/components/doephone/DoePhoneSectionText";
import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import {
  DOEPHONE_SECTION_CONTENT_INSET,
  DOEPHONE_SECTION_TITLE_PT,
  DOEPHONE_VIEWPORT_SECTION,
} from "@/lib/doephone/section-styles";
import { CARE_COORDINATION_BACKDROP } from "@/lib/workflow-carousel-design-backdrops";

/** Gradient viewport — Communication + Intelligence title and 3×3 feature grid. */
export function DoePhoneCommunicationIntelligenceSection() {
  return (
    <section className={`${DOEPHONE_VIEWPORT_SECTION} overflow-hidden bg-[#D2774C]`} aria-label="Communication">
      <div className="pointer-events-none absolute -inset-[3%] overflow-hidden" aria-hidden>
        <WorkflowCarouselDesignBackdrop
          backdrop={CARE_COORDINATION_BACKDROP}
          embedded
          gradientScale={1.52}
        />
      </div>

      <div className="relative z-10 flex h-full min-h-0 flex-col">
        <div className={`shrink-0 ${DOEPHONE_SECTION_CONTENT_INSET} ${DOEPHONE_SECTION_TITLE_PT}`}>
          <DoePhoneSectionTitle
            line1="Communication"
            line2={
              <>
                <DoePhoneSectionPlus />
                Intelligence.
              </>
            }
            color="text-white"
          />
        </div>

        {/*
          * Grid pushed to the bottom of the section via mt-auto.
          * translateY(22%) nudges it past the section's bottom edge so
          * the lower rows are cut off by overflow-hidden on the section.
          */}
        <div
          className="mt-auto shrink-0"
          style={{ transform: "translateY(22%)" }}
        >
          <DoePhoneCommIntelGrid />
        </div>
      </div>
    </section>
  );
}
