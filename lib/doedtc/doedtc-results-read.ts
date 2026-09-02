import { normalizeLabResultFields } from "@/lib/doedtc/doedtc-lab-ranges";
import {
  groupLabsByTitle,
  partitionResults,
  toResultView,
} from "@/lib/doedtc/doedtc-results-view";
import type { DoeDtcProfileSnapshot } from "@/lib/doedtc/doedtc-types";

function formatLabResultLine(row: ReturnType<typeof toResultView>): string {
  const normalized = normalizeLabResultFields({
    title: row.title,
    value: row.value,
    unit: row.unit,
    range: row.reference_range,
    flag: row.flag,
    summary: row.summary,
  });
  const parts = [row.title, `date: ${row.resulted_at.slice(0, 10)}`];
  if (row.source) parts.push(`source: ${row.source}`);
  if (normalized.value) {
    const valuePart = normalized.unit ? `${normalized.value} ${normalized.unit}` : normalized.value;
    parts.push(valuePart);
  }
  if (normalized.referenceRange) parts.push(`ref ${normalized.referenceRange}`);
  if (normalized.flag) parts.push(normalized.flag);
  if (!normalized.value && normalized.summary) parts.push(normalized.summary);
  parts.push(`id: ${row.id}`);
  return `- ${parts.join(" | ")}`;
}

export function extractLabQueryFromText(text: string): string | null {
  const trimmed = text.trim();
  if (!trimmed) return null;
  if (/\b(?:lfts?|liver (?:function|panel|tests?))\b/i.test(trimmed)) return "liver";
  if (/\ba1c\b|\bhba1c\b/i.test(trimmed)) return "a1c";
  if (/\btsh\b/i.test(trimmed)) return "tsh";
  if (/\b(?:the numbers|my numbers|what were (?:the|my) (?:labs?|results?|values?))\b/i.test(trimmed)) {
    return "labs";
  }
  const named = trimmed.match(/\b(?:alt|ast|alp|ldl|hdl|creatinine|egfr|glucose|hemoglobin|wbc|platelet)\b/i);
  return named?.[0]?.toLowerCase() ?? null;
}

function labSeriesMatchesQuery(series: ReturnType<typeof groupLabsByTitle>[number], query: string): boolean {
  const key = series.key;
  const title = series.latest.title.toLowerCase();
  if (query === "labs") return true;
  if (query === "liver") {
    return /\b(alt|ast|alp|bilirubin|ggt|lft|liver)\b/i.test(title) || key.includes("liver");
  }
  if (query === "a1c") return /\ba1c\b|hba1c|hemoglobin a1c/i.test(title) || key.includes("a1c");
  if (query === "tsh") return /\btsh\b/i.test(title) || key.includes("tsh");
  return title.includes(query) || key.includes(query.replace(/\s+/g, " "));
}

export function formatResultsTab(snapshot: DoeDtcProfileSnapshot, options?: { query?: string | null }): string {
  if (snapshot.results.length === 0) return "No lab or imaging results logged.";
  const query = options?.query?.trim().toLowerCase() ?? null;
  const { labs, imaging, micro } = partitionResults(snapshot.results);
  const labSeries = groupLabsByTitle(labs);
  const filteredSeries = query
    ? labSeries.filter((series) => labSeriesMatchesQuery(series, query))
    : labSeries;
  const sections: string[] = [];

  if (filteredSeries.length > 0) {
    sections.push(
      filteredSeries
        .slice(0, 12)
        .map((series) => {
          const lines = [formatLabResultLine(series.latest)];
          for (const prior of series.history.slice(1, 4)) {
            lines.push(`  prior: ${formatLabResultLine(prior)}`);
          }
          return lines.join("\n");
        })
        .join("\n"),
    );
  } else if (query && labSeries.length > 0) {
    sections.push(`No logged results matched "${query}".`);
  }

  if (!query) {
    if (imaging.length > 0) {
      sections.push(
        "Imaging:\n" +
          imaging
            .slice(0, 6)
            .map(
              (row) =>
                `- ${row.title} | date: ${row.resulted_at.slice(0, 10)}${row.summary ? ` | ${row.summary}` : ""} | id: ${row.id}`,
            )
            .join("\n"),
      );
    }
    if (micro.length > 0) {
      sections.push(
        "Microbiology:\n" +
          micro
            .slice(0, 6)
            .map(
              (row) =>
                `- ${row.title} | date: ${row.resulted_at.slice(0, 10)}${row.summary ? ` | ${row.summary}` : ""} | id: ${row.id}`,
            )
            .join("\n"),
      );
    }
  }

  return sections.join("\n\n") || "No lab or imaging results logged.";
}
