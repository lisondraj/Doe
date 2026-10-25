"use client";

import { type ReactNode, memo, useEffect, useRef } from "react";

import { DOEPHONE_DESKTOP_PAGE_INSET_X } from "@/lib/doephone/section-styles";
import {
  DOEHEALTH_DESK2_PHONE_STEP_PX,
  cssVars as vars,
  scrollRamp as ramp,
  useDoeHealthDesk2ScrollLock,
} from "@/lib/doehealthdesk2/use-doehealthdesk2-scroll-lock";
import { EARLYPREVIEW_PLAN as PLAN, EARLYPREVIEW_PLAN_QUARTERS as QUARTERS } from "@/lib/earlypreview/earlypreview-plan-copy";

/**
 * The go-to-market, above the enterprise section, in the market section's brown. The timeline first: supply, agents
 * and revenue side by side to Seed. Then the plan, one drawing a screen and none of them repeated: where potential
 * customers come from, the rooms we'll be in, the groups that bring most of the revenue, the agent pipeline, the page
 * that recruits a practice, one practice's first sixty days, and the way into a hospital. A faint dot field sits
 * behind each.
 */
const SCENES = [
  { id: "timeline", len: 2.8 },
  { id: "sources", len: 2.4 },
  { id: "events", len: 2.6 },
  { id: "groups", len: 2.4 },
  { id: "agents", len: 2.6 },
  { id: "loop", len: 2.4 },
  { id: "journey", len: 2.4 },
  { id: "systems", len: 2.6 },
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
      <SceneTitle title={copy.title} t={t} />
      <div className="earlypreview-market__body">
        {/* iPhone: each lane's Seed figure, big, over a cloud of dots that fills as the plan plays. */}
        <ol className="earlypreview-plan__seed-cards">
          {copy.lanes.map((lane, index) => (
            <li
              key={lane.id}
              className={`earlypreview-plan__seed-card is-${lane.id}`}
              style={vars({ "--e": en(t, 0.25 + index * 0.22, 0.75 + index * 0.22), "--k": en(t, 0.5 + index * 0.25, 1.9 + index * 0.25) })}
            >
              <span className="earlypreview-plan__seed-cloud" aria-hidden />
              <span className="earlypreview-plan__seed-head">
                <span className="earlypreview-plan__seed-name">{lane.name}</span>
                <span className="earlypreview-plan__seed-now">
                  {QUARTERS[lane.milestones[0].q]}: {lane.milestones[0].text}
                </span>
              </span>
              <span className="earlypreview-plan__seed-value">{lane.big.value}</span>
              <span className="earlypreview-plan__seed-line">
                <span className="earlypreview-plan__seed-unit">{lane.big.unit}</span>
                <span className="earlypreview-plan__seed-sub">{lane.big.sub}</span>
              </span>
            </li>
          ))}
        </ol>
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

/* ------------------------------------------------------------ 2. sources */

/**
 * Where potential customers come from, set like a printed index: a heading a kind of source, then each source, a
 * dotted leader drawn across, and what it gives us. Two columns, the groups filling in one after another.
 */
function SourcesScene({ p }: { p: number }) {
  const { o, t } = sceneClock(p, "sources");
  const copy = PLAN.sources;
  // Two columns: where we find them and who brings them on the left, where they gather and what pulls them on the right.
  const columns = [
    [copy.groups[0], copy.groups[2]],
    [copy.groups[1], copy.groups[3]],
  ];
  let row = 0;
  return (
    <Scene o={o} t={t} label="Every practice, found four different ways">
      <div className="earlypreview-plan__head">
        <SceneTitle title={copy.title} t={t} />
      </div>
      <div className="earlypreview-market__body">
        {/* iPhone: the four ways as four big cards, each a numeral over a cloud of dots, what it is, and who and where. */}
        <ol className="earlypreview-plan__channels">
          {copy.groups.map((group, index) => (
            <li
              key={group.id}
              className={`earlypreview-plan__channel is-${group.id}`}
              style={vars({ "--e": en(t, 0.3 + index * 0.22, 0.75 + index * 0.22) })}
            >
              <span className="earlypreview-plan__channel-cloud" aria-hidden />
              <span className="earlypreview-plan__channel-num">{`0${index + 1}`}</span>
              <span className="earlypreview-plan__channel-name">{group.name}</span>
              <span className="earlypreview-plan__channel-lede">{group.lede}</span>
              <span className="earlypreview-plan__channel-chips">
                {group.items.map((item) => (
                  <span key={item.name}>{item.name}</span>
                ))}
              </span>
            </li>
          ))}
        </ol>
        <p className="earlypreview-plan__channels-result" style={vars({ "--e": en(t, 1.5, 1.85) })}>
          <strong>{PLAN.sourcesResult.value}</strong>
          <span>
            {PLAN.sourcesResult.label}
            <em>{PLAN.sourcesResult.sub}</em>
          </span>
        </p>
        <div className="earlypreview-plan__directory">
          {columns.map((groups, c) => (
            <div key={c} className="earlypreview-plan__directory-col">
              {groups.map((group) => (
                <section key={group.id} className={`is-${group.id}`}>
                  <h3 style={vars({ "--e": en(t, 0.35 + row * 0.04, 0.6 + row * 0.04) })}>{group.name}</h3>
                  <ul>
                    {group.items.map((item) => {
                      row += 1;
                      const at = 0.4 + row * 0.06;
                      return (
                        <li key={item.name} style={vars({ "--e": en(t, at, at + 0.25), "--lead": en(t, at + 0.05, at + 0.35) })}>
                          <span className="earlypreview-plan__entry-name">{item.name}</span>
                          <span className="earlypreview-plan__entry-lead" aria-hidden />
                          <span className="earlypreview-plan__entry-gives">{item.gives}</span>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Scene>
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
      <div className="earlypreview-market__body earlypreview-plan__events">
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

/* ------------------------------------------------------------ 4. groups */

/** The tree: one group on the left, its locations in the middle, each location's providers on the right. */
const TREE = { rootX: 40, rootW: 190, siteX: 330, siteW: 150, provX: 580, top: 22, gap: 76, h: 40, prov: 13 } as const;
const SITE_Y = (s: number) => TREE.top + s * TREE.gap;
const ROOT_Y = (SITE_Y(0) + SITE_Y(PLAN.groups.sites - 1)) / 2;
/** An elbow from (x1, y1) to (x2, y2): across, a rounded turn, then across again. */
const elbow = (x1: number, y1: number, x2: number, y2: number) => {
  const mid = (x1 + x2) / 2;
  if (Math.abs(y2 - y1) < 1) return `M${x1} ${y1}H${x2}`;
  const r = Math.min(10, Math.abs(y2 - y1) / 2);
  const dir = y2 > y1 ? 1 : -1;
  return `M${x1} ${y1}H${mid - r}Q${mid} ${y1} ${mid} ${y1 + dir * r}V${y2 - dir * r}Q${mid} ${y2} ${mid + r} ${y2}H${x2}`;
};

/**
 * Multi-site groups as an org tree: one contract at the root, its four locations, three providers at each, drawn
 * branch by branch. Beside it, what groups add up to by Seed, and how we find and sell them.
 */
function GroupsScene({ p }: { p: number }) {
  const { o, t } = sceneClock(p, "groups");
  const copy = PLAN.groups;
  const root = en(t, 0.35, 0.6);
  return (
    <Scene o={o} t={t} label="One contract, twelve providers">
      <div className="earlypreview-plan__head">
        <div className="earlypreview-plan__title-desk">
          <SceneTitle title={copy.title} t={t} />
        </div>
        <div className="earlypreview-plan__title-phone">
          <SceneTitle title={copy.phone.title} t={t} />
        </div>
        <div className="earlypreview-plan__corner" style={vars({ "--e": en(t, 1.4, 1.7) })}>
          <p className="earlypreview-plan__corner-value">{copy.share.value}</p>
          <p className="earlypreview-plan__corner-label">{copy.share.label}</p>
        </div>
      </div>
      <div className="earlypreview-market__body earlypreview-plan__groups">
        {/* iPhone: the two kinds of practice the pre-seed plan is built on. */}
        <div className="earlypreview-plan__focus">
          <section className="earlypreview-plan__focus-card is-private" style={vars({ "--e": en(t, 0.3, 0.7) })}>
            <span className="earlypreview-plan__channel-cloud" aria-hidden />
            <span className="earlypreview-plan__seed-name">{copy.phone.private.name}</span>
            <span className="earlypreview-plan__focus-value">{copy.phone.private.value}</span>
            <span className="earlypreview-plan__focus-label">{copy.phone.private.label}</span>
            <span className="earlypreview-plan__focus-note">{copy.phone.private.note}</span>
            <span className="earlypreview-plan__channel-chips">
              {copy.phone.private.types.map((type) => (
                <span key={type}>{type}</span>
              ))}
            </span>
          </section>
          <section className="earlypreview-plan__focus-card is-multi" style={vars({ "--e": en(t, 0.7, 1.1) })}>
            <span className="earlypreview-plan__channel-cloud" aria-hidden />
            <span className="earlypreview-plan__seed-name">{copy.phone.multi.name}</span>
            <span className="earlypreview-plan__focus-value">{copy.share.value}</span>
            <span className="earlypreview-plan__focus-label">{copy.share.label}</span>
            <span className="earlypreview-plan__focus-note">{copy.phone.multi.note}</span>
            <svg className="earlypreview-plan__focus-tree" viewBox="0 0 320 70" fill="none" aria-hidden>
              <rect x="2" y="26" width="46" height="18" rx="9" pathLength={1} className="is-root" style={draw(en(t, 0.9, 1.1))} />
              {range(copy.sites).map((s) => (
                <g key={s}>
                  <rect x={86 + s * 58} y="26" width="46" height="18" rx="9" pathLength={1} className="is-site" style={draw(en(t, 1.0 + s * 0.12, 1.35 + s * 0.12))} />
                  <path d={`M48 35H${86 + s * 58}`} pathLength={1} className="is-branch" style={draw(en(t, 1.0 + s * 0.12, 1.35 + s * 0.12))} />
                  {range(copy.perSite).map((v) => (
                    <circle key={v} cx={96 + s * 58 + v * 12} cy={57} r={3.2} className="is-provider" style={vars({ "--k": en(t, 1.3 + s * 0.1 + v * 0.04, 1.5 + s * 0.1 + v * 0.04) })} />
                  ))}
                </g>
              ))}
            </svg>
            <ul className="earlypreview-plan__focus-figures">
              {copy.figures.map((figure) => (
                <li key={figure.id}>
                  <strong>{figure.value}</strong>
                  {figure.label}
                </li>
              ))}
            </ul>
          </section>
        </div>
        <svg className="earlypreview-plan__tree" viewBox="0 0 700 300" fill="none" aria-hidden>
          <rect x={TREE.rootX} y={ROOT_Y - TREE.h / 2} width={TREE.rootW} height={TREE.h} rx={8} pathLength={1} className="is-root" style={draw(root)} />
          <text x={TREE.rootX + TREE.rootW / 2} y={ROOT_Y + 5} className="is-root-name" style={vars({ "--k": root })}>
            {copy.root}
          </text>
          {range(copy.sites).map((s) => {
            const at = 0.55 + s * 0.12;
            const y = SITE_Y(s);
            return (
              <g key={s}>
                <path d={elbow(TREE.rootX + TREE.rootW, ROOT_Y, TREE.siteX, y)} pathLength={1} className="is-branch" style={draw(en(t, at, at + 0.2))} />
                <rect x={TREE.siteX} y={y - TREE.h / 2} width={TREE.siteW} height={TREE.h} rx={8} pathLength={1} className="is-site" style={draw(en(t, at + 0.12, at + 0.3))} />
                <text x={TREE.siteX + TREE.siteW / 2} y={y + 5} className="is-site-name" style={vars({ "--k": en(t, at + 0.2, at + 0.35) })}>
                  {copy.site} {s + 1}
                </text>
                {range(copy.perSite).map((v) => {
                  const py = y + (v - 1) * 21;
                  const pat = at + 0.3 + v * 0.05;
                  return (
                    <g key={v}>
                      <path d={elbow(TREE.siteX + TREE.siteW, y, TREE.provX, py)} pathLength={1} className="is-branch is-fine" style={draw(en(t, pat, pat + 0.15))} />
                      <rect
                        x={TREE.provX}
                        y={py - TREE.prov / 2}
                        width={TREE.prov}
                        height={TREE.prov}
                        rx={5}
                        className="is-provider"
                        style={vars({ "--k": en(t, pat + 0.1, pat + 0.2) })}
                      />
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>
        <div className="earlypreview-plan__group-copy">
          <ul className="earlypreview-plan__group-figures" style={vars({ "--e": en(t, 1.2, 1.5) })}>
            {copy.figures.map((figure) => (
              <li key={figure.id}>
                <strong>{figure.value}</strong>
                {figure.label}
              </li>
            ))}
          </ul>
          <dl className="earlypreview-plan__group-how">
            {copy.how.map((item, i) => (
              <div key={item.lead} style={vars({ "--e": en(t, 1.5 + i * 0.1, 1.8 + i * 0.1) })}>
                <dt>{item.lead}</dt>
                <dd>{item.text}</dd>
              </div>
            ))}
          </dl>
        </div>
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
      <div className="earlypreview-market__body earlypreview-plan__board-wrap">
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

/* ------------------------------------------------------------ 6. loop */

/** When the page is claimed, on the screen's clock. */
const CLAIM = [1.25, 1.55] as const;

/**
 * The loop on the practice's own Doe page, drawn as a plain wireframe. Unclaimed, its rows are hatched blanks and a
 * salmon line counts the agent requests it couldn't answer. Then it's claimed: the badge flips, the rows fill in one
 * by one, and the line becomes "Bookable by agents". Beside it, the three moments, each lit in turn.
 */
function LoopScene({ p }: { p: number }) {
  const { o, t } = sceneClock(p, "loop");
  const copy = PLAN.loop;
  const page = copy.page;
  const claim = en(t, CLAIM[0], CLAIM[1]);
  const claimed = claim >= 0.5;
  const stage = t < 0.95 ? 0 : t < CLAIM[0] ? 1 : 2;
  return (
    <Scene o={o} t={t} label="Every missed request recruits a practice">
      <div className="earlypreview-plan__head">
        <SceneTitle title={copy.title} t={t} />
        <div className="earlypreview-plan__corner" style={vars({ "--e": en(t, 1.7, 2.0) })}>
          <p className="earlypreview-plan__corner-value">{copy.stat.value}</p>
          <p className="earlypreview-plan__corner-label">{copy.stat.caption}</p>
        </div>
      </div>
      <div className="earlypreview-market__body earlypreview-plan__loop">
        <article className={`earlypreview-plan__page${claimed ? " is-claimed" : ""}`} style={vars({ "--e": en(t, 0.3, 0.6) })}>
          <header>
            <span>
              <span className="earlypreview-plan__page-name">{page.name}</span>
              <span className="earlypreview-plan__page-place">{page.place}</span>
            </span>
            <span className="earlypreview-plan__page-badge">{claimed ? page.claimed : page.unclaimed}</span>
          </header>
          <p className="earlypreview-plan__page-alert">
            {claimed ? (
              page.bookable
            ) : (
              <>
                <strong>
                  <Count value={page.missed} k={en(t, 0.5, 1.1)} />
                </strong>{" "}
                {page.missedLine}
              </>
            )}
          </p>
          <dl>
            {page.rows.map((row, i) => {
              const fill = en(t, CLAIM[1] + i * 0.07, CLAIM[1] + 0.15 + i * 0.07);
              return (
                <div key={row.label} style={vars({ "--f": fill })}>
                  <dt>{row.label}</dt>
                  <dd>
                    <span className="earlypreview-plan__page-blank" aria-hidden />
                    <span className="earlypreview-plan__page-value">{row.value}</span>
                  </dd>
                </div>
              );
            })}
          </dl>
        </article>
        <ol className="earlypreview-plan__stages">
          {copy.stages.map((item, i) => (
            <li key={item.lead} className={i === stage ? "is-now" : i < stage ? "is-done" : undefined} style={vars({ "--e": en(t, 0.45 + i * 0.12, 0.7 + i * 0.12) })}>
              <span className="earlypreview-plan__stage-lead">{item.lead}</span>
              <span className="earlypreview-plan__stage-text">{item.text}</span>
            </li>
          ))}
        </ol>
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
        <SceneTitle title={copy.title} t={t} />
        <div className="earlypreview-plan__corner" style={vars({ "--e": en(t, 1.6, 1.9) })}>
          <p className="earlypreview-plan__corner-value">{copy.stat.value}</p>
          <p className="earlypreview-plan__corner-label">{copy.stat.caption}</p>
        </div>
      </div>
      <div className="earlypreview-market__body earlypreview-plan__journey">
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

/* ------------------------------------------------------------ 8. health systems */

/** The hospital in section: seven floors, a row of windows on each, standing on its ground line. */
const BUILDING = { x: 70, w: 500, top: 20, floor: 40, windows: 8, win: 34, winH: 14 } as const;
const FLOOR_Y = (f: number) => BUILDING.top + (PLAN.systems.floors.length - 1 - f) * BUILDING.floor;
const BUILDING_BOTTOM = BUILDING.top + PLAN.systems.floors.length * BUILDING.floor;
const WINDOW_X = (w: number) => BUILDING.x + 170 + w * ((BUILDING.w - 186) / BUILDING.windows);

/** How lit each floor's windows are at each step: one window, the champion's floor, the pilots, then all of it. */
function floorLight(step: number, f: number, w: number) {
  const [first, second] = PLAN.systems.pilotFloors;
  if (step >= 6) return f === first || f === second ? 2 : 1;
  if (step >= 5) return f === first || f === second ? 2 : 0;
  if (step >= 2) return f === first ? 1 : 0;
  if (step >= 1) return f === first && w < 3 ? 1 : 0;
  if (step >= 0) return f === first && w === 0 ? 1 : 0;
  return 0;
}

/**
 * The way into a health system, on a hospital drawn in section. The steps run down the right; as each is reached the
 * building lights a little more: one window for the person inside, part of a floor for the champion, the floor for
 * the workflow, two floors in salmon for the pilots by Seed, and every floor once it goes system-wide.
 */
function SystemsScene({ p }: { p: number }) {
  const { o, t } = sceneClock(p, "systems");
  const copy = PLAN.systems;
  const progress = ramp(t, [0.55, 2.15]) * copy.steps.length;
  const step = Math.min(copy.steps.length - 1, Math.floor(progress) - (progress <= 0 ? 1 : 0));
  return (
    <Scene o={o} t={t} label="Practices first, then the health system">
      <div className="earlypreview-plan__head">
        <SceneTitle title={copy.title} t={t} />
      </div>
      <div className="earlypreview-market__body earlypreview-plan__systems">
        <svg className="earlypreview-plan__hospital" viewBox="0 0 640 310" fill="none" aria-hidden>
          <path
            d={`M${BUILDING.x - 30} ${BUILDING_BOTTOM}H${BUILDING.x + BUILDING.w + 30}M${BUILDING.x} ${BUILDING_BOTTOM}V${BUILDING.top}H${BUILDING.x + BUILDING.w}V${BUILDING_BOTTOM}`}
            pathLength={1}
            className="is-shell"
            style={draw(en(t, 0.25, 0.6))}
          />
          {copy.floors.map((floor, f) => {
            const y = FLOOR_Y(f);
            return (
              <g key={floor} style={vars({ "--k": en(t, 0.35 + f * 0.04, 0.6 + f * 0.04) })}>
                {f > 0 ? <path d={`M${BUILDING.x} ${y + BUILDING.floor}H${BUILDING.x + BUILDING.w}`} className="is-slab" /> : null}
                <text x={BUILDING.x + 16} y={y + BUILDING.floor / 2 + 5} className="is-floor-name">
                  {floor}
                </text>
                {range(BUILDING.windows).map((w) => {
                  const light = floorLight(step, f, w);
                  return (
                    <rect
                      key={w}
                      x={fixed(WINDOW_X(w))}
                      y={fixed(y + (BUILDING.floor - BUILDING.winH) / 2)}
                      width={BUILDING.win - 8}
                      height={BUILDING.winH}
                      rx={2}
                      className={light === 2 ? "is-pilot" : light === 1 ? "is-lit" : "is-dark"}
                    />
                  );
                })}
              </g>
            );
          })}
        </svg>
        <ol className="earlypreview-plan__climb">
          {copy.steps.map((item, i) => (
            <li
              key={item.name}
              className={`${i === step ? "is-now" : i < step ? "is-done" : ""}${"salmon" in item ? " is-salmon" : ""}`}
              style={vars({ "--e": en(t, 0.4 + i * 0.05, 0.65 + i * 0.05) })}
            >
              <span className="earlypreview-plan__climb-when">{item.when}</span>
              <span className="earlypreview-plan__climb-name">{item.name}</span>
            </li>
          ))}
        </ol>
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
const Sources = memo(SourcesScene);
const Events = memo(EventsScene);
const Groups = memo(GroupsScene);
const Agents = memo(AgentsScene);
const Loop = memo(LoopScene);
const Journey = memo(JourneyScene);
const Systems = memo(SystemsScene);

/** The go-to-market, eight screens in the brown market section above “Expand through clinics.” */
export function EarlyPreviewPlanSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { p, skip, goTo } = useDoeHealthDesk2ScrollLock(sectionRef, END);

  return (
    <div className="earlypreview-market-track" style={vars({ "--market-run": END * DOEHEALTH_DESK2_PHONE_STEP_PX })}>
      <section ref={sectionRef} className="earlypreview-market earlypreview-plan doehealth-desk2-nav-wash-surface" aria-label="Go-to-market">
        <Timeline p={sceneP(p, "timeline")} />
        <Sources p={sceneP(p, "sources")} />
        <Events p={sceneP(p, "events")} />
        <Groups p={sceneP(p, "groups")} />
        <Agents p={sceneP(p, "agents")} />
        <Loop p={sceneP(p, "loop")} />
        <Journey p={sceneP(p, "journey")} />
        <Systems p={sceneP(p, "systems")} />
        <SceneNav p={p} goTo={goTo} />
        {p > 0 && p < END ? (
          <button type="button" className="doehealth-desk2-visible__skip" aria-label="Skip the go-to-market" onClick={skip}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M7 5.5 13 12 7 18.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16.35 5.5v13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </button>
        ) : null}
      </section>
    </div>
  );
}
