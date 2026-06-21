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
      className="relative mx-auto w-full h-[clamp(28rem,68vmin,38rem)] iphone-page:h-[clamp(26rem,64vmin,36rem)]"
      aria-hidden
    >
      {/* Left — vertical strip; top/bottom extend past the larger center rectangle. */}
      <div className="absolute left-0 top-[-2%] z-[1] h-[104%] w-[32%] iphone-page:w-[31%]">
        <GradientBox backdrop={DOEPHONE_SECTION_BOX_LEFT_BACKDROP} />
      </div>

      {/* Right — larger tile behind the center box bottom-right corner. */}
      <div className="absolute bottom-0 right-0 z-[1] h-[78%] w-[44%] iphone-page:w-[43%]">
        <GradientBox backdrop={DOEPHONE_SECTION_BOX_RIGHT_BACKDROP} />
      </div>

      <div
        className={`absolute left-1/2 top-[3%] z-[2] h-[clamp(14.5rem,40vmin,19.5rem)] w-[88%] max-w-[min(100%,28rem)] -translate-x-1/2 bg-white iphone-page:top-[2.5%] iphone-page:h-[clamp(13.75rem,38vmin,18.25rem)] iphone-page:w-[86%] ${DOEPHONE_SECTION_CAROUSEL_RADIUS}`}
      />
    </div>
  );
}
