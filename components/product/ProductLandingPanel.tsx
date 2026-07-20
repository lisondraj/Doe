"use client";

import type { CSSProperties, ReactNode } from "react";
import {
  PRODUCT_LANDING_AGENT_REPLY,
  PRODUCT_LANDING_AGENT_STEPS,
  PRODUCT_LANDING_CALL_HISTORY_ACTIONS,
  PRODUCT_LANDING_CALL_HISTORY_LABEL,
  PRODUCT_LANDING_CALL_HISTORY_ORBIT,
  PRODUCT_LANDING_CALL_HISTORY_ORBIT_AGENTS,
  PRODUCT_LANDING_CALL_OUTCOME,
  PRODUCT_LANDING_DAY_SUMMARY,
  PRODUCT_LANDING_GREETING_LINE,
  PRODUCT_LANDING_GREETING_NAME,
  PRODUCT_LANDING_LIVE_QUOTE,
  PRODUCT_LANDING_TAB_LABEL,
} from "@/lib/product/product-copy";
import "@/lib/product/product-landing.css";
import { dmSans, suisseIntl } from "@/lib/home/fonts";

const CALL_HISTORY_ORBIT_AGENTS = PRODUCT_LANDING_CALL_HISTORY_ORBIT_AGENTS;
const CALL_HISTORY_ORBIT_COUNT = CALL_HISTORY_ORBIT_AGENTS.length;

type CallHistoryOrbitAgentIcon = (typeof CALL_HISTORY_ORBIT_AGENTS)[number]["icon"];

