"use client";

/**
 * Offers tab — promotions the practice publishes to patients' personal agents. Offers sit in a list of tickets on
 * the left (the stub shows what each is worth). The panel on the right edits the selected one, shows how it's doing,
 * and previews it as a patient's agent passes it on. Edits update the ticket as you type.
 *
 * The offers live in a shared store, so a selected service on the Services tab can show its offers and start one.
 */
import { createContext, type ReactNode, useContext, useState } from "react";

const DISPLAY = "font-['P22MackinacPro-Medium','P22_Mackinac_Pro',system-ui,sans-serif] font-[500]";
const SANS = "font-['DM_Sans',system-ui,sans-serif]";
const CLINIC = "Brooks Neurology";

type Status = "live" | "scheduled" | "draft" | "ended";
type Kind = "off" | "price" | "addon" | "bundle";

export type Offer = {
  id: string;
  title: string;
  kind: Kind;
  value: string;
  services: string[];
  audience: string[];
  starts: string;
  ends: string;
  perWeek: number;
  direct: boolean;
  terms: string;
  status: Status;
  stats: { matched: number; shown: number; booked: number };
};

const STATUS: Record<Status, { label: string; background: string; color: string }> = {
  live: { label: "Live", background: "#D6DEC6", color: "#2F3B2A" },
  scheduled: { label: "Scheduled", background: "#F3E2B4", color: "#281910" },
  draft: { label: "Draft", background: "#28191014", color: "#281910" },
  ended: { label: "Ended", background: "#ECE6DA", color: "#281910" },
};

const KINDS: { id: Kind; label: string; placeholder: string }[] = [
  { id: "off", label: "Money off", placeholder: "$25 off" },
  { id: "price", label: "Set price", placeholder: "$150" },
  { id: "addon", label: "Free add-on", placeholder: "Free" },
  { id: "bundle", label: "Bundle", placeholder: "20% off" },
];
const kindOf = (k: Kind) => KINDS.find((x) => x.id === k)!;

const SERVICES = [
  "New patient consult",
  "Migraine follow-up",
  "Routine EEG",
  "EMG and nerve study",
  "Botox for chronic migraine",
  "Memory screening",
  "Seizure follow-up",
  "Return-to-play note",
  "MS infusion",
  "Occipital nerve block",
  "48-hour EEG",
  "Sleep consult",
];
const AUDIENCES = ["New patients", "Existing patients", "Not seen in 12+ months", "Migraine patients", "Within 5 miles", "Kids under 18", "Aetna members", "Blue Cross members"];

const START: Offer[] = [
  {
    id: "botox",
    title: "Botox for chronic migraine, self-pay",
    kind: "price",
    value: "$1,500",
    services: ["Botox for chronic migraine"],
    audience: ["Migraine patients", "Existing patients"],
    starts: "Nov 1",
    ends: "Jan 31",
    perWeek: 6,
    direct: false,
    terms: "Includes all 31 injection sites. Self-pay only, paid at the visit.",
    status: "live",
    stats: { matched: 860, shown: 214, booked: 12 },
  },
  {
    id: "nerve-block",
    title: "Nerve block with a migraine visit",
    kind: "addon",
    value: "Free",
    services: ["Occipital nerve block", "Migraine follow-up"],
    audience: ["Existing patients", "Migraine patients"],
    starts: "Oct 1",
    ends: "Nov 30",
    perWeek: 24,
    direct: true,
    terms: "",
    status: "live",
    stats: { matched: 1240, shown: 412, booked: 41 },
  },
  {
    id: "np-consult",
    title: "New patient headache consult",
    kind: "price",
    value: "$150",
    services: ["New patient consult"],
    audience: ["New patients", "Within 5 miles"],
    starts: "Sep 15",
    ends: "Dec 31",
    perWeek: 8,
    direct: true,
    terms: "60-minute visit with a headache specialist. Imaging billed separately.",
    status: "live",
    stats: { matched: 3880, shown: 905, booked: 18 },
  },
  {
    id: "memory",
    title: "Memory check bundle",
    kind: "bundle",
    value: "20% off",
    services: ["Memory screening", "New patient consult"],
    audience: ["Not seen in 12+ months"],
    starts: "Nov 3",
    ends: "Jan 15",
    perWeek: 10,
    direct: false,
    terms: "Both visits booked together, within 30 days.",
    status: "scheduled",
    stats: { matched: 640, shown: 0, booked: 0 },
  },
  {
    id: "sleep",
    title: "Winter sleep consult",
    kind: "off",
    value: "$40 off",
    services: ["Sleep consult"],
    audience: ["Existing patients"],
    starts: "Jan 5",
    ends: "Feb 28",
    perWeek: 6,
    direct: true,
    terms: "",
    status: "draft",
    stats: { matched: 0, shown: 0, booked: 0 },
  },
  {
    id: "return-to-play",
    title: "Back-to-school concussion clearance",
    kind: "price",
    value: "$45",
    services: ["Return-to-play note"],
    audience: ["Kids under 18"],
    starts: "Aug 1",
    ends: "Sep 15",
    perWeek: 20,
    direct: true,
    terms: "A parent or guardian attends.",
    status: "ended",
    stats: { matched: 2210, shown: 760, booked: 96 },
  },
];

