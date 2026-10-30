import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";

import { CAMERA_EASE, EASE_IN, EASE_IN_OUT, EASE_OUT, lerp, ramp, snapPx } from "../video1/motion";
import { C, F } from "../video1/theme";
import { ShadowsContext } from "../video1/ui";
import { Ico, type IcoName } from "../video6/kit";

export * from "../video6/kit";

/** Doe One's brown on /pricing; the dark chapters sit on it. */
export const BROWN = C.walnut;
export const ON_BROWN = "rgba(255, 252, 241, 0.62)";
export const ON_BROWN_FAINT = "rgba(255, 252, 241, 0.12)";
export const MONO = "ui-monospace, 'SF Mono', Menlo, monospace";

/** Frames each chapter overlaps the one before it in the film; the incoming chapter fades in over them. */
export const OVERLAP = 20;

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 1 until `at`, then eases to 0: the exit half of a build. */
export const leave = (frame: number, at: number, dur = 14) => 1 - ramp(frame, at, dur, EASE_IN);

/** Beige or brown ground, a backdrop that settles in, and no drop shadows anywhere inside. Isolated, so nothing inside stacks over the next chapter. */
export function Scene({ tone = "beige", backdrop, backdropAt = 6, children }: { tone?: "beige" | "brown"; backdrop?: ReactNode; backdropAt?: number; children: ReactNode }) {
  const frame = useCurrentFrame();
  return (
    <ShadowsContext.Provider value={false}>
      <AbsoluteFill style={{ background: tone === "brown" ? BROWN : C.beige, overflow: "hidden", isolation: "isolate", ...wipe(ramp(frame, 0, OVERLAP, EASE_IN_OUT), 0.45) }}>
        {backdrop ? <AbsoluteFill style={{ opacity: ramp(frame, backdropAt, 30, EASE_IN_OUT) }}>{backdrop}</AbsoluteFill> : null}
        {children}
      </AbsoluteFill>
    </ShadowsContext.Provider>
  );
}

/**
 * The /video1 bed from its cue, cropped before its tail winds down, and laid end to end with a short equal-power
 * crossfade at each seam so the loop never audibly restarts. The whole bed fades at both ends of the film.
 */
const BED = { from: 1236, to: 3510, fade: 18 };

export function Bed({ frames }: { frames: number }) {
  const len = BED.to - BED.from;
  const step = len - BED.fade;
  return (
    <>
      {Array.from({ length: Math.ceil(frames / step) }, (_, k) => (
        <Sequence key={k} from={k * step} durationInFrames={len} layout="none">
          <Audio
            src={staticFile("video1/BED.m4a")}
            startFrom={BED.from}
            endAt={BED.to}
            volume={(f) => {
              const fadeIn = k === 0 ? 1 : Math.sin((Math.PI / 2) * Math.min(1, f / BED.fade));
              const fadeOut = Math.cos((Math.PI / 2) * Math.max(0, Math.min(1, (f - (len - BED.fade)) / BED.fade)));
              return 0.2 * fadeIn * fadeOut * interpolate(k * step + f, [0, 15, frames - 45, frames], [0, 1, 1, 0], CLAMP);
            }}
          />
        </Sequence>
      ))}
    </>
  );
}

/** Chapter marker pinned top-left in screen space. */
/** Shown as a chapter opens, then it steps aside so it never sits on a title. */
export function Chapter({ frame, label, at = 0, out = at + 120, dark = false }: { frame: number; label: string; at?: number; out?: number; dark?: boolean }) {
  const p = ramp(frame, at, 22, EASE_OUT) * leave(frame, out);
  if (p <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 64,
        top: 56,
        height: 44,
        padding: "0 20px 0 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        borderRadius: 999,
        background: dark ? ON_BROWN_FAINT : C.paper,
        opacity: p,
        transform: `translateY(${(1 - p) * -10}px)`,
      }}
    >
      <div style={{ width: 12, height: 12, borderRadius: 999, background: dark ? C.salmon : C.ink }} />
      <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 17, color: dark ? C.paper : C.walnut, whiteSpace: "nowrap" }}>{label}</span>
    </div>
  );
}

