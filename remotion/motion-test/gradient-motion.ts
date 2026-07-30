import { Easing, interpolate } from "remotion";

import {
  MOTION_TEST_DOE_JUMP_FRAME,
  MOTION_TEST_DOE_STACK_INVERT_START_FRAME,
  MOTION_TEST_DOE_STACK_REVERSED_BACKGROUND_START_FRAME,
  MOTION_TEST_FINALE_INTELLIGENCE_ISOLATE_START_FRAME,
  MOTION_TEST_FINALE_INTELLIGENCE_FLIPPED_START_FRAME,
  MOTION_TEST_FINALE_INTELLIGENCE_STACK_START_FRAME,
  MOTION_TEST_FINALE_INTELLIGENCE_START_FRAME,
  MOTION_TEST_FINALE_FULL_PHRASE_START_FRAME,
  MOTION_TEST_FINALE_RESOLVE_THREE_LINE_PAN_START_FRAME,
  MOTION_TEST_FINALE_SECOND_LINE_COLOR_SWITCH_FRAME,
  MOTION_TEST_FINALE_TWO_LINE_SEQUENCE_END_FRAME,
  MOTION_TEST_GRADIENT_LAYER_HEIGHT_RATIO,
  MOTION_TEST_GRADIENT_PULL_FRAMES,
  MOTION_TEST_HEIGHT,
  MOTION_TEST_OPPOSITE_COLOR_FLASH_START_FRAME,
  MOTION_TEST_OPENING_FRAME_GRADIENT,
  MOTION_TEST_PULL_END_Y_RATIO,
  MOTION_TEST_PULL_START_Y_RATIO,
  MOTION_TEST_DOE_STACK_REVERSED_BACKGROUND_GRADIENT,
  MOTION_TEST_STACK_HIDE_FRAME,
  MOTION_TEST_TITLE_GRADIENT,
  MOTION_TEST_WHITE_OVERLAY_FADE_FRAMES,
  MOTION_TEST_WIDTH,
} from "./constants";

const PULL_EASE = Easing.inOut(Easing.cubic);

function usesMotionTestDoeStackReversedBackground(frame: number): boolean {
  return (
    frame >= MOTION_TEST_DOE_STACK_REVERSED_BACKGROUND_START_FRAME &&
    frame < MOTION_TEST_STACK_HIDE_FRAME
  );
}

export function getMotionTestTitleBackgroundGradient(frame: number): string {
  if (frame < MOTION_TEST_DOE_JUMP_FRAME) {
    return MOTION_TEST_OPENING_FRAME_GRADIENT;
  }

  if (usesMotionTestDoeStackReversedBackground(frame)) {
    return MOTION_TEST_DOE_STACK_REVERSED_BACKGROUND_GRADIENT;
  }

  return MOTION_TEST_TITLE_GRADIENT;
}

export function getMotionTestOpeningGradientY(layerHeight: number): number {
  return layerHeight * MOTION_TEST_PULL_START_Y_RATIO;
}

/** Same radial bed as TitleFrameScene — opening pull position. */
export function getMotionTestFullScreenGradientLayerStyle(): {
  layerHeight: number;
  gradientY: number;
  background: string;
} {
  const layerHeight = MOTION_TEST_HEIGHT * MOTION_TEST_GRADIENT_LAYER_HEIGHT_RATIO;

  return {
    layerHeight,
    gradientY: getMotionTestOpeningGradientY(layerHeight),
    background: MOTION_TEST_OPENING_FRAME_GRADIENT,
  };
}

function getMotionTestLiveGradientY(frame: number, layerHeight: number): number {
  const pullStartY = layerHeight * MOTION_TEST_PULL_START_Y_RATIO;
  const pullEndY = layerHeight * MOTION_TEST_PULL_END_Y_RATIO;

  return interpolate(frame, [0, MOTION_TEST_GRADIENT_PULL_FRAMES], [pullStartY, pullEndY], {
    extrapolateLeft: "clamp",
    extrapolateRight: "extend",
    easing: PULL_EASE,
  });
}

export function getMotionTestGradientY(frame: number): {
  gradientY: number;
  layerHeight: number;
  pullProgress: number;
  whiteOverlayOpacity: number;
  usesOpeningGradient: boolean;
  gradientScale: number;
  gradientOriginX: number;
  gradientOriginY: number;
} {
  const layerHeight = MOTION_TEST_HEIGHT * MOTION_TEST_GRADIENT_LAYER_HEIGHT_RATIO;
  const openingGradientY = getMotionTestOpeningGradientY(layerHeight);
  const isReversedStackBackground = usesMotionTestDoeStackReversedBackground(frame);

  // Snap gradient before the white overlay clears so the reveal never jumps.
  const usesOpeningGradient = frame >= MOTION_TEST_DOE_STACK_INVERT_START_FRAME;

  const gradientY = isReversedStackBackground
    ? 0
    : usesOpeningGradient
      ? openingGradientY
      : getMotionTestLiveGradientY(frame, layerHeight);

  const resolvedLayerHeight = isReversedStackBackground ? MOTION_TEST_HEIGHT : layerHeight;

  const pullProgress = interpolate(frame, [0, MOTION_TEST_GRADIENT_PULL_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "extend",
    easing: PULL_EASE,
  });

  const whiteInEnd = MOTION_TEST_DOE_JUMP_FRAME + MOTION_TEST_WHITE_OVERLAY_FADE_FRAMES;

  let whiteOverlayOpacity = 0;
  let gradientScale = 1;
  let gradientOriginX = MOTION_TEST_WIDTH / 2;
  let gradientOriginY = MOTION_TEST_HEIGHT / 2;

  if (frame < MOTION_TEST_DOE_JUMP_FRAME) {
    whiteOverlayOpacity = 0;
  } else if (frame < whiteInEnd) {
    whiteOverlayOpacity = interpolate(frame, [MOTION_TEST_DOE_JUMP_FRAME, whiteInEnd], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    });
  } else if (frame < MOTION_TEST_DOE_STACK_INVERT_START_FRAME) {
    whiteOverlayOpacity = 1;
  } else if (frame < MOTION_TEST_OPPOSITE_COLOR_FLASH_START_FRAME) {
    whiteOverlayOpacity = 0;
  } else if (
    frame >= MOTION_TEST_FINALE_INTELLIGENCE_START_FRAME &&
    frame < MOTION_TEST_FINALE_FULL_PHRASE_START_FRAME
  ) {
    whiteOverlayOpacity = 0;
  } else if (
    frame >= MOTION_TEST_FINALE_SECOND_LINE_COLOR_SWITCH_FRAME &&
    frame < MOTION_TEST_FINALE_TWO_LINE_SEQUENCE_END_FRAME
  ) {
    whiteOverlayOpacity = 0;
  } else if (frame >= MOTION_TEST_FINALE_RESOLVE_THREE_LINE_PAN_START_FRAME) {
    whiteOverlayOpacity = 1;
  } else if (frame >= MOTION_TEST_FINALE_INTELLIGENCE_FLIPPED_START_FRAME) {
    whiteOverlayOpacity = 0;
  } else if (frame >= MOTION_TEST_FINALE_INTELLIGENCE_ISOLATE_START_FRAME) {
    whiteOverlayOpacity = 1;
  } else {
    whiteOverlayOpacity = 1;
  }

  return {
    gradientY,
    layerHeight: resolvedLayerHeight,
    pullProgress,
    whiteOverlayOpacity,
    usesOpeningGradient,
    gradientScale,
    gradientOriginX,
    gradientOriginY,
  };
}
