"use client";

import { memo } from "react";

import { cssVars as vars, scrollRamp as ramp } from "@/lib/doehealthdesk2/use-doehealthdesk2-scroll-lock";
import { EARLYPREVIEW_PLAN as PLAN } from "@/lib/earlypreview/earlypreview-plan-copy";
import { EARLYPREVIEW_PLAN_PHONE as PHONE } from "@/lib/earlypreview/earlypreview-plan-phone-copy";

/**
 * The iPhone's go-to-market screens, written for an investor reading the plan: dated rows, named sources and real
 * counts. One system for all eight: left-aligned type, hairline rules, a key of marks where a screen mixes kinds of
 * thing, and salmon only for what lands at Seed. Every motion is a ramp over the screen's clock `t`: rows rise in one
 * after another, and bars fill.
 */

const smooth = (x: number) => x * x * (3 - 2 * x);
const en = (t: number, a: number, b: number) => smooth(ramp(t, [a, b]));
const fx = (n: number) => Number(n.toFixed(3));
/** A row's rise, the nth in its screen. */
const rise = (t: number, n: number, from = 0.3) => vars({ "--e": fx(en(t, from + n * 0.14, from + 0.4 + n * 0.14)) });

/* ------------------------------------------------------------ 1. the plan, quarter by quarter */

/** A key of the three lanes, the same marks the calendar rows use. */
function LaneKey({ style }: { style?: ReturnType<typeof vars> }) {
  return (
    <ul className="pv-key pv-key--lanes" style={style}>
      {PHONE.lanes.map((lane) => (
        <li key={lane.id} className={`is-${lane.id}`}>
          <i aria-hidden />
          {lane.name}
        </li>
      ))}
    </ul>
  );
}

