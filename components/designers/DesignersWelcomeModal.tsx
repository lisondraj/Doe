"use client";

import { useEffect } from "react";

import { DESIGNERS_WELCOME_COPY } from "@/lib/designers/designers-welcome-copy";
import { inter, lora, suisseIntl } from "@/lib/home/fonts";

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

function KeyboardHintTipBox() {
  return (
    <div className="designers-welcome-modal__tip-box mt-[clamp(1rem,1.35vw,1.2rem)] rounded-[0.55rem] border border-[rgba(245,230,208,0.16)] bg-[rgba(245,230,208,0.06)] px-[clamp(1rem,1.25vw,1.15rem)] py-[clamp(1rem,1.25vw,1.15rem)]">
      <p
        className={`designers-welcome-modal__ui-hint m-0 text-left text-[clamp(1.22rem,0.95rem+0.75vw,1.55rem)] font-normal leading-[1.16] tracking-[-0.024em] text-[#f5e6d0] ${suisseIntl.className}`}
      >
        Press{" "}
        <span className="inline-flex items-center gap-[0.32rem] align-middle">
          <kbd className="inline-flex h-[clamp(1.85rem,1.55rem+0.55vw,2.15rem)] min-w-[clamp(1.85rem,1.55rem+0.55vw,2.15rem)] items-center justify-center rounded-[0.36rem] border border-[rgba(245,230,208,0.24)] bg-[rgba(26,18,8,0.42)] px-[0.55rem] text-[0.78em] font-normal leading-none tracking-[0.02em] text-[#faf0d8] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            Shift
          </kbd>
          <span className="text-[rgba(245,230,208,0.46)]">+</span>
          <kbd className="inline-flex h-[clamp(1.85rem,1.55rem+0.55vw,2.15rem)] min-w-[clamp(1.85rem,1.55rem+0.55vw,2.15rem)] items-center justify-center rounded-[0.36rem] border border-[rgba(245,230,208,0.24)] bg-[rgba(26,18,8,0.42)] px-[0.55rem] text-[0.78em] font-normal leading-none tracking-[0.02em] text-[#faf0d8] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            D
          </kbd>
        </span>{" "}
        to reshow UI after hiding
      </p>
    </div>
  );
}

/** Doe brown welcome modal — shown on /designers desktop load. */
export function DesignersWelcomeModal({
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
      if (event.key === "Enter" || event.key === "Escape") {
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

  const { sectionLabel, welcome, contactLead, contactName, contactEmail, enterLabel } =
    DESIGNERS_WELCOME_COPY;

  return (
    <div className="designers-welcome-modal fixed inset-0 z-[300] flex items-center justify-center px-[clamp(1rem,2vw,1.5rem)] py-[clamp(1rem,2vh,1.5rem)]">
      <button
        type="button"
        aria-label="Close welcome modal"
        className="designers-welcome-modal__scrim absolute inset-0 bg-[rgba(26,18,8,0.52)]"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="designers-welcome-title"
        aria-describedby="designers-welcome-description"
        className="designers-welcome-modal__panel relative z-[1] flex w-full max-w-[min(100%,28rem)] flex-col rounded-[clamp(0.65rem,0.9vw,0.85rem)] border border-[rgba(245,230,208,0.18)] bg-[#1a1208] px-[clamp(1.35rem,2vw,1.85rem)] pb-[clamp(1.35rem,2vw,1.85rem)] pt-[clamp(1.15rem,1.65vw,1.45rem)] shadow-[0_24px_64px_rgba(26,18,8,0.42)]"
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="designers-welcome-modal__close absolute right-[clamp(0.85rem,1.25vw,1.05rem)] top-[clamp(0.85rem,1.25vw,1.05rem)] inline-flex h-[2.15rem] w-[2.15rem] items-center justify-center rounded-full border border-[rgba(245,230,208,0.14)] bg-[rgba(245,230,208,0.06)] text-[#f5e6d0] transition-colors duration-150 hover:bg-[rgba(245,230,208,0.12)]"
        >
          <CloseIcon />
        </button>

        <p
          id="designers-welcome-title"
          className={`designers-welcome-modal__logo m-0 pr-[2.5rem] text-left font-normal leading-none tracking-[-0.04em] text-[#f5e6d0] ${lora.className}`}
          style={{ fontSize: "clamp(2.85rem, 2rem + 2.8vw, 3.75rem)" }}
        >
          Doe
        </p>

        <p
          className={`designers-welcome-modal__label m-0 mt-[clamp(0.85rem,1.15vw,1.05rem)] text-left text-[0.72rem] font-medium uppercase leading-none tracking-[0.16em] text-[rgba(245,230,208,0.62)] ${suisseIntl.className}`}
        >
          {sectionLabel}
        </p>

        <p
          id="designers-welcome-description"
          className={`designers-welcome-modal__body m-0 mt-[clamp(0.95rem,1.25vw,1.15rem)] text-left text-[clamp(1rem,0.88rem+0.35vw,1.12rem)] font-normal leading-[1.42] tracking-[-0.012em] text-[rgba(245,230,208,0.9)] ${inter.className}`}
        >
          {welcome}
        </p>

        <KeyboardHintTipBox />

        <p
          className={`designers-welcome-modal__contact m-0 mt-[clamp(0.85rem,1.1vw,1rem)] text-left text-[clamp(0.98rem,0.86rem+0.28vw,1.08rem)] font-normal leading-[1.38] tracking-[-0.01em] text-[rgba(245,230,208,0.78)] ${inter.className}`}
        >
          {contactLead}{" "}
          <a
            href={`mailto:${contactEmail}`}
            className="text-[#f5e6d0] underline decoration-[rgba(245,230,208,0.34)] underline-offset-[0.18em] transition-colors hover:text-white hover:decoration-[rgba(245,230,208,0.72)]"
          >
            {contactName}
          </a>
          .
        </p>

        <button
          type="button"
          onClick={onClose}
          className={`designers-welcome-modal__enter mt-[clamp(1.35rem,1.75vw,1.55rem)] inline-flex min-h-[2.65rem] w-full items-center justify-center rounded-[0.45rem] border border-[rgba(26,18,8,0.1)] bg-white px-[1rem] text-[0.98rem] font-normal leading-none tracking-[-0.014em] text-[#1a1208] transition-[background-color,transform] duration-150 hover:bg-[#f7f7f5] active:scale-[0.99] ${suisseIntl.className}`}
        >
          {enterLabel}
        </button>
      </div>
    </div>
  );
}
