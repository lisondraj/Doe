import { type CSSProperties, type ReactNode } from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";

import { DotTide, DotWave, Stage } from "../video1/backdrops";
import { CAMERA_EASE, EASE_IN, EASE_IN_OUT, EASE_OUT, camera, keys, lerp, pulse, ramp, type CameraKey } from "../video1/motion";
import { C, F } from "../video1/theme";
import { AppShell, Chip, CheckBox, ClickRing, Cursor, ShadowsContext, Toggle } from "../video1/ui";
import { Av, Display, Field, Ico, Menu, PAGE, Pill, SAGE, SHELL, SUB, Segmented, SelectBox, Status, Swap, clamp01, onPage, press, rise, track } from "./kit";

export const VIDEO4_DENTAL_FRAMES = 900;

const AGENT_END = 202;
const PRACTICE_AT = 186;
const PRACTICE_LEN = 404;
const MONTH_AT = PRACTICE_AT + 380;
const MONTH_LEN = 124;
const RECALL_AT = MONTH_AT + 96;

export function Video4Dental() {
  return (
    <ShadowsContext.Provider value={false}>
      <Audio src={staticFile("video1/BED.m4a")} startFrom={1230} volume={0.2} />
      <DentalStage />
    </ShadowsContext.Provider>
  );
}

function DentalStage() {
  const frame = useCurrentFrame();
  const tide = ramp(frame, MONTH_AT - 6, 30, EASE_IN_OUT);
  return (
    <Stage
      backdrop={
        <>
          {tide < 1 ? (
            <AbsoluteFill style={{ opacity: 1 - tide }}>
              <DotWave top={0.5} amp={60} />
            </AbsoluteFill>
          ) : null}
          {tide > 0 ? (
            <AbsoluteFill style={{ opacity: tide }}>
              <DotTide reach={460} />
            </AbsoluteFill>
          ) : null}
        </>
      }
    >
      <Sequence from={0} durationInFrames={AGENT_END} name="Agent request">
        <IndexScene />
      </Sequence>
      <Sequence from={PRACTICE_AT} durationInFrames={PRACTICE_LEN} name="Schedule + chart">
        <PracticeScene />
      </Sequence>
      <Sequence from={MONTH_AT} durationInFrames={MONTH_LEN} name="Months later">
        <MonthScene />
      </Sequence>
      <Sequence from={RECALL_AT} durationInFrames={VIDEO4_DENTAL_FRAMES - RECALL_AT} name="Recall">
        <RecallScene />
      </Sequence>
    </Stage>
  );
}

/* ─── Practice index: an agent asks, the front desk offers a slot ──────────── */

const ASK = "I chipped my tooth. Find me a dentist who can see me today.";
const ROW = { x: 28, w: 1308, h: 72, gap: 8, top: 104 };
const AGENTS_H = 420;
type IndexRowSpec = { title: string; tile: string; chips: string[] };
const INDEX_ROWS: IndexRowSpec[] = [
  { title: "Needs you", tile: C.salmon, chips: ["3 waiting"] },
  { title: "Schedule", tile: C.sand2, chips: ["31 booked", "Next 12:15"] },
  { title: "Agents", tile: SAGE, chips: [] },
  { title: "Messages", tile: C.salmon, chips: ["4 unread"] },
  { title: "Recall", tile: C.sand2, chips: ["18 due"] },
];
const indexRowTop = (i: number) => ROW.top + i * (ROW.h + ROW.gap) + (i > 2 ? AGENTS_H - ROW.h : 0);
const AG = { top: indexRowTop(2), body: indexRowTop(2) + ROW.h, bodyH: AGENTS_H - ROW.h - 10 };
const ASK_CARD = { x: ROW.x + 10, w: ROW.w - 20 - 400 - 10 };
const SLOTS_CARD = { x: ASK_CARD.x + ASK_CARD.w + 10, w: 400 };
const SLOTS = [
  { t: "12:40", open: false },
  { t: "1:40", open: true },
  { t: "2:15", open: true },
  { t: "3:30", open: false },
  { t: "4:30", open: true },
  { t: "5:10", open: true },
];
const SLOT = { w: 112, h: 56, gap: 10, top: 84 };
const slotCenter = (i: number) => onPage(SLOTS_CARD.x + 20 + (i % 3) * (SLOT.w + SLOT.gap) + SLOT.w / 2, AG.body + SLOT.top + Math.floor(i / 3) * (SLOT.h + SLOT.gap) + SLOT.h / 2);
const PICK_SLOT = slotCenter(2);
const OFFER_BTN = onPage(SLOTS_CARD.x + SLOTS_CARD.w / 2, AG.body + AG.bodyH - 20 - 28);
const BOOKING = { w: 540, h: 88, top: 148 };
const DATE_BLOCK = onPage(ASK_CARD.x + ASK_CARD.w - 20 - BOOKING.w + 12 + 32, AG.body + BOOKING.top + BOOKING.h / 2);
const BUBBLE = onPage(ASK_CARD.x + 20 + 330, AG.body + 96);

const ASK_AT = 8;
const SLOT_CLICK = 98;
const OFFER_CLICK = 124;
const BOOKED_AT = 138;
const ZOOM_AT = 176;

const INDEX_CAMS: CameraKey[] = [
  { f: 0, x: BUBBLE.x, y: BUBBLE.y + 10, s: 2.15 },
  { f: 38, x: BUBBLE.x + 10, y: BUBBLE.y + 6, s: 2.02 },
  { f: 76, x: 960, y: 540, s: 1.04 },
  { f: 94, x: 1300, y: 570, s: 1.5 },
  { f: OFFER_CLICK + 4, x: 1290, y: 590, s: 1.52 },
  { f: 158, x: 930, y: DATE_BLOCK.y - 10, s: 1.5 },
  { f: ZOOM_AT, x: 900, y: DATE_BLOCK.y - 4, s: 1.6 },
];

function indexCamera(frame: number) {
  if (frame < ZOOM_AT) return camera(frame, INDEX_CAMS);
  return camera(frame, [INDEX_CAMS[INDEX_CAMS.length - 1], { f: AGENT_END, x: DATE_BLOCK.x, y: DATE_BLOCK.y, s: 6 }], EASE_IN);
}

function IndexScene() {
  const frame = useCurrentFrame();
  const leave = ramp(frame, ZOOM_AT + 12, 12, EASE_IN);
  const cur = track(frame, [
    { f: 72, x: 1700, y: 1000 },
    { f: SLOT_CLICK - 4, x: PICK_SLOT.x + 4, y: PICK_SLOT.y + 4 },
    { f: OFFER_CLICK - 4, x: OFFER_BTN.x + 30, y: OFFER_BTN.y + 4 },
    { f: 160, x: OFFER_BTN.x + 120, y: OFFER_BTN.y + 140 },
  ]);
  return (
    <AbsoluteFill style={{ opacity: 1 - leave, filter: leave > 0 ? `blur(${leave * 12}px)` : undefined }}>
      <div style={indexCamera(frame)}>
        <div style={{ position: "absolute", left: SHELL.x, top: SHELL.y }}>
          <AppShell active={1} railReveal={(i) => ramp(frame, 30 + i * 2, 12)}>
            <IndexPage frame={frame} />
          </AppShell>
        </div>
        <ClickRing x={PICK_SLOT.x} y={PICK_SLOT.y} progress={ramp(frame, SLOT_CLICK - 1, 16)} />
        <ClickRing x={OFFER_BTN.x + 30} y={OFFER_BTN.y} progress={ramp(frame, OFFER_CLICK - 1, 16)} />
        <div style={{ opacity: ramp(frame, 74, 8) * (1 - ramp(frame, 150, 10)) }}>
          <Cursor x={cur.x} y={cur.y} pressed={press(frame, [SLOT_CLICK, OFFER_CLICK])} />
        </div>
      </div>
    </AbsoluteFill>
  );
}

