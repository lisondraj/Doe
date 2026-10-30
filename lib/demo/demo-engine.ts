/**
 * /demo's rules, as pure functions over a session: what an agent or the clinic may do, what each action changes,
 * and the analytics /demo/clinic shows. The browser view, the REST API and the MCP server all go through here, so
 * they behave the same.
 */
import { ASSESSMENTS, isComplete } from "@/lib/demo/demo-assessments";
import { DemoError } from "@/lib/demo/demo-error";
import { checkMessage } from "@/lib/demo/demo-guard";
import { BUNDLES, CLINIC, COMMS, DAYS, INTAKE_FIELDS, SERVICES, money } from "@/lib/demo/demo-clinic";
import { conciergeReply, formsReply, negotiateReply } from "@/lib/demo/demo-replies";
import type {
  DemoAnalytics,
  DemoChannel,
  DemoConfig,
  DemoConsent,
  DemoMessage,
  DemoPlan,
  DemoSession,
  DemoSessionView,
  DemoSlotState,
  DemoSlots,
  DemoThreadId,
} from "@/lib/demo/demo-types";

export const HOLD_MS = 10 * 60 * 1000;
export const LIVE_MS = 2 * 60 * 1000;
const AGENT_DISCOUNT = 0.05;
const MAX_EVENTS = 300;
const MAX_MESSAGES = 200;
/** Per session, per hour: enough for a full booking many times over, not enough to flood the clinic. */
export const MAX_ACTIONS_HOUR = 300;
export const MAX_MESSAGES_HOUR = 40;
/** The same message twice in a thread within this window is rejected as a repeat. */
const REPEAT_MS = 30_000;

export const DEFAULT_CONFIG: DemoConfig = {
  bookable: Object.fromEntries([...SERVICES, ...BUNDLES].map((s) => [s.id, s.id !== "virtual"])),
  floorPct: 0.92,
  autoConfirm: false,
};

export { DemoError };

