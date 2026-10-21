import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";

import { DotWave, FlowLines, Stage } from "../video1/backdrops";
import { Bubble, IPhone, Slot, TimeStamp, TypingBubble } from "../video1/imessage";
import { EASE_IN, EASE_IN_OUT, camera, fly, keys, lerp, pulse, ramp, typed } from "../video1/motion";
import { C, F } from "../video1/theme";
import { AppShell, Avatar, Button, Chip, ClickRing, Cursor, Icon, ShadowsContext, StatusDot, type IconName } from "../video1/ui";
import { BedTrack, Dropdown, H, IconButton, SECTION_FRAMES, SearchField, TILE_TONES, Tile, surface } from "./shared";

export const SECTION3_FRAMES = SECTION_FRAMES;

const JOURNEY = { from: 0, dur: 236 };
const CARE = { from: 212, dur: SECTION_FRAMES - 212 };

export function Section3Coordinate() {
  const frame = useCurrentFrame();
  const waveIn = ramp(frame, CARE.from, 30, EASE_IN_OUT);
  return (
    <ShadowsContext.Provider value={false}>
      <BedTrack />
      <Stage
        backdrop={
          <>
            <div style={{ position: "absolute", inset: 0, opacity: 1 - waveIn }}>
              <FlowLines opacity={0.06} />
            </div>
            <div style={{ position: "absolute", inset: 0, opacity: waveIn }}>
              <DotWave top={0.56} amp={56} />
            </div>
          </>
        }
      >
        <Sequence durationInFrames={JOURNEY.dur} name="Patient journey">
          <JourneyScene />
        </Sequence>
        <Sequence from={CARE.from} durationInFrames={CARE.dur} name="Discharge, follow-up, escalation">
          <CareScene />
        </Sequence>
      </Stage>
    </ShadowsContext.Provider>
  );
}

/* ─── The journey: ED → cardiology → imaging → inpatient → home ────────────── */

type Stop = { name: string; icon: IconName; meta: string; chip: string; outside?: boolean };

const STOPS: Stop[] = [
  { name: "Emergency", icon: "plus", meta: "Oct 3 · 11:48 PM", chip: "Shortness of breath" },
  { name: "Cardiology", icon: "heart", meta: "Oct 4 · 2:10 AM", chip: "Heart failure" },
  { name: "Imaging", icon: "scan", meta: "Oct 4 · 9:30 AM", chip: "Echocardiogram" },
  { name: "Inpatient", icon: "building", meta: "Oct 4 to Oct 7", chip: "Step-down unit" },
  { name: "Discharge", icon: "home", meta: "Oct 7 · 11:00 AM", chip: "Home with a plan" },
  { name: "Primary care", icon: "user", meta: "Riverside Family Medicine", chip: "Dr. Patel", outside: true },
  { name: "Pharmacy", icon: "pill", meta: "Walgreens #2214", chip: "Furosemide", outside: true },
  { name: "Cardiac rehab", icon: "activity", meta: "Eastside Cardiac Rehab", chip: "12 sessions", outside: true },
];

const J_SHELL = { x: 160, y: 70 };
const TRACK = { y: 430, x0: 70, step: 292 };
const STOP_CARD = { w: 268, h: 210 };
const stopX = (i: number) => TRACK.x0 + i * TRACK.step;
const DISCHARGE = 4;
const ARRIVE = STOPS.map((_, i) => 18 + i * 19);
const ZOOM_AT = 202;
const DISCHARGE_WORLD = { x: J_SHELL.x + 64 + stopX(DISCHARGE) + STOP_CARD.w / 2, y: J_SHELL.y + 12 + TRACK.y + STOP_CARD.h / 2 };

