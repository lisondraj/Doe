"use client";

import type { ReactNode } from "react";

import { DOEHEALTH_DESK2_FIND } from "@/lib/doehealthdesk2/doehealthdesk2-story-copy";
import { DoeHealthDesk2RippleGrid } from "@/components/doehealth-desk2/DoeHealthDesk2RippleGrid";
import { cssVars as vars, scrollRamp as ramp } from "@/lib/doehealthdesk2/use-doehealthdesk2-scroll-lock";

/**
 * Every motion is a ramp over this layer's own progress: [start, end] in progress units. The title
 * wheel advances one title per `adv`; each drawing builds while its title is lit, then morphs into the
 * next one over `morph`.
 */
const RAMP = {
  introSwipe: [0, 0.7],
  draw0: [0.1, 1.4],
  morph1: [1.6, 2.2],
  adv1: [1.7, 2.3],
  chrome: [2.2, 2.6],
  typing: [2.6, 3.5],
  suggest: [2.85, 3.05],
  enter: [3.6, 3.7],
  load: [3.7, 4.1],
  page: [4.0, 4.8],
  morph2: [5.0, 5.6],
  adv2: [5.1, 5.7],
  draw2: [5.6, 6.8],
  morph3: [6.9, 7.5],
  adv3: [6.95, 7.55],
  draw3: [7.5, 8.7],
} as const;

/** Progress this layer needs: the last drawing finishes, then holds a beat before the section moves on. */
export const DOEHEALTH_DESK2_FIND_SPAN = 9.4;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
/** Eases the wheel and the morphs so they settle instead of stopping dead. */
const smooth = (t: number) => t * t * (3 - 2 * t);
/** 0 → 1 as `t` moves through [k, k + w]: one stroke's share of a drawing's progress. */
const seg = (t: number, k: number, w: number) => clamp01((t - k) / w);
/** Style for a stroke traced in by CSS (pathLength 1, dash offset from --draw). */
const draw = (value: number) => vars({ "--draw": value });

/*
 * Line drawings, one per title: product UI in deep beige strokes, no fill and no text. They share one
 * window frame (the iPhone's outline morphs into it), drawn by the layer.
 *
 * Each drawing is a list of rounded shapes plus its details (lines, glyphs, motion). Between drawings
 * the details undraw while every shape slides, resizes and re-rounds into its nearest shape in the
 * next drawing, so one drawing becomes the next. A shape with `at` draws in during its drawing's build
 * ([start, width] on that drawing's clock); one without arrives by the morph (the first drawing's
 * arrive from the iPhone's parts, morphed by the brown section).
 */
type Tone = "is-soft" | "is-faint" | "is-strong";
type Shape = { x: number; y: number; w: number; h: number; r: number; tone?: Tone; at?: readonly [number, number] };

const box = (x: number, y: number, w: number, h: number, r: number, tone?: Tone, at?: readonly [number, number]): Shape => ({ x, y, w, h, r, tone, at });
const dot = (cx: number, cy: number, r: number, tone?: Tone, at?: readonly [number, number]): Shape => box(cx - r, cy - r, r * 2, r * 2, r, tone, at);

type Art = {
  shapes: readonly Shape[];
  /** The clock its `at` shapes draw on. */
  clock: (p: number) => number;
  /** Its details' build [start, end], played backwards as it morphs out. */
  build: readonly [number, number];
  Detail: (props: { p: number }) => ReactNode;
};

/** Found: a search window whose results arrive from the iPhone and fill in, then one is picked. */
const ROWS = [112, 164, 216];
const FOUND: Art = {
  shapes: [
    box(44, 54, 312, 36, 18),
    dot(66, 71, 7),
    ...ROWS.flatMap((y) => [box(44, y, 312, 40, 10, "is-soft"), dot(70, y + 20, 11)]),
    box(40, 160, 320, 48, 13, "is-strong", [0.75, 0.15]),
    dot(330, 184, 10, undefined, [0.85, 0.08]),
  ],
  clock: (p) => ramp(p, RAMP.draw0),
  build: RAMP.draw0,
  Detail: ({ p }) => {
    const t = ramp(p, RAMP.draw0);
    return (
      <>
        <path d="m71 76 6 6" pathLength={1} style={draw(seg(t, 0.28, 0.06))} />
        <path d="M334 61q2 8 10 10q-8 2-10 10q-2-8-10-10q8-2 10-10Z" pathLength={1} className="is-soft" style={draw(seg(t, 0.25, 0.2))} />
        {ROWS.map((y, i) => (
          <g key={y}>
            <path d={`M92 ${y + 15}h96`} pathLength={1} className="is-soft" style={draw(seg(t, 0.48 + i * 0.1, 0.12))} />
            <path d={`M92 ${y + 26}h60`} pathLength={1} className="is-faint" style={draw(seg(t, 0.52 + i * 0.1, 0.1))} />
          </g>
        ))}
        <path d="m325 184 4 4 7-8" pathLength={1} style={draw(seg(t, 0.9, 0.1))} />
      </>
    );
  },
};

