"use client";

/**
 * /GTMENGINE — the GTM team's prospect tables, in /demo/clinic's frame: brown edge, cream box, sand cards. Health holds
 * clinics (US, Canada, Other, Multi-site) and hospital LOIs (with programs); Non-Health holds local services. Every
 * table shows 50 lines a page for an agent to fill, saves to Supabase as it goes (app/api/gtm-engine/rows), filters by
 * any column and by status, and gives each line a page (Generate) and a status.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { DISPLAY, DemoFrame } from "@/components/demo/DemoFrame";
import {
  GTM_PAGE_SIZE,
  GTM_STATUSES,
  HEALTH_SECTIONS,
  NON_HEALTH_SECTIONS,
  type GtmColumn,
  type GtmRow,
  type GtmSection,
  type GtmStatus,
  type GtmTable,
} from "@/lib/gtm-engine/gtm-tables";

type Mode = "health" | "non-health";

const SUB = "text-[#2819109E]";
const MUTED = "text-[#28191080]";
const API = "/api/gtm-engine/rows";
/** The sheet's own columns after the table's: the line number, Page and Status. */
const NUM_W = 52;
const PAGE_W = 132;
const STATUS_W = 150;
const FILTER_DEBOUNCE_MS = 320;

export function GtmEnginePage() {
  const [mode, setMode] = useState<Mode>("health");
  const sections = mode === "health" ? HEALTH_SECTIONS : NON_HEALTH_SECTIONS;
  return (
    <DemoFrame right={<ModeSwitch mode={mode} onChange={setMode} />}>
      <main className="mx-auto w-full max-w-[1480px] px-[14px] md:px-[32px] pt-[8px] pb-[48px] md:pb-[64px]">
        <h1 className={`${DISPLAY} px-[4px] text-[34px] leading-[38px] md:text-[48px] md:leading-[52px] tracking-[-0.02em]`}>GTM Engine</h1>
        <p className={`mt-[8px] px-[4px] max-w-[60ch] text-[15px] leading-[22px] md:text-[16px] md:leading-[24px] ${SUB}`}>
          {mode === "health" ? "Clinics, multi-site groups and hospital LOIs." : "Local services businesses."} Every line saves as you go. Filter any
          column from the row under its name.
        </p>
        <div key={mode} className="mt-[22px] md:mt-[28px] flex flex-col gap-[28px] md:gap-[36px]">
          {sections.map((section) => (
            <Section key={section.title} section={section} />
          ))}
        </div>
      </main>
    </DemoFrame>
  );
}

