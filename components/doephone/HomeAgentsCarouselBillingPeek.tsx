"use client";

import { dmSans } from "@/lib/home/fonts";

const BALANCE = {
  patient: "Chen",
  type: "Outstanding balance",
  amount: "$142.00",
} as const;

const CLAIM_ROWS = [
  { code: "99213", label: "Office visit", status: "done" as const, meta: "Paid · Mar 28" },
  { code: "80053", label: "Lab panel", status: "active" as const, meta: "Pending", highlight: true as const },
  { code: "93000", label: "EKG", status: "pending" as const, meta: "Review · Apr 4" },
  { code: "36415", label: "Venipuncture", status: "pending" as const, meta: "Queued · Apr 5" },
] as const;

const CLAIMS_FOCUS_INDEX = 1;

function getClaimSpread(rowIndex: number, isHighlighted: boolean) {
  if (isHighlighted) {
    return 0;
  }

  return Math.abs(rowIndex - CLAIMS_FOCUS_INDEX);
}

function getPeekFadeOpacity(spread: number) {
  if (spread === 0) {
    return 1;
  }

  return Math.max(0.55, 1 - spread * 0.1);
}

function getPeekFadeBlur(spread: number) {
  if (spread === 0) {
    return 0;
  }

  return Math.min(1.3, spread * 0.4);
}

function ClaimStatusIcon({ status }: { status: (typeof CLAIM_ROWS)[number]["status"] }) {
  if (status === "done") {
    return (
      <span className="home-agents-carousel__billing-peek-claim-icon home-agents-carousel__billing-peek-claim-icon--done">
        <svg viewBox="0 0 12 12" fill="none" aria-hidden>
          <path
            d="M3.1 6.1l1.9 1.9 4-4.1"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }

  if (status === "active") {
    return (
      <span className="home-agents-carousel__billing-peek-claim-icon home-agents-carousel__billing-peek-claim-icon--active">
        <svg viewBox="0 0 12 12" fill="none" aria-hidden className="home-agents-carousel__billing-peek-claim-spinner">
          <circle cx="6" cy="6" r="4.75" stroke="currentColor" strokeWidth="1.2" opacity="0.22" />
          <path d="M6 1.25a4.75 4.75 0 014.75 4.75" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </span>
    );
  }

  return <span className="home-agents-carousel__billing-peek-claim-icon home-agents-carousel__billing-peek-claim-icon--pending" />;
}

/** Desktop agents carousel — Billing Agent dual-card peek. */
export function HomeAgentsCarouselBillingPeek() {
  return (
    <div className="home-agents-carousel__billing-peek" aria-hidden>
      <div className={`home-agents-carousel__billing-peek-stack ${dmSans.className}`}>
        <div className="home-agents-carousel__billing-peek-card home-agents-carousel__billing-peek-card--balance">
          <div className="home-agents-carousel__billing-peek-balance">
            <span className="home-agents-carousel__billing-peek-balance-name">{BALANCE.patient}</span>
            <span className="home-agents-carousel__billing-peek-balance-type">{BALANCE.type}</span>
            <span className="home-agents-carousel__billing-peek-balance-amount">
              {BALANCE.amount}
            </span>
          </div>
        </div>

        <div className="home-agents-carousel__billing-peek-card home-agents-carousel__billing-peek-card--claims">
          <div className="home-agents-carousel__billing-peek-claims-status">
            <span className="home-agents-carousel__billing-peek-live-dot" aria-hidden />
            <span className="home-agents-carousel__billing-peek-claims-status-label">Calling payer</span>
            <span className="home-agents-carousel__billing-peek-claims-status-detail">80053 · Lab panel</span>
            <span className="home-agents-carousel__billing-peek-claims-status-time">Live</span>
          </div>

          <p className="home-agents-carousel__billing-peek-claims-heading">Claims</p>

          <ul className="home-agents-carousel__billing-peek-claims-list">
            {CLAIM_ROWS.map((row, rowIndex) => {
              const isHighlighted = "highlight" in row && row.highlight;
              const spread = getClaimSpread(rowIndex, isHighlighted);
              const blur = getPeekFadeBlur(spread);

              return (
                <li
                  key={row.code}
                  className={`home-agents-carousel__billing-peek-claim-row home-agents-carousel__billing-peek-claim-row--${row.status}${
                    isHighlighted ? " home-agents-carousel__billing-peek-claim-row--highlighted" : ""
                  }`}
                  style={{
                    opacity: getPeekFadeOpacity(spread),
                    filter: blur > 0 ? `blur(${blur}px)` : undefined,
                  }}
                >
                  <ClaimStatusIcon status={row.status} />
                  <span className="home-agents-carousel__billing-peek-claim-copy">
                    <span className="home-agents-carousel__billing-peek-claim-label">
                      {row.code} · {row.label}
                    </span>
                    <span className="home-agents-carousel__billing-peek-claim-meta">{row.meta}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="home-agents-carousel__billing-peek-edge-blur" aria-hidden />
      </div>
    </div>
  );
}
