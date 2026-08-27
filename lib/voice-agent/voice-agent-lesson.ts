import type {
  VoiceAgentLesson,
  VoiceAgentLessonDdxItem,
  VoiceAgentLessonGroup,
  VoiceAgentLessonQuestion,
} from "@/lib/voice-agent/voice-agent-types";

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map(asString).filter(Boolean);
}

function asGroups(value: unknown): VoiceAgentLessonGroup[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => {
      if (typeof entry !== "object" || entry === null) return null;
      const row = entry as { heading?: unknown; title?: unknown; bullets?: unknown };
      const heading = asString(row.heading) || asString(row.title);
      const bullets = asStringArray(row.bullets);
      if (!heading && bullets.length === 0) return null;
      return { heading: heading || "Key points", bullets };
    })
    .filter((entry): entry is VoiceAgentLessonGroup => entry !== null);
}

function asDdx(value: unknown): VoiceAgentLessonDdxItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => {
      if (typeof entry !== "object" || entry === null) return null;
      const row = entry as { name?: unknown; diagnosis?: unknown; why?: unknown; reason?: unknown };
      const name = asString(row.name) || asString(row.diagnosis);
      const why = asString(row.why) || asString(row.reason);
      if (!name) return null;
      return { name, why };
    })
    .filter((entry): entry is VoiceAgentLessonDdxItem => entry !== null);
}

function asQuestions(value: unknown): VoiceAgentLessonQuestion[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => {
      if (typeof entry !== "object" || entry === null) return null;
      const row = entry as { question?: unknown; q?: unknown; answer?: unknown; a?: unknown };
      const question = asString(row.question) || asString(row.q);
      const answer = asString(row.answer) || asString(row.a);
      if (!question) return null;
      return { question, answer };
    })
    .filter((entry): entry is VoiceAgentLessonQuestion => entry !== null);
}

export function isVoiceAgentLesson(value: unknown): value is VoiceAgentLesson {
  return parseVoiceAgentLesson(value) !== null;
}

export function parseVoiceAgentLesson(value: unknown): VoiceAgentLesson | null {
  if (typeof value !== "object" || value === null) return null;
  const raw = value as Record<string, unknown>;
  const topic = asString(raw.topic);
  const history = asGroups(raw.history);
  const ddxRanked = asDdx(raw.ddxRanked ?? raw.ddx);
  const examinerQuestions = asQuestions(raw.examinerQuestions);
  if (!topic && history.length === 0 && ddxRanked.length === 0 && examinerQuestions.length === 0) {
    return null;
  }

  return {
    topic: topic || "Clinical topic",
    hook: asString(raw.hook) || asString(raw.summary),
    history,
    ddxCantMiss: asStringArray(raw.ddxCantMiss ?? raw.cantMiss),
    ddxRanked,
    exam: asStringArray(raw.exam),
    investigationsFirstLine: asStringArray(raw.investigationsFirstLine ?? raw.firstLineIx),
    investigationsNextLine: asStringArray(raw.investigationsNextLine ?? raw.nextLineIx),
    managementImmediate: asStringArray(raw.managementImmediate ?? raw.immediate),
    managementTreatment: asStringArray(raw.managementTreatment ?? raw.treatment),
    counseling: asStringArray(raw.counseling ?? raw.counselling),
    safetyNet: asStringArray(raw.safetyNet ?? raw.safetyNetting),
    examinerQuestions,
  };
}

export async function fetchVoiceAgentLesson(
  topic: string,
  kind: "learn" | "deepdive" = "learn",
): Promise<VoiceAgentLesson> {
  const response = await fetch("/api/voice-agent/lesson", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic, kind }),
  });
  const data = (await response.json().catch(() => null)) as { lesson?: unknown; error?: unknown } | null;
  if (!response.ok) {
    throw new Error(typeof data?.error === "string" ? data.error : "Could not generate the teaching page.");
  }
  const lesson = parseVoiceAgentLesson(data?.lesson ?? data);
  if (!lesson) throw new Error("The teaching page came back empty.");
  return lesson;
}
