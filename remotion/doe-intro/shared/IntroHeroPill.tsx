import type { ReactNode } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

import { dmSans } from "@/remotion/fonts";

export function IntroHeroPill({
  children,
  delay = 8,
  glow = false,
}: {
  children: ReactNode;
  delay?: number;
  glow?: boolean;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: { damping: 200, stiffness: 88 } });
  const float = interpolate(Math.sin(frame / 22), [-1, 1], [-4, 4]);

  return (
    <div
      className={`motion4-hero-pill-wrap${glow ? " motion4-hero-pill-wrap--glow" : ""}`}
      style={{
        opacity: enter,
        transform: `translateY(${(1 - enter) * 48 + float}px) scale(${interpolate(enter, [0, 1], [0.94, 1])})`,
      }}
    >
      <div className={`motion4-hero-pill ${dmSans.className}`}>{children}</div>
    </div>
  );
}
