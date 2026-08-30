import { createSupabaseAdmin } from "@/lib/supabase/admin";
import {
  computeAccountabilityStreak,
  computeNextCheckInAt,
  defaultMessagePack,
  normalizeAccountabilityMechanics,
  parseCheckInOutcome,
  pickCheckInMessage,
  shouldPromptMiss,
} from "@/lib/doedtc/doedtc-accountability";
import { generateAccountabilityMessagePack } from "@/lib/doedtc/doedtc-accountability-messages";
import { normalizePhoneToE164 } from "@/lib/doedtc/doedtc-phone";
import { linqSendText } from "@/lib/doedtc/linq";
import type {
  DoeDtcAccountabilityCheckInOutcome,
  DoeDtcAccountabilityEventKind,
  DoeDtcAccountabilityEventRow,
  DoeDtcAccountabilityMechanics,
  DoeDtcAccountabilityMessagePack,
  DoeDtcAccountabilityPactRow,
  DoeDtcAccountabilityPactView,
  DoeDtcAccountabilityParticipantRow,
  DoeDtcUserRow,
} from "@/lib/doedtc/doedtc-types";

function rowToMechanics(raw: unknown): DoeDtcAccountabilityMechanics {
  return normalizeAccountabilityMechanics(
    raw && typeof raw === "object" ? (raw as Partial<DoeDtcAccountabilityMechanics>) : undefined,
  );
}

function rowToMessagePack(raw: unknown): DoeDtcAccountabilityMessagePack {
  if (!raw || typeof raw !== "object") {
    return defaultMessagePack({
      goal: "",
      ownerName: "",
      subjectName: "",
      privacy: "normal",
    });
  }
  const pack = raw as Partial<DoeDtcAccountabilityMessagePack>;
  const fallback = defaultMessagePack({
    goal: "",
    ownerName: "",
    subjectName: "",
    privacy: "normal",
  });
  return {
    partner_invite: pack.partner_invite?.trim() || fallback.partner_invite,
    check_in: pack.check_in?.trim() || fallback.check_in,
    check_in_variants: Array.isArray(pack.check_in_variants)
      ? pack.check_in_variants.filter((row): row is string => typeof row === "string" && row.trim().length > 0)
      : fallback.check_in_variants,
    miss: pack.miss?.trim() || fallback.miss,
    celebrate: pack.celebrate?.trim() || fallback.celebrate,
    withdraw: pack.withdraw?.trim() || fallback.withdraw,
  };
}

async function logAccountabilityOutbound(userId: string, body: string): Promise<void> {
  const supabase = createSupabaseAdmin();
  await supabase.from("doedtc_messages").insert({
    user_id: userId,
    direction: "outbound",
    body,
  });
}

function mapPactRow(row: Record<string, unknown>): DoeDtcAccountabilityPactRow {
  return {
    ...(row as DoeDtcAccountabilityPactRow),
    mechanics: rowToMechanics(row.mechanics),
    message_pack: rowToMessagePack(row.message_pack),
  };
}

async function loadPactBundle(pactId: string): Promise<{
  pact: DoeDtcAccountabilityPactRow;
  participants: DoeDtcAccountabilityParticipantRow[];
  events: DoeDtcAccountabilityEventRow[];
}> {
  const supabase = createSupabaseAdmin();
  const [pactResult, participantsResult, eventsResult] = await Promise.all([
    supabase.from("doedtc_accountability_pacts").select("*").eq("id", pactId).single(),
    supabase
      .from("doedtc_accountability_participants")
      .select("*")
      .eq("pact_id", pactId)
      .order("created_at"),
    supabase
      .from("doedtc_accountability_events")
      .select("*")
      .eq("pact_id", pactId)
      .order("occurred_at", { ascending: false })
      .limit(40),
  ]);
  if (pactResult.error) throw new Error(pactResult.error.message);
  if (participantsResult.error) throw new Error(participantsResult.error.message);
  if (eventsResult.error) throw new Error(eventsResult.error.message);
  return {
    pact: mapPactRow(pactResult.data as Record<string, unknown>),
    participants: (participantsResult.data as DoeDtcAccountabilityParticipantRow[]) ?? [],
    events: (eventsResult.data as DoeDtcAccountabilityEventRow[]) ?? [],
  };
}

