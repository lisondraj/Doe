"use client";

import { useEffect, useRef } from "react";

/** Target pitch between dots, in CSS pixels. The grid is drawn so it fills the box at this pitch. */
const PITCH = 8;

/** One dot's place in the grid, with the frame's clock and the box's size. */
type Cell = { x: number; y: number; t: number; w: number; h: number };

/** One drawing made of dots. Returns how lit a dot is (0 to 1). */
type Pattern = (k: Cell) => number;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (t: number) => t * t * (3 - 2 * t);
const mod = (a: number, n: number) => ((a % n) + n) % n;
/** A steady 0-to-1 value per whole number, so repeated blocks differ without changing frame to frame. */
const hash = (n: number) => {
  const s = Math.sin(n * 127.1) * 43758.5453;
  return s - Math.floor(s);
};

/** Line half-width, in strip heights. About one dot pitch, so a line always lands on a row of dots. */
const STROKE = 0.04;

/** 1 on a line (distance 0), fading to 0 at `width` away. */
const line = (dist: number, width = STROKE) => clamp01(1 - Math.abs(dist) / width);

/** 1 at the centre of a dot of `radius`, softening at its edge. */
const dot = (dist: number, radius: number) => clamp01((radius - dist) / 0.03);

/** Distance from a point to a segment. */
function segment(X: number, Y: number, ax: number, ay: number, bx: number, by: number) {
  const dx = bx - ax;
  const dy = by - ay;
  const len2 = dx * dx + dy * dy || 1;
  const u = clamp01(((X - ax) * dx + (Y - ay) * dy) / len2);
  return Math.hypot(X - (ax + u * dx), Y - (ay + u * dy));
}

/**
 * The drawings' space, in strip heights: Y runs 0 (top) to 1 (bottom), X runs 0 to W across the whole
 * width. Every drawing repeats along X, so it fills the strip edge to edge on any screen.
 */
const local = (k: Cell) => ({ X: k.x / k.h, Y: k.y / k.h, W: k.w / k.h });

/**
 * The four titles, in order, each drawn in dots across the full width:
 * find you: a row of map pins; a search beam sweeps along and lights each one, and your clinic pings.
 * website: a page laid out in the strip, its blocks of text moving past as if read.
 * tools: a line of tools joined to one line; data travels along it and lights each tool it reaches.
 * updated: a progress bar fills across, and each agent above it gets a check as the bar passes.
 * The carousel's `wheel` morphs between them.
 */
