"use client";

import { JOIN_FORM_BEIGE } from "@/lib/join/join-form-beige";

/** Minimal beige chevron — scroll between apply steps. */
export function JoinFormNavArrow({
  direction,
  disabled,
  onClick,
  label,
}: {
  direction: "up" | "down";
  disabled?: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`flex h-10 shrink-0 items-center justify-center px-2 transition-opacity iphone-page:h-11 ${
        disabled ? "cursor-not-allowed opacity-20" : "opacity-70 hover:opacity-100 active:opacity-90"
      }`}
    >
      <svg
        className="h-7 w-7 iphone-page:h-8 iphone-page:w-8"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
      >
        {direction === "up" ? (
          <path
            d="M6 14l6-6 6 6"
            stroke={JOIN_FORM_BEIGE.meter}
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M6 10l6 6 6-6"
            stroke={JOIN_FORM_BEIGE.meter}
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  );
}
