import type { WorkflowCarouselDesignBackdrop } from "@/lib/workflow-carousel-design-backdrops";

/** Second beige section box cluster — left tile (hex overlay). */
export const DOEPHONE_SECTION_BOX_LEFT_BACKDROP: WorkflowCarouselDesignBackdrop = {
  slideIndex: 0,
  label: "Left",
  gradient: "radial-gradient(ellipse 100% 88% at 22% 18%, #D49D4F 0%, #D2774C 52%, #B87862 100%)",
  grid: "hex",
};

/** Second beige section box cluster — right tile (crosshatch overlay). */
export const DOEPHONE_SECTION_BOX_RIGHT_BACKDROP: WorkflowCarouselDesignBackdrop = {
  slideIndex: 1,
  label: "Right",
  gradient:
    "linear-gradient(135deg, #B87862 0%, #C47A5A 24%, #D2774C 58%, #D49D4F 100%)",
  grid: "crosshatch",
};
