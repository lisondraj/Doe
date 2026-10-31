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
import { randomBytes } from "node:crypto";

import {
  readShare,
  resetDemoData,
  writeShare,
  readVerify,
  writeVerify,
  readIdFile,
  writeIdFile,
  listVisits,
  readIpVisit,
  readVisit,
  writeIpVisit,
  writeVisit,
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
import type { DemoChannel, DemoConfig, DemoEvent, DemoSession, DemoSessionView, DemoSlots, DemoUpload, DemoVisit } from "@/lib/demo/demo-types";

/**
 * Uploads without their file bodies, so polling stays light. Written forms keep a preview; `keepText` keeps the full
 * text (the agent needs to read forms the clinic sends it).
 */
const lightUploads = (list: DemoUpload[] | undefined, keepText: (u: DemoUpload) => boolean) =>
  (list ?? []).map(({ dataUrl, text, ...u }) => ({ ...u, hasFile: Boolean(dataUrl), ...(text ? (keepText(u) ? { text } : { preview: text.slice(0, 280) }) : {}) }));

const lightView = (s: DemoSession, keepText: (u: DemoUpload) => boolean, keepUrl = false): DemoSessionView => {
  const v = viewOf(s);
  return {
    ...v,
    forms: { ...v.forms, uploads: lightUploads(v.forms.uploads, keepText) as DemoUpload[] },
    ...(v.identity ? { identity: { ...v.identity, url: keepUrl ? v.identity.url : "" } } : {}),
  };
};

const VERIFY_HOURS = 24;

/** The identity-check link and the message the agent sends with it. */
function verifyOf(s: DemoSession) {
  if (!s.identity) return null;
  if (s.identity.status === "verified") return { status: "verified" as const, verified_at: s.identity.verifiedAt, method: s.identity.method };
  return {
    status: "pending" as const,
    /** When the user last opened the link; null if they haven't yet. */
    opened_at: s.identity.openedAt ?? null,
    url: s.identity.url,
    message_for_user: `Before I book, please confirm it's you: ${s.identity.url}\nIt takes a few seconds: check your date of birth, add a photo of your driver's licence, and confirm with Face ID. Then come back here.`,
  };
}

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
    session: lightView(n, (u) => u.by === "clinic", true),
    /** Send url to the user right after connecting; booking waits for status "verified". */
    verify: verifyOf(n),
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

export async function connect(input: ConnectInput, ip: string, visitId?: string | null, origin?: string | null) {
  const now = new Date();
  const visit = visitId ? await readVisit(visitId) : null;
  const named = typeof input.agentName === "string" && input.agentName.trim();
  const s = createSession({ ...input, agentName: named ? input.agentName : (visit?.agentName ?? input.agentName) }, now);
  /** Agents connecting over MCP or the API get an identity-check link to send their user; /demo's own page doesn't. */
  if (origin && input.channel !== "browser") {
    const token = randomBytes(32).toString("base64url");
    await writeVerify(token, { sessionId: s.id, challenge: randomBytes(32).toString("base64url"), expiresAt: new Date(now.getTime() + VERIFY_HOURS * 3_600_000).toISOString(), usedAt: null });
    const at = now.toISOString();
    s.identity = { status: "pending", url: `${origin}/demo/verify/${token}`, requestedAt: at, verifiedAt: null, dob: null, method: null, license: null };
    s.events = [...s.events, { id: `e_idr${now.getTime().toString(36)}`, at, actor: "agent", channel: input.channel, type: "identity_requested", summary: `Sent ${s.userName} a link to confirm it's them (Face ID, date of birth, driver's licence)` }];
  }
  if (visit) {
    /** What the agent did over MCP before it connected (the handshake, reading the clinic) leads the session's log. */
    const before: DemoEvent[] = visit.calls
      .filter((c) => c.tool !== "doe_connect")
      .map((c, i) => ({ id: `e_mcp${i}_${visit.id.slice(-6)}`, at: c.at, actor: "agent", channel: "mcp", type: "mcp_call", summary: c.summary }));
    s.events = [...before, ...s.events];
    await withLock(`visit:${visit.id}`, async () => {
      const v = (await readVisit(visit.id)) ?? visit;
      await writeVisit({ ...v, sessionId: s.id, agentName: s.agentName });
    });
  }
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
  const [sessions, config, slots, visits] = await Promise.all([listSessions(), readConfig(), readSlots(), listVisits(30, VISIT_KEEP_MS).catch(() => [])]);
  const now = Date.now();
  return {
    config,
    /** MCP agents from their first call; sessionId is set once they start a booking. */
    visits: visits.map(({ ipKey: _ip, userAgent: _ua, ...v }) => ({ ...v, calls: v.calls.slice(-30), live: now - Date.parse(v.lastSeenAt) < LIVE_MS })),
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

/** Clinic: start the demo over. Clears agents, bookings, holds, forms, links and IDs; keeps the clinic's settings. */
export async function resetDemo(confirm: unknown) {
  if (confirm !== "RESET") throw new DemoError(400, 'Send confirm: "RESET" to clear the demo.');
  return withLock(LOCK, async () => ({ ok: true, removed: await resetDemoData() }));
}

/* ——— Identity check ——— */

/** What /demo/verify/<token> shows: whose check it is, and the WebAuthn challenge. */
export async function openVerify(token: string, log = true) {
  const rec = await readVerify(token);
  if (!rec) return { error: "missing" as const };
  const s = await readSession(rec.sessionId);
  if (!s?.identity) return { error: "missing" as const };
  if (s.identity.status === "verified") return { done: true as const, userName: s.userName, agentName: s.agentName };
  if (Date.parse(rec.expiresAt) <= Date.now()) return { error: "expired" as const };
  /** The first open (and again after 5 minutes) goes in the log, so the agent and clinic can tell opened from not. */
  if (log && (!s.identity.openedAt || Date.now() - Date.parse(s.identity.openedAt) > 5 * 60_000)) {
    await withLock(LOCK, async () => {
      const cur = await readSession(rec.sessionId);
      if (!cur?.identity || cur.identity.status === "verified") return;
      const at = new Date().toISOString();
      cur.identity = { ...cur.identity, openedAt: at };
      cur.events = [...cur.events, { id: `e_ido${Date.now().toString(36)}`, at, actor: "system", channel: cur.channel, type: "identity_opened", summary: `${cur.userName} opened the identity check` }];
      await writeSession(cur);
    });
  }
  return { done: false as const, userName: s.userName, agentName: s.agentName, challenge: rec.challenge, clinic: CLINIC.name };
}

const b64urlJson = (v: unknown) => {
  if (typeof v !== "string" || v.length > 4000) return null;
  try {
    return JSON.parse(Buffer.from(v, "base64url").toString("utf8")) as Record<string, unknown>;
  } catch {
    return null;
  }
};
const ID_TYPES = ["image/jpeg", "image/png", "image/heic", "image/webp", "application/pdf"];
const MAX_ID_B64 = 900_000;

/**
 * The user's submission from /demo/verify/<token>. Face ID: the browser made a platform credential with user
 * verification for our challenge; we check the challenge, origin and type in clientDataJSON and the user-present and
 * user-verified flags in authenticatorData. (A demo check: no credential is kept, and attestation isn't verified.)
 */
export async function submitVerify(token: string, body: Record<string, unknown>, origin: string) {
  const rec = await readVerify(token);
  if (!rec) throw new DemoError(404, "This link doesn't work. Ask your agent for a new one.");
  if (rec.usedAt) throw new DemoError(409, "You've already confirmed it's you. Your agent will continue from here.");
  if (Date.parse(rec.expiresAt) <= Date.now()) throw new DemoError(410, "This link has expired. Ask your agent for a new one.");

  const dob = typeof body.dob === "string" ? body.dob.trim() : "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dob) || Number.isNaN(Date.parse(dob))) throw new DemoError(400, "Enter your date of birth.");
  const age = (Date.now() - Date.parse(dob)) / (365.25 * 86_400_000);
  if (age < 0 || age > 120) throw new DemoError(400, "That date of birth doesn't look right.");

  const file = body.license as Record<string, unknown> | undefined;
  const dataUrl = typeof file?.dataUrl === "string" ? file.dataUrl : "";
  const m = dataUrl.match(/^data:([a-z/+.-]+);base64,([A-Za-z0-9+/=]+)$/);
  if (!m) throw new DemoError(400, "Attach a photo of your driver's licence.");
  const mime = m[1]!.toLowerCase();
  if (!ID_TYPES.includes(mime)) throw new DemoError(400, "Attach the licence as a photo (JPEG, PNG or HEIC) or a PDF.");
  if (m[2]!.length > MAX_ID_B64) throw new DemoError(413, "That photo is too large. Try again; the page shrinks photos before sending.");
  const fileName = typeof file?.fileName === "string" && file.fileName.trim() ? file.fileName.trim().replace(/[^\w.\- ]+/g, "").slice(0, 80) : "drivers-licence.jpg";
  const size = Math.floor((m[2]!.length * 3) / 4);

  let method: "face-id" | "none" = "none";
  const wa = body.webauthn as Record<string, unknown> | undefined;
  if (wa) {
    const client = b64urlJson(wa.clientDataJSON);
    if (!client || client.type !== "webauthn.create" || client.challenge !== rec.challenge || client.origin !== origin) throw new DemoError(400, "Face ID check didn't match this page. Reload and try again.");
    if (typeof wa.authenticatorData === "string") {
      const ad = Buffer.from(wa.authenticatorData, "base64url");
      const flags = ad[32] ?? 0;
      if (ad.length < 37 || !(flags & 0x01) || !(flags & 0x04)) throw new DemoError(400, "Face ID didn't confirm it was you. Try again.");
    }
    method = "face-id";
  }

  return withLock(LOCK, async () => {
    const s = await readSession(rec.sessionId);
    if (!s?.identity) throw new DemoError(404, "This link doesn't work. Ask your agent for a new one.");
    const at = new Date().toISOString();
    await writeIdFile(s.id, { dataUrl, fileName, mime });
    await writeVerify(token, { ...rec, usedAt: at });
    const mismatch = s.forms.intake.dob?.trim() && s.forms.intake.dob.trim() !== dob;
    s.identity = { ...s.identity, status: "verified", verifiedAt: at, dob, method, license: { fileName, mime, size } };
    if (!s.forms.intake.dob?.trim()) s.forms = { ...s.forms, intake: { ...s.forms.intake, dob } };
    const how = method === "face-id" ? "Face ID" : "no Face ID on this device";
    s.events = [
      ...s.events,
      { id: `e_idv${Date.now().toString(36)}`, at, actor: "system", channel: s.channel, type: "identity_verified", summary: `${s.userName} confirmed it's them: ${how} · date of birth · driver's licence${mismatch ? " (date of birth differs from the intake)" : ""}` },
    ];
    s.updatedAt = at;
    await writeSession(s);
    return { ok: true, method };
  });
}

/** Clinic: the licence image. */
export async function clinicIdFile(sessionId: unknown) {
  if (typeof sessionId !== "string") throw new DemoError(400, "session_id is required.");
  const f = await readIdFile(sessionId);
  if (!f) throw new DemoError(404, "No licence on file.");
  return f;
}

const SHARE_DAYS = 7;
const MAX_SHARES = 10;

/**
 * Makes a private, read-only link to the user's forms for the agent to give its user. The token is 32 random bytes
 * and is stored only in shares/<token>.json; the session keeps the share's id, expiry and view count.
 */
export async function shareForms(token: unknown, origin: string, days: unknown, channel: DemoChannel) {
  const first = await authenticate(token);
  return withLock(LOCK, async () => {
    const s = await readSession(first.id);
    if (!s) throw new DemoError(401, "Session not found. Connect again.");
    const started = s.forms.status === "sent" || Object.keys(s.forms.assessments).length > 0 || Object.keys(s.forms.intake).length > 1;
    if (!started) throw new DemoError(409, "Fill in the forms first; there's nothing to share yet.");
    if ((s.shares ?? []).filter((x) => !x.revoked).length >= MAX_SHARES) throw new DemoError(409, `This session already has ${MAX_SHARES} links.`);
    const d = Math.min(30, Math.max(1, Math.round(Number(days) || SHARE_DAYS)));
    const now = new Date();
    const at = now.toISOString();
    const expiresAt = new Date(now.getTime() + d * 86_400_000).toISOString();
    const secret = randomBytes(32).toString("base64url");
    const shareId = `sh_${now.getTime().toString(36)}${randomBytes(3).toString("hex")}`;
    await writeShare(secret, { sessionId: s.id, shareId, expiresAt });
    s.shares = [...(s.shares ?? []), { id: shareId, createdAt: at, expiresAt, views: 0, lastViewedAt: null, revoked: false }];
    const until = new Date(expiresAt).toLocaleDateString("en-CA", { month: "short", day: "numeric" });
    s.events = [...s.events, { id: `e_${shareId}`, at, actor: "agent", channel, type: "forms_shared", summary: `Shared a copy of the forms with ${s.userName} · link expires ${until}` }];
    s.updatedAt = at;
    s.lastSeenAt = at;
    await writeSession(s);
    const [config, slots] = await Promise.all([readConfig(), readSlots()]);
    const url = `${origin}/demo/forms/${secret}`;
    return {
      result: {
        url,
        expires_at: expiresAt,
        message_for_user: `Here's a copy of the forms I filled out for you at ${CLINIC.name}: ${url}\nIt's a private link just for you. It expires ${until}, and only someone with the link can open it, so don't forward it.`,
        safeguards: SHARE_SAFEGUARDS,
      },
      ...agentPayload(s, config, slots, now.getTime()),
    };
  });
}

/** What protects a shared copy. Plain facts about the link, not a compliance certification. */
export const SHARE_SAFEGUARDS = [
  "Private link with a 256-bit random token; it isn't listed or indexed anywhere",
  "Expires automatically (7 days unless set otherwise); the clinic can turn it off at any time",
  "Read-only; every time it's opened is logged for the clinic",
  "Sent over HTTPS and stored encrypted",
  "Handled under Doe's privacy policy, which follows Ontario's PHIPA and Canada's PIPEDA where they apply",
];

/** The shared copy for /demo/forms/<token>, or why it can't be shown. Logs the view on the session. */
export async function openShare(token: string, log = true) {
  const rec = await readShare(token);
  if (!rec) return { error: "missing" as const };
  if (Date.parse(rec.expiresAt) <= Date.now()) return { error: "expired" as const };
  return withLock(LOCK, async () => {
    const s = await readSession(rec.sessionId);
    const share = s?.shares?.find((x) => x.id === rec.shareId);
    if (!s || !share) return { error: "missing" as const };
    if (share.revoked) return { error: "revoked" as const };
    if (!log) {
      const forms = { ...s.forms, uploads: (s.forms.uploads ?? []).filter((u) => u.by === "agent").map(({ dataUrl: _d, ...u }) => u) };
      return { session: { userName: s.userName, agentName: s.agentName, forms, booking: { status: s.booking.status, slotId: s.booking.slotId, label: s.booking.label } }, share, scores: scores(s) };
    }
    const at = new Date().toISOString();
    /** One log line per open, at most every 10 minutes, so reloads don't flood the clinic's log. */
    const quiet = share.lastViewedAt && Date.now() - Date.parse(share.lastViewedAt) < 10 * 60_000;
    s.shares = s.shares!.map((x) => (x.id === share.id ? { ...x, views: x.views + 1, lastViewedAt: at } : x));
    if (!quiet) s.events = [...s.events, { id: `e_v${Date.now().toString(36)}${randomBytes(2).toString("hex")}`, at, actor: "system", channel: s.channel, type: "forms_viewed", summary: `${s.userName} opened the shared copy of their forms` }];
    await writeSession(s);
    /** Only what the page shows: never the session secret, its messages, or file bodies. */
    const forms = { ...s.forms, uploads: (s.forms.uploads ?? []).filter((u) => u.by === "agent").map(({ dataUrl: _d, ...u }) => u) };
    const copy = { userName: s.userName, agentName: s.agentName, forms, booking: { status: s.booking.status, slotId: s.booking.slotId, label: s.booking.label } };
    return { session: copy, share: { ...share, views: share.views + 1 }, scores: scores(s) };
  });
}

/** Clinic: turn a share link off. */
export async function revokeShare(sessionId: unknown, shareId: unknown) {
  if (typeof sessionId !== "string" || typeof shareId !== "string") throw new DemoError(400, "session_id and share_id are required.");
  return withLock(LOCK, async () => {
    const s = await readSession(sessionId);
    if (!s?.shares?.some((x) => x.id === shareId)) throw new DemoError(404, "No such link.");
    const at = new Date().toISOString();
    s.shares = s.shares.map((x) => (x.id === shareId ? { ...x, revoked: true } : x));
    s.events = [...s.events, { id: `e_r${Date.now().toString(36)}`, at, actor: "clinic", channel: "clinic", type: "share_revoked", summary: "Staff turned off a shared forms link" }];
    await writeSession(s);
    return { ok: true };
  });
}

const VISIT_KEEP_MS = 6 * 60 * 60 * 1000;
const IP_MATCH_MS = 30 * 60 * 1000;
const REHANDSHAKE_MS = 10 * 60 * 1000;
const MAX_CALLS = 80;
const newVisitId = () => `vis_${Date.now().toString(36).padStart(9, "0")}${Math.random().toString(36).slice(2, 8).padEnd(6, "0")}`;

/** Names the agent from its MCP client info or user agent: "instinct-ios" reads as Instinct. */
function agentNameOf(client: DemoVisit["client"], ua: string | null) {
  const known = ["Instinct", "Muse", "Poke", "Claude", "ChatGPT", "Gemini", "Cursor"];
  const hay = `${client.title ?? ""} ${client.name ?? ""} ${ua ?? ""}`;
  const hit = known.find((k) => new RegExp(k, "i").test(hay));
  if (hit) return hit;
  const raw = (client.title || client.name || "").trim();
  return raw ? raw.slice(0, 40).replace(/^./, (c) => c.toUpperCase()) : "MCP agent";
}

const TOOL_SUMMARY: Record<string, string> = {
  doe_clinic_info: "Read the clinic: services, prices, Dr. Brooks' profile, insurance and availability",
  doe_connect: "Started a booking session",
  doe_get_session: "Checked the booking",
};

/**
 * Records one MCP request on the agent's visit, so /demo/clinic sees the agent from its first call. Returns the visit
 * id (sent back as Mcp-Session-Id). A client that doesn't echo the header is matched by network for 30 minutes.
 */
export async function mcpTouch(o: {
  headerId: string | null;
  ip: string;
  userAgent: string | null;
  method: string;
  tool: string | null;
  clientInfo?: Record<string, unknown> | null;
}): Promise<string> {
  const now = new Date().toISOString();
  const key = ipKey(o.ip);
  const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim().slice(0, 80) : null);
  let id: string | null = null;
  if (o.method !== "initialize") {
    if (o.headerId && (await readVisit(o.headerId))) id = o.headerId;
    else {
      const recent = await readIpVisit(key);
      if (recent && Date.now() - Date.parse(recent.at) < IP_MATCH_MS) id = recent.id;
    }
  } else {
    /** Clients that redo the handshake on every request stay one visit: same network, same client, still unbooked. */
    const recent = await readIpVisit(key);
    if (recent && Date.now() - Date.parse(recent.at) < REHANDSHAKE_MS) {
      const v = await readVisit(recent.id);
      if (v && !v.sessionId && v.client.name === str(o.clientInfo?.name)) id = v.id;
    }
  }
  const summary =
    o.method === "initialize"
      ? `Connected over MCP${str(o.clientInfo?.name) ? ` (${str(o.clientInfo?.name)}${str(o.clientInfo?.version) ? ` ${str(o.clientInfo?.version)}` : ""})` : ""}`
      : o.method === "tools/list"
        ? "Listed what it can do at the clinic"
        : o.tool
          ? (TOOL_SUMMARY[o.tool] ?? `Called ${o.tool.replace(/^doe_/, "").replace(/_/g, " ")}`)
          : o.method;
  const call = { at: now, method: o.method, tool: o.tool, summary };
  const visitId = id ?? newVisitId();
  await withLock(`visit:${visitId}`, async () => {
    const existing = id ? await readVisit(visitId) : null;
    const client = existing?.client ?? { name: str(o.clientInfo?.name), version: str(o.clientInfo?.version), title: str(o.clientInfo?.title) };
    const v: DemoVisit = existing
      ? { ...existing, lastSeenAt: now, calls: [...existing.calls, call].slice(-MAX_CALLS) }
      : { id: visitId, createdAt: now, lastSeenAt: now, client, agentName: agentNameOf(client, o.userAgent), userAgent: o.userAgent?.slice(0, 200) ?? null, ipKey: key, sessionId: null, calls: [call] };
    await writeVisit(v);
  });
  await writeIpVisit(key, visitId);
  return visitId;
}

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
