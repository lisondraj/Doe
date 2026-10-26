"use client";

/**
 * Locations tab — the group's sites and who works at each. The list on the left holds every location with its
 * providers underneath; the panel on the right edits the selected location (address, hours, status, which providers
 * work there on which days and how agents may book them, and the services offered there), the selected provider's
 * settings at that location, or, for the group, a who-works-where grid where a click adds or removes a provider and
 * the team settings the whole group shares.
 *
 * The locations live in a shared store, so the clinic switcher in the rail, Team and Agent Access all see the same
 * list, and can add a location from where they show one.
 */
import { createContext, type ReactNode, useContext, useState } from "react";

const DISPLAY = "font-['P22MackinacPro-Medium','P22_Mackinac_Pro',system-ui,sans-serif] font-[500]";
const SANS = "font-['DM_Sans',system-ui,sans-serif]";

export type AgentMode = "bookable" | "request" | "hidden";
type Status = "open" | "opening" | "paused";

export type LocationProvider = {
  id: string;
  days: string[];
  agents: AgentMode;
  /** Services this provider sees here; unset means every service the location offers. */
  services?: string[];
};

export type Location = {
  id: string;
  name: string;
  /** Used on chips elsewhere in the app, e.g. Team and Agent Access. */
  short: string;
  kind: "clinic" | "lab" | "virtual";
  address: string;
  city: string;
  phone: string;
  opens: string;
  closes: string;
  status: Status;
  note?: string;
  dot: string;
  tone: string;
  providers: LocationProvider[];
  services: string[];
  agents: boolean;
  stats: { today: number; next: string; rooms: number };
};

/** Everyone in the group who sees patients; each location picks from this list. */
export const GROUP_PROVIDERS = [
  { id: "brooks", name: "Dr. Sarah Brooks", role: "General neurology" },
  { id: "patel", name: "Dr. Raj Patel", role: "Epilepsy" },
  { id: "shah", name: "Dr. Anika Shah", role: "Movement disorders" },
  { id: "chen", name: "Dr. Lin Chen", role: "Headache medicine" },
  { id: "alvarez", name: "Dr. Elena Alvarez", role: "Sleep medicine" },
  { id: "lee", name: "Dr. Jun Lee", role: "Neuromuscular · EMG" },
  { id: "reyes", name: "Dr. Daniel Reyes", role: "Pediatric neurology" },
  { id: "singh", name: "Nora Singh, NP", role: "Nurse practitioner" },
  { id: "sato", name: "Hana Sato, NP", role: "Headache care" },
];

