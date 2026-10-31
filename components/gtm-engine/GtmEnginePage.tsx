"use client";

/**
 * /GTMENGINE — the GTM team's prospect tables, in /demo/clinic's frame: brown edge, cream box, sand cards. Health holds
 * clinics (US, Canada, Other, Multi-site) and hospital LOIs (with programs); Non-Health holds local services. Every
 * table's Add Field opens a separate input sheet of 50 lines to fill under a chosen date; the saved table below groups lines by date
 * (newest first, each date folding open and shut), saves to Supabase as it goes (app/api/gtm-engine/rows), filters by
 * any column, by status and by report date, and gives each line a report date, a page (Generate) and a status.
 * Import takes CSV, pasted spreadsheet rows or JSON: map the columns, preview the checks (missing fields,
 * country/province mismatches, duplicates), import as one batch, undo a batch. Export writes the table as CSV or JSON.
 */
import { Fragment, type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { DISPLAY, DemoFrame } from "@/components/demo/DemoFrame";
import {
  GTM_IMPORT_MAX,
  GTM_PAGE_SIZE,
  GTM_STATUSES,
  HEALTH_SECTIONS,
  NON_HEALTH_SECTIONS,
  type GtmColumn,
  type GtmImport,
  type GtmRow,
  type GtmSection,
  type GtmStatus,
  type GtmTable,
  guessColumn,
} from "@/lib/gtm-engine/gtm-tables";
import { type ParsedSheet, parseSheet } from "@/lib/gtm-engine/gtm-csv";

type Mode = "health" | "non-health";

const SUB = "text-[#2819109E]";
const MUTED = "text-[#28191080]";
const API = "/api/gtm-engine/rows";
/** The sheet's own columns around the table's: the line number and report date before, Page and Status after. */
const NUM_W = 52;
const REPORT_W = 150;
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
          column from the row under its name. Import a day&apos;s report as CSV, pasted rows or JSON, and export any table.
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

type Filters = { status: string; reportDate: string; columns: Record<string, string> };

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
  const [filters, setFilters] = useState<Filters>({ status: "", reportDate: "", columns: {} });
  const [applied, setApplied] = useState<Filters>(filters);
  /** The date the input sheet's lines save under. */
  const [bulkDate, setBulkDate] = useState(today);
  /** The report (edition) date the input sheet's lines carry, if any. */
  const [bulkReport, setBulkReport] = useState("");
  const [importOpen, setImportOpen] = useState(false);
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
      if (applied.reportDate) params.set("report_date", applied.reportDate);
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

  const filtering = !!applied.status || !!applied.reportDate || Object.values(applied.columns).some((v) => v.trim());
  const pages = Math.max(1, Math.ceil(total / GTM_PAGE_SIZE));

  const replaceRow = useCallback((row: GtmRow) => setRows((list) => list.map((r) => (r.id === row.id ? row : r))), []);

  /** A new saved line under the bulk input's date. The page reloads so it lands in its date's group. */
  const createRow = useCallback(
    async (data: Record<string, string>, status?: GtmStatus | null) => {
      const res = await fetch(API, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ table: table.key, data, entry_date: bulkDate, report_date: bulkReport || undefined, status: status ?? undefined }),
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
    [table.key, bulkDate, bulkReport, load, page],
  );

  /** + Add Field: opens the input sheet (50 blank lines under a picked date) above the saved table, and brings it into view. */
  const inputRef = useRef<HTMLDivElement | null>(null);
  const openInput = () => {
    setBulkOpen(true);
    window.requestAnimationFrame(() => inputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const width = NUM_W + REPORT_W + table.columns.reduce((n, c) => n + c.width, 0) + PAGE_W + STATUS_W;
  const span = table.columns.length + 4;
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
        <label className="flex items-center gap-[8px]">
          <span className={`text-[12px] font-[600] uppercase tracking-[0.08em] ${MUTED}`}>Report</span>
          <input
            type="date"
            value={filters.reportDate}
            onChange={(e) => setFilters((f) => ({ ...f, reportDate: e.target.value }))}
            aria-label="Filter by report date"
            className="h-[38px] px-[10px] rounded-[12px] bg-[#FFFCF1] text-[14px] font-[600] outline-none focus:ring-[2px] focus:ring-[#28191033]"
          />
        </label>
        <ExportButtons table={table} />
        <button
          type="button"
          onClick={() => setImportOpen(true)}
          className="h-[38px] px-[14px] flex items-center gap-[6px] rounded-[12px] bg-[#FFFCF1] text-[14px] font-[600] hover:bg-[#FAF4E4] transition-colors duration-150"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 4v11M7 10l5 5 5-5M5 19h14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Import
        </button>
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
            <label className="flex items-center gap-[8px]">
              <span className="text-[12px] font-[600] uppercase tracking-[0.08em] text-[#FFFCF199]">Report date</span>
              <input
                type="date"
                value={bulkReport}
                onChange={(e) => setBulkReport(e.target.value)}
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
                    <BlankLine key={`blank-${i}`} n={i + 1} table={table} reportDate={bulkReport} onCreate={createRow} onError={setError} />
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
                <th className={FILTER_CELL} />
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
      {importOpen && <ImportSheet table={table} onClose={() => setImportOpen(false)} onChanged={() => void load(page)} />}
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
      <col style={{ width: REPORT_W }} />
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
      <th className={HEAD}>Report date</th>
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

async function patchRow(table: string, id: string, update: { data?: Record<string, string>; status?: GtmStatus | null; report_date?: string | null }): Promise<GtmRow | null> {
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

  const setReport = async (report: string) => {
    try {
      const updated = await patchRow(table.key, row.id, { report_date: report || null });
      if (updated) onSaved(updated);
    } catch (e) {
      onError(e instanceof Error ? e.message : "Can't save the report date.");
    }
  };

  return (
    <LineCells
      n={n}
      table={table}
      values={draft}
      reportDate={row.report_date ?? ""}
      onReportDate={(d) => void setReport(d)}
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
  reportDate,
  onCreate,
  onError,
}: {
  n: number;
  table: GtmTable;
  /** The input sheet's report date, which the line carries. */
  reportDate: string;
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
      reportDate={reportDate}
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
  reportDate,
  onReportDate,
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
  reportDate: string;
  /** Saved lines change their report date here; blank lines take the input sheet's. */
  onReportDate?: (date: string) => void;
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
      <td className={CELL}>
        <input
          type="date"
          value={reportDate}
          disabled={!onReportDate}
          aria-label={`Report date, line ${n}`}
          onChange={(e) => onReportDate?.(e.target.value)}
          className={`${INPUT} tabular-nums ${reportDate ? "" : "text-[#28191066]"} disabled:opacity-70`}
        />
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
                {value && !c.options.includes(value) && <option value={value}>{value}</option>}
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

/* ------------------------------------------------------------------ Export */

/** Downloads the whole table, every column with its source links and evidence notes, as CSV or JSON. */
function ExportButtons({ table }: { table: GtmTable }) {
  const href = (format: "csv" | "json") => `/api/gtm-engine/export?table=${table.key}&format=${format}`;
  return (
    <div className="flex items-center rounded-[12px] bg-[#FFFCF1] p-[3px]">
      <span className={`pl-[9px] pr-[4px] text-[12px] font-[600] uppercase tracking-[0.08em] ${MUTED}`}>Export</span>
      {(["csv", "json"] as const).map((f) => (
        <a key={f} href={href(f)} download className="h-[32px] px-[10px] flex items-center rounded-[9px] text-[13px] font-[700] uppercase hover:bg-[#F4EEDF] transition-colors duration-150">
          {f}
        </a>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ Import */

type ImportOutcome = { index: number; outcome: "accepted" | "duplicate" | "error"; errors: string[]; warnings: string[]; duplicateOf?: string };
type ImportResponse = {
  ok: boolean;
  error?: string;
  dryRun?: boolean;
  batch?: GtmImport | null;
  totals?: { accepted: number; skipped: number; errors: number; warnings: number };
  lines?: ImportOutcome[];
};
type Step = "source" | "map" | "preview" | "done";

const IMPORT_API = "/api/gtm-engine/import";
const lines = (n: number) => `${n.toLocaleString()} ${n === 1 ? "line" : "lines"}`;
const PREVIEW_LINES = 300;

/**
 * Bulk import for one table: paste rows from a spreadsheet, CSV or JSON (or upload a file), map its columns to the
 * table's, check every line on the server without saving (missing fields, country / province mismatches, duplicates
 * against earlier imports and within this one), then import the accepted lines as one batch. Past imports are listed
 * with Undo, which takes a batch's lines back out.
 */
function ImportSheet({ table, onClose, onChanged }: { table: GtmTable; onClose: () => void; onChanged: () => void }) {
  const [step, setStep] = useState<Step>("source");
  const [text, setText] = useState("");
  const [sheet, setSheet] = useState<ParsedSheet | null>(null);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [reportDate, setReportDate] = useState("");
  const [entryDate, setEntryDate] = useState(today);
  const [result, setResult] = useState<ImportResponse | null>(null);
  const [issuesOnly, setIssuesOnly] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<GtmImport[] | null>(null);

  const loadHistory = useCallback(async () => {
    try {
      const res = await fetch(`/api/gtm-engine/imports?table=${table.key}`, { cache: "no-store" });
      const body = (await res.json()) as { ok: boolean; imports?: GtmImport[] };
      setHistory(body.imports ?? []);
    } catch {
      setHistory([]);
    }
  }, [table.key]);
  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  // Escape closes; the page behind doesn't scroll while the sheet is up.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const readText = (value: string) => {
    setError(null);
    try {
      const parsed = parseSheet(value);
      if (parsed.rows.length > GTM_IMPORT_MAX) throw new Error(`At most ${GTM_IMPORT_MAX} lines per import; this has ${parsed.rows.length}.`);
      setSheet(parsed);
      setMapping(Object.fromEntries(parsed.headers.map((h) => [h, guessColumn(table, h) ?? ""])));
      setStep("map");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Can't read that.");
    }
  };

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    const value = await file.text();
    setText(value);
    readText(value);
  };

  /** The lines as the table's columns: two source columns mapped to one are joined with a space. */
  const mappedRows = useMemo(() => {
    if (!sheet) return [];
    return sheet.rows.map((r) => {
      const out: Record<string, string> = {};
      for (const [header, key] of Object.entries(mapping)) {
        const v = r[header]?.trim();
        if (!key || !v) continue;
        out[key] = out[key] ? `${out[key]} ${v}` : v;
      }
      return out;
    });
  }, [sheet, mapping]);

  const send = async (dryRun: boolean) => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(IMPORT_API, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ table: table.key, rows: mappedRows, report_date: reportDate || undefined, entry_date: entryDate, dry_run: dryRun, format: sheet?.format }),
      });
      const body = (await res.json().catch(() => ({ ok: false }))) as ImportResponse;
      if (!res.ok || !body.ok) throw new Error(body.error ?? "The import didn't go through.");
      setResult(body);
      setStep(dryRun ? "preview" : "done");
      if (!dryRun) {
        onChanged();
        void loadHistory();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "The import didn't go through.");
    } finally {
      setBusy(false);
    }
  };

  const undo = async (id: string) => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/gtm-engine/imports", { method: "DELETE", headers: { "content-type": "application/json" }, body: JSON.stringify({ id }) });
      const body = (await res.json().catch(() => ({ ok: false }))) as { ok: boolean; error?: string };
      if (!res.ok || !body.ok) throw new Error(body.error ?? "Can't undo that import.");
      onChanged();
      await loadHistory();
      if (result?.batch?.id === id) setResult((r) => (r?.batch ? { ...r, batch: { ...r.batch, undone_at: new Date().toISOString() } } : r));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Can't undo that import.");
    } finally {
      setBusy(false);
    }
  };

  const mappedCount = Object.values(mapping).filter(Boolean).length;
  const missingRequired = table.required.filter((k) => !Object.values(mapping).includes(k) && !(k === "country" && table.country));
  /** What each preview line shows to name itself: its match columns, else the first mapped one. */
  const nameOf = (i: number) => {
    const row = mappedRows[i] ?? {};
    const parts = table.match.keys.map((k) => row[k]).filter(Boolean);
    return parts.length ? parts.join(" · ") : (Object.values(row)[0] ?? "(empty)");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-[#140C0466] p-0 md:p-[24px]" role="dialog" aria-modal="true" aria-label={`Import into ${table.title}`}>
      <div className="w-full max-w-[980px] max-h-[92svh] md:max-h-[88vh] flex flex-col rounded-t-[28px] md:rounded-[28px] bg-[#F4EEDF] p-[6px] shadow-[0_30px_80px_rgba(20,12,4,0.35)]">
        <div className="flex items-center gap-[10px] px-[14px] pt-[10px] pb-[12px]">
          <div className="min-w-0 mr-auto">
            <div className={`${DISPLAY} text-[24px] leading-[28px] md:text-[28px] md:leading-[32px] tracking-[-0.01em]`}>Import into {table.title}</div>
            <div className={`mt-[2px] text-[13px] leading-[18px] ${MUTED}`}>
              {step === "source" && "CSV, rows pasted from a spreadsheet, or JSON."}
              {step === "map" && `${lines(sheet?.rows.length ?? 0)} read. Match each column to the table's.`}
              {step === "preview" && "Checked. Nothing is saved until you import."}
              {step === "done" && "Imported as one batch."}
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="w-[38px] h-[38px] flex items-center justify-center rounded-full bg-[#FFFCF1] hover:bg-[#FAF4E4]">
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {error && <div className="mx-[6px] mb-[6px] px-[14px] py-[10px] rounded-[14px] bg-[#FCCFB8] text-[14px] font-[600]">{error}</div>}

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain rounded-[22px] bg-[#FFFCF1] p-[14px] md:p-[18px]">
          {step === "source" && (
            <div className="flex flex-col gap-[14px]">
              <div className="flex flex-wrap gap-[10px]">
                <DateField label="Report date" value={reportDate} onChange={setReportDate} hint="The edition the lines come from." />
                <DateField label="Date entered" value={entryDate} onChange={(v) => v && setEntryDate(v)} hint="Where they group in the table." />
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={"Paste here: copy the rows from a spreadsheet with their header row, or paste CSV or JSON.\n\norganization,city,province_state,website\nForm Clinic,Toronto,ON,formclinic.ca"}
                spellCheck={false}
                className="w-full h-[240px] md:h-[280px] p-[14px] rounded-[16px] bg-[#FBF6E9] font-mono text-[12.5px] leading-[19px] outline-none focus:bg-[#F4EEDF] resize-y"
              />
              <div className="flex flex-wrap items-center gap-[10px]">
                <label className="h-[42px] px-[16px] flex items-center gap-[8px] rounded-[12px] bg-[#F4EEDF] text-[14px] font-[600] cursor-pointer hover:bg-[#EEE6D6]">
                  <input type="file" accept=".csv,.tsv,.txt,.json,text/csv,application/json" className="sr-only" onChange={(e) => void onFile(e.target.files?.[0])} />
                  Upload a file
                </label>
                <button
                  type="button"
                  disabled={!text.trim()}
                  onClick={() => readText(text)}
                  className="h-[42px] px-[18px] rounded-[12px] bg-[#140C04] text-[#FFFCF1] text-[14px] font-[700] disabled:opacity-40 hover:bg-[#2A1C12]"
                >
                  Read lines
                </button>
                <span className={`text-[13px] ${MUTED}`}>Up to {GTM_IMPORT_MAX.toLocaleString()} lines at a time.</span>
              </div>
              <ImportHistory history={history} busy={busy} onUndo={(id) => void undo(id)} />
            </div>
          )}

          {step === "map" && sheet && (
            <div className="flex flex-col gap-[12px]">
              <div className="rounded-[16px] bg-[#FBF6E9] overflow-hidden">
                <div className={`grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,1fr)] gap-x-[12px] px-[14px] py-[8px] text-[11.5px] font-[600] uppercase tracking-[0.06em] ${MUTED}`}>
                  <span>Column in the import</span>
                  <span className="max-md:hidden">First value</span>
                  <span>Goes to</span>
                </div>
                {sheet.headers.map((h) => (
                  <div key={h} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,1fr)] items-center gap-x-[12px] px-[14px] py-[6px] border-t border-solid border-[#2819100F]">
                    <span className="min-w-0 truncate text-[14px] font-[600]">{h}</span>
                    <span className={`max-md:hidden min-w-0 truncate text-[13px] ${SUB}`}>{sheet.rows.find((r) => r[h])?.[h] ?? "—"}</span>
                    <select
                      value={mapping[h] ?? ""}
                      onChange={(e) => setMapping((m) => ({ ...m, [h]: e.target.value }))}
                      className={`${INPUT} bg-[#FFFCF1] font-[500] ${mapping[h] ? "" : "text-[#28191080]"}`}
                    >
                      <option value="">Skip this column</option>
                      {table.columns.map((c) => (
                        <option key={c.key} value={c.key}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
              <p className={`text-[13px] leading-[19px] ${SUB}`}>
                {mappedCount} of {sheet.headers.length} columns mapped. Two columns mapped to one are joined.
                {missingRequired.length > 0 && (
                  <span className="font-[600] text-[#9A3B1B]"> Nothing is mapped to {missingRequired.map((k) => table.columns.find((c) => c.key === k)?.label).join(" or ")}, so every line will be refused.</span>
                )}
              </p>
            </div>
          )}

          {(step === "preview" || step === "done") && result?.totals && (
            <div className="flex flex-col gap-[12px]">
              <div className="flex flex-wrap gap-[8px]">
                <Total tone="#DCE5D0" label={step === "done" ? "Imported" : "Will import"} n={result.totals.accepted} />
                <Total tone="#F3E7C9" label="Skipped as duplicates" n={result.totals.skipped} />
                <Total tone="#FCCFB8" label="Refused (errors)" n={result.totals.errors} />
                <Total tone="#F4EEDF" label="With warnings" n={result.totals.warnings} />
              </div>
              {step === "done" && result.batch && (
                <div className="flex flex-wrap items-center gap-[10px] px-[14px] py-[10px] rounded-[14px] bg-[#FBF6E9] text-[14px]">
                  <span className="mr-auto">
                    Batch of {lines(result.batch.accepted)} under {dayLabel(result.batch.entry_date)}
                    {result.batch.report_date ? `, report ${dayLabel(result.batch.report_date)}` : ""}.
                  </span>
                  {result.batch.undone_at ? (
                    <span className={`font-[600] ${MUTED}`}>Undone</span>
                  ) : (
                    <button type="button" disabled={busy} onClick={() => void undo(result.batch!.id)} className="h-[36px] px-[14px] rounded-[10px] bg-[#140C04] text-[#FFFCF1] text-[13px] font-[700] disabled:opacity-50">
                      Undo this import
                    </button>
                  )}
                </div>
              )}
              <label className="flex items-center gap-[8px] text-[14px] font-[600]">
                <input type="checkbox" checked={issuesOnly} onChange={(e) => setIssuesOnly(e.target.checked)} className="w-[16px] h-[16px] accent-[#140C04]" />
                Only lines with something to look at
              </label>
              <ol className="flex flex-col rounded-[16px] bg-[#FBF6E9] overflow-hidden">
                {(result.lines ?? [])
                  .filter((l) => !issuesOnly || l.outcome !== "accepted" || l.warnings.length)
                  .slice(0, PREVIEW_LINES)
                  .map((l) => (
                    <li key={l.index} className="flex items-start gap-[10px] px-[14px] py-[8px] border-b border-solid border-[#2819100D] last:border-b-0">
                      <span className={`shrink-0 w-[44px] text-right text-[12px] font-[600] tabular-nums ${MUTED}`}>{l.index + 1}</span>
                      <span
                        className="shrink-0 h-[22px] px-[8px] flex items-center rounded-full text-[11.5px] font-[700]"
                        style={{ backgroundColor: l.outcome === "accepted" ? "#DCE5D0" : l.outcome === "duplicate" ? "#F3E7C9" : "#FCCFB8" }}
                      >
                        {l.outcome === "accepted" ? "OK" : l.outcome === "duplicate" ? "Duplicate" : "Error"}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[14px] font-[600]">{nameOf(l.index)}</span>
                        {l.duplicateOf && <span className={`block text-[12.5px] ${SUB}`}>Same {table.match.label} {l.duplicateOf}.</span>}
                        {l.errors.map((m) => (
                          <span key={m} className="block text-[12.5px] text-[#9A3B1B]">
                            {m}
                          </span>
                        ))}
                        {l.warnings.map((m) => (
                          <span key={m} className={`block text-[12.5px] ${SUB}`}>
                            {m}
                          </span>
                        ))}
                      </span>
                    </li>
                  ))}
              </ol>
              {(result.lines?.length ?? 0) > PREVIEW_LINES && <p className={`text-[13px] ${MUTED}`}>Showing the first {PREVIEW_LINES} lines.</p>}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-[8px] px-[8px] pt-[10px] pb-[6px]">
          {step === "map" && (
            <>
              <FooterButton onClick={() => setStep("source")}>Back</FooterButton>
              <FooterButton primary disabled={busy || !mappedCount} onClick={() => void send(true)}>
                {busy ? "Checking…" : `Check ${lines(sheet?.rows.length ?? 0)}`}
              </FooterButton>
            </>
          )}
          {step === "preview" && (
            <>
              <FooterButton onClick={() => setStep("map")}>Back</FooterButton>
              <FooterButton primary disabled={busy || !result?.totals?.accepted} onClick={() => void send(false)}>
                {busy ? "Importing…" : `Import ${lines(result?.totals?.accepted ?? 0)}`}
              </FooterButton>
            </>
          )}
          {step === "done" && (
            <>
              <FooterButton
                onClick={() => {
                  setText("");
                  setSheet(null);
                  setResult(null);
                  setStep("source");
                }}
              >
                Import another
              </FooterButton>
              <FooterButton primary onClick={onClose}>
                Done
              </FooterButton>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function DateField({ label, value, onChange, hint }: { label: string; value: string; onChange: (value: string) => void; hint: string }) {
  return (
    <label className="flex flex-col gap-[4px]">
      <span className={`text-[12px] font-[600] uppercase tracking-[0.08em] ${MUTED}`}>{label}</span>
      <input type="date" value={value} onChange={(e) => onChange(e.target.value)} className="h-[40px] px-[12px] rounded-[12px] bg-[#FBF6E9] text-[14px] font-[600] outline-none focus:bg-[#F4EEDF]" />
      <span className={`text-[12px] ${MUTED}`}>{hint}</span>
    </label>
  );
}

function Total({ tone, label, n }: { tone: string; label: string; n: number }) {
  return (
    <span className="h-[44px] pl-[14px] pr-[16px] flex items-center gap-[10px] rounded-[14px]" style={{ backgroundColor: tone }}>
      <span className="text-[20px] font-[700] tabular-nums">{n}</span>
      <span className="text-[13px] font-[600]">{label}</span>
    </span>
  );
}

function FooterButton({ children, onClick, primary = false, disabled = false }: { children: ReactNode; onClick: () => void; primary?: boolean; disabled?: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`h-[44px] px-[18px] rounded-[14px] text-[14px] font-[700] disabled:opacity-40 transition-colors duration-150 ${primary ? "bg-[#140C04] text-[#FFFCF1] hover:bg-[#2A1C12]" : "bg-[#FFFCF1] hover:bg-[#FAF4E4]"}`}
    >
      {children}
    </button>
  );
}

/** The table's recent imports, each with its totals and Undo. */
function ImportHistory({ history, busy, onUndo }: { history: GtmImport[] | null; busy: boolean; onUndo: (id: string) => void }) {
  if (!history?.length) return null;
  return (
    <div>
      <div className={`mb-[6px] text-[12px] font-[600] uppercase tracking-[0.08em] ${MUTED}`}>Past imports</div>
      <ol className="flex flex-col rounded-[16px] bg-[#FBF6E9] overflow-hidden">
        {history.map((b) => (
          <li key={b.id} className="flex flex-wrap items-center gap-x-[12px] gap-y-[4px] px-[14px] py-[9px] border-b border-solid border-[#2819100D] last:border-b-0 text-[13.5px]">
            <span className="font-[600]">{new Date(b.created_at).toLocaleString("en-CA", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span>
            <span className={MUTED}>
              {b.source === "api" ? "API" : "Page"}
              {b.report_date ? ` · report ${b.report_date}` : ""} · {b.accepted} imported · {b.skipped} skipped · {b.errors} refused
            </span>
            <span className="ml-auto">
              {b.undone_at ? (
                <span className={`font-[600] ${MUTED}`}>Undone</span>
              ) : (
                <button type="button" disabled={busy} onClick={() => onUndo(b.id)} className="h-[30px] px-[12px] rounded-[9px] bg-[#FFFCF1] text-[13px] font-[700] hover:bg-[#F4EEDF] disabled:opacity-50">
                  Undo
                </button>
              )}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
