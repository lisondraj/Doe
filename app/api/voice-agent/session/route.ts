import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  VOICE_AGENT_DEFAULT_MODEL,
  VOICE_AGENT_DEFAULT_VOICE,
  VOICE_AGENT_FOLLOWUP_INSTRUCTIONS,
  VOICE_AGENT_INSTRUCTIONS,
  VOICE_AGENT_LEARNING_INSTRUCTIONS,
  VOICE_AGENT_LEARNING_TOOLS,
  VOICE_AGENT_SAVER_FALLBACK_MODEL,
  VOICE_AGENT_SAVER_INSTRUCTIONS_SUFFIX,
  VOICE_AGENT_SAVER_MODEL,
  VOICE_AGENT_TOOLS,
} from "@/lib/voice-agent/voice-agent-prompt";
import {
  clampVoiceAgentSpeed,
  isVoiceAgentQuality,
  isVoiceAgentVoiceId,
  type VoiceAgentQuality,
} from "@/lib/voice-agent/voice-agent-settings";
import type { VoiceAgentMode } from "@/lib/voice-agent/voice-agent-types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function readSessionOptions(request: Request): Promise<{
  mode: VoiceAgentMode;
  followup: boolean;
  voice: string;
  speed: number;
  quality: VoiceAgentQuality;
}> {
  const fallback = {
    mode: "practice" as VoiceAgentMode,
    followup: false,
    voice: process.env.OPENAI_REALTIME_VOICE || VOICE_AGENT_DEFAULT_VOICE,
    speed: 1,
    quality: "saver" as VoiceAgentQuality,
  };
  try {
    const body = (await request.json()) as {
      mode?: unknown;
      followup?: unknown;
      voice?: unknown;
      speed?: unknown;
      quality?: unknown;
    };
    return {
      mode: body?.mode === "learn" ? "learn" : "practice",
      followup: body?.followup === true,
      voice: isVoiceAgentVoiceId(body?.voice) ? body.voice : fallback.voice,
      speed: clampVoiceAgentSpeed(body?.speed),
      quality: isVoiceAgentQuality(body?.quality) ? body.quality : fallback.quality,
    };
  } catch {
    return fallback;
  }
}

function saverModels(): string[] {
  const primary = process.env.OPENAI_REALTIME_MINI_MODEL || VOICE_AGENT_SAVER_MODEL;
  const fallback = VOICE_AGENT_SAVER_FALLBACK_MODEL;
  return primary === fallback ? [primary] : [primary, fallback];
}

function fullModel(): string {
  return process.env.OPENAI_REALTIME_MODEL || VOICE_AGENT_DEFAULT_MODEL;
}

/** Mints a short-lived OpenAI Realtime client secret so the browser never sees the real API key. */
export async function POST(request: Request) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Sign in to start a voice session." }, { status: 401 });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Voice agent is not configured: OPENAI_API_KEY is missing." },
      { status: 500 },
    );
  }

  const { mode, followup, voice, speed, quality } = await readSessionOptions(request);
  const saver = quality === "saver";
  const learning = mode === "learn";
  const baseInstructions = followup
    ? VOICE_AGENT_FOLLOWUP_INSTRUCTIONS
    : learning
      ? VOICE_AGENT_LEARNING_INSTRUCTIONS
      : VOICE_AGENT_INSTRUCTIONS;
  const instructions = saver ? `${baseInstructions}${VOICE_AGENT_SAVER_INSTRUCTIONS_SUFFIX}` : baseInstructions;
  const tools = followup ? [] : learning ? VOICE_AGENT_LEARNING_TOOLS : VOICE_AGENT_TOOLS;
  const models = saver ? saverModels() : [fullModel()];

  const makeSessionConfig = (model: string) => ({
    session: {
      type: "realtime",
      model,
      instructions,
      output_modalities: ["audio"],
      audio: {
        input: {
          format: { type: "audio/pcm", rate: 24000 },
          turn_detection: saver
            ? {
                type: "server_vad",
                threshold: 0.6,
                prefix_padding_ms: 300,
                silence_duration_ms: 700,
                create_response: true,
                interrupt_response: false,
              }
            : {
                type: "semantic_vad",
                create_response: true,
                interrupt_response: false,
              },
          noise_reduction: { type: "near_field" },
          transcription: { model: "gpt-4o-mini-transcribe" },
        },
        output: {
          format: { type: "audio/pcm", rate: 24000 },
          voice,
          speed,
        },
      },
      ...(tools.length > 0 ? { tools, tool_choice: "auto" as const } : {}),
    },
  });

  try {
    let data: unknown = null;
    let lastStatus = 502;
    let lastError = "Failed to create a realtime voice session with OpenAI.";

    for (const model of models) {
      const response = await fetch("https://api.openai.com/v1/realtime/client_secrets", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "OpenAI-Safety-Identifier": `voice-agent-${randomUUID()}`,
        },
        body: JSON.stringify(makeSessionConfig(model)),
        cache: "no-store",
      });

      data = await response.json().catch(() => null);
      lastStatus = response.status || 502;
      const message =
        data && typeof data === "object" && data !== null
          ? (data as { error?: { message?: unknown } }).error?.message
          : null;
      lastError = typeof message === "string" && message ? message : lastError;

      if (response.ok && data) {
        return NextResponse.json(data);
      }

      const retryable =
        saver &&
        models.length > 1 &&
        typeof lastError === "string" &&
        /model|not found|invalid|unknown/i.test(lastError);
      if (!retryable) break;
    }

    return NextResponse.json({ error: lastError }, { status: lastStatus || 502 });
  } catch (error) {
    console.error("voice-agent session error", error);
    return NextResponse.json(
      { error: "Failed to reach OpenAI to start the voice session." },
      { status: 502 },
    );
  }
}
