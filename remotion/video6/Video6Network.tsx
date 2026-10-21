import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";

import { DotWave, Stage } from "../video1/backdrops";
import { Bubble, IPhone, Slot, TimeStamp, TypingBubble } from "../video1/imessage";
import { EASE_IN_OUT, EASE_OUT, camera, lerp, pulse, ramp, typed, type CameraKey } from "../video1/motion";
import { C, F } from "../video1/theme";
import { AppShell, Chip, ClickRing, Cursor, ShadowsContext } from "../video1/ui";
import {
  AgentPointer,
  Av,
  CheckRow,
  Display,
  Ico,
  ListRow,
  PANEL,
  PEACH_TILE,
  Pill,
  SAGE_TILE,
  SAND_TILE,
  SHELL,
  SUB,
  Segmented,
  Status,
  Tile,
  arc,
  draftTail,
  fmt,
  onPage,
  press,
  rise,
  track,
  type AvTone,
  type IcoName,
} from "./kit";

export const VIDEO6_NETWORK_FRAMES = 900;

export function Video6Network() {
  return (
    <ShadowsContext.Provider value={false}>
      <Audio src={staticFile("video1/BED.m4a")} startFrom={1230} volume={0.2} />
      <Stage backdrop={<DotWave top={0.56} amp={60} />}>
        <NetworkWorld />
      </Stage>
    </ShadowsContext.Provider>
  );
}

/* ─── Data: one health system, browsed as columns ─────────────────────────── */

type Item = { name: string; meta?: string; tile?: string; icon?: IcoName; av?: [string, AvTone]; more?: boolean };
type Column = { title: string; all: Item[]; total: number; scoped?: Item[]; scopedTotal?: number; pick?: number };

const more = (n: string): Item => ({ name: n, more: true });

