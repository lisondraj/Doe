import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, interpolateColors, useCurrentFrame } from "remotion";

import { DotTide, Stage } from "../video1/backdrops";
import { EASE_IN_OUT, EASE_OUT, blink, camera, keys, lerp, pulse, ramp, typed } from "../video1/motion";
import { C, F } from "../video1/theme";
import { AppShell, Caret, ClickRing, Cursor, ShadowsContext, Toggle } from "../video1/ui";
import { AgentPill, BedTrack, CardTitle, Glyph, Mark, Menu, PageTitle, Pill, RoundButton, SAGE, SECTION_FRAMES, SOFT, SUB, Segmented, Select, SwapPill, Tick, clamp01, rise, type AnyIcon } from "./kit";

export const V3_MEMBERSHIPS_FRAMES = SECTION_FRAMES;

/* ─── Timeline ─────────────────────────────────────────────────────────────── */

/** One appointment, alone, until the camera pulls back and it docks into a membership. */
const PULL_AT = 58;
const PULL_END = 140;
const NEW_CLICK_AT = 196;
const PICK_AT = 236;
const EXEC_IN_AT = 244;
const ASSESS_IN_AT = 298;
const PACKAGE_IN_AT = 322;
const OPEN_CLICK_AT = 378;
const EXPAND_AT = OPEN_CLICK_AT + 4;
const EXPAND_DUR = 28;
/** Editor sections step forward in the order the voiceover names them. */
const SECTION_AT = [404, 440, 476, 514, 552, 590];
const SAVE_AT = 616;
/** Horizontal whip from the practice's editor to the patient's agent. */
const WHIP_AT = 630;
const WHIP_DUR = 24;
const WHIP_DIST = 2200;
const ASK_AT = 648;
const TABLE_AT = 706;
const HILITE_AT = 800;
const REQUEST_AT = 858;

/* ─── Programs page (practice side) ────────────────────────────────────────── */

const SHELL = { x: 240, y: 90 };
const PANEL = { x: SHELL.x + 64, y: SHELL.y + 12 };
const GRID = { x: 28, y: 120, w: 318, h: 728, gap: 12, pad: 18 };
const cardX = (i: number) => GRID.x + i * (GRID.w + GRID.gap);

type Included = { label: string; icon: AnyIcon; tag?: string };
type Program = { name: string; kind: string; price: string; per: string; tone: string; included: Included[]; at: number };

const PROGRAMS: Program[] = [
  {
    name: "Comprehensive",
    kind: "Membership",
    price: "$12,000",
    per: "/ yr",
    tone: SAGE,
    at: PULL_AT,
    included: [
      { label: "Annual Physical", icon: "calendar", tag: "60 min" },
      { label: "Same-week visits", icon: "clock" },
      { label: "Specialist coordination", icon: "users" },
      { label: "Direct physician line", icon: "phone" },
      { label: "Lab work", icon: "flask" },
    ],
  },
  {
    name: "Executive Health",
    kind: "Executive program",
    price: "$24,000",
    per: "/ yr",
    tone: C.salmon,
    at: EXEC_IN_AT,
    included: [
      { label: "Half-day assessment", icon: "activity" },
      { label: "Coronary calcium CT", icon: "heart" },
      { label: "Quarterly reviews", icon: "calendar" },
      { label: "24/7 physician access", icon: "phone" },
      { label: "Travel medicine", icon: "mapPin" },
    ],
  },
  {
    name: "Annual Assessment",
    kind: "Assessment",
    price: "$3,500",
    per: "once",
    tone: C.sand2,
    at: ASSESS_IN_AT,
    included: [
      { label: "Comprehensive physical", icon: "stethoscope" },
      { label: "Advanced labs", icon: "flask" },
      { label: "VO₂ max test", icon: "activity" },
      { label: "Results review", icon: "doc" },
    ],
  },
  {
    name: "Cardiometabolic Care",
    kind: "Care package",
    price: "$2,400",
    per: "/ 6 mo",
    tone: "#E9DCC7",
    at: PACKAGE_IN_AT,
    included: [
      { label: "Glucose monitoring", icon: "activity" },
      { label: "Monthly coaching", icon: "message" },
      { label: "Lipid follow-ups", icon: "flask" },
      { label: "Cardiology consult", icon: "heart" },
    ],
  },
];

/** Card stack: chip 30 · 14 · name 36 · 8 · price 48 · 16 · rule · 16 · rows. */
const ROWS_TOP = GRID.pad + 30 + 14 + 36 + 8 + 48 + 16 + 1 + 16;
const INC_ROW = { h: 52, gap: 6 };
const APPT = { x: PANEL.x + cardX(0) + GRID.pad, y: PANEL.y + GRID.y + ROWS_TOP, w: GRID.w - GRID.pad * 2, h: INC_ROW.h };

const NEW_BUTTON = { x: PANEL.x + 1336 - 52, y: PANEL.y + 53 };
const MENU = { x: PANEL.x + 1336 - 330, y: PANEL.y + 86, w: 330, rowH: 52 };
const MENU_ITEMS: { label: string; icon: AnyIcon }[] = [
  { label: "Membership", icon: "users" },
  { label: "Executive health program", icon: "activity" },
  { label: "Annual assessment", icon: "stethoscope" },
  { label: "Care package", icon: "heart" },
];
const EXEC_CARD = { x: PANEL.x + cardX(1) + GRID.w / 2, y: PANEL.y + GRID.y + 220 };

