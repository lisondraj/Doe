import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

import {
  VOICE_AGENT_DEFAULT_MODEL,
  VOICE_AGENT_DEFAULT_VOICE,
  VOICE_AGENT_INSTRUCTIONS,
  VOICE_AGENT_LEARNING_INSTRUCTIONS,
  VOICE_AGENT_LEARNING_TOOLS,
  VOICE_AGENT_TOOLS,
} from "@/lib/voice-agent/voice-agent-prompt";
import type { VoiceAgentMode } from "@/lib/voice-agent/voice-agent-types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function readMode(request: Request): Promise<VoiceAgentMode> {
  try {
    const body = (await request.json()) as { mode?: unknown };
    if (body?.mode === "learn") return "learn";
  } catch {
    /** empty or non-JSON body defaults to practice */
  }
  return "practice";
}

/** Mints a short-lived OpenAI Realtime client secret so the browser never sees the real API key. */
export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Voice agent is not configured: OPENAI_API_KEY is missing." },
      { status: 500 },
    );
  }

  const mode = await readMode(request);
  const model = process.env.OPENAI_REALTIME_MODEL || VOICE_AGENT_DEFAULT_MODEL;
  const voice = process.env.OPENAI_REALTIME_VOICE || VOICE_AGENT_DEFAULT_VOICE;
  const learning = mode === "learn";

  const sessionConfig = {
    session: {
      type: "realtime",
      model,
      instructions: learning ? VOICE_AGENT_LEARNING_INSTRUCTIONS : VOICE_AGENT_INSTRUCTIONS,
      output_modalities: ["audio"],
      audio: {
        input: {
          format: { type: "audio/pcm", rate: 24000 },
          turn_detection: { type: "semantic_vad" },
          transcription: { model: "gpt-4o-mini-transcribe" },
        },
        output: {
          format: { type: "audio/pcm", rate: 24000 },
          voice,
        },
      },
      tools: learning ? VOICE_AGENT_LEARNING_TOOLS : VOICE_AGENT_TOOLS,
      tool_choice: "auto",
    },
  };

  try {
    const response = await fetch("https://api.openai.com/v1/realtime/client_secrets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "OpenAI-Safety-Identifier": `voice-agent-${randomUUID()}`,
      },
      body: JSON.stringify(sessionConfig),
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);

    if (!response.ok || !data) {
      return NextResponse.json(
        {
          error:
            data?.error?.message || "Failed to create a realtime voice session with OpenAI.",
        },
        { status: response.status || 502 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("voice-agent session error", error);
    return NextResponse.json(
      { error: "Failed to reach OpenAI to start the voice session." },
      { status: 502 },
    );
  }
}
