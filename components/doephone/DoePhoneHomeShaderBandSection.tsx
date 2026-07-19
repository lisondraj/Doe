"use client";

import { DoePhoneHomeCallLogicDiagram } from "@/components/doephone/DoePhoneHomeCallLogicDiagram";
import { DoePhoneHomeGuardrailsVisual } from "@/components/doephone/DoePhoneHomeGuardrailsVisual";
import { DoePhoneHomeLabAlertsVisual } from "@/components/doephone/DoePhoneHomeLabAlertsVisual";
import { DoePhoneHomePriorAuthVisual } from "@/components/doephone/DoePhoneHomePriorAuthVisual";
import { DoePhoneReviewPackageVisual } from "@/components/doephone/DoePhoneReviewPackageVisual";
import { DoePhoneScrollRevealContent } from "@/components/doephone/DoePhoneScrollRevealLift";
import { ProtoGrainGradient } from "@/components/proto/ProtoGrainGradient";
import type { DoePhoneCommunicationSlide } from "@/lib/doephone/communication-carousel";
import {
  DOEPHONE_DISPLAY_WEIGHT_TW,
  DOEPHONE_MAIN_PAGE_VIEWPORT_SECTION,
  DOEPHONE_SECTION_CAROUSEL_INSET_X,
  DOEPHONE_VIEWPORT_SECTION,
} from "@/lib/doephone/section-styles";
import { suisseIntl, inter } from "@/lib/home/fonts";
import { doephoneHomeScrollRevealStyleVars, doephoneHomeSectionRevealObserverOptions } from "@/lib/doephone/section-reveal-timing";
import { useDoePhoneSectionReveal } from "@/lib/doephone/use-doe-phone-section-reveal";
import { doeHomeDuskShaderBandSurface, doeHomeShaderBandSurface } from "@/lib/proto/proto-shader-backdrop-colors";
import { useLayoutEffect, useState, type CSSProperties } from "react";
import {
  DOEPHONE_DESKTOP_MEDIA_QUERY,
  readBootstrappedDoePhoneVariant,
  resolveDoePhoneVariant,
  type DoePhoneVariant,
} from "@/lib/doephone/resolve-doe-phone-variant";

type ShaderBandFeature = "workflow" | "active-agents" | "call-summaries" | "lab-alerts" | "guardrails";

const SHADER_BAND_FEATURES: Partial<Record<DoePhoneCommunicationSlide["id"], ShaderBandFeature>> = {
  agents: "active-agents",
  "front-desk": "workflow",
  inbox: "call-summaries",
  ambient: "lab-alerts",
  prototype: "guardrails",
};

const SHADER_BAND_TITLES: Record<ShaderBandFeature, readonly [string, string]> = {
  workflow: ["Customize agents", "to fit your needs."],
  "active-agents": ["Built by doctors,", "for doctors"],
  "call-summaries": ["Prior auth ships.", "From the chart."],
  "lab-alerts": ["Outreach lands.", "Visits get booked."],
  guardrails: ["Roll out agents", "with guardrails."],
};

