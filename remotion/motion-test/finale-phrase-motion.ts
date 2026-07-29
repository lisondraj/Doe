import { Easing, interpolate } from "remotion";

import {
  MOTION_TEST_FINALE_FULL_PHRASE_FONT_SIZE,
  MOTION_TEST_FINALE_FULL_PHRASE_SCALE_END,
  MOTION_TEST_FINALE_FULL_PHRASE_SCALE_START,
  MOTION_TEST_FINALE_FULL_PHRASE_START_FRAME,
  MOTION_TEST_FINALE_INTELLIGENCE_STACK_FRAMES,
  MOTION_TEST_FINALE_INTELLIGENCE_STACK_START_FRAME,
  MOTION_TEST_FINALE_SECOND_LINE_PAN_FRAMES,
  MOTION_TEST_FINALE_TWO_LINE_LEADING,
  MOTION_TEST_FINALE_TWO_LINE_PAN_START_OFFSET,
  MOTION_TEST_FINALE_TYPE_FONT_SIZE,
  MOTION_TEST_FINALE_INTELLIGENCE_FLIPPED_WORD,
  MOTION_TEST_FINALE_INTELLIGENCE_WORD,
  MOTION_TEST_TEXT_SCALE_END,
} from "./constants";

const SLOW_EASE = Easing.out(Easing.quad);
const PAN_EASE = Easing.inOut(Easing.cubic);

export function getMotionTestFinalePhraseMotion(frame: number): {
  scale: number;
  line1TranslateY: number;
  line2TranslateY: number;
  line2Opacity: number;
  fontSize: number;
  lineHeight: number;
} {
  const phraseFrame = frame - MOTION_TEST_FINALE_FULL_PHRASE_START_FRAME;
  const fontSize = MOTION_TEST_FINALE_FULL_PHRASE_FONT_SIZE;
  const lineHeight = MOTION_TEST_FINALE_TWO_LINE_LEADING;
  const lineStep = fontSize * lineHeight;
  const halfPair = lineStep * 0.5;
  const line2Enter = lineStep * 1.15;

  /** Scale-down runs through two-line hold and stack — no plateau before the cut. */
  const panStart = MOTION_TEST_FINALE_TWO_LINE_PAN_START_OFFSET;
  const panEnd = panStart + MOTION_TEST_FINALE_SECOND_LINE_PAN_FRAMES;
  const scaleEndFrame =
    MOTION_TEST_FINALE_INTELLIGENCE_STACK_START_FRAME +
    MOTION_TEST_FINALE_INTELLIGENCE_STACK_FRAMES -
    MOTION_TEST_FINALE_FULL_PHRASE_START_FRAME;

  const scale = interpolate(
    phraseFrame,
    [0, scaleEndFrame],
    [MOTION_TEST_FINALE_FULL_PHRASE_SCALE_START, MOTION_TEST_FINALE_FULL_PHRASE_SCALE_END],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: SLOW_EASE,
    },
  );

  const panProgress =
    phraseFrame < panStart
      ? 0
      : interpolate(phraseFrame, [panStart, panEnd], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: PAN_EASE,
        });

  const line1TranslateY = interpolate(panProgress, [0, 1], [0, -halfPair]);
  const line2TranslateY = interpolate(panProgress, [0, 1], [line2Enter, halfPair]);
  const line2Opacity = panProgress;

  return {
    scale,
    line1TranslateY,
    line2TranslateY,
    line2Opacity,
    fontSize,
    lineHeight,
  };
}

/** Frozen pose at end of two-line hold — “intelligence” stays put. */
export function getMotionTestFinaleIntelligenceIsolateMotion(): {
  scale: number;
  line1TranslateY: number;
  fontSize: number;
} {
  const fontSize = MOTION_TEST_FINALE_FULL_PHRASE_FONT_SIZE;
  const lineStep = fontSize * MOTION_TEST_FINALE_TWO_LINE_LEADING;
  const halfPair = lineStep * 0.5;

  return {
    scale: MOTION_TEST_FINALE_FULL_PHRASE_SCALE_END,
    line1TranslateY: -halfPair,
    fontSize,
  };
}

/** Big “intelligence for” — dead center, flipped colors. */
export function getMotionTestFinaleIntelligenceFlippedMotion(): {
  scale: number;
  fontSize: number;
} {
  const fontSize = Math.round(
    (MOTION_TEST_FINALE_TYPE_FONT_SIZE * MOTION_TEST_FINALE_INTELLIGENCE_WORD.length) /
      MOTION_TEST_FINALE_INTELLIGENCE_FLIPPED_WORD.length,
  );

  return {
    scale: MOTION_TEST_TEXT_SCALE_END,
    fontSize,
  };
}
