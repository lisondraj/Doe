"use client";

import { C, type DiagramScene, F, MONO, fly, lit, prog, typed } from "@/components/doehealth-blog/diagrams/kit";
import { Board, COMPACT, Lock, Name, Panel, Row, Spacer, Tag, Text, Tick, TILES, WIDE, sizes } from "@/components/doehealth-blog/diagrams/ui";

/* --------------------------------------------------------------- timeline */

const MONTHS = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"] as const;
type BarTone = "ink" | "salmon" | "sage" | "sand";
type GanttRow = { name: string; from: number; to: number; tone: BarTone };
const BAR: Record<BarTone, string> = { ink: C.ink, salmon: "#F6C9B2", sage: "#D6DEC6", sand: "#E8DCC4" };

const ROADMAP: readonly GanttRow[] = [
  { name: "The Index", from: 0, to: 2, tone: "ink" },
  { name: "Doe Auth", from: 2, to: 4, tone: "ink" },
  { name: "Integrations", from: 2, to: 8, tone: "sand" },
  { name: "PHI lanes", from: 8, to: 11, tone: "salmon" },
  { name: "PHIPA and HIPAA", from: 2, to: 11, tone: "sage" },
  { name: "SOC 2", from: 8, to: 11, tone: "sage" },
  { name: "Sandbox evals", from: 0, to: 11, tone: "sand" },
  { name: "Clinic metrics", from: 0, to: 11, tone: "sand" },
];

const TRACKS: readonly GanttRow[] = [
  { name: "The Index", from: 0, to: 2, tone: "ink" },
  { name: "Doe Auth", from: 2, to: 4, tone: "ink" },
  { name: "Integrations", from: 2, to: 8, tone: "sand" },
  { name: "PHI lanes", from: 8, to: 11, tone: "salmon" },
  { name: "PHIPA", from: 1.6, to: 8, tone: "sage" },
  { name: "HIPAA", from: 1.6, to: 8, tone: "sage" },
  { name: "Pen test", from: 2, to: 3.7, tone: "sage" },
  { name: "SOC 2", from: 6, to: 11, tone: "sage" },
  { name: "Sandbox evals", from: 0, to: 11, tone: "sand" },
  { name: "Clinic metrics", from: 0, to: 11, tone: "sand" },
];

function gantt(rows: readonly GanttRow[]): DiagramScene {
  const SWEEP = 6.5;
  return {
    loop: 10,
    still: 9,
    wide: WIDE,
    compact: COMPACT,
    render: (t, compact) => {
      const list = compact ? rows.slice(0, 5) : rows;
      const now = Math.min(1, prog(t, 0.4, SWEEP) * 1.0001) * MONTHS.length;
      const nameW = compact ? 150 : 230;
      const rowH = compact ? 50 : Math.min(58, (WIDE.h - 88 - 50) / list.length - 6);
      const gate = 8 / MONTHS.length;
      return (
        <Board compact={compact}>
          <Panel style={{ flex: 1, padding: compact ? 14 : 20, gap: compact ? 4 : 6 }}>
            <div style={{ display: "flex", paddingLeft: nameW, height: compact ? 30 : 38, alignItems: "center" }}>
              {MONTHS.map((m, i) => (
                <span key={m} style={{ flex: 1, fontSize: sizes(compact).tag, color: now > i ? C.walnut : C.faint, textAlign: "center" }}>
                  {compact ? m[0] : m}
                </span>
              ))}
            </div>
            <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: compact ? 4 : 6, flex: 1 }}>
              {list.map((r) => {
                const reveal = Math.max(0, Math.min(1, (now - r.from) / (r.to - r.from)));
                return (
                  <div key={r.name} style={{ display: "flex", alignItems: "center", height: rowH, borderRadius: 14, background: "rgba(244, 238, 223, 0.6)" }}>
                    <Name compact={compact} size={compact ? 20 : 24} style={{ width: nameW - 14, paddingLeft: 14 }}>
                      {r.name}
                    </Name>
                    <div style={{ position: "relative", flex: 1, height: "100%" }}>
                      <span
                        style={{
                          position: "absolute",
                          top: "22%",
                          bottom: "22%",
                          left: `${(r.from / MONTHS.length) * 100}%`,
                          width: `${(((r.to - r.from) * reveal) / MONTHS.length) * 100}%`,
                          borderRadius: 999,
                          background: BAR[r.tone],
                        }}
                      />
                    </div>
                  </div>
                );
              })}
              <span
                style={{
                  position: "absolute",
                  top: -4,
                  bottom: -4,
                  left: `calc(${nameW}px + (100% - ${nameW}px) * ${gate})`,
                  borderLeft: `2px dashed ${C.alert}`,
                  opacity: 0.7,
                }}
              />
              <span
                style={{
                  position: "absolute",
                  top: -4,
                  bottom: -4,
                  left: `calc(${nameW}px + (100% - ${nameW}px) * ${now / MONTHS.length})`,
                  width: 2,
                  background: C.ink,
                  opacity: now > 0 && now < MONTHS.length ? 0.8 : 0,
                }}
              />
            </div>
          </Panel>
        </Board>
      );
    },
  };
}

