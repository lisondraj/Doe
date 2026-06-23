"use client";

import { DOEPHONE_DISPLAY_WEIGHT_TW } from "@/lib/doephone/section-styles";
import { suisseIntl } from "@/lib/home/fonts";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

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

/** Longest label — reserves width so layout never shifts. */
const DOEPHONE_HERO_CAREER_WIDTH_SAMPLE = "optometrists.";

/** Hold each profession on screen before advancing. */
const CAREER_ROTATE_MS = 3600;

/** Exit animation duration — outgoing word clears before next arrives. */
const CAREER_EXIT_MS = 360;

const MIN_FIT_SCALE = 0.68;
const MIN_FIT_PX = 17;

function measureHeadlineContentWidth(headline: HTMLElement): number {
  const firstLine = headline.querySelector<HTMLElement>(
    ".doephone-hero-headline-line:not(.doephone-hero-headline-line--second)",
  );
  const secondLine = headline.querySelector<HTMLElement>(".doephone-hero-second-line");
  if (!firstLine || !secondLine) return headline.scrollWidth;

  const prevW = headline.style.width;
  const prevMax = secondLine.style.maxWidth;
  headline.style.width = "max-content";
  secondLine.style.maxWidth = "max-content";

  const width = Math.max(firstLine.scrollWidth, secondLine.scrollWidth);

  headline.style.width = prevW;
  secondLine.style.maxWidth = prevMax;

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
  const currRef = useRef(0);
  const [curr, setCurr] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const advance = () => {
      const from = currRef.current;
      const to = (from + 1) % DOEPHONE_HERO_CAREERS.length;
      currRef.current = to;

      setPrev(from);
      setCurr(to);

      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
      exitTimerRef.current = setTimeout(() => setPrev(null), CAREER_EXIT_MS + 60);
    };

    const id = setInterval(advance, CAREER_ROTATE_MS);
    return () => {
      clearInterval(id);
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    };
  }, []);

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

    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("resize", onResize);

    let cancelled = false;
    void document.fonts.ready.then(() => {
      if (!cancelled) measure();
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
    };
  }, [curr]);

  return (
    <h1
      ref={headlineRef}
      className={`doephone-hero-headline flex w-full min-w-0 max-w-full flex-col items-start ${DOEPHONE_DISPLAY_WEIGHT_TW} leading-[1.02] tracking-[-0.03em] text-white ${suisseIntl.className}`}
    >
      <span className="doephone-hero-headline-line block">Intelligence</span>
      <span className="doephone-hero-headline-line doephone-hero-headline-line--second doephone-hero-second-line flex min-w-0 max-w-full items-baseline justify-start whitespace-nowrap">
        <span className="shrink-0">built for</span>
        <span className="doephone-hero-career-slot relative inline-grid align-baseline">
          {/* Invisible sizer — keeps slot width = longest word, no layout shift */}
          <span
            aria-hidden
            className={`invisible col-start-1 row-start-1 block select-none ${DOEPHONE_DISPLAY_WEIGHT_TW}`}
          >
            {DOEPHONE_HERO_CAREER_WIDTH_SAMPLE}
          </span>

          {/* Clip window */}
          <span className="doephone-hero-career-clip col-start-1 row-start-1">
            {/* Outgoing word — exits upward */}
            {prev !== null && (
              <span
                key={`out-${prev}`}
                className={`doephone-hero-career-word doephone-hero-career-word--exit ${DOEPHONE_DISPLAY_WEIGHT_TW}`}
                aria-hidden
              >
                {DOEPHONE_HERO_CAREERS[prev]}.
              </span>
            )}

            {/* Incoming word — enters from below */}
            <span
              key={`in-${curr}`}
              className={`doephone-hero-career-word doephone-hero-career-word--enter ${DOEPHONE_DISPLAY_WEIGHT_TW}`}
              aria-live="polite"
            >
              {DOEPHONE_HERO_CAREERS[curr]}.
            </span>
          </span>
        </span>
      </span>
    </h1>
  );
}
