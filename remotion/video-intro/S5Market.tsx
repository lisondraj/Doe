import type { CSSProperties } from "react";
import { useCurrentFrame } from "remotion";

import { DotWave } from "../video1/backdrops";
import { keys, lerp, ramp } from "../video1/motion";
import { C } from "../video1/theme";
import { ClickRing, Cursor } from "../video1/ui";
import { Browser, Chapter, Circle, EASE_IN_OUT, EASE_OUT, SAGE, SAGE_TEXT, SAND_TILE, Scene, Swap, Words, beat, press, serif, track, wipe } from "./kit";
import { NA_COLS, NA_DOTS, NA_ROWS, NaMap, naPoint } from "./NaMap";
import { naCell } from "./na-dots";
import { EARLYPREVIEW_MARKET_INDEX, EARLYPREVIEW_MARKET_TARGETS as T } from "@/lib/earlypreview/earlypreview-market-copy";
import { SEED } from "./seed";

/** The "already indexed" line runs first; every other beat is timed from its end. */
const PRE = 124;
export const S5_FRAMES = PRE + 1640;

const BEATS = { index: [0, 420], claim: [420, 720], pricing: [720, 980], growth: [980, 1180], wages: [1180, 1400], insights: [1400, S5_FRAMES - PRE + 40] } as const;

export function S5Market() {
  const frame = useCurrentFrame();
  const f = frame - PRE;
  return (
    <Scene backdrop={<DotWave top={0.74} amp={40} />}>
      <Already frame={frame} />
      <IndexGrowth frame={f} />
      <Claim frame={f} />
      <Pricing frame={f} />
      <Growth frame={f} />
      <Wages frame={f} />
      <Insights frame={f} />
      <Chapter frame={frame} label="Go-to-Market" at={12} />
    </Scene>
  );
}

/* ─── 0. /earlypreview's line: what's already in the index ───────────────── */

function Already({ frame }: { frame: number }) {
  const layer = beat(frame, 0, PRE - 14);
  if (!layer) return null;
  const [first, second] = EARLYPREVIEW_MARKET_INDEX.index.title.map((t) => t.replace("'", "’"));
  return (
    <div style={layer}>
      <div style={{ position: "absolute", left: 120, top: 360 }}>
        <div style={serif(124, { lineHeight: "140px", letterSpacing: "-0.04em" })}>
          {first.split(" ").map((w, i) => {
            const p = ramp(frame, 14 + i * 4, 24, EASE_OUT);
            return (
              <span key={i} style={{ display: "inline-block", whiteSpace: "pre", color: /\d/.test(w) ? C.alertText : undefined, opacity: p, transform: `translateY(${((1 - p) * 30).toFixed(2)}px)` }}>
                {w}{" "}
              </span>
            );
          })}
        </div>
        <div style={{ ...serif(124, { lineHeight: "140px", letterSpacing: "-0.04em", color: muted }), ...wipe(ramp(frame, 40, 36, EASE_OUT)) }}>{second}</div>
      </div>
    </div>
  );
}

const muted = "rgba(40, 25, 16, 0.5)";

/* ─── 1. The index: Canada first, then the U.S. ──────────────────────────── */

const CELL = 13;
const MAP = { x: 960, y: 40 };
const TORONTO = { lon: -79.38, lat: 43.65 };
const VANCOUVER = { lon: -123.12, lat: 49.28 };
const US_PINS = [
  { name: "New York", lon: -74.0, lat: 40.75, below: true },
  { name: "Florida", lon: -81.4, lat: 28.5, below: false },
  { name: "California", lon: -119.4, lat: 36.8, below: false },
];

/** Stages of the rollout, in frames, with the count the index reaches at the end of each. Canada and the total are the Seed model's. */
const STAGE = {
  outline: [8, 70],
  toronto: [50, 100],
  vancouver: [120, 150],
  canada: [140, 230],
  usOutline: [236, 276],
  us: [262, 330],
} as const;
/** The count opens on what's indexed today, then climbs with Canada and the U.S. */
const COUNT_KEYS = { f: [120, 230, 262, 330], n: [T.indexedToday, T.indexedCanada, T.indexedCanada, T.indexed] };

