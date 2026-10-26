"use client";

/**
 * /pricing builder — the practice and plan, one question at a time: how the practice is set up (Solo, Single
 * location, or Multi-clinic, each with a small drawing of its shape), how many providers or which locations, the
 * specialty (picked from the set or typed), then the four tiers side by side with sliders for locations and
 * providers, and where to send the setup. Tiers stay out of sight until that comparison. Answers collect above the
 * card as pills you can tap to go back; once a plan is chosen its price stays in view. Flat cloud shapes sit behind.
 */
import { Fragment, type ReactNode, useEffect, useMemo, useRef, useState } from "react";

import {
  ANNUAL_FACTOR,
  type Bracket,
  bracketLabel,
  FEATURE_GROUPS,
  LOCATION_BRACKETS,
  PROVIDER_BRACKETS,
  type FeatureGroup,
  type Location,
  type PlanId,
  PLAN_ORDER,
  PLANS,
  PRACTICE_SHAPES,
  type PracticeShape,
  SPECIALTIES,
  SPECIALTY_FEATURES,
  type SpecialtyId,
  mixedPrice,
  type PriceRow,
} from "@/lib/doehealthdesk2/doehealthdesk2-pricing";
import { p22Mackinac } from "@/lib/home/fonts";

const DISPLAY = p22Mackinac.className;
const SUB = "text-[rgba(20,12,4,0.56)]";

const money = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
const includes = (plan: PlanId, from: PlanId) => PLAN_ORDER.indexOf(plan) >= PLAN_ORDER.indexOf(from);

type Answers = {
  shape: PracticeShape | null;
  clinicProviders: number;
  locations: Location[];
  specialty: SpecialtyId | "other" | null;
  otherSpecialty: string;
  /** Each location's plan when a multi-clinic group mixes plans; unset locations follow the chosen plan. */
  planOf: Record<string, PlanId>;
  /** How a single location's providers are split across plans, or null for everyone on the chosen plan. */
  split: Partial<Record<PlanId, number>> | null;
  plan: PlanId | null;
  annual: boolean;
  contact: { name: string; email: string; practice: string };
};

const START: Answers = {
  shape: null,
  clinicProviders: 4,
  locations: [
    { id: "l1", name: "Downtown Clinic", providers: 6 },
    { id: "l2", name: "North Clinic", providers: 3 },
  ],
  specialty: null,
  otherSpecialty: "",
  planOf: {},
  split: null,
  plan: null,
  annual: true,
  contact: { name: "", email: "", practice: "" },
};

/** The shape of each kind of practice: buildings as outlines, providers as dots. */
function ShapeMark({ shape, on }: { shape: PracticeShape; on: boolean }) {
  const line = on ? "#FCCFB8" : "#281910";
  const dot = on ? "#FFFCF1" : "#281910";
  const building = (x: number, w: number, dots: number, key: string) => (
    <g key={key}>
      <rect x={x} y="10" width={w} height="34" rx="8" fill="none" stroke={line} strokeWidth="1.6" />
      {Array.from({ length: dots }, (_, i) => {
        const cols = Math.min(dots, 2);
        const gap = w / (cols + 1);
        return <circle key={i} cx={x + gap * ((i % cols) + 1)} cy={22 + Math.floor(i / cols) * 11} r="3.2" fill={dot} />;
      })}
    </g>
  );
  return (
    <svg width="88" height="52" viewBox="0 0 88 52" aria-hidden="true" style={{ display: "block" }}>
      {shape === "solo" && building(28, 32, 1, "a")}
      {shape === "clinic" && building(22, 44, 4, "a")}
      {shape === "group" && [building(4, 24, 2, "a"), building(32, 24, 3, "b"), building(60, 24, 2, "c")]}
    </svg>
  );
}

function Count({ value, onChange, min = 1, max = 60, big = true }: { value: number; onChange: (v: number) => void; min?: number; max?: number; big?: boolean }) {
  const size = big ? "w-[52px] h-[52px] text-[24px]" : "w-[38px] h-[38px] text-[18px]";
  const btn = `${size} flex items-center justify-center rounded-[999px] bg-[#F4EEDF] hover:bg-[#EDE5D2] text-[#281910] leading-none transition-colors duration-150 disabled:opacity-35`;
  return (
    <span className="inline-flex items-center gap-[6px] p-[4px] rounded-[999px] bg-[#FFFCF1]">
      <button type="button" aria-label="Fewer" disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))} className={btn}>
        −
      </button>
      <span className={`${big ? "w-[76px] text-[40px] leading-[44px]" : "w-[44px] text-[22px] leading-[26px]"} text-center ${DISPLAY} text-[#281910] [font-variant-numeric:tabular-nums]`}>{value}</span>
      <button type="button" aria-label="More" disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))} className={btn}>
        +
      </button>
    </span>
  );
}

/** A slider in Doe's colours: a beige track that fills ink up to an ink thumb, with its value beside the label. */
function Slider({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <label className="flex flex-col gap-[8px] grow basis-[0px] min-w-[0px] px-[16px] py-[12px] rounded-[20px] bg-[#FFFCF1]">
      <span className="flex items-baseline justify-between">
        <span className={`text-[14px] leading-[18px] font-[500] ${SUB}`}>{label}</span>
        <span className={`text-[24px] leading-[26px] tracking-[-0.02em] ${DISPLAY} text-[#281910] [font-variant-numeric:tabular-nums]`}>{value}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ background: `linear-gradient(90deg, #281910 ${pct}%, #EDE5D2 ${pct}%)` }}
        className="w-full h-[6px] rounded-[99px] appearance-none outline-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[22px] [&::-webkit-slider-thumb]:h-[22px] [&::-webkit-slider-thumb]:rounded-[999px] [&::-webkit-slider-thumb]:bg-[#281910] [&::-webkit-slider-thumb]:border-[4px] [&::-webkit-slider-thumb]:border-solid [&::-webkit-slider-thumb]:border-[#FFFCF1] [&::-moz-range-thumb]:w-[16px] [&::-moz-range-thumb]:h-[16px] [&::-moz-range-thumb]:rounded-[999px] [&::-moz-range-thumb]:bg-[#281910] [&::-moz-range-thumb]:border-[4px] [&::-moz-range-thumb]:border-solid [&::-moz-range-thumb]:border-[#FFFCF1]"
      />
    </label>
  );
}

