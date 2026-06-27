"use client";

import {
  DOEPHONE_COMMUNICATION_INNER_GLASS_TW,
  DOEPHONE_COMMUNICATION_OUTER_GLASS_TW,
  DOEPHONE_SHORTCUT_KEY_GRADIENT,
  DOEPHONE_SHORTCUT_PILL_GRADIENT,
} from "@/lib/doephone/communication-glass-styles";
import {
  DOEPHONE_SECTION_CAROUSEL_INSET_X,
  DOEPHONE_SECTION_FOOTER_CAROUSEL_HEIGHT,
} from "@/lib/doephone/section-styles";

export function DoePhoneCommunicationOuterGlassPanel() {
  return (
    <div className={DOEPHONE_SECTION_CAROUSEL_INSET_X} aria-hidden>
      <div
        className={`w-full ${DOEPHONE_SECTION_FOOTER_CAROUSEL_HEIGHT} ${DOEPHONE_COMMUNICATION_OUTER_GLASS_TW}`}
        style={{ background: DOEPHONE_SHORTCUT_PILL_GRADIENT }}
      />
    </div>
  );
}

export function DoePhoneCommunicationInnerGlassPanel() {
  return (
    <div className={DOEPHONE_SECTION_CAROUSEL_INSET_X} aria-label="Communication preview panel">
      <div
        className={`w-full ${DOEPHONE_SECTION_FOOTER_CAROUSEL_HEIGHT} ${DOEPHONE_COMMUNICATION_INNER_GLASS_TW}`}
        style={{ background: DOEPHONE_SHORTCUT_KEY_GRADIENT }}
      />
    </div>
  );
}
