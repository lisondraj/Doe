import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

import { DotWave, FlowLines, Stage } from "../video1/backdrops";
import { EASE_IN, EASE_IN_OUT, EASE_OUT, blink, camera, keys, lerp, pulse, ramp, typed } from "../video1/motion";
import { C, F } from "../video1/theme";
import { AppShell, Caret, ClickRing, Cursor, ShadowsContext, Toggle } from "../video1/ui";
import { BedTrack, CardTitle, DotGlobe, Glyph, Mark, Menu, PageTitle, Pill, RoundButton, SAGE, SAGE_TEXT, SECTION_FRAMES, SOFT, SUB, Segmented, Select, SwapPill, Tick, clamp01, rise, type AnyIcon } from "./kit";

export const V3_CONNECT_FRAMES = SECTION_FRAMES;

/* ─── Timeline ─────────────────────────────────────────────────────────────── */

const TYPE = { at: 16, cps: 31 };
const SEND_AT = 206;
const LIFT_AT = SEND_AT + 4;
const RESULTS_AT = 232;
/** Location is set from the start; the three care filters land one after another. */
const FILTER_AT = [272, 314, 356];
const COLLAPSE_DELAY = 8;
const PICK_AT = 386;
/** Zoom-through: the camera dives into Hudson's row and the practice's own Doe profile resolves out of it. */
const DIVE_OUT_AT = 402;
const PROFILE_AT = 410;
const PUBLISH_AT = 652;
/** Whip pan: the profile and the match card travel up together, as one camera tilt. */
const WHIP_AT = 682;
const WHIP_DUR = 24;
const WHIP_DIST = 1180;
const MATCH_AT = WHIP_AT + WHIP_DUR - 6;
const BOOK_AT = 792;
const SLOT_PICK_AT = 828;
const LEAD_AT = 846;

/* ─── Agent request ────────────────────────────────────────────────────────── */

const QUERY = "Find me a physician in New York who offers same-week appointments, coordinates specialist care, and has a comprehensive annual health program.";
const QUERY_BOX = { x: 310, w: 1300, top: 296, h: 480 };
const COMPACT = { top: 52, scale: 0.6 };
const SEND_BUTTON = { x: QUERY_BOX.x + QUERY_BOX.w - 52 - 36, y: QUERY_BOX.top + QUERY_BOX.h - 40 - 36 };

const SEARCH_CAMS = [
  { f: 0, x: 690, y: 450, s: 1.6 },
  { f: 30, x: 720, y: 462, s: 1.56 },
  { f: 90, x: 880, y: 520, s: 1.48 },
  { f: 150, x: 960, y: 560, s: 1.36 },
  { f: 186, x: 960, y: 545, s: 1.06 },
  { f: SEND_AT + 2, x: 960, y: 545, s: 1.06 },
  { f: 252, x: 960, y: 520, s: 1 },
  { f: 300, x: 960, y: 610, s: 1.04 },
  { f: 372, x: 960, y: 620, s: 1.16 },
  { f: PICK_AT, x: 820, y: 640, s: 1.36 },
  { f: DIVE_OUT_AT + 12, x: 570, y: 662, s: 3.4 },
];

/* ─── Practice matching ────────────────────────────────────────────────────── */

const RESULTS = { x: 310, w: 1300, top: 404, pad: 28 };
const TABLE_Y = 176;
const TH_H = 44;
const ROW_H = 76;
const ROW_GAP = 6;
const COLS = [
  { label: "Same-week", w: 150 },
  { label: "Specialist coordination", w: 230 },
  { label: "Annual program", w: 180 },
  { label: "Next opening", w: 150 },
];
const COUNTS = [1904, 388, 52, 3];

type Practice = { name: string; tone: string; cells: [number, number, number]; next: string };

const PRACTICES: Practice[] = [
  { name: "Hudson Concierge Medicine", tone: C.salmon, cells: [1, 1, 1], next: "Wed 10:30 AM" },
  { name: "Midtown Medical Group", tone: C.sand2, cells: [0, 1, 0], next: "Nov 24" },
  { name: "Madison Private Health", tone: SAGE, cells: [1, 1, 1], next: "Thu 2:00 PM" },
  { name: "Chelsea Primary Care", tone: C.sand2, cells: [1, 0, 0], next: "Fri 4:15 PM" },
  { name: "Gramercy Family Practice", tone: SAGE, cells: [0, 0, 1], next: "Dec 2" },
  { name: "Park Avenue Internal Medicine", tone: C.salmon, cells: [1, 1, 0], next: "Tue 8:00 AM" },
  { name: "Upper West Concierge", tone: C.sand2, cells: [1, 1, 1], next: "Fri 9:00 AM" },
  { name: "SoHo Health Partners", tone: SAGE, cells: [1, 0, 1], next: "Mon 1:30 PM" },
];

const FILTERS: { label: string; icon: AnyIcon }[] = [
  { label: "New York, NY", icon: "mapPin" },
  { label: "Same-week appointments", icon: "calendar" },
  { label: "Specialist coordination", icon: "users" },
  { label: "Annual health program", icon: "heart" },
];