/** Characters in the typed address. */
const CHARS = 20;

/** Website: a browser. Its address gets typed by scroll, a suggestion opens, enter, and the page loads. */
const BROWSER: Art = {
  shapes: [
    dot(42, 50, 4, "is-soft"),
    dot(56, 50, 4, "is-soft"),
    dot(70, 50, 4, "is-soft"),
    box(80, 74, 280, 28, 14),
    dot(96, 88, 5, "is-soft"),
    box(44, 196, 64, 22, 11, undefined, [0.25, 0.3]),
    box(228, 132, 128, 88, 10, undefined, [0.1, 0.4]),
    dot(330, 154, 8, "is-soft", [0.4, 0.3]),
    ...[44, 152, 260].map((x, i) => box(x, 240, 96, 32, 8, "is-faint", [0.45 + i * 0.1, 0.25])),
  ],
  clock: (p) => ramp(p, RAMP.page),
  build: [RAMP.chrome[0], RAMP.page[1]],
  Detail: ({ p }) => {
    const chrome = ramp(p, RAMP.chrome);
    const typed = Math.round(ramp(p, RAMP.typing) * CHARS);
    const entered = ramp(p, RAMP.enter);
    const suggest = ramp(p, RAMP.suggest) * (1 - entered);
    const load = ramp(p, RAMP.load);
    const page = ramp(p, RAMP.page);
    return (
      <>
        <path d="M88 64V50a8 8 0 0 1 8-8h84a8 8 0 0 1 8 8v14" pathLength={1} style={draw(seg(chrome, 0, 0.5))} />
        <path d="M20 64h360" pathLength={1} className="is-faint" style={draw(seg(chrome, 0.1, 0.5))} />
        <path d="m44 82-6 6 6 6" pathLength={1} className="is-soft" style={draw(seg(chrome, 0.3, 0.3))} />
        <path d="m58 82 6 6-6 6" pathLength={1} className="is-faint" style={draw(seg(chrome, 0.35, 0.3))} />
        <path d="M20 114h360" pathLength={1} className="is-faint" style={draw(seg(chrome, 0.4, 0.6))} />

        {/* The address, one dash per character, then the caret after the last one. */}
        {Array.from({ length: CHARS }, (_, i) => (
          <path key={i} d={`M${110 + i * 8} 88h4`} className="is-solid is-char" style={{ opacity: i < typed ? 1 : 0 }} />
        ))}
        <path d={`M${108 + typed * 8} 81v14`} className="is-solid" style={{ opacity: chrome >= 1 && entered < 1 ? 1 : 0 }} />

        <g className="is-solid" style={{ opacity: suggest }}>
          <rect x="80" y="108" width="200" height="58" rx="10" />
          <rect x="86" y="114" width="188" height="22" rx="6" className="is-faint" />
          <circle cx="98" cy="125" r="4" className="is-soft" />
          <path d="M110 125h90" />
          <circle cx="98" cy="151" r="4" className="is-faint" />
          <path d="M110 151h60" className="is-faint" />
        </g>

        <path d="M20 114h360" pathLength={1} className="is-strong" style={{ ...draw(load), opacity: load > 0 ? 1 - page : 0 }} />

        <path d="M44 146h152" pathLength={1} className="is-strong" style={draw(seg(page, 0, 0.3))} />
        <path d="M44 164h128" pathLength={1} className="is-soft" style={draw(seg(page, 0.1, 0.3))} />
        <path d="M44 180h96" pathLength={1} className="is-faint" style={draw(seg(page, 0.15, 0.3))} />
        <path d="m236 210 30-32 22 20 16-12 44 24" pathLength={1} className="is-soft" style={draw(seg(page, 0.35, 0.35))} />
      </>
    );
  },
};

