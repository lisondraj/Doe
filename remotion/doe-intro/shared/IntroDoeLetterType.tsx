import { Easing, interpolate, useCurrentFrame } from "remotion";

import { lora } from "@/remotion/fonts";

import { DOE_LOGO_HOLD_FRAMES, DOE_TYPE_REVEAL_FRAMES, f } from "../constants";
import { DOE_PREMIUM_EASE } from "../intro-transitions";
import { buildHorizontalSlitMask } from "./intro-slit-mask";

export const DOE_TYPE_REVEAL_START = 0;
export const DOE_TYPE_REVEAL_END = DOE_TYPE_REVEAL_FRAMES;
/** Unblur + lift lead the slit reveal. */
const DOE_TYPE_MOTION_START = 0;
const DOE_TYPE_MOTION_END = DOE_TYPE_REVEAL_END - f(8);

/** Continuous push-in — same rate as the original 1s hold zoom (1 → 1.06). */
const DOE_TYPE_ZOOM_MAX_DELTA = 0.06;
const DOE_TYPE_ZOOM_RATE = DOE_TYPE_ZOOM_MAX_DELTA / DOE_LOGO_HOLD_FRAMES;

const REVEAL_EASE = Easing.bezier(0.4, 0, 0.12, 1);
const MOTION_EASE = Easing.bezier(0.34, 0.04, 0.2, 1);

/** Solid gold — no transparent stop that reads as shadow on brown. */
const DOE_LOGO_GOLD_GRADIENT = "linear-gradient(180deg, #e8c08e 0%, #d4a574 52%, #c99858 100%)";

export function IntroDoeLetterType() {
  const frame = useCurrentFrame();

  const reveal = interpolate(frame, [DOE_TYPE_REVEAL_START, DOE_TYPE_REVEAL_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: REVEAL_EASE,
  });

  const motion = interpolate(frame, [DOE_TYPE_MOTION_START, DOE_TYPE_MOTION_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: MOTION_EASE,
  });

  const revealMask = buildHorizontalSlitMask(reveal);

  const revealBlur = interpolate(motion, [0, 0.38, 0.72, 1], [8, 2, 0.35, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: MOTION_EASE,
  });

  const revealY = interpolate(motion, [0, 1], [18, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: REVEAL_EASE,
  });

  const revealOpacity = interpolate(motion, [0, 0.3, 1], [0.88, 0.96, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: DOE_PREMIUM_EASE,
  });

  const holdZoom = 1 + frame * DOE_TYPE_ZOOM_RATE;

  const maskStyle = revealMask
    ? {
        WebkitMaskImage: revealMask,
        maskImage: revealMask,
        WebkitMaskSize: "100% 100%",
        maskSize: "100% 100%",
        WebkitMaskRepeat: "no-repeat" as const,
        maskRepeat: "no-repeat" as const,
      }
    : {};

  return (
    <div
      className="motion4-doe-type"
      style={{
        transform: `translateY(${revealY}px) scale(${holdZoom})`,
      }}
      aria-label="Doe"
    >
      <span
        className={`motion4-doe-type__word ${lora.className}`}
        style={{
          ...maskStyle,
          opacity: revealOpacity,
          filter: revealBlur > 0.05 ? `blur(${revealBlur}px)` : undefined,
          background: DOE_LOGO_GOLD_GRADIENT,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        Doe
      </span>
    </div>
  );
}
