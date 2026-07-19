"use client";

import type { CSSProperties } from "react";
import { dmSans } from "@/lib/home/fonts";

const ORDER = {
  procedure: "MRI Lumbar",
  patient: "Jackson Brooks",
  payer: "UHC",
  callMinutes: 2,
  callSeconds: 14,
} as const;

const PIPELINE_STEPS = [
  { id: "chart", label: "Chart", status: "done" as const },
  { id: "call", label: "Call payer", status: "active" as const },
  { id: "approved", label: "Approved", status: "upcoming" as const },
  { id: "filed", label: "Filed", status: "upcoming" as const },
] as const;

const DETAILS = [
  { label: "Auth ref", value: "Pending" },
  { label: "Valid", value: "90 days" },
  { label: "Payer", value: "UHC Prior Auth" },
] as const;

const SPEAKING_PEAKS = [0.52, 0.84, 0.44, 0.96, 0.62, 0.9, 0.48, 0.78, 0.58] as const;
const LISTENING_LEVELS = [0.18, 0.24, 0.16, 0.22, 0.14, 0.2, 0.17] as const;

function LevelMeter({
  levels,
  variant,
}: {
  levels?: readonly number[];
  variant: "speaking" | "listening";
}) {
  if (variant === "speaking") {
    return (
      <div className="home-prior-auth-visual__meter home-prior-auth-visual__meter--speaking" aria-hidden>
        {SPEAKING_PEAKS.map((peak, index) => (
          <span
            key={index}
            className="home-prior-auth-visual__meter-bar"
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
    <div className="home-prior-auth-visual__meter home-prior-auth-visual__meter--listening" aria-hidden>
      {(levels ?? LISTENING_LEVELS).map((level, index) => (
        <span
          key={index}
          className="home-prior-auth-visual__meter-bar"
          style={
            {
              "--meter-height": level,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

function CallBridge() {
  return (
    <div className="home-prior-auth-visual__bridge">
      <div className="home-prior-auth-visual__bridge-parties">
        <div className="home-prior-auth-visual__bridge-party home-prior-auth-visual__bridge-party--speaking">
          <span className="home-prior-auth-visual__bridge-party-label">Prior Auth Agent</span>
          <LevelMeter variant="speaking" />
          <span className="home-prior-auth-visual__bridge-party-state">Speaking</span>
        </div>

        <span className="home-prior-auth-visual__bridge-link" aria-hidden />

        <div className="home-prior-auth-visual__bridge-party home-prior-auth-visual__bridge-party--listening">
          <span className="home-prior-auth-visual__bridge-party-label">{ORDER.payer} rep</span>
          <LevelMeter levels={LISTENING_LEVELS} variant="listening" />
          <span className="home-prior-auth-visual__bridge-party-state">Listening</span>
        </div>
      </div>

      <div className="home-prior-auth-visual__bridge-meta">
        <span className="home-prior-auth-visual__bridge-meta-title">{ORDER.procedure}</span>
        <span className="home-prior-auth-visual__bridge-meta-timer">
          {ORDER.callMinutes}
          <span className="home-prior-auth-visual__call-timer-unit">m</span> {ORDER.callSeconds}
          <span className="home-prior-auth-visual__call-timer-unit">s</span>
        </span>
      </div>
    </div>
  );
}

const PIPELINE_ACTIVE_INDEX = PIPELINE_STEPS.findIndex((step) => step.status === "active");
const PIPELINE_FILL_PERCENT =
  PIPELINE_ACTIVE_INDEX <= 0
    ? 0
    : (PIPELINE_ACTIVE_INDEX / (PIPELINE_STEPS.length - 1)) * 100;

/** Prior auth workflow board with live call-bridge voice monitor. */
export function DoePhoneHomePriorAuthVisual() {
  return (
    <div className="home-prior-auth-visual-shell">
      <div className="home-prior-auth-visual__body">
        <div className="home-prior-auth-visual__stage">
          <div className="home-prior-auth-scale">
            <div className={`home-prior-auth-visual ${dmSans.className}`} aria-hidden>
              <header className="home-prior-auth-visual__header">
                <div className="home-prior-auth-visual__header-copy">
                  <p className="home-prior-auth-visual__meta">{ORDER.patient}</p>
                </div>
              </header>

              <div className="home-prior-auth-visual__panel">
                <CallBridge />

                <dl className="home-prior-auth-visual__details">
                  {DETAILS.map((item) => (
                    <div key={item.label} className="home-prior-auth-visual__detail-row">
                      <dt className="home-prior-auth-visual__detail-label">{item.label}</dt>
                      <dd className="home-prior-auth-visual__detail-value">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="home-prior-auth-visual__pipeline" aria-hidden>
                <div className="home-prior-auth-visual__pipeline-rail">
                  <span
                    className="home-prior-auth-visual__pipeline-fill"
                    style={{ width: `${PIPELINE_FILL_PERCENT}%` }}
                  />
                </div>
                <div className="home-prior-auth-visual__pipeline-labels">
                  {PIPELINE_STEPS.map((step) => (
                    <span
                      key={step.id}
                      className={`home-prior-auth-visual__pipeline-label${
                        step.status === "active" ? " home-prior-auth-visual__pipeline-label--active" : ""
                      }`}
                    >
                      {step.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
