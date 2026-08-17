"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scroll-driven active rung for the stages ladder.
 * The blue fill starts on Idea and moves down one level at a time as the
 * user scrolls, stopping on Growth (last item).
 */
export function useDoeInsureLadderScroll(itemCount: number) {
  const ladderRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const ladder = ladderRef.current;
    if (!ladder || itemCount <= 0) return undefined;

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
  }, [itemCount]);

  return { ladderRef, activeIndex };
}
