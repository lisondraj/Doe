"use client";

import { DoePhoneDesktopPanelSection } from "@/components/doephone/DoePhoneDesktopPanelSection";
import { DoePhoneCallHistoryVisual } from "@/components/doephone/DoePhoneCallHistoryVisual";
import { DOEPHONE_COMMUNICATION_SLIDES } from "@/lib/doephone/communication-carousel";

const DOCUMENTS_SLIDE =
  DOEPHONE_COMMUNICATION_SLIDES.find((slide) => slide.id === "inbox") ??
  (() => {
    throw new Error("Missing documents communication slide");
  })();

/** Desktop section below Build — same panel shell as deployments with documents UI centered. */
export function DoePhoneDesktopDocumentsSection() {
  return (
    <DoePhoneDesktopPanelSection slide={DOCUMENTS_SLIDE}>
      <DoePhoneCallHistoryVisual layout="desktop" />
    </DoePhoneDesktopPanelSection>
  );
}
