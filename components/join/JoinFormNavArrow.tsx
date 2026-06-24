"use client";

import { JOIN_FORM_BEIGE } from "@/lib/join/join-form-beige";

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
      className={`mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full border transition-all iphone-page:h-[3.35rem] iphone-page:w-[3.35rem] ${
        disabled
          ? "cursor-not-allowed opacity-25"
          : "hover:border-[#B5AA9C] active:scale-[0.96]"
      }`}
      style={{
        backgroundColor: JOIN_FORM_BEIGE.field,
        borderColor: JOIN_FORM_BEIGE.border,
      }}
    >
      <svg
        className="h-[1.35rem] w-[1.35rem] iphone-page:h-6 iphone-page:w-6"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
      >
        {direction === "up" ? (
          <path
            d="M7.5 15l4.5-4.5L16.5 15"
            stroke={JOIN_FORM_BEIGE.ink}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M7.5 9l4.5 4.5L16.5 9"
            stroke={JOIN_FORM_BEIGE.ink}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  );
}
