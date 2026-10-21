import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";

import { DotSphere, DotWave, Stage } from "../video1/backdrops";
import { EASE_IN, EASE_IN_OUT, EASE_OUT, blink, fly, lerp, pulse, ramp } from "../video1/motion";
import { C, F } from "../video1/theme";
import { AppShell, Caret, ClickRing, Cursor, Icon, ShadowsContext, Toggle } from "../video1/ui";
import {
  BedTrack,
  CLINIC,
  DrawCheck,
  Initials,
  KIM,
  Menu,
  OKAFOR,
  Pill,
  RoundButton,
  SAGE,
  SAGE_TEXT,
  SECTION_FRAMES,
  SKIN_TONES,
  SKIN_TYPES,
  SUB,
  mix,
  SkinScale,
  Swap,
  Tabs,
  body,
  camState,
  camStyle,
  clamp01,
  cursorAt,
  onScreen,
  title,
  ui,
  type CursorKey,
} from "./kit";

export const SECTION1_FRAMES = SECTION_FRAMES;

/** Absolute frames: request + matching, the practice's own screen, the new patient. */
const ASK_DUR = 380;
const PROFILE_FROM = 360;
const PROFILE_DUR = 360;
const PATIENT_FROM = 712;

export function Section1Reach() {
  return (
    <ShadowsContext.Provider value={false}>
      <BedTrack voice="video5/AES1.mp3" />
      <Stage backdrop={<Backdrop />}>
        <Sequence from={0} durationInFrames={ASK_DUR} name="Agent request → matching">
          <AskScene />
        </Sequence>
        <Sequence from={PROFILE_FROM} durationInFrames={PROFILE_DUR} name="Treatments → requests">
          <ProfileScene />
        </Sequence>
        <Sequence from={PATIENT_FROM} durationInFrames={SECTION_FRAMES - PATIENT_FROM} name="New patient">
          <PatientScene />
        </Sequence>
      </Stage>
    </ShadowsContext.Provider>
  );
}

/** The wave rolls under the request; the sphere of personal agents takes over while requests stream in. */
function Backdrop() {
  const frame = useCurrentFrame();
  const sphere = ramp(frame, PROFILE_FROM + 236, 34, EASE_IN_OUT) * (1 - ramp(frame, PROFILE_FROM + 340, 18, EASE_IN_OUT));
  return (
    <>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - sphere }}>
        <DotWave top={0.5} amp={64} />
      </div>
      {sphere > 0 ? (
        <div style={{ position: "absolute", inset: 0, opacity: sphere, transform: `scale(${lerp(0.82, 1, sphere)})`, transformOrigin: "960px 540px" }}>
          <DotSphere radius={470} speed={0.008} />
        </div>
      ) : null}
    </>
  );
}

/* ─── Personal agent request → Doe matching ────────────────────────────────── */

const ASK = { x: 280, y: 240, w: 1360, h: 470 };
const ASK_TEXT = "Find me somewhere in Toronto that treats acne scarring, has experience with darker skin, and has appointments this month.";
/** The three things the practice has to match; the table's columns reuse these hues. */
const CRITERIA = [
  { phrase: "acne scarring", label: "Acne scarring", tone: C.salmon },
  { phrase: "darker skin", label: "Darker skin", tone: SAGE },
  { phrase: "this month", label: "This month", tone: C.sand2 },
];
const TYPE_AT = 30;
const TYPE_CPS = 40;
const charAt = (i: number) => TYPE_AT + (i * 30) / TYPE_CPS;
const SEND_AT = 166;
const SEND = { x: ASK.x + ASK.w - 60 - 38, y: ASK.y + ASK.h - 46 - 38 };

type Seg = { text: string; start: number; tone?: string; end: number };
const SEGS: Seg[] = (() => {
  const marks = CRITERIA.map((c) => ({ start: ASK_TEXT.indexOf(c.phrase), end: ASK_TEXT.indexOf(c.phrase) + c.phrase.length, tone: c.tone })).sort((a, b) => a.start - b.start);
  const out: Seg[] = [];
  let i = 0;
  for (const m of marks) {
    if (m.start > i) out.push({ text: ASK_TEXT.slice(i, m.start), start: i, end: m.start });
    out.push({ text: ASK_TEXT.slice(m.start, m.end), start: m.start, end: m.end, tone: m.tone });
    i = m.end;
  }
  if (i < ASK_TEXT.length) out.push({ text: ASK_TEXT.slice(i), start: i, end: ASK_TEXT.length });
  return out;
})();

type Cell = { text: string; ok: boolean };
const PRACTICES: { name: string; area: string; cells: Cell[] }[] = [
  { name: "Queen West Laser", area: "Queen West", cells: [{ text: "Laser resurfacing", ok: true }, { text: "Types I–III", ok: false }, { text: "Oct 27", ok: true }] },
  { name: "Annex Dermatology", area: "The Annex", cells: [{ text: "Subcision, peels", ok: true }, { text: "Types I–VI", ok: true }, { text: "Jan 12", ok: false }] },
  { name: CLINIC.name, area: CLINIC.area, cells: [{ text: "RF, subcision, TCA", ok: true }, { text: "Types I–VI", ok: true }, { text: "Oct 29", ok: true }] },
  { name: "Bloor Aesthetics", area: "Bloor West", cells: [{ text: "Not offered", ok: false }, { text: "Types I–VI", ok: true }, { text: "Oct 22", ok: true }] },
  { name: "Leslieville Skin Co.", area: "Leslieville", cells: [{ text: "Chemical peels", ok: true }, { text: "Types I–IV", ok: false }, { text: "Dec 3", ok: false }] },
  { name: "King West Medspa", area: "King West", cells: [{ text: "Not offered", ok: false }, { text: "Not listed", ok: false }, { text: "Oct 24", ok: true }] },
];
const MAREN = 2;

