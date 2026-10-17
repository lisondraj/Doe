import type { DoeHealthBlogPlaceholderTone, DoeHealthBlogWave } from "@/lib/doehealth/doehealth-blog-articles";

export const CAREERS_PATH = "/careers";
export const CAREERS_APPLY_EMAIL = "james@doe.care";

export type CareersTeamSection = {
  title: string;
  body: string;
  tone: DoeHealthBlogPlaceholderTone;
  wave?: DoeHealthBlogWave;
};

export const CAREERS_TEAMS = ["Engineering", "Product", "Growth", "GTM & Sales", "Open Application"] as const;
export type CareersTeam = (typeof CAREERS_TEAMS)[number];

/** Founding roles list first on /careers; additional roles follow them, in the same style. */
export type CareersSection = "founding" | "additional";

/** The countries a role is open to. Every role is remote; each lists the countries it can be done from. */
export const CAREERS_COUNTRIES = ["US", "Canada"] as const;
export type CareersCountry = (typeof CAREERS_COUNTRIES)[number];

/** The label when a role is open to both countries. */
export const CAREERS_LOCATION = "Remote (US or Canada)";

export type CareersRole = {
  /** The role page lives at /careers/{slug}. */
  slug: string;
  title: string;
  section: CareersSection;
  team: CareersTeam;
  /** The countries the role is open to, for the location filter and the location line. */
  countries: readonly CareersCountry[];
  /** The pay range in CAD. Null when the role has no set range, and then no pay is shown. */
  pay: string | null;
  /** The equity range as a share of Doe, e.g. "0.5–1.0%". Null when the role offers no equity. */
  equity: string | null;
  /** The wave shape of the dot-wave box at the top of the role page. */
  wave: DoeHealthBlogWave;
  /** One line, set inside the dot-wave box. */
  summary: string;
  /** "The role": a short paragraph or two. */
  about: readonly string[];
  responsibilities: readonly string[];
  qualifications: readonly string[];
  bonus: readonly string[];
};

export const CAREERS_TEAM_SECTIONS: readonly CareersTeamSection[] = [
  {
    title: "A Small Team Close to Clinics",
    body: "We spend time in practices every week. The people building Doe sit with front desks, providers, and billing teams, and the work starts from what we see there.",
    tone: "cream",
    wave: { top: 0.42, amp: 80, phase: 1.4, scale: 1.1, slant: 0.4 },
  },
  {
    title: "Providers in the Room",
    body: "Doctors review what we design before it ships. Engineers, designers, and clinicians work on the same problems at the same table, not in a handoff.",
    tone: "clay",
    wave: { top: 0.46, amp: 60, phase: 2.6, scale: 0.9, slant: -0.4, flip: true },
  },
  {
    title: "Ownership from Day One",
    body: "Everyone owns something real in their first month. We keep the team small so each person can see the whole product and change it.",
    tone: "gold",
    wave: { top: 0.4, amp: 70, phase: 3.8, scale: 1.25, slant: 0.2 },
  },
];

/** "About Doe" on every role page. */
export const CAREERS_ABOUT_DOE: readonly string[] = [
  "Patients are starting to reach clinics through their own personal AI agents: to find a provider, book a visit, ask about coverage, or check on a result. Doe is the intelligent platform that connects clinics to those agents.",
  "Each practice gets its own intelligence model, trained on how that clinic actually runs, and agents that answer, schedule, and follow up on its behalf. We are a small team of engineers, designers, and clinicians building it together.",
];

/** Doe One, the benefits package on every role page. */
export const CAREERS_BENEFITS_NAME = "Doe One";
export const CAREERS_BENEFITS_LEDE = "The most competitive benefits package among Toronto startups.";

/** In `detail`, text wrapped in ** is set in bold. */
export const CAREERS_BENEFITS: readonly { benefit: string; detail: string }[] = [
  { benefit: "Extended health, dental & vision", detail: "100% employer-paid premium plan" },
  { benefit: "Mental health", detail: "**C$2,000/year**" },
  { benefit: "Gym / fitness", detail: "**C$100/month** fitness membership allowance" },
  { benefit: "WHOOP", detail: "Device + membership covered" },
  { benefit: "Superpower", detail: "Membership covered" },
  { benefit: "Dialogue Health", detail: "Virtual healthcare access" },
  { benefit: "Preventive health / labs", detail: "**C$500–1,000/year**" },
  { benefit: "Home-office setup", detail: "**C$2,000** initial allowance" },
  { benefit: "Internet + phone", detail: "**C$150/month**" },
  { benefit: "Conference, travel & learning", detail: "**C$1,500/year**" },
  { benefit: "Team retreats / offsites", detail: "**2× annually**, company-paid" },
  { benefit: "Vacation", detail: "**4 weeks**" },
  { benefit: "Sick / personal days", detail: "Flexible" },
  { benefit: "Parental leave", detail: "Top-up policy" },
  { benefit: "Equipment", detail: "Top-Spec MacBook Pro" },
];

