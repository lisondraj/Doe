"use client";

import { useEffect, useRef } from "react";

/** Width the tide's step and reach are authored at (video1 Video 3 is 1920 wide; these are tuned to a desktop section). */
const REF_W = 1440;
/** How far past the viewport (px) the live tide still draws its rows, so a fast scroll never outruns it. */
const WINDOW_MARGIN = 320;

/**
 * Dense halftone tides banked against both side edges, from video1 Video 3 (payments). Their wavy inner
 * edges roll slowly down the frame. Drawn live on a canvas that fills its box; holds still for reduced motion.
 */
export function DoeHealthDesk2DotTide({
  color,
  step = 12,
  reach = 420,
  active = true,
}: {
  color: string;
  step?: number;
  reach?: number;
  /** false pauses the tides on their current frame, as for a canvas in a hidden screen. */
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

    // The canvas can be far taller than the screen. `windowed` draws only the rows within a screen (plus a margin) of
    // the viewport, on the same row grid, so what is on screen is identical and the rest is not drawn.
    // Where the canvas sits in the viewport. It only moves when the page scrolls (or by small transitions the margin
    // absorbs), so the rect is read again when the scroll position has changed and now and then otherwise, instead of
    // forcing a style pass on every frame of a section that holds still.
    let rectTop = 0;
    let measuredAt = -1;
    let measuredScroll = NaN;
    const paint = (now: number, windowed = false, frame = 0) => {
      if (w === 0 || h === 0) return;
      let from = 0;
      let to = h;
      if (windowed) {
        if (measuredAt < 0 || window.scrollY !== measuredScroll || frame - measuredAt >= 45) {
          rectTop = canvas.getBoundingClientRect().top;
          measuredScroll = window.scrollY;
          measuredAt = frame;
        }
        from = -rectTop - WINDOW_MARGIN;
        to = window.innerHeight - rectTop + WINDOW_MARGIN;
      }
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
        const first = st / 2 + Math.max(0, Math.floor((from - st / 2) / st)) * st;
        for (let y = first; y < h && y < to; y += st) {
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

    // Only animates while it can be seen: on screen (with a margin) and `active`. Otherwise it holds its last frame,
    // so a canvas nobody is looking at costs nothing per frame.
    // `onScreen` is "within 200px of the screen" (so the first frame in view is already fresh); `inView` is strictly on
    // screen. A canvas that is only nearby, like one that ends where a pinned section begins, repaints every sixth frame
    // instead of every frame: it stays current without a full-size repaint per frame for something nobody can see.
    let raf = 0;
    let onScreen = false;
    let inView = false;
    let frame = 0;
    const loop = (now: number) => {
      if (inView || frame % 6 === 0) paint(now, true, frame);
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
        if (inView && raf) {
          measuredAt = -1;
          paint(performance.now(), true);
        }
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
  }, [color, step, reach]);

  return <canvas ref={ref} className="doehealth-desk2-tide" aria-hidden />;
}
