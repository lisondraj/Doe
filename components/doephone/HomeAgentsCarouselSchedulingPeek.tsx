"use client";

import { dmSans } from "@/lib/home/fonts";

const WEEK_DAYS = [
  { label: "M", date: 7 },
  { label: "T", date: 8 },
  { label: "W", date: 9, selected: true },
  { label: "T", date: 10 },
  { label: "F", date: 11 },
  { label: "S", date: 12 },
] as const;

const SLOT_ROWS = [
  { time: "3:15 PM", patient: "Brooks", visit: "Physical", active: true },
  { time: "9:00 AM", patient: "Nguyen", visit: "Follow-up" },
  { time: "11:30 AM", patient: "Open slot", visit: "Friday" },
  { time: "2:00 PM", patient: "Kowalski", visit: "Labs review" },
] as const;

const SLOT_CLEAR_ROW_COUNT = 1;

function getSlotRowSpread(rowIndex: number) {
  if (rowIndex < SLOT_CLEAR_ROW_COUNT) {
    return 0;
  }

  return rowIndex - (SLOT_CLEAR_ROW_COUNT - 1);
}

function getPeekFadeOpacity(spread: number) {
  if (spread === 0) {
    return 1;
  }

  return Math.max(0.7, 1 - spread * 0.06);
}

function getPeekFadeBlur(spread: number) {
  if (spread === 0) {
    return 0;
  }

  const eased = spread * (0.22 + spread * 0.06);
  return Math.min(0.72, eased);
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden className="home-agents-carousel__scheduling-peek-clinic-chevron">
      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Agents carousel — scheduling peek styled like inbox (left-edge bleed, scaled + clipped). */
export function HomeAgentsCarouselSchedulingPeek({ iphone = false }: { iphone?: boolean }) {
  void iphone;

  return (
    <div className="home-agents-carousel__scheduling-peek" aria-hidden>
      <div className={`home-agents-carousel__scheduling-peek-card ${dmSans.className}`}>
        <div className="home-agents-carousel__scheduling-peek-head">
          <div className="home-agents-carousel__scheduling-peek-head-right">
            <button type="button" className="home-agents-carousel__scheduling-peek-clinic" tabIndex={-1}>
              <span className="home-agents-carousel__scheduling-peek-clinic-label">Dr. Brown&apos;s Clinic</span>
              <ChevronIcon />
            </button>

            <div
              className="home-agents-carousel__scheduling-peek-logo bg-gradient-to-br from-[#E7A944] via-[#D2774C] to-[#1E343A]"
              aria-hidden
            />
          </div>
        </div>

        <p className="home-agents-carousel__scheduling-peek-title">Schedule</p>

        <div className="home-agents-carousel__scheduling-peek-week" aria-hidden>
          <p className="home-agents-carousel__scheduling-peek-week-range">Mar 7 – 12</p>

          <div className="home-agents-carousel__scheduling-peek-days">
            {WEEK_DAYS.map((day) => (
              <div
                key={`${day.label}-${day.date}`}
                className={`home-agents-carousel__scheduling-peek-day${
                  "selected" in day && day.selected ? " home-agents-carousel__scheduling-peek-day--selected" : ""
                }`}
              >
                <span className="home-agents-carousel__scheduling-peek-day-label">{day.label}</span>
                <span className="home-agents-carousel__scheduling-peek-day-date">{day.date}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="home-agents-carousel__scheduling-peek-status" aria-hidden>
          <span className="home-agents-carousel__scheduling-peek-status-title">Calling to confirm…</span>
          <span className="home-agents-carousel__scheduling-peek-status-meta">Brooks · Physical · 3:15 PM</span>
          <span className="home-agents-carousel__scheduling-peek-status-timer">1:24</span>
        </div>

        <div className="home-agents-carousel__scheduling-peek-fade">
          <ul className="home-agents-carousel__scheduling-peek-list">
            {SLOT_ROWS.map((row, rowIndex) => {
              const spread = getSlotRowSpread(rowIndex);
              const blur = getPeekFadeBlur(spread);

              return (
                <li
                  key={`${row.time}-${row.patient}`}
                  className={`home-agents-carousel__scheduling-peek-row${
                    "active" in row && row.active ? " home-agents-carousel__scheduling-peek-row--active" : ""
                  }`}
                  style={{
                    opacity: getPeekFadeOpacity(spread),
                    filter: blur > 0 ? `blur(${blur}px)` : undefined,
                  }}
                >
                  <span className="home-agents-carousel__scheduling-peek-label">
                    {row.patient}
                    <span className="home-agents-carousel__scheduling-peek-visit"> · {row.visit}</span>
                  </span>
                  <span className="home-agents-carousel__scheduling-peek-time">{row.time}</span>
                </li>
              );
            })}
          </ul>

          <div
            className="home-agents-carousel__scheduling-peek-footer"
            style={{
              opacity: getPeekFadeOpacity(3),
              filter: getPeekFadeBlur(3) > 0 ? `blur(${getPeekFadeBlur(3)}px)` : undefined,
            }}
          >
            <span className="home-agents-carousel__scheduling-peek-footer-stat">3 open this week</span>
          </div>
        </div>
      </div>
    </div>
  );
}
