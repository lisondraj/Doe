"use client";

/**
 * /pricing builder — the practice and plan, one question at a time: how the practice is set up (Solo, Single
 * location, or Multi-clinic, each with a small drawing of its shape), how many providers or which locations, the
 * specialty (picked from the set or typed), then the four tiers side by side with sliders for locations and
 * providers, and where to send the setup. Tiers stay out of sight until that comparison. Answers collect above the
 * card as pills you can tap to go back; once a plan is chosen its price stays in view. Flat cloud shapes sit behind.
 */
import { type CSSProperties, Fragment, type ReactNode, useEffect, useMemo, useRef, useState } from "react";

import {
  ANNUAL_FACTOR,
  FEATURE_GROUPS,
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
  monthlyPrice,
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
  /** Set once the sliders move; until then the size comes from the earlier answers. */
  size: { providers: number; locations: number } | null;
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
  size: null,
  plan: null,
  annual: true,
  contact: { name: "", email: "", practice: "" },
};

/** A flat cloud: overlapping circles in one fill on a flat base, so it reads as one soft shape. */
function Cloud({ fill, style }: { fill: string; style: CSSProperties }) {
  return (
    <svg viewBox="0 0 240 120" style={style} aria-hidden="true">
      <g fill={fill}>
        <circle cx="62" cy="78" r="38" />
        <circle cx="108" cy="54" r="48" />
        <circle cx="160" cy="66" r="40" />
        <circle cx="196" cy="86" r="28" />
        <rect x="28" y="80" width="194" height="40" rx="20" />
      </g>
    </svg>
  );
}

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

function Count({ value, onChange, max = 60, big = true }: { value: number; onChange: (v: number) => void; max?: number; big?: boolean }) {
  const size = big ? "w-[52px] h-[52px] text-[24px]" : "w-[38px] h-[38px] text-[18px]";
  const btn = `${size} flex items-center justify-center rounded-[999px] bg-[#F4EEDF] hover:bg-[#EDE5D2] text-[#281910] leading-none transition-colors duration-150 disabled:opacity-35`;
  return (
    <span className="inline-flex items-center gap-[6px] p-[4px] rounded-[999px] bg-[#FFFCF1]">
      <button type="button" aria-label="Fewer" disabled={value <= 1} onClick={() => onChange(Math.max(1, value - 1))} className={btn}>
        −
      </button>
      <span className={`${big ? "w-[76px] text-[40px] leading-[44px]" : "w-[44px] text-[22px] leading-[26px]"} text-center ${DISPLAY} text-[#281910] [font-variant-numeric:tabular-nums]`}>{value}</span>
      <button type="button" aria-label="More" disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))} className={btn}>
        +
      </button>
    </span>
  );
}

