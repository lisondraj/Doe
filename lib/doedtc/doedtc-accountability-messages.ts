import { defaultMessagePack } from "@/lib/doedtc/doedtc-accountability";
import type { DoeDtcAccountabilityMessagePack } from "@/lib/doedtc/doedtc-types";

export async function generateAccountabilityMessagePack(params: {
  goal: string;
  ownerName: string;
  subjectName: string;
  partnerName?: string;
  privacy: "high" | "normal";
}): Promise<DoeDtcAccountabilityMessagePack> {
  const fallback = defaultMessagePack(params);
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return fallback;

  const goalForModel =
    params.privacy === "high"
      ? "a personal goal (keep invite copy vague — do not name addiction, substance use, or sensitive details unless explicitly in the goal for partner-facing copy only)"
      : params.goal.trim();

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.4,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "Write short SMS message_pack JSON for an accountability pact on Doe. Keys: partner_invite, check_in, check_in_variants (array of 2 strings), miss, celebrate, withdraw. Plain language, warm, under 240 chars each. No markdown. privacy high = vague partner_invite.",
          },
          {
            role: "user",
            content: JSON.stringify({
              goal: goalForModel,
              ownerName: params.ownerName,
              subjectName: params.subjectName,
              partnerName: params.partnerName ?? null,
              privacy: params.privacy,
            }),
          },
        ],
      }),
    });
    if (!response.ok) return fallback;
    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const raw = payload.choices?.[0]?.message?.content;
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<DoeDtcAccountabilityMessagePack>;
    return {
      partner_invite: parsed.partner_invite?.trim() || fallback.partner_invite,
      check_in: parsed.check_in?.trim() || fallback.check_in,
      check_in_variants: Array.isArray(parsed.check_in_variants)
        ? parsed.check_in_variants
            .filter((row): row is string => typeof row === "string" && row.trim().length > 0)
            .slice(0, 3)
        : fallback.check_in_variants,
      miss: parsed.miss?.trim() || fallback.miss,
      celebrate: parsed.celebrate?.trim() || fallback.celebrate,
      withdraw: parsed.withdraw?.trim() || fallback.withdraw,
    };
  } catch {
    return fallback;
  }
}
