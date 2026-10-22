"use client";

import {
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  memo,
  useEffect,
  useRef,
  useState,
} from "react";

import { DoeHealthBlogDotWave } from "@/components/doehealth-blog/DoeHealthBlogDotWave";
import { DoeHealthDesk2DotTide } from "@/components/doehealth-desk2/DoeHealthDesk2DotTide";
import { DOEPHONE_DESKTOP_PAGE_INSET_X } from "@/lib/doephone/section-styles";
import {
  DOEHEALTH_DESK2_PHONE_STEP_PX,
  cssVars as vars,
  scrollRamp as ramp,
  useDoeHealthDesk2ScrollLock,
} from "@/lib/doehealthdesk2/use-doehealthdesk2-scroll-lock";
import {
  EARLYPREVIEW_MARKET_CITIES as CITIES,
  EARLYPREVIEW_MARKET_CLINICS as CLINICS,
  EARLYPREVIEW_MARKET_INCLUDED as INCLUDED,
  EARLYPREVIEW_MARKET_INDEX as INDEX,
  EARLYPREVIEW_MARKET_PLANS as PLANS,
  EARLYPREVIEW_MARKET_SEED as SEED,
  EARLYPREVIEW_MARKET_WHY_NOW as WHY_NOW,
  type EarlyPreviewMarketLine,
  type EarlyPreviewMarketSource,
} from "@/lib/earlypreview/earlypreview-market-copy";

