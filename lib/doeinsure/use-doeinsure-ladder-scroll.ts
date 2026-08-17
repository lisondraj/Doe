"use client";

import { useEffect, useRef, useState } from "react";

import {
  DOEINSURE_SECTION_IN_VIEW_THRESHOLD,
  DOEINSURE_SECTION_ROOT_MARGIN,
} from "@/lib/doeinsure/use-doeinsure-section-reveal";

/**
 * Scroll-driven active rung for the stages ladder.
 * Only updates while the stages block is in the viewport.
 */
export function useDoeInsureLadderScroll(itemCount: number) {
  const ladderRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const ladder = ladderRef.current;
    if (!ladder) return undefined;

    const section = ladder.closest("section") ?? ladder;
    const thresholds = [0, DOEINSURE_SECTION_IN_VIEW_THRESHOLD];

    const obs = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting && entry.intersectionRatio >= DOEINSURE_SECTION_IN_VIEW_THRESHOLD);
      },
      { threshold: thresholds, rootMargin: DOEINSURE_SECTION_ROOT_MARGIN },
    );

    obs.observe(section);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const ladder = ladderRef.current;
    if (!ladder || itemCount <= 0 || !inView) return undefined;

    const rungs = Array.from(ladder.querySelectorAll<HTMLElement>(".doeinsure-rung"));
    if (!rungs.length) return undefined;

    const update = () => {
      const trigger = window.innerHeight * 0.42;
      let next = 0;
      for (let i = 0; i < rungs.length; i++) {
        const { top } = rungs[i].getBoundingClientRect();
        if (top <= trigger) next = i;
      }
      setActiveIndex(Math.min(itemCount - 1, next));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [inView, itemCount]);

  return { ladderRef, activeIndex, inView };
}
