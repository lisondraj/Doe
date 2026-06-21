"use client";

import { suisseIntl } from "@/lib/home/fonts";
import { useCallback, useEffect, useMemo, useState } from "react";

const DOEPHONE_HERO_CAREERS = [
  "doctors",
  "nurses",
  "pharmacists",
  "therapists",
  "surgeons",
  "paramedics",
  "dentists",
  "optometrists",
  "midwives",
  "doulas",
] as const;

/** Longest label — sets carousel slot width. */
const DOEPHONE_HERO_CAREER_WIDTH_SAMPLE = "optometrists.";

/** Hold each career on screen before advancing. */
const CAREER_ROTATE_MS = 3800;

export function DoePhoneHeroHeadline() {
  const [index, setIndex] = useState(0);
  const [slideTransition, setSlideTransition] = useState(true);

  const slideItems = useMemo(
    () => [...DOEPHONE_HERO_CAREERS, DOEPHONE_HERO_CAREERS[0]],
    [],
  );

  const activeCareer = DOEPHONE_HERO_CAREERS[index % DOEPHONE_HERO_CAREERS.length];

  const handleTrackTransitionEnd = useCallback(() => {
    if (index !== DOEPHONE_HERO_CAREERS.length) return;

    setSlideTransition(false);
    setIndex(0);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setSlideTransition(true));
    });
  }, [index]);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const id = window.setInterval(() => {
      setIndex((i) => (i >= DOEPHONE_HERO_CAREERS.length ? 0 : i + 1));
    }, CAREER_ROTATE_MS);

    return () => window.clearInterval(id);
  }, []);

  return (
    <h1
      className={`doephone-hero-headline-line w-full text-center font-light leading-[1.02] tracking-[-0.03em] text-white text-[clamp(3.35rem,13.25vw,5.85rem)] iphone-page:text-[clamp(3.15rem,12.5vw,5.45rem)] ${suisseIntl.className}`}
    >
      <span className="block whitespace-nowrap">An AI inbox built for</span>
      <span className="block">
        <span className="relative inline-grid align-baseline leading-none">
          <span aria-hidden className="invisible col-start-1 row-start-1 select-none font-ui font-light">
            {DOEPHONE_HERO_CAREER_WIDTH_SAMPLE}
          </span>
          <span className="doephone-hero-career-clip col-start-1 row-start-1">
            <span
              className={`doephone-hero-career-track block${slideTransition ? "" : " doephone-hero-career-track--instant"}`}
              style={{ transform: `translateY(calc(var(--doephone-career-slot) * -${index}))` }}
              onTransitionEnd={handleTrackTransitionEnd}
              aria-live="polite"
            >
              {slideItems.map((career, i) => (
                <span
                  key={`${career}-${i}`}
                  className="doephone-hero-career-word font-ui font-light"
                  aria-hidden={i === slideItems.length - 1 || career !== activeCareer}
                >
                  {career}.
                </span>
              ))}
            </span>
          </span>
        </span>
      </span>
    </h1>
  );
}
