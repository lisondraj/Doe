import { type CSSProperties, type ReactNode } from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";

import { DotTide, Stage } from "./backdrops";
import { Bubble, IPhone, Slot, TimeStamp, TypingBubble } from "./imessage";
import { CAMERA_EASE, EASE_IN_OUT, EASE_OUT, camera, keys, lerp, pulse, ramp, typed, type CameraKey } from "./motion";
import { C, F } from "./theme";
import { AppShell, ClickRing, Cursor, Icon, ShadowsContext, type IconName } from "./ui";

export const VIDEO3_PAYMENTS_FRAMES = 558;

export function Video3Payments() {
  return (
    <ShadowsContext.Provider value={false}>
      <Audio src={staticFile("video1/THREE.m4a")} volume={0.7} />
      <Audio src={staticFile("video1/BED.m4a")} startFrom={1230} volume={0.2} />
      <Stage backdrop={<DotTide />}>
        <PaymentsFilm />
      </Stage>
    </ShadowsContext.Provider>
  );
}

/* ─── Timeline ─────────────────────────────────────────────────────────────── */

const ROW1_AT = 26;
const ROW2_AT = 32;
/** Both line amounts race up together; the balance pops in once they settle. */
const COUNT1_AT = 30;
const COUNT2_AT = 36;
const COUNT_DUR = 16;
const BALANCE_AT = 58;
const MIA_AT = 64;
const BUTTON_AT = 70;
const CLICK_AT = 104;
const SENT_AT = 108;
/** The charge tag leaves the button and the camera rides with it onto the zoomed phone. */
const FLIGHT_AT = 108;
const FLIGHT_DUR = 46;
const LAND_AT = FLIGHT_AT + FLIGHT_DUR;
const THREAD_AT = 132;
const ASK_ONE_AT = 140;
const INVOICE_AT = 152;
const ASK_TYPING_AT = 178;
const ASK_AT = 200;
const REPLY = "Yes, go ahead";
const REPLY_TYPE_AT = 228;
const REPLY_SENT_AT = 258;
const PAYING_AT = 272;
const PAID_AT = 294;
const DONE_TYPING_AT = 304;
const DONE_AT = 326;
/** Zoom-through seam: the phone keeps pushing in and blurs away as the payments shell settles in. */
const ZOOM_OUT_AT = 350;
const PAY_AT = 358;
const LEO_PAID_AT = PAY_AT + 70;
/** Leo's charge lands at the top of the table before the camera dives in for the status flip. */
const LEO_IN_AT = PAY_AT + 32;
/** The strip updates after the camera pulls back from Leo’s row. */
const STRIP_AT = LEO_PAID_AT + 70;
const END = VIDEO3_PAYMENTS_FRAMES;

/* ─── World layout ─────────────────────────────────────────────────────────── */

const PANEL = { x: 680, y: 210, w: 560 };
const BODY_H = 268;
const PANEL_H = 16 + 40 + 16 + BODY_H + 16;
const MIA_TOP = PANEL_H + 12;
const MIA_H = 68;
const BUTTON_TOP = MIA_TOP + MIA_H + 12;
const SEND = { x: PANEL.x + PANEL.w / 2, y: PANEL.y + BUTTON_TOP + 32 };
const TIP = { x: SEND.x + 120, y: SEND.y + 8 };
const PHONE = { x: 1780, y: 114, w: 393, h: 852 };
const PHONE_CX = PHONE.x + PHONE.w / 2;
const LAND = { x: PHONE.x + 25 + 136, y: 736 };

