"use client";

import { C, Card, Check, type DiagramScene, F, MONO, Pill, Steps, Title, fly, prog } from "@/components/doehealth-blog/diagrams/kit";

const CARD_JSON = `{
  "name": "Riverside Front Desk",
  "skills": [
    { "id": "book_appointment" },
    { "id": "answer_questions" }
  ],
  "supportedInterfaces": [
    { "protocolBinding": "JSONRPC",
      "url": "https://riverside…/a2a" }
  ],
  "securitySchemes": { "oauth2": … },
  "signatures": [ … ]
}`;

const STATES = ["submitted", "working", "input-required", "completed"] as const;

const M1 = 1.8;
const WORK1 = 2.6;
const M2 = 3.6;
const M3 = 5.1;
const WORK2 = 5.5;
const M4 = 6.7;

function stateAt(t: number) {
  if (t >= M4) return 3;
  if (t >= WORK2) return 1;
  if (t >= M2) return 2;
  if (t >= WORK1) return 1;
  return 0;
}

function Message({ t, at, side, children, compact }: { t: number; at: number; side: "agent" | "org"; children: React.ReactNode; compact: boolean }) {
  if (t < at - 0.05) return null;
  const org = side === "org";
  return (
    <div
      style={{
        alignSelf: org ? "flex-end" : "flex-start",
        maxWidth: "82%",
        padding: compact ? "11px 15px" : "14px 20px",
        borderRadius: 20,
        borderBottomLeftRadius: org ? 20 : 6,
        borderBottomRightRadius: org ? 6 : 20,
        background: org ? C.salmon : C.ink,
        color: org ? C.salmonText : C.paper,
        fontFamily: F.ui,
        fontWeight: 500,
        fontSize: compact ? 16 : 19,
        lineHeight: 1.35,
        ...fly(t, at, { x: org ? 14 : -14, y: 0 }),
      }}
    >
      {children}
    </div>
  );
}

function Task({ t, x, y, w, h, compact }: { t: number; x: number; y: number; w: number; h: number; compact: boolean }) {
  const verified = prog(t, 1.1, 0.4);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, display: "flex", flexDirection: "column", gap: compact ? 10 : 14 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", ...fly(t, 0.2, { y: 8 }) }}>
        <Pill size={compact ? 14 : 17}>Maya’s Agent</Pill>
        <span style={{ flex: 1, height: 1.5, margin: "0 14px", background: C.line2 }} />
        <Pill tone="salmon" size={compact ? 14 : 17}>Riverside Front Desk</Pill>
      </div>
      {compact ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: MONO, fontSize: 13, color: C.muted, ...fly(t, 0.6, { y: 6 }) }}>
          <Check size={16} on={verified} /> agent-card.json · signed · book_appointment
        </div>
      ) : null}
      <div style={{ ...fly(t, 0.5, { y: 8 }) }}>
        <Steps items={STATES} active={stateAt(t)} size={compact ? 12 : 14} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: compact ? 10 : 14, marginTop: compact ? 4 : 8 }}>
        <Message t={t} at={M1} side="agent" compact={compact}>
          Book a physio visit for Maya, Thursday after 5. New knee injury.
        </Message>
        <Message t={t} at={M2} side="org" compact={compact}>
          Which plan covers it? I’ll need the member ID.
        </Message>
        <Message t={t} at={M3} side="agent" compact={compact}>
          Harbor Mutual. Member ID shared under Maya’s grant.
        </Message>
        {t >= M4 - 0.05 ? (
          <div style={{ alignSelf: "flex-end", width: compact ? "84%" : "70%", ...fly(t, M4, { x: 14, y: 0 }) }}>
            <div style={{ padding: compact ? "12px 15px" : "16px 20px", borderRadius: 20, borderBottomRightRadius: 6, background: C.paper, border: `1.5px solid ${C.salmon}` }}>
              <div style={{ fontFamily: MONO, fontSize: compact ? 12 : 14, color: C.salmonText }}>artifact</div>
              <div style={{ marginTop: 4, fontFamily: F.display, fontWeight: 500, fontSize: compact ? 20 : 25, letterSpacing: "-0.02em", color: C.walnut }}>Visit confirmed, Thu 5:40 PM</div>
              <div style={{ marginTop: 4, fontSize: compact ? 14 : 16, color: C.muted }}>Intake form attached · cancel up to 24h before</div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** The organization runs its own agent and publishes a card; the person's agent reads it and hands it a task. */
export const A2A_SCENE: DiagramScene = {
  loop: 10.6,
  still: 9.6,
  wide: { w: 1280, h: 720 },
  compact: { w: 720, h: 540 },
  render: (t, compact) => {
    if (compact) return <Task t={t} x={22} y={22} w={676} h={496} compact />;
    const verified = prog(t, 1.1, 0.4);
    return (
      <>
        <Card x={52} y={96} w={452} style={{ padding: 28, ...fly(t, 0, { x: -16, y: 0 }) }}>
          <Title size={32}>Agent card</Title>
          <div style={{ marginTop: 6, fontFamily: MONO, fontSize: 15, color: C.muted }}>/.well-known/agent-card.json</div>
          <div style={{ marginTop: 18, padding: "16px 18px", borderRadius: 16, background: C.beige, fontFamily: MONO, fontSize: 14.5, lineHeight: 1.55, color: C.walnut, whiteSpace: "pre", overflow: "hidden" }}>
            {CARD_JSON}
          </div>
          <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 10, fontSize: 17, fontWeight: 500, color: C.liveText, opacity: verified }}>
            <Check size={20} on={verified} /> Signature verified
          </div>
        </Card>
        <Task t={t} x={552} y={60} w={676} h={600} compact={false} />
      </>
    );
  },
};
