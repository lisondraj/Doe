import type { CSSProperties } from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";

import { DotWave, Stage } from "../video1/backdrops";
import { Bubble, IPhone, Slot, TimeStamp, TypingBubble } from "../video1/imessage";
import { EASE_IN_OUT, EASE_OUT, camera, lerp, pulse, ramp, typed, type CameraKey } from "../video1/motion";
import { C, F } from "../video1/theme";
import { AppShell, Chip, ClickRing, Cursor, ShadowsContext, Toggle } from "../video1/ui";
import { Av, BUTTER, Display, Ico, PANEL, PEACH_TILE, Pill, SAGE_TILE, SAND_TILE, SHELL, SOFT, SUB, Segmented, Status, Swap, Tile, arc, clamp01, draftTail, onPage, press, rise, track, type AvTone, type IcoName } from "./kit";

export const VIDEO6_COORDINATE_FRAMES = 900;

export function Video6Coordinate() {
  return (
    <ShadowsContext.Provider value={false}>
      <Audio src={staticFile("video1/BED.m4a")} startFrom={1230} volume={0.2} />
      <Stage backdrop={<DotWave top={0.58} amp={56} />}>
        <CoordinateWorld />
      </Stage>
    </ShadowsContext.Provider>
  );
}

/* ─── Journey geometry (card-local unless noted) ──────────────────────────── */

const JOURNEY = { x: 28, y: 104, w: 1308, h: 376 };
const REGION = { x: 16, y: 52, w: 800, h: 308 };
const LINE_Y = 206;
const LINE_X0 = 40;
const STOPS: { x: number; name: string; meta: string; icon: IcoName; tile: string }[] = [
  { x: 96, name: "Emergency", meta: "Oct 12, 2:40 AM", icon: "alert", tile: C.salmon },
  { x: 276, name: "Cardiology", meta: "Dr. Shah", icon: "heart", tile: PEACH_TILE },
  { x: 456, name: "Imaging", meta: "Echo, Oct 13", icon: "scan", tile: SAND_TILE },
  { x: 636, name: "Cardiac unit", meta: "Oct 13\u201316", icon: "building", tile: SAGE_TILE },
  { x: 816, name: "Discharge", meta: "Thu, Oct 16", icon: "home", tile: BUTTER },
];
const DISCHARGE = STOPS.length - 1;
const OUT = { x: 1066, w: 224, h: 60 };
const OUTSIDE: { y: number; name: string; meta: string; icon: IcoName; tile: string; after?: string }[] = [
  { y: 96, name: "Home", meta: "Robert", icon: "home", tile: SAND_TILE },
  { y: 172, name: "Primary care", meta: "Dr. Patel, Eastside", icon: "user", tile: SAGE_TILE, after: "Summary in" },
  { y: 248, name: "Cardiac rehab", meta: "Riverside Rehab", icon: "activity", tile: PEACH_TILE, after: "Intake Thu" },
  { y: 324, name: "Pharmacy", meta: "Walgreens", icon: "pill", tile: SAND_TILE, after: "Ready" },
];
const HF = { x: 636, y: 116 };
const ESCALATE_PATH = `M ${OUT.x} ${OUTSIDE[0].y} C ${OUT.x - 150} ${OUTSIDE[0].y - 70}, ${HF.x + 210} ${HF.y - 80}, ${HF.x + 12} ${HF.y}`;
const branchPath = (y: number) => `M ${STOPS[DISCHARGE].x} ${LINE_Y} C ${STOPS[DISCHARGE].x + 110} ${LINE_Y}, ${OUT.x - 140} ${y}, ${OUT.x} ${y}`;
const bez = (t: number, a: number, b: number, c: number, d: number) => (1 - t) ** 3 * a + 3 * (1 - t) ** 2 * t * b + 3 * (1 - t) * t ** 2 * c + t ** 3 * d;
const branchPoint = (y: number, t: number) => ({ x: bez(t, STOPS[DISCHARGE].x, STOPS[DISCHARGE].x + 110, OUT.x - 140, OUT.x), y: bez(t, LINE_Y, LINE_Y, y, y) });
const jw = (x: number, y: number) => onPage(JOURNEY.x + x, JOURNEY.y + y);

