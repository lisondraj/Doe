"use client";

import { Audio, interpolate, staticFile, useCurrentFrame } from "remotion";

import {
  DOE_INTRO_BG_MUSIC_GAIN,
  DOE_INTRO_BG_MUSIC_SRC,
  DOE_INTRO_DURATION_FRAMES,
  DOE_INTRO_MUSIC_DUCK_FADE_FRAMES,
  DOE_INTRO_MUSIC_DUCK_FROM,
  DOE_INTRO_MUSIC_DUCK_LEVEL,
  DOE_INTRO_MUSIC_RESTORE_FROM,
} from "../constants";

/** Background bed — ducks before incoming call SFX, restores after outro Doe clip. */
export function IntroBackgroundMusic() {
  const frame = useCurrentFrame();
  const duckEnd = DOE_INTRO_MUSIC_DUCK_FROM + DOE_INTRO_MUSIC_DUCK_FADE_FRAMES;
  const restoreEnd = DOE_INTRO_MUSIC_RESTORE_FROM + DOE_INTRO_MUSIC_DUCK_FADE_FRAMES;

  const volume = interpolate(
    frame,
    [DOE_INTRO_MUSIC_DUCK_FROM, duckEnd, DOE_INTRO_MUSIC_RESTORE_FROM, restoreEnd],
    [1, DOE_INTRO_MUSIC_DUCK_LEVEL, DOE_INTRO_MUSIC_DUCK_LEVEL, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <Audio
      src={staticFile(DOE_INTRO_BG_MUSIC_SRC)}
      trimAfter={DOE_INTRO_DURATION_FRAMES}
      volume={volume * DOE_INTRO_BG_MUSIC_GAIN}
    />
  );
}
