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
const MIN_FIT_PX = 17;

function measureHeadlineContentWidth(headline: HTMLElement): number {
  const firstLine = headline.querySelector<HTMLElement>(
    ".doephone-hero-headline-line:not(.doephone-hero-headline-line--second)",
  );
  const secondLine = headline.querySelector<HTMLElement>(".doephone-hero-second-line");
  if (!firstLine || !secondLine) return headline.scrollWidth;

  const prevHeadlineWidth = headline.style.width;
  const prevSecondMax = secondLine.style.maxWidth;
  headline.style.width = "max-content";
  secondLine.style.maxWidth = "max-content";

  const width = Math.max(firstLine.scrollWidth, secondLine.scrollWidth);

  headline.style.width = prevHeadlineWidth;
  secondLine.style.maxWidth = prevSecondMax;

  return width;
}

function fitHeadlineFontSize(headline: HTMLElement, container: HTMLElement) {
  headline.style.fontSize = "";
  const available = container.clientWidth;
  if (available <= 0) return;

  const computed = parseFloat(getComputedStyle(headline).fontSize);
  if (!Number.isFinite(computed) || computed <= 0) return;

  if (measureHeadlineContentWidth(headline) <= available) return;

  let lo = Math.min(computed * MIN_FIT_SCALE, available / 11.5);
  let hi = computed;
  let best = lo;

  for (let i = 0; i < 14; i++) {
    const mid = (lo + hi) / 2;
    headline.style.fontSize = `${mid}px`;
    if (measureHeadlineContentWidth(headline) <= available * 0.99) {
      best = mid;
      lo = mid;
    } else {
      hi = mid;
    }
  }

  headline.style.fontSize = `${best}px`;

  if (measureHeadlineContentWidth(headline) > available && best > MIN_FIT_PX) {
    headline.style.fontSize = `${MIN_FIT_PX}px`;
  }
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
    const container = headline?.closest<HTMLElement>(".doephone-hero-copy");
    if (!headline || !container) return;

    const measure = () => fitHeadlineFontSize(headline, container);

    measure();
    const raf = requestAnimationFrame(measure);

    const ro = new ResizeObserver(measure);
    ro.observe(headline);
    ro.observe(container);

    const onViewportChange = () => measure();
    window.addEventListener("resize", onViewportChange);
    window.visualViewport?.addEventListener("resize", onViewportChange);
    window.visualViewport?.addEventListener("scroll", onViewportChange);

    let cancelled = false;
    void document.fonts.ready.then(() => {
      if (!cancelled) measure();
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", onViewportChange);
      window.visualViewport?.removeEventListener("resize", onViewportChange);
      window.visualViewport?.removeEventListener("scroll", onViewportChange);
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
      className={`doephone-hero-headline flex w-full min-w-0 max-w-full flex-col items-start font-normal leading-[1.02] tracking-[-0.03em] text-white ${suisseIntl.className}`}
    >
      <span className="doephone-hero-headline-line block">Intelligence</span>
      <span className="doephone-hero-headline-line doephone-hero-headline-line--second doephone-hero-second-line flex min-w-0 max-w-full items-baseline justify-start whitespace-nowrap">
        <span className="shrink-0">built for</span>
        <span className="doephone-hero-career-slot relative inline-grid align-baseline leading-none">
          <span aria-hidden className="invisible col-start-1 row-start-1 select-none font-normal">
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
                  className="doephone-hero-career-word font-normal"
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
