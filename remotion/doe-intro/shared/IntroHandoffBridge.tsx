import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

import {
  DOE_INTRO_SCENES,
  DOE_SARAH_HANDOFF_FRAMES,
  DOE_TYPEWRITER_DURATION_FRAMES,
} from "../constants";
import { DOE_SARAH_HANDOFF_EASE } from "../intro-transitions";

const HANDOFF_START =
  DOE_INTRO_SCENES.doeTypewriter.from + DOE_TYPEWRITER_DURATION_FRAMES - DOE_SARAH_HANDOFF_FRAMES;
const HANDOFF_END = HANDOFF_START + DOE_SARAH_HANDOFF_FRAMES;

const CX = 960;
const CY = 540;

/** Expanding gold rings — connection pulse between Doe and Sarah Westfield. */
export function IntroHandoffBridge() {
  const frame = useCurrentFrame();

  if (frame < HANDOFF_START || frame > HANDOFF_END) {
    return null;
  }

  const progress = interpolate(frame, [HANDOFF_START, HANDOFF_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: DOE_SARAH_HANDOFF_EASE,
  });

  const ringA = interpolate(progress, [0, 1], [36, 1020], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ringB = interpolate(progress, [0.06, 1], [18, 860], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ringC = interpolate(progress, [0.14, 1], [8, 680], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ringAOpacity = interpolate(progress, [0, 0.16, 0.46, 0.8, 1], [0, 0.58, 0.38, 0.12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ringBOpacity = interpolate(progress, [0.06, 0.24, 0.54, 0.88, 1], [0, 0.44, 0.28, 0.08, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ringCOpacity = interpolate(progress, [0.14, 0.32, 0.62, 0.92, 1], [0, 0.28, 0.18, 0.06, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const washRadius = interpolate(progress, [0, 0.55, 1], [60, 420, 720], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const washOpacity = interpolate(progress, [0, 0.22, 0.48, 0.78, 1], [0, 0.42, 0.32, 0.12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill className="motion4-handoff-pulse" aria-hidden>
      <svg viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="motion4-pulse-wash" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff4e4" stopOpacity="0.55" />
            <stop offset="38%" stopColor="#e8c08e" stopOpacity="0.22" />
            <stop offset="72%" stopColor="#d4a574" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#d4a574" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="motion4-pulse-ring" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff4e4" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#e8c08e" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#c99858" stopOpacity="0.35" />
          </linearGradient>
          <filter id="motion4-pulse-soft" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle
          cx={CX}
          cy={CY}
          r={washRadius}
          fill="url(#motion4-pulse-wash)"
          opacity={washOpacity}
        />
        <circle
          cx={CX}
          cy={CY}
          r={ringA}
          fill="none"
          stroke="url(#motion4-pulse-ring)"
          strokeWidth={2}
          opacity={ringAOpacity}
          filter="url(#motion4-pulse-soft)"
        />
        <circle
          cx={CX}
          cy={CY}
          r={ringB}
          fill="none"
          stroke="rgba(255, 236, 210, 0.42)"
          strokeWidth={1.35}
          opacity={ringBOpacity}
        />
        <circle
          cx={CX}
          cy={CY}
          r={ringC}
          fill="none"
          stroke="rgba(232, 192, 142, 0.28)"
          strokeWidth={0.95}
          opacity={ringCOpacity}
        />
      </svg>
    </AbsoluteFill>
  );
}