function VoiceCallHistoryOrbitAgentIcon({ kind }: { kind: CallHistoryOrbitAgentIcon }) {
  const sw = 1.2;

  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className="product-landing-workspace__orbit-circle-icon">
      {kind === "voice" && (
        <>
          <rect x="7.5" y="3" width="5" height="8.5" rx="2.5" stroke="currentColor" strokeWidth={sw} />
          <path d="M5.5 11a4.5 4.5 0 009 0" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" />
          <path d="M10 15.5v2.5" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" />
        </>
      )}
      {kind === "research" && (
        <>
          <path d="M8 3v4.6L5.6 14.4a2 2 0 001.72 3h5.36a2 2 0 001.72-3L12 7.6V3" stroke="currentColor" strokeWidth={sw} strokeLinejoin="round" />
          <path d="M7 3h6" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" />
          <path d="M8.2 11.2h3.6" stroke="currentColor" strokeWidth={sw * 0.9} strokeLinecap="round" />
        </>
      )}
      {kind === "calendar" && (
        <>
          <rect x="3.5" y="4.5" width="13" height="12.5" rx="1.5" stroke="currentColor" strokeWidth={sw} />
          <path d="M3.5 8.5h13" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" />
          <path d="M7 2.5v3M13 2.5v3" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" />
          <circle cx="7.1" cy="11.6" r="1.05" stroke="currentColor" strokeWidth={sw * 0.85} />
          <circle cx="11" cy="11.6" r="1.05" stroke="currentColor" strokeWidth={sw * 0.85} />
        </>
      )}
      {kind === "billing" && (
        <>
          <rect x="4.5" y="5.5" width="11" height="9" rx="1.5" stroke="currentColor" strokeWidth={sw} />
          <path d="M4.5 8.5h11" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" />
          <rect x="6.5" y="10.25" width="2.5" height="1.75" rx="0.35" stroke="currentColor" strokeWidth={sw * 0.9} />
          <path d="M11 10.75h2.5M11 12.75h1.75" stroke="currentColor" strokeWidth={sw * 0.9} strokeLinecap="round" />
        </>
      )}
      {kind === "inbox" && (
        <>
          <path d="M3.5 5.5h13v9a1.5 1.5 0 01-1.5 1.5H5a1.5 1.5 0 01-1.5-1.5v-9z" stroke="currentColor" strokeWidth={sw} />
          <path d="M3.5 8.5l4.2 2.8a1.2 1.2 0 001.2 0l4.1-2.8" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" />
        </>
      )}
      {kind === "referrals" && (
        <>
          <path d="M4 10h8.5M10.5 7.5L13 10l-2.5 2.5" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6.5 5.5h5a2 2 0 012 2v7.5a2 2 0 01-2 2h-5" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" />
        </>
      )}
      {kind === "prior-auth" && (
        <>
          <rect x="5.5" y="3.5" width="9" height="13" rx="1.5" stroke="currentColor" strokeWidth={sw} />
          <path d="M8 7.5h4M8 10.5h4M8 13.5h2.5" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

function callHistoryOrbitGradient(index: number) {
  const step = index / CALL_HISTORY_ORBIT_COUNT;
  const r = Math.round(212 + (38 - 212) * step);
  const g = Math.round(165 + (24 - 165) * step);
  const b = Math.round(116 + (14 - 116) * step);
  const rLight = Math.min(255, r + 22);
  const gLight = Math.min(255, g + 16);
  const bLight = Math.min(255, b + 10);
  const rDeep = Math.round(r * 0.52 + 20 * 0.48);
  const gDeep = Math.round(g * 0.52 + 12 * 0.48);
  const bDeep = Math.round(b * 0.52 + 8 * 0.48);

  return `linear-gradient(180deg, rgb(${rLight}, ${gLight}, ${bLight}) 0%, rgb(${rDeep}, ${gDeep}, ${bDeep}) 100%)`;
}

function VoiceCallHistoryOrbitStats() {
  return (
    <div className="product-landing-workspace__orbit-stat">
      <span className={`product-landing-workspace__orbit-stat-value ${dmSans.className}`}>
        {CALL_HISTORY_ORBIT_COUNT}
      </span>
      <div className={`product-landing-workspace__orbit-stat-label-stack ${suisseIntl.className}`}>
        {PRODUCT_LANDING_CALL_HISTORY_ORBIT.labelLines.map((line) => (
          <span key={line} className="product-landing-workspace__orbit-stat-label">
            {line}
          </span>
        ))}
      </div>
    </div>
  );
}

function VoiceCallHistoryOrbit({ children }: { children?: ReactNode }) {
  return (
    <div className="product-landing-workspace__orbit">
      <button
        type="button"
        className={`product-landing-workspace__orbit-edit ${suisseIntl.className}`}
        tabIndex={-1}
      >
        {PRODUCT_LANDING_CALL_HISTORY_ORBIT.editAgentsLabel}
      </button>
      <div className="product-landing-workspace__orbit-ring">
        <div className="product-landing-workspace__orbit-center">{children ?? <VoiceCallHistoryOrbitStats />}</div>
        <div className="product-landing-workspace__orbit-circles">
          {CALL_HISTORY_ORBIT_AGENTS.map((agent, index) => (
            <span
              key={agent.id}
              className="product-landing-workspace__orbit-circle"
              style={
                {
                  "--orbit-angle": `${(index / CALL_HISTORY_ORBIT_COUNT) * 360}deg`,
                  "--orbit-shade": callHistoryOrbitGradient(index),
                  "--orbit-z": CALL_HISTORY_ORBIT_COUNT - index,
                } as CSSProperties
              }
            >
              <span className="product-landing-workspace__orbit-circle-content">
                <VoiceCallHistoryOrbitAgentIcon kind={agent.icon} />
                <span className={`product-landing-workspace__orbit-circle-name ${dmSans.className}`}>
                  {agent.nameLines.map((line) => (
                    <span key={line} className="product-landing-workspace__orbit-circle-name-line">
                      {line}
                    </span>
                  ))}
                </span>
              </span>
            </span>
          ))}
        </div>
      </div>
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
  appointment: (typeof PRODUCT_LANDING_DAY_SUMMARY.todayAhead.nextAppointment);
}) {
  return (
    <div className="product-landing-ahead-carousel__appointment">
      <div className="product-landing-ahead-carousel__appointment-head">
        <span className={`product-landing-ahead-carousel__appointment-eyebrow ${dmSans.className}`}>
          {appointment.label}
        </span>
        <span className={`product-landing-ahead-carousel__appointment-time ${dmSans.className}`}>{appointment.time}</span>
      </div>
      <p className={`product-landing-ahead-carousel__appointment-patient m-0 ${dmSans.className}`}>{appointment.patient}</p>
      <p className={`product-landing-ahead-carousel__appointment-detail m-0 ${dmSans.className}`}>
        {appointment.detail}
        <span className="product-landing-ahead-carousel__appointment-sep" aria-hidden>
          {" · "}
        </span>
        {appointment.location}
      </p>
      <span className={`product-landing-ahead-carousel__appointment-relative ${dmSans.className}`}>{appointment.relative}</span>
    </div>
  );
}

function TodayAheadCarousel({
  items,
  nextAppointment,
}: {
  items: readonly (typeof PRODUCT_LANDING_DAY_SUMMARY.todayAhead.timeline)[number][];
  nextAppointment: (typeof PRODUCT_LANDING_DAY_SUMMARY.todayAhead.nextAppointment);
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

function VoiceConvoChevron({ direction }: { direction: "up" | "down" }) {
  return (
    <svg className="product-landing-live-convo__chevron" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d={direction === "up" ? "M2.5 8 6 4.5 9.5 8" : "M2.5 4 6 7.5 9.5 4"}
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function VoiceLiveConvo() {
  return (
    <div className="product-landing-live-convo">
      <VoiceLiveQuote />
      <VoiceAgentReply />
    </div>
  );
}

function VoiceCallHistoryNav() {
  return (
    <div className="product-landing-live-convo__nav-stack" aria-hidden>
      <VoiceConvoChevron direction="up" />
      <VoiceConvoChevron direction="down" />
    </div>
  );
}

function VoiceCallHistoryActions() {
  return (
    <div className="product-landing-live-actions" role="group" aria-label="Call history actions">
      {PRODUCT_LANDING_CALL_HISTORY_ACTIONS.map((label) => (
        <button key={label} type="button" className={`product-landing-live-actions__btn ${dmSans.className}`}>
          {label}
        </button>
      ))}
    </div>
  );
}

function VoiceCallOutcomeBar() {
  const outcome = PRODUCT_LANDING_CALL_OUTCOME;

  return (
    <section className="product-landing-live-outcome" aria-label="Call outcome">
      <div className="product-landing-live-outcome__top">
        <p className={`product-landing-live-outcome__phone m-0 ${dmSans.className}`}>{outcome.phone}</p>
        <p className={`product-landing-live-outcome__duration m-0 ${dmSans.className}`}>{outcome.totalCallTime}</p>
      </div>
      <div className="product-landing-live-outcome__row">
        <p className={`product-landing-live-outcome__name m-0 ${dmSans.className}`}>{outcome.caller}</p>
        <p className={`product-landing-live-outcome__status m-0 ${dmSans.className}`}>{outcome.status}</p>
      </div>
    </section>
  );
}

function LiveQuoteCheckIcon() {
  return (
    <svg
      className="product-landing-live-quote__step-check"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
    >
      <path
        d="M2.25 6.1 4.65 8.5 9.75 3.4"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function VoiceAgentSteps() {
  return (
    <ul className={`product-landing-live-quote__steps m-0 ${dmSans.className}`}>
      {PRODUCT_LANDING_AGENT_STEPS.map((step) => (
        <li key={step} className="product-landing-live-quote__step">
          <span>{step}</span>
          <LiveQuoteCheckIcon />
        </li>
      ))}
    </ul>
  );
}

function VoiceQuoteTurn({
  ariaLabel,
  caller,
  callDuration,
  callDurationIso,
  variant = "default",
  header,
  children,
}: {
  ariaLabel: string;
  caller: string;
  callDuration: string;
  callDurationIso: string;
  variant?: "default" | "reply";
  header?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      className={`product-landing-live-quote${variant === "reply" ? " product-landing-live-quote--reply" : ""}`}
      aria-label={ariaLabel}
    >
      {header}
      <p className={`product-landing-live-quote__text m-0 ${dmSans.className}`}>{children}</p>
      <div className="product-landing-live-quote__meta">
        <p className={`product-landing-live-quote__caller m-0 ${dmSans.className}`}>{caller}</p>
        <time className={`product-landing-live-quote__duration ${dmSans.className}`} dateTime={callDurationIso}>
          {callDuration}
        </time>
      </div>
    </section>
  );
}

function VoiceLiveQuote() {
  const quote = PRODUCT_LANDING_LIVE_QUOTE;

  return (
    <VoiceQuoteTurn
      ariaLabel="Live caller"
      caller={quote.caller}
      callDuration={quote.callDuration}
      callDurationIso="PT0M6S"
    >
      <span className="product-landing-live-quote__line">
        {quote.line1.beforeName}
        <span className="product-landing-live-quote__tag">{quote.line1.name}</span>
        {quote.line1.afterName}
      </span>
      <span className="product-landing-live-quote__line">
        {quote.line2.beforeSubject}
        <span className="product-landing-live-quote__tag">{quote.line2.subject}</span>
      </span>
    </VoiceQuoteTurn>
  );
}

function VoiceAgentReply() {
  const reply = PRODUCT_LANDING_AGENT_REPLY;

  return (
    <VoiceQuoteTurn
      ariaLabel="Agent reply"
      caller={reply.caller}
      callDuration={reply.callDuration}
      callDurationIso="PT0M9S"
      variant="reply"
      header={<VoiceAgentSteps />}
    >
      <span className="product-landing-live-quote__line">{reply.line1}</span>
      <span className="product-landing-live-quote__line">{reply.line2}</span>
    </VoiceQuoteTurn>
  );
}

function DaySummaryHero({ inConsole = false }: { inConsole?: boolean }) {
  const { last24h, todayAhead } = PRODUCT_LANDING_DAY_SUMMARY;

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
              {PRODUCT_LANDING_GREETING_LINE}
            </p>
            <p
              id="day-summary-greeting-name"
              className={`product-landing-day-summary__greeting-name m-0 mt-1 font-normal leading-[0.95] tracking-[-0.035em] ${dmSans.className}`}
            >
              {PRODUCT_LANDING_GREETING_NAME}
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
export function ProductLandingPanel() {
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
            className="product-landing-header__icon h-[18px] w-[18px] shrink-0"
          >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
          <h1 className="product-landing-header__title m-0 text-[15px] font-normal tracking-tight">
            {PRODUCT_LANDING_TAB_LABEL}
          </h1>
        </header>

        <section className="product-landing-call product-landing-call--pinned shrink-0" aria-label="Voice summary">
          <div className="product-landing-call__stage relative overflow-hidden">
            <DaySummaryHero inConsole />
          </div>
        </section>
      </div>

      <div className="product-landing-panel__divider" role="separator" aria-hidden />

      <div className="product-landing-workspace min-h-0 flex-1">
        <VoiceCallHistoryOrbit />
        <p
          className={`product-landing-workspace__label m-0 text-[10px] font-semibold uppercase tracking-[0.12em] ${suisseIntl.className}`}
        >
          {PRODUCT_LANDING_CALL_HISTORY_LABEL}
        </p>
        <div className="product-landing-live-thread">
          <div className="product-landing-live-thread__head">
            <VoiceCallOutcomeBar />
          </div>
          <div className="product-landing-live-convo-stage">
            <VoiceCallHistoryNav />
            <VoiceLiveConvo />
          </div>
          <VoiceCallHistoryActions />
        </div>
      </div>
    </div>
  );
}
