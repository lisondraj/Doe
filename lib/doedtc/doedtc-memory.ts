import MemoryClient from "mem0ai";

import { sanitizeMem0Text, shouldSkipMem0Memory } from "@/lib/doedtc/doedtc-privacy";

let client: MemoryClient | null = null;

function getMem0Client(): MemoryClient | null {
  const apiKey = process.env.MEM0_API_KEY?.trim();
  if (!apiKey) return null;
  if (!client) {
    client = new MemoryClient({ apiKey });
  }
  return client;
}

export async function searchDoeDtcMem0Memories(params: {
  userId: string;
  query: string;
  topK?: number;
}): Promise<string[]> {
  const mem0 = getMem0Client();
  if (!mem0) return [];

  try {
    const results = await mem0.search(params.query, {
      filters: { user_id: params.userId },
      topK: params.topK ?? 5,
    });
    const rows = Array.isArray(results)
      ? results
      : Array.isArray((results as { results?: unknown[] }).results)
        ? (results as { results: Array<{ memory?: string }> }).results
        : [];

    return rows
      .map((row) => ("memory" in row ? String(row.memory ?? "") : ""))
      .filter(Boolean)
      .slice(0, 5);
  } catch {
    return [];
  }
}

export async function addDoeDtcMem0Turn(params: {
  userId: string;
  inboundText: string;
  replyText: string;
}): Promise<void> {
  const mem0 = getMem0Client();
  if (!mem0) return;

  const userText = sanitizeMem0Text(params.inboundText);
  const assistantText = sanitizeMem0Text(params.replyText);
  if (!userText || shouldSkipMem0Memory(userText) || shouldSkipMem0Memory(assistantText)) {
    return;
  }

  try {
    await mem0.add(
      [
        { role: "user", content: userText },
        { role: "assistant", content: assistantText },
      ],
      { user_id: params.userId },
    );
  } catch {
    // Mem0 is best-effort; Supabase remains source of truth.
  }
}

export async function addDoeDtcMem0Fact(params: {
  userId: string;
  fact: string;
}): Promise<void> {
  const mem0 = getMem0Client();
  if (!mem0) return;

  const fact = sanitizeMem0Text(params.fact);
  if (!fact || shouldSkipMem0Memory(fact)) return;

  try {
    await mem0.add([{ role: "user", content: fact }], { user_id: params.userId });
  } catch {
    // Best-effort dual-write.
  }
}

export function formatMem0Block(memories: string[]): string {
  if (memories.length === 0) return "No relevant long-term memories.";
  return memories.map((memory) => `- ${memory}`).join("\n");
}
