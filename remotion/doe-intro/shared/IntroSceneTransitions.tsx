import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

import { DOE_INTRO_TRANSITION_FRAMES } from "../constants";

const BOUNDARIES = [] as const;

/** Subtle gold sweep + lift at each scene boundary. */
export function IntroSceneTransitions() {
  const frame = useCurrentFrame();
  const t = DOE_INTRO_TRANSITION_FRAMES;

  let sweep = 0;
  let blur = 0;
  for (const at of BOUNDARIES) {
    sweep = Math.max(
      sweep,
      interpolate(frame, [at - t, at - 4, at + 8], [0, 0.22, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
    );
    blur = Math.max(
      blur,
      interpolate(frame, [at - t, at, at + 6], [0, 8, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
    );
  }

  if (sweep <= 0.002 && blur <= 0.1) return null;

  return (
    <>
      <AbsoluteFill
        style={{
          backdropFilter: blur > 0 ? `blur(${blur}px)` : undefined,
          WebkitBackdropFilter: blur > 0 ? `blur(${blur}px)` : undefined,
          zIndex: 18,
          pointerEvents: "none",
        }}
      />
      <AbsoluteFill
        style={{
          background: "linear-gradient(105deg, transparent 40%, rgba(212,165,116,0.22) 50%, transparent 60%)",
          opacity: sweep,
          zIndex: 20,
          pointerEvents: "none",
        }}
      />
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse 80% 40% at 50% 100%, rgba(232,192,142,0.12), transparent 70%)",
          opacity: sweep * 1.4,
          zIndex: 19,
          pointerEvents: "none",
        }}
      />
    </>
  );
}