const WORLD_CAMS: CameraKey[] = [
  { f: 0, x: 960, y: 470, s: 1.3 },
  { f: FLIGHT_AT, x: 960, y: 500, s: 1.42 },
  { f: LAND_AT, x: PHONE_CX, y: 700, s: 1.75 },
  { f: PAYING_AT - 8, x: PHONE_CX, y: 700, s: 1.78 },
  { f: PAID_AT + 10, x: PHONE_CX - 30, y: 650, s: 2.15 },
  { f: DONE_TYPING_AT + 4, x: PHONE_CX - 30, y: 650, s: 2.15 },
  { f: DONE_AT + 18, x: PHONE_CX, y: 690, s: 1.8 },
  { f: ZOOM_OUT_AT, x: PHONE_CX, y: 690, s: 1.82 },
  { f: PAY_AT, x: PHONE_CX, y: 690, s: 2.6 },
];
const SHELL = { x: 240, y: 90 };
const PAGE = { w: 1364, h: 876 };
const TABLE_TOP = 322;
/** Leo's row, between Paid With and Status, in world coordinates. */
const LEO_FOCUS = { x: SHELL.x + 64 + 930, y: SHELL.y + 12 + TABLE_TOP + 8 + 40 + 46 };
/** Centre of "$1,240.00" over "Collected". */
const AMOUNT_FOCUS = { x: SHELL.x + 64 + 28 + 150, y: SHELL.y + 12 + 124 + 44 };
const PAY_CAMS: CameraKey[] = [
  { f: PAY_AT, x: 960, y: 540, s: 1 },
  { f: LEO_PAID_AT - 34, x: 950, y: 530, s: 1.06 },
  { f: LEO_PAID_AT - 4, x: LEO_FOCUS.x, y: LEO_FOCUS.y, s: 2.1 },
  { f: LEO_PAID_AT + 20, x: LEO_FOCUS.x + 8, y: LEO_FOCUS.y, s: 2.14 },
];
/** Leo's row → the amount in one arc: the focus glides across while the zoom eases out and back in, so it never stops midway. */
const ARC = { from: LEO_PAID_AT + 20, to: STRIP_AT - 2, dip: 0.36 };
const AMOUNT_CAMS: CameraKey[] = [
  { f: ARC.to, x: AMOUNT_FOCUS.x, y: AMOUNT_FOCUS.y, s: 2.5 },
  { f: END, x: AMOUNT_FOCUS.x + 4, y: AMOUNT_FOCUS.y, s: 2.62 },
];

function payCamera(frame: number): CSSProperties {
  if (frame <= ARC.from) return camera(frame, PAY_CAMS);
  if (frame >= ARC.to) return camera(frame, AMOUNT_CAMS);
  const a = PAY_CAMS[PAY_CAMS.length - 1];
  const b = AMOUNT_CAMS[0];
  const u = EASE_IN_OUT((frame - ARC.from) / (ARC.to - ARC.from));
  const x = lerp(a.x, b.x, u);
  const y = lerp(a.y, b.y, u);
  const sc = Math.exp(lerp(Math.log(a.s), Math.log(b.s), u)) * (1 - ARC.dip * Math.sin(Math.PI * u));
  return { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "0 0", transform: `translate(${(960 - x * sc).toFixed(3)}px, ${(540 - y * sc).toFixed(3)}px) scale(${sc.toFixed(5)})` };
}

const SOFT = "rgba(40, 25, 16, 0.08)";
const SUB = "rgba(40, 25, 16, 0.62)";
const SAGE = "#D6DEC6";
const SAGE_TEXT = "#2F3B2A";

