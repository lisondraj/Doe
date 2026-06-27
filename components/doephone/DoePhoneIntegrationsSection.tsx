"use client";

import { DoePhoneCommunicationOuterGlassPanel } from "@/components/doephone/DoePhoneCommunicationGlassPanels";
import { DoePhoneSectionTitle } from "@/components/doephone/DoePhoneSectionText";
import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import {
  DOEPHONE_SECTION_CONTENT_INSET,
  DOEPHONE_VIEWPORT_SECTION,
  DOEPHONE_VIEWPORT_SECTION_INNER,
  DOEPHONE_VIEWPORT_SECTION_STACK_GAP,
} from "@/lib/doephone/section-styles";
import { DIAGNOSTIC_ASSISTANT_BACKDROP } from "@/lib/workflow-carousel-design-backdrops";

/** Gradient viewport — Intelligence built into your stack + outer glass panel. */
export function DoePhoneIntegrationsSection() {
  return (
    <section className={`${DOEPHONE_VIEWPORT_SECTION} flex flex-col overflow-hidden bg-[#1E343A]`} aria-label="Integrations">
      <div className="pointer-events-none absolute -inset-[3%] overflow-hidden" aria-hidden>
        <WorkflowCarouselDesignBackdrop backdrop={DIAGNOSTIC_ASSISTANT_BACKDROP} embedded gradientScale={1.12} />
      </div>

      <div className={`relative z-10 ${DOEPHONE_VIEWPORT_SECTION_INNER}`}>
        <div className={DOEPHONE_SECTION_CONTENT_INSET}>
          <DoePhoneSectionTitle
            line1="Intelligence built."
            line2="into your stack."
            color="text-white"
          />
        </div>

        <div className={`overflow-hidden ${DOEPHONE_VIEWPORT_SECTION_STACK_GAP}`}>
          <DoePhoneCommunicationOuterGlassPanel viewport />
        </div>
      </div>
    </section>
  );
}
