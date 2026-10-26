"use client";

/**
 * /pricing builder — the practice and plan, one question at a time: how the practice is set up (Solo, Single
 * location, or Multi-clinic, each with a small drawing of its shape), its providers or locations, the specialty
 * (picked from the set or typed), then the four tiers side by side, and where to send the setup. Tiers stay out of
 * sight until the comparison. A row of steps on top tracks where you are and what you answered; answered steps open
 * again with a tap.
 *
 * The practice is a team: locations, each with named providers who have their own specialty and plan. Free is in the
 * comparison but can't be chosen. On the comparison a toolbar for locations, providers, the team and the price
 * follows you down the page, and a panel on the right (a sheet on iPhone) holds the team to edit and the price, line
 * by line. Soft colour washes sit behind.
 */
import { Fragment, type ReactNode, useEffect, useRef, useState } from "react";

import {
  ANNUAL_FACTOR,
  type Bracket,
  bracketFor,
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
/** A surface that sits on the page's cream and its colour washes. */
const CARD = "bg-[rgba(255,255,255,0.62)] border border-solid border-[rgba(20,12,4,0.08)] [backdrop-filter:blur(12px)]";
/** The same, near opaque, for what pins over the page as it scrolls. */
const PINNED = "bg-[rgba(255,252,241,0.94)] border border-solid border-[rgba(20,12,4,0.08)] [backdrop-filter:blur(14px)] shadow-[0_14px_34px_-22px_rgba(40,25,16,0.5)]";

/** Plans a practice can be on: every tier but Free, which stays in the comparison. */
const PAID = PLANS.filter((p) => p.id !== "free");
/** What paying yearly takes off, as a whole percentage. */
const YEARLY_OFF = Math.round((1 - ANNUAL_FACTOR) * 100);

const money = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
const includes = (plan: PlanId, from: PlanId) => PLAN_ORDER.indexOf(plan) >= PLAN_ORDER.indexOf(from);
const planById = (id: PlanId) => PLANS.find((p) => p.id === id)!;

type Specialty = SpecialtyId | "other";
/** A provider; a null specialty or plan follows the practice's. `other` is the specialty they typed, when theirs is Other. */
type Provider = { id: string; name: string; specialty: Specialty | null; other: string; plan: PlanId | null };
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
const newProvider = (): Provider => ({ id: nextId("p"), name: "", specialty: null, other: "", plan: null });
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
  const size = big ? "w-[52px] h-[52px] text-[24px]" : "w-[32px] h-[32px] text-[17px]";
  const btn = `${size} flex items-center justify-center rounded-[999px] bg-white hover:bg-[#FFFCF1] shadow-[0_1px_2px_rgba(40,25,16,0.12)] text-[#281910] leading-none transition-colors duration-150 disabled:opacity-35 disabled:shadow-none`;
  return (
    <span className="inline-flex items-center gap-[2px] p-[3px] rounded-[999px] bg-[rgba(20,12,4,0.06)]">
      <button type="button" aria-label="Fewer" disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))} className={btn}>
        −
      </button>
      <span className={`${big ? "w-[76px] text-[40px] leading-[44px]" : "w-[34px] text-[19px] leading-[24px]"} text-center ${DISPLAY} text-[#281910] [font-variant-numeric:tabular-nums]`}>{value}</span>
      <button type="button" aria-label="More" disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))} className={btn}>
        +
      </button>
    </span>
  );
}

/** A small pill-shaped select, light or dark. */
function Pick<T extends string>({
  value,
  options,
  onChange,
  label,
  dark = false,
  big = false,
}: {
  value: T;
  options: { id: T; label: string }[];
  onChange: (v: T) => void;
  label: string;
  dark?: boolean;
  big?: boolean;
}) {
  return (
    <span className="relative flex items-center shrink-0">
      <select
        value={value}
        aria-label={label}
        onChange={(e) => onChange(e.target.value as T)}
        className={`appearance-none rounded-[999px] font-[500] outline-none cursor-pointer ${big ? "h-[44px] pl-[16px] pr-[34px] text-[15px] leading-[20px]" : "h-[34px] pl-[12px] pr-[28px] text-[13px] leading-[16px]"} ${dark ? "bg-[#281910] text-[#FFFCF1]" : "bg-[#F4EEDF] text-[#281910]"}`}
      >
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
      <svg width="10" height="10" viewBox="0 0 24 24" aria-hidden="true" className={`pointer-events-none absolute ${big ? "right-[14px]" : "right-[11px]"}`} style={{ display: "block" }}>
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

function TeamIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block", flexShrink: 0 }}>
      <circle cx="9" cy="8.5" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3.5 19.5c.8-3.2 3-5 5.5-5s4.7 1.8 5.5 5M15.5 5.6a3.2 3.2 0 0 1 0 5.8M17.6 14.8c1.4.7 2.4 2.3 2.9 4.7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/** One discount ladder, with the step the practice is on filled in. */
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
        className="h-[56px] px-[20px] rounded-[20px] bg-[rgba(255,255,255,0.7)] border-[1.5px] border-solid border-[rgba(20,12,4,0.1)] focus:border-[#281910] focus:bg-white outline-none text-[17px] leading-[22px] text-[#140C04] placeholder:text-[rgba(20,12,4,0.32)] transition-colors duration-150"
      />
    </label>
  );
}

