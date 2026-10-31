/**
 * /demo's server operations, shared by the REST routes (/api/demo/v1/*), the MCP server (/api/demo/mcp) and the
 * clinic dashboard routes (/api/demo/clinic/*). Agents authenticate with the session token `connect` returns.
 */
import { ASSESSMENTS } from "@/lib/demo/demo-assessments";
import { BUNDLES, CLINIC, COMMS, INTAKE_FIELDS, OFFERS, PAYMENT_NOTES, PLAN_COVERAGE, PROVIDERS, PROVIDER_PROFILES, SERVICES } from "@/lib/demo/demo-clinic";
import {
  type AgentAction,
  type ClinicAction,
  type ConnectInput,
  DemoError,
  LIVE_MS,
  analytics,
  applyAgentAction,
  applyClinicAction,
  availability,
  createSession,
  nextSteps,
  normalize,
  pricing,
  scores,
  slotLabel,
  statusOf,
  viewOf,
} from "@/lib/demo/demo-engine";
import { CONNECT_PER_IP_HOUR, CONNECT_TOTAL_HOUR, hourBucket, ipKey } from "@/lib/demo/demo-guard";
import {
  listSessions,
  readConfig,
  readConnectCount,
  readSession,
  readSlots,
  withLock,
  writeConfig,
  writeConnectCount,
  writeSession,
  writeSlots,
} from "@/lib/demo/demo-store";
import type { DemoChannel, DemoConfig, DemoSession, DemoSessionView, DemoSlots, DemoUpload } from "@/lib/demo/demo-types";

/**
 * Uploads without their file bodies, so polling stays light. Written forms keep a preview; `keepText` keeps the full
 * text (the agent needs to read forms the clinic sends it).
 */
const lightUploads = (list: DemoUpload[] | undefined, keepText: (u: DemoUpload) => boolean) =>
  (list ?? []).map(({ dataUrl, text, ...u }) => ({ ...u, hasFile: Boolean(dataUrl), ...(text ? (keepText(u) ? { text } : { preview: text.slice(0, 280) }) : {}) }));

const lightView = (s: DemoSession, keepText: (u: DemoUpload) => boolean): DemoSessionView => {
  const v = viewOf(s);
  return { ...v, forms: { ...v.forms, uploads: lightUploads(v.forms.uploads, keepText) as DemoUpload[] } };
};

export { DemoError };

/** Every write goes through one lock per instance, so a session and the slot index change together. */
const LOCK = "demo";
const SEEN_WRITE_MS = 30_000;

export const tokenOf = (s: DemoSession) => `${s.id}.${s.secret}`;

async function authenticate(token: unknown): Promise<DemoSession> {
  if (typeof token !== "string" || !token.includes(".")) throw new DemoError(401, "Missing session token. Send Authorization: Bearer <token> from connect.");
  const [id, secret] = token.split(".");
  const s = await readSession(id ?? "");
  if (!s || s.secret !== secret) throw new DemoError(401, "Unknown or expired session token. Connect again.");
  return s;
}

function agentPayload(s: DemoSession, config: DemoConfig, slots: DemoSlots, now: number) {
  const n = normalize(s, now);
  return {
    session: lightView(n, (u) => u.by === "clinic"),
    status: statusOf(n, now),
    pricing: pricing(n),
    bookable: config.bookable[n.plan.id] !== false,
    hold: n.hold ? { ...n.hold, slot: slotLabel(n.hold.slotId), secondsLeft: Math.max(0, Math.round((Date.parse(n.hold.expiresAt) - now) / 1000)) } : null,
    booking: { ...n.booking, slot: n.booking.slotId ? slotLabel(n.booking.slotId) : null },
    scores: scores(n),
    availability: availability(slots, now, n.id),
    nextSteps: nextSteps(n, config, now),
  };
}

export type AgentPayload = ReturnType<typeof agentPayload>;

export async function connect(input: ConnectInput, ip: string) {
  const now = new Date();
  const s = createSession(input, now);
  await withLock(LOCK, async () => {
    const hour = hourBucket(now);
    const key = ipKey(ip);
    const count = await readConnectCount(hour);
    if ((count.ips[key] ?? 0) >= CONNECT_PER_IP_HOUR) throw new DemoError(429, "Too many new sessions from this network this hour. Reuse your session token.");
    if (count.total >= CONNECT_TOTAL_HOUR) throw new DemoError(429, "The clinic is taking too many new sessions right now. Try again later.");
    await writeConnectCount(hour, { total: count.total + 1, ips: { ...count.ips, [key]: (count.ips[key] ?? 0) + 1 } });
    await writeSession(s);
  });
  const [config, slots] = await Promise.all([readConfig(), readSlots()]);
  return { token: tokenOf(s), ...agentPayload(s, config, slots, now.getTime()) };
}

export async function agentState(token: unknown) {
  const s = await authenticate(token);
  const now = Date.now();
  if (now - Date.parse(s.lastSeenAt) > SEEN_WRITE_MS) {
    s.lastSeenAt = new Date(now).toISOString();
    await withLock(LOCK, () => writeSession(s));
  }
  const [config, slots] = await Promise.all([readConfig(), readSlots()]);
  return agentPayload(s, config, slots, now);
}

