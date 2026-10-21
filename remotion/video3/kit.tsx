import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { Audio, interpolateColors, staticFile, useCurrentFrame } from "remotion";

import { EASE_OUT, keys, lerp, ramp } from "../video1/motion";
import { C, F, VIDEO1_HEIGHT as H, VIDEO1_WIDTH as W } from "../video1/theme";
import { Icon, type IconName } from "../video1/ui";

export const SECTION_FRAMES = 900;

/** Same bed as video1, from the same 0:41 cue, plus the section voice at video1's volume. */
export function BedTrack({ voice }: { voice: string }) {
  return (
    <>
      <Audio src={staticFile(voice)} volume={0.7} />
      <Audio src={staticFile("video1/BED.m4a")} startFrom={1230} volume={0.2} />
    </>
  );
}

export const SAGE = "#D6DEC6";
export const SAGE_TEXT = "#2F3B2A";
export const SOFT = "rgba(40, 25, 16, 0.07)";
export const SUB = "rgba(40, 25, 16, 0.62)";

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Fade + slide in, no blur by default. */
export function rise(frame: number, at: number, { x = 0, y = 12, scale = 1, blur = 0, dur = 22 }: { x?: number; y?: number; scale?: number; blur?: number; dur?: number } = {}): CSSProperties {
  const p = ramp(frame, at, dur, EASE_OUT);
  return { opacity: p, transform: `translate(${(1 - p) * x}px, ${(1 - p) * y}px) scale(${lerp(scale, 1, p)})`, filter: blur > 0 && p < 1 ? `blur(${(1 - p) * blur}px)` : undefined };
}

/* ─── Extra glyphs (same 24px stroke grid as video1's Icon) ────────────────── */

export type GlyphName = "stethoscope" | "flask" | "message" | "send" | "users" | "chevronRight" | "more" | "activity" | "heart" | "arrowLeft" | "bridge" | "sliders";

const GLYPHS: Record<GlyphName, string> = {
  stethoscope: "M6.5 4H5v5a4.5 4.5 0 0 0 9 0V4h-1.5M9.5 13.5v1.5a4.5 4.5 0 0 0 9 0v-2.5M18.5 12.5a2 2 0 1 0 0-4a2 2 0 1 0 0 4z",
  flask: "M9.5 3.5h5M10.5 3.5v6L5.5 18a1.8 1.8 0 0 0 1.6 2.5h9.8a1.8 1.8 0 0 0 1.6-2.5l-5-8.5v-6M7.5 14.5h9",
  message: "M4.5 5.5h15v10.5h-8.5l-4.5 3.5V16h-2z",
  send: "M20 4l-9.5 9.5M20 4l-6 16-3.5-6.5L4 10z",
  users: "M9 11.5a3.5 3.5 0 1 0 0-7a3.5 3.5 0 1 0 0 7zM2.5 20a6.5 6.5 0 0 1 13 0M16 4.8a3.5 3.5 0 0 1 0 6.4M18 14.2a6.5 6.5 0 0 1 3.5 5.8",
  chevronRight: "M9 5l7 7-7 7",
  more: "M5.5 12h.01M12 12h.01M18.5 12h.01",
  activity: "M3.5 12h4l2.5-6 4 12 2.5-6h4",
  heart: "M12 19.5s-7.5-4.6-7.5-10.2A4.1 4.1 0 0 1 12 6.9a4.1 4.1 0 0 1 7.5 2.4c0 5.6-7.5 10.2-7.5 10.2z",
  arrowLeft: "M19 12H5.5M11 6.5L5.5 12l5.5 5.5",
  bridge: "M3.5 16.5h17M6 16.5V10M18 16.5V10M3.5 10h17M9 10c0 2.5 1.3 4 3 4s3-1.5 3-4",
  sliders: "M5 6.5h9M18 6.5h1M15.5 4.5v4M5 12h2M10 12h9M8.5 10v4M5 17.5h9M18 17.5h1M15.5 15.5v4",
};

export type AnyIcon = IconName | GlyphName;

