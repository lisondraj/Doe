"use client";

import { loraItalicLight, suisseIntl } from "@/lib/home/fonts";
import { useEffect, useState } from "react";

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
  "GPs",
] as const;

/** Longest label — sets carousel slot width. */
const DOEPHONE_HERO_CAREER_WIDTH_SAMPLE = "optometrists";

/** Hold each career on screen before advancing. */
const CAREER_ROTATE_MS = 3800;

export function DoePhoneHeroHeadline() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % DOEPHONE_HERO_CAREERS.length);
    }, CAREER_ROTATE_MS);

    return () => window.clearInterval(id);
  }, []);

  return (
    <h1
      className={`doephone-hero-headline-line text-left font-light leading-[1.02] tracking-[-0.03em] text-white text-[clamp(3.45rem,14vw,6rem)] iphone-page:text-[clamp(3.25rem,13.25vw,5.65rem)] ${suisseIntl.className}`}
    >
      <span className="block">An AI inbox</span>
      <span className="block min-w-0">
        <span className="inline-flex max-w-full flex-nowrap items-baseline whitespace-nowrap">
          <span className="shrink-0">built&nbsp;</span>
          <span className="inline-flex shrink-0 flex-nowrap items-baseline whitespace-nowrap">
            <span>for&nbsp;</span>
            <span className="relative inline-grid align-baseline">
              <span aria-hidden className="invisible col-start-1 row-start-1 select-none">
                {DOEPHONE_HERO_CAREER_WIDTH_SAMPLE}
              </span>
              <span className="doephone-hero-career-clip col-start-1 row-start-1">
                <span
                  className="doephone-hero-career-track block"
                  style={{ transform: `translateY(calc(-1em * ${index}))` }}
                  aria-live="polite"
                >
                  {DOEPHONE_HERO_CAREERS.map((career) => (
                    <span key={career} className={`doephone-hero-career-word ${loraItalicLight.className}`}>
                      {career}
                    </span>
                  ))}
                </span>
              </span>
            </span>
          </span>
        </span>
      </span>
    </h1>
  );
}
