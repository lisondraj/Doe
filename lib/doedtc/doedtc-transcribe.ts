const TRANSCRIBE_MODEL = "gpt-4o-mini-transcribe";

export function audioFilenameForMime(mime: string): string {
  const type = mime.toLowerCase();
  if (type.includes("mp4") || type.includes("aac") || type.includes("m4a")) return "listen.m4a";
  if (type.includes("mpeg") || type.includes("mp3")) return "listen.mp3";
  if (type.includes("wav")) return "listen.wav";
  return "listen.webm";
}

export async function transcribeDoeDtcAudio(audio: File): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Transcription is not configured: OPENAI_API_KEY is missing.");
  }

  const form = new FormData();
  form.append("file", audio, audio.name || audioFilenameForMime(audio.type));
  form.append("model", TRANSCRIBE_MODEL);

  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
    cache: "no-store",
  });

  const data = (await response.json().catch(() => null)) as {
    text?: unknown;
    error?: { message?: unknown };
  } | null;

  if (!response.ok) {
    throw new Error(
      (typeof data?.error?.message === "string" && data.error.message) ||
        "Could not transcribe the recording.",
    );
  }

  return typeof data?.text === "string" ? data.text.trim() : "";
}

export async function summarizeDoeDtcListenTranscript(transcript: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return transcript.slice(0, 280);
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "Summarize a medical appointment transcript in 2-3 plain-language sentences for the patient. Mention key topics discussed, plans, and follow-ups. No diagnosis claims.",
        },
        { role: "user", content: transcript.slice(0, 12000) },
      ],
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    return transcript.slice(0, 280);
  }

  const json = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return json.choices?.[0]?.message?.content?.trim() || transcript.slice(0, 280);
}
