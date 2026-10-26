"use client";

import { useEffect, useRef } from "react";

/**
 * A halftone field that fills its whole box: two slow ripples spread in from points just past one edge,
 * and where they meet the dots swell into drifting contour bands. `from="right"` thins the field out
 * toward the left (behind the Index); `from="top"` thins it out downward (a band across a tab's top).
 * Drawn live on a canvas; holds still for reduced motion and off screen.
 */
export function DoeHealthProductDotField({ color, step = 13, maxDot = 3.4, from = "right" }: { color: string; step?: number; maxDot?: number; from?: "right" | "top" }) {
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

    const paint = (now: number) => {
      if (w === 0 || h === 0) return;
      const t = (now - start) / 1000;
      // The two sources drift slowly along, just past the edge the field grows from.
      const top = from === "top";
      const ax = top ? w * (0.72 + 0.04 * Math.sin(t * 0.17)) : w + 60;
      const ay = top ? -70 : h * (0.28 + 0.06 * Math.sin(t * 0.17));
      const bx = top ? w * (0.2 + 0.04 * Math.cos(t * 0.13)) : w + 140;
      const by = top ? -150 : h * (0.82 + 0.05 * Math.cos(t * 0.13));
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = color;
      for (let y = step / 2; y < h; y += step) {
        for (let x = step / 2; x < w; x += step) {
          const reach = top ? Math.min(1, Math.max(0, 1 - y / h)) ** 1.3 : Math.min(1, Math.max(0, (x / w - 0.04) / 0.62)) ** 1.5;
          if (reach < 0.02) continue;
          const da = Math.hypot(x - ax, y - ay);
          const db = Math.hypot(x - bx, y - by);
          const c = (Math.sin(da / 46 - t * 0.55) + Math.sin(db / 64 - t * 0.4)) / 2;
          const v = ((c + 1) / 2) ** 2.2;
          const r = maxDot * v * reach;
          if (r < 0.3) continue;
          ctx.globalAlpha = 0.35 + 0.65 * v;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    let raf = 0;
    let onScreen = false;
    const loop = (now: number) => {
      paint(now);
      raf = requestAnimationFrame(loop);
    };
    const run = () => {
      const should = !reduce && onScreen;
      if (should && !raf) raf = requestAnimationFrame(loop);
      if (!should && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    size();
    paint(start);
    const resize = new ResizeObserver(() => {
      size();
      paint(performance.now());
    });
    resize.observe(canvas);
    const visibility = new IntersectionObserver(([entry]) => {
      onScreen = !!entry?.isIntersecting;
      run();
    });
    visibility.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
      visibility.disconnect();
    };
  }, [color, step, maxDot, from]);

  return <canvas ref={ref} aria-hidden />;
}

/** The dot field as a band across the top of a tab, behind its content. The tab root needs `relative isolate`. */
export function DoeHealthProductDotBand({ height }: { height: number }) {
  return (
    <div
      className="absolute left-[0px] right-[0px] top-[0px] -z-10 pointer-events-none [&_canvas]:absolute [&_canvas]:inset-0 [&_canvas]:h-full [&_canvas]:w-full"
      style={{ height }}
      aria-hidden
    >
      <DoeHealthProductDotField color="rgba(232, 165, 133, 0.42)" from="top" />
    </div>
  );
}
