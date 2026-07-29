import { Easing, interpolate } from "remotion";

import {
  MOTION_TEST_FINALE_GRADIENT_RESOLVE_START_FRAME,
  MOTION_TEST_FINALE_RESOLVE_THREE_LINE_PAN_FRAMES,
  MOTION_TEST_FINALE_RESOLVE_THREE_LINE_PAN_START_FRAME,
} from "./constants";

const PAN_EASE = Easing.inOut(Easing.cubic);

export function isMotionTestFinaleResolvePanPhase(frame: number): boolean {
  return frame >= MOTION_TEST_FINALE_RESOLVE_THREE_LINE_PAN_START_FRAME;
}

export function isMotionTestFinaleResolveColorSwitched(_frame: number): boolean {
  return false;
}

export function isMotionTestFinaleResolveSegmentPhase(frame: number): boolean {
  return (
    frame >= MOTION_TEST_FINALE_GRADIENT_RESOLVE_START_FRAME &&
    frame < MOTION_TEST_FINALE_RESOLVE_THREE_LINE_PAN_START_FRAME
  );
}

/** Pan lines 1–2 up one step; line 3 enters from below — mirrors two-line phrase motion. */
export function getMotionTestFinaleResolveThreeLinePanMotion(
  frame: number,
  basePanY: number,
  lineStep: number,
): {
  line1Y: number;
  line2Y: number;
  line3Y: number;
  line3Opacity: number;
} {
  const panFrame = frame - MOTION_TEST_FINALE_RESOLVE_THREE_LINE_PAN_START_FRAME;
  const panProgress = interpolate(
    panFrame,
    [0, MOTION_TEST_FINALE_RESOLVE_THREE_LINE_PAN_FRAMES],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: PAN_EASE,
    },
  );
  const line3Enter = lineStep * 1.15;
  const panUp = -lineStep * panProgress;
  const line3Pan = interpolate(panProgress, [0, 1], [line3Enter, lineStep]);
  const line3Opacity = panProgress;

  return {
    line1Y: basePanY + panUp,
    line2Y: basePanY + lineStep + panUp,
    line3Y: basePanY + line3Pan,
    line3Opacity,
  };
}
