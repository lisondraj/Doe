import { Easing, interpolate } from "remotion";

import {
  MOTION_TEST_FINALE_AUDIENCE_CAROUSEL_ITEMS,
  MOTION_TEST_FINALE_AUDIENCE_CAROUSEL_PAN_ITEM_COUNT,
  MOTION_TEST_FINALE_AUDIENCE_CAROUSEL_PEEK_INDEX,
  MOTION_TEST_FINALE_AUDIENCE_CAROUSEL_STACK_ALIGN_OFFSET,
  MOTION_TEST_FINALE_AUDIENCE_CAROUSEL_START_FRAME,
  MOTION_TEST_FINALE_AUDIENCE_CAROUSEL_FONT_SCALE,
  MOTION_TEST_FINALE_GRADIENT_RESOLVE_START_FRAME,
  MOTION_TEST_FINALE_AUDIENCE_CAROUSEL_WHITE_GAP_PX,
  MOTION_TEST_FINALE_AUDIENCE_CAROUSEL_WORD_FRAMES,
  MOTION_TEST_FINALE_AUDIENCE_CAROUSEL_WORD_HOLD_FRAMES,
  MOTION_TEST_FINALE_AUDIENCE_CAROUSEL_WORD_TRANSITION_FRAMES,
  MOTION_TEST_FINALE_INTELLIGENCE_STACK_LINE_HEIGHT,
  MOTION_TEST_FINALE_INTELLIGENCE_WORD,
  MOTION_TEST_FINALE_INTELLIGENCE_FLIPPED_WORD,
  MOTION_TEST_FINALE_TYPE_FONT_SIZE,
  MOTION_TEST_HEIGHT,
  MOTION_TEST_WIDTH,
} from "./constants";
import {
  getMotionTestFinaleIntelligenceFlippedStackEchoDrift,
  getMotionTestFinaleIntelligenceFlippedStackPanY,
} from "./finale-intelligence-stack-motion";
import { getMotionTestFinaleIntelligenceFlippedZoom } from "./finale-intelligence-flipped-zoom-motion";

const SMOOTH_EASE = Easing.inOut(Easing.cubic);

export function getMotionTestFinaleAudienceCarouselBaseFontSize(): number {
  return Math.round(
    (MOTION_TEST_FINALE_TYPE_FONT_SIZE * MOTION_TEST_FINALE_INTELLIGENCE_WORD.length) /
      MOTION_TEST_FINALE_INTELLIGENCE_FLIPPED_WORD.length,
  );
}

export function isMotionTestFinaleAudienceCarouselVisible(frame: number): boolean {
  return (
    frame >= MOTION_TEST_FINALE_AUDIENCE_CAROUSEL_START_FRAME &&
    frame < MOTION_TEST_FINALE_GRADIENT_RESOLVE_START_FRAME
  );
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function getCarouselSlot(carouselFrame: number): number {
  const maxSlot = MOTION_TEST_FINALE_AUDIENCE_CAROUSEL_PAN_ITEM_COUNT - 1;
  const slotFrames = MOTION_TEST_FINALE_AUDIENCE_CAROUSEL_WORD_FRAMES;
  const holdFrames = MOTION_TEST_FINALE_AUDIENCE_CAROUSEL_WORD_HOLD_FRAMES;
  const transitionFrames = MOTION_TEST_FINALE_AUDIENCE_CAROUSEL_WORD_TRANSITION_FRAMES;

  if (carouselFrame >= maxSlot * slotFrames) {
    return maxSlot;
  }

  const wordIndex = Math.floor(carouselFrame / slotFrames);
  const localFrame = carouselFrame - wordIndex * slotFrames;

  if (localFrame <= holdFrames) {
    return wordIndex;
  }

  const transitionProgress = (localFrame - holdFrames) / transitionFrames;

  return (
    wordIndex +
    interpolate(transitionProgress, [0, 1], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: SMOOTH_EASE,
    })
  );
}

function getCarouselRevealOpacity(frame: number): number {
  const carouselFrame = frame - MOTION_TEST_FINALE_AUDIENCE_CAROUSEL_START_FRAME;

  return interpolate(carouselFrame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: SMOOTH_EASE,
  });
}

