import {
  HERO_TRIAGE_CHIP_GRADIENT,
  HERO_TRIAGE_INNER_GLASS_TW,
  HERO_TRIAGE_INNER_GRADIENT,
  HERO_TRIAGE_MOBILE_LIST_WIDTH,
  HERO_TRIAGE_MOBILE_MIN_HEIGHT,
  HERO_TRIAGE_MOBILE_SCALE,
  HERO_TRIAGE_OUTER_GLASS_TW,
  HERO_TRIAGE_PANE_GLASS_TW,
  HERO_TRIAGE_PANE_GRADIENT,
  HERO_TRIAGE_PANEL_ANCHOR,
  HERO_TRIAGE_PANEL_LEFT,
  HERO_TRIAGE_PANEL_RIGHT,
  HERO_TRIAGE_PANEL_WIDTH,
  HERO_TRIAGE_SELECTED_GRADIENT,
  HERO_TRIAGE_SHELL_GRADIENT,
  HERO_TRIAGE_TILT,
} from "@/lib/home/hero-triage-preview-styles";
import type { CSSProperties, ReactNode } from "react";

const GLASS_INSET = "inset 0 1px 0 rgba(255,255,255,0.07)";

/* ─── Frosted glass inbox tokens ─── */
const C = {
  shellBorder: "rgba(255,255,255,0.10)",
  glassBorder: "rgba(255,255,255,0.07)",
  navIcon: "rgba(255,255,255,0.34)",
  navActive: "rgba(255,255,255,0.88)",
  navActiveBg: "rgba(255,255,255,0.06)",
  pillText: "rgba(255,255,255,0.78)",
  rowText: "rgba(255,255,255,0.52)",
  rowMuted: "rgba(255,255,255,0.36)",
  rowTime: "rgba(255,255,255,0.32)",
  divider: "rgba(255,255,255,0.06)",
  selectedMuted: "rgba(255,255,255,0.68)",
  badgeText: "rgba(255,255,255,0.52)",
  detailBody: "rgba(255,255,255,0.66)",
  detailMuted: "rgba(255,255,255,0.42)",
} as const;

function glassPaneStyle(extra?: CSSProperties): CSSProperties {
  return {
    background: HERO_TRIAGE_PANE_GRADIENT,
    border: `1px solid ${C.glassBorder}`,
    boxShadow: GLASS_INSET,
    ...extra,
  };
}

