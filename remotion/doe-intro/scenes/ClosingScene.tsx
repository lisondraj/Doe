import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

import { inter, lora, suisseIntl } from "@/remotion/fonts";

import { DOE_LAUNCH_GOLD_GRADIENT } from "../constants";
import { useIntroSceneCrossfade } from "../intro-transitions";
import { IntroWaveLines } from "../shared/IntroWaveLines";

export function ClosingScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sceneOpacity = useIntroSceneCrossfade();
  const logo = spring({ frame: frame - 6, fps, config: { damping: 14, stiffness: 78 } });
  const tagline = spring({ frame: frame - 24, fps, config: { damping: 200, stiffness: 96 } });
  const url = spring({ frame: frame - 38, fps, config: { damping: 200, stiffness: 100 } });

  return (
    <AbsoluteFill className="motion4-scene motion4-scene--closing" style={{ opacity: sceneOpacity }}>
      <IntroWaveLines opacity={0.4} />
      <div className="motion4-closing-stack">
        <div
          className={`motion4-closing__logo ${lora.className}`}
          style={{
            transform: `scale(${interpolate(logo, [0, 1], [0.8, 1])})`,
            opacity: logo,
            fontWeight: 400,
            background: DOE_LAUNCH_GOLD_GRADIENT,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Doe
        </div>
        <p
          className={`motion4-closing__tagline ${suisseIntl.className}`}
          style={{
            opacity: tagline,
            transform: `translateY(${(1 - tagline) * 16}px)`,
            background: DOE_LAUNCH_GOLD_GRADIENT,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Built by doctors. For doctors.
        </p>
        <p
          className={`motion4-closing__url ${inter.className}`}
          style={{
            opacity: url,
            transform: `translateY(${(1 - url) * 10}px)`,
          }}
        >
          doehealth.care
        </p>
      </div>
    </AbsoluteFill>
  );
}
