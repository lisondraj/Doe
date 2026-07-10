"use client";

import { dmSans } from "@/lib/home/fonts";

const INK = "#3D4549";

const WEEK_LABELS = ["M", "T", "W", "T", "F", "S", "S"] as const;
const WEEK_DATES = [7, 8, 9, 10, 11, 12, 13] as const;
const SELECTED_DATE = 9;

const SLOT_ROWS = [
  { time: "3:15 PM", patient: "Brooks", visit: "Physical", active: true, live: true },
  { time: "9:00 AM", patient: "Nguyen", visit: "Follow-up" },
  { time: "11:30 AM", patient: "Open slot", visit: "Friday" },
  { time: "2:00 PM", patient: "Kowalski", visit: "Labs review" },
  { time: "4:15 PM", patient: "Open slot", visit: "Same day" },
] as const;

const SLOT_CLEAR_ROW_COUNT = 3;

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

  return Math.max(0.64, 1 - spread * 0.08);
}

function getPeekFadeBlur(spread: number) {
  if (spread === 0) {
    return 0;
  }

  const eased = spread * (0.14 + spread * 0.1);
  return Math.min(0.95, eased);
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden className="home-agents-carousel__scheduling-peek-clinic-chevron">
      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className="home-agents-carousel__scheduling-peek-row-icon">
      <rect x="4.5" y="5.5" width="11" height="10" rx="1.5" stroke={INK} strokeWidth="1.35" />
      <path d="M4.5 8.5h11M7.25 4v2.25M12.75 4v2.25" stroke={INK} strokeWidth="1.35" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className="home-agents-carousel__scheduling-peek-row-icon">
      <circle cx="10" cy="10" r="5.75" stroke={INK} strokeWidth="1.35" />
      <path d="M10 7.25V10l2.1 1.35" stroke={INK} strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
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
          <p className="home-agents-carousel__scheduling-peek-week-range">Mar 7 – 13</p>
          <div className="home-agents-carousel__scheduling-peek-week-grid">
            {WEEK_LABELS.map((label, index) => {
              const date = WEEK_DATES[index];
              const selected = date === SELECTED_DATE;

              return (
                <div
                  key={`week-${label}-${date}`}
                  className={`home-agents-carousel__scheduling-peek-week-cell${
                    selected ? " home-agents-carousel__scheduling-peek-week-cell--selected" : ""
                  }`}
                >
                  <span className="home-agents-carousel__scheduling-peek-week-label">{label}</span>
                  <span className="home-agents-carousel__scheduling-peek-week-date">{date}</span>
                </div>
              );
            })}
          </div>
        </div>

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
                {"active" in row && row.active ? <CalendarIcon /> : <ClockIcon />}
                <span className="home-agents-carousel__scheduling-peek-label-block">
                  <span className="home-agents-carousel__scheduling-peek-label">
                    {row.patient}
                    <span className="home-agents-carousel__scheduling-peek-visit"> · {row.visit}</span>
                  </span>
                  <span className="home-agents-carousel__scheduling-peek-time">{row.time}</span>
                  {"live" in row && row.live ? (
                    <span className="home-agents-carousel__scheduling-peek-live">
                      <span className="home-agents-carousel__scheduling-peek-live-dot" aria-hidden />
                      On call
                    </span>
                  ) : null}
                </span>
              </li>
            );
          })}
        </ul>

        <div
          className="home-agents-carousel__scheduling-peek-footer"
          style={{
            opacity: getPeekFadeOpacity(2),
            filter: getPeekFadeBlur(2) > 0 ? `blur(${getPeekFadeBlur(2)}px)` : undefined,
          }}
        >
          <span className="home-agents-carousel__scheduling-peek-footer-stat">3 open this week</span>
        </div>
      </div>
    </div>
  );
}
