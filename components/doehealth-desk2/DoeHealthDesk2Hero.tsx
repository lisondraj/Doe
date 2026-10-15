"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

import { DOEPHONE_DESKTOP_PAGE_INSET_X } from "@/lib/doephone/section-styles";
import {
  DOEHEALTH_DESK2_HERO_DEK,
  DOEHEALTH_DESK2_HERO_DESKTOP_TIMING,
  DOEHEALTH_DESK2_HERO_HEADLINE,
  DOEHEALTH_DESK2_HERO_PHONE_TIMING,
  DOEHEALTH_DESK2_HERO_SECURE,
} from "@/lib/doehealthdesk2/doehealthdesk2-hero-copy";
import { inter, p22Mackinac } from "@/lib/home/fonts";

/** /doehealthdesk desktop hero — title and email share one row. */
export function DoeHealthDesk2Hero() {
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

    // Hero is above the fold — start the reveal on page load, no scroll/IO gating or delay.
    const frame = requestAnimationFrame(() => {
      setShown(true);
      setHeadlineIn(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!headlineIn || headlineRevealDone) return undefined;

    const timing = desktop ? DOEHEALTH_DESK2_HERO_DESKTOP_TIMING : DOEHEALTH_DESK2_HERO_PHONE_TIMING;
    const totalMs = timing.darkenMs + timing.darkenDelayMs;
    const timer = window.setTimeout(() => setHeadlineRevealDone(true), totalMs);
    return () => window.clearTimeout(timer);
  }, [desktop, headlineIn, headlineRevealDone]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <section
      ref={sectionRef}
      className={`doehealth-desk2-hero ${DOEPHONE_DESKTOP_PAGE_INSET_X}${shown ? " is-in" : ""}`}
      aria-label="Hero"
    >
      <div className="doehealth-desk2-hero__row">
        <div className="doehealth-desk2-hero__copy">
          <h1 className={`doehealth-desk2-hero__headline ${p22Mackinac.className}`}>
            <span
              className={`doehealth-desk2-hero__line${
                headlineRevealDone
                  ? " doehealth-desk2-hero__headline-settled"
                  : ` desk2-headline-darken--ink${headlineIn ? " is-headline-in" : ""}`
              }`}
            >
              {DOEHEALTH_DESK2_HERO_HEADLINE.line1}
            </span>
            <span className="doehealth-desk2-hero__line doehealth-desk2-hero__line--built-for">
              <span
                className={`doehealth-desk2-hero__built-for-tone${
                  headlineRevealDone ? "" : ` desk2-headline-mask${headlineIn ? " is-headline-in" : ""}`
                }`}
              >
                {DOEHEALTH_DESK2_HERO_HEADLINE.line2}
              </span>
            </span>
          </h1>
          <p className={`doehealth-desk2-hero__dek ${inter.className}`}>
            {DOEHEALTH_DESK2_HERO_DEK.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
        </div>

        <form className={`doehealth-desk2-hero__secure ${inter.className}`} onSubmit={onSubmit}>
          <p>{DOEHEALTH_DESK2_HERO_SECURE}</p>
          <label className="doehealth-desk2-hero__email">
            <span className="doehealth-desk2-hero__sr">Work email</span>
            <input type="email" name="email" placeholder="Work email" autoComplete="email" required />
            <button type="submit" aria-label={DOEHEALTH_DESK2_HERO_SECURE}>
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
