import assert from "node:assert/strict";
import test from "node:test";

import {
  formatAgentPendingForPrompt,
  isCommitPending,
  isPendingExpired,
  isRunStatePending,
  PENDING_PROMPT_ARGS_MAX_CHARS,
  PENDING_TTL_MS,
  sanitizePendingArgsForPrompt,
} from "@/lib/doedtc/doedtc-pending";
import {
  guardAgentPromptSize,
  isRetryableOpenAiStatus,
  retryDelayMs,
} from "@/lib/doedtc/agent/openai-retry";

test("isRunStatePending detects serialized SDK state", () => {
  assert.equal(isRunStatePending({ runState: "abc" }), true);
  assert.equal(isRunStatePending({ runState: "" }), false);
  assert.equal(isRunStatePending({ body: "hello", send_at: "in 10 seconds" }), false);
});

test("isCommitPending excludes runState-only rows", () => {
  assert.equal(isCommitPending({ runState: "abc" }), false);
  assert.equal(isCommitPending({ body: "stretch", send_at: "in 10 seconds" }), true);
});

test("formatAgentPendingForPrompt never embeds runState blob", () => {
  const blob = "x".repeat(50_000);
  const formatted = formatAgentPendingForPrompt({
    user_id: "user-1",
    kind: "schedule_text",
    commit_tool: "schedule_text",
    args: { runState: blob },
    summary: "Waiting for your confirmation.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  assert.ok(!formatted.includes(blob));
  assert.match(formatted, /Pending SDK approval/);
});

test("sanitizePendingArgsForPrompt caps commit args for prompt injection", () => {
  const sanitized = sanitizePendingArgsForPrompt({
    body: "a".repeat(PENDING_PROMPT_ARGS_MAX_CHARS + 500),
    send_at: "in 10 seconds",
  });
  const formatted = formatAgentPendingForPrompt({
    user_id: "user-1",
    kind: "schedule_text",
    commit_tool: "schedule_text",
    args: sanitized,
    summary: "Reminder at in 10 seconds.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  assert.ok(formatted.length < PENDING_PROMPT_ARGS_MAX_CHARS + 300);
  assert.ok(!formatted.includes("a".repeat(PENDING_PROMPT_ARGS_MAX_CHARS + 100)));
});

test("isPendingExpired treats rows older than TTL as stale", () => {
  const fresh = new Date(Date.now() - PENDING_TTL_MS + 60_000).toISOString();
  const stale = new Date(Date.now() - PENDING_TTL_MS - 1_000).toISOString();

  assert.equal(isPendingExpired({ updated_at: fresh }), false);
  assert.equal(isPendingExpired({ updated_at: stale }), true);
});

test("guardAgentPromptSize truncates oversized prompts", () => {
  const prompt = `Header\nRecent conversation:\n${"line\n".repeat(20_000)}\n\nAppointments:\nNone\nSafety block`;
  const guarded = guardAgentPromptSize(prompt, 4_000);
  assert.ok(guarded.length <= 4_000);
  assert.match(guarded, /truncated/);
  assert.match(guarded, /Safety block/);
});

test("openai retry helpers recognize retryable statuses", () => {
  assert.equal(isRetryableOpenAiStatus(429), true);
  assert.equal(isRetryableOpenAiStatus(503), true);
  assert.equal(isRetryableOpenAiStatus(400), false);
  assert.ok(retryDelayMs(0, null) >= 1_000);
  assert.equal(retryDelayMs(0, 2_000), 2_000);
});