export const ROADMAP_SCENE = gantt(ROADMAP);
export const TRACKS_SCENE = gantt(TRACKS);

/* ---------------------------------------------------------------- profile */

type Field = { label: string; value: string; read: string };

function profile(clinic: string, initial: string, fields: readonly Field[]): DiagramScene {
  const at = (i: number) => 1.4 + i * 1.0;
  const done = at(fields.length);
  return {
    loop: done + 3.4,
    still: done + 2.4,
    wide: WIDE,
    compact: COMPACT,
    render: (t, compact) => {
      const list = compact ? fields.slice(0, 4) : fields;
      const editor = (
        <Panel style={{ flex: 1.15, ...fly(t, 0, { y: 12 }) }}>
          <Row compact={compact} style={{ background: "transparent" }}>
            <span style={{ width: 36, height: 36, borderRadius: 11, background: TILES[5], display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: F.display, fontSize: 20 }}>{initial}</span>
            <Name compact={compact}>{clinic}</Name>
            <Spacer />
            <Tag compact={compact} tone={t >= 0.8 ? "allowed" : "off"}>
              {t >= 0.8 ? <Tick /> : null}
              Verified
            </Tag>
          </Row>
          {list.map((f, i) => (
            <Row key={f.label} compact={compact} on={lit(t, at(i), at(i + 1), 0.15)}>
              {compact ? null : <Text compact={false} style={{ width: 120 }}>{f.label}</Text>}
              <span style={{ fontSize: sizes(compact).text, color: C.walnut, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{typed(t, at(i), f.value, 34) || "\u00a0"}</span>
            </Row>
          ))}
          <Row compact={compact} style={{ background: "transparent", marginTop: "auto", gap: 8 }}>
            <Tag compact={compact} tone={t >= done ? "allowed" : "off"}>
              No PHI
            </Tag>
            <Tag compact={compact} tone={t >= done + 0.4 ? "ink" : "off"}>
              Live to agents
            </Tag>
          </Row>
        </Panel>
      );
      if (compact)
        return (
          <Board compact style={{ flexDirection: "column" }}>
            {editor}
          </Board>
        );
      return (
        <Board compact={false}>
          {editor}
          <Panel dark style={{ flex: 0.85, padding: 26, gap: 14, justifyContent: "center", ...fly(t, 0.3, { y: 12 }) }}>
            {fields.map((f, i) => (
              <span key={f.label} style={{ fontFamily: MONO, fontSize: 19, lineHeight: 1.45, color: C.paper, whiteSpace: "pre-wrap", ...fly(t, at(i) + 0.5, { x: -10, y: 0 }) }}>
                {f.read}
              </span>
            ))}
          </Panel>
        </Board>
      );
    },
  };
}

export const INDEX_SCENE = profile("Queen West Family Health", "Q", [
  { label: "Services", value: "IUD insertion, Pap test, travel vaccines", read: 'services: ["iud", "pap", "travel"]' },
  { label: "Providers", value: "Dr. Amara Osei, accepting", read: 'provider: "Osei", accepting: true' },
  { label: "Coverage", value: "OHIP, Sun Life, Manulife", read: 'coverage: ["OHIP", "Sun Life"]' },
  { label: "Self-pay", value: "Travel consult, $85", read: "travel_consult: 85" },
  { label: "Offers", value: "Saturday flu clinic", read: 'offer: "flu-saturday"' },
]);

export const PROFILE_SCENE = profile("Harbourview Dental", "H", [
  { label: "Services", value: "Cleanings, implants, aligners", read: 'services: ["cleaning", "implant"]' },
  { label: "Providers", value: "Dr. A. Mensah, Dr. L. Okafor", read: 'providers: ["Mensah", "Okafor"]' },
  { label: "Hours", value: "Weekdays 8 to 6, Saturday 9 to 2", read: 'hours: "mon-fri 8-18"' },
  { label: "Insurance", value: "Sun Life, Manulife, Canada Life", read: "insurance: 3 plans" },
  { label: "Pricing", value: "New-patient exam, $95", read: "exam_new: 95" },
]);

/* ------------------------------------------------------------------- auth */

const NODES = [
  { name: "Maya", short: "M", tile: TILES[1] },
  { name: "Her agent", short: "A", tile: C.ink },
  { name: "Doe Auth", short: "D", tile: TILES[3] },
  { name: "Clinic", short: "C", tile: TILES[5] },
] as const;
const GRANT = [
  ["Clinic", "Queen West only"],
  ["Purpose", "Book a visit"],
  ["Expires", "In 7 days"],
  ["Password", "Never shared"],
] as const;
const AUTH_AT = [0.5, 1.6, 3.0, 4.6];

export const AUTH_SCENE: DiagramScene = {
  loop: 9,
  still: 8,
  wide: WIDE,
  compact: COMPACT,
  render: (t, compact) => {
    const here = AUTH_AT.reduce((n, a, i) => (t >= a ? i : n), -1);
    const s = sizes(compact);
    return (
      <Board compact={compact} style={{ flexDirection: "column" }}>
        <Panel style={{ flexDirection: "row", alignItems: "center", gap: compact ? 6 : 12, padding: compact ? 12 : 16 }}>
          {NODES.map((n, i) => (
            <div key={n.name} style={{ display: "flex", alignItems: "center", gap: compact ? 6 : 12, flex: 1, minWidth: 0 }}>
              <Row compact={compact} on={i === here ? 1 : 0} style={{ flex: 1, opacity: i <= here ? 1 : 0.45, justifyContent: compact ? "center" : "flex-start", padding: compact ? "0 6px" : undefined }}>
                <span style={{ width: compact ? 34 : 38, height: compact ? 34 : 38, borderRadius: 11, background: n.tile, color: n.tile === C.ink ? C.paper : C.walnut, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: F.display, fontSize: 20, flexShrink: 0 }}>
                  {n.short}
                </span>
                {compact ? null : <Name compact={false} size={24}>{n.name}</Name>}
              </Row>
              {i < NODES.length - 1 ? <span style={{ width: compact ? 10 : 18, height: 2, background: i < here ? C.ink : C.line2, flexShrink: 0 }} /> : null}
            </div>
          ))}
        </Panel>
        <Panel style={{ flex: 1, ...fly(t, AUTH_AT[1], { y: 12 }) }}>
          {GRANT.map(([k, v], i) => {
            const ok = t >= AUTH_AT[2] + 0.3 + i * 0.25;
            return (
              <Row key={k} compact={compact} style={{ minHeight: compact ? 50 : s.row }}>
                {compact ? null : <Text compact={false} style={{ width: 130 }}>{k}</Text>}
                <Name compact={compact}>{v}</Name>
                <Spacer />
                <Tag compact={compact} tone={ok ? "allowed" : "off"}>
                  {ok ? <Tick /> : null}
                  {ok ? "Checked" : "Pending"}
                </Tag>
              </Row>
            );
          })}
        </Panel>
      </Board>
    );
  },
};

/* ------------------------------------------------------------------ lanes */

const LANES = [
  { name: "Ask questions", phi: false },
  { name: "Offers and pricing", phi: false },
  { name: "Book visits", phi: true },
  { name: "Send documents", phi: true },
  { name: "Verify insurance", phi: true },
] as const;
const COLUMNS = ["Sandbox", "Pilot", "Live"] as const;
const L = { pilot: 1.6, live: 3.0, phiPilot: 4.4, gate: 6.4 };

function laneCol(t: number, phi: boolean) {
  if (!phi) return t >= L.live ? 2 : t >= L.pilot ? 1 : 0;
  return t >= L.gate ? 2 : t >= L.phiPilot ? 1 : 0;
}

export const LANES_SCENE: DiagramScene = {
  loop: 9.5,
  still: 8.6,
  wide: WIDE,
  compact: COMPACT,
  render: (t, compact) => {
    const nameW = compact ? 200 : 340;
    const open = t >= L.gate;
    return (
      <Board compact={compact}>
        <Panel style={{ flex: 1, padding: compact ? 14 : 20, gap: compact ? 6 : 8 }}>
          <div style={{ display: "flex", paddingLeft: nameW, height: compact ? 32 : 40, alignItems: "center" }}>
            {COLUMNS.map((c) => (
              <span key={c} style={{ flex: 1, textAlign: "center", fontSize: sizes(compact).tag, color: C.muted }}>
                {c}
              </span>
            ))}
          </div>
          <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: compact ? 6 : 8, flex: 1 }}>
            {LANES.map((lane) => {
              const col = laneCol(t, lane.phi);
              const held = lane.phi && !open;
              return (
                <Row key={lane.name} compact={compact} style={{ flex: 1, padding: 0, paddingLeft: compact ? 12 : 18 }}>
                  <Name compact={compact} size={compact ? 20 : 26} style={{ width: nameW - (compact ? 12 : 18) }}>
                    {lane.name}
                  </Name>
                  <div style={{ position: "relative", flex: 1, height: "100%" }}>
                    <span
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: `${((col + 0.5) / 3) * 100}%`,
                        transform: "translate(-50%, -50%)",
                        transition: "left 700ms cubic-bezier(0.32, 0.72, 0, 1)",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: compact ? 34 : 40,
                        height: compact ? 34 : 40,
                        borderRadius: 999,
                        background: col === 2 ? "#D6DEC6" : held ? "#F6C9B2" : C.ink,
                        color: col === 2 ? "#2F3B2A" : held ? "#7A3E26" : C.paper,
                      }}
                    >
                      {col === 2 ? <Tick size={26} /> : held ? <Lock size={22} /> : null}
                    </span>
                  </div>
                </Row>
              );
            })}
            <span
              style={{
                position: "absolute",
                top: "38%",
                bottom: -2,
                left: `calc(${nameW}px + (100% - ${nameW}px) * 2 / 3)`,
                borderLeft: `2px ${open ? "solid" : "dashed"} ${open ? "#6E9A5B" : C.alert}`,
                opacity: 0.8,
              }}
            />
          </div>
        </Panel>
      </Board>
    );
  },
};

