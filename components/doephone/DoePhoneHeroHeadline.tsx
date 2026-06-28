"use client";

import { DOEPHONE_DISPLAY_WEIGHT_TW } from "@/lib/doephone/section-styles";
import { suisseIntl } from "@/lib/home/fonts";
import { useLayoutEffect, useRef } from "react";

const MIN_FIT_SCALE = 0.68;
const MIN_FIT_PX = 17;

function measureHeadlineContentWidth(headline: HTMLElement): number {
  const lines = headline.querySelectorAll<HTMLElement>(".doephone-hero-headline-line");
  if (lines.length === 0) return headline.scrollWidth;

  const prevW = headline.style.width;
  headline.style.width = "max-content";

  let width = 0;
  lines.forEach((line) => {
    width = Math.max(width, line.scrollWidth);
  });

  headline.style.width = prevW;
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
  }, []);

  return (
    <h1
      ref={headlineRef}
      className={`doephone-hero-headline flex w-full min-w-0 max-w-full flex-col items-start ${DOEPHONE_DISPLAY_WEIGHT_TW} leading-[1.02] tracking-[-0.03em] text-white ${suisseIntl.className}`}
    >
      <span className="doephone-hero-headline-line block">Intelligence</span>
      <span className="doephone-hero-headline-line doephone-hero-headline-line--second block">built for doctors.</span>
    </h1>
  );
}
