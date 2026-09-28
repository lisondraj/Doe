"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

import { DoeHealthDeskAudienceCarousel } from "@/components/doehealth-desk/DoeHealthDeskAudienceCarousel";
import { DOEPHONE_DESKTOP_PAGE_INSET_X } from "@/lib/doephone/section-styles";
import {
  DOEHEALTH_DESK_HERO_DEK,
  DOEHEALTH_DESK_HERO_DESKTOP_TIMING,
  DOEHEALTH_DESK_HERO_HEADLINE,
  DOEHEALTH_DESK_HERO_HEADLINE_DARKEN_DELAY_MS,
  DOEHEALTH_DESK_HERO_HEADLINE_DARKEN_MS,
  DOEHEALTH_DESK_HERO_SECURE,
} from "@/lib/doehealth/doehealth-desk-hero-copy";
import { inter, p22Mackinac } from "@/lib/home/fonts";

/** /doehealthdesk desktop hero — title and email share one row. */
export function DoeHealthDeskHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [desktop, setDesktop] = useState(false);
  const [shown, setShown] = useState(false);
  const [headlineIn, setHeadlineIn] = useState(false);
  const [headlineRevealDone, setHeadlineRevealDone] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      setHeadlineIn(true);
      setHeadlineRevealDone(true);
      return;
    }

    const section = sectionRef.current;
    if (!section) return;

    const desktop = !window.matchMedia("(max-width: 1023px)").matches;
    setDesktop(desktop);
    const timers: number[] = [];

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || entry.intersectionRatio < 0.35) return;
        observer.disconnect();

        if (desktop) {
          const { startDelayMs, introRevealMs } = DOEHEALTH_DESK_HERO_DESKTOP_TIMING;
          timers.push(window.setTimeout(() => setShown(true), startDelayMs));
          timers.push(window.setTimeout(() => setHeadlineIn(true), startDelayMs + introRevealMs));
          return;
        }

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setHeadlineIn(true);
            setShown(true);
          });
        });
      },
      { threshold: [0, 0.15, 0.35, 0.55, 0.72] },
    );
    observer.observe(section);
    return () => {
      observer.disconnect();
      for (const timer of timers) window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!headlineIn || headlineRevealDone) return undefined;

    const totalMs = desktop
      ? DOEHEALTH_DESK_HERO_DESKTOP_TIMING.darkenMs + DOEHEALTH_DESK_HERO_DESKTOP_TIMING.darkenDelayMs
      : DOEHEALTH_DESK_HERO_HEADLINE_DARKEN_MS + DOEHEALTH_DESK_HERO_HEADLINE_DARKEN_DELAY_MS;
    const timer = window.setTimeout(() => setHeadlineRevealDone(true), totalMs);
    return () => window.clearTimeout(timer);
  }, [desktop, headlineIn, headlineRevealDone]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <section
      ref={sectionRef}
      className={`doehealth-desk-hero ${DOEPHONE_DESKTOP_PAGE_INSET_X}${shown ? " is-in" : ""}`}
      aria-label="Hero"
    >
      <div className="doehealth-desk-hero__row">
        <div className="doehealth-desk-hero__copy">
          <h1 className={`doehealth-desk-hero__headline ${p22Mackinac.className}`}>
            <span
              className={`doehealth-desk-hero__line${
                headlineRevealDone
                  ? " doehealth-desk-hero__headline-settled"
                  : ` desk-headline-darken--ink${headlineIn ? " is-headline-in" : ""}`
              }`}
            >
              {DOEHEALTH_DESK_HERO_HEADLINE.line1}
            </span>
            <span className="doehealth-desk-hero__line doehealth-desk-hero__line--built-for">
              <span
                className={`doehealth-desk-hero__built-for-tone${
                  headlineRevealDone ? "" : ` desk-headline-mask${headlineIn ? " is-headline-in" : ""}`
                }`}
              >
                {DOEHEALTH_DESK_HERO_HEADLINE.builtForPrefix}{" "}
                <DoeHealthDeskAudienceCarousel paused={desktop && !headlineRevealDone} />
              </span>
            </span>
          </h1>
          <p className={`doehealth-desk-hero__dek ${inter.className}`}>
            {DOEHEALTH_DESK_HERO_DEK.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
        </div>

        <form className={`doehealth-desk-hero__secure ${inter.className}`} onSubmit={onSubmit}>
          <p>{DOEHEALTH_DESK_HERO_SECURE}</p>
          <label className="doehealth-desk-hero__email">
            <span className="doehealth-desk-hero__sr">Work email</span>
            <input type="email" name="email" placeholder="Work email" autoComplete="email" required />
            <button type="submit" aria-label={DOEHEALTH_DESK_HERO_SECURE}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </label>
        </form>
      </div>
    </section>
  );
}
