import {
  HERO_TRIAGE_MOBILE_LIST_WIDTH,
  HERO_TRIAGE_MOBILE_MIN_HEIGHT,
  HERO_TRIAGE_MOBILE_SCALE,
  HERO_TRIAGE_PANEL_ANCHOR,
  HERO_TRIAGE_PANEL_LEFT,
  HERO_TRIAGE_PANEL_RIGHT,
  HERO_TRIAGE_PANEL_WIDTH,
  HERO_TRIAGE_JOIN_AVATAR_GRADIENT,
  HERO_TRIAGE_JOIN_AVATAR_FLAT,
  HERO_TRIAGE_JOIN_NAV_CHIP_ACTIVE,
  HERO_TRIAGE_TILT,
} from "@/lib/home/hero-triage-preview-styles";
import { getHeroTriageThemeConfig, JOIN_MOBILE_HERO_TRIAGE_PANEL, type HeroTriageTheme, type HeroTriageThemeConfig } from "@/lib/home/hero-triage-theme";
import { DoeBuildIcon } from "@/components/admin/doe-build-icon";
import { JOIN_FORM_BEIGE } from "@/lib/join/join-form-beige";
import type { CSSProperties, ReactNode } from "react";

type InboxRow = {
  id: string;
  sender: string;
  initials: string;
  subject: string;
  preview: string;
  time: string;
  iconBg: string;
  iconColor: string;
  selected?: boolean;
};

const INBOX_ROWS: InboxRow[] = [
  {
    id: "pharmacy",
    sender: "Pharmacy",
    initials: "Rx",
    subject: "Refill request",
    preview: "Metformin 500mg for J. Martinez",
    time: "8:12",
    iconBg: "rgba(210,119,76,0.18)",
    iconColor: "rgba(255,236,205,0.88)",
  },
  {
    id: "labcorp",
    sender: "LabCorp",
    initials: "LC",
    subject: "Critical result",
    preview: "K+ 6.2 mEq/L, patient A. Chen",
    time: "7:48",
    iconBg: "rgba(191,89,61,0.18)",
    iconColor: "rgba(255,210,195,0.88)",
  },
  {
    id: "nurse",
    sender: "Nurse Patel",
    initials: "NP",
    subject: "Post-op update",
    preview: "Room 308 stable, discharge timeline requested",
    time: "Yesterday",
    iconBg: "rgba(231,169,68,0.17)",
    iconColor: "rgba(255,240,215,0.88)",
  },
  {
    id: "patient",
    sender: "M. Rodriguez",
    initials: "MR",
    subject: "Follow-up visit",
    preview: "Need to schedule a visit this week",
    time: "9:14",
    iconBg: "rgba(210,119,76,0.22)",
    iconColor: "rgba(255,248,235,0.90)",
    selected: true,
  },
  {
    id: "aetna",
    sender: "Aetna",
    initials: "AE",
    subject: "Pre-authorization",
    preview: "Approved for PT #8821",
    time: "Mon",
    iconBg: "rgba(196,122,90,0.17)",
    iconColor: "rgba(255,230,210,0.88)",
  },
  {
    id: "specialist",
    sender: "Dr. Okafor",
    initials: "DO",
    subject: "Referral accepted",
    preview: "Cardiology consult Tue 2 PM",
    time: "Mon",
    iconBg: "rgba(184,106,40,0.17)",
    iconColor: "rgba(255,225,195,0.88)",
  },
  {
    id: "quest",
    sender: "Quest Diagnostics",
    initials: "QD",
    subject: "Panel results",
    preview: "Lipid + HBA1C ready for T. Brooks",
    time: "Sun",
    iconBg: "rgba(212,157,79,0.17)",
    iconColor: "rgba(255,236,210,0.88)",
  },
  {
    id: "patient2",
    sender: "D. Kim",
    initials: "DK",
    subject: "Medication side effects",
    preview: "Dizziness since Monday morning",
    time: "Sun",
    iconBg: "rgba(168,106,64,0.17)",
    iconColor: "rgba(255,228,200,0.88)",
  },
  {
    id: "bcbs",
    sender: "BlueCross",
    initials: "BC",
    subject: "Claim processed",
    preview: "EOB attached for claim #44821",
    time: "Sat",
    iconBg: "rgba(139,111,71,0.17)",
    iconColor: "rgba(255,225,200,0.88)",
  },
  {
    id: "frontdesk",
    sender: "Front Desk",
    initials: "FD",
    subject: "Patient arrival",
    preview: "Room 4 ready for vitals",
    time: "Sat",
    iconBg: "rgba(180,130,70,0.16)",
    iconColor: "rgba(255,236,210,0.88)",
  },
  {
    id: "imaging",
    sender: "Metro Imaging",
    initials: "MI",
    subject: "MRI report",
    preview: "Lumbar spine for R. Walsh",
    time: "Fri",
    iconBg: "rgba(200,140,80,0.16)",
    iconColor: "rgba(255,240,220,0.88)",
  },
  {
    id: "priorauth",
    sender: "Humana",
    initials: "HU",
    subject: "Prior auth approved",
    preview: "12 PT sessions authorized",
    time: "Fri",
    iconBg: "rgba(210,119,76,0.16)",
    iconColor: "rgba(255,236,205,0.88)",
  },
];

const SELECTED = INBOX_ROWS.find((r) => r.selected)!;

type JoinDesktopNavItem = {
  id: string;
  d: string;
  active?: boolean;
};