function glassChipStyle(extra?: CSSProperties): CSSProperties {
  return {
    background: HERO_TRIAGE_CHIP_GRADIENT,
    border: `1px solid ${C.glassBorder}`,
    boxShadow: GLASS_INSET,
    ...extra,
  };
}

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
    iconBg: "rgba(58,122,85,0.16)",
    iconColor: "rgba(190,220,200,0.88)",
  },
  {
    id: "labcorp",
    sender: "LabCorp",
    initials: "LC",
    subject: "Critical result",
    preview: "K+ 6.2 mEq/L, patient A. Chen",
    time: "7:48",
    iconBg: "rgba(184,58,50,0.16)",
    iconColor: "rgba(240,200,195,0.88)",
  },
  {
    id: "nurse",
    sender: "Nurse Patel",
    initials: "NP",
    subject: "Post-op update",
    preview: "Room 308 stable, discharge timeline requested",
    time: "Yesterday",
    iconBg: "rgba(58,111,168,0.16)",
    iconColor: "rgba(195,215,235,0.88)",
  },
  {
    id: "patient",
    sender: "M. Rodriguez",
    initials: "MR",
    subject: "Follow-up visit",
    preview: "Need to schedule a visit this week",
    time: "9:14",
    iconBg: "rgba(74,86,184,0.18)",
    iconColor: "rgba(200,205,240,0.90)",
    selected: true,
  },
  {
    id: "aetna",
    sender: "Aetna",
    initials: "AE",
    subject: "Pre-authorization",
    preview: "Approved for PT #8821",
    time: "Mon",
    iconBg: "rgba(138,104,64,0.16)",
    iconColor: "rgba(230,215,195,0.88)",
  },
  {
    id: "specialist",
    sender: "Dr. Okafor",
    initials: "DO",
    subject: "Referral accepted",
    preview: "Cardiology consult Tue 2 PM",
    time: "Mon",
    iconBg: "rgba(107,63,160,0.16)",
    iconColor: "rgba(215,200,235,0.88)",
  },
  {
    id: "quest",
    sender: "Quest Diagnostics",
    initials: "QD",
    subject: "Panel results",
    preview: "Lipid + HbA1c ready for T. Brooks",
    time: "Sun",
    iconBg: "rgba(184,106,40,0.16)",
    iconColor: "rgba(240,215,190,0.88)",
  },
  {
    id: "patient2",
    sender: "D. Kim",
    initials: "DK",
    subject: "Medication side effects",
    preview: "Dizziness since Monday morning",
    time: "Sun",
    iconBg: "rgba(26,110,154,0.16)",
    iconColor: "rgba(190,220,240,0.88)",
  },
  {
    id: "bcbs",
    sender: "BlueCross",
    initials: "BC",
    subject: "Claim processed",
    preview: "EOB attached for claim #44821",
    time: "Sat",
    iconBg: "rgba(43,79,168,0.16)",
    iconColor: "rgba(195,210,240,0.88)",
  },
  {
    id: "frontdesk",
    sender: "Front Desk",
    initials: "FD",
    subject: "Patient arrival",
    preview: "Room 4 ready for vitals",
    time: "Sat",
    iconBg: "rgba(74,107,66,0.16)",
    iconColor: "rgba(200,220,195,0.88)",
  },
  {
    id: "imaging",
    sender: "Metro Imaging",
    initials: "MI",
    subject: "MRI report",
    preview: "Lumbar spine for R. Walsh",
    time: "Fri",
    iconBg: "rgba(122,74,154,0.16)",
    iconColor: "rgba(220,200,235,0.88)",
  },
  {
    id: "priorauth",
    sender: "Humana",
    initials: "HU",
    subject: "Prior auth approved",
    preview: "12 PT sessions authorized",
    time: "Fri",
    iconBg: "rgba(42,122,82,0.16)",
    iconColor: "rgba(195,230,210,0.88)",
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
      className={`flex items-center justify-center${active ? ` ${HERO_TRIAGE_PANE_GLASS_TW}` : ""}`}
      style={{
        width: sz,
        height: sz,
        borderRadius: mobile ? "0.85rem" : "0.55rem",
        color: active ? C.navActive : C.navIcon,
        ...(active
          ? glassChipStyle({ background: HERO_TRIAGE_CHIP_GRADIENT })
          : { background: "transparent" }),
      }}
    >
      {children}
    </div>
  );
}

