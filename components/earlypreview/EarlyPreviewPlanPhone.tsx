"use client";

import { type CSSProperties, memo } from "react";

import { cssVars as vars, scrollRamp as ramp } from "@/lib/doehealthdesk2/use-doehealthdesk2-scroll-lock";
import { EARLYPREVIEW_PLAN as PLAN, EARLYPREVIEW_PLAN_QUARTERS as QUARTERS } from "@/lib/earlypreview/earlypreview-plan-copy";

/**
 * The iPhone's drawings for the go-to-market screens. Each screen is its own picture, drawn here (a growth curve, a
 * constellation, a calendar spine, two clouds, a funnel, a ring, a path, a climb), with the type kept to a few big
 * words. Every motion is a ramp over the screen's clock `t`, the way the rest of the section moves.
 */

const smooth = (x: number) => x * x * (3 - 2 * x);
const en = (t: number, a: number, b: number) => smooth(ramp(t, [a, b]));
const fx = (n: number) => Number(n.toFixed(2));
const range = (length: number) => Array.from({ length }, (_, i) => i);

/** A stroke that draws itself: set on a path or rect that has `pathLength={1}` (the section's own `--draw` rule does the rest). */
const drawn = (d: number): CSSProperties => vars({ "--draw": fx(d) });
const STILL = vars({ "--draw": 1 });

