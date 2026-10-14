import { useContext, type ReactNode } from "react";

import { EASE_OUT, blink, lerp, ramp } from "./motion";
import { F } from "./theme";
import { Caret, Icon, ShadowsContext } from "./ui";

export const IOS = { blue: "#007AFF", gray: "#E9E9EB", label: "#8E8E93", hairline: "#E5E5EA" };

/** iPhone running iMessage: header with the contact, a thread, and the composer showing `draft`. */
/** Frame geometry, shared with morphs that start from the phone. */
export const IPHONE_BEZEL = { pad: 5, outer: 60, inner: 55, ring: "#2A2A2A", body: "#111111" };

export function IPhone({
  frame,
  width,
  height,
  contact = "Agent",
  draft,
  composing,
  sendPress,
  children,
}: {
  frame: number;
  width: number;
  height: number;
  contact?: string;
  draft: string;
  /** Shows the composer caret. */
  composing: boolean;
  sendPress: number;
  children: ReactNode;
}) {
  const shadows = useContext(ShadowsContext);
  return (
    <div
      style={{ width, height, boxSizing: "border-box", padding: IPHONE_BEZEL.pad, borderRadius: IPHONE_BEZEL.outer, background: IPHONE_BEZEL.body, boxShadow: `0 0 0 1px ${IPHONE_BEZEL.ring}${shadows ? ", 0 50px 120px rgba(20, 12, 4, 0.28)" : ""}` }}
    >
      <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: IPHONE_BEZEL.inner, overflow: "hidden", background: "#FFFFFF", fontFamily: F.ios }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 150, bottom: 86, overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 14px 8px" }}>{children}</div>

        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 150, background: "rgba(248, 248, 248, 0.96)", borderBottom: `1px solid ${IOS.hairline}` }}>
          <div style={{ position: "absolute", left: 36, top: 17, fontWeight: 600, fontSize: 17, color: "#000" }}>9:41</div>
          <div style={{ position: "absolute", left: "50%", top: 11, width: 122, height: 35, marginLeft: -61, borderRadius: 20, background: "#000" }} />
          <StatusIcons />
          <div style={{ position: "absolute", left: 10, top: 76 }}>
            <Icon name="chevronLeft" size={30} color={IOS.blue} stroke={2.4} />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 58, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
            <div style={{ width: 52, height: 52, borderRadius: 999, background: "#A4A8B1", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontWeight: 600, fontSize: 22 }}>{contact[0]}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 2, fontSize: 12, color: "#000" }}>
              {contact}
              <span style={{ color: IOS.label, fontSize: 12 }}>›</span>
            </div>
          </div>
          <svg width={28} height={20} viewBox="0 0 28 20" style={{ position: "absolute", right: 18, top: 82 }}>
            <rect x={1} y={3} width={17} height={14} rx={4} fill="none" stroke={IOS.blue} strokeWidth={2} />
            <path d="M19.5 8.5l6-4v11l-6-4z" fill="none" stroke={IOS.blue} strokeWidth={2} strokeLinejoin="round" />
          </svg>
        </div>

        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 86, boxSizing: "border-box", padding: "8px 12px 34px", display: "flex", alignItems: "center", gap: 10, background: "#FFFFFF" }}>
          <div style={{ width: 34, height: 34, borderRadius: 999, background: "#EEEEF0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name="plus" size={18} color={IOS.label} stroke={2.2} />
          </div>
          <div style={{ flex: 1, height: 36, boxSizing: "border-box", borderRadius: 18, border: "1px solid #D1D1D6", display: "flex", alignItems: "center", padding: "0 3px 0 14px", fontSize: 16, color: draft ? "#000" : "#B0B0B5" }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
              {draft || "iMessage"}
              {composing ? <Caret height={19} color={IOS.blue} visible={draft ? 1 : blink(frame, 12)} /> : null}
            </div>
            {draft ? (
              <div style={{ width: 28, height: 28, borderRadius: 999, background: IOS.blue, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 - 0.15 * sendPress})` }}>
                <Icon name="arrowUp" size={16} color="#FFF" stroke={2.6} />
              </div>
            ) : null}
          </div>
        </div>
        <div style={{ position: "absolute", left: "50%", bottom: 8, width: 134, height: 5, marginLeft: -67, borderRadius: 3, background: "#000" }} />
      </div>
    </div>
  );
}

function StatusIcons() {
  return (
    <svg width={78} height={14} viewBox="0 0 78 14" style={{ position: "absolute", right: 28, top: 21 }}>
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={i * 5} y={10 - i * 2.6} width={3.4} height={3.6 + i * 2.6} rx={1} fill="#000" />
      ))}
      <path d="M30 5.2a9.5 9.5 0 0 1 13 0M32.4 8a6 6 0 0 1 8.2 0M34.8 10.7a2.4 2.4 0 0 1 3.4 0" fill="none" stroke="#000" strokeWidth={1.7} strokeLinecap="round" />
      <rect x={50} y={1.5} width={23} height={11} rx={3.4} fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth={1} />
      <rect x={52} y={3.5} width={17} height={7} rx={1.8} fill="#000" />
      <path d="M75 5.5v3.2" stroke="rgba(0,0,0,0.4)" strokeWidth={1.6} strokeLinecap="round" />
    </svg>
  );
}

/** A thread row that grows from zero height so older messages push up like a real chat. */
export function Slot({ frame, at, until, side, dur = 10, children }: { frame: number; at: number; until?: number; side: "in" | "out" | "center"; dur?: number; children: ReactNode }) {
  const grow = ramp(frame, at, dur) * (until === undefined ? 1 : 1 - ramp(frame, until, 6));
  if (grow <= 0) return null;
  const pop = ramp(frame, at + dur * 0.25, dur, EASE_OUT) * (until === undefined ? 1 : 1 - ramp(frame, until, 4));
  const justify = side === "out" ? "flex-end" : side === "center" ? "center" : "flex-start";
  return (
    <div style={{ display: "grid", gridTemplateRows: `${grow}fr`, flexShrink: 0 }}>
      <div style={{ minHeight: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
        <div style={{ flexShrink: 0, display: "flex", justifyContent: justify, paddingTop: 6 }}>
          <div style={{ opacity: pop, transform: `translateY(${(1 - pop) * 14}px) scale(${lerp(0.9, 1, pop)})`, transformOrigin: side === "out" ? "100% 100%" : "0% 100%" }}>{children}</div>
        </div>
      </div>
    </div>
  );
}

export function Bubble({ out, children }: { out?: boolean; children: ReactNode }) {
  return <div style={{ maxWidth: 268, padding: "8px 13px", borderRadius: 19, background: out ? IOS.blue : IOS.gray, color: out ? "#FFF" : "#000", fontSize: 16, lineHeight: "21px", letterSpacing: "-0.01em" }}>{children}</div>;
}

export function TypingBubble({ frame }: { frame: number }) {
  return (
    <div style={{ display: "flex", gap: 5, padding: "13px 14px", borderRadius: 19, background: IOS.gray }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ width: 8, height: 8, borderRadius: 99, background: IOS.label, opacity: 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(frame * 0.4 - i * 0.9)) }} />
      ))}
    </div>
  );
}

export function TimeStamp({ day, time }: { day: string; time: string }) {
  return (
    <div style={{ fontSize: 11, color: IOS.label, padding: "4px 0" }}>
      <span style={{ fontWeight: 600 }}>{day}</span> {time}
    </div>
  );
}
