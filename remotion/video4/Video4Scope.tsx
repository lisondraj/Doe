import { type CSSProperties, type ReactNode } from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";

import { DotTide, DotWave, Stage } from "../video1/backdrops";
import { Bubble, IPhone, Slot, TimeStamp, TypingBubble } from "../video1/imessage";
import { EASE_IN, EASE_IN_OUT, EASE_OUT, camera, keys, lerp, pulse, ramp, typed, type CameraKey } from "../video1/motion";
import { C, F } from "../video1/theme";
import { AppShell, Chip, ClickRing, Cursor, ShadowsContext, Toggle } from "../video1/ui";
import { Av, Display, Field, Ico, Menu, PAGE, Pill, SAGE, SHELL, SUB, Segmented, SelectBox, Status, Swap, clamp01, onPage, press, rise, track, type AvTone, type IcoName } from "./kit";

export const VIDEO4_SCOPE_FRAMES = 900;

const WORLD_END = 600;
const CARE_AT = 580;

export function Video4Scope() {
  return (
    <ShadowsContext.Provider value={false}>
      <Audio src={staticFile("video1/BED.m4a")} startFrom={1230} volume={0.2} />
      <ScopeStage />
    </ShadowsContext.Provider>
  );
}

function ScopeStage() {
  const frame = useCurrentFrame();
  const wave = ramp(frame, CARE_AT - 4, 30, EASE_IN_OUT);
  return (
    <Stage
      backdrop={
        <>
          {wave < 1 ? (
            <AbsoluteFill style={{ opacity: 1 - wave }}>
              <DotTide reach={520} />
            </AbsoluteFill>
          ) : null}
          {wave > 0 ? (
            <AbsoluteFill style={{ opacity: wave }}>
              <DotWave top={0.46} amp={64} />
            </AbsoluteFill>
          ) : null}
        </>
      }
    >
      <Sequence from={0} durationInFrames={WORLD_END} name="Phone → clinicians → programs">
        <WorldScene />
      </Sequence>
      <Sequence from={CARE_AT} durationInFrames={VIDEO4_SCOPE_FRAMES - CARE_AT} name="Ongoing care">
        <CareScene />
      </Sequence>
    </Stage>
  );
}

/* ─── World: the phone at the origin, the practice shell one screen to the right ─ */

const DX = 2000;
const S2 = { x: SHELL.x + DX, y: SHELL.y };
const pg = (x: number, y: number) => ({ x: S2.x + 64 + x, y: S2.y + 12 + y });
const PHONE = { w: 393, h: 852, x: 960 - 393 / 2, y: 540 - 852 / 2 };

const ASK = "I need help managing my weight, but I don\u2019t want to wait months to see a specialist.";
const TYPE_AT = 12;
const SEND_AT = 104;
const TYPING_AT = 116;
const REPLY_AT = 140;
const PAN_OUT = { from: 150, to: 198 };
const TOGGLE_CLICK = 230;
const MEDS_CLICK = 272;
const SELECT_CLICK = 300;
const WEEK_CLICK = 330;
const RAIL_CLICK = 356;
const PROGRAM_AT = 360;
const AGENTS_CLICK = 452;
const PAN_BACK = { from: 466, to: 512 };
const CARD_TYPING_AT = 500;
const CARD_AT = 520;
const BOOK_CLICK = 560;
const ZOOM_OUT_AT = 574;

/** Fractional camera between two framings, easing across while the zoom dips out and back in. */
function arc(frame: number, a: { x: number; y: number; s: number }, b: { x: number; y: number; s: number }, span: { from: number; to: number }, dip = 0.42): CSSProperties {
  const u = EASE_IN_OUT(clamp01((frame - span.from) / (span.to - span.from)));
  const x = lerp(a.x, b.x, u);
  const y = lerp(a.y, b.y, u);
  const s = Math.exp(lerp(Math.log(a.s), Math.log(b.s), u)) * (1 - dip * Math.sin(Math.PI * u));
  return { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "0 0", transform: `translate(${(960 - x * s).toFixed(3)}px, ${(540 - y * s).toFixed(3)}px) scale(${s.toFixed(5)})` };
}

/* Clinician detail geometry (page coordinates). */
const LIST = { x: 28, y: 104, w: 380, h: 744, rowH: 76 };
const DETAIL = { x: 432, y: 104, w: 904, h: 744, pad: 28 };
const SCOPE_GRID = { y: 164, tileH: 64, gap: 10 };
const TILE_W = (DETAIL.w - DETAIL.pad * 2 - SCOPE_GRID.gap * 2) / 3;
const tileOrigin = (i: number) => ({ x: DETAIL.x + DETAIL.pad + (i % 3) * (TILE_W + SCOPE_GRID.gap), y: DETAIL.y + DETAIL.pad + SCOPE_GRID.y + Math.floor(i / 3) * (SCOPE_GRID.tileH + SCOPE_GRID.gap) });
const WEIGHT_TILE = 2;
const WEIGHT_TOGGLE = (() => {
  const o = tileOrigin(WEIGHT_TILE);
  return pg(o.x + TILE_W - 16 - 18, o.y + SCOPE_GRID.tileH / 2);
})();
const SUB_PANEL = { y: SCOPE_GRID.y + 3 * SCOPE_GRID.tileH + 2 * SCOPE_GRID.gap + 16, h: 292 };
const SUB_TOP = DETAIL.y + DETAIL.pad + SUB_PANEL.y;
const SUB_CHIPS: { label: string; on: boolean }[] = [
  { label: "Nutrition counseling", on: true },
  { label: "Medication management", on: false },
  { label: "Labs & monitoring", on: true },
  { label: "Body composition", on: false },
];
const MEDS_CHIP = pg(DETAIL.x + DETAIL.pad + 20 + 236 + 10 + 120, SUB_TOP + 20 + 32 + 16 + 22);
const FIELD_W = (DETAIL.w - DETAIL.pad * 2 - 40 - 20) / 3;
const STARTS_SELECT = pg(DETAIL.x + DETAIL.pad + 20 + FIELD_W / 2, SUB_TOP + 20 + 32 + 16 + 44 + 26 + 22 + 21);
const STARTS_MENU = { x: DETAIL.x + DETAIL.pad + 20, y: SUB_TOP + 20 + 32 + 16 + 44 + 26 + 22 + 50 };
const STARTS = [{ label: "Within a week" }, { label: "Within 2 weeks" }, { label: "Within a month" }, { label: "Referral only" }];
const WEEK_ROW = pg(STARTS_MENU.x + 110, STARTS_MENU.y + 6 + 21);
const RAIL_PROGRAMS = { x: S2.x + 32, y: S2.y + 425 };

