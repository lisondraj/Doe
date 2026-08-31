export type ProductNewCanvasNodeType = "trigger" | "speech" | "intent" | "handoff";

export type ProductNewCanvasNode = {
  id: string;
  type: ProductNewCanvasNodeType;
  label: string;
  detail?: string;
  x: number;
  y: number;
};

export type ProductNewCanvasEdge = {
  from: string;
  to: string;
};

export type ProductNewWorkflowStatus = "live" | "draft";

export type ProductNewWorkflowAgent = {
  name: string;
  line: string;
  greeting: string;
  language: string;
  voice: string;
  hours: string;
  intents: readonly { id: string; label: string; action: string }[];
  handoffs: readonly { id: string; label: string; detail: string }[];
};

export type ProductNewWorkflow = {
  id: string;
  name: string;
  status: ProductNewWorkflowStatus;
  updated: string;
  agent: ProductNewWorkflowAgent;
  nodes: readonly ProductNewCanvasNode[];
  edges: readonly ProductNewCanvasEdge[];
};

export const PRODUCTNEW_WORKFLOWS: readonly ProductNewWorkflow[] = [
  {
    id: "front-desk",
    name: "Front desk intake",
    status: "live",
    updated: "Answering calls · updated 2 days ago",
    agent: {
      name: "Front desk",
      line: "Main clinic line · (415) 555-0142",
      greeting:
        "Thank you for calling Harborview Family Medicine. This is the front desk assistant. How can I help you today?",
      language: "English, Spanish",
      voice: "Calm, clear clinic tone",
      hours: "Mon–Fri 8:00 AM – 5:30 PM",
      intents: [
        { id: "scheduling", label: "Scheduling", action: "Offer next available slot in Epic" },
        { id: "refill", label: "Prescription refill", action: "Verify pharmacy and route to inbox" },
        { id: "billing", label: "Billing question", action: "Collect account details, route to billing" },
        { id: "clinical", label: "Clinical concern", action: "Triage urgency, warm transfer if needed" },
      ],
      handoffs: [
        { id: "staff", label: "Front desk", detail: "Warm transfer during business hours" },
        { id: "oncall", label: "On-call physician", detail: "Urgent clinical calls only" },
        { id: "voicemail", label: "After-hours message", detail: "Capture and notify inbox" },
      ],
    },
    nodes: [
      { id: "line", type: "trigger", label: "Main line", detail: "Inbound calls", x: 6, y: 46 },
      { id: "greeting", type: "speech", label: "Opening greeting", x: 24, y: 46 },
      { id: "scheduling", type: "intent", label: "Scheduling", detail: "Epic slots", x: 46, y: 18 },
      { id: "refill", type: "intent", label: "Refills", detail: "Pharmacy verify", x: 46, y: 38 },
      { id: "billing", type: "intent", label: "Billing", detail: "Account lookup", x: 46, y: 58 },
      { id: "clinical", type: "intent", label: "Clinical", detail: "Triage", x: 46, y: 78 },
      { id: "staff", type: "handoff", label: "Front desk", x: 72, y: 28 },
      { id: "oncall", type: "handoff", label: "On-call", x: 72, y: 52 },
      { id: "voicemail", type: "handoff", label: "Voicemail", x: 72, y: 76 },
    ],
    edges: [
      { from: "line", to: "greeting" },
      { from: "greeting", to: "scheduling" },
      { from: "greeting", to: "refill" },
      { from: "greeting", to: "billing" },
      { from: "greeting", to: "clinical" },
      { from: "scheduling", to: "staff" },
      { from: "refill", to: "staff" },
      { from: "billing", to: "staff" },
      { from: "clinical", to: "oncall" },
      { from: "clinical", to: "voicemail" },
    ],
  },
  {
    id: "billing-followup",
    name: "Billing follow-up",
    status: "draft",
    updated: "Draft · edited 3 hours ago",
    agent: {
      name: "Billing outreach",
      line: "Outbound line · reminder calls",
      greeting:
        "Hi, this is Harborview Family Medicine calling about your account balance. Would you like to hear your balance or make a payment?",
      language: "English, Spanish",
      voice: "Friendly, direct billing tone",
      hours: "Mon–Fri 9:00 AM – 4:00 PM",
      intents: [
        { id: "balance", label: "Check balance", action: "Read balance from Availity" },
        { id: "pay", label: "Make a payment", action: "Send secure payment link via SMS" },
        { id: "dispute", label: "Dispute charge", action: "Log dispute, route to billing queue" },
      ],
      handoffs: [
        { id: "billing-staff", label: "Billing team", detail: "James Okafor, weekdays before noon" },
        { id: "voicemail", label: "Voicemail", detail: "Capture and notify billing inbox" },
      ],
    },
    nodes: [
      { id: "line", type: "trigger", label: "Outbound dial", detail: "Balance reminders", x: 8, y: 50 },
      { id: "greeting", type: "speech", label: "Opening greeting", x: 28, y: 50 },
      { id: "balance", type: "intent", label: "Check balance", detail: "Read from Availity", x: 52, y: 26 },
      { id: "pay", type: "intent", label: "Make a payment", detail: "SMS payment link", x: 52, y: 50 },
      { id: "dispute", type: "intent", label: "Dispute charge", detail: "Log + route", x: 52, y: 74 },
      { id: "billing-staff", type: "handoff", label: "Billing team", x: 78, y: 40 },
      { id: "voicemail", type: "handoff", label: "Voicemail", x: 78, y: 68 },
    ],
    edges: [
      { from: "line", to: "greeting" },
      { from: "greeting", to: "balance" },
      { from: "greeting", to: "pay" },
      { from: "greeting", to: "dispute" },
      { from: "pay", to: "billing-staff" },
      { from: "dispute", to: "billing-staff" },
      { from: "balance", to: "voicemail" },
    ],
  },
  {
    id: "after-hours",
    name: "After-hours triage",
    status: "draft",
    updated: "Draft · edited yesterday",
    agent: {
      name: "After-hours triage",
      line: "Main clinic line · after 5:30 PM",
      greeting:
        "You've reached Harborview Family Medicine after hours. If this is an emergency, please hang up and dial 911. Otherwise, tell me what's going on.",
      language: "English, Spanish",
      voice: "Calm, reassuring clinical tone",
      hours: "Daily 5:30 PM – 8:00 AM",
      intents: [
        { id: "urgent", label: "Urgent symptom", action: "Triage urgency, escalate to on-call" },
        { id: "rx-emergency", label: "Prescription emergency", action: "Route to on-call for override" },
        { id: "general", label: "General question", action: "Capture message for morning follow-up" },
      ],
      handoffs: [
        { id: "oncall", label: "On-call physician", detail: "Urgent symptoms only" },
        { id: "urgent-care", label: "Urgent care referral", detail: "Read nearest location + hours" },
        { id: "voicemail", label: "Morning voicemail", detail: "Routed to front desk at 8:00 AM" },
      ],
    },
    nodes: [
      { id: "line", type: "trigger", label: "Main line", detail: "After 5:30 PM", x: 6, y: 50 },
      { id: "greeting", type: "speech", label: "Opening greeting", x: 26, y: 50 },
      { id: "urgent", type: "intent", label: "Urgent symptom", detail: "Triage", x: 50, y: 22 },
      { id: "rx-emergency", type: "intent", label: "Rx emergency", detail: "On-call override", x: 50, y: 50 },
      { id: "general", type: "intent", label: "General question", detail: "Capture message", x: 50, y: 78 },
      { id: "oncall", type: "handoff", label: "On-call", x: 76, y: 22 },
      { id: "urgent-care", type: "handoff", label: "Urgent care", x: 76, y: 46 },
      { id: "voicemail", type: "handoff", label: "Voicemail", x: 76, y: 78 },
    ],
    edges: [
      { from: "line", to: "greeting" },
      { from: "greeting", to: "urgent" },
      { from: "greeting", to: "rx-emergency" },
      { from: "greeting", to: "general" },
      { from: "urgent", to: "oncall" },
      { from: "urgent", to: "urgent-care" },
      { from: "rx-emergency", to: "oncall" },
      { from: "general", to: "voicemail" },
    ],
  },
] as const;

