import type { CSSProperties, ReactNode } from "react";

import {
  DOEHEALTH_DESK_PRODUCT_CARD,
  DOEHEALTH_DESK_PRODUCT_INK,
  DOEHEALTH_DESK_RADIUS_PX,
  DOEHEALTH_DESK_SURFACE,
  DOEHEALTH_DESK_SURFACE_RGB,
} from "@/lib/doehealth/doehealth-desk-colors";

const SHELL = DOEHEALTH_DESK_SURFACE;
const INK = DOEHEALTH_DESK_PRODUCT_INK;
const CARD = DOEHEALTH_DESK_PRODUCT_CARD;
const SHELL_RGB = DOEHEALTH_DESK_SURFACE_RGB;
const SHELL_HEX = SHELL.replace("#", "");
import { dmSans, inter, larkenLight, lora } from "@/lib/home/fonts";

const R = DOEHEALTH_DESK_RADIUS_PX;

const DM = dmSans.style.fontFamily;
const INTER = inter.style.fontFamily;
const LARKEN = larkenLight.style.fontFamily;
const LORA = lora.style.fontFamily;

const GLASS =
  "linear-gradient(in oklab 180deg, oklab(100% 0 0 / 72%) 0%, oklab(100% 0 0 / 12%) 42%, oklab(100% 0 0 / 0%) 100%), linear-gradient(in oklab 180deg, oklab(99% -0.001 0.015) 0%, oklab(92.6% 0.001 0.023) 100%)";
const GLASS_SHADOW = `#FFFFFFFA 0px 1px 0px inset, #${SHELL_HEX}12 0px -1px 0px inset, #FFFCF180 0px 0px 0px 1px inset, #${SHELL_HEX}0D 0px -8px 16px inset, #0F172A0A 0px 1px 2px, #FFFCF112 0px 4px 12px, #0F172A0D 0px 8px 18px`;
const CARD_BG =
  "linear-gradient(in oklab 180deg, oklab(95.1% 0.002 0.017) 0%, oklab(96.8% .0007 0.013) 68%)";

const smooth: CSSProperties = {
  boxSizing: "border-box",
  fontSynthesis: "none",
  MozOsxFontSmoothing: "grayscale",
  WebkitFontSmoothing: "antialiased",
  overflowWrap: "anywhere",
};

function Dots() {
  return (
    <div style={{ display: "flex", gap: 3, height: 20, paddingTop: 2, flexShrink: 0 }}>
      <i style={{ width: 4, height: 4, borderRadius: 999, background: `#${SHELL_HEX}1F` }} />
      <i style={{ width: 4, height: 4, borderRadius: 999, background: `#${SHELL_HEX}1F` }} />
      <i style={{ width: 4, height: 4, borderRadius: 999, background: `#${SHELL_HEX}1F` }} />
    </div>
  );
}

function Glass({
  children,
  width,
  height,
  radius = R,
}: {
  children: ReactNode;
  width: number;
  height: number;
  radius?: number;
}) {
  return (
    <div
      style={{
        ...smooth,
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        flexShrink: 0,
        width,
        height,
        borderRadius: radius,
        border: "1px solid #FFFCF1EB",
        backgroundImage: GLASS,
        backgroundOrigin: "border-box",
        boxShadow: GLASS_SHADOW,
        isolation: "isolate",
        overflow: "clip",
      }}
    >
      {children}
    </div>
  );
}