const CONDITIONS: { label: string; on: boolean }[] = [
  { label: "Hypertension", on: true },
  { label: "Type 2 diabetes", on: true },
  { label: "Weight management", on: false },
  { label: "Thyroid disorders", on: true },
  { label: "Asthma & COPD", on: true },
  { label: "Anxiety & depression", on: true },
  { label: "Women\u2019s health", on: true },
  { label: "Sleep apnea screening", on: false },
  { label: "Sports injuries", on: false },
];

const CLINICIANS: { name: string; cred: string; tone: AvTone }[] = [
  { name: "Jordan Lee", cred: "NP-C", tone: "salmon" },
  { name: "Sam Ortiz", cred: "PA-C", tone: "sage" },
  { name: "Dr. Ellen Park", cred: "MD", tone: "sand" },
  { name: "Priya Shah", cred: "NP-C", tone: "salmon" },
  { name: "Marco Diaz", cred: "PA-C", tone: "sage" },
  { name: "Dr. Ben Cho", cred: "DO", tone: "sand" },
  { name: "Ava Brooks", cred: "FNP", tone: "salmon" },
  { name: "Tess Moreno", cred: "PA-C", tone: "sage" },
];

const PHONE_CAM = { x: 960, y: 720, s: 1.72 };
const SHELL_CAM = { x: DX + 960, y: 540, s: 1.0 };
const SHELL_CAMS: CameraKey[] = [
  { f: PAN_OUT.to, ...SHELL_CAM },
  { f: 214, x: DX + 960, y: 540, s: 1.02 },
  { f: 246, x: WEIGHT_TOGGLE.x - 230, y: WEIGHT_TOGGLE.y + 160, s: 1.42 },
  { f: 290, x: WEIGHT_TOGGLE.x - 250, y: WEIGHT_TOGGLE.y + 260, s: 1.5 },
  { f: 334, x: WEIGHT_TOGGLE.x - 260, y: WEIGHT_TOGGLE.y + 280, s: 1.52 },
  { f: 362, x: DX + 960, y: 540, s: 1.04 },
  { f: 420, x: DX + 1000, y: 520, s: 1.1 },
  { f: AGENTS_CLICK, x: DX + 1250, y: 340, s: 1.42 },
  { f: PAN_BACK.from, x: DX + 1250, y: 340, s: 1.44 },
];
const BACK_CAM = { x: 960, y: 640, s: 1.6 };
const BOOK_BTN = { x: PHONE.x + 14 + 150, y: PHONE.y + PHONE.h - 86 - 8 - 34 };

function worldCamera(frame: number): CSSProperties {
  if (frame < PAN_OUT.from) return camera(frame, [{ f: 0, x: 960, y: 800, s: 2.05 }, { f: SEND_AT, x: 960, y: 790, s: 2.0 }, { f: PAN_OUT.from, ...PHONE_CAM }]);
  if (frame < PAN_OUT.to) return arc(frame, PHONE_CAM, SHELL_CAM, PAN_OUT);
  if (frame < PAN_BACK.from) return camera(frame, SHELL_CAMS);
  if (frame < PAN_BACK.to) return arc(frame, SHELL_CAMS[SHELL_CAMS.length - 1], BACK_CAM, PAN_BACK, 0.5);
  if (frame < ZOOM_OUT_AT) return camera(frame, [{ f: PAN_BACK.to, ...BACK_CAM }, { f: 548, x: BOOK_BTN.x, y: BOOK_BTN.y - 120, s: 1.8 }, { f: ZOOM_OUT_AT, x: BOOK_BTN.x, y: BOOK_BTN.y - 110, s: 1.86 }]);
  return camera(frame, [{ f: ZOOM_OUT_AT, x: BOOK_BTN.x, y: BOOK_BTN.y - 110, s: 1.86 }, { f: WORLD_END, x: BOOK_BTN.x, y: BOOK_BTN.y, s: 5 }], EASE_IN);
}

