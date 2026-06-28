"use client";

import { useCallback, useState } from "react";

import { AboutContactRingsGraphic } from "@/components/about/AboutContactRingsGraphic";
import { JoinInternTrackReveal } from "@/components/join/JoinInternTrackReveal";
import { DOEPHONE_SECTION_CAROUSEL_RADIUS, DOEPHONE_SECTION_COPY_TW } from "@/lib/doephone/section-styles";
import { dmSans, inter } from "@/lib/home/fonts";
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

const ABOUT_CONTACT_ACTION_TW = `inline-flex items-center gap-2.5 rounded-xl px-4 py-3 font-medium leading-tight tracking-[-0.01em] text-[#1E343A]/72 transition-colors hover:text-[#1E343A] text-[1.0625rem] md:px-5 md:py-3.5 md:text-[1.125rem] ${inter.className}`;

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

  const handleCopy = useCallback(async () => {
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
          <p className={`${DOEPHONE_SECTION_COPY_TW} text-[#1E343A] ${dmSans.className}`}>
            <span className="block">We&apos;d love</span>
            <span className="block">to chat.</span>
          </p>
        </JoinInternTrackReveal>

        <div className={`${JOIN_DESKTOP_APPLY_TITLE_CARD_GAP} w-full`}>
          <JoinInternTrackReveal variant="desktop" className="w-full">
            <div
              className={`relative flex w-full items-center justify-center overflow-hidden border ${JOIN_DESKTOP_APPLY_CARD_HEIGHT} ${DOEPHONE_SECTION_CAROUSEL_RADIUS}`}
              style={{ backgroundColor: JOIN_FORM_BEIGE.field, borderColor: JOIN_FORM_BEIGE.border }}
            >
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[min(24%,9.5rem)]"
                aria-hidden
              >
                <AboutContactRingsGraphic />
              </div>

              <div className="relative z-10 flex flex-col items-center justify-center gap-8 md:gap-10 pb-4 md:pb-5">
                <p
                  className={`font-medium tracking-[-0.02em] text-[#1E343A]/72 text-[clamp(1.65rem,1.45vw,2.05rem)] md:text-[clamp(1.85rem,1.55vw,2.25rem)] ${inter.className}`}
                >
                  {ABOUT_CONTACT_EMAIL}
                </p>

                <div className="flex items-center justify-center gap-3 md:gap-4">
                  <a
                    href={`mailto:${ABOUT_CONTACT_EMAIL}`}
                    className={ABOUT_CONTACT_ACTION_TW}
                    style={{ backgroundColor: JOIN_FORM_BEIGE.fieldMuted }}
                    aria-label={`Email ${ABOUT_CONTACT_EMAIL}`}
                  >
                    <MailIcon className="h-5 w-5 shrink-0 md:h-6 md:w-6" />
                  </a>

                  <button
                    type="button"
                    onClick={handleCopy}
                    className={ABOUT_CONTACT_ACTION_TW}
                    style={{ backgroundColor: JOIN_FORM_BEIGE.fieldMuted }}
                  >
                    <ClipboardIcon className="h-5 w-5 shrink-0 md:h-6 md:w-6" />
                    {copied ? "Copied" : "Copy to clipboard"}
                  </button>
                </div>
              </div>
            </div>
          </JoinInternTrackReveal>
        </div>
      </div>
    </section>
  );
}