const PLAN = { x: 28, y: 504, w: 680, h: 344, pad: 20 };
const TEAM = { x: 732, y: 504, w: 604, h: 344 };
const SEND_PILL = { w: 236, h: 40 };
const SEND_WORLD = onPage(PLAN.x + PLAN.w - PLAN.pad - SEND_PILL.w / 2, PLAN.y + PLAN.pad + 22);
const STOP_CARD = { w: 164, h: 68, dy: 22 };

const PHONE = { w: 393, h: 852, x: 1800, y: 114 };
const THREAD = { left: PHONE.x + 19, bottom: PHONE.y + PHONE.h - 99 };
const ATTACH = { w: 300, scale: 300 / PLAN.w };
const ATTACH_H = Math.round(PLAN.h * ATTACH.scale);

/* ─── Timeline ────────────────────────────────────────────────────────────── */

const LINE = { from: 16, to: 122 };
const BRANCH = { from: 116, to: 160 };
const lineHead = (f: number) => LINE_X0 + (STOPS[DISCHARGE].x - LINE_X0) * ramp(f, LINE.from, LINE.to - LINE.from, EASE_IN_OUT);
const stopAt = (i: number) => {
  let f = LINE.from;
  while (f < LINE.to && lineHead(f) < STOPS[i].x - 6) f += 1;
  return f;
};
const DISCHARGE_CLICK = 206;
const MORPH = { at: 212, dur: 28 };
const SEND_CLICK = 290;
const FLY = { at: 296, dur: 42 };
const LAND = FLY.at + FLY.dur;
const TO_PHONE = { from: 294, to: 344 };
const STAMP1 = 300;
const ATTACH_SLOT = LAND - 18;
const TYPING1 = LAND + 8;
const REPLY1 = LAND + 26;
const NEXT_AT = LAND + 46;
const FLIPS = [412, 428, 444, 460];
const TO_TWO_UP = { from: 494, to: 532 };
const PACKETS = [520, 534, 548];
const PACKET_DUR = 26;
const TO_PHONE2 = { from: 588, to: 630 };
const STAMP2 = 602;
const REPORT = "I\u2019ve gained 4 pounds since Sunday and my ankles are swelling.";
const TYPE_AT = 622;
const SEND_AT = 672;
const TYPING2 = 686;
const REPLY2 = 704;
const NURSE_AT = 724;
const TO_TWO_UP2 = { from: 748, to: 786 };
const ESCALATE = { from: 776, dur: 34 };
const HF_AT = ESCALATE.from + ESCALATE.dur - 6;

/* ─── Camera ──────────────────────────────────────────────────────────────── */

const TWO_UP = { x: 1216, y: 540, s: 0.88 };
const PHONE_CAM = { x: THREAD.left + 170, y: THREAD.bottom - 210, s: 1.72 };
const OPEN_CAMS: CameraKey[] = [
  { f: 0, x: jw(96, 0).x + 40, y: jw(0, LINE_Y + 30).y, s: 1.9 },
  { f: LINE.from + 6, x: jw(96, 0).x + 60, y: jw(0, LINE_Y + 30).y, s: 1.86 },
  { f: LINE.to - 6, x: jw(760, 0).x, y: jw(0, LINE_Y + 20).y, s: 1.5 },
  { f: BRANCH.to + 6, x: jw(1010, 0).x, y: jw(0, LINE_Y).y, s: 1.4 },
  { f: DISCHARGE_CLICK - 4, x: 1000, y: 470, s: 1.06 },
  { f: MORPH.at + MORPH.dur, x: 760, y: 610, s: 1.18 },
  { f: SEND_CLICK - 6, x: 760, y: 660, s: 1.32 },
  { f: TO_PHONE.from, x: 770, y: 660, s: 1.33 },
];
const TWO_UP_CAMS: CameraKey[] = [
  { f: TO_TWO_UP.to, ...TWO_UP },
  { f: PACKETS[0] + 4, x: 1300, y: 470, s: 1.06 },
  { f: TO_PHONE2.from, x: 1330, y: 460, s: 1.1 },
];
const PHONE_CAM2 = { x: PHONE_CAM.x, y: THREAD.bottom - 230, s: 1.72 };
const END_CAMS: CameraKey[] = [
  { f: TO_TWO_UP2.to, ...TWO_UP },
  { f: ESCALATE.from + ESCALATE.dur + 10, x: 1260, y: 470, s: 1.04 },
  { f: VIDEO6_COORDINATE_FRAMES, x: 1270, y: 480, s: 1.08 },
];

