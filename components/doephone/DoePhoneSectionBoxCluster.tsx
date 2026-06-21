"use client";

import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import {
  DOEPHONE_SECTION_BOX_LEFT_BACKDROP,
  DOEPHONE_SECTION_BOX_RIGHT_BACKDROP,
} from "@/lib/doephone/section-box-cluster-backdrops";
import { DOEPHONE_SECTION_CAROUSEL_RADIUS } from "@/lib/doephone/section-styles";
import type { WorkflowCarouselDesignBackdrop as WorkflowCarouselDesignBackdropType } from "@/lib/workflow-carousel-design-backdrops";

function GradientBox({ backdrop }: { backdrop: WorkflowCarouselDesignBackdropType }) {
  return (
    <div
      className={`relative h-full w-full overflow-hidden [contain:layout_paint] ${DOEPHONE_SECTION_CAROUSEL_RADIUS}`}
      aria-hidden
    >
      <WorkflowCarouselDesignBackdrop backdrop={backdrop} embedded className={DOEPHONE_SECTION_CAROUSEL_RADIUS} />
    </div>
  );
}

/** Three-box wireframe — center fill tile over two gradient side tiles. */
export function DoePhoneSectionBoxCluster() {
  return (
    <div
      className="relative mx-auto w-full h-[clamp(17.5rem,48vw,22.5rem)] iphone-page:h-[clamp(16.5rem,44vmin,21rem)]"
      aria-hidden
    >
      <div className="absolute bottom-0 left-0 z-[1] h-[86%] w-[34%] iphone-page:w-[33%]">
        <GradientBox backdrop={DOEPHONE_SECTION_BOX_LEFT_BACKDROP} />
      </div>

      <div className="absolute bottom-0 right-0 z-[1] h-[64%] w-[34%] iphone-page:w-[33%]">
        <GradientBox backdrop={DOEPHONE_SECTION_BOX_RIGHT_BACKDROP} />
      </div>

      <div
        className={`absolute left-1/2 top-[6%] z-[2] aspect-[1.02] w-[58%] max-w-[min(100%,20rem)] -translate-x-1/2 bg-[#E3E1DB] iphone-page:top-[5%] iphone-page:w-[56%] ${DOEPHONE_SECTION_CAROUSEL_RADIUS}`}
      />
    </div>
  );
}