export function Glyph({ name, size = 18, color = C.walnut, stroke = 1.9 }: { name: AnyIcon; size?: number; color?: string; stroke?: number }) {
  const d = (GLYPHS as Record<string, string>)[name];
  if (!d) return <Icon name={name as IconName} size={size} color={color} stroke={stroke} />;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block", flexShrink: 0 }}>
      <path d={d} fill="none" stroke={color} strokeWidth={name === "more" ? stroke * 1.7 : stroke} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Controls ─────────────────────────────────────────────────────────────── */

type PillTone = "ink" | "soft" | "paper" | "outline" | "salmon" | "sage";

const PILL_TONES: Record<PillTone, { background: string; color: string; border?: string }> = {
  ink: { background: C.ink, color: C.paper },
  soft: { background: SOFT, color: C.walnut },
  paper: { background: C.paper, color: C.walnut },
  outline: { background: "rgba(0, 0, 0, 0)", color: C.walnut, border: `1px solid ${C.line2}` },
  salmon: { background: C.salmon, color: C.walnut },
  sage: { background: SAGE, color: SAGE_TEXT },
};

export function Pill({
  children,
  icon,
  trailing,
  tone = "ink",
  height = 38,
  press = 0,
  style,
}: {
  children: ReactNode;
  icon?: AnyIcon;
  trailing?: AnyIcon;
  tone?: PillTone;
  height?: number;
  press?: number;
  style?: CSSProperties;
}) {
  const color = PILL_TONES[tone].color;
  const s = height / 38;
  return (
    <div
      style={{
        height,
        flexShrink: 0,
        boxSizing: "border-box",
        padding: `0 ${(trailing ? 13 : 16) * s}px 0 ${(icon ? 13 : 16) * s}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7 * s,
        borderRadius: 999,
        fontFamily: F.ui,
        fontWeight: 500,
        fontSize: 14 * s,
        whiteSpace: "nowrap",
        transform: press ? `scale(${1 - 0.07 * press})` : undefined,
        ...PILL_TONES[tone],
        ...style,
      }}
    >
      {icon ? <Glyph name={icon} size={15 * s} color={color} stroke={2} /> : null}
      {children}
      {trailing ? <Glyph name={trailing} size={13 * s} color={color} stroke={2} /> : null}
    </div>
  );
}

export type PillFace = { label: ReactNode; icon?: AnyIcon; trailing?: AnyIcon; tone: PillTone };

/** One pill that changes state: the fill blends between tones while the labels roll past each other. */
export function SwapPill({ p, from, to, height = 38, press = 0, style }: { p: number; from: PillFace; to: PillFace; height?: number; press?: number; style?: CSSProperties }) {
  const s = height / 38;
  const face = (f: PillFace, o: number, dy: number) => (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 7 * s, opacity: o, transform: `translateY(${dy}px)`, color: PILL_TONES[f.tone].color }}>
      {f.icon ? <Glyph name={f.icon} size={15 * s} color={PILL_TONES[f.tone].color} stroke={f.icon === "check" ? 2.6 : 2} /> : null}
      {f.label}
      {f.trailing ? <Glyph name={f.trailing} size={13 * s} color={PILL_TONES[f.tone].color} stroke={2} /> : null}
    </div>
  );
  return (
    <div
      style={{
        position: "relative",
        height,
        borderRadius: 999,
        overflow: "hidden",
        background: interpolateColors(p, [0, 1], [PILL_TONES[from.tone].background, PILL_TONES[to.tone].background]),
        fontFamily: F.ui,
        fontWeight: 500,
        fontSize: 14 * s,
        whiteSpace: "nowrap",
        transform: `scale(${(1 - 0.05 * press) * (1 + 0.03 * Math.sin(Math.PI * p))})`,
        ...style,
      }}
    >
      {face(from, clamp01(1 - p * 1.8), -p * 14 * s)}
      {face(to, clamp01(p * 1.8 - 0.8), (1 - p) * 14 * s)}
    </div>
  );
}

export function RoundButton({ icon, size = 38, tone = SOFT, color = C.walnut, press = 0 }: { icon: AnyIcon; size?: number; tone?: string; color?: string; press?: number }) {
  return (
    <div style={{ width: size, height: size, flexShrink: 0, borderRadius: 999, background: tone, display: "flex", alignItems: "center", justifyContent: "center", transform: press ? `scale(${1 - 0.1 * press})` : undefined }}>
      <Glyph name={icon} size={size * 0.42} color={color} stroke={2} />
    </div>
  );
}

/** video1's toolbar search: soft pill, search glyph, value or placeholder, optional leading token and key hint. */
export function SearchField({ value, placeholder, token, hint = "⌘K", caret, height = 38, style }: { value?: string; placeholder: string; token?: ReactNode; hint?: string | null; caret?: ReactNode; height?: number; style?: CSSProperties }) {
  const s = height / 38;
  return (
    <div style={{ flex: 1, minWidth: 0, height, boxSizing: "border-box", padding: `0 ${6 * s}px 0 ${token ? 5 * s : 14 * s}px`, borderRadius: 999, background: C.beige, display: "flex", alignItems: "center", gap: 9 * s, ...style }}>
      {token}
      <Glyph name="search" size={15 * s} color={SUB} stroke={2} />
      <span style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", fontFamily: F.ui, fontWeight: 500, fontSize: 14 * s, color: value ? C.walnut : SUB, whiteSpace: "nowrap", overflow: "hidden" }}>
        {value || placeholder}
        {caret}
      </span>
      {hint ? <span style={{ height: 26 * s, padding: `0 ${9 * s}px`, borderRadius: 999, background: C.paper, display: "flex", alignItems: "center", fontFamily: F.body, fontWeight: 500, fontSize: 12 * s, color: SUB }}>{hint}</span> : null}
    </div>
  );
}

/** Eased travel through timed waypoints (frames must increase) — cursor paths. */
export function path(frame: number, pts: { f: number; x: number; y: number }[]) {
  const fs = pts.map((p) => p.f);
  return { x: keys(frame, fs, pts.map((p) => p.x)), y: keys(frame, fs, pts.map((p) => p.y)) };
}

/** Select trigger: label · value · chevron. `open` (0–1) flips the chevron and darkens the edge. */
export function Select({ label, value, open = 0, height = 40, width, style }: { label?: string; value: ReactNode; open?: number; height?: number; width?: number; style?: CSSProperties }) {
  return (
    <div
      style={{
        height,
        width,
        boxSizing: "border-box",
        padding: `0 ${height * 0.32}px 0 ${height * 0.38}px`,
        display: "flex",
        alignItems: "center",
        gap: 8,
        borderRadius: height * 0.3,
        background: C.beige,
        border: `1.5px solid rgba(40, 25, 16, ${0.0 + 0.85 * open})`,
        fontFamily: F.ui,
        fontWeight: 500,
        fontSize: height * 0.37,
        color: C.walnut,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {label ? <span style={{ color: SUB }}>{label}</span> : null}
      <span style={{ flex: 1, minWidth: 0 }}>{value}</span>
      <div style={{ transform: `rotate(${180 * open}deg)` }}>
        <Glyph name="chevronDown" size={height * 0.32} color={SUB} stroke={2.2} />
      </div>
    </div>
  );
}

export type MenuItem = { label: string; icon?: AnyIcon; hint?: string };

/**
 * Dropdown menu. `open` scales it down from its top edge; `hover` is a fractional row index
 * the highlight glides to; `picked` checks a row.
 */
export function Menu({ items, open, hover = -1, picked = -1, width = 280, rowH = 44, origin = "50% 0", style }: { items: MenuItem[]; open: number; hover?: number; picked?: number; width?: number; rowH?: number; origin?: string; style?: CSSProperties }) {
  if (open <= 0.001) return null;
  const pad = 6;
  return (
    <div
      style={{
        position: "absolute",
        width,
        boxSizing: "border-box",
        padding: pad,
        borderRadius: 18,
        background: C.paper,
        border: `1px solid ${C.line2}`,
        opacity: Math.min(1, open * 1.4),
        transform: `translateY(${(1 - open) * -8}px) scale(${lerp(0.94, 1, open)})`,
        transformOrigin: origin,
        ...style,
      }}
    >
      {hover >= 0 ? <div style={{ position: "absolute", left: pad, right: pad, top: pad + hover * rowH, height: rowH, borderRadius: 12, background: C.beige }} /> : null}
      {items.map((item, i) => (
        <div key={item.label} style={{ position: "relative", height: rowH, display: "flex", alignItems: "center", gap: 10, padding: "0 12px", fontFamily: F.ui, fontWeight: 500, fontSize: rowH * 0.34, color: C.walnut, whiteSpace: "nowrap" }}>
          {item.icon ? <Glyph name={item.icon} size={rowH * 0.38} color={C.walnut} /> : null}
          <span style={{ flex: 1 }}>{item.label}</span>
          {item.hint ? <span style={{ color: C.faint, fontSize: rowH * 0.3 }}>{item.hint}</span> : null}
          {picked === i ? <Glyph name="check" size={rowH * 0.36} color={C.walnut} stroke={2.4} /> : null}
        </div>
      ))}
    </div>
  );
}

/** Segmented control with a sliding paper thumb; `active` may be fractional. */
export function Segmented({ options, active, height = 40, width, style }: { options: string[]; active: number; height?: number; width?: number; style?: CSSProperties }) {
  const n = options.length;
  return (
    <div style={{ position: "relative", display: "flex", height, width, boxSizing: "border-box", padding: 3, borderRadius: 999, background: C.beige, ...style }}>
      <div style={{ position: "absolute", top: 3, bottom: 3, left: `calc(3px + ${active} * (100% - 6px) / ${n})`, width: `calc((100% - 6px) / ${n})`, borderRadius: 999, background: C.paper }} />
      {options.map((label, i) => (
        <div
          key={label}
          style={{
            position: "relative",
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 14px",
            fontFamily: F.ui,
            fontWeight: 500,
            fontSize: height * 0.35,
            color: Math.abs(active - i) < 0.5 ? C.walnut : SUB,
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </div>
      ))}
    </div>
  );
}

/** Round check that fills ink as `p` goes 0 → 1. */
export function Tick({ p, size = 26, tone = C.ink }: { p: number; size?: number; tone?: string }) {
  return (
    <div style={{ position: "relative", width: size, height: size, borderRadius: 999, flexShrink: 0, boxSizing: "border-box", border: `1.5px solid rgba(40, 25, 16, ${0.22 * (1 - p)})` }}>
      <div style={{ position: "absolute", inset: -1.5, borderRadius: 999, background: tone, opacity: p, transform: `scale(${lerp(0.5, 1, p)})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Glyph name="check" size={size * 0.6} color={C.paper} stroke={3} />
      </div>
    </div>
  );
}

/** Square tile with a Mackinac initial — practice and physician marks. */
export function Mark({ letter, size = 48, tone = C.salmon, color = C.walnut, radius }: { letter: string; size?: number; tone?: string; color?: string; radius?: number }) {
  return (
    <div style={{ width: size, height: size, flexShrink: 0, borderRadius: radius ?? size * 0.28, background: tone, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.display, fontWeight: 500, fontSize: size * 0.5, lineHeight: 1, color, paddingTop: size * 0.02, boxSizing: "border-box" }}>
      {letter}
    </div>
  );
}

/** "Alex's Agent" ink lozenge with the salmon initial. */
export function AgentPill({ name = "Alex’s Agent", size = 1, style }: { name?: string; size?: number; style?: CSSProperties }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10 * size, height: 48 * size, padding: `0 ${20 * size}px 0 ${6 * size}px`, borderRadius: 999, background: C.ink, boxSizing: "border-box", whiteSpace: "nowrap", ...style }}>
      <div style={{ width: 36 * size, height: 36 * size, borderRadius: 999, background: C.salmon, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.ui, fontWeight: 600, fontSize: 15 * size, color: C.walnut }}>A</div>
      <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 20 * size, color: C.paper }}>{name}</span>
    </div>
  );
}

