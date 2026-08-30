"use client";

import { useState } from "react";

import { DoeDtcPageHeader } from "@/components/doedtc/DoeDtcPageHeader";
import { DoeDtcPageShell } from "@/components/doedtc/DoeDtcPageShell";
import { DoeDtcTopBar } from "@/components/doedtc/DoeDtcTopBar";
import { DOEDTC_VAULT } from "@/lib/doedtc/doedtc-copy";

type DoeDtcVaultViewProps = {
  token: string;
  valid: boolean;
  host: string;
};

export function DoeDtcVaultView({ token, valid, host }: DoeDtcVaultViewProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!valid) return;
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/doedtc/vault", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, host, username, password }),
      });
      const json = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(json.error ?? DOEDTC_VAULT.errorGeneric);
      }
      setDone(true);
      setPassword("");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : DOEDTC_VAULT.errorGeneric);
    } finally {
      setBusy(false);
    }
  }

  const title = !valid
    ? DOEDTC_VAULT.invalidTitle
    : done
      ? DOEDTC_VAULT.successTitle
      : DOEDTC_VAULT.pageTitle;

  return (
    <DoeDtcPageShell>
      <DoeDtcTopBar compact />
      <DoeDtcPageHeader title={title} />

      {!valid ? (
        <section className="doedtc-card doedtc-card--flat">
          <p className="doedtc-body">{DOEDTC_VAULT.invalidBody}</p>
        </section>
      ) : done ? (
        <section className="doedtc-card doedtc-card--flat">
          <p className="doedtc-body">{DOEDTC_VAULT.successBody}</p>
        </section>
      ) : (
        <section className="doedtc-card doedtc-card--flat">
          <form className="doedtc-form" onSubmit={handleSubmit} autoComplete="off">
            <label className="doedtc-label">{DOEDTC_VAULT.hostLabel}</label>
            <input className="doedtc-input" value={host} readOnly />

            <label className="doedtc-label">{DOEDTC_VAULT.usernameLabel}</label>
            <input
              className="doedtc-input"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="off"
              required
            />

            <label className="doedtc-label">{DOEDTC_VAULT.passwordLabel}</label>
            <input
              className="doedtc-input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              required
            />

            {error ? <p className="doedtc-error">{error}</p> : null}

            <button className="doedtc-button" type="submit" disabled={busy}>
              {busy ? DOEDTC_VAULT.submittingLabel : DOEDTC_VAULT.submitLabel}
            </button>
          </form>
        </section>
      )}
    </DoeDtcPageShell>
  );
}
