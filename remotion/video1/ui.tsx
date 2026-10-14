import { createContext, useContext, type CSSProperties, type ReactNode } from "react";

import { C, F, SHADOW } from "./theme";

/** Set to false to render the shared components without drop shadows. */
export const ShadowsContext = createContext(true);

export type IconName =
  | "phone"
  | "search"
  | "plus"
  | "check"
  | "chevronDown"
  | "chevronLeft"
  | "calendar"
  | "user"
  | "doc"
  | "card"
  | "building"
  | "pill"
  | "shield"
  | "headset"
  | "arrowUp"
  | "arrowRight"
  | "x"
  | "grid"
  | "list"
  | "clock"
  | "link"
  | "inbox"
  | "ear"
  | "mapPin"
  | "sync"
  | "play"
  | "paperclip"
  | "lock"
  | "eye";

const PATHS: Record<IconName, string> = {
  phone: "M5 4.5h3.2l1.6 4-2 1.3a10.5 10.5 0 0 0 6.4 6.4l1.3-2 4 1.6V19a1.5 1.5 0 0 1-1.6 1.5C10.6 20 4 13.4 3.5 6.1A1.5 1.5 0 0 1 5 4.5z",
  search: "M11 4a7 7 0 1 0 0 14a7 7 0 1 0 0-14zM20 20l-4.2-4.2",
  plus: "M12 5v14M5 12h14",
  check: "M5 12.5l4.5 4.5L19 7.5",
  chevronDown: "M6 9l6 6 6-6",
  chevronLeft: "M15 5l-7 7 7 7",
  calendar: "M4.5 6.5h15v13h-15zM4.5 10.5h15M8.5 4v4M15.5 4v4",
  user: "M12 12a4 4 0 1 0 0-8a4 4 0 1 0 0 8zM4.5 20.5a7.5 7.5 0 0 1 15 0",
  doc: "M7 3.5h7l4 4v13H7zM14 3.5v4h4M9.5 12.5h6M9.5 16h6",
  card: "M3.5 6.5h17v11h-17zM3.5 10.5h17M7 14.5h3",
  building: "M5 20.5V7l7-3.5L19 7v13.5M3.5 20.5h17M9.5 20.5v-4h5v4M9 10h.01M15 10h.01M9 13.5h.01M15 13.5h.01",
  pill: "M10.6 3.9a5 5 0 0 1 7.1 7.1l-6.7 6.7a5 5 0 0 1-7.1-7.1zM7.2 7.3l9.5 9.5",
  shield: "M12 3.5l7 2.8v5.4c0 4.4-2.9 7.5-7 8.8-4.1-1.3-7-4.4-7-8.8V6.3z",
  headset: "M4.5 15v-3a7.5 7.5 0 0 1 15 0v3M4.5 14.5h3v6H6a1.5 1.5 0 0 1-1.5-1.5zM19.5 14.5h-3v6H18a1.5 1.5 0 0 0 1.5-1.5z",
  arrowUp: "M12 19V5.5M6.5 11L12 5.5 17.5 11",
  arrowRight: "M5 12h13.5M13 6.5l5.5 5.5-5.5 5.5",
  x: "M6.5 6.5l11 11M17.5 6.5l-11 11",
  grid: "M4.5 4.5h6v6h-6zM13.5 4.5h6v6h-6zM4.5 13.5h6v6h-6zM13.5 13.5h6v6h-6z",
  list: "M9 6.5h11M9 12h11M9 17.5h11M4.5 6.5h.01M4.5 12h.01M4.5 17.5h.01",
  clock: "M12 3.5a8.5 8.5 0 1 0 0 17a8.5 8.5 0 1 0 0-17zM12 7.5V12l3 2",
  link: "M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1",
  inbox: "M4 13.5L6.2 5h11.6L20 13.5V19H4zM4 13.5h4.8l1.4 2.2h3.6l1.4-2.2H20",
  ear: "M7.5 9a5 5 0 0 1 10 0c0 3-2.5 4-3 6a3 3 0 0 1-5.5 1.5M10.5 9.5a1.8 1.8 0 0 1 3.5.5c0 1.2-1 1.6-1.4 2.5",
  mapPin: "M12 20.5s6.5-5.6 6.5-10.5a6.5 6.5 0 0 0-13 0c0 4.9 6.5 10.5 6.5 10.5zM12 12a2 2 0 1 0 0-4a2 2 0 1 0 0 4z",
  sync: "M19.5 11A7.5 7.5 0 0 0 6 6.8L4.5 8.5M4.5 4.5v4h4M4.5 13A7.5 7.5 0 0 0 18 17.2l1.5-1.7M19.5 19.5v-4h-4",
  play: "M8 5.5v13l10.5-6.5z",
  paperclip: "M19 11.5l-7.6 7.6a4.5 4.5 0 0 1-6.4-6.4l8-8a3 3 0 0 1 4.3 4.3l-7.7 7.7a1.5 1.5 0 0 1-2.1-2.1l7-7",
  lock: "M6.5 10.5h11v9h-11zM8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5",
  eye: "M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12zM12 9.25a2.75 2.75 0 1 0 0 5.5 2.75 2.75 0 1 0 0-5.5z",
};

