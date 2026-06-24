"use client";

import { JOIN_FORM_BEIGE } from "@/lib/join/join-form-beige";

/** Return / enter affordance — sits inside the right edge of an active text field. */
export function JoinFormEnterButton({
  onClick,
  label = "Next question",
}: {
  onClick: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="absolute right-4 top-1/2 -translate-y-1/2 select-none rounded-lg px-2.5 py-1 text-[1.35rem] leading-none transition-opacity hover:opacity-70 active:opacity-50 iphone-page:right-5 iphone-page:text-[1.5rem]"
      style={{ color: JOIN_FORM_BEIGE.meter }}
    >
      ↵
    </button>
  );
}