const TABLE = { x: 330, y: 840, w: 1260, pad: 16, titleH: 60, headH: 52, rowH: 86, gap: 8, nameW: 440 };
const ROWS_TOP = TABLE.pad + TABLE.titleH + 8 + TABLE.headH;
const TABLE_H = ROWS_TOP + PRACTICES.length * (TABLE.rowH + TABLE.gap) - TABLE.gap + TABLE.pad;
const TABLE_CY = TABLE.y + TABLE_H / 2;
const CRIT_W = (TABLE.w - TABLE.pad * 2 - 48 - TABLE.nameW) / 3;
const MAREN_NAME = { x: TABLE.x + TABLE.pad + 24 + 120, y: TABLE.y + ROWS_TOP + MAREN * (TABLE.rowH + TABLE.gap) + TABLE.rowH / 2 };

const SCAN_AT = 232;
const ROW_STEP = 13;
const resolveAt = (row: number, col: number) => SCAN_AT + row * ROW_STEP + 4 + col * 3;
const PICK_AT = SCAN_AT + PRACTICES.length * ROW_STEP + 6;
const ASK_OUT = 356;

const ASK_CAM = [
  { f: 0, x: 960, y: 475, s: 1.18 },
  { f: 26, x: 960, y: 475, s: 1.18 },
  { f: 150, x: 960, y: 475, s: 1 },
  { f: SEND_AT + 6, x: 960, y: 475, s: 1 },
  { f: SCAN_AT + 4, x: 960, y: TABLE_CY, s: 1.02 },
  { f: PICK_AT, x: 960, y: TABLE_CY + 4, s: 1.07 },
  { f: PICK_AT + 12, x: 940, y: TABLE_CY + 10, s: 1.1 },
  { f: ASK_DUR, x: MAREN_NAME.x, y: MAREN_NAME.y, s: 3.4 },
];

const ASK_CURSOR: CursorKey[] = [
  { f: 118, x: 1720, y: 940 },
  { f: SEND_AT - 6, x: SEND.x + 8, y: SEND.y + 10 },
  { f: SEND_AT + 30, x: SEND.x + 40, y: SEND.y + 90 },
];

function AskScene() {
  const frame = useCurrentFrame();
  const cam = camState(frame, ASK_CAM);
  const leave = ramp(frame, ASK_OUT, 18, EASE_IN);
  const cursor = onScreen(cam, cursorAt(frame, ASK_CURSOR));
  const send = onScreen(cam, SEND);

  return (
    <AbsoluteFill style={{ opacity: 1 - leave, filter: leave > 0 ? `blur(${(leave * 14).toFixed(2)}px)` : undefined }}>
      <div style={camStyle(cam)}>
        <div style={{ position: "absolute", left: ASK.x, top: ASK.y, width: ASK.w, ...fly(frame, { at: 0, y: 70, scale: 0.95, dur: 28 }) }}>
          <Composer frame={frame} />
        </div>
        <div style={{ position: "absolute", left: TABLE.x, top: TABLE.y, width: TABLE.w, ...fly(frame, { at: SEND_AT + 14, y: 120, scale: 0.97, dur: 40, blur: 6 }) }}>
          <MatchTable frame={frame} />
        </div>
      </div>
      <ClickRing x={send.x} y={send.y} progress={ramp(frame, SEND_AT + 1, 16)} />
      <div style={{ opacity: ramp(frame, 118, 8) * (1 - ramp(frame, SEND_AT + 12, 10)) }}>
        <Cursor x={cursor.x} y={cursor.y} size={34} pressed={pulse(frame, SEND_AT - 2, 3, 6)} />
      </div>
    </AbsoluteFill>
  );
}

