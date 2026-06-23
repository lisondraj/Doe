import {
  HERO_TRIAGE_MOBILE_LIST_WIDTH,
  HERO_TRIAGE_MOBILE_MIN_HEIGHT,
  HERO_TRIAGE_MOBILE_SCALE,
  HERO_TRIAGE_OUTER_GLASS_TW,
  HERO_TRIAGE_PANEL_ANCHOR,
  HERO_TRIAGE_PANEL_LEFT,
  HERO_TRIAGE_PANEL_RIGHT,
  HERO_TRIAGE_PANEL_WIDTH,
  HERO_TRIAGE_SHELL_GLASS,
  HERO_TRIAGE_TILT,
} from "@/lib/home/hero-triage-preview-styles";
import type { CSSProperties, ReactNode } from "react";

/* ─── Frosted glass inbox tokens ─── */
const C = {
  shell: HERO_TRIAGE_SHELL_GLASS.background,
  shellBorder: HERO_TRIAGE_SHELL_GLASS.border,
  shellShadow: HERO_TRIAGE_SHELL_GLASS.shadow,
  navBg: "rgba(255,255,255,0.22)",
  navIcon: "rgba(0,0,0,0.34)",
  navActive: "rgba(0,0,0,0.86)",
  navActiveBg: "rgba(255,255,255,0.38)",
  pillBg: "rgba(255,255,255,0.42)",
  pillText: "rgba(0,0,0,0.68)",
  rowText: "rgba(0,0,0,0.52)",
  rowMuted: "rgba(0,0,0,0.36)",
  rowTime: "rgba(0,0,0,0.34)",
  divider: "rgba(255,255,255,0.42)",
  selected: "rgba(37,99,235,0.78)",
  selectedMuted: "rgba(255,255,255,0.76)",
  badgeBg: "rgba(255,255,255,0.36)",
  badgeText: "rgba(0,0,0,0.52)",
  detailBg: "rgba(255,255,255,0.14)",
  detailBody: "rgba(0,0,0,0.60)",
  detailMuted: "rgba(0,0,0,0.40)",
  glassReply: "rgba(255,255,255,0.30)",
  glassInput: "rgba(255,255,255,0.52)",
} as const;

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
    iconBg: "#EEF6F0",
    iconColor: "#3A7A55",
  },
  {
    id: "labcorp",
    sender: "LabCorp",
    initials: "LC",
    subject: "Critical result",
    preview: "K+ 6.2 mEq/L, patient A. Chen",
    time: "7:48",
    iconBg: "#FDF2F1",
    iconColor: "#B83A32",
  },
  {
    id: "nurse",
    sender: "Nurse Patel",
    initials: "NP",
    subject: "Post-op update",
    preview: "Room 308 stable, discharge timeline requested",
    time: "Yesterday",
    iconBg: "#F0F5FA",
    iconColor: "#3A6FA8",
  },
  {
    id: "patient",
    sender: "M. Rodriguez",
    initials: "MR",
    subject: "Follow-up visit",
    preview: "Need to schedule a visit this week",
    time: "9:14",
    iconBg: "#F2F3FA",
    iconColor: "#4A56B8",
    selected: true,
  },
  {
    id: "aetna",
    sender: "Aetna",
    initials: "AE",
    subject: "Pre-authorization",
    preview: "Approved for PT #8821",
    time: "Mon",
    iconBg: "#F7F4EF",
    iconColor: "#8A6840",
  },
  {
    id: "specialist",
    sender: "Dr. Okafor",
    initials: "DO",
    subject: "Referral accepted",
    preview: "Cardiology consult Tue 2 PM",
    time: "Mon",
    iconBg: "#F4F0FA",
    iconColor: "#6B3FA0",
  },
  {
    id: "quest",
    sender: "Quest Diagnostics",
    initials: "QD",
    subject: "Panel results",
    preview: "Lipid + HbA1c ready for T. Brooks",
    time: "Sun",
    iconBg: "#FFF6EE",
    iconColor: "#B86A28",
  },
  {
    id: "patient2",
    sender: "D. Kim",
    initials: "DK",
    subject: "Medication side effects",
    preview: "Dizziness since Monday morning",
    time: "Sun",
    iconBg: "#EDF6FB",
    iconColor: "#1A6E9A",
  },
  {
    id: "bcbs",
    sender: "BlueCross",
    initials: "BC",
    subject: "Claim processed",
    preview: "EOB attached for claim #44821",
    time: "Sat",
    iconBg: "#EDF1F9",
    iconColor: "#2B4FA8",
  },
  {
    id: "frontdesk",
    sender: "Front Desk",
    initials: "FD",
    subject: "Patient arrival",
    preview: "Room 4 ready for vitals",
    time: "Sat",
    iconBg: "#F3F5F2",
    iconColor: "#4A6B42",
  },
  {
    id: "imaging",
    sender: "Metro Imaging",
    initials: "MI",
    subject: "MRI report",
    preview: "Lumbar spine for R. Walsh",
    time: "Fri",
    iconBg: "#F6F0FA",
    iconColor: "#7A4A9A",
  },
  {
    id: "priorauth",
    sender: "Humana",
    initials: "HU",
    subject: "Prior auth approved",
    preview: "12 PT sessions authorized",
    time: "Fri",
    iconBg: "#EDF7F2",
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
  const nameFs = mobile ? "0.96rem" : "0.62rem";
  const subFs = mobile ? "0.88rem" : "0.56rem";
  const timeFs = mobile ? "0.78rem" : "0.48rem";
  const pad = mobile ? "0.62rem 0.9rem" : "0.42rem 0.52rem";
  const gap = mobile ? "0.62rem" : "0.38rem";

  if (row.selected) {
    return (
      <div
        style={{
          margin: mobile ? "0 0.5rem" : "0 0.32rem",
          padding: pad,
          borderRadius: mobile ? "0.85rem" : "0.55rem",
          background: C.selected,
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          display: "flex",
          alignItems: "flex-start",
          gap,
        }}
      >
        <SenderMark row={row} mobile={mobile} />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-[0.4em]">
            <span style={{ fontSize: nameFs, fontWeight: 500, color: "#fff", letterSpacing: "-0.01em" }}>
              {row.sender}
            </span>
            <span style={{ fontSize: timeFs, fontWeight: 400, color: C.selectedMuted, flexShrink: 0 }}>
              {row.time}
            </span>
          </div>
          <p
            className="truncate"
            style={{ fontSize: subFs, fontWeight: 500, color: "rgba(255,255,255,0.92)", marginTop: "0.15em" }}
          >
            {row.subject}
          </p>
          <p
            className="mt-[0.12em] truncate"
            style={{ fontSize: subFs, fontWeight: 400, color: "rgba(255,255,255,0.75)" }}
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
      style={{ gap, padding: mobile ? "0.52rem 0.9rem" : "0.38rem 0.52rem" }}
    >
      <SenderMark row={row} mobile={mobile} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-[0.4em]">
          <span style={{ fontSize: nameFs, fontWeight: 500, color: C.navActive, letterSpacing: "-0.01em" }}>
            {row.sender}
          </span>
          <span style={{ fontSize: timeFs, fontWeight: 400, color: C.rowTime, flexShrink: 0 }}>
            {row.time}
          </span>
        </div>
        <p
          className="truncate"
          style={{ fontSize: subFs, fontWeight: 500, color: C.pillText, marginTop: "0.15em" }}
        >
          {row.subject}
        </p>
        <p
          className="mt-[0.1em] truncate"
          style={{ fontSize: subFs, fontWeight: 400, color: C.rowText }}
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

function OpenEmailPane({ mobile }: { mobile: boolean }) {
  const titleFs = mobile ? "1.22rem" : "0.82rem";
  const bodyFs = mobile ? "0.94rem" : "0.64rem";
  const metaFs = mobile ? "0.82rem" : "0.54rem";
  const labelFs = mobile ? "0.78rem" : "0.50rem";
  const pad = mobile ? "1.15rem 1.3rem" : "0.85rem 0.95rem";

  return (
    <div
      className="flex h-full min-w-0 flex-col border-l backdrop-blur-[6px]"
      style={{ borderColor: C.divider, background: C.detailBg }}
    >
      {/* Thread header */}
      <div
        style={{
          padding: pad,
          paddingBottom: mobile ? "0.85rem" : "0.55rem",
          borderBottom: `1px solid ${C.divider}`,
        }}
      >
        <p style={{ fontSize: titleFs, fontWeight: 500, color: C.navActive, letterSpacing: "-0.02em" }}>
          Follow-up visit scheduling
        </p>
        <p style={{ fontSize: metaFs, fontWeight: 400, color: C.detailMuted, marginTop: "0.28em" }}>
          Maria Rodriguez · Patient message
        </p>
      </div>

      {/* Email thread */}
      <div className="min-h-0 flex-1 overflow-hidden" style={{ padding: mobile ? "0.35rem 0" : "0.25rem 0" }}>
        {EMAIL_THREAD.map((msg, i) => (
          <div
            key={msg.id}
            style={{
              padding: mobile ? "0.85rem 1.3rem" : "0.55rem 0.95rem",
              borderTop: i > 0 ? `1px solid ${C.divider}` : undefined,
            }}
          >
            <div className="flex items-start gap-[0.5em]">
              <SenderMark
                row={{
                  ...SELECTED,
                  initials: msg.from === "Dr. Singh" ? "DS" : "MR",
                  iconBg: msg.from === "Dr. Singh" ? "#EDF2FA" : SELECTED.iconBg,
                  iconColor: msg.from === "Dr. Singh" ? "#3A6FA8" : SELECTED.iconColor,
                }}
                mobile={mobile}
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-[0.35em] gap-y-[0.1em]">
                  <span style={{ fontSize: metaFs, fontWeight: 500, color: C.navActive }}>
                    {msg.from}
                  </span>
                  <span style={{ fontSize: labelFs, fontWeight: 400, color: C.detailMuted }}>
                    to {msg.to}
                  </span>
                </div>
                <p style={{ fontSize: labelFs, fontWeight: 400, color: C.rowTime, marginTop: "0.12em" }}>
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
                    color: C.detailBody,
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
        style={{
          borderTop: `1px solid ${C.divider}`,
          padding: mobile ? "0.85rem 1.3rem" : "0.55rem 0.95rem",
          background: C.glassReply,
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          flexShrink: 0,
        }}
      >
        <p style={{ fontSize: labelFs, fontWeight: 500, color: C.detailMuted, marginBottom: "0.45em" }}>
          Reply to Maria Rodriguez
        </p>
        <div
          style={{
            borderRadius: mobile ? "0.65rem" : "0.45rem",
            border: `1px solid ${C.divider}`,
            background: C.glassInput,
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            padding: mobile ? "0.65rem 0.85rem" : "0.45rem 0.55rem",
            display: "flex",
            alignItems: "center",
            gap: "0.55em",
          }}
        >
          <p style={{ flex: 1, fontSize: bodyFs, fontWeight: 400, color: C.rowMuted, lineHeight: 1.4 }}>
            Thursday at 10 AM works. See you then.
          </p>
          <div
            style={{
              borderRadius: "0.45rem",
              background: C.selected,
              padding: mobile ? "0.32rem 0.75rem" : "0.2rem 0.5rem",
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: labelFs, fontWeight: 500, color: "#fff" }}>Send</span>
          </div>
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
            boxShadow: C.shellShadow,
            height: isMobile ? HERO_TRIAGE_MOBILE_MIN_HEIGHT.outer : undefined,
            minHeight: isMobile ? undefined : "16rem",
          }}
        >
          <div className="flex h-full" style={{ minHeight: isMobile ? HERO_TRIAGE_MOBILE_MIN_HEIGHT.inner : "18rem" }}>
            {/* Collapsed vertical nav — icons only */}
            <nav
              className="flex shrink-0 flex-col items-center backdrop-blur-[6px]"
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
              className="flex h-full min-w-0 shrink-0 flex-col backdrop-blur-[6px]"
              style={{ width: listW, borderRight: `1px solid ${C.divider}`, background: "rgba(255,255,255,0.08)" }}
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
