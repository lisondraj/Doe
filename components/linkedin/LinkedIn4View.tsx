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
          <div className="linkedin4-page__waves" aria-hidden />

          <div className="linkedin4-page__content">
            <h1 className={`linkedin4-page__title ${lora.className}`}>{LINKEDIN4_TITLE}</h1>

            <div className={`linkedin4-page__carousel ${inter.className}`} aria-label="Clinic specialties">
              <div className="linkedin4-page__carousel-side linkedin4-page__carousel-side--top">
                <p className="linkedin4-page__slide linkedin4-page__slide--outermost">
                  <span>{LINKEDIN4_CAROUSEL.outerTop.kicker}</span>
                </p>
                <p className="linkedin4-page__slide linkedin4-page__slide--outer">
                  <span>{LINKEDIN4_CAROUSEL.top.kicker}</span>
                </p>
                <p className="linkedin4-page__slide linkedin4-page__slide--side">
                  <span>{LINKEDIN4_CAROUSEL.preceding.kicker}</span>
                </p>
              </div>
              <p className="linkedin4-page__slide linkedin4-page__slide--focused">
                <span>{LINKEDIN4_CAROUSEL.focused.kicker}</span>
                <span>{LINKEDIN4_CAROUSEL.focused.middle}</span>
                <span>{LINKEDIN4_CAROUSEL.focused.label}</span>
              </p>
              <div className="linkedin4-page__carousel-side linkedin4-page__carousel-side--bottom">
                <p className="linkedin4-page__slide linkedin4-page__slide--side">
                  <span>{LINKEDIN4_CAROUSEL.succeeding.kicker}</span>
                  <span>{LINKEDIN4_CAROUSEL.succeeding.label}</span>
                </p>
                <p className="linkedin4-page__slide linkedin4-page__slide--outer">
                  <span>{LINKEDIN4_CAROUSEL.bottom.kicker}</span>
                  <span>{LINKEDIN4_CAROUSEL.bottom.label}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