function IndexPage({ frame }: { frame: number }) {
  const booked = ramp(frame, BOOKED_AT + 8, 10);
  return (
    <>
      <div style={{ position: "absolute", left: 28, top: 28, ...rise(frame, 30) }}>
        <Display size={46}>Lakeshore Dental</Display>
      </div>
      <div style={{ position: "absolute", right: 28, top: 34, display: "flex", gap: 8, ...rise(frame, 32) }}>
        <SearchField width={300} placeholder="Search patients" />
        <Pill icon="plus" tone="ink">
          New visit
        </Pill>
      </div>
      {INDEX_ROWS.map((row, i) => (
        <div key={row.title} style={{ position: "absolute", left: ROW.x, top: indexRowTop(i), width: ROW.w, height: i === 2 ? AGENTS_H : ROW.h, boxSizing: "border-box", borderRadius: 22, background: C.beige, ...(i === 2 ? {} : rise(frame, 26 + i * 3, { y: 14 })) }}>
          <div style={{ height: ROW.h, boxSizing: "border-box", padding: "0 14px 0 10px", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: row.tile }} />
            <Display size={34}>{row.title}</Display>
            <div style={{ flex: 1 }} />
            {i === 1 ? (
              <>
                <Swap t={booked} from={<RowChip>31 booked</RowChip>} to={<RowChip>32 booked</RowChip>} pop={pulse(frame, BOOKED_AT + 10, 4, 12)} />
                <RowChip>Next 12:15</RowChip>
              </>
            ) : i === 2 ? (
              <>
                <RowChip tone="salmon">1 asking</RowChip>
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 4px 0 12px", fontFamily: F.ui, fontWeight: 500, fontSize: 15, color: C.walnut }}>
                  Accepting agents
                  <Toggle progress={1} />
                </div>
              </>
            ) : (
              row.chips.map((c) => <RowChip key={c}>{c}</RowChip>)
            )}
          </div>
        </div>
      ))}
      <AskCard frame={frame} />
      <SlotsCard frame={frame} />
    </>
  );
}

function RowChip({ children, tone = "paper" }: { children: ReactNode; tone?: "paper" | "salmon" }) {
  return (
    <span style={{ height: 30, padding: "0 12px", borderRadius: 999, background: tone === "salmon" ? C.salmon : C.paper, display: "inline-flex", alignItems: "center", fontFamily: F.body, fontWeight: 500, fontSize: 13, color: C.walnut, whiteSpace: "nowrap" }}>{children}</span>
  );
}

function SearchField({ width, placeholder }: { width: number; placeholder: string }) {
  return (
    <div style={{ width, height: 38, boxSizing: "border-box", padding: "0 6px 0 14px", borderRadius: 999, background: C.beige, display: "flex", alignItems: "center", gap: 9 }}>
      <Ico name="search" size={15} color={SUB} stroke={2} />
      <span style={{ flex: 1, fontFamily: F.body, fontWeight: 500, fontSize: 13, color: SUB }}>{placeholder}</span>
      <span style={{ height: 26, padding: "0 9px", borderRadius: 999, background: C.paper, display: "flex", alignItems: "center", fontFamily: F.body, fontWeight: 500, fontSize: 12, color: SUB }}>&#8984;K</span>
    </div>
  );
}

function AskCard({ frame }: { frame: number }) {
  const booked = ramp(frame, BOOKED_AT, 18, EASE_OUT);
  const status = ramp(frame, BOOKED_AT + 8, 10);
  return (
    <div style={{ position: "absolute", left: ASK_CARD.x, top: AG.body, width: ASK_CARD.w, height: AG.bodyH, boxSizing: "border-box", padding: 20, borderRadius: 18, background: C.paper }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, ...rise(frame, ASK_AT - 4, { y: 8, dur: 16 }) }}>
        <div style={{ height: 32, padding: "0 14px", borderRadius: 999, background: C.ink, display: "flex", alignItems: "center", fontFamily: F.ui, fontWeight: 500, fontSize: 14, color: C.paper }}>Ana&rsquo;s Agent</div>
        <span style={{ fontFamily: F.body, fontWeight: 500, fontSize: 14, color: SUB }}>11:52 AM</span>
      </div>
      <div style={{ position: "absolute", left: 20, top: 66, padding: "14px 20px", borderRadius: 20, background: C.beige, fontFamily: F.ui, fontWeight: 500, fontSize: 24, lineHeight: "30px", letterSpacing: "-0.01em", color: C.walnut, whiteSpace: "nowrap", ...rise(frame, ASK_AT, { y: 18, scale: 0.96, dur: 22 }), transformOrigin: "0 100%" }}>
        {ASK}
      </div>
      <div
        style={{
          position: "absolute",
          right: 20,
          top: BOOKING.top,
          width: BOOKING.w,
          height: BOOKING.h,
          boxSizing: "border-box",
          padding: "0 18px 0 12px",
          borderRadius: 20,
          border: `1px solid ${C.line2}`,
          display: "flex",
          alignItems: "center",
          gap: 16,
          opacity: booked,
          transform: `translateY(${(1 - booked) * 24}px) scale(${lerp(0.96, 1, booked)})`,
          transformOrigin: "100% 0",
        }}
      >
        <div style={{ width: 64, height: 64, borderRadius: 14, background: C.ink, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1 }}>
          <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 11, letterSpacing: "0.06em", color: "rgba(255, 252, 241, 0.6)" }}>TUE</span>
          <span style={{ fontFamily: F.display, fontWeight: 500, fontSize: 28, lineHeight: "30px", color: C.paper }}>20</span>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
          <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 19, color: C.walnut }}>2:15 PM &middot; Dr. Mei Kim</span>
          <span style={{ fontFamily: F.body, fontSize: 14, color: SUB }}>Emergency exam</span>
        </div>
        <div style={{ opacity: status, transform: `scale(${lerp(0.85, 1, status) + 0.06 * pulse(frame, BOOKED_AT + 10, 4, 12)})` }}>
          <Status tone="sage" icon="check" size={1.15}>
            Booked
          </Status>
        </div>
      </div>
      <div style={{ position: "absolute", left: 20, right: 20, bottom: 20, display: "flex", gap: 8, ...rise(frame, 34, { y: 8 }) }}>
        <Chip tone="sand" size={1.2} icon={<Ico name="shield" size={14} />}>
          Delta Dental PPO
        </Chip>
        <Chip tone="sand" size={1.2} icon={<Ico name="mapPin" size={14} />}>
          1.2 mi
        </Chip>
      </div>
    </div>
  );
}

