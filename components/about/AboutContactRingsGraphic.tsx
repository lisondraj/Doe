import { BLOG_LANDING_HERO } from "@/lib/blog/blog-landing-hero-colors";

const { lineSoft, line, lineStrong, accentWarm } = BLOG_LANDING_HERO;

/** Stacked arc rings from blog article design 1 — scaled for contact card footer band. */
export function AboutContactRingsGraphic({ className = "" }: { className?: string }) {
  const cx = 200;
  const cy = 400;
  const arcs = [
    { rx: 38, ry: 19, stroke: lineSoft, sw: "0.65" },
    { rx: 58, ry: 29, stroke: lineSoft, sw: "0.7" },
    { rx: 80, ry: 40, stroke: line, sw: "0.75" },
    { rx: 104, ry: 52, stroke: line, sw: "0.8" },
    { rx: 130, ry: 64, stroke: lineStrong, sw: "0.85" },
    { rx: 158, ry: 78, stroke: lineStrong, sw: "0.82" },
  ] as const;

  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden
      className={`h-full w-full ${className}`.trim()}
    >
      {arcs.map((arc, index) => (
        <ellipse
          key={index}
          cx={cx}
          cy={cy}
          rx={arc.rx}
          ry={arc.ry}
          stroke={arc.stroke}
          strokeWidth={arc.sw}
        />
      ))}
      <circle cx={cx} cy={cy - 19} r="2" fill={accentWarm} />
      <circle cx={cx - 80} cy={cy} r="1.6" fill={line} />
      <circle cx={cx + 80} cy={cy} r="1.6" fill={line} />
    </svg>
  );
}
