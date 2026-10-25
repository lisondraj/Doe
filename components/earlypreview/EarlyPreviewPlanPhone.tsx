"use client";

import Image from "next/image";
import Link from "next/link";
import { type ReactNode, memo } from "react";

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

/* ------------------------------------------------------------ 7. the launch campaign */

const VIEW_AT = 0.3;
const VIEW_LEN = 0.56;
const VIEW_FADE = 0.1;

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`pv-card ${className}`}>{children}</section>;
}

/** Six views, one after another as you scroll: each a piece of the launch, shown as the thing itself. */
export const PhoneCampaign = memo(function PhoneCampaign({ t }: { t: number }) {
  const c = PHONE.campaign;
  const views: ReactNode[] = [
    <>
      <Card className="pv-card--james">
        <span className="pv-james__photo">
          <Image src={c.james.photo} alt="James Lisondra" fill sizes="(max-width: 600px) 90vw, 400px" style={{ objectFit: "cover", objectPosition: "22% 38%" }} />
        </span>
        <div>
          <h3 className="pv-card__title">{c.james.name}</h3>
          <p className="pv-card__line">{c.james.line}</p>
        </div>
      </Card>
      <Card>
        <h3 className="pv-card__title">{c.website.title}</h3>
        <div className="pv-browser">
          <span className="pv-browser__bar">
            <i />
            <i />
            <i />
            <span>{c.website.url}</span>
            <span className="pv-browser__badge">{c.website.badge}</span>
          </span>
          {c.website.rows.map((row) => (
            <span key={row} className="pv-browser__row">
              {row}
              <em>Edit</em>
            </span>
          ))}
        </div>
      </Card>
    </>,
    <Meter key="meter" t={t} start={VIEW_AT + VIEW_LEN} />,
    <>
      <Card>
        <h3 className="pv-card__title">{c.handle.title}</h3>
        <span className="pv-field">
          {c.handle.value}
          <em>{c.handle.status}</em>
        </span>
      </Card>
      <Card>
        <h3 className="pv-card__title">{c.switch.title}</h3>
        <div className="pv-switchto">
          <span className="pv-switchto__from">
            {c.switch.from.map((tool) => (
              <span key={tool}>{tool}</span>
            ))}
          </span>
          <span className="pv-switchto__arrow" aria-hidden>
            →
          </span>
          <span className="pv-switchto__to">{c.switch.to}</span>
        </div>
      </Card>
    </>,
    <>
      <Card>
        <h3 className="pv-card__title">{c.psychiatry.title}</h3>
        <p className="pv-card__line">{c.psychiatry.line}</p>
        <div className="pv-scribe">
          <span className="pv-scribe__wave" aria-hidden>
            {Array.from({ length: 28 }, (_, i) => (
              <i key={i} style={{ height: `${fx(20 + 70 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.6)))}%` }} />
            ))}
          </span>
          {c.psychiatry.note.map((line) => (
            <span key={line} className="pv-scribe__line">
              {line}
            </span>
          ))}
        </div>
      </Card>
      <Card>
        <h3 className="pv-card__title">{c.onePrice.title}</h3>
        <div className="pv-merge">
          {c.onePrice.tools.map((tool) => (
            <span key={tool}>{tool}</span>
          ))}
          <strong>One price</strong>
        </div>
      </Card>
    </>,
    <>
      <Card>
        <h3 className="pv-card__title">{c.privateModel.title}</h3>
        <div className="pv-model">
          <span className="pv-model__tools">
            {c.privateModel.tools.map((tool) => (
              <span key={tool}>{tool}</span>
            ))}
          </span>
          <span className="pv-model__box">
            <strong>{c.privateModel.model}</strong>
            <em>{c.privateModel.compute}</em>
          </span>
        </div>
      </Card>
      <Card className="pv-card--secure">
        <h3 className="pv-card__title">{c.secure.title}</h3>
        <ol className="pv-card__points">
          {c.secure.lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ol>
      </Card>
    </>,
    <>
      <Card className="pv-card--launch">
        <h3 className="pv-card__title">{c.toronto.title}</h3>
        <p className="pv-card__line">{c.toronto.line}</p>
        <div className="pv-tiers">
          {c.toronto.tiers.map((tier) => (
            <div key={tier.name} className={"detail" in tier ? "is-seed" : undefined}>
              <span className="pv-tiers__name">{tier.name}</span>
              <strong>{tier.price}</strong>
              {"detail" in tier ? <span className="pv-tiers__detail">{tier.detail}</span> : null}
            </div>
          ))}
        </div>
      </Card>
      <Link href={c.canada.href} className="pv-card pv-card--link">
        <span className="pv-card__title">{c.canada.title}</span>
        <span aria-hidden>→</span>
      </Link>
    </>,
  ];
  const boundary = (i: number) => VIEW_AT + (i + 1) * VIEW_LEN;
  const at = views.slice(0, -1).reduce<number>((sum, _, i) => sum + en(t, boundary(i) - VIEW_FADE, boundary(i) + VIEW_FADE), 0);
  return (
    <div className="pv pv-campaign" style={rise(t, 0, 0.15)}>
      <div className="pv-pager" aria-hidden>
        <span>{`0${Math.round(at) + 1}`}</span>
        <span className="pv-pager__track">
          <i style={{ width: `${fx(((at + 1) / views.length) * 100)}%` }} />
        </span>
        <span>{`0${views.length}`}</span>
      </div>
      <div className="pv-campaign__stack">
        {views.map((view, i) => {
          const start = VIEW_AT + i * VIEW_LEN;
          const end = start + VIEW_LEN;
          const fadeIn = i === 0 ? 1 : en(t, start, start + VIEW_FADE);
          const fadeOut = i === views.length - 1 ? 1 : 1 - en(t, end - VIEW_FADE, end);
          const shown = fx(fadeIn * fadeOut);
          return (
            <div
              key={i}
              className="pv-campaign__view"
              style={{
                opacity: shown,
                visibility: shown < 0.01 ? "hidden" : undefined,
                transform: `translateY(${fx((1 - fadeIn) * 0.75 - (1 - fadeOut) * 0.75)}rem)`,
              }}
              aria-hidden={shown < 0.5}
            >
              {view}
            </div>
          );
        })}
      </div>
    </div>
  );
});

/** How well a patient's agent can find and answer for a clinic, climbing as each piece of the page is added. */
function Meter({ t, start }: { t: number; start: number }) {
  const m = PHONE.campaign.meter;
  const k = ramp(t, [start + 0.06, start + VIEW_LEN * 0.8]);
  let total = 0;
  const steps = m.steps.map((step, i) => {
    const on = ramp(k, [i / m.steps.length, (i + 0.6) / m.steps.length]);
    total += step.add * on;
    return { ...step, on };
  });
  return (
    <Card className="pv-card--meter">
      <h3 className="pv-card__title">{m.title}</h3>
      <div className="pv-meter">
        <div className="pv-meter__figure">
          <strong>{`${Math.round(total)}%`}</strong>
          <span>
            {m.label}
            <em>{m.note}</em>
          </span>
        </div>
        <span className="pv-meter__bar" aria-hidden>
          <i style={{ width: `${fx(total)}%` }} />
        </span>
        <ul className="pv-meter__steps">
          {steps.map((step) => (
            <li key={step.text} className={step.on >= 1 ? "is-on" : undefined} style={{ opacity: fx(0.35 + step.on * 0.65) }}>
              <i aria-hidden />
              {step.text}
              <span>{`+${step.add}%`}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------ 8. the path to a hospital LOI */

/** How long health systems take to buy, against the plan's ten months to a letter of intent. */
function CycleBars({ t }: { t: number }) {
  const c = PHONE.systems.cycle;
  const most = c.rows.reduce((max, row) => Math.max(max, row.to), 0);
  return (
    <div className="pv-cycle" style={rise(t, 0, 0.2)}>
      {c.rows.map((row, i) => (
        <div key={row.label} className={`pv-cycle__row${"plan" in row ? " is-seed" : ""}`}>
          <span className="pv-cycle__label">{row.label}</span>
          <span className="pv-cycle__track" aria-hidden>
            <i
              style={{
                left: `${fx((row.from / most) * 100)}%`,
                width: `${fx(((row.to - row.from) / most) * 100 * en(t, 0.4 + i * 0.2, 0.9 + i * 0.2))}%`,
              }}
            />
          </span>
          <span className="pv-cycle__value">{row.value}</span>
        </div>
      ))}
    </div>
  );
}

/** The path to a hospital letter of intent by Q4 ’27: each gate dated, what it produces, and who signs it. */
export const PhoneSystems = memo(function PhoneSystems({ t }: { t: number }) {
  const copy = PHONE.systems;
  return (
    <div className="pv">
      <CycleBars t={t} />
      <ol className="pv-gates">
        {copy.gates.map((gate, i) => (
          <li
            key={gate.title}
            className={"seed" in gate ? "is-seed" : "after" in gate ? "is-after" : undefined}
            style={vars({ "--e": fx(en(t, 0.55 + i * 0.16, 0.95 + i * 0.16)) })}
          >
            <span className="pv-gates__when">{gate.when}</span>
            <div>
              <span className="pv-gates__title">{gate.title}</span>
              <span className="pv-gates__text">{gate.text}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
});
