import { BLOG_LANDING_HERO } from "@/lib/blog/blog-landing-hero-colors";
import { JOIN_FORM_BEIGE } from "@/lib/join/join-form-beige";

type LinePalette = {
  lineSoft: string;
  line: string;
  lineStrong: string;
  accent: string;
  accentWarm: string;
  /** Gradient or solid stroke for focal accent lines (center mark, warm overlay). */
  accentStroke?: string;
};

const DOE_LINE_ACCENT_GRADIENT_ID = "doe-line-accent";

function DoeLineAccentGradientDef() {
  return (
    <defs>
      <linearGradient id={DOE_LINE_ACCENT_GRADIENT_ID} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#C47A5A" />
        <stop offset="48%" stopColor="#D2774C" />
        <stop offset="100%" stopColor="#D49D4F" />
      </linearGradient>
    </defs>
  );
}

const BEIGE_PALETTE: LinePalette = {
  lineSoft: BLOG_LANDING_HERO.lineSoft,
  line: BLOG_LANDING_HERO.line,
  lineStrong: BLOG_LANDING_HERO.lineStrong,
  accent: BLOG_LANDING_HERO.accent,
  accentWarm: BLOG_LANDING_HERO.accentWarm,
};

const BRAND_ACCENT_BEIGE_PALETTE: LinePalette = {
  ...BEIGE_PALETTE,
  accent: "#D2774C",
  accentWarm: "#D49D4F",
  accentStroke: `url(#${DOE_LINE_ACCENT_GRADIENT_ID})`,
};

const ORANGE_PALETTE: LinePalette = {
  lineSoft: "rgba(255, 255, 255, 0.34)",
  line: "rgba(255, 255, 255, 0.52)",
  lineStrong: "rgba(255, 255, 255, 0.68)",
  accent: "rgba(255, 255, 255, 0.84)",
  accentWarm: "rgba(255, 255, 255, 0.44)",
};

const SVG_CLASS = "absolute inset-0 h-full w-full";

/** Horizontal wave lines — compact, centered. */
function WaveLinesGraphic({ palette, showAccentGradient }: { palette: LinePalette; showAccentGradient?: boolean }) {
  const { lineSoft, line, lineStrong, accentWarm, accentStroke } = palette;
  const waves = [
    { y: 118, amp: 10, cycles: 1.5, phase: 1 as const, col: lineSoft, sw: 0.55, op: 0.55 },
    { y: 148, amp: 16, cycles: 1, phase: -1 as const, col: line, sw: 0.68, op: 0.72 },
    { y: 178, amp: 12, cycles: 1.5, phase: 1 as const, col: lineStrong, sw: 0.75, op: 0.8 },
    { y: 208, amp: 20, cycles: 1, phase: -1 as const, col: lineStrong, sw: 0.8, op: 0.85 },
    { y: 238, amp: 14, cycles: 1.5, phase: 1 as const, col: line, sw: 0.7, op: 0.72 },
    { y: 268, amp: 8, cycles: 2, phase: -1 as const, col: lineSoft, sw: 0.58, op: 0.58 },
    { y: 208, amp: 20, cycles: 1, phase: -1 as const, col: accentWarm, sw: 0.32, op: 0.16 },
  ];

  function path(y: number, amp: number, cycles: number, phase: 1 | -1) {
    const hw = 400 / (cycles * 2);
    let d = `M 0 ${y}`;
    for (let i = 0; i < cycles * 2; i++) {
      const x0 = i * hw;
      const x1 = (i + 1) * hw;
      const dir = i % 2 === 0 ? phase : -phase;
      const cpY = y + dir * amp;
      d += ` C ${(x0 + hw * 0.36).toFixed(1)} ${cpY} ${(x1 - hw * 0.36).toFixed(1)} ${cpY} ${x1} ${y}`;
    }
    return d;
  }

  return (
    <svg viewBox="0 0 400 400" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden className={SVG_CLASS}>
      {showAccentGradient ? <DoeLineAccentGradientDef /> : null}
      {waves.map((w, i) => {
        const isAccent = w.col === accentWarm;
        return (
          <path
            key={i}
            d={path(w.y, w.amp, w.cycles, w.phase)}
            stroke={isAccent && accentStroke ? accentStroke : w.col}
            strokeWidth={w.sw}
            opacity={isAccent && accentStroke ? 0.72 : w.op}
            strokeLinecap="round"
            fill="none"
          />
        );
      })}
    </svg>
  );
}

