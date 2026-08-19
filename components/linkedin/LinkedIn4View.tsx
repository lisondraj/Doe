"use client";

import { inter, lora } from "@/lib/home/fonts";
import { LINKEDIN4_CAROUSEL, LINKEDIN4_TITLE } from "@/lib/linkedin/linkedin4-copy";
import "@/lib/linkedin/linkedin4-page.css";

/** LinkedIn banner — dark brown gradient, gold Lora Doe, clinic carousel. */
export function LinkedIn4View() {
  return (
    <main className="linkedin4-page">
      <div className="linkedin4-page__frame">
        <div className="linkedin4-page__stage">
          <div className="linkedin4-page__content">
            <h1 className={`linkedin4-page__title ${lora.className}`}>{LINKEDIN4_TITLE}</h1>

            <div className={`linkedin4-page__carousel ${inter.className}`} aria-label="Clinic specialties">
              <p className="linkedin4-page__slide linkedin4-page__slide--side">
                <span>{LINKEDIN4_CAROUSEL.preceding.kicker}</span>
                <span>{LINKEDIN4_CAROUSEL.preceding.label}</span>
              </p>
              <p className="linkedin4-page__slide linkedin4-page__slide--focused">
                <span>{LINKEDIN4_CAROUSEL.focused.kicker}</span>
                <span>{LINKEDIN4_CAROUSEL.focused.label}</span>
              </p>
              <p className="linkedin4-page__slide linkedin4-page__slide--side">
                <span>{LINKEDIN4_CAROUSEL.succeeding.kicker}</span>
                <span>{LINKEDIN4_CAROUSEL.succeeding.label}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
