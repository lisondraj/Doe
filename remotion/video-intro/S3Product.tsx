import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

import { DotWave } from "../video1/backdrops";
import { Bubble, IPhone, Slot, TimeStamp, TypingBubble } from "../video1/imessage";
import { lerp, pulse, ramp, typed } from "../video1/motion";
import { C, F } from "../video1/theme";
import { ClickRing } from "../video1/ui";
import {
  AgentPointer,
  Av,
  Chapter,
  CheckRow,
  Display,
  EASE_IN_OUT,
  EASE_OUT,
  Gl,
  GlTile,
  Lower,
  MONO,
  PANEL,
  PEACH_TILE,
  Pill,
  SAGE,
  SAGE_TEXT,
  SAGE_TILE,
  SAND_TILE,
  SHELL,
  Scene,
  Segmented,
  Status,
  Swap,
  body,
  draftTail,
  leave,
  onPage,
  press,
  rise,
  serif,
  shots,
  track,
  ui,
  type GlName,
  type Hold,
  type StatusTone,
} from "./kit";

export const S3_FRAMES = 1440;

const PAGE_W = 1364;
const PAGE_H = 876;
const PHONE = { w: 393, h: 852, x: 1800, y: 114 };

/* ─── Timeline ────────────────────────────────────────────────────────────── */

const ASK = "Book me a Botox touch-up near Yorkville this week, under $500.";
const TYPE_AT = 26;
const SEND_AT = 92;
const REPLY_AT = 128;
const TO_SHELL = { from: 146, to: 206 };
const SLIDES = [520, 790, 1050];
const SLIDE_DUR = 36;
const TO_PHONE = { from: 1236, to: 1290 };
const DONE_TYPING = 1290;
const DONE_AT = 1312;
const DONE_CARD = 1330;
const PULL_BACK = { from: 1372, to: 1424 };

const pageAt = (f: number) => SLIDES.reduce((n, at) => n + ramp(f, at, SLIDE_DUR, EASE_IN_OUT), 0);

/* ─── Camera ──────────────────────────────────────────────────────────────── */

const PHONE_FULL = { x: PHONE.x + PHONE.w / 2, y: PHONE.y + PHONE.h / 2, s: 1.12 };
const PHONE_THREAD = { x: PHONE.x + PHONE.w / 2, y: PHONE.y + PHONE.h - 250, s: 1.75 };
const SHELL_CAM = { x: 960, y: 540, s: 1.18 };
const TWO_UP = { x: 1216, y: 540, s: 0.88 };

/** Still holds only; the camera moves in the frames just before each `at`. */
const CAMERA: Hold[] = [
  { at: 0, ...PHONE_FULL },
  { at: SEND_AT + 16, ...PHONE_THREAD, dur: 26 },
  { at: TO_SHELL.to, ...SHELL_CAM, dur: TO_SHELL.to - TO_SHELL.from, dip: 0.45 },
  { at: 296, ...pc(420, 440), s: 1.36, dur: 38 },
  { at: 392, ...pc(1080, 400), s: 1.42, dur: 40 },
  { at: SLIDES[0], ...SHELL_CAM, dur: 36 },
  { at: 610, ...pc(640, 360), s: 1.36, dur: 40 },
  { at: SLIDES[1], ...SHELL_CAM, dur: 30 },
  { at: 870, ...pc(1000, 512), s: 1.2, dur: 40 },
  { at: SLIDES[2], ...SHELL_CAM, dur: 30 },
  { at: 1124, ...pc(420, 540), s: 1.32, dur: 40 },
  { at: TO_PHONE.to, ...PHONE_THREAD, dur: TO_PHONE.to - TO_PHONE.from, dip: 0.42 },
  { at: PULL_BACK.to, ...TWO_UP, dur: PULL_BACK.to - PULL_BACK.from },
];

/** World point for a page coordinate, as a camera target. */
function pc(x: number, y: number) {
  return onPage(x, y);
}

/* ─── Scene ───────────────────────────────────────────────────────────────── */

