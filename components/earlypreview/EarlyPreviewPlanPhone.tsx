"use client";

import Image from "next/image";
import Link from "next/link";
import { type ReactNode, memo } from "react";

import { cssVars as vars, scrollRamp as ramp } from "@/lib/doehealthdesk2/use-doehealthdesk2-scroll-lock";
import { EARLYPREVIEW_PLAN as PLAN, EARLYPREVIEW_PLAN_QUARTERS as QUARTERS } from "@/lib/earlypreview/earlypreview-plan-copy";
import { EARLYPREVIEW_PLAN_PHONE as PHONE } from "@/lib/earlypreview/earlypreview-plan-phone-copy";

/**
 * The iPhone's go-to-market screens. Each one is a single large picture with a few words on it: a three-lane chart,
 * a funnel, the conference calendar, a grid of fifty dots, campaign posters, and a quarter grid of gates. The figures
 * carry the detail. Salmon marks what lands at Seed. Every motion is a ramp over the screen's clock `t`.
 */

const smooth = (x: number) => x * x * (3 - 2 * x);
const en = (t: number, a: number, b: number) => smooth(ramp(t, [a, b]));
const fx = (n: number) => Number(n.toFixed(3));
/** A part's rise, the nth on its screen. */
const rise = (t: number, n: number, from = 0.3) => vars({ "--e": fx(en(t, from + n * 0.14, from + 0.4 + n * 0.14)) });

/* ------------------------------------------------------------ 1. the plan */

/** The three lanes as columns down the quarters to Seed, each filling as you scroll, its Seed figure at the foot. */
export const PhoneTimeline = memo(function PhoneTimeline({ t }: { t: number }) {
  const columns = PHONE.pictures.plan.columns;
  const k = ramp(t, [0.5, 2.4]);
  const rows = QUARTERS.length;
  return (
    <div className="pv pv-lanes3" style={vars({ "--rows": rows, "--k": fx(k) })}>
      <div className="pv-lanes3__grid">
        <ol className="pv-lanes3__quarters" aria-hidden>
          {QUARTERS.map((quarter, q) => (
            <li key={quarter} className={q === rows - 1 ? "is-seed" : undefined}>
              {quarter}
            </li>
          ))}
        </ol>
        {columns.map((column, c) => (
          <section key={column.lane} className={`pv-lanes3__col is-${column.lane}`} style={rise(t, c, 0.2)}>
            <span className="pv-lanes3__name">{column.name}</span>
            <span className="pv-lanes3__track" aria-hidden>
              <i />
            </span>
            {column.marks.map((mark) => {
              const at = (mark.q + 0.5) / rows;
              return (
                <span
                  key={mark.label}
                  className="pv-lanes3__mark"
                  style={{ top: `${fx(at * 100)}%`, opacity: fx(0.25 + 0.75 * ramp(k, [at - 0.06, at])) }}
                >
                  <i aria-hidden />
                  {mark.label}
                </span>
              );
            })}
            <span className="pv-lanes3__seed" style={{ opacity: fx(ramp(k, [0.9, 1])) }}>
              <strong>{column.seed.value}</strong>
              {column.seed.label}
            </span>
          </section>
        ))}
      </div>
    </div>
  );
});

/* ------------------------------------------------------------ 2. the funnel */

