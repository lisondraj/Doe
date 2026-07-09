"use client";

import { dmSans, inter, suisseIntl } from "@/lib/home/fonts";

const CALL = {
  patient: "Brooks, J.",
  order: "MRI lumbar spine",
  duration: "On call 3:12",
  quoteLine1: "Need prior auth for my MRI",
  quoteLine2: "next Thursday.",
} as const;

const CHART_ROWS = [
  { id: "cpt", code: "72148", detail: "MRI lumbar spine", state: "done" as const },
  { id: "dx", code: "M54.5", detail: "Low back pain", state: "done" as const },
  { id: "payer", code: "UHC PPO", detail: "UnitedHealthcare", state: "active" as const },
] as const;

/** Prior auth — voice strip + chart facts on the shader band. */
export function DoePhoneHomePriorAuthVisual() {
  return (
    <div className={`home-prior-auth-visual ${suisseIntl.className}`} aria-hidden>
      <div className="home-prior-auth-visual__surface">
        <div className="home-prior-auth-visual__hero">
          <div className="home-prior-auth-visual__hero-copy">
            <p className="home-prior-auth-visual__patient">{CALL.patient}</p>
            <p className={`home-prior-auth-visual__order ${inter.className}`}>{CALL.order}</p>
          </div>
          <span className={`home-prior-auth-visual__live ${inter.className}`}>{CALL.duration}</span>
        </div>

        <div className="home-prior-auth-visual__voice">
          <div className="home-prior-auth-visual__waveform" aria-hidden>
            {Array.from({ length: 11 }, (_, index) => (
              <span
                key={index}
                className="home-prior-auth-visual__waveform-bar"
                style={{ height: `${32 + ((index * 17) % 50)}%` }}
              />
            ))}
          </div>
          <div className={`home-prior-auth-visual__quote-panel ${dmSans.className}`}>
            <p className="home-prior-auth-visual__quote">
              <span className="home-prior-auth-visual__quote-line">&ldquo;{CALL.quoteLine1}</span>
              <span className="home-prior-auth-visual__quote-line">{CALL.quoteLine2}&rdquo;</span>
            </p>
          </div>
        </div>

        <div className="home-prior-auth-visual__chart-panel" aria-hidden>
          {CHART_ROWS.map((row) => (
            <div
              key={row.id}
              className={`home-prior-auth-visual__fact home-prior-auth-visual__fact--${row.state}`}
            >
              <span className={`home-prior-auth-visual__fact-code ${inter.className}`}>{row.code}</span>
              <span className="home-prior-auth-visual__fact-detail">{row.detail}</span>
            </div>
          ))}
        </div>

        <p className={`home-prior-auth-visual__status ${inter.className}`}>
          UnitedHealthcare · Submitted · Ref PA-48219
        </p>
      </div>
    </div>
  );
}
