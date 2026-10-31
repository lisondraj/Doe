"use client";

/**
 * /GTMENGINE's deep filter: quick picks (by country, with or without an email, website, phone, status), then any
 * number of conditions on any column, met all together or any one of them. The chips above the table show what's on.
 */
import { useMemo } from "react";

import {
  GTM_FILTER_OPS,
  type GtmCondition,
  type GtmFilter,
  type GtmFilterOp,
  activeConditions,
  describeCondition,
  emailKeys,
  filterFields,
  opNeedsValue,
  opsFor,
} from "@/lib/gtm-engine/gtm-filters";
import { GTM_COUNTRIES, GTM_STATUSES, type GtmTable } from "@/lib/gtm-engine/gtm-tables";

const MUTED = "text-[#28191080]";
const FIELD =
  "h-[36px] px-[10px] rounded-[10px] bg-[#FFFCF1] text-[14px] text-[#281910] font-[500] outline-none focus:ring-[2px] focus:ring-[#28191033] placeholder:text-[#28191040]";

type Preset = { id: string; label: string; condition: GtmCondition };

/** The quick picks a table offers, from the columns it has. */
function presetsFor(table: GtmTable): Preset[] {
  const has = (k: string) => table.columns.some((c) => c.key === k);
  const out: Preset[] = [];
  if (has("country") && !table.country) {
    for (const country of GTM_COUNTRIES) out.push({ id: `country-${country}`, label: `All ${country}`, condition: { field: "country", op: "equals", value: country } });
  }
  if (emailKeys(table).length) {
    out.push({ id: "email-yes", label: "With email", condition: { field: "_email", op: "not_empty" } });
    out.push({ id: "email-no", label: "Without email", condition: { field: "_email", op: "empty" } });
  }
  for (const [key, label] of [
    ["website", "website"],
    ["phone", "phone"],
    ["city", "city"],
  ] as const) {
    if (!has(key)) continue;
    out.push({ id: `${key}-yes`, label: `With ${label}`, condition: { field: key, op: "not_empty" } });
    out.push({ id: `${key}-no`, label: `Without ${label}`, condition: { field: key, op: "empty" } });
  }
  out.push({ id: "status-none", label: "No status", condition: { field: "_status", op: "empty" } });
  for (const s of GTM_STATUSES) out.push({ id: `status-${s}`, label: s, condition: { field: "_status", op: "equals", value: s } });
  return out;
}

const same = (a: GtmCondition, b: GtmCondition) => a.field === b.field && a.op === b.op && (a.value ?? "") === (b.value ?? "");

/** Adds a condition, replacing one on the same field that it contradicts (a second "Country is …", or empty vs not). */
export function withCondition(filter: GtmFilter, condition: GtmCondition): GtmFilter {
  const clashes = (c: GtmCondition) =>
    c.field === condition.field &&
    (["equals", "empty", "not_empty", "in"] as GtmFilterOp[]).includes(c.op) &&
    (["equals", "empty", "not_empty", "in"] as GtmFilterOp[]).includes(condition.op);
  return { ...filter, conditions: [...filter.conditions.filter((c) => !clashes(c)), condition] };
}

export function FilterChips({ table, filter, onChange }: { table: GtmTable; filter: GtmFilter; onChange: (filter: GtmFilter) => void }) {
  const active = activeConditions(filter);
  if (!active.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-[6px] px-[12px] pb-[10px] md:px-[16px]">
      <span className={`text-[12px] font-[600] uppercase tracking-[0.08em] ${MUTED}`}>{filter.match === "any" ? "Any of" : "All of"}</span>
      {active.map((c) => (
        <span key={`${c.field}-${c.op}-${c.value ?? ""}-${c.value2 ?? ""}`} className="h-[30px] pl-[11px] pr-[4px] flex items-center gap-[4px] rounded-full bg-[#3A2516] text-[#FFFCF1] text-[13px] font-[600]">
          <span className="max-w-[320px] truncate">{describeCondition(table, c)}</span>
          <button
            type="button"
            aria-label={`Remove ${describeCondition(table, c)}`}
            onClick={() => onChange({ ...filter, conditions: filter.conditions.filter((x) => x !== c) })}
            className="w-[22px] h-[22px] flex items-center justify-center rounded-full hover:bg-[#FFFCF133]"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
            </svg>
          </button>
        </span>
      ))}
      <button type="button" onClick={() => onChange({ ...filter, conditions: [] })} className="h-[30px] px-[10px] rounded-full text-[13px] font-[600] hover:bg-[#EEE6D6]">
        Clear all
      </button>
    </div>
  );
}

