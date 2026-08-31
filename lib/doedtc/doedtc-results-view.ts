import type { DoeDtcResultKind, DoeDtcResultRow } from "@/lib/doedtc/doedtc-types";

export type { DoeDtcResultKind };

export type DoeDtcLabCategory =
  | "general"
  | "metabolic"
  | "kidney"
  | "liver"
  | "lipids"
  | "thyroid"
  | "inflammation"
  | "other";

export type DoeDtcLabSpan = "single" | "wide" | "tall";

export type DoeDtcLabFlag = "high" | "low";

export type DoeDtcResultView = DoeDtcResultRow & {
  kind: DoeDtcResultKind;
  category: DoeDtcLabCategory;
  reading: { value: string; detail: string } | null;
  flag: DoeDtcLabFlag | null;
};

const LAB_CATEGORY_ORDER: DoeDtcLabCategory[] = [
  "general",
  "metabolic",
  "kidney",
  "liver",
  "lipids",
  "thyroid",
  "inflammation",
  "other",
];

const IMAGING_RE =
  /\b(x-?ray|radiograph|ct|mri|ultrasound|sonogram|echo|mammogram|pet|scan|imaging|dexa|spirometry|pft|pulmonary function)\b/i;
const MICRO_RE =
  /\b(culture|gram stain|c\.?\s*diff|mrsa|swab|naat|pcr|pathogen|sensitivity|afb|organism|urine culture|blood culture|sputum|wound culture)\b/i;
const PANEL_RE = /\b(panel|cbc|cmp|bmp|lft|lipid|complete blood|metabolic panel|liver function)\b/i;

const CATEGORY_MATCHERS: Array<{ category: DoeDtcLabCategory; pattern: RegExp }> = [
  { category: "kidney", pattern: /\b(creatinine|egfr|gfr|bun|urea|cystatin|microalbumin|acr)\b/i },
  { category: "liver", pattern: /\b(alt|ast|alp|alkaline|bilirubin|ggt|lft|hepatic|liver)\b/i },
  { category: "lipids", pattern: /\b(ldl|hdl|cholesterol|trig|lipid|non-hdl)\b/i },
  { category: "thyroid", pattern: /\b(tsh|free t4|free t3|t4|t3|thyroid)\b/i },
  { category: "inflammation", pattern: /\b(crp|esr|hs-crp|sed rate)\b/i },
  { category: "metabolic", pattern: /\b(glucose|a1c|hba1c|bmp|cmp|sodium|potassium|calcium|bicarbonate|anion)\b/i },
  { category: "general", pattern: /\b(cbc|hemoglobin|haemoglobin|wbc|platelet|hematocrit|mcv|ferritin|iron|b12|vit)\b/i },
];

export function inferResultKind(row: Pick<DoeDtcResultRow, "title" | "summary" | "kind">): DoeDtcResultKind {
  if (row.kind === "lab" || row.kind === "imaging" || row.kind === "micro") return row.kind;
  const text = `${row.title} ${row.summary ?? ""}`;
  if (MICRO_RE.test(text)) return "micro";
  if (IMAGING_RE.test(text)) return "imaging";
  return "lab";
}

export function inferLabCategory(title: string): DoeDtcLabCategory {
  for (const matcher of CATEGORY_MATCHERS) {
    if (matcher.pattern.test(title)) return matcher.category;
  }
  return "other";
}

export function parseResultReading(summary: string | null): { value: string; detail: string } | null {
  if (!summary) return null;
  const trimmed = summary.trim();
  const match = trimmed.match(/^([+-]?\d+(?:\.\d+)?)\s*([^\s·•,]+)?(?:\s*[·•,-]\s*(.*))?$/);
  if (!match) return null;
  if (trimmed.split(/\s+/).length > 10) return null;
  const detail = [match[2], match[3]].filter(Boolean).join(" · ");
  return { value: match[1], detail };
}

