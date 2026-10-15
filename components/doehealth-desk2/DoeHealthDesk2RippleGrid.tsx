"use client";

import { useEffect, useRef } from "react";

/** Target pitch between dots, in CSS pixels. The grid is drawn so it fills the box at this pitch. */
const PITCH = 13;

/** Everything a pattern needs to light one dot: its position, its column, the frame's time, and the box. */
type Cell = { x: number; y: number; c: number; t: number; w: number; h: number; maxR: number };

/**
 * One dot pattern. `level` (0 to 1) is how much the dot swells; `falloff` (0 to 1) is how strongly it
 * is faded away from the pattern's anchor. `scale` sizes the whole pattern's dots.
 */
type Pattern = { scale: number; paint: (k: Cell) => { level: number; falloff: number } };

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (t: number) => t * t * (3 - 2 * t);

/** Falloff from a point, so a pattern fades toward the top of the strip. */
const fromAnchor = (k: Cell, ax: number, ay: number) => 1 - Math.min(1, Math.hypot(k.x - ax, k.y - ay) / k.maxR);

/**
 * The four titles' patterns, in order. The first is the original ripple, rising from just below the
 * strip's centre. The second is a half circle, the third equaliser bars, the fourth a live waveform.
 * The carousel's `wheel` morphs between them.
 */
const PATTERNS: readonly Pattern[] = [
  {
    // Concentric rings from a source below the strip.
    scale: 1,
    paint: (k) => {
      const d = Math.hypot(k.x - k.w * 0.5, k.y - k.h * 1.35);
      const wave = 0.5 + 0.5 * Math.cos((d / 110 - k.t * 0.22) * Math.PI * 2);
      return { level: wave ** 3, falloff: 1 - Math.min(1, d / k.maxR) };
    },
  },
  {
    // A convex-up half circle on the strip's bottom edge: a ring of swollen dots, with a soft ripple rising inside.
    scale: 1,
    paint: (k) => {
      const radius = k.h * 0.72;
      const d = Math.hypot(k.x - k.w * 0.5, k.y - k.h);
      const ring = clamp01(1 - Math.abs(d - radius) / 16);
      const inside = d < radius ? 0.22 + 0.18 * (0.5 + 0.5 * Math.cos(d / 16 - k.t * 0.9)) : 0;
      return { level: Math.max(ring ** 1.5, inside), falloff: 1 - ((k.h - k.y) / k.h) * 0.5 };
    },
  },
  {
    // Columns of dots rising from the bottom like equaliser bars, each at its own height.
    scale: 0.95,
    paint: (k) => {
      const u = (k.h - k.y) / k.h;
      const bar = 0.3 + 0.6 * (0.5 + 0.5 * Math.sin(k.c * 0.55 + k.t * 0.5 + Math.sin(k.c * 0.23) * 2));
      const lit = clamp01((bar - u) / 0.08);
      return { level: 0.1 + 0.9 * lit, falloff: 1 - u * 0.5 };
    },
  },
  {
    // A live waveform: a travelling sine line of swelling dots across the strip, its height breathing.
    scale: 1.1,
    paint: (k) => {
      const envelope = 0.55 + 0.45 * Math.sin(k.x / 170 + k.t * 0.3);
      const curveY = k.h * 0.5 + k.h * 0.3 * envelope * Math.sin(k.x / 45 - k.t * 1.1);
      const dist = Math.abs(k.y - curveY);
      const lit = clamp01(1 - dist / 22);
      return { level: lit ** 1.5, falloff: fromAnchor(k, k.w * 0.5, k.h * 1.35) };
    },
  },
];

/**
 * How much each pattern counts at a wheel position: 1 for the pattern at a whole number, blended
 * smoothly between neighbours. The weights always sum to 1.
 */
function weightsAt(wheel: number): number[] {
  const w = Math.min(PATTERNS.length - 1, Math.max(0, wheel));
  const raw = PATTERNS.map((_, k) => smooth(clamp01(1 - Math.abs(w - k))));
  const sum = raw.reduce((a, b) => a + b, 0) || 1;
  return raw.map((v) => v / sum);
}

/**
 * A uniform grid of dots that swell as each pattern moves through them. As the carousel's `wheel`
 * moves from title to title, the grid morphs between the four patterns. Drawn live on a canvas that
 * fills its box; holds still for reduced motion.
 */
export function DoeHealthDesk2RippleGrid({ color, wheel = 0 }: { color: string; wheel?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const wheelRef = useRef(wheel);

  useEffect(() => {
    wheelRef.current = wheel;
  }, [wheel]);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    let w = 0;
    let h = 0;

    const size = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const paint = (now: number) => {
      if (w === 0 || h === 0) return;
      const t = (now - start) / 1000;
      const weights = weightsAt(wheelRef.current);
      const cols = Math.max(1, Math.floor(w / PITCH));
      const rows = Math.max(1, Math.floor(h / PITCH));
      const px = w / cols;
      const py = h / rows;
      const maxR = Math.hypot(w, h);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = color;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cell: Cell = { x: (c + 0.5) * px, y: (r + 0.5) * py, c, t, w, h, maxR };
          // Blend each pattern's alpha and radius by how much it counts at this wheel position.
          let alpha = 0;
          let radius = 0;
          for (let k = 0; k < PATTERNS.length; k++) {
            const wgt = weights[k];
            if (wgt === 0) continue;
            const { level, falloff } = PATTERNS[k].paint(cell);
            alpha += wgt * (0.14 + 0.86 * level) * (0.45 + 0.55 * falloff);
            radius += wgt * (0.8 + 2.6 * level) * PATTERNS[k].scale;
          }
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(cell.x, cell.y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    let raf = 0;
    const loop = (now: number) => {
      paint(now);
      raf = requestAnimationFrame(loop);
    };

    size();
    if (reduce) paint(start);
    else raf = requestAnimationFrame(loop);
    const observer = new ResizeObserver(() => {
      size();
      if (reduce) paint(start);
    });
    observer.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [color]);

  return <canvas ref={ref} className="doehealth-desk2-ripple" aria-hidden />;
}