const SERVICES = [
  "New patient consult",
  "Migraine follow-up",
  "Seizure follow-up",
  "Routine EEG",
  "48-hour EEG",
  "EMG and nerve study",
  "Botox for chronic migraine",
  "Occipital nerve block",
  "MS infusion",
  "Sleep consult",
  "Memory screening",
  "Return-to-play note",
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAYS = DAYS.slice(0, 5);

const p = (id: string, days: string[], agents: AgentMode): LocationProvider => ({ id, days, agents });

export const LOCATIONS: Location[] = [
  {
    id: "brookline",
    name: "Brooks Neurology Brookline",
    short: "Brookline",
    kind: "clinic",
    address: "1180 Beacon St, Suite 4B",
    city: "Brookline, MA",
    phone: "(617) 555-0100",
    opens: "8:00 AM",
    closes: "5:30 PM",
    status: "open",
    dot: "#E8A585",
    tone: "#F8DCCB",
    providers: [p("brooks", WEEKDAYS, "bookable"), p("patel", ["Mon", "Tue", "Wed"], "request"), p("shah", ["Tue", "Thu", "Fri"], "bookable"), p("singh", ["Mon", "Wed", "Fri"], "bookable")],
    services: ["New patient consult", "Migraine follow-up", "Seizure follow-up", "Routine EEG", "EMG and nerve study", "Botox for chronic migraine", "Memory screening"],
    agents: true,
    stats: { today: 38, next: "Today, 3:30", rooms: 9 },
  },
  {
    id: "newton",
    name: "Newton Headache Center",
    short: "Newton",
    kind: "clinic",
    address: "2000 Washington St",
    city: "Newton, MA",
    phone: "(617) 555-0140",
    opens: "7:30 AM",
    closes: "6:00 PM",
    status: "open",
    dot: "#8DAA7C",
    tone: "#E3E9D9",
    providers: [p("chen", ["Mon", "Tue", "Wed", "Thu"], "bookable"), p("sato", ["Tue", "Wed", "Thu", "Fri"], "bookable"), p("brooks", ["Fri"], "request")],
    services: ["New patient consult", "Migraine follow-up", "Botox for chronic migraine", "Occipital nerve block", "MS infusion"],
    agents: true,
    stats: { today: 21, next: "Tomorrow, 9:15", rooms: 6 },
  },
  {
    id: "cambridge",
    name: "Cambridge EEG & Sleep Lab",
    short: "Cambridge",
    kind: "lab",
    address: "300 Mount Auburn St",
    city: "Cambridge, MA",
    phone: "(617) 555-0170",
    opens: "7:00 AM",
    closes: "9:00 PM",
    status: "open",
    dot: "#C2A987",
    tone: "#EEE6D6",
    providers: [p("alvarez", ["Mon", "Tue", "Wed", "Thu"], "bookable"), p("patel", ["Thu", "Fri"], "request")],
    services: ["Routine EEG", "48-hour EEG", "Sleep consult"],
    agents: true,
    stats: { today: 14, next: "Today, 4:00", rooms: 4 },
  },
  {
    id: "waltham",
    name: "Brooks Neurology Waltham",
    short: "Waltham",
    kind: "clinic",
    address: "1601 Trapelo Rd",
    city: "Waltham, MA",
    phone: "(781) 555-0190",
    opens: "8:00 AM",
    closes: "5:00 PM",
    status: "opening",
    note: "Opens Dec 1",
    dot: "#D9B860",
    tone: "#F3E7C9",
    providers: [p("lee", ["Mon", "Wed", "Fri"], "request"), p("reyes", ["Tue", "Thu"], "hidden")],
    services: ["New patient consult", "Seizure follow-up", "EMG and nerve study"],
    agents: false,
    stats: { today: 0, next: "Dec 1, 8:00", rooms: 5 },
  },
  {
    id: "telehealth",
    name: "Telehealth",
    short: "Telehealth",
    kind: "virtual",
    address: "Video visits",
    city: "Massachusetts",
    phone: "(617) 555-0100",
    opens: "7:00 AM",
    closes: "7:00 PM",
    status: "open",
    dot: "#A8A192",
    tone: "#ECE6DA",
    providers: [p("brooks", ["Mon", "Wed"], "bookable"), p("chen", ["Tue", "Thu"], "bookable"), p("singh", WEEKDAYS, "bookable")],
    services: ["Migraine follow-up", "Seizure follow-up", "Memory screening"],
    agents: true,
    stats: { today: 11, next: "Today, 2:45", rooms: 0 },
  },
];

type Store = {
  locations: Location[];
  /** A location id, or "group" for the overview. */
  selected: string;
  select: (id: string) => void;
  update: (id: string, patch: Partial<Location>) => void;
  /** Adds a draft location and selects it. */
  add: () => void;
  remove: (id: string) => void;
};

const STATIC: Store = { locations: LOCATIONS, selected: "group", select: () => {}, update: () => {}, add: () => {}, remove: () => {} };

const LocationsContext = createContext<Store | null>(null);

export function LocationsProvider({ children }: { children: ReactNode }) {
  const [locations, setLocations] = useState(LOCATIONS);
  const [selected, select] = useState("group");
  const [added, setAdded] = useState(0);

  const store: Store = {
    locations,
    selected,
    select,
    update: (id, patch) => setLocations((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l))),
    add: () => {
      const id = `new-${added + 1}`;
      setAdded((n) => n + 1);
      setLocations((prev) => [
        ...prev,
        {
          id,
          name: "New location",
          short: "New location",
          kind: "clinic",
          address: "",
          city: "",
          phone: "",
          opens: "8:00 AM",
          closes: "5:00 PM",
          status: "opening",
          note: "Draft",
          dot: "#C9BFAE",
          tone: "#F4EEDF",
          providers: [],
          services: [],
          agents: false,
          stats: { today: 0, next: "—", rooms: 0 },
        },
      ]);
      select(id);
    },
    remove: (id) => {
      setLocations((prev) => (prev.length > 1 ? prev.filter((l) => l.id !== id) : prev));
      select("group");
    },
  };

  return <LocationsContext.Provider value={store}>{children}</LocationsContext.Provider>;
}

/** The shared locations; outside a provider it falls back to the seed list, read-only. */
export function useLocations(): Store {
  return useContext(LocationsContext) ?? STATIC;
}

const STATUS: Record<Status, { label: string; background: string; color: string }> = {
  open: { label: "Open", background: "#D6DEC6", color: "#2F3B2A" },
  opening: { label: "Opening", background: "#F3E2B4", color: "#281910" },
  paused: { label: "Paused", background: "#28191014", color: "#281910" },
};

const MODES: { id: AgentMode; label: string }[] = [
  { id: "bookable", label: "Bookable" },
  { id: "request", label: "Request only" },
  { id: "hidden", label: "Hidden" },
];

const KIND_LABEL: Record<Location["kind"], string> = { clinic: "Clinic", lab: "Lab", virtual: "Virtual" };

