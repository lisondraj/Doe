"use client";

import { inter, suisseIntl } from "@/lib/home/fonts";
import { CAROUSEL_MENU_UI } from "@/lib/doephone/carousel-menu-visual-styles";

const { maxWidthPhone } = CAROUSEL_MENU_UI;

const QUEUE_ROWS = [
  {
    name: "James Chen",
    detail: "Follow-up · missed Tue 9:00 AM",
    status: "Calling",
    tone: "active" as const,
  },
  {
    name: "Maria Lopez",
    detail: "Annual visit · missed Mon 2:30 PM",
    status: "Queued",
    tone: "muted" as const,
  },
  {
    name: "S. Nguyen",
    detail: "Lab review · missed Fri 11:00 AM",
    status: "Booked",
    tone: "done" as const,
  },
] as const;

type VisualLayout = "phone" | "desktop";

function PhoneIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="home-recall-queue-visual__phone-icon h-[0.85em] w-[0.85em] shrink-0">
      <path
        d="M4 6.5a4 4 0 018 0v2.2l1.4 1.1H2.6L4 8.7V6.5z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <path d="M6.5 12.2h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

/** No-show callback queue — voice agent rebooks missed visits on the feature shader card. */
export function DoePhoneHomeRecallQueueVisual({ layout = "phone" }: { layout?: VisualLayout }) {
  const isDesktop = layout === "desktop";
  const maxWidth = isDesktop ? "min(100%, 28rem)" : maxWidthPhone;

  return (
    <div
      className={`home-recall-queue-visual mx-auto flex h-full w-full flex-col justify-center ${suisseIntl.className}`}
      style={{ maxWidth }}
      aria-hidden
    >
      <header className="home-recall-queue-visual__header">
        <div className="home-recall-queue-visual__header-copy">
          <p className={`home-recall-queue-visual__label ${inter.className}`}>Voice callback queue</p>
          <p className="home-recall-queue-visual__summary">8 no-shows · today</p>
        </div>
        <span className={`home-recall-queue-visual__badge ${inter.className}`}>
          <PhoneIcon />
          On call
        </span>
      </header>

      <div className="home-recall-queue-visual__card">
        <ul className="home-recall-queue-visual__list">
          {QUEUE_ROWS.map((row, index) => (
            <li
              key={row.name}
              className={`home-recall-queue-visual__row${
                row.tone === "active" ? " home-recall-queue-visual__row--active" : ""
              }${index === QUEUE_ROWS.length - 1 ? " home-recall-queue-visual__row--last" : ""}`}
            >
              <div className="home-recall-queue-visual__row-copy">
                <p className="home-recall-queue-visual__name">{row.name}</p>
                <p className={`home-recall-queue-visual__detail ${inter.className}`}>{row.detail}</p>
              </div>
              <span
                className={`home-recall-queue-visual__status home-recall-queue-visual__status--${row.tone} ${inter.className}`}
              >
                {row.status}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <p className={`home-recall-queue-visual__footer ${inter.className}`}>
        Agent dials patients · openings matched automatically
      </p>
    </div>
  );
}
