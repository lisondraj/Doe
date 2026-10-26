"use client";

/**
 * /pricing builder — four steps: how the practice is set up (solo, one clinic, or several locations with a provider
 * count each), each provider's specialty, services and booking details, the plan, and a short form to start
 * onboarding. A summary follows along with the price for the practice's size: beside the steps on desktop, as a bar
 * pinned to the bottom on iPhone.
 */
import { type ReactNode, useMemo, useRef, useState } from "react";

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

type Step = "practice" | "providers" | "plan" | "start";
const STEPS: { id: Step; label: string }[] = [
  { id: "practice", label: "Practice" },
  { id: "providers", label: "Providers" },
  { id: "plan", label: "Plan" },
  { id: "start", label: "Start" },
];

type Provider = {
  key: string;
  name: string;
  specialty: SpecialtyId;
  services: string[];
  appointments: string[];
  locations: string[];
  accepting: boolean;
  payments: string[];
  referral: (typeof REFERRAL_OPTIONS)[number]["id"];
  availability: (typeof AVAILABILITY_SOURCES)[number]["id"];
  restrictions: string;
};

const money = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

function defaultProvider(key: string, n: number, specialty: SpecialtyId, locationName: string): Provider {
  return {
    key,
    name: `Provider ${n}`,
    specialty,
    services: SPECIALTIES.find((s) => s.id === specialty)!.services.slice(0, 3),
    appointments: ["In person"],
    locations: [locationName],
    accepting: true,
    payments: ["Self-pay"],
    referral: "none",
    availability: "ehr",
    restrictions: "",
  };
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`h-[36px] px-[14px] rounded-[999px] text-[14px] leading-[18px] font-[500] transition-colors duration-150 ${
        on ? "bg-[#281910] text-[#FFFCF1]" : "bg-[#FFFCF1] text-[#281910] hover:bg-white"
      }`}
    >
      {children}
    </button>
  );
}

function Segmented<T extends string>({ value, options, onChange }: { value: T; options: readonly { id: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <span className="inline-flex flex-wrap p-[3px] gap-[2px] rounded-[999px] bg-[#FFFCF1]">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={`h-[34px] px-[14px] rounded-[999px] text-[14px] leading-[18px] font-[500] transition-colors duration-150 ${value === o.id ? "bg-[#281910] text-[#FFFCF1]" : `${SUB} hover:text-[#281910]`}`}
        >
          {o.label}
        </button>
      ))}
    </span>
  );
}

function Stepper({ value, onChange, min = 1, max = 99 }: { value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  const btn = "w-[36px] h-[36px] flex items-center justify-center rounded-[999px] bg-[#F4EEDF] hover:bg-[#EDE5D2] text-[#281910] text-[18px] leading-[18px] transition-colors duration-150 disabled:opacity-40";
  return (
    <span className="inline-flex items-center gap-[4px] p-[3px] rounded-[999px] bg-[#FFFCF1]">
      <button type="button" aria-label="Fewer" disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))} className={btn}>
        −
      </button>
      <span className={`w-[44px] text-center text-[20px] leading-[24px] ${DISPLAY} text-[#281910] [font-variant-numeric:tabular-nums]`}>{value}</span>
      <button type="button" aria-label="More" disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))} className={btn}>
        +
      </button>
    </span>
  );
}

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)} className={`relative w-[44px] h-[26px] shrink-0 rounded-[999px] transition-colors duration-200 ${on ? "bg-[#281910]" : "bg-[rgba(20,12,4,0.16)]"}`}>
      <span className="absolute top-[3px] w-[20px] h-[20px] rounded-[999px] bg-[#FFFCF1] transition-[left] duration-200" style={{ left: on ? 21 : 3 }} />
    </button>
  );
}

function TextInput({ value, onChange, placeholder, label, type = "text" }: { value: string; onChange: (v: string) => void; placeholder?: string; label: string; type?: string }) {
  return (
    <label className="flex flex-col gap-[6px] min-w-[0px]">
      <span className={`text-[13px] leading-[16px] font-[500] ${SUB}`}>{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="h-[46px] px-[14px] rounded-[11px] bg-[#FFFCF1] border-[1.5px] border-solid border-transparent focus:border-[#281910] outline-none text-[16px] leading-[20px] text-[#140C04] placeholder:text-[rgba(20,12,4,0.35)]"
      />
    </label>
  );
}

/** A labeled field inside a provider's editor. */
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-[10px]">
      <span className="text-[14px] leading-[18px] font-[600] text-[#281910]">{label}</span>
      {children}
    </div>
  );
}

