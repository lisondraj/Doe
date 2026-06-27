"use client";

import { DoePhoneSectionPlus, DoePhoneSectionTitle } from "@/components/doephone/DoePhoneSectionText";
import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import {
  DOEPHONE_SECTION_CONTENT_INSET,
  DOEPHONE_VIEWPORT_SECTION,
  DOEPHONE_VIEWPORT_SECTION_INNER,
} from "@/lib/doephone/section-styles";
import { DOEPHONE_HERO_BACKDROP } from "@/lib/workflow-carousel-design-backdrops";

/** Gradient viewport — Communication + Intelligence title. */
export function DoePhoneCommunicationIntelligenceSection() {
  const backdrop = {
    ...DOEPHONE_HERO_BACKDROP,
    lineOverlayOpacity: 0.14,
  };

  return (
    <section className={`${DOEPHONE_VIEWPORT_SECTION} flex flex-col overflow-hidden bg-[#1E343A]`} aria-label="Communication">
      <div className="pointer-events-none absolute -inset-[3%] overflow-hidden" aria-hidden>
        <WorkflowCarouselDesignBackdrop
          backdrop={backdrop}
          embedded
          gradientScale={1.52}
          patternScale={1}
        />
      </div>

      <div className={`relative z-10 ${DOEPHONE_VIEWPORT_SECTION_INNER}`}>
        <div className={DOEPHONE_SECTION_CONTENT_INSET}>
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
