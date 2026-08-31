"use client";

import { useState } from "react";

import {
  PRODUCTNEW_CLAIMS,
  PRODUCTNEW_FINANCES,
  PRODUCTNEW_PAYMENTS,
  PRODUCTNEW_STATEMENTS,
  type ProductNewClaim,
  type ProductNewClaimStatus,
} from "@/lib/productnew/productnew-copy";

type BillingTab = "overview" | "claims" | "payments" | "statements";

const BILLING_TABS: readonly { id: BillingTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "claims", label: "Claims" },
  { id: "payments", label: "Payments" },
  { id: "statements", label: "Statements" },
];

const CLAIM_STATUS_LABEL: Record<ProductNewClaimStatus, string> = {
  submitted: "Submitted",
  "in-review": "In review",
  paid: "Paid",
  denied: "Denied",
};

function formatMoney(value: number) {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function FinanceTrendChart() {
  const max = Math.max(...PRODUCTNEW_FINANCES.weekTrend);
  const points = PRODUCTNEW_FINANCES.weekTrend
    .map((v, i) => {
      const x = (i / (PRODUCTNEW_FINANCES.weekTrend.length - 1)) * 100;
      const y = 100 - (v / max) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg className="productnew-billing-trend" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden>
      <polyline points={points} fill="none" stroke="#64748b" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function OverviewTab() {
  const total = PRODUCTNEW_FINANCES.copays + PRODUCTNEW_FINANCES.insurance;

  return (
    <div className="productnew-billing-overview">
      <div className="productnew-card productnew-billing-stat">
        <p className="productnew-card__title">Collected today</p>
        <p className="productnew-stat productnew-stat--sm">{formatMoney(PRODUCTNEW_FINANCES.collected)}</p>
        <FinanceTrendChart />
      </div>

      <div className="productnew-card productnew-billing-stat">
        <p className="productnew-card__title">Outstanding</p>
        <p className="productnew-stat productnew-stat--sm">{formatMoney(PRODUCTNEW_FINANCES.outstanding)}</p>
        <p className="productnew-card__sub">across {PRODUCTNEW_STATEMENTS.length} patient statements</p>
      </div>

      <div className="productnew-card productnew-billing-stat">
        <p className="productnew-card__title">Claims pending</p>
        <p className="productnew-stat productnew-stat--sm">{formatMoney(PRODUCTNEW_FINANCES.pendingClaims)}</p>
        <p className="productnew-card__sub">{PRODUCTNEW_CLAIMS.filter((c) => c.status !== "paid").length} open claims</p>
      </div>

      <div className="productnew-card productnew-billing-split">
        <p className="productnew-card__title">Copay vs. insurance</p>
        <div className="productnew-split" style={{ marginTop: 12 }}>
          <div className="productnew-split__bar" aria-hidden>
            <div className="productnew-split__copay" style={{ width: `${(PRODUCTNEW_FINANCES.copays / total) * 100}%` }} />
            <div
              className="productnew-split__insurance"
              style={{ width: `${(PRODUCTNEW_FINANCES.insurance / total) * 100}%` }}
            />
          </div>
          <div className="productnew-split__labels">
            <span>{formatMoney(PRODUCTNEW_FINANCES.copays)} copays</span>
            <span>{formatMoney(PRODUCTNEW_FINANCES.insurance)} insurance</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ClaimRow({
  claim,
  active,
  onSelect,
}: {
  claim: ProductNewClaim;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        className={`productnew-claims-row${active ? " productnew-claims-row--active" : ""}`}
        onClick={onSelect}
      >
        <span className="productnew-claims-row__id">{claim.id}</span>
        <span className="productnew-claims-row__patient">{claim.patient}</span>
        <span className="productnew-claims-row__payer">{claim.payer}</span>
        <span className="productnew-claims-row__amount">{formatMoney(claim.amount)}</span>
        <span className={`productnew-claims-row__status productnew-claims-row__status--${claim.status}`}>
          {CLAIM_STATUS_LABEL[claim.status]}
        </span>
      </button>
    </li>
  );
}

function ClaimsTab() {
  const [selectedId, setSelectedId] = useState(PRODUCTNEW_CLAIMS[0]?.id ?? "");
  const selected = PRODUCTNEW_CLAIMS.find((c) => c.id === selectedId) ?? PRODUCTNEW_CLAIMS[0];

  return (
    <div className="productnew-claims">
      <div className="productnew-claims__list-wrap">
        <div className="productnew-claims-row productnew-claims-row--head" aria-hidden>
          <span>Claim</span>
          <span>Patient</span>
          <span>Payer</span>
          <span>Amount</span>
          <span>Status</span>
        </div>
        <ul className="productnew-claims__list">
          {PRODUCTNEW_CLAIMS.map((claim) => (
            <ClaimRow key={claim.id} claim={claim} active={claim.id === selected?.id} onSelect={() => setSelectedId(claim.id)} />
          ))}
        </ul>
      </div>

      {selected ? (
        <div className="productnew-claims__detail">
          <div className="productnew-claims__detail-head">
            <div>
              <p className="productnew-claims__detail-id">{selected.id}</p>
              <p className="productnew-claims__detail-meta">
                {selected.patient} · {selected.payer}
              </p>
            </div>
            <p className="productnew-claims__detail-amount">{formatMoney(selected.amount)}</p>
          </div>

          <ol className="productnew-history__log" style={{ marginTop: 14 }}>
            {selected.timeline.map((step, i) => (
              <li key={`${selected.id}-${i}`} className="productnew-history__log-item">
                <span className="productnew-history__log-rail" aria-hidden>
                  <span className="productnew-history__log-dot" />
                  {i < selected.timeline.length - 1 ? <span className="productnew-history__log-line" /> : null}
                </span>
                <div className="productnew-history__log-body">
                  <span className="productnew-history__log-time">{step.date}</span>
                  <p className="productnew-history__log-label">{step.label}</p>
                  {step.detail ? <p className="productnew-history__log-detail">{step.detail}</p> : null}
                </div>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </div>
  );
}

function PaymentsTab() {
  return (
    <div className="productnew-card productnew-payments">
      <div className="productnew-payments-row productnew-payments-row--head" aria-hidden>
        <span>Patient</span>
        <span>Method</span>
        <span>Note</span>
        <span>Time</span>
        <span>Amount</span>
      </div>
      <ul className="productnew-payments__list">
        {PRODUCTNEW_PAYMENTS.map((payment) => (
          <li key={payment.id} className="productnew-payments-row">
            <span className="productnew-payments-row__patient">{payment.patient}</span>
            <span className="productnew-payments-row__method">{payment.method}</span>
            <span className="productnew-payments-row__note">{payment.note}</span>
            <span className="productnew-payments-row__time">{payment.date}</span>
            <span className="productnew-payments-row__amount">{formatMoney(payment.amount)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StatementsTab() {
  return (
    <div className="productnew-card productnew-statements">
      <div className="productnew-statements-row productnew-statements-row--head" aria-hidden>
        <span>Patient</span>
        <span>Balance</span>
        <span>Days overdue</span>
        <span>Last statement</span>
        <span />
      </div>
      <ul className="productnew-statements__list">
        {PRODUCTNEW_STATEMENTS.map((statement) => (
          <li key={statement.id} className="productnew-statements-row">
            <span className="productnew-statements-row__patient">{statement.patient}</span>
            <span className="productnew-statements-row__balance">{formatMoney(statement.balance)}</span>
            <span
              className={`productnew-statements-row__overdue${statement.daysOverdue > 30 ? " productnew-statements-row__overdue--high" : ""}`}
            >
              {statement.daysOverdue} days
            </span>
            <span className="productnew-statements-row__date">{statement.lastStatement}</span>
            <button type="button" className="productnew-statements-row__action">
              Send reminder
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Billing hub: revenue overview, insurance claims with adjudication timeline, payments log, and patient statements. */
export function ProductNewBillingView() {
  const [tab, setTab] = useState<BillingTab>("overview");

  return (
    <>
      <div className="productnew-billing-head">
        <div className="productnew-billing-tabs" role="tablist">
          {BILLING_TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              className={`productnew-billing-tab${tab === item.id ? " productnew-billing-tab--active" : ""}`}
              onClick={() => setTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="productnew-billing-body">
        {tab === "overview" ? <OverviewTab /> : null}
        {tab === "claims" ? <ClaimsTab /> : null}
        {tab === "payments" ? <PaymentsTab /> : null}
        {tab === "statements" ? <StatementsTab /> : null}
      </div>
    </>
  );
}
