"use client";

/**
 * The Doe sphere in its brown, drawn as dots on a turning globe, shaded like /demo's sphere: dots facing the viewer are
 * larger and darker. `speed` lets the loader spin it a little faster as it finishes. Holds still for reduced motion.
 */
import { useEffect, useRef } from "react";

const COUNT = 760;
const SMALL_COUNT = 260;
/** Seconds per full turn at speed 1. */
const TURN_SECONDS = 16;
/** Tilt toward the viewer, so the top cap shows. */
const TILT = 0.38;

/** Evenly spread points on a unit sphere (golden-angle spiral). */
function lattice(n: number): [number, number, number][] {
  const golden = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: n }, (_, i) => {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    return [Math.cos(golden * i) * r, y, Math.sin(golden * i) * r];
  });
}

export function IndexConvertSphere({ size, color = "#B99A72", speed = 1, className }: { size: number; color?: string; speed?: number; className?: string }) {
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
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = color;

    const small = size < 120;
    const points = lattice(small ? SMALL_COUNT : COUNT);
    const radius = size * 0.46;
    const c = size / 2;
    const ct = Math.cos(TILT);
    const st = Math.sin(TILT);
    const dot = small ? size / 110 : size / 160;
    let angle = 0;

    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      const ca = Math.cos(angle);
      const sa = Math.sin(angle);
      for (const [x, y, z] of points) {
        const x1 = x * ca + z * sa;
        const z1 = -x * sa + z * ca;
        const y2 = y * ct - z1 * st;
        const z2 = y * st + z1 * ct;
        const depth = (z2 + 1) / 2;
        ctx.globalAlpha = 0.12 + 0.78 * Math.pow(depth, 1.6);
        ctx.beginPath();
        ctx.arc(c + x1 * radius, c + y2 * radius, (0.5 + 1.9 * depth) * dot, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      angle = 0.8;
      draw();
      return;
    }

    let last = performance.now();
    let frame = 0;
    const loop = (now: number) => {
      // The first frame's timestamp can land just before `last`.
      const dt = Math.max(0, Math.min(64, now - last)) / 1000;
      last = now;
      angle += ((Math.PI * 2) / TURN_SECONDS) * dt * speedRef.current;
      draw();
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [size, color]);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} style={{ width: size, height: size, display: "block" }} />;
}
