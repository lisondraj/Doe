import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

import { suisseIntl } from "@/remotion/fonts";

export function IntroFocusRail({
  items,
  activeIndex,
  delay = 8,
  stepFrames = 24,
  startFrame = 10,
}: {
  items: readonly string[];
  activeIndex: number;
  delay?: number;
  stepFrames?: number;
  startFrame?: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: { damping: 200, stiffness: 96 } });

  const raw = Math.max(0, (frame - startFrame) / stepFrames);
  const underlineIndex = Math.min(items.length - 1, raw);

  return (
    <nav
      className={`motion4-focus-rail ${suisseIntl.className}`}
      aria-label="Capabilities"
      style={{
        opacity: enter,
        transform: `translateY(${(1 - enter) * 14}px)`,
      }}
    >
      {items.map((item, index) => {
        const dist = Math.abs(index - activeIndex);
        const opacity = interpolate(dist, [0, 1, 2, 3], [1, 0.52, 0.26, 0.12], {
          extrapolateRight: "clamp",
        });
        const scale = interpolate(dist, [0, 2], [1, 0.9], { extrapolateRight: "clamp" });
        const y = interpolate(dist, [0, 1], [0, 2], { extrapolateRight: "clamp" });
        const isActive = index === activeIndex;
        const itemEnter = spring({
          frame: frame - delay - index * 3,
          fps,
          config: { damping: 200, stiffness: 120 },
        });
        const underlineMix = 1 - Math.min(1, Math.abs(underlineIndex - index));

        return (
          <span
            key={item}
            className={`motion4-focus-rail__item${isActive ? " motion4-focus-rail__item--active" : ""}`}
            style={{
              opacity: opacity * enter * itemEnter,
              transform: `translateY(${y}px) scale(${scale})`,
            }}
          >
            {item}
            <span
              className="motion4-focus-rail__underline"
              style={{
                opacity: underlineMix * (isActive ? 1 : 0.35),
                transform: `scaleX(${0.4 + underlineMix * 0.6})`,
              }}
              aria-hidden
            />
          </span>
        );
      })}
    </nav>
  );
}
