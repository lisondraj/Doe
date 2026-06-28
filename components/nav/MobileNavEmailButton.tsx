"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ABOUT_CONTACT_EMAIL } from "@/lib/about/about-contact";
import { DOEPHONE_NAV_CTA_BASE } from "@/lib/doephone/waitlist-button";
import { dmSans, inter } from "@/lib/home/fonts";

const MOBILE_NAV_MAIL_BUTTON_TW = `${DOEPHONE_NAV_CTA_BASE} aspect-square !min-w-[3.35rem] !w-[3.35rem] !px-0 iphone-page:!min-w-[clamp(3.55rem,2.85rem+3.05vmin,4.3rem)] iphone-page:!w-[clamp(3.55rem,2.85rem+3.05vmin,4.3rem)]`;

function MailIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M4 7.25h16c.69 0 1.25.56 1.25 1.25v9c0 .69-.56 1.25-1.25 1.25H4c-.69 0-1.25-.56-1.25-1.25v-9c0-.69.56-1.25 1.25-1.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="m5.25 8.5 6.75 4.75L18.75 8.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className={className}>
      <path
        d="m5.5 10.25 2.75 2.75 6.25-6.75"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** iPhone nav — square email button with copy dropdown. */
export function MobileNavEmailButton() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const copyTimeoutRef = useRef<number | null>(null);

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(ABOUT_CONTACT_EMAIL);
      setCopied(true);
      if (copyTimeoutRef.current !== null) {
        window.clearTimeout(copyTimeoutRef.current);
      }
      copyTimeoutRef.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current !== null) {
        window.clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const handleToggle = useCallback(async () => {
    const nextOpen = !open;
    setOpen(nextOpen);
    if (nextOpen) {
      await copyEmail();
    }
  }, [copyEmail, open]);

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        className={`${MOBILE_NAV_MAIL_BUTTON_TW} transition-opacity hover:opacity-90 active:opacity-80`}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={`Email ${ABOUT_CONTACT_EMAIL}`}
        onClick={handleToggle}
      >
        <MailIcon className="h-[1.125rem] w-[1.125rem] iphone-page:h-[clamp(1.05rem,0.92rem+0.65vmin,1.22rem)] iphone-page:w-[clamp(1.05rem,0.92rem+0.65vmin,1.22rem)]" />
      </button>

      {open ? (
        <div className="absolute right-0 top-[calc(100%+0.5rem)] z-[60] min-w-max overflow-hidden rounded-[10px] bg-black px-4 py-3.5 text-white shadow-[0_8px_24px_rgba(0,0,0,0.12)] iphone-page:rounded-[clamp(0.68rem,0.54rem+0.48vmin,0.86rem)] iphone-page:px-[clamp(0.95rem,0.78rem+0.85vmin,1.15rem)] iphone-page:py-[clamp(0.82rem,0.65rem+0.85vmin,1.05rem)]">
          <p
            className={`whitespace-nowrap text-[1.0625rem] font-medium tracking-[-0.02em] iphone-page:text-[clamp(1.05rem,0.92rem+0.82vmin,1.22rem)] ${inter.className}`}
          >
            {ABOUT_CONTACT_EMAIL}
          </p>

          {copied ? (
            <p
              className={`mt-2 flex items-center gap-1.5 text-sm font-normal text-white/72 iphone-page:text-[clamp(0.88rem,0.78rem+0.62vmin,1rem)] ${dmSans.className}`}
            >
              <CheckIcon className="h-4 w-4 shrink-0" />
              Copied to clipboard
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