const providerOf = (id: string) => GROUP_PROVIDERS.find((x) => x.id === id)!;
const initials = (name: string) =>
  name
    .replace("Dr. ", "")
    .replace(/,.*$/, "")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);
const toggle = (list: string[], item: string) => (list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);

function Pill({ status, note }: { status: Status; note?: string }) {
  const s = STATUS[status];
  return (
    <span className={`flex items-center h-[24px] px-[10px] rounded-[999px] text-[12px] leading-[16px] ${SANS} font-[500] whitespace-nowrap`} style={{ backgroundColor: s.background, color: s.color }}>
      {note ?? s.label}
    </span>
  );
}

function Row({ label, children, top = false }: { label: string; children: ReactNode; top?: boolean }) {
  return (
    <div className={`flex shrink-0 ${top ? "items-start" : "items-center"} gap-[20px] min-h-[64px] px-[20px] py-[14px] rounded-[18px] bg-paper`}>
      <span className={`w-[150px] shrink-0 text-[14px] leading-[20px] ${SANS} font-[500] text-sub ${top ? "pt-[7px]" : ""}`}>{label}</span>
      <div className="flex grow min-w-[0px] items-center">{children}</div>
    </div>
  );
}

function Chip({ on, onClick, children, small }: { on: boolean; onClick: () => void; children: ReactNode; small?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${small ? "h-[28px] px-[10px] text-[12px]" : "h-[34px] px-[14px] text-[13px]"} rounded-[999px] leading-[16px] ${SANS} font-[500] transition-colors duration-150 ${on ? "bg-ink [color:#FFFCF1]" : "bg-[#F4EEDF] text-walnut hover:bg-[#EEE6D6]"}`}
    >
      {children}
    </button>
  );
}

function Segmented<T extends string>({ value, options, onChange, small }: { value: T; options: readonly { id: T; label: string }[]; onChange: (v: T) => void; small?: boolean }) {
  return (
    <span className="flex p-[3px] gap-[2px] rounded-[999px] bg-[#F4EEDF]">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={`${small ? "h-[26px] px-[10px] text-[12px]" : "h-[32px] px-[14px] text-[13px]"} rounded-[999px] leading-[16px] ${SANS} font-[500] whitespace-nowrap transition-colors duration-150 ${value === o.id ? "bg-paper text-ink" : "text-sub hover:text-walnut"}`}
        >
          {o.label}
        </button>
      ))}
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

function Input({ value, onChange, width, placeholder }: { value: string; onChange: (v: string) => void; width?: number; placeholder?: string }) {
  return (
    <input
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      style={{ width }}
      className={`h-[38px] px-[14px] rounded-[12px] bg-[#F4EEDF] border-[1.5px] border-solid border-transparent focus:border-ink outline-none text-[14px] leading-[18px] ${SANS} font-[500] text-walnut placeholder:text-sub`}
    />
  );
}

function Tiles({ items }: { items: [string, string][] }) {
  return (
    <div className="grid grid-cols-3 gap-[8px] shrink-0">
      {items.map(([label, value]) => (
        <div key={label} className="flex flex-col gap-[4px] px-[18px] py-[14px] rounded-[18px] bg-[#F4EEDF]">
          <span className={`text-[13px] leading-[16px] ${SANS} font-[500] text-sub`}>{label}</span>
          <span className={`truncate text-[28px] leading-[32px] tracking-[-0.02em] ${DISPLAY} text-walnut [font-variant-numeric:tabular-nums]`}>{value}</span>
        </div>
      ))}
    </div>
  );
}

function Mark({ tone, size = 36, children }: { tone: string; size?: number; children?: ReactNode }) {
  return (
    <span className={`shrink-0 flex items-center justify-center rounded-[999px] text-[13px] leading-[16px] ${SANS} font-[600] text-walnut`} style={{ width: size, height: size, backgroundColor: tone }}>
      {children}
    </span>
  );
}

const btnGrey = `h-[38px] px-[16px] rounded-[999px] bg-[#28191014] hover:bg-[#2819101F] transition-colors duration-150 text-[14px] leading-[18px] ${SANS} font-[500] text-walnut`;

function LocationPanel({ l }: { l: Location }) {
  const { update, remove, locations } = useLocations();
  const edit = (patch: Partial<Location>) => update(l.id, patch);
  const editProvider = (id: string, patch: Partial<LocationProvider>) => edit({ providers: l.providers.map((x) => (x.id === id ? { ...x, ...patch } : x)) });
  const elsewhere = GROUP_PROVIDERS.filter((g) => !l.providers.some((x) => x.id === g.id));

  return (
    <>
      <div className="flex items-center justify-between gap-[16px]">
        <span className="flex items-center gap-[14px] grow min-w-[0px]">
          <Mark tone={l.tone} size={52}>
            <span className="w-[14px] h-[14px] rounded-[999px]" style={{ backgroundColor: l.dot }} />
          </Mark>
          <span className="flex flex-col grow min-w-[0px]">
            <input
              data-large-field
              value={l.name}
              placeholder="Location name"
              onChange={(e) => edit({ name: e.target.value })}
              className={`w-full min-w-[0px] bg-transparent outline-none text-[32px] leading-[38px] tracking-[-0.02em] ${DISPLAY} text-walnut placeholder:text-sub`}
            />
            <span className={`truncate text-[14px] leading-[18px] ${SANS} text-sub`}>
              {KIND_LABEL[l.kind]} · {[l.address, l.city].filter(Boolean).join(", ") || "No address yet"}
            </span>
          </span>
          <Pill status={l.status} note={l.note} />
        </span>
        <span className="flex items-center gap-[8px] shrink-0">
          <button type="button" className={btnGrey} onClick={() => edit({ status: l.status === "paused" ? "open" : "paused", note: undefined })}>
            {l.status === "paused" ? "Reopen" : "Pause"}
          </button>
          <button type="button" className={btnGrey} disabled={locations.length === 1} onClick={() => remove(l.id)}>
            Remove
          </button>
        </span>
      </div>

      <Tiles
        items={[
          ["Providers", String(l.providers.length)],
          ["Visits today", String(l.stats.today)],
          ["Next opening", l.stats.next],
        ]}
      />

      <div className="flex flex-col grow min-h-[0px] gap-[6px] overflow-y-auto overscroll-y-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Row label="Providers here" top>
          <div className="flex flex-col grow min-w-[0px] gap-[6px]">
            {l.providers.map((lp) => {
              const g = providerOf(lp.id);
              return (
                <div key={lp.id} className="flex items-center gap-[12px] p-[8px] pr-[10px] rounded-[16px] bg-[#FAF6EC]">
                  <Mark tone={l.tone}>{initials(g.name)}</Mark>
                  <span className="flex flex-col w-[150px] shrink-0 min-w-[0px]">
                    <span className={`truncate text-[14px] leading-[18px] ${SANS} font-[600] text-walnut`}>{g.name}</span>
                    <span className={`truncate text-[12px] leading-[16px] ${SANS} text-sub`}>{g.role}</span>
                  </span>
                  <span className="flex flex-wrap gap-[4px] grow min-w-[0px]">
                    {DAYS.map((d) => (
                      <Chip key={d} small on={lp.days.includes(d)} onClick={() => editProvider(lp.id, { days: toggle(lp.days, d) })}>
                        {d}
                      </Chip>
                    ))}
                  </span>
                  <Segmented small value={lp.agents} options={MODES} onChange={(v) => editProvider(lp.id, { agents: v })} />
                  <button
                    type="button"
                    aria-label={`Remove ${g.name} from ${l.short}`}
                    onClick={() => edit({ providers: l.providers.filter((x) => x.id !== lp.id) })}
                    className="w-[28px] h-[28px] shrink-0 flex items-center justify-center rounded-[999px] hover:bg-[#28191014] transition-colors duration-150 text-sub"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
                      <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              );
            })}
            {l.providers.length === 0 && <span className={`py-[7px] text-[14px] leading-[20px] ${SANS} text-sub`}>No one works here yet.</span>}
            {elsewhere.length > 0 && (
              <span className="flex flex-wrap gap-[6px] pt-[4px]">
                {elsewhere.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => edit({ providers: [...l.providers, p(g.id, ["Mon"], "request")] })}
                    className={`flex items-center gap-[6px] h-[30px] px-[12px] rounded-[999px] border-[1.5px] border-dashed border-[#28191033] hover:bg-[#F4EEDF] transition-colors duration-150 text-[13px] leading-[16px] ${SANS} font-[500] text-walnut`}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
                      <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                    </svg>
                    {g.name}
                  </button>
                ))}
              </span>
            )}
          </div>
        </Row>
        <Row label="Short name">
          <Input value={l.short} onChange={(v) => edit({ short: v })} width={220} placeholder="Shown on chips" />
        </Row>
        <Row label="Address">
          <span className="flex items-center gap-[8px] grow">
            <Input value={l.address} onChange={(v) => edit({ address: v })} width={260} placeholder="Street" />
            <Input value={l.city} onChange={(v) => edit({ city: v })} width={180} placeholder="City, state" />
          </span>
        </Row>
        <Row label="Phone">
          <Input value={l.phone} onChange={(v) => edit({ phone: v })} width={180} />
        </Row>
        <Row label="Hours">
          <span className="flex items-center gap-[8px]">
            <Input value={l.opens} onChange={(v) => edit({ opens: v })} width={110} />
            <span className={`text-[14px] ${SANS} text-sub`}>to</span>
            <Input value={l.closes} onChange={(v) => edit({ closes: v })} width={110} />
          </span>
        </Row>
        <Row label="Kind">
          <Segmented
            value={l.kind}
            onChange={(v) => edit({ kind: v })}
            options={[
              { id: "clinic", label: "Clinic" },
              { id: "lab", label: "Lab" },
              { id: "virtual", label: "Virtual" },
            ]}
          />
        </Row>
        <Row label="Status">
          <Segmented
            value={l.status}
            onChange={(v) => edit({ status: v, note: undefined })}
            options={[
              { id: "open", label: "Open" },
              { id: "opening", label: "Opening soon" },
              { id: "paused", label: "Paused" },
            ]}
          />
        </Row>
        <Row label="Agents book here">
          <Toggle on={l.agents} onChange={(v) => edit({ agents: v })} label="Agents book here" />
        </Row>
        <Row label="Services offered" top>
          <span className="flex flex-wrap gap-[6px]">
            {SERVICES.map((s) => (
              <Chip key={s} on={l.services.includes(s)} onClick={() => edit({ services: toggle(l.services, s) })}>
                {s}
              </Chip>
            ))}
          </span>
        </Row>
      </div>
    </>
  );
}

