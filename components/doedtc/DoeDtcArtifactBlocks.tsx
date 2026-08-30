"use client";

import { useMemo, useState } from "react";

import { DoeDtcTrackerChart } from "@/components/doedtc/DoeDtcTrackerChart";
import {
  buildArtifactSeriesPoints,
  computeArtifactStats,
  formatArtifactEntryValues,
  pickPrimaryNumericField,
  resolveArtifactBlocks,
} from "@/lib/doedtc/doedtc-artifacts";
import { DOEDTC_PROFILE } from "@/lib/doedtc/doedtc-copy";
import type {
  DoeDtcArtifactBlock,
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
    if (field.type === "boolean") next[field.key] = false;
    else if (field.type === "datetime") next[field.key] = toDatetimeLocalValue(new Date().toISOString());
    else if (field.type === "date") next[field.key] = new Date().toISOString().slice(0, 10);
    else next[field.key] = "";
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
        <label className="doedtc-label" htmlFor={id}>{field.label}</label>
        <select
          id={id}
          className="doedtc-input"
          value={String(value ?? "")}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
        >
          <option value="">{field.optional ? "Optional" : "Select…"}</option>
          {(field.options ?? []).map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
    );
  }
  const inputType =
    field.type === "number" ? "number" : field.type === "date" ? "date" : field.type === "datetime" ? "datetime-local" : "text";
  return (
    <div>
      <label className="doedtc-label" htmlFor={id}>{field.label}</label>
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

function ArtifactIllustration({ preset }: { preset: "plate" | "glass" | "scale" | "shot" }) {
  if (preset === "glass") {
    return (
      <svg viewBox="0 0 80 80" className="doedtc-artifact__illus" aria-hidden>
        <path d="M28 12h24v8H28z" fill="currentColor" opacity="0.35" />
        <path d="M30 20h20v48H30z" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }
  if (preset === "plate") {
    return (
      <svg viewBox="0 0 80 80" className="doedtc-artifact__illus" aria-hidden>
        <ellipse cx="40" cy="44" rx="26" ry="10" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }
  if (preset === "shot") {
    return (
      <svg viewBox="0 0 80 80" className="doedtc-artifact__illus" aria-hidden>
        <rect x="30" y="10" width="20" height="56" rx="10" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 80 80" className="doedtc-artifact__illus" aria-hidden>
      <rect x="18" y="34" width="44" height="24" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="40" cy="46" r="8" fill="currentColor" opacity="0.35" />
    </svg>
  );
}

type ArtifactBlockContext = {
  artifact: DoeDtcArtifactRow;
  entries: DoeDtcArtifactEntryRow[];
  busy: boolean;
  readOnly: boolean;
  draft: Record<string, string | boolean>;
  setDraft: (next: Record<string, string | boolean>) => void;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  editDraft: Record<string, string | boolean>;
  setEditDraft: (next: Record<string, string | boolean>) => void;
  onAction: (action: string, payload?: Record<string, unknown>) => Promise<void>;
  numericField: DoeDtcArtifactField | null;
  seriesPoints: ReturnType<typeof buildArtifactSeriesPoints>;
  stats: ReturnType<typeof computeArtifactStats>;
};

function resolveFieldKey(block: DoeDtcArtifactBlock, numericField: DoeDtcArtifactField | null): string | null {
  return block.fieldKey ?? numericField?.key ?? null;
}

function ArtifactFormBlock({ ctx }: { ctx: ArtifactBlockContext }) {
  if (ctx.readOnly || ctx.artifact.config.fields.length === 0) return null;
  async function addEntry(valuesOverride?: Record<string, unknown>) {
    const payload: Record<string, unknown> = { artifactId: ctx.artifact.id };
    const values: Record<string, unknown> = valuesOverride ?? {};
    if (!valuesOverride) {
      for (const field of ctx.artifact.config.fields) {
        const raw = ctx.draft[field.key];
        if (field.type === "datetime" && typeof raw === "string" && raw) values[field.key] = new Date(raw).toISOString();
        else if (raw !== "" && raw !== false) values[field.key] = raw;
      }
    }
    payload.values = values;
    await ctx.onAction("add_artifact_entry", payload);
    ctx.setDraft(emptyValues(ctx.artifact.config.fields));
  }
  return (
    <div className="doedtc-card doedtc-card--flat">
      <h3 className="doedtc-section-title">{DOEDTC_PROFILE.trackersAddEntryLabel}</h3>
      <div className="doedtc-artifact__form">
        {ctx.artifact.config.fields.map((field) => (
          <ArtifactFieldInput
            key={field.key}
            field={field}
            value={ctx.draft[field.key] ?? ""}
            disabled={ctx.busy}
            onChange={(next) => ctx.setDraft({ ...ctx.draft, [field.key]: next })}
          />
        ))}
        <button type="button" className="doedtc-button doedtc-button--primary" disabled={ctx.busy} onClick={() => void addEntry()}>
          {ctx.busy ? DOEDTC_PROFILE.savingLabel : DOEDTC_PROFILE.trackersAddEntryLabel}
        </button>
      </div>
    </div>
  );
}

function ArtifactLogBlock({ ctx }: { ctx: ArtifactBlockContext }) {
  const sortedEntries = useMemo(
    () => [...ctx.entries].sort((a, b) => b.occurred_at.localeCompare(a.occurred_at)),
    [ctx.entries],
  );
  if (sortedEntries.length === 0) {
    return (
      <div className="doedtc-card doedtc-card--flat">
        <p className="doedtc-muted">{DOEDTC_PROFILE.trackersNoEntries}</p>
      </div>
    );
  }
  return (
    <div className="doedtc-section">
      <h3 className="doedtc-section-title">{DOEDTC_PROFILE.trackersLastEntryLabel}</h3>
      <div className="doedtc-list">
        {sortedEntries.map((entry) => (
          <div className="doedtc-card doedtc-card--flat" key={entry.id}>
            <div className="doedtc-list-row">
              <div>
                <p className="doedtc-body">{formatArtifactEntryValues(ctx.artifact, entry.values)}</p>
                <p className="doedtc-muted">{formatWhen(entry.occurred_at)}</p>
              </div>
              {!ctx.readOnly ? (
                <div className="doedtc-inline-actions">
                  <button type="button" className="doedtc-button doedtc-button--ghost doedtc-button--inline" disabled={ctx.busy} onClick={() => ctx.onAction("remove_artifact_entry", { entryId: entry.id })}>
                    {DOEDTC_PROFILE.removeLabel}
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ArtifactBlock({ block, ctx }: { block: DoeDtcArtifactBlock; ctx: ArtifactBlockContext }) {
  const fieldKey = resolveFieldKey(block, ctx.numericField);
  const blockPoints = fieldKey
    ? buildArtifactSeriesPoints({ entries: ctx.entries, fieldKey })
    : ctx.seriesPoints;

  switch (block.kind) {
    case "hero":
      return (
        <div className="doedtc-card doedtc-card--flat doedtc-artifact__hero">
          <h2 className="doedtc-section-title">{block.title ?? ctx.artifact.title}</h2>
          {block.body ? <p className="doedtc-muted">{block.body}</p> : null}
        </div>
      );
    case "stats":
      return (
        <div className="doedtc-artifact__stats">
          <div className="doedtc-card doedtc-card--flat doedtc-artifact__stat">
            <p className="doedtc-eyebrow">Latest</p>
            <strong>{ctx.stats.latest ?? "—"}</strong>
          </div>
          <div className="doedtc-card doedtc-card--flat doedtc-artifact__stat">
            <p className="doedtc-eyebrow">Average</p>
            <strong>{ctx.stats.average !== null ? Math.round(ctx.stats.average * 10) / 10 : "—"}</strong>
          </div>
          <div className="doedtc-card doedtc-card--flat doedtc-artifact__stat">
            <p className="doedtc-eyebrow">Streak</p>
            <strong>{ctx.stats.streak}d</strong>
          </div>
        </div>
      );
    case "chart":
      return (
        <DoeDtcTrackerChart
          title={block.title ?? block.fieldLabel ?? "Trend"}
          points={blockPoints}
          goal={ctx.artifact.goal}
        />
      );
    case "counter": {
      const key = fieldKey;
      const latest = key ? ctx.entries[0]?.values[key] : null;
      const current = typeof latest === "number" ? latest : Number(String(latest ?? 0)) || 0;
      if (ctx.readOnly) {
        return (
          <div className="doedtc-card doedtc-card--flat doedtc-artifact__counter">
            <p className="doedtc-eyebrow">{block.title ?? block.fieldLabel ?? "Count"}</p>
            <strong className="doedtc-artifact__counter-value">{current}</strong>
          </div>
        );
      }
      return (
        <div className="doedtc-card doedtc-card--flat doedtc-artifact__counter">
          <p className="doedtc-eyebrow">{block.title ?? block.fieldLabel ?? "Count"}</p>
          <div className="doedtc-artifact__counter-controls">
            <button type="button" className="doedtc-button doedtc-button--secondary" disabled={ctx.busy || !key} onClick={() => void ctx.onAction("add_artifact_entry", { artifactId: ctx.artifact.id, values: key ? { [key]: Math.max(0, current - 1) } : {} })}>−</button>
            <strong className="doedtc-artifact__counter-value">{current}</strong>
            <button type="button" className="doedtc-button doedtc-button--secondary" disabled={ctx.busy || !key} onClick={() => void ctx.onAction("add_artifact_entry", { artifactId: ctx.artifact.id, values: key ? { [key]: current + 1 } : {} })}>+</button>
          </div>
        </div>
      );
    }
    case "gauge": {
      const key = fieldKey;
      const raw = key ? ctx.entries[0]?.values[key] : null;
      const value = typeof raw === "number" ? raw : Number(String(raw ?? 0)) || 0;
      const max = block.max ?? 10;
      const pct = Math.min(100, Math.max(0, (value / max) * 100));
      return (
        <div className="doedtc-card doedtc-card--flat doedtc-artifact__gauge">
          <h3 className="doedtc-section-title">{block.title ?? "Score"}</h3>
          <div className="doedtc-artifact__gauge-bar">
            <div className="doedtc-artifact__gauge-fill" style={{ width: `${pct}%` }} />
          </div>
          <p className="doedtc-muted">{value} / {max}</p>
        </div>
      );
    }
    case "week_grid":
      return (
        <div className="doedtc-card doedtc-card--flat">
          <h3 className="doedtc-section-title">{block.title ?? "This week"}</h3>
          <div className="doedtc-artifact__week-grid">
            {Array.from({ length: 7 }).map((_, index) => {
              const day = new Date();
              day.setDate(day.getDate() - (6 - index));
              const dayKey = day.toISOString().slice(0, 10);
              const hasEntry = ctx.entries.some((entry) => entry.occurred_at.slice(0, 10) === dayKey);
              return (
                <div key={dayKey} className={`doedtc-artifact__week-cell${hasEntry ? " doedtc-artifact__week-cell--active" : ""}`}>
                  {new Intl.DateTimeFormat(undefined, { weekday: "short" }).format(day).slice(0, 1)}
                </div>
              );
            })}
          </div>
        </div>
      );
    case "checklist_today":
      return (
        <div className="doedtc-card doedtc-card--flat">
          <h3 className="doedtc-section-title">{block.title ?? "Today"}</h3>
          <ul className="doedtc-artifact__checklist">
            {ctx.artifact.config.fields.filter((field) => field.type === "boolean").map((field) => (
              <li key={field.key}>
                <span className="doedtc-artifact__check" aria-hidden />
                {field.label}
              </li>
            ))}
          </ul>
        </div>
      );
    case "goal":
      return ctx.artifact.goal !== null ? (
        <div className="doedtc-card doedtc-card--flat doedtc-artifact__goal">
          <p className="doedtc-eyebrow">Goal</p>
          <strong>{ctx.artifact.goal}</strong>
          {ctx.stats.latest !== null ? (
            <p className="doedtc-muted">Latest: {ctx.stats.latest}</p>
          ) : null}
        </div>
      ) : null;
    case "callout":
      return (
        <div className={`doedtc-artifact__callout doedtc-artifact__callout--${block.tone ?? "info"}`}>
          {block.title ? <strong>{block.title}</strong> : null}
          <p>{block.body}</p>
        </div>
      );
    case "illustration":
      return (
        <div className="doedtc-card doedtc-card--flat doedtc-artifact__illustration-wrap">
          <ArtifactIllustration preset={block.preset ?? "scale"} />
          {block.body ? <p className="doedtc-muted">{block.body}</p> : null}
        </div>
      );
    case "form":
      return <ArtifactFormBlock ctx={ctx} />;
    case "log":
      return <ArtifactLogBlock ctx={ctx} />;
    default:
      return null;
  }
}

type DoeDtcArtifactBlocksProps = {
  artifact: DoeDtcArtifactRow;
  entries: DoeDtcArtifactEntryRow[];
  busy: boolean;
  readOnly?: boolean;
  onAction: (action: string, payload?: Record<string, unknown>) => Promise<void>;
  headerActions?: React.ReactNode;
};

export function DoeDtcArtifactBlocks({
  artifact,
  entries,
  busy,
  readOnly = false,
  onAction,
  headerActions,
}: DoeDtcArtifactBlocksProps) {
  const [draft, setDraft] = useState<Record<string, string | boolean>>(() =>
    emptyValues(artifact.config.fields),
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Record<string, string | boolean>>({});

  const blocks = resolveArtifactBlocks(artifact);
  const numericField = pickPrimaryNumericField(artifact.config.fields);
  const fieldKey = numericField?.key ?? "value";
  const seriesPoints = buildArtifactSeriesPoints({ entries, fieldKey });
  const stats = computeArtifactStats(seriesPoints);

  const ctx: ArtifactBlockContext = {
    artifact,
    entries,
    busy,
    readOnly,
    draft,
    setDraft,
    editingId,
    setEditingId,
    editDraft,
    setEditDraft,
    onAction,
    numericField,
    seriesPoints,
    stats,
  };

  return (
    <div className="doedtc-artifact">
      {headerActions ? (
        <div className="doedtc-artifact__header-actions">{headerActions}</div>
      ) : null}
      <div className="doedtc-artifact__blocks">
        {blocks.map((block) => (
          <ArtifactBlock key={block.id} block={block} ctx={ctx} />
        ))}
      </div>
    </div>
  );
}