export const PRODUCTNEW_AGENT_NOTES = [
  {
    id: "hours",
    title: "Holiday hours",
    body: "Closed Memorial Day. After-hours calls route to voicemail with on-call escalation for urgent symptoms.",
  },
  {
    id: "insurance",
    title: "New payer scripts",
    body: "Aetna prior auth line changed. Use reference script v3 for scheduling callbacks.",
  },
  {
    id: "front-desk",
    title: "Front desk handoff",
    body: "Transfer to Maya Chen for scheduling disputes. Billing queue goes to James before noon.",
  },
] as const;

export type ProductNewIntegration = {
  id: string;
  name: string;
  category: string;
  connected: boolean;
};

export const PRODUCTNEW_INTEGRATIONS: readonly ProductNewIntegration[] = [
  { id: "epic", name: "Epic", category: "EHR", connected: true },
  { id: "athena", name: "Athena", category: "EHR", connected: false },
  { id: "slack", name: "Slack", category: "Messaging", connected: true },
  { id: "teams", name: "Teams", category: "Messaging", connected: false },
  { id: "zoom", name: "Zoom", category: "Telehealth", connected: true },
  { id: "surescripts", name: "Surescripts", category: "Pharmacy", connected: true },
  { id: "availity", name: "Availity", category: "Billing", connected: true },
  { id: "stripe", name: "Stripe", category: "Payments", connected: false },
  { id: "fhir", name: "FHIR", category: "Interop", connected: true },
  { id: "redox", name: "Redox", category: "Interop", connected: false },
];
