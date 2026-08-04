import { ABOUT_STYLE_FEATURE_SHADER_VARIANTS, type AboutStyleFeatureCard } from "@/lib/blog/about-style-feature-card";

const [v0, v1, v2, v3, v4, v5, v6, v7, v8, v9] = ABOUT_STYLE_FEATURE_SHADER_VARIANTS;

export const INTRODUCING_FLOAT_FEATURE_CARDS = [
  {
    id: "float-revenue-command",
    shaderVariant: v0,
    subheading: "One ledger for claims, collections, and clinic cash flow.",
    description:
      "Float surfaces open AR, pending denials, and expected reimbursements in a single view — so billing leads know where money is stuck before the month closes.",
  },
  {
    id: "float-payer-voice-agents",
    shaderVariant: v1,
    subheading: "Voice agents that stay on hold so your staff do not have to.",
    description:
      "Benefit checks, prior-auth status calls, and denial follow-ups run through Pulse-style voice agents trained on payer scripts. Outcomes land in the chart with timestamps and reference numbers.",
  },
  {
    id: "float-charge-capture",
    shaderVariant: v2,
    subheading: "Charge suggestions pulled from the visit, not a Friday spreadsheet.",
    description:
      "Float reads documentation, orders, and procedure context to propose codes, modifiers, and units before claims leave the building — with confidence cues when a human should confirm.",
  },
  {
    id: "float-denial-autopilot",
    shaderVariant: v3,
    subheading: "Denials sorted, appealed, and tracked to deadline.",
    description:
      "Rejections are categorized by root cause, paired with appeal templates, and queued for voice or fax follow-up. Nothing expires quietly in a payer portal.",
  },
  {
    id: "float-patient-balance-concierge",
    shaderVariant: v4,
    subheading: "Patient balance outreach that sounds like your front desk.",
    description:
      "Voice and text agents explain statements, offer payment plans, and capture card-on-file consent — escalating to staff only when tone or policy requires a human.",
  },
  {
    id: "float-eligibility-engine",
    shaderVariant: v5,
    subheading: "Coverage verified before the patient reaches the exam room.",
    description:
      "Real-time eligibility runs at scheduling and check-in, flagging inactive plans, referral requirements, and copay surprises while there is still time to adjust the visit plan.",
  },
  {
    id: "float-contract-intelligence",
    shaderVariant: v6,
    subheading: "See when payers pay less than your contract says they should.",
    description:
      "Float compares remittance against fee schedules and contracted rates, highlighting systematic underpayments so revenue teams can dispute with evidence instead of intuition.",
  },
  {
    id: "float-fabric-billing-flows",
    shaderVariant: v7,
    subheading: "Design billing agents in Fabric — deploy them through Float.",
    description:
      "Clinic ops teams compose collection scripts, escalation paths, and payer-specific playbooks in the agent builder, then publish them as live billing workflows without a vendor ticket.",
  },
  {
    id: "float-overhead-allocation",
    shaderVariant: v8,
    subheading: "Management fees allocated fairly across sites and service lines.",
    description:
      "Overhead, shared staffing, and corporate assessments distribute automatically using rules your finance team defines — with drill-down by provider, location, and specialty.",
  },
  {
    id: "float-audit-ledger",
    shaderVariant: v9,
    subheading: "Every AI touch tied to a claim, patient, and staff member.",
    description:
      "Calls, code suggestions, appeal drafts, and balance outreach write to an immutable audit trail linked to chart context — so compliance reviews take hours, not weeks.",
  },
] as const satisfies readonly AboutStyleFeatureCard[];
