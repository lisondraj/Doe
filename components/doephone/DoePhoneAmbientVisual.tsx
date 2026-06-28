"use client";

import {
  DoePhoneAmbientPromptCard,
  PatientPromptTag,
} from "@/components/doephone/DoePhoneAmbientPromptCard";
import { CAROUSEL_MENU_UI } from "@/lib/doephone/carousel-menu-visual-styles";
import { suisseIntl } from "@/lib/home/fonts";

/** Ambient clinical AI prompt — Ambient carousel slide. */
export function DoePhoneAmbientVisual() {
  return (
    <div
      className={`mx-auto flex h-full w-full items-center justify-center ${suisseIntl.className}`}
      style={{ maxWidth: CAROUSEL_MENU_UI.maxWidthPhone }}
      aria-hidden
    >
      <DoePhoneAmbientPromptCard headerLabel="Patient chart" layout="carousel" toolIcons="chart">
        Show me
        <PatientPromptTag label="Sarah Nguyen" />
        HBA1C trend over the last year, medication dose changes on same graph
      </DoePhoneAmbientPromptCard>
    </div>
  );
}
