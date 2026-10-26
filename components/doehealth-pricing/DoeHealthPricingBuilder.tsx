"use client";

/**
 * /pricing builder — the practice and plan, one question at a time: how the practice is set up (Solo, Single
 * location, or Multi-clinic, each with a small drawing of its shape), its providers or locations, the specialty
 * (picked from the set or typed), then the four tiers side by side, and where to send the setup. Tiers stay out of
 * sight until the comparison.
 *
 * The practice is a team: locations, each with named providers who have their own specialty and plan. On the
 * comparison, controls for locations, providers and billing follow you down the page, and a panel on the right (a
 * sheet on iPhone) holds the team to edit and the price, line by line. Soft colour washes sit behind.
 */
import { Fragment, type ReactNode, useEffect, useRef, useState } from "react";

import {
  ANNUAL_FACTOR,
  type Bracket,
  bracketLabel,
  FEATURE_GROUPS,
  LOCATION_BRACKETS,
  mixedPrice,
  type PlanId,
  PLAN_ORDER,
  PLANS,
  PRACTICE_SHAPES,
  type PracticeShape,
  type PriceRow,
  PROVIDER_BRACKETS,
  SPECIALTIES,
  SPECIALTY_FEATURES,
  SPECIALTY_FROM,
  type SpecialtyId,
} from "@/lib/doehealthdesk2/doehealthdesk2-pricing";
import { p22Mackinac } from "@/lib/home/fonts";

const DISPLAY = p22Mackinac.className;
const SUB = "text-[rgba(20,12,4,0.56)]";
const HAIR = "border-[rgba(20,12,4,0.07)]";

const money = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
const includes = (plan: PlanId, from: PlanId) => PLAN_ORDER.indexOf(plan) >= PLAN_ORDER.indexOf(from);
const planById = (id: PlanId) => PLANS.find((p) => p.id === id)!;

type Specialty = SpecialtyId | "other";
/** A provider; a null specialty or plan follows the practice's. */
type Provider = { id: string; name: string; specialty: Specialty | null; plan: PlanId | null };
type Site = { id: string; name: string; providers: Provider[] };

type Answers = {
  shape: PracticeShape | null;
  team: Site[];
  specialty: Specialty | null;
  otherSpecialty: string;
  plan: PlanId | null;
  annual: boolean;
  contact: { name: string; email: string; practice: string };
};

let seq = 0;
const nextId = (prefix: string) => `${prefix}${++seq}`;
const newProvider = (): Provider => ({ id: nextId("p"), name: "", specialty: null, plan: null });
const newSite = (name: string, count: number): Site => ({ id: nextId("s"), name, providers: Array.from({ length: count }, newProvider) });

const START: Answers = {
  shape: null,
  team: [newSite("Clinic 1", 1)],
  specialty: null,
  otherSpecialty: "",
  plan: null,
  annual: true,
  contact: { name: "", email: "", practice: "" },
};

/** A site with its provider list grown or trimmed to `n`, keeping the providers it already has. */
const resize = (site: Site, n: number): Site => ({
  ...site,
  providers: n > site.providers.length ? [...site.providers, ...Array.from({ length: n - site.providers.length }, newProvider)] : site.providers.slice(0, Math.max(1, n)),
});

const shapeOf = (team: Site[]): PracticeShape => (team.length > 1 ? "group" : team[0]!.providers.length > 1 ? "clinic" : "solo");

function initials(name: string, n: number) {
  const words = name.replace(/^Dr\.?\s*/i, "").trim().split(/\s+/).filter(Boolean);
  return words.length ? words.map((w) => w[0]).join("").slice(0, 2).toUpperCase() : `P${n}`;
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

function Count({ value, onChange, min = 1, max = 100, big = false }: { value: number; onChange: (v: number) => void; min?: number; max?: number; big?: boolean }) {
  const size = big ? "w-[52px] h-[52px] text-[24px]" : "w-[34px] h-[34px] text-[17px]";
  const btn = `${size} flex items-center justify-center rounded-[999px] bg-[#F4EEDF] hover:bg-[#EDE5D2] text-[#281910] leading-none transition-colors duration-150 disabled:opacity-35`;
  return (
    <span className="inline-flex items-center gap-[4px] p-[3px] rounded-[999px] bg-[#FFFCF1]">
      <button type="button" aria-label="Fewer" disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))} className={btn}>
        −
      </button>
      <span className={`${big ? "w-[76px] text-[40px] leading-[44px]" : "w-[38px] text-[20px] leading-[24px]"} text-center ${DISPLAY} text-[#281910] [font-variant-numeric:tabular-nums]`}>{value}</span>
      <button type="button" aria-label="More" disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))} className={btn}>
        +
      </button>
    </span>
  );
}

