import type { CSSProperties } from "react";

import { BLOG_LANDING_HERO } from "@/lib/blog/blog-landing-hero-colors";
import { HERO_CAROUSEL_GRAIN_BG } from "@/lib/hero-carousel-grain";

export type WorkflowCarouselGridKind = "dot" | "crosshatch" | "diagonal" | "hex" | "polar" | "wave";

export type WorkflowCarouselSurface = "orange" | "beige";

/** Solid fill for beige workflow / join hero surfaces. */
export const WORKFLOW_BEIGE_SURFACE_FILL = BLOG_LANDING_HERO.fill;

/** Lighter grid line colors for beige surfaces — lower contrast than BLOG_LANDING_HERO ink lines. */
const WORKFLOW_BEIGE_GRID = {
  line: "rgba(201, 192, 180, 0.28)",
  lineSoft: "rgba(201, 192, 180, 0.2)",
  dot: "rgba(201, 192, 180, 0.34)",
} as const;

export type WorkflowCarouselDesignBackdrop = {
  /** Carousel box index in `app/page.tsx` (0–5). */
  slideIndex: number;
  label: string;
  gradient: string;
  grid: WorkflowCarouselGridKind;
  /** Polar grid anchor Y as CSS % (defaults to 36% for built-for-you layout). */
  polarCenterY?: string;
  /** Optional white-line alpha for polar/wave overlays (default 0.24 polar / 0.12 wave on orange). */
  lineOverlayOpacity?: number;
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

/** Diagnostic assistant carousel card (slide index 2) — linear 180° gradient, hex grid, grain. */
export const DIAGNOSTIC_ASSISTANT_BACKDROP = WORKFLOW_CAROUSEL_DESIGN_BACKDROPS[4];

/** /doephone section 5 — same hex grid; softer top (less bright yellow). */
export const DOEPHONE_DIAGNOSTIC_ASSISTANT_GRADIENT =
  "linear-gradient(180deg, #D2774C 0%, #D49D4F 20%, #D2774C 52%, #1E343A 100%)";

/** `/design3` — Built for you (polar). */
export const DESIGN3_BACKDROP = WORKFLOW_CAROUSEL_DESIGN_BACKDROPS[1];

/** Main-page “HEY” / Report Results carousel card — radial + polar spokes. */
export const HEY_CAROUSEL_BACKDROP: WorkflowCarouselDesignBackdrop = {
  slideIndex: 1,
  label: "Report Results",
  gradient: "radial-gradient(circle at center, #E7A944 0%, #D49D4F 40%, #D2774C 70%, #1E343A 100%)",
  grid: "polar",
  polarCenterY: "50%",
};

/** `/doephone` hero — HEY polar grid; center shifted to copper (less bright yellow). */
export const DOEPHONE_HERO_BACKDROP: WorkflowCarouselDesignBackdrop = {
  slideIndex: 1,
  label: "Report Results",
  gradient: "radial-gradient(circle at center, #D4893f 0%, #D2774C 34%, #BF593D 54%, #8b4f38 72%, #1E343A 100%)",
  grid: "polar",
  polarCenterY: "50%",
};

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

function crosshatchGridStyle(
  surface: WorkflowCarouselSurface,
  lineOpacity = 0.12,
  dotOpacity = 0.18,
): CSSProperties {
  const line = surface === "beige" ? WORKFLOW_BEIGE_GRID.lineSoft : `rgba(255, 255, 255, ${lineOpacity})`;
  const dot = surface === "beige" ? WORKFLOW_BEIGE_GRID.dot : `rgba(255, 255, 255, ${dotOpacity})`;

  return {
    backgroundImage: [
      `radial-gradient(circle, ${dot} 1px, transparent 1px)`,
      `repeating-linear-gradient(0deg, transparent 0, transparent calc(${CROSSHATCH_CELL_PX}px - 0.8px), ${line} calc(${CROSSHATCH_CELL_PX}px - 0.8px), ${line} ${CROSSHATCH_CELL_PX}px)`,
      `repeating-linear-gradient(90deg, transparent 0, transparent calc(${CROSSHATCH_CELL_PX}px - 0.8px), ${line} calc(${CROSSHATCH_CELL_PX}px - 0.8px), ${line} ${CROSSHATCH_CELL_PX}px)`,
    ].join(", "),
    backgroundSize: `${CROSSHATCH_CELL_PX}px ${CROSSHATCH_CELL_PX}px`,
    backgroundPosition: `${CROSSHATCH_CELL_PX / 2}px ${CROSSHATCH_CELL_PX / 2}px, 0 0, 0 0`,
  };
}

export const WORKFLOW_CROSSHATCH_GRID_STYLE: CSSProperties = crosshatchGridStyle("orange");

export function dotGridStyle(surface: WorkflowCarouselSurface): CSSProperties {
  const dot = surface === "beige" ? WORKFLOW_BEIGE_GRID.dot : "rgba(255, 255, 255, 0.25)";
  return {
    backgroundImage: `radial-gradient(circle, ${dot} 1.5px, transparent 1.5px)`,
    backgroundSize: "50px 50px",
  };
}

export const WORKFLOW_DOT_GRID_STYLE: CSSProperties = dotGridStyle("orange");

function diagonalGridStyle(surface: WorkflowCarouselSurface): CSSProperties {
  const line = surface === "beige" ? WORKFLOW_BEIGE_GRID.lineSoft : "rgba(255, 255, 255, 0.15)";
  return {
    backgroundImage: `
    repeating-linear-gradient(
      45deg,
      transparent 0,
      transparent calc(60px - 0.8px),
      ${line} calc(60px - 0.8px),
      ${line} 60px
    ),
    repeating-linear-gradient(
      -45deg,
      transparent 0,
      transparent calc(60px - 0.8px),
      ${line} calc(60px - 0.8px),
      ${line} 60px
    )`,
    backgroundSize: "60px 60px",
  };
}

export const WORKFLOW_DIAGONAL_GRID_STYLE: CSSProperties = diagonalGridStyle("orange");

const HEX_CELL_W_PX = 80;
const HEX_CELL_H_PX = 69.28;

function hexGridSvg(surface: WorkflowCarouselSurface) {
  const stroke =
    surface === "beige" ? WORKFLOW_BEIGE_GRID.lineSoft : "rgba(255,255,255,0.1)";
  return encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${HEX_CELL_W_PX}" height="${HEX_CELL_H_PX}"><defs><pattern id="hex" width="${HEX_CELL_W_PX}" height="${HEX_CELL_H_PX}" patternUnits="userSpaceOnUse"><path d="M 40 0 L 80 17.32 L 80 51.96 L 40 69.28 L 0 51.96 L 0 17.32 Z" fill="none" stroke="${stroke}" stroke-width="0.8"/></pattern></defs><rect width="100%" height="100%" fill="url(#hex)"/></svg>`,
  );
}

function hexGridStyle(surface: WorkflowCarouselSurface): CSSProperties {
  return {
    backgroundImage: `url("data:image/svg+xml,${hexGridSvg(surface)}")`,
    backgroundSize: `${HEX_CELL_W_PX}px ${HEX_CELL_H_PX}px`,
  };
}

export const WORKFLOW_HEX_GRID_STYLE: CSSProperties = hexGridStyle("orange");

/** Wave overlay stroke for orange vs beige surfaces. */
export function workflowWaveStroke(surface: WorkflowCarouselSurface, opacity = 0.12): string {
  return surface === "beige" ? WORKFLOW_BEIGE_GRID.line : `rgba(255, 255, 255, ${opacity})`;
}

/** Polar overlay stroke for orange vs beige surfaces. */
export function workflowPolarStroke(surface: WorkflowCarouselSurface, opacity = 0.24): string {
  return surface === "beige" ? WORKFLOW_BEIGE_GRID.line : `rgba(255, 255, 255, ${opacity})`;
}

/** Scale > 1 zooms patterns out (larger cell spacing). */
export function getWorkflowGridOverlayStyle(
  kind: WorkflowCarouselGridKind,
  patternScale = 1,
  surface: WorkflowCarouselSurface = "orange",
  lineOverlayOpacity?: number,
): CSSProperties | null {
  const scaleSize = (px: number) => `${Math.round(px * patternScale)}px`;
  const crosshatchLineOpacity = lineOverlayOpacity ?? 0.12;
  const crosshatchDotOpacity = lineOverlayOpacity !== undefined ? lineOverlayOpacity * 1.5 : 0.18;

  switch (kind) {
    case "dot":
      return {
        ...dotGridStyle(surface),
        backgroundSize: `${scaleSize(50)} ${scaleSize(50)}`,
      };
    case "crosshatch":
      return {
        ...crosshatchGridStyle(surface, crosshatchLineOpacity, crosshatchDotOpacity),
        backgroundSize: `${scaleSize(CROSSHATCH_CELL_PX)} ${scaleSize(CROSSHATCH_CELL_PX)}`,
        backgroundPosition: `${(CROSSHATCH_CELL_PX * patternScale) / 2}px ${(CROSSHATCH_CELL_PX * patternScale) / 2}px, 0 0, 0 0`,
      };
    case "diagonal":
      return {
        ...diagonalGridStyle(surface),
        backgroundSize: `${scaleSize(60)} ${scaleSize(60)}`,
      };
    case "hex":
      return {
        ...hexGridStyle(surface),
        backgroundSize: `${scaleSize(HEX_CELL_W_PX)} ${scaleSize(HEX_CELL_H_PX)}`,
      };
    case "polar":
    case "wave":
      return null;
  }
}
