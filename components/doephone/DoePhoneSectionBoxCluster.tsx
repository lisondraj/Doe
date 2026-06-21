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

/** Three-box wireframe — white center rectangle over two gradient side tiles. */
export function DoePhoneSectionBoxCluster() {
  return (
    <div
      className="relative mx-auto w-full h-[clamp(22rem,56vmin,31rem)] iphone-page:h-[clamp(21rem,52vmin,29rem)]"
      aria-hidden
    >
      {/* Left — tall vertical tile; height extends past the center rectangle. */}
      <div className="absolute -top-[3%] bottom-[-2%] left-0 z-[1] w-[38%] iphone-page:w-[37%]">
        <GradientBox backdrop={DOEPHONE_SECTION_BOX_LEFT_BACKDROP} />
      </div>

      {/* Right — larger tile tucked behind the center box bottom-right corner. */}
      <div className="absolute bottom-[-1%] right-0 z-[1] h-[92%] w-[48%] iphone-page:w-[47%]">
        <GradientBox backdrop={DOEPHONE_SECTION_BOX_RIGHT_BACKDROP} />
      </div>

      <div
        className={`absolute left-1/2 top-[9%] z-[2] h-[clamp(9.25rem,27vmin,13.25rem)] w-[78%] max-w-[min(100%,24rem)] -translate-x-1/2 bg-white iphone-page:top-[8%] iphone-page:h-[clamp(8.75rem,25vmin,12.5rem)] iphone-page:w-[76%] ${DOEPHONE_SECTION_CAROUSEL_RADIUS}`}
      />
    </div>
  );
}
