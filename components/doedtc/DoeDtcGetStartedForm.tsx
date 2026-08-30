"use client";

import { useMemo, useState } from "react";

import { DOEDTC_GET_STARTED } from "@/lib/doedtc/doedtc-copy";

type TagFieldProps = {
  label: string;
  placeholder: string;
  values: string[];
  onChange: (values: string[]) => void;
};

function TagField({ label, placeholder, values, onChange }: TagFieldProps) {
  const [draft, setDraft] = useState("");

  function addValue() {
    const next = draft.trim();
    if (!next || values.includes(next)) return;
    onChange([...values, next]);
    setDraft("");
  }

  return (
    <div style={{ marginTop: "1.25rem" }}>
      <label className="doedtc-label">{label}</label>
      <div className="doedtc-add-row">
        <input
          className="doedtc-input"
          value={draft}
          placeholder={placeholder}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addValue();
            }
          }}
        />
        <button className="doedtc-button doedtc-button--secondary" type="button" onClick={addValue}>
          Add
        </button>
      </div>
      <div className="doedtc-tag-list">
        {values.map((value) => (
          <span className="doedtc-tag" key={value}>
            {value}
            <button
              type="button"
              aria-label={`Remove ${value}`}
              onClick={() => onChange(values.filter((item) => item !== value))}
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

type DoeDtcGetStartedFormProps = {
  token: string;
  valid: boolean;
};

export function DoeDtcGetStartedForm({ token, valid }: DoeDtcGetStartedFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [whyDoe, setWhyDoe] = useState("");
  const [medications, setMedications] = useState<string[]>([]);
  const [conditions, setConditions] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [messagesHref, setMessagesHref] = useState("");

  const disabled = useMemo(() => !valid || status === "loading" || status === "success", [status, valid]);

  if (!valid) {
    return (
      <div className="doedtc-card">
        <strong>{DOEDTC_GET_STARTED.invalidTokenTitle}</strong>
        <p>{DOEDTC_GET_STARTED.invalidTokenBody}</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="doedtc-card">
        <strong>{DOEDTC_GET_STARTED.allSetTitle}</strong>
        <p>{DOEDTC_GET_STARTED.allSetBody}</p>
        {messagesHref ? (
          <a className="doedtc-button" href={messagesHref}>
            {DOEDTC_GET_STARTED.openMessagesLabel}
          </a>
        ) : null}
      </div>
    );
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const response = await fetch("/api/doedtc/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          fullName,
          email,
          medications,
          conditions,
          whyDoe,
        }),
      });
      const json = (await response.json()) as {
        ok?: boolean;
        error?: string;
        messagesHref?: string;
      };
      if (!response.ok || !json.ok) {
        throw new Error(json.error ?? "Unable to save your profile.");
      }
      setMessagesHref(json.messagesHref ?? "");
      setStatus("success");
    } catch (submitError) {
      setStatus("error");
      setError(submitError instanceof Error ? submitError.message : "Unable to save your profile.");
    }
  }

  return (
    <form className="doedtc-card" onSubmit={onSubmit}>
      <label className="doedtc-label" htmlFor="doedtc-full-name">
        {DOEDTC_GET_STARTED.fullNameLabel}
      </label>
      <input
        id="doedtc-full-name"
        className="doedtc-input"
        value={fullName}
        onChange={(event) => setFullName(event.target.value)}
        required
        disabled={disabled}
      />

      <div style={{ marginTop: "1rem" }}>
        <label className="doedtc-label" htmlFor="doedtc-email">
          {DOEDTC_GET_STARTED.emailLabel}
        </label>
        <input
          id="doedtc-email"
          className="doedtc-input"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          disabled={disabled}
        />
      </div>

      <TagField
        label={DOEDTC_GET_STARTED.medicationsLabel}
        placeholder={DOEDTC_GET_STARTED.medicationsPlaceholder}
        values={medications}
        onChange={setMedications}
      />

      <TagField
        label={DOEDTC_GET_STARTED.conditionsLabel}
        placeholder={DOEDTC_GET_STARTED.conditionsPlaceholder}
        values={conditions}
        onChange={setConditions}
      />

      <div style={{ marginTop: "1.25rem" }}>
        <label className="doedtc-label" htmlFor="doedtc-why">
          {DOEDTC_GET_STARTED.whyLabel}
        </label>
        <textarea
          id="doedtc-why"
          className="doedtc-textarea"
          value={whyDoe}
          onChange={(event) => setWhyDoe(event.target.value)}
          placeholder={DOEDTC_GET_STARTED.whyPlaceholder}
          required
          disabled={disabled}
        />
      </div>

      {error ? <p className="doedtc-error">{error}</p> : null}

      <button className="doedtc-button" type="submit" disabled={disabled}>
        {status === "loading" ? DOEDTC_GET_STARTED.submittingLabel : DOEDTC_GET_STARTED.submitLabel}
      </button>
    </form>
  );
}
