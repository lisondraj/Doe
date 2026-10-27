"use client";

import { C, Card, type DiagramScene, F, MONO, Title, fly, lit, mix } from "@/components/doehealth-blog/diagrams/kit";

/** The five ways in, most structured first. */
const ROWS = [
  { name: "MCP", plain: "Use the organization’s tools", wire: "tools/call book_visit" },
  { name: "A2A", plain: "Talk to the organization’s own agent", wire: "/.well-known/agent-card.json" },
  { name: "OAuth", plain: "Carry the person’s permission", wire: "scope=visits:write" },
  { name: "Proxy", plain: "Prove who is acting, and for whom", wire: "Signature-Agent: agent.example" },
  { name: "Computer & phone", plain: "Use the website or call, like a person", wire: "click(\"Book\") · dial(…)" },
] as const;

const IN = 0.3;
const SWEEP = 3.0;
const EACH = 1.6;

function Row({ t, i, x, y, w, h, compact }: { t: number; i: number; x: number; y: number; w: number; h: number; compact: boolean }) {
  const row = ROWS[i];
  const on = lit(t, SWEEP + i * EACH, SWEEP + (i + 1) * EACH, 0.3);
  const ink = (a: string, b: string) => mix(a, b, on);
  return (
    <Card
      x={x}
      y={y}
      w={w}
      h={h}
      style={{
        display: "flex",
        alignItems: "center",
        gap: compact ? 16 : 22,
        padding: compact ? "0 20px" : "0 28px",
        borderRadius: 22,
        background: ink("#FFFCF1", "#140C04"),
        border: `1px solid ${ink("#E7E2DA", "#140C04")}`,
        ...fly(t, IN + i * 0.14, { y: 12 }),
      }}
    >
      <div
        style={{
          width: compact ? 34 : 40,
          height: compact ? 34 : 40,
          borderRadius: 999,
          flexShrink: 0,
          display: "grid",
          placeItems: "center",
          fontFamily: F.ui,
          fontWeight: 600,
          fontSize: compact ? 16 : 18,
          background: ink("#F4EEDF", "#FCCFB8"),
          color: ink("#281910", "#7A3E26"),
        }}
      >
        {i + 1}
      </div>
      <div style={{ width: compact ? 196 : 270, flexShrink: 0, fontFamily: F.display, fontWeight: 500, fontSize: compact ? 25 : 31, letterSpacing: "-0.02em", color: ink("#281910", "#FFFCF1") }}>
        {row.name}
      </div>
      <div style={{ flex: 1, minWidth: 0, fontFamily: F.ui, fontWeight: 500, fontSize: compact ? 18 : 21, lineHeight: 1.25, color: ink("#5C4A3E", "#E8DCC4") }}>{row.plain}</div>
      {compact ? null : (
        <div style={{ fontFamily: MONO, fontSize: 15, color: ink("#8C7E73", "#CDBD9E"), whiteSpace: "nowrap" }}>{row.wire}</div>
      )}
    </Card>
  );
}

/** The five ways a personal agent reaches an organization, each lit in turn. */
export const STACK_SCENE: DiagramScene = {
  loop: SWEEP + ROWS.length * EACH + 1.2,
  still: 2.6,
  wide: { w: 1280, h: 720 },
  compact: { w: 720, h: 540 },
  render: (t, compact) => {
    const W = compact ? 720 : 1280;
    const pad = compact ? 26 : 56;
    const top = compact ? 74 : 116;
    const h = compact ? 76 : 98;
    const gap = compact ? 12 : 14;
    return (
      <>
        <Title size={compact ? 28 : 40} style={{ position: "absolute", left: pad, top: compact ? 22 : 42, ...fly(t, 0, { y: 10 }) }}>
          Five ways in
        </Title>
        <div style={{ position: "absolute", right: pad, top: compact ? 30 : 56, fontFamily: F.ui, fontSize: compact ? 15 : 18, color: C.muted, ...fly(t, 0.2, { y: 8 }) }}>
          Most structured → least
        </div>
        {ROWS.map((_, i) => (
          <Row key={i} t={t} i={i} x={pad} y={top + i * (h + gap)} w={W - pad * 2} h={h} compact={compact} />
        ))}
      </>
    );
  },
};
