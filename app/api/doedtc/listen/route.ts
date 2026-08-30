import { NextResponse } from "next/server";

import {
  completeDoeDtcListenSession,
  failDoeDtcListenSession,
  getDoeDtcListenSession,
  getDoeDtcUserByCareToken,
} from "@/lib/doedtc/doedtc-db";
import {
  summarizeDoeDtcListenTranscript,
  transcribeDoeDtcAudio,
} from "@/lib/doedtc/doedtc-transcribe";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_DURATION_SECONDS = 60 * 60;
const MIN_AUDIO_BYTES = 400;

export async function POST(request: Request) {
  try {
    let form: FormData;
    try {
      form = await request.formData();
    } catch {
      return NextResponse.json({ ok: false, error: "Missing audio." }, { status: 400 });
    }

    const token = String(form.get("token") ?? "").trim();
    const sessionId = String(form.get("sessionId") ?? "").trim();
    const durationRaw = Number(form.get("durationSeconds") ?? 0);
    const durationSeconds = Number.isFinite(durationRaw)
      ? Math.min(Math.max(0, Math.floor(durationRaw)), MAX_DURATION_SECONDS)
      : 0;

    if (!token || !sessionId) {
      return NextResponse.json({ ok: false, error: "Missing token or session." }, { status: 400 });
    }

    const user = await getDoeDtcUserByCareToken(token);
    if (!user) {
      return NextResponse.json({ ok: false, error: "Session link is invalid." }, { status: 404 });
    }

    const session = await getDoeDtcListenSession({ sessionId, userId: user.id });
    if (!session) {
      return NextResponse.json({ ok: false, error: "Listen session not found." }, { status: 404 });
    }
    if (session.status !== "pending") {
      return NextResponse.json({ ok: false, error: "This session is already complete." }, { status: 400 });
    }

    const audio = form.get("audio");
    if (!(audio instanceof File) || audio.size < MIN_AUDIO_BYTES) {
      await failDoeDtcListenSession({ sessionId, userId: user.id });
      return NextResponse.json(
        { ok: false, error: "Recording was too short. Try again." },
        { status: 400 },
      );
    }

    const transcript = await transcribeDoeDtcAudio(audio);
    if (!transcript) {
      await failDoeDtcListenSession({ sessionId, userId: user.id });
      return NextResponse.json(
        { ok: false, error: "Could not transcribe the recording. Try again." },
        { status: 400 },
      );
    }

    const summary = await summarizeDoeDtcListenTranscript(transcript);
    const completed = await completeDoeDtcListenSession({
      sessionId,
      userId: user.id,
      transcript,
      summary,
      durationSeconds: durationSeconds || 1,
      appointmentId: session.appointment_id,
    });

    return NextResponse.json({
      ok: true,
      session: completed,
      profileHref: `/doedtc/app?t=${encodeURIComponent(token)}&tab=appointments`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save transcription.";
    const status = message.includes("not configured") ? 503 : 500;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
