"use client";

import { useEffect } from "react";

import {
  ABOUT_CONTACT_EMAIL,
  ABOUT_CONTACT_MAILTO,
  PREMED_LEARN_MORE_MODAL_BODY,
  PREMED_LEARN_MORE_MODAL_DISMISS_LABEL,
  PREMED_LEARN_MORE_MODAL_EMAIL_LABEL,
  PREMED_LEARN_MORE_MODAL_TITLE,
} from "@/lib/premed/premed-copy";
import { dmSans, inter, lora } from "@/lib/home/fonts";

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M4.25 4.25 13.75 13.75M13.75 4.25 4.25 13.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** /premed — opened when disabled page links are clicked. */
export function PremedLearnMoreModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      data-premed-modal
      className="fixed inset-0 z-[300] flex items-center justify-center px-[clamp(1rem,2vw,1.5rem)] py-[clamp(1rem,2vh,1.5rem)]"
    >
      <button
        type="button"
        aria-label="Close learn more modal"
        className="absolute inset-0 bg-[rgba(26,18,8,0.52)]"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="premed-learn-more-title"
        aria-describedby="premed-learn-more-description"
        className="relative z-[1] flex w-full max-w-[min(100%,28rem)] flex-col rounded-[clamp(0.65rem,0.9vw,0.85rem)] border border-[rgba(245,230,208,0.18)] bg-[#1a1208] px-[clamp(1.35rem,2vw,1.85rem)] pb-[clamp(1.35rem,2vw,1.85rem)] pt-[clamp(1.15rem,1.65vw,1.45rem)] shadow-[0_24px_64px_rgba(26,18,8,0.42)]"
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-[clamp(0.85rem,1.25vw,1.05rem)] top-[clamp(0.85rem,1.25vw,1.05rem)] inline-flex h-[2.15rem] w-[2.15rem] items-center justify-center rounded-full border border-[rgba(245,230,208,0.14)] bg-[rgba(245,230,208,0.06)] text-[#f5e6d0] transition-colors duration-150 hover:bg-[rgba(245,230,208,0.12)]"
        >
          <CloseIcon />
        </button>

        <p
          id="premed-learn-more-title"
          className={`m-0 pr-[2.5rem] text-left font-normal leading-none tracking-[-0.04em] text-[#f5e6d0] ${lora.className}`}
          style={{ fontSize: "clamp(2.35rem, 1.75rem + 2.2vw, 3.1rem)" }}
        >
          {PREMED_LEARN_MORE_MODAL_TITLE}
        </p>

        <p
          id="premed-learn-more-description"
          className={`m-0 mt-[clamp(0.95rem,1.25vw,1.15rem)] text-left text-[clamp(1rem,0.88rem+0.35vw,1.12rem)] font-normal leading-[1.42] tracking-[-0.012em] text-[rgba(245,230,208,0.9)] ${inter.className}`}
        >
          {PREMED_LEARN_MORE_MODAL_BODY}
        </p>

        <a
          href={ABOUT_CONTACT_MAILTO}
          className={`mt-[clamp(1.35rem,1.75vw,1.55rem)] inline-flex min-h-[2.65rem] w-full items-center justify-center rounded-[0.45rem] border border-[rgba(26,18,8,0.1)] bg-white px-[1rem] text-[0.98rem] font-normal leading-none tracking-[-0.014em] text-[#1a1208] transition-[background-color,transform] duration-150 hover:bg-[#f7f7f5] active:scale-[0.99] ${dmSans.className}`}
        >
          {PREMED_LEARN_MORE_MODAL_EMAIL_LABEL}
        </a>

        <p
          className={`m-0 mt-[clamp(0.85rem,1.1vw,1rem)] text-center text-[clamp(0.92rem,0.84rem+0.22vw,1rem)] font-normal leading-[1.38] tracking-[-0.01em] text-[rgba(245,230,208,0.72)] ${inter.className}`}
        >
          <a
            href={ABOUT_CONTACT_MAILTO}
            className="text-[#f5e6d0] underline decoration-[rgba(245,230,208,0.34)] underline-offset-[0.18em] transition-colors hover:text-white hover:decoration-[rgba(245,230,208,0.72)]"
          >
            {ABOUT_CONTACT_EMAIL}
          </a>
        </p>

        <button
          type="button"
          onClick={onClose}
          className={`mt-[clamp(0.85rem,1.1vw,1rem)] inline-flex min-h-[2.35rem] w-full items-center justify-center rounded-[0.45rem] border border-[rgba(245,230,208,0.14)] bg-transparent px-[1rem] text-[0.92rem] font-normal leading-none tracking-[-0.014em] text-[rgba(245,230,208,0.82)] transition-colors duration-150 hover:bg-[rgba(245,230,208,0.06)] ${dmSans.className}`}
        >
          {PREMED_LEARN_MORE_MODAL_DISMISS_LABEL}
        </button>
      </div>
    </div>
  );
}