/** First filter a practice fails, or -1. */
const failsAt = (p: Practice) => p.cells.findIndex((c) => c === 0);
const collapseOf = (p: Practice, frame: number) => {
  const k = failsAt(p);
  return k < 0 ? 0 : ramp(frame, FILTER_AT[k] + COLLAPSE_DELAY, 18, EASE_IN_OUT);
};

/* ─── Practice profile (practice side, in the Doe shell) ───────────────────── */

const SHELL = { x: 240, y: 90 };
const PANEL = { x: SHELL.x + 64, y: SHELL.y + 12 };
const CARDS = {
  memberships: { x: 28, y: 156, w: 640, h: 330 },
  physicians: { x: 680, y: 156, w: 656, h: 330 },
  services: { x: 28, y: 498, w: 420, h: 350 },
  access: { x: 460, y: 498, w: 420, h: 350 },
  availability: { x: 892, y: 498, w: 444, h: 350 },
};
const center = (c: { x: number; y: number; w: number; h: number }) => ({ x: PANEL.x + c.x + c.w / 2, y: PANEL.y + c.y + c.h / 2 });

const T = { memberships: 432, physicians: 474, services: 508, access: 536, pricing: 566, availability: 590 };
const TABS = ["Memberships", "Physicians", "Services", "Access", "Pricing", "Availability"];
const PUBLISH = { x: PANEL.x + 1336 - 62, y: PANEL.y + 51 };

/** Match cut: lands on the page title (the name the camera dove into), clear of the rail, then drops to the cards. */
const PROFILE_CAMS = [
  { f: PROFILE_AT, x: 760, y: PANEL.y + 54, s: 2.3 },
  { f: 424, x: 740, y: PANEL.y + 80, s: 2.1 },
  { f: 450, x: center(CARDS.memberships).x, y: center(CARDS.memberships).y, s: 1.95 },
  { f: 470, x: center(CARDS.memberships).x + 20, y: center(CARDS.memberships).y, s: 1.9 },
  { f: 502, x: center(CARDS.physicians).x - 60, y: center(CARDS.physicians).y + 10, s: 1.72 },
  { f: 534, x: (center(CARDS.services).x + center(CARDS.access).x) / 2, y: center(CARDS.access).y - 20, s: 1.58 },
  { f: 562, x: center(CARDS.access).x + 90, y: center(CARDS.access).y - 30, s: 1.5 },
  { f: 590, x: 1000, y: 600, s: 1.2 },
  { f: 614, x: 960, y: 540, s: 1 },
  { f: 640, x: 1120, y: 430, s: 1.14 },
  { f: MATCH_AT + 10, x: 1150, y: 400, s: 1.2 },
];

type Membership = { name: string; price: number; per: string; chips: string[]; tone: string };
const MEMBERSHIPS: Membership[] = [
  { name: "Essential", price: 6000, per: "/ yr", chips: ["Same-week visits", "Annual exam"], tone: C.sand2 },
  { name: "Comprehensive", price: 12000, per: "/ yr", chips: ["Direct physician line", "Specialist coordination"], tone: SAGE },
  { name: "Executive Health", price: 24000, per: "/ yr", chips: ["Half-day assessment", "Quarterly reviews"], tone: C.salmon },
];

const PHYSICIANS = [
  { name: "Dr. Eleanor Shaw, MD", focus: "Internal medicine", letter: "E", tone: C.salmon },
  { name: "Dr. Marcus Bell, MD", focus: "Preventive cardiology", letter: "M", tone: C.sand2 },
  { name: "Dr. Anika Rao, MD", focus: "Women’s health", letter: "A", tone: SAGE },
];

const SERVICES = ["Annual executive physical", "Advanced lipid panel", "Coronary calcium CT", "Home visits", "Travel medicine", "Nutrition coaching", "Sleep review", "Telehealth", "Lab draws at home", "Specialist referrals"];

