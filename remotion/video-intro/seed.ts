import { PLANS, type PlanId } from "@/lib/doehealthdesk2/doehealthdesk2-pricing";
import { EARLYPREVIEW_MARKET_TARGETS as T } from "@/lib/earlypreview/earlypreview-market-copy";

/**
 * The film's Seed target, Q2 2028, priced at /pricing's rates: /earlypreview's index (15,000 organizations, 70% in
 * Canada), with more clinics claiming and paying to reach $250K ARR. Rows are practices by shape and plan.
 */
const monthly = (id: PlanId, providers: number, locations: number) => {
  const p = PLANS.find((plan) => plan.id === id)!;
  return p.base + p.perProvider * (providers - 1) + p.perLocation * (locations - 1);
};

const ROWS = [
  { id: "solo", name: "Solo", plan: "Basic", mo: monthly("basic", 1, 1), canada: 37, us: 16, locations: 1 },
  { id: "clinic-basic", name: "Clinic", plan: "Basic", mo: monthly("basic", 3, 1), canada: 25, us: 10, locations: 1 },
  { id: "clinic-advanced", name: "Clinic", plan: "Advanced", mo: monthly("advanced", 3, 1), canada: 25, us: 10, locations: 1 },
  { id: "group", name: "Multi-site", plan: "Advanced", mo: monthly("advanced", 6, 3), canada: 4, us: 1, locations: 3 },
].map((r) => ({ ...r, arr: (r.canada + r.us) * r.mo * 12 }));

const CLAIMED = { canada: 700, us: 300 };
const sum = (key: "canada" | "us" | "arr") => ROWS.reduce((s, r) => s + r[key], 0);
const PAYING = { canada: sum("canada"), us: sum("us") };
const ARR = sum("arr");
const LOCATIONS = ROWS.reduce((s, r) => s + (r.canada + r.us) * r.locations, 0);
const GROUPS = ROWS.filter((r) => r.locations > 1).reduce((s, r) => s + r.canada + r.us, 0);

const n = (v: number) => v.toLocaleString("en-US");
const k = (v: number) => `$${Math.round(v / 1000)}K`;
const fig = (text: string) => ({ text, figure: true as const });

export const SEED = {
  title: ["Target at Seed.", `${k(ARR)} ARR by Q2 2028.`],
  lines: [
    [fig(n(T.indexed)), { text: " organizations indexed" }],
    [fig(n(T.indexedCanada)), { text: " in Canada, " }, fig(n(T.indexedUs)), { text: " in the U.S." }],
    [fig(n(CLAIMED.canada + CLAIMED.us)), { text: " clinics claim their page" }],
    [fig(n(CLAIMED.canada + CLAIMED.us - PAYING.canada - PAYING.us)), { text: " on Free, " }, fig(n(PAYING.canada + PAYING.us)), { text: " paying practices" }],
    [fig(n(LOCATIONS)), { text: " paying locations, " }, fig(n(GROUPS)), { text: " multi-site groups" }],
    [fig(`${T.requestsK}K`), { text: " agent requests a month" }],
  ] as { text: string; figure?: true }[][],
  claimed: CLAIMED.canada + CLAIMED.us,
  table: {
    rows: [
      { id: "free", name: "Free", plan: "", price: "$0", canada: CLAIMED.canada - PAYING.canada, us: CLAIMED.us - PAYING.us, arr: "$0" },
      ...ROWS.map((r) => ({ id: r.id, name: r.name, plan: r.plan, price: `$${r.mo}`, canada: r.canada, us: r.us, arr: k(r.arr) })),
    ],
    total: { canada: PAYING.canada, us: PAYING.us, arr: k(ARR) },
  },
} as const;
