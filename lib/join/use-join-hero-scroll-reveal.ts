"use client";

import { useEffect, useRef, useState } from "react";

export const JOIN_HERO_BOX_INITIAL_DELAY_MS = 220;
export const JOIN_HERO_BOX_REVEAL_STAGGER_MS = 145;
export const JOIN_HERO_BOX_RISE_DURATION_MS = 780;
export const JOIN_HERO_BOX_SEQUENCE_GAP_MS = 260;

export function joinHeroBoxRevealClass(revealed: boolean) {
  return `join-hero-box-reveal${revealed ? " join-hero-box-reveal--in" : ""}`;
}

export function joinHeroBoxRevealDelay(revealed: boolean, index: number, baseDelayMs = 0) {
  if (!revealed) return undefined;
  return `${JOIN_HERO_BOX_INITIAL_DELAY_MS + baseDelayMs + index * JOIN_HERO_BOX_REVEAL_STAGGER_MS}ms`;
}

/** Scroll-triggered reveal for join hero decorative boxes (glass cards, orbit boxes). */
export function useJoinHeroScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, revealed };
}
