"use client";

import { useEffect, useRef } from "react";

import type { DoeHealthBlogDots } from "@/lib/doehealth/doehealth-blog-articles";

/** The video's frame width; dot size scales from it so a small box keeps fine dots. */
const REF_W = 1920;

type Paint = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void;

function dotAlpha(h: number, s: number) {
  return Math.min(0.85, (0.28 + 0.6 * h) * (0.5 + 0.5 * s));
}

/** Halftone wave across the lower half, rolling sideways. */
const wave: Paint = (ctx, w, h, t) => {
  const k = w / REF_W;
  const cols = 150;
  const rows = 34;
  for (let j = 0; j < rows; j++) {
    const v = j / (rows - 1);
    const s = 0.35 + 0.65 * Math.pow(v, 1.2);
    const baseY = h * 0.5 + Math.pow(v, 1.3) * h * 0.6;
    const rowFade = Math.min(1, Math.pow(v / 0.4, 1.2));
    for (let i = 0; i < cols; i++) {
      const x0 = -240 * k + (i / (cols - 1)) * (w + 480 * k);
      const x = w / 2 + (x0 - w / 2) * (0.92 + 0.16 * v);
      const z = 0.6 * Math.sin(x0 / (210 * k) + 0.6 + t * 0.8) + 0.4 * Math.sin(x0 / (120 * k) - baseY / (80 * k) + 1.2 + t * 1.3) + 0.3 * Math.sin(x0 / (330 * k) + baseY / (150 * k) + t * 0.45);
      const hh = Math.min(1, Math.max(0, (z + 1.3) / 2.6));
      const y = baseY - z * 70 * k * s;
      ctx.globalAlpha = dotAlpha(hh, s) * rowFade;
      ctx.beginPath();
      ctx.arc(x, y, (0.9 + 2.2 * s) * (0.7 + 0.5 * hh) * Math.max(1, k * 2.2), 0, Math.PI * 2);
      ctx.fill();
    }
  }
};