/** Diagonal parallel lines — bottom-left to top-right. */
function DiagonalLinesGraphic({ palette, showAccentGradient }: { palette: LinePalette; showAccentGradient?: boolean }) {
  const { lineSoft, line, lineStrong, accentWarm, accentStroke } = palette;
  const rise = 72;
  const rows = [
    { leftY: 318, leftX: 0, rightX: 400, col: lineSoft, sw: 0.55, op: 0.52 },
    { leftY: 296, leftX: 0, rightX: 400, col: lineSoft, sw: 0.6, op: 0.6 },
    { leftY: 274, leftX: 16, rightX: 400, col: line, sw: 0.7, op: 0.72 },
    { leftY: 252, leftX: 0, rightX: 384, col: line, sw: 0.75, op: 0.76 },
    { leftY: 230, leftX: 0, rightX: 400, col: lineStrong, sw: 0.82, op: 0.84 },
    { leftY: 208, leftX: 24, rightX: 400, col: lineStrong, sw: 0.85, op: 0.86 },
    { leftY: 186, leftX: 0, rightX: 400, col: line, sw: 0.72, op: 0.72 },
    { leftY: 164, leftX: 0, rightX: 376, col: lineSoft, sw: 0.6, op: 0.58 },
    { leftY: 230, leftX: 0, rightX: 400, col: accentWarm, sw: 0.38, op: 0.18 },
  ];

  return (
    <svg viewBox="0 0 400 400" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden className={SVG_CLASS}>
      {showAccentGradient ? <DoeLineAccentGradientDef /> : null}
      {rows.map(({ leftY, leftX, rightX, col, sw, op }, i) => {
        const isAccent = col === accentWarm;
        return (
          <line
            key={i}
            x1={leftX}
            y1={leftY}
            x2={rightX}
            y2={leftY - (rise * (rightX - leftX)) / 400}
            stroke={isAccent && accentStroke ? accentStroke : col}
            strokeWidth={isAccent && accentStroke ? sw + 0.12 : sw}
            opacity={isAccent && accentStroke ? 0.78 : op}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

/** Converging channel lines — many paths meeting at center. */
function ConvergingLinesGraphic({
  palette,
  fullBleed = false,
  showAccentGradient = false,
}: {
  palette: LinePalette;
  fullBleed?: boolean;
  showAccentGradient?: boolean;
}) {
  const { lineSoft, line, lineStrong, accent, accentStroke } = palette;
  const cy = 200;
  const offsets = [-52, -40, -28, -18, -9, -3, 0, 3, 9, 18, 28, 40, 52];
  const edgeX = fullBleed ? 0 : 32;
  const farX = fullBleed ? 400 : 368;
  const cpNear = fullBleed ? 96 : 128;
  const cpFar = fullBleed ? 304 : 272;

  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      preserveAspectRatio={fullBleed ? "xMidYMid slice" : "xMidYMid meet"}
      aria-hidden
      className={SVG_CLASS}
    >
      {showAccentGradient ? <DoeLineAccentGradientDef /> : null}
      {offsets.map((offset, i) => {
        const yAtEdge = cy + offset;
        const yAtCenter = cy + (offset > 0 ? 5 : offset < 0 ? -5 : 0) * (Math.abs(offset) / 52);
        const isCenter = i === 6;
        const isNearCenter = Math.abs(offset) <= 9;
        const col = isCenter
          ? accentStroke ?? accent
          : isNearCenter && accentStroke
            ? accentStroke
            : Math.abs(offset) > 36
              ? lineSoft
              : i % 3 === 0
                ? lineStrong
                : line;
        const sw = isCenter
          ? fullBleed
            ? "1.35"
            : accentStroke
              ? "1.05"
              : "0.95"
          : isNearCenter && accentStroke
            ? "0.82"
            : Math.abs(offset) > 40
              ? "0.58"
              : "0.72";
        const opacity = isCenter && accentStroke ? 0.92 : isNearCenter && accentStroke ? 0.55 : undefined;
        return (
          <path
            key={i}
            d={`M ${edgeX},${yAtEdge} C ${cpNear},${yAtEdge} 168,${yAtCenter} 200,${yAtCenter} C 232,${yAtCenter} ${cpFar},${yAtEdge} ${farX},${yAtEdge}`}
            stroke={col}
            strokeWidth={sw}
            opacity={opacity}
          />
        );
      })}
    </svg>
  );
}

/** Soft crosshatch — balanced diagonal grid. */
function CrosshatchLinesGraphic({
  palette,
  showAccentGradient = false,
}: {
  palette: LinePalette;
  showAccentGradient?: boolean;
}) {
  const { lineSoft, line, lineStrong, accentWarm, accent, accentStroke } = palette;
  const spacing = 28;
  const lines: { x1: number; y1: number; x2: number; y2: number; col: string; sw: number; op: number }[] = [];

  for (let i = -8; i <= 16; i++) {
    const t = i * spacing;
    const strong = i === 4 || i === 8;
    lines.push({
      x1: t,
      y1: 0,
      x2: t + 400,
      y2: 400,
      col: strong ? lineStrong : lineSoft,
      sw: strong ? 0.72 : 0.55,
      op: strong ? 0.72 : 0.48,
    });
    lines.push({
      x1: t,
      y1: 400,
      x2: t + 400,
      y2: 0,
      col: strong ? line : lineSoft,
      sw: strong ? 0.68 : 0.52,
      op: strong ? 0.66 : 0.44,
    });
  }

  return (
    <svg viewBox="0 0 400 400" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden className={SVG_CLASS}>
      {showAccentGradient ? <DoeLineAccentGradientDef /> : null}
      {lines.map((l, i) => (
        <line
          key={i}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke={l.col}
          strokeWidth={l.sw}
          opacity={l.op}
          strokeLinecap="round"
        />
      ))}
      <circle
        cx={200}
        cy={200}
        r={showAccentGradient && accentStroke ? "3.25" : "2.5"}
        fill={showAccentGradient ? accent : accentWarm}
        opacity={showAccentGradient ? 0.82 : 0.55}
      />
    </svg>
  );
}

type CircleSpec = { cx: number; cy: number; r: number };

function circlePairIntersections(a: CircleSpec, b: CircleSpec): [number, number][] {
  const dx = b.cx - a.cx;
  const dy = b.cy - a.cy;
  const d = Math.hypot(dx, dy);
  if (d === 0 || d > a.r + b.r || d < Math.abs(a.r - b.r)) return [];

  const chord = (a.r * a.r - b.r * b.r + d * d) / (2 * d);
  const h2 = a.r * a.r - chord * chord;
  if (h2 < 0) return [];

  const h = Math.sqrt(h2);
  const px = a.cx + (chord * dx) / d;
  const py = a.cy + (chord * dy) / d;
  const rx = (-dy * h) / d;
  const ry = (dx * h) / d;

  return [
    [px + rx, py + ry],
    [px - rx, py - ry],
  ];
}

function innerIntersectionPoint(
  a: CircleSpec,
  b: CircleSpec,
  focusX: number,
  focusY: number,
): [number, number] | null {
  const points = circlePairIntersections(a, b);
  if (points.length === 0) return null;
  if (points.length === 1) return points[0];
  const d0 = Math.hypot(points[0][0] - focusX, points[0][1] - focusY);
  const d1 = Math.hypot(points[1][0] - focusX, points[1][1] - focusY);
  return d0 < d1 ? points[0] : points[1];
}

/** Three overlapping circles — desktop apply card center mark. */
export function JoinApplyCardDesktopLineGraphic() {
  const line = JOIN_FORM_BEIGE.line;
  const point = JOIN_FORM_BEIGE.meter;
  const focusX = 200;
  const focusY = 206;

  const circles: CircleSpec[] = [
    { cx: 200, cy: 156, r: 96 },
    { cx: 156, cy: 248, r: 96 },
    { cx: 244, cy: 248, r: 96 },
  ];

  const intersectionPoints = [
    innerIntersectionPoint(circles[0], circles[1], focusX, focusY),
    innerIntersectionPoint(circles[1], circles[2], focusX, focusY),
    innerIntersectionPoint(circles[0], circles[2], focusX, focusY),
  ].filter((p): p is [number, number] => p !== null);

  return (
    <svg viewBox="0 0 400 400" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden className={SVG_CLASS}>
      {circles.map(({ cx, cy, r }) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} stroke={line} strokeWidth="0.85" />
      ))}
      {intersectionPoints.map(([x, y], i) => (
        <circle key={`${x}-${y}-${i}`} cx={x} cy={y} r="3.25" fill={point} />
      ))}
    </svg>
  );
}

const JOIN_LINE_GRAPHICS = [
  WaveLinesGraphic,
  DiagonalLinesGraphic,
  ConvergingLinesGraphic,
  CrosshatchLinesGraphic,
] as const;

export function JoinInternLineGraphic({
  variant,
  onOrange = false,
  brandAccent = false,
  fullBleed = false,
}: {
  variant: 0 | 1 | 2 | 3;
  onOrange?: boolean;
  /** Doe orange gradient on central/accent line strokes (beige backgrounds). */
  brandAccent?: boolean;
  /** Converging lines extend to the SVG edges (apply card). */
  fullBleed?: boolean;
}) {
  const palette = onOrange ? ORANGE_PALETTE : brandAccent ? BRAND_ACCENT_BEIGE_PALETTE : BEIGE_PALETTE;
  const showAccentGradient = brandAccent && !onOrange;
  if (variant === 2) {
    return (
      <ConvergingLinesGraphic palette={palette} fullBleed={fullBleed} showAccentGradient={showAccentGradient} />
    );
  }
  const Graphic = JOIN_LINE_GRAPHICS[variant];
  return <Graphic palette={palette} showAccentGradient={showAccentGradient} />;
}
