"use client";

import { suisseIntl } from "@/lib/home/fonts";

const RX_REQUEST = {
  drug: "Lisinopril",
  strength: "10 mg",
  type: "Refill due",
  patient: "Patel",
} as const;

const PHARMACY_ROWS = [
  { label: "Sent to CVS", meta: "9:41 AM", tone: "neutral" as const },
  { label: "Coverage check", meta: "Running", tone: "warm" as const, highlight: true as const },
  { label: "Pharmacist note", meta: "Queued", tone: "accent" as const },
  { label: "Pickup window", meta: "Fri AM", tone: "neutral" as const },
] as const;

const PHARMACY_CLEAR_ROW_COUNT = 2;

function getPharmacySpread(rowIndex: number) {
  if (rowIndex < PHARMACY_CLEAR_ROW_COUNT) {
    return 0;
  }

  return rowIndex - (PHARMACY_CLEAR_ROW_COUNT - 1);
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

/** Desktop agents carousel — Refill Agent dual-card peek. */
export function HomeAgentsCarouselRefillPeek() {
  return (
    <div className="home-agents-carousel__refill-peek" aria-hidden>
      <div className={`home-agents-carousel__refill-peek-stack ${suisseIntl.className}`}>
        <div className="home-agents-carousel__refill-peek-card home-agents-carousel__refill-peek-card--request">
          <div className="home-agents-carousel__refill-peek-request">
            <span className="home-agents-carousel__refill-peek-request-drug">{RX_REQUEST.drug}</span>
            <span className="home-agents-carousel__refill-peek-request-strength">{RX_REQUEST.strength}</span>
            <span className="home-agents-carousel__refill-peek-request-type">{RX_REQUEST.type}</span>
            <span className="home-agents-carousel__refill-peek-request-patient">{RX_REQUEST.patient}</span>
          </div>
        </div>

        <div className="home-agents-carousel__refill-peek-card home-agents-carousel__refill-peek-card--pharmacy">
          <p className="home-agents-carousel__refill-peek-card-title">Pharmacy routing</p>
          <ul className="home-agents-carousel__refill-peek-list">
            {PHARMACY_ROWS.map((row, rowIndex) => {
              const spread = getPharmacySpread(rowIndex);
              const blur = getPeekFadeBlur(spread);

              return (
                <li
                  key={row.label}
                  className={`home-agents-carousel__refill-peek-row home-agents-carousel__refill-peek-row--${row.tone}${
                    "highlight" in row && row.highlight ? " home-agents-carousel__refill-peek-row--highlighted" : ""
                  }`}
                  style={{
                    opacity: getPeekFadeOpacity(spread),
                    filter: blur > 0 ? `blur(${blur}px)` : undefined,
                  }}
                >
                  <span className="home-agents-carousel__refill-peek-row-label">{row.label}</span>
                  <span className="home-agents-carousel__refill-peek-row-meta">{row.meta}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