/** Serif line that builds word by word. */
export function Words({ text, frame, at, size = 64, color = C.walnut, stagger = 3, out, align = "left", style }: { text: string; frame: number; at: number; size?: number; color?: string; stagger?: number; out?: number; align?: "left" | "center"; style?: CSSProperties }) {
  const gone = out === undefined ? 1 : leave(frame, out);
  return (
    <div style={{ fontFamily: F.display, fontWeight: 500, fontSize: size, lineHeight: `${Math.round(size * 1.1)}px`, letterSpacing: "-0.025em", color, textAlign: align, opacity: gone, ...style }}>
      {text.split(" ").map((word, i) => {
        const p = ramp(frame, at + i * stagger, 20, EASE_OUT);
        return (
          <span key={i} style={{ display: "inline-block", whiteSpace: "pre", opacity: p, transform: `translateY(${(1 - p) * size * 0.3}px)` }}>
            {word}
            {" "}
          </span>
        );
      })}
    </div>
  );
}

/* ─── Camera: still holds, single deliberate moves ───────────────────────── */

export type Hold = { at: number; x: number; y: number; s: number; dur?: number; dip?: number };

const W = 1920;
const H = 1080;
const MOVE = 44;

/**
 * Every hold is perfectly still and lands on whole device pixels, so type never crawls;
 * the camera only moves in the `dur` frames before a hold's `at`. A move without `dip`
 * zooms about its own fixed point (straight line on screen); with `dip` it eases back
 * out mid-flight, for long travels.
 */
export function shots(frame: number, list: Hold[]): CSSProperties {
  let from = list[0];
  for (let j = 1; j < list.length; j++) {
    const to = list[j];
    const dur = to.dur ?? MOVE;
    const start = to.at - dur;
    if (frame < start) break;
    if (frame < to.at) return frameStyle(moving(from, to, CAMERA_EASE((frame - start) / dur)), false);
    from = to;
  }
  return frameStyle({ s: from.s, tx: W / 2 - from.x * from.s, ty: H / 2 - from.y * from.s }, true);
}

function moving(a: Hold, b: Hold, u: number) {
  if (b.dip) {
    const s = Math.exp(lerp(Math.log(a.s), Math.log(b.s), u)) * (1 - b.dip * Math.sin(Math.PI * u));
    const x = lerp(a.x, b.x, u);
    const y = lerp(a.y, b.y, u);
    return { s, tx: W / 2 - x * s, ty: H / 2 - y * s };
  }
  const ax = W / 2 - a.x * a.s;
  const ay = H / 2 - a.y * a.s;
  const bx = W / 2 - b.x * b.s;
  const by = H / 2 - b.y * b.s;
  const r = b.s / a.s;
  if (Math.abs(r - 1) < 1e-4) return { s: a.s, tx: lerp(ax, bx, u), ty: lerp(ay, by, u) };
  const k = Math.pow(r, u);
  const w = (1 - k) / (1 - r);
  return { s: a.s * k, tx: ax * k + (bx - r * ax) * w, ty: ay * k + (by - r * ay) * w };
}

function frameStyle(c: { s: number; tx: number; ty: number }, still: boolean): CSSProperties {
  const tx = still ? snapPx(c.tx) : c.tx;
  const ty = still ? snapPx(c.ty) : c.ty;
  return { position: "absolute", left: 0, top: 0, width: W, height: H, transformOrigin: "0 0", transform: `translate(${tx.toFixed(3)}px, ${ty.toFixed(3)}px) scale(${c.s.toFixed(5)})` };
}

/**
 * A soft left-to-right swipe: content shows through a mask whose edge is feathered over `feather` of the width,
 * so a reveal reads as one smooth sweep instead of a hard wipe.
 */
export function wipe(p: number, feather = 0.3): CSSProperties {
  if (p >= 1) return {};
  const end = p * (1 + feather) * 100;
  const start = end - feather * 100;
  const mask = `linear-gradient(90deg, #000 ${start.toFixed(2)}%, transparent ${end.toFixed(2)}%)`;
  return { WebkitMaskImage: mask, maskImage: mask };
}