function getCarouselWordOpacity(relativeSlot: number): number {
  if (relativeSlot < -1.15) {
    return 0;
  }

  if (relativeSlot < 0) {
    return interpolate(relativeSlot, [-1.15, -1, 0], [0, 0.44, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  if (relativeSlot <= 1) {
    return interpolate(relativeSlot, [0, 0.75, 1], [1, 0.58, 0.44], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  return interpolate(relativeSlot, [1, 1.5], [0.44, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

/** Circle edge x at a given y — right semicircle only. */
function getCircleEdgeXPx(circleRadius: number, circleCenterY: number, yPx: number): number {
  const dy = clamp(yPx - circleCenterY, -circleRadius * 0.9, circleRadius * 0.9);
  return Math.sqrt(Math.max(0, circleRadius * circleRadius - dy * dy));
}

export function getMotionTestFinaleAudienceCarouselLayout(frame: number): {
  circleCenterY: number;
  circleRadius: number;
  alignY: number;
  lineStepPx: number;
  fontSize: number;
  viewportHeightPx: number;
  whiteGapPx: number;
} {
  const baseFontSize = getMotionTestFinaleAudienceCarouselBaseFontSize();
  const { circleRadius, textFontSize } = getMotionTestFinaleIntelligenceFlippedZoom(
    frame,
    baseFontSize,
  );
  const portalLineStepPx =
    textFontSize * MOTION_TEST_FINALE_INTELLIGENCE_STACK_LINE_HEIGHT;
  const fontSize = Math.round(textFontSize * MOTION_TEST_FINALE_AUDIENCE_CAROUSEL_FONT_SCALE);
  const lineStepPx = fontSize * MOTION_TEST_FINALE_INTELLIGENCE_STACK_LINE_HEIGHT;
  const stackPanY = getMotionTestFinaleIntelligenceFlippedStackPanY(frame);
  const alignOffset = MOTION_TEST_FINALE_AUDIENCE_CAROUSEL_STACK_ALIGN_OFFSET;
  const alignDrift = getMotionTestFinaleIntelligenceFlippedStackEchoDrift(
    frame,
    portalLineStepPx,
    alignOffset,
  );
  const circleCenterY = MOTION_TEST_HEIGHT / 2;
  const alignY =
    circleCenterY + stackPanY + alignOffset * portalLineStepPx + alignDrift;
  const whiteGapPx = Math.max(
    MOTION_TEST_FINALE_AUDIENCE_CAROUSEL_WHITE_GAP_PX,
    fontSize * 0.12,
  );

  return {
    circleCenterY,
    circleRadius,
    alignY,
    lineStepPx,
    fontSize,
    viewportHeightPx: lineStepPx * 2.35,
    whiteGapPx,
  };
}

function getWhiteSectionWordPose(
  wordY: number,
  layout: ReturnType<typeof getMotionTestFinaleAudienceCarouselLayout>,
): {
  xPx: number;
  yPx: number;
  scale: number;
} {
  const edgeX = getCircleEdgeXPx(layout.circleRadius, layout.circleCenterY, wordY);
  const xPx = edgeX + layout.whiteGapPx;

  return {
    xPx,
    yPx: wordY,
    scale: 1,
  };
}

export type MotionTestFinaleAudienceCarouselWord = {
  word: string;
  index: number;
  xPx: number;
  yPx: number;
  scale: number;
  opacity: number;
};

export function getMotionTestFinaleAudienceCarouselWords(
  frame: number,
): MotionTestFinaleAudienceCarouselWord[] | null {
  if (!isMotionTestFinaleAudienceCarouselVisible(frame)) {
    return null;
  }

  const carouselFrame = frame - MOTION_TEST_FINALE_AUDIENCE_CAROUSEL_START_FRAME;
  const slot = getCarouselSlot(carouselFrame);
  const maxPanSlot = MOTION_TEST_FINALE_AUDIENCE_CAROUSEL_PAN_ITEM_COUNT - 1;
  const slotFloor = Math.floor(slot);
  const slotCeil = Math.ceil(slot);
  const indices = new Set<number>();
  const layout = getMotionTestFinaleAudienceCarouselLayout(frame);

  for (let index = slotFloor - 1; index <= slotCeil + 1; index++) {
    if (index >= 0 && index <= maxPanSlot) {
      indices.add(index);
    }
  }

  if (slot >= maxPanSlot) {
    indices.add(MOTION_TEST_FINALE_AUDIENCE_CAROUSEL_PEEK_INDEX);
  }

  return Array.from(indices).map((index) => {
    const relativeSlot = index - slot;
    const wordY = layout.alignY + relativeSlot * layout.lineStepPx;
    const pose = getWhiteSectionWordPose(wordY, layout);
    const scale = interpolate(Math.abs(relativeSlot), [0, 1.35], [1, 0.96], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const revealOpacity = getCarouselRevealOpacity(frame);

    return {
      word: MOTION_TEST_FINALE_AUDIENCE_CAROUSEL_ITEMS[index],
      index,
      ...pose,
      scale,
      opacity: getCarouselWordOpacity(relativeSlot) * revealOpacity,
    };
  });
}

/** Clip carousel to the white panel — never draw over the orange portal. */
export function getMotionTestFinaleAudienceCarouselClipPath(
  frame: number,
): string {
  const { circleRadius } = getMotionTestFinaleAudienceCarouselLayout(frame);

  return `polygon(${circleRadius}px 0, ${MOTION_TEST_WIDTH}px 0, ${MOTION_TEST_WIDTH}px ${MOTION_TEST_HEIGHT}px, ${circleRadius}px ${MOTION_TEST_HEIGHT}px)`;
}