const COLUMNS: Column[] = [
  {
    title: "Locations",
    total: 14,
    pick: 1,
    all: [
      { name: "Bayview Medical Center", meta: "Main campus", tile: SAND_TILE, icon: "building" },
      { name: "Bayview Children\u2019s", meta: "Mission Bay", tile: C.salmon, icon: "building" },
      { name: "Eastside Clinic", meta: "Oakland", tile: SAGE_TILE, icon: "building" },
      { name: "Harbor Imaging", meta: "SoMa", tile: SAND_TILE, icon: "scan" },
      { name: "Bayview Rehab", meta: "Daly City", tile: PEACH_TILE, icon: "activity" },
      { name: "Northgate Urgent Care", meta: "San Rafael", tile: SAGE_TILE, icon: "building" },
      { name: "Sunset Primary Care", meta: "Outer Sunset", tile: SAND_TILE, icon: "building" },
      { name: "Peninsula Surgery", meta: "San Mateo", tile: PEACH_TILE, icon: "building" },
      more("6 more"),
    ],
  },
  {
    title: "Departments",
    total: 38,
    scopedTotal: 11,
    pick: 2,
    all: [
      { name: "Emergency", meta: "Open 24/7", tile: C.salmon, icon: "alert" },
      { name: "Cardiology", meta: "9 programs", tile: PEACH_TILE, icon: "heart" },
      { name: "Oncology", meta: "7 programs", tile: SAND_TILE, icon: "shield" },
      { name: "Orthopedics", meta: "5 programs", tile: SAGE_TILE, icon: "activity" },
      { name: "Neurology", meta: "6 programs", tile: PEACH_TILE, icon: "brain" },
      { name: "Imaging", meta: "4 locations", tile: SAND_TILE, icon: "scan" },
      { name: "Behavioral health", meta: "3 programs", tile: SAGE_TILE, icon: "chat" },
      { name: "Primary care", meta: "12 clinics", tile: SAND_TILE, icon: "user" },
      more("30 more"),
    ],
    scoped: [
      { name: "Pediatric Emergency", meta: "Open 24/7", tile: C.salmon, icon: "alert" },
      { name: "NICU", meta: "Level IV", tile: SAGE_TILE, icon: "heart" },
      { name: "Pediatrics", meta: "14 specialties", tile: PEACH_TILE, icon: "user" },
      { name: "Pediatric Surgery", meta: "6 programs", tile: SAND_TILE, icon: "activity" },
      { name: "Imaging", meta: "MRI, EEG, CT", tile: SAND_TILE, icon: "scan" },
      { name: "Child Life", meta: "Family support", tile: SAGE_TILE, icon: "heart" },
      { name: "Rehab", meta: "PT, OT, speech", tile: PEACH_TILE, icon: "activity" },
      { name: "Behavioral health", meta: "2 programs", tile: SAGE_TILE, icon: "chat" },
      more("3 more"),
    ],
  },
  {
    title: "Specialties",
    total: 64,
    scopedTotal: 14,
    pick: 3,
    all: [
      { name: "Electrophysiology", meta: "Cardiology", tile: PEACH_TILE, icon: "activity" },
      { name: "Interventional", meta: "Cardiology", tile: PEACH_TILE, icon: "heart" },
      { name: "Stroke", meta: "Neurology", tile: SAND_TILE, icon: "brain" },
      { name: "Sports medicine", meta: "Orthopedics", tile: SAGE_TILE, icon: "activity" },
      { name: "Neuro-oncology", meta: "Oncology", tile: SAND_TILE, icon: "brain" },
      { name: "Hepatology", meta: "Digestive health", tile: SAGE_TILE, icon: "pill" },
      { name: "Rheumatology", meta: "Medicine", tile: PEACH_TILE, icon: "user" },
      { name: "Endocrinology", meta: "Medicine", tile: SAND_TILE, icon: "pill" },
      more("56 more"),
    ],
    scoped: [
      { name: "Cardiology", meta: "Pediatrics", tile: PEACH_TILE, icon: "heart" },
      { name: "Endocrinology", meta: "Pediatrics", tile: SAND_TILE, icon: "pill" },
      { name: "Gastroenterology", meta: "Pediatrics", tile: SAGE_TILE, icon: "pill" },
      { name: "Neurology", meta: "5 programs", tile: C.salmon, icon: "brain" },
      { name: "Pulmonology", meta: "Pediatrics", tile: SAND_TILE, icon: "activity" },
      { name: "Hematology", meta: "Pediatrics", tile: PEACH_TILE, icon: "heart" },
      { name: "Nephrology", meta: "Pediatrics", tile: SAGE_TILE, icon: "shield" },
      { name: "Developmental", meta: "Pediatrics", tile: SAND_TILE, icon: "user" },
      more("6 more"),
    ],
  },
  {
    title: "Programs",
    total: 112,
    scopedTotal: 5,
    pick: 1,
    all: [
      { name: "Heart failure", meta: "Cardiology", tile: PEACH_TILE, icon: "heart" },
      { name: "Joint replacement", meta: "Orthopedics", tile: SAGE_TILE, icon: "activity" },
      { name: "Breast health", meta: "Oncology", tile: SAND_TILE, icon: "shield" },
      { name: "Stroke", meta: "Neurology", tile: PEACH_TILE, icon: "brain" },
      { name: "Bariatric surgery", meta: "Surgery", tile: SAND_TILE, icon: "scale" },
      { name: "Cardiac rehab", meta: "Cardiology", tile: SAGE_TILE, icon: "activity" },
      { name: "Sleep medicine", meta: "Pulmonology", tile: SAND_TILE, icon: "clock" },
      { name: "Spine", meta: "Orthopedics", tile: PEACH_TILE, icon: "activity" },
      more("104 more"),
    ],
    scoped: [
      { name: "Headache clinic", meta: "Ages 5\u201318", tile: SAND_TILE, icon: "brain" },
      { name: "Epilepsy program", meta: "Level 4 center", tile: C.salmon, icon: "brain" },
      { name: "Neuromuscular", meta: "Ages 0\u201321", tile: SAGE_TILE, icon: "activity" },
      { name: "Movement disorders", meta: "Ages 2\u201318", tile: PEACH_TILE, icon: "activity" },
      { name: "Neurodevelopment", meta: "Ages 0\u20135", tile: SAND_TILE, icon: "user" },
    ],
  },
  {
    title: "Providers",
    total: 2140,
    scopedTotal: 6,
    all: [
      { name: "Dr. Elena Ruiz", meta: "Cardiology", av: ["ER", "salmon"] },
      { name: "Dr. Marcus Hale", meta: "Orthopedics", av: ["MH", "sage"] },
      { name: "Dr. Priya Nair", meta: "Oncology", av: ["PN", "sand"] },
      { name: "Dr. James Wu", meta: "Neurology", av: ["JW", "salmon"] },
      { name: "Dr. Hannah Cole", meta: "Emergency", av: ["HC", "sage"] },
      { name: "Dr. Omar Aziz", meta: "Imaging", av: ["OA", "sand"] },
      { name: "Kate Lin, NP", meta: "Primary care", av: ["KL", "salmon"] },
      { name: "Dr. Ravi Patel", meta: "Stroke", av: ["RP", "sage"] },
      more("2,132 more"),
    ],
    scoped: [
      { name: "Dr. Anika Rao", meta: "Epileptologist", av: ["AR", "salmon"] },
      { name: "Dr. Sam Okafor", meta: "Child neurology", av: ["SO", "sage"] },
      { name: "Dr. Lena Brooks", meta: "EEG", av: ["LB", "sand"] },
      { name: "Maria Chen, NP", meta: "Epilepsy", av: ["MC", "salmon"] },
      { name: "Tom Reyes, RN", meta: "Nurse navigator", av: ["TR", "sage"] },
      { name: "Dr. Ivy Tran", meta: "Neuropsychology", av: ["IT", "sand"] },
    ],
  },
];