function worldCamera(f: number): CSSProperties {
  if (f < TO_PHONE.from) return camera(f, OPEN_CAMS);
  if (f < TO_PHONE.to) return arc(f, OPEN_CAMS[OPEN_CAMS.length - 1], PHONE_CAM, TO_PHONE, 0.5);
  if (f < TO_TWO_UP.from) return camera(f, [{ f: TO_PHONE.to, ...PHONE_CAM }, { f: TO_TWO_UP.from, x: PHONE_CAM.x, y: PHONE_CAM.y - 30, s: 1.78 }]);
  if (f < TO_TWO_UP.to) return camera(f, [{ f: TO_TWO_UP.from, x: PHONE_CAM.x, y: PHONE_CAM.y - 30, s: 1.78 }, { f: TO_TWO_UP.to, ...TWO_UP }]);
  if (f < TO_PHONE2.from) return camera(f, TWO_UP_CAMS);
  if (f < TO_PHONE2.to) return arc(f, TWO_UP_CAMS[TWO_UP_CAMS.length - 1], PHONE_CAM2, TO_PHONE2, 0.25);
  if (f < TO_TWO_UP2.from) return camera(f, [{ f: TO_PHONE2.to, ...PHONE_CAM2 }, { f: TO_TWO_UP2.from, x: PHONE_CAM2.x, y: PHONE_CAM2.y + 10, s: 1.78 }]);
  if (f < TO_TWO_UP2.to) return camera(f, [{ f: TO_TWO_UP2.from, x: PHONE_CAM2.x, y: PHONE_CAM2.y + 10, s: 1.78 }, { f: TO_TWO_UP2.to, ...TWO_UP }]);
  return camera(f, END_CAMS);
}

/* ─── World ───────────────────────────────────────────────────────────────── */

