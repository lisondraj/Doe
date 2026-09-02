import { recoverStuckDoeDtcBrowserJobs } from "@/lib/doedtc/doedtc-browser-advance";
import { listCareSeedCandidateUserIds, seedCareFollowUpLoopsForTick } from "@/lib/doedtc/doedtc-care-seeds";
import { getDoeDtcProfileSnapshot } from "@/lib/doedtc/doedtc-db";
import { listDueOpenLoops, processOpenLoopTick } from "@/lib/doedtc/doedtc-open-loops";
import { NextResponse } from "next/server";

import {
  listDueAccountabilityPacts,
  processAccountabilityPactTick,
} from "@/lib/doedtc/doedtc-accountability-db";
import {
  listDueScheduledTexts,
  processScheduledTextTick,
} from "@/lib/doedtc/doedtc-scheduled-db";
import { listDueWorkflows, processWorkflowTick } from "@/lib/doedtc/doedtc-workflows";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

function authorizeCron(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return process.env.NODE_ENV !== "production";
  const header = request.headers.get("authorization");
  return header === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!authorizeCron(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const duePacts = await listDueAccountabilityPacts();
  const pactResults: Array<{ pactId: string; ok: boolean; error?: string }> = [];
  for (const pact of duePacts) {
    try {
      await processAccountabilityPactTick(pact.id);
      pactResults.push({ pactId: pact.id, ok: true });
    } catch (error) {
      pactResults.push({
        pactId: pact.id,
        ok: false,
        error: error instanceof Error ? error.message : "Tick failed",
      });
    }
  }

  const dueTexts = await listDueScheduledTexts();
  const textResults: Array<{ scheduledTextId: string; ok: boolean; error?: string }> = [];
  for (const row of dueTexts) {
    try {
      await processScheduledTextTick(row.id);
      textResults.push({ scheduledTextId: row.id, ok: true });
    } catch (error) {
      textResults.push({
        scheduledTextId: row.id,
        ok: false,
        error: error instanceof Error ? error.message : "Tick failed",
      });
    }
  }

  const dueWorkflows = await listDueWorkflows();
  const workflowResults: Array<{ workflowId: string; ok: boolean; error?: string }> = [];
  for (const row of dueWorkflows) {
    try {
      await processWorkflowTick(row.id);
      workflowResults.push({ workflowId: row.id, ok: true });
    } catch (error) {
      workflowResults.push({
        workflowId: row.id,
        ok: false,
        error: error instanceof Error ? error.message : "Tick failed",
      });
    }
  }

  let browserRecovery: Array<{ jobId: string; dispatched: boolean }> = [];
  try {
    browserRecovery = await recoverStuckDoeDtcBrowserJobs();
  } catch (error) {
    console.warn(
      "[doedtc] browser recovery failed:",
      error instanceof Error ? error.message : String(error),
    );
  }

  const dueLoops = await listDueOpenLoops();
  const seedUserIds = Array.from(
    new Set<string>([
      ...dueLoops.map((loop) => loop.user_id),
      ...(await listCareSeedCandidateUserIds().catch(() => [])),
    ]),
  );
  for (const userId of seedUserIds) {
    try {
      const snapshot = await getDoeDtcProfileSnapshot(userId);
      await seedCareFollowUpLoopsForTick({ userId, snapshot });
    } catch (error) {
      console.warn(
        "[doedtc] care seed failed:",
        userId,
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  const wakeLoops = await listDueOpenLoops();
  const loopResults: Array<{ loopId: string; ok: boolean; error?: string }> = [];
  for (const loop of wakeLoops) {
    try {
      const result = await processOpenLoopTick(loop.id);
      loopResults.push({ loopId: loop.id, ok: result.ok, error: result.error });
    } catch (error) {
      loopResults.push({
        loopId: loop.id,
        ok: false,
        error: error instanceof Error ? error.message : "Open loop tick failed",
      });
    }
  }

  return NextResponse.json({
    ok: true,
    processed:
      pactResults.length +
      textResults.length +
      workflowResults.length +
      browserRecovery.length +
      loopResults.length,
    accountability: pactResults,
    scheduledTexts: textResults,
    workflows: workflowResults,
    browserRecovery,
    openLoops: loopResults,
  });
}
