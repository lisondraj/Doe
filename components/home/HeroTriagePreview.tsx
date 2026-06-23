import {
  HERO_TRIAGE_OUTER_GLASS_TW,
  HERO_TRIAGE_PANEL_ANCHOR,
  HERO_TRIAGE_PANEL_LEFT,
  HERO_TRIAGE_PANEL_RIGHT,
  HERO_TRIAGE_PANEL_WIDTH,
  HERO_TRIAGE_TILT,
} from "@/lib/home/hero-triage-preview-styles";
import type { CSSProperties } from "react";

/* ─── Light theme tokens ─── */
const L = {
  bg: "linear-gradient(160deg, rgba(253,251,249,0.98) 0%, rgba(247,244,240,0.97) 100%)",
  border: "rgba(0,0,0,0.07)",
  header: "rgba(20,16,12,0.95)",
  headerSub: "rgba(80,68,58,0.50)",
  badgeBg: "rgba(196,122,90,0.14)",
  badgeText: "#B8673C",
  senderUnread: "rgba(18,14,10,0.93)",
  senderRead: "rgba(58,48,40,0.58)",
  subject: "rgba(22,18,14,0.78)",
  subjectRead: "rgba(80,68,58,0.48)",
  preview: "rgba(100,88,76,0.52)",
  time: "rgba(120,105,90,0.50)",
  divider: "rgba(0,0,0,0.05)",
  dot: "#C47A5A",
  tagBg: "rgba(196,122,90,0.10)",
  tagText: "#A8623E",
  avatarBg: "rgba(196,122,90,0.12)",
  avatarText: "#A86040",
  searchBg: "rgba(0,0,0,0.04)",
  searchBorder: "rgba(0,0,0,0.07)",
  searchText: "rgba(100,88,76,0.50)",
  sectionLabel: "rgba(110,95,82,0.45)",
} as const;

/* ─── Inbox data ─── */
const EMAILS = [
  {
    sender: "Pharmacy",
    initials: "Rx",
    subject: "Refill — Metformin 500mg",
    preview: "Patient J. Martinez requested a 90-day refill.",
    time: "9:41 AM",
    unread: true,
    tag: "Rx",
    today: true,
  },
  {
    sender: "LabCorp",
    initials: "LC",
    subject: "Critical: K⁺ 6.2 mEq/L",
    preview: "Patient A. Chen. Immediate review required.",
    time: "8:55 AM",
    unread: true,
    tag: "Lab",
    today: true,
  },
  {
    sender: "Nurse Patel",
    initials: "NP",
    subject: "Room 308 — post-op stable",
    preview: "BP 122/76, HR 68. Patient requesting discharge timeline.",
    time: "8:12 AM",
    unread: false,
    tag: null,
    today: true,
  },
  {
    sender: "Patient Portal",
    initials: "PP",
    subject: "Re: chest tightness follow-up",
    preview: "Dr. Singh, symptoms have persisted since Tuesday.",
    time: "Yesterday",
    unread: false,
    tag: null,
    today: false,
  },
  {
    sender: "Aetna",
    initials: "AE",
    subject: "Pre-auth approved — PT #8821",
    preview: "12 sessions of physical therapy authorized.",
    time: "Yesterday",
    unread: false,
    tag: null,
    today: false,
  },
] as const;

