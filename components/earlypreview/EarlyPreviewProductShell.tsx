"use client";

import type { ReactNode } from "react";

import { HalftoneDisc } from "@/components/doehealth-product/DoeHealthProductHalftone";
import { C } from "@/remotion/video1/theme";

/** The product's own pages, by the id each nav button selects. */
export type ProductRailKey =
  | "integrations"
  | "services"
  | "providers"
  | "permissions"
  | "search"
  | "forms"
  | "schedule"
  | "calendar"
  | "voice"
  | "referrals"
  | "payments";

const SHELL = { w: 1440, h: 900 };
const RAIL_W = 64;
const PAPER = { x: 64, y: 12, w: SHELL.w - 76, h: SHELL.h - 24 };

const ICON = { color: "currentColor", sw: 1.7 };

function Item({ active, label, children }: { active: boolean; label: string; children: ReactNode }) {
  return (
    <div
      aria-label={label}
      aria-current={active ? "page" : undefined}
      style={{
        width: 40,
        height: 40,
        borderRadius: 10,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: active ? "#FFFCF11A" : "transparent",
        color: active ? "#FFFCF1" : "#FFFCF1B3",
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" style={{ display: "block" }}>
        {children}
      </svg>
    </div>
  );
}

/** The product's icon rail, drawn the way the artboard draws it, with the Index pages open beneath Index. */
export function ProductRail({ active }: { active: ProductRailKey }) {
  const stroke = { fill: "none", stroke: ICON.color, strokeWidth: ICON.sw, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: RAIL_W,
        height: "100%",
        boxSizing: "border-box",
        padding: "26px 12px 24px",
        display: "flex",
        flexDirection: "column",
        background: C.ink,
        overflow: "hidden",
      }}
    >
      <div style={{ width: 40, textAlign: "center", fontFamily: "Lora, system-ui, serif", fontWeight: 600, fontSize: 28, lineHeight: "28px", color: C.paper }}>D</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 110 }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Item label="Index" active={active === "integrations"}>
            <circle cx="12" cy="12" r="8.5" {...stroke} />
            <ellipse cx="12" cy="12" rx="3.6" ry="8.5" {...stroke} />
            <path d="M3.5 12h17" {...stroke} />
          </Item>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8, borderRadius: 12, background: "#FFFCF10A" }}>
            <Item label="Services" active={active === "services"}>
              <path d="M9 7h10M9 12h10M9 17h10" {...stroke} />
              <circle cx="5" cy="7" r="1.2" fill="currentColor" />
              <circle cx="5" cy="12" r="1.2" fill="currentColor" />
              <circle cx="5" cy="17" r="1.2" fill="currentColor" />
            </Item>
            <Item label="Providers" active={active === "providers"}>
              <circle cx="9" cy="8.5" r="3.2" {...stroke} />
              <path d="M3.5 19.5c.8-3.2 3-5 5.5-5s4.7 1.8 5.5 5" {...stroke} />
              <path d="M15.5 5.6a3.2 3.2 0 0 1 0 5.8M17.6 14.8c1.4.7 2.4 2.3 2.9 4.7" {...stroke} />
            </Item>
            <Item label="Agent Permissions" active={active === "permissions"}>
              <path d="M12 3.8l6.8 2.6v5.1c0 4.2-2.8 7.4-6.8 8.8-4-1.4-6.8-4.6-6.8-8.8V6.4z" {...stroke} />
              <path d="M9.2 12.2l2 2 3.8-4" {...stroke} />
            </Item>
            <Item label="Integrations" active={active === "search"}>
              <path d="M9 3.5v4M15 3.5v4M6.5 7.5h11v3.5a5.5 5.5 0 0 1-11 0z" {...stroke} />
              <path d="M12 16.5v4" {...stroke} />
            </Item>
            <Item label="Forms" active={active === "forms"}>
              <rect x="5" y="3.5" width="14" height="17" rx="3" {...stroke} />
              <path d="M8.5 8.5h7M8.5 12h7M8.5 15.5h4" {...stroke} />
            </Item>
          </div>
        </div>
        <Item label="Schedule" active={active === "schedule"}>
          <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="2.5" {...stroke} />
          <rect x="13" y="3.5" width="7.5" height="7.5" rx="2.5" {...stroke} />
          <rect x="3.5" y="13" width="17" height="7.5" rx="2.5" {...stroke} />
        </Item>
        <Item label="Calendar" active={active === "calendar"}>
          <rect x="3.5" y="4.5" width="17" height="16" rx="4.5" {...stroke} />
          <circle cx="8.5" cy="11" r="1.1" fill="currentColor" />
          <circle cx="12" cy="11" r="1.1" fill="currentColor" />
          <circle cx="15.5" cy="11" r="1.1" fill="currentColor" />
          <circle cx="8.5" cy="15.2" r="1.1" fill="currentColor" />
          <circle cx="12" cy="15.2" r="1.1" fill="currentColor" />
        </Item>
        <Item label="Voice" active={active === "voice"}>
          <path d="M5 4.5h3.2l1.6 4-2 1.3a10.5 10.5 0 0 0 6.4 6.4l1.3-2 4 1.6V19a1.5 1.5 0 0 1-1.6 1.5C10.6 20 4 13.4 3.5 6.1A1.5 1.5 0 0 1 5 4.5z" {...stroke} />
        </Item>
        <Item label="Referrals" active={active === "referrals"}>
          <circle cx="6.5" cy="12" r="2.6" {...stroke} />
          <circle cx="17.5" cy="6.5" r="2.6" {...stroke} />
          <circle cx="17.5" cy="17.5" r="2.6" {...stroke} />
          <path d="M9 10.8l6-3.2M9 13.2l6 3.2" {...stroke} />
        </Item>
        <Item label="Payments" active={active === "payments"}>
          <rect x="3.5" y="6" width="17" height="12.5" rx="3.5" {...stroke} />
          <path d="M3.5 10.5h17M7.5 14.8h3" {...stroke} />
        </Item>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: "auto" }}>
        <Item label="Expand" active={false}>
          <rect x="3.5" y="4.5" width="17" height="15" rx="3.5" {...stroke} />
          <path d="M9.5 4.5v15" {...stroke} />
          <path d="M13.5 9.5l2.5 2.5-2.5 2.5" {...stroke} />
        </Item>
        <div style={{ height: 48, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <HalftoneDisc size={32} step={4.4} maxDot={1.7} color="#E8A585" />
        </div>
      </div>
    </div>
  );
}

/** The product's outer shell: the ink rail with its icons, and the paper panel beside it. Same frame as the artboard. */
export function ProductShell({ active, children }: { active: ProductRailKey; children: ReactNode }) {
  return (
    <div style={{ position: "relative", width: SHELL.w, height: SHELL.h, borderRadius: 28, overflow: "hidden", background: C.ink }}>
      <ProductRail active={active} />
      <div
        style={{
          position: "absolute",
          left: PAPER.x,
          top: PAPER.y,
          width: PAPER.w,
          height: PAPER.h,
          borderRadius: 24,
          overflow: "hidden",
          background: C.paper,
          backgroundImage: "radial-gradient(rgba(40, 25, 16, 0.09) 1px, transparent 1.3px)",
          backgroundSize: "18px 18px",
        }}
      >
        {children}
      </div>
    </div>
  );
}
