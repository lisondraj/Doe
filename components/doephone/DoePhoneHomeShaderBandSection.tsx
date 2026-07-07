"use client";

import { ProtoGrainGradient } from "@/components/proto/ProtoGrainGradient";
import type { DoePhoneCommunicationSlide } from "@/lib/doephone/communication-carousel";
import { DOEPHONE_MAIN_PAGE_VIEWPORT_SECTION } from "@/lib/doephone/section-styles";
import { doeHomeShaderBandSurface } from "@/lib/proto/proto-shader-backdrop-colors";

/** Full-viewport shader band — empty spacer between feature cards. */
export function DoePhoneHomeShaderBandSection({
  slideId,
}: {
  slideId: DoePhoneCommunicationSlide["id"];
}) {
  const shader = doeHomeShaderBandSurface(slideId);

  return (
    <section
      className={`home-feature-shader-band ${DOEPHONE_MAIN_PAGE_VIEWPORT_SECTION}`}
      aria-hidden
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
    </section>
  );
}
