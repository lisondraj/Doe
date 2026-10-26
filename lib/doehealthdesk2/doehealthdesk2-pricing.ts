/** /pricing — practice shapes, specialties, the four tiers and what each includes, and how a practice's size is priced. */

export type PracticeShape = "solo" | "clinic" | "group";

/** The three ways a practice is set up: one provider, several at one location, or several locations. */
export const PRACTICE_SHAPES: { id: PracticeShape; title: string; note: string }[] = [
  { id: "solo", title: "Solo", note: "One provider" },
  { id: "clinic", title: "Single location", note: "Multiple providers" },
  { id: "group", title: "Multi-clinic", note: "Multiple locations" },
];

export type SpecialtyId = "concierge" | "aesthetic" | "fertility" | "homecare";

export const SPECIALTIES: { id: SpecialtyId; label: string }[] = [
  { id: "concierge", label: "Concierge" },
  { id: "aesthetic", label: "Aesthetics" },
  { id: "fertility", label: "Fertility" },
  { id: "homecare", label: "Home care" },
];

export type PlanId = "free" | "basic" | "advanced" | "one";

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
};

export const PLANS: Plan[] = [
  { id: "free", name: "Free", line: "Be found.", base: 0, perProvider: 0, perLocation: 0 },
  { id: "basic", name: "Basic", line: "Be reached and act on it.", base: 49, perProvider: 29, perLocation: 39 },
  { id: "advanced", name: "Advanced", line: "Automate and optimize.", base: 149, perProvider: 79, perLocation: 99 },
  { id: "one", name: "Doe One", line: "Run patient and appointment operations.", base: 349, perProvider: 149, perLocation: 199 },
];

export const PLAN_ORDER: PlanId[] = ["free", "basic", "advanced", "one"];

/** The first tier that includes the specialty feature sets. */
export const SPECIALTY_FROM: PlanId = "advanced";

/** A group of features, and the first tier that includes it (every tier above includes it too). */
export type FeatureGroup = { title: string; from: PlanId; items: string[] };

export const FEATURE_GROUPS: FeatureGroup[] = [
  {
    title: "Clinic profile",
    from: "free",
    items: [
      "Find and claim your clinic",
      "Edit services, providers, locations, hours, insurance, referral requirements",
      "Structured agent-readable profile",
      "Basic visibility and search analytics",
      "Verification badge",
    ],
  },
  {
    title: "Dynamic Index",
    from: "basic",
    items: ["Sync services, providers, hours, availability, pricing, requirements", "Integrate scheduling, PMS, EHR, and CRM systems"],
  },
  {
    title: "Doe Interface",
    from: "basic",
    items: ["Direct line between personal agents and your clinic", "Structured questions, replies, attachments, status updates", "Human handoff and routing"],
  },
  {
    title: "Offers",
    from: "basic",
    items: ["Publish promotions, openings, same-week availability, packages", "Personal agents surface relevant offers to patients"],
  },
  { title: "Analytics", from: "basic", items: ["Searches", "Inquiries", "Top services", "Missed requests", "Response times"] },
  { title: "Personal agents for staff", from: "advanced", items: ["Scheduling", "Referrals", "Intake", "Insurance", "Follow-ups", "Operational tasks"] },
  { title: "AI Insights", from: "advanced", items: ["Unmet demand", "Service trends", "Agent conversion", "Capacity gaps", "Offer recommendations", "Revenue attribution"] },
  {
    title: "Flow",
    from: "advanced",
    items: ["Read incoming forms automatically", "Extract and map fields", "Autofill outgoing documents", "Route forms automatically", "Flag missing information"],
  },
  {
    title: "Automations",
    from: "advanced",
    items: ["Rules in plain language", "Trigger, condition, action workflows", "Auto-reply, route, request info, book, notify staff, send forms"],
  },
  { title: "Advanced controls", from: "advanced", items: ["Agent permissions", "Human approval rules", "Workflow policies", "Multi-location management"] },
  { title: "Voice agents", from: "one", items: ["Answer every call, day and night", "Book, reschedule, and triage", "Hand off to staff live"] },
  { title: "White-glove onboarding", from: "one", items: ["Dedicated success manager", "Custom integrations", "Priority support"] },
];

/** Each specialty's own feature set, included from Advanced up. */
export const SPECIALTY_FEATURES: Record<SpecialtyId, string[]> = {
  concierge: [
    "Persistent line between patient agents and the care team",
    "Member preferences, preferred specialists, pharmacy, and labs",
    "Referral and diagnostic coordination",
    "Travel-care coordination",
    "Family and household authorization",
    "After-hours routing",
    "Outstanding follow-up dashboard",
  ],
  aesthetic: [
    "Treatment and device-specific discovery",
    "Real-time consultation and treatment availability",
    "Dynamic offers and cancellation slots",
    "Capacity optimization",
    "Treatment bundles and packages",
    "Pre-treatment intake and photos",
    "Aftercare automation",
    "Revenue attribution from agent to consult to treatment",
  ],
  fertility: [
    "Full fertility journey tracking",
    "Couple and partner coordination",
    "Testing and lab readiness",
    "Records collection",
    "Consent and document management",
    "Treatment milestone tracking",
    "Insurance, benefits, and financing workflows",
    "Cross-clinic and cross-border coordination",
  ],
  homecare: [
    "Structured care-request matching",
    "Geography and caregiver capacity",
    "Skills, language, and shift requirements",
    "Pre-service assessment",
    "Family-agent communication",
    "Caregiver and shift-gap workflows",
    "Qualified referral intake",
    "Start-of-care coordination",
    "Ongoing schedule and status updates",
  ],
};

