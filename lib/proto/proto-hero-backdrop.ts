import type { WorkflowCarouselDesignBackdrop } from "@/lib/workflow-carousel-design-backdrops";

import { PROTO_LINE_GRID, PROTO_RECEPTION_PALETTE } from "@/lib/proto/proto-communication-gradients";

/** /proto hero — 135° Documents shape with expanded light-blue band. */
export const PROTO_HERO_GRADIENT = `linear-gradient(135deg, ${PROTO_RECEPTION_PALETTE.deep} 0%, ${PROTO_RECEPTION_PALETTE.blue} 18%, ${PROTO_RECEPTION_PALETTE.blue} 48%, ${PROTO_RECEPTION_PALETTE.copper} 68%, ${PROTO_RECEPTION_PALETTE.gold} 100%)`;

export const PROTO_HERO_BACKDROP: WorkflowCarouselDesignBackdrop = {
  slideIndex: 4,
  label: "Proto hero",
  gradient: PROTO_HERO_GRADIENT,
  grid: PROTO_LINE_GRID,
};
