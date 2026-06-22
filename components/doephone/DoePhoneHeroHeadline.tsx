"use client";

import { suisseIntl } from "@/lib/home/fonts";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

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

const MIN_FIT_SCALE = 0.68;

function fitHeadlineFontSize(headline: HTMLElement, container: HTMLElement) {
  headline.style.fontSize = "";
  const available = container.clientWidth;
  if (available <= 0) return;

  const needed = headline.scrollWidth;
  if (needed <= available) return;

  const computed = parseFloat(getComputedStyle(headline).fontSize);
  if (!Number.isFinite(computed) || computed <= 0) return;

  const next = Math.max(computed * MIN_FIT_SCALE, computed * (available / needed) * 0.985);
  headline.style.fontSize = `${next}px`;
}

export function DoePhoneHeroHeadline() {
  const headlineRef = useRef<HTMLHeadingElement>(null);
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

  useLayoutEffect(() => {
    const headline = headlineRef.current;
    const container = headline?.parentElement;
    if (!headline || !container) return;

    const measure = () => fitHeadlineFontSize(headline, container);

    measure();
    const raf = requestAnimationFrame(measure);

    const ro = new ResizeObserver(measure);
    ro.observe(headline);
    ro.observe(container);
    window.addEventListener("resize", measure);
    window.visualViewport?.addEventListener("resize", measure);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.visualViewport?.removeEventListener("resize", measure);
    };
  }, [index, slideTransition]);

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
      ref={headlineRef}
      className={`doephone-hero-headline flex w-full min-w-0 max-w-full flex-col items-start font-light leading-[1.02] tracking-[-0.03em] text-white ${suisseIntl.className}`}
    >
      <span className="doephone-hero-headline-line block">Intelligence</span>
      <span className="doephone-hero-headline-line doephone-hero-headline-line--second doephone-hero-second-line flex min-w-0 max-w-full items-baseline justify-start whitespace-nowrap">
        <span className="shrink-0">built for</span>
        <span className="doephone-hero-career-slot relative inline-grid align-baseline leading-none">
          <span aria-hidden className="invisible col-start-1 row-start-1 select-none font-light">
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
                  className="doephone-hero-career-word font-light"
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