function InboxIcon({
  d,
  mobile,
  color = C.navIcon,
}: {
  d: string;
  mobile: boolean;
  color?: string;
}) {
  const s = mobile ? 22 : 14;
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      style={{ color, display: "block", flexShrink: 0 }}
    >
      <path d={d} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SenderMark({ row, mobile }: { row: InboxRow; mobile: boolean }) {
  const sz = mobile ? "2.35rem" : "1.45rem";
  return (
    <div
      className={`flex shrink-0 items-center justify-center font-medium ${HERO_TRIAGE_PANE_GLASS_TW}`}
      style={{
        width: sz,
        height: sz,
        borderRadius: "50%",
        background: row.iconBg,
        color: row.iconColor,
        fontSize: mobile ? "0.82rem" : "0.52rem",
        border: `1px solid ${C.glassBorder}`,
        boxShadow: GLASS_INSET,
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
        className={HERO_TRIAGE_PANE_GLASS_TW}
        style={{
          margin: mobile ? "0 0.5rem" : "0 0.32rem",
          padding: pad,
          borderRadius: mobile ? "0.85rem" : "0.55rem",
          background: HERO_TRIAGE_SELECTED_GRADIENT,
          border: `1px solid rgba(255,255,255,0.12)`,
          boxShadow: GLASS_INSET,
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
      className={`flex items-start ${HERO_TRIAGE_PANE_GLASS_TW}`}
      style={{
        gap,
        margin: mobile ? "0 0.5rem" : "0 0.32rem",
        padding: pad,
        borderRadius: mobile ? "0.65rem" : "0.45rem",
        ...glassChipStyle(),
      }}
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
      className="flex h-full min-w-0 flex-col border-l"
      style={{ borderColor: C.divider, background: "transparent" }}
    >
      {/* Thread header */}
      <div
        className={HERO_TRIAGE_PANE_GLASS_TW}
        style={{
          padding: pad,
          paddingBottom: mobile ? "0.85rem" : "0.55rem",
          borderBottom: `1px solid ${C.divider}`,
          ...glassPaneStyle(),
          borderRadius: 0,
          borderTop: "none",
          borderLeft: "none",
          borderRight: "none",
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
            className={HERO_TRIAGE_PANE_GLASS_TW}
            style={{
              margin: mobile ? "0.45rem 0.85rem" : "0.3rem 0.6rem",
              padding: mobile ? "0.75rem 0.95rem" : "0.5rem 0.65rem",
              borderRadius: mobile ? "0.75rem" : "0.5rem",
              ...glassChipStyle(),
            }}
          >
            <div className="flex items-start gap-[0.5em]">
              <SenderMark
                row={{
                  ...SELECTED,
                  initials: msg.from === "Dr. Singh" ? "DS" : "MR",
                  iconBg: msg.from === "Dr. Singh" ? "rgba(58,111,168,0.16)" : SELECTED.iconBg,
                  iconColor: msg.from === "Dr. Singh" ? "rgba(195,215,235,0.88)" : SELECTED.iconColor,
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
        className={HERO_TRIAGE_PANE_GLASS_TW}
        style={{
          borderTop: `1px solid ${C.divider}`,
          padding: mobile ? "0.85rem 1.3rem" : "0.55rem 0.95rem",
          flexShrink: 0,
          ...glassPaneStyle({ borderRadius: 0, borderBottom: "none", borderLeft: "none", borderRight: "none" }),
        }}
      >
        <p style={{ fontSize: labelFs, fontWeight: 500, color: C.detailMuted, marginBottom: "0.45em" }}>
          Reply to Maria Rodriguez
        </p>
        <div
          className={HERO_TRIAGE_PANE_GLASS_TW}
          style={{
            borderRadius: mobile ? "0.65rem" : "0.45rem",
            padding: mobile ? "0.65rem 0.85rem" : "0.45rem 0.55rem",
            display: "flex",
            alignItems: "center",
            gap: "0.55em",
            ...glassChipStyle(),
          }}
        >
          <p style={{ flex: 1, fontSize: bodyFs, fontWeight: 400, color: C.rowMuted, lineHeight: 1.4 }}>
            Thursday at 10 AM works. See you then.
          </p>
          <div
            className={HERO_TRIAGE_PANE_GLASS_TW}
            style={{
              borderRadius: "0.45rem",
              padding: mobile ? "0.32rem 0.75rem" : "0.2rem 0.5rem",
              flexShrink: 0,
              background: HERO_TRIAGE_SELECTED_GRADIENT,
              border: `1px solid rgba(255,255,255,0.12)`,
              boxShadow: GLASS_INSET,
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
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        }}
      >
        <div
          className={`${HERO_TRIAGE_OUTER_GLASS_TW} ${fontClassName} overflow-hidden`}
          style={{
            borderRadius: isMobile ? "1.35rem" : "1.1rem",
            background: HERO_TRIAGE_SHELL_GRADIENT,
            border: `1px solid ${C.shellBorder}`,
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
            height: isMobile ? HERO_TRIAGE_MOBILE_MIN_HEIGHT.outer : undefined,
            minHeight: isMobile ? undefined : "16rem",
          }}
        >
          <div
            className={`flex h-full ${HERO_TRIAGE_INNER_GLASS_TW}`}
            style={{
              minHeight: isMobile ? HERO_TRIAGE_MOBILE_MIN_HEIGHT.inner : "18rem",
              background: HERO_TRIAGE_INNER_GRADIENT,
            }}
          >
            {/* Collapsed vertical nav — icons only */}
            <nav
              className={`flex shrink-0 flex-col items-center ${HERO_TRIAGE_PANE_GLASS_TW}`}
              style={{
                width: navW,
                borderRight: `1px solid ${C.divider}`,
                padding: isMobile ? "1.1rem 0.55rem" : "0.65rem 0.32rem",
                gap: isMobile ? "0.35rem" : "0.2rem",
                ...glassPaneStyle(),
                borderRadius: 0,
                borderTop: "none",
                borderBottom: "none",
                borderLeft: "none",
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
              className={`flex h-full min-w-0 shrink-0 flex-col ${HERO_TRIAGE_PANE_GLASS_TW}`}
              style={{
                width: listW,
                borderRight: `1px solid ${C.divider}`,
                ...glassPaneStyle(),
                borderRadius: 0,
                borderTop: "none",
                borderBottom: "none",
              }}
            >
              {/* Toolbar */}
              <div
                className={`flex items-center gap-[0.45em] ${HERO_TRIAGE_PANE_GLASS_TW}`}
                style={{
                  padding: isMobile ? "0.85rem 0.95rem" : "0.52rem 0.58rem",
                  borderBottom: `1px solid ${C.divider}`,
                  color: C.navIcon,
                  ...glassPaneStyle({ borderRadius: 0, borderTop: "none", borderLeft: "none", borderRight: "none" }),
                }}
              >
                <div
                  className={`flex items-center gap-[0.35em] ${HERO_TRIAGE_PANE_GLASS_TW}`}
                  style={{
                    borderRadius: "999px",
                    padding: isMobile ? "0.38rem 0.75rem" : "0.24rem 0.48rem",
                    ...glassChipStyle(),
                  }}
                >
                  <InboxIcon mobile={isMobile} d="M4 6h16v12H4V6zm0 0 8 7 8-7" color={C.pillText} />
                  <span style={{ fontSize: isMobile ? "0.95rem" : "0.58rem", fontWeight: 500, color: C.pillText }}>
                    Inbox
                  </span>
                  <span
                    className={HERO_TRIAGE_PANE_GLASS_TW}
                    style={{
                      fontSize: isMobile ? "0.78rem" : "0.48rem",
                      fontWeight: 500,
                      color: C.badgeText,
                      borderRadius: "999px",
                      padding: "0.12em 0.45em",
                      minWidth: "1.4em",
                      textAlign: "center",
                      ...glassChipStyle({ background: HERO_TRIAGE_CHIP_GRADIENT }),
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
              <div
                className="min-h-0 flex-1 overflow-hidden"
                style={{ padding: isMobile ? "0.45rem 0.35rem" : "0.28rem 0.2rem", gap: isMobile ? "0.28rem" : "0.18rem" }}
              >
                {INBOX_ROWS.map((row) => (
                  <div key={row.id}>
                    <InboxListRow row={row} mobile={isMobile} />
                  </div>
                ))}
              </div>
            </div>

            {/* Open email — partial column, clipped by hero overflow */}
            <div className={`min-w-0 flex-1 ${HERO_TRIAGE_PANE_GLASS_TW}`} style={glassPaneStyle({ borderRadius: 0, borderTop: "none", borderBottom: "none", borderRight: "none" })}>
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
