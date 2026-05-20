import type { CSSProperties } from "react";

import { HERO_CAROUSEL_GRAIN_BG } from "@/components/hero-carousel-texture";

export type WorkflowCarouselGridKind = "dot" | "crosshatch" | "diagonal" | "hex";

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
    label: "Referral Intake",
    gradient:
      "linear-gradient(135deg, #1E343A 0%, #4A3D32 18%, #5C4A3A 30%, #D2774C 60%, #D49D4F 82%, #E7A944 100%)",
    grid: "crosshatch",
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
