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
  relativeSlot: number;
  iconOpacity: number;
  labelOpacity: number;
  isActive: boolean;
};

export function isMotionTestFinaleDisciplineCarouselSliding(frame: number): boolean {
  const carouselFrame = frame - MOTION_TEST_FINALE_RESOLVE_THREE_LINE_PAN_START_FRAME;

  if (carouselFrame <= MOTION_TEST_FINALE_DISCIPLINE_CAROUSEL_INTRO_FRAMES) {
    return false;
  }

  const slot = getMotionTestFinaleDisciplineCarouselSlot(frame);
  const slideProgress = slot - Math.floor(slot);

  return slideProgress > 0.03 && slideProgress < 0.97;
}

function getMotionTestFinaleDisciplineCarouselItemOpacities(
  relativeSlot: number,
  translateXPx: number,
  stepPx: number,
): {
  iconOpacity: number;
  labelOpacity: number;
} {
  if (relativeSlot < 0) {
    if (relativeSlot <= -0.82 || translateXPx <= -stepPx * 0.72) {
      return { iconOpacity: 0, labelOpacity: 0 };
    }

    if (translateXPx >= 0) {
      return { iconOpacity: 1, labelOpacity: 1 };
    }

    const offLeftT = Math.min(1, Math.abs(translateXPx) / (stepPx * 0.48));

    return {
      iconOpacity: interpolate(offLeftT, [0, 0.28, 1], [1, 0.08, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
      labelOpacity: interpolate(offLeftT, [0, 0.55, 1], [1, 0.22, 0], {
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
      getMotionTestFinaleDisciplineCarouselItemOpacities(
        relativeSlot,
        translateXPx,
        stepPx,
      );
    const item = MOTION_TEST_FINALE_DISCIPLINE_CAROUSEL_ITEMS[index];

    return {
      index,
      label: item.label,
      icon: item.icon,
      translateXPx,
      relativeSlot,
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

const DISCIPLINE_CAROUSEL_MASK_RIGHT_PEEK =
  "68%, rgb(0 0 0 / 55%) 82%, transparent 100%)";

export function getMotionTestFinaleDisciplineCarouselMaskImage(
  frame: number,
  fontSize: number,
): string {
  const solidLeft = `linear-gradient(90deg, #000 0%, #000 ${DISCIPLINE_CAROUSEL_MASK_RIGHT_PEEK}`;

  if (!isMotionTestFinaleDisciplineCarouselSliding(frame)) {
    return solidLeft;
  }

  const items = getMotionTestFinaleDisciplineCarouselItems(frame, fontSize);
  const exitingItems = items.filter((item) => item.relativeSlot < 0);

  if (exitingItems.length === 0) {
    return solidLeft;
  }

  const minTranslateXPx = Math.min(...exitingItems.map((item) => item.translateXPx));

  if (minTranslateXPx >= -2) {
    return solidLeft;
  }

  const incomingItem = items.find(
    (item) => item.relativeSlot > 0 && item.relativeSlot <= 1,
  );
  const maskWidthPx = getMotionTestFinaleDisciplineCarouselMaskWidthPx(fontSize);
  const offLeftPx = Math.abs(minTranslateXPx);
  const fadeWidthPx = Math.min(
    maskWidthPx * 0.16,
    offLeftPx * 0.72 + fontSize * 0.14,
  );
  const fadePercent = Math.min(18, (fadeWidthPx / maskWidthPx) * 100);
  const fadeSoftPercent = fadePercent * 0.42;

  if (incomingItem && incomingItem.translateXPx <= fadeWidthPx * 1.05) {
    return solidLeft;
  }

  return `linear-gradient(90deg, transparent 0%, transparent ${Math.max(1.5, fadeSoftPercent * 0.35)}%, rgb(0 0 0 / 35%) ${fadeSoftPercent}%, #000 ${fadePercent}%, #000 ${DISCIPLINE_CAROUSEL_MASK_RIGHT_PEEK}`;
}
