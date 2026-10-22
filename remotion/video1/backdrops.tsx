import { useLayoutEffect, useRef, type ReactNode } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

import { EASE_IN_OUT, ramp } from "./motion";
import { C, VIDEO1_HEIGHT as H, VIDEO1_WIDTH as W } from "./theme";

/** Beige first, then the moving dot/line design, then whatever UI the scene adds (from ~frame 36). */
export function Stage({ backdrop, children }: { backdrop: ReactNode; children: ReactNode }) {
  const frame = useCurrentFrame();
  const reveal = ramp(frame, 10, 28, EASE_IN_OUT);
  return (
    <AbsoluteFill style={{ background: C.beige, overflow: "hidden" }}>
      <AbsoluteFill style={{ opacity: reveal }}>{backdrop}</AbsoluteFill>
      {children}
    </AbsoluteFill>
  );
}

const canvasStyle = { position: "absolute", left: 0, top: 0, width: W, height: H } as const;

/** Bitmap at device pixels so a 4K export stays sharp instead of upscaling a 1080 canvas. */
function prepareCanvas(canvas: HTMLCanvasElement, cssW: number, cssH: number) {
  const dpr = window.devicePixelRatio || 1;
  const w = Math.round(cssW * dpr);
  const h = Math.round(cssH * dpr);
  if (canvas.width !== w) canvas.width = w;
  if (canvas.height !== h) canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

const sphereCache = new Map<number, Float32Array>();

function spherePoints(count: number) {
  const cached = sphereCache.get(count);
  if (cached) return cached;
  const pts = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    pts[i * 3] = Math.cos(golden * i) * r;
    pts[i * 3 + 1] = y;
    pts[i * 3 + 2] = Math.sin(golden * i) * r;
  }
  sphereCache.set(count, pts);
  return pts;
}

export function DotSphere({
  cx = W / 2,
  cy = H / 2,
  radius = 420,
  count = 1700,
  speed = 0.006,
  tilt = 0.42,
  dotScale = 1,
  color = C.dot,
  burst = 0,
  spin,
}: {
  cx?: number;
  cy?: number;
  radius?: number;
  count?: number;
  speed?: number;
  tilt?: number;
  dotScale?: number;
  color?: string;
  /** 0 → 1 flings every dot outward at its own speed while it fades. */
  burst?: number;
  /** Frame that drives the rotation; defaults to the current frame. */
  spin?: number;
}) {
  const frame = useCurrentFrame();
  const ref = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = prepareCanvas(canvas, W, H);
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = color;
    const pts = spherePoints(count);
    const a = (spin ?? frame) * speed;
    const ca = Math.cos(a);
    const sa = Math.sin(a);
    const ct = Math.cos(tilt);
    const st = Math.sin(tilt);
    for (let i = 0; i < count; i++) {
      const x = pts[i * 3];
      const y = pts[i * 3 + 1];
      const z = pts[i * 3 + 2];
      const x1 = x * ca + z * sa;
      const z1 = -x * sa + z * ca;
      const y2 = y * ct - z1 * st;
      const z2 = y * st + z1 * ct;
      const depth = (z2 + 1) / 2;
      const persp = 1 + 0.12 * z2;
      const jitter = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
      const fling = 1 + burst * (1.1 + 3.4 * jitter) * (0.4 + 1.2 * depth);
      ctx.globalAlpha = (0.1 + 0.62 * Math.pow(depth, 1.5)) * (1 - Math.pow(burst, 1.8));
      ctx.beginPath();
      ctx.arc(cx + x1 * radius * persp * fling, cy + y2 * radius * persp * fling, (0.9 + 2.1 * depth) * dotScale * (1 + burst * (0.6 + 2.4 * depth)), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }, [frame, cx, cy, radius, count, speed, tilt, dotScale, color, burst, spin]);

  return <canvas ref={ref} style={canvasStyle} />;
}