/* ─── Geometry (page coordinates unless noted) ────────────────────────────── */

const COL = { x: 28, y: 104, w: 252, gap: 12, h: 744, rowsTop: 58, rowH: 60, rowGap: 4 };
const STEP = COL.w + COL.gap;
const SCROLL = 2 * STEP;
const DETAIL = { w: 516 };
const rowY = (r: number) => COL.y + COL.rowsTop + r * (COL.rowH + COL.rowGap);

const SEARCH = { x: 392, y: 30, w: 600, h: 46, pad: 46, sep: 18 };
const CRUMBS = ["Bayview Children\u2019s", "Pediatrics", "Neurology", "Epilepsy program"];
const crumbW = (label: string) => Math.round(24 + label.length * 7.3);
const CRUMB_X = CRUMBS.map((_, i) => SEARCH.pad + CRUMBS.slice(0, i).reduce((s, l) => s + crumbW(l) + SEARCH.sep, 0));

/** World layout: the shell on the left, Ava's mom's phone to its right. */
const PHONE = { w: 393, h: 852, x: 1800, y: 114 };
const THREAD = { left: PHONE.x + 19, bottom: PHONE.y + PHONE.h - 99 };
const CARD = { w: 300, h: 260, pad: 14, head: 24, stepH: 32, stepGap: 6 };
const CARD_TOP = THREAD.bottom - CARD.h;
const stepWorld = (i: number) => ({ x: THREAD.left + CARD.pad + 24, y: CARD_TOP + CARD.pad + CARD.head + 10 + i * (CARD.stepH + CARD.stepGap) + CARD.stepH / 2 });
const BOOK_BTN = { x: THREAD.left + CARD.w / 2, y: THREAD.bottom - CARD.pad - 20 };

/* ─── Timeline ────────────────────────────────────────────────────────────── */

const COLS_AT = 18;
const PAN_TO_PHONE = { from: 196, to: 244 };
const STAMP_AT = 214;
const TYPE_AT = 232;
const ASK = "Can you find the right neurology care for Ava? She had another seizure last week.";
const SEND_AT = 300;
const TYPING_AT = 314;
const REPLY_AT = 336;
const TWO_UP_AT = 352;
const AGENT_IN = 362;
const PICKS = [404, 432, 460, 488];
const SCROLL_AT = { from: 500, to: 532 };
const DETAIL_AT = 516;
const CHECKS = [560, 574, 588];
const STEPS_AT = 600;
const BACK_OUT = { from: 628, to: 664 };
const REPLY2_TYPING = 640;
const REPLY2_AT = 660;
const CARD_SLOT = 676;
const FLY = { at: 690, stagger: 5, dur: 26 };
const landAt = (i: number) => FLY.at + i * FLY.stagger + FLY.dur;
const CARD_REST = landAt(3) + 2;
const TO_PHONE = { from: 724, to: 772 };
const BOOK_AT = 834;

const scrollX = (f: number) => SCROLL * ramp(f, SCROLL_AT.from, SCROLL_AT.to - SCROLL_AT.from, EASE_IN_OUT);
const colX = (i: number, f: number) => COL.x + i * STEP - scrollX(f);
const rowWorld = (col: number, r: number, f: number, dx = 92) => onPage(colX(col, f) + 8 + dx, rowY(r) + COL.rowH / 2);

/* ─── Camera ──────────────────────────────────────────────────────────────── */

const PHONE_CAM = { x: PHONE.x + PHONE.w / 2, y: PHONE.y + PHONE.h - 250, s: 1.9 };
const TWO_UP = { x: 1216, y: 540, s: 0.88 };
const OPEN_CAMS: CameraKey[] = [
  { f: 0, x: 470, y: 390, s: 1.75 },
  { f: 24, x: 470, y: 390, s: 1.72 },
  { f: 150, x: 960, y: 520, s: 1.0 },
  { f: PAN_TO_PHONE.from, x: 980, y: 530, s: 1.02 },
];
const TRAVERSE_CAMS: CameraKey[] = [
  { f: TWO_UP_AT + 22, ...TWO_UP },
  { f: PICKS[0] - 6, x: 640, y: 470, s: 1.32 },
  { f: PICKS[1], x: 800, y: 480, s: 1.32 },
  { f: PICKS[3] - 4, x: 1130, y: 490, s: 1.3 },
  { f: SCROLL_AT.to, x: 1250, y: 520, s: 1.22 },
  { f: CHECKS[0] - 6, x: 1330, y: 500, s: 1.42 },
  { f: BACK_OUT.from, x: 1340, y: 560, s: 1.4 },
];
const PHONE_CARD_CAM = { x: THREAD.left + CARD.w / 2 + 6, y: CARD_TOP + 70, s: 1.75 };

