"use client";

import { DoePhoneDesktopPanelSection } from "@/components/doephone/DoePhoneDesktopPanelSection";
import { DoePhoneFrontDeskInboxVisual } from "@/components/doephone/DoePhoneFrontDeskInboxVisual";
import { DOEPHONE_COMMUNICATION_SLIDES } from "@/lib/doephone/communication-carousel";

const RECEPTION_SLIDE =
  DOEPHONE_COMMUNICATION_SLIDES.find((slide) => slide.id === "inbox") ??
  (() => {
    throw new Error("Missing documents communication slide");
  })();

/** Desktop section below Build — same panel shell as deployments with reception UI centered. */
export function DoePhoneDesktopReceptionSection() {
  return (
    <DoePhoneDesktopPanelSection slide={RECEPTION_SLIDE}>
      <DoePhoneFrontDeskInboxVisual layout="desktop" />
    </DoePhoneDesktopPanelSection>
  );
}
