export const AGENT_PROMPT_MAX_CHARS = 80_000;

const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1_000;

export function isRetryableOpenAiStatus(status: number): boolean {
  return RETRYABLE_STATUS.has(status);
}

export function parseRetryAfterMs(response: Response): number | null {
  const header = response.headers.get("retry-after");
  if (!header) return null;
  const seconds = Number(header);
  if (Number.isFinite(seconds) && seconds > 0) {
    return Math.ceil(seconds * 1000);
  }
  const dateMs = Date.parse(header);
  if (Number.isFinite(dateMs)) {
    const delay = dateMs - Date.now();
    return delay > 0 ? delay : null;
  }
  return null;
}

export function retryDelayMs(attempt: number, retryAfterMs: number | null): number {
  if (retryAfterMs != null) {
    return Math.min(retryAfterMs, 15_000);
  }
  return Math.min(BASE_DELAY_MS * 2 ** attempt, 8_000);
}

export async function sleepMs(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchOpenAiWithRetry(
  url: string,
  init: RequestInit,
): Promise<Response> {
  let lastResponse: Response | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const response = await fetch(url, init);
    if (response.ok || !isRetryableOpenAiStatus(response.status) || attempt === MAX_RETRIES) {
      return response;
    }

    lastResponse = response;
    const retryAfterMs = parseRetryAfterMs(response);
    const delay = retryDelayMs(attempt, retryAfterMs);
    console.warn(
      `[doedtc:openai] retryable ${response.status} on attempt ${attempt + 1}/${MAX_RETRIES + 1}; waiting ${delay}ms`,
    );
    await sleepMs(delay);
  }

  return lastResponse!;
}

/**
 * Truncate the largest injectable sections when the assembled system prompt is too large.
 * Never drops safety/policy blocks at the tail of the prompt.
 */
export function guardAgentPromptSize(prompt: string, maxChars = AGENT_PROMPT_MAX_CHARS): string {
  if (prompt.length <= maxChars) return prompt;

  console.warn(
    `[doedtc:openai] system prompt too large (${prompt.length} chars); truncating transcript/history blocks`,
  );

  const sections: Array<{ marker: string; nextMarker: string | null }> = [
    { marker: "Recent conversation:\n", nextMarker: "\n\nAppointments:" },
    { marker: "Prior assessments:\n", nextMarker: "\n\nTools (internal" },
    { marker: "Symptom log:\n", nextMarker: "\n\nPrior assessments:" },
    { marker: "Relevant memories:\n", nextMarker: "\n\nSymptom log:" },
  ];

  let trimmed = prompt;
  for (const { marker, nextMarker } of sections) {
    if (trimmed.length <= maxChars) break;
    const start = trimmed.indexOf(marker);
    if (start < 0) continue;
    const contentStart = start + marker.length;
    const end =
      nextMarker != null ? trimmed.indexOf(nextMarker, contentStart) : trimmed.length;
    if (end < 0) continue;

    const head = trimmed.slice(0, contentStart);
    const tail = trimmed.slice(end);
    const budget = Math.max(120, maxChars - head.length - tail.length - 32);
    trimmed = `${head}${trimmed.slice(contentStart, contentStart + budget).trimEnd()}… (truncated)${tail}`;
  }

  if (trimmed.length > maxChars) {
    trimmed = `${trimmed.slice(0, maxChars - 24).trimEnd()}… (truncated)`;
  }

  return trimmed;
}
