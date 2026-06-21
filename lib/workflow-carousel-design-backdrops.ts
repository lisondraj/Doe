import type { CSSProperties } from "react";

import { HERO_CAROUSEL_GRAIN_BG } from "@/components/hero-carousel-texture";

export type WorkflowCarouselGridKind = "dot" | "crosshatch" | "diagonal" | "hex" | "polar" | "wave";

export type WorkflowCarouselDesignBackdrop = {
  /** Carousel box index in `app/page.tsx` (0–5). */
  slideIndex: number;
  label: string;
  gradient: string;
  grid: WorkflowCarouselGridKind;
};

/** First five workflow carousel cards in scroll order (`WORKFLOW_SLIDE_DISPLAY_ORDER`). */
export const WORKFLOW_CAROUSEL_DESIGN_BACKDROPS: readonly WorkflowCarouselDesignBackdrop[] = [
  {
    slideIndex: 3,
    label: "Care routing",
    gradient: "radial-gradient(circle at center, #1E343A 0%, #D2774C 60%, #E7A944 100%)",
    grid: "dot",
  },
  {
    slideIndex: 4,
    label: "Built for you",
    gradient:
      "radial-gradient(circle at 50% 36%, #E7A944 0%, #D49D4F 40%, #D2774C 70%, #1E343A 100%)",
    grid: "polar",
  },
  {
    slideIndex: 0,
    label: "AI Receptionist",
    gradient:
      "linear-gradient(135deg, #E7A944 0%, #D49D4F 30%, #D2774C 60%, #1E343A 100%)",
    grid: "diagonal",
  },
  {
    slideIndex: 1,
    label: "Smart Appointments",
    gradient:
      "linear-gradient(135deg, #E7A944 0%, #D49D4F 30%, #D2774C 60%, #1E343A 100%)",
    grid: "diagonal",
  },
  {
    slideIndex: 2,
    label: "Billing & Finances",
    gradient:
      "linear-gradient(180deg, #E7A944 0%, #D49D4F 25%, #D2774C 55%, #1E343A 100%)",
    grid: "hex",
  },
] as const;

/** Care coordination carousel card (slide index 3) — radial gradient, dot grid, grain. */
export const CARE_COORDINATION_BACKDROP = WORKFLOW_CAROUSEL_DESIGN_BACKDROPS[0];

/** /doephone — larger radial, tighter yellow ring at the edge. */
export const DOEPHONE_CARE_COORDINATION_BACKDROP: WorkflowCarouselDesignBackdrop = {
  ...CARE_COORDINATION_BACKDROP,
  gradient:
    "radial-gradient(circle 98% at 50% 50%, #1E343A 0%, #D2774C 50%, #D49D4F 78%, #E7A944 100%)",
};

/** Diagnostic assistant carousel card (slide index 2) — linear 180° gradient, hex grid, grain. */
export const DIAGNOSTIC_ASSISTANT_BACKDROP = WORKFLOW_CAROUSEL_DESIGN_BACKDROPS[4];

/** `/design3` — Built for you (polar). */
export const DESIGN3_BACKDROP = WORKFLOW_CAROUSEL_DESIGN_BACKDROPS[1];

/** `/design5` — Billing & Finances (hex). */
export const DESIGN5_BACKDROP = WORKFLOW_CAROUSEL_DESIGN_BACKDROPS[4];

/** Last workflow carousel card (index 5) — Prior authorization copilot. */
export const WORKFLOW_CAROUSEL_LAST_BACKDROP: WorkflowCarouselDesignBackdrop = {
  slideIndex: 5,
  label: "Prior authorization",
  gradient: "linear-gradient(90deg, #1E343A 0%, #D2774C 38%, #D49D4F 68%, #E7A944 100%)",
  grid: "wave",
};

/** `/design6` — same as last carousel slide. */
export const DESIGN6_BACKDROP = WORKFLOW_CAROUSEL_LAST_BACKDROP;

export const WORKFLOW_CAROUSEL_GRAIN_STYLE: CSSProperties = {
  backgroundImage: HERO_CAROUSEL_GRAIN_BG,
  backgroundSize: "200px 200px",
  opacity: 1,
  mixBlendMode: "overlay",
};

const CROSSHATCH_CELL_PX = 56;
const CROSSHATCH_LINE = "rgba(255, 255, 255, 0.12)";
const CROSSHATCH_DOT = "rgba(255, 255, 255, 0.18)";

