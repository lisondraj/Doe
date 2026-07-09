"use client";

import { inter, suisseIntl } from "@/lib/home/fonts";

const RX = {
  patient: "Patel, M.",
  drug: "Lisinopril 10 mg",
  requestLine1: "Need my blood pressure refill",
  requestLine2: "called in",
  pharmacy: "CVS #4821",
  eta: "Ready 4:30 PM",
} as const;

const STEPS = [
  { id: "verify", label: "Verified", status: "done" as const },
  { id: "coverage", label: "Coverage", status: "active" as const },
  { id: "pharmacy", label: "Pharmacy", status: "upcoming" as const },
] as const;

function PhoneIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="home-agents-carousel__refill-peek-phone-icon h-[0.9em] w-[0.9em] shrink-0">
      <path
        d="M4 6.5a4 4 0 018 0v2.2l1.4 1.1H2.6L4 8.7V6.5z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <path d="M6.5 12.2h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

function StepMark({ status }: { status: (typeof STEPS)[number]["status"] }) {
  if (status === "done") {
    return (
      <span className="home-agents-carousel__refill-peek-step-mark home-agents-carousel__refill-peek-step-mark--done" aria-hidden>
        ✓
      </span>
    );
  }

  if (status === "active") {
    return <span className="home-agents-carousel__refill-peek-step-mark home-agents-carousel__refill-peek-step-mark--active" aria-hidden />;
  }

  return <span className="home-agents-carousel__refill-peek-step-mark home-agents-carousel__refill-peek-step-mark--upcoming" aria-hidden />;
}

/** Agents carousel — Refill Agent live call peek (content on shader, no outer card). */
export function HomeAgentsCarouselRefillPeek() {
  return (
    <div className="home-agents-carousel__refill-peek" aria-hidden>
      <div className={`home-agents-carousel__refill-peek-surface ${suisseIntl.className}`}>
        <div className="home-agents-carousel__refill-peek-agent">
          <div className="home-agents-carousel__refill-peek-agent-row">
            <span className="home-agents-carousel__refill-peek-phone-badge" aria-hidden>
              <PhoneIcon />
            </span>
            <span className="home-agents-carousel__refill-peek-heading">Refill Agent</span>
            <span className={`home-agents-carousel__refill-peek-live ${inter.className}`}>1:42</span>
          </div>
        </div>

        <div className={`home-agents-carousel__refill-peek-call ${inter.className}`}>
          <div className="home-agents-carousel__refill-peek-waveform" aria-hidden>
            {Array.from({ length: 12 }, (_, index) => (
              <span
                key={index}
                className="home-agents-carousel__refill-peek-waveform-bar"
                style={{ height: `${34 + ((index * 17) % 52)}%` }}
              />
            ))}
          </div>
          <p className="home-agents-carousel__refill-peek-quote">
            <span className="home-agents-carousel__refill-peek-quote-line">&ldquo;{RX.requestLine1}</span>
            <span className="home-agents-carousel__refill-peek-quote-line">{RX.requestLine2}&rdquo;</span>
          </p>
        </div>

        <div className="home-agents-carousel__refill-peek-rx">
          <span className="home-agents-carousel__refill-peek-drug">{RX.drug}</span>
          <span className={`home-agents-carousel__refill-peek-rx-meta ${inter.className}`}>{RX.patient}</span>
        </div>

        <div className="home-agents-carousel__refill-peek-steps" aria-hidden>
          {STEPS.map((step) => (
            <div
              key={step.id}
              className={`home-agents-carousel__refill-peek-step home-agents-carousel__refill-peek-step--${step.status}`}
            >
              <StepMark status={step.status} />
              <span className={`home-agents-carousel__refill-peek-step-label ${inter.className}`}>{step.label}</span>
            </div>
          ))}
        </div>

        <div className={`home-agents-carousel__refill-peek-footer ${inter.className}`}>
          <span className="home-agents-carousel__refill-peek-footer-pharmacy">{RX.pharmacy}</span>
          <span className="home-agents-carousel__refill-peek-footer-eta">{RX.eta}</span>
        </div>
      </div>
    </div>
  );
}