function SlotsCard({ frame }: { frame: number }) {
  const picked = ramp(frame, SLOT_CLICK, 8);
  const offered = ramp(frame, OFFER_CLICK + 2, 10);
  return (
    <div style={{ position: "absolute", left: SLOTS_CARD.x, top: AG.body, width: SLOTS_CARD.w, height: AG.bodyH, boxSizing: "border-box", padding: 20, borderRadius: 18, background: C.paper }}>
      <div style={{ height: 44, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Display size={28}>Today</Display>
        <SelectBox value={<span style={{ display: "flex", alignItems: "center", gap: 8 }}><Av label="MK" size={22} tone="salmon" />Dr. Kim</span>} height={38} style={{ width: 150 }} />
      </div>
      {SLOTS.map((s, i) => {
        const on = i === 2 ? picked : 0;
        return (
          <div
            key={s.t}
            style={{
              position: "absolute",
              left: 20 + (i % 3) * (SLOT.w + SLOT.gap),
              top: SLOT.top + Math.floor(i / 3) * (SLOT.h + SLOT.gap),
              width: SLOT.w,
              height: SLOT.h,
              boxSizing: "border-box",
              borderRadius: 14,
              border: s.open ? `1.5px solid ${on > 0.5 ? C.ink : C.line2}` : "1.5px dashed rgba(40, 25, 16, 0.18)",
              background: on > 0 ? `rgba(20, 12, 4, ${on})` : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: F.ui,
              fontWeight: 500,
              fontSize: 19,
              color: on > 0.5 ? C.paper : s.open ? C.walnut : "rgba(40, 25, 16, 0.3)",
              textDecoration: s.open ? undefined : "line-through",
              transform: i === 2 ? `scale(${1 - 0.06 * pulse(frame, SLOT_CLICK - 2, 3, 8)})` : undefined,
            }}
          >
            {s.t}
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 20, right: 20, bottom: 20, height: 56, transform: `scale(${1 - 0.04 * pulse(frame, OFFER_CLICK - 2, 3, 8)})` }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 999, background: picked > 0.5 ? C.ink : "rgba(40, 25, 16, 0.14)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: F.ui, fontWeight: 600, fontSize: 18, color: C.paper, opacity: 1 - offered }}>
          {picked > 0.5 ? "Offer 2:15 PM" : "Offer a time"}
          <Ico name="arrowRight" size={18} color={C.paper} stroke={2.2} />
        </div>
        <div style={{ position: "absolute", inset: 0, borderRadius: 999, background: C.beige, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: F.ui, fontWeight: 600, fontSize: 18, color: C.walnut, opacity: offered }}>
          <Ico name="check" size={18} stroke={2.6} />
          Sent to Agent
        </div>
      </div>
    </div>
  );
}

/* ─── Practice: today's schedule → Ana's drawer → chart & treatment plan ───── */

const GRID = { x: 28, y: 104, w: 1308, h: 744, head: 56, gutter: 72, hourH: 76, start: 8 };
const COL_W = (GRID.w - GRID.gutter) / 4;
const hourY = (h: number) => GRID.head + (h - GRID.start) * GRID.hourH;
type Block = { col: number; from: number; to: number; name: string; kind: string; tone: string };

const BLOCKS: Block[] = [
  { col: 0, from: 8, to: 9, name: "Marcus Lee", kind: "Crown seat", tone: C.sand2 },
  { col: 0, from: 9.25, to: 10.5, name: "Grace Wu", kind: "Root canal", tone: C.salmon },
  { col: 0, from: 11, to: 11.75, name: "Tom Becker", kind: "Filling", tone: SAGE },
  { col: 0, from: 13, to: 14, name: "Hana Sato", kind: "Implant consult", tone: C.sand2 },
  { col: 0, from: 15.5, to: 16.5, name: "Leo Park", kind: "Crown prep", tone: C.salmon },
  { col: 1, from: 8.5, to: 9.5, name: "Ruth Cole", kind: "Extraction", tone: C.salmon },
  { col: 1, from: 10, to: 11.5, name: "Daniel Ortiz", kind: "Bridge prep", tone: C.sand2 },
  { col: 1, from: 12.5, to: 13.25, name: "Ivy Chen", kind: "Filling", tone: SAGE },
  { col: 1, from: 14, to: 15.5, name: "Omar Haddad", kind: "Root canal", tone: C.salmon },
  { col: 1, from: 16, to: 16.75, name: "Nina Brooks", kind: "Exam", tone: SAGE },
  { col: 2, from: 8, to: 9, name: "Priya Nair", kind: "Cleaning", tone: SAGE },
  { col: 2, from: 9, to: 10, name: "Sam Ortiz", kind: "Cleaning", tone: SAGE },
  { col: 2, from: 10.5, to: 11.5, name: "June Park", kind: "Perio maintenance", tone: C.sand2 },
  { col: 2, from: 13, to: 14, name: "Eli Ross", kind: "Cleaning", tone: SAGE },
  { col: 2, from: 14, to: 15, name: "Mae Lin", kind: "Cleaning", tone: SAGE },
  { col: 2, from: 15.5, to: 16.5, name: "Kai Moore", kind: "X-rays", tone: C.sand2 },
  { col: 3, from: 8.5, to: 9.5, name: "Ben Ali", kind: "Cleaning", tone: SAGE },
  { col: 3, from: 10, to: 11, name: "Zoe Hart", kind: "Cleaning", tone: SAGE },
  { col: 3, from: 11, to: 12, name: "Ava Diaz", kind: "Whitening", tone: C.sand2 },
  { col: 3, from: 13.5, to: 14.5, name: "Max Feld", kind: "Cleaning", tone: SAGE },
  { col: 3, from: 15, to: 16, name: "Lia Gray", kind: "Cleaning", tone: SAGE },
];
const ANA_BLOCK: Block = { col: 0, from: 14.25, to: 15, name: "Ana Ruiz", kind: "Emergency · Chipped tooth", tone: C.ink };
const blockRect = (b: Block) => ({ x: GRID.x + GRID.gutter + b.col * COL_W + 6, y: GRID.y + hourY(b.from) + 3, w: COL_W - 12, h: (b.to - b.from) * GRID.hourH - 6 });
const ANA_RECT = blockRect(ANA_BLOCK);
const ANA_WORLD = onPage(ANA_RECT.x + ANA_RECT.w / 2, ANA_RECT.y + ANA_RECT.h / 2);
const COLUMNS = [
  { name: "Dr. Mei Kim", tone: "salmon" as const, label: "MK" },
  { name: "Dr. Raj Patel", tone: "sage" as const, label: "RP" },
  { name: "Hygiene · Op 3", tone: "sand" as const, label: "H3" },
  { name: "Hygiene · Op 4", tone: "sand" as const, label: "H4" },
];

/** A popover anchored beside Ana's block; it later grows into the full chart page. */
const DRAWER = { x: ANA_RECT.x + ANA_RECT.w + 16, y: 330, w: 420, h: 470 };
const OPEN_CHART = onPage(DRAWER.x + 24 + (DRAWER.w - 48 - 150 - 10) / 2, DRAWER.y + DRAWER.h - 24 - 28);
const POPOVER_WORLD = onPage(DRAWER.x + DRAWER.w / 2, DRAWER.y + DRAWER.h / 2);
const BLOCK_CLICK = 74;
const DRAWER_AT = 78;
const CHART_CLICK = 140;
const MORPH_AT = 144;
const MORPH_DUR = 28;
/** Chart clock starts here (scene-local), while the drawer is still growing. */
const CH = MORPH_AT + 2;
const EXIT_AT = 380;

/* Odontogram geometry (page coordinates). */
const ODO = { x: 28, y: 104, w: 836, h: 744 };
const ARCH = { cx: 418, upper: 368, lower: 400, rx: 318, ry: 250 };
type ToothKind = "M" | "P" | "C" | "L" | "I";
const KINDS: ToothKind[] = ["M", "M", "M", "P", "P", "C", "L", "I", "I", "L", "C", "P", "P", "M", "M", "M"];
const SIZE: Record<ToothKind, [number, number]> = { M: [60, 52], P: [48, 48], C: [40, 56], L: [36, 48], I: [44, 56] };
type Tooth = { n: number; x: number; y: number; rot: number; w: number; h: number; lx: number; ly: number; i: number };
const TEETH: Tooth[] = Array.from({ length: 32 }, (_, i) => {
  const upper = i < 16;
  const k = upper ? i : i - 16;
  const deg = upper ? 180 + ((k + 0.5) * 180) / 16 : 180 - ((k + 0.5) * 180) / 16;
  const a = (deg * Math.PI) / 180;
  const cy = upper ? ARCH.upper : ARCH.lower;
  const [w, h] = SIZE[KINDS[k]];
  return {
    n: upper ? k + 1 : 32 - k,
    x: ARCH.cx + ARCH.rx * Math.cos(a),
    y: cy + ARCH.ry * Math.sin(a),
    rot: deg + 90,
    w,
    h,
    lx: ARCH.cx + (ARCH.rx + 50) * Math.cos(a),
    ly: cy + (ARCH.ry + 46) * Math.sin(a),
    i,
  };
});
const MISSING = [1, 16, 17, 32];
const FILLED = [3, 14, 30];
const CROWNED = [19];
const T9 = TEETH.find((t) => t.n === 9)!;
const T9_WORLD = onPage(ODO.x + T9.x, ODO.y + T9.y);
const MENU_POS = { x: ODO.x + T9.x - 30, y: ODO.y + T9.y + 50 };
const MENU_ROW = 42;
const CROWN_ROW = onPage(MENU_POS.x + 130, MENU_POS.y + 6 + MENU_ROW * 1.5);
const PROCEDURES = [
  { label: "Composite filling", meta: "D2391" },
  { label: "Crown · porcelain", meta: "D2740" },
  { label: "Root canal", meta: "D3310" },
  { label: "Veneer", meta: "D2962" },
  { label: "Extraction", meta: "D7140" },
];
const TOOTH_CLICK = CH + 50;
const MENU_AT = CH + 54;
const HOVER_AT = CH + 68;
const CROWN_CLICK = CH + 86;
const PLAN_AT = CH + 94;
const SEND_PLAN = CH + 142;
const AGENT_SENT = CH + 152;
const BOOK_PREP = CH + 182;
const BOOK_SEAT = CH + 194;

const PLAN = { x: 884, y: 104, w: 452, h: 744 };
const PLAN_BTN = onPage(PLAN.x + PLAN.w / 2, PLAN.y + PLAN.h - 16 - 30);

const PRACTICE_CAMS: CameraKey[] = [
  { f: 0, x: ANA_WORLD.x, y: ANA_WORLD.y, s: 3.2 },
  { f: 40, x: 960, y: 540, s: 1.04 },
  { f: 70, x: 960, y: 560, s: 1.06 },
  { f: 104, x: (ANA_WORLD.x + POPOVER_WORLD.x) / 2 + 40, y: POPOVER_WORLD.y - 20, s: 1.5 },
  { f: MORPH_AT, x: (ANA_WORLD.x + POPOVER_WORLD.x) / 2 + 50, y: POPOVER_WORLD.y - 10, s: 1.54 },
  { f: MORPH_AT + MORPH_DUR, x: 960, y: 540, s: 1.0 },
  { f: CH + 40, x: 830, y: 450, s: 1.55 },
  { f: CH + 90, x: 850, y: 460, s: 1.6 },
  { f: CH + 128, x: 1250, y: 560, s: 1.4 },
  { f: EXIT_AT, x: 1240, y: 600, s: 1.48 },
];

function PracticeScene() {
  const frame = useCurrentFrame();
  const arrive = ramp(frame, 0, 18, EASE_OUT);
  const exit = ramp(frame, EXIT_AT, 22, EASE_IN_OUT);
  const morph = ramp(frame, MORPH_AT, MORPH_DUR, EASE_IN_OUT);
  const cur1 = track(frame, [
    { f: 44, x: 1500, y: 1000 },
    { f: 70, x: ANA_WORLD.x + 30, y: ANA_WORLD.y + 6 },
    { f: 104, x: ANA_WORLD.x + 160, y: ANA_WORLD.y + 120 },
    { f: 134, x: OPEN_CHART.x + 4, y: OPEN_CHART.y + 4 },
  ]);
  const cur2 = track(frame, [
    { f: CH + 16, x: 1080, y: 760 },
    { f: CH + 46, x: T9_WORLD.x + 2, y: T9_WORLD.y + 4 },
    { f: HOVER_AT, x: T9_WORLD.x + 20, y: T9_WORLD.y + 60 },
    { f: CH + 80, x: CROWN_ROW.x, y: CROWN_ROW.y },
    { f: CH + 104, x: CROWN_ROW.x + 60, y: CROWN_ROW.y + 40 },
    { f: CH + 136, x: PLAN_BTN.x + 40, y: PLAN_BTN.y + 4 },
  ]);
  const hover = frame < HOVER_AT ? 0 : keys(frame, [HOVER_AT, CH + 80], [0, 1]);

  return (
    <AbsoluteFill style={{ opacity: arrive * (1 - exit), filter: arrive < 1 || exit > 0 ? `blur(${Math.max((1 - arrive) * 12, exit * 16)}px)` : undefined, transform: `scale(${lerp(1, 0.94, exit)})` }}>
      <div style={camera(frame, PRACTICE_CAMS)}>
        <div style={{ position: "absolute", left: SHELL.x, top: SHELL.y }}>
          <AppShell active={2} railReveal={(i) => ramp(frame, 8 + i * 2, 12)}>
            {morph < 1 ? (
              <div style={{ position: "absolute", inset: 0, opacity: 1 - morph }}>
                <SchedulePage frame={frame} />
              </div>
            ) : null}
            {frame >= DRAWER_AT ? <Drawer frame={frame} morph={morph} /> : null}
          </AppShell>
        </div>
        {frame < MORPH_AT ? (
          <>
            <ClickRing x={ANA_WORLD.x + 30} y={ANA_WORLD.y + 6} progress={ramp(frame, BLOCK_CLICK - 1, 16)} />
            <ClickRing x={OPEN_CHART.x} y={OPEN_CHART.y} progress={ramp(frame, CHART_CLICK - 1, 16)} />
            <div style={{ opacity: ramp(frame, 44, 8) * (1 - ramp(frame, CHART_CLICK + 6, 8)) }}>
              <Cursor x={cur1.x} y={cur1.y} pressed={press(frame, [BLOCK_CLICK, CHART_CLICK])} />
            </div>
          </>
        ) : null}
        {frame >= CH ? (
          <>
            <ClickRing x={T9_WORLD.x} y={T9_WORLD.y} progress={ramp(frame, TOOTH_CLICK - 1, 16)} />
            <ClickRing x={CROWN_ROW.x} y={CROWN_ROW.y} progress={ramp(frame, CROWN_CLICK - 1, 16)} />
            <ClickRing x={PLAN_BTN.x + 40} y={PLAN_BTN.y} progress={ramp(frame, SEND_PLAN - 1, 16)} />
            <div style={{ opacity: ramp(frame, CH + 16, 8) * (1 - ramp(frame, SEND_PLAN + 14, 10)) }}>
              <Cursor x={cur2.x} y={cur2.y} pressed={press(frame, [TOOTH_CLICK, CROWN_CLICK, SEND_PLAN])} />
            </div>
          </>
        ) : null}
        {frame >= MENU_AT - 1 ? (
          <div style={{ position: "absolute", left: onPage(0, 0).x, top: onPage(0, 0).y }}>
            <Menu items={PROCEDURES} open={ramp(frame, MENU_AT, 10) * (1 - ramp(frame, CROWN_CLICK + 2, 8))} hover={hover} selected={frame >= CROWN_CLICK ? 1 : undefined} width={300} rowH={MENU_ROW} style={{ left: MENU_POS.x, top: MENU_POS.y }} />
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
}

function SchedulePage({ frame }: { frame: number }) {
  const nowY = GRID.y + hourY(11 + 52 / 60);
  return (
    <>
      <div style={{ position: "absolute", left: 28, top: 28, display: "flex", alignItems: "center", gap: 16, ...rise(frame, 4) }}>
        <Display size={46}>Schedule</Display>
        <Pill tone="beige" trailing="chevronDown" height={38}>
          Tue, Oct 20
        </Pill>
      </div>
      <div style={{ position: "absolute", right: 28, top: 34, display: "flex", gap: 8, ...rise(frame, 6) }}>
        <Segmented items={["Day", "Week"]} value={0} width={170} />
        <Pill icon="search" tone="beige" />
        <Pill icon="plus" tone="ink">
          New visit
        </Pill>
      </div>
      <div style={{ position: "absolute", left: GRID.x, top: GRID.y, width: GRID.w, height: GRID.h, borderRadius: 22, background: C.paper, border: `1px solid ${C.line}`, boxSizing: "border-box", overflow: "hidden", ...rise(frame, 4, { y: 20, dur: 26 }) }}>
        {COLUMNS.map((col, i) => (
          <div key={col.name} style={{ position: "absolute", left: GRID.gutter + i * COL_W, top: 0, width: COL_W, height: GRID.head, display: "flex", alignItems: "center", gap: 10, padding: "0 14px", boxSizing: "border-box", borderLeft: `1px solid ${C.line}`, fontFamily: F.ui, fontWeight: 600, fontSize: 15, color: C.walnut }}>
            <Av label={col.label} size={28} tone={col.tone} />
            {col.name}
          </div>
        ))}
        {Array.from({ length: 10 }, (_, h) => (
          <div key={h} style={{ position: "absolute", left: 0, right: 0, top: hourY(GRID.start + h), height: 1, background: C.line }}>
            {h < 9 ? <div style={{ position: "absolute", left: 14, top: 8, fontFamily: F.body, fontSize: 12, color: C.faint }}>{`${((GRID.start + h - 1) % 12) + 1} ${GRID.start + h < 12 ? "AM" : "PM"}`}</div> : null}
          </div>
        ))}
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ position: "absolute", left: GRID.gutter + i * COL_W, top: 0, bottom: 0, width: 1, background: C.line }} />
        ))}
      </div>
      {BLOCKS.map((b, i) => (
        <ScheduleBlock key={b.name + b.from} block={b} style={rise(frame, 6 + ((i * 7) % 13), { y: 10, dur: 18 })} />
      ))}
      <div style={{ position: "absolute", left: GRID.x + GRID.gutter - 6, top: nowY - 5, width: GRID.w - GRID.gutter + 6, height: 10, opacity: ramp(frame, 20, 12) }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 10, height: 10, borderRadius: 99, background: C.alert }} />
        <div style={{ position: "absolute", left: 6, right: 0, top: 4, height: 2, background: C.alert }} />
      </div>
      <ScheduleBlock block={ANA_BLOCK} ana pressed={pulse(frame, BLOCK_CLICK - 2, 3, 8)} selected={frame >= BLOCK_CLICK} />
    </>
  );
}

function ScheduleBlock({ block, style, ana, pressed = 0, selected }: { block: Block; style?: CSSProperties; ana?: boolean; pressed?: number; selected?: boolean }) {
  const r = blockRect(block);
  return (
    <div
      style={{
        position: "absolute",
        left: r.x,
        top: r.y,
        width: r.w,
        height: r.h,
        boxSizing: "border-box",
        padding: "8px 12px",
        borderRadius: 12,
        background: block.tone,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        overflow: "hidden",
        outline: selected ? `2px solid ${C.salmon}` : undefined,
        outlineOffset: 2,
        transform: pressed ? `scale(${1 - 0.04 * pressed})` : undefined,
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ flex: 1, fontFamily: F.ui, fontWeight: 600, fontSize: 15, lineHeight: "20px", color: ana ? C.paper : C.walnut, whiteSpace: "nowrap" }}>{block.name}</span>
        {ana ? <span style={{ height: 20, padding: "0 8px", borderRadius: 999, background: C.salmon, color: C.walnut, fontFamily: F.body, fontWeight: 500, fontSize: 11, display: "flex", alignItems: "center" }}>New patient</span> : null}
      </div>
      <span style={{ fontFamily: F.body, fontSize: 13, lineHeight: "17px", color: ana ? "rgba(255, 252, 241, 0.66)" : SUB, whiteSpace: "nowrap" }}>{block.kind}</span>
    </div>
  );
}

const DRAWER_FACTS: [string, string][] = [
  ["Visit", "Emergency exam"],
  ["Time", "2:15 PM · Dr. Kim"],
  ["Insurance", "Delta Dental PPO"],
  ["Booked by", "Ana\u2019s Agent"],
];
const DRAWER_CHECKS = ["Insurance verified", "History received"];

function Drawer({ frame, morph }: { frame: number; morph: number }) {
  const open = ramp(frame, DRAWER_AT, 22, EASE_OUT);
  const x = lerp(DRAWER.x, 0, morph);
  const y = lerp(DRAWER.y, 0, morph);
  const w = lerp(DRAWER.w, PAGE.w, morph);
  const h = lerp(DRAWER.h, PAGE.h, morph);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: open < 1 ? `translateX(${(1 - open) * -24}px) scale(${lerp(0.94, 1, open)})` : undefined,
        transformOrigin: "0 60%",
        width: w,
        height: h,
        boxSizing: "border-box",
        borderRadius: lerp(22, 0, morph),
        background: C.paper,
        border: `1px solid rgba(40, 25, 16, ${0.16 * (1 - morph)})`,
        overflow: "hidden",
        opacity: open,
      }}
    >
      <div style={{ position: "absolute", left: 0, top: 0, width: DRAWER.w, height: DRAWER.h, opacity: 1 - ramp(frame, MORPH_AT, 10) }}>
        <DrawerContent frame={frame} />
      </div>
      {frame >= MORPH_AT + 4 ? (
        <div style={{ position: "absolute", left: -x, top: -y, width: PAGE.w, height: PAGE.h, backgroundImage: "radial-gradient(rgba(40, 25, 16, 0.09) 1px, transparent 1.3px)", backgroundSize: "18px 18px", backgroundPosition: `${x}px ${y}px` }}>
          <ChartPage frame={frame} />
        </div>
      ) : null}
    </div>
  );
}