function buildPactView(
  bundle: {
    pact: DoeDtcAccountabilityPactRow;
    participants: DoeDtcAccountabilityParticipantRow[];
    events: DoeDtcAccountabilityEventRow[];
  },
  viewerUserId: string,
): DoeDtcAccountabilityPactView {
  const subjectParticipant = bundle.participants.find((row) => row.role === "subject");
  const viewerParticipant = bundle.participants.find((row) => row.user_id === viewerUserId);
  return {
    pact: bundle.pact,
    participants: bundle.participants,
    events: bundle.events,
    streak: computeAccountabilityStreak(bundle.events),
    lastEvent: bundle.events[0] ?? null,
    subjectName: subjectParticipant?.full_name ?? null,
    viewerRole: viewerParticipant?.role ?? (bundle.pact.owner_user_id === viewerUserId ? "owner" : null),
    isOwner: bundle.pact.owner_user_id === viewerUserId,
  };
}

export async function listAccountabilityPactViewsForProfile(params: {
  profileUserId: string;
  viewerUserId: string;
  includeWithdrawn?: boolean;
}): Promise<DoeDtcAccountabilityPactView[]> {
  const supabase = createSupabaseAdmin();
  const participantResult = await supabase
    .from("doedtc_accountability_participants")
    .select("pact_id")
    .eq("user_id", params.viewerUserId);
  if (participantResult.error) throw new Error(participantResult.error.message);

  const ownerResult = await supabase
    .from("doedtc_accountability_pacts")
    .select("id")
    .or(`owner_user_id.eq.${params.viewerUserId},subject_user_id.eq.${params.viewerUserId}`);
  if (ownerResult.error) throw new Error(ownerResult.error.message);

  const pactIds = new Set<string>();
  for (const row of participantResult.data ?? []) {
    if (row.pact_id) pactIds.add(row.pact_id);
  }
  for (const row of ownerResult.data ?? []) {
    if (row.id) pactIds.add(row.id);
  }
  if (pactIds.size === 0) return [];

  let pactQuery = supabase
    .from("doedtc_accountability_pacts")
    .select("*")
    .in("id", Array.from(pactIds))
    .order("created_at", { ascending: false });
  if (!params.includeWithdrawn) {
    pactQuery = pactQuery.neq("status", "withdrawn");
  }
  const { data: pactRows, error } = await pactQuery;
  if (error) throw new Error(error.message);

  const relevant = (pactRows ?? []).filter((row) => {
    const pact = row as DoeDtcAccountabilityPactRow;
    if (params.profileUserId === params.viewerUserId) return true;
    return (
      pact.subject_user_id === params.profileUserId ||
      pact.owner_user_id === params.profileUserId
    );
  });

  const views = await Promise.all(
    relevant.map(async (row) => {
      const bundle = await loadPactBundle(row.id);
      return buildPactView(bundle, params.viewerUserId);
    }),
  );
  return views;
}

export async function getAccountabilityPactView(params: {
  pactId: string;
  viewerUserId: string;
}): Promise<DoeDtcAccountabilityPactView | null> {
  const bundle = await loadPactBundle(params.pactId);
  const allowed = bundle.participants.some((row) => row.user_id === params.viewerUserId);
  if (!allowed && bundle.pact.owner_user_id !== params.viewerUserId && bundle.pact.subject_user_id !== params.viewerUserId) {
    return null;
  }
  return buildPactView(bundle, params.viewerUserId);
}

export async function findAccountabilityPactForUser(params: {
  userId: string;
  pactId?: string;
  goalHint?: string;
}): Promise<DoeDtcAccountabilityPactRow | null> {
  const views = await listAccountabilityPactViewsForProfile({
    profileUserId: params.userId,
    viewerUserId: params.userId,
    includeWithdrawn: false,
  });
  if (params.pactId) {
    return views.find((view) => view.pact.id === params.pactId)?.pact ?? null;
  }
  const hint = params.goalHint?.trim().toLowerCase();
  if (!hint) return views[0]?.pact ?? null;
  const match = views.find(
    (view) =>
      view.pact.title.toLowerCase().includes(hint) || view.pact.goal.toLowerCase().includes(hint),
  );
  return match?.pact ?? null;
}

