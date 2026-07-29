"use client";

import { Audio, interpolate, staticFile, useCurrentFrame } from "remotion";

import {
  MOTION_TEST_BG_MUSIC_END_FRAMES,
  MOTION_TEST_BG_MUSIC_FADE_OUT_FRAMES,
  MOTION_TEST_BG_MUSIC_GAIN,
  MOTION_TEST_BG_MUSIC_SRC,
  MOTION_TEST_BG_MUSIC_START_FRAMES,
  MOTION_TEST_DURATION_FRAMES,
} from "./constants";

export function MotionTestBackgroundMusic() {
  const frame = useCurrentFrame();
  const fadeStart = MOTION_TEST_DURATION_FRAMES - MOTION_TEST_BG_MUSIC_FADE_OUT_FRAMES;

  const volume = interpolate(
    frame,
    [fadeStart, MOTION_TEST_DURATION_FRAMES],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <Audio
      src={staticFile(MOTION_TEST_BG_MUSIC_SRC)}
      trimBefore={MOTION_TEST_BG_MUSIC_START_FRAMES}
      trimAfter={MOTION_TEST_BG_MUSIC_END_FRAMES}
      volume={volume * MOTION_TEST_BG_MUSIC_GAIN}
      pauseWhenBuffering
      acceptableTimeShiftInSeconds={0.25}
    />
  );
}
