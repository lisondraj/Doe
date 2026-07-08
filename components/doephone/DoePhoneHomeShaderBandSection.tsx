"use client";

import { DoePhoneHomeSectionWorkflowInput } from "@/components/doephone/DoePhoneHomeSectionWorkflowInput";
import { ProtoGrainGradient } from "@/components/proto/ProtoGrainGradient";
import type { DoePhoneCommunicationSlide } from "@/lib/doephone/communication-carousel";
import { DOEPHONE_MAIN_PAGE_VIEWPORT_SECTION, DOEPHONE_VIEWPORT_SECTION } from "@/lib/doephone/section-styles";
import { doeHomeDuskShaderBandSurface, doeHomeShaderBandSurface } from "@/lib/proto/proto-shader-backdrop-colors";

/** Full-viewport shader band — empty spacer between feature cards. */
export function DoePhoneHomeShaderBandSection({
  slideId,
  shaderTheme = "default",
  showWorkflowInput = false,
}: {
  slideId: DoePhoneCommunicationSlide["id"];
  shaderTheme?: "default" | "dusk";
  showWorkflowInput?: boolean;
}) {
  const shader =
    shaderTheme === "dusk"
      ? doeHomeDuskShaderBandSurface(slideId)
      : doeHomeShaderBandSurface(slideId);

  const sectionShell = showWorkflowInput
    ? `${DOEPHONE_VIEWPORT_SECTION} flex flex-col`
    : DOEPHONE_MAIN_PAGE_VIEWPORT_SECTION;

  return (
    <section
      className={`home-feature-shader-band${showWorkflowInput ? " home-feature-shader-band--workflow" : ""} ${sectionShell}`}
      aria-label={showWorkflowInput ? "Build" : undefined}
      aria-hidden={showWorkflowInput ? undefined : true}
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
        <div className="home-feature-shader-band__workflow-shell relative z-[10] flex h-full min-h-0 w-full flex-col items-center justify-center">
          <DoePhoneHomeSectionWorkflowInput />
        </div>
      ) : null}
    </section>
  );
}