function JourneyScene() {
  const frame = useCurrentFrame();
  const markerX = keys(frame, ARRIVE, STOPS.map((_, i) => stopX(i) + STOP_CARD.w / 2));
  const cam = camera(frame, [
    { f: 0, x: 720, y: 360, s: 1.42 },
    { f: 28, x: 760, y: 400, s: 1.28 },
    { f: ARRIVE[3], x: J_SHELL.x + 64 + stopX(3), y: 560, s: 1.18 },
    { f: ARRIVE[6], x: J_SHELL.x + 64 + stopX(6), y: 560, s: 1.12 },
    { f: 184, x: 1180, y: 540, s: 0.78 },
    { f: ZOOM_AT - 8, x: 1180, y: 540, s: 0.78 },
    { f: JOURNEY.dur, x: DISCHARGE_WORLD.x, y: DISCHARGE_WORLD.y, s: 2.4 },
  ]);
  const leave = ramp(frame, ZOOM_AT + 10, 20, EASE_IN);

  return (
    <AbsoluteFill style={{ opacity: 1 - leave, filter: leave > 0.01 ? `blur(${(12 * leave).toFixed(2)}px)` : undefined }}>
      <div style={cam}>
        <div style={{ position: "absolute", left: J_SHELL.x, top: J_SHELL.y }}>
          <AppShell active={1} width={1680} height={940} railReveal={(i) => ramp(frame, 4 + i * 2, 12)}>
            <JourneyPage frame={frame} markerX={markerX} />
          </AppShell>
        </div>
      </div>
    </AbsoluteFill>
  );
}

function JourneyPage({ frame, markerX }: { frame: number; markerX: number }) {
  return (
    <>
      <div style={{ position: "absolute", left: 28, top: 28, fontFamily: F.display, fontWeight: 500, fontSize: 46, lineHeight: "50px", letterSpacing: "-0.025em", color: C.walnut, ...fly(frame, { at: 6, y: 12, dur: 16, blur: 0 }) }}>
        Journeys
      </div>
      <div style={{ position: "absolute", right: 28, top: 34, display: "flex", gap: 8, ...fly(frame, { at: 10, y: 12, dur: 16, blur: 0 }) }}>
        <SearchField placeholder="Find a patient" width={220} />
        <Dropdown value="Daniel Ruiz" />
        <IconButton icon="search" />
        <Button height={38} icon={<Icon name="plus" size={14} color={C.paper} />} style={{ fontSize: 14 }}>
          New stay
        </Button>
      </div>
      <div style={{ position: "absolute", left: 28, top: 98, display: "flex", gap: 8, ...fly(frame, { at: 12, y: 10, dur: 14, blur: 0 }) }}>
        <Chip tone="ink">This admission</Chip>
        <Chip tone="sand">Oct 3–7</Chip>
        <Chip tone="outline">{H.system}</Chip>
      </div>

      <div style={{ position: "absolute", left: TRACK.x0, top: TRACK.y - 18, width: markerX - TRACK.x0, height: 3, borderRadius: 2, background: C.ink }} />
      {STOPS.map((stop, i) => (
        <div key={stop.name} style={{ position: "absolute", left: stopX(i), top: TRACK.y, width: STOP_CARD.w, ...fly(frame, { at: ARRIVE[i] - 6, y: 22, scale: 0.95, dur: 18, blur: 0 }) }}>
          <StopCard stop={stop} index={i} active={i === DISCHARGE ? ramp(frame, 176, 12) : 0} />
        </div>
      ))}
    </>
  );
}

