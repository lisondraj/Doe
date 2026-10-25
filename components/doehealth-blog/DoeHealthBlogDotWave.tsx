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
  phase = 0,
  scale = 1,
  slant = 0,
  flip = false,
  motion = true,
  active = true,
}: {
  color: string;
  top?: number;
  amp?: number;
  fade?: number;
  /** Shifts where the wave crests along the width. 0 is the default wave. */
  phase?: number;
  /** Horizontal wavelength multiplier. 1 is the default wave. */
  scale?: number;
  /** Leans the wave into diagonals: positive leans one way, negative the other. 0 is the default wave. */
  slant?: number;
  /** Turns crests into troughs. false is the default wave. */
  flip?: boolean;
  /** false holds the wave on one still frame — same path reduced-motion already takes. */
  motion?: boolean;
  /** false pauses the wave on its current frame, as for a canvas in a hidden screen. */
  active?: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  const runRef = useRef<() => void>(() => {});

  useEffect(() => {
    activeRef.current = active;
    runRef.current();
  }, [active]);

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
      // Capped at 2: a 3× phone screen paints more than twice the pixels for dots no one can tell apart.
      const dpr = Math.min(2, window.devicePixelRatio || 1);
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
          const xs = x0 + slant * baseY;
          const z = 0.6 * Math.sin(xs / (210 * k * scale) + 0.6 + phase + t * 0.8) + 0.4 * Math.sin(xs / (120 * k * scale) - baseY / (80 * k) + 1.2 + phase * 0.7 + t * 1.3) + 0.3 * Math.sin(xs / (330 * k * scale) + baseY / (150 * k) + phase * 1.3 + t * 0.45);
          const hh = Math.min(1, Math.max(0, (z + 1.3) / 2.6));
          const y = baseY - (flip ? -1 : 1) * z * amp * k * s;
          const edgeFade = fade > 0 ? Math.min(1, Math.max(0, y / (h * fade))) : 1;
          ctx.globalAlpha = Math.min(0.85, (0.28 + 0.6 * hh) * (0.5 + 0.5 * s)) * rowFade * edgeFade;
          ctx.beginPath();
          ctx.arc(x, y, (0.9 + 2.2 * s) * (0.7 + 0.5 * hh) * Math.max(1, k * 2.2), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    // Only animates while it can be seen: on screen (with a margin) and `active`. Otherwise it holds its last frame,
    // so a canvas nobody is looking at costs nothing per frame.
    // `onScreen` is "within 200px of the screen" (so the first frame in view is already fresh); `inView` is strictly on
    // screen. A canvas that is only nearby, like one that ends where a pinned section begins, repaints every sixth frame
    // instead of every frame: it stays current without a full-size repaint per frame for something nobody can see.
    let raf = 0;
    let onScreen = false;
    let inView = false;
    let frame = 0;
    // Touch screens (phones) roll the wave at 30 fps; it is slow enough that the halved rate doesn't show.
    const every = window.matchMedia("(pointer: coarse)").matches ? 2 : 1;
    const loop = (now: number) => {
      if (inView ? frame % every === 0 : frame % 6 === 0) paint(now);
      frame++;
      raf = requestAnimationFrame(loop);
    };
    const run = () => {
      const should = !reduce && onScreen && activeRef.current;
      if (should && !raf) raf = requestAnimationFrame(loop);
      if (!should && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };
    runRef.current = run;

    size();
    paint(start);
    const observer = new ResizeObserver(() => {
      size();
      paint(performance.now());
    });
    observer.observe(canvas);
    const visibility = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        run();
      },
      { rootMargin: "200px 0px" },
    );
    visibility.observe(canvas);
    // Shrunk by a pixel, so a canvas that only touches the screen's edge does not count as in view.
    const strict = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView && raf) paint(performance.now());
      },
      { rootMargin: "-1px 0px" },
    );
    strict.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      runRef.current = () => {};
      observer.disconnect();
      visibility.disconnect();
      strict.disconnect();
    };
  }, [color, top, amp, fade, phase, scale, slant, flip, motion]);

  return <canvas ref={ref} className="doehealth-blog-dotwave" aria-hidden />;
}
