"use client";

import { inter, suisseIntl } from "@/lib/home/fonts";

const OUTREACH = {
  patient: "James Chen",
  campaign: "Annual wellness recall",
  channels: ["SMS", "Voice"] as const,
  booked: "Thu 2:15 PM · Front desk synced",
} as const;

const STATS = [
  { id: "due", label: "Due", value: "42" },
  { id: "reached", label: "Reached", value: "18" },
  { id: "booked", label: "Booked", value: "6" },
] as const;

const MESSAGES = [
  {
    id: "agent",
    role: "agent" as const,
    time: "10:12 AM",
    text: "Hi James — you're due for your annual wellness visit. I have Thu at 2:15 PM open.",
  },
  {
    id: "patient",
    role: "patient" as const,
    time: "10:14 AM",
    text: "Thursday at 2 works for me.",
  },
] as const;

const PROGRESS = [
  { id: "reached", label: "Reached", state: "done" as const },
  { id: "replied", label: "Replied", state: "done" as const },
  { id: "booked", label: "Booked", state: "active" as const },
] as const;

/** Patient outreach thread — recall conversation on the outreach shader band. */
export function DoePhoneHomeLabAlertsVisual() {
  return (
    <div className={`home-patient-outreach-visual ${suisseIntl.className}`} aria-hidden>
      <header className="home-patient-outreach-visual__header">
        <div className="home-patient-outreach-visual__header-copy">
          <p className={`home-patient-outreach-visual__label ${inter.className}`}>Live outreach</p>
          <p className="home-patient-outreach-visual__patient">{OUTREACH.patient}</p>
          <p className={`home-patient-outreach-visual__campaign ${inter.className}`}>{OUTREACH.campaign}</p>
        </div>
        <div className="home-patient-outreach-visual__channels" aria-hidden>
          {OUTREACH.channels.map((channel) => (
            <span key={channel} className={`home-patient-outreach-visual__channel ${inter.className}`}>
              {channel}
            </span>
          ))}
        </div>
      </header>

      <div className="home-patient-outreach-visual__card">
        <div className="home-patient-outreach-visual__stats" aria-hidden>
          {STATS.map((stat) => (
            <div key={stat.id} className="home-patient-outreach-visual__stat">
              <span className="home-patient-outreach-visual__stat-value">{stat.value}</span>
              <span className={`home-patient-outreach-visual__stat-label ${inter.className}`}>{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="home-patient-outreach-visual__thread">
          {MESSAGES.map((message) => (
            <div
              key={message.id}
              className={`home-patient-outreach-visual__message home-patient-outreach-visual__message--${message.role}`}
            >
              <div className={`home-patient-outreach-visual__message-head ${inter.className}`}>
                <span className="home-patient-outreach-visual__message-label">
                  {message.role === "agent" ? "Agent" : "Patient"}
                </span>
                <span className="home-patient-outreach-visual__message-time">{message.time}</span>
              </div>
              <p className="home-patient-outreach-visual__message-text">{message.text}</p>
            </div>
          ))}
        </div>

        <div className="home-patient-outreach-visual__progress" aria-hidden>
          {PROGRESS.map((step) => (
            <span
              key={step.id}
              className={`home-patient-outreach-visual__progress-step home-patient-outreach-visual__progress-step--${step.state} ${inter.className}`}
            >
              {step.label}
            </span>
          ))}
        </div>

        <div className={`home-patient-outreach-visual__booked ${inter.className}`}>
          <span className="home-patient-outreach-visual__booked-mark" aria-hidden />
          <span className="home-patient-outreach-visual__booked-copy">{OUTREACH.booked}</span>
        </div>
      </div>
    </div>
  );
}
