import type { CSSProperties, ReactNode } from "react";

import { DOEHEALTH_DESK_PRODUCT_INK, DOEHEALTH_DESK_RADIUS_PX } from "@/lib/doehealth/doehealth-desk-colors";
import { dmSans, inter } from "@/lib/home/fonts";

const INK = DOEHEALTH_DESK_PRODUCT_INK;
const R = DOEHEALTH_DESK_RADIUS_PX;
const DM = dmSans.style.fontFamily;
const INTER = inter.style.fontFamily;
const PANEL_HEIGHT = 626;

const smooth: CSSProperties = {
  boxSizing: "border-box",
  fontSynthesis: "none",
  MozOsxFontSmoothing: "grayscale",
  WebkitFontSmoothing: "antialiased",
};

const MORNING = [
  { time: "8:00", who: "" },
  { time: "8:40", who: "Labs" },
  { time: "9:40", who: "Maya", on: true },
  { time: "10:20", who: "" },
  { time: "11:00", who: "New" },
] as const;

/** Same inspector height, composed as the morning rather than a stack of steps. */
export function DoeHealthDeskFrontDeskPanel() {
  return (
    <aside className="desk-front-desk-panel" aria-label="Front Desk" style={{ ...smooth, height: PANEL_HEIGHT, overflow: "hidden" }}>
      <header style={{ flexShrink: 0 }}>
        <div style={{ color: "#FFFCF1", fontFamily: DM, fontSize: 32, letterSpacing: "-0.03em", lineHeight: 1 }}>Front Desk</div>
      </header>

      <div style={{ flex: 1, minHeight: 0, display: "grid", gridTemplateRows: "1.35fr 0.85fr auto", gap: 14 }}>
        <div
          style={{
            background: "#F8F4EB",
            color: INK,
            borderRadius: R,
            padding: "22px 20px 18px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minHeight: 0,
          }}
        >
          <div>
            <div style={{ fontFamily: DM, fontSize: 72, letterSpacing: "-0.045em", lineHeight: 0.86 }}>9:40</div>
            <div style={{ marginTop: 14, fontFamily: DM, fontSize: 22, letterSpacing: "-0.03em", lineHeight: 1.1 }}>Maya Chen</div>
            <div style={{ marginTop: 4, fontFamily: INTER, fontSize: 15, color: "rgb(40 25 16 / 58%)" }}>with Dr. Shah</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 12px 1fr", minHeight: 0 }}>
          <SideFact icon={<PhoneIcon />} title="(416) 555-0190" />
          <span />
          <SideFact icon={<FileIcon />} title="Athena" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, paddingTop: 16 }}>
          {MORNING.map((slot) => (
            <div key={slot.time} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, minWidth: 0 }}>
              <div style={{ fontFamily: DM, fontSize: slot.on ? 15 : 13, letterSpacing: "-0.03em", color: slot.on ? "#F8F4EB" : "rgb(255 252 241 / 42%)" }}>{slot.time}</div>
              <div style={{ width: "100%", height: 3, borderRadius: 2, background: slot.on ? "#F0CDB8" : "rgb(255 252 241 / 16%)" }} />
              <div style={{ height: 16, fontFamily: INTER, fontSize: 11, color: slot.on ? "#F0CDB8" : "rgb(255 252 241 / 38%)" }}>{slot.who}</div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

function SideFact({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div
      style={{
        minWidth: 0,
        borderRadius: R,
        background: "#FFFCF10F",
        boxShadow: "#00000026 0px 1px 2px inset",
        padding: "14px 12px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 10,
      }}
    >
      <div style={{ width: 32, height: 32, borderRadius: 8, background: "#F0CDB8", display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
      <div style={{ color: "#FFFCF1", fontFamily: DM, fontSize: 16, letterSpacing: "-0.03em", lineHeight: 1.15 }}>{title}</div>
    </div>
  );
}

function PhoneIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden>
      <path d="M7 3h4l1.2 3.2-2 1.2a12 12 0 0 0 6.4 6.4l1.2-2L21 13v4a2 2 0 0 1-2.2 2A17 17 0 0 1 5 8.2 2 2 0 0 1 7 3z" fill="none" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden>
      <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" fill="none" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M14 3v5h5M9 13h6M9 17h4" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
