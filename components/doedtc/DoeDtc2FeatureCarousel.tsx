"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";

import { plusJakartaSans } from "@/lib/home/fonts";

const SCROLL_RELEASE_AT = 0.85;
const HORIZONTAL_STEPS = 2.7;

type FeatureCard = {
  id: string;
  title: string;
  description: string;
  peek: ReactNode;
};

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function scrollToLandingForm() {
  document.querySelector(".doedtc2-landing")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function IMessagePeek() {
  return (
    <div className="doedtc2-feature-card__peek-inner doedtc2-feature-card__peek-inner--dashboard">
      <div className="doedtc-profile-name-box doedtc2-feature-card__name-box">
        <div className="doedtc-profile-name-box__content">
          <h2 className={`doedtc-headline doedtc-profile-name-box__title ${plusJakartaSans.className}`}>
            Good morning, Alex
          </h2>
          <span className="doedtc-profile-phone-banner">
            <span className="doedtc-profile-phone-banner__number">(415) 555-0142</span>
          </span>
        </div>
      </div>
    </div>
  );
}

function ChartPeek() {
  return (
    <div className="doedtc2-feature-card__peek-inner doedtc2-feature-card__peek-inner--chart">
      <div className="doedtc-medical-box doedtc2-feature-card__medical-box">
        <p className="doedtc-medical-box__title">Medications</p>
        <div className="doedtc-tag-list doedtc-tag-list--compact">
          <span className="doedtc-tag">Metformin XR</span>
          <span className="doedtc-tag">Lisinopril</span>
          <span className="doedtc-tag">Atorvastatin</span>
        </div>
        <p className="doedtc-medical-box__title">Conditions</p>
        <div className="doedtc-tag-list doedtc-tag-list--compact">
          <span className="doedtc-tag">Type 2 diabetes</span>
          <span className="doedtc-tag">Hypertension</span>
        </div>
      </div>
    </div>
  );
}

function ReminderPeek() {
  return (
    <div className="doedtc2-feature-card__peek-inner doedtc2-feature-card__peek-inner--tracker">
      <div className="doedtc-card doedtc-card--flat doedtc2-feature-card__tracker-card">
        <p className="doedtc2-feature-card__tracker-title">Ozempic reminder</p>
        <p className="doedtc2-feature-card__tracker-value">Tonight at 8:00 PM</p>
        <p className="doedtc-muted doedtc2-feature-card__tracker-meta">Daily · texts you if you miss it</p>
      </div>
    </div>
  );
}

function FamilyPeek() {
  return (
    <div className="doedtc2-feature-card__peek-inner doedtc2-feature-card__peek-inner--family">
      <div className="doedtc-family-card doedtc2-feature-card__family-card">
        <div className="doedtc-family-card__top">
          <span className="doedtc-family-card__avatar" aria-hidden>
            S
          </span>
          <div className="doedtc-family-card__copy">
            <div className="doedtc-family-card__name-row">
              <h3 className={`doedtc-family-card__name ${plusJakartaSans.className}`}>Simon</h3>
              <span className="doedtc-tag">Son</span>
            </div>
            <p className="doedtc-family-card__meta">Active · (415) 555-0198</p>
          </div>
        </div>
        <div className="doedtc-tag-list doedtc-tag-list--compact">
          <span className="doedtc-tag">Albuterol</span>
          <span className="doedtc-tag">Asthma</span>
        </div>
      </div>
    </div>
  );
}

const FEATURE_CARDS: FeatureCard[] = [
  {
    id: "imessage",
    title: "Text Doe over iMessage",
    description: "Reach your health companion the same way you text a friend. No app download — just reply when something feels off.",
    peek: <IMessagePeek />,
  },
  {
    id: "chart",
    title: "Your chart, always ready",
    description: "Meds, conditions, and labs stay organized so Doe can answer with your real history — not generic advice.",
    peek: <ChartPeek />,
  },
  {
    id: "reminders",
    title: "Reminders that follow through",
    description: "One-shot nudges or daily check-ins. Doe texts you on schedule and keeps the thread going until it is handled.",
    peek: <ReminderPeek />,
  },
  {
    id: "family",
    title: "Family on the same thread",
    description: "Add the people you care for and text Doe about them — bath time, refills, or a sore throat for your kid.",
    peek: <FamilyPeek />,
  },
];

export function DoeDtc2FeatureCarousel() {
  const trackRef = useRef<HTMLElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const syncCarousel = useCallback(() => {
    const track = trackRef.current;
    const row = rowRef.current;
    const card = cardRef.current;
    if (!track || !row || !card) return;

    const viewport = window.innerHeight || 1;
    const trackHeight = track.offsetHeight;
    const scrollRange = Math.max(trackHeight - viewport, 1);
    const trackTop = track.getBoundingClientRect().top;
    const rawProgress = clamp01(-trackTop / scrollRange);
    const horizontalProgress = clamp01(rawProgress / SCROLL_RELEASE_AT);

    const cardWidth = card.offsetWidth;
    const gap = Number.parseFloat(getComputedStyle(row).gap || "0") || 0;
    const step = cardWidth + gap;
    const translateX = -horizontalProgress * HORIZONTAL_STEPS * step;

    row.style.setProperty("--doedtc2-features-x", `${translateX}px`);
  }, []);

  useEffect(() => {
    syncCarousel();
    window.addEventListener("scroll", syncCarousel, { passive: true });
    window.addEventListener("resize", syncCarousel);

    return () => {
      window.removeEventListener("scroll", syncCarousel);
      window.removeEventListener("resize", syncCarousel);
    };
  }, [syncCarousel]);

  return (
    <section
      ref={trackRef}
      className="doedtc2-features doedtc2-section doedtc2-section--over-blue"
      aria-label="Doe features"
    >
      <div className="doedtc2-features__sticky">
        <div className="doedtc2-features__viewport doedtc-profile-layout">
          <div ref={rowRef} className="doedtc2-features__row">
            {FEATURE_CARDS.map((feature, index) => (
              <article
                key={feature.id}
                ref={index === 0 ? cardRef : undefined}
                className="doedtc-card doedtc-card--flat doedtc2-feature-card"
                aria-label={feature.title}
              >
                <div className="doedtc2-feature-card__visual" aria-hidden>
                  {feature.peek}
                </div>
                <div className="doedtc2-feature-card__copy">
                  <h2 className={`doedtc2-feature-card__title ${plusJakartaSans.className}`}>{feature.title}</h2>
                  <p className="doedtc2-feature-card__description">{feature.description}</p>
                  <button type="button" className="doedtc-button doedtc2-feature-card__cta" onClick={scrollToLandingForm}>
                    Text me to start
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
