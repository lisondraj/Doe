export type ProductAgentBuilderNodeKind =
  | "trigger"
  | "logic"
  | "action"
  | "integration"
  | "handoff";

export type ProductAgentBuilderStatus = "draft" | "live" | "paused";

export type ProductAgentBuilderNode = {
  id: string;
  kind: ProductAgentBuilderNodeKind;
  title: string;
  detail: string;
  x: number;
  y: number;
  summary?: string;
  fields?: readonly { id: string; label: string; value: string }[];
};

export type ProductAgentBuilderEdge = {
  id: string;
  from: string;
  to: string;
  label?: string;
};

export type ProductAgentBuilderIntegration = {
  id: string;
  name: string;
  category: string;
  detail: string;
  active: boolean;
};

export type ProductAgentBuilderAgent = {
  id: string;
  name: string;
  line: string;
  clinic: string;
  status: ProductAgentBuilderStatus;
  updated: string;
  version: string;
  callsToday: number;
  nodes: readonly ProductAgentBuilderNode[];
  edges: readonly ProductAgentBuilderEdge[];
  defaultNodeId: string;
  integrations: readonly ProductAgentBuilderIntegration[];
};

export const PRODUCT_AGENT_BUILDER_TAB_LABEL = "Agent Builder";

export const PRODUCT_AGENT_BUILDER_HEADER = {
  title: "Agent Builder",
} as const;

export const PRODUCT_AGENT_BUILDER_KIND_LABEL: Record<ProductAgentBuilderNodeKind, string> = {
  trigger: "Trigger",
  logic: "Logic",
  action: "Action",
  integration: "Integration",
  handoff: "Handoff",
};

export const PRODUCT_AGENT_BUILDER_STATUS_LABEL: Record<ProductAgentBuilderStatus, string> = {
  draft: "Draft",
  live: "Live",
  paused: "Paused",
};

export const PRODUCT_AGENT_BUILDER_TOOLBAR = {
  libraryEyebrow: "Built agents",
  libraryTitle: "Library",
  test: "Test call",
  publish: "Publish",
  resetView: "Reset view",
  editingEyebrow: "Editing node",
  integrationsEyebrow: "Connected systems",
  integrationsTitle: "Integrations",
} as const;

const SHARED_INTEGRATIONS: readonly ProductAgentBuilderIntegration[] = [
  {
    id: "epic",
    name: "Epic",
    category: "EHR",
    detail: "Chart lookup · open tasks",
    active: true,
  },
  {
    id: "twilio",
    name: "Twilio",
    category: "Voice",
    detail: "Inbound trunk · SMS",
    active: true,
  },
  {
    id: "outlook",
    name: "Outlook",
    category: "Calendar",
    detail: "Clinic availability",
    active: false,
  },
  {
    id: "surescripts",
    name: "Surescripts",
    category: "Pharmacy",
    detail: "Refill status",
    active: false,
  },
  {
    id: "slack",
    name: "Slack",
    category: "Alerts",
    detail: "Staff escalation channel",
    active: true,
  },
];

