/** /pricing — practice shapes, specialties and their services, plans, and how a configuration is priced. */

export type PracticeShape = "solo" | "clinic" | "group";

export const PRACTICE_SHAPES: { id: PracticeShape; title: string; note: string }[] = [
  { id: "solo", title: "Solo provider", note: "One provider, one location" },
  { id: "clinic", title: "Single clinic", note: "A provider group at one location" },
  { id: "group", title: "Multi-clinic group", note: "Several locations, each with its own team" },
];

export type SpecialtyId = "concierge" | "aesthetic" | "fertility" | "homecare" | "primary" | "dental";

/** Each specialty's services, so a provider picks from what fits their practice. */
export const SPECIALTIES: { id: SpecialtyId; label: string; services: string[] }[] = [
  {
    id: "concierge",
    label: "Concierge",
    services: ["Primary care", "Same-day visits", "Preventive care", "Care coordination", "Travel medicine", "Executive health", "Specialist coordination"],
  },
  {
    id: "aesthetic",
    label: "Aesthetics",
    services: ["Botox / neuromodulators", "Fillers", "Laser", "Microneedling", "Skin treatments", "Body contouring", "Cosmetic consultations"],
  },
  {
    id: "fertility",
    label: "Fertility",
    services: ["Initial consultation", "IVF", "IUI", "Fertility testing", "Ultrasound monitoring", "Egg freezing", "Male fertility", "Donor / partner services"],
  },
  {
    id: "homecare",
    label: "Home care",
    services: ["Personal support", "Nursing", "Dementia care", "Overnight care", "Respite", "Medication assistance", "Post-discharge care", "Companion care"],
  },
  {
    id: "primary",
    label: "Primary care",
    services: ["Annual physicals", "Sick visits", "Chronic care", "Vaccines", "Labs", "Telehealth"],
  },
  {
    id: "dental",
    label: "Dental",
    services: ["Cleanings", "Exams and X-rays", "Fillings", "Crowns", "Implants", "Whitening", "Orthodontics"],
  },
];

export const APPOINTMENT_TYPES = ["In person", "Virtual", "Home visit", "Phone"];
export const PAYMENT_OPTIONS = ["Self-pay", "Major insurers", "Medicare", "HSA / FSA", "Membership", "Financing"];
export const REFERRAL_OPTIONS = [
  { id: "none", label: "Not needed" },
  { id: "some", label: "Some services" },
  { id: "all", label: "Always" },
] as const;
export const AVAILABILITY_SOURCES = [
  { id: "ehr", label: "EHR calendar" },
  { id: "google", label: "Google Calendar" },
  { id: "doe", label: "Doe calendar" },
  { id: "manual", label: "Set by hand" },
] as const;

export type PlanId = "basic" | "advanced" | "one";

export type Plan = {
  id: PlanId;
  name: string;
  line: string;
  /** Monthly price for one provider at one location. */
  base: number;
  /** Added each month for every provider past the first. */
  perProvider: number;
  /** Added each month for every location past the first. */
  perLocation: number;
  includes?: string;
  features: { title: string; items: string[] }[];
};

export const PLANS: Plan[] = [
  {
    id: "basic",
    name: "Basic",
    line: "Connect your clinic to personal agents.",
    base: 49,
    perProvider: 29,
    perLocation: 39,
    features: [
      {
        title: "Dynamic Index",
        items: ["Clinic software integrations", "Live providers", "Services", "Locations", "Hours", "Availability", "Pricing where appropriate", "Insurance and payment information", "Referral and patient requirements"],
      },
      { title: "Doe Interface", items: ["Direct line between personal agents and your clinic", "Structured agent inquiries", "Attachments", "Status updates", "Human handoff"] },
      { title: "Offers", items: ["Offers personal agents can surface", "Same-week openings", "New-patient offers", "Packages", "Promotions", "Cancellation availability"] },
      { title: "Agent permissions", items: ["Control what agents can see", "Control what they can request", "Restrict actions"] },
      { title: "Analytics", items: ["Agent searches", "Clinic views", "Requests", "Top services", "Response times"] },
    ],
  },
  {
    id: "advanced",
    name: "Advanced",
    line: "Automate and optimize your practice.",
    base: 149,
    perProvider: 79,
    perLocation: 99,
    includes: "Everything in Basic, plus",
    features: [
      { title: "Personal agents for your staff", items: ["Scheduling", "Intake", "Referrals", "Insurance workflows", "Follow-ups", "Administrative tasks"] },
      { title: "AI Insights", items: ["Agent demand", "Unmet demand", "Capacity gaps", "Service trends", "Offer recommendations", "Conversion analytics", "Revenue attribution"] },
      { title: "Flow", items: ["Read incoming forms and documents", "Extract information", "Autofill outgoing forms", "Route documents", "Flag missing information"] },
      {
        title: "Automations",
        items: ["Workflow rules in plain language", "Trigger, condition, action", "Auto-reply", "Route requests", "Request missing information", "Send forms", "Notify staff", "Trigger intake", "Book where permitted"],
      },
      { title: "Advanced permissions and policies", items: ["Per-agent and per-service rules", "Approval chains", "Audit history"] },
      { title: "Advanced analytics", items: ["Cohorts", "Funnels by service and location", "Exports"] },
    ],
  },
  {
    id: "one",
    name: "Doe One",
    line: "AI-powered patient and appointment operations.",
    base: 349,
    perProvider: 149,
    perLocation: 199,
    includes: "Everything in Advanced, plus",
    features: [
      { title: "Voice agents", items: ["Answer every call, day and night", "Book, reschedule, and triage", "Hand off to staff live"] },
      { title: "Appointment operations", items: ["Fill cancellations automatically", "Waitlists across locations", "Reminders and no-show recovery"] },
      { title: "Payments and prior auth", items: ["Collect through patients' agents", "Draft and file prior auth", "Payment plans"] },
      { title: "Team and multi-location controls", items: ["Roles for every staff member", "Coverage and handoffs", "Location-level policies"] },
      { title: "White-glove onboarding", items: ["Dedicated success manager", "Custom integrations", "Priority support"] },
    ],
  },
];

export type Location = { id: string; name: string; providers: number };

/** What a plan costs each month for a practice of this size, before any annual discount. */
export function monthlyPrice(plan: Plan, providers: number, locations: number) {
  const extraProviders = Math.max(0, providers - 1);
  const extraLocations = Math.max(0, locations - 1);
  return {
    base: plan.base,
    providers: extraProviders * plan.perProvider,
    locations: extraLocations * plan.perLocation,
    total: plan.base + extraProviders * plan.perProvider + extraLocations * plan.perLocation,
    extraProviders,
    extraLocations,
  };
}

/** Paying yearly gives two months free. */
export const ANNUAL_FACTOR = 10 / 12;

export const PRICING_FAQ = [
  {
    q: "How is the price worked out?",
    a: "Every plan starts at one provider and one location. Each extra provider and each extra location adds a set amount, shown in your summary as you build.",
  },
  { q: "Is a BAA included?", a: "Yes. Every plan includes a signed BAA, encryption in transit and at rest, and access controls for your team." },
  { q: "Can I change plans later?", a: "Any time. Upgrades take effect right away, and downgrades at the end of your billing period." },
  { q: "How long does setup take?", a: "Most practices have their Index live within two days. We connect your scheduling software and confirm each provider with you." },
  { q: "Do patients pay anything?", a: "No. Patients and their personal agents reach your clinic for free." },
];
