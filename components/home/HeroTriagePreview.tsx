import {
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
  const pad = mobile ? "0.72rem 0.85rem" : "0.42rem 0.52rem";
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
      style={{ gap, padding: mobile ? "0.62rem 0.85rem" : "0.38rem 0.52rem" }}
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

function OpenEmailPane({ mobile }: { mobile: boolean }) {
  const titleFs = mobile ? "1.35rem" : "0.82rem";
  const bodyFs = mobile ? "1.05rem" : "0.64rem";
  const metaFs = mobile ? "0.88rem" : "0.54rem";
  const pad = mobile ? "1.35rem 1.5rem" : "0.85rem 0.95rem";

  return (
    <div
      className="flex h-full min-w-0 flex-col border-l"
      style={{ borderColor: C.divider, background: C.detailBg, padding: pad }}
    >
      <div className="flex items-center gap-[0.55em]">
        <SenderMark row={SELECTED} mobile={mobile} />
        <div className="min-w-0">
          <p style={{ fontSize: titleFs, fontWeight: 500, color: C.navActive, letterSpacing: "-0.02em" }}>
            {SELECTED.sender}
          </p>
          <p style={{ fontSize: metaFs, fontWeight: 400, color: C.detailMuted, marginTop: "0.12em" }}>
            To: Dr. Singh · Today 9:14 AM
          </p>
        </div>
      </div>

      <p
        style={{
          fontSize: titleFs,
          fontWeight: 500,
          color: C.navActive,
          marginTop: mobile ? "1.1rem" : "0.65rem",
          letterSpacing: "-0.02em",
        }}
      >
        Follow-up visit scheduling
      </p>

      <div style={{ marginTop: mobile ? "0.85rem" : "0.5rem", display: "flex", flexDirection: "column", gap: mobile ? "0.55rem" : "0.32rem" }}>
        {[
          "Hi Dr. Singh,",
          "I wanted to follow up on my chest tightness from last week. Symptoms have improved but I'd like to schedule a visit this week if possible.",
          "Please let me know what times work on your calendar.",
          "Thank you,",
          "Maria Rodriguez",
        ].map((line) => (
          <p
            key={line}
            style={{
              fontSize: bodyFs,
              fontWeight: 400,
              lineHeight: 1.48,
              color: line.startsWith("Hi") || line.startsWith("Thank") ? C.detailBody : C.detailBody,
            }}
          >
            {line}
          </p>
        ))}
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
  const navW = isMobile ? "4.6rem" : "2.85rem";
  const listW = isMobile ? "42%" : "38%";

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
      <div style={{ transform: HERO_TRIAGE_TILT[isMobile ? "mobile" : "desktop"] }}>
        <div
          className={`${HERO_TRIAGE_OUTER_GLASS_TW} ${fontClassName} overflow-hidden`}
          style={{
            borderRadius: isMobile ? "0 1.35rem 0 0" : "1.1rem",
            background: C.shell,
            border: `1px solid ${C.shellBorder}`,
            boxShadow: isMobile
              ? "0 12px 48px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.95)"
              : "0 24px 64px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.95)",
            minHeight: isMobile ? "28rem" : "16rem",
          }}
        >
          <div className="flex" style={{ minHeight: isMobile ? "32rem" : "18rem" }}>
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
              className="flex min-w-0 shrink-0 flex-col"
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
                    11
                  </span>
                </div>
                <InboxIcon mobile={isMobile} d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
                <InboxIcon mobile={isMobile} d="M12 6v6l4 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                <InboxIcon mobile={isMobile} d="M12 6h.01M12 12h.01M12 18h.01" />
              </div>

              {/* Message list */}
              <div style={{ padding: isMobile ? "0.45rem 0" : "0.28rem 0" }}>
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
