"use client";

import {
  DoePhoneAmbientPromptCard,
  PromptTag,
  WorkflowMentionAt,
} from "@/components/doephone/DoePhoneAmbientPromptCard";
import { DoePhoneSectionTitle } from "@/components/doephone/DoePhoneSectionText";
import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import {
  DOEPHONE_SECTION_CAROUSEL_INSET_X,
  DOEPHONE_SECTION_CONTENT_INSET,
  DOEPHONE_SECTION_TITLE_CAROUSEL_GAP,
  DOEPHONE_SECTION_TITLE_PT,
  DOEPHONE_VIEWPORT_SECTION,
} from "@/lib/doephone/section-styles";
import { DOEPHONE_HERO_BACKDROP } from "@/lib/workflow-carousel-design-backdrops";

/** Gradient viewport — Build. Build. Build. title + workflow prompt. */
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
    <section className={sectionClassName} aria-label="Build">
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
            line1="Build."
            line2="Build."
            line3="Build."
            color="text-white"
          />
        </div>

        <div className={`shrink-0 ${DOEPHONE_SECTION_CAROUSEL_INSET_X} ${DOEPHONE_SECTION_TITLE_CAROUSEL_GAP}`}>
          <DoePhoneAmbientPromptCard headerLabel="New Workflow" layout="section" toolIcons="workflow">
            Show me which patients have been enrolled in <PromptTag label="Clinical Trial #473" /> from my EMR,
            compile results in <PromptTag label="Excel" /> and integrate data from{" "}
            <PromptTag label="OpenEvidence" /> + email to <WorkflowMentionAt />
          </DoePhoneAmbientPromptCard>
        </div>
      </div>
    </section>
  );
}
