import type { WorkflowCarouselDesignBackdrop } from "@/lib/workflow-carousel-design-backdrops";

import { PROTO_COMMUNICATION_GRADIENTS, PROTO_LINE_GRID } from "@/lib/proto/proto-communication-gradients";

/** /proto hero — same 135° gradient + crosshatch grid as Documents (section 2). */
export const PROTO_HERO_GRADIENT = PROTO_COMMUNICATION_GRADIENTS.inbox;

export const PROTO_HERO_BACKDROP: WorkflowCarouselDesignBackdrop = {
  slideIndex: 4,
  label: "Proto hero",
  gradient: PROTO_HERO_GRADIENT,
  grid: PROTO_LINE_GRID,
};
