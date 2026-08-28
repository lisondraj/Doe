import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  parseVoiceAgentHistoryRecord,
  serializeVoiceAgentHistoryRecord,
} from "@/lib/voice-agent/voice-agent-history";
import type { VoiceAgentHistoryRecord } from "@/lib/voice-agent/voice-agent-types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_RECORDS = 40;

export async function GET() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Sign in to load history." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("voice_agent_sessions")
    .select(
      "id, mode, topic, station_type, started_at, ended_at, transcript, advice_transcript, feedback, lesson",
    )
    .eq("user_id", user.id)
    .order("ended_at", { ascending: false })
    .limit(MAX_RECORDS);

  if (error) {
    console.error("voice-agent history load", error);
    return NextResponse.json({ error: "Could not load saved sessions." }, { status: 500 });
  }

  const history = (data ?? [])
    .map((row) => parseVoiceAgentHistoryRecord(row))
    .filter((record): record is VoiceAgentHistoryRecord => record !== null);

  return NextResponse.json({ history });
}

export async function POST(request: Request) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Sign in to save this session." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid session payload." }, { status: 400 });
  }

  const record = parseVoiceAgentHistoryRecord(body);
  if (!record) {
    return NextResponse.json({ error: "Invalid session payload." }, { status: 400 });
  }

  const row = serializeVoiceAgentHistoryRecord(record, user.id);
  const { error } = await supabase.from("voice_agent_sessions").upsert(row, { onConflict: "id" });

  if (error) {
    console.error("voice-agent history upsert", error);
    return NextResponse.json({ error: "Could not save this session." }, { status: 500 });
  }

  const { data } = await supabase
    .from("voice_agent_sessions")
    .select(
      "id, mode, topic, station_type, started_at, ended_at, transcript, advice_transcript, feedback, lesson",
    )
    .eq("user_id", user.id)
    .order("ended_at", { ascending: false })
    .limit(MAX_RECORDS);

  const history = (data ?? [])
    .map((entry) => parseVoiceAgentHistoryRecord(entry))
    .filter((entry): entry is VoiceAgentHistoryRecord => entry !== null);

  return NextResponse.json({ history });
}
