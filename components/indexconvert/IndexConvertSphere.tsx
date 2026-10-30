"use client";

/**
 * The Doe dot sphere, turning. Same look as DoeHealthProductSphere (brown dots that swell and darken toward the
 * lower right) but drawn as real points on a globe so it can spin smoothly instead of rotating a flat picture.
 */
import { type CSSProperties, useEffect, useRef } from "react";

const DOTS = 900;
/** Seconds per full turn. */
const TURN_SECONDS = 14;
/** Dots swell and darken toward this direction (lower right, facing out), as in the Paper sphere. */
const LIGHT = normalize([0.55, 0.62, 0.56]);

function normalize([x, y, z]: number[]): [number, number, number] {
  const l = Math.hypot(x, y, z);
  return [x / l, y / l, z / l];
}

/** Evenly spread points on a unit sphere (Fibonacci lattice). */
function lattice(n: number): [number, number, number][] {
  const golden = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: n }, (_, i) => {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const t = golden * i;
    return [Math.cos(t) * r, y, Math.sin(t) * r];
  });
}

export function IndexConvertSphere({
  size,
  color = "#B99A72",
  speed = 1,
  className,
  style,
}: {
  size: number;
  color?: string;
  /** Multiplies the spin; the loader speeds it up as it finishes. */
  speed?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const speedRef = useRef(speed);
  speedRef.current = speed;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const points = lattice(DOTS);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tilt = -0.32;
    const cosT = Math.cos(tilt);
    const sinT = Math.sin(tilt);
    const radius = size * 0.46;
    const unit = size / 170;
    let angle = 0;
    let last = performance.now();
    let frame = 0;

    const draw = (now: number) => {
      const dt = Math.max(0, Math.min(64, now - last)) / 1000;
      last = now;
      if (!reduced) angle += ((Math.PI * 2) / TURN_SECONDS) * dt * speedRef.current;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      ctx.clearRect(0, 0, size, size);
      ctx.fillStyle = color;
      for (const [px, py, pz] of points) {
        // Spin about the vertical axis, then tilt the globe toward the viewer.
        const x1 = px * cosA + pz * sinA;
        const z1 = -px * sinA + pz * cosA;
        const y2 = py * cosT - z1 * sinT;
        const z2 = py * sinT + z1 * cosT;
        if (z2 < -0.15) continue;
        // Screen y runs down, so the light's y is flipped to sit on the lower right.
        const lit = Math.max(0, x1 * LIGHT[0] - y2 * LIGHT[1] + z2 * LIGHT[2]);
        const front = Math.max(0, z2);
        const alpha = 0.22 + 0.78 * lit * (0.4 + 0.6 * front);
        const r = unit * (0.5 + 1.9 * lit * (0.4 + 0.6 * front));
        ctx.globalAlpha = Math.min(1, alpha);
        ctx.beginPath();
        ctx.arc(size / 2 + x1 * radius, size / 2 - y2 * radius, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [size, color]);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} style={{ width: size, height: size, display: "block", ...style }} />;
}