/* -------------------------------------------------------------------- phi */

const CHART = [
  ["Name", true],
  ["Diagnoses", false],
  ["Date of birth", true],
  ["Medications", false],
  ["Allergies", false],
  ["Phone", true],
  ["Lab results", false],
  ["Visit notes", false],
  ["Member ID", true],
  ["Imaging", false],
  ["Family history", false],
  ["Visit type", true],
  ["Address", false],
  ["Preferred time", true],
  ["Referrals", false],
  ["Billing", false],
] as const;
const PH = { pick: 1.4, send: 3.0, key: 4.4, ledger: 5.4, release: 7.0 };

export const PHI_SCENE: DiagramScene = {
  loop: 9.5,
  still: 6.8,
  wide: WIDE,
  compact: COMPACT,
  render: (t, compact) => {
    const picked = t >= PH.pick;
    const chart = (
      <Panel style={{ flex: 1.2, flexDirection: "row", flexWrap: "wrap", alignContent: "flex-start", gap: compact ? 6 : 8, padding: compact ? 14 : 20, ...fly(t, 0, { y: 12 }) }}>
        {(compact ? CHART.slice(0, 12) : CHART).map(([f, need]) => (
          <Tag key={f} compact={compact} tone={picked ? (need ? "allowed" : "off") : "muted"} style={{ opacity: picked && !need ? 0.55 : 1 }}>
            {picked && need ? <Tick /> : null}
            {f}
          </Tag>
        ))}
        {compact ? (
          <div style={{ display: "flex", gap: 8, marginTop: "auto", width: "100%" }}>
            <Tag compact tone={t >= PH.key ? "review" : "off"}>
              <Lock /> Clinic’s key
            </Tag>
            <Tag compact tone={t >= PH.ledger ? "ink" : "off"}>
              Recorded
            </Tag>
          </div>
        ) : null}
      </Panel>
    );
    if (compact)
      return (
        <Board compact style={{ flexDirection: "column" }}>
          {chart}
        </Board>
      );
    const released = prog(t, PH.release, 0.6);
    return (
      <Board compact={false}>
        {chart}
        <Panel style={{ flex: 0.8, opacity: 1 - released * 0.65, ...fly(t, PH.send, { x: 16, y: 0 }) }}>
          {CHART.filter(([, need]) => need).map(([f], i) => (
            <Row key={f} compact={false} style={{ minHeight: 48, ...fly(t, PH.send + i * 0.12, { y: 6 }) }}>
              <Text compact={false} style={{ color: C.walnut }}>
                {f}
              </Text>
            </Row>
          ))}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: "auto" }}>
            <Tag compact={false} tone={t >= PH.key ? "review" : "off"}>
              <Lock /> Clinic’s own key
            </Tag>
            <Tag compact={false} tone={t >= PH.ledger ? "ink" : "off"}>
              Written to the Ledger
            </Tag>
          </div>
        </Panel>
      </Board>
    );
  },
};

