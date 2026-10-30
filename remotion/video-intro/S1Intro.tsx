import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";

import { DotSphere } from "../video1/backdrops";
import { lerp, ramp, snapPx, typed } from "../video1/motion";
import { C, F } from "../video1/theme";
import { Chapter, Circle, EASE_IN_OUT, EASE_OUT, Lower, SAGE, Scene, serif, shots, trackOf, type Hold, type Pt } from "./kit";

export function S1Intro() {
  const frame = useCurrentFrame();
  return (
    <Scene>
      <Opening frame={frame} />
      <Pathways frame={frame} />
      <CodeScroll frame={frame} />
      <Chapter frame={frame} label="What Doe Is" at={PATHS_AT + 10} />
      {LANES.map((l, i) => (
        <Lower key={l.label} frame={frame} at={TOUR_AT + i * STEP + 14} out={TOUR_AT + (i + 1) * STEP - 4} title={l.detail} />
      ))}
    </Scene>
  );
}

/* ─── Opening: the /video1 sphere, held, then burst into a quiet dot field and the name ─── */

const SPHERE = { x: 960, y: 540, r: 410 };
const SPHERE_AT = 8;
/** Held longer than /video1 before it breaks; the burst itself is /video1's exactly. */
const BURST_AT = 96;
const BURST_DUR = 16;
const NAME_AT = BURST_AT + 12;
const LINE_AT = NAME_AT + 26;
const STATEMENT = ["We’re building the infrastructure connecting", "personal agents to healthcare."];

