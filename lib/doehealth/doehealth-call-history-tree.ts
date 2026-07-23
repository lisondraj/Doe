/** /doehealth — call history tree (intro band card; mirrors product2 call history mock). */
import { PRODUCT2_LANDING_LIVE_CONVO } from "@/lib/product2/product2-copy";

const DOEHEALTH_CALL_HISTORY_INTRO_TURN_IDS = [
  "caller-open",
  "agent-intake",
  "caller-verify",
  "agent-verified",
] as const;

/** Opening call history turns through identity verification — matches /product2 call history rail. */
export const DOEHEALTH_CALL_HISTORY_INTRO_TURNS = DOEHEALTH_CALL_HISTORY_INTRO_TURN_IDS.map((id) => {
  const turn = PRODUCT2_LANDING_LIVE_CONVO.find((entry) => entry.id === id);
  if (!turn) {
    throw new Error(`Missing product2 live convo turn: ${id}`);
  }
  return turn;
});

export const DOEHEALTH_CALL_HISTORY_TREE = {
  heroName: "Sarah Westfield",
  phone: "(512) 555-0192",
  totalDuration: "0m54s",
  conditions: ["Type 2 Diabetes", "Hypertension", "Dyslipidemia"] as const,
  patientDetails: [
    { label: "Metformin refill booked", meta: "Tue 10:30 AM", icon: "calendar" as const },
    { label: "Blue Cross PPO", meta: "Verified", icon: "shield" as const },
    { label: "Last seen", meta: "Feb 12, 2026", icon: "clock" as const },
  ],
} as const;

/** /doehealth — incoming call card (intro band; animates to picked up). */
export const DOEHEALTH_INCOMING_CALL = {
  status: "Incoming call...",
  callerName: DOEHEALTH_CALL_HISTORY_TREE.heroName,
  phone: "(512) 555-0192",
  pickedUpBy: {
    prefix: "Picked up by",
    agent: "Doe Agent",
  },
  /** Card unblur + rise before call sequence starts. */
  revealDurationMs: 1400,
  /** Hold incoming state with gold motion after reveal. */
  incomingHoldMs: 3200,
} as const;

export const DOEHEALTH_INCOMING_CALL_PICKUP_DELAY_MS =
  DOEHEALTH_INCOMING_CALL.revealDurationMs + DOEHEALTH_INCOMING_CALL.incomingHoldMs;

/** Format elapsed call seconds as product mock duration (e.g. 0m38s). */
export function formatDoeHealthCallDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m${seconds}s`;
}

/** /doehealth — live call card (intro band top card). */
export const DOEHEALTH_CALL_IN_PROGRESS = {
  callerName: DOEHEALTH_CALL_HISTORY_TREE.heroName,
  duration: "0m38s",
  phone: "(512) 555-0192",
  pickedUpBy: {
    prefix: "Picked up by",
    agent: "Doe Agent",
  },
} as const;

export type DoeHealthCallHistoryTreeIcon = (typeof DOEHEALTH_CALL_HISTORY_TREE.patientDetails)[number]["icon"];
