/**
 * /GTMENGINE's import and export formats: CSV, tab-separated text pasted from a spreadsheet, and JSON (an array of
 * objects, or `{ rows: [...] }`). Parsing runs in the browser; writing CSV runs on the server for export.
 */

export type ParsedSheet = { headers: string[]; rows: Record<string, string>[]; format: "csv" | "tsv" | "json" };

/** Reads pasted or uploaded text. Throws a readable message when it can't. */
export function parseSheet(text: string): ParsedSheet {
  const body = text.replace(/^﻿/, "").trim();
  if (!body) throw new Error("Nothing to import.");
  if (body.startsWith("[") || body.startsWith("{")) return parseJson(body);
  const firstLine = body.slice(0, body.search(/\r?\n|$/));
  const tabs = (firstLine.match(/\t/g) ?? []).length;
  const commas = (firstLine.match(/,/g) ?? []).length;
  const delimiter = tabs > 0 && tabs >= commas ? "\t" : ",";
  const grid = parseDelimited(body, delimiter).filter((r) => r.some((c) => c.trim()));
  if (grid.length < 2) throw new Error("Needs a header row and at least one line.");
  const headers = uniqueHeaders(grid[0]!.map((h) => h.trim()));
  const rows = grid.slice(1).map((cells) => Object.fromEntries(headers.map((h, i) => [h, (cells[i] ?? "").trim()])));
  return { headers, rows, format: delimiter === "\t" ? "tsv" : "csv" };
}

function parseJson(body: string): ParsedSheet {
  let value: unknown;
  try {
    value = JSON.parse(body);
  } catch {
    throw new Error("That JSON doesn't parse.");
  }
  const list = Array.isArray(value) ? value : (value as { rows?: unknown })?.rows;
  if (!Array.isArray(list) || !list.length) throw new Error("JSON needs an array of objects (or { \"rows\": [...] }).");
  const headers: string[] = [];
  const rows = list.map((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) throw new Error("Every JSON line needs to be an object.");
    const row: Record<string, string> = {};
    for (const [k, v] of Object.entries(item as Record<string, unknown>)) {
      if (!headers.includes(k)) headers.push(k);
      row[k] = v === null || v === undefined ? "" : typeof v === "object" ? JSON.stringify(v) : String(v);
    }
    return row;
  });
  return { headers, rows, format: "json" };
}

/** RFC 4180-style: quoted cells may hold the delimiter, newlines and doubled quotes. */
function parseDelimited(text: string, delimiter: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]!;
    if (quoted) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i++;
        } else quoted = false;
      } else cell += ch;
      continue;
    }
    if (ch === '"' && cell === "") quoted = true;
    else if (ch === delimiter) {
      row.push(cell);
      cell = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else cell += ch;
  }
  row.push(cell);
  rows.push(row);
  return rows;
}

function uniqueHeaders(headers: string[]): string[] {
  const seen = new Map<string, number>();
  return headers.map((h, i) => {
    const base = h || `Column ${i + 1}`;
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    return n ? `${base} (${n + 1})` : base;
  });
}

const csvCell = (value: unknown) => {
  const s = value === null || value === undefined ? "" : String(value);
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function toCsv(headers: string[], rows: unknown[][]): string {
  return [headers, ...rows].map((r) => r.map(csvCell).join(",")).join("\r\n") + "\r\n";
}
