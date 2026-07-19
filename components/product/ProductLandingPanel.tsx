"use client";

import {
  PRODUCT_LANDING_CALL_PREVIEW,
  PRODUCT_LANDING_CAPABILITIES,
  PRODUCT_LANDING_HEADLINE,
  PRODUCT_LANDING_LINES,
  PRODUCT_LANDING_METRICS,
  PRODUCT_LANDING_PRIMARY_CTA,
  PRODUCT_LANDING_SECONDARY_CTA,
  PRODUCT_LANDING_STATUS_NOTE,
  PRODUCT_LANDING_STATUS_VALUE,
  PRODUCT_LANDING_SUBHEAD,
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
      {Array.from({ length: 12 }).map((_, i) => (
        <span key={i} className="product-voice-waveform__bar" />
      ))}
    </div>
  );
}

/** Voice landing — console layout; matches app chrome, distinct from operational views. */
export function ProductLandingPanel() {
  const activeLine = PRODUCT_LANDING_LINES.find((line) => line.active) ?? PRODUCT_LANDING_LINES[0];

  return (
    <div className="product-landing-panel flex min-h-0 flex-1 flex-col overflow-hidden">
      <header className="product-landing-header flex shrink-0 items-center justify-between gap-3 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <MicIcon className="product-landing-header__icon h-[18px] w-[18px] shrink-0" />
          <h1
            className={`product-landing-header__title m-0 text-[15px] font-semibold tracking-tight ${suisseIntl.className}`}
          >
            Voice
          </h1>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span
            className={`product-landing-live-pill inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] ${suisseIntl.className}`}
          >
            <span className="product-landing-live-pill__dot inline-flex h-1.5 w-1.5 rounded-full" aria-hidden />
            {PRODUCT_LANDING_STATUS_VALUE}
          </span>
          <button
            type="button"
            className={`product-landing-cta-primary inline-flex h-[34px] items-center justify-center rounded-[10px] px-3 text-[11px] font-medium leading-none tracking-[-0.01em] transition-colors ${suisseIntl.className}`}
          >
            {PRODUCT_LANDING_PRIMARY_CTA}
          </button>
        </div>
      </header>

      <div className="product-landing-line-rail shrink-0 px-4 py-2">
        <div className="product-landing-line-track inline-flex max-w-full rounded-[14px] p-0.5">
          {PRODUCT_LANDING_LINES.map((line) => (
            <button
              key={line.id}
              type="button"
              className={`product-landing-line-tab flex min-w-[9.5rem] flex-col items-start rounded-[12px] px-3 py-2 text-left transition-colors ${
                line.active ? "product-landing-line-tab--active" : ""
              }`}
            >
              <span className={`text-[11px] font-semibold ${suisseIntl.className}`}>{line.label}</span>
              <span className={`mt-0.5 text-[10px] ${inter.className}`}>{line.detail}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col xl:flex-row">
        <aside className="product-landing-capabilities flex shrink-0 flex-col border-b p-4 xl:w-[17.5rem] xl:border-b-0 xl:border-r">
          <p
            className={`product-landing-capabilities__label m-0 text-[10px] font-semibold uppercase tracking-[0.14em] ${suisseIntl.className}`}
          >
            Capabilities
          </p>
          <p
            className={`product-landing-capabilities__subhead m-0 mt-2 text-[13px] font-normal leading-[1.4] tracking-[-0.01em] ${inter.className}`}
          >
            {PRODUCT_LANDING_SUBHEAD}
          </p>
          <ul className="mt-3 flex flex-col gap-2">
            {PRODUCT_LANDING_CAPABILITIES.map((cap) => (
              <li
                key={cap.title}
                className="product-voice-capability list-none rounded-[10px] px-3 py-2.5"
              >
                <p
                  className={`product-voice-capability__title m-0 text-[11px] font-semibold leading-snug ${suisseIntl.className}`}
                >
                  {cap.title}
                </p>
                <p className={`product-voice-capability__detail m-0 mt-1 text-[10px] leading-[1.4] ${inter.className}`}>
                  {cap.detail}
                </p>
              </li>
            ))}
          </ul>
        </aside>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div className="product-landing-console shrink-0 px-4 py-[clamp(1.25rem,2vw,1.75rem)]">
            <div className="relative mx-auto flex max-w-[40rem] flex-col items-center text-center">
              <WaveformBars />
              <p
                className={`product-landing-console__caller m-0 mt-4 text-[10px] font-semibold uppercase tracking-[0.16em] ${suisseIntl.className}`}
              >
                {PRODUCT_LANDING_CALL_PREVIEW.caller}
              </p>
              <h2
                className={`m-0 mt-1.5 text-[clamp(1.35rem,1rem+1.2vw,1.85rem)] font-normal leading-[1.08] tracking-[-0.028em] ${suisseIntl.className}`}
              >
                {PRODUCT_LANDING_HEADLINE}
              </h2>
              <p className={`product-landing-console__note m-0 mt-2 text-[12px] ${inter.className}`}>
                {activeLine.label} · {PRODUCT_LANDING_STATUS_NOTE}
              </p>
            </div>
          </div>

          <div className="product-landing-transcript flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="product-landing-transcript__toolbar flex shrink-0 items-center justify-between gap-3 px-4 py-2.5">
              <div>
                <p
                  className={`product-landing-transcript__label m-0 text-[10px] font-semibold uppercase tracking-[0.12em] ${suisseIntl.className}`}
                >
                  Live transcript
                </p>
                <p className={`product-landing-transcript__line m-0 mt-0.5 text-[12px] font-medium ${inter.className}`}>
                  {PRODUCT_LANDING_CALL_PREVIEW.line}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`product-landing-chip rounded-md px-2 py-1 text-[10px] font-medium tabular-nums ${inter.className}`}
                >
                  {PRODUCT_LANDING_CALL_PREVIEW.duration}
                </span>
                <button
                  type="button"
                  className={`product-landing-cta-secondary inline-flex h-[30px] items-center justify-center rounded-[8px] px-2.5 text-[10px] font-medium transition-colors ${suisseIntl.className}`}
                >
                  {PRODUCT_LANDING_SECONDARY_CTA}
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
              <div className="product-voice-timeline mx-auto max-w-[32rem]">
                {PRODUCT_LANDING_CALL_PREVIEW.transcript.map((line) => {
                  const isAgent = line.speaker === "Doe";

                  return (
                    <div
                      key={`${line.time}-${line.text}`}
                      className={`product-voice-timeline__item ${isAgent ? "product-voice-timeline__item--agent" : ""}`}
                    >
                      <span className="product-voice-timeline__dot" aria-hidden />
                      <div className="flex items-baseline justify-between gap-3">
                        <p
                          className={`product-voice-timeline__speaker m-0 text-[10px] font-semibold uppercase tracking-[0.1em] ${
                            isAgent ? "product-voice-timeline__speaker--agent" : ""
                          } ${suisseIntl.className}`}
                        >
                          {line.speaker}
                        </p>
                        <span className={`product-voice-timeline__time shrink-0 text-[10px] tabular-nums ${inter.className}`}>
                          {line.time}
                        </span>
                      </div>
                      <p
                        className={`product-voice-timeline__text m-0 mt-1 text-[13px] leading-[1.42] tracking-[-0.01em] ${
                          isAgent ? `product-voice-timeline__text--agent ${dmSans.className}` : inter.className
                        }`}
                      >
                        {line.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <aside className="product-landing-metrics flex shrink-0 flex-col border-t p-4 xl:w-[13.5rem] xl:border-l xl:border-t-0">
          <p
            className={`product-landing-metrics__label m-0 text-[10px] font-semibold uppercase tracking-[0.14em] ${suisseIntl.className}`}
          >
            Today
          </p>
          <ul className="mt-3 flex flex-row flex-wrap gap-2 xl:flex-col xl:gap-3">
            {PRODUCT_LANDING_METRICS.map((metric) => (
              <li
                key={metric.label}
                className="product-landing-metric-card min-w-[7rem] flex-1 list-none rounded-[10px] px-3 py-2.5 xl:flex-none"
              >
                <p
                  className={`product-landing-metrics__label m-0 text-[10px] font-medium uppercase tracking-[0.1em] ${suisseIntl.className}`}
                >
                  {metric.label}
                </p>
                <p
                  className={`product-landing-metric-card__value m-0 mt-1 text-[1.2rem] font-normal leading-none tracking-[-0.02em] ${suisseIntl.className}`}
                >
                  {metric.value}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-auto hidden pt-4 xl:block">
            <div className="product-landing-health-card rounded-[10px] px-3 py-3">
              <p
                className={`product-landing-health-card__label m-0 text-[10px] font-semibold uppercase tracking-[0.12em] ${suisseIntl.className}`}
              >
                Line health
              </p>
              <p className={`product-landing-health-card__body m-0 mt-1.5 text-[12px] leading-[1.35] ${inter.className}`}>
                All routes responding. Last handoff 12 min ago.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
