import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

import { DotWave, Stage } from "../video1/backdrops";
import { EASE_IN_OUT, EASE_OUT, fly, lerp, pulse, ramp } from "../video1/motion";
import { C, F } from "../video1/theme";
import { AppShell, ClickRing, Cursor, Icon, ShadowsContext, Toggle } from "../video1/ui";
import {
  BedTrack,
  DrawCheck,
  Glyph,
  Initials,
  KIM,
  OKAFOR,
  PATEL,
  Pill,
  REYES,
  RoundButton,
  SAGE,
  SAGE_DEEP,
  SAGE_TEXT,
  SALMON_DEEP,
  SECTION_FRAMES,
  SUB,
  Swap,
  Tabs,
  body,
  camState,
  camStyle,
  cursorAt,
  mix,
  onScreen,
  title,
  ui,
  type CursorKey,
  type Person,
} from "./kit";

export const SECTION3_FRAMES = SECTION_FRAMES;

export function Section3Capacity() {
  return (
    <ShadowsContext.Provider value={false}>
      <BedTrack voice="video5/AES3.mp3" />
      <Stage backdrop={<DotWave vertical top={0.05} amp={56} fade={0.4} />}>
        <CapacityFilm />
      </Stage>
    </ShadowsContext.Provider>
  );
}

/* ─── Timeline ─────────────────────────────────────────────────────────────── */

const TOAST_AT = 54;
const STRIKE_AT = 66;
const OPEN_AT = 84;
const SLOT_CLICK = 156;
const FILL_TOGGLE = 188;
const CONSULT_CHIP = 206;
const OPEN_CLICK = 232;
const POP_CLOSE = 244;
const REQ_AT = [330, 382, 434];
const MATCH_AT = 572;
const LINE_AT = 590;
const LINE_DUR = 36;
const MATCHED_AT = LINE_AT + LINE_DUR;
const BOOKED_AT = 760;
const BOOKED_TOAST = 780;

/* ─── Schedule geometry (paper-panel coordinates) ──────────────────────────── */

const SHELL = { x: 240, y: 90 };
const PAGE = { x: SHELL.x + 64, y: SHELL.y + 12 };
const P = (x: number, y: number) => ({ x: PAGE.x + x, y: PAGE.y + y });

const PROVIDERS: Person[] = [OKAFOR, REYES, PATEL, KIM];
const HOURS = ["10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM"];
const CAL = { x: 28, y: 160, w: 1308, h: 688, pad: 8, head: 64, gutter: 70 };
const COL_GAP = 8;
const COL_W = (CAL.w - CAL.pad * 2 - CAL.gutter - COL_GAP * 3) / 4;
const GRID_TOP = CAL.pad + CAL.head + 6;
const HOUR_H = (CAL.h - GRID_TOP - CAL.pad) / HOURS.length;
const colX = (col: number) => CAL.pad + CAL.gutter + col * (COL_W + COL_GAP);
const visitRect = (col: number, start: number, dur: number) => ({ x: colX(col) + 6, y: GRID_TOP + (start / 60) * HOUR_H + 3, w: COL_W - 12, h: (dur / 60) * HOUR_H - 6 });

