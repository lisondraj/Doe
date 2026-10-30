"use client";

import { useEffect, useRef } from "react";

const ROWS = 34;
/** The frame width the wave's height is drawn for; it scales from it. */
const REF_W = 1920;
/** Where the first row of dots sits and how far down the rows run, as shares of the screen's height: on the bottom edge. */
const TOP = 0.6;
const SPAN = 0.46;
/** Share of the rows over which the top of the wave fades in. */
const FADE = 0.35;
/** Column spacing, from the width, so the wave always runs the whole width at the same zoom. */
const spacing = (w: number) => Math.min(18, Math.max(9, w / 150));

/**
 * A still halftone dot wave along the bottom edge, across the whole width. `phase` slides the wave sideways, so a
 * second screen's dots sit offset from the first's; `shift` offsets the columns by that share of a column. `top` is
 * where the first row sits, as a share of the screen, and `fade` is how far down the rows stay soft.
 */
export function PitchDesignsWave({
  color,
  phase = 0,
  shift = 0,
  top = TOP,
  fade = FADE,
}: {
  color: string;
  phase?: number;
  shift?: number;
  top?: number;
  fade?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return undefined;
    let w = 0;
    let h = 0;

    const paint = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = r.width;
      h = r.height;
      if (w === 0 || h === 0) return;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const k = Math.max(0.55, w / REF_W);
      const amp = 70 * k;
      const sp = spacing(w);
      const cols = Math.ceil((w + 600 * k) / sp) + 1;
      ctx.fillStyle = color;
      for (let j = 0; j < ROWS; j++) {
        const v = j / (ROWS - 1);
        const s = 0.35 + 0.65 * Math.pow(v, 1.15);
        const baseY = h * top + Math.pow(v, 1.25) * h * SPAN;
        const rowFade = Math.min(1, Math.pow(v / fade, 1.45));
        for (let i = 0; i < cols; i++) {
          const x0 = -300 * k + ((i + shift) / (cols - 1)) * (w + 600 * k);
          const x = w / 2 + (x0 - w / 2) * (0.9 + 0.2 * v);
          const z = 0.6 * Math.sin(x0 / (260 * k) + 0.6 + phase) + 0.4 * Math.sin(x0 / (150 * k) - baseY / (100 * k) + 1.2 + phase * 0.7) + 0.3 * Math.sin(x0 / (400 * k) + baseY / (180 * k) + phase * 1.3);
          const hh = Math.min(1, Math.max(0, (z + 1.3) / 2.6));
          const y = baseY - z * amp * s;
          ctx.globalAlpha = Math.min(0.9, (0.3 + 0.6 * hh) * (0.55 + 0.45 * s)) * rowFade;
          ctx.beginPath();
          ctx.arc(x, y, sp * (0.1 + 0.26 * s) * (0.75 + 0.4 * hh), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    paint();
    const observer = new ResizeObserver(paint);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [color, fade, phase, shift, top]);

  return <canvas ref={ref} aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} />;
}