function Opening({ frame }: { frame: number }) {
  const sphereIn = ramp(frame, SPHERE_AT, 26, EASE_IN_OUT);
  const burst = ramp(frame, BURST_AT, BURST_DUR, Easing.bezier(0.35, 0, 0.85, 0.6));
  const zoom = ramp(frame, BURST_AT - 2, BURST_DUR + 2, Easing.bezier(0.5, 0, 0.9, 0.5));
  const field = ramp(frame, BURST_AT + 4, 50, EASE_OUT);
  const name = ramp(frame, NAME_AT, 44, EASE_OUT);
  const cam = panY(frame - PAN_FROM);
  if (cam > 1300) return null;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 1080, transform: `translateY(${snapPx(-cam)}px)` }}>
        <DotField reveal={field} />
      </div>
      {burst < 1 ? (
        <div style={{ position: "absolute", inset: 0, opacity: sphereIn, transform: `translateY(${lerp(0, 540 - SPHERE.y, zoom)}px) scale(${lerp(0.92, 1, sphereIn) * lerp(1, 1.6, zoom)})`, transformOrigin: `${SPHERE.x}px ${SPHERE.y}px` }}>
          <DotSphere cx={SPHERE.x} cy={SPHERE.y} radius={SPHERE.r} burst={burst} spin={Math.min(frame, BURST_AT)} />
        </div>
      ) : null}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 1080, transform: `translateY(${snapPx(-cam)}px)` }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 210, display: "flex", justifyContent: "center" }}>
          <div style={{ ...serif(400, { lineHeight: "400px", letterSpacing: "-0.04em" }), opacity: name, transform: `translateY(${((1 - name) * 26).toFixed(2)}px)` }}>Doe</div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 664, display: "flex", flexDirection: "column", alignItems: "center" }}>
          {STATEMENT.map((t, i) => {
            const p = ramp(frame, LINE_AT + i * 9, 36, EASE_OUT);
            return (
              <div key={t} style={{ ...serif(60, { color: "rgba(40, 25, 16, 0.58)", lineHeight: "76px", letterSpacing: "-0.015em" }), opacity: p, transform: `translateY(${((1 - p) * 14).toFixed(2)}px)` }}>
                {t}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
}

/**
 * A still, even dot grid that opens outward from where the sphere breaks, so the burst settles into a calm ground.
 * It thins out toward the top and bottom edges, so it leaves cleanly when the camera pans down.
 */
function DotField({ reveal }: { reveal: number }) {
  if (reveal <= 0) return null;
  const r = lerp(0, 1500, reveal);
  const radial = `radial-gradient(circle at ${SPHERE.x}px ${SPHERE.y}px, #000 ${(r - 420).toFixed(1)}px, transparent ${r.toFixed(1)}px)`;
  const edges = "linear-gradient(180deg, transparent 0%, #000 16%, #000 78%, transparent 100%)";
  return (
    <div style={{ position: "absolute", inset: 0, WebkitMaskImage: edges, maskImage: edges }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(40, 25, 16, 0.13) 2px, transparent 2.5px)", backgroundSize: "32px 32px", backgroundPosition: "16px 16px", WebkitMaskImage: radial, maskImage: radial }} />
    </div>
  );
}

/* ─── The Dynamic Index: /video1's code flythrough, pulled down from the name ── */

const CODE = { size: 86, lh: 116, x: 400 };
const GUTTER_W = 240;
const GUTTER_NUM = { size: 46, right: 48 };
const PAN_FROM = 236;
const CODE_DUR = 104;
const PAN_ACCEL = 28;
const PAN_CRUISE_END = 46;
const PAN_SLOW_END = 64;
const PAN_CRAWL = 0.24;
const BUILD_Y = 860;
const BUILD_CPS = 300;
const GUTTER_FROM_Y = 420;

/** Doe brown, a touch lighter than walnut; the same token colours as /video1. */
const CODE_BROWN = "#4A3324";
const INK = { punct: C.sand3, key: CODE_BROWN, string: C.alert, number: C.dot, keyword: C.dot, fn: CODE_BROWN, comment: C.sand3 };

const FILLER = [
  "// doe://maren-skin-clinic/index",
  "const clinic = {",
  '  "name": "Maren Skin Clinic",',
  '  "specialty": "aesthetics",',
  '  "city": "Toronto",',
  '  "accepting_new_patients": true,',
  "};",
  "",
  "const services = [",
  '  { "name": "botox_touch_up", "price": 420 },',
  '  { "name": "hydrafacial", "price": 260 },',
  '  { "name": "laser_3_sessions", "price": 1140 },',
  "];",
  "",
];
const BUILD = ["// synced live from the clinic’s calendar", "index.sync({", '  provider: "nina_patel_rn",', '  next_open: "2026-10-29T14:30",', "  deposit: 50,", "});"];

type Line = { text: string; build?: number; caretUntil?: number };
const LINES: Line[] = [...FILLER.map((text) => ({ text })), ...BUILD.map((text) => ({ text }))];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** Code rows sit below the name, in the same world the camera pans down. */
const rowTop = (row: number) => 1080 + 40 + row * CODE.lh;
const PAN_DIST = rowTop(LINES.length - 1) - BUILD_Y;
const panShape = (t: number) => EASE_IN_OUT(clamp01(t / PAN_ACCEL)) * lerp(1, PAN_CRAWL, EASE_IN_OUT(clamp01((t - PAN_CRUISE_END) / (PAN_SLOW_END - PAN_CRUISE_END))));
const PAN_STEP = 0.25;
const PAN_TABLE = (() => {
  const out = [0];
  for (let t = 0; t < CODE_DUR; t += PAN_STEP) out.push(out[out.length - 1] + PAN_STEP * panShape(t + PAN_STEP / 2));
  return out;
})();
const PAN_SPEED = PAN_DIST / PAN_TABLE[PAN_TABLE.length - 1];
/** Camera offset down the world: accelerates off the name, cruises, then crawls while the last lines are typed. */
function panY(f: number) {
  const i = Math.min(PAN_TABLE.length - 1, Math.max(0, f) / PAN_STEP);
  const lo = Math.floor(i);
  return PAN_SPEED * lerp(PAN_TABLE[lo], PAN_TABLE[Math.min(lo + 1, PAN_TABLE.length - 1)], i - lo);
}
LINES.forEach((line, row) => {
  if (row < FILLER.length) return;
  let f = 0;
  while (f < CODE_DUR && rowTop(row) - panY(f) > BUILD_Y + 30) f += 0.25;
  line.build = PAN_FROM + f;
});
LINES.forEach((line, row) => {
  if (line.build !== undefined) line.caretUntil = LINES[row + 1]?.build ?? Infinity;
});
const GUTTER_AT = (() => {
  let f = 0;
  while (f < CODE_DUR && rowTop(0) - panY(f) > GUTTER_FROM_Y) f += 0.25;
  return PAN_FROM + f;
})();

const TOKEN = /(\/\/.*$)|("(?:[^"\\]|\\.)*")(?=\s*:)|("(?:[^"\\]|\\.)*")|(\b\d+(?:\.\d+)?\b)|(\b(?:const|let|async|await|function|return|true|false|null|new)\b)|(\b[A-Za-z_][\w.]*(?=\())|(\b[A-Za-z_]\w*(?=:))/g;

function tokenize(text: string) {
  const out: { text: string; color: string; start: number }[] = [];
  let last = 0;
  for (const m of Array.from(text.matchAll(TOKEN))) {
    const at = m.index ?? 0;
    if (at > last) out.push({ text: text.slice(last, at), color: INK.punct, start: last });
    const color = m[1] ? INK.comment : m[2] ? INK.key : m[3] ? INK.string : m[4] ? INK.number : m[5] ? INK.keyword : m[6] ? INK.fn : INK.key;
    out.push({ text: m[0], color, start: at });
    last = at + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last), color: INK.punct, start: last });
  return out;
}

/** After the last line lands the code shrinks into the index card on the left of the pathways. */
const SETTLE = PAN_FROM + CODE_DUR + 4;
const SHRINK = { at: SETTLE, dur: 40 };
const CARD = { x: 90, y: 410, s: 0.24 };
const CARD_W = 1920 * CARD.s;
const CARD_H = 1080 * CARD.s;

function CodeScroll({ frame }: { frame: number }) {
  if (frame < PAN_FROM) return null;
  const cam = panY(frame - PAN_FROM);
  const shrink = ramp(frame, SHRINK.at, SHRINK.dur, EASE_IN_OUT);
  const first = Math.max(0, Math.floor((cam - 1080 - 40) / CODE.lh) - 1);
  const rows = Array.from({ length: Math.ceil(1080 / CODE.lh) + 3 }, (_, k) => first + k).filter((i) => i < LINES.length);
  const gutter = ramp(frame, GUTTER_AT, 10, EASE_IN_OUT);
  const s = lerp(1, CARD.s, shrink);
  const label = ramp(frame, SHRINK.at + SHRINK.dur - 10, 22, EASE_OUT);
  return (
    <AbsoluteFill style={{ zIndex: 6 }}>
      <div style={shots(frame, TOUR)}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1920,
          height: 1080,
          overflow: "hidden",
          transformOrigin: "0 0",
          transform: `translate(${(CARD.x * shrink).toFixed(3)}px, ${(CARD.y * shrink).toFixed(3)}px) scale(${s.toFixed(5)})`,
          borderRadius: (28 / CARD.s) * shrink,
          background: `rgba(255, 252, 241, ${shrink.toFixed(3)})`,
        }}
      >
        {gutter > 0 ? <div style={{ position: "absolute", left: 0, top: 0, width: GUTTER_W, height: 1080, background: C.ink, opacity: gutter }} /> : null}
        {rows.map((i) => {
          const line = LINES[i];
          const y = rowTop(i) - cam;
          const built = line.build === undefined ? line.text : typed(line.text, frame, line.build, BUILD_CPS);
          const typing = line.build !== undefined && built.length > 0 && built.length < line.text.length && frame < (line.caretUntil ?? Infinity);
          const shown = line.build === undefined || frame >= line.build;
          /** Rows cut by the top edge fade as the code becomes the card, so the card shows whole lines. */
          const clipped = y < 0 ? 1 - shrink : 1;
          return (
            <div key={i} style={{ opacity: clipped }}>
              {gutter > 0 && shown ? (
                <div style={{ position: "absolute", left: 0, width: GUTTER_W - GUTTER_NUM.right, top: y, height: CODE.lh, display: "flex", alignItems: "center", justifyContent: "flex-end", fontFamily: F.ui, fontWeight: 500, fontSize: GUTTER_NUM.size, color: "rgba(255, 252, 241, 0.5)", fontVariantNumeric: "tabular-nums", opacity: gutter }}>
                  {i + 1}
                </div>
              ) : null}
              <div style={{ position: "absolute", left: CODE.x, top: y, height: CODE.lh, display: "flex", alignItems: "center", whiteSpace: "pre", fontFamily: F.display, fontWeight: 500, fontSize: CODE.size, letterSpacing: "-0.015em" }}>
                {tokenize(line.text)
                  .filter((tk) => tk.start < built.length)
                  .map((tk) => (
                    <span key={tk.start} style={{ color: tk.color }}>
                      {tk.text.slice(0, built.length - tk.start)}
                    </span>
                  ))}
                {typing ? <span style={{ width: "0.45em", height: CODE.size * 1.05, marginLeft: 2, background: CODE_BROWN }} /> : null}
              </div>
            </div>
          );
        })}
      </div>
      {label > 0 ? (
        <div style={{ position: "absolute", left: CARD.x, width: CARD_W, top: CARD.y + CARD_H + 22, textAlign: "center", ...serif(40), opacity: label, transform: `translateY(${((1 - label) * 12).toFixed(2)}px)` }}>Doe Dynamic Index</div>
      ) : null}
      </div>
    </AbsoluteFill>
  );
}

