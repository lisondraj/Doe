"use client";

import type { CSSProperties } from "react";
import {
  PRODUCT2_LANDING_CALL_HISTORY_LABEL,
  PRODUCT2_LANDING_DAY_SUMMARY,
  PRODUCT2_LANDING_GREETING_LINE,
  PRODUCT2_LANDING_GREETING_NAME,
  PRODUCT2_LANDING_TAB_LABEL,
} from "@/lib/product2/product2-copy";
import "@/lib/product2/product2-landing.css";
import { Product2ActiveAgentsOrbit } from "@/components/product2/Product2ActiveAgentsOrbit";
import { Product2LandingLiveThread } from "@/components/product2/Product2LandingLiveThread";
import { dmSans, suisseIntl } from "@/lib/home/fonts";

function VolumeChart({ values, labels }: { values: readonly number[]; labels: readonly string[] }) {
  const max = Math.max(...values, 1);

  return (
    <div className="product-landing-volume-wrap">
      <div className="product-landing-volume" aria-hidden>
        {values.map((value, index) => (
          <span
            key={index}
            className={`product-landing-volume__bar ${index < 4 ? "product-landing-volume__bar--overnight" : ""}`}
            style={{ height: `${Math.max(18, (value / max) * 100)}%` }}
          />
        ))}
      </div>
      <div className="product-landing-volume__labels" aria-hidden>
        {labels.map((label) => (
          <span key={label} className={`product-landing-volume__label ${dmSans.className}`}>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

function DayNightSplit({ overnight, clinicHours }: { overnight: number; clinicHours: number }) {
  const total = overnight + clinicHours;
  const overnightPct = (overnight / total) * 100;

  return (
    <div className="product-landing-split" aria-hidden>
      <div className="product-landing-split__track">
        <span className="product-landing-split__overnight" style={{ width: `${overnightPct}%` }} />
        <span className="product-landing-split__day" style={{ width: `${100 - overnightPct}%` }} />
      </div>
      <div className={`product-landing-split__legend ${dmSans.className}`}>
        <span className="product-landing-split__legend-item">
          <span className="product-landing-split__swatch product-landing-split__swatch--overnight" />
          {overnight} overnight
        </span>
        <span className="product-landing-split__legend-item">
          <span className="product-landing-split__swatch product-landing-split__swatch--day" />
          {clinicHours} clinic hours
        </span>
      </div>
    </div>
  );
}

function ResolutionRing({ pct }: { pct: number }) {
  const radius = 42;
  const stroke = 7;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - pct / 100);

  return (
    <div className="product-landing-ring" aria-hidden>
      <svg className="product-landing-ring__svg" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} className="product-landing-ring__track" strokeWidth={stroke} />
        <circle
          cx="50"
          cy="50"
          r={radius}
          className="product-landing-ring__progress"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="product-landing-ring__inner">
        <span className={`product-landing-ring__value ${dmSans.className}`}>{pct}%</span>
        <span className={`product-landing-ring__caption ${dmSans.className}`}>resolved</span>
      </div>
    </div>
  );
}

function NextAppointmentLead({
  appointment,
}: {
  appointment: (typeof PRODUCT2_LANDING_DAY_SUMMARY.todayAhead.nextAppointment);
}) {
  return (
    <div className="product-landing-ahead-carousel__appointment">
      <div className="product-landing-ahead-carousel__appointment-head">
        <span className={`product-landing-ahead-carousel__appointment-eyebrow ${suisseIntl.className}`}>
          {appointment.label}
        </span>
        <span className={`product-landing-ahead-carousel__appointment-relative ${suisseIntl.className}`}>
          {appointment.relative}
        </span>
      </div>
      <p className={`product-landing-ahead-carousel__appointment-time m-0 ${dmSans.className}`}>{appointment.time}</p>
      <p className={`product-landing-ahead-carousel__appointment-patient m-0 ${dmSans.className}`}>
        {appointment.patient}
      </p>
      <div className="product-landing-ahead-carousel__appointment-meta">
        <span className={`product-landing-ahead-carousel__appointment-detail ${dmSans.className}`}>
          {appointment.detail}
        </span>
        <span className={`product-landing-ahead-carousel__appointment-location ${dmSans.className}`}>
          {appointment.location}
        </span>
      </div>
    </div>
  );
}

function TodayAheadCarousel({
  items,
  nextAppointment,
}: {
  items: readonly (typeof PRODUCT2_LANDING_DAY_SUMMARY.todayAhead.timeline)[number][];
  nextAppointment: (typeof PRODUCT2_LANDING_DAY_SUMMARY.todayAhead.nextAppointment);
}) {
  const stackItems = items.slice(1, 4);

  return (
    <div className="product-landing-ahead-carousel" aria-label="Today's schedule">
      <div
        className="product-landing-ahead-carousel__stack"
        style={{ "--stack-count": stackItems.length } as CSSProperties}
      >
        <article
          className="product-landing-ahead-carousel__lead"
          aria-label={`${nextAppointment.label}: ${nextAppointment.time}, ${nextAppointment.patient}, ${nextAppointment.detail} at ${nextAppointment.location}`}
        >
          <NextAppointmentLead appointment={nextAppointment} />
        </article>

        {stackItems.map((item, index) => (
          <article
            key={item.id}
            className={`product-landing-ahead-carousel__card product-landing-ahead-carousel__card--${item.state}`}
            style={{ "--stack-i": index } as CSSProperties}
            aria-hidden
          />
        ))}
      </div>
    </div>
  );
}

function DaySummaryHero({ inConsole = false }: { inConsole?: boolean }) {
  const { last24h, todayAhead } = PRODUCT2_LANDING_DAY_SUMMARY;

  return (
    <section
      className={`product-landing-day-summary${inConsole ? " product-landing-day-summary--console" : ""}`}
      aria-labelledby="day-summary-greeting-name"
    >
      <div className="product-landing-day-summary__shell">
        <div className="product-landing-day-summary__header flex flex-col items-start gap-0 pb-4">
          <div className="product-landing-day-summary__intro">
            <p
              className={`product-landing-day-summary__greeting-line m-0 font-normal leading-[1.05] tracking-[-0.02em] ${suisseIntl.className}`}
            >
              {PRODUCT2_LANDING_GREETING_LINE}
            </p>
            <p
              id="day-summary-greeting-name"
              className={`product-landing-day-summary__greeting-name m-0 mt-1 font-normal leading-[0.95] tracking-[-0.035em] ${dmSans.className}`}
            >
              {PRODUCT2_LANDING_GREETING_NAME}
            </p>
          </div>
        </div>

        <div className="product-landing-day-summary__split">
          <div className="product-landing-day-summary__section-labels">
            <p
              className={`product-landing-day-summary__section-label m-0 text-[10px] font-semibold uppercase tracking-[0.12em] ${suisseIntl.className}`}
            >
              {last24h.label}
            </p>
            <p
              className={`product-landing-day-summary__section-label m-0 text-[10px] font-semibold uppercase tracking-[0.12em] ${suisseIntl.className}`}
            >
              {todayAhead.label}
            </p>
          </div>

          <div className="product-landing-day-summary__columns">
            <div className="product-landing-day-summary__column">
              <div className="product-landing-day-summary__hero-row">
                <VolumeChart values={last24h.volume} labels={last24h.volumeLabels} />
                <div className="product-landing-day-summary__total product-landing-day-summary__total--overlay">
                  <span className={`product-landing-day-summary__total-value ${dmSans.className}`}>
                    {last24h.totalCalls}
                  </span>
                  <span className={`product-landing-day-summary__total-label ${dmSans.className}`}>calls</span>
                </div>
              </div>

              <div className="product-landing-day-summary__visual-row">
                <ResolutionRing pct={last24h.resolvedPct} />
                <div className="product-landing-stat-strip">
                  {last24h.tiles.map((tile) => (
                    <div key={tile.id} className={`product-landing-stat-strip__item product-landing-stat-strip__item--${tile.id}`}>
                      <span className={`product-landing-stat-strip__value ${dmSans.className}`}>{tile.value}</span>
                      <span className={`product-landing-stat-strip__label ${dmSans.className}`}>{tile.label}</span>
                      <span className={`product-landing-stat-strip__detail ${dmSans.className}`}>{tile.detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              <DayNightSplit overnight={last24h.split.overnight} clinicHours={last24h.split.clinicHours} />
            </div>

            <div className="product-landing-day-summary__column product-landing-day-summary__column--ahead">
              <TodayAheadCarousel items={todayAhead.timeline} nextAppointment={todayAhead.nextAppointment} />

              <div className="product-landing-day-summary__timeline-h" aria-label="Today's call flow">
                {todayAhead.timeline.map((item, index) => (
                  <div
                    key={item.id}
                    className={`product-landing-day-summary__timeline-h-step product-landing-day-summary__timeline-h-step--${item.state}`}
                  >
                    <div className="product-landing-day-summary__timeline-h-node-wrap">
                      <span className="product-landing-day-summary__timeline-h-dot" aria-hidden />
                      {index < todayAhead.timeline.length - 1 ? (
                        <span className="product-landing-day-summary__timeline-h-line" aria-hidden />
                      ) : null}
                    </div>
                    <span className={`product-landing-day-summary__timeline-h-time ${dmSans.className}`}>{item.time}</span>
                    <span className={`product-landing-day-summary__timeline-h-label ${dmSans.className}`}>{item.label}</span>
                    <span className={`product-landing-day-summary__timeline-h-detail ${dmSans.className}`}>{item.detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Physician morning command center for the clinic voice agent. */
export function Product2LandingPanel() {
  return (
    <div className="product-landing-panel flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="product-landing-console-shell shrink-0">
        <header className={`product-landing-header flex items-center gap-2 ${suisseIntl.className}`}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className="product-landing-header__icon shrink-0"
          >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
          <h1 className="product-landing-header__title m-0 font-normal tracking-tight">
            {PRODUCT2_LANDING_TAB_LABEL}
          </h1>
        </header>

        <section className="product-landing-call shrink-0" aria-label="Voice summary">
          <div className="product-landing-call__stage relative">
            <DaySummaryHero inConsole />
          </div>
        </section>
      </div>

      <div className="product-landing-panel__divider" role="separator" aria-hidden />

      <div className="product-landing-workspace min-h-0 flex-1">
        <Product2ActiveAgentsOrbit />
        <p
          className={`product-landing-workspace__label m-0 text-[10px] font-semibold uppercase tracking-[0.12em] ${suisseIntl.className}`}
        >
          {PRODUCT2_LANDING_CALL_HISTORY_LABEL}
        </p>
        <Product2LandingLiveThread />
      </div>
    </div>
  );
}
