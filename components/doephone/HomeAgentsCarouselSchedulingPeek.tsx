"use client";

import { dmSans } from "@/lib/home/fonts";

type SlotBlock =
  | "fill"
  | {
      name: string;
      time: string;
      active?: boolean;
      open?: boolean;
    };

type WeekDay = {
  label: string;
  date: number;
  active?: boolean;
  slots: readonly SlotBlock[];
};

const ACTIVE_DAY_INDEX = 2;

const WEEK_DAYS: readonly WeekDay[] = [
  {
    label: "Mon",
    date: 7,
    slots: ["fill", "fill", "fill"],
  },
  {
    label: "Tue",
    date: 8,
    slots: [
      { name: "Nguyen", time: "9:00" },
      "fill",
      "fill",
    ],
  },
  {
    label: "Wed",
    date: 9,
    active: true,
    slots: [
      { name: "Kowalski", time: "11:00" },
      { name: "Brooks", time: "3:15p", active: true },
      "fill",
    ],
  },
  {
    label: "Thu",
    date: 10,
    slots: [
      { name: "Haley", time: "9:30" },
      "fill",
      { name: "Open", time: "2:15p", open: true },
    ],
  },
  {
    label: "Fri",
    date: 11,
    slots: [
      "fill",
      { name: "Patel", time: "10:15" },
      { name: "Open", time: "10:30", open: true },
    ],
  },
] as const;

const OPEN_ROWS = [
  { label: "Thu 2:15p", meta: "Open slot" },
  { label: "Fri 10:30", meta: "Open slot" },
] as const;

const WAVE_HEIGHTS = [0.38, 0.68, 0.52, 0.82, 0.46, 0.62] as const;

function getPeekFadeOpacity(spread: number) {
  if (spread === 0) {
    return 1;
  }

  return Math.max(0.58, 1 - spread * 0.1);
}

function getPeekFadeBlur(spread: number) {
  if (spread === 0) {
    return 0;
  }

  return Math.min(1.4, spread * 0.42);
}

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

function VoiceWaveform() {
  return (
    <div className="home-agents-carousel__scheduling-peek-waveform" aria-hidden>
      {WAVE_HEIGHTS.map((height, index) => (
        <span
          key={index}
          className="home-agents-carousel__scheduling-peek-waveform-bar"
          style={{ height: `${Math.round(height * 100)}%` }}
        />
      ))}
    </div>
  );
}

function SlotCell({ slot, iphone }: { slot: SlotBlock; iphone: boolean }) {
  if (slot === "fill") {
    return <span className="home-agents-carousel__scheduling-peek-slot home-agents-carousel__scheduling-peek-slot--fill" />;
  }

  const showText = !iphone || slot.active || slot.open;

  return (
    <span
      className={`home-agents-carousel__scheduling-peek-slot${
        slot.active
          ? " home-agents-carousel__scheduling-peek-slot--active"
          : slot.open
            ? " home-agents-carousel__scheduling-peek-slot--open"
            : " home-agents-carousel__scheduling-peek-slot--booked"
      }`}
    >
      {showText ? (
        <>
          <span className="home-agents-carousel__scheduling-peek-slot-name">{slot.name}</span>
          <span className="home-agents-carousel__scheduling-peek-slot-time">{slot.time}</span>
        </>
      ) : null}
    </span>
  );
}

/** Agents carousel — Scheduling Agent calendar + phone booking peek (inbox-style card). */
export function HomeAgentsCarouselSchedulingPeek({ iphone = false }: { iphone?: boolean }) {
  return (
    <div className="home-agents-carousel__scheduling-peek" aria-hidden>
      <div className={`home-agents-carousel__scheduling-peek-card ${dmSans.className}`}>
        <div
          className="home-agents-carousel__scheduling-peek-logo bg-gradient-to-br from-[#E7A944] via-[#D2774C] to-[#1E343A]"
          aria-hidden
        />

        <p className="home-agents-carousel__scheduling-peek-title">Schedule</p>

        <div className="home-agents-carousel__scheduling-peek-call">
          <span className="home-agents-carousel__scheduling-peek-phone-badge" aria-hidden>
            <PhoneIcon />
          </span>
          <VoiceWaveform />
          <div className="home-agents-carousel__scheduling-peek-call-copy">
            <p className="home-agents-carousel__scheduling-peek-call-line">Booking by phone</p>
            <p className="home-agents-carousel__scheduling-peek-call-subline">Brooks · Wed 3:15p annual</p>
          </div>
        </div>

        <div className="home-agents-carousel__scheduling-peek-calendar">
          {WEEK_DAYS.map((day, dayIndex) => {
            const daySpread = Math.abs(dayIndex - ACTIVE_DAY_INDEX);
            const blur = getPeekFadeBlur(daySpread * 0.38);

            return (
              <div
                key={`${day.label}-${day.date}`}
                className={`home-agents-carousel__scheduling-peek-day-col${
                  day.active ? " home-agents-carousel__scheduling-peek-day-col--active" : ""
                }`}
                style={{
                  opacity: getPeekFadeOpacity(daySpread * 0.28),
                  filter: !iphone && blur > 0 ? `blur(${blur}px)` : undefined,
                }}
              >
                <div className="home-agents-carousel__scheduling-peek-day-head">
                  <span className="home-agents-carousel__scheduling-peek-day-label">{day.label}</span>
                  <span className="home-agents-carousel__scheduling-peek-day-date">{day.date}</span>
                </div>
                <div className="home-agents-carousel__scheduling-peek-slots">
                  {day.slots.map((slot, slotIndex) => (
                    <SlotCell key={`${day.date}-${slotIndex}`} slot={slot} iphone={iphone} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <ul className="home-agents-carousel__scheduling-peek-open-list">
          {OPEN_ROWS.map((row, rowIndex) => {
            const spread = rowIndex + 1;
            const blur = getPeekFadeBlur(spread);

            return (
              <li
                key={row.label}
                className="home-agents-carousel__scheduling-peek-open-row"
                style={{
                  opacity: getPeekFadeOpacity(spread),
                  filter: blur > 0 ? `blur(${blur}px)` : undefined,
                }}
              >
                <span className="home-agents-carousel__scheduling-peek-open-label">{row.label}</span>
                <span className="home-agents-carousel__scheduling-peek-open-meta">{row.meta}</span>
              </li>
            );
          })}
        </ul>

        <div className="home-agents-carousel__scheduling-peek-footer">
          <span className="home-agents-carousel__scheduling-peek-footer-stat">4 booked today</span>
          <span className="home-agents-carousel__scheduling-peek-footer-pill">On call</span>
        </div>
      </div>
    </div>
  );
}