/* ─── Icons ─── */
function ComposeIcon({ size }: { size: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M11.5 2.5 13.5 4.5l-7 7H4.5v-2l7-7Z"
        stroke={L.headerSub}
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon({ size, color }: { size: string; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden>
      <circle cx="6" cy="6" r="4" stroke={color} strokeWidth="1.2" />
      <path d="M9 9 12 12" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

/* ─── Avatar ─── */
function Avatar({ initials, size }: { initials: string; size: string }) {
  return (
    <div
      className="shrink-0 flex items-center justify-center"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: L.avatarBg,
        color: L.avatarText,
        fontWeight: 600,
        fontSize: `calc(${size} * 0.38)`,
        letterSpacing: "0.01em",
      }}
    >
      {initials}
    </div>
  );
}

/* ─── Email row ─── */
function EmailRow({
  email,
  last,
  mobile,
}: {
  email: typeof EMAILS[number];
  last: boolean;
  mobile: boolean;
}) {
  const fs = mobile
    ? { sender: "1.24rem", subject: "1.08rem", preview: "0.94rem", time: "0.94rem", tag: "0.80rem" }
    : { sender: "0.80rem", subject: "0.72rem", preview: "0.66rem", time: "0.66rem", tag: "0.58rem" };
  const avatarSize = mobile ? "2.5rem" : "1.6rem";

  return (
    <div>
      <div
        className="flex items-start"
        style={{ gap: mobile ? "0.8rem" : "0.52rem", padding: mobile ? "0.85rem 0" : "0.50rem 0" }}
      >
        {/* Avatar circle */}
        <Avatar initials={email.initials} size={avatarSize} />

        <div className="min-w-0 flex-1">
          {/* Row 1 — sender + time */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-[0.45em]">
              {email.unread && (
                <div
                  style={{
                    width: mobile ? "0.44rem" : "0.3rem",
                    height: mobile ? "0.44rem" : "0.3rem",
                    borderRadius: "50%",
                    background: L.dot,
                    flexShrink: 0,
                  }}
                />
              )}
              <span
                className="truncate"
                style={{
                  fontSize: fs.sender,
                  fontWeight: email.unread ? 600 : 500,
                  color: email.unread ? L.senderUnread : L.senderRead,
                  letterSpacing: "-0.01em",
                }}
              >
                {email.sender}
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-[0.4em]">
              {email.tag && (
                <span
                  style={{
                    fontSize: fs.tag,
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    color: L.tagText,
                    background: L.tagBg,
                    borderRadius: "0.25em",
                    padding: "0.1em 0.4em",
                  }}
                >
                  {email.tag}
                </span>
              )}
              <span style={{ fontSize: fs.time, color: L.time, fontWeight: 400 }}>
                {email.time}
              </span>
            </div>
          </div>
          {/* Row 2 — subject */}
          <p
            className="mt-[0.16em] truncate"
            style={{
              fontSize: fs.subject,
              fontWeight: email.unread ? 500 : 400,
              color: email.unread ? L.subject : L.subjectRead,
              letterSpacing: "-0.01em",
            }}
          >
            {email.subject}
          </p>
          {/* Row 3 — preview */}
          <p
            className="mt-[0.10em] truncate"
            style={{ fontSize: fs.preview, fontWeight: 400, color: L.preview }}
          >
            {email.preview}
          </p>
        </div>
      </div>
      {!last && (
        <div style={{ height: "1px", background: L.divider, marginLeft: mobile ? "3.3rem" : "2.12rem" }} />
      )}
    </div>
  );
}

/* ─── Public component ─── */
export type HeroTriagePreviewProps = {
  fontClassName: string;
  size?: "desktop" | "mobile";
  style?: CSSProperties;
  className?: string;
};

/**
 * Doctor's inbox card — light frosted glass, flat layout; bottom-right anchors
 * to the hero and is clipped by section overflow.
 */
export function HeroTriagePreview({
  fontClassName,
  size = "desktop",
  style,
  className = "",
}: HeroTriagePreviewProps) {
  const isMobile = size === "mobile";

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
          transform: HERO_TRIAGE_TILT[isMobile ? "mobile" : "desktop"],
        }}
      >
        <div
          className={`${HERO_TRIAGE_OUTER_GLASS_TW} ${fontClassName}`}
          style={{
            borderRadius: isMobile ? "1.6rem 0 0 0" : "1.1rem",
            background: L.bg,
            border: `1px solid ${L.border}`,
            boxShadow: isMobile
              ? "0 8px 32px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.9)"
              : "0 24px 64px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.9)",
            padding: isMobile ? "3.35rem 3.6rem 3.85rem" : "1.45rem 1.55rem 1.65rem",
          }}
        >
          {/* Inbox header */}
          <div
            className="flex items-center justify-between"
            style={{ marginBottom: isMobile ? "0.85rem" : "0.50rem" }}
          >
            <div className="flex items-center gap-[0.45em]">
              <span
                className="font-semibold tracking-[-0.025em]"
                style={{ fontSize: isMobile ? "2.1rem" : "1.02rem", color: L.header }}
              >
                Inbox
              </span>
              <span
                style={{
                  fontSize: isMobile ? "1.05rem" : "0.60rem",
                  fontWeight: 700,
                  color: L.badgeText,
                  background: L.badgeBg,
                  borderRadius: "0.6em",
                  padding: "0.14em 0.52em",
                }}
              >
                2
              </span>
            </div>
            <ComposeIcon size={isMobile ? "1.55rem" : "0.95rem"} />
          </div>

          {/* Search bar */}
          <div
            className="flex items-center gap-[0.5em]"
            style={{
              background: L.searchBg,
              border: `1px solid ${L.searchBorder}`,
              borderRadius: isMobile ? "0.75rem" : "0.42rem",
              padding: isMobile ? "0.7rem 0.9rem" : "0.38rem 0.52rem",
              marginBottom: isMobile ? "0.9rem" : "0.52rem",
            }}
          >
            <SearchIcon
              size={isMobile ? "1.15rem" : "0.70rem"}
              color={L.searchText}
            />
            <span style={{ fontSize: isMobile ? "1.05rem" : "0.62rem", color: L.searchText }}>
              Search messages…
            </span>
          </div>

          {/* Section label */}
          <p
            style={{
              fontSize: isMobile ? "0.88rem" : "0.54rem",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase" as const,
              color: L.sectionLabel,
              marginBottom: isMobile ? "0.35rem" : "0.18rem",
            }}
          >
            Today
          </p>

          {/* Email list */}
          <div>
            {EMAILS.map((email, i) => (
              <EmailRow
                key={email.subject}
                email={email}
                last={i === EMAILS.length - 1}
                mobile={isMobile}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** @deprecated Use HeroTriagePreview */
export const DesktopHeroTriagePreview = HeroTriagePreview;