function Composer({ frame }: { frame: number }) {
  const count = Math.floor(Math.max(0, frame - TYPE_AT) * (TYPE_CPS / 30));
  const done = count >= ASK_TEXT.length;
  const sent = ramp(frame, SEND_AT + 2, 12, EASE_IN_OUT);
  return (
    <div style={{ height: ASK.h, boxSizing: "border-box", padding: "40px 60px 46px", borderRadius: 44, background: C.paper, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Pill tone="ink" height={48} lead={<Initials person={{ initials: "S", tone: C.salmon }} size={30} />} style={{ fontFamily: F.ui, fontSize: 21, padding: "0 22px 0 9px", gap: 12 }}>
          Simone&rsquo;s Agent
        </Pill>
        <div style={{ display: "flex", gap: 10 }}>
          <RoundButton icon="clock" size={48} />
          <RoundButton icon="plus" size={48} />
        </div>
      </div>
      <div style={{ minHeight: 210, marginTop: 30, fontFamily: F.ui, fontWeight: 500, fontSize: 54, lineHeight: "70px", letterSpacing: "-0.015em", color: C.walnut }}>
        {count === 0 ? <span style={{ color: "rgba(40, 25, 16, 0.3)" }}>Ask anything</span> : null}
        {SEGS.map((seg) => {
          const shown = Math.min(seg.text.length, Math.max(0, count - seg.start));
          if (shown <= 0) return null;
          const mark = seg.tone ? ramp(frame, charAt(seg.end) + 2, 12, EASE_OUT) : 0;
          return (
            <span
              key={seg.start}
              style={
                seg.tone
                  ? {
                      padding: "0 6px",
                      margin: "0 -6px",
                      borderRadius: 10,
                      backgroundImage: `linear-gradient(${seg.tone}, ${seg.tone})`,
                      backgroundRepeat: "no-repeat",
                      backgroundSize: `${(mark * 100).toFixed(1)}% 100%`,
                      WebkitBoxDecorationBreak: "clone",
                      boxDecorationBreak: "clone",
                    }
                  : undefined
              }
            >
              {seg.text.slice(0, shown)}
            </span>
          );
        })}
        {sent < 1 ? <Caret height={54} width={4} visible={!done ? 1 : blink(frame)} /> : null}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
        <div style={{ display: "flex", gap: 10 }}>
          <Pill tone="beige" height={50} lead={<Icon name="paperclip" size={20} />} style={{ fontFamily: F.ui, fontSize: 19 }}>
            3 photos
          </Pill>
          <Pill tone="beige" height={50} lead={<div style={{ width: 20, height: 20, borderRadius: 999, background: SKIN_TONES[4] }} />} style={{ fontFamily: F.ui, fontSize: 19 }}>
            Skin type V
          </Pill>
          <Pill tone="beige" height={50} lead={<Icon name="mapPin" size={20} />} style={{ fontFamily: F.ui, fontSize: 19 }}>
            Midtown, Toronto
          </Pill>
        </div>
        <div style={{ width: 76, height: 76, borderRadius: 999, background: done ? C.ink : "rgba(40, 25, 16, 0.18)", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 - 0.1 * pulse(frame, SEND_AT, 3, 8)})` }}>
          <Swap t={sent} from={<Icon name="arrowUp" size={32} color={C.paper} stroke={2.4} />} to={<Icon name="check" size={32} color={C.paper} stroke={2.6} />} />
        </div>
      </div>
    </div>
  );
}

function MatchTable({ frame }: { frame: number }) {
  const picked = ramp(frame, PICK_AT, 14, EASE_IN_OUT);
  return (
    <div style={{ height: TABLE_H, boxSizing: "border-box", padding: TABLE.pad, borderRadius: 32, background: C.paper }}>
      <div style={{ height: TABLE.titleH, padding: "0 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Icon name="mapPin" size={30} stroke={2} />
          <span style={title(44)}>Toronto</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Pill tone="soft" height={40} trail={<Icon name="chevronDown" size={13} />}>
            Within 10 km
          </Pill>
          <Pill tone="soft" height={40} trail={<Icon name="chevronDown" size={13} />}>
            Best match
          </Pill>
        </div>
      </div>
      <div style={{ height: TABLE.headH, marginTop: 8, padding: "0 24px", display: "flex", alignItems: "center" }}>
        <div style={{ width: TABLE.nameW, ...body(15) }}>Practice</div>
        {CRITERIA.map((c, i) => (
          <div key={c.label} style={{ width: CRIT_W, ...fly(frame, { at: SEND_AT + 16 + i * 5, y: 10, scale: 0.9, dur: 16, blur: 0 }) }}>
            <Pill tone="paper" height={34} style={{ background: c.tone, display: "inline-flex", fontFamily: F.ui, fontSize: 15 }}>
              {c.label}
            </Pill>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: TABLE.gap }}>
        {PRACTICES.map((p, row) => {
          const isMaren = row === MAREN;
          const scan = pulse(frame, SCAN_AT + row * ROW_STEP, 4, 16);
          const dim = isMaren ? 0 : picked;
          return (
            <div
              key={p.name}
              style={{
                position: "relative",
                height: TABLE.rowH,
                boxSizing: "border-box",
                padding: "0 24px",
                borderRadius: 20,
                background: isMaren ? mix(C.beige, C.paper, picked) : C.beige,
                outline: isMaren ? `2px solid rgba(20, 12, 4, ${picked})` : undefined,
                outlineOffset: -2,
                display: "flex",
                alignItems: "center",
                opacity: lerp(1, 0.4, dim),
                ...fly(frame, { at: SEND_AT + 22 + row * 4, y: 24, dur: 20, blur: 0 }),
              }}
            >
              <div style={{ position: "absolute", inset: 0, borderRadius: 20, background: C.sand2, opacity: scan * 0.9 }} />
              <div style={{ position: "relative", width: TABLE.nameW, display: "flex", alignItems: "center", gap: 12 }}>
                <span style={ui(23, 600)}>{p.name}</span>
                <Pill tone="outline" height={30} style={{ fontSize: 13 }}>
                  {p.area}
                </Pill>
              </div>
              {p.cells.map((cell, col) => (
                <MatchCell key={col} frame={frame} cell={cell} at={resolveAt(row, col)} tone={CRITERIA[col].tone} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MatchCell({ frame, cell, at, tone }: { frame: number; cell: Cell; at: number; tone: string }) {
  const p = ramp(frame, at, 10, EASE_OUT);
  return (
    <div style={{ position: "relative", width: CRIT_W, height: 40, display: "flex", alignItems: "center" }}>
      <div style={{ position: "absolute", left: 0, top: 15, width: CRIT_W * 0.62, height: 10, borderRadius: 99, background: "rgba(40, 25, 16, 0.08)", opacity: 1 - p }} />
      <div style={{ display: "flex", alignItems: "center", gap: 10, opacity: p, transform: `translateX(${(1 - p) * 10}px)` }}>
        {cell.ok ? (
          <div style={{ width: 26, height: 26, borderRadius: 999, background: tone, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <DrawCheck p={ramp(frame, at + 3, 10)} size={16} color={C.walnut} />
          </div>
        ) : (
          <div style={{ width: 26, height: 26, borderRadius: 999, boxSizing: "border-box", border: `1.5px dashed ${C.line2}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 9, height: 2, borderRadius: 2, background: C.faint }} />
          </div>
        )}
        <span style={ui(17, 500, { color: cell.ok ? C.walnut : C.faint })}>{cell.text}</span>
      </div>
    </div>
  );
}

