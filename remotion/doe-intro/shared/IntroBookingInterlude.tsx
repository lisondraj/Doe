import { Easing, interpolate, useCurrentFrame } from "remotion";

import { dmSans } from "@/remotion/fonts";

import {
  DOE_SARAH_BOOKING_INTERLUDE_BEFORE_TURN,
  DOE_SARAH_CALL_INTERLUDES,
  DOE_SARAH_CONVO_REPLY_HOLD_EXTRA,
  DOE_SARAH_CONVO_START_FRAMES,
  DOE_SARAH_CONVO_TURN_START,
  DOE_SARAH_CONVO_TURN_STEP,
  DOE_SARAH_CONVO_UI_OFFSET,
  DOE_SARAH_INTRO_TURN_COUNT,
  DOE_SARAH_TURN_HOLDS_AFTER,
  DOE_SARAH_TURN_REPLY_HOLDS,
} from "../constants";
import { buildCallTurnRevealTiming, findCallInterludeWindow } from "../../motion-ui";

const CONVO_UI_OFFSET = DOE_SARAH_CONVO_START_FRAMES + DOE_SARAH_CONVO_UI_OFFSET;

const FADE_IN_END = 12;
const BOOKING_DONE = 54;
const CAL_APPEAR = 72;
const CAL_REVEAL = 24;
const REVEAL_EASE = Easing.bezier(0.33, 0, 0.18, 1);

/** July 2026 week grid — Tuesday 14 highlighted. */
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const CALENDAR_DAYS = [
  { day: 12, booked: false },
  { day: 13, booked: false },
  { day: 14, booked: true },
  { day: 15, booked: false },
  { day: 16, booked: false },
  { day: 17, booked: false },
  { day: 18, booked: false },
] as const;

function InterludeStepIcon({ state, spinDeg }: { state: "spinner" | "check"; spinDeg: number }) {
  if (state === "check") {
    return (
      <svg className="motion4-booking-interlude__icon motion4-booking-interlude__check" viewBox="0 0 12 12" fill="none" aria-hidden>
        <path
          d="M2.25 6.1 4.65 8.5 9.75 3.4"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      className="motion4-booking-interlude__spinner motion4-booking-interlude__icon"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      style={{ transform: `rotate(${spinDeg}deg)` }}
    >
      <circle cx="8" cy="8" r="6.25" stroke="rgba(242, 232, 218, 0.18)" strokeWidth="1.75" />
      <path d="M14.25 8a6.25 6.25 0 0 0-6.25-6.25" stroke="#d4a574" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

/** Booking appointment — Booking → Booked + gold/brown calendar card. */
export function IntroBookingInterlude() {
  const frame = useCurrentFrame();
  const t = frame - CONVO_UI_OFFSET;

  const timing = buildCallTurnRevealTiming(
    DOE_SARAH_INTRO_TURN_COUNT,
    DOE_SARAH_CONVO_TURN_START,
    DOE_SARAH_CONVO_TURN_STEP,
    DOE_SARAH_CONVO_REPLY_HOLD_EXTRA,
    DOE_SARAH_CALL_INTERLUDES,
    DOE_SARAH_TURN_HOLDS_AFTER,
    DOE_SARAH_TURN_REPLY_HOLDS,
  );
  const window = findCallInterludeWindow(timing, DOE_SARAH_BOOKING_INTERLUDE_BEFORE_TURN);

  if (!window || t < window.start || t >= window.end) {
    return null;
  }

  const local = t - window.start;
  const spinDeg = local * 4;
  const bookingDone = local >= BOOKING_DONE;

  const stepOpacity = interpolate(local, [0, FADE_IN_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const calProgress =
    local >= CAL_APPEAR
      ? interpolate(local, [CAL_APPEAR, CAL_APPEAR + CAL_REVEAL], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: REVEAL_EASE,
        })
      : 0;

  const calOpacity =
    local >= CAL_APPEAR
      ? interpolate(calProgress, [0, 0.3, 1], [0, 0.88, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: REVEAL_EASE,
        }) * stepOpacity
      : 0;

  const calY = interpolate(calProgress, [0, 1], [18, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: REVEAL_EASE,
  });

  const accessLabel = bookingDone ? "Booked appointment" : "Booking appointment";
  const accessIcon: "spinner" | "check" = bookingDone ? "check" : "spinner";
  const calVisible = local >= CAL_APPEAR && calOpacity > 0.01;

  return (
    <div className={`motion4-booking-interlude ${dmSans.className}`} aria-hidden>
      <div className="motion4-booking-interlude__stage">
        <div
          className={`motion4-booking-interlude__stack${
            calVisible ? " motion4-booking-interlude__stack--paired" : ""
          }`}
        >
          <div className="motion4-booking-interlude__step" style={{ opacity: stepOpacity }}>
            <span className="motion4-booking-interlude__label">{accessLabel}</span>
            <InterludeStepIcon state={accessIcon} spinDeg={spinDeg} />
          </div>

          {calVisible ? (
            <div
              className="motion4-booking-interlude__card"
              style={{
                opacity: calOpacity,
                transform: `translateY(${calY}px)`,
              }}
            >
              <div className="motion4-booking-interlude__card-head">
                <p className={`motion4-booking-interlude__card-title m-0 ${dmSans.className}`}>
                  Tuesday · 10:30 AM
                </p>
              </div>

              <div className="motion4-booking-interlude__cal">
                <div className="motion4-booking-interlude__cal-month">
                  <span className="motion4-booking-interlude__cal-month-label">July 2026</span>
                  <span className="motion4-booking-interlude__cal-month-range">Week of the 12th</span>
                </div>
                <div className="motion4-booking-interlude__cal-weekdays">
                  {WEEKDAYS.map((label) => (
                    <span key={label} className="motion4-booking-interlude__cal-weekday">
                      {label}
                    </span>
                  ))}
                </div>
                <div className="motion4-booking-interlude__cal-days">
                  {CALENDAR_DAYS.map((cell) => (
                    <div
                      key={cell.day}
                      className={`motion4-booking-interlude__cal-day${
                        cell.booked ? " motion4-booking-interlude__cal-day--booked" : ""
                      }`}
                    >
                      <span className="motion4-booking-interlude__cal-day-num">{cell.day}</span>
                      <span
                        className={`motion4-booking-interlude__cal-day-slot${
                          cell.booked ? "" : " motion4-booking-interlude__cal-day-slot--empty"
                        }`}
                      >
                        {cell.booked ? "10:30" : "\u00a0"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