function DrawerContent({ frame }: { frame: number }) {
  const at = (o: number) => DRAWER_AT + 6 + o;
  return (
    <div style={{ position: "absolute", inset: 0, padding: 24, boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", ...rise(frame, at(0)) }}>
        <Status tone="salmon">New patient</Status>
        <Pill icon="x" tone="beige" height={34} />
      </div>
      <Display size={44} style={rise(frame, at(2))}>
        Ana Ruiz
      </Display>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", rowGap: 16, columnGap: 12, padding: 18, borderRadius: 18, background: C.beige, ...rise(frame, at(5), { y: 16 }) }}>
        {DRAWER_FACTS.map(([label, value]) => (
          <Field key={label} label={label}>
            <div style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 15, color: C.walnut, whiteSpace: "nowrap" }}>{value}</div>
          </Field>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "4px 4px" }}>
        {DRAWER_CHECKS.map((label, i) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: F.ui, fontWeight: 500, fontSize: 15, color: C.liveText, ...rise(frame, at(10 + i * 4), { x: 10, y: 0, dur: 16 }) }}>
            <Ico name="check" size={16} color={C.liveText} stroke={2.6} />
            {label}
          </div>
        ))}
      </div>
      <div style={{ marginTop: "auto", display: "flex", gap: 10, ...rise(frame, at(14)) }}>
        <Pill tone="ink" height={56} pressed={pulse(frame, CHART_CLICK - 2, 3, 8)} style={{ flex: 1, fontSize: 18 }}>
          Open chart
        </Pill>
        <Pill tone="beige" height={56} style={{ width: 150, fontSize: 18 }}>
          Message
        </Pill>
      </div>
    </div>
  );
}

