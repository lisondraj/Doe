"use client";

import { dmSans } from "@/lib/home/fonts";

const ORDER = {
  procedure: "MRI lumbar spine",
  patient: "Brooks, J.",
  payer: "UHC",
} as const;

const PIPELINE_STEPS = [
  { id: "chart", label: "Chart", status: "done" as const },
  { id: "call", label: "Call payer", status: "done" as const },
  { id: "approved", label: "Approved", status: "done" as const },
  { id: "filed", label: "Filed", status: "active" as const },
] as const;

const DETAILS = [
  { label: "Auth ref", value: "PA-482917" },
  { label: "Valid", value: "90 days" },
  { label: "Payer", value: "UHC Prior Auth" },
] as const;

const WAVE_HEIGHTS = [0.34, 0.58, 0.44, 0.72, 0.4, 0.62] as const;

function PhoneIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="home-prior-auth-visual__phone-icon">
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

function VoiceWaveform() {
  return (
    <div className="home-prior-auth-visual__waveform" aria-hidden>
      {WAVE_HEIGHTS.map((height, index) => (
        <span
          key={index}
          className="home-prior-auth-visual__waveform-bar"
          style={{ height: `${Math.round(height * 100)}%` }}
        />
      ))}
    </div>
  );
}

function StepIndicator({ status }: { status: (typeof PIPELINE_STEPS)[number]["status"] }) {
  if (status === "done") {
    return (
      <span className="home-prior-auth-visual__step-mark home-prior-auth-visual__step-mark--done" aria-hidden>
        <svg viewBox="0 0 12 12" fill="none">
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
    return <span className="home-prior-auth-visual__step-mark home-prior-auth-visual__step-mark--active" aria-hidden />;
  }

  return <span className="home-prior-auth-visual__step-mark home-prior-auth-visual__step-mark--upcoming" aria-hidden />;
}

/** Prior auth workflow board on shader band (no transcript bubbles). */
export function DoePhoneHomePriorAuthVisual() {
  return (
    <div className={`home-prior-auth-visual ${dmSans.className}`} aria-hidden>
      <div className="home-prior-auth-visual__card">
        <header className="home-prior-auth-visual__header">
          <div className="home-prior-auth-visual__header-copy">
            <p className="home-prior-auth-visual__eyebrow">From chart</p>
            <h3 className="home-prior-auth-visual__title">{ORDER.procedure}</h3>
            <p className="home-prior-auth-visual__meta">
              {ORDER.patient} · {ORDER.payer}
            </p>
          </div>
          <span className="home-prior-auth-visual__status-badge">Approved</span>
        </header>

        <div className="home-prior-auth-visual__activity">
          <span className="home-prior-auth-visual__phone-badge" aria-hidden>
            <PhoneIcon />
          </span>
          <VoiceWaveform />
          <div className="home-prior-auth-visual__activity-copy">
            <p className="home-prior-auth-visual__activity-line">Prior Auth Agent</p>
            <p className="home-prior-auth-visual__activity-subline">Filing PA-482917 to chart</p>
          </div>
          <span className="home-prior-auth-visual__activity-live">Live</span>
        </div>

        <div className="home-prior-auth-visual__pipeline" aria-hidden>
          <div className="home-prior-auth-visual__pipeline-track">
            <div className="home-prior-auth-visual__pipeline-rail">
              <span className="home-prior-auth-visual__pipeline-fill" />
            </div>
            <div className="home-prior-auth-visual__pipeline-marks">
              {PIPELINE_STEPS.map((step) => (
                <StepIndicator key={step.id} status={step.status} />
              ))}
            </div>
          </div>
          <div className="home-prior-auth-visual__pipeline-labels">
            {PIPELINE_STEPS.map((step) => (
              <span
                key={step.id}
                className={`home-prior-auth-visual__pipeline-label${
                  step.status === "active" ? " home-prior-auth-visual__pipeline-label--active" : ""
                }`}
              >
                {step.label}
              </span>
            ))}
          </div>
        </div>

        <dl className="home-prior-auth-visual__details">
          {DETAILS.map((item) => (
            <div key={item.label} className="home-prior-auth-visual__detail-row">
              <dt className="home-prior-auth-visual__detail-label">{item.label}</dt>
              <dd className="home-prior-auth-visual__detail-value">{item.value}</dd>
            </div>
          ))}
        </dl>

        <footer className="home-prior-auth-visual__footer">
          <span className="home-prior-auth-visual__footer-stat">Completed in 4m 12s</span>
          <span className="home-prior-auth-visual__footer-pill">Auto-file on</span>
        </footer>
      </div>
    </div>
  );
}