const PAGE_CAMS = [
  { f: 0, x: APPT.x + APPT.w / 2, y: APPT.y + APPT.h / 2, s: 2.75 },
  { f: PULL_AT - 6, x: APPT.x + APPT.w / 2 + 4, y: APPT.y + APPT.h / 2, s: 2.62 },
  { f: PULL_END, x: 960, y: 540, s: 1 },
  { f: 164, x: 980, y: 520, s: 1.02 },
  { f: 192, x: 1340, y: 290, s: 1.55 },
  { f: PICK_AT + 2, x: 1330, y: 300, s: 1.55 },
  { f: 276, x: 860, y: 470, s: 1.4 },
  { f: 312, x: 960, y: 520, s: 1.1 },
  { f: 350, x: 960, y: 540, s: 1.04 },
  { f: EXPAND_AT, x: 900, y: 520, s: 1.08 },
  { f: EXPAND_AT + EXPAND_DUR, x: 1010, y: 520, s: 1.2 },
  { f: SECTION_AT[1], x: 1040, y: 500, s: 1.3 },
  { f: SECTION_AT[4], x: 1060, y: 520, s: 1.34 },
  { f: SAVE_AT - 6, x: 1180, y: 330, s: 1.36 },
  { f: WHIP_AT + WHIP_DUR, x: 1220, y: 300, s: 1.4 },
];

/* ─── Program editor ───────────────────────────────────────────────────────── */

const EDITOR = { x: 28, y: 28, w: 1308, h: 820 };
const NAV = { x: 24, y: 104, w: 260, rowH: 54 };
const VIEW = { x: 308, y: 104, w: 976, h: 692 };
const SEC_H = 260;
const SEC_GAP = 16;
const SECTIONS: { label: string; icon: AnyIcon }[] = [
  { label: "What’s included", icon: "check" },
  { label: "Who it’s for", icon: "users" },
  { label: "Pricing", icon: "card" },
  { label: "Physician access", icon: "stethoscope" },
  { label: "Testing", icon: "flask" },
  { label: "Ongoing services", icon: "sync" },
];
const SAVE = { x: PANEL.x + EDITOR.x + EDITOR.w - 24 - 60, y: PANEL.y + EDITOR.y + 24 + 23 };

/* ─── Agent comparison ─────────────────────────────────────────────────────── */

const ASK = "I want a more comprehensive approach to my health. What would Hudson actually include?";
const ASK_BOX = { x: 360, top: 84, w: 1200, h: 264 };
const TABLE = { x: 360, top: 372, w: 1200, pad: 24, labelW: 250, headH: 96, rowH: 74, footH: 92 };
const COL_W = (TABLE.w - TABLE.pad * 2 - TABLE.labelW) / 3;
const COMPARE_COLS = [
  { name: "Essential", tone: C.sand2 },
  { name: "Comprehensive", tone: SAGE },
  { name: "Executive Health", tone: C.salmon },
];
const COMPARE_ROWS: { label: string; cells: string[] }[] = [
  { label: "Price", cells: ["$6,000 / yr", "$12,000 / yr", "$24,000 / yr"] },
  { label: "Physician access", cells: ["Office hours", "Direct line", "24/7 · Dr. Shaw"] },
  { label: "Testing", cells: ["Annual labs", "Advanced labs", "Calcium CT · VO₂ max"] },
  { label: "Ongoing services", cells: ["—", "Specialist coordination", "Quarterly reviews"] },
  { label: "Same-week visits", cells: ["✓", "✓", "✓"] },
];
const REQUEST = { x: TABLE.x + TABLE.pad + TABLE.labelW + COL_W * 2 + COL_W / 2, y: TABLE.top + TABLE.pad + TABLE.headH + COMPARE_ROWS.length * TABLE.rowH + TABLE.footH / 2 };
const EXEC_COL_X = TABLE.x + TABLE.pad + TABLE.labelW + COL_W * 2;

const COMPARE_CAMS = [
  { f: WHIP_AT, x: 960, y: 250, s: 1.4 },
  { f: ASK_AT + 10, x: 960, y: 240, s: 1.36 },
  { f: TABLE_AT - 4, x: 960, y: 300, s: 1.3 },
  { f: 752, x: 960, y: 560, s: 1.0 },
  { f: HILITE_AT + 10, x: 1080, y: 650, s: 1.22 },
  { f: SECTION_FRAMES, x: 1100, y: 680, s: 1.3 },
];

/* ─── Film ─────────────────────────────────────────────────────────────────── */

export function Video3Memberships() {
  const frame = useCurrentFrame();
  return (
    <ShadowsContext.Provider value={false}>
      <BedTrack voice="video3/CON2.mp3" />
      <Stage backdrop={<DotTide />}>
        {frame < WHIP_AT + WHIP_DUR ? <PracticeWorld frame={frame} /> : null}
        {frame >= WHIP_AT ? <CompareWorld frame={frame} /> : null}
      </Stage>
    </ShadowsContext.Provider>
  );
}

