"use client";

import { DoePhoneIntegrateVisual } from "@/components/doephone/DoePhoneIntegrateVisual";
import { DoePhoneSectionTitle } from "@/components/doephone/DoePhoneSectionText";
import { ProtoGrainGradient } from "@/components/proto/ProtoGrainGradient";
import {
  DOEPHONE_SECTION_CONTENT_INSET,
  DOEPHONE_SECTION_TITLE_CAROUSEL_GAP,
  DOEPHONE_SECTION_TITLE_PB,
  DOEPHONE_SECTION_TITLE_PT,
  DOEPHONE_VIEWPORT_SECTION,
} from "@/lib/doephone/section-styles";
import { doeHomeIntegrationsShaderSurface } from "@/lib/proto/proto-shader-backdrop-colors";

const INTEGRATIONS_SHADER = doeHomeIntegrationsShaderSurface();

/** Gradient viewport — Intelligence built into your stack + integration tile mosaic. */
export function DoePhoneIntegrationsSection({
  sectionClassName = DOEPHONE_VIEWPORT_SECTION,
}: {
  sectionClassName?: string;
}) {
  return (
    <section className={sectionClassName} aria-label="Integrations">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <ProtoGrainGradient
          variant={INTEGRATIONS_SHADER.variant}
          colors={INTEGRATIONS_SHADER.colors}
          colorBack={INTEGRATIONS_SHADER.colorBack}
        />
      </div>

      <div className="relative z-10 flex h-full min-h-0 flex-col">
        <div
          className={`integrations-section-title-row shrink-0 ${DOEPHONE_SECTION_CONTENT_INSET} ${DOEPHONE_SECTION_TITLE_PT}`}
        >
          <DoePhoneSectionTitle
            line1="Intelligence built."
            line2="into your stack."
            color="text-white"
          />
        </div>

        <div
          className={`integrations-section-stack flex min-h-0 flex-1 flex-col justify-center overflow-hidden ${DOEPHONE_SECTION_TITLE_CAROUSEL_GAP} ${DOEPHONE_SECTION_TITLE_PB}`}
        >
          <DoePhoneIntegrateVisual />
        </div>
      </div>
    </section>
  );
}