function ChartPage({ frame }: { frame: number }) {
  const at = (o: number) => CH + o;
  return (
    <>
      <div style={{ position: "absolute", left: 28, top: 28, display: "flex", alignItems: "center", gap: 14, ...rise(frame, at(0), { y: 16 }) }}>
        <Display size={46}>Ana Ruiz</Display>
        <Status tone="salmon">New patient</Status>
      </div>
      <div style={{ position: "absolute", right: 28, top: 34, display: "flex", gap: 8, ...rise(frame, at(3)) }}>
        <Segmented items={["Chart", "Perio", "Imaging", "Notes"]} value={0} width={400} />
        <Pill icon="more" tone="beige" />
      </div>
      <div style={{ position: "absolute", left: ODO.x, top: ODO.y, width: ODO.w, height: ODO.h, borderRadius: 26, background: C.beige, ...rise(frame, at(2), { y: 20, dur: 26 }) }}>
        <Odontogram frame={frame} />
      </div>
      <div style={{ position: "absolute", left: PLAN.x, top: PLAN.y, width: PLAN.w, height: PLAN.h, borderRadius: 26, background: C.beige, ...rise(frame, at(6), { x: 30, y: 0, dur: 26 }) }}>
        <PlanPanel frame={frame} />
      </div>
    </>
  );
}