export type Location = { id: string; name: string; providers: number };

/** A discount on extra seats, by how many the practice has in all. */
export type Bracket = { min: number; max: number; off: number };

/** Extra providers cost less the more a practice has. */
export const PROVIDER_BRACKETS: Bracket[] = [
  { min: 1, max: 4, off: 0 },
  { min: 5, max: 9, off: 0.1 },
  { min: 10, max: 24, off: 0.15 },
  { min: 25, max: Infinity, off: 0.2 },
];

/** Extra locations cost less the more a practice has. */
export const LOCATION_BRACKETS: Bracket[] = [
  { min: 1, max: 1, off: 0 },
  { min: 2, max: 4, off: 0.1 },
  { min: 5, max: 9, off: 0.15 },
  { min: 10, max: Infinity, off: 0.2 },
];

export const bracketFor = (brackets: Bracket[], n: number) => brackets.find((b) => n >= b.min && n <= b.max) ?? brackets[brackets.length - 1]!;

export const bracketLabel = (b: Bracket) => (b.max === Infinity ? `${b.min}+` : b.min === b.max ? `${b.min}` : `${b.min}–${b.max}`);

/** What a plan costs each month for a practice of this size, with volume discounts, before any annual discount. */
export function monthlyPrice(plan: Plan, providers: number, locations: number) {
  const extraProviders = Math.max(0, providers - 1);
  const extraLocations = Math.max(0, locations - 1);
  const providerBracket = bracketFor(PROVIDER_BRACKETS, providers);
  const locationBracket = bracketFor(LOCATION_BRACKETS, locations);
  const providersGross = extraProviders * plan.perProvider;
  const locationsGross = extraLocations * plan.perLocation;
  const providerDiscount = providersGross * providerBracket.off;
  const locationDiscount = locationsGross * locationBracket.off;
  return {
    base: plan.base,
    extraProviders,
    extraLocations,
    providersGross,
    locationsGross,
    providerBracket,
    locationBracket,
    providerDiscount,
    locationDiscount,
    total: plan.base + providersGross + locationsGross - providerDiscount - locationDiscount,
  };
}

/** Part of a practice on one plan: a location (multi-clinic) or a group of providers (one location). */
export type PriceRow = { id: string; name: string; providers: number; plan: Plan; location: boolean };

/**
 * A practice whose locations or providers are on different plans. The highest plan's base covers its first provider
 * and location; every other provider and location is added at its own plan's rate, and the volume discounts follow
 * the practice's totals. With every row on one plan this equals {@link monthlyPrice}.
 */
export function mixedPrice(rows: PriceRow[]) {
  const live = rows.filter((r) => r.providers > 0);
  const top = live.reduce<Plan>((best, r) => (PLAN_ORDER.indexOf(r.plan.id) > PLAN_ORDER.indexOf(best.id) ? r.plan : best), PLANS[0]!);
  const providers = live.reduce((n, r) => n + r.providers, 0);
  const locations = Math.max(1, live.filter((r) => r.location).length);
  const hasLocations = live.some((r) => r.location);
  const rowGross = live.map((r) => ({ row: r, providers: r.providers * r.plan.perProvider, location: r.location ? r.plan.perLocation : 0 }));
  const providersGross = Math.max(0, rowGross.reduce((n, g) => n + g.providers, 0) - top.perProvider);
  const locationsGross = hasLocations ? Math.max(0, rowGross.reduce((n, g) => n + g.location, 0) - top.perLocation) : 0;
  const providerBracket = bracketFor(PROVIDER_BRACKETS, providers);
  const locationBracket = bracketFor(LOCATION_BRACKETS, locations);
  const providerDiscount = providersGross * providerBracket.off;
  const locationDiscount = locationsGross * locationBracket.off;
  return {
    top,
    providers,
    locations,
    rowGross,
    included: top.perProvider + (hasLocations ? top.perLocation : 0),
    providerBracket,
    locationBracket,
    providerDiscount,
    locationDiscount,
    total: top.base + providersGross + locationsGross - providerDiscount - locationDiscount,
  };
}

/** Paying yearly gives two months free. */
export const ANNUAL_FACTOR = 10 / 12;

export const PRICING_FAQ = [
  { q: "Can I start for free?", a: "Yes. Claiming your clinic and keeping its profile up to date costs nothing." },
  {
    q: "How is the price worked out?",
    a: "Prices start at one provider and one location. Each extra provider and location adds a set amount, and larger practices get a volume discount on those extras.",
  },
  { q: "Is a BAA included?", a: "Yes. A signed BAA, encryption in transit and at rest, and access controls for your team come standard." },
  { q: "Can I change plans later?", a: "Any time. Upgrades take effect right away, and downgrades at the end of your billing period." },
  { q: "Do patients pay anything?", a: "No. Patients and their personal agents reach your clinic for free." },
];
