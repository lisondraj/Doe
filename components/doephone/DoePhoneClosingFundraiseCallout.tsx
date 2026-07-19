"use client";

import { useCallback, useState } from "react";

import { ABOUT_CONTACT_EMAIL } from "@/lib/about/about-contact";
import { dmSans, suisseIntl } from "@/lib/home/fonts";

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

function MailOutlineIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M4 7.25h16c.69 0 1.25.56 1.25 1.25v9c0 .69-.56 1.25-1.25 1.25H4c-.69 0-1.25-.56-1.25-1.25v-9c0-.69.56-1.25 1.25-1.25Z"
        stroke="currentColor"
        strokeWidth="1.35"
      />
      <path
        d="m5.25 8.5 6.75 4.75L18.75 8.5"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Bottom-right closing note — open typographic stack, no frame. */
export function DoePhoneClosingFundraiseCallout() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(ABOUT_CONTACT_EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, []);

  return (
    <aside className="home-closing-section__fundraise" aria-label="Fundraising">
      <p className={`home-closing-section__fundraise-headline ${suisseIntl.className}`}>
        <span className="home-closing-section__fundraise-headline-line">We are actively</span>
        <span className="home-closing-section__fundraise-headline-line home-closing-section__fundraise-headline-line--accent home-closing-section__fundraise-headline-line--with-mail">
          <span className="home-closing-section__fundraise-headline-text">raising a pre-seed round.</span>
          <span className="home-closing-section__fundraise-mail-wrap">
            <button
              type="button"
              className={`home-closing-section__fundraise-mail-outline${copied ? " home-closing-section__fundraise-mail-outline--copied" : ""}`}
              onClick={handleCopyEmail}
              aria-label={copied ? `${ABOUT_CONTACT_EMAIL} copied to clipboard` : `Copy ${ABOUT_CONTACT_EMAIL} to clipboard`}
            >
              {copied ? (
                <CheckIcon className="home-closing-section__fundraise-mail-outline-icon" />
              ) : (
                <MailOutlineIcon className="home-closing-section__fundraise-mail-outline-icon" />
              )}
            </button>
            {copied ? (
              <span className={`home-closing-section__fundraise-copied ${dmSans.className}`} role="status">
                <CheckIcon className="home-closing-section__fundraise-copied-icon" aria-hidden />
                Copied to clipboard
              </span>
            ) : null}
          </span>
        </span>
      </p>
    </aside>
  );
}
