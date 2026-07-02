"use client";

import { DoePhoneCommunicationCarouselCard } from "@/components/doephone/DoePhoneCommunicationCarouselCard";
import { ProtoFeatureSectionCopy } from "@/components/proto/ProtoFeatureSectionCopy";
import { DOEPHONE_COMMUNICATION_SLIDES } from "@/lib/doephone/communication-carousel";
import { DOEPHONE_SECTION_CAROUSEL_INSET_X } from "@/lib/doephone/section-styles";
import { protoFeatureCopy } from "@/lib/proto/proto-feature-copy";
import { protoCommunicationGradient, protoCommunicationGrid } from "@/lib/proto/proto-communication-gradients";

/** /proto — six feature slides stacked vertically, one section each (no carousel or menu). */
export function ProtoCommunicationStack() {
  return (
    <>
      {DOEPHONE_COMMUNICATION_SLIDES.map((slide) => {
        const copy = protoFeatureCopy(slide.id);
        if (!copy) return null;

        return (
          <section
            key={slide.id}
            className="proto-feature-section proto-section-band"
            aria-label={slide.menuLabel}
          >
            <div className={`${DOEPHONE_SECTION_CAROUSEL_INSET_X} proto-feature-section__inner`}>
              <div className="proto-feature-section__stack w-full min-h-0">
                <div className="proto-feature-section__card w-full min-h-0">
                  <DoePhoneCommunicationCarouselCard
                    slide={slide}
                    isActive
                    layout="phone"
                    showExpandControls={false}
                    gradientOverride={protoCommunicationGradient(slide.id)}
                    gridOverride={protoCommunicationGrid(slide.id)}
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
