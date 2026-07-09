"use client";

import { suisseIntl } from "@/lib/home/fonts";
import { DOE_HOME_HERO_DUSK_PALETTE } from "@/lib/proto/proto-shader-backdrop-colors";

const INK = "#3D4549";
const MUTED = "#9AA3A8";
const ROW_ACTIVE = "#F6F6F4";
const BADGE_BG = "#6E8EAE";

const INBOX_ROWS = [
  { label: "New referrals", count: 24, badge: "New" as const, active: true, icon: "check" as const },
  { label: "Lab results", count: 18, icon: "person" as const },
  { label: "Prior auth", count: 12, icon: "chart" as const },
  { label: "Imaging", count: 9, icon: "calendar" as const },
] as const;

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
    </svg>
  );
}

/** Desktop agents carousel — inbox UI peek from focused Inbox Agent orb (bottom-right). */
export function HomeAgentsCarouselInboxPeek() {
  const { horizon, clay, sand } = DOE_HOME_HERO_DUSK_PALETTE;

  return (
    <div className="home-agents-carousel__inbox-peek" aria-hidden>
      <div className={`home-agents-carousel__inbox-peek-card ${suisseIntl.className}`}>
        <div
          className="home-agents-carousel__inbox-peek-logo"
          style={{
            background: `radial-gradient(circle at 32% 28%, ${sand} 0%, ${horizon} 42%, ${clay} 88%)`,
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden className="home-agents-carousel__inbox-peek-logo-mark">
            <path
              d="M7.5 16.5C9.8 13.8 11.2 11.2 12 8.5c.8 2.7 2.2 5.3 4.5 8"
              stroke="#1A1208"
              strokeWidth="1.65"
              strokeLinecap="round"
            />
            <path
              d="M9 14.8c1.5-1.8 2.5-3.6 3-5.5"
              stroke="#1A1208"
              strokeWidth="1.35"
              strokeLinecap="round"
              opacity="0.72"
            />
          </svg>
        </div>

        <p className="home-agents-carousel__inbox-peek-title">Doe Inbox</p>

        <ul className="home-agents-carousel__inbox-peek-list">
          {INBOX_ROWS.map((row) => (
            <li
              key={row.label}
              className={`home-agents-carousel__inbox-peek-row${
                row.active ? " home-agents-carousel__inbox-peek-row--active" : ""
              }`}
            >
              <RowIcon kind={row.icon} />
              <span className="home-agents-carousel__inbox-peek-label">{row.label}</span>
              {"badge" in row && row.badge ? (
                <span className="home-agents-carousel__inbox-peek-badge">{row.badge}</span>
              ) : null}
              <span className="home-agents-carousel__inbox-peek-count">{row.count}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