/** Page title set like video1's "Services" / "Providers". */
export function PageTitle({ children, size = 46, style }: { children: ReactNode; size?: number; style?: CSSProperties }) {
  return <div style={{ fontFamily: F.display, fontWeight: 500, fontSize: size, lineHeight: `${size * 1.1}px`, letterSpacing: "-0.025em", color: C.walnut, whiteSpace: "nowrap", ...style }}>{children}</div>;
}

export function CardTitle({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div style={{ fontFamily: F.display, fontWeight: 500, fontSize: 26, lineHeight: "30px", letterSpacing: "-0.02em", color: C.walnut, whiteSpace: "nowrap", ...style }}>{children}</div>;
}

/* ─── Dot globe: video1's sphere, thinning out as the search narrows ───────── */

const globeCache = new Map<number, Float32Array>();

function globePoints(count: number) {
  const cached = globeCache.get(count);
  if (cached) return cached;
  const pts = new Float32Array(count * 4);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    pts[i * 4] = Math.cos(golden * i) * r;
    pts[i * 4 + 1] = y;
    pts[i * 4 + 2] = Math.sin(golden * i) * r;
    pts[i * 4 + 3] = Math.abs(Math.sin(i * 78.233) * 43758.5453) % 1;
  }
  globeCache.set(count, pts);
  return pts;
}