function worldCamera(f: number): CSSProperties {
  if (f < PAN_TO_PHONE.from) return camera(f, OPEN_CAMS);
  if (f < PAN_TO_PHONE.to) return arc(f, OPEN_CAMS[OPEN_CAMS.length - 1], PHONE_CAM, PAN_TO_PHONE, 0.3);
  if (f < TWO_UP_AT) return camera(f, [{ f: PAN_TO_PHONE.to, ...PHONE_CAM }, { f: TWO_UP_AT, x: PHONE_CAM.x, y: PHONE_CAM.y - 10, s: 1.5 }]);
  if (f < TWO_UP_AT + 22) return camera(f, [{ f: TWO_UP_AT, x: PHONE_CAM.x, y: PHONE_CAM.y - 10, s: 1.5 }, { f: TWO_UP_AT + 22, ...TWO_UP }]);
  if (f < BACK_OUT.from) return camera(f, TRAVERSE_CAMS);
  if (f < TO_PHONE.from) return camera(f, [TRAVERSE_CAMS[TRAVERSE_CAMS.length - 1], { f: BACK_OUT.to, ...TWO_UP }, { f: TO_PHONE.from, x: TWO_UP.x + 20, y: TWO_UP.y, s: 0.9 }]);
  return camera(f, [{ f: TO_PHONE.from, x: TWO_UP.x + 20, y: TWO_UP.y, s: 0.9 }, { f: TO_PHONE.to, ...PHONE_CARD_CAM }, { f: VIDEO6_NETWORK_FRAMES, x: PHONE_CARD_CAM.x, y: PHONE_CARD_CAM.y + 14, s: 1.82 }]);
}

/* ─── World ───────────────────────────────────────────────────────────────── */

function NetworkWorld() {
  const frame = useCurrentFrame();
  const full = typed(ASK, frame, TYPE_AT, 40);
  const draft = frame < SEND_AT ? draftTail(full) : "";

  const agentPath = track(frame, [
    { f: AGENT_IN, x: PHONE.x + 120, y: 640 },
    ...PICKS.flatMap((at, i) => {
      const p = rowWorld(i, COLUMNS[i].pick ?? 0, at);
      return [{ f: at - 4, x: p.x, y: p.y + 4 }];
    }),
    ...CHECKS.map((at, i) => ({ f: at - 4, ...checkWorld(i, at) })),
    { f: STEPS_AT + 16, ...checkWorld(2, STEPS_AT + 16, 70, 120) },
  ]);
  const agentOpacity = ramp(frame, AGENT_IN, 10) * (1 - ramp(frame, BACK_OUT.from + 4, 12));
  const tap = track(frame, [
    { f: 800, x: BOOK_BTN.x + 110, y: BOOK_BTN.y + 120 },
    { f: BOOK_AT - 4, x: BOOK_BTN.x + 6, y: BOOK_BTN.y + 4 },
  ]);

  return (
    <AbsoluteFill>
      <div style={worldCamera(frame)}>
        <div style={{ position: "absolute", left: SHELL.x, top: SHELL.y, ...rise(frame, 0, { y: 30, dur: 26 }) }}>
          <AppShell active={2} railReveal={(i) => ramp(frame, 6 + i * 2, 12)}>
            <NetworkPage frame={frame} />
          </AppShell>
        </div>

        <div style={{ position: "absolute", left: PHONE.x, top: PHONE.y, ...rise(frame, PAN_TO_PHONE.from + 6, { x: 60, y: 0, dur: 28 }) }}>
          <IPhone frame={frame} width={PHONE.w} height={PHONE.h} contact="Agent" draft={draft} composing={frame >= TYPE_AT - 8 && frame < SEND_AT} sendPress={pulse(frame, SEND_AT - 4, 3, 6)}>
            <Slot frame={frame} at={STAMP_AT} side="center">
              <TimeStamp day="Today" time="7:52 PM" />
            </Slot>
            <Slot frame={frame} at={SEND_AT} side="out" dur={18}>
              <Bubble out>{ASK}</Bubble>
            </Slot>
            <Slot frame={frame} at={TYPING_AT} until={REPLY_AT} side="in" dur={12}>
              <TypingBubble frame={frame} />
            </Slot>
            <Slot frame={frame} at={REPLY_AT} side="in" dur={18}>
              <Bubble>I&rsquo;ll look inside Bayview Health for her.</Bubble>
            </Slot>
            <Slot frame={frame} at={REPLY2_TYPING} until={REPLY2_AT} side="in" dur={12}>
              <TypingBubble frame={frame} />
            </Slot>
            <Slot frame={frame} at={REPLY2_AT} side="in" dur={18}>
              <Bubble>Ava fits the epilepsy program at Bayview Children&rsquo;s.</Bubble>
            </Slot>
            <Slot frame={frame} at={CARD_SLOT} side="in" dur={14}>
              <PathwayCard frame={frame} />
            </Slot>
          </IPhone>
        </div>

        <FlyingCrumbs frame={frame} />

        <AgentPointer x={agentPath.x} y={agentPath.y} label={"Ava\u2019s Agent"} opacity={agentOpacity} pressed={press(frame, [...PICKS, ...CHECKS])} />
        {PICKS.map((at, i) => {
          const p = rowWorld(i, COLUMNS[i].pick ?? 0, at);
          return <ClickRing key={at} x={p.x} y={p.y} progress={ramp(frame, at - 1, 14)} />;
        })}
        <ClickRing x={BOOK_BTN.x} y={BOOK_BTN.y} progress={ramp(frame, BOOK_AT - 1, 14)} />
        <div style={{ opacity: ramp(frame, 800, 8) * (1 - ramp(frame, BOOK_AT + 26, 10)) }}>
          <Cursor x={tap.x} y={tap.y} size={24} pressed={press(frame, [BOOK_AT])} />
        </div>
      </div>
    </AbsoluteFill>
  );
}

