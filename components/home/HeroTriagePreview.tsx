import {
  HERO_TRIAGE_MOBILE_LIST_WIDTH,
  HERO_TRIAGE_MOBILE_MIN_HEIGHT,
  HERO_TRIAGE_MOBILE_SCALE,
  HERO_TRIAGE_OUTER_GLASS_TW,
  HERO_TRIAGE_PANEL_ANCHOR,
  HERO_TRIAGE_PANEL_LEFT,
  HERO_TRIAGE_PANEL_RIGHT,
  HERO_TRIAGE_PANEL_WIDTH,
  HERO_TRIAGE_TILT,
} from "@/lib/home/hero-triage-preview-styles";
import type { CSSProperties, ReactNode } from "react";

/* ─── Reference-style tokens (Linear / modern inbox) ─── */
const C = {
  shell: "#FFFFFF",
  shellBorder: "rgba(0,0,0,0.06)",
  navBg: "#FAFAFA",
  navIcon: "rgba(0,0,0,0.38)",
  navActive: "rgba(0,0,0,0.88)",
  navActiveBg: "rgba(0,0,0,0.05)",
  toolbarBg: "#FFFFFF",
  pillBg: "rgba(0,0,0,0.06)",
  pillText: "rgba(0,0,0,0.72)",
  rowText: "rgba(0,0,0,0.55)",
  rowMuted: "rgba(0,0,0,0.38)",
  divider: "rgba(0,0,0,0.06)",
  selected: "#2B6FE8",
  selectedPill: "rgba(255,255,255,0.22)",
  selectedText: "#FFFFFF",
  badgeBg: "rgba(0,0,0,0.08)",
  badgeText: "rgba(0,0,0,0.55)",
  detailBg: "#FFFFFF",
  detailBody: "rgba(0,0,0,0.62)",
  detailMuted: "rgba(0,0,0,0.42)",
} as const;

type InboxRow = {
  id: string;
  sender: string;
  initials: string;
  preview: string;
  iconBg: string;
  iconColor: string;
  selected?: boolean;
};

const INBOX_ROWS: InboxRow[] = [
  {
    id: "pharmacy",
    sender: "Pharmacy",
    initials: "Rx",
    preview: "Refill request — Metformin 500mg for J. Martinez",
    iconBg: "#E8F4EC",
    iconColor: "#3D8B5F",
  },
  {
    id: "labcorp",
    sender: "LabCorp",
    initials: "LC",
    preview: "Critical result: K⁺ 6.2 mEq/L — patient A. Chen",
    iconBg: "#FDEDEC",
    iconColor: "#C0392B",
  },
  {
    id: "nurse",
    sender: "Nurse Patel",
    initials: "NP",
    preview: "Room 308 post-op stable — discharge timeline requested",
    iconBg: "#EBF2FA",
    iconColor: "#3A6FA8",
  },
  {
    id: "patient",
    sender: "M. Rodriguez",
    initials: "MR",
    preview: "Need to schedule a follow-up visit this week",
    iconBg: "#EEF0FF",
    iconColor: "#4A56B8",
    selected: true,
  },
  {
    id: "aetna",
    sender: "Aetna",
    initials: "AE",
    preview: "Pre-authorization approved for PT #8821",
    iconBg: "#F5F0EA",
    iconColor: "#9A7344",
  },
  {
    id: "specialist",
    sender: "Dr. Okafor",
    initials: "DO",
    preview: "Referral accepted — cardiology consult Tue 2 PM",
    iconBg: "#F0EBF8",
    iconColor: "#6B3FA0",
  },
  {
    id: "quest",
    sender: "Quest Diagnostics",
    initials: "QD",
    preview: "Panel results ready — lipid + HbA1c for T. Brooks",
    iconBg: "#FFF3E8",
    iconColor: "#C06820",
  },
  {
    id: "patient2",
    sender: "D. Kim",
    initials: "DK",
    preview: "Medication side effects — dizziness since Monday",
    iconBg: "#E8F3FB",
    iconColor: "#1A6E9A",
  },
  {
    id: "bcbs",
    sender: "BlueCross",
    initials: "BC",
    preview: "Claim #44821 processed — EOB attached",
    iconBg: "#E8EEF8",
    iconColor: "#2B4FA8",
  },
  {
    id: "frontdesk",
    sender: "Front Desk",
    initials: "FD",
    preview: "Patient arrived early — Room 4 ready for vitals",
    iconBg: "#F2F4F0",
    iconColor: "#4A6B42",
  },
  {
    id: "imaging",
    sender: "Metro Imaging",
    initials: "MI",
    preview: "MRI report uploaded — lumbar spine for R. Walsh",
    iconBg: "#F5EEF8",
    iconColor: "#7A4A9A",
  },
  {
    id: "priorauth",
    sender: "Humana",
    initials: "HU",
    preview: "Prior auth #99201 approved — 12 PT sessions",
    iconBg: "#E8F5F0",
    iconColor: "#2A7A52",
  },
];

