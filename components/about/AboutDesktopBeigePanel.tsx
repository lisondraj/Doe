"use client";

import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import {
  DOEPHONE_SECTION_CAROUSEL_RADIUS,
  DOEPHONE_SECTION_CAROUSEL_RADIUS_PX,
} from "@/lib/doephone/section-styles";
import type { WorkflowCarouselGridKind } from "@/lib/workflow-carousel-design-backdrops";
import type { CSSProperties } from "react";

const INNER_RADIUS_LEFT = {
  borderRadius: `0 ${DOEPHONE_SECTION_CAROUSEL_RADIUS_PX} ${DOEPHONE_SECTION_CAROUSEL_RADIUS_PX} 0`,
  clipPath: `inset(0 round 0 ${DOEPHONE_SECTION_CAROUSEL_RADIUS_PX} ${DOEPHONE_SECTION_CAROUSEL_RADIUS_PX} 0)`,
} as const satisfies CSSProperties;

const INNER_RADIUS_RIGHT = {
  borderRadius: `${DOEPHONE_SECTION_CAROUSEL_RADIUS_PX} 0 0 ${DOEPHONE_SECTION_CAROUSEL_RADIUS_PX}`,
  clipPath: `inset(0 round ${DOEPHONE_SECTION_CAROUSEL_RADIUS_PX} 0 0 ${DOEPHONE_SECTION_CAROUSEL_RADIUS_PX})`,
} as const satisfies CSSProperties;

/** Beige panel — fills its column edge-to-edge with inner rounded corners toward text. */
export function AboutDesktopBeigePanel({
  grid,
  boxSide,
}: {
  grid: WorkflowCarouselGridKind;
  boxSide: "left" | "right";
}) {
  const panelRadius = boxSide === "left" ? INNER_RADIUS_LEFT : INNER_RADIUS_RIGHT;

  return (
    <div
      className="relative isolate h-full min-h-0 w-full overflow-hidden"
      style={panelRadius}
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
