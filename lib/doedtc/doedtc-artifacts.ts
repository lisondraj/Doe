import type {
  DoeDtcArtifactField,
  DoeDtcArtifactFieldType,
  DoeDtcArtifactKind,
  DoeDtcArtifactRow,
} from "@/lib/doedtc/doedtc-types";

const ARTIFACT_KINDS = new Set<DoeDtcArtifactKind>(["log", "counter", "checklist", "score"]);
const FIELD_TYPES = new Set<DoeDtcArtifactFieldType>([
  "text",
  "number",
  "select",
  "date",
  "datetime",
  "boolean",
]);

export function slugifyArtifactTitle(title: string): string {
  const slug = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return slug || "tracker";
}

export function normalizeArtifactKind(value: unknown): DoeDtcArtifactKind {
  if (typeof value === "string" && ARTIFACT_KINDS.has(value as DoeDtcArtifactKind)) {
    return value as DoeDtcArtifactKind;
  }
  return "log";
}

export function normalizeArtifactFields(value: unknown): DoeDtcArtifactField[] {
  if (!Array.isArray(value)) return [];
  const fields: DoeDtcArtifactField[] = [];
  const seen = new Set<string>();

  for (const raw of value) {
    if (!raw || typeof raw !== "object") continue;
    const row = raw as Record<string, unknown>;
    const key = typeof row.key === "string" ? row.key.trim() : "";
    const label = typeof row.label === "string" ? row.label.trim() : "";
    const type = typeof row.type === "string" ? row.type.trim() : "text";
    if (!key || !label || !FIELD_TYPES.has(type as DoeDtcArtifactFieldType)) continue;
    const normalizedKey = key.replace(/\s+/g, "_").slice(0, 40);
    if (seen.has(normalizedKey)) continue;
    seen.add(normalizedKey);

    const field: DoeDtcArtifactField = {
      key: normalizedKey,
      label: label.slice(0, 80),
      type: type as DoeDtcArtifactFieldType,
      optional: Boolean(row.optional),
    };

    if (type === "select" && Array.isArray(row.options)) {
      const options = row.options
        .filter((option): option is string => typeof option === "string")
        .map((option) => option.trim())
        .filter(Boolean)
        .slice(0, 20);
      if (options.length > 0) field.options = options;
    }

    fields.push(field);
  }

  return fields.slice(0, 12);
}

export function normalizeArtifactConfig(value: unknown): { fields: DoeDtcArtifactField[] } {
  if (!value || typeof value !== "object") {
    return { fields: [] };
  }
  const config = value as Record<string, unknown>;
  return { fields: normalizeArtifactFields(config.fields) };
}

export function normalizeArtifactValues(
  fields: DoeDtcArtifactField[],
  values: unknown,
): Record<string, string | number | boolean> {
  const input = values && typeof values === "object" ? (values as Record<string, unknown>) : {};
  const normalized: Record<string, string | number | boolean> = {};

  for (const field of fields) {
    const raw = input[field.key];
    if (raw === undefined || raw === null || raw === "") {
      if (!field.optional) {
        throw new Error(`${field.label} is required.`);
      }
      continue;
    }

    switch (field.type) {
      case "number": {
        const numberValue = typeof raw === "number" ? raw : Number(String(raw));
        if (!Number.isFinite(numberValue)) {
          throw new Error(`${field.label} must be a number.`);
        }
        normalized[field.key] = numberValue;
        break;
      }
      case "boolean": {
        if (typeof raw === "boolean") {
          normalized[field.key] = raw;
        } else {
          const text = String(raw).trim().toLowerCase();
          normalized[field.key] = text === "true" || text === "yes" || text === "1";
        }
        break;
      }
      case "select": {
        const text = String(raw).trim();
        if (field.options && !field.options.includes(text)) {
          throw new Error(`${field.label} must be one of: ${field.options.join(", ")}.`);
        }
        normalized[field.key] = text;
        break;
      }
      case "date":
      case "datetime":
      case "text":
      default: {
        const text = String(raw).trim();
        if (!text) {
          throw new Error(`${field.label} is required.`);
        }
        normalized[field.key] = text;
      }
    }
  }

  return normalized;
}

export function formatArtifactEntryValues(
  artifact: Pick<DoeDtcArtifactRow, "config">,
  values: Record<string, string | number | boolean>,
): string {
  const fields = artifact.config.fields;
  if (fields.length === 0) return JSON.stringify(values);

  const parts = fields
    .map((field) => {
      const value = values[field.key];
      if (value === undefined || value === null || value === "") return null;
      return `${field.label}: ${String(value)}`;
    })
    .filter(Boolean);

  return parts.length > 0 ? parts.join(" | ") : "Entry logged";
}

export function defaultArtifactFieldsForTitle(title: string): DoeDtcArtifactField[] {
  const lower = title.toLowerCase();
  if (lower.includes("ozempic") || lower.includes("injection") || lower.includes("shot")) {
    return normalizeArtifactFields([
      { key: "dose", label: "Dose", type: "select", options: ["0.25 mg", "0.5 mg", "1 mg", "2 mg"] },
      { key: "site", label: "Site", type: "select", options: ["abdomen", "thigh", "arm"] },
      { key: "notes", label: "Notes", type: "text", optional: true },
    ]);
  }

  return normalizeArtifactFields([
    { key: "value", label: "Value", type: "text" },
    { key: "notes", label: "Notes", type: "text", optional: true },
  ]);
}