const FILTERS: { id: "all" | Status; label: string }[] = [
  { id: "all", label: "All" },
  { id: "live", label: "Live" },
  { id: "scheduled", label: "Scheduled" },
  { id: "draft", label: "Drafts" },
  { id: "ended", label: "Ended" },
];

const n = (v: number) => v.toLocaleString("en-US");
const pct = (part: number, whole: number) => (whole > 0 ? `${Math.round((part / whole) * 1000) / 10}%` : "—");
const EMPTY_STATS = { matched: 0, shown: 0, booked: 0 };

type Store = {
  offers: Offer[];
  selected: string;
  select: (id: string) => void;
  update: (id: string, patch: Partial<Offer>) => void;
  /** Starts a draft offer, optionally for some services, selects it and returns its id. */
  add: (services?: string[], title?: string) => string;
  /** Copies an offer into a new draft, selects it and returns its id. */
  duplicate: (id: string) => string;
  remove: (id: string) => void;
};

const OffersContext = createContext<Store | null>(null);

const STATIC: Store = {
  offers: START,
  selected: START[0]!.id,
  select: () => {},
  update: () => {},
  add: () => START[0]!.id,
  duplicate: () => START[0]!.id,
  remove: () => {},
};

export function OffersProvider({ children }: { children: ReactNode }) {
  const [offers, setOffers] = useState(START);
  const [selected, select] = useState(START[0]!.id);
  const [added, setAdded] = useState(0);

  const insert = (offer: Omit<Offer, "id">) => {
    const id = `offer-${added + 1}`;
    setAdded((v) => v + 1);
    setOffers((prev) => [{ ...offer, id }, ...prev]);
    select(id);
    return id;
  };

  const store: Store = {
    offers,
    selected,
    select,
    update: (id, patch) => setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o))),
    add: (services = [], title = "") =>
      insert({
        title,
        kind: "off",
        value: "$25 off",
        services,
        audience: [],
        starts: "Nov 1",
        ends: "Nov 30",
        perWeek: 10,
        direct: true,
        terms: "",
        status: "draft",
        stats: EMPTY_STATS,
      }),
    duplicate: (id) => {
      const from = offers.find((o) => o.id === id);
      if (!from) return id;
      return insert({ ...from, title: from.title ? `${from.title} (copy)` : "", status: "draft", stats: EMPTY_STATS });
    },
    remove: (id) => {
      if (offers.length < 2) return;
      const rest = offers.filter((o) => o.id !== id);
      setOffers(rest);
      if (selected === id) select(rest[0]!.id);
    },
  };

  return <OffersContext.Provider value={store}>{children}</OffersContext.Provider>;
}

/** The shared offers; outside a provider it falls back to the seed list, read-only. */
export function useOffers(): Store {
  return useContext(OffersContext) ?? STATIC;
}

export function OfferPill({ status }: { status: Status }) {
  const s = STATUS[status];
  return (
    <span className={`flex items-center h-[24px] px-[10px] rounded-[999px] text-[12px] leading-[16px] ${SANS} font-[500] whitespace-nowrap`} style={{ backgroundColor: s.background, color: s.color }}>
      {s.label}
    </span>
  );
}