export async function agentAct(token: unknown, action: AgentAction, channel: DemoChannel) {
  const first = await authenticate(token);
  return withLock(LOCK, async () => {
    const [s, config, slots] = await Promise.all([readSession(first.id), readConfig(), readSlots()]);
    if (!s) throw new DemoError(401, "Session not found. Connect again.");
    const now = new Date();
    const r = applyAgentAction(s, action, { config, slots, now, channel });
    await Promise.all([writeSession(r.session), r.slotsChanged ? writeSlots(r.slots) : null]);
    return { result: r.result, ...agentPayload(r.session, config, r.slots, now.getTime()) };
  });
}

export async function clinicState() {
  const [sessions, config, slots] = await Promise.all([listSessions(), readConfig(), readSlots()]);
  const now = Date.now();
  return {
    config,
    analytics: analytics(sessions, now),
    availability: availability(slots, now),
    slots,
    sessions: sessions.map((raw) => {
      const s = normalize(raw, now);
      return {
        ...lightView(s, () => false),
        status: statusOf(s, now),
        live: now - Date.parse(s.lastSeenAt) < LIVE_MS,
        pricing: pricing(s),
        scores: scores(s),
        holdSlot: s.hold ? slotLabel(s.hold.slotId) : null,
        bookingSlot: s.booking.slotId ? slotLabel(s.booking.slotId) : null,
      };
    }),
  };
}

export type ClinicStatePayload = Awaited<ReturnType<typeof clinicState>>;

/** One upload in full, for the clinic to open or download. */
export async function clinicUpload(sessionId: unknown, uploadId: unknown) {
  if (typeof sessionId !== "string" || typeof uploadId !== "string") throw new DemoError(400, "session_id and upload_id are required.");
  const s = await readSession(sessionId);
  const up = s?.forms.uploads?.find((u) => u.id === uploadId);
  if (!up) throw new DemoError(404, "No such upload.");
  return up;
}

export async function clinicAct(sessionId: unknown, action: ClinicAction) {
  if (typeof sessionId !== "string") throw new DemoError(400, "session_id is required.");
  return withLock(LOCK, async () => {
    const [s, config, slots] = await Promise.all([readSession(sessionId), readConfig(), readSlots()]);
    if (!s) throw new DemoError(404, "No such session.");
    const r = applyClinicAction(s, action, { config, slots, now: new Date() });
    await Promise.all([writeSession(r.session), r.slotsChanged ? writeSlots(r.slots) : null]);
    return { ok: true };
  });
}

export async function setConfig(patch: Partial<DemoConfig>) {
  return withLock(LOCK, async () => {
    const c = await readConfig();
    const next: DemoConfig = { ...c };
    if (patch.bookable && typeof patch.bookable === "object") {
      next.bookable = { ...c.bookable };
      for (const [k, v] of Object.entries(patch.bookable)) if (k in c.bookable) next.bookable[k] = v === true;
    }
    if (patch.floorPct !== undefined) {
      const f = Number(patch.floorPct);
      if (!Number.isFinite(f) || f < 0.5 || f > 1) throw new DemoError(400, "floorPct must be between 0.5 and 1.");
      next.floorPct = Math.round(f * 100) / 100;
    }
    if (patch.autoConfirm !== undefined) next.autoConfirm = patch.autoConfirm === true;
    await writeConfig(next);
    return next;
  });
}

/** The clinic as an agent reads it: everything it needs to plan a booking, with no session required. */
export async function catalog() {
  const [config, slots] = await Promise.all([readConfig(), readSlots()]);
  return {
    availability: availability(slots, Date.now()),
    clinic: CLINIC,
    providers: PROVIDERS,
    provider_profiles: PROVIDER_PROFILES,
    insurance_plans: PLAN_COVERAGE,
    payment: "Private pay only, CAD. Agent bookings get 5% off unless a price was negotiated.",
    services: SERVICES.map((s) => ({ ...s, kind: "service", bookable: config.bookable[s.id] !== false })),
    bundles: BUNDLES.map((b) => ({ ...b, kind: "bundle", bookable: config.bookable[b.id] !== false })),
    offers: OFFERS,
    insurance: PAYMENT_NOTES,
    communication: COMMS.map(({ id, title }) => ({ id, title })),
    forms: {
      intake: INTAKE_FIELDS.filter((f) => f.id !== "consent").map(({ id, label, section }) => ({ id, label, section })),
      assessments: ASSESSMENTS.map((a) => ({
        id: a.id,
        name: a.full,
        window: a.window,
        questions: a.questions.map((q) => ({
          id: q.id,
          prompt: q.prompt,
          kind: q.kind,
          ...(q.kind === "choice" ? { options: q.options } : q.kind === "scale" ? { range: [0, 10] } : { range: [0, q.max] }),
        })),
      })),
      signature: "Consent to Botox treatment, signed by the user (record_signature).",
    },
  };
}
