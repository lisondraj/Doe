"use client";

/**
 * Offers tab — promotions the practice publishes to patients' personal agents. Each offer is a ticket in the
 * shelf on the left (the stub shows what it's worth), the middle builds it — what it is, which service, who it
 * reaches, when and how many — and the right shows the listing exactly as agents read it, with how it's doing.
 * Edits update the ticket and the listing as you type.
 */
import { type ReactNode, useState } from "react";

const DISPLAY = "font-['P22MackinacPro-Medium','P22_Mackinac_Pro',system-ui,sans-serif] font-[500]";
const SANS = "font-['DM_Sans',system-ui,sans-serif]";

type Status = "live" | "scheduled" | "draft" | "ended";
type Kind = "off" | "price" | "addon" | "bundle";

type Offer = {
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
  status: Status;
  tone: string;
  stats: { matched: number; shown: number; booked: number };
};

const STATUS: Record<Status, { label: string; background: string; color: string }> = {
  live: { label: "Live", background: "#D6DEC6", color: "#2F3B2A" },
  scheduled: { label: "Scheduled", background: "#F3E2B4", color: "#281910" },
  draft: { label: "Draft", background: "#28191014", color: "#281910" },
  ended: { label: "Ended", background: "#ECE6DA", color: "#281910" },
};

const KINDS: { id: Kind; label: string; hint: string }[] = [
  { id: "off", label: "Money off", hint: "$40 off" },
  { id: "price", label: "Set price", hint: "$75 flat" },
  { id: "addon", label: "Free add-on", hint: "Free with a visit" },
  { id: "bundle", label: "Bundle", hint: "Two for one price" },
];

const SERVICES = ["Annual physical", "Flu shot", "Hearing test", "Tympanometry", "Allergy panel", "Sports physical", "Ear cleaning", "Follow-up visit"];
const AUDIENCES = ["New patients", "Existing patients", "Not seen in 12+ months", "Due for a flu shot", "Within 5 miles", "Kids under 18", "Aetna members", "Blue Cross members"];

const START: Offer[] = [
  {
    id: "flu",
    title: "Flu shot with any visit",
    kind: "addon",
    value: "Free",
    services: ["Flu shot", "Follow-up visit"],
    audience: ["Existing patients", "Due for a flu shot"],
    starts: "Oct 1",
    ends: "Nov 30",
    perWeek: 24,
    direct: true,
    status: "live",
    tone: "#E3E9D9",
    stats: { matched: 1240, shown: 412, booked: 41 },
  },
  {
    id: "np-physical",
    title: "New patient physical",
    kind: "price",
    value: "$75",
    services: ["Annual physical"],
    audience: ["New patients", "Within 5 miles"],
    starts: "Sep 15",
    ends: "Dec 31",
    perWeek: 8,
    direct: true,
    status: "live",
    tone: "#F8DCCB",
    stats: { matched: 3880, shown: 905, booked: 18 },
  },
  {
    id: "hearing",
    title: "Hearing check bundle",
    kind: "bundle",
    value: "20% off",
    services: ["Hearing test", "Tympanometry"],
    audience: ["Not seen in 12+ months"],
    starts: "Nov 3",
    ends: "Jan 15",
    perWeek: 10,
    direct: false,
    status: "scheduled",
    tone: "#F3E7C9",
    stats: { matched: 640, shown: 0, booked: 0 },
  },
  {
    id: "allergy",
    title: "Spring allergy prep",
    kind: "off",
    value: "$40 off",
    services: ["Allergy panel"],
    audience: ["Existing patients"],
    starts: "Mar 1",
    ends: "Apr 30",
    perWeek: 6,
    direct: true,
    status: "draft",
    tone: "#EEE6D6",
    stats: { matched: 0, shown: 0, booked: 0 },
  },
  {
    id: "sports",
    title: "Back-to-school sports physical",
    kind: "price",
    value: "$45",
    services: ["Sports physical"],
    audience: ["Kids under 18"],
    starts: "Aug 1",
    ends: "Sep 15",
    perWeek: 20,
    direct: true,
    status: "ended",
    tone: "#ECE6DA",
    stats: { matched: 2210, shown: 760, booked: 96 },
  },
];

const FILTERS: { id: "all" | Status; label: string }[] = [
  { id: "all", label: "All" },
  { id: "live", label: "Live" },
  { id: "scheduled", label: "Scheduled" },
  { id: "draft", label: "Drafts" },
];

