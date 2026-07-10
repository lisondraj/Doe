"use client";

import { dmSans } from "@/lib/home/fonts";

const WEEK_DAYS = [
  { label: "M", date: 7 },
  { label: "T", date: 8, chip: { label: "Nguyen" } },
  { label: "W", date: 9, selected: true, chip: { label: "Brooks", time: "3:15p", booking: true } },
  { label: "T", date: 10 },
  { label: "F", date: 11, chip: { label: "Open", open: true } },
  { label: "S", date: 12 },
] as const;

const NEXT_ROW_DATES = [14, 15, 16, 17, 18, 19] as const;

const BOOKING = {
  patient: "Brooks",
  visit: "Annual",
} as const;

function PhoneIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className="home-agents-carousel__scheduling-peek-phone-icon">
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

/** Agents carousel — scheduling peek with visual calendar + phone agent thinking (left-edge bleed). */
export function HomeAgentsCarouselSchedulingPeek({ iphone = false }: { iphone?: boolean }) {
  void iphone;

  return (
    <div className="home-agents-carousel__scheduling-peek" aria-hidden>
      <div className={`home-agents-carousel__scheduling-peek-card ${dmSans.className}`}>
        <div className="home-agents-carousel__scheduling-peek-think">
          <span className="home-agents-carousel__scheduling-peek-think-phone" aria-hidden>
            <PhoneIcon />
          </span>
          <span className="home-agents-carousel__scheduling-peek-think-label">Thinking</span>
          <span className="home-agents-carousel__scheduling-peek-think-dots" aria-hidden>
            <span />
            <span />
            <span />
          </span>
        </div>

        <div className="home-agents-carousel__scheduling-peek-calendar">
          <p className="home-agents-carousel__scheduling-peek-range">Mar 7 – 12</p>

          <div className="home-agents-carousel__scheduling-peek-days">
            {WEEK_DAYS.map((day) => (
              <div
                key={`day-${day.label}-${day.date}`}
                className={`home-agents-carousel__scheduling-peek-day${
                  "selected" in day && day.selected ? " home-agents-carousel__scheduling-peek-day--selected" : ""
                }`}
              >
                <div className="home-agents-carousel__scheduling-peek-day-head">
                  <span className="home-agents-carousel__scheduling-peek-day-label">{day.label}</span>
                  <span className="home-agents-carousel__scheduling-peek-day-date">{day.date}</span>
                </div>

                {"chip" in day && day.chip ? (
                  <span
                    className={`home-agents-carousel__scheduling-peek-chip${
                      "booking" in day.chip && day.chip.booking
                        ? " home-agents-carousel__scheduling-peek-chip--booking"
                        : ""
                    }${
                      "open" in day.chip && day.chip.open ? " home-agents-carousel__scheduling-peek-chip--open" : ""
                    }`}
                  >
                    <span className="home-agents-carousel__scheduling-peek-chip-label">{day.chip.label}</span>
                    {"time" in day.chip && day.chip.time ? (
                      <span className="home-agents-carousel__scheduling-peek-chip-time">{day.chip.time}</span>
                    ) : null}
                  </span>
                ) : (
                  <span className="home-agents-carousel__scheduling-peek-chip home-agents-carousel__scheduling-peek-chip--empty" />
                )}
              </div>
            ))}
          </div>

          <div className="home-agents-carousel__scheduling-peek-next-row" aria-hidden>
            {NEXT_ROW_DATES.map((date) => (
              <span key={`next-${date}`} className="home-agents-carousel__scheduling-peek-next-date">
                {date}
              </span>
            ))}
          </div>
        </div>

        <p className="home-agents-carousel__scheduling-peek-caption">
          Booking {BOOKING.visit.toLowerCase()} · {BOOKING.patient}
        </p>
      </div>
    </div>
  );
}
