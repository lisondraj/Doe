import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

import {
  DOE_LAUNCH_BROWN_BG,
  DOE_LAUNCH_CREAM_BG,
  DOE_LAUNCH_SCENES,
  DOE_LAUNCH_TRANSITION_FRAMES,
} from "../constants";

/** Persistent backdrop — brown holds through product scenes, dissolves to cream outro. */
export function CompositionBackdrop() {
  const frame = useCurrentFrame();
  const outroStart = DOE_LAUNCH_SCENES.outro.from;
  const t = DOE_LAUNCH_TRANSITION_FRAMES;

  const creamMix = interpolate(frame, [outroStart - t, outroStart + t], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <>
      <AbsoluteFill style={{ background: DOE_LAUNCH_BROWN_BG, opacity: 1 - creamMix }} />
      <AbsoluteFill style={{ background: DOE_LAUNCH_CREAM_BG, opacity: creamMix }} />
    </>
  );
}

/** Gold-cream flash at the final brown → cream handoff. */
export function TransitionFlash() {
  const frame = useCurrentFrame();
  const at = DOE_LAUNCH_SCENES.outro.from;

  const flash = interpolate(frame, [at - 8, at - 2, at + 10], [0, 0.28, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (flash <= 0) return null;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, rgba(250, 240, 216, 0.95) 0%, rgba(212, 165, 116, 0.35) 100%)",
        opacity: flash,
        pointerEvents: "none",
        zIndex: 20,
      }}
    />
  );
}
