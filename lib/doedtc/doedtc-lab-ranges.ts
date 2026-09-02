/** Adult reference ranges when a document omits them. Not medical advice — display aid only. */

export type LabRangeCatalogEntry = {
  patterns: RegExp[];
  unit: string;
  range: string;
};

export const LAB_RANGE_CATALOG: LabRangeCatalogEntry[] = [
  { patterns: [/\ba1c\b/i, /hemoglobin a1c/i, /hba1c/i], unit: "%", range: "<5.7" },
  { patterns: [/\balt\b/i, /alanine aminotransferase/i], unit: "U/L", range: "7–56" },
  { patterns: [/\bast\b/i, /aspartate aminotransferase/i], unit: "U/L", range: "10–40" },
  { patterns: [/\balp\b/i, /alkaline phosphatase/i], unit: "U/L", range: "44–147" },
  { patterns: [/\bbilirubin\b/i], unit: "mg/dL", range: "0.1–1.2" },
  { patterns: [/\btsh\b/i, /thyroid stimulating/i], unit: "mIU/L", range: "0.4–4.0" },
  { patterns: [/\bfree t4\b/i], unit: "ng/dL", range: "0.8–1.8" },
  { patterns: [/\bldl\b/i], unit: "mg/dL", range: "<100" },
  { patterns: [/\bhdl\b/i], unit: "mg/dL", range: ">40" },
  { patterns: [/\btrig(?:lycerides?)?\b/i], unit: "mg/dL", range: "<150" },
  { patterns: [/\btotal cholesterol\b/i, /\bcholesterol total\b/i], unit: "mg/dL", range: "<200" },
  { patterns: [/\bcreatinine\b/i], unit: "mg/dL", range: "0.7–1.3" },
  { patterns: [/\begfr\b/i, /\bgfr\b/i], unit: "mL/min/1.73m²", range: ">60" },
  { patterns: [/\bglucose\b/i, /\bfasting glucose\b/i], unit: "mg/dL", range: "70–99" },
  { patterns: [/\bhemoglobin\b/i, /\bhgb\b/i], unit: "g/dL", range: "13.5–17.5" },
  { patterns: [/\bwbc\b/i, /white blood/i], unit: "K/uL", range: "4.5–11.0" },
  { patterns: [/\bplatelet/i, /\bplt\b/i], unit: "K/uL", range: "150–400" },
  { patterns: [/\bhematocrit\b/i, /\bhct\b/i], unit: "%", range: "38.3–48.6" },
  { patterns: [/\bferritin\b/i], unit: "ng/mL", range: "24–336" },
  { patterns: [/\bvit(?:amin)? d\b/i, /\b25-oh\b/i], unit: "ng/mL", range: "30–100" },
  { patterns: [/\bbun\b/i, /blood urea nitrogen/i], unit: "mg/dL", range: "7–20" },
  { patterns: [/\bsodium\b/i, /\bna\b/i], unit: "mmol/L", range: "136–145" },
  { patterns: [/\bpotassium\b/i, /\bk\b/i], unit: "mmol/L", range: "3.5–5.1" },
  { patterns: [/\bcalcium\b/i], unit: "mg/dL", range: "8.6–10.2" },
];

export function lookupCatalogLabRange(title: string): { unit: string; range: string } | null {
  const trimmed = title.trim();
  if (!trimmed) return null;
  for (const entry of LAB_RANGE_CATALOG) {
    if (entry.patterns.some((pattern) => pattern.test(trimmed))) {
      return { unit: entry.unit, range: entry.range };
    }
  }
  return null;
}

export type NormalizedLabResult = {
  value: string | null;
  unit: string | null;
  referenceRange: string | null;
  rangeSource: "document" | "catalog" | null;
  flag: "high" | "low" | null;
  summary: string | null;
};

function normalizeFlag(raw: unknown): "high" | "low" | null {
  const text = String(raw ?? "").trim().toLowerCase();
  if (!text) return null;
  if (/^(high|h|↑|elevated)$/.test(text)) return "high";
  if (/^(low|l|↓|decreased)$/.test(text)) return "low";
  return null;
}

export function formatLabSummary(params: {
  value: string | null;
  unit: string | null;
  referenceRange: string | null;
  rangeSource?: "document" | "catalog" | null;
}): string | null {
  const value = params.value?.trim();
  if (!value) return null;
  const unit = params.unit?.trim();
  const range = params.referenceRange?.trim();
  const valuePart = unit ? `${value} ${unit}` : value;
  if (!range) return valuePart;
  const prefix = params.rangeSource === "catalog" ? "ref " : "ref ";
  return `${valuePart} · ${prefix}${range}`;
}

export function normalizeLabResultFields(params: {
  title: string;
  value?: unknown;
  unit?: unknown;
  range?: unknown;
  reference_range?: unknown;
  flag?: unknown;
  summary?: unknown;
}): NormalizedLabResult {
  const value =
    params.value != null && String(params.value).trim() ? String(params.value).trim() : null;
  let unit = params.unit != null && String(params.unit).trim() ? String(params.unit).trim() : null;
  let referenceRange =
    (params.range != null && String(params.range).trim() ? String(params.range).trim() : null) ||
    (params.reference_range != null && String(params.reference_range).trim()
      ? String(params.reference_range).trim()
      : null);
  let rangeSource: "document" | "catalog" | null = referenceRange ? "document" : null;

  if (value && !referenceRange) {
    const catalog = lookupCatalogLabRange(params.title);
    if (catalog) {
      referenceRange = catalog.range;
      if (!unit) unit = catalog.unit;
      rangeSource = "catalog";
    }
  }

  const flag = normalizeFlag(params.flag);
  const summary =
    (typeof params.summary === "string" && params.summary.trim() ? params.summary.trim() : null) ||
    formatLabSummary({ value, unit, referenceRange, rangeSource });

  return { value, unit, referenceRange, rangeSource, flag, summary };
}
