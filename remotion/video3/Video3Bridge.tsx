import type { CSSProperties } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

import { DotWave, Stage } from "../video1/backdrops";
import { CAMERA_EASE, EASE_IN, EASE_IN_OUT, EASE_OUT, camera, keys, lerp, pulse, ramp, typed } from "../video1/motion";
import { C, F } from "../video1/theme";
import { ClickRing, Cursor, ShadowsContext, StatusDot, Toggle } from "../video1/ui";
import { AgentPill, BedTrack, CardTitle, DotBridge, Glyph, Mark, Menu, PageTitle, Pill, RoundButton, SAGE_TEXT, SECTION_FRAMES, SOFT, SUB, Segmented, Select, SwapPill, rise, type AnyIcon } from "./kit";

export const V3_BRIDGE_FRAMES = SECTION_FRAMES;

/* ─── Timeline ─────────────────────────────────────────────────────────────── */

const CONNECT_AT = 132;
const SHEET_AT = 146;
const SELECT_AT = 208;
const OPTION_AT = 240;
const ALLOW_AT = 282;
/** The sheet folds away and the two sides of the connection take the stage. */
const HANDOFF_AT = 300;
const BRIDGE_AT = 312;
/** Each request leaves the agent, crosses the bridge, and lands as a row. */
const REQ_AT = [342, 386, 430, 474];
const CROSS = 18;
const OPEN_AT = 548;
const STEP_AT = [566, 584];
const ADD_AT = 604;
const ADD_PICK_AT = 626;
const SEND_AT = 692;
const RETURN_AT = SEND_AT + 6;
const TIMELINE_AT = 756;

/* ─── Beat A–B: member card → permission sheet ─────────────────────────────── */

const CARD = { x: 580, top: 296, w: 760, h: 488, pad: 36 };
const AGENT_ROW = { h: 92 };
const CONNECT = { x: CARD.x + CARD.w - CARD.pad - 14 - 62, y: CARD.top + CARD.h - CARD.pad - AGENT_ROW.h / 2 };

const SHEET = { x: 560, top: 166, w: 800, pad: 36 };
const PERM_TOP = 36 + 90 + 24 + 52 + 28;
const PERM_H = 76;
const PERM_GAP = 10;
const PERM_ROWS: { label: string; icon: AnyIcon }[] = [
  { label: "Scheduling", icon: "calendar" },
  { label: "Messages", icon: "message" },
  { label: "Referrals", icon: "users" },
  { label: "Health information", icon: "lock" },
];
const BUTTONS_TOP = PERM_TOP + PERM_ROWS.length * PERM_H + (PERM_ROWS.length - 1) * PERM_GAP + 28;
const SHEET_H = BUTTONS_TOP + 64 + 36;
const SELECT_W = 340;
const HEALTH_SELECT = { x: SHEET.x + SHEET.w - SHEET.pad - 16 - SELECT_W / 2, y: SHEET.top + PERM_TOP + 3 * (PERM_H + PERM_GAP) + PERM_H / 2 };
const SHARE_ITEMS = [{ label: "Everything in my record" }, { label: "Labs, imaging, and wearables" }, { label: "Nothing for now" }];
const SHARE_MENU = { x: HEALTH_SELECT.x - SELECT_W / 2, y: HEALTH_SELECT.y + 30, w: SELECT_W, rowH: 50 };
const ALLOW = { x: SHEET.x + SHEET.pad + 192 + (SHEET.w - SHEET.pad * 2 - 192) / 2, y: SHEET.top + BUTTONS_TOP + 32 };

const INTRO_CAMS = [
  { f: 0, x: 860, y: 500, s: 1.6 },
  { f: 70, x: 900, y: 520, s: 1.52 },
  { f: 112, x: 1060, y: 640, s: 1.55 },
  { f: CONNECT_AT + 6, x: 1080, y: 650, s: 1.6 },
  { f: SHEET_AT + 30, x: 980, y: 520, s: 1.12 },
  { f: SELECT_AT, x: 1060, y: 640, s: 1.38 },
  { f: OPTION_AT + 8, x: 1060, y: 660, s: 1.42 },
  { f: ALLOW_AT, x: 990, y: 690, s: 1.3 },
  { f: HANDOFF_AT + 20, x: 960, y: 560, s: 1.0 },
];

/* ─── Beat C–E: agent ↔ practice ───────────────────────────────────────────── */

const NODE = { x: 70, y: 440, w: 320, h: 200 };
const PANEL = { x: 700, y: 108, w: 1140, h: 864, pad: 28 };
const BRIDGE = { a: { x: NODE.x + NODE.w - 6, y: NODE.y + NODE.h / 2 }, b: { x: PANEL.x + 6, y: NODE.y + NODE.h / 2 } };
const LIST_TOP = PANEL.pad + 64 + 26;
const ROW_H = 104;
const ROW_GAP = 12;
const DRAWER = { x: PANEL.w - PANEL.pad - 560, y: LIST_TOP, w: 560, h: PANEL.h - LIST_TOP - PANEL.pad };
const ROW_NARROW = PANEL.w - PANEL.pad * 2 - DRAWER.w - 16;

