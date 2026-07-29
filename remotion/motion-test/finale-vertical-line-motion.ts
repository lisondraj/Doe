import { Easing, interpolate } from "remotion";

import {
  MOTION_TEST_FINALE_CORNER_LINE_INTERSECT_FRAME_OFFSET,
  MOTION_TEST_FINALE_CORNER_LINE_PHASE2_FRAMES,
  MOTION_TEST_FINALE_END_DESIGN_FRAME,
  MOTION_TEST_FINALE_VERTICAL_LINE_DROP_FRAMES,
  MOTION_TEST_FINALE_VERTICAL_LINE_START_FRAME,
  MOTION_TEST_HEIGHT,
  MOTION_TEST_WIDTH,
} from "./constants";

const DROP_EASE = Easing.inOut(Easing.cubic);

export function isMotionTestFinaleVerticalLineVisible(frame: number): boolean {
  return (
    frame >= MOTION_TEST_FINALE_VERTICAL_LINE_START_FRAME &&
    frame <= MOTION_TEST_FINALE_END_DESIGN_FRAME
  );
}

export type MotionTestFinaleCornerLineMotion = {
  visible: boolean;
  primaryHorizontalWidthPx: number;
  primaryVerticalHeightPx: number;
  mirrorHorizontalWidthPx: number;
  mirrorVerticalHeightPx: number;
};

export function getMotionTestFinaleVerticalLineMotion(
  frame: number,
): MotionTestFinaleCornerLineMotion {
  if (frame < MOTION_TEST_FINALE_VERTICAL_LINE_START_FRAME) {
    return {
      visible: false,
      primaryHorizontalWidthPx: 0,
      primaryVerticalHeightPx: 0,
      mirrorHorizontalWidthPx: 0,
      mirrorVerticalHeightPx: 0,
    };
  }

  const localFrame = frame - MOTION_TEST_FINALE_VERTICAL_LINE_START_FRAME;
  const primaryProgress = interpolate(
    localFrame,
    [0, MOTION_TEST_FINALE_VERTICAL_LINE_DROP_FRAMES],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: DROP_EASE,
    },
  );
  const phase2LocalFrame = localFrame - MOTION_TEST_FINALE_CORNER_LINE_INTERSECT_FRAME_OFFSET;
  const mirrorProgress =
    phase2LocalFrame <= 0
      ? 0
      : interpolate(
          phase2LocalFrame,
          [0, MOTION_TEST_FINALE_CORNER_LINE_PHASE2_FRAMES],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: DROP_EASE,
          },
        );

  return {
    visible: true,
    primaryHorizontalWidthPx: primaryProgress * MOTION_TEST_WIDTH,
    primaryVerticalHeightPx: primaryProgress * MOTION_TEST_HEIGHT,
    mirrorHorizontalWidthPx: mirrorProgress * MOTION_TEST_WIDTH,
    mirrorVerticalHeightPx: mirrorProgress * MOTION_TEST_HEIGHT,
  };
}