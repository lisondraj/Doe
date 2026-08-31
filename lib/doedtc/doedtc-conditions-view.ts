import type { DoeDtcSymptomRow } from "@/lib/doedtc/doedtc-types";

export type DoeDtcTileSpan = "single" | "wide" | "tall";

export function interlockSpans(count: number): DoeDtcTileSpan[] {
  const spans: DoeDtcTileSpan[] = [];
  let index = 0;
  while (index < count) {
    const left = count - index;
    if (left === 1) {
      spans.push("wide");
      index += 1;
    } else if (left === 2) {
      spans.push("single", "single");
      index += 2;
    } else {
      spans.push("tall", "single", "single");
      index += 3;
    }
  }
  return spans;
}

export function symptomsLinkedToName(name: string, symptoms: DoeDtcSymptomRow[]): DoeDtcSymptomRow[] {
  const needle = name.trim().toLowerCase();
  if (!needle) return [];
  const firstWord = needle.split(/\s+/)[0] ?? needle;
  return symptoms.filter((row) => {
    const haystack = [row.summary, row.raw_text, row.onset, ...(row.tags ?? [])]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(needle) || haystack.includes(firstWord);
  });
}
