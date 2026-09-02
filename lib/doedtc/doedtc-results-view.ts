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
  const byDate = (a: DoeDtcResultView, b: DoeDtcResultView) => compareResultsByRecency(b, a);
  return {
    labs: views.filter((row) => row.kind === "lab").sort(byDate),
    imaging: views.filter((row) => row.kind === "imaging").sort(byDate),
    micro: views.filter((row) => row.kind === "micro").sort(byDate),
  };
}

export function labTitleKey(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

export function resultedDateKey(value: string): string {
  const trimmed = value.trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) return trimmed.slice(0, 10);
  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return trimmed.slice(0, 10) || trimmed;
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function compareResultsByRecency(
  a: Pick<DoeDtcResultRow, "resulted_at" | "created_at" | "id">,
  b: Pick<DoeDtcResultRow, "resulted_at" | "created_at" | "id">,
): number {
  const date = resultedDateKey(a.resulted_at).localeCompare(resultedDateKey(b.resulted_at));
  if (date !== 0) return date;
  const created = String(a.created_at).localeCompare(String(b.created_at));
  if (created !== 0) return created;
  return a.id.localeCompare(b.id);
}

export type DoeDtcLabSeries = {
  key: string;
  latest: DoeDtcResultView;
  history: DoeDtcResultView[];
};

export function groupLabsByTitle(labs: DoeDtcResultView[]): DoeDtcLabSeries[] {
  const buckets = new Map<string, DoeDtcResultView[]>();
  for (const lab of labs) {
    const key = labTitleKey(lab.title) || lab.id;
    const list = buckets.get(key) ?? [];
    list.push(lab);
    buckets.set(key, list);
  }
  const series: DoeDtcLabSeries[] = [];
  for (const [key, rows] of Array.from(buckets.entries())) {
    const history = rows.slice().sort((a, b) => compareResultsByRecency(b, a));
    const latest = history[0];
    if (!latest) continue;
    series.push({ key, latest, history });
  }
  return series.sort((a, b) => compareResultsByRecency(b.latest, a.latest));
}

export function groupLabsByDrawDate(
  labs: DoeDtcResultView[],
): Array<{ dateKey: string; labs: DoeDtcResultView[]; source: string | null }> {
  const buckets = new Map<string, DoeDtcResultView[]>();
  for (const lab of labs) {
    const dateKey = resultedDateKey(lab.resulted_at);
    const list = buckets.get(dateKey) ?? [];
    list.push(lab);
    buckets.set(dateKey, list);
  }
  return Array.from(buckets.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([dateKey, rows]) => {
      const firstSource = rows[0]?.source?.trim() || "";
      const source =
        firstSource && rows.every((row) => (row.source?.trim() || "") === firstSource)
          ? firstSource
          : null;
      return {
        dateKey,
        labs: rows.slice().sort((a, b) => labTitleKey(a.title).localeCompare(labTitleKey(b.title))),
        source,
      };
    });
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