/* ─── The network page ────────────────────────────────────────────────────── */

function NetworkPage({ frame }: { frame: number }) {
  const scroll = scrollX(frame);
  return (
    <>
      <div style={{ position: "absolute", left: 28, top: 28, ...rise(frame, 4) }}>
        <Display size={46}>Bayview Health</Display>
      </div>
      <SearchField frame={frame} />
      <div style={{ position: "absolute", right: 28, top: 34, display: "flex", gap: 8, ...rise(frame, 8) }}>
        <Segmented items={["Columns", "Map"]} value={0} width={190} />
        <Pill icon="plus" tone="ink">
          Add unit
        </Pill>
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, overflow: "hidden" }}>
        {COLUMNS.map((col, i) => (
          <ColumnCard key={col.title} frame={frame} col={col} index={i} x={COL.x + i * STEP - scroll} />
        ))}
        <ProgramDetail frame={frame} x={COL.x + 5 * STEP - scroll} />
      </div>
    </>
  );
}

function SearchField({ frame }: { frame: number }) {
  const anyCrumb = ramp(frame, PICKS[0] + 4, 8);
  return (
    <div style={{ position: "absolute", left: SEARCH.x, top: SEARCH.y, width: SEARCH.w, height: SEARCH.h, borderRadius: 999, background: C.beige, ...rise(frame, 6) }}>
      <div style={{ position: "absolute", left: 18, top: 14 }}>
        <Ico name="search" size={18} />
      </div>
      <span style={{ position: "absolute", left: SEARCH.pad, top: 0, lineHeight: `${SEARCH.h}px`, fontFamily: F.ui, fontWeight: 500, fontSize: 16, color: "rgba(40, 25, 16, 0.4)", opacity: 1 - anyCrumb }}>Search Bayview Health</span>
      {CRUMBS.map((label, i) => {
        const p = ramp(frame, PICKS[i] + 4, 14, EASE_OUT);
        return (
          <div key={label}>
            {i > 0 ? (
              <div style={{ position: "absolute", left: CRUMB_X[i] - SEARCH.sep + 3, top: 15, opacity: p }}>
                <Ico name="chevronRight" size={14} color="rgba(40, 25, 16, 0.4)" stroke={2.2} />
              </div>
            ) : null}
            <Crumb label={label} style={{ position: "absolute", left: CRUMB_X[i], top: 8, opacity: p, transform: `translateX(${(1 - p) * -10}px) scale(${lerp(0.9, 1, p)})` }} />
          </div>
        );
      })}
    </div>
  );
}

