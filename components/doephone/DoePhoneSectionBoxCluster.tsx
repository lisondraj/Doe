"use client";

import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import { DOEPHONE_BOX_CLUSTER_PRESETS } from "@/lib/doephone/section-box-cluster-backdrops";
import { DOEPHONE_SECTION_CAROUSEL_RADIUS } from "@/lib/doephone/section-styles";
import type { WorkflowCarouselDesignBackdrop as WorkflowCarouselDesignBackdropType } from "@/lib/workflow-carousel-design-backdrops";

function GradientBox({
  backdrop,
  presetId,
  side,
}: {
  backdrop: WorkflowCarouselDesignBackdropType;
  presetId: string;
  side: "left" | "right";
}) {
  return (
    <div
      id={`doephone-box-cluster-${presetId}-${side}`}
      className={`relative h-full w-full overflow-hidden transition-opacity duration-300 [contain:layout_paint] ${DOEPHONE_SECTION_CAROUSEL_RADIUS}`}
      aria-hidden
    >
      <WorkflowCarouselDesignBackdrop backdrop={backdrop} embedded className={DOEPHONE_SECTION_CAROUSEL_RADIUS} />
    </div>
  );
}

/** Three-box wireframe — blank white center over two gradient side tiles. */
export function DoePhoneSectionBoxCluster({ activeIndex }: { activeIndex: number }) {
  const preset = DOEPHONE_BOX_CLUSTER_PRESETS[activeIndex] ?? DOEPHONE_BOX_CLUSTER_PRESETS[0];

  return (
    <div
      className="relative mx-auto w-full h-[clamp(30rem,72vmin,40rem)] iphone-page:h-[clamp(28rem,68vmin,38rem)]"
      role="tabpanel"
      id={`doephone-box-cluster-${preset.id}`}
      aria-label={preset.menuLabel}
    >
      <div className="absolute left-0 top-1/2 z-[1] h-[94%] w-[31%] -translate-y-1/2 iphone-page:w-[30%]">
        <GradientBox backdrop={preset.left} presetId={preset.id} side="left" />
      </div>

      <div className="absolute bottom-[6%] right-0 z-[1] aspect-square w-[40%] iphone-page:bottom-[5%] iphone-page:w-[38%]">
        <GradientBox backdrop={preset.right} presetId={preset.id} side="right" />
      </div>

      <div
        className={`absolute left-1/2 top-1/2 z-[2] h-[clamp(17rem,46vmin,23rem)] w-[92%] max-w-[min(100%,30rem)] -translate-x-1/2 -translate-y-1/2 bg-white iphone-page:h-[clamp(16.25rem,44vmin,21.5rem)] iphone-page:w-[90%] ${DOEPHONE_SECTION_CAROUSEL_RADIUS}`}
        aria-label="Feature preview"
      />
    </div>
  );
}
