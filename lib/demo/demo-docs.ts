/**
 * How an agent connects to /demo: the REST endpoints, the MCP tools, and the short snippets the confirmation
 * screen shows. One source, so the docs endpoint, the MCP tool list and the page agree.
 */
import { ASSESSMENTS } from "@/lib/demo/demo-assessments";
import { COMMS } from "@/lib/demo/demo-clinic";
import type { AgentAction } from "@/lib/demo/demo-engine";

export const API_BASE = "/api/demo/v1";
export const MCP_PATH = "/api/demo/mcp";

export const FLOW = [
  "Confirm with your user: Doe's Terms of Service and Privacy Policy, and that by booking through Doe they're voluntarily providing their PHI.",
  "connect, with both consents true. Keep the token it returns.",
  "Read the clinic (services, bundles, availability) and pick a plan.",
  "Before you hold, tell your user about the provider (training, experience, reviews in clinic.provider_profiles) and ask if they want to book.",
  "hold_slot for 10 minutes; negotiate or ask questions in threads if you like.",
  "Fill the intake, walk your user through each assessment one question at a time, record their signature, submit_forms. Upload anything that helps the doctor, like your user's migraine diary, with upload_form.",
  "request_booking with phi_confirmed: true, then poll the session until the clinic confirms.",
];

export function apiDocs(origin: string) {
  const base = `${origin}${API_BASE}`;
  return {
    name: "Doe demo · Dr. Brooks' Migraine Clinic",
    audience: "Personal agents booking care for their user. Your user does not see these pages.",
    flow: FLOW,
    auth: "connect returns token. Send it as Authorization: Bearer <token> on session and actions.",
    endpoints: {
      docs: `GET ${base}`,
      clinic: `GET ${base}/clinic`,
      connect: `POST ${base}/connect  { agent_name, user_name, user_location, user_phone, request, consent: { terms: true, phi: true, connected, network } }`,
      session: `GET ${base}/session`,
      actions: `POST ${base}/actions  { type, ...fields }`,
    },
    actions: {
      select_plan: { plan: { kind: "service | bundle", id: "botox" } },
      hold_slot: { slot_id: "wed-1" },
      release_hold: {},
      send_message: { thread: "concierge | negotiate | forms", text: "Can you do $1,300?" },
      respond_offer: { message_id: "m_…", accept: true },
      update_intake: { fields: { dob: "1989-04-17", phone: "…" } },
      answer_assessment: { assessment_id: ASSESSMENTS.map((a) => a.id).join(" | "), answers: { nausea: 1 } },
      record_signature: { signed_by: "Alex Rivera" },
      submit_forms: {},
      request_booking: { phi_confirmed: true },
      set_comms: { id: COMMS.map((c) => c.id).join(" | "), on: true },
      set_consent: { id: "connected | network", on: true },
      upload_form: { title: "Migraine diary", text: "Oct 2: 7/10, 9 h, nausea…  (or file_name, mime_type, content_base64 for a PDF or photo)" },
    } satisfies Record<AgentAction["type"], unknown>,
    mcp: { transport: "Streamable HTTP (JSON responses)", url: `${origin}${MCP_PATH}`, tools: MCP_TOOLS.map((t) => t.name) },
  };
}

const token = { session_token: { type: "string", description: "Token from doe_connect." } };
const obj = (properties: Record<string, unknown>, required: string[] = []) => ({
  type: "object",
  properties: { ...token, ...properties },
  required: ["session_token", ...required],
  additionalProperties: false,
});

