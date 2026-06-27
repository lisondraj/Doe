"use client";

import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import { HeroAgentBoxPreview } from "@/lib/join/hero-agent-box-svg";
import { DOEPHONE_BOX_CLUSTER_PRESETS } from "@/lib/doephone/section-box-cluster-backdrops";
import {
  DOEPHONE_BOX_CLUSTER_STAGE_HEIGHT,
  DOEPHONE_SECTION_CAROUSEL_RADIUS,
} from "@/lib/doephone/section-styles";
import type { WorkflowCarouselDesignBackdrop as WorkflowCarouselDesignBackdropType } from "@/lib/workflow-carousel-design-backdrops";

const BOX_MORPH_TW =
  "transition-[width,height,top,right,bottom,left,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]";

function GradientBox({
  backdrop,
  presetId,
  side,
  className,
}: {
  backdrop: WorkflowCarouselDesignBackdropType;
  presetId: string;
  side: "left" | "right";
  className: string;
}) {
  return (
    <div
      id={`doephone-box-cluster-${presetId}-${side}`}
      className={`${className} ${BOX_MORPH_TW}`}
      aria-hidden
    >
      <div
        className={`relative h-full w-full overflow-hidden [contain:layout_paint] ${DOEPHONE_SECTION_CAROUSEL_RADIUS}`}
      >
        <WorkflowCarouselDesignBackdrop backdrop={backdrop} embedded className={DOEPHONE_SECTION_CAROUSEL_RADIUS} />
      </div>
    </div>
  );
}

/** Three-box wireframe — join-hero agent UI in center over two gradient side tiles. */
export function DoePhoneSectionBoxCluster({ activeIndex }: { activeIndex: number }) {
  const preset = DOEPHONE_BOX_CLUSTER_PRESETS[activeIndex] ?? DOEPHONE_BOX_CLUSTER_PRESETS[0];
  const { layout } = preset;

  return (
    <div
      className={`relative mx-auto w-full overflow-hidden ${DOEPHONE_BOX_CLUSTER_STAGE_HEIGHT}`}
      role="tabpanel"
      id={`doephone-box-cluster-${preset.id}`}
      aria-label={preset.menuLabel}
    >
      <GradientBox
        backdrop={preset.left}
        presetId={preset.id}
        side="left"
        className={layout.left}
      />

      <GradientBox
        backdrop={preset.right}
        presetId={preset.id}
        side="right"
        className={layout.right}
      />

      <div
        className={`${layout.center} ${DOEPHONE_SECTION_CAROUSEL_RADIUS} ${BOX_MORPH_TW}`}
        aria-label="Feature preview"
      >
        <HeroAgentBoxPreview
          agentIndex={preset.agentIndex}
          className="h-full w-full"
        />
      </div>
    </div>
  );
}
