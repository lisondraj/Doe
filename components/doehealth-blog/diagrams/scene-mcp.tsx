"use client";

import { C, Card, Check, type DiagramScene, F, MONO, Pill, Title, Wire, Wires, fly, lit, mix, prog } from "@/components/doehealth-blog/diagrams/kit";

const TOOLS = [
  { name: "find_openings", args: "service, after", plain: "Open times for a service", gate: "read-only" },
  { name: "book_visit", args: "opening, reason", plain: "Hold and confirm a visit", gate: "asks first" },
  { name: "get_prices", args: "service, plan", plain: "Self-pay and covered prices", gate: "read-only" },
  { name: "cancel_visit", args: "visit", plain: "Cancel within the clinic’s policy", gate: "asks first" },
] as const;

const CALL1 = 1.7;
const RES1 = 3.0;
const PICK = 4.0;
const CALL2 = 4.7;
const ASK = 5.9;
const RES2 = 7.1;

function ToolRow({ t, i, x, y, w, h, compact }: { t: number; i: number; x: number; y: number; w: number; h: number; compact: boolean }) {
  const tool = TOOLS[i];
  const on = i === 0 ? lit(t, CALL1 + 0.7, RES1 + 0.4, 0.2) : i === 1 ? lit(t, CALL2 + 0.7, RES2 + 0.4, 0.2) : 0;
  const ask = tool.gate === "asks first";
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        boxSizing: "border-box",
        padding: compact ? "10px 14px" : "14px 18px",
        borderRadius: 16,
        background: mix("#F4EEDF", "#140C04", on),
        color: mix("#281910", "#FFFCF1", on),
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 4,
        ...fly(t, 0.5 + i * 0.12, { y: 10 }),
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontFamily: MONO, fontWeight: 600, fontSize: compact ? 15 : 17 }}>{tool.name}</span>
        {compact ? null : <span style={{ fontFamily: MONO, fontSize: 14, opacity: 0.6 }}>({tool.args})</span>}
        <span
          style={{
            marginLeft: "auto",
            padding: compact ? "3px 8px" : "4px 10px",
            borderRadius: 999,
            fontFamily: F.ui,
            fontWeight: 500,
            fontSize: compact ? 12 : 13,
            background: ask ? C.salmon : "rgba(40, 25, 16, 0.07)",
            color: ask ? C.salmonText : mix("#7D6D61", "#E8DCC4", on),
            whiteSpace: "nowrap",
          }}
        >
          {tool.gate}
        </span>
      </div>
      {compact ? null : <div style={{ fontFamily: F.ui, fontSize: 16, opacity: 0.72 }}>{tool.plain}</div>}
    </div>
  );
}

function Call({ t, at, name, args, compact }: { t: number; at: number; name: string; args: readonly string[]; compact: boolean }) {
  return (
    <div style={{ ...fly(t, at, { y: 10 }) }}>
      <div style={{ fontFamily: MONO, fontSize: compact ? 14 : 16, color: C.muted }}>→ tools/call</div>
      <div style={{ marginTop: 6, padding: compact ? "10px 12px" : "12px 16px", borderRadius: 14, background: C.beige, fontFamily: MONO, fontSize: compact ? 14 : 16, lineHeight: 1.55, color: C.walnut, whiteSpace: "pre" }}>
        <span style={{ fontWeight: 600 }}>{name}</span>
        {args.map((line) => `\n  ${line}`).join("")}
      </div>
    </div>
  );
}

