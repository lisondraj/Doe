import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";

import { DotWave, Stage } from "../video1/backdrops";
import { EASE_IN, EASE_IN_OUT, blink, camera, fly, keys, lerp, pulse, ramp, typed } from "../video1/motion";
import { C, F } from "../video1/theme";
import { AppShell, Avatar, Button, Caret, CheckBox, Chip, ClickRing, Cursor, Icon, ShadowsContext, type IconName } from "../video1/ui";
import { BedTrack, Dropdown, H, IconButton, SECTION_FRAMES, SearchField, Segmented, TILE_TONES, clamp01, mix } from "./shared";

export const SECTION1_FRAMES = SECTION_FRAMES;

const ORG = { from: 0, dur: 236 };
const PATHWAY = { from: 204, dur: SECTION_FRAMES - 204 };

export function Section1Network() {
  const frame = useCurrentFrame();
  const waveIn = ramp(frame, PATHWAY.from + 8, 28, EASE_IN_OUT);
  return (
    <ShadowsContext.Provider value={false}>
      <BedTrack />
      <Stage
        backdrop={
          <div style={{ position: "absolute", inset: 0, opacity: waveIn }}>
            <DotWave top={0.5} amp={60} />
          </div>
        }
      >
        <Sequence durationInFrames={ORG.dur} name="Organization expands">
          <OrganizationScene />
        </Sequence>
        <Sequence from={PATHWAY.from} durationInFrames={PATHWAY.dur} name="Agent navigates the network">
          <PathwayScene />
        </Sequence>
      </Stage>
    </ShadowsContext.Provider>
  );
}

/* ─── Organization: a product index that fills with the health system ──────── */

const SHELL = { x: 240, y: 90 };
const O = { x: SHELL.x + 64, y: SHELL.y + 12 };
const GRID = { x: 28, y: 158, colW: (908 - 24) / 3, rowH: 210, gap: 12 };
const SEARCH = { x: 28, y: 98, w: 420, h: 40 };
const FILTER = { x: 460, y: 98, w: 520 };

type Dept = { name: string; icon: IconName; count: string; loc: string; people: string[]; tone: string };

const DEPTS: Dept[] = [
  { name: "Pediatrics", icon: "user", count: "18", loc: "4 sites", people: ["AO", "SK", "ML"], tone: TILE_TONES[0] },
  { name: "Cardiology", icon: "heart", count: "9", loc: "3 sites", people: ["SL", "PP"], tone: TILE_TONES[1] },
  { name: "Emergency", icon: "plus", count: "4", loc: "4 sites", people: ["JR"], tone: TILE_TONES[2] },
  { name: "Imaging", icon: "scan", count: "11", loc: "6 sites", people: ["NV", "KT"], tone: TILE_TONES[3] },
  { name: "Oncology", icon: "pill", count: "7", loc: "2 sites", people: ["RC"], tone: TILE_TONES[0] },
  { name: "Neurosciences", icon: "brain", count: "6", loc: "2 sites", people: ["AO", "DH"], tone: TILE_TONES[2] },
  { name: "Orthopedics", icon: "activity", count: "8", loc: "3 sites", people: ["WL"], tone: TILE_TONES[1] },
  { name: "Primary Care", icon: "home", count: "22", loc: "11 sites", people: ["EP", "JP", "AM"], tone: TILE_TONES[3] },
  { name: "Women’s Health", icon: "heart", count: "6", loc: "3 sites", people: ["NS"], tone: TILE_TONES[0] },
];

const HOSPITAL = { x: GRID.x, y: GRID.y, w: 3 * GRID.colW + 2 * GRID.gap, h: GRID.rowH };
const FILTERS = ["All", "Hospitals", "Departments", "Locations"];
const SEARCH_Q = "pediatric neuro";
const TYPE_AT = 118;
const FILTER_AT = 48;
const CARD_AT = 56;
const SEARCH_CLICK = 108;
const SEND_SEARCH = 168;
const PEDS_CLICK = 186;
const PEDS = { x: O.x + GRID.x + GRID.colW / 2, y: O.y + GRID.y + GRID.rowH / 2 };
const SEARCH_BTN = { x: O.x + SEARCH.x + SEARCH.w - 28, y: O.y + SEARCH.y + SEARCH.h / 2 };
const ORG_EXIT = 204;

