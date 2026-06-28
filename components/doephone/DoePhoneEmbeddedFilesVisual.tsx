"use client";

import { inter, suisseIntl } from "@/lib/home/fonts";
import { CAROUSEL_MENU_UI } from "@/lib/doephone/carousel-menu-visual-styles";

const { ink: INK, accent: DOE_ORANGE, divider: DIVIDER } = CAROUSEL_MENU_UI;

const MUTED_TEXT = "#6B7280";
const BTN_BG = "#F3F4F6";
const BORDER = "#E5E7EB";

const OUTER_RADIUS = "rounded-[clamp(0.8rem,2.4vmin,0.95rem)]";
const INNER_RADIUS = "rounded-[clamp(0.45rem,1.35vmin,0.55rem)]";
const BTN_RADIUS = "rounded-[clamp(0.32rem,0.95vmin,0.4rem)]";

function TextDocIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className="shrink-0"
      style={{ width: "clamp(1.05rem,3.2vmin,1.28rem)", height: "clamp(1.05rem,3.2vmin,1.28rem)" }}
    >
      <path d="M3.5 5.5h13M3.5 10h13M3.5 14.5h8.5" stroke={DOE_ORANGE} strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function SlidersIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className="shrink-0"
      style={{ width: "clamp(0.82rem,2.5vmin,0.98rem)", height: "clamp(0.82rem,2.5vmin,0.98rem)" }}
    >
      <line x1="3" y1="7" x2="17" y2="7" stroke={INK} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="13" cy="7" r="2.25" fill="white" stroke={INK} strokeWidth="1.5" />
      <line x1="3" y1="13" x2="17" y2="13" stroke={INK} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="13" r="2.25" fill="white" stroke={INK} strokeWidth="1.5" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className="shrink-0"
      style={{ width: "clamp(0.9rem,2.75vmin,1.05rem)", height: "clamp(0.9rem,2.75vmin,1.05rem)" }}
    >
      <circle cx="10" cy="10" r="7.25" stroke={DOE_ORANGE} strokeWidth="1.45" />
      <path
        d="M2.75 10h14.5M10 2.75c2.1 2.35 2.1 12.45 0 14.5M10 2.75c-2.1 2.35-2.1 12.45 0 14.5"
        stroke={DOE_ORANGE}
        strokeWidth="1.45"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Embedded Files + Knowledge Sources panel — Agents carousel slide. */
export function DoePhoneEmbeddedFilesVisual() {
  const headingSize = "clamp(1.02rem,3.15vmin,1.22rem)";
  const bodySize = "clamp(0.88rem,2.65vmin,1.05rem)";
  const actionSize = "clamp(0.84rem,2.55vmin,1rem)";

  return (
    <div
      className={`mx-auto flex h-full w-full items-center justify-center ${suisseIntl.className}`}
      style={{ maxWidth: CAROUSEL_MENU_UI.maxWidthPhone }}
      aria-hidden
    >
      <div
        className={`w-full border bg-white ${OUTER_RADIUS}`}
        style={{
          borderColor: BORDER,
          padding:
            "clamp(1.35rem,4.4vmin,1.65rem) clamp(1.25rem,4vmin,1.55rem)",
        }}
      >
        {/* Embedded Files */}
        <p
          className="font-semibold leading-none tracking-[-0.015em] iphone-page:mb-[clamp(0.95rem,3.05vmin,1.2rem)]"
          style={{ color: INK, fontSize: headingSize, marginBottom: "clamp(0.78rem,2.45vmin,0.95rem)" }}
        >
          Embedded Files
        </p>

        <div
          className={`overflow-hidden border ${INNER_RADIUS}`}
          style={{ borderColor: BORDER }}
        >
          <div
            className="flex items-center"
            style={{
              gap: "clamp(0.55rem,1.75vmin,0.72rem)",
              padding: "clamp(0.95rem,3vmin,1.18rem) clamp(0.88rem,2.75vmin,1.05rem)",
            }}
          >
            <TextDocIcon />
            <span
              className="min-w-0 truncate font-normal leading-snug"
              style={{ color: MUTED_TEXT, fontSize: bodySize }}
            >
              Acme Client Alert Template
            </span>
          </div>

          <div className="h-px w-full" style={{ background: DIVIDER }} />

          <div
            className="flex items-center justify-between"
            style={{
              padding: "clamp(0.62rem,1.95vmin,0.78rem) clamp(0.88rem,2.75vmin,1.05rem)",
            }}
          >
            <button
              type="button"
              className={`inline-flex items-center ${BTN_RADIUS} font-medium leading-none ${inter.className}`}
              style={{
                background: BTN_BG,
                color: INK,
                fontSize: actionSize,
                gap: "clamp(0.22rem,0.7vmin,0.32rem)",
                padding: "clamp(0.38rem,1.2vmin,0.48rem) clamp(0.62rem,1.95vmin,0.78rem)",
              }}
              tabIndex={-1}
            >
              <span className="font-normal" style={{ fontSize: "clamp(0.95rem,2.85vmin,1.12rem)" }}>
                +
              </span>
              Add files
            </button>

            <button
              type="button"
              className={`ml-auto inline-flex items-center font-medium leading-none ${inter.className}`}
              style={{
                color: INK,
                fontSize: actionSize,
                gap: "clamp(0.28rem,0.85vmin,0.38rem)",
              }}
              tabIndex={-1}
            >
              <SlidersIcon />
              Manage files
            </button>
          </div>
        </div>

        {/* Knowledge Sources */}
        <p
          className="font-semibold leading-none tracking-[-0.015em] iphone-page:mb-[clamp(0.95rem,3.05vmin,1.2rem)]"
          style={{
            color: INK,
            fontSize: headingSize,
            marginTop: "clamp(1.45rem,4.5vmin,1.85rem)",
            marginBottom: "clamp(0.78rem,2.45vmin,0.95rem)",
          }}
        >
          Knowledge Sources
        </p>

        <div
          className="flex items-center"
          style={{ gap: "clamp(0.62rem,1.95vmin,0.82rem)" }}
        >
          <button
            type="button"
            className={`inline-flex items-center ${BTN_RADIUS} font-medium leading-none ${inter.className}`}
            style={{
              background: BTN_BG,
              color: INK,
              fontSize: actionSize,
              gap: "clamp(0.32rem,1vmin,0.42rem)",
              padding: "clamp(0.38rem,1.2vmin,0.48rem) clamp(0.62rem,1.95vmin,0.78rem)",
            }}
            tabIndex={-1}
          >
            <GlobeIcon />
            Web search
          </button>

          <button
            type="button"
            className={`inline-flex items-center font-medium leading-none ${inter.className}`}
            style={{
              color: INK,
              fontSize: actionSize,
              gap: "clamp(0.15rem,0.48vmin,0.22rem)",
            }}
            tabIndex={-1}
          >
            <span className="font-normal" style={{ fontSize: "clamp(0.95rem,2.85vmin,1.12rem)" }}>
              +
            </span>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
