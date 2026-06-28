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
      "Your clinic runs on more than one workflow, and Agents gives you a single place to deploy voice, scheduling, and labs automation across the roster. From live status to workflow assignment, you can see what is running, what is waiting, and what to turn on next without jumping between tools.",
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
      "When the phone rings and the schedule fills up at the same time, Reception keeps both moving. Voice and scheduling agents handle intake, answers, and calendar booking in parallel so patients get help immediately and your front desk team can stay with the people in front of them.",
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
      "Incoming labs, referrals, and prior auths rarely arrive in a neat stack, and Documents routes each one through the right workflow automatically. Files land in the correct chart, outcomes stay visible, and your team spends less time sorting and chasing follow-ups.",
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
      "Clinical questions should not require hunting through tabs or rebuilding context from scratch. Ambient lets you ask in natural language with the patient already in frame, so trends, labs, and history come back while you stay in flow at the point of care.",
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
      "Every practice runs a different stack, and Integrate connects the EMRs, billing platforms, and clinical tools you already rely on through one layer. Doe meets your team where they work instead of asking them to rip out what is already in place.",
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
