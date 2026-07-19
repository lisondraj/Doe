"use client";

import { dmSans } from "@/lib/home/fonts";

const CALL = {
  patient: "James Chen",
  firstName: "James",
} as const;

const MESSAGES = [
  {
    id: "offer",
    role: "agent" as const,
    text: "You're due for your annual. Thu 2:15 or Fri 10:30?",
  },
  {
    id: "reply",
    role: "patient" as const,
    text: "Thursday works.",
  },
  {
    id: "confirm",
    role: "agent" as const,
    text: "Booked Thu 2:15 with Dr. Walsh.",
  },
] as const;

function PlainNote({ label, detail }: { label: string; detail: string }) {
  return (
    <div className="home-outreach-voice-visual__note">
      <p className="home-outreach-voice-visual__note-label">{label}</p>
      <p className="home-outreach-voice-visual__note-detail">{detail}</p>
    </div>
  );
}

function VoiceWaveform() {
  return (
    <div className="home-outreach-voice-visual__waveform" aria-hidden>
      {Array.from({ length: 9 }, (_, index) => (
        <span
          key={index}
          className="home-outreach-voice-visual__waveform-bar"
          style={{ height: `${28 + ((index * 17) % 52)}%` }}
        />
      ))}
    </div>
  );
}

/** Patient recall outreach — active-agents dusk panels on shader, voice transcript thread. */
export function DoePhoneHomeLabAlertsVisual() {
  return (
    <div className={`home-outreach-voice-visual ${dmSans.className}`} aria-hidden>
      <div className="home-outreach-voice-visual__body">
        <div className="home-outreach-voice-visual__thread-stage">
          <div className="home-lab-alerts-scale">
            <div className="home-outreach-voice-visual__thread">
              {MESSAGES.map((message) =>
                message.role === "agent" ? (
                  <div key={message.id} className="home-outreach-voice-visual__panel home-outreach-voice-visual__panel--agent">
                    <div className="home-outreach-voice-visual__agent-meta">
                      <VoiceWaveform />
                      <span className="home-outreach-voice-visual__agent-label">Doe Agent</span>
                    </div>
                    <p className="home-outreach-voice-visual__panel-text">{message.text}</p>
                  </div>
                ) : (
                  <div key={message.id} className="home-outreach-voice-visual__panel home-outreach-voice-visual__panel--patient">
                    <div className="home-outreach-voice-visual__agent-meta">
                      <VoiceWaveform />
                      <span className="home-outreach-voice-visual__agent-label">{CALL.patient}</span>
                    </div>
                    <p className="home-outreach-voice-visual__panel-text">{message.text}</p>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>

        <div className="home-outreach-voice-visual__emr-stage">
          <div className="home-outreach-emr-scale">
            <PlainNote label="Pulling from EMR" detail={`${CALL.firstName} is overdue for appointment`} />
          </div>
        </div>
      </div>
    </div>
  );
}
