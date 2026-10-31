import { NextResponse } from "next/server";

import { toCsv } from "@/lib/gtm-engine/gtm-csv";
import { GTM_TABLES, isGtmTableKey } from "@/lib/gtm-engine/gtm-tables";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

/**
 * GET ?table=clinics_ca&format=csv|json: every line of a table, every column (source links and evidence notes
 * included), plus its line id, entry and report dates, status, page and import batch, newest date first.
 */
const PAGE = 1000;

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const key = params.get("table");
  if (!isGtmTableKey(key)) return NextResponse.json({ ok: false, error: "Unknown table." }, { status: 400 });
  const format = params.get("format") === "json" ? "json" : "csv";
  const table = GTM_TABLES[key];

  try {
    const supabase = createSupabaseAdmin();
    const rows: { id: string; entry_date: string; report_date: string | null; status: string | null; page: string | null; import_batch: string | null; created_at: string; data: Record<string, string> }[] = [];
    for (let from = 0; ; from += PAGE) {
      const { data, error } = await supabase
        .from("gtm_engine_rows")
        .select("id, created_at, entry_date, report_date, data, page, status, import_batch")
        .eq("table_key", key)
        .order("entry_date", { ascending: false })
        .order("created_at", { ascending: true })
        .order("id")
        .range(from, from + PAGE - 1);
      if (error) throw error;
      rows.push(...((data ?? []) as typeof rows));
      if (!data || data.length < PAGE) break;
    }

    const stamp = new Date().toISOString().slice(0, 10);
    const name = `gtm-${key}-${stamp}.${format}`;
    const headers = { "content-disposition": `attachment; filename="${name}"`, "cache-control": "no-store" };
    const meta = (r: (typeof rows)[number]) => ({
      line_id: r.id,
      entry_date: r.entry_date,
      report_date: r.report_date ?? "",
      status: r.status ?? "",
      page: r.page ?? "",
      import_batch: r.import_batch ?? "",
      created_at: r.created_at,
    });

    if (format === "json") {
      const out = rows.map((r) => ({ ...meta(r), ...Object.fromEntries(table.columns.map((c) => [c.key, r.data?.[c.key] ?? ""])) }));
      return new NextResponse(JSON.stringify({ table: key, exported_at: new Date().toISOString(), rows: out }, null, 2), {
        headers: { ...headers, "content-type": "application/json; charset=utf-8" },
      });
    }
    const metaKeys = Object.keys(meta(rows[0] ?? ({ data: {} } as (typeof rows)[number])));
    const csv = toCsv(
      [...metaKeys, ...table.columns.map((c) => c.key)],
      rows.map((r) => [...Object.values(meta(r)), ...table.columns.map((c) => r.data?.[c.key] ?? "")]),
    );
    return new NextResponse(`﻿${csv}`, { headers: { ...headers, "content-type": "text/csv; charset=utf-8" } });
  } catch (error) {
    console.error("[gtm-engine/export] failed:", error instanceof Error ? error.message : error);
    return NextResponse.json({ ok: false, error: "Can't export the table." }, { status: 500 });
  }
}