/* ─── The pathways: dot lanes that branch from the index and meet at the agents ─── */

const PATHS_AT = SHRINK.at + 18;
const LANE = { gap: 120, from: 740, to: 1460 };
/** Where the lanes meet before splitting to the agents. */
const MEET = { x: 1630, y: 540 };
const AGENT_R = 60;
const AGENTS = [
  { name: "Muse", tone: C.salmon, x: 1800, y: 420 },
  { name: "Instinct", tone: SAGE, x: 1800, y: 660 },
];
const BRANCHES = AGENTS.map((g) =>
  trackOf([[MEET, { x: 1690, y: MEET.y }, { x: 1690, y: g.y }, { x: g.x - AGENT_R - 16, y: g.y }]]),
);
const LANES = [
  { label: "MCP", detail: "Every clinic gets its own MCP server" },
  { label: "Personal Agent Protocol (PAP)", detail: "Sierra × Meta: the patient approves what the agent can do" },
  { label: "Agent to Agent (A2A)", detail: "The patient’s agent talks to the clinic’s agent" },
  { label: "API", detail: "One verified endpoint for any agent" },
  { label: "Open Web", detail: "Clean pages for agents that browse and call" },
  { label: "Exa & Search", detail: "Indexed where agents search" },
].map((l, i, all) => {
  const k = i - (all.length - 1) / 2;
  const y = 540 + k * LANE.gap;
  const from: Pt = { x: CARD.x + CARD_W + 10, y: 540 + k * 40 };
  const track = trackOf([
    [from, { x: 650, y: from.y }, { x: 650, y }, { x: LANE.from, y }],
    [{ x: LANE.from, y }, { x: LANE.to, y }],
    [{ x: LANE.to, y }, { x: 1548, y }, { x: 1548, y: MEET.y }, MEET],
  ]);
  return { ...l, y, track, agent: i % 2 };
});