/** From every public provider record to the paying practices at Seed, as one funnel. */
export const PhoneSources = memo(function PhoneSources({ t }: { t: number }) {
  const f = PHONE.pictures.funnel;
  const widths = [100, 76, 54, 34];
  return (
    <div className="pv pv-funnel">
      <p className="pv-funnel__from" style={rise(t, 0, 0.2)}>
        {f.sources.map((source) => (
          <span key={source}>{source}</span>
        ))}
      </p>
      <ol className="pv-funnel__stages">
        {f.stages.map((stage, i) => (
          <li
            key={stage.label}
            className={i === f.stages.length - 1 ? "is-seed" : undefined}
            style={{ width: `${widths[i]}%`, ...vars({ "--e": fx(en(t, 0.35 + i * 0.25, 0.8 + i * 0.25)), "--i": i }) }}
          >
            <strong>{stage.value}</strong>
            <span>{stage.label}</span>
          </li>
        ))}
      </ol>
      <p className="pv-funnel__filters" style={rise(t, 5)}>
        <span>Filtered for</span>
        {f.filters.join(" · ")}
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

/** Fifty dots, one a team on the target list, lighting as they move from the list to live. */
export const PhoneAgents = memo(function PhoneAgents({ t }: { t: number }) {
  const cols = PLAN.agents.columns;
  const [target, sandbox, integrated, active] = cols.map((column) => column.value);
  const stage = [en(t, 0.4, 0.8), en(t, 0.8, 1.2), en(t, 1.2, 1.6), en(t, 1.6, 2.0)];
  const levelOf = (i: number) => (i < active ? 3 : i < integrated ? 2 : i < sandbox ? 1 : 0);
  return (
    <div className="pv pv-dots">
      <div className="pv-dots__grid" aria-hidden>
        {Array.from({ length: target }, (_, i) => {
          const level = levelOf(i);
          // Each dot lights up to its level, one stage at a time.
          const lit = [0, 1, 2, 3].filter((s) => s <= level && stage[s] > 0.5).pop() ?? -1;
          return <i key={i} className={`is-l${lit}`} style={{ opacity: fx(0.2 + 0.8 * stage[0]) }} />;
        })}
      </div>
      <ul className="pv-dots__key">
        {cols.map((column, i) => (
          <li key={column.id} className={`is-l${i}`} style={vars({ "--e": fx(stage[i]) })}>
            <i aria-hidden />
            <strong>{column.value}</strong>
            <span>{column.name}</span>
          </li>
        ))}
      </ul>
      <p className="pv-dots__found" style={rise(t, 6)}>
        <span>Found on</span>
        {PHONE.pictures.agents.found.join(" · ")}
      </p>
    </div>
  );
});

/* ------------------------------------------------------------ 7. the launch campaigns */

const VIEW_AT = 0.3;
const VIEW_LEN = 0.56;
const VIEW_FADE = 0.1;

/** Six campaign posters, one after another as you scroll: a few big words on the thing itself. */
export const PhoneCampaign = memo(function PhoneCampaign({ t }: { t: number }) {
  const c = PHONE.campaign;
  const posters: ReactNode[] = [
    <section key="james" className="pv-poster pv-poster--photo">
      <Image src={c.james.photo} alt="James Lisondra" fill sizes="(max-width: 600px) 92vw, 420px" className="pv-poster__img" />
      <div className="pv-poster__over">
        <h3>Meet James.</h3>
        <p>Med student. Co-founder.</p>
      </div>
    </section>,
    <section key="claim" className="pv-poster">
      <h3>Claim your page.</h3>
      <div className="pv-browser pv-browser--big">
        <span className="pv-browser__bar">
          <span>{c.handle.value}</span>
          <span className="pv-browser__badge">{c.website.badge}</span>
        </span>
        {c.website.rows.map((row) => (
          <span key={row} className="pv-browser__row">
            {row}
            <em>Edit</em>
          </span>
        ))}
      </div>
      <div className="pv-switch">
        <p>{c.switch.title}</p>
        <span className="pv-switch__row">
          {c.switch.from.map((tool) => (
            <s key={tool}>{tool}</s>
          ))}
          <b>{c.switch.to}</b>
        </span>
      </div>
    </section>,
    <Meter key="meter" t={t} start={VIEW_AT + 2 * VIEW_LEN} />,
    <section key="psych" className="pv-poster">
      <h3>{c.psychiatry.title}</h3>
      <span className="pv-wave" aria-hidden>
        {Array.from({ length: 40 }, (_, i) => (
          <i key={i} style={{ height: `${fx(14 + 80 * Math.abs(Math.sin(i * 1.3) * Math.cos(i * 0.45)))}%` }} />
        ))}
      </span>
      <ul className="pv-note-lines">
        {c.psychiatry.note.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <p className="pv-poster__foot">{c.psychiatry.line}</p>
    </section>,
    <section key="model" className="pv-poster">
      <h3>One price. Your own model.</h3>
      <div className="pv-orbit" aria-hidden>
        <span className="pv-orbit__core">
          <strong>Your model</strong>
          <em>Private compute</em>
        </span>
        {c.onePrice.tools.map((tool, i) => (
          <span key={tool} className="pv-orbit__tool" style={vars({ "--a": i * (360 / c.onePrice.tools.length) - 90 })}>
            {tool}
          </span>
        ))}
      </div>
      <p className="pv-poster__foot">{c.secure.title}</p>
    </section>,
    <section key="toronto" className="pv-poster pv-poster--launch">
      <h3>Doe Toronto.</h3>
      <p className="pv-poster__sub">Launching soon. Be ready before launch day.</p>
      <div className="pv-launch">
        <div>
          <strong>Free</strong>
          <span>Waitlist</span>
        </div>
        <div className="is-seed">
          <strong>$9.99</strong>
          <span>Founding cohort deposit. 3 months free.</span>
        </div>
      </div>
      <Link href={c.canada.href} className="pv-poster__link">
        {c.canada.title}
        <span aria-hidden>→</span>
      </Link>
    </section>,
  ];
  const boundary = (i: number) => VIEW_AT + (i + 1) * VIEW_LEN;
  const at = posters.slice(0, -1).reduce<number>((sum, _, i) => sum + en(t, boundary(i) - VIEW_FADE, boundary(i) + VIEW_FADE), 0);
  return (
    <div className="pv pv-campaign" style={rise(t, 0, 0.15)}>
      <div className="pv-pager" aria-hidden>
        {posters.map((_, i) => (
          <i key={i} style={{ opacity: fx(0.25 + 0.75 * Math.max(0, 1 - Math.abs(at - i))) }} />
        ))}
      </div>
      <div className="pv-campaign__stack">
        {posters.map((poster, i) => {
          const start = VIEW_AT + i * VIEW_LEN;
          const end = start + VIEW_LEN;
          const fadeIn = i === 0 ? 1 : en(t, start, start + VIEW_FADE);
          const fadeOut = i === posters.length - 1 ? 1 : 1 - en(t, end - VIEW_FADE, end);
          const shown = fx(fadeIn * fadeOut);
          return (
            <div
              key={i}
              className="pv-campaign__view"
              style={{ opacity: shown, visibility: shown < 0.01 ? "hidden" : undefined, transform: `scale(${fx(0.97 + 0.03 * shown)})` }}
              aria-hidden={shown < 0.5}
            >
              {poster}
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
  let sum = 0;
  const steps = m.steps.map((step, i) => {
    const on = ramp(k, [i / m.steps.length, (i + 0.6) / m.steps.length]);
    total += step.add * on;
    sum += step.add;
    return { ...step, on, sum };
  });
  return (
    <section className="pv-poster pv-poster--meter">
      <h3>Teach agents first.</h3>
      <strong className="pv-meter__big">{`${Math.round(total)}%`}</strong>
      <p className="pv-poster__sub">chance a patient’s agent finds you and gets every answer</p>
      <span className="pv-meter__stairs" aria-hidden>
        {steps.map((step) => (
          <i key={step.text} style={vars({ "--h": step.sum })}>
            <b style={{ transform: `scaleY(${fx(step.on)})` }} />
            <em style={{ opacity: fx(step.on) }}>{`+${step.add}`}</em>
          </i>
        ))}
      </span>
      <ol className="pv-meter__names">
        {steps.map((step) => (
          <li key={step.text} style={{ opacity: fx(0.35 + 0.65 * step.on) }}>
            {step.text}
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ------------------------------------------------------------ 8. the path to a hospital LOI */

/** The gates to a letter of intent as blocks on a quarter grid, against how long health systems usually take. */
export const PhoneSystems = memo(function PhoneSystems({ t }: { t: number }) {
  const g = PHONE.pictures.gates;
  const cols = g.columns.length;
  return (
    <div className="pv pv-gates2">
      <div className="pv-gates2__compare" style={rise(t, 0, 0.2)}>
        <div className="is-seed">
          <strong>{g.ours.value}</strong>
          <span>
            {g.ours.unit}
            <em>{g.ours.label}</em>
          </span>
        </div>
        <div>
          <strong>{g.typical.value}</strong>
          <span>
            {g.typical.unit}
            <em>{g.typical.label}</em>
          </span>
        </div>
      </div>
      <div className="pv-gates2__grid" style={vars({ "--cols": cols })}>
        <span className="pv-gates2__corner" />
        {g.columns.map((column, i) => (
          <span key={column} className={`pv-gates2__head${i === cols - 1 ? " is-seed" : ""}`}>
            {column}
          </span>
        ))}
        {g.rows.map((row, i) => {
          const span = "span" in row ? row.span : 1;
          return (
            <div key={row.name} className="pv-gates2__row" style={vars({ "--e": fx(en(t, 0.5 + i * 0.16, 0.9 + i * 0.16)) })}>
              <span className="pv-gates2__name">{row.name}</span>
              <span
                className={`pv-gates2__block${"loi" in row ? " is-loi" : ""}`}
                style={{ gridColumn: `${row.col + 2} / span ${span}` }}
              />
            </div>
          );
        })}
      </div>
      <p className="pv-gates2__after" style={rise(t, 9, 0.4)}>
        {g.after}
      </p>
    </div>
  );
});
