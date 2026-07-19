"use client";

import { useState } from "react";

import {
  PRODUCT_LANDING_AI_INPUT,
  PRODUCT_LANDING_ATTENTION,
  PRODUCT_LANDING_BRIEF,
  PRODUCT_LANDING_CONSOLE,
  PRODUCT_LANDING_GREETING,
  PRODUCT_LANDING_HEADLINE,
  PRODUCT_LANDING_PRIMARY_CTA,
  PRODUCT_LANDING_PULSE,
  PRODUCT_LANDING_SECONDARY_CTA,
  PRODUCT_LANDING_STATUS_NOTE,
  PRODUCT_LANDING_STATUS_VALUE,
  PRODUCT_LANDING_SUBHEAD,
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
      {Array.from({ length: 18 }).map((_, i) => (
        <span key={i} className="product-voice-waveform__bar" />
      ))}
    </div>
  );
}

/** Physician entry view: live voice agent console on clinic open. */
export function ProductLandingPanel() {
  const [prompt, setPrompt] = useState("");

  return (
    <div className="product-landing-panel flex min-h-0 flex-1 flex-col overflow-hidden">
      <header className="product-landing-header flex shrink-0 items-center justify-between gap-3 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <MicIcon className="product-landing-header__icon h-[18px] w-[18px] shrink-0" />
          <div className="min-w-0">
            <h1
              className={`product-landing-header__title m-0 text-[15px] font-semibold tracking-tight ${suisseIntl.className}`}
            >
              Voice
            </h1>
            <p className={`product-landing-header__clinic m-0 mt-0.5 truncate text-[11px] ${inter.className}`}>
              {PRODUCT_CLINIC_LABEL}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span
            className={`product-landing-line-note hidden text-[11px] font-medium tabular-nums sm:inline ${inter.className}`}
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
            className={`product-landing-cta-primary inline-flex h-[34px] items-center justify-center rounded-[10px] px-3 text-[11px] font-medium leading-none tracking-[-0.01em] transition-colors ${suisseIntl.className}`}
          >
            {PRODUCT_LANDING_PRIMARY_CTA}
          </button>
        </div>
      </header>

      <div className="product-landing-body min-h-0 flex-1 overflow-y-auto">
        <div className="product-landing-intro px-4 pt-[clamp(1rem,1.6vw,1.35rem)] pb-3">
          <p
            className={`product-landing-intro__greeting m-0 text-[11px] font-semibold uppercase tracking-[0.12em] ${suisseIntl.className}`}
          >
            {PRODUCT_LANDING_GREETING}
          </p>
          <h2
            className={`product-landing-intro__headline m-0 mt-1.5 max-w-[36rem] text-[clamp(1.35rem,1rem+1.1vw,1.85rem)] font-normal leading-[1.1] tracking-[-0.028em] ${suisseIntl.className}`}
          >
            {PRODUCT_LANDING_HEADLINE}
          </h2>
          <p
            className={`product-landing-intro__subhead m-0 mt-2 max-w-[40rem] text-[13px] leading-[1.5] ${inter.className}`}
          >
            {PRODUCT_LANDING_SUBHEAD}
          </p>
          <p className={`product-landing-intro__brief m-0 mt-2 max-w-[42rem] text-[12px] leading-[1.45] ${inter.className}`}>
            {PRODUCT_LANDING_BRIEF}
          </p>
        </div>

        <div className="product-landing-stage grid min-h-0 flex-1 gap-0 xl:grid-cols-[minmax(0,1.45fr)_minmax(17rem,0.9fr)]">
          <section className="product-landing-console flex min-h-0 flex-col" aria-labelledby="product-live-call-title">
            <div className="product-landing-console__stage relative flex flex-col px-4 py-[clamp(1.1rem,2vw,1.6rem)]">
              <div className="relative z-[1] flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p
                    id="product-live-call-title"
                    className={`product-landing-console__state m-0 text-[10px] font-semibold uppercase tracking-[0.14em] ${suisseIntl.className}`}
                  >
                    {PRODUCT_LANDING_CONSOLE.stateLabel}
                  </p>
                  <p
                    className={`product-landing-console__caller m-0 mt-1.5 text-[clamp(1.2rem,0.95rem+0.8vw,1.55rem)] font-normal leading-none tracking-[-0.03em] ${suisseIntl.className}`}
                  >
                    {PRODUCT_LANDING_CONSOLE.caller}
                  </p>
                  <p className={`product-landing-console__reason m-0 mt-1.5 text-[13px] ${inter.className}`}>
                    {PRODUCT_LANDING_CONSOLE.reason}
                  </p>
                  <p className={`product-landing-console__meta m-0 mt-1 text-[11px] ${inter.className}`}>
                    {PRODUCT_LANDING_CONSOLE.line}
                  </p>
                </div>
                <span
                  className={`product-landing-console__duration rounded-md px-2 py-1 text-[11px] font-medium tabular-nums ${inter.className}`}
                >
                  {PRODUCT_LANDING_CONSOLE.duration}
                </span>
              </div>

              <div className="relative z-[1] mt-[clamp(1.25rem,2.2vw,1.85rem)] flex flex-col items-center">
                <WaveformBars />
                <p
                  className={`product-landing-console__agent-line m-0 mt-4 max-w-[28rem] text-center text-[13px] leading-[1.4] ${dmSans.className}`}
                >
                  {PRODUCT_LANDING_CONSOLE.agentLine}
                </p>
              </div>
            </div>

            <div className="product-landing-transcript flex min-h-0 flex-1 flex-col">
              <div className="product-landing-transcript__toolbar flex shrink-0 items-center justify-between gap-3 px-4 py-2.5">
                <p
                  className={`product-landing-transcript__label m-0 text-[10px] font-semibold uppercase tracking-[0.12em] ${suisseIntl.className}`}
                >
                  Live transcript
                </p>
                <button
                  type="button"
                  className={`product-landing-cta-secondary inline-flex h-[30px] items-center justify-center rounded-[8px] px-2.5 text-[10px] font-medium transition-colors ${suisseIntl.className}`}
                >
                  {PRODUCT_LANDING_SECONDARY_CTA}
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
                <div className="product-voice-timeline mx-auto max-w-[34rem]">
                  {PRODUCT_LANDING_TRANSCRIPT.map((line) => {
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
                          <span
                            className={`product-voice-timeline__time shrink-0 text-[10px] tabular-nums ${inter.className}`}
                          >
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
          </section>

          <aside className="product-landing-rail flex flex-col border-t xl:border-l xl:border-t-0">
            <div className="product-landing-rail__pulse px-4 py-3">
              <p
                className={`product-landing-rail__label m-0 text-[10px] font-semibold uppercase tracking-[0.14em] ${suisseIntl.className}`}
              >
                Today so far
              </p>
              <dl className="mt-2.5 flex flex-wrap gap-x-5 gap-y-2">
                {PRODUCT_LANDING_PULSE.map((item) => (
                  <div key={item.label} className="min-w-[4.5rem]">
                    <dt className={`product-landing-rail__pulse-label m-0 text-[10px] ${inter.className}`}>
                      {item.label}
                    </dt>
                    <dd
                      className={`product-landing-rail__pulse-value m-0 mt-0.5 text-[1.15rem] font-normal leading-none tracking-[-0.02em] ${suisseIntl.className}`}
                    >
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="product-landing-rail__attention flex min-h-0 flex-1 flex-col px-4 py-3">
              <p
                className={`product-landing-rail__label m-0 text-[10px] font-semibold uppercase tracking-[0.14em] ${suisseIntl.className}`}
              >
                Needs your eye
              </p>
              <p className={`product-landing-rail__hint m-0 mt-1 text-[12px] ${inter.className}`}>
                Doe finished these. You decide the next move.
              </p>
              <ul className="product-landing-attention m-0 mt-3 flex list-none flex-col gap-0 p-0">
                {PRODUCT_LANDING_ATTENTION.map((item) => (
                  <li key={item.id} className="product-landing-attention__item">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <span
                          className={`product-landing-attention__badge inline-flex text-[9px] font-semibold uppercase tracking-[0.08em] ${suisseIntl.className}`}
                        >
                          {item.label}
                        </span>
                        <p
                          className={`product-landing-attention__title m-0 mt-1 text-[13px] font-semibold leading-snug tracking-[-0.015em] ${suisseIntl.className}`}
                        >
                          {item.title}
                        </p>
                        <p className={`product-landing-attention__detail m-0 mt-1 text-[11px] leading-[1.4] ${inter.className}`}>
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
            </div>
          </aside>
        </div>
      </div>

      <footer className="product-landing-ai-dock shrink-0 border-t px-4 py-3">
        <div className="product-landing-ai-dock__inner mx-auto max-w-[72rem]">
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
