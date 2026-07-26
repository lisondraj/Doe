import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

import { DOE_INTRO_TRANSITION_FRAMES } from "./constants";

const T = DOE_INTRO_TRANSITION_FRAMES;
export const DOE_PREMIUM_EASE = Easing.bezier(0.42, 0, 0.16, 1);
export const DOE_KINETIC_SWIPE_EASE = Easing.bezier(0.48, 0.03, 0.14, 1);

/** Pulse handoff — smooth acceleration through the crossfade window. */
export const DOE_SARAH_HANDOFF_EASE = Easing.bezier(0.44, 0.05, 0.18, 1);

const ENTER_SPRING = { damping: 200, stiffness: 86 };
const SNAP_SPRING = { damping: 200, stiffness: 118 };

export type IntroDoeSarahHandoffMotion = {
  progress: number;
  opacity: number;
  active: boolean;
};

/**
 * Connection-pulse handoff — opacity crossfade synced to the ring wave.
 * Fixed layout: no blur, masks, drift, or scale.
 */
export function useIntroDoeSarahHandoff(role: "exit" | "enter", handoffFrames = 36): IntroDoeSarahHandoffMotion {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  if (role === "exit") {
    const start = durationInFrames - handoffFrames;
    const progress = interpolate(frame, [start, durationInFrames], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: DOE_SARAH_HANDOFF_EASE,
    });

    const opacity = interpolate(progress, [0, 0.3, 0.5, 0.72, 1], [1, 1, 0.62, 0.12, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    return { progress, opacity, active: frame >= start };
  }

  const progress = interpolate(frame, [0, handoffFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: DOE_SARAH_HANDOFF_EASE,
  });

  const opacity = interpolate(progress, [0, 0.34, 0.56, 0.78, 1], [0, 0, 0.55, 0.94, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return { progress, opacity, active: frame <= handoffFrames };
}

function handoffMotionStyle(handoff: IntroDoeSarahHandoffMotion) {
  if (!handoff.active) {
    return undefined;
  }

  return { opacity: handoff.opacity };
}

export { handoffMotionStyle };

/** Overlapping scene crossfade — cubic ease for smoother handoffs. */
export function useIntroSceneCrossfade(transitionFrames = T) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, transitionFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: DOE_PREMIUM_EASE,
  });

  const fadeOut = interpolate(frame, [durationInFrames - transitionFrames, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  return fadeIn * fadeOut;
}

/** UI panel lift + settle (doehealth band pattern). */
export function useIntroPanelEnter(delay = 6) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: frame - delay,
    fps,
    config: ENTER_SPRING,
  });

  return {
    y: interpolate(enter, [0, 1], [28, 0], { easing: Easing.out(Easing.cubic) }),
    opacity: enter,
    scale: interpolate(enter, [0, 1], [0.97, 1]),
  };
}

export function useIntroPanelExit(transitionFrames = T) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const exitStart = durationInFrames - transitionFrames;

  const exit = interpolate(frame, [exitStart, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

  return {
    y: exit * -16,
    opacity: 1 - exit * 0.9,
    scale: 1 - exit * 0.022,
  };
}

/** Gold title below UI — fades before scene ends. */
export function useIntroTitleExitLead(transitionFrames = T) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return interpolate(
    frame,
    [durationInFrames - transitionFrames - 8, durationInFrames - 6],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
}

/** Horizontal wipe accent at scene peak. */
export function useIntroUiReveal(delay = 10) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const reveal = spring({ frame: frame - delay, fps, config: { damping: 200, stiffness: 72 } });

  return {
    clip: interpolate(reveal, [0, 1], [100, 0], { easing: Easing.out(Easing.cubic) }),
    opacity: reveal,
    y: interpolate(reveal, [0, 1], [16, 0]),
  };
}

/** Scene exit — slight blur lift like launch-video depth handoff. */
export function useIntroSceneBlurExit(transitionFrames = T) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const exitStart = durationInFrames - transitionFrames;

  const exit = interpolate(frame, [exitStart, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

  return {
    blur: exit * 10,
    scale: 1 + exit * 0.03,
    opacity: 1 - exit * 0.3,
  };
}

/** Smooth stepped index for rails / kinetic focus (0 → n-1). */
export function useIntroSteppedFocus(lineCount: number, startFrame: number, stepFrames: number) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const raw = Math.max(0, (frame - startFrame) / stepFrames);
  const target = Math.min(lineCount - 1, Math.floor(raw));
  const settle = spring({
    frame: frame - startFrame - target * stepFrames,
    fps,
    config: SNAP_SPRING,
  });

  return {
    index: target,
    progress: raw,
    settle,
    fraction: raw - target,
  };
}
