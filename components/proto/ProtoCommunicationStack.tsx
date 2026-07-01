"use client";

import { DoePhoneCommunicationCarouselCard } from "@/components/doephone/DoePhoneCommunicationCarouselCard";
import { DOEPHONE_COMMUNICATION_SLIDES } from "@/lib/doephone/communication-carousel";
import { DOEPHONE_SECTION_CAROUSEL_INSET_X } from "@/lib/doephone/section-styles";
import { protoCommunicationGradient, protoCommunicationGrid } from "@/lib/proto/proto-communication-gradients";

/** /proto — six feature slides stacked vertically, one section each (no carousel or menu). */
export function ProtoCommunicationStack() {
  return (
    <>
      {DOEPHONE_COMMUNICATION_SLIDES.map((slide) => (
        <section
          key={slide.id}
          className="proto-feature-section proto-section-band"
          aria-label={slide.menuLabel}
        >
          <div className={`${DOEPHONE_SECTION_CAROUSEL_INSET_X} proto-feature-section__inner`}>
            <div className="proto-feature-section__card w-full">
              <DoePhoneCommunicationCarouselCard
                slide={slide}
                isActive
                layout="phone"
                gradientOverride={protoCommunicationGradient(slide.id)}
                gridOverride={protoCommunicationGrid(slide.id)}
              />
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