/* ------------------------------------------------------------------ evals */

const EVAL_LANES = ["Questions", "Offers", "Booking", "Documents", "Insurance"] as const;
const RUN = 3.2;
/** One lane fails on the first run and is held; the second run passes clean. */
const FAIL = { lane: 3, attack: 5 };

function evals(side: "run" | "clinic"): DiagramScene {
  return {
    loop: RUN * 2 + 1.2,
    still: RUN * 2,
    wide: WIDE,
    compact: COMPACT,
    render: (t, compact) => {
      const attacks = compact ? 6 : 8;
      const run = t < RUN ? 0 : 1;
      const local = t - run * RUN;
      const filled = Math.floor(prog(local, 0.2, RUN - 0.8) * EVAL_LANES.length * attacks);
      const failing = run === 0 && filled > FAIL.lane * attacks + FAIL.attack;
      const matrix = (
        <Panel style={{ flex: 1.4, padding: compact ? 14 : 20, gap: compact ? 6 : 8 }}>
          {EVAL_LANES.map((lane, r) => {
            const laneFail = failing && r === FAIL.lane;
            return (
              <Row key={lane} compact={compact} on={laneFail ? 1 : 0} style={{ flex: 1 }}>
                <Name compact={compact} size={compact ? 20 : 26} style={{ width: compact ? 120 : 170 }}>
                  {lane}
                </Name>
                <div style={{ display: "flex", gap: compact ? 6 : 10, flex: 1 }}>
                  {Array.from({ length: attacks }, (_, c) => {
                    const n = r * attacks + c;
                    const fail = run === 0 && r === FAIL.lane && c === FAIL.attack;
                    const on = n < filled;
                    return (
                      <span
                        key={c}
                        style={{
                          width: compact ? 22 : 28,
                          height: compact ? 22 : 28,
                          borderRadius: 999,
                          background: !on ? "transparent" : fail ? "#F6C9B2" : "#D6DEC6",
                          boxShadow: on ? "none" : "inset 0 0 0 1.5px rgba(40, 25, 16, 0.18)",
                          transition: "background 160ms",
                        }}
                      />
                    );
                  })}
                </div>
                {compact ? null : (
                  <Tag compact={false} tone={laneFail ? "review" : run === 1 && r === FAIL.lane && filled > r * attacks ? "allowed" : "off"}>
                    {laneFail ? "Held" : run === 1 && r === FAIL.lane && filled > r * attacks ? "Fixed" : "Live"}
                  </Tag>
                )}
              </Row>
            );
          })}
        </Panel>
      );
      if (compact)
        return (
          <Board compact style={{ flexDirection: "column" }}>
            {matrix}
          </Board>
        );
      const pct = Math.round(prog(t, 0.2, RUN * 2 - 0.4) * 100);
      return (
        <Board compact={false}>
          {matrix}
          <Panel style={{ flex: 0.6, padding: 24, gap: 18, justifyContent: "center" }}>
            {side === "run" ? (
              <>
                <Name compact={false} size={64}>
                  Run {214 + run}
                </Name>
                <Tag compact={false} tone={failing ? "review" : "allowed"} style={{ alignSelf: "flex-start" }}>
                  {failing ? "Documents held" : <><Tick /> All lanes passing</>}
                </Tag>
              </>
            ) : (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <Name compact={false} size={64}>
                    {Math.round(70 + pct * 0.26)}%
                  </Name>
                  <Text compact={false}>Page complete</Text>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <Name compact={false} size={64}>
                    {Math.round(pct * 4.12)}
                  </Name>
                  <Text compact={false}>Questions answered</Text>
                </div>
              </>
            )}
          </Panel>
        </Board>
      );
    },
  };
}

