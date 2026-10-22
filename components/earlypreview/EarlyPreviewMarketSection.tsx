"use client";

import { type PointerEvent as ReactPointerEvent, type ReactNode, useEffect, useId, useRef, useState } from "react";

import { DOEPHONE_DESKTOP_PAGE_INSET_X } from "@/lib/doephone/section-styles";
import {
  DOEHEALTH_DESK2_PHONE_STEP_PX,
  cssVars as vars,
  scrollRamp as ramp,
  useDoeHealthDesk2ScrollLock,
} from "@/lib/doehealthdesk2/use-doehealthdesk2-scroll-lock";
import {
  EARLYPREVIEW_MARKET_EXPANSION as EXPANSION,
  EARLYPREVIEW_MARKET_MODEL as MODEL,
  EARLYPREVIEW_MARKET_REVENUE as REVENUE,
  EARLYPREVIEW_MARKET_SIZE as SIZE,
  EARLYPREVIEW_MARKET_WHY_NOW as WHY_NOW,
  type EarlyPreviewMarketSource,
} from "@/lib/earlypreview/earlypreview-market-copy";

/** The four screens in order, and how much scroll progress each one holds. */
const SCENES = [
  { id: "whyNow", len: 2.0 },
  { id: "size", len: 2.1 },
  { id: "revenue", len: 1.8 },
  { id: "expansion", len: 1.5 },
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
  const fadeOut = index === TIMING.length - 1 ? 1 : 1 - ramp(p, [start + len - FADE, start + len]);
  return { o: fadeIn * fadeOut, t: p - start };
}

const smooth = (t: number) => t * t * (3 - 2 * t);
/** Eased 0 → 1 as a screen's clock `t` moves through [a, b]. */
const en = (t: number, a: number, b: number) => smooth(ramp(t, [a, b]));

const formatM = (amountM: number) => (amountM >= 1000 ? `$${(amountM / 1000).toFixed(1)}B` : `$${amountM}M`);

const SAM_TOTAL_M = MODEL.sam.segments.reduce((sum, seg) => sum + seg.amountM, 0);

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
      if (event.pointerType !== "touch") setHovered((current) => (current === id ? current : id));
    },
    onPointerLeave: (event) => {
      if (event.pointerType !== "touch") setHovered((current) => (current === id ? null : current));
    },
  });
  const state = (id: T) => (hovered === null ? "" : hovered === id ? " is-hovered" : " is-muted");
  return { hovered, bind, state };
}

/** One stacked screen. Hidden screens can't be focused or hovered, so only the one on screen takes input. */
function Scene({ o, label, className = "", children }: { o: number; label: string; className?: string; children: ReactNode }) {
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
        <span key={line} className={`earlypreview-market__swipe${index === 1 ? " is-salmon" : ""}`} style={vars({ "--s": s })}>
          {line}
        </span>
      ))}
    </h2>
  );
}

/** A whole number that counts up with `k`. The digits come from a CSS counter, so the text never changes under the title fit. */
function Count({ value, k, prefix = "", suffix = "" }: { value: number; k: number; prefix?: string; suffix?: string }) {
  return (
    <>
      <span className="sr-only">{`${prefix}${value}${suffix}`}</span>
      <span aria-hidden>
        {prefix}
        <span className="earlypreview-market__count" style={vars({ "--v": Math.round(value * k) })} />
        {suffix}
      </span>
    </>
  );
}

function ArrowOut() {
  return (
    <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden>
      <path d="M2.5 7.5 7.5 2.5M3.5 2.5h4v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Sources({ items, e }: { items: readonly EarlyPreviewMarketSource[]; e: number }) {
  return (
    <p className="earlypreview-market__sources" style={vars({ "--e": e })}>
      <span className="earlypreview-market__sources-label">{items.length > 1 ? "Sources" : "Source"}</span>
      {items.map((source) =>
        source.href ? (
          <a key={source.label} href={source.href} target="_blank" rel="noreferrer">
            {source.label}
            <ArrowOut />
          </a>
        ) : (
          <span key={source.label}>{source.label}</span>
        ),
      )}
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
                style={vars({ "--e": en(t, 0.3 + index * 0.15, 0.6 + index * 0.15) })}
                {...hover.bind(stat.id)}
              >
                <span className="earlypreview-market__signal-num">
                  <Count value={stat.value} k={k} suffix={stat.suffix} />
                </span>
                <span className="earlypreview-market__signal-caption">{stat.caption}</span>
              </li>
            );
          })}
        </ul>
      </div>
      <Sources items={WHY_NOW.sources} e={en(t, 1.2, 1.5)} />
    </Scene>
  );
}

type SizeKey = "tam" | "sam" | "som";

