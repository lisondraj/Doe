import { NextResponse } from "next/server";

import { listDoeDtcAgentTurns } from "@/lib/doedtc/doedtc-agent-audit";
import {
  KERNEL_SESSION_TIMEOUT_SECONDS,
  listOpenDoeDtcBrowserJobs,
} from "@/lib/doedtc/doedtc-browser-db";
import { getDoeDtcWatchUser } from "@/lib/doedtc/doedtc-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getDoeDtcWatchUser();
    if (!user) {
      return NextResponse.json({ ok: false, error: "No DTC user found." }, { status: 404 });
    }

    const [turns, browserJobs] = await Promise.all([
      listDoeDtcAgentTurns({ userId: user.id, limit: 40 }),
      listOpenDoeDtcBrowserJobs(user.id),
    ]);

    return NextResponse.json(
      {
        ok: true,
        user: {
          id: user.id,
          phone: user.phone,
          fullName: user.full_name,
          status: user.status,
        },
        turns,
        browserJobs: browserJobs.map((job) => ({
          ...job,
          ageSeconds: Math.round((Date.now() - Date.parse(job.updated_at)) / 1000),
          stale:
            Date.now() - Date.parse(job.updated_at) > KERNEL_SESSION_TIMEOUT_SECONDS * 1000,
        })),
        kernelTimeoutSeconds: KERNEL_SESSION_TIMEOUT_SECONDS,
      },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Watch feed failed.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
