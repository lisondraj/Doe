import { BLOG_LANDING_HERO } from "@/lib/blog/blog-landing-hero-colors";

type LinePalette = {
  lineSoft: string;
  line: string;
  lineStrong: string;
  accent: string;
  accentWarm: string;
};

const BEIGE_PALETTE: LinePalette = {
  lineSoft: BLOG_LANDING_HERO.lineSoft,
  line: BLOG_LANDING_HERO.line,
  lineStrong: BLOG_LANDING_HERO.lineStrong,
  accent: BLOG_LANDING_HERO.accent,
  accentWarm: BLOG_LANDING_HERO.accentWarm,
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
function WaveLinesGraphic({ palette }: { palette: LinePalette }) {
  const { lineSoft, line, lineStrong, accentWarm } = palette;
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
      {waves.map((w, i) => (
        <path
          key={i}
          d={path(w.y, w.amp, w.cycles, w.phase)}
          stroke={w.col}
          strokeWidth={w.sw}
          opacity={w.op}
          strokeLinecap="round"
          fill="none"
        />
      ))}
    </svg>
  );
}

/** Diagonal parallel lines — bottom-left to top-right. */
function DiagonalLinesGraphic({ palette }: { palette: LinePalette }) {
  const { lineSoft, line, lineStrong, accentWarm } = palette;
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
      {rows.map(({ leftY, leftX, rightX, col, sw, op }, i) => (
        <line
          key={i}
          x1={leftX}
          y1={leftY}
          x2={rightX}
          y2={leftY - (rise * (rightX - leftX)) / 400}
          stroke={col}
          strokeWidth={sw}
          opacity={op}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

/** Converging channel lines — many paths meeting at center. */
function ConvergingLinesGraphic({ palette }: { palette: LinePalette }) {
  const { lineSoft, line, lineStrong, accent } = palette;
  const cy = 200;
  const offsets = [-52, -40, -28, -18, -9, -3, 0, 3, 9, 18, 28, 40, 52];

  return (
    <svg viewBox="0 0 400 400" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden className={SVG_CLASS}>
      {offsets.map((offset, i) => {
        const yAtEdge = cy + offset;
        const yAtCenter = cy + (offset > 0 ? 5 : offset < 0 ? -5 : 0) * (Math.abs(offset) / 52);
        const isCenter = i === 6;
        const col = isCenter ? accent : Math.abs(offset) > 36 ? lineSoft : i % 3 === 0 ? lineStrong : line;
        const sw = isCenter ? "0.95" : Math.abs(offset) > 40 ? "0.58" : "0.72";
        return (
          <path
            key={i}
            d={`M 32,${yAtEdge} C 128,${yAtEdge} 168,${yAtCenter} 200,${yAtCenter} C 232,${yAtCenter} 272,${yAtEdge} 368,${yAtEdge}`}
            stroke={col}
            strokeWidth={sw}
          />
        );
      })}
    </svg>
  );
}

/** Soft crosshatch — balanced diagonal grid. */
function CrosshatchLinesGraphic({ palette }: { palette: LinePalette }) {
  const { lineSoft, line, lineStrong, accentWarm } = palette;
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
      <circle cx={200} cy={200} r="2.5" fill={accentWarm} opacity={0.55} />
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
}: {
  variant: 0 | 1 | 2 | 3;
  onOrange?: boolean;
}) {
  const palette = onOrange ? ORANGE_PALETTE : BEIGE_PALETTE;
  const Graphic = JOIN_LINE_GRAPHICS[variant];
  return <Graphic palette={palette} />;
}
