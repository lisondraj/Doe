import { NextResponse } from "next/server";

import { processDoeDtcInboundWebhook } from "@/lib/doedtc/doedtc-messaging";
import { verifyLinqWebhookSignature } from "@/lib/doedtc/linq";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const rawBody = await request.text();

  try {
    const valid = verifyLinqWebhookSignature({
      rawBody,
      headers: request.headers,
    });
    if (!valid) {
      return NextResponse.json({ ok: false, error: "Invalid webhook signature." }, { status: 401 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook verification failed.";
    return NextResponse.json({ ok: false, error: message }, { status: 503 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody) as unknown;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON payload." }, { status: 400 });
  }

  const eventType =
    request.headers.get("X-Webhook-Event") ??
    (payload as { type?: string; event?: string }).type ??
    (payload as { type?: string; event?: string }).event ??
    "";

  if (eventType && eventType !== "message.received") {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const webhookEventId =
    request.headers.get("webhook-id") ??
    (payload as { event_id?: string; id?: string }).event_id ??
    (payload as { event_id?: string; id?: string }).id ??
    undefined;

  try {
    await processDoeDtcInboundWebhook({ payload, webhookEventId });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[doedtc/linq webhook]", error);
    return NextResponse.json({ ok: false, error: "Webhook processing failed." }, { status: 500 });
  }
}