/** Clickable history of agents built in this clinic. */
export const PRODUCT_AGENT_BUILDER_AGENTS: readonly ProductAgentBuilderAgent[] = [
  {
    id: "front-desk",
    name: "Northside Front Desk",
    line: "Main clinic line",
    clinic: "Northside",
    status: "draft",
    updated: "Edited 12m ago",
    version: "v0.8",
    callsToday: 47,
    defaultNodeId: "ehr",
    integrations: SHARED_INTEGRATIONS,
    nodes: [
      {
        id: "incoming",
        kind: "trigger",
        title: "Incoming call",
        detail: "Main line · Twilio voice",
        x: 130,
        y: 120,
        summary: "Answer the main clinic number and start the voice session.",
        fields: [
          { id: "number", label: "Line", value: "+1 (415) 555-0142" },
          { id: "provider", label: "Provider", value: "Twilio Voice" },
          { id: "hours", label: "Hours", value: "24/7 · after-hours handoff at 6pm" },
        ],
      },
      {
        id: "greet",
        kind: "action",
        title: "Greet caller",
        detail: "Clinic greeting · language detect",
        x: 360,
        y: 120,
        summary: "Play the clinic greeting and detect language before intent routing.",
        fields: [
          { id: "script", label: "Greeting", value: "Thanks for calling Northside…" },
          { id: "lang", label: "Languages", value: "English · Spanish" },
        ],
      },
      {
        id: "intent",
        kind: "logic",
        title: "Classify intent",
        detail: "Schedule · refill · billing · clinical",
        x: 600,
        y: 120,
        summary: "Route the caller into the right branch of the flow.",
        fields: [
          { id: "model", label: "Classifier", value: "Clinic intents v3" },
          { id: "fallback", label: "Fallback", value: "Ask one clarifying question" },
        ],
      },
      {
        id: "ehr",
        kind: "integration",
        title: "Check patient chart",
        detail: "Epic · identity + open tasks",
        x: 600,
        y: 300,
        summary: "Match the caller to a chart, then pull the tasks this agent needs before offering a slot.",
        fields: [
          { id: "source", label: "Integration", value: "Epic FHIR R4" },
          { id: "match", label: "Identity match", value: "Name + DOB + phone" },
          { id: "pull", label: "Pull", value: "Open tasks · meds · next visit" },
          { id: "fail", label: "On miss", value: "Ask clarifying question, then retry once" },
        ],
      },
      {
        id: "schedule",
        kind: "action",
        title: "Offer next slot",
        detail: "Book in clinic schedule",
        x: 360,
        y: 300,
        summary: "Offer the soonest open visit that matches the caller's preference.",
        fields: [
          { id: "window", label: "Window", value: "Next 14 days" },
          { id: "types", label: "Visit types", value: "Follow-up · new patient" },
        ],
      },
      {
        id: "confirm",
        kind: "action",
        title: "Confirm + SMS",
        detail: "Send visit details to caller",
        x: 130,
        y: 300,
        summary: "Confirm the booking aloud and text the visit details.",
        fields: [
          { id: "channel", label: "Confirm", value: "Voice + SMS" },
          { id: "template", label: "Template", value: "Northside visit confirm" },
        ],
      },
      {
        id: "escalate",
        kind: "handoff",
        title: "Escalate to staff",
        detail: "Warm transfer · front desk",
        x: 840,
        y: 210,
        summary: "Warm-transfer clinical or complex callers to the front desk.",
        fields: [
          { id: "dest", label: "Destination", value: "Front desk queue" },
          { id: "brief", label: "Brief", value: "Intent + chart match status" },
        ],
      },
    ],
    edges: [
      { id: "e1", from: "incoming", to: "greet" },
      { id: "e2", from: "greet", to: "intent" },
      { id: "e3", from: "intent", to: "ehr", label: "Schedule" },
      { id: "e4", from: "intent", to: "escalate", label: "Clinical" },
      { id: "e5", from: "ehr", to: "schedule" },
      { id: "e6", from: "schedule", to: "confirm" },
    ],
  },
  {
    id: "refill",
    name: "Refill Desk",
    line: "Pharmacy line",
    clinic: "Northside",
    status: "live",
    updated: "Published yesterday",
    version: "v1.4",
    callsToday: 112,
    defaultNodeId: "rx-check",
    integrations: [
      { ...SHARED_INTEGRATIONS[0], active: true },
      { ...SHARED_INTEGRATIONS[1], active: true },
      { ...SHARED_INTEGRATIONS[3], active: true },
      { ...SHARED_INTEGRATIONS[2], active: false },
      { ...SHARED_INTEGRATIONS[4], active: true },
    ],
    nodes: [
      {
        id: "rx-in",
        kind: "trigger",
        title: "Pharmacy inbound",
        detail: "Refill line · Twilio",
        x: 140,
        y: 150,
        summary: "Catch refill requests on the pharmacy line.",
        fields: [
          { id: "number", label: "Line", value: "+1 (415) 555-0198" },
          { id: "hours", label: "Hours", value: "Mon–Fri 8a–6p" },
        ],
      },
      {
        id: "rx-id",
        kind: "logic",
        title: "Verify caller",
        detail: "Name · DOB · med list",
        x: 380,
        y: 150,
        summary: "Confirm identity before touching the medication record.",
        fields: [
          { id: "checks", label: "Checks", value: "Name + DOB + RX list" },
          { id: "tries", label: "Attempts", value: "2 before staff handoff" },
        ],
      },
      {
        id: "rx-check",
        kind: "integration",
        title: "Check refill status",
        detail: "Surescripts · Epic meds",
        x: 620,
        y: 150,
        summary: "Look up active meds and whether a refill is already pending.",
        fields: [
          { id: "source", label: "Integration", value: "Surescripts + Epic" },
          { id: "pull", label: "Pull", value: "Active meds · last fill · pending RX" },
          { id: "fail", label: "On miss", value: "Offer nurse callback" },
        ],
      },
      {
        id: "rx-route",
        kind: "action",
        title: "Route refill",
        detail: "Approve · pharmacy · MD review",
        x: 620,
        y: 330,
        summary: "Send eligible refills through or escalate for review.",
        fields: [
          { id: "auto", label: "Auto-approve", value: "Maintenance meds only" },
          { id: "review", label: "Needs review", value: "Controlled · new script" },
        ],
      },
      {
        id: "rx-sms",
        kind: "action",
        title: "SMS update",
        detail: "Status to patient phone",
        x: 380,
        y: 330,
        summary: "Text the patient when the refill moves forward.",
        fields: [{ id: "template", label: "Template", value: "Refill status v2" }],
      },
      {
        id: "rx-staff",
        kind: "handoff",
        title: "Pharmacy staff",
        detail: "Warm transfer",
        x: 860,
        y: 240,
        summary: "Hand complex refill cases to pharmacy staff.",
        fields: [{ id: "dest", label: "Destination", value: "Pharmacy desk" }],
      },
    ],
    edges: [
      { id: "r1", from: "rx-in", to: "rx-id" },
      { id: "r2", from: "rx-id", to: "rx-check" },
      { id: "r3", from: "rx-check", to: "rx-route", label: "Ready" },
      { id: "r4", from: "rx-check", to: "rx-staff", label: "Complex" },
      { id: "r5", from: "rx-route", to: "rx-sms" },
    ],
  },
  {
    id: "after-hours",
    name: "After-Hours Triage",
    line: "Night answering",
    clinic: "Northside",
    status: "paused",
    updated: "Paused 3 days ago",
    version: "v0.3",
    callsToday: 0,
    defaultNodeId: "ah-urgency",
    integrations: [
      { ...SHARED_INTEGRATIONS[1], active: true },
      { ...SHARED_INTEGRATIONS[4], active: true },
      { ...SHARED_INTEGRATIONS[0], active: false },
      { ...SHARED_INTEGRATIONS[2], active: false },
      { ...SHARED_INTEGRATIONS[3], active: false },
    ],
    nodes: [
      {
        id: "ah-in",
        kind: "trigger",
        title: "After-hours call",
        detail: "Night trunk",
        x: 160,
        y: 180,
        summary: "Answer after clinic close with a triage script.",
        fields: [{ id: "window", label: "Window", value: "6pm – 8am" }],
      },
      {
        id: "ah-urgency",
        kind: "logic",
        title: "Urgency screen",
        detail: "Emergent · urgent · routine",
        x: 420,
        y: 180,
        summary: "Sort callers into emergent, next-day, or message paths.",
        fields: [
          { id: "red", label: "Emergent", value: "Chest pain · breathing · stroke signs" },
          { id: "amber", label: "Urgent", value: "Fever · injury · med reaction" },
        ],
      },
      {
        id: "ah-911",
        kind: "handoff",
        title: "Advise 911",
        detail: "Emergent script",
        x: 680,
        y: 120,
        summary: "Direct emergent callers to emergency services.",
        fields: [{ id: "script", label: "Script", value: "After-hours emergent v1" }],
      },
      {
        id: "ah-oncall",
        kind: "handoff",
        title: "Page on-call",
        detail: "Slack + SMS",
        x: 680,
        y: 260,
        summary: "Page the on-call clinician with a brief.",
        fields: [{ id: "channel", label: "Alert", value: "Slack #on-call + SMS" }],
      },
      {
        id: "ah-note",
        kind: "action",
        title: "Leave message",
        detail: "Next-day queue",
        x: 420,
        y: 340,
        summary: "Capture a message for the morning desk queue.",
        fields: [{ id: "queue", label: "Queue", value: "Morning triage inbox" }],
      },
    ],
    edges: [
      { id: "a1", from: "ah-in", to: "ah-urgency" },
      { id: "a2", from: "ah-urgency", to: "ah-911", label: "Emergent" },
      { id: "a3", from: "ah-urgency", to: "ah-oncall", label: "Urgent" },
      { id: "a4", from: "ah-urgency", to: "ah-note", label: "Routine" },
    ],
  },
  {
    id: "billing",
    name: "Billing Concierge",
    line: "Statements line",
    clinic: "Northside",
    status: "draft",
    updated: "Edited 2h ago",
    version: "v0.2",
    callsToday: 9,
    defaultNodeId: "bill-balance",
    integrations: [
      { ...SHARED_INTEGRATIONS[0], active: true },
      { ...SHARED_INTEGRATIONS[1], active: true },
      { ...SHARED_INTEGRATIONS[2], active: false },
      { ...SHARED_INTEGRATIONS[3], active: false },
      { ...SHARED_INTEGRATIONS[4], detail: "Billing escalations", active: true },
    ],
    nodes: [
      {
        id: "bill-in",
        kind: "trigger",
        title: "Billing inbound",
        detail: "Statements line",
        x: 150,
        y: 160,
        summary: "Answer billing and statement questions.",
        fields: [{ id: "number", label: "Line", value: "+1 (415) 555-0177" }],
      },
      {
        id: "bill-id",
        kind: "logic",
        title: "Identify account",
        detail: "MRN · DOB · statement",
        x: 400,
        y: 160,
        summary: "Locate the patient billing account safely.",
        fields: [{ id: "keys", label: "Match", value: "DOB + statement ID" }],
      },
      {
        id: "bill-balance",
        kind: "integration",
        title: "Pull balance",
        detail: "Epic billing",
        x: 650,
        y: 160,
        summary: "Read open balances and recent payments.",
        fields: [
          { id: "source", label: "Integration", value: "Epic Resolute" },
          { id: "pull", label: "Pull", value: "Balance · last payment · plan" },
        ],
      },
      {
        id: "bill-explain",
        kind: "action",
        title: "Explain charges",
        detail: "Plain-language summary",
        x: 650,
        y: 320,
        summary: "Summarize what the balance covers in plain language.",
        fields: [{ id: "tone", label: "Tone", value: "Clear · non-judgmental" }],
      },
      {
        id: "bill-staff",
        kind: "handoff",
        title: "Billing staff",
        detail: "Payment plans",
        x: 400,
        y: 320,
        summary: "Transfer for disputes or payment plans.",
        fields: [{ id: "dest", label: "Destination", value: "Billing specialists" }],
      },
    ],
    edges: [
      { id: "b1", from: "bill-in", to: "bill-id" },
      { id: "b2", from: "bill-id", to: "bill-balance" },
      { id: "b3", from: "bill-balance", to: "bill-explain" },
      { id: "b4", from: "bill-explain", to: "bill-staff", label: "Dispute" },
    ],
  },
] as const;

/** @deprecated Prefer PRODUCT_AGENT_BUILDER_AGENTS[0] */
export const PRODUCT_AGENT_BUILDER_NODES = PRODUCT_AGENT_BUILDER_AGENTS[0].nodes;
/** @deprecated Prefer PRODUCT_AGENT_BUILDER_AGENTS[0] */
export const PRODUCT_AGENT_BUILDER_EDGES = PRODUCT_AGENT_BUILDER_AGENTS[0].edges;
/** @deprecated Prefer agent.integrations */
export const PRODUCT_AGENT_BUILDER_INTEGRATIONS = SHARED_INTEGRATIONS;
