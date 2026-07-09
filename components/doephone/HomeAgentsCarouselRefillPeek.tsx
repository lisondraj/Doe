"use client";

import { suisseIntl } from "@/lib/home/fonts";

const RX_REQUEST = {
  drug: "Lisinopril",
  strength: "10 mg",
  type: "Refill due",
  patient: "Patel",
} as const;

/** Agents carousel — Refill Agent single-card peek. */
export function HomeAgentsCarouselRefillPeek() {
  return (
    <div className="home-agents-carousel__refill-peek" aria-hidden>
      <div className={`home-agents-carousel__refill-peek-card ${suisseIntl.className}`}>
        <div className="home-agents-carousel__refill-peek-request">
          <span className="home-agents-carousel__refill-peek-drug">{RX_REQUEST.drug}</span>
          <span className="home-agents-carousel__refill-peek-strength">{RX_REQUEST.strength}</span>
          <span className="home-agents-carousel__refill-peek-type">{RX_REQUEST.type}</span>
          <span className="home-agents-carousel__refill-peek-patient">{RX_REQUEST.patient}</span>
        </div>
      </div>
    </div>
  );
}
