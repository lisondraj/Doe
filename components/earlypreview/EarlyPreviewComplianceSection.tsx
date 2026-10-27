"use client";

import { SkipButton } from "@/components/doehealth-desk2/DoeHealthDesk2AudienceSection";
import { type ReactNode, memo, useEffect, useRef, useState } from "react";

import { DOEPHONE_DESKTOP_PAGE_INSET_X } from "@/lib/doephone/section-styles";
import {
  DOEHEALTH_DESK2_PHONE_STEP_PX,
  cssVars as vars,
  scrollRamp as ramp,
  useDoeHealthDesk2ScrollLock,
} from "@/lib/doehealthdesk2/use-doehealthdesk2-scroll-lock";
import {
  EARLYPREVIEW_COMPLIANCE_EVALS as EVALS,
  EARLYPREVIEW_COMPLIANCE_INCIDENTS as INCIDENTS,
  EARLYPREVIEW_COMPLIANCE_LEVELS as LEVELS,
  EARLYPREVIEW_COMPLIANCE_OVERVIEW as OVERVIEW,
  EARLYPREVIEW_COMPLIANCE_PATH as PATH,
  EARLYPREVIEW_COMPLIANCE_PROTOCOL as PROTOCOL,
} from "@/lib/earlypreview/earlypreview-compliance-copy";

/**
 * Security and compliance through Seed, for investors, in five screens the scroll plays: the six pieces of the
 * protocol as cards that slide by, the protocol's seven layers and its release log, improving with every frontier model and paper, the
 * evals that keep an agent's permissions, an incident from the first second to HIPAA's limit, and the staircase of
 * what Doe is cleared to handle, quarter by quarter, up to Seed.
 */
const SLIDES = [
  { id: "overview", nav: OVERVIEW.nav, len: 3.6 },
  { id: "protocol", nav: PROTOCOL.nav, len: 2.9 },
  { id: "evals", nav: EVALS.nav, len: 3.4 },
  { id: "incidents", nav: INCIDENTS.nav, len: 2.7 },
  { id: "path", nav: PATH.nav, len: 4.4 },
] as const;

const FADE = 0.28;
const TIMING = SLIDES.map((slide, index) => {
  const start = SLIDES.slice(0, index).reduce((sum, item) => sum + item.len, 0);
  return { ...slide, start };
});
const END = TIMING[TIMING.length - 1].start + TIMING[TIMING.length - 1].len;

const smooth = (t: number) => t * t * (3 - 2 * t);
const en = (t: number, a: number, b: number) => smooth(ramp(t, [a, b]));
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
/** 0 → 1 as `t` moves through [k, k + w]: one stroke's share of a drawing's progress. */
const seg = (t: number, k: number, w: number) => clamp01((t - k) / w);
/** Style for a stroke traced in by CSS (pathLength 1, dash offset from --draw). */
const draw = (value: number) => vars({ "--draw": value });

function sceneClock(p: number, index: number) {
  const { start, len } = TIMING[index];
  const fadeIn = index === 0 ? 1 : ramp(p, [start, start + FADE]);
  const fadeOut = index === TIMING.length - 1 ? 1 : 1 - ramp(p, [start + len - FADE, start + len]);
  return { o: fadeIn * fadeOut, t: p - start };
}

function Scene({
  o,
  label,
  className = "",
  children,
}: {
  o: number;
  label: string;
  className?: string;
  children: ReactNode;
}) {
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
      className={`earlypreview-market__scene ${DOEPHONE_DESKTOP_PAGE_INSET_X} ${className}${live ? " is-live" : ""}${o <= 0.001 ? " is-gone" : ""}`}
      style={vars({ "--o": o })}
    >
      {children}
    </div>
  );
}

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

/** The one small line some screens keep under their drawing, its middle in salmon. */
function Foot({ e, line }: { e: number; line: { lead: string; strong: string; tail: string } }) {
  return (
    <p className="earlypreview-compliance__foot" style={vars({ "--e": e })}>
      {line.lead}
      <strong>{line.strong}</strong>
      {line.tail}
    </p>
  );
}

/** A counted figure, drawn by the market section's counter so the layout never sees the digits change. */
function Count({ value }: { value: number }) {
  return (
    <>
      <span className="sr-only">{value}</span>
      <span className="earlypreview-market__count" style={vars({ "--v": value })} aria-hidden />
    </>
  );
}

