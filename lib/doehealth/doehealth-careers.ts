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

/** Every role is remote and open to candidates in the US and Canada. */
export const CAREERS_LOCATION = "Remote (US or Canada)";
export const CAREERS_ELIGIBILITY = "Every role is fully remote and open to candidates in the US and Canada.";

export type CareersRole = {
  /** The role page lives at /careers/{slug}. */
  slug: string;
  title: string;
  section: CareersSection;
  team: CareersTeam;
  /** The pay range in CAD. Null when the role has no set range, and then no pay is shown. */
  pay: string | null;
  /** The equity range as a share of Doe, e.g. "0.5–1.0%". Null when offered without a set range. */
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

/** "What we offer" on every role page. */
export const CAREERS_OFFER: readonly { lead: string; text: string }[] = [
  { lead: "Remote", text: "Every role is fully remote. Work from anywhere in the US or Canada." },
  { lead: "Equity", text: "Every role comes with ownership in Doe." },
  { lead: "Time in Clinics", text: "Regular time in practices with the people who use what we build." },
  { lead: "Real Ownership", text: "Something of your own to run in your first month, on a team small enough to change the whole product." },
];

export const CAREERS_ROLES: readonly CareersRole[] = [
  {
    slug: "founding-full-stack-engineer",
    title: "Founding Product Engineer (Full-Stack)",
    section: "founding",
    team: "Engineering",
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
    slug: "agent-infrastructure-engineer",
    title: "Founding AI & Infrastructure Engineer (Full-Stack)",
    section: "founding",
    team: "Engineering",
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
    slug: "frontend-engineer-clinic-workspace",
    title: "Frontend Engineer, Clinic Workspace",
    section: "founding",
    team: "Engineering",
    pay: "CA$140K – CA$170K",
    equity: "0.4–0.75%",
    wave: { top: 0.43, amp: 60, phase: 1.5, scale: 1.0, slant: 0.3, flip: true },
    summary: "Build the screens clinic teams work in all day, fast and calm under pressure.",
    about: [
      "The clinic workspace is where front desks, providers, and billing teams see what their agents did and decide what happens next. You will build the interface they rely on, and make it feel clear on a busy morning.",
      "You will work from real clinic visits and real feedback, and ship changes often.",
    ],
    responsibilities: [
      "Build the clinic workspace in React and TypeScript, from design to production.",
      "Make dense, complex information easy to scan and act on.",
      "Work with designers on flows, and push back when a flow is too clever.",
      "Measure how staff use each screen, and improve what they struggle with.",
      "Keep the app accessible, quick on older hardware, and private by default.",
    ],
    qualifications: [
      "Three or more years building production web applications with React.",
      "Strong TypeScript and a clear eye for interface detail.",
      "Experience with data-heavy products, such as dashboards, inboxes, or schedules.",
      "Care for the people who use what you build all day.",
    ],
    bonus: [
      "Experience with healthcare or scheduling software.",
      "Experience building accessible interfaces to a high standard.",
      "Design systems experience.",
    ],
  },
  {
    slug: "backend-engineer-agent-platform",
    title: "Backend Engineer, Agent Platform",
    section: "founding",
    team: "Engineering",
    pay: "CA$150K – CA$180K",
    equity: "0.6–1.0%",
    wave: { top: 0.42, amp: 66, phase: 2.7, scale: 1.1, slant: -0.25 },
    summary: "Build the services that connect every clinic's agents to the patients who reach them.",
    about: [
      "Every call, message, and booking that an agent handles passes through services you will design and run. You will build the platform that routes those requests, keeps them consistent, and records what happened.",
      "You will own services from design through on-call, and work closely with the infrastructure and product teams.",
    ],
    responsibilities: [
      "Design and build the backend services behind agent conversations, bookings, and follow-ups.",
      "Model clinic data so every agent works from the same, correct picture.",
      "Build the queues, retries, and audit trails that keep requests reliable.",
      "Write the APIs the clinic workspace and integrations depend on.",
      "Carry your share of on-call, and make the next incident less likely.",
    ],
    qualifications: [
      "Three or more years building backend services in production.",
      "Strong skills in TypeScript, Python, or Go, and solid SQL and Postgres.",
      "Experience designing APIs, queues, and data models that others depend on.",
      "Comfort with ambiguity, and the habit of writing things down.",
    ],
    bonus: [
      "Experience with event-driven systems.",
      "Experience with healthcare data or audit-heavy products.",
      "Experience supporting LLM-based products in production.",
    ],
  },
  {
    slug: "founding-gtm-lead",
    title: "Founding GTM Lead",
    section: "founding",
    team: "Growth",
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
    slug: "health-data-integrations-engineer",
    title: "Health Data Integrations Engineer",
    section: "additional",
    team: "Engineering",
    pay: "CA$140K – CA$170K",
    equity: "0.3–0.6%",
    wave: { top: 0.46, amp: 70, phase: 3.1, scale: 1.15, slant: 0.2 },
    summary: "Connect Doe to the records, schedules, and payers clinics already rely on.",
    about: [
      "A clinic's agents are only as good as what they know. You will connect Doe to electronic health records, practice management systems, and payers, so agents work from the clinic's real schedule, patients, and coverage.",
      "You will turn messy, older interfaces into clean, dependable data that the rest of the team can build on.",
    ],
    responsibilities: [
      "Build and maintain integrations with EHR and practice management systems over FHIR, HL7, and vendor APIs.",
      "Design the data model that maps each system's records into Doe.",
      "Make syncs reliable: retries, reconciliation, and alerts when something drifts.",
      "Work with clinic staff during onboarding to connect their systems and confirm the data is right.",
      "Treat every record as protected health information from the first line of code.",
    ],
    qualifications: [
      "Three or more years building integrations or data pipelines in production.",
      "Working knowledge of FHIR, HL7 v2, or healthcare data standards.",
      "Strong backend skills in TypeScript, Python, or Go, and solid SQL.",
      "Patience with older systems and care for getting details right.",
    ],
    bonus: [
      "Experience with Epic, Athena, eClinicalWorks, or similar systems.",
      "Experience with eligibility checks, claims, or other payer data.",
      "Experience with Canadian EMRs.",
    ],
  },
  {
    slug: "security-engineer-health-data",
    title: "Security Engineer, Health Data",
    section: "additional",
    team: "Engineering",
    pay: "CA$160K – CA$190K",
    equity: "0.4–0.75%",
    wave: { top: 0.43, amp: 68, phase: 0.6, scale: 1.0, slant: -0.25 },
    summary: "Keep every patient's health data safe, as agents everywhere start to ask for it.",
    about: [
      "Clinics trust Doe with their patients' health information, and patients' personal agents trust Doe to speak for those clinics. You will own the security of that data across our product, infrastructure, and integrations.",
      "You will set how we protect health data under HIPAA in the US and PHIPA and PIPEDA in Canada, and build the controls that make it true in practice.",
    ],
    responsibilities: [
      "Own Doe's security program: threat models, reviews, and the roadmap to close what you find.",
      "Design how health data is encrypted, isolated per clinic, logged, and accessed.",
      "Build authentication and authorization for clinic staff, our agents, and outside agents calling in.",
      "Review integrations and vendors that touch protected health information.",
      "Lead incident response, and prepare the evidence for audits and customer security reviews.",
    ],
    qualifications: [
      "Five or more years in security engineering, with hands-on work in cloud infrastructure.",
      "Deep knowledge of application security, identity, and encryption.",
      "Experience protecting sensitive data under HIPAA, PHIPA, or similar rules.",
      "The ability to make the secure way the easy way for the rest of the team.",
    ],
    bonus: [
      "Experience leading SOC 2 or HITRUST work.",
      "Work on security for LLM-based systems, such as prompt injection and data leakage.",
      "Experience at a healthcare company.",
    ],
  },
  {
    slug: "software-engineer-clinic-tools",
    title: "Software Engineer, Clinic Tools",
    section: "additional",
    team: "Engineering",
    pay: "CA$130K – CA$165K",
    equity: "0.25–0.5%",
    wave: { top: 0.45, amp: 58, phase: 1.8, scale: 0.9, slant: 0.3, flip: true },
    summary: "Build the tools front desks open every morning, for clinics across Canada.",
    about: [
      "You will build the everyday tools clinic teams use alongside their agents: the inbox of calls and messages, the schedule, and the follow-ups agents hand back to staff.",
      "You will work closely with our clinics in Canada and the founders to make those tools fast, clear, and calm to use on a busy day.",
    ],
    responsibilities: [
      "Ship features across the clinic workspace, front end to back end.",
      "Make complex workflows simple: handoffs between agents and staff, scheduling, and patient follow-up.",
      "Join clinic visits and onboarding calls, and fix what you see get in the way.",
      "Write tests and keep the product quick and dependable.",
    ],
    qualifications: [
      "Three or more years building web products in production.",
      "Strong TypeScript and React, and comfort working on APIs and databases.",
      "Care for interface detail and for the people who use it all day.",
    ],
    bonus: [
      "Experience with healthcare or scheduling software.",
      "Familiarity with PHIPA or Canadian privacy rules.",
      "French language skills.",
    ],
  },
  {
    slug: "product-designer",
    title: "Product Designer",
    section: "additional",
    team: "Product",
    pay: "CA$120K – CA$150K",
    equity: "0.25–0.5%",
    wave: { top: 0.44, amp: 72, phase: 2.9, scale: 1.2, slant: -0.35 },
    summary: "Design how clinics see, trust, and steer the agents working for them.",
    about: [
      "Doe asks a new question of design: how does a clinic supervise agents that talk to its patients? You will design the answer, from the clinic workspace to how Doe looks to patients' personal agents.",
      "You will work directly with the founders, engineers, and the providers who review our work before it ships.",
    ],
    responsibilities: [
      "Own the design of the clinic workspace, end to end.",
      "Run research in clinics, and turn what you learn into flows, prototypes, and shipped product.",
      "Build and grow Doe's design system with engineering.",
      "Shape the brand across the product, the site, and the moments in between.",
    ],
    qualifications: [
      "Four or more years designing shipped software products.",
      "A portfolio showing complex workflows made simple.",
      "Strong interaction and visual craft, and comfort prototyping in code or high-fidelity tools.",
    ],
    bonus: [
      "Experience designing for healthcare or other professional tools.",
      "Experience designing AI products or conversational interfaces.",
      "Brand or motion design work.",
    ],
  },
  {
    slug: "product-manager-clinic-workflows",
    title: "Product Manager, Clinic Workflows",
    section: "additional",
    team: "Product",
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
    section: "additional",
    team: "GTM & Sales",
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
    slug: "clinic-partnerships-lead",
    title: "Clinic Partnerships Lead",
    section: "additional",
    team: "GTM & Sales",
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

/** The equity line for a role: its range, or "Offers Equity" when no range is set. */
export function careersEquityLabel(role: CareersRole) {
  return role.equity ? `${role.equity} Equity` : "Offers Equity";
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
