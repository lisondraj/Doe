import { useLayoutEffect, useRef } from "react";

import { lerp } from "../video1/motion";
import { C } from "../video1/theme";
import { NA, naCell } from "./na-dots";

export const NA_COLS = NA.grid[0].length;
export const NA_ROWS = NA.grid.length;

/** Every land dot, in grid order, tagged Canada (c) or U.S. (u). */
export const NA_DOTS = NA.grid.flatMap((row, r) => row.split("").flatMap((k, c) => (k === "." ? [] : [{ c, r, k: k as "c" | "u" }])));

/** A longitude and latitude on a map drawn at `cell` pixels per dot. */
export const naPoint = (lon: number, lat: number, cell: number) => {
  const { c, r } = naCell(lon, lat);
  return { x: (c + 0.5) * cell, y: (r + 0.5) * cell };
};

/**
 * Canada and the contiguous U.S. as a halftone of dots. `show(i)` (0 to 1) builds dot i into the faint ground,
 * so the outline can draw itself; `level(i)` inks it, for the clinics indexed so far.
 */
export function NaMap({ cell, level, show, frame }: { cell: number; level?: (i: number) => number; show?: (i: number) => number; frame: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const w = NA_COLS * cell;
  const h = NA_ROWS * cell;

  useLayoutEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const bw = Math.round(w * dpr * 2);
    const bh = Math.round(h * dpr * 2);
    if (canvas.width !== bw) canvas.width = bw;
    if (canvas.height !== bh) canvas.height = bh;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr * 2, 0, 0, dpr * 2, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = C.walnut;
    NA_DOTS.forEach((d, i) => {
      const base = show ? Math.min(1, Math.max(0, show(i))) : 1;
      if (base <= 0) return;
      const v = level ? Math.min(1, Math.max(0, level(i))) : 0;
      ctx.globalAlpha = lerp(d.k === "c" ? 0.34 : 0.24, 0.92, v) * base;
      ctx.beginPath();
      ctx.arc((d.c + 0.5) * cell, (d.r + 0.5) * cell, cell * lerp(0.24, 0.36, v) * lerp(0.4, 1, base), 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }, [frame, cell, level, show, w, h]);

  return <canvas ref={ref} style={{ position: "absolute", left: 0, top: 0, width: w, height: h }} />;
}
