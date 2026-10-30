/**
 * /jobs role text: the /careers roles rewritten around what Doe is building, as /earlypreview lays it out. The Doe Index
 * (every provider, readable by agents), Doe Auth (patients verified, agents acting on signed grants), the Doe Interface
 * (a direct line between personal agents and clinics), the Doe Engine (well-known files, MCP and an API), and the clinic
 * product on top: the Dynamic Index, document exchange, agent access, voice agents, the scribe and staff agents. Toronto
 * first with U.S. test sites in parallel; aesthetics, orthopaedics & MSK, dentistry and concierge first; PHIPA and
 * HIPAA cleared step by step, SOC 2 under way. /careers keeps its own text.
 */

import type { CareersRole } from "@/lib/doehealth/doehealth-careers";

type RoleText = Pick<CareersRole, "summary" | "about" | "responsibilities" | "qualifications" | "bonus">;

/** "About Doe" on every /jobs role. */
export const JOBS_ABOUT_DOE: readonly string[] = [
  "Personal agents are here, and patients have started sending them to find care, book it and ask about it. Healthcare isn't ready: most clinics can't be read, reached or booked by an agent, and none of them can tell which agent speaks for which patient.",
  "Doe is the layer in between. The Doe Index makes every provider readable by agents, Doe Auth verifies patients and lets their agents act on signed, time-limited grants, and the Doe Interface gives each clinic a direct line agents can ask, book and send documents through. On top of it, clinics get the tools to run that new front door: a profile that stays live, agent access controls, voice agents, a scribe and agents for their staff.",
  "We're proving it in Toronto with U.S. test sites in parallel, starting with aesthetics, orthopaedics & MSK, dentistry and concierge practices, and clearing PHIPA and HIPAA as we go.",
];

const SPRING_2027 = [
  "Enrolled in a university or college program in Canada or the US, and returning to school after the term.",
  "Available full time, remotely, for the Spring 2027 term, May through August.",
] as const;

