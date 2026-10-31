import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { GTM_IMPORT_MAX, GTM_TABLES, type GtmImport, type GtmTableKey, checkRow, isGtmDate, isGtmTableKey } from "@/lib/gtm-engine/gtm-tables";

/**
 * /GTMENGINE bulk import, for the page (app/api/gtm-engine/import) and the key-authenticated API
 * (app/api/gtm-engine/v1/import). Every line is checked (`checkRow`); lines with errors are refused, duplicates are
 * skipped (the same organization, or person + organization, already in the table or earlier in the import), and the
 * rest go in as one batch that can be undone. A dry run reports the same totals without saving.
 */

export class GtmImportError extends Error {}

export type ImportLineResult = {
  /** 0-based position in the lines sent. */
  index: number;
  outcome: "accepted" | "duplicate" | "error";
  errors: string[];
  warnings: string[];
  /** For a duplicate: what it matched. */
  duplicateOf?: "earlier in this import" | "already in the table";
};

export type ImportResult = {
  dryRun: boolean;
  batch: GtmImport | null;
  totals: { accepted: number; skipped: number; errors: number; warnings: number };
  lines: ImportLineResult[];
};

type ImportInput = {
  table: unknown;
  rows: unknown;
  report_date?: unknown;
  entry_date?: unknown;
  dry_run?: unknown;
  format?: unknown;
};

const KEY_CHUNK = 150;
const INSERT_CHUNK = 500;

const todayUtc = () => new Date().toISOString().slice(0, 10);

export async function runImport(input: ImportInput, source: "page" | "api"): Promise<ImportResult> {
  if (!isGtmTableKey(input.table)) throw new GtmImportError(`Unknown table. Use one of: ${Object.keys(GTM_TABLES).join(", ")}.`);
  const table = GTM_TABLES[input.table];
  if (!Array.isArray(input.rows) || !input.rows.length) throw new GtmImportError("rows needs to be a non-empty array of objects.");
  if (input.rows.length > GTM_IMPORT_MAX) throw new GtmImportError(`At most ${GTM_IMPORT_MAX} lines per import.`);
  if (input.report_date != null && input.report_date !== "" && !isGtmDate(input.report_date)) throw new GtmImportError("report_date needs to be YYYY-MM-DD.");
  if (input.entry_date != null && input.entry_date !== "" && !isGtmDate(input.entry_date)) throw new GtmImportError("entry_date needs to be YYYY-MM-DD.");
  const reportDate = input.report_date ? String(input.report_date) : null;
  const entryDate = input.entry_date ? String(input.entry_date) : todayUtc();
  const dryRun = input.dry_run === true;
  const format = typeof input.format === "string" ? input.format.slice(0, 20) : null;

  const checks = input.rows.map((raw) =>
    raw && typeof raw === "object" && !Array.isArray(raw) ? checkRow(table, raw as Record<string, unknown>) : { data: {}, errors: ["Not an object."], warnings: [], key: null },
  );

  const supabase = createSupabaseAdmin();
  const existing = await existingKeys(input.table, checks.map((c) => c.key).filter((k): k is string => !!k));

  const seen = new Set<string>();
  const lines: ImportLineResult[] = checks.map((check, index) => {
    if (check.errors.length) return { index, outcome: "error", errors: check.errors, warnings: check.warnings };
    if (check.key && existing.has(check.key)) return { index, outcome: "duplicate", errors: [], warnings: check.warnings, duplicateOf: "already in the table" };
    if (check.key && seen.has(check.key)) return { index, outcome: "duplicate", errors: [], warnings: check.warnings, duplicateOf: "earlier in this import" };
    if (check.key) seen.add(check.key);
    return { index, outcome: "accepted", errors: [], warnings: check.warnings };
  });

  const totals = {
    accepted: lines.filter((l) => l.outcome === "accepted").length,
    skipped: lines.filter((l) => l.outcome === "duplicate").length,
    errors: lines.filter((l) => l.outcome === "error").length,
    warnings: lines.filter((l) => l.warnings.length).length,
  };
  if (dryRun || !totals.accepted) return { dryRun, batch: null, totals, lines };

  const { data: batch, error: batchError } = await supabase
    .from("gtm_engine_imports")
    .insert({ table_key: input.table, source, format, report_date: reportDate, entry_date: entryDate, accepted: totals.accepted, skipped: totals.skipped, errors: totals.errors })
    .select("*")
    .single();
  if (batchError || !batch) throw batchError ?? new Error("Couldn't start the import.");

  const accepted = lines.filter((l) => l.outcome === "accepted").map((l) => checks[l.index]!);
  try {
    for (let i = 0; i < accepted.length; i += INSERT_CHUNK) {
      const { error } = await supabase.from("gtm_engine_rows").insert(
        accepted.slice(i, i + INSERT_CHUNK).map((c) => ({
          table_key: input.table,
          data: c.data,
          entry_date: entryDate,
          report_date: reportDate,
          dedupe_key: c.key,
          import_batch: batch.id,
        })),
      );
      if (error) throw error;
    }
  } catch (error) {
    // All or nothing: a batch that failed partway is taken back out.
    await supabase.from("gtm_engine_rows").delete().eq("import_batch", batch.id);
    await supabase.from("gtm_engine_imports").delete().eq("id", batch.id);
    throw error;
  }

  return { dryRun, batch: batch as GtmImport, totals, lines };
}

/** The duplicate keys among `keys` already saved in the table. */
async function existingKeys(table: GtmTableKey, keys: string[]): Promise<Set<string>> {
  const unique = Array.from(new Set(keys));
  const found = new Set<string>();
  const supabase = createSupabaseAdmin();
  for (let i = 0; i < unique.length; i += KEY_CHUNK) {
    const { data, error } = await supabase.from("gtm_engine_rows").select("dedupe_key").eq("table_key", table).in("dedupe_key", unique.slice(i, i + KEY_CHUNK));
    if (error) throw error;
    for (const row of data ?? []) if (row.dedupe_key) found.add(row.dedupe_key as string);
  }
  return found;
}

export async function listImports(table: GtmTableKey): Promise<GtmImport[]> {
  const { data, error } = await createSupabaseAdmin().from("gtm_engine_imports").select("*").eq("table_key", table).order("created_at", { ascending: false }).limit(30);
  if (error) throw error;
  return (data ?? []) as GtmImport[];
}

/** Takes one batch's lines back out of its table and marks the batch undone. Returns how many lines went. */
export async function undoImport(id: string): Promise<number> {
  const supabase = createSupabaseAdmin();
  const { data: batch, error } = await supabase.from("gtm_engine_imports").select("id, undone_at").eq("id", id).maybeSingle();
  if (error) throw error;
  if (!batch) throw new GtmImportError("No such import.");
  if (batch.undone_at) throw new GtmImportError("That import was already undone.");
  const { data: removed, error: deleteError } = await supabase.from("gtm_engine_rows").delete().eq("import_batch", id).select("id");
  if (deleteError) throw deleteError;
  const { error: markError } = await supabase.from("gtm_engine_imports").update({ undone_at: new Date().toISOString() }).eq("id", id);
  if (markError) throw markError;
  return removed?.length ?? 0;
}
