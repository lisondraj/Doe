"use client";

import { dmSans } from "@/lib/home/fonts";

const QUEUE_ROWS = [
  {
    name: "James Chen",
    detail: "Missed Tue 9:00 AM",
    status: "Calling",
    tone: "active" as const,
  },
  {
    name: "Maria Lopez",
    detail: "Missed Mon 2:30 PM",
    status: "Queued",
    tone: "muted" as const,
  },
  {
    name: "S. Nguyen",
    detail: "Missed Fri 11:00 AM",
    status: "Booked",
    tone: "done" as const,
  },
] as const;

type VisualLayout = "phone" | "desktop";

/** No-show callback queue — voice agent rebooks missed visits on the feature shader card. */
export function DoePhoneHomeRecallQueueVisual({ layout = "phone" }: { layout?: VisualLayout }) {
  const isDesktop = layout === "desktop";

  return (
    <div
      className={`home-recall-queue-scale${isDesktop ? " home-recall-queue-scale--desktop" : ""}`}
      aria-hidden
    >
      <div className={`home-recall-queue-visual mx-auto flex h-full w-full flex-col justify-center ${dmSans.className}`}>
        <header className="home-recall-queue-visual__header">
          <p className="home-recall-queue-visual__summary">8 no-shows today</p>
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
                  <p className="home-recall-queue-visual__detail">{row.detail}</p>
                </div>
                <span className={`home-recall-queue-visual__status home-recall-queue-visual__status--${row.tone}`}>
                  {row.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
