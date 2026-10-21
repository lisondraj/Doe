import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";

import { DotTide, Stage } from "../video1/backdrops";
import { Bubble, IPhone, Slot, TimeStamp, TypingBubble } from "../video1/imessage";
import { EASE_IN, EASE_IN_OUT, EASE_OUT, blink, fly, lerp, pulse, ramp, typed } from "../video1/motion";
import { C, F } from "../video1/theme";
import { AppShell, Caret, ClickRing, Cursor, Icon, ShadowsContext, Toggle } from "../video1/ui";
import {
  BedTrack,
  CLINIC,
  Initials,
  KIM,
  Menu,
  OKAFOR,
  Pill,
  RoundButton,
  SAGE,
  SAGE_TEXT,
  SECTION_FRAMES,
  SUB,
  SkinScale,
  Stepper,
  Swap,
  Tabs,
  body,
  camState,
  camStyle,
  cursorAt,
  money,
  onScreen,
  title,
  ui,
  type CursorKey,
} from "./kit";

export const SECTION2_FRAMES = SECTION_FRAMES;

const BUILDER_DUR = 384;
const DETAILS_FROM = 360;

export function Section2Packages() {
  return (
    <ShadowsContext.Provider value={false}>
      <BedTrack voice="video5/AES2.mp3" />
      <Stage backdrop={<DotTide reach={460} />}>
        <Sequence from={0} durationInFrames={BUILDER_DUR} name="Packages → builder">
          <BuilderScene />
        </Sequence>
        <Sequence from={DETAILS_FROM} durationInFrames={SECTION_FRAMES - DETAILS_FROM} name="Package details → agent">
          <DetailsScene />
        </Sequence>
      </Stage>
    </ShadowsContext.Provider>
  );
}

/** A package drawn as its run of sessions, one rounded block per visit in that treatment's hue. */
function SessionTrack({ runs, size = 22, gap = 5, reveal = 1 }: { runs: { hue: string; count: number }[]; size?: number; gap?: number; reveal?: number }) {
  const blocks = runs.flatMap((r) => Array.from({ length: r.count }, () => r.hue));
  return (
    <div style={{ display: "flex", gap }}>
      {blocks.map((hue, i) => {
        const p = Math.min(1, Math.max(0, reveal * blocks.length - i));
        return <div key={i} style={{ width: size, height: size * 1.5, borderRadius: size * 0.32, background: hue, opacity: p, transform: `scaleY(${lerp(0.3, 1, p)})`, transformOrigin: "50% 100%" }} />;
      })}
    </div>
  );
}

/* ─── Packages page + builder sheet ────────────────────────────────────────── */

const SHELL = { x: 240, y: 90 };
const PAGE = { x: SHELL.x + 64, y: SHELL.y + 12 };
const P = (x: number, y: number) => ({ x: PAGE.x + x, y: PAGE.y + y });

const GRID = { x: 28, y: 124, gap: 12, colW: (1308 - 24) / 3, rowH: 372 };

const LIBRARY: { name: string; price: string; runs: { hue: string; count: number }[]; chips: string[] }[] = [
  { name: "Bridal Prep Series", price: "$1,240", runs: [{ hue: C.salmon, count: 3 }, { hue: SAGE, count: 3 }], chips: ["HydraFacial ×3", "LED ×3"] },
  { name: "Melasma Reset", price: "$980", runs: [{ hue: C.sand2, count: 4 }, { hue: SAGE, count: 1 }], chips: ["Peel ×4", "Home care"] },
  { name: "Botox Membership", price: "$89 / mo", runs: [{ hue: SAGE, count: 4 }], chips: ["Every 12 weeks"] },
  { name: "Laser Hair Removal", price: "$1,080", runs: [{ hue: C.salmon, count: 6 }], chips: ["6 sessions", "Any area"] },
  { name: "Post-Op Recovery", price: "$640", runs: [{ hue: C.sand2, count: 4 }, { hue: C.salmon, count: 1 }], chips: ["Lymphatic ×4", "Scar care"] },
];

const SHEET = { x: 560, y: 28, w: 776, h: 820, pad: 28 };
const S = { header: 28, name: 92, nameH: 76, treat: 196, rows: 246, rowH: 66, rowGap: 8, price: 484, priceH: 196, footer: 732 };
const W = (x: number, y: number) => P(SHEET.x + x, SHEET.y + y);
const INNER = SHEET.w - SHEET.pad * 2;
const MENU = { x: SHEET.pad + INNER - 400, y: S.treat + 46, w: 400, rowH: 50, head: 44 };
const menuRowY = (i: number) => MENU.y + 6 + MENU.head + 4 + i * MENU.rowH + MENU.rowH / 2;
const MENU_ADD_Y = menuRowY(5) + MENU.rowH / 2 + 4 + 23;
const rowY = (i: number) => S.rows + i * (S.rowH + S.rowGap);
const STEPPER_X = 376;
const PLUS_X = STEPPER_X + 112 - 19;

