"use client";

import { useEffect, useRef, useState } from "react";

type JoinInternTrackCopyProps = {
  title: string;
  description: readonly string[];
  titleClass: string;
  descClass: string;
  variant: "mobile" | "desktop";
};

/** Scroll-triggered unblur + rise for intern track title and description (not hero). */
export function JoinInternTrackCopy({
  title,
  description,
  titleClass,
  descClass,
  variant,
}: JoinInternTrackCopyProps) {
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
      { threshold: 0.18 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [variant]);

  const revealClass =
    variant === "mobile"
      ? `doephone-section-copy${visible ? " doephone-section-copy-visible" : ""}`
      : "";

  return (
    <div
      ref={ref}
      className={`${variant === "mobile" ? "shrink-0" : ""} ${revealClass}`.trim()}
    >
      <h3 className={titleClass}>{title}</h3>
      <p className={descClass}>
        {description.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </p>
    </div>
  );
}
