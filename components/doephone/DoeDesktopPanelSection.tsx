"use client";

import { DoePhoneCommunicationSlideVisual } from "@/components/doephone/DoePhoneCommunicationSlideVisual";
import { DoePhoneDesktopFrostPlusBadge } from "@/components/doephone/DoePhoneDesktopFrostPlusBadge";
import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import type { DoePhoneCommunicationSlide } from "@/lib/doephone/communication-carousel";
import {
  DOEPHONE_SECTION_CAROUSEL_CLIP_STYLE,
  DOEPHONE_SECTION_CAROUSEL_RADIUS,
} from "@/lib/doephone/section-styles";
import { DOE_PAGE_BORDER } from "@/lib/home/doe-page-colors";

const BOX_PLUS_INSET = {
  top: "clamp(1.65rem, 2.5vw, 2.75rem)",
  left: "clamp(1.85rem, 2.75vw, 3rem)",
} as const;

/** Desktop home — rounded orange gradient panel with centered slide UI + frost badge. */
export function DoeDesktopPanelSection({ slide }: { slide: DoePhoneCommunicationSlide }) {
  return (
    <div
      className={`relative isolate min-h-0 w-full flex-1 overflow-hidden border shadow-[0_10px_32px_rgba(30,52,58,0.12)] ${DOEPHONE_SECTION_CAROUSEL_RADIUS}`}
      style={{ ...DOEPHONE_SECTION_CAROUSEL_CLIP_STYLE, borderColor: DOE_PAGE_BORDER }}
    >
      <WorkflowCarouselDesignBackdrop
        backdrop={slide.backdrop}
        embedded
        className={DOEPHONE_SECTION_CAROUSEL_RADIUS}
      />

      <div className="absolute inset-0 z-[15] flex items-center justify-center px-[clamp(1.5rem,3vw,3rem)]">
        <DoePhoneCommunicationSlideVisual slideId={slide.id} layout="desktop" />
      </div>

      <DoePhoneDesktopFrostPlusBadge className="absolute z-30" style={BOX_PLUS_INSET} />
    </div>
  );
}
