"use client";

import { inter, suisseIntl } from "@/lib/home/fonts";

const CALL = {
  patient: "Brooks, J.",
  visit: "Follow-up",
  provider: "Dr. Chen",
  quoteLine1: "Wednesday at three",
  quoteLine2: "works for me",
  confirmed: "Wed 3:15p",
} as const;

const SLOTS = [
  { id: "tue", day: "Tue", time: "2:30p", status: "passed" as const },
  { id: "wed", day: "Wed", time: "3:15p", status: "selected" as const },
  { id: "thu", day: "Thu", time: "9:00a", status: "alt" as const },
] as const;

function PhoneIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="home-agents-carousel__scheduling-peek-phone-icon h-[0.9em] w-[0.9em] shrink-0">
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

function SlotMark({ status }: { status: (typeof SLOTS)[number]["status"] }) {
  if (status === "selected") {
    return (
      <span className="home-agents-carousel__scheduling-peek-slot-mark home-agents-carousel__scheduling-peek-slot-mark--selected" aria-hidden>
        ✓
      </span>
    );
  }

  if (status === "passed") {
    return <span className="home-agents-carousel__scheduling-peek-slot-mark home-agents-carousel__scheduling-peek-slot-mark--passed" aria-hidden />;
  }

  return <span className="home-agents-carousel__scheduling-peek-slot-mark home-agents-carousel__scheduling-peek-slot-mark--alt" aria-hidden />;
}

/** Agents carousel — Scheduling Agent live call peek (content on shader, no outer card). */
export function HomeAgentsCarouselSchedulingPeek({ iphone = false }: { iphone?: boolean }) {
  const visibleSlots = iphone ? SLOTS.filter((slot) => slot.status === "selected") : SLOTS;

  return (
    <div className="home-agents-carousel__scheduling-peek" aria-hidden>
      <div className={`home-agents-carousel__scheduling-peek-surface ${suisseIntl.className}`}>
        <div className="home-agents-carousel__scheduling-peek-agent">
          <div className="home-agents-carousel__scheduling-peek-agent-row">
            <span className="home-agents-carousel__scheduling-peek-phone-badge" aria-hidden>
              <PhoneIcon />
            </span>
            <span className="home-agents-carousel__scheduling-peek-heading">Scheduling Agent</span>
            <span className={`home-agents-carousel__scheduling-peek-live ${inter.className}`}>2:18</span>
          </div>
          <span className={`home-agents-carousel__scheduling-peek-subheading ${inter.className}`}>
            {CALL.patient} · {CALL.visit}
          </span>
        </div>

        <div className={`home-agents-carousel__scheduling-peek-call ${inter.className}`}>
          <div className="home-agents-carousel__scheduling-peek-waveform" aria-hidden>
            {Array.from({ length: 10 }, (_, index) => (
              <span
                key={index}
                className="home-agents-carousel__scheduling-peek-waveform-bar"
                style={{ height: `${30 + ((index * 19) % 48)}%` }}
              />
            ))}
          </div>
          <p className="home-agents-carousel__scheduling-peek-quote">
            <span className="home-agents-carousel__scheduling-peek-quote-line">&ldquo;{CALL.quoteLine1}</span>
            <span className="home-agents-carousel__scheduling-peek-quote-line">{CALL.quoteLine2}&rdquo;</span>
          </p>
        </div>

        <div className="home-agents-carousel__scheduling-peek-slots" aria-hidden>
          {visibleSlots.map((slot) => (
            <div
              key={slot.id}
              className={`home-agents-carousel__scheduling-peek-slot home-agents-carousel__scheduling-peek-slot--${slot.status}`}
            >
              <SlotMark status={slot.status} />
              <span className={`home-agents-carousel__scheduling-peek-slot-day ${inter.className}`}>{slot.day}</span>
              <span className={`home-agents-carousel__scheduling-peek-slot-time ${inter.className}`}>{slot.time}</span>
              {slot.status === "selected" ? (
                <span className={`home-agents-carousel__scheduling-peek-slot-tag ${inter.className}`}>Selected</span>
              ) : null}
            </div>
          ))}
        </div>

        <div className={`home-agents-carousel__scheduling-peek-footer ${inter.className}`}>
          <span className="home-agents-carousel__scheduling-peek-footer-provider">{CALL.provider}</span>
          <span className="home-agents-carousel__scheduling-peek-footer-confirmed">{CALL.confirmed}</span>
        </div>
      </div>
    </div>
  );
}