/**
 * Halftone sphere (same projection and dot sizes as video1's DotSphere). Each dot has a rank;
 * dots ranked above `keep` fade away, so the globe empties out to the few that match.
 */
export function DotGlobe({ cx = W / 2, cy = H / 2, radius = 420, count = 1700, speed = 0.005, tilt = 0.42, keep = 1, color = C.dot }: { cx?: number; cy?: number; radius?: number; count?: number; speed?: number; tilt?: number; keep?: number; color?: string }) {
  const frame = useCurrentFrame();
  const ref = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = color;
    const pts = globePoints(count);
    const a = frame * speed;
    const ca = Math.cos(a);
    const sa = Math.sin(a);
    const ct = Math.cos(tilt);
    const st = Math.sin(tilt);
    for (let i = 0; i < count; i++) {
      const rank = pts[i * 4 + 3];
      const live = clamp01((keep - rank) / 0.04 + 1);
      if (live <= 0) continue;
      const x = pts[i * 4];
      const y = pts[i * 4 + 1];
      const z = pts[i * 4 + 2];
      const x1 = x * ca + z * sa;
      const z1 = -x * sa + z * ca;
      const y2 = y * ct - z1 * st;
      const z2 = y * st + z1 * ct;
      const depth = (z2 + 1) / 2;
      const persp = 1 + 0.12 * z2;
      ctx.globalAlpha = (0.1 + 0.62 * Math.pow(depth, 1.5)) * live;
      ctx.beginPath();
      ctx.arc(cx + x1 * radius * persp, cy + y2 * radius * persp, (0.9 + 2.1 * depth) * lerp(0.4, 1, live), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }, [frame, cx, cy, radius, count, speed, tilt, keep, color]);

  return <canvas ref={ref} width={W} height={H} style={{ position: "absolute", left: 0, top: 0, width: W, height: H }} />;
}

