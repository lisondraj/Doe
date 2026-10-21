import type { CSSProperties } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

import { DotTide, Stage } from "../video1/backdrops";
import { EASE_IN_OUT, camera, fly, keys, lerp, pulse, ramp } from "../video1/motion";
import { C, F } from "../video1/theme";
import { AppShell, Avatar, Button, Chip, ClickRing, Cursor, Icon, ShadowsContext, StatusDot, Toggle, type IconName } from "../video1/ui";
import { AccessPill, BedTrack, Dropdown, H, IconButton, SECTION_FRAMES, SearchField, Segmented, TILE_TONES, Tile, clamp01, mix, surface, type Access } from "./shared";

export const SECTION2_FRAMES = SECTION_FRAMES;

export function Section2Permissions() {
  return (
    <ShadowsContext.Provider value={false}>
      <BedTrack />
      <Stage backdrop={<DotTide />}>
        <GovernanceFilm />
      </Stage>
    </ShadowsContext.Provider>
  );
}

/* ─── World layout ─────────────────────────────────────────────────────────── */

const SHELL = { x: 240, y: 90 };
const O = { x: SHELL.x + 64, y: SHELL.y + 12 };
const PATIENT = { x: 1900, y: 90, w: 820, h: 480, pad: 36 };
const AUDIT = { x: 1900, y: 630, w: 820, h: 420, pad: 32 };

const SCOPE = { x: 28, y: 98, w: 250, h: 40 };
const MENU = { top: SCOPE.y + SCOPE.h + 8, pad: 6, row: 46 };
const TABLE = { x: 28, top: 162, w: 1308, head: 44, step: 72, rowH: 66, nameW: 312 };
const CELL_W = (TABLE.w - TABLE.nameW) / 5;
const EDIT = { x: 744, y: 28, w: 1364 - 28 - 744, h: 820, rowsTop: 160, rowStep: 76, rowH: 68 };

/* ─── Timeline ─────────────────────────────────────────────────────────────── */

const MENU_CLICK = 62;
const HOVER_AT = [80, 94, 108, 122, 136];
const PICK_BACK = 152;
const PICK_AT = 158;
const ROW_CLICK = 236;
const TOGGLE_AT = [286, 312];
const SAVE_AT = 360;
const PATIENT_AT = 412;
const MED_TOGGLE_AT = 456;
const TAB_AT = [484, 514];
const AUDIT_AT = 564;
const FLOW_AT = 572;
const FLOW_STEP = 24;
const LOG_INSERT_AT = FLOW_AT + FLOW_STEP * 3 + 8;
const OVERVIEW_AT = 700;

const SCOPES: { label: string; icon: IconName }[] = [
  { label: "Hospital", icon: "building" },
  { label: "Department", icon: "grid" },
  { label: "Specialty", icon: "list" },
  { label: "Service", icon: "doc" },
  { label: "Action type", icon: "sliders" },
];

const COLUMNS = ["Scheduling", "Referrals", "Records", "Messaging", "Billing"];

type DeptRow = { name: string; icon: IconName; tone: string; access: Access[]; after?: Access[] };

const DEPT_ROWS: DeptRow[] = [
  { name: "Emergency", icon: "plus", tone: TILE_TONES[2], access: ["request", "allowed", "restricted", "allowed", "allowed"] },
  { name: "Cardiology", icon: "heart", tone: TILE_TONES[0], access: ["off", "off", "restricted", "request", "allowed"], after: ["allowed", "allowed", "restricted", "request", "allowed"] },
  { name: "Pediatrics", icon: "user", tone: TILE_TONES[1], access: ["allowed", "allowed", "restricted", "allowed", "allowed"] },
  { name: "Oncology", icon: "pill", tone: TILE_TONES[0], access: ["request", "allowed", "restricted", "request", "allowed"] },
  { name: "Imaging", icon: "scan", tone: TILE_TONES[3], access: ["allowed", "off", "restricted", "allowed", "allowed"] },
  { name: "Neurosciences", icon: "brain", tone: TILE_TONES[2], access: ["allowed", "allowed", "restricted", "request", "allowed"] },
  { name: "Orthopedics", icon: "activity", tone: TILE_TONES[1], access: ["allowed", "allowed", "restricted", "allowed", "request"] },
  { name: "Behavioral Health", icon: "chat", tone: TILE_TONES[3], access: ["request", "request", "restricted", "off", "allowed"] },
];
const CARDIOLOGY = 1;

