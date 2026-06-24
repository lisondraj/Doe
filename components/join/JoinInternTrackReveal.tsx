"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type JoinInternTrackRevealProps = {
  variant: "mobile" | "desktop";
  children: ReactNode;
  className?: string;
};

/** Scroll-triggered unblur + rise for intern track visuals and copy (not hero). */
export function JoinInternTrackReveal({
  variant,
  children,
  className = "",
}: JoinInternTrackRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(variant === "desktop");

  useEffect(() => {
    if (variant === "desktop") return;

    const el = ref.current;
    if (!el) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setVisible(true);
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [variant]);

  const revealClass =
    variant === "mobile"
      ? `doephone-section-copy${visible ? " doephone-section-copy-visible" : ""}`
      : "";

  return (
    <div ref={ref} className={`${className} ${revealClass}`.trim()}>
      {children}
    </div>
  );
}
