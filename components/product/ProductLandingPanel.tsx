"use client";

import { useState } from "react";

import {
  PRODUCT_LANDING_AI_INPUT,
  PRODUCT_LANDING_ATTENTION,
  PRODUCT_LANDING_CONSOLE,
  PRODUCT_LANDING_DAY_SUMMARY,
  PRODUCT_LANDING_GREETING,
  PRODUCT_LANDING_LINES,
  PRODUCT_LANDING_PRIMARY_CTA,
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

function SendIcon({ className }: { className?: string }) {
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
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
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

function MiniWaveform({ tall }: { tall?: boolean }) {
  return (
    <div className={`product-landing-mini-waveform ${tall ? "product-landing-mini-waveform--tall" : ""}`} aria-hidden>
      {Array.from({ length: tall ? 20 : 12 }).map((_, i) => (
        <span key={i} className="product-landing-mini-waveform__bar" />
      ))}
    </div>
  );
}

function LiveAvatar({ initials }: { initials: string }) {
  return (
    <div className="product-landing-live-avatar" aria-hidden>
      <span className="product-landing-live-avatar__ring" />
      <span className={`product-landing-live-avatar__initials ${suisseIntl.className}`}>{initials}</span>
      <span className="product-landing-live-avatar__dot" />
    </div>
  );
}

function QueueLanes({
  items,
  total,
}: {
  items: readonly { id: string; initials: string; progress: number }[];
  total: string;
}) {
  return (
    <div className="product-landing-queue-lanes" aria-hidden>
      <span className={`product-landing-queue-lanes__count ${suisseIntl.className}`}>{total}</span>
      <div className="product-landing-queue-lanes__stack">
        {items.map((item) => (
          <div key={item.id} className="product-landing-queue-lanes__lane">
            <span className={`product-landing-queue-lanes__initials ${suisseIntl.className}`}>{item.initials}</span>
            <span className="product-landing-queue-lanes__track">
              <span className="product-landing-queue-lanes__fill" style={{ width: `${item.progress}%` }} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function NeedsYouDots({ count, max = 5 }: { count: number; max?: number }) {
  return (
    <div className="product-landing-needs-dots product-landing-needs-dots--inline" aria-hidden>
      <span className={`product-landing-needs-dots__count ${suisseIntl.className}`}>{count}</span>
      <div className="product-landing-needs-dots__row">
        {Array.from({ length: max }).map((_, i) => (
          <span
            key={i}
            className={`product-landing-needs-dots__dot ${i < count ? "product-landing-needs-dots__dot--filled" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}

function DayRibbon({
  values,
  labels,
  peakIndex,
  nowIndex,
  peakWindow,
  peakDetail,
}: {
  values: readonly number[];
  labels: readonly string[];
  peakIndex: number;
  nowIndex: number;
  peakWindow: string;
  peakDetail: string;
}) {
  const max = Math.max(...values, 1);
  const width = 100;
  const height = 38;
  const pad = 2;

  const coords = values.map((value, index) => ({
    x: (index / (values.length - 1)) * width,
    y: height - pad - (value / max) * (height - pad * 2),
  }));

  const linePath = coords.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(" ");
  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;

  const nowX = coords[nowIndex]?.x ?? 0;
  const nowY = coords[nowIndex]?.y ?? height / 2;
  const peakStartX = coords[Math.max(0, peakIndex - 1)]?.x ?? 0;
  const peakEndX = coords[Math.min(values.length - 1, peakIndex + 1)]?.x ?? width;

  return (
    <div className="product-landing-day-ribbon" aria-hidden>
      <svg className="product-landing-day-ribbon__svg" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="product-day-ribbon-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(110, 98, 88, 0.28)" />
            <stop offset="100%" stopColor="rgba(110, 98, 88, 0.02)" />
          </linearGradient>
        </defs>
        <rect
          className="product-landing-day-ribbon__peak-zone"
          x={peakStartX}
          y={0}
          width={Math.max(peakEndX - peakStartX, 8)}
          height={height}
        />
        <path className="product-landing-day-ribbon__area" d={areaPath} fill="url(#product-day-ribbon-fill)" />
        <path className="product-landing-day-ribbon__line" d={linePath} />
        <line className="product-landing-day-ribbon__now" x1={nowX} y1={0} x2={nowX} y2={height} />
        <circle className="product-landing-day-ribbon__now-dot" cx={nowX} cy={nowY} r="1.75" />
      </svg>
      <div className="product-landing-day-ribbon__footer">
        <div className="product-landing-day-ribbon__labels">
          {labels.map((label) => (
            <span key={label} className={`product-landing-day-ribbon__label ${inter.className}`}>
              {label}
            </span>
          ))}
        </div>
        <div className="product-landing-day-ribbon__peak">
          <span className={`product-landing-day-ribbon__peak-window ${suisseIntl.className}`}>{peakWindow}</span>
          <span className={`product-landing-day-ribbon__peak-detail ${inter.className}`}>{peakDetail}</span>
        </div>
      </div>
    </div>
  );
}

function FlowPipeline({
  items,
}: {
  items: readonly {
    id: string;
    initials: string;
    label: string;
    detail: string;
    state: "active" | "queued" | "pending";
  }[];
}) {
  return (
    <div className="product-landing-flow" aria-label="Call flow pipeline">
      {items.map((item, index) => (
        <div key={item.id} className={`product-landing-flow__step product-landing-flow__step--${item.state}`}>
          <div className="product-landing-flow__node-wrap">
            {index > 0 ? <span className="product-landing-flow__connector product-landing-flow__connector--before" aria-hidden /> : null}
            <span className={`product-landing-flow__node ${suisseIntl.className}`}>{item.initials}</span>
            {index < items.length - 1 ? (
              <span className="product-landing-flow__connector product-landing-flow__connector--after" aria-hidden />
            ) : null}
          </div>
          <span className={`product-landing-flow__label ${suisseIntl.className}`}>{item.label}</span>
          <span className={`product-landing-flow__detail ${inter.className}`}>{item.detail}</span>
        </div>
      ))}
    </div>
  );
}

function TodayAheadColumn({ today }: { today: (typeof PRODUCT_LANDING_DAY_SUMMARY)["todayAhead"] }) {
  return (
    <div className="product-landing-day-summary__column product-landing-today-ahead">
      <p
        className={`product-landing-day-summary__section-label m-0 text-[10px] font-semibold uppercase tracking-[0.12em] ${suisseIntl.className}`}
      >
        {today.label}
      </p>

      <div className="product-landing-today-ahead__live">
        <LiveAvatar initials={today.liveInitials} />
        <div className="product-landing-today-ahead__live-body min-w-0">
          <div className="flex items-center gap-2">
            <span className="product-landing-today-ahead__live-dot" aria-hidden />
            <span className={`product-landing-today-ahead__live-label text-[10px] font-semibold uppercase tracking-[0.1em] ${suisseIntl.className}`}>
              Live now
            </span>
          </div>
          <p className={`product-landing-today-ahead__live-caller m-0 mt-1.5 ${suisseIntl.className}`}>{today.liveCaller}</p>
          <p className={`product-landing-today-ahead__live-detail m-0 mt-1 ${inter.className}`}>{today.liveDetail}</p>
          <MiniWaveform tall />
        </div>
      </div>

      <FlowPipeline items={today.flow} />

      <DayRibbon
        values={today.forecastVolume}
        labels={today.forecastLabels}
        peakIndex={today.peakBarIndex}
        nowIndex={today.nowIndex}
        peakWindow={today.peakWindow}
        peakDetail={today.peakDetail}
      />

      <div className="product-landing-today-ahead__signals">
        <div className="product-landing-today-ahead__signal">
          <QueueLanes items={today.queueStack} total={today.queue} />
          <span className={`product-landing-today-ahead__signal-caption ${inter.className}`}>In queue</span>
        </div>
        <div className="product-landing-today-ahead__signal">
          <NeedsYouDots count={Number(today.needsYou)} />
          <span className={`product-landing-today-ahead__signal-caption ${inter.className}`}>Need you</span>
        </div>
      </div>
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

          <TodayAheadColumn today={todayAhead} />
        </div>
      </div>
    </section>
  );
}

/** Physician morning command center for the clinic voice agent. */
export function ProductLandingPanel() {
  const [prompt, setPrompt] = useState("");

  return (
    <div className="product-landing-panel flex min-h-0 flex-1 flex-col overflow-hidden">
      <header className="product-landing-header">
        <div className="product-landing-header__brand">
          <MicIcon className="product-landing-header__icon h-[16px] w-[16px] shrink-0" />
          <h1 className={`product-landing-header__title m-0 text-[13px] font-semibold tracking-tight ${suisseIntl.className}`}>
            Voice
          </h1>
        </div>

        <div className="product-landing-header__status min-w-0">
          <span className="product-landing-header__status-dot" aria-hidden />
          <p className={`product-landing-header__status-text m-0 truncate ${inter.className}`}>
            Live · {PRODUCT_LANDING_CONSOLE.caller} · {PRODUCT_LANDING_CONSOLE.line}
          </p>
        </div>

        <button
          type="button"
          className={`product-landing-cta-primary product-landing-header__action ${suisseIntl.className}`}
        >
          {PRODUCT_LANDING_PRIMARY_CTA}
        </button>
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

      <footer className="product-landing-ai-dock shrink-0 border-t px-4 py-3">
        <div className="product-landing-ai-dock__inner mx-auto max-w-[72rem]">
          <p
            className={`product-landing-ai-dock__title m-0 mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] ${suisseIntl.className}`}
          >
            {PRODUCT_LANDING_AI_INPUT.title}
          </p>
          <div className="product-landing-ai-suggestions mb-2 flex flex-wrap gap-1.5">
            {PRODUCT_LANDING_AI_INPUT.suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setPrompt(suggestion)}
                className={`product-landing-ai-suggestion rounded-full px-2.5 py-1 text-left text-[10px] font-medium leading-snug transition-colors ${inter.className}`}
              >
                {suggestion}
              </button>
            ))}
          </div>
          <form
            className="product-landing-ai-input flex items-end gap-2 rounded-[14px] border p-2"
            onSubmit={(event) => event.preventDefault()}
          >
            <label htmlFor="product-voice-ai-input" className="sr-only">
              Tell Doe how to handle the next call
            </label>
            <textarea
              id="product-voice-ai-input"
              rows={2}
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder={PRODUCT_LANDING_AI_INPUT.placeholder}
              className={`product-landing-ai-input__field min-h-[2.75rem] flex-1 resize-none border-0 bg-transparent px-1 py-1 text-[12px] leading-[1.45] outline-none ${inter.className}`}
            />
            <button
              type="submit"
              aria-label="Send prompt"
              className="product-landing-ai-input__send inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] transition-colors"
            >
              <SendIcon className="h-4 w-4" />
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
}
