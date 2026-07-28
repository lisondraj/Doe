import { BLOG_LANDING_HERO } from "@/lib/blog/blog-landing-hero-colors";

const { lineSoft, line, lineStrong, accentWarm } = BLOG_LANDING_HERO;

/** Stacked arc rings from blog article design 1 — large fill for contact card. */
export function AboutContactRingsGraphic({ className = "" }: { className?: string }) {
  const cx = 200;
  const cy = 400;
  const arcs = [
    { rx: 72, ry: 36, stroke: lineSoft, sw: "1.1" },
    { rx: 110, ry: 55, stroke: lineSoft, sw: "1.15" },
    { rx: 152, ry: 76, stroke: line, sw: "1.25" },
    { rx: 198, ry: 99, stroke: line, sw: "1.35" },
    { rx: 248, ry: 124, stroke: lineStrong, sw: "1.45" },
    { rx: 304, ry: 152, stroke: lineStrong, sw: "1.4" },
    { rx: 365, ry: 182, stroke: lineSoft, sw: "1.2" },
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
      <circle cx={cx} cy={cy - 36} r="3.2" fill={accentWarm} />
      <circle cx={cx - 152} cy={cy} r="2.4" fill={line} />
      <circle cx={cx + 152} cy={cy} r="2.4" fill={line} />
      <circle cx={cx - 248} cy={cy} r="2" fill={lineSoft} />
      <circle cx={cx + 248} cy={cy} r="2" fill={lineSoft} />
    </svg>
  );
}
