"use client";

/**
 * Offers tab — promotions the practice publishes to patients' personal agents. Offers sit in a list of tickets on
 * the left (the stub shows what each is worth). The panel on the right edits the selected one, shows how it's doing,
 * and previews the listing as agents receive it. Edits update the ticket as you type.
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

const KINDS: { id: Kind; label: string }[] = [
  { id: "off", label: "Money off" },
  { id: "price", label: "Set price" },
  { id: "addon", label: "Free add-on" },
  { id: "bundle", label: "Bundle" },
];

const SERVICES = ["New patient consult", "Migraine follow-up", "Routine EEG", "EMG and nerve study", "Memory screening", "Return-to-play note", "Occipital nerve block", "Sleep consult"];
const AUDIENCES = ["New patients", "Existing patients", "Not seen in 12+ months", "Migraine patients", "Within 5 miles", "Kids under 18", "Aetna members", "Blue Cross members"];

const START: Offer[] = [
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
    status: "live",
    tone: "#E3E9D9",
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
    status: "live",
    tone: "#F8DCCB",
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
    status: "scheduled",
    tone: "#F3E7C9",
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
    status: "draft",
    tone: "#EEE6D6",
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

/** A ticket: the stub holds what the offer is worth, a dashed tear line separates it from the details. */
function Ticket({ offer, on, onPick }: { offer: Offer; on: boolean; onPick: () => void }) {
  return (
    <button
      type="button"
      onClick={onPick}
      className={`flex shrink-0 h-[88px] rounded-[18px] text-left outline outline-[1.5px] -outline-offset-[1.5px] transition-[outline-color] duration-150 ${on ? "outline-ink" : "outline-transparent hover:outline-[#28191026]"} ${offer.status === "ended" ? "opacity-60" : ""}`}
      style={{ backgroundColor: offer.tone }}
    >
      <span className="flex items-center w-[136px] shrink-0 px-[18px]">
        <span className={`whitespace-nowrap text-[22px] leading-[28px] tracking-[-0.02em] ${DISPLAY} text-ink`}>{offer.value || "—"}</span>
      </span>
      <span className="w-[0px] shrink-0 border-l-[1.5px] border-dashed border-[#2819102E] my-[16px]" />
      <span className="flex flex-col justify-center gap-[6px] grow min-w-[0px] px-[18px]">
        <span className="flex items-center justify-between gap-[10px]">
          <span className={`truncate text-[15px] leading-[20px] ${SANS} font-[600] text-walnut`}>{offer.title || "Untitled offer"}</span>
          <Pill status={offer.status} />
        </span>
        <span className={`flex items-center justify-between gap-[10px] text-[13px] leading-[16px] ${SANS} text-sub`}>
          <span className="truncate">
            {offer.starts} – {offer.ends}
          </span>
          {offer.stats.booked > 0 && <span className="shrink-0 font-[500] text-walnut">{offer.stats.booked} booked</span>}
        </span>
      </span>
    </button>
  );
}

/** One setting: its name on the left, the control on the right, in a paper row. */
function Row({ label, children, top = false }: { label: string; children: ReactNode; top?: boolean }) {
  return (
    <div className={`flex shrink-0 ${top ? "items-start" : "items-center"} gap-[20px] min-h-[64px] px-[20px] py-[14px] rounded-[18px] bg-paper`}>
      <span className={`w-[150px] shrink-0 text-[14px] leading-[20px] ${SANS} font-[500] text-sub ${top ? "pt-[7px]" : ""}`}>{label}</span>
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

function Segmented<T extends string>({ value, options, onChange }: { value: T; options: { id: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <span className="flex p-[3px] gap-[2px] rounded-[999px] bg-[#F4EEDF]">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={`h-[32px] px-[14px] rounded-[999px] text-[13px] leading-[16px] ${SANS} font-[500] transition-colors duration-150 ${value === o.id ? "bg-paper text-ink" : "text-sub hover:text-walnut"}`}
        >
          {o.label}
        </button>
      ))}
    </span>
  );
}

function Input({ value, onChange, width }: { value: string; onChange: (v: string) => void; width?: number }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ width }}
      className={`h-[38px] px-[14px] rounded-[12px] bg-[#F4EEDF] border-[1.5px] border-solid border-transparent focus:border-ink outline-none text-[14px] leading-[18px] ${SANS} font-[500] text-walnut`}
    />
  );
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

/** The offer as a personal agent receives it. */
function Listing({ offer }: { offer: Offer }) {
  const rows = [
    { label: "Offer", value: offer.kind === "addon" ? `${offer.value} with a visit` : offer.kind === "bundle" ? `${offer.value}, booked together` : offer.value },
    { label: "For", value: offer.services.join(" + ") || "No service yet" },
    { label: "Who", value: offer.audience.join(", ") || "Anyone" },
    { label: "When", value: `${offer.starts} to ${offer.ends}` },
    { label: "Booking", value: offer.direct ? `Direct, ${offer.perWeek} a week` : "Front desk confirms" },
    { label: "From", value: "Brooks Neurology, 0.8 mi" },
  ];
  return (
    <div className="flex flex-col gap-[6px]">
      {rows.map((r) => (
        <Row key={r.label} label={r.label}>
          <span className={`text-[14px] leading-[20px] ${SANS} font-[500] text-walnut`}>{r.value}</span>
        </Row>
      ))}
    </div>
  );
}

