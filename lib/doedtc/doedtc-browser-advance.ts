import { doeDtcPublicOrigin } from "@/lib/doedtc/doedtc-copy";
import { resolveResearchBrowseTarget } from "@/lib/doedtc/doedtc-browser-allowlist";
import {
  getDoeDtcBrowserJobById,
  listOpenDoeDtcBrowserJobs,
  updateDoeDtcBrowserJob,
} from "@/lib/doedtc/doedtc-browser-db";
import {
  navigateDoeDtcBrowser,
  snapshotDoeDtcBrowser,
} from "@/lib/doedtc/doedtc-browser";
import { getDoeDtcUserById } from "@/lib/doedtc/doedtc-db";
import {
  sendDoeDtcBrowserFailureOutbound,
  sendDoeDtcBrowserScreenshotOutbound,
} from "@/lib/doedtc/doedtc-messaging";
import { finalizeDoeDtcTurnAfterBrowser } from "@/lib/doedtc/doedtc-turn-lifecycle";
import type { DoeDtcBrowserJobRow, DoeDtcUserRow } from "@/lib/doedtc/doedtc-types";

const ADVANCING_OUTCOME = "advancing";
const RECOVER_AFTER_MS = 20_000;
const STALE_ADVANCING_MS = 120_000;
const RECOVER_MAX_AGE_MS = 15 * 60_000;

export function doeDtcRuntimeOrigin(): string {
  const vercel = process.env.VERCEL_URL?.trim().replace(/\/$/, "");
  if (vercel) return vercel.startsWith("http") ? vercel : `https://${vercel}`;
  const configured = process.env.DOEDTC_PUBLIC_ORIGIN?.trim().replace(/\/$/, "");
  if (configured) return configured;
  if (process.env.NODE_ENV !== "production") return "http://127.0.0.1:3000";
  return doeDtcPublicOrigin();
}

export function shouldRecoverBrowserJob(
  job: Pick<DoeDtcBrowserJobRow, "mode" | "status" | "outcome" | "created_at" | "updated_at">,
  now = Date.now(),
): boolean {
  if (job.mode !== "research" || job.status !== "open") return false;
  const created = Date.parse(job.created_at);
  if (!Number.isFinite(created)) return false;
  const age = now - created;
  if (age < RECOVER_AFTER_MS || age > RECOVER_MAX_AGE_MS) return false;
  if (job.outcome === ADVANCING_OUTCOME) {
    const updated = Date.parse(job.updated_at);
    if (Number.isFinite(updated) && now - updated < STALE_ADVANCING_MS) return false;
  } else if (job.outcome && job.outcome !== ADVANCING_OUTCOME) {
    return false;
  }
  return true;
}

function attachBackgroundWork(work: Promise<unknown>): boolean {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const vercel = require("@vercel/functions") as { waitUntil?: (promise: Promise<unknown>) => void };
    if (typeof vercel.waitUntil === "function") {
      vercel.waitUntil(work);
      return true;
    }
  } catch {
    // optional in local tests
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const nextServer = require("next/server") as {
      unstable_after?: (fn: () => void | Promise<void>) => void;
    };
    if (typeof nextServer.unstable_after === "function") {
      nextServer.unstable_after(() => work);
      return true;
    }
  } catch {
    // not inside a Next request
  }

  return false;
}