const JOIN_DESKTOP_NAV_MAIN: readonly JoinDesktopNavItem[] = [
  { id: "inbox", d: "M4 6h16v12H4V6zm0 0 8 7 8-7", active: true },
  {
    id: "patients",
    d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  },
  { id: "calendar", d: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2z" },
  { id: "tasks", d: "M9 11l3 3 8.5-8.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" },
] as const;

const JOIN_DESKTOP_NAV_MID: readonly JoinDesktopNavItem[] = [
  { id: "compose", d: "M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" },
  { id: "files", d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6" },
  { id: "search", d: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35" },
] as const;

const JOIN_DESKTOP_NAV_BOTTOM: readonly JoinDesktopNavItem[] = [
  { id: "analytics", d: "M3 3v18h18M7 16l4-4 4 4 5-6" },
] as const;

const JOIN_DESKTOP_SELECTED_ORANGE = "#D2774C";
const JOIN_DESKTOP_ORANGE_GRADIENT =
  "radial-gradient(circle at 38% 34%, #E7A944 0%, #D49D4F 38%, #D2774C 72%, #C47A5A 100%)";

function JoinDesktopAvatar({
  initials,
  selected = false,
  size = "1.62rem",
  fontSize = "0.54rem",
}: {
  initials: string;
  selected?: boolean;
  size?: string;
  fontSize?: string;
}) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${
        selected ? "" : HERO_TRIAGE_JOIN_AVATAR_FLAT
      }`}
      style={{
        width: size,
        height: size,
        fontSize,
        ...(selected
          ? {
              background: "rgba(255,255,255,0.22)",
              color: "#FFFFFF",
              border: "1px solid rgba(255,255,255,0.26)",
            }
          : {}),
      }}
    >
      {initials}
    </div>
  );
}

function JoinDesktopInboxRow({ row }: { row: InboxRow }) {
  const selected = Boolean(row.selected);
  return (
    <div
      style={{
        margin: "0 0.28rem",
        borderRadius: selected ? "0.65rem" : "0.52rem",
        background: selected ? JOIN_DESKTOP_ORANGE_GRADIENT : "#F7F6F3",
        padding: selected ? "0.52rem 0.44rem" : "0.44rem 0.44rem",
        display: "flex",
        alignItems: "flex-start",
        gap: "0.5rem",
      }}
    >
      <JoinDesktopAvatar initials={row.initials} selected={selected} size="1.58rem" fontSize="0.52rem" />
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "0.4rem" }}>
          <span
            style={{
              fontSize: "0.6rem",
              fontWeight: 500,
              letterSpacing: "-0.01em",
              color: selected ? "#FFFFFF" : JOIN_FORM_BEIGE.ink,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {row.sender}
          </span>
          <span
            style={{
              fontSize: "0.46rem",
              fontWeight: 400,
              color: selected ? "rgba(255,255,255,0.72)" : "#A8A29E",
              flexShrink: 0,
            }}
          >
            {row.time}
          </span>
        </div>
        <p
          style={{
            fontSize: "0.54rem",
            fontWeight: 500,
            color: selected ? "rgba(255,255,255,0.94)" : "#1E343A",
            marginTop: "0.15em",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {row.subject}
        </p>
        <p
          style={{
            fontSize: "0.48rem",
            fontWeight: 400,
            color: "#9A9590",
            marginTop: "0.1em",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            visibility: selected ? "hidden" : "visible",
          }}
          aria-hidden={selected}
        >
          {row.preview}
        </p>
      </div>
    </div>
  );
}

function EmailAttachmentChip({ name, ext, size }: { name: string; ext: string; size: string }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.3rem",
        background: "#F7F6F3",
        border: "1px solid #EAE6DF",
        borderRadius: "0.45rem",
        padding: "0.26rem 0.52rem",
        flexShrink: 0,
      }}
    >
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#9A9590" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14,2 14,8 20,8" />
      </svg>
      <span style={{ fontSize: "0.46rem", fontWeight: 500, color: "#4A4540" }}>{name}</span>
      <span style={{ fontSize: "0.42rem", color: "#B0AAA4", background: "#EEEAE3", borderRadius: "0.22rem", padding: "0.06em 0.35em" }}>{ext}</span>
      <span style={{ fontSize: "0.42rem", color: "#B0AAA4" }}>{size}</span>
    </div>
  );
}

function EmailActionRow() {
  const btnStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.22rem",
    fontSize: "0.46rem",
    fontWeight: 500,
    color: "#9A9590",
    background: "#F7F6F3",
    border: "1px solid #EAE6DF",
    borderRadius: "0.38rem",
    padding: "0.2rem 0.48rem",
    cursor: "default",
  };
  return (
    <div style={{ display: "flex", gap: "0.32rem", marginTop: "0.55rem" }}>
      <div style={btnStyle}>
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <polyline points="9,17 4,12 9,7" /><path d="M20 18v-2a4 4 0 0 0-4-4H4" />
        </svg>
        Reply
      </div>
      <div style={btnStyle}>
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <polyline points="15,17 20,12 15,7" /><path d="M4 18v-2a4 4 0 0 1 4-4h12" />
        </svg>
        Forward
      </div>
    </div>
  );
}

function EmailTagChip({ label, color }: { label: string; color: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: "0.42rem",
        fontWeight: 500,
        color,
        background: `${color}18`,
        border: `1px solid ${color}38`,
        borderRadius: "999px",
        padding: "0.1em 0.5em",
      }}
    >
      {label}
    </span>
  );
}

function JoinDesktopOpenEmailClipPane() {
  return (
    <div
      className="relative min-h-0 min-w-0 flex-1 self-stretch overflow-hidden"
      style={{ borderLeft: "1px solid #EEEAE3", background: "#F0EDE8" }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-0 left-0 w-[205%]"
          style={{ padding: "0.45rem 0.48rem", display: "flex", flexDirection: "column", gap: "0.22rem" }}
        >
          {/* Thread header */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "0.68rem",
              padding: "0.7rem 0.85rem 0.65rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem" }}>
              <div>
                <p style={{ fontSize: "0.82rem", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.22, color: "#1E343A" }}>
                  Follow-up visit scheduling
                </p>
                <p style={{ fontSize: "0.52rem", color: "#9A9590", marginTop: "0.28rem" }}>
                  4 messages · Maria Rodriguez · Patient message
                </p>
              </div>
              <div style={{ display: "flex", gap: "0.28rem", flexShrink: 0, marginTop: "0.08rem" }}>
                <EmailTagChip label="Follow-up" color="#D2774C" />
                <EmailTagChip label="Unread" color="#5B9BD5" />
              </div>
            </div>
          </div>

          {/* Message 1 — Maria Rodriguez, full with attachment */}
          <div style={{ background: "#FFFFFF", borderRadius: "0.62rem", padding: "0.75rem 0.85rem 0.8rem" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.52rem" }}>
              <JoinDesktopAvatar initials="MR" size="1.65rem" fontSize="0.52rem" />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "0.32rem" }}>
                    <span style={{ fontSize: "0.64rem", fontWeight: 600, color: "#1E343A" }}>Maria Rodriguez</span>
                    <span style={{ fontSize: "0.47rem", color: "#A8A29E" }}>to Dr. Singh</span>
                  </div>
                  <span style={{ fontSize: "0.44rem", color: "#C0BAB4", flexShrink: 0 }}>Jun 21, 9:02 AM</span>
                </div>
                <div style={{ marginTop: "0.48rem", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                  <p style={{ fontSize: "0.58rem", lineHeight: 1.55, color: "rgba(30,52,58,0.78)" }}>Hi Dr. Singh,</p>
                  <p style={{ fontSize: "0.58rem", lineHeight: 1.55, color: "rgba(30,52,58,0.78)" }}>
                    I wanted to follow up on my chest tightness from last week. Symptoms have improved but I still notice mild tightness in the mornings.
                  </p>
                  <p style={{ fontSize: "0.58rem", lineHeight: 1.55, color: "rgba(30,52,58,0.78)" }}>Would it be possible to schedule a visit this week?</p>
                </div>
                {/* Attachment */}
                <div style={{ display: "flex", gap: "0.3rem", marginTop: "0.6rem", flexWrap: "wrap" }}>
                  <EmailAttachmentChip name="symptom_log_jun21" ext="PDF" size="84 KB" />
                  <EmailAttachmentChip name="prior_visit_notes" ext="DOCX" size="126 KB" />
                </div>
                <EmailActionRow />
              </div>
            </div>
          </div>

          {/* Message 2 — Dr. Singh reply */}
          <div style={{ background: "#FFFFFF", borderRadius: "0.62rem", padding: "0.75rem 0.85rem 0.8rem" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.52rem" }}>
              <JoinDesktopAvatar initials="DS" size="1.65rem" fontSize="0.52rem" />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "0.32rem" }}>
                    <span style={{ fontSize: "0.64rem", fontWeight: 600, color: "#1E343A" }}>Dr. Singh</span>
                    <span style={{ fontSize: "0.47rem", color: "#A8A29E" }}>to Maria Rodriguez</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.28rem", flexShrink: 0 }}>
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#68C298" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    <span style={{ fontSize: "0.44rem", color: "#C0BAB4" }}>Jun 21, 2:18 PM</span>
                  </div>
                </div>
                <div style={{ marginTop: "0.48rem", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                  <p style={{ fontSize: "0.58rem", lineHeight: 1.55, color: "rgba(30,52,58,0.78)" }}>Hi Maria, thanks for the update. Glad to hear things are improving.</p>
                  <p style={{ fontSize: "0.58rem", lineHeight: 1.55, color: "rgba(30,52,58,0.78)" }}>Any shortness of breath with walking or stairs?</p>
                </div>
                {/* AI suggestion chip */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.28rem",
                    marginTop: "0.6rem",
                    background: "rgba(210,119,76,0.08)",
                    border: "1px solid rgba(210,119,76,0.22)",
                    borderRadius: "0.45rem",
                    padding: "0.26rem 0.52rem",
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#D2774C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
                  </svg>
                  <span style={{ fontSize: "0.44rem", color: "#D2774C", fontWeight: 500 }}>Doe: Suggested follow-up slot — Thu 10 AM</span>
                </div>
                <EmailActionRow />
              </div>
            </div>
          </div>

          {/* Message 3 — Maria follow-up, partially clipped */}
          <div style={{ background: "#FFFFFF", borderRadius: "0.62rem", padding: "0.75rem 0.85rem 0.8rem" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.52rem" }}>
              <JoinDesktopAvatar initials="MR" size="1.65rem" fontSize="0.52rem" />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "0.32rem" }}>
                    <span style={{ fontSize: "0.64rem", fontWeight: 600, color: "#1E343A" }}>Maria Rodriguez</span>
                    <span style={{ fontSize: "0.47rem", color: "#A8A29E" }}>to Dr. Singh</span>
                  </div>
                  <span style={{ fontSize: "0.44rem", color: "#C0BAB4", flexShrink: 0 }}>Jun 22, 8:41 AM</span>
                </div>
                <div style={{ marginTop: "0.48rem", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                  <p style={{ fontSize: "0.58rem", lineHeight: 1.55, color: "rgba(30,52,58,0.78)" }}>No shortness of breath, just the morning tightness.</p>
                  <p style={{ fontSize: "0.58rem", lineHeight: 1.55, color: "rgba(30,52,58,0.78)" }}>Thursday or Friday would work well on my end.</p>
                </div>
                <div style={{ display: "flex", gap: "0.3rem", marginTop: "0.6rem", flexWrap: "wrap" }}>
                  <EmailAttachmentChip name="morning_log_jun22" ext="PDF" size="31 KB" />
                </div>
                <EmailActionRow />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function JoinDesktopNav({ config: _config }: { config: HeroTriageThemeConfig }) {
  const ic = "#B8B2AB";
  const sw = "1.4";
  const sz = 14;

  const btn = (active: boolean, icon: React.ReactNode) => (
    <div
      style={{
        width: "100%",
        height: "1.9rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "0.48rem",
        background: active ? JOIN_DESKTOP_ORANGE_GRADIENT : "transparent",
      }}
    >
      {icon}
    </div>
  );

  return (
    <nav
      style={{
        width: "3.2rem",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        borderRight: "1px solid #EEEAE3",
        background: "#F7F6F3",
        padding: "0.62rem 0",
      }}
    >
      {/* Logo */}
      <div
        style={{
          width: "1.9rem",
          height: "1.9rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "0.48rem",
          background: "#FFFFFF",
          marginBottom: "0.52rem",
          boxShadow: "0 1px 2px rgba(0,0,0,0.07)",
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: "0.66rem", fontWeight: 700, color: "#D2774C", letterSpacing: "-0.02em" }}>D</span>
      </div>

      {/* Main icons */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.12rem", width: "100%", padding: "0 0.35rem" }}>
        {/* Inbox — active */}
        {btn(
          true,
          <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M2 8l10 7 10-7" />
          </svg>,
        )}

        {/* Patients */}
        {btn(
          false,
          <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={ic} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>,
        )}

        {/* Calendar */}
        {btn(
          false,
          <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={ic} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>,
        )}

        {/* Tasks */}
        {btn(
          false,
          <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={ic} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="9,11 12,14 22,4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>,
        )}
      </div>

      {/* Divider */}
      <div style={{ width: "1.5rem", height: "1px", background: "#E5E1DA", margin: "0.42rem 0" }} />

      {/* Compose */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "0 0.35rem" }}>
        {btn(
          false,
          <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={ic} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>,
        )}
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Avatar */}
      <div style={{ borderTop: "1px solid #E5E1DA", paddingTop: "0.52rem" }}>
        <JoinDesktopAvatar initials="DS" size="1.85rem" fontSize="0.5rem" />
      </div>
    </nav>
  );
}

function JoinDesktopInboxPane({ rows }: { rows: readonly InboxRow[] }) {
  const visibleRows = rows.slice(0, 8);

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-1 items-stretch">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "27%",
          flexShrink: 0,
          borderRight: "1px solid #EEEAE3",
          background: "#FFFFFF",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.7rem 0.9rem 0.55rem",
            borderBottom: "1px solid #F0EDE8",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.38rem" }}>
            <HeroInboxIcon
              d="M4 6h16v12H4V6zm0 0 8 7 8-7"
              className={heroInboxIconClass({ mobile: false, accent: true })}
            />
            <span style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "-0.015em", color: "#1E343A" }}>
              Inbox
            </span>
          </div>
          <span
            style={{
              fontSize: "0.44rem",
              fontWeight: 500,
              color: "#78716C",
              background: "#F0EDE8",
              borderRadius: "999px",
              padding: "0.2em 0.55em",
            }}
          >
            12
          </span>
        </div>

        {/* Row list — card gaps, no dividers */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflow: "hidden",
            padding: "0.35rem 0",
            display: "flex",
            flexDirection: "column",
            gap: "0.15rem",
          }}
        >
          {visibleRows.map((row) => (
            <JoinDesktopInboxRow key={row.id} row={row} />
          ))}
        </div>
      </div>
      <JoinDesktopOpenEmailClipPane />
    </div>
  );
}

function heroInboxIconClass({
  mobile,
  joinCompact = false,
  accent = false,
  active = false,
}: {
  mobile: boolean;
  joinCompact?: boolean;
  accent?: boolean;
  active?: boolean;
}) {
  if (joinCompact || mobile) {
    if (accent) return "h-[1.5rem] w-[1.5rem] shrink-0 text-[#D2774C] iphone-page:h-[1.7rem] iphone-page:w-[1.7rem]";
    if (active) return "h-[1.5rem] w-[1.5rem] shrink-0 text-[#1E343A] iphone-page:h-[1.7rem] iphone-page:w-[1.7rem]";
    return "h-[1.5rem] w-[1.5rem] shrink-0 text-neutral-400 iphone-page:h-[1.7rem] iphone-page:w-[1.7rem]";
  }
  if (accent) return "h-[18px] w-[18px] shrink-0 text-[#D2774C]";
  if (active) return "h-[18px] w-[18px] shrink-0 text-[#1E343A]";
  return "h-[18px] w-[18px] shrink-0 text-neutral-500";
}

function HeroInboxIcon({
  d,
  className,
}: {
  d: string;
  className: string;
}) {
  return (
    <DoeBuildIcon className={className}>
      <path d={d} />
    </DoeBuildIcon>
  );
}

function NavIcon({
  children,
  active = false,
  mobile,
  config,
}: {
  children: ReactNode;
  active?: boolean;
  mobile: boolean;
  config: HeroTriageThemeConfig;
}) {
  const { colors } = config;
  const sz = mobile ? "3.1rem" : "2rem";
  if (config.flat) {
    return (
      <div
        className={`flex items-center justify-center rounded-[0.55rem] ${active ? HERO_TRIAGE_JOIN_NAV_CHIP_ACTIVE : ""}`}
        style={{
          width: sz,
          height: sz,
        }}
      >
        {children}
      </div>
    );
  }
  return (
    <div
      className={`flex items-center justify-center${active ? ` ${config.paneGlassTw}` : ""}`}
      style={{
        width: sz,
        height: sz,
        borderRadius: mobile ? "0.85rem" : "0.55rem",
        color: active ? colors.navActive : colors.navIcon,
        ...(active
          ? config.chipStyle({ background: config.chipGradient })
          : { background: "transparent" }),
      }}
    >
      {children}
    </div>
  );
}

function SenderMark({
  row,
  mobile,
  joinCompact = false,
  config,
}: {
  row: InboxRow;
  mobile: boolean;
  joinCompact?: boolean;
  config: HeroTriageThemeConfig;
}) {
  const { colors } = config;
  const sz = joinCompact ? "1.28rem" : mobile ? "2.35rem" : "1.45rem";
  const onSelectedRow = Boolean(row.selected);
  const useFlatSelectedMark = onSelectedRow && config.flat;
  const useFlatLightMark = !onSelectedRow && config.flat;
  const fontSize = joinCompact ? "0.48rem" : mobile ? "0.82rem" : "0.52rem";

  if (useFlatLightMark) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center rounded-full ${HERO_TRIAGE_JOIN_AVATAR_GRADIENT}`}
        style={{
          width: sz,
          height: sz,
          fontSize,
        }}
      >
        {row.initials}
      </div>
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center font-medium ${config.paneGlassTw}`}
      style={{
        width: sz,
        height: sz,
        borderRadius: "50%",
        background: useFlatSelectedMark ? "rgba(255,255,255,0.14)" : row.iconBg,
        color: useFlatSelectedMark ? "#FFFFFF" : row.iconColor,
        fontSize,
        border: `1px solid ${useFlatSelectedMark ? "rgba(255,255,255,0.12)" : colors.glassBorder}`,
        boxShadow: config.flat ? "none" : config.insetShadow,
      }}
    >
      {row.initials}
    </div>
  );
}

function InboxListRow({
  row,
  mobile,
  joinCompact = false,
  config,
}: {
  row: InboxRow;
  mobile: boolean;
  joinCompact?: boolean;
  config: HeroTriageThemeConfig;
}) {
  const { colors } = config;
  const nameFs = joinCompact ? "0.58rem" : mobile ? "0.96rem" : "0.62rem";
  const subFs = joinCompact ? "0.52rem" : mobile ? "0.88rem" : "0.56rem";
  const timeFs = joinCompact ? "0.46rem" : mobile ? "0.78rem" : "0.48rem";
  const pad = joinCompact ? "0.85rem 0.46rem" : mobile ? "0.62rem 0.9rem" : "0.42rem 0.52rem";
  const gap = joinCompact ? "0.38rem" : mobile ? "0.62rem" : "0.38rem";
  const rowMargin = joinCompact ? "0 0.24rem" : mobile ? "0 0.5rem" : "0 0.32rem";
  const rowRadius = joinCompact ? "0.42rem" : mobile ? "0.85rem" : "0.55rem";
  const rowRadiusDefault = joinCompact ? "0.38rem" : mobile ? "0.65rem" : "0.45rem";

  if (row.selected) {
    return (
      <div
        className={config.paneGlassTw}
        style={{
          margin: rowMargin,
          padding: pad,
          borderRadius: rowRadius,
          background: config.selectedGradient,
          border: `1px solid ${config.selectedBorder}`,
          boxShadow: "none",
          display: "flex",
          alignItems: "flex-start",
          gap,
        }}
      >
        <SenderMark row={row} mobile={mobile} joinCompact={joinCompact} config={config} />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-[0.4em]">
            <span
              style={{
                fontSize: nameFs,
                fontWeight: 500,
                color: colors.selectedSender,
                letterSpacing: "-0.01em",
              }}
            >
              {row.sender}
            </span>
            <span style={{ fontSize: timeFs, fontWeight: 400, color: colors.selectedTime, flexShrink: 0 }}>
              {row.time}
            </span>
          </div>
          <p
            className="truncate"
            style={{ fontSize: subFs, fontWeight: 500, color: colors.selectedSubject, marginTop: "0.15em" }}
          >
            {row.subject}
          </p>
          <p
            className="mt-[0.12em] truncate"
            style={{ fontSize: subFs, fontWeight: 400, color: colors.selectedPreview }}
          >
            {row.preview}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-start ${config.paneGlassTw}`}
      style={{
        gap,
        margin: rowMargin,
        padding: pad,
        borderRadius: rowRadiusDefault,
        ...config.chipStyle(),
      }}
    >
      <SenderMark row={row} mobile={mobile} joinCompact={joinCompact} config={config} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-[0.4em]">
          <span style={{ fontSize: nameFs, fontWeight: 500, color: colors.navActive, letterSpacing: "-0.01em" }}>
            {row.sender}
          </span>
          <span style={{ fontSize: timeFs, fontWeight: 400, color: colors.rowTime, flexShrink: 0 }}>
            {row.time}
          </span>
        </div>
        <p
          className="truncate"
          style={{ fontSize: subFs, fontWeight: 500, color: colors.pillText, marginTop: "0.15em" }}
        >
          {row.subject}
        </p>
        <p
          className="mt-[0.1em] truncate"
          style={{ fontSize: subFs, fontWeight: 400, color: colors.rowText }}
        >
          {row.preview}
        </p>
      </div>
    </div>
  );
}