/** The month: 7 x 5 rounded day cells under a rounded header. */
const CELL = { x: 49, y: 96, w: 38, h: 30, dx: 44, dy: 36 };
const cell = (c: number, r: number) => ({ x: CELL.x + c * CELL.dx, y: CELL.y + r * CELL.dy });
/** Days with an event on them; today (col 3, row 2) gets the new booking. */
const BUSY = [
  [1, 0],
  [4, 0],
  [2, 1],
  [5, 1],
  [0, 2],
  [6, 2],
  [3, 3],
  [4, 3],
  [1, 4],
] as const;
const TODAY = cell(3, 2);

/** Calendar: a simple month screen. The week's events land on their days, then today is booked. */
const CALENDAR: Art = {
  shapes: [
    dot(42, 50, 4, "is-soft"),
    dot(56, 50, 4, "is-soft"),
    dot(70, 50, 4, "is-soft"),
    box(48, 62, 96, 18, 9, "is-soft"),
    box(302, 62, 50, 18, 9, "is-soft"),
    ...Array.from({ length: 35 }, (_, i) => {
      const { x, y } = cell(i % 7, Math.floor(i / 7));
      return box(x, y, CELL.w, CELL.h, 9, "is-faint");
    }),
    ...BUSY.map(([c, r], i) => {
      const { x, y } = cell(c, r);
      return box(x + 6, y + 19, 26, 6, 3, "is-soft", [0.12 + i * 0.05, 0.12]);
    }),
    box(TODAY.x - 3, TODAY.y - 3, CELL.w + 6, CELL.h + 6, 11, "is-strong", [0.7, 0.14]),
    box(TODAY.x + 6, TODAY.y + 19, 26, 6, 3, "is-strong", [0.86, 0.1]),
  ],
  clock: (p) => ramp(p, RAMP.draw2),
  build: RAMP.draw2,
  Detail: ({ p }) => {
    const t = ramp(p, RAMP.draw2);
    return (
      <>
        <path d="m276 66-4 5 4 5M288 66l4 5-4 5" pathLength={1} className="is-soft" style={draw(seg(t, 0, 0.1))} />
        <path d={`m${TODAY.x + 13} ${TODAY.y + 9} 4 4 8-8`} pathLength={1} style={draw(seg(t, 0.92, 0.08))} />
      </>
    );
  },
};

/** Updated: inside a window, a clinic card's switches turn on and the change runs out to each agent. */
const SWITCHES = [134, 178, 222];
const AGENTS = [
  { path: "M214 134c46 0 54-38 90-38", cx: 318, cy: 96 },
  { path: "M214 178c50 0 62-18 106-18", cx: 334, cy: 160 },
  { path: "M214 222c46 0 54 2 90 2", cx: 318, cy: 224 },
];
const UPDATES: Art = {
  shapes: [
    box(44, 56, 170, 208, 12, "is-soft"),
    dot(70, 86, 12),
    ...SWITCHES.map((y) => box(158, y - 9, 36, 18, 9, "is-soft")),
    ...AGENTS.flatMap(({ cx, cy }) => [dot(cx, cy, 14), dot(cx, cy, 4, "is-soft")]),
    ...AGENTS.map(({ cx, cy }, i) => dot(cx, cy, 22, "is-faint", [0.78 + i * 0.06, 0.1])),
  ],
  clock: (p) => ramp(p, RAMP.draw3),
  build: RAMP.draw3,
  Detail: ({ p }) => {
    const t = ramp(p, RAMP.draw3);
    return (
      <>
        <path d="M92 81h70" pathLength={1} className="is-soft" style={draw(seg(t, 0, 0.1))} />
        <path d="M92 94h42" pathLength={1} className="is-faint" style={draw(seg(t, 0.04, 0.1))} />
        {SWITCHES.map((y, i) => {
          const on = seg(t, 0.36 + i * 0.08, 0.1);
          return (
            <g key={y}>
              <path d={`M64 ${y}h${64 - i * 12}`} pathLength={1} className="is-faint" style={draw(seg(t, 0.08 + i * 0.06, 0.12))} />
              <rect x="158" y={y - 9} width="36" height="18" rx="9" pathLength={1} className="is-strong" style={draw(on)} />
              <circle cx={167 + 18 * on} cy={y} r="5" className="is-solid" style={{ opacity: seg(t, 0.2 + i * 0.06, 0.08) }} />
            </g>
          );
        })}
        {AGENTS.map(({ path, cx, cy }, i) => {
          const pulse = seg(t, 0.62 + i * 0.06, 0.14);
          return (
            <g key={cx + cy}>
              <path d={path} pathLength={1} className="is-faint" style={draw(seg(t, 0.46 + i * 0.06, 0.14))} />
              <path d={path} pathLength={1} className="is-pulse" style={{ ...vars({ "--pulse": pulse }), opacity: pulse > 0 && pulse < 1 ? 1 : 0 }} />
            </g>
          );
        })}
      </>
    );
  },
};

