"use client";

/**
 * /pricing builder — the practice and plan, one question at a time: how the practice is set up (Solo, Single
 * location, or Multi-clinic, each with a small drawing of its shape), its providers or locations, the specialty
 * (picked from the set or typed), then the four tiers side by side, and where to send the setup. Tiers stay out of
 * sight until the comparison. A brown bar along the bottom holds Back, a step counter and Continue.
 *
 * The practice is a team: locations, each with named providers who have their own specialty and plan. Free is in the
 * comparison but can't be chosen. On the comparison a toolbar for locations, providers, the team and the price
 * follows you down the page, and a panel on the right (a sheet on iPhone) holds the team to edit and the price, line
 * by line. Surfaces follow /news: beige outside, white inside, no borders.
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
/** Doe's boxes, as on /news: a beige box outside, white pieces inside it, no borders. */
const OUTER = "bg-[#F4EEDF]";
const INNER = "bg-white";
/** What's picked: a soft peach fill, no border, rather than a heavy dark fill. */
const SELECTED = "bg-[#FBE7DA] text-[#281910]";
/** A beige box pinned over the page as it scrolls, lifted off it by a soft shadow. */
const PINNED = "bg-[#F4EEDF] shadow-[0_14px_34px_-22px_rgba(40,25,16,0.5)]";

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
  plan: PlanId | null;
  annual: boolean;
  contact: { name: string; email: string; practice: string };
};

let seq = 0;
const nextId = (prefix: string) => `${prefix}${++seq}`;
/** A new provider, taking the specialty of the one it's added after, if any. */
const newProvider = (from?: Provider): Provider => ({ id: nextId("p"), name: "", specialty: from?.specialty ?? null, other: from?.other ?? "", plan: null });
const newSite = (name: string, count: number, from?: Provider): Site => ({ id: nextId("s"), name, providers: Array.from({ length: count }, () => newProvider(from)) });

const START: Answers = {
  shape: null,
  team: [newSite("Clinic 1", 1)],
  plan: null,
  annual: true,
  contact: { name: "", email: "", practice: "" },
};

/** A site with its provider list grown or trimmed to `n`, keeping the providers it already has; new ones copy the last one's specialty. */
const resize = (site: Site, n: number): Site => ({
  ...site,
  providers:
    n > site.providers.length
      ? [...site.providers, ...Array.from({ length: n - site.providers.length }, () => newProvider(site.providers[site.providers.length - 1]))]
      : site.providers.slice(0, Math.max(1, n)),
});

const shapeOf = (team: Site[]): PracticeShape => (team.length > 1 ? "group" : team[0]!.providers.length > 1 ? "clinic" : "solo");

function initials(name: string, n: number) {
  const words = name.replace(/^Dr\.?\s*/i, "").trim().split(/\s+/).filter(Boolean);
  return words.length ? words.map((w) => w[0]).join("").slice(0, 2).toUpperCase() : `P${n}`;
}

/**
 * The shape of each kind of practice, drawn in lines a shade off its beige well: buildings as outlines, providers as
 * small rings. On the chosen card the lines go a soft peach.
 */
