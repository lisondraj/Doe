import type { WorkflowCarouselDesignBackdrop } from "@/lib/workflow-carousel-design-backdrops";

/** Agents box + shared base — five-stop radial. */
export const PROTO_HERO_GRADIENT =
  "radial-gradient(circle at center, #E7A944 0%, #C46848 30%, #3D4A58 50%, #243A40 75%, #121819 100%)";

/** Hero-only — extra stops for smoother ring blending. */
export const PROTO_HERO_GRADIENT_BLENDED =
  "radial-gradient(circle at center, #E7A944 0%, #DC9950 10%, #D0854C 18%, #C46848 28%, #AB5E4E 38%, #865456 48%, #5A5058 58%, #3D4A58 68%, #2F4244 78%, #243A40 88%, #121819 100%)";

/** /proto hero — gold core → terracotta → slate pivot → page chrome (#121819). */
export const PROTO_HERO_BACKDROP: WorkflowCarouselDesignBackdrop = {
  slideIndex: 3,
  label: "Proto hero",
  gradient: PROTO_HERO_GRADIENT,
  grid: "dot",
};
