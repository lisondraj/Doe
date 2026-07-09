"use client";

import { suisseIntl } from "@/lib/home/fonts";

const INK = "#3D4549";
const MUTED = "#9AA3A8";
const BADGE_BG = "#6E8EAE";

const INBOX_ROWS = [
  { label: "New referrals", count: 24, badge: "New" as const, active: true, icon: "check" as const },
  { label: "Re-admits", count: 13, icon: "person" as const },
  { label: "Lab results", count: 18, icon: "labs" as const },
  { label: "Prior auth", count: 12, icon: "chart" as const },
  { label: "Imaging", count: 9, icon: "calendar" as const },
  { label: "Patient intake", count: 7, icon: "intake" as const },
  { label: "Insurance EOB", count: 5, icon: "billing" as const },
] as const;

const INBOX_CLEAR_ROW_COUNT = 3;

function getInboxRowSpread(rowIndex: number) {
  if (rowIndex < INBOX_CLEAR_ROW_COUNT) {
    return 0;
  }

  return rowIndex - (INBOX_CLEAR_ROW_COUNT - 1);
}

function getPeekFadeOpacity(spread: number) {
  if (spread === 0) {
    return 1;
  }

  return Math.max(0.58, 1 - spread * 0.1);
}

function getPeekFadeBlur(spread: number) {
  if (spread === 0) {
    return 0;
  }

  return Math.min(1.4, spread * 0.42);
}

function RowIcon({ kind }: { kind: (typeof INBOX_ROWS)[number]["icon"] }) {
  const stroke = INK;
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className="h-[1.05rem] w-[1.05rem] shrink-0 opacity-80">
      {kind === "check" && (
        <>
          <rect x="3.5" y="3.5" width="13" height="13" rx="2.25" stroke={stroke} strokeWidth="1.35" />
          <path d="M6.5 10.2l2.1 2.1 4.4-4.6" stroke={stroke} strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      {kind === "person" && (
        <>
          <circle cx="10" cy="7.25" r="2.45" stroke={stroke} strokeWidth="1.35" />
          <path d="M5.25 15.75c.85-2.45 2.65-3.75 4.75-3.75s3.9 1.3 4.75 3.75" stroke={stroke} strokeWidth="1.35" strokeLinecap="round" />
        </>
      )}
      {kind === "chart" && (
        <>
          <path d="M5.5 4.5h9v11h-9z" stroke={stroke} strokeWidth="1.35" strokeLinejoin="round" />
          <path d="M7.5 12.5V9.5M10 12.5V8M12.5 12.5v-2" stroke={stroke} strokeWidth="1.35" strokeLinecap="round" />
        </>
      )}
      {kind === "calendar" && (
        <>
          <rect x="4.5" y="5.5" width="11" height="10" rx="1.5" stroke={stroke} strokeWidth="1.35" />
          <path d="M4.5 8.5h11M7.25 4v2.25M12.75 4v2.25" stroke={stroke} strokeWidth="1.35" strokeLinecap="round" />
        </>
      )}
      {kind === "labs" && (
        <>
          <path d="M8 2.5h4" stroke={stroke} strokeWidth="1.35" strokeLinecap="round" />
          <path
            d="M7.5 4.5h5l-1.1 10.2c0 .85-.75 1.5-1.65 1.5h-.7c-.9 0-1.65-.65-1.65-1.5L7.5 4.5z"
            stroke={stroke}
            strokeWidth="1.35"
            strokeLinejoin="round"
          />
        </>
      )}
      {kind === "intake" && (
        <>
          <path d="M5 4.5h10v11H5V4.5z" stroke={stroke} strokeWidth="1.35" strokeLinejoin="round" />
          <path d="M7.5 8h5M7.5 10.5h5M7.5 13h3.5" stroke={stroke} strokeWidth="1.35" strokeLinecap="round" />
        </>
      )}
      {kind === "billing" && (
        <>
          <path d="M5 4.5h10v11H5V4.5z" stroke={stroke} strokeWidth="1.35" strokeLinejoin="round" />
          <path d="M7.5 8h5M7.5 10.5h3.5" stroke={stroke} strokeWidth="1.35" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

/** Desktop agents carousel — inbox UI peek from focused Inbox Agent orb (bottom-right). */
export function HomeAgentsCarouselInboxPeek() {
  return (
    <div className="home-agents-carousel__inbox-peek" aria-hidden>
      <div className={`home-agents-carousel__inbox-peek-card ${suisseIntl.className}`}>
        <div
          className="home-agents-carousel__inbox-peek-logo bg-gradient-to-br from-[#E7A944] via-[#D2774C] to-[#1E343A]"
          aria-hidden
        />

        <p
          className="home-agents-carousel__inbox-peek-title"
          style={{ opacity: 1, filter: "none" }}
        >
          Inbox
        </p>

        <ul className="home-agents-carousel__inbox-peek-list">
          {INBOX_ROWS.map((row, rowIndex) => {
            const spread = getInboxRowSpread(rowIndex);
            const blur = getPeekFadeBlur(spread);

            return (
            <li
              key={row.label}
              className={`home-agents-carousel__inbox-peek-row${
                row.active ? " home-agents-carousel__inbox-peek-row--active" : ""
              }`}
              style={{
                opacity: getPeekFadeOpacity(spread),
                filter: blur > 0 ? `blur(${blur}px)` : undefined,
              }}
            >
              <RowIcon kind={row.icon} />
              <span className="home-agents-carousel__inbox-peek-label-block">
                <span className="home-agents-carousel__inbox-peek-label">{row.label}</span>
                <span className="home-agents-carousel__inbox-peek-count">{row.count}</span>
                {"badge" in row && row.badge ? (
                  <span className="home-agents-carousel__inbox-peek-badge">{row.badge}</span>
                ) : null}
              </span>
            </li>
            );
          })}
        </ul>

        <div
          className="home-agents-carousel__inbox-peek-footer"
          style={{
            opacity: getPeekFadeOpacity(2),
            filter: getPeekFadeBlur(2) > 0 ? `blur(${getPeekFadeBlur(2)}px)` : undefined,
          }}
        >
          <span className="home-agents-carousel__inbox-peek-footer-stat">142 routed today</span>
          <span className="home-agents-carousel__inbox-peek-footer-pill">Auto-sort on</span>
        </div>
      </div>
    </div>
  );
}
