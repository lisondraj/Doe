"use client";

import { inter, suisseIntl } from "@/lib/home/fonts";

const WEEK_DAYS = [
  {
    label: "Mon",
    date: 7,
    appts: [
      { name: "Chen", type: "labs", meta: "8:30", tone: "neutral" as const },
      { name: "Okafor", type: "follow-up", meta: "10:00", tone: "warm" as const },
      { name: "Walsh", type: "consult", meta: "1:30p", tone: "accent" as const },
    ],
  },
  {
    label: "Tue",
    date: 8,
    appts: [
      { name: "Nguyen", type: "follow-up", meta: "9:00", tone: "accent" as const },
      { name: "Peters", type: "intake", meta: "11:30", tone: "warm" as const },
      { name: "Cho", type: "telehealth", meta: "3:00", tone: "neutral" as const },
      { name: "Fischer", type: "consult", meta: "3:45p", tone: "warm" as const },
      { name: "Grant", type: "labs", meta: "4:30p", tone: "accent" as const },
    ],
  },
  {
    label: "Wed",
    date: 9,
    appts: [
      { name: "Kowalski", type: "consult", meta: "11:00", tone: "warm" as const },
      { name: "Brooks", type: "intake", meta: "3:15p", tone: "neutral" as const, highlight: true as const },
      { name: "Rivera", type: "annual", meta: "4:45p", tone: "neutral" as const },
      { name: "Sato", type: "follow-up", meta: "5:15p", tone: "warm" as const },
      { name: "Webb", type: "intake", meta: "5:45p", tone: "accent" as const },
    ],
  },
  {
    label: "Thu",
    date: 10,
    appts: [
      { name: "Haley", type: "follow-up", meta: "9:30", tone: "warm" as const },
      { name: "Martinez", type: "intake", meta: "2:30p", tone: "accent" as const },
      { name: "Shah", type: "telehealth", meta: "4:00", tone: "neutral" as const },
      { name: "Lam", type: "labs", meta: "4:45p", tone: "accent" as const },
    ],
  },
  {
    label: "Fri",
    date: 11,
    appts: [
      { name: "Patel", type: "annual", meta: "10:15", tone: "warm" as const },
      { name: "Simmons", type: "consult", meta: "12:00", tone: "accent" as const },
      { name: "Yu", type: "follow-up", meta: "2:00p", tone: "neutral" as const },
    ],
  },
] as const;

const BROOKS_DAY_INDEX = 2;
const BROOKS_APPT_INDEX = 1;

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

function formatApptType(type: string) {
  return type
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("-");
}

function getApptSpread(dayIndex: number, apptIndex: number, isHighlighted: boolean) {
  if (isHighlighted) {
    return 0;
  }

  const columnDistance = Math.abs(dayIndex - BROOKS_DAY_INDEX);
  const verticalDistance =
    dayIndex === BROOKS_DAY_INDEX ? Math.abs(apptIndex - BROOKS_APPT_INDEX) : 0;

  return columnDistance + verticalDistance * 0.4;
}

function getApptOpacity(spread: number) {
  const eased = Math.pow(spread, 0.72);
  return Math.max(0.54, 1 - eased * 0.1);
}

function getApptBlur(spread: number) {
  const eased = Math.pow(spread, 0.78);
  return Math.min(0.95, eased * 0.42);
}

/** Agents carousel — Scheduling Agent week calendar peek. */
export function HomeAgentsCarouselSchedulingPeek({ iphone = false }: { iphone?: boolean }) {
  return (
    <div className="home-agents-carousel__scheduling-peek" aria-hidden>
      <div className={`home-agents-carousel__scheduling-peek-card ${suisseIntl.className}`}>
        <div className="home-agents-carousel__scheduling-peek-header">
          <div className="home-agents-carousel__scheduling-peek-agent">
            <div className="home-agents-carousel__scheduling-peek-agent-row">
              <span className="home-agents-carousel__scheduling-peek-phone-badge" aria-hidden>
                <PhoneIcon />
              </span>
              <span className="home-agents-carousel__scheduling-peek-heading">Scheduling Agent</span>
              <span className={`home-agents-carousel__scheduling-peek-live ${inter.className}`}>On call</span>
            </div>
            <span className={`home-agents-carousel__scheduling-peek-subheading ${inter.className}`}>
              Dr. Chen · This week
            </span>
          </div>
          <span className="home-agents-carousel__scheduling-peek-open-slots">4 open</span>
        </div>

        <div className="home-agents-carousel__scheduling-peek-calendar">
          {WEEK_DAYS.map((day, dayIndex) => {
            const isActive = day.date === 10;
            const daySpread = Math.abs(dayIndex - BROOKS_DAY_INDEX);
            const dayBlur = getApptBlur(daySpread * 0.42);

            return (
              <div
                key={`${day.label}-${day.date}`}
                className={`home-agents-carousel__scheduling-peek-day${
                  isActive ? " home-agents-carousel__scheduling-peek-day--active" : ""
                }`}
              >
                <div
                  className="home-agents-carousel__scheduling-peek-day-head"
                  aria-hidden
                  style={{
                    opacity: getApptOpacity(daySpread * 0.34),
                    filter: !iphone && dayBlur > 0 ? `blur(${dayBlur}px)` : undefined,
                  }}
                >
                  <span className="home-agents-carousel__scheduling-peek-day-label">{day.label}</span>
                  <span className="home-agents-carousel__scheduling-peek-day-date">{day.date}</span>
                </div>

                <div className="home-agents-carousel__scheduling-peek-day-appts">
                  {day.appts.map((appt, apptIndex) => {
                    const isHighlighted = "highlight" in appt && appt.highlight;
                    const spread = getApptSpread(dayIndex, apptIndex, isHighlighted);
                    const blur = getApptBlur(spread);
                    const showApptText = !iphone || isHighlighted;

                    return (
                      <div
                        key={`${day.date}-${appt.name}-${appt.type}`}
                        className={`home-agents-carousel__scheduling-peek-appt home-agents-carousel__scheduling-peek-appt--${appt.tone}${
                          iphone && isHighlighted
                            ? " home-agents-carousel__scheduling-peek-appt--highlighted"
                            : ""
                        }${
                          iphone && !isHighlighted
                            ? " home-agents-carousel__scheduling-peek-appt--iphone-fill"
                            : ""
                        }`}
                        style={{
                          opacity: getApptOpacity(spread),
                          filter: !iphone && blur > 0 ? `blur(${blur}px)` : undefined,
                        }}
                      >
                        {showApptText ? (
                          <>
                            <span className="home-agents-carousel__scheduling-peek-appt-title">{appt.name}</span>
                            <span className="home-agents-carousel__scheduling-peek-appt-type">
                              {formatApptType(appt.type)}
                            </span>
                            <span className="home-agents-carousel__scheduling-peek-appt-meta">{appt.meta}</span>
                          </>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="home-agents-carousel__scheduling-peek-focus">
          <span className="home-agents-carousel__scheduling-peek-focus-phone" aria-hidden>
            <PhoneIcon />
          </span>
          <div className="home-agents-carousel__scheduling-peek-focus-copy">
            <span className="home-agents-carousel__scheduling-peek-focus-label">Confirming by phone</span>
            <span className={`home-agents-carousel__scheduling-peek-focus-meta ${inter.className}`}>
              Brooks · Wed 3:15p
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
