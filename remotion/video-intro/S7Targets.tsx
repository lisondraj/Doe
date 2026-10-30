import { AbsoluteFill, useCurrentFrame } from "remotion";

import { DotWave } from "../video1/backdrops";
import { ramp } from "../video1/motion";
import { C } from "../video1/theme";
import { Chapter, EASE_OUT, ON_BROWN, ON_BROWN_FAINT, Scene, beat, serif, wipe } from "./kit";
import { SEED } from "./seed";

const TARGETS = { at: 0, out: 270 };
const TABLE = { at: 270 };
export const S7_FRAMES = 560;

/**
 * /earlypreview's "Target at Seed" screen, at $250K ARR: the lines top right with their figures in salmon, a salmon
 * dot wave across the middle, the two-line title bottom left. Then its targets table, priced at /pricing's rates.
 */
export function S7Targets() {
  const frame = useCurrentFrame();
  const wave = ramp(frame, 10, 50, EASE_OUT) * (1 - ramp(frame, TARGETS.out - 10, 30));
  return (
    <Scene tone="brown">
      <AbsoluteFill style={{ opacity: wave * 0.9, WebkitMaskImage: "linear-gradient(180deg, transparent 28%, #000 48%, #000 62%, transparent 82%)", maskImage: "linear-gradient(180deg, transparent 28%, #000 48%, #000 62%, transparent 82%)" }}>
        <DotWave top={0.3} amp={60} color={C.salmon} />
      </AbsoluteFill>
      <Chapter frame={frame} label="Seed Targets" at={12} dark />
      <Targets frame={frame} />
      <Table frame={frame} />
    </Scene>
  );
}

function Targets({ frame }: { frame: number }) {
  const layer = beat(frame, TARGETS.at, TARGETS.out);
  if (!layer) return null;
  return (
    <div style={layer}>
      <div style={{ position: "absolute", right: 120, top: 120, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 14 }}>
        {SEED.lines.map((line, i) => {
          const p = ramp(frame, 70 + i * 12, 24, EASE_OUT);
          return (
            <div key={line[0].text + i} style={{ ...serif(52, { color: ON_BROWN, lineHeight: "60px" }), opacity: p, transform: `translateY(${((1 - p) * 18).toFixed(2)}px)` }}>
              {line.map((part, k) => (
                <span key={k} style={{ color: part.figure ? C.salmon : undefined }}>
                  {part.text}
                </span>
              ))}
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 120, bottom: 110 }}>
        {SEED.title.map((t, i) => {
          const p = ramp(frame, 20 + i * 14, 40, EASE_OUT);
          return (
            <div key={t} style={{ ...serif(132, { lineHeight: "138px", letterSpacing: "-0.042em", color: i === 1 ? C.salmon : C.paper }), ...wipe(p), transform: `translateX(${((1 - p) * -24).toFixed(2)}px)` }}>
              {t}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── The targets table: practices by shape and plan, Canada and the U.S., and the ARR each adds ─── */

const COLS = { left: 120, label: 820, num: 300 };
const ROW_H = 96;

function Table({ frame }: { frame: number }) {
  const layer = beat(frame, TABLE.at, S7_FRAMES + 40);
  if (!layer) return null;
  const at = TABLE.at;
  const row = (i: number) => ramp(frame, at + 26 + i * 8, 24, EASE_OUT);
  const cells = (canada: number | string, us: number | string, arr: string, color: string, size: number) => (
    <>
      <span style={{ width: COLS.num, textAlign: "right", ...serif(size, { color }) }}>{canada.toLocaleString("en-US")}</span>
      <span style={{ width: COLS.num, textAlign: "right", ...serif(size, { color }) }}>{us.toLocaleString("en-US")}</span>
      <span style={{ flex: 1, textAlign: "right", ...serif(size, { color }) }}>{arr}</span>
    </>
  );
  const rows = SEED.table.rows;
  return (
    <div style={layer}>
      <div style={{ position: "absolute", left: COLS.left, top: 84, ...serif(96, { color: C.paper, letterSpacing: "-0.035em" }), ...wipe(ramp(frame, at + 6, 34, EASE_OUT)) }}>Targets by Practice</div>
      <div style={{ position: "absolute", left: COLS.left, right: 120, top: 250 }}>
        <div style={{ height: 64, display: "flex", alignItems: "center", opacity: row(0) }}>
          <span style={{ width: COLS.label }} />
          {cells("Canada", "U.S.", "ARR", ON_BROWN, 36)}
        </div>
        {rows.map((r, i) => {
          const p = row(i + 1);
          return (
            <div key={r.id} style={{ height: ROW_H, display: "flex", alignItems: "center", borderTop: `2px solid ${ON_BROWN_FAINT}`, opacity: p, transform: `translateY(${((1 - p) * 14).toFixed(2)}px)` }}>
              <span style={{ width: COLS.label, display: "flex", alignItems: "baseline", gap: 18 }}>
                <span style={serif(52, { color: C.paper })}>{r.plan ? `${r.name}, ${r.plan}` : r.name}</span>
                <span style={serif(36, { color: ON_BROWN })}>{r.price}/mo</span>
              </span>
              {cells(r.canada, r.us, r.arr, C.paper, 52)}
            </div>
          );
        })}
        <div style={{ height: ROW_H + 10, display: "flex", alignItems: "center", borderTop: `3px solid ${C.salmon}`, ...wipe(row(rows.length + 2)) }}>
          <span style={{ width: COLS.label, ...serif(60, { color: C.salmon }) }}>Paying</span>
          {cells(SEED.table.total.canada, SEED.table.total.us, SEED.table.total.arr, C.salmon, 60)}
        </div>
      </div>
      <div style={{ position: "absolute", left: COLS.left, top: 962, ...serif(30, { color: ON_BROWN }), opacity: ramp(frame, at + 100, 20) }}>
        Monthly at /pricing rates. Clinics have 3 providers; multi-site groups have 3 locations and 6 providers.
      </div>
    </div>
  );
}
