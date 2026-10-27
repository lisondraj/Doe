"use client";

import { C, Card, Check, type DiagramScene, F, MONO, Pill, Wire, Wires, fly, prog } from "@/components/doehealth-blog/diagrams/kit";

const MANDATE = 0.9;
const REQUEST = 2.6;
const CHECKS = [4.0, 4.7, 5.4] as const;
const ACCEPT = 6.2;

const REQUEST_LINES = [
  ["POST /mcp HTTP/1.1", "plain"],
  ["Host: mcp.riverside.example", "plain"],
  ['Signature-Agent: "https://agent.example"', "id"],
  ['Signature-Input: sig1=(…);tag="web-bot-auth"', "id"],
  ["Signature: sig1=:Mk3x…:", "id"],
  ["Authorization: Bearer eyJ…", "grant"],
  ["  sub=maya  act=agent.example", "grant"],
] as const;

const CHECK_LABELS = [
  { lead: "Which agent", text: "signature matches agent.example’s published key" },
  { lead: "For whom", text: "token says Maya, acting through her agent" },
  { lead: "Within limits", text: "$72 visit, inside Maya’s $90 mandate" },
] as const;

function Node({ t, at, x, y, w, h, kind, compact }: { t: number; at: number; x: number; y: number; w: number; h: number; kind: "person" | "agent" | "org"; compact: boolean }) {
  const dark = kind === "agent";
  return (
    <Card dark={dark} x={x} y={y} w={w} h={h} style={{ display: "flex", alignItems: "center", gap: 14, padding: compact ? "0 14px" : "0 22px", borderRadius: 22, ...fly(t, at, { y: 10 }) }}>
      {kind === "person" ? (
        <div style={{ width: compact ? 34 : 46, height: compact ? 34 : 46, borderRadius: 999, background: C.salmon, color: C.salmonText, display: "grid", placeItems: "center", fontFamily: F.display, fontSize: compact ? 18 : 24, flexShrink: 0 }}>M</div>
      ) : null}
      <div style={{ minWidth: 0 }}>
        {kind === "org" ? (
          <Pill tone="salmon" size={compact ? 13 : 16}>Riverside Physio</Pill>
        ) : (
          <div style={{ fontFamily: F.display, fontWeight: 500, fontSize: compact ? 20 : 27, letterSpacing: "-0.02em", lineHeight: 1.1 }}>{kind === "person" ? "Maya" : "Maya’s Agent"}</div>
        )}
        {compact ? null : (
          <div style={{ marginTop: 6, fontFamily: kind === "agent" ? MONO : F.ui, fontSize: kind === "agent" ? 14 : 15, color: dark ? C.sand3 : C.muted }}>
            {kind === "person" ? "the person" : kind === "agent" ? "agent.example" : "the organization"}
          </div>
        )}
      </div>
    </Card>
  );
}

function Mandate({ t, x, y, w, compact }: { t: number; x: number; y: number; w: number; compact: boolean }) {
  const signed = prog(t, MANDATE + 0.6, 0.35);
  return (
    <Card x={x} y={y} w={w} style={{ padding: compact ? "14px 18px" : "22px 24px", ...fly(t, MANDATE, { y: 12 }) }}>
      <div style={{ fontFamily: MONO, fontSize: compact ? 12 : 14, color: C.salmonText }}>mandate · signed by Maya</div>
      <div style={{ marginTop: 6, fontFamily: F.display, fontWeight: 500, fontSize: compact ? 21 : 27, letterSpacing: "-0.02em" }}>Physio visit, up to $90</div>
      {compact ? null : (
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6, fontSize: 16, color: C.muted }}>
          <span>Only at Riverside Physio</span>
          <span>Until Friday, 11:59 PM</span>
          <span>Ask before anything else</span>
        </div>
      )}
      <div style={{ marginTop: compact ? 8 : 14, display: "flex", alignItems: "center", gap: 8, fontFamily: MONO, fontSize: compact ? 12 : 14, color: C.liveText, opacity: signed }}>
        <Check size={compact ? 15 : 18} on={signed} /> signature valid
      </div>
    </Card>
  );
}