type EmailThreadMessage = {
  id: string;
  from: string;
  to: string;
  time: string;
  lines: string[];
};

const EMAIL_THREAD: EmailThreadMessage[] = [
  {
    id: "e1",
    from: "Maria Rodriguez",
    to: "Dr. Singh",
    time: "Jun 21, 9:02 AM",
    lines: [
      "Hi Dr. Singh,",
      "I wanted to follow up on my chest tightness from last week. Symptoms have improved but I still notice mild tightness in the mornings.",
      "Would it be possible to schedule a visit this week?",
      "Thank you,",
      "Maria",
    ],
  },
  {
    id: "e2",
    from: "Dr. Singh",
    to: "Maria Rodriguez",
    time: "Jun 21, 2:18 PM",
    lines: [
      "Hi Maria,",
      "Thanks for the update. Glad to hear things are improving.",
      "Any shortness of breath with walking or stairs?",
    ],
  },
  {
    id: "e3",
    from: "Maria Rodriguez",
    to: "Dr. Singh",
    time: "Jun 22, 8:41 AM",
    lines: [
      "No shortness of breath, just the morning tightness.",
      "Thursday or Friday would work well on my end.",
    ],
  },
  {
    id: "e4",
    from: "Dr. Singh",
    to: "Maria Rodriguez",
    time: "Jun 22, 9:14 AM",
    lines: [
      "I have Thursday at 10 AM or Friday at 2 PM open.",
      "Let me know which you prefer and I will confirm.",
    ],
  },
];