const hash = (i: number) => Math.abs(Math.sin(i * 12.9898 + 4.1) * 43758.5453) % 1;
const cellOf = (p: { lon: number; lat: number }) => naCell(p.lon, p.lat);
const dist = (d: { c: number; r: number }, p: { c: number; r: number }) => Math.hypot(d.c - p.c, d.r - p.r);

/** For each land dot: which stage inks it, and when within that stage (0 to 1); `null` stays unlit. */
const ROLLOUT = (() => {
  const to = cellOf(TORONTO);
  const va = cellOf(VANCOUVER);
  const us = US_PINS.map(cellOf);
  const raw = NA_DOTS.map((d, i) => {
    if (d.k === "c") {
      if (dist(d, to) < 3.4) return { stage: "toronto" as const, o: dist(d, to) / 3.4 };
      if (dist(d, va) < 3.4) return { stage: "vancouver" as const, o: dist(d, va) / 3.4 };
      if (hash(i) > 0.8) return null;
      return { stage: "canada" as const, o: Math.min(dist(d, to), dist(d, va)) + hash(i) * 4 };
    }
    if (hash(i) > 0.42) return null;
    return { stage: "us" as const, o: Math.min(...us.map((p) => dist(d, p))) + hash(i) * 6 };
  });
  const maxO = (s: string) => Math.max(...raw.map((r) => (r && r.stage === s ? r.o : 0)), 1);
  const norm = { toronto: maxO("toronto"), vancouver: maxO("vancouver"), canada: maxO("canada"), us: maxO("us") };
  return raw.map((r) => (r ? { stage: r.stage, t: r.o / norm[r.stage] } : null));
})();
/** West to east, so each country's outline draws itself in. */
const SWEEP = NA_DOTS.map((d) => d.c / NA_COLS);

