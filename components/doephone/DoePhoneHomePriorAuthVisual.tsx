"use client";

import { inter, suisseIntl } from "@/lib/home/fonts";

const CALL = {
  patient: "Brooks, J.",
  order: "MRI lumbar spine",
  duration: "On call 3:12",
  quote: "Need prior auth for my MRI next Thursday.",
} as const;

const CHART_ROWS = [
  { id: "cpt", code: "72148", detail: "MRI lumbar spine", state: "done" as const },
  { id: "dx", code: "M54.5", detail: "Low back pain", state: "done" as const },
  { id: "payer", code: "UHC PPO", detail: "UnitedHealthcare", state: "active" as const },
] as const;

/** Prior auth — phone agent pulls chart facts on the shader band. */
export function DoePhoneHomePriorAuthVisual() {
  return (
    <div className={`home-prior-auth-visual ${suisseIntl.className}`} aria-hidden>
      <div className="home-prior-auth-visual__hero">
        <div className="home-prior-auth-visual__hero-copy">
          <p className="home-prior-auth-visual__patient">{CALL.patient}</p>
          <p className={`home-prior-auth-visual__order ${inter.className}`}>{CALL.order}</p>
        </div>
        <span className={`home-prior-auth-visual__live ${inter.className}`}>{CALL.duration}</span>
      </div>

      <div className={`home-prior-auth-visual__call ${inter.className}`}>
        <div className="home-prior-auth-visual__waveform" aria-hidden>
          {Array.from({ length: 11 }, (_, index) => (
            <span
              key={index}
              className="home-prior-auth-visual__waveform-bar"
              style={{ height: `${32 + ((index * 17) % 50)}%` }}
            />
          ))}
        </div>
        <p className="home-prior-auth-visual__quote">&ldquo;{CALL.quote}&rdquo;</p>
      </div>

      <div className="home-prior-auth-visual__facts" aria-hidden>
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

      <p className={`home-prior-auth-visual__footer ${inter.className}`}>
        UnitedHealthcare · Submitted · Ref PA-48219
      </p>
    </div>
  );
}
