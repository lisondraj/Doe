"use client";

import { inter, suisseIntl } from "@/lib/home/fonts";

const OUTREACH = {
  patient: "James Chen",
  campaign: "Annual wellness recall",
  agentMessage: "Hi James — you're due for your annual wellness visit. I have Thu at 2:15 PM open.",
  patientReply: "Thursday at 2 works for me.",
  booked: "Thu 2:15 PM · Front desk synced",
} as const;

/** Patient outreach thread — live recall conversation on the shader band. */
export function DoePhoneHomeLabAlertsVisual() {
  return (
    <div className={`home-patient-outreach-visual ${suisseIntl.className}`} aria-hidden>
      <header className="home-patient-outreach-visual__header">
        <div className="home-patient-outreach-visual__header-copy">
          <p className={`home-patient-outreach-visual__label ${inter.className}`}>Live outreach</p>
          <p className="home-patient-outreach-visual__patient">{OUTREACH.patient}</p>
        </div>
        <span className={`home-patient-outreach-visual__badge ${inter.className}`}>SMS + voice</span>
      </header>

      <p className={`home-patient-outreach-visual__campaign ${inter.className}`}>{OUTREACH.campaign}</p>

      <div className="home-patient-outreach-visual__thread">
        <div className="home-patient-outreach-visual__message home-patient-outreach-visual__message--agent">
          <span className={`home-patient-outreach-visual__message-label ${inter.className}`}>Agent</span>
          <p className="home-patient-outreach-visual__message-text">{OUTREACH.agentMessage}</p>
        </div>

        <div className="home-patient-outreach-visual__message home-patient-outreach-visual__message--patient">
          <span className={`home-patient-outreach-visual__message-label ${inter.className}`}>Patient</span>
          <p className="home-patient-outreach-visual__message-text">{OUTREACH.patientReply}</p>
        </div>
      </div>

      <div className={`home-patient-outreach-visual__booked ${inter.className}`}>
        <span className="home-patient-outreach-visual__booked-mark" aria-hidden />
        <span className="home-patient-outreach-visual__booked-copy">{OUTREACH.booked}</span>
      </div>
    </div>
  );
}
