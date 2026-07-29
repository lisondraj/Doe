import { Easing, interpolate } from "remotion";

import {
  MOTION_TEST_FINALE_END_DESIGN_FRAME,
  MOTION_TEST_FINALE_LAUNCH_CARD_LINE1_VISIBLE_FRAMES,
  MOTION_TEST_FINALE_LAUNCH_CARD_LINE2_SCALE_START,
  MOTION_TEST_FINALE_LAUNCH_CARD_START_FRAME,
  MOTION_TEST_FINALE_OUTRO_SCALE_END,
} from "./constants";

/** One continuous scale from doe.care through the final Doe outro — no plateau or cut jump. */
const LOCKUP_SCALE_EASE = Easing.linear;

export function getMotionTestFinaleDoeLockupScale(frame: number): number {
  const scaleMotionStartFrame =
    MOTION_TEST_FINALE_LAUNCH_CARD_START_FRAME +
    MOTION_TEST_FINALE_LAUNCH_CARD_LINE1_VISIBLE_FRAMES;
  const scaleMotionEndFrame = MOTION_TEST_FINALE_END_DESIGN_FRAME - 1;
  const scaleDuration = Math.max(1, scaleMotionEndFrame - scaleMotionStartFrame);
  const localFrame = frame - scaleMotionStartFrame;

  if (localFrame <= 0) {
    return MOTION_TEST_FINALE_LAUNCH_CARD_LINE2_SCALE_START;
  }

  return interpolate(
    localFrame,
    [0, scaleDuration],
    [
      MOTION_TEST_FINALE_LAUNCH_CARD_LINE2_SCALE_START,
      MOTION_TEST_FINALE_OUTRO_SCALE_END,
    ],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: LOCKUP_SCALE_EASE,
    },
  );
}

/** @deprecated Use getMotionTestFinaleDoeLockupScale */
export function getMotionTestFinaleOutroLogoScale(frame: number): number {
  return getMotionTestFinaleDoeLockupScale(frame);
}