function OrganizationScene() {
  const frame = useCurrentFrame();
  const filter = keys(frame, [FILTER_AT, FILTER_AT + 16], [1, 2]);
  const query = typed(SEARCH_Q, frame, TYPE_AT, 22);
  const typing = frame >= TYPE_AT && query.length < SEARCH_Q.length;
  const focused = ramp(frame, SEARCH_CLICK, 8) * (1 - ramp(frame, SEND_SEARCH + 4, 10));
  const leave = ramp(frame, ORG_EXIT, 22, EASE_IN);
  const toSearch = ramp(frame, 88, 18, EASE_IN_OUT);
  const toPeds = ramp(frame, 170, 14, EASE_IN_OUT);
  const cam = camera(frame, [
    { f: 0, x: 980, y: 360, s: 1.55 },
    { f: 36, x: 960, y: 380, s: 1.42 },
    { f: 92, x: 860, y: 520, s: 1.18 },
    { f: 140, x: 820, y: 360, s: 1.35 },
    { f: 176, x: 700, y: 430, s: 1.48 },
    { f: ORG.dur, x: 700, y: 430, s: 1.55 },
  ]);

  return (
    <AbsoluteFill style={{ opacity: 1 - leave, filter: leave > 0.01 ? `blur(${(10 * leave).toFixed(2)}px)` : undefined }}>
      <div style={cam}>
        <div style={{ position: "absolute", left: SHELL.x, top: SHELL.y }}>
          <AppShell active={2} railReveal={(i) => ramp(frame, 4 + i * 2, 12)}>
            <OrgPage frame={frame} filter={filter} query={query} focused={focused} typing={typing} />
          </AppShell>
        </div>
        <ClickRing x={SEARCH_BTN.x} y={SEARCH_BTN.y} progress={ramp(frame, SEARCH_CLICK + 1, 14)} />
        <ClickRing x={PEDS.x} y={PEDS.y} progress={ramp(frame, PEDS_CLICK + 1, 16)} />
        <div style={{ opacity: ramp(frame, 86, 8) * (1 - ramp(frame, PEDS_CLICK + 8, 10)) }}>
          <Cursor
            x={lerp(lerp(1480, SEARCH_BTN.x, toSearch), PEDS.x, toPeds)}
            y={lerp(lerp(980, SEARCH_BTN.y, toSearch), PEDS.y, toPeds)}
            pressed={Math.max(pulse(frame, SEARCH_CLICK, 3, 6), pulse(frame, PEDS_CLICK, 3, 6))}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
}

function OrgPage({ frame, filter, query, focused, typing }: { frame: number; filter: number; query: string; focused: number; typing: boolean }) {
  const match = query.length > 6;
  return (
    <>
      <div style={{ position: "absolute", left: 28, top: 28, fontFamily: F.display, fontWeight: 500, fontSize: 46, lineHeight: "50px", letterSpacing: "-0.025em", color: C.walnut, ...fly(frame, { at: 6, y: 14, dur: 18, blur: 0 }) }}>
        Organization
      </div>
      <div style={{ position: "absolute", right: 28, top: 34, display: "flex", gap: 8, ...fly(frame, { at: 10, y: 14, dur: 18, blur: 0 }) }}>
        <IconButton icon="search" />
        <Button height={38} icon={<Icon name="plus" size={14} color={C.paper} />} style={{ fontSize: 14 }}>
          Add location
        </Button>
      </div>

      <div style={{ position: "absolute", left: SEARCH.x, top: SEARCH.y, ...fly(frame, { at: 14, y: 10, dur: 16, blur: 0 }) }}>
        <SearchField value={query} placeholder="Search departments, sites, people" width={SEARCH.w} height={SEARCH.h} focused={focused} caret={typing ? 1 : focused * blink(frame)} />
      </div>
      <div style={{ position: "absolute", left: FILTER.x, top: FILTER.y, width: FILTER.w, ...fly(frame, { at: 16, y: 10, dur: 16, blur: 0 }) }}>
        <Segmented options={FILTERS} active={filter} height={40} />
      </div>
      <div style={{ position: "absolute", right: 28, top: 98, ...fly(frame, { at: 18, y: 10, dur: 16, blur: 0 }) }}>
        <Dropdown value="Lakeview Campus" />
      </div>

      <div
        style={{
          position: "absolute",
          left: HOSPITAL.x,
          top: HOSPITAL.y,
          width: HOSPITAL.w,
          height: HOSPITAL.h,
          pointerEvents: "none",
          ...fly(frame, { at: 12, y: 24, scale: 0.96, dur: 22, out: CARD_AT + 6, outDur: 16, outY: -20, outScale: 0.96 }),
        }}
      >
        <HospitalCard />
      </div>

      {DEPTS.map((dept, i) => {
        const hide = match && i !== 0 && i !== 5;
        const enter = ramp(frame, CARD_AT + i * 5, 18) * (1 - (hide ? ramp(frame, SEND_SEARCH, 12) : 0));
        if (enter <= 0.01) return null;
        const selected = i === 0 && frame >= PEDS_CLICK;
        return (
          <div
            key={dept.name}
            style={{
              position: "absolute",
              left: GRID.x + (i % 3) * (GRID.colW + GRID.gap),
              top: GRID.y + Math.floor(i / 3) * (GRID.rowH + GRID.gap),
              width: GRID.colW,
              height: GRID.rowH,
              opacity: enter,
              transform: `translateY(${(1 - enter) * 28}px) scale(${lerp(0.94, selected ? 0.98 : 1, enter)})`,
            }}
          >
            <DeptCard dept={dept} frame={frame} selected={selected} />
          </div>
        );
      })}
    </>
  );
}

function HospitalCard() {
  return (
    <div style={{ height: "100%", boxSizing: "border-box", padding: "22px 24px", borderRadius: 22, background: C.paper, border: `1px solid ${C.line}`, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 52, height: 52, borderRadius: 16, background: C.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="building" size={24} color={C.paper} />
        </div>
        <div style={{ flex: 1, fontFamily: F.display, fontWeight: 500, fontSize: 34, letterSpacing: "-0.025em", color: C.walnut }}>{H.system}</div>
        <Chip tone="green">Live</Chip>
      </div>
      <div style={{ marginTop: "auto", display: "flex", gap: 8 }}>
        <Chip tone="sand">4 hospitals</Chip>
        <Chip tone="sand">38 locations</Chip>
        <Chip tone="sand">1,240 providers</Chip>
      </div>
    </div>
  );
}

function DeptCard({ dept, frame, selected }: { dept: Dept; frame: number; selected: boolean }) {
  const extras = ramp(frame, 96, 16);
  return (
    <div
      style={{
        height: "100%",
        boxSizing: "border-box",
        padding: 18,
        borderRadius: 18,
        background: C.paper,
        border: selected ? `1.5px solid ${C.walnut}` : `1px solid ${C.line}`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ width: 34, height: 34, borderRadius: 999, background: dept.tone }} />
        <Chip tone="outline">{dept.count}</Chip>
      </div>
      <div style={{ marginTop: "auto", fontFamily: F.ui, fontWeight: 600, fontSize: 16, color: C.walnut }}>{dept.name}</div>
      <div style={{ fontFamily: F.display, fontWeight: 500, fontSize: 30, lineHeight: "36px", letterSpacing: "-0.02em", color: C.walnut }}>{dept.count}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12, opacity: extras }}>
        <div style={{ display: "flex" }}>
          {dept.people.map((label, i) => (
            <div key={label} style={{ marginLeft: i ? -6 : 0 }}>
              <Avatar label={label} size={22} tone={i === 0 ? "salmon" : "sand"} />
            </div>
          ))}
        </div>
        <Chip tone="sand">{dept.loc}</Chip>
      </div>
    </div>
  );
}

/* ─── Parent asks; the agent walks the hospital as a product ───────────────── */

const QUERY = "Pediatric neurology for Ava — two seizures since August.";
const Q = { x: 160, w: 1600, top: -980, h: 360 };
const Q_CY = Q.top + Q.h / 2;
const TYPE = { at: 24, cps: 34 };
const SEND_AT = 108;
const SEND_BUTTON = { x: Q.x + Q.w - 56 - 36, y: Q.top + Q.h - 40 - 36 };

const COL = { top: 158, h: 690, w: 262, step: 274, x0: 28 };
const ROW = { top: 50, h: 52, step: 56 };
const DETAIL = { x: COL.x0 + 3 * COL.step, top: COL.top, h: COL.h, w: 1364 - 28 - (COL.x0 + 3 * COL.step) };

type Entry = { name: string; count: string; icon?: IconName; tone?: string };

const DEPARTMENTS: Entry[] = [
  { name: "Emergency", count: "4", icon: "plus", tone: TILE_TONES[2] },
  { name: "Cardiology", count: "9", icon: "heart", tone: TILE_TONES[1] },
  { name: "Pediatrics", count: "18", icon: "user", tone: TILE_TONES[0] },
  { name: "Oncology", count: "7", icon: "pill", tone: TILE_TONES[0] },
  { name: "Imaging", count: "11", icon: "scan", tone: TILE_TONES[3] },
  { name: "Neurosciences", count: "6", icon: "brain", tone: TILE_TONES[2] },
  { name: "Orthopedics", count: "8", icon: "activity", tone: TILE_TONES[1] },
  { name: "Behavioral Health", count: "5", icon: "chat", tone: TILE_TONES[3] },
  { name: "Primary Care", count: "22", icon: "home", tone: TILE_TONES[3] },
  { name: "Women’s Health", count: "6", icon: "heart", tone: TILE_TONES[0] },
];

const SPECIALTIES: Entry[] = [
  { name: "Adolescent Med", count: "3" },
  { name: "Cardiology", count: "6" },
  { name: "Endocrinology", count: "3" },
  { name: "GI", count: "4" },
  { name: "Neurology", count: "5" },
  { name: "Pulmonology", count: "3" },
  { name: "Hematology", count: "4" },
  { name: "Orthopedics", count: "5" },
  { name: "Urology", count: "2" },
  { name: "Nephrology", count: "3" },
];

const PROGRAMS: Entry[] = [
  { name: "Headache Clinic", count: "6" },
  { name: "Epilepsy Program", count: "12" },
  { name: "Neuromuscular", count: "4" },
  { name: "Movement", count: "3" },
  { name: "Neurodevelopment", count: "8" },
  { name: "Sleep Medicine", count: "5" },
  { name: "Concussion", count: "4" },
];

type Walk = { at: number; path: number[]; step: number };
const WALKS: Walk[] = [
  { at: 168, path: [0, 1, 2], step: 7 },
  { at: 198, path: [0, 1, 2, 3, 4], step: 6 },
  { at: 234, path: [0, 1], step: 8 },
];
const pickAt = (w: Walk) => w.at + (w.path.length - 1) * w.step + 4;
const OPEN_AT = [140, pickAt(WALKS[0]) + 2, pickAt(WALKS[1]) + 2, pickAt(WALKS[2]) + 2];
const CRUMBS = ["Pediatrics", "Neurology", "Epilepsy"];

const LOCATION_AT = 284;
const CHECKS_AT = [304, 316, 328];
const STEPS_AT = [350, 360, 370];

/** Camera makes room first; the answer card only then slides in. */
const ROOM_AT = 430;
const ANSWER = { x: 1760, y: 190, w: 720, pad: 36 };
const ANSWER_AT = 458;
const ANSWER_BTN = { top: 500, h: 60 };
const REQUEST_AT = 604;
const REQUEST_BUTTON = { x: ANSWER.x + ANSWER.pad + (ANSWER.w - ANSWER.pad * 2 - 12 - 190) / 2, y: ANSWER.y + ANSWER_BTN.top + ANSWER_BTN.h / 2 };

function PathwayScene() {
  const frame = useCurrentFrame();
  const text = typed(QUERY, frame, TYPE.at, TYPE.cps);
  const typing = text.length > 0 && text.length < QUERY.length;
  const toSend = ramp(frame, 86, 20, EASE_IN_OUT);
  const toRequest = ramp(frame, 560, 40, EASE_IN_OUT);
  const cam = camera(frame, [
    { f: 0, x: 950, y: Q_CY - 10, s: 1.22 },
    { f: 20, x: 950, y: Q_CY - 10, s: 1.22 },
    { f: 96, x: 960, y: Q_CY, s: 1.02 },
    { f: SEND_AT + 4, x: 960, y: Q_CY, s: 1.0 },
    { f: 170, x: 600, y: 470, s: 1.55 },
    { f: 200, x: 620, y: 470, s: 1.55 },
    { f: 236, x: 860, y: 470, s: 1.5 },
    { f: 262, x: 1140, y: 480, s: 1.42 },
    { f: 300, x: 1384, y: 470, s: 1.52 },
    { f: 400, x: 1390, y: 560, s: 1.56 },
    { f: ROOM_AT, x: 1390, y: 540, s: 1.4 },
    { f: 448, x: 1480, y: 540, s: 0.92 },
    { f: ANSWER_AT + 8, x: 1680, y: 540, s: 0.88 },
    { f: 540, x: 1880, y: 540, s: 1.08 },
    { f: 620, x: 1980, y: 600, s: 1.2 },
    { f: PATHWAY.dur, x: 1990, y: 610, s: 1.24 },
  ]);

  return (
    <AbsoluteFill>
      <div style={cam}>
        <div style={{ position: "absolute", left: Q.x, top: Q.top, width: Q.w, ...fly(frame, { at: 0, y: 80, scale: 0.94, dur: 24 }) }}>
          <QueryCard frame={frame} text={text} typing={typing} />
        </div>
        <ClickRing x={SEND_BUTTON.x} y={SEND_BUTTON.y} progress={ramp(frame, SEND_AT + 1, 16)} />
        <div style={{ opacity: ramp(frame, 84, 8) * (1 - ramp(frame, SEND_AT + 8, 10)) }}>
          <Cursor x={lerp(1520, SEND_BUTTON.x, toSend)} y={lerp(Q.top + Q.h + 200, SEND_BUTTON.y, toSend)} pressed={pulse(frame, SEND_AT, 3, 6)} />
        </div>

        <div style={{ position: "absolute", left: SHELL.x, top: SHELL.y }}>
          <AppShell active={2} railReveal={(i) => ramp(frame, 128 + i * 2, 12)}>
            <NetworkBrowser frame={frame} />
          </AppShell>
        </div>

        <div style={{ position: "absolute", left: ANSWER.x, top: ANSWER.y, width: ANSWER.w, ...fly(frame, { at: ANSWER_AT, x: 70, y: 0, scale: 0.96, dur: 22 }) }}>
          <AnswerCard frame={frame} />
        </div>
        <ClickRing x={REQUEST_BUTTON.x} y={REQUEST_BUTTON.y} progress={ramp(frame, REQUEST_AT + 1, 16)} />
        <div style={{ opacity: ramp(frame, 558, 8) }}>
          <Cursor x={lerp(2420, REQUEST_BUTTON.x, toRequest)} y={lerp(1010, REQUEST_BUTTON.y, toRequest)} pressed={pulse(frame, REQUEST_AT, 3, 6)} />
        </div>
      </div>
    </AbsoluteFill>
  );
}

function QueryCard({ frame, text, typing }: { frame: number; text: string; typing: boolean }) {
  return (
    <div style={{ height: Q.h, boxSizing: "border-box", padding: "36px 48px 32px", borderRadius: 40, background: C.paper, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex" }}>
        <div style={{ display: "flex", alignItems: "center", height: 44, padding: "0 20px", borderRadius: 999, background: C.ink, fontFamily: F.ui, fontWeight: 500, fontSize: 20, color: C.paper }}>Dana’s Agent</div>
      </div>
      <div style={{ minHeight: 120, marginTop: 20, fontFamily: F.ui, fontWeight: 500, fontSize: 48, lineHeight: "60px", letterSpacing: "-0.015em", color: C.walnut }}>
        {text.length === 0 ? <span style={{ color: "rgba(40, 25, 16, 0.32)" }}>Ask about Ava’s care</span> : text}
        <Caret height={48} width={4} visible={typing ? 1 : blink(frame)} />
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
        <div style={{ display: "flex", gap: 10 }}>
          <Chip tone="sand" size={1.5} icon={<Icon name="paperclip" size={18} />}>
            Ava’s chart
          </Chip>
          <Chip tone="sand" size={1.5} icon={<Icon name="shield" size={18} />}>
            Harbor Mutual
          </Chip>
        </div>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 999,
            background: text.length === QUERY.length ? C.ink : "rgba(40, 25, 16, 0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${1 - 0.1 * pulse(frame, SEND_AT, 3, 8)})`,
          }}
        >
          <Icon name="arrowUp" size={26} color={C.paper} stroke={2.4} />
        </div>
      </div>
    </div>
  );
}

function NetworkBrowser({ frame }: { frame: number }) {
  return (
    <>
      <div style={{ position: "absolute", left: 28, top: 28, fontFamily: F.display, fontWeight: 500, fontSize: 46, lineHeight: "50px", letterSpacing: "-0.025em", color: C.walnut, ...fly(frame, { at: 132, y: 14, dur: 18, blur: 0 }) }}>
        Network
      </div>
      <div style={{ position: "absolute", right: 28, top: 34, display: "flex", gap: 8, ...fly(frame, { at: 136, y: 14, dur: 18, blur: 0 }) }}>
        <SearchField placeholder="Find a program" width={240} />
        <Segmented options={["Map", "Columns"]} active={1} height={38} style={{ width: 188 }} />
        <Button height={38} icon={<Icon name="plus" size={14} color={C.paper} />} style={{ fontSize: 14 }}>
          Add node
        </Button>
      </div>

      <div style={{ position: "absolute", left: 28, top: 98, height: 40, display: "flex", alignItems: "center", gap: 8, ...fly(frame, { at: 138, y: 12, dur: 18, blur: 0 }) }}>
        <Crumb icon="building" lit={ramp(frame, ROOM_AT, 10)}>
          {H.system}
        </Crumb>
        {CRUMBS.map((label, i) => {
          const at = pickAt(WALKS[i]);
          if (frame < at) return null;
          return (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, ...fly(frame, { at, x: -10, y: 0, dur: 12, blur: 0 }) }}>
              <Icon name="chevronRight" size={14} color={C.faint} stroke={2.2} />
              <Crumb lit={ramp(frame, ROOM_AT + 6 + i * 6, 10)}>{label}</Crumb>
            </div>
          );
        })}
      </div>

      <BrowserColumn frame={frame} index={0} title="Departments" items={DEPARTMENTS} walk={WALKS[0]} />
      <BrowserColumn frame={frame} index={1} title="Pediatrics" items={SPECIALTIES} walk={WALKS[1]} />
      <BrowserColumn frame={frame} index={2} title="Neurology" items={PROGRAMS} walk={WALKS[2]} />

      <div
        style={{
          position: "absolute",
          left: DETAIL.x,
          top: DETAIL.top,
          width: DETAIL.w,
          height: DETAIL.h,
          borderRadius: 22,
          boxSizing: "border-box",
          border: "1.5px dashed rgba(40, 25, 16, 0.18)",
          opacity: ramp(frame, 150, 14) * (1 - ramp(frame, OPEN_AT[3], 10)),
        }}
      />
      <div style={{ position: "absolute", left: DETAIL.x, top: DETAIL.top, width: DETAIL.w, height: DETAIL.h, ...fly(frame, { at: OPEN_AT[3], x: 56, y: 0, scale: 1, dur: 20, blur: 0 }) }}>
        <ProgramDetail frame={frame} />
      </div>
    </>
  );
}

