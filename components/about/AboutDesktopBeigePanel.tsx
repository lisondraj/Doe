"use client";

import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import { ABOUT_DESKTOP_BEIGE_PANEL_TW } from "@/lib/about/about-layout-styles";
import {
  DOEPHONE_SECTION_CAROUSEL_CLIP_STYLE,
  DOEPHONE_SECTION_CAROUSEL_RADIUS,
} from "@/lib/doephone/section-styles";
import type { WorkflowCarouselGridKind } from "@/lib/workflow-carousel-design-backdrops";

/** Beige rounded square with centered line overlay — unique grid per section. */
export function AboutDesktopBeigePanel({ grid }: { grid: WorkflowCarouselGridKind }) {
  return (
    <div
      className={`relative isolate mx-auto aspect-square w-full max-w-[min(100%,clamp(20rem,34vw,28rem))] overflow-hidden shadow-[0_10px_32px_rgba(0,0,0,0.06)] ${ABOUT_DESKTOP_BEIGE_PANEL_TW}`}
      style={DOEPHONE_SECTION_CAROUSEL_CLIP_STYLE}
    >
      <WorkflowCarouselDesignBackdrop
        backdrop={{
          slideIndex: 0,
          label: "About",
          gradient: "#EBE7E0",
          grid,
        }}
        embedded
        surface="beige"
        className={DOEPHONE_SECTION_CAROUSEL_RADIUS}
      />
    </div>
  );
}
