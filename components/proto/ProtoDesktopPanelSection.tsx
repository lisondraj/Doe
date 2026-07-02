"use client";

import { DoePhoneDesktopFrostPlusBadge } from "@/components/doephone/DoePhoneDesktopFrostPlusBadge";
import { DoePhoneCommunicationSlideVisual } from "@/components/doephone/DoePhoneCommunicationSlideVisual";
import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import type { DoePhoneCommunicationSlide } from "@/lib/doephone/communication-carousel";
import {
  DOEPHONE_SECTION_CAROUSEL_CLIP_STYLE,
  DOEPHONE_SECTION_CAROUSEL_RADIUS,
} from "@/lib/doephone/section-styles";
import { PROTO_DESKTOP_FROST_BADGE_STYLE } from "@/lib/proto/proto-desktop-layout-styles";
import type { WorkflowCarouselGridKind } from "@/lib/workflow-carousel-design-backdrops";

const BOX_PLUS_INSET = {
  top: "clamp(1.65rem, 2.5vw, 2.75rem)",
  left: "clamp(1.85rem, 2.75vw, 3rem)",
} as const;

/** Desktop /proto — rounded gradient panel with centered slide UI and proto frost badge. */
export function ProtoDesktopPanelSection({
  slide,
  gradientOverride,
  gridOverride,
}: {
  slide: DoePhoneCommunicationSlide;
  gradientOverride?: string;
  gridOverride?: WorkflowCarouselGridKind;
}) {
  return (
    <div
      className={`relative isolate min-h-0 w-full flex-1 overflow-hidden border border-[#2A3538] shadow-[0_10px_32px_rgba(0,0,0,0.28)] ${DOEPHONE_SECTION_CAROUSEL_RADIUS}`}
      style={DOEPHONE_SECTION_CAROUSEL_CLIP_STYLE}
    >
      <WorkflowCarouselDesignBackdrop
        backdrop={slide.backdrop}
        embedded
        className={DOEPHONE_SECTION_CAROUSEL_RADIUS}
        gradientOverride={gradientOverride}
        gridOverride={gridOverride}
      />

      <div className="absolute inset-0 z-[15] flex items-center justify-center px-[clamp(1.5rem,3vw,3rem)]">
        <DoePhoneCommunicationSlideVisual slideId={slide.id} layout="desktop" />
      </div>

      <DoePhoneDesktopFrostPlusBadge
        className="absolute z-30"
        style={{ ...BOX_PLUS_INSET, ...PROTO_DESKTOP_FROST_BADGE_STYLE }}
      />
    </div>
  );
}
