import { AbsoluteFill, useCurrentFrame } from "remotion";

import { DotWave } from "../video1/backdrops";
import { lerp, ramp } from "../video1/motion";
import { C } from "../video1/theme";
import { Chapter, EASE_IN_OUT, EASE_OUT, ON_BROWN, SAGE, Scene, Words, serif, wipe } from "./kit";

export const S6_FRAMES = 400;

/** The pre-seed raise by share: talent first, then compliance and security. Subcategories are shares of the whole raise and sum to it. */
const CATS: { name: string; pct: number; tone: string; subs: [string, number][] }[] = [
  { name: "Talent", pct: 40, tone: C.salmon, subs: [["Engineering in Toronto", 26], ["Product and Design", 8], ["Clinical Advisors", 6]] },
  { name: "Compliance and Security", pct: 18, tone: SAGE, subs: [["SOC 2 Type II", 6], ["HIPAA and PHIPA", 5], ["Security and Pen Testing", 4], ["Legal and Privacy", 3]] },
  { name: "Product and Infrastructure", pct: 14, tone: C.sand2, subs: [["Agent Channels: MCP, PAP, A2A, API", 6], ["Doe Index and Data", 5], ["Compute", 3]] },
  { name: "Go-to-Market", pct: 14, tone: C.sand3, subs: [["Conferences and Direct Sales", 6], ["Clinic Outreach", 5], ["Agent Partnerships", 3]] },
  { name: "U.S. Pilots", pct: 8, tone: "#B98A55", subs: [] },
  { name: "Reserve", pct: 6, tone: "#5C463A", subs: [] },
];

const BAR = { x: 160, y: 420, w: 1600, h: 160, gap: 8 };
const GROW_AT = 18;
/** Each category with subcategories takes a turn filling the bar. */
const FOCUS = { at: 100, len: 66, ease: 16 };
const FOCUSED = CATS.filter((c) => c.subs.length > 0);

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
/** A lighter shade of a tone, toward paper. */
const shade = (tone: string, t: number) => {
  const a = hex(tone);
  const b = hex(C.paper);
  return `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], t))).join(", ")})`;
};
const inkOn = (tone: string) => (tone === "#5C463A" ? C.paper : C.walnut);

/** How far each category is into its turn (0 overview, 1 filling the bar). */
function focusOf(frame: number) {
  return CATS.map((c) => {
    const k = FOCUSED.indexOf(c);
    if (k < 0) return 0;
    const start = FOCUS.at + k * FOCUS.len;
    return ramp(frame, start, FOCUS.ease, EASE_IN_OUT) * (1 - ramp(frame, start + FOCUS.len - FOCUS.ease, FOCUS.ease, EASE_IN_OUT));
  });
}

