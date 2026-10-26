/**
 * /pricing sales tax: the state from the card's ZIP, and that state's sales tax rate on software sold as a service.
 * States that don't tax SaaS (or have no sales tax) come back at 0%. Rates are the state rate only, an estimate of
 * what's charged, not local add-ons.
 */

/** The first three digits of a US ZIP, as ranges, to the state they belong to. */
const ZIP3: [from: number, to: number, state: string][] = [
  [5, 5, "NY"], [6, 9, "PR"], [10, 27, "MA"], [28, 29, "RI"], [30, 38, "NH"], [39, 49, "ME"], [50, 59, "VT"],
  [60, 69, "CT"], [70, 89, "NJ"], [100, 149, "NY"], [150, 196, "PA"], [197, 199, "DE"], [200, 200, "DC"],
  [201, 201, "VA"], [202, 205, "DC"], [206, 219, "MD"], [220, 246, "VA"], [247, 268, "WV"], [270, 289, "NC"],
  [290, 299, "SC"], [300, 319, "GA"], [320, 349, "FL"], [350, 369, "AL"], [370, 385, "TN"], [386, 397, "MS"],
  [398, 399, "GA"], [400, 427, "KY"], [430, 459, "OH"], [460, 479, "IN"], [480, 499, "MI"], [500, 528, "IA"],
  [530, 549, "WI"], [550, 567, "MN"], [570, 577, "SD"], [580, 588, "ND"], [590, 599, "MT"], [600, 629, "IL"],
  [630, 658, "MO"], [660, 679, "KS"], [680, 693, "NE"], [700, 714, "LA"], [716, 729, "AR"], [730, 749, "OK"],
  [750, 799, "TX"], [800, 816, "CO"], [820, 831, "WY"], [832, 838, "ID"], [840, 847, "UT"], [850, 865, "AZ"],
  [870, 884, "NM"], [885, 885, "TX"], [889, 898, "NV"], [900, 961, "CA"], [967, 968, "HI"], [970, 979, "OR"],
  [980, 994, "WA"], [995, 999, "AK"],
];

/** Sales tax on SaaS by state, as a fraction. Any state not listed doesn't tax it. */
const SAAS_RATE: Record<string, number> = {
  AZ: 0.056, CT: 0.01, DC: 0.06, HI: 0.04, IA: 0.06, KY: 0.06, MA: 0.0625, MS: 0.07, NM: 0.04875, NY: 0.04,
  OH: 0.0575, PA: 0.06, PR: 0.115, RI: 0.07, SC: 0.06, SD: 0.042, TN: 0.07, TX: 0.05, UT: 0.061, WA: 0.065, WV: 0.06,
};

/** The state and rate for a typed ZIP, or null until it reads as a US ZIP (5 digits, or ZIP+4). */
export function taxForZip(zip: string): { state: string; rate: number } | null {
  const m = /^(\d{5})(-?\d{4})?$/.exec(zip.trim());
  if (!m) return null;
  const head = Number(m[1].slice(0, 3));
  const hit = ZIP3.find(([from, to]) => head >= from && head <= to);
  if (!hit) return null;
  return { state: hit[2], rate: SAAS_RATE[hit[2]] ?? 0 };
}

/** The tax on an amount in dollars, to the cent. */
export const taxOn = (amount: number, rate: number) => Math.round(amount * rate * 100) / 100;
