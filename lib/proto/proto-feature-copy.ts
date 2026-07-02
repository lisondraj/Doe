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
    titleLine1: "Recruit only the",
    titleLine2: "most talent.",
    description:
      "Post one role, then watch candidates enter a live sandbox where every action is tracked. Proto scores task outcomes, surfaces hidden signal, and lets you compare applicants side by side before you decide.",
  },
  "front-desk": {
    titleLine1: "Everything built",
    titleLine2: "within a sandbox.",
    description:
      "Applicants complete real tasks inside a sandbox that mirrors your product, engineering, data, and overall vision. You see how they think, where they trade off, and who can actually execute before the interview loop decides.",
  },
  inbox: {
    titleLine1: "Tracks. Compares.",
    titleLine2: "Chooses.",
    description:
      "Replay how each candidate worked, not just what they submitted. Head-to-head scorecards on the same rubric, then a ranked shortlist when you're ready. The hire gets obvious before anyone schedules a panel.",
  },
  ambient: {
    titleLine1: "Post challenges,",
    titleLine2: "hire the best.",
    description:
      "Companies publish open challenges in product, ops, engineering, etc., and any applicant can jump in. Proto captures every submission, scores the work, and surfaces the strongest talent before you ever open a req.",
  },
  billing: {
    titleLine1: "Analyzes in seconds,",
    titleLine2: "delivers to phone.",
    description:
      "Recruiters review candidate evals on mobile the moment work lands. Scores, replays, and shortlists sync to your phone so you can move on strong talent and fill roles whether you're at your desk or on the road.",
  },
  prototype: {
    titleLine1: "See if submissions",
    titleLine2: "fit your product.",
    description:
      "Take an applicant's prototype, gather real user feedback, and simulate it back inside your product before you ship. Proto shows how the idea lands with your users and where it might fit in your roadmap.",
  },
  integrate: {
    titleLine1: "Built on top",
    titleLine2: "of your stack.",
    description:
      "EMRs, billing platforms, and clinical tools you already rely on, connected without ripping out what is in place. Doe meets your team where they work instead of forcing a rip-and-replace.",
  },
};

export function protoFeatureCopy(slideId: string): ProtoFeatureCopy | undefined {
  if (slideId in PROTO_FEATURE_COPY) {
    return PROTO_FEATURE_COPY[slideId as ProtoCommunicationSlideId];
  }
  return undefined;
}