function Crumb({ label, style, dark = false }: { label: string; style?: CSSProperties; dark?: boolean }) {
  return (
    <div style={{ width: crumbW(label), height: 30, borderRadius: 999, boxSizing: "border-box", background: dark ? C.ink : C.paper, color: dark ? C.paper : C.walnut, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.ui, fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", ...style }}>
      {label}
    </div>
  );
}

function ColumnCard({ frame, col, index, x }: { frame: number; col: Column; index: number; x: number }) {
  const at = COLS_AT + index * 16;
  const enter = ramp(frame, at, 26, EASE_OUT);
  const scopeAt = index > 0 ? PICKS[index - 1] + 4 : Infinity;
  const scopeOut = col.scoped ? ramp(frame, scopeAt, 8, EASE_IN_OUT) : 0;
  const scope = col.scoped ? ramp(frame, scopeAt + 6, 14, EASE_OUT) : 0;
  const dim = index > 0 ? ramp(frame, AGENT_IN, 16) * (1 - ramp(frame, scopeAt, 12)) : 0;
  const pickAt = PICKS[index];
  const picked = pickAt !== undefined ? ramp(frame, pickAt, 8) : 0;
  const count = scope > 0.5 ? (col.scopedTotal ?? col.total) : col.total * ramp(frame, at + 6, 34, EASE_OUT);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: COL.y,
        width: COL.w,
        height: COL.h,
        boxSizing: "border-box",
        padding: 8,
        borderRadius: 24,
        background: PANEL,
        opacity: enter * (1 - 0.45 * dim),
        transform: `translateX(${(1 - enter) * -70}px)`,
        zIndex: 10 - index,
      }}
    >
      <PanelTitle title={col.title} count={fmt(count)} />
      <RowList frame={frame} items={col.all} show={1 - scopeOut} at={at} shift={-12 * scopeOut} picked={col.scoped ? -1 : (col.pick ?? -1)} pickedP={picked} />
      {col.scoped && scope > 0 ? <RowList frame={frame} items={col.scoped} show={1} at={scopeAt - 2} shift={0} picked={col.pick ?? -1} pickedP={picked} /> : null}
    </div>
  );
}

function PanelTitle({ title, count }: { title: string; count: string }) {
  return (
    <div style={{ height: 44, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 8px 0 10px" }}>
      <span style={{ fontFamily: F.display, fontWeight: 500, fontSize: 22, letterSpacing: "-0.015em", color: C.walnut }}>{title}</span>
      <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 13, color: SUB, fontVariantNumeric: "tabular-nums" }}>{count}</span>
    </div>
  );
}

function RowList({ frame, items, show, at, shift, picked, pickedP }: { frame: number; items: Item[]; show: number; at: number; shift: number; picked: number; pickedP: number }) {
  if (show <= 0.001 || items.length === 0) return null;
  return (
    <div style={{ position: "absolute", left: 8, right: 8, top: COL.rowsTop, display: "flex", flexDirection: "column", gap: COL.rowGap, opacity: show, transform: `translateY(${shift}px)` }}>
      {items.map((item, r) => (
        <div key={item.name} style={at > 0 ? rise(frame, at + 6 + r * 2, { y: 10, dur: 18 }) : undefined}>
          <Row item={item} active={r === picked ? pickedP : 0} />
        </div>
      ))}
    </div>
  );
}