function WorldScene() {
  const frame = useCurrentFrame();
  const full = typed(ASK, frame, TYPE_AT, 32);
  const draft = frame < SEND_AT ? (full.length > 30 ? "\u2026" + full.slice(-29) : full) : "";
  const leave = ramp(frame, ZOOM_OUT_AT + 10, 12, EASE_IN);
  const program = ramp(frame, PROGRAM_AT - 4, 18, EASE_IN_OUT);
  const hover = frame < SELECT_CLICK + 12 ? 2 : keys(frame, [SELECT_CLICK + 12, WEEK_CLICK - 6], [2, 0]);
  const cur = track(frame, [
    { f: 200, x: DX + 1500, y: 1020 },
    { f: TOGGLE_CLICK - 4, x: WEIGHT_TOGGLE.x + 2, y: WEIGHT_TOGGLE.y + 3 },
    { f: MEDS_CLICK - 4, x: MEDS_CHIP.x, y: MEDS_CHIP.y + 2 },
    { f: SELECT_CLICK - 4, x: STARTS_SELECT.x, y: STARTS_SELECT.y + 2 },
    { f: SELECT_CLICK + 12, x: STARTS_SELECT.x + 10, y: STARTS_SELECT.y + 30 },
    { f: WEEK_CLICK - 4, x: WEEK_ROW.x, y: WEEK_ROW.y + 2 },
    { f: RAIL_CLICK - 4, x: RAIL_PROGRAMS.x + 2, y: RAIL_PROGRAMS.y + 2 },
    { f: 410, x: DX + 900, y: 760 },
    { f: AGENTS_CLICK - 4, x: AGENTS_TOGGLE.x + 2, y: AGENTS_TOGGLE.y + 3 },
    { f: 470, x: AGENTS_TOGGLE.x + 80, y: AGENTS_TOGGLE.y + 120 },
  ]);
  const tap = track(frame, [
    { f: 528, x: BOOK_BTN.x + 120, y: BOOK_BTN.y + 140 },
    { f: BOOK_CLICK - 4, x: BOOK_BTN.x + 4, y: BOOK_BTN.y + 4 },
  ]);

  return (
    <AbsoluteFill style={{ opacity: 1 - leave, filter: leave > 0 ? `blur(${leave * 14}px)` : undefined }}>
      <div style={worldCamera(frame)}>
        <div style={{ position: "absolute", left: PHONE.x, top: PHONE.y, ...rise(frame, 0, { y: 60, blur: 8, dur: 24 }) }}>
          <IPhone frame={frame} width={PHONE.w} height={PHONE.h} draft={draft} composing={frame < SEND_AT} sendPress={pulse(frame, SEND_AT - 4, 3, 6)}>
            <Slot frame={frame} at={4} side="center">
              <TimeStamp day="Today" time="8:12 AM" />
            </Slot>
            <Slot frame={frame} at={SEND_AT} side="out" dur={18}>
              <Bubble out>{ASK}</Bubble>
            </Slot>
            <Slot frame={frame} at={TYPING_AT} until={REPLY_AT} side="in" dur={12}>
              <TypingBubble frame={frame} />
            </Slot>
            <Slot frame={frame} at={REPLY_AT} side="in" dur={18}>
              <Bubble>On it. I&rsquo;ll look for clinicians who can start your care this week.</Bubble>
            </Slot>
            <Slot frame={frame} at={CARD_TYPING_AT} until={CARD_AT} side="in" dur={12}>
              <TypingBubble frame={frame} />
            </Slot>
            <Slot frame={frame} at={CARD_AT} side="in" dur={22}>
              <ProgramMatch frame={frame} />
            </Slot>
          </IPhone>
        </div>

        <div style={{ position: "absolute", left: S2.x, top: S2.y }}>
          <AppShell active={program > 0.5 ? 2 : 3} railReveal={(i) => ramp(frame, PAN_OUT.from + 20 + i * 2, 12)}>
            {program < 1 ? (
              <div style={{ position: "absolute", inset: 0, opacity: 1 - program, transform: `translateY(${-20 * program}px)` }}>
                <CliniciansPage frame={frame} />
              </div>
            ) : null}
            {program > 0 ? (
              <div style={{ position: "absolute", inset: 0, opacity: program }}>
                <ProgramsPage frame={frame} />
              </div>
            ) : null}
          </AppShell>
        </div>

        {[TOGGLE_CLICK, MEDS_CLICK, SELECT_CLICK, WEEK_CLICK].map((f, i) => {
          const p = [WEIGHT_TOGGLE, MEDS_CHIP, STARTS_SELECT, WEEK_ROW][i];
          return <ClickRing key={f} x={p.x} y={p.y} progress={ramp(frame, f - 1, 14)} />;
        })}
        <ClickRing x={RAIL_PROGRAMS.x} y={RAIL_PROGRAMS.y} progress={ramp(frame, RAIL_CLICK - 1, 14)} />
        <ClickRing x={AGENTS_TOGGLE.x} y={AGENTS_TOGGLE.y} progress={ramp(frame, AGENTS_CLICK - 1, 14)} />
        <div style={{ opacity: ramp(frame, 200, 8) * (1 - ramp(frame, 466, 8)) }}>
          <Cursor x={cur.x} y={cur.y} pressed={press(frame, [TOGGLE_CLICK, MEDS_CLICK, SELECT_CLICK, WEEK_CLICK, RAIL_CLICK, AGENTS_CLICK])} />
        </div>
        {frame >= SELECT_CLICK ? (
          <div style={{ position: "absolute", left: pg(0, 0).x, top: pg(0, 0).y }}>
            <Menu items={STARTS} open={ramp(frame, SELECT_CLICK + 2, 10) * (1 - ramp(frame, WEEK_CLICK + 2, 8))} hover={hover} selected={frame >= WEEK_CLICK ? 0 : 2} width={FIELD_W} style={{ left: STARTS_MENU.x, top: STARTS_MENU.y }} />
          </div>
        ) : null}

        <ClickRing x={BOOK_BTN.x} y={BOOK_BTN.y} progress={ramp(frame, BOOK_CLICK - 1, 14)} />
        <div style={{ opacity: ramp(frame, 528, 8) * (1 - ramp(frame, ZOOM_OUT_AT + 4, 6)) }}>
          <Cursor x={tap.x} y={tap.y} pressed={press(frame, [BOOK_CLICK])} size={22} />
        </div>
      </div>
    </AbsoluteFill>
  );
}