function CoordinateWorld() {
  const frame = useCurrentFrame();
  const full = typed(REPORT, frame, TYPE_AT, 40);
  const draft = frame >= TYPE_AT && frame < SEND_AT ? draftTail(full) : "";
  const dWorld = jw(STOPS[DISCHARGE].x, LINE_Y);
  const cur = track(frame, [
    { f: 170, x: dWorld.x + 220, y: dWorld.y + 300 },
    { f: DISCHARGE_CLICK - 4, x: dWorld.x + 2, y: dWorld.y + 3 },
    { f: 250, x: SEND_WORLD.x + 120, y: SEND_WORLD.y + 220 },
    { f: SEND_CLICK - 4, x: SEND_WORLD.x + 4, y: SEND_WORLD.y + 3 },
    { f: SEND_CLICK + 24, x: SEND_WORLD.x + 60, y: SEND_WORLD.y + 120 },
  ]);
  return (
    <AbsoluteFill>
      <div style={worldCamera(frame)}>
        <div style={{ position: "absolute", left: SHELL.x, top: SHELL.y, ...rise(frame, 0, { y: 30, dur: 26 }) }}>
          <AppShell active={3} railReveal={(i) => ramp(frame, 6 + i * 2, 12)}>
            <PatientPage frame={frame} />
          </AppShell>
        </div>

        <div style={{ position: "absolute", left: PHONE.x, top: PHONE.y, ...rise(frame, TO_PHONE.from, { x: 60, y: 0, dur: 30 }) }}>
          <IPhone frame={frame} width={PHONE.w} height={PHONE.h} contact="Agent" draft={draft} composing={frame >= TYPE_AT - 10 && frame < SEND_AT} sendPress={pulse(frame, SEND_AT - 4, 3, 6)}>
            <Slot frame={frame} at={STAMP1} side="center">
              <TimeStamp day="Thu" time="11:20 AM" />
            </Slot>
            <Slot frame={frame} at={ATTACH_SLOT} side="in" dur={14}>
              <div style={{ width: ATTACH.w, height: ATTACH_H, opacity: frame >= LAND ? 1 : 0 }}>
                <div style={{ width: PLAN.w, height: PLAN.h, transform: `scale(${ATTACH.scale})`, transformOrigin: "0 0" }}>
                  <PlanCard frame={frame} sent />
                </div>
              </div>
            </Slot>
            <Slot frame={frame} at={TYPING1} until={REPLY1} side="in" dur={12}>
              <TypingBubble frame={frame} />
            </Slot>
            <Slot frame={frame} at={REPLY1} side="in" dur={18}>
              <Bubble>Bayview sent your discharge plan. I&rsquo;ll set up what&rsquo;s next.</Bubble>
            </Slot>
            <Slot frame={frame} at={NEXT_AT} side="in" dur={20}>
              <NextSteps frame={frame} />
            </Slot>
            <Slot frame={frame} at={STAMP2} side="center">
              <TimeStamp day="Wed" time="8:04 AM" />
            </Slot>
            <Slot frame={frame} at={SEND_AT} side="out" dur={18}>
              <Bubble out>{REPORT}</Bubble>
            </Slot>
            <Slot frame={frame} at={TYPING2} until={REPLY2} side="in" dur={12}>
              <TypingBubble frame={frame} />
            </Slot>
            <Slot frame={frame} at={REPLY2} side="in" dur={18}>
              <Bubble>That matches Bayview&rsquo;s warning signs. I&rsquo;ve let the heart failure team know.</Bubble>
            </Slot>
            <Slot frame={frame} at={NURSE_AT} side="in" dur={20}>
              <NurseCard frame={frame} />
            </Slot>
          </IPhone>
        </div>

        <PlanFlight frame={frame} />

        <ClickRing x={dWorld.x} y={dWorld.y} progress={ramp(frame, DISCHARGE_CLICK - 1, 14)} />
        <ClickRing x={SEND_WORLD.x} y={SEND_WORLD.y} progress={ramp(frame, SEND_CLICK - 1, 14)} />
        <div style={{ opacity: ramp(frame, 170, 8) * (1 - ramp(frame, SEND_CLICK + 16, 8)) }}>
          <Cursor x={cur.x} y={cur.y} pressed={press(frame, [DISCHARGE_CLICK, SEND_CLICK])} />
        </div>
      </div>
    </AbsoluteFill>
  );
}

/* ─── Robert's page in the hospital ───────────────────────────────────────── */

function PatientPage({ frame }: { frame: number }) {
  return (
    <>
      <div style={{ position: "absolute", left: 28, top: 26, display: "flex", alignItems: "center", gap: 14, ...rise(frame, 4) }}>
        <Av label="RM" size={50} tone="sand" />
        <Display size={44}>Robert Mills</Display>
        <Status tone="salmon" icon="heart" size={1.15}>
          Heart failure
        </Status>
      </div>
      <div style={{ position: "absolute", right: 28, top: 34, display: "flex", gap: 8, ...rise(frame, 8) }}>
        <Segmented items={["Journey", "Chart", "Team"]} value={0} width={280} />
        <Pill tone="ink" icon="chat">
          Message team
        </Pill>
      </div>
      <JourneyCard frame={frame} />
      <TeamCard frame={frame} />
      <PlanSlot frame={frame} />
    </>
  );
}