const SELECTED = INBOX_ROWS.find((r) => r.selected)!;

function NavIcon({
  children,
  active = false,
  mobile,
}: {
  children: ReactNode;
  active?: boolean;
  mobile: boolean;
}) {
  const sz = mobile ? "3.1rem" : "2rem";
  return (
    <div
      className="flex items-center justify-center"
      style={{
        width: sz,
        height: sz,
        borderRadius: mobile ? "0.85rem" : "0.55rem",
        color: active ? C.navActive : C.navIcon,
        background: active ? C.navActiveBg : "transparent",
      }}
    >
      {children}
    </div>
  );
}

function InboxIcon({ d, mobile }: { d: string; mobile: boolean }) {
  const s = mobile ? 22 : 14;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d={d} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SenderMark({ row, mobile }: { row: InboxRow; mobile: boolean }) {
  const sz = mobile ? "2.35rem" : "1.45rem";
  return (
    <div
      className="flex shrink-0 items-center justify-center font-medium"
      style={{
        width: sz,
        height: sz,
        borderRadius: "50%",
        background: row.iconBg,
        color: row.iconColor,
        fontSize: mobile ? "0.82rem" : "0.52rem",
      }}
    >
      {row.initials}
    </div>
  );
}

function InboxListRow({ row, mobile }: { row: InboxRow; mobile: boolean }) {
  const fs = mobile ? "1.02rem" : "0.66rem";
  const pillFs = mobile ? "0.92rem" : "0.58rem";
  const pad = mobile ? "0.58rem 0.85rem" : "0.42rem 0.52rem";
  const gap = mobile ? "0.65rem" : "0.38rem";

  if (row.selected) {
    return (
      <div
        style={{
          margin: mobile ? "0 0.55rem" : "0 0.32rem",
          padding: pad,
          borderRadius: mobile ? "1rem" : "0.62rem",
          background: C.selected,
          display: "flex",
          alignItems: "flex-start",
          gap,
        }}
      >
        <SenderMark row={row} mobile={mobile} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-[0.35em]">
            <span
              style={{
                fontSize: pillFs,
                fontWeight: 500,
                color: C.selectedText,
                background: C.selectedPill,
                borderRadius: "999px",
                padding: mobile ? "0.22em 0.65em" : "0.18em 0.48em",
              }}
            >
              {row.sender}
            </span>
            <InboxIcon
              mobile={mobile}
              d="M3 10h10l4 4V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v4z"
            />
          </div>
          <p
            className="mt-[0.28em] truncate"
            style={{ fontSize: fs, fontWeight: 400, color: "rgba(255,255,255,0.92)" }}
          >
            {row.preview}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex items-start"
      style={{ gap, padding: mobile ? "0.48rem 0.85rem" : "0.38rem 0.52rem" }}
    >
      <SenderMark row={row} mobile={mobile} />
      <div className="min-w-0 flex-1">
        <span
          style={{
            fontSize: pillFs,
            fontWeight: 500,
            color: C.pillText,
            background: C.pillBg,
            borderRadius: "999px",
            padding: mobile ? "0.2em 0.62em" : "0.16em 0.42em",
            display: "inline-block",
          }}
        >
          {row.sender}
        </span>
        <p
          className="mt-[0.32em] truncate"
          style={{ fontSize: fs, fontWeight: 400, color: C.rowText }}
        >
          {row.preview}
        </p>
      </div>
    </div>
  );
}

const THREAD_MESSAGES = [
  {
    id: "p1",
    from: "patient" as const,
    text: "Hi Dr. Singh — I wanted to follow up on my chest tightness from last week. Symptoms have improved but I still feel it in the mornings.",
  },
  {
    id: "d1",
    from: "doctor" as const,
    text: "Thanks for checking in, Maria. Glad things are better — any shortness of breath with walking or stairs?",
  },
  {
    id: "p2",
    from: "patient" as const,
    text: "No shortness of breath, just mild tightness when I wake up. I'd like to schedule a visit this week if possible.",
  },
  {
    id: "d2",
    from: "doctor" as const,
    text: "Happy to get you in. I have Thursday at 10 AM or Friday at 2 PM — either work for you?",
  },
  {
    id: "p3",
    from: "patient" as const,
    text: "Thursday at 10 AM works perfectly. Thank you!",
  },
];

function OpenEmailPane({ mobile }: { mobile: boolean }) {
  const titleFs = mobile ? "1.35rem" : "0.82rem";
  const bodyFs = mobile ? "0.98rem" : "0.64rem";
  const metaFs = mobile ? "0.88rem" : "0.54rem";
  const pad = mobile ? "1.2rem 1.35rem" : "0.85rem 0.95rem";
  const smallFs = mobile ? "0.88rem" : "0.56rem";

  return (
    <div
      className="flex h-full min-w-0 flex-col border-l"
      style={{ borderColor: C.divider, background: C.detailBg, padding: pad, gap: mobile ? "0.85rem" : "0.55rem" }}
    >
      {/* Header */}
      <div className="flex items-center gap-[0.55em]">
        <SenderMark row={SELECTED} mobile={mobile} />
        <div className="min-w-0">
          <p style={{ fontSize: titleFs, fontWeight: 500, color: C.navActive, letterSpacing: "-0.02em" }}>
            {SELECTED.sender}
          </p>
          <p style={{ fontSize: metaFs, fontWeight: 400, color: C.detailMuted, marginTop: "0.12em" }}>
            Follow-up visit scheduling · Today
          </p>
        </div>
      </div>

      {/* Thread */}
      <div
        className="flex min-h-0 flex-1 flex-col"
        style={{ gap: mobile ? "0.65rem" : "0.4rem", overflow: "hidden" }}
      >
        {THREAD_MESSAGES.map((msg) => {
          const isDoctor = msg.from === "doctor";
          return (
            <div
              key={msg.id}
              style={{
                display: "flex",
                justifyContent: isDoctor ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  maxWidth: "92%",
                  borderRadius: mobile ? "1rem" : "0.62rem",
                  padding: mobile ? "0.72rem 0.95rem" : "0.45rem 0.62rem",
                  background: isDoctor ? C.selected : "#F3F3F3",
                  color: isDoctor ? "#fff" : C.detailBody,
                }}
              >
                {!isDoctor && (
                  <p
                    style={{
                      fontSize: smallFs,
                      fontWeight: 500,
                      color: C.pillText,
                      marginBottom: "0.28em",
                    }}
                  >
                    Maria Rodriguez
                  </p>
                )}
                <p style={{ fontSize: bodyFs, fontWeight: 400, lineHeight: 1.45 }}>
                  {msg.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Compact reply bar */}
      <div
        style={{
          borderRadius: mobile ? "0.85rem" : "0.52rem",
          border: `1px solid ${C.divider}`,
          background: "#FAFAFA",
          padding: mobile ? "0.65rem 0.85rem" : "0.45rem 0.55rem",
          display: "flex",
          alignItems: "center",
          gap: "0.55em",
          flexShrink: 0,
        }}
      >
        <p style={{ flex: 1, fontSize: bodyFs, fontWeight: 400, color: C.rowMuted }}>
          Sounds good — see you Thursday at 10.
        </p>
        <div
          style={{
            borderRadius: "999px",
            background: C.selected,
            padding: mobile ? "0.32rem 0.85rem" : "0.2rem 0.55rem",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: smallFs, fontWeight: 500, color: "#fff" }}>Send</span>
        </div>
      </div>
    </div>
  );
}

export type HeroTriagePreviewProps = {
  fontClassName: string;
  size?: "desktop" | "mobile";
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
  style,
  className = "",
}: HeroTriagePreviewProps) {
  const isMobile = size === "mobile";
  const navW = isMobile ? "5.1rem" : "2.85rem";
  const listW = isMobile ? HERO_TRIAGE_MOBILE_LIST_WIDTH : "38%";

  return (
    <div
      className={`pointer-events-none absolute select-none ${className}`}
      style={{
        ...(isMobile
          ? HERO_TRIAGE_PANEL_ANCHOR.mobile
          : { top: "30%", right: HERO_TRIAGE_PANEL_RIGHT.desktop }),
        ...(isMobile && HERO_TRIAGE_PANEL_LEFT.mobile != null
          ? { left: HERO_TRIAGE_PANEL_LEFT.mobile }
          : {}),
        width: isMobile ? HERO_TRIAGE_PANEL_WIDTH.mobile : HERO_TRIAGE_PANEL_WIDTH.desktop,
        ...style,
      }}
      aria-hidden
    >
      <div
        style={{
          transform: isMobile ? `scale(${HERO_TRIAGE_MOBILE_SCALE})` : HERO_TRIAGE_TILT.desktop,
          transformOrigin: isMobile ? "bottom left" : undefined,
        }}
      >
        <div
          className={`${HERO_TRIAGE_OUTER_GLASS_TW} ${fontClassName} overflow-hidden`}
          style={{
            borderRadius: isMobile ? "1.35rem" : "1.1rem",
            background: C.shell,
            border: `1px solid ${C.shellBorder}`,
            boxShadow: isMobile
              ? "none"
              : "0 24px 64px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.95)",
            height: isMobile ? HERO_TRIAGE_MOBILE_MIN_HEIGHT.outer : undefined,
            minHeight: isMobile ? undefined : "16rem",
          }}
        >
          <div className="flex h-full" style={{ minHeight: isMobile ? HERO_TRIAGE_MOBILE_MIN_HEIGHT.inner : "18rem" }}>
            {/* Collapsed vertical nav — icons only */}
            <nav
              className="flex shrink-0 flex-col items-center"
              style={{
                width: navW,
                background: C.navBg,
                borderRight: `1px solid ${C.divider}`,
                padding: isMobile ? "1.1rem 0.55rem" : "0.65rem 0.32rem",
                gap: isMobile ? "0.35rem" : "0.2rem",
              }}
            >
              <NavIcon active mobile={isMobile}>
                <InboxIcon mobile={isMobile} d="M4 6h16v12H4V6zm0 0 8 7 8-7" />
              </NavIcon>
              <NavIcon mobile={isMobile}>
                <InboxIcon mobile={isMobile} d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </NavIcon>
              <NavIcon mobile={isMobile}>
                <InboxIcon mobile={isMobile} d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7M3 7l9 6 9-6M3 7h18" />
              </NavIcon>
              <NavIcon mobile={isMobile}>
                <InboxIcon mobile={isMobile} d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2z" />
              </NavIcon>
              <div className="flex-1" />
              <NavIcon mobile={isMobile}>
                <InboxIcon mobile={isMobile} d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm7.5-9.5a8.38 8.38 0 0 1 0 11M4.5 5.5a8.38 8.38 0 0 0 0 11" />
              </NavIcon>
            </nav>

            {/* Inbox preview column */}
            <div
              className="flex h-full min-w-0 shrink-0 flex-col"
              style={{ width: listW, borderRight: `1px solid ${C.divider}` }}
            >
              {/* Toolbar */}
              <div
                className="flex items-center gap-[0.45em]"
                style={{
                  padding: isMobile ? "0.85rem 0.95rem" : "0.52rem 0.58rem",
                  borderBottom: `1px solid ${C.divider}`,
                }}
              >
                <div
                  className="flex items-center gap-[0.35em]"
                  style={{
                    background: C.pillBg,
                    borderRadius: "999px",
                    padding: isMobile ? "0.38rem 0.75rem" : "0.24rem 0.48rem",
                  }}
                >
                  <InboxIcon mobile={isMobile} d="M4 6h16v12H4V6zm0 0 8 7 8-7" />
                  <span style={{ fontSize: isMobile ? "0.95rem" : "0.58rem", fontWeight: 500, color: C.pillText }}>
                    Inbox
                  </span>
                  <span
                    style={{
                      fontSize: isMobile ? "0.78rem" : "0.48rem",
                      fontWeight: 500,
                      color: C.badgeText,
                      background: C.badgeBg,
                      borderRadius: "999px",
                      padding: "0.12em 0.45em",
                      minWidth: "1.4em",
                      textAlign: "center",
                    }}
                  >
                    12
                  </span>
                </div>
                <InboxIcon mobile={isMobile} d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
                <InboxIcon mobile={isMobile} d="M12 6v6l4 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                <InboxIcon mobile={isMobile} d="M12 6h.01M12 12h.01M12 18h.01" />
              </div>

              {/* Message list */}
              <div className="min-h-0 flex-1 overflow-hidden" style={{ padding: isMobile ? "0.35rem 0" : "0.28rem 0" }}>
                {INBOX_ROWS.map((row, i) => (
                  <div key={row.id}>
                    <InboxListRow row={row} mobile={isMobile} />
                    {i < INBOX_ROWS.length - 1 && !row.selected && !INBOX_ROWS[i + 1]?.selected && (
                      <div
                        style={{
                          height: 1,
                          background: C.divider,
                          marginLeft: isMobile ? "3.85rem" : "2.35rem",
                          marginRight: isMobile ? "0.85rem" : "0.52rem",
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Open email — partial column, clipped by hero overflow */}
            <div className="min-w-0 flex-1">
              <OpenEmailPane mobile={isMobile} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** @deprecated Use HeroTriagePreview */
export const DesktopHeroTriagePreview = HeroTriagePreview;