function parseLabRange(text: string): { min?: number; max?: number; minInclusive?: boolean; maxInclusive?: boolean } | null {
  const span = text.match(/(\d+(?:\.\d+)?)\s*[–\-]\s*(\d+(?:\.\d+)?)/);
  if (span) return { min: Number(span[1]), max: Number(span[2]), minInclusive: true, maxInclusive: true };
  const lt = text.match(/(≤|<)\s*(\d+(?:\.\d+)?)/);
  if (lt) return { max: Number(lt[2]), maxInclusive: lt[1] === "≤" };
  const gt = text.match(/(≥|>)\s*(\d+(?:\.\d+)?)/);
  if (gt) return { min: Number(gt[2]), minInclusive: gt[1] === "≥" };
  return null;
}

export function inferLabFlag(summary: string | null, reading = parseResultReading(summary)): DoeDtcLabFlag | null {
  if (!summary) return null;
  if (/\b(high|elevated|↑)\b/i.test(summary)) return "high";
  if (/\b(low|decreased|↓)\b/i.test(summary)) return "low";
  if (!reading) return null;
  const value = Number(reading.value);
  if (!Number.isFinite(value)) return null;
  const range = parseLabRange(summary.slice(summary.indexOf(reading.value) + reading.value.length));
  if (!range) return null;
  if (range.max != null) {
    const over = range.maxInclusive ? value > range.max : value >= range.max;
    if (over) return "high";
  }
  if (range.min != null) {
    const under = range.minInclusive ? value < range.min : value <= range.min;
    if (under) return "low";
  }
  return null;
}

export function toResultView(row: DoeDtcResultRow): DoeDtcResultView {
  const kind = inferResultKind(row);
  const reading = kind === "lab" ? parseResultReading(row.summary) : null;
  return {
    ...row,
    kind,
    category: kind === "lab" ? inferLabCategory(row.title) : "other",
    reading,
    flag: kind === "lab" ? inferLabFlag(row.summary, reading) : null,
  };
}

export function partitionResults(rows: DoeDtcResultRow[]): {
  labs: DoeDtcResultView[];
  imaging: DoeDtcResultView[];
  micro: DoeDtcResultView[];
} {
  const views = rows.map(toResultView);
  const byDate = (a: DoeDtcResultView, b: DoeDtcResultView) =>
    String(b.resulted_at).localeCompare(String(a.resulted_at));
  return {
    labs: views.filter((row) => row.kind === "lab").sort(byDate),
    imaging: views.filter((row) => row.kind === "imaging").sort(byDate),
    micro: views.filter((row) => row.kind === "micro").sort(byDate),
  };
}

export function groupLabsByCategory(
  labs: DoeDtcResultView[],
): Array<{ category: DoeDtcLabCategory; tiles: Array<DoeDtcResultView & { span: DoeDtcLabSpan }> }> {
  const buckets = new Map<DoeDtcLabCategory, DoeDtcResultView[]>();
  for (const lab of labs) {
    const list = buckets.get(lab.category) ?? [];
    list.push(lab);
    buckets.set(lab.category, list);
  }
  return LAB_CATEGORY_ORDER.filter((category) => buckets.has(category)).map((category) => ({
    category,
    tiles: layoutLabTiles(buckets.get(category) ?? []),
  }));
}

export function layoutLabTiles(
  rows: DoeDtcResultView[],
): Array<DoeDtcResultView & { span: DoeDtcLabSpan }> {
  const out: Array<DoeDtcResultView & { span: DoeDtcLabSpan }> = [];
  let index = 0;
  while (index < rows.length) {
    const current = rows[index];
    const left = rows.length - index;
    if (PANEL_RE.test(current.title) && left !== 2) {
      out.push({ ...current, span: "wide" });
      index += 1;
      continue;
    }
    if (left === 1) {
      out.push({ ...current, span: "wide" });
      index += 1;
    } else if (left === 2) {
      out.push({ ...rows[index], span: "single" }, { ...rows[index + 1], span: "single" });
      index += 2;
    } else {
      out.push(
        { ...rows[index], span: "tall" },
        { ...rows[index + 1], span: "single" },
        { ...rows[index + 2], span: "single" },
      );
      index += 3;
    }
  }
  return out;
}