function JourneyCard({ frame }: { frame: number }) {
  const head = lineHead(frame);
  const branch = ramp(frame, BRANCH.from, BRANCH.to - BRANCH.from, EASE_IN_OUT);
  const escalate = ramp(frame, ESCALATE.from, ESCALATE.dur, EASE_IN_OUT);
  return (
    <div style={{ position: "absolute", left: JOURNEY.x, top: JOURNEY.y, width: JOURNEY.w, height: JOURNEY.h, borderRadius: 24, background: PANEL, ...rise(frame, 6, { y: 20, dur: 26 }) }}>
      <div style={{ position: "absolute", left: 24, top: 12, height: 32, display: "flex", alignItems: "center" }}>
        <span style={{ fontFamily: F.display, fontWeight: 500, fontSize: 24, letterSpacing: "-0.015em", color: C.walnut }}>Journey</span>
      </div>
      <div style={{ position: "absolute", left: REGION.x, top: REGION.y, width: REGION.w, height: REGION.h, borderRadius: 20, background: C.beige }}>
        <div style={{ position: "absolute", left: 14, top: 14 }}>
          <Chip tone="paper" size={1.1} icon={<Ico name="building" size={14} />}>
            Bayview Health
          </Chip>
        </div>
      </div>
      <div style={{ position: "absolute", left: OUT.x, top: REGION.y - 36 }}>
        <Chip tone="dashed" size={1.05}>
          Outside Bayview
        </Chip>
      </div>

      <svg width={JOURNEY.w} height={JOURNEY.h} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <line x1={LINE_X0} y1={LINE_Y} x2={head} y2={LINE_Y} stroke={C.ink} strokeWidth={4} strokeLinecap="round" />
        {OUTSIDE.map((o, i) => (
          <path key={o.name} d={branchPath(o.y)} fill="none" stroke={C.ink} strokeWidth={i === 0 ? 4 : 3} strokeLinecap="round" pathLength={1} opacity={branch > 0 ? 1 : 0} style={{ strokeDasharray: `${branch} 1` }} />
        ))}
        {escalate > 0 ? <path d={ESCALATE_PATH} fill="none" stroke="#E8A585" strokeWidth={4} strokeLinecap="round" pathLength={1} style={{ strokeDasharray: `${escalate} 1` }} /> : null}
      </svg>

      {STOPS.map((s, i) => {
        const at = stopAt(i);
        const p = ramp(frame, at, 14, EASE_OUT);
        const hidden = i === DISCHARGE && frame >= MORPH.at && frame < MORPH.at + MORPH.dur + 4;
        return (
          <div key={s.name}>
            <div style={{ position: "absolute", left: s.x - 11, top: LINE_Y - 11, width: 22, height: 22, borderRadius: 999, background: C.ink, border: `4px solid ${PANEL}`, boxSizing: "border-box", opacity: p, transform: `scale(${lerp(0.3, 1, p) + 0.2 * pulse(frame, at + 2, 3, 10)})` }} />
            <div style={{ position: "absolute", left: s.x - STOP_CARD.w / 2, top: LINE_Y + STOP_CARD.dy, width: STOP_CARD.w, height: STOP_CARD.h, opacity: hidden ? 0.4 : 1, ...rise(frame, at + 2, { y: -10, dur: 16 }) }}>
              <StopCard name={s.name} meta={s.meta} icon={s.icon} tile={s.tile} />
            </div>
          </div>
        );
      })}

      {OUTSIDE.map((o, i) => {
        const at = BRANCH.from + 22 + i * 6;
        const arrive = i > 0 ? PACKETS[i - 1] + PACKET_DUR : 0;
        const swap = i > 0 ? ramp(frame, arrive, 10) : 0;
        const swell = i === 0 ? ramp(frame, ESCALATE.from - 4, 10) : 0;
        return (
          <div key={o.name} style={{ position: "absolute", left: OUT.x, top: o.y - OUT.h / 2, width: OUT.w, height: OUT.h, borderRadius: 18, background: C.paper, display: "flex", alignItems: "center", gap: 10, padding: "0 12px 0 10px", boxSizing: "border-box", ...rise(frame, at, { x: -16, y: 0, dur: 18 }) }}>
            <Tile color={o.tile} icon={o.icon} size={36} />
            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 3 }}>
              <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 14, color: C.walnut, whiteSpace: "nowrap" }}>{o.name}</span>
              {o.after ? (
                <Swap t={swap} pop={pulse(frame, arrive + 4, 4, 10)} from={<span style={{ fontFamily: F.body, fontSize: 12, color: SUB, whiteSpace: "nowrap" }}>{o.meta}</span>} to={<Status tone="sage" icon="check" size={0.9}>{o.after}</Status>} />
              ) : (
                <Swap t={swell} pop={pulse(frame, ESCALATE.from + 4, 4, 10)} from={<span style={{ fontFamily: F.body, fontSize: 12, color: SUB }}>{o.meta}</span>} to={<Status tone="salmon" icon="alert" size={0.9}>Swelling</Status>} />
              )}
            </div>
          </div>
        );
      })}

      {PACKETS.map((at, i) => {
        const t = ramp(frame, at, PACKET_DUR, EASE_IN_OUT);
        if (t <= 0 || t >= 1) return null;
        const p = branchPoint(OUTSIDE[i + 1].y, t);
        return <div key={at} style={{ position: "absolute", left: p.x - 9, top: p.y - 9, width: 18, height: 18, borderRadius: 999, background: C.salmon, border: `3px solid ${C.ink}`, boxSizing: "border-box" }} />;
      })}

      <HfNode frame={frame} />
    </div>
  );
}

