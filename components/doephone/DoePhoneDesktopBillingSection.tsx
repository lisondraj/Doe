"use client";

import { DoePhoneBillingVisual } from "@/components/doephone/DoePhoneBillingVisual";
import { DoePhoneDesktopPanelSection } from "@/components/doephone/DoePhoneDesktopPanelSection";
import { DOEPHONE_COMMUNICATION_SLIDES } from "@/lib/doephone/communication-carousel";

const BILLING_SLIDE =
  DOEPHONE_COMMUNICATION_SLIDES.find((slide) => slide.id === "billing") ??
  (() => {
    throw new Error("Missing billing communication slide");
  })();

/** Desktop section below integrations — billing gradient, hex overlay, prior-auth UI centered. */
export function DoePhoneDesktopBillingSection() {
  return (
    <DoePhoneDesktopPanelSection slide={BILLING_SLIDE}>
      <DoePhoneBillingVisual layout="desktop" />
    </DoePhoneDesktopPanelSection>
  );
}
