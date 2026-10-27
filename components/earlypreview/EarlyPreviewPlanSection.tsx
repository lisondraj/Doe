"use client";

import { SkipButton } from "@/components/doehealth-desk2/DoeHealthDesk2AudienceSection";
import { type ReactNode, memo, useEffect, useRef } from "react";

import {
  PhoneAgents,
  PhoneEvents,
  PhoneCampaign,
  PhoneTimeline,
} from "@/components/earlypreview/EarlyPreviewPlanPhone";
import { DOEPHONE_DESKTOP_PAGE_INSET_X } from "@/lib/doephone/section-styles";
import {
  DOEHEALTH_DESK2_PHONE_STEP_PX,
  cssVars as vars,
  scrollRamp as ramp,
  useDoeHealthDesk2ScrollLock,
} from "@/lib/doehealthdesk2/use-doehealthdesk2-scroll-lock";
import { EARLYPREVIEW_PLAN as PLAN, EARLYPREVIEW_PLAN_QUARTERS as QUARTERS } from "@/lib/earlypreview/earlypreview-plan-copy";
import { EARLYPREVIEW_PLAN_PHONE as PHONE } from "@/lib/earlypreview/earlypreview-plan-phone-copy";

/**
 * The go-to-market, above the enterprise section, in the market section's brown. The timeline first: supply, agents
 * and revenue side by side to Seed. Then the plan, one drawing a screen and none of them repeated: where potential
 * customers come from, the rooms we'll be in, the groups that bring most of the revenue, the agent pipeline, the page
 * that recruits a practice, one practice's first sixty days. A faint dot field sits
 * behind each.
 */
const SCENES = [
  // Longer than the others: on the iPhone it steps through its three lanes one at a time.
  { id: "timeline", len: 3.6 },
  { id: "events", len: 2.6 },
  { id: "agents", len: 2.6 },
  // On the iPhone this screen is the launch campaign, six views long.
  { id: "journey", len: 3.9 },
] as const;

type SceneId = (typeof SCENES)[number]["id"];

const TIMING = (() => {
  let at = 0;
  return SCENES.map((scene) => {
    const start = at;
    at += scene.len;
    return { ...scene, start };
  });
})();

const END = TIMING[TIMING.length - 1].start + TIMING[TIMING.length - 1].len;
const FADE = 0.28;

const smooth = (t: number) => t * t * (3 - 2 * t);
/** Eased 0 → 1 as a screen's clock `t` moves through [a, b]. */
const en = (t: number, a: number, b: number) => smooth(ramp(t, [a, b]));
/** Rounded, so a style string or an SVG attribute is the same on the server and in the browser. */
const fixed = (x: number) => Math.round(x * 10_000) / 10_000;
const range = (length: number) => Array.from({ length }, (_, i) => i);
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
/** Style for a stroke traced in by CSS (pathLength 1, dash offset from --draw). */
const draw = (value: number) => vars({ "--draw": fixed(value) });

function sceneClock(p: number, id: SceneId) {
  const index = TIMING.findIndex((scene) => scene.id === id);
  const { start, len } = TIMING[index];
  const fadeIn = index === 0 ? 1 : ramp(p, [start, start + FADE]);
  const fadeOut = index === TIMING.length - 1 ? 1 : 1 - ramp(p, [start + len - FADE, start + len]);
  return { o: fadeIn * fadeOut, t: p - start };
}

