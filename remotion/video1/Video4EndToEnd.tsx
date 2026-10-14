import type { ReactNode } from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";

import { Rings, Stage } from "./backdrops";
import { EASE_IN_OUT, camera, fly, lerp, pulse, ramp, typed } from "./motion";
import { C, F, SHADOW } from "./theme";
import { Avatar, Chip, Icon, Label, StatusDot, type IconName } from "./ui";

export const VIDEO4_END_TO_END_FRAMES = 480;

export function Video4EndToEnd() {
  return (
    <Stage backdrop={<Rings cx={960} cy={540} />}>
      <Sequence from={30} durationInFrames={450} name="Network">
        <NetworkScene />
      </Sequence>
      <Sequence from={252} durationInFrames={156} name="Agent to agent thread">
        <ThreadScene />
      </Sequence>
    </Stage>
  );
}

/* ─── Network ──────────────────────────────────────────────────────────────── */

const HUB = { x: 960, y: 540 };

type NodeId = "roberts" | "lakeside" | "mission" | "walgreens" | "harbor" | "mia";

type OrgNode = { id: NodeId; name: string; type: string; agent: string; icon: IconName; x: number; y: number; bend: number };

const NODES: OrgNode[] = [
  { id: "roberts", name: "Roberts ENT", type: "Clinic", agent: "Front desk agent", icon: "ear", x: 300, y: 540, bend: 0 },
  { id: "lakeside", name: "Lakeside Pediatrics", type: "Clinic", agent: "Referral agent", icon: "user", x: 520, y: 236, bend: -0.14 },
  { id: "mission", name: "Mission General", type: "Hospital", agent: "Surgical scheduling agent", icon: "building", x: 1400, y: 236, bend: 0.14 },
  { id: "walgreens", name: "Walgreens #2214", type: "Pharmacy", agent: "Pharmacy agent", icon: "pill", x: 1620, y: 540, bend: 0 },
  { id: "harbor", name: "Harbor Mutual", type: "Insurer", agent: "Prior auth agent", icon: "shield", x: 1400, y: 844, bend: -0.14 },
  { id: "mia", name: "Mia Jacobs", type: "Patient", agent: "Personal agent", icon: "user", x: 520, y: 844, bend: 0.14 },
];

const NODE_BY_ID = Object.fromEntries(NODES.map((n) => [n.id, n])) as Record<NodeId, OrgNode>;

const TRAVEL = 24;
/** Pulses leave and land at a card's edge (fraction of the hub → node curve) so chips never cover its title. */
const EDGE_T = 0.74;

/** `sent` also updates the sender's card when the message leaves. */
const EVENTS: { from: NodeId; to: NodeId; label: string; status: string; sent?: string; at: number }[] = [
  { from: "lakeside", to: "roberts", label: "Referral sent", status: "Referral received", sent: "Referral sent", at: 56 },
  { from: "roberts", to: "harbor", label: "Prior auth requested", status: "Reviewing prior auth", at: 82 },
  { from: "harbor", to: "roberts", label: "Approved", status: "Prior auth approved", sent: "Prior auth approved", at: 116 },
  { from: "roberts", to: "mia", label: "Visit confirmed", status: "Visit confirmed", at: 140 },
  { from: "roberts", to: "walgreens", label: "Ear drops Rx sent", status: "Rx received", at: 164 },
  { from: "roberts", to: "mission", label: "OR time requested", status: "OR request received", at: 188 },
  { from: "mission", to: "roberts", label: "OR booked", status: "OR booked · Thu, Oct 22", sent: "OR booked · Thu, Oct 22", at: 376 },
  { from: "roberts", to: "mia", label: "Pre-op guide sent", status: "Pre-op guide received", at: 402 },
];

function nodeStatus(id: NodeId, frame: number) {
  let latest: { t: number; text: string } | undefined;
  for (const e of EVENTS) {
    if (e.sent && e.from === id && frame >= e.at && (!latest || e.at >= latest.t)) latest = { t: e.at, text: e.sent };
    if (e.to === id && frame >= e.at + TRAVEL && (!latest || e.at + TRAVEL >= latest.t)) latest = { t: e.at + TRAVEL, text: e.status };
  }
  return latest?.text;
}

