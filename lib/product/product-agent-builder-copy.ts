export type ProductAgentBuilderNodeKind =
  | "trigger"
  | "logic"
  | "action"
  | "integration"
  | "handoff";

export type ProductAgentBuilderNode = {
  id: string;
  kind: ProductAgentBuilderNodeKind;
  title: string;
  detail: string;
  x: number;
  y: number;
  editing?: boolean;
};

export type ProductAgentBuilderEdge = {
  id: string;
  from: string;
  to: string;
  label?: string;
};

export const PRODUCT_AGENT_BUILDER_TAB_LABEL = "Agent Builder";

export const PRODUCT_AGENT_BUILDER_HEADER = {
  title: "Agent Builder",
  subtitle: "Main clinic line · draft flow",
  agentName: "Northside Front Desk",
  agentStatus: "Draft",
} as const;

export const PRODUCT_AGENT_BUILDER_KIND_LABEL: Record<ProductAgentBuilderNodeKind, string> = {
  trigger: "Trigger",
  logic: "Logic",
  action: "Action",
  integration: "Integration",
  handoff: "Handoff",
};

/** Canvas coordinates are node centers; keep left margin clear of the sidebar. */
export const PRODUCT_AGENT_BUILDER_NODES: readonly ProductAgentBuilderNode[] = [
  {
    id: "incoming",
    kind: "trigger",
    title: "Incoming call",
    detail: "Main line · Twilio voice",
    x: 130,
    y: 120,
  },
  {
    id: "greet",
    kind: "action",
    title: "Greet caller",
    detail: "Clinic greeting · language detect",
    x: 360,
    y: 120,
  },
  {
    id: "intent",
    kind: "logic",
    title: "Classify intent",
    detail: "Schedule · refill · billing · clinical",
    x: 600,
    y: 120,
  },
  {
    id: "ehr",
    kind: "integration",
    title: "Check patient chart",
    detail: "Epic · identity + open tasks",
    x: 600,
    y: 300,
    editing: true,
  },
  {
    id: "schedule",
    kind: "action",
    title: "Offer next slot",
    detail: "Book in clinic schedule",
    x: 360,
    y: 300,
  },
  {
    id: "confirm",
    kind: "action",
    title: "Confirm + SMS",
    detail: "Send visit details to caller",
    x: 130,
    y: 300,
  },
  {
    id: "escalate",
    kind: "handoff",
    title: "Escalate to staff",
    detail: "Warm transfer · front desk",
    x: 840,
    y: 210,
  },
] as const;

export const PRODUCT_AGENT_BUILDER_EDGES: readonly ProductAgentBuilderEdge[] = [
  { id: "e1", from: "incoming", to: "greet" },
  { id: "e2", from: "greet", to: "intent" },
  { id: "e3", from: "intent", to: "ehr", label: "Schedule" },
  { id: "e4", from: "intent", to: "escalate", label: "Clinical" },
  { id: "e5", from: "ehr", to: "schedule" },
  { id: "e6", from: "schedule", to: "confirm" },
] as const;

export const PRODUCT_AGENT_BUILDER_EDITING = {
  nodeId: "ehr",
  eyebrow: "Editing node",
  kind: "Integration",
  title: "Check patient chart",
  summary: "Match the caller to a chart, then pull the tasks this agent needs before offering a slot.",
  fields: [
    { id: "source", label: "Integration", value: "Epic FHIR R4" },
    { id: "match", label: "Identity match", value: "Name + DOB + phone" },
    { id: "pull", label: "Pull", value: "Open tasks · meds · next visit" },
    { id: "fail", label: "On miss", value: "Ask clarifying question, then retry once" },
  ],
} as const;

export const PRODUCT_AGENT_BUILDER_INTEGRATIONS = [
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
] as const;