const OPTIONS = [
  { name: "RF Microneedling", unit: 450, hue: C.salmon },
  { name: "Subcision", unit: 380, hue: SAGE },
  { name: "TCA CROSS", unit: 300, hue: C.sand2 },
  { name: "Fractional Laser", unit: 650, hue: C.salmon },
  { name: "Chemical Peel", unit: 180, hue: SAGE },
  { name: "LED Therapy", unit: 90, hue: C.sand2 },
];

const NEW_CLICK = 90;
const NAME = "Acne Scar Program";
const NAME_AT = 114;
const NAME_CPS = 20;
const ADD_CLICK = 168;
const PICKS = [192, 206, 220];
const ADD3_CLICK = 240;
const ROWS_IN = [244, 250, 256];
const RF_PLUS = [272, 284];
const TCA_PLUS = [300];
const PRICE_AT = 312;
const PUBLISH_CLICK = 350;
const BUILDER_OUT = 362;

const NEW_BUTTON = P(1364 - 28 - 76, 59);
const ADD_BUTTON = W(SHEET.pad + INNER - 86, S.treat + 19);

const BUILDER_CAM = [
  { f: 0, ...P(430, 330), s: 1.5 },
  { f: 70, ...P(880, 270), s: 1.38 },
  { f: NEW_CLICK + 4, ...P(930, 300), s: 1.32 },
  { f: 132, ...W(390, 360), s: 1.3 },
  { f: ADD_CLICK + 8, ...W(420, 380), s: 1.44 },
  { f: ADD3_CLICK + 8, ...W(410, 380), s: 1.44 },
  { f: 300, ...W(400, 470), s: 1.4 },
  { f: 336, ...W(400, 560), s: 1.32 },
  { f: PUBLISH_CLICK + 2, ...W(400, 566), s: 1.34 },
  { f: BUILDER_DUR, ...W(SHEET.pad + 250, S.name + S.nameH / 2), s: 3.2 },
];

const BUILDER_CURSOR: CursorKey[] = [
  { f: 40, x: 1720, y: 1020 },
  { f: NEW_CLICK - 4, ...NEW_BUTTON },
  { f: ADD_CLICK - 6, ...ADD_BUTTON },
  { f: PICKS[0] - 4, ...W(MENU.x + 200, menuRowY(0)) },
  { f: PICKS[1] - 4, ...W(MENU.x + 200, menuRowY(1)) },
  { f: PICKS[2] - 4, ...W(MENU.x + 200, menuRowY(2)) },
  { f: ADD3_CLICK - 4, ...W(MENU.x + 200, MENU_ADD_Y) },
  { f: RF_PLUS[0] - 4, ...W(PLUS_X, rowY(0) + S.rowH / 2) },
  { f: RF_PLUS[1] - 4, ...W(PLUS_X, rowY(0) + S.rowH / 2) },
  { f: TCA_PLUS[0] - 4, ...W(PLUS_X, rowY(2) + S.rowH / 2) },
  { f: PUBLISH_CLICK - 4, ...W(478, S.footer + 30) },
  { f: PUBLISH_CLICK + 20, ...W(520, S.footer + 70) },
];
const BUILDER_CLICKS = [NEW_CLICK, ADD_CLICK, ...PICKS, ADD3_CLICK, ...RF_PLUS, ...TCA_PLUS, PUBLISH_CLICK];

function BuilderScene() {
  const frame = useCurrentFrame();
  const cam = camState(frame, BUILDER_CAM);
  const leave = ramp(frame, BUILDER_OUT, 16, EASE_IN);
  const cursor = onScreen(cam, cursorAt(frame, BUILDER_CURSOR));
  const press = Math.max(...BUILDER_CLICKS.map((f) => pulse(frame, f - 2, 3, 6)));
  const lastClick = [...BUILDER_CLICKS].reverse().find((f) => frame >= f);
  const ring = lastClick === undefined ? null : onScreen(cam, cursorAt(lastClick, BUILDER_CURSOR));

  return (
    <AbsoluteFill style={{ opacity: 1 - leave, filter: leave > 0 ? `blur(${(leave * 14).toFixed(2)}px)` : undefined }}>
      <div style={camStyle(cam)}>
        <div style={{ position: "absolute", left: SHELL.x, top: SHELL.y, ...fly(frame, { at: 0, y: 40, scale: 0.98, dur: 26, blur: 6 }) }}>
          <AppShell active={1} railReveal={(i) => ramp(frame, 8 + i * 2, 12, EASE_OUT)}>
            <PackagesPage frame={frame} />
            <BuilderSheet frame={frame} />
          </AppShell>
        </div>
      </div>
      {ring && lastClick !== undefined ? <ClickRing x={ring.x} y={ring.y} progress={ramp(frame, lastClick + 1, 16)} /> : null}
      <div style={{ opacity: ramp(frame, 40, 8) * (1 - ramp(frame, PUBLISH_CLICK + 8, 8)) }}>
        <Cursor x={cursor.x} y={cursor.y} size={34} pressed={press} />
      </div>
    </AbsoluteFill>
  );
}