const PATTERNS: readonly Pattern[] = [
  (k) => {
    const { X, Y, W } = local(k);
    const gap = 0.9;
    const pinAt = (n: number) => ({ x: (n + 0.5) * gap, y: n % 2 === 0 ? 0.3 : 0.4 });
    const pin = (px: number, py: number) =>
      Math.max(
        line(Math.hypot(X - px, Y - py) - 0.14),
        line(segment(X, Y, px - 0.12, py + 0.07, px, py + 0.36)),
        line(segment(X, Y, px + 0.12, py + 0.07, px, py + 0.36)),
        dot(Math.hypot(X - px, Y - py), 0.045),
      );
    const n = Math.floor(X / gap);
    const here = pinAt(n);
    const beamX = mod(k.t * 0.12, 1) * (W + 1) - 0.5;
    const lit = clamp01(1 - Math.abs(here.x - beamX) / 0.7);
    const beam = line(X - beamX, 0.05) * 0.35;
    // Your clinic: the pin nearest the middle stays lit and sends out a ping.
    const homeN = Math.floor(W / 2 / gap);
    const home = pinAt(homeN);
    const ping = mod(k.t * 0.4, 1);
    const ring = line(Math.hypot(X - home.x, Y - home.y) - 0.14 - ping * 0.5) * (1 - ping);
    return Math.max(pin(here.x, here.y) * (n === homeN ? 1 : 0.3 + 0.7 * lit), beam, ring);
  },
  (k) => {
    const { X, Y, W } = local(k);
    const bar = line(Y - 0.2) * 0.7;
    const tabs = Math.max(
      dot(Math.hypot(X - 0.18, Y - 0.1), 0.04),
      dot(Math.hypot(X - 0.3, Y - 0.1), 0.04),
      dot(Math.hypot(X - 0.42, Y - 0.1), 0.04),
    );
    const address = X > 0.6 && X < Math.min(W - 0.2, 0.6 + W * 0.35) ? line(Y - 0.1) * 0.5 : 0;
    // Blocks of page content, each a heading and three lines, move slowly left.
    const period = 1.3;
    const sx = X + k.t * 0.08;
    const n = Math.floor(sx / period);
    const bx = sx - n * period;
    const rows: readonly (readonly [number, number, number])[] = [
      [0.36, 0.75, 0.85],
      [0.52, 0.5 + 0.4 * hash(n), 0.55],
      [0.66, 0.4 + 0.5 * hash(n + 7), 0.55],
      [0.8, 0.3 + 0.5 * hash(n + 13), 0.55],
    ];
    let text = 0;
    for (const [ry, len, level] of rows) {
      if (bx >= 0.1 && bx <= 0.1 + len) text = Math.max(text, line(Y - ry) * level);
    }
    // A reading line sweeps across the content.
    const readX = mod(k.t * 0.15, 1) * (W + 0.6) - 0.3;
    const read = Y > 0.28 ? line(X - readX) * 0.6 : 0;
    return Math.max(bar, tabs, address, text, read);
  },
  (k) => {
    const { X, Y } = local(k);
    const bus = line(Y - 0.5) * 0.45;
    const spacing = 1.8;
    const speed = 0.35;
    const packetGap = (x: number) => {
      const phase = mod(x - k.t * speed, spacing);
      return Math.min(phase, spacing - phase);
    };
    const packet = dot(Math.hypot(packetGap(X), Y - 0.5), 0.08);
    // Tools sit above and below the line in turn, each joined to it, and light as data passes.
    const gap = 0.9;
    const n = Math.floor(X / gap);
    const nx = (n + 0.5) * gap;
    const up = n % 2 === 0;
    const ny = up ? 0.22 : 0.78;
    const glow = clamp01(1 - packetGap(nx) / 0.45);
    const tool = line(Math.hypot(X - nx, Y - ny) - 0.13) * (0.4 + 0.6 * glow);
    const stub = line(segment(X, Y, nx, 0.5, nx, up ? 0.35 : 0.65)) * (0.35 + 0.5 * glow);
    const core = dot(Math.hypot(X - nx, Y - ny), 0.05) * glow;
    return Math.max(bus, packet, tool, stub, core);
  },
  (k) => {
    const { X, Y, W } = local(k);
    // The bar fills across, holds full for a moment, then starts again.
    const front = Math.min(1, mod(k.t * 0.09, 1.25)) * W;
    const track = line(Y - 0.7) * 0.25;
    const fill = X <= front ? clamp01(1 - Math.abs(Y - 0.7) / 0.08) * 0.9 : 0;
    const head = dot(Math.hypot(X - front, Y - 0.7), 0.1);
    const gap = 1.1;
    const cx = (Math.floor(X / gap) + 0.5) * gap;
    const done = cx <= front;
    const ring = line(Math.hypot(X - cx, Y - 0.28) - 0.18) * (done ? 0.85 : 0.3);
    const check = done
      ? Math.max(line(segment(X, Y, cx - 0.09, 0.28, cx - 0.025, 0.35)), line(segment(X, Y, cx - 0.025, 0.35, cx + 0.1, 0.2)))
      : 0;
    return Math.max(track, fill, head, ring, check);
  },
];

/**
 * How much each drawing counts at a wheel position: 1 for the drawing at a whole number, blended
 * smoothly between neighbours. The weights always sum to 1.
 */
function weightsAt(wheel: number): number[] {
  const w = Math.min(PATTERNS.length - 1, Math.max(0, wheel));
  const raw = PATTERNS.map((_, k) => smooth(clamp01(1 - Math.abs(w - k))));
  const sum = raw.reduce((a, b) => a + b, 0) || 1;
  return raw.map((v) => v / sum);
}

/**
 * A uniform grid of dots, each lit by the drawing that is showing. As the carousel's `wheel` moves
 * from title to title, the grid morphs between the four drawings. Drawn live on a canvas that fills
 * its box; holds still for reduced motion.
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
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = color;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cell: Cell = { x: (c + 0.5) * px, y: (r + 0.5) * py, t, w, h };
          // Blend the drawings' light by how much each counts at this wheel position.
          let level = 0;
          for (let k = 0; k < PATTERNS.length; k++) {
            const wgt = weights[k];
            if (wgt === 0) continue;
            level += wgt * PATTERNS[k](cell);
          }
          ctx.globalAlpha = 0.12 + 0.88 * level;
          ctx.beginPath();
          ctx.arc(cell.x, cell.y, 0.6 + 2 * level, 0, Math.PI * 2);
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
