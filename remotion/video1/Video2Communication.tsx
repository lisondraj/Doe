import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Easing, Sequence, interpolateColors, useCurrentFrame } from "remotion";

import { DotWave, Stage } from "./backdrops";
import { Bubble, IPHONE_BEZEL, IPhone, Slot, TimeStamp, TypingBubble } from "./imessage";
import { CAMERA_EASE, EASE_IN, EASE_IN_OUT, EASE_OUT, camera, clock, fly, keys, lerp, pulse, ramp, sceneFade, typed } from "./motion";
import { C, F } from "./theme";
import { AppShell, Chip, ClickRing, Cursor, Icon, ShadowsContext, StatusDot, type IconName } from "./ui";

export const VIDEO2_COMMUNICATION_FRAMES = 746;

export function Video2Communication() {
  return (
    <ShadowsContext.Provider value={false}>
      <Stage backdrop={<DotWave />}>
        <Sequence from={0} durationInFrames={CALL_FRAMES} name="Agent text to call">
          <CallScene />
        </Sequence>
        <Sequence from={CALL_FRAMES - 10} durationInFrames={HANDLED_FRAMES} name="Handled">
          <HandledScene />
        </Sequence>
        <Sequence from={CALL_FRAMES - 10 + HANDLED_FRAMES} durationInFrames={INTAKE_FRAMES} name="Intake">
          <IntakeScene />
        </Sequence>
        <Sequence from={CALL_FRAMES - 10 + HANDLED_FRAMES + INTAKE_FRAMES} durationInFrames={SCHEDULE_FRAMES} name="Schedule">
          <ScheduleScene />
        </Sequence>
      </Stage>
    </ShadowsContext.Provider>
  );
}

/** Renders a Paper component at its native size, scaled up around a screen-space center. */
function Scaled({ width, height, scale, cx, cy, style, children }: { width: number; height: number; scale: number; cx: number; cy: number; style?: CSSProperties; children: ReactNode }) {
  return (
    <div style={{ position: "absolute", left: cx - (width * scale) / 2, top: cy - (height * scale) / 2, width: width * scale, height: height * scale, ...style }}>
      <div style={{ width, height, transform: `scale(${scale})`, transformOrigin: "0 0" }}>{children}</div>
    </div>
  );
}

/* ─── Agent text → call corner (Paper: Pulse 00a Call — Leo Jacobs) ────────── */

const PHONE = { w: 393, h: 852 };
const ASK_AT = 30;
const ASK_TWO_AT = 76;
const REPLY = "Yes, please handle it";
const REPLY_TYPE_AT = 100;
const REPLY_SENT_AT = 136;
/** Match-cut morph: the phone’s bezel and screen reshape into the app shell and its paper page. */
const SEAM_AT = 156;
const SEAM_DUR = 26;
const SEAM_END = SEAM_AT + SEAM_DUR;
const CONTENT_AT = SEAM_AT + 4;
const CALL_BUILD_EASE = Easing.bezier(0.25, 0.1, 0.25, 1);
const PHONE_CAM = { x: 960, y: 800, s: 2.14 };
const SHELL_CAM = { x: 690, y: 545, s: 1.58 };
const SEAM_EASE = Easing.bezier(0.55, 0, 0.12, 1);
const CALL_FRAMES = 324;
const SHELL = { x: 240, y: 90 };
const toScreen = (cam: { x: number; y: number; s: number }, x: number, y: number, w: number, h: number) => ({ x: (x - cam.x) * cam.s + 960, y: (y - cam.y) * cam.s + 540, w: w * cam.s, h: h * cam.s });
const PHONE_ON_SCREEN = toScreen(PHONE_CAM, 960 - PHONE.w / 2, 540 - PHONE.h / 2, PHONE.w, PHONE.h);
const SHELL_ON_SCREEN = toScreen(SHELL_CAM, SHELL.x, SHELL.y, 1440, 900);

const TRANSCRIPT = [
  { t: "0:00", who: "Ruby", text: "Atlantic Pediatric ENT, Dr. Alvarez’s office. This is Ruby.", at: 226 },
  { t: "0:04", who: "Mia’s Agent", text: "Hi Ruby, I’m calling for Mia Jacobs to complete Leo’s pre-visit call.", at: 240 },
  { t: "0:10", who: "Ruby", text: "Of course. Is this Leo, born March 3, 2020, seeing Dr. Alvarez Wednesday?", at: 254 },
  { t: "0:15", who: "Mia’s Agent", text: "Yes. Right ear pain for four days, and five ear infections this year.", at: 268 },
];

const DEMOGRAPHICS = ["6 yrs", "Mar 3, 2020", "Mia Jacobs", "Right ear", "Dr. Alvarez"];

const WAVE = [6, 8, 11, 9, 13, 15, 10, 7, 9, 12, 14, 11, 8, 6, 9, 13, 16, 12, 9, 7, 10, 14, 15, 11, 8, 10, 12, 14, 9, 6, 8, 11, 13, 10, 7, 9, 12, 15, 13, 9, 7, 6, 8, 10, 12, 9, 7, 8, 10, 11, 8, 6, 7, 9, 11, 8, 6, 7, 6, 5];

