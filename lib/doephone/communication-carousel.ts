import type { WorkflowCarouselDesignBackdrop } from "@/lib/workflow-carousel-design-backdrops";

export type DoePhoneCommunicationSlide = {
  id: string;
  menuLabel: string;
  backdrop: WorkflowCarouselDesignBackdrop;
};

/** Section 2 carousel — six slides aligned to the 3×2 menu grid below. */
export const DOEPHONE_COMMUNICATION_SLIDES: readonly DoePhoneCommunicationSlide[] = [
  {
    id: "inbox-routing",
    menuLabel: "Inbox Routing",
    backdrop: {
      slideIndex: 3,
      label: "Inbox Routing",
      gradient: "radial-gradient(circle at center, #C47A5A 0%, #D2774C 58%, #D49D4F 100%)",
      grid: "dot",
    },
  },
  {
    id: "referral-matching",
    menuLabel: "Referral Matching",
    backdrop: {
      slideIndex: 4,
      label: "Referral Matching",
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
    id: "virtual-reception",
    menuLabel: "Virtual Reception",
    backdrop: {
      slideIndex: 0,
      label: "Virtual Reception",
      gradient:
        "radial-gradient(ellipse 100% 88% at 22% 18%, #D49D4F 0%, #D2774C 52%, #B87862 100%)",
      grid: "hex",
    },
  },
  {
    id: "calendar-booking",
    menuLabel: "Calendar Booking",
    backdrop: {
      slideIndex: 1,
      label: "Calendar Booking",
      gradient:
        "linear-gradient(180deg, #B87862 0%, #C47A5A 20%, #D2774C 55%, #D49D4F 100%)",
      grid: "diagonal",
    },
  },
  {
    id: "prior-authorization",
    menuLabel: "Prior Authorization",
    backdrop: {
      slideIndex: 5,
      label: "Prior Authorization",
      gradient: "linear-gradient(90deg, #C47A5A 0%, #D2774C 42%, #D49D4F 100%)",
      grid: "wave",
    },
  },
] as const;

export const DOEPHONE_COMMUNICATION_SLIDE_COUNT = DOEPHONE_COMMUNICATION_SLIDES.length;