/** A plain filled circle: the product's avatar and tile shape, with nothing inside it. */
export function Circle({ size, tone = C.salmon, style }: { size: number; tone?: string; style?: CSSProperties }) {
  return <div style={{ width: size, height: size, borderRadius: 999, background: tone, flexShrink: 0, ...style }} />;
}

/**
 * One beat of a chapter as a full-frame layer: it settles in from a touch larger, holds perfectly still,
 * then eases out a touch smaller. Returns null style when the beat is off screen.
 */
export function beat(frame: number, at: number, out: number, dur = 22): CSSProperties | null {
  const inP = ramp(frame, at, dur, EASE_OUT);
  const outP = ramp(frame, out, dur * 0.8, EASE_IN);
  if (inP <= 0 || outP >= 1) return null;
  const s = inP < 1 ? lerp(1.035, 1, inP) : outP > 0 ? lerp(1, 0.97, outP) : 1;
  return { position: "absolute", left: 0, top: 0, width: W, height: H, opacity: inP * (1 - outP), transform: s === 1 ? undefined : `scale(${s.toFixed(5)})`, transformOrigin: "50% 50%" };
}

/** A browser window in Doe's palette: tab, address bar, and a paper page for `children`. */
export function Browser({ x, y, w, h, tab, url, children, style }: { x: number; y: number; w: number; h: number; tab: string; url: string; children: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 26, background: C.sand2, overflow: "hidden", ...style }}>
      <div style={{ position: "absolute", left: 22, top: 20, display: "flex", gap: 9 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: 14, height: 14, borderRadius: 99, background: "rgba(40, 25, 16, 0.18)" }} />
        ))}
      </div>
      <div style={{ position: "absolute", left: 110, top: 10, height: 44, width: Math.min(360, w * 0.4), borderRadius: "14px 14px 0 0", background: C.beige, display: "flex", alignItems: "center", padding: "0 18px", boxSizing: "border-box", fontFamily: F.ui, fontWeight: 600, fontSize: 17, color: C.walnut, whiteSpace: "nowrap", overflow: "hidden" }}>{tab}</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 54, height: 58, background: C.beige, display: "flex", alignItems: "center", padding: "0 20px" }}>
        <div style={{ flex: 1, height: 38, borderRadius: 999, background: C.paper, display: "flex", alignItems: "center", padding: "0 20px", fontFamily: F.ui, fontWeight: 500, fontSize: 18, color: "rgba(40, 25, 16, 0.6)" }}>{url}</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 112, bottom: 0, background: C.paper }}>{children}</div>
    </div>
  );
}