type Visit = { col: number; start: number; dur: number; name: string; kind: string };
const VISITS: Visit[] = [
  { col: 0, start: 0, dur: 60, name: "Grace Liu", kind: "Acne consult" },
  { col: 0, start: 75, dur: 60, name: "Priya Shah", kind: "RF Microneedling" },
  { col: 0, start: 150, dur: 45, name: "Hannah Cole", kind: "Follow-up" },
  { col: 0, start: 240, dur: 60, name: "Omar Haddad", kind: "Subcision" },
  { col: 0, start: 330, dur: 45, name: "Ava Brooks", kind: "Mole check" },
  { col: 1, start: 0, dur: 90, name: "Chloe Martin", kind: "Rhinoplasty consult" },
  { col: 1, start: 120, dur: 60, name: "Daniel Okoro", kind: "Post-op" },
  { col: 1, start: 225, dur: 90, name: "Sara Nunez", kind: "Breast consult" },
  { col: 1, start: 345, dur: 45, name: "Leo Rossi", kind: "Follow-up" },
  { col: 2, start: 0, dur: 30, name: "Mia Tran", kind: "Botox" },
  { col: 2, start: 45, dur: 45, name: "Zoe Adams", kind: "Lip filler" },
  { col: 2, start: 120, dur: 30, name: "Emma Wright", kind: "Botox" },
  { col: 2, start: 180, dur: 60, name: "Lily Chen", kind: "Sculptra" },
  { col: 2, start: 345, dur: 45, name: "Noor Ali", kind: "Filler" },
  { col: 3, start: 15, dur: 60, name: "Kate Moore", kind: "Laser hair" },
  { col: 3, start: 105, dur: 60, name: "Ines Garcia", kind: "Fractional laser" },
  { col: 3, start: 210, dur: 45, name: "Ruby Hall", kind: "IPL" },
  { col: 3, start: 300, dur: 60, name: "Ana Silva", kind: "RF Microneedling" },
];
const SLOT_VISIT = { col: 2, start: 270, dur: 45 };
const SLOT = visitRect(SLOT_VISIT.col, SLOT_VISIT.start, SLOT_VISIT.dur);
/** The slot in world space. */
const SLOT_W = { x: PAGE.x + CAL.x + SLOT.x, y: PAGE.y + CAL.y + SLOT.y, w: SLOT.w, h: SLOT.h };
const SLOT_C = { x: SLOT_W.x + SLOT_W.w / 2, y: SLOT_W.y + SLOT_W.h / 2 };

const toneFor = (kind: string) => (/consult/i.test(kind) ? C.salmon : /follow|post/i.test(kind) ? SAGE : C.sand2);
const pillFor = (kind: string) => (/consult/i.test(kind) ? SALMON_DEEP : /follow|post/i.test(kind) ? SAGE_DEEP : "#DCCDB0");

const clockTime = (minutes: number) => {
  const total = 10 * 60 + minutes;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
};

/* ─── Popover (world space, beside the slot) ───────────────────────────────── */

const POP = { x: SLOT_W.x + SLOT_W.w + 18, y: SLOT_W.y - 176, w: 430, pad: 20 };
const POP_Y = { header: 20, person: 74, toggle: 124, goodLabel: 198, chips: 226, reach: 282, button: 348 };
const POP_H = POP_Y.button + 54 + POP.pad;
const pp = (x: number, y: number) => ({ x: POP.x + x, y: POP.y + y });
const TOGGLE_PT = pp(POP.w - POP.pad - 34, POP_Y.toggle + 28);
const CONSULT_PT = pp(POP.pad + 260, POP_Y.chips + 19);
const OPEN_PT = pp(POP.w / 2, POP_Y.button + 27);

/* ─── Requests (world space, right of the shell) ───────────────────────────── */

const REQ = { x: 1790, w: 640, h: 230 };
type Request = { agent: string; initial: string; tone: string; text: string; chips: string[]; y: number; checks?: string[] };
const REQUESTS: Request[] = [
  { agent: "Jordan’s Agent", initial: "J", tone: C.salmon, text: "Botox this week", chips: ["1.2 km away", "Before Friday"], y: 600, checks: ["Botox", "This week", "1.2 km"] },
  { agent: "Aisha’s Agent", initial: "A", tone: SAGE, text: "Laser consultation tomorrow", chips: ["3.4 km away", "Any time"], y: 340 },
  { agent: "Daniel’s Agent", initial: "D", tone: C.sand2, text: "A dermatologist this afternoon", chips: ["0.8 km away", "After 3 PM"], y: 860 },
];
const JORDAN_EDGE = { x: REQ.x, y: REQUESTS[0].y + REQ.h / 2 };
const SLOT_EDGE = { x: SLOT_W.x + SLOT_W.w, y: SLOT_C.y };
const LINK_D = `M${JORDAN_EDGE.x} ${JORDAN_EDGE.y} C${JORDAN_EDGE.x - 240} ${JORDAN_EDGE.y} ${SLOT_EDGE.x + 240} ${SLOT_EDGE.y} ${SLOT_EDGE.x} ${SLOT_EDGE.y}`;

