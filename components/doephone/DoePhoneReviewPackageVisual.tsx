"use client";

import { inter, suisseIntl } from "@/lib/home/fonts";
import { CAROUSEL_MENU_UI } from "@/lib/doephone/carousel-menu-visual-styles";

const { ink: INK } = CAROUSEL_MENU_UI;

const OUTER_RADIUS = "rounded-[clamp(1rem,2.8vmin,1.2rem)]";
const INNER_RADIUS = "rounded-[clamp(0.55rem,1.6vmin,0.7rem)]";
const CARD_PAD = "clamp(1.15rem,3.6vmin,1.4rem)";
const TITLE_SIZE = "clamp(1.28rem,3.9vmin,1.55rem)";
const ROW_SIZE = "clamp(0.92rem,2.75vmin,1.08rem)";
const BADGE_SIZE = "clamp(0.72rem,2.15vmin,0.86rem)";
const STEP_SIZE = "clamp(0.88rem,2.65vmin,1.02rem)";

const FILES = [
  { name: "Patient_Info.PDF", faded: false },
  { name: "Medications.PDF", faded: false },
  { name: "Level_of_Care.PDF", faded: true },
] as const;

function CheckIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden className="h-[0.72em] w-[0.72em] shrink-0">
      <path
        d="M2.4 6.1l2 2 5.2-5.4"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" aria-hidden className="h-[0.9em] w-[0.9em] shrink-0">
      <path
        d="M9.1 2.4l2.5 2.5-6.4 6.4H2.7V9.8L9.1 2.4z"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronUpIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" aria-hidden className="h-[0.95em] w-[0.95em]">
      <path d="M3.5 8.5L7 5l3.5 3.5" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Review package card — first home feature shader slide (agents). */
export function DoePhoneReviewPackageVisual({ layout = "phone" }: { layout?: "phone" | "desktop" }) {
  const isDesktop = layout === "desktop";

  return (
    <div
      className={`mx-auto flex h-full w-full items-center justify-center px-[clamp(0.65rem,2vmin,0.9rem)] ${suisseIntl.className}`}
      style={{ maxWidth: isDesktop ? "min(100%, 28rem)" : CAROUSEL_MENU_UI.maxWidthPhone }}
      aria-hidden
    >
      <div className="flex w-full flex-col" style={{ gap: "clamp(0.85rem,2.6vmin,1.1rem)" }}>
        <div
          className={`relative w-full bg-white ${OUTER_RADIUS}`}
          style={{
            padding: CARD_PAD,
            boxShadow: "0 18px 48px rgba(30, 52, 58, 0.14), 0 2px 8px rgba(30, 52, 58, 0.06)",
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <span
              className={`inline-flex items-center gap-[0.35em] ${inter.className} font-medium leading-none`}
              style={{
                background: "#E8F4D4",
                color: "#4A7A32",
                fontSize: BADGE_SIZE,
                padding: "0.38em 0.72em",
                borderRadius: "999px",
              }}
            >
              <CheckIcon />
              Complete
            </span>
            <span
              className="inline-flex shrink-0 items-center justify-center rounded-full"
              style={{
                width: "clamp(1.85rem,5.4vmin,2.2rem)",
                height: "clamp(1.85rem,5.4vmin,2.2rem)",
                background: "#F3F1ED",
                color: "#8A7868",
              }}
            >
              <ChevronUpIcon />
            </span>
          </div>

          <h3
            className="font-semibold leading-tight tracking-[-0.025em]"
            style={{
              color: "#5C4E42",
              fontSize: TITLE_SIZE,
              marginTop: "clamp(0.85rem,2.6vmin,1.05rem)",
            }}
          >
            Review Package
          </h3>

          <div
            className="relative"
            style={{ marginTop: "clamp(0.95rem,2.9vmin,1.2rem)" }}
          >
            <div className="flex flex-col" style={{ gap: "clamp(0.55rem,1.65vmin,0.72rem)" }}>
              {FILES.map((file) => (
                <div
                  key={file.name}
                  className={`flex items-center justify-between gap-3 ${INNER_RADIUS}`}
                  style={{
                    background: "#F7F6F3",
                    padding: "clamp(0.72rem,2.2vmin,0.9rem) clamp(0.82rem,2.5vmin,1rem)",
                    opacity: file.faded ? 0.38 : 1,
                  }}
                >
                  <span
                    className={`min-w-0 truncate ${inter.className} font-normal`}
                    style={{ color: "#8A7868", fontSize: ROW_SIZE }}
                  >
                    {file.name}
                  </span>
                  <span
                    className={`inline-flex shrink-0 items-center gap-[0.3em] ${inter.className} font-normal`}
                    style={{ color: "#B0A89C", fontSize: ROW_SIZE }}
                  >
                    <PencilIcon />
                    Edit
                  </span>
                </div>
              ))}
            </div>

            <div
              className="pointer-events-none absolute inset-x-0 bottom-0"
              style={{
                height: "clamp(3.2rem,28%,4.8rem)",
                background:
                  "linear-gradient(0deg, #FFFFFF 0%, #FFFFFF 28%, rgba(255,255,255,0.88) 58%, rgba(255,255,255,0) 100%)",
              }}
              aria-hidden
            />
          </div>
        </div>

        <div
          className={`w-full ${OUTER_RADIUS}`}
          style={{
            background: "#E8F2FA",
            padding: "clamp(0.9rem,2.75vmin,1.1rem) clamp(1rem,3vmin,1.25rem)",
          }}
        >
          <p
            className={`${inter.className} font-medium leading-snug`}
            style={{ color: INK, fontSize: STEP_SIZE }}
          >
            1. Submit Prior authorization
          </p>
        </div>
      </div>
    </div>
  );
}