const rand = (n: number) => Array.from({ length: n }, () => "abcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(Math.random() * 36)]).join("");
/** Time-ordered ids, so listing sessions by name lists them newest first. */
export const newSessionId = () => `ses_${Date.now().toString(36).padStart(9, "0")}${rand(6)}`;
export const newSecret = () => rand(32);
const rid = (p: string) => `${p}${Date.now().toString(36)}${rand(5)}`;

const CHANNEL_NAME: Record<DemoChannel, string> = { browser: "Browser", api: "API", mcp: "MCP" };

export const THREADS: { id: DemoThreadId; title: string }[] = [
  { id: "concierge", title: "Clinic concierge" },
  { id: "negotiate", title: "Pricing & bundles" },
  { id: "forms", title: "Forms" },
];

export const planKey = (p: DemoPlan) => `${p.kind}:${p.id}`;

export function planInfo(p: DemoPlan): { label: string; price: number } | null {
  const item = p.kind === "service" ? SERVICES.find((s) => s.id === p.id) : BUNDLES.find((b) => b.id === p.id);
  return item ? { label: item.name, price: item.price } : null;
}

export const SLOTS = DAYS.flatMap((d) => d.slots.map((s) => ({ ...s, dayId: d.id, weekday: d.weekday, date: d.date })));
export const slotLabel = (id: string) => {
  const s = SLOTS.find((x) => x.id === id);
  return s ? `${s.weekday} ${s.date}, ${s.time} · ${s.provider}` : id;
};

export function slotState(slots: DemoSlots, id: string, now: number): DemoSlotState {
  const e = slots[id];
  if (!e) return { status: "open" };
  if (e.kind === "held" && (!e.until || Date.parse(e.until) <= now)) return { status: "open" };
  return { status: e.kind, sessionId: e.sessionId, until: e.until };
}

export function availability(slots: DemoSlots, now: number, sessionId?: string) {
  return DAYS.map((d) => ({
    day: d.id,
    weekday: d.weekday,
    date: d.date,
    slots: d.slots.map((s) => {
      const st = slotState(slots, s.id, now);
      const mine = Boolean(sessionId && st.sessionId === sessionId);
      return { id: s.id, time: s.time, provider: s.provider, status: st.status === "open" ? "open" : mine ? `yours_${st.status}` : "taken" };
    }),
  }));
}

function earliestOpen(slots: DemoSlots, now: number) {
  const s = SLOTS.find((x) => slotState(slots, x.id, now).status === "open");
  return s ? slotLabel(s.id) : null;
}

/** Drops a hold whose 10 minutes have run out. */
export function normalize(s: DemoSession, now: number): DemoSession {
  if (s.hold && Date.parse(s.hold.expiresAt) <= now) return { ...s, hold: null };
  return s;
}

export const viewOf = (s: DemoSession): DemoSessionView => {
  const { secret: _secret, ...rest } = s;
  return rest;
};

export function pricing(s: DemoSession) {
  const info = planInfo(s.plan) ?? { label: s.plan.id, price: 0 };
  const deal = s.agreed[planKey(s.plan)];
  const discount = deal ? 0 : Math.round(info.price * AGENT_DISCOUNT);
  return { label: info.label, list: info.price, deal: deal ?? null, discount, total: (deal ?? info.price) - discount };
}

export function scores(s: DemoSession) {
  return ASSESSMENTS.map((a) => {
    const answers = s.forms.assessments[a.id];
    const complete = isComplete(a, answers);
    return { id: a.id, name: a.name, complete, ...(complete ? a.result(answers!) : { score: null, band: null, tone: null }) };
  });
}

export type DemoStatus = "Booked" | "Ready to confirm" | "Declined" | "Negotiating" | "Holding" | "Forms returned" | "Browsing";

export function statusOf(s: DemoSession, now: number): DemoStatus {
  if (s.booking.status === "confirmed") return "Booked";
  if (s.booking.status === "requested") return "Ready to confirm";
  const neg = s.threads.negotiate;
  if (neg.some((m) => m.offer?.status === "open") || neg[neg.length - 1]?.from === "agent") return "Negotiating";
  if (s.hold && Date.parse(s.hold.expiresAt) > now) return "Holding";
  if (s.booking.status === "declined") return "Declined";
  if (s.forms.status === "sent") return "Forms returned";
  return "Browsing";
}

/** What the agent still has to do before the booking is confirmed. */
export function nextSteps(s: DemoSession, config: DemoConfig, now: number): string[] {
  const steps: string[] = [];
  if (s.booking.status === "confirmed") return ["Booked. Tell your user the time and send reminders."];
  if (s.booking.status === "requested") return ["Wait for the clinic to confirm; poll the session or watch the concierge thread."];
  if (config.bookable[s.plan.id] === false) steps.push(`select_plan: "${pricing(s).label}" isn't bookable by agents; pick another plan.`);
  if (!s.hold || Date.parse(s.hold.expiresAt) <= now) steps.push("hold_slot: hold an open slot from availability (10 minutes).");
  if (s.forms.status !== "sent") {
    const missing = INTAKE_FIELDS.filter((f) => f.id !== "consent" && !s.forms.intake[f.id]?.trim()).map((f) => f.id);
    if (missing.length) steps.push(`update_intake: fill ${missing.join(", ")}.`);
    const open = scores(s).filter((x) => !x.complete).map((x) => x.id);
    if (open.length) steps.push(`answer_assessment: ask your user ${open.join(", ")}, one question at a time.`);
    if (!s.forms.signedBy) steps.push("record_signature: have your user sign the consent to treatment.");
    steps.push("submit_forms: pass the forms back to the clinic.");
  }
  steps.push("request_booking: confirm with your user that by booking through Doe they're voluntarily providing their PHI, then send phi_confirmed: true.");
  return steps;
}

function event(s: DemoSession, actor: "agent" | "clinic" | "system", channel: DemoChannel | "clinic", type: string, summary: string, at: string) {
  s.events = [...s.events, { id: rid("e_"), at, actor, channel, type, summary }].slice(-MAX_EVENTS);
}

function post(s: DemoSession, thread: DemoThreadId, m: Omit<DemoMessage, "id">): DemoMessage {
  const full = { ...m, id: rid("m_") };
  s.threads = { ...s.threads, [thread]: [...s.threads[thread], full].slice(-MAX_MESSAGES) };
  return full;
}

const str = (v: unknown, max: number, name: string): string => {
  if (typeof v !== "string" || !v.trim()) throw new DemoError(400, `${name} is required.`);
  if (v.length > max) throw new DemoError(400, `${name} is longer than ${max} characters.`);
  return v.trim();
};

export type ConnectInput = {
  channel: DemoChannel;
  agentName?: unknown;
  userName?: unknown;
  request?: unknown;
  consent?: Partial<Record<keyof DemoConsent, unknown>>;
};

export function createSession(input: ConnectInput, now: Date): DemoSession {
  const c = input.consent ?? {};
  if (c.terms !== true) throw new DemoError(400, "consent.terms must be true: your user has to agree to Doe's Terms of Service and Privacy Policy.");
  if (c.phi !== true) throw new DemoError(400, "consent.phi must be true: your user has to confirm that by booking through Doe they're voluntarily providing their PHI.");
  const at = now.toISOString();
  const userName = typeof input.userName === "string" && input.userName.trim() ? input.userName.trim().slice(0, 120) : "Your user";
  const agentName =
    typeof input.agentName === "string" && input.agentName.trim()
      ? input.agentName.trim().slice(0, 80)
      : input.channel === "browser"
        ? "Browser agent"
        : input.channel === "mcp"
          ? "MCP agent"
          : "API agent";
  const request = typeof input.request === "string" && input.request.trim() ? input.request.trim().slice(0, 200) : "Botox for chronic migraine";
  const s: DemoSession = {
    id: newSessionId(),
    secret: newSecret(),
    createdAt: at,
    updatedAt: at,
    lastSeenAt: at,
    channel: input.channel,
    agentName,
    userName,
    request,
    consent: { terms: true, phi: true, connected: c.connected === true, network: c.network === true },
    plan: { kind: "service", id: "botox" },
    hold: null,
    agreed: {},
    comms: Object.fromEntries(COMMS.map((x) => [x.id, x.on])),
    forms: { intake: { name: userName === "Your user" ? "" : userName }, signedBy: null, signedAt: null, assessments: {}, status: "draft", sentAt: null },
    booking: { status: "none", slotId: null, total: null, label: null, phiConfirmed: false, requestedAt: null, decidedAt: null, note: null },
    threads: { concierge: [], negotiate: [], forms: [] },
    events: [],
  };
  post(s, "concierge", { from: "system", text: `${agentName} connected via ${input.channel.toUpperCase()} for ${userName}`, at });
  post(s, "concierge", { from: "clinic", by: "clinic-agent", text: `Brooks clinic agent here. Ask about treatment, timing or the visit.`, at });
  post(s, "negotiate", { from: "clinic", by: "clinic-agent", text: "Private pay, CAD. Propose a price and I'll check with Dr. Brooks.", at });
  post(s, "forms", { from: "clinic", by: "clinic-agent", text: "Needed before the first visit: intake, ID-Migraine, MIDAS, HIT-6 and ICHD-3 criteria.", at });
  event(s, "agent", input.channel, "connected", `connected via ${CHANNEL_NAME[input.channel]} for ${userName}`, at);
  return s;
}

export type AgentAction =
  | { type: "select_plan"; plan: DemoPlan }
  | { type: "hold_slot"; slot_id: string }
  | { type: "release_hold" }
  | { type: "send_message"; thread: DemoThreadId; text: string }
  | { type: "respond_offer"; message_id: string; accept: boolean }
  | { type: "update_intake"; fields: Record<string, string> }
  | { type: "answer_assessment"; assessment_id: string; answers: Record<string, number> }
  | { type: "record_signature"; signed_by?: string }
  | { type: "submit_forms" }
  | { type: "request_booking"; phi_confirmed: boolean }
  | { type: "set_comms"; id: string; on: boolean }
  | { type: "set_consent"; id: "connected" | "network"; on: boolean };

export const AGENT_ACTIONS = [
  "select_plan",
  "hold_slot",
  "release_hold",
  "send_message",
  "respond_offer",
  "update_intake",
  "answer_assessment",
  "record_signature",
  "submit_forms",
  "request_booking",
  "set_comms",
  "set_consent",
] as const;

type Ctx = { config: DemoConfig; slots: DemoSlots; now: Date; channel: DemoChannel | "clinic" };
export type ActResult = { session: DemoSession; slots: DemoSlots; slotsChanged: boolean; result: Record<string, unknown> };

const THREAD_IDS: DemoThreadId[] = ["concierge", "negotiate", "forms"];

function confirmBooking(s: DemoSession, slots: DemoSlots, at: string, by: "staff" | "auto") {
  s.booking = { ...s.booking, status: "confirmed", decidedAt: at };
  if (s.booking.slotId) slots[s.booking.slotId] = { sessionId: s.id, kind: "booked" };
  post(s, "concierge", {
    from: "clinic",
    by: by === "staff" ? "staff" : "clinic-agent",
    text: `Confirmed: ${s.userName}, ${slotLabel(s.booking.slotId ?? "")}, ${money(s.booking.total ?? 0)}. Reminders at 48 h and 2 h.`,
    at,
  });
  event(s, "clinic", "clinic", "booking_confirmed", `Booking confirmed${by === "auto" ? " automatically" : ""}: ${slotLabel(s.booking.slotId ?? "")}`, at);
}

export function applyAgentAction(input: DemoSession, action: AgentAction, ctx: Ctx): ActResult {
  const now = ctx.now.getTime();
  const at = ctx.now.toISOString();
  const s: DemoSession = structuredClone(normalize(input, now));
  const slots: DemoSlots = structuredClone(ctx.slots);
  let slotsChanged = false;
  let result: Record<string, unknown> = {};
  const ch = ctx.channel;
  const locked = s.booking.status === "requested" || s.booking.status === "confirmed";

  const hour = at.slice(0, 13);
  const usage = s.usage?.hour === hour ? { ...s.usage } : { hour, actions: 0, messages: 0 };
  if (usage.actions >= MAX_ACTIONS_HOUR) throw new DemoError(429, "This session has hit its hourly action limit. Try again next hour.");
  usage.actions += 1;
  if (action?.type === "send_message") {
    if (usage.messages >= MAX_MESSAGES_HOUR) throw new DemoError(429, "This session has hit its hourly message limit.");
    usage.messages += 1;
  }
  s.usage = usage;

  switch (action?.type) {
    case "select_plan": {
      const plan = action.plan;
      if (!plan || (plan.kind !== "service" && plan.kind !== "bundle") || !planInfo(plan)) throw new DemoError(400, "plan must be { kind: 'service' | 'bundle', id } from the clinic catalog.");
      if (locked) throw new DemoError(409, "A booking is already requested; the plan can't change.");
      s.plan = { kind: plan.kind, id: plan.id };
      event(s, "agent", ch, "plan_selected", `Selected ${planInfo(plan)!.label}`, at);
      result = { plan: s.plan, pricing: pricing(s), bookable: ctx.config.bookable[plan.id] !== false };
      break;
    }
    case "hold_slot": {
      const id = str(action.slot_id, 40, "slot_id");
      if (!SLOTS.some((x) => x.id === id)) throw new DemoError(404, `No slot ${id}. Call availability for slot ids.`);
      if (locked) throw new DemoError(409, "A booking is already requested.");
      const st = slotState(slots, id, now);
      if (st.status !== "open" && st.sessionId !== s.id) throw new DemoError(409, "That slot isn't available. Pick another from availability.");
      if (s.hold && s.hold.slotId !== id) delete slots[s.hold.slotId];
      const expiresAt = new Date(now + HOLD_MS).toISOString();
      slots[id] = { sessionId: s.id, kind: "held", until: expiresAt };
      slotsChanged = true;
      s.hold = { slotId: id, expiresAt };
      post(s, "concierge", { from: "system", text: `Held ${slotLabel(id)} for 10 minutes`, at });
      event(s, "agent", ch, "slot_held", `Held ${slotLabel(id)}`, at);
      result = { hold: s.hold, slot: slotLabel(id) };
      break;
    }
    case "release_hold": {
      if (!s.hold) throw new DemoError(409, "No slot is held.");
      if (slots[s.hold.slotId]?.sessionId === s.id && slots[s.hold.slotId]?.kind === "held") delete slots[s.hold.slotId];
      slotsChanged = true;
      event(s, "agent", ch, "hold_released", `Released ${slotLabel(s.hold.slotId)}`, at);
      s.hold = null;
      break;
    }
    case "send_message": {
      if (!THREAD_IDS.includes(action.thread)) throw new DemoError(400, "thread must be concierge, negotiate or forms.");
      const text = str(action.text, 2000, "text");
      checkMessage(text);
      const repeat = [...s.threads[action.thread]].reverse().find((m) => m.from === "agent");
      if (repeat && repeat.text === text && now - Date.parse(repeat.at) < REPEAT_MS) throw new DemoError(409, "You just sent that message.");
      const sent = post(s, action.thread, { from: "agent", text, at });
      let reply: DemoMessage;
      if (action.thread === "concierge") reply = post(s, "concierge", { from: "clinic", by: "clinic-agent", text: conciergeReply(text, earliestOpen(slots, now)), at });
      else if (action.thread === "forms") reply = post(s, "forms", { from: "clinic", by: "clinic-agent", text: formsReply(), at });
      else {
        const p = pricing(s);
        const r = negotiateReply(text, p.label, p.list, ctx.config.floorPct);
        reply = post(s, "negotiate", {
          from: "clinic",
          by: "clinic-agent",
          text: r.text,
          at,
          ...(r.price ? { offer: { price: r.price, label: p.label, planKey: planKey(s.plan), status: "open" as const } } : {}),
        });
        if (r.price) event(s, "clinic", "clinic", "offer_made", `Clinic agent offered ${money(r.price)} for ${p.label}`, at);
      }
      event(s, "agent", ch, "message_sent", `${THREADS.find((t) => t.id === action.thread)!.title}: ${text.slice(0, 120)}`, at);
      result = { sent, reply };
      break;
    }
    case "respond_offer": {
      const id = str(action.message_id, 60, "message_id");
      const msg = s.threads.negotiate.find((m) => m.id === id);
      if (!msg?.offer) throw new DemoError(404, "No offer with that message_id in the negotiate thread.");
      if (msg.offer.status !== "open") throw new DemoError(409, `That offer is already ${msg.offer.status}.`);
      if (typeof action.accept !== "boolean") throw new DemoError(400, "accept must be true or false.");
      if (locked && action.accept) throw new DemoError(409, "A booking is already requested.");
      const offer = { ...msg.offer, status: action.accept ? ("accepted" as const) : ("declined" as const) };
      s.threads = { ...s.threads, negotiate: s.threads.negotiate.map((m) => (m.id === id ? { ...m, offer } : m)) };
      if (action.accept) {
        s.agreed = { ...s.agreed, [offer.planKey]: offer.price };
        const [kind, pid] = offer.planKey.split(":") as [DemoPlan["kind"], string];
        s.plan = { kind, id: pid };
        post(s, "negotiate", { from: "agent", text: `Accepted ${money(offer.price)} for ${offer.label} on behalf of ${s.userName}.`, at });
        post(s, "negotiate", { from: "clinic", by: "clinic-agent", text: "Locked in for 48 hours. It shows on the booking.", at });
        event(s, "agent", ch, "offer_accepted", `Accepted ${money(offer.price)} for ${offer.label}`, at);
      } else {
        post(s, "negotiate", { from: "agent", text: `Declined ${money(offer.price)} for ${offer.label}.`, at });
        event(s, "agent", ch, "offer_declined", `Declined ${money(offer.price)} for ${offer.label}`, at);
      }
      result = { offer, pricing: pricing(s) };
      break;
    }
    case "update_intake": {
      if (s.forms.status === "sent") throw new DemoError(409, "Forms were already passed back.");
      const fields = action.fields;
      if (!fields || typeof fields !== "object") throw new DemoError(400, "fields must be an object of intake field ids to strings.");
      const known = new Set(INTAKE_FIELDS.filter((f) => f.id !== "consent").map((f) => f.id));
      const next = { ...s.forms.intake };
      for (const [k, v] of Object.entries(fields)) {
        if (!known.has(k)) throw new DemoError(400, `Unknown intake field ${k}. Fields: ${Array.from(known).join(", ")}.`);
        if (typeof v !== "string" || v.length > 500) throw new DemoError(400, `${k} must be a string up to 500 characters.`);
        next[k] = v;
      }
      s.forms = { ...s.forms, intake: next };
      result = { intake: next };
      break;
    }
    case "answer_assessment": {
      if (s.forms.status === "sent") throw new DemoError(409, "Forms were already passed back.");
      const a = ASSESSMENTS.find((x) => x.id === action.assessment_id);
      if (!a) throw new DemoError(404, `Unknown assessment. Use ${ASSESSMENTS.map((x) => x.id).join(", ")}.`);
      if (!action.answers || typeof action.answers !== "object") throw new DemoError(400, "answers must be an object of question ids to numbers.");
      const was = isComplete(a, s.forms.assessments[a.id]);
      const merged = { ...s.forms.assessments[a.id] };
      for (const [qid, raw] of Object.entries(action.answers)) {
        const q = a.questions.find((x) => x.id === qid);
        if (!q) throw new DemoError(400, `${a.name} has no question ${qid}.`);
        const v = Number(raw);
        if (!Number.isInteger(v)) throw new DemoError(400, `${qid} must be a whole number.`);
        if (q.kind === "choice" && !q.options.some((o) => o.value === v)) throw new DemoError(400, `${qid} must be one of ${q.options.map((o) => `${o.value} (${o.label})`).join(", ")}.`);
        if (q.kind === "scale" && (v < 0 || v > 10)) throw new DemoError(400, `${qid} must be 0 to 10.`);
        if (q.kind === "days" && (v < 0 || v > q.max)) throw new DemoError(400, `${qid} must be 0 to ${q.max}.`);
        merged[qid] = v;
      }
      s.forms = { ...s.forms, assessments: { ...s.forms.assessments, [a.id]: merged } };
      const complete = isComplete(a, merged);
      if (complete && !was) {
        const r = a.result(merged);
        event(s, "agent", ch, "assessment_completed", `${a.name}: ${r.score} · ${r.band}`, at);
      }
      result = { assessment: a.id, answers: merged, complete, ...(complete ? { result: a.result(merged) } : {}) };
      break;
    }
    case "record_signature": {
      if (s.forms.status === "sent") throw new DemoError(409, "Forms were already passed back.");
      const by = typeof action.signed_by === "string" && action.signed_by.trim() ? action.signed_by.trim().slice(0, 120) : s.userName;
      s.forms = { ...s.forms, signedBy: by, signedAt: at };
      event(s, "agent", ch, "signature_recorded", `Consent signed by ${by}`, at);
      result = { signedBy: by, signedAt: at };
      break;
    }
    case "submit_forms": {
      if (s.forms.status === "sent") throw new DemoError(409, "Forms were already passed back.");
      const open = scores(s).filter((x) => !x.complete);
      if (open.length) throw new DemoError(409, `Finish ${open.map((x) => x.name).join(", ")} first.`);
      if (!s.forms.signedBy) throw new DemoError(409, "Record the user's signature first.");
      if (!s.forms.intake.name?.trim()) throw new DemoError(409, "Intake needs the user's full name.");
      s.forms = { ...s.forms, status: "sent", sentAt: at };
      const summary = scores(s).map((x) => `${x.name} ${x.score}`).join(" · ");
      post(s, "forms", { from: "agent", text: `Passing back the signed intake and assessments: ${summary}.`, at });
      post(s, "forms", { from: "clinic", by: "clinic-agent", text: "Received. Dr. Brooks will review before the visit.", at });
      event(s, "agent", ch, "forms_submitted", `Forms passed back: ${summary}`, at);
      result = { scores: scores(s) };
      break;
    }
    case "request_booking": {
      if (locked) throw new DemoError(409, `Booking is already ${s.booking.status}.`);
      if (action.phi_confirmed !== true) throw new DemoError(400, "phi_confirmed must be true: confirm with your user that by booking through Doe they're voluntarily providing their PHI.");
      if (ctx.config.bookable[s.plan.id] === false) throw new DemoError(409, `${pricing(s).label} isn't bookable by agents.`);
      if (!s.hold) throw new DemoError(409, "Hold a slot first (holds last 10 minutes).");
      if (s.forms.status !== "sent") throw new DemoError(409, "Pass the forms back first.");
      const p = pricing(s);
      slots[s.hold.slotId] = { sessionId: s.id, kind: "requested" };
      slotsChanged = true;
      s.booking = { status: "requested", slotId: s.hold.slotId, total: p.total, label: p.label, phiConfirmed: true, requestedAt: at, decidedAt: null, note: null };
      s.hold = null;
      post(s, "concierge", { from: "agent", text: `Booking request: ${p.label}, ${slotLabel(s.booking.slotId!)}, ${money(p.total)}. PHI provided voluntarily via Doe.`, at });
      event(s, "agent", ch, "booking_requested", `Requested ${p.label}, ${slotLabel(s.booking.slotId!)}, ${money(p.total)}`, at);
      if (ctx.config.autoConfirm) confirmBooking(s, slots, at, "auto");
      else post(s, "concierge", { from: "clinic", by: "clinic-agent", text: "Got it. The front desk confirms agent bookings, usually within minutes.", at });
      result = { booking: s.booking };
      break;
    }
    case "set_comms": {
      if (!COMMS.some((c) => c.id === action.id)) throw new DemoError(400, `id must be one of ${COMMS.map((c) => c.id).join(", ")}.`);
      s.comms = { ...s.comms, [action.id]: action.on === true };
      event(s, "agent", ch, "comms_updated", `${COMMS.find((c) => c.id === action.id)!.title} ${action.on ? "on" : "off"}`, at);
      result = { comms: s.comms };
      break;
    }
    case "set_consent": {
      if (action.id !== "connected" && action.id !== "network") throw new DemoError(400, "id must be connected or network. Terms and PHI consent can't be withdrawn mid-session; end the session instead.");
      s.consent = { ...s.consent, [action.id]: action.on === true };
      event(s, "agent", ch, "consent_updated", `${action.id === "connected" ? "Stay connected" : "Doe network"} ${action.on ? "on" : "off"}`, at);
      result = { consent: s.consent };
      break;
    }
    default:
      throw new DemoError(400, `Unknown action type. Use one of: ${AGENT_ACTIONS.join(", ")}.`);
  }

  s.updatedAt = at;
  s.lastSeenAt = at;
  return { session: s, slots, slotsChanged, result };
}

export type ClinicAction =
  | { type: "send_message"; thread: DemoThreadId; text: string }
  | { type: "make_offer"; price: number }
  | { type: "confirm_booking" }
  | { type: "decline_booking"; note?: string }
  | { type: "release_hold" };

export function applyClinicAction(input: DemoSession, action: ClinicAction, ctx: Omit<Ctx, "channel">): ActResult {
  const now = ctx.now.getTime();
  const at = ctx.now.toISOString();
  const s: DemoSession = structuredClone(normalize(input, now));
  const slots: DemoSlots = structuredClone(ctx.slots);
  let slotsChanged = false;

  switch (action?.type) {
    case "send_message": {
      if (!THREAD_IDS.includes(action.thread)) throw new DemoError(400, "thread must be concierge, negotiate or forms.");
      const text = str(action.text, 2000, "text");
      checkMessage(text);
      post(s, action.thread, { from: "clinic", by: "staff", text, at });
      event(s, "clinic", "clinic", "clinic_message", `Staff replied: ${text.slice(0, 120)}`, at);
      break;
    }
    case "make_offer": {
      const price = Math.round(Number(action.price));
      if (!Number.isFinite(price) || price < 50 || price > 50000) throw new DemoError(400, "price must be between $50 and $50,000.");
      const p = pricing(s);
      s.threads = { ...s.threads, negotiate: s.threads.negotiate.map((m) => (m.offer?.status === "open" ? { ...m, offer: { ...m.offer, status: "declined" as const } } : m)) };
      post(s, "negotiate", { from: "clinic", by: "staff", text: `Dr. Brooks can do ${money(price)} for ${p.label}.`, offer: { price, label: p.label, planKey: planKey(s.plan), status: "open" }, at });
      event(s, "clinic", "clinic", "offer_made", `Staff offered ${money(price)} for ${p.label}`, at);
      break;
    }
    case "confirm_booking": {
      if (s.booking.status !== "requested") throw new DemoError(409, "There's no booking request to confirm.");
      confirmBooking(s, slots, at, "staff");
      slotsChanged = true;
      break;
    }
    case "decline_booking": {
      if (s.booking.status !== "requested") throw new DemoError(409, "There's no booking request to decline.");
      const note = typeof action.note === "string" && action.note.trim() ? action.note.trim().slice(0, 300) : null;
      if (s.booking.slotId && slots[s.booking.slotId]?.sessionId === s.id) delete slots[s.booking.slotId];
      slotsChanged = true;
      s.booking = { ...s.booking, status: "declined", decidedAt: at, note };
      post(s, "concierge", { from: "clinic", by: "staff", text: `We can't confirm ${slotLabel(s.booking.slotId ?? "")}.${note ? ` ${note}` : ""} Please hold another slot.`, at });
      event(s, "clinic", "clinic", "booking_declined", `Declined ${slotLabel(s.booking.slotId ?? "")}`, at);
      break;
    }
    case "release_hold": {
      if (!s.hold) throw new DemoError(409, "No slot is held.");
      if (slots[s.hold.slotId]?.sessionId === s.id) delete slots[s.hold.slotId];
      slotsChanged = true;
      post(s, "concierge", { from: "clinic", by: "staff", text: `We released the hold on ${slotLabel(s.hold.slotId)}.`, at });
      event(s, "clinic", "clinic", "hold_released", `Staff released ${slotLabel(s.hold.slotId)}`, at);
      s.hold = null;
      break;
    }
    default:
      throw new DemoError(400, "Unknown clinic action.");
  }
  s.updatedAt = at;
  return { session: s, slots, slotsChanged, result: {} };
}

export function analytics(sessions: DemoSession[], now: number): DemoAnalytics {
  const byChannel = { browser: 0, api: 0, mcp: 0 };
  const replies: number[] = [];
  let revenue = 0;
  let agentActions = 0;
  for (const s of sessions) {
    byChannel[s.channel] += 1;
    if (s.booking.status === "confirmed") revenue += s.booking.total ?? 0;
    agentActions += s.events.filter((e) => e.actor === "agent").length;
    for (const t of THREAD_IDS) {
      const msgs = s.threads[t];
      msgs.forEach((m, i) => {
        if (m.from !== "agent") return;
        const next = msgs.slice(i + 1).find((x) => x.from === "clinic");
        if (next) replies.push(Date.parse(next.at) - Date.parse(m.at));
      });
    }
  }
  replies.sort((a, b) => a - b);
  return {
    sessions: sessions.length,
    live: sessions.filter((s) => now - Date.parse(s.lastSeenAt) < LIVE_MS).length,
    byChannel,
    held: sessions.filter((s) => s.events.some((e) => e.type === "slot_held")).length,
    formsReturned: sessions.filter((s) => s.forms.status === "sent").length,
    requested: sessions.filter((s) => s.booking.status !== "none").length,
    confirmed: sessions.filter((s) => s.booking.status === "confirmed").length,
    revenue,
    openNegotiations: sessions.filter((s) => statusOf(s, now) === "Negotiating").length,
    medianReplyMs: replies.length ? replies[Math.floor(replies.length / 2)]! : null,
    agentActions,
  };
}

export const CLINIC_PROFILE = CLINIC;
