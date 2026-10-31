/**
 * /GTMENGINE's deep filter and its report. A filter is a list of conditions on any column of a table (or on the
 * line's status, page, entry date and report date, or on "any email" / "any column"), all of which (or any of which)
 * a line must meet. The same filter narrows the saved table, the report and the export, on the client and the server.
 *
 * Filters only read rows; nothing here writes to `public.gtm_engine_rows`.
 */

import { GTM_STATUSES, type GtmRow, type GtmTable, isGtmDate } from "@/lib/gtm-engine/gtm-tables";

export const GTM_FILTER_OPS = {
  contains: "contains",
  not_contains: "doesn't contain",
  equals: "is",
  not_equals: "is not",
  in: "is any of",
  not_in: "is none of",
  starts_with: "starts with",
  ends_with: "ends with",
  empty: "is empty",
  not_empty: "is not empty",
  on: "is on",
  before: "is on or before",
  after: "is on or after",
  between: "is between",
} as const;
export type GtmFilterOp = keyof typeof GTM_FILTER_OPS;

const TEXT_OPS: GtmFilterOp[] = ["contains", "not_contains", "equals", "not_equals", "in", "not_in", "starts_with", "ends_with", "empty", "not_empty"];
const DATE_OPS: GtmFilterOp[] = ["on", "before", "after", "between", "empty", "not_empty"];
const PRESENCE_OPS: GtmFilterOp[] = ["not_empty", "empty", "contains", "not_contains", "ends_with"];

export type GtmCondition = { field: string; op: GtmFilterOp; value?: string; value2?: string; values?: string[] };
export type GtmFilter = { match: "all" | "any"; conditions: GtmCondition[] };

export const EMPTY_FILTER: GtmFilter = { match: "all", conditions: [] };

/** The fields a condition can test, beyond the table's own columns. */
export const META_FIELDS = {
  _any: "Any column",
  _email: "Any email",
  _status: "Status",
  _page: "Page",
  _entry_date: "Date entered",
  _report_date: "Report date",
} as const;

export type GtmField = { key: string; label: string; kind: "text" | "date" | "presence"; options?: readonly string[] };

/** Every field a filter on this table can use, in the order the filter builder lists them. */
export function filterFields(table: GtmTable): GtmField[] {
  const fields: GtmField[] = [{ key: "_any", label: META_FIELDS._any, kind: "text" }];
  if (emailKeys(table).length) fields.push({ key: "_email", label: META_FIELDS._email, kind: "presence" });
  for (const c of table.columns) fields.push({ key: c.key, label: c.label, kind: "text", options: c.options });
  fields.push(
    { key: "_status", label: META_FIELDS._status, kind: "text", options: GTM_STATUSES },
    { key: "_page", label: META_FIELDS._page, kind: "text" },
    { key: "_entry_date", label: META_FIELDS._entry_date, kind: "date" },
    { key: "_report_date", label: META_FIELDS._report_date, kind: "date" },
  );
  return fields;
}

export function opsFor(field: GtmField | undefined): GtmFilterOp[] {
  if (!field) return TEXT_OPS;
  return field.kind === "date" ? DATE_OPS : field.kind === "presence" ? PRESENCE_OPS : TEXT_OPS;
}

export const opNeedsValue = (op: GtmFilterOp) => op !== "empty" && op !== "not_empty";

export function emailKeys(table: GtmTable): string[] {
  return table.columns.filter((c) => c.email).map((c) => c.key);
}

/* -------------------------------------------------------------- Parsing */

const MAX_CONDITIONS = 40;
const MAX_VALUE = 500;

