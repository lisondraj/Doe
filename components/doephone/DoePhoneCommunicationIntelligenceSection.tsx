"use client";

import { DoePhoneSectionPlus, DoePhoneSectionTitle } from "@/components/doephone/DoePhoneSectionText";
import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import {
  DOEPHONE_SECTION_CONTENT_INSET,
  DOEPHONE_SECTION_TITLE_PT,
  DOEPHONE_VIEWPORT_SECTION,
} from "@/lib/doephone/section-styles";
import { DOEPHONE_HERO_BACKDROP } from "@/lib/workflow-carousel-design-backdrops";

/** Gradient viewport — Communication + Intelligence title. */
export function DoePhoneCommunicationIntelligenceSection({
  sectionClassName = DOEPHONE_VIEWPORT_SECTION,
}: {
  sectionClassName?: string;
}) {
  const backdrop = {
    ...DOEPHONE_HERO_BACKDROP,
    lineOverlayOpacity: 0.14,
  };

  return (
    <section className={sectionClassName} aria-label="Communication">
      <div className="pointer-events-none absolute -inset-[3%] overflow-hidden" aria-hidden>
        <WorkflowCarouselDesignBackdrop
          backdrop={backdrop}
          embedded
          gradientScale={1.52}
          patternScale={1}
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
      </div>
    </section>
  );
}