type Request = { title: string; kind: string; icon: AnyIcon; time: string; extra?: { label: string; icon: AnyIcon } };
const REQUESTS: Request[] = [
  { title: "Move my quarterly check-in to the week of Nov 16", kind: "Appointment", icon: "calendar", time: "9:12 AM" },
  { title: "Back from Lisbon. Blood pressure readings attached.", kind: "Update", icon: "message", time: "9:40 AM", extra: { label: "BP log · 14 days", icon: "paperclip" } },
  { title: "Asking for a sports medicine referral for knee pain", kind: "Referral", icon: "users", time: "10:05 AM" },
  { title: "Shared 30 days of sleep and heart rate data", kind: "Health info", icon: "activity", time: "10:21 AM", extra: { label: "Shared with permission", icon: "lock" } },
];
const REFERRAL = 2;
const rowCenter = (i: number) => ({ x: PANEL.x + PANEL.pad + 300, y: PANEL.y + LIST_TOP + i * (ROW_H + ROW_GAP) + ROW_H / 2 });

const STEPS = [
  { kind: "Next step", text: "Referral sent to Dr. Kenji Mori, Sports Medicine", chip: "Tue 9:00 AM" },
  { kind: "Instruction", text: "Bring your knee MRI from 2024" },
  { kind: "Request", text: "Complete the knee function questionnaire", chip: "Form" },
];
const STEP_H = 84;
const STEPS_TOP = 24 + 40 + 24 + 40 + 16;
const ADD_BUTTON = { x: PANEL.x + DRAWER.x + DRAWER.w - 24 - 46, y: PANEL.y + DRAWER.y + 24 + 40 + 24 + 20 };
const ADD_MENU = { x: ADD_BUTTON.x - 240 + 46, y: ADD_BUTTON.y + 26, w: 240, rowH: 48 };
const ADD_ITEMS: { label: string; icon: AnyIcon }[] = [
  { label: "Instruction", icon: "doc" },
  { label: "Next step", icon: "arrowRight" },
  { label: "Request", icon: "inbox" },
];
const SEND = { x: PANEL.x + DRAWER.x + DRAWER.w / 2, y: PANEL.y + DRAWER.y + DRAWER.h - 24 - 30 };
const TABS_X = PANEL.x + PANEL.w - PANEL.pad - 150 + 75;

const STAGE_CAMS = [
  { f: HANDOFF_AT, x: 960, y: 560, s: 1.0 },
  { f: BRIDGE_AT + 20, x: 960, y: 540, s: 0.96 },
  { f: REQ_AT[1], x: 980, y: 520, s: 1.02 },
  { f: REQ_AT[3] + 20, x: 1040, y: 500, s: 1.1 },
  { f: OPEN_AT - 4, x: 1120, y: 500, s: 1.16 },
  { f: OPEN_AT + 26, x: PANEL.x + DRAWER.x + DRAWER.w / 2 - 60, y: 560, s: 1.4 },
  { f: ADD_PICK_AT + 10, x: PANEL.x + DRAWER.x + DRAWER.w / 2 - 40, y: 600, s: 1.44 },
  { f: SEND_AT, x: PANEL.x + DRAWER.x + DRAWER.w / 2 - 40, y: 680, s: 1.38 },
  { f: RETURN_AT + 30, x: 900, y: 560, s: 0.98 },
  { f: TIMELINE_AT + 6, x: 920, y: 548, s: 0.98 },
  { f: TIMELINE_AT + 50, x: 1200, y: 560, s: 1.1 },
  { f: SECTION_FRAMES, x: 1000, y: 540, s: 0.98 },
];

type Moment = { side: "agent" | "practice"; date: string; text: string; icon: AnyIcon; next?: boolean };
const TIMELINE: Moment[] = [
  { side: "practice", date: "Nov 2", text: "Joined Executive Health", icon: "heart" },
  { side: "agent", date: "Nov 3", text: "Agent connected", icon: "link" },
  { side: "agent", date: "Nov 4", text: "Check-in moved to Nov 17", icon: "calendar" },
  { side: "practice", date: "Nov 4", text: "BP log reviewed by Dr. Shaw", icon: "check" },
  { side: "practice", date: "Nov 5", text: "Referral to Dr. Mori sent", icon: "users" },
  { side: "agent", date: "Nov 5", text: "Knee questionnaire completed", icon: "doc" },
  { side: "practice", date: "Nov 10", text: "Sports medicine visit", icon: "clock", next: true },
];

/* ─── Film ─────────────────────────────────────────────────────────────────── */

