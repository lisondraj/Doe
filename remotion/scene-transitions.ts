import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

import { DOE_LAUNCH_TRANSITION_FRAMES } from "./constants";

/** Standard crossfade for overlapping scene content. */
export function useSceneCrossfade(transitionFrames = DOE_LAUNCH_TRANSITION_FRAMES) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, transitionFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const fadeOut = interpolate(
    frame,
    [durationInFrames - transitionFrames, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.in(Easing.cubic),
    },
  );

  return fadeIn * fadeOut;
}

/** Unified panel enter — slight lift + settle (used across brown scenes). */
export function useContentEnter(delay = 8) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200, stiffness: 92 },
  });

  return {
    y: interpolate(enter, [0, 1], [36, 0]),
    opacity: enter,
    scale: interpolate(enter, [0, 1], [0.985, 1]),
  };
}

/** Logo dissolves upward into the next scene on shared brown. */
export function useLogoHandoff(transitionFrames = DOE_LAUNCH_TRANSITION_FRAMES) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const exitStart = durationInFrames - transitionFrames;

  const exit = interpolate(frame, [exitStart, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  return {
    opacity: 1 - exit,
    scale: 1 + exit * 0.14,
    y: exit * -24,
  };
}

/** Section title exit — fades before scene handoff. */
export function useTitleExitLead(transitionFrames = DOE_LAUNCH_TRANSITION_FRAMES) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return interpolate(
    frame,
    [durationInFrames - transitionFrames - 6, durationInFrames - 4],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
}

/** Subtle lift on scene exit so panels feel like they hand off. */
export function useContentExit(transitionFrames = DOE_LAUNCH_TRANSITION_FRAMES) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const exitStart = durationInFrames - transitionFrames;

  const exit = interpolate(frame, [exitStart, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

  return {
    y: exit * -18,
    opacity: 1 - exit * 0.85,
    scale: 1 - exit * 0.02,
  };
}
