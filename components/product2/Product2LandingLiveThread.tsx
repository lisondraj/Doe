"use client";

import { type ReactNode } from "react";

import { Product2ChartProfileA1cTrend } from "@/components/product2/Product2ChartProfileA1cTrend";
import {
  PRODUCT2_LANDING_CALL_HISTORY_ACTIONS,
  PRODUCT2_LANDING_CALL_OUTCOME,
  PRODUCT2_LANDING_LIVE_CONVO,
} from "@/lib/product2/product2-copy";
import { dmSans, suisseIntl } from "@/lib/home/fonts";

type LiveConvoTaggedLine = {
  before: string;
  tag: string;
  after?: string;
};

type LiveConvoLine = string | LiveConvoTaggedLine;

function isTaggedLine(line: LiveConvoLine): line is LiveConvoTaggedLine {
  return typeof line === "object";
}

function VoiceLiveConvo({
  convoView = "full",
  showAgentSteps = true,
}: {
  convoView?: "full" | "agent-only";
  showAgentSteps?: boolean;
}) {
  const turns =
    convoView === "agent-only"
      ? PRODUCT2_LANDING_LIVE_CONVO.filter((turn) => turn.role === "agent")
      : PRODUCT2_LANDING_LIVE_CONVO;

  return (
    <div className="product-landing-live-convo">
      {turns.map((turn) => (
        <VoiceConvoTurn key={turn.id} turn={turn} showAgentSteps={showAgentSteps} />
      ))}
    </div>
  );
}

function VoiceCallHistoryActions() {
  return (
    <div className="product-landing-live-actions" role="group" aria-label="Call history actions">
      {PRODUCT2_LANDING_CALL_HISTORY_ACTIONS.map((label) => (
        <button key={label} type="button" className={`product-landing-live-actions__btn ${dmSans.className}`}>
          {label}
        </button>
      ))}
    </div>
  );
}

function VoiceCallOutcomeBar() {
  const outcome = PRODUCT2_LANDING_CALL_OUTCOME;

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
    <svg className="product-landing-live-quote__step-check" viewBox="0 0 12 12" fill="none" aria-hidden>
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

function ChartProfileTrendIcon({ direction }: { direction: "up" | "down" }) {
  return (
    <svg
      className={`product-landing-live-quote__chart-profile-highlight-trend product-landing-live-quote__chart-profile-highlight-trend--${direction}`}
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
    >
      {direction === "up" ? (
        <path d="M6 2.5L9.5 8H2.5L6 2.5Z" fill="currentColor" />
      ) : (
        <path d="M6 9.5L2.5 4H9.5L6 9.5Z" fill="currentColor" />
      )}
    </svg>
  );
}

function VoiceAgentChartProfile({
  profile,
}: {
  profile: {
    name: string;
    tags: readonly string[];
    highlights?: readonly { title: string; value: string; trend?: "up" | "down" }[];
    a1cTrend?: {
      label: string;
      readings: readonly { date: string; value: number }[];
      doseChanges?: readonly { atIndex: number; dose: number }[];
    };
  };
}) {
  return (
    <div className="product-landing-live-quote__chart-profile">
      <div className="product-landing-live-quote__chart-profile-head">
        <span className={`product-landing-live-quote__chart-profile-avatar ${dmSans.className}`} aria-hidden>
          SW
        </span>
        <div className="product-landing-live-quote__chart-profile-identity">
          <p className={`product-landing-live-quote__chart-profile-name m-0 ${suisseIntl.className}`}>
            {profile.name}
          </p>
          <div className={`product-landing-live-quote__chart-profile-tags ${dmSans.className}`}>
            {profile.tags.map((tag) => (
              <span key={tag} className="product-landing-live-quote__chart-profile-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      {profile.highlights?.length ? (
        <div className={`product-landing-live-quote__chart-profile-highlights ${dmSans.className}`}>
          {profile.highlights.map((highlight) => (
            <div key={highlight.title} className="product-landing-live-quote__chart-profile-highlight">
              <span className={`product-landing-live-quote__chart-profile-highlight-value ${suisseIntl.className}`}>
                {highlight.value}
                {highlight.trend ? <ChartProfileTrendIcon direction={highlight.trend} /> : null}
              </span>
              <span className="product-landing-live-quote__chart-profile-highlight-title">{highlight.title}</span>
            </div>
          ))}
        </div>
      ) : null}
      {profile.a1cTrend ? (
        <Product2ChartProfileA1cTrend
          label={profile.a1cTrend.label}
          readings={profile.a1cTrend.readings}
          doseChanges={profile.a1cTrend.doseChanges}
        />
      ) : null}
    </div>
  );
}

function VoiceAgentSteps({ steps }: { steps: readonly string[] }) {
  return (
    <ul className={`product-landing-live-quote__steps m-0 ${dmSans.className}`}>
      {steps.map((step) => (
        <li key={step} className="product-landing-live-quote__step">
          <span>{step}</span>
          <LiveQuoteCheckIcon />
        </li>
      ))}
    </ul>
  );
}

function VoiceQuoteLine({ line }: { line: LiveConvoLine }) {
  if (isTaggedLine(line)) {
    return (
      <span className="product-landing-live-quote__line">
        {line.before}
        <span className="product-landing-live-quote__tag">{line.tag}</span>
        {line.after ?? ""}
      </span>
    );
  }

  return <span className="product-landing-live-quote__line">{line}</span>;
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

function VoiceConvoTurn({
  turn,
  showAgentSteps = true,
}: {
  turn: (typeof PRODUCT2_LANDING_LIVE_CONVO)[number];
  showAgentSteps?: boolean;
}) {
  const isAgent = turn.role === "agent";
  const steps = "steps" in turn ? turn.steps : undefined;
  const chartProfile = "chartProfile" in turn ? turn.chartProfile : undefined;

  const header =
    showAgentSteps && (steps || chartProfile) ? (
      <div className="product-landing-live-quote__agent-header">
        {steps ? <VoiceAgentSteps steps={steps} /> : null}
        {chartProfile ? <VoiceAgentChartProfile profile={chartProfile} /> : null}
      </div>
    ) : undefined;

  return (
    <VoiceQuoteTurn
      ariaLabel={isAgent ? "Agent reply" : "Live caller"}
      caller={turn.caller}
      callDuration={turn.callDuration}
      callDurationIso={turn.callDurationIso}
      variant={isAgent ? "reply" : "default"}
      header={header}
    >
      {turn.lines.map((line, index) => (
        <VoiceQuoteLine key={`${turn.id}-${index}`} line={line} />
      ))}
    </VoiceQuoteTurn>
  );
}

/** Live call transcript block from the Today workspace (outcome bar + convo + actions). */
export function Product2LandingLiveThread({
  className = "",
  showOutcome = true,
  showActions = true,
  showAgentSteps = true,
  convoView = "full",
}: {
  className?: string;
  showOutcome?: boolean;
  showActions?: boolean;
  showAgentSteps?: boolean;
  convoView?: "full" | "agent-only";
}) {
  return (
    <div className={`product-landing-live-thread${className ? ` ${className}` : ""}`}>
      {showOutcome ? (
        <div className="product-landing-live-thread__head">
          <VoiceCallOutcomeBar />
        </div>
      ) : null}
      <div className="product-landing-live-convo-stage">
        <VoiceLiveConvo convoView={convoView} showAgentSteps={showAgentSteps} />
      </div>
      {showActions ? <VoiceCallHistoryActions /> : null}
    </div>
  );
}