export function S3Product() {
  const frame = useCurrentFrame();
  const page = pageAt(frame);
  const muse = musePointer(frame);
  return (
    <Scene backdrop={<DotWave top={0.58} amp={60} />}>
      <AbsoluteFill>
        <div style={shots(frame, CAMERA)}>
          <div style={{ position: "absolute", left: SHELL.x, top: SHELL.y, ...rise(frame, 110, { y: 40, dur: 30 }) }}>
            <ProductShell active={page}>
              <div style={{ position: "absolute", left: 0, top: 0, width: PAGE_W * 4, height: PAGE_H, transform: `translateX(${(-page * PAGE_W).toFixed(2)}px)` }}>
                {page < 0.999 ? <IndexPage frame={frame} x={0} /> : null}
                {page > 0.001 && page < 1.999 ? <InterfacePage frame={frame} x={PAGE_W} /> : null}
                {page > 1.001 && page < 2.999 ? <TransitPage frame={frame} x={PAGE_W * 2} /> : null}
                {page > 2.001 ? <PaymentsPage frame={frame} x={PAGE_W * 3} /> : null}
              </div>
            </ProductShell>
          </div>

          <div style={{ position: "absolute", left: PHONE.x, top: PHONE.y }}>
            <IPhone frame={frame} width={PHONE.w} height={PHONE.h} contact="Muse" draft={frame < SEND_AT ? draftTail(typed(ASK, frame, TYPE_AT, 46)) : ""} composing={frame >= TYPE_AT - 8 && frame < SEND_AT} sendPress={pulse(frame, SEND_AT - 4, 3, 6)}>
              <Slot frame={frame} at={10} side="center">
                <TimeStamp day="Today" time="9:41 AM" />
              </Slot>
              <Slot frame={frame} at={SEND_AT} side="out" dur={18}>
                <Bubble out>{ASK}</Bubble>
              </Slot>
              <Slot frame={frame} at={SEND_AT + 12} until={REPLY_AT} side="in" dur={12}>
                <TypingBubble frame={frame} />
              </Slot>
              <Slot frame={frame} at={REPLY_AT} side="in" dur={18}>
                <Bubble>On it. Checking clinics on Doe.</Bubble>
              </Slot>
              <Slot frame={frame} at={DONE_TYPING} until={DONE_AT} side="in" dur={12}>
                <TypingBubble frame={frame} />
              </Slot>
              <Slot frame={frame} at={DONE_AT} side="in" dur={18}>
                <Bubble>Booked Thu 2:30 with Nina Patel. $420.</Bubble>
              </Slot>
              <Slot frame={frame} at={DONE_CARD} side="in" dur={16}>
                <DoneCard frame={frame} />
              </Slot>
            </IPhone>
          </div>

          {muse.opacity > 0 ? <AgentPointer x={muse.x} y={muse.y} label="Muse" opacity={muse.opacity} pressed={press(frame, MUSE_CLICKS)} /> : null}
          {MUSE_CLICKS.map((at) => {
            const p = musePointer(at);
            return <ClickRing key={at} x={p.x} y={p.y} progress={ramp(frame, at - 1, 14)} />;
          })}
        </div>
      </AbsoluteFill>

      <Chapter frame={frame} label="Product" at={12} out={TO_SHELL.from} />
      <Lower frame={frame} at={236} out={SLIDES[0] - 8} title="Doe Dynamic Index" />
      <Lower frame={frame} at={SLIDES[0] + 30} out={SLIDES[1] - 8} title="Doe Interface" />
      <Lower frame={frame} at={SLIDES[1] + 30} out={SLIDES[2] - 8} title="Doe Transit" />
      <Lower frame={frame} at={SLIDES[2] + 30} out={TO_PHONE.from} title="Doe Payments" />
      <Lower frame={frame} at={PULL_BACK.from} out={S3_FRAMES + 40} title="Found, Booked, Filled, Paid" />
    </Scene>
  );
}

/* ─── Muse's presence cursor, page by page ───────────────────────────────── */

const MUSE_CLICKS = [404, 632, 900, 1150];