export const EVALS_SCENE = evals("run");
export const WATCH_SCENE = evals("clinic");

/* ---------------------------------------------------------------- metrics */

const CLINICS = [
  { name: "Harbourview Dental", tile: TILES[5], reads: [12, 18, 15, 24, 29, 27, 36], reply: "4 min" },
  { name: "Queen West Physio", tile: TILES[2], reads: [8, 9, 14, 13, 17, 22, 21], reply: "11 min" },
  { name: "Annex Skin Clinic", tile: TILES[1], reads: [20, 26, 23, 31, 30, 38, 44], reply: "7 min" },
] as const;

function ClinicCard({ t, i, compact, start }: { t: number; i: number; compact: boolean; start: number }) {
  const c = CLINICS[i];
  const k = prog(t, start, 1.4);
  const max = Math.max(...c.reads);
  const total = c.reads.reduce((a, b) => a + b, 0);
  return (
    <Panel style={{ flex: 1, padding: compact ? 18 : 20, gap: compact ? 10 : 12, ...fly(t, start - 0.3, { y: 12 }) }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
        <span style={{ width: 30, height: 30, borderRadius: 10, background: c.tile, flexShrink: 0 }} />
        <Name compact={compact} size={compact ? 26 : 24}>
          {c.name}
        </Name>
      </div>
      <Name compact={compact} size={compact ? 56 : 60}>
        {Math.round(total * k)}
      </Name>
      <Text compact={compact}>Agent reads this week</Text>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 6, flex: 1, minHeight: 60 }}>
        {c.reads.map((v, j) => (
          <span key={j} style={{ flex: 1, height: `${(v / max) * 100 * prog(t, start + j * 0.08, 0.6)}%`, borderRadius: 6, background: j === c.reads.length - 1 ? C.ink : "#E8DCC4" }} />
        ))}
      </div>
      <Row compact={compact} style={{ minHeight: 48 }}>
        <Text compact={compact}>Median reply</Text>
        <Spacer />
        <Name compact={compact} size={24}>
          {c.reply}
        </Name>
      </Row>
    </Panel>
  );
}

