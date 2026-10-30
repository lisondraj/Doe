"use client";

import { useEffect, useRef } from "react";

/** Dots on a full-size sphere; small spheres use fewer, so each dot stays visible. */
const COUNT = 900;
const SMALL_COUNT = 240;
/** Radians per second around the vertical axis; one turn takes about 50 s. */
const SPIN = 0.125;
/** Tilt toward the viewer, so the top cap shows. */
const TILT = 0.38;

const cache = new Map<number, Float32Array>();

/** Evenly spread points on a unit sphere (golden-angle spiral). */
function spherePoints(count: number) {
  const hit = cache.get(count);
  if (hit) return hit;
  const points = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    points[i * 3] = Math.cos(golden * i) * r;
    points[i * 3 + 1] = y;
    points[i * 3 + 2] = Math.sin(golden * i) * r;
  }
  cache.set(count, points);
  return points;
}

/**
 * The Doe sphere in its brown, drawn as dots that turn slowly. Dots facing the viewer are larger and darker,
 * like the /doehealthproduct sphere. It holds still for reduced motion and pauses off screen.
 */
export function DemoSphere({ size, color = "#B99A72", className }: { size: number; color?: string; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = color;

    const count = size < 140 ? SMALL_COUNT : COUNT;
    const pts = spherePoints(count);
    const radius = size * 0.46;
    const c = size / 2;
    const ct = Math.cos(TILT);
    const st = Math.sin(TILT);
    const dot = size < 140 ? size / 110 : size / 300;

    const draw = (t: number) => {
      ctx.clearRect(0, 0, size, size);
      const a = t * SPIN;
      const ca = Math.cos(a);
      const sa = Math.sin(a);
      for (let i = 0; i < count; i++) {
        const x = pts[i * 3];
        const y = pts[i * 3 + 1];
        const z = pts[i * 3 + 2];
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
      draw(2);
      return;
    }

    let raf = 0;
    let visible = true;
    const start = performance.now();
    const loop = () => {
      if (visible) draw((performance.now() - start) / 1000);
      raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
    });
    io.observe(canvas);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [size, color]);

  return <canvas ref={ref} className={className} style={{ width: size, height: size }} aria-hidden="true" />;
}
