import type { WorkflowCarouselDesignBackdrop } from "@/lib/workflow-carousel-design-backdrops";

export type DoePhoneBoxClusterLayout = {
  stage: string;
  left: string;
  right: string;
  center: string;
};

export type DoePhoneBoxClusterPreset = {
  id: string;
  menuLabel: string;
  left: WorkflowCarouselDesignBackdrop;
  right: WorkflowCarouselDesignBackdrop;
  layout: DoePhoneBoxClusterLayout;
};

/** Four customization presets — unique backdrop pairs and box compositions. */
export const DOEPHONE_BOX_CLUSTER_PRESETS: readonly DoePhoneBoxClusterPreset[] = [
  {
    id: "routing",
    menuLabel: "Routing",
    layout: {
      stage: "h-[clamp(32rem,76vmin,44rem)] iphone-page:h-[clamp(30rem,72vmin,42rem)]",
      left: "absolute left-0 top-1/2 z-[1] h-[98%] w-[28%] -translate-y-1/2 iphone-page:w-[27%]",
      right: "absolute bottom-[4%] right-0 z-[1] aspect-square w-[42%] iphone-page:bottom-[3%] iphone-page:w-[40%]",
      center:
        "absolute left-1/2 top-1/2 z-[2] h-[clamp(19rem,52vmin,26rem)] w-[94%] max-w-[min(100%,32rem)] -translate-x-1/2 -translate-y-1/2 bg-white iphone-page:h-[clamp(18.25rem,50vmin,24.5rem)] iphone-page:w-[92%]",
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
    id: "intake",
    menuLabel: "Intake",
    layout: {
      stage: "h-[clamp(33rem,78vmin,45rem)] iphone-page:h-[clamp(31rem,74vmin,43rem)]",
      left: "absolute left-0 top-[5%] z-[1] h-[68%] w-[38%] iphone-page:top-[4%] iphone-page:w-[37%]",
      right:
        "absolute bottom-[7%] right-0 z-[1] aspect-[1.28] w-[50%] iphone-page:bottom-[6%] iphone-page:w-[48%]",
      center:
        "absolute left-1/2 top-1/2 z-[2] h-[clamp(20.5rem,56vmin,27.5rem)] w-[84%] max-w-[min(100%,28rem)] -translate-x-1/2 -translate-y-1/2 bg-white iphone-page:h-[clamp(19.5rem,53vmin,26rem)] iphone-page:w-[82%]",
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
    id: "labs",
    menuLabel: "Labs",
    layout: {
      stage: "h-[clamp(34rem,80vmin,46rem)] iphone-page:h-[clamp(32rem,76vmin,44rem)]",
      left: "absolute -top-[1%] left-0 z-[1] h-[106%] w-[25%] iphone-page:w-[24%]",
      right: "absolute bottom-[2%] right-0 z-[1] aspect-square w-[46%] iphone-page:bottom-[1%] iphone-page:w-[44%]",
      center:
        "absolute left-1/2 top-1/2 z-[2] h-[clamp(21.5rem,58vmin,29rem)] w-[96%] max-w-[min(100%,34rem)] -translate-x-1/2 -translate-y-1/2 bg-white iphone-page:h-[clamp(20.5rem,55vmin,27.5rem)] iphone-page:w-[94%]",
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
    layout: {
      stage: "h-[clamp(31rem,74vmin,43rem)] iphone-page:h-[clamp(29rem,70vmin,41rem)]",
      left: "absolute left-0 top-[8%] z-[1] h-[84%] w-[35%] iphone-page:top-[7%] iphone-page:w-[34%]",
      right: "absolute bottom-[9%] right-[1%] z-[1] aspect-square w-[36%] iphone-page:bottom-[8%] iphone-page:w-[34%]",
      center:
        "absolute left-1/2 top-1/2 z-[2] h-[clamp(18.5rem,50vmin,25rem)] w-[90%] max-w-[min(100%,31rem)] -translate-x-1/2 -translate-y-1/2 bg-white iphone-page:h-[clamp(17.75rem,48vmin,24rem)] iphone-page:w-[88%]",
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
