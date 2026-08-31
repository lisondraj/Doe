"use client";

import { useState } from "react";

import {
  PRODUCTNEW_ROOMS,
  PRODUCTNEW_SCHEDULE,
  PRODUCTNEW_SCHEDULE_DAY,
  type ProductNewScheduleAppt,
} from "@/lib/productnew/productnew-copy";

const DAY_START = 8 * 60;
const DAY_END = 17 * 60;
const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

function parseTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function formatHour(hour: number) {
  const h = hour % 12 === 0 ? 12 : hour % 12;
  return `${h}${hour < 12 || hour === 24 ? "am" : "pm"}`;
}

function ScheduleBlock({
  appt,
  selected,
  onSelect,
}: {
  appt: ProductNewScheduleAppt;
  selected: boolean;
  onSelect: () => void;
}) {
  const span = DAY_END - DAY_START;
  const start = parseTime(appt.time);
  const end = parseTime(appt.end);
  const left = ((start - DAY_START) / span) * 100;
  const width = ((end - start) / span) * 100;

  return (
    <button
      type="button"
      className={`productnew-schedule-block productnew-schedule-block--${appt.status}${selected ? " productnew-schedule-block--selected" : ""}`}
      style={{ left: `${left}%`, width: `${width}%` }}
      onClick={onSelect}
      title={`${appt.patient}${appt.type ? ` · ${appt.type}` : ""}`}
    >
      <span className="productnew-schedule-block__time">{appt.time}</span>
      <span className="productnew-schedule-block__patient">{appt.patient}</span>
      {appt.type ? <span className="productnew-schedule-block__type">{appt.type}</span> : null}
    </button>
  );
}

function ScheduleGrid({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="productnew-schedule-grid">
      <div className="productnew-schedule-grid__axis" aria-hidden>
        <span className="productnew-schedule-grid__axis-spacer" />
        <span className="productnew-schedule-grid__axis-track">
          {HOURS.map((hour) => (
            <span key={hour}>{formatHour(hour)}</span>
          ))}
        </span>
      </div>

      {PRODUCTNEW_ROOMS.map((room) => (
        <div key={room} className="productnew-schedule-grid__row">
          <span className="productnew-schedule-grid__room-label">Room {room}</span>
          <div className="productnew-schedule-grid__track">
            {PRODUCTNEW_SCHEDULE.filter((appt) => appt.room === room).map((appt) => (
              <ScheduleBlock key={appt.id} appt={appt} selected={appt.id === selectedId} onSelect={() => onSelect(appt.id)} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function AgendaItem({
  appt,
  active,
  onSelect,
}: {
  appt: ProductNewScheduleAppt;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        className={`productnew-agenda__item${active ? " productnew-agenda__item--active" : ""}`}
        onClick={onSelect}
      >
        <span className="productnew-agenda__time">{appt.time}</span>
        <span className="productnew-agenda__copy">
          <span className="productnew-agenda__patient">{appt.patient}</span>
          <span className="productnew-agenda__meta">
            {appt.type ? `${appt.type} · ` : ""}Room {appt.room} · {appt.provider}
          </span>
        </span>
        <span className={`productnew-agenda__status productnew-agenda__status--${appt.status}`}>
          {appt.status === "open" ? "Open" : appt.status === "done" ? "Done" : appt.status === "active" ? "In room" : "Upcoming"}
        </span>
      </button>
    </li>
  );
}

/** Scheduling tool: per-room day grid plus a clickable agenda list, in sync via selection. */
export function ProductNewScheduleView() {
  const sorted = [...PRODUCTNEW_SCHEDULE].sort((a, b) => parseTime(a.time) - parseTime(b.time));
  const [selectedId, setSelectedId] = useState(sorted.find((a) => a.status === "active")?.id ?? sorted[0]?.id ?? "");

  const openCount = PRODUCTNEW_SCHEDULE.filter((a) => a.status === "open").length;
  const bookedCount = PRODUCTNEW_SCHEDULE.length - openCount;

  return (
    <>
      <div className="productnew-schedule-head">
        <div>
          <h2 className="productnew-schedule-head__title">{PRODUCTNEW_SCHEDULE_DAY}</h2>
          <p className="productnew-schedule-head__meta">
            {bookedCount} booked · {openCount} open across {PRODUCTNEW_ROOMS.length} rooms
          </p>
        </div>
        <div className="productnew-dashboard__header-actions">
          <button type="button" className="productnew-dashboard__btn productnew-dashboard__btn--outline">
            Today
          </button>
          <button type="button" className="productnew-dashboard__btn productnew-dashboard__btn--solid">
            New appointment
          </button>
        </div>
      </div>

      <div className="productnew-schedule-body">
        <div className="productnew-card productnew-schedule-card">
          <ScheduleGrid selectedId={selectedId} onSelect={setSelectedId} />
        </div>

        <div className="productnew-card productnew-agenda">
          <p className="productnew-card__title">Agenda</p>
          <ul className="productnew-agenda__list">
            {sorted.map((appt) => (
              <AgendaItem key={appt.id} appt={appt} active={appt.id === selectedId} onSelect={() => setSelectedId(appt.id)} />
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
