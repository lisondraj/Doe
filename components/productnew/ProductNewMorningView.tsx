"use client";

import {
  PRODUCTNEW_APPOINTMENTS,
  PRODUCTNEW_CLINIC_STATUS,
  PRODUCTNEW_FINANCES,
  PRODUCTNEW_VOICE,
} from "@/lib/productnew/productnew-copy";

const SCHEDULE_START = 8 * 60;
const SCHEDULE_END = 12 * 60;

function parseTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function IconPhone() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M4.5 3.5c-.6 0-1 .5-1 1.1.2 2.7 1.3 5.3 3.3 7.3s4.6 3.1 7.3 3.3c.6 0 1.1-.4 1.1-1v-1.9c0-.5-.4-1-.9-1.1l-2.3-.5a1 1 0 0 0-1 .3l-.8.9a8.6 8.6 0 0 1-4-4l.9-.8c.3-.3.4-.7.3-1l-.5-2.3a1 1 0 0 0-1.1-.9H4.5z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="2.5" y="3.5" width="11" height="10" rx="1.8" stroke="currentColor" strokeWidth="1.1" />
      <path d="M2.5 6.5h11M5.5 2v3M10.5 2v3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

function IconCoin() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.1" />
      <path d="M8 5.2v5.6M6.3 9.3c.2.7.9 1.1 1.7 1.1 1 0 1.7-.5 1.7-1.3 0-1.6-3.4-.8-3.4-2.4 0-.8.7-1.3 1.7-1.3.8 0 1.5.4 1.7 1.1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.1" />
      <path d="M8 5v3.2l2.2 1.3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconPulse() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M1.5 8.5h3l1.2-3.2 2 6.4 1.4-3.2h5.4"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function VoiceHourlyChart() {
  const max = Math.max(...PRODUCTNEW_VOICE.hourly.map((h) => h.value));

  return (
    <div className="productnew-voice-chart" aria-hidden>
      {PRODUCTNEW_VOICE.hourly.map((bar) => (
        <div key={bar.label} className="productnew-voice-chart__col">
          <div
            className="productnew-voice-chart__bar"
            style={{ height: `${(bar.value / max) * 100}%` }}
          />
          <span className="productnew-voice-chart__label">{bar.label}</span>
        </div>
      ))}
    </div>
  );
}