function StopCard({ stop, index, active }: { stop: Stop; index: number; active: number }) {
  return (
    <div
      style={{
        height: STOP_CARD.h,
        boxSizing: "border-box",
        padding: 16,
        borderRadius: 22,
        background: C.paper,
        border: stop.outside ? "1.5px dashed rgba(40, 25, 16, 0.22)" : `1.5px solid ${active > 0 ? `rgba(40, 25, 16, ${0.12 + 0.7 * active})` : C.line}`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ width: 36, height: 36, borderRadius: 12, background: stop.name === "Discharge" ? C.salmon : TILE_TONES[index % TILE_TONES.length] }} />
        <Chip tone={stop.outside ? "dashed" : "outline"}>{stop.outside ? "Outside" : "In system"}</Chip>
      </div>
      <div style={{ marginTop: "auto", fontFamily: F.ui, fontWeight: 600, fontSize: 18, color: C.walnut }}>{stop.name}</div>
      <div style={{ fontFamily: F.body, fontSize: 13, color: C.muted }}>{stop.meta}</div>
      <div style={{ display: "flex", marginTop: 10 }}>
        <Chip tone="sand">{stop.chip}</Chip>
      </div>
    </div>
  );
}

/* ─── Discharge plan → the patient's agent → follow-up → escalation ────────── */

const PLAN = { x: 150, y: 140, w: 720, h: 800, pad: 32 };
const AGENT = { x: 1050, y: 140, w: 760, h: 800, pad: 28 };
const ROWS = { top: 170, step: 120, h: 108 };
const PHONE = { x: 2060, y: 114, w: 393, h: 852 };
const ESC = { x: 2620, y: 232, w: 720, pad: 36 };
const ESC_BTN = { top: 520, h: 60, sideW: 200 };

type Step = { instruction: string; icon: IconName; title: string; org: string; done: { label: string; icon?: IconName; watch?: boolean }; doneAt: number };

const STEPS: Step[] = [
  {
    instruction: "Cardiology within 7 days.",
    icon: "calendar",
    title: "Cardiology follow-up",
    org: "Northfield Heart Clinic",
    done: { label: "Tue, Oct 14 · 10:20 AM", icon: "calendar" },
    doneAt: 200,
  },
  {
    instruction: "Daily weight. Call if +3 lb or swelling.",
    icon: "scale",
    title: "Morning weight check-in",
    org: "Daily at 8:00 AM",
    done: { label: "Watching for changes", icon: "eye", watch: true },
    doneAt: 246,
  },
  {
    instruction: "Furosemide 40 mg each morning.",
    icon: "pill",
    title: "Furosemide 40 mg",
    org: "Walgreens #2214",
    done: { label: "Ready for pickup" },
    doneAt: 222,
  },
  {
    instruction: "Cardiac rehab within 2 weeks.",
    icon: "activity",
    title: "Cardiac rehab intake",
    org: "Eastside Cardiac Rehab",
    done: { label: "Thu, Oct 16 · 2:00 PM", icon: "calendar" },
    doneAt: 268,
  },
  {
    instruction: "Share the summary with Dr. Patel.",
    icon: "doc",
    title: "Share discharge summary",
    org: "Dr. Patel · Riverside Family Medicine",
    done: { label: "Shared", icon: "link" },
    doneAt: 334,
  },
];

const RECEIVE_AT = (i: number) => 84 + i * 14;
const PROMPT_AT = 290;
const ALLOW_AT = 330;
const ALLOW_BTN = { x: AGENT.x + AGENT.w - 20 - 110 - 8 - 45, y: AGENT.y + ROWS.top + 4 * ROWS.step + ROWS.h / 2 };

const PHONE_AT = 380;
const D = 388;
const DRAFT = "184 lb. I’m up 4 pounds since Thursday and my ankles are really swollen.";
const DRAFT_AT = D + 14;
const DRAFT_CPS = 30;
const SENT_AT = D + 96;
const TYPING_AT = SENT_AT + 12;
const REPLY_AT = TYPING_AT + 26;
const REPLY = "That matches what your cardiology team asked me to watch for. I’ve let Northfield Heart Clinic know, and a nurse will call you this morning.";
const ESC_AT = REPLY_AT + 14;
const CALL_AT = D + 236;
const CALL_BTN = { x: ESC.x + ESC.pad + (ESC.w - ESC.pad * 2 - 12 - ESC_BTN.sideW) / 2, y: ESC.y + ESC_BTN.top + ESC_BTN.h / 2 };