export function Video3Bridge() {
  const frame = useCurrentFrame();
  const waveOut = ramp(frame, HANDOFF_AT, 30, EASE_IN_OUT);
  return (
    <ShadowsContext.Provider value={false}>
      <BedTrack voice="video3/CON3.mp3" />
      <Stage
        backdrop={
          waveOut < 1 ? (
            <div style={{ position: "absolute", inset: 0, opacity: 1 - waveOut }}>
              <DotWave top={0.54} amp={64} />
            </div>
          ) : null
        }
      >
        {frame < HANDOFF_AT + 22 ? <IntroWorld frame={frame} /> : null}
        {frame >= HANDOFF_AT ? <StageWorld frame={frame} /> : null}
      </Stage>
    </ShadowsContext.Provider>
  );
}

/* ─── Intro: member card, then permissions ─────────────────────────────────── */

function IntroWorld({ frame }: { frame: number }) {
  const sheet = ramp(frame, SHEET_AT, 26, EASE_OUT);
  const fold = ramp(frame, HANDOFF_AT, 18, EASE_IN);
  const toConnect = ramp(frame, 96, 32, EASE_IN_OUT);
  const toSelect = ramp(frame, SELECT_AT - 26, 22, EASE_IN_OUT);
  const hover = keys(frame, [SELECT_AT + 14, OPTION_AT - 6], [0, 1]);
  const toOption = ramp(frame, SELECT_AT + 6, 16, EASE_IN_OUT);
  const toAllow = ramp(frame, OPTION_AT + 10, 26, EASE_IN_OUT);
  const menu = ramp(frame, SELECT_AT + 2, 12, EASE_OUT) * (1 - ramp(frame, OPTION_AT + 2, 8));
  const optionY = SHARE_MENU.y + 6 + SHARE_MENU.rowH * hover + SHARE_MENU.rowH / 2;

  const cursorX = frame < SELECT_AT - 26 ? lerp(1500, CONNECT.x, toConnect) : frame < OPTION_AT ? lerp(lerp(CONNECT.x, HEALTH_SELECT.x + 60, toSelect), SHARE_MENU.x + 200, toOption) : lerp(SHARE_MENU.x + 200, ALLOW.x + 30, toAllow);
  const cursorY = frame < SELECT_AT - 26 ? lerp(980, CONNECT.y, toConnect) : frame < OPTION_AT ? lerp(lerp(CONNECT.y, HEALTH_SELECT.y, toSelect), optionY, toOption) : lerp(SHARE_MENU.y + 6 + SHARE_MENU.rowH * 1.5, ALLOW.y, toAllow);

  return (
    <AbsoluteFill style={{ opacity: 1 - fold, filter: fold > 0 ? `blur(${(fold * 10).toFixed(2)}px)` : undefined, transform: `scale(${lerp(1, 0.94, fold)})` }}>
      <div style={camera(frame, INTRO_CAMS)}>
        <div style={{ position: "absolute", left: CARD.x, top: CARD.top, width: CARD.w, opacity: lerp(1, 0.35, sheet), transform: `translateY(${-70 * sheet}px) scale(${lerp(1, 0.92, sheet)})`, ...rise(frame, 0, { y: 40, scale: 0.97, dur: 24 }) }}>
          <MemberCard frame={frame} />
        </div>
        {frame >= SHEET_AT ? (
          <div style={{ position: "absolute", left: SHEET.x, top: SHEET.top, width: SHEET.w, opacity: sheet, transform: `translateY(${(1 - sheet) * 200}px)` }}>
            <PermissionSheet frame={frame} />
          </div>
        ) : null}
        <Menu items={SHARE_ITEMS} open={menu} hover={hover} picked={frame >= OPTION_AT ? 1 : -1} width={SHARE_MENU.w} rowH={SHARE_MENU.rowH} style={{ left: SHARE_MENU.x, top: SHARE_MENU.y }} />
        <ClickRing x={CONNECT.x} y={CONNECT.y} progress={ramp(frame, CONNECT_AT + 1, 16)} />
        <ClickRing x={ALLOW.x} y={ALLOW.y} progress={ramp(frame, ALLOW_AT + 1, 16)} />
        <div style={{ opacity: ramp(frame, 94, 8) * (1 - ramp(frame, ALLOW_AT + 10, 8)) }}>
          <Cursor x={cursorX} y={cursorY} pressed={Math.max(pulse(frame, CONNECT_AT - 2, 3, 6), pulse(frame, SELECT_AT - 2, 3, 6), pulse(frame, OPTION_AT - 2, 3, 6), pulse(frame, ALLOW_AT - 2, 3, 6))} />
        </div>
      </div>
    </AbsoluteFill>
  );
}