export const WORKFLOW_CROSSHATCH_GRID_STYLE: CSSProperties = {
  backgroundImage: [
    `radial-gradient(circle, ${CROSSHATCH_DOT} 1px, transparent 1px)`,
    `repeating-linear-gradient(0deg, transparent 0, transparent calc(${CROSSHATCH_CELL_PX}px - 0.8px), ${CROSSHATCH_LINE} calc(${CROSSHATCH_CELL_PX}px - 0.8px), ${CROSSHATCH_LINE} ${CROSSHATCH_CELL_PX}px)`,
    `repeating-linear-gradient(90deg, transparent 0, transparent calc(${CROSSHATCH_CELL_PX}px - 0.8px), ${CROSSHATCH_LINE} calc(${CROSSHATCH_CELL_PX}px - 0.8px), ${CROSSHATCH_LINE} ${CROSSHATCH_CELL_PX}px)`,
  ].join(", "),
  backgroundSize: `${CROSSHATCH_CELL_PX}px ${CROSSHATCH_CELL_PX}px`,
  backgroundPosition: `${CROSSHATCH_CELL_PX / 2}px ${CROSSHATCH_CELL_PX / 2}px, 0 0, 0 0`,
};

export const WORKFLOW_DOT_GRID_STYLE: CSSProperties = {
  backgroundImage: `radial-gradient(circle, rgba(255, 255, 255, 0.25) 1.5px, transparent 1.5px)`,
  backgroundSize: "50px 50px",
};

export const WORKFLOW_DIAGONAL_GRID_STYLE: CSSProperties = {
  backgroundImage: `
    repeating-linear-gradient(
      45deg,
      transparent 0,
      transparent calc(60px - 0.8px),
      rgba(255, 255, 255, 0.15) calc(60px - 0.8px),
      rgba(255, 255, 255, 0.15) 60px
    ),
    repeating-linear-gradient(
      -45deg,
      transparent 0,
      transparent calc(60px - 0.8px),
      rgba(255, 255, 255, 0.15) calc(60px - 0.8px),
      rgba(255, 255, 255, 0.15) 60px
    )`,
  backgroundSize: "60px 60px",
};

const HEX_CELL_W_PX = 80;
const HEX_CELL_H_PX = 69.28;

const hexGridSvg = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${HEX_CELL_W_PX}" height="${HEX_CELL_H_PX}"><defs><pattern id="hex" width="${HEX_CELL_W_PX}" height="${HEX_CELL_H_PX}" patternUnits="userSpaceOnUse"><path d="M 40 0 L 80 17.32 L 80 51.96 L 40 69.28 L 0 51.96 L 0 17.32 Z" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.8"/></pattern></defs><rect width="100%" height="100%" fill="url(#hex)"/></svg>`,
);

export const WORKFLOW_HEX_GRID_STYLE: CSSProperties = {
  backgroundImage: `url("data:image/svg+xml,${hexGridSvg}")`,
  backgroundSize: `${HEX_CELL_W_PX}px ${HEX_CELL_H_PX}px`,
};

/** Scale > 1 zooms patterns out (larger cell spacing). */
export function getWorkflowGridOverlayStyle(
  kind: WorkflowCarouselGridKind,
  patternScale = 1,
): CSSProperties | null {
  const scaleSize = (px: number) => `${Math.round(px * patternScale)}px`;

  switch (kind) {
    case "dot":
      return {
        ...WORKFLOW_DOT_GRID_STYLE,
        backgroundSize: `${scaleSize(50)} ${scaleSize(50)}`,
      };
    case "crosshatch":
      return {
        ...WORKFLOW_CROSSHATCH_GRID_STYLE,
        backgroundSize: `${scaleSize(CROSSHATCH_CELL_PX)} ${scaleSize(CROSSHATCH_CELL_PX)}`,
        backgroundPosition: `${(CROSSHATCH_CELL_PX * patternScale) / 2}px ${(CROSSHATCH_CELL_PX * patternScale) / 2}px, 0 0, 0 0`,
      };
    case "diagonal":
      return {
        ...WORKFLOW_DIAGONAL_GRID_STYLE,
        backgroundSize: `${scaleSize(60)} ${scaleSize(60)}`,
      };
    case "hex":
      return {
        ...WORKFLOW_HEX_GRID_STYLE,
        backgroundSize: `${scaleSize(HEX_CELL_W_PX)} ${scaleSize(HEX_CELL_H_PX)}`,
      };
    case "polar":
    case "wave":
      return null;
  }
}