function CareScene() {
  const frame = useCurrentFrame();
  const enter = ramp(frame, 0, 26, EASE_IN_OUT);
  const cam = camera(frame, [
    { f: 0, x: 960, y: 540, s: 0.84 },
    { f: 30, x: 960, y: 540, s: 1.0 },
    { f: 150, x: 1080, y: 560, s: 1.06 },
    { f: 200, x: 1430, y: 480, s: 1.42 },
    { f: 250, x: 1430, y: 520, s: 1.42 },
    { f: 300, x: 1430, y: 720, s: 1.42 },
    { f: 360, x: 1420, y: 740, s: 1.44 },
    { f: PHONE_AT - 22, x: 1680, y: 560, s: 1.02 },
    { f: PHONE_AT + 8, x: 1880, y: 540, s: 1.08 },
    { f: D + 36, x: PHONE.x + PHONE.w / 2, y: 540, s: 1.14 },
    { f: REPLY_AT + 4, x: PHONE.x + PHONE.w / 2 + 40, y: 560, s: 1.16 },
    { f: ESC_AT - 16, x: 2480, y: 540, s: 1.0 },
    { f: ESC_AT + 20, x: ESC.x + ESC.w / 2 - 40, y: 540, s: 1.12 },
    { f: ESC_AT + 48, x: ESC.x + ESC.w / 2 - 60, y: 540, s: 1.2 },
    { f: CALL_AT + 14, x: ESC.x + ESC.w / 2 - 40, y: 600, s: 1.24 },
    { f: CARE.dur - 12, x: 1750, y: 540, s: 0.58 },
    { f: CARE.dur, x: 1750, y: 540, s: 0.585 },
  ]);
  const toAllow = ramp(frame, 296, 30, EASE_IN_OUT);
  const toCall = ramp(frame, CALL_AT - 36, 32, EASE_IN_OUT);

  return (
    <AbsoluteFill style={{ opacity: enter, filter: enter < 0.99 ? `blur(${(12 * (1 - enter)).toFixed(2)}px)` : undefined }}>
      <div style={cam}>
        <Handoffs frame={frame} />

        <div style={{ position: "absolute", left: PLAN.x, top: PLAN.y, width: PLAN.w }}>
          <PlanCard frame={frame} />
        </div>
        <div style={{ position: "absolute", left: AGENT.x, top: AGENT.y, width: AGENT.w, ...fly(frame, { at: 40, x: 64, y: 0, scale: 0.97, dur: 22 }) }}>
          <AgentCard frame={frame} />
        </div>
        <div style={{ position: "absolute", left: PHONE.x, top: PHONE.y, ...fly(frame, { at: PHONE_AT, x: 56, y: 0, scale: 0.96, dur: 22 }) }}>
          <PatientPhone frame={frame} />
        </div>
        <div style={{ position: "absolute", left: ESC.x, top: ESC.y, width: ESC.w, ...fly(frame, { at: ESC_AT, x: 56, y: 0, scale: 0.96, dur: 22 }) }}>
          <EscalationCard frame={frame} />
        </div>

        <ClickRing x={ALLOW_BTN.x} y={ALLOW_BTN.y} progress={ramp(frame, ALLOW_AT + 1, 16)} />
        <div style={{ opacity: ramp(frame, 294, 8) * (1 - ramp(frame, ALLOW_AT + 20, 10)) }}>
          <Cursor x={lerp(ALLOW_BTN.x + 120, ALLOW_BTN.x, toAllow)} y={lerp(ALLOW_BTN.y + 260, ALLOW_BTN.y, toAllow)} pressed={pulse(frame, ALLOW_AT, 3, 6)} />
        </div>
        <ClickRing x={CALL_BTN.x} y={CALL_BTN.y} progress={ramp(frame, CALL_AT + 1, 16)} />
        <div style={{ opacity: ramp(frame, CALL_AT - 38, 8) * (1 - ramp(frame, CALL_AT + 24, 10)) }}>
          <Cursor x={lerp(CALL_BTN.x + 260, CALL_BTN.x, toCall)} y={lerp(CALL_BTN.y + 220, CALL_BTN.y, toCall)} pressed={pulse(frame, CALL_AT, 3, 6)} />
        </div>
      </div>
    </AbsoluteFill>
  );
}

