"use client";

import { useEffect, useRef, useState } from "react";

/** Min visible ratio before a section counts as "arrived". */
export const DOEINSURE_SECTION_IN_VIEW_THRESHOLD = 0.28;

/** Pause after scroll-in before section demos / motion sequences start. */
export const DOEINSURE_SECTION_MOTION_DELAY_MS = 520;

/** Section must sit in the upper viewport — not just peeking at the bottom edge. */
export const DOEINSURE_SECTION_ROOT_MARGIN = "0px 0px -18% 0px";

export type DoeInsureSectionRevealOptions = {
  threshold?: number;
  rootMargin?: string;
  motionDelayMs?: number;
};

/**
 * Scroll-triggered reveal for /doeinsure sections.
 * Motions only arm once the section is actually in view, after a short delay.
 * Leaving the section resets so demos do not run off-screen.
 */
export function useDoeInsureSectionReveal(options: DoeInsureSectionRevealOptions = {}) {
  const {
    threshold = DOEINSURE_SECTION_IN_VIEW_THRESHOLD,
    rootMargin = DOEINSURE_SECTION_ROOT_MARGIN,
    motionDelayMs = DOEINSURE_SECTION_MOTION_DELAY_MS,
  } = options;

  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setInView(true);
      setRevealed(true);
      return;
    }

    const thresholds = Array.from(new Set([0, threshold, Math.min(1, threshold + 0.12)])).sort(
      (a, b) => a - b,
    );

    const obs = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting && entry.intersectionRatio >= threshold);
      },
      { threshold: thresholds, rootMargin },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [rootMargin, threshold]);

  useEffect(() => {
    if (!inView) {
      setRevealed(false);
      return undefined;
    }

    const id = window.setTimeout(() => setRevealed(true), motionDelayMs);
    return () => window.clearTimeout(id);
  }, [inView, motionDelayMs]);

  return { ref, revealed, inView };
}
