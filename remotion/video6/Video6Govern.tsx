import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";

import { DotTide, Stage } from "../video1/backdrops";
import { Bubble, IPhone, Slot, TimeStamp, TypingBubble } from "../video1/imessage";
import { EASE_IN_OUT, EASE_OUT, camera, keys, lerp, pulse, ramp, type CameraKey } from "../video1/motion";
import { C, F } from "../video1/theme";
import { AppShell, Chip, ClickRing, Cursor, ShadowsContext, Toggle } from "../video1/ui";
import { BUTTER, Display, Ico, Menu, PANEL, PEACH_TILE, Pill, SAGE, SAGE_TEXT, SAGE_TILE, SAND_TILE, SHELL, SOFT, SUB, Segmented, SelectBox, Status, Swap, Tile, arc, clamp01, fmt, onPage, press, rise, track, type IcoName } from "./kit";

export const VIDEO6_GOVERN_FRAMES = 900;

export function Video6Govern() {
  return (
    <ShadowsContext.Provider value={false}>
      <Audio src={staticFile("video1/BED.m4a")} startFrom={1230} volume={0.2} />
      <Stage backdrop={<DotTide reach={460} />}>
        <GovernWorld />
      </Stage>
    </ShadowsContext.Provider>
  );
}

/* ─── Policy data ─────────────────────────────────────────────────────────── */

type State = "on" | "review" | "off" | "lock";
const ACTIONS: { label: string; icon: IcoName }[] = [
  { label: "Find care", icon: "search" },
  { label: "Appointments", icon: "calendar" },
  { label: "Referral status", icon: "sync" },
  { label: "Clinical records", icon: "doc" },
  { label: "Billing", icon: "card" },
];
const DEPTS: { name: string; meta: string; tile: string; icon: IcoName; cells: State[] }[] = [
  { name: "Emergency", meta: "4 locations", tile: C.salmon, icon: "alert", cells: ["on", "off", "off", "lock", "review"] },
  { name: "Cardiology", meta: "9 programs", tile: PEACH_TILE, icon: "heart", cells: ["on", "off", "off", "lock", "review"] },
  { name: "Oncology", meta: "7 programs", tile: SAND_TILE, icon: "shield", cells: ["on", "review", "on", "lock", "review"] },
  { name: "Pediatrics", meta: "14 specialties", tile: SAGE_TILE, icon: "user", cells: ["on", "on", "on", "lock", "on"] },
  { name: "Imaging", meta: "MRI, CT, echo", tile: SAND_TILE, icon: "scan", cells: ["on", "on", "review", "lock", "on"] },
  { name: "Orthopedics", meta: "5 programs", tile: SAGE_TILE, icon: "activity", cells: ["on", "on", "on", "lock", "review"] },
  { name: "Behavioral health", meta: "3 programs", tile: PEACH_TILE, icon: "chat", cells: ["review", "off", "off", "lock", "off"] },
  { name: "Primary care", meta: "12 clinics", tile: SAND_TILE, icon: "building", cells: ["on", "on", "on", "review", "on"] },
];
const CARDIO = 1;

/* ─── Geometry (page coordinates unless noted) ────────────────────────────── */

const SCOPES = ["Hospital", "Department", "Specialty", "Service", "Action"];
const SCOPE = { x: 28, y: 104, w: 640, h: 44 };
const MATRIX = { x: 28, y: 168, w: 1308, h: 680, pad: 8, head: 48, rowH: 72, gap: 4, nameW: 372 };
const CELL_W = (MATRIX.w - MATRIX.pad * 2 - MATRIX.nameW) / ACTIONS.length;
const mRowY = (r: number) => MATRIX.y + MATRIX.pad + MATRIX.head + r * (MATRIX.rowH + MATRIX.gap);
const ROW_RECT = { x: MATRIX.x + MATRIX.pad, y: mRowY(CARDIO), w: MATRIX.w - MATRIX.pad * 2, h: MATRIX.rowH };
const PANEL_RECT = { x: 676, y: 104, w: 660, h: 744 };
const P = { pad: 24, rowsY: 152, rowH: 72, rowGap: 8 };
const pRowY = (i: number) => PANEL_RECT.y + P.pad + P.rowsY + i * (P.rowH + P.rowGap);
const TOGGLE_X = PANEL_RECT.x + PANEL_RECT.w - P.pad - 16 - 25;
const RECORDS_SELECT = { w: 230, h: 42, x: PANEL_RECT.x + PANEL_RECT.w - P.pad - 16 - 230, y: pRowY(3) + (P.rowH - 42) / 2 };
const RECORDS_MENU = { x: RECORDS_SELECT.x, y: RECORDS_SELECT.y + RECORDS_SELECT.h + 8, rowH: 42 };
const SAVE_BTN = { w: 200, h: 52, x: PANEL_RECT.x + PANEL_RECT.w - P.pad - 200, y: PANEL_RECT.y + PANEL_RECT.h - P.pad - 52 };

const PHONE = { w: 393, h: 852, x: 2060, y: 114 };
const THREAD = { left: PHONE.x + 19, bottom: PHONE.y + PHONE.h - 99 };
const AUTH = { w: 300, h: 382, pad: 12 };
const AUTH_TOP = THREAD.bottom - AUTH.h;
const authWorld = (x: number, y: number) => ({ x: THREAD.left + x, y: AUTH_TOP + y });

