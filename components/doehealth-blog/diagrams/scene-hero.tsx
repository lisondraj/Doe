"use client";

import { C, Card, Check, type DiagramScene, F, MONO, Pill, Wire, Wires, fly, lit, mix, prog, typed } from "@/components/doehealth-blog/diagrams/kit";

const ASK = "Sort out my week: physio for my knee after work, move Friday’s flight, renew the parking permit, refill my prescription.";
const DONE = "Done. Physio Thu 5:40 PM, covered by your plan. Flight moved to Sat 9:15. Permit renewed. Prescription ready after 6.";

/** Where each errand goes, and how the agent gets in. */
const PLACES = [
  { name: "Physio clinic", how: "MCP tools" },
  { name: "Insurer", how: "OAuth grant" },
  { name: "Airline", how: "A2A agent" },
  { name: "City permits", how: "Browser" },
  { name: "Pharmacy", how: "Phone call" },
] as const;

const SEND = 2.1;
const GAP = 0.55;
const sentAt = (i: number) => SEND + i * GAP;
const doneAt = (i: number) => sentAt(i) + 2.2 + (i === 3 || i === 4 ? 1.2 : 0);
const REPLY = 8.1;

function Bubble({ who, children, style }: { who: "person" | "agent"; children: React.ReactNode; style?: React.CSSProperties }) {
  const person = who === "person";
  return (
    <div
      style={{
        maxWidth: "86%",
        alignSelf: person ? "flex-end" : "flex-start",
        padding: "14px 18px",
        borderRadius: 22,
        borderBottomRightRadius: person ? 8 : 22,
        borderBottomLeftRadius: person ? 22 : 8,
        background: person ? C.ink : C.beige,
        color: person ? C.paper : C.walnut,
        fontFamily: F.ui,
        fontWeight: 500,
        fontSize: 21,
        lineHeight: 1.36,
        letterSpacing: "-0.005em",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Thread({ t, x, y, w, h, size = 1 }: { t: number; x: number; y: number; w: number; h: number; size?: number }) {
  const working = t > 1.4 && t < REPLY;
  const doneCount = PLACES.filter((_, i) => t > doneAt(i)).length;
  return (
    <Card x={x} y={y} w={w} h={h} style={{ padding: 26 * size, borderRadius: 32, display: "flex", flexDirection: "column", gap: 14 * size, ...fly(t, 0, { y: 18 }) }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 999, background: C.salmon, color: C.salmonText, display: "grid", placeItems: "center", fontFamily: F.display, fontSize: 21 }}>M</div>
        <div style={{ fontWeight: 600, fontSize: 19 }}>Maya</div>
        <div style={{ marginLeft: "auto", fontSize: 15, color: C.faint }}>Messages</div>
      </div>
      <Bubble who="person" style={{ fontSize: 21 * size, ...fly(t, 0.5, { y: 10 }) }}>
        {ASK}
      </Bubble>
      <div style={{ display: "flex", alignItems: "center", gap: 12, ...fly(t, 1.3, { y: 8 }) }}>
        <Pill size={16}>Maya’s Agent</Pill>
        <span style={{ fontSize: 16, color: C.muted }}>
          {working ? `Working on ${PLACES.length} errands · ${doneCount} done` : t >= REPLY ? "Just now" : ""}
        </span>
      </div>
      {t >= REPLY ? <Bubble who="agent" style={{ fontSize: 21 * size }}>{typed(t, REPLY, DONE, 60)}</Bubble> : null}
    </Card>
  );
}

function Place({ t, i, x, y, w, h, compact = false }: { t: number; i: number; x: number; y: number; w: number; h: number; compact?: boolean }) {
  const place = PLACES[i];
  const arrive = sentAt(i) + 0.8;
  const busy = lit(t, arrive, doneAt(i), 0.2);
  const done = prog(t, doneAt(i), 0.35);
  const edge = Math.max(busy, done);
  return (
    <Card
      x={x}
      y={y}
      w={w}
      h={h}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: compact ? "0 18px" : "0 24px",
        borderRadius: 22,
        border: `${1 + 0.5 * edge}px solid ${mix("#E7E2DA", "#281910", edge)}`,
        ...fly(t, 0.7 + i * 0.12, { x: 18, y: 0 }),
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: F.display, fontWeight: 500, fontSize: compact ? 22 : 26, letterSpacing: "-0.02em", lineHeight: 1.1 }}>{place.name}</div>
        <div style={{ marginTop: 6, fontFamily: MONO, fontSize: compact ? 13 : 15, color: C.muted }}>{place.how}</div>
      </div>
      {done > 0 ? (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: compact ? 15 : 17, fontWeight: 500, color: C.liveText, opacity: done }}>
          <Check size={compact ? 18 : 22} on={done} /> {compact ? "" : "Done"}
        </span>
      ) : busy > 0 ? (
        <span style={{ fontSize: compact ? 14 : 16, color: C.alertText, opacity: busy }}>{compact ? "…" : "Working…"}</span>
      ) : null}
    </Card>
  );
}

/** The hero: one message to the person's agent fans out to five organizations, each reached a different way. */
export const HERO_SCENE: DiagramScene = {
  loop: 14,
  still: 12.5,
  wide: { w: 1600, h: 700 },
  compact: { w: 720, h: 540 },
  render: (t, compact) => {
    if (compact) {
      return (
        <>
          <Thread t={t} x={28} y={22} w={664} h={300} size={0.86} />
          {PLACES.map((_, i) => (
            <Place key={i} t={t} i={i} x={28 + (i % 2) * 340} y={342 + Math.floor(i / 2) * 64} w={i === 4 ? 324 : 324} h={54} compact />
          ))}
        </>
      );
    }
    const rowH = 96;
    const gap = 20;
    const top = (700 - (PLACES.length * rowH + (PLACES.length - 1) * gap)) / 2;
    const thread = { x: 110, y: 150, w: 600, h: 400 };
    const origin: [number, number] = [thread.x + thread.w, thread.y + thread.h / 2];
    return (
      <>
        <Wires w={1600} h={700}>
          {PLACES.map((_, i) => {
            const y = top + i * (rowH + gap) + rowH / 2;
            return <Wire key={i} from={origin} to={[1000, y]} t={t} at={1.5 + i * 0.1} dur={0.7} bend={0.5} packets={[sentAt(i)]} />;
          })}
        </Wires>
        <Thread t={t} {...thread} />
        {PLACES.map((_, i) => (
          <Place key={i} t={t} i={i} x={1000} y={top + i * (rowH + gap)} w={480} h={rowH} />
        ))}
      </>
    );
  },
};