/** World-space centres of the things the cursors press. */
const panelToWorld = (x: number, y: number) => ({ x: O.x + x, y: O.y + y });
const SCOPE_BTN = panelToWorld(SCOPE.x + SCOPE.w / 2, SCOPE.y + SCOPE.h / 2);
const menuOption = (i: number) => panelToWorld(SCOPE.x + 110, MENU.top + MENU.pad + i * MENU.row + MENU.row / 2);
const CARDIOLOGY_ROW = panelToWorld(TABLE.x + 190, TABLE.top + TABLE.head + CARDIOLOGY * TABLE.step + TABLE.rowH / 2);
const editToggle = (i: number) => panelToWorld(EDIT.x + EDIT.w - 24 - 18 - 18, EDIT.y + EDIT.rowsTop + i * EDIT.rowStep + EDIT.rowH / 2);
const SAVE_BTN = panelToWorld(EDIT.x + 24 + (EDIT.w - 48 - 140 - 10) / 2, EDIT.y + EDIT.h - 24 - 23);

const PATIENT_TRACK = { x: PATIENT.x + PATIENT.pad, y: PATIENT.y + 112, w: PATIENT.w - PATIENT.pad * 2, h: 52 };
const tabCenter = (i: number) => ({ x: PATIENT_TRACK.x + 4 + ((PATIENT_TRACK.w - 8) / 3) * (i + 0.5), y: PATIENT_TRACK.y + PATIENT_TRACK.h / 2 });
const P_ROW = { top: 188, step: 84, h: 74 };
const MED_TOGGLE = { x: PATIENT.x + PATIENT.w - PATIENT.pad - 18 - 23, y: PATIENT.y + P_ROW.top + P_ROW.step + P_ROW.h / 2 };

const ADMIN_PATH = [
  { f: 30, x: 980, y: 780 },
  { f: 60, ...SCOPE_BTN },
  { f: HOVER_AT[0], ...menuOption(0) },
  { f: HOVER_AT[1], ...menuOption(1) },
  { f: HOVER_AT[2], ...menuOption(2) },
  { f: HOVER_AT[3], ...menuOption(3) },
  { f: HOVER_AT[4], ...menuOption(4) },
  { f: PICK_BACK, ...menuOption(1) },
  { f: 186, ...menuOption(1) },
  { f: ROW_CLICK - 4, ...CARDIOLOGY_ROW },
  { f: TOGGLE_AT[0] - 4, ...editToggle(0) },
  { f: TOGGLE_AT[1] - 4, ...editToggle(1) },
  { f: SAVE_AT - 4, ...SAVE_BTN },
  { f: 392, x: SAVE_BTN.x + 260, y: SAVE_BTN.y + 140 },
];

const PATIENT_PATH = [
  { f: 424, x: PATIENT.x + 620, y: PATIENT.y + PATIENT.h + 120 },
  { f: MED_TOGGLE_AT - 4, ...MED_TOGGLE },
  { f: TAB_AT[0] - 4, ...tabCenter(1) },
  { f: TAB_AT[1] - 4, ...tabCenter(2) },
  { f: 548, x: tabCenter(2).x + 120, y: tabCenter(2).y + 260 },
];

function along(frame: number, path: { f: number; x: number; y: number }[]) {
  const fs = path.map((p) => p.f);
  return { x: keys(frame, fs, path.map((p) => p.x)), y: keys(frame, fs, path.map((p) => p.y)) };
}

