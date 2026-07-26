import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

import { inter, suisseIntl } from "@/remotion/fonts";

import { DOE_LAUNCH_GOLD_GRADIENT } from "../constants";

export function IntroWaveHero({
  headline,
  subhead,
  barCount = 36,
  delay = 6,
}: {
  headline: string;
  subhead?: string;
  barCount?: number;
  delay?: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: { damping: 200, stiffness: 92 } });
  const barsEnter = spring({ frame: frame - delay - 8, fps, config: { damping: 200, stiffness: 85 } });

  return (
    <div
      className="motion4-wave-hero"
      style={{
        opacity: enter,
        transform: `translateY(${(1 - enter) * 24}px) scale(${interpolate(enter, [0, 1], [0.98, 1])})`,
      }}
    >
      <h2
        className={`motion4-wave-hero__headline ${suisseIntl.className}`}
        style={{
          background: DOE_LAUNCH_GOLD_GRADIENT,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        {headline}
      </h2>
      {subhead ? (
        <p
          className={`motion4-wave-hero__subhead ${inter.className}`}
          style={{
            opacity: interpolate(enter, [0.4, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          {subhead}
        </p>
      ) : null}
      <div className="motion4-wave-hero__bars" aria-hidden style={{ opacity: barsEnter }}>
        {Array.from({ length: barCount }).map((_, index) => {
          const barDelay = index * 1.5;
          const barSpring = spring({
            frame: frame - delay - 10 - barDelay,
            fps,
            config: { damping: 200, stiffness: 130 },
          });
          const h =
            14 +
            Math.abs(Math.sin((frame + index * 4) / 5)) * 52 *
              interpolate(index, [0, barCount / 2, barCount - 1], [0.35, 1, 0.25], {
                extrapolateRight: "clamp",
              });
          const goldMix = interpolate(index, [0, barCount - 1], [0.25, 1]);

          return (
            <span
              key={index}
              className="motion4-wave-hero__bar"
              style={{
                height: h * barSpring,
                opacity: (0.35 + goldMix * 0.65) * barSpring,
                background: `linear-gradient(180deg, rgba(232,192,142,${0.5 + goldMix * 0.5}) 0%, rgba(212,165,116,${0.15 + goldMix * 0.35}) 100%)`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
