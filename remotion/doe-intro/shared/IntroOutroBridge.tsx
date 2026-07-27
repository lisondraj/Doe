import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

import {
  DOE_OUTRO_SHADER_HANDOFF_FRAMES,
  DOE_TYPEWRITER_DURATION_FRAMES,
  DOE_SARAH_HANDOFF_FRAMES,
  DOE_SARAH_MORE_THAN_VOICE_FRAMES,
} from "../constants";
import { DOE_PREMIUM_EASE } from "../intro-transitions";

const OUTRO_START =
  164 +
  DOE_TYPEWRITER_DURATION_FRAMES -
  DOE_SARAH_HANDOFF_FRAMES +
  DOE_SARAH_MORE_THAN_VOICE_FRAMES -
  DOE_OUTRO_SHADER_HANDOFF_FRAMES;
const OUTRO_END = OUTRO_START + DOE_OUTRO_SHADER_HANDOFF_FRAMES;

/** Warm dusk wash — bridges Sarah call into shader outro. */
export function IntroOutroBridge() {
  const frame = useCurrentFrame();

  if (frame < OUTRO_START || frame > OUTRO_END + 8) {
    return null;
  }

  const progress = interpolate(frame, [OUTRO_START, OUTRO_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: DOE_PREMIUM_EASE,
  });

  const bloom = interpolate(progress, [0, 0.18, 0.45, 1], [0, 0.85, 1, 0.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const vignette = interpolate(progress, [0, 0.4, 0.7, 1], [0, 0.65, 0.85, 0.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      className="motion4-outro-bridge"
      style={{
        opacity: bloom,
        boxShadow: `inset 0 0 ${Math.round(100 + vignette * 120)}px rgba(26, 18, 8, ${vignette * 0.55})`,
      }}
      aria-hidden
    />
  );
}
