import type { CSSProperties } from "react";

/**
 * Grain + fine square grid from workflow carousel “Referral Intake” slide (box 5).
 * CSS tiling keeps cells square when the hero viewport width changes.
 */
export const HERO_CAROUSEL_GRAIN_BG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`;

/** 56×56px cell — matches Referral Intake SVG pattern in carousel slides. */
const GRID_CELL_PX = 56;
const GRID_LINE = "rgba(255, 255, 255, 0.12)";
const GRID_DOT = "rgba(255, 255, 255, 0.18)";

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
}: {
  /** @deprecated Grid is CSS-tiled; id ignored. */
  patternId?: string;
}) {
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
        className="pointer-events-none absolute inset-0 z-[2]"
        style={HERO_CAROUSEL_SQUARE_GRID_STYLE}
        aria-hidden
      />
    </>
  );
}