const money = (n: number) => `${n < 0 ? "−" : ""}$${Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function rise(frame: number, at: number, { x = 0, y = 10, scale = 1, blur = 0, dur = 22 }: { x?: number; y?: number; scale?: number; blur?: number; dur?: number } = {}): CSSProperties {
  const p = ramp(frame, at, dur, EASE_OUT);
  return { opacity: p, transform: `translate(${(1 - p) * x}px, ${(1 - p) * y}px) scale(${lerp(scale, 1, p)})`, filter: blur > 0 && p < 1 ? `blur(${(1 - p) * blur}px)` : undefined };
}

function PaymentsFilm() {
  const frame = useCurrentFrame();
  const draft = frame < REPLY_SENT_AT ? typed(REPLY, frame, REPLY_TYPE_AT, 20) : "";

  const cursorX = keys(frame, [70, 100, 130], [1500, TIP.x, TIP.x + 40]);
  const cursorY = keys(frame, [70, 100, 130], [1020, TIP.y, TIP.y + 60]);
  const cursorOpacity = ramp(frame, 68, 8) * (1 - ramp(frame, 112, 10));

  const flight = ramp(frame, FLIGHT_AT, FLIGHT_DUR, CAMERA_EASE);
  const control = { x: (SEND.x + LAND.x) / 2, y: 380 };
  const tagX = (1 - flight) ** 2 * SEND.x + 2 * (1 - flight) * flight * control.x + flight ** 2 * LAND.x;
  const tagY = (1 - flight) ** 2 * SEND.y + 2 * (1 - flight) * flight * control.y + flight ** 2 * LAND.y;
  const tagOpacity = ramp(frame, FLIGHT_AT - 2, 6) * (1 - ramp(frame, LAND_AT - 2, 8));

  const leave = ramp(frame, ZOOM_OUT_AT + 2, 10, EASE_IN_OUT);
  const arrive = ramp(frame, PAY_AT - 4, 24, EASE_OUT);

  return (
    <AbsoluteFill style={{ opacity: ramp(frame, 0, 10) }}>
      {frame < PAY_AT + 6 ? (
        <AbsoluteFill style={{ opacity: 1 - leave, filter: leave > 0 ? `blur(${leave * 12}px)` : undefined }}>
          <div style={camera(frame, WORLD_CAMS)}>
            {frame < LAND_AT + 10 ? <ChargePanel frame={frame} /> : null}
            {frame >= FLIGHT_AT ? (
              <div style={{ position: "absolute", left: PHONE.x, top: PHONE.y }}>
                <IPhone frame={frame} width={PHONE.w} height={PHONE.h} draft={draft} composing={frame >= REPLY_TYPE_AT - 10 && frame < REPLY_SENT_AT} sendPress={pulse(frame, REPLY_SENT_AT - 4, 3, 6)}>
                  <Thread frame={frame} />
                </IPhone>
              </div>
            ) : null}
            {tagOpacity > 0 ? (
              <div style={{ position: "absolute", left: tagX, top: tagY, opacity: tagOpacity, transform: `translate(-50%, -50%) scale(${lerp(1, 0.7, flight) * lerp(0.7, 1, ramp(frame, FLIGHT_AT - 2, 8))})` }}>
                <ChargeTag />
              </div>
            ) : null}
            {frame < LAND_AT ? <ClickRing x={TIP.x} y={TIP.y} progress={ramp(frame, CLICK_AT + 1, 16)} /> : null}
            {cursorOpacity > 0 ? (
              <div style={{ opacity: cursorOpacity }}>
                <Cursor x={cursorX} y={cursorY} pressed={pulse(frame, CLICK_AT - 2, 3, 8)} />
              </div>
            ) : null}
          </div>
        </AbsoluteFill>
      ) : null}
      {frame >= PAY_AT - 4 ? (
        <AbsoluteFill style={{ opacity: arrive, filter: arrive < 1 ? `blur(${(1 - arrive) * 10}px)` : undefined, transform: `scale(${lerp(1.06, 1, arrive)})` }}>
          <div style={payCamera(frame)}>
            <div style={{ position: "absolute", left: SHELL.x, top: SHELL.y }}>
              <AppShell plain active={2} railReveal={(i) => ramp(frame, PAY_AT + 6 + i * 3, 12)}>
                <PaymentsPage frame={frame} />
              </AppShell>
            </div>
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
}

/* ─── Charge panel (Handled-style: white surface, grey body, white lines) ──── */

const LINES = [
  { label: "Ear Tube Consult", tag: "CPT 99244", amount: 245, at: ROW1_AT, count: COUNT1_AT },
  { label: "Harbor Mutual", tag: "In-Network", amount: -205, at: ROW2_AT, count: COUNT2_AT },
];
const LINES_TOP = 84;
const LINE_H = 58;
const TOTAL_TOP = LINES_TOP + LINES.length * LINE_H + 4;

function ChargePanel({ frame }: { frame: number }) {
  const balance = ramp(frame, BALANCE_AT, 14, EASE_IN_OUT);
  const sent = ramp(frame, SENT_AT, 10);
  const press = pulse(frame, CLICK_AT - 2, 3, 9);

  return (
    <div style={{ position: "absolute", left: PANEL.x, top: PANEL.y, width: PANEL.w }}>
      <div style={{ width: PANEL.w, height: PANEL_H, boxSizing: "border-box", padding: 16, borderRadius: 28, background: C.paper, display: "flex", flexDirection: "column", gap: 16, ...rise(frame, 2, { y: 24, scale: 0.98, blur: 4, dur: 26 }) }}>
        <div style={{ height: 40, display: "flex", alignItems: "center", gap: 10, ...rise(frame, 6) }}>
          <SearchField />
          <CircleButton icon="doc" />
          <PillButton icon="plus">Add Item</PillButton>
        </div>
        <div style={{ position: "relative", height: BODY_H, borderRadius: 20, background: C.beige, ...rise(frame, 8, { y: 16, dur: 24 }) }}>
          <div style={{ position: "absolute", left: 16, top: 16, fontFamily: F.display, fontWeight: 500, fontSize: 50, lineHeight: "56px", letterSpacing: "-0.025em", color: C.walnut, ...rise(frame, 12) }}>Leo Jacobs</div>
          <div style={{ position: "absolute", left: 8, right: 8, top: LINES_TOP, height: LINES.length * LINE_H, borderRadius: 14, background: C.paper, ...rise(frame, ROW1_AT, { y: 12 }) }}>
            {LINES.map((line, i) => (
              <div
                key={line.label}
                style={{ height: LINE_H, boxSizing: "border-box", margin: "0 16px", borderTop: i > 0 ? `1px solid ${C.line}` : undefined, display: "flex", alignItems: "center", gap: 10, ...rise(frame, line.at, { y: 8, dur: 18 }) }}
              >
                <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 16, color: C.walnut }}>{line.label}</span>
                <OutlineTag>{line.tag}</OutlineTag>
                <span style={{ flex: 1 }} />
                <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 17, color: C.walnut, fontVariantNumeric: "tabular-nums" }}>{money(line.amount * ramp(frame, line.count, COUNT_DUR, EASE_OUT))}</span>
              </div>
            ))}
          </div>
          <div style={{ position: "absolute", left: 8, right: 8, top: TOTAL_TOP, height: 60, boxSizing: "border-box", padding: "0 16px", display: "flex", alignItems: "center", ...rise(frame, ROW2_AT + 4) }}>
            <span style={{ flex: 1, fontFamily: F.ui, fontWeight: 600, fontSize: 17, color: C.walnut }}>Balance Due</span>
            <span style={{ fontFamily: F.display, fontWeight: 500, fontSize: 40, lineHeight: "48px", letterSpacing: "-0.02em", color: C.walnut, fontVariantNumeric: "tabular-nums", opacity: balance, transform: `translateY(${(1 - balance) * 8}px)` }}>
              $40.00
            </span>
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: MIA_TOP,
          width: PANEL.w,
          height: MIA_H,
          boxSizing: "border-box",
          padding: "0 16px 0 14px",
          borderRadius: 22,
          background: C.paper,
          display: "flex",
          alignItems: "center",
          gap: 14,
          ...rise(frame, MIA_AT, { y: 14 }),
        }}
      >
        <div style={{ width: 44, height: 44, flexShrink: 0, borderRadius: 999, background: C.salmon }} />
        <span style={{ flex: 1, fontFamily: F.ui, fontWeight: 600, fontSize: 17, lineHeight: "20px", color: C.walnut }}>Sending to Mia Jacobs</span>
        <PillButton tone="soft" icon="chevronDown">
          Change
        </PillButton>
      </div>
      <div style={{ position: "absolute", left: 0, top: BUTTON_TOP, width: PANEL.w, height: 64, ...rise(frame, BUTTON_AT, { y: 14 }) }}>
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            borderRadius: 999,
            background: C.ink,
            transform: `scale(${1 - 0.03 * press})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: F.ui,
            fontWeight: 600,
            fontSize: 20,
            color: C.paper,
          }}
        >
          <span style={{ position: "absolute", display: "flex", alignItems: "center", gap: 10, opacity: 1 - sent }}>
            Send Charge to Agent
            <Icon name="arrowRight" size={20} color={C.paper} stroke={2.2} />
          </span>
          <span style={{ position: "absolute", display: "flex", alignItems: "center", gap: 10, opacity: sent, transform: `translateY(${(1 - sent) * 8}px)` }}>
            <Icon name="check" size={20} color={C.paper} stroke={2.6} />
            Sent to Agent
          </span>
        </div>
      </div>
    </div>
  );
}