const ACCESS = [
  { label: "Same-week appointments", on: true },
  { label: "Text your physician 24/7", on: true },
  { label: "Specialist coordination", on: true },
  { label: "Home and office visits", on: true },
  { label: "Walk-in hours", on: false },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
/** Open slots per day (row index, 0 = 8 AM, hour steps). */
const SLOTS: number[][] = [[1, 4], [0, 2, 5], [2, 3], [1, 5], [0, 3, 4]];

/* ─── Match + prospective members ──────────────────────────────────────────── */

const MATCH = { x: 250, top: 236, w: 1000 };
const PROSPECTS = { x: 1300, top: 236, w: 560 };
/** Card padding 32 + title 96 + checks 200 + physicians 64, with 28px gaps, then half the 64px button. */
const BOOK_BUTTON = { x: MATCH.x + 32 + 300, y: MATCH.top + 32 + 96 + 28 + 200 + 28 + 64 + 28 + 32 };
const SLOT_ITEMS = [{ label: "Wed, Nov 4 · 10:30 AM" }, { label: "Thu, Nov 5 · 2:00 PM" }, { label: "Fri, Nov 6 · 9:00 AM" }];
const MENU = { x: MATCH.x + 32, y: BOOK_BUTTON.y + 40, w: 420, rowH: 56 };

const MATCH_CAMS = [
  { f: WHIP_AT, x: 760, y: 600, s: 1.34 },
  { f: 760, x: 760, y: 590, s: 1.24 },
  { f: 800, x: 680, y: 700, s: 1.36 },
  { f: 838, x: 700, y: 690, s: 1.38 },
  { f: 868, x: 1250, y: 530, s: 1.06 },
  { f: SECTION_FRAMES, x: 1270, y: 524, s: 1.12 },
];

const PROSPECT_ROWS = [
  { name: "Jordan Lee", plan: "Comprehensive", next: "Consult Mon", tone: C.sand2 },
  { name: "Priya Nair", plan: "Executive Health", next: "Tour Tue", tone: SAGE },
  { name: "Sam Ortiz", plan: "Essential", next: "Call Fri", tone: C.sand2 },
  { name: "Dana Whitfield", plan: "Comprehensive", next: "Consult Fri", tone: SAGE },
];

/* ─── Film ─────────────────────────────────────────────────────────────────── */

export function Video3Connect() {
  const frame = useCurrentFrame();
  const kept = keys(frame, [FILTER_AT[0], FILTER_AT[0] + 20, FILTER_AT[1], FILTER_AT[1] + 20, FILTER_AT[2], FILTER_AT[2] + 20], [1, 0.42, 0.42, 0.16, 0.16, 0.05]);
  const globeOut = ramp(frame, DIVE_OUT_AT - 6, 16, EASE_IN_OUT);
  const linesIn = ramp(frame, PROFILE_AT + 10, 30, EASE_IN_OUT) * (1 - ramp(frame, MATCH_AT - 10, 20, EASE_IN_OUT));
  const waveIn = ramp(frame, MATCH_AT, 30, EASE_IN_OUT);
  return (
    <ShadowsContext.Provider value={false}>
      <BedTrack voice="video3/CON1.mp3" />
      <Stage
        backdrop={
          <>
            {globeOut < 1 ? (
              <div style={{ position: "absolute", inset: 0, opacity: 1 - globeOut }}>
                <DotGlobe cx={960} cy={560} radius={580} count={2200} keep={kept} />
              </div>
            ) : null}
            {linesIn > 0 ? <FlowLines opacity={0.05 * linesIn} /> : null}
            {waveIn > 0 ? (
              <div style={{ position: "absolute", inset: 0, opacity: waveIn }}>
                <DotWave top={0.5} amp={60} />
              </div>
            ) : null}
          </>
        }
      >
        {frame < DIVE_OUT_AT + 12 ? <SearchWorld frame={frame} /> : null}
        {frame >= PROFILE_AT - 2 && frame < WHIP_AT + WHIP_DUR ? <ProfileWorld frame={frame} /> : null}
        {frame >= WHIP_AT ? <MatchWorld frame={frame} /> : null}
      </Stage>
    </ShadowsContext.Provider>
  );
}

/* ─── Beat 1–2: request → matching ─────────────────────────────────────────── */

function SearchWorld({ frame }: { frame: number }) {
  const text = typed(QUERY, frame, TYPE.at, TYPE.cps);
  const typing = text.length > 0 && text.length < QUERY.length;
  const lift = ramp(frame, LIFT_AT, 34, EASE_IN_OUT);
  const toSend = ramp(frame, 172, 30, EASE_IN_OUT);
  const dive = ramp(frame, DIVE_OUT_AT, 10, EASE_IN);

  return (
    <AbsoluteFill style={{ opacity: 1 - dive, filter: dive > 0 ? `blur(${(dive * 14).toFixed(2)}px)` : undefined }}>
      <div style={camera(frame, SEARCH_CAMS)}>
        <div style={{ position: "absolute", left: QUERY_BOX.x, top: lerp(QUERY_BOX.top, COMPACT.top, lift), width: QUERY_BOX.w, ...rise(frame, 0, { y: 60, scale: 0.96, dur: 26 }) }}>
          <div style={{ transform: `scale(${lerp(1, COMPACT.scale, lift)})`, transformOrigin: "50% 0" }}>
            <Composer frame={frame} text={text} typing={typing} />
          </div>
        </div>

        <div style={{ position: "absolute", left: RESULTS.x, top: RESULTS.top, width: RESULTS.w, ...rise(frame, RESULTS_AT, { y: 90, scale: 0.97, dur: 28 }) }}>
          <ResultsPanel frame={frame} />
        </div>

        <ClickRing x={SEND_BUTTON.x} y={SEND_BUTTON.y} progress={ramp(frame, SEND_AT + 1, 16)} />
        <div style={{ opacity: ramp(frame, 170, 8) * (1 - ramp(frame, SEND_AT + 8, 10)) }}>
          <Cursor x={lerp(1640, SEND_BUTTON.x, toSend)} y={lerp(1010, SEND_BUTTON.y, toSend)} pressed={pulse(frame, SEND_AT - 2, 3, 6)} />
        </div>
      </div>
    </AbsoluteFill>
  );
}

function Composer({ frame, text, typing }: { frame: number; text: string; typing: boolean }) {
  const ready = text.length === QUERY.length;
  return (
    <div style={{ height: QUERY_BOX.h, boxSizing: "border-box", padding: "40px 52px 40px", borderRadius: 44, background: C.paper, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: 999, background: C.salmon, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.ui, fontWeight: 600, fontSize: 22, color: C.walnut }}>A</div>
          <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 28, color: C.walnut }}>Alex&rsquo;s Agent</span>
        </div>
        <Segmented options={["Chat", "Call"]} active={0} height={48} style={{ width: 200 }} />
      </div>
      <div style={{ minHeight: 200, marginTop: 30, fontFamily: F.ui, fontWeight: 500, fontSize: 50, lineHeight: "64px", letterSpacing: "-0.015em", color: C.walnut }}>
        {text.length === 0 ? <span style={{ color: "rgba(40, 25, 16, 0.32)" }}>Ask about your care</span> : text}
        <Caret height={52} width={4} visible={typing ? 1 : frame < SEND_AT ? blink(frame) : 0} />
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
        <div style={{ display: "flex", gap: 10 }}>
          <RoundButton icon="plus" size={64} tone={C.beige} />
          <Pill tone="soft" icon="mapPin" height={64} style={{ background: C.beige }}>
            New York, NY
          </Pill>
          <Pill tone="soft" icon="doc" height={64} style={{ background: C.beige }}>
            Health records
          </Pill>
        </div>
        <div style={{ width: 72, height: 72, borderRadius: 999, background: ready ? C.ink : "rgba(40, 25, 16, 0.18)", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 - 0.1 * pulse(frame, SEND_AT - 2, 3, 8)})` }}>
          <Glyph name="arrowUp" size={30} color={C.paper} stroke={2.4} />
        </div>
      </div>
    </div>
  );
}

function countAt(frame: number) {
  let n = COUNTS[0];
  FILTER_AT.forEach((at, i) => {
    n = lerp(n, COUNTS[i + 1], ramp(frame, at + 2, 20, EASE_OUT));
  });
  return Math.round(n);
}

function ResultsPanel({ frame }: { frame: number }) {
  const count = countAt(frame);
  const at = (o: number) => RESULTS_AT + o;
  return (
    <div style={{ boxSizing: "border-box", padding: RESULTS.pad, paddingBottom: 22, borderRadius: 36, background: C.paper }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 56, ...rise(frame, at(6)) }}>
        <PageTitle size={48} style={{ fontVariantNumeric: "tabular-nums" }}>
          {count.toLocaleString("en-US")} {count === 1 ? "practice" : "practices"}
        </PageTitle>
        <div style={{ display: "flex", gap: 10 }}>
          <Select label="Sort" value="Next opening" height={44} />
          <RoundButton icon="sliders" size={44} tone={C.beige} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 20, height: 50 }}>
        {FILTERS.map((f, i) => {
          const on = i === 0 ? ramp(frame, at(14), 10) : ramp(frame, FILTER_AT[i - 1], 10, EASE_IN_OUT);
          return (
            <div key={f.label} style={rise(frame, at(10 + i * 3), { y: 10, dur: 18 })}>
              <FilterPill label={f.label} icon={f.icon} on={on} press={i === 0 ? 0 : pulse(frame, FILTER_AT[i - 1], 3, 10)} />
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 26, boxSizing: "border-box", padding: 6, borderRadius: 22, background: C.beige, ...rise(frame, at(16), { y: 24, dur: 26 }) }}>
        <div style={{ height: TH_H, display: "flex", alignItems: "center", gap: 16, padding: "0 22px", fontFamily: F.body, fontSize: 14, color: SUB }}>
          <div style={{ flex: 1 }}>Practice</div>
          {COLS.map((col, i) => {
            const hot = i < 3 ? ramp(frame, FILTER_AT[i], 8) : 0;
            return (
              <div key={col.label} style={{ width: col.w, flexShrink: 0, color: hot > 0.5 ? C.walnut : SUB, fontWeight: hot > 0.5 ? 600 : 400 }}>
                {col.label}
              </div>
            );
          })}
        </div>
        {PRACTICES.map((p, i) => (
          <PracticeRow key={p.name} frame={frame} practice={p} index={i} />
        ))}
      </div>
    </div>
  );
}

function FilterPill({ label, icon, on, press }: { label: string; icon: AnyIcon; on: number; press: number }) {
  return (
    <div
      style={{
        position: "relative",
        height: 50,
        boxSizing: "border-box",
        padding: "0 20px 0 16px",
        display: "flex",
        alignItems: "center",
        gap: 9,
        borderRadius: 999,
        overflow: "hidden",
        border: `1.5px dashed rgba(40, 25, 16, ${0.28 * (1 - on)})`,
        fontFamily: F.ui,
        fontWeight: 500,
        fontSize: 18,
        whiteSpace: "nowrap",
        color: on > 0.5 ? C.paper : C.walnut,
        transform: `scale(${1 - 0.06 * press})`,
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: C.ink, opacity: on }} />
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 9 }}>
        <Glyph name={on > 0.5 ? "check" : icon} size={17} color={on > 0.5 ? C.paper : C.walnut} stroke={on > 0.5 ? 2.6 : 2} />
        {label}
      </div>
    </div>
  );
}

function PracticeRow({ frame, practice, index }: { frame: number; practice: Practice; index: number }) {
  const gone = collapseOf(practice, frame);
  if (gone >= 1) return null;
  const enter = ramp(frame, RESULTS_AT + 20 + index * 3, 20);
  const picked = index === 0 ? ramp(frame, PICK_AT, 10, EASE_IN_OUT) : 0;
  return (
    <div style={{ height: (ROW_H + ROW_GAP) * (1 - gone), overflow: "hidden", opacity: enter * (1 - clamp01(gone * 1.6)) }}>
      <div
        style={{
          marginTop: ROW_GAP,
          height: ROW_H,
          boxSizing: "border-box",
          padding: "0 22px 0 18px",
          display: "flex",
          alignItems: "center",
          gap: 16,
          borderRadius: 16,
          background: C.paper,
          border: `1.5px solid rgba(20, 12, 4, ${picked})`,
          transform: `translateY(${(1 - enter) * 16}px)`,
        }}
      >
        <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 14 }}>
          <Mark letter={practice.name[0]} size={42} tone={practice.tone} />
          <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 19, color: C.walnut, whiteSpace: "nowrap" }}>{practice.name}</span>
        </div>
        {practice.cells.map((cell, k) => {
          const flash = pulse(frame, FILTER_AT[k], 5, 16);
          return (
            <div key={k} style={{ width: COLS[k].w, flexShrink: 0, display: "flex" }}>
              {cell ? (
                <div style={{ width: 30, height: 30, borderRadius: 999, background: SAGE, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.18 * flash})` }}>
                  <Glyph name="check" size={16} color={SAGE_TEXT} stroke={2.8} />
                </div>
              ) : (
                <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 19, color: flash > 0.05 ? C.alertText : C.faint }}>—</span>
              )}
            </div>
          );
        })}
        <div style={{ width: COLS[3].w, flexShrink: 0, display: "flex" }}>
          <div style={{ height: 32, padding: "0 12px", display: "flex", alignItems: "center", borderRadius: 999, background: picked > 0 ? `rgba(252, 207, 184, ${picked})` : "transparent", fontFamily: F.ui, fontWeight: 500, fontSize: 16, color: C.walnut, whiteSpace: "nowrap", marginLeft: -12 }}>
            {practice.next}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Beat 3: the practice's structured profile ────────────────────────────── */

