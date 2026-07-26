import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

import { suisseIntl } from "@/remotion/fonts";

import { DOE_LAUNCH_GOLD_GRADIENT } from "../constants";
import { DOE_KINETIC_SWIPE_EASE, DOE_PREMIUM_EASE } from "../intro-transitions";

const LINE_HEIGHT = 112;

function computeScrollProgress(
  frame: number,
  startFrame: number,
  lineCount: number,
  holdFrames: number,
  swipeFrames: number,
) {
  const elapsed = frame - startFrame;
  if (elapsed <= 0) return 0;

  const stepFrames = holdFrames + swipeFrames;
  const maxIndex = lineCount - 1;
  const segment = Math.min(maxIndex, Math.floor(elapsed / stepFrames));
  const segmentFrame = elapsed - segment * stepFrames;

  if (segment >= maxIndex) {
    return maxIndex;
  }

  if (segmentFrame <= holdFrames) {
    return segment;
  }

  const swipeT = (segmentFrame - holdFrames) / swipeFrames;
  const eased = DOE_KINETIC_SWIPE_EASE(Math.min(1, Math.max(0, swipeT)));
  return segment + eased;
}

export function getScrollLastLineStartFrame(
  lineCount: number,
  startFrame: number,
  holdFrames: number,
  swipeFrames: number,
) {
  return startFrame + Math.max(0, lineCount - 1) * (holdFrames + swipeFrames);
}

export function IntroKineticStack({
  lines,
  startFrame = 10,
  stepFrames = 26,
  holdFrames,
  swipeFrames,
  showCursor = true,
  size = "hero",
  align = "center",
  mode = "stack",
  zoomProgress = 0,
}: {
  lines: readonly string[];
  startFrame?: number;
  stepFrames?: number;
  /** Scroll mode — frames to hold each line before swiping up. */
  holdFrames?: number;
  /** Scroll mode — frames for the swipe-up transition. */
  swipeFrames?: number;
  showCursor?: boolean;
  size?: "hero" | "lg";
  align?: "center" | "left";
  /** stack = blur stack; scroll = active line pinned to vertical center, scrolls up */
  mode?: "stack" | "scroll";
  /** Scroll mode — 0→1 zoom on the last line before scene handoff. */
  zoomProgress?: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const resolvedHoldFrames = holdFrames ?? Math.round(stepFrames * 0.72);
  const resolvedSwipeFrames = swipeFrames ?? stepFrames - resolvedHoldFrames;

  const rawProgress =
    mode === "scroll"
      ? computeScrollProgress(frame, startFrame, lines.length, resolvedHoldFrames, resolvedSwipeFrames)
      : Math.max(0, (frame - startFrame) / stepFrames);
  const activeIndex = Math.min(lines.length - 1, Math.floor(rawProgress));
  const lineFraction = rawProgress - activeIndex;

  const enter = spring({
    frame: frame - 4,
    fps,
    config: { damping: 200, stiffness: 88 },
  });

  if (mode === "scroll") {
    const scrollOffset = -rawProgress * LINE_HEIGHT;
    const lastIndex = lines.length - 1;
    const zoomScale = 1 + zoomProgress * 2.1;
    const zoomBlur = zoomProgress * 4.5;

    return (
      <div
        className={`motion4-kinetic-viewport motion4-kinetic-viewport--scroll ${suisseIntl.className}`}
        style={{
          opacity: enter * (1 - zoomProgress * 0.72),
          transform: zoomProgress > 0 ? `scale(${zoomScale})` : undefined,
          filter: zoomBlur > 0.05 ? `blur(${zoomBlur}px)` : undefined,
        }}
      >
        <div
          className={`motion4-kinetic-track motion4-kinetic--${size === "hero" ? "hero" : "lg"}`}
          style={{
            transform: `translate(-50%, calc(-${LINE_HEIGHT / 2}px + ${scrollOffset}px))`,
          }}
        >
          {lines.map((line, index) => {
            const dist = rawProgress - index;
            const abs = Math.abs(dist);
            const blur = Math.min(16, abs * 8);
            let lineOpacity = interpolate(abs, [0, 0.55, 1.1, 2], [1, 0.48, 0.2, 0.06], {
              extrapolateRight: "clamp",
            });
            if (zoomProgress > 0 && index !== lastIndex) {
              lineOpacity *= interpolate(zoomProgress, [0, 0.55, 1], [1, 0.35, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: DOE_PREMIUM_EASE,
              });
            }
            let scale = interpolate(abs, [0, 1.5], [1, 0.92], { extrapolateRight: "clamp" });
            if (zoomProgress > 0 && index === lastIndex) {
              scale = 1 + zoomProgress * 0.08;
            }
            const isActive = abs < 0.45;

            return (
              <p
                key={line}
                className={`motion4-kinetic__line motion4-kinetic__line--slot${isActive ? " motion4-kinetic__line--active" : ""}`}
                style={{
                  height: LINE_HEIGHT,
                  opacity: lineOpacity,
                  filter: blur > 0.35 ? `blur(${blur}px)` : undefined,
                  transform: `scale(${scale})`,
                  ...(isActive
                    ? {
                        background: DOE_LAUNCH_GOLD_GRADIENT,
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                      }
                    : {}),
                }}
              >
                {line}
              </p>
            );
          })}
        </div>
      </div>
    );
  }

  const stackLift = interpolate(activeIndex, [0, lines.length - 1], [0, (lines.length - 1) * -6]);

  return (
    <div
      className={`motion4-kinetic ${size === "hero" ? "motion4-kinetic--hero" : "motion4-kinetic--lg"} motion4-kinetic--${align} ${suisseIntl.className}`}
      style={{
        opacity: enter,
        transform: `translateY(${(1 - enter) * 32 + stackLift}px)`,
      }}
    >
      {lines.map((line, index) => {
        const distance = activeIndex - index + lineFraction * 0.35;
        const abs = Math.abs(distance);
        const blur = Math.min(18, abs * 7);
        const lineOpacity = interpolate(abs, [0, 0.6, 1.2, 2.2], [1, 0.55, 0.22, 0.08], {
          extrapolateRight: "clamp",
        });
        const y = distance * -22;
        const scale = interpolate(abs, [0, 2], [1, 0.935], { extrapolateRight: "clamp" });
        const isActive = index === activeIndex;
        const cursorBlink = Math.floor(frame / 14) % 2 === 0;
        const lineEnter = spring({
          frame: frame - startFrame - index * 4,
          fps,
          config: { damping: 200, stiffness: 110 },
        });

        return (
          <p
            key={line}
            className={`motion4-kinetic__line${isActive ? " motion4-kinetic__line--active" : ""}`}
            style={{
              opacity: lineOpacity * lineEnter,
              filter: blur > 0.4 ? `blur(${blur}px)` : undefined,
              transform: `translateY(${y}px) scale(${scale})`,
              ...(isActive
                ? {
                    background: DOE_LAUNCH_GOLD_GRADIENT,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }
                : {}),
            }}
          >
            {line}
            {isActive && showCursor ? (
              <span
                className="motion4-kinetic__cursor"
                style={{ opacity: cursorBlink ? 1 : 0.2 }}
                aria-hidden
              />
            ) : null}
          </p>
        );
      })}
    </div>
  );
}
