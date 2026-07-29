import {
  MOTION_TEST_FINALE_GRADIENT_RESOLVE_START_FRAME,
  MOTION_TEST_FINALE_RESOLVE_LINE1_WORDS,
  MOTION_TEST_FINALE_RESOLVE_LINE2_WORDS,
  MOTION_TEST_FINALE_RESOLVE_SEGMENT_FRAMES,
  MOTION_TEST_FINALE_RESOLVE_TOTAL_STEPS,
} from "./constants";

export function getMotionTestFinaleResolveSegmentState(frame: number): {
  line1WordCount: number;
  line2WordCount: number;
} {
  const resolveFrame = Math.max(0, frame - MOTION_TEST_FINALE_GRADIENT_RESOLVE_START_FRAME);
  const stepIndex = Math.min(
    Math.floor(resolveFrame / MOTION_TEST_FINALE_RESOLVE_SEGMENT_FRAMES),
    MOTION_TEST_FINALE_RESOLVE_TOTAL_STEPS - 1,
  );
  const line1WordCount = Math.min(
    stepIndex + 1,
    MOTION_TEST_FINALE_RESOLVE_LINE1_WORDS.length,
  );
  const line2Step = stepIndex - MOTION_TEST_FINALE_RESOLVE_LINE1_WORDS.length;
  const line2WordCount =
    line2Step < 0
      ? 0
      : Math.min(line2Step + 1, MOTION_TEST_FINALE_RESOLVE_LINE2_WORDS.length);

  return {
    line1WordCount,
    line2WordCount,
  };
}
