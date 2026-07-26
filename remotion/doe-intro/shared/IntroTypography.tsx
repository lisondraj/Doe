import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

import { inter, suisseIntl } from "@/remotion/fonts";

import { DOE_LAUNCH_GOLD_GRADIENT } from "../constants";

const goldStyle: CSSProperties = {
  background: DOE_LAUNCH_GOLD_GRADIENT,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

export function IntroEyebrow({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: { damping: 200, stiffness: 120 } });

  return (
    <p
      className={`motion4-eyebrow ${suisseIntl.className}${className ? ` ${className}` : ""}`}
      style={{
        opacity: enter,
        transform: `translateY(${(1 - enter) * 12}px)`,
      }}
    >
      {children}
    </p>
  );
}

export function IntroGoldHeadline({
  lines,
  delay = 8,
  size = "lg",
}: {
  lines: readonly string[];
  delay?: number;
  size?: "xl" | "lg" | "md";
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <h2 className={`motion4-headline motion4-headline--${size} ${suisseIntl.className}`} style={goldStyle}>
      {lines.map((line, index) => {
        const enter = spring({
          frame: frame - delay - index * 5,
          fps,
          config: { damping: 200, stiffness: 110 },
        });
        const y = interpolate(enter, [0, 1], [105, 0]);

        return (
          <span
            key={line}
            style={{
              display: "block",
              opacity: enter,
              transform: `translateY(${y}%)`,
            }}
          >
            {line}
          </span>
        );
      })}
    </h2>
  );
}

export function IntroBody({
  children,
  delay = 14,
  muted = false,
}: {
  children: ReactNode;
  delay?: number;
  muted?: boolean;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: { damping: 200, stiffness: 100 } });

  return (
    <p
      className={`motion4-body ${inter.className}${muted ? " motion4-body--muted" : ""}`}
      style={{
        opacity: enter,
        transform: `translateY(${(1 - enter) * 18}px)`,
      }}
    >
      {children}
    </p>
  );
}

export function IntroChip({
  label,
  index,
  baseDelay = 20,
}: {
  label: string;
  index: number;
  baseDelay?: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({
    frame: frame - baseDelay - index * 3,
    fps,
    config: { damping: 200, stiffness: 130 },
  });

  return (
    <span
      className={`motion4-chip ${suisseIntl.className}`}
      style={{
        opacity: enter,
        transform: `translateY(${(1 - enter) * 16}px) scale(${interpolate(enter, [0, 1], [0.92, 1])})`,
      }}
    >
      {label}
    </span>
  );
}

export function IntroSceneShell({
  children,
  opacity,
}: {
  children: ReactNode;
  opacity: number;
}) {
  return (
    <AbsoluteFill className="motion4-scene" style={{ opacity }}>
      {children}
    </AbsoluteFill>
  );
}
