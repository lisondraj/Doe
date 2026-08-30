"use client";

import { useState } from "react";

import { DoeDtcGuideView } from "@/components/doedtc/DoeDtcGuideView";
import { DoeDtcPageShell } from "@/components/doedtc/DoeDtcPageShell";
import { DoeDtcTopBar } from "@/components/doedtc/DoeDtcTopBar";
import { DOEDTC_GUIDE } from "@/lib/doedtc/doedtc-copy";
import type { DoeDtcGuideRow } from "@/lib/doedtc/doedtc-types";

type DoeDtcGuidePageClientProps = {
  token: string;
  valid: boolean;
  guide: DoeDtcGuideRow | null;
};

export function DoeDtcGuidePageClient({ token, valid, guide }: DoeDtcGuidePageClientProps) {
  const [saved, setSaved] = useState(Boolean(guide?.saved_at));
  const [busy, setBusy] = useState(false);

  if (!valid || !guide) {
    return (
      <DoeDtcPageShell>
        <div className="doedtc-card">
          <strong>{DOEDTC_GUIDE.invalidTokenTitle}</strong>
          <p>{DOEDTC_GUIDE.invalidTokenBody}</p>
        </div>
      </DoeDtcPageShell>
    );
  }

  async function saveGuide() {
    if (!guide) return;
    setBusy(true);
    try {
      const response = await fetch("/api/doedtc/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          action: "save_guide",
          payload: { guideId: guide.id },
        }),
      });
      if (!response.ok) throw new Error("Save failed");
      setSaved(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <DoeDtcPageShell>
      <DoeDtcTopBar href={`/doedtc/app?t=${encodeURIComponent(token)}`} />
      <div className="doedtc-guide__actions">
        {!saved ? (
          <button type="button" className="doedtc-button" disabled={busy} onClick={() => void saveGuide()}>
            {busy ? DOEDTC_GUIDE.savingLabel : DOEDTC_GUIDE.saveLabel}
          </button>
        ) : (
          <>
            <span className="doedtc-badge">{DOEDTC_GUIDE.savedLabel}</span>
            <a
              className="doedtc-button doedtc-button--secondary"
              href={`/doedtc/app?t=${encodeURIComponent(token)}&tab=guides&guide=${encodeURIComponent(guide.id)}`}
            >
              {DOEDTC_GUIDE.openInAppLabel}
            </a>
          </>
        )}
      </div>
      <DoeDtcGuideView guide={guide} />
    </DoeDtcPageShell>
  );
}