export const METRICS_SCENE: DiagramScene = {
  loop: 9,
  still: 8,
  wide: WIDE,
  compact: COMPACT,
  render: (t, compact) => {
    if (compact) {
      const i = Math.min(CLINICS.length - 1, Math.floor(t / 3));
      return (
        <Board compact style={{ flexDirection: "column" }}>
          <ClinicCard key={i} t={t} i={i} compact start={i * 3 + 0.4} />
        </Board>
      );
    }
    return (
      <Board compact={false}>
        {CLINICS.map((c, i) => (
          <ClinicCard key={c.name} t={t} i={i} compact={false} start={0.4 + i * 0.4} />
        ))}
      </Board>
    );
  },
};

/* ----------------------------------------------------------------- layers */

const STACKED = [
  { when: "Nov–Dec", name: "Public clinic pages", data: "No PHI", tone: "allowed" },
  { when: "Jan–Feb", name: "A verified patient", data: "Identity", tone: "muted" },
  { when: "Mar–Jun", name: "Actions in the sandbox", data: "Synthetic", tone: "muted" },
  { when: "Q3 2027", name: "PHI through agents", data: "Gate cleared", tone: "review" },
] as const;

export const LAYERS_SCENE: DiagramScene = {
  loop: 9,
  still: 8,
  wide: WIDE,
  compact: COMPACT,
  render: (t, compact) => {
    const at = (i: number) => 0.6 + i * 1.5;
    const built = STACKED.reduce((n, _, i) => (t >= at(i) ? i : n), -1);
    return (
      <Board compact={compact}>
        <Panel style={{ flex: 1, flexDirection: "column-reverse", padding: compact ? 14 : 20, gap: compact ? 8 : 10 }}>
          {STACKED.map((l, i) => (
            <Row key={l.name} compact={compact} on={i === built ? 1 : 0} style={{ flex: 1, opacity: i <= built ? 1 : 0.3, transform: `translateY(${i <= built ? 0 : -10}px)`, transition: "opacity 500ms, transform 500ms" }}>
              {compact ? null : (
                <Tag compact={false} tone="paper" style={{ width: 110, justifyContent: "center" }}>
                  {l.when}
                </Tag>
              )}
              <Name compact={compact}>{l.name}</Name>
              <Spacer />
              <Tag compact={compact} tone={l.tone}>
                {l.data}
              </Tag>
            </Row>
          ))}
        </Panel>
      </Board>
    );
  },
};