function GovernanceFilm() {
  const frame = useCurrentFrame();
  const cam = camera(frame, [
    { f: 0, x: 720, y: 300, s: 1.65 },
    { f: 34, x: 700, y: 300, s: 1.65 },
    { f: 74, x: 640, y: 380, s: 1.72 },
    { f: 150, x: 650, y: 390, s: 1.7 },
    { f: 200, x: 960, y: 540, s: 1.12 },
    { f: 238, x: 920, y: 500, s: 1.18 },
    { f: 282, x: 1330, y: 480, s: 1.5 },
    { f: 330, x: 1340, y: 520, s: 1.55 },
    { f: 370, x: 1300, y: 700, s: 1.5 },
    { f: 388, x: 1560, y: 520, s: 1.08 },
    { f: PATIENT_AT, x: 1720, y: 380, s: 1.12 },
    { f: 448, x: 2310, y: 330, s: 1.4 },
    { f: 530, x: 2320, y: 340, s: 1.46 },
    { f: 548, x: 2200, y: 560, s: 1.12 },
    { f: AUDIT_AT + 8, x: 2280, y: 780, s: 1.18 },
    { f: 620, x: 2310, y: 840, s: 1.36 },
    { f: OVERVIEW_AT, x: 2310, y: 850, s: 1.42 },
    { f: 772, x: 1480, y: 570, s: 0.7 },
    { f: SECTION_FRAMES, x: 1480, y: 570, s: 0.74 },
  ]);
  const admin = along(frame, ADMIN_PATH);
  const patient = along(frame, PATIENT_PATH);
  const adminPress = Math.max(pulse(frame, MENU_CLICK, 3, 6), pulse(frame, PICK_AT, 3, 6), pulse(frame, ROW_CLICK, 3, 6), ...TOGGLE_AT.map((f) => pulse(frame, f, 3, 6)), pulse(frame, SAVE_AT, 3, 6));
  const patientPress = Math.max(pulse(frame, MED_TOGGLE_AT, 3, 6), ...TAB_AT.map((f) => pulse(frame, f, 3, 6)));

  return (
    <AbsoluteFill>
      <div style={cam}>
        <Links frame={frame} />
        <div style={{ position: "absolute", left: SHELL.x, top: SHELL.y }}>
          <AppShell active={4} railReveal={(i) => ramp(frame, 6 + i * 2, 12)}>
            <AccessPage frame={frame} />
          </AppShell>
        </div>
        <div style={{ position: "absolute", left: PATIENT.x, top: PATIENT.y, width: PATIENT.w, ...fly(frame, { at: PATIENT_AT, x: 70, y: 0, scale: 0.96, dur: 22 }) }}>
          <PatientCard frame={frame} />
        </div>
        <div style={{ position: "absolute", left: AUDIT.x, top: AUDIT.y, width: AUDIT.w, ...fly(frame, { at: AUDIT_AT, y: 64, scale: 0.96, dur: 22 }) }}>
          <AuditCard frame={frame} />
        </div>

        <ClickRing x={SCOPE_BTN.x} y={SCOPE_BTN.y} progress={ramp(frame, MENU_CLICK + 1, 16)} />
        <ClickRing x={menuOption(1).x} y={menuOption(1).y} progress={ramp(frame, PICK_AT + 1, 16)} />
        <ClickRing x={CARDIOLOGY_ROW.x} y={CARDIOLOGY_ROW.y} progress={ramp(frame, ROW_CLICK + 1, 16)} />
        {TOGGLE_AT.map((f, i) => (
          <ClickRing key={f} x={editToggle(i).x} y={editToggle(i).y} progress={ramp(frame, f + 1, 16)} />
        ))}
        <ClickRing x={SAVE_BTN.x} y={SAVE_BTN.y} progress={ramp(frame, SAVE_AT + 1, 16)} />
        <ClickRing x={MED_TOGGLE.x} y={MED_TOGGLE.y} progress={ramp(frame, MED_TOGGLE_AT + 1, 16)} />
        {TAB_AT.map((f, i) => (
          <ClickRing key={f} x={tabCenter(i + 1).x} y={tabCenter(i + 1).y} progress={ramp(frame, f + 1, 16)} />
        ))}

        <div style={{ opacity: ramp(frame, 30, 8) * (1 - ramp(frame, 380, 12)) }}>
          <Cursor x={admin.x} y={admin.y} pressed={adminPress} />
        </div>
        <div style={{ opacity: ramp(frame, 424, 8) * (1 - ramp(frame, 532, 12)) }}>
          <Cursor x={patient.x} y={patient.y} pressed={patientPress} />
        </div>
      </div>
    </AbsoluteFill>
  );
}

