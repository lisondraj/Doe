"use client";

import type { CSSProperties } from "react";
import { dmSans } from "@/lib/home/fonts";

const ORDER = {
  drug: "Lisinopril 10 mg",
  patient: "Sean Brown",
  callMinutes: 1,
  callSeconds: 42,
  pharmacy: "CVS #4821",
  eta: "Ready 4:30 PM",
} as const;

const PIPELINE_STEPS = [
  { id: "verify", label: "Verified", status: "done" as const },
  { id: "coverage", label: "Coverage", status: "active" as const },
  { id: "pharmacy", label: "Pharmacy", status: "upcoming" as const },
  { id: "sent", label: "Sent", status: "upcoming" as const },
] as const;

const DETAILS = [
  { label: "Patient", value: ORDER.patient },
  { label: "Pharmacy", value: ORDER.pharmacy },
  { label: "Status", value: ORDER.eta },
] as const;

const CAPTION = "Need my blood pressure refill called in.";

const SPEAKING_PEAKS = [0.48, 0.82, 0.4, 0.92, 0.56, 0.88, 0.44, 0.74, 0.52] as const;
const LISTENING_LEVELS = [0.16, 0.22, 0.14, 0.2, 0.15, 0.18, 0.13] as const;

function LevelMeter({
  levels,
  variant,
}: {
  levels?: readonly number[];
  variant: "speaking" | "listening";
}) {
  if (variant === "speaking") {
    return (
      <div className="home-agents-carousel__refill-peek-meter home-agents-carousel__refill-peek-meter--speaking" aria-hidden>
        {SPEAKING_PEAKS.map((peak, index) => (
          <span
            key={index}
            className="home-agents-carousel__refill-peek-meter-bar"
            style={
              {
                "--meter-min": Math.max(0.16, peak * 0.28),
                "--meter-mid": peak * 0.68,
                "--meter-max": peak,
                "--meter-delay": `${index * 0.1}s`,
                "--meter-duration": `${0.68 + (index % 3) * 0.14}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>
    );
  }

  return (
    <div className="home-agents-carousel__refill-peek-meter home-agents-carousel__refill-peek-meter--listening" aria-hidden>
      {(levels ?? LISTENING_LEVELS).map((level, index) => (
        <span
          key={index}
          className="home-agents-carousel__refill-peek-meter-bar"
          style={{ "--meter-height": level } as CSSProperties}
        />
      ))}
    </div>
  );
}

function CallBridge() {
  return (
    <div className="home-agents-carousel__refill-peek-bridge">
      <div className="home-agents-carousel__refill-peek-bridge-parties">
        <div className="home-agents-carousel__refill-peek-bridge-party home-agents-carousel__refill-peek-bridge-party--speaking">
          <span className="home-agents-carousel__refill-peek-bridge-party-label">Refill Agent</span>
          <LevelMeter variant="speaking" />
          <span className="home-agents-carousel__refill-peek-bridge-party-state">Speaking</span>
        </div>

        <span className="home-agents-carousel__refill-peek-bridge-link" aria-hidden />

        <div className="home-agents-carousel__refill-peek-bridge-party home-agents-carousel__refill-peek-bridge-party--listening">
          <span className="home-agents-carousel__refill-peek-bridge-party-label">{ORDER.patient}</span>
          <LevelMeter levels={LISTENING_LEVELS} variant="listening" />
          <span className="home-agents-carousel__refill-peek-bridge-party-state">Listening</span>
        </div>
      </div>

      <p className="home-agents-carousel__refill-peek-bridge-caption">&ldquo;{CAPTION}&rdquo;</p>
    </div>
  );
}

const PIPELINE_ACTIVE_INDEX = PIPELINE_STEPS.findIndex((step) => step.status === "active");
const PIPELINE_FILL_PERCENT =
  PIPELINE_ACTIVE_INDEX <= 0
    ? 0
    : (PIPELINE_ACTIVE_INDEX / (PIPELINE_STEPS.length - 1)) * 100;

/** Agents carousel — Refill Agent voice board peek (matches prior auth / outreach mocks). */
export function HomeAgentsCarouselRefillPeek() {
  return (
    <div className="home-agents-carousel__refill-peek" aria-hidden>
      <div className={`home-agents-carousel__refill-peek-card ${dmSans.className}`}>
        <header className="home-agents-carousel__refill-peek-header">
          <div className="home-agents-carousel__refill-peek-header-copy">
            <h3 className="home-agents-carousel__refill-peek-title">{ORDER.drug}</h3>
            <p className="home-agents-carousel__refill-peek-meta">{ORDER.patient}</p>
          </div>
          <span className="home-agents-carousel__refill-peek-call-timer">
            {ORDER.callMinutes}
            <span className="home-agents-carousel__refill-peek-call-timer-unit">m</span> {ORDER.callSeconds}
            <span className="home-agents-carousel__refill-peek-call-timer-unit">s</span>
          </span>
        </header>

        <div className="home-agents-carousel__refill-peek-panel">
          <CallBridge />

          <dl className="home-agents-carousel__refill-peek-details">
            {DETAILS.map((item) => (
              <div key={item.label} className="home-agents-carousel__refill-peek-detail-row">
                <dt className="home-agents-carousel__refill-peek-detail-label">{item.label}</dt>
                <dd className="home-agents-carousel__refill-peek-detail-value">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="home-agents-carousel__refill-peek-pipeline" aria-hidden>
          <div className="home-agents-carousel__refill-peek-pipeline-rail">
            <span
              className="home-agents-carousel__refill-peek-pipeline-fill"
              style={{ width: `${PIPELINE_FILL_PERCENT}%` }}
            />
          </div>
          <div className="home-agents-carousel__refill-peek-pipeline-labels">
            {PIPELINE_STEPS.map((step) => (
              <span
                key={step.id}
                className={`home-agents-carousel__refill-peek-pipeline-label${
                  step.status === "active" ? " home-agents-carousel__refill-peek-pipeline-label--active" : ""
                }`}
              >
                {step.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