/* ─── The practice's treatments: services, providers, expertise, availability ── */

const SHELL = { x: 240, y: 90 };
const PAGE = { x: SHELL.x + 64, y: SHELL.y + 12 };

type TreatmentRow = { group: string } | { name: string; length: string; price: string; hue: string };
const LIST_ITEMS: TreatmentRow[] = [
  { group: "Acne & scarring" },
  { name: "RF Microneedling", length: "60 min", price: "$450", hue: C.salmon },
  { name: "Subcision", length: "45 min", price: "$380", hue: SAGE },
  { name: "TCA CROSS", length: "30 min", price: "$300", hue: C.sand2 },
  { name: "Fractional Laser", length: "60 min", price: "$650", hue: C.salmon },
  { group: "Injectables" },
  { name: "Botox", length: "30 min", price: "$14 / unit", hue: SAGE },
  { name: "Dermal Filler", length: "45 min", price: "$750", hue: C.sand2 },
  { name: "Sculptra", length: "45 min", price: "$900", hue: C.salmon },
  { name: "Lip Filler", length: "30 min", price: "$650", hue: SAGE },
];
const LIST = { x: 28, y: 164, w: 560, rowH: 70, gap: 8, groupH: 36 };
const LIST_Y = (() => {
  const ys: number[] = [];
  let y = LIST.y;
  for (const item of LIST_ITEMS) {
    ys.push(y);
    y += "group" in item ? LIST.groupH : LIST.rowH + LIST.gap;
  }
  return ys;
})();
const RF_ROW = 1;
const SUBCISION_ROW = 2;

const DETAIL = { x: 616, y: 28, w: 720, h: 704, pad: 26 };
const D = { header: 26, fields: 98, provLabel: 206, prov: 236, expLabel: 314, skin: 344, skinH: 64, concerns: 424, availLabel: 488, avail: 520 };
const MENU = { x: DETAIL.x + DETAIL.pad + 668 - 340, y: DETAIL.y + D.skin + D.skinH + 8, w: 340, rowH: 46 };

/** Paper-panel point → world. */
const P = (x: number, y: number) => ({ x: PAGE.x + x, y: PAGE.y + y });

const RF_CLICK = 48;
const MENU_CLICK = 118;
const TYPE_CLICKS = [140, 153, 166];
const MENU_CLOSE = 184;
const AVAIL_AT = 202;
const PULL_OUT = 246;
const REQUESTS_AT = 246;
const PROFILE_EXIT = 344;

const SKIN_FIELD = P(DETAIL.x + DETAIL.pad + 560, DETAIL.y + D.skin + D.skinH / 2);
const typeRow = (i: number) => P(MENU.x + 150, MENU.y + 6 + i * MENU.rowH + MENU.rowH / 2);
const RF_POINT = P(LIST.x + 330, LIST_Y[RF_ROW] + LIST.rowH / 2);

const PROFILE_CAM = [
  { f: 0, x: 960, y: 540, s: 1 },
  { f: RF_CLICK + 12, x: 960, y: 540, s: 1 },
  { f: MENU_CLICK - 14, ...P(DETAIL.x + 360, 420), s: 1.58 },
  { f: MENU_CLOSE + 8, ...P(DETAIL.x + 362, 424), s: 1.6 },
  { f: AVAIL_AT + 20, ...P(DETAIL.x + 360, 560), s: 1.6 },
  { f: PULL_OUT - 4, ...P(DETAIL.x + 364, 566), s: 1.64 },
  { f: PULL_OUT + 40, x: 960, y: 540, s: 0.42 },
  { f: PROFILE_EXIT, x: 960, y: 540, s: 0.4 },
  { f: PROFILE_DUR, x: 960, y: 540, s: 1.6 },
];

const PROFILE_CURSOR: CursorKey[] = [
  { f: 18, x: 1560, y: 1000 },
  { f: RF_CLICK - 4, ...RF_POINT },
  { f: MENU_CLICK - 6, ...SKIN_FIELD },
  { f: TYPE_CLICKS[0] - 3, ...typeRow(3) },
  { f: TYPE_CLICKS[1] - 3, ...typeRow(4) },
  { f: TYPE_CLICKS[2] - 3, ...typeRow(5) },
  { f: MENU_CLOSE - 4, ...SKIN_FIELD },
  { f: MENU_CLOSE + 30, x: SKIN_FIELD.x + 60, y: SKIN_FIELD.y + 220 },
];
const PROFILE_CLICKS = [RF_CLICK, MENU_CLICK, ...TYPE_CLICKS, MENU_CLOSE];