/** What the offer gives, in the words an agent would use. */
const dealLine = (o: Offer) => (o.kind === "addon" ? `${o.value} with a visit` : o.kind === "bundle" ? `${o.value}, booked together` : o.kind === "price" ? `${o.value} self-pay` : o.value);

/** Two half-circle bites in the list's colour, top and bottom of the tear line. */
function Notches({ left, color }: { left: number; color: string }) {
  return (
    <>
      <span className="absolute top-[-8px] w-[16px] h-[16px] rounded-[999px] pointer-events-none" style={{ left: left - 8, backgroundColor: color }} />
      <span className="absolute bottom-[-8px] w-[16px] h-[16px] rounded-[999px] pointer-events-none" style={{ left: left - 8, backgroundColor: color }} />
    </>
  );
}

/** A ticket: the stub holds what the offer is worth, a dashed tear line separates it from the details. */
function Ticket({ offer, on, onPick }: { offer: Offer; on: boolean; onPick: () => void }) {
  return (
    <button
      type="button"
      onClick={onPick}
      className={`relative flex shrink-0 h-[88px] rounded-[16px] bg-paper text-left outline outline-[1.5px] -outline-offset-[1.5px] transition-[outline-color] duration-150 ${on ? "outline-ink" : "outline-transparent hover:outline-[#28191026]"} ${offer.status === "ended" ? "opacity-60" : ""}`}
    >
      <span className="flex flex-col justify-center gap-[2px] w-[112px] shrink-0 px-[16px]">
        <span className={`truncate text-[22px] leading-[28px] tracking-[-0.02em] ${DISPLAY} text-ink`}>{offer.value || "—"}</span>
        <span className={`truncate text-[11px] leading-[14px] ${SANS} font-[500] text-sub`}>{kindOf(offer.kind).label}</span>
      </span>
      <span className="w-[0px] shrink-0 border-l-[1.5px] border-dashed border-[#2819102E] my-[14px]" />
      <span className="flex flex-col justify-center gap-[6px] grow min-w-[0px] px-[16px]">
        <span className="flex items-center justify-between gap-[10px]">
          <span className={`truncate text-[15px] leading-[20px] ${SANS} font-[600] text-walnut`}>{offer.title || "Untitled offer"}</span>
          <OfferPill status={offer.status} />
        </span>
        <span className={`flex items-center justify-between gap-[10px] text-[13px] leading-[16px] ${SANS} text-sub`}>
          <span className="truncate">
            {offer.starts} – {offer.ends}
          </span>
          {offer.stats.booked > 0 && <span className="shrink-0 font-[500] text-walnut [font-variant-numeric:tabular-nums]">{offer.stats.booked} booked</span>}
        </span>
      </span>
      <Notches left={112} color="#F4EEDF" />
    </button>
  );
}

