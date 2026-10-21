import type { CSSProperties, ReactNode } from "react";
import { Audio, interpolate, staticFile } from "remotion";

import { lerp } from "../video1/motion";
import { C, F } from "../video1/theme";
import { Chip, Icon, type IconName } from "../video1/ui";

/** Every section runs 30 seconds. */
export const SECTION_FRAMES = 900;

/** Same bed and cue as /video1, a little louder since there is no voiceover over it. */
const BED_START = 1230;
const BED_VOLUME = 0.36;

export function BedTrack() {
  return (
    <Audio
      src={staticFile("video1/BED.m4a")}
      startFrom={BED_START}
      volume={(f) => BED_VOLUME * interpolate(f, [0, 6, SECTION_FRAMES - 30, SECTION_FRAMES], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
    />
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

export const H = {
  system: "Northfield Health",
  campus: "Lakeview Children’s Campus",
} as const;

export function IconButton({ icon, size = 38, tone = C.beige, color = C.walnut }: { icon: IconName; size?: number; tone?: string; color?: string }) {
  return (
    <div style={{ width: size, height: size, borderRadius: 999, flexShrink: 0, background: tone, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Icon name={icon} size={size * 0.42} color={color} />
    </div>
  );
}

export function SearchField({
  value,
  placeholder = "Search",
  width,
  height = 38,
  focused = 0,
  caret = 0,
}: {
  value?: string;
  placeholder?: string;
  width?: number;
  height?: number;
  focused?: number;
  caret?: number;
}) {
  const filled = Boolean(value);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        width,
        height,
        padding: `0 ${height * 0.42}px`,
        boxSizing: "border-box",
        borderRadius: 999,
        background: C.beige,
        boxShadow: focused > 0 ? `inset 0 0 0 1.5px rgba(40, 25, 16, ${0.45 * focused})` : undefined,
        fontFamily: F.ui,
        fontWeight: 500,
        fontSize: height * 0.37,
        color: filled ? C.walnut : C.faint,
        whiteSpace: "nowrap",
      }}
    >
      <Icon name="search" size={height * 0.4} color={C.muted} />
      <span style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>{filled ? value : placeholder}</span>
      {caret > 0 ? <span style={{ width: 1.5, height: height * 0.45, background: C.walnut, opacity: caret, borderRadius: 1 }} /> : null}
    </div>
  );
}

export function Tile({ icon, size = 44, tone = C.beige, color = C.walnut, radius }: { icon: IconName; size?: number; tone?: string; color?: string; radius?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: radius ?? size * 0.32, flexShrink: 0, background: tone, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Icon name={icon} size={size * 0.48} color={color} />
    </div>
  );
}

export function Dropdown({ value, label, height = 38, width, tone = C.beige, open = 0, style }: { value: string; label?: string; height?: number; width?: number; tone?: string; open?: number; style?: CSSProperties }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
        width,
        height,
        padding: `0 ${height * 0.38}px 0 ${height * 0.42}px`,
        boxSizing: "border-box",
        borderRadius: 999,
        background: tone,
        boxShadow: open > 0 ? `inset 0 0 0 1.5px rgba(40, 25, 16, ${0.5 * open})` : undefined,
        fontFamily: F.ui,
        fontWeight: 500,
        fontSize: height * 0.37,
        color: C.walnut,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      <span>
        {label ? <span style={{ color: C.muted }}>{label} </span> : null}
        {value}
      </span>
      <div style={{ transform: `rotate(${180 * open}deg)` }}>
        <Icon name="chevronDown" size={height * 0.34} color={C.muted} stroke={2.2} />
      </div>
    </div>
  );
}

/** Pill track with a paper thumb that slides to the fractional `active` index. */
export function Segmented({ options, active, height = 40, dark = false, style }: { options: string[]; active: number; height?: number; dark?: boolean; style?: CSSProperties }) {
  const n = options.length;
  return (
    <div style={{ position: "relative", display: "flex", height, padding: 4, borderRadius: 999, boxSizing: "border-box", background: dark ? "rgba(255, 252, 241, 0.08)" : C.beige, ...style }}>
      <div style={{ position: "absolute", top: 4, bottom: 4, left: `calc(4px + ${active} * (100% - 8px) / ${n})`, width: `calc((100% - 8px) / ${n})`, borderRadius: 999, background: C.paper }} />
      {options.map((label, i) => {
        const on = 1 - Math.min(1, Math.abs(active - i));
        return (
          <div
            key={label}
            style={{
              position: "relative",
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: F.ui,
              fontWeight: 500,
              fontSize: height * 0.36,
              color: on > 0.5 ? C.walnut : dark ? "rgba(255, 252, 241, 0.6)" : "rgba(40, 25, 16, 0.5)",
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
}

export type Access = "allowed" | "request" | "restricted" | "off";

export function AccessPill({ level, size = 1 }: { level: Access; size?: number }) {
  if (level === "allowed")
    return (
      <Chip tone="green" size={size} icon={<Icon name="check" size={12 * size} color={C.liveText} stroke={2.6} />}>
        Allowed
      </Chip>
    );
  if (level === "request") return <Chip tone="salmon" size={size}>Request only</Chip>;
  if (level === "restricted")
    return (
      <Chip tone="neutral" size={size} icon={<Icon name="lock" size={12 * size} stroke={2} />}>
        Restricted
      </Chip>
    );
  return (
    <Chip tone="dashed" size={size}>
      Off
    </Chip>
  );
}

const discCache = new Map<string, { x: number; y: number; d: number }[]>();

function discDots(size: number, step: number) {
  const key = `${size}:${step}`;
  const cached = discCache.get(key);
  if (cached) return cached;
  const r = size / 2;
  const rowH = step * 0.866;
  const dots: { x: number; y: number; d: number }[] = [];
  for (let row = -Math.ceil(r / rowH); row <= Math.ceil(r / rowH); row++) {
    const y = row * rowH;
    for (let x = -r + (row % 2 ? step / 2 : 0); x <= r; x += step) {
      const dist = Math.hypot(x, y);
      if (dist <= r - 1) dots.push({ x, y, d: dist / r });
    }
  }
  discCache.set(key, dots);
  return dots;
}

/** The product's halftone avatar: dots swell toward the middle; `reveal` blooms them outward from the centre. */
export function HalftoneDisc({ size, color = C.dot, step = 7, reveal = 1, style }: { size: number; color?: string; step?: number; reveal?: number; style?: CSSProperties }) {
  const r = size / 2;
  const big = step * 0.42;
  return (
    <svg width={size} height={size} viewBox={`${-r} ${-r} ${size} ${size}`} style={{ display: "block", flexShrink: 0, overflow: "visible", ...style }}>
      {discDots(size, step).map((p, i) => {
        const grow = clamp01((reveal * 1.6 - p.d) / 0.6);
        const rad = big * Math.pow(Math.max(0, 1 - p.d * p.d), 0.65) * grow;
        return rad < 0.4 ? null : <circle key={i} cx={p.x.toFixed(2)} cy={p.y.toFixed(2)} r={rad.toFixed(2)} fill={color} />;
      })}
    </svg>
  );
}

/** Pastel row tiles from the product's Index. */
export const TILE_TONES = ["#F7DCCB", "#E9DCC7", "#E3E9D9", "#EFE3D3"] as const;

/** A card-sized floating surface on the beige ground. */
export const surface: CSSProperties = { position: "absolute", boxSizing: "border-box", background: C.paper, border: `1px solid ${C.line}` };

export function Row({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div style={{ display: "flex", alignItems: "center", ...style }}>{children}</div>;
}
