"use client";

import { useEffect, useRef } from "react";

/* ─── Wave math ───────────────────────────────────────────────────────────── */

const GRID    = 22;
const MAX_R   = 2.5;
const MIN_R   = 0.6;
const MAX_OPA = 0.20;
const MIN_OPA = 0.04;
const BASE_VEL = 0.32; // fast enough to clearly see motion

function waveAmp(wx: number, wy: number, phX: number, phY: number): number {
  const p1 = (wx + phX) * 0.007  + (wy + phY) * 0.013;
  const p2 = (wx + phX) * 0.0135 - (wy + phY) * 0.006;
  const a  = (Math.cos(p1) + 1) * 0.5;
  const b  = (Math.cos(p2 * 1.35 + 0.6) + 1) * 0.5;
  const c  = (Math.cos(p1 * 2.1 + p2 * 0.8 - 0.4) + 1) * 0.5;
  return 0.25 + (a * 0.52 + b * 0.3 + c * 0.18) * 0.75;
}

function displace(wx: number, wy: number, phX: number, phY: number): [number, number] {
  const q1 = (wx + phX * 0.4) * 0.0095 + (wy + phY * 0.4) * 0.0105;
  const q2 = (wx + phX * 0.4) * 0.0125 - (wy + phY * 0.4) * 0.008;
  const D  = 4.5;
  return [
    Math.sin(q2 * 1.7 + 0.5) * D + Math.sin(q1 * 0.9 - 0.3) * D * 0.45,
    Math.cos(q1 * 1.5 - 0.4) * D + Math.cos(q2 * 1.1 + 0.8) * D * 0.4,
  ];
}

/* ─── Component ───────────────────────────────────────────────────────────── */

export function DotWaveCanvas({
  dotRgb = "255, 255, 255",
  className = "",
}: {
  dotRgb?:   string;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0, dpr = 1, raf = 0, lastT = 0;
    const ph    = { x: 0, y: 0 };
    const phVel = { x: BASE_VEL, y: BASE_VEL * 0.65 };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      // Use window dimensions — this canvas always fills the viewport section
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width  = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width  = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const frame = (t: number) => {
      const dt = Math.min((t - lastT) / 16.667, 3);
      lastT = t;

      ph.x += phVel.x * dt;
      ph.y += phVel.y * dt;

      ctx.clearRect(0, 0, W, H);

      for (let gi = -2; gi <= Math.ceil(W / GRID) + 2; gi++) {
        for (let gj = -2; gj <= Math.ceil(H / GRID) + 2; gj++) {
          const wx = gi * GRID;
          const wy = gj * GRID;
          const [ddx, ddy] = displace(wx, wy, ph.x, ph.y);
          const amp   = waveAmp(wx + ddx * 0.4, wy + ddy * 0.4, ph.x, ph.y);
          const r     = MIN_R + amp * (MAX_R - MIN_R);
          const alpha = MIN_OPA + amp * (MAX_OPA - MIN_OPA);
          ctx.beginPath();
          ctx.arc(wx + ddx, wy + ddy, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${dotRgb},${alpha.toFixed(3)})`;
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(frame);
    };

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame((t) => { lastT = t; raf = requestAnimationFrame(frame); });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [dotRgb]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none block ${className}`}
    />
  );
}