export function S6Funds() {
  const frame = useCurrentFrame();
  const focus = focusOf(frame);
  const f = Math.max(...focus);
  const fk = focus.indexOf(f);
  const free = BAR.w - BAR.gap * (CATS.length - 1);
  const widths = CATS.map((c, i) => lerp((free * c.pct) / 100, i === fk ? BAR.w : 0, f));
  const gap = BAR.gap * (1 - f);
  let x = BAR.x;
  const segs = CATS.map((c, i) => {
    const seg = { x, w: widths[i] };
    x += widths[i] + (widths[i] > 0.5 ? gap : 0);
    return seg;
  });
  const legend = 1 - ramp(f, 0, 0.35);
  const subs = ramp(f, 0.65, 0.35);
  const focused = fk >= 0 && f > 0 ? CATS[fk] : null;
  return (
    <Scene
      tone="brown"
      backdrop={
        <AbsoluteFill style={{ opacity: 0.28 }}>
          <DotWave top={0.76} amp={40} />
        </AbsoluteFill>
      }
    >
      <Chapter frame={frame} label="Use of Funds" at={12} dark />
      <div style={{ position: "absolute", left: 0, right: 0, top: 80, display: "flex", justifyContent: "center" }}>
        <Words text="Pre-Seed, by Share of the Raise" frame={frame} at={10} size={84} color={C.paper} align="center" />
      </div>

      {focused ? (
        <div style={{ position: "absolute", left: BAR.x, top: 290, display: "flex", alignItems: "baseline", gap: 24, opacity: f, ...wipe(f) }}>
          <span style={serif(68, { color: C.paper })}>{focused.name}</span>
          <span style={serif(68, { color: C.salmon })}>{focused.pct}%</span>
        </div>
      ) : null}

      {CATS.map((c, i) => {
        const grow = ramp(frame, GROW_AT + i * 6, 26, EASE_OUT);
        const s = segs[i];
        if (s.w < 0.5) return null;
        const isFocus = i === fk && f > 0;
        return (
          <div key={c.name} style={{ position: "absolute", left: s.x, top: BAR.y, width: s.w * grow, height: BAR.h, borderRadius: 22, overflow: "hidden", background: c.tone }}>
            {!isFocus || subs < 1 ? (
              <span style={{ position: "absolute", left: 24, top: 0, height: BAR.h, display: "flex", alignItems: "center", ...serif(64, { color: inkOn(c.tone) }), opacity: s.w > 110 ? ramp(frame, GROW_AT + 26 + i * 6, 12) * (1 - subs) : 0 }}>{c.pct}%</span>
            ) : null}
            {isFocus ? <SubSegments cat={c} width={s.w} p={subs} /> : null}
          </div>
        );
      })}

      {focused ? <SubLabels cat={focused} p={subs} /> : null}

      <div style={{ position: "absolute", left: BAR.x, top: 650, width: BAR.w, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", rowGap: 36, opacity: legend * ramp(frame, 56, 20) }}>
        {CATS.map((c) => (
          <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: c.tone, flexShrink: 0 }} />
            <span style={serif(42, { color: C.paper })}>{c.name}</span>
            <span style={serif(42, { color: ON_BROWN })}>{c.pct}%</span>
          </div>
        ))}
      </div>
    </Scene>
  );
}

/** The focused bar split into its subcategories, each a lighter shade, each with its share of the raise. */
function SubSegments({ cat, width, p }: { cat: (typeof CATS)[number]; width: number; p: number }) {
  if (p <= 0) return null;
  const gap = 6;
  const free = width - gap * (cat.subs.length - 1);
  let x = 0;
  return (
    <>
      {cat.subs.map(([name, pct], j) => {
        const w = (free * pct) / cat.pct;
        const left = x;
        x += w + gap;
        return (
          <div key={name} style={{ position: "absolute", left, top: 0, width: w, height: BAR.h, background: shade(cat.tone, 0.16 * j), opacity: p, borderLeft: j ? `${gap}px solid ${C.walnut}` : "none", boxSizing: "border-box", display: "flex", alignItems: "center", paddingLeft: 24 }}>
            <span style={serif(Math.min(72, w * 0.3), { color: C.walnut, transform: `translateY(${((1 - p) * 14).toFixed(2)}px)` })}>{pct}%</span>
          </div>
        );
      })}
    </>
  );
}

function SubLabels({ cat, p }: { cat: (typeof CATS)[number]; p: number }) {
  if (p <= 0) return null;
  const gap = 6;
  const free = BAR.w - gap * (cat.subs.length - 1);
  let x = BAR.x;
  return (
    <>
      {cat.subs.map(([name, pct], j) => {
        const w = (free * pct) / cat.pct;
        const left = x;
        x += w + gap;
        const q = ramp(p, j * 0.12, 0.6);
        return (
          <div key={name} style={{ position: "absolute", left: left + 6, top: BAR.y + BAR.h + 30, width: w - 24, ...serif(42, { color: C.paper, whiteSpace: "normal", lineHeight: "48px" }), opacity: q, transform: `translateY(${((1 - q) * 16).toFixed(2)}px)` }}>
            {name}
          </div>
        );
      })}
    </>
  );
}

