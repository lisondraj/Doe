import type { ProtoCommunicationSlideId } from "@/lib/proto/proto-communication-gradients";

export type ProtoFeatureCopy = {
  titleLine1: string;
  /** Suspenseful second line — ends with a period. */
  titleLine2: string;
  description: string;
};

/** /proto feature sections — two-line titles + short white copy under each box. */
export const PROTO_FEATURE_COPY: Record<ProtoCommunicationSlideId, ProtoFeatureCopy> = {
  agents: {
    titleLine1: "Your whole roster.",
    titleLine2: "One live surface.",
    description:
      "Voice, scheduling, and labs automation in one deployment view — what is running, waiting, and ready to turn on. See live status and workflow assignment without jumping between tools.",
  },
  "front-desk": {
    titleLine1: "The phone won't stop.",
    titleLine2: "Neither does intake.",
    description:
      "Voice and scheduling agents handle answers and booking in parallel while your team stays with patients in the room. Patients get help immediately instead of waiting on hold or a callback.",
  },
  inbox: {
    titleLine1: "Documents pile up.",
    titleLine2: "Workflow sorts them.",
    description:
      "Labs, referrals, and prior auths route into the right chart automatically — outcomes stay visible without manual sorting. Your team spends less time chasing follow-ups and re-filing what already arrived.",
  },
  ambient: {
    titleLine1: "The patient is in frame.",
    titleLine2: "Just ask.",
    description:
      "Natural-language queries with chart context already loaded — trends, labs, and history while you stay at the point of care. No hunting through tabs or rebuilding context from scratch mid-visit.",
  },
  billing: {
    titleLine1: "Prior auth submitted.",
    titleLine2: "Payer still deciding.",
    description:
      "Clinical notes pulled, forms completed, and approval status tracked — without staff chasing portals and charts by hand. AI stays on the case until the payer decides, not your front desk.",
  },
  integrate: {
    titleLine1: "Every tool you use.",
    titleLine2: "One connective layer.",
    description:
      "EMRs, billing platforms, and clinical tools you already rely on — connected without ripping out what is in place. Doe meets your team where they work instead of forcing a rip-and-replace.",
  },
};

export function protoFeatureCopy(slideId: string): ProtoFeatureCopy | undefined {
  if (slideId in PROTO_FEATURE_COPY) {
    return PROTO_FEATURE_COPY[slideId as ProtoCommunicationSlideId];
  }
  return undefined;
}
