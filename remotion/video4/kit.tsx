import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { useCurrentFrame } from "remotion";

import { EASE_OUT, keys, lerp, pulse, ramp } from "../video1/motion";
import { C, F } from "../video1/theme";
import { Icon, type IconName } from "../video1/ui";

export const SOFT = "rgba(40, 25, 16, 0.08)";
export const SUB = "rgba(40, 25, 16, 0.62)";
export const SAGE = "#D6DEC6";
export const SAGE_TEXT = "#2F3B2A";

/** The paper panel of an AppShell placed at SHELL, in world coordinates. */
export const SHELL = { x: 240, y: 90 };
export const PAGE = { w: 1364, h: 876 };
export const onPage = (x: number, y: number) => ({ x: SHELL.x + 64 + x, y: SHELL.y + 12 + y });

const GLYPHS = {
  tooth: "M8 4C5.6 4 4.3 5.9 4.3 8.1c0 2.4 1.1 3.7 1.5 5.9.4 2.5.8 6 2.5 6 1.4 0 1.6-3.8 2.4-5.2.4-.7 2.2-.7 2.6 0 .8 1.4 1 5.2 2.4 5.2 1.7 0 2.1-3.5 2.5-6 .4-2.2 1.5-3.5 1.5-5.9C19.7 5.9 18.4 4 16 4c-1.6 0-2.4.9-4 .9S9.6 4 8 4z",
  home: "M4.5 11L12 4.5l7.5 6.5v9h-15zM10 20v-5h4v5",
  repeat: "M16.5 4l3 3-3 3M4.5 11.5V10A3 3 0 0 1 7.5 7h12M7.5 20l-3-3 3-3M19.5 12.5V14a3 3 0 0 1-3 3h-12",
  users: "M9 11a3.5 3.5 0 1 0 0-7a3.5 3.5 0 1 0 0 7zM2.5 20a6.5 6.5 0 0 1 13 0M16 4.3a3.5 3.5 0 0 1 0 6.4M18 14.2a6.5 6.5 0 0 1 3.5 5.8",
  more: "M6 12h.01M12 12h.01M18 12h.01",
  filter: "M4 6.5h16M7 12h10M10 17.5h4",
  chart: "M4.5 19.5h15M6.5 15.5l4-4.5 3 2.5 4.5-6",
  video: "M3.5 7h11v10h-11zM14.5 10.5l6-3.5v10l-6-3.5z",
  scale: "M4.5 4.5h15v15h-15zM8 11a5.5 5.5 0 0 1 8 0M12 11.5l1.6-2.2",
  steth: "M6 3.5v5a4 4 0 0 0 8 0v-5M10 12.5v2a4.5 4.5 0 0 0 9 0v-2M19 12.5a1.8 1.8 0 1 0 0-3.6a1.8 1.8 0 1 0 0 3.6z",
  route: "M6 19.5a2 2 0 1 0 0-4a2 2 0 1 0 0 4zM18 8.5a2 2 0 1 0 0-4a2 2 0 1 0 0 4zM8 17.5h7.5a3 3 0 0 0 0-6h-7a3 3 0 0 1 0-6H16",
  sun: "M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8zM12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4",
  edit: "M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4",
} as const;

export type IcoName = IconName | keyof typeof GLYPHS;