function bezier(t: number) {
  const a = JORDAN_EDGE;
  const b = { x: JORDAN_EDGE.x - 240, y: JORDAN_EDGE.y };
  const c = { x: SLOT_EDGE.x + 240, y: SLOT_EDGE.y };
  const d = SLOT_EDGE;
  const u = 1 - t;
  return { x: u * u * u * a.x + 3 * u * u * t * b.x + 3 * u * t * t * c.x + t * t * t * d.x, y: u * u * u * a.y + 3 * u * u * t * b.y + 3 * u * t * t * c.y + t * t * t * d.y };
}

/* ─── Camera + cursor ──────────────────────────────────────────────────────── */

const WIDE = { x: 1640, y: 640, s: 0.94 };

const CAM = [
  { f: 0, x: 960, y: 540, s: 1 },
  { f: 34, x: 960, y: 540, s: 1 },
  { f: 92, x: SLOT_C.x + 20, y: SLOT_C.y - 30, s: 1.85 },
  { f: SLOT_CLICK - 2, x: SLOT_C.x + 40, y: SLOT_C.y - 20, s: 1.9 },
  { f: SLOT_CLICK + 26, x: POP.x + 60, y: POP.y + POP_H / 2, s: 1.62 },
  { f: POP_CLOSE + 6, x: POP.x + 60, y: POP.y + POP_H / 2 + 4, s: 1.64 },
  { f: REQ_AT[0] - 14, ...WIDE },
  { f: MATCH_AT, ...WIDE, x: WIDE.x + 10, s: 0.96 },
  { f: MATCHED_AT + 14, x: (SLOT_C.x + REQ.x) / 2 + 60, y: (SLOT_C.y + JORDAN_EDGE.y) / 2 + 20, s: 1.12 },
  { f: BOOKED_AT - 2, x: SLOT_C.x + 30, y: SLOT_C.y, s: 2.1 },
  { f: SECTION_FRAMES, x: SLOT_C.x + 60, y: SLOT_C.y - 30, s: 1.7 },
];

const PATH: CursorKey[] = [
  { f: 116, x: SLOT_C.x + 300, y: SLOT_C.y + 260 },
  { f: SLOT_CLICK - 4, x: SLOT_C.x + 30, y: SLOT_C.y + 6 },
  { f: FILL_TOGGLE - 4, ...TOGGLE_PT },
  { f: CONSULT_CHIP - 4, ...CONSULT_PT },
  { f: OPEN_CLICK - 4, ...OPEN_PT },
  { f: OPEN_CLICK + 30, x: OPEN_PT.x + 80, y: OPEN_PT.y + 140 },
];
const CLICKS = [SLOT_CLICK, FILL_TOGGLE, CONSULT_CHIP, OPEN_CLICK];

