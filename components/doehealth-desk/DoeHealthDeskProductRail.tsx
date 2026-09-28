import type { ReactNode } from "react";

import { DOEHEALTH_DESK_RADIUS_PX, DOEHEALTH_DESK_SURFACE } from "@/lib/doehealth/doehealth-desk-colors";
import { lora } from "@/lib/home/fonts";

const R = DOEHEALTH_DESK_RADIUS_PX;
const SHELL_HEX = DOEHEALTH_DESK_SURFACE.replace("#", "");

/** Left rail from the hero product. Same marks, order, and sizes. */
export function DoeHealthDeskProductRail() {
  return (
    <aside
      className="desk-product__rail"
      style={{
        boxSizing: "border-box",
        width: 72,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 28,
        paddingBottom: 24,
        paddingInline: 12,
        position: "relative",
        flexShrink: 0,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 32, alignItems: "center" }}>
        <RailIcon>
          <path d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10.5z" fill="none" stroke="rgb(255 252 241 / 60%)" strokeWidth="1.8" strokeLinejoin="round" />
        </RailIcon>
        <RailIcon>
          <circle cx="9" cy="8" r="3" fill="none" stroke="rgb(255 252 241 / 60%)" strokeWidth="1.8" />
          <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" fill="none" stroke="rgb(255 252 241 / 60%)" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="17" cy="9" r="2.5" fill="none" stroke="rgb(255 252 241 / 60%)" strokeWidth="1.8" />
          <path d="M14.5 20c.3-2.2 1.8-4 4-4" fill="none" stroke="rgb(255 252 241 / 60%)" strokeWidth="1.8" strokeLinecap="round" />
        </RailIcon>
        <RailIcon>
          <rect x="4" y="5" width="16" height="15" rx="2" fill="none" stroke="rgb(255 252 241 / 60%)" strokeWidth="1.8" />
          <path d="M8 3v4M16 3v4M4 10h16" fill="none" stroke="rgb(255 252 241 / 60%)" strokeWidth="1.8" strokeLinecap="round" />
        </RailIcon>
        <RailIcon>
          <path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H8l-4 4V6a1 1 0 0 1 1-1z" fill="none" stroke="rgb(255 252 241)" strokeWidth="1.8" strokeLinejoin="round" />
        </RailIcon>
      </div>
      <div style={{ position: "absolute", top: 28, left: "50%", translate: "-50%", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#FFFCF1", fontFamily: lora.style.fontFamily, fontSize: 22, fontWeight: 600, lineHeight: "28px" }}>D</div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 24,
          left: "50%",
          translate: "-50%",
          display: "flex",
          flexDirection: "column",
          gap: 18,
          alignItems: "center",
          paddingTop: 14,
          borderTop: "1px solid #FFFCF11F",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
          <circle cx="5" cy="5" r="1.35" fill="#FFFCF1" />
          <circle cx="11" cy="5" r="1.35" fill="#FFFCF1" />
          <circle cx="5" cy="11" r="1.35" fill="#FFFCF1" />
          <circle cx="11" cy="11" r="1.35" fill="#FFFCF1" />
        </svg>
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
          <circle cx="8" cy="8" r="2.1" fill="none" stroke="#FFFCF1" strokeWidth="1.35" />
          <path d="M8 1.8V3.4M8 12.6V14.2M1.8 8H3.4M12.6 8H14.2M3.3 3.3L4.4 4.4M11.6 11.6L12.7 12.7M12.7 3.3L11.6 4.4M4.4 11.6L3.3 12.7" fill="none" stroke="#FFFCF1" strokeWidth="1.35" strokeLinecap="round" />
        </svg>
      </div>
    </aside>
  );
}

function RailIcon({ children }: { children: ReactNode }) {
  return (
    <div style={{ width: 40, height: 40, borderRadius: R, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden style={{ filter: `drop-shadow(#${SHELL_HEX}4D 0px 1px 1px) drop-shadow(#FFFCF12E 0px -1px 0px)` }}>
        {children}
      </svg>
    </div>
  );
}
