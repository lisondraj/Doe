import { Easing, interpolate } from "remotion";

import {
  MOTION_TEST_DOE_JUMP_FONT_SIZE,
  MOTION_TEST_DOE_JUMP_FRAME,
  MOTION_TEST_DOE_JUMP_SCALE,
  MOTION_TEST_DOE_PAN_END_Y,
  MOTION_TEST_DOE_PAN_FRAMES,
  MOTION_TEST_DOE_PAN_START_Y,
  MOTION_TEST_DOE_START_FRAME,
  MOTION_TEST_FINALE_TYPE_START_FRAME,
  MOTION_TEST_FRONT_DESK_FAST_SCALE_END,
  MOTION_TEST_OPPOSITE_COLOR_FLASH_START_FRAME,
  MOTION_TEST_TEXT_SCALE_END,
  MOTION_TEST_TEXT_SCALE_START,
  MOTION_TEST_TITLE_FONT_SIZE,
  MOTION_TEST_VERY_BIG_WHITE_FLASH_START_FRAME,
} from "../constants";

const MEET_SCALE_EASE = Easing.out(Easing.quad);
const SLOW_EASE = Easing.out(Easing.quad);

/** Same %/frame as the white Doe pan — big Doe + stack keep drifting up. */
const DOE_PAN_RATE =
  (MOTION_TEST_DOE_PAN_START_Y - MOTION_TEST_DOE_PAN_END_Y) / MOTION_TEST_DOE_PAN_FRAMES;

function getMotionTestBigDoeTranslateY(frame: number): number {
  const bigFrame = frame - MOTION_TEST_DOE_JUMP_FRAME;
  return MOTION_TEST_DOE_PAN_END_Y - bigFrame * DOE_PAN_RATE;
}

function getMotionTestCenteredDoeTransform(scale: number): string {
  return `translateY(${MOTION_TEST_DOE_PAN_END_Y}%) scale(${scale})`;
}

function getMotionTestSmallDoeTranslateY(frame: number): number {
  const doeFrame = frame - MOTION_TEST_DOE_START_FRAME;
  return MOTION_TEST_DOE_PAN_START_Y - doeFrame * DOE_PAN_RATE;
}

export type MotionTestTextPhase = "front-desk" | "doe" | "finale";

export type MotionTestDoeBeat = "small" | "big";

export function getMotionTestTextPhase(frame: number): MotionTestTextPhase {
  if (frame < MOTION_TEST_DOE_START_FRAME) return "front-desk";
  if (frame < MOTION_TEST_FINALE_TYPE_START_FRAME) return "doe";
  return "finale";
}

export function getMotionTestDoeBeat(frame: number): MotionTestDoeBeat {
  if (frame < MOTION_TEST_DOE_JUMP_FRAME) return "small";
  return "big";
}

export function getMotionTestTextContent(frame: number): string {
  const phase = getMotionTestTextPhase(frame);
  switch (phase) {
    case "front-desk":
      return "Meet";
    case "doe":
      return "Doe";
    case "finale":
      return "";
  }
}

export function getMotionTestTextStyle(frame: number): {
  opacity: number;
  transform: string;
  fontSize: number;
  isBigDoe: boolean;
  doeBeat: MotionTestDoeBeat | "none";
} {
  const phase = getMotionTestTextPhase(frame);

  if (phase === "front-desk") {
    const scale = interpolate(
      frame,
      [0, MOTION_TEST_DOE_START_FRAME],
      [MOTION_TEST_TEXT_SCALE_START, MOTION_TEST_FRONT_DESK_FAST_SCALE_END],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: MEET_SCALE_EASE,
      },
    );

    return {
      opacity: 1,
      transform: `translateY(2%) scale(${scale})`,
      fontSize: MOTION_TEST_TITLE_FONT_SIZE,
      isBigDoe: false,
      doeBeat: "none",
    };
  }

  if (phase === "doe") {
    const doeBeat = getMotionTestDoeBeat(frame);

    if (doeBeat === "small") {
      const translateY = getMotionTestSmallDoeTranslateY(frame);

      return {
        opacity: 1,
        transform: `translateY(${translateY}%) scale(${MOTION_TEST_TEXT_SCALE_END})`,
        fontSize: MOTION_TEST_TITLE_FONT_SIZE,
        isBigDoe: false,
        doeBeat: "small",
      };
    }

    return {
      opacity: 1,
      transform: `translateY(${getMotionTestBigDoeTranslateY(frame)}%) scale(${MOTION_TEST_DOE_JUMP_SCALE})`,
      fontSize: MOTION_TEST_DOE_JUMP_FONT_SIZE,
      isBigDoe: true,
      doeBeat: "big",
    };
  }

  return {
    opacity: 1,
    transform: `translateY(2%) scale(${MOTION_TEST_TEXT_SCALE_END})`,
    fontSize: MOTION_TEST_TITLE_FONT_SIZE,
    isBigDoe: false,
    doeBeat: "none",
  };
}

/** Slow scale-down — continuous through white → clay color switch until finale. */
export function getMotionTestVeryBigWhiteDoeStyle(frame: number): { transform: string } {
  const scaleStart = MOTION_TEST_VERY_BIG_WHITE_FLASH_START_FRAME;
  const scaleEnd = MOTION_TEST_FINALE_TYPE_START_FRAME;

  const scale =
    frame < scaleStart
      ? MOTION_TEST_TEXT_SCALE_START
      : interpolate(
          frame,
          [scaleStart, scaleEnd],
          [MOTION_TEST_TEXT_SCALE_START, MOTION_TEST_TEXT_SCALE_END],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: SLOW_EASE,
          },
        );

  return {
    transform: getMotionTestCenteredDoeTransform(scale),
  };
}
