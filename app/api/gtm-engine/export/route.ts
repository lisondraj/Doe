import { NextResponse } from "next/server";

import { toCsv } from "@/lib/gtm-engine/gtm-csv";
import { GTM_TABLES, isGtmTableKey } from "@/lib/gtm-engine/gtm-tables";
import { EMPTY_FILTER } from "@/lib/gtm-engine/gtm-filters";
import { filterFromParams, readAllRows } from "@/lib/gtm-engine/gtm-read";

/**
 * GET ?table=clinics_ca&format=csv|json: every line of a table, every column (source links and evidence notes
 * included), plus its line id, entry and report dates, status, page and import batch, newest date first. With
 * filtered=1, only the lines that meet the same filters the rows route takes (status, report_date, f.<column>, filter).
 */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const key = params.get("table");
  if (!isGtmTableKey(key)) return NextResponse.json({ ok: false, error: "Unknown table." }, { status: 400 });
  const format = params.get("format") === "json" ? "json" : "csv";
  const table = GTM_TABLES[key];

  try {
    // With filter params (the page's "Export filtered"), only the lines that meet them.
    const filtered = params.get("filtered") === "1";
    const rows = await readAllRows(key, filtered ? params : new URLSearchParams(), filtered ? filterFromParams(key, params) : EMPTY_FILTER);

    const stamp = new Date().toISOString().slice(0, 10);
    const name = `gtm-${key}${filtered ? "-filtered" : ""}-${stamp}.${format}`;
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