const rowCenter = (i: number) => PLAN.y + ROWS.top + i * ROWS.step + ROWS.h / 2;

/** Instruction → action wires, and the phone → care team wire that stays open. */
function Handoffs({ frame }: { frame: number }) {
  const phoneWire = { a: { x: PHONE.x + PHONE.w, y: 560 }, b: { x: ESC.x, y: 560 } };
  const wireDraw = ramp(frame, REPLY_AT + 2, 18, EASE_IN_OUT);
  const pulseT = ramp(frame, REPLY_AT + 6, 20, EASE_IN_OUT);
  const loopStart = ESC_AT + 30;
  const loop = frame >= loopStart ? ((frame - loopStart) % 36) / 36 : -1;
  return (
    <>
      {STEPS.map((_, i) => {
        const draw = ramp(frame, RECEIVE_AT(i) - 6, 14, EASE_IN_OUT);
        const dot = ramp(frame, RECEIVE_AT(i) - 6, 14, EASE_IN_OUT);
        const y = rowCenter(i);
        const x0 = PLAN.x + PLAN.w;
        const len = AGENT.x - x0;
        return (
          <div key={i}>
            <div style={{ position: "absolute", left: x0, top: y - 1, width: len * draw, height: 2, background: C.walnut, opacity: 0.22 }} />
            {dot > 0 && dot < 1 ? <div style={{ position: "absolute", left: x0 + len * dot - 6, top: y - 6, width: 12, height: 12, borderRadius: 99, background: C.ink, boxShadow: "0 0 0 4px rgba(252, 207, 184, 0.75)" }} /> : null}
          </div>
        );
      })}
      <div style={{ position: "absolute", left: phoneWire.a.x, top: phoneWire.a.y - 1, width: (phoneWire.b.x - phoneWire.a.x) * wireDraw, height: 2, background: C.walnut, opacity: 0.3 }} />
      {pulseT > 0 && pulseT < 1 ? (
        <div style={{ position: "absolute", left: lerp(phoneWire.a.x, phoneWire.b.x, pulseT) - 8, top: phoneWire.a.y - 8, width: 16, height: 16, borderRadius: 99, background: C.ink, boxShadow: "0 0 0 6px rgba(252, 207, 184, 0.75)" }} />
      ) : null}
      {loop >= 0 ? (
        <div style={{ position: "absolute", left: lerp(phoneWire.a.x, phoneWire.b.x, EASE_IN_OUT(loop)) - 6, top: phoneWire.a.y - 6, width: 12, height: 12, borderRadius: 99, background: C.walnut, opacity: 0.5 * Math.sin(Math.PI * loop) }} />
      ) : null}
    </>
  );
}

