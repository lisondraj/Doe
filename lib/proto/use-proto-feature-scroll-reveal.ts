"use client";

import { useEffect, useRef, useState } from "react";

/** Scroll-triggered reveal for /proto feature copy — title then description. */
export function useProtoFeatureScrollReveal(threshold = 0.14) {
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

export function protoFeatureRevealClass(revealed: boolean, segment: "title" | "description") {
  return [
    "proto-feature-reveal",
    `proto-feature-reveal--${segment}`,
    revealed ? "proto-feature-reveal--in" : "",
  ]
    .filter(Boolean)
    .join(" ");
}
