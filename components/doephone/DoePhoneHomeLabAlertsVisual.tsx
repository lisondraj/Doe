"use client";

import { inter, suisseIntl } from "@/lib/home/fonts";

const OUTREACH = {
  patient: "James Chen",
  chartLine: "Annual wellness · 14 mo overdue · Dr. Walsh",
  booked: "Thu 2:15 PM booked · front desk synced",
} as const;

const CHART_FACTS = [
  { id: "last", label: "Last visit", value: "Apr 12, 2024" },
  { id: "gap", label: "Care gap", value: "Annual due" },
  { id: "pcp", label: "PCP", value: "Dr. Walsh" },
] as const;

const MESSAGES = [
  {
    id: "open",
    role: "out" as const,
    text: "Hi James — you're due for your annual wellness visit. Last seen Apr 12, 2024 at Main Clinic.",
  },
  {
    id: "context",
    role: "out" as const,
    text: "Chart shows BP 128/82 and A1c 5.8 at that visit. I have Thu 2:15 PM or Fri 10:30 AM open.",
  },
  {
    id: "reply",
    role: "in" as const,
    text: "Thursday at 2:15 works for me.",
  },
  {
    id: "confirm",
    role: "out" as const,
    text: "You're booked Thu 2:15 PM with Dr. Walsh. We'll text a reminder the day before.",
  },
] as const;

/** Patient outreach thread — recall conversation on the outreach shader band. */
export function DoePhoneHomeLabAlertsVisual() {
  return (
    <div className={`home-patient-outreach-visual ${suisseIntl.className}`} aria-hidden>
      <div className="home-patient-outreach-visual__lead">
        <p className="home-patient-outreach-visual__patient">{OUTREACH.patient}</p>
        <p className={`home-patient-outreach-visual__chart-line ${inter.className}`}>{OUTREACH.chartLine}</p>
      </div>

      <div className="home-patient-outreach-visual__chart-facts" aria-hidden>
        {CHART_FACTS.map((fact) => (
          <span key={fact.id} className={`home-patient-outreach-visual__chart-fact ${inter.className}`}>
            <span className="home-patient-outreach-visual__chart-fact-label">{fact.label}</span>
            <span className="home-patient-outreach-visual__chart-fact-value">{fact.value}</span>
          </span>
        ))}
      </div>

      <div className="home-patient-outreach-visual__thread">
        {MESSAGES.map((message) => (
          <div
            key={message.id}
            className={`home-patient-outreach-visual__bubble home-patient-outreach-visual__bubble--${message.role} ${inter.className}`}
          >
            <p className="home-patient-outreach-visual__bubble-text">{message.text}</p>
          </div>
        ))}
      </div>

      <p className={`home-patient-outreach-visual__booked ${inter.className}`}>{OUTREACH.booked}</p>
    </div>
  );
}
