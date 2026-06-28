"use client";

import { DoePhoneClinicAgentsVisual } from "@/components/doephone/DoePhoneClinicAgentsVisual";
import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import { DOEPHONE_COMMUNICATION_SLIDES } from "@/lib/doephone/communication-carousel";
import {
  DOEPHONE_SECTION_CAROUSEL_CLIP_STYLE,
  DOEPHONE_SECTION_CAROUSEL_RADIUS,
} from "@/lib/doephone/section-styles";

const DESKTOP_SECTION_UNIFORM_PAD = "p-10 md:p-20 lg:p-28 xl:p-36";

const DEPLOYMENT_SLIDE = DOEPHONE_COMMUNICATION_SLIDES.find((slide) => slide.id === "agents");
if (!DEPLOYMENT_SLIDE) {
  throw new Error("Missing agents communication slide");
}

const ORANGE_FROST_STYLE = {
  background: "rgba(210, 119, 76, 0.48)",
  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.38)",
} as const;

const FROST_BLUR_CLASS = "backdrop-blur-[10px]";
const PLUS_BADGE_SIZE = "clamp(5.25rem, 7.5vw, 6.75rem)";

function DeploymentSectionPlusBadge() {
  return (
    <span
      className={`pointer-events-none absolute z-30 grid place-items-center rounded-full ${FROST_BLUR_CLASS}`}
      style={{
        bottom: "clamp(1.65rem, 2.5vw, 2.75rem)",
        right: "clamp(1.85rem, 2.75vw, 3rem)",
        width: PLUS_BADGE_SIZE,
        height: PLUS_BADGE_SIZE,
        ...ORANGE_FROST_STYLE,
      }}
      aria-hidden
    >
      <span
        className="block font-light leading-none text-white"
        style={{
          fontSize: "clamp(2.85rem, 4vw, 3.55rem)",
          textShadow: "0 1px 8px rgba(30, 52, 58, 0.18)",
        }}
      >
        +
      </span>
    </span>
  );
}

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

        <DeploymentSectionPlusBadge />
      </div>
    </div>
  );
}
