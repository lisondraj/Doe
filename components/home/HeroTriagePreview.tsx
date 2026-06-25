import {
  HERO_TRIAGE_MOBILE_LIST_WIDTH,
  HERO_TRIAGE_MOBILE_MIN_HEIGHT,
  HERO_TRIAGE_MOBILE_SCALE,
  HERO_TRIAGE_PANEL_ANCHOR,
  HERO_TRIAGE_PANEL_LEFT,
  HERO_TRIAGE_PANEL_RIGHT,
  HERO_TRIAGE_PANEL_WIDTH,
  HERO_TRIAGE_TILT,
} from "@/lib/home/hero-triage-preview-styles";
import { getHeroTriageThemeConfig, JOIN_MOBILE_HERO_TRIAGE_PANEL, type HeroTriageTheme, type HeroTriageThemeConfig } from "@/lib/home/hero-triage-theme";
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
    preview: "Lipid + HbA1c ready for T. Brooks",
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

function InboxIcon({
  d,
  mobile,
  color,
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
  return (
    <div
      className={`flex shrink-0 items-center justify-center font-medium ${config.paneGlassTw}`}
      style={{
        width: sz,
        height: sz,
        borderRadius: "50%",
        background: useFlatSelectedMark ? "rgba(255,255,255,0.14)" : row.iconBg,
        color: useFlatSelectedMark ? "#FFFFFF" : row.iconColor,
        fontSize: joinCompact ? "0.48rem" : mobile ? "0.82rem" : "0.52rem",
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
  const pad = joinCompact ? "0.52rem 0.46rem" : mobile ? "0.62rem 0.9rem" : "0.42rem 0.52rem";
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
                  initials: msg.from === "Dr. Singh" ? "DS" : "MR",
                  iconBg: msg.from === "Dr. Singh" ? "rgba(231,169,68,0.17)" : SELECTED.iconBg,
                  iconColor: msg.from === "Dr. Singh" ? "rgba(255,240,215,0.88)" : SELECTED.iconColor,
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

export type HeroTriagePreviewProps = {
  fontClassName: string;
  size?: "desktop" | "mobile";
  theme?: HeroTriageTheme;
  layout?: "full" | "simple";
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
  desktopScale = 1,
  mobileScale,
  mobileAnchor = "default",
  style,
  className = "",
}: HeroTriagePreviewProps) {
  const isMobile = size === "mobile";
  const isSimple = layout === "simple";
  const isJoinMobile = isMobile && mobileAnchor === "join";
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
          className={`${config.outerGlassTw} ${fontClassName} overflow-hidden`}
          style={{
            borderRadius: isJoinMobile ? "0 0 1rem 1rem" : theme === "light" ? "1rem" : isMobile ? "1.35rem" : "1.1rem",
            background: config.shellGradient,
            ...(isJoinMobile ? { width: JOIN_MOBILE_HERO_TRIAGE_PANEL.panelWidth } : {}),
            ...(theme === "light"
              ? {}
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
              minHeight: isMobile ? mobileInnerMinHeight : isSimple ? "24rem" : "18rem",
              background: config.innerGradient,
            }}
          >
            {/* Collapsed vertical nav — icons only */}
            <nav
              className={`flex shrink-0 flex-col items-center ${config.paneGlassTw}`}
              style={{
                width: navW,
                borderRight: isSimple ? "none" : `1px solid ${colors.divider}`,
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
                <InboxIcon mobile={navIconMobile} d="M4 6h16v12H4V6zm0 0 8 7 8-7" color={colors.navIcon} />
              </NavIcon>
              {isSimple ? null : (
                <>
                  <NavIcon mobile={isMobile} config={config}>
                    <InboxIcon mobile={isMobile} d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" color={colors.navIcon} />
                  </NavIcon>
                  <NavIcon mobile={isMobile} config={config}>
                    <InboxIcon mobile={isMobile} d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7M3 7l9 6 9-6M3 7h18" color={colors.navIcon} />
                  </NavIcon>
                  <NavIcon mobile={isMobile} config={config}>
                    <InboxIcon mobile={isMobile} d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2z" color={colors.navIcon} />
                  </NavIcon>
                  <div className="flex-1" />
                  <NavIcon mobile={isMobile} config={config}>
                    <InboxIcon mobile={isMobile} d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm7.5-9.5a8.38 8.38 0 0 1 0 11M4.5 5.5a8.38 8.38 0 0 0 0 11" color={colors.navIcon} />
                  </NavIcon>
                </>
              )}
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
                  <InboxIcon mobile={navIconMobile} d="M4 6h16v12H4V6zm0 0 8 7 8-7" color={isSimple ? "#D2774C" : colors.pillText} />
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
                    <InboxIcon mobile={isMobile} d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" color={colors.navIcon} />
                    <InboxIcon mobile={isMobile} d="M12 6v6l4 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" color={colors.navIcon} />
                    <InboxIcon mobile={isMobile} d="M12 6h.01M12 12h.01M12 18h.01" color={colors.navIcon} />
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
          </div>
        </div>
      </div>
    </div>
  );
}

/** @deprecated Use HeroTriagePreview */
export const DesktopHeroTriagePreview = HeroTriagePreview;
