import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

import { suisseIntl } from "@/remotion/fonts";

import { useIntroTitleExitLead } from "../intro-transitions";

/** Gold display line below UI mock — matches doehealth band + motion3 section titles. */
export function IntroTitleBelow({
  lines,
  delay = 18,
  size = "lg",
  align = "center",
}: {
  lines: readonly [string, string] | readonly [string];
  delay?: number;
  size?: "xl" | "lg" | "md";
  align?: "center" | "left";
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exitLead = useIntroTitleExitLead();

  const reveal = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200, stiffness: 118 },
  });

  const opacity = interpolate(reveal, [0, 1], [0, 1]) * exitLead;

  return (
    <h2
      className={`motion4-title-below doehealth-hero-headline motion4-title-below--${size} motion4-title-below--${align} ${suisseIntl.className}`}
      style={{ opacity }}
    >
      {lines.map((line, index) => {
        const lineReveal = spring({
          frame: frame - delay - index * 4,
          fps,
          config: { damping: 200, stiffness: 110 },
        });
        const y = interpolate(lineReveal, [0, 1], [108, 0]);

        return (
          <span
            key={line}
            className="doephone-hero-headline-line motion4-title-below__line"
            style={{ transform: `translateY(${y}%)` }}
          >
            {line}
          </span>
        );
      })}
    </h2>
  );
}