/**
 * Halftone band strung between two points; the dots swell in a travelling wave so the
 * bridge reads as carrying something. `draw` (0–1) grows it out from `a` toward `b`.
 */
export function DotBridge({ a, b, thickness = 120, step = 13, draw = 1, flow = 1, color = C.dot }: { a: { x: number; y: number }; b: { x: number; y: number }; thickness?: number; step?: number; draw?: number; flow?: number; color?: string }) {
  const frame = useCurrentFrame();
  const ref = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = color;
    const t = frame / 30;
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    const ux = (b.x - a.x) / len;
    const uy = (b.y - a.y) / len;
    const reach = len * draw;
    for (let s = 0; s <= reach; s += step) {
      const u = s / len;
      const pinch = 0.35 + 0.65 * Math.pow(Math.sin(Math.PI * u), 0.6);
      const half = (thickness / 2) * (0.55 + 0.45 * pinch);
      const tipFade = clamp01((reach - s) / 80);
      for (let d = -half; d <= half; d += step) {
        const v = 1 - Math.abs(d) / half;
        const wave = 0.5 + 0.5 * Math.sin(s / 46 - t * 4.2 * flow + d / 90);
        const r = (0.8 + 2.3 * Math.pow(v, 1.2)) * (0.65 + 0.55 * wave);
        ctx.globalAlpha = Math.min(0.85, (0.22 + 0.6 * wave) * (0.35 + 0.65 * v)) * tipFade;
        ctx.beginPath();
        ctx.arc(a.x + ux * s - uy * d, a.y + uy * s + ux * d, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }, [frame, a.x, a.y, b.x, b.y, thickness, step, draw, flow, color]);

  return <canvas ref={ref} width={W} height={H} style={{ position: "absolute", left: 0, top: 0, width: W, height: H }} />;
}
