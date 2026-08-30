import type {
  DoeDtcAccountabilityCheckInOutcome,
  DoeDtcAccountabilityEventRow,
  DoeDtcAccountabilityMechanics,
  DoeDtcAccountabilityMessagePack,
  DoeDtcAccountabilityPactRow,
  DoeDtcAccountabilityParticipantRow,
  DoeDtcAccountabilityPactView,
} from "@/lib/doedtc/doedtc-types";

const DEFAULT_TIMEZONE = "America/New_York";

export function normalizeAccountabilityMechanics(
  raw: Partial<DoeDtcAccountabilityMechanics> | null | undefined,
): DoeDtcAccountabilityMechanics {
  const cadence = raw?.cadence;
  const who = raw?.who_gets_check_in;
  const confirmation = raw?.confirmation;
  const privacy = raw?.privacy;
  return {
    cadence:
      cadence === "daily" ||
      cadence === "weekdays" ||
      cadence === "weekly" ||
      cadence === "on_demand"
        ? cadence
        : "daily",
    timezone: typeof raw?.timezone === "string" && raw.timezone.trim() ? raw.timezone.trim() : DEFAULT_TIMEZONE,
    check_in_hour:
      typeof raw?.check_in_hour === "number" && raw.check_in_hour >= 0 && raw.check_in_hour <= 23
        ? raw.check_in_hour
        : 20,
    quiet_hours:
      raw?.quiet_hours &&
      typeof raw.quiet_hours.start === "number" &&
      typeof raw.quiet_hours.end === "number"
        ? { start: raw.quiet_hours.start, end: raw.quiet_hours.end }
        : undefined,
    who_gets_check_in:
      who === "subject" || who === "partner" || who === "both" || who === "owner" ? who : "subject",
    confirmation:
      confirmation === "self" || confirmation === "partner" || confirmation === "either"
        ? confirmation
        : "self",
    miss_notify_partner: Boolean(raw?.miss_notify_partner),
    privacy: privacy === "high" ? "high" : "normal",
  };
}

export function defaultMessagePack(params: {
  goal: string;
  ownerName: string;
  subjectName: string;
  partnerName?: string;
  privacy: "high" | "normal";
}): DoeDtcAccountabilityMessagePack {
  const subject = params.subjectName.trim() || "them";
  const owner = params.ownerName.trim() || "Someone";
  const goalSnippet =
    params.privacy === "high"
      ? "a personal goal on Doe"
      : params.goal.trim().slice(0, 120) || "a health habit";
  const partner = params.partnerName?.trim() || "there";
  return {
    partner_invite: `${owner} asked you to help with ${goalSnippet} on Doe. Reply here if you're in — they'll get check-ins and you may get occasional updates.`,
    check_in: `Quick check-in: how did it go with ${goalSnippet} today? Reply yes or no.`,
    check_in_variants: [
      `Checking in on ${goalSnippet}. All good today? Reply yes or no.`,
      `How did ${subject} do today? Reply yes or no.`,
    ],
    miss: `${subject} missed a check-in. A gentle nudge from you might help.`,
    celebrate: `Nice streak on ${goalSnippet}. Keep it up.`,
    withdraw: `${owner} ended the accountability setup for ${goalSnippet}. Thanks for helping.`,
  };
}

export function pickCheckInMessage(
  pack: DoeDtcAccountabilityMessagePack,
  variantIndex = 0,
): string {
  const variants = pack.check_in_variants?.filter(Boolean) ?? [];
  if (variants.length > 0) {
    return variants[variantIndex % variants.length] ?? pack.check_in;
  }
  return pack.check_in;
}

export function canWithdrawAccountabilityPact(
  pact: Pick<DoeDtcAccountabilityPactRow, "owner_user_id" | "status">,
  viewerUserId: string,
): boolean {
  return pact.owner_user_id === viewerUserId && pact.status !== "withdrawn";
}

export function canPauseAccountabilityPact(
  pact: Pick<DoeDtcAccountabilityPactRow, "owner_user_id" | "status">,
  viewerUserId: string,
): boolean {
  return (
    pact.owner_user_id === viewerUserId &&
    (pact.status === "active" || pact.status === "pending_partner")
  );
}