/** A small pill-shaped select, light or dark. */
function Pick<T extends string>({ value, options, onChange, label, dark = false }: { value: T; options: { id: T; label: string }[]; onChange: (v: T) => void; label: string; dark?: boolean }) {
  return (
    <span className="relative flex items-center shrink-0">
      <select
        value={value}
        aria-label={label}
        onChange={(e) => onChange(e.target.value as T)}
        className={`appearance-none h-[34px] pl-[12px] pr-[28px] rounded-[999px] text-[13px] leading-[16px] font-[500] outline-none cursor-pointer ${dark ? "bg-[#281910] text-[#FFFCF1]" : "bg-[#F4EEDF] text-[#281910]"}`}
      >
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
      <svg width="10" height="10" viewBox="0 0 24 24" aria-hidden="true" className="pointer-events-none absolute right-[11px]" style={{ display: "block" }}>
        <path d="M6 9l6 6 6-6" fill="none" stroke={dark ? "#FCCFB8" : "#281910"} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
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

function Chevron({ open }: { open: boolean }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block", flexShrink: 0, transform: open ? "rotate(90deg)" : undefined, transition: "transform 200ms ease" }}>
      <path d="M9 6l6 6-6 6" fill="none" stroke="#281910" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Close({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button type="button" aria-label={label} onClick={onClick} className="w-[34px] h-[34px] shrink-0 flex items-center justify-center rounded-[999px] text-[#281910] hover:bg-[#F4EEDF] transition-colors duration-150">
      <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
        <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    </button>
  );
}

/** One volume-discount ladder, with the step the practice is on filled in. */
function Ladder({ title, brackets, n }: { title: string; brackets: Bracket[]; n: number }) {
  return (
    <div className="flex flex-col gap-[8px]">
      <span className={`text-[13px] leading-[16px] font-[500] ${SUB}`}>{title}</span>
      <div className="grid grid-cols-4 gap-[4px]">
        {brackets.map((b) => {
          const on = n >= b.min && n <= b.max;
          return (
            <span key={b.min} className={`flex flex-col gap-[1px] px-[10px] py-[8px] rounded-[14px] transition-colors duration-200 ${on ? "bg-[#281910] text-[#FFFCF1]" : "bg-[#F4EEDF] text-[#281910]"}`}>
              <span className={`text-[16px] leading-[20px] ${DISPLAY}`}>{b.off ? `−${Math.round(b.off * 100)}%` : "0%"}</span>
              <span className={`text-[11px] leading-[14px] ${on ? "text-[rgba(255,252,241,0.65)]" : SUB}`}>{bracketLabel(b)}</span>
            </span>
          );
        })}
      </div>
    </div>
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

type PanelTab = "team" | "price";

export function DoeHealthPricingBuilder({ phone }: { phone: boolean }) {
  const [a, setA] = useState<Answers>(START);
  const [at, setAt] = useState(0);
  const [done, setDone] = useState(false);
  const [panel, setPanel] = useState<PanelTab | null>(null);
  const [openSpecialty, setOpenSpecialty] = useState<SpecialtyId | null>(null);
  /** Where the controls pin to once they reach the top of the screen, or null while they sit in place. */
  const [pinned, setPinned] = useState<{ left: number; width: number; height: number } | null>(null);
  const barSlot = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const advance = useRef<number | null>(null);
  const moved = useRef(false);
  const pinTop = phone ? 92 : 112;

  const set = (patch: Partial<Answers>) => setA((prev) => ({ ...prev, ...patch }));
  const setTeam = (team: Site[]) => set({ team, shape: shapeOf(team) });
  const editSite = (id: string, patch: Partial<Site>) => setTeam(a.team.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  const editProvider = (id: string, patch: Partial<Provider>) => set({ team: a.team.map((s) => ({ ...s, providers: s.providers.map((p) => (p.id === id ? { ...p, ...patch } : p)) })) });

  const plan = planById(a.plan ?? "advanced");
  const factor = a.annual ? ANNUAL_FACTOR : 1;
  const providers = a.team.flatMap((s) => s.providers);
  const providerCount = providers.length;
  const locationCount = a.team.length;
  const planOf = (p: Provider) => planById(p.plan ?? plan.id);
  const mixed = providers.some((p) => planOf(p).id !== plan.id);
  const specialtyOf = (p: Provider): Specialty | null => p.specialty ?? a.specialty;
  const specialtyName = (sp: Specialty | null) => (sp === "other" ? a.otherSpecialty.trim() || "Other" : SPECIALTIES.find((s) => s.id === sp)?.label ?? "");
  const specialtyLabel = a.specialty === "other" ? a.otherSpecialty.trim() : specialtyName(a.specialty);
  const providerName = (p: Provider) => p.name.trim() || `Provider ${providers.indexOf(p) + 1}`;

  /** The team as price rows: each location's providers grouped by plan, the location charged at its highest plan. */
  const rowsFor = (override?: PlanId): PriceRow[] =>
    a.team.flatMap((site) => {
      const groups = PLAN_ORDER.slice()
        .reverse()
        .map((id) => ({ id, n: site.providers.filter((p) => (override ?? planOf(p).id) === id).length }))
        .filter((g) => g.n > 0);
      return groups.map((g, i) => ({ id: `${site.id}-${g.id}`, name: site.name, providers: g.n, plan: planById(g.id), location: i === 0 }));
    });
  const priced = mixedPrice(rowsFor());
  const total = priced.total * factor;
  /** Each tier's price with the whole team on it, for the comparison. */
  const priceOf = (id: PlanId) => mixedPrice(rowsFor(id)).total * factor;
  const teamSpecialties = new Set(providers.map(specialtyOf).filter((s): s is SpecialtyId => !!s && s !== "other"));

  function pick(patch: Partial<Answers>) {
    set(patch);
    if (advance.current) window.clearTimeout(advance.current);
    advance.current = window.setTimeout(() => setAt((i) => i + 1), 340);
  }

  /** Picking a practice shape reshapes the team, keeping what it can. */
  const pickShape = (shape: PracticeShape) => {
    const first = a.team[0]!;
    const team =
      shape === "solo"
        ? [resize({ ...first, name: first.name }, 1)]
        : shape === "clinic"
          ? [resize(first, Math.max(first.providers.length, 4))]
          : a.team.length > 1
            ? a.team
            : [resize(first, Math.max(first.providers.length, 6)), newSite("Clinic 2", 3)];
    pick({ shape, team });
  };

  /** Locations from the controls: more turns the practice multi-clinic, fewer drops the last ones. */
  const setLocations = (n: number) => {
    if (n > a.team.length) setTeam([...a.team, ...Array.from({ length: n - a.team.length }, (_, i) => newSite(`Clinic ${a.team.length + i + 1}`, 1))]);
    else setTeam(a.team.slice(0, Math.max(1, n)));
  };
  /** Providers from the controls: added to or taken from the last location. */
  const setProviderTotal = (n: number) => {
    const last = a.team[a.team.length - 1]!;
    const others = providerCount - last.providers.length;
    setTeam(a.team.map((s) => (s.id === last.id ? resize(s, Math.max(1, n - others)) : s)));
  };

  /** Puts the whole team on one tier; providers can still be moved one by one in the team panel. */
  const everyoneOn = (id: PlanId) => set({ plan: id, team: a.team.map((s) => ({ ...s, providers: s.providers.map((p) => ({ ...p, plan: null })) })) });
  const onTier = (id: PlanId) => providers.filter((p) => planOf(p).id === id).length;

  const shapeAnswer = (() => {
    if (!a.shape) return "";
    if (locationCount > 1) return `Multi-clinic, ${plural(locationCount, "location")}`;
    if (providerCount > 1) return `Single location, ${plural(providerCount, "provider")}`;
    return "Solo";
  })();

  /** A tier is lit while anyone on the team is on it. */
  const lit = (id: PlanId) => !!a.plan && onTier(id) > 0;
  const cols = phone ? "grid-cols-[150px_repeat(4,128px)]" : "grid-cols-[minmax(180px,1.5fr)_repeat(4,minmax(120px,1fr))]";
  /** Doe One's column is always brown; a tier the team uses gets a soft tint. */
  const dark = (id: PlanId) => id === "one";
  const cell = (id: PlanId) => `flex justify-center self-stretch items-center ${dark(id) ? "bg-[#281910]" : lit(id) ? "bg-[#F7EFDF]" : ""}`;
  const first = `sticky left-0 z-[1] ${phone ? "bg-[#FFFCF1]" : ""}`;

  const groupRows = (title: string, from: PlanId, items: string[], key = title) => (
    <Fragment key={key}>
      <span className={`${first} px-[20px] pt-[18px] pb-[6px] border-t border-solid ${HAIR} text-[15px] leading-[20px] font-[600] text-[#140C04]`}>{title}</span>
      {PLAN_ORDER.map((id) => (
        <span key={id} className={`${cell(id)} border-t border-solid ${HAIR}`} />
      ))}
      {items.map((item) => (
        <Fragment key={item}>
          <span className={`${first} px-[20px] py-[7px] text-[14px] leading-[19px] ${SUB}`}>{item}</span>
          {PLAN_ORDER.map((id) => (
            <span key={id} className={cell(id)}>
              <Mark on={includes(id, from)} dark={dark(id)} />
            </span>
          ))}
        </Fragment>
      ))}
    </Fragment>
  );

  /** Every tier side by side: price and a choose button up top, then each feature group, then the specialties. */
  const comparison = (
    <div className={phone ? "-mx-[20px] px-[20px] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" : ""}>
      <div className={`grid ${cols} rounded-[28px] bg-[#FFFCF1] overflow-clip ${phone ? "w-max" : ""}`}>
        <span className={first} />
        {PLANS.map((p) => {
          const on = lit(p.id);
          const special = dark(p.id);
          return (
            <div
              key={p.id}
              className={`relative flex flex-col gap-[12px] p-[18px] pb-[20px] transition-colors duration-200 ${special ? "bg-[#281910] text-[#FFFCF1]" : on ? "bg-[#F7EFDF] text-[#281910]" : "text-[#281910]"}`}
            >
              {special && <span className="absolute left-[18px] right-[18px] top-0 h-[4px] rounded-b-[4px] bg-[#FCCFB8]" aria-hidden="true" />}
              <span className="flex flex-col gap-[2px]">
                <span className="flex h-[22px] mb-[4px]">
                  {p.id === "advanced" && <span className="h-[22px] px-[9px] flex items-center rounded-[999px] bg-[#FCCFB8] text-[11px] leading-[14px] font-[600] text-[#140C04] whitespace-nowrap">Most chosen</span>}
                  {special && <span className="h-[22px] px-[9px] flex items-center rounded-[999px] border-[1.5px] border-solid border-[#FCCFB8] text-[11px] leading-[14px] font-[600] text-[#FCCFB8] whitespace-nowrap">Complete</span>}
                </span>
                <span className={`text-[22px] leading-[26px] tracking-[-0.02em] ${DISPLAY}`}>{p.name}</span>
                <span className={`text-[13px] leading-[17px] min-h-[34px] ${special ? "text-[rgba(255,252,241,0.68)]" : SUB}`}>{p.line}</span>
              </span>
              <span className="flex items-baseline gap-[3px]">
                <span className={`text-[32px] leading-[34px] tracking-[-0.035em] ${DISPLAY} [font-variant-numeric:tabular-nums] ${special ? "text-[#FCCFB8]" : ""}`}>{money(priceOf(p.id))}</span>
                <span className={`text-[13px] ${special ? "text-[rgba(255,252,241,0.6)]" : SUB}`}>/mo</span>
              </span>
              <span className="flex h-[30px]">
                {on && (
                  <span
                    className={`h-[30px] px-[12px] flex items-center gap-[6px] rounded-[999px] text-[13px] leading-[16px] font-[600] whitespace-nowrap ${special ? "bg-[#FCCFB8] text-[#140C04]" : "bg-[#281910] text-[#FFFCF1]"}`}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
                      <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {mixed ? plural(onTier(p.id), "provider") : "Your plan"}
                  </span>
                )}
              </span>
            </div>
          );
        })}
        {FEATURE_GROUPS.slice(0, -2).map((g) => groupRows(g.title, g.from, g.items))}

        <span className={`${first} px-[20px] pt-[18px] pb-[6px] border-t border-solid ${HAIR} text-[15px] leading-[20px] font-[600] text-[#140C04]`}>Specialty features</span>
        {PLAN_ORDER.map((id) => (
          <span key={id} className={`${cell(id)} border-t border-solid ${HAIR}`} />
        ))}
        {SPECIALTIES.map((sp) => {
          const open = openSpecialty === sp.id;
          return (
            <Fragment key={sp.id}>
              <button
                type="button"
                aria-expanded={open}
                onClick={() => setOpenSpecialty(open ? null : sp.id)}
                className={`${first} flex items-center gap-[8px] px-[20px] py-[8px] text-left text-[14px] leading-[19px] font-[500] text-[#281910] hover:bg-[#FBF7EC] transition-colors duration-150`}
              >
                <Chevron open={open} />
                {sp.label}
                {teamSpecialties.has(sp.id) && <span className="h-[20px] px-[8px] flex items-center rounded-[999px] bg-[#F4EEDF] text-[11px] leading-[14px] font-[600] text-[#281910] whitespace-nowrap">Your team</span>}
              </button>
              {PLAN_ORDER.map((id) => (
                <span key={id} className={cell(id)}>
                  <Mark on={includes(id, SPECIALTY_FROM)} dark={dark(id)} />
                </span>
              ))}
              {open &&
                SPECIALTY_FEATURES[sp.id].map((item) => (
                  <Fragment key={item}>
                    <span className={`${first} pl-[40px] pr-[20px] py-[6px] text-[13px] leading-[18px] ${SUB}`}>{item}</span>
                    {PLAN_ORDER.map((id) => (
                      <span key={id} className={cell(id)}>
                        <Mark on={includes(id, SPECIALTY_FROM)} dark={dark(id)} />
                      </span>
                    ))}
                  </Fragment>
                ))}
            </Fragment>
          );
        })}

        {FEATURE_GROUPS.slice(-2).map((g) => groupRows(g.title, g.from, g.items))}
        <span className={`${first} h-[16px]`} />
        {PLAN_ORDER.map((id) => (
          <span key={id} className={cell(id)} />
        ))}
      </div>
    </div>
  );

  /** The controls that follow the comparison: locations, providers (with their initials), billing, and the team. */
  const controls = (
    <div
      className={`z-30 gap-[6px] p-[6px] rounded-[26px] bg-[rgba(237,229,210,0.94)] [backdrop-filter:blur(14px)] ${phone ? "grid grid-cols-2" : "flex flex-wrap items-stretch [&>*]:grow"} ${pinned ? "fixed" : ""}`}
      style={pinned ? { top: pinTop, left: pinned.left, width: pinned.width } : undefined}
    >
      <span className={`flex items-center justify-between gap-[10px] px-[14px] py-[8px] rounded-[20px] bg-[#FFFCF1] ${phone ? "" : "basis-[220px]"}`}>
        <span className="flex flex-col">
          <span className={`text-[13px] leading-[16px] font-[500] ${SUB}`}>Locations</span>
          {!phone && <span className="whitespace-nowrap text-[12px] leading-[16px] text-[rgba(20,12,4,0.42)]">{locationCount > 1 ? "Multi-clinic" : "Single location"}</span>}
        </span>
        <span className="[&>span]:bg-[#F4EEDF] [&>span]:p-[2px] [&_button]:bg-[#FFFCF1]">
          <Count value={locationCount} max={30} onChange={setLocations} />
        </span>
      </span>
      <span className={`flex items-center justify-between gap-[10px] px-[14px] py-[8px] rounded-[20px] bg-[#FFFCF1] ${phone ? "" : "basis-[260px]"}`}>
        <span className="flex flex-col gap-[4px] min-w-[0px]">
          <span className={`text-[13px] leading-[16px] font-[500] ${SUB}`}>Providers</span>
          {!phone && (
            <span className="flex items-center">
              {providers.slice(0, 5).map((p, i) => (
                <span key={p.id} className={`w-[22px] h-[22px] flex items-center justify-center rounded-[999px] bg-[#FCCFB8] text-[9px] leading-[10px] font-[700] text-[#281910] border-[2px] border-solid border-[#FFFCF1] ${i ? "-ml-[6px]" : ""}`}>
                  {initials(p.name, providers.indexOf(p) + 1)}
                </span>
              ))}
              {providerCount > 5 && <span className={`ml-[4px] text-[12px] leading-[16px] ${SUB}`}>+{providerCount - 5}</span>}
            </span>
          )}
        </span>
        <span className="[&>span]:bg-[#F4EEDF] [&>span]:p-[2px] [&_button]:bg-[#FFFCF1]">
          <Count value={providerCount} min={locationCount} max={200} onChange={setProviderTotal} />
        </span>
      </span>
      <span className={`flex items-center justify-center p-[6px] rounded-[20px] bg-[#FFFCF1] ${phone ? "col-span-2" : "!grow-0"}`}>
        <span className="flex p-[3px] gap-[2px] rounded-[999px] bg-[#F4EEDF]">
          {(["monthly", "annual"] as const).map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => set({ annual: b === "annual" })}
              className={`h-[34px] px-[14px] rounded-[999px] text-[13px] leading-[16px] font-[500] transition-colors duration-200 whitespace-nowrap ${(b === "annual") === a.annual ? "bg-[#281910] text-[#FFFCF1]" : `${SUB} hover:text-[#281910]`}`}
            >
              {b === "annual" ? "Yearly, 2 mo free" : "Monthly"}
            </button>
          ))}
        </span>
      </span>
      <span className={`flex items-center justify-between gap-[10px] px-[14px] py-[8px] rounded-[20px] bg-[#FFFCF1] ${phone ? "col-span-2" : "basis-[220px]"}`}>
        <span className={`whitespace-nowrap text-[13px] leading-[16px] font-[500] ${SUB}`}>{mixed ? "Mixed plans" : "Everyone on"}</span>
        <Pick dark label="Plan for everyone" value={plan.id} options={PLANS.map((p) => ({ id: p.id, label: p.name }))} onChange={everyoneOn} />
      </span>
      <span className={`flex gap-[6px] ${phone ? "col-span-2" : "basis-full justify-end"}`}>
        <button
          type="button"
          onClick={() => setPanel("team")}
          className={`flex items-center justify-center gap-[8px] h-[44px] px-[18px] rounded-[20px] bg-[#FFFCF1] hover:bg-white text-[14px] leading-[18px] font-[500] text-[#281910] transition-colors duration-150 whitespace-nowrap ${phone ? "grow" : ""}`}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
            <circle cx="9" cy="8.5" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="M3.5 19.5c.8-3.2 3-5 5.5-5s4.7 1.8 5.5 5M15.5 5.6a3.2 3.2 0 0 1 0 5.8M17.6 14.8c1.4.7 2.4 2.3 2.9 4.7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          Providers and plans
        </button>
        <button
          type="button"
          onClick={() => setPanel("price")}
          className={`flex items-center justify-center gap-[10px] h-[44px] pl-[18px] pr-[8px] rounded-[20px] bg-[#281910] hover:bg-[#3A2920] text-[14px] leading-[18px] font-[500] text-[#FFFCF1] transition-colors duration-150 whitespace-nowrap ${phone ? "grow" : ""}`}
        >
          See price
          <span className={`h-[30px] px-[10px] flex items-center rounded-[14px] bg-[#FCCFB8] text-[#140C04] text-[14px] ${DISPLAY} [font-variant-numeric:tabular-nums]`}>{money(total)}/mo</span>
        </button>
      </span>
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
                onClick={() => pickShape(s.id)}
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
                <Count big value={a.team[0]!.providers.length} min={2} onChange={(v) => setTeam([resize(a.team[0]!, v)])} />
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
            ready: a.team.every((s) => s.name.trim()),
            body: (
              <div className="flex flex-col gap-[8px]">
                <span className={`flex justify-between px-[20px] text-[13px] leading-[16px] font-[500] ${SUB}`}>
                  <span>Location</span>
                  <span className={phone ? "pr-[10px]" : "pr-[58px]"}>Providers</span>
                </span>
                {a.team.map((site, i) => (
                  <div key={site.id} className="flex items-center gap-[10px] p-[8px] pl-[20px] rounded-[22px] bg-[#FFFCF1]">
                    <input
                      value={site.name}
                      aria-label={`Location ${i + 1}`}
                      onChange={(e) => editSite(site.id, { name: e.target.value })}
                      className="grow min-w-[0px] h-[40px] bg-transparent outline-none text-[17px] leading-[22px] font-[500] text-[#140C04]"
                    />
                    <span className="[&>span]:bg-[#F4EEDF] shrink-0">
                      <Count value={site.providers.length} onChange={(v) => setTeam(a.team.map((s) => (s.id === site.id ? resize(s, v) : s)))} />
                    </span>
                    {!phone && (
                      <button
                        type="button"
                        aria-label={`Remove ${site.name}`}
                        disabled={a.team.length <= 2}
                        onClick={() => setTeam(a.team.filter((s) => s.id !== site.id))}
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
                    onClick={() => setTeam([...a.team, newSite(`Clinic ${a.team.length + 1}`, 2)])}
                    className="flex items-center gap-[8px] h-[44px] px-[18px] rounded-[999px] border-[1.5px] border-dashed border-[rgba(20,12,4,0.22)] hover:bg-[#FFFCF1] text-[15px] leading-[20px] font-[500] text-[#281910] transition-colors duration-150"
                  >
                    <span className="text-[18px] leading-[18px]">+</span>
                    Add a location
                  </button>
                  {phone && a.team.length > 2 && (
                    <button type="button" onClick={() => setTeam(a.team.slice(0, -1))} className={`h-[44px] px-[18px] rounded-[999px] text-[15px] leading-[20px] font-[500] ${SUB} hover:text-[#281910]`}>
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
      title: providerCount > 1 ? "What’s your main specialty?" : "What’s your specialty?",
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
          {providerCount > 1 && <span className={`px-[4px] text-[14px] leading-[19px] ${SUB}`}>You can give any provider a different specialty when you compare plans.</span>}
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
            {controls}
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
  const onPlan = !done && q.id === "plan";
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

  // The comparison starts with the team on Advanced; the panel waits for a button, and closes when you leave.
  useEffect(() => {
    if (onPlan && !a.plan) set({ plan: "advanced" });
    if (!onPlan) setPanel(null);
    // Only when entering or leaving the comparison.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onPlan]);

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

  // The controls follow the comparison down the page. Sticky can't do it here, so pin them once they reach the top.
  useEffect(() => {
    if (!onPlan) {
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
  }, [onPlan, pinTop, panel]);

  const trail = questions.slice(0, done ? questions.length : index).filter((x) => x.answer);
  const planLabel = mixed ? "Mixed plans" : plan.name;

  /** The chosen plan's price: a sticky pill above the question on desktop, a bar along the bottom on iPhone. */
  const priceBar =
    a.plan && (phone || !onPlan) ? (
      <div
        className={`doe-pricing-rise z-40 flex items-center gap-[14px] bg-[#281910] text-[#FFFCF1] ${phone ? "fixed left-[10px] right-[10px] bottom-[max(10px,env(safe-area-inset-bottom))] p-[10px] pl-[20px] rounded-[22px]" : "sticky top-[124px] self-center h-[64px] pl-[24px] pr-[10px] rounded-[999px]"}`}
      >
        <span className="flex flex-col grow min-w-[0px]">
          <span className="flex items-baseline gap-[6px] whitespace-nowrap">
            <span className={`text-[26px] leading-[30px] tracking-[-0.03em] ${DISPLAY} [font-variant-numeric:tabular-nums]`}>{money(total)}</span>
            <span className="text-[13px] text-[rgba(255,252,241,0.65)]">/mo{a.annual && priced.top.base ? ", yearly" : ""}</span>
          </span>
          <span className="truncate text-[12px] leading-[16px] text-[rgba(255,252,241,0.62)]">
            {planLabel} · {plural(providerCount, "provider")} · {plural(locationCount, "location")}
          </span>
        </span>
        {(onPlan || phone) && (
          <button
            type="button"
            onClick={() => setPanel("price")}
            className="h-[44px] px-[16px] shrink-0 rounded-[999px] bg-[rgba(255,252,241,0.12)] hover:bg-[rgba(255,252,241,0.18)] text-[14px] leading-[18px] font-[500] text-[#FFFCF1] transition-colors duration-150"
          >
            Breakdown
          </button>
        )}
      </div>
    ) : null;

  const subtotal = priced.total;
  const yearlyOff = a.annual ? subtotal * (1 - ANNUAL_FACTOR) : 0;
  const saved = priced.providerDiscount + priced.locationDiscount + yearlyOff;

  /** Each location's providers on each plan, for the price tab. */
  const lineGroups = a.team.map((site) => ({
    site,
    rows: priced.rowGross.filter((g) => g.row.id.startsWith(`${site.id}-`)),
  }));

  const priceTab = (
    <div className="flex flex-col gap-[16px]">
      <div className="flex flex-col gap-[6px] p-[20px] rounded-[24px] bg-[#281910] text-[#FFFCF1]">
        <span className="text-[13px] leading-[16px] text-[rgba(255,252,241,0.6)]">{planLabel}</span>
        <span className="flex items-baseline gap-[6px]">
          <span className={`text-[48px] leading-[50px] tracking-[-0.04em] ${DISPLAY} [font-variant-numeric:tabular-nums]`}>{money(total)}</span>
          <span className="text-[14px] text-[rgba(255,252,241,0.6)]">/ month</span>
        </span>
        <span className="flex items-center justify-between gap-[10px] flex-wrap">
          <span className="text-[13px] leading-[18px] text-[rgba(255,252,241,0.6)]">
            {priced.top.base ? (a.annual ? `${money(total * 12)} billed yearly` : "Billed monthly") : "Free, for as long as you like"}
          </span>
          {saved > 0 && <span className="h-[24px] px-[10px] flex items-center rounded-[999px] bg-[#FCCFB8] text-[12px] leading-[16px] font-[600] text-[#140C04]">Saving {money(saved)}/mo</span>}
        </span>
      </div>

      {priced.top.base > 0 && (
        <div className="flex flex-col rounded-[22px] bg-[#FAF6EC] px-[16px] py-[6px]">
          <span className="flex justify-between gap-[12px] py-[10px] text-[14px] leading-[19px] text-[#281910]">
            <span>{priced.top.name} base</span>
            <span className="[font-variant-numeric:tabular-nums]">{money(priced.top.base)}</span>
          </span>
          {lineGroups.map(({ site, rows }) => (
            <span key={site.id} className={`flex flex-col gap-[6px] py-[10px] border-t border-solid ${HAIR} text-[14px] leading-[19px] text-[#281910]`}>
              {locationCount > 1 && <span className="font-[600]">{site.name}</span>}
              {rows.map((g) => (
                <span key={g.row.id} className="flex justify-between gap-[12px]">
                  <span className={locationCount > 1 ? SUB : ""}>
                    {plural(g.row.providers, "provider")} on {g.row.plan.name}
                    {g.location && locationCount > 1 ? ", plus location" : ""}
                  </span>
                  <span className="shrink-0 [font-variant-numeric:tabular-nums]">{money(g.providers + g.location)}</span>
                </span>
              ))}
            </span>
          ))}
          {priced.included > 0 && (
            <span className={`flex justify-between gap-[12px] py-[10px] border-t border-solid ${HAIR} text-[14px] leading-[19px] ${SUB}`}>
              <span>First provider{locationCount > 1 ? " and location" : ""} in the base</span>
              <span className="shrink-0 [font-variant-numeric:tabular-nums]">−{money(priced.included)}</span>
            </span>
          )}
          {[
            ...(priced.providerDiscount ? [[`Volume discount, ${bracketLabel(priced.providerBracket)} providers`, priced.providerDiscount] as const] : []),
            ...(priced.locationDiscount ? [[`Volume discount, ${bracketLabel(priced.locationBracket)} locations`, priced.locationDiscount] as const] : []),
            ...(yearlyOff ? [["Yearly billing, 2 months free", yearlyOff] as const] : []),
          ].map(([label, value]) => (
            <span key={label} className={`flex justify-between gap-[12px] py-[10px] border-t border-solid ${HAIR} text-[14px] leading-[19px] text-[#A0522D]`}>
              <span>{label}</span>
              <span className="shrink-0 [font-variant-numeric:tabular-nums]">−{money(value)}</span>
            </span>
          ))}
          <span className={`flex justify-between gap-[12px] py-[12px] border-t border-solid ${HAIR} text-[15px] leading-[20px] font-[600] text-[#140C04]`}>
            <span>Per month</span>
            <span className="[font-variant-numeric:tabular-nums]">{money(total)}</span>
          </span>
        </div>
      )}

      {priced.top.base > 0 && (
        <div className="flex flex-col gap-[14px] px-[2px]">
          <Ladder title="Volume discount, extra providers" brackets={PROVIDER_BRACKETS} n={providerCount} />
          <Ladder title="Volume discount, extra locations" brackets={LOCATION_BRACKETS} n={locationCount} />
        </div>
      )}
    </div>
  );

  const specialtyOptions = [...SPECIALTIES.map((s) => ({ id: s.id as Specialty, label: s.label })), ...(a.specialty === "other" ? [{ id: "other" as Specialty, label: specialtyName("other") }] : [])];
  const planOptions = PLANS.map((p) => ({ id: p.id, label: p.name }));

  const teamTab = (
    <div className="flex flex-col gap-[14px]">
      {a.team.map((site, si) => (
        <div key={site.id} className="flex flex-col gap-[6px] p-[8px] rounded-[22px] bg-[#FAF6EC]">
          <span className="flex items-center gap-[8px] pl-[10px]">
            <input
              value={site.name}
              aria-label={`Location ${si + 1} name`}
              onChange={(e) => editSite(site.id, { name: e.target.value })}
              className={`grow min-w-[0px] h-[36px] bg-transparent outline-none text-[18px] leading-[22px] tracking-[-0.01em] ${DISPLAY} text-[#281910]`}
            />
            <span className={`text-[12px] leading-[16px] ${SUB}`}>{plural(site.providers.length, "provider")}</span>
            {a.team.length > 1 && <Close label={`Remove ${site.name}`} onClick={() => setTeam(a.team.filter((s) => s.id !== site.id))} />}
          </span>
          {site.providers.map((p) => {
            const n = providers.indexOf(p) + 1;
            return (
              <div key={p.id} className="flex flex-col gap-[8px] p-[10px] rounded-[18px] bg-[#FFFCF1]">
                <span className="flex items-center gap-[10px]">
                  <span className="w-[32px] h-[32px] shrink-0 flex items-center justify-center rounded-[999px] bg-[#FCCFB8] text-[12px] leading-[14px] font-[700] text-[#281910]">{initials(p.name, n)}</span>
                  <input
                    value={p.name}
                    placeholder={`Provider ${n}`}
                    aria-label={`Provider ${n} name`}
                    onChange={(e) => editProvider(p.id, { name: e.target.value })}
                    className="grow min-w-[0px] h-[34px] bg-transparent outline-none text-[15px] leading-[20px] font-[500] text-[#140C04] placeholder:text-[rgba(20,12,4,0.38)]"
                  />
                  {site.providers.length > 1 && <Close label={`Remove ${providerName(p)}`} onClick={() => setTeam(a.team.map((s) => (s.id === site.id ? { ...s, providers: s.providers.filter((x) => x.id !== p.id) } : s)))} />}
                </span>
                <span className="flex items-center gap-[6px] pl-[42px] flex-wrap">
                  <Pick
                    label={`${providerName(p)} specialty`}
                    value={(specialtyOf(p) ?? "concierge") as Specialty}
                    options={specialtyOptions}
                    onChange={(v) => editProvider(p.id, { specialty: v === a.specialty ? null : v })}
                  />
                  <Pick dark label={`${providerName(p)} plan`} value={planOf(p).id} options={planOptions} onChange={(v) => editProvider(p.id, { plan: v === plan.id ? null : v })} />
                </span>
              </div>
            );
          })}
          <button
            type="button"
            onClick={() => setTeam(a.team.map((s) => (s.id === site.id ? resize(s, s.providers.length + 1) : s)))}
            className="self-start flex items-center gap-[6px] h-[36px] px-[14px] rounded-[999px] text-[14px] leading-[18px] font-[500] text-[#281910] hover:bg-[#FFFCF1] transition-colors duration-150"
          >
            <span className="text-[17px] leading-[17px]">+</span>
            Add provider
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => setTeam([...a.team, newSite(`Clinic ${a.team.length + 1}`, 1)])}
        className="flex items-center justify-center gap-[8px] h-[48px] rounded-[20px] border-[1.5px] border-dashed border-[rgba(20,12,4,0.2)] hover:bg-[#FAF6EC] text-[15px] leading-[20px] font-[500] text-[#281910] transition-colors duration-150"
      >
        <span className="text-[18px] leading-[18px]">+</span>
        Add location
      </button>
    </div>
  );

  /** The team and the price, in a panel over the right of the page on desktop or a sheet on iPhone. */
  const sidePanel =
    onPlan && panel ? (
      <>
        {phone && <button type="button" aria-label="Close" onClick={() => setPanel(null)} className="fixed inset-0 z-[49] bg-[rgba(20,12,4,0.28)]" />}
        <aside
          aria-label={panel === "team" ? "Your team" : "Price breakdown"}
          className={`z-50 flex flex-col bg-[#FFFCF1] border-[1.5px] border-solid border-[rgba(20,12,4,0.08)] ${phone ? "doe-pricing-sheet fixed left-0 right-0 bottom-0 max-h-[86vh] rounded-t-[30px] border-b-0" : "doe-pricing-slide fixed right-[20px] top-[120px] bottom-[20px] w-[400px] rounded-[32px]"}`}
        >
          <div className="flex items-center justify-between gap-[12px] p-[16px] pb-[12px]">
            <span className="flex p-[3px] gap-[2px] rounded-[999px] bg-[#F4EEDF]">
              {(["team", "price"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setPanel(t)}
                  className={`h-[36px] px-[18px] rounded-[999px] text-[14px] leading-[18px] font-[500] transition-colors duration-200 ${panel === t ? "bg-[#281910] text-[#FFFCF1]" : `${SUB} hover:text-[#281910]`}`}
                >
                  {t === "team" ? `Team · ${providerCount}` : "Price"}
                </button>
              ))}
            </span>
            <Close label="Close panel" onClick={() => setPanel(null)} />
          </div>
          <div className="flex flex-col grow min-h-[0px] px-[16px] pb-[16px] overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{panel === "team" ? teamTab : priceTab}</div>
          <div className={`flex items-center gap-[12px] p-[16px] pt-[12px] border-t border-solid ${HAIR} ${phone ? "pb-[max(16px,env(safe-area-inset-bottom))]" : ""}`}>
            <span className="flex flex-col grow min-w-[0px]">
              <span className={`text-[22px] leading-[26px] tracking-[-0.02em] ${DISPLAY} text-[#281910] [font-variant-numeric:tabular-nums]`}>{`${money(total)}/mo`}</span>
              <span className={`truncate text-[12px] leading-[16px] ${SUB}`}>{`${planLabel} · ${plural(providerCount, "provider")}`}</span>
            </span>
            <button
              type="button"
              disabled={!a.plan}
              onClick={() => {
                setPanel(null);
                forward();
              }}
              className="h-[48px] px-[20px] shrink-0 rounded-[999px] bg-[#281910] hover:bg-[#3A2920] disabled:bg-[rgba(20,12,4,0.1)] disabled:text-[rgba(20,12,4,0.38)] text-[15px] leading-[20px] font-[500] text-[#FFFCF1] transition-colors duration-150"
            >
              Continue
            </button>
          </div>
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
              [`Confirm your ${plural(providerCount, "provider")} and their services`, "With your onboarding lead"],
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

  const panelOpenDesktop = !!sidePanel && !phone;

  return (
    <div className="relative">
      <div className="doe-pricing-clouds" aria-hidden="true">
        <span style={{ width: phone ? 360 : 640, height: phone ? 300 : 480, left: phone ? "-30%" : "4%", top: "12%", background: "rgba(252,207,184,0.5)" }} />
        <span style={{ width: phone ? 380 : 660, height: phone ? 320 : 520, right: phone ? "-34%" : "2%", top: "34%", background: "rgba(220,229,208,0.6)" }} />
        <span style={{ width: phone ? 340 : 580, height: phone ? 280 : 420, left: phone ? "-10%" : "28%", bottom: "10%", background: "rgba(236,226,204,0.9)" }} />
      </div>

      <div
        className={`relative flex flex-col transition-[max-width,margin] duration-500 ${phone ? `mx-auto gap-[16px] ${a.plan ? "pb-[110px]" : "pb-[24px]"}` : `${wide ? "max-w-[1120px]" : "max-w-[820px]"} gap-[18px] pb-[40px] ${panelOpenDesktop ? "ml-0 mr-[380px]" : "mx-auto"}`}`}
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
      {sidePanel}
    </div>
  );
}