function Agent({ t, x, y, w, h, compact }: { t: number; x: number; y: number; w: number; h: number; compact: boolean }) {
  const pick = prog(t, PICK, 0.3);
  const slots = ["Thu 5:40 PM", "Thu 6:20 PM", "Fri 7:10 AM"];
  const asked = prog(t, ASK, 0.3);
  const approved = prog(t, ASK + 0.6, 0.3);
  return (
    <Card x={x} y={y} w={w} h={h} style={{ padding: compact ? 18 : 28, display: "flex", flexDirection: "column", gap: compact ? 12 : 16, ...fly(t, 0.2, { x: 16, y: 0 }) }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Pill size={compact ? 14 : 16}>Maya’s Agent</Pill>
        <span style={{ fontSize: compact ? 14 : 16, color: C.muted }}>MCP client</span>
      </div>
      <Call t={t} at={CALL1} name="find_openings" args={compact ? ['service: "physio"'] : ['service: "physio"', 'after:   "Thu 17:00"']} compact={compact} />
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", ...fly(t, RES1, { y: 8 }) }}>
        <span style={{ fontFamily: MONO, fontSize: compact ? 14 : 16, color: C.muted, marginRight: 4 }}>←</span>
        {slots.slice(0, compact ? 2 : 3).map((slot, i) => (
          <span
            key={slot}
            style={{
              padding: compact ? "6px 11px" : "7px 14px",
              borderRadius: 999,
              fontWeight: 500,
              fontSize: compact ? 14 : 16,
              background: i === 0 ? mix("#F4EEDF", "#140C04", pick) : C.beige,
              color: i === 0 ? mix("#281910", "#FFFCF1", pick) : C.walnut,
            }}
          >
            {slot}
          </span>
        ))}
      </div>
      <Call t={t} at={CALL2} name="book_visit" args={compact ? ['opening: "thu-1740"'] : ['opening: "thu-1740"', 'reason:  "knee, new"']} compact={compact} />
      {t >= ASK ? (
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: compact ? 14 : 16, color: approved > 0.5 ? C.liveText : C.salmonText, opacity: asked }}>
          <Check size={compact ? 16 : 20} on={approved} color={approved > 0.5 ? C.liveText : C.salmonText} />
          {approved > 0.5 ? "Maya approved in Messages" : "Asking Maya before booking…"}
        </div>
      ) : null}
      {t >= RES2 ? (
        <div style={{ padding: compact ? "10px 12px" : "12px 16px", borderRadius: 14, background: C.liveBg, color: C.liveText, fontWeight: 500, fontSize: compact ? 15 : 17, ...fly(t, RES2, { y: 8 }) }}>
          ← Booked · Thu 5:40 PM · ref R‑2231
        </div>
      ) : null}
    </Card>
  );
}

/** An organization's MCP server lists its tools; the person's agent calls two of them and asks before the one that books. */
export const MCP_SCENE: DiagramScene = {
  loop: 10.5,
  still: 9.4,
  wide: { w: 1280, h: 720 },
  compact: { w: 720, h: 540 },
  render: (t, compact) => {
    const S = compact
      ? { pad: 18, top: 18, lw: 292, gap: 16, rowH: 52, rowGap: 10, headH: 132 }
      : { pad: 52, top: 52, lw: 508, gap: 56, rowH: 92, rowGap: 14, headH: 168 };
    const H = (compact ? 540 : 720) - S.top * 2;
    const rx = S.pad + S.lw + S.gap;
    const rw = (compact ? 720 : 1280) - rx - S.pad;
    const rowY = (i: number) => S.top + S.headH + i * (S.rowH + S.rowGap);
    const callY1 = S.top + (compact ? 92 : 120);
    const callY2 = S.top + (compact ? 262 : 340);
    return (
      <>
        <Wires w={compact ? 720 : 1280} h={compact ? 540 : 720}>
          <Wire from={[rx, callY1]} to={[S.pad + S.lw, rowY(0) + S.rowH / 2]} t={t} at={CALL1 - 0.2} packets={[CALL1]} bend={0.5} />
          <Wire from={[rx, callY2]} to={[S.pad + S.lw, rowY(1) + S.rowH / 2]} t={t} at={CALL2 - 0.2} packets={[CALL2]} bend={0.5} />
        </Wires>
        <Card x={S.pad} y={S.top} w={S.lw} h={H} style={{ padding: compact ? 16 : 26, ...fly(t, 0, { x: -16, y: 0 }) }}>
          <Pill tone="salmon" size={compact ? 14 : 16}>Riverside Physio</Pill>
          <Title size={compact ? 24 : 32} style={{ marginTop: compact ? 10 : 14 }}>
            MCP server
          </Title>
          <div style={{ marginTop: 6, fontFamily: MONO, fontSize: compact ? 12 : 15, color: C.muted }}>
            {compact ? "mcp.riverside.example" : "https://mcp.riverside.example/mcp"}
          </div>
        </Card>
        {TOOLS.map((_, i) => (
          <ToolRow key={i} t={t} i={i} x={S.pad + (compact ? 12 : 20)} y={rowY(i)} w={S.lw - (compact ? 24 : 40)} h={S.rowH} compact={compact} />
        ))}
        <Agent t={t} x={rx} y={S.top} w={rw} h={H} compact={compact} />
      </>
    );
  },
};
