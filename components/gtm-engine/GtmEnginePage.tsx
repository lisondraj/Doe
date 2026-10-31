"use client";

/**
 * /GTMENGINE — the GTM team's prospect tables, in /demo/clinic's frame: brown edge, cream box, sand cards. Health holds
 * clinics (US, Canada, Other, Multi-site) and hospital LOIs (with programs); Non-Health holds local services. Every
 * table's Add Field opens a separate input sheet of 50 lines to fill under a chosen date; the saved table below groups lines by date
 * (newest first, each date folding open and shut), saves to Supabase as it goes (app/api/gtm-engine/rows), filters by
 * any column and by status, and gives each line a page (Generate) and a status.
 */
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";

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

/**
 * One table: its toolbar; the input sheet, shown only after Add Field (50 blank lines under a picked date, its own
 * table); then the saved lines in a separate table, grouped under their dates, newest first, each group folding open
 * and shut. A pager steps through 50 saved lines at a time.
 */
function TableCard({ table }: { table: GtmTable }) {
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState<GtmRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({ status: "", columns: {} });
  const [applied, setApplied] = useState<Filters>(filters);
  /** The date the input sheet's lines save under. */
  const [bulkDate, setBulkDate] = useState(today);
  /** The input sheet stays hidden until Add Field. */
  const [bulkOpen, setBulkOpen] = useState(false);
  /** Date groups folded shut, by YYYY-MM-DD. */
  const [collapsed, setCollapsed] = useState<Set<string>>(() => new Set());
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

  const replaceRow = useCallback((row: GtmRow) => setRows((list) => list.map((r) => (r.id === row.id ? row : r))), []);

  /** A new saved line under the bulk input's date. The page reloads so it lands in its date's group. */
  const createRow = useCallback(
    async (data: Record<string, string>, status?: GtmStatus | null) => {
      const res = await fetch(API, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ table: table.key, data, entry_date: bulkDate, status: status ?? undefined }),
      });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; row?: GtmRow; error?: string };
      if (!res.ok || !body.row) throw new Error(body.error ?? "Can't add the row.");
      setCollapsed((set) => {
        if (!set.has(bulkDate)) return set;
        const next = new Set(set);
        next.delete(bulkDate);
        return next;
      });
      void load(page);
      return body.row;
    },
    [table.key, bulkDate, load, page],
  );

  /** + Add Field: opens the input sheet (50 blank lines under a picked date) above the saved table, and brings it into view. */
  const inputRef = useRef<HTMLDivElement | null>(null);
  const openInput = () => {
    setBulkOpen(true);
    window.requestAnimationFrame(() => inputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const width = NUM_W + table.columns.reduce((n, c) => n + c.width, 0) + PAGE_W + STATUS_W;
  const span = table.columns.length + 3;
  const first = page * GTM_PAGE_SIZE;
  /** Saved lines under their dates, newest date first (the order the API returns them in). */
  const groups = useMemo(() => {
    const out: { date: string; rows: { row: GtmRow; n: number }[] }[] = [];
    rows.forEach((row, i) => {
      const last = out[out.length - 1];
      const entry = { row, n: first + i + 1 };
      if (last?.date === row.entry_date) last.rows.push(entry);
      else out.push({ date: row.entry_date, rows: [entry] });
    });
    return out;
  }, [rows, first]);

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
          onClick={openInput}
          className="h-[38px] pl-[12px] pr-[8px] flex items-center gap-[6px] rounded-[12px] bg-[#140C04] text-[#FFFCF1] text-[14px] font-[600] hover:bg-[#2A1C12] transition-colors duration-150"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          Add Field
          <span className="ml-[2px] h-[22px] min-w-[30px] px-[7px] flex items-center justify-center rounded-full bg-[#FFFCF1] text-[#140C04] text-[12px] font-[700] tabular-nums">
            {GTM_PAGE_SIZE}
          </span>
        </button>
      </div>

      {error && <div className="mx-[6px] mb-[8px] px-[14px] py-[10px] rounded-[14px] bg-[#FCCFB8] text-[14px] font-[600]">{error}</div>}

      {/* Input sheet: its own table, hidden until Add Field. 50 blank lines that save under the date picked here, then clear. */}
      {bulkOpen && (
        <div ref={inputRef} className="mb-[6px] rounded-[21px] bg-[#140C04] p-[4px] scroll-mt-[16px]">
          <div className="flex flex-wrap items-center gap-x-[12px] gap-y-[8px] px-[12px] pt-[8px] pb-[10px]">
            <span className="text-[15px] font-[700] text-[#FFFCF1]">New lines</span>
            <label className="flex items-center gap-[8px]">
              <span className="text-[12px] font-[600] uppercase tracking-[0.08em] text-[#FFFCF199]">Date</span>
              <input
                type="date"
                value={bulkDate}
                onChange={(e) => e.target.value && setBulkDate(e.target.value)}
                className="h-[34px] px-[10px] rounded-[10px] bg-[#FFFCF1] text-[#281910] text-[14px] font-[600] outline-none"
              />
            </label>
            <span className="mr-auto text-[13px] text-[#FFFCF1B3]">
              {GTM_PAGE_SIZE} lines. Each one saves under {dayLabel(bulkDate)} and moves to the table below.
            </span>
            <button
              type="button"
              onClick={() => setBulkOpen(false)}
              className="h-[34px] px-[14px] rounded-[10px] text-[14px] font-[600] text-[#FFFCF1] bg-[#FFFCF11A] hover:bg-[#FFFCF133] transition-colors duration-150"
            >
              Done
            </button>
          </div>
          <div className="rounded-[18px] bg-[#FFFCF1] overflow-hidden">
            <div className="overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]">
              <table className="border-separate border-spacing-0 text-[14px] leading-[19px]" style={{ width, minWidth: "100%" }}>
                <SheetCols table={table} />
                <thead>
                  <SheetHead table={table} />
                </thead>
                <tbody>
                  {Array.from({ length: GTM_PAGE_SIZE }, (_, i) => (
                    <BlankLine key={`blank-${i}`} n={i + 1} table={table} onCreate={createRow} onError={setError} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Saved lines: their own table, grouped by date, newest first. */}
      <div className="rounded-[21px] bg-[#FFFCF1] overflow-hidden">
        <div className="overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]">
          <table className="border-separate border-spacing-0 text-[14px] leading-[19px]" style={{ width, minWidth: "100%" }}>
            <SheetCols table={table} />
            <thead>
              <SheetHead table={table} />
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
              {groups.map((group) => {
                const open = !collapsed.has(group.date);
                return (
                  <Fragment key={group.date}>
                    <tr>
                      <td colSpan={span} className="p-0 bg-[#F4EEDF] border-b border-solid border-[#2819101A]">
                        <div className="sticky left-0 w-fit max-w-[calc(100vw-60px)] md:max-w-full flex items-center gap-[12px] px-[12px] py-[8px]">
                          <FoldButton
                            open={open}
                            label={dayLabel(group.date)}
                            onClick={() =>
                              setCollapsed((set) => {
                                const next = new Set(set);
                                if (next.has(group.date)) next.delete(group.date);
                                else next.add(group.date);
                                return next;
                              })
                            }
                          />
                          <span className={`text-[13px] font-[600] tabular-nums ${MUTED}`}>
                            {group.rows.length} {group.rows.length === 1 ? "line" : "lines"}
                          </span>
                        </div>
                      </td>
                    </tr>
                    {open &&
                      group.rows.map(({ row, n }) => (
                        <Line key={row.id} n={n} table={table} row={row} autoFocus={false} onSaved={replaceRow} onError={setError} />
                      ))}
                  </Fragment>
                );
              })}
              {!loading && !rows.length && filtering && (
                <tr>
                  <td colSpan={span} className={`px-[16px] py-[18px] text-[14px] ${SUB}`}>
                    No lines match these filters.
                  </td>
                </tr>
              )}
              {!loading && !rows.length && !filtering && (
                <tr>
                  <td colSpan={span} className={`px-[16px] py-[18px] text-[14px] ${SUB}`}>
                    No lines yet. Use Add Field to enter {GTM_PAGE_SIZE} at a time.
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

/** Today in the browser's time zone, as YYYY-MM-DD. */
const today = () => new Date().toLocaleDateString("en-CA");

/** "Fri, Oct 31, 2026", with "Today" for today's date. */
function dayLabel(date: string) {
  const label = new Date(`${date}T00:00:00`).toLocaleDateString("en-CA", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  return date === today() ? `Today · ${label}` : label;
}

/** Expands or collapses a group of lines: a chevron and its label. */
function FoldButton({ open, onClick, label, light = false }: { open: boolean; onClick: () => void; label: string; light?: boolean }) {
  return (
    <button
      type="button"
      aria-expanded={open}
      onClick={onClick}
      className={`h-[34px] pl-[6px] pr-[12px] flex items-center gap-[6px] rounded-[10px] text-[14px] font-[700] whitespace-nowrap transition-colors duration-150 ${light ? "text-[#FFFCF1] hover:bg-[#FFFCF11A]" : "text-[#281910] hover:bg-[#EEE6D6]"}`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className="transition-transform duration-200" style={{ transform: open ? "rotate(90deg)" : "none" }}>
        <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label}
    </button>
  );
}

/** The column widths both sheets (input and saved) share, so their columns line up. */
function SheetCols({ table }: { table: GtmTable }) {
  return (
    <colgroup>
      <col style={{ width: NUM_W }} />
      {table.columns.map((c) => (
        <col key={c.key} style={{ width: c.width }} />
      ))}
      <col style={{ width: PAGE_W }} />
      <col style={{ width: STATUS_W }} />
    </colgroup>
  );
}

/** The column names row both sheets share. */
function SheetHead({ table }: { table: GtmTable }) {
  return (
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
