"use client";

import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import {
  WORKFLOW_CAROUSEL_DESIGN_BACKDROPS,
  type WorkflowCarouselDesignBackdrop as WorkflowCarouselDesignBackdropType,
} from "@/lib/workflow-carousel-design-backdrops";

function DoePhoneCarouselCard({ backdrop }: { backdrop: WorkflowCarouselDesignBackdropType }) {
  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-[clamp(1.1rem,0.95rem+0.75vmin,1.45rem)] shadow-[0_10px_32px_rgba(0,0,0,0.1)]"
      aria-hidden
    >
      <WorkflowCarouselDesignBackdrop backdrop={backdrop} embedded />
    </div>
  );
}

/** Horizontal snap carousel — five gradient + line-overlay cards, no copy yet. */
export function DoePhoneSectionCarousel() {
  return (
    <div
      className="flex h-full min-h-0 w-full snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      style={{ WebkitOverflowScrolling: "touch" }}
      aria-label="Communication features"
    >
      {WORKFLOW_CAROUSEL_DESIGN_BACKDROPS.map((backdrop) => (
        <div
          key={backdrop.label}
          className="box-border h-full w-full min-w-full shrink-0 snap-center"
        >
          <DoePhoneCarouselCard backdrop={backdrop} />
        </div>
      ))}
    </div>
  );
}
