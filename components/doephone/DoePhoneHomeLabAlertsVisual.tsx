"use client";

import { inter, suisseIntl } from "@/lib/home/fonts";

const ALERT = {
  patient: "Maria Lopez · 58F",
  value: "Potassium 6.1 mEq/L",
  context: "CKD stage 3 · on lisinopril",
  recipient: "Dr. Chen",
  line: "Mobile · covering",
} as const;

const SCRIPT_LINES = [
  "Hi Dr. Chen — calling with a critical lab for Maria Lopez.",
  "Potassium is 6.1, up from 4.8 last week while on lisinopril.",
  "Can I mark this reviewed and page nephrology if needed?",
] as const;

const STEPS = [
  { id: "identify", label: "Identify patient", status: "done" as const },
  { id: "deliver", label: "Deliver result", status: "active" as const },
  { id: "log", label: "Log acknowledgment", status: "upcoming" as const },
] as const;

function StepMark({ status }: { status: (typeof STEPS)[number]["status"] }) {
  if (status === "done") {
    return <span className="home-lab-voice-visual__step-mark home-lab-voice-visual__step-mark--done" aria-hidden>✓</span>;
  }

  if (status === "active") {
    return <span className="home-lab-voice-visual__step-mark home-lab-voice-visual__step-mark--active" aria-hidden />;
  }

  return <span className="home-lab-voice-visual__step-mark home-lab-voice-visual__step-mark--upcoming" aria-hidden />;
}

/** Outbound lab voice alert — ambient shader band. */
export function DoePhoneHomeLabAlertsVisual() {
  return (
    <div className={`home-lab-voice-visual ${suisseIntl.className}`} aria-hidden>
      <div className="home-lab-voice-visual__header">
        <div className="home-lab-voice-visual__header-copy">
          <p className="home-lab-voice-visual__eyebrow">Outbound voice alert</p>
          <p className="home-lab-voice-visual__title">Critical lab callback</p>
        </div>
        <span className={`home-lab-voice-visual__live ${inter.className}`}>Ringing</span>
      </div>

      <div className="home-lab-voice-visual__alert-block">
        <p className="home-lab-voice-visual__patient">{ALERT.patient}</p>
        <p className={`home-lab-voice-visual__value ${inter.className}`}>{ALERT.value}</p>
        <p className={`home-lab-voice-visual__context ${inter.className}`}>{ALERT.context}</p>
      </div>

      <div className={`home-lab-voice-visual__dial ${inter.className}`}>
        <div className="home-lab-voice-visual__waveform" aria-hidden>
          {Array.from({ length: 18 }, (_, index) => (
            <span
              key={index}
              className="home-lab-voice-visual__waveform-bar"
              style={{ height: `${38 + ((index * 17) % 52)}%` }}
            />
          ))}
        </div>
        <div className="home-lab-voice-visual__dial-copy">
          <span className="home-lab-voice-visual__dial-target">Calling {ALERT.recipient}</span>
          <span className="home-lab-voice-visual__dial-line">{ALERT.line}</span>
        </div>
      </div>

      <div className="home-lab-voice-visual__script">
        <p className={`home-lab-voice-visual__script-label ${inter.className}`}>Agent script</p>
        {SCRIPT_LINES.map((line) => (
          <p key={line} className={`home-lab-voice-visual__script-line ${inter.className}`}>
            {line}
          </p>
        ))}
      </div>

      <ul className={`home-lab-voice-visual__steps ${inter.className}`}>
        {STEPS.map((step) => (
          <li
            key={step.id}
            className={`home-lab-voice-visual__step home-lab-voice-visual__step--${step.status}`}
          >
            <StepMark status={step.status} />
            <span className="home-lab-voice-visual__step-label">{step.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
