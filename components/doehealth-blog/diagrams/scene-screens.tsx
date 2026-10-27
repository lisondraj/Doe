"use client";

import { C, Card, type DiagramScene, Cursor, F, MONO, Pill, Ring, Title, easeInOut, fly, lit, prog, typed } from "@/components/doehealth-blog/diagrams/kit";

const FIELDS = [
  { label: "Service", value: "Physiotherapy", at: 1.4 },
  { label: "Day", value: "Thursday", at: 2.4 },
  { label: "Time", value: "5:40 PM", at: 3.3 },
] as const;
const CONTINUE = 4.3;
const CHECK = 4.8;
const STUCK = 5.6;

const CALL = [
  { at: 1.2, who: "ivr", text: "Thanks for calling. For appointments, press 1." },
  { at: 2.0, who: "agent", text: "⌨ 1" },
  { at: 2.6, who: "hold", text: "On hold" },
  { at: 4.5, who: "staff", text: "Front desk, this is Ana." },
  { at: 5.3, who: "agent", text: "Hi, I’m an AI assistant calling for Maya Chen. Is Thursday at 5:40 free?" },
  { at: 6.7, who: "staff", text: "It is. I’ve booked her in." },
] as const;

function Browser({ t, x, y, w, h, compact }: { t: number; x: number; y: number; w: number; h: number; compact: boolean }) {
  const pad = compact ? 16 : 28;
  const fieldH = compact ? 40 : 52;
  const top = compact ? 102 : 150;
  const gap = compact ? 52 : 76;
  const check = prog(t, CHECK, 0.4);
  return (
    <Card x={x} y={y} w={w} h={h} style={{ overflow: "hidden", borderRadius: 24, ...fly(t, 0, { x: -14, y: 0 }) }}>
      <div style={{ height: compact ? 40 : 52, display: "flex", alignItems: "center", gap: 7, padding: `0 ${compact ? 14 : 18}px`, borderBottom: `1px solid ${C.line}`, background: C.beige }}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{ width: compact ? 9 : 11, height: compact ? 9 : 11, borderRadius: 99, background: C.sand3 }} />
        ))}
        <span style={{ marginLeft: 10, padding: compact ? "4px 10px" : "5px 14px", borderRadius: 999, background: C.paper, fontFamily: MONO, fontSize: compact ? 11 : 14, color: C.muted }}>riverside.example/book</span>
        {compact ? null : <span style={{ marginLeft: "auto", fontSize: 14, color: C.faint }}>Agent’s cloud computer</span>}
      </div>
      <div style={{ position: "absolute", left: pad, top: compact ? 54 : 74 }}>
        <Title size={compact ? 20 : 28}>Book a visit</Title>
      </div>
      {FIELDS.map((field, i) => (
        <div key={field.label} style={{ position: "absolute", left: pad, right: pad, top: top + i * gap - (compact ? 16 : 22) }}>
          <div style={{ fontSize: compact ? 11 : 14, color: C.muted, marginBottom: 4 }}>{field.label}</div>
          <div
            style={{
              height: fieldH,
              boxSizing: "border-box",
              display: "flex",
              alignItems: "center",
              padding: "0 14px",
              borderRadius: 12,
              border: `1.5px solid ${t >= field.at - 0.1 && t < field.at + 0.9 ? C.walnut : C.line2}`,
              fontSize: compact ? 14 : 18,
              fontWeight: 500,
            }}
          >
            {typed(t, field.at + 0.1, field.value, 22)}
          </div>
        </div>
      ))}
      <div
        style={{
          position: "absolute",
          left: pad,
          top: top + 3 * gap - (compact ? 4 : 2),
          height: compact ? 38 : 48,
          padding: "0 22px",
          borderRadius: 999,
          background: C.ink,
          color: C.paper,
          display: "grid",
          placeItems: "center",
          fontWeight: 500,
          fontSize: compact ? 14 : 17,
        }}
      >
        Continue
      </div>
      {check > 0 ? (
        <div style={{ position: "absolute", inset: 0, background: `rgba(244, 238, 223, ${0.75 * check})`, display: "grid", placeItems: "center" }}>
          <div style={{ width: compact ? 240 : 360, padding: compact ? 16 : 24, borderRadius: 20, background: C.paper, border: `1px solid ${C.line2}`, ...fly(t, CHECK, { y: 12, scale: 0.97 }) }}>
            <div style={{ fontWeight: 600, fontSize: compact ? 15 : 19 }}>Confirm you’re a person</div>
            <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 12, fontSize: compact ? 13 : 16, color: C.muted }}>
              <span style={{ width: compact ? 20 : 26, height: compact ? 20 : 26, borderRadius: 6, border: `1.5px solid ${C.sand3}` }} />
              Select every square with a crosswalk
            </div>
          </div>
        </div>
      ) : null}
    </Card>
  );
}

function cursorPath(t: number, compact: boolean, x0: number, y0: number) {
  const pad = compact ? 16 : 28;
  const top = compact ? 102 : 150;
  const gap = compact ? 52 : 76;
  const fieldMid = compact ? 20 : 26;
  const pts = [
    { at: 0.6, x: x0 + (compact ? 250 : 470), y: y0 + (compact ? 330 : 460) },
    ...FIELDS.map((f, i) => ({ at: f.at - 0.4, x: x0 + pad + (compact ? 120 : 200), y: y0 + top + i * gap + fieldMid })),
    { at: CONTINUE - 0.4, x: x0 + pad + 60, y: y0 + top + 3 * gap + (compact ? 16 : 22) },
  ];
  let cur = pts[0];
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i];
    if (t < p.at) break;
    const k = easeInOut((t - p.at) / 0.4);
    cur = { at: p.at, x: cur.x + (p.x - cur.x) * k, y: cur.y + (p.y - cur.y) * k };
  }
  return cur;
}