const OUTER: { name: string; icon: IconName }[] = [
  { name: "Bayview Urgent Care", icon: "building" },
  { name: "CVS #1180", icon: "pill" },
  { name: "Aetna", icon: "shield" },
  { name: "Ruth Chen’s agent", icon: "user" },
  { name: "St. Mary’s Medical", icon: "building" },
  { name: "Quest Diagnostics", icon: "doc" },
  { name: "Blue Shield", icon: "shield" },
  { name: "Noah Kim’s agent", icon: "user" },
  { name: "Golden Gate Imaging", icon: "building" },
  { name: "Rite Aid #0412", icon: "pill" },
  { name: "UCSF Pediatrics", icon: "ear" },
  { name: "Cigna", icon: "shield" },
  { name: "Sutter Labs", icon: "doc" },
  { name: "Ava Thompson’s agent", icon: "user" },
];

const OUTER_AT = 384;

const OUTER_NODES = OUTER.map((o, i) => {
  const angle = ((i + 0.5) / OUTER.length) * Math.PI * 2 - Math.PI / 2;
  return { ...o, x: HUB.x + Math.cos(angle) * 1010, y: HUB.y + Math.sin(angle) * 545, bend: i % 2 ? 0.08 : -0.08 };
});

function control(x: number, y: number, bend: number) {
  const mx = (HUB.x + x) / 2;
  const my = (HUB.y + y) / 2;
  return { x: mx - (y - HUB.y) * bend, y: my + (x - HUB.x) * bend };
}

/** Point on the hub → node curve; t = 0 at the hub, 1 at the node. */
function along(node: { x: number; y: number; bend: number }, t: number) {
  const c = control(node.x, node.y, node.bend);
  const u = 1 - t;
  return { x: u * u * HUB.x + 2 * u * t * c.x + t * t * node.x, y: u * u * HUB.y + 2 * u * t * c.y + t * t * node.y };
}

const curve = (node: { x: number; y: number; bend: number }) => {
  const c = control(node.x, node.y, node.bend);
  return `M${HUB.x} ${HUB.y} Q${c.x} ${c.y} ${node.x} ${node.y}`;
};