function ProfileWorld({ frame }: { frame: number }) {
  const arrive = ramp(frame, PROFILE_AT - 2, 20, EASE_OUT);
  const whip = ramp(frame, WHIP_AT, WHIP_DUR, EASE_IN_OUT);
  const tab = keys(frame, [T.memberships, T.physicians, T.services, T.access, T.pricing, T.availability], [0, 1, 2, 3, 4, 5]);
  const toPublish = ramp(frame, 616, 32, EASE_IN_OUT);
  const smear = 8 * Math.sin(Math.PI * whip) + 10 * (1 - arrive);
  return (
    <AbsoluteFill style={{ opacity: arrive, filter: smear > 0.1 ? `blur(${smear.toFixed(2)}px)` : undefined, transform: `translateY(${-WHIP_DIST * whip}px) scale(${lerp(1.06, 1, arrive)})` }}>
      <div style={camera(frame, PROFILE_CAMS)}>
        <div style={{ position: "absolute", left: SHELL.x, top: SHELL.y }}>
          <AppShell active={3} railReveal={(i) => ramp(frame, PROFILE_AT + 8 + i * 3, 12)}>
            <ProfileHeader frame={frame} />
            <div style={{ position: "absolute", left: 28, top: 96, ...rise(frame, PROFILE_AT + 12, { y: 10 }) }}>
              <Segmented options={TABS} active={tab} height={42} />
            </div>
            <MembershipsCard frame={frame} />
            <PhysiciansCard frame={frame} />
            <ServicesCard frame={frame} />
            <AccessCard frame={frame} />
            <AvailabilityCard frame={frame} />
          </AppShell>
        </div>
        <ClickRing x={PUBLISH.x} y={PUBLISH.y} progress={ramp(frame, PUBLISH_AT + 1, 16)} />
        <div style={{ opacity: ramp(frame, 614, 8) * (1 - ramp(frame, PUBLISH_AT + 14, 10)) }}>
          <Cursor x={lerp(1200, PUBLISH.x, toPublish)} y={lerp(720, PUBLISH.y, toPublish)} pressed={pulse(frame, PUBLISH_AT - 2, 3, 6)} />
        </div>
      </div>
    </AbsoluteFill>
  );
}