function Odontogram({ frame }: { frame: number }) {
  const picked = ramp(frame, TOOTH_CLICK, 8);
  const planned = ramp(frame, CROWN_CLICK + 2, 12);
  return (
    <>
      <div style={{ position: "absolute", left: 20, top: 20, display: "flex", gap: 8 }}>
        <Chip tone="paper" size={1.15}>
          Existing
        </Chip>
        <Chip tone="salmon" size={1.15}>
          Planned
        </Chip>
        <Chip tone="dashed" size={1.15}>
          Missing
        </Chip>
      </div>
      <div style={{ position: "absolute", right: 20, top: 20 }}>
        <Pill tone="paper" trailing="chevronDown" height={34}>
          Universal
        </Pill>
      </div>
      {TEETH.map((t) => {
        const missing = MISSING.includes(t.n);
        const isNine = t.n === 9;
        const enter = ramp(frame, CH + 6 + (t.i % 16) * 1.2 + (t.i >= 16 ? 4 : 0), 16, EASE_OUT);
        let bg: string = C.paper;
        if (FILLED.includes(t.n)) bg = C.sand3;
        if (CROWNED.includes(t.n)) bg = C.sand2;
        const border = missing ? "1.5px dashed rgba(40, 25, 16, 0.28)" : `1.5px solid ${isNine && picked > 0 ? C.ink : C.line2}`;
        return (
          <div key={t.n}>
            <div
              style={{
                position: "absolute",
                left: t.x - t.w / 2,
                top: t.y - t.h / 2,
                width: t.w,
                height: t.h,
                boxSizing: "border-box",
                borderRadius: Math.min(t.w, t.h) * 0.42,
                background: missing ? "transparent" : isNine ? `rgba(252, 207, 184, ${Math.max(planned, picked * 0.45)})` : bg,
                border,
                transform: `rotate(${t.rot}deg) scale(${lerp(0.6, 1, enter) * (isNine ? 1 + 0.12 * pulse(frame, TOOTH_CLICK, 4, 12) + 0.08 * picked : 1)})`,
                opacity: enter,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isNine && planned > 0 ? <div style={{ width: t.w * 0.5, height: t.h * 0.42, borderRadius: 6, background: C.walnut, opacity: planned * 0.85 }} /> : null}
            </div>
            <div style={{ position: "absolute", left: t.lx - 14, top: t.ly - 9, width: 28, height: 18, textAlign: "center", fontFamily: F.body, fontWeight: 500, fontSize: 12, lineHeight: "18px", color: isNine && picked > 0 ? C.walnut : C.faint, opacity: enter }}>
              {t.n}
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: ARCH.cx - 160, top: (ARCH.upper + ARCH.lower) / 2 - 22, width: 320, display: "flex", justifyContent: "center", gap: 10, opacity: ramp(frame, CH + 24, 14) * (1 - ramp(frame, MENU_AT, 8)) }}>
        <Chip tone="paper" size={1.2}>
          Upper
        </Chip>
        <Chip tone="paper" size={1.2}>
          Lower
        </Chip>
      </div>
    </>
  );
}

type PlanLine = { name: string; code: string; amount: string; at: number; booked?: { at: number; label: string } };
const PLAN_LINES: PlanLine[] = [
  { name: "Emergency exam", code: "D0140", amount: "$95", at: CH + 10 },
  { name: "Crown prep · #9", code: "D2740", amount: "$1,180", at: PLAN_AT, booked: { at: BOOK_PREP, label: "Booked · Thu, Oct 29" } },
  { name: "Crown seat · #9", code: "D2740", amount: "Included", at: PLAN_AT + 6, booked: { at: BOOK_SEAT, label: "Booked · Thu, Nov 12" } },
];
const PLAN_ROW_H = 92;

function PlanPanel({ frame }: { frame: number }) {
  const owes = lerp(0, 590, ramp(frame, PLAN_AT + 8, 22, EASE_OUT));
  const pays = lerp(95, 685, ramp(frame, PLAN_AT + 8, 22, EASE_OUT));
  const sent = ramp(frame, SEND_PLAN + 2, 10);
  return (
    <div style={{ position: "absolute", inset: 0, padding: 16, boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 4px 0 6px" }}>
        <Display size={30}>Treatment plan</Display>
        <Pill icon="plus" tone="paper" height={36} />
      </div>
      <div style={{ borderRadius: 18, background: C.paper, padding: "0 16px" }}>
        {PLAN_LINES.map((line, i) => {
          const grow = i === 0 ? 1 : ramp(frame, line.at, 16, EASE_IN_OUT);
          if (grow <= 0) return null;
          const show = i === 0 ? 1 : ramp(frame, line.at + 6, 14);
          return (
            <div key={line.name} style={{ height: PLAN_ROW_H * grow, overflow: "hidden", borderTop: i > 0 ? `1px solid ${C.line}` : undefined }}>
              <div style={{ height: PLAN_ROW_H, display: "flex", flexDirection: "column", justifyContent: "center", gap: 8, opacity: show, transform: `translateY(${(1 - show) * 8}px)` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ flex: 1, fontFamily: F.ui, fontWeight: 600, fontSize: 17, color: C.walnut, whiteSpace: "nowrap" }}>{line.name}</span>
                  <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 17, color: C.walnut, fontVariantNumeric: "tabular-nums" }}>{line.amount}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <CodeTag>{line.code}</CodeTag>
                  {i === 0 ? (
                    <Status tone="sage" icon="check">
                      Done today
                    </Status>
                  ) : line.booked ? (
                    <div style={{ opacity: ramp(frame, AGENT_SENT + (i - 1) * 4, 10) }}>
                      <Swap
                        t={ramp(frame, line.booked.at, 12)}
                        pop={pulse(frame, line.booked.at + 4, 5, 14)}
                        from={<Status tone="salmon">Sent to Agent</Status>}
                        to={
                          <Status tone="sage" icon="calendar">
                            {line.booked.label}
                          </Status>
                        }
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "8px 8px 0" }}>
        <TotalLine label="Plan total" value={`$${Math.round(95 + (owes / 590) * 1180).toLocaleString("en-US")}`} />
        <TotalLine label="Delta Dental PPO" value={`\u2212$${Math.round(pays).toLocaleString("en-US")}`} />
      </div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "6px 8px 0" }}>
        <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 17, color: C.walnut }}>Ana owes</span>
        <span style={{ fontFamily: F.display, fontWeight: 500, fontSize: 48, lineHeight: "54px", letterSpacing: "-0.025em", color: C.walnut, fontVariantNumeric: "tabular-nums" }}>${Math.round(owes)}</span>
      </div>
      <div style={{ marginTop: "auto", position: "relative", height: 60, transform: `scale(${1 - 0.03 * pulse(frame, SEND_PLAN - 2, 3, 9)})`, opacity: ramp(frame, PLAN_AT + 14, 12) }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 999, background: C.ink, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.ui, fontWeight: 600, fontSize: 18, color: C.paper }}>
          <span style={{ position: "absolute", display: "flex", alignItems: "center", gap: 10, opacity: 1 - sent }}>
            Send plan to Ana&rsquo;s Agent
            <Ico name="arrowRight" size={18} color={C.paper} stroke={2.2} />
          </span>
          <span style={{ position: "absolute", display: "flex", alignItems: "center", gap: 10, opacity: sent, transform: `translateY(${(1 - sent) * 8}px)` }}>
            <Ico name="check" size={18} color={C.paper} stroke={2.6} />
            Sent to Ana&rsquo;s Agent
          </span>
        </div>
      </div>
    </div>
  );
}

function TotalLine({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: F.ui, fontWeight: 500, fontSize: 15, color: SUB, fontVariantNumeric: "tabular-nums" }}>
      <span>{label}</span>
      <span style={{ color: C.walnut }}>{value}</span>
    </div>
  );
}

