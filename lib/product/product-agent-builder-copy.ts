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
  subtitle: "Main clinic voice agent · draft logic",
} as const;

export const PRODUCT_AGENT_BUILDER_NODES: readonly ProductAgentBuilderNode[] = [
  {
    id: "incoming",
    kind: "trigger",
    title: "Incoming call",
    detail: "Main line · Twilio",
    x: 72,
    y: 88,
  },
  {
    id: "greet",
    kind: "action",
    title: "Greet caller",
    detail: "Clinic greeting + language detect",
    x: 300,
    y: 72,
  },
  {
    id: "intent",
    kind: "logic",
    title: "Classify intent",
    detail: "Schedule · refill · billing · clinical",
    x: 540,
    y: 88,
  },
  {
    id: "ehr",
    kind: "integration",
    title: "Check patient chart",
    detail: "Epic · identity + open tasks",
    x: 540,
    y: 250,
    editing: true,
  },
  {
    id: "schedule",
    kind: "action",
    title: "Offer next slot",
    detail: "Book in clinic schedule",
    x: 300,
    y: 320,
  },
  {
    id: "confirm",
    kind: "action",
    title: "Confirm + SMS",
    detail: "Send visit details",
    x: 72,
    y: 320,
  },
  {
    id: "escalate",
    kind: "handoff",
    title: "Escalate to staff",
    detail: "Warm transfer · front desk",
    x: 780,
    y: 160,
  },
] as const;

export const PRODUCT_AGENT_BUILDER_EDGES: readonly ProductAgentBuilderEdge[] = [
  { id: "e1", from: "incoming", to: "greet" },
  { id: "e2", from: "greet", to: "intent" },
  { id: "e3", from: "intent", to: "ehr", label: "schedule" },
  { id: "e4", from: "intent", to: "escalate", label: "clinical" },
  { id: "e5", from: "ehr", to: "schedule" },
  { id: "e6", from: "schedule", to: "confirm" },
] as const;

export const PRODUCT_AGENT_BUILDER_EDITING = {
  nodeId: "ehr",
  eyebrow: "Editing node",
  title: "Check patient chart",
  fields: [
    { id: "source", label: "Integration", value: "Epic FHIR" },
    { id: "match", label: "Identity match", value: "Name + DOB + phone" },
    { id: "pull", label: "Pull", value: "Open tasks · meds · next visit" },
    { id: "fail", label: "On miss", value: "Ask clarifying question, then retry" },
  ],
} as const;

export const PRODUCT_AGENT_BUILDER_INTEGRATIONS = [
  { id: "epic", name: "Epic", category: "EHR", active: true },
  { id: "twilio", name: "Twilio", category: "Voice", active: true },
  { id: "outlook", name: "Outlook", category: "Calendar", active: false },
  { id: "surescripts", name: "Surescripts", category: "Pharmacy", active: false },
  { id: "slack", name: "Slack", category: "Alerts", active: true },
] as const;
