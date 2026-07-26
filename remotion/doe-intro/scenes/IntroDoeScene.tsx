import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

import { lora } from "@/remotion/fonts";

import { DOE_INTRO_TRANSITION_FRAMES } from "../constants";
import { useIntroSceneCrossfade } from "../intro-transitions";
import { IntroDesignersHeroShader } from "../shared/IntroDesignersHeroShader";

const HANDOFF_FRAMES = 22;
const INTRO_DOE_CREAM = "#f5e6d0";

export function IntroDoeScene() {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = DOE_INTRO_TRANSITION_FRAMES;
  const sceneOpacity = useIntroSceneCrossfade(HANDOFF_FRAMES);

  const shaderEnter = interpolate(frame, [0, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const shaderScale = interpolate(frame, [0, 32], [1.06, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const logoSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 200, stiffness: 78 },
  });
  const logoOpacity = interpolate(logoSpring, [0, 1], [0, 1], {
    easing: Easing.out(Easing.cubic),
  });
  const logoY = interpolate(logoSpring, [0, 1], [22, 0], {
    easing: Easing.out(Easing.cubic),
  });
  const logoScale = interpolate(logoSpring, [0, 1], [0.86, 1], {
    easing: Easing.out(Easing.cubic),
  });
  const logoBlur = interpolate(logoSpring, [0, 1], [10, 0], {
    easing: Easing.out(Easing.cubic),
  });

  const logoExit = interpolate(frame, [durationInFrames - t, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

  return (
    <AbsoluteFill className="motion4-scene motion4-scene--intro-shader" style={{ opacity: sceneOpacity }}>
      <div
        className="motion4-intro-shader-wrap"
        style={{
          opacity: shaderEnter,
          transform: `scale(${shaderScale})`,
        }}
      >
        <IntroDesignersHeroShader />
      </div>
      <div className="motion4-intro-doe">
        <div
          className={`motion4-intro-doe__logo ${lora.className}`}
          style={{
            transform: `translateY(${logoY - logoExit * 12}px) scale(${logoScale * (1 - logoExit * 0.04)})`,
            opacity: logoOpacity * (1 - logoExit),
            filter: logoBlur > 0.35 ? `blur(${logoBlur}px)` : undefined,
            fontWeight: 400,
            color: INTRO_DOE_CREAM,
          }}
        >
          Doe
        </div>
      </div>
    </AbsoluteFill>
  );
}
