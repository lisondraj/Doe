import type { DoeHealthBlogPlaceholderTone, DoeHealthBlogWave } from "@/lib/doehealth/doehealth-blog-articles";

export const CAREERS_PATH = "/careers";
export const CAREERS_APPLY_EMAIL = "james@doe.care";

export type CareersTeamSection = {
  title: string;
  body: string;
  tone: DoeHealthBlogPlaceholderTone;
  wave?: DoeHealthBlogWave;
};

export type CareersRole = {
  title: string;
  location: string;
  type: string;
};

export type CareersRoleGroup = {
  team: string;
  roles: readonly CareersRole[];
};

export const CAREERS_TEAM_SECTIONS: readonly CareersTeamSection[] = [
  {
    title: "A small team close to clinics",
    body: "We spend time in practices every week. The people building Doe sit with front desks, providers, and billing teams, and the work starts from what we see there.",
    tone: "cream",
    wave: { top: 0.42, amp: 80, phase: 1.4, scale: 1.1, slant: 0.4 },
  },
  {
    title: "Providers in the room",
    body: "Doctors review what we design before it ships. Engineers, designers, and clinicians work on the same problems at the same table, not in a handoff.",
    tone: "clay",
    wave: { top: 0.46, amp: 60, phase: 2.6, scale: 0.9, slant: -0.4, flip: true },
  },
  {
    title: "Ownership from day one",
    body: "Everyone owns something real in their first month. We keep the team small so each person can see the whole product and change it.",
    tone: "gold",
    wave: { top: 0.4, amp: 70, phase: 3.8, scale: 1.25, slant: 0.2 },
  },
];

export const CAREERS_ROLE_GROUPS: readonly CareersRoleGroup[] = [
  {
    team: "Engineering",
    roles: [
      { title: "Founding Full-Stack Engineer", location: "San Francisco", type: "Full-time" },
      { title: "Agent Infrastructure Engineer", location: "San Francisco", type: "Full-time" },
      { title: "Health Data Integrations Engineer", location: "Remote, US", type: "Full-time" },
    ],
  },
  {
    team: "Product",
    roles: [
      { title: "Product Designer", location: "San Francisco", type: "Full-time" },
      { title: "Product Manager, Clinic Workflows", location: "San Francisco", type: "Full-time" },
    ],
  },
  {
    team: "GTM & Sales",
    roles: [
      { title: "Founding Account Executive", location: "San Francisco", type: "Full-time" },
      { title: "Clinic Partnerships Lead", location: "Remote, US", type: "Full-time" },
      { title: "Customer Success Manager", location: "Remote, US", type: "Full-time" },
    ],
  },
];