function ProgramMatch({ frame }: { frame: number }) {
  const booked = ramp(frame, BOOK_CLICK + 2, 10);
  return (
    <div style={{ width: 292, boxSizing: "border-box", padding: 12, borderRadius: 22, background: C.beige, display: "flex", flexDirection: "column", gap: 10, fontFamily: F.ui }}>
      <div style={{ padding: "4px 4px 0", fontFamily: F.display, fontWeight: 500, fontSize: 27, lineHeight: "31px", letterSpacing: "-0.02em", color: C.walnut }}>Medical Weight Management</div>
      <div style={{ display: "flex", gap: 6, padding: "0 2px" }}>
        <Chip tone="paper">12 weeks</Chip>
        <Chip tone="paper">In network</Chip>
      </div>
      <div style={{ padding: "10px 12px", borderRadius: 14, background: C.paper, display: "flex", flexDirection: "column", gap: 8 }}>
        <MatchLine icon="building">Bayview Primary Care</MatchLine>
        <MatchLine icon="user">Jordan Lee, NP-C</MatchLine>
        <MatchLine icon="calendar">Thu, Oct 22 · 10:20 AM</MatchLine>
      </div>
      <div style={{ position: "relative", height: 40 }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 999, background: C.ink, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 14, color: C.paper, opacity: 1 - booked, transform: `scale(${1 - 0.05 * pulse(frame, BOOK_CLICK - 2, 3, 8)})` }}>
          Book intake visit
        </div>
        <div style={{ position: "absolute", inset: 0, borderRadius: 999, background: C.live, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontWeight: 600, fontSize: 14, color: "#FFF", opacity: booked, transform: `scale(${lerp(0.94, 1, booked) + 0.04 * pulse(frame, BOOK_CLICK + 8, 4, 12)})` }}>
          <Ico name="check" size={15} color="#FFF" stroke={2.8} />
          Booked for Thu
        </div>
      </div>
    </div>
  );
}

function MatchLine({ icon, children }: { icon: IcoName; children: ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 500, fontSize: 13.5, color: C.walnut, whiteSpace: "nowrap" }}>
      <Ico name={icon} size={14} color={SUB} />
      {children}
    </div>
  );
}

