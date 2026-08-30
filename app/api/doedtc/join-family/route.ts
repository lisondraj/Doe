import { NextResponse } from "next/server";

import { getDoeDtcHouseholdInviteByToken, loadDoeDtcHouseholdAccessContext } from "@/lib/doedtc/doedtc-db";
import { isHouseholdMemberAdult } from "@/lib/doedtc/doedtc-household";
import { submitDoeDtcJoinFamily } from "@/lib/doedtc/submit-doedtc-join-family";
import type { DoeDtcHouseholdConsentLevel } from "@/lib/doedtc/doedtc-types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get("i")?.trim() ?? "";
    if (!token) {
      return NextResponse.json({ ok: false, error: "Missing invite token." }, { status: 400 });
    }

    const context = await getDoeDtcHouseholdInviteByToken(token);
    if (!context) {
      return NextResponse.json({ ok: false, error: "Invite invalid or expired." }, { status: 404 });
    }

    const needsConsent =
      context.member.relationship === "child" &&
      isHouseholdMemberAdult(context.member.date_of_birth);

    const householdContext = await loadDoeDtcHouseholdAccessContext(context.household.admin_user_id);

    return NextResponse.json({
      ok: true,
      invite: {
        memberName: context.member.full_name,
        relationship: context.member.relationship,
        needsConsent,
        householdMembers: householdContext.members
          .filter((row) => row.id !== context.member.id && row.status === "active")
          .map((row) => ({ id: row.id, fullName: row.full_name })),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load invite.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const result = await submitDoeDtcJoinFamily({
      inviteToken: String(body.inviteToken ?? ""),
      fullName: String(body.fullName ?? ""),
      email: String(body.email ?? ""),
      medications: Array.isArray(body.medications) ? body.medications : [],
      conditions: Array.isArray(body.conditions) ? body.conditions : [],
      medicalDeferred: Boolean(body.medicalDeferred),
      shareHealth: body.shareHealth as DoeDtcHouseholdConsentLevel | undefined,
      allowEdits: body.allowEdits as DoeDtcHouseholdConsentLevel | undefined,
      shareMemberIds: Array.isArray(body.shareMemberIds) ? body.shareMemberIds : [],
      editMemberIds: Array.isArray(body.editMemberIds) ? body.editMemberIds : [],
    });
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to join family.";
    const status = message.includes("not configured") ? 503 : 400;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