const ARTS = [FOUND, BROWSER, CALENDAR, UPDATES] as const;
/** The morph into drawing i + 1. */
const MORPHS = [RAMP.morph1, RAMP.morph2, RAMP.morph3] as const;

/** Shapes a morph lands on: the ones the next drawing doesn't draw in itself. */
const keys = (art: Art) => art.shapes.filter((s) => !s.at);

type Rect = { x: number; y: number; w: number; h: number; r: number };
type Pair<T extends Rect = Shape> = { a: T; b: T; fade?: "in" | "out" };
const centreGap = (a: Rect, b: Rect) =>
  Math.hypot(a.x + a.w / 2 - (b.x + b.w / 2), a.y + a.h / 2 - (b.y + b.h / 2)) + 0.5 * (Math.abs(a.w - b.w) + Math.abs(a.h - b.h));
/** A shape shrunk to a point at its own centre. */
const point = <T extends Rect>(s: T): T => ({ ...s, x: s.x + s.w / 2, y: s.y + s.h / 2, w: 0, h: 0, r: 0 });

/**
 * Pairs every shape of one drawing with one of the next, closest pairs first; paired shapes travel.
 * Leftover shapes of the next grow out of their own centre; leftovers of this one shrink into theirs.
 */
export function pairUp<T extends Rect>(from: readonly T[], to: readonly T[]): Pair<T>[] {
  const options = from.flatMap((a, i) => to.map((b, j) => ({ gap: centreGap(a, b), i, j }))).sort((x, y) => x.gap - y.gap);
  const usedA = new Set<number>();
  const usedB = new Set<number>();
  const pairs: Pair<T>[] = [];
  for (const { i, j } of options) {
    if (usedA.has(i) || usedB.has(j)) continue;
    usedA.add(i);
    usedB.add(j);
    pairs.push({ a: from[i], b: to[j] });
  }
  to.forEach((b, j) => usedB.has(j) || pairs.push({ a: point(b), b, fade: "in" }));
  from.forEach((a, i) => usedA.has(i) || pairs.push({ a, b: point(a), fade: "out" }));
  return pairs;
}

const PAIRS = MORPHS.map((_, i) => pairUp(ARTS[i].shapes, keys(ARTS[i + 1])));

const TONE_OPACITY = { "is-soft": 0.6, "is-faint": 0.32, "is-strong": 1 } as const;
const toneOpacity = (tone?: Tone) => (tone ? TONE_OPACITY[tone] : 1);
const toneWidth = (tone?: Tone) => (tone === "is-strong" ? 2 : 1.4);

/** The drawings' shared window frame, in the 400 x 320 drawing space. */
export const DOEHEALTH_DESK2_FIND_FRAME = { x: 20, y: 30, w: 360, h: 260, r: 16, opacity: 1, width: 1.4 } as const;
/** The first drawing's shapes that arrive from the iPhone's parts, in the drawing space, with their stroke. */
export const DOEHEALTH_DESK2_FIND_ARRIVALS = keys(FOUND).map((s) => ({ x: s.x, y: s.y, w: s.w, h: s.h, r: s.r, opacity: toneOpacity(s.tone), width: toneWidth(s.tone) }));
/** The last drawing's shapes, in the drawing space, with their stroke; they gather into the closing search box. */
export const DOEHEALTH_DESK2_FIND_LAST = UPDATES.shapes.map((s) => ({ x: s.x, y: s.y, w: s.w, h: s.h, r: s.r, opacity: toneOpacity(s.tone), width: toneWidth(s.tone) }));

