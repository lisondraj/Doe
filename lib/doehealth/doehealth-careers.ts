import type { DoeHealthBlogPlaceholderTone, DoeHealthBlogWave } from "@/lib/doehealth/doehealth-blog-articles";

export const CAREERS_PATH = "/careers";
export const CAREERS_APPLY_EMAIL = "james@doe.care";

export type CareersTeamSection = {
  title: string;
  body: string;
  tone: DoeHealthBlogPlaceholderTone;
  wave?: DoeHealthBlogWave;
};

export const CAREERS_TEAMS = ["Engineering", "Product", "GTM & Sales"] as const;
export type CareersTeam = (typeof CAREERS_TEAMS)[number];

/** Remote roles name the country; on-site roles name the office. */
export const CAREERS_REMOTE_LOCATIONS = ["Remote (Canada)", "Remote (US)"] as const;
export const CAREERS_OFFICES = ["Toronto", "New York", "San Francisco"] as const;
export type CareersLocation = (typeof CAREERS_REMOTE_LOCATIONS)[number] | (typeof CAREERS_OFFICES)[number];

export type CareersRole = {
  title: string;
  team: CareersTeam;
  location: CareersLocation;
  pay: string;
  equity: boolean;
};

export function careersRoleIsRemote(role: CareersRole) {
  return (CAREERS_REMOTE_LOCATIONS as readonly string[]).includes(role.location);
}

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

export const CAREERS_ROLES: readonly CareersRole[] = [
  { title: "Founding Full-Stack Engineer", team: "Engineering", location: "San Francisco", pay: "$170K – $230K", equity: true },
  { title: "Agent Infrastructure Engineer", team: "Engineering", location: "New York", pay: "$165K – $220K", equity: true },
  { title: "Health Data Integrations Engineer", team: "Engineering", location: "Remote (US)", pay: "$150K – $200K", equity: true },
  { title: "Software Engineer, Clinic Tools", team: "Engineering", location: "Toronto", pay: "CA$140K – CA$185K", equity: true },
  { title: "Product Designer", team: "Product", location: "San Francisco", pay: "$140K – $190K", equity: true },
  { title: "Product Manager, Clinic Workflows", team: "Product", location: "New York", pay: "$150K – $195K", equity: true },
  { title: "Founding Account Executive", team: "GTM & Sales", location: "San Francisco", pay: "$120K – $160K + commission", equity: true },
  { title: "Clinic Partnerships Lead", team: "GTM & Sales", location: "Remote (Canada)", pay: "CA$110K – CA$145K", equity: true },
  { title: "Customer Success Manager", team: "GTM & Sales", location: "Remote (US)", pay: "$90K – $125K", equity: true },
];
