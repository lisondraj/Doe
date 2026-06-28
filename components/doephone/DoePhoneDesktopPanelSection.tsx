"use client";

import { DoePhoneDesktopFrostPlusBadge } from "@/components/doephone/DoePhoneDesktopFrostPlusBadge";
import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import type { DoePhoneCommunicationSlide } from "@/lib/doephone/communication-carousel";
import {
  DESKTOP_HOME_PANEL_BAND_H,
  DOEPHONE_SECTION_CAROUSEL_CLIP_STYLE,
  DOEPHONE_SECTION_CAROUSEL_RADIUS,
} from "@/lib/doephone/section-styles";
import type { ReactNode } from "react";

const DESKTOP_SECTION_UNIFORM_PAD = "p-10 md:p-20 lg:p-28 xl:p-36";

const BOX_PLUS_INSET = {
  top: "clamp(1.65rem, 2.5vw, 2.75rem)",
  left: "clamp(1.85rem, 2.75vw, 3rem)",
} as const;

/** Desktop full-width rounded carousel panel — backdrop, centered UI, top-left + badge. */
export function DoePhoneDesktopPanelSection({
  slide,
  children,
}: {
  slide: DoePhoneCommunicationSlide;
  children: ReactNode;
}) {
  return (
    <div className={`flex w-full flex-col ${DESKTOP_HOME_PANEL_BAND_H} ${DESKTOP_SECTION_UNIFORM_PAD}`}>
      <div
        className={`relative isolate min-h-0 w-full flex-1 overflow-hidden shadow-[0_10px_32px_rgba(0,0,0,0.1)] ${DOEPHONE_SECTION_CAROUSEL_RADIUS}`}
        style={DOEPHONE_SECTION_CAROUSEL_CLIP_STYLE}
      >
        <WorkflowCarouselDesignBackdrop
          backdrop={slide.backdrop}
          embedded
          className={DOEPHONE_SECTION_CAROUSEL_RADIUS}
        />

        <div className="absolute inset-0 z-[15] flex items-center justify-center px-[clamp(1.5rem,3vw,3rem)]">
          {children}
        </div>

        <DoePhoneDesktopFrostPlusBadge className="absolute z-30" style={BOX_PLUS_INSET} />
      </div>
    </div>
  );
}
