"use client";

import { memo } from "react";

import { cssVars as vars, scrollRamp as ramp } from "@/lib/doehealthdesk2/use-doehealthdesk2-scroll-lock";
import { EARLYPREVIEW_PLAN as PLAN, EARLYPREVIEW_PLAN_QUARTERS as QUARTERS } from "@/lib/earlypreview/earlypreview-plan-copy";

/**
 * The iPhone's go-to-market screens. One system for all eight: left-aligned type on a 4px grid, hairline rules, one
 * figure set large where a screen has one, and a single precise chart (a track, bars, a timeline, a small org chart)
 * drawn in 1px lines and solid dots. Salmon marks only what lands at Seed. Every motion is a ramp over the screen's
 * clock `t`: rows rise in one after another and tracks and bars fill.
 */

const smooth = (x: number) => x * x * (3 - 2 * x);
const en = (t: number, a: number, b: number) => smooth(ramp(t, [a, b]));
const fx = (n: number) => Number(n.toFixed(3));
/** A row's rise, the nth in its screen. */
const rise = (t: number, n: number, from = 0.3) => vars({ "--e": fx(en(t, from + n * 0.14, from + 0.4 + n * 0.14)) });

/* ------------------------------------------------------------ 1. supply, agents and revenue */

/** Where each lane's stretch of the screen starts, and how long it holds. The three run one after another. */
const LANE_AT = 0.3;
const LANE_LEN = 1.05;
const LANE_FADE = 0.12;

/**
 * The three lanes one at a time, as you scroll: a switcher across the top follows the scroll, and each lane shows its
 * Seed figure over its own quarter-by-quarter timeline, today to Seed. The spine is a column of the section's dots; it
 * fills down as the lane plays, and each quarter's milestone comes in as the fill reaches it.
 */
export const PhoneTimeline = memo(function PhoneTimeline({ t }: { t: number }) {
  const copy = PLAN.timeline;
  const lanes = copy.lanes;
  // The switcher's bar moves with the swap between lanes, so it is always under the lane on screen.
  const boundary = (i: number) => LANE_AT + (i + 1) * LANE_LEN;
  const at = lanes.slice(0, -1).reduce((sum, _, i) => sum + en(t, boundary(i) - LANE_FADE, boundary(i) + LANE_FADE), 0);
  const current = Math.round(at);
  return (
    <div className="pv pv-lanes" style={rise(t, 0, 0.15)}>
      <div className="pv-switch" role="tablist" aria-label="Lanes">
        {lanes.map((lane, i) => (
          <span key={lane.id} role="tab" aria-selected={current === i} className={current === i ? "is-on" : undefined}>
            {lane.name}
          </span>
        ))}
        <i className="pv-switch__bar" style={{ transform: `translateX(${fx(at * 100)}%)` }} aria-hidden />
      </div>
      <div className="pv-lanes__stack">
        {lanes.map((lane, i) => {
          const start = LANE_AT + i * LANE_LEN;
          const end = start + LANE_LEN;
          // One lane at a time: the one leaving is gone before the next comes in, so the two never overlap.
          const fadeIn = i === 0 ? 1 : en(t, start, start + LANE_FADE);
          const fadeOut = i === lanes.length - 1 ? 1 : 1 - en(t, end - LANE_FADE, end);
          const shown = fx(fadeIn * fadeOut);
          const shift = fx((1 - fadeIn) * 0.5 - (1 - fadeOut) * 0.5);
          const fill = ramp(t, [start + LANE_FADE, start + LANE_LEN * 0.75]);
          return (
            <section
              key={lane.id}
              className="pv-lane"
              style={{ opacity: shown, visibility: shown < 0.01 ? "hidden" : undefined, transform: `translateY(${shift}rem)` }}
              aria-hidden={shown < 0.5}
            >
              <div className="pv-lane__figure">
                <strong>{lane.big.value}</strong>
                <span>
                  {lane.big.unit}
                  <em>{lane.big.sub}</em>
                </span>
              </div>
              <ol className="pv-quarters" style={vars({ "--k": fx(fill) })}>
                <span className="pv-quarters__spine" aria-hidden />
                {QUARTERS.map((quarter, q) => {
                  const milestone = lane.milestones.find((m) => m.q === q);
                  const reach = (q + 0.5) / QUARTERS.length;
                  const on = fx(ramp(fill, [reach - 0.08, reach]));
                  const seed = milestone && "seed" in milestone;
                  return (
                    <li
                      key={quarter}
                      className={`${milestone ? "has-step" : ""}${seed ? " is-seed" : ""}${q === 0 ? " is-now" : ""}`}
                      style={vars({ "--on": on })}
                    >
                      <i aria-hidden />
                      <span className="pv-quarters__when">
                        {quarter}
                        {q === 0 ? <em>{copy.now}</em> : seed ? <em>{copy.seed}</em> : null}
                      </span>
                      <span className="pv-quarters__text">{milestone ? milestone.text : ""}</span>
                    </li>
                  );
                })}
              </ol>
            </section>
          );
        })}
      </div>
    </div>
  );
});