export const MCP_TOOLS: { name: string; description: string; inputSchema: Record<string, unknown> }[] = [
  {
    name: "doe_connect",
    description:
      "Start a booking session at Dr. Brooks' Migraine Clinic for your user. First confirm with them that they agree to Doe's Terms of Service and Privacy Policy, and that by booking through Doe they're voluntarily providing their PHI; both must be true. Returns session_token.",
    inputSchema: {
      type: "object",
      properties: {
        agent_name: { type: "string", description: "Your name, shown to the clinic." },
        user_name: { type: "string", description: "Your user's full name." },
        user_location: { type: "string", description: "Where your user lives, e.g. Toronto, Ontario. Shown to the clinic." },
        user_phone: { type: "string", description: "Your user's phone number, if they agree to share it. Prefills the intake." },
        request: { type: "string", description: "What your user wants, e.g. Botox for chronic migraine." },
        consent_terms: { type: "boolean", description: "User agreed to Doe's Terms of Service and Privacy Policy. Required: true." },
        consent_phi: { type: "boolean", description: "User confirmed they're voluntarily providing PHI by booking through Doe. Required: true." },
        stay_connected: { type: "boolean", description: "User allows you to stay connected for updates." },
        join_network: { type: "boolean", description: "User wants to join the Doe network." },
      },
      required: ["consent_terms", "consent_phi"],
      additionalProperties: false,
    },
  },
  { name: "doe_clinic_info", description: "Services, bundles, offers, insurance, availability, intake fields and assessment questions.", inputSchema: { type: "object", properties: {}, additionalProperties: false } },
  { name: "doe_get_session", description: "Your session: status, pricing, hold, booking, forms, scores, message threads, availability and next steps.", inputSchema: obj({}) },
  {
    name: "doe_select_plan",
    description: "Choose the service or bundle to book.",
    inputSchema: obj({ kind: { type: "string", enum: ["service", "bundle"] }, id: { type: "string", description: "Service or bundle id from doe_clinic_info." } }, ["kind", "id"]),
  },
  { name: "doe_hold_slot", description: "Hold an open slot for 10 minutes.", inputSchema: obj({ slot_id: { type: "string" } }, ["slot_id"]) },
  { name: "doe_release_hold", description: "Release your held slot.", inputSchema: obj({}) },
  {
    name: "doe_send_message",
    description: "Message the clinic. concierge: questions. negotiate: propose a price for the selected plan; replies may carry an offer. forms: questions about forms.",
    inputSchema: obj({ thread: { type: "string", enum: ["concierge", "negotiate", "forms"] }, text: { type: "string" } }, ["thread", "text"]),
  },
  { name: "doe_respond_offer", description: "Accept or decline a clinic offer from the negotiate thread.", inputSchema: obj({ message_id: { type: "string" }, accept: { type: "boolean" } }, ["message_id", "accept"]) },
  {
    name: "doe_update_intake",
    description: "Fill intake fields from what your user has told you: name, dob, phone, email, tried, acute, allergies, pregnant, neuro.",
    inputSchema: obj({ fields: { type: "object", additionalProperties: { type: "string" } } }, ["fields"]),
  },
  {
    name: "doe_answer_assessment",
    description: "Record your user's answers to an assessment (idm, midas, hit6, ichd). Ask each question in your user's words, one at a time. Values: see doe_clinic_info.",
    inputSchema: obj(
      { assessment_id: { type: "string", enum: ASSESSMENTS.map((a) => a.id) }, answers: { type: "object", additionalProperties: { type: "integer" } } },
      ["assessment_id", "answers"],
    ),
  },
  { name: "doe_record_signature", description: "Record that your user signed the consent to treatment.", inputSchema: obj({ signed_by: { type: "string" } }) },
  { name: "doe_submit_forms", description: "Pass the intake and assessments back to the clinic.", inputSchema: obj({}) },
  {
    name: "doe_upload_form",
    description:
      "Upload a form or file for the clinic: your user's migraine diary, a referral, a previous prescription. Send text for a written form, or file_name + mime_type + content_base64 for a PDF or photo (about 60 KB max). Ask your user before sending.",
    inputSchema: obj(
      {
        title: { type: "string", description: "What it is, e.g. Migraine diary, last 30 days." },
        text: { type: "string", description: "The form as plain text." },
        file_name: { type: "string" },
        mime_type: { type: "string", enum: ["application/pdf", "image/png", "image/jpeg", "image/heic", "text/plain", "text/csv", "text/markdown"] },
        content_base64: { type: "string", description: "The file, base64-encoded." },
      },
      ["title"],
    ),
  },
  {
    name: "doe_request_booking",
    description: "Request the booking for the held slot. Confirm again with your user that by booking through Doe they're voluntarily providing their PHI.",
    inputSchema: obj({ phi_confirmed: { type: "boolean" } }, ["phi_confirmed"]),
  },
  { name: "doe_set_comms", description: "Turn a communication preference on or off.", inputSchema: obj({ id: { type: "string", enum: COMMS.map((c) => c.id) }, on: { type: "boolean" } }, ["id", "on"]) },
  {
    name: "doe_set_consent",
    description: "Change an optional permission your user gave at connect: connected (stay connected for updates) or network (join the Doe network).",
    inputSchema: obj({ id: { type: "string", enum: ["connected", "network"] }, on: { type: "boolean" } }, ["id", "on"]),
  },
];

/** The snippets on the confirmation screen. */
export function snippets(origin: string) {
  const base = `${origin}${API_BASE}`;
  return {
    api: `curl -X POST ${base}/connect \\
  -H 'content-type: application/json' \\
  -d '{"agent_name":"My agent","user_name":"Alex Rivera",
       "consent":{"terms":true,"phi":true,"connected":true}}'

# then, with the token it returns:
curl ${base}/session -H 'authorization: Bearer <token>'
curl -X POST ${base}/actions -H 'authorization: Bearer <token>' \\
  -H 'content-type: application/json' -d '{"type":"hold_slot","slot_id":"wed-1"}'`,
    mcp: JSON.stringify({ mcpServers: { "doe-demo": { type: "http", url: `${origin}${MCP_PATH}` } } }, null, 2),
    docs: base,
  };
}
