"use client";

import { inter, suisseIntl } from "@/lib/home/fonts";

const AUTH = {
  patient: "Brooks, J.",
  request: "MRI lumbar",
  duration: "3:12",
  quoteLine1: "Need prior auth for my MRI",
  quoteLine2: "next Thursday",
  payer: "UnitedHealthcare",
  status: "Submitted to portal",
} as const;

const FIELDS = [
  { id: "cpt", label: "CPT", value: "72148 · MRI lumbar", state: "done" as const },
  { id: "dx", label: "Dx", value: "M54.5 · Low back pain", state: "done" as const },
  { id: "payer", label: "Payer", value: "UnitedHealthcare PPO", state: "active" as const },
] as const;

const STEPS = [
  { id: "chart", label: "Chart", state: "done" as const },
  { id: "packet", label: "Packet", state: "active" as const },
  { id: "submit", label: "Submit", state: "upcoming" as const },
] as const;

function PhoneIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="home-prior-auth-visual__phone-icon h-[0.9em] w-[0.9em] shrink-0">
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

function FieldMark({ state }: { state: (typeof FIELDS)[number]["state"] }) {
  if (state === "done") {
    return (
      <span className="home-prior-auth-visual__field-mark home-prior-auth-visual__field-mark--done" aria-hidden>
        ✓
      </span>
    );
  }

  return <span className="home-prior-auth-visual__field-mark home-prior-auth-visual__field-mark--active" aria-hidden />;
}

/** Prior auth agent — live call assembles chart facts into a payer packet on the shader band. */
export function DoePhoneHomePriorAuthVisual() {
  return (
    <div className={`home-prior-auth-visual ${suisseIntl.className}`} aria-hidden>
      <div className="home-prior-auth-visual__agent">
        <div className="home-prior-auth-visual__agent-row">
          <span className="home-prior-auth-visual__phone-badge" aria-hidden>
            <PhoneIcon />
          </span>
          <span className={`home-prior-auth-visual__context ${inter.className}`}>
            {AUTH.patient} · {AUTH.request}
          </span>
          <span className={`home-prior-auth-visual__live ${inter.className}`}>{AUTH.duration}</span>
        </div>
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
        <p className="home-prior-auth-visual__quote">
          <span className="home-prior-auth-visual__quote-line">&ldquo;{AUTH.quoteLine1}</span>
          <span className="home-prior-auth-visual__quote-line">{AUTH.quoteLine2}&rdquo;</span>
        </p>
      </div>

      <div className="home-prior-auth-visual__packet">
        <div className="home-prior-auth-visual__fields">
          {FIELDS.map((field) => (
            <div
              key={field.id}
              className={`home-prior-auth-visual__field home-prior-auth-visual__field--${field.state}`}
            >
              <span className={`home-prior-auth-visual__field-label ${inter.className}`}>{field.label}</span>
              <span className="home-prior-auth-visual__field-value">{field.value}</span>
              <FieldMark state={field.state} />
            </div>
          ))}
        </div>

        <div className="home-prior-auth-visual__steps" aria-hidden>
          {STEPS.map((step) => (
            <span
              key={step.id}
              className={`home-prior-auth-visual__step home-prior-auth-visual__step--${step.state} ${inter.className}`}
            >
              {step.label}
            </span>
          ))}
        </div>
      </div>

      <div className={`home-prior-auth-visual__footer ${inter.className}`}>
        <span className="home-prior-auth-visual__footer-payer">{AUTH.payer}</span>
        <span className="home-prior-auth-visual__footer-status">{AUTH.status}</span>
      </div>
    </div>
  );
}