function Row({ item, active }: { item: Item; active: number }) {
  if (item.more) {
    return (
      <div style={{ height: COL.rowH, display: "flex", alignItems: "center", gap: 12, padding: "0 10px", fontFamily: F.ui, fontWeight: 500, fontSize: 14, color: SUB }}>
        <div style={{ width: 36, height: 36, borderRadius: 12, border: "1.5px dashed rgba(40, 25, 16, 0.24)", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Ico name="more" size={16} color={SUB} stroke={2.6} />
        </div>
        {item.name}
      </div>
    );
  }
  return <ListRow tile={item.tile} icon={item.icon} lead={item.av ? <Av label={item.av[0]} size={36} tone={item.av[1]} /> : undefined} name={item.name} meta={item.meta} active={active} height={COL.rowH} style={{ background: active > 0 ? undefined : C.paper }} />;
}

/* ─── Program detail: the column after Programs once the browser scrolls ──── */

const ELIGIBILITY = ["Ages 0\u201318", "Recurrent seizures", "Blue Shield PPO"];
const BEFORE: { label: string; icon: IcoName; status: string; tone: "sage" | "salmon" | "soft" }[] = [
  { label: "Pediatrician referral", icon: "doc", status: "On file", tone: "sage" },
  { label: "EEG at Mission Bay", icon: "activity", status: "Book first", tone: "salmon" },
  { label: "Intake forms", icon: "list", status: "Agent can fill", tone: "soft" },
];
const D = { pad: 20, eligY: 120, rowH: 46, rowGap: 6, beforeY: 316 };
const checkWorld = (i: number, f: number, dx = 26, dy = 0) => onPage(COL.x + 5 * STEP - scrollX(f) + D.pad + 14 + dx, COL.y + D.pad + D.eligY + i * (D.rowH + D.rowGap) + D.rowH / 2 + dy);

function ProgramDetail({ frame, x }: { frame: number; x: number }) {
  const enter = ramp(frame, DETAIL_AT, 26, EASE_OUT);
  if (enter <= 0) return null;
  return (
    <div style={{ position: "absolute", left: x, top: COL.y, width: DETAIL.w, height: COL.h, boxSizing: "border-box", padding: D.pad, borderRadius: 24, background: C.beige, opacity: enter, transform: `translateX(${(1 - enter) * -70}px)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, ...rise(frame, DETAIL_AT + 6, { y: 10 }) }}>
        <Tile color={C.salmon} icon="brain" size={52} />
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <Display size={28}>Epilepsy program</Display>
          <div style={{ display: "flex", gap: 6 }}>
            <Chip tone="paper" icon={<Ico name="mapPin" size={13} />}>
              Mission Bay &middot; Floor 4
            </Chip>
            <Chip tone="paper">Level 4 center</Chip>
          </div>
        </div>
      </div>

      <SectionLabel y={D.eligY - 34} frame={frame} at={DETAIL_AT + 10}>
        Who it&rsquo;s for
      </SectionLabel>
      <div style={{ position: "absolute", left: D.pad, right: D.pad, top: D.pad + D.eligY, display: "flex", flexDirection: "column", gap: D.rowGap }}>
        {ELIGIBILITY.map((label, i) => (
          <div key={label} style={rise(frame, DETAIL_AT + 12 + i * 3, { y: 10, dur: 18 })}>
            <CheckRow label={label} done={ramp(frame, CHECKS[i] + 2, 10)} height={D.rowH} trailing={i === 0 ? <Chip tone="sand" style={{ opacity: ramp(frame, CHECKS[0] + 6, 10) }}>Ava, 9</Chip> : undefined} />
          </div>
        ))}
      </div>

      <SectionLabel y={D.beforeY - 34} frame={frame} at={STEPS_AT - 4}>
        Before the first visit
      </SectionLabel>
      <div style={{ position: "absolute", left: D.pad, right: D.pad, top: D.pad + D.beforeY, display: "flex", flexDirection: "column", gap: D.rowGap }}>
        {BEFORE.map((step, i) => (
          <div key={step.label} style={{ height: D.rowH, display: "flex", alignItems: "center", gap: 12, padding: "0 10px 0 12px", borderRadius: 14, background: C.paper, ...rise(frame, STEPS_AT + i * 5, { y: 12, dur: 18 }) }}>
            <Ico name={step.icon} size={18} />
            <span style={{ flex: 1, fontFamily: F.ui, fontWeight: 500, fontSize: 15, color: C.walnut }}>{step.label}</span>
            <Status tone={step.tone}>{step.status}</Status>
          </div>
        ))}
      </div>

      <div style={{ position: "absolute", left: D.pad, right: D.pad, bottom: D.pad, height: 150, borderRadius: 18, overflow: "hidden", background: "#ECE2CD", ...rise(frame, DETAIL_AT + 20, { y: 14 }) }}>
        <MiniStreets w={DETAIL.w - D.pad * 2} h={150} />
        <div style={{ position: "absolute", left: 300, top: 64, width: 22, height: 22, borderRadius: 999, background: C.ink, border: `4px solid ${C.paper}`, boxSizing: "border-box" }} />
        <div style={{ position: "absolute", left: 14, top: 14, display: "flex", gap: 6 }}>
          {(["AR", "SO", "LB", "MC"] as const).map((l, i) => (
            <div key={l} style={{ marginLeft: i ? -14 : 0, borderRadius: 999, border: `2px solid #ECE2CD` }}>
              <Av label={l} size={34} tone={(["salmon", "sage", "sand", "salmon"] as AvTone[])[i]} />
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", right: 14, bottom: 14 }}>
          <Chip tone="paper" size={1.15} icon={<Ico name="calendar" size={14} />}>
            Next opening Tue
          </Chip>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ y, frame, at, children }: { y: number; frame: number; at: number; children: ReactNode }) {
  return <div style={{ position: "absolute", left: D.pad + 4, top: D.pad + y, fontFamily: F.display, fontWeight: 500, fontSize: 20, letterSpacing: "-0.01em", color: C.walnut, ...rise(frame, at, { y: 8, dur: 16 }) }}>{children}</div>;
}

function MiniStreets({ w, h }: { w: number; h: number }) {
  const lines = Array.from({ length: 15 }, (_, i) => (i - 7) * 52);
  return (
    <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0 }}>
      <g transform={`translate(${w / 2} ${h / 2}) rotate(-12)`}>
        {lines.map((k, i) => (
          <line key={`v${k}`} x1={k} y1={-400} x2={k} y2={400} stroke={C.paper} strokeWidth={i === 9 ? 12 : 6} />
        ))}
        {lines.map((k, i) => (
          <line key={`h${k}`} x1={-500} y1={k} x2={500} y2={k} stroke={C.paper} strokeWidth={i === 7 ? 12 : 6} />
        ))}
      </g>
    </svg>
  );
}

/* ─── The breadcrumb lifts out of the search field into the agent's reply ── */

function FlyingCrumbs({ frame }: { frame: number }) {
  return (
    <>
      {CRUMBS.map((label, i) => {
        const at = FLY.at + i * FLY.stagger;
        const u = ramp(frame, at, FLY.dur, EASE_IN_OUT);
        if (u <= 0 || frame >= landAt(i)) return null;
        const from = onPage(SEARCH.x + CRUMB_X[i], SEARCH.y + 8);
        const to = stepWorld(i);
        const x = lerp(from.x, to.x, u);
        const y = lerp(from.y, to.y - 15, u) - 140 * Math.sin(Math.PI * u);
        return <Crumb key={label} label={label} dark style={{ position: "absolute", left: x, top: y, opacity: ramp(frame, at, 4), transform: `scale(${1 + 0.15 * Math.sin(Math.PI * u)})`, transformOrigin: "0 50%" }} />;
      })}
    </>
  );
}

function PathwayCard({ frame }: { frame: number }) {
  const rest = ramp(frame, CARD_REST, 14);
  const booked = ramp(frame, BOOK_AT + 2, 10);
  return (
    <div style={{ position: "relative", width: CARD.w, height: CARD.h, boxSizing: "border-box", padding: CARD.pad, borderRadius: 22, background: C.beige, fontFamily: F.ui }}>
      <div style={{ height: CARD.head, display: "flex", alignItems: "center", gap: 8 }}>
        <Tile color={C.paper} icon="building" size={24} radius={8} />
        <span style={{ fontWeight: 600, fontSize: 13, color: C.walnut }}>Bayview Health</span>
      </div>
      <div style={{ position: "absolute", left: CARD.pad + 8, top: CARD.pad + CARD.head + 10 + CARD.stepH / 2, width: 2, height: 3 * (CARD.stepH + CARD.stepGap), background: "rgba(40, 25, 16, 0.14)", transformOrigin: "50% 0", transform: `scaleY(${ramp(frame, landAt(0), landAt(3) - landAt(0), EASE_IN_OUT)})` }} />
      {CRUMBS.map((label, i) => {
        const landed = ramp(frame, landAt(i), 6);
        return (
          <div key={label} style={{ position: "absolute", left: CARD.pad, top: CARD.pad + CARD.head + 10 + i * (CARD.stepH + CARD.stepGap), height: CARD.stepH, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 18, display: "flex", justifyContent: "center" }}>
              <div style={{ width: 10, height: 10, borderRadius: 999, background: i === 3 ? C.salmon : C.walnut, border: i === 3 ? `2px solid ${C.walnut}` : undefined, boxSizing: "border-box", opacity: landed, transform: `scale(${lerp(0.4, 1, landed)})` }} />
            </div>
            <Crumb label={label} dark={i === 3} style={{ opacity: frame >= landAt(i) ? 1 : 0, transform: `scale(${1 + 0.06 * pulse(frame, landAt(i), 3, 8)})`, transformOrigin: "0 50%" }} />
          </div>
        );
      })}
      <div style={{ position: "absolute", left: CARD.pad, right: CARD.pad, bottom: CARD.pad, height: 40, opacity: rest, transform: `translateY(${(1 - rest) * 8}px) scale(${1 - 0.04 * pulse(frame, BOOK_AT - 2, 3, 8)})` }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 999, background: C.ink, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontWeight: 600, fontSize: 14, color: C.paper, opacity: 1 - booked }}>
          <Ico name="calendar" size={15} color={C.paper} />
          Book EEG &middot; Tue 9:00
        </div>
        <div style={{ position: "absolute", inset: 0, borderRadius: 999, background: C.live, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontWeight: 600, fontSize: 14, color: "#FFF", opacity: booked, transform: `scale(${lerp(0.94, 1, booked)})` }}>
          <Ico name="check" size={15} color="#FFF" stroke={2.8} />
          EEG booked &middot; Tue 9:00
        </div>
      </div>
    </div>
  );
}