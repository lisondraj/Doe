"use client";

import { HERO_BACKDROP_GRADIENT, HERO_LINE_MESH_OVERLAY } from "@/lib/hero-backdrop";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";

function smoothstep01(t: number): number {
  const x = Math.min(Math.max(t, 0), 1);
  return x * x * (3 - 2 * x);
}

/** Map scroll progress into [0, 1] across [start, end]. */
function phaseProgress(scroll: number, start: number, end: number): number {
  if (end <= start) return scroll >= end ? 1 : 0;
  return smoothstep01((scroll - start) / (end - start));
}

/** Fade + lift tied 1:1 to scroll progress (smoothstep curve matches home section reveals). */
function scrollLayerStyle(progress: number, liftPx = 44): CSSProperties {
  const p = smoothstep01(progress);
  return {
    opacity: p,
    transform: `translate3d(0, ${(1 - p) * liftPx}px, 0)`,
    willChange: "opacity, transform",
  };
}

export default function DesignPage() {
  const scrollDriverRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useLayoutEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const driver = scrollDriverRef.current;
    if (!driver) return;

    let raf = 0;
    const measure = () => {
      raf = 0;
      const rect = driver.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrollable = Math.max(rect.height - vh, 1);
      const scrolled = Math.min(Math.max(-rect.top, 0), scrollable);
      setScrollProgress(scrolled / scrollable);
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const gradientProgress = reduceMotion ? 1 : phaseProgress(scrollProgress, 0, 0.42);
  const meshProgress = reduceMotion ? 1 : phaseProgress(scrollProgress, 0.32, 0.78);

  return (
    <div ref={scrollDriverRef} className="relative w-full" style={{ height: "220vh" }}>
      <main className="sticky top-0 h-[100dvh] min-h-[100dvh] w-full overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={
            reduceMotion
              ? { background: HERO_BACKDROP_GRADIENT }
              : { background: HERO_BACKDROP_GRADIENT, ...scrollLayerStyle(gradientProgress, 52) }
          }
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={
            reduceMotion
              ? HERO_LINE_MESH_OVERLAY
              : { ...HERO_LINE_MESH_OVERLAY, ...scrollLayerStyle(meshProgress, 36) }
          }
          aria-hidden
        />
      </main>
    </div>
  );
}
