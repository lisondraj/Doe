"use client";

import {
  DoePhoneAmbientPromptCard,
  PromptTag,
  WorkflowMentionAt,
} from "@/components/doephone/DoePhoneAmbientPromptCard";
import { DoePhoneSectionTitle } from "@/components/doephone/DoePhoneSectionText";
import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import { DOEPHONE_SECTION_TITLE_PT } from "@/lib/doephone/section-styles";
import { DOEPHONE_HERO_BACKDROP } from "@/lib/workflow-carousel-design-backdrops";

const DESKTOP_BUILD_INSET = "px-10 md:px-20 lg:px-28 xl:px-36";
const DESKTOP_BUILD_INPUT_INSET = "p-10 md:p-14 lg:p-16 xl:p-20";

/** Desktop third section — iPhone Build backdrop, title, and bottom-right workflow input. */
export function DoePhoneDesktopBuildSection() {
  const backdrop = {
    ...DOEPHONE_HERO_BACKDROP,
    lineOverlayOpacity: 0.14,
  };

  return (
    <section
      className="relative isolate z-10 min-h-[100dvh] w-full overflow-visible bg-[#1E343A]"
      aria-label="Build"
    >
      <div className="pointer-events-none absolute -inset-[3%] overflow-hidden" aria-hidden>
        <WorkflowCarouselDesignBackdrop
          backdrop={backdrop}
          embedded
          gradientScale={1.52}
          patternScale={1}
        />
      </div>

      <div className="relative z-[20] flex min-h-[100dvh] w-full flex-col">
        <div className={`shrink-0 ${DESKTOP_BUILD_INSET} ${DOEPHONE_SECTION_TITLE_PT}`}>
          <DoePhoneSectionTitle line1="Build." line2="Build." color="text-white" />
        </div>

        <div className={`absolute bottom-0 right-0 z-[30] ${DESKTOP_BUILD_INPUT_INSET}`}>
          <div className="w-[clamp(28rem,42vw,44rem)] max-w-[calc(100vw-2rem)]">
            <DoePhoneAmbientPromptCard
              headerLabel="New Workflow"
              layout="section"
              toolIcons="workflow"
              size="desktop"
            >
              Show me which patients have been enrolled in <PromptTag label="Clinical Trial #473" /> from my EMR,
              compile results in <PromptTag label="Excel" /> and integrate data from{" "}
              <PromptTag label="OpenEvidence" /> + email to <WorkflowMentionAt />
            </DoePhoneAmbientPromptCard>
          </div>
        </div>
      </div>
    </section>
  );
}
