"use client";

import { DoePhoneCommunicationOuterGlassPanel } from "@/components/doephone/DoePhoneCommunicationGlassPanels";
import { DoePhoneSectionTitle } from "@/components/doephone/DoePhoneSectionText";
import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import {
  DOEPHONE_SECTION_CONTENT_INSET,
  DOEPHONE_SECTION_TITLE_CAROUSEL_GAP,
  DOEPHONE_SECTION_TITLE_PB,
  DOEPHONE_SECTION_TITLE_PT,
  DOEPHONE_VIEWPORT_SECTION,
} from "@/lib/doephone/section-styles";
import { DOEPHONE_DEPLOYMENTS_GRADIENT } from "@/lib/doephone/communication-carousel";
import { DIAGNOSTIC_ASSISTANT_BACKDROP } from "@/lib/workflow-carousel-design-backdrops";

/** Gradient viewport — Intelligence built into your stack + outer glass panel. */
export function DoePhoneIntegrationsSection({
  sectionClassName = DOEPHONE_VIEWPORT_SECTION,
}: {
  sectionClassName?: string;
}) {
  return (
    <section className={sectionClassName} aria-label="Integrations">
      <div className="pointer-events-none absolute -inset-[3%] overflow-hidden" aria-hidden>
        <WorkflowCarouselDesignBackdrop
          backdrop={DIAGNOSTIC_ASSISTANT_BACKDROP}
          embedded
          gradientOverride={DOEPHONE_DEPLOYMENTS_GRADIENT}
          gradientScale={1}
        />
      </div>

      <div className="relative z-10 flex h-full min-h-0 flex-col">
        <div className={`shrink-0 ${DOEPHONE_SECTION_CONTENT_INSET} ${DOEPHONE_SECTION_TITLE_PT}`}>
          <DoePhoneSectionTitle
            line1="Intelligence built."
            line2="into your stack."
            color="text-white"
          />
        </div>

        <div
          className={`shrink-0 overflow-hidden ${DOEPHONE_SECTION_TITLE_CAROUSEL_GAP} ${DOEPHONE_SECTION_TITLE_PB}`}
        >
          <DoePhoneCommunicationOuterGlassPanel />
        </div>
      </div>
    </section>
  );
}
