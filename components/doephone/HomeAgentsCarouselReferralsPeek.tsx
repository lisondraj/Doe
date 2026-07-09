"use client";

import { suisseIntl } from "@/lib/home/fonts";

const ORANGE = "#D2774C";

const WAVE_HEIGHTS = [0.42, 0.72, 0.58, 0.88, 0.5, 0.68, 0.46] as const;

const REFERRAL_STEPS = [
  { label: "Call intake", status: "done" as const },
  { label: "Prior auth", status: "active" as const },
  { label: "Book visit", status: "upcoming" as const },
] as const;

const REFERRAL_DETAILS = [
  { label: "Specialist", value: "Riverside" },
  { label: "Auth ref", value: "PA-448291" },
  { label: "Payer status", value: "Awaiting" },
] as const;

function getReferralsFadeOpacity(spread: number) {
  if (spread === 0) {
    return 1;
  }

  return Math.max(0.58, 1 - spread * 0.1);
}

function VoiceWaveform() {
  return (
    <div className="home-agents-carousel__referrals-peek-waveform" aria-hidden>
      {WAVE_HEIGHTS.map((height, index) => (
        <span
          key={index}
          className="home-agents-carousel__referrals-peek-waveform-bar"
          style={{ height: `${Math.round(height * 100)}%` }}
        />
      ))}
    </div>
  );
}

function StepIndicator({ status }: { status: (typeof REFERRAL_STEPS)[number]["status"] }) {
  if (status === "done") {
    return (
      <span className="home-agents-carousel__referrals-peek-indicator home-agents-carousel__referrals-peek-indicator--done">
        <svg viewBox="0 0 12 12" fill="none" aria-hidden>
          <path
            d="M3.1 6.1l1.9 1.9 4-4.1"
            stroke={ORANGE}
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }

  if (status === "active") {
    return <span className="home-agents-carousel__referrals-peek-indicator home-agents-carousel__referrals-peek-indicator--active" />;
  }

  return <span className="home-agents-carousel__referrals-peek-indicator home-agents-carousel__referrals-peek-indicator--upcoming" />;
}

/** Agents carousel — Referrals Agent UI peek. */
export function HomeAgentsCarouselReferralsPeek() {
  return (
    <div className="home-agents-carousel__referrals-peek" aria-hidden>
      <div className={`home-agents-carousel__referrals-peek-card ${suisseIntl.className}`}>
        <div className="home-agents-carousel__referrals-peek-lead">
          <VoiceWaveform />
          <div className="home-agents-carousel__referrals-peek-voice-copy">
            <p className="home-agents-carousel__referrals-peek-voice-line">Calling specialist&apos;s office…</p>
            <p className="home-agents-carousel__referrals-peek-voice-subline">Referral to Cardiology</p>
          </div>
        </div>

        <div className="home-agents-carousel__referrals-peek-progress" aria-hidden>
          <div className="home-agents-carousel__referrals-peek-progress-track">
            <div className="home-agents-carousel__referrals-peek-progress-rail">
              <span className="home-agents-carousel__referrals-peek-progress-fill" />
            </div>
            <div className="home-agents-carousel__referrals-peek-progress-indicators">
              {REFERRAL_STEPS.map((step) => (
                <StepIndicator key={step.label} status={step.status} />
              ))}
            </div>
          </div>
          <div
            className="home-agents-carousel__referrals-peek-progress-labels"
            style={{
              opacity: getReferralsFadeOpacity(1),
            }}
          >
            {REFERRAL_STEPS.map((step) => (
              <span key={step.label} className="home-agents-carousel__referrals-peek-progress-label">
                {step.label}
              </span>
            ))}
          </div>
        </div>

        <dl className="home-agents-carousel__referrals-peek-details">
          {REFERRAL_DETAILS.map((item, detailIndex) => {
            const spread = detailIndex + 2;

            return (
              <div
                key={item.label}
                className="home-agents-carousel__referrals-peek-detail-row"
                style={{
                  opacity: getReferralsFadeOpacity(spread),
                }}
              >
                <dt className="home-agents-carousel__referrals-peek-detail-label">{item.label}</dt>
                <dd className="home-agents-carousel__referrals-peek-detail-value">{item.value}</dd>
              </div>
            );
          })}
        </dl>
      </div>
    </div>
  );
}
