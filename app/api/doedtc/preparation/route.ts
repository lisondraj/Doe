import { NextResponse } from "next/server";

import {
  getDoeDtcPreparationByCode,
  getDoeDtcPreparationById,
  getDoeDtcUserByCareToken,
} from "@/lib/doedtc/doedtc-db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code")?.trim() ?? "";
    const token = url.searchParams.get("t")?.trim() ?? "";
    const preparationId = url.searchParams.get("p")?.trim() ?? "";

    if (code) {
      const preparation = await getDoeDtcPreparationByCode(code);
      if (!preparation) {
        return NextResponse.json({ ok: false, error: "Code not found or expired." }, { status: 404 });
      }
      return NextResponse.json(
        { ok: true, preparation },
        { headers: { "Cache-Control": "no-store, max-age=0" } },
      );
    }

    if (token && preparationId) {
      const user = await getDoeDtcUserByCareToken(token);
      if (!user) {
        return NextResponse.json({ ok: false, error: "Invalid link." }, { status: 404 });
      }
      const preparation = await getDoeDtcPreparationById({
        userId: user.id,
        preparationId,
      });
      if (!preparation) {
        return NextResponse.json({ ok: false, error: "Preparation not found or expired." }, { status: 404 });
      }
      return NextResponse.json(
        { ok: true, preparation },
        { headers: { "Cache-Control": "no-store, max-age=0" } },
      );
    }

    return NextResponse.json({ ok: false, error: "Missing code or token." }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load preparation.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