function CapacityFilm() {
  const frame = useCurrentFrame();
  const cam = camState(frame, CAM);
  const cursor = onScreen(cam, cursorAt(frame, PATH));
  const press = Math.max(...CLICKS.map((f) => pulse(frame, f - 2, 3, 6)));
  const lastClick = [...CLICKS].reverse().find((f) => frame >= f);
  const ring = lastClick === undefined ? null : onScreen(cam, cursorAt(lastClick, PATH));
  const link = ramp(frame, LINE_AT, LINE_DUR, EASE_IN_OUT);
  const linkOut = ramp(frame, BOOKED_AT - 30, 20, EASE_IN_OUT);
  const traveller = ramp(frame, LINE_AT + 10, LINE_DUR - 4, EASE_IN_OUT);

  return (
    <AbsoluteFill>
      <div style={camStyle(cam)}>
        <div style={{ position: "absolute", left: SHELL.x, top: SHELL.y, ...fly(frame, { at: 0, y: 40, scale: 0.98, dur: 26, blur: 6 }) }}>
          <AppShell active={5} railReveal={(i) => ramp(frame, 8 + i * 2, 12, EASE_OUT)}>
            <SchedulePage frame={frame} />
          </AppShell>
        </div>
        {frame >= SLOT_CLICK ? <SlotPopover frame={frame} /> : null}
        {REQUESTS.map((r, i) => (
          <RequestCard key={r.agent} frame={frame} req={r} at={REQ_AT[i]} dim={i === 0 ? 0 : ramp(frame, MATCH_AT + 6, 14, EASE_IN_OUT) * (1 - ramp(frame, BOOKED_AT - 20, 20))} chosen={i === 0} />
        ))}
        {link > 0 && linkOut < 1 ? (
          <svg width={2600} height={1400} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: 1 - linkOut }}>
            <path d={LINK_D} fill="none" stroke={C.walnut} strokeOpacity={0.55} strokeWidth={3} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - link} />
            <circle cx={JORDAN_EDGE.x} cy={JORDAN_EDGE.y} r={7} fill={C.ink} />
            {link >= 1 ? <circle cx={SLOT_EDGE.x} cy={SLOT_EDGE.y} r={7} fill={C.ink} /> : null}
          </svg>
        ) : null}
        {traveller > 0 && traveller < 1 ? <MatchTag at={bezier(traveller)} t={traveller} /> : null}
      </div>
      <Toast frame={frame} at={TOAST_AT} until={SLOT_CLICK - 10} lead={<Glyph name="bell" size={20} />}>
        Maya Chen cancelled Botox at 2:30 PM
      </Toast>
      <Toast frame={frame} at={BOOKED_TOAST} until={SECTION_FRAMES + 20} lead={<Icon name="check" size={20} color={SAGE_TEXT} stroke={2.6} />} tone={SAGE}>
        2:30 PM filled · Jordan Lee booked through Doe
      </Toast>
      {ring && lastClick !== undefined ? <ClickRing x={ring.x} y={ring.y} progress={ramp(frame, lastClick + 1, 16)} /> : null}
      <div style={{ opacity: ramp(frame, 116, 8) * (1 - ramp(frame, OPEN_CLICK + 12, 10)) }}>
        <Cursor x={cursor.x} y={cursor.y} size={34} pressed={press} />
      </div>
    </AbsoluteFill>
  );
}

/** Notification pinned to the top of the screen, outside the camera. */
function Toast({ frame, at, until, lead, tone = C.paper, children }: { frame: number; at: number; until: number; lead: ReactNode; tone?: string; children: ReactNode }) {
  const show = ramp(frame, at, 16, EASE_OUT) * (1 - ramp(frame, until, 12, EASE_IN_OUT));
  if (show <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 960, top: 64, opacity: show, transform: `translate(-50%, ${(1 - show) * -24}px)` }}>
      <div style={{ height: 68, boxSizing: "border-box", padding: "0 12px 0 22px", display: "flex", alignItems: "center", gap: 14, borderRadius: 999, background: tone, border: `1px solid ${C.line2}`, ...ui(21, 600) }}>
        {lead}
        {children}
        <span style={{ marginLeft: 8 }}>
          <Pill tone={tone === C.paper ? "beige" : "paper"} height={44} style={{ fontFamily: F.ui, fontSize: 16 }}>
            View
          </Pill>
        </span>
      </div>
    </div>
  );
}