/**
 * The market as dots: every dot is `MODEL.dotM` million dollars. They fill a column at a time from the bottom left,
 * so SAM is the first block of columns and SOM the first few dots inside it. Each layer is one rect filled with a dot
 * pattern on the same grid, so thousands of dots cost three shapes.
 */
function DotField({ cols, rows, reveal, sam, som, hovered, bind, className }: {
  cols: number;
  rows: number;
  reveal: number;
  sam: number;
  som: number;
  hovered: SizeKey | null;
  bind: (id: SizeKey) => HoverHandlers;
  className: string;
}) {
  const id = useId().replace(/:/g, "");
  const pitch = 10;
  const counts = { sam: Math.round(SAM_TOTAL_M / MODEL.dotM), som: Math.round(MODEL.som.amountM / MODEL.dotM) };
  const w = cols * pitch;
  const h = rows * pitch;
  /** The area of the first `n` dots, filled bottom-up a column at a time. */
  const area = (n: number) => {
    const full = Math.floor(n / rows);
    const rest = n % rows;
    return (
      <>
        {full > 0 ? <rect x={0} y={0} width={full * pitch} height={h} /> : null}
        {rest > 0 ? <rect x={full * pitch} y={h - rest * pitch} width={pitch} height={rest * pitch} /> : null}
      </>
    );
  };
  return (
    <div className={`earlypreview-market__field ${className}`} data-hovered={hovered ?? undefined} style={vars({ "--s": reveal })}>
      <svg viewBox={`0 0 ${w} ${h}`} aria-hidden>
        <defs>
          {(["tam", "sam", "som"] as const).map((key) => (
            <pattern key={key} id={`${id}-${key}`} width={pitch} height={pitch} patternUnits="userSpaceOnUse">
              <circle cx={pitch / 2} cy={pitch / 2} r={key === "tam" ? 2.7 : 2.95} className={`earlypreview-market__field-dot is-${key}`} />
            </pattern>
          ))}
        </defs>
        <g className="earlypreview-market__field-layer is-tam" {...bind("tam")}>
          <rect x={0} y={0} width={w} height={h} fill={`url(#${id}-tam)`} />
        </g>
        <g style={{ opacity: sam }}>
          <g className="earlypreview-market__field-layer is-sam" fill={`url(#${id}-sam)`} {...bind("sam")}>
            {area(counts.sam)}
          </g>
        </g>
        <g style={{ opacity: som }}>
          <g className="earlypreview-market__field-layer is-som" fill={`url(#${id}-som)`} {...bind("som")}>
            {area(counts.som)}
          </g>
        </g>
      </svg>
    </div>
  );
}

function SizeScene({ p }: { p: number }) {
  const { o, t } = sceneClock(p, "size");
  const hover = useHover<SizeKey>();
  const reveal = ramp(t, [0.15, 0.8]);
  const sam = en(t, 0.8, 1.1);
  const som = en(t, 1.1, 1.4);
  const entries = [
    { key: "tam" as const, entry: MODEL.tam, e: en(t, 0.3, 0.6) },
    { key: "sam" as const, entry: MODEL.sam, e: sam },
    { key: "som" as const, entry: MODEL.som, e: som },
  ];
  return (
    <Scene o={o} label="Market size">
      <SceneTitle title={SIZE.title} t={t} />
      <div className="earlypreview-market__body earlypreview-market__body--size">
        <ul className="earlypreview-market__legend">
          {entries.map(({ key, entry, e }) => (
            <li key={key} className={`earlypreview-market__legend-item is-${key}${hover.state(key)}`} style={vars({ "--e": e })} {...hover.bind(key)}>
              <span className="earlypreview-market__legend-key">
                <i aria-hidden />
                {entry.key}
                <span>{entry.title}</span>
              </span>
              <span className="earlypreview-market__legend-value">{entry.display}</span>
              <span className="earlypreview-market__legend-detail">{entry.detail}</span>
            </li>
          ))}
        </ul>
        <div className="earlypreview-market__field-wrap">
          <DotField cols={80} rows={35} reveal={reveal} sam={sam} som={som} hovered={hover.hovered} bind={hover.bind} className="is-desk" />
          <DotField cols={70} rows={40} reveal={reveal} sam={sam} som={som} hovered={hover.hovered} bind={hover.bind} className="is-phone" />
          <p className="earlypreview-market__field-note" style={vars({ "--e": en(t, 0.5, 0.8) })}>
            {SIZE.note}
          </p>
        </div>
      </div>
      <Sources items={SIZE.sources} e={en(t, 1.2, 1.5)} />
    </Scene>
  );
}