function PlanCard({ frame }: { frame: number }) {
  return (
    <div style={{ ...surface, position: "relative", height: PLAN.h, borderRadius: 36 }}>
      <div style={{ position: "absolute", left: PLAN.pad, right: PLAN.pad, top: PLAN.pad, height: 48, display: "flex", alignItems: "center", gap: 14 }}>
        <Tile icon="home" size={48} tone={C.salmon} />
        <div style={{ flex: 1, fontFamily: F.display, fontWeight: 500, fontSize: 38, letterSpacing: "-0.025em", color: C.walnut }}>Discharge plan</div>
        <Chip tone="outline" size={1.2} icon={<Icon name="heart" size={14} />}>
          Northfield Heart Clinic
        </Chip>
      </div>
      <div style={{ position: "absolute", left: PLAN.pad, top: 104, display: "flex", gap: 8, ...fly(frame, { at: 14, y: 10, dur: 16, blur: 0 }) }}>
        <Chip tone="sand" size={1.2} icon={<Icon name="user" size={14} />}>
          Daniel Ruiz
        </Chip>
        <Chip tone="sand" size={1.2} icon={<Icon name="calendar" size={14} />}>
          Oct 7
        </Chip>
        <Chip tone="green" size={1.2} icon={<Icon name="check" size={13} color={C.liveText} stroke={2.6} />}>
          Shared with Daniel&rsquo;s agent
        </Chip>
      </div>
      {STEPS.map((step, i) => {
        const sent = pulse(frame, RECEIVE_AT(i) - 8, 4, 16);
        return (
          <div
            key={step.title}
            style={{
              position: "absolute",
              left: PLAN.pad - 12,
              right: PLAN.pad - 12,
              top: ROWS.top + i * ROWS.step,
              height: ROWS.h,
              boxSizing: "border-box",
              padding: "0 18px",
              borderRadius: 20,
              background: `rgba(252, 207, 184, ${0.55 * sent})`,
              display: "flex",
              alignItems: "center",
              gap: 18,
              borderTop: i > 0 ? `1px solid ${C.line}` : undefined,
              ...fly(frame, { at: 20 + i * 6, y: 14, dur: 16, blur: 0 }),
            }}
          >
            <div style={{ width: 28, flexShrink: 0, fontFamily: F.display, fontWeight: 500, fontSize: 30, color: C.sand3 }}>{i + 1}</div>
            <div style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 19, lineHeight: "26px", color: C.walnut }}>{step.instruction}</div>
          </div>
        );
      })}
    </div>
  );
}

function DoneChip({ icon = "check", children }: { icon?: IconName; children: ReactNode }) {
  return (
    <Chip tone="green" size={1.2} icon={<Icon name={icon} size={14} color={C.liveText} stroke={icon === "check" ? 2.6 : 2} />}>
      {children}
    </Chip>
  );
}