function ProfileHeader({ frame }: { frame: number }) {
  const live = ramp(frame, PUBLISH_AT + 2, 12, EASE_IN_OUT);
  return (
    <>
      <PageTitle style={{ position: "absolute", left: 28, top: 28, ...rise(frame, PROFILE_AT - 2, { y: 8, dur: 16 }) }}>Hudson Concierge Medicine</PageTitle>
      <div style={{ position: "absolute", right: 28, top: 30, display: "flex", alignItems: "center", gap: 10, ...rise(frame, PROFILE_AT + 10) }}>
        <Pill tone="soft" icon="eye" height={42} style={{ background: C.beige }}>
          Preview as agent
        </Pill>
        <SwapPill p={live} press={pulse(frame, PUBLISH_AT - 2, 3, 8)} height={42} from={{ label: "Publish", tone: "ink" }} to={{ label: "Live", icon: "check", tone: "sage" }} style={{ width: 124 }} />
      </div>
    </>
  );
}

function Card({ box, frame, at, title, action, children }: { box: { x: number; y: number; w: number; h: number }; frame: number; at: number; title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <div style={{ position: "absolute", left: box.x, top: box.y, width: box.w, height: box.h, boxSizing: "border-box", padding: 20, borderRadius: 24, background: C.paper, border: `1px solid ${C.line}`, display: "flex", flexDirection: "column", gap: 16, ...rise(frame, at, { y: 22, scale: 0.98, dur: 24 }) }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 34 }}>
        <CardTitle>{title}</CardTitle>
        {action}
      </div>
      {children}
    </div>
  );
}

