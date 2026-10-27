"use client";

import type { CSSProperties, ReactNode } from "react";

import { C, type DiagramScene, F, Toggle, fly, lit, prog, typed } from "@/components/doehealth-blog/diagrams/kit";
import { Board, COMPACT, Lock, Name, Panel, Row, Spacer, Tag, Text, Tick, TILES, WIDE, sizes } from "@/components/doehealth-blog/diagrams/ui";

function Bubble({ compact, mine = false, children, style }: { compact: boolean; mine?: boolean; children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        alignSelf: mine ? "flex-end" : "flex-start",
        maxWidth: "88%",
        padding: compact ? "11px 15px" : "14px 18px",
        borderRadius: 22,
        background: mine ? C.ink : "#F4EEDF",
        color: mine ? C.paper : C.walnut,
        fontSize: sizes(compact).text,
        lineHeight: 1.35,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** Done, working, or waiting: the status pill every row ends in. */
function Status({ compact, t, start, done }: { compact: boolean; t: number; start: number; done: number }) {
  if (t >= done)
    return (
      <Tag compact={compact} tone="allowed">
        <Tick /> Done
      </Tag>
    );
  if (t >= start)
    return (
      <Tag compact={compact} tone="review">
        Working
      </Tag>
    );
  return (
    <Tag compact={compact} tone="off">
      Waiting
    </Tag>
  );
}

/* ------------------------------------------------------------------- hero */

const ERRANDS = [
  { name: "Physio clinic", how: "Tools" },
  { name: "Insurer", how: "Consent" },
  { name: "Airline", how: "Agent" },
  { name: "City permits", how: "Browser" },
  { name: "Pharmacy", how: "Phone" },
] as const;
const ASK = "Physio after work this week, move Friday’s flight, renew the permit, refill my prescription.";
const errandStart = (i: number) => 2.4 + i * 0.45;
const errandDone = (i: number) => errandStart(i) + 1.6 + (i >= 3 ? 1.4 : 0);

export const HERO_SCENE: DiagramScene = {
  loop: 11,
  still: 9.6,
  wide: { w: 1280, h: 560 },
  compact: COMPACT,
  render: (t, compact) => {
    const rows = compact ? ERRANDS.slice(0, 4) : ERRANDS;
    const list = (
      <Panel style={{ flex: compact ? undefined : 1.15, ...fly(t, 0.3, { y: 12 }) }}>
        {rows.map((e, i) => (
          <Row key={e.name} compact={compact} on={lit(t, errandStart(i), errandDone(i), 0.2)} style={fly(t, errandStart(i) - 0.3, { y: 8 })}>
            <span style={{ width: compact ? 30 : 36, height: compact ? 30 : 36, borderRadius: 11, background: TILES[i], flexShrink: 0 }} />
            <Name compact={compact}>{e.name}</Name>
            <Spacer />
            {compact ? null : <Text compact={compact}>{e.how}</Text>}
            <Status compact={compact} t={t} start={errandStart(i)} done={errandDone(i)} />
          </Row>
        ))}
      </Panel>
    );
    if (compact)
      return (
        <Board compact style={{ flexDirection: "column", gap: 14 }}>
          <Bubble compact mine style={fly(t, 0.2)}>
            Book physio after work this week.
          </Bubble>
          {list}
        </Board>
      );
    return (
      <Board compact={false} box={{ w: 1280, h: 560 }} style={{ alignItems: "stretch" }}>
        <Panel style={{ flex: 1, padding: 22, gap: 14, justifyContent: "flex-end", ...fly(t, 0, { y: 12 }) }}>
          <Bubble compact={false} mine>
            {typed(t, 0.4, ASK, 60) || "\u00a0"}
          </Bubble>
          <Bubble compact={false} style={{ ...fly(t, 8.4, { y: 8 }) }}>
            Done. Physio Thu 5:40, covered by your plan. Flight moved to Saturday.
          </Bubble>
        </Panel>
        {list}
      </Board>
    );
  },
};

/* ------------------------------------------------------------------ stack */

const LAYERS = [
  { name: "Poppy", does: "Finds the front door", pace: "Seconds" },
  { name: "MCP", does: "Calls a described tool", pace: "Seconds" },
  { name: "A2A", does: "Talks to their agent", pace: "Seconds" },
  { name: "OAuth", does: "Carries the person’s consent", pace: "Seconds" },
  { name: "Signed identity", does: "Proves who is asking", pace: "Seconds" },
  { name: "Browser and phone", does: "Works like a person", pace: "Minutes" },
] as const;

export const STACK_SCENE: DiagramScene = {
  loop: 9,
  still: 8,
  wide: WIDE,
  compact: COMPACT,
  render: (t, compact) => {
    const at = (i: number) => 0.6 + i * 0.9;
    return (
      <Board compact={compact}>
        <Panel style={{ flex: 1, gap: compact ? 6 : 8, ...fly(t, 0, { y: 12 }) }}>
          {LAYERS.map((l, i) => {
            const fallback = i === LAYERS.length - 1;
            return (
              <Row key={l.name} compact={compact} on={lit(t, at(i), at(i) + 0.9, 0.2)} style={{ ...fly(t, at(i) - 0.4, { y: 8 }), minHeight: compact ? 52 : 74 }}>
                <span style={{ width: compact ? 28 : 36, height: compact ? 28 : 36, borderRadius: 11, background: fallback ? "#E8DCC4" : TILES[i], flexShrink: 0 }} />
                <Name compact={compact}>{l.name}</Name>
                {compact ? null : <Text compact={false}>{l.does}</Text>}
                <Spacer />
                <Tag compact={compact} tone={fallback ? "review" : "allowed"}>
                  {l.pace}
                </Tag>
              </Row>
            );
          })}
        </Panel>
      </Board>
    );
  },
};

/* -------------------------------------------------------------------- mcp */

const TOOLS = [
  { name: "Find openings", asks: false },
  { name: "Book a visit", asks: true },
  { name: "Get prices", asks: false },
  { name: "Cancel a visit", asks: true },
] as const;
const M = { call1: 1.2, slots: 2.2, pick: 3.0, call2: 3.8, ask: 4.6, yes: 5.8, booked: 6.8 };

function mcpStatus(t: number) {
  if (t >= M.booked) return { tone: "allowed" as const, text: "Booked Thu 5:40" };
  if (t >= M.yes) return { tone: "allowed" as const, text: "Maya approved" };
  if (t >= M.ask) return { tone: "review" as const, text: "Asking Maya first" };
  if (t >= M.slots) return { tone: "muted" as const, text: "Three openings" };
  if (t >= M.call1) return { tone: "muted" as const, text: "Finding openings" };
  return { tone: "off" as const, text: "Ready" };
}

export const MCP_SCENE: DiagramScene = {
  loop: 10,
  still: 9,
  wide: WIDE,
  compact: COMPACT,
  render: (t, compact) => {
    const status = mcpStatus(t);
    const tools = (
      <Panel style={{ flex: 1, ...fly(t, 0, { y: 12 }) }}>
        <Row compact={compact} style={{ background: "transparent" }}>
          <Tag compact={compact} tone="review">
            Riverside Physio
          </Tag>
        </Row>
        {TOOLS.map((tool, i) => (
          <Row key={tool.name} compact={compact} on={i === 0 ? lit(t, M.call1, M.pick, 0.2) : i === 1 ? lit(t, M.call2, M.booked + 0.6, 0.2) : 0} style={fly(t, 0.3 + i * 0.12, { y: 8 })}>
            <Name compact={compact}>{tool.name}</Name>
            <Spacer />
            <Tag compact={compact} tone={tool.asks ? "review" : "muted"}>
              {tool.asks ? "Asks first" : "Read only"}
            </Tag>
          </Row>
        ))}
        {compact ? (
          <Row compact style={{ background: "transparent", marginTop: "auto" }}>
            <Tag compact tone="ink">
              Maya’s agent
            </Tag>
            <Tag compact tone={status.tone}>
              {status.tone === "allowed" ? <Tick /> : null}
              {status.text}
            </Tag>
          </Row>
        ) : null}
      </Panel>
    );
    if (compact)
      return (
        <Board compact style={{ flexDirection: "column" }}>
          {tools}
        </Board>
      );
    const slots = ["Thu 5:40", "Thu 6:20", "Fri 7:10"];
    return (
      <Board compact={false}>
        {tools}
        <Panel style={{ flex: 1, gap: 14, padding: 22, ...fly(t, 0.2, { y: 12 }) }}>
          <Tag compact={false} tone="ink" style={{ alignSelf: "flex-start" }}>
            Maya’s agent
          </Tag>
          <Bubble compact={false} mine style={fly(t, M.call1, { y: 8 })}>
            Find openings after 5 on Thursday
          </Bubble>
          <div style={{ display: "flex", gap: 8, ...fly(t, M.slots, { y: 8 }) }}>
            {slots.map((s, i) => (
              <Tag key={s} compact={false} tone={i === 0 && t >= M.pick ? "ink" : "muted"}>
                {s}
              </Tag>
            ))}
          </div>
          <Bubble compact={false} mine style={fly(t, M.call2, { y: 8 })}>
            Book Thursday at 5:40
          </Bubble>
          <div style={{ display: "flex", gap: 8, ...fly(t, M.ask, { y: 8 }) }}>
            <Tag compact={false} tone={t >= M.yes ? "allowed" : "review"}>
              {t >= M.yes ? <Tick /> : null}
              {t >= M.yes ? "Maya approved" : "Asking Maya first"}
            </Tag>
            {t >= M.booked ? (
              <Tag compact={false} tone="allowed" style={fly(t, M.booked, { y: 6 })}>
                <Tick /> Booked
              </Tag>
            ) : null}
          </div>
        </Panel>
      </Board>
    );
  },
};

/* -------------------------------------------------------------------- a2a */

const TASK_STATES = ["Submitted", "Working", "Needs input", "Completed"] as const;
const A = { submit: 1.0, working: 1.8, input: 3.2, answer: 4.4, done: 5.8 };
const A2A_MESSAGES: readonly { at: number; mine: boolean; text: string }[] = [
  { at: A.submit, mine: true, text: "Physio for Maya, Thursday after 5." },
  { at: A.input, mine: false, text: "Which plan should we bill?" },
  { at: A.answer, mine: true, text: "Sun Life, on file with you." },
  { at: A.done, mine: false, text: "Confirmed Thursday at 5:40." },
];

export const A2A_SCENE: DiagramScene = {
  loop: 9.5,
  still: 8.6,
  wide: WIDE,
  compact: COMPACT,
  render: (t, compact) => {
    const state = t >= A.done ? 3 : t >= A.input && t < A.answer + 0.6 ? 2 : t >= A.working ? 1 : t >= A.submit ? 0 : -1;
    const conversation = (
      <Panel style={{ flex: 1.3, gap: compact ? 10 : 14, padding: compact ? 16 : 22, ...fly(t, 0.2, { y: 12 }) }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {TASK_STATES.map((s, i) => (
            <Tag key={s} compact={compact} tone={i === state ? (i === 3 ? "allowed" : "ink") : i < state ? "muted" : "off"}>
              {i === state && i === 3 ? <Tick /> : null}
              {s}
            </Tag>
          ))}
        </div>
        {A2A_MESSAGES.slice(compact ? 1 : 0).map((m) =>
          t >= m.at ? (
            <Bubble key={m.text} compact={compact} mine={m.mine} style={fly(t, m.at, { y: 8 })}>
              {m.text}
            </Bubble>
          ) : null,
        )}
      </Panel>
    );
    if (compact)
      return (
        <Board compact style={{ flexDirection: "column" }}>
          {conversation}
        </Board>
      );
    return (
      <Board compact={false}>
        <Panel style={{ flex: 1, ...fly(t, 0, { y: 12 }) }}>
          <Row compact={false} style={{ background: "transparent" }}>
            <Tag compact={false} tone="review">
              Riverside front desk
            </Tag>
          </Row>
          {["Book a visit", "Check coverage", "Move a visit"].map((skill, i) => (
            <Row key={skill} compact={false} on={i === 0 ? lit(t, A.submit, A.done + 0.8, 0.2) : i === 1 ? lit(t, A.input, A.answer + 0.6, 0.2) : 0}>
              <Name compact={false}>{skill}</Name>
            </Row>
          ))}
          <Row compact={false} style={{ marginTop: "auto", background: "transparent" }}>
            <Lock />
            <Text compact={false}>Systems stay private</Text>
          </Row>
        </Panel>
        {conversation}
      </Board>
    );
  },
};

/* ------------------------------------------------------------------ oauth */

const O = { scopes: 1.0, allow: 2.6, token: 3.2, stepUp: 5.8, payOk: 7.2 };

export const OAUTH_SCENE: DiagramScene = {
  loop: 10,
  still: 9,
  wide: WIDE,
  compact: COMPACT,
  render: (t, compact) => {
    const pay = prog(t, O.payOk, 0.3);
    const scopes = [
      { name: "See openings", on: prog(t, O.scopes, 0.3) },
      { name: "Book visits", on: prog(t, O.scopes + 0.6, 0.3) },
      { name: "Pay a bill", on: pay },
    ];
    const consent = (
      <Panel style={{ flex: 1, ...fly(t, 0, { y: 12 }) }}>
        <Row compact={compact} style={{ background: "transparent" }}>
          <Tag compact={compact} tone="ink">
            Maya’s agent
          </Tag>
          <Text compact={compact}>would like to</Text>
        </Row>
        {scopes.map((s, i) => (
          <Row key={s.name} compact={compact} on={i === 2 ? lit(t, O.stepUp, O.payOk + 0.8, 0.2) : 0}>
            <Name compact={compact}>{s.name}</Name>
            <Spacer />
            {i === 2 && t >= O.stepUp && t < O.payOk ? (
              <Tag compact={compact} tone="review">
                Asks again
              </Tag>
            ) : null}
            <Toggle on={s.on} />
          </Row>
        ))}
        <Row compact={compact} style={{ background: "transparent", marginTop: "auto", justifyContent: "flex-end" }}>
          <Tag compact={compact} tone={t >= O.allow ? "allowed" : "ink"}>
            {t >= O.allow ? <Tick /> : null}
            {t >= O.allow ? "Allowed by Maya" : "Allow"}
          </Tag>
        </Row>
      </Panel>
    );
    if (compact)
      return (
        <Board compact style={{ flexDirection: "column" }}>
          {consent}
        </Board>
      );
    const token = [
      ["For", "Maya Chen"],
      ["Agent", "Maya’s agent"],
      ["Valid at", "Riverside only"],
      ["Expires", "In one hour"],
    ] as const;
    return (
      <Board compact={false}>
        {consent}
        <Panel dark style={{ flex: 0.9, padding: 22, gap: 6, ...fly(t, O.token, { y: 12 }) }}>
          {token.map(([k, v], i) => (
            <div key={k} style={{ display: "flex", alignItems: "center", minHeight: 62, gap: 16, borderBottom: i < token.length - 1 ? "1px solid rgba(255, 252, 241, 0.12)" : "none", ...fly(t, O.token + 0.2 + i * 0.18, { y: 6 }) }}>
              <span style={{ fontSize: 22, color: "rgba(255, 252, 241, 0.6)", width: 110 }}>{k}</span>
              <Name compact={false} style={{ color: C.paper }}>
                {v}
              </Name>
            </div>
          ))}
          <div style={{ marginTop: "auto", ...fly(t, O.stepUp, { y: 6 }) }}>
            <Tag compact={false} tone={t >= O.payOk ? "allowed" : "review"}>
              {t >= O.payOk ? <Tick /> : null}
              {t >= O.payOk ? "Paying added" : "Paying needs consent"}
            </Tag>
          </div>
        </Panel>
      </Board>
    );
  },
};

/* ------------------------------------------------------------------ proxy */

const MANDATE = ["Book physio", "Up to $120", "Riverside only", "Until Friday"] as const;
const CHECKS = [
  { ask: "Which agent", answer: "Maya’s agent", ok: "Signed" },
  { ask: "For whom", answer: "Maya Chen", ok: "Verified" },
  { ask: "Within limits", answer: "$95 of $120", ok: "Inside" },
] as const;
const P = { mandate: 0.4, check: 3.0, accept: 6.4 };

export const PROXY_SCENE: DiagramScene = {
  loop: 9.5,
  still: 8.6,
  wide: WIDE,
  compact: COMPACT,
  render: (t, compact) => {
    const checks = (
      <Panel style={{ flex: 1.2, ...fly(t, compact ? 0 : 2.4, { y: 12 }) }}>
        <Row compact={compact} style={{ background: "transparent" }}>
          <Tag compact={compact} tone="review">
            Riverside Physio
          </Tag>
        </Row>
        {CHECKS.map((c, i) => {
          const at = P.check + i * 1.0;
          return (
            <Row key={c.ask} compact={compact} on={lit(t, at, at + 1, 0.2)}>
              {compact ? null : <Text compact={false}>{c.ask}</Text>}
              <Name compact={compact}>{c.answer}</Name>
              <Spacer />
              <Tag compact={compact} tone={t >= at + 0.5 ? "allowed" : "off"}>
                {t >= at + 0.5 ? <Tick /> : null}
                {c.ok}
              </Tag>
            </Row>
          );
        })}
        <Row compact={compact} style={{ background: "transparent", marginTop: "auto", justifyContent: "flex-end" }}>
          <Tag compact={compact} tone={t >= P.accept ? "ink" : "off"}>
            {t >= P.accept ? "Request accepted" : "Checking"}
          </Tag>
        </Row>
      </Panel>
    );
    if (compact)
      return (
        <Board compact style={{ flexDirection: "column" }}>
          {checks}
        </Board>
      );
    return (
      <Board compact={false}>
        <Panel style={{ flex: 0.8, ...fly(t, 0, { y: 12 }) }}>
          <Row compact={false} style={{ background: "transparent" }}>
            <Tag compact={false} tone="ink">
              Maya signed
            </Tag>
          </Row>
          {MANDATE.map((m, i) => (
            <Row key={m} compact={false} style={fly(t, P.mandate + i * 0.3, { y: 8 })}>
              <Name compact={false}>{m}</Name>
            </Row>
          ))}
        </Panel>
        {checks}
      </Board>
    );
  },
};

/* ---------------------------------------------------------------- screens */

const FORM = [
  ["Name", "Maya Chen"],
  ["Service", "Physio, new patient"],
  ["Time", "Thursday 5:40"],
] as const;
const S = { fill: 0.8, stuck: 4.0, call: 1.2 };

function clock(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export const SCREENS_SCENE: DiagramScene = {
  loop: 10,
  still: 9,
  wide: WIDE,
  compact: COMPACT,
  render: (t, compact) => {
    const stuck = t >= S.stuck;
    const browser = (
      <Panel style={{ flex: 1, ...fly(t, 0, { y: 12 }) }}>
        {FORM.map(([k, v], i) => {
          const at = S.fill + i * 0.9;
          return (
            <Row key={k} compact={compact} on={lit(t, at, at + 0.9, 0.15)}>
              {compact ? null : <Text compact={false} style={{ width: 100 }}>{k}</Text>}
              <span style={{ fontSize: sizes(compact).text, color: C.walnut }}>{typed(t, at, v, 26) || "\u00a0"}</span>
            </Row>
          );
        })}
        <Row compact={compact} on={stuck ? 1 : 0} style={{ ...fly(t, S.stuck, { y: 8 }) }}>
          <Lock />
          <Name compact={compact}>Confirm you are human</Name>
          <Spacer />
          <Tag compact={compact} tone="review">
            Stuck
          </Tag>
        </Row>
        {compact ? (
          <Row compact style={{ marginTop: "auto" }}>
            <Name compact>On hold</Name>
            <Spacer />
            <Name compact style={{ fontVariantNumeric: "tabular-nums" }}>
              {clock(240 + t * 6)}
            </Name>
          </Row>
        ) : null}
      </Panel>
    );
    if (compact)
      return (
        <Board compact style={{ flexDirection: "column" }}>
          {browser}
        </Board>
      );
    const steps = [
      { at: 2.2, text: "Pressed 1 for bookings" },
      { at: 3.6, text: "On hold" },
      { at: 7.2, text: "Talking to the front desk" },
    ];
    return (
      <Board compact={false}>
        {browser}
        <Panel style={{ flex: 0.85, padding: 22, ...fly(t, 0.3, { y: 12 }) }}>
          <Row compact={false} style={{ background: "transparent" }}>
            <Tag compact={false} tone="ink">
              Calling Riverside
            </Tag>
          </Row>
          <span style={{ fontFamily: F.display, fontSize: 84, letterSpacing: "-0.03em", lineHeight: 1.1, padding: "8px 18px", fontVariantNumeric: "tabular-nums" }}>
            {clock(Math.max(0, t - S.call) * 32)}
          </span>
          {steps.map((s) =>
            t >= s.at ? (
              <Row key={s.text} compact={false} style={fly(t, s.at, { y: 8 })}>
                <Text compact={false} style={{ color: C.walnut }}>
                  {s.text}
                </Text>
              </Row>
            ) : null,
          )}
        </Panel>
      </Board>
    );
  },
};