export function FilterBuilder({ table, filter, onChange, onClose }: { table: GtmTable; filter: GtmFilter; onChange: (filter: GtmFilter) => void; onClose: () => void }) {
  const fields = useMemo(() => filterFields(table), [table]);
  const presets = useMemo(() => presetsFor(table), [table]);

  const setCondition = (i: number, patch: Partial<GtmCondition>) =>
    onChange({ ...filter, conditions: filter.conditions.map((c, j) => (j === i ? { ...c, ...patch } : c)) });
  const add = () => onChange({ ...filter, conditions: [...filter.conditions, { field: fields[0]!.key, op: "contains", value: "" }] });

  return (
    <div className="mx-[6px] mb-[8px] rounded-[20px] bg-[#FBF6E9] p-[12px] md:p-[16px]">
      <div className="flex flex-wrap items-center gap-[10px]">
        <span className="text-[15px] font-[700] mr-auto">Filter</span>
        <label className="flex items-center gap-[8px] text-[14px] font-[600]">
          Show lines that meet
          <select value={filter.match} onChange={(e) => onChange({ ...filter, match: e.target.value === "any" ? "any" : "all" })} className={FIELD}>
            <option value="all">all conditions</option>
            <option value="any">any condition</option>
          </select>
        </label>
        <button type="button" onClick={onClose} className="h-[36px] px-[14px] rounded-[10px] bg-[#3A2516] text-[#FFFCF1] text-[14px] font-[600] hover:bg-[#4A3121]">
          Done
        </button>
      </div>

      <div className="mt-[12px]">
        <div className={`text-[12px] font-[600] uppercase tracking-[0.08em] ${MUTED}`}>Quick picks</div>
        <div className="mt-[6px] flex flex-wrap gap-[6px]">
          {presets.map((p) => {
            const on = filter.conditions.some((c) => same(c, p.condition));
            return (
              <button
                key={p.id}
                type="button"
                aria-pressed={on}
                onClick={() => onChange(on ? { ...filter, conditions: filter.conditions.filter((c) => !same(c, p.condition)) } : withCondition(filter, p.condition))}
                className={`h-[32px] px-[12px] rounded-full text-[13px] font-[600] transition-colors duration-150 ${on ? "bg-[#3A2516] text-[#FFFCF1]" : "bg-[#FFFCF1] hover:bg-[#EEE6D6]"}`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-[14px] flex flex-col gap-[8px]">
        <div className={`text-[12px] font-[600] uppercase tracking-[0.08em] ${MUTED}`}>Conditions</div>
        {filter.conditions.map((c, i) => {
          const field = fields.find((f) => f.key === c.field);
          const ops = opsFor(field);
          return (
            <div key={i} className="flex flex-wrap items-center gap-[6px]">
              <span className={`w-[44px] text-[13px] font-[600] ${MUTED}`}>{i === 0 ? "Where" : filter.match === "any" ? "or" : "and"}</span>
              <select
                value={c.field}
                aria-label="Field"
                onChange={(e) => {
                  const next = fields.find((f) => f.key === e.target.value);
                  const nextOps = opsFor(next);
                  setCondition(i, { field: e.target.value, op: nextOps.includes(c.op) ? c.op : nextOps[0]!, value: "", value2: "", values: [] });
                }}
                className={`${FIELD} max-w-[240px]`}
              >
                {fields.map((f) => (
                  <option key={f.key} value={f.key}>
                    {f.label}
                  </option>
                ))}
              </select>
              <select value={c.op} aria-label="Condition" onChange={(e) => setCondition(i, { op: e.target.value as GtmFilterOp })} className={FIELD}>
                {ops.map((op) => (
                  <option key={op} value={op}>
                    {GTM_FILTER_OPS[op]}
                  </option>
                ))}
              </select>
              {opNeedsValue(c.op) && <ConditionValue condition={c} options={field?.options} kind={field?.kind ?? "text"} onChange={(patch) => setCondition(i, patch)} />}
              <button
                type="button"
                aria-label="Remove condition"
                onClick={() => onChange({ ...filter, conditions: filter.conditions.filter((_, j) => j !== i) })}
                className="w-[34px] h-[34px] flex items-center justify-center rounded-full hover:bg-[#EEE6D6]"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          );
        })}
        <div className="flex flex-wrap gap-[6px]">
          <button type="button" onClick={add} className="h-[34px] px-[12px] flex items-center gap-[6px] rounded-[10px] bg-[#FFFCF1] text-[14px] font-[600] hover:bg-[#EEE6D6]">
            <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
            Add condition
          </button>
          {filter.conditions.length > 0 && (
            <button type="button" onClick={() => onChange({ ...filter, conditions: [] })} className="h-[34px] px-[12px] rounded-[10px] text-[14px] font-[600] hover:bg-[#EEE6D6]">
              Clear all
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ConditionValue({
  condition: c,
  options,
  kind,
  onChange,
}: {
  condition: GtmCondition;
  options?: readonly string[];
  kind: "text" | "date" | "presence";
  onChange: (patch: Partial<GtmCondition>) => void;
}) {
  if (kind === "date") {
    return (
      <>
        <input type="date" value={c.value ?? ""} onChange={(e) => onChange({ value: e.target.value })} aria-label="Date" className={FIELD} />
        {c.op === "between" && (
          <>
            <span className="text-[13px] font-[600]">and</span>
            <input type="date" value={c.value2 ?? ""} onChange={(e) => onChange({ value2: e.target.value })} aria-label="End date" className={FIELD} />
          </>
        )}
      </>
    );
  }
  if (options && (c.op === "in" || c.op === "not_in")) {
    const picked = new Set(c.values ?? []);
    return (
      <div className="flex flex-wrap gap-[4px]">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            aria-pressed={picked.has(o)}
            onClick={() => {
              const next = new Set(picked);
              if (next.has(o)) next.delete(o);
              else next.add(o);
              onChange({ values: Array.from(next) });
            }}
            className={`h-[32px] px-[10px] rounded-full text-[13px] font-[600] ${picked.has(o) ? "bg-[#3A2516] text-[#FFFCF1]" : "bg-[#FFFCF1] hover:bg-[#EEE6D6]"}`}
          >
            {o}
          </button>
        ))}
      </div>
    );
  }
  if (options && (c.op === "equals" || c.op === "not_equals")) {
    return (
      <select value={c.value ?? ""} onChange={(e) => onChange({ value: e.target.value })} aria-label="Value" className={FIELD}>
        <option value="">Pick…</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    );
  }
  return (
    <input
      value={c.value ?? ""}
      onChange={(e) => onChange({ value: e.target.value })}
      placeholder={c.op === "in" || c.op === "not_in" ? "Values, comma separated" : c.op === "ends_with" && c.field === "_email" ? "e.g. gmail.com" : "Value"}
      aria-label="Value"
      className={`${FIELD} w-[240px]`}
    />
  );
}