type Rect = { x: number; y: number; w: number; h: number; r: number };
const lerpRect = (a: Rect, b: Rect, t: number): Rect => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), w: lerp(a.w, b.w, t), h: lerp(a.h, b.h, t), r: lerp(a.r, b.r, t) });
/** Shell-local rects: the appointment row, its membership card, the whole shell. */
const UNFOLD: Rect[] = [
  { x: APPT.x - SHELL.x, y: APPT.y - SHELL.y, w: APPT.w, h: APPT.h, r: 14 },
  { x: PANEL.x - SHELL.x + cardX(0), y: PANEL.y - SHELL.y + GRID.y, w: GRID.w, h: GRID.h, r: 24 },
  { x: 0, y: 0, w: 1440, h: 900, r: 28 },
];

/** The shell opens outward from the appointment: row → membership card → the whole Programs page. */
function unfold(frame: number) {
  const a = ramp(frame, PULL_AT, 30, EASE_IN_OUT);
  const b = ramp(frame, PULL_AT + 26, 44, EASE_IN_OUT);
  if (b >= 1) return undefined;
  const r = lerpRect(lerpRect(UNFOLD[0], UNFOLD[1], a), UNFOLD[2], b);
  return `inset(${r.y.toFixed(1)}px ${(1440 - r.x - r.w).toFixed(1)}px ${(900 - r.y - r.h).toFixed(1)}px ${r.x.toFixed(1)}px round ${r.r.toFixed(1)}px)`;
}

function PracticeWorld({ frame }: { frame: number }) {
  const whip = ramp(frame, WHIP_AT, WHIP_DUR, EASE_IN_OUT);
  const smear = 9 * Math.sin(Math.PI * whip);
  const expand = ramp(frame, EXPAND_AT, EXPAND_DUR, EASE_IN_OUT);

  const toNew = ramp(frame, 166, 28, EASE_IN_OUT);
  const hover = keys(frame, [NEW_CLICK_AT + 10, PICK_AT - 6], [0, 1]);
  const toItem = ramp(frame, NEW_CLICK_AT + 6, 18, EASE_IN_OUT);
  const menuOpen = ramp(frame, NEW_CLICK_AT + 2, 12, EASE_OUT) * (1 - ramp(frame, PICK_AT + 2, 8));
  const itemY = MENU.y + 6 + MENU.rowH * hover + MENU.rowH / 2;
  const toCard = ramp(frame, 344, 30, EASE_IN_OUT);
  const toSave = ramp(frame, SAVE_AT - 26, 22, EASE_IN_OUT);

  return (
    <AbsoluteFill style={{ transform: `translateX(${-WHIP_DIST * whip}px)`, filter: smear > 0.1 ? `blur(${smear.toFixed(2)}px)` : undefined }}>
      <div style={camera(frame, PAGE_CAMS)}>
        <div style={{ position: "absolute", left: SHELL.x, top: SHELL.y, width: 1440, height: 900, clipPath: unfold(frame), opacity: ramp(frame, 0, 14) }}>
          <AppShell active={2} railReveal={(i) => ramp(frame, PULL_AT + 40 + i * 3, 12)}>
            <ProgramsHeader frame={frame} />
            {PROGRAMS.map((p, i) => (
              <ProgramCard key={p.name} frame={frame} program={p} index={i} dim={expand} />
            ))}
            <Editor frame={frame} expand={expand} />
          </AppShell>
        </div>

        <Menu items={MENU_ITEMS} open={menuOpen} hover={hover} picked={frame >= PICK_AT ? 1 : -1} width={MENU.w} rowH={MENU.rowH} origin="100% 0" style={{ left: MENU.x, top: MENU.y }} />
        <ClickRing x={NEW_BUTTON.x} y={NEW_BUTTON.y} progress={ramp(frame, NEW_CLICK_AT + 1, 16)} />
        <div style={{ opacity: ramp(frame, 164, 8) * (1 - ramp(frame, PICK_AT + 10, 10)) }}>
          <Cursor
            x={lerp(lerp(1500, NEW_BUTTON.x, toNew), MENU.x + 200, toItem)}
            y={lerp(lerp(760, NEW_BUTTON.y, toNew), itemY, toItem)}
            pressed={Math.max(pulse(frame, NEW_CLICK_AT - 2, 3, 6), pulse(frame, PICK_AT - 2, 3, 6))}
          />
        </div>
        <ClickRing x={EXEC_CARD.x} y={EXEC_CARD.y} progress={ramp(frame, OPEN_CLICK_AT + 1, 16)} />
        <div style={{ opacity: ramp(frame, 342, 8) * (1 - ramp(frame, OPEN_CLICK_AT + 8, 10)) }}>
          <Cursor x={lerp(1240, EXEC_CARD.x, toCard)} y={lerp(980, EXEC_CARD.y, toCard)} pressed={pulse(frame, OPEN_CLICK_AT - 2, 3, 6)} />
        </div>
        <ClickRing x={SAVE.x} y={SAVE.y} progress={ramp(frame, SAVE_AT + 1, 16)} />
        <div style={{ opacity: ramp(frame, SAVE_AT - 28, 8) * (1 - ramp(frame, SAVE_AT + 10, 8)) }}>
          <Cursor x={lerp(1300, SAVE.x, toSave)} y={lerp(640, SAVE.y, toSave)} pressed={pulse(frame, SAVE_AT - 2, 3, 6)} />
        </div>
      </div>
    </AbsoluteFill>
  );
}

