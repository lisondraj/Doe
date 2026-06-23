import {
  HERO_TRIAGE_OUTER_GLASS_TW,
  HERO_TRIAGE_PANEL_LEFT,
  HERO_TRIAGE_PANEL_RIGHT,
  HERO_TRIAGE_PANEL_WIDTH,
  HERO_TRIAGE_TILT,
} from "@/lib/home/hero-triage-preview-styles";
import type { CSSProperties } from "react";

/* ─── Light theme tokens ─── */
const L = {
  bg: "linear-gradient(145deg, rgba(252,250,248,0.97) 0%, rgba(247,244,241,0.96) 100%)",
  border: "rgba(0,0,0,0.08)",
  header: "rgba(22,18,14,0.95)",
  headerSub: "rgba(80,68,58,0.55)",
  badgeBg: "rgba(196,122,90,0.13)",
  badgeText: "#C47A5A",
  senderUnread: "rgba(22,18,14,0.92)",
  senderRead: "rgba(60,52,44,0.62)",
  subject: "rgba(22,18,14,0.80)",
  subjectRead: "rgba(80,68,58,0.52)",
  preview: "rgba(100,88,76,0.55)",
  time: "rgba(110,95,82,0.52)",
  divider: "rgba(0,0,0,0.055)",
  dot: "#C47A5A",
  tagBg: "rgba(196,122,90,0.10)",
  tagText: "#A8623E",
} as const;

/* ─── Inbox data ─── */
const EMAILS = [
  {
    sender: "Pharmacy",
    subject: "Refill — Metformin 500mg",
    preview: "Patient J. Martinez requested a 90-day refill.",
    time: "9:41 AM",
    unread: true,
    tag: "Rx",
  },
  {
    sender: "LabCorp",
    subject: "Critical: K⁺ 6.2 mEq/L",
    preview: "Patient A. Chen. Immediate review required.",
    time: "8:55 AM",
    unread: true,
    tag: "Lab",
  },
  {
    sender: "Nurse Patel",
    subject: "Room 308 — post-op stable",
    preview: "BP 122/76, HR 68. Patient requesting discharge timeline.",
    time: "8:12 AM",
    unread: false,
    tag: null,
  },
  {
    sender: "Patient Portal",
    subject: "Re: chest tightness follow-up",
    preview: "Dr. Singh, symptoms have persisted since Tuesday.",
    time: "Yesterday",
    unread: false,
    tag: null,
  },
  {
    sender: "Aetna",
    subject: "Pre-auth approved — PT #8821",
    preview: "12 sessions of physical therapy authorized.",
    time: "Yesterday",
    unread: false,
    tag: null,
  },
] as const;

/* ─── Small icons ─── */
function InboxIcon({ size }: { size: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M2 5.5h12M2 5.5l2 6h8l2-6M2 5.5 5 2h6l3 3.5"
        stroke={L.header}
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />
    </svg>
  );
}

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
    ? { sender: "1.28rem", subject: "1.12rem", preview: "0.98rem", time: "0.98rem", tag: "0.82rem" }
    : { sender: "0.82rem", subject: "0.74rem", preview: "0.68rem", time: "0.68rem", tag: "0.6rem" };

  return (
    <div>
      <div
        className="flex items-start"
        style={{ gap: mobile ? "0.75rem" : "0.5rem", padding: mobile ? "0.9rem 0" : "0.52rem 0" }}
      >
        {/* Unread dot */}
        <div
          className="shrink-0"
          style={{
            width: mobile ? "0.55rem" : "0.38rem",
            height: mobile ? "0.55rem" : "0.38rem",
            borderRadius: "50%",
            marginTop: "0.28em",
            background: email.unread ? L.dot : "transparent",
            flexShrink: 0,
          }}
        />
        <div className="min-w-0 flex-1">
          {/* Row 1 — sender + time */}
          <div className="flex items-center justify-between gap-2">
            <span
              className="truncate font-semibold"
              style={{
                fontSize: fs.sender,
                color: email.unread ? L.senderUnread : L.senderRead,
                letterSpacing: "-0.01em",
              }}
            >
              {email.sender}
            </span>
            <div className="flex shrink-0 items-center gap-[0.4em]">
              {email.tag && (
                <span
                  style={{
                    fontSize: fs.tag,
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    color: L.tagText,
                    background: L.tagBg,
                    borderRadius: "0.22em",
                    padding: "0.1em 0.38em",
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
            className="mt-[0.18em] truncate font-medium"
            style={{
              fontSize: fs.subject,
              color: email.unread ? L.subject : L.subjectRead,
              letterSpacing: "-0.01em",
            }}
          >
            {email.subject}
          </p>
          {/* Row 3 — preview */}
          <p
            className="mt-[0.12em] truncate font-normal"
            style={{ fontSize: fs.preview, color: L.preview }}
          >
            {email.preview}
          </p>
        </div>
      </div>
      {!last && (
        <div style={{ height: "1px", background: L.divider }} />
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
 * Doctor's inbox card — light frosted glass, single 3D tilt, right side
 * bleeds off screen. Intro fade applied via `.doephone-hero-triage-preview`.
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
        top: isMobile ? "45%" : "30%",
        ...(isMobile
          ? { left: HERO_TRIAGE_PANEL_LEFT.mobile }
          : { right: HERO_TRIAGE_PANEL_RIGHT.desktop }),
        width: isMobile ? HERO_TRIAGE_PANEL_WIDTH.mobile : HERO_TRIAGE_PANEL_WIDTH.desktop,
        ...style,
      }}
      aria-hidden
    >
      <div
        style={{
          transform: isMobile ? HERO_TRIAGE_TILT.mobile : HERO_TRIAGE_TILT.desktop,
          transformOrigin: isMobile ? "5% 6%" : "18% 6%",
          transformStyle: "preserve-3d",
        }}
      >
        <div
          className={`${HERO_TRIAGE_OUTER_GLASS_TW} ${fontClassName}`}
          style={{
            borderRadius: isMobile ? "1.6rem" : "1.1rem",
            background: L.bg,
            border: `1px solid ${L.border}`,
            boxShadow: isMobile
              ? "0 8px 32px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.9)"
              : "0 24px 64px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.9)",
            padding: isMobile ? "3.0rem 3.3rem 3.5rem" : "1.45rem 1.55rem 1.65rem",
          }}
        >
          {/* Inbox header */}
          <div
            className="flex items-center justify-between"
            style={{ marginBottom: isMobile ? "1.1rem" : "0.62rem" }}
          >
            <div className="flex items-center gap-[0.5em]">
              <InboxIcon size={isMobile ? "1.55rem" : "0.95rem"} />
              <span
                className="font-semibold tracking-[-0.02em]"
                style={{ fontSize: isMobile ? "1.78rem" : "0.96rem", color: L.header }}
              >
                Inbox
              </span>
              <span
                style={{
                  fontSize: isMobile ? "1.1rem" : "0.64rem",
                  fontWeight: 600,
                  color: L.badgeText,
                  background: L.badgeBg,
                  borderRadius: "0.6em",
                  padding: "0.12em 0.5em",
                }}
              >
                2
              </span>
            </div>
            <ComposeIcon size={isMobile ? "1.55rem" : "0.95rem"} />
          </div>

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
