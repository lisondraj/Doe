import { BLOG_LANDING_HERO } from "@/lib/blog/blog-landing-hero-colors";

const { lineSoft, line, lineStrong, accent, accentWarm } = BLOG_LANDING_HERO;

/**
 * Generate a multi-cycle cubic-bezier sine-approximation path.
 *
 * Each half-cycle is one bezier whose control points sit at the
 * peak/trough (both CPs at the same y so the curve is symmetric).
 * Every segment endpoint returns to base y, so the path always
 * starts and ends at (leftX, y) and (rightX, y) respectively.
 */
function wavePath(
  y: number,
  amp: number,
  cycles: number,
  phase: 1 | -1,
  leftX = 0,
  rightX = 400,
): string {
  const W = rightX - leftX;
  const hw = W / (cycles * 2); // half-wavelength
  let d = `M ${leftX} ${y}`;
  for (let i = 0; i < cycles * 2; i++) {
    const x0 = leftX + i * hw;
    const x1 = leftX + (i + 1) * hw;
    const dir = i % 2 === 0 ? phase : -phase;
    const cpY = y + dir * amp;
    const cp1x = (x0 + hw * 0.36).toFixed(1);
    const cp2x = (x1 - hw * 0.36).toFixed(1);
    d += ` C ${cp1x} ${cpY} ${cp2x} ${cpY} ${x1} ${y}`;
  }
  return d;
}

type WaveDef = {
  y: number;
  amp: number;
  cycles: number;
  phase: 1 | -1;
  leftX?: number;
  rightX?: number;
  col: string;
  sw: number;
  op: number;
};

/**
 * Wave lines: y values run 22 → 308 (top ~57 % of viewBox 520).
 * The bottom 43 % is intentionally open for the headline and filter.
 *
 * Visual rhythm:
 *   sparse / light at top → denser / bolder toward center →
 *   fading again at the lower edge.
 * Amplitude, period, and phase vary per-line to avoid visual regularity.
 */
const WAVES: WaveDef[] = [
  // ── Sparse top tier ─────────────────────────────────────────
  { y:  22, amp:  5, cycles: 1.0, phase:  1,                   col: lineSoft,   sw: 0.50, op: 0.42 },
  { y:  33, amp:  3, cycles: 1.5, phase: -1, leftX: 16,        col: lineSoft,   sw: 0.50, op: 0.48 },
  { y:  45, amp:  8, cycles: 1.0, phase:  1,                   col: lineSoft,   sw: 0.55, op: 0.54 },
  { y:  57, amp:  4, cycles: 2.0, phase: -1,          rightX: 386, col: lineSoft,   sw: 0.55, op: 0.58 },

  // ── Upper-mid tier ──────────────────────────────────────────
  { y:  70, amp: 12, cycles: 1.0, phase:  1,                   col: line,       sw: 0.63, op: 0.64 },
  { y:  83, amp:  7, cycles: 1.5, phase: -1,          rightX: 400, col: line,       sw: 0.65, op: 0.68 },
  { y:  96, amp: 15, cycles: 1.0, phase:  1, leftX: 10,        col: line,       sw: 0.68, op: 0.72 },
  { y: 109, amp:  9, cycles: 2.0, phase: -1,                   col: line,       sw: 0.70, op: 0.75 },

  // ── Dense center tier ───────────────────────────────────────
  { y: 122, amp: 19, cycles: 1.0, phase:  1,                   col: lineStrong, sw: 0.74, op: 0.80 },
  { y: 135, amp: 11, cycles: 1.5, phase: -1,          rightX: 392, col: lineStrong, sw: 0.77, op: 0.83 },
  { y: 148, amp: 23, cycles: 1.0, phase:  1,                   col: lineStrong, sw: 0.80, op: 0.86 },
  { y: 161, amp: 13, cycles: 2.0, phase: -1, leftX:  8,        col: lineStrong, sw: 0.80, op: 0.85 },
  { y: 174, amp: 25, cycles: 1.0, phase:  1,                   col: lineStrong, sw: 0.78, op: 0.83 },
  { y: 186, amp: 12, cycles: 1.5, phase: -1,                   col: line,       sw: 0.72, op: 0.78 },
  { y: 198, amp: 17, cycles: 1.0, phase:  1,          rightX: 398, col: line,       sw: 0.70, op: 0.75 },
  { y: 210, amp:  8, cycles: 2.0, phase: -1,                   col: line,       sw: 0.67, op: 0.70 },

  // ── Lower-mid tier ──────────────────────────────────────────
  { y: 222, amp: 13, cycles: 1.0, phase:  1,                   col: line,       sw: 0.64, op: 0.65 },
  { y: 234, amp:  7, cycles: 1.5, phase: -1, leftX: 12,        col: lineSoft,   sw: 0.60, op: 0.60 },
  { y: 246, amp: 11, cycles: 1.0, phase:  1,                   col: lineSoft,   sw: 0.57, op: 0.56 },
  { y: 258, amp:  5, cycles: 2.0, phase: -1,          rightX: 390, col: lineSoft,   sw: 0.54, op: 0.51 },

  // ── Sparse bottom tier ──────────────────────────────────────
  { y: 270, amp:  9, cycles: 1.0, phase:  1,                   col: lineSoft,   sw: 0.51, op: 0.46 },
  { y: 282, amp:  4, cycles: 1.5, phase: -1,                   col: lineSoft,   sw: 0.48, op: 0.41 },
  { y: 294, amp:  7, cycles: 1.0, phase:  1, leftX: 18,        col: lineSoft,   sw: 0.46, op: 0.36 },
  { y: 306, amp:  3, cycles: 2.0, phase: -1,                   col: lineSoft,   sw: 0.44, op: 0.30 },

  // ── Accent overlays on select structural lines ───────────────
  { y:  96, amp: 15, cycles: 1.0, phase:  1, leftX: 10,        col: accentWarm, sw: 0.36, op: 0.18 },
  { y: 148, amp: 23, cycles: 1.0, phase:  1,                   col: accent,     sw: 0.30, op: 0.13 },
  { y: 210, amp:  8, cycles: 2.0, phase: -1,                   col: accentWarm, sw: 0.28, op: 0.14 },
];

export function BlogLandingHeroGraphic() {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 400 520"
      fill="none"
      preserveAspectRatio="xMidYMin meet"
      aria-hidden
    >
      {WAVES.map(({ y, amp, cycles, phase, leftX = 0, rightX = 400, col, sw, op }, i) => (
        <path
          key={i}
          d={wavePath(y, amp, cycles, phase, leftX, rightX)}
          stroke={col}
          strokeWidth={sw}
          opacity={op}
          strokeLinecap="round"
          fill="none"
        />
      ))}
    </svg>
  );
}