export const CAREERS_ROLES: readonly CareersRole[] = [
  {
    slug: "agent-infrastructure-engineer",
    title: "Founding AI & Infrastructure Engineer (Full-Stack)",
    section: "founding",
    team: "Engineering",
    countries: ["US", "Canada"],
    pay: "CA$160K – CA$190K",
    equity: "0.75–1.25%",
    wave: { top: 0.42, amp: 64, phase: 2.2, scale: 0.95, slant: -0.3, flip: true },
    summary: "Run the agents that answer every clinic's calls, around the clock.",
    about: [
      "Doe's agents pick up the phone, book visits, and talk to patients' personal agents on behalf of each clinic. You will build the systems that run them: fast, reliable, and observable.",
      "You will own the path from a patient's first word to the clinic's record, and make it hold up at scale.",
    ],
    responsibilities: [
      "Build and operate the runtime for voice and text agents: orchestration, tool calls, memory, and retries.",
      "Bring latency down and reliability up across speech, model, and telephony providers.",
      "Build evaluation and monitoring so every agent change is measured before and after it ships.",
      "Design how each clinic's intelligence model is trained, versioned, and served.",
      "Own incidents end to end, and make sure they do not happen twice.",
    ],
    qualifications: [
      "Four or more years building distributed systems or production infrastructure.",
      "Hands-on experience shipping LLM-based systems to real users.",
      "Strong fundamentals in Python or TypeScript, queues, and cloud infrastructure.",
      "The judgment to make systems simple before making them clever.",
    ],
    bonus: [
      "Experience with real-time voice, telephony, or WebRTC.",
      "Work on evaluation frameworks for language models.",
      "Experience in a regulated industry.",
    ],
  },
  {
    slug: "founding-full-stack-engineer",
    title: "Founding Product Engineer (Full-Stack)",
    section: "founding",
    team: "Engineering",
    countries: ["US", "Canada"],
    pay: "CA$150K – CA$180K",
    equity: "0.5–1.0%",
    wave: { top: 0.44, amp: 76, phase: 1.1, scale: 1.05, slant: 0.35 },
    summary: "Build the product clinics use every day, from the first screen to the database.",
    about: [
      "You will be one of the first engineers at Doe. You will ship the surfaces front desks, providers, and practice owners use to see and steer their agents, and the services behind them.",
      "There is no spec waiting for you. You will sit with clinic teams, decide what to build with the founders, and own it in production.",
    ],
    responsibilities: [
      "Design and ship features across our Next.js front end, APIs, and Postgres data model.",
      "Build the clinic workspace: call reviews, schedules, follow-ups, and the controls that tune each clinic's agents.",
      "Visit practices, watch the work happen, and turn what you see into product.",
      "Set the engineering habits the team grows into: code review, testing, and on-call.",
      "Keep patient data private by default in everything you build.",
    ],
    qualifications: [
      "Five or more years shipping production web software end to end.",
      "Strong TypeScript and React, and comfort with SQL and backend services.",
      "A record of owning products from idea to launch with little direction.",
      "Clear writing, and care for the people who use what you build.",
    ],
    bonus: [
      "Experience at an early-stage startup, or as a founder.",
      "Work on healthcare software or other regulated products.",
      "Experience building products on top of LLMs.",
    ],
  },
  {
    slug: "founding-gtm-lead",
    title: "Founding GTM Lead",
    section: "founding",
    team: "Growth",
    countries: ["US", "Canada"],
    pay: "CA$100K – CA$120K",
    equity: "0.5–1.0%",
    wave: { top: 0.44, amp: 70, phase: 0.4, scale: 1.0, slant: 0.35, flip: true },
    summary: "Own how Doe reaches clinics, from the first conversation to the first live agent.",
    about: [
      "You will be Doe's first go-to-market leader. You will decide which clinics to reach first, what we say to them, and how we measure whether it works.",
      "You will work across sales, marketing, and partnerships, and bring what clinics tell you straight into the product.",
    ],
    responsibilities: [
      "Build Doe's go-to-market plan: who we target, how we reach them, and what it costs.",
      "Run early outbound, events, and referral programs, and learn what converts.",
      "Hire and shape the sales and growth team as it forms.",
      "Set the messaging, pricing conversations, and proof points clinics need to say yes.",
      "Report on the funnel honestly, and change course when the numbers say to.",
    ],
    qualifications: [
      "Five or more years in go-to-market roles at B2B software companies.",
      "A record of building a pipeline from nothing, ideally at an early-stage company.",
      "Comfort with data, and the discipline to test before you scale.",
      "Clear writing and the ability to explain a complex product plainly.",
    ],
    bonus: [
      "Experience selling into healthcare practices or health systems.",
      "Experience building growth programs for AI products.",
      "Experience hiring and leading a first sales team.",
    ],
  },
  {
    slug: "product-manager-clinic-workflows",
    title: "Product Manager, Clinic Workflows",
    section: "additional",
    team: "Product",
    countries: ["US", "Canada"],
    pay: "CA$140K – CA$170K",
    equity: "0.3–0.6%",
    wave: { top: 0.41, amp: 66, phase: 3.6, scale: 1.0, slant: 0.25, flip: true },
    summary: "Decide what Doe's agents should do for a clinic, and in what order.",
    about: [
      "Every clinic runs a little differently. You will learn how they work, from intake and scheduling to referrals and billing, and decide which workflows Doe's agents take on next.",
      "You will work with engineering, design, and our clinician advisors to take each workflow from a clinic visit to something agents do well every day.",
    ],
    responsibilities: [
      "Spend time in clinics, map how their work really happens, and find where agents help most.",
      "Write clear specs and set the roadmap for clinic workflows with the founders.",
      "Define how we measure success for each workflow, and hold the product to it.",
      "Work with customers during rollout and bring what you learn back to the team.",
    ],
    qualifications: [
      "Four or more years in product management, with products you can point to.",
      "Comfort with technical detail, and the ability to work closely with engineers.",
      "Excellent written communication.",
    ],
    bonus: [
      "Experience in healthcare operations, revenue cycle, or practice management.",
      "Experience shipping AI or automation products.",
      "A clinical background.",
    ],
  },
  {
    slug: "founding-account-executive",
    title: "Founding Account Executive",
    section: "founding",
    team: "GTM & Sales",
    countries: ["US", "Canada"],
    pay: "CA$90K – CA$110K + commission",
    equity: "0.25–0.5%",
    wave: { top: 0.43, amp: 74, phase: 0.9, scale: 1.1, slant: -0.2 },
    summary: "Bring Doe to clinics, and help write how we sell it.",
    about: [
      "You will be the first account executive at Doe. You will own deals with independent practices and multi-site groups, from the first call to signature.",
      "You will work directly with the founders to shape our pitch, pricing, and process as we grow.",
    ],
    responsibilities: [
      "Run the full sales cycle: prospecting, discovery, demos, and closing.",
      "Learn each clinic's workflows and show how Doe's agents fit them.",
      "Build the playbook, the pipeline, and the tools the team after you will use.",
      "Bring what you hear from clinics back to product.",
    ],
    qualifications: [
      "Three or more years closing B2B software deals.",
      "A record of beating quota, ideally at an early-stage company.",
      "Comfort explaining technical products to non-technical buyers.",
    ],
    bonus: [
      "Experience selling to healthcare practices.",
      "Experience selling AI products.",
      "A network among clinic owners and practice managers.",
    ],
  },
  {
    slug: "founding-account-executive-multi-clinic",
    title: "Founding Account Executive, Multi-Clinic",
    section: "founding",
    team: "GTM & Sales",
    countries: ["US", "Canada"],
    pay: "CA$90K – CA$110K + commission",
    equity: "0.25–0.5%",
    wave: { top: 0.46, amp: 66, phase: 1.6, scale: 1.05, slant: 0.25, flip: true },
    summary: "Win the clinic groups and multi-site practices that bring Doe to every location.",
    about: [
      "You will own deals with clinic groups and multi-site practices, where one decision can bring Doe to dozens of locations. You will map how each group buys, bring in the right people, and close.",
      "You will work with the founders and the GTM lead to shape how we sell to groups, and bring what you learn back to product.",
    ],
    responsibilities: [
      "Run the full sales cycle for multi-site groups, from first meeting to rollout across locations.",
      "Map each group's decision makers, from owners and operators to IT and compliance.",
      "Build the proposals, pilots, and rollout plans that move groups to yes.",
      "Feed what groups ask for back to product and the GTM lead.",
    ],
    qualifications: [
      "Three or more years closing enterprise or multi-site B2B software deals.",
      "A record of working long sales cycles with several buyers at once.",
      "Comfort explaining technical products to operators and executives.",
    ],
    bonus: [
      "Experience selling to healthcare groups or health systems.",
      "Experience selling AI products.",
      "A network among clinic group leaders.",
    ],
  },
  {
    slug: "clinic-partnerships-lead",
    title: "Clinic Partnerships Lead",
    section: "additional",
    team: "GTM & Sales",
    countries: ["US", "Canada"],
    pay: "CA$95K – CA$120K",
    equity: "0.25–0.5%",
    wave: { top: 0.45, amp: 62, phase: 2.4, scale: 0.95, slant: 0.3, flip: true },
    summary: "Build Doe's relationships with clinics and clinic groups across Canada.",
    about: [
      "You will lead our partnerships with clinics, clinic networks, and health organizations in Canada, and open the doors that bring Doe to more practices.",
      "You will work with the founders and product team to make every partnership a good fit for the clinics and their patients.",
    ],
    responsibilities: [
      "Find, build, and grow partnerships with clinic groups, associations, and health organizations.",
      "Lead pilots with partner clinics from kickoff to results.",
      "Represent Doe at events and in the communities where clinics gather.",
      "Bring what partners need back to the team, and make sure we deliver it.",
    ],
    qualifications: [
      "Four or more years in partnerships, business development, or sales.",
      "Relationships in Canadian healthcare.",
      "Clear communication with clinicians, operators, and executives alike.",
    ],
    bonus: [
      "Experience with provincial health systems.",
      "French language skills.",
      "Experience launching a new product category.",
    ],
  },
  {
    slug: "customer-success-manager",
    title: "Customer Success Manager",
    section: "additional",
    team: "GTM & Sales",
    countries: ["US", "Canada"],
    pay: "CA$80K – CA$100K",
    equity: "0.15–0.3%",
    wave: { top: 0.42, amp: 70, phase: 3.3, scale: 1.05, slant: -0.3 },
    summary: "Make sure every clinic gets real results from its agents.",
    about: [
      "You will onboard new clinics, set up their agents with them, and stay with them as they grow. You will be the person they call, and the voice of clinics inside Doe.",
      "You will work with engineering and product to turn what clinics need into a better Doe.",
    ],
    responsibilities: [
      "Onboard clinics: connect their systems, set up their agents, and train their teams.",
      "Track how each clinic's agents perform, and help them get more from Doe.",
      "Answer questions and solve problems quickly, and escalate what needs engineering.",
      "Turn patterns across clinics into feedback product can act on.",
    ],
    qualifications: [
      "Two or more years in customer success, account management, or clinic operations.",
      "Comfort with software, and patience teaching it to others.",
      "Organized, responsive, and calm when things go wrong.",
    ],
    bonus: [
      "Experience working in or with medical practices.",
      "Experience supporting AI or automation products.",
      "Spanish language skills.",
    ],
  },
  {
    slug: "expression-of-interest",
    title: "Expression of Interest",
    section: "additional",
    team: "Open Application",
    countries: ["US", "Canada"],
    pay: null,
    equity: null,
    wave: { top: 0.5, amp: 56, phase: 4.2, scale: 1.0, slant: 0.15, flip: true },
    summary: "Not sure where you fit? Tell us what you would build, and we will find the role.",
    about: [
      "This is an open application. Tell us the work you do best and the clinics you want to help, and we will look for a fit as Doe grows.",
      "Roles change quickly at a company this early. A strong profile can turn into a role we had not planned for, so send it even if no listing matches you today.",
    ],
    responsibilities: [
      "Work on the part of Doe that matches your strengths, as the team's needs take shape.",
      "Take on work across the product, clinic onboarding, or go-to-market, wherever we need you most.",
      "Help shape the roles we hire for next, from the inside.",
    ],
    qualifications: [
      "Experience doing hard work well, in software, clinical operations, sales, design, or a field close to Doe.",
      "Clear writing, and a short note on what you would build or improve at Doe.",
      "Interest in patients, clinics, and how AI agents can help them.",
    ],
    bonus: [
      "Experience working in or with medical practices.",
      "Experience with AI or automation products.",
    ],
  },
];

export function careersRolePath(role: CareersRole) {
  return `${CAREERS_PATH}/${role.slug}`;
}

/** The location line for a role: both countries, or the one it is open to. */
export function careersLocation(role: CareersRole) {
  if (role.countries.length === CAREERS_COUNTRIES.length) return CAREERS_LOCATION;
  return `Remote (${role.countries.join(" or ")})`;
}

/** The equity line for a role, or null when the role offers no equity. */
export function careersEquityLabel(role: CareersRole) {
  return role.equity ? `${role.equity} Equity` : null;
}

export function careersRole(slug: string) {
  return CAREERS_ROLES.find((role) => role.slug === slug);
}

/** Up to `count` other roles for the bottom of a role page: the same team first, then the rest in list order. */
export function careersOtherRoles(role: CareersRole, count = 3) {
  const others = CAREERS_ROLES.filter((other) => other.slug !== role.slug);
  return [...others.filter((other) => other.team === role.team), ...others.filter((other) => other.team !== role.team)].slice(
    0,
    count,
  );
}
