import { GTM_STATUSES, GTM_TABLES, type GtmRow, type GtmTableKey, isGtmDate } from "@/lib/gtm-engine/gtm-tables";
import { type GtmFilter, activeConditions, matchesFilter, parseFilter } from "@/lib/gtm-engine/gtm-filters";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

/**
 * Reads /GTMENGINE's lines for the rows, report and export routes. The quick filters (status, report date, the row
 * under the column names) run in Supabase; the deep filter (`filter=` JSON, lib/gtm-engine/gtm-filters.ts) runs over
 * every line that passes them. Read only.
 */

export const GTM_ROW_SELECT = "id, created_at, entry_date, report_date, data, page, status, import_batch";
const BATCH = 1000;

const likeEscape = (value: string) => value.replace(/[\\%_]/g, (c) => `\\${c}`);

/** The filter methods of a Supabase select, each returning the query. */
type Filterable<Q> = { ilike(column: string, pattern: string): Q; eq(column: string, value: string): Q; is(column: string, value: null): Q };

/** The quick filters from the URL: status, report_date and f.<column>. */
export function applyQuickFilters<Q extends Filterable<Q>>(query: Q, table: GtmTableKey, params: URLSearchParams): Q {
  let q = query;
  for (const column of GTM_TABLES[table].columns) {
    const value = params.get(`f.${column.key}`)?.trim();
    if (value) q = q.ilike(`data->>${column.key}`, `%${likeEscape(value)}%`);
  }
  const reportDate = params.get("report_date");
  if (reportDate && isGtmDate(reportDate)) q = q.eq("report_date", reportDate);
  const status = params.get("status");
  if (status === "none") q = q.is("status", null);
  else if (status && (GTM_STATUSES as readonly string[]).includes(status)) q = q.eq("status", status);
  return q;
}

export const filterFromParams = (table: GtmTableKey, params: URLSearchParams): GtmFilter => parseFilter(GTM_TABLES[table], params.get("filter"));

export const hasDeepFilter = (filter: GtmFilter) => activeConditions(filter).length > 0;

/** Every line of a table that passes the quick filters and the deep filter, newest date first. */
export async function readAllRows(table: GtmTableKey, params: URLSearchParams, filter: GtmFilter): Promise<GtmRow[]> {
  const supabase = createSupabaseAdmin();
  const rows: GtmRow[] = [];
  for (let from = 0; ; from += BATCH) {
    const base = supabase.from("gtm_engine_rows").select(GTM_ROW_SELECT).eq("table_key", table);
    const query: typeof base = applyQuickFilters(base, table, params);
    const { data, error } = await query.order("entry_date", { ascending: false }).order("created_at", { ascending: true }).order("id").range(from, from + BATCH - 1);
    if (error) throw error;
    rows.push(...((data ?? []) as GtmRow[]));
    if (!data || data.length < BATCH) break;
  }
  return hasDeepFilter(filter) ? rows.filter((r) => matchesFilter(GTM_TABLES[table], r, filter)) : rows;
}

/** How many lines the table has, with no filter. */
export async function countRows(table: GtmTableKey): Promise<number> {
  const { count, error } = await createSupabaseAdmin().from("gtm_engine_rows").select("id", { count: "exact", head: true }).eq("table_key", table);
  if (error) throw error;
  return count ?? 0;
}
