"use client";

import { DoePhoneCommunicationShortcuts } from "@/components/doephone/DoePhoneCommunicationShortcuts";
import { DoePhoneSectionPlus, DoePhoneSectionTitle } from "@/components/doephone/DoePhoneSectionText";
import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import {
  DOEPHONE_SECTION_CONTENT_INSET,
  DOEPHONE_SECTION_TITLE_PT,
  DOEPHONE_VIEWPORT_SECTION,
} from "@/lib/doephone/section-styles";
import { CARE_COORDINATION_BACKDROP } from "@/lib/workflow-carousel-design-backdrops";

/** Gradient viewport — Communication + Intelligence title and shortcut array. */
export function DoePhoneCommunicationIntelligenceSection() {
  return (
    <section className={`${DOEPHONE_VIEWPORT_SECTION} overflow-hidden bg-[#F7F6F3]`} aria-label="Communication">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <WorkflowCarouselDesignBackdrop
          backdrop={CARE_COORDINATION_BACKDROP}
          embedded
          gradientScale={1.38}
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

        <div className="relative flex min-h-0 flex-1 items-center overflow-hidden pb-[max(1.95rem,calc(env(safe-area-inset-bottom,0px)+7.25svh))] pt-[clamp(1.5rem,1rem+2.5vmin,3rem)]">
          <DoePhoneCommunicationShortcuts />
        </div>
      </div>
    </section>
  );
}
