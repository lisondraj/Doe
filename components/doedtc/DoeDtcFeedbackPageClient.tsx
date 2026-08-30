"use client";

import { useCallback, useEffect, useState } from "react";

import { DoeDtcFeedbackView } from "@/components/doedtc/DoeDtcFeedbackView";
import { DoeDtcPageShell } from "@/components/doedtc/DoeDtcPageShell";
import { DoeDtcTopBar } from "@/components/doedtc/DoeDtcTopBar";
import { DOEDTC_FEEDBACK } from "@/lib/doedtc/doedtc-copy";
import type { DoeDtcProfileSnapshot, DoeDtcTicketKind } from "@/lib/doedtc/doedtc-types";
import { dmSans } from "@/lib/home/fonts";

type DoeDtcFeedbackPageClientProps = {
  token: string;
  valid: boolean;
  initialSnapshot: DoeDtcProfileSnapshot | null;
  focusedTicketId: string | null;
};

export function DoeDtcFeedbackPageClient({
  token,
  valid,
  initialSnapshot,
  focusedTicketId,
}: DoeDtcFeedbackPageClientProps) {
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const refetchSnapshot = useCallback(async () => {
    if (!valid) return;
    try {
      const response = await fetch(`/api/doedtc/profile?t=${encodeURIComponent(token)}`, {
        cache: "no-store",
      });
      const json = (await response.json()) as {
        ok?: boolean;
        snapshot?: DoeDtcProfileSnapshot;
      };
      if (response.ok && json.ok && json.snapshot) {
        setSnapshot(json.snapshot);
      }
    } catch {
      // Ignore background refresh failures.
    }
  }, [token, valid]);

  useEffect(() => {
    void refetchSnapshot();
  }, [refetchSnapshot]);

  const submitTicket = useCallback(
    async (payload: { kind: DoeDtcTicketKind; title: string; body: string }) => {
      setBusy(true);
      setError("");
      try {
        const response = await fetch("/api/doedtc/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, action: "submit_ticket", payload }),
        });
        const json = (await response.json()) as {
          ok?: boolean;
          error?: string;
          snapshot?: DoeDtcProfileSnapshot;
        };
        if (!response.ok || !json.ok || !json.snapshot) {
          throw new Error(json.error ?? "Unable to submit report.");
        }
        setSnapshot(json.snapshot);
      } catch (submitError) {
        setError(submitError instanceof Error ? submitError.message : "Unable to submit report.");
      } finally {
        setBusy(false);
      }
    },
    [token],
  );

  if (!valid || !snapshot) {
    return (
      <DoeDtcPageShell>
        <div className="doedtc-card">
          <strong>{DOEDTC_FEEDBACK.invalidTokenTitle}</strong>
          <p>{DOEDTC_FEEDBACK.invalidTokenBody}</p>
        </div>
      </DoeDtcPageShell>
    );
  }

  return (
    <DoeDtcPageShell>
      <DoeDtcTopBar compact href={`/doedtc/app?t=${encodeURIComponent(token)}&tab=feedback`} />
      <header className="doedtc-header">
        <h1 className={`doedtc-headline ${dmSans.className}`}>{DOEDTC_FEEDBACK.pageTitle}</h1>
        <p className="doedtc-muted">{DOEDTC_FEEDBACK.subtitle}</p>
      </header>
      {error ? <p className="doedtc-error">{error}</p> : null}
      <DoeDtcFeedbackView
        tickets={snapshot.tickets}
        focusedTicketId={focusedTicketId}
        busy={busy}
        onSubmit={submitTicket}
      />
    </DoeDtcPageShell>
  );
}