function SearchField() {
  return (
    <div style={{ flex: 1, height: 38, boxSizing: "border-box", padding: "0 6px 0 14px", borderRadius: 999, background: SOFT, display: "flex", alignItems: "center", gap: 9 }}>
      <Icon name="search" size={15} color={SUB} stroke={2} />
      <span style={{ flex: 1, fontFamily: F.body, fontWeight: 500, fontSize: 13, color: SUB }}>Search codes or services</span>
      <span style={{ height: 26, padding: "0 9px", borderRadius: 999, background: C.paper, display: "flex", alignItems: "center", fontFamily: F.body, fontWeight: 500, fontSize: 12, color: SUB }}>⌘K</span>
    </div>
  );
}

function OutlineTag({ children, small }: { children: ReactNode; small?: boolean }) {
  return (
    <span
      style={{
        height: small ? 20 : 24,
        boxSizing: "border-box",
        padding: small ? "0 7px" : "0 9px",
        borderRadius: small ? 6 : 8,
        border: "1px solid rgba(40, 25, 16, 0.2)",
        display: "inline-flex",
        alignItems: "center",
        fontFamily: F.body,
        fontWeight: 500,
        fontSize: small ? 10.5 : 12,
        color: SUB,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

function CircleButton({ icon }: { icon: IconName }) {
  return (
    <div style={{ width: 38, height: 38, flexShrink: 0, borderRadius: 999, background: SOFT, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Icon name={icon} size={16} color={C.ink} stroke={2} />
    </div>
  );
}

function PillButton({ icon, tone = "ink", children }: { icon?: IconName; tone?: "ink" | "soft" | "paper"; children: ReactNode }) {
  const tones = { ink: { background: C.ink, color: C.paper }, soft: { background: SOFT, color: C.walnut }, paper: { background: C.paper, color: C.walnut } };
  return (
    <div
      style={{
        height: 38,
        flexShrink: 0,
        padding: icon === "plus" ? "0 16px 0 13px" : "0 16px",
        display: "flex",
        alignItems: "center",
        gap: 7,
        borderRadius: 999,
        fontFamily: F.body,
        fontWeight: 500,
        fontSize: 13,
        whiteSpace: "nowrap",
        ...tones[tone],
      }}
    >
      {icon === "plus" ? <Icon name="plus" size={14} color={tones[tone].color} stroke={2.2} /> : null}
      {children}
      {icon === "chevronDown" ? <Icon name="chevronDown" size={12} color={tones[tone].color} /> : null}
    </div>
  );
}

function ChargeTag() {
  return (
    <div style={{ height: 48, padding: "0 20px 0 16px", borderRadius: 999, background: C.paper, display: "flex", alignItems: "center", gap: 10, fontFamily: F.ui, fontWeight: 600, fontSize: 19, color: C.walnut, whiteSpace: "nowrap" }}>
      <Icon name="doc" size={20} />
      Leo Jacobs · $40.00
    </div>
  );
}

/* ─── iMessage with Mia's agent ────────────────────────────────────────────── */

function Thread({ frame }: { frame: number }) {
  return (
    <>
      <Slot frame={frame} at={THREAD_AT} side="center">
        <TimeStamp day="Today" time="2:14 PM" />
      </Slot>
      <Slot frame={frame} at={ASK_ONE_AT} side="in" dur={20}>
        <Bubble>Atlantic Pediatric ENT sent a charge for Leo’s visit on Wed, Oct 14.</Bubble>
      </Slot>
      <Slot frame={frame} at={INVOICE_AT} side="in" dur={22}>
        <InvoiceCard frame={frame} />
      </Slot>
      <Slot frame={frame} at={ASK_TYPING_AT} until={ASK_AT} side="in" dur={14}>
        <TypingBubble frame={frame} />
      </Slot>
      <Slot frame={frame} at={ASK_AT} side="in" dur={20}>
        <Bubble>It matches your Harbor Mutual estimate. Want me to pay it with your HSA card?</Bubble>
      </Slot>
      <Slot frame={frame} at={REPLY_SENT_AT} side="out" dur={16}>
        <Bubble out>{REPLY}</Bubble>
      </Slot>
      <Slot frame={frame} at={DONE_TYPING_AT} until={DONE_AT} side="in" dur={14}>
        <TypingBubble frame={frame} />
      </Slot>
      <Slot frame={frame} at={DONE_AT} side="in" dur={20}>
        <Bubble>Done. Paid $40.00 with your HSA card •••• 4417 and saved the receipt to Leo’s records.</Bubble>
      </Slot>
    </>
  );
}

function InvoiceCard({ frame }: { frame: number }) {
  const paying = frame >= PAYING_AT && frame < PAID_AT;
  const paid = ramp(frame, PAID_AT, 10);
  const spin = (frame * 18) % 360;

  return (
    <div style={{ width: 272, boxSizing: "border-box", padding: 12, borderRadius: 22, background: C.beige, display: "flex", flexDirection: "column", gap: 10, fontFamily: F.ui }}>
      <span style={{ padding: "4px 2px 2px", fontFamily: F.display, fontWeight: 500, fontSize: 36, lineHeight: "40px", letterSpacing: "-0.02em", color: C.walnut }}>Leo Jacobs</span>
      <div style={{ padding: "8px 12px", borderRadius: 14, background: C.paper, display: "flex", flexDirection: "column", gap: 5 }}>
        <InvoiceLine label="Consult" value="$245.00" />
        <InvoiceLine label="Harbor Mutual" value="−$205.00" />
        <div style={{ height: 1, background: C.line }} />
        <InvoiceLine label="You Owe" value="$40.00" strong />
      </div>
      <div style={{ position: "relative", height: 40 }}>
        <PayButton style={{ background: C.ink, color: C.paper, opacity: 1 - paid }}>
          {paying ? (
            <>
              <svg width={14} height={14} viewBox="0 0 14 14" style={{ transform: `rotate(${spin}deg)` }}>
                <path d="M7 1.5a5.5 5.5 0 1 1-5.5 5.5" fill="none" stroke={C.paper} strokeWidth={2} strokeLinecap="round" />
              </svg>
              Paying…
            </>
          ) : (
            "Pay $40.00"
          )}
        </PayButton>
        <PayButton style={{ position: "absolute", inset: 0, background: C.live, color: "#FFF", opacity: paid, transform: `scale(${lerp(0.94, 1, paid) + 0.04 * pulse(frame, PAID_AT + 6, 4, 12)})` }}>
          <Icon name="check" size={15} color="#FFF" stroke={2.8} />
          Paid with HSA •••• 4417
        </PayButton>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, fontFamily: F.body, fontSize: 10.5, color: C.muted }}>
        <Icon name="lock" size={11} color={C.muted} stroke={2} />
        Secured by Doe
      </div>
    </div>
  );
}

function InvoiceLine({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: strong ? 600 : 500, color: strong ? C.walnut : C.muted, fontVariantNumeric: "tabular-nums" }}>
      <span>{label}</span>
      <span style={{ color: C.walnut }}>{value}</span>
    </div>
  );
}

function PayButton({ style, children }: { style: CSSProperties; children: ReactNode }) {
  return <div style={{ height: 40, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontWeight: 600, fontSize: 14, ...style }}>{children}</div>;
}

/* ─── Payments page (Doe shell · Paper Triage 01 table) ────────────────────── */

type PayStatus = "paid" | "sent" | "waiting";

const PAY_ROWS: { date: string; name: string; service: string; clinician: string; amount: string; method: string; status: PayStatus }[] = [
  { date: "Oct 14", name: "Leo Jacobs", service: "Ear Tube Consult", clinician: "Dr. Alvarez", amount: "$40.00", method: "HSA •••• 4417", status: "sent" },
  { date: "Oct 13", name: "Ava Thompson", service: "Hearing Test", clinician: "Dr. Lin", amount: "$65.00", method: "Visa •••• 2290", status: "paid" },
  { date: "Oct 13", name: "Noah Kim", service: "Follow-Up Visit", clinician: "Dr. Patel", amount: "$25.00", method: "HSA •••• 0912", status: "paid" },
  { date: "Oct 12", name: "Grace Patel", service: "Allergy Panel", clinician: "Dr. Alvarez", amount: "$120.00", method: "Amex •••• 3005", status: "paid" },
  { date: "Oct 12", name: "Henry Walsh", service: "Sinus CT", clinician: "Dr. Lin", amount: "$310.00", method: "—", status: "waiting" },
  { date: "Oct 11", name: "Maya Chen", service: "Hearing Aid Fitting", clinician: "Dr. Patel", amount: "$85.00", method: "—", status: "sent" },
  { date: "Oct 11", name: "Daniel Okafor", service: "Ear Cleaning", clinician: "Dr. Alvarez", amount: "$30.00", method: "Visa •••• 7731", status: "paid" },
  { date: "Oct 10", name: "Priya Raman", service: "Tympanometry", clinician: "Dr. Lin", amount: "$45.00", method: "HSA •••• 5520", status: "paid" },
  { date: "Oct 10", name: "Tom Halvorsen", service: "Follow-Up Visit", clinician: "Dr. Patel", amount: "$25.00", method: "Visa •••• 1184", status: "paid" },
];

const PILL: Record<PayStatus, { label: string; background: string; color: string }> = {
  paid: { label: "Paid by Agent", background: SAGE, color: SAGE_TEXT },
  sent: { label: "Sent to Agent", background: C.salmon, color: C.ink },
  waiting: { label: "Awaiting Approval", background: SOFT, color: C.walnut },
};

const COLS = { date: 64, name: 190, clinician: 120, amount: 96, method: 170, status: 168 };

function PaymentsPage({ frame }: { frame: number }) {
  const at = (offset: number) => PAY_AT - 6 + offset;
  const leo = ramp(frame, LEO_PAID_AT, 14, EASE_OUT);

  return (
    <>
      <PageLines />
      <div style={{ position: "absolute", left: 28, top: 32, fontFamily: F.display, fontWeight: 500, fontSize: 56, lineHeight: "62px", letterSpacing: "-0.03em", color: C.walnut, ...rise(frame, at(8), { y: 14 }) }}>Payments</div>
      <div style={{ position: "absolute", right: 28, top: 44, display: "flex", gap: 10, ...rise(frame, at(10)) }}>
        <PillButton tone="soft" icon="chevronDown">
          This Week
        </PillButton>
        <PillButton tone="soft">Export</PillButton>
        <PillButton icon="plus">New Charge</PillButton>
      </div>
      <PayStrip frame={frame} at={at(12)} />
      <div style={{ position: "absolute", left: 28, top: 268, width: PAGE.w - 56, height: 38, display: "flex", alignItems: "center", gap: 10, ...rise(frame, at(18)) }}>
        <div style={{ display: "flex", padding: 3, gap: 2, borderRadius: 999, background: C.beige }}>
          {["All", "Paid", "Pending"].map((label, i) => (
            <div
              key={label}
              style={{ height: 32, padding: "0 16px", display: "flex", alignItems: "center", borderRadius: 999, background: i === 0 ? C.paper : undefined, fontFamily: F.body, fontWeight: 500, fontSize: 13, color: i === 0 ? C.ink : SUB }}
            >
              {label}
            </div>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <CircleButton icon="search" />
        <PillButton tone="soft" icon="chevronDown">
          All Clinicians
        </PillButton>
      </div>
      <div
        style={{
          position: "absolute",
          left: 28,
          top: TABLE_TOP,
          width: PAGE.w - 56,
          height: PAGE.h - TABLE_TOP + 40,
          boxSizing: "border-box",
          padding: "8px 8px 0",
          borderRadius: 18,
          background: C.beige,
          display: "flex",
          flexDirection: "column",
          ...rise(frame, at(20), { y: 22, scale: 0.99, dur: 28 }),
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 16px 10px", fontFamily: F.body, fontSize: 13, lineHeight: "18px", color: SUB, ...rise(frame, at(24), { y: 6 }) }}>
          <div style={{ width: COLS.date, flexShrink: 0 }}>Date</div>
          <div style={{ width: COLS.name, flexShrink: 0 }}>Patient</div>
          <div style={{ flex: 1, minWidth: 0 }}>Service</div>
          <div style={{ width: COLS.clinician, flexShrink: 0 }}>Clinician</div>
          <div style={{ width: COLS.amount, flexShrink: 0 }}>Amount</div>
          <div style={{ width: COLS.method, flexShrink: 0 }}>Paid With</div>
          <div style={{ width: COLS.status, flexShrink: 0 }}>Status</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {PAY_ROWS.map((row, i) => {
            const isLeo = i === 0;
            const insert = ramp(frame, LEO_IN_AT, 16, EASE_IN_OUT);
            const enter = isLeo ? { height: 62 * insert, marginBottom: -4 * (1 - insert), opacity: ramp(frame, LEO_IN_AT + 6, 12), overflow: "hidden" as const } : rise(frame, at(26 + i * 2), { y: 12 });
            return (
              <div key={row.name} style={{ height: 62, flexShrink: 0, display: "flex", alignItems: "center", gap: 16, padding: "0 16px", borderRadius: 12, background: C.paper, ...enter }}>
                <div style={{ width: COLS.date, flexShrink: 0, fontFamily: F.ui, fontWeight: 500, fontSize: 16, lineHeight: "20px", color: C.walnut }}>{row.date}</div>
                <div style={{ width: COLS.name, flexShrink: 0, fontFamily: F.ui, fontWeight: isLeo ? 500 : 400, fontSize: 17, lineHeight: "22px", letterSpacing: "-0.02em", color: isLeo ? C.walnut : C.ink }}>{row.name}</div>
                <div style={{ flex: 1, minWidth: 0, fontFamily: F.body, fontSize: 15, lineHeight: "20px", color: "rgba(40, 25, 16, 0.78)" }}>{row.service}</div>
                <div style={{ width: COLS.clinician, flexShrink: 0, fontFamily: F.body, fontSize: 15, lineHeight: "20px", color: SUB }}>{row.clinician}</div>
                <div style={{ width: COLS.amount, flexShrink: 0, fontFamily: F.ui, fontWeight: 500, fontSize: 16, lineHeight: "20px", color: C.walnut, fontVariantNumeric: "tabular-nums" }}>{row.amount}</div>
                <div style={{ width: COLS.method, flexShrink: 0, display: "grid", fontFamily: F.body, fontSize: 15, lineHeight: "20px", color: SUB }}>
                  {isLeo ? (
                    <>
                      <span style={{ gridArea: "1 / 1", opacity: 1 - leo }}>—</span>
                      <span style={{ gridArea: "1 / 1", opacity: leo, transform: `translateX(${(1 - leo) * 8}px)`, color: C.walnut }}>{row.method}</span>
                    </>
                  ) : (
                    row.method
                  )}
                </div>
                <div style={{ width: COLS.status, flexShrink: 0, display: "grid", justifyItems: "start" }}>
                  {isLeo ? (
                    <>
                      <StatusPill status="sent" style={{ gridArea: "1 / 1", opacity: 1 - leo, transform: `scale(${lerp(1, 0.92, leo)})` }} />
                      <StatusPill status="paid" style={{ gridArea: "1 / 1", opacity: leo, transform: `scale(${lerp(0.88, 1, leo) + 0.06 * pulse(frame, LEO_PAID_AT + 4, 5, 14)})` }} />
                    </>
                  ) : (
                    <StatusPill status={row.status} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

function PayStrip({ frame, at }: { frame: number; at: number }) {
  const collected = lerp(1200, 1240, ramp(frame, STRIP_AT, 20, EASE_OUT));
  return (
    <div style={{ position: "absolute", left: 28, top: 124, display: "flex", flexDirection: "column", gap: 6, ...rise(frame, at, { y: 12 }) }}>
      <span
        style={{
          fontFamily: F.display,
          fontWeight: 500,
          fontSize: 66,
          lineHeight: "70px",
          letterSpacing: "-0.03em",
          color: C.walnut,
          fontVariantNumeric: "tabular-nums",
          transform: `scale(${1 + 0.04 * pulse(frame, STRIP_AT + 14, 4, 14)})`,
          transformOrigin: "0 70%",
        }}
      >
        {money(collected)}
      </span>
      <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 18, lineHeight: "22px", letterSpacing: "-0.01em", color: C.ink }}>Collected</span>
    </div>
  );
}

function StatusPill({ status, style }: { status: PayStatus; style?: CSSProperties }) {
  const pill = PILL[status];
  return (
    <div
      style={{
        height: 28,
        padding: "0 12px",
        borderRadius: 999,
        background: pill.background,
        display: "flex",
        alignItems: "center",
        fontFamily: F.body,
        fontWeight: 500,
        fontSize: 13,
        lineHeight: "18px",
        color: pill.color,
        whiteSpace: "nowrap",
        transformOrigin: "0 50%",
        ...style,
      }}
    >
      {pill.label}
    </div>
  );
}

/** Still wave lines across the page paper. */
function PageLines() {
  const lines = Array.from({ length: 16 }, (_, i) => {
    const y0 = (i / 15) * (PAGE.h + 80) - 40;
    let d = "";
    for (let x = -20; x <= PAGE.w + 20; x += 20) {
      const y = y0 + 26 * Math.sin(x / 260 + i * 0.35) + 10 * Math.sin(x / 120 + i);
      d += `${d ? "L" : "M"}${x} ${y.toFixed(1)}`;
    }
    return d;
  });
  return (
    <svg width={PAGE.w} height={PAGE.h} style={{ position: "absolute", left: 0, top: 0 }}>
      {lines.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={C.walnut} strokeOpacity={0.07} strokeWidth={1.2} />
      ))}
    </svg>
  );
}
