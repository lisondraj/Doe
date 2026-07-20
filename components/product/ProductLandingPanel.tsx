"use client";

import {
  PRODUCT_LANDING_ATTENTION,
  PRODUCT_LANDING_CONSOLE,
  PRODUCT_LANDING_DAY_SUMMARY,
  PRODUCT_LANDING_GREETING,
  PRODUCT_LANDING_LINES,
  PRODUCT_LANDING_QUEUE,
  PRODUCT_LANDING_SECONDARY_CTA,
  PRODUCT_LANDING_TRANSCRIPT,
} from "@/lib/product/product-copy";
import "@/lib/product/product-landing.css";
import { dmSans, inter, suisseIntl } from "@/lib/home/fonts";

function MicIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  );
}

function WaveformBars() {
  return (
    <div className="product-voice-waveform" aria-hidden>
      {Array.from({ length: 20 }).map((_, i) => (
        <span key={i} className="product-voice-waveform__bar" />
      ))}
    </div>
  );
}

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
          <span key={label} className={`product-landing-volume__label ${inter.className}`}>
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
      <div className={`product-landing-split__legend ${inter.className}`}>
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
  return (
    <div
      className="product-landing-ring"
      style={{ background: `conic-gradient(var(--pi-accent) ${pct}%, var(--pi-well) ${pct}%)` }}
      aria-hidden
    >
      <div className="product-landing-ring__inner">
        <span className={`product-landing-ring__value ${suisseIntl.className}`}>{pct}%</span>
        <span className={`product-landing-ring__caption ${inter.className}`}>resolved</span>
      </div>
    </div>
  );
}

function MiniWaveform() {
  return (
    <div className="product-landing-mini-waveform" aria-hidden>
      {Array.from({ length: 12 }).map((_, i) => (
        <span key={i} className="product-landing-mini-waveform__bar" />
      ))}
    </div>
  );
}

