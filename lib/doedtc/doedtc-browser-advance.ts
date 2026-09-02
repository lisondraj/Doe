import { doeDtcPublicOrigin } from "@/lib/doedtc/doedtc-copy";
import { resolveResearchBrowseTarget } from "@/lib/doedtc/doedtc-browser-allowlist";
import { getDoeDtcBrowserJobById, updateDoeDtcBrowserJob } from "@/lib/doedtc/doedtc-browser-db";
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
import type { DoeDtcUserRow } from "@/lib/doedtc/doedtc-types";

export async function dispatchDoeDtcBrowserAdvance(params: {
  jobId: string;
  turnId?: string;
}): Promise<void> {
  const secret = process.env.CRON_SECRET?.trim();
  const origin = doeDtcPublicOrigin();
  const url = `${origin}/api/doedtc/browser/advance`;

  void fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(secret ? { Authorization: `Bearer ${secret}` } : {}),
    },
    body: JSON.stringify({ jobId: params.jobId, turnId: params.turnId }),
  }).catch((error) => {
    console.warn(
      "[doedtc] browser advance dispatch failed:",
      error instanceof Error ? error.message : String(error),
    );
  });
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

export async function advanceDoeDtcBrowserJob(params: {
  jobId: string;
  turnId?: string;
}): Promise<{ ok: boolean; error?: string }> {
  const resolvedJob = await getDoeDtcBrowserJobById(params.jobId);
  if (!resolvedJob) {
    return { ok: false, error: "Browser job not found." };
  }

  const user = await getDoeDtcUserById(resolvedJob.user_id);
  if (!user) {
    return { ok: false, error: "User not found for browser job." };
  }

  const turnId = params.turnId ?? (await findTurnIdForBrowserJob(params.jobId));

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
