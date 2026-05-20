import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import { WORKFLOW_CAROUSEL_DESIGN_BACKDROPS } from "@/lib/workflow-carousel-design-backdrops";

/**
 * design2–4 → carousel cards 1–3; design5 → card 5 (billing).
 * Card 4 (Smart Appointments) shares gradient/grid with card 3 — omitted as duplicate.
 */
const DESIGN_ROUTE_BACKDROP_INDEX: Record<2 | 3 | 4 | 5, number> = {
  2: 0,
  3: 1,
  4: 2,
  5: 4,
};

export function WorkflowCarouselDesignPage({ routeNumber }: { routeNumber: 2 | 3 | 4 | 5 }) {
  const backdrop = WORKFLOW_CAROUSEL_DESIGN_BACKDROPS[DESIGN_ROUTE_BACKDROP_INDEX[routeNumber]];
  return (
    <WorkflowCarouselDesignBackdrop
      backdrop={backdrop}
      patternIdPrefix={`design${routeNumber}`}
    />
  );
}