function MembershipsCard({ frame }: { frame: number }) {
  return (
    <Card box={CARDS.memberships} frame={frame} at={T.memberships} title="Memberships" action={<RoundButton icon="plus" size={34} tone={C.beige} />}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {MEMBERSHIPS.map((m, i) => {
          const at = T.memberships + 4 + i * 5;
          const price = Math.round(m.price * ramp(frame, T.pricing + i * 5, 20, EASE_OUT));
          const priced = frame >= T.pricing + i * 5;
          return (
            <div key={m.name} style={{ height: 76, boxSizing: "border-box", padding: "0 18px 0 14px", display: "flex", alignItems: "center", gap: 14, borderRadius: 16, background: C.beige, ...rise(frame, at, { y: 14, dur: 18 }) }}>
              <div style={{ width: 10, height: 44, borderRadius: 99, background: m.tone }} />
              <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 7 }}>
                <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 18, color: C.walnut }}>{typed(m.name, frame, at + 2, 70)}</span>
                <div style={{ display: "flex", gap: 6 }}>
                  {m.chips.map((chip, k) => (
                    <span key={chip} style={{ height: 24, padding: "0 9px", display: "inline-flex", alignItems: "center", borderRadius: 999, background: C.paper, fontFamily: F.body, fontWeight: 500, fontSize: 12, color: C.walnut, ...rise(frame, at + 6 + k * 2, { y: 6, dur: 14 }) }}>
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, opacity: priced ? 1 : 0.35 }}>
                <span style={{ fontFamily: F.display, fontWeight: 500, fontSize: 30, letterSpacing: "-0.02em", color: C.walnut, fontVariantNumeric: "tabular-nums" }}>{priced ? `$${price.toLocaleString("en-US")}` : "$—"}</span>
                <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 14, color: SUB }}>{m.per}</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function PhysiciansCard({ frame }: { frame: number }) {
  return (
    <Card box={CARDS.physicians} frame={frame} at={T.physicians} title="Physicians" action={<Pill tone="soft" icon="plus" height={34} style={{ background: C.beige }}>Add</Pill>}>
      <div style={{ display: "flex", gap: 10, flex: 1 }}>
        {PHYSICIANS.map((p, i) => {
          const at = T.physicians + 6 + i * 6;
          return (
            <div key={p.name} style={{ flex: 1, boxSizing: "border-box", padding: 12, borderRadius: 18, background: C.beige, display: "flex", flexDirection: "column", gap: 12, ...rise(frame, at, { y: 18, dur: 20 }) }}>
              <div style={{ flex: 1, borderRadius: 12, background: p.tone, display: "flex", alignItems: "flex-end", padding: 12, boxSizing: "border-box" }}>
                <span style={{ fontFamily: F.display, fontWeight: 500, fontSize: 64, lineHeight: "64px", color: "rgba(40, 25, 16, 0.85)" }}>{p.letter}</span>
              </div>
              <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 15, color: C.walnut, whiteSpace: "nowrap" }}>{p.name}</div>
              <div style={{ display: "flex" }}>
                <span style={{ height: 26, padding: "0 10px", display: "inline-flex", alignItems: "center", borderRadius: 999, background: C.paper, fontFamily: F.body, fontWeight: 500, fontSize: 12, color: C.walnut, whiteSpace: "nowrap" }}>{p.focus}</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function ServicesCard({ frame }: { frame: number }) {
  return (
    <Card box={CARDS.services} frame={frame} at={T.services} title="Services" action={<span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 14, color: SUB }}>{Math.min(SERVICES.length, Math.max(0, Math.floor((frame - T.services - 4) / 3) + 1))} listed</span>}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignContent: "flex-start" }}>
        {SERVICES.map((s, i) => (
          <div key={s} style={{ height: 36, padding: "0 14px", display: "flex", alignItems: "center", borderRadius: 999, background: i % 3 === 0 ? C.beige : "transparent", border: i % 3 === 0 ? undefined : `1px solid ${C.line2}`, boxSizing: "border-box", fontFamily: F.ui, fontWeight: 500, fontSize: 15, color: C.walnut, whiteSpace: "nowrap", ...rise(frame, T.services + 4 + i * 3, { y: 8, scale: 0.9, dur: 14 }) }}>
            {s}
          </div>
        ))}
      </div>
    </Card>
  );
}

function AccessCard({ frame }: { frame: number }) {
  return (
    <Card box={CARDS.access} frame={frame} at={T.access} title="Access">
      <div style={{ display: "flex", flexDirection: "column" }}>
        {ACCESS.map((a, i) => {
          const at = T.access + 6 + i * 5;
          return (
            <div key={a.label} style={{ height: 50, display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: i ? `1px solid ${C.line}` : undefined, ...rise(frame, at, { x: 10, y: 0, dur: 16 }) }}>
              <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 16, color: a.on ? C.walnut : SUB }}>{a.label}</span>
              <Toggle progress={a.on ? ramp(frame, at + 8, 10, EASE_IN_OUT) : 0} />
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function AvailabilityCard({ frame }: { frame: number }) {
  return (
    <Card box={CARDS.availability} frame={frame} at={T.availability} title="Availability" action={<Select value="This week" height={34} />}>
      <div style={{ display: "flex", gap: 8, flex: 1 }}>
        {DAYS.map((d, i) => (
          <div key={d} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ height: 22, fontFamily: F.ui, fontWeight: 600, fontSize: 14, color: C.walnut, textAlign: "center" }}>{d}</div>
            {Array.from({ length: 6 }, (_, r) => {
              const open = SLOTS[i].includes(r);
              const p = open ? ramp(frame, T.availability + 8 + (i * 6 + r) * 0.8, 12, EASE_IN_OUT) : 0;
              return (
                <div key={r} style={{ position: "relative", height: 34, borderRadius: 9, background: C.beige, overflow: "hidden" }}>
                  <div style={{ position: "absolute", inset: 0, background: C.ink, opacity: p, transform: `scaleY(${lerp(0.4, 1, p)})` }} />
                  {open ? (
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.ui, fontWeight: 500, fontSize: 12, color: C.paper, opacity: p }}>
                      {8 + r > 12 ? `${8 + r - 12} PM` : `${8 + r} ${8 + r === 12 ? "PM" : "AM"}`}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ─── Beat 4: matched, and a new prospective member ────────────────────────── */

function MatchWorld({ frame }: { frame: number }) {
  const toBook = ramp(frame, 760, 30, EASE_IN_OUT);
  const toSlot = ramp(frame, BOOK_AT + 10, 22, EASE_IN_OUT);
  const menu = ramp(frame, BOOK_AT + 2, 12, EASE_OUT) * (1 - ramp(frame, SLOT_PICK_AT + 4, 8, EASE_IN));
  const hover = keys(frame, [BOOK_AT + 12, BOOK_AT + 26, SLOT_PICK_AT - 4], [0, 0, 1]);
  const slotY = MENU.y + 6 + MENU.rowH / 2;
  const whip = ramp(frame, WHIP_AT, WHIP_DUR, EASE_IN_OUT);
  const smear = 8 * Math.sin(Math.PI * whip);
  return (
    <AbsoluteFill style={{ transform: `translateY(${WHIP_DIST * (1 - whip)}px)`, filter: smear > 0.1 ? `blur(${smear.toFixed(2)}px)` : undefined }}>
      <div style={camera(frame, MATCH_CAMS)}>
        <div style={{ position: "absolute", left: MATCH.x, top: MATCH.top, width: MATCH.w }}>
          <MatchCard frame={frame} />
        </div>
        <div style={{ position: "absolute", left: PROSPECTS.x, top: PROSPECTS.top, width: PROSPECTS.w, ...rise(frame, WHIP_AT + 10, { y: 60, dur: 30 }) }}>
          <ProspectsPanel frame={frame} />
        </div>
        <Menu items={SLOT_ITEMS} open={menu} hover={hover} picked={frame >= SLOT_PICK_AT ? 1 : -1} width={MENU.w} rowH={MENU.rowH} origin="30% 0" style={{ left: MENU.x, top: MENU.y }} />
        <ClickRing x={BOOK_BUTTON.x} y={BOOK_BUTTON.y} progress={ramp(frame, BOOK_AT + 1, 16)} />
        <div style={{ opacity: ramp(frame, 758, 8) * (1 - ramp(frame, SLOT_PICK_AT + 12, 10)) }}>
          <Cursor
            x={lerp(lerp(1180, BOOK_BUTTON.x, toBook), MENU.x + 250, toSlot)}
            y={lerp(lerp(980, BOOK_BUTTON.y, toBook), slotY + MENU.rowH * hover, toSlot)}
            pressed={Math.max(pulse(frame, BOOK_AT - 2, 3, 6), pulse(frame, SLOT_PICK_AT - 2, 3, 6))}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
}

const MATCH_CHECKS = [
  { label: "Same-week appointments", value: "Wed, Nov 4" },
  { label: "Coordinates specialist care", value: "Cardiology · Ortho · Derm" },
  { label: "Annual health program", value: "Executive Health · $24,000" },
];

function MatchCard({ frame }: { frame: number }) {
  const booked = ramp(frame, SLOT_PICK_AT + 6, 12, EASE_IN_OUT);
  const at = (o: number) => MATCH_AT + o;
  return (
    <div style={{ boxSizing: "border-box", padding: 32, borderRadius: 40, background: C.paper, display: "flex", flexDirection: "column", gap: 28 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 22, height: 96 }}>
        <Mark letter="H" size={96} tone={C.salmon} radius={26} />
        <PageTitle size={52}>Hudson Concierge Medicine</PageTitle>
      </div>
      <div style={{ boxSizing: "border-box", padding: "4px 22px", borderRadius: 24, background: C.beige }}>
        {MATCH_CHECKS.map((c, i) => (
          <div key={c.label} style={{ height: 64, display: "flex", alignItems: "center", gap: 14, borderTop: i ? `1px solid ${C.line}` : undefined, ...rise(frame, at(18 + i * 6), { x: 12, y: 0, dur: 16 }) }}>
            <Tick p={ramp(frame, at(24 + i * 6), 10, EASE_IN_OUT)} size={28} />
            <span style={{ flex: 1, fontFamily: F.ui, fontWeight: 600, fontSize: 21, color: C.walnut }}>{c.label}</span>
            <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 19, color: SUB, whiteSpace: "nowrap" }}>{c.value}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, height: 64, ...rise(frame, at(40), { y: 10 }) }}>
        {PHYSICIANS.map((p) => (
          <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 10, height: 64, padding: "0 20px 0 10px", borderRadius: 999, border: `1px solid ${C.line2}`, boxSizing: "border-box" }}>
            <Mark letter={p.letter} size={44} tone={p.tone} radius={999} />
            <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 18, color: C.walnut, whiteSpace: "nowrap" }}>{p.name.replace(", MD", "")}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 12, height: 64, ...rise(frame, at(48), { y: 10 }) }}>
        <SwapPill
          p={booked}
          press={pulse(frame, BOOK_AT - 2, 3, 8) * 0.6}
          height={64}
          from={{ label: "Book intro call", icon: "calendar", trailing: "chevronDown", tone: "ink" }}
          to={{ label: "Intro call · Thu, Nov 5 · 2:00 PM", icon: "check", tone: "sage" }}
          style={{ width: 600, fontSize: 22 }}
        />
        <Pill height={64} tone="soft" icon="list" style={{ flex: 1, fontSize: 22, background: C.beige }}>
          Compare memberships
        </Pill>
      </div>
    </div>
  );
}

function ProspectsPanel({ frame }: { frame: number }) {
  const insert = ramp(frame, LEAD_AT, 18, EASE_IN_OUT);
  const count = frame >= LEAD_AT + 4 ? 5 : 4;
  const row: CSSProperties = { height: 72, boxSizing: "border-box", padding: "0 16px 0 12px", display: "flex", alignItems: "center", gap: 12, borderRadius: 18, background: C.paper };
  return (
    <div style={{ boxSizing: "border-box", padding: 22, borderRadius: 36, background: C.beige, border: `1px solid ${C.line}`, display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 44, padding: "0 4px" }}>
        <CardTitle style={{ fontSize: 28 }}>Prospective members</CardTitle>
        <div style={{ minWidth: 34, height: 34, padding: "0 10px", boxSizing: "border-box", borderRadius: 999, background: C.ink, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.ui, fontWeight: 600, fontSize: 15, color: C.paper, transform: `scale(${1 + 0.18 * pulse(frame, LEAD_AT + 4, 4, 12)})` }}>
          {count}
        </div>
      </div>
      <div style={{ height: 78 * insert, marginBottom: -12 * (1 - insert), overflow: "hidden", opacity: ramp(frame, LEAD_AT + 6, 12) }}>
        <div style={{ ...row, border: `1.5px solid ${C.ink}`, height: 76 }}>
          <Mark letter="A" size={46} tone={C.salmon} radius={999} />
          <span style={{ flex: 1, fontFamily: F.ui, fontWeight: 600, fontSize: 18, color: C.walnut, whiteSpace: "nowrap" }}>Alex Moreno</span>
          <span style={{ height: 30, padding: "0 11px", display: "inline-flex", alignItems: "center", borderRadius: 999, background: C.salmon, fontFamily: F.ui, fontWeight: 500, fontSize: 14, color: C.walnut, whiteSpace: "nowrap" }}>Intro call Thu</span>
        </div>
      </div>
      {PROSPECT_ROWS.map((p, i) => (
        <div key={p.name} style={{ ...row, ...rise(frame, MATCH_AT + 18 + i * 4, { y: 12, dur: 18 }) }}>
          <Mark letter={p.name[0]} size={46} tone={p.tone} radius={999} />
          <span style={{ flex: 1, fontFamily: F.ui, fontWeight: 600, fontSize: 18, color: C.walnut, whiteSpace: "nowrap" }}>{p.name}</span>
          <span style={{ height: 30, padding: "0 11px", display: "inline-flex", alignItems: "center", borderRadius: 999, background: SOFT, fontFamily: F.ui, fontWeight: 500, fontSize: 14, color: C.walnut, whiteSpace: "nowrap" }}>{p.next}</span>
        </div>
      ))}
    </div>
  );
}
