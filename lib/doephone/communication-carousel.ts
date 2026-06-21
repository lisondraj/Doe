import type { WorkflowCarouselDesignBackdrop } from "@/lib/workflow-carousel-design-backdrops";
import { WORKFLOW_CAROUSEL_LAST_BACKDROP } from "@/lib/workflow-carousel-design-backdrops";

export type DoePhoneCommunicationSlide = {
  id: string;
  menuLabel: string;
  backdrop: WorkflowCarouselDesignBackdrop;
};

/** Section 2 carousel — eight slides aligned to the menu grid below. */
export const DOEPHONE_COMMUNICATION_SLIDES: readonly DoePhoneCommunicationSlide[] = [
  {
    id: "inbox-agents",
    menuLabel: "Inbox Agents",
    backdrop: {
      slideIndex: 3,
      label: "Inbox Agents",
      gradient: "radial-gradient(circle at center, #1E343A 0%, #D2774C 60%, #E7A944 100%)",
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
        "linear-gradient(135deg, #1E343A 0%, #4A3D32 18%, #5C4A3A 30%, #D2774C 60%, #D49D4F 82%, #E7A944 100%)",
      grid: "crosshatch",
    },
  },
  {
    id: "care-routing",
    menuLabel: "Care Routing",
    backdrop: {
      slideIndex: 3,
      label: "Care Routing",
      gradient: "radial-gradient(circle at center, #1E343A 0%, #D2774C 55%, #E7A944 100%)",
      grid: "dot",
    },
  },
  {
    id: "patient-intake",
    menuLabel: "Patient Intake",
    backdrop: {
      slideIndex: 4,
      label: "Patient Intake",
      gradient: "radial-gradient(circle at center, #E7A944 0%, #D49D4F 40%, #D2774C 70%, #1E343A 100%)",
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
      gradient: "linear-gradient(135deg, #E7A944 0%, #D49D4F 30%, #D2774C 60%, #1E343A 100%)",
      grid: "diagonal",
    },
  },
  {
    id: "scheduling",
    menuLabel: "Scheduling",
    backdrop: {
      slideIndex: 1,
      label: "Scheduling",
      gradient: "linear-gradient(225deg, #E7A944 0%, #D49D4F 28%, #D2774C 58%, #1E343A 100%)",
      grid: "diagonal",
    },
  },
  {
    id: "lab-results",
    menuLabel: "Lab Results",
    backdrop: {
      slideIndex: 2,
      label: "Lab Results",
      gradient: "linear-gradient(180deg, #E7A944 0%, #D49D4F 25%, #D2774C 55%, #1E343A 100%)",
      grid: "hex",
    },
  },
  {
    id: "prior-auth",
    menuLabel: "Prior Auth",
    backdrop: {
      ...WORKFLOW_CAROUSEL_LAST_BACKDROP,
      label: "Prior Auth",
    },
  },
] as const;