/** The three lanes on one calendar: a row a quarter, each thing that ships marked by its lane, Seed last. */
export const PhoneTimeline = memo(function PhoneTimeline({ t }: { t: number }) {
  const quarters = PHONE.timeline.quarters;
  return (
    <div className="pv">
      <LaneKey style={rise(t, 0, 0.2)} />
      <ol className="pv-cal pv-cal--plan">
        {quarters.map((quarter, i) => (
          <li key={quarter.when} className={"seed" in quarter ? "is-seed" : undefined} style={vars({ "--e": fx(en(t, 0.35 + i * 0.22, 0.75 + i * 0.22)) })}>
            <span className="pv-cal__when">
              {quarter.when}
              {"tag" in quarter ? <em>{quarter.tag}</em> : null}
            </span>
            <ul>
              {quarter.items.map((item) => (
                <li key={item.text} className={`is-${item.lane}`}>
                  <i aria-hidden />
                  <span className="pv-cal__name">{item.text}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
});

/* ------------------------------------------------------------ 2. where the practices come from */

/** The public registers the Index is built from, with their size, and the Index they add up to. */
export const PhoneSources = memo(function PhoneSources({ t }: { t: number }) {
  const copy = PHONE.sources;
  return (
    <div className="pv">
      <ol className="pv-table">
        {copy.rows.map((row, i) => (
          <li key={row.name} style={rise(t, i)}>
            <div>
              <span className="pv-table__name">{row.name}</span>
              <span className="pv-table__text">{row.gives}</span>
            </div>
            <span className="pv-table__size">{row.size}</span>
          </li>
        ))}
      </ol>
      <div className="pv-split" style={rise(t, 5)}>
        <div>
          <span className="pv-eyebrow">Indexed today</span>
          <strong>{copy.split.today}</strong>
        </div>
        <div>
          <span className="pv-eyebrow">By Seed</span>
          <strong className="is-seed">{copy.split.total}</strong>
          <span className="pv-split__sub">
            {copy.split.canada} Canada, {copy.split.us} U.S.
          </span>
        </div>
      </div>
      <p className="pv-source" style={rise(t, 6)}>
        {copy.note}
      </p>
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

/* ------------------------------------------------------------ 4. who pays first */

/** Private-pay practices, then the owner-run groups the Seed plan counts on, then the networks that come after. */
export const PhoneGroups = memo(function PhoneGroups({ t }: { t: number }) {
  const copy = PHONE.groups;
  return (
    <div className="pv">
      <section className="pv-block" style={rise(t, 0)}>
        <div className="pv-block__figure">
          <strong>{copy.privatePay.value}</strong>
          <span>{copy.privatePay.label}</span>
        </div>
        <p>{copy.privatePay.text}</p>
      </section>
      <section className="pv-block" style={rise(t, 1)}>
        <div className="pv-block__figure">
          <strong className="is-seed">{PLAN.groups.share.value}</strong>
          <span>{PLAN.groups.share.label}</span>
        </div>
        <ul className="pv-figures">
          {copy.seed.map((figure) => (
            <li key={figure.label}>
              <strong>{figure.value}</strong>
              {figure.label}
            </li>
          ))}
        </ul>
        <p>{copy.seedText}</p>
      </section>
      <section style={rise(t, 2)}>
        <span className="pv-eyebrow">{copy.networks.label}</span>
        <ol className="pv-table pv-table--tight">
          {copy.networks.rows.map((row) => (
            <li key={row.name}>
              <div>
                <span className="pv-table__name">{row.name}</span>
                <span className="pv-table__text">
                  {row.what}, {row.when}
                </span>
              </div>
              <span className="pv-table__size">{row.size}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
});

/* ------------------------------------------------------------ 5. the agents we partner with */

/** The partner pipeline as bars, each as long as its count against the target list, then where developers find Doe. */
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
      <ol className="pv-table pv-table--tight" style={rise(t, 4)}>
        {PHONE.agents.listings.map((row) => (
          <li key={row.name}>
            <div>
              <span className="pv-table__name">{row.name}</span>
              <span className="pv-table__text">{row.text}</span>
            </div>
            <span className="pv-table__size is-small">{row.when}</span>
          </li>
        ))}
      </ol>
    </div>
  );
});

/* ------------------------------------------------------------ 6. the missed-demand report */

/** The report itself, as the owner gets it, then how many claims it starts. */
export const PhoneLoop = memo(function PhoneLoop({ t }: { t: number }) {
  const email = PHONE.loop.email;
  const stat = PLAN.loop.stat;
  return (
    <div className="pv">
      <article className="pv-email" style={rise(t, 0)}>
        <span className="pv-email__label">{email.label}</span>
        <dl className="pv-email__meta">
          <div>
            <dt>From</dt>
            <dd>{email.from}</dd>
          </div>
          <div>
            <dt>To</dt>
            <dd>{email.to}</dd>
          </div>
        </dl>
        <p className="pv-email__subject">{email.subject}</p>
        <ul className="pv-email__rows">
          {email.rows.map((row, i) => (
            <li key={row.text} style={rise(t, i + 1, 0.5)}>
              <strong>{row.value}</strong>
              {row.text}
            </li>
          ))}
        </ul>
        <span className="pv-email__action" style={rise(t, 4, 0.5)}>
          {email.action}
        </span>
      </article>
      <div className="pv-total" style={rise(t, 5)}>
        <span className="pv-total__value is-seed">{stat.value}</span>
        <span className="pv-total__label">{stat.caption}</span>
      </div>
    </div>
  );
});

/* ------------------------------------------------------------ 7. first email to paying */

/** The 45 days on one scale, then each step on its day, and what it costs to acquire a practice. */
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
      <p className="pv-note" style={rise(t, 6, 0.5)}>
        {copy.foot}
      </p>
    </div>
  );
});

/* ------------------------------------------------------------ 8. one health system */

/** How one health system signs: a row a step, dated, with the security work it needs. */
export const PhoneSystems = memo(function PhoneSystems({ t }: { t: number }) {
  const steps = PHONE.systems.steps;
  return (
    <div className="pv">
      <ol className="pv-cal pv-cal--steps">
        {steps.map((step, i) => (
          <li
            key={step.text}
            className={"seed" in step ? "is-seed" : "after" in step ? "is-after" : undefined}
            style={vars({ "--e": fx(en(t, 0.3 + i * 0.16, 0.7 + i * 0.16)) })}
          >
            <span className="pv-cal__when">{step.when}</span>
            <span className="pv-cal__name">{step.text}</span>
          </li>
        ))}
      </ol>
    </div>
  );
});