/** Halftone dot wave across the lower half, rolling over time. */
export function DotWave({
  top = 0.44,
  amp = 70,
  color = C.dot,
  width = W,
  height = H,
  vertical = false,
  fade = 0,
}: {
  top?: number;
  amp?: number;
  color?: string;
  width?: number;
  height?: number;
  /** Runs the wave top-to-bottom, building toward the right edge. */
  vertical?: boolean;
  /** Fraction of the cross axis (from the sparse side) over which dots fade in. */
  fade?: number;
}) {
  const frame = useCurrentFrame();
  const ref = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = prepareCanvas(canvas, width, height);
    if (!ctx) return;
    const W = vertical ? height : width;
    const H = vertical ? width : height;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = color;
    const t = frame / 30;
    const cols = 150;
    const rows = 34;
    for (let j = 0; j < rows; j++) {
      const v = j / (rows - 1);
      const s = 0.35 + 0.65 * Math.pow(v, 1.2);
      const baseY = H * top + Math.pow(v, 1.3) * H * 0.64;
      const rowFade = Math.min(1, Math.pow(v / 0.4, 1.2));
      for (let i = 0; i < cols; i++) {
        const x0 = -240 + (i / (cols - 1)) * (W + 480);
        const x = W / 2 + (x0 - W / 2) * (0.92 + 0.16 * v);
        const z = 0.6 * Math.sin(x0 / 210 + 0.6 + t * 0.8) + 0.4 * Math.sin(x0 / 120 - baseY / 80 + 1.2 + t * 1.3) + 0.3 * Math.sin(x0 / 330 + baseY / 150 + t * 0.45);
        const h = Math.min(1, Math.max(0, (z + 1.3) / 2.6));
        const y = baseY - z * amp * s;
        const edgeFade = fade > 0 ? Math.min(1, Math.max(0, y / (H * fade))) : 1;
        ctx.globalAlpha = Math.min(0.85, (0.28 + 0.6 * h) * (0.5 + 0.5 * s)) * rowFade * edgeFade;
        ctx.beginPath();
        ctx.arc(vertical ? y : x, vertical ? x : y, (0.9 + 2.2 * s) * (0.7 + 0.5 * h), 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }, [frame, top, amp, color, width, height, vertical, fade]);

  return <canvas ref={ref} style={{ ...canvasStyle, width, height }} />;
}

/** Dense halftone tides banked against both side edges; their wavy inner edges roll slowly down the frame. Dot sizes follow DotWave. */
export function DotTide({ step = 12, reach = 540, opacity = 1 }: { step?: number; reach?: number; opacity?: number }) {
  const frame = useCurrentFrame();
  const ref = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = prepareCanvas(canvas, W, H);
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = C.dot;
    const t = frame / 30;
    for (const side of [0, 1]) {
      const phase = side * 2.4;
      const dir = side ? -1 : 1;
      for (let y = step / 2; y < H; y += step) {
        const edge = reach + 90 * Math.sin(y / 230 - dir * t * 0.5 + phase) + 36 * Math.sin(y / 97 + dir * t * 0.8 + 1.3 + phase);
        for (let d = step / 2; d < edge + 40; d += step) {
          const v = Math.min(1, Math.max(0, 1 - d / edge)) ** 1.2;
          if (v < 0.02) continue;
          const h = 0.5 + 0.5 * Math.sin(y / 60 - d / 90 - dir * t * 1.2 + phase);
          ctx.globalAlpha = opacity * Math.min(0.85, (0.28 + 0.6 * h) * (0.5 + 0.5 * v)) * Math.min(1, v * 3);
          ctx.beginPath();
          ctx.arc(side ? W - d : d, y, (0.9 + 2.2 * v) * (0.7 + 0.5 * h) * Math.min(1, 0.4 + v), 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    ctx.globalAlpha = 1;
  }, [frame, step, reach, opacity]);

  return <canvas ref={ref} style={canvasStyle} />;
}

/** Stacked sine lines drifting sideways. */
export function FlowLines({ count = 22, amp = 34, opacity = 0.1 }: { count?: number; amp?: number; opacity?: number }) {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const lines = Array.from({ length: count }, (_, i) => {
    const y0 = (i / (count - 1)) * (H + 120) - 60;
    let d = "";
    for (let x = -40; x <= W + 40; x += 24) {
      const y = y0 + amp * Math.sin(x / 280 + i * 0.35 + t * 0.6) + amp * 0.4 * Math.sin(x / 130 - t * 0.9 + i);
      d += `${d ? "L" : "M"}${x} ${y.toFixed(1)}`;
    }
    return d;
  });
  return (
    <svg width={W} height={H} style={canvasStyle}>
      {lines.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={C.walnut} strokeOpacity={opacity} strokeWidth={1.2} />
      ))}
    </svg>
  );
}

/** Concentric rings expanding slowly from a point. */
export function Rings({ cx = W / 2, cy = H / 2, gap = 64, count = 24, speed = 0.55 }: { cx?: number; cy?: number; gap?: number; count?: number; speed?: number }) {
  const frame = useCurrentFrame();
  const span = gap * count;
  return (
    <svg width={W} height={H} style={canvasStyle}>
      {Array.from({ length: count }, (_, i) => {
        const r = (i * gap + frame * speed) % span;
        const fade = Math.pow(1 - r / span, 0.7) * Math.min(1, r / 80);
        return <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={C.walnut} strokeOpacity={0.13 * fade} strokeWidth={1.2} />;
      })}
    </svg>
  );
}
