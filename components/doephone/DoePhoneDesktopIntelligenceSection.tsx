"use client";

import { DoePhoneReviewPackageVisual } from "@/components/doephone/DoePhoneReviewPackageVisual";
import { DoePhoneDesktopPanelSection } from "@/components/doephone/DoePhoneDesktopPanelSection";
import { DOEPHONE_COMMUNICATION_SLIDES } from "@/lib/doephone/communication-carousel";

const DEPLOYMENT_SLIDE =
  DOEPHONE_COMMUNICATION_SLIDES.find((slide) => slide.id === "agents") ??
  (() => {
    throw new Error("Missing agents communication slide");
  })();

/** Desktop second section — single deployments slide as a full-width rounded panel. */
export function DoePhoneDesktopIntelligenceSection() {
  return (
    <DoePhoneDesktopPanelSection slide={DEPLOYMENT_SLIDE}>
      <DoePhoneReviewPackageVisual layout="desktop" />
    </DoePhoneDesktopPanelSection>
  );
}
