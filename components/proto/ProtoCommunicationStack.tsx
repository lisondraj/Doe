"use client";

import { DoePhoneCommunicationCarouselCard } from "@/components/doephone/DoePhoneCommunicationCarouselCard";
import { ProtoFeatureSectionCopy } from "@/components/proto/ProtoFeatureSectionCopy";
import { PROTO_COMMUNICATION_SLIDES } from "@/lib/proto/proto-communication-slides";
import { protoFeatureCopy } from "@/lib/proto/proto-feature-copy";
import { protoGrainGradientVariant } from "@/lib/proto/proto-grain-gradient";

/** /proto iPhone — feature slides stacked vertically: box, title, description per section. */
export function ProtoCommunicationStack() {
  return (
    <>
      {PROTO_COMMUNICATION_SLIDES.map((slide) => {
        const copy = protoFeatureCopy(slide.id);
        if (!copy) return null;
        return (
          <section
            key={slide.id}
            className="proto-feature-section proto-section-band proto-feature-section--fit-shader"
            aria-label={slide.menuLabel}
          >
            <div className="proto-feature-section__inner">
              <div className="proto-feature-section__stack w-full min-h-0">
                <div className="proto-feature-section__card w-full min-h-0">
                  <DoePhoneCommunicationCarouselCard
                    slide={slide}
                    isActive
                    layout="phone"
                    className="proto-carousel-card"
                    showExpandControls={false}
                    uiInteractive={false}
                    protoShaderVariant={protoGrainGradientVariant(slide.id)}
                    protoSite
                    uiScaleClass="proto-feature-ui-fit-scale"
                  />
                </div>
                <ProtoFeatureSectionCopy copy={copy} />
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