export function computeAccountabilityStreak(
  events: Pick<DoeDtcAccountabilityEventRow, "kind" | "outcome" | "occurred_at">[],
): number {
  const checkIns = events.filter((row) => row.kind === "check_in" && row.outcome === "yes");
  if (checkIns.length === 0) return 0;

  const dayKey = (iso: string) => iso.slice(0, 10);
  const yesDays = new Set(checkIns.map((row) => dayKey(row.occurred_at)));

  let streak = 0;
  const cursor = new Date();
  for (let day = 0; day < 365; day += 1) {
    const d = new Date(cursor);
    d.setDate(d.getDate() - day);
    const key = d.toISOString().slice(0, 10);
    if (!yesDays.has(key)) break;
    streak += 1;
  }
  return streak;
}

export function computeNextCheckInAt(
  mechanics: DoeDtcAccountabilityMechanics,
  from = new Date(),
): Date | null {
  if (mechanics.cadence === "on_demand") return null;

  const hour = mechanics.check_in_hour;
  let candidate = new Date(from);
  candidate.setSeconds(0, 0);
  candidate.setMinutes(0);
  candidate.setHours(hour);
  if (candidate <= from) {
    candidate = new Date(candidate.getTime() + 24 * 60 * 60 * 1000);
  }

  for (let day = 0; day < 14; day += 1) {
    const weekday = candidate.getDay();
    if (mechanics.cadence === "weekdays" && (weekday === 0 || weekday === 6)) {
      candidate = new Date(candidate.getTime() + 24 * 60 * 60 * 1000);
      continue;
    }
    if (mechanics.cadence === "weekly" && day > 0) {
      candidate = new Date(candidate.getTime() + 7 * 24 * 60 * 60 * 1000);
    }
    if (candidate > from) return candidate;
    candidate = new Date(candidate.getTime() + 24 * 60 * 60 * 1000);
  }

  return new Date(from.getTime() + 24 * 60 * 60 * 1000);
}

export function formatAccountabilityForAgent(views: DoeDtcAccountabilityPactView[]): string {
  if (views.length === 0) return "No accountability pacts.";
  return views
    .map((view) => {
      const parts = [
        `${view.pact.title} | goal: ${view.pact.goal}`,
        `pact_id: ${view.pact.id}`,
        `status: ${view.pact.status}`,
        `owner_user_id: ${view.pact.owner_user_id}`,
        `subject: ${view.subjectName ?? "self"}`,
        `cadence: ${view.pact.mechanics.cadence}`,
        `streak: ${view.streak}`,
      ];
      const partners = view.participants.filter((p) => p.role === "partner");
      if (partners.length > 0) {
        parts.push(
          `partners: ${partners.map((p) => `${p.full_name} (${p.status}${p.phone ? `, ${p.phone}` : ""})`).join("; ")}`,
        );
      }
      if (view.lastEvent) {
        parts.push(`last: ${view.lastEvent.kind}${view.lastEvent.outcome ? ` (${view.lastEvent.outcome})` : ""}`);
      }
      return `- ${parts.join(" | ")}`;
    })
    .join("\n");
}

export function parseCheckInOutcome(text: string): DoeDtcAccountabilityCheckInOutcome | null {
  const trimmed = text.trim().toLowerCase();
  if (/^(yes|y|yep|yeah|done|did it|all good|✅)/.test(trimmed)) return "yes";
  if (/^(no|n|nope|missed|didn't|did not|slipped|❌)/.test(trimmed)) return "no";
  if (/^(skip|na|n\/a)/.test(trimmed)) return "skip";
  return null;
}

export function shouldPromptMiss(
  events: Pick<DoeDtcAccountabilityEventRow, "kind" | "occurred_at">[],
  promptAt: string | null,
  now = new Date(),
): boolean {
  if (!promptAt) return false;
  const promptTime = new Date(promptAt).getTime();
  if (Number.isNaN(promptTime) || promptTime > now.getTime()) return false;
  const responded = events.some(
    (row) =>
      row.kind === "check_in" &&
      new Date(row.occurred_at).getTime() >= promptTime,
  );
  if (responded) return false;
  const hoursSince = (now.getTime() - promptTime) / (60 * 60 * 1000);
  return hoursSince >= 12;
}