/** Once everything is on screen, the three surfaces are tied together. */
function Links({ frame }: { frame: number }) {
  const links = [
    { a: { x: SHELL.x + 1440, y: SHELL.y + 300 }, b: { x: PATIENT.x, y: PATIENT.y + 220 } },
    { a: { x: SHELL.x + 1440, y: SHELL.y + 640 }, b: { x: AUDIT.x, y: AUDIT.y + 200 } },
  ];
  return (
    <>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {links.map(({ a, b }, i) => {
          const draw = ramp(frame, OVERVIEW_AT + 40 + i * 8, 26, EASE_IN_OUT);
          const mid = (a.x + b.x) / 2;
          return draw > 0 ? <path key={i} d={`M${a.x} ${a.y} C${mid} ${a.y} ${mid} ${b.y} ${b.x} ${b.y}`} pathLength={1} fill="none" stroke={C.walnut} strokeOpacity={0.3} strokeWidth={2.4} strokeDasharray="1 1" strokeDashoffset={1 - draw} /> : null;
        })}
      </svg>
      {links.map(({ a, b }, i) => {
        const start = OVERVIEW_AT + 70 + i * 10;
        if (frame < start) return null;
        const t = ((frame - start) % 40) / 40;
        const e = EASE_IN_OUT(t);
        const mid = (a.x + b.x) / 2;
        const u = 1 - e;
        const x = u * u * u * a.x + 3 * u * u * e * mid + 3 * u * e * e * mid + e * e * e * b.x;
        const y = u * u * u * a.y + 3 * u * u * e * a.y + 3 * u * e * e * b.y + e * e * e * b.y;
        return <div key={i} style={{ position: "absolute", left: x - 7, top: y - 7, width: 14, height: 14, borderRadius: 99, background: C.ink, opacity: Math.sin(Math.PI * t), boxShadow: "0 0 0 5px rgba(252, 207, 184, 0.7)" }} />;
      })}
    </>
  );
}

/* ─── Agent access: the enterprise permissions page ────────────────────────── */

function AccessPage({ frame }: { frame: number }) {
  const menu = ramp(frame, MENU_CLICK + 2, 12) * (1 - ramp(frame, PICK_AT + 2, 10, EASE_IN_OUT));
  const hover = keys(frame, [...HOVER_AT, PICK_BACK], [0, 1, 2, 3, 4, 1]);
  const editOpen = ramp(frame, ROW_CLICK + 4, 24);

  return (
    <>
      <div style={{ position: "absolute", left: 28, top: 28, fontFamily: F.display, fontWeight: 500, fontSize: 46, lineHeight: "50px", letterSpacing: "-0.025em", color: C.walnut, ...fly(frame, { at: 8, y: 14, dur: 18, blur: 0 }) }}>
        Agent access
      </div>
        <div style={{ position: "absolute", right: 28, top: 34, display: "flex", gap: 8, ...fly(frame, { at: 12, y: 14, dur: 18, blur: 0 }) }}>
        <IconButton icon="search" />
        <Dropdown value={H.system} />
        <Button height={38} icon={<Icon name="plus" size={14} color={C.paper} />} style={{ fontSize: 14 }}>
          New policy
        </Button>
      </div>

      <div style={{ position: "absolute", left: SCOPE.x, top: SCOPE.y, display: "flex", gap: 10, ...fly(frame, { at: 14, y: 12, dur: 18, blur: 0 }) }}>
        <div style={{ transform: `scale(${1 - 0.04 * pulse(frame, MENU_CLICK, 3, 8)})` }}>
          <Dropdown label="View by" value="Department" width={SCOPE.w} height={SCOPE.h} open={menu} />
        </div>
        <SearchField placeholder="Departments, services, actions" width={420} height={SCOPE.h} />
      </div>

      <div style={{ position: "absolute", left: TABLE.x, top: TABLE.top, width: TABLE.w, height: TABLE.head + DEPT_ROWS.length * TABLE.step + 2, borderRadius: 24, background: C.beige, ...fly(frame, { at: 18, y: 20, dur: 20, blur: 0 }) }}>
        <div style={{ position: "absolute", left: 24, top: 0, height: TABLE.head, display: "flex", alignItems: "center", fontFamily: F.body, fontSize: 13, color: C.muted }}>Department</div>
        {COLUMNS.map((label, i) => (
          <div key={label} style={{ position: "absolute", left: TABLE.nameW + i * CELL_W, top: 0, height: TABLE.head, display: "flex", alignItems: "center", fontFamily: F.body, fontSize: 13, color: C.muted }}>
            {label}
          </div>
        ))}
        {DEPT_ROWS.map((row, i) => (
          <DeptTableRow key={row.name} frame={frame} row={row} index={i} />
        ))}
      </div>

      {menu > 0.01 ? (
        <div
          style={{
            position: "absolute",
            left: SCOPE.x,
            top: MENU.top,
            width: SCOPE.w,
            boxSizing: "border-box",
            padding: MENU.pad,
            borderRadius: 18,
            background: C.paper,
            border: `1px solid ${C.line2}`,
            opacity: menu,
            transform: `translateY(${(1 - menu) * -10}px) scale(${lerp(0.96, 1, menu)})`,
            transformOrigin: "50% 0",
          }}
        >
          <div style={{ position: "absolute", left: MENU.pad, right: MENU.pad, top: MENU.pad + hover * MENU.row, height: MENU.row, borderRadius: 12, background: C.beige, opacity: ramp(frame, HOVER_AT[0] - 6, 6) }} />
          {SCOPES.map((scope, i) => (
            <div key={scope.label} style={{ position: "relative", height: MENU.row, display: "flex", alignItems: "center", gap: 12, padding: "0 12px", fontFamily: F.ui, fontWeight: 500, fontSize: 16, color: C.walnut }}>
              <Icon name={scope.icon} size={17} color={C.muted} />
              <span style={{ flex: 1 }}>{scope.label}</span>
              {i === 1 ? <Icon name="check" size={16} stroke={2.4} /> : null}
            </div>
          ))}
        </div>
      ) : null}

      {editOpen > 0 ? (
        <div style={{ position: "absolute", left: EDIT.x, top: EDIT.y, width: EDIT.w, height: EDIT.h, opacity: editOpen, transform: `translateX(${(1 - editOpen) * 90}px)` }}>
          <CardiologyPanel frame={frame} />
        </div>
      ) : null}
    </>
  );
}

