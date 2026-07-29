import {
  MOTION_TEST_FINALE_INTELLIGENCE_FLIPPED_STACK_MOTION_FRAMES,
  MOTION_TEST_FINALE_INTELLIGENCE_FLIPPED_START_FRAME,
  MOTION_TEST_FINALE_INTELLIGENCE_STACK_DRIFT_AMOUNT,
  MOTION_TEST_FINALE_INTELLIGENCE_STACK_FRAMES,
  MOTION_TEST_FINALE_INTELLIGENCE_STACK_MIN_OPACITY,
  MOTION_TEST_FINALE_INTELLIGENCE_STACK_OPACITY_FALLOFF,
  MOTION_TEST_FINALE_INTELLIGENCE_STACK_PAN_UP_PX,
  MOTION_TEST_FINALE_INTELLIGENCE_STACK_START_FRAME,
  MOTION_TEST_HEIGHT,
} from "./constants";

/** Echo copies drift away from center — up above, down below — moderated dispersal. */
export function getMotionTestFinaleIntelligenceStackEchoDrift(
  frame: number,
  lineStep: number,
  offset: number,
): number {
  if (offset === 0) {
    return 0;
  }

  const stackFrame = frame - MOTION_TEST_FINALE_INTELLIGENCE_STACK_START_FRAME;

  if (stackFrame <= 0) {
    return 0;
  }

  const progress = Math.min(stackFrame / MOTION_TEST_FINALE_INTELLIGENCE_STACK_FRAMES, 1);
  const drift =
    progress *
    lineStep *
    (Math.abs(offset) + 0.25) *
    MOTION_TEST_FINALE_INTELLIGENCE_STACK_DRIFT_AMOUNT;

  return offset > 0 ? drift : -drift;
}

/** Slow upward pan for the whole stack column. */
export function getMotionTestFinaleIntelligenceStackPanY(frame: number): number {
  const stackFrame = frame - MOTION_TEST_FINALE_INTELLIGENCE_STACK_START_FRAME;

  if (stackFrame <= 0) {
    return 0;
  }

  const progress = Math.min(stackFrame / MOTION_TEST_FINALE_INTELLIGENCE_STACK_FRAMES, 1);

  return -progress * MOTION_TEST_FINALE_INTELLIGENCE_STACK_PAN_UP_PX;
}

/** Enough copies to span full frame height above and below the anchor word. */
export function getMotionTestFinaleIntelligenceStackLayerOffsets(
  lineStep: number,
  scale: number,
): number[] {
  const scaledStep = Math.max(lineStep * scale, 1);
  const count = Math.ceil(MOTION_TEST_HEIGHT / scaledStep) + 2;
  const offsets: number[] = [];

  for (let offset = -count; offset <= count; offset++) {
    offsets.push(offset);
  }

  return offsets;
}

/** Echo offsets only — center word stays fixed in normal flow. */
export function getMotionTestFinaleIntelligenceStackEchoOffsets(
  lineStep: number,
  scale: number,
): number[] {
  return getMotionTestFinaleIntelligenceStackLayerOffsets(lineStep, scale).filter(
    (offset) => offset !== 0,
  );
}

export function getMotionTestFinaleIntelligenceStackLayerOpacity(offset: number): number {
  if (offset === 0) {
    return 1;
  }

  const distance = Math.abs(offset);

  return Math.max(
    MOTION_TEST_FINALE_INTELLIGENCE_STACK_MIN_OPACITY,
    1 - distance * MOTION_TEST_FINALE_INTELLIGENCE_STACK_OPACITY_FALLOFF,
  );
}

function getMotionTestFinaleStackSegmentDrift(
  frame: number,
  lineStep: number,
  offset: number,
  startFrame: number,
  durationFrames: number,
): number {
  if (offset === 0) {
    return 0;
  }

  const segmentFrame = frame - startFrame;

  if (segmentFrame <= 0) {
    return 0;
  }

  const progress = Math.min(segmentFrame / durationFrames, 1);
  const drift =
    progress *
    lineStep *
    (Math.abs(offset) + 0.25) *
    MOTION_TEST_FINALE_INTELLIGENCE_STACK_DRIFT_AMOUNT;

  return offset > 0 ? drift : -drift;
}

function getMotionTestFinaleStackSegmentPanY(
  frame: number,
  startFrame: number,
  durationFrames: number,
): number {
  const segmentFrame = frame - startFrame;

  if (segmentFrame <= 0) {
    return 0;
  }

  const progress = Math.min(segmentFrame / durationFrames, 1);

  return -progress * MOTION_TEST_FINALE_INTELLIGENCE_STACK_PAN_UP_PX;
}

/** “intelligence for” hold — same stack motion, centered, before circle zoom. */
export function getMotionTestFinaleIntelligenceFlippedStackEchoDrift(
  frame: number,
  lineStep: number,
  offset: number,
): number {
  return getMotionTestFinaleStackSegmentDrift(
    frame,
    lineStep,
    offset,
    MOTION_TEST_FINALE_INTELLIGENCE_FLIPPED_START_FRAME,
    MOTION_TEST_FINALE_INTELLIGENCE_FLIPPED_STACK_MOTION_FRAMES,
  );
}

export function getMotionTestFinaleIntelligenceFlippedStackPanY(frame: number): number {
  return getMotionTestFinaleStackSegmentPanY(
    frame,
    MOTION_TEST_FINALE_INTELLIGENCE_FLIPPED_START_FRAME,
    MOTION_TEST_FINALE_INTELLIGENCE_FLIPPED_STACK_MOTION_FRAMES,
  );
}
