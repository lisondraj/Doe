import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  clampVoiceAgentSpeed,
  isVoiceAgentQuality,
  isVoiceAgentVoiceId,
  VOICE_AGENT_DEFAULT_SETTINGS,
  type VoiceAgentVoiceSettings,
} from "@/lib/voice-agent/voice-agent-settings";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function parseSettings(value: unknown): VoiceAgentVoiceSettings {
  const body = value && typeof value === "object" ? (value as { voice?: unknown; speed?: unknown; quality?: unknown }) : {};
  return {
    voice: isVoiceAgentVoiceId(body.voice) ? body.voice : VOICE_AGENT_DEFAULT_SETTINGS.voice,
    speed: clampVoiceAgentSpeed(body.speed),
    quality: isVoiceAgentQuality(body.quality) ? body.quality : VOICE_AGENT_DEFAULT_SETTINGS.quality,
  };
}

export async function GET() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Sign in to load settings." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("voice_agent_settings")
    .select("voice, speed, quality")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("voice-agent settings load", error);
    return NextResponse.json({ error: "Could not load voice settings." }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ settings: null });
  }

  return NextResponse.json({ settings: parseSettings(data) });
}

export async function PUT(request: Request) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Sign in to save settings." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid settings payload." }, { status: 400 });
  }

  const settings = parseSettings(body);
  const { error } = await supabase.from("voice_agent_settings").upsert(
    {
      user_id: user.id,
      voice: settings.voice,
      speed: settings.speed,
      quality: settings.quality,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  if (error) {
    console.error("voice-agent settings save", error);
    return NextResponse.json({ error: "Could not save voice settings." }, { status: 500 });
  }

  return NextResponse.json({ settings });
}
