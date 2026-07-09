"use client";

import { inter, suisseIntl } from "@/lib/home/fonts";

const RX = {
  patient: "Patel, M.",
  drug: "Lisinopril 10 mg",
  request: "Need my blood pressure refill called in",
  pharmacy: "CVS #4821",
  eta: "Ready today · 4:30 PM",
} as const;

const CHECKS = [
  { id: "identity", label: "Identity", detail: "DOB verified", status: "done" as const },
  { id: "active", label: "Active RX", detail: "On chart", status: "done" as const },
  { id: "coverage", label: "Coverage", detail: "Clearing", status: "active" as const },
  { id: "pharmacy", label: "Pharmacy", detail: "CVS queued", status: "upcoming" as const },
] as const;

function CheckMark({ status }: { status: (typeof CHECKS)[number]["status"] }) {
  if (status === "done") {
    return <span className="home-agents-carousel__refill-peek-check-mark home-agents-carousel__refill-peek-check-mark--done" aria-hidden>✓</span>;
  }

  if (status === "active") {
    return <span className="home-agents-carousel__refill-peek-check-mark home-agents-carousel__refill-peek-check-mark--active" aria-hidden />;
  }

  return <span className="home-agents-carousel__refill-peek-check-mark home-agents-carousel__refill-peek-check-mark--upcoming" aria-hidden />;
}

/** Agents carousel — Refill Agent live call + verification peek. */
export function HomeAgentsCarouselRefillPeek() {
  return (
    <div className="home-agents-carousel__refill-peek" aria-hidden>
      <div className={`home-agents-carousel__refill-peek-card ${suisseIntl.className}`}>
        <div className="home-agents-carousel__refill-peek-header">
          <div className="home-agents-carousel__refill-peek-header-copy">
            <span className="home-agents-carousel__refill-peek-heading">Refill Agent</span>
            <span className={`home-agents-carousel__refill-peek-subheading ${inter.className}`}>Live refill call</span>
          </div>
          <span className={`home-agents-carousel__refill-peek-live ${inter.className}`}>1:42</span>
        </div>

        <div className={`home-agents-carousel__refill-peek-call-strip ${inter.className}`}>
          <div className="home-agents-carousel__refill-peek-waveform" aria-hidden>
            {Array.from({ length: 16 }, (_, index) => (
              <span
                key={index}
                className="home-agents-carousel__refill-peek-waveform-bar"
                style={{ height: `${36 + ((index * 19) % 48)}%` }}
              />
            ))}
          </div>
          <div className="home-agents-carousel__refill-peek-call-copy">
            <span className="home-agents-carousel__refill-peek-patient">{RX.patient}</span>
            <span className="home-agents-carousel__refill-peek-request">&ldquo;{RX.request}&rdquo;</span>
          </div>
        </div>

        <div className="home-agents-carousel__refill-peek-rx-line">
          <span className="home-agents-carousel__refill-peek-drug">{RX.drug}</span>
          <span className={`home-agents-carousel__refill-peek-rx-meta ${inter.className}`}>30-day supply</span>
        </div>

        <div className="home-agents-carousel__refill-peek-checks">
          {CHECKS.map((check) => (
            <div
              key={check.id}
              className={`home-agents-carousel__refill-peek-check home-agents-carousel__refill-peek-check--${check.status}`}
            >
              <CheckMark status={check.status} />
              <div className={`home-agents-carousel__refill-peek-check-copy ${inter.className}`}>
                <span className="home-agents-carousel__refill-peek-check-label">{check.label}</span>
                <span className="home-agents-carousel__refill-peek-check-detail">{check.detail}</span>
              </div>
            </div>
          ))}
        </div>

        <p className={`home-agents-carousel__refill-peek-agent-quote ${inter.className}`}>
          &ldquo;I&apos;ll send this to {RX.pharmacy} and text you when it&apos;s ready.&rdquo;
        </p>

        <div className={`home-agents-carousel__refill-peek-footer ${inter.className}`}>
          <span className="home-agents-carousel__refill-peek-footer-pharmacy">{RX.pharmacy}</span>
          <span className="home-agents-carousel__refill-peek-footer-eta">{RX.eta}</span>
        </div>
      </div>
    </div>
  );
}