const ACTIVITY = { x: 872, y: 104, w: 464, h: 744, pad: 8, rowsTop: 58, rowH: 64, gap: 6 };
const LAND = onPage(ACTIVITY.x + ACTIVITY.pad + 12, ACTIVITY.y + ACTIVITY.rowsTop + 15);

/* ─── Timeline ────────────────────────────────────────────────────────────── */

const SCOPE_CLICK = 30;
const CELLS_AT = 44;
const ROW_CLICK = 240;
const MORPH = { open: 250, close: 402, dur: 22 };
const APPT_CLICK = 292;
const REFERRAL_CLICK = 318;
const RECORDS_CLICK = 342;
const RESTRICTED_CLICK = 368;
const SAVE_CLICK = 390;
const FLIPS = [428, 436];
const TO_PHONE = { from: 448, to: 494 };
const PAGE_SWAP = TO_PHONE.from + 20;
const PHONE_STAMP = 452;
const PHONE_TYPING = 470;
const PHONE_ASK = 488;
const AUTH_AT = 506;
const LAB_CLICK = 540;
const ALLOW_CLICK = 562;
const FLY = { at: 578, dur: 40 };
const TO_ACTIVITY = { from: 574, to: 622 };
const LAND_AT = FLY.at + FLY.dur;
const STEP_AT = LAND_AT + 14;
const STEP_GAP = 15;
const REVEAL = { from: 712, to: 800 };

/* ─── Camera ──────────────────────────────────────────────────────────────── */

const SCOPE_WORLD = onPage(SCOPE.x + 3 + 1.5 * ((SCOPE.w - 6) / 5), SCOPE.y + SCOPE.h / 2);
const CARDIO_NAME = onPage(ROW_RECT.x + 130, ROW_RECT.y + ROW_RECT.h / 2);
const appt = onPage(TOGGLE_X, pRowY(1) + P.rowH / 2);
const referral = onPage(TOGGLE_X, pRowY(2) + P.rowH / 2);
const records = onPage(RECORDS_SELECT.x + RECORDS_SELECT.w / 2, RECORDS_SELECT.y + RECORDS_SELECT.h / 2);
const restricted = onPage(RECORDS_MENU.x + 100, RECORDS_MENU.y + 6 + RECORDS_MENU.rowH / 2);
const save = onPage(SAVE_BTN.x + SAVE_BTN.w / 2, SAVE_BTN.y + SAVE_BTN.h / 2);
const LAB = authWorld(AUTH.w - AUTH.pad - 18, 288 + 17);
const ALLOW = authWorld(AUTH.w / 2, 330 + 20);
const REFERRAL_ROW = authWorld(AUTH.pad, 230);

const ACCESS_CAMS: CameraKey[] = [
  { f: 0, x: SCOPE_WORLD.x + 40, y: SCOPE_WORLD.y + 40, s: 2.1 },
  { f: SCOPE_CLICK + 6, x: SCOPE_WORLD.x + 30, y: SCOPE_WORLD.y + 50, s: 2.0 },
  { f: 128, x: 960, y: 540, s: 1.0 },
  { f: 200, x: 900, y: 520, s: 1.06 },
  { f: ROW_CLICK - 4, x: 820, y: 470, s: 1.2 },
  { f: APPT_CLICK - 14, x: 1240, y: 460, s: 1.3 },
  { f: REFERRAL_CLICK + 6, x: 1250, y: 500, s: 1.42 },
  { f: RESTRICTED_CLICK - 6, x: 1230, y: 610, s: 1.48 },
  { f: SAVE_CLICK, x: 1250, y: 720, s: 1.38 },
  { f: MORPH.close + 10, x: 980, y: 470, s: 1.3 },
  { f: TO_PHONE.from, x: 1000, y: 460, s: 1.34 },
];
const PHONE_CAM = { x: THREAD.left + AUTH.w / 2 + 20, y: AUTH_TOP + 150, s: 1.78 };
const ACTIVITY_CAM = { x: onPage(ACTIVITY.x + ACTIVITY.w / 2, 0).x - 40, y: onPage(0, ACTIVITY.y + 220).y, s: 1.55 };

function worldCamera(f: number): CSSProperties {
  if (f < TO_PHONE.from) return camera(f, ACCESS_CAMS);
  if (f < TO_PHONE.to) return arc(f, ACCESS_CAMS[ACCESS_CAMS.length - 1], PHONE_CAM, TO_PHONE, 0.42);
  if (f < TO_ACTIVITY.from) return camera(f, [{ f: TO_PHONE.to, ...PHONE_CAM }, { f: TO_ACTIVITY.from, x: PHONE_CAM.x, y: PHONE_CAM.y + 30, s: 1.84 }]);
  if (f < TO_ACTIVITY.to) return arc(f, { x: PHONE_CAM.x, y: PHONE_CAM.y + 30, s: 1.84 }, ACTIVITY_CAM, TO_ACTIVITY, 0.45);
  return camera(f, [
    { f: TO_ACTIVITY.to, ...ACTIVITY_CAM },
    { f: REVEAL.from, x: ACTIVITY_CAM.x, y: ACTIVITY_CAM.y + 70, s: 1.5 },
    { f: REVEAL.to, x: 960, y: 540, s: 1.0 },
    { f: VIDEO6_GOVERN_FRAMES, x: 960, y: 540, s: 0.97 },
  ]);
}

