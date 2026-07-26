import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

import { DoeHealthActiveAgentsCard } from "@/components/doehealth/DoeHealthActiveAgentsCard";

import { useAgentsUiMotion } from "../../motion-ui";
import { Motion3UiDrive } from "../../ui/Motion3UiDrive";
import { useIntroSceneCrossfade } from "../intro-transitions";
import { IntroKineticStack } from "../shared/IntroKineticStack";
import { IntroUiHero } from "../shared/IntroUiHero";

export function FutureScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sceneOpacity = useIntroSceneCrossfade();
  const uiMotion = useAgentsUiMotion(6);
  const showUi = frame >= 18;
  const uiBlur = interpolate(frame, [18, 34], [10, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const orb = spring({ frame: frame - 6, fps, config: { damping: 200, stiffness: 68 } });
  const orbSpin = frame / 32;

  return (
    <AbsoluteFill className="motion4-scene motion4-scene--hero motion4-scene--future-stack" style={{ opacity: sceneOpacity }}>
      {showUi ? (
        <div
          className="motion4-future-bg-ui"
          style={{
            opacity: orb * 0.28,
            filter: `blur(${uiBlur}px)`,
            transform: `scale(${interpolate(orb, [0, 1], [1.04, 1])})`,
          }}
        >
          <IntroUiHero delay={10} heroScale={0.72} className="motion4-ui-hero--orbit" origin="center center">
            <Motion3UiDrive variant="agents" style={uiMotion}>
              <DoeHealthActiveAgentsCard />
            </Motion3UiDrive>
          </IntroUiHero>
        </div>
      ) : null}

      <div
        className="motion4-future-orb motion4-future-orb--ambient"
        style={{
          opacity: orb * 0.42,
          transform: `scale(${interpolate(orb, [0, 1], [0.85, 1.05])}) rotate(${orbSpin}deg)`,
        }}
        aria-hidden
      >
        <div className="motion4-future-orb__core" />
        <div className="motion4-future-orb__ring motion4-future-orb__ring--1" />
      </div>

      <IntroKineticStack
        lines={["Listens in context.", "Reasons while it speaks.", "Learns every call."]}
        startFrame={8}
        stepFrames={24}
      />
    </AbsoluteFill>
  );
}