export function DoeHealthProductOffersPage() {
  const [offers, setOffers] = useState(START);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [selected, setSelected] = useState(START[0]!.id);
  const [mode, setMode] = useState<"edit" | "preview">("edit");

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
    setMode("edit");
  };

  const stats = [
    { label: "Agents matched", value: offer.stats.matched },
    { label: "Shown to patients", value: offer.stats.shown },
    { label: "Visits booked", value: offer.stats.booked },
  ];

  return (
    <div className="relative [font-synthesis:none] h-full w-full flex flex-col gap-[20px] pt-[36px] px-[40px] pb-[28px] rounded-[24px] overflow-clip bg-paper antialiased">
      <div className="relative flex items-end justify-between">
        <span className={`text-[58px] leading-[62px] tracking-[-0.03em] ${DISPLAY} text-walnut`}>Offers</span>
        <button type="button" onClick={add} className={`flex items-center h-[40px] px-[18px] rounded-[999px] bg-ink hover:bg-[#2B1D12] transition-colors duration-150 text-[14px] leading-[18px] ${SANS} font-[500] [color:#FFFCF1]`}>
          New offer
        </button>
      </div>

      <div className="grid grid-cols-[420px_1fr] gap-[16px] grow min-h-[0px]">
        <div className="flex flex-col min-h-[0px] gap-[12px]">
          <span className="flex self-start">
            <Segmented value={filter} onChange={setFilter} options={FILTERS} />
          </span>
          <div className="flex flex-col grow min-h-[0px] gap-[8px] overflow-y-auto overscroll-y-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {shown.map((o) => (
              <Ticket key={o.id} offer={o} on={o.id === selected} onPick={() => setSelected(o.id)} />
            ))}
            {shown.length === 0 && <span className={`px-[4px] py-[16px] text-[14px] leading-[18px] ${SANS} text-sub`}>No offers here yet.</span>}
          </div>
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
              <Pill status={offer.status} />
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
              <button type="button" className={`h-[38px] px-[16px] rounded-[999px] bg-[#28191014] hover:bg-[#2819101F] transition-colors duration-150 text-[14px] leading-[18px] ${SANS} font-[500] text-walnut`}>
                Duplicate
              </button>
              <button
                type="button"
                onClick={() => edit({ status: offer.status === "live" ? "ended" : "live" })}
                className={`h-[38px] px-[16px] rounded-[999px] transition-colors duration-150 text-[14px] leading-[18px] ${SANS} font-[500] ${offer.status === "live" ? "bg-[#28191014] hover:bg-[#2819101F] text-walnut" : "bg-ink hover:bg-[#2B1D12] [color:#FFFCF1]"}`}
              >
                {offer.status === "live" ? "End" : offer.status === "ended" ? "Run again" : "Publish"}
              </button>
            </span>
          </div>

          <div className="grid grid-cols-3 gap-[8px] shrink-0">
            {stats.map((t) => (
              <div key={t.label} className="flex flex-col gap-[4px] px-[18px] py-[14px] rounded-[18px] bg-[#F4EEDF]">
                <span className={`text-[13px] leading-[16px] ${SANS} font-[500] text-sub`}>{t.label}</span>
                <span className={`text-[28px] leading-[32px] tracking-[-0.02em] ${DISPLAY} text-walnut [font-variant-numeric:tabular-nums]`}>{t.value ? n(t.value) : "—"}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col grow min-h-[0px] gap-[6px] overflow-y-auto overscroll-y-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {mode === "preview" ? (
              <Listing offer={offer} />
            ) : (
              <>
                <Row label="Type">
                  <Segmented value={offer.kind} onChange={(k) => edit({ kind: k })} options={KINDS} />
                </Row>
                <Row label="Worth">
                  <Input value={offer.value} onChange={(v) => edit({ value: v })} width={160} />
                </Row>
                <Row label="Services" top>
                  <span className="flex flex-wrap gap-[6px]">
                    {SERVICES.map((s) => (
                      <Chip key={s} on={offer.services.includes(s)} onClick={() => edit({ services: toggle(offer.services, s) })}>
                        {s}
                      </Chip>
                    ))}
                  </span>
                </Row>
                <Row label="Who it reaches" top>
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
                <Row label="Visits a week">
                  <Stepper value={offer.perWeek} onChange={(v) => edit({ perWeek: v })} />
                </Row>
                <Row label="Agents book directly">
                  <Toggle on={offer.direct} onChange={(v) => edit({ direct: v })} label="Agents book directly" />
                </Row>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
