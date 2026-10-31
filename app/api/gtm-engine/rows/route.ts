import { NextResponse } from "next/server";

import { GTM_PAGE_SIZE, GTM_STATUSES, GTM_TABLES, type GtmTableKey, dedupeKey, isGtmDate, isGtmTableKey } from "@/lib/gtm-engine/gtm-tables";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

/** /GTMENGINE's rows, in `public.gtm_engine_rows`, read and written here with the service role. */

const TABLE = "gtm_engine_rows";
const SELECT = "id, created_at, entry_date, report_date, data, page, status, import_batch";
const MAX_CELL = 4000;

const fail = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status });

/** Keeps only the table's own columns, as trimmed strings. */
function cleanData(table: GtmTableKey, raw: unknown): Record<string, string> | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const out: Record<string, string> = {};
  for (const column of GTM_TABLES[table].columns) {
    const value = (raw as Record<string, unknown>)[column.key];
    if (typeof value === "string" && value.trim()) out[column.key] = value.slice(0, MAX_CELL);
  }
  return out;
}

const likeEscape = (value: string) => value.replace(/[\\%_]/g, (c) => `\\${c}`);

/** GET ?table=clinics_us&page=0&status=Sent&report_date=YYYY-MM-DD&f.<column>=text: one page of a table, filtered, newest date first. */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const table = params.get("table");
  if (!isGtmTableKey(table)) return fail("Unknown table.");
  const page = Math.max(0, Number.parseInt(params.get("page") ?? "0", 10) || 0);

  try {
    let query = createSupabaseAdmin().from(TABLE).select(SELECT, { count: "exact" }).eq("table_key", table);
    for (const column of GTM_TABLES[table].columns) {
      const value = params.get(`f.${column.key}`)?.trim();
      if (value) query = query.ilike(`data->>${column.key}`, `%${likeEscape(value)}%`);
    }
    const reportDate = params.get("report_date");
    if (reportDate && isGtmDate(reportDate)) query = query.eq("report_date", reportDate);
    const status = params.get("status");
    if (status === "none") query = query.is("status", null);
    else if (status && (GTM_STATUSES as readonly string[]).includes(status)) query = query.eq("status", status);

    const from = page * GTM_PAGE_SIZE;
    const { data, count, error } = await query.order("entry_date", { ascending: false }).order("created_at", { ascending: true }).order("id").range(from, from + GTM_PAGE_SIZE - 1);
    if (error) throw error;
    return NextResponse.json({ ok: true, rows: data ?? [], total: count ?? 0 });
  } catch (error) {
    console.error("[gtm-engine/rows] read failed:", error instanceof Error ? error.message : error);
    return fail("Can't read the table.", 500);
  }
}

/** POST { table, data?, entry_date?, report_date?, status? }: a new row, under the date given (today if none). */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { table?: unknown; data?: unknown; entry_date?: unknown; report_date?: unknown; status?: unknown } | null;
  if (!body || !isGtmTableKey(body.table)) return fail("Unknown table.");
  const data = body.data === undefined ? {} : cleanData(body.table, body.data);
  if (!data) return fail("Bad row.");
  if (body.entry_date !== undefined && !isGtmDate(body.entry_date)) return fail("Bad date.");
  if (body.status !== undefined && body.status !== null && !(GTM_STATUSES as readonly unknown[]).includes(body.status)) return fail("Bad status.");
  if (body.report_date !== undefined && body.report_date !== null && body.report_date !== "" && !isGtmDate(body.report_date)) return fail("Bad report date.");
  const insert: Record<string, unknown> = { table_key: body.table, data, dedupe_key: dedupeKey(GTM_TABLES[body.table], data) };
  if (body.entry_date) insert.entry_date = body.entry_date;
  if (body.report_date) insert.report_date = body.report_date;
  if (body.status) insert.status = body.status;
  try {
    const { data: row, error } = await createSupabaseAdmin().from(TABLE).insert(insert).select(SELECT).single();
    if (error) throw error;
    return NextResponse.json({ ok: true, row });
  } catch (error) {
    console.error("[gtm-engine/rows] insert failed:", error instanceof Error ? error.message : error);
    return fail("Can't add the row.", 500);
  }
}

/** PATCH { id, table, data?, status?, page?, entry_date?, report_date? }: saves a row's cells (the whole set), status, page or dates. */
export async function PATCH(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    id?: unknown;
    table?: unknown;
    data?: unknown;
    status?: unknown;
    page?: unknown;
    entry_date?: unknown;
    report_date?: unknown;
  } | null;
  if (!body || typeof body.id !== "string" || !isGtmTableKey(body.table)) return fail("Bad row.");
  const update: Record<string, unknown> = {};
  if (body.data !== undefined) {
    const data = cleanData(body.table, body.data);
    if (!data) return fail("Bad row.");
    update.data = data;
    update.dedupe_key = dedupeKey(GTM_TABLES[body.table], data);
  }
  if (body.status !== undefined) {
    if (body.status !== null && !(GTM_STATUSES as readonly unknown[]).includes(body.status)) return fail("Bad status.");
    update.status = body.status;
  }
  if (body.page !== undefined) {
    if (body.page !== null && typeof body.page !== "string") return fail("Bad page.");
    update.page = body.page ? String(body.page).slice(0, 1000) : null;
  }
  if (body.entry_date !== undefined) {
    if (!isGtmDate(body.entry_date)) return fail("Bad date.");
    update.entry_date = body.entry_date;
  }
  if (body.report_date !== undefined) {
    if (body.report_date !== null && body.report_date !== "" && !isGtmDate(body.report_date)) return fail("Bad report date.");
    update.report_date = body.report_date || null;
  }
  if (!Object.keys(update).length) return fail("Nothing to save.");
  try {
    const { data: row, error } = await createSupabaseAdmin()
      .from(TABLE)
      .update(update)
      .eq("id", body.id)
      .eq("table_key", body.table)
      .select(SELECT)
      .single();
    if (error) throw error;
    return NextResponse.json({ ok: true, row });
  } catch (error) {
    console.error("[gtm-engine/rows] update failed:", error instanceof Error ? error.message : error);
    return fail("Can't save the row.", 500);
  }
}

/** DELETE { id, table }: removes one line. */
export async function DELETE(request: Request) {
  const body = (await request.json().catch(() => null)) as { id?: unknown; table?: unknown } | null;
  if (!body || typeof body.id !== "string" || !isGtmTableKey(body.table)) return fail("Bad row.");
  try {
    const { data, error } = await createSupabaseAdmin().from(TABLE).delete().eq("id", body.id).eq("table_key", body.table).select("id");
    if (error) throw error;
    if (!data?.length) return fail("No such line.", 404);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[gtm-engine/rows] delete failed:", error instanceof Error ? error.message : error);
    return fail("Can't delete the line.", 500);
  }
}