export function Ico({ name, size = 18, color = C.walnut, stroke = 1.9, filled = false }: { name: IcoName; size?: number; color?: string; stroke?: number; filled?: boolean }) {
  if (!(name in GLYPHS)) return <Icon name={name as IconName} size={size} color={color} stroke={stroke} filled={filled} />;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block", flexShrink: 0 }}>
      <path d={GLYPHS[name as keyof typeof GLYPHS]} fill={filled ? color : "none"} stroke={filled ? "none" : color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Settles in from an offset; the default build for product UI. */
export function rise(frame: number, at: number, { x = 0, y = 12, scale = 1, blur = 0, dur = 22 }: { x?: number; y?: number; scale?: number; blur?: number; dur?: number } = {}): CSSProperties {
  const p = ramp(frame, at, dur, EASE_OUT);
  return { opacity: p, transform: `translate(${(1 - p) * x}px, ${(1 - p) * y}px) scale(${lerp(scale, 1, p)})`, filter: blur > 0 && p < 1 ? `blur(${(1 - p) * blur}px)` : undefined };
}

export type Waypoint = { f: number; x: number; y: number };

/** Cursor position along timed waypoints, eased per leg. */
export function track(frame: number, pts: Waypoint[]) {
  const fs = pts.map((p) => p.f);
  return { x: keys(frame, fs, pts.map((p) => p.x)), y: keys(frame, fs, pts.map((p) => p.y)) };
}

export const press = (frame: number, clicks: number[]) => Math.max(0, ...clicks.map((f) => pulse(frame, f - 2, 3, 6)));

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export function PageTitle({ children, size = 46, style }: { children: ReactNode; size?: number; style?: CSSProperties }) {
  return <div style={{ position: "absolute", left: 28, top: 28, fontFamily: F.display, fontWeight: 500, fontSize: size, lineHeight: `${size + 4}px`, letterSpacing: "-0.025em", color: C.walnut, whiteSpace: "nowrap", ...style }}>{children}</div>;
}

export function Display({ children, size = 30, color = C.walnut, style }: { children: ReactNode; size?: number; color?: string; style?: CSSProperties }) {
  return <div style={{ fontFamily: F.display, fontWeight: 500, fontSize: size, lineHeight: `${Math.round(size * 1.12)}px`, letterSpacing: "-0.02em", color, whiteSpace: "nowrap", ...style }}>{children}</div>;
}

type PillTone = "ink" | "soft" | "paper" | "beige" | "outline" | "salmon";
const PILL_TONES: Record<PillTone, CSSProperties> = {
  ink: { background: C.ink, color: C.paper },
  soft: { background: SOFT, color: C.walnut },
  paper: { background: C.paper, color: C.walnut },
  beige: { background: C.beige, color: C.walnut },
  outline: { background: "transparent", color: C.walnut, border: `1px solid ${C.line2}` },
  salmon: { background: C.salmon, color: C.walnut },
};

export function Pill({ icon, trailing, tone = "soft", height = 38, pressed = 0, children, style }: { icon?: IcoName; trailing?: IcoName; tone?: PillTone; height?: number; pressed?: number; children?: ReactNode; style?: CSSProperties }) {
  const t = PILL_TONES[tone];
  const fs = Math.round(height * 0.36);
  return (
    <div
      style={{
        height,
        flexShrink: 0,
        boxSizing: "border-box",
        padding: children ? `0 ${height * 0.42}px 0 ${icon ? height * 0.34 : height * 0.42}px` : 0,
        width: children ? undefined : height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: height * 0.18,
        borderRadius: 999,
        fontFamily: F.ui,
        fontWeight: 500,
        fontSize: fs,
        whiteSpace: "nowrap",
        transform: pressed ? `scale(${1 - 0.07 * pressed})` : undefined,
        ...t,
        ...style,
      }}
    >
      {icon ? <Ico name={icon} size={fs + 2} color={t.color as string} stroke={2} /> : null}
      {children}
      {trailing ? <Ico name={trailing} size={fs - 1} color={t.color as string} stroke={2} /> : null}
    </div>
  );
}

/** Rounded segmented control; `value` may be fractional so the thumb glides. */
export function Segmented({ items, value, height = 38, width, tone = "beige", style }: { items: ReactNode[]; value: number; height?: number; width?: number; tone?: "beige" | "soft"; style?: CSSProperties }) {
  const n = items.length;
  return (
    <div style={{ position: "relative", display: "flex", width, height, padding: 3, boxSizing: "border-box", borderRadius: 999, background: tone === "beige" ? C.beige : SOFT, ...style }}>
      <div style={{ position: "absolute", top: 3, bottom: 3, left: `calc(3px + ${value} * (100% - 6px) / ${n})`, width: `calc((100% - 6px) / ${n})`, borderRadius: 999, background: C.paper }} />
      {items.map((item, i) => (
        <div
          key={i}
          style={{ position: "relative", flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "0 14px", fontFamily: F.ui, fontWeight: 500, fontSize: Math.round(height * 0.37), whiteSpace: "nowrap", color: Math.round(value) === i ? C.walnut : SUB }}
        >
          {item}
        </div>
      ))}
    </div>
  );
}

export type StatusTone = "sage" | "salmon" | "soft" | "ink" | "paper";
const STATUS_TONES: Record<StatusTone, CSSProperties> = {
  sage: { background: SAGE, color: SAGE_TEXT },
  salmon: { background: C.salmon, color: C.ink },
  soft: { background: SOFT, color: C.walnut },
  ink: { background: C.ink, color: C.paper },
  paper: { background: C.paper, color: C.walnut },
};

export function Status({ tone, icon, children, style, size = 1 }: { tone: StatusTone; icon?: IcoName; children: ReactNode; style?: CSSProperties; size?: number }) {
  const t = STATUS_TONES[tone];
  return (
    <div
      style={{
        height: 28 * size,
        padding: `0 ${12 * size}px 0 ${(icon ? 9 : 12) * size}px`,
        display: "inline-flex",
        alignItems: "center",
        gap: 6 * size,
        borderRadius: 999,
        boxSizing: "border-box",
        fontFamily: F.body,
        fontWeight: 500,
        fontSize: 13 * size,
        whiteSpace: "nowrap",
        transformOrigin: "0 50%",
        ...t,
        ...style,
      }}
    >
      {icon ? <Ico name={icon} size={13 * size} color={t.color as string} stroke={2.4} /> : null}
      {children}
    </div>
  );
}

/** Two states stacked in one grid cell; `t` cross-fades from the first to the second with a small pop. */
export function Swap({ t, from, to, pop = 0 }: { t: number; from: ReactNode; to: ReactNode; pop?: number }) {
  return (
    <div style={{ display: "grid", justifyItems: "start", alignItems: "center" }}>
      <div style={{ gridArea: "1 / 1", opacity: 1 - t, transform: `scale(${lerp(1, 0.92, t)})`, transformOrigin: "0 50%" }}>{from}</div>
      <div style={{ gridArea: "1 / 1", opacity: t, transform: `scale(${lerp(0.88, 1, t) + 0.06 * pop})`, transformOrigin: "0 50%" }}>{to}</div>
    </div>
  );
}

export type MenuItem = { label: string; meta?: string; icon?: IcoName };

/** Ink dropdown. `hover` is a fractional row index so the highlight slides between rows. */
export function Menu({ items, open, hover, selected, width = 280, rowH = 42, style }: { items: MenuItem[]; open: number; hover: number; selected?: number; width?: number; rowH?: number; style?: CSSProperties }) {
  if (open <= 0.001) return null;
  return (
    <div
      style={{
        position: "absolute",
        width,
        boxSizing: "border-box",
        padding: 6,
        borderRadius: 18,
        background: C.ink,
        opacity: open,
        transform: `translateY(${(1 - open) * -10}px) scale(${lerp(0.96, 1, open)})`,
        transformOrigin: "50% 0",
        ...style,
      }}
    >
      {hover >= 0 ? <div style={{ position: "absolute", left: 6, right: 6, top: 6 + hover * rowH, height: rowH, borderRadius: 12, background: "rgba(255, 252, 241, 0.12)" }} /> : null}
      {items.map((item, i) => (
        <div key={item.label} style={{ position: "relative", height: rowH, display: "flex", alignItems: "center", gap: 10, padding: "0 12px", fontFamily: F.ui, fontWeight: 500, fontSize: 15, color: C.paper, whiteSpace: "nowrap" }}>
          {item.icon ? <Ico name={item.icon} size={16} color="rgba(255, 252, 241, 0.7)" /> : null}
          <span style={{ flex: 1 }}>{item.label}</span>
          {item.meta ? <span style={{ fontFamily: F.body, fontSize: 13, color: "rgba(255, 252, 241, 0.5)" }}>{item.meta}</span> : null}
          {selected === i ? <Ico name="check" size={15} color={C.paper} stroke={2.4} /> : null}
        </div>
      ))}
    </div>
  );
}

export function Field({ label, children, style }: { label: string; children: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
      <div style={{ fontFamily: F.body, fontWeight: 500, fontSize: 12, lineHeight: "16px", color: "rgba(40, 25, 16, 0.5)" }}>{label}</div>
      {children}
    </div>
  );
}

export function SelectBox({ value, focused = false, style, height = 42 }: { value: ReactNode; focused?: boolean; style?: CSSProperties; height?: number }) {
  return (
    <div
      style={{
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
        padding: "0 14px",
        borderRadius: 12,
        boxSizing: "border-box",
        background: C.beige,
        border: `1.5px solid ${focused ? C.walnut : "transparent"}`,
        fontFamily: F.ui,
        fontWeight: 500,
        fontSize: 15,
        color: C.walnut,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {value}
      <Ico name="chevronDown" size={12} color="rgba(40, 25, 16, 0.48)" />
    </div>
  );
}

const AV_TONES = { salmon: [C.salmon, C.walnut], sage: [SAGE, SAGE_TEXT], sand: [C.sand2, C.walnut], ink: [C.ink, C.paper], paper: [C.paper, C.walnut] } as const;
export type AvTone = keyof typeof AV_TONES;

export function Av({ label, size = 32, tone = "salmon", ring }: { label: string; size?: number; tone?: AvTone; ring?: string }) {
  const [bg, fg] = AV_TONES[tone];
  return (
    <div style={{ width: size, height: size, flexShrink: 0, borderRadius: 999, background: bg, color: fg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.ui, fontWeight: 600, fontSize: size * 0.36, boxSizing: "border-box", border: ring ? `2px solid ${ring}` : undefined }}>
      {label}
    </div>
  );
}

const pointInPoly = (x: number, y: number, poly: [number, number][]) => {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
};

export type Zone = { poly: [number, number][]; fill: number };

/** Halftone dots that fill each zone; `fill` (0–1) grows the dots outward from the zone's centre. */
export function HalftoneZones({ width, height, zones, step = 12, color = C.dot, base = 0 }: { width: number; height: number; zones: Zone[]; step?: number; color?: string; base?: number }) {
  const frame = useCurrentFrame();
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = color;
    const t = frame / 30;
    const centers = zones.map((z) => {
      const cx = z.poly.reduce((s, p) => s + p[0], 0) / z.poly.length;
      const cy = z.poly.reduce((s, p) => s + p[1], 0) / z.poly.length;
      const r = Math.max(...z.poly.map((p) => Math.hypot(p[0] - cx, p[1] - cy)));
      return { cx, cy, r };
    });
    for (let y = step / 2; y < height; y += step) {
      for (let x = step / 2; x < width; x += step) {
        let v = base;
        zones.forEach((z, i) => {
          if (z.fill <= 0 || !pointInPoly(x, y, z.poly)) return;
          const { cx, cy, r } = centers[i];
          const d = Math.hypot(x - cx, y - cy) / r;
          const front = z.fill * 1.25 - d;
          v = Math.max(v, Math.min(1, front * 3.2));
        });
        if (v <= 0.02) continue;
        const h = 0.5 + 0.5 * Math.sin(x / 70 + y / 90 + t * 1.1);
        ctx.globalAlpha = Math.min(0.9, (0.35 + 0.5 * h) * v);
        ctx.beginPath();
        ctx.arc(x, y, (1 + 1.9 * v) * (0.75 + 0.35 * h), 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }, [frame, width, height, zones, step, color, base]);
  return <canvas ref={ref} width={width} height={height} style={{ position: "absolute", left: 0, top: 0, width, height }} />;
}