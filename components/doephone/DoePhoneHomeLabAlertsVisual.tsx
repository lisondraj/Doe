"use client";

import { inter, suisseIntl } from "@/lib/home/fonts";

const OUTREACH = {
  patient: "James Chen",
  meta: "Annual wellness · overdue",
  booked: "Thu 2:15 PM booked",
} as const;

const MESSAGES = [
  {
    id: "open",
    role: "out" as const,
    text: "You're due for your annual — Thu 2:15 or Fri 10:30?",
  },
  {
    id: "reply",
    role: "in" as const,
    text: "Thursday works.",
  },
  {
    id: "confirm",
    role: "out" as const,
    text: "Booked Thu 2:15 with Dr. Walsh.",
  },
] as const;

/** Patient outreach — voice recall thread on the outreach shader band. */
export function DoePhoneHomeLabAlertsVisual() {
  return (
    <div className={`home-patient-outreach-visual ${suisseIntl.className}`} aria-hidden>
      <div className="home-patient-outreach-visual__surface">
        <div className="home-patient-outreach-visual__lead">
          <p className="home-patient-outreach-visual__patient">{OUTREACH.patient}</p>
          <p className={`home-patient-outreach-visual__meta ${inter.className}`}>{OUTREACH.meta}</p>
        </div>

        <div className={`home-patient-outreach-visual__thread ${inter.className}`}>
          {MESSAGES.map((message) => (
            <div
              key={message.id}
              className={`home-patient-outreach-visual__bubble home-patient-outreach-visual__bubble--${message.role}`}
            >
              <p className="home-patient-outreach-visual__bubble-text">{message.text}</p>
            </div>
          ))}
        </div>

        <p className={`home-patient-outreach-visual__booked ${inter.className}`}>{OUTREACH.booked}</p>
      </div>
    </div>
  );
}
