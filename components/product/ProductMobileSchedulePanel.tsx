"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";

import { monthGrid, monthWeekdays, weekSchedule } from "@/components/doe-schedules-app-mock";
import { dmSans, suisseIntl } from "@/lib/home/fonts";

type ScheduleDay = (typeof weekSchedule)[number];
type ScheduleEvent = {
  time: string;
  label: string;
  tone: string;
};
type ScheduleView = "day" | "week" | "month";

const SLOT_MINUTES = 30;
const SLOT_HEIGHT = 52;
const WEEK_SLOT_HEIGHT = 38;
const WEEK_TOP_BUFFER = 8;
const WEEK_VISIBLE_START_MINUTES = 8 * 60;
const WEEK_VISIBLE_SLOT_COUNT = (24 * 60 - WEEK_VISIBLE_START_MINUTES) / SLOT_MINUTES;
const TODAY_DATE_LABEL = "Mar 30";
const TODAY_DATE_KEY = "2026-03-30";

const VIEW_OPTIONS: { id: ScheduleView; label: string }[] = [
  { id: "day", label: "Day" },
  { id: "week", label: "Week" },
  { id: "month", label: "Month" },
];

function parseTimeToMinutes(time: string): number {
  const [hourText, minuteText] = time.split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return 0;
  if (hour === 12) return 12 * 60 + minute;
  return (hour <= 7 ? hour + 12 : hour) * 60 + minute;
}

function parseEventRangeToMinutes(timeRange: string): { start: number; end: number } {
  const [startText, endText] = timeRange.split("-");
  if (!startText || !endText) return { start: 0, end: SLOT_MINUTES };
  const start = parseTimeToMinutes(startText.trim());
  let end = parseTimeToMinutes(endText.trim());
  if (end <= start) end += 12 * 60;
  return { start, end };
}