function Crumb({ icon, lit, children }: { icon?: IconName; lit: number; children: ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, height: 36, padding: "0 14px", borderRadius: 999, background: mix(C.beige, C.ink, lit), fontFamily: F.ui, fontWeight: 500, fontSize: 15, color: mix(C.walnut, C.paper, lit), whiteSpace: "nowrap" }}>
      {icon ? <Icon name={icon} size={15} color={mix(C.walnut, C.paper, lit)} /> : null}
      {children}
    </div>
  );
}

const MUTED_HEX = "#8F8173";
const MUTED_LIT = "#BDB2A4";

function BrowserColumn({ frame, index, title, items, walk }: { frame: number; index: number; title: string; items: Entry[]; walk: Walk }) {
  const openAt = OPEN_AT[index];
  if (frame < openAt - 2) return null;
  const frames = walk.path.map((_, k) => walk.at + k * walk.step);
  const hl = walk.path.length > 1 ? keys(frame, frames, walk.path) : walk.path[0];
  const hlIn = ramp(frame, walk.at, 6);
  const picked = pickAt(walk);
  const press = pulse(frame, picked, 3, 8);
  const nextWalk = WALKS[index + 1];
  const avatarOn = hlIn * (1 - ramp(frame, nextWalk ? nextWalk.at - 4 : OPEN_AT[3] + 12, 8));
  const target = walk.path[walk.path.length - 1];

  return (
    <div style={{ position: "absolute", left: COL.x0 + index * COL.step, top: COL.top, width: COL.w, height: COL.h, borderRadius: 22, background: C.beige, overflow: "hidden", ...fly(frame, { at: openAt, x: -24, y: 0, scale: 1, dur: 18, blur: 0 }) }}>
      <div style={{ position: "absolute", left: 18, top: 18, fontFamily: F.body, fontWeight: 500, fontSize: 13, lineHeight: "16px", color: C.muted }}>{title}</div>
      <div
        style={{
          position: "absolute",
          left: 6,
          top: ROW.top + hl * ROW.step,
          width: COL.w - 12,
          height: ROW.h,
          borderRadius: 14,
          background: C.ink,
          opacity: hlIn,
          transform: `scale(${1 - 0.03 * press})`,
        }}
      />
      {items.map((item, i) => {
        const lit = hlIn * clamp01(1 - Math.abs(hl - i));
        const fg = mix(C.walnut, C.paper, lit);
        return (
          <div
            key={item.name}
            style={{
              position: "absolute",
              left: 6,
              top: ROW.top + i * ROW.step,
              width: COL.w - 12,
              height: ROW.h,
              boxSizing: "border-box",
              padding: "0 12px 0 10px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontFamily: F.ui,
              fontWeight: 500,
              fontSize: 16,
              color: fg,
              whiteSpace: "nowrap",
              opacity: i === target ? 1 : 0.85,
              ...fly(frame, { at: openAt + 2 + i * 2, y: 10, dur: 14, blur: 0 }),
            }}
          >
            {item.tone ? <div style={{ width: 22, height: 22, borderRadius: 7, background: item.tone, flexShrink: 0 }} /> : item.icon ? <Icon name={item.icon} size={17} color={fg} /> : null}
            <span style={{ flex: 1 }}>{item.name}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 8, opacity: 1 - lit * avatarOn }}>
              <span style={{ fontSize: 14, color: mix(MUTED_HEX, MUTED_LIT, lit) }}>{item.count}</span>
              <Icon name="chevronRight" size={13} color={mix(MUTED_HEX, MUTED_LIT, lit)} stroke={2.2} />
            </span>
          </div>
        );
      })}
      {avatarOn > 0.01 ? (
        <div style={{ position: "absolute", left: COL.w - 6 - 11 - 30, top: ROW.top + hl * ROW.step + 11, opacity: avatarOn, transform: `scale(${lerp(0.6, 1, avatarOn)})` }}>
          <Avatar label="D" size={30} />
        </div>
      ) : null}
    </div>
  );
}

