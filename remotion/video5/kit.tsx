import type { CSSProperties, ReactNode } from "react";
import { Audio, interpolate, staticFile } from "remotion";

import { CAMERA_EASE, EASE_IN_OUT, keys, lerp, type CameraKey } from "../video1/motion";
import { C, F, VIDEO1_HEIGHT, VIDEO1_WIDTH } from "../video1/theme";
import { Icon, type IconName } from "../video1/ui";

/** Every section runs 30 seconds. */
export const SECTION_FRAMES = 900;

/** Same bed and cue as /video1, plus the section voice at video1's volume. */
const BED_START = 1230;
const BED_VOLUME = 0.2;

export function BedTrack({ voice }: { voice: string }) {
  return (
    <>
      <Audio src={staticFile(voice)} volume={0.7} />
      <Audio
        src={staticFile("video1/BED.m4a")}
        startFrom={BED_START}
        volume={(f) => BED_VOLUME * interpolate(f, [0, 6, SECTION_FRAMES - 30, SECTION_FRAMES], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
    </>
  );
}

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

export const mix = (a: string, b: string, t: number) => {
  const pa = rgb(a);
  const pb = rgb(b);
  return `rgb(${pa.map((v, i) => Math.round(lerp(v, pb[i], clamp01(t)))).join(", ")})`;
};

export const SAGE = "#D6DEC6";
export const SAGE_DEEP = "#C2CDAB";
export const SAGE_TEXT = "#2F3B2A";
export const SALMON_DEEP = "#F6B696";
export const SOFT = "rgba(40, 25, 16, 0.08)";
export const SUB = "rgba(40, 25, 16, 0.62)";

/** Fitzpatrick I → VI. */
export const SKIN_TONES = ["#F4DCC8", "#EBC4A3", "#D3A07A", "#AE7853", "#7D5135", "#4E3121"];
export const SKIN_TYPES = ["I", "II", "III", "IV", "V", "VI"];

export const CLINIC = { name: "Maren Skin Clinic", area: "Yorkville" } as const;

export type Person = { name: string; short: string; role: string; initials: string; tone: string };

export const OKAFOR: Person = { name: "Dr. Amara Okafor", short: "Dr. Okafor", role: "Dermatologist", initials: "AO", tone: C.salmon };
export const REYES: Person = { name: "Dr. Julian Reyes", short: "Dr. Reyes", role: "Plastic Surgeon", initials: "JR", tone: SAGE };
export const PATEL: Person = { name: "Nina Patel, RN", short: "Nina Patel", role: "Nurse Injector", initials: "NP", tone: C.sand2 };
export const KIM: Person = { name: "Leah Kim", short: "Leah Kim", role: "Laser Specialist", initials: "LK", tone: "#E9DCC7" };

/* ─── Camera with readable state, so screen-space overlays can track world points ── */

export type Cam = { s: number; tx: number; ty: number };

export function camState(frame: number, cameraKeys: CameraKey[], easing: (t: number) => number = CAMERA_EASE): Cam {
  const last = cameraKeys.length - 1;
  let i = 0;
  while (i < last - 1 && frame >= cameraKeys[i + 1].f) i++;
  const a = cameraKeys[i];
  const b = cameraKeys[Math.min(i + 1, last)];
  const span = b.f - a.f;
  const u = span <= 0 ? 1 : easing(clamp01((frame - a.f) / span));
  const ax = VIDEO1_WIDTH / 2 - a.x * a.s;
  const ay = VIDEO1_HEIGHT / 2 - a.y * a.s;
  const bx = VIDEO1_WIDTH / 2 - b.x * b.s;
  const by = VIDEO1_HEIGHT / 2 - b.y * b.s;
  const r = b.s / a.s;
  if (Math.abs(r - 1) < 1e-4) return { s: lerp(a.s, b.s, u), tx: lerp(ax, bx, u), ty: lerp(ay, by, u) };
  const k = Math.pow(r, u);
  const w = (1 - k) / (1 - r);
  return { s: a.s * k, tx: ax * k + (bx - r * ax) * w, ty: ay * k + (by - r * ay) * w };
}

export const camStyle = (c: Cam): CSSProperties => ({
  position: "absolute",
  left: 0,
  top: 0,
  width: VIDEO1_WIDTH,
  height: VIDEO1_HEIGHT,
  transformOrigin: "0 0",
  transform: `translate(${c.tx.toFixed(3)}px, ${c.ty.toFixed(3)}px) scale(${c.s.toFixed(5)})`,
});

export const onScreen = (c: Cam, p: { x: number; y: number }) => ({ x: p.x * c.s + c.tx, y: p.y * c.s + c.ty });

export type CursorKey = { f: number; x: number; y: number };

/** Cursor position along eased waypoints (world or screen space, whichever the keys are in). */
export function cursorAt(frame: number, path: CursorKey[]) {
  const f = path.map((p) => p.f);
  return { x: keys(frame, f, path.map((p) => p.x), EASE_IN_OUT), y: keys(frame, f, path.map((p) => p.y), EASE_IN_OUT) };
}

/* ─── Extra glyphs (same 24px grid and stroke as the shared icons) ─────────── */

export type GlyphName = "syringe" | "box" | "tag" | "layers" | "minus" | "bell" | "drop" | "sun" | "star" | "filter" | "send" | "pin";

const GLYPHS: Record<GlyphName, string> = {
  syringe: "M14.5 4.5l5 5M17 7l-8.5 8.5-3 .5.5-3L14.5 4.5M11 10l3 3M5.5 18.5L3.5 20.5",
  box: "M4 8l8-4 8 4v8.5l-8 4-8-4zM4 8l8 4 8-4M12 12v8.5",
  tag: "M3.5 12.5V4.5h8l9 9-8 8zM8 8h.01",
  layers: "M12 4l8.5 4.5L12 13 3.5 8.5zM3.5 12.5L12 17l8.5-4.5M3.5 16.5L12 21l8.5-4.5",
  minus: "M5 12h14",
  bell: "M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15zM10 20.5a2 2 0 0 0 4 0",
  drop: "M12 3.5s6 6.4 6 10.5a6 6 0 0 1-12 0C6 9.9 12 3.5 12 3.5z",
  sun: "M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8zM12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4",
  star: "M12 4l2.4 5 5.4.6-4 3.7 1.1 5.3L12 15.9 7.1 18.6l1.1-5.3-4-3.7 5.4-.6z",
  filter: "M4 6h16M7 12h10M10 18h4",
  send: "M4.5 12h14M13 6.5l5.5 5.5-5.5 5.5",
  pin: "M12 20.5s6.5-5.6 6.5-10.5a6.5 6.5 0 0 0-13 0c0 4.9 6.5 10.5 6.5 10.5z",
};

export function Glyph({ name, size = 18, color = C.walnut, stroke = 1.9 }: { name: GlyphName; size?: number; color?: string; stroke?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block", flexShrink: 0 }}>
      <path d={GLYPHS[name]} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Controls ─────────────────────────────────────────────────────────────── */

export type PillTone = "ink" | "soft" | "paper" | "outline" | "salmon" | "sage" | "beige";

const PILL_TONES: Record<PillTone, CSSProperties> = {
  ink: { background: C.ink, color: C.paper },
  soft: { background: SOFT, color: C.walnut },
  paper: { background: C.paper, color: C.walnut },
  outline: { background: "transparent", color: C.walnut, border: `1px solid ${C.line2}` },
  salmon: { background: C.salmon, color: C.walnut },
  sage: { background: SAGE, color: SAGE_TEXT },
  beige: { background: C.beige, color: C.walnut },
};

export function Pill({ tone = "ink", height = 38, lead, trail, press = 0, style, children }: { tone?: PillTone; height?: number; lead?: ReactNode; trail?: ReactNode; press?: number; style?: CSSProperties; children?: ReactNode }) {
  return (
    <div
      style={{
        height,
        flexShrink: 0,
        boxSizing: "border-box",
        padding: `0 ${height * 0.42}px 0 ${lead ? height * 0.34 : height * 0.42}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: height * 0.19,
        borderRadius: 999,
        fontFamily: F.body,
        fontWeight: 500,
        fontSize: height * 0.34,
        whiteSpace: "nowrap",
        transform: press ? `scale(${1 - 0.07 * press})` : undefined,
        ...PILL_TONES[tone],
        ...style,
      }}
    >
      {lead}
      {children}
      {trail}
    </div>
  );
}

export function RoundButton({ icon, glyph, size = 38, tone = "soft", iconColor = C.ink }: { icon?: IconName; glyph?: GlyphName; size?: number; tone?: PillTone; iconColor?: string }) {
  return (
    <div style={{ width: size, height: size, flexShrink: 0, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center", ...PILL_TONES[tone] }}>
      {icon ? <Icon name={icon} size={size * 0.42} color={iconColor} stroke={2} /> : null}
      {glyph ? <Glyph name={glyph} size={size * 0.42} color={iconColor} stroke={2} /> : null}
    </div>
  );
}

/** Pill track whose paper thumb slides to the fractional `active` index. */
export function Tabs({ options, active, height = 38, style }: { options: string[]; active: number; height?: number; style?: CSSProperties }) {
  const n = options.length;
  return (
    <div style={{ position: "relative", display: "flex", height, padding: 3, borderRadius: 999, boxSizing: "border-box", background: SOFT, ...style }}>
      <div style={{ position: "absolute", top: 3, bottom: 3, left: `calc(3px + ${active} * (100% - 6px) / ${n})`, width: `calc((100% - 6px) / ${n})`, borderRadius: 999, background: C.paper }} />
      {options.map((label, i) => {
        const on = 1 - Math.min(1, Math.abs(active - i));
        return (
          <div
            key={label}
            style={{ position: "relative", flex: 1, padding: "0 14px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.body, fontWeight: 500, fontSize: height * 0.34, color: on > 0.5 ? C.ink : SUB, whiteSpace: "nowrap" }}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
}

export function Initials({ person, size = 36 }: { person: Pick<Person, "initials" | "tone">; size?: number }) {
  return (
    <div style={{ width: size, height: size, flexShrink: 0, borderRadius: 999, background: person.tone, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.ui, fontWeight: 600, fontSize: size * 0.36, color: C.walnut }}>
      {person.initials}
    </div>
  );
}

/** Six skin-type swatches; `on(i)` (0–1) fills each one in. */
export function SkinScale({ on, size = 26, gap = 6, labels = false }: { on: (i: number) => number; size?: number; gap?: number; labels?: boolean }) {
  return (
    <div style={{ display: "flex", gap }}>
      {SKIN_TONES.map((tone, i) => {
        const p = on(i);
        return (
          <div key={tone} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ position: "relative", width: size, height: size, borderRadius: 999, boxSizing: "border-box", border: `1.5px dashed rgba(40, 25, 16, ${0.22 * (1 - p)})` }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: 999, background: tone, opacity: p, transform: `scale(${lerp(0.4, 1, p)})` }} />
            </div>
            {labels ? <span style={{ fontFamily: F.body, fontWeight: 500, fontSize: size * 0.42, color: p > 0.5 ? C.walnut : C.faint }}>{SKIN_TYPES[i]}</span> : null}
          </div>
        );
      })}
    </div>
  );
}

/** − n + control; `press` flashes either side. */
export function Stepper({ value, height = 34, pressMinus = 0, pressPlus = 0 }: { value: ReactNode; height?: number; pressMinus?: number; pressPlus?: number }) {
  const side = (glyph: "minus" | "plus", press: number) => (
    <div style={{ width: height - 6, height: height - 6, borderRadius: 999, background: press > 0 ? mix(C.paper, C.sand2, press) : C.paper, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 - 0.1 * press})` }}>
      {glyph === "minus" ? <Glyph name="minus" size={height * 0.4} stroke={2.2} /> : <Icon name="plus" size={height * 0.4} stroke={2.2} />}
    </div>
  );
  return (
    <div style={{ height, boxSizing: "border-box", padding: 3, display: "flex", alignItems: "center", gap: 4, borderRadius: 999, background: C.beige }}>
      {side("minus", pressMinus)}
      <div style={{ minWidth: height * 0.8, textAlign: "center", fontFamily: F.ui, fontWeight: 600, fontSize: height * 0.44, color: C.walnut, fontVariantNumeric: "tabular-nums" }}>{value}</div>
      {side("plus", pressPlus)}
    </div>
  );
}

export type MenuItem = { label: string; lead?: ReactNode; meta?: ReactNode; checked?: number };

/** Dropdown list: a beige hover bar glides to the fractional `hover` row. */
export function Menu({ items, hover, width, rowH = 44, header, footer, style }: { items: MenuItem[]; hover: number; width: number; rowH?: number; header?: ReactNode; footer?: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{ width, boxSizing: "border-box", padding: 6, borderRadius: 18, background: C.paper, border: `1px solid ${C.line2}`, display: "flex", flexDirection: "column", gap: 4, ...style }}>
      {header}
      <div style={{ position: "relative" }}>
        {hover >= 0 ? <div style={{ position: "absolute", left: 0, right: 0, top: hover * rowH, height: rowH, borderRadius: 12, background: C.beige }} /> : null}
        {items.map((item) => (
          <div key={item.label} style={{ position: "relative", height: rowH, boxSizing: "border-box", padding: "0 12px", display: "flex", alignItems: "center", gap: 12 }}>
            {item.checked !== undefined ? <Check p={item.checked} size={rowH * 0.44} /> : null}
            {item.lead}
            <span style={{ flex: 1, fontFamily: F.ui, fontWeight: 500, fontSize: rowH * 0.34, color: C.walnut, whiteSpace: "nowrap" }}>{item.label}</span>
            {item.meta ? <span style={{ fontFamily: F.body, fontWeight: 500, fontSize: rowH * 0.3, color: SUB, whiteSpace: "nowrap" }}>{item.meta}</span> : null}
          </div>
        ))}
      </div>
      {footer}
    </div>
  );
}

export function Check({ p, size = 20 }: { p: number; size?: number }) {
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0, borderRadius: size * 0.3, boxSizing: "border-box", border: `1.5px solid rgba(40, 25, 16, ${0.28 * (1 - p)})`, background: `rgba(20, 12, 4, ${p})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ opacity: p, transform: `scale(${lerp(0.5, 1, p)})` }}>
        <Icon name="check" size={size * 0.72} color={C.paper} stroke={3} />
      </div>
    </div>
  );
}

/** Check that draws itself in, for match results. */
export function DrawCheck({ p, size = 16, color = SAGE_TEXT }: { p: number; size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: "block", flexShrink: 0 }}>
      <path d="M5 12.5l4.5 4.5L19 7.5" stroke={color} strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
}

/** Two labels sharing one grid cell so a button can cross-fade without its width jumping. */
export function Swap({ t, from, to }: { t: number; from: ReactNode; to: ReactNode }) {
  return (
    <div style={{ display: "grid", alignItems: "center", justifyItems: "center" }}>
      <div style={{ gridArea: "1 / 1", display: "flex", alignItems: "center", gap: 8, opacity: 1 - t, transform: `translateY(${-6 * t}px)` }}>{from}</div>
      <div style={{ gridArea: "1 / 1", display: "flex", alignItems: "center", gap: 8, opacity: t, transform: `translateY(${6 * (1 - t)}px)` }}>{to}</div>
    </div>
  );
}

export const title = (size: number, extra?: CSSProperties): CSSProperties => ({ fontFamily: F.display, fontWeight: 500, fontSize: size, lineHeight: `${Math.round(size * 1.1)}px`, letterSpacing: "-0.025em", color: C.walnut, whiteSpace: "nowrap", ...extra });

export const ui = (size: number, weight = 500, extra?: CSSProperties): CSSProperties => ({ fontFamily: F.ui, fontWeight: weight, fontSize: size, lineHeight: `${Math.round(size * 1.3)}px`, color: C.walnut, whiteSpace: "nowrap", ...extra });

export const body = (size: number, extra?: CSSProperties): CSSProperties => ({ fontFamily: F.body, fontWeight: 500, fontSize: size, lineHeight: `${Math.round(size * 1.35)}px`, color: SUB, whiteSpace: "nowrap", ...extra });

export const money = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

export { EASE_IN_OUT };