/** A slider in Doe's colours: a beige track that fills ink up to an ink thumb. */
function Slider({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <label className="flex flex-col gap-[12px] grow basis-[0px] min-w-[0px] p-[18px] rounded-[24px] bg-[#FFFCF1]">
      <span className="flex items-baseline justify-between">
        <span className={`text-[15px] leading-[20px] font-[500] ${SUB}`}>{label}</span>
        <span className={`text-[30px] leading-[32px] tracking-[-0.02em] ${DISPLAY} text-[#281910] [font-variant-numeric:tabular-nums]`}>{value}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ background: `linear-gradient(90deg, #281910 ${pct}%, #EDE5D2 ${pct}%)` }}
        className="w-full h-[6px] rounded-[99px] appearance-none outline-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[24px] [&::-webkit-slider-thumb]:h-[24px] [&::-webkit-slider-thumb]:rounded-[999px] [&::-webkit-slider-thumb]:bg-[#281910] [&::-webkit-slider-thumb]:border-[4px] [&::-webkit-slider-thumb]:border-solid [&::-webkit-slider-thumb]:border-[#FFFCF1] [&::-moz-range-thumb]:w-[18px] [&::-moz-range-thumb]:h-[18px] [&::-moz-range-thumb]:rounded-[999px] [&::-moz-range-thumb]:bg-[#281910] [&::-moz-range-thumb]:border-[4px] [&::-moz-range-thumb]:border-solid [&::-moz-range-thumb]:border-[#FFFCF1]"
      />
    </label>
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

  const providerCount = a.size?.providers ?? sites.reduce((s, x) => s + x.providers, 0);
  const locationCount = a.size?.locations ?? sites.length;
  const plan = PLANS.find((p) => p.id === (a.plan ?? "advanced"))!;
  const factor = a.annual ? ANNUAL_FACTOR : 1;
  const priceOf = (id: PlanId) => monthlyPrice(PLANS.find((p) => p.id === id)!, providerCount, locationCount).total * factor;
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

  const setSize = (patch: Partial<{ providers: number; locations: number }>) => {
    const next = { providers: providerCount, locations: locationCount, ...patch };
    next.providers = Math.max(next.providers, next.locations);
    set({ size: next });
  };

  const choose = (id: PlanId) => set({ plan: id });

  const cols = phone ? "grid-cols-[150px_repeat(4,128px)]" : "grid-cols-[minmax(180px,1.5fr)_repeat(4,minmax(120px,1fr))]";
  const cell = (id: PlanId) => `flex justify-center self-stretch items-center ${a.plan === id ? "bg-[#281910]" : ""}`;
  const first = `sticky left-0 z-[1] ${phone ? "bg-[#FFFCF1]" : ""}`;

  /** Every tier side by side: price and a choose button up top, then each feature group and its items. */
  const comparison = (
    <div className={phone ? "-mx-[20px] px-[20px] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" : ""}>
      <div className={`grid ${cols} rounded-[28px] bg-[#FFFCF1] overflow-clip ${phone ? "w-max" : ""}`}>
        <span className={first} />
        {PLANS.map((p) => {
          const on = a.plan === p.id;
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
                    <Mark on={includes(id, g.from)} dark={a.plan === id} />
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
                onClick={() => pick({ shape: s.id, size: null })}
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
                <Count value={a.clinicProviders} onChange={(v) => set({ clinicProviders: v, size: null })} />
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
                      <Count big={false} value={l.providers} onChange={(v) => set({ size: null, locations: a.locations.map((x) => (x.id === l.id ? { ...x, providers: v } : x)) })} />
                    </span>
                    {!phone && (
                      <button
                        type="button"
                        aria-label={`Remove ${l.name}`}
                        disabled={a.locations.length <= 2}
                        onClick={() => set({ size: null, locations: a.locations.filter((x) => x.id !== l.id) })}
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
                    onClick={() => set({ size: null, locations: [...a.locations, { id: `l${nextId.current++}`, name: `Location ${a.locations.length + 1}`, providers: 2 }] })}
                    className="flex items-center gap-[8px] h-[44px] px-[18px] rounded-[999px] border-[1.5px] border-dashed border-[rgba(20,12,4,0.22)] hover:bg-[#FFFCF1] text-[15px] leading-[20px] font-[500] text-[#281910] transition-colors duration-150"
                  >
                    <span className="text-[18px] leading-[18px]">+</span>
                    Add a location
                  </button>
                  {phone && a.locations.length > 2 && (
                    <button type="button" onClick={() => set({ size: null, locations: a.locations.slice(0, -1) })} className={`h-[44px] px-[18px] rounded-[999px] text-[15px] leading-[20px] font-[500] ${SUB} hover:text-[#281910]`}>
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
      answer: a.plan ? `${plan.name}${plan.base ? `, ${money(priceOf(plan.id))}/mo` : ""}` : "",
      wide: true,
      ready: !!a.plan,
      body: (
        <div className="flex flex-col gap-[14px]">
          <div className={`flex gap-[8px] ${phone ? "flex-col" : "items-stretch"}`}>
            <Slider label="Locations" value={locationCount} min={1} max={20} onChange={(v) => setSize({ locations: v })} />
            <Slider label="Providers" value={providerCount} min={1} max={100} onChange={(v) => setSize({ providers: v })} />
            <span className={`flex justify-center gap-[8px] p-[18px] rounded-[24px] bg-[#FFFCF1] ${phone ? "flex-row items-center justify-between flex-wrap" : "flex-col w-[200px] shrink-0"}`}>
              <span className={`text-[15px] leading-[20px] font-[500] ${SUB}`}>Billing</span>
              <span className="flex p-[3px] gap-[2px] rounded-[999px] bg-[#F4EEDF]">
                {(["monthly", "annual"] as const).map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => set({ annual: b === "annual" })}
                    className={`grow h-[34px] px-[14px] rounded-[999px] text-[14px] leading-[18px] font-[500] transition-colors duration-200 ${(b === "annual") === a.annual ? "bg-[#281910] text-[#FFFCF1]" : `${SUB} hover:text-[#281910]`}`}
                  >
                    {b === "annual" ? "Yearly" : "Monthly"}
                  </button>
                ))}
              </span>
              <span className={`text-[12px] leading-[16px] ${SUB}`}>Two months free yearly</span>
            </span>
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

  /** The chosen plan's price: a sticky pill above the question on desktop, a bar along the bottom on iPhone. */
  const priceBar = a.plan ? (
    <div
      className={`doe-pricing-rise z-40 flex items-center gap-[14px] bg-[#281910] text-[#FFFCF1] ${phone ? "fixed left-[10px] right-[10px] bottom-[max(10px,env(safe-area-inset-bottom))] p-[12px] pl-[20px] rounded-[22px]" : "sticky top-[124px] self-center h-[64px] pl-[24px] pr-[28px] rounded-[999px]"}`}
    >
      <span className="flex flex-col min-w-[0px]">
        <span className="flex items-baseline gap-[6px] whitespace-nowrap">
          <span className={`text-[26px] leading-[30px] tracking-[-0.03em] ${DISPLAY} [font-variant-numeric:tabular-nums]`}>{money(priceOf(plan.id))}</span>
          <span className="text-[13px] text-[rgba(255,252,241,0.65)]">/mo{a.annual && plan.base ? ", billed yearly" : ""}</span>
        </span>
        <span className="truncate text-[12px] leading-[16px] text-[rgba(255,252,241,0.62)]">
          {plan.name} · {plural(providerCount, "provider")} · {plural(locationCount, "location")}
        </span>
      </span>
    </div>
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
        {plan.base ? `${plan.name} for ${a.contact.practice}, ${money(priceOf(plan.id))} a month.` : `${a.contact.practice} is on the Free plan.`} Your setup is on its way to {a.contact.email}.
      </p>
      <ol className="m-0 p-0 list-none flex flex-col gap-[8px]">
        {(plan.base
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
            {last ? (a.plan === "free" ? "Claim my clinic" : "Start onboarding") : q.id === "plan" && a.plan ? `Continue with ${plan.name}` : "Continue"}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="relative">
      <div className="doe-pricing-clouds" aria-hidden="true">
        <Cloud fill="#F6EEDC" style={{ width: phone ? 520 : 980, left: phone ? "-40%" : "-6%", top: phone ? "6%" : "4%" }} />
        <Cloud fill="#FBE3D5" style={{ width: phone ? 420 : 760, right: phone ? "-45%" : "-4%", top: phone ? "34%" : "22%", transform: "scaleX(-1)" }} />
        <Cloud fill="#E9EEDF" style={{ width: phone ? 460 : 820, left: phone ? "-30%" : "12%", bottom: phone ? "4%" : "6%" }} />
        <Cloud fill="#F2E9D6" style={{ width: phone ? 300 : 520, right: phone ? "-20%" : "10%", bottom: phone ? "24%" : "30%" }} />
      </div>

      <div className={`relative mx-auto flex flex-col transition-[max-width] duration-500 ${phone ? `gap-[16px] ${a.plan ? "pb-[110px]" : "pb-[24px]"}` : `${wide ? "max-w-[1120px]" : "max-w-[820px]"} gap-[18px] pb-[40px]`}`}>
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
          className={`${phone ? "p-[20px] rounded-[30px]" : "p-[44px] rounded-[40px]"} bg-[rgba(244,238,223,0.88)] [backdrop-filter:blur(12px)]`}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !done && (e.target as HTMLElement).tagName === "INPUT" && (e.target as HTMLInputElement).type !== "range") forward();
          }}
        >
          {card}
        </div>
      </div>
    </div>
  );
}
