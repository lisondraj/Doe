import type { WorkflowCarouselDesignBackdrop } from "@/lib/workflow-carousel-design-backdrops";

export type DoePhoneCommunicationSlide = {
  id: string;
  menuLabel: string;
  backdrop: WorkflowCarouselDesignBackdrop;
};

/** Section 2 carousel — six slides aligned to the 3×2 menu grid below. */
export const DOEPHONE_COMMUNICATION_SLIDES: readonly DoePhoneCommunicationSlide[] = [
  {
    id: "inbox-agents",
    menuLabel: "Inbox Agents",
    backdrop: {
      slideIndex: 3,
      label: "Inbox Agents",
      gradient: "radial-gradient(circle at center, #C47A5A 0%, #D2774C 58%, #D49D4F 100%)",
      grid: "dot",
    },
  },
  {
    id: "referrals-in",
    menuLabel: "Referrals In",
    backdrop: {
      slideIndex: 4,
      label: "Referrals In",
      gradient:
        "linear-gradient(135deg, #B87862 0%, #C47A5A 24%, #D2774C 58%, #D49D4F 100%)",
      grid: "crosshatch",
    },
  },
  {
    id: "patient-intake",
    menuLabel: "Patient Intake",
    backdrop: {
      slideIndex: 4,
      label: "Patient Intake",
      gradient: "radial-gradient(circle at center, #D49D4F 0%, #D2774C 42%, #C47A5A 100%)",
      grid: "polar",
      polarCenterY: "50%",
    },
  },
  {
    id: "ai-reception",
    menuLabel: "AI Reception",
    backdrop: {
      slideIndex: 0,
      label: "AI Reception",
      gradient: "linear-gradient(135deg, #D49D4F 0%, #D2774C 42%, #C47A5A 100%)",
      grid: "diagonal",
    },
  },
  {
    id: "scheduling",
    menuLabel: "Scheduling",
    backdrop: {
      slideIndex: 1,
      label: "Scheduling",
      gradient: "linear-gradient(225deg, #D49D4F 0%, #D2774C 38%, #C47A5A 100%)",
      grid: "diagonal",
    },
  },
  {
    id: "prior-auth",
    menuLabel: "Prior Auth",
    backdrop: {
      slideIndex: 5,
      label: "Prior Auth",
      gradient: "linear-gradient(90deg, #C47A5A 0%, #D2774C 42%, #D49D4F 100%)",
      grid: "wave",
    },
  },
] as const;

export const DOEPHONE_COMMUNICATION_SLIDE_COUNT = DOEPHONE_COMMUNICATION_SLIDES.length;
