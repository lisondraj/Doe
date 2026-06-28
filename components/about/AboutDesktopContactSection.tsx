"use client";

import { useCallback, useState } from "react";

import { DoePhoneSectionTitle } from "@/components/doephone/DoePhoneSectionText";
import { JoinInternTrackReveal } from "@/components/join/JoinInternTrackReveal";
import { DOEPHONE_SECTION_CAROUSEL_RADIUS } from "@/lib/doephone/section-styles";
import { inter } from "@/lib/home/fonts";
import { JOIN_FORM_BEIGE } from "@/lib/join/join-form-beige";
import {
  JOIN_DESKTOP_APPLY_CARD_HEIGHT,
  JOIN_DESKTOP_APPLY_FOOTER_PAD,
  JOIN_DESKTOP_APPLY_SCROLL_MARGIN,
  JOIN_DESKTOP_APPLY_SECTION_MIN,
  JOIN_DESKTOP_APPLY_TITLE_CARD_GAP,
  JOIN_DESKTOP_APPLY_TITLE_TOP_PAD,
  JOIN_DESKTOP_CONTENT,
  JOIN_DESKTOP_TRACK_ROW_GAP,
} from "@/lib/join/join-layout";

const ABOUT_CONTACT_EMAIL = "james@doe.care";

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

function ClipboardIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className={className}>
      <path
        d="M7.25 3.75h5.5c.69 0 1.25.56 1.25 1.25v1.25H6v-1.25c0-.69.56-1.25 1.25-1.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M6 6.25h8c.69 0 1.25.56 1.25 1.25v8.5c0 .69-.56 1.25-1.25 1.25H6c-.69 0-1.25-.56-1.25-1.25v-8.5c0-.69.56-1.25 1.25-1.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Desktop /about — contact band above footer (replaces join apply form). */
export function AboutDesktopContactSection() {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      await navigator.clipboard.writeText(ABOUT_CONTACT_EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, []);

  return (
    <section
      className={`flex w-full flex-col justify-center ${JOIN_DESKTOP_TRACK_ROW_GAP} ${JOIN_DESKTOP_APPLY_SECTION_MIN} ${JOIN_DESKTOP_APPLY_FOOTER_PAD} ${JOIN_DESKTOP_APPLY_SCROLL_MARGIN}`}
      aria-label="Contact"
    >
      <div className={`${JOIN_DESKTOP_CONTENT} ${JOIN_DESKTOP_APPLY_TITLE_TOP_PAD}`}>
        <JoinInternTrackReveal variant="desktop" className="flex w-full flex-col justify-center">
          <DoePhoneSectionTitle line1="We'd love" line2="to chat." />
        </JoinInternTrackReveal>

        <div className={`${JOIN_DESKTOP_APPLY_TITLE_CARD_GAP} w-full`}>
          <JoinInternTrackReveal variant="desktop" className="w-full">
            <div
              className={`relative w-full overflow-hidden border ${JOIN_DESKTOP_APPLY_CARD_HEIGHT} ${DOEPHONE_SECTION_CAROUSEL_RADIUS}`}
              style={{ backgroundColor: JOIN_FORM_BEIGE.field, borderColor: JOIN_FORM_BEIGE.border }}
            >
              <a
                href={`mailto:${ABOUT_CONTACT_EMAIL}`}
                className="absolute inset-0 z-[1] rounded-[inherit]"
                aria-label={`Email ${ABOUT_CONTACT_EMAIL}`}
              />

              <button
                type="button"
                onClick={handleCopy}
                className={`absolute right-7 top-7 z-[2] flex items-center gap-2 rounded-lg px-3 py-2 text-left font-medium leading-tight tracking-[-0.01em] text-[#1E343A]/72 transition-colors hover:text-[#1E343A] text-[0.9375rem] ${inter.className}`}
                style={{ backgroundColor: JOIN_FORM_BEIGE.fieldMuted }}
              >
                <ClipboardIcon className="h-4 w-4 shrink-0" />
                {copied ? "Copied" : "Copy to clipboard"}
              </button>

              <div className="pointer-events-none relative z-[1] flex h-full flex-col items-center justify-center gap-4">
                <MailIcon className="h-8 w-8 text-[#1E343A]/55" />
                <p
                  className={`font-medium tracking-[-0.01em] text-[#1E343A]/72 text-[1.3125rem] ${inter.className}`}
                >
                  {ABOUT_CONTACT_EMAIL}
                </p>
              </div>
            </div>
          </JoinInternTrackReveal>
        </div>
      </div>
    </section>
  );
}
