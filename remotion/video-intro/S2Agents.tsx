import { AbsoluteFill, useCurrentFrame } from "remotion";

import { DotWave } from "../video1/backdrops";
import { lerp, ramp } from "../video1/motion";
import { C } from "../video1/theme";
import { Chapter, Circle, EASE_IN, EASE_OUT, ON_BROWN, SAGE, Scene, Words, beat, serif, trackOf, ui } from "./kit";

export const S2_FRAMES = 780;

export function S2Agents() {
  const frame = useCurrentFrame();
  return (
    <Scene
      tone="brown"
      backdrop={
        <AbsoluteFill style={{ opacity: 0.45 }}>
          <DotWave top={0.62} amp={56} />
        </AbsoluteFill>
      }
    >
      <Chapter frame={frame} label="Personal Agents, 2027" at={12} dark />
      <Errands frame={frame} />
      <Demand frame={frame} />
      <Walls frame={frame} />
    </Scene>
  );
}

const FAINT = "rgba(255, 252, 241, 0.16)";

/* ─── Errands: everything gets done but the clinic ────────────────────────── */

const TASKS = ["Flight Rebooked", "Groceries Reordered", "Dinner for Four", "Bills Paid", "Taxes Filed", "Physio Appointment"];
const A = { at: 0, out: 236 };

