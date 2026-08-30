import type {
  DoeDtcGuideBlock,
  DoeDtcGuideBlockKind,
  DoeDtcGuideLayout,
  DoeDtcGuideRow,
} from "@/lib/doedtc/doedtc-types";

export const DOEDTC_GUIDE_BLOCK_KINDS = [
  "hero",
  "steps",
  "callout",
  "checklist",
  "timeline",
  "dose_card",
  "site_map",
  "do_dont",
  "faq",
  "facts",
  "illustration",
  "disclaimer",
] as const satisfies readonly DoeDtcGuideBlockKind[];

export const DOEDTC_GUIDE_LAYOUTS = [
  "howto",
  "schedule",
  "checklist",
  "explainer",
  "comparison",
] as const satisfies readonly DoeDtcGuideLayout[];

const MAX_BLOCKS = 12;

const DEFAULT_DISCLAIMER: DoeDtcGuideBlock = {
  id: "disclaimer-default",
  kind: "disclaimer",
  body: "Educational only. Follow your medication instructions and talk with your clinician about your care.",
};

export function normalizeGuideLayout(value: unknown): DoeDtcGuideLayout {
  const raw = String(value ?? "howto").trim().toLowerCase();
  return DOEDTC_GUIDE_LAYOUTS.includes(raw as DoeDtcGuideLayout)
    ? (raw as DoeDtcGuideLayout)
    : "howto";
}

function normalizeBlockId(value: unknown, index: number): string {
  const raw = String(value ?? "").trim();
  return raw || `block-${index + 1}`;
}

function normalizeCalloutTone(value: unknown): "tip" | "warning" | "info" {
  const raw = String(value ?? "info").trim().toLowerCase();
  if (raw === "tip" || raw === "warning" || raw === "info") return raw;
  return "info";
}

function normalizeIllustrationPreset(value: unknown): "pen" | "fridge" | "clock" | "rotate" {
  const raw = String(value ?? "pen").trim().toLowerCase();
  if (raw === "fridge" || raw === "clock" || raw === "rotate") return raw;
  return "pen";
}

function normalizeSiteMapSites(value: unknown): Array<"abdomen" | "thigh" | "arm"> {
  if (!Array.isArray(value)) return ["abdomen", "thigh", "arm"];
  const allowed = new Set(["abdomen", "thigh", "arm"]);
  const sites = value
    .map((item) => String(item).trim().toLowerCase())
    .filter((item): item is "abdomen" | "thigh" | "arm" => allowed.has(item));
  return sites.length > 0 ? sites : ["abdomen", "thigh", "arm"];
}