const n = (v: number) => v.toLocaleString("en-US");

function Pill({ status }: { status: Status }) {
  const s = STATUS[status];
  return (
    <span className={`flex items-center h-[24px] px-[10px] rounded-[999px] text-[12px] leading-[16px] ${SANS} font-[500] whitespace-nowrap`} style={{ backgroundColor: s.background, color: s.color }}>
      {s.label}
    </span>
  );
}

/**
 * A ticket: the stub on the left holds the value, a dashed tear line and two half-circle notches (cut in the
 * page's own paper colour) separate it from the details.
 */
function Ticket({ offer, on, onPick }: { offer: Offer; on: boolean; onPick: () => void }) {
  return (
    <button
      type="button"
      onClick={onPick}
      className={`relative flex shrink-0 h-[104px] rounded-[18px] text-left outline outline-[1.5px] -outline-offset-[1.5px] transition-[outline-color,opacity] duration-150 ${on ? "outline-ink" : "outline-transparent hover:outline-[#28191026]"} ${offer.status === "ended" ? "opacity-60" : ""}`}
      style={{ backgroundColor: offer.tone }}
    >
      <span className="flex flex-col justify-center w-[128px] shrink-0 px-[16px]">
        <span className={`truncate text-[22px] leading-[26px] tracking-[-0.02em] ${DISPLAY} text-ink`}>{offer.value || "—"}</span>
        <span className={`mt-[4px] whitespace-nowrap text-[10px] leading-[14px] ${SANS} font-[600] uppercase tracking-[0.06em] text-sub`}>{KINDS.find((k) => k.id === offer.kind)!.label}</span>
      </span>
      <span className="relative w-[0px] shrink-0 border-l-[1.5px] border-dashed border-[#28191033] my-[14px]" />
      <span className="absolute left-[119px] -top-[9px] w-[18px] h-[18px] rounded-[999px] bg-paper" />
      <span className="absolute left-[119px] -bottom-[9px] w-[18px] h-[18px] rounded-[999px] bg-paper" />
      <span className="flex flex-col justify-between grow min-w-[0px] px-[16px] py-[14px]">
        <span className="flex items-start justify-between gap-[8px]">
          <span className={`text-[15px] leading-[20px] ${SANS} font-[600] text-walnut line-clamp-2`}>{offer.title || "Untitled offer"}</span>
          <Pill status={offer.status} />
        </span>
        <span className={`flex items-center justify-between gap-[8px] text-[12px] leading-[16px] ${SANS} text-sub`}>
          <span className="truncate">
            {offer.starts} – {offer.ends}
          </span>
          {offer.stats.booked > 0 && <span className="shrink-0 font-[600] text-walnut">{offer.stats.booked} booked</span>}
        </span>
      </span>
    </button>
  );
}

function Group({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-[10px]">
      <span className="flex items-baseline justify-between gap-[12px]">
        <span className={`text-[14px] leading-[18px] ${SANS} font-[600] text-walnut`}>{label}</span>
        {hint && <span className={`text-[12px] leading-[16px] ${SANS} text-sub`}>{hint}</span>}
      </span>
      {children}
    </div>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-[6px] h-[34px] px-[14px] rounded-[999px] text-[13px] leading-[16px] ${SANS} font-[500] transition-colors duration-150 ${on ? "bg-ink [color:#FFFCF1]" : "bg-[#F4EEDF] text-walnut hover:bg-[#EEE6D6]"}`}
    >
      {on && (
        <svg width="11" height="11" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
          <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {children}
    </button>
  );
}

function TextField({ label, value, onChange, big = false }: { label: string; value: string; onChange: (v: string) => void; big?: boolean }) {
  return (
    <label className="flex flex-col gap-[4px] min-w-[0px] px-[16px] py-[12px] rounded-[18px] bg-[#F4EEDF] border-[1.5px] border-solid border-transparent focus-within:border-ink transition-colors duration-150 cursor-text">
      <span className={`text-[12px] leading-[16px] ${SANS} font-[500] text-sub`}>{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full min-w-[0px] bg-transparent outline-none text-walnut ${big ? `text-[24px] leading-[30px] tracking-[-0.02em] ${DISPLAY}` : `text-[15px] leading-[20px] ${SANS} font-[500]`}`}
      />
    </label>
  );
}

