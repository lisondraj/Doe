"use client";

/**
 * /pricing builder — the practice and plan, one question at a time. Each question sits in a soft card; answers
 * collect above it as pills you can tap to go back, and a price pinned to the bottom of the screen builds as you
 * answer. Single-choice questions move on as soon as you pick; the rest wait for Continue. The questions follow
 * the practice: a solo provider skips the counts, a multi-clinic group names each location and its providers.
 */
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";

import {
  ANNUAL_FACTOR,
  APPOINTMENT_TYPES,
  AVAILABILITY_SOURCES,
  type Location,
  PAYMENT_OPTIONS,
  type PlanId,
  PLANS,
  PRACTICE_SHAPES,
  type PracticeShape,
  REFERRAL_OPTIONS,
  SPECIALTIES,
  type SpecialtyId,
  monthlyPrice,
} from "@/lib/doehealthdesk2/doehealthdesk2-pricing";
import { p22Mackinac } from "@/lib/home/fonts";

const DISPLAY = p22Mackinac.className;
const SUB = "text-[rgba(20,12,4,0.58)]";

const money = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
const toggleIn = (list: string[], item: string) => (list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);
const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

type ProviderEdit = { name: string; specialty: SpecialtyId; accepting: boolean };

type Answers = {
  shape: PracticeShape | null;
  clinicProviders: number;
  locations: Location[];
  specialty: SpecialtyId | null;
  services: string[];
  appointments: string[];
  payments: string[];
  accepting: boolean | null;
  referral: (typeof REFERRAL_OPTIONS)[number]["id"] | null;
  availability: (typeof AVAILABILITY_SOURCES)[number]["id"] | null;
  people: Record<string, ProviderEdit>;
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
  services: [],
  appointments: ["In person"],
  payments: [],
  accepting: null,
  referral: null,
  availability: null,
  people: {},
  plan: null,
  annual: true,
  contact: { name: "", email: "", practice: "" },
};

