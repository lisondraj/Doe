"use client";

import { inter, suisseIntl } from "@/lib/home/fonts";

const BALANCE = {
  patient: "Chen",
  type: "Outstanding balance",
  amount: "$142.00",
} as const;

const CLAIM_ROWS = [
  { code: "99213", status: "paid", meta: "Mar 28" },
  { code: "80053", status: "pending", meta: "Apr 2", highlight: true as const },
  { code: "93000", status: "review", meta: "Apr 4" },
  { code: "36415", status: "queued", meta: "Apr 5" },
] as const;

function formatClaimStatus(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

/** Desktop agents carousel — Billing Agent dual-card peek. */
export function HomeAgentsCarouselBillingPeek() {
  return (
    <div className="home-agents-carousel__billing-peek" aria-hidden>
      <div className={`home-agents-carousel__billing-peek-stack ${suisseIntl.className}`}>
        <div className="home-agents-carousel__billing-peek-card home-agents-carousel__billing-peek-card--balance">
          <div className="home-agents-carousel__billing-peek-balance">
            <span className="home-agents-carousel__billing-peek-balance-name">{BALANCE.patient}</span>
            <span className="home-agents-carousel__billing-peek-balance-type">{BALANCE.type}</span>
            <span className={`home-agents-carousel__billing-peek-balance-amount ${inter.className}`}>
              {BALANCE.amount}
            </span>
          </div>
        </div>

        <div className="home-agents-carousel__billing-peek-card home-agents-carousel__billing-peek-card--claims">
          <p className="home-agents-carousel__billing-peek-claims-title">Claims</p>
          <ul className="home-agents-carousel__billing-peek-claims-list">
            {CLAIM_ROWS.map((row) => (
              <li
                key={row.code}
                className={`home-agents-carousel__billing-peek-claim${
                  "highlight" in row && row.highlight ? " home-agents-carousel__billing-peek-claim--highlighted" : ""
                }`}
              >
                <span className="home-agents-carousel__billing-peek-claim-code">{row.code}</span>
                <span className="home-agents-carousel__billing-peek-claim-status">
                  {formatClaimStatus(row.status)}
                </span>
                <span className="home-agents-carousel__billing-peek-claim-meta">{row.meta}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="home-agents-carousel__billing-peek-edge-blur" aria-hidden />
    </div>
  );
}
