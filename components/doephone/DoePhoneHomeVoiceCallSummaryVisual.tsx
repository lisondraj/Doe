"use client";

import { inter, suisseIntl } from "@/lib/home/fonts";

const NOTE = {
  patient: "James Chen",
  request: "Refill · Lisinopril 10 mg",
  action: "Routed to pharmacy queue",
  status: "Pickup 4:30 PM",
  duration: "2m 15s",
} as const;

const FIELDS = [
  { id: "patient", label: "Patient", value: NOTE.patient },
  { id: "request", label: "Request", value: NOTE.request },
  { id: "action", label: "Action", value: NOTE.action },
  { id: "status", label: "Status", value: NOTE.status },
] as const;

const SYNC_STOPS = [
  { id: "call", label: "Call", state: "done" as const },
  { id: "chart", label: "Chart", state: "active" as const },
  { id: "sms", label: "SMS", state: "done" as const },
] as const;

/** Post-call chart note — structured field grid on inbox shader band. */
export function DoePhoneHomeVoiceCallSummaryVisual() {
  return (
    <div className={`home-chart-note-visual ${suisseIntl.className}`} aria-hidden>
      <div className="home-chart-note-visual__header">
        <div className="home-chart-note-visual__header-copy">
          <p className={`home-chart-note-visual__label ${inter.className}`}>After-call note</p>
          <p className="home-chart-note-visual__duration">{NOTE.duration}</p>
        </div>
        <span className={`home-chart-note-visual__badge ${inter.className}`}>In chart</span>
      </div>

      <div className="home-chart-note-visual__card">
        <dl className="home-chart-note-visual__grid">
          {FIELDS.map((field) => (
            <div key={field.id} className="home-chart-note-visual__field">
              <dt className={`home-chart-note-visual__field-label ${inter.className}`}>{field.label}</dt>
              <dd className="home-chart-note-visual__field-value">{field.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="home-chart-note-visual__sync" aria-hidden>
        <div className="home-chart-note-visual__sync-rail">
          {SYNC_STOPS.map((stop, index) => (
            <div key={stop.id} className="home-chart-note-visual__sync-item">
              {index > 0 ? <span className="home-chart-note-visual__sync-segment" /> : null}
              <span
                className={`home-chart-note-visual__sync-node home-chart-note-visual__sync-node--${stop.state}`}
              />
            </div>
          ))}
        </div>
        <div className={`home-chart-note-visual__sync-labels ${inter.className}`}>
          {SYNC_STOPS.map((stop) => (
            <span key={stop.id} className="home-chart-note-visual__sync-label">
              {stop.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
