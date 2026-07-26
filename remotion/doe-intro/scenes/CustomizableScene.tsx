import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

import { Product2VoiceAgentEditor } from "@/components/product2/Product2VoiceAgentEditor";

import { useIntroSceneCrossfade, useIntroUiReveal } from "../intro-transitions";
import { IntroFocusRail } from "../shared/IntroFocusRail";
import { IntroUiHero } from "../shared/IntroUiHero";

const RAIL = ["Voice", "Routing", "Scheduling", "Handoffs", "Rules"] as const;

export function CustomizableScene() {
  const frame = useCurrentFrame();
  const sceneOpacity = useIntroSceneCrossfade();
  const reveal = useIntroUiReveal(4);
  const showUi = frame >= 4;
  const activeIndex = Math.min(RAIL.length - 1, Math.floor((frame - 10) / 22));

  return (
    <AbsoluteFill className="motion4-scene motion4-scene--editor-stage" style={{ opacity: sceneOpacity }}>
      <div className="motion4-editor-stage__rail">
        <IntroFocusRail items={RAIL} activeIndex={activeIndex} delay={4} startFrame={10} stepFrames={22} />
      </div>
      <div className="motion4-editor-stage__body">
        <IntroUiHero delay={6} heroScale={1} className="motion4-ui-hero--editor-fill" origin="top center">
          <div
            className="motion4-console-shell motion4-console-shell--fill motion4-ui-reveal"
            style={{
              opacity: reveal.opacity,
              transform: `translateY(${reveal.y + interpolate(frame, [0, 32], [24, 0], { extrapolateRight: "clamp" })}px) scale(${interpolate(reveal.opacity, [0, 1], [0.96, 1])})`,
            }}
          >
            {showUi ? <Product2VoiceAgentEditor /> : null}
          </div>
        </IntroUiHero>
      </div>
    </AbsoluteFill>
  );
}