/** Ink lower third in screen space: the feature's name and, optionally, a few words on it. */
export function Lower({ frame, at, out, title, line, top = false }: { frame: number; at: number; out: number; title: string; line?: string; top?: boolean }) {
  const p = ramp(frame, at, 20, EASE_OUT) * leave(frame, out);
  if (p <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, ...(top ? { top: 48 } : { bottom: 56 }), display: "flex", justifyContent: "center", opacity: p, transform: `translateY(${(1 - p) * (top ? -18 : 18)}px)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, height: 72, padding: line ? "0 30px 0 26px" : "0 30px", borderRadius: 999, background: C.ink }}>
        <span style={{ fontFamily: F.display, fontWeight: 500, fontSize: 30, letterSpacing: "-0.02em", color: C.paper, whiteSpace: "nowrap" }}>{title}</span>
        {line ? (
          <>
            <span style={{ width: 1, height: 26, background: "rgba(255, 252, 241, 0.2)" }} />
            <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 20, color: "rgba(255, 252, 241, 0.72)", whiteSpace: "nowrap" }}>{line}</span>
          </>
        ) : null}
      </div>
    </div>
  );
}

/** A paper card with the product's dot grid, placed in world coordinates. */
export function Panel({ x, y, w, h, children, dotted = true, style }: { x: number; y: number; w: number; h: number; children?: ReactNode; dotted?: boolean; style?: CSSProperties }) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: 28,
        overflow: "hidden",
        background: C.paper,
        backgroundImage: dotted ? "radial-gradient(rgba(40, 25, 16, 0.09) 1px, transparent 1.3px)" : undefined,
        backgroundSize: "18px 18px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Extra glyphs on the shared 24px stroke grid ─────────────────────────── */

const EXTRA = {
  server: "M4.5 5h15v5.5h-15zM4.5 13.5h15V19h-15zM8 7.75h.01M8 16.25h.01",
  code: "M8.5 7L3.5 12l5 5M15.5 7l5 5-5 5",
  globe: "M12 3.5a8.5 8.5 0 1 0 0 17a8.5 8.5 0 1 0 0-17zM3.5 12h17M12 3.5c2.4 2.4 3.5 5.3 3.5 8.5s-1.1 6.1-3.5 8.5c-2.4-2.4-3.5-5.3-3.5-8.5s1.1-6.1 3.5-8.5z",
  bolt: "M13 3.5L5.5 13.5h6l-1 7 7.5-10h-6z",
  mail: "M3.5 6h17v12h-17zM3.5 7l8.5 6 8.5-6",
  dollar: "M12 3.5v17M16 7.5c-.6-1.4-2.1-2-4-2-2.3 0-4 1.1-4 3s1.7 2.6 4 3 4 1.2 4 3.2-1.7 3.3-4 3.3c-2 0-3.6-.7-4.2-2.2",
  fax: "M7 9V4.5h10V9M7.5 16H5V9h14v7h-2.5M7.5 13.5h9v6h-9z",
  proxy: "M4 7.5h4.5l7 9H20M4 16.5h4.5l1.8-2.3M13.7 9.8l1.8-2.3H20M17.5 5l2.5 2.5-2.5 2.5M17.5 14l2.5 2.5-2.5 2.5",
  mic: "M12 3.5a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0v-5a3 3 0 0 0-3-3zM6 11a6 6 0 0 0 12 0M12 17v3.5",
  plane: "M21 4.5L3.5 11l7 2.5 2.5 7zM10.5 13.5L21 4.5",
  cart: "M3.5 4.5h2.2l2 10.5h10.3l1.8-7.5H6.6M9.5 19.5h.01M17 19.5h.01",
  fork: "M7 3.5v7M5 3.5v4.5a2 2 0 0 0 4 0V3.5M7 10.5v10M16.5 3.5c-1.7 1.2-2.5 3-2.5 5.5v3h2.5v8.5",
  receipt: "M6 3.5h12v17l-2-1.4-2 1.4-2-1.4-2 1.4-2-1.4-2 1.4zM9 8h6M9 11.5h6M9 15h3.5",
  trend: "M4 17l5.5-5.5 3.5 3.5L20 8M14.5 8H20v5.5",
  spark: "M12 4v4M12 16v4M4 12h4M16 12h4M6.5 6.5l2.6 2.6M14.9 14.9l2.6 2.6M6.5 17.5l2.6-2.6M14.9 9.1l2.6-2.6",
  ticket: "M3.5 7.5h17v3a1.5 1.5 0 0 0 0 3v3h-17v-3a1.5 1.5 0 0 0 0-3zM14.5 7.5v9",
} as const;

export type GlName = IcoName | keyof typeof EXTRA;

export function Gl({ name, size = 18, color = C.walnut, stroke = 1.9 }: { name: GlName; size?: number; color?: string; stroke?: number }) {
  if (!(name in EXTRA)) return <Ico name={name as IcoName} size={size} color={color} stroke={stroke} />;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block", flexShrink: 0 }}>
      <path d={EXTRA[name as keyof typeof EXTRA]} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Rounded tile holding a glyph, the product's list-row lead. */
export function GlTile({ name, size = 40, tone = C.sand2, color = C.walnut, radius }: { name: GlName; size?: number; tone?: string; color?: string; radius?: number }) {
  return (
    <div style={{ width: size, height: size, flexShrink: 0, borderRadius: radius ?? size * 0.32, background: tone, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Gl name={name} size={Math.round(size * 0.48)} color={color} stroke={1.9} />
    </div>
  );
}

/* ─── Dot tracks: a path drawn as evenly spaced dots, with packets that run along it ─── */

export type Pt = { x: number; y: number };
/** A straight piece is two points; a curved piece is a cubic's four. */
export type Piece = [Pt, Pt] | [Pt, Pt, Pt, Pt];

const cubicAt = (p: Pt[], t: number): Pt => {
  if (p.length === 2) return { x: lerp(p[0].x, p[1].x, t), y: lerp(p[0].y, p[1].y, t) };
  const u = 1 - t;
  const w = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t];
  return { x: w.reduce((s, k, i) => s + k * p[i].x, 0), y: w.reduce((s, k, i) => s + k * p[i].y, 0) };
};

export type Track = { length: number; at: (d: number) => Pt; dots: (Pt & { d: number })[] };

/** Samples pieces end to end by arc length; `dots` sit every `gap` pixels along it. */
export function trackOf(pieces: Piece[], gap = 18): Track {
  const pts: Pt[] = [];
  pieces.forEach((p, k) => {
    for (let i = k === 0 ? 0 : 1; i <= 120; i++) pts.push(cubicAt(p, i / 120));
  });
  const cum = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  const length = cum[cum.length - 1];
  const at = (d: number): Pt => {
    const v = Math.max(0, Math.min(length, d));
    let lo = 0;
    let hi = cum.length - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (cum[mid] <= v) lo = mid;
      else hi = mid;
    }
    const t = cum[hi] > cum[lo] ? (v - cum[lo]) / (cum[hi] - cum[lo]) : 0;
    return { x: lerp(pts[lo].x, pts[hi].x, t), y: lerp(pts[lo].y, pts[hi].y, t) };
  };
  const dots = Array.from({ length: Math.floor(length / gap) + 1 }, (_, i) => ({ ...at(i * gap), d: i * gap }));
  return { length, at, dots };
}

/** Counts up from `from` to `to` over a span, eased. */
export const count = (frame: number, at: number, dur: number, to: number, from = 0) => Math.round(lerp(from, to, ramp(frame, at, dur, EASE_IN_OUT)));

export const ui = (size: number, weight = 500, extra?: CSSProperties): CSSProperties => ({ fontFamily: F.ui, fontWeight: weight, fontSize: size, lineHeight: `${Math.round(size * 1.3)}px`, color: C.walnut, whiteSpace: "nowrap", ...extra });
export const serif = (size: number, extra?: CSSProperties): CSSProperties => ({ fontFamily: F.display, fontWeight: 500, fontSize: size, lineHeight: `${Math.round(size * 1.12)}px`, letterSpacing: "-0.022em", color: C.walnut, whiteSpace: "nowrap", ...extra });
export const body = (size: number, extra?: CSSProperties): CSSProperties => ({ fontFamily: F.body, fontWeight: 500, fontSize: size, lineHeight: `${Math.round(size * 1.4)}px`, color: "rgba(40, 25, 16, 0.62)", ...extra });

/** A world-space dashed connector between two points, drawn on by `draw`. */
export function Wire({ a, b, bend = 0, draw = 1, opacity = 0.2, color = C.walnut, width = 1.6 }: { a: { x: number; y: number }; b: { x: number; y: number }; bend?: number; draw?: number; opacity?: number; color?: string; width?: number }) {
  if (draw <= 0) return null;
  const mx = (a.x + b.x) / 2 - (b.y - a.y) * bend;
  const my = (a.y + b.y) / 2 + (b.x - a.x) * bend;
  return <path d={`M${a.x} ${a.y} Q${mx} ${my} ${b.x} ${b.y}`} pathLength={1} fill="none" stroke={color} strokeOpacity={opacity} strokeWidth={width} strokeDasharray={`${draw} 1`} strokeLinecap="round" />;
}

/** Point along the same quadratic Wire draws. */
export function along(a: { x: number; y: number }, b: { x: number; y: number }, t: number, bend = 0) {
  const mx = (a.x + b.x) / 2 - (b.y - a.y) * bend;
  const my = (a.y + b.y) / 2 + (b.x - a.x) * bend;
  const u = 1 - t;
  return { x: u * u * a.x + 2 * u * t * mx + t * t * b.x, y: u * u * a.y + 2 * u * t * my + t * t * b.y };
}

export { EASE_IN, EASE_IN_OUT, EASE_OUT };