/** One provider's settings at one location: days, how agents book them, what they see here, and where else they work. */
function ProviderPanel({ l, lp, onBack }: { l: Location; lp: LocationProvider; onBack: () => void }) {
  const { update, locations } = useLocations();
  const g = providerOf(lp.id);
  const services = lp.services ?? l.services;
  const editHere = (patch: Partial<LocationProvider>) => update(l.id, { providers: l.providers.map((x) => (x.id === lp.id ? { ...x, ...patch } : x)) });
  const sites = locations.filter((x) => x.providers.some((y) => y.id === lp.id));
  const flip = (x: Location) =>
    update(x.id, { providers: x.providers.some((y) => y.id === lp.id) ? x.providers.filter((y) => y.id !== lp.id) : [...x.providers, p(lp.id, ["Mon"], "request")] });

  return (
    <>
      <div className="flex items-center justify-between gap-[16px]">
        <span className="flex items-center gap-[14px] grow min-w-[0px]">
          <Mark tone={l.tone} size={52}>
            {initials(g.name)}
          </Mark>
          <span className="flex flex-col grow min-w-[0px]">
            <span className={`truncate text-[32px] leading-[38px] tracking-[-0.02em] ${DISPLAY} text-walnut`}>{g.name}</span>
            <span className={`truncate text-[14px] leading-[18px] ${SANS} text-sub`}>
              {g.role} · at {l.short || l.name}
            </span>
          </span>
        </span>
        <span className="flex items-center gap-[8px] shrink-0">
          <button type="button" className={btnGrey} onClick={onBack}>
            Back to {l.short || "location"}
          </button>
          <button
            type="button"
            className={btnGrey}
            onClick={() => {
              update(l.id, { providers: l.providers.filter((x) => x.id !== lp.id) });
              onBack();
            }}
          >
            Remove here
          </button>
        </span>
      </div>

      <Tiles
        items={[
          ["Days here", String(lp.days.length)],
          ["Locations", String(sites.length)],
          ["Agents", MODES.find((m) => m.id === lp.agents)!.label],
        ]}
      />

      <div className="flex flex-col grow min-h-[0px] gap-[6px] overflow-y-auto overscroll-y-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Row label="Days here">
          <span className="flex flex-wrap gap-[6px]">
            {DAYS.map((d) => (
              <Chip key={d} on={lp.days.includes(d)} onClick={() => editHere({ days: toggle(lp.days, d) })}>
                {d}
              </Chip>
            ))}
          </span>
        </Row>
        <Row label="Agents can">
          <Segmented value={lp.agents} options={MODES} onChange={(v) => editHere({ agents: v })} />
        </Row>
        <Row label="Sees here" top>
          <span className="flex flex-wrap gap-[6px]">
            {l.services.map((sv) => (
              <Chip key={sv} on={services.includes(sv)} onClick={() => editHere({ services: toggle(services, sv) })}>
                {sv}
              </Chip>
            ))}
            {l.services.length === 0 && <span className={`py-[7px] text-[14px] leading-[20px] ${SANS} text-sub`}>This location offers no services yet.</span>}
          </span>
        </Row>
        <Row label="Works at" top>
          <span className="flex flex-wrap gap-[6px]">
            {locations.map((x) => (
              <Chip key={x.id} on={x.providers.some((y) => y.id === lp.id)} onClick={() => x.id !== l.id && flip(x)}>
                {x.short || x.name}
              </Chip>
            ))}
          </span>
        </Row>
      </div>
    </>
  );
}

