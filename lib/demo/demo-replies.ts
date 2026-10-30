/**
 * The clinic's scripted agent in /demo: replies to a personal agent's questions, and a counter-offer rule for
 * price negotiation bounded by the clinic's floor. Clinic staff can always step in from /demo/clinic.
 */
import { money } from "@/lib/demo/demo-clinic";

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
    reply: "Private pay only. Receipts list the drug, DIN and units, and many private plans reimburse them. We don't bill plans directly.",
  },
  {
    match: /cancel|resched|change/i,
    reply: "Changes are free up to 48 hours before. Inside 48 hours there's a $150 fee, waived once a year.",
  },
  {
    match: /park|transit|subway|where|address|get there/i,
    reply: "Steps from St Patrick station on Line 1. Paid parking under the building, entrance on Elm Street.",
  },
  {
    match: /referr|consult|first visit|new patient/i,
    reply: "No referral needed. A first Botox session needs a consult first; the Start bundle does both in one visit.",
  },
];

export function conciergeReply(text: string, earliest: string | null): string {
  if (/earliest|availab|opening|next slot|wait ?list|how long.*wait/i.test(text)) {
    return earliest ? `The earliest open slot is ${earliest}.` : "Every slot this week is taken. I'll message you here if one opens.";
  }
  return (
    ANSWERS.find((a) => a.match.test(text))?.reply ??
    "Good question. I've passed it to Dr. Brooks' team; they'll reply in this thread."
  );
}

export function formsReply(): string {
  return "Thanks, passed to our intake team. They'll reply here if anything else is needed.";
}

const roundTo = (n: number, step: number) => Math.round(n / step) * step;

/** The clinic agent's answer to a proposal on `label`, listed at `list`, never below `floorPct` of list. */
export function negotiateReply(text: string, label: string, list: number, floorPct: number): { text: string; price?: number } {
  const asked = Number((text.match(/\$?\s?(\d[\d,]*)/)?.[1] ?? "").replace(/,/g, ""));
  const floor = roundTo(list * floorPct, 5);
  if (asked >= 100) {
    if (asked >= list) return { text: `${money(asked)} is at or above list. I can do ${money(list)} for ${label}.`, price: list };
    if (asked >= floor) return { text: `That works. ${money(asked)} for ${label}. Accept to lock it in for 48 hours.`, price: asked };
    const counter = Math.max(floor, roundTo((asked + list) / 2, 5));
    if (asked >= list * (floorPct - 0.08)) {
      return { text: `Dr. Brooks can't go to ${money(asked)}. I can do ${money(counter)} for ${label} if it's booked this week.`, price: counter };
    }
    return { text: `${money(asked)} is below what the medication costs us. The best I can do is ${money(floor)} for ${label}.`, price: floor };
  }
  if (/discount|cheaper|lower|deal|best price|budget/i.test(text)) {
    return { text: `Agent bookings already get 5% off. On top of that I can do ${money(floor)} for ${label} this week.`, price: floor };
  }
  if (/waive|consult/i.test(text)) {
    return { text: "I can't waive the consult, but its $350 comes off the first Botox session if booked within 30 days." };
  }
  return { text: `Name a price for ${label} and I'll check with Dr. Brooks.` };
}
