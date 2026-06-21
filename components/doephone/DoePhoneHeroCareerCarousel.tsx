"use client";

import { useEffect, useState } from "react";

/** Ten healthcare roles — cycles 1→10→1. */
export const DOEPHONE_HERO_CAREERS = [
  "doctors",
  "nurses",
  "physiotherapists",
  "pharmacists",
  "dentists",
  "therapists",
  "paramedics",
  "radiologists",
  "surgeons",
  "clinicians",
] as const;

const CAREER_COUNT = DOEPHONE_HERO_CAREERS.length;
const CAREER_CHANGE_MS = 1200;
const CAREER_TRANSITION_MS = 320;
const CAREER_EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

/** Widest label — reserves width so “built for” doesn’t shift. */
const CAREER_WIDTH_ANCHOR = "physiotherapists";

export function DoePhoneHeroCareerCarousel() {
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [noTransition, setNoTransition] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setPaused(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => setAnimating(true), CAREER_CHANGE_MS);
    return () => window.clearInterval(id);
  }, [paused]);

  useEffect(() => {
    if (!animating) return;
    const id = window.setTimeout(() => {
      setNoTransition(true);
      setIndex((i) => (i + 1) % CAREER_COUNT);
      setAnimating(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setNoTransition(false));
      });
    }, CAREER_TRANSITION_MS);
    return () => window.clearTimeout(id);
  }, [animating]);

  const current = DOEPHONE_HERO_CAREERS[index];
  const next = DOEPHONE_HERO_CAREERS[(index + 1) % CAREER_COUNT];

  return (
    <span
      className="relative ml-[0.34em] inline-grid align-baseline leading-[1.02]"
      aria-live="polite"
      aria-atomic="true"
    >
      <span aria-hidden className="invisible col-start-1 row-start-1 whitespace-nowrap">
        {CAREER_WIDTH_ANCHOR}
      </span>
      <span className="col-start-1 row-start-1 h-[1em] overflow-hidden">
        <span
          className="flex flex-col"
          style={{
            transform: animating ? "translateY(-50%)" : "translateY(0)",
            transition: noTransition ? "none" : `transform ${CAREER_TRANSITION_MS}ms ${CAREER_EASE}`,
          }}
        >
          <span className="block h-[1em] leading-[1.02] whitespace-nowrap">{current}</span>
          <span className="block h-[1em] leading-[1.02] whitespace-nowrap">{next}</span>
        </span>
      </span>
      <span className="sr-only">{current}</span>
    </span>
  );
}