function OpenEmailPane({ mobile, config }: { mobile: boolean; config: HeroTriageThemeConfig }) {
  const { colors } = config;
  const titleFs = mobile ? "1.22rem" : "0.82rem";
  const bodyFs = mobile ? "0.94rem" : "0.64rem";
  const metaFs = mobile ? "0.82rem" : "0.54rem";
  const labelFs = mobile ? "0.78rem" : "0.50rem";
  const pad = mobile ? "1.15rem 1.3rem" : "0.85rem 0.95rem";

  return (
    <div
      className="flex h-full min-w-0 flex-col border-l"
      style={{ borderColor: colors.divider, background: "transparent" }}
    >
      {/* Thread header */}
      <div
        className={config.paneGlassTw}
        style={{
          padding: pad,
          paddingBottom: mobile ? "0.85rem" : "0.55rem",
          borderBottom: `1px solid ${colors.divider}`,
          ...config.paneStyle(),
          borderRadius: 0,
          borderTop: "none",
          borderLeft: "none",
          borderRight: "none",
        }}
      >
        <p style={{ fontSize: titleFs, fontWeight: 500, color: colors.navActive, letterSpacing: "-0.02em" }}>
          Follow-up visit scheduling
        </p>
        <p style={{ fontSize: metaFs, fontWeight: 400, color: colors.detailMuted, marginTop: "0.28em" }}>
          Maria Rodriguez · Patient message
        </p>
      </div>

      {/* Email thread */}
      <div className="min-h-0 flex-1 overflow-hidden" style={{ padding: mobile ? "0.35rem 0" : "0.25rem 0" }}>
        {EMAIL_THREAD.map((msg) => (
          <div
            key={msg.id}
            className={config.paneGlassTw}
            style={{
              margin: mobile ? "0.45rem 0.85rem" : "0.3rem 0.6rem",
              padding: mobile ? "0.75rem 0.95rem" : "0.5rem 0.65rem",
              borderRadius: mobile ? "0.75rem" : "0.5rem",
              ...config.chipStyle(),
            }}
          >
            <div className="flex items-start gap-[0.5em]">
              <SenderMark
                row={{
                  ...SELECTED,
                  selected: false,
                  initials: msg.from === "Dr. Singh" ? "DS" : "MR",
                }}
                mobile={mobile}
                config={config}
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-[0.35em] gap-y-[0.1em]">
                  <span style={{ fontSize: metaFs, fontWeight: 500, color: colors.navActive }}>
                    {msg.from}
                  </span>
                  <span style={{ fontSize: labelFs, fontWeight: 400, color: colors.detailMuted }}>
                    to {msg.to}
                  </span>
                </div>
                <p style={{ fontSize: labelFs, fontWeight: 400, color: colors.rowTime, marginTop: "0.12em" }}>
                  {msg.time}
                </p>
              </div>
            </div>
            <div style={{ marginTop: mobile ? "0.65rem" : "0.4rem", paddingLeft: mobile ? "2.95rem" : "1.85rem" }}>
              {msg.lines.map((line) => (
                <p
                  key={line}
                  style={{
                    fontSize: bodyFs,
                    fontWeight: 400,
                    lineHeight: 1.5,
                    color: colors.detailBody,
                    marginBottom: line.startsWith("Hi") || line === "Maria" || line === "Thank you," ? "0.45em" : "0.2em",
                  }}
                >
                  {line}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Reply compose */}
      <div
        className={config.paneGlassTw}
        style={{
          borderTop: `1px solid ${colors.divider}`,
          padding: mobile ? "0.85rem 1.3rem" : "0.55rem 0.95rem",
          flexShrink: 0,
          ...config.paneStyle({ borderRadius: 0, borderBottom: "none", borderLeft: "none", borderRight: "none" }),
        }}
      >
        <p style={{ fontSize: labelFs, fontWeight: 500, color: colors.detailMuted, marginBottom: "0.45em" }}>
          Reply to Maria Rodriguez
        </p>
        <div
          className={config.paneGlassTw}
          style={{
            borderRadius: mobile ? "0.65rem" : "0.45rem",
            padding: mobile ? "0.65rem 0.85rem" : "0.45rem 0.55rem",
            display: "flex",
            alignItems: "center",
            gap: "0.55em",
            ...config.chipStyle(),
          }}
        >
          <p style={{ flex: 1, fontSize: bodyFs, fontWeight: 400, color: colors.rowMuted, lineHeight: 1.4 }}>
            Thursday at 10 AM works. See you then.
          </p>
          <div
            className={config.paneGlassTw}
            style={{
              borderRadius: "0.45rem",
              padding: mobile ? "0.32rem 0.75rem" : "0.2rem 0.5rem",
              flexShrink: 0,
              background: config.selectedGradient,
              border: `1px solid ${config.selectedBorder}`,
              boxShadow: "none",
            }}
          >
            <span style={{ fontSize: labelFs, fontWeight: 500, color: colors.sendButtonText }}>Send</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileNavMark({ mobile }: { mobile: boolean }) {
  const sz = mobile ? "3.1rem" : "2rem";
  return (
    <div
      className={`flex items-center justify-center rounded-full ${HERO_TRIAGE_JOIN_AVATAR_GRADIENT}`}
      style={{
        width: sz,
        height: sz,
        fontSize: mobile ? "0.82rem" : "0.52rem",
      }}
    >
      DS
    </div>
  );
}

export type HeroTriagePreviewProps = {
  fontClassName: string;
  size?: "desktop" | "mobile";
  theme?: HeroTriageTheme;
  layout?: "full" | "simple";
  showNavIcons?: boolean;
  desktopScale?: number;
  mobileScale?: number;
  mobileAnchor?: "default" | "join";
  style?: CSSProperties;
  className?: string;
};

/**
 * Doctor inbox — three-column UI (collapsed nav · inbox list · open message),
 * styled after modern inbox references. Flat layout; hero overflow clips edges.
 */
export function HeroTriagePreview({
  fontClassName,
  size = "desktop",
  theme = "dark",
  layout = "full",
  showNavIcons = false,
  desktopScale = 1,
  mobileScale,
  mobileAnchor = "default",
  style,
  className = "",
}: HeroTriagePreviewProps) {
  const isMobile = size === "mobile";
  const isSimple = layout === "simple";
  const isJoinMobile = isMobile && mobileAnchor === "join";
  const isJoinDesktop = !isMobile && isSimple && showNavIcons;
  const showFullNav = !isSimple || showNavIcons;
  const config = getHeroTriageThemeConfig(theme);
  const { colors } = config;
  const navW = isJoinMobile ? "3.15rem" : isMobile ? "5.1rem" : isSimple ? "3.25rem" : "2.85rem";
  const listW = isMobile && !isSimple ? HERO_TRIAGE_MOBILE_LIST_WIDTH : isSimple ? undefined : "38%";
  const inboxRows = isJoinMobile ? INBOX_ROWS : isSimple ? INBOX_ROWS.slice(0, 5) : INBOX_ROWS;
  const listRowMobile = (isMobile || isSimple) && !isJoinMobile;
  const navIconMobile = isMobile && !isJoinMobile;
  const mobileScaleValue = mobileScale ?? HERO_TRIAGE_MOBILE_SCALE;
  const desktopTransform =
    !isMobile && desktopScale !== 1 ? `scale(${desktopScale})` : HERO_TRIAGE_TILT.desktop;
  const mobileOuterHeight = isJoinMobile
    ? JOIN_MOBILE_HERO_TRIAGE_PANEL.outerHeight
    : isMobile && isSimple
      ? "26rem"
      : isMobile
        ? HERO_TRIAGE_MOBILE_MIN_HEIGHT.outer
        : undefined;
  const mobileInnerMinHeight = isJoinMobile
    ? JOIN_MOBILE_HERO_TRIAGE_PANEL.innerMinHeight
    : isMobile && isSimple
      ? "28rem"
      : isSimple
        ? "24rem"
        : isMobile
          ? HERO_TRIAGE_MOBILE_MIN_HEIGHT.inner
          : "18rem";

  return (
    <div
      className={`pointer-events-none absolute select-none ${className}`}
      style={{
        ...(isMobile && mobileAnchor === "default" ? HERO_TRIAGE_PANEL_ANCHOR.mobile : {}),
        ...(isMobile && mobileAnchor === "default"
          ? { width: HERO_TRIAGE_PANEL_WIDTH.mobile }
          : !isMobile
            ? { top: "30%", right: HERO_TRIAGE_PANEL_RIGHT.desktop, width: HERO_TRIAGE_PANEL_WIDTH.desktop }
            : {}),
        ...(isMobile && HERO_TRIAGE_PANEL_LEFT.mobile != null && mobileAnchor === "default"
          ? { left: HERO_TRIAGE_PANEL_LEFT.mobile }
          : {}),
        ...style,
      }}
      aria-hidden
    >
      <div
        style={{
          transform: isMobile ? `scale(${mobileScaleValue})` : desktopTransform,
          transformOrigin: isJoinMobile ? "bottom left" : isMobile ? "bottom left" : "bottom right",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        }}
      >
        <div
          className={`${config.outerGlassTw} ${fontClassName} overflow-hidden${isJoinDesktop ? " shadow-none" : ""}`}
          style={{
            borderRadius: isJoinMobile ? "0 0 1rem 1rem" : theme === "light" ? "1rem" : isMobile ? "1.35rem" : "1.1rem",
            background: config.shellGradient,
            ...(isJoinMobile ? { width: JOIN_MOBILE_HERO_TRIAGE_PANEL.panelWidth } : {}),
            ...(theme === "light" || isJoinDesktop
              ? { boxShadow: "none", filter: "none" }
              : {
                  border: `1px solid ${colors.shellBorder}`,
                  boxShadow: "inset 0 1px 0 rgba(255,228,196,0.1)",
                }),
            height: mobileOuterHeight,
            minHeight: isMobile ? undefined : isSimple ? "22rem" : "16rem",
          }}
        >
          <div
            className={`flex h-full ${config.innerGlassTw}`}
            style={{
              minHeight: isMobile ? mobileInnerMinHeight : isJoinDesktop ? "26rem" : isSimple ? "24rem" : "18rem",
              background: config.innerGradient,
            }}
          >
            {isJoinDesktop ? (
              <>
                <JoinDesktopNav config={config} />
                <JoinDesktopInboxPane rows={INBOX_ROWS} />
              </>
            ) : (
              <>
            {/* Collapsed vertical nav — icons only */}
            <nav
              className={`flex shrink-0 flex-col items-center ${config.paneGlassTw}`}
              style={{
                width: navW,
                borderRight: isSimple && !showNavIcons ? "none" : `1px solid ${colors.divider}`,
                padding: isJoinMobile ? "0.58rem 0.3rem" : isMobile ? "1.1rem 0.55rem" : isSimple ? "0.85rem 0.4rem" : "0.65rem 0.32rem",
                gap: isJoinMobile ? "0.18rem" : isMobile ? "0.35rem" : "0.28rem",
                ...config.paneStyle(),
                borderRadius: 0,
                borderTop: "none",
                borderBottom: "none",
                borderLeft: "none",
              }}
            >
              <NavIcon active mobile={navIconMobile} config={config}>
                <HeroInboxIcon
                  d="M4 6h16v12H4V6zm0 0 8 7 8-7"
                  className={heroInboxIconClass({
                    mobile: navIconMobile,
                    joinCompact: isJoinMobile,
                    active: config.flat,
                  })}
                />
              </NavIcon>
              {showFullNav ? (
                <>
                  <NavIcon mobile={isMobile} config={config}>
                    <HeroInboxIcon
                      d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"
                      className={heroInboxIconClass({ mobile: isMobile, joinCompact: isJoinMobile })}
                    />
                  </NavIcon>
                  <NavIcon mobile={isMobile} config={config}>
                    <HeroInboxIcon
                      d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7M3 7l9 6 9-6M3 7h18"
                      className={heroInboxIconClass({ mobile: isMobile, joinCompact: isJoinMobile })}
                    />
                  </NavIcon>
                  <NavIcon mobile={isMobile} config={config}>
                    <HeroInboxIcon
                      d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2z"
                      className={heroInboxIconClass({ mobile: isMobile, joinCompact: isJoinMobile })}
                    />
                  </NavIcon>
                  <div className="flex-1" />
                  <ProfileNavMark mobile={isMobile} />
                </>
              ) : null}
            </nav>

            {/* Inbox preview column */}
            <div
              className={`flex h-full min-w-0 flex-col ${isSimple ? "flex-1" : "shrink-0"} ${config.paneGlassTw}`}
              style={{
                ...(listW ? { width: listW } : {}),
                borderRight: isSimple ? "none" : `1px solid ${colors.divider}`,
                ...config.paneStyle(),
                borderRadius: 0,
                borderTop: "none",
                borderBottom: "none",
              }}
            >
              {/* Toolbar */}
              <div
                className={`flex items-center gap-[0.45em] ${config.paneGlassTw}`}
                style={{
                  padding: isJoinMobile ? "0.52rem 0.75rem" : isMobile ? "0.85rem 0.95rem" : isSimple ? "0.85rem 1rem" : "0.52rem 0.58rem",
                  borderBottom: `1px solid ${colors.divider}`,
                  color: colors.navIcon,
                  ...config.paneStyle({ borderRadius: 0, borderTop: "none", borderLeft: "none", borderRight: "none" }),
                }}
              >
                <div
                  className={`flex items-center gap-[0.35em] ${config.paneGlassTw}`}
                  style={{
                    borderRadius: "999px",
                    padding: isJoinMobile ? "0.28rem 0.55rem" : isMobile ? "0.38rem 0.75rem" : isSimple ? "0.35rem 0.65rem" : "0.24rem 0.48rem",
                    ...(isSimple ? { background: "transparent" } : config.chipStyle()),
                  }}
                >
                  <HeroInboxIcon
                    d="M4 6h16v12H4V6zm0 0 8 7 8-7"
                    className={heroInboxIconClass({
                      mobile: navIconMobile,
                      joinCompact: isJoinMobile,
                      accent: isSimple && config.flat,
                    })}
                  />
                  <span
                    style={{
                      fontSize: isJoinMobile ? "0.92rem" : isMobile ? "0.95rem" : isSimple ? "0.92rem" : "0.58rem",
                      fontWeight: 500,
                      color: isSimple ? JOIN_FORM_BEIGE.ink : colors.pillText,
                    }}
                  >
                    Inbox
                  </span>
                  {!isSimple ? (
                    <span
                      className={config.paneGlassTw}
                      style={{
                        fontSize: isMobile ? "0.78rem" : "0.48rem",
                        fontWeight: 500,
                        color: colors.badgeText,
                        borderRadius: "999px",
                        padding: "0.12em 0.45em",
                        minWidth: "1.4em",
                        textAlign: "center",
                        ...config.chipStyle({ background: config.chipGradient }),
                      }}
                    >
                      12
                    </span>
                  ) : null}
                </div>
                {!isSimple ? (
                  <>
                    <HeroInboxIcon
                      d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"
                      className={heroInboxIconClass({ mobile: isMobile, joinCompact: isJoinMobile })}
                    />
                    <HeroInboxIcon
                      d="M12 6v6l4 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
                      className={heroInboxIconClass({ mobile: isMobile, joinCompact: isJoinMobile })}
                    />
                    <HeroInboxIcon
                      d="M12 6h.01M12 12h.01M12 18h.01"
                      className={heroInboxIconClass({ mobile: isMobile, joinCompact: isJoinMobile })}
                    />
                  </>
                ) : null}
              </div>

              {/* Message list */}
              <div
                className="min-h-0 flex-1 overflow-hidden"
                style={{ padding: isJoinMobile ? "0.35rem 0.22rem" : isMobile ? "0.45rem 0.35rem" : isSimple ? "0.55rem 0.45rem" : "0.28rem 0.2rem", gap: isJoinMobile ? "0.32rem" : isMobile ? "0.28rem" : "0.18rem" }}
              >
                {inboxRows.map((row) => (
                  <div key={row.id}>
                    <InboxListRow row={row} mobile={listRowMobile} joinCompact={isJoinMobile} config={config} />
                  </div>
                ))}
              </div>
            </div>

            {!isSimple ? (
              /* Open email — partial column, clipped by hero overflow */
              <div
                className={`min-w-0 flex-1 ${config.paneGlassTw}`}
                style={config.paneStyle({ borderRadius: 0, borderTop: "none", borderBottom: "none", borderRight: "none" })}
              >
                <OpenEmailPane mobile={isMobile} config={config} />
              </div>
            ) : null}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/** @deprecated Use HeroTriagePreview */
export const DesktopHeroTriagePreview = HeroTriagePreview;