export const JOBS_ROLE_TEXT: Record<string, RoleText> = {
  "agent-infrastructure-engineer": {
    summary: "Build the protocol layer between patients' personal agents and every clinic they reach.",
    about: [
      "Every request a personal agent sends to a clinic crosses Doe: it finds the provider in the Index, proves who it speaks for through Auth, and lands in the clinic's Interface as a structured request the clinic, or its own agents, can act on. You will build that path end to end.",
      "You will own the agent runtime, the Doe Engine that publishes each clinic to agents (well-known files, MCP and the API), the LLM routing behind our voice and text agents, and the evaluations that tell us a change made things better before it ships.",
    ],
    responsibilities: [
      "Design and build the Doe Engine: the well-known files, MCP servers and public API that make each clinic discoverable and actionable by any personal agent.",
      "Build the Interface runtime: structured requests (book, reschedule, refill, prep and billing questions) with orchestration, tool calls, retries and an audit trail on every step.",
      "Build the LLM router that sends each request to the right model for its difficulty and cost, and the evaluations that keep it honest.",
      "Run voice and text agents in production: speech, telephony, latency and failover across model providers.",
      "Build the sandbox where agent developers test against Doe before they touch a real clinic.",
      "Instrument everything: traces, evals and dashboards, so every agent change is measured before and after it ships.",
      "Own incidents end to end, and make sure they don't happen twice.",
    ],
    qualifications: [
      "4+ years building distributed systems or production infrastructure.",
      "Hands-on experience shipping LLM or agent systems to real users: tool calling, structured output, evaluation.",
      "Strong TypeScript or Python, queues, Postgres and cloud infrastructure.",
      "Experience designing APIs other developers build on.",
      "The judgment to make systems simple before making them clever.",
    ],
    bonus: [
      "Experience with MCP, agent frameworks or agent-to-agent protocols.",
      "Real-time voice, telephony or WebRTC.",
      "Work on model routing, eval frameworks or LLM observability.",
      "Healthcare data (FHIR, HL7) or another regulated industry.",
    ],
  },
  "founding-full-stack-engineer": {
    summary: "Build the clinic side of Doe: the profile, inbox and controls a practice uses to run its agent front door.",
    about: [
      "When a clinic claims its page in the Doe Index, it gets a product: a profile that stays live, an Interface inbox where agents' requests arrive structured, controls over what agents may do, and the tools that act on it, from forms and referrals to offers, payments and insights.",
      "You will be one of Doe's first engineers and own large parts of it, from the first screen to the Postgres model, shipping weekly to the practices we work with in Toronto and our U.S. test sites.",
    ],
    responsibilities: [
      "Build the claim flow and the clinic profile: services, providers, locations, hours and prices, edited by typing and published to agents in real time.",
      "Build the Interface inbox: each agent request and the clinic's answer side by side, with replies, handoffs and resolution.",
      "Build Agent Access: Open, Balanced and Cautious presets and per-service rules for what agents may book, request or see.",
      "Ship the workflows on top: scheduling, forms, document exchange, referrals, offers, payments and analytics.",
      "Sit with practice teams, watch the front desk work, and turn what you see into product.",
      "Set the habits the team grows into: code review, tests, and keeping patient data private by default.",
    ],
    qualifications: [
      "5+ years shipping production web software end to end.",
      "Strong TypeScript, React and Next.js, and comfort with SQL and backend services.",
      "A record of owning products from idea to launch with little direction.",
      "Product taste and clear writing; you care how the front desk feels using it.",
    ],
    bonus: [
      "Experience at an early-stage startup, or as a founder.",
      "Healthcare, scheduling or payments software.",
      "Products built on top of LLMs.",
    ],
  },
  "founding-integrations-engineer": {
    summary: "Connect Doe to the systems clinics run on, and make every read and write secure, private and auditable.",
    about: [
      "A clinic's profile is only as good as the systems behind it. The Dynamic Index syncs services, providers, hours, availability and prices from each clinic's scheduler, PMS and EHR, and when an agent books, sends a form or a referral, it has to land exactly where the clinic expects it.",
      "You will build those connections, and own the security and compliance of everything that moves through them: Doe Auth's signed grants, minimum-necessary access to PHI, two data regions, and the controls we clear step by step, PHIPA and HIPAA first, SOC 2 under way.",
    ],
    responsibilities: [
      "Build and run integrations with schedulers, practice management systems and EHRs used by aesthetics, MSK, dental and concierge practices in Canada and the US.",
      "Work with FHIR, HL7 v2, vendor APIs, and the systems that have none, and make each one reliable.",
      "Design the data model that maps every clinic's records into one shape the Index and agents can use.",
      "Build document exchange: forms, records, results and referrals in and out, read and filed to the chart, every step tracked.",
      "Build the Auth side: verified patients, signed and expiring grants, and least-privilege access enforced on every request.",
      "Keep data in its region, encrypt it in transit and at rest, and log every read and write for audit.",
      "Turn HIPAA, PHIPA and SOC 2 controls into code and configuration, and run the security reviews clinics and vendors ask for.",
    ],
    qualifications: [
      "4+ years building integrations, data pipelines or backend systems in production.",
      "Strong TypeScript or Python, SQL and API design.",
      "Experience with healthcare data standards such as FHIR, HL7 v2 or X12.",
      "Working knowledge of HIPAA and application security, OAuth2 and encryption.",
    ],
    bonus: [
      "Integrations with Jane, Oscar, Accuro, Dentrix, athenahealth, Epic or similar.",
      "SOC 2 or HITRUST audits, threat modelling or a secure SDLC.",
      "Payer connectivity, eligibility or prior authorization.",
    ],
  },
  "founding-gtm-lead": {
    summary: "Take Doe from the Index to paying clinics: Toronto first, U.S. test sites in parallel.",
    about: [
      "We've already indexed 1,500 clinics across the US and Canada. Every one gets its page and an email to claim it, free. Your job is to turn that into a market: claimed pages, then clinics paying for Basic, Advanced and Doe One as agent demand reaches them.",
      "You will be Doe's first go-to-market leader, starting with aesthetics, orthopaedics & MSK, dentistry and concierge practices, and you'll bring what clinics tell you straight into the product.",
    ],
    responsibilities: [
      "Own the path from indexed to claimed to paying: the claim emails, the onboarding and the upgrade moments.",
      "Build the plan for Toronto and our first U.S. markets: which clinics, which messages, what it costs.",
      "Run outbound, events, partnerships and referrals into practice owners and multi-site groups.",
      "Set pricing conversations and founding offers with the founders, and build the proof clinics need to say yes.",
      "Work with agent developers so patient demand reaches the clinics we sign.",
      "Report on the funnel honestly, and change course when the numbers say to.",
    ],
    qualifications: [
      "5+ years in go-to-market at B2B software companies.",
      "A record of building pipeline from nothing, ideally at an early-stage company.",
      "Comfort with data and the discipline to test before you scale.",
      "Clear writing; you can explain agents and the Index to a clinic owner in a sentence.",
    ],
    bonus: [
      "Selling into private practices, clinic groups or health systems.",
      "Product-led or marketplace growth.",
      "A network among aesthetics, MSK, dental or concierge practice owners.",
    ],
  },
  "product-manager-clinic-workflows": {
    summary: "Decide what Doe's agents and tools take on for clinics next, and make each one work every day.",
    about: [
      "Each tier of Doe adds workflows: live profiles and booking on Basic; document exchange, the Interface, offers, the waitlist and analytics on Advanced; voice agents, the scribe, Appointments+ and staff agents on Doe One.",
      "You will decide which workflows come next, for which clinics, and take each from a front-desk visit to something agents and staff rely on every day.",
    ],
    responsibilities: [
      "Spend time in practices, map how intake, scheduling, referrals and billing really happen, and find where agents help most.",
      "Own workflows across the tiers, from the first spec to adoption, with engineering and our clinician advisors.",
      "Define the Interface's request types and what an agent may do on its own versus with a person's review.",
      "Set the metrics for each workflow, such as requests answered at once, bookings and missed demand, and hold the product to them.",
      "Turn unanswered agent questions into features clinics actually use.",
    ],
    qualifications: [
      "4+ years in product management, with products you can point to.",
      "Comfort with technical detail and working closely with engineers.",
      "Excellent written communication.",
    ],
    bonus: [
      "Healthcare operations, practice management or revenue cycle.",
      "AI, automation or marketplace products.",
      "A clinical background.",
    ],
  },
  "founding-account-executive": {
    summary: "Sign Doe's first clinics and multi-site groups, and help write how we sell.",
    about: [
      "Clinics come to Doe by claiming their free page in the Index. You will turn the right ones into customers, from single practices to multi-site groups, on Basic, Advanced and Doe One.",
      "You will work directly with the founders on the pitch, the founding offers and the process, starting in Toronto and our U.S. test sites.",
    ],
    responsibilities: [
      "Run the full cycle: prospecting, discovery, demos and closing.",
      "Show each clinic how agents will reach it, and how Doe answers, books and fills its calendar.",
      "Bring multi-site groups live location by location.",
      "Build the playbook, the pipeline and the tools the team after you will use.",
      "Bring what you hear back to product.",
    ],
    qualifications: [
      "3+ years closing B2B software deals.",
      "A record of beating quota, ideally at an early-stage company.",
      "Comfort explaining technical products to non-technical owners.",
    ],
    bonus: [
      "Selling to aesthetics, MSK, dental or concierge practices.",
      "Selling AI or SaaS to SMBs.",
      "A network among practice owners and operators.",
    ],
  },
  "founding-engineering-co-op-spring-2027": {
    summary: "Spend Spring 2027 shipping a real part of Doe, alongside the founding team.",
    about: [
      "You will own one real piece of Doe for the term, in the Index, the Interface, the Doe Engine or the clinic product, and ship it to production with the founders reviewing your work.",
      "No side projects: you'll take part in planning, join clinic visits, and finish the term with work running in production.",
    ],
    responsibilities: [
      "Own a project for the term, scoped with the founders in your first week and shipped by your last.",
      "Build across our Next.js front end, TypeScript and Python services, and Postgres.",
      "Work on the agent layer: MCP tools, structured requests, evaluations and the Index data behind them.",
      "Write, review and test code the same way the full-time engineers do.",
    ],
    qualifications: [
      ...SPRING_2027,
      "Comfort writing TypeScript, Python or a similar language, shown through projects, past terms or coursework.",
      "Curiosity, clear writing and the habit of finishing what you start.",
    ],
    bonus: [
      "Past terms shipping software to real users.",
      "Projects built on LLMs, agents or MCP.",
      "Interest in healthcare.",
    ],
  },
  "founding-product-co-op-spring-2027": {
    summary: "Spend Spring 2027 owning a clinic workflow, from research to launch.",
    about: [
      "You will own one clinic workflow for the term, such as claiming a page, a request type in the Interface or a step of onboarding, working with the founders, engineers and our clinician advisors.",
      "You'll spend time with practices, write the specs and see your work go live before the term ends.",
    ],
    responsibilities: [
      "Own one workflow from research to launch, scoped with the founders in your first week.",
      "Join clinic calls and visits, and map how the front desk really works.",
      "Write clear specs and ship them with engineering and design.",
      "Measure the workflow after launch, and report on what the numbers say.",
    ],
    qualifications: [
      ...SPRING_2027,
      "Clear, structured writing, shown through projects, past terms or coursework.",
      "Comfort with technical detail and working closely with engineers.",
    ],
    bonus: [
      "Past terms in product, design or engineering.",
      "Something you built or launched yourself.",
      "Time spent working in a clinic or practice.",
    ],
  },
  "founding-growth-co-op-spring-2027": {
    summary: "Spend Spring 2027 helping clinics claim their pages and agents find them.",
    about: [
      "You will work with the founders on how Doe reaches clinics: from the Index and the claim emails to outbound, content and events in Toronto and our U.S. markets.",
      "You'll test ideas quickly, learn what practice owners respond to, and finish with results you can point to.",
    ],
    responsibilities: [
      "Build target lists from the Doe Index for our focus clinic types.",
      "Run claim, outbound and social campaigns, and report honestly on what converts.",
      "Write for Doe: landing pages, emails, posts and the case studies clinics read before they say yes.",
      "Keep the funnel data clean, so every decision rests on real numbers.",
    ],
    qualifications: [
      ...SPRING_2027,
      "Clear, persuasive writing, and comfort talking with people you have never met.",
      "Comfort with spreadsheets and data.",
    ],
    bonus: [
      "Past terms in marketing, sales or growth.",
      "An audience or community you grew yourself.",
      "Interest in healthcare or AI.",
    ],
  },
  "founding-brand-design-co-op-spring-2027": {
    summary: "Spend Spring 2027 designing how Doe looks and moves, across the web, graphics and film.",
    about: [
      "You will work across Doe's identity: the site, the films, launch graphics and the visuals inside the clinic product, with the founders as your closest collaborators.",
      "Doe's brand is still being written, so your work goes live, not into a folder.",
    ],
    responsibilities: [
      "Design pages for Doe's site, from layout to the final details, with engineers or in code yourself.",
      "Make graphics for launches, social, articles and decks.",
      "Edit and animate film: launch films, product walkthroughs and short motion pieces.",
      "Extend Doe's visual system: type, colour, illustration and the dot-wave patterns.",
    ],
    qualifications: [
      ...SPRING_2027,
      "A portfolio that shows strong craft in typography, layout and colour (include a link).",
      "Fluency in Figma, and in at least one motion, video or web tool.",
    ],
    bonus: [
      "HTML, CSS or front-end code.",
      "3D, illustration or generative design.",
      "Past terms at a startup or studio.",
    ],
  },
  "expression-of-interest": {
    summary: "Not sure where you fit? Tell us what you'd build, and we'll find the role.",
    about: [
      "Roles change quickly this early. If your work fits the Index, Auth, the Interface, the clinic product or how we take it to market, tell us, even if no listing matches you today.",
    ],
    responsibilities: [
      "Work on the part of Doe that matches your strengths as the team takes shape.",
      "Help shape the roles we hire for next, from the inside.",
    ],
    qualifications: [
      "Hard work done well, in software, clinical operations, sales, design or a field close to Doe.",
      "Clear writing, and a short note on what you'd build or improve.",
    ],
    bonus: ["Experience in or with healthcare organizations.", "Experience with AI or agent products."],
  },
};

/** A role with its /jobs text in place of the /careers text. */
export function jobsRole(role: CareersRole): CareersRole {
  const text = JOBS_ROLE_TEXT[role.slug];
  return text ? { ...role, ...text } : role;
}
