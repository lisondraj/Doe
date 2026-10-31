import { NextResponse } from "next/server";

import { GtmImportError, listImports, undoImport } from "@/lib/gtm-engine/gtm-import";
import { isGtmTableKey } from "@/lib/gtm-engine/gtm-tables";

const fail = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status });

/** GET ?table=services: the table's recent imports, newest first. */
export async function GET(request: Request) {
  const table = new URL(request.url).searchParams.get("table");
  if (!isGtmTableKey(table)) return fail("Unknown table.");
  try {
    return NextResponse.json({ ok: true, imports: await listImports(table) });
  } catch (error) {
    console.error("[gtm-engine/imports] read failed:", error instanceof Error ? error.message : error);
    return fail("Can't read the imports.", 500);
  }
}

/** DELETE { id }: undoes one import, taking its lines back out. */
export async function DELETE(request: Request) {
  const body = (await request.json().catch(() => null)) as { id?: unknown } | null;
  if (!body || typeof body.id !== "string" || !/^[0-9a-f-]{36}$/i.test(body.id)) return fail("Bad import id.");
  try {
    return NextResponse.json({ ok: true, removed: await undoImport(body.id) });
  } catch (error) {
    if (error instanceof GtmImportError) return fail(error.message);
    console.error("[gtm-engine/imports] undo failed:", error instanceof Error ? error.message : error);
    return fail("Can't undo the import.", 500);
  }
}
