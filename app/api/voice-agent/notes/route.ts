import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { canonicalTopicName, tidyTopicName } from "@/lib/voice-agent/voice-agent-note-topics";
import type { VoiceAgentStationType } from "@/lib/voice-agent/voice-agent-types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface ClassifiedNote {
  text: string;
  topic: string;
  category: VoiceAgentStationType;
}

function isStationType(value: unknown): value is VoiceAgentStationType {
  return value === "history" || value === "physical_exam" || value === "management_counseling";
}

function parseTopics(value: unknown): string[] {
  if (typeof value !== "string") return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((entry): entry is string => typeof entry === "string" && entry.trim().length > 0);
  } catch {
    return [];
  }
}

function filenameFor(file: File): string {
  const type = file.type.toLowerCase();
  if (type.includes("mp4") || type.includes("aac") || type.includes("m4a")) return "note.m4a";
  if (type.includes("mpeg") || type.includes("mp3")) return "note.mp3";
  if (type.includes("wav")) return "note.wav";
  return "note.webm";
}

async function transcribeNote(apiKey: string, audio: File): Promise<string> {
  const form = new FormData();
  form.append("file", audio, audio.name || filenameFor(audio));
  form.append("model", "gpt-4o-mini-transcribe");

  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
    cache: "no-store",
  });
  const data = (await response.json().catch(() => null)) as { text?: unknown; error?: { message?: unknown } } | null;
  if (!response.ok) {
    throw new Error(
      (typeof data?.error?.message === "string" && data.error.message) || "Could not transcribe that note.",
    );
  }
  return typeof data?.text === "string" ? data.text.trim() : "";
}

async function classifyNote(
  apiKey: string,
  spoken: string,
  existingTopics: string[],
  hintTopic: string,
  hintCategory: VoiceAgentStationType | null,
): Promise<ClassifiedNote> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You turn a spoken OSCE study dictation into one saved note.

Return JSON only:
{"text":"cleaned note","topic":"clinical topic","category":"history"|"physical_exam"|"management_counseling"}

Rules for text:
- Keep the clinical content. Drop filler (um, uh, like, okay).
- One or two tight sentences or a short bullet-ready line. Do not invent facts.

Rules for topic:
- Existing topics: ${existingTopics.length ? existingTopics.map((topic) => `"${topic}"`).join(", ") : "(none yet)"}
- If this note is the same clinical problem as an existing topic (including close variants like chest pain / CP / ACS chest pain / chest pain station), reuse that existing topic string EXACTLY.
- Lump very similar presentations together. Only create a new topic when it is a distinct problem.
- Short title case, 2–5 words. No "OSCE" or "station" unless needed.
- If hintTopic is set and the note is about that station, use the matching existing topic or hintTopic.

Rules for category:
- history: questions to ask, HPI, associated symptoms, red flags in the history
- physical_exam: maneuvers, inspection/palpation/percussion/auscultation, signs
- management_counseling: investigations, treatment, counseling, safety-net, follow-up
- If the speaker names the bucket, honor it. Else use hintCategory when it fits.`,
        },
        {
          role: "user",
          content: JSON.stringify({
            spoken,
            hintTopic: hintTopic || null,
            hintCategory,
          }),
        },
      ],
    }),
    cache: "no-store",
  });

  const data = (await response.json().catch(() => null)) as {
    choices?: Array<{ message?: { content?: unknown } }>;
    error?: { message?: unknown };
  } | null;

  if (!response.ok) {
    throw new Error(
      (typeof data?.error?.message === "string" && data.error.message) || "Could not classify that note.",
    );
  }

  const raw = data?.choices?.[0]?.message?.content;
  let parsed: { text?: unknown; topic?: unknown; category?: unknown } = {};
  try {
    parsed = JSON.parse(typeof raw === "string" ? raw : "{}") as typeof parsed;
  } catch {
    parsed = {};
  }

  const text = typeof parsed.text === "string" && parsed.text.trim() ? parsed.text.trim() : spoken;
  const topic = canonicalTopicName(
    typeof parsed.topic === "string" && parsed.topic.trim() ? parsed.topic : hintTopic || "General",
    existingTopics,
  );
  const category = isStationType(parsed.category)
    ? parsed.category
    : hintCategory ?? "history";

  return { text, topic: tidyTopicName(topic) === "General" && hintTopic ? tidyTopicName(hintTopic) : topic, category };
}

export async function POST(request: Request) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Sign in to save notes." }, { status: 401 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Voice agent is not configured: OPENAI_API_KEY is missing." },
      { status: 500 },
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Missing audio for the note." }, { status: 400 });
  }

  const audio = form.get("audio");
  if (!(audio instanceof File) || audio.size < 400) {
    return NextResponse.json({ error: "I did not catch that — try speaking a bit longer." }, { status: 400 });
  }

  const existingTopics = parseTopics(form.get("topics"));
  const hintTopic = typeof form.get("hintTopic") === "string" ? String(form.get("hintTopic")).trim() : "";
  const hintCategoryRaw = form.get("hintCategory");
  const hintCategory = isStationType(hintCategoryRaw) ? hintCategoryRaw : null;

  try {
    const spoken = await transcribeNote(apiKey, audio);
    if (!spoken) {
      return NextResponse.json({ error: "I did not catch that — tap Speak note and try again." }, { status: 400 });
    }

    const classified = await classifyNote(apiKey, spoken, existingTopics, hintTopic, hintCategory);
    return NextResponse.json({
      ...classified,
      topic: canonicalTopicName(classified.topic, existingTopics.length ? existingTopics : [classified.topic]),
    });
  } catch (error) {
    console.error("voice-agent notes capture error", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not save that note." },
      { status: 502 },
    );
  }
}
