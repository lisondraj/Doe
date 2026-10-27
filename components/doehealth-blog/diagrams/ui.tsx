"use client";

import type { CSSProperties, ReactNode } from "react";

import { C, F, SHADOW } from "@/remotion/video1/theme";

/**
 * The product's own pieces (/doehealthproduct): paper panels, sand rows, P22 names, DM Sans values, and the status
 * pills of Agent Access. Every figure is built from these and nothing else, at sizes that stay readable once the
 * artboard is scaled into a phone box.
 */

export const WIDE = { w: 1200, h: 675 };
export const COMPACT = { w: 560, h: 420 };

/** Type sizes on the artboard, wide and compact. */
export function sizes(compact: boolean) {
  return compact ? { name: 26, text: 21, tag: 19, big: 44, pad: 22, gap: 12, row: 56 } : { name: 30, text: 22, tag: 19, big: 56, pad: 44, gap: 16, row: 66 };
}

export type TagTone = "allowed" | "review" | "muted" | "off" | "ink" | "paper";

const TAG: Record<TagTone, CSSProperties> = {
  allowed: { background: "#D6DEC6", color: "#2F3B2A" },
  review: { background: "#F6C9B2", color: "#7A3E26" },
  muted: { background: "rgba(40, 25, 16, 0.08)", color: "rgba(40, 25, 16, 0.7)" },
  off: { background: "transparent", color: "rgba(40, 25, 16, 0.55)", boxShadow: "inset 0 0 0 1.5px rgba(40, 25, 16, 0.2)" },
  ink: { background: C.ink, color: C.paper },
  paper: { background: C.paper, color: C.walnut },
};

export const TILES = ["#E9DCC7", "#F7DCCB", "#E3E9D9", "#DCE5D0", "#EEEADF", "#FCCFB8"] as const;

export function Board({ compact, box: size, children, style }: { compact: boolean; box?: { w: number; h: number }; children: ReactNode; style?: CSSProperties }) {
  const s = sizes(compact);
  const box = compact ? COMPACT : (size ?? WIDE);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: box.w,
        height: box.h,
        boxSizing: "border-box",
        padding: s.pad,
        display: "flex",
        gap: s.gap * 1.5,
        fontFamily: F.ui,
        color: C.walnut,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Panel({ children, dark = false, style }: { children: ReactNode; dark?: boolean; style?: CSSProperties }) {
  return (
    <div
      style={{
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: 14,
        borderRadius: 28,
        background: dark ? C.ink : C.paper,
        color: dark ? C.paper : C.walnut,
        boxShadow: dark ? "none" : SHADOW.float,
        minWidth: 0,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** A list row: sand at rest, paper with an ink ring when it is the one in focus. */
export function Row({ compact, on = 0, children, style }: { compact: boolean; on?: number; children: ReactNode; style?: CSSProperties }) {
  const s = sizes(compact);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: s.gap,
        minHeight: s.row,
        padding: `0 ${compact ? 14 : 18}px`,
        boxSizing: "border-box",
        borderRadius: 18,
        background: on > 0.5 ? C.paper : "rgba(244, 238, 223, 0.75)",
        boxShadow: `inset 0 0 0 ${1.5 * on}px ${C.ink}`,
        minWidth: 0,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Name({ compact, size, children, style }: { compact: boolean; size?: number; children: ReactNode; style?: CSSProperties }) {
  return (
    <span
      style={{
        fontFamily: F.display,
        fontWeight: 500,
        fontSize: size ?? sizes(compact).name,
        lineHeight: 1.1,
        letterSpacing: "-0.02em",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        minWidth: 0,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

export function Text({ compact, children, style }: { compact: boolean; children: ReactNode; style?: CSSProperties }) {
  return <span style={{ fontSize: sizes(compact).text, lineHeight: 1.3, color: C.muted, whiteSpace: "nowrap", ...style }}>{children}</span>;
}

export function Tag({ compact, tone = "muted", children, style }: { compact: boolean; tone?: TagTone; children: ReactNode; style?: CSSProperties }) {
  const size = sizes(compact).tag;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        height: size * 1.9,
        padding: `0 ${size * 0.7}px`,
        borderRadius: 999,
        fontSize: size,
        fontWeight: 500,
        whiteSpace: "nowrap",
        flexShrink: 0,
        transition: "background 200ms, color 200ms",
        ...TAG[tone],
        ...style,
      }}
    >
      {children}
    </span>
  );
}

export function Tile({ color, size = 40, children }: { color: string; size?: number; children?: ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        borderRadius: size * 0.32,
        background: color,
        flexShrink: 0,
        fontFamily: F.display,
        fontSize: size * 0.5,
        color: C.walnut,
      }}
    >
      {children}
    </span>
  );
}

export function Tick({ size = 18 }: { size?: number }) {
  return (
    <svg width={size * 0.7} height={size * 0.7} viewBox="0 0 24 24" style={{ display: "block" }} aria-hidden>
      <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Lock({ size = 18, open = false }: { size?: number; open?: boolean }) {
  return (
    <svg width={size * 0.8} height={size * 0.8} viewBox="0 0 24 24" style={{ display: "block" }} aria-hidden>
      <path d={open ? "M7 11V8a5 5 0 0 1 9.6-2M6 11h12v9H6z" : "M7 11V8a5 5 0 0 1 10 0v3M6 11h12v9H6z"} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Spacer() {
  return <span style={{ flex: 1 }} />;
}
