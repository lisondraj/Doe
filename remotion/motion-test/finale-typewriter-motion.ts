import { Easing, interpolate } from "remotion";

import {
  MOTION_TEST_TEXT_SCALE_END,
  MOTION_TEST_TEXT_SCALE_START,
} from "./constants";

const SLOW_EASE = Easing.out(Easing.quad);

export function getMotionTestFinaleTypewriterScale(
  frame: number,
  segmentStart: number,
  segmentEnd: number,
): number {
  return interpolate(
    frame,
    [segmentStart, segmentEnd],
    [MOTION_TEST_TEXT_SCALE_START, MOTION_TEST_TEXT_SCALE_END],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: SLOW_EASE,
    },
  );
}
