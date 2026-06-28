"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ABOUT_CONTACT_EMAIL } from "@/lib/about/about-contact";
import { dmSans, inter } from "@/lib/home/fonts";

const NAV_EMAIL_BG = "#000000";
const NAV_EMAIL_FG = "#ffffff";
const NAV_EMAIL_DIVIDER = "rgba(255, 255, 255, 0.22)";

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

/** Desktop /about nav — square email button with left-aligned copy dropdown. */
export function AboutDesktopNavEmailButton() {
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
        className="flex h-[2.625rem] w-[2.625rem] items-center justify-center rounded-md transition-opacity hover:opacity-90"
        style={{ backgroundColor: NAV_EMAIL_BG, color: NAV_EMAIL_FG }}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={`Email ${ABOUT_CONTACT_EMAIL}`}
        onClick={handleToggle}
      >
        <MailIcon className="h-[1.125rem] w-[1.125rem]" />
      </button>

      {open ? (
        <div
          className="absolute left-0 top-[calc(100%+0.5rem)] z-[60] min-w-max overflow-hidden rounded-md px-4 py-3.5"
          style={{
            backgroundColor: NAV_EMAIL_BG,
            color: NAV_EMAIL_FG,
            border: `1px solid ${NAV_EMAIL_DIVIDER}`,
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
          }}
        >
          <p
            className={`whitespace-nowrap text-[1.1875rem] font-medium tracking-[-0.02em] md:text-[1.3125rem] ${inter.className}`}
          >
            {ABOUT_CONTACT_EMAIL}
          </p>

          {copied ? (
            <p
              className={`mt-2 flex items-center gap-1.5 text-sm font-normal text-white/72 ${dmSans.className}`}
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