function DeptTableRow({ frame, row, index }: { frame: number; row: DeptRow; index: number }) {
  const cardiology = index === CARDIOLOGY;
  const hovered = cardiology ? ramp(frame, ROW_CLICK - 20, 8) : 0;
  const saved = frame >= SAVE_AT + 8;
  const flash = cardiology ? pulse(frame, SAVE_AT + 8, 6, 24) : 0;
  const access = saved && row.after ? row.after : row.access;
  return (
    <div
      style={{
        position: "absolute",
        left: 6,
        right: 6,
        top: TABLE.head + index * TABLE.step,
        height: TABLE.rowH,
        borderRadius: 16,
        background: C.paper,
        boxSizing: "border-box",
        border: `1.5px solid ${hovered > 0 ? `rgba(40, 25, 16, ${0.1 + 0.7 * hovered})` : "transparent"}`,
        ...fly(frame, { at: 22 + index * 3, y: 14, dur: 16, blur: 0 }),
      }}
    >
      <div style={{ position: "absolute", left: 14, top: 0, bottom: 0, display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 38, height: 38, borderRadius: 12, background: row.tone }} />
        <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 17, color: C.walnut }}>{row.name}</span>
      </div>
      {access.map((level, i) => {
        const changed = row.after && row.after[i] !== row.access[i];
        return (
          <div key={i} style={{ position: "absolute", left: TABLE.nameW - 6 + i * CELL_W, top: 0, bottom: 0, display: "flex", alignItems: "center", transform: changed ? `scale(${1 + 0.12 * flash})` : undefined, transformOrigin: "0 50%" }}>
            <AccessPill level={level} size={1.08} />
          </div>
        );
      })}
    </div>
  );
}

type Capability = { label: string; icon: IconName; control: "toggle" | "on" | "request" | "restricted"; at?: number };

const CAPABILITIES: Capability[] = [
  { label: "Appointments", icon: "calendar", control: "toggle", at: TOGGLE_AT[0] },
  { label: "Referral status", icon: "link", control: "toggle", at: TOGGLE_AT[1] },
  { label: "Prescription refills", icon: "pill", control: "on" },
  { label: "Visit summaries", icon: "doc", control: "on" },
  { label: "Billing questions", icon: "card", control: "request" },
  { label: "Clinical records", icon: "lock", control: "restricted" },
];