type TeamRole = "clinician" | "clinical" | "desk" | "billing" | "admin";

const TEAM_ROLES: { id: TeamRole; label: string }[] = [
  { id: "clinician", label: "Clinician" },
  { id: "clinical", label: "Clinical staff" },
  { id: "desk", label: "Front desk" },
  { id: "billing", label: "Billing" },
  { id: "admin", label: "Admin" },
];

/** Rules the whole team shares: who works the Needs you queue, approvals, coverage, office hours and sign-in. */
type TeamSettings = {
  queue: "everyone" | "role" | "assigned";
  approvers: TeamRole[];
  coverage: boolean;
  twoSign: boolean;
  handoff: boolean;
  opens: string;
  closes: string;
  defaultRole: TeamRole;
  signIn: "google" | "microsoft" | "email";
  twoFactor: boolean;
};

const TEAM_SETTINGS: TeamSettings = {
  queue: "role",
  approvers: ["desk", "admin"],
  coverage: true,
  twoSign: false,
  handoff: true,
  opens: "8:00 AM",
  closes: "5:30 PM",
  defaultRole: "desk",
  signIn: "google",
  twoFactor: true,
};

function TeamSettingsRows({ settings, onChange }: { settings: TeamSettings; onChange: (patch: Partial<TeamSettings>) => void }) {
  return (
    <>
      <Row label="Needs you queue">
        <Segmented
          value={settings.queue}
          onChange={(v) => onChange({ queue: v })}
          options={[
            { id: "everyone", label: "Shared by everyone" },
            { id: "role", label: "Split by role" },
            { id: "assigned", label: "Assigned only" },
          ]}
        />
      </Row>
      <Row label="Approves new patients" top>
        <span className="flex flex-wrap gap-[6px]">
          {TEAM_ROLES.map((r) => (
            <Chip key={r.id} on={settings.approvers.includes(r.id)} onClick={() => onChange({ approvers: toggle(settings.approvers, r.id) as TeamRole[] })}>
              {r.label}
            </Chip>
          ))}
        </span>
      </Row>
      <Row label="Coverage when away">
        <Toggle on={settings.coverage} onChange={(v) => onChange({ coverage: v })} label="Route work to coverage when away" />
      </Row>
      <Row label="Hand off at close">
        <Toggle on={settings.handoff} onChange={(v) => onChange({ handoff: v })} label="Hand off unfinished tasks at close" />
      </Row>
      <Row label="Two sign-offs on payer letters">
        <Toggle on={settings.twoSign} onChange={(v) => onChange({ twoSign: v })} label="Two sign-offs on payer letters" />
      </Row>
      <Row label="Office hours">
        <span className="flex items-center gap-[8px]">
          <Input value={settings.opens} onChange={(v) => onChange({ opens: v })} width={110} />
          <span className={`text-[14px] ${SANS} text-sub`}>to</span>
          <Input value={settings.closes} onChange={(v) => onChange({ closes: v })} width={110} />
        </span>
      </Row>
      <Row label="New invites start as">
        <Segmented value={settings.defaultRole} options={TEAM_ROLES} onChange={(v) => onChange({ defaultRole: v })} />
      </Row>
      <Row label="Sign in with">
        <Segmented
          value={settings.signIn}
          onChange={(v) => onChange({ signIn: v })}
          options={[
            { id: "google", label: "Google" },
            { id: "microsoft", label: "Microsoft" },
            { id: "email", label: "Email link" },
          ]}
        />
      </Row>
      <Row label="Require two-factor">
        <Toggle on={settings.twoFactor} onChange={(v) => onChange({ twoFactor: v })} label="Require two-factor" />
      </Row>
    </>
  );
}

