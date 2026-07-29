import { Easing, interpolate } from "remotion";

import {
  MOTION_TEST_FINALE_GRADIENT_RESOLVE_START_FRAME,
  MOTION_TEST_FINALE_INTELLIGENCE_FLIPPED_START_FRAME,
  MOTION_TEST_FINALE_INTELLIGENCE_FLIPPED_TEXT_CHAR_WIDTH_RATIO,
  MOTION_TEST_FINALE_INTELLIGENCE_FLIPPED_TEXT_CIRCLE_INSET_PX,
  MOTION_TEST_FINALE_INTELLIGENCE_FLIPPED_WORD,
  MOTION_TEST_FINALE_INTELLIGENCE_FLIPPED_ZOOM_END_SCALE,
  MOTION_TEST_FINALE_INTELLIGENCE_FLIPPED_ZOOM_FRAMES,
  MOTION_TEST_FINALE_INTELLIGENCE_FLIPPED_ZOOM_START_FRAME,
  MOTION_TEST_WIDTH,
} from "./constants";

const ZOOM_EASE = Easing.inOut(Easing.cubic);

export type MotionTestFinaleIntelligenceFlippedPhase = "hold" | "zoom" | "after" | "resolve";

export function isMotionTestFinaleGradientResolve(frame: number): boolean {
  return frame >= MOTION_TEST_FINALE_GRADIENT_RESOLVE_START_FRAME;
}

/** Square diameter — fits frame width so circle sides aren’t flat-clipped. */
export function getMotionTestFinaleIntelligenceFlippedPortalSize(): number {
  return MOTION_TEST_WIDTH;
}

export function getMotionTestFinaleIntelligenceFlippedPhase(
  frame: number,
): MotionTestFinaleIntelligenceFlippedPhase {
  if (isMotionTestFinaleGradientResolve(frame)) {
    return "resolve";
  }

  if (frame < MOTION_TEST_FINALE_INTELLIGENCE_FLIPPED_START_FRAME) {
    return "hold";
  }

  if (frame < MOTION_TEST_FINALE_INTELLIGENCE_FLIPPED_ZOOM_START_FRAME) {
    return "hold";
  }

  if (
    frame <
    MOTION_TEST_FINALE_INTELLIGENCE_FLIPPED_ZOOM_START_FRAME +
      MOTION_TEST_FINALE_INTELLIGENCE_FLIPPED_ZOOM_FRAMES
  ) {
    return "zoom";
  }

  return "after";
}

function getFlippedZoomProgress(frame: number): number {
  const zoomFrame = frame - MOTION_TEST_FINALE_INTELLIGENCE_FLIPPED_ZOOM_START_FRAME;

  return interpolate(
    zoomFrame,
    [0, MOTION_TEST_FINALE_INTELLIGENCE_FLIPPED_ZOOM_FRAMES],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: ZOOM_EASE,
    },
  );
}

function estimateFlippedTextWidth(fontSize: number): number {
  return (
    fontSize *
    MOTION_TEST_FINALE_INTELLIGENCE_FLIPPED_TEXT_CHAR_WIDTH_RATIO *
    MOTION_TEST_FINALE_INTELLIGENCE_FLIPPED_WORD.length
  );
}

/** Shared portal scale — circle edge + text use the same progress and easing. */
function getFlippedPortalScale(progress: number): number {
  return interpolate(
    progress,
    [0, 1],
    [1, MOTION_TEST_FINALE_INTELLIGENCE_FLIPPED_ZOOM_END_SCALE],
  );
}

/** Circle portal zoom-out — text scale + slide locked to circle radius. */
export function getMotionTestFinaleIntelligenceFlippedZoom(
  frame: number,
  baseFontSize: number,
): {
  portalScale: number;
  portalSize: number;
  phase: MotionTestFinaleIntelligenceFlippedPhase;
  circleRadius: number;
  textOffsetX: number;
  textScale: number;
  textFontSize: number;
} {
  const flippedFrame = frame - MOTION_TEST_FINALE_INTELLIGENCE_FLIPPED_START_FRAME;
  const portalSize = getMotionTestFinaleIntelligenceFlippedPortalSize();
  const phase = getMotionTestFinaleIntelligenceFlippedPhase(frame);
  const startCenterX = portalSize / 2;

  if (flippedFrame < 0 || frame < MOTION_TEST_FINALE_INTELLIGENCE_FLIPPED_ZOOM_START_FRAME) {
    return {
      portalScale: 1,
      portalSize,
      phase,
      circleRadius: portalSize,
      textOffsetX: 0,
      textScale: 1,
      textFontSize: baseFontSize,
    };
  }

  const progress = getFlippedZoomProgress(frame);
  const zoomFrame = frame - MOTION_TEST_FINALE_INTELLIGENCE_FLIPPED_ZOOM_START_FRAME;
  const portalScale = getFlippedPortalScale(progress);
  const circleRadius = portalSize * portalScale;

  /** Same scale as the circle — one shared shrink curve. */
  const textScale = portalScale;
  const textFontSize = Math.round(baseFontSize * textScale);
  const textHalfWidth = estimateFlippedTextWidth(textFontSize) / 2;
  const inset = MOTION_TEST_FINALE_INTELLIGENCE_FLIPPED_TEXT_CIRCLE_INSET_PX;

  /** Prefer the in-circle fit — edge track alone pushed text too far left. */
  const edgeTrackedCenterX = circleRadius - startCenterX;
  const fitCenterX = circleRadius - textHalfWidth - inset;
  const textCenterX =
    zoomFrame <= 0 ? startCenterX : Math.max(edgeTrackedCenterX, fitCenterX);
  const textOffsetX = textCenterX - startCenterX;

  return {
    portalScale,
    portalSize,
    phase,
    circleRadius,
    textOffsetX,
    textScale,
    textFontSize,
  };
}

/** White fades in as the circle scales down — none during the opening hold. */
export function getMotionTestFinaleIntelligenceFlippedWhiteOpacity(frame: number): number {
  const phase = getMotionTestFinaleIntelligenceFlippedPhase(frame);

  if (phase === "hold") {
    return 0;
  }

  if (phase === "zoom") {
    const zoomFrame = frame - MOTION_TEST_FINALE_INTELLIGENCE_FLIPPED_ZOOM_START_FRAME;

    return interpolate(
      zoomFrame,
      [0, MOTION_TEST_FINALE_INTELLIGENCE_FLIPPED_ZOOM_FRAMES],
      [0, 1],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: ZOOM_EASE,
      },
    );
  }

  return 1;
}