function Request({ t, x, y, w, compact }: { t: number; x: number; y: number; w: number; compact: boolean }) {
  return (
    <Card x={x} y={y} w={w} style={{ padding: compact ? "14px 16px" : "20px 22px", ...fly(t, REQUEST, { y: 12 }) }}>
      <div style={{ fontFamily: F.ui, fontSize: compact ? 13 : 15, color: C.muted, marginBottom: 8 }}>The request</div>
      {REQUEST_LINES.map(([line, kind], i) => (
        <div
          key={line}
          style={{
            fontFamily: MONO,
            fontSize: compact ? 12 : 14.5,
            lineHeight: 1.65,
            whiteSpace: "pre",
            color: kind === "id" ? C.alertText : kind === "grant" ? C.liveText : C.walnut,
            ...fly(t, REQUEST + 0.2 + i * 0.12, { x: 8, y: 0, dur: 0.35 }),
          }}
        >
          {line}
        </div>
      ))}
    </Card>
  );
}

function Checks({ t, x, y, w, compact }: { t: number; x: number; y: number; w: number; compact: boolean }) {
  const accepted = prog(t, ACCEPT, 0.35);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, display: "flex", flexDirection: "column", gap: compact ? 8 : 12 }}>
      {CHECK_LABELS.map((check, i) => {
        const on = prog(t, CHECKS[i], 0.35);
        return (
          <Card key={check.lead} x={0} y={0} w={w} style={{ position: "relative", padding: compact ? "11px 14px" : "14px 18px", display: "flex", gap: 12, ...fly(t, CHECKS[i] - 0.2, { y: 8 }) }}>
            <Check size={compact ? 18 : 22} on={on} />
            <div>
              <div style={{ fontWeight: 600, fontSize: compact ? 15 : 17 }}>{check.lead}</div>
              {compact ? null : <div style={{ marginTop: 3, fontSize: 15, lineHeight: 1.35, color: C.muted }}>{check.text}</div>}
            </div>
          </Card>
        );
      })}
      <div
        style={{
          height: compact ? 42 : 52,
          borderRadius: 999,
          background: "#DCE6D3",
          color: C.liveText,
          display: "grid",
          placeItems: "center",
          fontWeight: 600,
          fontSize: compact ? 16 : 19,
          ...fly(t, ACCEPT, { y: 8, scale: 0.96 }),
          opacity: accepted,
        }}
      >
        Accepted
      </div>
    </div>
  );
}

/** Acting for someone: the person signs a mandate, the agent signs its requests, and the organization checks all three. */
export const PROXY_SCENE: DiagramScene = {
  loop: 9.8,
  still: 8.8,
  wide: { w: 1280, h: 720 },
  compact: { w: 720, h: 540 },
  render: (t, compact) => {
    if (compact) {
      return (
        <>
          <Wires w={720} h={540}>
            <Wire from={[218, 52]} to={[260, 52]} t={t} at={0.5} bend={0.2} packets={[MANDATE]} />
            <Wire from={[470, 52]} to={[512, 52]} t={t} at={0.7} bend={0.2} packets={[REQUEST]} />
          </Wires>
          <Node t={t} at={0} x={20} y={22} w={198} h={60} kind="person" compact />
          <Node t={t} at={0.15} x={260} y={22} w={210} h={60} kind="agent" compact />
          <Node t={t} at={0.3} x={512} y={22} w={188} h={60} kind="org" compact />
          <Request t={t} x={20} y={104} w={420} compact />
          <Checks t={t} x={456} y={104} w={244} compact />
          <Mandate t={t} x={20} y={392} w={420} compact />
        </>
      );
    }
    return (
      <>
        <Wires w={1280} h={720}>
          <Wire from={[352, 115]} to={[490, 115]} t={t} at={0.5} bend={0.3} packets={[MANDATE]} />
          <Wire from={[790, 115]} to={[928, 115]} t={t} at={0.7} bend={0.3} packets={[REQUEST]} />
        </Wires>
        <Node t={t} at={0} x={52} y={60} w={300} h={110} kind="person" compact={false} />
        <Node t={t} at={0.15} x={490} y={60} w={300} h={110} kind="agent" compact={false} />
        <Node t={t} at={0.3} x={928} y={60} w={300} h={110} kind="org" compact={false} />
        <Mandate t={t} x={52} y={206} w={386} compact={false} />
        <Request t={t} x={462} y={206} w={442} compact={false} />
        <Checks t={t} x={928} y={206} w={300} compact={false} />
        <Card x={52} y={612} w={1176} style={{ padding: "16px 24px", borderRadius: 18, fontSize: 18, fontWeight: 500, ...fly(t, ACCEPT + 0.4, { y: 6 }) }}>
          A signature says which agent is calling. Only the person’s grant and mandate say what it may do.
        </Card>
      </>
    );
  },
};
