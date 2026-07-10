"use client";

import { dmSans } from "@/lib/home/fonts";

const WEEK_DAYS = [
  { label: "M", date: 7 },
  { label: "T", date: 8 },
  { label: "W", date: 9, active: true },
  { label: "T", date: 10 },
  { label: "F", date: 11 },
  { label: "S", date: 12 },
] as const;

const BOOKING = {
  patient: "Brooks",
  time: "3:15p",
  visit: "Annual",
} as const;

function PhoneIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="home-agents-carousel__scheduling-peek-phone-icon">
      <path
        d="M4 6.5a4 4 0 018 0v2.2l1.4 1.1H2.6L4 8.7V6.5z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <path d="M6.5 12.2h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
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

        <p className="home-agents-carousel__scheduling-peek-month">March</p>

        <div className="home-agents-carousel__scheduling-peek-calendar">
          <div className="home-agents-carousel__scheduling-peek-week-head">
            {WEEK_DAYS.map((day) => (
              <span
                key={`head-${day.label}-${day.date}`}
                className={`home-agents-carousel__scheduling-peek-week-day${
                  "active" in day && day.active ? " home-agents-carousel__scheduling-peek-week-day--active" : ""
                }`}
              >
                <span className="home-agents-carousel__scheduling-peek-week-label">{day.label}</span>
                <span className="home-agents-carousel__scheduling-peek-week-date">{day.date}</span>
              </span>
            ))}
          </div>

          <div className="home-agents-carousel__scheduling-peek-week-body">
            <span className="home-agents-carousel__scheduling-peek-appt home-agents-carousel__scheduling-peek-appt--tue">
              Nguyen
            </span>
            <span className="home-agents-carousel__scheduling-peek-appt home-agents-carousel__scheduling-peek-appt--wed home-agents-carousel__scheduling-peek-appt--booking">
              {BOOKING.patient}
              <span className="home-agents-carousel__scheduling-peek-appt-time">{BOOKING.time}</span>
            </span>
            <span className="home-agents-carousel__scheduling-peek-appt home-agents-carousel__scheduling-peek-appt--fri">
              Open
            </span>
          </div>
        </div>

        <p className="home-agents-carousel__scheduling-peek-caption">
          Booking {BOOKING.visit.toLowerCase()} · {BOOKING.patient}
        </p>
      </div>
    </div>
  );
}
