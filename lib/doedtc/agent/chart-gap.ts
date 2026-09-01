/** Notice a mentioned chart item that isn't saved yet — frames, not a drug list. */

export type ChartGapKind = "medication" | "condition" | "tracker" | "result";

export type ChartGap = {
  label: string;
  kind: ChartGapKind;
  tool: "add_medication" | "add_condition" | "create_profile_artifact" | "log_result";
};

const WHEN_CUE_RE =
  /\b(?:today|tomorrow|tonight|this (?:morning|afternoon|evening)|in \d+|at \d|\d{1,2}(?::\d{2})?\s*(?:am|pm))\b/i;

const EXPLICIT_CHART_WRITE_RE =
  /\b(?:add|log|save|put|record)\b.{0,24}\b(?:to (?:my |the )?(?:chart|profile)|(?:my )?(?:chart|profile|meds?|medications?|conditions?))\b/i;

/** Structural English — not a catalog of meds, conditions, or brands. */
const ITEM_STOPWORDS = new Set(
  [
    "a",
    "an",
    "the",
    "my",
    "it",
    "this",
    "that",
    "some",
    "any",
    "more",
    "today",
    "tomorrow",
    "tonight",
    "morning",
    "afternoon",
    "evening",
    "dose",
    "doses",
    "pill",
    "pills",
    "shot",
    "shots",
    "tablet",
    "tablets",
    "med",
    "meds",
    "medicine",
    "medication",
    "prescription",
    "rx",
    "water",
    "bath",
    "shower",
    "nap",
    "walk",
    "break",
    "lunch",
    "dinner",
    "breakfast",
    "time",
    "one",
    "two",
    "new",
    "old",
    "next",
    "last",
    "first",
    "headache",
    "pain",
    "fever",
    "cough",
    "cold",
    "appointment",
    "reminder",
    "chart",
    "profile",
    "tracker",
    "guide",
  ].map((row) => row.toLowerCase()),
);

type Frame = { re: RegExp; kind: ChartGapKind };

const OWNED_ITEM_FRAMES: Frame[] = [
  { re: /\b(?:taking|take|took|taken)\s+my\s+([A-Za-z][A-Za-z0-9-]{2,40})/gi, kind: "medication" },
  { re: /\bi(?:'m| am) taking\s+(?:my\s+)?([A-Za-z][A-Za-z0-9-]{2,40})/gi, kind: "medication" },
  { re: /\bi take\s+(?:my\s+)?([A-Za-z][A-Za-z0-9-]{2,40})/gi, kind: "medication" },
  { re: /\bi(?:'m| am) on\s+([A-Za-z][A-Za-z0-9-]{2,40})/gi, kind: "medication" },
  { re: /\bprescribed\s+([A-Za-z][A-Za-z0-9-]{2,40})/gi, kind: "medication" },
  { re: /\bstarted(?: taking)?\s+(?:my\s+)?([A-Za-z][A-Za-z0-9-]{2,40})/gi, kind: "medication" },
  { re: /\bdiagnosed with\s+([A-Za-z][A-Za-z0-9-]{2,40})/gi, kind: "condition" },
  {
    re: /\bmy\s+([A-Za-z][A-Za-z0-9-]{2,40})\s+(?:dose|pill|pills|shot|shots|tablet|tablets|rx|prescription)\b/gi,
    kind: "medication",
  },
  { re: /\btrack(?:ing)? my\s+([A-Za-z][A-Za-z0-9-]{2,40})/gi, kind: "tracker" },
];

function execAll(re: RegExp, text: string): RegExpExecArray[] {
  const flags = re.flags.includes("g") ? re.flags : `${re.flags}g`;
  const copy = new RegExp(re.source, flags);
  const out: RegExpExecArray[] = [];
  let match: RegExpExecArray | null = copy.exec(text);
  while (match) {
    out.push(match);
    if (match[0] === "") copy.lastIndex += 1;
    match = copy.exec(text);
  }
  return out;
}

function titleCaseLabel(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

function chartHasLabel(label: string, rows: string[]): boolean {
  const needle = label.trim().toLowerCase();
  if (!needle) return false;
  return rows.some((row) => {
    const hay = row.trim().toLowerCase();
    if (!hay) return false;
    if (hay === needle) return true;
    if (hay.includes(needle) && needle.length >= 4) return true;
    if (needle.includes(hay) && hay.length >= 4) return true;
    return false;
  });
}

function toolForKind(kind: ChartGapKind): ChartGap["tool"] {
  switch (kind) {
    case "medication":
      return "add_medication";
    case "condition":
      return "add_condition";
    case "tracker":
      return "create_profile_artifact";
    case "result":
      return "log_result";
  }
}

export function inboundHasWhenCue(text: string): boolean {
  return WHEN_CUE_RE.test(text);
}

/** Standing chart fact vs mentioning something while doing another action (remind, dose today). */
export function looksLikeIncidentalChartMention(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  if (EXPLICIT_CHART_WRITE_RE.test(trimmed)) return false;
  if (!inboundHasWhenCue(trimmed)) return false;
  return (
    /\b(?:taking|take|took)\s+my\b/i.test(trimmed) ||
    /\bi(?:'m| am) taking\b/i.test(trimmed) ||
    /\bmy\s+[A-Za-z][A-Za-z0-9-]{2,40}\s+(?:dose|pill|pills|shot|shots)\b/i.test(trimmed)
  );
}

export function extractUnownedChartItems(params: {
  inboundText: string;
  medications?: string[];
  conditions?: string[];
  artifactTitles?: string[];
  resultTitles?: string[];
  householdNames?: string[];
}): ChartGap[] {
  const text = params.inboundText.trim();
  if (!text) return [];

  const meds = params.medications ?? [];
  const conditions = params.conditions ?? [];
  const artifacts = params.artifactTitles ?? [];
  const results = params.resultTitles ?? [];
  const household = (params.householdNames ?? []).map((name) => name.trim().toLowerCase());

  const found: ChartGap[] = [];
  const seen = new Set<string>();

  for (const frame of OWNED_ITEM_FRAMES) {
    for (const match of execAll(frame.re, text)) {
      const raw = (match[1] ?? "").trim();
      const key = raw.toLowerCase();
      if (!raw || ITEM_STOPWORDS.has(key) || seen.has(key)) continue;
      if (household.some((name) => name === key || name.startsWith(`${key} `))) continue;

      const rows =
        frame.kind === "medication"
          ? meds
          : frame.kind === "condition"
            ? conditions
            : frame.kind === "tracker"
              ? artifacts
              : results;
      if (chartHasLabel(raw, rows)) continue;

      seen.add(key);
      found.push({
        label: titleCaseLabel(raw),
        kind: frame.kind,
        tool: toolForKind(frame.kind),
      });
    }
  }

  return found;
}

export function formatChartGapOfferLine(gap: ChartGap): string {
  const place =
    gap.kind === "medication"
      ? "medications"
      : gap.kind === "condition"
        ? "conditions"
        : gap.kind === "tracker"
          ? "trackers"
          : "results";
  return `They mentioned ${gap.label} — it is not on ${place}. After the primary action, one complete offer to add it (${gap.tool}, confirm_once). Wording is yours. Do not add until they say yes unless they already asked to put it on the chart.`;
}
