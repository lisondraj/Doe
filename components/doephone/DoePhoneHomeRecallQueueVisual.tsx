"use client";

import { inter, suisseIntl } from "@/lib/home/fonts";
import { CAROUSEL_MENU_UI } from "@/lib/doephone/carousel-menu-visual-styles";

const { maxWidthPhone } = CAROUSEL_MENU_UI;

const QUEUE_ROWS = [
  { name: "Maria Lopez", gap: "Annual wellness", overdue: "6 mo" },
  { name: "James Chen", gap: "A1C panel", overdue: "4 mo" },
  { name: "S. Nguyen", gap: "Mammogram", overdue: "2 mo" },
] as const;

type VisualLayout = "phone" | "desktop";

/** Recall queue — overdue patients surfaced for outreach on the feature shader card. */
export function DoePhoneHomeRecallQueueVisual({ layout = "phone" }: { layout?: VisualLayout }) {
  const isDesktop = layout === "desktop";
  const maxWidth = isDesktop ? "min(100%, 30rem)" : maxWidthPhone;

  return (
    <div
      className={`home-recall-queue-visual mx-auto flex h-full w-full flex-col justify-center ${suisseIntl.className}`}
      style={{ maxWidth }}
      aria-hidden
    >
      <header className="home-recall-queue-visual__header">
        <div className="home-recall-queue-visual__header-copy">
          <p className={`home-recall-queue-visual__label ${inter.className}`}>Recall queue</p>
          <p className="home-recall-queue-visual__summary">47 patients · 3 campaigns</p>
        </div>
        <span className={`home-recall-queue-visual__badge ${inter.className}`}>Running</span>
      </header>

      <div className="home-recall-queue-visual__card">
        <ul className="home-recall-queue-visual__list">
          {QUEUE_ROWS.map((row, index) => (
            <li
              key={row.name}
              className={`home-recall-queue-visual__row${
                index === QUEUE_ROWS.length - 1 ? " home-recall-queue-visual__row--last" : ""
              }`}
            >
              <div className="home-recall-queue-visual__row-copy">
                <p className="home-recall-queue-visual__name">{row.name}</p>
                <p className={`home-recall-queue-visual__gap ${inter.className}`}>{row.gap}</p>
              </div>
              <span className={`home-recall-queue-visual__overdue ${inter.className}`}>{row.overdue}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className={`home-recall-queue-visual__footer ${inter.className}`}>Auto-priority on · highest risk first</p>
    </div>
  );
}
