"use client";

import { useState } from "react";

import { DoeDtcPrepareView } from "@/components/doedtc/DoeDtcPrepareView";
import { DoeDtcPageShell } from "@/components/doedtc/DoeDtcPageShell";
import { DOEDTC_VIEW } from "@/lib/doedtc/doedtc-copy";
import type { DoeDtcPreparationRow } from "@/lib/doedtc/doedtc-types";
import { dmSans } from "@/lib/home/fonts";

export function DoeDtcViewPageClient() {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [preparation, setPreparation] = useState<DoeDtcPreparationRow | null>(null);

  async function lookup(nextCode: string) {
    const normalized = nextCode.trim().replace(/\D/g, "");
    if (normalized.length !== 5) {
      setError("Enter a 5-digit code.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/doedtc/preparation?code=${encodeURIComponent(normalized)}`, {
        cache: "no-store",
      });
      const json = (await response.json()) as {
        ok?: boolean;
        error?: string;
        preparation?: DoeDtcPreparationRow;
      };
      if (!response.ok || !json.ok || !json.preparation) {
        throw new Error(json.error ?? DOEDTC_VIEW.invalidCodeBody);
      }
      setPreparation(json.preparation);
      setCode(normalized);
    } catch (lookupError) {
      setPreparation(null);
      setError(lookupError instanceof Error ? lookupError.message : DOEDTC_VIEW.invalidCodeBody);
    } finally {
      setBusy(false);
    }
  }

  return (
    <DoeDtcPageShell>
      <header className="doedtc-header">
        <h1 className={`doedtc-headline ${dmSans.className}`}>{DOEDTC_VIEW.pageTitle}</h1>
        <p className="doedtc-muted">{DOEDTC_VIEW.subtitle}</p>
      </header>

      {!preparation ? (
        <form
          className="doedtc-card doedtc-prepare__lookup"
          onSubmit={(event) => {
            event.preventDefault();
            void lookup(code);
          }}
        >
          <label className="doedtc-label" htmlFor="provider-code">
            {DOEDTC_VIEW.codeLabel}
          </label>
          <input
            id="provider-code"
            className="doedtc-input doedtc-prepare__code-input"
            inputMode="numeric"
            pattern="[0-9]{5}"
            maxLength={5}
            placeholder={DOEDTC_VIEW.codePlaceholder}
            value={code}
            disabled={busy}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 5))}
          />
          {error ? <p className="doedtc-error">{error}</p> : null}
          <button className="doedtc-button" type="submit" disabled={busy}>
            {DOEDTC_VIEW.submitLabel}
          </button>
        </form>
      ) : (
        <DoeDtcPrepareView
          code={preparation.code}
          payload={preparation.payload}
          showCodeBanner={false}
        />
      )}
    </DoeDtcPageShell>
  );
}
