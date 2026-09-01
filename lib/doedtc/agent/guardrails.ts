import type { OutputGuardrail } from "@openai/agents";
import { DoeReplySchema, type DoeReply } from "@/lib/doedtc/agent/types";

const URL_IN_TEXT = /https?:\/\/\S+/i;
const MARKDOWN_PATTERN = /(\*\*|__|`|\*[^*\n]+\*|_[^_\n]+_)/;

function looksIncompleteFragment(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return true;
  if (/[.!?]$/.test(trimmed)) return false;
  if (/^(if|when|want|let me|feel free|i can also|what else|anything else|is there|do you|would you|should i|can i|could you)\b/i.test(trimmed)) {
    return true;
  }
  if (/[,;…]$/.test(trimmed) || /\.{2,}$/.test(trimmed)) return true;
  if (/\bif you\b/i.test(trimmed)) return true;
  return false;
}

export function assertDoeReplyVoice(reply: DoeReply): string | null {
  const text = reply.reply.trim();
  if (!text) return "Empty reply.";
  if (URL_IN_TEXT.test(text)) return "Reply contains a URL.";
  if (MARKDOWN_PATTERN.test(text)) return "Reply contains markdown formatting.";
  if (looksIncompleteFragment(text)) return "Reply ends with an incomplete sentence.";
  return null;
}

export const doeReplyOutputGuardrail: OutputGuardrail<typeof DoeReplySchema> = {
  name: "doe_imessage_voice",
  execute: async ({ agentOutput }) => {
    const parsed = DoeReplySchema.safeParse(agentOutput);
    if (!parsed.success) {
      console.warn("[doedtc:guardrail] reply schema:", parsed.error.message);
      return { tripwireTriggered: false, outputInfo: parsed.error.message };
    }
    const violation = assertDoeReplyVoice(parsed.data);
    if (violation) {
      console.warn("[doedtc:guardrail] voice:", violation);
    }
    // Voice issues are logged, not fatal. A tripwire aborts the whole SDK turn
    // and the user only sees "Something broke on my side".
    return { tripwireTriggered: false, outputInfo: violation };
  },
};
