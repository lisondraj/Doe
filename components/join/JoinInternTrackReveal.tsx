"use client";

import { useEffect, useRef, useState, useTransition, type ReactNode } from "react";

type JoinInternTrackRevealProps = {
  variant: "mobile" | "desktop";
  children: ReactNode;
  className?: string;
};

/** Scroll-triggered unblur + rise for join track visuals, copy, and apply card. */
export function JoinInternTrackReveal({
  variant,
  children,
  className = "",
}: JoinInternTrackRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
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
          startTransition(() => setVisible(true));
          obs.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const revealClass = `doephone-section-copy${visible ? " doephone-section-copy-visible" : ""}`;

  // After the reveal animation finishes, release the GPU composite layer
  const onAnimationEnd = () => {
    if (ref.current) ref.current.style.willChange = "auto";
  };

  return (
    <div ref={ref} className={`${className} ${revealClass}`.trim()} onAnimationEnd={onAnimationEnd}>
      {children}
    </div>
  );
}