/** Health / Non-Health, top right of the nav. */
function ModeSwitch({ mode, onChange }: { mode: Mode; onChange: (mode: Mode) => void }) {
  return (
    <div role="tablist" aria-label="Market" className="flex items-center gap-[2px] p-[4px] rounded-full bg-[#F4EEDF]">
      {(
        [
          ["health", "Health"],
          ["non-health", "Non-Health"],
        ] as const
      ).map(([id, label]) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={mode === id}
          onClick={() => onChange(id)}
          className={`h-[34px] md:h-[36px] px-[12px] md:px-[16px] rounded-full text-[13px] md:text-[14px] font-[600] whitespace-nowrap transition-colors duration-150 ${mode === id ? "bg-[#140C04] text-[#FFFCF1]" : `${SUB} hover:text-[#281910]`}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

/** A section's title, a switch between its tables when it has more than one, and the table on show. */
function Section({ section }: { section: GtmSection }) {
  const [active, setActive] = useState(section.tables[0]!.key);
  const table = section.tables.find((t) => t.key === active) ?? section.tables[0]!;
  return (
    <section>
      <div className="px-[4px] flex flex-wrap items-center gap-x-[14px] gap-y-[10px]">
        <h2 className={`${DISPLAY} text-[26px] leading-[30px] md:text-[32px] md:leading-[36px] tracking-[-0.02em]`}>{section.title}</h2>
        {section.tables.length > 1 && (
          <div className="flex flex-wrap gap-[6px]">
            {section.tables.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setActive(t.key)}
                className={`h-[34px] px-[14px] rounded-full text-[13.5px] font-[600] transition-colors duration-150 ${t.key === active ? "bg-[#140C04] text-[#FFFCF1]" : "bg-[#F4EEDF] text-[#281910] hover:bg-[#EEE6D6]"}`}
              >
                {t.title}
              </button>
            ))}
          </div>
        )}
      </div>
      <TableCard key={table.key} table={table} />
    </section>
  );
}

type Filters = { status: string; columns: Record<string, string> };

/** One table: its toolbar, the sheet of 50 lines, and the pager. */
function TableCard({ table }: { table: GtmTable }) {
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState<GtmRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({ status: "", columns: {} });
  const [applied, setApplied] = useState<Filters>(filters);
  const [adding, setAdding] = useState(false);
  const [focusId, setFocusId] = useState<string | null>(null);
  const request = useRef(0);

  // Typing in a filter waits a beat before asking again.
  useEffect(() => {
    const id = window.setTimeout(() => {
      setApplied(filters);
      setPage(0);
    }, FILTER_DEBOUNCE_MS);
    return () => window.clearTimeout(id);
  }, [filters]);

  const load = useCallback(
    async (target: number) => {
      const n = ++request.current;
      setLoading(true);
      const params = new URLSearchParams({ table: table.key, page: String(target) });
      if (applied.status) params.set("status", applied.status);
      for (const [key, value] of Object.entries(applied.columns)) if (value.trim()) params.set(`f.${key}`, value.trim());
      try {
        const res = await fetch(`${API}?${params}`, { cache: "no-store" });
        const body = (await res.json()) as { ok: boolean; rows?: GtmRow[]; total?: number; error?: string };
        if (n !== request.current) return;
        if (!res.ok || !body.ok) throw new Error(body.error ?? "Can't read the table.");
        setRows(body.rows ?? []);
        setTotal(body.total ?? 0);
        setError(null);
      } catch (e) {
        if (n === request.current) setError(e instanceof Error ? e.message : "Can't read the table.");
      } finally {
        if (n === request.current) setLoading(false);
      }
    },
    [table.key, applied],
  );

  useEffect(() => {
    void load(page);
  }, [load, page]);

  const filtering = !!applied.status || Object.values(applied.columns).some((v) => v.trim());
  const pages = Math.max(1, Math.ceil(total / GTM_PAGE_SIZE));
  // Blank lines make up the page to 50 for an agent to fill; not while filtering, where they'd read as matches.
  const blanks = filtering || loading ? 0 : Math.max(0, GTM_PAGE_SIZE - rows.length);

  const replaceRow = useCallback((row: GtmRow) => setRows((list) => list.map((r) => (r.id === row.id ? row : r))), []);

  const createRow = useCallback(
    async (data: Record<string, string>, status?: GtmStatus | null) => {
      const res = await fetch(API, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ table: table.key, data }) });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; row?: GtmRow; error?: string };
      if (!res.ok || !body.row) throw new Error(body.error ?? "Can't add the row.");
      let row = body.row;
      if (status) row = (await patchRow(table.key, row.id, { status })) ?? row;
      setRows((list) => [...list, row]);
      setTotal((t) => t + 1);
      return row;
    },
    [table.key],
  );

  /** + Add Field: a new line at the end, opened on the page it lands on with its first cell focused. */
  const addLine = async () => {
    setAdding(true);
    try {
      setFilters({ status: "", columns: {} });
      setApplied({ status: "", columns: {} });
      const row = await createRow({});
      const last = Math.floor(total / GTM_PAGE_SIZE);
      setFocusId(row.id);
      if (last !== page) setPage(last);
      else await load(page);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Can't add the row.");
    } finally {
      setAdding(false);
    }
  };

  const width = NUM_W + table.columns.reduce((n, c) => n + c.width, 0) + PAGE_W + STATUS_W;
  const first = page * GTM_PAGE_SIZE;

  return (
    <div className="mt-[14px] rounded-[26px] bg-[#F4EEDF] p-[6px]">
      <div className="flex flex-wrap items-center gap-[10px] px-[12px] pt-[10px] pb-[12px] md:px-[16px]">
        <div className="min-w-0 mr-auto">
          <div className="text-[17px] leading-[22px] md:text-[18px] md:leading-[24px] font-[600]">{table.title}</div>
          <div className={`text-[13px] leading-[18px] ${MUTED}`}>
            {total} {total === 1 ? "line" : "lines"}
            {filtering ? " match" : ""}
            {table.note ? ` · ${table.note}` : ""}
          </div>
        </div>
        <label className="flex items-center gap-[8px]">
          <span className={`text-[12px] font-[600] uppercase tracking-[0.08em] ${MUTED}`}>Status</span>
          <select
            value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
            className="h-[38px] pl-[12px] pr-[30px] rounded-[12px] bg-[#FFFCF1] text-[14px] font-[600] outline-none focus:ring-[2px] focus:ring-[#28191033]"
          >
            <option value="">All</option>
            <option value="none">No status</option>
            {GTM_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={() => void addLine()}
          disabled={adding}
          className="h-[38px] pl-[12px] pr-[16px] flex items-center gap-[6px] rounded-[12px] bg-[#140C04] text-[#FFFCF1] text-[14px] font-[600] hover:bg-[#2A1C12] disabled:opacity-60 transition-colors duration-150"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          Add Field
        </button>
      </div>

      {error && <div className="mx-[6px] mb-[8px] px-[14px] py-[10px] rounded-[14px] bg-[#FCCFB8] text-[14px] font-[600]">{error}</div>}

      <div className="rounded-[21px] bg-[#FFFCF1] overflow-hidden">
        <div className="overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]">
          <table className="border-separate border-spacing-0 text-[14px] leading-[19px]" style={{ width, minWidth: "100%" }}>
            <colgroup>
              <col style={{ width: NUM_W }} />
              {table.columns.map((c) => (
                <col key={c.key} style={{ width: c.width }} />
              ))}
              <col style={{ width: PAGE_W }} />
              <col style={{ width: STATUS_W }} />
            </colgroup>
            <thead>
              <tr>
                <th className={`sticky left-0 z-[2] bg-[#FFFCF1] ${HEAD} text-center`}>#</th>
                {table.columns.map((c) => (
                  <th key={c.key} className={HEAD}>
                    {c.label}
                  </th>
                ))}
                <th className={HEAD}>Page</th>
                <th className={HEAD}>Status</th>
              </tr>
              <tr>
                <th className={`sticky left-0 z-[2] bg-[#FFFCF1] ${FILTER_CELL}`}>
                  <svg width="15" height="15" viewBox="0 0 24 24" className="mx-auto" aria-label="Filters">
                    <path d="M4 6h16M7 12h10M10 18h4" fill="none" stroke="#28191080" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </th>
                {table.columns.map((c) => (
                  <th key={c.key} className={FILTER_CELL}>
                    <FilterInput column={c} value={filters.columns[c.key] ?? ""} onChange={(v) => setFilters((f) => ({ ...f, columns: { ...f.columns, [c.key]: v } }))} />
                  </th>
                ))}
                <th className={FILTER_CELL} />
                <th className={FILTER_CELL} />
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <Line key={row.id} n={first + i + 1} table={table} row={row} autoFocus={row.id === focusId} onSaved={replaceRow} onError={setError} />
              ))}
              {Array.from({ length: blanks }, (_, i) => (
                <BlankLine key={`blank-${page}-${i}`} n={first + rows.length + i + 1} table={table} onCreate={createRow} onError={setError} />
              ))}
              {!loading && !rows.length && filtering && (
                <tr>
                  <td colSpan={table.columns.length + 3} className={`px-[16px] py-[18px] text-[14px] ${SUB}`}>
                    No lines match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between gap-[10px] px-[12px] pt-[10px] pb-[6px] md:px-[16px]">
        <span className={`text-[13px] font-[600] tabular-nums ${MUTED}`}>
          {loading ? "Loading…" : total ? `${first + 1}–${Math.min(total, first + GTM_PAGE_SIZE)} of ${total}` : "Empty"}
        </span>
        <div className="flex items-center gap-[6px]">
          <PagerButton label="Previous page" disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))} d="M15 6l-6 6 6 6" />
          <span className="text-[13px] font-[600] tabular-nums px-[4px]">
            {page + 1} / {pages}
          </span>
          <PagerButton label="Next page" disabled={page >= pages - 1} onClick={() => setPage((p) => p + 1)} d="M9 6l6 6-6 6" />
        </div>
      </div>
    </div>
  );
}