/* ─── World ───────────────────────────────────────────────────────────────── */

function GovernWorld() {
  const frame = useCurrentFrame();
  const swap = ramp(frame, PAGE_SWAP, 16, EASE_IN_OUT);
  const cur = track(frame, [
    { f: 0, x: SCOPE_WORLD.x + 260, y: SCOPE_WORLD.y + 220 },
    { f: SCOPE_CLICK - 4, x: SCOPE_WORLD.x, y: SCOPE_WORLD.y + 2 },
    { f: 70, x: SCOPE_WORLD.x + 200, y: SCOPE_WORLD.y + 420 },
    { f: ROW_CLICK - 4, x: CARDIO_NAME.x, y: CARDIO_NAME.y + 2 },
    { f: APPT_CLICK - 4, x: appt.x + 2, y: appt.y + 3 },
    { f: REFERRAL_CLICK - 4, x: referral.x + 2, y: referral.y + 3 },
    { f: RECORDS_CLICK - 4, x: records.x, y: records.y + 2 },
    { f: RECORDS_CLICK + 12, x: records.x - 10, y: records.y + 60 },
    { f: RESTRICTED_CLICK - 4, x: restricted.x, y: restricted.y + 2 },
    { f: SAVE_CLICK - 4, x: save.x, y: save.y + 2 },
    { f: SAVE_CLICK + 40, x: save.x - 160, y: save.y + 120 },
  ]);
  const tap = track(frame, [
    { f: AUTH_AT + 16, x: LAB.x + 60, y: LAB.y + 160 },
    { f: LAB_CLICK - 4, x: LAB.x + 2, y: LAB.y + 3 },
    { f: ALLOW_CLICK - 4, x: ALLOW.x + 4, y: ALLOW.y + 4 },
    { f: ALLOW_CLICK + 20, x: ALLOW.x + 40, y: ALLOW.y + 90 },
  ]);
  const clicks = [SCOPE_CLICK, ROW_CLICK, APPT_CLICK, REFERRAL_CLICK, RECORDS_CLICK, RESTRICTED_CLICK, SAVE_CLICK];
  const clickAt = [SCOPE_WORLD, CARDIO_NAME, appt, referral, records, restricted, save];

  return (
    <AbsoluteFill>
      <div style={worldCamera(frame)}>
        <div style={{ position: "absolute", left: SHELL.x, top: SHELL.y, ...rise(frame, 0, { y: 30, dur: 26 }) }}>
          <AppShell active={swap > 0.5 ? 1 : 4} railReveal={(i) => ramp(frame, 6 + i * 2, 12)}>
            {swap < 1 ? (
              <div style={{ position: "absolute", inset: 0, opacity: 1 - swap }}>
                <AccessPage frame={frame} />
              </div>
            ) : null}
            {swap > 0 ? (
              <div style={{ position: "absolute", inset: 0, opacity: swap }}>
                <OverviewPage frame={frame} />
              </div>
            ) : null}
          </AppShell>
        </div>

        <div style={{ position: "absolute", left: PHONE.x, top: PHONE.y }}>
          <IPhone frame={frame} width={PHONE.w} height={PHONE.h} contact="Agent" draft="" composing={false} sendPress={0}>
            <Slot frame={frame} at={PHONE_STAMP} side="center">
              <TimeStamp day="Today" time="2:12 PM" />
            </Slot>
            <Slot frame={frame} at={PHONE_TYPING} until={PHONE_ASK} side="in" dur={12}>
              <TypingBubble frame={frame} />
            </Slot>
            <Slot frame={frame} at={PHONE_ASK} side="in" dur={18}>
              <Bubble>Bayview Cardiology works with agents now. What can I share with them?</Bubble>
            </Slot>
            <Slot frame={frame} at={AUTH_AT} side="in" dur={20}>
              <AuthCard frame={frame} />
            </Slot>
          </IPhone>
        </div>

        <RequestFlight frame={frame} />

        {clicks.map((at, i) => (
          <ClickRing key={at} x={clickAt[i].x} y={clickAt[i].y} progress={ramp(frame, at - 1, 14)} />
        ))}
        <div style={{ opacity: ramp(frame, 4, 10) * (1 - ramp(frame, SAVE_CLICK + 34, 10)) }}>
          <Cursor x={cur.x} y={cur.y} pressed={press(frame, clicks)} />
        </div>
        <ClickRing x={LAB.x} y={LAB.y} progress={ramp(frame, LAB_CLICK - 1, 14)} />
        <ClickRing x={ALLOW.x} y={ALLOW.y} progress={ramp(frame, ALLOW_CLICK - 1, 14)} />
        <div style={{ opacity: ramp(frame, AUTH_AT + 16, 8) * (1 - ramp(frame, ALLOW_CLICK + 14, 8)) }}>
          <Cursor x={tap.x} y={tap.y} size={24} pressed={press(frame, [LAB_CLICK, ALLOW_CLICK])} />
        </div>
      </div>
    </AbsoluteFill>
  );
}

/* ─── Agent access: a policy matrix, one row opened into its panel ────────── */