/** A location's plan, as a small pill-shaped select. */
function PlanSelect({ value, onChange, label }: { value: PlanId; onChange: (v: PlanId) => void; label: string }) {
  return (
    <span className="relative flex items-center">
      <select
        value={value}
        aria-label={label}
        onChange={(e) => onChange(e.target.value as PlanId)}
        className="appearance-none h-[38px] pl-[14px] pr-[30px] rounded-[999px] bg-[#281910] text-[14px] leading-[18px] font-[500] text-[#FFFCF1] outline-none cursor-pointer"
      >
        {PLANS.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
      <svg width="11" height="11" viewBox="0 0 24 24" aria-hidden="true" className="pointer-events-none absolute right-[12px]" style={{ display: "block" }}>
        <path d="M6 9l6 6 6-6" fill="none" stroke="#FCCFB8" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

/** One volume-discount ladder, with the step the practice is on filled in. */
function Ladder({ title, brackets, n, noun }: { title: string; brackets: Bracket[]; n: number; noun: string }) {
  return (
    <div className="flex flex-col gap-[8px]">
      <span className="text-[14px] leading-[18px] font-[500] text-[rgba(255,252,241,0.7)]">{title}</span>
      <div className="grid grid-cols-4 gap-[4px]">
        {brackets.map((b) => {
          const on = n >= b.min && n <= b.max;
          return (
            <span key={b.min} className={`flex flex-col gap-[2px] px-[10px] py-[8px] rounded-[14px] transition-colors duration-200 ${on ? "bg-[#FCCFB8] text-[#140C04]" : "bg-[rgba(255,252,241,0.08)] text-[#FFFCF1]"}`}>
              <span className={`text-[16px] leading-[20px] ${DISPLAY}`}>{b.off ? `−${Math.round(b.off * 100)}%` : "—"}</span>
              <span className={`text-[11px] leading-[14px] ${on ? "text-[rgba(20,12,4,0.7)]" : "text-[rgba(255,252,241,0.55)]"}`}>
                {bracketLabel(b)} {noun}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

function Mark({ on, dark = false }: { on: boolean; dark?: boolean }) {
  return on ? (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-label="Included" style={{ display: "block" }}>
      <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke={dark ? "#FCCFB8" : "#281910"} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <span aria-label="Not included" className={`block w-[12px] h-[1.5px] rounded-[2px] ${dark ? "bg-[rgba(255,252,241,0.3)]" : "bg-[rgba(20,12,4,0.2)]"}`} />
  );
}

function TextField({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <label className="flex flex-col gap-[8px] min-w-[0px]">
      <span className={`text-[14px] leading-[18px] font-[500] ${SUB}`}>{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="h-[56px] px-[20px] rounded-[20px] bg-[#FFFCF1] border-[1.5px] border-solid border-transparent focus:border-[#281910] outline-none text-[17px] leading-[22px] text-[#140C04] placeholder:text-[rgba(20,12,4,0.32)] transition-colors duration-150"
      />
    </label>
  );
}

type Question = {
  id: string;
  title: string;
  /** What the answer reads as in the trail above the card. */
  answer: string;
  /** Single-choice questions move on by themselves. */
  auto?: boolean;
  /** The comparison needs more room than a question. */
  wide?: boolean;
  ready: boolean;
  body: ReactNode;
};

export function DoeHealthPricingBuilder({ phone }: { phone: boolean }) {
  const [a, setA] = useState<Answers>(START);
  const [at, setAt] = useState(0);
  const [breakdown, setBreakdown] = useState(false);
  /** Where the controls pin to once they reach the top of the screen, or null while they sit in place. */
  const [pinned, setPinned] = useState<{ left: number; width: number; height: number } | null>(null);
  const barSlot = useRef<HTMLDivElement>(null);
  const pinTop = phone ? 92 : 112;
  const [done, setDone] = useState(false);
  const nextId = useRef(3);
  const cardRef = useRef<HTMLDivElement>(null);
  const advance = useRef<number | null>(null);
  const moved = useRef(false);

  const set = (patch: Partial<Answers>) => setA((prev) => ({ ...prev, ...patch }));

  const sites: Location[] = useMemo(() => {
    if (a.shape === "clinic") return [{ id: "clinic", name: "Your location", providers: a.clinicProviders }];
    if (a.shape === "group") return a.locations;
    return [{ id: "solo", name: "Your practice", providers: 1 }];
  }, [a.shape, a.clinicProviders, a.locations]);

  const plan = PLANS.find((p) => p.id === (a.plan ?? "advanced"))!;
  const planById = (id: PlanId) => PLANS.find((p) => p.id === id)!;
  const factor = a.annual ? ANNUAL_FACTOR : 1;

  /** The practice as rows on plans: each location for a group, each plan's share of providers for a split. */
  const rows: PriceRow[] =
    a.shape === "group"
      ? a.locations.map((l) => ({ id: l.id, name: l.name, providers: l.providers, plan: planById(a.planOf[l.id] ?? plan.id), location: true }))
      : a.shape === "clinic" && a.split
        ? PLAN_ORDER.filter((id) => (a.split![id] ?? 0) > 0).map((id) => ({ id, name: `On ${planById(id).name}`, providers: a.split![id]!, plan: planById(id), location: false }))
        : [{ id: "all", name: sites[0]!.name, providers: sites.reduce((n, x) => n + x.providers, 0), plan, location: false }];
  const priced = mixedPrice(rows);
  const mixed = rows.some((r) => r.plan.id !== plan.id);
  const providerCount = priced.providers;
  const locationCount = a.shape === "group" ? a.locations.length : 1;
  /** Each tier's price with the whole practice on it, for the comparison. */
  const priceOf = (id: PlanId) => mixedPrice(rows.map((r) => ({ ...r, plan: planById(id) }))).total * factor;
  const total = priced.total * factor;
  const specialtyLabel = a.specialty === "other" ? a.otherSpecialty.trim() : SPECIALTIES.find((s) => s.id === a.specialty)?.label ?? "";

  /** Every feature group, with the practice's specialty set added for Doe One. */
  const groups: FeatureGroup[] = [
    ...FEATURE_GROUPS.slice(0, -2),
    {
      title: specialtyLabel ? `${specialtyLabel} features` : "Specialty features",
      from: "one",
      items: a.specialty && a.specialty !== "other" ? SPECIALTY_FEATURES[a.specialty] : ["Workflows for your specialty, set up with your onboarding lead"],
    },
    ...FEATURE_GROUPS.slice(-2),
  ];

  function pick(patch: Partial<Answers>) {
    set(patch);
    if (advance.current) window.clearTimeout(advance.current);
    advance.current = window.setTimeout(() => setAt((i) => i + 1), 340);
  }

  const shapeAnswer = (() => {
    if (a.shape === "solo") return "Solo";
    if (a.shape === "clinic") return `Single location, ${plural(a.clinicProviders, "provider")}`;
    if (a.shape === "group") return `Multi-clinic, ${plural(a.locations.length, "location")}`;
    return "";
  })();

  /** One location's providers: a solo practice that grows past one becomes a single location. */
  const setProviders = (n: number) => set(n > 1 ? { shape: "clinic", clinicProviders: n } : { shape: a.shape === "clinic" ? "clinic" : "solo", clinicProviders: 1 });
  const editLocation = (id: string, patch: Partial<Location>) => set({ locations: a.locations.map((x) => (x.id === id ? { ...x, ...patch } : x)) });
  const splitTotal = a.split ? PLAN_ORDER.reduce((n, id) => n + (a.split![id] ?? 0), 0) : 0;

  /** Picking a tier in the table puts the whole practice on it. */
  const choose = (id: PlanId) => {
    set({ plan: id, planOf: {}, split: null });
    if (!phone) setBreakdown(true);
  };

  const cols = phone ? "grid-cols-[150px_repeat(4,128px)]" : "grid-cols-[minmax(180px,1.5fr)_repeat(4,minmax(120px,1fr))]";
  const lit = (id: PlanId) => a.plan === id && !mixed;
  const cell = (id: PlanId) => `flex justify-center self-stretch items-center ${lit(id) ? "bg-[#281910]" : ""}`;
  const first = `sticky left-0 z-[1] ${phone ? "bg-[#FFFCF1]" : ""}`;

  /** Every tier side by side: price and a choose button up top, then each feature group and its items. */
  const comparison = (
    <div className={phone ? "-mx-[20px] px-[20px] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" : ""}>
      <div className={`grid ${cols} rounded-[28px] bg-[#FFFCF1] overflow-clip ${phone ? "w-max" : ""}`}>
        <span className={first} />
        {PLANS.map((p) => {
          const on = lit(p.id);
          return (
            <div key={p.id} className={`flex flex-col gap-[12px] p-[18px] pb-[20px] transition-colors duration-200 ${on ? "bg-[#281910] text-[#FFFCF1]" : "text-[#281910]"}`}>
              <span className="flex flex-col gap-[2px]">
                <span className="flex h-[22px] mb-[4px]">
                  {p.id === "advanced" && <span className="h-[22px] px-[9px] flex items-center rounded-[999px] bg-[#FCCFB8] text-[11px] leading-[14px] font-[600] text-[#140C04] whitespace-nowrap">Most chosen</span>}
                </span>
                <span className={`text-[22px] leading-[26px] tracking-[-0.02em] ${DISPLAY}`}>{p.name}</span>
                <span className={`text-[13px] leading-[17px] min-h-[34px] ${on ? "text-[rgba(255,252,241,0.68)]" : SUB}`}>{p.line}</span>
              </span>
              <span className="flex items-baseline gap-[3px]">
                <span className={`text-[32px] leading-[34px] tracking-[-0.035em] ${DISPLAY} [font-variant-numeric:tabular-nums]`}>{money(priceOf(p.id))}</span>
                <span className={`text-[13px] ${on ? "text-[rgba(255,252,241,0.6)]" : SUB}`}>/mo</span>
              </span>
              <button
                type="button"
                onClick={() => choose(p.id)}
                className={`h-[40px] rounded-[999px] text-[14px] leading-[18px] font-[500] transition-colors duration-200 ${on ? "bg-[#FCCFB8] text-[#140C04]" : "bg-[#F4EEDF] hover:bg-[#EDE5D2] text-[#281910]"}`}
              >
                {on ? "Selected" : "Choose"}
              </button>
            </div>
          );
        })}
        {groups.map((g) => (
          <Fragment key={g.title}>
            <span className={`${first} px-[20px] pt-[18px] pb-[6px] border-t border-solid border-[rgba(20,12,4,0.07)] text-[15px] leading-[20px] font-[600] text-[#140C04]`}>{g.title}</span>
            {PLAN_ORDER.map((id) => (
              <span key={id} className={`${cell(id)} border-t border-solid border-[rgba(20,12,4,0.07)]`} />
            ))}
            {g.items.map((item) => (
              <Fragment key={item}>
                <span className={`${first} px-[20px] py-[7px] text-[14px] leading-[19px] ${SUB}`}>{item}</span>
                {PLAN_ORDER.map((id) => (
                  <span key={id} className={cell(id)}>
                    <Mark on={includes(id, g.from)} dark={lit(id)} />
                  </span>
                ))}
              </Fragment>
            ))}
          </Fragment>
        ))}
        <span className={`${first} h-[16px]`} />
        {PLAN_ORDER.map((id) => (
          <span key={id} className={cell(id)} />
        ))}
      </div>
    </div>
  );

  const questions: Question[] = [
    {
      id: "shape",
      title: "How is your practice set up?",
      answer: shapeAnswer,
      auto: true,
      ready: !!a.shape,
      body: (
        <div className={`grid gap-[10px] ${phone ? "grid-cols-1" : "grid-cols-3"}`}>
          {PRACTICE_SHAPES.map((s) => {
            const on = a.shape === s.id;
            return (
              <button
                key={s.id}
                type="button"
                aria-pressed={on}
                onClick={() => pick({ shape: s.id })}
                className={`flex ${phone ? "flex-row items-center gap-[16px] p-[16px]" : "flex-col items-start gap-[26px] p-[22px]"} rounded-[26px] text-left transition-colors duration-200 ${on ? "bg-[#281910] text-[#FFFCF1]" : "bg-[#FFFCF1] text-[#281910] hover:bg-white"}`}
              >
                <span className={`shrink-0 flex items-center justify-center rounded-[18px] ${phone ? "w-[96px] h-[64px]" : "w-full h-[92px]"} ${on ? "bg-[rgba(255,252,241,0.08)]" : "bg-[#F7F1E3]"}`}>
                  <ShapeMark shape={s.id} on={on} />
                </span>
                <span className="flex flex-col gap-[2px]">
                  <span className={`text-[24px] leading-[28px] tracking-[-0.02em] ${DISPLAY}`}>{s.title}</span>
                  <span className={`text-[15px] leading-[20px] ${on ? "text-[rgba(255,252,241,0.68)]" : SUB}`}>{s.note}</span>
                </span>
              </button>
            );
          })}
        </div>
      ),
    },
    ...(a.shape === "clinic"
      ? [
          {
            id: "count",
            title: "How many providers?",
            answer: "",
            ready: true,
            body: (
              <div className="flex justify-center py-[18px]">
                <Count value={a.clinicProviders} onChange={(v) => set({ clinicProviders: v })} />
              </div>
            ),
          },
        ]
      : []),
    ...(a.shape === "group"
      ? [
          {
            id: "sites",
            title: "Your locations",
            answer: "",
            ready: a.locations.every((l) => l.name.trim()),
            body: (
              <div className="flex flex-col gap-[8px]">
                <span className={`flex justify-between px-[20px] text-[13px] leading-[16px] font-[500] ${SUB}`}>
                  <span>Location</span>
                  <span className={phone ? "pr-[34px]" : "pr-[86px]"}>Providers</span>
                </span>
                {a.locations.map((l, i) => (
                  <div key={l.id} className="flex items-center gap-[10px] p-[8px] pl-[20px] rounded-[22px] bg-[#FFFCF1]">
                    <input
                      value={l.name}
                      aria-label={`Location ${i + 1}`}
                      onChange={(e) => set({ locations: a.locations.map((x) => (x.id === l.id ? { ...x, name: e.target.value } : x)) })}
                      className="grow min-w-[0px] h-[40px] bg-transparent outline-none text-[17px] leading-[22px] font-[500] text-[#140C04]"
                    />
                    <span className="[&>span]:bg-[#F4EEDF] shrink-0">
                      <Count big={false} value={l.providers} onChange={(v) => set({ locations: a.locations.map((x) => (x.id === l.id ? { ...x, providers: v } : x)) })} />
                    </span>
                    {!phone && (
                      <button
                        type="button"
                        aria-label={`Remove ${l.name}`}
                        disabled={a.locations.length <= 2}
                        onClick={() => set({ locations: a.locations.filter((x) => x.id !== l.id) })}
                        className="w-[38px] h-[38px] shrink-0 flex items-center justify-center rounded-[999px] text-[#281910] hover:bg-[#F4EEDF] disabled:opacity-25 transition-colors duration-150"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
                          <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                <span className="flex gap-[8px] flex-wrap pt-[4px]">
                  <button
                    type="button"
                    onClick={() => set({ locations: [...a.locations, { id: `l${nextId.current++}`, name: `Location ${a.locations.length + 1}`, providers: 2 }] })}
                    className="flex items-center gap-[8px] h-[44px] px-[18px] rounded-[999px] border-[1.5px] border-dashed border-[rgba(20,12,4,0.22)] hover:bg-[#FFFCF1] text-[15px] leading-[20px] font-[500] text-[#281910] transition-colors duration-150"
                  >
                    <span className="text-[18px] leading-[18px]">+</span>
                    Add a location
                  </button>
                  {phone && a.locations.length > 2 && (
                    <button type="button" onClick={() => set({ locations: a.locations.slice(0, -1) })} className={`h-[44px] px-[18px] rounded-[999px] text-[15px] leading-[20px] font-[500] ${SUB} hover:text-[#281910]`}>
                      Remove last
                    </button>
                  )}
                </span>
              </div>
            ),
          },
        ]
      : []),
    {
      id: "specialty",
      title: "What’s your specialty?",
      answer: specialtyLabel,
      auto: a.specialty !== "other",
      ready: !!specialtyLabel,
      body: (
        <div className="flex flex-col gap-[12px]">
          <div className={`grid gap-[8px] ${phone ? "grid-cols-2" : "grid-cols-4"}`}>
            {SPECIALTIES.map((s) => {
              const on = a.specialty === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => pick({ specialty: s.id })}
                  className={`h-[64px] px-[16px] rounded-[22px] text-[17px] leading-[22px] font-[500] transition-colors duration-200 ${on ? "bg-[#281910] text-[#FFFCF1]" : "bg-[#FFFCF1] text-[#281910] hover:bg-white"}`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
          <label
            className={`flex items-center h-[58px] px-[22px] rounded-[22px] border-[1.5px] border-solid transition-colors duration-200 ${a.specialty === "other" ? "bg-[#FFFCF1] border-[#281910]" : "bg-[rgba(255,252,241,0.55)] border-transparent"}`}
          >
            <input
              value={a.otherSpecialty}
              placeholder="Something else? Type it"
              aria-label="Another specialty"
              onFocus={() => set({ specialty: "other" })}
              onChange={(e) => set({ specialty: "other", otherSpecialty: e.target.value })}
              className="grow min-w-[0px] bg-transparent outline-none text-[17px] leading-[22px] text-[#140C04] placeholder:text-[rgba(20,12,4,0.4)]"
            />
          </label>
        </div>
      ),
    },
    {
      id: "plan",
      title: "Compare plans",
      answer: a.plan ? `${mixed ? "Mixed plans" : plan.name}${priced.top.base ? `, ${money(total)}/mo` : ""}` : "",
      wide: true,
      ready: !!a.plan,
      body: (
        <div className="flex flex-col gap-[14px]">
          <div ref={barSlot} style={{ height: pinned?.height }}>
          <div
            className={`z-30 flex gap-[6px] p-[6px] rounded-[26px] bg-[rgba(237,229,210,0.94)] [backdrop-filter:blur(14px)] ${phone ? "flex-col" : "items-stretch"} ${pinned ? "fixed" : ""}`}
            style={pinned ? { top: pinTop, left: pinned.left, width: pinned.width } : undefined}
          >
            {a.shape === "group" ? (
              <div className="flex gap-[6px] grow min-w-[0px] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {a.locations.map((l, i) => (
                  <span key={l.id} className="flex flex-col gap-[8px] w-[276px] shrink-0 p-[10px] pl-[14px] rounded-[20px] bg-[#FFFCF1]">
                    <input
                      value={l.name}
                      aria-label={`Location ${i + 1}`}
                      onChange={(e) => editLocation(l.id, { name: e.target.value })}
                      className="h-[24px] bg-transparent outline-none text-[15px] leading-[20px] font-[600] text-[#140C04]"
                    />
                    <span className="flex items-center justify-between gap-[6px]">
                      <span className="[&>span]:bg-[#F4EEDF] [&>span]:p-[2px]">
                        <Count big={false} value={l.providers} max={100} onChange={(v) => editLocation(l.id, { providers: v })} />
                      </span>
                      <PlanSelect value={a.planOf[l.id] ?? plan.id} label={`${l.name} plan`} onChange={(v) => set({ plan: a.plan ?? "advanced", planOf: { ...a.planOf, [l.id]: v } })} />
                    </span>
                  </span>
                ))}
                <button
                  type="button"
                  onClick={() => set({ locations: [...a.locations, { id: `l${nextId.current++}`, name: `Location ${a.locations.length + 1}`, providers: 2 }] })}
                  className="flex flex-col items-center justify-center gap-[2px] w-[96px] shrink-0 rounded-[20px] border-[1.5px] border-dashed border-[rgba(20,12,4,0.22)] hover:bg-[#FFFCF1] text-[13px] leading-[16px] font-[500] text-[#281910] transition-colors duration-150"
                >
                  <span className="text-[20px] leading-[20px]">+</span>
                  Location
                </button>
              </div>
            ) : a.split ? (
              <div className="flex gap-[6px] grow min-w-[0px] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {PLANS.map((p) => (
                  <span key={p.id} className="flex flex-col gap-[8px] w-[164px] shrink-0 p-[10px] pl-[14px] rounded-[20px] bg-[#FFFCF1]">
                    <span className="text-[14px] leading-[18px] font-[600] text-[#140C04]">{p.name}</span>
                    <span className="[&>span]:bg-[#F4EEDF] [&>span]:p-[2px] self-start">
                      <Count big={false} min={0} max={100} value={a.split![p.id] ?? 0} onChange={(v) => set({ split: { ...a.split, [p.id]: v } })} />
                    </span>
                  </span>
                ))}
              </div>
            ) : (
              <Slider label="Providers" value={providerCount} min={1} max={100} onChange={setProviders} />
            )}
            {a.shape !== "group" && providerCount > 1 && (
              <button
                type="button"
                onClick={() => set(a.split ? { split: null, clinicProviders: Math.max(1, splitTotal) } : { split: { [plan.id]: providerCount } })}
                className={`shrink-0 px-[16px] rounded-[20px] bg-[#FFFCF1] hover:bg-white text-[14px] leading-[18px] font-[500] text-[#281910] transition-colors duration-150 ${phone ? "h-[44px]" : ""}`}
              >
                {a.split ? "One plan for all" : "Split across plans"}
              </button>
            )}
            <span className={`flex items-center gap-[8px] px-[10px] py-[8px] rounded-[20px] bg-[#FFFCF1] ${phone ? "justify-between" : "shrink-0 flex-col justify-center"}`}>
              <span className="flex p-[3px] gap-[2px] rounded-[999px] bg-[#F4EEDF]">
                {(["monthly", "annual"] as const).map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => set({ annual: b === "annual" })}
                    className={`h-[32px] px-[14px] rounded-[999px] text-[13px] leading-[16px] font-[500] transition-colors duration-200 ${(b === "annual") === a.annual ? "bg-[#281910] text-[#FFFCF1]" : `${SUB} hover:text-[#281910]`}`}
                  >
                    {b === "annual" ? "Yearly" : "Monthly"}
                  </button>
                ))}
              </span>
              <span className={`text-[12px] leading-[16px] ${SUB}`}>2 months free yearly</span>
            </span>
          </div>
          </div>
          {comparison}
        </div>
      ),
    },
    {
      id: "contact",
      title: a.plan === "free" ? "Claim your clinic" : "Where should we send your setup?",
      answer: a.contact.email,
      ready: !!(a.contact.name.trim() && /.+@.+\..+/.test(a.contact.email) && a.contact.practice.trim()),
      body: (
        <div className={`grid gap-[12px] ${phone ? "grid-cols-1" : "grid-cols-2"}`}>
          <TextField label="Your name" value={a.contact.name} onChange={(v) => set({ contact: { ...a.contact, name: v } })} placeholder="Jane Smith" />
          <TextField label="Practice name" value={a.contact.practice} onChange={(v) => set({ contact: { ...a.contact, practice: v } })} placeholder="Northside Family Medicine" />
          <div className={phone ? "" : "col-span-2"}>
            <TextField label="Work email" type="email" value={a.contact.email} onChange={(v) => set({ contact: { ...a.contact, email: v } })} placeholder="jane@yourclinic.com" />
          </div>
        </div>
      ),
    },
  ];

  const index = Math.min(at, questions.length - 1);
  const q = questions[index]!;
  const last = index === questions.length - 1;
  const progress = done ? 1 : index / questions.length;
  const wide = !done && q.wide;

  const forward = () => {
    if (!q.ready) return;
    if (last) setDone(true);
    else setAt(index + 1);
  };

  useEffect(
    () => () => {
      if (advance.current) window.clearTimeout(advance.current);
    },
    [],
  );

  // Keep the question in view as it changes, without jumping on first load.
  useEffect(() => {
    if (!moved.current) {
      moved.current = true;
      return;
    }
    const el = cardRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top;
    const offset = phone ? 150 : 230;
    if (top < offset - 20 || top > window.innerHeight * 0.55) window.scrollTo({ top: window.scrollY + top - offset, behavior: "smooth" });
  }, [index, done, phone]);

  const trail = questions.slice(0, done ? questions.length : index).filter((x) => x.answer);

  // The controls follow the comparison down the page. Sticky can't do it here, so pin them once they reach the top.
  useEffect(() => {
    if (done || q.id !== "plan") {
      setPinned(null);
      return;
    }
    const update = () => {
      const slot = barSlot.current;
      const body = slot?.parentElement;
      if (!slot || !body) return;
      const r = slot.getBoundingClientRect();
      const end = body.getBoundingClientRect().bottom;
      const height = (slot.firstElementChild as HTMLElement | null)?.offsetHeight ?? r.height;
      setPinned(r.top < pinTop && end > pinTop + height + 40 ? { left: r.left, width: r.width, height } : null);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [done, q.id, pinTop, breakdown]);

  /** The chosen plan's price: a sticky pill above the question on desktop, a bar along the bottom on iPhone. */
  const onPlan = !done && q.id === "plan";
  const showBreakdown = !!a.plan && onPlan && breakdown;
  const priceBar = a.plan && (phone || !onPlan || !breakdown) ? (
    <div
      className={`doe-pricing-rise z-40 flex items-center gap-[14px] bg-[#281910] text-[#FFFCF1] ${phone ? "fixed left-[10px] right-[10px] bottom-[max(10px,env(safe-area-inset-bottom))] p-[12px] pl-[20px] rounded-[22px]" : "sticky top-[124px] self-center h-[64px] pl-[24px] pr-[10px] rounded-[999px]"}`}
    >
      <span className="flex flex-col grow min-w-[0px]">
        <span className="flex items-baseline gap-[6px] whitespace-nowrap">
          <span className={`text-[26px] leading-[30px] tracking-[-0.03em] ${DISPLAY} [font-variant-numeric:tabular-nums]`}>{money(total)}</span>
          <span className="text-[13px] text-[rgba(255,252,241,0.65)]">/mo{a.annual && priced.top.base ? ", billed yearly" : ""}</span>
        </span>
        <span className="truncate text-[12px] leading-[16px] text-[rgba(255,252,241,0.62)]">
          {mixed ? "Mixed plans" : plan.name} · {plural(providerCount, "provider")} · {plural(locationCount, "location")}
        </span>
      </span>
      {(onPlan || phone) && (
        <button
          type="button"
          onClick={() => setBreakdown(true)}
          className="h-[44px] px-[16px] shrink-0 rounded-[999px] bg-[rgba(255,252,241,0.12)] hover:bg-[rgba(255,252,241,0.18)] text-[14px] leading-[18px] font-[500] text-[#FFFCF1] transition-colors duration-150"
        >
          Breakdown
        </button>
      )}
    </div>
  ) : null;

  const subtotal = priced.total;
  const planLabel = mixed ? "Mixed plans" : plan.name;
  const lines: { label: string; value: number; minus?: boolean }[] = priced.top.base
    ? [
        { label: `${priced.top.name} base`, value: priced.top.base },
        ...priced.rowGross
          .filter((g) => g.providers + g.location > 0)
          .map((g) => ({
            label: `${g.row.name}, ${plural(g.row.providers, "provider")}${mixed || a.shape === "group" ? ` on ${g.row.plan.name}` : ""}`,
            value: g.providers + g.location,
          })),
        ...(priced.included ? [{ label: `First provider${a.shape === "group" ? " and location" : ""}, in the base`, value: priced.included, minus: true }] : []),
        ...(priced.providerDiscount ? [{ label: `Volume discount, ${bracketLabel(priced.providerBracket)} providers`, value: priced.providerDiscount, minus: true }] : []),
        ...(priced.locationDiscount ? [{ label: `Volume discount, ${bracketLabel(priced.locationBracket)} locations`, value: priced.locationDiscount, minus: true }] : []),
        ...(a.annual ? [{ label: "Yearly billing, 2 months free", value: subtotal * (1 - ANNUAL_FACTOR), minus: true }] : []),
      ]
    : [];
  const saved = priced.providerDiscount + priced.locationDiscount + (a.annual ? subtotal * (1 - ANNUAL_FACTOR) : 0);

  /** The chosen plan's price, line by line: a panel over the right of the page on desktop, a sheet on iPhone. */
  const breakdownPanel = showBreakdown ? (
    <>
      {phone && <button type="button" aria-label="Close breakdown" onClick={() => setBreakdown(false)} className="fixed inset-0 z-[49] bg-[rgba(20,12,4,0.28)]" />}
      <aside
        aria-label="Price breakdown"
        className={`z-50 flex flex-col gap-[18px] bg-[#281910] text-[#FFFCF1] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${phone ? "doe-pricing-sheet fixed left-0 right-0 bottom-0 max-h-[82vh] p-[22px] pb-[max(22px,env(safe-area-inset-bottom))] rounded-t-[30px]" : "doe-pricing-slide fixed right-[20px] top-[120px] bottom-[20px] w-[380px] p-[26px] rounded-[32px]"}`}
      >
        <span className="flex items-start justify-between gap-[12px]">
          <span className="flex flex-col gap-[2px]">
            <span className="text-[14px] leading-[18px] text-[rgba(255,252,241,0.6)]">Your price</span>
            <span className={`text-[28px] leading-[32px] tracking-[-0.02em] ${DISPLAY}`}>{planLabel}</span>
          </span>
          <button
            type="button"
            aria-label="Close breakdown"
            onClick={() => setBreakdown(false)}
            className="w-[36px] h-[36px] shrink-0 flex items-center justify-center rounded-[999px] bg-[rgba(255,252,241,0.1)] hover:bg-[rgba(255,252,241,0.18)] transition-colors duration-150"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
              <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="#FFFCF1" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </button>
        </span>

        <span className="flex flex-col gap-[4px] p-[18px] rounded-[22px] bg-[rgba(255,252,241,0.07)]">
          <span className="flex items-baseline gap-[6px]">
            <span className={`text-[52px] leading-[54px] tracking-[-0.04em] ${DISPLAY} [font-variant-numeric:tabular-nums]`}>{money(subtotal * factor)}</span>
            <span className="text-[15px] text-[rgba(255,252,241,0.6)]">/ month</span>
          </span>
          <span className="text-[13px] leading-[18px] text-[rgba(255,252,241,0.6)]">
            {priced.top.base ? (a.annual ? `${money(subtotal * factor * 12)} billed once a year` : "Billed monthly") : "Free, for as long as you like"}
          </span>
          {saved > 0 && <span className="self-start mt-[6px] h-[26px] px-[10px] flex items-center rounded-[999px] bg-[#FCCFB8] text-[12px] leading-[16px] font-[600] text-[#140C04]">Saving {money(saved)} a month</span>}
        </span>

        {priced.top.base > 0 && (
          <span className="flex flex-col">
            {lines.map((l) => (
              <span key={l.label} className="flex items-baseline justify-between gap-[14px] py-[9px] border-b border-solid border-[rgba(255,252,241,0.08)] text-[14px] leading-[19px]">
                <span className={l.minus ? "text-[#FCCFB8]" : "text-[rgba(255,252,241,0.78)]"}>{l.label}</span>
                <span className={`shrink-0 [font-variant-numeric:tabular-nums] ${l.minus ? "text-[#FCCFB8]" : ""}`}>
                  {l.minus ? "−" : ""}
                  {money(l.value)}
                </span>
              </span>
            ))}
            <span className="flex items-baseline justify-between gap-[14px] pt-[12px] text-[15px] leading-[20px] font-[600]">
              <span>Per month</span>
              <span className="[font-variant-numeric:tabular-nums]">{money(subtotal * factor)}</span>
            </span>
          </span>
        )}

        {priced.top.base > 0 && (
          <span className="flex flex-col gap-[14px] pt-[4px]">
            <Ladder title="Volume discount on extra providers" brackets={PROVIDER_BRACKETS} n={providerCount} noun="" />
            <Ladder title="Volume discount on extra locations" brackets={LOCATION_BRACKETS} n={locationCount} noun="" />
          </span>
        )}

        <button
          type="button"
          onClick={() => {
            setBreakdown(false);
            forward();
          }}
          className="mt-auto h-[52px] shrink-0 rounded-[999px] bg-[#FCCFB8] hover:bg-[#F8C2A8] text-[16px] leading-[20px] font-[500] text-[#140C04] transition-colors duration-150"
        >
          Continue with {planLabel}
        </button>
      </aside>
    </>
  ) : null;

  const card = done ? (
    <div className="doe-pricing-rise flex flex-col gap-[24px]">
      <span className="w-[60px] h-[60px] flex items-center justify-center rounded-[999px] bg-[#DCE5D0]">
        <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
          <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#2F3B2A" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <h2 className={`m-0 text-[clamp(32px,4vw,48px)] leading-[1.04] tracking-[-0.035em] font-[400] text-[#281910] ${DISPLAY}`}>Welcome to Doe, {a.contact.name.trim().split(" ")[0]}.</h2>
      <p className={`m-0 text-[17px] leading-[25px] ${SUB}`}>
        {priced.top.base ? `${planLabel} for ${a.contact.practice}, ${money(total)} a month.` : `${a.contact.practice} is on the Free plan.`} Your setup is on its way to {a.contact.email}.
      </p>
      <ol className="m-0 p-0 list-none flex flex-col gap-[8px]">
        {(priced.top.base
          ? [
              ["Connect your scheduling software", "Today, about 10 minutes"],
              [`Add your ${plural(providerCount, "provider")} and their services`, "With your onboarding lead"],
              ["Go live to personal agents", "Usually within two days"],
            ]
          : [
              ["Verify your clinic", "A quick check that it’s yours"],
              ["Fill in your profile", "Services, providers, hours, insurance"],
              ["Show up for personal agents", "As soon as your profile is verified"],
            ]
        ).map(([t, d], i) => (
          <li key={t} className="flex items-center gap-[14px] p-[16px] rounded-[22px] bg-[#FFFCF1]">
            <span className={`w-[34px] h-[34px] shrink-0 flex items-center justify-center rounded-[999px] bg-[#281910] text-[#FFFCF1] text-[16px] ${DISPLAY}`}>{i + 1}</span>
            <span className="flex flex-col">
              <span className="text-[16px] leading-[21px] font-[600] text-[#140C04]">{t}</span>
              <span className={`text-[14px] leading-[19px] ${SUB}`}>{d}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  ) : (
    <div key={q.id} className="doe-pricing-rise flex flex-col gap-[28px]">
      <div className="flex flex-col gap-[10px]">
        <span className={`text-[14px] leading-[18px] font-[500] ${SUB}`}>
          {index + 1} of {questions.length}
        </span>
        <h2 className={`m-0 text-[clamp(32px,3.8vw,48px)] leading-[1.04] tracking-[-0.035em] font-[400] text-[#281910] ${DISPLAY}`}>{q.title}</h2>
      </div>
      {q.body}
      <div className="flex items-center justify-between gap-[12px]">
        {index > 0 ? (
          <button type="button" onClick={() => setAt(index - 1)} className={`flex items-center gap-[6px] h-[48px] px-[6px] text-[16px] leading-[20px] font-[500] ${SUB} hover:text-[#281910] transition-colors duration-150`}>
            <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
              <path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>
        ) : (
          <span />
        )}
        {(!q.auto || q.ready) && (
          <button
            type="button"
            disabled={!q.ready}
            onClick={forward}
            className="h-[54px] px-[30px] rounded-[999px] bg-[#281910] hover:bg-[#3A2920] disabled:bg-[rgba(20,12,4,0.1)] disabled:text-[rgba(20,12,4,0.38)] text-[16px] leading-[20px] font-[500] text-[#FFFCF1] transition-colors duration-200"
          >
            {last ? (a.plan === "free" ? "Claim my clinic" : "Start onboarding") : q.id === "plan" && a.plan ? `Continue with ${mixed ? "these plans" : plan.name}` : "Continue"}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="relative">
      <div className="doe-pricing-clouds" aria-hidden="true">
        <span style={{ width: phone ? 360 : 640, height: phone ? 300 : 480, left: phone ? "-30%" : "4%", top: "12%", background: "rgba(252,207,184,0.5)" }} />
        <span style={{ width: phone ? 380 : 660, height: phone ? 320 : 520, right: phone ? "-34%" : "2%", top: "34%", background: "rgba(220,229,208,0.6)" }} />
        <span style={{ width: phone ? 340 : 580, height: phone ? 280 : 420, left: phone ? "-10%" : "28%", bottom: "10%", background: "rgba(236,226,204,0.9)" }} />
      </div>

      <div
        className={`relative flex flex-col transition-[max-width,margin] duration-500 ${phone ? `mx-auto gap-[16px] ${a.plan ? "pb-[110px]" : "pb-[24px]"}` : `${wide ? "max-w-[1120px]" : "max-w-[820px]"} gap-[18px] pb-[40px] ${showBreakdown ? "ml-0 mr-[360px]" : "mx-auto"}`}`}
      >
        {priceBar}
        <div className="h-[6px] rounded-[99px] bg-[rgba(20,12,4,0.07)] overflow-hidden">
          <span className="block h-full rounded-[99px] bg-[#281910] transition-[width] duration-500 ease-out" style={{ width: `${Math.max(4, progress * 100)}%` }} />
        </div>

        {trail.length > 0 && (
          <div className="flex flex-wrap gap-[6px]">
            {trail.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setDone(false);
                  setAt(questions.findIndex((x) => x.id === t.id));
                }}
                className="doe-pricing-rise flex items-center gap-[8px] h-[36px] pl-[12px] pr-[16px] rounded-[999px] bg-[#FFFCF1] hover:bg-white text-[14px] leading-[18px] font-[500] text-[#281910] transition-colors duration-150"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
                  <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#6E9A5B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t.answer}
              </button>
            ))}
          </div>
        )}

        <div
          ref={cardRef}
          className={`${phone ? "p-[20px] rounded-[30px]" : "p-[44px] rounded-[40px]"} bg-[rgba(244,238,223,0.92)]`}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !done && (e.target as HTMLElement).tagName === "INPUT" && (e.target as HTMLInputElement).type !== "range") forward();
          }}
        >
          {card}
        </div>
      </div>
      {breakdownPanel}
    </div>
  );
}
