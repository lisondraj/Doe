"use client";

import { JOIN_FORM_BEIGE } from "@/lib/join/join-form-beige";

/** Return / enter affordance — sits inside the active field on the right. */
export function JoinFormEnterButton({
  disabled,
  onClick,
  label,
}: {
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
      className={`absolute right-4 top-1/2 z-[3] flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-[0.85rem] transition-all iphone-page:right-5 iphone-page:h-[3.35rem] iphone-page:w-[3.35rem] iphone-page:rounded-[0.95rem] ${
        disabled ? "cursor-not-allowed opacity-30" : "active:scale-[0.96]"
      }`}
      style={{
        backgroundColor: JOIN_FORM_BEIGE.fieldMuted,
        color: JOIN_FORM_BEIGE.meter,
      }}
    >
      <svg
        className="h-[1.45rem] w-[1.45rem] iphone-page:h-[1.6rem] iphone-page:w-[1.6rem]"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
      >
        <path
          d="M6 9v6h7M13 15l3-3-3-3"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
