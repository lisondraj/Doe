import { AbsoluteFill, Audio, Easing, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

import { lora } from "@/remotion/fonts";

import {
  DOE_INTRO_FPS,
  DOE_LAUNCH_BROWN_BG,
  DOE_OUTRO_DOE_AUDIO_SRC,
  DOE_OUTRO_DOE_HOLD_FRAMES,
  DOE_OUTRO_DOE_LOGO_APPEAR_FRAME,
  DOE_OUTRO_DOE_VOLUME,
  DOE_OUTRO_SHADER_HANDOFF_FRAMES,
} from "../constants";
import { DOE_PREMIUM_EASE } from "../intro-transitions";
import { IntroDesignersHeroShader } from "../shared/IntroDesignersHeroShader";

/** Dusk shader palette — sand + horizon cream (matches IntroDesignersHeroShader). */
const OUTRO_DOE_CREAM = "#f5e6d0";

const URL_SWITCH_FRAME = DOE_OUTRO_SHADER_HANDOFF_FRAMES + DOE_OUTRO_DOE_HOLD_FRAMES;

/** Final outro — shader, Doe hold, then doehealth.care. */
export function OutroDoeShaderScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const showUrl = frame >= URL_SWITCH_FRAME;

  const fieldEnter = interpolate(frame, [0, Math.round(DOE_OUTRO_SHADER_HANDOFF_FRAMES * 0.45)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: DOE_PREMIUM_EASE,
  });

  const shaderEnter = interpolate(
    frame,
    [Math.round(DOE_OUTRO_SHADER_HANDOFF_FRAMES * 0.18), DOE_OUTRO_SHADER_HANDOFF_FRAMES + 6],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    },
  );

  const shaderScale = interpolate(frame, [0, DOE_OUTRO_SHADER_HANDOFF_FRAMES + 10], [1.08, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const logoSpring = spring({
    frame: frame - Math.round(DOE_OUTRO_SHADER_HANDOFF_FRAMES * 0.52),
    fps,
    config: { damping: 200, stiffness: 68 },
  });

  const logoEnter = interpolate(logoSpring, [0, 1], [0, 1], {
    easing: Easing.out(Easing.cubic),
  });

  const logoY = interpolate(logoSpring, [0, 1], [28, 0], {
    easing: Easing.out(Easing.cubic),
  });

  const logoBlur = interpolate(logoSpring, [0, 1], [10, 0], {
    easing: Easing.out(Easing.cubic),
  });

  const doeOpacity = showUrl ? 0 : logoEnter * shaderEnter;
  const urlOpacity = showUrl ? 1 : 0;

  return (
    <AbsoluteFill
      className="motion4-scene motion4-scene--intro-shader motion4-scene--outro-shader"
      style={{ opacity: fieldEnter }}
    >
      <AbsoluteFill
        style={{
          background: DOE_LAUNCH_BROWN_BG,
          opacity: showUrl ? 1 : 0,
        }}
        aria-hidden={!showUrl}
      />
      <div
        className="motion4-intro-shader-wrap"
        style={{
          opacity: showUrl ? 0 : shaderEnter,
          transform: `scale(${shaderScale})`,
        }}
      >
        <IntroDesignersHeroShader />
      </div>
      <div className="motion4-intro-doe motion4-outro-doe">
        <div className="motion4-outro-doe__stack">
          <div
            className={`motion4-outro-doe__logo ${lora.className}`}
            style={{
              transform: `translateY(${logoY}px)`,
              opacity: doeOpacity,
              filter: logoBlur > 0.35 ? `blur(${logoBlur}px)` : undefined,
              color: OUTRO_DOE_CREAM,
            }}
            aria-hidden={showUrl}
          >
            Doe
          </div>
          <div
            className={`motion4-outro-doe__url ${lora.className}`}
            style={{
              opacity: urlOpacity,
              color: OUTRO_DOE_CREAM,
            }}
            aria-hidden={!showUrl}
          >
            doehealth.care
          </div>
        </div>
      </div>
      <Sequence from={DOE_OUTRO_DOE_LOGO_APPEAR_FRAME} premountFor={DOE_INTRO_FPS}>
        <Audio src={staticFile(DOE_OUTRO_DOE_AUDIO_SRC)} volume={DOE_OUTRO_DOE_VOLUME} />
      </Sequence>
    </AbsoluteFill>
  );
}