function CodeTag({ children }: { children: ReactNode }) {
  return (
    <span style={{ height: 24, boxSizing: "border-box", padding: "0 9px", borderRadius: 8, border: "1px solid rgba(40, 25, 16, 0.2)", display: "inline-flex", alignItems: "center", fontFamily: F.body, fontWeight: 500, fontSize: 12, color: SUB, whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
}

/* ─── Months later: the month picker rolls Nov → Apr ───────────────────────── */

const CARD = { w: 640, h: 664 };
const MONTH_SCALE = 1.36;
const CARD_X = 960 - CARD.w / 2;
const CARD_Y = 540 - CARD.h / 2;
const NEXT_BTN = { x: CARD_X + CARD.w - 28 - 24, y: CARD_Y + 28 + 24 };
const MONTH_CLICKS = [30, 40, 49, 57, 64];
const DUE_AT = 74;
const PUSH_AT = 98;
const MONTHS = Array.from({ length: 6 }, (_, i) => {
  const d = new Date(2026, 10 + i, 1);
  return { label: d.toLocaleString("en-US", { month: "long", year: "numeric" }), first: d.getDay(), days: new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate() };
});

function MonthScene() {
  const frame = useCurrentFrame();
  const arrive = ramp(frame, 0, 22, EASE_OUT);
  const push = ramp(frame, PUSH_AT, 22, EASE_IN);
  const pos = MONTH_CLICKS.reduce((s, f) => s + ramp(frame, f, 9, EASE_IN_OUT), 0);
  const cur = track(frame, [
    { f: 10, x: 1420, y: 640 },
    { f: 28, x: NEXT_BTN.x + 4, y: NEXT_BTN.y + 4 },
    { f: 70, x: NEXT_BTN.x + 4, y: NEXT_BTN.y + 4 },
    { f: 92, x: NEXT_BTN.x + 70, y: NEXT_BTN.y + 150 },
  ]);
  return (
    <AbsoluteFill style={{ opacity: arrive * (1 - push), filter: arrive < 1 || push > 0 ? `blur(${Math.max((1 - arrive) * 14, push * 14)}px)` : undefined, transform: `scale(${MONTH_SCALE * lerp(1.06, 1, arrive) * lerp(1, 1.6, push) * lerp(1, 1.03, ramp(frame, 0, PUSH_AT, EASE_IN_OUT))})` }}>
      <div style={{ position: "absolute", left: CARD_X, top: CARD_Y, width: CARD.w, height: CARD.h, boxSizing: "border-box", padding: 28, borderRadius: 40, background: C.paper, display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 48 }}>
          <Pill icon="chevronLeft" tone="beige" height={48} />
          <div style={{ height: 52, overflow: "hidden" }}>
            <div style={{ transform: `translateY(${-pos * 52}px)` }}>
              {MONTHS.map((m) => (
                <div key={m.label} style={{ height: 52, textAlign: "center", fontFamily: F.display, fontWeight: 500, fontSize: 40, lineHeight: "52px", letterSpacing: "-0.02em", color: C.walnut }}>
                  {m.label}
                </div>
              ))}
            </div>
          </div>
          <Pill icon="chevronRight" tone="beige" height={48} pressed={press(frame, MONTH_CLICKS)} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", fontFamily: F.body, fontWeight: 500, fontSize: 13, color: C.faint, textAlign: "center" }}>
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>
        <div style={{ position: "relative", height: 6 * 58 }}>
          {MONTHS.map((m, i) => {
            const vis = clamp01(1 - Math.abs(pos - i) * 1.6);
            if (vis <= 0) return null;
            return (
              <div key={m.label} style={{ position: "absolute", inset: 0, opacity: vis, transform: `translateX(${(i - pos) * 40}px)` }}>
                <DayGrid month={m} mark={i === 0 ? { day: 12, tone: "ink" } : i === 5 ? { day: 21, tone: "salmon", t: ramp(frame, DUE_AT, 10), pop: pulse(frame, DUE_AT + 4, 5, 14) } : undefined} />
              </div>
            );
          })}
        </div>
        <div style={{ height: 76, boxSizing: "border-box", padding: "0 16px 0 14px", borderRadius: 22, background: C.beige, display: "flex", alignItems: "center", gap: 14, ...rise(frame, DUE_AT + 6, { y: 14, dur: 18 }) }}>
          <Av label="AR" size={44} />
          <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 18, color: C.walnut }}>Ana Ruiz</span>
          <Chip tone="outline" size={1.15}>
            6-month cleaning
          </Chip>
          <div style={{ flex: 1 }} />
          <Status tone="salmon">Due Apr 21</Status>
        </div>
      </div>
      <div style={{ opacity: ramp(frame, 10, 8) * (1 - ramp(frame, 88, 8)) }}>
        <Cursor x={cur.x} y={cur.y} pressed={press(frame, MONTH_CLICKS)} />
      </div>
      {MONTH_CLICKS.map((f) => (
        <ClickRing key={f} x={NEXT_BTN.x} y={NEXT_BTN.y} progress={ramp(frame, f - 1, 14)} />
      ))}
    </AbsoluteFill>
  );
}

function DayGrid({ month, mark }: { month: (typeof MONTHS)[number]; mark?: { day: number; tone: "ink" | "salmon"; t?: number; pop?: number } }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gridAutoRows: 58 }}>
      {Array.from({ length: month.first }, (_, i) => (
        <span key={`e${i}`} />
      ))}
      {Array.from({ length: month.days }, (_, i) => {
        const day = i + 1;
        const marked = mark?.day === day;
        const t = marked ? (mark.t ?? 1) : 0;
        return (
          <div key={day} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: marked ? (mark.tone === "ink" ? `rgba(20, 12, 4, ${t})` : `rgba(252, 207, 184, ${t})`) : "transparent",
                transform: `scale(${1 + 0.12 * (marked ? (mark.pop ?? 0) : 0)})`,
                fontFamily: F.ui,
                fontWeight: 500,
                fontSize: 18,
                color: marked && mark.tone === "ink" ? C.paper : C.walnut,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {day}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Recall: select the due patients, reach out through their agents ────── */

type RecallRow = { name: string; last: string; due: string; kind: string; status: { tone: "soft" | "sage" | "salmon"; label: string } };
const RECALL: RecallRow[] = [
  { name: "Ana Ruiz", last: "Nov 12 · Crown seat", due: "Apr 21", kind: "6-month cleaning", status: { tone: "soft", label: "Not contacted" } },
  { name: "Marcus Lee", last: "Oct 19 · Cleaning", due: "Apr 19", kind: "6-month cleaning", status: { tone: "soft", label: "Not contacted" } },
  { name: "Priya Nair", last: "Oct 22 · Perio", due: "Apr 22", kind: "Perio maintenance", status: { tone: "soft", label: "Not contacted" } },
  { name: "Tom Becker", last: "Oct 26 · Filling", due: "Apr 26", kind: "6-month cleaning", status: { tone: "soft", label: "Not contacted" } },
  { name: "Grace Wu", last: "Oct 8 · Cleaning", due: "Apr 8", kind: "6-month cleaning", status: { tone: "sage", label: "Booked · Apr 9" } },
  { name: "Daniel Ortiz", last: "Sep 30 · Bridge", due: "Apr 2", kind: "Bridge check", status: { tone: "sage", label: "Booked · Apr 2" } },
  { name: "Ruth Cole", last: "Oct 2 · Cleaning", due: "Apr 2", kind: "6-month cleaning", status: { tone: "salmon", label: "Sent to Agent" } },
  { name: "Hana Sato", last: "Oct 14 · Implant", due: "Apr 14", kind: "Implant check", status: { tone: "sage", label: "Booked · Apr 15" } },
  { name: "Leo Park", last: "Oct 20 · Crown prep", due: "Apr 20", kind: "6-month cleaning", status: { tone: "sage", label: "Booked · Apr 20" } },
];
const TABLE = { x: 28, y: 160, head: 44, rowH: 62, gap: 4, pad: 8 };
const COLS = { check: 22, name: 210, last: 230, due: 120, status: 250 };
const rowTop = (i: number) => TABLE.y + TABLE.pad + TABLE.head + i * (TABLE.rowH + TABLE.gap);
const CHECK_X = TABLE.x + TABLE.pad + 16 + COLS.check / 2;
const CHECKS = [44, 52, 60, 68];
const BAR = { w: 600, h: 68, y: 784 };
const BAR_BTN = onPage(PAGE.w / 2 + BAR.w / 2 - 8 - 130, BAR.y + BAR.h / 2);
const OUTREACH_AT = 100;
const SENT_AT = (i: number) => OUTREACH_AT + 6 + i * 4;
const BOOKED: Record<number, { at: number; label: string }> = { 0: { at: 146, label: "Booked · Apr 23, 8:30 AM" }, 1: { at: 158, label: "Booked · Apr 20" }, 3: { at: 168, label: "Booked · Apr 27" } };
const JOURNEY_AT = 176;
const JOURNEY_H = 112;
const JOURNEY = [
  { date: "Oct 20", label: "Emergency exam", future: false },
  { date: "Oct 29", label: "Crown prep", future: false },
  { date: "Nov 12", label: "Crown seat", future: false },
  { date: "Apr 23", label: "Cleaning", future: true },
  { date: "Oct 2027", label: "Cleaning", future: true },
];

const RECALL_CAMS: CameraKey[] = [
  { f: 0, x: 960, y: 540, s: 1.02 },
  { f: 34, x: 860, y: 470, s: 1.24 },
  { f: 72, x: 860, y: 520, s: 1.26 },
  { f: 98, x: 1010, y: 700, s: 1.3 },
  { f: 112, x: 1010, y: 700, s: 1.3 },
  { f: 140, x: 1290, y: 450, s: 1.5 },
  { f: 168, x: 1270, y: 440, s: 1.52 },
  { f: 206, x: 990, y: 470, s: 1.5 },
  { f: VIDEO4_DENTAL_FRAMES - RECALL_AT, x: 990, y: 474, s: 1.56 },
];

function RecallScene() {
  const frame = useCurrentFrame();
  const arrive = ramp(frame, 0, 22, EASE_OUT);
  const selected = CHECKS.filter((f) => frame >= f).length;
  const bar = ramp(frame, CHECKS[0] + 4, 18, EASE_OUT) * (1 - ramp(frame, OUTREACH_AT + 30, 16, EASE_IN_OUT));
  const journey = ramp(frame, JOURNEY_AT, 22, EASE_IN_OUT);
  const cur = track(frame, [
    { f: 22, x: 1200, y: 900 },
    ...CHECKS.map((f, i) => ({ f: f - 4, x: onPage(CHECK_X, 0).x + 2, y: onPage(0, rowTop(i) + TABLE.rowH / 2).y + 2 })),
    { f: 92, x: BAR_BTN.x + 10, y: BAR_BTN.y + 4 },
    { f: 124, x: BAR_BTN.x + 120, y: BAR_BTN.y + 120 },
  ]);

  return (
    <AbsoluteFill style={{ opacity: arrive, filter: arrive < 1 ? `blur(${(1 - arrive) * 12}px)` : undefined, transform: `scale(${lerp(1.08, 1, arrive)})` }}>
      <div style={camera(frame, RECALL_CAMS, CAMERA_EASE)}>
        <div style={{ position: "absolute", left: SHELL.x, top: SHELL.y }}>
          <AppShell active={3} railReveal={(i) => ramp(frame, 4 + i * 2, 12)}>
            <div style={{ position: "absolute", left: 28, top: 28, display: "flex", alignItems: "center", gap: 16, ...rise(frame, 2) }}>
              <Display size={46}>Recall</Display>
              <Pill tone="beige" trailing="chevronDown">
                April 2027
              </Pill>
            </div>
            <div style={{ position: "absolute", right: 28, top: 34, display: "flex", gap: 8, ...rise(frame, 4) }}>
              <Pill icon="search" tone="beige" />
              <Pill tone="beige" trailing="chevronDown">
                All providers
              </Pill>
            </div>
            <div style={{ position: "absolute", left: 28, top: 100, ...rise(frame, 6) }}>
              <Segmented
                items={[
                  <>
                    Due <span style={{ color: C.faint }}>24</span>
                  </>,
                  <>
                    Overdue <span style={{ color: C.faint }}>7</span>
                  </>,
                  <>
                    Scheduled <span style={{ color: C.faint }}>41</span>
                  </>,
                ]}
                value={0}
                width={440}
              />
            </div>
            <div style={{ position: "absolute", left: TABLE.x, top: TABLE.y, width: PAGE.w - 56, height: PAGE.h - TABLE.y + 40, boxSizing: "border-box", padding: `${TABLE.pad}px ${TABLE.pad}px 0`, borderRadius: 20, background: C.beige, ...rise(frame, 8, { y: 20, dur: 26 }) }}>
              <div style={{ height: TABLE.head, display: "flex", alignItems: "center", gap: 16, padding: "0 16px", fontFamily: F.body, fontSize: 13, color: SUB }}>
                <div style={{ width: COLS.check }}>
                  <CheckBox checked={0} size={20} />
                </div>
                <div style={{ width: COLS.name }}>Patient</div>
                <div style={{ width: COLS.last }}>Last visit</div>
                <div style={{ width: COLS.due }}>Due</div>
                <div style={{ flex: 1 }}>Recall</div>
                <div style={{ width: COLS.status }}>Status</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: TABLE.gap }}>
                {RECALL.map((row, i) => (
                  <RecallRowView key={row.name} frame={frame} row={row} index={i} journey={i === 0 ? journey : 0} />
                ))}
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                left: PAGE.w / 2 - BAR.w / 2,
                top: BAR.y,
                width: BAR.w,
                height: BAR.h,
                boxSizing: "border-box",
                padding: "0 8px 0 26px",
                borderRadius: 999,
                background: C.ink,
                display: "flex",
                alignItems: "center",
                gap: 14,
                opacity: bar,
                transform: `translateY(${(1 - bar) * 40}px)`,
              }}
            >
              <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 17, color: C.paper, fontVariantNumeric: "tabular-nums" }}>{Math.max(1, selected)} selected</span>
              <span style={{ flex: 1 }} />
              <Pill icon="x" tone="ink" height={44} style={{ color: "rgba(255, 252, 241, 0.7)" }} />
              <Pill tone="paper" height={52} pressed={pulse(frame, OUTREACH_AT - 2, 3, 8)} style={{ width: 260, fontSize: 17, fontWeight: 600 }}>
                Reach out through agents
              </Pill>
            </div>
          </AppShell>
        </div>
        {CHECKS.map((f, i) => (
          <ClickRing key={f} x={onPage(CHECK_X, 0).x} y={onPage(0, rowTop(i) + TABLE.rowH / 2).y} progress={ramp(frame, f - 1, 14)} />
        ))}
        <ClickRing x={BAR_BTN.x + 10} y={BAR_BTN.y} progress={ramp(frame, OUTREACH_AT - 1, 16)} />
        <div style={{ opacity: ramp(frame, 22, 8) * (1 - ramp(frame, 118, 10)) }}>
          <Cursor x={cur.x} y={cur.y} pressed={press(frame, [...CHECKS, OUTREACH_AT])} />
        </div>
      </div>
    </AbsoluteFill>
  );
}

