"use client";

import { suisseIntl } from "@/lib/home/fonts";

const INTAKE_ROWS = [
  { label: "Reason for visit", value: "Chest tightness", tone: "accent" as const, highlight: true as const },
  { label: "Insurance", value: "Verified", tone: "neutral" as const },
  { label: "Pharmacy", value: "On file", tone: "warm" as const },
  { label: "Allergies", value: "None reported", tone: "neutral" as const },
  { label: "Preferred slot", value: "Thu 2:30p", tone: "warm" as const },
  { label: "Callback", value: "Mobile", tone: "neutral" as const },
] as const;

const LIVE_CLEAR_ROW_COUNT = 2;

function getLiveRowSpread(rowIndex: number) {
  if (rowIndex < LIVE_CLEAR_ROW_COUNT) {
    return 0;
  }

  return rowIndex - (LIVE_CLEAR_ROW_COUNT - 1);
}

function getPeekFadeOpacity(spread: number) {
  if (spread === 0) {
    return 1;
  }

  return Math.max(0.55, 1 - spread * 0.1);
}

function getPeekFadeBlur(spread: number) {
  if (spread === 0) {
    return 0;
  }

  return Math.min(1.3, spread * 0.4);
}

/** Desktop agents carousel — Live Appointment call intake peek. */
export function HomeAgentsCarouselLivePeek() {
  return (
    <div className="home-agents-carousel__live-peek" aria-hidden>
      <div className={`home-agents-carousel__live-peek-card ${suisseIntl.className}`}>
        <div className="home-agents-carousel__live-peek-status">
          <span className="home-agents-carousel__live-peek-live-dot" aria-hidden />
          <span className="home-agents-carousel__live-peek-status-label">On call</span>
          <span className="home-agents-carousel__live-peek-status-time">04:12</span>
        </div>

        <div className="home-agents-carousel__live-peek-patient">
          <span className="home-agents-carousel__live-peek-patient-name">Nguyen, S.</span>
          <span className="home-agents-carousel__live-peek-patient-type">New patient intake</span>
        </div>

        <ul className="home-agents-carousel__live-peek-list">
          {INTAKE_ROWS.map((row, rowIndex) => {
            const spread = getLiveRowSpread(rowIndex);
            const blur = getPeekFadeBlur(spread);

            return (
              <li
                key={row.label}
                className={`home-agents-carousel__live-peek-row home-agents-carousel__live-peek-row--${row.tone}${
                  "highlight" in row && row.highlight ? " home-agents-carousel__live-peek-row--highlighted" : ""
                }`}
                style={{
                  opacity: getPeekFadeOpacity(spread),
                  filter: blur > 0 ? `blur(${blur}px)` : undefined,
                }}
              >
                <span className="home-agents-carousel__live-peek-row-label">{row.label}</span>
                <span className="home-agents-carousel__live-peek-row-value">{row.value}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
