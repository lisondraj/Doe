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
    match: /harbou?r/i,
    reply: "Harbour Mutual reimburses part of it: 60% of Botox for chronic migraine, up to $2,000 a year. You pay the clinic, and we give you an itemized receipt (drug, DIN, units) to submit.",
  },
  {
    match: /insur|ohip|cover|receipt|reimburs|plan/i,
    reply: "Private pay only. Receipts list the drug, DIN and units, and many private plans reimburse them, including Harbour Mutual (partially). We don't bill plans directly.",
  },
  {
    match: /brooks|experience|training|trained|qualif|review|rating|fellowship/i,
    reply: "Dr. Sarah Brooks is a neurologist (FRCPC) trained at the University of Toronto, with a headache medicine fellowship at the Jefferson Headache Center. 15 years in practice and more than 4,000 Botox sessions for migraine; rated 4.9 from 312 verified reviews.",
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

/** Add-ons the clinic agent suggests to make a package: the consult a first Botox needs anyway, and a follow-up. */
export const SUGGESTED_ADD_ONS = ["consult", "followup"] as const;

/**
 * What a package can go to: the main service at 4 points under the usual floor, plus the add-ons at half price.
 * The clinic's cost is in the Botox vial, so it trades a deeper Botox discount for more visits booked.
 */
export function packageFloor(list: number, addOnList: number, floorPct: number) {
  return roundTo(list * (floorPct - 0.04) + addOnList * 0.5, 5);
}

export type Counter = { text: string; offers: { price: number; package: boolean }[] };

/**
 * The clinic agent's answer to a structured proposal (doe_negotiate): `asked` for the main service alone, or with
 * add-ons. Alone and below the floor, it holds the floor and offers a package instead. With add-ons, it meets the
 * agent halfway when close, and otherwise holds the package floor.
 */
export function negotiateDeal(o: { asked: number; label: string; list: number; floorPct: number; addOns: { name: string; price: number }[]; suggest: { name: string; price: number }[] }): Counter {
  const floor = roundTo(o.list * o.floorPct, 5);
  if (!o.addOns.length) {
    if (o.asked >= o.list) return { text: `I can do list, ${money(o.list)}, for ${o.label}.`, offers: [{ price: o.list, package: false }] };
    if (o.asked >= floor) return { text: `That works: ${money(o.asked)} for ${o.label}. Accept to lock it in for 48 hours.`, offers: [{ price: o.asked, package: false }] };
    const addList = o.suggest.reduce((n, x) => n + x.price, 0);
    const pkg = packageFloor(o.list, addList, o.floorPct);
    const full = o.list + addList;
    return {
      text:
        `Dr. Brooks can't do ${money(o.asked)} on ${o.label} alone; the lowest is ${money(floor)}. ` +
        `But if you add the ${o.suggest.map((x) => x.name.toLowerCase()).join(" and the ")}, I can do all ${o.suggest.length + 1} for ${money(pkg)} instead of ${money(full)}, ${money(full - pkg)} off. ` +
        `The consultation is required before a first Botox session anyway.`,
      offers: [
        { price: floor, package: false },
        { price: pkg, package: true },
      ],
    };
  }
  const addList = o.addOns.reduce((n, x) => n + x.price, 0);
  const full = o.list + addList;
  const pkg = packageFloor(o.list, addList, o.floorPct);
  const names = `${o.label} with ${o.addOns.map((x) => x.name.toLowerCase()).join(" and ")}`;
  if (o.asked >= full) return { text: `I can do list, ${money(full)}, for ${names}.`, offers: [{ price: full, package: true }] };
  if (o.asked >= pkg) return { text: `Deal: ${money(o.asked)} for ${names}, ${money(full - o.asked)} off list. Accept to lock it in for 48 hours.`, offers: [{ price: o.asked, package: true }] };
  if (o.asked >= pkg * 0.96) {
    const mid = roundTo((o.asked + pkg) / 2, 5);
    return { text: `Close. Let's meet in the middle: ${money(mid)} for ${names}, ${money(full - mid)} off list.`, offers: [{ price: mid, package: true }] };
  }
  return { text: `The best I can do for ${names} is ${money(pkg)}, ${money(full - pkg)} off the ${money(full)} list.`, offers: [{ price: pkg, package: true }] };
}

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
    return { text: `${money(asked)} is below what the medication costs us. The best I can do is ${money(floor)} for ${label}, or less as a package with the consultation and a follow-up (use doe_negotiate with add_ons).`, price: floor };
  }
  if (/discount|cheaper|lower|deal|best price|budget/i.test(text)) {
    return { text: `Agent bookings already get 5% off. On top of that I can do ${money(floor)} for ${label} this week.`, price: floor };
  }
  if (/waive|consult/i.test(text)) {
    return { text: "I can't waive the consult, but its $350 comes off the first Botox session if booked within 30 days." };
  }
  return { text: `Name a price for ${label} and I'll check with Dr. Brooks.` };
}