function RecallRowView({ frame, row, index, journey }: { frame: number; row: RecallRow; index: number; journey: number }) {
  const checked = index < CHECKS.length ? ramp(frame, CHECKS[index], 8) : 0;
  const sent = index < CHECKS.length ? ramp(frame, SENT_AT(index), 10) : 0;
  const booked = BOOKED[index];
  const text: CSSProperties = { fontFamily: F.body, fontSize: 15, color: SUB, whiteSpace: "nowrap" };
  return (
    <div style={{ height: TABLE.rowH + JOURNEY_H * journey, borderRadius: 14, background: C.paper, overflow: "hidden", flexShrink: 0, ...rise(frame, 12 + index * 2, { y: 12, dur: 20 }) }}>
      <div style={{ height: TABLE.rowH, display: "flex", alignItems: "center", gap: 16, padding: "0 16px" }}>
        <div style={{ width: COLS.check }}>
          <CheckBox checked={checked} size={20} />
        </div>
        <div style={{ width: COLS.name, display: "flex", alignItems: "center", gap: 10 }}>
          <Av label={row.name.split(" ").map((s) => s[0]).join("")} size={30} tone={index === 0 ? "salmon" : index % 3 === 1 ? "sage" : "sand"} />
          <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 17, letterSpacing: "-0.01em", color: C.walnut, whiteSpace: "nowrap" }}>{row.name}</span>
        </div>
        <div style={{ width: COLS.last, ...text }}>{row.last}</div>
        <div style={{ width: COLS.due, fontFamily: F.ui, fontWeight: 500, fontSize: 16, color: C.walnut }}>{row.due}</div>
        <div style={{ flex: 1, ...text, color: "rgba(40, 25, 16, 0.78)" }}>{row.kind}</div>
        <div style={{ width: COLS.status }}>
          {index < CHECKS.length ? (
            <Swap
              t={booked ? ramp(frame, booked.at, 12) : 0}
              pop={booked ? pulse(frame, booked.at + 4, 5, 14) : 0}
              from={<Swap t={sent} pop={pulse(frame, SENT_AT(index) + 3, 4, 12)} from={<Status tone="soft">{row.status.label}</Status>} to={<Status tone="salmon">Sent to Agent</Status>} />}
              to={
                booked ? (
                  <Status tone="sage" icon="calendar">
                    {booked.label}
                  </Status>
                ) : null
              }
            />
          ) : (
            <Status tone={row.status.tone}>{row.status.label}</Status>
          )}
        </div>
      </div>
      {journey > 0 ? <Journey frame={frame} open={journey} /> : null}
    </div>
  );
}

function Journey({ frame, open }: { frame: number; open: number }) {
  const x0 = 70;
  const x1 = 1180;
  const draw = ramp(frame, JOURNEY_AT + 8, 34, EASE_IN_OUT);
  const step = (x1 - x0) / (JOURNEY.length - 1);
  const lineY = 40;
  return (
    <div style={{ position: "relative", height: JOURNEY_H, margin: "0 16px", borderTop: `1px solid ${C.line}`, opacity: clamp01(open * 1.4) }}>
      <div style={{ position: "absolute", left: x0, top: lineY - 1, width: (x1 - x0) * 0.75 * draw, height: 2, background: C.walnut }} />
      <div style={{ position: "absolute", left: x0 + (x1 - x0) * 0.75, top: lineY - 1, width: (x1 - x0) * 0.25 * clamp01((draw - 0.75) / 0.25), height: 0, borderTop: "2px dashed rgba(40, 25, 16, 0.3)" }} />
      {JOURNEY.map((j, i) => {
        const x = x0 + i * step;
        const on = ramp(frame, JOURNEY_AT + 8 + i * 7, 12, EASE_OUT);
        const next = i === 3;
        return (
          <div key={j.date + j.label} style={{ position: "absolute", left: x, top: 0, opacity: on }}>
            <div style={{ position: "absolute", left: -9, top: lineY - 9, width: 18, height: 18, boxSizing: "border-box", borderRadius: 99, background: j.future ? (next ? C.salmon : C.paper) : C.ink, border: j.future && !next ? "2px dashed rgba(40, 25, 16, 0.3)" : `3px solid ${C.paper}`, transform: `scale(${lerp(0.4, 1, on) + (next ? 0.2 * pulse(frame, JOURNEY_AT + 30, 5, 14) : 0)})` }} />
            <div style={{ position: "absolute", left: -90, width: 180, top: lineY + 18, textAlign: "center", display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 15, color: j.future && !next ? C.faint : C.walnut }}>{j.date}</span>
              <span style={{ fontFamily: F.body, fontSize: 13, color: j.future && !next ? C.faint : SUB }}>{j.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}