function PackagesPage({ frame }: { frame: number }) {
  const dim = ramp(frame, NEW_CLICK + 2, 16, EASE_IN_OUT);
  return (
    <>
      <div style={{ position: "absolute", left: 28, top: 30, ...title(52) }}>Packages</div>
      <div style={{ position: "absolute", right: 28, top: 40, display: "flex", gap: 10 }}>
        <Tabs options={["Packages", "Bundles", "Offers"]} active={0} style={{ width: 340 }} />
        <RoundButton icon="search" />
        <Pill tone="ink" press={pulse(frame, NEW_CLICK, 3, 8)} lead={<Icon name="plus" size={14} color={C.paper} stroke={2.2} />}>
          New package
        </Pill>
      </div>
      {LIBRARY.map((pkg, i) => (
        <div key={pkg.name} style={{ position: "absolute", left: GRID.x + (i % 3) * (GRID.colW + GRID.gap), top: GRID.y + Math.floor(i / 3) * (GRID.rowH + GRID.gap), ...fly(frame, { at: 6 + i * 4, y: 24, dur: 22, blur: 0 }) }}>
          <PackageTile pkg={pkg} />
        </div>
      ))}
      <div
        style={{
          position: "absolute",
          left: GRID.x + 2 * (GRID.colW + GRID.gap),
          top: GRID.y + GRID.rowH + GRID.gap,
          width: GRID.colW,
          height: GRID.rowH,
          boxSizing: "border-box",
          borderRadius: 26,
          border: "1.5px dashed rgba(40, 25, 16, 0.22)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          ...ui(17, 500, { color: SUB }),
          ...fly(frame, { at: 26, y: 24, dur: 22, blur: 0 }),
        }}
      >
        <Icon name="plus" size={18} color={SUB} />
        New package
      </div>
      <div style={{ position: "absolute", inset: 0, background: C.paper, opacity: 0.6 * dim }} />
    </>
  );
}

