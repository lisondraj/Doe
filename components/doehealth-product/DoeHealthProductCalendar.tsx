"use client";

/**
 * Schedule's wider views — a quiet week of soft, rounded visit "clouds", a month that shows each day as a
 * small cluster of dots, and a year of small months tinted by how full each day is. Clicking a day in the
 * month or year opens that week; clicking a month in the year opens it.
 */
import { type ReactNode, useEffect, useState } from "react";

const DISPLAY = "font-['P22MackinacPro-Medium','P22_Mackinac_Pro',system-ui,sans-serif] font-[500]";
const SANS = "font-['DM_Sans',system-ui,sans-serif]";
const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

const DAY_FROM = 8;
const DAY_TO = 17;
const HOURS = DAY_TO - DAY_FROM;

const PEOPLE = [
  "Maya Chen",
  "Priya Raman",
  "Daniel Okafor",
  "Grace Kim",
  "Henry Walsh",
  "Leo Jacobs",
  "Hannah Lee",
  "Marcus Webb",
  "Ava Brooks",
  "Omar Haddad",
  "Sofia Ruiz",
  "Lily Park",
  "Elena Cho",
  "Noah Bennett",
];
const TONES = ["#F6DED0", "#E3E9D9", "#EEE6D6", "#F3E7C9"];
const DOT_TONES = ["#E8A585", "#8DAA7C", "#C2A987", "#D9B860"];

type Visit = { id: string; start: number; len: number; who: string; tone: number };
export type ScheduleView = "day" | "week" | "month" | "year";
type CalendarView = Exclude<ScheduleView, "day">;

const VIEWS: ScheduleView[] = ["day", "week", "month", "year"];