function StepHead({ n, title, children }: { n: number; title: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col gap-[8px]">
      <span className={`text-[14px] leading-[18px] font-[500] ${SUB}`}>Step {n} of 4</span>
      <h2 className={`m-0 text-[clamp(30px,3.4vw,42px)] leading-[1.05] tracking-[-0.03em] font-[400] text-[#281910] ${DISPLAY}`}>{title}</h2>
      {children}
    </div>
  );
}

const toggleIn = (list: string[], item: string) => (list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);

export function DoeHealthPricingBuilder({ phone }: { phone: boolean }) {
  const [step, setStep] = useState<Step>("practice");
  const [shape, setShape] = useState<PracticeShape>("clinic");
  const [clinicProviders, setClinicProviders] = useState(4);
  const [locations, setLocations] = useState<Location[]>([
    { id: "l1", name: "Downtown Clinic", providers: 6 },
    { id: "l2", name: "North Clinic", providers: 3 },
    { id: "l3", name: "West Clinic", providers: 8 },
  ]);
  const [specialty, setSpecialty] = useState<SpecialtyId>("concierge");
  const [edits, setEdits] = useState<Record<string, Provider>>({});
  const [openProvider, setOpenProvider] = useState<string | null>(null);
  const [plan, setPlan] = useState<PlanId>("advanced");
  const [annual, setAnnual] = useState(true);
  const [contact, setContact] = useState({ name: "", email: "", practice: "", phone: "" });
  const [done, setDone] = useState(false);
  const nextId = useRef(4);
  const topRef = useRef<HTMLDivElement>(null);

  /** The practice as locations with provider counts, whatever shape was picked. */
  const sites: Location[] = useMemo(() => {
    if (shape === "solo") return [{ id: "solo", name: "Your practice", providers: 1 }];
    if (shape === "clinic") return [{ id: "clinic", name: "Your clinic", providers: clinicProviders }];
    return locations;
  }, [shape, clinicProviders, locations]);

  const providers: Provider[] = useMemo(
    () =>
      sites.flatMap((site) =>
        Array.from({ length: site.providers }, (_, i) => {
          const key = `${site.id}-${i}`;
          const n = sites.slice(0, sites.indexOf(site)).reduce((s, x) => s + x.providers, 0) + i + 1;
          return edits[key] ?? defaultProvider(key, n, specialty, site.name);
        }),
      ),
    [sites, edits, specialty],
  );

  const providerCount = providers.length;
  const locationCount = sites.length;
  const configured = providers.filter((p) => p.services.length > 0 && p.name.trim()).length;
  const chosen = PLANS.find((p) => p.id === plan)!;
  const price = monthlyPrice(chosen, providerCount, locationCount);
  const factor = annual ? ANNUAL_FACTOR : 1;

  const go = (s: Step) => {
    setStep(s);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const stepIndex = STEPS.findIndex((s) => s.id === step);
  const next = STEPS[stepIndex + 1];
  const contactReady = contact.name.trim() && /.+@.+\..+/.test(contact.email) && contact.practice.trim();

  const editProvider = (key: string, patch: Partial<Provider>) => {
    const current = providers.find((p) => p.key === key)!;
    setEdits((prev) => ({ ...prev, [key]: { ...current, ...patch } }));
  };
  const applyToAll = (from: Provider) => {
    setEdits(() =>
      Object.fromEntries(
        providers.map((p) => [
          p.key,
          { ...p, specialty: from.specialty, services: from.services, appointments: from.appointments, payments: from.payments, referral: from.referral, availability: from.availability, accepting: from.accepting },
        ]),
      ),
    );
  };

  const cta = (() => {
    if (step === "start") return { label: done ? "Onboarding started" : "Start onboarding", disabled: done || !contactReady, onClick: () => setDone(true) };
    return { label: `Continue to ${next!.label.toLowerCase()}`, disabled: false, onClick: () => go(next!.id) };
  })();

  /* ---------- Steps ---------- */

  const practiceStep = (
    <div className="flex flex-col gap-[28px]">
      <StepHead n={1} title="How are you purchasing Doe?" />
      <div className={`grid gap-[10px] ${phone ? "grid-cols-1" : "grid-cols-3"}`}>
        {PRACTICE_SHAPES.map((s) => {
          const on = shape === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setShape(s.id)}
              aria-pressed={on}
              className={`flex flex-col items-start gap-[18px] p-[20px] rounded-[11px] text-left transition-colors duration-150 ${on ? "bg-[#281910] text-[#FFFCF1]" : "bg-[#F4EEDF] text-[#281910] hover:bg-[#EFE7D4]"}`}
            >
              <span className={`w-[22px] h-[22px] flex items-center justify-center rounded-[999px] border-[1.5px] border-solid ${on ? "border-[#FCCFB8]" : "border-[rgba(20,12,4,0.25)]"}`}>
                {on && <span className="w-[10px] h-[10px] rounded-[999px] bg-[#FCCFB8]" />}
              </span>
              <span className="flex flex-col gap-[4px]">
                <span className={`text-[22px] leading-[26px] tracking-[-0.02em] ${DISPLAY}`}>{s.title}</span>
                <span className={`text-[14px] leading-[19px] ${on ? "text-[rgba(255,252,241,0.7)]" : SUB}`}>{s.note}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-[10px] p-[20px] rounded-[11px] bg-[#F4EEDF]">
        {shape === "solo" && (
          <div className="flex items-center justify-between gap-[16px] flex-wrap">
            <span className="text-[16px] leading-[22px] text-[#281910]">One provider at one location.</span>
            <span className={`flex gap-[8px] text-[14px] leading-[18px] font-[500] ${SUB}`}>
              <span className="px-[12px] h-[32px] flex items-center rounded-[999px] bg-[#FFFCF1]">1 provider</span>
              <span className="px-[12px] h-[32px] flex items-center rounded-[999px] bg-[#FFFCF1]">1 location</span>
            </span>
          </div>
        )}
        {shape === "clinic" && (
          <div className="flex items-center justify-between gap-[16px] flex-wrap">
            <span className="text-[16px] leading-[22px] font-[500] text-[#281910]">How many providers work at this location?</span>
            <Stepper value={clinicProviders} onChange={setClinicProviders} max={60} />
          </div>
        )}
        {shape === "group" && (
          <div className="flex flex-col gap-[8px]">
            <span className="flex items-baseline justify-between">
              <span className="text-[16px] leading-[22px] font-[500] text-[#281910]">Your locations</span>
              <span className={`text-[14px] leading-[18px] ${SUB}`}>
                {locations.length} locations · {locations.reduce((s, l) => s + l.providers, 0)} providers
              </span>
            </span>
            {locations.map((l, i) => (
              <div key={l.id} className={`flex items-center gap-[10px] p-[8px] pl-[14px] rounded-[11px] bg-[#FFFCF1] ${phone ? "flex-wrap" : ""}`}>
                <input
                  value={l.name}
                  aria-label={`Location ${i + 1} name`}
                  onChange={(e) => setLocations((prev) => prev.map((x) => (x.id === l.id ? { ...x, name: e.target.value } : x)))}
                  className={`grow min-w-[0px] h-[40px] bg-transparent outline-none text-[16px] leading-[20px] font-[500] text-[#140C04] ${phone ? "basis-full" : ""}`}
                />
                <span className={`text-[14px] leading-[18px] ${SUB} ${phone ? "grow" : ""}`}>Providers</span>
                <span className="[&>span]:bg-[#F4EEDF]">
                  <Stepper value={l.providers} onChange={(v) => setLocations((prev) => prev.map((x) => (x.id === l.id ? { ...x, providers: v } : x)))} max={60} />
                </span>
                <button
                  type="button"
                  aria-label={`Remove ${l.name}`}
                  disabled={locations.length <= 2}
                  onClick={() => setLocations((prev) => prev.filter((x) => x.id !== l.id))}
                  className="w-[36px] h-[36px] shrink-0 flex items-center justify-center rounded-[999px] text-[#281910] hover:bg-[#F4EEDF] disabled:opacity-30 transition-colors duration-150"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
                    <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const id = `l${nextId.current++}`;
                setLocations((prev) => [...prev, { id, name: `Location ${prev.length + 1}`, providers: 2 }]);
              }}
              className="self-start flex items-center gap-[8px] h-[40px] px-[16px] rounded-[999px] bg-[#FFFCF1] hover:bg-white text-[14px] leading-[18px] font-[500] text-[#281910] transition-colors duration-150"
            >
              <span className="text-[18px] leading-[18px]">+</span>
              Add location
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-[12px]">
        <span className="text-[16px] leading-[22px] font-[500] text-[#281910]">Main specialty</span>
        <div className="flex flex-wrap gap-[8px] p-[14px] rounded-[11px] bg-[#F4EEDF]">
          {SPECIALTIES.map((s) => (
            <Chip
              key={s.id}
              on={specialty === s.id}
              onClick={() => {
                setSpecialty(s.id);
                setEdits({});
              }}
            >
              {s.label}
            </Chip>
          ))}
        </div>
      </div>
    </div>
  );

  const providersStep = (
    <div className="flex flex-col gap-[24px]">
      <StepHead n={2} title="Set up your providers">
        <span className={`text-[16px] leading-[22px] ${SUB}`}>
          {configured} of {providerCount} ready. Set one up, then copy it to the rest.
        </span>
      </StepHead>
      {sites.map((site) => (
        <div key={site.id} className="flex flex-col gap-[8px]">
          {sites.length > 1 && (
            <span className="flex items-baseline justify-between px-[2px]">
              <span className={`text-[20px] leading-[24px] tracking-[-0.01em] text-[#281910] ${DISPLAY}`}>{site.name}</span>
              <span className={`text-[14px] leading-[18px] ${SUB}`}>{site.providers} providers</span>
            </span>
          )}
          {providers
            .filter((p) => p.key.startsWith(`${site.id}-`))
            .map((p) => {
              const open = openProvider === p.key;
              const spec = SPECIALTIES.find((s) => s.id === p.specialty)!;
              return (
                <div key={p.key} className={`flex flex-col rounded-[11px] transition-colors duration-150 ${open ? "bg-[#F4EEDF]" : "bg-[#F4EEDF] hover:bg-[#EFE7D4]"}`}>
                  <button type="button" onClick={() => setOpenProvider(open ? null : p.key)} className="flex items-center gap-[14px] p-[14px] text-left">
                    <span className="w-[40px] h-[40px] shrink-0 flex items-center justify-center rounded-[999px] bg-[#FCCFB8] text-[14px] leading-[16px] font-[600] text-[#281910]">
                      {p.name
                        .replace(/^Dr\.?\s*/i, "")
                        .split(/\s+/)
                        .map((w) => w[0] ?? "")
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </span>
                    <span className="flex flex-col grow min-w-[0px]">
                      <span className="truncate text-[16px] leading-[21px] font-[600] text-[#140C04]">{p.name || "Unnamed provider"}</span>
                      <span className={`truncate text-[14px] leading-[19px] ${SUB}`}>
                        {spec.label} · {p.services.length} services · {p.accepting ? "Accepting new patients" : "Not accepting"}
                      </span>
                    </span>
                    {!phone && (
                      <span className={`h-[28px] px-[12px] flex items-center rounded-[999px] text-[13px] leading-[16px] font-[500] ${p.services.length ? "bg-[#DCE5D0] text-[#2F3B2A]" : "bg-[#FCCFB8] text-[#140C04]"}`}>
                        {p.services.length ? "Ready" : "Pick services"}
                      </span>
                    )}
                    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block", flexShrink: 0, transform: open ? "rotate(180deg)" : undefined, transition: "transform 200ms ease" }}>
                      <path d="M6 9l6 6 6-6" fill="none" stroke="#281910" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  {open && (
                    <div className="flex flex-col gap-[22px] px-[14px] pb-[18px] pt-[4px]">
                      <div className={`grid gap-[10px] ${phone ? "grid-cols-1" : "grid-cols-2"}`}>
                        <TextInput label="Provider name" value={p.name} onChange={(v) => editProvider(p.key, { name: v })} placeholder="Dr. Jane Smith" />
                        <TextInput label="Restrictions or requirements" value={p.restrictions} onChange={(v) => editProvider(p.key, { restrictions: v })} placeholder="Ages 18+, no Saturday visits" />
                      </div>
                      <Field label="Specialty">
                        <div className="flex flex-wrap gap-[8px]">
                          {SPECIALTIES.map((s) => (
                            <Chip key={s.id} on={p.specialty === s.id} onClick={() => editProvider(p.key, { specialty: s.id, services: s.services.slice(0, 3) })}>
                              {s.label}
                            </Chip>
                          ))}
                        </div>
                      </Field>
                      <Field label="Services offered">
                        <div className="flex flex-wrap gap-[8px]">
                          {spec.services.map((s) => (
                            <Chip key={s} on={p.services.includes(s)} onClick={() => editProvider(p.key, { services: toggleIn(p.services, s) })}>
                              {s}
                            </Chip>
                          ))}
                        </div>
                      </Field>
                      <Field label="Appointment types">
                        <div className="flex flex-wrap gap-[8px]">
                          {APPOINTMENT_TYPES.map((a) => (
                            <Chip key={a} on={p.appointments.includes(a)} onClick={() => editProvider(p.key, { appointments: toggleIn(p.appointments, a) })}>
                              {a}
                            </Chip>
                          ))}
                        </div>
                      </Field>
                      {sites.length > 1 && (
                        <Field label="Locations worked">
                          <div className="flex flex-wrap gap-[8px]">
                            {sites.map((s) => (
                              <Chip key={s.id} on={p.locations.includes(s.name)} onClick={() => editProvider(p.key, { locations: toggleIn(p.locations, s.name) })}>
                                {s.name}
                              </Chip>
                            ))}
                          </div>
                        </Field>
                      )}
                      <Field label="Insurance and payment">
                        <div className="flex flex-wrap gap-[8px]">
                          {PAYMENT_OPTIONS.map((o) => (
                            <Chip key={o} on={p.payments.includes(o)} onClick={() => editProvider(p.key, { payments: toggleIn(p.payments, o) })}>
                              {o}
                            </Chip>
                          ))}
                        </div>
                      </Field>
                      <div className={`grid gap-[22px] ${phone ? "grid-cols-1" : "grid-cols-2"}`}>
                        <Field label="Referral required">
                          <Segmented value={p.referral} options={REFERRAL_OPTIONS} onChange={(v) => editProvider(p.key, { referral: v })} />
                        </Field>
                        <Field label="Availability comes from">
                          <Segmented value={p.availability} options={AVAILABILITY_SOURCES} onChange={(v) => editProvider(p.key, { availability: v })} />
                        </Field>
                      </div>
                      <div className="flex items-center justify-between gap-[16px] flex-wrap pt-[4px]">
                        <span className="flex items-center gap-[12px]">
                          <Toggle on={p.accepting} onChange={(v) => editProvider(p.key, { accepting: v })} label="Accepting new patients" />
                          <span className="text-[15px] leading-[20px] font-[500] text-[#281910]">Accepting new patients</span>
                        </span>
                        {providerCount > 1 && (
                          <button
                            type="button"
                            onClick={() => applyToAll(p)}
                            className="h-[40px] px-[16px] rounded-[999px] bg-[#FFFCF1] hover:bg-white text-[14px] leading-[18px] font-[500] text-[#281910] transition-colors duration-150"
                          >
                            Copy to all {providerCount} providers
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      ))}
    </div>
  );

  const planStep = (
    <div className="flex flex-col gap-[24px]">
      <StepHead n={3} title="Choose your plan">
        <span className="flex items-center gap-[12px] flex-wrap pt-[4px]">
          <span className="[&>span]:bg-[#F4EEDF]">
            <Segmented
              value={annual ? "annual" : "monthly"}
              onChange={(v) => setAnnual(v === "annual")}
              options={[
                { id: "monthly", label: "Monthly" },
                { id: "annual", label: "Yearly" },
              ]}
            />
          </span>
          <span className="h-[28px] px-[12px] flex items-center rounded-[999px] bg-[#FCCFB8] text-[13px] leading-[16px] font-[500] text-[#140C04]">2 months free yearly</span>
        </span>
      </StepHead>
      <div className={`grid gap-[10px] items-stretch ${phone ? "grid-cols-1" : "grid-cols-3"}`}>
        {PLANS.map((p) => {
          const on = plan === p.id;
          const dark = p.id === "one";
          const total = monthlyPrice(p, providerCount, locationCount).total * factor;
          return (
            <div
              key={p.id}
              className={`relative flex flex-col gap-[18px] p-[22px] rounded-[11px] outline outline-[2px] -outline-offset-[2px] transition-[outline-color] duration-150 ${dark ? "bg-[#281910] text-[#FFFCF1]" : "bg-[#F4EEDF] text-[#281910]"} ${on ? (dark ? "outline-[#FCCFB8]" : "outline-[#281910]") : "outline-transparent"}`}
            >
              <span className="flex items-center justify-between gap-[10px]">
                <span className={`text-[26px] leading-[30px] tracking-[-0.02em] ${DISPLAY}`}>{p.name}</span>
                {p.id === "advanced" && <span className="h-[26px] px-[10px] flex items-center shrink-0 whitespace-nowrap rounded-[999px] bg-[#FCCFB8] text-[12px] leading-[16px] font-[600] text-[#140C04]">Most chosen</span>}
              </span>
              <span className={`text-[15px] leading-[21px] ${dark ? "text-[rgba(255,252,241,0.75)]" : SUB}`}>{p.line}</span>
              <span className="flex flex-col gap-[2px]">
                <span className="flex items-baseline gap-[6px]">
                  <span className={`text-[46px] leading-[48px] tracking-[-0.035em] ${DISPLAY} [font-variant-numeric:tabular-nums]`}>{money(total)}</span>
                  <span className={`text-[15px] leading-[20px] ${dark ? "text-[rgba(255,252,241,0.7)]" : SUB}`}>/ month</span>
                </span>
                <span className={`text-[13px] leading-[18px] ${dark ? "text-[rgba(255,252,241,0.6)]" : SUB}`}>
                  {providerCount === 1 && locationCount === 1 ? `Solo from ${money(p.base * factor)}` : `For ${providerCount} providers at ${locationCount} ${locationCount === 1 ? "location" : "locations"}`}
                  {annual ? ", billed yearly" : ""}
                </span>
              </span>
              <button
                type="button"
                onClick={() => setPlan(p.id)}
                className={`h-[46px] rounded-[999px] text-[15px] leading-[20px] font-[500] transition-colors duration-150 ${
                  on ? (dark ? "bg-[#FCCFB8] text-[#140C04]" : "bg-[#281910] text-[#FFFCF1]") : dark ? "bg-[rgba(255,252,241,0.12)] hover:bg-[rgba(255,252,241,0.18)] text-[#FFFCF1]" : "bg-[#FFFCF1] hover:bg-white text-[#281910]"
                }`}
              >
                {on ? "Selected" : `Choose ${p.name}`}
              </button>
              <span className={`h-[1px] ${dark ? "bg-[rgba(255,252,241,0.14)]" : "bg-[rgba(20,12,4,0.1)]"}`} />
              {p.includes && <span className="text-[14px] leading-[18px] font-[600]">{p.includes}</span>}
              <ul className="m-0 p-0 list-none flex flex-col gap-[14px]">
                {p.features.map((f) => (
                  <li key={f.title} className="flex gap-[10px]">
                    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block", flexShrink: 0, marginTop: 2 }}>
                      <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke={dark ? "#FCCFB8" : "#281910"} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="flex flex-col gap-[3px]">
                      <span className="text-[15px] leading-[20px] font-[600]">{f.title}</span>
                      <span className={`text-[13px] leading-[19px] ${dark ? "text-[rgba(255,252,241,0.65)]" : SUB}`}>{f.items.join(" · ")}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );

  const startStep = done ? (
    <div className="flex flex-col gap-[26px]">
      <span className="w-[56px] h-[56px] flex items-center justify-center rounded-[999px] bg-[#DCE5D0]">
        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
          <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#2F3B2A" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <StepHead n={4} title={`Welcome to Doe, ${contact.name.split(" ")[0]}.`}>
        <span className={`text-[16px] leading-[22px] ${SUB}`}>We sent next steps to {contact.email}.</span>
      </StepHead>
      <ol className="m-0 p-0 list-none flex flex-col gap-[8px]">
        {[
          { t: "Connect your scheduling software", d: "Today, about 10 minutes" },
          { t: `Confirm your ${providerCount} ${providerCount === 1 ? "provider" : "providers"} and their services`, d: "With your onboarding lead" },
          { t: "Go live to personal agents", d: "Usually within two days" },
        ].map((s, i) => (
          <li key={s.t} className="flex items-center gap-[14px] p-[16px] rounded-[11px] bg-[#F4EEDF]">
            <span className={`w-[32px] h-[32px] shrink-0 flex items-center justify-center rounded-[999px] bg-[#281910] text-[#FFFCF1] text-[15px] ${DISPLAY}`}>{i + 1}</span>
            <span className="flex flex-col">
              <span className="text-[16px] leading-[21px] font-[600] text-[#140C04]">{s.t}</span>
              <span className={`text-[14px] leading-[19px] ${SUB}`}>{s.d}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  ) : (
    <div className="flex flex-col gap-[24px]">
      <StepHead n={4} title="Start onboarding" />
      <div className={`grid gap-[12px] p-[20px] rounded-[11px] bg-[#F4EEDF] ${phone ? "grid-cols-1" : "grid-cols-2"}`}>
        <TextInput label="Your name" value={contact.name} onChange={(v) => setContact((c) => ({ ...c, name: v }))} placeholder="Jane Smith" />
        <TextInput label="Work email" type="email" value={contact.email} onChange={(v) => setContact((c) => ({ ...c, email: v }))} placeholder="jane@yourclinic.com" />
        <TextInput label="Practice name" value={contact.practice} onChange={(v) => setContact((c) => ({ ...c, practice: v }))} placeholder="Northside Family Medicine" />
        <TextInput label="Phone (optional)" type="tel" value={contact.phone} onChange={(v) => setContact((c) => ({ ...c, phone: v }))} placeholder="(555) 555-0142" />
      </div>
      <span className={`text-[14px] leading-[20px] ${SUB}`}>No charge until you go live. Cancel any time before then.</span>
    </div>
  );

  const body = { practice: practiceStep, providers: providersStep, plan: planStep, start: startStep }[step];

  /* ---------- Summary ---------- */

  const shapeLabel = PRACTICE_SHAPES.find((s) => s.id === shape)!.title;
  const lines = [
    { label: `${chosen.name}, first provider and location`, value: price.base * factor },
    ...(price.extraProviders ? [{ label: `${price.extraProviders} more ${price.extraProviders === 1 ? "provider" : "providers"} × ${money(chosen.perProvider * factor)}`, value: price.providers * factor }] : []),
    ...(price.extraLocations ? [{ label: `${price.extraLocations} more ${price.extraLocations === 1 ? "location" : "locations"} × ${money(chosen.perLocation * factor)}`, value: price.locations * factor }] : []),
  ];

  const summary = (
    <div className="flex flex-col gap-[18px] p-[22px] rounded-[11px] bg-[#281910] text-[#FFFCF1]">
      <span className={`text-[24px] leading-[28px] tracking-[-0.02em] ${DISPLAY}`}>Your Doe</span>
      <div className="flex flex-col gap-[10px]">
        {[
          ["Practice", shapeLabel],
          ["Locations", String(locationCount)],
          ["Providers", `${providerCount}${step !== "practice" ? `, ${configured} ready` : ""}`],
          ["Plan", chosen.name],
        ].map(([k, v]) => (
          <span key={k} className="flex justify-between gap-[12px] text-[15px] leading-[20px]">
            <span className="text-[rgba(255,252,241,0.6)]">{k}</span>
            <span className="font-[500] text-right">{v}</span>
          </span>
        ))}
      </div>
      <span className="h-[1px] bg-[rgba(255,252,241,0.14)]" />
      <div className="flex flex-col gap-[8px]">
        {lines.map((l) => (
          <span key={l.label} className="flex justify-between gap-[12px] text-[14px] leading-[19px]">
            <span className="text-[rgba(255,252,241,0.7)]">{l.label}</span>
            <span className="[font-variant-numeric:tabular-nums]">{money(l.value)}</span>
          </span>
        ))}
      </div>
      <span className="flex items-baseline justify-between gap-[12px]">
        <span className="text-[15px] leading-[20px] text-[rgba(255,252,241,0.7)]">{annual ? "Per month, billed yearly" : "Per month"}</span>
        <span className={`text-[44px] leading-[46px] tracking-[-0.035em] ${DISPLAY} [font-variant-numeric:tabular-nums]`}>{money(price.total * factor)}</span>
      </span>
      <button
        type="button"
        disabled={cta.disabled}
        onClick={cta.onClick}
        className="h-[50px] rounded-[999px] bg-[#FCCFB8] hover:bg-[#F8C2A8] disabled:bg-[rgba(255,252,241,0.14)] disabled:text-[rgba(255,252,241,0.5)] text-[16px] leading-[20px] font-[500] text-[#140C04] transition-colors duration-150"
      >
        {cta.label}
      </button>
    </div>
  );

  const stepNav = (
    <div className={`flex items-center gap-[6px] ${phone ? "overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-[2px] px-[2px]" : ""}`}>
      {STEPS.map((s, i) => {
        const on = s.id === step;
        const past = i < stepIndex;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => go(s.id)}
            className={`flex shrink-0 items-center gap-[8px] h-[40px] pl-[6px] pr-[16px] rounded-[999px] text-[15px] leading-[20px] font-[500] transition-colors duration-150 ${on ? "bg-[#281910] text-[#FFFCF1]" : "bg-[#F4EEDF] text-[#281910] hover:bg-[#EFE7D4]"}`}
          >
            <span className={`w-[28px] h-[28px] flex items-center justify-center rounded-[999px] text-[13px] ${on ? "bg-[#FCCFB8] text-[#140C04]" : past ? "bg-[#DCE5D0] text-[#2F3B2A]" : "bg-[#FFFCF1] text-[#281910]"}`}>
              {past ? (
                <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
                  <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                i + 1
              )}
            </span>
            {s.label}
          </button>
        );
      })}
    </div>
  );

  const back =
    stepIndex > 0 && !done ? (
      <button type="button" onClick={() => go(STEPS[stepIndex - 1]!.id)} className={`self-start flex items-center gap-[6px] h-[40px] px-[4px] text-[15px] leading-[20px] font-[500] ${SUB} hover:text-[#281910]`}>
        <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
          <path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back
      </button>
    ) : null;

  if (phone) {
    return (
      <div ref={topRef} className="flex flex-col gap-[22px] scroll-mt-[120px] pb-[120px]">
        {stepNav}
        {body}
        {back}
        <div className="fixed left-[10px] right-[10px] bottom-[max(10px,env(safe-area-inset-bottom))] z-40 flex items-center gap-[12px] p-[10px] pl-[18px] rounded-[18px] bg-[#281910] text-[#FFFCF1]">
          <span className="flex flex-col grow min-w-[0px]">
            <span className={`text-[26px] leading-[28px] tracking-[-0.03em] ${DISPLAY} [font-variant-numeric:tabular-nums]`}>
              {money(price.total * factor)}
              <span className="text-[13px] tracking-normal font-sans text-[rgba(255,252,241,0.65)]"> /mo</span>
            </span>
            <span className="truncate text-[12px] leading-[16px] text-[rgba(255,252,241,0.65)]">
              {chosen.name} · {providerCount} providers · {locationCount} {locationCount === 1 ? "location" : "locations"}
            </span>
          </span>
          <button
            type="button"
            disabled={cta.disabled}
            onClick={cta.onClick}
            className="h-[46px] px-[18px] shrink-0 rounded-[999px] bg-[#FCCFB8] disabled:bg-[rgba(255,252,241,0.14)] disabled:text-[rgba(255,252,241,0.5)] text-[15px] leading-[20px] font-[500] text-[#140C04]"
          >
            {step === "start" ? cta.label : "Continue"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={topRef} className="grid grid-cols-[minmax(0,1fr)_360px] gap-[40px] items-start scroll-mt-[140px]">
      <div className="flex flex-col gap-[28px] min-w-[0px]">
        {stepNav}
        {body}
        {back}
      </div>
      <div className="sticky top-[150px]">{summary}</div>
    </div>
  );
}
