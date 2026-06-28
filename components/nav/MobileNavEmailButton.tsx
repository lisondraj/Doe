"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ABOUT_CONTACT_EMAIL } from "@/lib/about/about-contact";
import {
  DESKTOP_NAV_ACTION_SIZE,
  MOBILE_NAV_MAIL_BUTTON_TW,
  MOBILE_NAV_MAIL_ICON_TW,
  MOBILE_NAV_SPLIT_SHELL_TW,
} from "@/lib/subpage/mobile-nav-styles";
import {
  NAV_EMAIL_DROPDOWN_ADDRESS_TW,
  NAV_EMAIL_DROPDOWN_ATTACH_TW,
  NAV_EMAIL_DROPDOWN_BG,
  NAV_EMAIL_DROPDOWN_CHECK_TW,
  NAV_EMAIL_DROPDOWN_COPIED_TW,
  NAV_EMAIL_DROPDOWN_DIVIDER,
  NAV_EMAIL_DROPDOWN_FG,
  NAV_EMAIL_DROPDOWN_PANEL_TW,
} from "@/lib/subpage/nav-email-dropdown-styles";

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
export function MobileNavEmailButton({
  bg = NAV_EMAIL_DROPDOWN_BG,
  fg = NAV_EMAIL_DROPDOWN_FG,
  shadow = "none",
}: {
  bg?: string;
  fg?: string;
  shadow?: string;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(ABOUT_CONTACT_EMAIL);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }, []);

  useEffect(() => {
    if (!open) {
      setCopied(false);
    }
  }, [open]);

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
    <div ref={rootRef} className="relative flex shrink-0 items-center">
      <div className={MOBILE_NAV_SPLIT_SHELL_TW} style={{ boxShadow: shadow }}>
        <button
          type="button"
          className={`${MOBILE_NAV_MAIL_BUTTON_TW} transition-[opacity,background-color,color,box-shadow] duration-300`}
          style={{ backgroundColor: bg, color: fg, width: DESKTOP_NAV_ACTION_SIZE }}
          aria-expanded={open}
          aria-haspopup="dialog"
          aria-label={`Email ${ABOUT_CONTACT_EMAIL}`}
          onClick={handleToggle}
        >
          <MailIcon className={MOBILE_NAV_MAIL_ICON_TW} />
        </button>
      </div>

      {open ? (
        <div
          className={`${NAV_EMAIL_DROPDOWN_ATTACH_TW} ${NAV_EMAIL_DROPDOWN_PANEL_TW}`}
          style={{
            backgroundColor: NAV_EMAIL_DROPDOWN_BG,
            color: NAV_EMAIL_DROPDOWN_FG,
            borderColor: NAV_EMAIL_DROPDOWN_DIVIDER,
          }}
        >
          <p className={NAV_EMAIL_DROPDOWN_ADDRESS_TW}>{ABOUT_CONTACT_EMAIL}</p>

          {copied ? (
            <p className={NAV_EMAIL_DROPDOWN_COPIED_TW}>
              <CheckIcon className={NAV_EMAIL_DROPDOWN_CHECK_TW} />
              Copied to clipboard
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
