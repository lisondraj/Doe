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
  PRODUCT_LANDING_STATUS_NOTE,
  PRODUCT_LANDING_STATUS_VALUE,
  PRODUCT_LANDING_TRANSCRIPT,
} from "@/lib/product/product-copy";
import { PRODUCT_CLINIC_LABEL } from "@/lib/product/product-nav";
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

function VolumeChart({ values }: { values: readonly number[] }) {
  const max = Math.max(...values, 1);
  return (
    <div className="product-landing-volume" aria-hidden>
      {values.map((value, index) => (
        <span
          key={index}
          className="product-landing-volume__bar"
          style={{ height: `${Math.max(12, (value / max) * 100)}%` }}
        />
      ))}
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
      </div>
    </div>
  );
}

function DaySummaryHero() {
  const { last24h, todayAhead } = PRODUCT_LANDING_DAY_SUMMARY;

  return (
    <section className="product-landing-day-summary px-4 py-[clamp(1rem,1.8vw,1.5rem)]" aria-labelledby="day-summary-title">
      <div className="product-landing-day-summary__card rounded-[18px] p-[clamp(0.85rem,1.6vw,1.15rem)]">
        <div className="product-landing-day-summary__header flex flex-wrap items-end justify-between gap-3 px-1 pb-3">
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

        <div className="product-landing-day-summary__grid grid gap-3 md:grid-cols-2">
          <div className="product-landing-day-summary__panel product-landing-day-summary__panel--past rounded-[14px] p-3">
            <p
              className={`product-landing-day-summary__panel-label m-0 text-[10px] font-semibold uppercase tracking-[0.12em] ${suisseIntl.className}`}
            >
              {last24h.label}
            </p>

            <div className="product-landing-day-summary__hero-metric mt-3 flex items-end gap-3">
              <div className="product-landing-day-summary__total shrink-0">
                <span className={`product-landing-day-summary__total-value ${suisseIntl.className}`}>
                  {last24h.totalCalls}
                </span>
                <span className={`product-landing-day-summary__total-label ${inter.className}`}>calls</span>
              </div>
              <VolumeChart values={last24h.volume} />
            </div>

            <div className="product-landing-day-summary__visual-row mt-3 flex items-center gap-3">
              <ResolutionRing pct={last24h.resolvedPct} />
              <div className="product-landing-day-summary__tiles grid min-w-0 flex-1 grid-cols-3 gap-1.5">
                {last24h.tiles.map((tile) => (
                  <div key={tile.id} className="product-landing-day-summary__tile rounded-[10px] px-2 py-2">
                    <span className={`product-landing-day-summary__tile-value ${suisseIntl.className}`}>
                      {tile.value}
                    </span>
                    <span className={`product-landing-day-summary__tile-label ${inter.className}`}>{tile.label}</span>
                    <span className={`product-landing-day-summary__tile-detail ${inter.className}`}>{tile.detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="product-landing-day-summary__panel product-landing-day-summary__panel--today rounded-[14px] p-3">
            <p
              className={`product-landing-day-summary__panel-label m-0 text-[10px] font-semibold uppercase tracking-[0.12em] ${suisseIntl.className}`}
            >
              {todayAhead.label}
            </p>

            <div className="product-landing-day-summary__live mt-3 rounded-[12px] px-3 py-2.5">
              <div className="flex items-center gap-2">
                <span className="product-landing-day-summary__live-dot" aria-hidden />
                <span className={`product-landing-day-summary__live-label text-[10px] font-semibold uppercase tracking-[0.1em] ${suisseIntl.className}`}>
                  Live now
                </span>
              </div>
              <p className={`product-landing-day-summary__live-caller m-0 mt-1 text-[1.15rem] leading-none tracking-[-0.02em] ${suisseIntl.className}`}>
                {todayAhead.liveCaller}
              </p>
              <p className={`product-landing-day-summary__live-detail m-0 mt-1 text-[11px] ${inter.className}`}>
                {todayAhead.liveDetail}
              </p>
            </div>

            <div className="product-landing-day-summary__today-metrics mt-3 grid grid-cols-3 gap-1.5">
              <div className="product-landing-day-summary__metric rounded-[10px] px-2 py-2">
                <span className={`product-landing-day-summary__metric-value ${suisseIntl.className}`}>{todayAhead.queue}</span>
                <span className={`product-landing-day-summary__metric-label ${inter.className}`}>In queue</span>
              </div>
              <div className="product-landing-day-summary__metric rounded-[10px] px-2 py-2">
                <span className={`product-landing-day-summary__metric-value ${suisseIntl.className}`}>{todayAhead.needsYou}</span>
                <span className={`product-landing-day-summary__metric-label ${inter.className}`}>Need you</span>
              </div>
              <div className="product-landing-day-summary__metric product-landing-day-summary__metric--peak rounded-[10px] px-2 py-2">
                <span className={`product-landing-day-summary__metric-value ${suisseIntl.className}`}>{todayAhead.peakWindow}</span>
                <span className={`product-landing-day-summary__metric-label ${inter.className}`}>{todayAhead.peakDetail}</span>
              </div>
            </div>

            <div className="product-landing-day-summary__timeline mt-3">
              {todayAhead.timeline.map((item, index) => (
                <div
                  key={item.id}
                  className={`product-landing-day-summary__timeline-item product-landing-day-summary__timeline-item--${item.state}`}
                >
                  <div className="product-landing-day-summary__timeline-track">
                    <span className="product-landing-day-summary__timeline-dot" aria-hidden />
                    {index < todayAhead.timeline.length - 1 ? (
                      <span className="product-landing-day-summary__timeline-line" aria-hidden />
                    ) : null}
                  </div>
                  <div className="product-landing-day-summary__timeline-body min-w-0 pb-2.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className={`product-landing-day-summary__timeline-label text-[10px] font-semibold uppercase tracking-[0.08em] ${suisseIntl.className}`}>
                        {item.label}
                      </span>
                      <span className={`product-landing-day-summary__timeline-time shrink-0 text-[10px] tabular-nums ${inter.className}`}>
                        {item.time}
                      </span>
                    </div>
                    <p className={`product-landing-day-summary__timeline-detail m-0 mt-0.5 truncate text-[11px] ${inter.className}`}>
                      {item.detail}
                    </p>
                  </div>
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
  const [prompt, setPrompt] = useState("");

  return (
    <div className="product-landing-panel flex min-h-0 flex-1 flex-col overflow-hidden">
      <header className="product-landing-header flex shrink-0 items-center justify-between gap-3 px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <MicIcon className="product-landing-header__icon h-[17px] w-[17px] shrink-0" />
          <div className="min-w-0">
            <h1
              className={`product-landing-header__title m-0 text-[14px] font-semibold tracking-tight ${suisseIntl.className}`}
            >
              Voice
            </h1>
            <p className={`product-landing-header__clinic m-0 mt-0.5 truncate text-[11px] ${inter.className}`}>
              {PRODUCT_CLINIC_LABEL}
            </p>
          </div>
        </div>

        <div className="hidden min-w-0 flex-1 items-center justify-center gap-2 md:flex">
          {PRODUCT_LANDING_LINES.map((line) => (
            <span
              key={line.id}
              className={`product-landing-line-pill product-landing-line-pill--${line.status} inline-flex max-w-[14rem] items-center gap-2 rounded-full px-2.5 py-1 ${inter.className}`}
            >
              <span className="product-landing-line-pill__dot" aria-hidden />
              <span className="truncate text-[10px] font-medium">{line.label}</span>
              <span className="product-landing-line-pill__meta hidden truncate text-[10px] lg:inline">
                {line.status === "live" ? line.detail : line.number}
              </span>
            </span>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span
            className={`product-landing-line-note hidden text-[11px] font-medium tabular-nums xl:inline ${inter.className}`}
          >
            {PRODUCT_LANDING_STATUS_NOTE}
          </span>
          <span
            className={`product-landing-live-pill inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] ${suisseIntl.className}`}
          >
            <span className="product-landing-live-pill__dot inline-flex h-1.5 w-1.5 rounded-full" aria-hidden />
            {PRODUCT_LANDING_STATUS_VALUE}
          </span>
          <button
            type="button"
            className={`product-landing-cta-primary inline-flex h-[32px] items-center justify-center rounded-[10px] px-3 text-[11px] font-medium leading-none tracking-[-0.01em] transition-colors ${suisseIntl.className}`}
          >
            {PRODUCT_LANDING_PRIMARY_CTA}
          </button>
        </div>
      </header>

      <div className="product-landing-body min-h-0 flex-1 overflow-y-auto">
        <DaySummaryHero />

        <div className="product-landing-grid grid min-h-0 gap-4 px-4 pb-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(18rem,0.95fr)]">
          <div className="product-landing-main flex min-h-0 flex-col gap-4">
            <section className="product-landing-call" aria-labelledby="product-live-call-title">
              <div className="product-landing-call__stage relative overflow-hidden rounded-[18px] px-[clamp(1rem,2vw,1.35rem)] py-[clamp(1.1rem,2.2vw,1.55rem)]">
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

              <div className="product-landing-chat mt-3 rounded-[18px]">
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

          <aside className="product-landing-sidebar flex min-h-0 flex-col gap-4">
            <section className="product-landing-sidebar__block rounded-[18px]">
              <div className="px-4 py-3">
                <p
                  className={`product-landing-sidebar__label m-0 text-[10px] font-semibold uppercase tracking-[0.14em] ${suisseIntl.className}`}
                >
                  Needs your eye
                </p>
                <p className={`product-landing-sidebar__hint m-0 mt-1 text-[12px] ${inter.className}`}>
                  Doe finished these. You decide the next move.
                </p>
              </div>
              <ul className="product-landing-attention m-0 flex list-none flex-col gap-2 px-3 pb-3 pt-0">
                {PRODUCT_LANDING_ATTENTION.map((item) => (
                  <li key={item.id} className={`product-landing-attention__card product-landing-attention__card--${item.urgency}`}>
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
                        className={`product-landing-attention__action shrink-0 rounded-[8px] px-2 py-1 text-[10px] font-medium transition-colors ${suisseIntl.className}`}
                      >
                        {item.action}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="product-landing-sidebar__block rounded-[18px]">
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <div>
                  <p
                    className={`product-landing-sidebar__label m-0 text-[10px] font-semibold uppercase tracking-[0.14em] ${suisseIntl.className}`}
                  >
                    Call queue
                  </p>
                  <p className={`product-landing-sidebar__hint m-0 mt-1 text-[12px] ${inter.className}`}>
                    {PRODUCT_LANDING_DAY_SUMMARY.todayAhead.queue} callers waiting after the active line
                  </p>
                </div>
              </div>
              <ul className="product-landing-queue m-0 list-none px-3 pb-3 pt-0">
                {PRODUCT_LANDING_QUEUE.map((item, index) => (
                  <li key={item.id} className="product-landing-queue__item">
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
                        className={`product-landing-queue__wait shrink-0 rounded-md px-2 py-1 text-[10px] font-medium tabular-nums ${inter.className}`}
                      >
                        {item.wait}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="product-landing-sidebar__block rounded-[18px]">
              <div className="px-4 py-3">
                <p
                  className={`product-landing-sidebar__label m-0 text-[10px] font-semibold uppercase tracking-[0.14em] ${suisseIntl.className}`}
                >
                  Your lines
                </p>
              </div>
              <ul className="product-landing-lines m-0 list-none px-3 pb-3 pt-0">
                {PRODUCT_LANDING_LINES.map((line) => (
                  <li key={line.id} className={`product-landing-lines__item product-landing-lines__item--${line.status}`}>
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
                        className={`product-landing-lines__status shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.08em] ${suisseIntl.className}`}
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