const HEAD = `text-left align-bottom px-[10px] pt-[12px] pb-[6px] text-[11.5px] leading-[15px] font-[600] uppercase tracking-[0.06em] ${MUTED} border-b border-solid border-[#2819100F]`;
const FILTER_CELL = "px-[4px] py-[6px] bg-[#FBF6E9] border-b border-solid border-[#2819101A]";
const CELL = "px-[4px] py-[3px] border-b border-solid border-[#2819100D]";
const INPUT =
  "w-full h-[36px] px-[8px] rounded-[9px] bg-[#FBF6E9] text-[14px] text-[#281910] placeholder:text-[#28191040] outline-none hover:bg-[#F4EEDF80] focus:bg-[#F4EEDF] transition-colors duration-100";

function FilterInput({ column, value, onChange }: { column: GtmColumn; value: string; onChange: (value: string) => void }) {
  if (column.options)
    return (
      <select value={value} onChange={(e) => onChange(e.target.value)} aria-label={`Filter ${column.label}`} className={`${INPUT} bg-[#FFFCF1] font-[500]`}>
        <option value="">All</option>
        {column.options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    );
  return <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Filter" aria-label={`Filter ${column.label}`} className={`${INPUT} bg-[#FFFCF1]`} />;
}

function PagerButton({ label, disabled, onClick, d }: { label: string; disabled: boolean; onClick: () => void; d: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="w-[36px] h-[36px] flex items-center justify-center rounded-full bg-[#FFFCF1] hover:bg-[#FAF4E4] disabled:opacity-40 transition-colors duration-150"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
        <path d={d} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

async function patchRow(table: string, id: string, update: { data?: Record<string, string>; status?: GtmStatus | null }): Promise<GtmRow | null> {
  const res = await fetch(API, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ table, id, ...update }) });
  const body = (await res.json().catch(() => ({}))) as { row?: GtmRow; error?: string };
  if (!res.ok || !body.row) throw new Error(body.error ?? "Can't save the row.");
  return body.row;
}

