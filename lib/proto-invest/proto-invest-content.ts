/** /proto-invest — investor article copy for Proto (hiring platform). */

export const PROTO_INVEST_INTRO =
  "Companies still hire from résumés, phone screens, and panel interviews that rarely predict who can actually do the work. Recruiters spend weeks chasing candidates through stages that measure polish, not execution, while strong builders get filtered out before anyone sees what they shipped.";

export const PROTO_INVEST_STAT_BULLETS = [
  "Recruiters spend roughly two-thirds of their week on screening, scheduling, and inbox triage instead of evaluating real work.",
  "The average cost of a bad mid-level hire exceeds $50,000 once onboarding, ramp time, and team disruption are counted.",
  "Most hiring managers say traditional interviews fail to predict on-the-job performance for technical and product roles.",
] as const;

export const PROTO_INVEST_PIE_CHART = {
  title: "Recruiter week split",
  caption:
    "Approximate share of recruiter time spent on administrative screening versus reviewing candidate work samples.",
  citation: "Sources: LinkedIn Global Talent Trends; Greenhouse Recruiting Benchmarks; Proto market model, 2026.",
  slices: [
    { label: "Work sample review", value: 1, suffix: "part" },
    { label: "Screening & admin", value: 3, suffix: "parts" },
  ],
} as const;

export const PROTO_INVEST_BAR_CHART = {
  title: "Weekly hours on hiring admin",
  caption: "Survey averages for in-house recruiters, non-evaluation hours per week.",
  citation: "Sources: SHRM Talent Acquisition Benchmarking; Greenhouse State of Hiring, 2025.",
  bars: [
    { label: "United States", value: 18, suffix: "hrs/wk" },
    { label: "Canada", value: 16, suffix: "hrs/wk" },
  ],
} as const;

export const PROTO_INVEST_CHARTS_CAPTION = `${PROTO_INVEST_PIE_CHART.caption} ${PROTO_INVEST_BAR_CHART.caption}`;

export const PROTO_INVEST_CHARTS_CITATION = PROTO_INVEST_PIE_CHART.citation;

export const PROTO_INVEST_PRODUCT_HEADLINE_LINES = [
  "Proof of work,",
  "not proof of talk.",
] as const;

export const PROTO_INVEST_FOUNDERS_HEADLINE_LINES = ["Two brothers.", "two fields"] as const;

export type ProtoInvestFaqItem = {
  question: string;
  answer: string;
};

export const PROTO_INVEST_FAQ_ITEMS: readonly ProtoInvestFaqItem[] = [
  {
    question: "What is Proto?",
    answer:
      "Proto is a hiring platform where candidates complete real tasks inside a sandbox that mirrors your product, stack, and standards. Every action is tracked, scored, and replayed so recruiters compare applicants on evidence, not interview performance.",
  },
  {
    question: "What makes us different?",
    answer:
      "Most tools optimize the top of the funnel. Proto evaluates how people actually build: sandbox tasks, head-to-head scorecards, prototype validation with user feedback, and mobile-ready shortlists the moment work lands.",
  },
  {
    question: "Who is Proto for?",
    answer:
      "We are building for fast-growing companies hiring across product, engineering, ops, and design, starting in the United States and Canada where teams are competing for scarce talent and need signal beyond the résumé.",
  },
  {
    question: "How does evaluation work?",
    answer:
      "Companies post roles or open challenges. Applicants work inside Proto's sandbox while the platform captures replays, rubric scores, and comparison rankings. Recruiters review on desktop or phone, validate prototypes against real users, and move on strong talent before the interview loop decides.",
  },
] as const;

export const PROTO_INVEST_TAM_CHART = {
  title: "Addressable TAM",
  caption:
    "Estimated annual software spend for Proto across recruiting, talent acquisition, and skills-assessment segments in Canada and the United States.",
  citation: "Sources: Grand View Research; IBISWorld; Gartner HR tech spend; Proto market model, 2026.",
  bars: [
    { label: "U.S. recruiting software", value: 3.2, suffix: "B USD" },
    { label: "U.S. enterprise TA", value: 12, suffix: "B USD" },
    { label: "Canada hiring software", value: 1.4, suffix: "B USD" },
    { label: "Skills assessment", value: 6.8, suffix: "B USD" },
    { label: "North America TA", value: 16, suffix: "B USD" },
    { label: "Global hiring platform", value: 28, suffix: "B USD" },
  ],
  highlight: {
    valueB: 28,
    tamLabel: "Total Addressable Market",
    headline: "Global hiring & assessment software",
  },
} as const;

export const PROTO_INVEST_TAM_CAPTION = PROTO_INVEST_TAM_CHART.caption;

export const PROTO_INVEST_TAM_CITATION = PROTO_INVEST_TAM_CHART.citation;

export const PROTO_INVEST_AI_ADOPTION_CHART = {
  title: "AI adoption in recruiting workflows",
  caption:
    "Share of in-house recruiting teams in Canada and the United States using AI for each hiring workflow, blended from talent-acquisition surveys and HR tech deployment data.",
  citation:
    "Sources: LinkedIn Future of Recruiting; Greenhouse AI in Hiring Report; SHRM Talent Acquisition Benchmarks; Proto market model, 2026.",
  bars: [
    { label: "Resume screening", value: 62, suffix: "%" },
    { label: "Candidate sourcing", value: 55, suffix: "%" },
    { label: "Interview scheduling", value: 48, suffix: "%" },
    { label: "Offer & onboarding", value: 34, suffix: "%" },
    { label: "Work sample evaluation", value: 19, suffix: "%" },
    { label: "Prototype validation", value: 11, suffix: "%" },
  ],
} as const;

export const PROTO_INVEST_AI_ADOPTION_CAPTION = PROTO_INVEST_AI_ADOPTION_CHART.caption;

export const PROTO_INVEST_AI_ADOPTION_CITATION = PROTO_INVEST_AI_ADOPTION_CHART.citation;

export const PROTO_INVEST_FOUNDERS_PARAGRAPHS = [
  "Brothers James and Matthew Lisondra co-founded Proto to replace résumé theater with evidence from how people actually build.",
  "James holds an MD from the University of Ottawa with experience bridging clinical operations and product judgment. Matthew holds a PhD from the University of Toronto with backgrounds in physics, robotics, AI, and computer science.",
] as const;

export const PROTO_INVEST_FOUNDERS_QUOTE = {
  text: "The hire should be obvious before anyone schedules a panel.",
  attribution: "James & Matthew Lisondra, Co-founders",
} as const;