function Errands({ frame }: { frame: number }) {
  const layer = beat(frame, A.at, A.out);
  if (!layer) return null;
  const stuck = ramp(frame, 168, 14);
  return (
    <div style={layer}>
      <div style={{ position: "absolute", left: 120, top: 340, width: 760 }}>
        <Words text="Agents Run the Errands Now." frame={frame} at={16} size={104} color={C.paper} />
      </div>
      <div style={{ position: "absolute", left: 1010, top: 196, display: "flex", flexDirection: "column", gap: 22 }}>
        {TASKS.map((t, i) => {
          const last = i === TASKS.length - 1;
          const done = last ? 0 : ramp(frame, 64 + i * 16, 10);
          const p = ramp(frame, 24 + i * 7, 24, EASE_OUT);
          return (
            <div key={t} style={{ display: "flex", flexDirection: "column", opacity: p, transform: `translateX(${((1 - p) * 40).toFixed(2)}px)` }}>
              <div style={{ height: 84, display: "flex", alignItems: "center", gap: 28 }}>
                <div style={{ position: "relative", width: 52, height: 52 }}>
                  <div style={{ position: "absolute", inset: 0, borderRadius: 999, border: `3px solid ${FAINT}`, boxSizing: "border-box" }} />
                  <Circle size={52} tone={last ? C.salmon : SAGE} style={{ position: "absolute", inset: 0, opacity: last ? stuck : done, transform: `scale(${lerp(0.5, 1, last ? stuck : done).toFixed(4)})` }} />
                </div>
                <span style={serif(62, { color: last && stuck > 0.5 ? C.salmon : C.paper, opacity: last || done > 0.5 ? 1 : 0.55 })}>{t}</span>
              </div>
              {last ? <span style={{ marginLeft: 80, ...serif(38, { color: C.salmon }), opacity: stuck }}>Call the clinic, 9 to 5</span> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Demand: real survey data, set big on the ground ─────────────────────── */

/** PYMNTS Intelligence, "From Assistive to Agentic AI," January 2026: 2,299 U.S. adults, interest by use case. */
const DEMAND = [
  { label: "Health and Wellness", pct: 71, health: true },
  { label: "Travel Planning", pct: 70 },
  { label: "Groceries and Meals", pct: 69 },
  { label: "Paying Bills", pct: 66 },
];
const B = { at: 246, out: 492 };
const BAR = { x: 760, w: 820, h: 76, top: 330, gap: 150 };

function Demand({ frame }: { frame: number }) {
  const layer = beat(frame, B.at, B.out);
  if (!layer) return null;
  return (
    <div style={layer}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 110, display: "flex", justifyContent: "center" }}>
        <Words text="Health Is What People Most Want an Agent For" frame={frame} at={B.at + 6} size={72} color={C.paper} align="center" />
      </div>
      {DEMAND.map((d, i) => {
        const grow = ramp(frame, B.at + 30 + i * 8, 44, EASE_OUT);
        const y = BAR.top + i * BAR.gap;
        const tone = d.health ? C.salmon : "rgba(255, 252, 241, 0.26)";
        return (
          <div key={d.label} style={{ position: "absolute", left: 140, top: y, height: BAR.h, display: "flex", alignItems: "center", opacity: ramp(frame, B.at + 22 + i * 6, 18) }}>
            <span style={{ width: BAR.x - 140, ...serif(50, { color: d.health ? C.salmon : C.paper }) }}>{d.label}</span>
            <div style={{ width: (BAR.w * d.pct * grow) / 100, height: BAR.h, borderRadius: 18, background: tone }} />
            <span style={{ marginLeft: 26, ...serif(84, { color: d.health ? C.salmon : C.paper }), opacity: ramp(frame, B.at + 64 + i * 8, 14) }}>{d.pct}%</span>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 140, top: 960, ...ui(20, 500, { color: ON_BROWN }), opacity: ramp(frame, B.at + 90, 16) }}>Interested in an AI agent doing it for them &middot; PYMNTS Intelligence, January 2026 &middot; 2,299 U.S. adults</div>
    </div>
  );
}

/* ─── Walls: the agent sends to each front desk, and every send piles up at a wall ─── */

const WALLS = ["Fax Machines", "Phone Trees", "PDF Intake Forms", "Patient Portals", "Voicemail"];
const C_AT = 502;
const AGENT = { x: 370, y: 640, r: 120 };
const WALL_X = 1130;
const LABEL_X = 1176;
const wallY = (i: number) => 404 + i * 116;
/** Each send leaves on a dotted track, speeds into the wall and bunches up against it. */
const REACH = { at: C_AT + 44, gap: 24, dur: 34 };
const PACKET = 6;
const TRACKS = WALLS.map((_, i) => {
  const from = { x: AGENT.x + AGENT.r + 22, y: AGENT.y + (i - 2) * 40 };
  const to = { x: WALL_X - 18, y: wallY(i) };
  return trackOf([[from, { x: 760, y: from.y }, { x: 760, y: to.y }, { x: 900, y: to.y }], [{ x: 900, y: to.y }, to]]);
});

function Walls({ frame }: { frame: number }) {
  const layer = beat(frame, C_AT, S2_FRAMES + 40);
  if (!layer) return null;
  const agentIn = ramp(frame, C_AT + 14, 26, EASE_OUT);
  return (
    <div style={layer}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 96, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Words text="Clinics Still Sit Behind" frame={frame} at={C_AT + 6} size={84} color={C.paper} align="center" />
        <Words text="Phones, Fax and Portals" frame={frame} at={C_AT + 16} size={84} color={C.paper} align="center" />
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        {TRACKS.map((tr, i) => {
          const t0 = REACH.at + i * REACH.gap;
          const head = ramp(frame, t0, REACH.dur, EASE_IN) * tr.length;
          if (head <= 0) return null;
          const squash = ramp(frame, t0 + REACH.dur, 12, EASE_OUT);
          const gap = lerp(18, 9, squash);
          return (
            <g key={WALLS[i]}>
              {tr.dots.map((d, k) => (d.d <= head - (PACKET - 1) * gap - 14 ? <circle key={k} cx={d.x} cy={d.y} r={3.2} fill={C.paper} fillOpacity={0.22} /> : null))}
              {Array.from({ length: PACKET }, (_, k) => {
                const at = head - k * gap;
                if (at < 0) return null;
                const q = tr.at(at);
                return <circle key={`p${k}`} cx={q.x} cy={q.y} r={lerp(5.5, 6.5, squash) - k * 0.35} fill={squash > 0.5 ? C.salmon : C.paper} fillOpacity={1 - k * 0.1} />;
              })}
            </g>
          );
        })}
      </svg>
      <div style={{ position: "absolute", left: AGENT.x - AGENT.r, top: AGENT.y - AGENT.r, opacity: agentIn, transform: `scale(${lerp(0.7, 1, agentIn).toFixed(4)})` }}>
        <Circle size={AGENT.r * 2} tone={C.salmon} />
      </div>
      <div style={{ position: "absolute", left: AGENT.x - 150, width: 300, top: AGENT.y + AGENT.r + 22, textAlign: "center", ...serif(44, { color: C.paper }), opacity: agentIn }}>Muse</div>
      {WALLS.map((w, i) => {
        const p = ramp(frame, C_AT + 20 + i * 6, 22, EASE_OUT);
        const hit = REACH.at + i * REACH.gap + REACH.dur;
        const blocked = ramp(frame, hit, 14);
        const jolt = Math.sin(Math.PI * ramp(frame, hit, 10)) * 6;
        return (
          <div key={w} style={{ opacity: p }}>
            <div style={{ position: "absolute", left: WALL_X - 4 + jolt, top: wallY(i) - 40, width: 8, height: 80, borderRadius: 8, background: C.paper, opacity: lerp(0.45, 0.9, blocked), transform: `scaleY(${lerp(0.4, 1, p).toFixed(4)})` }} />
            <div style={{ position: "absolute", left: LABEL_X + jolt * 0.5, top: wallY(i) - 45, height: 90, display: "flex", alignItems: "center", ...serif(66, { color: C.paper }), opacity: lerp(1, 0.55, blocked), transform: `translateX(${((1 - p) * 30).toFixed(2)}px)` }}>
              {w}
            </div>
          </div>
        );
      })}
    </div>
  );
}
