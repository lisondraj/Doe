"use client";

import { dmSans } from "@/lib/home/fonts";

const BOOKING = {
  dayLabel: "Wed",
  dayDate: "Mar 9",
  patient: "Brooks",
  visit: "Annual physical",
  time: "3:15 PM",
  callTime: "1:24",
} as const;

const DAY_SLOTS = [
  { time: "9:00 AM", label: "Nguyen" },
  { time: "11:00 AM", label: "Kowalski" },
  { time: "3:15 PM", label: "Brooks", active: true },
] as const;

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

/** Agents carousel — simple phone-agent calendar booking peek (left-edge bleed). */
export function HomeAgentsCarouselSchedulingPeek({ iphone = false }: { iphone?: boolean }) {
  void iphone;

  return (
    <div className="home-agents-carousel__scheduling-peek" aria-hidden>
      <div className={`home-agents-carousel__scheduling-peek-card ${dmSans.className}`}>
        <div className="home-agents-carousel__scheduling-peek-head">
          <p className="home-agents-carousel__scheduling-peek-title">Schedule</p>
          <div className="home-agents-carousel__scheduling-peek-agent">
            <span className="home-agents-carousel__scheduling-peek-agent-phone" aria-hidden>
              <PhoneIcon />
            </span>
            <span className="home-agents-carousel__scheduling-peek-agent-label">Agent booking</span>
            <span className="home-agents-carousel__scheduling-peek-agent-live">
              <span className="home-agents-carousel__scheduling-peek-agent-live-dot" aria-hidden />
              {BOOKING.callTime}
            </span>
          </div>
        </div>

        <div className="home-agents-carousel__scheduling-peek-day">
          <div className="home-agents-carousel__scheduling-peek-day-head">
            <span className="home-agents-carousel__scheduling-peek-day-label">{BOOKING.dayLabel}</span>
            <span className="home-agents-carousel__scheduling-peek-day-date">{BOOKING.dayDate}</span>
          </div>

          <ul className="home-agents-carousel__scheduling-peek-slots">
            {DAY_SLOTS.map((slot) => (
              <li
                key={slot.time}
                className={`home-agents-carousel__scheduling-peek-slot${
                  "active" in slot && slot.active ? " home-agents-carousel__scheduling-peek-slot--active" : ""
                }`}
              >
                <span className="home-agents-carousel__scheduling-peek-slot-time">{slot.time}</span>
                <span className="home-agents-carousel__scheduling-peek-slot-name">{slot.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="home-agents-carousel__scheduling-peek-booking">
          Booking <span className="home-agents-carousel__scheduling-peek-booking-patient">{BOOKING.patient}</span>
          {" · "}
          {BOOKING.time}
        </p>
      </div>
    </div>
  );
}
