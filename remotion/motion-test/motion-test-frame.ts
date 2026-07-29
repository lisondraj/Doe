import { useCurrentFrame } from "remotion";

import { MOTION_TEST_DESIGN_FPS, MOTION_TEST_FPS } from "./constants";

export const MOTION_TEST_FRAME_SCALE = MOTION_TEST_FPS / MOTION_TEST_DESIGN_FPS;

/** Map Remotion output frames (60fps) to 30fps-authored motion timeline. */
export function getMotionTestDesignFrame(outputFrame: number): number {
  return outputFrame / MOTION_TEST_FRAME_SCALE;
}

export function motionTestOutputFrames(designFrames: number): number {
  return Math.round(designFrames * MOTION_TEST_FRAME_SCALE);
}

/** Use instead of useCurrentFrame() in motion-test scenes. */
export function useMotionTestFrame(): number {
  return getMotionTestDesignFrame(useCurrentFrame());
}