function normalizeGuideBlock(raw: unknown, index: number): DoeDtcGuideBlock | null {
  if (!raw || typeof raw !== "object") return null;
  const block = raw as Record<string, unknown>;
  const kind = String(block.kind ?? "").trim().toLowerCase() as DoeDtcGuideBlockKind;
  if (!DOEDTC_GUIDE_BLOCK_KINDS.includes(kind)) return null;

  const id = normalizeBlockId(block.id, index);
  const title = String(block.title ?? "").trim();
  const body = String(block.body ?? "").trim();

  switch (kind) {
    case "hero":
      if (!title) return null;
      return { id, kind, title, body: body || undefined };
    case "steps": {
      const stepsRaw = Array.isArray(block.steps)
        ? block.steps
            .map((step) => {
              if (!step || typeof step !== "object") return null;
              const row = step as Record<string, unknown>;
              const stepTitle = String(row.title ?? "").trim();
              if (!stepTitle) return null;
              const stepBody = String(row.body ?? "").trim();
              const duration = String(row.duration ?? "").trim();
              return {
                title: stepTitle,
                body: stepBody || undefined,
                duration: duration || undefined,
              };
            })
            .filter((step) => step !== null)
        : [];
      const steps = stepsRaw as Array<{ title: string; body?: string; duration?: string }>;
      if (steps.length === 0) return null;
      return { id, kind, title: title || "Steps", steps };
    }
    case "callout":
      if (!body && !title) return null;
      return { id, kind, title: title || undefined, body: body || title, tone: normalizeCalloutTone(block.tone) };
    case "checklist": {
      const items = Array.isArray(block.items)
        ? block.items.map((item) => String(item).trim()).filter(Boolean)
        : [];
      if (items.length === 0) return null;
      return { id, kind, title: title || "Checklist", items };
    }
    case "timeline": {
      const entriesRaw = Array.isArray(block.entries)
        ? block.entries
            .map((entry) => {
              if (!entry || typeof entry !== "object") return null;
              const row = entry as Record<string, unknown>;
              const label = String(row.label ?? "").trim();
              const detail = String(row.detail ?? "").trim();
              if (!label) return null;
              return { label, detail: detail || undefined };
            })
            .filter((entry) => entry !== null)
        : [];
      const entries = entriesRaw as Array<{ label: string; detail?: string }>;
      if (entries.length === 0) return null;
      return { id, kind, title: title || "Timeline", entries };
    }
    case "dose_card": {
      const medication = String(block.medication ?? title ?? "").trim();
      if (!medication) return null;
      return {
        id,
        kind,
        title: title || medication,
        medication,
        dose: String(block.dose ?? "").trim() || undefined,
        cadence: String(block.cadence ?? "").trim() || undefined,
        site: String(block.site ?? "").trim() || undefined,
      };
    }
    case "site_map":
      return {
        id,
        kind,
        title: title || "Injection sites",
        body: body || undefined,
        sites: normalizeSiteMapSites(block.sites),
      };
    case "do_dont": {
      const dos = Array.isArray(block.dos)
        ? block.dos.map((item) => String(item).trim()).filter(Boolean)
        : [];
      const donts = Array.isArray(block.donts)
        ? block.donts.map((item) => String(item).trim()).filter(Boolean)
        : [];
      if (dos.length === 0 && donts.length === 0) return null;
      return { id, kind, title: title || "Do and don't", dos, donts };
    }
    case "faq": {
      const faqItemsRaw = Array.isArray(block.items)
        ? block.items
            .map((item) => {
              if (!item || typeof item !== "object") return null;
              const row = item as Record<string, unknown>;
              const question = String(row.question ?? "").trim();
              const answer = String(row.answer ?? "").trim();
              if (!question || !answer) return null;
              return { question, answer };
            })
            .filter((item) => item !== null)
        : [];
      const items = faqItemsRaw as Array<{ question: string; answer: string }>;
      if (items.length === 0) return null;
      return { id, kind, title: title || "FAQ", items };
    }
    case "facts": {
      const factItemsRaw = Array.isArray(block.items)
        ? block.items
            .map((item) => {
              if (!item || typeof item !== "object") return null;
              const row = item as Record<string, unknown>;
              const label = String(row.label ?? "").trim();
              const value = String(row.value ?? "").trim();
              if (!label || !value) return null;
              return { label, value };
            })
            .filter((item) => item !== null)
        : [];
      const items = factItemsRaw as Array<{ label: string; value: string }>;
      if (items.length === 0) return null;
      return { id, kind, title: title || undefined, items };
    }
    case "illustration":
      return {
        id,
        kind,
        title: title || undefined,
        body: body || undefined,
        preset: normalizeIllustrationPreset(block.preset),
      };
    case "disclaimer":
      return {
        id,
        kind,
        body: body || DEFAULT_DISCLAIMER.body,
      };
    default:
      return null;
  }
}

export function normalizeGuideBlocks(raw: unknown): DoeDtcGuideBlock[] {
  const input = Array.isArray(raw) ? raw : [];
  const blocks: DoeDtcGuideBlock[] = [];
  for (let index = 0; index < input.length && blocks.length < MAX_BLOCKS - 1; index += 1) {
    const block = normalizeGuideBlock(input[index], index);
    if (block && block.kind !== "disclaimer") blocks.push(block);
  }
  blocks.push({
    ...DEFAULT_DISCLAIMER,
    id: `disclaimer-${blocks.length + 1}`,
  });
  return blocks.slice(0, MAX_BLOCKS);
}