function StopCard({ name, meta, icon, tile }: { name: string; meta: string; icon: IcoName; tile: string }) {
  return (
    <div style={{ width: "100%", height: "100%", borderRadius: 16, background: C.paper, display: "flex", alignItems: "center", gap: 10, padding: "0 12px 0 10px", boxSizing: "border-box" }}>
      <Tile color={tile} icon={icon} size={34} />
      <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
        <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 14, color: C.walnut, whiteSpace: "nowrap" }}>{name}</span>
        <span style={{ fontFamily: F.body, fontSize: 12, color: SUB, whiteSpace: "nowrap" }}>{meta}</span>
      </div>
    </div>
  );
}

function HfNode({ frame }: { frame: number }) {
  const p = ramp(frame, HF_AT, 16, EASE_OUT);
  if (p <= 0) return null;
  return (
    <>
      <div style={{ position: "absolute", left: HF.x - 12, top: HF.y - 12, width: 24, height: 24, borderRadius: 999, background: "#E8A585", border: `4px solid ${C.beige}`, boxSizing: "border-box", opacity: p, transform: `scale(${lerp(0.3, 1, p) + 0.25 * pulse(frame, HF_AT + 2, 3, 12)})` }} />
      <div style={{ position: "absolute", left: HF.x - 196, top: HF.y - 30, width: 176, height: 60, ...rise(frame, HF_AT + 2, { x: 12, y: 0, dur: 16 }) }}>
        <StopCard name="Heart failure" meta="Nurse call, 9:30" icon="heart" tile={C.salmon} />
      </div>
    </>
  );
}

const TEAM_ROWS: { name: string; role: string; av: [string, AvTone]; where: string; outside?: boolean }[] = [
  { name: "Dr. Arjun Shah", role: "Cardiology", av: ["AS", "salmon"], where: "Bayview" },
  { name: "Nina Park, RN", role: "Heart failure nurse", av: ["NP", "sage"], where: "Bayview" },
  { name: "Dr. Maya Patel", role: "Primary care", av: ["MP", "sand"], where: "Eastside", outside: true },
  { name: "Riverside Rehab", role: "Cardiac rehab", av: ["RR", "salmon"], where: "Outside", outside: true },
];

