import { NextResponse } from "next/server";

import {
  getDoeDtcVaultTokenContext,
  upsertDoeDtcVaultItem,
} from "@/lib/doedtc/doedtc-browser-db";
import { attemptDoeDtcVaultLogin } from "@/lib/doedtc/doedtc-browser";

export const dynamic = "force-dynamic";

type VaultPayload = {
  token?: string;
  host?: string;
  username?: string;
  password?: string;
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as VaultPayload;
    const token = payload.token?.trim() ?? "";
    const context = token ? await getDoeDtcVaultTokenContext(token) : null;
    if (!context) {
      return NextResponse.json({ error: "Sign-in link is invalid or expired." }, { status: 400 });
    }

    const host = (payload.host ?? context.host).trim().toLowerCase();
    const username = payload.username?.trim() ?? "";
    const password = payload.password ?? "";
    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required." }, { status: 400 });
    }

    await upsertDoeDtcVaultItem({
      userId: context.userId,
      host,
      username,
      password,
    });

    const login = await attemptDoeDtcVaultLogin({
      userId: context.userId,
      jobId: context.jobId,
      host,
    });

    if (!login.ok) {
      return NextResponse.json({ error: "Sign-in failed. Check your credentials and try Live View." }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Vault request failed." },
      { status: 500 },
    );
  }
}
