"use client";

import type { CSSProperties } from "react";
import { dmSans } from "@/lib/home/fonts";

const RX = {
  drug: "Lisinopril 10 mg",
  patient: "Sean Brown",
  pharmacy: "CVS #4821",
  callTime: "1:42",
  eta: "Ready 4:30 PM",
  progress: 68,
} as const;

const PULSE_HEIGHTS = [0.32, 0.58, 0.44, 0.72, 0.38, 0.64] as const;

function AgentPulse() {
  return (
    <div className="home-agents-carousel__refill-peek-pulse" aria-hidden>
      {PULSE_HEIGHTS.map((height, index) => (
        <span
          key={index}
          className="home-agents-carousel__refill-peek-pulse-bar"
          style={{ "--pulse-height": height } as CSSProperties}
        />
      ))}
    </div>
  );
}

/** Agents carousel — single Rx slip for Lisinopril refill with phone agent. */
export function HomeAgentsCarouselRefillPeek() {
  return (
    <div className="home-agents-carousel__refill-peek" aria-hidden>
      <div className={`home-agents-carousel__refill-peek-card ${dmSans.className}`}>
        <div className="home-agents-carousel__refill-peek-slip-head">
          <div className="home-agents-carousel__refill-peek-slip-copy">
            <p className="home-agents-carousel__refill-peek-slip-drug">{RX.drug}</p>
            <p className="home-agents-carousel__refill-peek-slip-patient">{RX.patient}</p>
          </div>
        </div>

        <div className="home-agents-carousel__refill-peek-agent">
          <div className="home-agents-carousel__refill-peek-agent-copy">
            <span className="home-agents-carousel__refill-peek-agent-label">Refill Agent</span>
            <span className="home-agents-carousel__refill-peek-agent-action">Calling {RX.pharmacy}</span>
          </div>
          <span className="home-agents-carousel__refill-peek-agent-live">
            <span className="home-agents-carousel__refill-peek-agent-live-dot" aria-hidden />
            {RX.callTime}
          </span>
        </div>

        <AgentPulse />

        <div className="home-agents-carousel__refill-peek-status">
          <div className="home-agents-carousel__refill-peek-status-row">
            <span className="home-agents-carousel__refill-peek-status-label">Refilling</span>
            <span className="home-agents-carousel__refill-peek-status-eta">{RX.eta}</span>
          </div>
          <div className="home-agents-carousel__refill-peek-status-track" aria-hidden>
            <span
              className="home-agents-carousel__refill-peek-status-fill"
              style={{ width: `${RX.progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