function AgentCard({ frame }: { frame: number }) {
  const doneCount = STEPS.filter((s) => frame >= s.doneAt).length;
  return (
    <div style={{ ...surface, position: "relative", height: AGENT.h, borderRadius: 36 }}>
      <div style={{ position: "absolute", left: AGENT.pad, right: AGENT.pad, top: AGENT.pad + 2, height: 44, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", height: 44, padding: "0 20px", borderRadius: 999, background: C.ink, fontFamily: F.ui, fontWeight: 500, fontSize: 20, color: C.paper }}>Daniel&rsquo;s Agent</div>
        <Chip tone="sand" size={1.25}>
          {doneCount} of {STEPS.length} done
        </Chip>
      </div>
      <div style={{ position: "absolute", left: AGENT.pad, right: AGENT.pad, top: 104, height: 34, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ flex: 1, height: 6, borderRadius: 99, background: C.chip, overflow: "hidden" }}>
          <div style={{ width: `${(doneCount / STEPS.length) * 100}%`, height: "100%", borderRadius: 99, background: C.live }} />
        </div>
      </div>
      {STEPS.map((step, i) => {
        const doing = frame >= step.doneAt - 16 && frame < step.doneAt;
        const done = frame >= step.doneAt;
        const prompt = i === 4 && frame >= PROMPT_AT && !done;
        return (
          <div
            key={step.title}
            style={{
              position: "absolute",
              left: AGENT.pad - 8,
              right: AGENT.pad - 8,
              top: ROWS.top + i * ROWS.step,
              height: ROWS.h,
              boxSizing: "border-box",
              padding: "0 20px 0 16px",
              borderRadius: 22,
              background: C.beige,
              display: "flex",
              alignItems: "center",
              gap: 16,
              ...fly(frame, { at: RECEIVE_AT(i), x: 24, y: 0, dur: 16, blur: 0 }),
            }}
          >
            <Tile icon={step.icon} size={50} tone={C.paper} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 20, lineHeight: "26px", color: C.walnut }}>{step.title}</div>
              <div style={{ fontFamily: F.body, fontSize: 15, lineHeight: "20px", color: C.muted, whiteSpace: "nowrap" }}>{step.org}</div>
            </div>
            <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 8 }}>
              {done ? (
                <div style={fly(frame, { at: step.doneAt, x: 10, y: 0, scale: 0.85, dur: 12, blur: 0 })}>
                  {step.done.watch ? (
                    <Chip tone="salmon" size={1.2} icon={<Icon name="eye" size={14} color={C.salmonText} />}>
                      {step.done.label}
                    </Chip>
                  ) : (
                    <DoneChip icon={step.done.icon}>{step.done.label}</DoneChip>
                  )}
                </div>
              ) : prompt ? (
                <div style={{ display: "flex", gap: 8, ...fly(frame, { at: PROMPT_AT, x: 10, y: 0, scale: 0.9, dur: 12, blur: 0 }) }}>
                  <div style={{ transform: `scale(${1 - 0.06 * pulse(frame, ALLOW_AT, 3, 8)})` }}>
                    <Button tone="ink" height={40} style={{ width: 90, fontSize: 15 }}>
                      Allow
                    </Button>
                  </div>
                  <Button tone="outline" height={40} style={{ width: 110, fontSize: 15 }}>
                    Not now
                  </Button>
                </div>
              ) : doing ? (
                <Chip tone="paper" size={1.2} icon={<Spinner frame={frame} />}>
                  Coordinating
                </Chip>
              ) : (
                <Chip tone="dashed" size={1.2}>
                  To do
                </Chip>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Spinner({ frame }: { frame: number }) {
  return (
    <svg width={14} height={14} viewBox="0 0 14 14" style={{ display: "block", transform: `rotate(${frame * 14}deg)` }}>
      <circle cx={7} cy={7} r={5.5} fill="none" stroke={C.line2} strokeWidth={2} />
      <path d="M7 1.5a5.5 5.5 0 0 1 5.5 5.5" fill="none" stroke={C.walnut} strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

/* ─── Days later: the patient tells their agent something changed ─────────── */

function PatientPhone({ frame }: { frame: number }) {
  const draft = frame >= SENT_AT ? "" : typed(DRAFT, frame, DRAFT_AT, DRAFT_CPS);
  return (
    <IPhone frame={frame} width={PHONE.w} height={PHONE.h} contact="Agent" draft={draft} composing={frame >= DRAFT_AT - 6 && frame < SENT_AT} sendPress={pulse(frame, SENT_AT - 2, 3, 6)}>
      <Slot frame={frame} at={-40} side="center">
        <TimeStamp day="Saturday" time="8:02 AM" />
      </Slot>
      <Slot frame={frame} at={-30} side="in">
        <Bubble>Good morning, Daniel. What did the scale say today?</Bubble>
      </Slot>
      <Slot frame={frame} at={SENT_AT} side="out" dur={14}>
        <Bubble out>{DRAFT}</Bubble>
      </Slot>
      <Slot frame={frame} at={TYPING_AT} until={REPLY_AT} side="in" dur={12}>
        <TypingBubble frame={frame} />
      </Slot>
      <Slot frame={frame} at={REPLY_AT} side="in" dur={16}>
        <Bubble>{REPLY}</Bubble>
      </Slot>
    </IPhone>
  );
}

const escRow: CSSProperties = { position: "absolute", left: ESC.pad, right: ESC.pad, boxSizing: "border-box", borderRadius: 22, background: C.beige };

function EscalationCard({ frame }: { frame: number }) {
  const calling = ramp(frame, CALL_AT + 4, 10, EASE_IN_OUT);
  return (
    <div style={{ ...surface, position: "relative", height: ESC_BTN.top + ESC_BTN.h + ESC.pad, borderRadius: 36 }}>
      <div style={{ position: "absolute", left: ESC.pad, right: ESC.pad, top: ESC.pad, height: 34, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Chip tone="salmon" size={1.3} icon={<Icon name="alert" size={15} color={C.salmonText} stroke={2.2} />}>
          Escalation
        </Chip>
        <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 16, color: C.muted }}>Sat · 8:05 AM</span>
      </div>
      <div style={{ position: "absolute", left: ESC.pad, top: 90, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ fontFamily: F.display, fontWeight: 500, fontSize: 46, lineHeight: "52px", letterSpacing: "-0.025em", color: C.walnut }}>Daniel Ruiz</div>
        <Chip tone="outline" size={1.2}>
          Heart failure · discharged Oct 7
        </Chip>
      </div>
      <div style={{ ...escRow, top: 166, height: 214, padding: "20px 22px", display: "flex", flexDirection: "column", gap: 14, ...fly(frame, { at: ESC_AT + 10, y: 14, dur: 16, blur: 0 }) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: F.ui, fontWeight: 600, fontSize: 17, color: C.walnut }}>
          <Avatar label="DR" size={30} />
          Reported to Daniel&rsquo;s agent
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["+4 lb since Thursday", "Ankle swelling"].map((label, i) => (
            <div key={label} style={fly(frame, { at: ESC_AT + 16 + i * 5, y: 8, scale: 0.85, dur: 12, blur: 0 })}>
              <Chip tone="paper" size={1.35} icon={<Icon name={i === 0 ? "scale" : "activity"} size={15} />}>
                {label}
              </Chip>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 14px", borderRadius: 16, background: C.paper, ...fly(frame, { at: ESC_AT + 26, y: 8, dur: 14, blur: 0 }) }}>
          <Icon name="link" size={18} color={C.alertText} />
          <div style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 16, lineHeight: "22px", color: C.walnut }}>
            Matches step 2: <span style={{ color: C.muted }}>+3 lb or swelling.</span>
          </div>
        </div>
      </div>
      <div style={{ ...escRow, top: 396, height: 96, padding: "0 20px 0 16px", display: "flex", alignItems: "center", gap: 16, ...fly(frame, { at: ESC_AT + 34, y: 14, dur: 16, blur: 0 }) }}>
        <Tile icon="headset" size={50} tone={C.paper} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 19, lineHeight: "24px", color: C.walnut }}>Heart Failure Clinic</div>
          <div style={{ fontFamily: F.body, fontSize: 15, lineHeight: "20px", color: C.muted }}>Nurse line · Maria Santos, RN</div>
        </div>
        <Chip tone="green" size={1.2} icon={<Icon name="check" size={13} color={C.liveText} stroke={2.6} />}>
          Routed
        </Chip>
      </div>
      <div style={{ position: "absolute", left: ESC.pad, right: ESC.pad, top: ESC_BTN.top, display: "flex", gap: 12, ...fly(frame, { at: ESC_AT + 42, y: 16, dur: 18, blur: 0 }) }}>
        <div style={{ position: "relative", flex: 1, transform: `scale(${1 - 0.04 * pulse(frame, CALL_AT, 3, 8)})` }}>
          <Button tone="ink" height={ESC_BTN.h} icon={<Icon name="phone" size={20} color={C.paper} />} style={{ fontSize: 21, opacity: 1 - calling }}>
            Call Daniel
          </Button>
          <div style={{ position: "absolute", inset: 0, opacity: calling }}>
            <Button tone="ink" height={ESC_BTN.h} icon={<StatusDot color={C.live} size={10} />} style={{ fontSize: 21, background: C.liveBg, color: C.liveText }}>
              Calling Daniel
            </Button>
          </div>
        </div>
        <Button tone="sand" height={ESC_BTN.h} icon={<Icon name="doc" size={20} />} style={{ fontSize: 21, width: ESC_BTN.sideW }}>
          Open chart
        </Button>
      </div>
    </div>
  );
}
