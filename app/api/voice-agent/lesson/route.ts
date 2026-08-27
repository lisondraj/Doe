import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { parseVoiceAgentLesson } from "@/lib/voice-agent/voice-agent-lesson";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const LESSON_JSON_SHAPE = `{
  "topic": "short clinical title",
  "hook": "one dense sentence a candidate can read in two seconds",
  "history": [{"heading": "HPI / SOCRATES", "bullets": ["specific question with example phrasing"]}],
  "ddxCantMiss": ["diagnosis — why it cannot be missed"],
  "ddxRanked": [{"name": "diagnosis", "why": "why it ranks here and what puts it in or out"}],
  "exam": ["specific maneuver and the finding you are looking for"],
  "investigationsFirstLine": ["test — what it changes"],
  "investigationsNextLine": ["test — when you add it"],
  "managementImmediate": ["first actions, in order"],
  "managementTreatment": ["treatment options with who gets what"],
  "counseling": ["how to explain this to the patient in an OSCE"],
  "safetyNet": ["what to tell them to come back for"],
  "examinerQuestions": [{"question": "examiner question", "answer": "strong concise model answer"}]
}`;

export async function POST(request: Request) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to generate a lesson." }, { status: 401 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Voice agent is not configured: OPENAI_API_KEY is missing." },
      { status: 500 },
    );
  }

  let topic = "";
  let kind: "learn" | "deepdive" = "learn";
  try {
    const body = (await request.json()) as { topic?: unknown; kind?: unknown };
    topic = typeof body.topic === "string" ? body.topic.trim() : "";
    kind = body.kind === "deepdive" ? "deepdive" : "learn";
  } catch {
    topic = "";
  }
  if (!topic) {
    return NextResponse.json({ error: "A topic is required." }, { status: 400 });
  }

  const includeExaminerQs = kind === "learn";

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `You write an OSCE teaching PAGE for a medical student. Output JSON only, matching this shape:
${LESSON_JSON_SHAPE}

Rules:
- Bullet-first. Almost no paragraphs. Every line must be clinically specific to THIS topic — not generic OSCE advice.
- History: 6–9 groups (presenting complaint/HPI, associated symptoms, red flags, systems, PMH/meds, social, ICE). Each group 3–6 bullets. Include example phrasing in quotes where useful.
- Can't-miss: 3–6 diagnoses. Ranked DDX: 7–12 items with why in / why out.
- Exam: 6–10 maneuvers if relevant; otherwise a short "often not the focus" list still useful in OSCE.
- Investigations and management must follow from the DDX. Immediate / treatment / counseling / safety-net as separate bullet lists.
- ${includeExaminerQs ? "Exactly 10 examinerQuestions with sharp model answers." : "examinerQuestions may be 5 high-yield viva questions."}
- Dense. Fast to scan. No preamble, no markdown, no "as an AI".`,
          },
          {
            role: "user",
            content: `Topic: ${topic}\nKind: ${kind === "deepdive" ? "post-station deep dive" : "learning session"}`,
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
        (typeof data?.error?.message === "string" && data.error.message) || "Could not generate the teaching page.",
      );
    }

    const raw = data?.choices?.[0]?.message?.content;
    let parsed: unknown = null;
    try {
      parsed = JSON.parse(typeof raw === "string" ? raw : "{}");
    } catch {
      parsed = null;
    }
    const lesson = parseVoiceAgentLesson(parsed);
    if (!lesson) {
      throw new Error("Could not parse the teaching page.");
    }
    if (!lesson.topic) lesson.topic = topic;
    return NextResponse.json({ lesson });
  } catch (error) {
    console.error("voice-agent lesson error", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not generate the teaching page." },
      { status: 502 },
    );
  }
}
