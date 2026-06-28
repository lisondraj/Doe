import type { WorkflowCarouselDesignBackdrop } from "@/lib/workflow-carousel-design-backdrops";

export type DoePhoneCommunicationSlide = {
  id: string;
  menuLabel: string;
  /** Expand-panel copy — omitted for slides without a detail view (e.g. Billing). */
  description?: string;
  backdrop: WorkflowCarouselDesignBackdrop;
};

/** Section 2 carousel — six slides aligned to the 3×2 menu grid below. */
export const DOEPHONE_COMMUNICATION_SLIDES: readonly DoePhoneCommunicationSlide[] = [
  {
    id: "agents",
    menuLabel: "Agents",
    description:
      "Deploy voice, scheduling, and labs agents across your clinic roster. Monitor live status, assign workflows, and scale automation from one dashboard.",
    backdrop: {
      slideIndex: 3,
      label: "Agents",
      gradient: "radial-gradient(circle at center, #C47A5A 0%, #D2774C 58%, #D49D4F 100%)",
      grid: "dot",
    },
  },
  {
    id: "front-desk",
    menuLabel: "Reception",
    description:
      "Voice and scheduling agents handle calls, intake, and calendar booking in parallel. Patients get answers while your front desk stays focused on care.",
    backdrop: {
      slideIndex: 0,
      label: "Reception",
      gradient:
        "radial-gradient(ellipse 100% 88% at 22% 18%, #D49D4F 0%, #D2774C 52%, #B87862 100%)",
      grid: "hex",
    },
  },
  {
    id: "inbox",
    menuLabel: "Documents",
    description:
      "Route labs, referrals, and prior auths through automated document workflows. Each file lands in the right chart without manual sorting or follow-up.",
    backdrop: {
      slideIndex: 4,
      label: "Documents",
      gradient:
        "linear-gradient(135deg, #B87862 0%, #C47A5A 24%, #D2774C 58%, #D49D4F 100%)",
      grid: "crosshatch",
    },
  },
  {
    id: "ambient",
    menuLabel: "Ambient",
    description:
      "Ask clinical questions in natural language with patient context built in. Query trends, labs, and history without leaving the chart or breaking flow.",
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
      grid: "hex",
    },
  },
  {
    id: "integrate",
    menuLabel: "Integrate",
    description:
      "Connect your EMR, billing stack, and clinical tools through Doe's integration layer. One view of the systems your practice already runs on every day.",
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