/** Smooth polyline through points, as an SVG path. */
const line = (points: readonly (readonly [number, number])[]) =>
  points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${fx(x)} ${fx(y)}`).join("");

/* ------------------------------------------------------------ 1. supply, agents and revenue */

const TL = { w: 340, h: 372, x0: 12, x1: 328, floor: 340, ends: [74, 172, 270], delays: [0, 0.14, 0.32] } as const;

/** Three curves leave the same corner together and fan out to their Seed figures. */
export const PhoneTimeline = memo(function PhoneTimeline({ t }: { t: number }) {
  const lanes = PLAN.timeline.lanes;
  const k = ramp(t, [0.5, 2.1]);
  const curve = (i: number, u: number) => {
    const d = TL.delays[i];
    const s = smooth(Math.min(1, Math.max(0, (u - d) / (1 - d))));
    return [TL.x0 + u * (TL.x1 - TL.x0), TL.floor - 8 - s * (TL.floor - 8 - TL.ends[i])] as const;
  };
  return (
    <div className="pv pv-timeline" style={vars({ "--e": en(t, 0.2, 0.6) })}>
      <span className="pv-cloud pv-cloud--right" aria-hidden />
      <svg viewBox={`0 0 ${TL.w} ${TL.h}`} role="img" aria-label="Supply, agents and revenue, rising together to their Seed figures">
        <path d={`M${TL.x0} ${TL.floor}H${TL.x1}`} className="pv-axis" />
        {QUARTERS.map((q, i) => {
          const x = TL.x0 + ((i + 0.5) / QUARTERS.length) * (TL.x1 - TL.x0);
          return <path key={q} d={`M${fx(x)} ${TL.floor}v5`} className="pv-axis" />;
        })}
        <text x={TL.x0} y={TL.floor + 22} className="pv-tick">{`${QUARTERS[0]} · ${PLAN.timeline.now}`}</text>
        <text x={TL.x1} y={TL.floor + 22} className="pv-tick is-salmon" textAnchor="end">{`${QUARTERS[QUARTERS.length - 1]} · ${PLAN.timeline.seed}`}</text>
        {lanes.map((lane, i) => {
          const pts = range(41).map((n) => curve(i, n / 40));
          const [ex, ey] = pts[pts.length - 1];
          return (
            <g key={lane.id}>
              <path d={line(pts)} pathLength={1} className={`pv-stroke${i === 2 ? " is-salmon" : ""}`} style={drawn(k)} />
              {lane.milestones.map((m) => {
                const u = (m.q + 0.5) / QUARTERS.length;
                const [x, y] = curve(i, u);
                const on = ramp(k, [u - 0.03, u + 0.03]);
                return <circle key={m.text} cx={fx(x)} cy={fx(y)} r={"seed" in m ? 6 : 3.4} className={`pv-dot${"seed" in m ? " is-ring" : ""}`} style={{ opacity: fx(on) }} />;
              })}
              <g style={{ opacity: fx(ramp(k, [0.8, 1])) }}>
                <text x={TL.x1} y={ey - 44} className="pv-caps" textAnchor="end">{lane.name}</text>
                <text x={TL.x1} y={ey - 14} className="pv-big" textAnchor="end">{lane.big.value}</text>
                <text x={TL.x1} y={ey + 22} className="pv-note" textAnchor="end">{lane.big.unit}</text>
              </g>
              <circle cx={fx(ex)} cy={fx(ey)} r={0} />
            </g>
          );
        })}
      </svg>
    </div>
  );
});

/* ------------------------------------------------------------ 2. four ways in */

/** Four clouds of dots, one a way in, draw their lines into one Index at the middle. */
export const PhoneSources = memo(function PhoneSources({ t }: { t: number }) {
  const groups = PLAN.sources.groups;
  const H = 440;
  const spots = [
    { x: 25, y: 19 },
    { x: 75, y: 19 },
    { x: 25, y: 81 },
    { x: 75, y: 81 },
  ];
  // The hub's four corners, where each way's line lands.
  const hub = { l: 124, r: 216, t: H / 2 - 52, b: H / 2 + 52 };
  return (
    <div className="pv pv-sources" style={{ aspectRatio: `340 / ${H}` }}>
      <svg className="pv-sources__lines" viewBox={`0 0 340 ${H}`} preserveAspectRatio="none" aria-hidden>
        {spots.map((spot, i) => {
          const sx = (spot.x / 100) * 340;
          const top = i < 2;
          const sy = (spot.y / 100) * H + (top ? 62 : -62);
          const hx = i % 2 === 0 ? hub.l : hub.r;
          const hy = top ? hub.t : hub.b;
          const d = `M${fx(sx)} ${fx(sy)}Q${fx(sx)} ${fx(hy)} ${fx(hx)} ${fx(hy)}`;
          return <path key={i} d={d} pathLength={1} className="pv-stroke" style={drawn(en(t, 0.7 + i * 0.22, 1.5 + i * 0.22))} />;
        })}
      </svg>
      {groups.map((group, i) => (
        <div
          key={group.id}
          className="pv-way"
          style={{ left: `${spots[i].x}%`, top: `${spots[i].y}%`, ...vars({ "--e": en(t, 0.3 + i * 0.2, 0.8 + i * 0.2) }) }}
        >
          <span className="pv-way__cloud" aria-hidden />
          <span className="pv-way__num">{`0${i + 1}`}</span>
          <span className="pv-way__name">{group.short}</span>
          <span className="pv-way__detail">{group.detail}</span>
        </div>
      ))}
      <div className="pv-hub" style={vars({ "--e": en(t, 1.5, 2.0) })}>
        <span className="pv-hub__value">{PLAN.sourcesResult.value}</span>
        <span className="pv-hub__label">{PLAN.sourcesResult.label}</span>
        <span className="pv-hub__sub">{PLAN.sourcesResult.sub}</span>
      </div>
    </div>
  );
});

/* ------------------------------------------------------------ 3. the rooms we'll be in */

const EV = { w: 340, pitch: 20.5, top: 26, cx: 170 } as const;
const spine = (i: number) => EV.cx + 7 * Math.sin(i * 0.55);
const KIND_SIDE = { practice: -1, groups: -1, agents: 1, systems: 1 } as const;

/** A calendar as one wavy spine, November '26 to June '28, with each event on the side of who it is for. */
export const PhoneEvents = memo(function PhoneEvents({ t }: { t: number }) {
  const copy = PLAN.events;
  const k = ramp(t, [0.35, 2.1]);
  const count = copy.months.length;
  const height = EV.top * 2 + (count - 1) * EV.pitch;
  const y = (i: number) => EV.top + i * EV.pitch;
  const pts = range(count * 4 - 3).map((n) => [spine(n / 4), y(n / 4)] as const);
  // Events in the same month and on the same side step down a line so their names never touch.
  const seen: Record<string, number> = {};
  return (
    <div className="pv pv-events">
      <ul className="pv-legend" style={vars({ "--e": en(t, 0.2, 0.5) })}>
        {copy.kinds.map((kind) => (
          <li key={kind.id} className={`is-${kind.id}`}>
            <i aria-hidden />
            {kind.name}
          </li>
        ))}
      </ul>
      <svg viewBox={`0 0 ${EV.w} ${height}`} role="img" aria-label="The rooms we will be in, month by month to Seed">
        <path d={line(pts)} pathLength={1} className="pv-stroke is-faint" style={drawn(k)} />
        {copy.months.map((m, i) => {
          const newYear = m === "Jan";
          const year = copy.firstYear + (i < 2 ? 0 : i < 14 ? 1 : 2);
          return (
            <g key={i} style={{ opacity: fx(ramp(k, [i / count - 0.02, i / count + 0.02])) }}>
              {!(newYear || i === 0) && <circle cx={fx(spine(i))} cy={y(i)} r={1.6} className="pv-tickdot" />}
              {(newYear || i === 0) && (
                <text x={EV.cx} y={y(i) + 4} className="pv-tick pv-tick--chip" textAnchor="middle">{`${m} ’${String(year).slice(2)}`}</text>
              )}
            </g>
          );
        })}
        {copy.list.map((event) => {
          const side = KIND_SIDE[event.kind];
          const key = `${event.month}:${side}`;
          const step = seen[key] ?? 0;
          seen[key] = step + 1;
          const ey = y(event.month) + step * 11;
          const ex = spine(event.month);
          const on = ramp(k, [event.month / count - 0.02, event.month / count + 0.03]);
          const filled = event.kind === "practice" || event.kind === "agents";
          return (
            <g key={`${event.name}-${event.month}`} style={{ opacity: fx(on) }} className={`pv-event is-${event.kind}`}>
              <path d={`M${fx(ex)} ${fx(ey)}h${side * 12}`} className="pv-stroke is-faint" />
              <circle cx={fx(ex)} cy={fx(ey)} r={4.4} className={filled ? "pv-dot" : "pv-dot is-ring"} />
              <text x={fx(ex + side * 17)} y={fx(ey + 4)} textAnchor={side < 0 ? "end" : "start"} className="pv-label">
                {event.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
});

/* ------------------------------------------------------------ 4. private services and multi-site */

/** Two clouds, one for each kind of practice the pre-seed plan is built on, with the group drawn small under them. */
export const PhoneGroups = memo(function PhoneGroups({ t }: { t: number }) {
  const copy = PLAN.groups;
  const sites = range(copy.sites);
  return (
    <div className="pv pv-groups">
      <div className="pv-pair">
        <div className="pv-disc pv-disc--left" style={vars({ "--e": en(t, 0.3, 0.8) })}>
          <span className="pv-disc__cloud" aria-hidden />
          <span className="pv-disc__value">{copy.phone.private.value}</span>
        </div>
        <div className="pv-disc pv-disc--right" style={vars({ "--e": en(t, 0.6, 1.1) })}>
          <span className="pv-disc__cloud" aria-hidden />
          <span className="pv-disc__value">{copy.share.value}</span>
        </div>
      </div>
      <div className="pv-pair pv-pair--names">
        <p style={vars({ "--e": en(t, 0.8, 1.15) })}>
          <strong>{copy.phone.private.name}</strong>
          <span>private-pay at Seed</span>
        </p>
        <p style={vars({ "--e": en(t, 1.0, 1.35) })}>
          <strong>{copy.phone.multi.name}</strong>
          <span>of ARR at Seed</span>
        </p>
      </div>
      <svg className="pv-groups__tree" viewBox="0 0 340 92" aria-label="One contract, four locations, twelve providers">
        <rect x={4} y={34} width={64} height={24} rx={12} pathLength={1} className="pv-stroke is-salmon" style={drawn(en(t, 1.2, 1.4))} />
        <text x={36} y={50} className="pv-label" textAnchor="middle" style={{ opacity: fx(en(t, 1.3, 1.5)) }}>1 contract</text>
        {sites.map((s) => {
          const x = 104 + s * 58;
          const at = 1.35 + s * 0.12;
          return (
            <g key={s}>
              <path d={`M68 46H${x}`} pathLength={1} className="pv-stroke is-faint" style={drawn(en(t, at, at + 0.2))} />
              <rect x={x} y={34} width={48} height={24} rx={12} pathLength={1} className="pv-stroke" style={drawn(en(t, at + 0.05, at + 0.3))} />
              {range(copy.perSite).map((v) => (
                <circle key={v} cx={x + 12 + v * 12} cy={76} r={3.2} className="pv-dot" style={{ opacity: fx(en(t, at + 0.2 + v * 0.05, at + 0.35 + v * 0.05)) }} />
              ))}
            </g>
          );
        })}
      </svg>
      <ul className="pv-figures" style={vars({ "--e": en(t, 1.9, 2.2) })}>
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

/** A funnel of dots: the target list narrows to the few agents that are live by Seed. */
export const PhoneAgents = memo(function PhoneAgents({ t }: { t: number }) {
  const cols = PLAN.agents.columns;
  // A row's width in dots, so each stage wraps to the funnel's shape: wide at the top, narrow at the end.
  const widths = [250, 200, 100, 65];
  return (
    <div className="pv pv-agents">
      {cols.map((column, c) => {
        const start = c === 0 ? 0.35 : [0.95, 1.35, 1.75][c - 1];
        const lit = "salmon" in column;
        return (
          <section key={column.id} className={`pv-stage${lit ? " is-salmon" : ""}`} style={vars({ "--e": en(t, start - 0.1, start + 0.3) })}>
            <span className="pv-stage__value">{column.value}</span>
            <span className="pv-stage__dots" style={{ width: widths[c] }} aria-hidden>
              {range(column.value).map((i) => (
                <i key={i} style={{ opacity: fx(en(t, start + i * 0.01, start + 0.2 + i * 0.01)) }} />
              ))}
            </span>
            <span className="pv-stage__name">{column.name}</span>
            <span className="pv-stage__when">{column.when}</span>
          </section>
        );
      })}
    </div>
  );
});

/* ------------------------------------------------------------ 6. the loop */

/** The loop as a ring: a missed request leaves the page, comes back as a report, and ends as a claimed practice. */
export const PhoneLoop = memo(function PhoneLoop({ t }: { t: number }) {
  const copy = PLAN.loop;
  const R = 98;
  const c = { x: 170, y: 172 };
  const steps = [
    { lines: ["An agent", "asks"], at: -135, side: -1 },
    { lines: ["The page", "can’t answer"], at: -45, side: 1 },
    { lines: ["Doe emails", "the owner"], at: 45, side: 1 },
    { lines: ["They claim it,", "next one books"], at: 135, side: -1 },
  ] as const;
  const k = ramp(t, [0.4, 2.0]);
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const angle = rad(-135 + 360 * k);
  return (
    <div className="pv pv-loop">
      <svg viewBox="0 0 340 344" role="img" aria-label="Every missed request recruits a practice">
        <circle cx={c.x} cy={c.y} r={R} pathLength={1} className="pv-stroke is-faint is-dashed-u" style={STILL} />
        <circle
          cx={c.x}
          cy={c.y}
          r={R}
          pathLength={1}
          className="pv-stroke is-salmon"
          style={{ ...drawn(k), transform: "rotate(-135deg)", transformOrigin: `${c.x}px ${c.y}px` }}
        />
        {steps.map((step, i) => {
          const x = c.x + R * Math.cos(rad(step.at));
          const y = c.y + R * Math.sin(rad(step.at));
          const on = ramp(k, [i / 4 - 0.02, i / 4 + 0.04]);
          const above = step.at < 0;
          return (
            <g key={step.lines[0]} style={{ opacity: fx(Math.max(0.35, on)) }}>
              <circle cx={fx(x)} cy={fx(y)} r={8} className="pv-dot is-ring" />
              <circle cx={fx(x)} cy={fx(y)} r={3.4} className="pv-dot" style={{ opacity: fx(on) }} />
              <text x={fx(x + step.side * 18)} y={fx(y + (above ? -2 : 8))} textAnchor={step.side < 0 ? "end" : "start"} className="pv-label">
                <tspan x={fx(x + step.side * 18)}>{step.lines[0]}</tspan>
                <tspan x={fx(x + step.side * 18)} dy={14}>{step.lines[1]}</tspan>
              </text>
            </g>
          );
        })}
        <circle cx={fx(c.x + R * Math.cos(angle))} cy={fx(c.y + R * Math.sin(angle))} r={6} className="pv-pulse" />
        <g style={{ opacity: fx(en(t, 0.5, 0.9)) }}>
          <text x={c.x} y={c.y + 14} textAnchor="middle" className="pv-big is-center">{copy.page.missed}</text>
          <text x={c.x} y={c.y + 40} textAnchor="middle" className="pv-note">missed agent requests</text>
          <text x={c.x} y={c.y + 56} textAnchor="middle" className="pv-note">at one practice, in a month</text>
        </g>
      </svg>
      <p className="pv-stat" style={vars({ "--e": en(t, 1.7, 2.1) })}>
        <strong>{copy.stat.value}</strong>
        <span>of new claims start from a missed-demand report by Seed</span>
      </p>
    </div>
  );
});

/* ------------------------------------------------------------ 7. first email to paying */

const JN = { w: 340, h: 430 } as const;
/** The path's x at a fraction of its height: a slow S down the screen. */
const jx = (u: number) => 170 + 96 * Math.sin(u * Math.PI * 2.2 + 0.3) * (u < 0.04 ? u / 0.04 : 1);

/** One practice's first 45 days as a path down the screen, a stop at every step, ending on the day it pays. */
export const PhoneJourney = memo(function PhoneJourney({ t }: { t: number }) {
  const copy = PLAN.journey;
  const k = ramp(t, [0.4, 2.0]);
  const top = 20;
  const bottom = JN.h - 70;
  const pts = range(61).map((n) => {
    const u = n / 60;
    return [jx(u), top + u * (bottom - top)] as const;
  });
  return (
    <div className="pv pv-journey">
      <svg viewBox={`0 0 ${JN.w} ${JN.h}`} role="img" aria-label="From the first email to paying in 45 days">
        <path d={line(pts)} pathLength={1} className="pv-stroke is-faint is-dashed-u" style={STILL} />
        <path d={line(pts)} pathLength={1} className="pv-stroke" style={drawn(k)} />
        {copy.marks.map((mark, i) => {
          const u = i / (copy.marks.length - 1);
          const x = jx(u);
          const y = top + u * (bottom - top);
          const on = ramp(k, [u - 0.04, u + 0.04]);
          const left = x > 170;
          const salmon = "salmon" in mark;
          return (
            <g key={mark.text} style={{ opacity: fx(on) }}>
              <circle cx={fx(x)} cy={fx(y)} r={salmon ? 9 : 5.5} className={salmon ? "pv-dot is-ring is-salmon" : "pv-dot"} />
              <text x={fx(x + (left ? -16 : 16))} y={fx(y - 3)} textAnchor={left ? "end" : "start"} className="pv-caps">{`Day ${mark.day}`}</text>
              <text x={fx(x + (left ? -16 : 16))} y={fx(y + 12)} textAnchor={left ? "end" : "start"} className="pv-label">{mark.text}</text>
            </g>
          );
        })}
      </svg>
      <p className="pv-stat" style={vars({ "--e": en(t, 1.8, 2.2) })}>
        <strong>{copy.stat.value}</strong>
        <span>first email to paying, the target for every practice</span>
      </p>
    </div>
  );
});

/* ------------------------------------------------------------ 8. from practices to the health system */

const SY = { w: 340, h: 426 } as const;

/** A climb: seven steps from a Clinical Partner inside to the whole system, each higher, the pilots in salmon. */
export const PhoneSystems = memo(function PhoneSystems({ t }: { t: number }) {
  const copy = PLAN.systems;
  const n = copy.steps.length;
  const k = ramp(t, [0.4, 2.0]);
  const point = (u: number) => [24 + u * 292, 316 - smooth(u) * 250 - u * 16] as const;
  const pts = range(61).map((m) => point(m / 60));
  // The names read in one short line here; the full wording is on the desktop's version.
  const short = (name: string) =>
    name
      .replace(/^An? /, "")
      .replace(/ inside$/, "")
      .replace(/, on our pack$/, "")
      .replace(/^department/, "Department");
  const split = (name: string) => {
    if (name.includes(", ")) {
      const [first, ...rest] = name.split(", ");
      return [`${first},`, rest.join(", ")] as const;
    }
    const words = name.split(" ");
    if (words.length < 3) return [name, ""] as const;
    const cut = Math.ceil(words.length / 2);
    return [words.slice(0, cut).join(" "), words.slice(cut).join(" ")] as const;
  };
  return (
    <div className="pv pv-systems">
      <span className="pv-cloud pv-cloud--top" aria-hidden style={{ opacity: fx(0.15 + 0.5 * k) }} />
      <svg viewBox={`0 0 ${SY.w} ${SY.h}`} role="img" aria-label="Practices first, then the health system">
        <path d="M12 396H328" className="pv-axis" />
        <path d={line(pts)} pathLength={1} className="pv-stroke" style={drawn(k)} />
        {copy.steps.map((step, i) => {
          const u = i / (n - 1);
          const [x, y] = point(u);
          const on = ramp(k, [u - 0.04, u + 0.04]);
          const salmon = "salmon" in step;
          // The line climbs to the right, so the free room is above-left of a point and below-right of it. The first steps
          // have no room on the left, so they hang their names below-right.
          const below = i < 3;
          const [top, bottom] = split(short(step.name));
          const lx = below ? x + 12 : x - 12;
          // The first names are only 48 units apart, so the second hangs lower than its neighbours to keep clear of them.
          const first = below ? y + (i === 1 ? 64 : 22) : y - (bottom ? 22 : 9);
          const when = step.when.replace("After Seed", "After");
          return (
            <g key={step.name} style={{ opacity: fx(on) }}>
              <path d={`M${fx(x)} ${fx(y)}V396`} className="pv-stroke is-faint is-dashed" />
              <circle cx={fx(x)} cy={fx(y)} r={salmon ? 8 : 5} className={salmon ? "pv-dot is-ring is-salmon" : "pv-dot"} />
              <text x={fx(lx)} y={fx(first)} textAnchor={below ? "start" : "end"} className={`pv-label${salmon ? " is-salmon" : ""}`}>
                <tspan x={fx(lx)}>{top}</tspan>
                {bottom ? (
                  <tspan x={fx(lx)} dy={13}>
                    {bottom}
                  </tspan>
                ) : null}
              </text>
              <text x={fx(x)} y={414} textAnchor="middle" className="pv-tick">{when}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
});