function CliniciansPage({ frame }: { frame: number }) {
  const at = (o: number) => PAN_OUT.from + 14 + o;
  const weightOn = ramp(frame, TOGGLE_CLICK + 2, 10, EASE_IN_OUT);
  const sub = ramp(frame, TOGGLE_CLICK + 8, 22, EASE_IN_OUT);
  const meds = ramp(frame, MEDS_CLICK + 2, 8);
  const week = frame >= WEEK_CLICK;
  return (
    <>
      <div style={{ position: "absolute", left: 28, top: 28, ...rise(frame, at(0)) }}>
        <Display size={46}>Clinicians</Display>
      </div>
      <div style={{ position: "absolute", right: 28, top: 34, display: "flex", gap: 8, ...rise(frame, at(2)) }}>
        <Pill icon="search" tone="beige" />
        <Pill tone="beige" trailing="chevronDown">
          All roles
        </Pill>
        <Pill icon="plus" tone="ink">
          Add clinician
        </Pill>
      </div>
      <div style={{ position: "absolute", left: LIST.x, top: LIST.y, width: LIST.w, height: LIST.h, boxSizing: "border-box", padding: 8, borderRadius: 24, background: C.beige, display: "flex", flexDirection: "column", gap: 6, overflow: "hidden", ...rise(frame, at(4), { y: 20, dur: 26 }) }}>
        {CLINICIANS.map((c, i) => (
          <div key={c.name} style={{ height: LIST.rowH, flexShrink: 0, boxSizing: "border-box", padding: "0 16px 0 14px", borderRadius: 16, background: i === 0 ? C.paper : "transparent", display: "flex", alignItems: "center", gap: 12, ...rise(frame, at(8 + i * 2), { y: 10, dur: 18 }) }}>
            <Av label={c.name.replace("Dr. ", "").split(" ").map((s) => s[0]).join("")} size={44} tone={c.tone} />
            <span style={{ flex: 1, fontFamily: F.ui, fontWeight: 600, fontSize: 17, color: C.walnut, whiteSpace: "nowrap" }}>{c.name}</span>
            <Chip tone={i === 0 ? "ink" : "outline"}>{c.cred}</Chip>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: DETAIL.x, top: DETAIL.y, width: DETAIL.w, height: DETAIL.h, boxSizing: "border-box", padding: DETAIL.pad, borderRadius: 24, background: C.paper, border: `1px solid ${C.line}`, ...rise(frame, at(6), { x: 30, y: 0, dur: 26 }) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, height: 88 }}>
          <Av label="JL" size={88} tone="salmon" />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Display size={42}>Jordan Lee, NP-C</Display>
            <div style={{ display: "flex", gap: 6 }}>
              <Chip tone="outline" size={1.1}>
                Family nurse practitioner
              </Chip>
              <Chip tone="outline" size={1.1}>
                Full practice authority
              </Chip>
            </div>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 10, height: 44, padding: "0 16px", borderRadius: 999, background: C.beige, fontFamily: F.ui, fontWeight: 500, fontSize: 14, color: C.walnut }}>
            New patients
            <Toggle on />
          </div>
        </div>
        <div style={{ position: "absolute", left: DETAIL.pad, right: DETAIL.pad, top: DETAIL.pad + 112, height: 38, display: "flex", alignItems: "center", justifyContent: "space-between", ...rise(frame, at(12)) }}>
          <Display size={26}>Scope of care</Display>
          <Segmented items={["Conditions", "Procedures", "Prescribing"]} value={0} width={420} />
        </div>
        {CONDITIONS.map((c, i) => {
          const o = tileOrigin(i);
          const on = i === WEIGHT_TILE ? weightOn : c.on ? 1 : 0;
          return (
            <div
              key={c.label}
              style={{
                position: "absolute",
                left: o.x - DETAIL.x,
                top: o.y - DETAIL.y,
                width: TILE_W,
                height: SCOPE_GRID.tileH,
                boxSizing: "border-box",
                padding: "0 16px 0 18px",
                borderRadius: 16,
                background: on > 0.5 ? C.beige : C.paper,
                border: `1px solid ${on > 0.5 ? "transparent" : C.line2}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontFamily: F.ui,
                fontWeight: 500,
                fontSize: 16,
                color: on > 0.5 ? C.walnut : SUB,
                ...rise(frame, at(14 + i * 1.5), { y: 10, dur: 18 }),
              }}
            >
              {c.label}
              <Toggle progress={on} />
            </div>
          );
        })}
        {sub > 0 ? (
          <div style={{ position: "absolute", left: DETAIL.pad, right: DETAIL.pad, top: DETAIL.pad + SUB_PANEL.y, height: SUB_PANEL.h * sub, borderRadius: 20, background: C.beige, overflow: "hidden" }}>
            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16, opacity: clamp01((sub - 0.4) / 0.5) }}>
              <div style={{ height: 32, display: "flex", alignItems: "center", gap: 10 }}>
                <Ico name="scale" size={20} />
                <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 18, color: C.walnut }}>Weight management</span>
              </div>
              <div style={{ display: "flex", gap: 10, height: 44 }}>
                {SUB_CHIPS.map((chip, i) => {
                  const on = i === 1 ? meds : chip.on ? 1 : 0;
                  return (
                    <div
                      key={chip.label}
                      style={{
                        width: [236, 252, 214, 196][i],
                        height: 44,
                        boxSizing: "border-box",
                        borderRadius: 999,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        fontFamily: F.ui,
                        fontWeight: 500,
                        fontSize: 15,
                        whiteSpace: "nowrap",
                        background: on > 0 ? `rgba(252, 207, 184, ${on})` : "transparent",
                        border: on > 0.5 ? "1px solid transparent" : "1px dashed rgba(40, 25, 16, 0.28)",
                        color: on > 0.5 ? C.walnut : SUB,
                        transform: i === 1 ? `scale(${1 - 0.06 * pulse(frame, MEDS_CLICK - 2, 3, 8)})` : undefined,
                      }}
                    >
                      {on > 0.5 ? <Ico name="check" size={14} color={C.walnut} stroke={2.6} /> : <Ico name="plus" size={14} color={SUB} stroke={2.2} />}
                      {chip.label}
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: 20, marginTop: 10 }}>
                <Field label="Starts within" style={{ width: FIELD_W }}>
                  <SelectBox value={week ? "Within a week" : "Within a month"} focused={frame >= SELECT_CLICK && frame < WEEK_CLICK + 4} style={{ background: C.paper }} />
                </Field>
                <Field label="Visit types" style={{ width: FIELD_W }}>
                  <SelectBox value="In person + Telehealth" style={{ background: C.paper }} />
                </Field>
                <Field label="Ages" style={{ width: FIELD_W }}>
                  <SelectBox value="18 and older" style={{ background: C.paper }} />
                </Field>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, height: 40, marginTop: 6, fontFamily: F.ui, fontWeight: 500, fontSize: 15, color: C.liveText, opacity: ramp(frame, WEEK_CLICK + 8, 12) }}>
                <Ico name="check" size={16} color={C.liveText} stroke={2.6} />
                Saved to Jordan&rsquo;s scope
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}

const PROGRAM_LIST = [
  { name: "Medical Weight Management", tone: C.salmon },
  { name: "Diabetes Care", tone: SAGE },
  { name: "Hypertension Check-ins", tone: C.sand2 },
  { name: "Annual Wellness", tone: SAGE },
  { name: "Smoking Cessation", tone: C.sand2 },
  { name: "Sleep Health", tone: C.salmon },
];
const BUILDER = { x: 392, y: 104, w: 944, h: 744, pad: 28 };
const AGENTS_TOGGLE = pg(BUILDER.x + BUILDER.w - BUILDER.pad - 16 - 18, BUILDER.y + BUILDER.pad + 26);
const STEPS: { when: string; label: string; meta: string; who?: string }[] = [
  { when: "Week 1", label: "Intake visit", meta: "45 min", who: "JL" },
  { when: "Week 1", label: "Labs", meta: "A1C · Lipids · Thyroid" },
  { when: "Week 2", label: "Nutrition plan", meta: "Telehealth", who: "SO" },
  { when: "Every 2 wks", label: "Check-in", meta: "20 min", who: "JL" },
  { when: "Week 4", label: "Medication review", meta: "NP or PA", who: "PS" },
  { when: "Week 12", label: "Progress visit", meta: "45 min", who: "JL" },
];

function ProgramsPage({ frame }: { frame: number }) {
  const at = (o: number) => PROGRAM_AT + o;
  const agents = ramp(frame, AGENTS_CLICK + 2, 10, EASE_IN_OUT);
  return (
    <>
      <div style={{ position: "absolute", left: 28, top: 28, ...rise(frame, at(0)) }}>
        <Display size={46}>Programs</Display>
      </div>
      <div style={{ position: "absolute", right: 28, top: 34, display: "flex", gap: 8, ...rise(frame, at(2)) }}>
        <Pill icon="search" tone="beige" />
        <Pill icon="plus" tone="ink">
          New program
        </Pill>
      </div>
      <div style={{ position: "absolute", left: 28, top: 104, width: 340, height: 744, boxSizing: "border-box", padding: 8, borderRadius: 24, background: C.beige, display: "flex", flexDirection: "column", gap: 6, ...rise(frame, at(4), { y: 20, dur: 24 }) }}>
        {PROGRAM_LIST.map((p, i) => (
          <div key={p.name} style={{ height: 72, flexShrink: 0, boxSizing: "border-box", padding: "0 16px 0 14px", borderRadius: 16, background: i === 0 ? C.paper : "transparent", display: "flex", alignItems: "center", gap: 12, ...rise(frame, at(8 + i * 2), { y: 10, dur: 18 }) }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: p.tone }} />
            <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 16, color: C.walnut, whiteSpace: "nowrap" }}>{p.name}</span>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: BUILDER.x, top: BUILDER.y, width: BUILDER.w, height: BUILDER.h, boxSizing: "border-box", padding: BUILDER.pad, borderRadius: 24, background: C.paper, border: `1px solid ${C.line}`, display: "flex", flexDirection: "column", gap: 18, ...rise(frame, at(6), { x: 30, y: 0, dur: 26 }) }}>
        <div style={{ display: "flex", alignItems: "center", height: 52 }}>
          <Display size={44}>Medical Weight Management</Display>
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 10, height: 44, padding: "0 16px", borderRadius: 999, background: C.beige, fontFamily: F.ui, fontWeight: 500, fontSize: 14, color: agents > 0.5 ? C.walnut : SUB }}>
            Open to agents
            <Toggle progress={agents} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, ...rise(frame, at(12)) }}>
          <Chip tone="outline" size={1.15}>
            12 weeks
          </Chip>
          <Chip tone="outline" size={1.15}>
            NP &amp; PA led
          </Chip>
          <Chip tone="outline" size={1.15}>
            Telehealth + in person
          </Chip>
        </div>
        <div style={{ flex: 1, display: "flex", gap: 18, minHeight: 0 }}>
          <div style={{ width: 540, boxSizing: "border-box", padding: 8, borderRadius: 20, background: C.beige, display: "flex", flexDirection: "column", gap: 6 }}>
            {STEPS.map((s, i) => (
              <div key={s.label} style={{ height: 82, flexShrink: 0, boxSizing: "border-box", padding: "0 16px 0 12px", borderRadius: 14, background: C.paper, display: "flex", alignItems: "center", gap: 14, ...rise(frame, at(16 + i * 5), { y: 14, dur: 18 }) }}>
                <div style={{ width: 106, height: 34, borderRadius: 999, background: C.beige, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.body, fontWeight: 500, fontSize: 13, color: C.walnut, whiteSpace: "nowrap" }}>{s.when}</div>
                <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 17, color: C.walnut, whiteSpace: "nowrap" }}>{s.label}</span>
                <span style={{ flex: 1, textAlign: "right", fontFamily: F.body, fontSize: 14, color: SUB, whiteSpace: "nowrap" }}>{s.meta}</span>
                {s.who ? <Av label={s.who} size={30} tone={s.who === "JL" ? "salmon" : s.who === "SO" ? "sage" : "sand"} /> : <div style={{ width: 30 }} />}
              </div>
            ))}
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ padding: 22, borderRadius: 20, background: C.beige, display: "flex", flexDirection: "column", gap: 14, ...rise(frame, at(20), { y: 16 }) }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontFamily: F.display, fontWeight: 500, fontSize: 64, lineHeight: "68px", letterSpacing: "-0.03em", color: C.walnut }}>$149</span>
                <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 18, color: SUB }}>/ month</span>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <Chip tone="paper" size={1.1}>
                  Aetna
                </Chip>
                <Chip tone="paper" size={1.1}>
                  Blue Shield
                </Chip>
                <Chip tone="paper" size={1.1}>
                  Self-pay
                </Chip>
              </div>
            </div>
            <div style={{ padding: 20, borderRadius: 20, background: C.beige, display: "flex", flexDirection: "column", gap: 14, ...rise(frame, at(26), { y: 16 }) }}>
              <Field label="Clinicians">
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ display: "flex" }}>
                    {(["JL", "SO", "PS"] as const).map((l, i) => (
                      <div key={l} style={{ marginLeft: i ? -10 : 0 }}>
                        <Av label={l} size={40} tone={i === 1 ? "sage" : i === 2 ? "sand" : "salmon"} ring={C.beige} />
                      </div>
                    ))}
                  </div>
                  <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 16, color: C.walnut }}>2 NPs, 1 PA</span>
                </div>
              </Field>
              <Field label="Next start">
                <span style={{ fontFamily: F.display, fontWeight: 500, fontSize: 30, letterSpacing: "-0.02em", color: C.walnut }}>Thu, Oct 22</span>
              </Field>
              <Field label="Open seats">
                <div style={{ display: "flex", gap: 4, paddingTop: 2 }}>
                  {Array.from({ length: 12 }, (_, i) => (
                    <div key={i} style={{ flex: 1, height: 10, borderRadius: 4, background: i < 7 ? C.walnut : "rgba(40, 25, 16, 0.14)", opacity: ramp(frame, at(30 + i), 8) }} />
                  ))}
                </div>
              </Field>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Ongoing care: monitoring and follow-ups on the patient page ─────────── */

const WEIGHTS = [236.0, 234.4, 233.1, 231.0, 229.8, 228.4, 227.0];
const GOAL = 212;
const CHART = { x: 28, y: 104, w: 820, h: 476 };
const PLOT = { x: 24, y: 136, w: 772, h: 300, min: 208, max: 240 };
const wx = (w: number) => PLOT.x + 40 + (w / 12) * (PLOT.w - 70);
const wy = (lb: number) => PLOT.y + 16 + (1 - (lb - PLOT.min) / (PLOT.max - PLOT.min)) * (PLOT.h - 46);
const CARE_PLAN = { x: 872, y: 104, w: 464, h: 744 };
type PlanRow = { date: string; label: string; done?: boolean; flip?: number; booked?: string; insertAt?: number };
const POINT_AT = 74;
const MED_FLIP = 150;
const FOLLOW_CLICK = 194;
const FOLLOW_ROW = FOLLOW_CLICK + 6;
const FOLLOW_FLIP = FOLLOW_CLICK + 40;
const PLAN_ROWS: PlanRow[] = [
  { date: "Oct 22", label: "Intake visit", done: true },
  { date: "Oct 23", label: "Labs", done: true },
  { date: "Nov 5", label: "Check-in", done: true },
  { date: "Nov 19", label: "Check-in", done: true },
  { date: "Dec 3", label: "Medication review", flip: MED_FLIP, booked: "Booked · 9:40 AM" },
  { date: "Dec 17", label: "Check-in", flip: FOLLOW_FLIP, booked: "Booked · 10:20 AM", insertAt: FOLLOW_ROW },
];
const FOLLOW_BTN = onPage(CARE_PLAN.x + CARE_PLAN.w / 2, CARE_PLAN.y + CARE_PLAN.h - 16 - 30);
const POINT = onPage(CHART.x + wx(6), CHART.y + wy(WEIGHTS[6]));

const CARE_CAMS: CameraKey[] = [
  { f: 0, x: 720, y: 440, s: 2.6 },
  { f: 56, x: 700, y: 420, s: 1.46 },
  { f: 104, x: 760, y: 430, s: 1.5 },
  { f: 144, x: 1350, y: 560, s: 1.42 },
  { f: 220, x: 1360, y: 640, s: 1.46 },
  { f: 268, x: 960, y: 540, s: 1.06 },
  { f: VIDEO4_SCOPE_FRAMES - CARE_AT, x: 960, y: 540, s: 1.1 },
];

function CareScene() {
  const frame = useCurrentFrame();
  const arrive = ramp(frame, 0, 16, EASE_OUT);
  const cur = track(frame, [
    { f: 56, x: 1100, y: 900 },
    { f: 84, x: POINT.x + 10, y: POINT.y + 12 },
    { f: 120, x: POINT.x + 40, y: POINT.y + 30 },
    { f: FOLLOW_CLICK - 4, x: FOLLOW_BTN.x + 6, y: FOLLOW_BTN.y + 4 },
    { f: FOLLOW_CLICK + 30, x: FOLLOW_BTN.x + 80, y: FOLLOW_BTN.y + 90 },
  ]);
  return (
    <AbsoluteFill style={{ opacity: arrive, filter: arrive < 1 ? `blur(${(1 - arrive) * 12}px)` : undefined }}>
      <div style={camera(frame, CARE_CAMS)}>
        <div style={{ position: "absolute", left: SHELL.x, top: SHELL.y }}>
          <AppShell active={3} railReveal={(i) => ramp(frame, 4 + i * 2, 12)}>
            <CarePage frame={frame} />
          </AppShell>
        </div>
        <ClickRing x={FOLLOW_BTN.x} y={FOLLOW_BTN.y} progress={ramp(frame, FOLLOW_CLICK - 1, 16)} />
        <div style={{ opacity: ramp(frame, 56, 8) * (1 - ramp(frame, FOLLOW_CLICK + 26, 10)) }}>
          <Cursor x={cur.x} y={cur.y} pressed={press(frame, [FOLLOW_CLICK])} />
        </div>
      </div>
    </AbsoluteFill>
  );
}

function CarePage({ frame }: { frame: number }) {
  const lost = lerp(WEIGHTS[0] - WEIGHTS[5], WEIGHTS[0] - WEIGHTS[6], ramp(frame, POINT_AT + 6, 18, EASE_OUT));
  return (
    <>
      <div style={{ position: "absolute", left: 28, top: 28, display: "flex", alignItems: "center", gap: 14, ...rise(frame, 2) }}>
        <Display size={46}>Marcus Bell</Display>
        <Status tone="salmon">Week 6 of 12</Status>
      </div>
      <div style={{ position: "absolute", right: 28, top: 34, display: "flex", gap: 8, ...rise(frame, 4) }}>
        <Segmented items={["Overview", "Visits", "Labs", "Messages"]} value={0} width={440} />
        <Pill icon="more" tone="beige" />
      </div>

      <div style={{ position: "absolute", left: CHART.x, top: CHART.y, width: CHART.w, height: CHART.h, borderRadius: 24, background: C.beige, ...rise(frame, 6, { y: 20, dur: 26 }) }}>
        <div style={{ position: "absolute", left: 24, top: 22, display: "flex", alignItems: "baseline", gap: 12 }}>
          <span style={{ fontFamily: F.display, fontWeight: 500, fontSize: 64, lineHeight: "70px", letterSpacing: "-0.03em", color: C.walnut, fontVariantNumeric: "tabular-nums" }}>&minus;{lost.toFixed(1)} lb</span>
          <Status tone="sage" style={{ transform: `translateY(-10px)` }}>
            On track
          </Status>
        </div>
        <div style={{ position: "absolute", right: 24, top: 30, display: "flex", gap: 8 }}>
          <Segmented items={["Weight", "BMI", "Waist"]} value={0} width={290} height={36} tone="soft" />
        </div>
        <WeightPlot frame={frame} />
      </div>

      <div style={{ position: "absolute", left: CHART.x, top: CHART.y + CHART.h + 20, width: CHART.w, height: PAGE.h - 28 - (CHART.y + CHART.h + 20), display: "flex", gap: 12 }}>
        {[
          { label: "A1C", value: "5.9%", delta: "\u22120.3" },
          { label: "Blood pressure", value: "128/82", delta: "\u22126" },
          { label: "Waist", value: "40 in", delta: "\u22121.5" },
        ].map((stat, i) => (
          <div key={stat.label} style={{ flex: 1, boxSizing: "border-box", padding: 22, borderRadius: 22, background: C.beige, display: "flex", flexDirection: "column", justifyContent: "space-between", ...rise(frame, 16 + i * 4, { y: 16 }) }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 16, color: C.walnut }}>{stat.label}</span>
              <Status tone="sage">{stat.delta}</Status>
            </div>
            <span style={{ fontFamily: F.display, fontWeight: 500, fontSize: 52, lineHeight: "56px", letterSpacing: "-0.03em", color: C.walnut }}>{stat.value}</span>
          </div>
        ))}
      </div>

      <div style={{ position: "absolute", left: CARE_PLAN.x, top: CARE_PLAN.y, width: CARE_PLAN.w, height: CARE_PLAN.h, boxSizing: "border-box", padding: 16, borderRadius: 24, background: C.beige, display: "flex", flexDirection: "column", gap: 12, ...rise(frame, 8, { x: 30, y: 0, dur: 26 }) }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 4px 0 6px" }}>
          <Display size={30}>Care plan</Display>
          <Pill icon="plus" tone="paper" height={36} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {PLAN_ROWS.map((row, i) => (
            <CarePlanRow key={row.date} frame={frame} row={row} index={i} />
          ))}
        </div>
        <div style={{ marginTop: "auto", height: 60, borderRadius: 999, background: C.ink, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: F.ui, fontWeight: 600, fontSize: 17, color: C.paper, transform: `scale(${1 - 0.03 * pulse(frame, FOLLOW_CLICK - 2, 3, 9)})` }}>
          <Ico name="repeat" size={18} color={C.paper} stroke={2} />
          Send next follow-up to agent
        </div>
      </div>
    </>
  );
}

function CarePlanRow({ frame, row, index }: { frame: number; row: PlanRow; index: number }) {
  const grow = row.insertAt === undefined ? 1 : ramp(frame, row.insertAt, 16, EASE_IN_OUT);
  if (grow <= 0) return null;
  const show = row.insertAt === undefined ? 1 : ramp(frame, row.insertAt + 6, 12);
  const [mon, day] = row.date.split(" ");
  return (
    <div style={{ height: 76 * grow, marginBottom: -6 * (1 - grow), overflow: "hidden", flexShrink: 0, ...rise(frame, 12 + index * 3, { y: 12, dur: 18 }) }}>
      <div style={{ height: 76, boxSizing: "border-box", padding: "0 14px 0 10px", borderRadius: 16, background: C.paper, display: "flex", alignItems: "center", gap: 14, opacity: show }}>
        <div style={{ width: 54, height: 56, borderRadius: 12, background: C.beige, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: F.body, fontWeight: 500, fontSize: 11, color: SUB, textTransform: "uppercase", letterSpacing: "0.04em" }}>{mon}</span>
          <span style={{ fontFamily: F.display, fontWeight: 500, fontSize: 24, lineHeight: "26px", color: C.walnut }}>{day}</span>
        </div>
        <span style={{ flex: 1, fontFamily: F.ui, fontWeight: 600, fontSize: 16, color: C.walnut, whiteSpace: "nowrap" }}>{row.label}</span>
        {row.done ? (
          <Status tone="sage" icon="check">
            Done
          </Status>
        ) : (
          <Swap
            t={ramp(frame, row.flip ?? 0, 12)}
            pop={pulse(frame, (row.flip ?? 0) + 4, 5, 14)}
            from={<Status tone="salmon">Sent to Agent</Status>}
            to={
              <Status tone="sage" icon="calendar">
                {row.booked}
              </Status>
            }
          />
        )}
      </div>
    </div>
  );
}

function WeightPlot({ frame }: { frame: number }) {
  const draw = ramp(frame, 10, 56, EASE_IN_OUT);
  const pointIn = ramp(frame, POINT_AT, 12, EASE_OUT);
  const pts = WEIGHTS.slice(0, 6).map((lb, w) => ({ x: wx(w), y: wy(lb) }));
  const last = { x: wx(6), y: wy(WEIGHTS[6]) };
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const len = pts.slice(1).reduce((s, p, i) => s + Math.hypot(p.x - pts[i].x, p.y - pts[i].y), 0);
  const ext = { x: lerp(pts[5].x, last.x, pointIn), y: lerp(pts[5].y, last.y, pointIn) };
  const projection = `M${last.x} ${last.y} L${wx(12)} ${wy(GOAL + 2)}`;
  return (
    <div style={{ position: "absolute", left: PLOT.x, top: PLOT.y, width: PLOT.w, height: PLOT.h, borderRadius: 18, background: C.paper, overflow: "visible" }}>
      <svg width={PLOT.w} height={PLOT.h} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {[210, 220, 230, 240].map((lb) => (
          <g key={lb}>
            <line x1={36} x2={PLOT.w - 20} y1={wy(lb) - PLOT.y} y2={wy(lb) - PLOT.y} stroke="rgba(40, 25, 16, 0.08)" strokeWidth={1} />
            <text x={10} y={wy(lb) - PLOT.y + 4} fontFamily="Inter, system-ui, sans-serif" fontSize={11} fill="rgba(40, 25, 16, 0.45)">
              {lb}
            </text>
          </g>
        ))}
        <line x1={36} x2={PLOT.w - 20} y1={wy(GOAL) - PLOT.y} y2={wy(GOAL) - PLOT.y} stroke={C.alert} strokeOpacity={0.6} strokeWidth={1.5} strokeDasharray="6 6" opacity={ramp(frame, 30, 14)} />
        <path d={projection} transform={`translate(0 ${-PLOT.y})`} fill="none" stroke="rgba(40, 25, 16, 0.25)" strokeWidth={2.5} strokeDasharray="4 8" strokeLinecap="round" opacity={ramp(frame, POINT_AT + 16, 16)} />
        <path d={line} transform={`translate(0 ${-PLOT.y})`} fill="none" stroke={C.ink} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${len} ${len}`} strokeDashoffset={len * (1 - draw)} />
        {pointIn > 0 ? <line x1={pts[5].x} y1={pts[5].y - PLOT.y} x2={ext.x} y2={ext.y - PLOT.y} stroke={C.ink} strokeWidth={3.5} strokeLinecap="round" /> : null}
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y - PLOT.y} r={5.5 * ramp(frame, 12 + i * 9, 10)} fill={C.ink} stroke={C.paper} strokeWidth={2.5} />
        ))}
        <circle cx={last.x} cy={last.y - PLOT.y} r={7 * pointIn * (1 + 0.3 * pulse(frame, POINT_AT + 8, 4, 12))} fill={C.salmon} stroke={C.ink} strokeWidth={2.5} />
        {Array.from({ length: 13 }, (_, w) => (
          <text key={w} x={wx(w)} y={PLOT.h - 10} textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize={11} fill={w === 6 ? C.walnut : "rgba(40, 25, 16, 0.45)"}>
            {w === 0 ? "Start" : `Wk ${w}`}
          </text>
        ))}
      </svg>
      <div style={{ position: "absolute", left: wx(12) - 70, top: wy(GOAL) - PLOT.y - 34, opacity: ramp(frame, 32, 12) }}>
        <Chip tone="salmon">Goal 212 lb</Chip>
      </div>
      <div style={{ position: "absolute", left: last.x - 96, top: last.y - PLOT.y - 66, ...rise(frame, POINT_AT + 8, { y: 8, scale: 0.9, dur: 14 }) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, height: 40, padding: "0 14px", borderRadius: 12, background: C.ink, fontFamily: F.ui, fontWeight: 500, fontSize: 14, color: C.paper, whiteSpace: "nowrap" }}>
          227.0 lb
          <span style={{ color: "rgba(255, 252, 241, 0.6)" }}>shared by Marcus&rsquo;s Agent</span>
        </div>
      </div>
    </div>
  );
}