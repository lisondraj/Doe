import { Easing, interpolate } from "remotion";

import {
  MOTION_TEST_FINALE_DISCIPLINE_CAROUSEL_INTRO_FRAMES,
  MOTION_TEST_FINALE_DISCIPLINE_CAROUSEL_ITEMS,
  MOTION_TEST_FINALE_DISCIPLINE_CAROUSEL_SLOT_FRAMES,
  MOTION_TEST_FINALE_INTELLIGENCE_FLIPPED_TEXT_CHAR_WIDTH_RATIO,
  MOTION_TEST_FINALE_RESOLVE_THREE_LINE_PAN_START_FRAME,
} from "./constants";

const SWIPE_EASE = Easing.inOut(Easing.cubic);

export function getMotionTestFinaleDisciplineCarouselSlot(frame: number): number {
  const carouselFrame = frame - MOTION_TEST_FINALE_RESOLVE_THREE_LINE_PAN_START_FRAME;

  if (carouselFrame <= MOTION_TEST_FINALE_DISCIPLINE_CAROUSEL_INTRO_FRAMES) {
    return 0;
  }

  const tailFrame = carouselFrame - MOTION_TEST_FINALE_DISCIPLINE_CAROUSEL_INTRO_FRAMES;
  const maxSlot = MOTION_TEST_FINALE_DISCIPLINE_CAROUSEL_ITEMS.length - 1;
  const rawSlot = tailFrame / MOTION_TEST_FINALE_DISCIPLINE_CAROUSEL_SLOT_FRAMES;

  if (rawSlot >= maxSlot) {
    return maxSlot;
  }

  const wordIndex = Math.floor(rawSlot);
  const localProgress = rawSlot - wordIndex;

  return (
    wordIndex +
    interpolate(localProgress, [0, 1], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: SWIPE_EASE,
    })
  );
}

export function estimateMotionTestFinaleDisciplineCarouselStepPx(fontSize: number): number {
  const longestLabel = MOTION_TEST_FINALE_DISCIPLINE_CAROUSEL_ITEMS.reduce(
    (longest, item) => (item.label.length > longest.length ? item.label : longest),
    "",
  );
  const iconWidth = fontSize * 0.9;
  const gap = fontSize * 0.18;
  const textWidth =
    fontSize *
    MOTION_TEST_FINALE_INTELLIGENCE_FLIPPED_TEXT_CHAR_WIDTH_RATIO *
    longestLabel.length;
  return iconWidth + gap + textWidth + fontSize * 0.55;
}

export type MotionTestFinaleDisciplineCarouselItemPose = {
  index: number;
  label: string;
  icon: (typeof MOTION_TEST_FINALE_DISCIPLINE_CAROUSEL_ITEMS)[number]["icon"];
  translateXPx: number;
  iconOpacity: number;
  labelOpacity: number;
  isActive: boolean;
};

function getMotionTestFinaleDisciplineCarouselItemOpacities(relativeSlot: number): {
  iconOpacity: number;
  labelOpacity: number;
} {
  if (relativeSlot < 0) {
    const exitT = Math.abs(relativeSlot);

    return {
      iconOpacity: interpolate(exitT, [0, 0.4, 1], [1, 0.12, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
      labelOpacity: interpolate(exitT, [0, 0.85, 1], [1, 0.55, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
    };
  }

  const peekOpacity = interpolate(relativeSlot, [0, 0.75, 1.35], [1, 0.42, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return {
    iconOpacity: peekOpacity,
    labelOpacity: peekOpacity,
  };
}

export function getMotionTestFinaleDisciplineCarouselItems(
  frame: number,
  fontSize: number,
): MotionTestFinaleDisciplineCarouselItemPose[] {
  const slot = getMotionTestFinaleDisciplineCarouselSlot(frame);
  const stepPx = estimateMotionTestFinaleDisciplineCarouselStepPx(fontSize);
  const slotFloor = Math.floor(slot);
  const slotCeil = Math.ceil(slot);
  const indices: number[] = [];

  for (let index = slotFloor - 1; index <= slotCeil + 1; index++) {
    if (index >= 0 && index < MOTION_TEST_FINALE_DISCIPLINE_CAROUSEL_ITEMS.length) {
      indices.push(index);
    }
  }

  return indices.map((index) => {
    const relativeSlot = index - slot;
    const translateXPx = relativeSlot * stepPx;
    const distance = Math.abs(relativeSlot);
    const { iconOpacity, labelOpacity } =
      getMotionTestFinaleDisciplineCarouselItemOpacities(relativeSlot);
    const item = MOTION_TEST_FINALE_DISCIPLINE_CAROUSEL_ITEMS[index];

    return {
      index,
      label: item.label,
      icon: item.icon,
      translateXPx,
      iconOpacity,
      labelOpacity,
      isActive: distance < 0.12,
    };
  });
}

export function getMotionTestFinaleDisciplineCarouselMaskWidthPx(
  fontSize: number,
): number {
  return estimateMotionTestFinaleDisciplineCarouselStepPx(fontSize) * 2.35;
}

export function getMotionTestFinaleDisciplineCarouselMaskImage(): string {
  return "linear-gradient(90deg, #000 0%, #000 68%, rgb(0 0 0 / 55%) 82%, transparent 100%)";
}