/** A saved line: each cell saves when you leave it, the status when you pick one. */
function Line({
  n,
  table,
  row,
  autoFocus,
  onSaved,
  onError,
}: {
  n: number;
  table: GtmTable;
  row: GtmRow;
  autoFocus: boolean;
  onSaved: (row: GtmRow) => void;
  onError: (error: string) => void;
}) {
  const [draft, setDraft] = useState<Record<string, string>>(row.data ?? {});
  const [saving, setSaving] = useState(false);
  const saved = useRef(row.data ?? {});

  const save = async (next: Record<string, string>) => {
    if (table.columns.every((c) => (next[c.key] ?? "") === (saved.current[c.key] ?? ""))) return;
    setSaving(true);
    try {
      const updated = await patchRow(table.key, row.id, { data: next });
      if (updated) {
        saved.current = updated.data;
        onSaved(updated);
      }
    } catch (e) {
      onError(e instanceof Error ? e.message : "Can't save the row.");
    } finally {
      setSaving(false);
    }
  };

  const setStatus = async (status: GtmStatus | null) => {
    try {
      const updated = await patchRow(table.key, row.id, { status });
      if (updated) onSaved(updated);
    } catch (e) {
      onError(e instanceof Error ? e.message : "Can't save the status.");
    }
  };

  return (
    <LineCells
      n={n}
      table={table}
      values={draft}
      status={row.status}
      saving={saving}
      autoFocus={autoFocus}
      onChange={(key, value) => setDraft((d) => ({ ...d, [key]: value }))}
      onCommit={(key, value) => void save({ ...draft, [key]: value })}
      onStatus={(s) => void setStatus(s)}
    />
  );
}

