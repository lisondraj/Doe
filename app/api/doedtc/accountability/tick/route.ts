import { NextResponse } from "next/server";

import {
  listDueAccountabilityPacts,
  processAccountabilityPactTick,
} from "@/lib/doedtc/doedtc-accountability-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

  const due = await listDueAccountabilityPacts();
  const results: Array<{ pactId: string; ok: boolean; error?: string }> = [];

  for (const pact of due) {
    try {
      await processAccountabilityPactTick(pact.id);
      results.push({ pactId: pact.id, ok: true });
    } catch (error) {
      results.push({
        pactId: pact.id,
        ok: false,
        error: error instanceof Error ? error.message : "Tick failed",
      });
    }
  }

  return NextResponse.json({ ok: true, processed: results.length, results });
}