/** A large, soft choice: a whole row you tap. */
function Choice({ on, onClick, title, note }: { on: boolean; onClick: () => void; title: string; note?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`flex items-center gap-[16px] w-full p-[18px] rounded-[22px] text-left transition-colors duration-200 ${on ? "bg-[#281910] text-[#FFFCF1]" : "bg-[#FFFCF1] text-[#281910] hover:bg-white"}`}
    >
      <span className={`w-[24px] h-[24px] shrink-0 flex items-center justify-center rounded-[999px] border-[1.5px] border-solid transition-colors duration-200 ${on ? "border-[#FCCFB8]" : "border-[rgba(20,12,4,0.22)]"}`}>
        {on && <span className="w-[10px] h-[10px] rounded-[999px] bg-[#FCCFB8]" />}
      </span>
      <span className="flex flex-col grow min-w-[0px] gap-[2px]">
        <span className="text-[18px] leading-[24px] font-[500]">{title}</span>
        {note && <span className={`text-[14px] leading-[19px] ${on ? "text-[rgba(255,252,241,0.68)]" : SUB}`}>{note}</span>}
      </span>
    </button>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`flex items-center gap-[8px] h-[44px] px-[18px] rounded-[999px] text-[16px] leading-[20px] font-[500] transition-colors duration-200 ${on ? "bg-[#281910] text-[#FFFCF1]" : "bg-[#FFFCF1] text-[#281910] hover:bg-white"}`}
    >
      {on && (
        <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
          <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#FCCFB8" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {children}
    </button>
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

function TextField({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <label className="flex flex-col gap-[8px] min-w-[0px]">
      <span className={`text-[14px] leading-[18px] font-[500] ${SUB}`}>{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="h-[54px] px-[18px] rounded-[18px] bg-[#FFFCF1] border-[1.5px] border-solid border-transparent focus:border-[#281910] outline-none text-[17px] leading-[22px] text-[#140C04] placeholder:text-[rgba(20,12,4,0.32)] transition-colors duration-150"
      />
    </label>
  );
}

type Question = {
  id: string;
  title: string;
  note?: string;
  /** What the answer reads as in the trail above the card. */
  answer: string;
  /** Single-choice questions move on by themselves. */
  auto?: boolean;
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
    if (a.shape === "solo") return [{ id: "solo", name: "Your practice", providers: 1 }];
    if (a.shape === "clinic") return [{ id: "clinic", name: "Your clinic", providers: a.clinicProviders }];
    if (a.shape === "group") return a.locations;
    return [{ id: "solo", name: "Your practice", providers: 1 }];
  }, [a.shape, a.clinicProviders, a.locations]);

  const providerCount = sites.reduce((s, x) => s + x.providers, 0);
  const locationCount = sites.length;
  const specialty = SPECIALTIES.find((s) => s.id === a.specialty);
  const plan = PLANS.find((p) => p.id === (a.plan ?? "advanced"))!;
  const factor = a.annual ? ANNUAL_FACTOR : 1;
  const price = monthlyPrice(plan, providerCount, locationCount);

  const people = sites.flatMap((site) =>
    Array.from({ length: site.providers }, (_, i) => {
      const key = `${site.id}-${i}`;
      return { key, site, edit: a.people[key] ?? { name: "", specialty: a.specialty ?? "concierge", accepting: a.accepting ?? true } };
    }),
  );

  function pick(patch: Partial<Answers>) {
    set(patch);
    if (advance.current) window.clearTimeout(advance.current);
    advance.current = window.setTimeout(() => setAt((i) => i + 1), 320);
  }

  const questions: Question[] = [
    {
      id: "shape",
      title: "How are you purchasing Doe?",
      answer: a.shape ? PRACTICE_SHAPES.find((s) => s.id === a.shape)!.title : "",
      auto: true,
      ready: !!a.shape,
      body: (
        <div className="flex flex-col gap-[8px]">
          {PRACTICE_SHAPES.map((s) => (
            <Choice key={s.id} on={a.shape === s.id} onClick={() => pick({ shape: s.id })} title={s.title} note={s.note} />
          ))}
        </div>
      ),
    },
    ...(a.shape === "clinic"
      ? [
          {
            id: "count",
            title: "How many providers work at your clinic?",
            answer: plural(a.clinicProviders, "provider"),
            ready: true,
            body: (
              <div className="flex flex-col items-center gap-[14px] py-[12px]">
                <Count value={a.clinicProviders} onChange={(v) => set({ clinicProviders: v })} />
                <span className={`text-center text-[15px] leading-[20px] ${SUB}`}>Doctors, nurse practitioners, and anyone patients book with</span>
              </div>
            ),
          },
        ]
      : []),
    ...(a.shape === "group"
      ? [
          {
            id: "sites",
            title: "Tell us about each location.",
            note: "Name each one and how many providers work there.",
            answer: `${plural(a.locations.length, "location")}, ${plural(providerCount, "provider")}`,
            ready: a.locations.every((l) => l.name.trim()),
            body: (
              <div className="flex flex-col gap-[8px]">
                {a.locations.map((l, i) => (
                  <div key={l.id} className="flex items-center gap-[10px] p-[8px] pl-[18px] rounded-[22px] bg-[#FFFCF1]">
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
                <span className="flex gap-[8px] flex-wrap">
                  <button
                    type="button"
                    onClick={() => set({ locations: [...a.locations, { id: `l${nextId.current++}`, name: `Location ${a.locations.length + 1}`, providers: 2 }] })}
                    className="flex items-center gap-[8px] h-[44px] px-[18px] rounded-[999px] border-[1.5px] border-dashed border-[rgba(20,12,4,0.22)] hover:bg-[#FFFCF1] text-[15px] leading-[20px] font-[500] text-[#281910] transition-colors duration-150"
                  >
                    <span className="text-[18px] leading-[18px]">+</span>
                    Add a location
                  </button>
                  {phone && a.locations.length > 2 && (
                    <button
                      type="button"
                      onClick={() => set({ locations: a.locations.slice(0, -1) })}
                      className={`h-[44px] px-[18px] rounded-[999px] text-[15px] leading-[20px] font-[500] ${SUB} hover:text-[#281910]`}
                    >
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
      title: providerCount > 1 ? "What does your practice mostly do?" : "What do you practice?",
      note: providerCount > 1 ? "You can set a different specialty for any provider later." : undefined,
      answer: specialty?.label ?? "",
      auto: true,
      ready: !!a.specialty,
      body: (
        <div className={`grid gap-[8px] ${phone ? "grid-cols-1" : "grid-cols-2"}`}>
          {SPECIALTIES.map((s) => (
            <Choice key={s.id} on={a.specialty === s.id} onClick={() => pick({ specialty: s.id, services: s.services.slice(0, 3) })} title={s.label} note={s.services.slice(0, 3).join(", ")} />
          ))}
        </div>
      ),
    },
    {
      id: "services",
      title: "Which services do you offer?",
      answer: plural(a.services.length, "service"),
      ready: a.services.length > 0,
      body: (
        <div className="flex flex-wrap gap-[8px]">
          {(specialty?.services ?? []).map((s) => (
            <Chip key={s} on={a.services.includes(s)} onClick={() => set({ services: toggleIn(a.services, s) })}>
              {s}
            </Chip>
          ))}
        </div>
      ),
    },
    {
      id: "appointments",
      title: "How do patients see you?",
      answer: a.appointments.join(", "),
      ready: a.appointments.length > 0,
      body: (
        <div className="flex flex-wrap gap-[8px]">
          {APPOINTMENT_TYPES.map((t) => (
            <Chip key={t} on={a.appointments.includes(t)} onClick={() => set({ appointments: toggleIn(a.appointments, t) })}>
              {t}
            </Chip>
          ))}
        </div>
      ),
    },
    {
      id: "payments",
      title: "How do patients pay?",
      answer: a.payments.join(", "),
      ready: a.payments.length > 0,
      body: (
        <div className="flex flex-wrap gap-[8px]">
          {PAYMENT_OPTIONS.map((o) => (
            <Chip key={o} on={a.payments.includes(o)} onClick={() => set({ payments: toggleIn(a.payments, o) })}>
              {o}
            </Chip>
          ))}
        </div>
      ),
    },
    {
      id: "accepting",
      title: "Are you taking new patients?",
      answer: a.accepting === null ? "" : a.accepting ? "Taking new patients" : "Not taking new patients",
      auto: true,
      ready: a.accepting !== null,
      body: (
        <div className="flex flex-col gap-[8px]">
          <Choice on={a.accepting === true} onClick={() => pick({ accepting: true })} title="Yes" note="Agents can bring you new patients" />
          <Choice on={a.accepting === false} onClick={() => pick({ accepting: false })} title="Not right now" note="Agents only reach your existing patients" />
        </div>
      ),
    },
    {
      id: "referral",
      title: "Do patients need a referral?",
      answer: a.referral ? `Referral: ${REFERRAL_OPTIONS.find((r) => r.id === a.referral)!.label.toLowerCase()}` : "",
      auto: true,
      ready: !!a.referral,
      body: (
        <div className="flex flex-col gap-[8px]">
          {REFERRAL_OPTIONS.map((r) => (
            <Choice key={r.id} on={a.referral === r.id} onClick={() => pick({ referral: r.id })} title={r.label} />
          ))}
        </div>
      ),
    },
    {
      id: "availability",
      title: "Where does your schedule live?",
      note: "Doe reads open times from here, so agents only offer real ones.",
      answer: a.availability ? AVAILABILITY_SOURCES.find((s) => s.id === a.availability)!.label : "",
      auto: true,
      ready: !!a.availability,
      body: (
        <div className={`grid gap-[8px] ${phone ? "grid-cols-1" : "grid-cols-2"}`}>
          {AVAILABILITY_SOURCES.map((s) => (
            <Choice key={s.id} on={a.availability === s.id} onClick={() => pick({ availability: s.id })} title={s.label} />
          ))}
        </div>
      ),
    },
    ...(providerCount > 1
      ? [
          {
            id: "people",
            title: "Who are your providers?",
            note: "Optional. Name them, and change anyone whose specialty or intake differs.",
            answer: `${people.filter((p) => p.edit.name.trim()).length} of ${providerCount} named`,
            ready: true,
            body: (
              <div className="flex flex-col gap-[14px] max-h-[440px] overflow-y-auto -mr-[8px] pr-[8px] [scrollbar-width:thin]">
                {sites.map((site) => (
                  <div key={site.id} className="flex flex-col gap-[6px]">
                    {sites.length > 1 && <span className={`px-[4px] text-[18px] leading-[22px] text-[#281910] ${DISPLAY}`}>{site.name}</span>}
                    {people
                      .filter((p) => p.site.id === site.id)
                      .map((p, i) => (
                        <div key={p.key} className={`flex items-center gap-[8px] p-[8px] pl-[16px] rounded-[18px] bg-[#FFFCF1] ${phone ? "flex-wrap" : ""}`}>
                          <input
                            value={p.edit.name}
                            placeholder={`Provider ${i + 1}`}
                            aria-label={`Provider ${i + 1} name`}
                            onChange={(e) => set({ people: { ...a.people, [p.key]: { ...p.edit, name: e.target.value } } })}
                            className={`grow min-w-[0px] h-[38px] bg-transparent outline-none text-[16px] leading-[20px] font-[500] text-[#140C04] placeholder:text-[rgba(20,12,4,0.35)] ${phone ? "basis-full" : ""}`}
                          />
                          <select
                            value={p.edit.specialty}
                            aria-label="Specialty"
                            onChange={(e) => set({ people: { ...a.people, [p.key]: { ...p.edit, specialty: e.target.value as SpecialtyId } } })}
                            className="h-[38px] px-[12px] rounded-[999px] bg-[#F4EEDF] text-[14px] leading-[18px] font-[500] text-[#281910] outline-none"
                          >
                            {SPECIALTIES.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.label}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => set({ people: { ...a.people, [p.key]: { ...p.edit, accepting: !p.edit.accepting } } })}
                            className={`h-[38px] px-[14px] rounded-[999px] text-[14px] leading-[18px] font-[500] transition-colors duration-150 ${p.edit.accepting ? "bg-[#DCE5D0] text-[#2F3B2A]" : "bg-[#F4EEDF] text-[rgba(20,12,4,0.6)]"}`}
                          >
                            {p.edit.accepting ? "Taking new patients" : "Full"}
                          </button>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            ),
          },
        ]
      : []),
    {
      id: "plan",
      title: "Choose your plan.",
      answer: a.plan ? `${plan.name}, ${money(price.total * factor)}/mo` : "",
      ready: !!a.plan,
      body: (
        <div className="flex flex-col gap-[10px]">
          <span className="flex items-center gap-[10px] flex-wrap pb-[4px]">
            <span className="inline-flex p-[3px] gap-[2px] rounded-[999px] bg-[#FFFCF1]">
              {(["monthly", "annual"] as const).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => set({ annual: b === "annual" })}
                  className={`h-[36px] px-[16px] rounded-[999px] text-[14px] leading-[18px] font-[500] transition-colors duration-200 ${(b === "annual") === a.annual ? "bg-[#281910] text-[#FFFCF1]" : `${SUB} hover:text-[#281910]`}`}
                >
                  {b === "annual" ? "Yearly" : "Monthly"}
                </button>
              ))}
            </span>
            <span className={`text-[14px] leading-[18px] ${SUB}`}>Two months free when you pay yearly</span>
          </span>
          {PLANS.map((p) => {
            const on = a.plan === p.id;
            const total = monthlyPrice(p, providerCount, locationCount).total * factor;
            return (
              <button
                key={p.id}
                type="button"
                aria-pressed={on}
                onClick={() => set({ plan: p.id })}
                className={`flex flex-col gap-[14px] p-[22px] rounded-[26px] text-left transition-colors duration-200 ${on ? "bg-[#281910] text-[#FFFCF1]" : "bg-[#FFFCF1] text-[#281910] hover:bg-white"}`}
              >
                <span className={`flex ${phone ? "flex-col gap-[10px]" : "items-start justify-between gap-[20px]"}`}>
                  <span className="flex flex-col gap-[4px]">
                    <span className="flex items-center gap-[10px]">
                      <span className={`text-[26px] leading-[30px] tracking-[-0.02em] ${DISPLAY}`}>{p.name}</span>
                      {p.id === "advanced" && <span className="h-[24px] px-[10px] flex items-center rounded-[999px] bg-[#FCCFB8] text-[12px] leading-[16px] font-[600] text-[#140C04] whitespace-nowrap">Most chosen</span>}
                    </span>
                    <span className={`text-[15px] leading-[20px] ${on ? "text-[rgba(255,252,241,0.7)]" : SUB}`}>{p.line}</span>
                  </span>
                  <span className={`flex flex-col shrink-0 ${phone ? "" : "items-end"}`}>
                    <span className="flex items-baseline gap-[4px]">
                      <span className={`text-[38px] leading-[40px] tracking-[-0.035em] ${DISPLAY} [font-variant-numeric:tabular-nums]`}>{money(total)}</span>
                      <span className={`text-[14px] ${on ? "text-[rgba(255,252,241,0.65)]" : SUB}`}>/mo</span>
                    </span>
                    <span className={`text-[13px] leading-[17px] ${on ? "text-[rgba(255,252,241,0.6)]" : SUB}`}>
                      {plural(providerCount, "provider")}, {plural(locationCount, "location")}
                    </span>
                  </span>
                </span>
                <span className="flex flex-wrap gap-[6px]">
                  {p.includes && (
                    <span className={`h-[30px] px-[12px] flex items-center rounded-[999px] text-[13px] leading-[16px] font-[600] ${on ? "bg-[rgba(255,252,241,0.14)]" : "bg-[#F4EEDF]"}`}>{p.includes.replace(", plus", "")}</span>
                  )}
                  {p.features.map((f) => (
                    <span key={f.title} className={`h-[30px] px-[12px] flex items-center rounded-[999px] text-[13px] leading-[16px] font-[500] ${on ? "bg-[rgba(255,252,241,0.14)]" : "bg-[#F4EEDF]"}`}>
                      {f.title}
                    </span>
                  ))}
                </span>
              </button>
            );
          })}
        </div>
      ),
    },
    {
      id: "contact",
      title: "Where should we send your setup?",
      note: "No charge until you go live.",
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

  /** The running price: a sticky pill above the question on desktop, a bar along the bottom on iPhone. */
  const priceBar = (
    <div
      className={`z-40 flex items-center gap-[14px] bg-[#281910] text-[#FFFCF1] ${phone ? "fixed left-[10px] right-[10px] bottom-[max(10px,env(safe-area-inset-bottom))] p-[12px] pl-[20px] rounded-[22px]" : "sticky top-[124px] self-center h-[64px] pl-[24px] pr-[10px] rounded-[999px]"}`}
    >
      <span className="flex flex-col min-w-[0px]">
        <span className="flex items-baseline gap-[6px] whitespace-nowrap">
          <span className={`text-[26px] leading-[30px] tracking-[-0.03em] ${DISPLAY} [font-variant-numeric:tabular-nums]`}>{a.shape ? money(price.total * factor) : `From ${money(PLANS[0]!.base * factor)}`}</span>
          <span className="text-[13px] text-[rgba(255,252,241,0.65)]">/mo</span>
        </span>
        <span className="truncate text-[12px] leading-[16px] text-[rgba(255,252,241,0.62)]">
          {a.shape ? `${a.plan ? plan.name : "With Advanced"} · ${plural(providerCount, "provider")} · ${plural(locationCount, "location")}` : "Answer a few questions to see yours"}
        </span>
      </span>
      {!phone && (
        <span className="flex items-center gap-[4px] pl-[14px] ml-[4px] border-l border-solid border-[rgba(255,252,241,0.16)]">
          {PLANS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => set({ plan: p.id })}
              className={`h-[44px] px-[16px] rounded-[999px] text-[14px] leading-[18px] font-[500] transition-colors duration-200 ${a.plan === p.id ? "bg-[#FCCFB8] text-[#140C04]" : "text-[rgba(255,252,241,0.8)] hover:bg-[rgba(255,252,241,0.1)]"}`}
            >
              {p.name}
            </button>
          ))}
        </span>
      )}
    </div>
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
        {plan.name} for {a.contact.practice}, {money(price.total * factor)} a month. Your setup is on its way to {a.contact.email}.
      </p>
      <ol className="m-0 p-0 list-none flex flex-col gap-[8px]">
        {[
          ["Connect your scheduling software", "Today, about 10 minutes"],
          [`Confirm your ${plural(providerCount, "provider")}`, "With your onboarding lead"],
          ["Go live to personal agents", "Usually within two days"],
        ].map(([t, d], i) => (
          <li key={t} className="flex items-center gap-[14px] p-[16px] rounded-[20px] bg-[#FFFCF1]">
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
    <div key={q.id} className="doe-pricing-rise flex flex-col gap-[26px]">
      <div className="flex flex-col gap-[10px]">
        <span className={`text-[14px] leading-[18px] font-[500] ${SUB}`}>
          {index + 1} of {questions.length}
        </span>
        <h2 className={`m-0 text-[clamp(30px,3.6vw,46px)] leading-[1.05] tracking-[-0.035em] font-[400] text-[#281910] ${DISPLAY}`}>{q.title}</h2>
        {q.note && <p className={`m-0 text-[16px] leading-[23px] ${SUB}`}>{q.note}</p>}
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
            className="h-[52px] px-[28px] rounded-[999px] bg-[#281910] hover:bg-[#3A2920] disabled:bg-[rgba(20,12,4,0.1)] disabled:text-[rgba(20,12,4,0.38)] text-[16px] leading-[20px] font-[500] text-[#FFFCF1] transition-colors duration-200"
          >
            {last ? "Start onboarding" : q.id === "people" && !people.some((p) => p.edit.name.trim()) ? "Skip for now" : "Continue"}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="relative">
      <div className="doe-pricing-clouds" aria-hidden="true">
        <span style={{ width: 620, height: 480, left: "4%", top: "14%", background: "rgba(252,207,184,0.42)" }} />
        <span style={{ width: 640, height: 520, right: "2%", top: "34%", background: "rgba(220,229,208,0.55)" }} />
        <span style={{ width: 560, height: 420, left: "30%", bottom: "12%", background: "rgba(236,226,204,0.85)" }} />
      </div>

      <div className={`relative mx-auto flex flex-col ${phone ? "gap-[16px] pb-[110px]" : "max-w-[780px] gap-[18px] pb-[40px]"}`}>
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
                className="doe-pricing-rise flex items-center gap-[8px] h-[34px] pl-[12px] pr-[14px] rounded-[999px] bg-[rgba(255,252,241,0.8)] hover:bg-[#FFFCF1] text-[14px] leading-[18px] font-[500] text-[#281910] transition-colors duration-150 [backdrop-filter:blur(8px)]"
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
          className={`${phone ? "p-[20px] rounded-[28px]" : "p-[40px] rounded-[36px]"} bg-[rgba(244,238,223,0.8)] [backdrop-filter:blur(18px)]`}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !done && (e.target as HTMLElement).tagName === "INPUT") forward();
          }}
        >
          {card}
        </div>
      </div>

    </div>
  );
}
