import type { CSSProperties } from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const MOTION3_RING_CIRCUMFERENCE = 263.89;

const SNAP = { damping: 200, stiffness: 130 };
const POP = { damping: 14, stiffness: 120 };

type SpringConfig = { damping: number; stiffness: number; mass?: number };

function staggerSpring(
  frame: number,
  fps: number,
  index: number,
  base: number,
  step = 4,
  config: SpringConfig = SNAP,
) {
  return spring({ frame: frame - base - index * step, fps, config });
}

/** Day summary card — greeting, bars, ring, tiles, split. */
export function useSummaryUiMotion(frameOffset = 10): CSSProperties {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame - frameOffset;

  const greet1 = staggerSpring(t, fps, 0, 8);
  const greet2 = staggerSpring(t, fps, 0, 14);
  const label = staggerSpring(t, fps, 0, 20);
  const total = spring({ frame: t - 24, fps, config: POP });

  const ringPct = interpolate(t, [38, 64], [0, 83], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ringEnter = staggerSpring(t, fps, 0, 36, 0);
  const split = staggerSpring(t, fps, 0, 70, 0, { damping: 200, stiffness: 90 });

  const styles: Record<string, string | number> = {
    "--m3-greet-1-y": `${interpolate(greet1, [0, 1], [20, 0])}px`,
    "--m3-greet-1-o": greet1,
    "--m3-greet-2-y": `${interpolate(greet2, [0, 1], [24, 0])}px`,
    "--m3-greet-2-o": greet2,
    "--m3-label-o": label,
    "--m3-total-scale": interpolate(total, [0, 1], [0.7, 1]),
    "--m3-total-o": total,
    "--m3-ring-offset": MOTION3_RING_CIRCUMFERENCE * (1 - ringPct / 100),
    "--m3-ring-scale": interpolate(ringEnter, [0, 1], [0.86, 1]),
    "--m3-ring-o": ringEnter,
    "--m3-split-scale-x": split,
    "--m3-split-o": split,
  };

  for (let i = 0; i < 12; i++) {
    const bar = staggerSpring(t, fps, i, 28, 2, { damping: 200, stiffness: 150 });
    styles[`--m3-bar-${i}`] = Math.max(0.06, bar);
  }

  for (let i = 0; i < 3; i++) {
    const tile = staggerSpring(t, fps, i, 50, 5, { damping: 200, stiffness: 110 });
    styles[`--m3-tile-${i}-y`] = `${interpolate(tile, [0, 1], [22, 0])}px`;
    styles[`--m3-tile-${i}-o`] = tile;
  }

  return styles as CSSProperties;
}

/** Live call thread — staggered turns + tag emphasis. */
export function useCallUiMotion(frameOffset = 10, turnCount = 6): CSSProperties {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame - frameOffset;
  const pulse = interpolate((frame % 30), [0, 15, 30], [1, 1.06, 1]);

  const styles: Record<string, string | number> = {
    "--m3-tag-glow": pulse,
  };

  for (let i = 0; i < turnCount; i++) {
    const turnDelay = 10 + i * 16;
    const turn = staggerSpring(t, fps, 0, turnDelay, 0, { damping: 200, stiffness: 100 });
    styles[`--m3-turn-${i}-x`] = `${interpolate(turn, [0, 1], [-40, 0])}px`;
    styles[`--m3-turn-${i}-o`] = turn;

    const tagReveal = staggerSpring(t, fps, 0, turnDelay + 6, 0, { damping: 200, stiffness: 130 });
    styles[`--m3-tag-${i}-o`] = tagReveal;
  }

  return styles as CSSProperties;
}

/** Stack reveal — each turn fades in; earlier turns stay visible with a smooth upward scroll. */
export type CallInterludeSpec = {
  beforeTurn: number;
  frames: number;
};

export type CallInterludeWindow = CallInterludeSpec & {
  start: number;
  end: number;
};

export type CallTurnRevealTiming = {
  turnStarts: number[];
  interludes: CallInterludeWindow[];
};

export function buildCallTurnRevealTiming(
  turnCount: number,
  start: number,
  step: number,
  replyHoldExtra: number,
  interludes: readonly CallInterludeSpec[] = [],
  turnHoldAfter: readonly { turnIndex: number; frames: number }[] = [],
  turnReplyHolds: readonly { turnIndex: number; frames: number }[] = [],
): CallTurnRevealTiming {
  const turnStarts: number[] = [];
  let cursor = start;
  for (let i = 0; i < turnCount; i++) {
    turnStarts[i] = cursor;
    if (i < turnCount - 1) {
      cursor += step;
      if (i % 2 === 1) {
        cursor += turnReplyHolds.find((hold) => hold.turnIndex === i)?.frames ?? replyHoldExtra;
      }
      const extraHold = turnHoldAfter.find((hold) => hold.turnIndex === i)?.frames ?? 0;
      cursor += extraHold;
    }
  }

  const sorted = [...interludes].sort((a, b) => a.beforeTurn - b.beforeTurn);
  const windows: CallInterludeWindow[] = [];

  for (const spec of sorted) {
    if (spec.beforeTurn < 0 || spec.beforeTurn >= turnCount || spec.frames <= 0) {
      continue;
    }

    for (let i = spec.beforeTurn; i < turnCount; i++) {
      turnStarts[i]! += spec.frames;
    }

    const end = turnStarts[spec.beforeTurn]!;
    windows.push({
      beforeTurn: spec.beforeTurn,
      frames: spec.frames,
      start: end - spec.frames,
      end,
    });
  }

  return { turnStarts, interludes: windows };
}

export function findCallInterludeWindow(
  timing: CallTurnRevealTiming,
  beforeTurn: number,
): CallInterludeWindow | null {
  return timing.interludes.find((interlude) => interlude.beforeTurn === beforeTurn) ?? null;
}

export function useCallTurnRevealMotion(
  frameOffset = 8,
  turnCount = 6,
  step = 15,
  fade = 8,
  start = 6,
  replyHoldExtra = 0,
  interludes: readonly CallInterludeSpec[] = [],
  turnHoldAfter: readonly { turnIndex: number; frames: number }[] = [],
  turnReplyHolds: readonly { turnIndex: number; frames: number }[] = [],
): CSSProperties {
  const frame = useCurrentFrame();
  const t = frame - frameOffset;
  const enterEase = Easing.out(Easing.cubic);

  const { turnStarts, interludes: interludeWindows } = buildCallTurnRevealTiming(
    turnCount,
    start,
    step,
    replyHoldExtra,
    interludes,
    turnHoldAfter,
    turnReplyHolds,
  );

  const styles: Record<string, string | number> = {};

  for (let i = 0; i < turnCount; i++) {
    const turnStart = turnStarts[i]!;
    const fadeInEnd = turnStart + fade;

    let opacity = 0;
    if (t >= fadeInEnd) {
      opacity = 1;
    } else if (t >= turnStart) {
      opacity = interpolate(t, [turnStart, fadeInEnd], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: enterEase,
      });
    }

    const isReply = i % 2 === 1;
    const enterFrom = isReply ? 26 : 18;
    const enterY =
      t >= turnStart
        ? interpolate(t, [turnStart, fadeInEnd], [enterFrom, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: enterEase,
          })
        : enterFrom;

    styles[`--m3-turn-${i}-o`] = opacity;
    styles[`--m3-turn-${i}-y`] = `${enterY}px`;
    styles[`--m3-tag-${i}-o`] = opacity;
  }

  let stackLift = 0;
  for (let i = 1; i < turnCount; i++) {
    const turnStart = turnStarts[i]!;
    const fadeInEnd = turnStart + fade;
    /*
     * Composition-px lifts matched to pinned remotion convo type/stage (172px):
     * keep the active reply + speaker name vertically centered in the viewport.
     */
    const lift = i % 2 === 1 ? 64 : 54;

    if (t >= fadeInEnd) {
      stackLift -= lift;
    } else if (t >= turnStart) {
      const progress = interpolate(t, [turnStart, fadeInEnd], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: enterEase,
      });
      stackLift -= lift * progress;
    }
  }

  styles["--m3-convo-y"] = `${stackLift}px`;
  styles["--m3-convo-top-fade"] =
    stackLift >= 0
      ? "0"
      : `${interpolate(stackLift, [-6, 0], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}`;

  const interludeOpacityKeys: Record<number, string> = {
    2: "--m4-confirm-interlude-o",
    4: "--m4-chart-interlude-o",
  };

  let interludeBlur = 0;
  styles["--m4-confirm-interlude-o"] = 0;
  styles["--m4-chart-interlude-o"] = 0;
  styles["--m4-interlude-blur"] = 0;

  for (const interlude of interludeWindows) {
    const interludeIn = interpolate(t, [interlude.start, interlude.start + 10], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: enterEase,
    });
    const interludeOut = interpolate(t, [interlude.end - 8, interlude.end], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: enterEase,
    });
    const interludeActive = t >= interlude.start && t < interlude.end;
    const opacityKey = interludeOpacityKeys[interlude.beforeTurn];
    if (opacityKey && interludeActive) {
      styles[opacityKey] = Math.min(interludeIn, interludeOut);
      interludeBlur = 6;
    }
  }

  styles["--m4-interlude-blur"] = interludeBlur;

  return styles as CSSProperties;
}