function ProfileScene() {
  const frame = useCurrentFrame();
  const cam = camState(frame, PROFILE_CAM);
  const arrive = ramp(frame, 0, 22, EASE_OUT);
  const leave = ramp(frame, PROFILE_EXIT + 2, 14, EASE_IN);
  const cursor = onScreen(cam, cursorAt(frame, PROFILE_CURSOR));
  const press = Math.max(...PROFILE_CLICKS.map((f) => pulse(frame, f - 2, 3, 6)));
  const lastClick = [...PROFILE_CLICKS].reverse().find((f) => frame >= f);
  const ring = lastClick === undefined ? null : onScreen(cam, cursorAt(lastClick, PROFILE_CURSOR));

  return (
    <AbsoluteFill style={{ opacity: arrive * (1 - leave), filter: arrive < 1 || leave > 0 ? `blur(${(Math.max(1 - arrive, leave) * 12).toFixed(2)}px)` : undefined, transform: `scale(${lerp(1.08, 1, arrive)})` }}>
      <div style={camStyle(cam)}>
        <div style={{ position: "absolute", left: SHELL.x, top: SHELL.y }}>
          <AppShell active={2} railReveal={(i) => ramp(frame, 4 + i * 2, 12, EASE_OUT)}>
            <TreatmentsPage frame={frame} />
          </AppShell>
        </div>
      </div>
      <Requests frame={frame} cam={cam} />
      {ring && lastClick !== undefined ? <ClickRing x={ring.x} y={ring.y} progress={ramp(frame, lastClick + 1, 16)} /> : null}
      <div style={{ opacity: ramp(frame, 18, 8) * (1 - ramp(frame, MENU_CLOSE + 14, 10)) }}>
        <Cursor x={cursor.x} y={cursor.y} size={34} pressed={press} />
      </div>
    </AbsoluteFill>
  );
}

