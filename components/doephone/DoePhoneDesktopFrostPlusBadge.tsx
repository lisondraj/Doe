"use client";

import type { CSSProperties } from "react";

export const DESKTOP_FROST_PLUS_BADGE_SIZE = "clamp(5.25rem, 7.5vw, 6.75rem)";

const ORANGE_FROST_STYLE = {
  background: "rgba(210, 119, 76, 0.48)",
  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.38)",
} as const;

const FROST_BLUR_CLASS = "backdrop-blur-[10px]";
const EXPAND_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

const plusStyle = {
  fontSize: "clamp(2.85rem, 4vw, 3.55rem)",
  textShadow: "0 1px 8px rgba(30, 52, 58, 0.18)",
} as const;

const closeIconSize = "clamp(2.15rem, 3vw, 2.75rem)";

function PlusGlyph() {
  return (
    <span className="block font-light leading-none text-white" style={plusStyle}>
      +
    </span>
  );
}

/** Frosted orange + badge shared by desktop deployments panel and Build section. */
export function DoePhoneDesktopFrostPlusBadge({
  className = "",
  style,
  interactive = false,
  expanded = false,
  onToggle,
}: {
  className?: string;
  style?: CSSProperties;
  interactive?: boolean;
  expanded?: boolean;
  onToggle?: () => void;
}) {
  const sharedStyle = {
    width: DESKTOP_FROST_PLUS_BADGE_SIZE,
    height: DESKTOP_FROST_PLUS_BADGE_SIZE,
    ...ORANGE_FROST_STYLE,
    ...style,
  } as const;

  if (!interactive) {
    return (
      <span
        className={`pointer-events-none grid place-items-center rounded-full ${FROST_BLUR_CLASS} ${className}`.trim()}
        style={sharedStyle}
        aria-hidden
      >
        <PlusGlyph />
      </span>
    );
  }

  return (
    <button
      type="button"
      className={`grid place-items-center rounded-full ${FROST_BLUR_CLASS} ${className}`.trim()}
      style={{ ...sharedStyle, transition: `opacity 720ms ${EXPAND_EASE}` }}
      aria-label={expanded ? "Close details" : "Show details"}
      aria-expanded={expanded}
      onClick={onToggle}
    >
      {expanded ? (
        <svg
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden
          className="shrink-0"
          style={{ width: closeIconSize, height: closeIconSize }}
        >
          <path
            d="M5 5l10 10M15 5L5 15"
            stroke="white"
            strokeWidth="1.35"
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 1px 8px rgba(30, 52, 58, 0.18))" }}
          />
        </svg>
      ) : (
        <PlusGlyph />
      )}
    </button>
  );
}