function FlowCard({
  icon,
  title,
  body,
  tag,
  bodyWidth,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  tag: string;
  bodyWidth?: number;
}) {
  return (
    <div style={{ ...smooth, display: "flex", flexDirection: "column", flexShrink: 0, gap: 12, width: 340 }}>
      <div
        style={{
          ...smooth,
          backgroundColor: "#F8F4EB",
          backgroundImage: CARD_BG,
          borderRadius: R,
          display: "flex",
          flexDirection: "column",
          gap: 13,
          height: 188,
          isolation: "isolate",
          overflow: "clip",
          padding: 22,
          width: 328,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%" }}>
          <div
            style={{
              width: 47,
              height: 47,
              borderRadius: R,
              background: "#FFFCF1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
          <div style={{ flexGrow: 1, minWidth: 0, color: INK, fontFamily: DM, fontSize: 25, letterSpacing: "-0.03em", lineHeight: "30px" }}>
            {title}
          </div>
          <Dots />
        </div>
        <div style={{ height: 1, width: "100%", background: `#${SHELL_HEX}1F` }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 8, width: bodyWidth ?? "100%", minHeight: 0 }}>
          <div style={{ color: `#${SHELL_HEX}B8`, fontFamily: INTER, fontSize: 17, letterSpacing: "-0.01em", lineHeight: "22px" }}>{body}</div>
          <div
            style={{
              alignSelf: "flex-start",
              height: 22,
              paddingInline: 10,
              borderRadius: R,
              background: "#FED9C4",
              color: INK,
              fontFamily: INTER,
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: "0.08em",
              lineHeight: "16px",
              display: "flex",
              alignItems: "center",
            }}
          >
            {tag}
          </div>
        </div>
      </div>
    </div>
  );
}

const APPS: { name: string; icon: ReactNode }[] = [
  {
    name: "Athena Health",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24">
        <rect x="8" y="2" width="8" height="4" rx="1" fill="none" stroke={INK} strokeWidth="1.8" />
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" fill="none" stroke={INK} strokeWidth="1.8" />
        <path d="M9 12h6M9 16h4" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "NexHealth",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24">
        <rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke={INK} strokeWidth="1.8" />
        <path d="M8 3v4M16 3v4M3 10h18" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "eClinicalWorks",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24">
        <path d="M3 12h4l2.5-6 3 12 2.5-6H21" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "PS Suite",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24">
        <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" fill="none" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "Practice Fusion",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24">
        <circle cx="9" cy="8" r="3" fill="none" stroke={INK} strokeWidth="1.8" />
        <path d="M3.5 19a5.5 5.5 0 0 1 11 0" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="17" cy="9" r="2.2" fill="none" stroke={INK} strokeWidth="1.8" />
        <path d="M21.5 19a4.5 4.5 0 0 0-6-4.2" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Accuro",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24">
        <path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3z" fill="none" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "DrChrono",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" fill="none" stroke={INK} strokeWidth="1.8" />
        <path d="M12 8v8M8 12h8" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Jane",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="3.2" fill="none" stroke={INK} strokeWidth="1.8" />
        <path d="M5 19a7 7 0 0 1 14 0" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Tebra",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1.2" fill="none" stroke={INK} strokeWidth="1.8" />
        <rect x="14" y="3" width="7" height="7" rx="1.2" fill="none" stroke={INK} strokeWidth="1.8" />
        <rect x="3" y="14" width="7" height="7" rx="1.2" fill="none" stroke={INK} strokeWidth="1.8" />
        <rect x="14" y="14" width="7" height="7" rx="1.2" fill="none" stroke={INK} strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    name: "Med Access",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24">
        <circle cx="8" cy="15" r="4" fill="none" stroke={INK} strokeWidth="1.8" />
        <path d="M11.5 12.5 20 4h3v3l-3 3h-3" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "Elation Health",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24">
        <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.6-7 10-7 10z" fill="none" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "AdvancedMD",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24">
        <path d="m12 3 9 5-9 5-9-5 9-5z" fill="none" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
        <path d="m3 13 9 5 9-5" fill="none" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
  },
];

/** Paper Workflows artboard, at its native 1920×1080 size. */
export function DoeHealthDeskPaperFrame() {
  return (
    <div style={{ ...smooth, display: "flex", width: 1920, height: 1080, overflow: "visible", background: SHELL, borderRadius: R, position: "relative" }}>
      <aside
        style={{
          ...smooth,
          width: 72,
          height: "100%",
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
          <div style={{ color: "#FFFCF1", fontFamily: LORA, fontSize: 22, fontWeight: 600, lineHeight: "28px" }}>D</div>
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
          <svg width="16" height="16" viewBox="0 0 16 16">
            <circle cx="5" cy="5" r="1.35" fill="#FFFCF1" />
            <circle cx="11" cy="5" r="1.35" fill="#FFFCF1" />
            <circle cx="5" cy="11" r="1.35" fill="#FFFCF1" />
            <circle cx="11" cy="11" r="1.35" fill="#FFFCF1" />
          </svg>
          <svg width="16" height="16" viewBox="0 0 16 16">
            <circle cx="8" cy="8" r="2.1" fill="none" stroke="#FFFCF1" strokeWidth="1.35" />
            <path d="M8 1.8V3.4M8 12.6V14.2M1.8 8H3.4M12.6 8H14.2M3.3 3.3L4.4 4.4M11.6 11.6L12.7 12.7M12.7 3.3L11.6 4.4M4.4 11.6L3.3 12.7" fill="none" stroke="#FFFCF1" strokeWidth="1.35" strokeLinecap="round" />
          </svg>
        </div>
      </aside>

      <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, height: 1080, padding: "14px 14px 14px 4px", minWidth: 0 }}>
        <div
          style={{
            position: "relative",
            display: "flex",
            flexGrow: 1,
            height: "100%",
            padding: 16,
            borderRadius: R,
            overflow: "visible",
            gap: 16,
            boxShadow: "#0000002E 0px 12px 40px",
            backgroundColor: "#FFFCF1",
            backgroundImage: "url(/doehealth/workflows-dots.svg)",
            backgroundSize: "16px 16px",
          }}
        >
          <Integrations />
          <Canvas />
        </div>
      </div>
    </div>
  );
}

function RailIcon({ children }: { children: ReactNode }) {
  return (
    <div style={{ width: 40, height: 40, borderRadius: R, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="20" height="20" viewBox="0 0 24 24" style={{ filter: `drop-shadow(#${SHELL_HEX}4D 0px 1px 1px) drop-shadow(#FFFCF12E 0px -1px 0px)` }}>
        {children}
      </svg>
    </div>
  );
}

function Integrations() {
  return (
    <div
      style={{
        ...smooth,
        background: SHELL,
        border: "1px solid #FFFCF11F",
        borderRadius: R,
        boxShadow: "#FFFCF10F 0px 1px 0px inset, #00000029 0px 4px 14px, #00000014 0px 1px 6px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        width: 520,
        height: 1020,
        flexShrink: 0,
        padding: "32px 28px 24px",
      }}
    >
      <div style={{ height: 40, display: "flex", alignItems: "center", color: "#FFFCF1", fontFamily: LARKEN, fontSize: 32, fontWeight: 400, letterSpacing: "-0.02em", lineHeight: "40px" }}>
        Integrations
      </div>
      <div style={{ height: 53, borderRadius: R, background: "#FFFCF112", display: "flex", alignItems: "center", gap: 10, padding: "6px 6px 6px 16px" }}>
        <svg width="16" height="16" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="6.5" fill="none" stroke="rgb(255 252 241 / 45%)" strokeWidth="2" />
          <path d="M16.5 16.5 21 21" fill="none" stroke="rgb(255 252 241 / 45%)" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <div style={{ flexGrow: 1, color: "#FFFCF166", fontFamily: INTER, fontSize: 15, lineHeight: "20px" }}>Search by application</div>
        <Glass width={44} height={44} radius={R}>
          <svg width="14" height="14" viewBox="0 0 24 24">
            <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Glass>
      </div>
      <div style={{ height: 52, borderRadius: R, background: "#FFFCF112", display: "flex", alignItems: "center", padding: 4, position: "relative", overflow: "clip" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, height: "100%", paddingLeft: 20 }}>
          <span style={{ width: 100, textAlign: "center", color: "#FFFCF18C", fontFamily: INTER, fontSize: 13, fontWeight: 500 }}>Personal</span>
          <div style={{ width: 112, height: 41, borderRadius: R, border: "1px solid #FFFCF1EB", backgroundImage: GLASS, display: "flex", alignItems: "center", justifyContent: "center", color: INK, fontFamily: INTER, fontSize: 13, fontWeight: 600 }}>
            EMR
          </div>
          <span style={{ width: 100, textAlign: "center", color: "#FFFCF18C", fontFamily: INTER, fontSize: 13, fontWeight: 500 }}>Scheduling</span>
          <span style={{ width: 72, textAlign: "center", color: "#FFFCF14D", fontFamily: INTER, fontSize: 13, fontWeight: 500 }}>Billing</span>
          <span style={{ width: 72, textAlign: "center", color: "#FFFCF12E", fontFamily: INTER, fontSize: 13, fontWeight: 500, opacity: 0.5 }}>Messaging</span>
        </div>
        <div style={{ position: "absolute", right: 1, top: 0, width: 64, height: "100%", borderRadius: `0 ${R}px ${R}px 0`, backgroundImage: `linear-gradient(270deg, rgb(${SHELL_RGB} / 90%) 0%, rgb(${SHELL_RGB} / 0%) 100%)` }} />
      </div>
      <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 10, flexGrow: 1, minHeight: 0, overflow: "clip", paddingTop: 4 }}>
        {APPS.map((app) => (
          <div
            key={app.name}
            style={{
              height: 64,
              minHeight: 64,
              borderRadius: R,
              background: "#FFFCF10F",
              boxShadow: "#00000026 0px 1px 2px inset",
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "4px 14px 4px 4px",
              flexShrink: 0,
            }}
          >
            <Glass width={56} height={56}>{app.icon}</Glass>
            <div style={{ flexGrow: 1, color: "#FFFCF1", fontFamily: DM, fontSize: 19, letterSpacing: "-0.035em", lineHeight: "26px" }}>{app.name}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#FFFCF1B3", fontFamily: INTER, fontSize: 13, fontWeight: 500 }}>
              <svg width="10" height="10" viewBox="0 0 10 10">
                <path d="M5 1V9M1 5H9" fill="none" stroke="#FFFCF1B3" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              Add
            </div>
          </div>
        ))}
        <div style={{ position: "absolute", left: 0, bottom: 0, width: "100%", height: 120, backgroundImage: `linear-gradient(180deg, rgb(${SHELL_RGB} / 0%) 0%, rgb(${SHELL_RGB} / 75%) 55%, rgb(${SHELL_RGB} / 98%) 100%)` }} />
        <div style={{ position: "absolute", bottom: 12, left: "50%", translate: "-50%" }}>
          <svg width="14" height="14" viewBox="0 0 24 24">
            <path d="M6 9l6 6 6-6" fill="none" stroke="rgb(255 252 241 / 55%)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Canvas() {
  return (
    <div style={{ position: "relative", flexGrow: 1, height: 1020, minWidth: 0, borderRadius: R, overflow: "visible", zIndex: 1 }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 69,
          borderRadius: R,
          overflow: "clip",
        }}
      >
        <FlowCard
          title="Front Desk"
          body="Answer incoming clinic call, schedule or route the patient"
          tag="Voice Agent"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M7 3h4l1.2 3.2-2 1.2a12 12 0 0 0 6.4 6.4l1.2-2L21 13v4a2 2 0 0 1-2.2 2A17 17 0 0 1 5 8.2 2 2 0 0 1 7 3z" fill="none" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
            </svg>
          }
        />
        <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
          <FlowCard
            title="Athena Health"
            body="Draft pre-charting note in patient's file, use my template"
            tag="EMR"
            bodyWidth={254}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24">
                <rect x="8" y="2" width="8" height="4" rx="1" fill="none" stroke={INK} strokeWidth="1.8" />
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" fill="none" stroke={INK} strokeWidth="1.8" />
                <path d="M9 12h6M9 16h4" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            }
          />
          <FlowCard
            title="Referral"
            body="Send specialist referral, attach latest chart notes"
            tag="Fax"
            bodyWidth={231}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M14 4h6v6M20 4 10 14" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
                <path d="M20 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            }
          />
        </div>
        <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
          <FlowCard
            title="NexHealth"
            body="Schedule appointment in patient's calendar, next open slot"
            tag="Schedule"
            bodyWidth={273}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24">
                <rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke={INK} strokeWidth="1.8" />
                <path d="M8 3v4M16 3v4M3 10h18" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            }
          />
          <FlowCard
            title="Prior Authorization"
            body="Call insurance to confirm prior authorization"
            tag="Voice Agent"
            bodyWidth={241}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M4 13v3a2 2 0 0 0 2 2h1v-7H6a8 8 0 0 1 16 0h-1v7h1a2 2 0 0 0 2-2v-3" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
                <path d="M4 15h3v5H6a2 2 0 0 1-2-2v-3zM17 15h3v3a2 2 0 0 1-2 2h-1v-5z" fill="none" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
              </svg>
            }
          />
          <FlowCard
            title="Visit Reminder"
            body="Text patient to confirm, 24 hours before visit"
            tag="SMS"
            bodyWidth={273}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M5 4h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-4 4V6a2 2 0 0 1 2-2z" fill="none" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
              </svg>
            }
          />
        </div>
        <FlowCard
          title="Pre-visit"
          body="Ask patient 3 days before appointment"
          tag="Forms"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M9 6h12M9 12h12M9 18h12" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
              <path d="M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          }
        />

        <svg width="752" height="599" viewBox="-8 -8 752 599" style={{ position: "absolute", left: 249, top: 211, overflow: "visible", pointerEvents: "none" }}>
          <path d="M368 0 V34 M184 34 H552 M184 34 V68.5 M552 34 V68.5 M184 256.5 V269 M552 256.5 V269 M184 269 H552 M368 269 V313 M0 313 H736 M0 313 V325.5 M368 313 V325.5 M736 313 V325.5 M0 513.5 V548 M368 513.5 V548 M736 513.5 V548 M0 548 H736 M368 548 V582.5" fill="none" stroke="#C5C0B6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        <div style={{ position: "absolute", top: 20, right: 20, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 40, height: 40, borderRadius: R, background: "#FCCFB8", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="12" height="14" viewBox="0 0 12 14">
              <path d="M1.2 1.1v11.8L11.2 7 1.2 1.1Z" fill={INK} />
            </svg>
          </div>
          <div style={{ height: 40, borderRadius: R, background: "#FCCFB8", display: "flex", alignItems: "center", overflow: "clip" }}>
            <div style={{ padding: "0 14px 0 16px", color: INK, fontFamily: DM, fontSize: 15, fontWeight: 500, letterSpacing: "-0.02em" }}>Publish</div>
            <div style={{ width: 1, height: 16, background: `#${SHELL_HEX}33` }} />
            <div style={{ width: 34, height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="12" height="12" viewBox="0 0 12 12">
                <path d="M2.2 4.2 6 8l3.8-3.8" fill="none" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        <WorkflowsBar />
      </div>
    </div>
  );
}

