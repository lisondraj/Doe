"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";

import { plusJakartaSans } from "@/lib/home/fonts";

const PIN_START_HOLD = 0.1;
const PIN_END_HOLD = 0.1;

const SUPPORTS_VIEW_TIMELINE =
  typeof CSS !== "undefined" &&
  (CSS.supports("animation-timeline: view()") || CSS.supports("view-timeline-name: --x"));

type CarouselMetrics = {
  trackDocTop: number;
  scrollRange: number;
  startX: number;
  deltaX: number;
};

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

function applyCarouselScroll(row: HTMLDivElement, metrics: CarouselMetrics) {
  const trackTop = metrics.trackDocTop - window.scrollY;
  const pinProgress = clamp01(-trackTop / metrics.scrollRange);
  const panSpan = 1 - PIN_START_HOLD - PIN_END_HOLD;
  const horizontalProgress = clamp01((pinProgress - PIN_START_HOLD) / panSpan);
  const translateX = metrics.startX + horizontalProgress * metrics.deltaX;

  row.style.transform = `translate3d(${translateX}px, 0, 0)`;
}

function scrollToLandingForm() {
  document.querySelector(".doedtc2-landing")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function IMessagePeek() {
  return (
    <div className="doedtc2-feature-card__peek-inner doedtc2-feature-card__peek-inner--imessage">
      <div className="doedtc2-feature-card__scene doedtc2-feature-card__scene--imessage">
        <div className="doedtc2-feature-card__imessage-thread">
          <div className="doedtc2-feature-card__bubble doedtc2-feature-card__bubble--outgoing">
            Just started Ozempic. Nausea every night.
          </div>
          <div className="doedtc2-feature-card__bubble doedtc2-feature-card__bubble--incoming">
            That&apos;s common the first few weeks. Is it worse after meals?
          </div>
          <div className="doedtc2-feature-card__bubble doedtc2-feature-card__bubble--outgoing">
            Yeah, especially dinner.
          </div>
          <div className="doedtc2-feature-card__bubble doedtc2-feature-card__bubble--incoming">
            I&apos;ll set up a side-effect tracker on your chart.
          </div>
          <div className="doedtc2-feature-card__bubble doedtc2-feature-card__bubble--incoming">
            Sending a visual injection guide with pin rotation and site tracking.
          </div>
        </div>
      </div>
    </div>
  );
}

function ChartPeek() {
  return (
    <div className="doedtc2-feature-card__peek-inner doedtc2-feature-card__peek-inner--chart">
      <div className="doedtc2-feature-card__scene doedtc2-feature-card__scene--chart">
        <div className="doedtc2-feature-card__chart-thread">
          <div className="doedtc2-feature-card__bubble doedtc2-feature-card__bubble--outgoing">
            Which vaccines does Simon need?
          </div>
          <div className="doedtc2-feature-card__bubble doedtc2-feature-card__bubble--incoming doedtc2-feature-card__bubble--with-attachment">
            <p className="doedtc2-feature-card__bubble-text">
              Your son, Simon is 8 years old and is due for flu and Tdap.
            </p>
            <div className="doedtc2-feature-card__bubble-attachment">
              <div className="doedtc2-feature-card__profile-widget-head">
                <span className="doedtc2-feature-card__profile-widget-avatar" aria-hidden>
                  S
                </span>
                <div className="doedtc2-feature-card__profile-widget-identity">
                  <span className={`doedtc2-feature-card__profile-widget-name ${plusJakartaSans.className}`}>
                    Simon&apos;s chart
                  </span>
                </div>
              </div>
              <ul className="doedtc2-feature-card__vaccine-list">
                <li className="doedtc2-feature-card__vaccine-item">
                  <span className="doedtc2-feature-card__vaccine-name">MMR</span>
                  <span className="doedtc2-feature-card__vaccine-date">Mar 2023</span>
                </li>
                <li className="doedtc2-feature-card__vaccine-item">
                  <span className="doedtc2-feature-card__vaccine-name">DTaP</span>
                  <span className="doedtc2-feature-card__vaccine-date">Aug 2024</span>
                </li>
                <li className="doedtc2-feature-card__vaccine-item">
                  <span className="doedtc2-feature-card__vaccine-name">Polio</span>
                  <span className="doedtc2-feature-card__vaccine-date">Jan 2022</span>
                </li>
              </ul>
            </div>
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
        <div className="doedtc2-feature-card__reminder-lockup">
          <p className={`doedtc2-feature-card__reminder-time ${plusJakartaSans.className}`}>8:00</p>
          <p className="doedtc2-feature-card__reminder-when">Tonight</p>
          <div className="doedtc2-feature-card__reminder-person">
            <span
              className="doedtc2-feature-card__profile-widget-avatar doedtc2-feature-card__profile-widget-avatar--grandmother"
              aria-hidden
            >
              Su
            </span>
            <span className={`doedtc2-feature-card__reminder-name ${plusJakartaSans.className}`}>Susan</span>
            <span className="doedtc-tag">Grandmother</span>
          </div>
          <p className="doedtc2-feature-card__reminder-note">Take your evening meds</p>
          <span className="doedtc-tag doedtc-tag--waiting">Awaiting reply</span>
        </div>
      </div>
    </div>
  );
}

const FAMILY_PEEK_MEMBERS = [
  { name: "Simon", label: "Son", initial: "S", tone: "son" },
  { name: "Janice", label: "You", initial: "J", tone: "you" },
  { name: "Fred", label: "Partner", initial: "F", tone: "partner" },
  { name: "Susan", label: "Grandmother", initial: "Su", tone: "grandmother" },
] as const;

function FamilyPeek() {
  return (
    <div className="doedtc2-feature-card__peek-inner doedtc2-feature-card__peek-inner--family">
      <div className="doedtc2-feature-card__scene doedtc2-feature-card__scene--family">
        <div className="doedtc2-feature-card__family-panel">
          <div className="doedtc2-feature-card__avatars" aria-hidden>
            {FAMILY_PEEK_MEMBERS.map((member) => (
              <span
                key={member.name}
                className={`doedtc2-feature-card__avatar doedtc2-feature-card__avatar--${member.tone}`}
              >
                {member.initial}
              </span>
            ))}
          </div>
          <div className="doedtc2-feature-card__family-list">
            {FAMILY_PEEK_MEMBERS.map((member) => (
              <div key={member.name} className="doedtc2-feature-card__family-member">
                <span className={`doedtc2-feature-card__family-name ${plusJakartaSans.className}`}>
                  {member.name}
                </span>
                <span className="doedtc-tag">{member.label}</span>
              </div>
            ))}
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
      "Reach your health companion the same way you text a friend. Ask about Ozempic, side effects, or refills and get a tracker or guide in the thread.",
    ctaLabel: "Text Doe",
    peek: <IMessagePeek />,
  },
  {
    id: "chart",
    title: "Your chart, always ready",
    description:
      "Meds, vaccines, and labs stay on the chart so Doe can answer about your family with real history, not generic advice.",
    ctaLabel: "Build Chart",
    peek: <ChartPeek />,
  },
  {
    id: "reminders",
    title: "Reminders that follow through",
    description:
      "Doe texts your grandmother Susan on schedule, then stays on the thread until she replies.",
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
  const metricsRef = useRef<CarouselMetrics>({
    trackDocTop: 0,
    scrollRange: 1,
    startX: 0,
    deltaX: 0,
  });
  const rafRef = useRef<number>(0);

  const measureCarousel = useCallback(() => {
    const track = trackRef.current;
    const row = rowRef.current;
    const card = cardRef.current;
    if (!track || !row || !card) return;

    const viewport = window.innerHeight || 1;
    const trackHeight = track.offsetHeight;
    const scrollRange = Math.max(trackHeight - viewport, 1);
    const trackDocTop = track.getBoundingClientRect().top + window.scrollY;

    const cardWidth = card.offsetWidth;
    const rowStyle = getComputedStyle(row);
    const gap = Number.parseFloat(rowStyle.gap || "0") || 0;
    const paddingLeft = Number.parseFloat(rowStyle.paddingLeft || "0") || 0;
    const viewportWidth = row.parentElement?.clientWidth ?? window.innerWidth;
    const step = cardWidth + gap;
    const lastIndex = Math.max(row.children.length - 1, 0);

    const centerOffsetForIndex = (index: number) => {
      const cardCenter = paddingLeft + index * step + cardWidth / 2;
      return viewportWidth / 2 - cardCenter;
    };

    const startX = centerOffsetForIndex(0);
    const endX = centerOffsetForIndex(lastIndex);

    row.style.setProperty("--doedtc2-features-start-x", `${startX}px`);
    row.style.setProperty("--doedtc2-features-end-x", `${endX}px`);

    const cover = trackHeight + viewport;
    const pinStartCover = (viewport / cover) * 100;
    const pinEndCover = (trackHeight / cover) * 100;
    row.style.setProperty(
      "animation-range",
      `cover ${pinStartCover}% cover ${pinEndCover}%`,
    );

    metricsRef.current = {
      trackDocTop,
      scrollRange,
      startX,
      deltaX: endX - startX,
    };

    if (!SUPPORTS_VIEW_TIMELINE) {
      applyCarouselScroll(row, metricsRef.current);
    }
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    const row = rowRef.current;
    if (!track || !row) return;

    measureCarousel();

    const resizeObserver = new ResizeObserver(measureCarousel);
    resizeObserver.observe(track);
    resizeObserver.observe(row);

    if (SUPPORTS_VIEW_TIMELINE) {
      row.classList.add("doedtc2-features__row--view-timeline");
      return () => {
        resizeObserver.disconnect();
        row.classList.remove("doedtc2-features__row--view-timeline");
      };
    }

    const scheduleScroll = () => {
      if (rafRef.current) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = 0;
        applyCarouselScroll(row, metricsRef.current);
      });
    };

    window.addEventListener("scroll", scheduleScroll, { passive: true });
    window.visualViewport?.addEventListener("scroll", scheduleScroll, { passive: true });
    window.addEventListener("resize", measureCarousel);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", scheduleScroll);
      window.visualViewport?.removeEventListener("scroll", scheduleScroll);
      window.removeEventListener("resize", measureCarousel);
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [measureCarousel]);

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
