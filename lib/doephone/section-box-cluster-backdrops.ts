import type { WorkflowCarouselDesignBackdrop } from "@/lib/workflow-carousel-design-backdrops";

export type DoePhoneBoxClusterLayout = {
  left: string;
  right: string;
  center: string;
};

export type DoePhoneBoxClusterPreset = {
  id: string;
  menuLabel: string;
  description: readonly [string, string, string];
  left: WorkflowCarouselDesignBackdrop;
  right: WorkflowCarouselDesignBackdrop;
  layout: DoePhoneBoxClusterLayout;
};

/** Four customization presets — unique backdrop pairs and box compositions. */
export const DOEPHONE_BOX_CLUSTER_PRESETS: readonly DoePhoneBoxClusterPreset[] = [
  {
    id: "intake",
    menuLabel: "Intake",
    description: [
      "Collect patient details before the first visit.",
      "Forms adapt to your workflows and payers.",
      "Everything lands in one chart-ready record.",
    ],
    layout: {
      left: "absolute left-0 top-[4%] z-[1] h-[72%] w-[40%] iphone-page:top-[3%] iphone-page:w-[39%]",
      right:
        "absolute bottom-[6%] right-0 z-[1] aspect-[1.28] w-[53%] iphone-page:bottom-[5%] iphone-page:w-[51%]",
      center:
        "absolute left-1/2 top-1/2 z-[2] h-[clamp(22rem,60vmin,30rem)] w-[88%] max-w-[min(100%,30rem)] -translate-x-1/2 -translate-y-1/2 bg-white iphone-page:h-[clamp(21rem,57vmin,28rem)] iphone-page:w-[86%]",
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
    description: [
      "Direct every referral to the right specialist.",
      "Rules you set once, applied across your network.",
      "No manual triage or lost messages.",
    ],
    layout: {
      left: "absolute left-0 top-1/2 z-[1] h-[100%] w-[30%] -translate-y-1/2 iphone-page:w-[29%]",
      right: "absolute bottom-[3%] right-0 z-[1] aspect-square w-[45%] iphone-page:bottom-[2%] iphone-page:w-[43%]",
      center:
        "absolute left-1/2 top-1/2 z-[2] h-[clamp(20.5rem,56vmin,28rem)] w-[96%] max-w-[min(100%,34rem)] -translate-x-1/2 -translate-y-1/2 bg-white iphone-page:h-[clamp(19.75rem,54vmin,26.5rem)] iphone-page:w-[94%]",
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
    description: [
      "Results flow in as soon as they're ready.",
      "Abnormal values surface automatically.",
      "Patients and staff stay in sync.",
    ],
    layout: {
      left: "absolute left-0 bottom-[5%] z-[1] h-[42%] w-[48%] iphone-page:bottom-[4%] iphone-page:w-[46%]",
      right: "absolute right-0 top-[8%] z-[1] h-[56%] w-[26%] iphone-page:top-[7%] iphone-page:w-[24%]",
      center:
        "absolute left-1/2 top-1/2 z-[2] h-[clamp(23rem,63vmin,31.5rem)] w-[98%] max-w-[min(100%,36rem)] -translate-x-1/2 -translate-y-1/2 bg-white iphone-page:h-[clamp(22rem,59vmin,29.5rem)] iphone-page:w-[96%]",
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
    description: [
      "Keep calendars and records aligned in real time.",
      "Updates propagate across every connected system.",
      "One source of truth for your whole practice.",
    ],
    layout: {
      left: "absolute left-0 top-[7%] z-[1] h-[88%] w-[37%] iphone-page:top-[6%] iphone-page:w-[36%]",
      right: "absolute bottom-[8%] right-[1%] z-[1] aspect-square w-[39%] iphone-page:bottom-[7%] iphone-page:w-[37%]",
      center:
        "absolute left-1/2 top-1/2 z-[2] h-[clamp(20rem,54vmin,27rem)] w-[93%] max-w-[min(100%,33rem)] -translate-x-1/2 -translate-y-1/2 bg-white iphone-page:h-[clamp(19.25rem,52vmin,26rem)] iphone-page:w-[91%]",
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
