import { BLOG_LANDING_HERO } from "@/lib/blog/blog-landing-hero-colors";

const { lineSoft, line, lineStrong, accentWarm, focal } = BLOG_LANDING_HERO;

/**
 * Hero graphic — precision instrument / calibration target.
 * A large circle with an inner ring, two axes running edge to edge,
 * evenly-spaced tick marks, and accent dots at 45° positions.
 * Reads as a scientific readout: precise, clinical, calm.
 *
 * ViewBox 400×520. Center at (200, 210). Outer r=155, inner r=77.
 */
export function BlogLandingHeroGraphic() {
  const cx = 200;
  const cy = 210;
  const ro = 155; // outer radius
  const ri = 77;  // inner radius

  // Axis endpoints — extend to outer circle perimeter
  const axH = { x1: cx - ro, y1: cy, x2: cx + ro, y2: cy };
  const axV = { x1: cx, y1: cy - ro, x2: cx, y2: cy + ro };

  // Tick marks on horizontal axis (every 38px from center, skip center)
  const hTicks = [-76, -38, 38, 76].map((dx) => ({
    x: cx + dx,
    len: Math.abs(dx) === 76 ? 10 : 14,
  }));

  // Tick marks on vertical axis
  const vTicks = [-76, -38, 38, 76].map((dy) => ({
    y: cy + dy,
    len: Math.abs(dy) === 76 ? 10 : 14,
  }));

  // Accent dots at 45° positions on the outer circle
  const r45 = ro * Math.SQRT1_2; // ro / √2 ≈ 110
  const accentDots = [
    { x: cx + r45, y: cy - r45, fill: accentWarm, r: 3 },   // NE
    { x: cx - r45, y: cy - r45, fill: lineSoft,   r: 2.5 }, // NW
    { x: cx + r45, y: cy + r45, fill: lineSoft,   r: 2.5 }, // SE
    { x: cx - r45, y: cy + r45, fill: line,       r: 2.5 }, // SW
  ];

  // Small ticks at the 4 cardinal points on the outer circle perimeter
  const cardinalTicks = [
    { x1: cx + ro - 1, y1: cy - 7, x2: cx + ro - 1, y2: cy + 7 }, // right
    { x1: cx - ro + 1, y1: cy - 7, x2: cx - ro + 1, y2: cy + 7 }, // left
    { x1: cx - 7, y1: cy - ro + 1, x2: cx + 7, y2: cy - ro + 1 }, // top
    { x1: cx - 7, y1: cy + ro - 1, x2: cx + 7, y2: cy + ro - 1 }, // bottom
  ];

  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 400 520"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      {/* Outer circle */}
      <circle cx={cx} cy={cy} r={ro} stroke={line} strokeWidth="0.9" />

      {/* Inner ring */}
      <circle cx={cx} cy={cy} r={ri} stroke={lineSoft} strokeWidth="0.65" />

      {/* Axes */}
      <line {...axH} stroke={lineSoft} strokeWidth="0.75" />
      <line {...axV} stroke={lineSoft} strokeWidth="0.75" />

      {/* Horizontal axis tick marks */}
      {hTicks.map(({ x, len }) => (
        <line
          key={`ht-${x}`}
          x1={x} y1={cy - len / 2}
          x2={x} y2={cy + len / 2}
          stroke={lineStrong} strokeWidth="0.8" strokeLinecap="round"
        />
      ))}

      {/* Vertical axis tick marks */}
      {vTicks.map(({ y, len }) => (
        <line
          key={`vt-${y}`}
          x1={cx - len / 2} y1={y}
          x2={cx + len / 2} y2={y}
          stroke={lineStrong} strokeWidth="0.8" strokeLinecap="round"
        />
      ))}

      {/* Cardinal perimeter ticks */}
      {cardinalTicks.map((t, i) => (
        <line key={`ct-${i}`} {...t} stroke={lineSoft} strokeWidth="0.65" strokeLinecap="round" />
      ))}

      {/* Accent dots at 45° positions */}
      {accentDots.map(({ x, y, fill, r }, i) => (
        <circle key={`ad-${i}`} cx={x} cy={y} r={r} fill={fill} />
      ))}

      {/* Center dot */}
      <circle cx={cx} cy={cy} r="3.5" fill={focal} />
      <circle cx={cx} cy={cy} r="8" stroke={lineStrong} strokeWidth="0.7" />
    </svg>
  );
}