function MemberCard({ frame }: { frame: number }) {
  return (
    <div style={{ height: CARD.h, boxSizing: "border-box", padding: CARD.pad, borderRadius: 40, background: C.paper, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, ...rise(frame, 8) }}>
        <Mark letter="H" size={56} tone={C.salmon} radius={16} />
        <span style={{ flex: 1, fontFamily: F.ui, fontWeight: 600, fontSize: 22, color: C.walnut }}>Hudson Concierge Medicine</span>
        <Pill tone="sage" icon="check" height={40}>
          Member
        </Pill>
      </div>
      <PageTitle size={84} style={{ marginTop: 44, letterSpacing: "-0.035em", ...rise(frame, 12, { y: 18, dur: 26 }) }}>
        Alex Moreno
      </PageTitle>
      <div style={{ display: "flex", gap: 10, marginTop: 24, ...rise(frame, 18) }}>
        <Pill tone="salmon" height={44}>
          Executive Health
        </Pill>
        <Pill tone="outline" icon="stethoscope" height={44}>
          Dr. Eleanor Shaw
        </Pill>
        <Pill tone="outline" icon="calendar" height={44}>
          Since Nov 2026
        </Pill>
      </div>
      <div style={{ marginTop: "auto", height: AGENT_ROW.h, boxSizing: "border-box", padding: "0 14px 0 14px", borderRadius: 26, background: C.beige, display: "flex", alignItems: "center", gap: 14, ...rise(frame, 26, { y: 14 }) }}>
        <AgentPill size={0.95} />
        <span style={{ flex: 1, fontFamily: F.ui, fontWeight: 500, fontSize: 19, color: SUB }}>Not connected</span>
        <Pill height={56} icon="link" press={pulse(frame, CONNECT_AT - 2, 3, 8)} style={{ fontSize: 19, padding: "0 22px 0 18px" }}>
          Connect
        </Pill>
      </div>
    </div>
  );
}

/** A short run of dots that swell in a travelling wave — the bridge, at component scale. */
function DotRun({ width, frame, count = 13, size = 9 }: { width: number; frame: number; count?: number; size?: number }) {
  return (
    <div style={{ position: "relative", width, height: size * 2 }}>
      {Array.from({ length: count }, (_, i) => {
        const w = 0.5 + 0.5 * Math.sin(i * 0.9 - frame * 0.28);
        const s = size * (0.45 + 0.55 * w);
        return <div key={i} style={{ position: "absolute", left: (i / (count - 1)) * (width - size) + (size - s) / 2, top: size - s / 2, width: s, height: s, borderRadius: 99, background: C.dot, opacity: 0.35 + 0.65 * w }} />;
      })}
    </div>
  );
}

