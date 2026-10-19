import type { DoeHealthBlogPlaceholderTone, DoeHealthBlogWave } from "@/lib/doehealth/doehealth-blog-articles";

export const CAREERS_PATH = "/careers";
export const CAREERS_APPLY_EMAIL = "jobs@doe.care";

export type CareersTeamSection = {
  title: string;
  body: string;
  tone: DoeHealthBlogPlaceholderTone;
  wave?: DoeHealthBlogWave;
};

export const CAREERS_TEAMS = ["Engineering", "Product", "Growth & Sales", "Co-op & Internships", "Open Application"] as const;
export type CareersTeam = (typeof CAREERS_TEAMS)[number];

/** Founding roles list first on /careers; additional roles follow them, in the same style. */
export type CareersSection = "founding" | "additional";

/** The countries a role is open to. Every role is remote; each lists the countries it can be done from. */
export const CAREERS_COUNTRIES = ["US", "Canada"] as const;
export type CareersCountry = (typeof CAREERS_COUNTRIES)[number];

/** The label when a role is open to both countries. */
export const CAREERS_LOCATION = "Remote (US or Canada)";

/** One pay band of a student role: the work terms it covers and the hourly rate in CAD. */
export type CareersTermBand = {
  level: string;
  terms: string;
  rate: string;
};

/** The term a student role runs for, and its pay by work term, set as a ladder on the role page. */
export type CareersStudentTerm = {
  season: string;
  dates: string;
  length: string;
  bands: readonly CareersTermBand[];
  /** One line under the ladder on how a student is placed in a band. */
  bandsNote: string;
};

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
  /** Set for co-op and internship roles: the term, its dates, and pay by work term. Unset is a full-time role. */
  student?: CareersStudentTerm;
};

export const CAREERS_TEAM_SECTIONS: readonly CareersTeamSection[] = [
  {
    title: "A Small Team Close to Providers",
    body: "We spend time with providers every week, across primary care, dental, mental health, physiotherapy, and specialty practices. The infrastructure and the tools we build start from what we see there.",
    tone: "cream",
    wave: { top: 0.42, amp: 80, phase: 1.4, scale: 1.1, slant: 0.4 },
  },
  {
    title: "Providers in the Room",
    body: "Clinicians from every discipline review what we design before it ships. Engineers, designers, and providers work on the same problems at the same table, not in a handoff.",
    tone: "clay",
    wave: { top: 0.46, amp: 60, phase: 2.6, scale: 0.9, slant: -0.4, flip: true },
  },
  {
    title: "Ownership from Day One",
    body: "Everyone owns a real part of the platform in their first month. We keep the team small so each person can see the whole of Doe, from the agent layer to the provider tools, and change it.",
    tone: "gold",
    wave: { top: 0.4, amp: 70, phase: 3.8, scale: 1.25, slant: 0.2 },
  },
];

/** "About Doe" on every role page. */
export const CAREERS_ABOUT_DOE: readonly string[] = [
  "Patients are starting to reach healthcare through their own personal AI agents: to find a provider, book a visit, ask about coverage, or check on a result. Doe is the infrastructure that connects those agents to healthcare organizations, from single practices to multi-site groups.",
  "On top of it, we build AI tools for providers in every discipline, from primary care and dentistry to mental health, physiotherapy, and specialty care. Each organization gets its own intelligence model, trained on how it actually runs, and agents that answer, schedule, and follow up on its behalf. We are a small team of engineers, designers, and clinicians building it together.",
];

/** Doe One, the benefits package on every role page. */
export const CAREERS_BENEFITS_NAME = "Doe One";
export const CAREERS_BENEFITS_CLAIM = "The most competitive benefits package among Toronto startups.";

/** One Doe One row: the benefit written out, then its figure or word, set in Lora at the end of the row. */
export type CareersBenefit = {
  name: string;
  figure: string;
};

