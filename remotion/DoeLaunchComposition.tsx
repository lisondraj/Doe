import { AbsoluteFill, Sequence } from "remotion";

import {
  DOE_LAUNCH_DURATION_FRAMES,
  DOE_LAUNCH_FPS,
  DOE_LAUNCH_HEIGHT,
  DOE_LAUNCH_SCENES,
  DOE_LAUNCH_WIDTH,
} from "./constants";
import { AgentsScene } from "./scenes/AgentsScene";
import { CallScene } from "./scenes/CallScene";
import { CompositionBackdrop, TransitionFlash } from "./scenes/CompositionBackdrop";
import { LogoScene } from "./scenes/LogoScene";
import { OutroScene } from "./scenes/OutroScene";
import { SummaryScene } from "./scenes/SummaryScene";

export {
  DOE_LAUNCH_DURATION_FRAMES,
  DOE_LAUNCH_FPS,
  DOE_LAUNCH_HEIGHT,
  DOE_LAUNCH_WIDTH,
};

/** 20s Doe launch — Remotion composition using real /doehealth + /product2 components. */
export function DoeLaunchComposition() {
  const { logo, summary, call, agents, outro } = DOE_LAUNCH_SCENES;

  return (
    <AbsoluteFill className="motion3-remotion-root product-brown-mock">
      <CompositionBackdrop />
      <TransitionFlash />

      <Sequence from={logo.from} durationInFrames={logo.duration} premountFor={30}>
        <LogoScene />
      </Sequence>
      <Sequence from={summary.from} durationInFrames={summary.duration} premountFor={30}>
        <SummaryScene />
      </Sequence>
      <Sequence from={call.from} durationInFrames={call.duration} premountFor={30}>
        <CallScene />
      </Sequence>
      <Sequence from={agents.from} durationInFrames={agents.duration} premountFor={30}>
        <AgentsScene />
      </Sequence>
      <Sequence from={outro.from} durationInFrames={outro.duration} premountFor={24}>
        <OutroScene />
      </Sequence>
    </AbsoluteFill>
  );
}