function VoiceCategoryBars() {
  return (
    <div className="productnew-bars">
      {PRODUCTNEW_VOICE.categories.map((cat) => (
        <div key={cat.label} className="productnew-bars__row">
          <div className="productnew-bars__track">
            <div className="productnew-bars__fill" style={{ width: `${cat.pct}%` }} />
          </div>
          <span className="productnew-bars__meta">
            {cat.count} · {cat.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function AppointmentFlow() {
  const segments = [
    { label: "Checked in", value: PRODUCTNEW_APPOINTMENTS.checkedIn, tone: "mid" as const },
    { label: "In room", value: PRODUCTNEW_APPOINTMENTS.inRoom, tone: "dark" as const },
    { label: "Upcoming", value: PRODUCTNEW_APPOINTMENTS.upcoming, tone: "light" as const },
    { label: "Open", value: PRODUCTNEW_APPOINTMENTS.openSlots, tone: "open" as const },
  ];
  const total = segments.reduce((sum, s) => sum + s.value, 0);

  return (
    <div className="productnew-flow">
      <div className="productnew-flow__strip" aria-hidden>
        {segments.map((seg) => (
          <div
            key={seg.label}
            className={`productnew-flow__seg productnew-flow__seg--${seg.tone}`}
            style={{ flex: seg.value }}
          />
        ))}
      </div>
      <div className="productnew-flow__legend">
        {segments.map((seg) => (
          <span key={seg.label}>
            {seg.value} {seg.label.toLowerCase()}
          </span>
        ))}
        <span>{PRODUCTNEW_APPOINTMENTS.noShows} no-show</span>
      </div>
      <p className="productnew-flow__total">{total} on the books</p>
    </div>
  );
}

function FinanceChart() {
  const max = Math.max(...PRODUCTNEW_FINANCES.weekTrend);
  const points = PRODUCTNEW_FINANCES.weekTrend
    .map((v, i) => {
      const x = (i / (PRODUCTNEW_FINANCES.weekTrend.length - 1)) * 100;
      const y = 100 - (v / max) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg className="productnew-finance-chart" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden>
      <polyline points={points} fill="none" stroke="#64748b" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function FinanceSplit() {
  const total = PRODUCTNEW_FINANCES.copays + PRODUCTNEW_FINANCES.insurance;

  return (
    <div className="productnew-split">
      <div className="productnew-split__bar" aria-hidden>
        <div
          className="productnew-split__copay"
          style={{ width: `${(PRODUCTNEW_FINANCES.copays / total) * 100}%` }}
        />
        <div
          className="productnew-split__insurance"
          style={{ width: `${(PRODUCTNEW_FINANCES.insurance / total) * 100}%` }}
        />
      </div>
      <div className="productnew-split__labels">
        <span>${PRODUCTNEW_FINANCES.copays.toLocaleString()} copays</span>
        <span>${PRODUCTNEW_FINANCES.insurance.toLocaleString()} insurance</span>
      </div>
    </div>
  );
}

function ScheduleTimeline() {
  const span = SCHEDULE_END - SCHEDULE_START;

  return (
    <div className="productnew-timeline">
      <div className="productnew-timeline__axis" aria-hidden>
        {[8, 9, 10, 11, 12].map((hour) => (
          <span key={hour}>{hour}:00</span>
        ))}
      </div>
      <div className="productnew-timeline__track">
        {PRODUCTNEW_APPOINTMENTS.schedule.map((slot) => {
          const start = parseTime(slot.time);
          const end = parseTime(slot.end);
          const left = ((start - SCHEDULE_START) / span) * 100;
          const width = ((end - start) / span) * 100;

          return (
            <div
              key={`${slot.time}-${slot.patient}`}
              className={`productnew-timeline__block productnew-timeline__block--${slot.status}`}
              style={{ left: `${left}%`, width: `${width}%` }}
            >
              <span className="productnew-timeline__time">{slot.time}</span>
              <span className="productnew-timeline__patient">{slot.patient}</span>
              <span className="productnew-timeline__type">{slot.type}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WaitingRoomVisual() {
  const seats = Array.from({ length: 6 }, (_, i) => i < PRODUCTNEW_CLINIC_STATUS.waitingRoom);

  return (
    <div className="productnew-seats" aria-hidden>
      {seats.map((filled, i) => (
        <span key={i} className={`productnew-seats__seat${filled ? " productnew-seats__seat--filled" : ""}`} />
      ))}
    </div>
  );
}

function RoomMeter() {
  const pct = (PRODUCTNEW_CLINIC_STATUS.roomsActive / PRODUCTNEW_CLINIC_STATUS.roomsTotal) * 100;

  return (
    <div className="productnew-meter">
      <div className="productnew-meter__track">
        <div className="productnew-meter__fill" style={{ width: `${pct}%` }} />
      </div>
      <span>
        {PRODUCTNEW_CLINIC_STATUS.roomsActive}/{PRODUCTNEW_CLINIC_STATUS.roomsTotal} exam rooms in use
      </span>
    </div>
  );
}

function formatMoney(value: number) {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function ProductNewMorningView({
  onOpenVoiceAgent,
  onOpenCallHistory,
  onOpenSchedule,
  onOpenBilling,
}: {
  onOpenVoiceAgent?: () => void;
  onOpenCallHistory?: () => void;
  onOpenSchedule?: () => void;
  onOpenBilling?: () => void;
}) {
  return (
    <>
      <div className="productnew-dashboard__grid">
        <section className="productnew-card productnew-card--voice">
          <div className="productnew-card__head">
            <h2 className="productnew-card__title">
              <span className="productnew-card__icon" aria-hidden>
                <IconPhone />
              </span>
              Front desk voice agent
            </h2>
            <span className="productnew-card__aside">since {PRODUCTNEW_VOICE.since}</span>
          </div>
          <p className="productnew-stat">{PRODUCTNEW_VOICE.total}</p>
          <p className="productnew-card__sub">calls handled this morning</p>
          <VoiceHourlyChart />
          <div className="productnew-card__footer-stats">
            <span>{PRODUCTNEW_VOICE.resolved} resolved</span>
            <span>{PRODUCTNEW_VOICE.escalated} escalated</span>
            <span>{PRODUCTNEW_VOICE.avgDuration} avg</span>
          </div>
          <VoiceCategoryBars />
          <div className="productnew-card__link-row">
            {onOpenVoiceAgent ? (
              <button type="button" className="productnew-card__link" onClick={onOpenVoiceAgent}>
                Open builder
              </button>
            ) : null}
            {onOpenCallHistory ? (
              <button type="button" className="productnew-card__link" onClick={onOpenCallHistory}>
                Call history
              </button>
            ) : null}
          </div>
        </section>

        <section className="productnew-card productnew-card--appts">
          <div className="productnew-card__head">
            <h2 className="productnew-card__title">
              <span className="productnew-card__icon" aria-hidden>
                <IconCalendar />
              </span>
              Appointments today
            </h2>
          </div>
          <p className="productnew-stat productnew-stat--sm">{PRODUCTNEW_APPOINTMENTS.total}</p>
          <AppointmentFlow />
          {onOpenSchedule ? (
            <button type="button" className="productnew-card__link" onClick={onOpenSchedule}>
              Full schedule
            </button>
          ) : null}
        </section>

        <section className="productnew-card productnew-card--finance">
          <div className="productnew-card__head">
            <h2 className="productnew-card__title">
              <span className="productnew-card__icon" aria-hidden>
                <IconCoin />
              </span>
              Finances
            </h2>
          </div>
          <p className="productnew-stat productnew-stat--sm">{formatMoney(PRODUCTNEW_FINANCES.collected)}</p>
          <p className="productnew-card__sub">collected today</p>
          <FinanceChart />
          <FinanceSplit />
          <div className="productnew-card__footer-stats productnew-card__footer-stats--stack">
            <span>{formatMoney(PRODUCTNEW_FINANCES.outstanding)} outstanding</span>
            <span>{formatMoney(PRODUCTNEW_FINANCES.pendingClaims)} claims pending</span>
          </div>
          {onOpenBilling ? (
            <button type="button" className="productnew-card__link" onClick={onOpenBilling}>
              Open billing
            </button>
          ) : null}
        </section>

        <section className="productnew-card productnew-card--schedule">
          <div className="productnew-card__head">
            <h2 className="productnew-card__title">
              <span className="productnew-card__icon" aria-hidden>
                <IconClock />
              </span>
              Morning schedule
            </h2>
            <span className="productnew-card__aside">Rooms 1–4</span>
          </div>
          <ScheduleTimeline />
          {onOpenSchedule ? (
            <button type="button" className="productnew-card__link" onClick={onOpenSchedule}>
              Open full schedule
            </button>
          ) : null}
        </section>

        <section className="productnew-card productnew-card--status">
          <div className="productnew-card__head">
            <h2 className="productnew-card__title">
              <span className="productnew-card__icon" aria-hidden>
                <IconPulse />
              </span>
              Clinic status
            </h2>
          </div>
          <div className="productnew-status-grid">
            <div className="productnew-status-block">
              <p className="productnew-status-block__value">{PRODUCTNEW_CLINIC_STATUS.waitingRoom}</p>
              <p className="productnew-status-block__label">Waiting room</p>
              <WaitingRoomVisual />
              <p className="productnew-status-block__detail">{PRODUCTNEW_CLINIC_STATUS.avgWaitMin} min avg wait</p>
            </div>
            <div className="productnew-status-block">
              <p className="productnew-status-block__value">{PRODUCTNEW_CLINIC_STATUS.labsPending}</p>
              <p className="productnew-status-block__label">Labs pending</p>
              <div className="productnew-lab-stack" aria-hidden>
                {Array.from({ length: Math.min(PRODUCTNEW_CLINIC_STATUS.labsPending, 5) }).map((_, i) => (
                  <span
                    key={i}
                    className={`productnew-lab-stack__sheet${i === 0 && PRODUCTNEW_CLINIC_STATUS.labsCritical ? " productnew-lab-stack__sheet--critical" : ""}`}
                  />
                ))}
              </div>
              <p className="productnew-status-block__detail">
                {PRODUCTNEW_CLINIC_STATUS.labsCritical} needs review
              </p>
            </div>
          </div>
          <RoomMeter />
        </section>
      </div>
    </>
  );
}
