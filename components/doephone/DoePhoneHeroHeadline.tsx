"use client";

import { lora, suisseIntl } from "@/lib/home/fonts";
import { useEffect, useState } from "react";

const DOEPHONE_HERO_CAREERS = [
  "doctors",
  "nurses",
  "physiotherapists",
  "pharmacists",
  "therapists",
  "surgeons",
  "pediatricians",
  "radiologists",
  "paramedics",
  "dentists",
] as const;

const CAREER_ROTATE_MS = 1050;

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
      <span className="block">
        <span className="inline-flex max-w-full items-baseline">
          <span>built for</span>
          <span className="relative ml-[0.38em] inline-grid align-baseline">
            <span aria-hidden className="invisible col-start-1 row-start-1 select-none">
              physiotherapists
            </span>
            <span className="col-start-1 row-start-1 h-[1.02em] overflow-hidden">
              <span
                className="doephone-hero-career-track block"
                style={{ transform: `translateY(-${index * 100}%)` }}
                aria-live="polite"
              >
                {DOEPHONE_HERO_CAREERS.map((career) => (
                  <span
                    key={career}
                    className={`block h-[1.02em] font-normal italic leading-[1.02] ${lora.className}`}
                  >
                    {career}
                  </span>
                ))}
              </span>
            </span>
          </span>
        </span>
      </span>
    </h1>
  );
}
