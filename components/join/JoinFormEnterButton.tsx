"use client";

import { JOIN_FORM_BEIGE } from "@/lib/join/join-form-beige";

/** Return / enter affordance — sits inside the right edge of an active field. */
export function JoinFormEnterButton({
  onClick,
  label = "Next question",
  disabled,
}: {
  onClick: () => void;
  label?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`absolute right-4 top-1/2 z-[3] flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-xl text-[1.75rem] leading-none transition-all iphone-page:right-5 iphone-page:h-[3.35rem] iphone-page:w-[3.35rem] iphone-page:rounded-[0.85rem] iphone-page:text-[1.9rem] ${
        disabled ? "cursor-not-allowed opacity-30" : "active:scale-95 hover:opacity-80"
      }`}
      style={{
        backgroundColor: JOIN_FORM_BEIGE.fieldMuted,
        color: JOIN_FORM_BEIGE.meter,
      }}
    >
      ↵
    </button>
  );
}
