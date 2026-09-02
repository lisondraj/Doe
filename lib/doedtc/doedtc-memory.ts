import MemoryClient from "mem0ai";

import {
  DOE_MEM0_AGENT_ID,
  DOE_MEM0_METADATA,
  DOE_MEM0_PLAYBOOK_METADATA,
  doeDtcMem0PlaybookFilters,
  doeDtcMem0SearchFilters,
} from "@/lib/doedtc/doedtc-mem0-constants";
import { listDoeDtcMemories } from "@/lib/doedtc/doedtc-db";
import {
  redactDoeDtcLogText,
  sanitizeMem0Text,
  shouldSkipMem0Memory,
} from "@/lib/doedtc/doedtc-privacy";
import { looksLikeWorkingAck } from "@/lib/doedtc/agent/active-work";

let client: MemoryClient | null = null;

function getMem0Client(): MemoryClient | null {
  const apiKey = process.env.MEM0_API_KEY?.trim();
  if (!apiKey) return null;
  if (!client) {
    client = new MemoryClient({ apiKey });
  }
  return client;
}

function warnMem0Failure(action: string, error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  console.warn(`[doedtc:mem0] ${action} failed: ${redactDoeDtcLogText(message)}`);
}

export async function searchDoeDtcMem0Playbook(params: {
  userId: string;
  query: string;
  topK?: number;
}): Promise<string[]> {
  const mem0 = getMem0Client();
  if (!mem0) return [];

  try {
    const results = await mem0.search(params.query, {
      filters: doeDtcMem0PlaybookFilters(params.userId),
      topK: params.topK ?? 3,
    });
    const rows = Array.isArray(results)
      ? results
      : Array.isArray((results as { results?: unknown[] }).results)
        ? (results as { results: Array<{ memory?: string }> }).results
        : [];

    return rows
      .map((row) => ("memory" in row ? String(row.memory ?? "") : ""))
      .filter(Boolean)
      .slice(0, 3);
  } catch (error) {
    warnMem0Failure("search playbook", error);
    return [];
  }
}

export async function addDoeDtcMem0PlaybookNote(params: {
  userId: string;
  note: string;
}): Promise<void> {
  const mem0 = getMem0Client();
  if (!mem0) return;

  const note = sanitizeMem0Text(params.note);
  if (!note || shouldSkipMem0Memory(note)) return;

  try {
    await mem0.add([{ role: "user", content: note }], {
      userId: params.userId,
      agentId: DOE_MEM0_AGENT_ID,
      metadata: { ...DOE_MEM0_PLAYBOOK_METADATA },
    });
  } catch (error) {
    warnMem0Failure("add playbook", error);
  }
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
      filters: doeDtcMem0SearchFilters(params.userId),
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
  } catch (error) {
    warnMem0Failure("search", error);
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
  if (looksLikeWorkingAck(assistantText)) return;

  try {
    await mem0.add(
      [
        { role: "user", content: userText },
        { role: "assistant", content: assistantText },
      ],
      {
        userId: params.userId,
        agentId: DOE_MEM0_AGENT_ID,
        metadata: { ...DOE_MEM0_METADATA },
      },
    );
  } catch (error) {
    warnMem0Failure("add turn", error);
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
    await mem0.add([{ role: "user", content: fact }], {
      userId: params.userId,
      agentId: DOE_MEM0_AGENT_ID,
      metadata: { ...DOE_MEM0_METADATA },
    });
  } catch (error) {
    warnMem0Failure("add fact", error);
  }
}

export async function deleteDoeDtcMem0Fact(params: {
  userId: string;
  factHint: string;
}): Promise<void> {
  const mem0 = getMem0Client();
  const hint = params.factHint.trim();
  if (!mem0 || !hint) return;

  try {
    const results = await mem0.search(hint, {
      filters: doeDtcMem0SearchFilters(params.userId),
      topK: 8,
    });
    const rows = Array.isArray(results)
      ? results
      : Array.isArray((results as { results?: unknown[] }).results)
        ? (results as { results: Array<{ id?: string; memory?: string }> }).results
        : [];

    const hintLower = hint.toLowerCase();
    for (const row of rows) {
      const memory = "memory" in row ? String(row.memory ?? "") : "";
      const id = "id" in row ? String(row.id ?? "") : "";
      if (!id || !memory) continue;
      if (!memory.toLowerCase().includes(hintLower) && !hintLower.includes(memory.toLowerCase().slice(0, 24))) {
        continue;
      }
      await mem0.delete(id);
    }
  } catch (error) {
    warnMem0Failure("delete fact", error);
  }
}

export async function loadDoeDtcMemoriesForPrompt(params: {
  userId: string;
  query: string;
  topK?: number;
  postgresLimit?: number;
}): Promise<string[]> {
  const limit = params.topK ?? 8;
  const [postgresRows, mem0Rows] = await Promise.all([
    listDoeDtcMemories(params.userId, params.postgresLimit ?? 20),
    searchDoeDtcMem0Memories({ userId: params.userId, query: params.query, topK: limit }),
  ]);

  const seen = new Set<string>();
  const merged: string[] = [];

  const push = (fact: string) => {
    const trimmed = fact.trim();
    if (!trimmed) return;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    merged.push(trimmed);
  };

  for (const row of postgresRows) {
    push(row.fact);
  }
  for (const row of mem0Rows) {
    push(row);
  }

  return merged.slice(0, limit);
}

export function formatMem0Block(memories: string[]): string {
  if (memories.length === 0) return "";
  return memories.map((memory) => `- ${memory}`).join("\n");
}