/** One setting: its name (and an optional note under it) on the left, the control on the right, in a paper row. */
function Row({ label, note, children, top = false }: { label: string; note?: string; children: ReactNode; top?: boolean }) {
  return (
    <div className={`flex shrink-0 ${top ? "items-start" : "items-center"} gap-[20px] min-h-[64px] px-[20px] py-[14px] rounded-[18px] bg-paper`}>
      <span className={`flex flex-col gap-[2px] w-[170px] shrink-0 ${top ? "pt-[7px]" : ""}`}>
        <span className={`text-[14px] leading-[20px] ${SANS} font-[500] text-walnut`}>{label}</span>
        {note && <span className={`text-[12px] leading-[16px] ${SANS} text-sub`}>{note}</span>}
      </span>
      <div className="flex grow min-w-[0px] items-center">{children}</div>
    </div>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-[34px] px-[14px] rounded-[999px] text-[13px] leading-[16px] ${SANS} font-[500] transition-colors duration-150 ${on ? "bg-ink [color:#FFFCF1]" : "bg-[#F4EEDF] text-walnut hover:bg-[#EEE6D6]"}`}
    >
      {children}
    </button>
  );
}

function Segmented<T extends string>({ value, options, onChange }: { value: T; options: { id: T; label: string; count?: number }[]; onChange: (v: T) => void }) {
  return (
    <span className="flex p-[3px] gap-[2px] rounded-[999px] bg-[#F4EEDF]">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={`flex items-center justify-center gap-[6px] h-[32px] px-[14px] rounded-[999px] text-[13px] leading-[16px] ${SANS} font-[500] transition-colors duration-150 ${value === o.id ? "bg-paper text-ink [box-shadow:#2819101A_0px_1px_2px]" : "text-sub hover:text-walnut"}`}
        >
          {o.label}
          {o.count !== undefined && <span className="text-[12px] text-[#2819107A] [font-variant-numeric:tabular-nums]">{o.count}</span>}
        </button>
      ))}
    </span>
  );
}

const field = `rounded-[12px] bg-[#F4EEDF] border-[1.5px] border-solid border-transparent focus:border-ink outline-none text-[14px] leading-[18px] ${SANS} font-[500] text-walnut placeholder:text-[#2819105C]`;

function Input({ value, onChange, width, placeholder }: { value: string; onChange: (v: string) => void; width?: number; placeholder?: string }) {
  return <input value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} style={{ width }} className={`h-[38px] px-[14px] ${field}`} />;
}

function Stepper({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const btn = `w-[32px] h-[32px] flex items-center justify-center rounded-[999px] bg-paper hover:bg-[#FAF6EC] transition-colors duration-150 text-[17px] leading-[17px] ${SANS} text-walnut`;
  return (
    <span className="flex items-center gap-[4px] p-[3px] rounded-[999px] bg-[#F4EEDF]">
      <button type="button" aria-label="Fewer" onClick={() => onChange(Math.max(1, value - 1))} className={btn}>
        −
      </button>
      <span className={`w-[40px] text-center text-[15px] leading-[18px] ${SANS} font-[600] text-walnut [font-variant-numeric:tabular-nums]`}>{value}</span>
      <button type="button" aria-label="More" onClick={() => onChange(value + 1)} className={btn}>
        +
      </button>
    </span>
  );
}

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)} className={`relative w-[42px] h-[24px] shrink-0 rounded-[999px] transition-colors duration-200 ${on ? "bg-ink" : "bg-[#28191026]"}`}>
      <span className="absolute top-[3px] w-[18px] h-[18px] rounded-[999px] bg-paper transition-[left] duration-200" style={{ left: on ? 21 : 3 }} />
    </button>
  );
}

/** Matched → shown → booked, each step with its share of the one before. */
function Funnel({ offer }: { offer: Offer }) {
  const { matched, shown, booked } = offer.stats;
  const steps = [
    { label: "Agents matched", value: matched, note: offer.audience.length ? `${offer.audience.length} audience ${offer.audience.length === 1 ? "rule" : "rules"}` : "Anyone nearby" },
    { label: "Shown to patients", value: shown, note: matched ? `${pct(shown, matched)} of matched` : "Not shown yet" },
    { label: "Visits booked", value: booked, note: shown ? `${pct(booked, shown)} of shown` : "None yet" },
  ];
  return (
    <div className="grid grid-cols-3 gap-[8px] shrink-0">
      {steps.map((t, i) => {
        const of = i === 0 ? (matched ? 1 : 0) : i === 1 ? (matched ? shown / matched : 0) : shown ? booked / shown : 0;
        return (
          <div key={t.label} className="flex flex-col gap-[4px] px-[18px] pt-[14px] pb-[16px] rounded-[18px] bg-[#F4EEDF]">
            <span className={`text-[13px] leading-[16px] ${SANS} font-[500] text-sub`}>{t.label}</span>
            <span className={`text-[28px] leading-[32px] tracking-[-0.02em] ${DISPLAY} text-walnut [font-variant-numeric:tabular-nums]`}>{t.value ? n(t.value) : "—"}</span>
            <span className="relative h-[4px] mt-[6px] rounded-[999px] bg-[#28191014] overflow-hidden">
              <span className="absolute inset-y-[0px] left-[0px] rounded-[999px] bg-walnut transition-[width] duration-300" style={{ width: `${Math.max(of > 0 ? 3 : 0, of * 100)}%` }} />
            </span>
            <span className={`text-[12px] leading-[16px] ${SANS} text-sub`}>{t.note}</span>
          </div>
        );
      })}
    </div>
  );
}

