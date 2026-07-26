import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

import { suisseIntl } from "@/lib/home/fonts";

import { DOE_LAUNCH_GOLD_GRADIENT } from "../constants";
import { useTitleExitLead } from "../scene-transitions";

export function SectionTitle({ lines, delay = 18 }: { lines: readonly [string, string]; delay?: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exitLead = useTitleExitLead();

  const reveal = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200, stiffness: 120 },
  });

  const line1Y = interpolate(reveal, [0, 1], [110, 0]);
  const line2Y = interpolate(reveal, [0, 1], [130, 0]);
  const opacity = interpolate(reveal, [0, 1], [0, 1]) * exitLead;

  return (
    <h2
      className={`motion3-section-title ${suisseIntl.className}`}
      style={{
        opacity,
        background: DOE_LAUNCH_GOLD_GRADIENT,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
      }}
    >
      <span style={{ display: "block", transform: `translateY(${line1Y}%)` }}>{lines[0]}</span>
      <span style={{ display: "block", transform: `translateY(${line2Y}%)` }}>{lines[1]}</span>
    </h2>
  );
}