function Call({ t, x, y, w, h, compact }: { t: number; x: number; y: number; w: number; h: number; compact: boolean }) {
  const secs = Math.max(0, Math.floor((t - 1) * 26));
  const clock = `${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`;
  return (
    <Card x={x} y={y} w={w} h={h} style={{ padding: compact ? 14 : 24, borderRadius: 24, display: "flex", flexDirection: "column", gap: compact ? 8 : 12, ...fly(t, 0.2, { x: 14, y: 0 }) }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ width: compact ? 26 : 34, height: compact ? 26 : 34, borderRadius: 999, background: C.live, display: "grid", placeItems: "center" }}>
          <svg width={compact ? 13 : 17} height={compact ? 13 : 17} viewBox="0 0 24 24" fill={C.paper}>
            <path d="M6.6 10.8a15.2 15.2 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" />
          </svg>
        </span>
        <div style={{ fontWeight: 600, fontSize: compact ? 14 : 18 }}>{compact ? "Calling clinic" : "Calling Riverside Physio"}</div>
        <span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: compact ? 12 : 15, color: C.muted }}>{clock}</span>
      </div>
      {CALL.map((line) => {
        if (t < line.at - 0.05) return null;
        if (line.who === "hold") {
          const on = lit(t, line.at, 4.4, 0.2);
          return (
            <div key={line.at} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: compact ? 12 : 15, color: C.muted, opacity: Math.max(0.45, on), ...fly(t, line.at, { y: 6 }) }}>
              <span style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 16 }}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <span key={i} style={{ width: 3, borderRadius: 2, background: C.sand3, height: 4 + 10 * Math.abs(Math.sin(t * 5 + i)) * on }} />
                ))}
              </span>
              {t < 4.4 ? "On hold…" : "Held 1:52"}
            </div>
          );
        }
        const agent = line.who === "agent";
        return (
          <div
            key={line.at}
            style={{
              alignSelf: agent ? "flex-end" : "flex-start",
              maxWidth: "86%",
              padding: compact ? "8px 11px" : "11px 15px",
              borderRadius: 16,
              background: agent ? C.ink : line.who === "staff" ? C.salmon : C.beige,
              color: agent ? C.paper : line.who === "staff" ? C.salmonText : C.walnut,
              fontSize: compact ? 12.5 : 16,
              lineHeight: 1.35,
              fontWeight: 500,
              ...fly(t, line.at, { x: agent ? 10 : -10, y: 0 }),
            }}
          >
            {line.text}
          </div>
        );
      })}
    </Card>
  );
}

function Compare({ t, x, y, w, h, compact, kind }: { t: number; x: number; y: number; w: number; h: number; compact: boolean; kind: "api" | "screen" }) {
  const api = kind === "api";
  return (
    <Card x={x} y={y} w={w} h={h} style={{ display: "flex", alignItems: "center", gap: compact ? 10 : 16, padding: compact ? "0 14px" : "0 22px", borderRadius: 20, ...fly(t, api ? 7.4 : 7.6, { y: 10 }) }}>
      <Pill tone={api ? "live" : "salmon"} size={compact ? 12 : 15}>{api ? "Protocols" : "Screens & calls"}</Pill>
      <span style={{ fontSize: compact ? 13 : 17, fontWeight: 500, color: C.walnut }}>{api ? "Seconds · structured · auditable" : "Minutes · brittle · hard to audit"}</span>
    </Card>
  );
}

/** When there is no interface for agents: the agent drives a website in its own browser, or phones the front desk. */
export const SCREENS_SCENE: DiagramScene = {
  loop: 10.6,
  still: 9.6,
  wide: { w: 1280, h: 720 },
  compact: { w: 720, h: 540 },
  render: (t, compact) => {
    const B = compact ? { x: 16, y: 16, w: 340, h: 392 } : { x: 52, y: 52, w: 640, h: 520 };
    const K = compact ? { x: 368, y: 16, w: 336, h: 392 } : { x: 724, y: 52, w: 504, h: 520 };
    const cur = cursorPath(t, compact, B.x, B.y);
    const clicks = [...FIELDS.map((f) => f.at), CONTINUE];
    const pressed = clicks.find((c) => t >= c && t < c + 0.18);
    return (
      <>
        <Browser t={t} {...B} compact={compact} />
        <Call t={t} {...K} compact={compact} />
        <Cursor x={cur.x} y={cur.y} press={pressed !== undefined ? 1 : 0} opacity={lit(t, 0.5, CHECK + 0.2, 0.3)} />
        {clicks.map((c) => (t >= c && t < c + 0.5 ? <Ring key={c} x={cur.x} y={cur.y} t={t} at={c} /> : null))}
        {t >= STUCK ? (
          <div style={{ position: "absolute", left: B.x + (compact ? 12 : 24), top: B.y + B.h - (compact ? 44 : 60), ...fly(t, STUCK, { y: 8 }) }}>
            <Pill tone="salmon" size={compact ? 12 : 15}>Stuck at a human check · asks Maya</Pill>
          </div>
        ) : null}
        <Compare t={t} x={B.x} y={compact ? 422 : 600} w={compact ? 340 : 576} h={compact ? 100 : 68} compact={compact} kind="api" />
        <Compare t={t} x={compact ? K.x : 652} y={compact ? 422 : 600} w={compact ? 336 : 576} h={compact ? 100 : 68} compact={compact} kind="screen" />
      </>
    );
  },
};