/** A filter read from untrusted JSON (a URL parameter), keeping only conditions this table can run. */
export function parseFilter(table: GtmTable, raw: unknown): GtmFilter {
  let value = raw;
  if (typeof value === "string") {
    try {
      value = JSON.parse(value);
    } catch {
      return EMPTY_FILTER;
    }
  }
  if (!value || typeof value !== "object") return EMPTY_FILTER;
  const obj = value as { match?: unknown; conditions?: unknown };
  const fields = new Map(filterFields(table).map((f) => [f.key, f]));
  const conditions: GtmCondition[] = [];
  for (const c of Array.isArray(obj.conditions) ? obj.conditions.slice(0, MAX_CONDITIONS) : []) {
    if (!c || typeof c !== "object") continue;
    const { field, op, value: v, value2, values } = c as Record<string, unknown>;
    if (typeof field !== "string" || typeof op !== "string") continue;
    const f = fields.get(field);
    if (!f || !(opsFor(f) as string[]).includes(op)) continue;
    const cond: GtmCondition = { field, op: op as GtmFilterOp };
    if (typeof v === "string") cond.value = v.slice(0, MAX_VALUE);
    if (typeof value2 === "string") cond.value2 = value2.slice(0, MAX_VALUE);
    if (Array.isArray(values)) cond.values = values.filter((x): x is string => typeof x === "string").slice(0, 200).map((x) => x.slice(0, MAX_VALUE));
    if (isActive(cond)) conditions.push(cond);
  }
  return { match: obj.match === "any" ? "any" : "all", conditions };
}

/** A condition with what it needs to run (a value, unless it tests emptiness). Half-filled ones are skipped. */
export function isActive(c: GtmCondition): boolean {
  if (!opNeedsValue(c.op)) return true;
  if (c.op === "in" || c.op === "not_in") return listOf(c).length > 0;
  if (c.op === "between") return isGtmDate(c.value) || isGtmDate(c.value2);
  if (c.op === "on" || c.op === "before" || c.op === "after") return isGtmDate(c.value);
  return !!c.value?.trim();
}

export const activeConditions = (filter: GtmFilter) => filter.conditions.filter(isActive);

/** An "any of" condition's values: its list, or its text split on commas. */
function listOf(c: GtmCondition): string[] {
  const list = c.values?.length ? c.values : (c.value ?? "").split(",");
  return list.map((v) => v.trim()).filter(Boolean);
}

/* -------------------------------------------------------------- Matching */

/** Values compare without case, accents or surrounding space. */
export const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, " ").trim();

/** The values a field has on a line: one for a column, several for "any email" / "any column". */
function valuesOf(table: GtmTable, row: GtmRow, field: string): string[] {
  const data = row.data ?? {};
  switch (field) {
    case "_any":
      return [...table.columns.map((c) => data[c.key] ?? ""), row.page ?? "", row.status ?? "", row.report_date ?? "", row.entry_date ?? ""];
    case "_email":
      return emailKeys(table).map((k) => data[k] ?? "");
    case "_status":
      return [row.status ?? ""];
    case "_page":
      return [row.page ?? ""];
    case "_entry_date":
      return [row.entry_date ?? ""];
    case "_report_date":
      return [row.report_date ?? ""];
    default:
      return [data[field] ?? ""];
  }
}

function test(op: GtmFilterOp, value: string, c: GtmCondition): boolean {
  const v = norm(value);
  const q = norm(c.value ?? "");
  switch (op) {
    case "contains":
      return v.includes(q);
    case "equals":
      return v === q;
    case "starts_with":
      return v.startsWith(q);
    case "ends_with":
      return v.endsWith(q);
    case "in":
      return listOf(c).some((x) => norm(x) === v);
    case "not_empty":
      return v !== "";
    case "on":
      return value === c.value;
    case "before":
      return !!value && value <= (c.value ?? "");
    case "after":
      return !!value && value >= (c.value ?? "");
    case "between": {
      if (!value) return false;
      const lo = isGtmDate(c.value) ? c.value : "";
      const hi = isGtmDate(c.value2) ? c.value2 : "9999-12-31";
      return value >= lo && value <= hi;
    }
    default:
      return false;
  }
}

/** The opposite tests: a line passes when none of its values meets the positive one. */
const NEGATED: Partial<Record<GtmFilterOp, GtmFilterOp>> = { not_contains: "contains", not_equals: "equals", not_in: "in", empty: "not_empty" };

export function meetsCondition(table: GtmTable, row: GtmRow, c: GtmCondition): boolean {
  const values = valuesOf(table, row, c.field);
  const positive = NEGATED[c.op];
  if (positive) return !values.some((v) => test(positive, v, c));
  return values.some((v) => test(c.op, v, c));
}

