"use client";

import { FormEvent, useEffect, useState } from "react";

import { DoeHealthDeskAudienceCarousel } from "@/components/doehealth-desk/DoeHealthDeskAudienceCarousel";
import { DOEPHONE_DESKTOP_PAGE_INSET_X } from "@/lib/doephone/section-styles";
import {
  DOEHEALTH_DESK_HERO_DEK,
  DOEHEALTH_DESK_HERO_HEADLINE,
  DOEHEALTH_DESK_HERO_SECURE,
} from "@/lib/doehealth/doehealth-desk-hero-copy";
import { inter, p22Mackinac } from "@/lib/home/fonts";

/** /doehealthdesk desktop hero — title and email share one row. */
export function DoeHealthDeskHero() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setShown(true));
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <section className={`doehealth-desk-hero ${DOEPHONE_DESKTOP_PAGE_INSET_X}${shown ? " is-in" : ""}`} aria-label="Hero">
      <div className="doehealth-desk-hero__row">
        <div className="doehealth-desk-hero__copy">
          <h1 className={`doehealth-desk-hero__headline ${p22Mackinac.className}`}>
            <span className="doehealth-desk-hero__line">{DOEHEALTH_DESK_HERO_HEADLINE.line1}</span>
            <span className="doehealth-desk-hero__line doehealth-desk-hero__line--built-for">
              {DOEHEALTH_DESK_HERO_HEADLINE.builtForPrefix}{" "}
              <DoeHealthDeskAudienceCarousel />
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