/* ------------------------------------------------------------ 2. four ways in */

/** The four ways in, each with the actual sources, and what they add up to. */
export const PhoneSources = memo(function PhoneSources({ t }: { t: number }) {
  const copy = PLAN.sources;
  return (
    <div className="pv">
      <ol className="pv-list">
        {copy.groups.map((group, i) => (
          <li key={group.id} style={rise(t, i)}>
            <span className="pv-list__num">{`0${i + 1}`}</span>
            <div>
              <h3 className="pv-list__title">{group.name}</h3>
              <p className="pv-list__body">{group.items.map((item) => item.name).join(" · ")}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="pv-total" style={rise(t, 4)}>
        <span className="pv-total__value">{PLAN.sourcesResult.value}</span>
        <span className="pv-total__label">
          {PLAN.sourcesResult.label}
          <span>{PLAN.sourcesResult.sub}</span>
        </span>
      </div>
    </div>
  );
});

/* ------------------------------------------------------------ 3. the rooms we'll be in */

/** The calendar to Seed, a row a month, each event marked by who it is for. */
export const PhoneEvents = memo(function PhoneEvents({ t }: { t: number }) {
  const copy = PLAN.events;
  const yearOf = (month: number) => copy.firstYear + (month < 2 ? 0 : month < 14 ? 1 : 2);
  const months = Array.from(new Set(copy.list.map((event) => event.month))).sort((a, b) => a - b);
  return (
    <div className="pv">
      <ul className="pv-key" style={rise(t, 0, 0.2)}>
        {copy.kinds.map((kind) => (
          <li key={kind.id} className={`is-${kind.id}`}>
            <i aria-hidden />
            {kind.name}
          </li>
        ))}
      </ul>
      <ol className="pv-cal">
        {months.map((month, i) => (
          <li key={month} style={vars({ "--e": fx(en(t, 0.35 + i * 0.09, 0.7 + i * 0.09)) })}>
            <span className="pv-cal__when">{`${copy.months[month]} ’${String(yearOf(month)).slice(2)}`}</span>
            <ul>
              {copy.list
                .filter((event) => event.month === month)
                .map((event) => (
                  <li key={event.name} className={`is-${event.kind}`}>
                    <i aria-hidden />
                    <span className="pv-cal__name">{event.name}</span>
                    <span className="pv-cal__place">{event.place}</span>
                  </li>
                ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
});

/* ------------------------------------------------------------ 4. private services and multi-site */

/** The two kinds of practice the pre-seed plan is built on, then what one group looks like. */
export const PhoneGroups = memo(function PhoneGroups({ t }: { t: number }) {
  const copy = PLAN.groups;
  const draw = en(t, 1.0, 1.6);
  const sites = Array.from({ length: copy.sites }, (_, s) => s);
  return (
    <div className="pv">
      <div className="pv-stats">
        <section style={rise(t, 0)}>
          <span className="pv-eyebrow">{copy.phone.private.name}</span>
          <strong className="pv-stats__value">{copy.phone.private.value}</strong>
          <p>{copy.phone.private.label}</p>
        </section>
        <section style={rise(t, 1)}>
          <span className="pv-eyebrow">{copy.phone.multi.name}</span>
          <strong className="pv-stats__value is-seed">{copy.share.value}</strong>
          <p>{copy.share.label}</p>
        </section>
      </div>
      <p className="pv-note" style={rise(t, 2)}>
        {copy.phone.private.types.join(", ")}. {copy.phone.private.note}
      </p>
      <figure className="pv-org" style={rise(t, 3)}>
        <svg viewBox="0 0 320 96" aria-label="One contract covers four locations and twelve providers">
          <rect x="0.5" y="34.5" width="72" height="27" rx="13.5" className="pv-org__root" />
          <text x="36.5" y="52" textAnchor="middle" className="pv-org__label">1 contract</text>
          {sites.map((s) => {
            const x = 104 + s * 54;
            const on = fx(ramp(draw, [s * 0.18, s * 0.18 + 0.4]));
            return (
              <g key={s} style={{ opacity: on }}>
                <path d={`M73 48H${x}`} className="pv-org__line" />
                <rect x={x + 0.5} y="34.5" width="44" height="27" rx="13.5" className="pv-org__site" />
                <text x={x + 22.5} y="52" textAnchor="middle" className="pv-org__label">{`#${s + 1}`}</text>
                {Array.from({ length: copy.perSite }, (_, v) => (
                  <circle key={v} cx={x + 10.5 + v * 12} cy="80" r="3" className="pv-org__seat" />
                ))}
                <path d={`M${x + 22.5} 62V72`} className="pv-org__line" />
              </g>
            );
          })}
        </svg>
        <figcaption>{copy.phone.multi.note}</figcaption>
      </figure>
      <ul className="pv-figures" style={rise(t, 4)}>
        {copy.figures.map((figure) => (
          <li key={figure.id}>
            <strong>{figure.value}</strong>
            {figure.label}
          </li>
        ))}
      </ul>
    </div>
  );
});

/* ------------------------------------------------------------ 5. the agents we partner with */

/** The partner pipeline as bars, each as long as its count against the target list. */
export const PhoneAgents = memo(function PhoneAgents({ t }: { t: number }) {
  const copy = PLAN.agents;
  const most = copy.columns[0].value;
  return (
    <div className="pv">
      <ol className="pv-bars">
        {copy.columns.map((column, i) => (
          <li key={column.id} className={"salmon" in column ? "is-seed" : undefined} style={rise(t, i)}>
            <div className="pv-bars__head">
              <span className="pv-bars__name">{column.name}</span>
              <span className="pv-bars__value">{column.value}</span>
            </div>
            <span className="pv-bars__bar" aria-hidden>
              <i style={{ width: `${fx((column.value / most) * 100 * en(t, 0.6 + i * 0.18, 1.2 + i * 0.18))}%` }} />
            </span>
            <span className="pv-bars__meta">
              {column.how}
              <span>{column.when}</span>
            </span>
          </li>
        ))}
      </ol>
      <p className="pv-note" style={rise(t, 4)}>
        {copy.sources}
      </p>
    </div>
  );
});

/* ------------------------------------------------------------ 6. the loop */

/** One practice's missed demand, then the three steps that turn it into a claim. */
export const PhoneLoop = memo(function PhoneLoop({ t }: { t: number }) {
  const copy = PLAN.loop;
  return (
    <div className="pv">
      <div className="pv-hero" style={rise(t, 0)}>
        <strong className="pv-hero__value">{copy.page.missed}</strong>
        <p>
          {copy.page.missedLine}
          <span>{copy.page.name}</span>
        </p>
      </div>
      <ol className="pv-steps">
        {copy.stages.map((stage, i) => (
          <li key={stage.lead} style={rise(t, i + 1)}>
            <span className="pv-steps__dot" aria-hidden />
            <span className="pv-eyebrow">{stage.lead}</span>
            <p>{stage.text}</p>
          </li>
        ))}
      </ol>
      <div className="pv-total" style={rise(t, 4)}>
        <span className="pv-total__value is-seed">{copy.stat.value}</span>
        <span className="pv-total__label">{copy.stat.caption}</span>
      </div>
    </div>
  );
});

/* ------------------------------------------------------------ 7. first email to paying */

/** The 45 days on one scale, then each step on its day. */
export const PhoneJourney = memo(function PhoneJourney({ t }: { t: number }) {
  const copy = PLAN.journey;
  const last = copy.marks[copy.marks.length - 1].day;
  const k = ramp(t, [0.6, 1.8]);
  return (
    <div className="pv">
      <div className="pv-hero" style={rise(t, 0)}>
        <strong className="pv-hero__value is-seed">{copy.stat.value}</strong>
        <p>{copy.stat.caption}</p>
      </div>
      <span className="pv-track pv-track--days" style={vars({ "--k": fx(k) })} aria-hidden>
        <span className="pv-track__fill" />
        {copy.marks.map((mark) => {
          const at = mark.day / last;
          return <i key={mark.text} className={"salmon" in mark ? "is-seed" : undefined} style={{ left: `${fx(at * 100)}%`, opacity: fx(ramp(k, [at - 0.05, at])) }} />;
        })}
      </span>
      <ol className="pv-days">
        {copy.marks.map((mark, i) => (
          <li key={mark.text} className={"salmon" in mark ? "is-seed" : undefined} style={rise(t, i, 0.5)}>
            <span className="pv-days__day">{`Day ${mark.day}`}</span>
            <span>{mark.text}</span>
          </li>
        ))}
      </ol>
    </div>
  );
});

/* ------------------------------------------------------------ 8. from practices to the health system */

/** How a health system signs, step by step to the pilots at Seed, and system-wide after. */
export const PhoneSystems = memo(function PhoneSystems({ t }: { t: number }) {
  const copy = PLAN.systems;
  return (
    <div className="pv">
      <ol className="pv-steps pv-steps--dated">
        {copy.steps.map((step, i) => (
          <li key={step.name} className={"salmon" in step ? "is-seed" : i === copy.steps.length - 1 ? "is-after" : undefined} style={rise(t, i, 0.3)}>
            <span className="pv-steps__dot" aria-hidden />
            <span className="pv-steps__when">{step.when}</span>
            <p>{step.name}</p>
          </li>
        ))}
      </ol>
    </div>
  );
});
