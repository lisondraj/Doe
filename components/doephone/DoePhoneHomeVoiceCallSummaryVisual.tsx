"use client";

import { inter, suisseIntl } from "@/lib/home/fonts";

const CAPTURE = {
  patient: "Maria Lopez",
  reason: "Refill request",
  duration: "2:48",
  quote: "I need my blood pressure refill sent to CVS",
  ehr: "Elation",
  sync: "3 fields synced",
} as const;

const LEDGER = [
  { id: "heard", phase: "Heard", detail: "Lisinopril 10 mg · monthly refill", state: "done" as const },
  { id: "routed", phase: "Routed", detail: "Pharmacy queue · CVS #4821", state: "done" as const },
  { id: "chart", phase: "Chart", detail: "Med list + pickup 4:30 PM", state: "active" as const },
] as const;

function PhoneIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="home-phone-capture-visual__phone-icon h-[0.9em] w-[0.9em] shrink-0">
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

/** Phone agent live capture — call audio becomes chart lines on the inbox shader band. */
export function DoePhoneHomeVoiceCallSummaryVisual() {
  return (
    <div className={`home-phone-capture-visual ${suisseIntl.className}`} aria-hidden>
      <div className="home-phone-capture-visual__agent">
        <div className="home-phone-capture-visual__agent-row">
          <span className="home-phone-capture-visual__phone-badge" aria-hidden>
            <PhoneIcon />
          </span>
          <span className="home-phone-capture-visual__agent-title">Doe Phone Agent</span>
          <span className={`home-phone-capture-visual__live ${inter.className}`}>{CAPTURE.duration}</span>
        </div>
        <p className={`home-phone-capture-visual__meta ${inter.className}`}>
          {CAPTURE.patient} · {CAPTURE.reason}
        </p>
      </div>

      <blockquote className={`home-phone-capture-visual__quote ${inter.className}`}>
        &ldquo;{CAPTURE.quote}&rdquo;
      </blockquote>

      <div className="home-phone-capture-visual__ledger">
        <p className={`home-phone-capture-visual__ledger-heading ${inter.className}`}>Writing to chart</p>

        <ol className="home-phone-capture-visual__ledger-list">
          {LEDGER.map((entry, index) => (
            <li
              key={entry.id}
              className={`home-phone-capture-visual__ledger-item home-phone-capture-visual__ledger-item--${entry.state}${
                index === LEDGER.length - 1 ? " home-phone-capture-visual__ledger-item--last" : ""
              }`}
            >
              <span className="home-phone-capture-visual__ledger-rail" aria-hidden>
                <span className="home-phone-capture-visual__ledger-dot" />
                {index < LEDGER.length - 1 ? <span className="home-phone-capture-visual__ledger-line" /> : null}
              </span>
              <div className="home-phone-capture-visual__ledger-copy">
                <span className={`home-phone-capture-visual__ledger-phase ${inter.className}`}>{entry.phase}</span>
                <span className="home-phone-capture-visual__ledger-detail">{entry.detail}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className={`home-phone-capture-visual__footer ${inter.className}`}>
        <span className="home-phone-capture-visual__footer-ehr">{CAPTURE.ehr}</span>
        <span className="home-phone-capture-visual__footer-sync">{CAPTURE.sync}</span>
      </div>
    </div>
  );
}
