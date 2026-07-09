"use client";

import { inter, suisseIntl } from "@/lib/home/fonts";

const RX_REQUEST = {
  ticket: "RX-4821",
  drug: "Lisinopril 10 mg",
  patient: "Patel, M.",
  supply: "30-day supply",
  pharmacy: "CVS Pharmacy #4821",
  eta: "Today · 4:30 PM",
} as const;

const LEDGER_ROWS = [
  { label: "Request received", status: "done" as const },
  { label: "Coverage cleared", status: "active" as const },
  { label: "Send to pharmacy", status: "upcoming" as const },
] as const;

function LedgerMark({ status }: { status: (typeof LEDGER_ROWS)[number]["status"] }) {
  if (status === "done") {
    return (
      <span className="home-agents-carousel__refill-peek-mark home-agents-carousel__refill-peek-mark--done" aria-hidden>
        ✓
      </span>
    );
  }

  if (status === "active") {
    return <span className="home-agents-carousel__refill-peek-mark home-agents-carousel__refill-peek-mark--active" aria-hidden />;
  }

  return <span className="home-agents-carousel__refill-peek-mark home-agents-carousel__refill-peek-mark--upcoming" aria-hidden />;
}

/** Agents carousel — Refill Agent pharmacy ticket peek. */
export function HomeAgentsCarouselRefillPeek() {
  return (
    <div className="home-agents-carousel__refill-peek" aria-hidden>
      <div className={`home-agents-carousel__refill-peek-card ${suisseIntl.className}`}>
        <div className="home-agents-carousel__refill-peek-header">
          <span className={`home-agents-carousel__refill-peek-ticket ${inter.className}`}>{RX_REQUEST.ticket}</span>
          <span className="home-agents-carousel__refill-peek-status-pill">In progress</span>
        </div>

        <div className="home-agents-carousel__refill-peek-rx-block">
          <span className="home-agents-carousel__refill-peek-drug">{RX_REQUEST.drug}</span>
          <span className={`home-agents-carousel__refill-peek-meta ${inter.className}`}>
            {RX_REQUEST.patient} · {RX_REQUEST.supply}
          </span>
        </div>

        <ul className="home-agents-carousel__refill-peek-ledger">
          {LEDGER_ROWS.map((row) => (
            <li
              key={row.label}
              className={`home-agents-carousel__refill-peek-ledger-row home-agents-carousel__refill-peek-ledger-row--${row.status}`}
            >
              <LedgerMark status={row.status} />
              <span className={`home-agents-carousel__refill-peek-ledger-label ${inter.className}`}>{row.label}</span>
            </li>
          ))}
        </ul>

        <div className={`home-agents-carousel__refill-peek-footer ${inter.className}`}>
          <span className="home-agents-carousel__refill-peek-footer-pharmacy">{RX_REQUEST.pharmacy}</span>
          <span className="home-agents-carousel__refill-peek-footer-eta">Est. ready · {RX_REQUEST.eta}</span>
        </div>
      </div>
    </div>
  );
}