const TOUR_AT = PATHS_AT + 62;
const STEP = 60;
const WIDE_AT = TOUR_AT + LANES.length * STEP;
export const S1_FRAMES = WIDE_AT + 118;
const TOUR: Hold[] = [
  { at: 0, x: 960, y: 540, s: 1 },
  ...LANES.map((l, i) => ({ at: TOUR_AT + i * STEP + 12, x: 1230, y: l.y, s: 1.45, dur: i === 0 ? 30 : 18 })),
  { at: WIDE_AT + 30, x: 960, y: 540, s: 1, dur: 32 },
];
/** A packet's lit tail, in pixels behind its head. */
const TAIL = 110;
const SPEED = 14;

/** On the tour the lane in focus is full strength, its neighbours faint, and lanes three off gone, clear of the caption. */
const focusOf = (i: number, at: number) => {
  const d = Math.abs(i - at);
  return d <= 1 ? lerp(1, 0.3, d) : d <= 2 ? lerp(0.3, 0.14, d - 1) : lerp(0.14, 0, Math.min(1, d - 2));
};
/** The tour's position down the lanes, easing from one to the next as the camera moves. */
const tourAt = (frame: number) => LANES.slice(1).reduce((s, _, k) => s + ramp(frame, TOUR_AT + (k + 1) * STEP - 6, 18, EASE_IN_OUT), 0);

/** How lit a dot `d` along a track is with a packet's head at `head`: brightest at the head, gone past the tail. */
const litAt = (d: number, head: number) => (head >= d && head - d < TAIL ? 1 - (head - d) / TAIL : 0);

