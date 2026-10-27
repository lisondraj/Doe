"use client";

import { C, Card, type DiagramScene, Cursor, F, MONO, Pill, Ring, Title, Toggle, easeInOut, fly, lit, mix, prog } from "@/components/doehealth-blog/diagrams/kit";

const DISCOVER = 0.6;
const SHEET = 1.9;
const MOVE = 3.0;
const PRESS = 4.0;
const TOKEN = 4.7;
const STEPUP = 6.9;

const STEPS = [
  { title: "Discover", detail: "401 → resource_metadata", from: DISCOVER, to: SHEET },
  { title: "Consent", detail: "PKCE · client_id is a URL", from: SHEET, to: TOKEN },
  { title: "Token", detail: "aud = one server only", from: TOKEN, to: STEPUP },
  { title: "Step up", detail: "403 insufficient_scope", from: STEPUP, to: 99 },
] as const;

const SCOPES = [
  { label: "See open appointment times", on: true },
  { label: "Book and change your visits", on: true },
  { label: "Read your visit history", on: false },
] as const;

function Sheet({ t, x, y, w, h, compact }: { t: number; x: number; y: number; w: number; h: number; compact: boolean }) {
  const allowed = prog(t, PRESS, 0.25);
  return (
    <Card x={x} y={y} w={w} h={h} style={{ padding: compact ? 20 : 28, borderRadius: 30, display: "flex", flexDirection: "column", ...fly(t, SHEET, { y: 22 }) }}>
      <div style={{ fontFamily: MONO, fontSize: compact ? 12 : 14, color: C.faint }}>auth.riverside.example</div>
      <div style={{ marginTop: compact ? 12 : 16, display: "flex", alignItems: "center", gap: 10 }}>
        <Pill size={compact ? 13 : 15}>Maya’s Agent</Pill>
        <span style={{ fontSize: compact ? 13 : 15, color: C.muted }}>wants to act for you</span>
      </div>
      <Title size={compact ? 23 : 28} style={{ marginTop: compact ? 10 : 14 }}>
        Allow it at Riverside Physio?
      </Title>
      <div style={{ marginTop: 8, fontFamily: MONO, fontSize: compact ? 11 : 13, color: C.faint }}>client_id: agent.example/oauth/client.json</div>
      <div style={{ marginTop: compact ? 14 : 20, display: "flex", flexDirection: "column", gap: compact ? 8 : 10 }}>
        {SCOPES.map((scope) => (
          <div
            key={scope.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: compact ? "10px 12px" : "13px 16px",
              borderRadius: 14,
              background: C.beige,
              opacity: scope.on ? 1 : 0.55,
            }}
          >
            <span style={{ flex: 1, fontSize: compact ? 15 : 17, fontWeight: 500 }}>{scope.label}</span>
            {scope.on ? <Toggle on={1} /> : <span style={{ fontSize: compact ? 12 : 13, color: C.faint }}>not asked</span>}
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", padding: compact ? "2px 4px" : "4px 6px", fontSize: compact ? 14 : 16, color: C.muted }}>
          <span>Access ends</span>
          <span style={{ fontWeight: 500, color: C.walnut }}>in 7 days, or when you revoke it</span>
        </div>
      </div>
      <div style={{ marginTop: "auto", display: "flex", gap: 10 }}>
        <div style={{ flex: 1, height: compact ? 42 : 50, borderRadius: 999, background: C.beige, display: "grid", placeItems: "center", fontWeight: 500, fontSize: compact ? 15 : 17 }}>Deny</div>
        <div
          style={{
            flex: 1,
            height: compact ? 42 : 50,
            borderRadius: 999,
            background: mix("#140C04", "#3F6431", allowed),
            color: C.paper,
            display: "grid",
            placeItems: "center",
            fontWeight: 500,
            fontSize: compact ? 15 : 17,
          }}
        >
          {allowed > 0.5 ? "Allowed" : "Allow"}
        </div>
      </div>
    </Card>
  );
}

function TokenCard({ t, x, y, w, compact }: { t: number; x: number; y: number; w: number; compact: boolean }) {
  const lines: [string, string][] = [
    ["aud", compact ? "mcp.riverside…" : "mcp.riverside.example"],
    ["sub", "maya"],
    ["act", "{ sub: agent.example }"],
    ["scope", compact ? "openings:read …" : "openings:read visits:write"],
    ["exp", "60 min"],
  ];
  return (
    <Card dark x={x} y={y} w={w} style={{ padding: compact ? "16px 18px" : "20px 24px", ...fly(t, TOKEN, { y: 14 }) }}>
      <div style={{ fontFamily: F.ui, fontSize: compact ? 13 : 15, color: C.sand3 }}>Access token</div>
      <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "auto 1fr", columnGap: 16, rowGap: 4 }}>
        {lines.map(([k, v], i) => (
          <div key={k} style={{ display: "contents" }}>
            <span style={{ fontFamily: MONO, fontSize: compact ? 13 : 15, color: C.sand3, ...fly(t, TOKEN + 0.15 + i * 0.08, { y: 4 }) }}>{k}</span>
            <span style={{ fontFamily: MONO, fontSize: compact ? 13 : 15, color: k === "act" ? C.salmon : C.paper, whiteSpace: "nowrap", ...fly(t, TOKEN + 0.15 + i * 0.08, { y: 4 }) }}>{v}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function StepUp({ t, x, y, w, compact }: { t: number; x: number; y: number; w: number; compact: boolean }) {
  return (
    <Card x={x} y={y} w={w} style={{ padding: compact ? "14px 16px" : "18px 22px", border: `1.5px solid ${C.salmon}`, ...fly(t, STEPUP, { y: 12 }) }}>
      <div style={{ fontFamily: MONO, fontSize: compact ? 13 : 15, color: C.alertText }}>403 insufficient_scope</div>
      <div style={{ marginTop: 6, fontSize: compact ? 15 : 17, fontWeight: 500 }}>Paying needs payments:write, so the agent asks Maya again.</div>
    </Card>
  );
}

/** OAuth as MCP uses it: discovery from a 401, the person's consent naming the agent, a token for one server, and step-up. */
export const OAUTH_SCENE: DiagramScene = {
  loop: 10.4,
  still: 9.4,
  wide: { w: 1280, h: 720 },
  compact: { w: 720, h: 540 },
  render: (t, compact) => {
    // The cursor glides from below to Allow, presses it, and leaves.
    const move = easeInOut((t - MOVE) / 0.9);
    if (compact) {
      const allow = { x: 20 + 360 - 20 - 75, y: 20 + 500 - 20 - 21 };
      const cx = 330 + (allow.x - 330) * move;
      const cy = 560 + (allow.y - 560) * move;
      return (
        <>
          <Sheet t={t} x={20} y={20} w={360} h={500} compact />
          <TokenCard t={t} x={396} y={20} w={304} compact />
          <StepUp t={t} x={396} y={360} w={304} compact />
          <Cursor x={cx} y={cy} press={lit(t, PRESS - 0.1, PRESS + 0.15, 0.08)} opacity={lit(t, MOVE, TOKEN + 0.6, 0.3)} />
          <Ring x={allow.x} y={allow.y} t={t} at={PRESS} />
        </>
      );
    }
    const stepOn = STEPS.findIndex((s) => t >= s.from && t < s.to);
    const allow = { x: 420 + 440 - 28 - 96, y: 52 + 616 - 28 - 25 };
    const cx = 760 + (allow.x - 760) * move;
    const cy = 760 + (allow.y - 760) * move;
    return (
      <>
        <div style={{ position: "absolute", left: 52, top: 56, width: 320 }}>
          <Title size={34} style={fly(t, 0, { y: 10 })}>OAuth for agents</Title>
          <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 14 }}>
            {STEPS.map((step, i) => {
              const on = i === stepOn ? 1 : 0;
              const done = i < stepOn;
              return (
                <div
                  key={step.title}
                  style={{
                    display: "flex",
                    gap: 14,
                    padding: "16px 18px",
                    borderRadius: 18,
                    background: on ? C.ink : C.paper,
                    border: on ? "none" : `1px solid ${C.line}`,
                    color: on ? C.paper : C.walnut,
                    ...fly(t, 0.15 + i * 0.1, { y: 10 }),
                  }}
                >
                  <span
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 999,
                      flexShrink: 0,
                      display: "grid",
                      placeItems: "center",
                      fontFamily: F.ui,
                      fontWeight: 600,
                      fontSize: 15,
                      background: on ? C.salmon : done ? C.liveBg : C.beige,
                      color: on ? C.salmonText : done ? C.liveText : C.walnut,
                    }}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 19 }}>{step.title}</div>
                    <div style={{ marginTop: 4, fontFamily: MONO, fontSize: 14, opacity: 0.7 }}>{step.detail}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <Sheet t={t} x={420} y={52} w={440} h={616} compact={false} />
        <Card x={900} y={52} w={328} style={{ padding: "18px 20px", ...fly(t, DISCOVER, { y: 12 }) }}>
          <div style={{ fontFamily: MONO, fontSize: 14, lineHeight: 1.6, color: C.walnut, whiteSpace: "pre" }}>
            {"POST /mcp\n"}
            <span style={{ color: C.alertText }}>{"401 Unauthorized\n"}</span>
            <span style={{ color: C.muted }}>{"WWW-Authenticate: Bearer\n  resource_metadata=…\n  scope=\"openings:read\n         visits:write\""}</span>
          </div>
        </Card>
        <TokenCard t={t} x={900} y={300} w={328} compact={false} />
        <StepUp t={t} x={900} y={540} w={328} compact={false} />
        <Cursor x={cx} y={cy} press={lit(t, PRESS - 0.1, PRESS + 0.15, 0.08)} opacity={lit(t, MOVE, TOKEN + 0.6, 0.3)} />
        <Ring x={allow.x} y={allow.y} t={t} at={PRESS} />
      </>
    );
  },
};
