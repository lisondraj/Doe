import type { HeroAgentPreviewIndex } from "@/lib/join/hero-agent-box-svg";
import type { WorkflowCarouselDesignBackdrop } from "@/lib/workflow-carousel-design-backdrops";

export type DoePhoneBoxClusterLayout = {
  left: string;
  right: string;
  center: string;
};

export type DoePhoneBoxClusterPreset = {
  id: string;
  menuLabel: string;
  /** Join-hero agent box (3×2 grid) rendered in the center panel. */
  agentIndex: HeroAgentPreviewIndex;
  description: readonly [string, string, string];
  left: WorkflowCarouselDesignBackdrop;
  right: WorkflowCarouselDesignBackdrop;
  layout: DoePhoneBoxClusterLayout;
};

/** Center panel — join-hero agent box aspect (614×382). */
const BOX_CLUSTER_CENTER =
  "absolute left-1/2 top-1/2 z-[2] flex w-[min(88%,20.75rem)] max-w-none aspect-[614/382] max-h-[min(48%,24.5rem)] -translate-x-1/2 -translate-y-1/2 items-stretch overflow-hidden bg-white ring-1 ring-black/[0.05] shadow-[0_18px_48px_rgba(30,52,58,0.08)] iphone-page:w-[min(86%,19.5rem)] iphone-page:max-h-[min(46%,23rem)]";

/** Four customization presets — unique backdrop pairs and box compositions. */
export const DOEPHONE_BOX_CLUSTER_PRESETS: readonly DoePhoneBoxClusterPreset[] = [
  {
    id: "intake",
    menuLabel: "Intake",
    agentIndex: 0,
    description: [
      "Collect patient details before the first visit.",
      "Forms adapt to your workflows and payers.",
      "Everything lands in one chart-ready record.",
    ],
    layout: {
      left: "absolute left-0 top-[6%] z-[1] h-[68%] w-[38%] iphone-page:top-[5%] iphone-page:w-[36%]",
      right:
        "absolute bottom-[8%] right-0 z-[1] aspect-[1.28] w-[48%] iphone-page:bottom-[7%] iphone-page:w-[46%]",
      center: BOX_CLUSTER_CENTER,
    },
    left: {
      slideIndex: 3,
      label: "Intake",
      gradient: "radial-gradient(circle at center, #C47A5A 0%, #D2774C 58%, #D49D4F 100%)",
      grid: "dot",
    },
    right: {
      slideIndex: 0,
      label: "Intake",
      gradient: "linear-gradient(135deg, #D49D4F 0%, #D2774C 42%, #C47A5A 100%)",
      grid: "diagonal",
    },
  },
  {
    id: "routing",
    menuLabel: "Routing",
    agentIndex: 3,
    description: [
      "Direct every referral to the right specialist.",
      "Rules you set once, applied across your network.",
      "No manual triage or lost messages.",
    ],
    layout: {
      left: "absolute left-0 top-1/2 z-[1] h-[92%] w-[28%] -translate-y-1/2 iphone-page:w-[26%]",
      right: "absolute bottom-[6%] right-0 z-[1] aspect-square w-[42%] iphone-page:bottom-[5%] iphone-page:w-[40%]",
      center: BOX_CLUSTER_CENTER,
    },
    left: {
      slideIndex: 0,
      label: "Routing",
      gradient: "radial-gradient(ellipse 100% 88% at 22% 18%, #D49D4F 0%, #D2774C 52%, #B87862 100%)",
      grid: "hex",
    },
    right: {
      slideIndex: 1,
      label: "Routing",
      gradient:
        "linear-gradient(135deg, #B87862 0%, #C47A5A 24%, #D2774C 58%, #D49D4F 100%)",
      grid: "crosshatch",
    },
  },
  {
    id: "labs",
    menuLabel: "Labs",
    agentIndex: 2,
    description: [
      "Results flow in as soon as they're ready.",
      "Abnormal values surface automatically.",
      "Patients and staff stay in sync.",
    ],
    layout: {
      left: "absolute left-0 bottom-[7%] z-[1] h-[40%] w-[44%] iphone-page:bottom-[6%] iphone-page:w-[42%]",
      right: "absolute right-0 top-[10%] z-[1] h-[52%] w-[24%] iphone-page:top-[9%] iphone-page:w-[22%]",
      center: BOX_CLUSTER_CENTER,
    },
    left: {
      slideIndex: 4,
      label: "Labs",
      gradient: "radial-gradient(circle at center, #D49D4F 0%, #D2774C 42%, #C47A5A 100%)",
      grid: "polar",
      polarCenterY: "50%",
    },
    right: {
      slideIndex: 1,
      label: "Labs",
      gradient: "linear-gradient(180deg, #B87862 0%, #C47A5A 20%, #D2774C 55%, #D49D4F 100%)",
      grid: "hex",
    },
  },
  {
    id: "sync",
    menuLabel: "Sync",
    agentIndex: 1,
    description: [
      "Keep calendars and records aligned in real time.",
      "Updates propagate across every connected system.",
      "One source of truth for your whole practice.",
    ],
    layout: {
      left: "absolute left-0 top-[8%] z-[1] h-[84%] w-[34%] iphone-page:top-[7%] iphone-page:w-[32%]",
      right: "absolute bottom-[9%] right-0 z-[1] aspect-square w-[36%] iphone-page:bottom-[8%] iphone-page:w-[34%]",
      center: BOX_CLUSTER_CENTER,
    },
    left: {
      slideIndex: 4,
      label: "Sync",
      gradient:
        "linear-gradient(135deg, #B87862 0%, #C47A5A 24%, #D2774C 58%, #D49D4F 100%)",
      grid: "crosshatch",
    },
    right: {
      slideIndex: 5,
      label: "Sync",
      gradient: "linear-gradient(90deg, #C47A5A 0%, #D2774C 42%, #D49D4F 100%)",
      grid: "wave",
    },
  },
] as const;

export const DOEPHONE_BOX_CLUSTER_PRESET_COUNT = DOEPHONE_BOX_CLUSTER_PRESETS.length;