/** Dense tides banked against both side edges; their wavy inner edges roll slowly down the box. */
const tide: Paint = (ctx, w, h, t) => {
  const k = Math.max(0.5, w / REF_W);
  const step = 12 * k * 1.4;
  const reach = w * 0.2;
  for (const side of [0, 1]) {
    const phase = side * 2.4;
    const dir = side ? -1 : 1;
    for (let y = step / 2; y < h; y += step) {
      const edge = reach + w * 0.04 * Math.sin(y / (230 * k) - dir * t * 0.5 + phase) + w * 0.018 * Math.sin(y / (97 * k) + dir * t * 0.8 + 1.3 + phase);
      for (let d = step / 2; d < edge + step * 3; d += step) {
        const v = Math.min(1, Math.max(0, 1 - d / edge)) ** 1.2;
        if (v < 0.02) continue;
        const hh = 0.5 + 0.5 * Math.sin(y / (60 * k) - d / (90 * k) - dir * t * 1.2 + phase);
        ctx.globalAlpha = dotAlpha(hh, v) * Math.min(1, v * 3);
        ctx.beginPath();
        ctx.arc(side ? w - d : d, y, (0.9 + 2.2 * v) * (0.7 + 0.5 * hh) * Math.min(1, 0.4 + v) * k * 1.3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
};

/** A square halftone grid that thickens toward two opposite corners, breathing slowly. */
const halftone: Paint = (ctx, w, h, t) => {
  const step = Math.max(9, w / 90);
  const diag = Math.hypot(w, h);
  for (let y = step / 2; y < h; y += step) {
    for (let x = step / 2; x < w; x += step) {
      const a = Math.hypot(x, y) / diag;
      const b = Math.hypot(w - x, h - y) / diag;
      const near = Math.max(0, 1 - Math.min(a, b) / 0.42);
      const breathe = 0.5 + 0.5 * Math.sin(t * 0.9 - (x + y) / (step * 14));
      const v = near * (0.75 + 0.25 * breathe);
      if (v < 0.04) continue;
      ctx.globalAlpha = Math.min(0.8, 0.2 + 0.6 * v);
      ctx.beginPath();
      ctx.arc(x, y, step * 0.36 * Math.pow(v, 0.8), 0, Math.PI * 2);
      ctx.fill();
    }
  }
};

/** A curtain of dots hung down the right edge, its inner edge swaying. */
const curtain: Paint = (ctx, w, h, t) => {
  const k = Math.max(0.5, w / REF_W);
  const cols = 34;
  const rows = 90;
  const span = w * 0.36;
  for (let i = 0; i < cols; i++) {
    const u = i / (cols - 1);
    const s = 0.35 + 0.65 * Math.pow(u, 1.2);
    const colFade = Math.min(1, Math.pow(u / 0.4, 1.2));
    const baseX = w - span + Math.pow(u, 1.3) * span;
    for (let j = 0; j < rows; j++) {
      const y0 = -40 + (j / (rows - 1)) * (h + 80);
      const z = 0.6 * Math.sin(y0 / (160 * k) + 0.6 + t * 0.8) + 0.4 * Math.sin(y0 / (90 * k) - baseX / (80 * k) + 1.2 + t * 1.3);
      const hh = Math.min(1, Math.max(0, (z + 1.1) / 2.2));
      const x = baseX - z * 40 * k * s;
      ctx.globalAlpha = dotAlpha(hh, s) * colFade;
      ctx.beginPath();
      ctx.arc(x, y0, (0.9 + 2.2 * s) * (0.7 + 0.5 * hh) * k * 1.3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
};

/** Dotted rings expanding slowly from below the centre. */
const rings: Paint = (ctx, w, h, t) => {
  const cx = w / 2;
  const cy = h * 0.55;
  const gap = Math.max(22, w / 26);
  const count = 18;
  const span = gap * count;
  for (let i = 0; i < count; i++) {
    const r = (i * gap + t * gap * 0.35) % span;
    if (r < 6) continue;
    const fade = Math.pow(1 - r / span, 0.7) * Math.min(1, r / (gap * 1.5));
    const n = Math.max(12, Math.round((2 * Math.PI * r) / Math.max(8, w / 110)));
    ctx.globalAlpha = 0.9 * fade;
    for (let p = 0; p < n; p++) {
      const a = (p / n) * Math.PI * 2 + i * 0.3;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, Math.max(1.4, w / 520), 0, Math.PI * 2);
      ctx.fill();
    }
  }
};

const SPHERE_COUNT = 1200;
let spherePts: Float32Array | null = null;

function sphere() {
  if (spherePts) return spherePts;
  spherePts = new Float32Array(SPHERE_COUNT * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < SPHERE_COUNT; i++) {
    const y = 1 - (i / (SPHERE_COUNT - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    spherePts[i * 3] = Math.cos(golden * i) * r;
    spherePts[i * 3 + 1] = y;
    spherePts[i * 3 + 2] = Math.sin(golden * i) * r;
  }
  return spherePts;
}

/** A slowly turning sphere of dots, half-set into the bottom-right corner. */
const sphereField: Paint = (ctx, w, h, t) => {
  const pts = sphere();
  const radius = Math.max(w, h) * 0.42;
  const cx = w * 0.86;
  const cy = h * 0.9;
  const a = t * 0.18;
  const ca = Math.cos(a);
  const sa = Math.sin(a);
  const ct = Math.cos(0.42);
  const st = Math.sin(0.42);
  const dot = Math.max(0.7, w / 1100);
  for (let i = 0; i < SPHERE_COUNT; i++) {
    const x = pts[i * 3];
    const y = pts[i * 3 + 1];
    const z = pts[i * 3 + 2];
    const x1 = x * ca + z * sa;
    const z1 = -x * sa + z * ca;
    const y2 = y * ct - z1 * st;
    const z2 = y * st + z1 * ct;
    const depth = (z2 + 1) / 2;
    ctx.globalAlpha = 0.1 + 0.62 * Math.pow(depth, 1.5);
    ctx.beginPath();
    ctx.arc(cx + x1 * radius, cy + y2 * radius, (0.9 + 2.1 * depth) * dot, 0, Math.PI * 2);
    ctx.fill();
  }
};

const PAINTS: Record<DoeHealthBlogDots, Paint> = { wave, tide, halftone, curtain, rings, sphere: sphereField };

/**
 * One of the video1 dot designs, drawn live on a canvas that fills its box. It runs only while the box is on screen
 * and holds one still frame for reduced motion.
 */
export function DoeHealthBlogDotField({ dots, color }: { dots: DoeHealthBlogDots; color: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const paint = PAINTS[dots];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = false;

    const draw = (now: number) => {
      if (w === 0 || h === 0) return;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = color;
      paint(ctx, w, h, (now - start) / 1000);
      ctx.globalAlpha = 1;
    };
    const loop = (now: number) => {
      draw(now);
      raf = requestAnimationFrame(loop);
    };
    const size = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(performance.now());
    };

    size();
    const resize = new ResizeObserver(size);
    resize.observe(canvas);
    const seen = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible && !reduce) raf = requestAnimationFrame(loop);
    });
    seen.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
      seen.disconnect();
    };
  }, [dots, color]);

  return <canvas ref={ref} className="doehealth-blog-dotwave" aria-hidden />;
}
