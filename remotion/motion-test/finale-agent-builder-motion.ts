import { Easing, interpolate } from "remotion";

import {
  MOTION_TEST_FINALE_AGENT_BUILDER_RESOLVE_SWIPE_FRAMES,
  MOTION_TEST_FINALE_AGENT_BUILDER_SCALE_START,
  MOTION_TEST_FINALE_AGENT_BUILDER_START_FRAME,
  MOTION_TEST_FINALE_PRODUCT_TITLE_CROSSFADE_FRAMES,
  MOTION_TEST_FINALE_PRODUCT_TITLE_SCALE_DOWN_FRAMES,
  MOTION_TEST_FINALE_PRODUCT_TITLE_SCALE_UP_FRAMES,
  MOTION_TEST_FINALE_PRODUCT_TITLE_SLOT_FRAMES,
  MOTION_TEST_FINALE_PRODUCT_TITLES,
  MOTION_TEST_FINALE_RESOLVE_SWIPE_START_FRAME,
  MOTION_TEST_WIDTH,
} from "./constants";

const SWIPE_EASE = Easing.in(Easing.cubic);
const SCALE_UP_EASE = Easing.out(Easing.cubic);
const SCALE_DOWN_EASE = Easing.in(Easing.cubic);
const CROSSFADE_EASE = Easing.inOut(Easing.cubic);

export function isMotionTestFinaleAgentBuilderPhase(frame: number): boolean {
  return frame >= MOTION_TEST_FINALE_AGENT_BUILDER_START_FRAME;
}

function getProductTitlePulseScale(slotLocalFrame: number): number {
  const scaleUpEnd = MOTION_TEST_FINALE_PRODUCT_TITLE_SCALE_UP_FRAMES;
  const scaleDownEnd =
    scaleUpEnd + MOTION_TEST_FINALE_PRODUCT_TITLE_SCALE_DOWN_FRAMES;

  if (slotLocalFrame <= scaleUpEnd) {
    return interpolate(
      slotLocalFrame,
      [0, scaleUpEnd],
      [MOTION_TEST_FINALE_AGENT_BUILDER_SCALE_START, 1],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: SCALE_UP_EASE,
      },
    );
  }

  if (slotLocalFrame <= scaleDownEnd) {
    return interpolate(
      slotLocalFrame,
      [scaleUpEnd, scaleDownEnd],
      [1, MOTION_TEST_FINALE_AGENT_BUILDER_SCALE_START],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: SCALE_DOWN_EASE,
      },
    );
  }

  return MOTION_TEST_FINALE_AGENT_BUILDER_SCALE_START;
}

function getProductTitleMotion(sequenceFrame: number): {
  title: string;
  titleOpacity: number;
  titleScale: number;
  productTitleIndex: number;
  useInvertedProductColors: boolean;
} {
  const maxIndex = MOTION_TEST_FINALE_PRODUCT_TITLES.length - 1;
  const slotIndex = Math.min(
    Math.floor(sequenceFrame / MOTION_TEST_FINALE_PRODUCT_TITLE_SLOT_FRAMES),
    maxIndex,
  );
  const slotLocalFrame =
    sequenceFrame - slotIndex * MOTION_TEST_FINALE_PRODUCT_TITLE_SLOT_FRAMES;
  const titleScale = getProductTitlePulseScale(slotLocalFrame);
  const title = MOTION_TEST_FINALE_PRODUCT_TITLES[slotIndex];
  const useInvertedProductColors = slotIndex % 2 === 1;

  if (slotIndex === 0) {
    const titleOpacity = interpolate(
      slotLocalFrame,
      [0, MOTION_TEST_FINALE_PRODUCT_TITLE_CROSSFADE_FRAMES],
      [0, 1],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: CROSSFADE_EASE,
      },
    );

    return {
      title,
      titleOpacity,
      titleScale,
      productTitleIndex: slotIndex,
      useInvertedProductColors,
    };
  }

  return {
    title,
    titleOpacity: 1,
    titleScale,
    productTitleIndex: slotIndex,
    useInvertedProductColors,
  };
}

export function isMotionTestFinaleProductTitleColorsInverted(frame: number): boolean {
  if (frame < MOTION_TEST_FINALE_AGENT_BUILDER_START_FRAME) {
    return false;
  }

  const sequenceFrame = frame - MOTION_TEST_FINALE_AGENT_BUILDER_START_FRAME;

  return getProductTitleMotion(sequenceFrame).useInvertedProductColors;
}

export function getMotionTestFinaleAgentBuilderMotion(frame: number): {
  resolveTranslateXPx: number;
  resolveVisible: boolean;
  title: string;
  titleOpacity: number;
  titleScale: number;
  productTitleIndex: number;
  useInvertedProductColors: boolean;
} {
  const titleIdle = {
    title: MOTION_TEST_FINALE_PRODUCT_TITLES[0],
    titleOpacity: 0,
    titleScale: MOTION_TEST_FINALE_AGENT_BUILDER_SCALE_START,
    productTitleIndex: 0,
    useInvertedProductColors: false,
  };

  if (frame < MOTION_TEST_FINALE_RESOLVE_SWIPE_START_FRAME) {
    return {
      resolveTranslateXPx: 0,
      resolveVisible: true,
      ...titleIdle,
    };
  }

  const swipeLocalFrame = frame - MOTION_TEST_FINALE_RESOLVE_SWIPE_START_FRAME;
  const swipeProgress = interpolate(
    swipeLocalFrame,
    [0, MOTION_TEST_FINALE_AGENT_BUILDER_RESOLVE_SWIPE_FRAMES],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: SWIPE_EASE,
    },
  );
  const resolveMotion = {
    resolveTranslateXPx: -swipeProgress * MOTION_TEST_WIDTH * 1.08,
    resolveVisible: swipeProgress < 1,
  };

  if (frame < MOTION_TEST_FINALE_AGENT_BUILDER_START_FRAME) {
    return {
      ...resolveMotion,
      ...titleIdle,
    };
  }

  const sequenceFrame = frame - MOTION_TEST_FINALE_AGENT_BUILDER_START_FRAME;

  return {
    ...resolveMotion,
    ...getProductTitleMotion(sequenceFrame),
  };
}
