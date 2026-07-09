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

    const reveal = () => {
      setRevealed(true);
      obs.disconnect();
    };

    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const rect = el.getBoundingClientRect();
    const visiblePx = Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0));
    const visibleRatio = visiblePx / Math.max(rect.height, 1);
    if (visibleRatio >= Math.min(threshold, 0.08)) {
      setRevealed(true);
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
        }
      },
      {
        threshold: [0, Math.min(threshold, 0.08), threshold],
        rootMargin: "12% 0px 12% 0px",
      },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, revealed };
}

export function doePhoneSectionRevealSegmentClass(
  segment:
    | "title"
    | "carousel"
    | "menu"
    | "badge"
    | "input"
    | "agents-carousel"
    | "agents-orbs"
    | "agents-label"
    | "agents-nav",
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