function IncludedRow({ item, bg = C.beige, price = 0, frame, at }: { item: Included; bg?: string; price?: number; frame: number; at: number }) {
  return (
    <div style={{ height: INC_ROW.h, boxSizing: "border-box", padding: "0 10px 0 12px", display: "flex", alignItems: "center", gap: 10, borderRadius: 14, background: bg, ...rise(frame, at, { y: 8, dur: 16 }) }}>
      <div style={{ width: 30, height: 30, borderRadius: 9, background: C.paper, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Glyph name={item.icon} size={15} />
      </div>
      <span style={{ flex: 1, minWidth: 0, fontFamily: F.ui, fontWeight: 600, fontSize: 14, color: C.walnut, whiteSpace: "nowrap" }}>{item.label}</span>
      {item.tag ? <span style={{ height: 24, padding: "0 8px", display: "inline-flex", alignItems: "center", borderRadius: 999, background: SOFT, fontFamily: F.body, fontWeight: 500, fontSize: 11, color: C.walnut, whiteSpace: "nowrap" }}>{item.tag}</span> : null}
      {price > 0.01 ? (
        <span style={{ width: 48 * price, overflow: "hidden", opacity: price, fontFamily: F.ui, fontWeight: 600, fontSize: 14, color: C.walnut, textAlign: "right", whiteSpace: "nowrap" }}>$650</span>
      ) : null}
    </div>
  );
}

function ProgramsHeader({ frame }: { frame: number }) {
  const at = PULL_AT + 50;
  return (
    <>
      <PageTitle style={{ position: "absolute", left: 28, top: 28, ...rise(frame, at, { y: 12 }) }}>Programs</PageTitle>
      <div style={{ position: "absolute", right: 28, top: 32, display: "flex", alignItems: "center", gap: 10, ...rise(frame, at + 4) }}>
        <Segmented options={["All", "Memberships", "Programs", "Packages"]} active={0} height={42} />
        <RoundButton icon="search" size={42} tone={C.beige} />
        <Pill height={42} icon="plus" trailing="chevronDown" press={pulse(frame, NEW_CLICK_AT - 2, 3, 8)}>
          New
        </Pill>
      </div>
    </>
  );
}

function ProgramCard({ frame, program, index, dim }: { frame: number; program: Program; index: number; dim: number }) {
  const first = index === 0;
  const created = index === 1;
  const left = cardX(index);
  const slot = (
    <div style={{ position: "absolute", left, top: GRID.y, width: GRID.w, height: GRID.h, boxSizing: "border-box", borderRadius: 24, border: "1.5px dashed rgba(40, 25, 16, 0.18)", opacity: (1 - ramp(frame, program.at, 10)) * ramp(frame, PULL_AT + 60 + index * 3, 16) }} />
  );
  if (!first && frame < program.at) return slot;

  const enter = first ? 1 : ramp(frame, program.at, 22, EASE_OUT);
  const base = first ? PULL_AT + 18 : program.at + 4;
  const name = created ? typed(program.name, frame, base + 2, 34) : program.name;
  const price = created ? typed(program.price, frame, base + 16, 24) : program.price;
  const press = index === 1 ? pulse(frame, OPEN_CLICK_AT - 2, 3, 8) : 0;
  /** The appointment starts as its own priced paper card and settles into the membership's list. */
  const dock = first ? ramp(frame, PULL_AT + 20, 36, EASE_IN_OUT) : 1;

  return (
    <>
      {first ? null : slot}
      <div
        style={{
          position: "absolute",
          left,
          top: GRID.y,
          width: GRID.w,
          height: GRID.h,
          boxSizing: "border-box",
          padding: GRID.pad,
          borderRadius: 24,
          display: "flex",
          flexDirection: "column",
          opacity: enter * (1 - 0.7 * dim * (index === 1 ? 0 : 1)),
          transform: `translateY(${(1 - enter) * 30}px) scale(${lerp(0.96, 1, enter) * (1 - 0.02 * press)})`,
        }}
      >
        <div style={{ position: "absolute", inset: 0, borderRadius: 24, background: C.paper, border: `1px solid ${C.line}`, boxSizing: "border-box" }} />
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", height: 30, ...rise(frame, base, { y: 6, dur: 16 }) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, height: 30, padding: "0 12px 0 6px", borderRadius: 999, background: C.beige, fontFamily: F.ui, fontWeight: 500, fontSize: 13, color: C.walnut }}>
            <div style={{ width: 18, height: 18, borderRadius: 999, background: program.tone }} />
            {program.kind}
          </div>
          <Glyph name="more" size={18} color={SUB} />
        </div>
        <div style={{ position: "relative", marginTop: 14, height: 36, fontFamily: F.display, fontWeight: 500, fontSize: 30, lineHeight: "36px", letterSpacing: "-0.02em", color: C.walnut, whiteSpace: "nowrap", ...rise(frame, base + 2, { y: 8, dur: 18 }) }}>
          {name}
          {created && name.length < program.name.length ? <Caret height={28} width={2} /> : null}
        </div>
        <div style={{ position: "relative", marginTop: 8, height: 48, display: "flex", alignItems: "baseline", gap: 6, ...rise(frame, base + 4, { y: 8, dur: 18 }) }}>
          <span style={{ fontFamily: F.display, fontWeight: 500, fontSize: 40, lineHeight: "48px", letterSpacing: "-0.025em", color: C.walnut, fontVariantNumeric: "tabular-nums" }}>{price || "$"}</span>
          <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 15, color: SUB }}>{program.per}</span>
        </div>
        <div style={{ position: "relative", marginTop: 16, height: 1, background: C.line }} />
        <div style={{ position: "relative", marginTop: 16, display: "flex", flexDirection: "column", gap: INC_ROW.gap }}>
          {program.included.map((item, k) =>
            first && k === 0 ? (
              <IncludedRow key={item.label} item={item} frame={frame} at={4} bg={interpolateColors(dock, [0, 1], [C.paper, C.beige])} price={1 - dock} />
            ) : (
              <IncludedRow key={item.label} item={item} frame={frame} at={base + 10 + k * 4} />
            ),
          )}
        </div>
        <div style={{ position: "relative", marginTop: "auto", height: 44, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 4px", ...rise(frame, base + 30, { y: 6 }) }}>
          <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 14, color: C.walnut }}>Visible to agents</span>
          <Toggle progress={created ? ramp(frame, base + 34, 10, EASE_IN_OUT) : 1} />
        </div>
      </div>
    </>
  );
}