const darkChip: CSSProperties = { background: "rgba(255, 252, 241, 0.1)", color: C.paper };

function ProgramDetail({ frame }: { frame: number }) {
  const locFlash = pulse(frame, LOCATION_AT, 6, 26);
  const card: CSSProperties = { borderRadius: 18, background: C.paper, padding: "16px 18px", boxSizing: "border-box" };
  return (
    <div style={{ position: "absolute", inset: 0, boxSizing: "border-box", padding: 22, borderRadius: 22, background: C.ink, display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ fontFamily: F.display, fontWeight: 500, fontSize: 28, lineHeight: "34px", letterSpacing: "-0.02em", color: C.paper }}>Epilepsy Program</div>
        <div style={{ width: 34, height: 34, flexShrink: 0, borderRadius: 10, background: "rgba(255, 252, 241, 0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="x" size={16} color={C.paper} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <Chip size={1.05} style={darkChip}>
          Neurology
        </Chip>
        <Chip size={1.05} style={darkChip}>
          12 providers
        </Chip>
      </div>

      <div style={{ ...card, position: "relative", overflow: "hidden", display: "flex", alignItems: "center", gap: 14, ...fly(frame, { at: OPEN_AT[3] + 10, y: 14, dur: 16, blur: 0 }) }}>
        <div style={{ position: "absolute", inset: 0, background: C.salmon, opacity: 0.5 * locFlash }} />
        <div style={{ position: "relative", width: 44, height: 44, borderRadius: 14, background: C.salmon }} />
        <div style={{ position: "relative", flex: 1, fontFamily: F.ui, fontWeight: 600, fontSize: 17, color: C.walnut }}>{H.campus}</div>
        <div style={{ position: "relative" }}>
          <Chip tone="outline">3rd floor</Chip>
        </div>
      </div>

      <div style={{ ...card, display: "flex", flexDirection: "column", gap: 12, ...fly(frame, { at: OPEN_AT[3] + 16, y: 14, dur: 16, blur: 0 }) }}>
        {["Ages 0–21", "2+ unprovoked seizures", "Harbor Mutual"].map((label, i) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: F.ui, fontWeight: 500, fontSize: 16, color: C.walnut }}>
            <CheckBox checked={ramp(frame, CHECKS_AT[i], 8)} size={22} />
            {label}
          </div>
        ))}
      </div>

      <div style={{ ...card, display: "flex", flexDirection: "column", gap: 10, ...fly(frame, { at: OPEN_AT[3] + 22, y: 14, dur: 16, blur: 0 }) }}>
        {[
          { label: "Referral", chip: <Chip tone="salmon">Requested</Chip> },
          { label: "EEG", chip: <Chip tone="outline">Needed</Chip> },
          { label: "Seizure diary", chip: <Chip tone="dashed">Upload</Chip> },
        ].map((step, i) => (
          <div key={step.label} style={{ height: 40, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 6px 0 14px", borderRadius: 12, background: C.beige, fontFamily: F.ui, fontWeight: 500, fontSize: 15, color: C.walnut }}>
            {step.label}
            <div style={fly(frame, { at: STEPS_AT[i], x: 10, y: 0, scale: 0.85, dur: 12, blur: 0 })}>{step.chip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnswerCard({ frame }: { frame: number }) {
  const requested = ramp(frame, REQUEST_AT + 4, 10, EASE_IN_OUT);
  return (
    <div style={{ position: "relative", height: ANSWER_BTN.top + ANSWER_BTN.h + ANSWER.pad, borderRadius: 36, background: C.paper, border: `1px solid ${C.line}` }}>
      <div style={{ position: "absolute", left: ANSWER.pad, top: ANSWER.pad, display: "flex", alignItems: "center", height: 40, padding: "0 18px", borderRadius: 999, background: C.ink, fontFamily: F.ui, fontWeight: 500, fontSize: 18, color: C.paper }}>Dana’s Agent</div>
      <div style={{ position: "absolute", left: ANSWER.pad, top: 96, fontFamily: F.display, fontWeight: 500, fontSize: 38, lineHeight: "46px", letterSpacing: "-0.025em", color: C.walnut, ...fly(frame, { at: ANSWER_AT + 8, y: 12, dur: 16, blur: 0 }) }}>
        Epilepsy Program
      </div>
      <div style={{ position: "absolute", left: ANSWER.pad, top: 156, display: "flex", alignItems: "center", gap: 8 }}>
        {["Pediatrics", "Neurology", "Lakeview"].map((label, i) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, ...fly(frame, { at: ANSWER_AT + 16 + i * 5, x: -8, y: 0, dur: 12, blur: 0 }) }}>
            {i > 0 ? <Icon name="chevronRight" size={13} color={C.faint} stroke={2.2} /> : null}
            <Chip tone="sand" size={1.2}>
              {label}
            </Chip>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: ANSWER.pad, top: 214, display: "flex", gap: 20 }}>
        {["Ava is eligible", "In network"].map((label, i) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: F.ui, fontWeight: 500, fontSize: 17, color: C.liveText, ...fly(frame, { at: ANSWER_AT + 28 + i * 5, x: 8, y: 0, dur: 12, blur: 0 }) }}>
            <Icon name="check" size={17} color={C.liveText} stroke={2.6} />
            {label}
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: ANSWER.pad, right: ANSWER.pad, top: 268, display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          { label: "Referral · Dr. Kim", chip: <Chip tone="salmon">Requested</Chip> },
          { label: "EEG", chip: <Chip tone="paper" icon={<Icon name="calendar" size={13} />}>Thu 8:30</Chip> },
          { label: "Seizure diary", chip: <Chip tone="green" icon={<Icon name="check" size={12} color={C.liveText} stroke={2.6} />}>Shared</Chip> },
        ].map((step, i) => (
          <div
            key={step.label}
            style={{
              height: 64,
              boxSizing: "border-box",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 14px 0 20px",
              borderRadius: 16,
              background: C.beige,
              fontFamily: F.ui,
              fontWeight: 600,
              fontSize: 17,
              color: C.walnut,
              ...fly(frame, { at: ANSWER_AT + 38 + i * 5, y: 12, dur: 14, blur: 0 }),
            }}
          >
            {step.label}
            {step.chip}
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: ANSWER.pad, right: ANSWER.pad, top: ANSWER_BTN.top, display: "flex", gap: 10, ...fly(frame, { at: ANSWER_AT + 56, y: 14, dur: 16, blur: 0 }) }}>
        <div style={{ position: "relative", flex: 1, transform: `scale(${1 - 0.04 * pulse(frame, REQUEST_AT, 3, 8)})` }}>
          <Button tone="ink" height={ANSWER_BTN.h} icon={<Icon name="calendar" size={20} color={C.paper} />} style={{ fontSize: 20, opacity: 1 - requested }}>
            Request visit
          </Button>
          <div style={{ position: "absolute", inset: 0, opacity: requested }}>
            <Button tone="ink" height={ANSWER_BTN.h} icon={<Icon name="check" size={20} color={C.liveText} stroke={2.6} />} style={{ fontSize: 20, background: C.liveBg, color: C.liveText }}>
              Requested
            </Button>
          </div>
        </div>
        <Button tone="sand" height={ANSWER_BTN.h} icon={<Icon name="mapPin" size={20} />} style={{ fontSize: 20, width: 190 }}>
          Directions
        </Button>
      </div>
    </div>
  );
}
