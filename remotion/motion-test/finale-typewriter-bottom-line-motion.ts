import { Easing, interpolate } from "remotion";

import {
  MOTION_TEST_FINALE_CORNER_LINE_BOTTOM_INSET_PX,
  MOTION_TEST_FINALE_FULL_PHRASE_START_FRAME,
  MOTION_TEST_FINALE_INTELLIGENCE_START_FRAME,
  MOTION_TEST_FINALE_TYPEWRITER_BOTTOM_LINE_ANIMATION_START_FRAME,
  MOTION_TEST_FINALE_TYPEWRITER_BOTTOM_LINE_INITIAL_VISIBLE_FRACTION,
  MOTION_TEST_FINALE_TYPEWRITER_BOTTOM_LINE_START_FRAME,
  MOTION_TEST_FINALE_TYPEWRITER_BOTTOM_LINE_WIDTH_PX,
  MOTION_TEST_WIDTH,
} from "./constants";

const PRE_ROLL_EASE = Easing.in(Easing.cubic);
const SWEEP_EASE = Easing.out(Easing.cubic);

const TYPEWRITER_BOTTOM_LINE_DRAW_END_FRAME = MOTION_TEST_FINALE_FULL_PHRASE_START_FRAME - 1;

function getMotionTestFinaleTypewriterBottomLineProgress(frame: number): number {
  const typeStartFrame = MOTION_TEST_FINALE_TYPEWRITER_BOTTOM_LINE_START_FRAME;
  const animationStartFrame = MOTION_TEST_FINALE_TYPEWRITER_BOTTOM_LINE_ANIMATION_START_FRAME;

  if (frame < typeStartFrame) {
    return interpolate(frame, [animationStartFrame, typeStartFrame], [-1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: PRE_ROLL_EASE,
    });
  }

  return interpolate(frame, [typeStartFrame, TYPEWRITER_BOTTOM_LINE_DRAW_END_FRAME], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: SWEEP_EASE,
  });
}

export function isMotionTestFinaleTypewriterBottomLineVisible(frame: number): boolean {
  return (
    frame >= MOTION_TEST_FINALE_TYPEWRITER_BOTTOM_LINE_START_FRAME &&
    frame < MOTION_TEST_FINALE_FULL_PHRASE_START_FRAME
  );
}

export function isMotionTestFinaleTypewriterBottomLineInverted(frame: number): boolean {
  return frame >= MOTION_TEST_FINALE_INTELLIGENCE_START_FRAME;
}

export type MotionTestFinaleTypewriterBottomLineMotion = {
  visible: boolean;
  leftPx: number;
  widthPx: number;
  useInvertedColors: boolean;
  bottomInsetPx: number;
  strokeHeightPx: number;
};

export function getMotionTestFinaleTypewriterBottomLineMotion(
  frame: number,
): MotionTestFinaleTypewriterBottomLineMotion {
  const idle = {
    visible: false,
    leftPx: -MOTION_TEST_WIDTH,
    widthPx: 0,
    useInvertedColors: false,
    bottomInsetPx: MOTION_TEST_FINALE_CORNER_LINE_BOTTOM_INSET_PX,
    strokeHeightPx: MOTION_TEST_FINALE_TYPEWRITER_BOTTOM_LINE_WIDTH_PX,
  };

  if (!isMotionTestFinaleTypewriterBottomLineVisible(frame)) {
    return idle;
  }

  const progress = getMotionTestFinaleTypewriterBottomLineProgress(frame);
  const widthPx = MOTION_TEST_WIDTH;
  const hiddenOffLeft = MOTION_TEST_WIDTH * (1 - MOTION_TEST_FINALE_TYPEWRITER_BOTTOM_LINE_INITIAL_VISIBLE_FRACTION);
  const leftPx = -hiddenOffLeft * (1 - progress);

  return {
    visible: true,
    leftPx,
    widthPx,
    useInvertedColors: isMotionTestFinaleTypewriterBottomLineInverted(frame),
    bottomInsetPx: MOTION_TEST_FINALE_CORNER_LINE_BOTTOM_INSET_PX,
    strokeHeightPx: MOTION_TEST_FINALE_TYPEWRITER_BOTTOM_LINE_WIDTH_PX,
  };
}
