import { NextResponse } from "next/server";

import { GtmImportError, runImport } from "@/lib/gtm-engine/gtm-import";

/**
 * POST { table, rows: [{ column: value }], report_date?, entry_date?, dry_run?, format? }: the page's bulk import.
 * A dry run returns the preview (accepted / skipped / error totals and every line's outcome) without saving.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ ok: false, error: "Send JSON." }, { status: 400 });
  try {
    return NextResponse.json({ ok: true, ...(await runImport(body, "page")) });
  } catch (error) {
    if (error instanceof GtmImportError) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    console.error("[gtm-engine/import] failed:", error instanceof Error ? error.message : error);
    return NextResponse.json({ ok: false, error: "The import didn't go through. Nothing was saved." }, { status: 500 });
  }
}