/** One stacked screen, over its faint dot field. Hidden screens can't be focused, so only the one on screen takes input. */
function Scene({ o, t = 0, label, children }: { o: number; t?: number; label: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const live = o > 0.5;
  useEffect(() => {
    if (ref.current) ref.current.inert = !live;
  }, [live]);
  return (
    <div
      ref={ref}
      role="group"
      aria-label={label}
      aria-hidden={!live}
      className={`earlypreview-market__scene ${DOEPHONE_DESKTOP_PAGE_INSET_X}${live ? " is-live" : ""}${o <= 0.001 ? " is-gone" : ""}`}
      style={vars({ "--o": o })}
    >
      <span className="earlypreview-plan__field" style={vars({ "--t": fixed(t) })} aria-hidden />
      {children}
    </div>
  );
}

/** The screen's two-line P22 title, second line in salmon, revealed by the site's swipe. */
function SceneTitle({ title, t }: { title: readonly string[]; t: number }) {
  const s = ramp(t, [0.04, 0.62]);
  return (
    <h2 className="earlypreview-market__title">
      {title.map((line, index) => (
        <span key={line} className={`earlypreview-market__swipe${index === 1 ? " is-salmon" : ""}`} style={vars({ "--s": s })}>
          {line}
        </span>
      ))}
    </h2>
  );
}

/** A whole number that counts up with `k`. The digits come from a CSS counter, so the text doesn't reflow as it counts. */
function Count({ value, k }: { value: number; k: number }) {
  return (
    <>
      <span className="sr-only">{value}</span>
      <span className="earlypreview-market__count" style={vars({ "--v": Math.round(value * k) })} aria-hidden />
    </>
  );
}

/* ------------------------------------------------------------ 1. timeline */

const LANE_DOTS = 84;
const LANE = range(LANE_DOTS).map((d) => fixed(d / (LANE_DOTS - 1)));

const LaneDots = memo(function LaneDots() {
  return (
    <span className="earlypreview-plan__lane-dots" aria-hidden>
      {LANE.map((d, i) => (
        <i key={i} style={vars({ "--d": d })} />
      ))}
    </span>
  );
});

/**
 * Three lanes on one axis of quarters, filling together left to right: they run in parallel, not one after another.
 * Each milestone lights as the fill reaches its quarter; the Seed ones, in the last quarter, are salmon.
 */
function TimelineScene({ p }: { p: number }) {
  const { o, t } = sceneClock(p, "timeline");
  const copy = PLAN.timeline;
  const k = ramp(t, [0.55, 2.2]);
  return (
    <Scene o={o} t={t} label="Supply, agents and revenue, all three from day one">
      <div className="earlypreview-plan__title-desk">
        <SceneTitle title={copy.title} t={t} />
      </div>
      <div className="earlypreview-plan__title-phone">
        <SceneTitle title={PHONE.timeline.title} t={t} />
      </div>
      {/* iPhone: this screen drawn as a picture. */}
      <div className="earlypreview-market__body earlypreview-plan__phone-only">
        <PhoneTimeline t={t} />
      </div>
      <div className="earlypreview-market__body earlypreview-plan__desk-only">
        <div className="earlypreview-plan__timeline" style={vars({ "--k": k, "--e": en(t, 0.3, 0.6) })}>
          <div className="earlypreview-plan__axis" aria-hidden>
            <span />
            <span className="earlypreview-plan__quarters">
              {QUARTERS.map((quarter, i) => (
                <span key={quarter} className={i === QUARTERS.length - 1 ? "is-seed" : i === 0 ? "is-now" : undefined}>
                  {i === QUARTERS.length - 1 ? `${quarter} · ${copy.seed}` : i === 0 ? `${quarter} · ${copy.now}` : quarter}
                </span>
              ))}
            </span>
          </div>
          {copy.lanes.map((lane) => (
            <div key={lane.id} className="earlypreview-plan__lane">
              <span className="earlypreview-plan__lane-name">{lane.name}</span>
              <div className="earlypreview-plan__lane-track">
                <LaneDots />
                <ol className="earlypreview-plan__milestones">
                  {lane.milestones.map((m) => {
                    const at = (m.q + 0.5) / QUARTERS.length;
                    return (
                      <li
                        key={m.text}
                        className={"seed" in m ? "is-seed" : undefined}
                        style={vars({ "--at": fixed(at), "--e": smooth(ramp(k, [at - 0.04, at + 0.03])) })}
                      >
                        <i aria-hidden />
                        <span>
                          <span className="sr-only">{`${QUARTERS[m.q]}: `}</span>
                          {m.text}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Scene>
  );
}

/** A small line under a screen's drawing, in the display face. */
function Note({ e, children }: { e: number; children: ReactNode }) {
  return (
    <p className="earlypreview-plan__note-line" style={vars({ "--e": e })}>
      {children}
    </p>
  );
}

/* ------------------------------------------------------------ 3. conferences */

/**
 * The rooms we'll be in, as a calendar: twenty months from Nov '26 to Seed, ten to a row. Each month fills in turn
 * with the events that usually run then, each marked by who is in the room. The associations we're pitching run under.
 */
function EventsScene({ p }: { p: number }) {
  const { o, t } = sceneClock(p, "events");
  const copy = PLAN.events;
  let year = copy.firstYear;
  return (
    <Scene o={o} t={t} label="Where practices meet, we're in the room">
      <div className="earlypreview-plan__head">
        <SceneTitle title={copy.title} t={t} />
        <ul className="earlypreview-plan__kinds" style={vars({ "--e": en(t, 0.4, 0.7) })}>
          {copy.kinds.map((kind) => (
            <li key={kind.id} className={`is-${kind.id}`}>
              <i aria-hidden />
              {kind.name}
            </li>
          ))}
        </ul>
      </div>
      {/* iPhone: this screen drawn as a picture. */}
      <div className="earlypreview-market__body earlypreview-plan__phone-only">
        <PhoneEvents t={t} />
      </div>
      <div className="earlypreview-market__body earlypreview-plan__desk-only earlypreview-plan__events">
        <ol className="earlypreview-plan__calendar">
          {copy.months.map((month, m) => {
            if (month === "Jan") year += 1;
            const events = copy.list.filter((event) => event.month === m);
            const at = 0.45 + m * 0.07;
            return (
              <li key={m} className={events.length ? "is-busy" : undefined} style={vars({ "--e": en(t, at, at + 0.2) })}>
                <span className="earlypreview-plan__month">
                  {month}
                  {month === "Jan" || m === 0 ? <span> ’{String(year).slice(2)}</span> : null}
                </span>
                {events.map((event) => (
                  <span key={event.name} className={`earlypreview-plan__event is-${event.kind}`}>
                    <i aria-hidden />
                    <span>
                      {event.name}
                      <span className="earlypreview-plan__event-place">{event.place}</span>
                    </span>
                  </span>
                ))}
              </li>
            );
          })}
        </ol>
        <p className="earlypreview-plan__associations" style={vars({ "--e": en(t, 1.9, 2.15) })}>
          <span>{copy.groups.label}</span>
          {copy.groups.names.map((name) => (
            <span key={name} className="earlypreview-plan__association">
              {name}
            </span>
          ))}
        </p>
      </div>
    </Scene>
  );
}

/* ------------------------------------------------------------ 5. agents */

const TOKENS_PER_ROW = 5;
/** When each stage's teams move on from the column before. */
const STAGE_AT = [0.95, 1.35, 1.75] as const;

/**
 * The partnership pipeline as a board: a column a stage, a small token a team. The target list fills first; then at
 * each stage the teams that move on slide across into the next column, the way a pipeline board is worked.
 */
function AgentsScene({ p }: { p: number }) {
  const { o, t } = sceneClock(p, "agents");
  const copy = PLAN.agents;
  const columns = copy.columns.length;
  return (
    <Scene o={o} t={t} label="We partner with the agents patients already use">
      <div className="earlypreview-plan__head">
        <SceneTitle title={copy.title} t={t} />
      </div>
      {/* iPhone: this screen drawn as a picture. */}
      <div className="earlypreview-market__body earlypreview-plan__phone-only">
        <PhoneAgents t={t} />
      </div>
      <div className="earlypreview-market__body earlypreview-plan__desk-only earlypreview-plan__board-wrap">
        {/* Each column's header and notes sit in the board's grid; the tokens share one row under all four headers. */}
        <div className="earlypreview-plan__board" style={vars({ "--cols": columns })}>
          {copy.columns.map((column, c) => (
            <section
              key={column.id}
              className={`earlypreview-plan__lane-col${"salmon" in column ? " is-salmon" : ""}`}
              style={vars({ "--e": en(t, 0.3 + c * 0.08, 0.55 + c * 0.08) })}
            >
              <h3 style={{ gridColumn: c + 1 }}>
                <span className="earlypreview-plan__col-value">
                  <Count value={column.value} k={c === 0 ? en(t, 0.45, 0.85) : en(t, STAGE_AT[c - 1], STAGE_AT[c - 1] + 0.3)} />
                </span>
                <span className="earlypreview-plan__col-name">{column.name}</span>
              </h3>
              <p className="earlypreview-plan__col-how" style={{ gridColumn: c + 1 }}>
                {column.how}
              </p>
              <p className="earlypreview-plan__col-when" style={{ gridColumn: c + 1 }}>
                {column.when}
              </p>
            </section>
          ))}
          <div className="earlypreview-plan__tokens" aria-hidden>
            {copy.columns.flatMap((column, c) =>
              range(column.value).map((i) => {
                // A team arrives in column c from its own place in the column before; the target list fills in place.
                const move = c === 0 ? 1 : en(t, STAGE_AT[c - 1] + i * 0.012, STAGE_AT[c - 1] + 0.25 + i * 0.012);
                const shown = c === 0 ? en(t, 0.45 + i * 0.008, 0.6 + i * 0.008) : move > 0 ? 1 : 0;
                return (
                  <i
                    key={`${column.id}-${i}`}
                    className={"salmon" in column ? "is-salmon" : undefined}
                    style={vars({
                      "--col": fixed(c - 1 + move),
                      "--sx": i % TOKENS_PER_ROW,
                      "--sy": Math.floor(i / TOKENS_PER_ROW),
                      "--k": shown,
                    })}
                  />
                );
              }),
            )}
          </div>
        </div>
        <Note e={en(t, 2.0, 2.3)}>{copy.sources}</Note>
      </div>
    </Scene>
  );
}

/* ------------------------------------------------------------ 7. journey */

/** The ruler: a tick a day across the width, longer every week; the marks alternate above and below it. */
const RULER = { left: 30, right: 970, y: 150 } as const;
const dayX = (day: number) => fixed(RULER.left + (day / PLAN.journey.days) * (RULER.right - RULER.left));

const RulerTicks = memo(function RulerTicks() {
  return (
    <>
      {range(PLAN.journey.days + 1).map((day) => (
        <path
          key={day}
          d={`M${dayX(day)} ${RULER.y}v${day % 7 === 0 ? 14 : 6}`}
          className={day % 7 === 0 ? "is-week" : "is-day"}
          style={vars({ "--x": fixed(day / PLAN.journey.days) })}
        />
      ))}
    </>
  );
});

/**
 * One practice's first sixty days as a ruler: a tick a day, a salmon run along it with the scroll, and each mark set
 * where it falls, from the page built and emailed on day 0 to the upgrade to paid on day 45.
 */
function JourneyScene({ p }: { p: number }) {
  const { o, t } = sceneClock(p, "journey");
  const copy = PLAN.journey;
  const run = en(t, 0.5, 2.0);
  return (
    <Scene o={o} t={t} label="From first email to paying">
      <div className="earlypreview-plan__head">
        <div className="earlypreview-plan__title-desk">
          <SceneTitle title={copy.title} t={t} />
        </div>
        <div className="earlypreview-plan__title-phone">
          <SceneTitle title={PHONE.campaign.title} t={t} />
        </div>
        <div className="earlypreview-plan__corner" style={vars({ "--e": en(t, 1.6, 1.9) })}>
          <p className="earlypreview-plan__corner-value">{copy.stat.value}</p>
          <p className="earlypreview-plan__corner-label">{copy.stat.caption}</p>
        </div>
      </div>
      {/* iPhone: this screen drawn as a picture. */}
      <div className="earlypreview-market__body earlypreview-plan__phone-only">
        <PhoneCampaign t={t} />
      </div>
      <div className="earlypreview-market__body earlypreview-plan__desk-only earlypreview-plan__journey">
        <svg className="earlypreview-plan__ruler" viewBox="0 0 1000 340" fill="none" style={vars({ "--run": run, "--e": en(t, 0.3, 0.55) })} aria-hidden>
          <path d={`M${RULER.left} ${RULER.y}H${RULER.right}`} className="is-edge" />
          <path d={`M${RULER.left} ${RULER.y}H${RULER.right}`} pathLength={1} className="is-run" style={draw(run)} />
          <RulerTicks />
          {range(Math.floor(copy.days / 7) + 1).map((week) => (
            <text key={week} x={dayX(week * 7)} y={RULER.y + 32} className="is-week-label">
              {week === 0 ? "Day 0" : week * 7}
            </text>
          ))}
          {copy.marks.map((mark, i) => {
            const x = dayX(mark.day);
            // Above and below in turn, names running right from the mark. Within each side the earlier, closer mark sits
            // farther out, so a later mark's short leader never crosses its name.
            const above = i % 2 === 0;
            const far = above ? i % 4 === 0 : i % 4 !== 3;
            const reach = far ? 96 : 44;
            const k = clamp01((run - mark.day / copy.days) * 30);
            const dayY = above ? RULER.y - reach - 26 : RULER.y + 44 + reach - 26 + 34;
            return (
              <g key={mark.text} className={`is-mark${"salmon" in mark ? " is-salmon" : ""}`} style={vars({ "--k": k })}>
                <path d={above ? `M${x} ${RULER.y - 8}V${RULER.y - reach}` : `M${x} ${RULER.y + 44}V${RULER.y + 44 + reach - 30}`} />
                <text x={x - 1} y={dayY} className="is-day-label">
                  Day {mark.day}
                </text>
                <text x={x - 1} y={dayY + 18} className="is-mark-text">
                  {mark.text}
                </text>
              </g>
            );
          })}
        </svg>
        <Note e={en(t, 1.9, 2.2)}>{copy.foot}</Note>
      </div>
    </Scene>
  );
}

/* ------------------------------------------------------------ section */

function SceneNav({ p, goTo }: { p: number; goTo: (target: number) => void }) {
  return (
    <nav className={`earlypreview-market__nav ${DOEPHONE_DESKTOP_PAGE_INSET_X}`} aria-label="Go-to-market screens">
      {TIMING.map((scene, index) => {
        const live = p >= scene.start && (p < scene.start + scene.len || index === TIMING.length - 1);
        return (
          <button
            key={scene.id}
            type="button"
            className={`earlypreview-market__nav-item${live ? " is-live" : ""}`}
            style={vars({ "--f": ramp(p, [scene.start, scene.start + scene.len]) })}
            aria-current={live ? "step" : undefined}
            onClick={() => goTo(Math.min(END, scene.start + scene.len - FADE - 0.02))}
          >
            <span className="earlypreview-market__nav-line" aria-hidden />
            <span className="earlypreview-market__nav-label">{PLAN[scene.id].nav}</span>
          </button>
        );
      })}
    </nav>
  );
}

/** Progress as one screen sees it: held just outside its own span, so the memoized screens skip re-rendering there. */
function sceneP(p: number, id: SceneId) {
  const { start, len } = TIMING.find((scene) => scene.id === id)!;
  return Math.min(start + len + 0.001, Math.max(start - 0.001, p));
}

const Timeline = memo(TimelineScene);
const Events = memo(EventsScene);
const Agents = memo(AgentsScene);
const Journey = memo(JourneyScene);

/** The go-to-market, eight screens in the brown market section above “Expand through clinics.” */
export function EarlyPreviewPlanSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { p, skip, goTo } = useDoeHealthDesk2ScrollLock(sectionRef, END);

  return (
    <div className="earlypreview-market-track" style={vars({ "--market-run": END * DOEHEALTH_DESK2_PHONE_STEP_PX })}>
      <section ref={sectionRef} className="earlypreview-market earlypreview-plan doehealth-desk2-nav-wash-surface" aria-label="Go-to-market">
        <Timeline p={sceneP(p, "timeline")} />
        <Events p={sceneP(p, "events")} />
        <Agents p={sceneP(p, "agents")} />
        <Journey p={sceneP(p, "journey")} />
        <SceneNav p={p} goTo={goTo} />
        <SkipButton shown={p > 0 && p < END} label="Skip the go-to-market" onClick={skip} />
      </section>
    </div>
  );
}
