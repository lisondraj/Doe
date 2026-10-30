/**
 * /jobs: the /careers page and its role pages as an indication of interest. Doe is building its founding team; nothing
 * listed is a live opening yet, and anyone can register interest as roles open. Pay is not listed in figures.
 */

import { CAREERS_ROLES, type CareersRole } from "@/lib/doehealth/doehealth-careers";

export const JOBS_PATH = "/jobs";
export const JOBS_FORM_ID = "apply";

export function jobsRolePath(role: CareersRole) {
  return `${JOBS_PATH}/${role.slug}`;
}

/** What a role pays, as /jobs shows it: no figures. Student terms are paid hourly and carry no equity. */
export function jobsPayLabel(role: CareersRole) {
  return role.student ? "Paid Term" : "Competitive Salary + Equity";
}

/** Where questions about /jobs go. */
export const JOBS_CONTACT_EMAIL = "james@doe.care";

export const JOBS_COPY = {
  title: "Founding Team",
  intro: [
    "We're building our founding team.",
    "Personal agents are about to change how every patient finds and reaches care, and only a handful of people will build the layer that makes it work. The roles below open soon. Be first in line.",
  ],
  rolesTitle: "Future Roles",
  backLabel: "All Future Roles",
  moreTitle: "More Future Roles",
  moreLink: "See All Future Roles",
  cta: "Indicate Your Interest",
} as const;

export const JOBS_FORM_COPY = {
  title: "Indicate Your Interest",
  submit: "Submit",
  sending: "Sending…",
  /** Shown in place of the form once it has gone through. `{name}` is the first name. */
  thanks: "Thank you, {name}. We have your details and will be in touch as roles open.",
  error: `Something went wrong sending it. Try again, or email ${JOBS_CONTACT_EMAIL}.`,
  groups: { about: "Personal Information", role: "Position", work: "Experience" },
  consent:
    "I understand this registers my interest in future roles at Doe, and that Doe may keep my details to contact me about them.",
} as const;

/** The first choice in the position list; the rest are the listed roles. */
export const JOBS_ANY_ROLE = { slug: "open", title: "Open to any role" } as const;

export const JOBS_ROLE_OPTIONS: readonly { slug: string; title: string }[] = [
  JOBS_ANY_ROLE,
  ...CAREERS_ROLES.filter((role) => role.slug !== "expression-of-interest").map((role) => ({ slug: role.slug, title: role.title })),
];

export const JOBS_START_OPTIONS = [
  "Immediately",
  "Within 1–3 months",
  "Within 3–6 months",
  "More than 6 months",
  "Co-op or internship term",
] as const;

export const JOBS_AUTHORIZATION_OPTIONS = [
  "Authorized to work in Canada",
  "Authorized to work in the US",
  "Authorized in both",
  "Would need sponsorship",
] as const;

/** The two countries roles are open to, and the address each asks for once chosen. */
export const JOBS_COUNTRIES = {
  "United States": {
    regionLabel: "State",
    postalLabel: "ZIP Code",
    regions: [
      "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
      "District of Columbia", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas",
      "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
      "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York",
      "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island",
      "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
      "West Virginia", "Wisconsin", "Wyoming",
    ],
  },
  Canada: {
    regionLabel: "Province or Territory",
    postalLabel: "Postal Code",
    regions: [
      "Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador",
      "Northwest Territories", "Nova Scotia", "Nunavut", "Ontario", "Prince Edward Island", "Quebec",
      "Saskatchewan", "Yukon",
    ],
  },
} as const;

export type JobsCountry = keyof typeof JOBS_COUNTRIES;

/** The résumé types the private bucket takes. */
export const JOBS_RESUME_ACCEPT = ".pdf,.doc,.docx";
/** Under Vercel's 4.5 MB request limit, with room for the other fields. */
export const JOBS_RESUME_MAX_BYTES = 4 * 1024 * 1024;
