import { INTRODUCING_FABRIC_PATH } from "@/lib/blog/introducing-fabric-article";
import { INTRODUCING_FLOAT_PATH } from "@/lib/blog/introducing-float-article";
import { INTRODUCING_GENOME_PATH } from "@/lib/blog/introducing-genome-article";
import { GENOME_IS_BUILT_FOR_YOU_PATH } from "@/lib/blog/genome-is-built-for-you-article";
import { INTELLIGENCE_FOR_EVERY_CLINIC_PATH } from "@/lib/blog/intelligence-for-every-clinic-article";
import { INTRODUCING_PULSE_PATH } from "@/lib/blog/introducing-pulse-article";
import { PULSE_AMBIENT_PATH } from "@/lib/blog/pulse-ambient-article";
import { PULSE_CALL_HISTORY_PATH } from "@/lib/blog/pulse-call-history-article";

export type PremedEarlyStageLink = {
  label: string;
  href: string;
  description: string;
  nested?: boolean;
};

export type PremedEarlyStageEntry =
  | { kind: "link"; id: string; link: PremedEarlyStageLink }
  | { kind: "note"; id: string; text: string };

export const PREMED_EARLY_STAGE_INTRO =
  "The pieces below share early writing on what Doe is building across intelligence, platform, and product.";

export const PREMED_EARLY_STAGE_VERTICALS_NOTE =
  "The products below are early areas of focus for Doe.";

export const PREMED_EARLY_STAGE_ENTRIES: readonly PremedEarlyStageEntry[] = [
  {
    kind: "link",
    id: "intelligence-for-every-clinic",
    link: {
      label: "Intelligence for every clinic",
      href: INTELLIGENCE_FOR_EVERY_CLINIC_PATH,
      description:
        "An early outline of how Doe thinks about intelligence in healthcare and where the platform is heading.",
    },
  },
  {
    kind: "link",
    id: "introducing-genome",
    link: {
      label: "Introducing Genome",
      href: INTRODUCING_GENOME_PATH,
      description:
        "A first look at Genome and how Doe approaches specialized intelligence for clinical environments.",
    },
  },
  {
    kind: "link",
    id: "genome-is-built-for-you",
    link: {
      label: "Genome is built for you",
      href: GENOME_IS_BUILT_FOR_YOU_PATH,
      description:
        "How Genome is designed to reflect the teams, workflows, and priorities of the organizations that use it.",
    },
  },
  {
    kind: "note",
    id: "first-verticals",
    text: PREMED_EARLY_STAGE_VERTICALS_NOTE,
  },
  {
    kind: "link",
    id: "introducing-float",
    link: {
      label: "Introducing Float",
      href: INTRODUCING_FLOAT_PATH,
      description:
        "An early look at Float as another layer of the Doe platform, focused on the operational work clinics rely on every day across the organization.",
    },
  },
  {
    kind: "link",
    id: "introducing-pulse",
    link: {
      label: "Introducing Pulse",
      href: INTRODUCING_PULSE_PATH,
      description:
        "An early introduction to Pulse and how Doe is building intelligent support for the daily workflows care teams already depend on.",
    },
  },
  {
    kind: "link",
    id: "pulse-call-history",
    link: {
      label: "Pulse: Call History",
      href: PULSE_CALL_HISTORY_PATH,
      description:
        "A closer look at how Pulse helps teams review past activity, understand outcomes, and maintain a dependable record over time.",
      nested: true,
    },
  },
  {
    kind: "link",
    id: "pulse-ambient",
    link: {
      label: "Pulse: Ambient",
      href: PULSE_AMBIENT_PATH,
      description:
        "How Pulse supports preparation before visits and keeps relevant context close during the moments that matter most in day-to-day care.",
      nested: true,
    },
  },
  {
    kind: "link",
    id: "introducing-fabric",
    link: {
      label: "Introducing Fabric",
      href: INTRODUCING_FABRIC_PATH,
      description:
        "An introduction to Fabric and how clinical teams can shape the tools they use without waiting on someone else's product plan.",
    },
  },
];
