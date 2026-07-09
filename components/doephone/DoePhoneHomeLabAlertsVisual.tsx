"use client";

import { inter, suisseIntl } from "@/lib/home/fonts";

const ALERT = {
  patient: "Maria Lopez",
  meta: "58F · CKD stage 3",
  analyte: "Potassium",
  value: "6.1",
  unit: "mEq/L",
  prior: "4.8",
  recipient: "Dr. Chen",
  channel: "Mobile · covering",
} as const;

const NOTIFY_STAGES = [
  { id: "flag", label: "Flagged", state: "done" as const },
  { id: "call", label: "Calling", state: "active" as const },
  { id: "log", label: "Log", state: "upcoming" as const },
] as const;

function LabTrendChart() {
  return (
    <svg
      className="home-critical-lab-visual__chart"
      viewBox="0 0 120 44"
      preserveAspectRatio="none"
      aria-hidden
    >
      <line x1="0" y1="14" x2="120" y2="14" className="home-critical-lab-visual__chart-threshold" />
      <polyline
        points="8,30 28,28 48,24 68,18 88,10 108,6"
        className="home-critical-lab-visual__chart-line"
      />
      <circle cx="108" cy="6" r="3.5" className="home-critical-lab-visual__chart-dot" />
    </svg>
  );
}

/** Critical lab outbound alert — metric + trend on ambient shader band. */
export function DoePhoneHomeLabAlertsVisual() {
  return (
    <div className={`home-critical-lab-visual ${suisseIntl.className}`} aria-hidden>
      <div className="home-critical-lab-visual__header">
        <div className="home-critical-lab-visual__header-copy">
          <p className={`home-critical-lab-visual__label ${inter.className}`}>Critical result</p>
          <p className="home-critical-lab-visual__patient">{ALERT.patient}</p>
        </div>
        <span className={`home-critical-lab-visual__badge ${inter.className}`}>Outbound</span>
      </div>

      <div className="home-critical-lab-visual__metric">
        <div className="home-critical-lab-visual__metric-copy">
          <span className={`home-critical-lab-visual__analyte ${inter.className}`}>{ALERT.analyte}</span>
          <div className="home-critical-lab-visual__reading">
            <span className="home-critical-lab-visual__value">{ALERT.value}</span>
            <span className={`home-critical-lab-visual__unit ${inter.className}`}>{ALERT.unit}</span>
          </div>
          <span className={`home-critical-lab-visual__delta ${inter.className}`}>
            ↑ from {ALERT.prior} · {ALERT.meta}
          </span>
        </div>
        <LabTrendChart />
      </div>

      <div className="home-critical-lab-visual__notify" aria-hidden>
        <div className="home-critical-lab-visual__notify-rail">
          {NOTIFY_STAGES.map((stage, index) => (
            <div key={stage.id} className="home-critical-lab-visual__notify-item">
              {index > 0 ? <span className="home-critical-lab-visual__notify-segment" /> : null}
              <span
                className={`home-critical-lab-visual__notify-node home-critical-lab-visual__notify-node--${stage.state}`}
              />
            </div>
          ))}
        </div>
        <div className={`home-critical-lab-visual__notify-labels ${inter.className}`}>
          {NOTIFY_STAGES.map((stage) => (
            <span key={stage.id} className="home-critical-lab-visual__notify-label">
              {stage.label}
            </span>
          ))}
        </div>
        <p className={`home-critical-lab-visual__recipient ${inter.className}`}>
          {ALERT.recipient} · {ALERT.channel}
        </p>
      </div>
    </div>
  );
}