/** Doe One by category, set two across: Health beside Fitness & Recovery, Work Setup beside Time & Team. */
export const CAREERS_BENEFIT_GROUPS: readonly { title: string; items: readonly CareersBenefit[] }[] = [
  {
    title: "Health",
    items: [
      { name: "Extended Health, Dental & Vision", figure: "100%" },
      { name: "Psychotherapy", figure: "$2,000" },
      { name: "Preventive Health & Labs", figure: "$500–1,000/yr" },
      { name: "Virtual Healthcare", figure: "Dialogue" },
    ],
  },
  {
    title: "Fitness & Recovery",
    items: [
      { name: "WHOOP Device & Membership", figure: "Covered" },
      { name: "Gym & Fitness", figure: "$100/mo" },
      { name: "Superpower 150+ Biomarker Testing", figure: "2×/yr" },
    ],
  },
  {
    title: "Work Setup",
    items: [
      { name: "Top-Spec MacBook Pro", figure: "Included" },
      { name: "Home-Office Setup", figure: "$2,000" },
      { name: "Internet + Phone", figure: "$150/mo" },
      { name: "Conference, Travel & Learning", figure: "$1,500/yr" },
    ],
  },
  {
    title: "Time & Team",
    items: [
      { name: "Vacation", figure: "4 weeks" },
      { name: "Sick & Personal Days", figure: "Flexible" },
      { name: "Parental Leave", figure: "Top-up" },
      { name: "Company-Paid Team Retreats", figure: "2×/yr" },
    ],
  },
];

/** The first two lines of "What You'll Bring" on every Spring 2027 co-op. */
const SPRING_2027_ELIGIBILITY = [
  "Enrolled in a university or college program in Canada or the US, and returning to school after the term.",
  "Available to work full time, remotely, for the Spring 2027 term, May through August.",
] as const;

