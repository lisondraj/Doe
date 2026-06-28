"use client";

import { DoePhoneClinicAgentsVisual } from "@/components/doephone/DoePhoneClinicAgentsVisual";
import { DoePhoneDesktopFrostPlusBadge } from "@/components/doephone/DoePhoneDesktopFrostPlusBadge";
import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import { DOEPHONE_COMMUNICATION_SLIDES } from "@/lib/doephone/communication-carousel";
import {
  DOEPHONE_SECTION_CAROUSEL_CLIP_STYLE,
  DOEPHONE_SECTION_CAROUSEL_RADIUS,
} from "@/lib/doephone/section-styles";

const DESKTOP_SECTION_UNIFORM_PAD = "p-10 md:p-20 lg:p-28 xl:p-36";

const DEPLOYMENT_SLIDE =
  DOEPHONE_COMMUNICATION_SLIDES.find((slide) => slide.id === "agents") ??
  (() => {
    throw new Error("Missing agents communication slide");
  })();

const BOX_PLUS_INSET = {
  top: "clamp(1.65rem, 2.5vw, 2.75rem)",
  left: "clamp(1.85rem, 2.75vw, 3rem)",
} as const;

/** Desktop second section — single deployments slide as a full-width rounded panel. */
export function DoePhoneDesktopIntelligenceSection() {
  return (
    <div className={`flex min-h-[112vh] w-full flex-col ${DESKTOP_SECTION_UNIFORM_PAD}`}>
      <div
        className={`relative isolate min-h-0 w-full flex-1 overflow-hidden shadow-[0_10px_32px_rgba(0,0,0,0.1)] ${DOEPHONE_SECTION_CAROUSEL_RADIUS}`}
        style={DOEPHONE_SECTION_CAROUSEL_CLIP_STYLE}
      >
        <WorkflowCarouselDesignBackdrop
          backdrop={DEPLOYMENT_SLIDE.backdrop}
          embedded
          className={DOEPHONE_SECTION_CAROUSEL_RADIUS}
        />

        <div className="absolute inset-0 z-[15] flex items-center justify-center px-[clamp(1.5rem,3vw,3rem)]">
          <DoePhoneClinicAgentsVisual layout="desktop" />
        </div>

        <DoePhoneDesktopFrostPlusBadge
          className="absolute z-30"
          style={BOX_PLUS_INSET}
        />
      </div>
    </div>
  );
}