function IndexGrowth({ frame }: { frame: number }) {
  const layer = beat(frame, BEATS.index[0], BEATS.index[1]);
  if (!layer) return null;
  const n = Math.round(keys(frame, COUNT_KEYS.f, COUNT_KEYS.n, EASE_IN_OUT));
  const show = (i: number) => {
    const [a, b] = NA_DOTS[i].k === "c" ? STAGE.outline : STAGE.usOutline;
    return ramp(frame, a + (b - a - 12) * SWEEP[i], 12);
  };
  const level = (i: number) => {
    const r = ROLLOUT[i];
    if (!r) return 0;
    const [a, b] = STAGE[r.stage];
    return ramp(frame, a + (b - a - 8) * r.t, 8);
  };
  const to = naPoint(TORONTO.lon, TORONTO.lat, CELL);
  const va = naPoint(VANCOUVER.lon, VANCOUVER.lat, CELL);
  const stops = [
    { n: T.indexedToday, label: "Toronto", at: STAGE.toronto[1] },
    { n: null, label: "Vancouver", at: STAGE.vancouver[0] + 10 },
    { n: T.indexedCanada, label: "Canada", at: STAGE.canada[1] },
    { n: T.indexed, label: "With the U.S.", at: STAGE.us[1] },
  ];
  const line = ramp(frame, 40, 30, EASE_OUT);
  const progress = keys(frame, [STAGE.toronto[1], STAGE.us[1]], [0, 1], EASE_IN_OUT);
  return (
    <div style={layer}>
      <div style={{ position: "absolute", left: 110, top: 290, ...serif(250, { lineHeight: "250px", letterSpacing: "-0.045em" }), opacity: ramp(frame, 20, 20) }}>{n.toLocaleString("en-US")}</div>
      <div style={{ position: "absolute", left: 124, top: 566, ...serif(64, { color: muted }), opacity: ramp(frame, 30, 20) }}>Clinics Indexed</div>

      <div style={{ position: "absolute", left: MAP.x, top: MAP.y, width: NA_COLS * CELL, height: NA_ROWS * CELL }}>
        <NaMap cell={CELL} frame={frame} show={show} level={level} />
        <Pin x={to.x} y={to.y} label="Toronto" dark p={ramp(frame, STAGE.toronto[0], 18, EASE_OUT)} />
        <Pin x={va.x} y={va.y} label="Vancouver" p={ramp(frame, STAGE.vancouver[0], 18, EASE_OUT)} />
        {US_PINS.map((u, i) => {
          const p = naPoint(u.lon, u.lat, CELL);
          return <Pin key={u.name} x={p.x} y={p.y} label={u.name} below={u.below} p={ramp(frame, STAGE.us[0] + 10 + i * 10, 18, EASE_OUT)} />;
        })}
      </div>

      <div style={{ position: "absolute", left: 120, right: 120, top: 860, opacity: line }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 13, height: 4, borderRadius: 4, background: "rgba(40, 25, 16, 0.1)" }} />
        <div style={{ position: "absolute", left: 0, top: 13, height: 4, borderRadius: 4, background: C.walnut, width: `${progress * 100}%` }} />
        {stops.map((s, i) => {
          const t = i / (stops.length - 1);
          const reached = ramp(frame, s.at, 8);
          const last = i === stops.length - 1;
          return (
            <div key={s.label} style={{ position: "absolute", left: `${t * 100}%`, top: 0, transform: `translateX(${i === 0 ? 0 : last ? -100 : -50}%)`, display: "flex", flexDirection: "column", alignItems: i === 0 ? "flex-start" : last ? "flex-end" : "center" }}>
              <div style={{ width: 30, height: 30, borderRadius: 99, background: reached > 0.5 ? (last ? C.salmon : C.walnut) : C.beige, border: `4px solid ${C.walnut}`, boxSizing: "border-box" }} />
              <span style={{ marginTop: 16, ...serif(44), opacity: lerp(0.35, 1, reached) }}>{s.n ? s.n.toLocaleString("en-US") : s.label}</span>
              {s.n ? <span style={{ ...serif(30, { color: muted }), opacity: lerp(0.35, 1, reached) }}>{s.label}</span> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Pin({ x, y, label, dark = false, below = false, p }: { x: number; y: number; label: string; dark?: boolean; below?: boolean; p: number }) {
  if (p <= 0) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: p }}>
      <div style={{ position: "absolute", left: -11, top: -11, width: 22, height: 22, borderRadius: 99, background: dark ? C.ink : C.salmon, border: `4px solid ${C.beige}`, boxSizing: "border-box" }} />
      <div style={{ position: "absolute", left: 18, top: below ? 16 : -64, height: 48, padding: "0 20px", display: "flex", alignItems: "center", borderRadius: 999, background: dark ? C.ink : C.paper, transform: `translateY(${((1 - p) * 10).toFixed(2)}px)`, ...serif(28, { color: dark ? C.paper : C.walnut }) }}>{label}</div>
    </div>
  );
}

/* ─── 2. Claimed for free, on a rail of what lands when ──────────────────── */

const CLAIM = { at: 576 };
/** The supply milestones from /earlypreview's plan, to the claims at Seed. */
const STEPS = [
  { when: "Q4 ’26", text: `${T.indexedToday.toLocaleString("en-US")} clinics indexed` },
  { when: "Q1 ’27", text: "Every Toronto practice emailed its page" },
  { when: "Q2 ’27", text: "Founding 100 set up by hand" },
  { when: "Q2 ’28", text: `${SEED.claimed.toLocaleString("en-US")} pages claimed` },
];
const RAIL = { x: 1200, top: 300, gap: 176 };

function Claim({ frame }: { frame: number }) {
  const [at, out] = BEATS.claim;
  const layer = beat(frame, at, out);
  if (!layer) return null;
  const BW = { x: 120, y: 250, w: 960, h: 660 };
  const BTN = { x: BW.x + 56 + 190, y: BW.y + 112 + 345 };
  const cur = track(frame, [
    { f: at + 70, x: BTN.x + 300, y: BTN.y + 160 },
    { f: CLAIM.at - 4, x: BTN.x + 6, y: BTN.y + 6 },
    { f: CLAIM.at + 40, x: BTN.x + 40, y: BTN.y + 70 },
  ]);
  const claimed = ramp(frame, CLAIM.at + 6, 16, EASE_OUT);
  const win = ramp(frame, at + 8, 30, EASE_OUT);
  const stepAt = (i: number) => (i === STEPS.length - 1 ? CLAIM.at + 4 : at + 50 + i * 34);
  const lit = keys(frame, STEPS.map((_, i) => stepAt(i)), STEPS.map((_, i) => i), EASE_IN_OUT);
  return (
    <div style={layer}>
      <div style={{ position: "absolute", left: 120, top: 84 }}>
        <Words text="Indexed First. Claimed for Free." frame={frame} at={at + 4} size={84} />
      </div>
      <Browser x={BW.x} y={BW.y} w={BW.w} h={BW.h} tab="Maren Skin Clinic" url="doe.care/maren-skin-clinic" style={{ opacity: win, transform: `translateY(${((1 - win) * 40).toFixed(2)}px)` }}>
        <div style={{ position: "absolute", left: 56, top: 56 }}>
          <div style={serif(80)}>Maren Skin Clinic</div>
          <div style={{ marginTop: 14, ...serif(40, { color: muted }) }}>214 agent searches this month</div>
          <div style={{ marginTop: 92, transform: `scale(${(1 - 0.06 * press(frame, [CLAIM.at])).toFixed(4)})`, transformOrigin: "0 50%" }}>
            <Swap
              t={claimed}
              from={<div style={{ height: 96, padding: "0 48px", display: "flex", alignItems: "center", borderRadius: 999, background: C.ink, ...serif(40, { color: C.paper }) }}>Claim This Page</div>}
              to={<div style={{ height: 96, padding: "0 48px", display: "flex", alignItems: "center", borderRadius: 999, background: SAGE, ...serif(40, { color: SAGE_TEXT }) }}>Claimed, Free</div>}
            />
          </div>
        </div>
      </Browser>
      <ClickRing x={BTN.x} y={BTN.y} progress={ramp(frame, CLAIM.at - 1, 16)} />
      <div style={{ opacity: ramp(frame, at + 70, 8) * (1 - ramp(frame, CLAIM.at + 40, 10)) }}>
        <Cursor x={cur.x} y={cur.y} size={42} pressed={press(frame, [CLAIM.at])} />
      </div>

      <div style={{ position: "absolute", left: RAIL.x + 11, top: RAIL.top + 14, width: 4, height: RAIL.gap * (STEPS.length - 1), borderRadius: 4, background: "rgba(40, 25, 16, 0.1)", opacity: win }} />
      <div style={{ position: "absolute", left: RAIL.x + 11, top: RAIL.top + 14, width: 4, height: RAIL.gap * Math.max(0, lit), borderRadius: 4, background: C.walnut }} />
      {STEPS.map((st, i) => {
        const p = ramp(frame, at + 24 + i * 8, 22, EASE_OUT);
        const on = ramp(frame, stepAt(i), 10);
        const last = i === STEPS.length - 1;
        return (
          <div key={st.when} style={{ position: "absolute", left: RAIL.x, top: RAIL.top + i * RAIL.gap, display: "flex", gap: 34, opacity: p, transform: `translateX(${((1 - p) * 24).toFixed(2)}px)` }}>
            <div style={{ width: 26, height: 26, marginTop: 1, flexShrink: 0, borderRadius: 99, boxSizing: "border-box", border: `4px solid ${C.walnut}`, background: on > 0.5 ? (last ? C.salmon : C.walnut) : C.beige }} />
            <div style={{ width: 600, display: "flex", flexDirection: "column", gap: 4, opacity: lerp(0.4, 1, on) }}>
              <span style={serif(30, { color: muted, lineHeight: "30px" })}>{st.when}</span>
              <span style={serif(46, { whiteSpace: "normal", lineHeight: "52px", color: last && on > 0.5 ? C.alertText : C.walnut })}>{st.text}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── 3. Pricing, from /pricing ───────────────────────────────────────────── */

const TIERS = [
  { name: "Free", price: 0, per: "Always free" },
  { name: "Basic", price: 49, per: "A month, +$29 a provider" },
  { name: "Advanced", price: 149, per: "A month, +$79 a provider" },
  { name: "Doe One", price: 349, per: "A month, +$149 a provider", hot: true },
];
const PRIVATE_PAY = [
  { label: "Concierge", tone: C.salmon },
  { label: "Home Care", tone: SAND_TILE },
  { label: "Aesthetics", tone: SAGE },
  { label: "Dentistry", tone: C.sand3 },
];

function Pricing({ frame }: { frame: number }) {
  const [at, out] = BEATS.pricing;
  const layer = beat(frame, at, out);
  if (!layer) return null;
  const COL = 420;
  return (
    <div style={layer}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 100, display: "flex", justifyContent: "center" }}>
        <Words text="Priced to the Size of the Practice" frame={frame} at={at + 4} size={84} align="center" />
      </div>
      {TIERS.map((t, i) => {
        const p = ramp(frame, at + 20 + i * 8, 26, EASE_OUT);
        return (
          <div key={t.name} style={{ position: "absolute", left: 120 + i * COL, top: 290, width: COL, height: 380, boxSizing: "border-box", paddingLeft: i ? 44 : 0, borderLeft: i ? "2px solid rgba(40, 25, 16, 0.1)" : "none", opacity: p, transform: `translateY(${((1 - p) * 30).toFixed(2)}px)` }}>
            <div style={serif(52, { color: t.hot ? C.alertText : C.walnut })}>{t.name}</div>
            <div style={{ marginTop: 20, ...serif(170, { lineHeight: "170px", letterSpacing: "-0.04em", color: t.hot ? C.alertText : C.walnut }) }}>${t.price}</div>
            <div style={{ marginTop: 26, ...serif(28, { color: muted }) }}>{t.per}</div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 120, top: 720, ...serif(60), opacity: ramp(frame, at + 70, 20) }}>Private Pay First</div>
      <div style={{ position: "absolute", left: 120, right: 120, top: 830, display: "flex", alignItems: "center", gap: 72 }}>
        {PRIVATE_PAY.map((p, i) => (
          <div key={p.label} style={{ display: "flex", alignItems: "center", gap: 18, opacity: ramp(frame, at + 80 + i * 8, 16) }}>
            <Circle size={60} tone={p.tone} />
            <span style={serif(46)}>{p.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── 4. Toronto: growth and rank, from CBRE ─────────────────────────────── */

function Growth({ frame }: { frame: number }) {
  const [at, out] = BEATS.growth;
  const layer = beat(frame, at, out);
  if (!layer) return null;
  const a = ramp(frame, at + 14, 34, EASE_OUT);
  const b = ramp(frame, at + 34, 34, EASE_OUT);
  const big = (p: number) => ({ opacity: p, ...wipe(p), transform: `translateY(${((1 - p) * 20).toFixed(2)}px)` });
  return (
    <div style={layer}>
      <div style={{ position: "absolute", left: 120, top: 84 }}>
        <Words text="Built in Toronto" frame={frame} at={at + 4} size={84} />
      </div>
      <div style={{ position: "absolute", left: 110, top: 250, ...serif(340, { lineHeight: "340px", letterSpacing: "-0.05em" }), ...big(a) }}>#3</div>
      <div style={{ position: "absolute", left: 124, top: 640, width: 700, ...serif(56, { whiteSpace: "normal", lineHeight: "64px" }), ...big(a) }}>For Tech Talent in North America</div>
      <div style={{ position: "absolute", left: 960, top: 370, ...serif(220, { lineHeight: "220px", letterSpacing: "-0.045em", color: C.alertText }), ...big(b) }}>+75,000</div>
      <div style={{ position: "absolute", left: 972, top: 640, width: 820, ...serif(56, { whiteSpace: "normal", lineHeight: "64px" }), ...big(b) }}>Tech Jobs Added Since 2022, the Most in North America</div>
      <div style={{ position: "absolute", left: 124, top: 950, ...serif(30, { color: muted }), opacity: ramp(frame, at + 70, 16) }}>CBRE, Scoring Tech Talent 2026: Toronto, 2022–2025</div>
    </div>
  );
}

/* ─── 5. What a senior engineer costs, from Levels.fyi ───────────────────── */

/** Levels.fyi medians, senior software engineer total compensation, October 2026; CAD at 0.71 USD. */
const PAY = [
  { place: "San Francisco", usd: 350000, note: "" },
  { place: "Toronto", usd: Math.round(176594 * 0.71), note: "CA$177K", ours: true },
];

function Wages({ frame }: { frame: number }) {
  const [at, out] = BEATS.wages;
  const layer = beat(frame, at, out);
  if (!layer) return null;
  const BAR = { x: 600, w: 820, h: 110 };
  return (
    <div style={layer}>
      <div style={{ position: "absolute", left: 120, top: 84 }}>
        <Words text="Senior Software Engineer Pay" frame={frame} at={at + 4} size={84} />
      </div>
      {PAY.map((r, i) => {
        const g = ramp(frame, at + 30 + i * 14, 44, EASE_OUT);
        const y = 330 + i * 230;
        return (
          <div key={r.place} style={{ position: "absolute", left: 120, top: y, height: BAR.h, display: "flex", alignItems: "center", opacity: ramp(frame, at + 22 + i * 14, 16) }}>
            <span style={{ width: BAR.x - 120, ...serif(64, { color: r.ours ? C.alertText : C.walnut }) }}>{r.place}</span>
            <div style={{ width: (BAR.w * r.usd * g) / PAY[0].usd, height: BAR.h, borderRadius: 24, background: r.ours ? C.salmon : "rgba(40, 25, 16, 0.16)" }} />
            <div style={{ marginLeft: 30, display: "flex", alignItems: "baseline", gap: 16, opacity: ramp(frame, at + 60 + i * 14, 16) }}>
              <span style={serif(110, { lineHeight: "110px", letterSpacing: "-0.04em", color: r.ours ? C.alertText : C.walnut })}>${Math.round(r.usd / 1000)}K</span>
              {r.note ? <span style={serif(36, { color: muted })}>{r.note}</span> : null}
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 120, top: 790, ...serif(76), ...wipe(ramp(frame, at + 100, 34, EASE_OUT)) }}>About a Third of the Cost</div>
      <div style={{ position: "absolute", left: 124, top: 950, ...serif(30, { color: muted }), opacity: ramp(frame, at + 90, 16) }}>Median total compensation, senior software engineers &middot; Levels.fyi, October 2026 &middot; USD, CAD at 0.71</div>
    </div>
  );
}

/* ─── 5. Insights: each clinic sees its agent traffic ─────────────────────── */

const WEEKS = [21, 26, 30, 33, 41, 44, 52, 57, 63, 70, 78, 86];

function Insights({ frame }: { frame: number }) {
  const [at, out] = BEATS.insights;
  const layer = beat(frame, at, out);
  if (!layer) return null;
  const win = ramp(frame, at + 8, 30, EASE_OUT);
  const max = Math.max(...WEEKS);
  return (
    <div style={layer}>
      <div style={{ position: "absolute", left: 120, top: 84 }}>
        <Words text="Every Clinic Sees Its Agent Traffic" frame={frame} at={at + 4} size={84} />
      </div>
      <Browser x={120} y={250} w={1680} h={720} tab="Insights" url="doe.care/maren-skin-clinic/insights" style={{ opacity: win, transform: `translateY(${((1 - win) * 40).toFixed(2)}px)` }}>
        <div style={{ position: "absolute", left: 64, top: 48 }}>
          <div style={serif(210, { lineHeight: "210px", letterSpacing: "-0.04em" })}>214</div>
          <div style={serif(44, { color: muted })}>Agent Searches This Month</div>
          <div style={{ marginTop: 56, display: "flex", gap: 80 }}>
            <Stat value="38" label="Questions Answered" frame={frame} at={at + 40} />
            <Stat value="12" label="Visits Booked" frame={frame} at={at + 48} tone={SAGE_TEXT} />
          </div>
        </div>
        <div style={{ position: "absolute", right: 64, bottom: 64, width: 820, height: 440, display: "flex", alignItems: "flex-end", gap: 16 }}>
          {WEEKS.map((v, i) => {
            const g = ramp(frame, at + 24 + i * 4, 30, EASE_OUT);
            return <div key={i} style={{ flex: 1, height: (v / max) * 440 * g, borderRadius: 14, background: i === WEEKS.length - 1 ? C.salmon : C.sand2 }} />;
          })}
        </div>
      </Browser>
    </div>
  );
}

function Stat({ value, label, frame, at, tone = C.walnut }: { value: string; label: string; frame: number; at: number; tone?: string }) {
  const p = ramp(frame, at, 20, EASE_OUT);
  const style: CSSProperties = { opacity: p, transform: `translateY(${((1 - p) * 16).toFixed(2)}px)` };
  return (
    <div style={style}>
      <div style={serif(110, { lineHeight: "110px", color: tone })}>{value}</div>
      <div style={serif(36, { color: muted })}>{label}</div>
    </div>
  );
}
