/**
 * The clinic's agent in /demo: canned replies to a personal agent's questions, and a simple counter-offer rule for
 * price negotiation. Nothing here is sent anywhere.
 */
import { money } from "@/lib/demo/demo-clinic";

export type DemoOfferTerms = { price: number; label: string; status: "open" | "accepted" | "declined" };

export type DemoMessage = {
  id: string;
  from: "clinic" | "agent" | "system";
  text: string;
  offer?: DemoOfferTerms;
  /** The time shown under the message. */
  at: string;
};

export type DemoThreadId = "concierge" | "negotiate" | "forms";

const ANSWERS: { match: RegExp; reply: string }[] = [
  {
    match: /unit|dose|how much botox|sites/i,
    reply: "Dr. Brooks follows the PREEMPT protocol: 155 units over 31 sites across the forehead, temples, back of the head, neck and shoulders. Some patients go up to 195 units.",
  },
  {
    match: /how (soon|long|fast)|start working|kick in|when will/i,
    reply: "Most patients see fewer headache days 2 to 3 weeks after the first session. Dr. Brooks reviews results after the second session, at about 24 weeks.",
  },
  {
    match: /side|risk|safe/i,
    reply: "The most common side effects are neck pain or stiffness and a brief headache where the injections went in. A drooping eyelid is uncommon and wears off.",
  },
  {
    match: /insur|ohip|cover|receipt|reimburs|plan/i,
    reply: "We're private pay only. Receipts list the drug, DIN and units, and many private plans reimburse them. We don't bill plans directly.",
  },
  {
    match: /cancel|resched|change/i,
    reply: "Changes are free up to 48 hours before. Inside 48 hours there's a $150 fee, waived once a year.",
  },
  {
    match: /park|transit|subway|where|address|get there/i,
    reply: "We're steps from St Patrick station on Line 1. Paid parking is under the building, entrance on Elm Street.",
  },
  {
    match: /referr|consult|first visit|new patient/i,
    reply: "No referral needed. A first Botox session needs a consult first, and the Start bundle does both in one visit.",
  },
  {
    match: /wait|soon|earliest|available/i,
    reply: "The earliest slot this week is Monday at 9:00 am with Dr. Brooks. If your user joins the Doe network, they'll get cancellation slots first.",
  },
];

export function conciergeReply(text: string): string {
  return (
    ANSWERS.find((a) => a.match.test(text))?.reply ??
    "Good question. I've passed it to Dr. Brooks' team and I'll reply in this thread within the hour."
  );
}

export function formsReply(): string {
  return "Thanks, I've passed that to our intake team. They'll reply here if anything else is needed.";
}

const roundTo = (n: number, step: number) => Math.round(n / step) * step;

/** The clinic's answer to a proposal on `label`, listed at `list`. */
export function negotiateReply(text: string, label: string, list: number): { text: string; offer?: DemoOfferTerms } {
  const asked = Number((text.match(/\$?\s?(\d[\d,]*)/)?.[1] ?? "").replace(/,/g, ""));
  const floor = roundTo(list * 0.92, 5);
  if (asked >= 100) {
    if (asked >= list * 0.95) {
      return { text: `That works. I can do ${money(asked)} for ${label}. Accept to lock it in for 48 hours.`, offer: { price: asked, label, status: "open" } };
    }
    if (asked >= list * 0.85) {
      const counter = Math.max(floor, roundTo((asked + list) / 2, 5));
      return {
        text: `Dr. Brooks can't go to ${money(asked)}, but I can do ${money(counter)} for ${label} if it's booked this week.`,
        offer: { price: counter, label, status: "open" },
      };
    }
    return {
      text: `${money(asked)} is below what the medication costs us. The best I can do is ${money(floor)} for ${label}. The Year of relief bundle also works out to $1,300 a session.`,
      offer: { price: floor, label, status: "open" },
    };
  }
  if (/discount|cheaper|lower|deal|best price|budget/i.test(text)) {
    return {
      text: `Booking through Doe already takes 5% off. On top of that, I can offer ${money(floor)} for ${label} if your user books this week.`,
      offer: { price: floor, label, status: "open" },
    };
  }
  if (/waive|consult/i.test(text)) {
    return { text: "I can't waive the consult, but its $350 comes off the first Botox session if it's booked within 30 days. The Start bundle does both for $1,650." };
  }
  return { text: `Tell me a price your user has in mind for ${label} and I'll check with Dr. Brooks.` };
}