export function defaultBlocksForLayout(layout: DoeDtcGuideLayout, title: string, topic: string): DoeDtcGuideBlock[] {
  const heroTitle = title.trim() || "Your guide";
  const heroBody = topic.trim() || undefined;
  const baseHero: DoeDtcGuideBlock = { id: "hero-1", kind: "hero", title: heroTitle, body: heroBody };

  switch (layout) {
    case "schedule":
      return normalizeGuideBlocks([
        baseHero,
        {
          id: "dose-1",
          kind: "dose_card",
          title: "Dose",
          medication: heroTitle,
        },
        {
          id: "timeline-1",
          kind: "timeline",
          title: "Schedule",
          entries: [{ label: "Week 1", detail: "Follow your clinician's plan" }],
        },
        {
          id: "facts-1",
          kind: "facts",
          items: [
            { label: "Cadence", value: "As prescribed" },
            { label: "Reminder", value: "Same day each week" },
          ],
        },
      ]);
    case "checklist":
      return normalizeGuideBlocks([
        baseHero,
        {
          id: "checklist-1",
          kind: "checklist",
          title: "Before you start",
          items: ["Read the instructions", "Check expiration date", "Wash your hands"],
        },
        {
          id: "callout-1",
          kind: "callout",
          tone: "tip",
          body: "Keep supplies ready before your routine.",
        },
      ]);
    case "explainer":
      return normalizeGuideBlocks([
        baseHero,
        {
          id: "faq-1",
          kind: "faq",
          title: "Common questions",
          items: [{ question: "What should I know first?", answer: heroBody ?? "Follow your care plan." }],
        },
        {
          id: "facts-1",
          kind: "facts",
          items: [{ label: "Topic", value: topic || heroTitle }],
        },
      ]);
    case "comparison":
      return normalizeGuideBlocks([
        baseHero,
        {
          id: "dodont-1",
          kind: "do_dont",
          dos: ["Follow your clinician's instructions"],
          donts: ["Skip doses without guidance"],
        },
        {
          id: "faq-1",
          kind: "faq",
          items: [{ question: "When should I ask for help?", answer: "If symptoms worsen or you miss a dose." }],
        },
      ]);
    case "howto":
    default:
      return normalizeGuideBlocks([
        baseHero,
        {
          id: "steps-1",
          kind: "steps",
          title: "Steps",
          steps: [
            { title: "Prepare", body: "Gather supplies and wash your hands." },
            { title: "Follow instructions", body: "Use the technique your clinician reviewed." },
            { title: "Finish safely", body: "Dispose of supplies and note anything unusual." },
          ],
        },
        {
          id: "site-1",
          kind: "site_map",
          title: "Rotate sites",
          body: "Pick a different area each time.",
        },
        {
          id: "callout-1",
          kind: "callout",
          tone: "warning",
          body: "Call your clinician if you have severe symptoms.",
        },
        {
          id: "dodont-1",
          kind: "do_dont",
          dos: ["Store medication as directed"],
          donts: ["Reuse needles"],
        },
      ]);
  }
}

export function formatGuideForAgent(row: DoeDtcGuideRow): string {
  const saved = row.saved_at ? "saved" : "unsaved";
  return `${row.title} (${saved}, layout=${row.layout}, blocks=${row.blocks.length})`;
}

export function isGuideSaveOfferText(text: string): boolean {
  return /save (this )?(to )?(your )?profile/i.test(text) || /want me to save/i.test(text);
}

export function findGuideByTitleHint(rows: DoeDtcGuideRow[], hint: string): DoeDtcGuideRow | null {
  const needle = hint.trim().toLowerCase();
  if (!needle) return null;
  return (
    rows.find((row) => row.title.toLowerCase().includes(needle)) ??
    rows.find((row) => row.topic.toLowerCase().includes(needle)) ??
    null
  );
}
