"use client";

import {
  PRODUCT2_LANDING_DAY_SUMMARY,
  PRODUCT2_LANDING_GREETING_LINE,
  PRODUCT2_LANDING_GREETING_NAME,
} from "@/lib/product2/product2-copy";
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

/** Last-24-hours column from the /product2 Today panel (Dr. Chen greeting + volume + stats). */
export function Product2DaySummaryLast24h({ inConsole = false }: { inConsole?: boolean }) {
  const { last24h } = PRODUCT2_LANDING_DAY_SUMMARY;

  return (
    <section
      className={`product-landing-day-summary product-landing-day-summary--last24h${inConsole ? " product-landing-day-summary--console" : ""}`}
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

        <div className="product-landing-day-summary__split product-landing-day-summary__split--last24h">
          <div className="product-landing-day-summary__section-labels">
            <p
              className={`product-landing-day-summary__section-label m-0 text-[10px] font-semibold uppercase tracking-[0.12em] ${suisseIntl.className}`}
            >
              {last24h.label}
            </p>
          </div>

          <div className="product-landing-day-summary__columns product-landing-day-summary__columns--last24h">
            <div className="product-landing-day-summary__column product-landing-day-summary__column--last24h">
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
          </div>
        </div>
      </div>
    </section>
  );
}
