"use client";

import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";

import { ProtoGrainGradient } from "@/components/proto/ProtoGrainGradient";
import { suisseIntl } from "@/lib/home/fonts";
import { DOEPHONE_DISPLAY_WEIGHT_TW } from "@/lib/doephone/section-styles";
import { STORY_MEET_DOE_MODAL_SHADER } from "@/lib/story/story-contact-shader";
import { STORY_MEET_DOE_MODAL_BODY, STORY_MEET_DOE_MODAL_TITLE } from "@/lib/story/story-copy";
import "@/lib/doehealth/doehealth-landing.css";
import "@/lib/story/story-page.css";

const STORY_MEET_DOE_MODAL_KEY = "story-meet-doe-modal-dismissed-v3";

/** Dev toggle — always show on /story load; set false before shipping. */
const STORY_MEET_DOE_MODAL_ALWAYS_SHOW = true;

function shouldShowMeetDoeModal() {
  if (STORY_MEET_DOE_MODAL_ALWAYS_SHOW) return true;

  try {
    return sessionStorage.getItem(STORY_MEET_DOE_MODAL_KEY) !== "1";
  } catch {
    return true;
  }
}

/** First-visit welcome modal for /story — /doehealth hero dusk shader + gold headline. */
export function StoryMeetDoeModal() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    setMounted(true);
    setOpen(shouldShowMeetDoeModal());
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    if (STORY_MEET_DOE_MODAL_ALWAYS_SHOW) return;

    try {
      sessionStorage.setItem(STORY_MEET_DOE_MODAL_KEY, "1");
    } catch {
      /* ignore storage failures */
    }
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [close, open]);

  if (!mounted || !open) {
    return null;
  }

  return createPortal(
    <div className="story-meet-doe-modal fixed inset-0 z-[9999] flex items-center justify-center px-4 py-6">
      <button
        type="button"
        aria-label="Close welcome modal"
        className="story-meet-doe-modal__scrim absolute inset-0"
        onClick={close}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="story-meet-doe-title"
        aria-describedby="story-meet-doe-body"
        className="story-meet-doe-modal__panel relative z-[1]"
      >
        <div
          className="story-meet-doe-modal__backdrop"
          style={{ backgroundColor: STORY_MEET_DOE_MODAL_SHADER.colorBack }}
        >
          <ProtoGrainGradient
            static
            variant={STORY_MEET_DOE_MODAL_SHADER.variant}
            colors={STORY_MEET_DOE_MODAL_SHADER.colors}
            colorBack={STORY_MEET_DOE_MODAL_SHADER.colorBack}
            className="story-meet-doe-modal__shader absolute inset-0 h-full w-full"
            aria-hidden
          />
          <h1
            id="story-meet-doe-title"
            className={`story-meet-doe-modal__title doehealth-hero-headline ${DOEPHONE_DISPLAY_WEIGHT_TW} ${suisseIntl.className}`}
          >
            {STORY_MEET_DOE_MODAL_TITLE}
          </h1>
        </div>

        <div className="story-meet-doe-modal__copy">
          <p id="story-meet-doe-body" className={`story-meet-doe-modal__body ${suisseIntl.className}`}>
            {STORY_MEET_DOE_MODAL_BODY}
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}
