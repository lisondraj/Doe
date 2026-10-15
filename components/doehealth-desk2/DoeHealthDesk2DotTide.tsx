"use client";

import { useEffect, useRef } from "react";

/** Width the tide's step and reach are authored at (video1 Video 3 is 1920 wide; these are tuned to a desktop section). */
const REF_W = 1440;

/**
 * Dense halftone tides banked against both side edges, from video1 Video 3 (payments). Their wavy inner
 * edges roll slowly down the frame. Drawn live on a canvas that fills its box; holds still for reduced motion.
 */
export function DoeHealthDesk2DotTide({ color, step = 12, reach = 420 }: { color: string; step?: number; reach?: number }) {
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
      // Scale with the box, but never so small that the dots pile up on a phone.
      const k = Math.min(1.3, Math.max(0.3, w / REF_W));
      // On a phone the tides sit behind the form, so they're smaller and reach less far (plus 10px, so
      // they still come in toward the middle while starting right at the screen edges).
      const narrow = w < 600;
      const st = Math.max(9, step * k);
      const rc = narrow ? reach * k * 0.6 + 10 : reach * k;
      const f = narrow ? 0.7 : (st / 12) * 1.8;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = color;
      for (const side of [0, 1]) {
        const phase = side * 2.4;
        const dir = side ? -1 : 1;
        for (let y = st / 2; y < h; y += st) {
          const edge = rc + 90 * k * Math.sin(y / (230 * k) - dir * t * 0.5 + phase) + 36 * k * Math.sin(y / (97 * k) + dir * t * 0.8 + 1.3 + phase);
          for (let d = st / 2; d < edge + 40 * k; d += st) {
            const v = Math.min(1, Math.max(0, 1 - d / edge)) ** 1.2;
            if (v < 0.02) continue;
            const hh = 0.5 + 0.5 * Math.sin(y / (60 * k) - d / (90 * k) - dir * t * 1.2 + phase);
            ctx.globalAlpha = Math.min(0.85, (0.28 + 0.6 * hh) * (0.5 + 0.5 * v)) * Math.min(1, v * 3);
            ctx.beginPath();
            ctx.arc(side ? w - d : d, y, (0.9 + 2.2 * v) * (0.7 + 0.5 * hh) * Math.min(1, 0.4 + v) * f, 0, Math.PI * 2);
            ctx.fill();
          }
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
  }, [color, step, reach]);

  return <canvas ref={ref} className="doehealth-desk2-tide" aria-hidden />;
}