function Stepper({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const btn = `w-[34px] h-[34px] flex items-center justify-center rounded-[999px] bg-paper hover:bg-[#FAF6EC] transition-colors duration-150 text-[18px] leading-[18px] ${SANS} text-walnut`;
  return (
    <span className="flex items-center gap-[4px] p-[4px] rounded-[999px] bg-[#F4EEDF]">
      <button type="button" aria-label="Fewer" onClick={() => onChange(Math.max(1, value - 1))} className={btn}>
        −
      </button>
      <span className={`w-[44px] text-center text-[18px] leading-[22px] ${DISPLAY} text-walnut [font-variant-numeric:tabular-nums]`}>{value}</span>
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

/** The offer as a personal agent receives it: plain fields, the way it gets matched and read out to a patient. */
function AgentListing({ offer }: { offer: Offer }) {
  const rows = [
    { label: "Offer", value: offer.kind === "addon" ? `${offer.value} with a visit` : offer.kind === "bundle" ? `${offer.value}, booked together` : offer.value },
    { label: "For", value: offer.services.join(" + ") || "Pick a service" },
    { label: "Who", value: offer.audience.join(", ") || "Anyone" },
    { label: "When", value: `${offer.starts} to ${offer.ends}` },
    { label: "Booking", value: offer.direct ? `Agents book directly, ${offer.perWeek} a week` : "Agents ask, front desk confirms" },
    { label: "From", value: "Northside Family Medicine, 0.8 mi" },
  ];
  return (
    <div className="flex flex-col gap-[12px] p-[18px] rounded-[24px] bg-[#FAF6EC]">
      <span className="flex items-center justify-between">
        <span className={`text-[11px] leading-[14px] ${SANS} font-[600] uppercase tracking-[0.06em] text-sub`}>What agents see</span>
        <span className={`text-[12px] leading-[16px] ${SANS} text-sub`}>Doe network listing</span>
      </span>
      <span className={`text-[20px] leading-[24px] tracking-[-0.01em] ${DISPLAY} text-walnut`}>{offer.title || "Untitled offer"}</span>
      <div className="flex flex-col rounded-[16px] bg-paper">
        {rows.map((r, i) => (
          <span key={r.label} className={`grid grid-cols-[72px_1fr] gap-[10px] px-[14px] py-[9px] ${i ? "border-t border-solid border-[#2819100F]" : ""}`}>
            <span className={`text-[13px] leading-[18px] ${SANS} text-sub`}>{r.label}</span>
            <span className={`text-[13px] leading-[18px] ${SANS} font-[500] text-walnut`}>{r.value}</span>
          </span>
        ))}
      </div>
      <span className={`px-[4px] text-[12px] leading-[17px] ${SANS} text-sub`}>
        Agents only show this to patients who match, and never share who saw it with the practice.
      </span>
    </div>
  );
}

/** How far the offer got: agents it matched, patients it was shown to, visits booked. */
function Results({ offer }: { offer: Offer }) {
  const steps = [
    { label: "Agents matched", value: offer.stats.matched, tone: "#EEE6D6" },
    { label: "Shown to patients", value: offer.stats.shown, tone: "#F8D9C6" },
    { label: "Visits booked", value: offer.stats.booked, tone: "#D6DEC6" },
  ];
  const top = Math.max(1, offer.stats.matched);
  return (
    <div className="flex flex-col gap-[14px] p-[18px] rounded-[24px] bg-[#FAF6EC]">
      <span className={`text-[11px] leading-[14px] ${SANS} font-[600] uppercase tracking-[0.06em] text-sub`}>How it’s doing</span>
      {offer.stats.matched === 0 ? (
        <span className={`text-[14px] leading-[20px] ${SANS} text-sub`}>
          {offer.status === "scheduled" ? `Goes out to agents on ${offer.starts}.` : "Publish it to start reaching agents."}
        </span>
      ) : (
        steps.map((s) => (
          <div key={s.label} className="flex flex-col gap-[6px]">
            <span className="flex items-baseline justify-between">
              <span className={`text-[13px] leading-[16px] ${SANS} font-[500] text-walnut`}>{s.label}</span>
              <span className={`text-[20px] leading-[24px] ${DISPLAY} text-walnut [font-variant-numeric:tabular-nums]`}>{n(s.value)}</span>
            </span>
            <span className="h-[10px] rounded-[99px] bg-[#2819100F] overflow-hidden">
              <span className="block h-full rounded-[99px]" style={{ width: `${Math.max(2, (s.value / top) * 100)}%`, backgroundColor: s.tone }} />
            </span>
          </div>
        ))
      )}
      {offer.stats.booked > 0 && (
        <span className={`text-[12px] leading-[16px] ${SANS} text-sub`}>
          {((offer.stats.booked / Math.max(1, offer.stats.shown)) * 100).toFixed(1)}% of patients who saw it booked.
        </span>
      )}
    </div>
  );
}

export function DoeHealthProductOffersPage() {
  const [offers, setOffers] = useState(START);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [selected, setSelected] = useState(START[0]!.id);

  const shown = offers.filter((o) => filter === "all" || o.status === filter);
  const offer = offers.find((o) => o.id === selected)!;
  const edit = (patch: Partial<Offer>) => setOffers((prev) => prev.map((o) => (o.id === selected ? { ...o, ...patch } : o)));
  const toggle = (list: string[], item: string) => (list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);

  const add = () => {
    const id = `offer-${offers.length + 1}`;
    setOffers((prev) => [
      {
        id,
        title: "",
        kind: "off",
        value: "$25 off",
        services: [],
        audience: [],
        starts: "Nov 1",
        ends: "Nov 30",
        perWeek: 10,
        direct: true,
        status: "draft",
        tone: "#F4EEDF",
        stats: { matched: 0, shown: 0, booked: 0 },
      },
      ...prev,
    ]);
    setFilter("all");
    setSelected(id);
  };

  const publish = () => edit({ status: offer.status === "live" ? "ended" : "live" });

  return (
    <div className="relative [font-synthesis:none] h-full w-full flex flex-col gap-[20px] pt-[36px] px-[40px] pb-[28px] rounded-[24px] overflow-clip bg-paper antialiased">
      <div className="relative flex items-end justify-between">
        <span className="flex items-baseline gap-[16px]">
          <span className={`text-[58px] leading-[62px] tracking-[-0.03em] ${DISPLAY} text-walnut`}>Offers</span>
          <span className={`text-[15px] leading-[20px] ${SANS} text-sub`}>Promotions sent to patients’ personal agents</span>
        </span>
        <button type="button" onClick={add} className={`flex items-center h-[40px] px-[18px] rounded-[999px] bg-ink hover:bg-[#2B1D12] transition-colors duration-150 text-[14px] leading-[18px] ${SANS} font-[500] [color:#FFFCF1]`}>
          New offer
        </button>
      </div>

      <div className="grid grid-cols-[400px_1fr_380px] gap-[16px] grow min-h-[0px]">
        <div className="flex flex-col min-h-[0px] gap-[12px]">
          <span className="flex self-start p-[3px] gap-[2px] rounded-[999px] bg-[#F4EEDF]">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`h-[32px] px-[14px] rounded-[999px] text-[13px] leading-[16px] ${SANS} font-[500] transition-colors duration-150 ${filter === f.id ? "bg-paper text-ink" : "text-sub hover:text-walnut"}`}
              >
                {f.label}
              </button>
            ))}
          </span>
          <div className="flex flex-col grow min-h-[0px] gap-[10px] pt-[10px] pb-[10px] overflow-y-auto overscroll-y-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {shown.map((o) => (
              <Ticket key={o.id} offer={o} on={o.id === selected} onPick={() => setSelected(o.id)} />
            ))}
            {shown.length === 0 && <span className={`px-[4px] py-[16px] text-[14px] leading-[18px] ${SANS} text-sub`}>No offers here yet.</span>}
          </div>
        </div>

        <div className="flex flex-col min-w-[0px] min-h-[0px] rounded-[28px] border-[1.5px] border-solid border-[#F4EEDF]">
          <div className="flex items-center justify-between gap-[12px] px-[24px] pt-[20px] pb-[16px]">
            <span className="flex items-center gap-[10px]">
              <span className={`text-[20px] leading-[24px] tracking-[-0.01em] ${DISPLAY} text-walnut`}>Build</span>
              <Pill status={offer.status} />
            </span>
            <span className="flex gap-[8px]">
              <button type="button" className={`h-[36px] px-[16px] rounded-[999px] bg-[#28191014] hover:bg-[#2819101F] transition-colors duration-150 text-[13px] leading-[16px] ${SANS} font-[500] text-walnut`}>
                Duplicate
              </button>
              <button
                type="button"
                onClick={publish}
                className={`h-[36px] px-[16px] rounded-[999px] transition-colors duration-150 text-[13px] leading-[16px] ${SANS} font-[500] ${offer.status === "live" ? "bg-[#28191014] hover:bg-[#2819101F] text-walnut" : "bg-ink hover:bg-[#2B1D12] [color:#FFFCF1]"}`}
              >
                {offer.status === "live" ? "End offer" : offer.status === "ended" ? "Run again" : "Publish to agents"}
              </button>
            </span>
          </div>

          <div className="flex flex-col grow min-h-[0px] gap-[24px] px-[24px] pb-[24px] overflow-y-auto overscroll-y-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="grid grid-cols-[1fr_180px] gap-[8px]">
              <TextField label="Name" value={offer.title} onChange={(v) => edit({ title: v })} big />
              <TextField label="Worth" value={offer.value} onChange={(v) => edit({ value: v })} big />
            </div>

            <Group label="Type of offer">
              <div className="grid grid-cols-4 gap-[8px]">
                {KINDS.map((k) => (
                  <button
                    key={k.id}
                    type="button"
                    onClick={() => edit({ kind: k.id })}
                    className={`flex flex-col gap-[2px] p-[12px] rounded-[16px] text-left border-[1.5px] border-solid transition-colors duration-150 ${offer.kind === k.id ? "bg-paper border-ink" : "bg-[#F4EEDF] border-transparent hover:bg-[#EEE6D6]"}`}
                  >
                    <span className={`whitespace-nowrap text-[13px] leading-[18px] ${SANS} font-[600] text-walnut`}>{k.label}</span>
                    <span className={`text-[12px] leading-[16px] ${SANS} text-sub`}>{k.hint}</span>
                  </button>
                ))}
              </div>
            </Group>

            <Group label="Services" hint="From your Services list">
              <div className="flex flex-wrap gap-[6px]">
                {SERVICES.map((s) => (
                  <Chip key={s} on={offer.services.includes(s)} onClick={() => edit({ services: toggle(offer.services, s) })}>
                    {s}
                  </Chip>
                ))}
              </div>
            </Group>

            <Group label="Who it reaches" hint={offer.audience.length ? `${offer.audience.length} rules, all must match` : "Every patient’s agent"}>
              <div className="flex flex-wrap gap-[6px]">
                {AUDIENCES.map((a) => (
                  <Chip key={a} on={offer.audience.includes(a)} onClick={() => edit({ audience: toggle(offer.audience, a) })}>
                    {a}
                  </Chip>
                ))}
              </div>
            </Group>

            <Group label="When and how many">
              <div className="grid grid-cols-[1fr_1fr_auto] items-end gap-[8px]">
                <TextField label="Starts" value={offer.starts} onChange={(v) => edit({ starts: v })} />
                <TextField label="Ends" value={offer.ends} onChange={(v) => edit({ ends: v })} />
                <span className="flex flex-col gap-[6px] pl-[8px]">
                  <span className={`text-[12px] leading-[16px] ${SANS} font-[500] text-sub`}>Visits a week</span>
                  <Stepper value={offer.perWeek} onChange={(v) => edit({ perWeek: v })} />
                </span>
              </div>
              <div className="flex items-center justify-between gap-[16px] px-[16px] py-[14px] rounded-[18px] bg-[#F4EEDF]">
                <span className="flex flex-col">
                  <span className={`text-[14px] leading-[18px] ${SANS} font-[500] text-walnut`}>Agents can book directly</span>
                  <span className={`text-[12px] leading-[16px] ${SANS} text-sub`}>Otherwise the front desk confirms each request</span>
                </span>
                <Toggle on={offer.direct} onChange={(v) => edit({ direct: v })} label="Agents can book directly" />
              </div>
            </Group>
          </div>
        </div>

        <div className="flex flex-col min-h-[0px] gap-[12px] overflow-y-auto overscroll-y-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <AgentListing offer={offer} />
          <Results offer={offer} />
        </div>
      </div>
    </div>
  );
}