function SchedulePage({ frame }: { frame: number }) {
  const cancelled = frame >= OPEN_AT;
  const opened = ramp(frame, OPEN_CLICK + 4, 14, EASE_IN_OUT);
  const booked = frame >= BOOKED_AT;
  const bookedCount = booked ? 18 : frame >= OPEN_AT ? 17 : 18;
  const openCount = booked ? 0 : frame >= OPEN_AT ? 1 : 0;
  return (
    <>
      <div style={{ position: "absolute", left: 28, top: 30, ...title(52) }}>Schedule</div>
      <div style={{ position: "absolute", left: 286, top: 40, display: "flex", gap: 8 }}>
        <Pill tone="soft" trail={<Icon name="chevronDown" size={13} />}>
          Tue, Oct 20
        </Pill>
      </div>
      <div style={{ position: "absolute", right: 28, top: 40, display: "flex", gap: 8 }}>
        <Tabs options={["Day", "Week"]} active={0} style={{ width: 170 }} />
        <RoundButton icon="chevronLeft" />
        <RoundButton icon="chevronRight" />
        <Pill tone="ink" lead={<Icon name="plus" size={14} color={C.paper} stroke={2.2} />}>
          Appointment
        </Pill>
      </div>
      <div style={{ position: "absolute", left: 28, top: 106, display: "flex", gap: 8 }}>
        <Stat label="Booked" value={bookedCount} />
        <Stat label="Open" value={openCount} highlight={openCount > 0 ? opened : 0} />
        <Stat label="Filled by Doe" value={booked ? 4 : 3} />
      </div>
      <div style={{ position: "absolute", left: CAL.x, top: CAL.y, width: CAL.w, height: CAL.h, borderRadius: 22, background: C.beige, overflow: "hidden" }}>
        {PROVIDERS.map((person, i) => (
          <div key={person.name} style={{ position: "absolute", left: colX(i), top: CAL.pad, width: COL_W, height: CAL.head, boxSizing: "border-box", padding: "0 10px", display: "flex", alignItems: "center", gap: 10 }}>
            <Initials person={person} size={36} />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={ui(15, 600)}>{person.name}</span>
              <span style={body(13)}>{person.role}</span>
            </div>
          </div>
        ))}
        {HOURS.map((hour, i) => (
          <div key={hour} style={{ position: "absolute", left: CAL.pad, top: GRID_TOP + i * HOUR_H - 2, width: CAL.gutter - 14, textAlign: "right", ...body(13) }}>
            {hour}
          </div>
        ))}
        {PROVIDERS.map((person, i) => (
          <div key={`col-${person.name}`} style={{ position: "absolute", left: colX(i), top: GRID_TOP, width: COL_W, height: HOUR_H * HOURS.length, borderRadius: 16, background: C.paper }}>
            {HOURS.slice(1).map((h, k) => (
              <div key={h} style={{ position: "absolute", left: 0, right: 0, top: (k + 1) * HOUR_H, height: 1, background: C.line }} />
            ))}
          </div>
        ))}
        {VISITS.map((v) => (
          <VisitBlock key={v.name} rect={visitRect(v.col, v.start, v.dur)} name={v.name} start={v.start} kind={v.kind} tone={toneFor(v.kind)} pill={pillFor(v.kind)} />
        ))}
        {!cancelled || frame < OPEN_AT + 16 ? <CancelledBlock frame={frame} /> : null}
        {cancelled && !booked ? <OpenSlot frame={frame} opened={opened} /> : null}
        {frame >= MATCHED_AT ? <BookedSlot frame={frame} /> : null}
      </div>
    </>
  );
}

function Stat({ label, value, highlight = 0 }: { label: string; value: number; highlight?: number }) {
  return (
    <div style={{ height: 36, boxSizing: "border-box", padding: "0 14px", display: "flex", alignItems: "center", gap: 8, borderRadius: 999, background: highlight > 0 ? mix(C.beige, SAGE, highlight) : C.beige, ...ui(14, 500, { color: SUB }) }}>
      {label}
      <span style={ui(15, 700, { fontVariantNumeric: "tabular-nums" })}>{value}</span>
    </div>
  );
}

function VisitBlock({ rect, name, start, kind, tone, pill, style }: { rect: { x: number; y: number; w: number; h: number }; name: string; start: number; kind: string; tone: string; pill: string; style?: CSSProperties }) {
  const tall = rect.h > 50;
  return (
    <div
      style={{
        position: "absolute",
        left: rect.x,
        top: rect.y,
        width: rect.w,
        height: rect.h,
        boxSizing: "border-box",
        padding: tall ? "9px 12px" : "0 12px",
        borderRadius: 11,
        background: tone,
        display: "flex",
        flexDirection: tall ? "column" : "row",
        alignItems: tall ? "flex-start" : "center",
        gap: tall ? 4 : 8,
        overflow: "hidden",
        ...style,
      }}
    >
      <span style={ui(15, 600, { letterSpacing: "-0.01em" })}>{name}</span>
      <div style={{ display: "flex", gap: 4 }}>
        <span style={{ height: 20, padding: "0 8px", borderRadius: 999, background: pill, display: "flex", alignItems: "center", ...body(12, { color: C.walnut, fontVariantNumeric: "tabular-nums" }) }}>{clockTime(start)}</span>
        {tall ? <span style={{ height: 20, padding: "0 8px", borderRadius: 999, background: "rgba(255, 252, 241, 0.6)", display: "flex", alignItems: "center", ...body(12, { color: C.walnut }) }}>{kind}</span> : null}
      </div>
    </div>
  );
}

