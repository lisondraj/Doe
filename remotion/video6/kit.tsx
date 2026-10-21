import type { CSSProperties, ReactNode } from "react";

import { EASE_IN_OUT, lerp } from "../video1/motion";
import { C, F } from "../video1/theme";
import { Ico, SAGE, SAGE_TEXT, SUB, clamp01, type IcoName } from "../video4/kit";

export * from "../video4/kit";

export const PANEL = "#FAF6EC";
export const SAND_TILE = "#E9DCC7";
export const PEACH_TILE = "#F7DCCB";
export const SAGE_TILE = "#E3E9D9";
export const BUTTER = "#F3E7C9";

export const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

/** The composer only has room for the end of a long draft. */
export const draftTail = (full: string, n = 29) => (full.length > n + 1 ? "\u2026" + full.slice(-n) : full);

/** Camera between two framings that eases across while the zoom dips out and back in. */
export function arc(frame: number, a: { x: number; y: number; s: number }, b: { x: number; y: number; s: number }, span: { from: number; to: number }, dip = 0.4): CSSProperties {
  const u = EASE_IN_OUT(clamp01((frame - span.from) / (span.to - span.from)));
  const x = lerp(a.x, b.x, u);
  const y = lerp(a.y, b.y, u);
  const s = Math.exp(lerp(Math.log(a.s), Math.log(b.s), u)) * (1 - dip * Math.sin(Math.PI * u));
  return { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "0 0", transform: `translate(${(960 - x * s).toFixed(3)}px, ${(540 - y * s).toFixed(3)}px) scale(${s.toFixed(5)})` };
}

export function Tile({ color = SAND_TILE, icon, size = 36, radius, iconColor = C.walnut }: { color?: string; icon?: IcoName; size?: number; radius?: number; iconColor?: string }) {
  return (
    <div style={{ width: size, height: size, flexShrink: 0, borderRadius: radius ?? size * 0.32, background: color, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {icon ? <Ico name={icon} size={Math.round(size * 0.46)} color={iconColor} stroke={1.9} /> : null}
    </div>
  );
}

/** A list row in the product's panels: tile, name, quiet meta. `active` inverts it to ink. */
export function ListRow({ tile, icon, lead, name, meta, active = 0, height = 60, trailing, style }: { tile?: string; icon?: IcoName; lead?: ReactNode; name: ReactNode; meta?: ReactNode; active?: number; height?: number; trailing?: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{ position: "relative", height, boxSizing: "border-box", padding: "0 12px 0 10px", borderRadius: 18, display: "flex", alignItems: "center", gap: 12, ...style }}>
      {active > 0 ? <div style={{ position: "absolute", inset: 0, borderRadius: 18, background: C.ink, opacity: active, transform: `scale(${lerp(0.94, 1, active)})` }} /> : null}
      <div style={{ position: "relative" }}>{lead ?? <Tile color={tile} icon={icon} size={height * 0.6} />}</div>
      <div style={{ position: "relative", flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 15, lineHeight: "19px", color: active > 0.5 ? C.paper : C.walnut, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</span>
        {meta ? <span style={{ fontFamily: F.body, fontSize: 12, lineHeight: "16px", color: active > 0.5 ? "rgba(255, 252, 241, 0.6)" : SUB, whiteSpace: "nowrap" }}>{meta}</span> : null}
      </div>
      {trailing ? <div style={{ position: "relative" }}>{trailing}</div> : null}
    </div>
  );
}

/** A named presence cursor, the way multiplayer tools show someone else working in the file. */
export function AgentPointer({ x, y, label, opacity = 1, pressed = 0 }: { x: number; y: number; label: string; opacity?: number; pressed?: number }) {
  if (opacity <= 0) return null;
  return (
    <div style={{ position: "absolute", left: x - 2, top: y - 2, opacity, transform: `scale(${1 - 0.12 * pressed})`, transformOrigin: "2px 2px" }}>
      <svg width={26} height={35} viewBox="0 0 22 30" style={{ display: "block" }}>
        <path d="M2 1.8v22.4l6-5.6 4.1 9.3 3.6-1.6-4-9.1h8.2z" fill={C.salmon} stroke={C.walnut} strokeWidth={1.6} strokeLinejoin="round" />
      </svg>
      <div style={{ position: "absolute", left: 22, top: 28, height: 30, padding: "0 12px", borderRadius: 999, background: C.salmon, display: "flex", alignItems: "center", fontFamily: F.ui, fontWeight: 600, fontSize: 14, color: C.walnut, whiteSpace: "nowrap" }}>{label}</div>
    </div>
  );
}

/** A requirement that resolves from a dashed ring to a sage check. */
export function CheckRow({ label, done, height = 44, trailing }: { label: ReactNode; done: number; height?: number; trailing?: ReactNode }) {
  return (
    <div style={{ height, display: "flex", alignItems: "center", gap: 12, padding: "0 14px", borderRadius: 14, background: C.paper }}>
      <div style={{ position: "relative", width: 24, height: 24, flexShrink: 0 }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 999, border: "1.5px dashed rgba(40, 25, 16, 0.3)", boxSizing: "border-box", opacity: 1 - done }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: 999, background: SAGE, display: "flex", alignItems: "center", justifyContent: "center", opacity: done, transform: `scale(${lerp(0.5, 1, done)})` }}>
          <Ico name="check" size={13} color={SAGE_TEXT} stroke={3} />
        </div>
      </div>
      <span style={{ flex: 1, fontFamily: F.ui, fontWeight: 500, fontSize: 15, color: C.walnut, whiteSpace: "nowrap" }}>{label}</span>
      {trailing}
    </div>
  );
}

export function PanelTitle({ children, count, style }: { children: ReactNode; count?: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{ height: 44, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 8px 0 10px", ...style }}>
      <span style={{ fontFamily: F.display, fontWeight: 500, fontSize: 22, lineHeight: "26px", letterSpacing: "-0.015em", color: C.walnut, whiteSpace: "nowrap" }}>{children}</span>
      {count !== undefined ? <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 13, color: SUB, fontVariantNumeric: "tabular-nums" }}>{count}</span> : null}
    </div>
  );
}