/** iPhone: whether the page is the phone layout, read once mounted. */
function usePhoneLayout(ref: { current: HTMLElement | null }) {
  const [phone, setPhone] = useState(false);
  useEffect(() => {
    setPhone(!!ref.current?.closest(".doehealth-desk2-page")?.querySelector(".doephone-mobile-root"));
  }, [ref]);
  return phone;
}

type SceneProps = { p: number; phone: boolean };

/* ------------------------------------------------------------ 1 · overview */

type CardArt = (typeof OVERVIEW.cards)[number]["art"];

/** The fields drawing: a record of dots, and the six that leave it for the column on the right. */
const FIELD_GRID = { cols: 11, rows: 6, pitch: 13, x: 16, y: 32 } as const;
const FIELD_PICKS = [4, 13, 25, 31, 46, 58] as const;

/** One card's drawing in dots and lines, built by --d (0 → 1) in CSS so the scroll never re-renders its dots. */
const CardArtwork = memo(function CardArtwork({ art }: { art: CardArt }) {
  switch (art) {
    case "grant":
      return (
        <>
          {Array.from({ length: 7 }, (_, i) => (
            <g key={i} style={vars({ "--j": i })}>
              <circle cx={30 + i * 30} cy={70} r={9} className="is-ring" />
              <circle cx={30 + i * 30} cy={70} r={9} className="is-grant" />
            </g>
          ))}
        </>
      );
    case "fields":
      return (
        <>
          {Array.from({ length: FIELD_GRID.cols * FIELD_GRID.rows }, (_, i) => {
            const x = FIELD_GRID.x + (i % FIELD_GRID.cols) * FIELD_GRID.pitch;
            const y = FIELD_GRID.y + Math.floor(i / FIELD_GRID.cols) * FIELD_GRID.pitch;
            const f = FIELD_PICKS.indexOf(i as (typeof FIELD_PICKS)[number]);
            if (f < 0) return <circle key={i} cx={x} cy={y} r={3.4} className="is-rest" style={vars({ "--j": i })} />;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={4.2}
                className="is-pick"
                style={vars({ "--j": i, "--f": f, "--dx": 214 - x, "--dy": 30 + f * 15 - y })}
              />
            );
          })}
        </>
      );
    case "matrix":
      return (
        <>
          {Array.from({ length: 14 * 7 }, (_, i) => {
            const c = i % 14;
            const r = Math.floor(i / 14);
            return <circle key={i} cx={22 + c * 15} cy={26 + r * 15} r={3.4} className={c === 9 && r === 3 ? "is-fail" : "is-run"} style={vars({ "--c": c })} />;
          })}
        </>
      );
    case "ledger":
      return (
        <>
          {[176, 132, 190, 150, 118, 168, 140].map((length, i) => (
            <g key={i} style={vars({ "--j": i })}>
              <circle cx={24} cy={22 + i * 16} r={4} className={i === 2 ? "is-mark is-salmon" : "is-mark"} />
              <path d={`M38 ${22 + i * 16}h${length}`} className="is-entry" />
            </g>
          ))}
        </>
      );
    case "tenants":
      return (
        <>
          {Array.from({ length: 6 }, (_, i) => {
            const x = 14 + (i % 3) * 74;
            const y = 22 + Math.floor(i / 3) * 56;
            return (
              <g key={i} style={vars({ "--j": i })}>
                <rect x={x} y={y} width={64} height={46} rx={10} className="is-wall" />
                {Array.from({ length: 6 }, (_, k) => (
                  <circle key={k} cx={x + 16 + (k % 3) * 16} cy={y + 15 + Math.floor(k / 3) * 16} r={3.2} className="is-inside" />
                ))}
              </g>
            );
          })}
        </>
      );
    case "stairs":
      return (
        <>
          {[0, 1, 2, 3].flatMap((c) =>
            Array.from({ length: 3 * (c + 1) * 2 }, (_, k) => (
              <circle
                key={`${c}-${k}`}
                cx={32 + c * 52 + (k % 3) * 13}
                cy={124 - Math.floor(k / 3) * 13}
                r={3.6}
                className={c === 3 ? "is-step is-salmon" : "is-step"}
                style={vars({ "--c": c })}
              />
            )),
          )}
        </>
      );
  }
});