function CancelledBlock({ frame }: { frame: number }) {
  const strike = ramp(frame, STRIKE_AT, 12, EASE_IN_OUT);
  const fade = ramp(frame, OPEN_AT, 16, EASE_IN_OUT);
  const shake = pulse(frame, TOAST_AT + 4, 4, 14);
  return (
    <div style={{ position: "absolute", left: SLOT.x, top: SLOT.y, width: SLOT.w, height: SLOT.h, opacity: 1 - fade, transform: `translateX(${Math.sin(frame * 1.6) * 3 * shake}px) scale(${lerp(1, 0.94, fade)})` }}>
      <VisitBlock rect={{ x: 0, y: 0, w: SLOT.w, h: SLOT.h }} name="Maya Chen" start={SLOT_VISIT.start} kind="Botox" tone={mix(C.sand2, C.beige, strike)} pill="#DCCDB0" />
      <div style={{ position: "absolute", left: 12, top: 19, width: 92 * strike, height: 2, borderRadius: 2, background: C.walnut }} />
    </div>
  );
}

function OpenSlot({ frame, opened }: { frame: number; opened: number }) {
  const enter = ramp(frame, OPEN_AT + 4, 14, EASE_OUT);
  const selected = frame >= SLOT_CLICK && frame < POP_CLOSE;
  const matched = ramp(frame, MATCHED_AT - 2, 12, EASE_IN_OUT);
  const live = 0.55 + 0.45 * Math.sin(frame * 0.18);
  return (
    <div
      style={{
        position: "absolute",
        left: SLOT.x,
        top: SLOT.y,
        width: SLOT.w,
        height: SLOT.h,
        boxSizing: "border-box",
        padding: "0 12px",
        borderRadius: 11,
        border: selected ? `2px solid ${C.walnut}` : `1.5px dashed rgba(40, 25, 16, ${lerp(0.3, 0.45, opened)})`,
        background: mix(C.paper, SAGE, opened * 0.85),
        display: "flex",
        alignItems: "center",
        gap: 10,
        opacity: enter * (1 - matched),
        transform: `scale(${lerp(0.94, 1, enter) * (1 + 0.04 * pulse(frame, SLOT_CLICK, 3, 8))})`,
      }}
    >
      {opened > 0.5 ? <div style={{ width: 9, height: 9, borderRadius: 99, background: SAGE_TEXT, opacity: live }} /> : <Icon name="plus" size={15} color={SUB} stroke={2} />}
      <Swap t={opened} from={<span style={ui(15, 600, { color: SUB })}>Open · 2:30 PM</span>} to={<span style={ui(15, 600, { color: SAGE_TEXT })}>Open through Doe</span>} />
    </div>
  );
}

