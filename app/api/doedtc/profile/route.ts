import { NextResponse } from "next/server";

import { getDoeDtcProfileSnapshot, getDoeDtcUserByCareToken } from "@/lib/doedtc/doedtc-db";
import { handleDoeDtcProfileAction } from "@/lib/doedtc/handle-doedtc-profile-action";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get("t")?.trim() ?? "";
    if (!token) {
      return NextResponse.json({ ok: false, error: "Missing token." }, { status: 400 });
    }

    const user = await getDoeDtcUserByCareToken(token);
    if (!user) {
      return NextResponse.json({ ok: false, error: "Profile link is invalid." }, { status: 404 });
    }

    const snapshot = await getDoeDtcProfileSnapshot(user.id);
    return NextResponse.json({ ok: true, snapshot });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load profile.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      token?: string;
      action?: string;
      payload?: Record<string, unknown>;
    };
    const token = String(body.token ?? "").trim();
    const action = String(body.action ?? "").trim();
    if (!token || !action) {
      return NextResponse.json({ ok: false, error: "Missing token or action." }, { status: 400 });
    }

    const result = await handleDoeDtcProfileAction({
      token,
      action,
      payload: body.payload ?? {},
    });
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update profile.";
    const status =
      message.includes("not configured") ? 503 : message.includes("invalid") ? 404 : 400;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