function seeded(seed: number) {
  let s = seed % 233280;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/** A stable, made-up day of visits for any date, with a lunch break and nothing on weekends. */
function visitsFor(date: Date): Visit[] {
  const weekday = date.getDay();
  if (weekday === 0 || weekday === 6) return [];
  const r = seeded(date.getFullYear() * 372 + date.getMonth() * 31 + date.getDate());
  const out: Visit[] = [];
  let t = DAY_FROM + Math.floor(r() * 3) * 0.25;
  while (t < DAY_TO - 0.5) {
    if (t >= 12 && t < 13) {
      t = 13;
      continue;
    }
    const len = [0.5, 0.75, 1, 0.5][Math.floor(r() * 4)]!;
    if (t + len > DAY_TO || (t < 12 && t + len > 12)) {
      t += 0.25;
      continue;
    }
    if (r() > 0.4) {
      out.push({ id: `${t}`, start: t, len, who: PEOPLE[Math.floor(r() * PEOPLE.length)]!, tone: Math.floor(r() * TONES.length) });
    }
    t += len + [0.25, 0.5, 0.75][Math.floor(r() * 3)]!;
  }
  return out;
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function addDays(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}

function mondayOf(d: Date) {
  return addDays(startOfDay(d), -((d.getDay() + 6) % 7));
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function clock(hour: number) {
  const h = Math.floor(hour);
  const m = Math.round((hour - h) * 60);
  const h12 = ((h + 11) % 12) + 1;
  return m ? `${h12}:${String(m).padStart(2, "0")}` : `${h12}`;
}

const pct = (hour: number) => `${((hour - DAY_FROM) / HOURS) * 100}%`;

function RoundButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="w-[40px] h-[40px] shrink-0 flex items-center justify-center rounded-[999px] bg-[#EEEADF] hover:bg-[#E6E0D2] text-walnut transition-colors duration-150"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
        <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {children}
        </g>
      </svg>
    </button>
  );
}

function WeekView({ monday, today, now }: { monday: Date; today: Date; now: number | null }) {
  const days = Array.from({ length: 5 }, (_, i) => addDays(monday, i));
  const [picked, setPicked] = useState<string | null>(null);

  return (
    <div className="doe-menu-in flex flex-col grow min-h-[0px] gap-[14px]">
      <div className="flex pl-[52px] gap-[10px]">
        {days.map((d) => {
          const isToday = sameDay(d, today);
          return (
            <div key={d.toISOString()} className="flex-1 flex items-center gap-[10px] px-[10px]">
              <span
                className={`w-[44px] h-[44px] flex items-center justify-center rounded-[999px] text-[20px] leading-[24px] ${DISPLAY} ${isToday ? "bg-ink [color:#FFFCF1]" : "text-walnut"}`}
              >
                {d.getDate()}
              </span>
              <span className={`text-[14px] leading-[18px] ${SANS} font-[500] ${isToday ? "text-walnut" : "text-sub"}`}>
                {d.toLocaleDateString("en-US", { weekday: "short" })}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex grow min-h-[0px] gap-[10px]">
        <div className="relative w-[42px] shrink-0">
          {Array.from({ length: HOURS }, (_, i) => DAY_FROM + i).map((h) => (
            <span key={h} className={`absolute right-0 -translate-y-1/2 text-[11px] leading-[14px] ${SANS} font-[500] text-sub`} style={{ top: `calc(${pct(h)} + 10px)` }}>
              {clock(h)}
              <span className="opacity-60">{h < 12 ? " am" : " pm"}</span>
            </span>
          ))}
        </div>
        {days.map((d) => {
          const isToday = sameDay(d, today);
          const visits = visitsFor(d);
          return (
            <div key={d.toISOString()} className={`relative flex-1 min-w-[0px] rounded-[28px] p-[10px] ${isToday ? "bg-sand" : "bg-[#FAF6EC]"}`}>
              <div
                className="relative h-full"
                style={{
                  backgroundImage: "linear-gradient(rgb(40 25 16 / 5%) 1px, transparent 1px)",
                  backgroundSize: `100% ${100 / HOURS}%`,
                }}
              >
                {visits.map((v) => {
                  const key = `${d.toDateString()}-${v.id}`;
                  const on = picked === key;
                  const past = isToday && now !== null && v.start + v.len <= now;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setPicked(on ? null : key)}
                      className={`absolute left-0 right-0 flex flex-col justify-center overflow-hidden rounded-[16px] px-[12px] text-left transition-[transform,opacity] duration-200 hover:-translate-y-[1px] ${on ? "z-[1]" : ""}`}
                      style={{
                        top: `calc(${pct(v.start)} + 2px)`,
                        height: `calc(${(v.len / HOURS) * 100}% - 4px)`,
                        backgroundColor: TONES[v.tone],
                        opacity: past ? 0.55 : 1,
                        transitionTimingFunction: EASE,
                      }}
                    >
                      <span className={`truncate text-[13px] leading-[16px] ${SANS} font-[600] text-walnut`}>{v.who}</span>
                      {(v.len > 0.5 || on) && (
                        <span className={`truncate text-[11px] leading-[14px] ${SANS} font-[500] text-sub`}>
                          {clock(v.start)} – {clock(v.start + v.len)}
                        </span>
                      )}
                    </button>
                  );
                })}
                {isToday && now !== null && now > DAY_FROM && now < DAY_TO && (
                  <span className="pointer-events-none absolute left-[-6px] right-0 z-[2] flex items-center -translate-y-1/2" style={{ top: pct(now) }}>
                    <span className="w-[10px] h-[10px] shrink-0 rounded-[999px] bg-ink" />
                    <span className="grow h-[1.5px] bg-ink" />
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MonthView({ month, today, onPickWeek }: { month: Date; today: Date; onPickWeek: (d: Date) => void }) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const start = mondayOf(first);
  const cells = Array.from({ length: 42 }, (_, i) => addDays(start, i));

  return (
    <div className="doe-menu-in flex flex-col grow min-h-[0px] gap-[12px]">
      <div className="grid grid-cols-7 gap-[10px] px-[4px]">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <span key={d} className={`px-[14px] text-[13px] leading-[16px] ${SANS} font-[500] text-sub`}>
            {d}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 grid-rows-6 gap-[10px] grow min-h-[0px]">
        {cells.map((d) => {
          const inMonth = d.getMonth() === month.getMonth();
          const isToday = sameDay(d, today);
          const visits = visitsFor(d);
          return (
            <button
              key={d.toISOString()}
              type="button"
              onClick={() => onPickWeek(d)}
              className={`flex flex-col justify-between p-[12px] rounded-[24px] text-left transition-colors duration-150 ${isToday ? "bg-sand" : "bg-[#FAF6EC] hover:bg-[#F4EEDF]"} ${inMonth ? "" : "opacity-45"}`}
            >
              <span
                className={`w-[34px] h-[34px] flex items-center justify-center rounded-[999px] text-[16px] leading-[20px] ${DISPLAY} ${isToday ? "bg-ink [color:#FFFCF1]" : "text-walnut"}`}
              >
                {d.getDate()}
              </span>
              <span className="flex flex-wrap gap-[4px] px-[4px]">
                {visits.map((v) => (
                  <span key={v.id} className="w-[7px] h-[7px] rounded-[999px]" style={{ backgroundColor: DOT_TONES[v.tone] }} />
                ))}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function YearView({ year, today, onPickMonth, onPickWeek }: { year: number; today: Date; onPickMonth: (d: Date) => void; onPickWeek: (d: Date) => void }) {
  return (
    <div className="doe-menu-in grid grid-cols-4 grid-rows-3 gap-[10px] grow min-h-[0px]">
      {Array.from({ length: 12 }, (_, m) => {
        const first = new Date(year, m, 1);
        const start = mondayOf(first);
        const cells = Array.from({ length: 42 }, (_, i) => addDays(start, i));
        const isThisMonth = today.getFullYear() === year && today.getMonth() === m;
        return (
          <div key={m} className={`flex flex-col min-h-[0px] gap-[6px] p-[14px] rounded-[24px] ${isThisMonth ? "bg-sand" : "bg-[#FAF6EC]"}`}>
            <button
              type="button"
              onClick={() => onPickMonth(first)}
              className={`self-start px-[4px] text-[18px] leading-[22px] tracking-[-0.01em] ${DISPLAY} text-walnut hover:text-sub transition-colors duration-150`}
            >
              {first.toLocaleDateString("en-US", { month: "long" })}
            </button>
            <div className="grid grid-cols-7 grid-rows-6 grow min-h-[0px]">
              {cells.map((d) => {
                if (d.getMonth() !== m) return <span key={d.toISOString()} />;
                const isToday = sameDay(d, today);
                const load = Math.min(1, visitsFor(d).length / 10);
                return (
                  <button
                    key={d.toISOString()}
                    type="button"
                    aria-label={d.toDateString()}
                    onClick={() => onPickWeek(d)}
                    className="flex items-center justify-center min-h-[0px]"
                  >
                    <span
                      className={`w-[22px] h-[22px] flex items-center justify-center rounded-[999px] text-[11px] leading-[14px] ${SANS} font-[500] ${isToday ? "bg-ink [color:#FFFCF1]" : "text-walnut hover:outline hover:outline-[1.5px] hover:outline-[#28191033]"}`}
                      style={isToday || !load ? undefined : { backgroundColor: `rgb(232 165 133 / ${Math.round(18 + load * 50)}%)` }}
                    >
                      {d.getDate()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Day · Week · Month · Year — shared by the day schedule and the calendar views. */
export function ScheduleViewSwitch({ view, onChange }: { view: ScheduleView; onChange: (v: ScheduleView) => void }) {
  return (
    <div className="relative flex shrink-0 h-[40px] p-[4px] rounded-[999px] bg-[#EEEADF]">
      <span
        className="absolute top-[4px] bottom-[4px] w-[76px] rounded-[999px] bg-paper"
        style={{ left: 4 + VIEWS.indexOf(view) * 76, transition: `left 300ms ${EASE}` }}
      />
      {VIEWS.map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={`relative w-[76px] rounded-[999px] text-[14px] leading-[18px] ${SANS} font-[500] capitalize transition-colors duration-150 ${view === v ? "text-walnut" : "text-sub hover:text-walnut"}`}
        >
          {v}
        </button>
      ))}
    </div>
  );
}

export function DoeHealthProductCalendar({ view, onView }: { view: CalendarView; onView: (v: ScheduleView) => void }) {
  const [today, setToday] = useState(() => startOfDay(new Date()));
  const [now, setNow] = useState<number | null>(null);
  const [anchor, setAnchor] = useState(() => startOfDay(new Date()));

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setToday(startOfDay(d));
      setNow(d.getHours() + d.getMinutes() / 60);
    };
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  const monday = mondayOf(anchor);
  const shown = view === "week" ? addDays(monday, 3) : anchor;
  const step = (dir: 1 | -1) =>
    setAnchor((a) =>
      view === "week" ? addDays(a, dir * 7) : view === "month" ? new Date(a.getFullYear(), a.getMonth() + dir, 1) : new Date(a.getFullYear() + dir, a.getMonth(), 1),
    );
  const sameYear = today.getFullYear() === anchor.getFullYear();
  const onThisPeriod = view === "week" ? sameDay(mondayOf(today), monday) : view === "month" ? sameYear && today.getMonth() === anchor.getMonth() : sameYear;
  const openWeek = (d: Date) => {
    setAnchor(d);
    onView("week");
  };

  return (
    <div className="relative [font-synthesis:none] h-full w-full flex flex-col gap-[26px] pt-[36px] px-[40px] pb-[28px] rounded-[24px] overflow-clip bg-paper antialiased">

      <div className="relative flex items-end justify-between">
        <div className="flex items-baseline gap-[14px]">
          {view === "year" ? (
            <span className={`text-[58px] leading-[62px] tracking-[-0.03em] ${DISPLAY} text-walnut`}>{shown.getFullYear()}</span>
          ) : (
            <>
              <span className={`text-[58px] leading-[62px] tracking-[-0.03em] ${DISPLAY} text-walnut`}>
                {shown.toLocaleDateString("en-US", { month: "long" })}
              </span>
              <span className={`text-[28px] leading-[32px] tracking-[-0.02em] ${DISPLAY} text-sub`}>{shown.getFullYear()}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-[8px]">
          <button
            type="button"
            onClick={() => setAnchor(today)}
            disabled={onThisPeriod}
            className={`h-[40px] px-[16px] rounded-[999px] text-[14px] leading-[18px] ${SANS} font-[500] transition-colors duration-150 ${onThisPeriod ? "bg-transparent text-sub" : "bg-[#EEEADF] hover:bg-[#E6E0D2] text-walnut"}`}
          >
            Today
          </button>
          <RoundButton label="Previous" onClick={() => step(-1)}>
            <path d="M15 6l-6 6 6 6" />
          </RoundButton>
          <RoundButton label="Next" onClick={() => step(1)}>
            <path d="M9 6l6 6-6 6" />
          </RoundButton>
          <span className="ml-[8px]">
            <ScheduleViewSwitch view={view} onChange={onView} />
          </span>
        </div>
      </div>

      {view === "week" ? (
        <WeekView key={monday.toDateString()} monday={monday} today={today} now={now} />
      ) : view === "month" ? (
        <MonthView key={`${anchor.getFullYear()}-${anchor.getMonth()}`} month={anchor} today={today} onPickWeek={openWeek} />
      ) : (
        <YearView
          key={anchor.getFullYear()}
          year={anchor.getFullYear()}
          today={today}
          onPickMonth={(d) => {
            setAnchor(d);
            onView("month");
          }}
          onPickWeek={openWeek}
        />
      )}
    </div>
  );
}
