"use client";

import { suisseIntl } from "@/lib/home/fonts";

const INK = "#3D4549";
const ORANGE = "#D2774C";

const REFERRAL_STEPS = [
  { label: "Intake", status: "done" as const },
  { label: "Prior auth", status: "active" as const },
  { label: "Book visit", status: "upcoming" as const },
] as const;

const REFERRAL_DETAILS = [
  { label: "Specialist", value: "Riverside Cardiology" },
  { label: "Auth ref", value: "PA-448291" },
  { label: "Payer status", value: "Awaiting response" },
] as const;

function StepNode({ status }: { status: (typeof REFERRAL_STEPS)[number]["status"] }) {
  if (status === "done") {
    return (
      <span className="home-agents-carousel__referrals-peek-step-node home-agents-carousel__referrals-peek-step-node--done">
        <svg viewBox="0 0 12 12" fill="none" aria-hidden>
          <path
            d="M3.1 6.1l1.9 1.9 4-4.1"
            stroke={INK}
            strokeWidth="1.35"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }

  if (status === "active") {
    return (
      <span className="home-agents-carousel__referrals-peek-step-node home-agents-carousel__referrals-peek-step-node--active">
        <span className="home-agents-carousel__referrals-peek-step-pulse" />
      </span>
    );
  }

  return <span className="home-agents-carousel__referrals-peek-step-node home-agents-carousel__referrals-peek-step-node--upcoming" />;
}

/** Desktop agents carousel — Referrals Agent UI peek (top-left, circular clip). */
export function HomeAgentsCarouselReferralsPeek() {
  return (
    <div className="home-agents-carousel__referrals-peek" aria-hidden>
      <div className={`home-agents-carousel__referrals-peek-card ${suisseIntl.className}`}>
        <div className="home-agents-carousel__referrals-peek-header">
          <div
            className="home-agents-carousel__referrals-peek-logo bg-gradient-to-br from-[#E7A944] via-[#D2774C] to-[#1E343A]"
            aria-hidden
          />
          <div className="home-agents-carousel__referrals-peek-heading">
            <p className="home-agents-carousel__referrals-peek-title">Referral</p>
            <p className="home-agents-carousel__referrals-peek-route">
              <span>J. Ortiz</span>
              <svg viewBox="0 0 20 8" fill="none" aria-hidden className="home-agents-carousel__referrals-peek-route-arrow">
                <path d="M1 4h14M13 2l3 2-3 2" stroke={ORANGE} strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Cardiology</span>
            </p>
          </div>
        </div>

        <div className="home-agents-carousel__referrals-peek-track" aria-hidden>
          <span className="home-agents-carousel__referrals-peek-track-line" />
          <span className="home-agents-carousel__referrals-peek-track-line home-agents-carousel__referrals-peek-track-line--active" />
          <ol className="home-agents-carousel__referrals-peek-steps">
            {REFERRAL_STEPS.map((step) => (
              <li key={step.label} className="home-agents-carousel__referrals-peek-step">
                <StepNode status={step.status} />
                <span
                  className={`home-agents-carousel__referrals-peek-step-label${
                    step.status === "active" ? " home-agents-carousel__referrals-peek-step-label--active" : ""
                  }`}
                >
                  {step.label}
                </span>
              </li>
            ))}
          </ol>
        </div>

        <dl className="home-agents-carousel__referrals-peek-details">
          {REFERRAL_DETAILS.map((item) => (
            <div key={item.label} className="home-agents-carousel__referrals-peek-detail-row">
              <dt className="home-agents-carousel__referrals-peek-detail-label">{item.label}</dt>
              <dd className="home-agents-carousel__referrals-peek-detail-value">{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
