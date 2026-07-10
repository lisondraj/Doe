"use client";

import type { CSSProperties } from "react";
import { dmSans } from "@/lib/home/fonts";

const RX = {
  drug: "Lisinopril 10 mg",
  supply: "30-day supply",
  patient: "Sean Brown",
  pharmacy: "CVS #4821",
  callTime: "1:42",
  eta: "Ready 4:30 PM",
  progress: 68,
} as const;

const PULSE_HEIGHTS = [0.32, 0.58, 0.44, 0.72, 0.38, 0.64] as const;

function PhoneIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className="home-agents-carousel__refill-peek-phone-icon">
      <path
        d="M6.2 4.5h7.6c.72 0 1.3.58 1.3 1.3v8.4c0 .72-.58 1.3-1.3 1.3H6.2c-.72 0-1.3-.58-1.3-1.3V5.8c0-.72.58-1.3 1.3-1.3z"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
      <path d="M8.4 14.1h3.2" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
      <circle cx="10" cy="7.1" r="0.85" fill="currentColor" />
    </svg>
  );
}

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
          <span className="home-agents-carousel__refill-peek-rx-mark">Rx</span>
          <div className="home-agents-carousel__refill-peek-slip-copy">
            <p className="home-agents-carousel__refill-peek-slip-drug">{RX.drug}</p>
            <p className="home-agents-carousel__refill-peek-slip-sub">{RX.supply}</p>
            <p className="home-agents-carousel__refill-peek-slip-patient">{RX.patient}</p>
          </div>
        </div>

        <div className="home-agents-carousel__refill-peek-agent">
          <span className="home-agents-carousel__refill-peek-agent-phone" aria-hidden>
            <PhoneIcon />
          </span>
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