async function fireAdvanceHttp(params: { jobId: string; turnId?: string }): Promise<void> {
  const secret = process.env.CRON_SECRET?.trim();
  const url = `${doeDtcRuntimeOrigin()}/api/doedtc/browser/advance`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(secret ? { Authorization: `Bearer ${secret}` } : {}),
    },
    body: JSON.stringify({ jobId: params.jobId, turnId: params.turnId }),
    cache: "no-store",
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Browser advance HTTP ${response.status}: ${body.slice(0, 200)}`);
  }
}

export function dispatchDoeDtcBrowserAdvance(params: {
  jobId: string;
  turnId?: string;
}): void {
  const work = advanceDoeDtcBrowserJob(params).catch((error) => {
    console.warn(
      "[doedtc] browser advance failed:",
      error instanceof Error ? error.message : String(error),
    );
  });
  if (!attachBackgroundWork(work)) {
    void fireAdvanceHttp(params).catch((error) => {
      console.warn(
        "[doedtc] browser advance dispatch failed:",
        error instanceof Error ? error.message : String(error),
      );
    });
  }
}

async function findTurnIdForBrowserJob(jobId: string): Promise<string | null> {
  const { createSupabaseAdmin } = await import("@/lib/supabase/admin");
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_agent_turns")
    .select("id")
    .eq("browser_job_id", jobId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) return null;
  return (data as { id?: string } | null)?.id ?? null;
}

async function failBrowserJob(params: {
  user: DoeDtcUserRow;
  jobId: string;
  turnId: string | null;
  error: string;
}): Promise<{ ok: false; error: string }> {
  await updateDoeDtcBrowserJob({
    jobId: params.jobId,
    userId: params.user.id,
    patch: {
      status: "failed",
      outcome: params.error,
    },
  }).catch(() => undefined);
  await sendDoeDtcBrowserFailureOutbound({
    user: params.user,
    error: params.error,
    idempotencyKey: `doedtc-browser-advance-fail-${params.jobId}`,
  }).catch((error) => {
    console.warn(
      "[doedtc] browser failure follow-up failed:",
      error instanceof Error ? error.message : String(error),
    );
  });
  if (params.turnId) {
    await finalizeDoeDtcTurnAfterBrowser({ turnId: params.turnId, failed: true });
  }
  return { ok: false, error: params.error };
}

export async function claimDoeDtcBrowserJobAdvance(
  job: DoeDtcBrowserJobRow,
  now = Date.now(),
): Promise<boolean> {
  if (job.status !== "open") return false;
  if (job.outcome === ADVANCING_OUTCOME) {
    const updated = Date.parse(job.updated_at);
    if (Number.isFinite(updated) && now - updated < STALE_ADVANCING_MS) return false;
  } else if (job.outcome) {
    return false;
  }
  await updateDoeDtcBrowserJob({
    jobId: job.id,
    userId: job.user_id,
    patch: { outcome: ADVANCING_OUTCOME },
  });
  return true;
}

export async function recoverStuckDoeDtcBrowserJobs(now = Date.now()): Promise<
  Array<{ jobId: string; dispatched: boolean; ok?: boolean }>
> {
  const jobs = await listOpenDoeDtcBrowserJobs();
  const recovered: Array<{ jobId: string; dispatched: boolean; ok?: boolean }> = [];
  const candidates = jobs.filter((job) => shouldRecoverBrowserJob(job, now)).slice(0, 2);
  for (const job of candidates) {
    const result = await advanceDoeDtcBrowserJob({ jobId: job.id });
    recovered.push({ jobId: job.id, dispatched: true, ok: result.ok });
  }
  return recovered;
}

export async function advanceDoeDtcBrowserJob(params: {
  jobId: string;
  turnId?: string;
}): Promise<{ ok: boolean; error?: string; skipped?: boolean }> {
  const resolvedJob = await getDoeDtcBrowserJobById(params.jobId);
  if (!resolvedJob) {
    return { ok: false, error: "Browser job not found." };
  }
  if (resolvedJob.status === "committed" || resolvedJob.status === "failed") {
    return { ok: true, skipped: true };
  }

  const user = await getDoeDtcUserById(resolvedJob.user_id);
  if (!user) {
    return { ok: false, error: "User not found for browser job." };
  }

  const turnId = params.turnId ?? (await findTurnIdForBrowserJob(params.jobId));
  const claimed = await claimDoeDtcBrowserJobAdvance(resolvedJob);
  if (!claimed) {
    return { ok: true, skipped: true };
  }

  try {
    if (resolvedJob.mode === "research") {
      const resolved = resolveResearchBrowseTarget({
        url: resolvedJob.allowed_host ? `https://${resolvedJob.allowed_host}` : "",
        intent: resolvedJob.intent,
      });
      if ("ok" in resolved) {
        return failBrowserJob({
          user,
          jobId: resolvedJob.id,
          turnId,
          error: resolved.error,
        });
      }

      const navigated = await navigateDoeDtcBrowser({
        user,
        jobId: resolvedJob.id,
        url: resolved.targetUrl,
        searchQueryHint: resolvedJob.intent,
      });
      if (!navigated.ok) {
        return failBrowserJob({
          user,
          jobId: resolvedJob.id,
          turnId,
          error: navigated.error ?? "Navigation failed",
        });
      }
    }

    const snapshot = await snapshotDoeDtcBrowser({
      user,
      jobId: resolvedJob.id,
      caption: resolvedJob.intent,
      kind: "result",
    });

    if (!snapshot.ok || !snapshot.screenshotUrl) {
      return failBrowserJob({
        user,
        jobId: resolvedJob.id,
        turnId,
        error: snapshot.error ?? "Could not capture a screenshot.",
      });
    }

    await sendDoeDtcBrowserScreenshotOutbound({
      user,
      chatId: user.linq_chat_id ?? undefined,
      screenshotUrl: snapshot.screenshotUrl,
      idempotencyKey: `doedtc-browser-advance-${resolvedJob.id}`,
    });

    await updateDoeDtcBrowserJob({
      jobId: resolvedJob.id,
      userId: user.id,
      patch: {
        status: "committed",
        outcome: snapshot.excerpt?.slice(0, 500) ?? "Screenshot captured",
      },
    });

    if (turnId) {
      await finalizeDoeDtcTurnAfterBrowser({ turnId });
    }

    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Browser advance failed.";
    return failBrowserJob({
      user,
      jobId: resolvedJob.id,
      turnId,
      error: message,
    });
  }
}