function WorkflowsBar() {
  return (
    <div
      style={{
        ...smooth,
        position: "absolute",
        left: 0,
        bottom: -25,
        width: "100%",
        minHeight: 330,
        maxHeight: 330,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        paddingTop: 14,
        paddingBottom: 10,
        borderRadius: R,
        background: SHELL,
        border: "1px solid #FFFCF11F",
        overflow: "hidden",
        boxShadow: "#FFFCF10F 0px 1px 0px inset, #FFFFFF38 0px 0px 16px, #FFFCF12E 0px 0px 36px, #EDE6D633 0px 0px 56px",
      }}
    >
      <div style={{ paddingLeft: 28, color: "#FFFCF1", fontFamily: LARKEN, fontSize: 28, fontWeight: 400, letterSpacing: "-0.02em", lineHeight: "40px" }}>Workflows</div>
      <div style={{ position: "relative", height: 254 }}>
        <div style={{ display: "flex", gap: 10, paddingLeft: 18, paddingRight: 18, alignItems: "flex-start" }}>
          <WorkflowCard name="Front Desk">
            <PathPreview
              steps={[
                { icon: <PhoneIcon />, label: "Line", detail: "(416) 555-0190" },
                { icon: <CalendarIcon />, label: "Thu 9:40", detail: "Maya Chen" },
                { icon: <FileIcon />, label: "Athena", detail: "In the chart" },
              ]}
            />
          </WorkflowCard>
          <WorkflowCard name="Referral">
            <PathPreview
              steps={[
                { icon: <FileIcon />, label: "Chart", detail: "Latest note" },
                { icon: <SendIcon />, label: "Fax", detail: "Wednesday" },
                { icon: <CrossIcon />, label: "Cardiology", detail: "Specialist" },
              ]}
            />
          </WorkflowCard>
          <WorkflowCard name="Prior Auth">
            <PathPreview
              steps={[
                { icon: <ScanIcon />, label: "MRI", detail: "Lumbar" },
                { icon: <ShieldIcon />, label: "Aetna", detail: "The payer" },
                { icon: <CheckIcon />, label: "On file", detail: "Written back" },
              ]}
            />
          </WorkflowCard>
          <WorkflowCard name="Pre-visit">
            <PathPreview
              steps={[
                { icon: <CalendarIcon />, label: "3 days", detail: "Before" },
                { icon: <ListIcon />, label: "Forms", detail: "Card and list" },
                { icon: <PersonIcon />, label: "Maya", detail: "Thursday" },
              ]}
            />
          </WorkflowCard>
          <WorkflowCard name="Schedule">
            <PathPreview
              steps={[
                { icon: <CalendarIcon />, label: "Next slot", detail: "Thursday" },
                { icon: <PersonIcon />, label: "Maya Chen", detail: "9:40" },
                { icon: <CheckIcon />, label: "Booked", detail: "On the book" },
              ]}
            />
          </WorkflowCard>
          <WorkflowCard name="Reminder">
            <PathPreview
              steps={[
                { icon: <CalendarIcon />, label: "24 hours", detail: "Before" },
                { icon: <MessageIcon />, label: "Text", detail: "Confirm" },
                { icon: <CheckIcon />, label: "Sent", detail: "Maya Chen" },
              ]}
            />
          </WorkflowCard>
          <WorkflowCard name="Billing">
            <PathPreview
              steps={[
                { icon: <CardIcon />, label: "Copay", detail: "$25.00" },
                { icon: <ShieldIcon />, label: "Aetna", detail: "The claim" },
                { icon: <CheckIcon />, label: "Paid", detail: "Posted" },
              ]}
            />
          </WorkflowCard>
        </div>
      </div>
    </div>
  );
}

