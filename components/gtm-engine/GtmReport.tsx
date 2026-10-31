"use client";

/**
 * /GTMENGINE's report on a table: headline counts, lines by status and by date, how complete each column is, then a
 * card for every column with its values and counts. It counts only the lines the table's filters let through and
 * reloads as they change; clicking a value (or "Empty") filters the table to it, which updates the report in turn.
 */
import { useEffect, useState } from "react";

import type { GtmColumnStats, GtmCondition, GtmCount, GtmStats } from "@/lib/gtm-engine/gtm-filters";
import type { GtmTable } from "@/lib/gtm-engine/gtm-tables";

const SUB = "text-[#2819109E]";
const MUTED = "text-[#28191080]";
const BAR = "#5A3A22";
const BAR_EMPTY = "#28191026";
const SHOWN = 8;

const pct = (n: number, of: number) => (of ? Math.round((n / of) * 1000) / 10 : 0);
const fmt = (n: number) => n.toLocaleString();

export function GtmReport({
  table,
  query,
  version,
  onPick,
  onClose,
}: {
  table: GtmTable;
  /** The table's filters as URL parameters, so the report counts the same lines. */
  query: string;
  /** Bumps when the table reloads (a line saved, an import), so the report follows. */
  version: number;
  onPick: (condition: GtmCondition) => void;
  onClose: () => void;
}) {
  const [stats, setStats] = useState<GtmStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let live = true;
    setLoading(true);
    fetch(`/api/gtm-engine/stats?${query}`, { cache: "no-store" })
      .then(async (res) => {
        const body = (await res.json()) as { ok: boolean; stats?: GtmStats; error?: string };
        if (!live) return;
        if (!res.ok || !body.stats) throw new Error(body.error ?? "Can't build the report.");
        setStats(body.stats);
        setError(null);
      })
      .catch((e) => live && setError(e instanceof Error ? e.message : "Can't build the report."))
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, [query, version]);

  const m = stats?.matching ?? 0;
  const pickEmpty = (field: string) => onPick({ field, op: "empty" });
  const pickValue = (field: string, value: string) => (value ? onPick({ field, op: "equals", value }) : pickEmpty(field));

  return (
    <div className="mx-[6px] mb-[8px] rounded-[21px] bg-[#FFFCF1] p-[12px] md:p-[18px]" aria-busy={loading}>
      <div className="flex flex-wrap items-center gap-[10px]">
        <div className="mr-auto min-w-0">
          <div className="text-[17px] leading-[22px] font-[700]">Report · {table.title}</div>
          <div className={`text-[13px] leading-[18px] ${MUTED}`}>
            {loading && !stats ? "Counting…" : stats && stats.matching !== stats.total ? `${fmt(stats.matching)} of ${fmt(stats.total)} lines match the filters.` : `All ${fmt(m)} lines.`}{" "}
            Click any value to show only those lines.
          </div>
        </div>
        {loading && stats && <span className={`text-[13px] font-[600] ${MUTED}`}>Updating…</span>}
        <button type="button" onClick={onClose} className="h-[36px] px-[14px] rounded-[10px] bg-[#F4EEDF] text-[14px] font-[600] hover:bg-[#EEE6D6]">
          Close report
        </button>
      </div>

      {error && <div className="mt-[10px] px-[14px] py-[10px] rounded-[14px] bg-[#FCCFB8] text-[14px] font-[600]">{error}</div>}

      {stats && (
        <>
          <div className="mt-[14px] grid grid-cols-2 md:grid-cols-4 gap-[8px]">
            <Tile label="Lines" value={fmt(m)} hint={stats.matching !== stats.total ? `of ${fmt(stats.total)}` : "in the table"} />
            {stats.withEmail !== null && (
              <>
                <Tile label="With email" value={fmt(stats.withEmail)} hint={`${pct(stats.withEmail, m)}%`} onClick={() => onPick({ field: "_email", op: "not_empty" })} />
                <Tile label="Without email" value={fmt(m - stats.withEmail)} hint={`${pct(m - stats.withEmail, m)}%`} onClick={() => onPick({ field: "_email", op: "empty" })} />
              </>
            )}
            <Tile
              label="Dates entered"
              value={fmt(stats.entryDates.length)}
              hint={stats.entryDates[0]?.value ? `latest ${stats.entryDates[0].value}` : "none"}
            />
          </div>

          <div className="mt-[14px] grid gap-[8px] md:grid-cols-2">
            <Card title="Status">
              <Bars items={stats.status} of={m} emptyLabel="No status" onPick={(v) => pickValue("_status", v)} />
            </Card>
            <Card title="Lines by date entered">
              <Bars items={stats.entryDates.slice(0, 14)} of={m} emptyLabel="No date" onPick={(v) => (v ? onPick({ field: "_entry_date", op: "on", value: v }) : undefined)} sortByCount={false} />
            </Card>
            <Card title="Lines by report date">
              <Bars items={stats.reportDates.slice(0, 14)} of={m} emptyLabel="No report date" onPick={(v) => (v ? onPick({ field: "_report_date", op: "on", value: v }) : pickEmpty("_report_date"))} sortByCount={false} />
            </Card>
            <Card title="How complete each column is">
              <ul className="flex flex-col gap-[5px]">
                {stats.columns.map((c) => (
                  <li key={c.key}>
                    <button type="button" onClick={() => pickEmpty(c.key)} title={`${c.label}: ${fmt(c.filled)} filled, ${fmt(c.empty)} empty. Click to show the empty ones.`} className="group w-full grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_56px] items-center gap-[10px] text-left rounded-[8px] px-[4px] py-[2px] hover:bg-[#F4EEDF]">
                      <span className="truncate text-[13px] font-[600]">{c.label}</span>
                      <Meter value={c.filled} of={m} />
                      <span className="text-right text-[12.5px] font-[600] tabular-nums">{pct(c.filled, m)}%</span>
                    </button>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <div className={`mt-[18px] mb-[8px] text-[12px] font-[600] uppercase tracking-[0.08em] ${MUTED}`}>Every column</div>
          <div className="grid items-start gap-[8px] md:grid-cols-2 xl:grid-cols-3">
            {stats.columns.map((c) => (
              <ColumnCard key={c.key} column={c} of={m} onPick={(v) => pickValue(c.key, v)} onPickEmpty={() => pickEmpty(c.key)} onPickFilled={() => onPick({ field: c.key, op: "not_empty" })} onPickDomain={(d) => onPick({ field: c.key, op: "contains", value: d })} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Tile({ label, value, hint, onClick }: { label: string; value: string; hint: string; onClick?: () => void }) {
  const body = (
    <>
      <div className={`text-[12px] font-[600] uppercase tracking-[0.08em] ${MUTED}`}>{label}</div>
      <div className="mt-[2px] text-[26px] leading-[32px] font-[700] tabular-nums">{value}</div>
      <div className={`text-[13px] font-[600] ${SUB}`}>{hint}</div>
    </>
  );
  return onClick ? (
    <button type="button" onClick={onClick} className="text-left rounded-[16px] bg-[#F4EEDF] px-[14px] py-[10px] hover:bg-[#EEE6D6] transition-colors duration-150">
      {body}
    </button>
  ) : (
    <div className="rounded-[16px] bg-[#F4EEDF] px-[14px] py-[10px]">{body}</div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[16px] border border-solid border-[#2819101A] p-[12px]">
      <div className="mb-[8px] text-[14px] font-[700]">{title}</div>
      {children}
    </div>
  );
}

function Meter({ value, of }: { value: number; of: number }) {
  return (
    <span className="relative block h-[8px] rounded-[4px]" style={{ background: BAR_EMPTY }}>
      <span className="absolute inset-y-0 left-0 rounded-[4px]" style={{ width: `${pct(value, of)}%`, background: BAR }} />
    </span>
  );
}

/** One bar per value, longest first; each a button that filters to it. */
function Bars({
  items,
  of,
  emptyLabel,
  onPick,
  limit,
  sortByCount = true,
}: {
  items: GtmCount[];
  of: number;
  emptyLabel: string;
  onPick: (value: string) => void;
  limit?: number;
  sortByCount?: boolean;
}) {
  const list = sortByCount ? [...items].sort((a, b) => b.count - a.count) : items;
  const shown = limit ? list.slice(0, limit) : list;
  if (!shown.length) return <div className={`text-[13px] ${SUB}`}>Nothing yet.</div>;
  const max = Math.max(...shown.map((i) => i.count), 1);
  return (
    <ul className="flex flex-col gap-[3px]">
      {shown.map((item) => (
        <li key={item.value || "__empty"}>
          <button
            type="button"
            onClick={() => onPick(item.value)}
            title={`${item.value || emptyLabel}: ${fmt(item.count)} (${pct(item.count, of)}%)`}
            className="w-full grid grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_76px] items-center gap-[10px] text-left rounded-[8px] px-[4px] py-[3px] hover:bg-[#F4EEDF]"
          >
            <span className={`truncate text-[13px] font-[600] ${item.value ? "" : SUB}`}>{item.value || emptyLabel}</span>
            <span className="relative block h-[8px]">
              <span className="absolute inset-y-0 left-0 rounded-r-[4px]" style={{ width: `${Math.max(2, (item.count / max) * 100)}%`, background: item.value ? BAR : BAR_EMPTY }} />
            </span>
            <span className="text-right text-[12.5px] font-[600] tabular-nums">
              {fmt(item.count)} <span className={MUTED}>{pct(item.count, of)}%</span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

function ColumnCard({
  column: c,
  of,
  onPick,
  onPickEmpty,
  onPickFilled,
  onPickDomain,
}: {
  column: GtmColumnStats;
  of: number;
  onPick: (value: string) => void;
  onPickEmpty: () => void;
  onPickFilled: () => void;
  onPickDomain: (domain: string) => void;
}) {
  const [all, setAll] = useState(false);
  const [view, setView] = useState<"values" | "domains">("values");
  const items = view === "domains" && c.domains ? c.domains : c.values;
  return (
    <div className="rounded-[16px] border border-solid border-[#2819101A] p-[12px]">
      <div className="flex items-baseline gap-[8px]">
        <span className="mr-auto text-[14px] font-[700] truncate">{c.label}</span>
        <span className={`text-[12.5px] font-[600] tabular-nums ${MUTED}`}>{fmt(c.unique)} unique</span>
      </div>
      <div className="mt-[8px] flex gap-[6px]">
        <button type="button" onClick={onPickFilled} className="flex-1 rounded-[10px] bg-[#F4EEDF] px-[10px] py-[6px] text-left hover:bg-[#EEE6D6]">
          <div className={`text-[11.5px] font-[600] uppercase tracking-[0.06em] ${MUTED}`}>Filled</div>
          <div className="text-[16px] font-[700] tabular-nums">
            {fmt(c.filled)} <span className={`text-[12.5px] ${MUTED}`}>{pct(c.filled, of)}%</span>
          </div>
        </button>
        <button type="button" onClick={onPickEmpty} className="flex-1 rounded-[10px] bg-[#F4EEDF] px-[10px] py-[6px] text-left hover:bg-[#EEE6D6]">
          <div className={`text-[11.5px] font-[600] uppercase tracking-[0.06em] ${MUTED}`}>Empty</div>
          <div className="text-[16px] font-[700] tabular-nums">
            {fmt(c.empty)} <span className={`text-[12.5px] ${MUTED}`}>{pct(c.empty, of)}%</span>
          </div>
        </button>
      </div>
      {c.domains && c.domains.length > 0 && (
        <div className="mt-[8px] flex gap-[4px]">
          {(["values", "domains"] as const).map((v) => (
            <button key={v} type="button" onClick={() => setView(v)} className={`h-[26px] px-[10px] rounded-full text-[12px] font-[600] ${view === v ? "bg-[#3A2516] text-[#FFFCF1]" : "bg-[#F4EEDF] hover:bg-[#EEE6D6]"}`}>
              {v === "values" ? "Values" : "Domains"}
            </button>
          ))}
        </div>
      )}
      <div className="mt-[8px]">
        <Bars items={items} of={of} emptyLabel="Empty" onPick={view === "domains" ? onPickDomain : onPick} limit={all ? undefined : SHOWN} />
      </div>
      {items.length > SHOWN && (
        <button type="button" onClick={() => setAll((a) => !a)} className="mt-[6px] h-[28px] px-[10px] rounded-[8px] text-[13px] font-[600] hover:bg-[#F4EEDF]">
          {all ? "Show fewer" : `Show all ${fmt(items.length)}${items.length >= 250 ? "+" : ""}`}
        </button>
      )}
    </div>
  );
}