function NetworkScene() {
  const frame = useCurrentFrame();
  const dim = ramp(frame, 214, 18) * (1 - ramp(frame, 366, 20));
  const cam = camera(frame, [
    { f: 0, x: 960, y: 540, s: 0.9 },
    { f: 40, x: 960, y: 540, s: 0.94 },
    { f: 190, x: 960, y: 540, s: 1 },
    { f: 228, x: 1400, y: 250, s: 2.2 },
    { f: 370, x: 1400, y: 250, s: 2.3 },
    { f: 420, x: 960, y: 540, s: 0.8 },
    { f: 450, x: 960, y: 540, s: 0.77 },
  ]);

  const edgeHeat = (id: NodeId) =>
    Math.max(0, ...EVENTS.filter((e) => e.from === id || e.to === id).map((e) => ramp(frame, e.at, 6) * (1 - ramp(frame, e.at + TRAVEL, 14))));
  const hubFlash = Math.max(0, ...EVENTS.map((e) => pulse(frame, e.at + TRAVEL / 2 - 2, 3, 14)));

  return (
    <AbsoluteFill style={{ opacity: 1 - dim, filter: dim > 0.01 ? `blur(${(10 * dim).toFixed(2)}px)` : undefined }}>
      <div style={cam}>
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          {OUTER_NODES.map((node, i) => {
            const draw = ramp(frame, OUTER_AT + i * 2, 22, EASE_IN_OUT);
            return draw > 0 ? <path key={node.name} d={curve(node)} pathLength={1} fill="none" stroke={C.walnut} strokeOpacity={0.12} strokeWidth={1.4} strokeDasharray="1 1" strokeDashoffset={1 - draw} /> : null;
          })}
          {NODES.map((node, i) => {
            const draw = ramp(frame, 26 + i * 4, 26, EASE_IN_OUT);
            return (
              <path
                key={node.id}
                d={curve(node)}
                pathLength={1}
                fill="none"
                stroke={C.walnut}
                strokeOpacity={0.2 + 0.5 * edgeHeat(node.id)}
                strokeWidth={lerp(1.6, 2.6, edgeHeat(node.id))}
                strokeDasharray="1 1"
                strokeDashoffset={1 - draw}
              />
            );
          })}
        </svg>

        {OUTER_NODES.map((node, i) => {
          const loop = ((frame - OUTER_AT - 14 - i * 7) % 46) / 46;
          if (frame < OUTER_AT + 14 + i * 7) return null;
          const p = along(node, loop);
          return <div key={node.name} style={{ position: "absolute", left: p.x - 4, top: p.y - 4, width: 8, height: 8, borderRadius: 99, background: C.walnut, opacity: 0.5 * Math.sin(Math.PI * loop) }} />;
        })}

        {OUTER_NODES.map((node, i) => (
          <div key={node.name} style={{ position: "absolute", left: node.x, top: node.y, ...fly(frame, { at: OUTER_AT + 6 + i * 2, y: 20, scale: 0.85, dur: 20, blur: 6 }) }}>
            <div style={{ transform: "translate(-50%, -50%)" }}>
              <Chip tone="paper" size={1.45} icon={<Icon name={node.icon} size={17} />} style={{ boxShadow: SHADOW.card, fontWeight: 600 }}>
                {node.name}
              </Chip>
            </div>
          </div>
        ))}

        <div style={{ position: "absolute", left: HUB.x - 74, top: HUB.y - 74, width: 148, height: 148, ...fly(frame, { at: 4, y: 0, scale: 0.7, dur: 26 }) }}>
          <div style={{ position: "absolute", inset: -18 - 14 * hubFlash, borderRadius: 999, background: C.salmon, opacity: 0.25 + 0.35 * hubFlash }} />
          <div style={{ position: "absolute", inset: 0, borderRadius: 999, background: C.ink, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: SHADOW.float }}>
            <div style={{ fontFamily: F.display, fontWeight: 500, fontSize: 70, lineHeight: "70px", color: C.paper, marginTop: -4 }}>D</div>
          </div>
        </div>

        {NODES.map((node, i) => (
          <NodeCard key={node.id} node={node} frame={frame} enterAt={14 + i * 4} />
        ))}

        {EVENTS.map((e) => {
          const t = ramp(frame, e.at, TRAVEL, EASE_IN_OUT);
          if (frame < e.at || frame > e.at + TRAVEL + 10) return null;
          const p = t < 0.5 ? along(NODE_BY_ID[e.from], EDGE_T * (1 - t * 2)) : along(NODE_BY_ID[e.to], EDGE_T * (t - 0.5) * 2);
          const show = ramp(frame, e.at, 5) * (1 - ramp(frame, e.at + TRAVEL, 8));
          return (
            <div key={`${e.label}-${e.at}`} style={{ position: "absolute", left: p.x, top: p.y, opacity: show }}>
              <div style={{ position: "absolute", left: -9, top: -9, width: 18, height: 18, borderRadius: 99, background: C.ink, boxShadow: "0 0 0 6px rgba(252, 207, 184, 0.7)" }} />
              <div style={{ position: "absolute", left: 0, top: -30, transform: "translate(-50%, -100%)" }}>
                <Chip tone="ink" size={1.4} style={{ boxShadow: SHADOW.float }}>
                  {e.label}
                </Chip>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

function NodeCard({ node, frame, enterAt }: { node: OrgNode; frame: number; enterAt: number }) {
  const status = nodeStatus(node.id, frame);
  const flash = Math.max(0, ...EVENTS.filter((e) => e.to === node.id).map((e) => pulse(frame, e.at + TRAVEL, 4, 22)));
  const patient = node.id === "mia";

  return (
    <div style={{ position: "absolute", left: node.x - 160, top: node.y - 58, width: 320, ...fly(frame, { at: enterAt, y: 40, scale: 0.92, dur: 22 }) }}>
      <div
        style={{
          position: "relative",
          height: 116,
          boxSizing: "border-box",
          padding: "16px 18px",
          borderRadius: 24,
          background: C.paper,
          border: `1px solid ${C.line}`,
          boxShadow: SHADOW.float,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflow: "hidden",
          transform: `scale(${1 + 0.05 * flash})`,
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: C.salmon, opacity: 0.4 * flash }} />
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: patient ? C.salmon : C.beige, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name={node.icon} size={22} />
          </div>
          <div>
            <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 20, lineHeight: "24px", color: C.walnut }}>{node.name}</div>
            <div style={{ fontFamily: F.body, fontSize: 14, lineHeight: "18px", color: C.muted }}>{node.type}</div>
          </div>
        </div>
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 8, fontFamily: F.ui, fontWeight: 500, fontSize: 15, color: C.walnut }}>
          {status ? <Icon name="check" size={15} color={C.liveText} stroke={2.6} /> : <StatusDot color={C.live} size={8} />}
          {status ?? node.agent}
        </div>
      </div>
    </div>
  );
}

/* ─── Agent-to-agent thread (Roberts ENT ↔ Mission General) ────────────────── */

const MSG_REQUEST = "Requesting OR time for Leo Jacobs, 6. Bilateral ear tubes with Dr. Roberts.";
const MSG_OFFER = "Pediatric OR is open Thu, Oct 22 at 7:30 AM or Mon, Oct 26 at 8:00 AM.";
const MSG_BOOK = "Mia’s agent confirmed Thu, Oct 22 at 7:30 AM. Booking it.";

function ThreadScene() {
  const frame = useCurrentFrame();
  const cam = camera(frame, [
    { f: 0, x: 960, y: 540, s: 1 },
    { f: 18, x: 960, y: 540, s: 1 },
    { f: 46, x: 820, y: 430, s: 1.2 },
    { f: 72, x: 820, y: 430, s: 1.2 },
    { f: 98, x: 1080, y: 560, s: 1.2 },
    { f: 128, x: 960, y: 560, s: 1.03 },
  ]);
  const picked = ramp(frame, 104, 8);

  return (
    <AbsoluteFill>
      <div style={cam}>
        <div
          style={{
            position: "absolute",
            left: 360,
            top: 190,
            width: 1200,
            boxSizing: "border-box",
            padding: 34,
            borderRadius: 32,
            background: C.paper,
            border: `1px solid ${C.line}`,
            boxShadow: SHADOW.float,
            display: "flex",
            flexDirection: "column",
            gap: 20,
            ...fly(frame, { at: 0, y: 80, scale: 0.95, dur: 24, out: 140, outY: -70 }),
          }}
        >
          <div style={{ height: 56, display: "flex", alignItems: "center", gap: 14 }}>
            <OrgPill initial="R" name="Roberts ENT" agent="Front desk agent" tone="salmon" />
            <div style={{ position: "relative", width: 150, height: 2, background: C.line2 }}>
              <div style={{ position: "absolute", left: 63, top: -11, width: 24, height: 24, borderRadius: 8, background: C.ink, color: C.paper, fontFamily: F.display, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>D</div>
            </div>
            <OrgPill initial="M" name="Mission General" agent="Surgical scheduling agent" tone="ink" />
            <div style={{ marginLeft: "auto" }}>
              <Chip tone="sand" size={1.25} icon={<Icon name="link" size={15} />}>
                Agent to agent
              </Chip>
            </div>
          </div>

          <Message side="left" frame={frame} at={14} meta="Roberts ENT · Front desk agent · 2:31 PM">
            <div style={{ minHeight: 64 }}>{typed(MSG_REQUEST, frame, 20, 46)}</div>
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              {[
                { label: "Prior auth TR-88213 · Approved", tone: "green" as const, icon: <Icon name="check" size={14} color={C.liveText} stroke={2.6} /> },
                { label: "Audiogram · Sep 30", tone: "paper" as const, icon: <Icon name="doc" size={14} /> },
                { label: "Consent · signed", tone: "paper" as const, icon: <Icon name="paperclip" size={14} /> },
              ].map((chip, i) => (
                <div key={chip.label} style={fly(frame, { at: 56 + i * 4, y: 10, scale: 0.9, dur: 12, blur: 0 })}>
                  <Chip tone={chip.tone} size={1.2} icon={chip.icon}>
                    {chip.label}
                  </Chip>
                </div>
              ))}
            </div>
          </Message>

          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", right: 0, top: 0, ...fly(frame, { at: 64, y: 8, dur: 8, blur: 0, out: 78, outDur: 4, outY: 0 }) }}>
              <div style={{ display: "flex", gap: 6, padding: "16px 18px", borderRadius: 20, background: C.ink }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{ width: 9, height: 9, borderRadius: 99, background: C.paper, opacity: 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(frame * 0.4 - i * 0.9)) }} />
                ))}
              </div>
            </div>
            <Message side="right" frame={frame} at={80} meta="Mission General · Surgical scheduling agent · 2:31 PM">
              <div>{MSG_OFFER}</div>
              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                <SlotOption label="Thu, Oct 22 · 7:30 AM" picked={picked} />
                <SlotOption label="Mon, Oct 26 · 8:00 AM" picked={0} />
              </div>
            </Message>
          </div>

          <Message side="left" frame={frame} at={112} meta="Roberts ENT · Front desk agent · 2:32 PM">
            {MSG_BOOK}
          </Message>

          <div style={{ display: "flex", gap: 10 }}>
            {[
              { label: "OR booked · Thu, Oct 22", tone: "green" as const, icon: <Icon name="check" size={14} color={C.liveText} stroke={2.6} /> },
              { label: "Pre-op guide sent to Mia’s agent", tone: "sand" as const, icon: <Icon name="doc" size={14} /> },
              { label: "Ear drops Rx at Walgreens #2214", tone: "sand" as const, icon: <Icon name="pill" size={14} /> },
            ].map((chip, i) => (
              <div key={chip.label} style={fly(frame, { at: 122 + i * 5, y: 12, scale: 0.9, dur: 12, blur: 0 })}>
                <Chip tone={chip.tone} size={1.3} icon={chip.icon}>
                  {chip.label}
                </Chip>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

function OrgPill({ initial, name, agent, tone }: { initial: string; name: string; agent: string; tone: "salmon" | "ink" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <Avatar label={initial} size={46} tone={tone} />
      <div>
        <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 19, lineHeight: "23px", color: C.walnut }}>{name}</div>
        <Label style={{ fontSize: 14, lineHeight: "18px" }}>{agent}</Label>
      </div>
    </div>
  );
}

function Message({ side, frame, at, meta, children }: { side: "left" | "right"; frame: number; at: number; meta: string; children: ReactNode }) {
  const right = side === "right";
  return (
    <div style={{ display: "flex", justifyContent: right ? "flex-end" : "flex-start", ...fly(frame, { at, x: right ? 40 : -40, y: 0, dur: 16, blur: 6 }) }}>
      <div style={{ width: 760, boxSizing: "border-box", padding: "16px 22px 18px", borderRadius: 22, background: right ? C.ink : C.beige }}>
        <Label style={{ fontSize: 14, marginBottom: 8, color: right ? "rgba(255, 252, 241, 0.6)" : C.muted }}>{meta}</Label>
        <div style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 23, lineHeight: "32px", color: right ? C.paper : C.walnut }}>{children}</div>
      </div>
    </div>
  );
}

function SlotOption({ label, picked }: { label: string; picked: number }) {
  return (
    <div
      style={{
        position: "relative",
        height: 40,
        padding: "0 16px",
        borderRadius: 999,
        display: "flex",
        alignItems: "center",
        gap: 8,
        overflow: "hidden",
        border: "1px solid rgba(255, 252, 241, 0.22)",
        fontFamily: F.ui,
        fontWeight: 500,
        fontSize: 16,
        color: picked > 0.5 ? C.walnut : C.paper,
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: C.salmon, opacity: picked }} />
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 8 }}>
        {picked > 0.5 ? <Icon name="check" size={15} stroke={2.6} /> : <Icon name="calendar" size={15} color={C.paper} />}
        {label}
      </div>
    </div>
  );
}
