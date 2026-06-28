"use client";

import { DoePhoneCohortWatchVisual } from "@/components/doephone/DoePhoneCohortWatchVisual";
import { DoePhoneDesktopPanelSection } from "@/components/doephone/DoePhoneDesktopPanelSection";
import type { DoePhoneCommunicationSlide } from "@/lib/doephone/communication-carousel";

const COHORT_WATCH_SLIDE = {
  id: "cohort-watch",
  menuLabel: "Signals",
  description:
    "Chronic panels generate more data than any team can scan by hand. Cohort Watch runs overnight sweeps across the roster and delivers a morning brief with ranked priorities, staged packets, and the clinical context you need before the first appointment.",
  backdrop: {
    slideIndex: 4,
    label: "Signals",
    gradient: "radial-gradient(circle at 50% 38%, #D49D4F 0%, #D2774C 46%, #C47A5A 78%, #B87862 100%)",
    grid: "polar" as const,
    polarCenterY: "42%",
  },
} satisfies DoePhoneCommunicationSlide;

/** Desktop panel below documents — proactive cohort monitoring UI. */
export function DoePhoneDesktopCohortWatchSection() {
  return (
    <DoePhoneDesktopPanelSection slide={COHORT_WATCH_SLIDE}>
      <DoePhoneCohortWatchVisual layout="desktop" />
    </DoePhoneDesktopPanelSection>
  );
}