/** The Spring 2027 term, with the hourly CAD rate for the early, intermediate, and senior work-term bands. */
function spring2027Term(early: string, intermediate: string, senior: string): CareersStudentTerm {
  return {
    season: "Spring 2027",
    dates: "May – August 2027",
    length: "4 months",
    bands: [
      { level: "Early", terms: "1st – 2nd work term", rate: early },
      { level: "Intermediate", terms: "3rd – 4th work term", rate: intermediate },
      { level: "Senior", terms: "5th work term and up", rate: senior },
    ],
    bandsNote:
      "Your band follows the work term you will be on in Spring 2027. Not in a co-op program? We place you by year of study and past internships.",
  };
}

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
    summary: "Build the infrastructure that connects personal agents to healthcare organizations.",
    about: [
      "Doe sits between patients' personal agents and the healthcare organizations they reach. You will build the systems that carry every request across that line, and the agents that answer, book, and follow up for providers: fast, reliable, and observable.",
      "You will own the path from a patient's first word to the provider's record, for every discipline we serve, and make it hold up at scale.",
    ],
    responsibilities: [
      "Build and operate the runtime for voice and text agents: orchestration, tool calls, memory, and retries.",
      "Design the interfaces personal agents use to reach healthcare organizations through Doe.",
      "Bring latency down and reliability up across speech, model, and telephony providers.",
      "Build evaluation and monitoring so every agent change is measured before and after it ships.",
      "Design how each organization's intelligence model is trained, versioned, and served.",
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
      "Experience with healthcare data, such as FHIR or HL7, or another regulated industry.",
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
    summary: "Build the AI tools providers in every discipline use every day, from the first screen to the database.",
    about: [
      "You will be one of the first engineers at Doe. You will ship the AI tools providers, front desks, and operators use to see and steer their agents, and the services behind them, across primary care, dental, mental health, and every discipline we serve.",
      "There is no spec waiting for you. You will sit with provider teams, decide what to build with the founders, and own it in production.",
    ],
    responsibilities: [
      "Design and ship features across our Next.js front end, APIs, and Postgres data model.",
      "Build the provider workspace: call reviews, schedules, follow-ups, and the controls that tune each organization's agents.",
      "Visit practices across disciplines, watch the work happen, and turn what you see into product.",
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
    team: "Growth & Sales",
    countries: ["US", "Canada"],
    pay: "CA$100K – CA$120K",
    equity: "0.5–1.0%",
    wave: { top: 0.44, amp: 70, phase: 0.4, scale: 1.0, slant: 0.35, flip: true },
    summary: "Own how Doe reaches healthcare organizations, from the first conversation to the first live agent.",
    about: [
      "You will be Doe's first go-to-market leader. You will decide which healthcare organizations and disciplines we reach first, what we say to them, and how we measure whether it works.",
      "You will work across sales, marketing, and partnerships, and bring what providers tell you straight into the product.",
    ],
    responsibilities: [
      "Build Doe's go-to-market plan: who we target, how we reach them, and what it costs.",
      "Run early outbound, events, and referral programs, and learn what converts.",
      "Hire and shape the growth and sales team as it forms.",
      "Set the messaging, pricing conversations, and proof points providers need to say yes.",
      "Report on the funnel honestly, and change course when the numbers say to.",
    ],
    qualifications: [
      "Five or more years in go-to-market roles at B2B software companies.",
      "A record of building a pipeline from nothing, ideally at an early-stage company.",
      "Comfort with data, and the discipline to test before you scale.",
      "Clear writing and the ability to explain a complex product plainly.",
    ],
    bonus: [
      "Experience selling into healthcare organizations or health systems.",
      "Experience building growth programs for AI products.",
      "Experience hiring and leading a first sales team.",
    ],
  },
  {
    slug: "product-manager-clinic-workflows",
    title: "Product Manager, Provider Workflows",
    section: "additional",
    team: "Product",
    countries: ["US", "Canada"],
    pay: "CA$140K – CA$170K",
    equity: "0.3–0.6%",
    wave: { top: 0.41, amp: 66, phase: 3.6, scale: 1.0, slant: 0.25, flip: true },
    summary: "Decide which workflows Doe's agents and AI tools take on for providers, in every discipline.",
    about: [
      "Every discipline runs differently, and so does every organization within it. You will learn how they work, from intake and scheduling to referrals and billing, and decide which workflows Doe takes on next.",
      "You will work with engineering, design, and our clinician advisors to take each workflow from a provider visit to something agents do well every day.",
    ],
    responsibilities: [
      "Spend time with providers across disciplines, map how their work really happens, and find where agents and AI tools help most.",
      "Write clear specs and set the roadmap for provider workflows with the founders.",
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
    team: "Growth & Sales",
    countries: ["US", "Canada"],
    pay: "CA$90K – CA$110K + commission",
    equity: "0.25–0.5%",
    wave: { top: 0.43, amp: 74, phase: 0.9, scale: 1.1, slant: -0.2 },
    summary: "Bring Doe to healthcare organizations, and help write how we sell it.",
    about: [
      "You will be the first account executive at Doe. You will own deals with practices, clinic groups, and healthcare organizations across disciplines, from the first call to signature.",
      "You will work directly with the founders to shape our pitch, pricing, and process as we grow.",
    ],
    responsibilities: [
      "Run the full sales cycle: prospecting, discovery, demos, and closing.",
      "Learn each organization's workflows and show how Doe's agents and AI tools fit them.",
      "Build the playbook, the pipeline, and the tools the team after you will use.",
      "Bring what you hear from providers back to product.",
    ],
    qualifications: [
      "Three or more years closing B2B software deals.",
      "A record of beating quota, ideally at an early-stage company.",
      "Comfort explaining technical products to non-technical buyers.",
    ],
    bonus: [
      "Experience selling to healthcare organizations.",
      "Experience selling AI products.",
      "A network among practice owners and healthcare operators.",
    ],
  },
  {
    slug: "founding-engineering-co-op-spring-2027",
    title: "Founding Engineering Co-op (Spring 2027)",
    section: "additional",
    team: "Co-op & Internships",
    countries: ["US", "Canada"],
    pay: "CA$30 – CA$60/hr",
    equity: null,
    wave: { top: 0.5, amp: 72, phase: 1.8, scale: 1.15, slant: -0.25 },
    summary: "Spend Spring 2027 shipping real parts of Doe, alongside the founding team.",
    about: [
      "This is a co-op or internship for students, on the founding engineering team. You will own a real piece of Doe for the term, in the agent infrastructure or the tools providers use every day, and ship it to production with the founders reviewing your work.",
      "Every co-op works on the product, not a side project. You will sit in on provider visits, take part in planning, and finish the term with work you can point to in production.",
    ],
    responsibilities: [
      "Own a project for the term, scoped with the founders in your first week and shipped by your last.",
      "Build features across our Next.js front end, TypeScript and Python services, and Postgres.",
      "Work on the agent layer: tool calls, evaluations, and the data behind each organization's intelligence model.",
      "Join provider calls and practice visits, and turn what you see into product.",
      "Write, review, and test code alongside full-time engineers, the same way they do.",
    ],
    qualifications: [
      ...SPRING_2027_ELIGIBILITY,
      "Comfort writing code in TypeScript, Python, or a similar language, shown through projects, past terms, or coursework.",
      "Curiosity, clear writing, and the habit of finishing what you start.",
    ],
    bonus: [
      "Past co-op or internship terms shipping software to real users.",
      "Projects built on LLMs or agents.",
      "Interest in healthcare, or time spent working in a clinic or practice.",
    ],
    student: spring2027Term("CA$30 – 38/hr", "CA$38 – 48/hr", "CA$48 – 60/hr"),
  },
  {
    slug: "founding-product-co-op-spring-2027",
    title: "Founding Product Co-op (Spring 2027)",
    section: "additional",
    team: "Co-op & Internships",
    countries: ["US", "Canada"],
    pay: "CA$26 – CA$50/hr",
    equity: null,
    wave: { top: 0.48, amp: 66, phase: 3.1, scale: 1.0, slant: 0.3, flip: true },
    summary: "Spend Spring 2027 shaping what Doe builds for providers, alongside the founders.",
    about: [
      "This is a co-op or internship for students who want to work in product. You will own a real provider workflow for the term, from what providers need to what ships, working with the founders, engineers, and our clinician advisors.",
      "You will spend time with providers across disciplines, write the specs, and see your work go live before the term ends.",
    ],
    responsibilities: [
      "Own one provider workflow for the term, from research to launch, scoped with the founders in your first week.",
      "Join provider calls and practice visits, and map how their work really happens.",
      "Write clear specs, and work with engineering and design to ship them.",
      "Define how we measure each workflow, and report on what the numbers say.",
      "Bring what you hear from providers back to the team, and help set the roadmap with the founders.",
    ],
    qualifications: [
      ...SPRING_2027_ELIGIBILITY,
      "Clear, structured writing, shown through projects, past terms, or coursework.",
      "Comfort with technical detail, and with working closely with engineers.",
      "Curiosity about how healthcare organizations really run.",
    ],
    bonus: [
      "Past co-op or internship terms in product, design, or engineering.",
      "Something you built or launched on your own.",
      "Interest in healthcare, or time spent working in a clinic or practice.",
    ],
    student: spring2027Term("CA$26 – 32/hr", "CA$32 – 40/hr", "CA$40 – 50/hr"),
  },
  {
    slug: "founding-growth-co-op-spring-2027",
    title: "Founding Growth Co-op (Spring 2027)",
    section: "additional",
    team: "Co-op & Internships",
    countries: ["US", "Canada"],
    pay: "CA$22 – CA$42/hr",
    equity: null,
    wave: { top: 0.46, amp: 78, phase: 0.6, scale: 1.1, slant: 0.15 },
    summary: "Spend Spring 2027 helping Doe reach healthcare organizations, alongside the founders.",
    about: [
      "This is a co-op or internship for students who want to work in growth, marketing, or sales. You will work with the founders on how Doe reaches practices and healthcare organizations, and run real programs with real numbers behind them.",
      "You will test ideas quickly, learn what providers respond to, and finish the term with results you can point to.",
    ],
    responsibilities: [
      "Research the practices and healthcare organizations we reach, and build the target lists for outbound.",
      "Run outbound, email, and social campaigns, and report honestly on what converts.",
      "Write for Doe: landing pages, emails, posts, and the case studies providers read before they say yes.",
      "Help plan events and referral programs, and support the team on sales calls.",
      "Keep the funnel data clean, so every decision rests on real numbers.",
    ],
    qualifications: [
      ...SPRING_2027_ELIGIBILITY,
      "Clear, persuasive writing, and comfort talking with people you have never met.",
      "Comfort with spreadsheets and data, and the discipline to test before you scale.",
      "The habit of starting things without being asked, and finishing them.",
    ],
    bonus: [
      "Past co-op or internship terms in marketing, sales, or growth.",
      "An audience or community you have grown yourself.",
      "Interest in healthcare or AI products.",
    ],
    student: spring2027Term("CA$22 – 28/hr", "CA$28 – 35/hr", "CA$35 – 42/hr"),
  },
  {
    slug: "founding-brand-design-co-op-spring-2027",
    title: "Founding Brand Design Co-op (Spring 2027)",
    section: "additional",
    team: "Co-op & Internships",
    countries: ["US", "Canada"],
    pay: "CA$24 – CA$46/hr",
    equity: null,
    wave: { top: 0.44, amp: 70, phase: 4.6, scale: 0.9, slant: -0.35, flip: true },
    summary: "Spend Spring 2027 designing how Doe looks and moves, across the web, graphics, and video.",
    about: [
      "This is a co-op or internship for students in design. You will work across Doe's visual identity, from the website and graphics to launch videos and motion, with the founders as your closest collaborators.",
      "Doe's brand is still being written, so your work goes live, not into a folder. You will finish the term with shipped pages, videos, and assets that people actually see.",
    ],
    responsibilities: [
      "Design pages for Doe's website, from layout to the final details, working closely with engineers or in code yourself.",
      "Make the graphics for launches, social posts, the blog, and decks.",
      "Edit and animate video: launch films, product walkthroughs, and short motion pieces.",
      "Extend Doe's visual system: type, colour, illustration, and the dot-wave patterns across the site.",
      "Help with product screens and the visuals inside the provider tools, when the work calls for it.",
    ],
    qualifications: [
      ...SPRING_2027_ELIGIBILITY,
      "A portfolio that shows strong visual craft in typography, layout, and colour. Include a link when you apply.",
      "Fluency in Figma, and in at least one motion, video, or web tool, such as After Effects, Premiere, or Framer.",
      "Taste, and the ability to take feedback and turn it around quickly.",
    ],
    bonus: [
      "Experience with HTML, CSS, or front-end code.",
      "3D, illustration, or generative design work.",
      "Past co-op or internship terms at a startup or studio.",
    ],
    student: spring2027Term("CA$24 – 30/hr", "CA$30 – 38/hr", "CA$38 – 46/hr"),
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
      "This is an open application. Tell us the work you do best and the providers you want to help, and we will look for a fit as Doe grows.",
      "Roles change quickly at a company this early. A strong profile can turn into a role we had not planned for, so send it even if no listing matches you today.",
    ],
    responsibilities: [
      "Work on the part of Doe that matches your strengths, as the team's needs take shape.",
      "Take on work across the agent infrastructure, the provider tools, or go-to-market, wherever we need you most.",
      "Help shape the roles we hire for next, from the inside.",
    ],
    qualifications: [
      "Experience doing hard work well, in software, clinical operations, sales, design, or a field close to Doe.",
      "Clear writing, and a short note on what you would build or improve at Doe.",
      "Interest in healthcare, personal agents, and AI tools built for providers.",
    ],
    bonus: [
      "Experience working in or with healthcare organizations, in any discipline.",
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

/** The employment type for a role's meta line and facts. */
export function careersType(role: CareersRole) {
  return role.student ? "Co-op / Internship" : "Full Time";
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
