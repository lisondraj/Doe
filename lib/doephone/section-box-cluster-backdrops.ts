import type { WorkflowCarouselDesignBackdrop } from "@/lib/workflow-carousel-design-backdrops";

export type DoePhoneBoxClusterLayout = {
  left: string;
  right: string;
  center: string;
  /** Optional rear UI panel — sits above gradients, behind main center. */
  centerBack?: string;
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
      left: "absolute left-0 top-[6%] z-[1] h-[58%] w-[22%] iphone-page:w-[21%]",
      right:
        "absolute bottom-[5%] right-0 z-[1] h-[24%] w-[56%] iphone-page:bottom-[4%] iphone-page:w-[54%]",
      center:
        "absolute left-1/2 top-1/2 z-[2] h-[clamp(18.5rem,50vmin,25rem)] w-[88%] max-w-[min(100%,30rem)] -translate-x-1/2 -translate-y-1/2 bg-white iphone-page:h-[clamp(17.75rem,48vmin,24rem)] iphone-page:w-[86%]",
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
      left: "absolute left-0 top-[4%] z-[1] h-[26%] w-[50%] iphone-page:w-[48%]",
      right:
        "absolute bottom-[6%] right-0 z-[1] h-[72%] w-[19%] iphone-page:bottom-[5%] iphone-page:w-[18%]",
      center:
        "absolute left-1/2 top-1/2 z-[2] h-[clamp(15.5rem,42vmin,21rem)] w-[97%] max-w-[min(100%,36rem)] -translate-x-1/2 -translate-y-1/2 bg-white iphone-page:h-[clamp(14.75rem,40vmin,20rem)] iphone-page:w-[95%]",
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
      left: "absolute left-0 top-1/2 z-[1] h-[88%] w-[15%] -translate-y-1/2 iphone-page:w-[14%]",
      right:
        "absolute bottom-[3%] right-0 z-[1] h-[32%] w-[46%] iphone-page:bottom-[2%] iphone-page:w-[44%]",
      centerBack:
        "absolute left-[53%] top-[51%] z-[2] h-[clamp(18.5rem,50vmin,25rem)] w-[82%] max-w-[min(100%,29rem)] -translate-x-1/2 -translate-y-1/2 bg-white iphone-page:h-[clamp(17.75rem,48vmin,24rem)] iphone-page:w-[80%]",
      center:
        "absolute left-1/2 top-[47%] z-[3] h-[clamp(18.5rem,50vmin,25rem)] w-[82%] max-w-[min(100%,29rem)] -translate-x-1/2 -translate-y-1/2 bg-white iphone-page:h-[clamp(17.75rem,48vmin,24rem)] iphone-page:w-[80%]",
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
      left: "absolute left-0 top-[10%] z-[1] h-[52%] w-[28%] iphone-page:top-[9%] iphone-page:w-[27%]",
      right:
        "absolute bottom-[8%] right-0 z-[1] h-[48%] w-[17%] iphone-page:bottom-[7%] iphone-page:w-[16%]",
      center:
        "absolute left-1/2 top-1/2 z-[2] h-[clamp(21rem,56vmin,28rem)] w-[76%] max-w-[min(100%,26rem)] -translate-x-1/2 -translate-y-1/2 bg-white iphone-page:h-[clamp(20rem,53vmin,26.5rem)] iphone-page:w-[74%]",
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
