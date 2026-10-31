import { NextResponse } from "next/server";

import { gtmStats } from "@/lib/gtm-engine/gtm-filters";
import { countRows, filterFromParams, readAllRows } from "@/lib/gtm-engine/gtm-read";
import { GTM_TABLES, isGtmTableKey } from "@/lib/gtm-engine/gtm-tables";

/**
 * GET ?table=clinics_ca plus the rows route's filters (status, report_date, f.<column>, filter): the report on a
 * table — every column's filled / empty counts and values, status, dates and emails — over the lines that match.
 */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const table = params.get("table");
  if (!isGtmTableKey(table)) return NextResponse.json({ ok: false, error: "Unknown table." }, { status: 400 });
  try {
    const [rows, total] = await Promise.all([readAllRows(table, params, filterFromParams(table, params)), countRows(table)]);
    return NextResponse.json({ ok: true, stats: gtmStats(GTM_TABLES[table], rows, total) }, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    console.error("[gtm-engine/stats] failed:", error instanceof Error ? error.message : error);
    return NextResponse.json({ ok: false, error: "Can't build the report." }, { status: 500 });
  }
}
