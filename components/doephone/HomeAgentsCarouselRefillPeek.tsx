"use client";

import { suisseIntl } from "@/lib/home/fonts";

const RX_REQUEST = {
  drug: "Lisinopril",
  strength: "10 mg · 30-day supply",
  patient: "Patel, M.",
  pharmacy: "CVS Pharmacy #4821",
  lastFilled: "Mar 12",
} as const;

const REFILL_STEPS = [
  { label: "Request received", status: "done" as const },
  { label: "Coverage verified", status: "active" as const },
  { label: "Send to pharmacy", status: "upcoming" as const },
] as const;

function RefillStepIndicator({ status }: { status: (typeof REFILL_STEPS)[number]["status"] }) {
  if (status === "done") {
    return (
      <span className="home-agents-carousel__refill-peek-step home-agents-carousel__refill-peek-step--done">
        <svg viewBox="0 0 12 12" fill="none" aria-hidden>
          <path
            d="M3.1 6.1l1.9 1.9 4-4.1"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }

  if (status === "active") {
    return <span className="home-agents-carousel__refill-peek-step home-agents-carousel__refill-peek-step--active" />;
  }

  return <span className="home-agents-carousel__refill-peek-step home-agents-carousel__refill-peek-step--upcoming" />;
}

/** Agents carousel — Refill Agent workflow peek. */
export function HomeAgentsCarouselRefillPeek() {
  return (
    <div className="home-agents-carousel__refill-peek" aria-hidden>
      <div className={`home-agents-carousel__refill-peek-card ${suisseIntl.className}`}>
        <div className="home-agents-carousel__refill-peek-header">
          <span className="home-agents-carousel__refill-peek-heading">Refill request</span>
          <span className="home-agents-carousel__refill-peek-status-pill">In progress</span>
        </div>

        <div className="home-agents-carousel__refill-peek-drug-block">
          <span className="home-agents-carousel__refill-peek-drug">{RX_REQUEST.drug}</span>
          <span className="home-agents-carousel__refill-peek-strength">{RX_REQUEST.strength}</span>
          <span className="home-agents-carousel__refill-peek-patient">{RX_REQUEST.patient}</span>
        </div>

        <div className="home-agents-carousel__refill-peek-progress" aria-hidden>
          <div className="home-agents-carousel__refill-peek-progress-track">
            <div className="home-agents-carousel__refill-peek-progress-rail">
              <span className="home-agents-carousel__refill-peek-progress-fill" />
            </div>
            <div className="home-agents-carousel__refill-peek-progress-indicators">
              {REFILL_STEPS.map((step) => (
                <RefillStepIndicator key={step.label} status={step.status} />
              ))}
            </div>
          </div>
          <div className="home-agents-carousel__refill-peek-progress-labels">
            {REFILL_STEPS.map((step) => (
              <span key={step.label} className="home-agents-carousel__refill-peek-progress-label">
                {step.label}
              </span>
            ))}
          </div>
        </div>

        <div className="home-agents-carousel__refill-peek-footer">
          <span className="home-agents-carousel__refill-peek-footer-pharmacy">{RX_REQUEST.pharmacy}</span>
          <span className="home-agents-carousel__refill-peek-footer-filled">Last filled {RX_REQUEST.lastFilled}</span>
        </div>
      </div>
    </div>
  );
}