const GROUP_VIEWS = [
  { id: "where", label: "Who works where" },
  { id: "team", label: "Team settings" },
] as const;

/** The group: who works where (providers down the side, locations across, days per week in each cell), or team settings. */
function GroupPanel({ settings, onSettings }: { settings: TeamSettings; onSettings: (patch: Partial<TeamSettings>) => void }) {
  const { locations, update, select } = useLocations();
  const [view, setView] = useState<(typeof GROUP_VIEWS)[number]["id"]>("where");
  const staffed = new Set(locations.flatMap((l) => l.providers.map((x) => x.id)));
  const cols = `200px repeat(${locations.length}, minmax(0, 1fr))`;

  const flip = (l: Location, id: string) =>
    update(l.id, { providers: l.providers.some((x) => x.id === id) ? l.providers.filter((x) => x.id !== id) : [...l.providers, p(id, ["Mon"], "request")] });

  return (
    <>
      <div className="flex items-center justify-between gap-[16px]">
        <span className="flex flex-col">
          <span className={`text-[32px] leading-[38px] tracking-[-0.02em] ${DISPLAY} text-walnut`}>Brooks Neurology Group</span>
          <span className={`text-[14px] leading-[18px] ${SANS} text-sub`}>
            {view === "where" ? "Who works where. Click a cell to add or remove a provider at a location." : "Rules the whole team shares, at every location."}
          </span>
        </span>
        <Segmented value={view} options={GROUP_VIEWS} onChange={setView} />
      </div>

      <Tiles
        items={[
          ["Locations", String(locations.length)],
          ["Providers", String(staffed.size)],
          ["Visits today", String(locations.reduce((n, l) => n + l.stats.today, 0))],
        ]}
      />

      {view === "team" ? (
        <div className="flex flex-col grow min-h-[0px] gap-[6px] overflow-y-auto overscroll-y-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <TeamSettingsRows settings={settings} onChange={onSettings} />
        </div>
      ) : (
      <div className="flex flex-col grow min-h-[0px] gap-[4px] p-[8px] rounded-[18px] bg-paper overflow-y-auto overscroll-y-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="grid items-end gap-[6px] shrink-0 px-[8px] pb-[6px]" style={{ gridTemplateColumns: cols }}>
          <span className={`text-[13px] leading-[18px] ${SANS} text-sub`}>Provider</span>
          {locations.map((l) => (
            <button key={l.id} type="button" onClick={() => select(l.id)} className="flex items-center gap-[6px] min-w-[0px] text-left group">
              <span className="w-[8px] h-[8px] shrink-0 rounded-[999px]" style={{ backgroundColor: l.dot }} />
              <span className={`truncate text-[13px] leading-[18px] ${SANS} font-[600] text-walnut group-hover:underline`}>{l.short || l.name}</span>
            </button>
          ))}
        </div>
        {GROUP_PROVIDERS.map((g) => (
          <div key={g.id} className="grid items-center gap-[6px] shrink-0 h-[52px] px-[8px] rounded-[14px] hover:bg-[#FAF6EC] transition-colors duration-150" style={{ gridTemplateColumns: cols }}>
            <span className="flex flex-col min-w-[0px]">
              <span className={`truncate text-[14px] leading-[18px] ${SANS} font-[600] text-walnut`}>{g.name}</span>
              <span className={`truncate text-[12px] leading-[16px] ${SANS} text-sub`}>{g.role}</span>
            </span>
            {locations.map((l) => {
              const here = l.providers.find((x) => x.id === g.id);
              return (
                <button
                  key={l.id}
                  type="button"
                  aria-label={`${g.name} at ${l.short}`}
                  aria-pressed={!!here}
                  onClick={() => flip(l, g.id)}
                  className={`h-[36px] flex items-center justify-center rounded-[12px] text-[12px] leading-[16px] ${SANS} font-[500] transition-colors duration-150 ${here ? "text-walnut" : "text-[#28191040] border-[1.5px] border-dashed border-[#2819101F] hover:border-[#28191040]"}`}
                  style={here ? { backgroundColor: l.tone } : undefined}
                >
                  {here ? `${here.days.length} ${here.days.length === 1 ? "day" : "days"}` : "+"}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      )}
    </>
  );
}

const VIEW_OPTIONS = [
  { id: "group", label: "Group" },
  { id: "sites", label: "Locations" },
] as const;

export function DoeHealthProductLocationsPage() {
  const { locations, selected, select, add } = useLocations();
  const [providerId, setProviderId] = useState<string | null>(null);
  const [teamSettings, setTeamSettings] = useState(TEAM_SETTINGS);
  const current = locations.find((l) => l.id === selected);
  const currentProvider = current?.providers.find((x) => x.id === providerId);
  const open = (id: string, provider: string | null = null) => {
    select(id);
    setProviderId(provider);
  };
  const addLocation = () => {
    add();
    setProviderId(null);
  };

  return (
    <div className="relative [font-synthesis:none] h-full w-full flex flex-col gap-[20px] pt-[36px] px-[40px] pb-[28px] rounded-[24px] overflow-clip bg-paper antialiased">
      <div className="relative flex items-end justify-between">
        <span className={`text-[58px] leading-[62px] tracking-[-0.03em] ${DISPLAY} text-walnut`}>Locations</span>
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
          <button type="button" onClick={addLocation} className={`flex items-center gap-[6px] h-[40px] pr-[18px] pl-[14px] rounded-[999px] bg-ink hover:bg-[#2B1D12] transition-colors duration-150 text-[14px] leading-[18px] ${SANS} font-[500] [color:#FFFCF1]`}>
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" style={{ display: "block" }}>
              <path d="M7 2.5v9M2.5 7h9" fill="none" stroke="#FFFCF1" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            Add Location
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-[20px] grow min-h-[0px]">
        <div className="w-[360px] shrink-0 [&>span]:w-full [&_button]:grow">
          <Segmented
            value={selected === "group" ? "group" : "sites"}
            options={VIEW_OPTIONS}
            onChange={(v) => {
              if (v === "group") open("group");
              else if (selected === "group") open(locations[0]?.id ?? "group");
            }}
          />
        </div>

        <div className="grid grid-cols-[360px_1fr] gap-[16px] grow min-h-[0px]">
          <div className="flex flex-col min-h-[0px] gap-[4px] p-[8px] rounded-[18px] bg-[#F4EEDF] overflow-y-auto overscroll-y-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {locations.map((l) => {
              const on = selected === l.id && !currentProvider;
              return (
                <div key={l.id} className={`flex flex-col shrink-0 p-[6px] rounded-[14px] bg-paper ${l.status === "paused" ? "opacity-70" : ""}`}>
                  <div className={`flex items-center gap-[10px] pr-[6px] rounded-[10px] outline outline-[1.5px] -outline-offset-[1.5px] transition-[outline-color] duration-150 ${on ? "outline-ink" : "outline-transparent hover:outline-[#28191026]"}`}>
                    <button type="button" onClick={() => open(l.id)} className="flex items-center gap-[12px] grow min-w-[0px] p-[6px] text-left">
                      <Mark tone={l.tone} size={36} />
                      <span className="flex flex-col grow min-w-[0px]">
                        <span className={`truncate text-[15px] leading-[20px] ${SANS} font-[600] text-ink`}>{l.name || "Untitled location"}</span>
                        <span className={`truncate text-[12px] leading-[16px] ${SANS} text-sub`}>{l.city || "No address yet"}</span>
                      </span>
                    </button>
                    {l.status !== "open" && <Pill status={l.status} note={l.note} />}
                    <button
                      type="button"
                      aria-label={`Edit ${l.name || "location"}`}
                      onClick={() => open(l.id)}
                      className="w-[30px] h-[30px] shrink-0 flex items-center justify-center rounded-[999px] hover:bg-[#28191014] transition-colors duration-150"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
                        <path d="M4 20h4L19 9l-4-4L4 16v4z" fill="none" stroke="#281910" strokeWidth="2" strokeLinejoin="round" />
                        <path d="M13.5 6.5l4 4" fill="none" stroke="#281910" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                  {l.providers.length > 0 && (
                    <div className="flex flex-col gap-[2px] mt-[4px] ml-[24px] pl-[10px] border-l-[1.5px] border-solid border-[#2819101A]">
                      {l.providers.map((lp) => {
                        const g = providerOf(lp.id);
                        const picked = selected === l.id && providerId === lp.id;
                        return (
                          <button
                            key={lp.id}
                            type="button"
                            onClick={() => open(l.id, lp.id)}
                            className={`flex items-center gap-[10px] h-[40px] shrink-0 px-[8px] rounded-[10px] text-left transition-colors duration-150 ${picked ? "bg-[#F4EEDF]" : "hover:bg-[#FAF6EC]"}`}
                          >
                            <span className={`w-[26px] h-[26px] shrink-0 flex items-center justify-center rounded-[999px] text-[10px] leading-[10px] ${SANS} font-[700] text-walnut`} style={{ backgroundColor: l.tone }}>
                              {initials(g.name)}
                            </span>
                            <span className={`truncate grow min-w-[0px] text-[13px] leading-[18px] ${SANS} font-[500] text-walnut`}>{g.name}</span>
                            <span className={`shrink-0 text-[12px] leading-[16px] ${SANS} text-sub`}>
                              {lp.days.length} {lp.days.length === 1 ? "day" : "days"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
            <button
              type="button"
              onClick={addLocation}
              className={`flex items-center justify-center gap-[8px] h-[56px] shrink-0 rounded-[14px] border-[1.5px] border-dashed border-[#28191033] hover:bg-[#EEE6D6] transition-colors duration-150 text-[14px] leading-[18px] ${SANS} font-[500] text-walnut`}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
                <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
              Add location
            </button>
          </div>

          <div className="flex flex-col min-w-[0px] min-h-[0px] gap-[16px] p-[24px] rounded-[28px] bg-[#FAF6EC]">
            {current && currentProvider ? (
              <ProviderPanel key={`${current.id}-${currentProvider.id}`} l={current} lp={currentProvider} onBack={() => setProviderId(null)} />
            ) : current ? (
              <LocationPanel key={current.id} l={current} />
            ) : (
              <GroupPanel settings={teamSettings} onSettings={(patch) => setTeamSettings((s) => ({ ...s, ...patch }))} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