function CallScene() {
  const frame = useCurrentFrame();
  const phoneCam = camera(frame, [
    { f: 0, x: 960, y: 540, s: 1 },
    { f: 16, x: 960, y: 540, s: 1 },
    { f: 60, x: 960, y: 790, s: 2.05 },
    { f: SEAM_AT, ...PHONE_CAM },
  ]);
  const callCam = camera(frame, [
    { f: SEAM_END, ...SHELL_CAM },
    { f: CALL_FRAMES, x: 680, y: 615, s: 1.7 },
  ]);
  const played = lerp(
    0,
    0.9,
    ramp(frame, CONTENT_AT + 30, CALL_FRAMES - CONTENT_AT - 30, (t) => t),
  );
  const draft = frame < REPLY_SENT_AT ? typed(REPLY, frame, REPLY_TYPE_AT, 20) : "";

  return (
    <AbsoluteFill style={sceneFade(frame, 0, CALL_FRAMES - 16)}>
      {frame >= SEAM_AT && frame < SEAM_END ? <PhoneToShell frame={frame} played={played} /> : null}
      {frame >= SEAM_END - 8 ? (
        <AbsoluteFill style={{ opacity: ramp(frame, SEAM_END - 8, 6) }}>
          <div style={callCam}>
            <div style={{ position: "absolute", left: SHELL.x, top: SHELL.y }}>
              <AppShell active={0} railReveal={(i) => ramp(frame, CONTENT_AT + 6 + i * 3, 12, EASE_OUT)}>
                <CallPage frame={frame} played={played} />
              </AppShell>
            </div>
          </div>
        </AbsoluteFill>
      ) : null}
      {frame < SEAM_AT + 9 ? (
        <AbsoluteFill style={{ opacity: 1 - ramp(frame, SEAM_AT + 1, 8) }}>
          <div style={phoneCam}>
            <div style={{ position: "absolute", left: 960 - PHONE.w / 2, top: 540 - PHONE.h / 2, ...fly(frame, { at: 0, y: 40, dur: 22, blur: 8 }) }}>
              <IPhone frame={frame} width={PHONE.w} height={PHONE.h} draft={draft} composing={frame >= REPLY_TYPE_AT - 10 && frame < REPLY_SENT_AT} sendPress={pulse(frame, REPLY_SENT_AT - 4, 3, 6)}>
                <Slot frame={frame} at={6} side="center">
                  <TimeStamp day="Today" time="2:24 PM" />
                </Slot>
                <Slot frame={frame} at={10} until={ASK_AT} side="in" dur={14}>
                  <TypingBubble frame={frame} />
                </Slot>
                <Slot frame={frame} at={ASK_AT} side="in" dur={20}>
                  <Bubble>Dr. Alvarez requires a pre-visit phone call with a medical assistant before Leo’s appointment.</Bubble>
                </Slot>
                <Slot frame={frame} at={ASK_AT + 22} until={ASK_TWO_AT} side="in" dur={14}>
                  <TypingBubble frame={frame} />
                </Slot>
                <Slot frame={frame} at={ASK_TWO_AT} side="in" dur={18}>
                  <Bubble>Want me to handle this?</Bubble>
                </Slot>
                <Slot frame={frame} at={REPLY_SENT_AT} side="out" dur={16}>
                  <Bubble out>{REPLY}</Bubble>
                </Slot>
              </IPhone>
            </div>
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
}

/** Call-history page content in paper-panel coordinates; shared by the morphing shell and the settled shell. */
function CallPage({ frame, played }: { frame: number; played: number }) {
  const at = (offset: number) => CONTENT_AT + offset;
  const rise = (offset: number, { x = 0, y = 10, scale = 1, blur = 0, dur = 22 }: { x?: number; y?: number; scale?: number; blur?: number; dur?: number } = {}): CSSProperties => {
    const p = ramp(frame, at(offset), dur, CALL_BUILD_EASE);
    return { opacity: p, transform: `translate(${(1 - p) * x}px, ${(1 - p) * y}px) scale(${lerp(scale, 1, p)})`, filter: blur > 0 && p < 1 ? `blur(${(1 - p) * blur}px)` : undefined };
  };
  const settle = (offset: number, y = 10) => rise(offset, { y });
  const step = (offset: number) => rise(offset, { x: 8, y: 0, dur: 18 });
  const title = ramp(frame, at(2), 28, CALL_BUILD_EASE);
  return (
    <>
      <div style={{ ...settle(0), position: "absolute", left: 28, top: 28, display: "flex", alignItems: "center", gap: 10, fontFamily: F.ui, fontWeight: 500, fontSize: 13, color: C.muted }}>
        <Icon name="chevronLeft" size={14} color={C.muted} />
        Voice /
        <Chip tone="outline" trailing={<Icon name="chevronDown" size={11} />}>
          Today
        </Chip>
        /
        <Chip tone="outline" trailing={<Icon name="chevronDown" size={11} />}>
          Leo Jacobs
        </Chip>
      </div>
      <div style={{ position: "absolute", left: 26, top: 74, height: 100, overflow: "hidden", fontFamily: F.display, fontWeight: 500, fontSize: 84, lineHeight: "92px", letterSpacing: "-0.03em", color: C.walnut }}>
        <div style={{ opacity: title, transform: `translateY(${(1 - title) * 72}px)` }}>Leo Jacobs</div>
      </div>
      <div
        style={{
          ...rise(6, { y: 14, scale: 0.98, blur: 2, dur: 28 }),
          position: "absolute",
          left: 28,
          top: 190,
          width: 448,
          boxSizing: "border-box",
          padding: 6,
          borderRadius: 14,
          background: C.beige,
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <div style={{ height: 34, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "2px 10px 0", fontFamily: F.body, fontWeight: 500, fontSize: 13, lineHeight: "18px", color: C.walnut }}>
          {DEMOGRAPHICS.flatMap((item, i) => [
            ...(i > 0 ? [<div key={`dot-${item}`} style={{ width: 3, height: 3, borderRadius: 999, background: "rgba(40, 25, 16, 0.25)", flexShrink: 0, opacity: ramp(frame, at(10 + i * 2), 18, CALL_BUILD_EASE) }} />] : []),
            <span key={item} style={{ whiteSpace: "nowrap", ...step(10 + i * 2) }}>
              {item}
            </span>,
          ])}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <InfoChip icon="phone" style={settle(14, 8)}>
            (415) 555-0142
          </InfoChip>
          <InfoChip icon="calendar" style={settle(16, 8)}>
            Today, Oct 12
            <div style={{ width: 3, height: 3, borderRadius: 999, background: "rgba(40, 25, 16, 0.25)" }} />
            <span style={{ fontWeight: 400, color: C.muted }}>2:31 PM</span>
          </InfoChip>
        </div>
      </div>
      <div
        style={{
          ...rise(10, { y: 22, scale: 0.985, blur: 2, dur: 30 }),
          position: "absolute",
          left: 28,
          top: 296,
          width: 884,
          height: 560,
          boxSizing: "border-box",
          padding: 17,
          borderRadius: 20,
          background: C.paper,
          border: `1px solid ${C.line}`,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, ...settle(15) }}>
          <Chip tone="sand" style={{ height: 34, padding: "0 12px" }}>
            2:31 PM
          </Chip>
          <div style={{ flex: 1, fontFamily: F.ui, fontWeight: 600, fontSize: 15, color: C.walnut }}>Pre-visit Call by Mia’s Personal Agent</div>
          <div style={{ fontFamily: F.body, fontSize: 12, color: C.muted }}>4 actions</div>
        </div>
        <div style={{ height: 56, display: "flex", alignItems: "center", gap: 14, padding: "0 16px 0 10px", borderRadius: 16, background: C.beige, ...settle(18) }}>
          <div style={{ width: 36, height: 36, borderRadius: 999, background: C.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="play" size={14} color={C.paper} filled />
          </div>
          <div style={{ fontFamily: F.body, fontWeight: 500, fontSize: 12, color: C.walnut, fontVariantNumeric: "tabular-nums" }}>{clock(72 * played)}</div>
          <svg width={600} height={28} viewBox="0 0 600 28" style={{ flex: 1 }}>
            {WAVE.map((h, i) => {
              const grow = ramp(frame, at(20) + i * 0.4, 14, CALL_BUILD_EASE);
              return (
                <line
                  key={i}
                  x1={i * 10 + 4}
                  x2={i * 10 + 4}
                  y1={14 - Math.max(1, h * grow)}
                  y2={14 + Math.max(1, h * grow)}
                  stroke={i / WAVE.length < played ? C.walnut : "rgba(40, 25, 16, 0.25)"}
                  strokeWidth={3}
                  strokeLinecap="round"
                  opacity={grow}
                />
              );
            })}
          </svg>
          <div style={{ fontFamily: F.body, fontSize: 12, color: C.muted }}>1:12</div>
          <Chip tone="paper">1×</Chip>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18, paddingTop: 8 }}>
          {TRANSCRIPT.map((line) => (
            <div key={line.t} style={{ display: "flex", gap: 22, ...fly(frame, { at: line.at, y: 18, dur: 16, blur: 4 }) }}>
              <div style={{ width: 34, fontFamily: F.body, fontSize: 12, color: C.muted, paddingTop: 2 }}>{line.t}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 13, color: C.walnut }}>{line.who}</div>
                <div style={{ fontFamily: F.body, fontSize: 15, color: C.walnut }}>{line.text}</div>
              </div>
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: 10, height: 40, padding: "0 14px", borderRadius: 12, background: "rgba(252, 207, 184, 0.35)", ...fly(frame, { at: 284, y: 12, dur: 16, blur: 4 }) }}>
            <div style={{ width: 18, height: 18, borderRadius: 999, background: C.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="check" size={11} color={C.paper} stroke={3} />
            </div>
            <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 13, color: C.walnut }}>Pre-visit Call Complete</span>
            <span style={{ fontFamily: F.body, fontSize: 13, color: C.muted }}>Symptoms and history added to Leo’s chart</span>
          </div>
        </div>
      </div>
      <div
        style={{
          ...rise(13, { x: 28, y: 0, blur: 2, dur: 30 }),
          position: "absolute",
          left: 944,
          top: 296,
          width: 368,
          height: 560,
          boxSizing: "border-box",
          padding: 10,
          borderRadius: 20,
          border: `1px solid ${C.line}`,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div style={{ padding: 12, borderRadius: 16, background: C.beige, display: "flex", flexDirection: "column", gap: 12, ...settle(19) }}>
          <div style={{ fontFamily: F.display, fontWeight: 500, fontSize: 30, lineHeight: "36px", letterSpacing: "-0.02em", color: C.walnut }}>
            Wed, Oct 14
            <br />
            at 9:40 AM
          </div>
          <div style={{ display: "flex", gap: 6, ...settle(23, 6) }}>
            <Chip tone="paper" style={{ height: 28, fontSize: 14 }}>
              Pain in Right Ear
            </Chip>
            <Chip tone="paper" style={{ height: 28, fontSize: 14 }} icon={<StatusDot size={14} color={C.salmon} />}>
              Dr. Alvarez
            </Chip>
          </div>
        </div>
      </div>
    </>
  );
}

function PhoneToShell({ frame, played }: { frame: number; played: number }) {
  const m = ramp(frame, SEAM_AT, SEAM_DUR, SEAM_EASE);
  const a = PHONE_ON_SCREEN;
  const b = SHELL_ON_SCREEN;
  const phoneInset = IPHONE_BEZEL.pad * PHONE_CAM.s;
  const inset = { left: lerp(phoneInset, 64 * SHELL_CAM.s, m), top: lerp(phoneInset, 12 * SHELL_CAM.s, m), right: lerp(phoneInset, 12 * SHELL_CAM.s, m), bottom: lerp(phoneInset, 12 * SHELL_CAM.s, m) };
  const width = lerp(a.w, b.w, m);
  const k = (width - inset.left - inset.right) / (APP_SHELL.w - 76);
  return (
    <div
      style={{
        position: "absolute",
        left: lerp(a.x, b.x, m),
        top: lerp(a.y, b.y, m),
        width,
        height: lerp(a.h, b.h, m),
        borderRadius: lerp(IPHONE_BEZEL.outer * PHONE_CAM.s, 28 * SHELL_CAM.s, m),
        background: interpolateColors(m, [0, 1], [IPHONE_BEZEL.body, C.ink]),
        boxShadow: `0 0 0 ${PHONE_CAM.s * (1 - m)}px ${IPHONE_BEZEL.ring}`,
      }}
    >
      <div
        style={{
          position: "absolute",
          ...inset,
          overflow: "hidden",
          borderRadius: lerp(IPHONE_BEZEL.inner * PHONE_CAM.s, 24 * SHELL_CAM.s, m),
          background: interpolateColors(m, [0, 1], ["#FFFFFF", C.paper]),
          backgroundImage: `radial-gradient(rgba(40, 25, 16, ${0.09 * m}) 1px, transparent 1.3px)`,
          backgroundSize: `${18 * k}px ${18 * k}px`,
        }}
      >
        {frame >= CONTENT_AT ? (
          <div style={{ position: "absolute", left: 0, top: 0, width: APP_SHELL.w - 76, height: APP_SHELL.h - 24, transform: `scale(${k})`, transformOrigin: "0 0" }}>
            <CallPage frame={frame} played={played} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function InfoChip({ icon, style, children }: { icon: IconName; style?: CSSProperties; children: ReactNode }) {
  return (
    <div
      style={{
        flexGrow: 1,
        height: 34,
        boxSizing: "border-box",
        padding: "0 12px 0 10px",
        borderRadius: 10,
        background: C.paper,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        fontFamily: F.body,
        fontWeight: 500,
        fontSize: 13,
        lineHeight: "18px",
        color: C.walnut,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      <Icon name={icon} size={14} color={C.muted} />
      {children}
    </div>
  );
}

/* ─── Handled (Paper: Handled list + Live / Today / Week header controls) ──── */

const HANDLED = [
  { name: "Leo Jacobs", status: "Pre-visit call done" },
  { name: "Noah Kim", status: "Booked Thu" },
  { name: "Harper Young", status: "Harbor Mutual verified" },
  { name: "Ava Thompson", status: "Moved to Tue" },
  { name: "Mason Rivera", status: "Booked Nov 4" },
  { name: "Sofía Herrera", status: "Hours given" },
  { name: "Grace Okafor", status: "Booked Wed" },
  { name: "Lucía Morales", status: "Directions sent" },
  { name: "Owen Fischer", status: "Intake complete" },
  { name: "Liam Patel", status: "Refill logged" },
  { name: "Henry Walsh", status: "Booked Fri" },
  { name: "Diego Ruiz", status: "Records sent" },
];
const HANDLED_BASE = 37;
const ENTER_AT = (i: number) => 6 + i * 3;
const DONE_AT = (i: number) => 18 + i * 5;
const HANDLED_W = 424;
const SURFACE_PAD = 16;
const LIST_H = 486;
const GROUP_H = 22;
const ROW_H = 52;
const ROW_GAP = 6;
const MAX_SCROLL = GROUP_H + ROW_GAP + HANDLED.length * (ROW_H + ROW_GAP) - ROW_GAP - LIST_H;
/** The Handled panel reshapes into the Intake panel, which picks up at its first frame. */
const MORPH_AT = 100;
const MORPH_DUR = 30;
/** Handled rows that each reshape into one intake form card. */
const MORPH_ROWS = [4, 5, 6, 7, 8, 9];
/** Rows first narrow into their columns, then drop into rows and grow, so cards never pass over each other. */
const ROW_X_DUR = 13;
const ROW_STAGGER = 1;
const ROW_Y_AT = 15;
const ROW_Y_DUR = 20;
/** The box and the cards swap beige and paper in one quick beat, so the panel never sits in a flat mid-tone. */
const TONE_FLIP_AT = MORPH_AT + 8;
const HANDLED_FRAMES = MORPH_AT + ROW_Y_AT + ROW_Y_DUR;
const SOFT = "rgba(40, 25, 16, 0.08)";
const SUBTLE = "rgba(40, 25, 16, 0.62)";

/** Items fade out as they slide up under the fixed "Handled" header. */
const underHeader = (top: number, scroll: number, height: number) => Math.min(1, Math.max(0, (top - scroll + height * 0.6) / 40));

function HandledScene() {
  const frame = useCurrentFrame();
  const done = HANDLED.filter((_, i) => frame >= DONE_AT(i) + 4).length;
  const scroll = keys(frame, [28, 88], [0, MAX_SCROLL], EASE_IN_OUT);
  const morph = ramp(frame, MORPH_AT, MORPH_DUR, CAMERA_EASE);
  const widen = ramp(frame, MORPH_AT, ROW_X_DUR, CAMERA_EASE);
  const fadeOut = 1 - ramp(frame, MORPH_AT, 8, EASE_IN_OUT);
  const flip = ramp(frame, TONE_FLIP_AT, 10, EASE_IN_OUT);
  const push = lerp(lerp(1.42, 1.48, ramp(frame, 0, MORPH_AT, EASE_IN_OUT)), INTAKE_PUSH, morph);
  const width = lerp(HANDLED_W + SURFACE_PAD * 2, INTAKE_W, widen);
  const height = lerp(SURFACE_PAD * 2 + 38 + 16 + 16 + 36 + 8 + LIST_H, INTAKE_H, morph);

  return (
    <AbsoluteFill style={{ opacity: ramp(frame, 0, 10) }}>
      <Scaled width={width} height={height} scale={push} cx={960} cy={540}>
        <div
          style={{
            position: "relative",
            width,
            height,
            boxSizing: "border-box",
            padding: lerp(SURFACE_PAD, 0, morph),
            borderRadius: 28,
            background: `rgba(255, 252, 241, ${1 - ramp(frame, MORPH_AT + 4, 14, EASE_IN_OUT)})`,
            display: "flex",
            flexDirection: "column",
            gap: lerp(16, HEADER_GAP, morph),
            ...fly(frame, { at: 0, y: 24, dur: 18, blur: 6 }),
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10, width: width - lerp(SURFACE_PAD, 0, morph) * 2, ...fly(frame, { at: 4, y: 14, dur: 16, blur: 4 }) }}>
            <div style={{ position: "relative", flex: `${1 - morph} 0 auto`, display: "flex", padding: 3, gap: 2, borderRadius: 999, background: SOFT }}>
              <div style={{ display: "flex", gap: 2, opacity: ramp(frame, MORPH_AT + 8, 14) }}>
                <IntakeTabItems frame={0} expand={0} />
              </div>
              <div style={{ position: "absolute", inset: 3, display: "flex", gap: 2, opacity: 1 - ramp(frame, MORPH_AT + 2, 14) }}>
                <HandledTabItems />
              </div>
            </div>
            <div
              style={{
                width: lerp(38, 0, morph),
                height: 38,
                marginLeft: lerp(0, -10, morph),
                flexShrink: 0,
                overflow: "hidden",
                borderRadius: 999,
                background: SOFT,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 1 - ramp(frame, MORPH_AT, 8),
              }}
            >
              <Icon name="search" size={16} color={C.ink} stroke={2} />
            </div>
            <MorphButton from="Voice Agent" to="New Form" t={ramp(frame, MORPH_AT + 6, 16, EASE_IN_OUT)} />
          </div>
          <div
            style={{
              flex: 1,
              boxSizing: "border-box",
              padding: 8,
              borderRadius: 20,
              background: interpolateColors(flip, [0, 1], [C.beige, C.paper]),
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              gap: 8,
              ...fly(frame, { at: 2, y: 18, dur: 18, blur: 4 }),
            }}
          >
            <div style={{ height: 36, flexShrink: 0, padding: "0 8px", display: "flex", alignItems: "center", gap: 8, opacity: fadeOut }}>
              <div style={{ width: 8, height: 8, borderRadius: 999, background: C.walnut }} />
              <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 14, color: C.walnut }}>Handled</span>
              <span style={{ fontFamily: F.body, fontSize: 13, color: SUBTLE, fontVariantNumeric: "tabular-nums" }}>{HANDLED_BASE + done}</span>
            </div>
            <div style={{ height: LIST_H, overflow: "hidden", opacity: fadeOut }}>
              <div style={{ display: "flex", flexDirection: "column", gap: ROW_GAP, transform: `translateY(${-scroll}px)` }}>
                <div style={{ height: GROUP_H, padding: "0 8px", display: "flex", alignItems: "center", justifyContent: "space-between", opacity: underHeader(0, scroll, GROUP_H) }}>
                  <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 13, color: C.walnut }}>Today</span>
                  <span style={{ fontFamily: F.body, fontSize: 12, color: SUBTLE }}>Mon, Oct 12</span>
                </div>
                {HANDLED.map((row, i) => (
                  <div key={row.name} style={{ visibility: frame >= MORPH_AT && MORPH_ROWS.includes(i) ? "hidden" : undefined }}>
                    <HandledRow frame={frame} index={i} name={row.name} status={row.status} fade={underHeader(GROUP_H + ROW_GAP + i * (ROW_H + ROW_GAP), scroll, ROW_H)} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          {frame >= MORPH_AT
            ? MORPH_ROWS.map((rowIndex, k) => {
                const tx = ramp(frame, MORPH_AT + k * ROW_STAGGER, ROW_X_DUR, CAMERA_EASE);
                const ty = ramp(frame, MORPH_AT + ROW_Y_AT, ROW_Y_DUR, CAMERA_EASE);
                const rowOut = 1 - ramp(frame, MORPH_AT + k * ROW_STAGGER, 6, EASE_IN_OUT);
                const tileIn = ramp(frame, MORPH_AT + ROW_Y_AT + 4, 12, EASE_OUT);
                const from = { x: SURFACE_PAD + 8, y: SURFACE_PAD + 38 + 16 + 8 + 36 + 8 + GROUP_H + ROW_GAP + rowIndex * (ROW_H + ROW_GAP) - MAX_SCROLL, w: HANDLED_W - 16, h: ROW_H };
                const to = { x: 8 + (k % 3) * (TILE_W + 8), y: HEADER_H + HEADER_GAP + 8 + Math.floor(k / 3) * (TILE_H + 8), w: TILE_W, h: TILE_H };
                const row = HANDLED[rowIndex];
                const form = FORMS[k];
                return (
                  <div
                    key={row.name}
                    style={{
                      position: "absolute",
                      left: lerp(from.x, to.x, tx),
                      top: lerp(from.y, to.y, ty),
                      width: lerp(from.w, to.w, tx),
                      height: lerp(from.h, to.h, ty),
                      borderRadius: 14,
                      background: interpolateColors(flip, [0, 1], [C.paper, C.beige]),
                      overflow: "hidden",
                      boxShadow: `0 1px 2px rgba(40, 25, 16, ${0.06 * (1 - tx)})`,
                    }}
                  >
                    <div style={{ position: "absolute", left: 0, top: 0, width: from.w, opacity: rowOut }}>
                      <HandledRow frame={frame} index={rowIndex} name={row.name} status={row.status} fade={1} />
                    </div>
                    <div style={{ position: "absolute", inset: 0, opacity: tileIn }}>
                      <FormTile name={form.name} meta={form.meta} lines={form.lines} width="100%" height="100%" />
                    </div>
                  </div>
                );
              })
            : null}
        </div>
      </Scaled>
    </AbsoluteFill>
  );
}

function HandledTabItems() {
  return (
    <>
      <div
        style={{
          flex: 1,
          height: 32,
          padding: "0 14px 0 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 7,
          borderRadius: 999,
          background: C.paper,
          boxShadow: "0 1px 2px rgba(40, 25, 16, 0.12)",
          fontFamily: F.body,
          fontWeight: 500,
          fontSize: 13,
          lineHeight: "18px",
          color: C.ink,
        }}
      >
        <div style={{ width: 7, height: 7, borderRadius: 999, background: C.live }} />
        Live
      </div>
      {["Today", "Week"].map((label) => (
        <div key={label} style={{ flex: 1, height: 32, padding: "0 14px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.body, fontWeight: 500, fontSize: 13, lineHeight: "18px", color: SUBTLE }}>
          {label}
        </div>
      ))}
    </>
  );
}

function IntakeTabItems({ frame, expand }: { frame: number; expand: number }) {
  const badge = ramp(frame, PICK_AT, 10, EASE_OUT);
  return (
    <>
      {["Forms", "Inbox"].map((label, i) => {
        const active = i === 0 ? 1 - expand : expand;
        return (
          <div
            key={label}
            style={{
              height: 32,
              padding: "0 14px",
              display: "flex",
              alignItems: "center",
              gap: 7,
              borderRadius: 999,
              background: `rgba(255, 252, 241, ${active})`,
              boxShadow: active > 0.5 ? "0 1px 2px rgba(40, 25, 16, 0.12)" : undefined,
              fontFamily: F.body,
              fontWeight: 500,
              fontSize: 13,
              lineHeight: "18px",
              color: active > 0.5 ? C.ink : SUBTLE,
            }}
          >
            {label}
            {i === 1 ? (
              <span
                style={{
                  width: 18 * badge,
                  height: 18,
                  marginLeft: -7 * (1 - badge),
                  overflow: "hidden",
                  borderRadius: 999,
                  background: C.ink,
                  color: C.paper,
                  fontSize: 11,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: badge,
                  transform: `scale(${lerp(0.6, 1, badge)})`,
                }}
              >
                1
              </span>
            ) : null}
          </div>
        );
      })}
    </>
  );
}

/** Ink pill whose label cross-fades; both labels share one grid cell so the width never jumps. */
function MorphButton({ from, to, t }: { from: string; to: string; t: number }) {
  return (
    <div style={{ height: 38, flexShrink: 0, padding: "0 16px 0 13px", display: "flex", alignItems: "center", gap: 7, borderRadius: 999, background: C.ink, fontFamily: F.body, fontWeight: 500, fontSize: 13, lineHeight: "18px", color: C.paper }}>
      <Icon name="plus" size={14} color={C.paper} stroke={2.2} />
      <div style={{ display: "grid" }}>
        <span style={{ gridArea: "1 / 1", opacity: 1 - t, whiteSpace: "nowrap" }}>{from}</span>
        <span style={{ gridArea: "1 / 1", opacity: t, whiteSpace: "nowrap", textAlign: "center" }}>{to}</span>
      </div>
    </div>
  );
}

function HandledRow({ frame, index, name, status, fade }: { frame: number; index: number; name: string; status: string; fade: number }) {
  const progress = ramp(frame, DONE_AT(index), 8);
  const enter = fly(frame, { at: ENTER_AT(index), y: 14, dur: 14, blur: 3 });
  return (
    <div
      style={{
        height: ROW_H,
        flexShrink: 0,
        boxSizing: "border-box",
        padding: "0 14px",
        borderRadius: 14,
        background: C.paper,
        boxShadow: "0 1px 2px rgba(40, 25, 16, 0.06)",
        display: "flex",
        alignItems: "center",
        gap: 10,
        ...enter,
        opacity: Number(enter.opacity ?? 1) * fade,
      }}
    >
      <span style={{ flex: 1, fontFamily: F.ui, fontWeight: 600, fontSize: 14, color: C.walnut }}>{name}</span>
      <span style={{ position: "relative", fontFamily: F.body, fontSize: 13, color: SUBTLE, whiteSpace: "nowrap" }}>
        <span style={{ opacity: 1 - progress }}>Handling…</span>
        <span style={{ position: "absolute", right: 0, top: 0, opacity: progress, transform: `translateY(${(1 - progress) * 6}px)` }}>{status}</span>
      </span>
      <div style={{ width: 16, height: 16, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
        {progress <= 0 ? (
          <div style={{ width: 6, height: 6, borderRadius: 999, background: "rgba(40, 25, 16, 0.3)", opacity: 0.5 + 0.5 * Math.sin(frame * 0.35 - index) }} />
        ) : (
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none">
            <path d="M5 12.5l4.5 4.5L19 7.5" stroke="#4F7140" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - progress} />
          </svg>
        )}
      </div>
    </div>
  );
}

/* ─── Intake (clinic form library → Leo’s documents arrive) ────────────────── */

const FORMS = [
  { name: "New Patient Intake", meta: "18 fields", lines: [0.8, 0.55, 0.7, 0.4] },
  { name: "Pre-visit Questionnaire", meta: "12 fields", lines: [0.6, 0.75, 0.45, 0.65] },
  { name: "Ear Tube Consult", meta: "6 fields", lines: [0.7, 0.5, 0.8, 0.55] },
  { name: "Insurance & Referral", meta: "9 fields", lines: [0.5, 0.7, 0.6, 0.35] },
  { name: "Hearing History", meta: "10 fields", lines: [0.75, 0.4, 0.65, 0.5] },
  { name: "Consent to Treat", meta: "4 fields", lines: [0.65, 0.8, 0.35, 0.6] },
];
const PICKED = 2;
const PICK_AT = 38;
const EXPAND_AT = 46;
const EXPAND_DUR = 22;

const RECEIVED: { name: string; meta: string; at: number }[] = [
  { name: "Phone Intake", meta: "Mia’s Personal Agent", at: 72 },
  { name: "Harbor Mutual Card", meta: "Member •••• 4471", at: 88 },
  { name: "Health Card", meta: "Member •••• 2208", at: 104 },
];
const FIELDS = [
  { label: "Patient", value: "Leo Jacobs", at: 80 },
  { label: "Date of birth", value: "Mar 3, 2020", at: 84 },
  { label: "Referral", value: "On file", at: 88 },
  { label: "Insurance", value: "Harbor Mutual", at: 96 },
  { label: "Ear infections, 12 mo", value: "5", at: 100 },
  { label: "Health card", value: "Verified", at: 112 },
];
const CLEAR_AT = 130;
const BLOB_AT = 138;
const BLOB_DUR = 18;
const LABEL_AT = 152;
const READY_CLICK_AT = 172;
const GROW_AT = 176;
const GROW_DUR = 20;
const INTAKE_FRAMES = GROW_AT + GROW_DUR;
const READY_W = 720;
const READY_H = 132;
const APP_SHELL = { w: 1440, h: 900 };

const INTAKE_PUSH = 1.48;
const INTAKE_ZOOM_EASE = Easing.bezier(0.3, 0.15, 0.55, 1);
const INTAKE_W = 760;
const INTAKE_H = 482;
const HEADER_H = 38;
const HEADER_GAP = 14;
const BOX_H = INTAKE_H - HEADER_H - HEADER_GAP;
const BODY_W = INTAKE_W - 16;
const BODY_H = BOX_H - 16;
const TILE_W = (BODY_W - 16) / 3;
const TILE_H = (BODY_H - 8) / 2;

/** Centre of the picked form card, relative to the panel centre. */
const PICK_ANCHOR = { x: 8 + (PICKED % 3) * (TILE_W + 8) + TILE_W / 2 - INTAKE_W / 2, y: HEADER_H + HEADER_GAP + 8 + Math.floor(PICKED / 3) * (TILE_H + 8) + TILE_H / 2 - INTAKE_H / 2 };

/**
 * One steady push-in across both screens. On the grid it zooms about the picked card, so the card holds still while the grid grows
 * around it; as the card expands the anchor glides back to the panel centre, and the form pushes straight in, centred for the collapse.
 */
function intakeCamera(frame: number) {
  const push = lerp(INTAKE_PUSH, 1.68, ramp(frame, 0, BLOB_AT, INTAKE_ZOOM_EASE));
  const anchor = 1 - ramp(frame, EXPAND_AT, EXPAND_DUR + 8, EASE_IN_OUT);
  const grow = (push - INTAKE_PUSH) * anchor;
  return { push, cx: 960 - PICK_ANCHOR.x * grow, cy: 540 - PICK_ANCHOR.y * grow };
}

function IntakeScene() {
  const frame = useCurrentFrame();
  const { push, cx, cy } = intakeCamera(frame);
  const expand = ramp(frame, EXPAND_AT, EXPAND_DUR, EASE_IN_OUT);
  const pick = pulse(frame, PICK_AT, 4, 10);
  const col = PICKED % 3;
  const row = Math.floor(PICKED / 3);
  const rect = { x: lerp(col * (TILE_W + 8), 0, expand), y: lerp(row * (TILE_H + 8), 0, expand), w: lerp(TILE_W, BODY_W, expand), h: lerp(TILE_H, BODY_H, expand) };

  return (
    <AbsoluteFill>
      {frame < BLOB_AT ? (
        <Scaled width={INTAKE_W} height={INTAKE_H} scale={push} cx={cx} cy={cy}>
          <div style={{ width: INTAKE_W, height: INTAKE_H, display: "flex", flexDirection: "column", gap: HEADER_GAP }}>
            <div style={{ height: HEADER_H, display: "flex", alignItems: "center", gap: 10, ...fly(frame, { at: -40, out: CLEAR_AT, outY: -10, outDur: 8 }) }}>
              <div style={{ flex: 1, display: "flex", alignItems: "baseline", gap: 8, paddingLeft: 6 }}></div>
              <div style={{ display: "flex", padding: 3, gap: 2, borderRadius: 999, background: SOFT }}>
                <IntakeTabItems frame={frame} expand={expand} />
              </div>
              <MorphButton from="Voice Agent" to="New Form" t={1} />
            </div>
            <div style={{ position: "relative", flex: 1, boxSizing: "border-box", padding: 8, borderRadius: 20, background: C.paper }}>
              <div style={{ position: "relative", width: BODY_W, height: BODY_H, opacity: 1 - ramp(frame, CLEAR_AT, 8) }}>
                {FORMS.map((form, i) =>
                  i === PICKED ? null : (
                    <div key={form.name} style={{ position: "absolute", left: (i % 3) * (TILE_W + 8), top: Math.floor(i / 3) * (TILE_H + 8), opacity: 1 - ramp(frame, EXPAND_AT, 10) }}>
                      <FormTile name={form.name} meta={form.meta} lines={form.lines} />
                    </div>
                  ),
                )}
                <div
                  style={{
                    position: "absolute",
                    left: rect.x,
                    top: rect.y,
                    width: rect.w,
                    height: rect.h,
                    borderRadius: 14,
                    background: interpolateColors(expand, [0, 1], [C.beige, C.paper]),
                    overflow: "hidden",
                    transform: `scale(${1 + 0.03 * pick})`,
                  }}
                >
                  <div style={{ position: "absolute", inset: 0, opacity: 1 - ramp(frame, EXPAND_AT + 2, 8) }}>
                    <FormTile name={FORMS[PICKED].name} meta={FORMS[PICKED].meta} lines={FORMS[PICKED].lines} />
                  </div>
                  {frame >= EXPAND_AT ? <ConsultForm frame={frame} reveal={ramp(frame, EXPAND_AT + 4, 10)} /> : null}
                </div>
              </div>
            </div>
          </div>
        </Scaled>
      ) : null}
      {frame >= BLOB_AT ? <ReadyToSchedule frame={frame} from={{ w: INTAKE_W * push, h: BOX_H * push, r: 20 * push, dy: ((HEADER_H + HEADER_GAP) / 2) * push }} /> : null}
    </AbsoluteFill>
  );
}

/** The intake panel collapses into the button; once clicked, the button grows into the schedule’s app shell. */
function ReadyToSchedule({ frame, from }: { frame: number; from: { w: number; h: number; r: number; dy: number } }) {
  const collapse = ramp(frame, BLOB_AT, BLOB_DUR, EASE_IN_OUT);
  const grow = ramp(frame, GROW_AT, GROW_DUR, EASE_IN_OUT);
  const press = pulse(frame, READY_CLICK_AT, 3, 6);
  const label = ramp(frame, LABEL_AT, 12, EASE_OUT) * (1 - ramp(frame, GROW_AT, 6));
  const toButton = ramp(frame, LABEL_AT - 4, READY_CLICK_AT - LABEL_AT + 4, EASE_IN_OUT);
  const w = lerp(lerp(from.w, READY_W, collapse), APP_SHELL.w, grow);
  const h = lerp(lerp(from.h, READY_H, collapse), APP_SHELL.h, grow);
  const r = lerp(lerp(from.r, READY_H / 2, collapse), 28, grow);
  const dy = from.dy * (1 - collapse);
  const tip = { x: 1090, y: 566 };
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 960 - w / 2,
          top: 540 + dy - h / 2,
          width: w,
          height: h,
          borderRadius: r,
          background: interpolateColors(collapse, [0, 1], [C.paper, C.ink]),
          transform: `scale(${1 - 0.04 * press})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22, opacity: label, transform: `translateY(${(1 - label) * 12}px)`, color: C.paper, fontFamily: F.ui, fontWeight: 600, fontSize: 54, letterSpacing: "-0.02em", whiteSpace: "nowrap" }}>
          <Icon name="check" size={46} color={C.paper} stroke={2.6} />
          Ready to Schedule
        </div>
      </div>
      <ClickRing x={tip.x} y={tip.y} progress={ramp(frame, READY_CLICK_AT + 1, 16)} />
      {toButton > 0 ? (
        <div style={{ opacity: 1 - ramp(frame, GROW_AT, 6) }}>
          <Cursor x={lerp(1600, tip.x, toButton)} y={lerp(1080, tip.y, toButton)} pressed={press} size={40} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
}

function FormTile({ name, meta, lines, width = TILE_W, height = TILE_H }: { name: string; meta: string; lines: number[]; width?: number | string; height?: number | string }) {
  return (
    <div style={{ width, height, boxSizing: "border-box", padding: 12, borderRadius: 14, background: C.beige, display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ flex: 1, minHeight: 0, overflow: "hidden", boxSizing: "border-box", padding: "14px 14px", borderRadius: 10, background: C.paper, display: "flex", flexDirection: "column", gap: 10 }}>
        {lines.map((w, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: "rgba(40, 25, 16, 0.12)" }} />
            <div style={{ width: `${w * 100}%`, height: 6, borderRadius: 99, background: "rgba(40, 25, 16, 0.12)" }} />
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2, padding: "0 2px" }}>
        <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 14, color: C.walnut, whiteSpace: "nowrap" }}>{name}</span>
        <span style={{ fontFamily: F.body, fontSize: 12, color: SUBTLE }}>{meta}</span>
      </div>
    </div>
  );
}

function ConsultForm({ frame, reveal }: { frame: number; reveal: number }) {
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: BODY_W, height: BODY_H, boxSizing: "border-box", padding: 18, display: "flex", gap: 16, opacity: reveal }}>
      <div style={{ width: 236, display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontFamily: F.display, fontWeight: 500, fontSize: 34, lineHeight: "38px", letterSpacing: "-0.02em", color: C.walnut }}>Leo Jacobs</span>
        <span style={{ fontFamily: F.body, fontWeight: 500, fontSize: 13, color: SUBTLE }}>Ear Tube Consult</span>
        <span style={{ marginTop: "auto", padding: "0 0 2px", fontFamily: F.ui, fontWeight: 600, fontSize: 13, color: C.walnut }}>Received</span>
        {RECEIVED.map((doc) => (
          <div
            key={doc.name}
            style={{
              height: 56,
              flexShrink: 0,
              boxSizing: "border-box",
              padding: "0 14px 0 8px",
              borderRadius: 12,
              border: "1px solid rgba(40, 25, 16, 0.14)",
              display: "flex",
              alignItems: "center",
              gap: 10,
              ...fly(frame, { at: doc.at, x: -24, y: 0, dur: 16, blur: 4 }),
            }}
          >
            <div style={{ width: 38, height: 38, flexShrink: 0, borderRadius: 999, background: C.salmon }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 1, minWidth: 0 }}>
              <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 13, color: C.walnut }}>{doc.name}</span>
              <span style={{ fontFamily: F.body, fontSize: 12, color: SUBTLE, whiteSpace: "nowrap" }}>{doc.meta}</span>
            </div>
            <div style={{ marginLeft: "auto", flexShrink: 0, display: "flex" }}>
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={SUBTLE} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7M9 7h8v8" />
              </svg>
            </div>
          </div>
        ))}
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        {FIELDS.map((field) => {
          const fill = ramp(frame, field.at, 10, EASE_OUT);
          return (
            <div key={field.label} style={{ flex: 1, boxSizing: "border-box", padding: "0 16px", borderRadius: 12, background: C.beige, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ flex: 1, fontFamily: F.body, fontSize: 13, color: SUBTLE }}>{field.label}</span>
              <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 15, color: C.walnut, opacity: fill, transform: `translateX(${(1 - fill) * 8}px)` }}>{field.value}</span>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                {fill > 0 ? (
                  <path d="M5 12.5l4.5 4.5L19 7.5" stroke="#4F7140" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - fill} />
                ) : (
                  <circle cx={12} cy={12} r={3} fill="rgba(40, 25, 16, 0.25)" />
                )}
              </svg>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Schedule (Doe app shell — Leo’s appointment lands in the week) ───────── */

const WEEK = [
  { d: "Mon", n: "12" },
  { d: "Tue", n: "13" },
  { d: "Wed", n: "14" },
  { d: "Thu", n: "15" },
  { d: "Fri", n: "16" },
];
const HOURS = ["8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM"];
const VISITS = [
  { day: 0, start: 20, dur: 40, name: "Noah Kim", kind: "Follow-Up" },
  { day: 0, start: 120, dur: 40, name: "Ava Thompson", kind: "Hearing Test" },
  { day: 0, start: 260, dur: 40, name: "Zoe Martin", kind: "Post-Op" },
  { day: 1, start: 60, dur: 40, name: "Harper Young", kind: "New Patient" },
  { day: 1, start: 200, dur: 40, name: "Owen Fischer", kind: "Allergy Consult" },
  { day: 2, start: 20, dur: 40, name: "Grace Okafor", kind: "Follow-Up" },
  { day: 2, start: 180, dur: 40, name: "Mason Rivera", kind: "Ear Tube Check" },
  { day: 2, start: 280, dur: 40, name: "Ella Brooks", kind: "Post-Op" },
  { day: 3, start: 20, dur: 40, name: "Lucía Morales", kind: "New Patient" },
  { day: 3, start: 240, dur: 40, name: "Liam Patel", kind: "Sinus Consult" },
  { day: 4, start: 40, dur: 40, name: "Henry Walsh", kind: "Follow-Up" },
  { day: 4, start: 240, dur: 40, name: "Diego Ruiz", kind: "Hearing Test" },
];
const LEO_VISIT = { day: 2, start: 100, dur: 40 };
/** Visits start and end on 20-minute steps so every card lines up with the time scale. */
/** Doe secondary shades: new patients in salmon, follow-ups in sage; everything else stays sand. */
const VISIT_TONE: Record<string, string> = { "New Patient": C.salmon, "Follow-Up": "#D6DEC6" };
/** A deeper step of each card's own hue for its time pill. */
const VISIT_PILL: Record<string, string> = { "New Patient": "#F6B696", "Follow-Up": "#C2CDAB" };
const VISIT_PILL_DEFAULT = "#E6DBC2";
const ZOOM_AT = 4;
const ZOOM_DUR = 40;
const SLOT_CLICK_AT = 52;
const SCHEDULE_FRAMES = 100;

const SCHEDULE_SHELL = { x: 240, y: 90 };
const CAL = { left: 28, top: 140, width: 1308, height: 708, pad: 8, head: 40, gutter: 64 };
const COL_GAP = 8;
const COL_W = (CAL.width - CAL.pad * 2 - CAL.gutter - COL_GAP * 4) / 5;
const GRID_TOP = CAL.pad + CAL.head + 8;
const HOUR_H = (CAL.height - GRID_TOP - CAL.pad) / HOURS.length;
const visitRect = (day: number, start: number, dur: number) => ({ x: CAL.pad + CAL.gutter + day * (COL_W + COL_GAP) + 6, y: GRID_TOP + (start / 60) * HOUR_H + 3, w: COL_W - 12, h: (dur / 60) * HOUR_H - 6 });
const LEO_RECT = visitRect(LEO_VISIT.day, LEO_VISIT.start, LEO_VISIT.dur);
/** Center of Leo’s empty slot in world space; the paper panel sits at shell + (64, 12). */
const ZOOM_FOCUS = { x: SCHEDULE_SHELL.x + 64 + CAL.left + LEO_RECT.x + LEO_RECT.w / 2, y: SCHEDULE_SHELL.y + 12 + CAL.top + LEO_RECT.y + LEO_RECT.h / 2 };

/** Start time as a clock label; `minutes` counts from 8:00 AM, the first hour on the schedule. */
const clockTime = (minutes: number) => {
  const total = 8 * 60 + minutes;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
};

/** Visit card text: the name on top, with the time as a small Doe pill underneath. */
function VisitText({ name, start, ink = C.walnut, pill = "rgba(255, 252, 241, 0.78)" }: { name: string; start: number; ink?: string; pill?: string }) {
  const chip: CSSProperties = {
    height: 20,
    padding: "0 8px",
    borderRadius: 999,
    background: pill,
    display: "flex",
    alignItems: "center",
    fontFamily: F.body,
    fontWeight: 500,
    fontSize: 12,
    lineHeight: "20px",
    color: ink,
    whiteSpace: "nowrap",
    fontVariantNumeric: "tabular-nums",
  };
  return (
    <>
      <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 16, lineHeight: "20px", letterSpacing: "-0.01em", color: ink, whiteSpace: "nowrap" }}>{name}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
        <span style={chip}>{clockTime(start)}</span>
      </div>
    </>
  );
}

function ScheduleScene() {
  const frame = useCurrentFrame();
  const cam = camera(frame, [
    { f: 0, x: 960, y: 540, s: 1 },
    { f: ZOOM_AT, x: 960, y: 540, s: 1 },
    { f: ZOOM_AT + ZOOM_DUR, x: ZOOM_FOCUS.x, y: ZOOM_FOCUS.y, s: 2.4 },
    { f: SCHEDULE_FRAMES, x: ZOOM_FOCUS.x, y: ZOOM_FOCUS.y, s: 2.5 },
  ]);
  const reveal = ramp(frame, 0, 16, EASE_OUT);
  const toSlot = ramp(frame, ZOOM_AT + 14, SLOT_CLICK_AT - ZOOM_AT - 14, EASE_IN_OUT);
  const press = pulse(frame, SLOT_CLICK_AT, 3, 6);
  const land = ramp(frame, SLOT_CLICK_AT + 1, 14, EASE_OUT);
  const tip = { x: 960 + 200, y: 540 + 36 };

  return (
    <AbsoluteFill>
      <AbsoluteFill>
        <div style={cam}>
          <div style={{ position: "absolute", left: SCHEDULE_SHELL.x, top: SCHEDULE_SHELL.y }}>
            <AppShell active={5} plain>
              <div style={{ position: "absolute", left: 26, top: 40, right: 28, height: 62, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ flex: 1, fontFamily: F.display, fontWeight: 500, fontSize: 56, lineHeight: "62px", letterSpacing: "-0.03em", color: C.walnut }}>Schedule</span>
                <div style={{ display: "flex", padding: 3, gap: 2, borderRadius: 999, background: SOFT }}>
                  {["Day", "Week", "Month"].map((label) => (
                    <div
                      key={label}
                      style={{
                        height: 32,
                        padding: "0 14px",
                        display: "flex",
                        alignItems: "center",
                        borderRadius: 999,
                        background: label === "Week" ? C.paper : undefined,
                        boxShadow: label === "Week" ? "0 1px 2px rgba(40, 25, 16, 0.12)" : undefined,
                        fontFamily: F.body,
                        fontWeight: 500,
                        fontSize: 13,
                        color: label === "Week" ? C.ink : SUBTLE,
                      }}
                    >
                      {label}
                    </div>
                  ))}
                </div>
                {[0, 180].map((turn) => (
                  <div key={turn} style={{ width: 38, height: 38, borderRadius: 999, background: SOFT, display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(${turn}deg)` }}>
                    <Icon name="chevronLeft" size={15} color={C.ink} stroke={2} />
                  </div>
                ))}
                <div style={{ height: 38, padding: "0 16px 0 13px", display: "flex", alignItems: "center", gap: 7, borderRadius: 999, background: C.ink, fontFamily: F.body, fontWeight: 500, fontSize: 13, color: C.paper }}>
                  <Icon name="plus" size={14} color={C.paper} stroke={2.2} />
                  Appointment
                </div>
              </div>
              <div style={{ position: "absolute", left: CAL.left, top: CAL.top, width: CAL.width, height: CAL.height, borderRadius: 20, background: C.beige }}>
                {WEEK.map((day, i) => (
                  <div
                    key={day.d}
                    style={{ position: "absolute", left: CAL.pad + CAL.gutter + i * (COL_W + COL_GAP), top: CAL.pad, width: COL_W, height: CAL.head, display: "flex", alignItems: "center", gap: 8, padding: "0 10px", boxSizing: "border-box" }}
                  >
                    <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 14, color: C.walnut }}>{day.d}</span>
                    <span style={{ fontFamily: F.body, fontSize: 13, color: SUBTLE }}>Oct {day.n}</span>
                  </div>
                ))}
                {HOURS.map((hour, i) => (
                  <div key={hour} style={{ position: "absolute", left: CAL.pad, top: GRID_TOP + i * HOUR_H - 2, width: CAL.gutter - 12, textAlign: "right", fontFamily: F.body, fontSize: 12, color: SUBTLE }}>
                    {hour}
                  </div>
                ))}
                {WEEK.map((day, i) => (
                  <div
                    key={`col-${day.d}`}
                    style={{ position: "absolute", left: CAL.pad + CAL.gutter + i * (COL_W + COL_GAP), top: GRID_TOP, width: COL_W, height: HOUR_H * HOURS.length, borderRadius: 14, background: C.paper, overflow: "hidden" }}
                  ></div>
                ))}
                {VISITS.map((visit, i) => {
                  const r = visitRect(visit.day, visit.start, visit.dur);
                  return (
                    <div
                      key={visit.name}
                      style={{
                        position: "absolute",
                        left: r.x,
                        top: r.y,
                        width: r.w,
                        height: r.h,
                        boxSizing: "border-box",
                        padding: "9px 12px",
                        borderRadius: 10,
                        background: VISIT_TONE[visit.kind] ?? C.beige,
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                      }}
                    >
                      <VisitText name={visit.name} start={visit.start} pill={VISIT_PILL[visit.kind] ?? VISIT_PILL_DEFAULT} />
                    </div>
                  );
                })}
                {frame > SLOT_CLICK_AT ? (
                  <div
                    style={{
                      position: "absolute",
                      left: LEO_RECT.x,
                      top: LEO_RECT.y,
                      width: LEO_RECT.w,
                      height: LEO_RECT.h,
                      boxSizing: "border-box",
                      padding: "9px 12px",
                      borderRadius: 10,
                      background: C.ink,
                      display: "flex",
                      flexDirection: "column",
                      gap: 3,
                      opacity: land,
                      transform: `scale(${lerp(0.9, 1, land)})`,
                    }}
                  >
                    <VisitText name="Leo Jacobs" start={LEO_VISIT.start} ink={C.paper} pill="rgba(255, 252, 241, 0.14)" />
                  </div>
                ) : null}
              </div>
            </AppShell>
            <div style={{ position: "absolute", inset: 0, borderRadius: 28, background: C.ink, opacity: 1 - reveal }} />
          </div>
        </div>
      </AbsoluteFill>
      <ClickRing x={tip.x} y={tip.y} progress={ramp(frame, SLOT_CLICK_AT + 1, 16)} />
      {toSlot > 0 ? <Cursor x={lerp(1600, tip.x, toSlot)} y={lerp(1100, tip.y, toSlot)} pressed={press} size={40} /> : null}
    </AbsoluteFill>
  );
}
