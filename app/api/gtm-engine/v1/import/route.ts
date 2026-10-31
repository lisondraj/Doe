import { NextResponse } from "next/server";

import { gtmApiKeyStatus } from "@/lib/gtm-engine/gtm-api-key";
import { GtmImportError, runImport } from "@/lib/gtm-engine/gtm-import";

/**
 * The agents' bulk import: the same as the page's (app/api/gtm-engine/import), with `Authorization: Bearer
 * $GTM_ENGINE_API_KEY`. POST { table, rows: [{ column: value }], report_date?, entry_date?, dry_run? }. Column keys are
 * the ones in lib/gtm-engine/gtm-tables.ts. The response has the batch id (for undo), totals and every line's outcome.
 */
export async function POST(request: Request) {
  const auth = gtmApiKeyStatus(request);
  if (auth === "unconfigured") return NextResponse.json({ ok: false, error: "The import API isn't configured (GTM_ENGINE_API_KEY)." }, { status: 503 });
  if (auth !== "ok") return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ ok: false, error: "Send JSON." }, { status: 400 });
  try {
    return NextResponse.json({ ok: true, ...(await runImport({ ...body, format: "api" }, "api")) });
  } catch (error) {
    if (error instanceof GtmImportError) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    console.error("[gtm-engine/v1/import] failed:", error instanceof Error ? error.message : error);
    return NextResponse.json({ ok: false, error: "The import didn't go through. Nothing was saved." }, { status: 500 });
  }
}
