import type { WorkflowCarouselDesignBackdrop } from "@/lib/workflow-carousel-design-backdrops";

import { PROTO_HERO_GRADIENT, PROTO_LINE_GRID } from "@/lib/proto/proto-communication-gradients";

export { PROTO_HERO_GRADIENT };

export const PROTO_HERO_BACKDROP: WorkflowCarouselDesignBackdrop = {
  slideIndex: 4,
  label: "Proto hero",
  gradient: PROTO_HERO_GRADIENT,
  grid: PROTO_LINE_GRID,
};