/** One morph: every pair eased from its shape in this drawing to its shape in the next. */
function Morph({ pairs, m }: { pairs: readonly Pair[]; m: number }) {
  const mix = (a: number, b: number) => a + (b - a) * m;
  return (
    <>
      {pairs.map(({ a, b, fade }, i) => (
        <rect
          key={i}
          className="is-solid"
          x={mix(a.x, b.x)}
          y={mix(a.y, b.y)}
          width={mix(a.w, b.w)}
          height={mix(a.h, b.h)}
          rx={mix(a.r, b.r)}
          style={{
            strokeOpacity: mix(toneOpacity(a.tone), toneOpacity(b.tone)),
            strokeWidth: mix(toneWidth(a.tone), toneWidth(b.tone)),
            opacity: fade === "in" ? m : fade === "out" ? 1 - m : 1,
          }}
        />
      ))}
    </>
  );
}

/**
 * The beige stretch of the scroll-locked brown section: a wheel of titles (find you, website, tools,
 * kept updated). The lit title sits in the middle; its line drawing sits beside it (above on a phone)
 * and morphs into the next drawing as the titles roll. `p` is this layer's own progress (0 to
 * DOEHEALTH_DESK2_FIND_SPAN).
 */
export function DoeHealthDesk2FindScenes({ p }: { p: number }) {
  const titles = DOEHEALTH_DESK2_FIND.titles;
  const wheel = smooth(ramp(p, RAMP.adv1)) + smooth(ramp(p, RAMP.adv2)) + smooth(ramp(p, RAMP.adv3));
  const sweep = ramp(p, RAMP.introSwipe);

  return (
    <>
      {/* The ripple grid along the bottom width of the beige, under the drawings and titles. */}
      <div className="doehealth-desk2-find__ripple">
        <DoeHealthDesk2RippleGrid color="rgba(110, 92, 64, 0.8)" wheel={wheel} />
      </div>

      <div className="doehealth-desk2-find__art" aria-hidden="true">
        <svg className="doehealth-desk2-find__art-svg" viewBox="0 0 400 320" fill="none">
          <rect
            x={DOEHEALTH_DESK2_FIND_FRAME.x}
            y={DOEHEALTH_DESK2_FIND_FRAME.y}
            width={DOEHEALTH_DESK2_FIND_FRAME.w}
            height={DOEHEALTH_DESK2_FIND_FRAME.h}
            rx={DOEHEALTH_DESK2_FIND_FRAME.r}
            pathLength={1}
            style={draw(p >= 0 ? 1 : 0)}
          />
        </svg>
        {ARTS.map((art, i) => {
          const into = i > 0 ? MORPHS[i - 1] : null;
          const out = i < MORPHS.length ? MORPHS[i] : null;
          if ((into && p < into[1]) || (out && p >= out[1])) return null;
          const leaving = out !== null && p >= out[0];
          const t = art.clock(p);
          const { build, Detail } = art;
          // Morphing out, the shapes belong to the morph and the details play their build backwards.
          const detailP = leaving ? build[1] - (build[1] - build[0]) * ramp(p, [out[0], out[0] + 0.25]) : p;
          return (
            <svg key={i} className="doehealth-desk2-find__art-svg" viewBox="0 0 400 320" fill="none">
              {leaving
                ? null
                : art.shapes.map((s, j) => (
                    <rect key={j} x={s.x} y={s.y} width={s.w} height={s.h} rx={s.r} pathLength={1} className={s.tone} style={draw(s.at ? seg(t, s.at[0], s.at[1]) : p >= 0 ? 1 : 0)} />
                  ))}
              <Detail p={detailP} />
            </svg>
          );
        })}
        {MORPHS.map((range, i) =>
          p >= range[0] && p < range[1] ? (
            <svg key={i} className="doehealth-desk2-find__art-svg" viewBox="0 0 400 320" fill="none">
              <Morph pairs={PAIRS[i]} m={smooth(ramp(p, [range[0] + 0.1, range[1]]))} />
            </svg>
          ) : null,
        )}
      </div>

      <div className="doehealth-desk2-find__wheel">
        {titles.map((lines, i) => {
          const d = i - wheel;
          const ad = Math.abs(d);
          // Only the lit title shows: the next fades in as it rolls up, the last fades out above.
          const opacity = clamp01(1 - ad * 1.4);
          return (
            <div key={lines.join(" ")} className="doehealth-desk2-find__wheel-item" style={vars({ "--d": d, "--ad": ad, "--op": opacity })} aria-hidden={ad >= 0.5}>
              <h2 data-fit-two-lines className="doehealth-desk2-find__title doehealth-desk2-find__title--big is-deep" style={vars({ "--s": i === 0 ? sweep : 1 })}>
                {lines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h2>
            </div>
          );
        })}
      </div>
    </>
  );
}
