"use client";

import { inter, suisseIntl } from "@/lib/home/fonts";
import { CAROUSEL_MENU_UI } from "@/lib/doephone/carousel-menu-visual-styles";

const { ink: INK } = CAROUSEL_MENU_UI;

const CARD = `${CAROUSEL_MENU_UI.cardRadius} ${CAROUSEL_MENU_UI.cardShell}`;

const BLUE = "#3B82F6";
const MUTED_TEXT = "rgba(30, 52, 58, 0.62)";
const BTN_BG = "#F3F4F6";
const INNER_BORDER = "#E5E7EB";

function TextDocIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
      <path d="M5 7h14M5 12h14M5 17h10" stroke={BLUE} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SlidersIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
      <path
        d="M4 6h16M4 12h16M4 18h16"
        stroke={INK}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="8" cy="6" r="2" fill={INK} />
      <circle cx="16" cy="12" r="2" fill={INK} />
      <circle cx="10" cy="18" r="2" fill={INK} />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
      <circle cx="12" cy="12" r="9" stroke={BLUE} strokeWidth="1.6" />
      <path
        d="M3 12h18M12 3c2.5 2.8 2.5 15.2 0 18M12 3c-2.5 2.8-2.5 15.2 0 18"
        stroke={BLUE}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Embedded Files + Knowledge Sources panel — Agents carousel slide. */
export function DoePhoneEmbeddedFilesVisual() {
  return (
    <div
      className={`mx-auto flex h-full w-full items-center justify-center ${suisseIntl.className}`}
      style={{ maxWidth: CAROUSEL_MENU_UI.maxWidthPhone }}
      aria-hidden
    >
      <div
        className={`${CARD} w-full`}
        style={{
          padding: "clamp(1.65rem, 5.5vmin, 2.35rem) clamp(1.55rem, 5vmin, 2.15rem)",
        }}
      >
        {/* Embedded Files */}
        <p
          className="font-semibold tracking-[-0.02em]"
          style={{ color: INK, fontSize: "clamp(1.35rem, 4.5vmin, 1.75rem)" }}
        >
          Embedded Files
        </p>

        <div
          className="mt-[clamp(0.85rem, 2.8vmin, 1.15rem)] overflow-hidden rounded-[clamp(0.75rem, 2.5vmin, 1rem)] border"
          style={{ borderColor: INNER_BORDER }}
        >
          <div
            className="flex items-center gap-[clamp(0.65rem, 2.2vmin, 0.95rem)]"
            style={{ padding: "clamp(0.95rem, 3.2vmin, 1.25rem) clamp(1rem, 3.4vmin, 1.35rem)" }}
          >
            <TextDocIcon />
            <span
              className="min-w-0 truncate font-normal"
              style={{ color: MUTED_TEXT, fontSize: "clamp(1.05rem, 3.4vmin, 1.32rem)" }}
            >
              Acme Client Alert Template
            </span>
          </div>

          <div style={{ borderTop: `1px solid ${INNER_BORDER}` }} />

          <div
            className="flex items-center justify-between gap-3"
            style={{ padding: "clamp(0.75rem, 2.5vmin, 1rem) clamp(1rem, 3.4vmin, 1.35rem)" }}
          >
            <button
              type="button"
              className={`inline-flex items-center gap-[0.38rem] rounded-[0.55rem] font-medium ${inter.className}`}
              style={{
                background: BTN_BG,
                color: INK,
                fontSize: "clamp(0.95rem, 3vmin, 1.15rem)",
                padding: "clamp(0.45rem, 1.5vmin, 0.62rem) clamp(0.75rem, 2.5vmin, 1rem)",
              }}
              tabIndex={-1}
            >
              <span style={{ fontSize: "clamp(1.05rem, 3.2vmin, 1.25rem)", lineHeight: 1 }}>+</span>
              Add files
            </button>

            <button
              type="button"
              className={`inline-flex items-center gap-[0.38rem] font-medium ${inter.className}`}
              style={{ color: INK, fontSize: "clamp(0.95rem, 3vmin, 1.15rem)" }}
              tabIndex={-1}
            >
              <SlidersIcon />
              Manage files
            </button>
          </div>
        </div>

        {/* Knowledge Sources */}
        <p
          className="mt-[clamp(1.35rem, 4.5vmin, 1.85rem)] font-semibold tracking-[-0.02em]"
          style={{ color: INK, fontSize: "clamp(1.35rem, 4.5vmin, 1.75rem)" }}
        >
          Knowledge Sources
        </p>

        <div className="mt-[clamp(0.85rem, 2.8vmin, 1.15rem)] flex items-center gap-[clamp(0.75rem, 2.5vmin, 1.05rem)]">
          <button
            type="button"
            className={`inline-flex items-center gap-[0.42rem] rounded-[0.55rem] font-medium ${inter.className}`}
            style={{
              background: BTN_BG,
              color: INK,
              fontSize: "clamp(0.95rem, 3vmin, 1.15rem)",
              padding: "clamp(0.45rem, 1.5vmin, 0.62rem) clamp(0.85rem, 2.8vmin, 1.12rem)",
            }}
            tabIndex={-1}
          >
            <GlobeIcon />
            Web search
          </button>

          <button
            type="button"
            className={`inline-flex items-center gap-[0.22rem] font-medium ${inter.className}`}
            style={{ color: INK, fontSize: "clamp(0.95rem, 3vmin, 1.15rem)" }}
            tabIndex={-1}
          >
            <span style={{ fontSize: "clamp(1.05rem, 3.2vmin, 1.25rem)", lineHeight: 1 }}>+</span>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