function musePointer(f: number) {
  const path = track(f, [
    { f: 370, ...pc(1300, 260) },
    { f: 400, ...pc(1000, 426) },
    { f: 440, ...pc(1060, 470) },
    { f: 600, ...pc(1100, 470) },
    { f: 628, ...pc(430, 320) },
    { f: 680, ...pc(560, 400) },
    { f: 860, ...pc(1200, 300) },
    { f: 896, ...pc(1180, 236) },
    { f: 960, ...pc(1200, 540) },
    { f: 1110, ...pc(400, 600) },
    { f: 1146, ...pc(338, 788) },
    { f: 1190, ...pc(380, 820) },
  ]);
  const opacity = Math.max(
    ramp(f, 370, 10) * leave(f, 470, 10),
    ramp(f, 600, 10) * leave(f, 700, 10),
    ramp(f, 860, 10) * leave(f, 1000, 10),
    ramp(f, 1110, 10) * leave(f, 1206, 10),
  );
  return { ...path, opacity };
}

/* ─── The Doe shell ──────────────────────────────────────────────────────── */

const RAIL: GlName[] = ["grid", "chat", "inbox", "card", "calendar", "sliders"];

function ProductShell({ active, children }: { active: number; children: ReactNode }) {
  const top = (900 - (RAIL.length * 40 + (RAIL.length - 1) * 10)) / 2;
  return (
    <div style={{ position: "relative", width: 1440, height: 900, borderRadius: 28, overflow: "hidden", background: C.ink }}>
      <div style={{ position: "absolute", left: 0, top: 22, width: 64, textAlign: "center", fontFamily: F.display, fontWeight: 500, fontSize: 26, lineHeight: "28px", color: C.paper }}>D</div>
      <div style={{ position: "absolute", left: 12, top: top + active * 50, width: 40, height: 40, borderRadius: 12, background: "rgba(255, 252, 241, 0.10)" }} />
      {RAIL.map((name, i) => (
        <div key={name} style={{ position: "absolute", left: 12, top: top + i * 50, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Gl name={name} size={18} stroke={1.8} color={Math.abs(active - i) < 0.5 ? C.paper : "rgba(255, 252, 241, 0.5)"} />
        </div>
      ))}
      <div style={{ position: "absolute", left: 16, bottom: 22 }}>
        <Av label="MS" size={32} />
      </div>
      <div style={{ position: "absolute", left: 64, top: 12, width: PAGE_W, height: PAGE_H, borderRadius: 24, overflow: "hidden", background: C.paper, backgroundImage: "radial-gradient(rgba(40, 25, 16, 0.09) 1px, transparent 1.3px)", backgroundSize: "18px 18px" }}>{children}</div>
    </div>
  );
}

function Page({ x, children }: { x: number; children: ReactNode }) {
  return <div style={{ position: "absolute", left: x, top: 0, width: PAGE_W, height: PAGE_H }}>{children}</div>;
}

function Head({ frame, at, title, children }: { frame: number; at: number; title: string; children?: ReactNode }) {
  return (
    <>
      <div style={{ position: "absolute", left: 28, top: 28, ...rise(frame, at) }}>
        <Display size={46}>{title}</Display>
      </div>
      {children ? <div style={{ position: "absolute", right: 28, top: 32, display: "flex", gap: 8, ...rise(frame, at + 4) }}>{children}</div> : null}
    </>
  );
}

/* ─── Dynamic Index ──────────────────────────────────────────────────────── */

const SYNC_AT = 300;

function IndexPage({ frame, x }: { frame: number; x: number }) {
  const at = 150;
  const synced = ramp(frame, SYNC_AT, 12);
  const rows: { title: string; icon: GlName; tone: string; chips: ReactNode[] }[] = [
    { title: "Services", icon: "spark", tone: C.salmon, chips: ["24 listed", "Botox from $420"] },
    { title: "Providers", icon: "users", tone: SAGE_TILE, chips: ["4 on today", "Nina Patel, RN"] },
    {
      title: "Availability",
      icon: "calendar",
      tone: SAND_TILE,
      chips: [
        <Swap key="n" t={synced} from={<IndexChip>37 openings</IndexChip>} to={<IndexChip>38 openings</IndexChip>} />,
        <span key="new" style={{ opacity: synced, transform: `scale(${lerp(0.8, 1, synced)})`, display: "inline-flex" }}>
          <IndexChip tone={SAGE}>Thu 2:30 opened</IndexChip>
        </span>,
      ],
    },
    { title: "Pricing", icon: "dollar", tone: PEACH_TILE, chips: ["Published", "Deposit $50"] },
    { title: "Requirements", icon: "doc", tone: SAND_TILE, chips: ["Intake form", "Botox consent"] },
    { title: "Offers", icon: "ticket", tone: SAGE_TILE, chips: ["Same-week touch-ups"] },
  ];
  const json: [string, string, boolean?][] = [
    ["clinic", "“Maren Skin Clinic”"],
    ["specialty", "“Aesthetics”"],
    ["service", "“Botox touch-up”"],
    ["price", "420"],
    ["provider", "“Nina Patel, RN”"],
    ["nextOpen", synced > 0.5 ? "“Thu 14:30”" : "“Fri 16:00”", true],
    ["deposit", "50"],
    ["requires", "[“intake”, “consent”]"],
    ["book", "“mcp.doe.care/maren-skin”"],
  ];
  const flash = pulse(frame, SYNC_AT, 4, 30);
  const reads = 128 + (frame >= MUSE_CLICKS[0] ? 1 : 0);
  return (
    <Page x={x}>
      <Head frame={frame} at={at} title="Maren Skin Clinic">
        <Pill icon="sync" tone="soft" pressed={pulse(frame, SYNC_AT - 4, 3, 8)}>
          Synced 2 min ago
        </Pill>
        <Pill icon="eye" tone="ink">
          Live for agents
        </Pill>
      </Head>
      <div style={{ position: "absolute", left: 28, top: 96, display: "flex", gap: 8, ...rise(frame, at + 6) }}>
        <Status tone="ink">Dynamic Index</Status>
        <Status tone="sage" icon="sync">
          Calendar, EHR and price list connected
        </Status>
      </div>

      <div style={{ position: "absolute", left: 28, top: 148, width: 790, height: 700, boxSizing: "border-box", padding: 8, borderRadius: 24, background: PANEL, ...rise(frame, at + 10, { y: 20 }) }}>
        <div style={{ height: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px" }}>
          <span style={serif(22)}>Index</span>
          <span style={ui(13, 500, { color: "rgba(40, 25, 16, 0.6)" })}>6 sections</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {rows.map((r, i) => (
            <div key={r.title} style={{ height: 98, display: "flex", alignItems: "center", gap: 16, padding: "0 18px", borderRadius: 18, background: C.paper, ...rise(frame, at + 16 + i * 4, { y: 12, dur: 18 }) }}>
              <GlTile name={r.icon} size={52} tone={r.tone} />
              <span style={{ width: 210, ...serif(28) }}>{r.title}</span>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>{r.chips.map((c, k) => (typeof c === "string" ? <IndexChip key={k}>{c}</IndexChip> : c))}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: "absolute", left: 838, top: 148, width: 498, height: 700, boxSizing: "border-box", padding: 24, borderRadius: 24, background: C.ink, ...rise(frame, at + 16, { y: 20 }) }}>
        <div style={ui(15, 500, { color: "rgba(255, 252, 241, 0.6)" })}>What agents read</div>
        <div style={{ marginTop: 4, fontFamily: MONO, fontSize: 16, color: C.paper }}>doe.care/maren-skin.json</div>
        <div style={{ marginTop: 22, fontFamily: MONO, fontSize: 17, lineHeight: "34px", color: "rgba(255, 252, 241, 0.78)" }}>
          {json.map(([k, v, live]) => (
            <div key={k} style={{ position: "relative", padding: "0 10px", margin: "0 -10px", borderRadius: 8, whiteSpace: "nowrap" }}>
              {live ? <div style={{ position: "absolute", inset: 0, borderRadius: 8, background: C.salmon, opacity: 0.22 * flash + 0.1 * synced }} /> : null}
              <span style={{ position: "relative" }}>
                <span style={{ color: C.salmon }}>{k}</span>: {v}
              </span>
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 24, right: 24, bottom: 24, height: 90, borderRadius: 18, background: "rgba(255, 252, 241, 0.08)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px" }}>
          <span style={ui(15, 500, { color: "rgba(255, 252, 241, 0.7)" })}>Agent reads today</span>
          <span style={serif(40, { color: C.paper, fontVariantNumeric: "tabular-nums" })}>{reads}</span>
        </div>
      </div>
    </Page>
  );
}

function IndexChip({ children, tone = C.beige }: { children: ReactNode; tone?: string }) {
  return <span style={{ display: "inline-flex", alignItems: "center", height: 30, padding: "0 12px", borderRadius: 999, background: tone, ...ui(14, 500, { color: tone === SAGE ? SAGE_TEXT : C.walnut }) }}>{children}</span>;
}

/* ─── Interface ──────────────────────────────────────────────────────────── */

type Ex = { who: string; av: [string, "salmon" | "sage" | "sand" | "ink"]; intent: string; ask: string; answer: string; tone: StatusTone; status: string };

const EXCHANGES: Ex[] = [
  { who: "Instinct", av: ["I", "sage"], intent: "Question", ask: "Is HydraFacial safe while pregnant?", answer: "Routed to Dr. Okafor with the chart", tone: "salmon", status: "Needs you" },
  { who: "Ruth A. · phone call", av: ["RA", "sand"], intent: "Reschedule", ask: "Move Friday’s peel to next week", answer: "Moved to Tue 11:00, confirmation sent", tone: "sage", status: "Resolved by Doe" },
  { who: "Muse", av: ["M", "salmon"], intent: "Price", ask: "Price for a 3-session laser package", answer: "$1,140, 10% off through October", tone: "sage", status: "Resolved by Doe" },
  { who: "Instinct", av: ["I", "sage"], intent: "Book", ask: "HydraFacial, Saturday morning", answer: "Sat 10:15 with Leah Kim", tone: "sage", status: "Resolved by Doe" },
];
const NEW_ROW = 600;
const RESOLVE = 690;

function InterfacePage({ frame, x }: { frame: number; x: number }) {
  const at = SLIDES[0] + 10;
  const grow = ramp(frame, NEW_ROW, 18, EASE_IN_OUT);
  const resolved = ramp(frame, RESOLVE, 12);
  const requests = 128 + (frame >= NEW_ROW ? 1 : 0);
  const ROW = 100;
  return (
    <Page x={x}>
      <Head frame={frame} at={at} title="Interface">
        <Segmented items={["Agents", "Calls", "All"]} value={2} width={250} />
      </Head>
      <div style={{ position: "absolute", left: 28, top: 104, display: "flex", gap: 12 }}>
        {(
          [
            ["Agent requests today", String(requests)],
            ["Calls answered", "47"],
            ["Resolved by Doe", "94%"],
            ["Median reply", "8 sec"],
          ] as [string, string][]
        ).map(([k, v], i) => (
          <div key={k} style={{ width: 314, height: 92, boxSizing: "border-box", padding: "14px 20px", borderRadius: 20, background: C.beige, ...rise(frame, at + 4 + i * 3, { y: 12 }) }}>
            <div style={body(14)}>{k}</div>
            <div style={{ marginTop: 4, ...serif(34, { fontVariantNumeric: "tabular-nums" }) }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 28, top: 216, width: 1308, height: 632, boxSizing: "border-box", padding: 8, borderRadius: 24, background: PANEL, overflow: "hidden", ...rise(frame, at + 12, { y: 20 }) }}>
        <div style={{ height: 46, display: "flex", alignItems: "center", padding: "0 16px", ...ui(14, 600, { color: "rgba(40, 25, 16, 0.55)" }) }}>
          <span style={{ width: 640 }}>Request</span>
          <span style={{ flex: 1 }}>Doe’s answer</span>
          <span style={{ width: 170 }}>Status</span>
        </div>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, opacity: grow, transform: `translateY(${(1 - grow) * -20}px)` }}>
            <ExchangeRow
              ex={{ who: "Muse", av: ["M", "salmon"], intent: "Book", ask: "Botox touch-up this week near Yorkville, under $500", answer: resolved > 0.5 ? "Thu 2:30 with Nina Patel, $420. Held and confirmed." : "Checking Nina Patel’s calendar…", tone: resolved > 0.5 ? "sage" : "soft", status: resolved > 0.5 ? "Resolved by Doe" : "In progress" }}
              highlight={1 - ramp(frame, RESOLVE + 40, 30)}
            />
          </div>
          {EXCHANGES.map((ex, i) => (
            <div key={i} style={{ position: "absolute", left: 0, right: 0, top: (i + grow) * (ROW + 6), ...rise(frame, at + 18 + i * 4, { y: 12, dur: 18 }) }}>
              <ExchangeRow ex={ex} />
            </div>
          ))}
        </div>
      </div>
    </Page>
  );
}

function ExchangeRow({ ex, highlight = 0 }: { ex: Ex; highlight?: number }) {
  return (
    <div style={{ position: "relative", height: 100, display: "flex", alignItems: "center", padding: "0 16px", borderRadius: 18, background: C.paper }}>
      {highlight > 0 ? <div style={{ position: "absolute", inset: 0, borderRadius: 18, border: `2px solid ${C.walnut}`, opacity: highlight }} /> : null}
      <div style={{ width: 640, display: "flex", alignItems: "center", gap: 14 }}>
        <Av label={ex.av[0]} size={44} tone={ex.av[1]} />
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={ui(15, 600)}>{ex.who}</span>
            <IndexChip>{ex.intent}</IndexChip>
          </div>
          <span style={ui(17, 500, { color: C.walnut })}>{ex.ask}</span>
        </div>
      </div>
      <span style={{ flex: 1, ...ui(17, 500, { color: "rgba(40, 25, 16, 0.75)" }) }}>{ex.answer}</span>
      <div style={{ width: 170 }}>
        <Status tone={ex.tone}>{ex.status}</Status>
      </div>
    </div>
  );
}

/* ─── Transit ────────────────────────────────────────────────────────────── */

const DOCS: { title: string; who: string; patient: string; icon: GlName; tone: string; status: string; st: StatusTone }[] = [
  { title: "Intake form", who: "From Muse", patient: "Dana Reyes", icon: "doc", tone: C.salmon, status: "Agent filling", st: "soft" },
  { title: "Botox consent", who: "From Muse", patient: "Dana Reyes", icon: "edit", tone: PEACH_TILE, status: "Signed by Dana", st: "sage" },
  { title: "Prior records", who: "Rosedale Derm", patient: "Priya Shah", icon: "inbox", tone: SAGE_TILE, status: "Filed to chart", st: "sage" },
  { title: "Patch test result", who: "Bay Street Labs", patient: "Leah Morin", icon: "activity", tone: SAND_TILE, status: "Needs a look", st: "salmon" },
  { title: "Membership form", who: "From Instinct", patient: "Omar Haddad", icon: "doc", tone: PEACH_TILE, status: "Filed to chart", st: "sage" },
  { title: "Aftercare plan", who: "To Muse", patient: "Kim Tran", icon: "arrowRight", tone: SAND_TILE, status: "Read by agent", st: "sage" },
];
const FIELDS: [string, string][] = [
  ["Full name", "Dana Reyes"],
  ["Date of birth", "Apr 12, 1991"],
  ["Allergies", "None reported"],
  ["Medications", "None"],
  ["Last Botox", "May 2026, Maren Skin"],
  ["Emergency contact", "Luis Reyes"],
];
const FILL_AT = 900;
const FILED_AT = 996;

function TransitPage({ frame, x }: { frame: number; x: number }) {
  const at = SLIDES[1] + 10;
  const inspect = ramp(frame, 850, 26, EASE_OUT);
  const filed = ramp(frame, FILED_AT, 12);
  return (
    <Page x={x}>
      <Head frame={frame} at={at} title="Transit">
        <Segmented items={["Inbound", "Outbound"]} value={0} width={250} />
      </Head>
      <div style={{ position: "absolute", left: 28, top: 104, width: 800, height: 744, boxSizing: "border-box", padding: 8, borderRadius: 24, background: PANEL, ...rise(frame, at + 8, { y: 20 }) }}>
        <div style={{ height: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px" }}>
          <span style={serif(22)}>Inbound</span>
          <span style={ui(13, 500, { color: "rgba(40, 25, 16, 0.6)" })}>Today, 23 documents</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {DOCS.map((d, i) => {
            const first = i === 0;
            return (
              <div key={d.title + d.patient} style={{ position: "relative", height: 104, display: "flex", alignItems: "center", gap: 14, padding: "0 16px", borderRadius: 18, background: first ? C.ink : C.paper, ...rise(frame, at + 14 + i * 4, { y: 12, dur: 18 }) }}>
                <GlTile name={d.icon} size={48} tone={d.tone} />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
                  <span style={serif(22, { color: first ? C.paper : C.walnut })}>{d.title}</span>
                  <span style={body(14, { color: first ? "rgba(255, 252, 241, 0.6)" : "rgba(40, 25, 16, 0.6)" })}>
                    {d.patient} &middot; {d.who}
                  </span>
                </div>
                {first ? <Swap t={filed} from={<Status tone="paper">Agent filling</Status>} to={<Status tone="sage" icon="check">Filed to chart</Status>} /> : <Status tone={d.st}>{d.status}</Status>}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ position: "absolute", left: 848, top: 104, width: 488, height: 744, boxSizing: "border-box", padding: 24, borderRadius: 24, background: C.beige, opacity: inspect, transform: `translateX(${(1 - inspect) * 80}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <GlTile name="doc" size={52} tone={C.salmon} />
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <span style={serif(28)}>Intake form</span>
            <span style={body(14)}>Dana Reyes &middot; Filled by Muse with Dana’s OK</span>
          </div>
        </div>
        <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 6 }}>
          {FIELDS.map(([k, v], i) => {
            const t = FILL_AT + i * 12;
            const shown = typed(v, frame, t, 60);
            return (
              <div key={k} style={{ height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", borderRadius: 14, background: C.paper }}>
                <span style={body(14)}>{k}</span>
                <span style={ui(16, 600)}>{shown || <span style={{ color: "rgba(40, 25, 16, 0.25)" }}>&mdash;</span>}</span>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 24, right: 24, bottom: 24, display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            ["Received from Muse", 860],
            ["Matched to Thu 2:30 visit", 880],
            ["Fields checked, nothing missing", 976],
            ["Filed to Dana’s chart", FILED_AT],
          ].map(([label, t]) => (
            <CheckRow key={label as string} label={label as string} done={ramp(frame, t as number, 10)} height={44} />
          ))}
        </div>
      </div>
    </Page>
  );
}

/* ─── Payments ───────────────────────────────────────────────────────────── */

const PAID_AT = 1152;

function PaymentsPage({ frame, x }: { frame: number; x: number }) {
  const at = SLIDES[2] + 10;
  const paid = ramp(frame, PAID_AT, 12);
  const grow = ramp(frame, PAID_AT + 10, 18, EASE_IN_OUT);
  const recent: [string, string, string][] = [
    ["Priya Shah", "Laser package, 1 of 3", "$380"],
    ["Omar Haddad", "Membership, October", "$129"],
    ["Kim Tran", "HydraFacial", "$260"],
    ["Leah Morin", "Consult deposit", "$50"],
    ["Ana Silva", "Botox touch-up", "$420"],
  ];
  return (
    <Page x={x}>
      <Head frame={frame} at={at} title="Payments">
        <Pill icon="chart" tone="soft">
          $18,420 this month
        </Pill>
        <Pill tone="ink">61% paid by agents</Pill>
      </Head>
      <div style={{ position: "absolute", left: 28, top: 104, width: 620, height: 744, boxSizing: "border-box", padding: 28, borderRadius: 24, background: C.beige, ...rise(frame, at + 8, { y: 20 }) }}>
        <div style={ui(15, 600, { color: "rgba(40, 25, 16, 0.6)" })}>Deposit request</div>
        <div style={{ marginTop: 10, ...serif(84, { fontVariantNumeric: "tabular-nums" }) }}>$50.00</div>
        <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 6 }}>
          {(
            [
              ["Patient", "Dana Reyes"],
              ["Visit", "Botox touch-up · Thu 2:30"],
              ["Paid by", "Muse, on Dana’s behalf"],
              ["Method", "Visa •• 4242"],
            ] as [string, string][]
          ).map(([k, v]) => (
            <div key={k} style={{ height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px", borderRadius: 14, background: C.paper }}>
              <span style={body(15)}>{k}</span>
              <span style={ui(17, 600)}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 28, right: 28, bottom: 28, height: 64, borderRadius: 999, overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: C.ink, opacity: 1 - paid, ...ui(19, 600, { color: C.paper }) }}>
            <Gl name="clock" size={18} color={C.paper} />
            Waiting on Muse
          </div>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: SAGE, opacity: paid, transform: `scale(${lerp(0.94, 1, paid)})`, ...ui(19, 600, { color: SAGE_TEXT }) }}>
            <Gl name="check" size={18} color={SAGE_TEXT} stroke={2.6} />
            Paid by Muse &middot; receipt sent
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", left: 668, top: 104, width: 668, height: 744, boxSizing: "border-box", padding: 8, borderRadius: 24, background: PANEL, overflow: "hidden", ...rise(frame, at + 14, { y: 20 }) }}>
        <div style={{ height: 50, display: "flex", alignItems: "center", padding: "0 12px" }}>
          <span style={serif(22)}>Recent</span>
        </div>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, opacity: grow }}>
            <PayRow name="Dana Reyes" item="Deposit, Botox touch-up" amount="$50" agent />
          </div>
          {recent.map(([n, it, a], i) => (
            <div key={n} style={{ position: "absolute", left: 0, right: 0, top: (i + grow) * 90, ...rise(frame, at + 18 + i * 4, { y: 12, dur: 18 }) }}>
              <PayRow name={n} item={it} amount={a} agent={i % 2 === 0} />
            </div>
          ))}
        </div>
      </div>
    </Page>
  );
}

function PayRow({ name, item, amount, agent }: { name: string; item: string; amount: string; agent?: boolean }) {
  return (
    <div style={{ height: 84, display: "flex", alignItems: "center", gap: 14, padding: "0 16px", borderRadius: 18, background: C.paper }}>
      <Av label={name.split(" ").map((p) => p[0]).join("")} size={44} tone="sand" />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={ui(16, 600)}>{name}</span>
        <span style={body(14)}>{item}</span>
      </div>
      {agent ? <Status tone="soft">Paid by agent</Status> : <Status tone="paper">Card on file</Status>}
      <span style={{ width: 70, textAlign: "right", ...serif(24) }}>{amount}</span>
    </div>
  );
}

/* ─── Confirmation in the thread ─────────────────────────────────────────── */

function DoneCard({ frame }: { frame: number }) {
  const rows = ["Visit booked · Thu 2:30", "Intake form filed", "$50 deposit paid"];
  return (
    <div style={{ width: 300, boxSizing: "border-box", padding: 12, borderRadius: 22, background: C.beige, fontFamily: F.ui }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, height: 30, padding: "0 4px" }}>
        <GlTile name="spark" size={24} tone={C.salmon} radius={8} />
        <span style={{ fontWeight: 600, fontSize: 13, color: C.walnut }}>Maren Skin Clinic</span>
      </div>
      <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 5 }}>
        {rows.map((r, i) => (
          <CheckRow key={r} label={r} done={ramp(frame, DONE_CARD + 16 + i * 10, 10)} height={40} />
        ))}
      </div>
    </div>
  );
}
