"use client";

import { suisseIntl } from "@/lib/home/fonts";

const INK = "#3D4549";

const BLOODWORK_ROWS = [
  { label: "Hemoglobin", value: "11.2 g/dL", abnormal: true, bar: 0.42 },
  { label: "WBC", value: "6.4 K/uL", bar: 0.58 },
  { label: "Platelets", value: "245 K/uL", bar: 0.72 },
  { label: "Glucose", value: "98 mg/dL", bar: 0.51 },
] as const;

const ROUTING_ROWS = [
  { label: "Call answered", detail: "Dynacare Labs", status: "done" as const },
  { label: "Found patient's chart", status: "done" as const },
  { label: "Moving info to chart", status: "loading" as const, active: true },
] as const;

const LABS_ROUTING_FOCUS_INDEX = 2;

function getLabsRowSpread(rowIndex: number, focusIndex: number, isActive = false) {
  if (isActive) {
    return 0;
  }

  return Math.abs(rowIndex - focusIndex);
}

function getRoutingFadeOpacity(spread: number) {
  return Math.max(0.36, 1 - spread * 0.15);
}

function getRoutingFadeBlur(spread: number) {
  return Math.min(2.5, spread * 0.88);
}

function AbnormalDownArrow() {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden className="home-agents-carousel__labs-peek-down-arrow">
      <path
        d="M6 2.75v5.5M6 8.25L3.35 5.6M6 8.25l2.65-2.65"
        stroke="#D2774C"
        strokeWidth="1.45"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RoutingStatusIcon({ status }: { status: (typeof ROUTING_ROWS)[number]["status"] }) {
  if (status === "done") {
    return (
      <svg viewBox="0 0 16 16" fill="none" aria-hidden className="home-agents-carousel__labs-peek-status-icon">
        <path
          d="M4.25 8.1l2.5 2.5 5.1-5.3"
          stroke={INK}
          strokeWidth="1.45"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="home-agents-carousel__labs-peek-status-icon home-agents-carousel__labs-peek-status-icon--loading">
      <circle cx="8" cy="8" r="5.75" stroke="rgba(61, 69, 73, 0.14)" strokeWidth="1.35" />
      <path
        d="M8 2.25a5.75 5.75 0 015.75 5.75"
        stroke="#D2774C"
        strokeWidth="1.45"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Desktop agents carousel — Labs Agent dual UI peek (centered, top/bottom clip). */
export function HomeAgentsCarouselLabsPeek() {
  return (
    <div className="home-agents-carousel__labs-peek" aria-hidden>
      <div className={`home-agents-carousel__labs-peek-stack ${suisseIntl.className}`}>
        <div className="home-agents-carousel__labs-peek-card home-agents-carousel__labs-peek-card--results">
          <div className="home-agents-carousel__labs-peek-header home-agents-carousel__labs-peek-header--results">
            <div className="home-agents-carousel__labs-peek-heading">
              <p className="home-agents-carousel__labs-peek-title">Lab Results</p>
              <p className="home-agents-carousel__labs-peek-subtitle">Michael Chen</p>
            </div>
          </div>

          <ul className="home-agents-carousel__labs-peek-list">
            {BLOODWORK_ROWS.map((row) => (
              <li
                key={row.label}
                className={`home-agents-carousel__labs-peek-row${
                  "abnormal" in row && row.abnormal ? " home-agents-carousel__labs-peek-row--flagged" : ""
                }`}
              >
                <span className="home-agents-carousel__labs-peek-label-block">
                  <span className="home-agents-carousel__labs-peek-label">{row.label}</span>
                  <span className="home-agents-carousel__labs-peek-value">{row.value}</span>
                </span>
                <span className="home-agents-carousel__labs-peek-meter" aria-hidden>
                  <span className="home-agents-carousel__labs-peek-down-arrow-slot">
                    {"abnormal" in row && row.abnormal ? <AbnormalDownArrow /> : null}
                  </span>
                  <span className="home-agents-carousel__labs-peek-bar">
                    <span
                      className="home-agents-carousel__labs-peek-bar-fill"
                      style={{ width: `${Math.round(row.bar * 100)}%` }}
                    />
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="home-agents-carousel__labs-peek-card home-agents-carousel__labs-peek-card--routing">
          <ul className="home-agents-carousel__labs-peek-list">
            {ROUTING_ROWS.map((row, rowIndex) => {
              const spread = getLabsRowSpread(rowIndex, LABS_ROUTING_FOCUS_INDEX, row.active);
              const blur = getRoutingFadeBlur(spread);

              return (
              <li
                key={row.label}
                className={`home-agents-carousel__labs-peek-row home-agents-carousel__labs-peek-row--routing${
                  row.active ? " home-agents-carousel__labs-peek-row--active" : ""
                }`}
                style={{
                  opacity: getRoutingFadeOpacity(spread),
                  filter: blur > 0 ? `blur(${blur}px)` : undefined,
                }}
              >
                <RoutingStatusIcon status={row.status} />
                <span className="home-agents-carousel__labs-peek-label-block">
                  <span className="home-agents-carousel__labs-peek-label">{row.label}</span>
                  {"detail" in row && row.detail ? (
                    <span className="home-agents-carousel__labs-peek-detail">{row.detail}</span>
                  ) : null}
                </span>
              </li>
              );
            })}
          </ul>
          <div className="home-agents-carousel__labs-peek-edge-blur" aria-hidden />
        </div>
      </div>
    </div>
  );
}
