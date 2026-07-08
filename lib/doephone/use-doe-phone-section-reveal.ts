"use client";

import { useEffect, useRef, useState } from "react";

/** Scroll-triggered reveal for /doephone section 2 — title → carousel → menu. */
export function useDoePhoneSectionReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setRevealed(true);
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, revealed };
}

export function doePhoneSectionRevealSegmentClass(
  segment: "title" | "carousel" | "menu" | "badge" | "input" | "agents-orbs" | "agents-label" | "agents-nav",
  revealed: boolean,
) {
  return [
    "doephone-section-reveal",
    `doephone-section-reveal--${segment}`,
    revealed ? "doephone-section-reveal--in" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

/** Scroll/load reveal with optional hover lift — orbs, labels, chevrons. */
export function doePhoneRevealLiftClass(revealed: boolean, hoverable = true) {
  return [
    "doephone-reveal-lift",
    hoverable ? "doephone-reveal-lift--hoverable" : "",
    revealed ? "doephone-reveal-lift--in" : "",
  ]
    .filter(Boolean)
    .join(" ");
}