function PackageTile({ pkg }: { pkg: (typeof LIBRARY)[number] }) {
  return (
    <div style={{ width: GRID.colW, height: GRID.rowH, boxSizing: "border-box", padding: 14, borderRadius: 26, background: C.beige, display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ height: 150, borderRadius: 18, background: C.paper, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <SessionTrack runs={pkg.runs} size={26} gap={7} />
      </div>
      <div style={{ padding: "0 8px", display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
        <span style={title(28)}>{pkg.name}</span>
        <div style={{ display: "flex", gap: 6 }}>
          {pkg.chips.map((chip) => (
            <Pill key={chip} tone="paper" height={30} style={{ fontSize: 13 }}>
              {chip}
            </Pill>
          ))}
        </div>
        <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={title(30)}>{pkg.price}</span>
          <Toggle on />
        </div>
      </div>
    </div>
  );
}

function BuilderSheet({ frame }: { frame: number }) {
  const open = ramp(frame, NEW_CLICK + 2, 22, EASE_OUT);
  if (open <= 0) return null;
  const name = typed(NAME, frame, NAME_AT, NAME_CPS);
  const naming = frame >= NAME_AT - 8 && frame < ADD_CLICK;
  const qty = [1 + RF_PLUS.filter((f) => frame >= f).length, 1, 1 + TCA_PLUS.filter((f) => frame >= f).length];
  const contribution = (i: number) => {
    const unit = OPTIONS[i].unit;
    const plus = i === 0 ? RF_PLUS : i === 2 ? TCA_PLUS : [];
    return unit * ramp(frame, ROWS_IN[i], 12, EASE_OUT) + plus.reduce((sum, f) => sum + unit * ramp(frame, f + 1, 10, EASE_OUT), 0);
  };
  const individually = contribution(0) + contribution(1) + contribution(2);
  const priceIn = ramp(frame, PRICE_AT, 14, EASE_OUT);
  const published = ramp(frame, PUBLISH_CLICK + 2, 12, EASE_IN_OUT);

  return (
    <div style={{ position: "absolute", left: SHEET.x, top: SHEET.y, width: SHEET.w, height: SHEET.h, boxSizing: "border-box", borderRadius: 28, background: C.paper, border: `1px solid ${C.line2}`, opacity: open, transform: `translateX(${(1 - open) * 120}px)` }}>
      <div style={{ position: "absolute", left: SHEET.pad, top: S.header, width: INNER, height: 44, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Tabs options={["Package", "Bundle", "Offer"]} active={0} height={42} style={{ width: 340 }} />
        <RoundButton icon="x" size={40} />
      </div>
      <div
        style={{
          position: "absolute",
          left: SHEET.pad,
          top: S.name,
          width: INNER,
          height: S.nameH,
          boxSizing: "border-box",
          padding: "0 22px",
          borderRadius: 20,
          background: C.beige,
          outline: naming ? `2px solid ${C.walnut}` : undefined,
          outlineOffset: -2,
          display: "flex",
          alignItems: "center",
        }}
      >
        <span style={title(40, { color: name ? C.walnut : "rgba(40, 25, 16, 0.3)" })}>{name || "Package name"}</span>
        {naming ? <Caret height={40} width={3} visible={name.length > 0 && name.length < NAME.length ? 1 : blink(frame)} /> : null}
      </div>
      <div style={{ position: "absolute", left: SHEET.pad, top: S.treat, width: INNER, height: 38, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={ui(17, 600)}>Treatments</span>
        <Pill tone="outline" press={pulse(frame, ADD_CLICK, 3, 8)} lead={<Icon name="plus" size={14} stroke={2.2} />} style={frame >= ADD_CLICK && frame < ADD3_CLICK ? { border: `1.5px solid ${C.walnut}` } : undefined}>
          Add treatment
        </Pill>
      </div>
      {frame < ROWS_IN[0] ? (
        <div style={{ position: "absolute", left: SHEET.pad, top: S.rows, width: INNER, height: 3 * (S.rowH + S.rowGap) - S.rowGap, boxSizing: "border-box", borderRadius: 18, border: "1.5px dashed rgba(40, 25, 16, 0.18)", display: "flex", alignItems: "center", justifyContent: "center", ...ui(16, 500, { color: SUB }) }}>
          No treatments yet
        </div>
      ) : null}
      {OPTIONS.slice(0, 3).map((opt, i) => {
        const inP = ramp(frame, ROWS_IN[i], 14, EASE_OUT);
        if (inP <= 0) return null;
        const plus = i === 0 ? RF_PLUS : i === 2 ? TCA_PLUS : [];
        return (
          <div
            key={opt.name}
            style={{
              position: "absolute",
              left: SHEET.pad,
              top: rowY(i),
              width: INNER,
              height: S.rowH,
              boxSizing: "border-box",
              padding: "0 18px 0 16px",
              borderRadius: 18,
              background: C.beige,
              display: "flex",
              alignItems: "center",
              opacity: inP,
              transform: `translateY(${(1 - inP) * 16}px)`,
            }}
          >
            <div style={{ width: 28, height: 28, borderRadius: 999, background: opt.hue, flexShrink: 0 }} />
            <span style={{ marginLeft: 14, ...ui(18, 600) }}>{opt.name}</span>
            <div style={{ position: "absolute", left: STEPPER_X - SHEET.pad, top: (S.rowH - 38) / 2, width: 112 }}>
              <Stepper height={38} value={`×${qty[i]}`} pressPlus={Math.max(0, ...plus.map((f) => pulse(frame, f - 1, 3, 8)))} />
            </div>
            <span style={{ position: "absolute", left: 530 - SHEET.pad, ...body(15) }}>{money(opt.unit)} each</span>
            <span style={{ position: "absolute", right: 18, ...title(24, { lineHeight: "28px", fontVariantNumeric: "tabular-nums" }) }}>{money(contribution(i))}</span>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: SHEET.pad, top: S.price, width: INNER, height: S.priceH, boxSizing: "border-box", padding: "20px 22px", borderRadius: 22, background: C.beige, display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={ui(16, 600)}>Individually</span>
          <span style={{ ...ui(18, 600, { color: SUB, fontVariantNumeric: "tabular-nums" }), textDecoration: priceIn > 0.5 ? "line-through" : undefined }}>{money(individually)}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          <span style={ui(16, 600)}>Package price</span>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ opacity: ramp(frame, PRICE_AT + 10, 10), transform: `scale(${lerp(0.8, 1, ramp(frame, PRICE_AT + 10, 10, EASE_OUT))})` }}>
              <Pill tone="salmon" height={32} style={{ fontFamily: F.ui, fontSize: 14 }}>
                Save $380
              </Pill>
            </div>
            <span style={title(52, { opacity: priceIn, transform: `translateY(${(1 - priceIn) * 10}px)`, display: "inline-block" })}>$1,950</span>
          </div>
        </div>
        <Tabs options={["Pay in full", "3 payments of $650"]} active={0} height={40} />
      </div>
      {frame >= ADD_CLICK ? <TreatmentMenu frame={frame} /> : null}
      <div style={{ position: "absolute", left: SHEET.pad, top: S.footer, width: INNER, height: 60, display: "flex", gap: 10 }}>
        <Pill tone="outline" height={60} style={{ fontFamily: F.ui, fontSize: 18, padding: "0 30px" }}>
          Save draft
        </Pill>
        <div style={{ flex: 1, height: 60, borderRadius: 999, background: published > 0.5 ? SAGE : C.ink, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 - 0.04 * pulse(frame, PUBLISH_CLICK, 3, 8)})`, ...ui(19, 600, { color: published > 0.5 ? SAGE_TEXT : C.paper }) }}>
          <Swap
            t={published}
            from={<>Publish package</>}
            to={
              <>
                <Icon name="check" size={20} color={SAGE_TEXT} stroke={2.6} />
                Published
              </>
            }
          />
        </div>
      </div>
    </div>
  );
}

function TreatmentMenu({ frame }: { frame: number }) {
  const open = ramp(frame, ADD_CLICK + 1, 10, EASE_OUT) * (1 - ramp(frame, ADD3_CLICK + 1, 8, EASE_IN_OUT));
  if (open <= 0) return null;
  const picked = PICKS.filter((f) => frame >= f).length;
  const hover = frame < PICKS[0] - 8 ? -1 : lerp(lerp(0, 1, ramp(frame, PICKS[1] - 10, 6)), 2, ramp(frame, PICKS[2] - 10, 6));
  return (
    <div style={{ position: "absolute", left: MENU.x, top: MENU.y, opacity: open, transform: `translateY(${(1 - open) * -8}px)` }}>
      <Menu
        width={MENU.w}
        rowH={MENU.rowH}
        hover={frame < ADD3_CLICK - 10 ? hover : -1}
        header={
          <div style={{ height: MENU.head, boxSizing: "border-box", padding: "0 14px", borderRadius: 12, background: C.beige, display: "flex", alignItems: "center", gap: 10 }}>
            <Icon name="search" size={16} color={SUB} stroke={2} />
            <span style={body(15)}>Search treatments</span>
          </div>
        }
        items={OPTIONS.map((opt, i) => ({ label: opt.name, lead: <div style={{ width: 22, height: 22, borderRadius: 999, background: opt.hue }} />, meta: money(opt.unit), checked: i < 3 ? ramp(frame, PICKS[i] + 1, 6) : 0 }))}
        footer={
          <div style={{ height: 46, borderRadius: 999, background: picked > 0 ? C.ink : "rgba(40, 25, 16, 0.18)", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 - 0.05 * pulse(frame, ADD3_CLICK, 3, 8)})`, ...ui(16, 600, { color: C.paper }) }}>
            {picked > 0 ? `Add ${picked}` : "Add"}
          </div>
        }
      />
    </div>
  );
}

/* ─── Package details strip → personal agent recommendation ────────────────── */

const STRIP = { x: 200, y: 340, w: 500, h: 600, gap: 28 };
const cardX = (i: number) => STRIP.x + i * (STRIP.w + STRIP.gap);
const cardCenter = (i: number) => ({ x: cardX(i) + STRIP.w / 2, y: STRIP.y + STRIP.h / 2 });
const HEAD = { x: STRIP.x, y: 150 };
const PHONE = { w: 393, h: 852, cx: cardX(4) + STRIP.w + 250 + 196 };
const PHONE_X = PHONE.cx - PHONE.w / 2;
const PHONE_Y = 540 - PHONE.h / 2;

/** Camera arrives on each card as its line is spoken. */
const CARD_AT = [40, 70, 100, 130, 160];
const PHONE_AT = 196;
const DRAFT = "Is there anything that actually works for acne scars? I have darker skin.";
const DRAFT_AT = 236;
const DRAFT_CPS = 40;
const SENT_AT = 300;
const TYPING_AT = 314;
const REPLY_AT = 340;
const CARD_IN = 364;
const TYPING2_AT = 398;
const ASK_AT = 420;
const YES = "Yes, book it";
const YES_AT = 436;
const YES_SENT = 456;
const DONE_TYPING = 468;
const DONE_AT = 484;
const BOOKED_AT = DONE_AT + 4;

const DETAILS_CAM = [
  { f: 0, x: HEAD.x + 520, y: HEAD.y + 60, s: 1.7 },
  { f: 26, x: 960, y: 560, s: 1 },
  ...CARD_AT.map((f, i) => ({ f, ...cardCenter(i), y: cardCenter(i).y - 10, s: 1.32 })),
  { f: CARD_AT[4] + 14, ...cardCenter(4), y: cardCenter(4).y - 10, s: 1.34 },
  { f: PHONE_AT + 30, x: PHONE.cx - 260, y: 540, s: 0.94 },
  { f: DRAFT_AT + 4, x: PHONE.cx, y: 700, s: 1.5 },
  { f: SENT_AT + 6, x: PHONE.cx, y: 690, s: 1.5 },
  { f: CARD_IN + 18, x: PHONE.cx, y: 560, s: 1.62 },
  { f: YES_AT, x: PHONE.cx, y: 640, s: 1.52 },
  { f: BOOKED_AT + 8, x: PHONE.cx, y: 590, s: 1.6 },
  { f: SECTION_FRAMES - DETAILS_FROM, x: PHONE.cx, y: 560, s: 1.42 },
];

function DetailsScene() {
  const frame = useCurrentFrame();
  const cam = camState(frame, DETAILS_CAM);
  const arrive = ramp(frame, 0, 20, EASE_OUT);
  const draft = frame < SENT_AT ? typed(DRAFT, frame, DRAFT_AT, DRAFT_CPS) : frame >= YES_AT && frame < YES_SENT ? typed(YES, frame, YES_AT, 20) : "";
  const composing = (frame >= DRAFT_AT - 10 && frame < SENT_AT) || (frame >= YES_AT - 8 && frame < YES_SENT);
  const sendPress = Math.max(pulse(frame, SENT_AT - 4, 3, 6), pulse(frame, YES_SENT - 4, 3, 6));
  const built = (i: number) => frame >= CARD_AT[i] - 14;

  return (
    <AbsoluteFill style={{ opacity: arrive, filter: arrive < 1 ? `blur(${((1 - arrive) * 12).toFixed(2)}px)` : undefined }}>
      <div style={camStyle(cam)}>
        <div style={{ position: "absolute", left: HEAD.x, top: HEAD.y, width: cardX(4) + STRIP.w - STRIP.x, display: "flex", alignItems: "center", gap: 18 }}>
          <span style={title(104, { lineHeight: "116px", letterSpacing: "-0.03em" })}>{NAME}</span>
          <div style={{ marginLeft: 18, ...fly(frame, { at: 14, x: -12, y: 0, dur: 16, blur: 0 }) }}>
            <Pill tone="sage" height={46} lead={<div style={{ width: 9, height: 9, borderRadius: 99, background: SAGE_TEXT }} />} style={{ fontFamily: F.ui, fontSize: 17 }}>
              Published
            </Pill>
          </div>
          <div style={fly(frame, { at: 18, x: -12, y: 0, dur: 16, blur: 0 })}>
            <Pill tone="paper" height={46} lead={<Icon name="mapPin" size={17} />} style={{ fontFamily: F.ui, fontSize: 17 }}>
              {CLINIC.name}
            </Pill>
          </div>
        </div>
        <DetailCard index={0} frame={frame} heading="What’s included" built={built(0)}>
          <Included frame={frame} at={CARD_AT[0] - 10} />
        </DetailCard>
        <DetailCard index={1} frame={frame} heading="Who it’s for" built={built(1)}>
          <WhoFor frame={frame} at={CARD_AT[1] - 10} />
        </DetailCard>
        <DetailCard index={2} frame={frame} heading="Pricing" built={built(2)}>
          <Pricing frame={frame} at={CARD_AT[2] - 10} />
        </DetailCard>
        <DetailCard index={3} frame={frame} heading="Providers" built={built(3)}>
          <Providers frame={frame} at={CARD_AT[3] - 10} />
        </DetailCard>
        <DetailCard index={4} frame={frame} heading="Availability" built={built(4)}>
          <Availability frame={frame} at={CARD_AT[4] - 10} />
        </DetailCard>
        <div style={{ position: "absolute", left: PHONE_X, top: PHONE_Y, ...fly(frame, { at: PHONE_AT, y: 60, scale: 0.96, dur: 26, blur: 8 }) }}>
          <IPhone frame={frame} width={PHONE.w} height={PHONE.h} draft={draft} composing={composing} sendPress={sendPress}>
            <Slot frame={frame} at={PHONE_AT + 10} side="center">
              <TimeStamp day="Today" time="8:12 PM" />
            </Slot>
            <Slot frame={frame} at={SENT_AT} side="out" dur={16}>
              <Bubble out>{DRAFT}</Bubble>
            </Slot>
            <Slot frame={frame} at={TYPING_AT} until={REPLY_AT} side="in" dur={12}>
              <TypingBubble frame={frame} />
            </Slot>
            <Slot frame={frame} at={REPLY_AT} side="in" dur={18}>
              <Bubble>{CLINIC.name} in Yorkville built a program for exactly this.</Bubble>
            </Slot>
            <Slot frame={frame} at={CARD_IN} side="in" dur={22}>
              <ThreadPackage frame={frame} />
            </Slot>
            <Slot frame={frame} at={TYPING2_AT} until={ASK_AT} side="in" dur={12}>
              <TypingBubble frame={frame} />
            </Slot>
            <Slot frame={frame} at={ASK_AT} side="in" dur={18}>
              <Bubble>Dr. Okafor has an opening Tue, Nov 3. Want me to book the consult?</Bubble>
            </Slot>
            <Slot frame={frame} at={YES_SENT} side="out" dur={14}>
              <Bubble out>{YES}</Bubble>
            </Slot>
            <Slot frame={frame} at={DONE_TYPING} until={DONE_AT} side="in" dur={12}>
              <TypingBubble frame={frame} />
            </Slot>
            <Slot frame={frame} at={DONE_AT} side="in" dur={18}>
              <Bubble>Booked for Tue, Nov 3 at 9:00 AM.</Bubble>
            </Slot>
          </IPhone>
        </div>
      </div>
    </AbsoluteFill>
  );
}

function DetailCard({ index, frame, heading, built, children }: { index: number; frame: number; heading: string; built: boolean; children: ReactNode }) {
  return (
    <div
      style={{
        position: "absolute",
        left: cardX(index),
        top: STRIP.y,
        width: STRIP.w,
        height: STRIP.h,
        boxSizing: "border-box",
        padding: 28,
        borderRadius: 34,
        background: C.paper,
        display: "flex",
        flexDirection: "column",
        gap: 24,
        ...fly(frame, { at: 6 + index * 4, y: 40, dur: 24, blur: 0 }),
      }}
    >
      <span style={title(38)}>{heading}</span>
      {built ? children : null}
    </div>
  );
}

const rise = (frame: number, at: number, y = 12): CSSProperties => fly(frame, { at, y, dur: 16, blur: 0 });

function Included({ frame, at }: { frame: number; at: number }) {
  const items = [
    { name: "RF Microneedling", count: 3, hue: C.salmon },
    { name: "Subcision", count: 1, hue: SAGE },
    { name: "TCA CROSS", count: 2, hue: C.sand2 },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {items.map((item, i) => (
        <div key={item.name} style={{ height: 92, boxSizing: "border-box", padding: "0 20px", borderRadius: 20, background: C.beige, display: "flex", alignItems: "center", gap: 14, ...rise(frame, at + i * 4) }}>
          <span style={{ flex: 1, ...ui(20, 600) }}>{item.name}</span>
          <SessionTrack runs={[{ hue: item.hue, count: item.count }]} size={18} gap={5} reveal={ramp(frame, at + 6 + i * 4, 14)} />
          <span style={{ width: 38, textAlign: "right", ...title(26) }}>×{item.count}</span>
        </div>
      ))}
      <div style={{ height: 92, boxSizing: "border-box", padding: "0 20px", borderRadius: 20, border: `1px solid ${C.line2}`, display: "flex", alignItems: "center", gap: 14, ...rise(frame, at + 12) }}>
        <Icon name="heart" size={20} />
        <span style={{ flex: 1, ...ui(20, 600) }}>Aftercare kit</span>
        <Pill tone="sage" height={32} style={{ fontSize: 14 }}>
          Included
        </Pill>
      </div>
    </div>
  );
}

function WhoFor({ frame, at }: { frame: number; at: number }) {
  const concerns = ["Rolling scars", "Boxcar scars", "Ice pick scars", "Post-acne marks"];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {concerns.map((c, i) => (
          <div key={c} style={rise(frame, at + i * 3, 8)}>
            <Pill tone={i === 0 ? "salmon" : "beige"} height={44} style={{ fontFamily: F.ui, fontSize: 17 }}>
              {c}
            </Pill>
          </div>
        ))}
      </div>
      <div style={{ padding: "20px 22px", borderRadius: 22, background: C.beige, display: "flex", flexDirection: "column", gap: 16, ...rise(frame, at + 12) }}>
        <span style={ui(17, 600)}>Skin types</span>
        <SkinScale on={(i) => ramp(frame, at + 16 + i * 3, 10, EASE_OUT)} size={52} gap={13} labels />
      </div>
      <div style={{ display: "flex", gap: 8, ...rise(frame, at + 22) }}>
        <Pill tone="outline" height={42} style={{ fontFamily: F.ui, fontSize: 16 }}>
          Ages 18+
        </Pill>
        <Pill tone="outline" height={42} style={{ fontFamily: F.ui, fontSize: 16 }}>
          No active breakouts
        </Pill>
      </div>
    </div>
  );
}

function Pricing({ frame, at }: { frame: number; at: number }) {
  const count = ramp(frame, at, 22, EASE_OUT);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, flex: 1 }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
        <span style={title(112, { lineHeight: "112px", letterSpacing: "-0.035em", fontVariantNumeric: "tabular-nums" })}>{money(1950 * count)}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, ...rise(frame, at + 12) }}>
        <span style={{ ...ui(22, 500, { color: SUB }), textDecoration: "line-through" }}>$2,330</span>
        <Pill tone="salmon" height={36} style={{ fontFamily: F.ui, fontSize: 16 }}>
          Save $380
        </Pill>
      </div>
      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 10, ...rise(frame, at + 16) }}>
        {[
          ["Pay in full", "$1,950"],
          ["3 payments", "$650 / mo"],
        ].map(([label, value], i) => (
          <div key={label} style={{ height: 70, boxSizing: "border-box", padding: "0 22px", borderRadius: 20, background: i === 0 ? C.ink : C.beige, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={ui(19, 600, { color: i === 0 ? C.paper : C.walnut })}>{label}</span>
            <span style={title(26, { color: i === 0 ? C.paper : C.walnut })}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Providers({ frame, at }: { frame: number; at: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {[
        { person: OKAFOR, tags: ["Skin of colour", "Scar revision"] },
        { person: KIM, tags: ["RF Microneedling"] },
      ].map(({ person, tags }, i) => (
        <div key={person.name} style={{ boxSizing: "border-box", padding: 18, borderRadius: 22, background: C.beige, display: "flex", flexDirection: "column", gap: 16, ...rise(frame, at + i * 6) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Initials person={person} size={60} />
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={title(28)}>{person.name}</span>
              <span style={ui(16, 500, { color: SUB })}>{person.role}</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {tags.map((tag, k) => (
              <Pill key={tag} tone={k === 0 && i === 0 ? "sage" : "paper"} height={34} style={{ fontFamily: F.ui, fontSize: 15 }}>
                {tag}
              </Pill>
            ))}
          </div>
        </div>
      ))}
      <div style={{ height: 56, boxSizing: "border-box", borderRadius: 18, border: "1.5px dashed rgba(40, 25, 16, 0.22)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, ...ui(16, 500, { color: SUB }), ...rise(frame, at + 12) }}>
        <Icon name="plus" size={15} color={SUB} />
        Add provider
      </div>
    </div>
  );
}

const NOV_OPEN = new Set([3, 4, 6, 10, 12, 13, 17, 19, 24, 26]);

function Availability({ frame, at }: { frame: number; at: number }) {
  const days = Array.from({ length: 35 }, (_, i) => i + 1);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", ...rise(frame, at, 8) }}>
        <span style={ui(19, 600)}>November</span>
        <div style={{ display: "flex", gap: 6 }}>
          <RoundButton icon="chevronLeft" size={34} />
          <RoundButton icon="chevronRight" size={34} />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={i} style={{ textAlign: "center", ...body(13) }}>
            {d}
          </span>
        ))}
        {days.map((d, i) => {
          const valid = d >= 1 && d <= 30;
          const open = valid && NOV_OPEN.has(d);
          const first = d === 3;
          const p = ramp(frame, at + 4 + i * 0.6, 10, EASE_OUT);
          return (
            <div
              key={i}
              style={{
                height: 50,
                borderRadius: 14,
                background: first ? C.ink : open ? C.salmon : valid ? C.beige : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: p,
                ...ui(16, first || open ? 600 : 500, { color: first ? C.paper : valid ? C.walnut : "transparent" }),
              }}
            >
              {valid ? d : ""}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: "auto", ...rise(frame, at + 24) }}>
        <Pill tone="beige" height={50} lead={<Icon name="calendar" size={18} />} style={{ fontFamily: F.ui, fontSize: 17 }}>
          First opening Tue, Nov 3
        </Pill>
      </div>
    </div>
  );
}

/** The package as the patient's agent shows it in the thread. */
function ThreadPackage({ frame }: { frame: number }) {
  const booked = ramp(frame, BOOKED_AT, 12, EASE_IN_OUT);
  return (
    <div style={{ width: 272, boxSizing: "border-box", padding: 12, borderRadius: 22, background: C.beige, display: "flex", flexDirection: "column", gap: 10, fontFamily: F.ui }}>
      <div style={{ height: 70, borderRadius: 14, background: C.paper, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <SessionTrack
          runs={[
            { hue: C.salmon, count: 3 },
            { hue: SAGE, count: 1 },
            { hue: C.sand2, count: 2 },
          ]}
          size={16}
          gap={5}
          reveal={ramp(frame, CARD_IN + 10, 16)}
        />
      </div>
      <div style={{ padding: "2px 2px 0", display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={title(26, { lineHeight: "30px" })}>{NAME}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 500, color: SUB }}>
          <Icon name="mapPin" size={12} color={SUB} />
          {CLINIC.name} · {CLINIC.area}
        </span>
      </div>
      <div style={{ padding: "9px 12px", borderRadius: 14, background: C.paper, display: "flex", flexDirection: "column", gap: 6 }}>
        {[
          ["RF Microneedling", "×3"],
          ["Subcision", "×1"],
          ["TCA CROSS", "×2"],
        ].map(([label, value]) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 500, color: SUB }}>
            <span>{label}</span>
            <span style={{ color: C.walnut }}>{value}</span>
          </div>
        ))}
        <div style={{ height: 1, background: C.line }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 600, color: C.walnut }}>
          <span>Program</span>
          <span>$1,950</span>
        </div>
      </div>
      <div style={{ height: 40, borderRadius: 999, background: booked > 0.5 ? SAGE : C.ink, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 14, color: booked > 0.5 ? SAGE_TEXT : C.paper }}>
        <Swap
          t={booked}
          from={<>Book a consult</>}
          to={
            <>
              <Icon name="check" size={15} color={SAGE_TEXT} stroke={2.8} />
              Consult booked · Nov 3
            </>
          }
        />
      </div>
    </div>
  );
}