const darkChip: CSSProperties = { background: "rgba(255, 252, 241, 0.1)", color: C.paper };

function CardiologyPanel({ frame }: { frame: number }) {
  const saved = ramp(frame, SAVE_AT + 6, 14);
  return (
    <div style={{ position: "absolute", inset: 0, borderRadius: 22, background: C.ink }}>
      <div style={{ position: "absolute", left: 24, right: 24, top: 24, height: 44, display: "flex", alignItems: "center", gap: 14 }}>
        <Tile icon="heart" size={44} tone={C.salmon} />
        <div style={{ flex: 1, fontFamily: F.display, fontWeight: 500, fontSize: 32, letterSpacing: "-0.02em", color: C.paper }}>Cardiology</div>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(255, 252, 241, 0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="x" size={16} color={C.paper} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 24, top: 82, display: "flex", gap: 8 }}>
        <Chip size={1.1} style={darkChip} icon={<Icon name="mapPin" size={13} color={C.paper} />}>
          3 locations
        </Chip>
        <Chip size={1.1} style={darkChip} icon={<Icon name="user" size={13} color={C.paper} />}>
          42 providers
        </Chip>
        <Chip size={1.1} style={darkChip}>
          Heart Failure Clinic +6
        </Chip>
      </div>
      <div style={{ position: "absolute", left: 24, top: 134, fontFamily: F.body, fontWeight: 500, fontSize: 13, color: "rgba(255, 252, 241, 0.55)" }}>Capabilities</div>
      {CAPABILITIES.map((cap, i) => {
        const on = cap.control === "toggle" ? ramp(frame, (cap.at ?? 0) + 1, 8, EASE_IN_OUT) : cap.control === "on" ? 1 : 0;
        return (
          <div
            key={cap.label}
            style={{
              position: "absolute",
              left: 24,
              right: 24,
              top: EDIT.rowsTop + i * EDIT.rowStep,
              height: EDIT.rowH,
              boxSizing: "border-box",
              padding: "0 18px",
              borderRadius: 16,
              background: C.paper,
              display: "flex",
              alignItems: "center",
              gap: 14,
              ...fly(frame, { at: ROW_CLICK + 14 + i * 3, y: 14, dur: 16, blur: 0 }),
            }}
          >
            <Icon name={cap.icon} size={19} color={cap.control === "restricted" ? C.muted : C.walnut} />
            <span style={{ flex: 1, fontFamily: F.ui, fontWeight: 600, fontSize: 17, color: cap.control === "restricted" ? C.muted : C.walnut }}>{cap.label}</span>
            {cap.control === "toggle" || cap.control === "on" ? <Toggle progress={on} /> : null}
            {cap.control === "request" ? <Dropdown value="Request only" height={34} tone={C.salmon} /> : null}
            {cap.control === "restricted" ? <Dropdown value="Restricted" height={34} /> : null}
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 24,
          right: 24,
          top: EDIT.rowsTop + CAPABILITIES.length * EDIT.rowStep + 4,
          height: 44,
          padding: "0 16px",
          borderRadius: 14,
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "rgba(255, 252, 241, 0.08)",
          fontFamily: F.ui,
          fontSize: 15,
          color: C.paper,
          opacity: saved,
          transform: `translateY(${(1 - saved) * 12}px)`,
        }}
      >
        <StatusDot color={C.live} />
        Saved · live now
      </div>
      <div style={{ position: "absolute", left: 24, right: 24, bottom: 24, display: "flex", gap: 10 }}>
        <div style={{ flex: 1, transform: `scale(${1 - 0.04 * pulse(frame, SAVE_AT, 3, 8)})` }}>
          <Button tone="salmon" style={{ fontSize: 15 }}>
            Save changes
          </Button>
        </div>
        <Button tone="outline" style={{ width: 140, color: C.paper, border: "1px solid rgba(255, 252, 241, 0.2)", fontSize: 15 }}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

/* ─── The patient's side: what their agent may share, request, receive ────── */

type Grant = { label: string; icon: IconName; on?: boolean; ask?: boolean; toggleAt?: number };

const TABS: Grant[][] = [
  [
    { label: "Insurance card", icon: "card", on: true },
    { label: "Medication list", icon: "pill", toggleAt: MED_TOGGLE_AT },
    { label: "Full medical record", icon: "doc", ask: true },
  ],
  [
    { label: "Appointments", icon: "calendar", on: true },
    { label: "Referral status", icon: "link", on: true },
    { label: "Billing estimates", icon: "card", on: false },
  ],
  [
    { label: "Visit summaries", icon: "doc", on: true },
    { label: "Care instructions", icon: "list", on: true },
    { label: "Test results", icon: "activity", ask: true },
  ],
];

function PatientCard({ frame }: { frame: number }) {
  const tab = keys(frame, [TAB_AT[0] + 1, TAB_AT[0] + 13, TAB_AT[1] + 1, TAB_AT[1] + 13], [0, 1, 1, 2]);
  return (
    <div style={{ ...surface, position: "relative", height: PATIENT.h, borderRadius: 36 }}>
      <div style={{ position: "absolute", left: PATIENT.pad, right: PATIENT.pad, top: PATIENT.pad, height: 52, display: "flex", alignItems: "center", gap: 14 }}>
        <Avatar label="DR" size={52} />
        <div style={{ flex: 1, fontFamily: F.ui, fontWeight: 600, fontSize: 26, color: C.walnut }}>Daniel&rsquo;s Agent</div>
        <Chip tone="outline" size={1.25} icon={<Icon name="building" size={15} />}>
          {H.system}
        </Chip>
      </div>
      <div style={{ position: "absolute", left: PATIENT.pad, top: 112, width: PATIENT_TRACK.w }}>
        <Segmented options={["Share", "Request", "Receive"]} active={tab} height={PATIENT_TRACK.h} />
      </div>
      {TABS.map((grants, t) => {
        const show = clamp01(1 - Math.abs(tab - t) * 1.6);
        if (show <= 0) return null;
        const dir = t - tab;
        return (
          <div key={t} style={{ position: "absolute", left: PATIENT.pad, right: PATIENT.pad, top: P_ROW.top, opacity: show, transform: `translateX(${dir * 40}px)` }}>
            {grants.map((g, i) => {
              const on = g.toggleAt !== undefined ? ramp(frame, g.toggleAt + 1, 8, EASE_IN_OUT) : g.on ? 1 : 0;
              return (
                <div
                  key={g.label}
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: i * P_ROW.step,
                    height: P_ROW.h,
                    boxSizing: "border-box",
                    padding: "0 18px 0 14px",
                    borderRadius: 20,
                    background: C.beige,
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    ...(t === 0 ? fly(frame, { at: PATIENT_AT + 14 + i * 4, y: 14, dur: 16, blur: 0 }) : {}),
                  }}
                >
                  <Tile icon={g.icon} size={46} tone={C.paper} />
                  <span style={{ flex: 1, fontFamily: F.ui, fontWeight: 600, fontSize: 20, color: C.walnut }}>{g.label}</span>
                  {g.ask ? <Dropdown value="Ask me first" height={40} tone={C.paper} /> : <Toggle progress={on} size={1.3} />}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Audit trail: authorized, routed, answered, logged ────────────────────── */

const FLOW: { label: string; meta: string; icon: IconName }[] = [
  { label: "Request", meta: "Daniel’s agent", icon: "arrowUp" },
  { label: "Authorized", meta: "Patient + policy", icon: "shield" },
  { label: "Routed", meta: "Heart Failure Clinic", icon: "arrowRight" },
  { label: "Responded", meta: "Referral approved", icon: "check" },
];

type LogRow = { time: string; agent: string; action: string; dept: string; decision: Access | "blocked" };

const NEW_LOG: LogRow = { time: "10:42:07", agent: "Daniel Ruiz’s agent", action: "Referral status", dept: "Cardiology", decision: "allowed" };
const LOGS: LogRow[] = [
  { time: "10:41:58", agent: "Unverified agent", action: "Clinical records", dept: "Cardiology", decision: "blocked" },
  { time: "10:41:31", agent: "Priya Shah’s agent", action: "Appointment", dept: "Cardiology", decision: "allowed" },
  { time: "10:40:12", agent: "Maya Chen’s agent", action: "Billing estimate", dept: "Imaging", decision: "request" },
  { time: "10:39:47", agent: "Leo Park’s agent", action: "Visit summary", dept: "Pediatrics", decision: "allowed" },
];

const LOG = { top: 216, step: 48, h: 42 };
const FLOW_TOP = 96;

function AuditCard({ frame }: { frame: number }) {
  const insert = ramp(frame, LOG_INSERT_AT, 16, EASE_IN_OUT);
  const stepW = (AUDIT.w - AUDIT.pad * 2) / FLOW.length;
  const travel = ramp(frame, FLOW_AT, FLOW_STEP * 3, EASE_IN_OUT);
  const lineL = AUDIT.pad + stepW / 2;
  const lineW = stepW * (FLOW.length - 1);

  return (
    <div style={{ ...surface, position: "relative", height: AUDIT.h, borderRadius: 32, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: AUDIT.pad, right: AUDIT.pad, top: 26, height: 40, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontFamily: F.display, fontWeight: 500, fontSize: 32, letterSpacing: "-0.02em", color: C.walnut }}>Activity</div>
        <div style={{ display: "flex", gap: 8 }}>
          <Dropdown value="Cardiology" height={36} />
          <Dropdown value="Last hour" height={36} />
        </div>
      </div>

      <div style={{ position: "absolute", left: lineL, top: FLOW_TOP + 19, width: lineW, height: 2, background: C.line2 }} />
      <div style={{ position: "absolute", left: lineL, top: FLOW_TOP + 19, width: lineW * travel, height: 2, background: C.ink }} />
      {frame >= FLOW_AT && travel < 1 ? (
        <div style={{ position: "absolute", left: lineL + lineW * travel - 7, top: FLOW_TOP + 13, width: 14, height: 14, borderRadius: 99, background: C.ink, boxShadow: "0 0 0 5px rgba(252, 207, 184, 0.75)" }} />
      ) : null}
      {FLOW.map((step, i) => {
        const lit = ramp(frame, FLOW_AT + i * FLOW_STEP, 8);
        const pop = pulse(frame, FLOW_AT + i * FLOW_STEP, 4, 14);
        return (
          <div key={step.label} style={{ position: "absolute", left: AUDIT.pad + i * stepW, top: FLOW_TOP, width: stepW, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 999, boxSizing: "border-box", border: `1.5px solid ${lit > 0.5 ? C.ink : C.line2}`, background: mix(C.paper, C.ink, lit), display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.15 * pop})` }}>
              <Icon name={step.icon} size={17} color={lit > 0.5 ? C.paper : C.faint} stroke={2.2} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, opacity: lerp(0.45, 1, lit) }}>
              <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 16, color: C.walnut }}>{step.label}</div>
              <div style={{ fontFamily: F.body, fontSize: 13, color: C.muted, whiteSpace: "nowrap" }}>{step.meta}</div>
            </div>
          </div>
        );
      })}

      {[NEW_LOG, ...LOGS].map((row, i) => {
        const isNew = i === 0;
        const top = LOG.top + (isNew ? 0 : (i - 1 + insert) * LOG.step);
        const o = isNew ? insert : 1;
        return (
          <div
            key={row.time}
            style={{
              position: "absolute",
              left: AUDIT.pad,
              right: AUDIT.pad,
              top,
              height: LOG.h,
              boxSizing: "border-box",
              padding: "0 10px 0 16px",
              borderRadius: 14,
              background: isNew ? mix(C.beige, "#F7DCCB", pulse(frame, LOG_INSERT_AT + 10, 6, 30)) : C.beige,
              display: "flex",
              alignItems: "center",
              fontFamily: F.ui,
              fontWeight: 500,
              fontSize: 15,
              color: C.walnut,
              opacity: o,
              transform: isNew ? `translateY(${(1 - insert) * -12}px)` : undefined,
            }}
          >
            <span style={{ width: 92, color: C.muted, fontVariantNumeric: "tabular-nums" }}>{row.time}</span>
            <span style={{ width: 210, fontWeight: 600 }}>{row.agent}</span>
            <span style={{ width: 160 }}>{row.action}</span>
            <span style={{ flex: 1, color: C.muted }}>{row.dept}</span>
            {row.decision === "blocked" ? (
              <Chip tone="ink" icon={<Icon name="x" size={11} color={C.paper} stroke={2.4} />}>
                Blocked
              </Chip>
            ) : (
              <AccessPill level={row.decision} />
            )}
          </div>
        );
      })}
    </div>
  );
}
