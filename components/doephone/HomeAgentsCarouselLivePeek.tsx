"use client";

import { dmSans } from "@/lib/home/fonts";

const APPOINTMENT = {
  patient: "Martinez, L.",
  visit: "Cardiology follow-up",
  slot: "Thu 2:30p",
} as const;

const EVIDENCE_ITEMS = [
  { label: "Recent labs", value: "HbA1c trend pulled", status: "done" as const },
  { label: "Visit summary", value: "Feb cardiology note", status: "done" as const },
  { label: "Medications", value: "Reconciling 12 active", status: "active" as const, highlight: true as const },
  { label: "Prior auth", value: "PA-88214 approved", status: "done" as const },
  { label: "Imaging", value: "Chest X-ray · Mar 8", status: "pending" as const },
] as const;

const LIVE_FOCUS_INDEX = 2;

function getEvidenceSpread(rowIndex: number, isHighlighted: boolean) {
  if (isHighlighted) {
    return 0;
  }

  return Math.abs(rowIndex - LIVE_FOCUS_INDEX);
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

function EvidenceStatusIcon({ status }: { status: (typeof EVIDENCE_ITEMS)[number]["status"] }) {
  if (status === "done") {
    return (
      <span className="home-agents-carousel__live-peek-evidence-icon home-agents-carousel__live-peek-evidence-icon--done">
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
      <span className="home-agents-carousel__live-peek-evidence-icon home-agents-carousel__live-peek-evidence-icon--active">
        <svg viewBox="0 0 12 12" fill="none" aria-hidden className="home-agents-carousel__live-peek-evidence-spinner">
          <circle cx="6" cy="6" r="4.75" stroke="currentColor" strokeWidth="1.2" opacity="0.22" />
          <path d="M6 1.25a4.75 4.75 0 014.75 4.75" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </span>
    );
  }

  return <span className="home-agents-carousel__live-peek-evidence-icon home-agents-carousel__live-peek-evidence-icon--pending" />;
}

/** Agents carousel — Live Appointment call + clinical evidence peek. */
export function HomeAgentsCarouselLivePeek({ iphone = false }: { iphone?: boolean }) {
  return (
    <div className="home-agents-carousel__live-peek" aria-hidden>
      <div className={`home-agents-carousel__live-peek-card ${dmSans.className}`}>
        <div className="home-agents-carousel__live-peek-status">
          <span className="home-agents-carousel__live-peek-live-dot" aria-hidden />
          <span className="home-agents-carousel__live-peek-status-label">On call</span>
          <span className="home-agents-carousel__live-peek-status-phase">Preparing chart</span>
          <span className="home-agents-carousel__live-peek-status-time">04:12</span>
        </div>

        <div className="home-agents-carousel__live-peek-appointment">
          <span className="home-agents-carousel__live-peek-patient-name">{APPOINTMENT.patient}</span>
          <span className="home-agents-carousel__live-peek-patient-type">{APPOINTMENT.visit}</span>
          <span className="home-agents-carousel__live-peek-appointment-slot">{APPOINTMENT.slot}</span>
        </div>

        <p className="home-agents-carousel__live-peek-evidence-heading">Clinical evidence</p>

        <ul className="home-agents-carousel__live-peek-evidence-list">
          {EVIDENCE_ITEMS.map((item, rowIndex) => {
            const isHighlighted = "highlight" in item && item.highlight;
            const spread = getEvidenceSpread(rowIndex, isHighlighted);
            const blur = getPeekFadeBlur(spread);

            return (
              <li
                key={item.label}
                className={`home-agents-carousel__live-peek-evidence-row home-agents-carousel__live-peek-evidence-row--${item.status}${
                  isHighlighted ? " home-agents-carousel__live-peek-evidence-row--highlighted" : ""
                }`}
                style={{
                  opacity: getPeekFadeOpacity(spread),
                  filter: !iphone && blur > 0 ? `blur(${blur}px)` : undefined,
                }}
              >
                <EvidenceStatusIcon status={item.status} />
                <span className="home-agents-carousel__live-peek-evidence-copy">
                  <span className="home-agents-carousel__live-peek-evidence-label">{item.label}</span>
                  <span className="home-agents-carousel__live-peek-evidence-value">{item.value}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
