"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

import { DoeCareFall26DeskAudienceCarousel } from "@/components/doe-carefall26-desk/DoeCareFall26DeskAudienceCarousel";
import { DOEPHONE_DESKTOP_PAGE_INSET_X } from "@/lib/doephone/section-styles";
import {
  DOECAREFALL26_DESK_HERO_AUDIENCE,
  DOECAREFALL26_DESK_HERO_AUDIENCE_DESKTOP,
  DOECAREFALL26_DESK_HERO_DEK,
  DOECAREFALL26_DESK_HERO_DESKTOP_TIMING,
  DOECAREFALL26_DESK_HERO_HEADLINE,
  DOECAREFALL26_DESK_HERO_PHONE_TIMING,
  DOECAREFALL26_DESK_HERO_SECURE,
} from "@/lib/doecarefall26/doecarefall26-desk-hero-copy";
import { inter, p22Mackinac } from "@/lib/home/fonts";

/** /doecarefall26 hero — headline, dek, then email (desktop stacks under dek). */
export function DoeCareFall26DeskHero() {
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

    const timing = desktop ? DOECAREFALL26_DESK_HERO_DESKTOP_TIMING : DOECAREFALL26_DESK_HERO_PHONE_TIMING;
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
      className={`doecarefall26-desk-hero ${DOEPHONE_DESKTOP_PAGE_INSET_X}${shown ? " is-in" : ""}`}
      aria-label="Hero"
    >
      <div className="doecarefall26-desk-hero__row">
        <div className="doecarefall26-desk-hero__copy">
          <h1 className={`doecarefall26-desk-hero__headline ${p22Mackinac.className}`}>
            <span
              className={`doecarefall26-desk-hero__line${
                headlineRevealDone
                  ? " doecarefall26-desk-hero__headline-settled"
                  : ` carefall26-headline-darken--ink${headlineIn ? " is-headline-in" : ""}`
              }`}
            >
              {DOECAREFALL26_DESK_HERO_HEADLINE.line1}
            </span>
            <span className="doecarefall26-desk-hero__line doecarefall26-desk-hero__line--built-for">
              <span
                className={`doecarefall26-desk-hero__built-for-tone${
                  headlineRevealDone ? "" : ` carefall26-headline-mask${headlineIn ? " is-headline-in" : ""}`
                }`}
              >
                {DOECAREFALL26_DESK_HERO_HEADLINE.builtForPrefix}{" "}
                <DoeCareFall26DeskAudienceCarousel
                  paused={desktop && !headlineRevealDone}
                  audience={desktop ? DOECAREFALL26_DESK_HERO_AUDIENCE_DESKTOP : DOECAREFALL26_DESK_HERO_AUDIENCE}
                />
              </span>
            </span>
          </h1>
          <p className={`doecarefall26-desk-hero__dek ${inter.className}`}>
            {DOECAREFALL26_DESK_HERO_DEK.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
        </div>

        <form className={`doecarefall26-desk-hero__secure ${inter.className}`} onSubmit={onSubmit}>
          <p>{DOECAREFALL26_DESK_HERO_SECURE}</p>
          <label className="doecarefall26-desk-hero__email">
            <span className="doecarefall26-desk-hero__sr">Your email address</span>
            <input type="email" name="email" placeholder="Your email address" autoComplete="email" required />
            <button type="submit" aria-label={DOECAREFALL26_DESK_HERO_SECURE}>
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
