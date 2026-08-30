"use client";

import { useMemo, useState } from "react";

import { formatArtifactEntryValues } from "@/lib/doedtc/doedtc-artifacts";
import { DOEDTC_PROFILE } from "@/lib/doedtc/doedtc-copy";
import type {
  DoeDtcArtifactEntryRow,
  DoeDtcArtifactField,
  DoeDtcArtifactRow,
} from "@/lib/doedtc/doedtc-types";

function formatWhen(value: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function toDatetimeLocalValue(value: string): string {
  try {
    const date = new Date(value);
    const offset = date.getTimezoneOffset();
    const local = new Date(date.getTime() - offset * 60_000);
    return local.toISOString().slice(0, 16);
  } catch {
    return "";
  }
}

function emptyValues(fields: DoeDtcArtifactField[]): Record<string, string | boolean> {
  const next: Record<string, string | boolean> = {};
  for (const field of fields) {
    if (field.type === "boolean") {
      next[field.key] = false;
    } else if (field.type === "datetime") {
      next[field.key] = toDatetimeLocalValue(new Date().toISOString());
    } else if (field.type === "date") {
      next[field.key] = new Date().toISOString().slice(0, 10);
    } else {
      next[field.key] = "";
    }
  }
  return next;
}

function ArtifactFieldInput({
  field,
  value,
  disabled,
  onChange,
}: {
  field: DoeDtcArtifactField;
  value: string | boolean;
  disabled: boolean;
  onChange: (next: string | boolean) => void;
}) {
  const id = `artifact-field-${field.key}`;

  if (field.type === "boolean") {
    return (
      <label className="doedtc-checkbox-row" htmlFor={id}>
        <input
          id={id}
          type="checkbox"
          checked={Boolean(value)}
          disabled={disabled}
          onChange={(event) => onChange(event.target.checked)}
        />
        <span>{field.label}</span>
      </label>
    );
  }

  if (field.type === "select") {
    return (
      <div>
        <label className="doedtc-label" htmlFor={id}>
          {field.label}
        </label>
        <select
          id={id}
          className="doedtc-input"
          value={String(value ?? "")}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
        >
          <option value="">{field.optional ? "Optional" : "Select…"}</option>
          {(field.options ?? []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  }

  const inputType =
    field.type === "number"
      ? "number"
      : field.type === "date"
        ? "date"
        : field.type === "datetime"
          ? "datetime-local"
          : "text";

  return (
    <div>
      <label className="doedtc-label" htmlFor={id}>
        {field.label}
      </label>
      <input
        id={id}
        className="doedtc-input"
        type={inputType}
        value={String(value ?? "")}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

type DoeDtcArtifactViewProps = {
  artifact: DoeDtcArtifactRow;
  entries: DoeDtcArtifactEntryRow[];
  busy: boolean;
  onAction: (action: string, payload?: Record<string, unknown>) => Promise<void>;
};

export function DoeDtcArtifactView({ artifact, entries, busy, onAction }: DoeDtcArtifactViewProps) {
  const [draft, setDraft] = useState<Record<string, string | boolean>>(() =>
    emptyValues(artifact.config.fields),
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Record<string, string | boolean>>({});

  const sortedEntries = useMemo(
    () => [...entries].sort((a, b) => b.occurred_at.localeCompare(a.occurred_at)),
    [entries],
  );

  async function addEntry() {
    const payload: Record<string, unknown> = { artifactId: artifact.id };
    const values: Record<string, unknown> = {};
    for (const field of artifact.config.fields) {
      const raw = draft[field.key];
      if (field.type === "datetime" && typeof raw === "string" && raw) {
        values[field.key] = new Date(raw).toISOString();
      } else if (raw !== "" && raw !== false) {
        values[field.key] = raw;
      }
    }
    payload.values = values;
    await onAction("add_artifact_entry", payload);
    setDraft(emptyValues(artifact.config.fields));
  }

  function startEdit(entry: DoeDtcArtifactEntryRow) {
    setEditingId(entry.id);
    const next: Record<string, string | boolean> = {};
    for (const field of artifact.config.fields) {
      const raw = entry.values[field.key];
      if (field.type === "boolean") {
        next[field.key] = Boolean(raw);
      } else if (field.type === "datetime" && typeof raw === "string") {
        next[field.key] = toDatetimeLocalValue(raw);
      } else {
        next[field.key] = raw === undefined || raw === null ? "" : String(raw);
      }
    }
    setEditDraft(next);
  }

  async function saveEdit(entryId: string) {
    const values: Record<string, unknown> = {};
    for (const field of artifact.config.fields) {
      const raw = editDraft[field.key];
      if (field.type === "datetime" && typeof raw === "string" && raw) {
        values[field.key] = new Date(raw).toISOString();
      } else if (raw !== "" && raw !== false) {
        values[field.key] = raw;
      }
    }
    await onAction("update_artifact_entry", { entryId, values });
    setEditingId(null);
    setEditDraft({});
  }

  return (
    <div className="doedtc-artifact">
      <div className="doedtc-card">
        <div className="doedtc-artifact__header">
          <div>
            <h2 className="doedtc-section-title">{artifact.title}</h2>
            <p className="doedtc-muted">{artifact.kind}</p>
          </div>
          <button
            type="button"
            className="doedtc-button doedtc-button--ghost doedtc-button--inline"
            disabled={busy}
            onClick={() => onAction("archive_artifact", { artifactId: artifact.id })}
          >
            {DOEDTC_PROFILE.trackersArchiveLabel}
          </button>
        </div>

        {artifact.config.fields.length > 0 ? (
          <div className="doedtc-artifact__form">
            {artifact.config.fields.map((field) => (
              <ArtifactFieldInput
                key={field.key}
                field={field}
                value={draft[field.key] ?? ""}
                disabled={busy}
                onChange={(next) => setDraft((current) => ({ ...current, [field.key]: next }))}
              />
            ))}
            <button
              type="button"
              className="doedtc-button doedtc-button--primary"
              disabled={busy}
              onClick={() => void addEntry()}
            >
              {busy ? DOEDTC_PROFILE.savingLabel : DOEDTC_PROFILE.trackersAddEntryLabel}
            </button>
          </div>
        ) : null}
      </div>

      <div className="doedtc-section">
        <h3 className="doedtc-section-title">{DOEDTC_PROFILE.trackersLastEntryLabel}</h3>
        {sortedEntries.length === 0 ? (
          <p className="doedtc-muted">{DOEDTC_PROFILE.trackersNoEntries}</p>
        ) : (
          <div className="doedtc-list">
            {sortedEntries.map((entry) => (
              <div className="doedtc-card doedtc-card--flat" key={entry.id}>
                {editingId === entry.id ? (
                  <div className="doedtc-artifact__form">
                    {artifact.config.fields.map((field) => (
                      <ArtifactFieldInput
                        key={field.key}
                        field={field}
                        value={editDraft[field.key] ?? ""}
                        disabled={busy}
                        onChange={(next) =>
                          setEditDraft((current) => ({ ...current, [field.key]: next }))
                        }
                      />
                    ))}
                    <div className="doedtc-inline-actions">
                      <button
                        type="button"
                        className="doedtc-button doedtc-button--primary doedtc-button--inline"
                        disabled={busy}
                        onClick={() => void saveEdit(entry.id)}
                      >
                        {DOEDTC_PROFILE.saveLabel}
                      </button>
                      <button
                        type="button"
                        className="doedtc-button doedtc-button--ghost doedtc-button--inline"
                        disabled={busy}
                        onClick={() => {
                          setEditingId(null);
                          setEditDraft({});
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="doedtc-list-row">
                      <div>
                        <p className="doedtc-body">{formatArtifactEntryValues(artifact, entry.values)}</p>
                        <p className="doedtc-muted">{formatWhen(entry.occurred_at)}</p>
                      </div>
                      <div className="doedtc-inline-actions">
                        <button
                          type="button"
                          className="doedtc-button doedtc-button--ghost doedtc-button--inline"
                          disabled={busy}
                          onClick={() => startEdit(entry)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="doedtc-button doedtc-button--ghost doedtc-button--inline"
                          disabled={busy}
                          onClick={() => onAction("remove_artifact_entry", { entryId: entry.id })}
                        >
                          {DOEDTC_PROFILE.removeLabel}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