const NET_LINE = "rgb(255 252 241 / 78%)";

type NetStep = { icon: ReactNode; label: string; detail: string };

function WorkflowCard({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div style={{ width: 200, height: 211, flexShrink: 0 }}>
      <div style={{ position: "relative", height: "100%", borderRadius: R, background: CARD, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 10, right: 10, top: 10, bottom: 34 }}>{children}</div>
        <div style={{ position: "absolute", left: 12, bottom: 9, color: "#FFFCF1", fontFamily: DM, fontSize: 14, fontWeight: 500, letterSpacing: "-0.01em", lineHeight: "18px" }}>{name}</div>
      </div>
    </div>
  );
}

function PathPreview({ steps }: { steps: NetStep[] }) {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {steps.map((step, index) => (
        <div key={step.label} style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
          <div
            style={{
              flex: 1,
              minHeight: 0,
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "0 8px",
              borderRadius: 8,
              background: "#F8F4EB",
              color: INK,
            }}
          >
            <IconTile>{step.icon}</IconTile>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: DM, fontSize: 13, letterSpacing: "-0.02em", lineHeight: 1.1 }}>{step.label}</div>
              <div style={{ marginTop: 2, fontFamily: INTER, fontSize: 11, lineHeight: 1.2, color: "rgb(40 25 16 / 55%)", whiteSpace: "nowrap" }}>{step.detail}</div>
            </div>
          </div>
          {index < steps.length - 1 ? <div style={{ width: 3, height: 8, marginLeft: 19, flexShrink: 0, background: NET_LINE }} /> : null}
        </div>
      ))}
    </div>
  );
}