/** The offer as a patient's personal agent passes it on: the agent's line, then the ticket it attaches. */
function Preview({ offer }: { offer: Offer }) {
  const what = offer.services.join(" and ") || "a visit";
  const line = `${CLINIC}, 0.8 mi from you, has an offer on ${what}: ${dealLine(offer)}, ${offer.starts} to ${offer.ends}. ${
    offer.direct ? "I can book it for you now." : "Their front desk confirms the time once you ask."
  }`;
  const rows = [
    { label: "For", value: what },
    { label: "Who", value: offer.audience.join(", ") || "Anyone" },
    { label: "When", value: `${offer.starts} to ${offer.ends}` },
    { label: "Booking", value: offer.direct ? `Direct, up to ${offer.perWeek} a week` : "Front desk confirms" },
  ];
  return (
    <div className="flex flex-col items-center gap-[12px] py-[12px]">
      <div className="flex flex-col w-full max-w-[460px] gap-[10px]">
        <span className={`flex items-center gap-[8px] text-[12px] leading-[16px] ${SANS} font-[500] text-sub`}>
          <span className="w-[20px] h-[20px] rounded-[999px] bg-ink" />
          Patient&rsquo;s agent
        </span>
        <div className={`px-[18px] py-[14px] rounded-[20px] rounded-tl-[6px] bg-ink text-[14px] leading-[21px] ${SANS} [color:#FFFCF1]`}>{line}</div>

        <div className="relative flex flex-col rounded-[20px] bg-paper [box-shadow:#2819100F_0px_1px_0px,#2819101A_0px_6px_18px]">
          <div className="flex items-end justify-between gap-[16px] px-[20px] pt-[18px] pb-[16px]">
            <span className="flex flex-col gap-[4px] min-w-[0px]">
              <span className={`text-[12px] leading-[16px] ${SANS} font-[500] text-sub`}>{CLINIC}</span>
              <span className={`text-[20px] leading-[26px] tracking-[-0.01em] ${DISPLAY} text-walnut`}>{offer.title || "Untitled offer"}</span>
            </span>
            <span className={`shrink-0 text-[30px] leading-[34px] tracking-[-0.02em] ${DISPLAY} text-ink`}>{offer.value || "—"}</span>
          </div>
          <span className="mx-[20px] border-t-[1.5px] border-dashed border-[#2819102E]" />
          <div className="flex flex-col gap-[8px] px-[20px] pt-[14px] pb-[18px]">
            {rows.map((r) => (
              <span key={r.label} className={`flex gap-[12px] text-[13px] leading-[18px] ${SANS}`}>
                <span className="w-[64px] shrink-0 text-sub">{r.label}</span>
                <span className="font-[500] text-walnut">{r.value}</span>
              </span>
            ))}
            {offer.terms && <span className={`pt-[4px] text-[12px] leading-[17px] ${SANS} text-sub`}>{offer.terms}</span>}
            <span className="flex gap-[8px] pt-[8px]">
              <span className={`flex items-center h-[36px] px-[16px] rounded-[999px] bg-ink text-[13px] leading-[16px] ${SANS} font-[500] [color:#FFFCF1]`}>{offer.direct ? "Book it" : "Ask for a time"}</span>
              <span className={`flex items-center h-[36px] px-[16px] rounded-[999px] bg-[#28191014] text-[13px] leading-[16px] ${SANS} font-[500] text-walnut`}>Not now</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const btnGrey = `h-[38px] px-[16px] rounded-[999px] bg-[#28191014] hover:bg-[#2819101F] transition-colors duration-150 text-[14px] leading-[18px] ${SANS} font-[500] text-walnut`;
const btnInk = `h-[38px] px-[16px] rounded-[999px] bg-ink hover:bg-[#2B1D12] transition-colors duration-150 text-[14px] leading-[18px] ${SANS} font-[500] [color:#FFFCF1]`;

export function DoeHealthProductOffersPage() {
  const { offers, selected, select: setSelected, update, add: addOffer, duplicate, remove } = useOffers();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const shown = offers.filter(
    (o) => (filter === "all" || o.status === filter) && (!q || o.title.toLowerCase().includes(q) || o.services.some((s) => s.toLowerCase().includes(q))),
  );
  const offer = offers.find((o) => o.id === selected) ?? offers[0]!;
  const edit = (patch: Partial<Offer>) => update(offer.id, patch);
  const toggle = (list: string[], item: string) => (list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);
  const filters = FILTERS.map((f) => ({ ...f, count: f.id === "all" ? offers.length : offers.filter((o) => o.status === f.id).length }));

  const add = () => {
    addOffer();
    setFilter("all");
    setQuery("");
    setMode("edit");
  };
  const copy = () => {
    duplicate(offer.id);
    setFilter("all");
    setQuery("");
    setMode("edit");
  };

  return (
    <div className="relative [font-synthesis:none] h-full w-full flex flex-col gap-[20px] pt-[36px] px-[40px] pb-[28px] rounded-[24px] overflow-clip bg-paper antialiased">
      <div className="relative flex items-end justify-between">
        <span className={`text-[58px] leading-[62px] tracking-[-0.03em] ${DISPLAY} text-walnut`}>Offers</span>
        <div className="flex items-center gap-[8px]">
          <button type="button" className={`flex items-center gap-[6px] ${btnGrey}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
              <circle cx="12" cy="12" r="3" fill="none" stroke="#281910" strokeWidth="1.8" />
              <path
                d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"
                fill="none"
                stroke="#281910"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
            Manage
          </button>
          <button type="button" onClick={add} className={`flex items-center gap-[6px] h-[40px] pr-[18px] pl-[14px] rounded-[999px] bg-ink hover:bg-[#2B1D12] transition-colors duration-150 text-[14px] leading-[18px] ${SANS} font-[500] [color:#FFFCF1]`}>
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" style={{ display: "block" }}>
              <path d="M7 2.5v9M2.5 7h9" fill="none" stroke="#FFFCF1" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            New Offer
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-[20px] grow min-h-[0px]">
        <div className="flex items-center justify-between gap-[16px] shrink-0">
          <Segmented value={filter} onChange={setFilter} options={filters} />
          <label className="flex items-center gap-[8px] w-[260px] h-[38px] px-[14px] rounded-[999px] bg-[#F4EEDF] border-[1.5px] border-solid border-transparent focus-within:border-ink">
            <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block", flexShrink: 0 }}>
              <circle cx="11" cy="11" r="6.5" fill="none" stroke="#28191080" strokeWidth="2" />
              <path d="M16 16l4 4" fill="none" stroke="#28191080" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search offers or services"
              className={`grow min-w-[0px] bg-transparent outline-none text-[14px] leading-[18px] ${SANS} font-[500] text-walnut placeholder:text-[#2819107A]`}
            />
          </label>
        </div>

        <div className="grid grid-cols-[360px_1fr] gap-[16px] grow min-h-[0px]">
          <div className="flex flex-col min-h-[0px] gap-[6px] p-[8px] rounded-[18px] bg-[#F4EEDF] overflow-y-auto overscroll-y-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {shown.map((o) => (
              <Ticket key={o.id} offer={o} on={o.id === selected} onPick={() => setSelected(o.id)} />
            ))}
            {shown.length === 0 && (
              <span className={`px-[12px] py-[16px] text-[14px] leading-[18px] ${SANS} text-sub`}>{q ? `Nothing matches “${query.trim()}”.` : "No offers here yet."}</span>
            )}
            <button
              type="button"
              onClick={add}
              className={`flex items-center justify-center shrink-0 h-[52px] rounded-[16px] border-[1.5px] border-dashed border-[#28191033] hover:border-[#28191066] transition-colors duration-150 text-[13px] leading-[16px] ${SANS} font-[500] text-sub hover:text-walnut`}
            >
              New offer
            </button>
          </div>

          <div className="flex flex-col min-w-[0px] min-h-[0px] gap-[16px] p-[24px] rounded-[28px] bg-[#FAF6EC]">
            <div className="flex items-center justify-between gap-[16px]">
              <span className="flex items-center gap-[12px] grow min-w-[0px]">
                <input
                  data-large-field
                  value={offer.title}
                  placeholder="Untitled offer"
                  onChange={(e) => edit({ title: e.target.value })}
                  className={`grow min-w-[0px] bg-transparent outline-none text-[32px] leading-[38px] tracking-[-0.02em] ${DISPLAY} text-walnut placeholder:text-sub`}
                />
                <OfferPill status={offer.status} />
              </span>
              <span className="flex items-center gap-[8px] shrink-0">
                <Segmented
                  value={mode}
                  onChange={setMode}
                  options={[
                    { id: "edit", label: "Edit" },
                    { id: "preview", label: "Preview" },
                  ]}
                />
                <button type="button" onClick={copy} className={btnGrey}>
                  Duplicate
                </button>
                {offer.status === "draft" && offers.length > 1 && (
                  <button type="button" onClick={() => remove(offer.id)} className={btnGrey}>
                    Delete
                  </button>
                )}
                {offer.status === "live" ? (
                  <button type="button" onClick={() => edit({ status: "ended" })} className={btnGrey}>
                    End
                  </button>
                ) : (
                  <button type="button" onClick={() => edit({ status: "live" })} className={btnInk}>
                    {offer.status === "ended" ? "Run again" : offer.status === "scheduled" ? "Start now" : "Publish"}
                  </button>
                )}
              </span>
            </div>

            <Funnel offer={offer} />

            <div className="flex flex-col grow min-h-[0px] gap-[6px] overflow-y-auto overscroll-y-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {mode === "preview" ? (
                <Preview offer={offer} />
              ) : (
                <>
                  <Row label="Type">
                    <Segmented value={offer.kind} onChange={(k) => edit({ kind: k })} options={KINDS} />
                  </Row>
                  <Row label="Worth" note="Shown on the ticket stub">
                    <Input value={offer.value} onChange={(v) => edit({ value: v })} width={160} placeholder={kindOf(offer.kind).placeholder} />
                  </Row>
                  <Row label="Services" note={offer.services.length ? `${offer.services.length} picked` : "Pick at least one"} top>
                    <span className="flex flex-wrap gap-[6px]">
                      {SERVICES.map((s) => (
                        <Chip key={s} on={offer.services.includes(s)} onClick={() => edit({ services: toggle(offer.services, s) })}>
                          {s}
                        </Chip>
                      ))}
                    </span>
                  </Row>
                  <Row label="Who it reaches" note={offer.audience.length ? "Agents match all of these" : "Every agent nearby"} top>
                    <span className="flex flex-wrap gap-[6px]">
                      {AUDIENCES.map((a) => (
                        <Chip key={a} on={offer.audience.includes(a)} onClick={() => edit({ audience: toggle(offer.audience, a) })}>
                          {a}
                        </Chip>
                      ))}
                    </span>
                  </Row>
                  <Row label="Runs">
                    <span className="flex items-center gap-[8px]">
                      <Input value={offer.starts} onChange={(v) => edit({ starts: v })} width={120} />
                      <span className={`text-[14px] ${SANS} text-sub`}>to</span>
                      <Input value={offer.ends} onChange={(v) => edit({ ends: v })} width={120} />
                    </span>
                  </Row>
                  <Row label="Visits a week" note="Agents stop offering it once these are booked">
                    <Stepper value={offer.perWeek} onChange={(v) => edit({ perWeek: v })} />
                  </Row>
                  <Row label="Agents book directly" note={offer.direct ? "Into open slots, no call needed" : "The front desk confirms each one"}>
                    <Toggle on={offer.direct} onChange={(v) => edit({ direct: v })} label="Agents book directly" />
                  </Row>
                  <Row label="Fine print" note="Agents read this out as is" top>
                    <textarea
                      value={offer.terms}
                      onChange={(e) => edit({ terms: e.target.value })}
                      rows={2}
                      placeholder="What's included, limits, how it's paid"
                      className={`w-full resize-none px-[14px] py-[10px] ${field}`}
                    />
                  </Row>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