function AccessPage({ frame }: { frame: number }) {
  const scope = keys(frame, [SCOPE_CLICK + 1, SCOPE_CLICK + 12], [0, 1]);
  const m = ramp(frame, MORPH.open, MORPH.dur, EASE_IN_OUT) * (1 - ramp(frame, MORPH.close, MORPH.dur, EASE_IN_OUT));
  return (
    <>
      <div style={{ position: "absolute", left: 28, top: 28, ...rise(frame, 4) }}>
        <Display size={46}>Agent access</Display>
      </div>
      <div style={{ position: "absolute", right: 28, top: 34, display: "flex", gap: 8, ...rise(frame, 8) }}>
        <Pill tone="beige" trailing="chevronDown">
          Bayview Health
        </Pill>
        <Pill tone="ink" icon="clock">
          Policy log
        </Pill>
      </div>
      <div style={{ position: "absolute", left: SCOPE.x, top: SCOPE.y, ...rise(frame, 6) }}>
        <Segmented items={SCOPES} value={scope} width={SCOPE.w} height={SCOPE.h} />
      </div>
      <div style={{ position: "absolute", left: SCOPE.x + SCOPE.w + 16, top: SCOPE.y + 8, display: "flex", gap: 6, ...rise(frame, 10) }}>
        {(
          [
            ["on", "Allowed"],
            ["review", "Review"],
            ["lock", "Restricted"],
          ] as [State, string][]
        ).map(([s, l]) => (
          <StatePill key={s} state={s} label={l} />
        ))}
      </div>

      <div style={{ position: "absolute", left: MATRIX.x, top: MATRIX.y, width: MATRIX.w, height: MATRIX.h, borderRadius: 24, background: PANEL, ...rise(frame, 10, { y: 24, dur: 26 }) }}>
        <div style={{ position: "absolute", left: MATRIX.pad + MATRIX.nameW, top: MATRIX.pad, height: MATRIX.head, display: "flex" }}>
          {ACTIONS.map((a, c) => (
            <div key={a.label} style={{ width: CELL_W, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: F.ui, fontWeight: 600, fontSize: 14, color: C.walnut, ...rise(frame, 18 + c * 3, { y: 8, dur: 16 }) }}>
              <Ico name={a.icon} size={16} />
              {a.label}
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: MATRIX.pad + 14, top: MATRIX.pad, height: MATRIX.head, display: "flex", alignItems: "center", fontFamily: F.ui, fontWeight: 600, fontSize: 14, color: SUB }}>Department</div>
      </div>
      {DEPTS.map((d, r) => (
        <MatrixRow key={d.name} frame={frame} dept={d} r={r} hidden={r === CARDIO && m > 0} />
      ))}
      {m > 0 ? <CardiologyPanel frame={frame} m={m} /> : null}
    </>
  );
}

function cellState(r: number, c: number, frame: number): { from: State; to: State; t: number } {
  const base = DEPTS[r].cells[c];
  if (r === CARDIO && c === 1) return { from: base, to: "on", t: ramp(frame, FLIPS[0], 10) };
  if (r === CARDIO && c === 2) return { from: base, to: "on", t: ramp(frame, FLIPS[1], 10) };
  return { from: base, to: base, t: 0 };
}

function MatrixRow({ frame, dept, r, hidden }: { frame: number; dept: (typeof DEPTS)[number]; r: number; hidden: boolean }) {
  return (
    <div style={{ position: "absolute", left: ROW_RECT.x, top: mRowY(r), width: ROW_RECT.w, height: MATRIX.rowH, borderRadius: 18, background: C.paper, opacity: hidden ? 0 : 1, ...(hidden ? {} : rise(frame, 20 + r * 3, { y: 14, dur: 20 })) }}>
      <RowHead dept={dept} />
      <div style={{ position: "absolute", left: MATRIX.nameW, top: 0, height: MATRIX.rowH, display: "flex" }}>
        {ACTIONS.map((a, c) => {
          const s = cellState(r, c, frame);
          return (
            <div key={a.label} style={{ width: CELL_W, display: "flex", alignItems: "center", justifyContent: "center", ...rise(frame, CELLS_AT + (r + c) * 3, { y: 8, scale: 0.85, dur: 14 }) }}>
              {s.t > 0 ? <Swap t={s.t} from={<StatePill state={s.from} />} to={<StatePill state={s.to} />} pop={pulse(frame, (c === 1 ? FLIPS[0] : FLIPS[1]) + 6, 4, 10)} /> : <StatePill state={s.from} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RowHead({ dept }: { dept: (typeof DEPTS)[number] }) {
  return (
    <div style={{ position: "absolute", left: 14, top: 0, height: MATRIX.rowH, display: "flex", alignItems: "center", gap: 14 }}>
      <Tile color={dept.tile} icon={dept.icon} size={42} />
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 16, color: C.walnut }}>{dept.name}</span>
        <span style={{ fontFamily: F.body, fontSize: 12, color: SUB }}>{dept.meta}</span>
      </div>
    </div>
  );
}

const STATE_STYLE: Record<State, { bg: string; color: string; icon?: IcoName; label: string }> = {
  on: { bg: SAGE, color: SAGE_TEXT, icon: "check", label: "Allowed" },
  review: { bg: BUTTER, color: C.walnut, icon: "eye", label: "Review" },
  off: { bg: "transparent", color: SUB, label: "Off" },
  lock: { bg: SOFT, color: C.walnut, icon: "lock", label: "Restricted" },
};

function StatePill({ state, label }: { state: State; label?: string }) {
  const s = STATE_STYLE[state];
  return (
    <div style={{ height: 30, padding: `0 12px 0 ${s.icon ? 9 : 12}px`, display: "inline-flex", alignItems: "center", gap: 6, borderRadius: 999, boxSizing: "border-box", background: s.bg, border: state === "off" ? "1.5px dashed rgba(40, 25, 16, 0.22)" : undefined, fontFamily: F.ui, fontWeight: 600, fontSize: 13, color: s.color, whiteSpace: "nowrap" }}>
      {s.icon ? <Ico name={s.icon} size={13} color={s.color} stroke={2.4} /> : null}
      {label ?? s.label}
    </div>
  );
}

const PANEL_ROWS: { label: string; icon: IcoName }[] = [
  { label: "Find care", icon: "search" },
  { label: "Appointment coordination", icon: "calendar" },
  { label: "Referral status requests", icon: "sync" },
  { label: "Clinical records", icon: "doc" },
  { label: "Billing questions", icon: "card" },
];
const RECORD_OPTIONS = [{ label: "Restricted", icon: "lock" as IcoName }, { label: "With patient consent", icon: "user" as IcoName }, { label: "Allowed", icon: "check" as IcoName }];

function CardiologyPanel({ frame, m }: { frame: number; m: number }) {
  const rect = { x: lerp(ROW_RECT.x, PANEL_RECT.x, m), y: lerp(ROW_RECT.y, PANEL_RECT.y, m), w: lerp(ROW_RECT.w, PANEL_RECT.w, m), h: lerp(ROW_RECT.h, PANEL_RECT.h, m) };
  const content = EASE_IN_OUT(clamp01((m - 0.72) / 0.28));
  const head = 1 - content;
  const apptOn = ramp(frame, APPT_CLICK + 1, 10, EASE_IN_OUT);
  const refOn = ramp(frame, REFERRAL_CLICK + 1, 10, EASE_IN_OUT);
  const menuOpen = ramp(frame, RECORDS_CLICK + 2, 10) * (1 - ramp(frame, RESTRICTED_CLICK + 2, 8));
  const hover = keys(frame, [RECORDS_CLICK + 10, RECORDS_CLICK + 16, RESTRICTED_CLICK - 6], [0, 1, 0]);
  const saved = ramp(frame, SAVE_CLICK + 2, 10);
  return (
    <div style={{ position: "absolute", left: rect.x, top: rect.y, width: rect.w, height: rect.h, borderRadius: lerp(18, 24, m), background: C.paper, border: `1px solid ${C.line}`, boxSizing: "border-box", overflow: "visible" }}>
      {head > 0 ? (
        <div style={{ position: "absolute", inset: 0, opacity: head, overflow: "hidden", borderRadius: 18 }}>
          <RowHead dept={DEPTS[CARDIO]} />
        </div>
      ) : null}
      {content > 0 ? (
        <div style={{ position: "absolute", left: 0, top: 0, width: PANEL_RECT.w, height: PANEL_RECT.h, opacity: content }}>
          <div style={{ position: "absolute", left: P.pad, top: P.pad, right: P.pad, display: "flex", alignItems: "center", gap: 14 }}>
            <Tile color={PEACH_TILE} icon="heart" size={52} />
            <Display size={34}>Cardiology</Display>
            <Chip tone="sand" size={1.15}>
              9 programs
            </Chip>
            <div style={{ flex: 1 }} />
            <div style={{ width: 38, height: 38, borderRadius: 12, background: C.beige, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Ico name="x" size={16} />
            </div>
          </div>
          <div style={{ position: "absolute", left: P.pad, top: P.pad + 84 }}>
            <Segmented items={["Actions", "Services", "Locations"]} value={0} width={360} />
          </div>
          {PANEL_ROWS.map((row, i) => (
            <div key={row.label} style={{ position: "absolute", left: P.pad, right: P.pad, top: pRowY(i) - PANEL_RECT.y, height: P.rowH, borderRadius: 18, background: C.beige, display: "flex", alignItems: "center", gap: 14, padding: "0 16px", boxSizing: "border-box" }}>
              <Tile color={C.paper} icon={row.icon} size={40} />
              <span style={{ flex: 1, fontFamily: F.ui, fontWeight: 600, fontSize: 16, color: C.walnut }}>{row.label}</span>
              {i === 0 ? <Toggle size={1.4} progress={1} /> : null}
              {i === 1 ? <Toggle size={1.4} progress={apptOn} /> : null}
              {i === 2 ? <Toggle size={1.4} progress={refOn} /> : null}
              {i === 3 ? (
                <SelectBox
                  value={
                    <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Ico name="lock" size={15} />
                      Restricted
                    </span>
                  }
                  focused={frame >= RECORDS_CLICK && frame < RESTRICTED_CLICK + 4}
                  style={{ width: RECORDS_SELECT.w, background: C.paper }}
                />
              ) : null}
              {i === 4 ? <StatePill state="review" /> : null}
            </div>
          ))}
          <div style={{ position: "absolute", left: SAVE_BTN.x - PANEL_RECT.x - 128, top: SAVE_BTN.y - PANEL_RECT.y, width: 116, height: SAVE_BTN.h, borderRadius: 999, border: `1px solid ${C.line2}`, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.ui, fontWeight: 600, fontSize: 16, color: C.walnut }}>Cancel</div>
          <div style={{ position: "absolute", left: SAVE_BTN.x - PANEL_RECT.x, top: SAVE_BTN.y - PANEL_RECT.y, width: SAVE_BTN.w, height: SAVE_BTN.h, transform: `scale(${1 - 0.05 * pulse(frame, SAVE_CLICK - 2, 3, 8)})` }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 999, background: C.ink, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.ui, fontWeight: 600, fontSize: 16, color: C.paper, opacity: 1 - saved }}>Save policy</div>
            <div style={{ position: "absolute", inset: 0, borderRadius: 999, background: SAGE, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: F.ui, fontWeight: 600, fontSize: 16, color: SAGE_TEXT, opacity: saved }}>
              <Ico name="check" size={16} color={SAGE_TEXT} stroke={2.6} />
              Saved
            </div>
          </div>
          <Menu items={RECORD_OPTIONS} open={menuOpen} hover={hover} selected={0} width={RECORDS_SELECT.w} style={{ left: RECORDS_MENU.x - PANEL_RECT.x, top: RECORDS_MENU.y - PANEL_RECT.y }} />
        </div>
      ) : null}
    </div>
  );
}

/* ─── The patient's side: what their agent may share, request, receive ───── */

const AUTH_ROWS: { label: string; y: number; on: boolean; group?: string }[] = [
  { label: "Medications", y: 70, on: true, group: "Share" },
  { label: "Insurance", y: 104, on: true },
  { label: "Visit notes", y: 138, on: false },
  { label: "Appointments", y: 196, on: true, group: "Request" },
  { label: "Referral status", y: 230, on: true },
  { label: "Lab results", y: 288, on: false, group: "Receive" },
];

function AuthCard({ frame }: { frame: number }) {
  const allowed = ramp(frame, ALLOW_CLICK + 2, 10);
  return (
    <div style={{ position: "relative", width: AUTH.w, height: AUTH.h, boxSizing: "border-box", borderRadius: 22, background: C.beige, fontFamily: F.ui }}>
      <div style={{ position: "absolute", left: AUTH.pad, top: AUTH.pad, height: 28, display: "flex", alignItems: "center", gap: 8 }}>
        <Tile color={PEACH_TILE} icon="heart" size={28} radius={9} />
        <span style={{ fontWeight: 600, fontSize: 14, color: C.walnut }}>Bayview Cardiology</span>
      </div>
      {AUTH_ROWS.map((row) => {
        const on = row.label === "Lab results" ? ramp(frame, LAB_CLICK + 1, 10, EASE_IN_OUT) : row.on ? 1 : 0;
        return (
          <div key={row.label}>
            {row.group ? <div style={{ position: "absolute", left: AUTH.pad + 4, top: row.y - 20, fontSize: 12, fontWeight: 600, color: SUB }}>{row.group}</div> : null}
            <div style={{ position: "absolute", left: AUTH.pad, right: AUTH.pad, top: row.y, height: 30, borderRadius: 10, background: C.paper, display: "flex", alignItems: "center", padding: "0 8px 0 12px" }}>
              <span style={{ flex: 1, fontWeight: 500, fontSize: 13, color: C.walnut }}>{row.label}</span>
              <Toggle progress={on} />
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: AUTH.pad, right: AUTH.pad, top: 330, height: 40, transform: `scale(${1 - 0.04 * pulse(frame, ALLOW_CLICK - 2, 3, 8)})` }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 999, background: C.ink, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 14, color: C.paper, opacity: 1 - allowed }}>Allow</div>
        <div style={{ position: "absolute", inset: 0, borderRadius: 999, background: C.live, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontWeight: 600, fontSize: 14, color: "#FFF", opacity: allowed }}>
          <Ico name="check" size={15} color="#FFF" stroke={2.8} />
          Allowed
        </div>
      </div>
    </div>
  );
}

/** The agent's first request lifts off the patient's card and lands in the hospital's activity feed. */
function RequestFlight({ frame }: { frame: number }) {
  const u = ramp(frame, FLY.at, FLY.dur, EASE_IN_OUT);
  if (u <= 0 || frame >= LAND_AT + 4) return null;
  const x = lerp(REFERRAL_ROW.x, LAND.x, u);
  const y = lerp(REFERRAL_ROW.y, LAND.y, u) - 220 * Math.sin(Math.PI * u);
  const fade = 1 - ramp(frame, LAND_AT, 4);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: ramp(frame, FLY.at, 5) * fade, transform: `scale(${lerp(1, 1.1, Math.sin(Math.PI * u))})`, transformOrigin: "0 50%" }}>
      <RequestPill />
    </div>
  );
}

function RequestPill() {
  return (
    <div style={{ height: 34, padding: "0 14px 0 10px", borderRadius: 999, background: C.ink, display: "inline-flex", alignItems: "center", gap: 8, fontFamily: F.ui, fontWeight: 600, fontSize: 14, color: C.paper, whiteSpace: "nowrap" }}>
      <Ico name="sync" size={15} color={C.paper} stroke={2.2} />
      Referral status
    </div>
  );
}

/* ─── Overview: the enterprise dashboard the activity feed lives in ───────── */

const STATS: { label: string; value: number; fmt: (v: number) => string; tile: string }[] = [
  { label: "Agent requests today", value: 12480, fmt: (v) => fmt(v), tile: PANEL },
  { label: "Authorized", value: 98.6, fmt: (v) => `${v.toFixed(1)}%`, tile: "#DCE5D0" },
  { label: "Blocked by policy", value: 172, fmt: (v) => fmt(v), tile: PANEL },
  { label: "Median response", value: 1.6, fmt: (v) => `${v.toFixed(1)}s`, tile: PANEL },
];
const BARS: { name: string; value: number }[] = [
  { name: "Emergency", value: 3210 },
  { name: "Cardiology", value: 2480 },
  { name: "Primary care", value: 2120 },
  { name: "Pediatrics", value: 1640 },
  { name: "Imaging", value: 1290 },
  { name: "Orthopedics", value: 880 },
  { name: "Oncology", value: 610 },
  { name: "Behavioral health", value: 250 },
];
const LEFT = { x: 28, w: 820 };
const STAT = { y: 104, h: 132, gap: 12 };
const CHART = { y: 248, h: 600 };

function OverviewPage({ frame }: { frame: number }) {
  const count = ramp(frame, REVEAL.from - 10, 60, EASE_OUT);
  return (
    <>
      <div style={{ position: "absolute", left: 28, top: 28 }}>
        <Display size={46}>Overview</Display>
      </div>
      <div style={{ position: "absolute", right: 28, top: 34, display: "flex", gap: 8 }}>
        <Segmented items={["Today", "7 days", "30 days"]} value={0} width={270} />
        <Pill tone="beige" trailing="chevronDown">
          All locations
        </Pill>
      </div>
      <div style={{ position: "absolute", left: LEFT.x, top: STAT.y, width: LEFT.w, height: STAT.h, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: STAT.gap }}>
        {STATS.map((s, i) => (
          <div key={s.label} style={{ borderRadius: 22, background: s.tile, padding: "18px 20px", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "space-between", ...rise(frame, REVEAL.from + i * 4, { y: 14, dur: 20 }) }}>
            <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 13, color: SUB }}>{s.label}</span>
            <span style={{ fontFamily: F.display, fontWeight: 500, fontSize: 42, lineHeight: "46px", letterSpacing: "-0.02em", color: C.ink, fontVariantNumeric: "tabular-nums" }}>{s.fmt(s.value * count)}</span>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: LEFT.x, top: CHART.y, width: LEFT.w, height: CHART.h, boxSizing: "border-box", padding: "16px 24px 24px", borderRadius: 24, background: PANEL }}>
        <div style={{ height: 44, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: F.display, fontWeight: 500, fontSize: 24, letterSpacing: "-0.015em", color: C.walnut }}>Requests by department</span>
          <Segmented items={["All actions", "Appointments", "Records"]} value={0} width={380} height={34} tone="soft" />
        </div>
        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 12 }}>
          {BARS.map((b, i) => {
            const g = ramp(frame, TO_ACTIVITY.to - 10 + i * 5, 40, EASE_OUT);
            const hot = b.name === "Cardiology";
            return (
              <div key={b.name} style={{ height: 52, display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ width: 150, fontFamily: F.ui, fontWeight: 600, fontSize: 15, color: C.walnut, whiteSpace: "nowrap" }}>{b.name}</span>
                <div style={{ flex: 1, height: 40, borderRadius: 14, background: "#EFE8D9", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${(b.value / 3210) * 100 * g}%`, borderRadius: 14, background: hot ? "#E8A585" : C.sand3 }} />
                </div>
                <span style={{ width: 64, textAlign: "right", fontFamily: F.ui, fontWeight: 600, fontSize: 15, color: C.walnut, fontVariantNumeric: "tabular-nums" }}>{fmt(b.value * g)}</span>
              </div>
            );
          })}
        </div>
      </div>
      <ActivityPanel frame={frame} />
    </>
  );
}

const OLDER: { what: string; who: string; dept: string; when: string; tone: "sage" | "salmon" | "soft"; status: string; icon: IcoName; tile: string }[] = [
  { what: "Find care", who: "Ruth\u2019s Agent", dept: "Pediatrics", when: "1m", tone: "sage", status: "Answered", icon: "search", tile: SAGE_TILE },
  { what: "Appointment", who: "Ken\u2019s Agent", dept: "Imaging", when: "2m", tone: "sage", status: "Booked", icon: "calendar", tile: SAND_TILE },
  { what: "Clinical records", who: "Lia\u2019s Agent", dept: "Oncology", when: "4m", tone: "salmon", status: "Blocked", icon: "doc", tile: PEACH_TILE },
  { what: "Billing question", who: "Omar\u2019s Agent", dept: "Emergency", when: "6m", tone: "soft", status: "In review", icon: "card", tile: SAND_TILE },
  { what: "Referral status", who: "Ann\u2019s Agent", dept: "Orthopedics", when: "9m", tone: "sage", status: "Answered", icon: "sync", tile: SAGE_TILE },
];

const STEPS: { title: string; meta: string; chip?: string; checks?: string[] }[] = [
  { title: "Received", meta: "Jordan\u2019s Agent, for Jordan Price", chip: "2:14:07 PM" },
  { title: "Authorized", meta: "Patient consent and hospital policy", checks: ["Patient", "Policy"] },
  { title: "Routed", meta: "Cardiology \u00b7 Referrals desk" },
  { title: "Answered", meta: "Referral approved, Dr. Shah", chip: "1.8s" },
];

function StepRight({ step }: { step: (typeof STEPS)[number] }) {
  if (step.chip) return <Chip tone="sand">{step.chip}</Chip>;
  if (!step.checks) return null;
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {step.checks.map((c) => (
        <Status key={c} tone="sage" icon="check">
          {c}
        </Status>
      ))}
    </div>
  );
}
const STEP_H = 66;
const OPEN_H = ACTIVITY.rowH + STEPS.length * STEP_H + 10;

function ActivityPanel({ frame }: { frame: number }) {
  const insert = ramp(frame, LAND_AT - 4, 14, EASE_OUT);
  const open = ramp(frame, LAND_AT + 8, 22, EASE_IN_OUT);
  const newH = insert * lerp(ACTIVITY.rowH, OPEN_H, open);
  return (
    <div style={{ position: "absolute", left: ACTIVITY.x, top: ACTIVITY.y, width: ACTIVITY.w, height: ACTIVITY.h, boxSizing: "border-box", padding: ACTIVITY.pad, borderRadius: 24, background: PANEL, overflow: "hidden" }}>
      <div style={{ height: 44, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 8px 0 10px" }}>
        <span style={{ fontFamily: F.display, fontWeight: 500, fontSize: 22, letterSpacing: "-0.015em", color: C.walnut }}>Activity</span>
        <Status tone="sage" icon="activity">
          Live
        </Status>
      </div>
      <div style={{ position: "absolute", left: ACTIVITY.pad, right: ACTIVITY.pad, top: ACTIVITY.rowsTop, display: "flex", flexDirection: "column", gap: ACTIVITY.gap }}>
        <div style={{ height: newH, marginBottom: insert > 0 ? 0 : -ACTIVITY.gap, borderRadius: 18, background: C.paper, overflow: "hidden", position: "relative", opacity: insert }}>
          <ActivityHead what="Referral status" who={"Jordan\u2019s Agent"} dept="Cardiology" when="now" icon="sync" tile={BUTTER} status={frame >= STEP_AT + 3 * STEP_GAP + 6 ? <Status tone="sage">Answered</Status> : <Status tone="soft">Routing</Status>} />
          <Timeline frame={frame} />
        </div>
        {OLDER.map((r) => (
          <div key={r.who} style={{ height: ACTIVITY.rowH, borderRadius: 18, background: C.paper, position: "relative" }}>
            <ActivityHead {...r} status={<Status tone={r.tone}>{r.status}</Status>} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivityHead({ what, who, dept, when, icon, tile, status }: { what: string; who: string; dept: string; when: string; icon: IcoName; tile: string; status: ReactNode }) {
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: ACTIVITY.rowH, display: "flex", alignItems: "center", gap: 12, padding: "0 14px 0 12px" }}>
      <Tile color={tile} icon={icon} size={40} />
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 15, color: C.walnut, whiteSpace: "nowrap" }}>{what}</span>
        <span style={{ fontFamily: F.body, fontSize: 12, color: SUB, whiteSpace: "nowrap" }}>
          {who} &middot; {dept}
        </span>
      </div>
      {status}
      <span style={{ width: 30, textAlign: "right", fontFamily: F.body, fontSize: 12, color: SUB }}>{when}</span>
    </div>
  );
}

function Timeline({ frame }: { frame: number }) {
  const line = ramp(frame, STEP_AT, STEP_GAP * 3, EASE_IN_OUT);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: ACTIVITY.rowH, height: STEPS.length * STEP_H }}>
      <div style={{ position: "absolute", left: 31, top: STEP_H / 2, width: 2, height: (STEPS.length - 1) * STEP_H, background: C.line2 }} />
      <div style={{ position: "absolute", left: 31, top: STEP_H / 2, width: 2, height: (STEPS.length - 1) * STEP_H * line, background: C.ink }} />
      {STEPS.map((s, i) => {
        const at = STEP_AT + i * STEP_GAP;
        const on = ramp(frame, at, 8);
        return (
          <div key={s.title} style={{ position: "absolute", left: 0, right: 0, top: i * STEP_H, height: STEP_H, display: "flex", alignItems: "center", gap: 14, padding: "0 14px 0 20px" }}>
            <div style={{ position: "relative", width: 24, height: 24, flexShrink: 0 }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: 999, background: C.paper, border: `2px solid ${C.line2}`, boxSizing: "border-box" }} />
              <div style={{ position: "absolute", inset: 0, borderRadius: 999, background: C.ink, opacity: on, transform: `scale(${lerp(0.4, 1, on) + 0.15 * pulse(frame, at + 2, 3, 8)})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Ico name="check" size={12} color={C.paper} stroke={3} />
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2, opacity: lerp(0.35, 1, on) }}>
              <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 15, color: C.walnut }}>{s.title}</span>
              <span style={{ fontFamily: F.body, fontSize: 12, color: SUB, whiteSpace: "nowrap" }}>{s.meta}</span>
            </div>
            <div style={{ opacity: on, transform: `translateX(${(1 - on) * 8}px)` }}>
              <StepRight step={s} />
            </div>
          </div>
        );
      })}
    </div>
  );
}