type Question = {
  id: string;
  /** The step's name in the row of steps. */
  step: string;
  title: string;
  /** What the answer reads as under its step. */
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
  /** The tier shown on iPhone, where tiers are compared one at a time; null follows the team's plan. */
  const [view, setView] = useState<PlanId | null>(null);
  /**
   * Where the pinned bar sits once it reaches the top of the screen, or null while it stays in place: the toolbar on
   * desktop (with a strip of tier names once the table's header has scrolled away), the tier switcher on iPhone.
   */
  const [pinned, setPinned] = useState<{ left: number; width: number; height: number; strip: boolean; cover: number } | null>(null);
  const barSlot = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const advance = useRef<number | null>(null);
  const moved = useRef(false);
  const pinTop = phone ? 118 : 112;

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
  const specialtyName = (sp: Specialty | null, typed = a.otherSpecialty) => (sp === "other" ? typed.trim() || "Other" : SPECIALTIES.find((s) => s.id === sp)?.label ?? "");
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

  /** Locations from the toolbar: more turns the practice multi-clinic, fewer drops the last ones. */
  const setLocations = (n: number) => {
    if (n > a.team.length) setTeam([...a.team, ...Array.from({ length: n - a.team.length }, (_, i) => newSite(`Clinic ${a.team.length + i + 1}`, 1))]);
    else setTeam(a.team.slice(0, Math.max(1, n)));
  };
  /** Providers from the toolbar: added to or taken from the last location. */
  const setProviderTotal = (n: number) => {
    const last = a.team[a.team.length - 1]!;
    const others = providerCount - last.providers.length;
    setTeam(a.team.map((s) => (s.id === last.id ? resize(s, Math.max(1, n - others)) : s)));
  };

  /** The practice's plan, for every provider without one of their own (set in the team panel). */
  const choose = (id: PlanId) => set({ plan: id });
  const onTier = (id: PlanId) => providers.filter((p) => planOf(p).id === id).length;

  /** A tier is lit while anyone on the team is on it. */
  const lit = (id: PlanId) => !!a.plan && onTier(id) > 0;
  const cols = "grid-cols-[minmax(170px,1.4fr)_repeat(4,minmax(116px,1fr))]";
  /** Doe One's column is always brown; a tier the team uses gets a soft tint. */
  const dark = (id: PlanId) => id === "one";
  const cell = (id: PlanId) => `flex justify-center self-stretch items-center ${dark(id) ? "bg-[#281910]" : lit(id) ? "bg-[rgba(244,232,210,0.7)]" : ""}`;
  const sizeLine = `${plural(providerCount, "provider")}, ${plural(locationCount, "location")}`;
  const billedLine = a.annual ? "Billed yearly, shown per month" : "Billed monthly";

  const badge = (id: PlanId) =>
    id === "advanced" ? (
      <span className="h-[22px] px-[9px] flex items-center rounded-[999px] bg-[#FCCFB8] text-[11px] leading-[14px] font-[600] text-[#140C04] whitespace-nowrap">Most chosen</span>
    ) : id === "one" ? (
      <span className="h-[22px] px-[9px] flex items-center rounded-[999px] border-[1.5px] border-solid border-[#FCCFB8] text-[11px] leading-[14px] font-[600] text-[#FCCFB8] whitespace-nowrap">Complete</span>
    ) : null;

  /** On a tier the team uses, how many are on it; on any other paid tier, a button to choose it. Free has neither. */
  const tierAction = (id: PlanId, full = false) => {
    const size = full ? "h-[48px] text-[15px] leading-[20px]" : "h-[36px] text-[13px] leading-[16px]";
    if (lit(id))
      return (
        <span
          className={`w-full flex items-center justify-center gap-[6px] rounded-[999px] font-[600] whitespace-nowrap ${size} ${dark(id) ? "bg-[rgba(255,252,241,0.1)] text-[#FCCFB8]" : "bg-[rgba(20,12,4,0.07)] text-[#281910]"}`}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
            <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {mixed ? plural(onTier(id), "provider") : "Your plan"}
        </span>
      );
    if (id === "free") return null;
    return (
      <button
        type="button"
        onClick={() => choose(id)}
        className={`w-full flex items-center justify-center rounded-[999px] font-[600] whitespace-nowrap transition-colors duration-150 ${size} ${dark(id) ? "bg-[#FCCFB8] hover:bg-[#FFDCCB] text-[#140C04]" : "bg-[#281910] hover:bg-[#3A2920] text-[#FFFCF1]"}`}
      >
        Choose{full ? ` ${planById(id).name}` : ""}
      </button>
    );
  };

  const groupRows = (title: string, from: PlanId, items: string[], key = title) => (
    <Fragment key={key}>
      <span className={`px-[20px] pt-[18px] pb-[6px] border-t border-solid ${HAIR} text-[15px] leading-[20px] font-[600] text-[#140C04]`}>{title}</span>
      {PLAN_ORDER.map((id) => (
        <span key={id} className={`${cell(id)} border-t border-solid ${HAIR}`} />
      ))}
      {items.map((item) => (
        <Fragment key={item}>
          <span className={`px-[20px] py-[7px] text-[14px] leading-[19px] ${SUB}`}>{item}</span>
          {PLAN_ORDER.map((id) => (
            <span key={id} className={cell(id)}>
              <Mark on={includes(id, from)} dark={dark(id)} />
            </span>
          ))}
        </Fragment>
      ))}
    </Fragment>
  );

  /** A specialty and its feature set, opened from its name; the same on both layouts. */
  const specialtyToggle = (sp: (typeof SPECIALTIES)[number], extra = "") => {
    const open = openSpecialty === sp.id;
    return (
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpenSpecialty(open ? null : sp.id)}
        className={`flex items-center gap-[8px] text-left font-[500] text-[#281910] hover:bg-[rgba(20,12,4,0.03)] transition-colors duration-150 ${extra}`}
      >
        <Chevron open={open} />
        {sp.label}
        {teamSpecialties.has(sp.id) && <span className="h-[20px] px-[8px] flex items-center rounded-[999px] bg-[#F4EEDF] text-[11px] leading-[14px] font-[600] text-[#281910] whitespace-nowrap">Your team</span>}
      </button>
    );
  };

  /** Desktop: every tier side by side, price and a choose button up top, then each feature group, then the specialties. */
  const table = (
    <div className={`grid ${cols} rounded-[28px] overflow-clip ${CARD}`}>
      <div ref={headRef} className="flex flex-col gap-[2px] px-[20px] pt-[48px] pb-[22px]">
        <span className={`text-[18px] leading-[22px] tracking-[-0.01em] ${DISPLAY} text-[#140C04]`}>{sizeLine}</span>
        <span className={`text-[13px] leading-[17px] ${SUB}`}>{billedLine}</span>
      </div>
      {PLANS.map((p) => {
        const special = dark(p.id);
        return (
          <div
            key={p.id}
            className={`flex flex-col items-center text-center gap-[16px] px-[12px] pt-[20px] pb-[22px] transition-colors duration-200 ${special ? "bg-[#281910] text-[#FFFCF1]" : lit(p.id) ? "bg-[rgba(244,232,210,0.7)] text-[#281910]" : "text-[#281910]"}`}
          >
            <span className="flex flex-col items-center gap-[4px] w-full">
              <span className="flex h-[22px] mb-[4px]">{badge(p.id)}</span>
              <span className={`text-[24px] leading-[28px] tracking-[-0.02em] whitespace-nowrap ${DISPLAY}`}>{p.name}</span>
              <span className={`text-[13px] leading-[17px] [text-wrap:balance] ${special ? "text-[rgba(255,252,241,0.68)]" : SUB}`}>{p.line}</span>
            </span>
            {/* Prices and buttons line up along the bottom, however the lines above wrap. */}
            <span className="mt-auto flex flex-col items-center gap-[14px] w-full">
              <span className="flex items-baseline gap-[3px] whitespace-nowrap">
                <span className={`text-[34px] leading-[36px] tracking-[-0.035em] ${DISPLAY} [font-variant-numeric:tabular-nums] ${special ? "text-[#FCCFB8]" : ""}`}>{money(priceOf(p.id))}</span>
                <span className={`text-[13px] ${special ? "text-[rgba(255,252,241,0.6)]" : SUB}`}>/mo</span>
              </span>
              <span className="flex w-full max-w-[150px] h-[36px]">{tierAction(p.id)}</span>
            </span>
          </div>
        );
      })}
      {FEATURE_GROUPS.slice(0, -2).map((g) => groupRows(g.title, g.from, g.items))}

      <span className={`px-[20px] pt-[18px] pb-[6px] border-t border-solid ${HAIR} text-[15px] leading-[20px] font-[600] text-[#140C04]`}>Specialty features</span>
      {PLAN_ORDER.map((id) => (
        <span key={id} className={`${cell(id)} border-t border-solid ${HAIR}`} />
      ))}
      {SPECIALTIES.map((sp) => (
        <Fragment key={sp.id}>
          {specialtyToggle(sp, "px-[20px] py-[8px] text-[14px] leading-[19px]")}
          {PLAN_ORDER.map((id) => (
            <span key={id} className={cell(id)}>
              <Mark on={includes(id, SPECIALTY_FROM)} dark={dark(id)} />
            </span>
          ))}
          {openSpecialty === sp.id &&
            SPECIALTY_FEATURES[sp.id].map((item) => (
              <Fragment key={item}>
                <span className={`pl-[40px] pr-[20px] py-[6px] text-[13px] leading-[18px] ${SUB}`}>{item}</span>
                {PLAN_ORDER.map((id) => (
                  <span key={id} className={cell(id)}>
                    <Mark on={includes(id, SPECIALTY_FROM)} dark={dark(id)} />
                  </span>
                ))}
              </Fragment>
            ))}
        </Fragment>
      ))}

      {FEATURE_GROUPS.slice(-2).map((g) => groupRows(g.title, g.from, g.items))}
      <span className="h-[16px]" />
      {PLAN_ORDER.map((id) => (
        <span key={id} className={cell(id)} />
      ))}
    </div>
  );

  /** Desktop: the tier names and prices, lined up with the table's columns, under the pinned toolbar once its header scrolls away. */
  const strip = (
    <div className={`grid ${cols} mt-[6px] rounded-[20px] overflow-clip ${PINNED}`}>
      <span className="flex flex-col justify-center px-[20px] py-[10px] min-w-[0px]">
        <span className="truncate text-[13px] leading-[17px] font-[600] text-[#140C04]">{sizeLine}</span>
        <span className={`truncate text-[12px] leading-[16px] ${SUB}`}>{billedLine}</span>
      </span>
      {PLANS.map((p) => (
        <span key={p.id} className={`flex flex-col items-center justify-center py-[8px] ${dark(p.id) ? "bg-[#281910] text-[#FFFCF1]" : lit(p.id) ? "bg-[rgba(244,232,210,0.7)] text-[#281910]" : "text-[#281910]"}`}>
          <span className={`text-[16px] leading-[20px] whitespace-nowrap ${DISPLAY}`}>{p.name}</span>
          <span className={`text-[13px] leading-[17px] [font-variant-numeric:tabular-nums] ${dark(p.id) ? "text-[#FCCFB8]" : SUB}`}>{money(priceOf(p.id))}/mo</span>
        </span>
      ))}
    </div>
  );

  /** iPhone: the four tiers as a switcher, the one shown filled in, a dot on any the team uses. */
  const shown = view ?? plan.id;
  const switcher = (
    <div role="tablist" aria-label="Plans" className={`grid grid-cols-4 gap-[4px] p-[4px] rounded-[22px] ${PINNED}`}>
      {PLANS.map((p) => {
        const on = shown === p.id;
        return (
          <button
            key={p.id}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => setView(p.id)}
            className={`flex flex-col items-center gap-[1px] pt-[9px] pb-[8px] rounded-[18px] transition-colors duration-200 ${on ? "bg-[#281910] text-[#FFFCF1]" : "text-[#281910]"}`}
          >
            <span className="flex items-center gap-[4px] text-[12px] leading-[16px] font-[600] whitespace-nowrap">
              {p.name}
              {lit(p.id) && <span className={`w-[5px] h-[5px] rounded-[999px] ${on ? "bg-[#FCCFB8]" : "bg-[#A0522D]"}`} aria-label="In use" />}
            </span>
            <span className={`text-[18px] leading-[22px] tracking-[-0.02em] ${DISPLAY} [font-variant-numeric:tabular-nums] ${on && dark(p.id) ? "text-[#FCCFB8]" : ""}`}>{money(priceOf(p.id))}</span>
          </button>
        );
      })}
    </div>
  );

  /** iPhone: the shown tier, then every feature with whether it has it, the ones it lacks faded. */
  const featureRow = (item: string, on: boolean, indent = false) => (
    <span key={item} className={`flex items-start justify-between gap-[14px] py-[7px] ${indent ? "pl-[20px]" : ""}`}>
      <span className={`text-[15px] leading-[20px] ${on ? "text-[rgba(20,12,4,0.74)]" : "text-[rgba(20,12,4,0.34)]"}`}>{item}</span>
      <span className="h-[20px] w-[16px] shrink-0 flex items-center justify-center">
        <Mark on={on} />
      </span>
    </span>
  );
  const featureGroup = (title: string, children: ReactNode) => (
    <div key={title} className={`flex flex-col px-[18px] pt-[16px] pb-[10px] border-t border-solid ${HAIR} first:border-t-0`}>
      <span className="pb-[4px] text-[16px] leading-[21px] font-[600] text-[#140C04]">{title}</span>
      {children}
    </div>
  );
  const shownPlan = planById(shown);
  const shownAction = tierAction(shown, true);
  const tierView = (
    <div className="flex flex-col gap-[10px]">
      <div key={shown} className={`doe-pricing-rise flex flex-col gap-[14px] p-[20px] rounded-[24px] ${dark(shown) ? "bg-[#281910] text-[#FFFCF1]" : `${CARD} text-[#281910]`}`}>
        <span className="flex items-start justify-between gap-[12px]">
          <span className="flex flex-col gap-[2px] min-w-[0px]">
            <span className={`text-[28px] leading-[32px] tracking-[-0.025em] ${DISPLAY}`}>{shownPlan.name}</span>
            <span className={`text-[14px] leading-[19px] ${dark(shown) ? "text-[rgba(255,252,241,0.68)]" : SUB}`}>{shownPlan.line}</span>
          </span>
          <span className="flex shrink-0">{badge(shown)}</span>
        </span>
        <span className="flex flex-col gap-[2px]">
          <span className="flex items-baseline gap-[4px]">
            <span className={`text-[40px] leading-[42px] tracking-[-0.04em] ${DISPLAY} [font-variant-numeric:tabular-nums] ${dark(shown) ? "text-[#FCCFB8]" : ""}`}>{money(priceOf(shown))}</span>
            <span className={`text-[14px] ${dark(shown) ? "text-[rgba(255,252,241,0.6)]" : SUB}`}>/mo</span>
          </span>
          <span className={`text-[13px] leading-[17px] ${dark(shown) ? "text-[rgba(255,252,241,0.6)]" : SUB}`}>
            {sizeLine} · {billedLine}
          </span>
        </span>
        {shownAction && <span className="flex">{shownAction}</span>}
      </div>

      <div className={`flex flex-col rounded-[24px] py-[4px] ${CARD}`}>
        {FEATURE_GROUPS.slice(0, -2).map((g) => featureGroup(g.title, g.items.map((item) => featureRow(item, includes(shown, g.from)))))}
        {featureGroup(
          "Specialty features",
          SPECIALTIES.map((sp) => (
            <Fragment key={sp.id}>
              <span className="flex items-center justify-between gap-[14px]">
                {specialtyToggle(sp, `grow -ml-[8px] pl-[8px] py-[8px] rounded-[12px] text-[15px] leading-[20px] ${includes(shown, SPECIALTY_FROM) ? "" : "opacity-50"}`)}
                <span className="w-[16px] shrink-0 flex items-center justify-center">
                  <Mark on={includes(shown, SPECIALTY_FROM)} />
                </span>
              </span>
              {openSpecialty === sp.id && SPECIALTY_FEATURES[sp.id].map((item) => featureRow(item, includes(shown, SPECIALTY_FROM), true))}
            </Fragment>
          )),
        )}
        {FEATURE_GROUPS.slice(-2).map((g) => featureGroup(g.title, g.items.map((item) => featureRow(item, includes(shown, g.from)))))}
      </div>
    </div>
  );

  /** Monthly or yearly, with what yearly takes off. */
  const billing = (
    <div role="radiogroup" aria-label="Billing" className={`flex p-[4px] gap-[2px] rounded-[999px] bg-[rgba(20,12,4,0.06)] ${phone ? "w-full" : ""}`}>
      {(["monthly", "annual"] as const).map((b) => {
        const on = (b === "annual") === a.annual;
        return (
          <button
            key={b}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => set({ annual: b === "annual" })}
            className={`flex items-center justify-center gap-[8px] h-[40px] px-[18px] rounded-[999px] text-[14px] leading-[18px] font-[600] whitespace-nowrap transition-[background-color,color,box-shadow] duration-200 ${phone ? "grow basis-0" : ""} ${on ? "bg-white text-[#140C04] shadow-[0_1px_3px_rgba(40,25,16,0.16)]" : `${SUB} hover:text-[#281910]`}`}
          >
            {b === "annual" ? "Yearly" : "Monthly"}
            {b === "annual" && <span className="h-[22px] px-[8px] flex items-center rounded-[999px] bg-[#FCCFB8] text-[12px] leading-[14px] font-[600] text-[#140C04]">{YEARLY_OFF}% off</span>}
          </button>
        );
      })}
    </div>
  );

  const avatars = (
    <span className="flex items-center">
      {providers.slice(0, 4).map((p, i) => (
        <span key={p.id} className={`w-[24px] h-[24px] flex items-center justify-center rounded-[999px] bg-[#FCCFB8] text-[9px] leading-[10px] font-[700] text-[#281910] border-[2px] border-solid border-white ${i ? "-ml-[7px]" : ""}`}>
          {initials(p.name, providers.indexOf(p) + 1)}
        </span>
      ))}
      {providerCount > 4 && <span className={`ml-[4px] text-[12px] leading-[16px] font-[600] ${SUB}`}>+{providerCount - 4}</span>}
    </span>
  );

  const teamButton = (
    <button
      type="button"
      onClick={() => setPanel("team")}
      className={`flex items-center justify-center gap-[10px] h-[48px] pl-[12px] pr-[16px] rounded-[18px] bg-[rgba(20,12,4,0.05)] hover:bg-[rgba(20,12,4,0.09)] text-[14px] leading-[18px] font-[600] text-[#281910] transition-colors duration-150 whitespace-nowrap ${phone ? "w-full" : ""}`}
    >
      {phone ? <TeamIcon /> : <span className="contents min-[1180px]:hidden"><TeamIcon /></span>}
      {!phone && <span className="hidden min-[1180px]:flex">{avatars}</span>}
      Providers and plans
    </button>
  );

  const counter = (label: string, note: string | null, control: ReactNode) => (
    <span className={`flex items-center justify-between gap-[14px] ${phone ? "py-[8px]" : "pl-[14px] pr-[6px]"}`}>
      <span className="flex flex-col">
        <span className="text-[14px] leading-[18px] font-[600] text-[#281910] whitespace-nowrap">{label}</span>
        {note && <span className={`text-[12px] leading-[16px] whitespace-nowrap ${SUB}`}>{note}</span>}
      </span>
      {control}
    </span>
  );
  const locationsControl = counter("Locations", phone ? null : locationCount > 1 ? "Multi-clinic" : "Single location", <Count value={locationCount} max={30} onChange={setLocations} />);
  const providersControl = counter("Providers", phone ? null : mixed ? "Mixed plans" : plan.name, <Count value={providerCount} min={locationCount} max={200} onChange={setProviderTotal} />);

  /** Desktop: one toolbar for the practice's size, the team and the price, pinned as the table scrolls. */
  const toolbar = (
    <div className={`flex items-center gap-[6px] p-[6px] rounded-[24px] ${pinned ? PINNED : CARD}`}>
      {locationsControl}
      <span className="w-[1px] h-[32px] bg-[rgba(20,12,4,0.1)]" aria-hidden="true" />
      {providersControl}
      <span className="grow" />
      {!panel && teamButton}
      {!panel && (
        <button
          type="button"
          onClick={() => setPanel("price")}
          className="flex items-center justify-center gap-[10px] h-[48px] pl-[18px] pr-[6px] rounded-[18px] bg-[#281910] hover:bg-[#3A2920] text-[14px] leading-[18px] font-[600] text-[#FFFCF1] transition-colors duration-150 whitespace-nowrap"
        >
          See price
          <span className={`h-[36px] px-[12px] flex items-center rounded-[13px] bg-[#FCCFB8] text-[#140C04] text-[15px] ${DISPLAY} [font-variant-numeric:tabular-nums]`}>{money(total)}/mo</span>
        </button>
      )}
    </div>
  );

  /** iPhone: the practice's size, billing and the team, above the switcher; they stay in place as the page scrolls. */
  const phoneControls = (
    <div className="flex flex-col gap-[8px]">
      <div className={`flex flex-col px-[16px] py-[4px] rounded-[22px] ${CARD}`}>
        {locationsControl}
        <span className={`border-t border-solid ${HAIR}`} />
        {providersControl}
      </div>
      {billing}
      {teamButton}
    </div>
  );

  /**
   * What follows the comparison down the page, pinned under the nav once it reaches it: the toolbar (and the strip of
   * tier names) on desktop, the tier switcher on iPhone.
   */
  const pinnedBar = (
    <div ref={barSlot} style={{ height: pinned?.height }}>
      {/* Once pinned, the page's cream fills in behind the bar so rows scroll out of sight under it. */}
      {pinned && (
        <div
          aria-hidden="true"
          className="fixed inset-x-0 top-0 z-[29] pointer-events-none"
          style={{ height: pinned.cover + 18, background: "linear-gradient(180deg, #FFFCF1 calc(100% - 18px), rgba(255,252,241,0))" }}
        />
      )}
      <div className={pinned ? "fixed z-30" : ""} style={pinned ? { top: pinTop, left: pinned.left, width: pinned.width } : undefined}>
        {phone ? switcher : toolbar}
        {!phone && pinned?.strip && strip}
      </div>
    </div>
  );

  const specialtyChoices: { id: Specialty; label: string }[] = [...SPECIALTIES.map((x) => ({ id: x.id as Specialty, label: x.label })), { id: "other", label: "Other" }];
  const planOptions = PAID.map((x) => ({ id: x.id, label: x.name }));

  /** A specialty dropdown; Other opens a field beside it to type the specialty in. */
  const specialtyField = (o: { label: string; value: Specialty | null; typed: string; typing: boolean; onPick: (v: Specialty) => void; onType: (v: string) => void; big?: boolean }) => (
    <span className="flex items-center gap-[6px] min-w-[0px] grow sm:grow-0">
      <Pick<Specialty | "">
        big={o.big}
        label={o.label}
        value={o.value ?? ""}
        options={o.value ? specialtyChoices : [{ id: "", label: "Choose specialty" }, ...specialtyChoices]}
        onChange={(v) => v && o.onPick(v)}
      />
      {o.typing && (
        <input
          value={o.typed}
          placeholder="Type specialty"
          aria-label={`${o.label}, typed`}
          onChange={(e) => o.onType(e.target.value)}
          className={`grow min-w-[0px] px-[14px] rounded-[999px] bg-white border-[1.5px] border-solid border-[rgba(20,12,4,0.12)] focus:border-[#281910] outline-none text-[#140C04] placeholder:text-[rgba(20,12,4,0.38)] ${o.big ? "h-[44px] w-[180px] text-[15px]" : "h-[34px] w-[140px] text-[13px]"}`}
        />
      )}
    </span>
  );

  /**
   * The team, location by location: rename a location, set how many providers it has, name each provider and give them
   * a specialty, and add or remove locations and providers. The practice's main specialty sits on top; on the comparison
   * each provider also gets a plan.
   */
  const teamEditor = (withPlans: boolean) => {
    const surface = withPlans ? "bg-[#FAF6EC]" : CARD;
    const row = withPlans ? "bg-[#FFFCF1]" : "bg-[rgba(255,255,255,0.78)] border border-solid border-[rgba(20,12,4,0.05)]";
    return (
      <div className="flex flex-col gap-[10px]">
        <div className={`flex items-center justify-between gap-x-[14px] gap-y-[10px] flex-wrap p-[12px] pl-[18px] rounded-[22px] ${surface}`}>
          <span className="flex flex-col">
            <span className="text-[15px] leading-[20px] font-[600] text-[#140C04]">Main specialty</span>
            <span className={`text-[13px] leading-[18px] ${SUB}`}>Every provider follows it unless you change theirs</span>
          </span>
          {specialtyField({
            label: "Main specialty",
            value: a.specialty,
            typed: a.otherSpecialty,
            typing: a.specialty === "other",
            onPick: (v) => set({ specialty: v }),
            onType: (v) => set({ otherSpecialty: v }),
            big: true,
          })}
        </div>
        {a.team.map((site, si) => (
          <div key={site.id} className={`flex flex-col gap-[6px] p-[8px] rounded-[22px] ${surface}`}>
            <span className="flex items-center gap-[8px] pl-[10px]">
              <input
                value={site.name}
                aria-label={`Location ${si + 1} name`}
                onChange={(e) => editSite(site.id, { name: e.target.value })}
                className={`grow min-w-[0px] h-[40px] bg-transparent outline-none text-[19px] leading-[24px] tracking-[-0.01em] ${DISPLAY} text-[#281910]`}
              />
              <Count value={site.providers.length} max={100} onChange={(v) => setTeam(a.team.map((x) => (x.id === site.id ? resize(x, v) : x)))} />
              {a.team.length > 1 && <Close label={`Remove ${site.name}`} onClick={() => setTeam(a.team.filter((x) => x.id !== site.id))} />}
            </span>
            {site.providers.map((p) => {
              const n = providers.indexOf(p) + 1;
              return (
                <div key={p.id} className={`flex flex-col gap-[8px] p-[10px] rounded-[18px] ${row} ${withPlans || phone ? "" : "sm:flex-row sm:items-center"}`}>
                  <span className="flex items-center gap-[10px] grow min-w-[0px]">
                    <span className="w-[32px] h-[32px] shrink-0 flex items-center justify-center rounded-[999px] bg-[#FCCFB8] text-[12px] leading-[14px] font-[700] text-[#281910]">{initials(p.name, n)}</span>
                    <input
                      value={p.name}
                      placeholder={`Provider ${n}`}
                      aria-label={`Provider ${n} name`}
                      onChange={(e) => editProvider(p.id, { name: e.target.value })}
                      className="grow min-w-[0px] h-[34px] bg-transparent outline-none text-[15px] leading-[20px] font-[500] text-[#140C04] placeholder:text-[rgba(20,12,4,0.38)]"
                    />
                    {(withPlans || phone) && site.providers.length > 1 && (
                      <Close label={`Remove ${providerName(p)}`} onClick={() => setTeam(a.team.map((x) => (x.id === site.id ? { ...x, providers: x.providers.filter((y) => y.id !== p.id) } : x)))} />
                    )}
                  </span>
                  <span className={`flex items-center gap-[6px] flex-wrap ${withPlans || phone ? "pl-[42px]" : ""}`}>
                    {specialtyField({
                      label: `${providerName(p)} specialty`,
                      value: specialtyOf(p),
                      typed: p.other,
                      typing: p.specialty === "other",
                      onPick: (v) => editProvider(p.id, { specialty: v === a.specialty && v !== "other" ? null : v }),
                      onType: (v) => editProvider(p.id, { other: v }),
                    })}
                    {withPlans && <Pick dark label={`${providerName(p)} plan`} value={planOf(p).id} options={planOptions} onChange={(v) => editProvider(p.id, { plan: v === plan.id ? null : v })} />}
                  </span>
                  {!withPlans && !phone && site.providers.length > 1 && (
                    <Close label={`Remove ${providerName(p)}`} onClick={() => setTeam(a.team.map((x) => (x.id === site.id ? { ...x, providers: x.providers.filter((y) => y.id !== p.id) } : x)))} />
                  )}
                </div>
              );
            })}
            <button
              type="button"
              onClick={() => setTeam(a.team.map((x) => (x.id === site.id ? resize(x, x.providers.length + 1) : x)))}
              className="self-start flex items-center gap-[6px] h-[36px] px-[14px] rounded-[999px] text-[14px] leading-[18px] font-[600] text-[#281910] hover:bg-[rgba(20,12,4,0.05)] transition-colors duration-150"
            >
              <span className="text-[17px] leading-[17px]">+</span>
              Add provider
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setTeam([...a.team, newSite(`Clinic ${a.team.length + 1}`, 1)])}
          className="flex items-center justify-center gap-[8px] h-[48px] rounded-[20px] border-[1.5px] border-dashed border-[rgba(20,12,4,0.2)] hover:bg-[rgba(255,255,255,0.6)] text-[15px] leading-[20px] font-[600] text-[#281910] transition-colors duration-150"
        >
          <span className="text-[18px] leading-[18px]">+</span>
          Add location
        </button>
      </div>
    );
  };

  /** What more providers and locations take off, and how many more reach the next step: the ladder on desktop, a line on iPhone. */
  const discountHint = (title: string, brackets: Bracket[], n: number, unit: string) => {
    const now = bracketFor(brackets, n);
    const next = brackets.find((b) => b.min > n);
    const pct = (b: Bracket) => `${Math.round(b.off * 100)}%`;
    const more = next ? next.min - n : 0;
    const line = next ? `Add ${more} more ${more === 1 ? unit : `${unit}s`} for ${pct(next)} off extra ${unit}s.` : `${pct(now)} off every extra ${unit}.`;
    if (phone)
      return (
        <div key={title} className="flex flex-col gap-[2px] py-[12px] first:pt-[2px] last:pb-[2px] border-t border-solid border-[rgba(20,12,4,0.07)] first:border-t-0">
          <span className="flex items-center justify-between gap-[10px]">
            <span className="text-[15px] leading-[20px] font-[600] text-[#140C04]">{title}</span>
            <span className={`h-[24px] px-[9px] flex items-center rounded-[999px] text-[12px] leading-[14px] font-[700] ${now.off ? "bg-[#281910] text-[#FFFCF1]" : "bg-[rgba(20,12,4,0.06)] text-[#281910]"}`}>
              {now.off ? `−${pct(now)}` : "0%"}
            </span>
          </span>
          <span className="text-[13px] leading-[18px] font-[500] text-[#7A3E1F]">{line}</span>
        </div>
      );
    return (
      <div key={title} className={`flex flex-col gap-[10px] p-[16px] rounded-[22px] ${CARD}`}>
        <Ladder title={title} brackets={brackets} n={n} />
        <span className="text-[13px] leading-[18px] font-[500] text-[#7A3E1F]">{line}</span>
      </div>
    );
  };
  const hints = [discountHint("Multi-provider Discount", PROVIDER_BRACKETS, providerCount, "provider"), discountHint("Multi-clinic Discount", LOCATION_BRACKETS, locationCount, "location")];
  const discountHints = phone ? <div className={`flex flex-col px-[16px] py-[12px] rounded-[22px] ${CARD}`}>{hints}</div> : <div className="grid grid-cols-2 gap-[10px]">{hints}</div>;

  const questions: Question[] = [
    {
      id: "shape",
      step: "Practice",
      title: "How is your practice set up?",
      answer: PRACTICE_SHAPES.find((s) => s.id === a.shape)?.title ?? "",
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
                className={`flex ${phone ? "flex-row items-center gap-[16px] p-[14px]" : "flex-col items-start gap-[26px] p-[20px]"} rounded-[26px] text-left transition-colors duration-200 ${on ? "bg-[#281910] text-[#FFFCF1] border border-solid border-[#281910]" : `${CARD} text-[#281910] [@media(hover:hover)]:hover:bg-white`}`}
              >
                <span className={`shrink-0 flex items-center justify-center rounded-[18px] ${phone ? "w-[96px] h-[64px]" : "w-full h-[92px]"} ${on ? "bg-[rgba(255,252,241,0.08)]" : "bg-[#F7F1E3]"}`}>
                  <ShapeMark shape={s.id} on={on} />
                </span>
                <span className="flex flex-col items-start gap-[2px]">
                  <span className={`text-[24px] leading-[28px] tracking-[-0.02em] ${DISPLAY}`}>{s.title}</span>
                  <span className={`text-[15px] leading-[20px] ${on ? "text-[rgba(255,252,241,0.68)]" : SUB}`}>{s.note}</span>
                  {s.id !== "solo" && (
                    <span
                      className={`mt-[8px] h-[24px] px-[10px] flex items-center rounded-[999px] text-[12px] leading-[14px] font-[600] whitespace-nowrap ${on ? "bg-[#FCCFB8] text-[#140C04]" : "bg-[rgba(252,207,184,0.55)] text-[#7A3E1F]"}`}
                    >
                      {s.id === "clinic" ? "Multi-provider Discount" : "Multi-clinic Discount"}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      ),
    },
    {
      id: "team",
      step: "Team",
      title: "Your team",
      answer: sizeLine,
      ready: !!specialtyLabel && a.team.every((x) => x.name.trim()),
      body: (
        <div className="flex flex-col gap-[14px]">
          {discountHints}
          {teamEditor(false)}
        </div>
      ),
    },
    {
      id: "plan",
      step: "Plan",
      title: "Compare plans",
      answer: a.plan ? `${mixed ? "Mixed plans" : plan.name}, ${money(total)}/mo` : "",
      wide: true,
      ready: !!a.plan,
      body: phone ? (
        <div className="flex flex-col gap-[10px]">
          {phoneControls}
          {pinnedBar}
          {tierView}
        </div>
      ) : (
        <div className="flex flex-col gap-[12px]">
          {pinnedBar}
          {table}
        </div>
      ),
    },
    {
      id: "contact",
      step: "Details",
      title: "Where should we send your setup?",
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

  // The pinned bar follows the comparison down the page. Sticky can't do it here, so pin it once it reaches the top.
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
      // The bar itself, not the strip that joins it once pinned.
      const bar = slot.lastElementChild as HTMLElement | null;
      const height = (bar?.firstElementChild as HTMLElement | null)?.offsetHeight ?? r.height;
      const head = headRef.current?.getBoundingClientRect().bottom;
      // How far down the page the cream behind the bar reaches: the bar and its strip.
      const cover = pinTop + (bar?.offsetHeight ?? height);
      const next =
        r.top < pinTop && end > pinTop + height + 40 ? { left: r.left, width: r.width, height, strip: head !== undefined && head < pinTop + height, cover } : null;
      setPinned((prev) =>
        prev && next && prev.left === next.left && prev.width === next.width && prev.height === next.height && prev.strip === next.strip && prev.cover === next.cover
          ? prev
          : next,
      );
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [onPlan, pinTop, panel]);

  const planLabel = mixed ? "Mixed plans" : plan.name;

  /** The chosen plan's price: a sticky pill above the question on desktop, a bar along the bottom on iPhone. */
  const priceBar =
    a.plan && (phone || !onPlan) ? (
      <div
        className={`doe-pricing-rise z-40 flex items-center gap-[14px] bg-[#281910] text-[#FFFCF1] ${phone ? "fixed left-[10px] right-[10px] bottom-[max(10px,env(safe-area-inset-bottom))] p-[10px] pl-[20px] rounded-[22px]" : "sticky top-[124px] self-center h-[64px] pl-[24px] pr-[10px] rounded-[999px]"}`}
      >
        <span className="flex items-baseline gap-[4px] grow min-w-[0px] whitespace-nowrap">
          <span className={`text-[28px] leading-[32px] tracking-[-0.03em] ${DISPLAY} [font-variant-numeric:tabular-nums]`}>{money(total)}</span>
          <span className="text-[15px] text-[rgba(255,252,241,0.65)]">/mo</span>
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

  /**
   * Each location's providers on each tier, for the price tab. The top tier's base covers its first provider and
   * location, so the first line on that tier carries the base in place of one provider, and that location has no fee.
   */
  const baseRow = priced.rowGross.find((g) => g.row.plan.id === priced.top.id)?.row.id;
  const baseLocation = priced.rowGross.find((g) => g.row.location && g.row.plan.id === priced.top.id)?.row.id;
  const lineGroups = a.team.map((site) => ({
    site,
    rows: priced.rowGross
      .filter((g) => g.row.id.startsWith(`${site.id}-`))
      .map((g) => ({
        row: g.row,
        amount: g.providers + (g.row.id === baseRow ? priced.top.base - priced.top.perProvider : 0),
        fee: g.row.id === baseLocation ? 0 : g.location,
      })),
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
          <span className="text-[13px] leading-[18px] text-[rgba(255,252,241,0.6)]">{a.annual ? `${money(total * 12)} billed yearly` : "Billed monthly"}</span>
          {saved > 0 && <span className="h-[24px] px-[10px] flex items-center rounded-[999px] bg-[#FCCFB8] text-[12px] leading-[16px] font-[600] text-[#140C04]">Saving {money(saved)}/mo</span>}
        </span>
      </div>

      <div className="flex flex-col rounded-[22px] bg-[#FAF6EC] px-[16px] py-[6px]">
        {lineGroups.map(({ site, rows }, i) => (
          <span key={site.id} className={`flex flex-col gap-[6px] py-[10px] text-[14px] leading-[19px] text-[#281910] ${i ? `border-t border-solid ${HAIR}` : ""}`}>
            {locationCount > 1 && <span className="font-[600]">{site.name}</span>}
            {rows.map((g) => (
              <span key={g.row.id} className="flex justify-between gap-[12px]">
                <span>
                  {g.row.plan.name} × {plural(g.row.providers, "provider")}
                </span>
                <span className="shrink-0 [font-variant-numeric:tabular-nums]">{money(g.amount)}</span>
              </span>
            ))}
            {locationCount > 1 && rows.some((g) => g.fee > 0) && (
              <span className={`flex justify-between gap-[12px] ${SUB}`}>
                <span>Location</span>
                <span className="shrink-0 [font-variant-numeric:tabular-nums]">{money(rows.reduce((t, g) => t + g.fee, 0))}</span>
              </span>
            )}
          </span>
        ))}
        {[
          ...(priced.providerDiscount ? [[`Multi-provider Discount, ${bracketLabel(priced.providerBracket)} providers`, priced.providerDiscount] as const] : []),
          ...(priced.locationDiscount ? [[`Multi-clinic Discount, ${bracketLabel(priced.locationBracket)} locations`, priced.locationDiscount] as const] : []),
          ...(yearlyOff ? [["Yearly Discount", yearlyOff] as const] : []),
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

      <div className="flex flex-col gap-[14px] px-[2px]">
        <Ladder title="Multi-provider Discount" brackets={PROVIDER_BRACKETS} n={providerCount} />
        <Ladder title="Multi-clinic Discount" brackets={LOCATION_BRACKETS} n={locationCount} />
      </div>
    </div>
  );

  /** The team and the price, in a panel over the right of the page on desktop or a sheet on iPhone. */
  const sidePanel =
    onPlan && panel ? (
      <>
        {phone && <button type="button" aria-label="Close" onClick={() => setPanel(null)} className="fixed inset-0 z-[49] bg-[rgba(20,12,4,0.28)]" />}
        <aside
          aria-label={panel === "team" ? "Your team" : "Price breakdown"}
          className={`z-50 flex flex-col bg-[#FFFCF1] border-[1.5px] border-solid border-[rgba(20,12,4,0.08)] ${phone ? "doe-pricing-sheet fixed left-0 right-0 bottom-0 max-h-[86vh] rounded-t-[30px] border-b-0" : "doe-pricing-slide fixed right-[20px] top-[120px] bottom-[20px] w-[400px] rounded-[32px] shadow-[0_24px_60px_-30px_rgba(40,25,16,0.45)]"}`}
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
          <div className="flex flex-col grow min-h-[0px] px-[16px] pb-[16px] overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{panel === "team" ? teamEditor(true) : priceTab}</div>
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

  /** Every step in a row: done ones show their answer and open again with a tap, the current one is dark. */
  const steps = (
    <nav aria-label="Steps">
      <ol className={`m-0 p-0 list-none grid ${phone ? "gap-[6px]" : "gap-[10px]"}`} style={{ gridTemplateColumns: `repeat(${questions.length}, minmax(0, 1fr))` }}>
        {questions.map((x, i) => {
          const past = done || i < index;
          const now = !done && i === index;
          return (
            <li key={x.id} className="min-w-[0px]">
              <button
                type="button"
                disabled={!past}
                aria-current={now ? "step" : undefined}
                onClick={() => {
                  setDone(false);
                  setAt(i);
                }}
                className="group w-full flex flex-col gap-[10px] pb-[2px] text-left disabled:cursor-default"
              >
                <span className={`h-[3px] w-full rounded-[99px] transition-colors duration-500 ${past || now ? "bg-[#281910]" : "bg-[rgba(20,12,4,0.1)]"}`} />
                <span className="flex flex-col gap-[1px] min-w-[0px]">
                  <span className={`flex items-center gap-[6px] ${phone ? "text-[11px] leading-[14px]" : "text-[12px] leading-[16px]"} font-[600] ${past || now ? "text-[#281910]" : "text-[rgba(20,12,4,0.36)]"}`}>
                    {x.step}
                    {past && (
                      <svg width="11" height="11" viewBox="0 0 24 24" aria-hidden="true" className="opacity-0 group-hover:opacity-60 transition-opacity duration-150" style={{ display: "block" }}>
                        <path d="M4 20h4L19 9l-4-4L4 16v4z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <span className={`truncate ${phone ? "text-[12px] leading-[16px]" : "text-[14px] leading-[19px]"} ${past ? `${SUB} group-hover:text-[#140C04]` : "text-transparent"} transition-colors duration-150`}>{(past && x.answer) || " "}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );

  const card = done ? (
    <div className="doe-pricing-rise flex flex-col gap-[24px]">
      <span className="w-[60px] h-[60px] flex items-center justify-center rounded-[999px] bg-[#DCE5D0]">
        <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
          <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#2F3B2A" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <h2 className={`m-0 text-[clamp(32px,4vw,48px)] leading-[1.04] tracking-[-0.035em] font-[400] text-[#281910] ${DISPLAY}`}>Welcome to Doe, {a.contact.name.trim().split(" ")[0]}.</h2>
      <p className={`m-0 text-[17px] leading-[25px] ${SUB}`}>
        {`${planLabel} for ${a.contact.practice}, ${money(total)} a month.`} Your setup is on its way to {a.contact.email}.
      </p>
      <ol className="m-0 p-0 list-none flex flex-col gap-[8px]">
        {[
          ["Connect your scheduling software", "Today, about 10 minutes"],
          [`Confirm your ${plural(providerCount, "provider")} and their services`, "With your onboarding lead"],
          ["Go live to personal agents", "Usually within two days"],
        ].map(([t, d], i) => (
          <li key={t} className={`flex items-center gap-[14px] p-[16px] rounded-[22px] ${CARD}`}>
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
    <div key={q.id} className={`doe-pricing-rise flex flex-col ${phone ? "gap-[22px]" : "gap-[28px]"}`}>
      <div className="flex items-end justify-between gap-[16px] flex-wrap">
        <h2 className={`m-0 text-[clamp(32px,3.8vw,48px)] leading-[1.04] tracking-[-0.035em] font-[400] text-[#281910] ${DISPLAY}`}>{q.title}</h2>
        {onPlan && !phone && billing}
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
            {last ? "Start onboarding" : q.id === "plan" && a.plan ? `Continue with ${mixed ? "these plans" : plan.name}` : "Continue"}
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
        className={`relative flex flex-col transition-[max-width,margin] duration-500 ${phone ? `mx-auto gap-[28px] ${a.plan ? "pb-[110px]" : "pb-[24px]"}` : `${wide ? "max-w-[1120px]" : "max-w-[760px]"} gap-[44px] pb-[40px] ${panelOpenDesktop ? "ml-0 mr-[380px]" : "mx-auto"}`}`}
      >
        {priceBar}
        {steps}
        <div
          ref={cardRef}
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
