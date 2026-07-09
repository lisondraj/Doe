"use client";

import { suisseIntl } from "@/lib/home/fonts";

const AGENDA_ROWS = [
  { time: "9:00", label: "Haley · Follow-up", kind: "booked" as const },
  { time: "10:15", label: "Patel · Annual", kind: "booked" as const },
  { time: "11:00", label: "Open slot", kind: "open" as const },
  { time: "2:30", label: "Brooks · Intake", kind: "active" as const },
  { time: "3:00", label: "Open slot", kind: "open" as const },
  { time: "4:45", label: "Lam · Labs", kind: "booked" as const },
] as const;

/** Agents carousel — Scheduling Agent day agenda peek. */
export function HomeAgentsCarouselSchedulingPeek() {
  return (
    <div className="home-agents-carousel__scheduling-peek" aria-hidden>
      <div className={`home-agents-carousel__scheduling-peek-card ${suisseIntl.className}`}>
        <div className="home-agents-carousel__scheduling-peek-header">
          <div className="home-agents-carousel__scheduling-peek-provider">
            <span className="home-agents-carousel__scheduling-peek-heading">Dr. Chen</span>
            <span className="home-agents-carousel__scheduling-peek-subheading">Thu · Apr 10</span>
          </div>
          <span className="home-agents-carousel__scheduling-peek-open-slots">4 open</span>
        </div>

        <ul className="home-agents-carousel__scheduling-peek-agenda">
          {AGENDA_ROWS.map((row) => (
            <li
              key={`${row.time}-${row.label}`}
              className={`home-agents-carousel__scheduling-peek-row home-agents-carousel__scheduling-peek-row--${row.kind}`}
            >
              <span className="home-agents-carousel__scheduling-peek-time">{row.time}</span>
              <span className="home-agents-carousel__scheduling-peek-slot">{row.label}</span>
              {row.kind === "active" ? (
                <span className="home-agents-carousel__scheduling-peek-status">Confirming</span>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