function DaySummaryHero() {
  const { last24h, todayAhead } = PRODUCT_LANDING_DAY_SUMMARY;

  return (
    <section className="product-landing-day-summary" aria-labelledby="day-summary-title">
      <div className="product-landing-day-summary__shell">
        <div className="product-landing-day-summary__header flex flex-wrap items-end justify-between gap-3 pb-3">
          <p
            className={`product-landing-day-summary__greeting m-0 text-[clamp(1.1rem,0.9rem+0.7vw,1.45rem)] font-normal leading-none tracking-[-0.025em] ${suisseIntl.className}`}
          >
            {PRODUCT_LANDING_GREETING}
          </p>
          <p
            id="day-summary-title"
            className={`product-landing-day-summary__eyebrow m-0 text-[10px] font-semibold uppercase tracking-[0.14em] ${suisseIntl.className}`}
          >
            Last 24 hours · Today ahead
          </p>
        </div>

        <div className="product-landing-day-summary__columns">
          <div className="product-landing-day-summary__column">
            <p
              className={`product-landing-day-summary__section-label m-0 text-[10px] font-semibold uppercase tracking-[0.12em] ${suisseIntl.className}`}
            >
              {last24h.label}
            </p>

            <div className="product-landing-day-summary__hero-row">
              <div className="product-landing-day-summary__total">
                <span className={`product-landing-day-summary__total-value ${suisseIntl.className}`}>
                  {last24h.totalCalls}
                </span>
                <span className={`product-landing-day-summary__total-label ${inter.className}`}>calls</span>
              </div>
              <VolumeChart values={last24h.volume} labels={last24h.volumeLabels} />
            </div>

            <div className="product-landing-day-summary__visual-row">
              <ResolutionRing pct={last24h.resolvedPct} />
              <div className="product-landing-stat-strip">
                {last24h.tiles.map((tile) => (
                  <div key={tile.id} className="product-landing-stat-strip__item">
                    <span className={`product-landing-stat-strip__value ${suisseIntl.className}`}>{tile.value}</span>
                    <span className={`product-landing-stat-strip__label ${inter.className}`}>{tile.label}</span>
                    <span className={`product-landing-stat-strip__detail ${inter.className}`}>{tile.detail}</span>
                  </div>
                ))}
              </div>
            </div>

            <DayNightSplit overnight={last24h.split.overnight} clinicHours={last24h.split.clinicHours} />
          </div>

          <div className="product-landing-day-summary__column">
            <p
              className={`product-landing-day-summary__section-label m-0 text-[10px] font-semibold uppercase tracking-[0.12em] ${suisseIntl.className}`}
            >
              {todayAhead.label}
            </p>

            <div className="product-landing-day-summary__live-strip">
              <div className="product-landing-day-summary__live-top">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="product-landing-day-summary__live-dot" aria-hidden />
                    <span className={`product-landing-day-summary__live-label text-[10px] font-semibold uppercase tracking-[0.1em] ${suisseIntl.className}`}>
                      Live now
                    </span>
                  </div>
                  <p className={`product-landing-day-summary__live-caller m-0 mt-1.5 ${suisseIntl.className}`}>
                    {todayAhead.liveCaller}
                  </p>
                  <p className={`product-landing-day-summary__live-detail m-0 mt-1 ${inter.className}`}>
                    {todayAhead.liveDetail}
                  </p>
                </div>
                <MiniWaveform />
              </div>
            </div>

            <div className="product-landing-stat-strip product-landing-stat-strip--compact">
              <div className="product-landing-stat-strip__item">
                <span className={`product-landing-stat-strip__value ${suisseIntl.className}`}>{todayAhead.queue}</span>
                <span className={`product-landing-stat-strip__label ${inter.className}`}>In queue</span>
              </div>
              <div className="product-landing-stat-strip__item">
                <span className={`product-landing-stat-strip__value ${suisseIntl.className}`}>{todayAhead.needsYou}</span>
                <span className={`product-landing-stat-strip__label ${inter.className}`}>Need you</span>
              </div>
              <div className="product-landing-stat-strip__item">
                <span className={`product-landing-stat-strip__value product-landing-stat-strip__value--small ${suisseIntl.className}`}>
                  {todayAhead.peakWindow}
                </span>
                <span className={`product-landing-stat-strip__label ${inter.className}`}>{todayAhead.peakDetail}</span>
              </div>
            </div>

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
                  <span className={`product-landing-day-summary__timeline-h-time ${inter.className}`}>{item.time}</span>
                  <span className={`product-landing-day-summary__timeline-h-label ${suisseIntl.className}`}>{item.label}</span>
                  <span className={`product-landing-day-summary__timeline-h-detail ${inter.className}`}>{item.detail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Physician morning command center for the clinic voice agent. */
export function ProductLandingPanel() {
  return (
    <div className="product-landing-panel flex min-h-0 flex-1 flex-col overflow-hidden">
      <header className="product-landing-header flex items-center gap-2 border-b px-4 py-3">
        <MicIcon className="product-landing-header__icon h-5 w-5 shrink-0" />
        <h1 className={`product-landing-header__title m-0 text-[15px] font-semibold tracking-tight ${suisseIntl.className}`}>
          Voice
        </h1>
      </header>

      <div className="product-landing-body min-h-0 flex-1 overflow-y-auto">
        <DaySummaryHero />

        <div className="product-landing-grid grid min-h-0 gap-0 px-0 pb-0 xl:grid-cols-[minmax(0,1.55fr)_minmax(18rem,0.95fr)]">
          <div className="product-landing-main flex min-h-0 flex-col">
            <section className="product-landing-call" aria-labelledby="product-live-call-title">
              <div className="product-landing-call__stage relative overflow-hidden px-[clamp(1rem,2vw,1.35rem)] py-[clamp(1.1rem,2.2vw,1.55rem)]">
                <div className="relative z-[1] flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p
                        id="product-live-call-title"
                        className={`product-landing-call__state m-0 text-[10px] font-semibold uppercase tracking-[0.14em] ${suisseIntl.className}`}
                      >
                        {PRODUCT_LANDING_CONSOLE.stateLabel}
                      </p>
                      <span
                        className={`product-landing-call__status inline-flex rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.08em] ${suisseIntl.className}`}
                      >
                        {PRODUCT_LANDING_CONSOLE.agentStatus}
                      </span>
                    </div>
                    <p
                      className={`product-landing-call__caller m-0 mt-2 text-[clamp(1.25rem,0.95rem+0.85vw,1.65rem)] font-normal leading-none tracking-[-0.03em] ${suisseIntl.className}`}
                    >
                      {PRODUCT_LANDING_CONSOLE.caller}
                    </p>
                    <p className={`product-landing-call__context m-0 mt-1.5 text-[11px] ${inter.className}`}>
                      {PRODUCT_LANDING_CONSOLE.patientContext}
                    </p>
                    <p className={`product-landing-call__reason m-0 mt-1 text-[13px] ${inter.className}`}>
                      {PRODUCT_LANDING_CONSOLE.reason}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`product-landing-call__duration rounded-md px-2 py-1 text-[11px] font-medium tabular-nums ${inter.className}`}
                    >
                      {PRODUCT_LANDING_CONSOLE.duration}
                    </span>
                    <span className={`product-landing-call__line text-[10px] ${inter.className}`}>
                      {PRODUCT_LANDING_CONSOLE.line}
                    </span>
                  </div>
                </div>

                <div className="relative z-[1] mt-[clamp(1.1rem,2vw,1.5rem)] flex flex-col items-center">
                  <WaveformBars />
                  <p
                    className={`product-landing-call__agent-line m-0 mt-3.5 max-w-[30rem] text-center text-[13px] leading-[1.42] ${dmSans.className}`}
                  >
                    {PRODUCT_LANDING_CONSOLE.agentLine}
                  </p>
                </div>
              </div>

              <div className="product-landing-chat mt-0 rounded-none border-t border-[var(--pi-line)] xl:mx-4 xl:mb-4 xl:mt-3 xl:rounded-[18px] xl:border">
                <div className="product-landing-chat__toolbar flex items-center justify-between gap-3 px-4 py-2.5">
                  <p
                    className={`product-landing-chat__label m-0 text-[10px] font-semibold uppercase tracking-[0.12em] ${suisseIntl.className}`}
                  >
                    Live conversation
                  </p>
                  <button
                    type="button"
                    className={`product-landing-cta-secondary inline-flex h-[30px] items-center justify-center rounded-[8px] px-2.5 text-[10px] font-medium transition-colors ${suisseIntl.className}`}
                  >
                    {PRODUCT_LANDING_SECONDARY_CTA}
                  </button>
                </div>
                <div className="product-landing-chat__thread px-4 py-4">
                  <div className="product-voice-chat mx-auto flex max-w-[36rem] flex-col gap-3">
                    {PRODUCT_LANDING_TRANSCRIPT.map((line) => {
                      const isAgent = line.speaker === "Doe";
                      return (
                        <div
                          key={`${line.time}-${line.text}`}
                          className={`product-voice-chat__row ${isAgent ? "product-voice-chat__row--agent" : "product-voice-chat__row--patient"}`}
                        >
                          <div className="product-voice-chat__bubble">
                            <div className="flex items-baseline justify-between gap-3">
                              <p
                                className={`product-voice-chat__speaker m-0 text-[10px] font-semibold uppercase tracking-[0.1em] ${suisseIntl.className}`}
                              >
                                {line.speaker}
                              </p>
                              <span
                                className={`product-voice-chat__time shrink-0 text-[10px] tabular-nums ${inter.className}`}
                              >
                                {line.time}
                              </span>
                            </div>
                            <p
                              className={`product-voice-chat__text m-0 mt-1 text-[13px] leading-[1.42] tracking-[-0.01em] ${
                                isAgent ? dmSans.className : inter.className
                              }`}
                            >
                              {line.text}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside className="product-landing-sidebar">
            <section className="product-landing-sidebar__section">
              <div className="product-landing-sidebar__section-head">
                <p
                  className={`product-landing-sidebar__label m-0 text-[10px] font-semibold uppercase tracking-[0.14em] ${suisseIntl.className}`}
                >
                  Needs your eye
                </p>
                <p className={`product-landing-sidebar__hint m-0 mt-1 text-[12px] ${inter.className}`}>
                  Doe finished these. You decide the next move.
                </p>
              </div>
              <ul className="product-landing-attention m-0 list-none p-0">
                {PRODUCT_LANDING_ATTENTION.map((item) => (
                  <li key={item.id} className={`product-landing-attention__row product-landing-attention__row--${item.urgency}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`product-landing-attention__badge inline-flex text-[9px] font-semibold uppercase tracking-[0.08em] ${suisseIntl.className}`}
                          >
                            {item.label}
                          </span>
                          {item.urgency === "high" ? (
                            <span
                              className={`product-landing-attention__urgency inline-flex text-[9px] font-semibold uppercase tracking-[0.08em] ${suisseIntl.className}`}
                            >
                              Priority
                            </span>
                          ) : null}
                        </div>
                        <p
                          className={`product-landing-attention__title m-0 mt-1.5 text-[13px] font-semibold leading-snug tracking-[-0.015em] ${suisseIntl.className}`}
                        >
                          {item.title}
                        </p>
                        <p className={`product-landing-attention__detail m-0 mt-1 text-[11px] leading-[1.42] ${inter.className}`}>
                          {item.detail}
                        </p>
                      </div>
                      <button
                        type="button"
                        className={`product-landing-attention__action shrink-0 text-[10px] font-medium transition-colors ${suisseIntl.className}`}
                      >
                        {item.action}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="product-landing-sidebar__section">
              <div className="product-landing-sidebar__section-head">
                <p
                  className={`product-landing-sidebar__label m-0 text-[10px] font-semibold uppercase tracking-[0.14em] ${suisseIntl.className}`}
                >
                  Call queue
                </p>
                <p className={`product-landing-sidebar__hint m-0 mt-1 text-[12px] ${inter.className}`}>
                  {PRODUCT_LANDING_DAY_SUMMARY.todayAhead.queue} callers waiting after the active line
                </p>
              </div>
              <ul className="product-landing-queue m-0 list-none p-0">
                {PRODUCT_LANDING_QUEUE.map((item, index) => (
                  <li key={item.id} className="product-landing-queue__row">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p
                          className={`product-landing-queue__position m-0 text-[10px] font-semibold uppercase tracking-[0.1em] ${suisseIntl.className}`}
                        >
                          Next {index + 1}
                        </p>
                        <p
                          className={`product-landing-queue__caller m-0 mt-1 text-[13px] font-semibold tracking-[-0.015em] ${suisseIntl.className}`}
                        >
                          {item.caller}
                        </p>
                        <p className={`product-landing-queue__reason m-0 mt-0.5 text-[11px] ${inter.className}`}>
                          {item.reason}
                        </p>
                      </div>
                      <span
                        className={`product-landing-queue__wait shrink-0 text-[10px] font-medium tabular-nums ${inter.className}`}
                      >
                        {item.wait}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="product-landing-sidebar__section">
              <div className="product-landing-sidebar__section-head">
                <p
                  className={`product-landing-sidebar__label m-0 text-[10px] font-semibold uppercase tracking-[0.14em] ${suisseIntl.className}`}
                >
                  Your lines
                </p>
              </div>
              <ul className="product-landing-lines m-0 list-none p-0">
                {PRODUCT_LANDING_LINES.map((line) => (
                  <li key={line.id} className={`product-landing-lines__row product-landing-lines__row--${line.status}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p
                          className={`product-landing-lines__label m-0 text-[13px] font-semibold tracking-[-0.015em] ${suisseIntl.className}`}
                        >
                          {line.label}
                        </p>
                        <p className={`product-landing-lines__number m-0 mt-0.5 text-[11px] ${inter.className}`}>
                          {line.number}
                        </p>
                        <p className={`product-landing-lines__detail m-0 mt-1 text-[11px] ${inter.className}`}>
                          {line.detail}
                        </p>
                      </div>
                      <span
                        className={`product-landing-lines__status shrink-0 text-[9px] font-semibold uppercase tracking-[0.08em] ${suisseIntl.className}`}
                      >
                        {line.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