function TreatmentsPage({ frame }: { frame: number }) {
  const select = ramp(frame, RF_CLICK + 1, 14, EASE_IN_OUT);
  const selY = lerp(LIST_Y[SUBCISION_ROW], LIST_Y[RF_ROW], select);
  return (
    <>
      <div style={{ position: "absolute", left: 28, top: 30, ...title(52) }}>Treatments</div>
      <div style={{ position: "absolute", right: 28 + 720 + 28, top: 40, display: "flex", gap: 8 }}>
        <RoundButton icon="search" />
        <Pill tone="ink" lead={<Icon name="plus" size={14} color={C.paper} stroke={2.2} />}>
          Add
        </Pill>
      </div>
      <Tabs options={["All 24", "Scarring", "Injectables", "Laser"]} active={1} height={40} style={{ position: "absolute", left: 28, top: 104, width: LIST.w }} />
      {LIST_ITEMS.map((item, i) =>
        "group" in item ? (
          <div key={item.group} style={{ position: "absolute", left: LIST.x + 4, top: LIST_Y[i], height: LIST.groupH, display: "flex", alignItems: "center", ...ui(15, 600) }}>
            {item.group}
          </div>
        ) : (
          <div
            key={item.name}
            style={{
              position: "absolute",
              left: LIST.x,
              top: LIST_Y[i],
              width: LIST.w,
              height: LIST.rowH,
              boxSizing: "border-box",
              padding: "0 20px 0 16px",
              borderRadius: 18,
              background: C.beige,
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div style={{ width: 30, height: 30, borderRadius: 999, background: item.hue }} />
            <span style={{ flex: 1, ...ui(18, 600) }}>{item.name}</span>
            <Pill tone="paper" height={28} style={{ fontSize: 13 }}>
              {item.length}
            </Pill>
            <span style={{ width: 104, textAlign: "right", ...title(24, { lineHeight: "28px" }) }}>{item.price}</span>
          </div>
        ),
      )}
      <div style={{ position: "absolute", left: LIST.x, top: selY, width: LIST.w, height: LIST.rowH, boxSizing: "border-box", borderRadius: 18, border: `2px solid ${C.walnut}` }} />
      <div style={{ position: "absolute", left: DETAIL.x, top: DETAIL.y, width: DETAIL.w, height: DETAIL.h, boxSizing: "border-box", borderRadius: 26, background: C.paper, border: `1px solid ${C.line}` }}>
        <div style={{ position: "absolute", inset: 0, opacity: 1 - ramp(frame, RF_CLICK + 1, 6) }}>
          <DetailBody frame={frame} name="Subcision" price="$380" length="45 min" series="1 session" skin={() => 1} static />
        </div>
        {frame > RF_CLICK ? <DetailBody frame={frame} name="RF Microneedling" price="$450" length="60 min" series="3 sessions" skin={(i) => (i < 3 ? 1 : ramp(frame, TYPE_CLICKS[i - 3] + 1, 8, EASE_OUT))} /> : null}
      </div>
      {frame >= MENU_CLICK ? <SkinMenu frame={frame} /> : null}
    </>
  );
}

/** One treatment's detail, built in from the click; `static` renders it settled. */
function DetailBody({ frame, name, price, length, series, skin, static: settled }: { frame: number; name: string; price: string; length: string; series: string; skin: (i: number) => number; static?: boolean }) {
  const rise = (offset: number): CSSProperties => (settled ? {} : fly(frame, { at: RF_CLICK + 4 + offset, y: 14, dur: 16, blur: 3 }));
  const allTypes = !settled && skin(5) > 0.5;
  const colour = settled ? 0 : ramp(frame, TYPE_CLICKS[2] + 8, 12, EASE_OUT);
  const bars = [2, 3, 1, 0, 2, 3, 2, 1, 1, 2];
  const days = ["20", "21", "22", "23", "26", "27", "28", "29", "30", "31"];
  const pad = DETAIL.pad;
  const inner = DETAIL.w - pad * 2;
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", left: pad, top: D.header, width: inner, height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", ...rise(0) }}>
        <span style={title(40)}>{name}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 10, ...ui(15, 500) }}>
          Published
          <Toggle on />
        </div>
      </div>
      <div style={{ position: "absolute", left: pad, top: D.fields, width: inner, display: "flex", gap: 8, ...rise(2) }}>
        {[
          ["Price", price],
          ["Length", length],
          ["Series", series],
        ].map(([label, value]) => (
          <div key={label} style={{ flex: 1, height: 84, boxSizing: "border-box", padding: "14px 16px", borderRadius: 16, background: C.beige, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <span style={body(13)}>{label}</span>
            <span style={title(28, { lineHeight: "32px" })}>{value}</span>
          </div>
        ))}
      </div>
      <SectionLabel top={D.provLabel} style={rise(4)}>
        Providers
      </SectionLabel>
      <div style={{ position: "absolute", left: pad, top: D.prov, display: "flex", gap: 8, ...rise(5) }}>
        {[OKAFOR, KIM].map((person) => (
          <Pill key={person.name} tone="outline" height={48} lead={<Initials person={person} size={34} />} style={{ fontFamily: F.ui, fontSize: 16, padding: "0 18px 0 7px", gap: 10 }}>
            {person.name}
          </Pill>
        ))}
        <Pill tone="outline" height={48} lead={<Icon name="plus" size={15} />} style={{ border: "1px dashed rgba(40, 25, 16, 0.28)", color: SUB }}>
          Add
        </Pill>
      </div>
      <SectionLabel top={D.expLabel} style={rise(7)}>
        Expertise
      </SectionLabel>
      <div
        style={{
          position: "absolute",
          left: pad,
          top: D.skin,
          width: inner,
          height: D.skinH,
          boxSizing: "border-box",
          padding: "0 18px",
          borderRadius: 16,
          background: C.beige,
          outline: !settled && frame >= MENU_CLICK && frame < MENU_CLOSE + 4 ? `2px solid ${C.walnut}` : undefined,
          outlineOffset: -2,
          display: "flex",
          alignItems: "center",
          gap: 20,
          ...rise(8),
        }}
      >
        <span style={{ width: 120, ...ui(16, 600) }}>Skin types</span>
        <SkinScale on={skin} size={30} gap={8} />
        <span style={{ flex: 1 }} />
        <span style={ui(17, 600)}>{settled ? "I–VI" : allTypes ? "I–VI" : skin(3) > 0.5 ? (skin(4) > 0.5 ? "I–V" : "I–IV") : "I–III"}</span>
        <div style={{ transform: `rotate(${!settled && frame >= MENU_CLICK && frame < MENU_CLOSE ? 180 : 0}deg)` }}>
          <Icon name="chevronDown" size={15} color={SUB} stroke={2.2} />
        </div>
      </div>
      <div style={{ position: "absolute", left: pad, top: D.concerns, display: "flex", gap: 8, ...rise(10) }}>
        <Pill tone="salmon" height={36} style={{ fontFamily: F.ui, fontSize: 15 }}>
          Acne scarring
        </Pill>
        <Pill tone="beige" height={36} style={{ fontFamily: F.ui, fontSize: 15 }}>
          Texture
        </Pill>
        <Pill tone="beige" height={36} style={{ fontFamily: F.ui, fontSize: 15 }}>
          Large pores
        </Pill>
        {settled || colour > 0 ? (
          <div style={settled ? undefined : { opacity: colour, transform: `scale(${lerp(0.8, 1, colour)})`, transformOrigin: "0 50%" }}>
            <Pill tone="sage" height={36} style={{ fontFamily: F.ui, fontSize: 15 }}>
              Skin of colour
            </Pill>
          </div>
        ) : null}
      </div>
      <div style={{ position: "absolute", left: pad, top: D.availLabel, width: inner, height: 24, display: "flex", alignItems: "center", justifyContent: "space-between", ...rise(12) }}>
        <span style={ui(15, 600)}>Availability</span>
        <span style={{ ...ui(15, 600), opacity: settled ? 1 : ramp(frame, AVAIL_AT + 24, 10) }}>17 open in October</span>
      </div>
      <div style={{ position: "absolute", left: pad, top: D.avail, width: inner, height: 156, display: "flex", gap: 8, ...rise(13) }}>
        {bars.map((n, i) => {
          const grow = settled ? 1 : ramp(frame, AVAIL_AT + i * 2, 16, EASE_OUT);
          return (
            <div key={days[i]} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ flex: 1, boxSizing: "border-box", padding: 5, borderRadius: 12, background: C.beige, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 4 }}>
                {Array.from({ length: n }, (_, k) => (
                  <div key={k} style={{ height: 22, borderRadius: 7, background: i === 7 ? C.ink : C.salmon, opacity: clamp01(grow * 3 - k), transform: `scaleY(${clamp01(grow * 3 - k)})`, transformOrigin: "50% 100%" }} />
                ))}
              </div>
              <span style={{ textAlign: "center", ...body(13, { color: i === 7 ? C.walnut : SUB }) }}>{days[i]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SectionLabel({ top, style, children }: { top: number; style?: CSSProperties; children: ReactNode }) {
  return <div style={{ position: "absolute", left: DETAIL.pad, top, height: 24, display: "flex", alignItems: "center", ...ui(15, 600), ...style }}>{children}</div>;
}

function SkinMenu({ frame }: { frame: number }) {
  const open = ramp(frame, MENU_CLICK + 1, 10, EASE_OUT) * (1 - ramp(frame, MENU_CLOSE + 1, 8, EASE_IN_OUT));
  if (open <= 0) return null;
  const hover = frame < TYPE_CLICKS[0] - 10 ? 2 : frame < TYPE_CLICKS[0] - 3 ? lerp(2, 3, ramp(frame, TYPE_CLICKS[0] - 10, 7)) : frame < TYPE_CLICKS[1] - 3 ? lerp(3, 4, ramp(frame, TYPE_CLICKS[1] - 9, 6)) : lerp(4, 5, ramp(frame, TYPE_CLICKS[2] - 9, 6));
  return (
    <div style={{ position: "absolute", left: MENU.x, top: MENU.y, opacity: open, transform: `translateY(${(1 - open) * -8}px)`, transformOrigin: "100% 0" }}>
      <Menu
        width={MENU.w}
        rowH={MENU.rowH}
        hover={hover}
        items={SKIN_TYPES.map((t, i) => ({
          label: `Type ${t}`,
          lead: <div style={{ width: 22, height: 22, borderRadius: 999, background: SKIN_TONES[i] }} />,
          checked: i < 3 ? 1 : ramp(frame, TYPE_CLICKS[i - 3] + 1, 6),
        }))}
      />
    </div>
  );
}

/* ─── Requests from every direction land on the practice ───────────────────── */

const REQUESTS = [
  { who: "M", text: "Botox this Saturday near Yorkville" },
  { who: "T", text: "Melasma treatment for brown skin" },
  { who: "J", text: "Laser hair removal, Fitzpatrick V" },
  { who: "R", text: "Rhinoplasty consult in Toronto" },
  { who: "A", text: "Lip filler, natural look" },
  { who: "D", text: "Eczema flare, seen this week" },
  { who: "K", text: "Mole check before a trip" },
  { who: "L", text: "Under-eye hollows, no surgery" },
  { who: "E", text: "Rosacea, evening appointment" },
  { who: "N", text: "Tummy tuck consult" },
  { who: "S", text: "Acne scarring, darker skin, this month" },
];
const REQ_STEP = 7;
const REQ_TRAVEL = 30;
const reqStart = (i: number) => REQUESTS_AT + 6 + i * REQ_STEP;
const REQ_TONES = [C.salmon, SAGE, C.sand2];

function Requests({ frame, cam }: { frame: number; cam: { s: number; tx: number; ty: number } }) {
  if (frame < REQUESTS_AT) return null;
  const center = onScreen(cam, { x: 960, y: 540 });
  const half = { x: 720 * cam.s, y: 450 * cam.s };
  const landed = REQUESTS.filter((_, i) => frame >= reqStart(i) + REQ_TRAVEL).length;
  const counter = ramp(frame, REQUESTS_AT + 20, 12, EASE_OUT) * (1 - ramp(frame, PROFILE_EXIT, 8));
  return (
    <AbsoluteFill>
      {REQUESTS.map((r, i) => {
        const t = ramp(frame, reqStart(i), REQ_TRAVEL, EASE_IN_OUT);
        if (frame < reqStart(i) || t >= 1) return null;
        const angle = -Math.PI / 2 + (i / REQUESTS.length) * Math.PI * 2 + 0.35;
        const dir = { x: Math.cos(angle), y: Math.sin(angle) };
        const from = { x: 960 + dir.x * 1060, y: 540 + dir.y * 640 };
        const edge = Math.min(half.x / Math.max(1e-3, Math.abs(dir.x)), half.y / Math.max(1e-3, Math.abs(dir.y)));
        const to = { x: center.x + dir.x * edge * 0.9, y: center.y + dir.y * edge * 0.9 };
        const bend = i % 2 ? 140 : -140;
        const ctrl = { x: (from.x + to.x) / 2 - dir.y * bend, y: (from.y + to.y) / 2 + dir.x * bend };
        const u = 1 - t;
        const x = u * u * from.x + 2 * u * t * ctrl.x + t * t * to.x;
        const y = u * u * from.y + 2 * u * t * ctrl.y + t * t * to.y;
        const fade = ramp(frame, reqStart(i), 6) * (1 - ramp(frame, reqStart(i) + REQ_TRAVEL - 8, 8));
        const size = i === REQUESTS.length - 1 ? 1.45 : 1.1;
        return (
          <div key={r.text} style={{ position: "absolute", left: x, top: y, opacity: fade, transform: `translate(-50%, -50%) scale(${lerp(size, 0.55, t)})` }}>
            <RequestChip who={r.who} text={r.text} tone={REQ_TONES[i % 3]} />
          </div>
        );
      })}
      <div style={{ position: "absolute", left: center.x, top: center.y - half.y - 64, opacity: counter, transform: `translate(-50%, 0) translateY(${(1 - counter) * 10}px)` }}>
        <Pill tone="ink" height={52} lead={<Icon name="inbox" size={20} color={C.paper} />} style={{ fontFamily: F.ui, fontSize: 19, padding: "0 24px 0 18px" }}>
          <span style={{ fontVariantNumeric: "tabular-nums", transform: `scale(${1 + 0.12 * pulse(frame, reqStart(Math.max(0, landed - 1)) + REQ_TRAVEL, 3, 8)})` }}>{landed}</span>
          {landed === 1 ? "new request" : "new requests"}
        </Pill>
      </div>
    </AbsoluteFill>
  );
}

function RequestChip({ who, text, tone }: { who: string; text: string; tone: string }) {
  return (
    <div style={{ height: 56, boxSizing: "border-box", padding: "0 22px 0 9px", display: "flex", alignItems: "center", gap: 12, borderRadius: 999, background: C.paper, border: `1px solid ${C.line}` }}>
      <Initials person={{ initials: who, tone }} size={38} />
      <span style={ui(20, 500)}>{text}</span>
    </div>
  );
}

/* ─── New patient ──────────────────────────────────────────────────────────── */

const CARD = { w: 1080, x: 960 - 540, y: 230 };
const CONFIRM_AT = 98;
const CONFIRM = { x: CARD.x + 405, y: CARD.y + 464 };

function PatientScene() {
  const frame = useCurrentFrame();
  const cam = camState(frame, [
    { f: 0, x: 960, y: 520, s: 1.04 },
    { f: 60, x: 960, y: 530, s: 1 },
    { f: CONFIRM_AT, x: 900, y: 600, s: 1.08 },
    { f: 188, x: 960, y: 560, s: 1.02 },
  ]);
  const arrive = ramp(frame, 4, 22, EASE_OUT);
  const done = ramp(frame, CONFIRM_AT + 2, 12, EASE_IN_OUT);
  const path: CursorKey[] = [
    { f: 54, x: 1500, y: 1060 },
    { f: CONFIRM_AT - 4, x: CONFIRM.x, y: CONFIRM.y },
    { f: CONFIRM_AT + 40, x: CONFIRM.x + 70, y: CONFIRM.y + 110 },
  ];
  const cursor = onScreen(cam, cursorAt(frame, path));
  const ring = onScreen(cam, CONFIRM);

  return (
    <AbsoluteFill style={{ opacity: arrive, filter: arrive < 1 ? `blur(${((1 - arrive) * 12).toFixed(2)}px)` : undefined, transform: `scale(${lerp(0.94, 1, arrive)})` }}>
      <div style={camStyle(cam)}>
        <div style={{ position: "absolute", left: CARD.x, top: CARD.y, width: CARD.w }}>
          <PatientCard frame={frame} done={done} />
        </div>
        <div style={{ position: "absolute", left: 960, top: CARD.y + 554, ...fly(frame, { at: CONFIRM_AT + 16, y: 24, dur: 20, blur: 4 }) }}>
          <div style={{ transform: "translateX(-50%)" }}>
            <Pill tone="paper" height={56} lead={<Icon name="calendar" size={20} />} style={{ fontFamily: F.ui, fontSize: 19, padding: "0 24px 0 18px", border: `1px solid ${C.line}` }}>
              Added to Dr. Okafor&rsquo;s Thursday
            </Pill>
          </div>
        </div>
      </div>
      <ClickRing x={ring.x} y={ring.y} progress={ramp(frame, CONFIRM_AT + 1, 16)} />
      <div style={{ opacity: ramp(frame, 54, 8) * (1 - ramp(frame, CONFIRM_AT + 26, 10)) }}>
        <Cursor x={cursor.x} y={cursor.y} size={34} pressed={pulse(frame, CONFIRM_AT - 2, 3, 6)} />
      </div>
    </AbsoluteFill>
  );
}

function PatientCard({ frame, done }: { frame: number; done: number }) {
  const tiles: { label: string; value: ReactNode; at: number }[] = [
    { label: "Treatment", value: "Acne scar consult", at: 22 },
    {
      label: "Provider",
      value: (
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Initials person={OKAFOR} size={30} />
          {OKAFOR.name}
        </span>
      ),
      at: 26,
    },
    { label: "When", value: "Thu, Oct 29 · 10:30 AM", at: 30 },
    {
      label: "Booked by",
      value: (
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Initials person={{ initials: "S", tone: C.salmon }} size={30} />
          Simone&rsquo;s Agent
        </span>
      ),
      at: 34,
    },
  ];
  return (
    <div style={{ boxSizing: "border-box", padding: 32, borderRadius: 40, background: C.paper, display: "flex", flexDirection: "column", gap: 22 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20, ...fly(frame, { at: 10, y: 16, dur: 18, blur: 4 }) }}>
        <Initials person={{ initials: "SA", tone: C.salmon }} size={78} />
        <span style={{ flex: 1, ...title(62) }}>Simone Adeyemi</span>
        <Pill tone="salmon" height={44} style={{ fontFamily: F.ui, fontSize: 17 }}>
          New patient
        </Pill>
      </div>
      <div style={{ padding: 8, borderRadius: 26, background: C.beige, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {tiles.map((tile) => (
          <div key={tile.label} style={{ height: 96, boxSizing: "border-box", padding: "16px 20px", borderRadius: 18, background: C.paper, display: "flex", flexDirection: "column", justifyContent: "space-between", ...fly(frame, { at: tile.at, y: 12, dur: 16, blur: 2 }) }}>
            <span style={body(14)}>{tile.label}</span>
            <span style={ui(22, 600)}>{tile.value}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, ...fly(frame, { at: 40, y: 10, dur: 16, blur: 0 }) }}>
        <span style={{ marginRight: 6, ...ui(16, 600) }}>Matched on</span>
        {CRITERIA.map((c) => (
          <Pill key={c.label} tone="paper" height={38} lead={<DrawCheck p={ramp(frame, 46, 12)} size={15} color={C.walnut} />} style={{ background: c.tone, fontFamily: F.ui, fontSize: 16 }}>
            {c.label}
          </Pill>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, ...fly(frame, { at: 46, y: 14, dur: 18, blur: 0 }) }}>
        <div style={{ flex: 1, height: 68, borderRadius: 999, background: done > 0.5 ? SAGE : C.ink, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 - 0.04 * pulse(frame, CONFIRM_AT, 3, 8)})`, ...ui(22, 600, { color: done > 0.5 ? SAGE_TEXT : C.paper }) }}>
          <Swap
            t={done}
            from={
              <>
                Confirm visit
                <Icon name="arrowRight" size={22} color={C.paper} stroke={2.2} />
              </>
            }
            to={
              <>
                <Icon name="check" size={22} color={SAGE_TEXT} stroke={2.6} />
                Confirmed
              </>
            }
          />
        </div>
        <Pill tone="outline" height={68} lead={<Icon name="chat" size={20} />} style={{ fontFamily: F.ui, fontSize: 20, padding: "0 30px 0 24px" }}>
          Message agent
        </Pill>
      </div>
    </div>
  );
}

