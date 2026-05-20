import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import { WORKFLOW_CAROUSEL_DESIGN_BACKDROPS } from "@/lib/workflow-carousel-design-backdrops";

/** design2 → first carousel card, design3 → second, … design5 → fifth */
export function WorkflowCarouselDesignPage({ routeNumber }: { routeNumber: 2 | 3 | 4 | 5 }) {
  const backdrop = WORKFLOW_CAROUSEL_DESIGN_BACKDROPS[routeNumber - 2];
  return (
    <WorkflowCarouselDesignBackdrop
      backdrop={backdrop}
      patternIdPrefix={`design${routeNumber}`}
    />
  );
}
