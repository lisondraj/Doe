import type {
  DoeDtcArtifactBlock,
  DoeDtcArtifactBlockKind,
  DoeDtcArtifactEntryRow,
  DoeDtcArtifactField,
  DoeDtcArtifactFieldType,
  DoeDtcArtifactKind,
  DoeDtcArtifactLayout,
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

function unitFromFieldLabel(label: string): string | null {
  const match = label.match(/\(([^)]+)\)/);
  return match ? match[1] : null;
}

export function formatPrimaryArtifactReading(
  artifact: Pick<DoeDtcArtifactRow, "config">,
  values: Record<string, string | number | boolean>,
): string | null {
  const numericField = pickPrimaryNumericField(artifact.config.fields);
  if (numericField) {
    const value = values[numericField.key];
    if (value !== undefined && value !== null && value !== "") {
      const unit = unitFromFieldLabel(numericField.label);
      return unit ? `${value} ${unit}` : String(value);
    }
  }

  const firstField = artifact.config.fields.find((field) => {
    const value = values[field.key];
    return value !== undefined && value !== null && value !== "";
  });
  if (!firstField) return null;

  const value = values[firstField.key];
  return String(value);
}

export function defaultArtifactFieldsForTitle(title: string): DoeDtcArtifactField[] {
  const lower = title.toLowerCase();
  if (lower.includes("calorie") || lower.includes("kcal") || lower.includes("food")) {
    return normalizeArtifactFields([
      { key: "calories", label: "Calories", type: "number" },
      { key: "notes", label: "Notes", type: "text", optional: true },
    ]);
  }
  if (lower.includes("weight") || lower.includes("scale")) {
    return normalizeArtifactFields([
      { key: "weight", label: "Weight (lb)", type: "number" },
      { key: "notes", label: "Notes", type: "text", optional: true },
    ]);
  }
  if (lower.includes("water") || lower.includes("hydration")) {
    return normalizeArtifactFields([
      { key: "glasses", label: "Glasses", type: "number" },
      { key: "notes", label: "Notes", type: "text", optional: true },
    ]);
  }
  if (lower.includes("mood") || lower.includes("pain")) {
    return normalizeArtifactFields([
      { key: "score", label: "Score", type: "number" },
      { key: "notes", label: "Notes", type: "text", optional: true },
    ]);
  }
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

export const DOEDTC_ARTIFACT_LAYOUTS = [
  "log",
  "series",
  "counter",
  "checklist",
  "score",
] as const satisfies readonly DoeDtcArtifactLayout[];

export const DOEDTC_ARTIFACT_BLOCK_KINDS = [
  "hero",
  "stats",
  "chart",
  "counter",
  "gauge",
  "week_grid",
  "checklist_today",
  "form",
  "log",
  "goal",
  "callout",
  "illustration",
] as const satisfies readonly DoeDtcArtifactBlockKind[];

const MAX_ARTIFACT_BLOCKS = 10;

export function normalizeArtifactLayout(value: unknown): DoeDtcArtifactLayout {
  const raw = String(value ?? "log").trim().toLowerCase();
  return DOEDTC_ARTIFACT_LAYOUTS.includes(raw as DoeDtcArtifactLayout)
    ? (raw as DoeDtcArtifactLayout)
    : "log";
}

function normalizeIllustrationPreset(value: unknown): "plate" | "glass" | "scale" | "shot" {
  const raw = String(value ?? "scale").trim().toLowerCase();
  if (raw === "plate" || raw === "glass" || raw === "shot") return raw;
  return "scale";
}

function normalizeCalloutTone(value: unknown): "tip" | "warning" | "info" {
  const raw = String(value ?? "info").trim().toLowerCase();
  if (raw === "tip" || raw === "warning" || raw === "info") return raw;
  return "info";
}

function normalizeArtifactBlock(raw: unknown, index: number): DoeDtcArtifactBlock | null {
  if (!raw || typeof raw !== "object") return null;
  const block = raw as Record<string, unknown>;
  const kind = String(block.kind ?? "").trim().toLowerCase() as DoeDtcArtifactBlockKind;
  if (!DOEDTC_ARTIFACT_BLOCK_KINDS.includes(kind)) return null;

  const id = String(block.id ?? "").trim() || `block-${index + 1}`;
  const title = String(block.title ?? "").trim();
  const body = String(block.body ?? "").trim();
  const fieldKey = String(block.fieldKey ?? block.field_key ?? "").trim();
  const fieldLabel = String(block.fieldLabel ?? block.field_label ?? "").trim();

  switch (kind) {
    case "hero":
      return { id, kind, title: title || undefined, body: body || undefined };
    case "stats":
    case "chart":
    case "counter":
    case "gauge":
    case "checklist_today":
      return {
        id,
        kind,
        title: title || undefined,
        fieldKey: fieldKey || undefined,
        fieldLabel: fieldLabel || undefined,
        max: typeof block.max === "number" ? block.max : undefined,
      };
    case "week_grid":
    case "form":
    case "log":
    case "goal":
      return { id, kind, title: title || undefined };
    case "callout":
      return {
        id,
        kind,
        title: title || undefined,
        body: body || title,
        tone: normalizeCalloutTone(block.tone),
      };
    case "illustration":
      return {
        id,
        kind,
        title: title || undefined,
        body: body || undefined,
        preset: normalizeIllustrationPreset(block.preset),
      };
    default:
      return null;
  }
}

export function normalizeArtifactBlocks(raw: unknown): DoeDtcArtifactBlock[] {
  const input = Array.isArray(raw) ? raw : [];
  const blocks: DoeDtcArtifactBlock[] = [];
  for (let index = 0; index < input.length && blocks.length < MAX_ARTIFACT_BLOCKS; index += 1) {
    const block = normalizeArtifactBlock(input[index], index);
    if (block) blocks.push(block);
  }
  return blocks;
}

export function defaultLayoutForTitle(title: string): DoeDtcArtifactLayout {
  const lower = title.toLowerCase();
  if (lower.includes("calorie") || lower.includes("kcal") || lower.includes("weight") || lower.includes("food")) {
    return "series";
  }
  if (lower.includes("water") || lower.includes("hydration") || lower.includes("step")) {
    return "counter";
  }
  if (lower.includes("mood") || lower.includes("pain")) {
    return "score";
  }
  if (lower.includes("habit") || lower.includes("checklist")) {
    return "checklist";
  }
  if (lower.includes("ozempic") || lower.includes("injection") || lower.includes("shot")) {
    return "log";
  }
  return "log";
}

export function pickPrimaryNumericField(fields: DoeDtcArtifactField[]): DoeDtcArtifactField | null {
  const preferred = ["calories", "weight", "glasses", "score", "value"];
  for (const key of preferred) {
    const match = fields.find((field) => field.key === key && field.type === "number");
    if (match) return match;
  }
  return fields.find((field) => field.type === "number") ?? null;
}

export function defaultBlocksForLayout(params: {
  layout: DoeDtcArtifactLayout;
  title: string;
  fields: DoeDtcArtifactField[];
}): DoeDtcArtifactBlock[] {
  const numeric = pickPrimaryNumericField(params.fields);
  const fieldKey = numeric?.key;
  const fieldLabel = numeric?.label;

  switch (params.layout) {
    case "series":
      return normalizeArtifactBlocks([
        { id: "hero-1", kind: "hero", title: params.title },
        { id: "stats-1", kind: "stats", title: "Summary", fieldKey, fieldLabel },
        { id: "chart-1", kind: "chart", title: numeric?.label ?? "Trend", fieldKey, fieldLabel },
        { id: "goal-1", kind: "goal", title: "Goal" },
        { id: "form-1", kind: "form", title: "Log" },
        { id: "log-1", kind: "log", title: "History" },
      ]);
    case "counter":
      return normalizeArtifactBlocks([
        { id: "hero-1", kind: "hero", title: params.title },
        { id: "counter-1", kind: "counter", title: numeric?.label ?? "Today", fieldKey, fieldLabel },
        { id: "chart-1", kind: "chart", title: "Trend", fieldKey, fieldLabel },
        { id: "form-1", kind: "form", title: "Log" },
      ]);
    case "checklist":
      return normalizeArtifactBlocks([
        { id: "hero-1", kind: "hero", title: params.title },
        { id: "checklist-1", kind: "checklist_today", title: "Today" },
        { id: "week-1", kind: "week_grid", title: "This week" },
        { id: "log-1", kind: "log", title: "History" },
      ]);
    case "score":
      return normalizeArtifactBlocks([
        { id: "hero-1", kind: "hero", title: params.title },
        { id: "gauge-1", kind: "gauge", title: numeric?.label ?? "Score", fieldKey, fieldLabel, max: 10 },
        { id: "week-1", kind: "week_grid", title: "This week" },
        { id: "form-1", kind: "form", title: "Log" },
      ]);
    case "log":
    default:
      return normalizeArtifactBlocks([
        { id: "hero-1", kind: "hero", title: params.title },
        {
          id: "illus-1",
          kind: "illustration",
          preset: params.title.toLowerCase().includes("shot") ? "shot" : "scale",
        },
        { id: "form-1", kind: "form", title: "Log" },
        { id: "log-1", kind: "log", title: "History" },
        {
          id: "callout-1",
          kind: "callout",
          tone: "tip",
          body: "Log each entry close to when it happens so trends stay accurate.",
        },
      ]);
  }
}

export function resolveArtifactBlocks(artifact: Pick<DoeDtcArtifactRow, "layout" | "title" | "blocks" | "config">): DoeDtcArtifactBlock[] {
  if (artifact.blocks.length > 0) return artifact.blocks;
  return defaultBlocksForLayout({
    layout: artifact.layout,
    title: artifact.title,
    fields: artifact.config.fields,
  });
}

export type ArtifactSeriesPoint = { at: string; value: number };

export function buildArtifactSeriesPoints(params: {
  entries: DoeDtcArtifactEntryRow[];
  fieldKey: string;
  limit?: number;
}): ArtifactSeriesPoint[] {
  return params.entries
    .map((entry) => {
      const raw = entry.values[params.fieldKey];
      const value = typeof raw === "number" ? raw : Number(String(raw ?? ""));
      if (!Number.isFinite(value)) return null;
      return { at: entry.occurred_at, value };
    })
    .filter((point): point is ArtifactSeriesPoint => point !== null)
    .sort((a, b) => a.at.localeCompare(b.at))
    .slice(-(params.limit ?? 60));
}

export function computeArtifactStats(points: ArtifactSeriesPoint[]): {
  latest: number | null;
  average: number | null;
  streak: number;
} {
  if (points.length === 0) return { latest: null, average: null, streak: 0 };
  const latest = points[points.length - 1]?.value ?? null;
  const average = points.reduce((sum, point) => sum + point.value, 0) / points.length;
  let streak = 1;
  for (let index = points.length - 1; index > 0; index -= 1) {
    const dayA = points[index]?.at.slice(0, 10);
    const dayB = points[index - 1]?.at.slice(0, 10);
    if (!dayA || !dayB) break;
    const diff = Date.parse(dayA) - Date.parse(dayB);
    if (diff <= 86_400_000 && diff >= 0) streak += 1;
    else break;
  }
  return { latest, average, streak };
}

export function defaultGoalForTitle(title: string): number | null {
  const lower = title.toLowerCase();
  if (lower.includes("calorie")) return 2000;
  if (lower.includes("water")) return 8;
  return null;
}
