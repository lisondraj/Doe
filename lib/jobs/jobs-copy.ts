/**
 * /jobs: the /careers page and its role pages as an indication of interest. Doe is building its founding team and
 * gathering interest; nothing listed is a live opening, and anyone can ask to be considered as roles open. Pay is not
 * listed, only "$$$ + Equity", discussed at interview.
 */

import { CAREERS_ROLES, type CareersRole } from "@/lib/doehealth/doehealth-careers";

export const JOBS_PATH = "/jobs";
export const JOBS_FORM_ID = "apply";

export function jobsRolePath(role: CareersRole) {
  return `${JOBS_PATH}/${role.slug}`;
}

/** What a role pays, as /jobs shows it: no figures. Student terms are paid hourly and carry no equity. */
export function jobsPayLabel(role: CareersRole) {
  return role.student ? "$$$" : "$$$ + Equity";
}

export const JOBS_PAY_NOTE = "Discussed at interview";

export const JOBS_COPY = {
  title: "Founding Team",
  intro: [
    "We're building our founding team and gathering interest.",
    "None of these is a live opening yet. Tell us the role you'd want and a little about you, and we'll reach out as each one opens.",
  ],
  rolesTitle: "Future Roles",
  backLabel: "All Future Roles",
  moreTitle: "More Future Roles",
  moreLink: "See All Future Roles",
  /** Under a role's title: what this page is. */
  roleNote: "Indication of interest. We're building our founding team and will reach out as this role opens.",
} as const;

/** The start of the form: a short title and what it is. */
export const JOBS_FORM_COPY = {
  title: "Start Your Application",
  subtitle: "An indication of interest for our founding team. It takes about three minutes, and we read every one.",
  submit: "Submit Application",
  sending: "Sending…",
  /** Shown in place of the form once it has gone through. `{name}` is the first name. */
  thanks: "Thank you, {name}. We have your application and will be in touch as roles open.",
  error: "Something went wrong sending it. Try again, or email jobs@doe.care.",
  /** Beside the form on desktop, over it on iPhone: what happens after they send it. */
  steps: [
    { title: "Tell us about you", text: "The role you'd want, your links and your résumé." },
    { title: "We read every one", text: "James and the team go through each application ourselves." },
    { title: "We reach out as roles open", text: "If there's a fit, we'll set up a first conversation." },
  ],
  questions: "Questions? jobs@doe.care",
  groups: { about: "About you", role: "The role", work: "Your work" },
  consent:
    "I understand this is an indication of interest for future hiring, not an application to a live opening, and that Doe may keep my details to contact me about roles.",
} as const;

/** "Not sure yet" sits at the top of the role choice; the rest are the listed roles. */
export const JOBS_ANY_ROLE = { slug: "open", title: "Not sure yet — open to anything" } as const;

export const JOBS_ROLE_OPTIONS: readonly { slug: string; title: string }[] = [
  JOBS_ANY_ROLE,
  ...CAREERS_ROLES.filter((role) => role.slug !== "expression-of-interest").map((role) => ({ slug: role.slug, title: role.title })),
];

export const JOBS_START_OPTIONS = [
  "Right away",
  "Within 1–3 months",
  "In 3–6 months",
  "6+ months out",
  "A co-op or internship term",
] as const;

export const JOBS_AUTHORIZATION_OPTIONS = [
  "Authorized to work in Canada",
  "Authorized to work in the US",
  "Authorized in both",
  "Would need sponsorship",
] as const;

/** The résumé types the private bucket takes. */
export const JOBS_RESUME_ACCEPT = ".pdf,.doc,.docx";
/** Under Vercel's 4.5 MB request limit, with room for the other fields. */
export const JOBS_RESUME_MAX_BYTES = 4 * 1024 * 1024;