function IconTile({ children }: { children: ReactNode }) {
  return (
    <div style={{ width: 24, height: 24, borderRadius: 6, background: "#F0CDB8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      {children}
    </div>
  );
}

function Glyph({ children }: { children: ReactNode }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
      {children}
    </svg>
  );
}

function PhoneIcon() {
  return (
    <Glyph>
      <path d="M7 3h4l1.2 3.2-2 1.2a12 12 0 0 0 6.4 6.4l1.2-2L21 13v4a2 2 0 0 1-2.2 2A17 17 0 0 1 5 8.2 2 2 0 0 1 7 3z" fill="none" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
    </Glyph>
  );
}

function CalendarIcon() {
  return (
    <Glyph>
      <rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke={INK} strokeWidth="1.8" />
      <path d="M8 3v4M16 3v4M3 10h18" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
    </Glyph>
  );
}

function PersonIcon() {
  return (
    <Glyph>
      <circle cx="12" cy="8" r="3.2" fill="none" stroke={INK} strokeWidth="1.8" />
      <path d="M5 19a7 7 0 0 1 14 0" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
    </Glyph>
  );
}

function FileIcon() {
  return (
    <Glyph>
      <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" fill="none" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M14 3v5h5M9 13h6M9 17h4" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
    </Glyph>
  );
}

function SendIcon() {
  return (
    <Glyph>
      <path d="M14 4h6v6M20 4 10 14" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M20 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h6" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
    </Glyph>
  );
}

function CrossIcon() {
  return (
    <Glyph>
      <circle cx="12" cy="12" r="9" fill="none" stroke={INK} strokeWidth="1.8" />
      <path d="M12 8v8M8 12h8" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
    </Glyph>
  );
}

function ScanIcon() {
  return (
    <Glyph>
      <rect x="4" y="4" width="16" height="16" rx="2" fill="none" stroke={INK} strokeWidth="1.8" />
      <path d="M8 12h8M12 8v8" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
    </Glyph>
  );
}

function ShieldIcon() {
  return (
    <Glyph>
      <path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3z" fill="none" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
    </Glyph>
  );
}

function CheckIcon() {
  return (
    <Glyph>
      <circle cx="12" cy="12" r="9" fill="none" stroke={INK} strokeWidth="1.8" />
      <path d="m8 12 2.5 2.5L16 9" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Glyph>
  );
}

function MessageIcon() {
  return (
    <Glyph>
      <path d="M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-4 3V7a2 2 0 0 1 2-2z" fill="none" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
    </Glyph>
  );
}

function CardIcon() {
  return (
    <Glyph>
      <rect x="3" y="6" width="18" height="12" rx="2" fill="none" stroke={INK} strokeWidth="1.8" />
      <path d="M3 10h18" fill="none" stroke={INK} strokeWidth="1.8" />
    </Glyph>
  );
}

function ListIcon() {
  return (
    <Glyph>
      <path d="M9 7h11M9 12h11M9 17h11" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
      <path d="m4 7 1.2 1.2L7.5 6M4 12l1.2 1.2L7.5 11M4 17l1.2 1.2L7.5 16" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Glyph>
  );
}
