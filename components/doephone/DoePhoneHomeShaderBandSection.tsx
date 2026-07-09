"use client";

import { DoePhoneHomeCallLogicDiagram } from "@/components/doephone/DoePhoneHomeCallLogicDiagram";
import { DoePhoneHomeGuardrailsVisual } from "@/components/doephone/DoePhoneHomeGuardrailsVisual";
import { DoePhoneHomeLabAlertsVisual } from "@/components/doephone/DoePhoneHomeLabAlertsVisual";
import { DoePhoneHomeVoiceCallSummaryVisual } from "@/components/doephone/DoePhoneHomeVoiceCallSummaryVisual";
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

type ShaderBandFeature = "workflow" | "active-agents" | "call-summaries" | "lab-alerts" | "guardrails";

const SHADER_BAND_FEATURES: Partial<Record<DoePhoneCommunicationSlide["id"], ShaderBandFeature>> = {
  agents: "active-agents",
  "front-desk": "workflow",
  inbox: "call-summaries",
  ambient: "lab-alerts",
  prototype: "guardrails",
};

const SHADER_BAND_TITLES: Record<ShaderBandFeature, readonly [string, string]> = {
  workflow: ["Customize agents", "to fix your needs."],
  "active-agents": ["Active Agents", ""],
  "call-summaries": ["Every call becomes", "a chart-ready note."],
  "lab-alerts": ["Catch critical labs", "before rounds."],
  guardrails: ["Roll out agents", "with guardrails."],
};

const SHADER_BAND_LABELS: Record<ShaderBandFeature, string> = {
  workflow: "Customize agents",
  "active-agents": "Active Agents",
  "call-summaries": "Voice call summaries",
  "lab-alerts": "Critical lab voice alerts",
  guardrails: "Agent guardrails",
};

const SHADER_BAND_MODIFIER: Record<ShaderBandFeature, string> = {
  workflow: "home-feature-shader-band--workflow",
  "active-agents": "home-feature-shader-band--active-agents",
  "call-summaries": "home-feature-shader-band--call-summaries",
  "lab-alerts": "home-feature-shader-band--lab-alerts",
  guardrails: "home-feature-shader-band--guardrails",
};

/** Full-viewport shader band — spacer or feature showcase between feature cards. */
export function DoePhoneHomeShaderBandSection({
  slideId,
  shaderTheme = "default",
}: {
  slideId: DoePhoneCommunicationSlide["id"];
  shaderTheme?: "default" | "dusk";
}) {
  const feature = SHADER_BAND_FEATURES[slideId];
  const shader =
    shaderTheme === "dusk"
      ? doeHomeDuskShaderBandSurface(slideId)
      : doeHomeShaderBandSurface(slideId);

  const sectionShell = feature ? `${DOEPHONE_VIEWPORT_SECTION} flex flex-col` : DOEPHONE_MAIN_PAGE_VIEWPORT_SECTION;
  const sectionLabel = feature ? SHADER_BAND_LABELS[feature] : undefined;
  const [titleLine1, titleLine2] = feature ? SHADER_BAND_TITLES[feature] : ["", ""];

  return (
    <section
      className={`home-feature-shader-band${feature ? ` ${SHADER_BAND_MODIFIER[feature]}` : ""} ${sectionShell}`}
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

      {feature === "workflow" ? (
        <div className="home-feature-shader-band__workflow-shell relative z-[10] flex h-full min-h-0 w-full flex-col">
          <h2
            className={`home-feature-shader-band__workflow-title home-feature-card-section__title home-feature-card-section__title--feature-lead text-left ${DOEPHONE_DISPLAY_WEIGHT_TW} leading-[1.02] tracking-[-0.03em] ${DOEPHONE_SECTION_CAROUSEL_INSET_X} ${suisseIntl.className}`}
          >
            <span className="block">{titleLine1}</span>
            <span className="block">{titleLine2}</span>
          </h2>
          <div className="home-feature-shader-band__call-logic-shell flex min-h-0 flex-1 flex-col items-center justify-center">
            <div className="home-feature-section__call-logic-diagram relative z-[20] w-full shrink-0">
              <div className="home-call-logic-diagram-scale">
                <DoePhoneHomeCallLogicDiagram />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {feature === "active-agents" ? (
        <div className="home-feature-shader-band__active-agents-shell relative z-[10] flex h-full min-h-0 w-full flex-1 flex-col items-center justify-center">
          <DoePhoneReviewPackageVisual />
        </div>
      ) : null}

      {feature === "call-summaries" ? (
        <div className="home-feature-shader-band__feature-shell relative z-[10] flex h-full min-h-0 w-full flex-col">
          <h2
            className={`home-feature-shader-band__feature-title home-feature-card-section__title home-feature-card-section__title--feature-lead text-left ${DOEPHONE_DISPLAY_WEIGHT_TW} leading-[1.02] tracking-[-0.03em] ${DOEPHONE_SECTION_CAROUSEL_INSET_X} ${suisseIntl.className}`}
          >
            <span className="block">{titleLine1}</span>
            <span className="block">{titleLine2}</span>
          </h2>
          <div className="home-feature-shader-band__feature-content flex min-h-0 flex-1 flex-col items-center justify-center">
            <div className="home-feature-section__call-summaries relative z-[20] w-full shrink-0">
              <div className="home-call-summaries-scale">
                <DoePhoneHomeVoiceCallSummaryVisual />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {feature === "lab-alerts" ? (
        <div className="home-feature-shader-band__feature-shell relative z-[10] flex h-full min-h-0 w-full flex-col">
          <h2
            className={`home-feature-shader-band__feature-title home-feature-card-section__title home-feature-card-section__title--feature-lead text-left ${DOEPHONE_DISPLAY_WEIGHT_TW} leading-[1.02] tracking-[-0.03em] ${DOEPHONE_SECTION_CAROUSEL_INSET_X} ${suisseIntl.className}`}
          >
            <span className="block">{titleLine1}</span>
            <span className="block">{titleLine2}</span>
          </h2>
          <div className="home-feature-shader-band__feature-content flex min-h-0 flex-1 flex-col items-center justify-center">
            <div className="home-feature-section__lab-alerts relative z-[20] w-full shrink-0">
              <div className="home-lab-alerts-scale">
                <DoePhoneHomeLabAlertsVisual />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {feature === "guardrails" ? (
        <div className="home-feature-shader-band__feature-shell relative z-[10] flex h-full min-h-0 w-full flex-col">
          <h2
            className={`home-feature-shader-band__feature-title home-feature-card-section__title home-feature-card-section__title--feature-lead text-left ${DOEPHONE_DISPLAY_WEIGHT_TW} leading-[1.02] tracking-[-0.03em] ${DOEPHONE_SECTION_CAROUSEL_INSET_X} ${suisseIntl.className}`}
          >
            <span className="block">{titleLine1}</span>
            <span className="block">{titleLine2}</span>
          </h2>
          <div className="home-feature-shader-band__feature-content flex min-h-0 flex-1 flex-col items-center justify-center">
            <div className="home-feature-section__guardrails relative z-[20] w-full shrink-0">
              <div className="home-guardrails-scale">
                <DoePhoneHomeGuardrailsVisual />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