/** The card track's step (one card and its gap) and how far it can move before its last card meets the edge. */
function useTrackMetrics(trackRef: { current: HTMLElement | null }) {
  const [metrics, setMetrics] = useState({ step: 0, max: 0 });
  useEffect(() => {
    const track = trackRef.current;
    const frame = track?.parentElement;
    if (!track || !frame) return undefined;
    const measure = () => {
      const [first, second] = Array.from(track.children) as HTMLElement[];
      const step = first && second ? second.offsetLeft - first.offsetLeft : 0;
      const max = Math.max(0, track.scrollWidth - frame.clientWidth);
      setMetrics((prev) => (prev.step === step && prev.max === max ? prev : { step, max }));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [trackRef]);
  return metrics;
}

/** Where the focus walks the cards on the screen's clock. */
const FOCUS = [0.95, 3.25] as const;

/**
 * The overview: the protocol's six pieces as cards that slide by one at a time. The focus rests on a card, then
 * moves to the next; the focused card is fully lit at the page edge and builds its drawing, the rest wait dimmed
 * beside it. Each card leads with its drawing and one figure; the quarter it lands in sits in its corner.
 */
function OverviewScene({ p, phone }: SceneProps) {
  const { o, t } = sceneClock(p, 0);
  const trackRef = useRef<HTMLOListElement>(null);
  const { step, max } = useTrackMetrics(trackRef);
  const count = OVERVIEW.cards.length;
  const u = ramp(t, FOCUS) * (count - 1);
  const base = Math.floor(u);
  // Rest on each card for the first part of its share of the scroll, then move to the next.
  const focus = Math.min(count - 1, base + smooth(clamp01((u - base - 0.4) / 0.6)));
  return (
    <Scene o={o} label="Six pieces, one protocol">
      <SceneTitle title={OVERVIEW.title} t={t} />
      <div className="earlypreview-market__body">
        <div className="earlypreview-compliance__deck">
          <ol ref={trackRef} className="earlypreview-compliance__cards" style={{ transform: `translateX(${-Math.min(focus * step, max)}px)` }}>
            {OVERVIEW.cards.map((card, i) => {
              const near = clamp01(1 - Math.abs(focus - i));
              // iPhone: a card's dots keep moving with the scroll, building as it slides in and coming apart as it
              // leaves, so every card plays its drawing rather than holding a finished one.
              const built = phone
                ? smooth(Math.min(i === 0 ? en(t, 0.55, 1.05) : clamp01(u - i + 1), i === count - 1 ? 1 : 1 - clamp01((u - i - 0.4) / 0.8)))
                : i === 0
                  ? en(t, 0.55, 1.05)
                  : clamp01((focus - i + 0.6) / 0.6);
              return (
                <li
                  key={card.id}
                  className="earlypreview-compliance__card"
                  style={vars({ "--e": en(t, 0.35 + i * 0.06, 0.65 + i * 0.06), "--a": near })}
                  aria-current={near > 0.5 ? "true" : undefined}
                >
                  <span className="earlypreview-compliance__card-when">{card.when}</span>
                  <svg className={`earlypreview-compliance__card-art is-${card.art}`} viewBox="0 0 240 140" fill="none" style={vars({ "--d": built })} aria-hidden>
                    <CardArtwork art={card.art} />
                  </svg>
                  <h3 className="earlypreview-compliance__card-name">{card.name}</h3>
                  <p className="earlypreview-compliance__card-line">{card.line}</p>
                  <p className="earlypreview-compliance__card-figure">
                    <strong>{card.figure}</strong>
                    <span>{card.caption}</span>
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </Scene>
  );
}

/* ------------------------------------------------------------ 2 · protocol */

const hitsLayer = (u: number, id: string) => (PROTOCOL.updates[u].hits as readonly string[]).includes(id);
/** Day one, then each update: the grid's columns, and where on the screen's clock each one comes in. */
const COLUMNS = [{ id: "start", event: PROTOCOL.start }, ...PROTOCOL.updates];
const COLUMN_AT = (c: number) => 0.55 + c * 0.28;

/**
 * The protocol as a grid of fine lines: a row a layer, a column for day one and for each time AI moves. Day one puts
 * a point on every layer; each update puts a salmon point on the layers it changes. The columns come in left to right
 * with the scroll, and each row counts how often its layer has improved.
 */
function ProtocolScene({ p }: SceneProps) {
  const { o, t } = sceneClock(p, 1);
  const shown = COLUMNS.map((_, c) => en(t, COLUMN_AT(c), COLUMN_AT(c) + 0.22));
  return (
    <Scene o={o} label="The Doe Health Intelligence Protocol">
      <div className="earlypreview-market__plans-head">
        <SceneTitle title={PROTOCOL.title} t={t} />
        <aside className="earlypreview-compliance__stat" style={vars({ "--e": en(t, 0.45, 0.75) })}>
          <span className="earlypreview-compliance__stat-value">{PROTOCOL.stat.value}</span>
          <span className="earlypreview-compliance__stat-caption">{PROTOCOL.stat.caption}</span>
        </aside>
      </div>
      <div className="earlypreview-market__body">
        <div className="earlypreview-compliance__grid" role="table" aria-label="The protocol's layers, and the updates that changed each" style={vars({ "--n": COLUMNS.length })}>
          <div className="earlypreview-compliance__grid-row is-head" role="row" style={vars({ "--e": en(t, 0.3, 0.55) })}>
            <span role="columnheader" className="earlypreview-compliance__grid-corner">
              {PROTOCOL.moves}
            </span>
            {COLUMNS.map((column, c) => (
              <span key={column.id} role="columnheader" className={c === 0 ? "is-start" : undefined} style={vars({ "--e": shown[c] })}>
                {column.event}
              </span>
            ))}
            <span role="columnheader" className="earlypreview-compliance__grid-count">
              {PROTOCOL.count}
            </span>
          </div>
          {PROTOCOL.layers.map((layer, i) => {
            const count = PROTOCOL.updates.filter((_, u) => hitsLayer(u, layer.id) && shown[u + 1] > 0.5).length;
            return (
              <div key={layer.id} className="earlypreview-compliance__grid-row" role="row" style={vars({ "--e": en(t, 0.32 + i * 0.04, 0.6 + i * 0.04) })}>
                <span role="rowheader" className="earlypreview-compliance__grid-layer">
                  <span className="earlypreview-compliance__grid-name">{layer.name}</span>
                  <span className="earlypreview-compliance__grid-detail">{layer.detail}</span>
                </span>
                {COLUMNS.map((column, c) => {
                  const hit = c > 0 && hitsLayer(c - 1, layer.id);
                  return (
                    <span
                      key={column.id}
                      role="cell"
                      className={`earlypreview-compliance__grid-cell${c === 0 ? " is-start" : hit ? " is-hit" : ""}`}
                      style={vars({ "--e": shown[c] })}
                    >
                      <i aria-hidden />
                      {hit ? <span className="sr-only">Changed</span> : null}
                    </span>
                  );
                })}
                <span role="cell" className="earlypreview-compliance__grid-count">
                  {count > 0 ? `${count}×` : ""}
                </span>
              </div>
            );
          })}
        </div>
        <Foot e={en(t, 2.3, 2.55)} line={PROTOCOL.foot} />
      </div>
    </Scene>
  );
}

/* ------------------------------------------------------------ 3 · evals */

/**
 * The matrix's layout. The desktop runs 36 times across a wide drawing. The iPhone runs 12 times in a drawing about as
 * wide as the screen, so the dots and labels are drawn near full size, and Model B comes (and fails) a quarter of the
 * way in instead of past a third, its warning held for three runs.
 */
type EvalGeometry = {
  runs: number;
  x: number;
  y: number;
  pitch: number;
  row: number;
  r: number;
  lane: { y: number; gap: number };
  width: number;
  height: number;
  events: readonly { col: number; label: string }[];
  /** The checks each failing run fails: injected pages lead to PHI leaking out. */
  fails: Record<number, readonly number[]>;
  /** Where the clock runs the columns. */
  clock: readonly [number, number];
};

const EVAL_DESK: EvalGeometry = {
  runs: 36,
  x: 186,
  y: 50,
  pitch: 22.6,
  row: 15,
  r: 3.6,
  lane: { y: 254, gap: 17 },
  width: 1000,
  height: 316,
  events: [
    { col: 0, label: "Model A" },
    { col: 14, label: "Model B" },
    { col: 26, label: "New tool" },
  ],
  fails: { 14: [1, 5], 15: [5] },
  clock: [0.45, 2.95],
};

const EVAL_PHONE: EvalGeometry = {
  runs: 12,
  x: 122,
  y: 46,
  pitch: 19,
  row: 16,
  r: 4.4,
  lane: { y: 260, gap: 19 },
  width: 352,
  height: 330,
  events: [
    { col: 0, label: "Model A" },
    { col: 3, label: "Model B" },
    { col: 8, label: "New tool" },
  ],
  fails: { 3: [1, 5], 4: [5], 5: [5] },
  clock: [0.3, 2.9],
};

const firstFail = (g: EvalGeometry) => Math.min(...Object.keys(g.fails).map(Number));
const failRuns = (g: EvalGeometry) => Object.keys(g.fails).length;

const EvalDots = memo(function EvalDots({ g }: { g: EvalGeometry }) {
  return (
    <>
      {EVALS.attacks.map((attack, r) =>
        Array.from({ length: g.runs }, (_, c) => {
          const cx = g.x + c * g.pitch;
          const cy = g.y + r * g.row;
          const fail = g.fails[c]?.includes(r);
          return (
            <g key={`${attack}-${c}`} style={vars({ "--c": c })}>
              <circle cx={cx} cy={cy} r={g.r} className="is-base" />
              <circle cx={cx} cy={cy} r={fail ? g.r + 1.4 : g.r} className={fail ? "is-fail" : "is-pass"} />
            </g>
          );
        }),
      )}
      {EVALS.lanes.map((lane, l) =>
        Array.from({ length: g.runs }, (_, c) => (
          <path
            key={`${lane.label}-${c}`}
            d={`M${g.x + c * g.pitch - g.pitch / 2 + 1.5} ${g.lane.y + l * g.lane.gap}h${g.pitch - 3}`}
            className={lane.risky && c in g.fails ? "is-lane is-off" : "is-lane"}
            style={vars({ "--c": c })}
          />
        )),
      )}
    </>
  );
});

/**
 * Continuous evals wired to permissions. Each run throws twelve attacks at the agent; a new model or a new tool sweeps
 * a retest down the column. Model B fails, its risky permissions break off in the lanes below at once, and they come
 * back only when it passes. The corner keeps the verdict and the count of attacks run.
 */
function EvalsScene({ p, phone }: SceneProps) {
  const { o, t } = sceneClock(p, 2);
  const g = phone ? EVAL_PHONE : EVAL_DESK;
  const FIRST_FAIL = firstFail(g);
  const failedRows = new Set(Object.values(g.fails).flat());
  const laneEnd = g.lane.y + (EVALS.lanes.length - 1) * g.lane.gap;
  const run = ramp(t, g.clock) * g.runs;
  const done = Math.floor(run);
  const failing = done > FIRST_FAIL && done <= FIRST_FAIL + failRuns(g);
  const status =
    done <= FIRST_FAIL
      ? { word: "Passing", note: "Model A, all twelve" }
      : failing
        ? { word: "Failing", note: "Model B, PHI leakage" }
        : done <= g.events[2].col
          ? { word: "Passing", note: "Model B, fixed and restored" }
          : { word: "Passing", note: "New tool, retested" };
  return (
    <Scene o={o} label="Permissions are earned">
      <div className="earlypreview-market__plans-head">
        <SceneTitle title={EVALS.title} t={t} />
        <aside className={`earlypreview-compliance__status${failing ? " is-fail" : ""}`} style={vars({ "--e": en(t, 0.4, 0.7) })}>
          <span className="earlypreview-compliance__status-word">{status.word}</span>
          <span className="earlypreview-compliance__status-note">{status.note}</span>
          <span className="earlypreview-compliance__status-count">
            <Count value={Math.min(done, g.runs) * EVALS.attacks.length} /> {EVALS.runsLabel}
          </span>
        </aside>
      </div>
      <div className="earlypreview-market__body">
        <svg
          className="earlypreview-compliance__art earlypreview-compliance__matrix"
          viewBox={`0 0 ${g.width} ${g.height}`}
          fill="none"
          style={vars({ "--run": run, "--e": en(t, 0.3, 0.55) })}
          aria-hidden
        >
          {g.events
            .filter((event) => event.col > 0)
            .map((event) => (
              <rect
                key={event.label}
                x={g.x + event.col * g.pitch - g.pitch / 2}
                y={g.y - 10}
                width={g.pitch}
                height={laneEnd - g.y + 20}
                rx={g.pitch / 2}
                className="is-sweep"
                style={vars({ "--k": clamp01(1 - Math.abs(run - event.col - 0.5) * 1.4) })}
              />
            ))}
          {EVALS.attacks.map((attack, r) => (
            <text key={attack} x={g.x - 16} y={g.y + r * g.row + 4} className={`is-label${failing && failedRows.has(r) ? " is-failing" : ""}`}>
              {attack}
            </text>
          ))}
          {EVALS.lanes.map((lane, l) => (
            <text
              key={lane.label}
              x={g.x - 16}
              y={g.lane.y + l * g.lane.gap + 4}
              className={`is-label is-lane-label${failing && lane.risky ? " is-failing" : ""}`}
            >
              {lane.label}
            </text>
          ))}
          <EvalDots g={g} />
          {EVALS.lanes.map((lane, l) =>
            lane.risky ? (
              <text
                key={lane.label}
                x={g.x + FIRST_FAIL * g.pitch - g.pitch / 2}
                y={g.lane.y + l * g.lane.gap - 5}
                className="is-suspended"
                style={vars({ "--k": clamp01((run - FIRST_FAIL - 1) * 2) })}
              >
                {EVALS.suspended}
              </text>
            ) : null,
          )}
          {g.events.map((event) => {
            const x = g.x + event.col * g.pitch - g.pitch / 2;
            const k = clamp01((run - event.col) * 2);
            return (
              <g key={event.label} className={`is-event${event.col === 0 ? " is-first" : ""}`} style={vars({ "--k": k })}>
                <path d={`M${x} ${g.y - 14}V${laneEnd + 8}`} pathLength={1} style={draw(k)} />
                <text x={x + 6} y={g.y - 22}>
                  {event.label}
                </text>
              </g>
            );
          })}
        </svg>
        <Foot e={en(t, 0.7, 1.0)} line={EVALS.foot} />
      </div>
    </Scene>
  );
}

/* ------------------------------------------------------------ 4 · incidents */

/** A log scale from a tenth of a second to HIPAA's 60-day limit. Positions are rounded, so server and browser agree. */
const LOG = { x0: 70, x1: 930, min: -1, axis: 230, rise: 32 } as const;
const LOG_MAX = Math.log10(INCIDENTS.limit.at);
const logX = (seconds: number) => Math.round(LOG.x0 + ((Math.log10(seconds) - LOG.min) / (LOG_MAX - LOG.min)) * (LOG.x1 - LOG.x0));

/**
 * Each step's place: the automatic ones stack down to the right from the highest, their names running right; the
 * people's stack up to the right, their names running left. Either way no name crosses a longer leader line.
 */
const STEPS = (() => {
  const auto = INCIDENTS.steps.filter((step) => step.auto);
  const people = INCIDENTS.steps.filter((step) => !step.auto);
  return INCIDENTS.steps.map((step) => {
    const k = step.auto ? auto.indexOf(step) : people.indexOf(step);
    const tier = step.auto ? auto.length - k : k + 1;
    // The people's first name runs right instead, into the open hour before the next step, clear of "Revoked".
    return { ...step, x: logX(step.at), y: LOG.axis - 20 - tier * LOG.rise, end: !step.auto && k > 0 };
  });
})();

const bracket = (steps: typeof STEPS) => ({ from: steps[0].x - 8, to: steps[steps.length - 1].x + 8 });
const AUTO = bracket(STEPS.filter((step) => step.auto));
const PEOPLE = bracket(STEPS.filter((step) => !step.auto));
/** Where the sweep runs on the screen's clock. */
const SWEEP = [0.5, 2.4] as const;

/**
 * An incident on a log scale. A salmon front sweeps from the first tenth of a second; the automatic steps all land
 * inside ten seconds, the people's within the week, and HIPAA's 60-day limit sits far off at the right.
 */
function IncidentsScene({ p }: SceneProps) {
  const { o, t } = sceneClock(p, 3);
  const sweep = en(t, SWEEP[0], SWEEP[1]);
  const front = LOG.x0 + sweep * (LOG.x1 - LOG.x0);
  return (
    <Scene o={o} label="Something will go wrong">
      <SceneTitle title={INCIDENTS.title} t={t} />
      <div className="earlypreview-market__body">
        <svg className="earlypreview-compliance__art earlypreview-compliance__incidents" viewBox="0 0 1000 312" fill="none" aria-hidden>
          <path d={`M${LOG.x0} ${LOG.axis}H${LOG.x1}`} pathLength={1} className="is-axis" style={draw(en(t, 0.25, 0.6))} />
          <path d={`M${LOG.x0} ${LOG.axis}H${LOG.x1}`} pathLength={1} className="is-front" style={draw(sweep)} />
          {INCIDENTS.ticks.map((tick) => (
            <g key={tick.label} className="is-tick" style={vars({ "--k": en(t, 0.4, 0.7) })}>
              <path d={`M${logX(tick.at)} ${LOG.axis + 6}v6`} />
              <text x={logX(tick.at)} y={LOG.axis + 28}>
                {tick.label}
              </text>
            </g>
          ))}
          <g className="is-limit" style={vars({ "--k": en(t, 0.5, 0.8) })}>
            <path d={`M${LOG.x1} ${LOG.axis - 176}V${LOG.axis + 12}`} />
            <text x={LOG.x1} y={LOG.axis - 196}>
              {INCIDENTS.limit.label}
            </text>
            <text x={LOG.x1} y={LOG.axis + 28} className="is-sub">
              {INCIDENTS.limit.sub}
            </text>
          </g>
          {[
            { id: "auto", span: AUTO, label: INCIDENTS.phases.auto },
            { id: "people", span: PEOPLE, label: INCIDENTS.phases.people },
          ].map((phase) => (
            <g key={phase.id} className={`is-phase is-${phase.id}`} style={vars({ "--k": clamp01((front - phase.span.to) / 30) })}>
              <path d={`M${phase.span.from} ${LOG.axis + 48}v-5H${phase.span.to}v5`} />
              <text x={(phase.span.from + phase.span.to) / 2} y={LOG.axis + 68}>
                {phase.label}
              </text>
            </g>
          ))}
          {STEPS.map((step) => {
            const k = clamp01((front - step.x) / 24);
            return (
              <g key={step.text} className={`is-step${step.auto ? " is-auto" : ""}`} style={vars({ "--k": k })}>
                <path d={`M${step.x} ${LOG.axis - 8}V${step.y + 6}`} pathLength={1} style={draw(k)} />
                <circle cx={step.x} cy={LOG.axis} r={5} />
                <text x={step.end ? step.x - 8 : step.x + 8} y={step.y} className={step.end ? "is-end" : undefined}>
                  {step.text}
                </text>
              </g>
            );
          })}
        </svg>
        <Foot e={en(t, 2.0, 2.3)} line={INCIDENTS.foot} />
      </div>
    </Scene>
  );
}

/* ------------------------------------------------------------ 5 · path to Seed */

/** The staircase: a label column, then one column a quarter; one band a level, bottom up. */
const ST = { label: 160, col: 120, base: 290, band: 52, pitch: 12 } as const;
const QUARTERS = PATH.quarters;
const stepTop = (level: number) => ST.base - (level + 1) * ST.band;
const colX = (q: number) => ST.label + q * ST.col;

/** Each quarter's column filled in halftone up to its step: larger dots at the step's edge, finer toward the base. */
const STAIR_DOTS = QUARTERS.flatMap((quarter, q) => {
  const top = stepTop(quarter.level);
  const dots: { x: number; y: number; r: number; c: number; seed: boolean }[] = [];
  for (let y = ST.base - 6; y >= top + 6; y -= ST.pitch) {
    for (let x = colX(q) + 9; x < colX(q + 1) - 3; x += ST.pitch) {
      const depth = (y - top) / (ST.base - top);
      dots.push({
        x,
        y,
        r: Math.round((1.1 + (1 - depth) * 2.4) * 100) / 100,
        c: Math.round((q + (x - colX(q)) / ST.col) * 100) / 100,
        seed: "seed" in quarter,
      });
    }
  }
  return dots;
});

const StairDots = memo(function StairDots() {
  return (
    <>
      {STAIR_DOTS.map((dot, i) => (
        <circle key={i} cx={dot.x} cy={dot.y} r={dot.r} className={dot.seed ? "is-seed" : undefined} style={vars({ "--c": dot.c })} />
      ))}
    </>
  );
});

const STAIR_LINE = QUARTERS.reduce(
  (d, quarter, q) => `${d}${q === 0 ? `M${colX(0)} ${stepTop(quarter.level)}` : `V${stepTop(quarter.level)}`}H${colX(q + 1)}`,
  "",
);

/** Where the path's cursor runs on the screen's clock. */
const WALK = [0.55, 3.9] as const;

/**
 * The path to Seed as a staircase in halftone: seven quarters across, what Doe is cleared to handle up the side. A
 * cursor walks the quarters; each column fills as it passes, and the corner shows what that quarter ships and the
 * plan milestone it unlocks. The last step, Seed, is salmon.
 */
function PathScene({ p }: SceneProps) {
  const { o, t } = sceneClock(p, 4);
  const front = ramp(t, WALK) * QUARTERS.length;
  const active = Math.min(QUARTERS.length - 1, Math.floor(front));
  const level = QUARTERS[active].level;
  return (
    <Scene o={o} label="The path to Seed">
      <div className="earlypreview-market__plans-head">
        <SceneTitle title={PATH.title} t={t} />
        <div className="earlypreview-compliance__quarter-stack" style={vars({ "--e": en(t, 0.45, 0.7) })}>
          {QUARTERS.map((quarter, q) => {
            // Each quarter's lines cross-fade in as the cursor enters its column and out as it leaves; Seed stays.
            const last = q === QUARTERS.length - 1;
            const show = clamp01((front - q) * 5 + (q === 0 ? 1 : 0)) * (last ? 1 : clamp01((q + 1 - front) * 5));
            return (
              <div
                key={quarter.when}
                className={`earlypreview-compliance__quarter${"seed" in quarter ? " is-seed" : ""}`}
                style={vars({ "--o": show })}
                aria-hidden={q !== active}
              >
                <span className="earlypreview-compliance__quarter-when">{"seed" in quarter ? `Seed, ${quarter.when}` : quarter.when}</span>
                <ul>
                  {quarter.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <span className="earlypreview-compliance__quarter-unlock">
                  {PATH.unlocks} <strong>{quarter.unlock}</strong>
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="earlypreview-market__body">
        <div className="earlypreview-compliance__stair">
          <svg
            className="earlypreview-compliance__stair-art"
            viewBox="0 0 1000 300"
            fill="none"
            style={vars({ "--q": front, "--e": en(t, 0.3, 0.55) })}
            aria-hidden
          >
            {LEVELS.map((item, l) => (
              <g key={item.name} className={`is-level${l === level ? " is-current" : ""}`}>
                <path d={`M${ST.label} ${ST.base - l * ST.band}H1000`} />
                <text x={ST.label - 16} y={ST.base - l * ST.band - ST.band / 2 + 2}>
                  {item.name}
                </text>
                {"law" in item ? (
                  <text x={ST.label - 16} y={ST.base - l * ST.band - ST.band / 2 + 18} className="is-law">
                    {item.law}
                  </text>
                ) : null}
              </g>
            ))}
            <StairDots />
            <path d={STAIR_LINE} pathLength={1} className="is-step" style={draw(clamp01(front / QUARTERS.length))} />
            <path
              d={`M${ST.label + clamp01(front / QUARTERS.length) * QUARTERS.length * ST.col} 14V${ST.base + 6}`}
              className="is-cursor"
              style={vars({ "--k": front > 0 && front < QUARTERS.length ? 1 : 0 })}
            />
          </svg>
          <ol className="earlypreview-compliance__keys" style={vars({ "--e": en(t, 0.5, 0.8) })}>
            {QUARTERS.map((quarter, q) => (
              <li
                key={quarter.when}
                className={`${q === active ? "is-active" : q < front ? "is-done" : ""}${"seed" in quarter ? " is-seed" : ""}`}
              >
                <span>{quarter.when}</span>
                {quarter.key}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Scene>
  );
}

/* ------------------------------------------------------------ section */

const SCENES = [OverviewScene, ProtocolScene, EvalsScene, IncidentsScene, PathScene].map((scene) => memo(scene));

/** One line per screen along the bottom edge, filling salmon as it plays; a click jumps to that screen, built. */
function SceneNav({ p, goTo }: { p: number; goTo: (target: number) => void }) {
  return (
    <nav className={`earlypreview-market__nav ${DOEPHONE_DESKTOP_PAGE_INSET_X}`} aria-label="Compliance and security">
      {TIMING.map((slide, index) => {
        const live = p >= slide.start && (p < slide.start + slide.len || index === TIMING.length - 1);
        const at = Math.min(END - 0.12, slide.start + slide.len - FADE - 0.04);
        return (
          <button
            key={slide.id}
            type="button"
            className={`earlypreview-market__nav-item${live ? " is-live" : ""}`}
            style={vars({ "--f": ramp(p, [slide.start, slide.start + slide.len]) })}
            aria-current={live ? "step" : undefined}
            onClick={() => goTo(at)}
          >
            <span className="earlypreview-market__nav-line" aria-hidden />
            <span className="earlypreview-market__nav-label">{slide.nav}</span>
          </button>
        );
      })}
    </nav>
  );
}

/** The brown band above the invite: security and compliance, scroll-locked like the market section. */
export function EarlyPreviewComplianceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { p, skip, goTo } = useDoeHealthDesk2ScrollLock(sectionRef, END);
  const phone = usePhoneLayout(sectionRef);
  return (
    <div className="earlypreview-market-track" style={vars({ "--market-run": END * DOEHEALTH_DESK2_PHONE_STEP_PX })}>
      <section ref={sectionRef} className="earlypreview-market earlypreview-compliance doehealth-desk2-nav-wash-surface" aria-label="Compliance and security">
        {SCENES.map((Screen, index) => {
          const slide = TIMING[index];
          return <Screen key={slide.id} phone={phone} p={Math.min(slide.start + slide.len + 0.001, Math.max(slide.start - 0.001, p))} />;
        })}
        <SceneNav p={p} goTo={goTo} />
        <SkipButton shown={p > 0 && p < END} label="Skip the compliance section" onClick={skip} />
      </section>
    </div>
  );
}
