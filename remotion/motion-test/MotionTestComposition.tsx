"use client";

import { AbsoluteFill, Sequence } from "remotion";

import { sfPro, lora } from "@/remotion/fonts";

import {
  MOTION_TEST_DURATION_FRAMES,
  MOTION_TEST_FPS,
  MOTION_TEST_HEIGHT,
  MOTION_TEST_TITLE_FONT_SIZE,
  MOTION_TEST_TITLE_FRAMES,
  MOTION_TEST_WIDTH,
} from "./constants";
import { MotionTestBackgroundMusic } from "./MotionTestBackgroundMusic";
import { TitleFrameScene } from "./scenes/TitleFrameScene";

export {
  MOTION_TEST_DURATION_FRAMES,
  MOTION_TEST_FPS,
  MOTION_TEST_HEIGHT,
  MOTION_TEST_WIDTH,
};

/** Motion test — title card hold, then room for more beats. */
export function MotionTestComposition() {
  return (
    <AbsoluteFill
      className={`motion-test-remotion-root ${sfPro.className} ${lora.className}`}
      style={
        {
          "--motion-test-title-font-size": `${MOTION_TEST_TITLE_FONT_SIZE}px`,
        } as React.CSSProperties
      }
    >
      <MotionTestBackgroundMusic />
      <Sequence from={0} durationInFrames={MOTION_TEST_TITLE_FRAMES}>
        <TitleFrameScene />
      </Sequence>
    </AbsoluteFill>
  );
}
