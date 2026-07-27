"use client";

import { AbsoluteFill, Sequence } from "remotion";

import { dmSans, inter, lora, suisseIntl } from "@/remotion/fonts";

import {
  DOE_INTRO_DURATION_FRAMES,
  DOE_INTRO_FPS,
  DOE_INTRO_SCENES,
  DOE_LAUNCH_HEIGHT,
  DOE_LAUNCH_WIDTH,
  f,
} from "./constants";
import { IntroBackdrop } from "./shared/IntroBackdrop";
import { IntroBackgroundMusic } from "./shared/IntroBackgroundMusic";
import { IntroHandoffBridge } from "./shared/IntroHandoffBridge";
import { IntroOutroBridge } from "./shared/IntroOutroBridge";
import { DoeTypewriterScene } from "./scenes/DoeTypewriterScene";
import { MoreThanVoiceScene } from "./scenes/MoreThanVoiceScene";
import { OpeningScene } from "./scenes/OpeningScene";
import { OutroDoeShaderScene } from "./scenes/OutroDoeShaderScene";

export {
  DOE_INTRO_DURATION_FRAMES,
  DOE_INTRO_FPS,
  DOE_LAUNCH_HEIGHT as DOE_INTRO_HEIGHT,
  DOE_LAUNCH_WIDTH as DOE_INTRO_WIDTH,
};

/** Doe intro — opening, logo, Sarah call, shader outro. */
export function DoeIntroComposition({ embedPreview = false }: { embedPreview?: boolean } = {}) {
  const s = DOE_INTRO_SCENES;

  return (
    <AbsoluteFill
      className={`motion4-remotion-root product-brown-mock ${suisseIntl.className} ${inter.className} ${lora.className} ${dmSans.className}`}
    >
      <IntroBackgroundMusic />

      <IntroBackdrop />
      <IntroHandoffBridge />
      <IntroOutroBridge />

      <Sequence from={s.opening.from} durationInFrames={s.opening.duration} premountFor={f(16)}>
        <OpeningScene />
      </Sequence>
      <Sequence from={s.doeTypewriter.from} durationInFrames={s.doeTypewriter.duration} premountFor={f(28)}>
        <DoeTypewriterScene />
      </Sequence>
      <Sequence from={s.moreThanVoice.from} durationInFrames={s.moreThanVoice.duration} premountFor={f(12)}>
        <MoreThanVoiceScene />
      </Sequence>
      <Sequence from={s.outroShader.from} durationInFrames={s.outroShader.duration} premountFor={f(120)}>
        <OutroDoeShaderScene embedPreview={embedPreview} />
      </Sequence>
    </AbsoluteFill>
  );
}