export function matchesFilter(table: GtmTable, row: GtmRow, filter: GtmFilter): boolean {
  const conditions = activeConditions(filter);
  if (!conditions.length) return true;
  return filter.match === "any" ? conditions.some((c) => meetsCondition(table, row, c)) : conditions.every((c) => meetsCondition(table, row, c));
}

/** A condition in words, for the chips above the table: "Country is Canada". */
export function describeCondition(table: GtmTable, c: GtmCondition): string {
  const field = filterFields(table).find((f) => f.key === c.field)?.label ?? c.field;
  const op = GTM_FILTER_OPS[c.op];
  if (!opNeedsValue(c.op)) return `${field} ${op}`;
  if (c.op === "in" || c.op === "not_in") return `${field} ${op} ${listOf(c).join(", ")}`;
  if (c.op === "between") return `${field} ${op} ${c.value || "…"} and ${c.value2 || "…"}`;
  return `${field} ${op} "${c.value}"`;
}

/* -------------------------------------------------------------- Report */

export type GtmCount = { value: string; count: number };

export type GtmColumnStats = {
  key: string;
  label: string;
  filled: number;
  empty: number;
  unique: number;
  /** Every value and how many lines have it, most first (the first 250). */
  values: GtmCount[];
  /** Email and web columns: the domains behind them. */
  domains?: GtmCount[];
};

export type GtmStats = {
  /** Lines in the table. */
  total: number;
  /** Lines that meet the filter; everything below counts only these. */
  matching: number;
  withEmail: number | null;
  status: GtmCount[];
  entryDates: GtmCount[];
  reportDates: GtmCount[];
  columns: GtmColumnStats[];
};

const MAX_VALUES = 250;

/** Counts values case-insensitively, showing each under its most common spelling. */
function tally(values: string[]): GtmCount[] {
  const groups = new Map<string, { count: number; spellings: Map<string, number> }>();
  for (const raw of values) {
    const value = raw.trim();
    if (!value) continue;
    const key = norm(value);
    const g = groups.get(key) ?? { count: 0, spellings: new Map() };
    g.count++;
    g.spellings.set(value, (g.spellings.get(value) ?? 0) + 1);
    groups.set(key, g);
  }
  return Array.from(groups.values())
    .map((g) => ({ value: Array.from(g.spellings).sort((a, b) => b[1] - a[1])[0]![0], count: g.count }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
}

function domainOf(value: string, email: boolean): string {
  const v = value.trim().toLowerCase();
  if (email) return v.includes("@") ? v.split("@").pop()! : "";
  try {
    return new URL(/^https?:\/\//.test(v) ? v : `https://${v}`).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

/** The report on a table's lines (already narrowed by the filter): every column's fill, values and counts. */
export function gtmStats(table: GtmTable, rows: GtmRow[], total: number): GtmStats {
  const emails = emailKeys(table);
  const columns: GtmColumnStats[] = table.columns.map((c) => {
    const raw = rows.map((r) => r.data?.[c.key] ?? "").filter((v) => v.trim());
    const counts = tally(raw);
    const out: GtmColumnStats = { key: c.key, label: c.label, filled: raw.length, empty: rows.length - raw.length, unique: counts.length, values: counts.slice(0, MAX_VALUES) };
    if (c.email || c.url) out.domains = tally(raw.map((v) => domainOf(v, !!c.email))).slice(0, MAX_VALUES);
    return out;
  });
  const status = tally(rows.map((r) => r.status ?? ""));
  const none = rows.filter((r) => !r.status).length;
  if (none) status.push({ value: "", count: none });
  const byDate = (get: (r: GtmRow) => string | null) => {
    const m = new Map<string, number>();
    for (const r of rows) {
      const d = get(r) ?? "";
      m.set(d, (m.get(d) ?? 0) + 1);
    }
    return Array.from(m).map(([value, count]) => ({ value, count })).sort((a, b) => b.value.localeCompare(a.value));
  };
  return {
    total,
    matching: rows.length,
    withEmail: emails.length ? rows.filter((r) => emails.some((k) => r.data?.[k]?.trim())).length : null,
    status,
    entryDates: byDate((r) => r.entry_date),
    reportDates: byDate((r) => r.report_date),
    columns,
  };
}