function BookedSlot({ frame }: { frame: number }) {
  const matched = ramp(frame, MATCHED_AT, 14, EASE_OUT);
  const booked = ramp(frame, BOOKED_AT, 16, EASE_IN_OUT);
  const ink = booked > 0.5;
  return (
    <div
      style={{
        position: "absolute",
        left: SLOT.x,
        top: SLOT.y,
        width: SLOT.w,
        height: SLOT.h,
        boxSizing: "border-box",
        padding: "8px 12px",
        borderRadius: 11,
        background: booked > 0 ? mix(C.salmon, "#140C04", booked) : C.salmon,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 4,
        opacity: matched,
        transform: `scale(${lerp(0.9, 1, matched) + 0.05 * pulse(frame, BOOKED_AT + 4, 5, 14)})`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={ui(15, 600, { color: ink ? C.paper : C.walnut })}>Jordan Lee</span>
        <Swap
          t={booked}
          from={<span style={body(12, { color: C.walnut })}>Matched</span>}
          to={
            <span style={{ display: "flex", alignItems: "center", gap: 4, ...body(12, { color: C.paper }) }}>
              <Icon name="check" size={12} color={C.paper} stroke={2.6} />
              Booked
            </span>
          }
        />
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        <span style={{ height: 20, padding: "0 8px", borderRadius: 999, background: ink ? "rgba(255, 252, 241, 0.14)" : SALMON_DEEP, display: "flex", alignItems: "center", ...body(12, { color: ink ? C.paper : C.walnut }) }}>2:30 PM</span>
        <span style={{ height: 20, padding: "0 8px", borderRadius: 999, background: ink ? "rgba(255, 252, 241, 0.14)" : "rgba(255, 252, 241, 0.6)", display: "flex", alignItems: "center", ...body(12, { color: ink ? C.paper : C.walnut }) }}>Botox</span>
      </div>
    </div>
  );
}

function SlotPopover({ frame }: { frame: number }) {
  const open = ramp(frame, SLOT_CLICK + 2, 14, EASE_OUT) * (1 - ramp(frame, POP_CLOSE, 10, EASE_IN_OUT));
  if (open <= 0) return null;
  const fill = ramp(frame, FILL_TOGGLE + 1, 10, EASE_IN_OUT);
  const consult = ramp(frame, CONSULT_CHIP + 1, 8, EASE_IN_OUT);
  const done = ramp(frame, OPEN_CLICK + 1, 10, EASE_IN_OUT);
  const reach = 0.4 + 0.6 * fill;
  return (
    <div
      style={{
        position: "absolute",
        left: POP.x,
        top: POP.y,
        width: POP.w,
        height: POP_H,
        boxSizing: "border-box",
        borderRadius: 26,
        background: C.paper,
        border: `1px solid ${C.line2}`,
        opacity: open,
        transform: `translateX(${(1 - open) * -16}px) scale(${lerp(0.96, 1, open)})`,
        transformOrigin: "0 50%",
      }}
    >
      <div style={{ position: "absolute", left: POP.pad, top: POP_Y.header, right: POP.pad, height: 40, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={title(34)}>2:30 PM</span>
        <Pill tone="beige" height={30} style={{ fontSize: 13 }}>
          45 min
        </Pill>
        <span style={{ flex: 1 }} />
        <RoundButton icon="x" size={34} />
      </div>
      <div style={{ position: "absolute", left: POP.pad, top: POP_Y.person, display: "flex", alignItems: "center", gap: 10, ...ui(16, 600) }}>
        <Initials person={PATEL} size={32} />
        {PATEL.name}
      </div>
      <div style={{ position: "absolute", left: POP.pad, top: POP_Y.toggle, width: POP.w - POP.pad * 2, height: 56, boxSizing: "border-box", padding: "0 16px", borderRadius: 16, background: C.beige, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={ui(17, 600)}>Fill through Doe</span>
        <Toggle progress={fill} size={1.15} />
      </div>
      <div style={{ position: "absolute", left: POP.pad, top: POP_Y.goodLabel, ...ui(15, 600, { opacity: reach }) }}>Good for</div>
      <div style={{ position: "absolute", left: POP.pad, top: POP_Y.chips, display: "flex", gap: 8, opacity: reach }}>
        <Pill tone="ink" height={38} lead={<Icon name="check" size={13} color={C.paper} stroke={2.6} />} style={{ fontFamily: F.ui, fontSize: 15 }}>
          Botox
        </Pill>
        <Pill tone="ink" height={38} lead={<Icon name="check" size={13} color={C.paper} stroke={2.6} />} style={{ fontFamily: F.ui, fontSize: 15 }}>
          Filler
        </Pill>
        <Pill
          tone="outline"
          height={38}
          press={pulse(frame, CONSULT_CHIP, 3, 8)}
          lead={consult > 0.5 ? <Icon name="check" size={13} color={C.paper} stroke={2.6} /> : <Icon name="plus" size={13} stroke={2.2} />}
          style={{ fontFamily: F.ui, fontSize: 15, background: consult > 0 ? `rgba(20, 12, 4, ${consult})` : "transparent", color: consult > 0.5 ? C.paper : C.walnut, border: `1px solid ${consult > 0.5 ? C.ink : C.line2}` }}
        >
          Skin consult
        </Pill>
      </div>
      <div style={{ position: "absolute", left: POP.pad, top: POP_Y.reach, width: POP.w - POP.pad * 2, height: 50, boxSizing: "border-box", padding: "0 16px", borderRadius: 14, background: C.beige, display: "flex", alignItems: "center", gap: 10, opacity: reach }}>
        <Icon name="mapPin" size={17} />
        <span style={{ flex: 1, ...ui(16, 500) }}>Within 5 km</span>
        <Icon name="chevronDown" size={14} color={SUB} stroke={2.2} />
      </div>
      <div
        style={{
          position: "absolute",
          left: POP.pad,
          top: POP_Y.button,
          width: POP.w - POP.pad * 2,
          height: 54,
          borderRadius: 999,
          background: done > 0.5 ? SAGE : fill > 0.5 ? C.ink : "rgba(40, 25, 16, 0.18)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${1 - 0.04 * pulse(frame, OPEN_CLICK, 3, 8)})`,
          ...ui(18, 600, { color: done > 0.5 ? SAGE_TEXT : C.paper }),
        }}
      >
        <Swap
          t={done}
          from={<>Open this slot</>}
          to={
            <>
              <Icon name="check" size={18} color={SAGE_TEXT} stroke={2.6} />
              Slot is open
            </>
          }
        />
      </div>
    </div>
  );
}

function RequestCard({ frame, req, at, dim, chosen }: { frame: number; req: Request; at: number; dim: number; chosen: boolean }) {
  const pick = chosen ? ramp(frame, MATCH_AT, 12, EASE_IN_OUT) : 0;
  const checks = chosen ? ramp(frame, MATCHED_AT - 16, 14, EASE_OUT) : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: REQ.x,
        top: req.y,
        width: REQ.w,
        height: REQ.h,
        boxSizing: "border-box",
        padding: 24,
        borderRadius: 30,
        background: C.paper,
        outline: pick > 0 ? `2.5px solid rgba(20, 12, 4, ${pick})` : undefined,
        outlineOffset: -2.5,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        ...fly(frame, { at, x: 60, y: 0, dur: 24, blur: 6 }),
        opacity: Number(fly(frame, { at, x: 60, y: 0, dur: 24 }).opacity ?? 1) * lerp(1, 0.38, dim),
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Initials person={{ initials: req.initial, tone: req.tone }} size={40} />
        <span style={{ flex: 1, ...ui(19, 600) }}>{req.agent}</span>
        <Pill tone="beige" height={32} lead={<Icon name="clock" size={14} />} style={{ fontSize: 13 }}>
          Asked earlier
        </Pill>
      </div>
      <span style={title(42, { letterSpacing: "-0.03em" })}>{req.text}</span>
      <div style={{ position: "relative", marginTop: "auto", height: 40 }}>
        <div style={{ position: "absolute", inset: 0, display: "flex", gap: 8, opacity: 1 - checks }}>
          {req.chips.map((chip, i) => (
            <Pill key={chip} tone="outline" height={40} lead={i === 0 ? <Icon name="mapPin" size={15} /> : <Icon name="calendar" size={15} />} style={{ fontFamily: F.ui, fontSize: 16 }}>
              {chip}
            </Pill>
          ))}
        </div>
        {req.checks ? (
          <div style={{ position: "absolute", inset: 0, display: "flex", gap: 8, opacity: checks, transform: `translateY(${(1 - checks) * 8}px)` }}>
            {req.checks.map((label, i) => (
              <Pill key={label} tone="sage" height={40} lead={<DrawCheck p={ramp(frame, MATCHED_AT - 12 + i * 4, 10)} size={16} />} style={{ fontFamily: F.ui, fontSize: 16 }}>
                {label}
              </Pill>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** The request label riding the connector into the slot. */
function MatchTag({ at, t }: { at: { x: number; y: number }; t: number }) {
  const show = Math.min(1, t * 6) * Math.min(1, (1 - t) * 6);
  return (
    <div style={{ position: "absolute", left: at.x, top: at.y, opacity: show, transform: `translate(-50%, -50%) scale(${lerp(1, 0.8, t)})` }}>
      <Pill tone="ink" height={48} lead={<Initials person={{ initials: "J", tone: C.salmon }} size={30} />} style={{ fontFamily: F.ui, fontSize: 18, padding: "0 20px 0 9px", gap: 10 }}>
        Botox this week
      </Pill>
    </div>
  );
}
