import { INTRODUCING_FABRIC_PATH } from "@/lib/blog/introducing-fabric-article";
import { INTRODUCING_FLOAT_PATH } from "@/lib/blog/introducing-float-article";
import { INTRODUCING_GENOME_PATH } from "@/lib/blog/introducing-genome-article";
import { GENOME_IS_BUILT_FOR_YOU_PATH } from "@/lib/blog/genome-is-built-for-you-article";
import { INTELLIGENCE_FOR_EVERY_CLINIC_PATH } from "@/lib/blog/intelligence-for-every-clinic-article";
import { INTRODUCING_PULSE_PATH } from "@/lib/blog/introducing-pulse-article";
import { PULSE_AMBIENT_PATH } from "@/lib/blog/pulse-ambient-article";
import { PULSE_CALL_HISTORY_PATH } from "@/lib/blog/pulse-call-history-article";

export type BroaderDoeVisionEarlyStageLink = {
  label: string;
  href: string;
  description: string;
  indent?: boolean;
};

export const BROADER_DOE_VISION_EARLY_STAGE_INTRO =
  "These articles trace what Doe is building in its early stages—product by product, and clinic by clinic.";

/** Featured posts for the Founder's Memo, excluding this page. Intelligence leads; Pulse sub-features nest beneath Introducing Pulse. */
export const BROADER_DOE_VISION_EARLY_STAGE_LINKS = [
  {
    label: "Intelligence for every clinic",
    href: INTELLIGENCE_FOR_EVERY_CLINIC_PATH,
    description:
      "Our proposal for clinic-owned intelligence—reinforcement learning, open-weight models on private compute, and Blended Intelligence designed for clinical operations.",
  },
  {
    label: "Genome is built for you",
    href: GENOME_IS_BUILT_FOR_YOU_PATH,
    description:
      "Ten capabilities that show how a clinic-specific model can reflect local workflows, reduce errors, lower cost, and keep patient context within your environment.",
  },
  {
    label: "Introducing Genome",
    href: INTRODUCING_GENOME_PATH,
    description:
      "Doe's approach to giving each clinic its own model—trained on approved workflows and deployed in dedicated private cloud infrastructure.",
  },
  {
    label: "Introducing Float",
    href: INTRODUCING_FLOAT_PATH,
    description:
      "A finance layer for claims, collections, payer calls, and management fees—built with voice agents and the Fabric agent builder.",
  },
  {
    label: "Introducing Pulse",
    href: INTRODUCING_PULSE_PATH,
    description:
      "Voice agents built for the workflows your clinic runs every day, from scheduling and payer hold times to front-desk triage on your existing phone line and software.",
  },
  {
    label: "Pulse: Call History",
    href: PULSE_CALL_HISTORY_PATH,
    description:
      "One workspace to replay agent calls, inspect actions, run prompt-based analysis, and keep a complete record of what Pulse handled.",
    indent: true,
  },
  {
    label: "Pulse: Ambient",
    href: PULSE_AMBIENT_PATH,
    description:
      "Prepares visits after agent calls, briefs physicians on the week ahead, and surfaces chart and call context during the appointment.",
    indent: true,
  },
  {
    label: "Introducing Fabric",
    href: INTRODUCING_FABRIC_PATH,
    description:
      "A visual agent builder that lets clinical teams design the workflows they actually run—in plain language, without waiting on a vendor roadmap.",
  },
] satisfies readonly BroaderDoeVisionEarlyStageLink[];