const SHADER_BAND_LABELS: Record<ShaderBandFeature, string> = {
  workflow: "Customize agents",
  "active-agents": "Built by doctors",
  "call-summaries": "Prior auth agent",
  "lab-alerts": "Patient recall outreach",
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
  activeAgentsDescription,
}: {
  slideId: DoePhoneCommunicationSlide["id"];
  shaderTheme?: "default" | "dusk";
  activeAgentsDescription?: string;
}) {
  const feature = SHADER_BAND_FEATURES[slideId];
  const shader =
    shaderTheme === "dusk"
      ? doeHomeDuskShaderBandSurface(slideId)
      : doeHomeShaderBandSurface(slideId);

  const sectionShell = feature ? `${DOEPHONE_VIEWPORT_SECTION} flex flex-col` : DOEPHONE_MAIN_PAGE_VIEWPORT_SECTION;
  const sectionLabel = feature ? SHADER_BAND_LABELS[feature] : undefined;
  const [titleLine1, titleLine2] = feature ? SHADER_BAND_TITLES[feature] : ["", ""];
  const bootVariant = readBootstrappedDoePhoneVariant();
  const revealObserver = doephoneHomeSectionRevealObserverOptions(bootVariant);
  const [layoutVariant, setLayoutVariant] = useState<DoePhoneVariant>(bootVariant);
  const { ref: revealRef, revealed } = useDoePhoneSectionReveal(revealObserver.threshold, {
    rootMargin: revealObserver.rootMargin,
  });
  const revealStyle = doephoneHomeScrollRevealStyleVars(layoutVariant) as CSSProperties;
  const visualLayout = layoutVariant === "desktop" ? "desktop" : "phone";

  useLayoutEffect(() => {
    setLayoutVariant(readBootstrappedDoePhoneVariant());
    const sync = () => setLayoutVariant(resolveDoePhoneVariant());
    const mq = window.matchMedia(DOEPHONE_DESKTOP_MEDIA_QUERY);
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

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
        <div
          ref={revealRef}
          className="home-feature-shader-band__workflow-shell relative z-[10] flex h-full min-h-0 w-full flex-col"
          style={revealStyle}
        >
          <DoePhoneScrollRevealContent revealed={revealed} segment="title">
            <h2
              className={`home-feature-shader-band__workflow-title home-feature-card-section__title home-feature-card-section__title--feature-lead text-left ${DOEPHONE_DISPLAY_WEIGHT_TW} leading-[1.02] tracking-[-0.03em] ${DOEPHONE_SECTION_CAROUSEL_INSET_X} ${suisseIntl.className}`}
            >
              <span className="block">{titleLine1}</span>
              <span className="block">{titleLine2}</span>
            </h2>
          </DoePhoneScrollRevealContent>
          <div className="home-feature-shader-band__call-logic-bleed-stage">
            <div className="home-call-logic-diagram-scale home-call-logic-diagram-scale--bleed">
              <DoePhoneScrollRevealContent revealed={revealed} segment="carousel" className="h-full w-full">
                <DoePhoneHomeCallLogicDiagram />
              </DoePhoneScrollRevealContent>
            </div>
          </div>
        </div>
      ) : null}

      {feature === "active-agents" ? (
        <div
          ref={revealRef}
          className="home-feature-shader-band__feature-shell relative z-[10] flex h-full min-h-0 w-full flex-col"
          style={revealStyle}
        >
          <DoePhoneScrollRevealContent revealed={revealed} segment="title">
            <h2
              className={`home-feature-shader-band__feature-title home-feature-card-section__title home-feature-card-section__title--feature-lead text-left ${DOEPHONE_DISPLAY_WEIGHT_TW} leading-[1.02] tracking-[-0.03em] ${DOEPHONE_SECTION_CAROUSEL_INSET_X} ${suisseIntl.className}`}
            >
              <span className="block">{titleLine1}</span>
              <span className="block">{titleLine2}</span>
            </h2>
            {activeAgentsDescription ? (
              <p
                className={`home-feature-shader-band__feature-description m-0 text-left ${DOEPHONE_SECTION_CAROUSEL_INSET_X} ${inter.className}`}
              >
                {activeAgentsDescription}
              </p>
            ) : null}
          </DoePhoneScrollRevealContent>
          <div className="home-feature-shader-band__feature-content home-feature-shader-band__active-agents-content flex min-h-0 flex-1 flex-col">
            <DoePhoneScrollRevealContent revealed={revealed} segment="carousel" className="h-full min-h-0 w-full flex-1">
              <DoePhoneReviewPackageVisual layout={visualLayout} showTitle={false} />
            </DoePhoneScrollRevealContent>
          </div>
        </div>
      ) : null}

      {feature === "call-summaries" ? (
        <div
          ref={revealRef}
          className="home-feature-shader-band__feature-shell relative z-[10] flex h-full min-h-0 w-full flex-col"
          style={revealStyle}
        >
          <DoePhoneScrollRevealContent revealed={revealed} segment="title">
            <h2
              className={`home-feature-shader-band__feature-title home-feature-card-section__title home-feature-card-section__title--feature-lead text-left ${DOEPHONE_DISPLAY_WEIGHT_TW} leading-[1.02] tracking-[-0.03em] ${DOEPHONE_SECTION_CAROUSEL_INSET_X} ${suisseIntl.className}`}
            >
              <span className="block">{titleLine1}</span>
              <span className="block">{titleLine2}</span>
            </h2>
          </DoePhoneScrollRevealContent>
          <div className="home-feature-shader-band__feature-content flex min-h-0 flex-1 flex-col items-center justify-center">
            <DoePhoneScrollRevealContent revealed={revealed} segment="carousel" className="w-full">
              <div className="home-feature-section__prior-auth relative z-[20] w-full min-h-0 flex-1">
                <DoePhoneHomePriorAuthVisual />
              </div>
            </DoePhoneScrollRevealContent>
          </div>
        </div>
      ) : null}

      {feature === "lab-alerts" ? (
        <div
          ref={revealRef}
          className="home-feature-shader-band__feature-shell relative z-[10] flex h-full min-h-0 w-full flex-col"
          style={revealStyle}
        >
          <DoePhoneScrollRevealContent revealed={revealed} segment="title">
            <h2
              className={`home-feature-shader-band__feature-title home-feature-card-section__title home-feature-card-section__title--feature-lead text-left ${DOEPHONE_DISPLAY_WEIGHT_TW} leading-[1.02] tracking-[-0.03em] ${DOEPHONE_SECTION_CAROUSEL_INSET_X} ${suisseIntl.className}`}
            >
              <span className="block">{titleLine1}</span>
              <span className="block">{titleLine2}</span>
            </h2>
          </DoePhoneScrollRevealContent>
          <div className="home-feature-shader-band__feature-content flex min-h-0 flex-1 flex-col items-center justify-center">
            <DoePhoneScrollRevealContent revealed={revealed} segment="carousel" className="w-full">
              <div className="home-feature-section__lab-alerts relative z-[20] w-full min-h-0 flex-1">
                <DoePhoneHomeLabAlertsVisual />
              </div>
            </DoePhoneScrollRevealContent>
          </div>
        </div>
      ) : null}

      {feature === "guardrails" ? (
        <div
          ref={revealRef}
          className="home-feature-shader-band__feature-shell relative z-[10] flex h-full min-h-0 w-full flex-col"
          style={revealStyle}
        >
          <DoePhoneScrollRevealContent revealed={revealed} segment="title">
            <h2
              className={`home-feature-shader-band__feature-title home-feature-card-section__title home-feature-card-section__title--feature-lead text-left ${DOEPHONE_DISPLAY_WEIGHT_TW} leading-[1.02] tracking-[-0.03em] ${DOEPHONE_SECTION_CAROUSEL_INSET_X} ${suisseIntl.className}`}
            >
              <span className="block">{titleLine1}</span>
              <span className="block">{titleLine2}</span>
            </h2>
          </DoePhoneScrollRevealContent>
          <div className="home-feature-shader-band__feature-content flex min-h-0 flex-1 flex-col items-center justify-center">
            <DoePhoneScrollRevealContent revealed={revealed} segment="carousel" className="w-full">
              <div className="home-feature-section__guardrails relative z-[20] w-full shrink-0">
                <div className="home-guardrails-scale">
                  <DoePhoneHomeGuardrailsVisual />
                </div>
              </div>
            </DoePhoneScrollRevealContent>
          </div>
        </div>
      ) : null}
    </section>
  );
}
