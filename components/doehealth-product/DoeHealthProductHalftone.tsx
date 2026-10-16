"use client";

/**
 * Halftone dot primitives in the Doe backdrop language (see remotion/video1/backdrops.tsx):
 * dot discs that swell toward the middle, rippling dot rings, and a rolling dot wave.
 */
import { type CSSProperties, type ReactNode, useEffect, useRef } from "react";

export const DOT = "#C2A987";

/** Rounds generated geometry so server and client render identical SVG attributes. */
const q = (v: number) => Math.round(v * 100) / 100;

type DiscProps = {
  size: number;
  color?: string;
  /** Second colour for a clockwise wedge from 12 o'clock, as a 0–1 fraction. */
  split?: { fraction: number; color: string };
  step?: number;
  maxDot?: number;
  opacity?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

/** A dot disc on a hex grid; dots are largest in the middle and shrink toward the rim. */
export function HalftoneDisc({ size, color = DOT, split, step = 7, maxDot, opacity = 1, className, style, children }: DiscProps) {
  const r = size / 2;
  const big = maxDot ?? step * 0.42;
  const dots: { x: number; y: number; d: number; alt: boolean }[] = [];
  const rowH = step * 0.866;
  for (let row = -Math.ceil(r / rowH); row <= Math.ceil(r / rowH); row++) {
    const y = row * rowH;
    const offset = row % 2 ? step / 2 : 0;
    for (let x = -r + offset; x <= r; x += step) {
      const dist = Math.hypot(x, y);
      if (dist > r - 1) continue;
      const angle = (Math.atan2(x, -y) + Math.PI * 2) % (Math.PI * 2);
      dots.push({ x, y, d: dist / r, alt: !!split && angle / (Math.PI * 2) < split.fraction });
    }
  }
  return (
    <span
      className={`${className?.includes("absolute") ? "" : "relative "}inline-flex items-center justify-center shrink-0 ${className ?? ""}`}
      style={{ width: size, height: size, ...style }}
    >
      <svg width={size} height={size} viewBox={`${-r} ${-r} ${size} ${size}`} style={{ position: "absolute", inset: 0, opacity }} aria-hidden="true">
        {dots.map((p, i) => {
          const rad = big * Math.pow(Math.max(0, 1 - p.d * p.d), 0.65);
          if (rad < 0.45) return null;
          return <circle key={i} cx={q(p.x)} cy={q(p.y)} r={q(rad)} fill={p.alt && split ? split.color : color} />;
        })}
      </svg>
      {children && <span className="relative">{children}</span>}
    </span>
  );
}

/** Concentric rings of dots; each ring pulses in turn so the disc reads as sound moving outward. */
export function RippleRings({ size, color = "#E8A585", rings = 6 }: { size: number; color?: string; rings?: number }) {
  const r = size / 2;
  const gap = (r - 4) / rings;
  return (
    <svg width={size} height={size} viewBox={`${-r} ${-r} ${size} ${size}`} aria-hidden="true" style={{ display: "block", flexShrink: 0 }}>
      <circle r={q(gap * 0.9)} fill={color} />
      {Array.from({ length: rings }, (_, k) => {
        const ringR = gap * (k + 1.4);
        const count = Math.max(8, Math.round((Math.PI * 2 * ringR) / 7));
        const dot = Math.max(0.8, 2.4 - k * 0.28);
        return (
          <g key={k} className="doe-ripple" style={{ animationDelay: `${k * 0.18}s` }}>
            {Array.from({ length: count }, (_, i) => {
              const a = (i / count) * Math.PI * 2 + k * 0.4;
              return <circle key={i} cx={q(Math.cos(a) * ringR)} cy={q(Math.sin(a) * ringR)} r={q(dot)} fill={color} />;
            })}
          </g>
        );
      })}
    </svg>
  );
}

/** Rolling halftone wave across a band; returns the wave's crest height at x so callers can pin to it. */
export function waveCrest(x: number, top: number) {
  return top + 10 * Math.sin(x / 70 + 0.8) + 6 * Math.sin(x / 31 + 2);
}

/**
 * The /video1 rolling halftone wave (remotion/video1/backdrops.tsx DotWave), drawn on a canvas and
 * animated in slow motion. `speed` scales the video's timing; 1 matches the video. Reduced-motion
 * users get a single still frame.
 */
export function SlowDotWave({
  width,
  height,
  top = 0.44,
  amp = 70,
  color = DOT,
  speed = 0.35,
  angle = 0,
  className,
  style,
}: {
  width: number;
  height: number;
  top?: number;
  amp?: number;
  color?: string;
  speed?: number;
  /** Degrees to tilt the wave; negative tilts counter-clockwise (bottom-left to top-right at -45). */
  angle?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  // A tilted wave needs room beyond its box, so the canvas grows to the box's diagonal and stays centred on it.
  const size = angle ? Math.ceil(Math.hypot(width, height)) : null;
  const cw = size ?? width;
  const ch = size ?? height;
  const offsetX = (cw - width) / 2;
  const offsetY = (ch - height) / 2;

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(cw * dpr);
    canvas.height = Math.round(ch * dpr);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    const rad = (angle * Math.PI) / 180;
    let raf = 0;

    const draw = (now: number) => {
      const t = reduce ? 0 : ((now - start) / 1000) * speed;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cw, ch);
      ctx.save();
      ctx.translate(cw / 2, ch / 2);
      ctx.rotate(rad);
      ctx.translate(-width / 2, -height / 2);
      ctx.fillStyle = color;
      const cols = 150;
      const rows = 34;
      for (let j = 0; j < rows; j++) {
        const v = j / (rows - 1);
        const s = 0.35 + 0.65 * Math.pow(v, 1.2);
        const baseY = height * top + Math.pow(v, 1.3) * height * 0.64;
        const rowFade = Math.min(1, Math.pow(v / 0.4, 1.2));
        for (let i = 0; i < cols; i++) {
          const x0 = -240 + (i / (cols - 1)) * (width + 480);
          const x = width / 2 + (x0 - width / 2) * (0.92 + 0.16 * v);
          const z =
            0.6 * Math.sin(x0 / 210 + 0.6 + t * 0.8) +
            0.4 * Math.sin(x0 / 120 - baseY / 80 + 1.2 + t * 1.3) +
            0.3 * Math.sin(x0 / 330 + baseY / 150 + t * 0.45);
          const h = Math.min(1, Math.max(0, (z + 1.3) / 2.6));
          const y = baseY - z * amp * s;
          ctx.globalAlpha = Math.min(0.85, (0.28 + 0.6 * h) * (0.5 + 0.5 * s)) * rowFade;
          ctx.beginPath();
          ctx.arc(x, y, (0.9 + 2.2 * s) * (0.7 + 0.5 * h), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      ctx.restore();
      if (!reduce) raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [cw, ch, width, height, top, amp, color, speed, angle]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={className}
      style={{
        width: cw,
        height: ch,
        ...(size ? { marginLeft: -offsetX, marginTop: -offsetY } : null),
        ...style,
      }}
    />
  );
}

export function DotWave({ width, height, top, color = DOT }: { width: number; height: number; top: number; color?: string }) {
  const rows = 9;
  const step = 11;
  const dots: { x: number; y: number; r: number; o: number }[] = [];
  for (let j = 0; j < rows; j++) {
    const v = j / (rows - 1);
    for (let x = -step; x <= width + step; x += step) {
      const sx = x + (j % 2 ? step / 2 : 0);
      const y = waveCrest(sx, top) + v * (height - top) * 0.9;
      const h = 0.5 + 0.5 * Math.sin(sx / 52 - j * 0.7);
      dots.push({ x: sx, y, r: (0.7 + 2 * v) * (0.7 + 0.45 * h), o: Math.min(0.85, 0.3 + 0.55 * v) * (0.6 + 0.4 * h) });
    }
  }
  return (
    <svg width={width} height={height} aria-hidden="true" style={{ position: "absolute", left: 0, top: 0 }}>
      {dots.map((d, i) => (
        <circle key={i} cx={q(d.x)} cy={q(d.y)} r={q(d.r)} fill={color} opacity={q(d.o)} />
      ))}
    </svg>
  );
}
