import type { CSSProperties } from "react";

import { HERO_CAROUSEL_GRAIN_BG } from "@/lib/hero-carousel-grain";
import { WORKFLOW_DOT_GRID_STYLE } from "@/lib/workflow-carousel-design-backdrops";

export { HERO_CAROUSEL_GRAIN_BG };

/**
 * Grain + fine square grid from workflow carousel “Referral Intake” slide (box 5).
 * CSS tiling keeps cells square when the hero viewport width changes.
 */

/** 56×56px cell — matches Referral Intake SVG pattern in carousel slides. */
const GRID_CELL_PX = 56;
const GRID_LINE = "rgba(255, 255, 255, 0.10)";
const GRID_DOT = "rgba(255, 255, 255, 0.15)";

export const HERO_CAROUSEL_SQUARE_GRID_STYLE: CSSProperties = {
  backgroundImage: [
    `radial-gradient(circle, ${GRID_DOT} 1px, transparent 1px)`,
    `repeating-linear-gradient(0deg, transparent 0, transparent calc(${GRID_CELL_PX}px - 0.8px), ${GRID_LINE} calc(${GRID_CELL_PX}px - 0.8px), ${GRID_LINE} ${GRID_CELL_PX}px)`,
    `repeating-linear-gradient(90deg, transparent 0, transparent calc(${GRID_CELL_PX}px - 0.8px), ${GRID_LINE} calc(${GRID_CELL_PX}px - 0.8px), ${GRID_LINE} ${GRID_CELL_PX}px)`,
  ].join(", "),
  backgroundSize: `${GRID_CELL_PX}px ${GRID_CELL_PX}px`,
  backgroundPosition: `${GRID_CELL_PX / 2}px ${GRID_CELL_PX / 2}px, 0 0, 0 0`,
};

export function HeroCarouselTextureOverlay({
  patternId: _patternId,
  introOnLoad = false,
  grid = "square",
}: {
  /** @deprecated Grid is CSS-tiled; id ignored. */
  patternId?: string;
  /** Fade + expand grid lines from top-left on first paint. */
  introOnLoad?: boolean;
  /** `dot` matches care coordination carousel (section 3). */
  grid?: "square" | "dot";
}) {
  const gridStyle = grid === "dot" ? WORKFLOW_DOT_GRID_STYLE : HERO_CAROUSEL_SQUARE_GRID_STYLE;

  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          backgroundImage: HERO_CAROUSEL_GRAIN_BG,
          backgroundSize: "200px 200px",
          opacity: 1,
          mixBlendMode: "overlay",
        }}
        aria-hidden
      />
      <div
        className={`pointer-events-none absolute inset-0 z-[2]${introOnLoad ? " hero-carousel-grid-intro" : ""}`}
        style={gridStyle}
        aria-hidden
      />
    </>
  );
}
