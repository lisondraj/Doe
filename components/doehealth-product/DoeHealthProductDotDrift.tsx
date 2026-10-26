"use client";

import { useEffect, useRef } from "react";

/**
 * A calm halftone that fills its box: a fixed grid of small dots, none of which ever move. Two wide, soft regions
 * drift across it very slowly, about a minute a lap, and the dots under them swell a little, so the field breathes
 * without anything sliding. Drawn on a canvas a few times a second; holds still for reduced motion and off screen.
 */
export function DoeHealthProductDotDrift({ color, step = 16, maxDot = 2.6 }: { color: string; step?: number; maxDot?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

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

    /** How strongly a point sits under a soft region centred at (cx, cy), 0 to 1. */
    const glow = (x: number, y: number, cx: number, cy: number, r: number) => {
      const d = Math.hypot(x - cx, y - cy) / r;
      return d >= 1 ? 0 : (1 - d * d) * (1 - d * d);
    };

    const paint = (now: number) => {
      if (w === 0 || h === 0) return;
      const t = (now - start) / 1000;
      // Two regions on slow, different laps, so the pattern never visibly repeats.
      const a = { x: w * (0.5 + 0.32 * Math.sin(t / 9.5)), y: h * (0.3 + 0.18 * Math.cos(t / 12)), r: Math.max(w, h) * 0.55 };
      const b = { x: w * (0.5 + 0.3 * Math.cos(t / 11 + 2)), y: h * (0.72 + 0.16 * Math.sin(t / 8.5 + 1)), r: Math.max(w, h) * 0.45 };
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = color;
      for (let y = step / 2; y < h; y += step) {
        for (let x = step / 2; x < w; x += step) {
          const k = Math.min(1, glow(x, y, a.x, a.y, a.r) + glow(x, y, b.x, b.y, b.r));
          ctx.globalAlpha = 0.25 + 0.75 * k;
          ctx.beginPath();
          ctx.arc(x, y, 0.7 + (maxDot - 0.7) * k, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    // A few frames a second is plenty for motion this slow, and only while it can be seen.
    let timer = 0;
    let visible = false;
    const run = () => {
      window.clearInterval(timer);
      timer = 0;
      if (!reduce && visible) timer = window.setInterval(() => paint(performance.now()), 120);
    };

    size();
    paint(start);
    const resize = new ResizeObserver(() => {
      size();
      paint(performance.now());
    });
    resize.observe(canvas);
    const seen = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      run();
    });
    seen.observe(canvas);
    return () => {
      window.clearInterval(timer);
      resize.disconnect();
      seen.disconnect();
    };
  }, [color, step, maxDot]);

  return <canvas ref={ref} aria-hidden />;
}