function formatMinutesLabel(totalMinutes: number): string {
  const hour = Math.floor(totalMinutes / 60) % 24;
  const minute = totalMinutes % 60;
  const suffix = hour >= 12 ? "PM" : "AM";
  const twelveHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${String(twelveHour).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${suffix}`;
}

function getEventSummary(label: string): { primary: string; secondary: string } {
  if (label.includes(" - ")) {
    const [primary, ...rest] = label.split(" - ");
    return { primary: primary.trim(), secondary: rest.join(" - ").trim() };
  }
  if (label.includes(":")) {
    const [primary, ...rest] = label.split(":");
    return { primary: primary.trim(), secondary: rest.join(":").trim() };
  }
  return { primary: label.trim(), secondary: "" };
}

function shortenEventLabel(label: string, max = 28): string {
  return label.length > max ? `${label.slice(0, max - 1)}…` : label;
}

function eventToneClass(tone: string): string {
  switch (tone) {
    case "amber":
      return "product-mobile-schedule__event--amber";
    case "purple":
      return "product-mobile-schedule__event--purple";
    case "green":
      return "product-mobile-schedule__event--green";
    case "neutral":
      return "product-mobile-schedule__event--neutral";
    default:
      return "product-mobile-schedule__event--blue";
  }
}

function dayDateNumber(date: string): string {
  const match = date.match(/\d+/);
  return match?.[0] ?? date;
}

function TimeAxis({ slotHeight }: { slotHeight: number }) {
  return (
    <div className="product-mobile-schedule__time-col" aria-hidden>
      <div style={{ height: WEEK_TOP_BUFFER }} />
      {Array.from({ length: WEEK_VISIBLE_SLOT_COUNT }).map((_, slotIndex) => {
        const minutes = WEEK_VISIBLE_START_MINUTES + slotIndex * SLOT_MINUTES;
        const isHour = minutes % 60 === 0;
        return (
          <div
            key={`time-${minutes}`}
            className={`product-mobile-schedule__time-slot${isHour ? " product-mobile-schedule__time-slot--hour" : ""}`}
            style={{ height: slotHeight }}
          >
            {isHour ? (
              <span className={`product-mobile-schedule__time-label ${suisseIntl.className}`}>
                {formatMinutesLabel(minutes)}
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function DayEventColumn({
  day,
  slotHeight,
  compact = false,
}: {
  day: ScheduleDay;
  slotHeight: number;
  compact?: boolean;
}) {
  return (
    <div className="product-mobile-schedule__day-col">
      <div className="product-mobile-schedule__day-lines" style={{ top: WEEK_TOP_BUFFER }} aria-hidden>
        {Array.from({ length: WEEK_VISIBLE_SLOT_COUNT }).map((_, slotIndex) => {
          const minutes = WEEK_VISIBLE_START_MINUTES + slotIndex * SLOT_MINUTES;
          const isHour = minutes % 60 === 0;
          return (
            <div
              key={`line-${slotIndex}`}
              className={`product-mobile-schedule__day-line${isHour ? " product-mobile-schedule__day-line--hour" : ""}`}
              style={{ height: slotHeight }}
            />
          );
        })}
      </div>

      {day.events.map((event) => {
        const { start, end } = parseEventRangeToMinutes(event.time);
        const clippedStart = Math.max(start, WEEK_VISIBLE_START_MINUTES);
        const clippedEnd = Math.min(end, 24 * 60);
        if (clippedEnd <= clippedStart) return null;
        const top =
          ((clippedStart - WEEK_VISIBLE_START_MINUTES) / SLOT_MINUTES) * slotHeight + WEEK_TOP_BUFFER;
        const height = Math.max(slotHeight - 2, ((clippedEnd - clippedStart) / SLOT_MINUTES) * slotHeight - 2);
        const summary = getEventSummary(event.label);
        const reason = summary.secondary || summary.primary;
        const style = { top, height } as CSSProperties;

        return (
          <article
            key={`${event.time}-${event.label}`}
            className={`product-mobile-schedule__event ${eventToneClass(event.tone)}${
              compact ? " product-mobile-schedule__event--compact" : ""
            }`}
            style={style}
            title={`${event.time} · ${event.label}`}
          >
            {!compact ? (
              <>
                <p className={`product-mobile-schedule__event-time ${suisseIntl.className}`}>{event.time}</p>
                <p
                  className={`product-mobile-schedule__event-title ${dmSans.className}${
                    height < slotHeight * 1.75 ? " product-mobile-schedule__event-title--truncate" : ""
                  }`}
                >
                  {shortenEventLabel(summary.primary, height < slotHeight * 2 ? 28 : 48)}
                </p>
                {height >= slotHeight * 1.6 && reason !== summary.primary ? (
                  <p className={`product-mobile-schedule__event-detail ${suisseIntl.className}`}>
                    {shortenEventLabel(reason, 36)}
                  </p>
                ) : null}
              </>
            ) : (
              <p
                className={`product-mobile-schedule__event-title product-mobile-schedule__event-title--truncate ${dmSans.className}`}
              >
                {shortenEventLabel(summary.primary, 14)}
              </p>
            )}
          </article>
        );
      })}
    </div>
  );
}

function MonthEventChip({ event }: { event: ScheduleEvent }) {
  const summary = getEventSummary(event.label);
  return (
    <span className={`product-mobile-schedule__chip ${eventToneClass(event.tone)} ${suisseIntl.className}`}>
      {shortenEventLabel(summary.primary, 14)}
    </span>
  );
}

/** iPhone Schedule — desktop-style Day / Week / Month calendar. */
export function ProductMobileSchedulePanel({
  selectedDayIndex,
  onSelectedDayIndexChange,
}: {
  selectedDayIndex: number;
  onSelectedDayIndexChange: (index: number) => void;
}) {
  const [view, setView] = useState<ScheduleView>("day");
  const selectedDay = weekSchedule[selectedDayIndex] ?? weekSchedule[0];
  const monthCells = useMemo(() => monthGrid.slice(0, 35), []);
  const dayGridHeight = WEEK_VISIBLE_SLOT_COUNT * SLOT_HEIGHT + WEEK_TOP_BUFFER;
  const weekGridHeight = WEEK_VISIBLE_SLOT_COUNT * WEEK_SLOT_HEIGHT + WEEK_TOP_BUFFER;

  return (
    <section className="product-mobile-panel product-mobile-schedule" aria-label="Schedule calendar">
      <div className="product-mobile-schedule__toolbar">
        <div className="product-mobile-schedule__views" role="group" aria-label="Calendar view">
          {VIEW_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`product-mobile-schedule__view-btn${
                view === option.id ? " product-mobile-schedule__view-btn--active" : ""
              } ${suisseIntl.className}`}
              aria-pressed={view === option.id}
              onClick={() => setView(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <p className={`product-mobile-schedule__period ${dmSans.className}`}>
          {view === "month"
            ? "March – April 2026"
            : view === "week"
              ? "Mar 30 – Apr 5"
              : `${selectedDay.day}, ${selectedDay.date}`}
        </p>
      </div>

      {view === "day" ? (
        <>
          <div className="product-mobile-schedule__week-strip" role="tablist" aria-label="Week days">
            {weekSchedule.map((day, index) => {
              const isToday = day.date === TODAY_DATE_LABEL;
              const isActive = index === selectedDayIndex;
              return (
                <button
                  key={day.date}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`product-mobile-schedule__week-day${
                    isActive ? " product-mobile-schedule__week-day--active" : ""
                  }${isToday ? " product-mobile-schedule__week-day--today" : ""}`}
                  onClick={() => onSelectedDayIndexChange(index)}
                >
                  <span className={`product-mobile-schedule__week-day-name ${suisseIntl.className}`}>
                    {day.day}
                  </span>
                  <span className={`product-mobile-schedule__week-day-num ${dmSans.className}`}>
                    {dayDateNumber(day.date)}
                  </span>
                  {isToday ? (
                    <span className={`product-mobile-schedule__week-day-tag ${suisseIntl.className}`}>
                      Today
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="product-mobile-schedule__calendar product-mobile-schedule__calendar--day">
            <div className="product-mobile-schedule__calendar-head">
              <div className="product-mobile-schedule__calendar-head-time">
                <span className={suisseIntl.className}>Time</span>
              </div>
              <div
                className={`product-mobile-schedule__calendar-head-day${
                  selectedDay.date === TODAY_DATE_LABEL
                    ? " product-mobile-schedule__calendar-head-day--today"
                    : ""
                }`}
              >
                <div className="product-mobile-schedule__calendar-head-row">
                  <p className={`product-mobile-schedule__calendar-head-title ${dmSans.className}`}>
                    {selectedDay.day}
                  </p>
                  {selectedDay.date === TODAY_DATE_LABEL ? (
                    <span className={`product-mobile-schedule__today-tag ${suisseIntl.className}`}>Today</span>
                  ) : null}
                  <span className={`product-mobile-schedule__calendar-head-date ${suisseIntl.className}`}>
                    {selectedDay.date}
                  </span>
                </div>
                <p className={`product-mobile-schedule__calendar-head-meta ${suisseIntl.className}`}>
                  {selectedDay.events.length} on the calendar
                </p>
              </div>
            </div>
            <div className="product-mobile-schedule__calendar-body">
              <div className="product-mobile-schedule__grid" style={{ height: dayGridHeight }}>
                <TimeAxis slotHeight={SLOT_HEIGHT} />
                <DayEventColumn day={selectedDay} slotHeight={SLOT_HEIGHT} />
              </div>
            </div>
          </div>
        </>
      ) : null}

      {view === "week" ? (
        <div className="product-mobile-schedule__calendar product-mobile-schedule__calendar--week">
          <div className="product-mobile-schedule__week-scroll">
            <div className="product-mobile-schedule__week-board">
              <div className="product-mobile-schedule__week-head">
                <div className="product-mobile-schedule__week-head-time">
                  <span className={suisseIntl.className}>Time</span>
                </div>
                {weekSchedule.map((day, index) => {
                  const isToday = day.date === TODAY_DATE_LABEL;
                  return (
                    <button
                      key={day.date}
                      type="button"
                      className={`product-mobile-schedule__week-head-day${
                        isToday ? " product-mobile-schedule__week-head-day--today" : ""
                      }${index === selectedDayIndex ? " product-mobile-schedule__week-head-day--active" : ""}`}
                      onClick={() => {
                        onSelectedDayIndexChange(index);
                        setView("day");
                      }}
                    >
                      <span className={`product-mobile-schedule__week-head-name ${suisseIntl.className}`}>
                        {day.day}
                      </span>
                      <span className={`product-mobile-schedule__week-head-num ${dmSans.className}`}>
                        {dayDateNumber(day.date)}
                      </span>
                      {isToday ? (
                        <span
                          className={`product-mobile-schedule__today-tag product-mobile-schedule__today-tag--sm ${suisseIntl.className}`}
                        >
                          Today
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>

              <div className="product-mobile-schedule__week-body" style={{ height: weekGridHeight }}>
                <TimeAxis slotHeight={WEEK_SLOT_HEIGHT} />
                {weekSchedule.map((day) => (
                  <DayEventColumn
                    key={`col-${day.date}`}
                    day={day}
                    slotHeight={WEEK_SLOT_HEIGHT}
                    compact
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {view === "month" ? (
        <div className="product-mobile-schedule__calendar product-mobile-schedule__calendar--month">
          <div className="product-mobile-schedule__month-weekdays">
            {monthWeekdays.map((weekday) => (
              <span key={weekday} className={`product-mobile-schedule__month-weekday ${suisseIntl.className}`}>
                {weekday}
              </span>
            ))}
          </div>
          <div className="product-mobile-schedule__month-grid">
            {monthCells.map((cell) => {
              const isToday = cell.key === TODAY_DATE_KEY;
              const weekIndex = weekSchedule.findIndex((d) => d.date === `${cell.month} ${cell.day}`);
              const visibleEvents = cell.events.slice(0, 3);
              const overflow = cell.events.length - visibleEvents.length;

              return (
                <button
                  key={cell.key}
                  type="button"
                  className={`product-mobile-schedule__month-cell${
                    cell.inApril ? "" : " product-mobile-schedule__month-cell--muted"
                  }${isToday ? " product-mobile-schedule__month-cell--today" : ""}${
                    weekIndex === selectedDayIndex ? " product-mobile-schedule__month-cell--selected" : ""
                  }`}
                  onClick={() => {
                    if (weekIndex >= 0) {
                      onSelectedDayIndexChange(weekIndex);
                      setView("day");
                    }
                  }}
                >
                  <span className={`product-mobile-schedule__month-daynum ${dmSans.className}`}>
                    {cell.day}
                    {isToday ? (
                      <span
                        className={`product-mobile-schedule__today-tag product-mobile-schedule__today-tag--sm ${suisseIntl.className}`}
                      >
                        Today
                      </span>
                    ) : null}
                  </span>
                  <span className="product-mobile-schedule__month-events">
                    {visibleEvents.map((event) => (
                      <MonthEventChip key={`${cell.key}-${event.time}-${event.label}`} event={event} />
                    ))}
                    {overflow > 0 ? (
                      <span className={`product-mobile-schedule__month-more ${suisseIntl.className}`}>
                        +{overflow} more
                      </span>
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </section>
  );
}