function RevenueScene({ p }: { p: number }) {
  const { o, t } = sceneClock(p, "revenue");
  const hover = useHover<string>();
  const total = REVENUE.rows.reduce((sum, row) => sum + row.amountM, 0);
  const rowIn = (index: number) => en(t, 0.3 + index * 0.18, 0.62 + index * 0.18);
  const totalIn = en(t, 0.9, 1.2);
  return (
    <Scene o={o} label="Bottom-up revenue model">
      <SceneTitle title={REVENUE.title} t={t} />
      <div className="earlypreview-market__body">
        <table className="earlypreview-market__model">
          <caption className="sr-only">Year 7 revenue: organizations times annual contract value, plus agent actions times price</caption>
          <tbody>
            {REVENUE.rows.map((row, index) => (
              <tr key={row.id} className={`earlypreview-market__model-row is-${row.id}${hover.state(row.id)}`} style={vars({ "--e": rowIn(index) })} {...hover.bind(row.id)}>
                <th scope="row">
                  <i aria-hidden />
                  {row.label}
                </th>
                <td className="earlypreview-market__model-num">{row.count}</td>
                <td className="earlypreview-market__model-op" aria-hidden>
                  ×
                </td>
                <td>
                  <span className="earlypreview-market__model-num">{row.price}</span>
                  <span className="earlypreview-market__model-unit">{row.priceUnit}</span>
                </td>
                <td className="earlypreview-market__model-amount">{formatM(row.amountM)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="earlypreview-market__total" style={vars({ "--e": totalIn })}>
          <span className="earlypreview-market__total-label">{REVENUE.total.label}</span>
          <span className="earlypreview-market__total-value">{REVENUE.total.display}</span>
        </div>
        <div className="earlypreview-market__stack-bar" aria-hidden>
          {REVENUE.rows.map((row, index) => (
            <span
              key={row.id}
              className={`earlypreview-market__stack-seg is-${row.id}${hover.state(row.id)}`}
              style={vars({ "--w": (row.amountM / total) * 100, "--k": rowIn(index) })}
              {...hover.bind(row.id)}
            >
              <span>
                {row.short} {Math.round((row.amountM / total) * 100)}%
              </span>
            </span>
          ))}
        </div>
      </div>
      <Sources items={REVENUE.sources} e={en(t, 1.0, 1.3)} />
    </Scene>
  );
}

function ExpansionScene({ p }: { p: number }) {
  const { o, t } = sceneClock(p, "expansion");
  const d = ramp(t, [0.3, 1.2]);
  const count = EXPANSION.steps.length;
  return (
    <Scene o={o} label="Beachhead and expansion path" className="earlypreview-market__scene--expansion">
      <SceneTitle title={EXPANSION.title} t={t} />
      <div className="earlypreview-market__body">
        <ol className="earlypreview-market__path" style={vars({ "--d": smooth(d) })}>
          {EXPANSION.steps.map((step, index) => (
            <li
              key={step.id}
              className={`earlypreview-market__step${"beachhead" in step ? " is-now" : ""}`}
              style={vars({ "--e": smooth(ramp(d, [index / count, (index + 0.9) / count])), "--n": index })}
            >
              <span className="earlypreview-market__step-when">
                {step.when}
                {"beachhead" in step ? <strong>{step.beachhead}</strong> : null}
              </span>
              <span className="earlypreview-market__step-node" aria-hidden />
              <span className="earlypreview-market__step-name">{step.name}</span>
              <span className="earlypreview-market__step-acv">{step.acv}</span>
              <span className="earlypreview-market__step-detail">{step.detail}</span>
            </li>
          ))}
        </ol>
      </div>
      <Sources items={EXPANSION.sources} e={en(t, 1.0, 1.3)} />
    </Scene>
  );
}

function SkipIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M7 5.5 13 12 7 18.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16.35 5.5v13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

/**
 * The market section at the bottom of /earlypreview, in four screens: why now, market size, the bottom-up revenue
 * model, and the beachhead with its expansion path. It locks like the audience section on /doehealthdesk2: scrolling
 * steps through stacked screens, every motion follows the scroll, and the lock releases on the expansion path, which
 * stays. On an iPhone it scrubs through a sticky track.
 */
export function EarlyPreviewMarketSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { p, skip } = useDoeHealthDesk2ScrollLock(sectionRef, END);

  return (
    <div className="earlypreview-market-track" style={vars({ "--market-run": END * DOEHEALTH_DESK2_PHONE_STEP_PX })}>
      <section ref={sectionRef} className="earlypreview-market doehealth-desk2-nav-wash-surface" aria-label="The market for personal health agents">
        <WhyNowScene p={p} />
        <SizeScene p={p} />
        <RevenueScene p={p} />
        <ExpansionScene p={p} />
        {p > 0 && p < END ? (
          <button type="button" className="doehealth-desk2-visible__skip" aria-label="Skip the market section" onClick={skip}>
            <SkipIcon />
          </button>
        ) : null}
      </section>
    </div>
  );
}