export async function createAccountabilityEvent(params: {
  pactId: string;
  actorUserId?: string | null;
  kind: DoeDtcAccountabilityEventKind;
  outcome?: DoeDtcAccountabilityCheckInOutcome | null;
  body?: string | null;
  occurredAt?: string;
}): Promise<DoeDtcAccountabilityEventRow> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_accountability_events")
    .insert({
      pact_id: params.pactId,
      actor_user_id: params.actorUserId ?? null,
      kind: params.kind,
      outcome: params.outcome ?? null,
      body: params.body ?? null,
      occurred_at: params.occurredAt ?? new Date().toISOString(),
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as DoeDtcAccountabilityEventRow;
}

export async function startAccountabilityPact(params: {
  owner: DoeDtcUserRow;
  title: string;
  goal: string;
  mechanics: Partial<DoeDtcAccountabilityMechanics>;
  subjectUserId?: string | null;
  subjectMemberId?: string | null;
  subjectName: string;
  partnerName?: string | null;
  partnerPhone?: string | null;
  involvePartner?: boolean;
}): Promise<DoeDtcAccountabilityPactView> {
  const mechanics = normalizeAccountabilityMechanics(params.mechanics);
  const subjectUserId = params.subjectUserId ?? params.owner.id;
  const messagePack = await generateAccountabilityMessagePack({
    goal: params.goal,
    ownerName: params.owner.full_name ?? "Someone",
    subjectName: params.subjectName,
    partnerName: params.partnerName ?? undefined,
    privacy: mechanics.privacy,
  });
  const nextCheckInAt = computeNextCheckInAt(mechanics);
  const hasPartner = Boolean(params.involvePartner && params.partnerPhone?.trim());
  const status = hasPartner ? "pending_partner" : "active";

  const supabase = createSupabaseAdmin();
  const { data: pactRow, error } = await supabase
    .from("doedtc_accountability_pacts")
    .insert({
      owner_user_id: params.owner.id,
      subject_user_id: subjectUserId,
      subject_member_id: params.subjectMemberId ?? null,
      title: params.title.trim(),
      goal: params.goal.trim(),
      status,
      mechanics,
      message_pack: messagePack,
      next_check_in_at: nextCheckInAt?.toISOString() ?? null,
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  const pact = mapPactRow(pactRow as Record<string, unknown>);

  let subjectPhone: string | null =
    subjectUserId === params.owner.id ? params.owner.phone : null;
  if (!subjectPhone && subjectUserId) {
    const subjectUserResult = await supabase
      .from("doedtc_users")
      .select("phone")
      .eq("id", subjectUserId)
      .maybeSingle();
    subjectPhone = (subjectUserResult.data as { phone?: string } | null)?.phone ?? null;
  }

  const participantRows: Array<Record<string, unknown>> = [
    {
      pact_id: pact.id,
      user_id: params.owner.id,
      phone: params.owner.phone,
      full_name: params.owner.full_name?.trim() || "Owner",
      role: "owner",
      status: "active",
    },
    {
      pact_id: pact.id,
      user_id: subjectUserId,
      household_member_id: params.subjectMemberId ?? null,
      phone: subjectPhone,
      full_name: params.subjectName.trim(),
      role: "subject",
      status: "active",
    },
  ];

  if (hasPartner) {
    participantRows.push({
      pact_id: pact.id,
      phone: normalizePhoneToE164(params.partnerPhone!.trim()) ?? params.partnerPhone!.trim(),
      full_name: params.partnerName?.trim() || "Partner",
      role: "partner",
      status: "pending",
    });
  }

  const { error: participantError } = await supabase
    .from("doedtc_accountability_participants")
    .insert(participantRows);
  if (participantError) throw new Error(participantError.message);

  await createAccountabilityEvent({
    pactId: pact.id,
    actorUserId: params.owner.id,
    kind: "note",
    body: "Accountability pact started.",
  });

  const view = buildPactView(await loadPactBundle(pact.id), params.owner.id);
  if (hasPartner) {
    await inviteAccountabilityPartner({
      owner: params.owner,
      pactId: pact.id,
      partnerName: params.partnerName ?? undefined,
      partnerPhone: params.partnerPhone!,
    });
  }
  return view;
}

export async function inviteAccountabilityPartner(params: {
  owner: DoeDtcUserRow;
  pactId: string;
  partnerName?: string;
  partnerPhone: string;
}): Promise<void> {
  const bundle = await loadPactBundle(params.pactId);
  if (bundle.pact.owner_user_id !== params.owner.id) {
    throw new Error("Only the pact owner can invite a partner.");
  }
  const phone = normalizePhoneToE164(params.partnerPhone.trim()) ?? params.partnerPhone.trim();
  let partner = bundle.participants.find((row) => row.role === "partner");
  if (!partner) {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
      .from("doedtc_accountability_participants")
      .insert({
        pact_id: params.pactId,
        phone,
        full_name: params.partnerName?.trim() || "Partner",
        role: "partner",
        status: "pending",
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    partner = data as DoeDtcAccountabilityParticipantRow;
  }

  const text = bundle.pact.message_pack.partner_invite;
  await linqSendText({
    to: phone,
    text,
    idempotencyKey: `doedtc-accountability-invite-${params.pactId}-${phone}`,
  });
  await logAccountabilityOutbound(params.owner.id, text);
  await createAccountabilityEvent({
    pactId: params.pactId,
    actorUserId: params.owner.id,
    kind: "invite_sent",
    body: `Invite sent to ${partner.full_name}.`,
  });

  const supabase = createSupabaseAdmin();
  await supabase
    .from("doedtc_accountability_pacts")
    .update({ status: "pending_partner", updated_at: new Date().toISOString() })
    .eq("id", params.pactId)
    .neq("status", "withdrawn");
}

export async function logAccountabilityCheckIn(params: {
  pactId: string;
  actorUserId: string;
  outcome: DoeDtcAccountabilityCheckInOutcome;
  note?: string | null;
}): Promise<DoeDtcAccountabilityEventRow> {
  const event = await createAccountabilityEvent({
    pactId: params.pactId,
    actorUserId: params.actorUserId,
    kind: "check_in",
    outcome: params.outcome,
    body: params.note ?? null,
  });

  const bundle = await loadPactBundle(params.pactId);
  const supabase = createSupabaseAdmin();
  if (bundle.pact.status === "pending_partner") {
    await supabase
      .from("doedtc_accountability_pacts")
      .update({ status: "active", updated_at: new Date().toISOString() })
      .eq("id", params.pactId);
  }
  return event;
}

export async function withdrawAccountabilityPact(params: {
  ownerUserId: string;
  pactId: string;
  reason?: string | null;
  notify?: boolean;
}): Promise<DoeDtcAccountabilityPactView> {
  const bundle = await loadPactBundle(params.pactId);
  if (bundle.pact.owner_user_id !== params.ownerUserId) {
    throw new Error("Only the pact owner can withdraw.");
  }
  if (bundle.pact.status === "withdrawn") {
    return buildPactView(bundle, params.ownerUserId);
  }

  const supabase = createSupabaseAdmin();
  const now = new Date().toISOString();
  const { error } = await supabase
    .from("doedtc_accountability_pacts")
    .update({
      status: "withdrawn",
      next_check_in_at: null,
      withdrawn_at: now,
      withdrawn_reason: params.reason?.trim() || null,
      updated_at: now,
    })
    .eq("id", params.pactId);
  if (error) throw new Error(error.message);

  await createAccountabilityEvent({
    pactId: params.pactId,
    actorUserId: params.ownerUserId,
    kind: "withdrawn",
    body: params.reason?.trim() || "Pact withdrawn.",
  });

  if (params.notify !== false) {
    const text = bundle.pact.message_pack.withdraw;
    for (const participant of bundle.participants) {
      if (participant.role === "owner") continue;
      if (participant.status === "removed" || participant.status === "declined") continue;
      const phone = participant.phone;
      if (!phone) continue;
      await linqSendText({
        to: phone,
        text,
        idempotencyKey: `doedtc-accountability-withdraw-${params.pactId}-${phone}`,
      });
    }
  }

  return buildPactView(await loadPactBundle(params.pactId), params.ownerUserId);
}

export async function pauseAccountabilityPact(params: {
  ownerUserId: string;
  pactId: string;
}): Promise<DoeDtcAccountabilityPactView> {
  const bundle = await loadPactBundle(params.pactId);
  if (bundle.pact.owner_user_id !== params.ownerUserId) {
    throw new Error("Only the pact owner can pause.");
  }
  const supabase = createSupabaseAdmin();
  const { error } = await supabase
    .from("doedtc_accountability_pacts")
    .update({
      status: "paused",
      next_check_in_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.pactId);
  if (error) throw new Error(error.message);
  await createAccountabilityEvent({
    pactId: params.pactId,
    actorUserId: params.ownerUserId,
    kind: "paused",
  });
  return buildPactView(await loadPactBundle(params.pactId), params.ownerUserId);
}

export async function resumeAccountabilityPact(params: {
  ownerUserId: string;
  pactId: string;
}): Promise<DoeDtcAccountabilityPactView> {
  const bundle = await loadPactBundle(params.pactId);
  if (bundle.pact.owner_user_id !== params.ownerUserId) {
    throw new Error("Only the pact owner can resume.");
  }
  const nextCheckInAt = computeNextCheckInAt(bundle.pact.mechanics);
  const supabase = createSupabaseAdmin();
  const { error } = await supabase
    .from("doedtc_accountability_pacts")
    .update({
      status: "active",
      next_check_in_at: nextCheckInAt?.toISOString() ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.pactId);
  if (error) throw new Error(error.message);
  await createAccountabilityEvent({
    pactId: params.pactId,
    actorUserId: params.ownerUserId,
    kind: "resumed",
  });
  return buildPactView(await loadPactBundle(params.pactId), params.ownerUserId);
}

export async function removeAccountabilityPartner(params: {
  pactId: string;
  actorUserId: string;
}): Promise<void> {
  const bundle = await loadPactBundle(params.pactId);
  const partner = bundle.participants.find(
    (row) => row.role === "partner" && row.user_id === params.actorUserId,
  );
  if (!partner) throw new Error("Partner participant not found.");
  const supabase = createSupabaseAdmin();
  const { error } = await supabase
    .from("doedtc_accountability_participants")
    .update({ status: "removed", updated_at: new Date().toISOString() })
    .eq("id", partner.id);
  if (error) throw new Error(error.message);
}

export async function listDueAccountabilityPacts(now = new Date()): Promise<DoeDtcAccountabilityPactRow[]> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("doedtc_accountability_pacts")
    .select("*")
    .eq("status", "active")
    .not("next_check_in_at", "is", null)
    .lte("next_check_in_at", now.toISOString())
    .order("next_check_in_at");
  if (error) throw new Error(error.message);
  return ((data ?? []) as Record<string, unknown>[]).map(mapPactRow);
}

function resolveCheckInRecipients(
  pact: DoeDtcAccountabilityPactRow,
  participants: DoeDtcAccountabilityParticipantRow[],
): Array<{ phone: string; userId: string | null; name: string }> {
  const byRole = (role: DoeDtcAccountabilityParticipantRow["role"]) =>
    participants.filter((row) => row.role === role && row.status !== "removed" && row.status !== "declined");

  const targets: DoeDtcAccountabilityParticipantRow[] = [];
  const who = pact.mechanics.who_gets_check_in;
  if (who === "subject") targets.push(...byRole("subject"));
  else if (who === "partner") targets.push(...byRole("partner"));
  else if (who === "owner") targets.push(...byRole("owner"));
  else targets.push(...byRole("subject"), ...byRole("partner"), ...byRole("owner"));

  const seen = new Set<string>();
  const recipients: Array<{ phone: string; userId: string | null; name: string }> = [];
  for (const row of targets) {
    if (!row.phone || seen.has(row.phone)) continue;
    seen.add(row.phone);
    recipients.push({ phone: row.phone, userId: row.user_id, name: row.full_name });
  }
  return recipients;
}

async function enrichParticipantsWithPhones(
  participants: DoeDtcAccountabilityParticipantRow[],
): Promise<DoeDtcAccountabilityParticipantRow[]> {
  const missing = participants.filter((row) => !row.phone && row.user_id);
  if (missing.length === 0) return participants;
  const supabase = createSupabaseAdmin();
  const { data } = await supabase
    .from("doedtc_users")
    .select("id, phone")
    .in(
      "id",
      missing.map((row) => row.user_id!),
    );
  const phoneByUser = new Map((data ?? []).map((row) => [row.id as string, row.phone as string]));
  return participants.map((row) =>
    row.phone ? row : { ...row, phone: row.user_id ? phoneByUser.get(row.user_id) ?? null : null },
  );
}

export async function processAccountabilityPactTick(pactId: string): Promise<void> {
  const bundle = await loadPactBundle(pactId);
  const { pact, events } = bundle;
  let { participants } = bundle;
  if (pact.status !== "active") return;

  participants = await enrichParticipantsWithPhones(participants);

  const now = new Date();
  if (shouldPromptMiss(events, pact.last_check_in_prompt_at, now)) {
    await createAccountabilityEvent({
      pactId: pact.id,
      kind: "miss",
      body: "No check-in response before the next window.",
    });
    if (pact.mechanics.miss_notify_partner) {
      const partners = participants.filter((row) => row.role === "partner" && row.phone);
      for (const partner of partners) {
        await linqSendText({
          to: partner.phone!,
          text: pact.message_pack.miss,
          idempotencyKey: `doedtc-accountability-miss-${pact.id}-${partner.phone}-${now.toISOString().slice(0, 10)}`,
        });
      }
    }
  }

  const variantIndex = events.filter((row) => row.kind === "check_in_prompt").length;
  const message = pickCheckInMessage(pact.message_pack, variantIndex);
  const recipients = resolveCheckInRecipients(pact, participants);
  for (const recipient of recipients) {
    await linqSendText({
      to: recipient.phone,
      text: message,
      idempotencyKey: `doedtc-accountability-checkin-${pact.id}-${recipient.phone}-${now.toISOString().slice(0, 13)}`,
    });
    if (recipient.userId) {
      await logAccountabilityOutbound(recipient.userId, message);
    }
  }

  const promptAt = now.toISOString();
  await createAccountabilityEvent({
    pactId: pact.id,
    kind: "check_in_prompt",
    body: message,
    occurredAt: promptAt,
  });

  const nextCheckInAt = computeNextCheckInAt(pact.mechanics, now);
  const supabase = createSupabaseAdmin();
  await supabase
    .from("doedtc_accountability_pacts")
    .update({
      last_check_in_prompt_at: promptAt,
      next_check_in_at: nextCheckInAt?.toISOString() ?? null,
      updated_at: now.toISOString(),
    })
    .eq("id", pact.id);
}

export async function tryHandleAccountabilityInbound(params: {
  phone: string;
  text: string;
  user: DoeDtcUserRow | null;
}): Promise<boolean> {
  const phone = normalizePhoneToE164(params.phone) ?? params.phone.trim();
  const outcome = parseCheckInOutcome(params.text);
  if (!outcome) return false;

  const supabase = createSupabaseAdmin();
  const participantResult = await supabase
    .from("doedtc_accountability_participants")
    .select("*, doedtc_accountability_pacts(*)")
    .eq("phone", phone)
    .in("status", ["pending", "active"]);
  if (participantResult.error) throw new Error(participantResult.error.message);
  const rows = participantResult.data ?? [];
  if (rows.length === 0) return false;

  for (const row of rows) {
    const pactRaw = (row as { doedtc_accountability_pacts?: Record<string, unknown> }).doedtc_accountability_pacts;
    if (!pactRaw) continue;
    const pact = mapPactRow(pactRaw);
    if (pact.status === "withdrawn" || pact.status === "paused") continue;

    const bundle = await loadPactBundle(pact.id);
    const recentPrompt = bundle.events.find((event) => event.kind === "check_in_prompt");
    if (!recentPrompt) continue;
    const alreadyLogged = bundle.events.some(
      (event) =>
        event.kind === "check_in" &&
        new Date(event.occurred_at).getTime() >= new Date(recentPrompt.occurred_at).getTime(),
    );
    if (alreadyLogged) continue;

    const participant = row as DoeDtcAccountabilityParticipantRow;
    if (participant.status === "pending" && participant.role === "partner") {
      await supabase
        .from("doedtc_accountability_participants")
        .update({
          status: "active",
          user_id: params.user?.id ?? participant.user_id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", participant.id);
      await createAccountabilityEvent({
        pactId: pact.id,
        actorUserId: params.user?.id ?? null,
        kind: "partner_joined",
        body: `${participant.full_name} joined as partner.`,
      });
      if (pact.status === "pending_partner") {
        await supabase
          .from("doedtc_accountability_pacts")
          .update({ status: "active", updated_at: new Date().toISOString() })
          .eq("id", pact.id);
      }
    }

    await logAccountabilityCheckIn({
      pactId: pact.id,
      actorUserId: params.user?.id ?? pact.owner_user_id,
      outcome,
    });
    return true;
  }

  return false;
}
