import type { WorkflowCarouselDesignBackdrop } from "@/lib/workflow-carousel-design-backdrops";

export type DoePhoneBoxClusterPreset = {
  id: string;
  menuLabel: string;
  left: WorkflowCarouselDesignBackdrop;
  right: WorkflowCarouselDesignBackdrop;
};

/** Four customization presets — left vertical tile + right square tile backdrops. */
export const DOEPHONE_BOX_CLUSTER_PRESETS: readonly DoePhoneBoxClusterPreset[] = [
  {
    id: "routing",
    menuLabel: "Routing",
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