/* ─── Editor ───────────────────────────────────────────────────────────────── */

function Editor({ frame, expand }: { frame: number; expand: number }) {
  if (expand <= 0) return null;
  const from = { x: cardX(1), y: GRID.y, w: GRID.w, h: GRID.h };
  const box = { x: lerp(from.x, EDITOR.x, expand), y: lerp(from.y, EDITOR.y, expand), w: lerp(from.w, EDITOR.w, expand), h: lerp(from.h, EDITOR.h, expand) };
  const content = clamp01((expand - 0.55) / 0.45);
  const active = SECTION_AT.slice(1).reduce((sum, at) => sum + ramp(frame, at - 10, 16, EASE_IN_OUT), 0);
  const maxScroll = SECTIONS.length * (SEC_H + SEC_GAP) - SEC_GAP - VIEW.h;
  const scroll = Math.min(maxScroll, active * (SEC_H + SEC_GAP));
  const saved = ramp(frame, SAVE_AT + 2, 12, EASE_IN_OUT);

  return (
    <div style={{ position: "absolute", left: box.x, top: box.y, width: box.w, height: box.h, borderRadius: 24, background: C.paper, border: `1px solid ${C.line2}`, boxSizing: "border-box", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: EDITOR.w, height: EDITOR.h, opacity: content, transform: `translateY(${(1 - content) * 14}px)` }}>
        <div style={{ position: "absolute", left: 24, top: 24, right: 24, height: 46, display: "flex", alignItems: "center", gap: 14 }}>
          <RoundButton icon="chevronLeft" size={46} tone={C.beige} />
          <PageTitle size={42}>Executive Health</PageTitle>
          <div style={{ display: "flex", alignItems: "center", gap: 8, height: 32, padding: "0 12px 0 7px", borderRadius: 999, background: C.beige, fontFamily: F.ui, fontWeight: 500, fontSize: 14, color: C.walnut }}>
            <div style={{ width: 18, height: 18, borderRadius: 999, background: C.salmon }} />
            Executive program
          </div>
          <div style={{ flex: 1 }} />
          <Pill tone="soft" icon="eye" height={46} style={{ background: C.beige }}>
            Preview as agent
          </Pill>
          <SwapPill p={saved} press={pulse(frame, SAVE_AT - 2, 3, 8)} height={46} from={{ label: "Save", tone: "ink" }} to={{ label: "Saved", icon: "check", tone: "sage" }} style={{ width: 120 }} />
        </div>

        <div style={{ position: "absolute", left: NAV.x, top: NAV.y, width: NAV.w }}>
          <div style={{ position: "absolute", left: 0, top: active * NAV.rowH, width: NAV.w, height: NAV.rowH, borderRadius: 14, background: C.beige }} />
          {SECTIONS.map((s, i) => {
            const on = clamp01(1 - Math.abs(active - i));
            return (
              <div key={s.label} style={{ position: "relative", height: NAV.rowH, display: "flex", alignItems: "center", gap: 12, padding: "0 14px", fontFamily: F.ui, fontWeight: 500, fontSize: 17, color: interpolateColors(on, [0, 1], [SUB, C.walnut]) }}>
                <Glyph name={s.icon} size={17} color={on > 0.5 ? C.walnut : SUB} />
                {s.label}
                <div style={{ flex: 1 }} />
                <div style={{ opacity: ramp(frame, SECTION_AT[i] + 20, 10) }}>
                  <Glyph name="check" size={14} color={C.liveText} stroke={2.6} />
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ position: "absolute", left: VIEW.x, top: VIEW.y, width: VIEW.w, height: VIEW.h, overflow: "hidden", borderRadius: 22 }}>
          <div style={{ transform: `translateY(${-scroll}px)`, display: "flex", flexDirection: "column", gap: SEC_GAP }}>
            <Section title={SECTIONS[0].label} frame={frame} i={0}>
              <IncludedSection frame={frame} />
            </Section>
            <Section title={SECTIONS[1].label} frame={frame} i={1} action={<Select label="Eligibility" value="Individuals & couples" height={40} />}>
              <AudienceSection frame={frame} />
            </Section>
            <Section title={SECTIONS[2].label} frame={frame} i={2} action={<Segmented options={["Annual", "Quarterly", "Monthly"]} active={0} height={40} />}>
              <PricingSection frame={frame} />
            </Section>
            <Section title={SECTIONS[3].label} frame={frame} i={3} action={<Select label="Responds" value="Within 1 hour" height={40} />}>
              <AccessSection frame={frame} />
            </Section>
            <Section title={SECTIONS[4].label} frame={frame} i={4} action={<Pill tone="soft" icon="plus" height={40} style={{ background: C.paper }}>Add test</Pill>}>
              <TestingSection frame={frame} />
            </Section>
            <Section title={SECTIONS[5].label} frame={frame} i={5}>
              <OngoingSection frame={frame} />
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, frame, i, action, children }: { title: string; frame: number; i: number; action?: ReactNode; children: ReactNode }) {
  const on = ramp(frame, SECTION_AT[i] - 8, 14, EASE_IN_OUT);
  return (
    <div style={{ height: SEC_H, flexShrink: 0, boxSizing: "border-box", padding: 24, borderRadius: 22, background: C.beige, display: "flex", flexDirection: "column", gap: 18, opacity: lerp(0.45, 1, on) }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 40 }}>
        <CardTitle style={{ fontSize: 28 }}>{title}</CardTitle>
        {action}
      </div>
      {children}
    </div>
  );
}

const sectionAt = (i: number, o: number) => SECTION_AT[i] - 6 + o;

function IncludedSection({ frame }: { frame: number }) {
  const items = ["Half-day executive physical", "Unlimited same-week visits", "Specialist coordination", "Travel medicine", "Home and office visits", "Annual family review"];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
      {items.map((label, k) => (
        <div key={label} style={{ height: 50, boxSizing: "border-box", padding: "0 16px 0 12px", display: "flex", alignItems: "center", gap: 12, borderRadius: 14, background: C.paper, ...rise(frame, sectionAt(0, k * 3), { y: 8, dur: 14 }) }}>
          <Tick p={ramp(frame, sectionAt(0, 6 + k * 3), 8, EASE_IN_OUT)} size={24} />
          <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 17, color: C.walnut, whiteSpace: "nowrap" }}>{label}</span>
        </div>
      ))}
    </div>
  );
}