/** One of the blank lines that fill out a page: it becomes a saved line once something is typed in it. */
function BlankLine({
  n,
  table,
  onCreate,
  onError,
}: {
  n: number;
  table: GtmTable;
  onCreate: (data: Record<string, string>, status?: GtmStatus | null) => Promise<GtmRow>;
  onError: (error: string) => void;
}) {
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const create = async (data: Record<string, string>, status?: GtmStatus | null) => {
    if (saving || (!status && !Object.values(data).some((v) => v.trim()))) return;
    setSaving(true);
    try {
      await onCreate(data, status);
      setDraft({});
    } catch (e) {
      onError(e instanceof Error ? e.message : "Can't add the row.");
    } finally {
      setSaving(false);
    }
  };
  return (
    <LineCells
      n={n}
      table={table}
      values={draft}
      status={null}
      saving={saving}
      blank
      onChange={(key, value) => setDraft((d) => ({ ...d, [key]: value }))}
      onCommit={(key, value) => void create({ ...draft, [key]: value })}
      onStatus={(s) => void create(draft, s)}
    />
  );
}

function LineCells({
  n,
  table,
  values,
  status,
  saving,
  blank = false,
  autoFocus = false,
  onChange,
  onCommit,
  onStatus,
}: {
  n: number;
  table: GtmTable;
  values: Record<string, string>;
  status: GtmStatus | null;
  saving: boolean;
  blank?: boolean;
  autoFocus?: boolean;
  onChange: (key: string, value: string) => void;
  onCommit: (key: string, value: string) => void;
  onStatus: (status: GtmStatus | null) => void;
}) {
  const firstRef = useRef<HTMLInputElement | HTMLSelectElement | null>(null);
  useEffect(() => {
    if (autoFocus) firstRef.current?.focus({ preventScroll: false });
  }, [autoFocus]);
  const tone = useMemo(() => (status ? STATUS_TONE[status] : "#FFFCF1"), [status]);

  return (
    <tr className="group">
      <td className={`sticky left-0 z-[1] bg-[#FFFCF1] ${CELL} text-center text-[12px] font-[600] tabular-nums ${blank ? "text-[#28191040]" : MUTED}`}>
        {saving ? <span className="inline-block w-[10px] h-[10px] rounded-full bg-[#28191033] animate-pulse" /> : n}
      </td>
      {table.columns.map((c, i) => {
        const value = values[c.key] ?? "";
        const ref = i === 0 ? (el: HTMLInputElement | HTMLSelectElement | null) => void (firstRef.current = el) : undefined;
        return (
          <td key={c.key} className={CELL}>
            {c.options ? (
              <select
                ref={ref}
                value={value}
                aria-label={`${c.label}, line ${n}`}
                onChange={(e) => {
                  onChange(c.key, e.target.value);
                  onCommit(c.key, e.target.value);
                }}
                className={`${INPUT} ${value ? "" : "text-[#28191066]"}`}
              >
                <option value="">—</option>
                {c.options.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            ) : (
              <input
                ref={ref}
                value={value}
                aria-label={`${c.label}, line ${n}`}
                onChange={(e) => onChange(c.key, e.target.value)}
                onBlur={(e) => onCommit(c.key, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                }}
                className={INPUT}
              />
            )}
          </td>
        );
      })}
      <td className={CELL}>
        {/* Page generation isn't wired up yet. */}
        <button
          type="button"
          className="w-full h-[34px] px-[12px] rounded-[10px] bg-[#140C04] text-[#FFFCF1] text-[13px] font-[600] hover:bg-[#2A1C12] transition-colors duration-150"
        >
          Generate
        </button>
      </td>
      <td className={CELL}>
        <select
          value={status ?? ""}
          aria-label={`Status, line ${n}`}
          onChange={(e) => onStatus((e.target.value || null) as GtmStatus | null)}
          className={`${INPUT} font-[600]`}
          style={{ backgroundColor: status ? tone : undefined }}
        >
          <option value="">—</option>
          {GTM_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </td>
    </tr>
  );
}

const STATUS_TONE: Record<GtmStatus, string> = {
  Sent: "#F3E7C9",
  Generated: "#EEEADF",
  Claimed: "#FCCFB8",
  Purchased: "#DCE5D0",
};
