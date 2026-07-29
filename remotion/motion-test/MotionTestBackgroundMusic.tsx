"use client";

import { Audio, staticFile } from "remotion";

import {
  MOTION_TEST_BG_MUSIC_END_FRAMES,
  MOTION_TEST_BG_MUSIC_GAIN,
  MOTION_TEST_BG_MUSIC_SRC,
  MOTION_TEST_BG_MUSIC_START_FRAMES,
} from "./constants";

export function MotionTestBackgroundMusic() {
  return (
    <Audio
      src={staticFile(MOTION_TEST_BG_MUSIC_SRC)}
      trimBefore={MOTION_TEST_BG_MUSIC_START_FRAMES}
      trimAfter={MOTION_TEST_BG_MUSIC_END_FRAMES}
      volume={MOTION_TEST_BG_MUSIC_GAIN}
      pauseWhenBuffering
      acceptableTimeShiftInSeconds={0.25}
    />
  );
}