/** The screens in order, and how much scroll progress each one holds. */
const SCENES = [
  { id: "whyNow", len: 2.0 },
  { id: "index", len: 3.2 },
  { id: "seed", len: 2.2 },
  { id: "plans", len: 2.4 },
  { id: "included", len: 2.4 },
  { id: "cities", len: 5.0 },
  { id: "clinics", len: 2.4 },
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

/** Progress at which the lock releases going down. */
const END = TIMING[TIMING.length - 1].start + TIMING[TIMING.length - 1].len;
/** Each screen cross-fades over this much progress at either end. */
const FADE = 0.28;

/** A screen's opacity and its own clock (progress since it started). The first shows from the start; the last never fades out. */
function sceneClock(p: number, id: SceneId) {
  const index = TIMING.findIndex((scene) => scene.id === id);
  const { start, len } = TIMING[index];
  const fadeIn = index === 0 ? 1 : ramp(p, [start, start + FADE]);
  const fadeOut =
    index === TIMING.length - 1
      ? 1
      : 1 - ramp(p, [start + len - FADE, start + len]);
  return { o: fadeIn * fadeOut, t: p - start };
}

const smooth = (t: number) => t * t * (3 - 2 * t);
/** Eased 0 → 1 as a screen's clock `t` moves through [a, b]. */
const en = (t: number, a: number, b: number) => smooth(ramp(t, [a, b]));

type HoverHandlers = {
  onPointerMove: (event: ReactPointerEvent) => void;
  onPointerLeave: (event: ReactPointerEvent) => void;
};

/**
 * Hover state shared by a screen's chart and its labels. It starts on pointer movement, not on enter: while the page
 * is locked, screens come in under a cursor that hasn't moved, and that shouldn't dim half a chart. Touch taps don't
 * set it, so nothing sticks on an iPhone.
 */
function useHover<T extends string>() {
  const [hovered, setHovered] = useState<T | null>(null);
  const bind = (id: T): HoverHandlers => ({
    onPointerMove: (event) => {
      if (event.pointerType !== "touch")
        setHovered((current) => (current === id ? current : id));
    },
    onPointerLeave: (event) => {
      if (event.pointerType !== "touch")
        setHovered((current) => (current === id ? null : current));
    },
  });
  const state = (id: T) =>
    hovered === null ? "" : hovered === id ? " is-hovered" : " is-muted";
  return { hovered, bind, state };
}

/** One stacked screen. Hidden screens can't be focused or hovered, so only the one on screen takes input. */
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

/** The screen's two-line P22 title, second line in salmon, revealed by the site's swipe. */
function SceneTitle({ title, t }: { title: readonly string[]; t: number }) {
  const s = ramp(t, [0.04, 0.62]);
  return (
    <h2 className="earlypreview-market__title">
      {title.map((line, index) => (
        <span
          key={line}
          className={`earlypreview-market__swipe${index === 1 ? " is-salmon" : ""}`}
          style={vars({ "--s": s })}
        >
          {line}
        </span>
      ))}
    </h2>
  );
}

/** A whole number that counts up with `k`. The digits come from a CSS counter, so the text never changes under the title fit. */
function Count({
  value,
  k,
  prefix = "",
  suffix = "",
}: {
  value: number;
  k: number;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <>
      <span className="sr-only">{`${prefix}${value}${suffix}`}</span>
      <span aria-hidden>
        {prefix}
        <span
          className="earlypreview-market__count"
          style={vars({ "--v": Math.round(value * k) })}
        />
        {suffix}
      </span>
    </>
  );
}

function ArrowOut() {
  return (
    <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden>
      <path
        d="M2.5 7.5 7.5 2.5M3.5 2.5h4v4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SourceLink({ source }: { source: EarlyPreviewMarketSource }) {
  return source.href ? (
    <a href={source.href} target="_blank" rel="noreferrer">
      {source.label}
      <ArrowOut />
    </a>
  ) : (
    <span>{source.label}</span>
  );
}

/** One stat's source, set directly under it. It fades in with the stat, so it inherits the stat's opacity. */
function SignalSource({ source }: { source: EarlyPreviewMarketSource }) {
  return (
    <p className="earlypreview-market__signal-source">
      <span className="earlypreview-market__sources-label">Source</span>
      <SourceLink source={source} />
    </p>
  );
}

/* ---------------------------------------------------------------- screens */

function WhyNowScene({ p }: { p: number }) {
  const { o, t } = sceneClock(p, "whyNow");
  const hover = useHover<string>();
  return (
    <Scene o={o} label="Why now">
      <SceneTitle title={WHY_NOW.title} t={t} />
      <div className="earlypreview-market__body">
        <ul className="earlypreview-market__signals">
          {WHY_NOW.stats.map((stat, index) => {
            const k = en(t, 0.35 + index * 0.15, 0.9 + index * 0.15);
            return (
              <li
                key={stat.id}
                className={`earlypreview-market__signal${stat.health ? " is-salmon" : ""}${hover.state(stat.id)}`}
                style={vars({
                  "--e": en(t, 0.3 + index * 0.15, 0.6 + index * 0.15),
                })}
                {...hover.bind(stat.id)}
              >
                <span className="earlypreview-market__signal-main">
                  <span className="earlypreview-market__signal-num">
                    <Count value={stat.value} k={k} suffix={stat.suffix} />
                  </span>
                  <span className="earlypreview-market__signal-caption">
                    {stat.caption}
                  </span>
                </span>
                <SignalSource source={stat.source} />
              </li>
            );
          })}
        </ul>
      </div>
    </Scene>
  );
}

const count = (n: number) => n.toLocaleString("en-US");

/** A line of copy with its figures set apart. */
function FigureLine({ line }: { line: EarlyPreviewMarketLine }) {
  return (
    <>
      {line.map((part) =>
        "figure" in part ? (
          <strong key={part.text}>{part.text}</strong>
        ) : (
          <span key={part.text}>{part.text}</span>
        ),
      )}
    </>
  );
}

/** The target at Seed: the metrics one a line in the top right, the title building in the bottom left. */
function SeedScene({ p }: { p: number }) {
  const { o, t } = sceneClock(p, "seed");
  return (
    <Scene
      o={o}
      label="Target at Seed"
      className="earlypreview-market__scene--corners"
    >
      {/* The hero's dot wave, across the middle of the screen at full width. */}
      <div
        className="earlypreview-market__seed-wave"
        style={vars({ "--e": en(t, 0.1, 0.55) })}
        aria-hidden
      >
        <DoeHealthBlogDotWave
          color="rgba(252, 207, 184, 0.6)"
          top={0.42}
          amp={60}
          fade={0.5}
          active={o > 0}
        />
      </div>
      <ol className="earlypreview-market__seed-lines">
        {SEED.lines.map((line, index) => (
          <li
            key={line[0].text}
            style={vars({
              "--e": en(t, 0.55 + index * 0.1, 0.85 + index * 0.1),
            })}
          >
            <FigureLine line={line} />
          </li>
        ))}
      </ol>
      <SceneTitle title={SEED.title} t={t} />
    </Scene>
  );
}

function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M3 7.4 5.8 10 11 4.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const PAID_PLANS = PLANS.plans.filter((plan) => "foundingMo" in plan);

/**
 * Free to paid: the title with the founding offer in the top right (each paid tier's founding price, then its regular
 * one), then the four tiers in a row at their regular prices.
 */
function PlansScene({ p }: { p: number }) {
  const { o, t } = sceneClock(p, "plans");
  const hover = useHover<string>();
  return (
    <Scene o={o} label="Plans">
      <div className="earlypreview-market__plans-head">
        <SceneTitle title={PLANS.title} t={t} />
        <aside
          className="earlypreview-market__founding"
          style={vars({ "--e": en(t, 0.35, 0.7) })}
        >
          <p className="earlypreview-market__founding-label">
            {PLANS.founding.label}
          </p>
          <p className="earlypreview-market__founding-detail">
            {PLANS.founding.detail[0]}
            <br />
            {PLANS.founding.detail[1]}
          </p>
          <ul className="earlypreview-market__founding-steps">
            {PAID_PLANS.map((plan) => (
              <li key={plan.id}>
                <span>{plan.name}</span>
                <strong>${"foundingMo" in plan ? plan.foundingMo : ""}</strong>
                <span className="sr-only">then</span>
                <span aria-hidden>→</span>
                <span>${plan.priceMo}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
      <div className="earlypreview-market__body">
        <ol className="earlypreview-market__plans">
          {PLANS.plans.map((plan, index) => (
            <li
              key={plan.id}
              className={`earlypreview-market__plan is-${plan.id}${hover.state(plan.id)}`}
              style={vars({
                "--e": en(t, 0.3 + index * 0.14, 0.62 + index * 0.14),
              })}
              {...hover.bind(plan.id)}
            >
              <div className="earlypreview-market__plan-main">
                <span className="earlypreview-market__plan-name">
                  {plan.name}
                </span>
                <span className="earlypreview-market__plan-prices">
                  <span className="earlypreview-market__plan-value">
                    ${plan.priceMo}
                    <small>/mo</small>
                  </span>
                </span>
                {"group" in plan ? (
                  <span className="earlypreview-market__plan-group">
                    <span>
                      {plan.group.label} <strong>${plan.group.priceMo}</strong>
                      {plan.group.unit}
                    </span>
                  </span>
                ) : null}
                {"note" in plan ? (
                  <span className="earlypreview-market__plan-group">
                    <span>{plan.note}</span>
                  </span>
                ) : null}
              </div>
              <ul className="earlypreview-market__plan-features">
                {plan.features.map((feature) => (
                  <li key={feature}>
                    <Check />
                    {feature}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </Scene>
  );
}

/**
 * What each tier includes: the tiers across the top, one row per layer of the clinic. Doe One's column is salmon, and
 * what a tier leaves out is a quiet dash. Rows come in one after another.
 */
function IncludedScene({ p }: { p: number }) {
  const { o, t } = sceneClock(p, "included");
  const hover = useHover<string>();
  return (
    <Scene o={o} label="What's in each tier">
      <SceneTitle title={INCLUDED.title} t={t} />
      <div className="earlypreview-market__body">
        <div
          className="earlypreview-market__incl"
          role="table"
          aria-label="What each tier includes"
        >
          <div
            className="earlypreview-market__incl-row is-head"
            role="row"
            style={vars({ "--e": en(t, 0.3, 0.55) })}
          >
            <span role="columnheader" />
            {INCLUDED.tiers.map((tier) => (
              <span key={tier.id} role="columnheader" className={`is-${tier.id}`}>
                {tier.name} <em>${tier.priceMo}</em>
              </span>
            ))}
          </div>
          {INCLUDED.rows.map((row, index) => (
            <div
              key={row.id}
              className={`earlypreview-market__incl-row${hover.state(row.id)}`}
              role="row"
              style={vars({
                "--e": en(t, 0.4 + index * 0.08, 0.65 + index * 0.08),
              })}
              {...hover.bind(row.id)}
            >
              <span role="rowheader">{row.label}</span>
              {row.cells.map((cell, c) => (
                <span
                  key={INCLUDED.tiers[c].id}
                  role="cell"
                  className={`is-${INCLUDED.tiers[c].id}${cell ? "" : " is-none"}`}
                >
                  {cell ?? (
                    <>
                      <span aria-hidden>—</span>
                      <span className="sr-only">Not included</span>
                    </>
                  )}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Scene>
  );
}

/**
 * One grid for both markets: 25 columns by 12 rows, 300 dots, present from the start. Canada takes the dots it
 * needs from the bottom left, the U.S. the rest, so the grid never changes size and no dot moves once it is placed.
 */
const GRID = { cols: 25, rows: 12, pitch: 10 } as const;
const TOTAL_DOTS = GRID.cols * GRID.rows;
/* Each market takes whole rows, so each fills bottom up with no gaps: Canada the lowest rows, the U.S. the rest. */
const CANADA_ROWS = Math.round(
  (GRID.rows * CITIES.canada.claimed) /
    (CITIES.canada.claimed + CITIES.us.claimed),
);
const CANADA_DOTS = CANADA_ROWS * GRID.cols;
const US_DOTS = TOTAL_DOTS - CANADA_DOTS;
const CANADA_PAID_DOTS = Math.round(
  (CANADA_DOTS * CITIES.canada.paying) / CITIES.canada.claimed,
);
const US_PAID_DOTS = Math.round(
  (US_DOTS * CITIES.us.paying) / CITIES.us.claimed,
);

/** Each dot's place, market and order. Fixed, so the dots render once and CSS fills them. */
const DOTS = Array.from({ length: TOTAL_DOTS }, (_, i) => {
  const isCanada = i < CANADA_DOTS;
  return {
    x: (i % GRID.cols) * GRID.pitch + GRID.pitch / 2,
    y:
      (GRID.rows - 1 - Math.floor(i / GRID.cols)) * GRID.pitch + GRID.pitch / 2,
    market: isCanada ? "is-ca" : "is-us",
    at: isCanada ? i : i - CANADA_DOTS,
  };
});

/** The dots themselves, rendered once; each one's fill comes from the grid's custom properties in CSS. */
const ClinicDots = memo(function ClinicDots() {
  return (
    <>
      {DOTS.map((dot, i) => (
        <g
          key={i}
          className={dot.market}
          style={vars({ "--i": i, "--at": dot.at })}
        >
          <circle cx={dot.x} cy={dot.y} r={3} className="is-empty" />
          <circle cx={dot.x} cy={dot.y} r={3} className="is-claimed" />
          <circle cx={dot.x} cy={dot.y} r={3} className="is-paying" />
        </g>
      ))}
    </>
  );
});

/**
 * The dot grid. Canada's dots light first, then the U.S.'s. Salmon fills the same way, one bottom-up front across the
 * whole grid: Canada's paying dots, then the U.S.'s, then (`t` at 2.35 → 2.9) the rest, so no row is ever skipped.
 * Only the fronts change on scroll (`--lc`, `--lu`, `--sf`, in dots); each dot works out its own fill from them.
 */
function ClinicGrid({ t, usT }: { t: number; usT: number }) {
  const salmonFront =
    CANADA_PAID_DOTS * ramp(t, [0.8, 1.3]) +
    US_PAID_DOTS * ramp(usT, [0.65, 1.15]) +
    (TOTAL_DOTS - CANADA_PAID_DOTS - US_PAID_DOTS) * ramp(t, [2.35, 2.9]);
  return (
    <svg
      className="earlypreview-market__country-dots"
      viewBox={`0 0 ${GRID.cols * GRID.pitch} ${GRID.rows * GRID.pitch}`}
      style={vars({
        "--lc": ramp(t, [0.25, 1.0]) * CANADA_DOTS,
        "--lu": ramp(usT, [0.1, 0.85]) * US_DOTS,
        "--sf": salmonFront,
      })}
      aria-hidden
    >
      <ClinicDots />
    </svg>
  );
}

/** A layer stacked with others in one grid cell; only the visible one takes the pointer. */
function Layer({
  o,
  className,
  children,
}: {
  o: number;
  className: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`${className}${o < 0.5 ? " is-off" : ""}${o <= 0.001 ? " is-gone" : ""}`}
      style={vars({ "--o": o })}
      aria-hidden={o < 0.5}
    >
      {children}
    </div>
  );
}

/** A country's ARR target over its paying, claimed and indexed clinics, all in large type. */
function CountryPanel({
  t,
  market,
}: {
  t: number;
  market: typeof CITIES.canada | typeof CITIES.us;
}) {
  const lines = [
    { id: "paying", value: market.paying, label: "paying" },
    { id: "claimed", value: market.claimed, label: "claimed" },
    { id: "indexed", value: market.indexed, label: "indexed" },
  ];
  return (
    <div className="earlypreview-market__country-panel">
      <span
        className="earlypreview-market__country-arr"
        style={vars({ "--e": en(t, 0.35, 0.7) })}
      >
        {market.arr}
      </span>
      <span
        className="earlypreview-market__country-arr-label"
        style={vars({ "--e": en(t, 0.4, 0.75) })}
      >
        {market.arrLabel}
      </span>
      <ul className="earlypreview-market__country-lines">
        {lines.map((line, index) => (
          <li
            key={line.id}
            className={`is-${line.id}`}
            style={vars({
              "--e": en(t, 0.55 + index * 0.1, 0.85 + index * 0.1),
            })}
          >
            <strong>{count(line.value)}</strong> {line.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Where each stage of the cities screen starts on its clock. */
const CITY_STEP = { us: 1.6, breakdown: 3.0 } as const;

/**
 * Toronto, then the U.S., then the clinics that add up to ARR at Seed: one screen that changes on scroll. The dot
 * grid holds the middle; Canada's dots give way to the U.S.'s larger grid, and then to the breakdown.
 */
function CitiesScene({ p }: { p: number }) {
  const { o, t } = sceneClock(p, "cities");
  const { canada, us, breakdown } = CITIES;
  const toUs = ramp(t, [CITY_STEP.us - 0.05, CITY_STEP.us + 0.2]);
  const toTable = ramp(t, [
    CITY_STEP.breakdown - 0.05,
    CITY_STEP.breakdown + 0.2,
  ]);
  const usT = t - CITY_STEP.us + 0.1;
  const tableT = t - CITY_STEP.breakdown + 0.1;

  return (
    <Scene o={o} label="Toronto, then the U.S.">
      <div className="earlypreview-market__title-stack">
        <Layer o={1 - toUs} className="earlypreview-market__title-layer">
          <SceneTitle title={canada.title} t={t} />
        </Layer>
        <Layer
          o={toUs * (1 - toTable)}
          className="earlypreview-market__title-layer"
        >
          <SceneTitle title={us.title} t={usT} />
        </Layer>
      </div>
      <div className="earlypreview-market__body">
        <div className="earlypreview-market__stack">
          <Layer o={1 - toTable} className="earlypreview-market__country-view">
            <div className="earlypreview-market__country-panels">
              <Layer
                o={1 - toUs}
                className="earlypreview-market__country-panel-layer"
              >
                <CountryPanel t={t} market={canada} />
              </Layer>
              <Layer
                o={toUs}
                className="earlypreview-market__country-panel-layer"
              >
                <CountryPanel t={usT} market={us} />
              </Layer>
            </div>
            <ClinicGrid t={t} usT={usT} />
          </Layer>
          <Layer o={toTable} className="earlypreview-market__mix-view">
            <div className="earlypreview-market__mix-block">
              <SceneTitle title={["Targets"]} t={tableT} />
            </div>
            <div
              className="earlypreview-market__mix"
              role="table"
              aria-label="Clinics at Seed by plan and country, and the ARR each plan adds"
            >
              <div
                className="earlypreview-market__mix-row is-head"
                role="row"
                style={vars({ "--e": en(tableT, 0.2, 0.45) })}
              >
                <span role="columnheader" />
                <span role="columnheader">Canada</span>
                <span role="columnheader">U.S.</span>
                <span role="columnheader">ARR</span>
              </div>
              {breakdown.rows.map((row, index) => (
                <div
                  key={row.id}
                  className={`earlypreview-market__mix-row is-${row.id}`}
                  role="row"
                  style={vars({
                    "--e": en(tableT, 0.25 + index * 0.08, 0.5 + index * 0.08),
                  })}
                >
                  <span role="rowheader">
                    {row.name} <em>{row.price}</em>
                  </span>
                  <span role="cell">{count(row.canada)}</span>
                  <span role="cell">{count(row.us)}</span>
                  <span role="cell">{row.arr}</span>
                </div>
              ))}
              <div
                className="earlypreview-market__mix-row is-total"
                role="row"
                style={vars({ "--e": en(tableT, 0.5, 0.75) })}
              >
                <span role="rowheader">Paying</span>
                <span role="cell">{breakdown.total.canada}</span>
                <span role="cell">{breakdown.total.us}</span>
                <span role="cell">{breakdown.total.arr}</span>
              </div>
            </div>
            <ul className="earlypreview-market__mix-facts">
              {breakdown.facts.map((line, index) => (
                <li
                  key={line[0].text}
                  style={vars({
                    "--e":
                      en(tableT, 0.3 + index * 0.7, 0.5 + index * 0.7) *
                      (index === breakdown.facts.length - 1
                        ? 1
                        : 1 - en(tableT, 0.8 + index * 0.7, 1.0 + index * 0.7)),
                  })}
                >
                  <FigureLine line={line} />
                </li>
              ))}
            </ul>
          </Layer>
        </div>
      </div>
    </Scene>
  );
}

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
/** 0 → 1 as `t` moves through [k, k + w]: one stroke's share of a drawing's progress. */
const seg = (t: number, k: number, w: number) => clamp01((t - k) / w);
/** Style for a stroke traced in by CSS (pathLength 1, dash offset from --draw). */
const draw = (value: number) => vars({ "--draw": value });

/** The clinics around the page, near to far, alternating sides. `claimed` ones fill salmon at the end. */
const INDEX_NODES = [
  { x: 262, y: 84, claimed: true },
  { x: 538, y: 92, claimed: false },
  { x: 236, y: 226, claimed: false },
  { x: 566, y: 222, claimed: true },
  { x: 168, y: 150, claimed: false },
  { x: 634, y: 156, claimed: false },
  { x: 120, y: 62, claimed: false },
  { x: 684, y: 70, claimed: true },
  { x: 104, y: 246, claimed: true },
  { x: 700, y: 240, claimed: false },
  { x: 44, y: 152, claimed: false },
  { x: 758, y: 148, claimed: false },
] as const;
const NODE_R = 13;

/**
 * The Index going out, as a line drawing that builds with the scroll: a clinic's page in the middle, then a soft
 * curve out to each clinic in the cloud around it, near ones first. Last, the clinics that claimed fill salmon.
 */
function IndexDrawing({ t }: { t: number }) {
  return (
    <svg
      className="earlypreview-market__index-art"
      viewBox="0 0 800 310"
      fill="none"
      aria-hidden
    >
      <rect
        x={352}
        y={88}
        width={96}
        height={128}
        rx={18}
        pathLength={1}
        style={draw(seg(t, 0, 0.2))}
      />
      <circle
        cx={377}
        cy={115}
        r={9}
        pathLength={1}
        className="is-soft"
        style={draw(seg(t, 0.14, 0.08))}
      />
      <path
        d="M395 111h30"
        pathLength={1}
        className="is-soft"
        style={draw(seg(t, 0.17, 0.08))}
      />
      <path
        d="M395 120h18"
        pathLength={1}
        className="is-faint"
        style={draw(seg(t, 0.19, 0.08))}
      />
      <path
        d="M368 146h64"
        pathLength={1}
        className="is-faint"
        style={draw(seg(t, 0.21, 0.08))}
      />
      <path
        d="M368 158h46"
        pathLength={1}
        className="is-faint"
        style={draw(seg(t, 0.23, 0.08))}
      />
      <rect
        x={368}
        y={178}
        width={46}
        height={18}
        rx={9}
        pathLength={1}
        className="is-salmon"
        style={draw(seg(t, 0.26, 0.08))}
      />
      {INDEX_NODES.map((node, i) => {
        const left = node.x < 400;
        const sx = left ? 352 : 448;
        const ex = node.x + (left ? NODE_R : -NODE_R);
        const pull = (left ? -1 : 1) * Math.abs(ex - sx) * 0.5;
        const start = 0.32 + i * 0.04;
        return (
          <g key={i}>
            <path
              d={`M${sx} 152C${sx + pull} 152 ${ex - pull} ${node.y} ${ex} ${node.y}`}
              pathLength={1}
              className={i < 6 ? "is-soft" : "is-faint"}
              style={draw(seg(t, start, 0.12))}
            />
            <circle
              cx={node.x}
              cy={node.y}
              r={NODE_R}
              pathLength={1}
              style={draw(seg(t, start + 0.1, 0.08))}
            />
            {node.claimed ? (
              <circle
                cx={node.x}
                cy={node.y}
                r={5}
                className="is-dot"
                style={vars({ "--k": seg(t, 0.86 + i * 0.008, 0.06) })}
              />
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

/**
 * How far `ref`'s element would move to sit centred in its screen. Measured from its parent, which stays put while
 * the element itself is shifted.
 */
function useCenterOffset(ref: { current: HTMLElement | null }) {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const el = ref.current;
    const anchor = el?.parentElement;
    const scene = el?.closest(".earlypreview-market__scene");
    if (!el || !anchor || !scene) return;
    const measure = () => {
      const box = scene.getBoundingClientRect();
      setOffset(
        box.top +
          box.height / 2 -
          (anchor.getBoundingClientRect().top + el.offsetHeight / 2),
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(scene);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
  return offset;
}

/**
 * The clinics Doe targets, in two groups side by side: private services first and widest, then medical practices
 * and specialties. Each group's name is large and salmon over its types, which come in one after another.
 */
function ClinicsScene({ p }: { p: number }) {
  const { o, t } = sceneClock(p, "clinics");
  return (
    <Scene o={o} label="The clinics we're targeting">
      <SceneTitle title={CLINICS.title} t={t} />
      <div className="earlypreview-market__body">
        <div className="earlypreview-market__types">
          {CLINICS.groups.map((group, g) => {
            const from = g === 0 ? 0.4 : 0.9;
            return (
              <div
                key={group.id}
                className={`earlypreview-market__type-group is-${group.id}`}
              >
                <h3
                  className="earlypreview-market__type-lead"
                  style={vars({ "--e": en(t, from, from + 0.3) })}
                >
                  {group.lead}
                </h3>
                <ul className="earlypreview-market__type-list">
                  {group.types.map((type, i) => (
                    <li
                      key={type}
                      style={vars({
                        "--e": en(
                          t,
                          from + 0.15 + i * 0.035,
                          from + 0.4 + i * 0.035,
                        ),
                      })}
                    >
                      {type}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </Scene>
  );
}

/**
 * The clinics already indexed: the title starts in the middle of the screen and rises, and the line drawing of the
 * Index going out builds under it, between the dot tides at the sides.
 */
function IndexScene({ p }: { p: number }) {
  const { o, t } = sceneClock(p, "index");
  const { index } = INDEX;
  const headRef = useRef<HTMLDivElement>(null);
  const toCenter = useCenterOffset(headRef);
  const lift = en(t, 0.7, 1.15);

  return (
    <Scene o={o} label="Go-to-market">
      {/* The side dot tides from the clinics scene on /doehealthdesk2, swept in with the title. They fade with the screen. */}
      <div
        className="doehealth-desk2-visible__tide earlypreview-market__index-tide"
        style={vars({ "--s": ramp(t, [0.05, 0.9]) })}
      >
        <DoeHealthDesk2DotTide
          color="rgba(252, 207, 184, 0.6)"
          active={o > 0}
        />
      </div>
      <div
        ref={headRef}
        className="earlypreview-market__index-head"
        style={vars({ "--y": toCenter * (1 - lift) })}
      >
        <SceneTitle title={index.title} t={t} />
        <p
          className="earlypreview-market__index-detail"
          style={vars({ "--e": en(t, 0.35, 0.65) })}
        >
          {index.detail[0]}
          <br />
          {index.detail[1]}
        </p>
      </div>
      <div className="earlypreview-market__body">
        <IndexDrawing t={ramp(t, [1.0, 2.6])} />
      </div>
    </Scene>
  );
}

/** The stages the bottom nav jumps between. `at` is where each one is fully built, just before the next begins. */
const NAV = (() => {
  const start = (id: SceneId) => TIMING.find((scene) => scene.id === id)!.start;
  const len = (id: SceneId) => TIMING.find((scene) => scene.id === id)!.len;
  const stage = (
    label: string,
    id: SceneId,
    from: number,
    to: number,
    at: number,
  ) => ({
    label,
    from: start(id) + from,
    to: start(id) + to,
    at: Math.min(END, start(id) + at),
  });
  const whole = (label: string, id: SceneId) =>
    stage(label, id, 0, len(id), len(id) - FADE - 0.02);
  return [
    whole("Why Now", "whyNow"),
    whole("Index", "index"),
    whole("Seed", "seed"),
    whole("Pricing", "plans"),
    whole("Tiers", "included"),
    stage("Toronto", "cities", 0, CITY_STEP.us, CITY_STEP.us - 0.15),
    stage(
      "U.S.",
      "cities",
      CITY_STEP.us,
      CITY_STEP.breakdown,
      CITY_STEP.breakdown - 0.1,
    ),
    stage(
      "Targets",
      "cities",
      CITY_STEP.breakdown,
      len("cities"),
      len("cities") - FADE - 0.02,
    ),
    stage("Clinics", "clinics", 0, len("clinics"), len("clinics")),
  ];
})();

/** One line per stage along the bottom edge, filling salmon as it plays; a click jumps to that stage. */
function SceneNav({ p, goTo }: { p: number; goTo: (target: number) => void }) {
  return (
    <nav
      className={`earlypreview-market__nav ${DOEPHONE_DESKTOP_PAGE_INSET_X}`}
      aria-label="Market screens"
    >
      {NAV.map((item, index) => {
        const live =
          p >= item.from && (p < item.to || index === NAV.length - 1);
        return (
          <button
            key={item.label}
            type="button"
            className={`earlypreview-market__nav-item${live ? " is-live" : ""}`}
            style={vars({ "--f": ramp(p, [item.from, item.to]) })}
            aria-current={live ? "step" : undefined}
            onClick={() => goTo(item.at)}
          >
            <span className="earlypreview-market__nav-line" aria-hidden />
            <span className="earlypreview-market__nav-label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

/**
 * Progress as one screen sees it: held just outside its own span. Outside that span a screen is hidden and its
 * motion has settled, so it looks the same; holding `p` there lets the memoized screens skip re-rendering.
 */
function sceneP(p: number, id: SceneId) {
  const { start, len } = TIMING.find((scene) => scene.id === id)!;
  return Math.min(start + len + 0.001, Math.max(start - 0.001, p));
}

const WhyNow = memo(WhyNowScene);
const Seed = memo(SeedScene);
const Plans = memo(PlansScene);
const Included = memo(IncludedScene);
const Cities = memo(CitiesScene);
const Clinics = memo(ClinicsScene);
const Index = memo(IndexScene);

/**
 * The market section, the page's second, in seven screens: why now ("Personal agents are scaling."), the clinics
 * already indexed, the target at Seed, the plans from free to paid, what each tier includes, the cities (Toronto, then the U.S., then the
 * targets), and the clinic types. It locks like the audience section on /doehealthdesk2: scrolling steps through the
 * screens, every motion follows the scroll, and the lock releases on the clinic types, which stay. On an iPhone it scrubs through a sticky track.
 */
export function EarlyPreviewMarketSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { p, skip, goTo } = useDoeHealthDesk2ScrollLock(sectionRef, END);

  return (
    <div
      className="earlypreview-market-track"
      style={vars({ "--market-run": END * DOEHEALTH_DESK2_PHONE_STEP_PX })}
    >
      <section
        ref={sectionRef}
        className="earlypreview-market doehealth-desk2-nav-wash-surface"
        aria-label="The market for personal health agents"
      >
        <WhyNow p={sceneP(p, "whyNow")} />
        <Seed p={sceneP(p, "seed")} />
        <Plans p={sceneP(p, "plans")} />
        <Included p={sceneP(p, "included")} />
        <Cities p={sceneP(p, "cities")} />
        <Clinics p={sceneP(p, "clinics")} />
        <Index p={sceneP(p, "index")} />
        <SceneNav p={p} goTo={goTo} />
        {p > 0 && p < END ? (
          <button
            type="button"
            className="doehealth-desk2-visible__skip"
            aria-label="Skip the market section"
            onClick={skip}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M7 5.5 13 12 7 18.5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16.35 5.5v13"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </button>
        ) : null}
      </section>
    </div>
  );
}