function PermissionSheet({ frame }: { frame: number }) {
  const at = (o: number) => SHEET_AT + o;
  const chosen = frame >= OPTION_AT;
  const allowed = ramp(frame, ALLOW_AT + 2, 12, EASE_IN_OUT);
  const value = chosen ? typed(SHARE_ITEMS[1].label, frame, OPTION_AT, 90) : "Choose what to share";
  return (
    <div style={{ height: SHEET_H, boxSizing: "border-box", padding: SHEET.pad, borderRadius: 40, background: C.paper, border: `1px solid ${C.line}`, display: "flex", flexDirection: "column" }}>
      <div style={{ height: 90, boxSizing: "border-box", padding: "0 20px 0 22px", borderRadius: 26, background: C.beige, display: "flex", alignItems: "center", gap: 18, ...rise(frame, at(8)) }}>
        <AgentPill size={1} />
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <DotRun width={170} frame={frame} />
        </div>
        <Mark letter="H" size={56} tone={C.salmon} radius={16} />
        <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 20, color: C.walnut }}>Hudson</span>
      </div>
      <PageTitle size={46} style={{ marginTop: 24, height: 52, ...rise(frame, at(12)) }}>
        Connect your agent to Hudson
      </PageTitle>
      <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: PERM_GAP }}>
        {PERM_ROWS.map((row, i) => (
          <div key={row.label} style={{ height: PERM_H, boxSizing: "border-box", padding: "0 16px 0 14px", borderRadius: 20, background: C.beige, display: "flex", alignItems: "center", gap: 14, ...rise(frame, at(16 + i * 4), { y: 12, dur: 18 }) }}>
            <div style={{ width: 46, height: 46, borderRadius: 14, background: C.paper, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Glyph name={row.icon} size={20} />
            </div>
            <span style={{ flex: 1, fontFamily: F.ui, fontWeight: 600, fontSize: 21, color: C.walnut }}>{row.label}</span>
            {i < 3 ? (
              <Toggle size={1.3} progress={ramp(frame, at(24 + i * 6), 10, EASE_IN_OUT)} />
            ) : (
              <Select value={<span style={{ color: chosen ? C.walnut : SUB }}>{value}</span>} open={ramp(frame, SELECT_AT, 8) * (1 - ramp(frame, OPTION_AT, 8))} height={50} width={SELECT_W} style={{ background: C.paper }} />
            )}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 28, display: "flex", gap: 12, height: 64, ...rise(frame, at(32), { y: 10 }) }}>
        <Pill tone="outline" height={64} style={{ width: 180, fontSize: 21 }}>
          Not now
        </Pill>
        <SwapPill p={allowed} press={pulse(frame, ALLOW_AT - 2, 3, 8)} height={64} from={{ label: "Allow", tone: "ink" }} to={{ label: "Connected", icon: "check", tone: "sage" }} style={{ flex: 1, fontSize: 21 }} />
      </div>
    </div>
  );
}

/* ─── Agent ↔ practice ─────────────────────────────────────────────────────── */

/** Point along the bridge, t = 0 at the agent, 1 at the practice. */
const onBridge = (t: number) => ({ x: lerp(BRIDGE.a.x, BRIDGE.b.x, t), y: lerp(BRIDGE.a.y, BRIDGE.b.y, t) });

function StageWorld({ frame }: { frame: number }) {
  const arrive = ramp(frame, HANDOFF_AT + 4, 24, EASE_OUT);
  const draw = ramp(frame, BRIDGE_AT, 34, CAMERA_EASE);
  const toRow = ramp(frame, OPEN_AT - 30, 26, EASE_IN_OUT);
  const toAdd = ramp(frame, ADD_AT - 24, 20, EASE_IN_OUT);
  const addMenu = ramp(frame, ADD_AT + 2, 12, EASE_OUT) * (1 - ramp(frame, ADD_PICK_AT + 2, 8));
  const addHover = keys(frame, [ADD_AT + 10, ADD_PICK_AT - 6], [0, 2]);
  const toPick = ramp(frame, ADD_AT + 6, 14, EASE_IN_OUT);
  const toSend = ramp(frame, SEND_AT - 30, 26, EASE_IN_OUT);
  const toTabs = ramp(frame, TIMELINE_AT - 30, 26, EASE_IN_OUT);
  const pickY = ADD_MENU.y + 6 + ADD_MENU.rowH * addHover + ADD_MENU.rowH / 2;
  const referral = rowCenter(REFERRAL);
  const tabsY = PANEL.y + PANEL.pad + 32;

  let cx: number;
  let cy: number;
  if (frame < ADD_AT - 24) {
    cx = lerp(1500, referral.x, toRow);
    cy = lerp(1000, referral.y, toRow);
  } else if (frame < ADD_PICK_AT) {
    cx = lerp(lerp(referral.x, ADD_BUTTON.x, toAdd), ADD_MENU.x + 140, toPick);
    cy = lerp(lerp(referral.y, ADD_BUTTON.y, toAdd), pickY, toPick);
  } else if (frame < TIMELINE_AT - 30) {
    cx = lerp(ADD_MENU.x + 140, SEND.x + 30, toSend);
    cy = lerp(ADD_MENU.y + 6 + ADD_MENU.rowH * 2.5, SEND.y, toSend);
  } else {
    cx = lerp(SEND.x + 30, TABS_X, toTabs);
    cy = lerp(SEND.y, tabsY, toTabs);
  }
  const cursorOn = ramp(frame, OPEN_AT - 32, 8) * (1 - ramp(frame, TIMELINE_AT + 10, 10));

  return (
    <AbsoluteFill style={{ opacity: arrive, filter: arrive < 1 ? `blur(${((1 - arrive) * 8).toFixed(2)}px)` : undefined }}>
      <div style={camera(frame, STAGE_CAMS)}>
        <DotBridge a={BRIDGE.a} b={BRIDGE.b} thickness={170} step={11} draw={draw} />
        <div style={{ position: "absolute", left: NODE.x, top: NODE.y, width: NODE.w, ...rise(frame, HANDOFF_AT + 6, { x: -40, y: 0, scale: 0.94, dur: 26 }) }}>
          <AgentNode frame={frame} />
        </div>
        <div style={{ position: "absolute", left: PANEL.x, top: PANEL.y, width: PANEL.w, ...rise(frame, HANDOFF_AT + 12, { x: 60, y: 0, scale: 0.97, dur: 28 }) }}>
          <MemberPanel frame={frame} />
        </div>
        {REQUESTS.map((r, i) => (
          <Packet key={r.kind} frame={frame} at={REQ_AT[i] - CROSS} label={r.kind} icon={r.icon} />
        ))}
        <Packet frame={frame} at={RETURN_AT} label="3 next steps" icon="arrowLeft" back />

        <Menu items={ADD_ITEMS} open={addMenu} hover={addHover} picked={frame >= ADD_PICK_AT ? 2 : -1} width={ADD_MENU.w} rowH={ADD_MENU.rowH} origin="100% 0" style={{ left: ADD_MENU.x, top: ADD_MENU.y }} />
        <ClickRing x={referral.x} y={referral.y} progress={ramp(frame, OPEN_AT + 1, 16)} />
        <ClickRing x={ADD_BUTTON.x} y={ADD_BUTTON.y} progress={ramp(frame, ADD_AT + 1, 16)} />
        <ClickRing x={SEND.x} y={SEND.y} progress={ramp(frame, SEND_AT + 1, 16)} />
        <ClickRing x={TABS_X} y={tabsY} progress={ramp(frame, TIMELINE_AT + 1, 16)} />
        {cursorOn > 0 ? (
          <div style={{ opacity: cursorOn }}>
            <Cursor x={cx} y={cy} pressed={Math.max(pulse(frame, OPEN_AT - 2, 3, 6), pulse(frame, ADD_AT - 2, 3, 6), pulse(frame, ADD_PICK_AT - 2, 3, 6), pulse(frame, SEND_AT - 2, 3, 6), pulse(frame, TIMELINE_AT - 2, 3, 6))} />
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
}

function Packet({ frame, at, label, icon, back = false }: { frame: number; at: number; label: string; icon: AnyIcon; back?: boolean }) {
  if (frame < at - 4 || frame > at + CROSS + 8) return null;
  const t = ramp(frame, at, CROSS, EASE_IN_OUT);
  const p = onBridge(back ? 1 - t : t);
  const show = ramp(frame, at - 4, 6) * (1 - ramp(frame, at + CROSS - 2, 8));
  return (
    <div style={{ position: "absolute", left: p.x, top: p.y, opacity: show, transform: `translate(-50%, -50%) scale(${lerp(0.8, 1, ramp(frame, at - 4, 8))})` }}>
      <Pill tone={back ? "salmon" : "ink"} icon={icon} height={46} style={{ fontSize: 18 }}>
        {label}
      </Pill>
    </div>
  );
}

function AgentNode({ frame }: { frame: number }) {
  const got = ramp(frame, RETURN_AT + CROSS - 2, 10, EASE_IN_OUT);
  const bump = Math.max(pulse(frame, RETURN_AT + CROSS - 2, 4, 14), ...REQ_AT.map((at) => pulse(frame, at - CROSS - 2, 4, 12)));
  return (
    <div style={{ height: NODE.h, boxSizing: "border-box", padding: 24, borderRadius: 36, background: C.ink, display: "flex", flexDirection: "column", justifyContent: "space-between", transform: `scale(${1 + 0.03 * bump})` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 64, height: 64, borderRadius: 999, background: C.salmon, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.ui, fontWeight: 600, fontSize: 26, color: C.walnut }}>A</div>
        <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 28, color: C.paper, whiteSpace: "nowrap" }}>Alex&rsquo;s Agent</span>
      </div>
      <SwapPill
        p={got}
        height={44}
        from={{
          label: (
            <>
              <StatusDot color={SAGE_TEXT} size={8} />
              Connected
            </>
          ),
          tone: "sage",
        }}
        to={{ label: "3 new from Hudson", icon: "inbox", tone: "salmon" }}
        style={{ width: lerp(150, 212, got), fontSize: 17 }}
      />
    </div>
  );
}

function MemberPanel({ frame }: { frame: number }) {
  const open = ramp(frame, OPEN_AT + 4, 22, EASE_IN_OUT);
  const tab = ramp(frame, TIMELINE_AT, 12, EASE_IN_OUT);
  const listOut = ramp(frame, TIMELINE_AT + 2, 14, EASE_IN);
  const at = (o: number) => HANDOFF_AT + 12 + o;
  return (
    <div style={{ position: "relative", height: PANEL.h, boxSizing: "border-box", padding: PANEL.pad, borderRadius: 40, background: C.paper, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, height: 64, ...rise(frame, at(10)) }}>
        <Mark letter="A" size={58} tone={C.salmon} radius={999} />
        <PageTitle size={46}>Alex Moreno</PageTitle>
        <Pill tone="salmon" height={36}>
          Executive Health
        </Pill>
        <div style={{ flex: 1 }} />
        <RoundButton icon="search" size={48} tone={C.beige} />
        <Segmented options={["Requests", "Timeline"]} active={tab} height={48} style={{ width: 300 }} />
      </div>

      <div style={{ position: "absolute", left: PANEL.pad, top: LIST_TOP, width: PANEL.w - PANEL.pad * 2, opacity: 1 - listOut, transform: `translateX(${-40 * listOut}px)` }}>
        {REQUESTS.map((r, i) => (
          <RequestRow key={r.kind} frame={frame} request={r} index={i} width={lerp(PANEL.w - PANEL.pad * 2, ROW_NARROW, open)} selected={i === REFERRAL ? ramp(frame, OPEN_AT, 8) : 0} />
        ))}
        {frame < REQ_AT[0] ? (
          <div style={{ height: ROW_H, borderRadius: 24, border: "1.5px dashed rgba(40, 25, 16, 0.16)", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: F.ui, fontWeight: 500, fontSize: 18, color: SUB, ...rise(frame, at(20)) }}>
            <Glyph name="inbox" size={18} color={SUB} />
            Requests from Alex&rsquo;s Agent land here
          </div>
        ) : null}
      </div>

      {open > 0 ? (
        <div style={{ position: "absolute", left: DRAWER.x, top: DRAWER.y, width: DRAWER.w, height: DRAWER.h, opacity: 1 - listOut, transform: `translateX(${(1 - open) * (DRAWER.w + PANEL.pad) + 40 * listOut}px)` }}>
          <ReplyDrawer frame={frame} />
        </div>
      ) : null}

      {tab > 0 ? <Timeline frame={frame} /> : null}
    </div>
  );
}

function RequestRow({ frame, request, index, width, selected }: { frame: number; request: Request; index: number; width: number; selected: number }) {
  const at = REQ_AT[index];
  const grow = ramp(frame, at - 2, 16, EASE_IN_OUT);
  if (grow <= 0) return null;
  const pop = ramp(frame, at, 18, EASE_OUT);
  const fresh = pulse(frame, at + 2, 6, 30);
  const chip: CSSProperties = { height: 30, padding: "0 11px", display: "inline-flex", alignItems: "center", gap: 6, borderRadius: 999, fontFamily: F.ui, fontWeight: 500, fontSize: 14, color: C.walnut, whiteSpace: "nowrap" };
  return (
    <div style={{ height: (ROW_H + ROW_GAP) * grow, overflow: "visible" }}>
      <div
        style={{
          width,
          height: ROW_H,
          boxSizing: "border-box",
          padding: "0 22px 0 20px",
          display: "flex",
          alignItems: "center",
          gap: 18,
          borderRadius: 24,
          background: C.beige,
          border: `1.5px solid rgba(20, 12, 4, ${selected})`,
          opacity: pop,
          transform: `translateX(${(1 - pop) * -50}px) scale(${lerp(0.96, 1, pop)})`,
          transformOrigin: "0 50%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: C.salmon, opacity: 0.45 * fresh }} />
        <div style={{ position: "relative", width: 56, height: 56, borderRadius: 18, background: C.paper, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Glyph name={request.icon} size={24} />
        </div>
        <div style={{ position: "relative", flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 9 }}>
          <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 21, color: C.walnut, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{request.title}</span>
          <div style={{ display: "flex", gap: 6 }}>
            <span style={{ ...chip, background: C.paper }}>{request.kind}</span>
            {request.extra ? (
              <span style={{ ...chip, border: `1px solid ${C.line2}`, boxSizing: "border-box" }}>
                <Glyph name={request.extra.icon} size={13} />
                {request.extra.label}
              </span>
            ) : null}
          </div>
        </div>
        <span style={{ position: "relative", fontFamily: F.ui, fontWeight: 500, fontSize: 17, color: SUB, whiteSpace: "nowrap" }}>{request.time}</span>
      </div>
    </div>
  );
}

function ReplyDrawer({ frame }: { frame: number }) {
  const sent = ramp(frame, SEND_AT + 2, 12, EASE_IN_OUT);
  const shown = [frame >= STEP_AT[0], frame >= STEP_AT[1], frame >= ADD_PICK_AT];
  const stepAt = [STEP_AT[0], STEP_AT[1], ADD_PICK_AT + 2];
  return (
    <div style={{ width: "100%", height: "100%", boxSizing: "border-box", padding: 24, borderRadius: 28, background: C.beige, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, height: 40 }}>
        <span style={{ height: 32, padding: "0 12px", display: "inline-flex", alignItems: "center", borderRadius: 999, background: C.paper, fontFamily: F.ui, fontWeight: 500, fontSize: 15, color: C.walnut }}>Referral</span>
        <div style={{ flex: 1 }} />
        <RoundButton icon="x" size={40} tone={C.paper} />
      </div>
      <PageTitle size={34} style={{ marginTop: 24, height: 40 }}>
        Sports medicine referral
      </PageTitle>
      <div style={{ marginTop: 16, height: 40, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <CardTitle style={{ fontSize: 22, color: SUB }}>Send back to Alex&rsquo;s Agent</CardTitle>
        <Pill tone="paper" icon="plus" trailing="chevronDown" height={40} press={pulse(frame, ADD_AT - 2, 3, 8)}>
          Add
        </Pill>
      </div>
      <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
        {STEPS.map((s, i) =>
          shown[i] ? (
            <div key={s.kind} style={{ height: STEP_H, boxSizing: "border-box", padding: "0 16px", borderRadius: 18, background: C.paper, display: "flex", flexDirection: "column", justifyContent: "center", gap: 8, ...rise(frame, stepAt[i], { y: 12, dur: 16 }) }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ height: 26, padding: "0 10px", display: "inline-flex", alignItems: "center", borderRadius: 999, background: i === 0 ? C.ink : i === 1 ? SOFT : C.salmon, color: i === 0 ? C.paper : C.walnut, fontFamily: F.ui, fontWeight: 500, fontSize: 13 }}>{s.kind}</span>
                {s.chip ? <span style={{ height: 26, padding: "0 10px", display: "inline-flex", alignItems: "center", borderRadius: 999, border: `1px solid ${C.line2}`, boxSizing: "border-box", fontFamily: F.ui, fontWeight: 500, fontSize: 13, color: C.walnut }}>{s.chip}</span> : null}
              </div>
              <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 18, color: C.walnut, whiteSpace: "nowrap" }}>{typed(s.text, frame, stepAt[i] + 2, 70)}</span>
            </div>
          ) : null,
        )}
      </div>
      <div style={{ marginTop: "auto" }}>
        <SwapPill p={sent} press={pulse(frame, SEND_AT - 2, 3, 8)} height={60} from={{ label: "Send to Alex’s Agent", icon: "send", tone: "ink" }} to={{ label: "Sent to Alex’s Agent", icon: "check", tone: "sage" }} style={{ fontSize: 19 }} />
      </div>
    </div>
  );
}

/* ─── Connected timeline ───────────────────────────────────────────────────── */

const SPINE_X = (PANEL.w - PANEL.pad * 2) / 2;
const MOMENT = { h: 80, gap: 16, w: 470 };

function Timeline({ frame }: { frame: number }) {
  const spine = ramp(frame, TIMELINE_AT + 6, 40, EASE_IN_OUT);
  const total = TIMELINE.length * (MOMENT.h + MOMENT.gap) - MOMENT.gap;
  return (
    <div style={{ position: "absolute", left: PANEL.pad, top: LIST_TOP + 6, width: PANEL.w - PANEL.pad * 2, height: total }}>
      <div style={{ position: "absolute", left: SPINE_X - 1, top: 0, width: 2, height: total * spine, background: C.line2 }} />
      {TIMELINE.map((m, i) => {
        const at = TIMELINE_AT + 10 + i * 6;
        const left = m.side === "agent";
        const top = i * (MOMENT.h + MOMENT.gap);
        return (
          <div key={m.text}>
            <div style={{ position: "absolute", left: SPINE_X - 9, top: top + MOMENT.h / 2 - 9, width: 18, height: 18, borderRadius: 99, boxSizing: "border-box", background: m.next ? C.paper : left ? C.salmon : C.ink, border: m.next ? `2px solid ${C.ink}` : undefined, transform: `scale(${ramp(frame, at, 10)})` }} />
            <div
              style={{
                position: "absolute",
                left: left ? SPINE_X - 28 - MOMENT.w : SPINE_X + 28,
                top,
                width: MOMENT.w,
                height: MOMENT.h,
                boxSizing: "border-box",
                padding: "0 18px 0 12px",
                borderRadius: 20,
                background: m.next ? "transparent" : C.beige,
                border: m.next ? `1.5px dashed rgba(40, 25, 16, 0.28)` : undefined,
                display: "flex",
                flexDirection: left ? "row-reverse" : "row",
                alignItems: "center",
                gap: 12,
                ...rise(frame, at, { x: left ? 24 : -24, y: 0, dur: 18 }),
              }}
            >
              <div style={{ width: 46, height: 46, borderRadius: 14, background: left ? C.salmon : C.paper, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Glyph name={m.icon} size={19} />
              </div>
              <span style={{ flex: 1, textAlign: left ? "right" : "left", fontFamily: F.ui, fontWeight: 600, fontSize: 20, color: C.walnut, whiteSpace: "nowrap" }}>{m.text}</span>
              <span style={{ height: 28, padding: "0 10px", display: "inline-flex", alignItems: "center", borderRadius: 999, background: m.next ? C.ink : C.paper, color: m.next ? C.paper : C.walnut, fontFamily: F.ui, fontWeight: 500, fontSize: 14, whiteSpace: "nowrap" }}>{m.date}</span>
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, top: total + 26, width: "100%", display: "flex", justifyContent: "center", gap: 24, ...rise(frame, TIMELINE_AT + 60, { y: 8 }) }}>
        <Legend tone={C.salmon} label="Alex’s Agent" />
        <Legend tone={C.ink} label="Hudson" />
      </div>
    </div>
  );
}

function Legend({ tone, label }: { tone: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: F.ui, fontWeight: 500, fontSize: 16, color: SUB }}>
      <div style={{ width: 12, height: 12, borderRadius: 99, background: tone }} />
      {label}
    </div>
  );
}