export function Icon({ name, size = 18, color = C.walnut, stroke = 1.9, filled = false }: { name: IconName; size?: number; color?: string; stroke?: number; filled?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block", flexShrink: 0 }}>
      <path d={PATHS[name]} fill={filled ? color : "none"} stroke={filled ? "none" : color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export type ChipTone = "salmon" | "neutral" | "ink" | "outline" | "dashed" | "sand" | "paper" | "green";

const CHIP_TONES: Record<ChipTone, CSSProperties> = {
  salmon: { background: C.salmon, color: C.salmonText },
  neutral: { background: C.chip, color: C.walnut },
  ink: { background: C.ink, color: C.paper },
  outline: { background: "transparent", color: C.walnut, border: `1px solid ${C.line2}` },
  dashed: { background: "transparent", color: C.muted, border: "1px dashed rgba(40, 25, 16, 0.28)" },
  sand: { background: C.beige, color: C.walnut },
  paper: { background: C.paper, color: C.walnut },
  green: { background: C.liveBg, color: C.liveText },
};

export function Chip({ tone = "neutral", size = 1, icon, trailing, children, style }: { tone?: ChipTone; size?: number; icon?: ReactNode; trailing?: ReactNode; children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6 * size,
        height: 26 * size,
        padding: `0 ${10 * size}px`,
        borderRadius: 999,
        boxSizing: "border-box",
        whiteSpace: "nowrap",
        fontFamily: F.ui,
        fontWeight: 500,
        fontSize: 13 * size,
        lineHeight: 1,
        ...CHIP_TONES[tone],
        ...style,
      }}
    >
      {icon}
      {children}
      {trailing}
    </div>
  );
}

/** `progress` (0–1) animates the switch; otherwise `on` sets it. */
export function Toggle({ on = true, size = 1, progress }: { on?: boolean; size?: number; progress?: number }) {
  const shadows = useContext(ShadowsContext);
  const t = progress ?? (on ? 1 : 0);
  return (
    <div style={{ position: "relative", width: 36 * size, height: 20 * size, borderRadius: 999, background: "rgba(40, 25, 16, 0.14)", flexShrink: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 999, background: C.ink, opacity: t }} />
      <div style={{ position: "absolute", top: 2 * size, left: (2 + 16 * t) * size, width: 16 * size, height: 16 * size, borderRadius: 999, background: C.paper, boxShadow: shadows ? "0 1px 2px rgba(20, 12, 4, 0.2)" : undefined }} />
    </div>
  );
}

export function Caret({ height = 20, color = C.walnut, visible = 1, width = 2 }: { height?: number; color?: string; visible?: number; width?: number }) {
  return <span style={{ display: "inline-block", width, height, marginLeft: 2, background: color, opacity: visible, verticalAlign: "middle", borderRadius: 1 }} />;
}

export function Cursor({ x, y, pressed = 0, size = 30 }: { x: number; y: number; pressed?: number; size?: number }) {
  const shadows = useContext(ShadowsContext);
  return (
    <div style={{ position: "absolute", left: x - 2, top: y - 2, transform: `scale(${1 - 0.14 * pressed})`, transformOrigin: "2px 2px", filter: shadows ? "drop-shadow(0 4px 8px rgba(20, 12, 4, 0.25))" : undefined }}>
      <svg width={size} height={size * 1.36} viewBox="0 0 22 30" style={{ display: "block" }}>
        <path d="M2 1.8v22.4l6-5.6 4.1 9.3 3.6-1.6-4-9.1h8.2z" fill={C.ink} stroke={C.paper} strokeWidth={1.6} strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export function ClickRing({ x, y, progress }: { x: number; y: number; progress: number }) {
  if (progress <= 0 || progress >= 1) return null;
  const r = 10 + 34 * progress;
  return <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: 999, border: `2px solid rgba(20, 12, 4, ${0.35 * (1 - progress)})`, boxSizing: "border-box" }} />;
}

const AVATAR_TONES = { salmon: { background: C.salmon, color: C.walnut }, ink: { background: C.ink, color: C.paper }, sand: { background: C.beige, color: C.walnut }, paper: { background: C.paper, color: C.walnut } } as const;

export function Avatar({ label, size = 40, tone = "salmon" }: { label: string; size?: number; tone?: keyof typeof AVATAR_TONES }) {
  return <div style={{ width: size, height: size, borderRadius: 999, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.ui, fontWeight: 600, fontSize: size * 0.36, ...AVATAR_TONES[tone] }}>{label}</div>;
}

/** `checked` is a 0–1 progress so boxes can fill in on cue. */
export function CheckBox({ checked, size = 22 }: { checked: number; size?: number }) {
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        borderRadius: size * 0.3,
        flexShrink: 0,
        boxSizing: "border-box",
        border: `1.5px solid rgba(40, 25, 16, ${0.25 * (1 - checked)})`,
        background: `rgba(40, 25, 16, ${checked})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ opacity: checked, transform: `scale(${0.6 + 0.4 * checked})` }}>
        <Icon name="check" size={size * 0.7} color={C.paper} stroke={3} />
      </div>
    </div>
  );
}

export function Label({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div style={{ fontFamily: F.body, fontSize: 13, lineHeight: "16px", color: C.muted, ...style }}>{children}</div>;
}

export function StatusDot({ color = C.live, size = 8 }: { color?: string; size?: number }) {
  return <div style={{ width: size, height: size, borderRadius: 99, background: color, flexShrink: 0 }} />;
}

const RAIL_ICONS: IconName[] = ["phone", "inbox", "list", "user", "link", "clock"];

/** Per-icon entrance progress (0 to 1) for the rail; omit for a static rail. */
export type RailReveal = (index: number) => number;

export function Rail({ active, height, reveal }: { active: number; height: number; reveal?: RailReveal }) {
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 64, height, display: "flex", flexDirection: "column", alignItems: "center", boxSizing: "border-box", padding: "22px 0" }}>
      <div style={{ fontFamily: F.display, fontWeight: 500, fontSize: 26, lineHeight: "28px", color: C.paper }}>D</div>
      <div style={{ margin: "auto 0", display: "flex", flexDirection: "column", gap: 10 }}>
        {RAIL_ICONS.map((name, i) => {
          const p = reveal ? reveal(i) : 1;
          return (
            <div
              key={name}
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: i === active ? "rgba(255, 252, 241, 0.10)" : "transparent",
                opacity: p,
                transform: `translateY(${(1 - p) * 10}px) scale(${0.8 + 0.2 * p})`,
                filter: p < 1 ? `blur(${(1 - p) * 3}px)` : undefined,
              }}
            >
              <Icon name={name} size={18} stroke={1.8} color={i === active ? C.paper : "rgba(255, 252, 241, 0.5)"} />
            </div>
          );
        })}
      </div>
      <Avatar label="RH" size={32} />
    </div>
  );
}

/** The real Doe shell: ink frame, 64px rail, dotted paper panel. Children use paper-panel coordinates. */
export function AppShell({
  active,
  children,
  width = 1440,
  height = 900,
  plain = false,
  railReveal,
}: {
  active: number;
  children: ReactNode;
  width?: number;
  height?: number;
  /** Plain paper panel, for pages whose artwork sits behind the content. */
  plain?: boolean;
  railReveal?: RailReveal;
}) {
  const shadows = useContext(ShadowsContext);
  return (
    <div style={{ position: "relative", width, height, borderRadius: 28, overflow: "hidden", background: C.ink, boxShadow: shadows ? SHADOW.shell : undefined }}>
      <Rail active={active} height={height} reveal={railReveal} />
      <div
        style={{
          position: "absolute",
          left: 64,
          top: 12,
          width: width - 76,
          height: height - 24,
          borderRadius: 24,
          overflow: "hidden",
          background: C.paper,
          backgroundImage: plain ? undefined : "radial-gradient(rgba(40, 25, 16, 0.09) 1px, transparent 1.3px)",
          backgroundSize: "18px 18px",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function Button({ children, tone = "ink", height = 46, icon, style }: { children: ReactNode; tone?: "ink" | "salmon" | "sand" | "outline"; height?: number; icon?: ReactNode; style?: CSSProperties }) {
  const tones: Record<string, CSSProperties> = {
    ink: { background: C.ink, color: C.paper },
    salmon: { background: C.salmon, color: C.walnut },
    sand: { background: C.beige, color: C.walnut },
    outline: { background: "transparent", color: C.walnut, border: `1px solid ${C.line2}` },
  };
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        height,
        padding: `0 ${height * 0.42}px`,
        borderRadius: 999,
        boxSizing: "border-box",
        fontFamily: F.ui,
        fontWeight: 500,
        fontSize: height * 0.33,
        whiteSpace: "nowrap",
        ...tones[tone],
        ...style,
      }}
    >
      {icon}
      {children}
    </div>
  );
}
