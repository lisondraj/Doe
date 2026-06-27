import type { WorkflowCarouselDesignBackdrop } from "@/lib/workflow-carousel-design-backdrops";

export type DoePhoneCommunicationSlide = {
  id: string;
  menuLabel: string;
  backdrop: WorkflowCarouselDesignBackdrop;
};

/** Section 2 carousel — six slides aligned to the 3×2 menu grid below. */
export const DOEPHONE_COMMUNICATION_SLIDES: readonly DoePhoneCommunicationSlide[] = [
  {
    id: "agents",
    menuLabel: "Agents",
    backdrop: {
      slideIndex: 3,
      label: "Agents",
      gradient: "radial-gradient(circle at center, #C47A5A 0%, #D2774C 58%, #D49D4F 100%)",
      grid: "dot",
    },
  },
  {
    id: "front-desk",
    menuLabel: "Front Desk",
    backdrop: {
      slideIndex: 0,
      label: "Front Desk",
      gradient:
        "radial-gradient(ellipse 100% 88% at 22% 18%, #D49D4F 0%, #D2774C 52%, #B87862 100%)",
      grid: "hex",
    },
  },
  {
    id: "inbox",
    menuLabel: "Inbox",
    backdrop: {
      slideIndex: 4,
      label: "Inbox",
      gradient:
        "linear-gradient(135deg, #B87862 0%, #C47A5A 24%, #D2774C 58%, #D49D4F 100%)",
      grid: "crosshatch",
    },
  },
  {
    id: "ambient",
    menuLabel: "Ambient",
    backdrop: {
      slideIndex: 4,
      label: "Ambient",
      gradient: "radial-gradient(circle at center, #D49D4F 0%, #D2774C 42%, #C47A5A 100%)",
      grid: "polar",
      polarCenterY: "50%",
    },
  },
  {
    id: "billing",
    menuLabel: "Billing",
    backdrop: {
      slideIndex: 1,
      label: "Billing",
      gradient:
        "linear-gradient(180deg, #B87862 0%, #C47A5A 20%, #D2774C 55%, #D49D4F 100%)",
      grid: "diagonal",
    },
  },
  {
    id: "integrate",
    menuLabel: "Integrate",
    backdrop: {
      slideIndex: 5,
      label: "Integrate",
      gradient: "linear-gradient(90deg, #C47A5A 0%, #D2774C 42%, #D49D4F 100%)",
      grid: "wave",
    },
  },
] as const;

export const DOEPHONE_COMMUNICATION_SLIDE_COUNT = DOEPHONE_COMMUNICATION_SLIDES.length;

/** Lookup slide backdrop by id — stable when slide order changes. */
export function doephoneCommunicationBackdrop(id: (typeof DOEPHONE_COMMUNICATION_SLIDES)[number]["id"]) {
  const slide = DOEPHONE_COMMUNICATION_SLIDES.find((entry) => entry.id === id);
  if (!slide) throw new Error(`Unknown communication slide: ${id}`);
  return slide.backdrop;
}
