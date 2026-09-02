"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";

import { plusJakartaSans } from "@/lib/home/fonts";

const SCROLL_RELEASE_AT = 0.85;
const HORIZONTAL_STEPS = 2.7;

type FeatureCard = {
  id: string;
  title: string;
  description: string;
  ctaLabel: string;
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
    <div className="doedtc2-feature-card__peek-inner doedtc2-feature-card__peek-inner--imessage">
      <div className="doedtc2-feature-card__scene doedtc2-feature-card__scene--imessage">
        <div className="doedtc2-feature-card__bubble doedtc2-feature-card__bubble--incoming">
          I feel off today
        </div>
        <div className="doedtc2-feature-card__bubble doedtc2-feature-card__bubble--outgoing">
          I&apos;m here. What changed?
        </div>
      </div>
    </div>
  );
}

function ChartPeek() {
  return (
    <div className="doedtc2-feature-card__peek-inner doedtc2-feature-card__peek-inner--chart">
      <div className="doedtc2-feature-card__scene doedtc2-feature-card__scene--chart">
        <div className="doedtc2-feature-card__chart-row">
          <span className="doedtc2-feature-card__chart-label">Medications</span>
          <div className="doedtc-tag-list doedtc-tag-list--compact">
            <span className="doedtc-tag">Metformin XR</span>
            <span className="doedtc-tag">Lisinopril</span>
          </div>
        </div>
        <div className="doedtc2-feature-card__chart-row">
          <span className="doedtc2-feature-card__chart-label">Conditions</span>
          <div className="doedtc-tag-list doedtc-tag-list--compact">
            <span className="doedtc-tag">Type 2 diabetes</span>
            <span className="doedtc-tag">Hypertension</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReminderPeek() {
  return (
    <div className="doedtc2-feature-card__peek-inner doedtc2-feature-card__peek-inner--reminder">
      <div className="doedtc2-feature-card__scene doedtc2-feature-card__scene--reminder">
        <span className="doedtc2-feature-card__reminder-icon" aria-hidden>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M12 6v6l3.5 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <div className="doedtc2-feature-card__reminder-copy">
          <p className="doedtc2-feature-card__reminder-title">Ozempic reminder</p>
          <p className="doedtc2-feature-card__reminder-time">Tonight at 8:00 PM</p>
        </div>
      </div>
    </div>
  );
}

function FamilyPeek() {
  return (
    <div className="doedtc2-feature-card__peek-inner doedtc2-feature-card__peek-inner--family">
      <div className="doedtc2-feature-card__scene doedtc2-feature-card__scene--family">
        <div className="doedtc2-feature-card__avatars" aria-hidden>
          <span className="doedtc2-feature-card__avatar doedtc2-feature-card__avatar--first">S</span>
          <span className="doedtc2-feature-card__avatar doedtc2-feature-card__avatar--second">M</span>
        </div>
        <div className="doedtc2-feature-card__family-list">
          <div className="doedtc2-feature-card__family-member">
            <span className={`doedtc2-feature-card__family-name ${plusJakartaSans.className}`}>Simon</span>
            <span className="doedtc-tag">Son</span>
          </div>
          <div className="doedtc2-feature-card__family-member">
            <span className={`doedtc2-feature-card__family-name ${plusJakartaSans.className}`}>Mom</span>
            <span className="doedtc-tag">Caregiver</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const FEATURE_CARDS: FeatureCard[] = [
  {
    id: "imessage",
    title: "Text Doe over iMessage",
    description:
      "Reach your health companion the same way you text a friend. No app download. Just reply when something feels off.",
    ctaLabel: "Text Doe",
    peek: <IMessagePeek />,
  },
  {
    id: "chart",
    title: "Your chart, always ready",
    description:
      "Meds, conditions, and labs stay organized so Doe can answer with your real history, not generic advice.",
    ctaLabel: "Build Chart",
    peek: <ChartPeek />,
  },
  {
    id: "reminders",
    title: "Reminders that follow through",
    description:
      "One-shot nudges or daily check-ins. Doe texts you on schedule and keeps the thread going until it is handled.",
    ctaLabel: "Remind Me",
    peek: <ReminderPeek />,
  },
  {
    id: "family",
    title: "Family on the same thread",
    description:
      "Add the people you care for and text Doe about them: bath time, refills, or a sore throat for your kid.",
    ctaLabel: "Connect Family",
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
                  <button
                    type="button"
                    className="doedtc-button doedtc-button--inline doedtc2-feature-card__cta"
                    onClick={scrollToLandingForm}
                  >
                    {feature.ctaLabel}
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