function AudienceSection({ frame }: { frame: number }) {
  const chips = ["Executives and founders", "Ages 35 and up", "Family history of heart disease", "Frequent travelers", "High-stress roles", "Couples"];
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
      {chips.map((label, k) => (
        <div key={label} style={{ height: 46, padding: "0 18px", display: "flex", alignItems: "center", gap: 8, borderRadius: 999, background: k < 4 ? C.ink : C.paper, color: k < 4 ? C.paper : C.walnut, fontFamily: F.ui, fontWeight: 500, fontSize: 17, whiteSpace: "nowrap", ...rise(frame, sectionAt(1, k * 3), { y: 8, scale: 0.9, dur: 14 }) }}>
          {k < 4 ? <Glyph name="check" size={14} color={C.paper} stroke={2.6} /> : <Glyph name="plus" size={14} color={C.walnut} stroke={2.2} />}
          {label}
        </div>
      ))}
    </div>
  );
}

function PricingSection({ frame }: { frame: number }) {
  const at = sectionAt(2, 2);
  const price = typed("$24,000", frame, at, 26);
  const typing = price.length < 7 && frame >= at;
  return (
    <div style={{ display: "flex", gap: 12, flex: 1 }}>
      <div style={{ flex: 1.3, boxSizing: "border-box", padding: "0 22px", borderRadius: 16, background: C.paper, display: "flex", alignItems: "center", gap: 10, border: `1.5px solid ${typing ? C.walnut : "transparent"}` }}>
        <span style={{ fontFamily: F.display, fontWeight: 500, fontSize: 64, lineHeight: "70px", letterSpacing: "-0.03em", color: C.walnut, fontVariantNumeric: "tabular-nums" }}>{price || "$"}</span>
        {typing ? <Caret height={54} width={3} /> : <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 20, color: SUB }}>/ year</span>}
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          { label: "Initiation fee", value: "$2,500" },
          { label: "HSA / FSA eligible", toggle: true },
        ].map((row, k) => (
          <div key={row.label} style={{ flex: 1, boxSizing: "border-box", padding: "0 18px", borderRadius: 16, background: C.paper, display: "flex", alignItems: "center", justifyContent: "space-between", ...rise(frame, sectionAt(2, 10 + k * 5), { x: 10, y: 0, dur: 14 }) }}>
            <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 17, color: C.walnut }}>{row.label}</span>
            {row.toggle ? <Toggle progress={ramp(frame, sectionAt(2, 22), 10, EASE_IN_OUT)} size={1.2} /> : <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 19, color: C.walnut }}>{row.value}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function AccessSection({ frame }: { frame: number }) {
  const ways: { label: string; icon: AnyIcon }[] = [
    { label: "Direct cell", icon: "phone" },
    { label: "24/7 text", icon: "message" },
    { label: "Video visits", icon: "eye" },
    { label: "House calls", icon: "home" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ height: 70, boxSizing: "border-box", padding: "0 16px 0 10px", borderRadius: 16, background: C.paper, display: "flex", alignItems: "center", gap: 14, ...rise(frame, sectionAt(3, 0), { y: 8, dur: 16 }) }}>
        <Mark letter="E" size={50} tone={C.salmon} radius={14} />
        <span style={{ flex: 1, fontFamily: F.ui, fontWeight: 600, fontSize: 19, color: C.walnut }}>Dr. Eleanor Shaw, MD</span>
        <Pill tone="soft" trailing="chevronDown" height={38} style={{ background: C.beige }}>
          Lead physician
        </Pill>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        {ways.map((w, k) => (
          <div key={w.label} style={{ flex: 1, height: 58, borderRadius: 16, background: C.paper, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: F.ui, fontWeight: 500, fontSize: 17, color: C.walnut, ...rise(frame, sectionAt(3, 6 + k * 3), { y: 8, scale: 0.94, dur: 14 }) }}>
            <Glyph name={w.icon} size={18} />
            {w.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function TestingSection({ frame }: { frame: number }) {
  const tests = [
    { name: "Advanced lipid panel", note: "Yearly" },
    { name: "Coronary calcium CT", note: "Yearly" },
    { name: "VO₂ max", note: "Yearly" },
    { name: "DEXA body composition", note: "Twice a year" },
    { name: "Genetic risk panel", note: "Once" },
    { name: "Full-body MRI", note: "+$2,800" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
      {tests.map((t, k) => (
        <div key={t.name} style={{ height: 66, boxSizing: "border-box", padding: "0 16px", borderRadius: 16, background: C.paper, display: "flex", alignItems: "center", gap: 10, ...rise(frame, sectionAt(4, k * 3), { y: 10, dur: 14 }) }}>
          <Glyph name="flask" size={17} />
          <span style={{ flex: 1, minWidth: 0, fontFamily: F.ui, fontWeight: 600, fontSize: 16, color: C.walnut, whiteSpace: "nowrap" }}>{t.name}</span>
          <span style={{ height: 26, padding: "0 9px", display: "inline-flex", alignItems: "center", borderRadius: 999, background: k === 5 ? C.salmon : SOFT, fontFamily: F.body, fontWeight: 500, fontSize: 12, color: C.walnut, whiteSpace: "nowrap" }}>{t.note}</span>
        </div>
      ))}
    </div>
  );
}

function OngoingSection({ frame }: { frame: number }) {
  const rows = [
    { label: "Physician check-ins", every: "Every 3 months" },
    { label: "Nutrition coaching", every: "Monthly" },
    { label: "Sleep and recovery review", every: "Every 6 months" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {rows.map((r, k) => (
        <div key={r.label} style={{ height: 52, boxSizing: "border-box", padding: "0 8px 0 18px", borderRadius: 14, background: C.paper, display: "flex", alignItems: "center", justifyContent: "space-between", ...rise(frame, sectionAt(5, k * 4), { x: 10, y: 0, dur: 14 }) }}>
          <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 17, color: C.walnut }}>{r.label}</span>
          <Select value={r.every} height={38} width={210} />
        </div>
      ))}
    </div>
  );
}

/* ─── Agent compares programs ──────────────────────────────────────────────── */

function CompareWorld({ frame }: { frame: number }) {
  const whip = ramp(frame, WHIP_AT, WHIP_DUR, EASE_IN_OUT);
  const smear = 9 * Math.sin(Math.PI * whip);
  const toRequest = ramp(frame, REQUEST_AT - 34, 30, EASE_IN_OUT);
  return (
    <AbsoluteFill style={{ transform: `translateX(${WHIP_DIST * (1 - whip)}px)`, filter: smear > 0.1 ? `blur(${smear.toFixed(2)}px)` : undefined }}>
      <div style={camera(frame, COMPARE_CAMS)}>
        <div style={{ position: "absolute", left: ASK_BOX.x, top: ASK_BOX.top, width: ASK_BOX.w }}>
          <AskCard frame={frame} />
        </div>
        <div style={{ position: "absolute", left: TABLE.x, top: TABLE.top, width: TABLE.w, ...rise(frame, TABLE_AT, { y: 80, scale: 0.97, dur: 28 }) }}>
          <CompareTable frame={frame} />
        </div>
        <ClickRing x={REQUEST.x} y={REQUEST.y} progress={ramp(frame, REQUEST_AT + 1, 16)} />
        <div style={{ opacity: ramp(frame, REQUEST_AT - 36, 8) }}>
          <Cursor x={lerp(1640, REQUEST.x + 20, toRequest)} y={lerp(1060, REQUEST.y + 6, toRequest)} pressed={pulse(frame, REQUEST_AT - 2, 3, 6)} />
        </div>
      </div>
    </AbsoluteFill>
  );
}

function AskCard({ frame }: { frame: number }) {
  const text = typed(ASK, frame, ASK_AT, 44);
  const typing = text.length > 0 && text.length < ASK.length;
  const sent = frame >= TABLE_AT - 10;
  return (
    <div style={{ height: ASK_BOX.h, boxSizing: "border-box", padding: "36px 44px", borderRadius: 40, background: C.paper, display: "flex", flexDirection: "column", gap: 22 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <AgentPill />
        <Pill tone="soft" icon="building" height={44} style={{ background: C.beige }}>
          Hudson Concierge Medicine
        </Pill>
      </div>
      <div style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 44, lineHeight: "58px", letterSpacing: "-0.015em", color: C.walnut }}>
        {text}
        {!sent ? <Caret height={46} width={3.5} visible={typing ? 1 : blink(frame)} /> : null}
      </div>
    </div>
  );
}

function CompareTable({ frame }: { frame: number }) {
  const hilite = ramp(frame, HILITE_AT, 16, EASE_IN_OUT);
  const requested = ramp(frame, REQUEST_AT + 2, 12, EASE_IN_OUT);
  const cellAt = (c: number, r: number) => TABLE_AT + 16 + c * 12 + r * 4;
  const bodyH = TABLE.headH + COMPARE_ROWS.length * TABLE.rowH + TABLE.footH;
  const cell: CSSProperties = { width: COL_W, flexShrink: 0, boxSizing: "border-box", padding: "0 18px", display: "flex", alignItems: "center" };
  return (
    <div style={{ position: "relative", boxSizing: "border-box", padding: TABLE.pad, borderRadius: 40, background: C.paper }}>
      <div style={{ position: "absolute", left: TABLE.pad + TABLE.labelW + COL_W * 2, top: TABLE.pad - 8, width: COL_W, height: bodyH + 16, borderRadius: 24, background: C.beige, opacity: hilite, transform: `scaleY(${lerp(0.96, 1, hilite)})` }} />
      <div style={{ position: "relative", height: TABLE.headH, display: "flex" }}>
        <div style={{ width: TABLE.labelW, flexShrink: 0, display: "flex", alignItems: "center", paddingLeft: 8 }}>
          <CardTitle style={{ fontSize: 30 }}>Compare</CardTitle>
        </div>
        {COMPARE_COLS.map((col, c) => (
          <div key={col.name} style={{ ...cell, gap: 12, ...rise(frame, TABLE_AT + 8 + c * 6, { y: 10, dur: 16 }) }}>
            <div style={{ width: 22, height: 22, borderRadius: 999, background: col.tone, flexShrink: 0 }} />
            <span style={{ fontFamily: F.display, fontWeight: 500, fontSize: 26, letterSpacing: "-0.02em", color: C.walnut, whiteSpace: "nowrap" }}>{col.name}</span>
          </div>
        ))}
      </div>
      {COMPARE_ROWS.map((row, r) => (
        <div key={row.label} style={{ position: "relative", height: TABLE.rowH, display: "flex", borderTop: `1px solid ${C.line}` }}>
          <div style={{ width: TABLE.labelW, flexShrink: 0, display: "flex", alignItems: "center", paddingLeft: 8, fontFamily: F.ui, fontWeight: 600, fontSize: 19, color: C.walnut, ...rise(frame, TABLE_AT + 12 + r * 3, { x: -8, y: 0, dur: 14 }) }}>{row.label}</div>
          {row.cells.map((v, c) => (
            <div key={c} style={{ ...cell, ...rise(frame, cellAt(c, r), { y: 8, dur: 14 }) }}>
              {v === "✓" ? (
                <Tick p={ramp(frame, cellAt(c, r) + 4, 8, EASE_IN_OUT)} size={30} />
              ) : (
                <span style={{ fontFamily: c === 2 && r === 0 ? F.display : F.ui, fontWeight: 500, fontSize: c === 2 && r === 0 ? 30 : 19, letterSpacing: c === 2 && r === 0 ? "-0.02em" : undefined, color: v === "—" ? C.faint : C.walnut, whiteSpace: "nowrap" }}>{v}</span>
              )}
            </div>
          ))}
        </div>
      ))}
      <div style={{ position: "relative", height: TABLE.footH, display: "flex", alignItems: "center", borderTop: `1px solid ${C.line}` }}>
        <div style={{ width: TABLE.labelW, flexShrink: 0 }} />
        {COMPARE_COLS.map((col, c) => (
          <div key={col.name} style={{ ...cell, ...rise(frame, TABLE_AT + 40 + c * 4, { y: 8, dur: 16 }) }}>
            {c === 2 ? (
              <SwapPill p={requested} press={pulse(frame, REQUEST_AT - 2, 3, 8)} height={54} from={{ label: "Request membership", icon: "arrowRight", tone: "ink" }} to={{ label: "Consult requested", icon: "check", tone: "sage" }} style={{ width: COL_W - 36, fontSize: 19 }} />
            ) : (
              <Pill tone="outline" height={54} style={{ width: COL_W - 36, fontSize: 19 }}>
                View details
              </Pill>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
