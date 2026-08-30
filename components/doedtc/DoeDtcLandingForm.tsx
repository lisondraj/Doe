"use client";

import { useState } from "react";

import { DOEDTC_LANDING } from "@/lib/doedtc/doedtc-copy";

export function DoeDtcLandingForm() {
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const response = await fetch("/api/doedtc/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const json = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !json.ok) {
        throw new Error(json.error ?? DOEDTC_LANDING.errorGeneric);
      }
      setStatus("success");
    } catch (submitError) {
      setStatus("error");
      setError(submitError instanceof Error ? submitError.message : DOEDTC_LANDING.errorGeneric);
    }
  }

  if (status === "success") {
    return (
      <div className="doedtc-success">
        <strong>{DOEDTC_LANDING.successTitle}</strong>
        <p>{DOEDTC_LANDING.successBody}</p>
      </div>
    );
  }

  return (
    <form className="doedtc-card" onSubmit={onSubmit}>
      <label className="doedtc-label" htmlFor="doedtc-phone">
        {DOEDTC_LANDING.phoneLabel}
      </label>
      <input
        id="doedtc-phone"
        className="doedtc-input"
        type="tel"
        autoComplete="tel"
        placeholder={DOEDTC_LANDING.phonePlaceholder}
        value={phone}
        onChange={(event) => setPhone(event.target.value)}
        required
      />
      {error ? <p className="doedtc-error">{error}</p> : null}
      <button className="doedtc-button" type="submit" disabled={status === "loading"}>
        {status === "loading" ? DOEDTC_LANDING.submittingLabel : DOEDTC_LANDING.submitLabel}
      </button>
    </form>
  );
}