function ShapeMark({ shape, on }: { shape: PracticeShape; on: boolean }) {
  const line = on ? "#E2A988" : "#D6C5A6";
  const building = (x: number, w: number, dots: number, key: string) => (
    <g key={key}>
      <rect x={x} y="10" width={w} height="34" rx="8" fill="none" stroke={line} strokeWidth="1.6" />
      {Array.from({ length: dots }, (_, i) => {
        const cols = Math.min(dots, 2);
        const gap = w / (cols + 1);
        return <circle key={i} cx={x + gap * ((i % cols) + 1)} cy={22 + Math.floor(i / cols) * 11} r="3.2" fill="none" stroke={line} strokeWidth="1.6" />;
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
  const btn = `${size} flex items-center justify-center rounded-[999px] bg-white hover:bg-[#FFFCF1] text-[#281910] leading-none transition-colors duration-150 disabled:opacity-35`;
  return (
    <span className="inline-flex items-center gap-[2px] p-[3px] rounded-[999px] bg-[#F4EEDF]">
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
            <span key={b.min} className={`flex flex-col gap-[1px] px-[10px] py-[8px] rounded-[14px] transition-colors duration-200 ${on ? SELECTED : "bg-[#F4EEDF] text-[#281910]"}`}>
              <span className={`text-[16px] leading-[20px] ${DISPLAY}`}>{b.off ? `−${Math.round(b.off * 100)}%` : "0%"}</span>
              <span className={`text-[11px] leading-[14px] ${SUB}`}>{bracketLabel(b)}</span>
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
      <span className={`px-[4px] text-[14px] leading-[18px] font-[500] ${SUB}`}>{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="h-[56px] px-[20px] rounded-[18px] bg-white outline-none focus:shadow-[inset_0_0_0_1.5px_#281910] text-[17px] leading-[22px] text-[#140C04] placeholder:text-[rgba(20,12,4,0.32)] transition-colors duration-150"
      />
    </label>
  );
}

type Question = {
  id: string;
  /** The step's name in the row of steps. */
  step: string;
  /** The title, as the lines it's set on (two, but one where a single word says it). */
  title: [string, string] | [string];
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
  const moved = useRef(false);
  const pinTop = phone ? 118 : 112;
  /** Ids past this were added since the current step or panel came into view: they grow in rather than appear. */
  const baseline = useRef(0);
  const viewKey = useRef("");
  if (viewKey.current !== `${at}-${done}-${panel}`) {
    viewKey.current = `${at}-${done}-${panel}`;
    baseline.current = seq;
  }
  const fresh = (id: string) => Number(id.slice(1)) > baseline.current;

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
  const specialtyOf = (p: Provider): Specialty | null => p.specialty;
  /** Every provider has a specialty, and anyone on Other has typed theirs. */
  const specialtiesSet = providers.every((p) => p.specialty && (p.specialty !== "other" || p.other.trim()));
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

  /** Picking a practice shape reshapes the team, keeping what it can. */
  const pickShape = (shape: PracticeShape) => {
    const first = a.team[0]!;
    const team =
      shape === "solo"
        ? [resize({ ...first, name: first.name }, 1)]
        : shape === "clinic"
          ? [resize(first, Math.max(first.providers.length, 2))]
          : a.team.length > 1
            ? a.team
            : [first, newSite("Clinic 2", 1, first.providers[0])];
    set({ shape, team });
  };

  /** Locations from the toolbar: more turns the practice multi-clinic, fewer drops the last ones. */
  const setLocations = (n: number) => {
    if (n > a.team.length) setTeam([...a.team, ...Array.from({ length: n - a.team.length }, (_, i) => newSite(`Clinic ${a.team.length + i + 1}`, 1, providers[0]))]);
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
      </button>
    );
  };

  /** Desktop: every tier side by side, price and a choose button up top, then each feature group, then the specialties. */
  const table = (
    <div className={`p-[6px] rounded-[30px] ${OUTER}`}>
    <div className={`grid ${cols} rounded-[24px] overflow-clip ${INNER}`}>
      <div ref={headRef} aria-hidden="true" />
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
    </div>
  );

  /** Desktop: the tier names and prices, lined up with the table's columns, under the pinned toolbar once its header scrolls away. */
  const strip = (
    <div className={`mt-[6px] p-[6px] rounded-[24px] ${PINNED}`}>
    <div className={`grid ${cols} rounded-[18px] overflow-clip ${INNER}`}>
      <span aria-hidden="true" />
      {PLANS.map((p) => (
        <span key={p.id} className={`flex flex-col items-center justify-center py-[8px] ${dark(p.id) ? "bg-[#281910] text-[#FFFCF1]" : lit(p.id) ? "bg-[rgba(244,232,210,0.7)] text-[#281910]" : "text-[#281910]"}`}>
          <span className={`text-[16px] leading-[20px] whitespace-nowrap ${DISPLAY}`}>{p.name}</span>
          <span className={`text-[13px] leading-[17px] [font-variant-numeric:tabular-nums] ${dark(p.id) ? "text-[#FCCFB8]" : SUB}`}>{money(priceOf(p.id))}/mo</span>
        </span>
      ))}
    </div>
    </div>
  );

  /** iPhone: the four tiers as a switcher, the one shown picked out in peach. */
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
            className={`flex flex-col items-center gap-[1px] pt-[9px] pb-[8px] rounded-[18px] transition-colors duration-200 ${on ? SELECTED : `${INNER} text-[#281910]`}`}
          >
            <span className="flex items-center gap-[4px] text-[12px] leading-[16px] font-[600] whitespace-nowrap">
              {p.name}
            </span>
            <span className={`text-[18px] leading-[22px] tracking-[-0.02em] ${DISPLAY} [font-variant-numeric:tabular-nums]`}>{money(priceOf(p.id))}</span>
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
    <div className={`flex flex-col gap-[6px] p-[6px] rounded-[30px] ${OUTER}`}>
      <div key={shown} className={`doe-pricing-rise flex flex-col gap-[14px] p-[20px] rounded-[24px] ${dark(shown) ? "bg-[#281910] text-[#FFFCF1]" : `${INNER} text-[#281910]`}`}>
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

      <div className={`flex flex-col rounded-[24px] py-[4px] ${INNER}`}>
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
    <div role="radiogroup" aria-label="Billing" className={`flex p-[4px] gap-[2px] rounded-[999px] ${OUTER} ${phone ? "w-full" : ""}`}>
      {(["monthly", "annual"] as const).map((b) => {
        const on = (b === "annual") === a.annual;
        return (
          <button
            key={b}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => set({ annual: b === "annual" })}
            className={`flex items-center justify-center gap-[8px] h-[40px] px-[18px] rounded-[999px] text-[14px] leading-[18px] font-[600] whitespace-nowrap transition-[background-color,color,box-shadow] duration-200 ${phone ? "grow basis-0" : ""} ${on ? "bg-white text-[#140C04]" : `${SUB} hover:text-[#281910]`}`}
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

  /** iPhone: opens the team sheet. */
  const teamButton = (
    <button
      type="button"
      onClick={() => setPanel("team")}
      className={`flex items-center justify-center gap-[10px] h-[48px] w-full pl-[12px] pr-[16px] rounded-[18px] ${OUTER} text-[14px] leading-[18px] font-[600] text-[#281910] transition-colors duration-150 whitespace-nowrap`}
    >
      <TeamIcon />
      Providers and plans
    </button>
  );

  const counter = (label: string, control: ReactNode) => (
    <span className={`flex items-center justify-between gap-[14px] ${phone ? "py-[8px]" : "pl-[14px] pr-[6px]"}`}>
      <span className="text-[14px] leading-[18px] font-[600] text-[#281910] whitespace-nowrap">{label}</span>
      {control}
    </span>
  );
  const locationsControl = counter("Locations", <Count value={locationCount} max={30} onChange={setLocations} />);
  const providersControl = counter("Providers", <Count value={providerCount} min={locationCount} max={200} onChange={setProviderTotal} />);

  /** Desktop: one toolbar for the practice's size, the team and the price, pinned as the table scrolls. */
  /** Desktop: the team's faces and a pencil, opening the team panel to edit providers, their specialties and plans. */
  const editTeam = (
    <button
      type="button"
      onClick={() => setPanel("team")}
      className={`flex items-center gap-[10px] h-[48px] pl-[10px] pr-[16px] rounded-[18px] ${INNER} hover:bg-[#FFFCF1] text-[14px] leading-[18px] font-[600] text-[#281910] transition-colors duration-150 whitespace-nowrap`}
    >
      {avatars}
      Edit providers
      <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block", flexShrink: 0 }}>
        <path d="M4 20h4L19 9l-4-4L4 16v4z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    </button>
  );

  /** Desktop: one toolbar, pinned as the table scrolls: the practice's size and its providers on the left, billing on the right. */
  const toolbar = (
    <div className={`flex items-center gap-[6px] p-[6px] rounded-[24px] ${pinned ? PINNED : OUTER}`}>
      <span className={`flex items-center h-[48px] rounded-[18px] ${INNER}`}>{locationsControl}</span>
      <span className={`flex items-center h-[48px] rounded-[18px] ${INNER}`}>{providersControl}</span>
      {/* The panel shows the team itself while it's open, which leaves room for billing. */}
      {!panel && editTeam}
      <span className="grow" />
      {billing}
    </div>
  );

  /** iPhone: the practice's size, billing and the team, above the switcher; they stay in place as the page scrolls. */
  const phoneControls = (
    <div className="flex flex-col gap-[8px]">
      <div className={`flex flex-col gap-[4px] p-[4px] rounded-[24px] ${OUTER}`}>
        <span className={`px-[14px] rounded-[20px] ${INNER}`}>{locationsControl}</span>
        <span className={`px-[14px] rounded-[20px] ${INNER}`}>{providersControl}</span>
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
          className={`grow min-w-[0px] px-[14px] rounded-[999px] bg-[#F4EEDF] outline-none focus:shadow-[inset_0_0_0_1.5px_#281910] text-[#140C04] placeholder:text-[rgba(20,12,4,0.38)] ${o.big ? "h-[44px] w-[180px] text-[15px]" : "h-[34px] w-[140px] text-[13px]"}`}
        />
      )}
    </span>
  );

  /**
   * The team, location by location: rename a location, set how many providers it has, name each provider and give them
   * a specialty, and add or remove locations and providers; anything added grows into place. On the comparison each
   * provider also gets a plan.
   */
  const teamEditor = (withPlans: boolean) => {
    const surface = OUTER;
    const row = INNER;
    return (
      <div className="flex flex-col gap-[10px]">
        {a.team.map((site, si) => (
          <div key={site.id} className={fresh(site.id) ? "doe-pricing-grow" : ""}>
          {/* The grow animates this padding-free box, so the location opens from nothing. */}
          <div>
          <div className={`flex flex-col gap-[6px] p-[8px] rounded-[22px] ${surface}`}>
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
                <div key={p.id} className={fresh(p.id) ? "doe-pricing-grow" : ""}>
                <div>
                <div className={`flex flex-col gap-[8px] p-[10px] rounded-[18px] ${row} ${withPlans || phone ? "" : "sm:flex-row sm:items-center"}`}>
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
                      // The first specialty picked also fills in everyone still without one.
                      onPick: (v) =>
                        set({ team: a.team.map((x) => ({ ...x, providers: x.providers.map((y) => (y.id === p.id || (!y.specialty && v !== "other") ? { ...y, specialty: v } : y)) })) }),
                      onType: (v) => editProvider(p.id, { other: v }),
                    })}
                    {withPlans && <Pick dark label={`${providerName(p)} plan`} value={planOf(p).id} options={planOptions} onChange={(v) => editProvider(p.id, { plan: v === plan.id ? null : v })} />}
                  </span>
                  {!withPlans && !phone && site.providers.length > 1 && (
                    <Close label={`Remove ${providerName(p)}`} onClick={() => setTeam(a.team.map((x) => (x.id === site.id ? { ...x, providers: x.providers.filter((y) => y.id !== p.id) } : x)))} />
                  )}
                </div>
                </div>
                </div>
              );
            })}
            <button
              type="button"
              onClick={() => setTeam(a.team.map((x) => (x.id === site.id ? resize(x, x.providers.length + 1) : x)))}
              className="self-start flex items-center gap-[6px] h-[36px] px-[14px] rounded-[999px] text-[14px] leading-[18px] font-[600] text-[#281910] hover:bg-white transition-colors duration-150"
            >
              <span className="text-[17px] leading-[17px]">+</span>
              Add provider
            </button>
          </div>
          </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setTeam([...a.team, newSite(`Clinic ${a.team.length + 1}`, 1, providers[0])])}
          className={`flex items-center justify-center gap-[8px] h-[52px] rounded-[22px] ${OUTER} hover:bg-[#EDE5D2] text-[15px] leading-[20px] font-[600] text-[#281910] transition-colors duration-150`}
        >
          <span className="text-[18px] leading-[18px]">+</span>
          Add location
        </button>
      </div>
    );
  };

  /** What more providers or locations take off: the discount now, a bar per step, and how many more reach the next. */
  const discountHint = (title: string, brackets: Bracket[], n: number, unit: string) => {
    const reached = brackets.indexOf(bracketFor(brackets, n));
    const now = brackets[reached]!;
    const next = brackets[reached + 1];
    const pct = (b: Bracket) => `${Math.round(b.off * 100)}%`;
    const more = next ? next.min - n : 0;
    return (
      <div key={title} className="flex flex-col gap-[10px] min-w-[0px]">
        <span className="flex items-baseline justify-between gap-[12px]">
          <span className="text-[14px] leading-[18px] font-[600] text-[#140C04]">{title}</span>
          <span className={`text-[14px] leading-[18px] font-[600] [font-variant-numeric:tabular-nums] transition-colors duration-300 ${now.off ? "text-[#140C04]" : SUB}`}>
            {now.off ? `${pct(now)} off` : "0%"}
          </span>
        </span>
        <span className="grid grid-cols-3 gap-[4px]" aria-hidden="true">
          {brackets.slice(1).map((b, i) => (
            <span key={b.min} className={`h-[4px] rounded-[99px] transition-colors duration-300 ${i < reached ? "bg-[#281910]" : "bg-[#F4EEDF]"}`} />
          ))}
        </span>
        <span className={`text-[13px] leading-[17px] ${SUB}`}>
          {next ? `${plural(more, `more ${unit}`, `more ${unit}s`)} ${more === 1 ? "unlocks" : "unlock"} ${pct(next)} off` : "Highest discount reached"}
        </span>
      </div>
    );
  };
  const discountHints = (
    <div className={`p-[6px] rounded-[26px] ${OUTER}`}>
      <div className={`grid p-[18px] rounded-[20px] ${INNER} ${phone ? "grid-cols-1 gap-[18px]" : "grid-cols-2 gap-[40px] px-[22px]"}`}>
        {discountHint("Multi-provider Discount", PROVIDER_BRACKETS, providerCount, "provider")}
        {discountHint("Multi-clinic Discount", LOCATION_BRACKETS, locationCount, "location")}
      </div>
    </div>
  );

  const questions: Question[] = [
    {
      id: "shape",
      step: "Practice",
      title: ["How is your", "practice set up?"],
      ready: !!a.shape,
      body: (
        <div className={`grid gap-[6px] p-[6px] rounded-[32px] ${OUTER} ${phone ? "grid-cols-1" : "grid-cols-3"}`}>
          {PRACTICE_SHAPES.map((s) => {
            const on = a.shape === s.id;
            return (
              <button
                key={s.id}
                type="button"
                aria-pressed={on}
                onClick={() => pickShape(s.id)}
                className={`flex ${phone ? "flex-row items-center gap-[16px] p-[14px]" : "flex-col items-start gap-[26px] p-[20px]"} rounded-[26px] text-left transition-colors duration-200 ${on ? SELECTED : `${INNER} text-[#281910] [@media(hover:hover)]:hover:bg-[#FFFCF1]`}`}
              >
                <span className={`shrink-0 flex items-center justify-center rounded-[18px] ${phone ? "w-[96px] h-[64px]" : "w-full h-[92px]"} ${on ? "bg-[rgba(255,255,255,0.6)]" : "bg-[#F4EEDF]"}`}>
                  <ShapeMark shape={s.id} on={on} />
                </span>
                <span className="flex flex-col items-start gap-[2px]">
                  <span className={`text-[24px] leading-[28px] tracking-[-0.02em] ${DISPLAY}`}>{s.title}</span>
                  <span className={`text-[15px] leading-[20px] ${SUB}`}>{s.note}</span>
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
      title: ["Who’s on", "your team?"],
      ready: specialtiesSet && a.team.every((x) => x.name.trim()),
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
      title: ["Compare"],
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
      title: ["Where should we", "send your setup?"],
      ready: !!(a.contact.name.trim() && /.+@.+\..+/.test(a.contact.email) && a.contact.practice.trim()),
      body: (
        <div className={`grid gap-[14px] p-[16px] rounded-[28px] ${OUTER} ${phone ? "grid-cols-1" : "grid-cols-2"}`}>
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
          className={`z-50 flex flex-col bg-[#FFFCF1] ${phone ? "doe-pricing-sheet fixed left-0 right-0 bottom-0 max-h-[86vh] rounded-t-[30px]" : "doe-pricing-slide fixed right-[20px] top-[120px] bottom-[20px] w-[400px] rounded-[32px] shadow-[0_24px_60px_-30px_rgba(40,25,16,0.45)]"}`}
        >
          <div className="flex items-center justify-between gap-[12px] p-[16px] pb-[12px]">
            <span className="flex p-[3px] gap-[2px] rounded-[999px] bg-[#F4EEDF]">
              {(["team", "price"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setPanel(t)}
                  className={`h-[36px] px-[18px] rounded-[999px] text-[14px] leading-[18px] font-[500] transition-colors duration-200 ${panel === t ? "bg-white text-[#140C04]" : `${SUB} hover:text-[#281910]`}`}
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

  /** A question's title, line by line. */
  const heading = (lines: string[]) => (
    <h2 className={`m-0 flex flex-col ${phone ? "text-[34px] leading-[37px]" : "text-[48px] leading-[51px]"} tracking-[-0.035em] font-[400] text-[#281910] ${DISPLAY}`}>
      {lines.map((line) => (
        <span key={line}>{line}</span>
      ))}
    </h2>
  );

  const panelOpenDesktop = !!sidePanel && !phone;
  const goLabel = last ? "Start onboarding" : q.id === "plan" && a.plan && !phone ? "Finalize" : "Continue";
  const back = () => setAt(index - 1);
  const arrow = (dir: "back" | "next", size = 16) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block", flexShrink: 0 }}>
      <path d={dir === "back" ? "M19 12H5m6-6l-6 6 6 6" : "M5 12h14m-6-6l6 6-6 6"} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  /**
   * The brown bar along the bottom: Back, the price (big, once there is one), then where you are beside Continue. It
   * fades in once a practice type is picked.
   */
  const dock =
    !done && a.shape ? (
      <div className={`fixed left-0 bottom-[max(10px,env(safe-area-inset-bottom))] z-40 flex justify-center pointer-events-none ${phone ? "right-0 px-[10px]" : panelOpenDesktop ? "right-[420px] px-[24px]" : "right-0 px-[24px]"}`}>
        <div className={`doe-pricing-rise pointer-events-auto flex items-center gap-[8px] p-[8px] rounded-[26px] bg-[#281910] text-[#FFFCF1] shadow-[0_18px_40px_-20px_rgba(40,25,16,0.6)] ${phone ? "w-full" : "w-[560px] max-w-full"}`}>
          <button
            type="button"
            aria-label="Back"
            disabled={index === 0}
            onClick={back}
            className="w-[48px] h-[48px] shrink-0 flex items-center justify-center rounded-[999px] bg-[rgba(255,252,241,0.12)] hover:bg-[rgba(255,252,241,0.2)] disabled:opacity-30 disabled:hover:bg-[rgba(255,252,241,0.12)] transition-[background-color,opacity] duration-200"
          >
            {arrow("back", 18)}
          </button>
          {/* The price, big, on the left once there is one; on the comparison it opens the breakdown. */}
          <span className="grow min-w-[0px] flex items-center pl-[8px]">
            {a.plan && (
              <button type="button" disabled={!onPlan} onClick={() => setPanel("price")} aria-label={onPlan ? "See price breakdown" : undefined} className="flex items-baseline gap-[3px] whitespace-nowrap disabled:cursor-default">
                <span className={`${phone ? "text-[24px] leading-[28px]" : "text-[28px] leading-[32px]"} tracking-[-0.03em] ${DISPLAY} [font-variant-numeric:tabular-nums]`}>{money(total)}</span>
                <span className="text-[14px] text-[rgba(255,252,241,0.6)]">/mo</span>
              </button>
            )}
          </span>
          {/* Where you are, right beside Continue. */}
          <span className="shrink-0 flex items-center gap-[8px] pr-[4px]" role="img" aria-label={`Step ${index + 1} of ${questions.length}: ${q.step}`}>
            {!phone && (
              <span className="flex items-center gap-[4px]">
                {questions.map((x, i) => (
                  <span
                    key={x.id}
                    className={`h-[6px] rounded-[99px] transition-[width,background-color] duration-300 ${i === index ? "w-[18px] bg-[#FCCFB8]" : i < index ? "w-[6px] bg-[rgba(255,252,241,0.7)]" : "w-[6px] bg-[rgba(255,252,241,0.22)]"}`}
                  />
                ))}
              </span>
            )}
            <span className="text-[13px] leading-[16px] font-[600] text-[rgba(255,252,241,0.6)] [font-variant-numeric:tabular-nums]">
              {index + 1}/{questions.length}
            </span>
          </span>
          <button
            type="button"
            disabled={!q.ready}
            onClick={forward}
            className="flex items-center gap-[8px] h-[48px] pl-[20px] pr-[16px] shrink-0 rounded-[999px] bg-[#FCCFB8] hover:bg-[#FFDCCB] text-[#140C04] disabled:bg-[rgba(255,252,241,0.12)] disabled:text-[rgba(255,252,241,0.4)] text-[15px] leading-[20px] font-[600] transition-colors duration-200"
          >
            {goLabel}
            {arrow("next")}
          </button>
        </div>
      </div>
    ) : null;

  const card = done ? (
    <div className="doe-pricing-rise flex flex-col gap-[24px]">
      <span className="w-[60px] h-[60px] flex items-center justify-center rounded-[999px] bg-[#DCE5D0]">
        <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
          <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#2F3B2A" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {heading(["Welcome to Doe,", `${a.contact.name.trim().split(" ")[0]}.`])}
      <p className={`m-0 text-[17px] leading-[25px] ${SUB}`}>
        {`${planLabel} for ${a.contact.practice}, ${money(total)} a month.`} Your setup is on its way to {a.contact.email}.
      </p>
      <ol className={`m-0 p-[6px] list-none flex flex-col gap-[6px] rounded-[28px] ${OUTER}`}>
        {[
          ["Connect your scheduling software", "Today, about 10 minutes"],
          [`Confirm your ${plural(providerCount, "provider")} and their services`, "With your onboarding lead"],
          ["Go live to personal agents", "Usually within two days"],
        ].map(([t, d], i) => (
          <li key={t} className={`flex items-center gap-[14px] p-[16px] rounded-[22px] ${INNER}`}>
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
        {heading(q.title)}
      </div>
      {q.body}
    </div>
  );

  return (
    <div className="relative">
      <div
        className={`relative flex flex-col transition-[max-width,margin] duration-500 ${phone ? `mx-auto gap-[28px] ${done ? "pb-[24px]" : "pb-[110px]"}` : `${wide ? "max-w-[1120px]" : "max-w-[760px]"} gap-[44px] ${done ? "pb-[40px]" : "pb-[120px]"} ${panelOpenDesktop ? "ml-0 mr-[380px]" : "mx-auto"}`}`}
      >
        <div
          ref={cardRef}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !done && (e.target as HTMLElement).tagName === "INPUT" && (e.target as HTMLInputElement).type !== "range") forward();
          }}
        >
          {card}
        </div>
      </div>
      {dock}
      {sidePanel}
    </div>
  );
}
