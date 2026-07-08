"use client";

import { DoePhoneHomeSectionWorkflowInput } from "@/components/doephone/DoePhoneHomeSectionWorkflowInput";
import { DoePhoneReviewPackageVisual } from "@/components/doephone/DoePhoneReviewPackageVisual";
import { ProtoGrainGradient } from "@/components/proto/ProtoGrainGradient";
import type { DoePhoneCommunicationSlide } from "@/lib/doephone/communication-carousel";
import {
  DOEPHONE_DISPLAY_WEIGHT_TW,
  DOEPHONE_MAIN_PAGE_VIEWPORT_SECTION,
  DOEPHONE_SECTION_CAROUSEL_INSET_X,
  DOEPHONE_VIEWPORT_SECTION,
} from "@/lib/doephone/section-styles";
import { suisseIntl } from "@/lib/home/fonts";
import { doeHomeDuskShaderBandSurface, doeHomeShaderBandSurface } from "@/lib/proto/proto-shader-backdrop-colors";

/** Full-viewport shader band — empty spacer between feature cards. */
export function DoePhoneHomeShaderBandSection({
  slideId,
  shaderTheme = "default",
  showWorkflowInput = false,
  showActiveAgents = false,
}: {
  slideId: DoePhoneCommunicationSlide["id"];
  shaderTheme?: "default" | "dusk";
  showWorkflowInput?: boolean;
  showActiveAgents?: boolean;
}) {
  const shader =
    shaderTheme === "dusk"
      ? doeHomeDuskShaderBandSurface(slideId)
      : doeHomeShaderBandSurface(slideId);

  const sectionShell =
    showWorkflowInput || showActiveAgents
      ? `${DOEPHONE_VIEWPORT_SECTION} flex flex-col`
      : DOEPHONE_MAIN_PAGE_VIEWPORT_SECTION;

  const sectionLabel = showWorkflowInput
    ? "Customize agents"
    : showActiveAgents
      ? "Agents"
      : undefined;

  return (
    <section
      className={`home-feature-shader-band${showWorkflowInput ? " home-feature-shader-band--workflow" : ""}${showActiveAgents ? " home-feature-shader-band--active-agents" : ""} ${sectionShell}`}
      aria-label={sectionLabel}
      aria-hidden={sectionLabel ? undefined : true}
    >
      {shader ? (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <ProtoGrainGradient
            variant={shader.variant}
            colors={shader.colors}
            colorBack={shader.colorBack}
            static
          />
        </div>
      ) : null}

      {showWorkflowInput ? (
        <div className="home-feature-shader-band__workflow-shell relative z-[10] flex h-full min-h-0 w-full flex-col">
          <h2
            className={`home-feature-shader-band__workflow-title home-feature-card-section__title home-feature-card-section__title--feature-lead text-left ${DOEPHONE_DISPLAY_WEIGHT_TW} leading-[1.02] tracking-[-0.03em] ${DOEPHONE_SECTION_CAROUSEL_INSET_X} ${suisseIntl.className}`}
          >
            <span className="block">Customize agents</span>
            <span className="block">to fix your needs.</span>
          </h2>
          <div className="flex min-h-0 flex-1 flex-col items-stretch justify-center">
            <DoePhoneHomeSectionWorkflowInput />
          </div>
        </div>
      ) : null}

      {showActiveAgents ? (
        <div className="home-feature-shader-band__active-agents-shell relative z-[10] flex h-full min-h-0 w-full flex-1 flex-col items-center justify-center">
          <DoePhoneReviewPackageVisual />
        </div>
      ) : null}
    </section>
  );
}
