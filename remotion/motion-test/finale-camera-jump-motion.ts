import { Easing, interpolate } from "remotion";

import {
  MOTION_TEST_FINALE_CAMERA_JUMP_END_FRAME,
  MOTION_TEST_FINALE_CAMERA_JUMP_FRAMES,
  MOTION_TEST_FINALE_CAMERA_JUMP_ORIGIN_X_RATIO,
  MOTION_TEST_FINALE_CAMERA_JUMP_ORIGIN_Y_RATIO,
  MOTION_TEST_FINALE_CAMERA_JUMP_SCALE,
  MOTION_TEST_FINALE_CAMERA_JUMP_START_FRAME,
  MOTION_TEST_FINALE_CORNER_LINE_EDGE_INSET_PX,
  MOTION_TEST_HEIGHT,
  MOTION_TEST_WIDTH,
} from "./constants";

const JUMP_EASE = Easing.in(Easing.cubic);

/** Right vertical is the last stroke to leave frame when punching into top-right. */
export function getMotionTestFinaleCameraJumpLinesClearScale(): number {
  return MOTION_TEST_WIDTH / MOTION_TEST_FINALE_CORNER_LINE_EDGE_INSET_PX + 0.35;
}

export function isMotionTestFinaleCameraJumpPhase(frame: number): boolean {
  return frame >= MOTION_TEST_FINALE_CAMERA_JUMP_START_FRAME;
}

export function getMotionTestFinaleCameraJumpMotion(frame: number): {
  active: boolean;
  scale: number;
  originXPx: number;
  originYPx: number;
  linesVisible: boolean;
} {
  const originXPx = MOTION_TEST_WIDTH * MOTION_TEST_FINALE_CAMERA_JUMP_ORIGIN_X_RATIO;
  const originYPx = MOTION_TEST_HEIGHT * MOTION_TEST_FINALE_CAMERA_JUMP_ORIGIN_Y_RATIO;
  const linesClearScale = getMotionTestFinaleCameraJumpLinesClearScale();

  if (frame < MOTION_TEST_FINALE_CAMERA_JUMP_START_FRAME) {
    return {
      active: false,
      scale: 1,
      originXPx,
      originYPx,
      linesVisible: true,
    };
  }

  const localFrame = frame - MOTION_TEST_FINALE_CAMERA_JUMP_START_FRAME;
  const jumpProgress = interpolate(
    localFrame,
    [0, MOTION_TEST_FINALE_CAMERA_JUMP_FRAMES],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: JUMP_EASE,
    },
  );
  const scale = interpolate(
    jumpProgress,
    [0, 1],
    [1, MOTION_TEST_FINALE_CAMERA_JUMP_SCALE],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return {
    active: true,
    scale,
    originXPx,
    originYPx,
    linesVisible: scale < linesClearScale * 0.985,
  };
}

export function shouldMotionTestFinaleForceGradientBackground(frame: number): boolean {
  return frame >= MOTION_TEST_FINALE_CAMERA_JUMP_START_FRAME;
}

export function isMotionTestFinaleCameraJumpSettled(frame: number): boolean {
  return frame >= MOTION_TEST_FINALE_CAMERA_JUMP_END_FRAME;
}

export function areMotionTestFinaleCornerLinesVisibleInCamera(frame: number): boolean {
  return getMotionTestFinaleCameraJumpMotion(frame).linesVisible;
}