function TeamCard({ frame }: { frame: number }) {
  return (
    <div style={{ position: "absolute", left: TEAM.x, top: TEAM.y, width: TEAM.w, height: TEAM.h, boxSizing: "border-box", padding: 8, borderRadius: 24, background: PANEL, ...rise(frame, 12, { y: 20, dur: 26 }) }}>
      <div style={{ height: 52, display: "flex", alignItems: "center", padding: "0 12px" }}>
        <span style={{ fontFamily: F.display, fontWeight: 500, fontSize: 24, letterSpacing: "-0.015em", color: C.walnut }}>Care team</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {TEAM_ROWS.map((r) => (
          <div key={r.name} style={{ height: 64, borderRadius: 18, background: C.paper, display: "flex", alignItems: "center", gap: 12, padding: "0 14px 0 12px" }}>
            <Av label={r.av[0]} size={40} tone={r.av[1]} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 15, color: C.walnut }}>{r.name}</span>
              <span style={{ fontFamily: F.body, fontSize: 12, color: SUB }}>{r.role}</span>
            </div>
            <Chip tone={r.outside ? "dashed" : "sand"}>{r.where}</Chip>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Discharge plan: grows out of the Discharge stop, then goes to the agent ─ */

const PLAN_ROWS: { label: string; icon: IcoName; tile: string; lock?: boolean }[] = [
  { label: "Cardiology follow-up within 7 days", icon: "calendar", tile: PEACH_TILE },
  { label: "Daily weights", icon: "scale", tile: SAND_TILE },
  { label: "Furosemide 40 mg, once daily", icon: "pill", tile: SAGE_TILE },
  { label: "Cardiac rehab referral", icon: "activity", tile: SAND_TILE },
  { label: "Call if weight is up 3 lb in 2 days", icon: "alert", tile: C.salmon },
  { label: "Clinical notes", icon: "doc", tile: SOFT, lock: true },
];

function PlanSlot({ frame }: { frame: number }) {
  const m = ramp(frame, MORPH.at, MORPH.dur, EASE_IN_OUT);
  if (m <= 0) return null;
  const from = { x: JOURNEY.x + STOPS[DISCHARGE].x - STOP_CARD.w / 2, y: JOURNEY.y + LINE_Y + STOP_CARD.dy, w: STOP_CARD.w, h: STOP_CARD.h };
  const r = { x: lerp(from.x, PLAN.x, m), y: lerp(from.y, PLAN.y, m), w: lerp(from.w, PLAN.w, m), h: lerp(from.h, PLAN.h, m) };
  const content = EASE_IN_OUT(clamp01((m - 0.7) / 0.3));
  const leftBehind = frame >= FLY.at ? 1 : 0;
  return (
    <div style={{ position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h, borderRadius: lerp(16, 24, m), background: leftBehind ? PANEL : C.paper, border: leftBehind ? "1.5px dashed rgba(40, 25, 16, 0.2)" : undefined, boxSizing: "border-box", overflow: "hidden", zIndex: 5 }}>
      {leftBehind ? (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: F.ui, fontWeight: 600, fontSize: 16, color: SUB, opacity: ramp(frame, LAND, 12) }}>
          <Ico name="check" size={16} color={SUB} stroke={2.4} />
          Sent to Robert&rsquo;s Agent
        </div>
      ) : (
        <>
          <div style={{ position: "absolute", inset: 0, opacity: 1 - content }}>
            <StopCard {...STOPS[DISCHARGE]} />
          </div>
          {content > 0 ? (
            <div style={{ position: "absolute", left: 0, top: 0, opacity: content }}>
              <PlanCard frame={frame} />
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

function PlanCard({ frame, sent = false }: { frame: number; sent?: boolean }) {
  const rowsAt = MORPH.at + MORPH.dur - 4;
  return (
    <div style={{ position: "relative", width: PLAN.w, height: PLAN.h, boxSizing: "border-box", padding: PLAN.pad, borderRadius: 24, background: C.paper, border: sent ? "none" : `1px solid ${C.line}` }}>
      <div style={{ height: 44, display: "flex", alignItems: "center", gap: 12 }}>
        <Display size={26}>Discharge plan</Display>
        <Status tone="sage" icon="check">
          Signed, Dr. Shah
        </Status>
        <div style={{ flex: 1 }} />
        {sent ? null : (
          <div style={{ transform: `scale(${1 - 0.05 * pulse(frame, SEND_CLICK - 2, 3, 8)})` }}>
            <Pill tone="ink" trailing="arrowRight" height={SEND_PILL.h} style={{ width: SEND_PILL.w }}>
              Send to Robert&rsquo;s Agent
            </Pill>
          </div>
        )}
      </div>
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 4 }}>
        {PLAN_ROWS.map((row, i) => (
          <div key={row.label} style={{ height: 40, borderRadius: 12, background: C.beige, display: "flex", alignItems: "center", gap: 12, padding: "0 12px 0 6px", ...(sent ? {} : rise(frame, rowsAt + i * 3, { y: 8, dur: 14 })) }}>
            <Tile color={row.tile} icon={row.icon} size={28} radius={9} />
            <span style={{ flex: 1, fontFamily: F.ui, fontWeight: 500, fontSize: 14, color: row.lock ? SUB : C.walnut, whiteSpace: "nowrap" }}>{row.label}</span>
            {row.lock ? (
              <span style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: F.ui, fontWeight: 600, fontSize: 12, color: SUB }}>
                <Ico name="lock" size={13} color={SUB} stroke={2.2} />
                Not shared
              </span>
            ) : (
              <Toggle on />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function PlanFlight({ frame }: { frame: number }) {
  const u = ramp(frame, FLY.at, FLY.dur, EASE_IN_OUT);
  if (u <= 0 || frame >= LAND) return null;
  const from = onPage(PLAN.x, PLAN.y);
  const to = { x: THREAD.left, y: THREAD.bottom - ATTACH_H };
  const x = lerp(from.x, to.x, u);
  const y = lerp(from.y, to.y, u) - 180 * Math.sin(Math.PI * u);
  const s = Math.exp(lerp(0, Math.log(ATTACH.scale), u));
  return (
    <div style={{ position: "absolute", left: x, top: y, width: PLAN.w, height: PLAN.h, transform: `scale(${s})`, transformOrigin: "0 0" }}>
      <PlanCard frame={frame} sent={u > 0.5} />
    </div>
  );
}

/* ─── The agent's side ────────────────────────────────────────────────────── */

const NEXT: { title: string; meta: string; icon: IcoName; tile: string; done: string }[] = [
  { title: "Cardiology follow-up", meta: "Bayview, Tue 10:30", icon: "calendar", tile: PEACH_TILE, done: "Booked" },
  { title: "Cardiac rehab", meta: "Riverside, intake Thu", icon: "activity", tile: SAND_TILE, done: "Booked" },
  { title: "Furosemide 40 mg", meta: "Walgreens on 5th", icon: "pill", tile: SAGE_TILE, done: "Ready" },
  { title: "Summary to Dr. Patel", meta: "Eastside Family Med", icon: "doc", tile: SAND_TILE, done: "Sent" },
];

function NextSteps({ frame }: { frame: number }) {
  return (
    <div style={{ width: 300, boxSizing: "border-box", padding: 10, borderRadius: 22, background: C.beige, display: "flex", flexDirection: "column", gap: 6, fontFamily: F.ui }}>
      {NEXT.map((n, i) => {
        const t = ramp(frame, FLIPS[i], 10);
        return (
          <div key={n.title} style={{ height: 52, borderRadius: 14, background: C.paper, display: "flex", alignItems: "center", gap: 10, padding: "0 10px 0 8px" }}>
            <Tile color={n.tile} icon={n.icon} size={32} radius={10} />
            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 1 }}>
              <span style={{ fontWeight: 600, fontSize: 13, color: C.walnut, whiteSpace: "nowrap" }}>{n.title}</span>
              <span style={{ fontSize: 11, color: SUB, whiteSpace: "nowrap" }}>{n.meta}</span>
            </div>
            <Swap t={t} pop={pulse(frame, FLIPS[i] + 4, 4, 10)} from={<Status tone="soft" size={0.9}>Pending</Status>} to={<Status tone="sage" icon="check" size={0.9}>{n.done}</Status>} />
          </div>
        );
      })}
    </div>
  );
}

function NurseCard({ frame }: { frame: number }) {
  const ok = ramp(frame, NURSE_AT + 24, 10);
  return (
    <div style={{ width: 300, boxSizing: "border-box", padding: 12, borderRadius: 22, background: C.beige, display: "flex", flexDirection: "column", gap: 10, fontFamily: F.ui }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Tile color={C.salmon} icon="heart" size={28} radius={9} />
        <span style={{ fontWeight: 600, fontSize: 14, color: C.walnut }}>Bayview Heart Failure</span>
      </div>
      <div style={{ height: 52, borderRadius: 14, background: C.paper, display: "flex", alignItems: "center", gap: 10, padding: "0 10px 0 12px" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
          <span style={{ fontWeight: 600, fontSize: 13, color: C.walnut }}>Nurse call with Nina Park</span>
          <span style={{ fontSize: 11, color: SUB }}>Today, 9:30 AM</span>
        </div>
        <Swap t={ok} pop={pulse(frame, NURSE_AT + 28, 4, 10)} from={<Status tone="soft" size={0.9}>Requested</Status>} to={<Status tone="sage" icon="check" size={0.9}>Confirmed</Status>} />
      </div>
    </div>
  );
}
