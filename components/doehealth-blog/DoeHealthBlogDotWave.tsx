"use client";

import { useEffect, useRef } from "react";

/** Same grid as video1's DotWave (Video 2): 150 columns by 34 rows, rolling sine wave. */
const COLS = 150;
const ROWS = 34;
/** The video's frame width; dot size and wave height scale from it. */
const REF_W = 1920;

/**
 * Halftone dot wave from video1 Video 2, drawn live on a canvas that fills its box. It rolls over time
 * and holds still for reduced motion.
 */
export function DoeHealthBlogDotWave({
  color,
  top = 0.44,
  amp = 70,
  fade = 0,
  motion = true,
}: {
  color: string;
  top?: number;
  amp?: number;
  fade?: number;
  /** false holds the wave on one still frame — same path reduced-motion already takes. */
  motion?: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduce = !motion || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
      const k = w / REF_W;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = color;
      for (let j = 0; j < ROWS; j++) {
        const v = j / (ROWS - 1);
        const s = 0.35 + 0.65 * Math.pow(v, 1.2);
        const baseY = h * top + Math.pow(v, 1.3) * h * 0.64;
        const rowFade = Math.min(1, Math.pow(v / 0.4, 1.2));
        for (let i = 0; i < COLS; i++) {
          const x0 = -240 * k + (i / (COLS - 1)) * (w + 480 * k);
          const x = w / 2 + (x0 - w / 2) * (0.92 + 0.16 * v);
          const z = 0.6 * Math.sin(x0 / (210 * k) + 0.6 + t * 0.8) + 0.4 * Math.sin(x0 / (120 * k) - baseY / (80 * k) + 1.2 + t * 1.3) + 0.3 * Math.sin(x0 / (330 * k) + baseY / (150 * k) + t * 0.45);
          const hh = Math.min(1, Math.max(0, (z + 1.3) / 2.6));
          const y = baseY - z * amp * k * s;
          const edgeFade = fade > 0 ? Math.min(1, Math.max(0, y / (h * fade))) : 1;
          ctx.globalAlpha = Math.min(0.85, (0.28 + 0.6 * hh) * (0.5 + 0.5 * s)) * rowFade * edgeFade;
          ctx.beginPath();
          ctx.arc(x, y, (0.9 + 2.2 * s) * (0.7 + 0.5 * hh) * Math.max(1, k * 2.2), 0, Math.PI * 2);
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
  }, [color, top, amp, fade, motion]);

  return <canvas ref={ref} className="doehealth-blog-dotwave" aria-hidden />;
}