/** Agents orbit — pop agents + center stat. */
export function useAgentsUiMotion(frameOffset = 10): CSSProperties {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame - frameOffset;

  const center = spring({ frame: t - 8, fps, config: POP });
  const styles: Record<string, string | number> = {
    "--m3-orbit-center-s": interpolate(center, [0, 1], [0.6, 1]),
    "--m3-orbit-center-o": center,
  };

  for (let i = 0; i < 7; i++) {
    const agent = staggerSpring(t, fps, i, 16, 3, POP);
    styles[`--m3-orbit-${i}-s`] = interpolate(agent, [0, 1], [0.55, 1]);
    styles[`--m3-orbit-${i}-o`] = agent;
  }

  return styles as CSSProperties;
}

/** Outro — stagger logo, headline lines, url. */
export function useOutroUiMotion(): CSSProperties {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logo = spring({ frame, fps, config: { damping: 14, stiffness: 80 } });
  const line1 = staggerSpring(frame, fps, 0, 10, 0, SNAP);
  const line2 = staggerSpring(frame, fps, 0, 18, 0, SNAP);
  const url = staggerSpring(frame, fps, 0, 28, 0, SNAP);

  return {
    "--m3-outro-logo-s": interpolate(logo, [0, 1], [0.78, 1]),
    "--m3-outro-logo-o": logo,
    "--m3-outro-line-1-y": `${interpolate(line1, [0, 1], [110, 0])}%`,
    "--m3-outro-line-1-o": line1,
    "--m3-outro-line-2-y": `${interpolate(line2, [0, 1], [120, 0])}%`,
    "--m3-outro-line-2-o": line2,
    "--m3-outro-url-y": `${interpolate(url, [0, 1], [16, 0])}px`,
    "--m3-outro-url-o": url,
  } as CSSProperties;
}

/** Logo scene — subtle hold breathe. */
export function useLogoUiMotion(): CSSProperties {
  const frame = useCurrentFrame();
  const breathe = interpolate(Math.sin(frame / 18), [-1, 1], [0.998, 1.012]);

  return {
    "--m3-logo-breathe": breathe,
  } as CSSProperties;
}