function Pathways({ frame }: { frame: number }) {
  if (frame < PATHS_AT) return null;
  const active = frame >= TOUR_AT && frame < WIDE_AT ? Math.floor((frame - TOUR_AT) / STEP) : -1;
  const touring = ramp(frame, TOUR_AT, 12) * (1 - ramp(frame, WIDE_AT, 18));
  const wide = ramp(frame, WIDE_AT, 24);
  const along = tourAt(frame);
  const title = ramp(frame, WIDE_AT + 34, 30, EASE_OUT);
  /** Each lane's packet head, along its lane and on into its agent's branch; -1 when none is running. */
  const heads = LANES.map((l, i) => {
    const total = l.track.length + BRANCHES[l.agent].length + TAIL;
    if (i === active) return ramp(frame - (TOUR_AT + i * STEP), 8, 48, EASE_IN_OUT) * total;
    if (wide > 0) return ((frame - WIDE_AT) * SPEED + i * 230) % (total + 260);
    return -1;
  });
  const arrive = AGENTS.map((_, a) =>
    Math.max(0, ...LANES.map((l, i) => (l.agent === a && heads[i] >= 0 ? Math.max(0, 1 - Math.abs(heads[i] - l.track.length - BRANCHES[a].length) / 90) : 0))),
  );
  return (
    <AbsoluteFill>
      <div style={shots(frame, TOUR)}>
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          {LANES.map((l, i) => {
            const reach = ramp(frame, PATHS_AT + i * 5, 46, EASE_IN_OUT) * l.track.length;
            const on = lerp(1, focusOf(i, along), touring);
            const accent = i === active ? C.salmon : C.walnut;
            return (
              <g key={l.label}>
                {l.track.dots.map((d, k) => {
                  if (reach <= 0 || d.d > reach) return null;
                  const lit = heads[i] >= 0 ? litAt(d.d, heads[i]) : 0;
                  return <circle key={k} cx={d.x} cy={d.y} r={3.2 + 2.6 * lit} fill={lit > 0.02 ? accent : C.walnut} fillOpacity={lerp(0.2 * on, 0.95, lit)} />;
                })}
              </g>
            );
          })}
          {BRANCHES.map((b, a) => {
            const reach = ramp(frame, PATHS_AT + 30, 26, EASE_IN_OUT) * b.length;
            return (
              <g key={a}>
                {b.dots.map((d, k) => {
                  if (reach <= 0 || d.d > reach) return null;
                  const lit = Math.max(0, ...LANES.map((l, i) => (l.agent === a && heads[i] >= 0 ? litAt(l.track.length + d.d, heads[i]) : 0)));
                  return <circle key={k} cx={d.x} cy={d.y} r={3.2 + 2.6 * lit} fill={lit > 0.02 && active >= 0 ? C.salmon : C.walnut} fillOpacity={lerp(0.22, 0.95, lit)} />;
                })}
              </g>
            );
          })}
        </svg>
        {LANES.map((l, i) => {
          const p = ramp(frame, PATHS_AT + i * 5 + 16, 22, EASE_OUT);
          const on = lerp(1, focusOf(i, along), touring);
          return (
            <div key={l.label} style={{ position: "absolute", left: LANE.from + 8, top: l.y - 66, ...serif(46, { lineHeight: "52px" }), opacity: p * on, transform: `translateX(${((1 - p) * 18).toFixed(2)}px)` }}>
              {l.label}
            </div>
          );
        })}
        {AGENTS.map((g, a) => {
          const p = ramp(frame, PATHS_AT + 40 + a * 8, 24, EASE_OUT);
          return (
            <div key={g.name} style={{ position: "absolute", left: g.x - 90, top: g.y - AGENT_R, width: 180, display: "flex", flexDirection: "column", alignItems: "center", opacity: p }}>
              <Circle size={AGENT_R * 2} tone={g.tone} style={{ transform: `scale(${(lerp(0.7, 1, p) * (1 + 0.07 * arrive[a])).toFixed(4)})` }} />
              <span style={{ marginTop: 10, ...serif(32) }}>{g.name}</span>
            </div>
          );
        })}
      </div>
      {title > 0 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 46, display: "flex", justifyContent: "center", opacity: title, transform: `translateY(${((1 - title) * 14).toFixed(2)}px)` }}>
          <span style={serif(84)}>One Index, Every Pathway</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
}
