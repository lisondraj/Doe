"use client";

/**
 * /demo/clinic Integrations — link Doe to the clinic's own software. Pick the EMR or practice-management system from
 * the dropdown (Canadian and US systems clinics actually run, shown with their own icons), watch Doe link to it, and
 * choose which primitives flow between them: availability, appointments, patients, forms, payments, messages,
 * coverage and referrals. The diagram draws one live line per linked primitive, in the direction its data moves.
 * The selection is a demo setting kept in this browser; nothing connects to the vendor.
 */
import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { HalftoneDisc } from "@/components/doehealth-product/DoeHealthProductHalftone";
import { Card, CardTitle, PageTitle, Switch, Tag } from "@/components/demo/DemoClinicUi";
import type { ClinicStatePayload } from "@/lib/demo/demo-service";
import { lora } from "@/lib/home/fonts";

type PrimitiveId = "availability" | "appointments" | "patients" | "forms" | "payments" | "messages" | "coverage" | "referrals";
type Direction = "in" | "out" | "both";

type Primitive = {
  id: PrimitiveId;
  name: string;
  short: string;
  detail: string;
  /** The FHIR resource the primitive maps to; vendors with their own APIs map to the same shape. */
  resource: string;
  /** in: the clinic's software to Doe. out: Doe to the clinic's software. */
  direction: Direction;
  map: [string, string][];
  icon: ReactNode;
};

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const PRIMITIVES: Primitive[] = [
  {
    id: "availability",
    name: "Availability",
    short: "Slots",
    detail: "Open slots from each provider's schedule, so agents only ever offer real times.",
    resource: "Slot · Schedule",
    direction: "in",
    map: [
      ["availability[].slots[].time", "Slot.start"],
      ["slots[].provider", "Schedule.actor (Practitioner)"],
      ["slot status", "Slot.status (free / busy)"],
    ],
    icon: (
      <>
        <rect x="3.5" y="5" width="17" height="15" rx="3" {...stroke} />
        <path d="M3.5 10h17M8 3v4M16 3v4" {...stroke} />
      </>
    ),
  },
  {
    id: "appointments",
    name: "Appointments",
    short: "Bookings",
    detail: "Confirmed agent bookings land on the clinic's calendar; holds show as tentative.",
    resource: "Appointment",
    direction: "out",
    map: [
      ["booking.slotId", "Appointment.slot"],
      ["booking.label", "Appointment.serviceType"],
      ["booking.status", "Appointment.status (booked / proposed)"],
      ["userName", "Appointment.participant (Patient)"],
    ],
    icon: (
      <>
        <rect x="3.5" y="5" width="17" height="15" rx="3" {...stroke} />
        <path d="M3.5 10h17M8 3v4M16 3v4M9 15l2 2 4-4" {...stroke} />
      </>
    ),
  },
  {
    id: "patients",
    name: "Patient records",
    short: "Patients",
    detail: "Match the agent's user to an existing chart, or create one from the intake.",
    resource: "Patient",
    direction: "both",
    map: [
      ["forms.intake.name", "Patient.name"],
      ["forms.intake.dob", "Patient.birthDate"],
      ["forms.intake.phone", "Patient.telecom"],
      ["consent.phi", "Consent (PHI via Doe)"],
    ],
    icon: (
      <>
        <circle cx="12" cy="8.5" r="3.5" {...stroke} />
        <path d="M5 20c.9-3.6 3.6-5.5 7-5.5s6.1 1.9 7 5.5" {...stroke} />
      </>
    ),
  },
  {
    id: "forms",
    name: "Intake and assessments",
    short: "Forms",
    detail: "Intake, ID-Migraine, MIDAS, HIT-6, ICHD-3 and the signed consent, filed to the chart.",
    resource: "QuestionnaireResponse",
    direction: "out",
    map: [
      ["forms.assessments.midas", "QuestionnaireResponse (MIDAS)"],
      ["forms.assessments.hit6", "QuestionnaireResponse (HIT-6)"],
      ["forms.signedBy", "DocumentReference (signed consent)"],
    ],
    icon: (
      <>
        <rect x="5" y="3.5" width="14" height="17" rx="3" {...stroke} />
        <path d="M8.5 8.5h7M8.5 12h7M8.5 15.5h4" {...stroke} />
      </>
    ),
  },
  {
    id: "payments",
    name: "Payments",
    short: "Payments",
    detail: "Private-pay prices, negotiated deals and deposits post as invoices.",
    resource: "Invoice · ChargeItem",
    direction: "out",
    map: [
      ["pricing.total", "Invoice.totalGross"],
      ["pricing.deal", "ChargeItem.priceOverride"],
      ["pricing.label", "ChargeItem.code"],
    ],
    icon: (
      <>
        <rect x="3.5" y="6" width="17" height="12.5" rx="3.5" {...stroke} />
        <path d="M3.5 10.5h17M7.5 14.8h3" {...stroke} />
      </>
    ),
  },
  {
    id: "messages",
    name: "Messages",
    short: "Messages",
    detail: "Agent threads appear in the clinic's inbox, and staff replies go back to the agent.",
    resource: "Communication",
    direction: "both",
    map: [
      ["threads.concierge[]", "Communication (category: concierge)"],
      ["threads.negotiate[]", "Communication (category: billing)"],
      ["message.by = staff", "Communication.sender (Practitioner)"],
    ],
    icon: (
      <>
        <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h7A2.5 2.5 0 0 1 16 6.5v4a2.5 2.5 0 0 1-2.5 2.5H9l-3.5 3v-3A1.5 1.5 0 0 1 4 11.5z" {...stroke} />
        <path d="M19 9.5a1.5 1.5 0 0 1 1 1.4v4.6a1.5 1.5 0 0 1-1.5 1.5H18v3l-3.5-3H12" {...stroke} />
      </>
    ),
  },
  {
    id: "coverage",
    name: "Coverage and billing",
    short: "Coverage",
    detail: "Provincial health cards in Canada, insurance eligibility in the US, checked before booking.",
    resource: "Coverage · CoverageEligibility",
    direction: "in",
    map: [
      ["forms.intake.healthCard", "Coverage.subscriberId"],
      ["province / payer", "Coverage.payor"],
      ["eligibility", "CoverageEligibilityResponse"],
    ],
    icon: (
      <>
        <path d="M12 3.8l6.8 2.6v5.1c0 4.2-2.8 7.4-6.8 8.8-4-1.4-6.8-4.6-6.8-8.8V6.4z" {...stroke} />
        <path d="M9.2 12.2l2 2 3.8-4" {...stroke} />
      </>
    ),
  },
  {
    id: "referrals",
    name: "Referrals",
    short: "Referrals",
    detail: "Referrals and faxed requisitions reach Doe, so agents can book referred patients.",
    resource: "ServiceRequest",
    direction: "in",
    map: [
      ["ServiceRequest.requester", "referral.from"],
      ["ServiceRequest.reasonCode", "referral.reason"],
      ["ServiceRequest.subject", "referral.patient"],
    ],
    icon: <path d="M4 8.5h14M14.5 5l3.5 3.5-3.5 3.5M20 15.5H6M9.5 12L6 15.5 9.5 19" {...stroke} />,
  },
];

const ALL: PrimitiveId[] = PRIMITIVES.map((p) => p.id);

type Vendor = {
  id: string;
  name: string;
  /** Products or the vendor behind the name. */
  sub: string;
  country: "CA" | "US";
  kind: string;
  /** How Doe would link to it. */
  via: string;
  supports: PrimitiveId[];
};

const without = (...ids: PrimitiveId[]) => ALL.filter((id) => !ids.includes(id));

/** Clinic software in wide use in Canada and the US. Capabilities are illustrative for the demo. */
const VENDORS: Vendor[] = [
  { id: "jane", name: "Jane", sub: "Jane App", country: "CA", kind: "Practice management", via: "Jane partner API", supports: ["availability", "appointments", "patients", "forms", "payments", "messages"] },
  { id: "oscar", name: "OSCAR Pro", sub: "WELL Health", country: "CA", kind: "EMR", via: "OSCAR REST API", supports: ["availability", "appointments", "patients", "forms", "coverage", "referrals"] },
  { id: "accuro", name: "Accuro EMR", sub: "QHR Technologies", country: "CA", kind: "EMR", via: "Accuro API", supports: without("payments") },
  { id: "telus", name: "TELUS Health", sub: "PS Suite · Med Access · CHR", country: "CA", kind: "EMR", via: "TELUS Health partner API", supports: ["availability", "appointments", "patients", "forms", "coverage", "referrals"] },
  { id: "juvonno", name: "Juvonno", sub: "Clinic management", country: "CA", kind: "Practice management", via: "Juvonno API", supports: ["availability", "appointments", "patients", "forms", "payments", "coverage"] },
  { id: "cliniko", name: "Cliniko", sub: "Practice management", country: "CA", kind: "Practice management", via: "Cliniko REST API", supports: ["availability", "appointments", "patients", "forms", "payments"] },
  { id: "epic", name: "Epic", sub: "Epic Systems", country: "US", kind: "EHR", via: "FHIR R4 · SMART on FHIR", supports: ALL },
  { id: "oracle", name: "Oracle Health", sub: "Cerner Millennium", country: "US", kind: "EHR", via: "FHIR R4 · Millennium", supports: without("payments") },
  { id: "athena", name: "athenaOne", sub: "athenahealth", country: "US", kind: "EHR and billing", via: "athenaOne API · FHIR R4", supports: ALL },
  { id: "ecw", name: "eClinicalWorks", sub: "eCW", country: "US", kind: "EHR", via: "FHIR R4", supports: without("payments") },
  { id: "nextgen", name: "NextGen", sub: "NextGen Healthcare", country: "US", kind: "EHR and billing", via: "NextGen Enterprise API", supports: without("referrals") },
  { id: "modmed", name: "ModMed", sub: "Modernizing Medicine", country: "US", kind: "Specialty EHR", via: "FHIR R4", supports: without("referrals", "messages") },
  { id: "drchrono", name: "DrChrono", sub: "EverHealth", country: "US", kind: "EHR and billing", via: "DrChrono REST API", supports: without("referrals") },
  { id: "elation", name: "Elation Health", sub: "Primary care EHR", country: "US", kind: "EHR", via: "Elation REST API", supports: without("payments", "coverage") },
  { id: "tebra", name: "Tebra", sub: "Kareo + PatientPop", country: "US", kind: "EHR and billing", via: "Tebra API", supports: ["availability", "appointments", "patients", "forms", "payments", "coverage"] },
  { id: "practicefusion", name: "Practice Fusion", sub: "Veradigm", country: "US", kind: "EHR", via: "FHIR R4", supports: ["availability", "appointments", "patients", "forms"] },
  { id: "simplepractice", name: "SimplePractice", sub: "Practice management", country: "US", kind: "Practice management", via: "Doe connector", supports: ["availability", "appointments", "patients", "forms", "payments"] },
  { id: "healthie", name: "Healthie", sub: "Virtual care platform", country: "US", kind: "EHR", via: "Healthie GraphQL API", supports: without("referrals") },
];

const COUNTRY = { CA: "Canada", US: "United States" } as const;
const STORE_KEY = "doe-clinic-integration";
const LINK_STEPS = ["Authorizing Doe", "Reading the schedule", "Mapping services and fields", "Linked"];
const STEP_MS = 650;

const logo = (v: Vendor) => `/demo/integrations/${v.id}.png`;

type Saved = { vendor: string | null; enabled: Partial<Record<PrimitiveId, boolean>>; linkedAt: number | null };
type Log = { at: number; text: string };

function Logo({ v, size = 40, className = "" }: { v: Vendor; size?: number; className?: string }) {
  return (
    <span className={`shrink-0 flex items-center justify-center rounded-[12px] bg-white overflow-hidden shadow-[inset_0_0_0_1px_rgba(40,25,16,0.08)] ${className}`} style={{ width: size, height: size }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- small static icons, no optimisation needed */}
      <img src={logo(v)} alt="" width={size * 0.72} height={size * 0.72} className="object-contain" style={{ width: size * 0.72, height: size * 0.72 }} />
    </span>
  );
}

const timeOf = (t: number) => new Date(t).toLocaleTimeString("en-CA", { hour: "numeric", minute: "2-digit", second: "2-digit" });

export function Integrations({ state, flash }: { state: ClinicStatePayload | null; flash: (t: string) => void }) {
  const [saved, setSaved] = useState<Saved>({ vendor: null, enabled: {}, linkedAt: null });
  const [loaded, setLoaded] = useState(false);
  /** -1 when idle; otherwise the step of the linking sequence on show. */
  const [step, setStep] = useState(-1);
  const [focus, setFocus] = useState<PrimitiveId>("appointments");
  const [log, setLog] = useState<Log[]>([]);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORE_KEY);
      if (raw) setSaved(JSON.parse(raw) as Saved);
    } catch {
      /* A bad saved value just starts fresh. */
    }
    setLoaded(true);
    return () => timers.current.forEach((t) => window.clearTimeout(t));
  }, []);
  useEffect(() => {
    if (loaded) window.localStorage.setItem(STORE_KEY, JSON.stringify(saved));
  }, [saved, loaded]);

  const vendor = VENDORS.find((v) => v.id === saved.vendor) ?? null;
  const linking = step >= 0 && step < LINK_STEPS.length - 1;
  const isOn = useCallback((id: PrimitiveId) => Boolean(vendor?.supports.includes(id) && saved.enabled[id] !== false), [vendor, saved.enabled]);
  const linked = vendor ? PRIMITIVES.filter((p) => isOn(p.id)) : [];

  const counts = useMemo(() => {
    const s = state?.sessions ?? [];
    return {
      slots: state ? state.availability.reduce((n, d) => n + d.slots.filter((x) => x.status === "open").length, 0) : 0,
      booked: s.filter((x) => x.booking.status === "confirmed").length,
      requested: s.filter((x) => x.booking.status === "requested").length,
      forms: s.filter((x) => x.forms.status === "sent").length,
      patients: s.length,
      messages: s.reduce((n, x) => n + x.threads.concierge.filter((m) => m.from !== "system").length + x.threads.negotiate.filter((m) => m.from !== "system").length, 0),
    };
  }, [state]);

  const note = (text: string) => setLog((l) => [{ at: Date.now(), text }, ...l].slice(0, 30));

  const link = (v: Vendor) => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setSaved((s) => ({ vendor: v.id, enabled: s.vendor === v.id ? s.enabled : {}, linkedAt: null }));
    setLog([]);
    setStep(0);
    LINK_STEPS.forEach((label, i) => {
      timers.current.push(
        window.setTimeout(() => {
          setStep(i);
          if (i === 1) note(`Authorized Doe with ${v.name} via ${v.via}`);
          if (i === 2) note(`Pulled ${counts.slots} open slots from ${v.name}`);
          if (i === LINK_STEPS.length - 1) {
            note(`Mapped 9 services and bundles to ${v.name} visit types`);
            note(`${v.name} linked · ${v.supports.length} primitives available`);
            setSaved((s) => ({ ...s, linkedAt: Date.now() }));
            flash(`${v.name} linked to Doe`);
          }
        }, i * STEP_MS),
      );
    });
  };

  const unlink = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    if (vendor) flash(`${vendor.name} disconnected`);
    setSaved({ vendor: null, enabled: {}, linkedAt: null });
    setStep(-1);
    setLog([]);
  };

  const toggle = (p: Primitive) => {
    if (!vendor || !vendor.supports.includes(p.id)) return;
    const on = !isOn(p.id);
    setSaved((s) => ({ ...s, enabled: { ...s.enabled, [p.id]: on } }));
    setFocus(p.id);
    note(`${on ? "Linked" : "Paused"} ${p.name.toLowerCase()} with ${vendor.name}`);
  };

  const syncNow = () => {
    if (!vendor) return;
    note(`Synced: ${counts.slots} open slots in, ${counts.booked} bookings and ${counts.forms} forms out`);
    setSaved((s) => ({ ...s, linkedAt: Date.now() }));
    flash(`Synced with ${vendor.name}`);
  };

  const status = !vendor ? "none" : linking ? "linking" : "linked";
  const focused = PRIMITIVES.find((p) => p.id === focus)!;
  const pending: Record<PrimitiveId, string> = {
    availability: `${counts.slots} open slots`,
    appointments: `${counts.booked} booked · ${counts.requested} requested`,
    patients: `${counts.patients} agent users`,
    forms: `${counts.forms} returned`,
    payments: `${counts.booked} invoices`,
    messages: `${counts.messages} messages`,
    coverage: "Checked at booking",
    referrals: "None waiting",
  };

  return (
    <>
      <PageTitle kicker="Connect Doe to the software your clinic runs on">Integrations</PageTitle>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-[10px] md:gap-[12px] mb-[10px] md:mb-[12px]">
        <Card tone="#F3EBD2" className="relative z-[5]">
          <CardTitle title="Clinic software" note="Your EMR or practice-management system" right={vendor && <Tag tone={status === "linked" ? "sage" : undefined}>{status === "linked" ? "Linked" : "Linking…"}</Tag>} />
          <VendorPicker value={vendor} onChange={(v) => v.id !== vendor?.id && link(v)} />
          {vendor ? (
            <div className="mt-[10px] flex flex-wrap items-center gap-[6px]">
              <Tag>{vendor.kind}</Tag>
              <Tag>{COUNTRY[vendor.country]}</Tag>
              <Tag tone="line">{vendor.via}</Tag>
              <span className="grow" />
              <button type="button" onClick={syncNow} disabled={linking} className="h-[36px] px-[14px] rounded-full bg-[#140C04] text-[#FFFCF1] text-[13px] font-[500] hover:bg-[#2B1D12] transition-colors duration-150 disabled:opacity-50">
                Sync Now
              </button>
              <button type="button" onClick={unlink} className="h-[36px] px-[14px] rounded-full bg-[#28191014] hover:bg-[#2819101F] text-[13px] font-[500] transition-colors duration-150">
                Disconnect
              </button>
            </div>
          ) : (
            <p className="mt-[10px] text-[13px] leading-[18px] text-[#2819109E]">Pick your system and Doe links to it. Agents then book against your real schedule, and everything they do lands in your charts.</p>
          )}
        </Card>

        <Card tone="#FAF6EC">
          <CardTitle
            title="Sync"
            note={vendor && saved.linkedAt ? `Last synced ${timeOf(saved.linkedAt)}` : vendor ? LINK_STEPS[Math.max(0, step)] : "Nothing linked yet"}
            right={vendor && <Tag>{linked.length} of {vendor.supports.length} on</Tag>}
          />
          {linking ? (
            <ol className="flex flex-col gap-[6px]">
              {LINK_STEPS.slice(0, -1).map((s, i) => (
                <li key={s} className={`flex items-center gap-[10px] h-[36px] px-[12px] rounded-[12px] text-[13.5px] font-[500] transition-colors duration-200 ${i < step ? "bg-[#E3E9D9] text-[#2F3B2A]" : i === step ? "bg-[#FFFCF1] text-[#281910]" : "text-[#28191066]"}`}>
                  <span className={`w-[8px] h-[8px] rounded-full ${i < step ? "bg-[#4E7A3E]" : i === step ? "bg-[#E8A585] doe-ripple" : "bg-[#2819101F]"}`} />
                  {s}
                </li>
              ))}
            </ol>
          ) : (
            <div className="flex flex-col gap-[2px] rounded-[14px] bg-[#FFFCF1CC] p-[6px] max-h-[150px] overflow-y-auto overscroll-contain">
              {log.length === 0 && <p className="p-[8px] text-[13px] text-[#2819109E]">{vendor ? `${vendor.name} is linked. Use Sync Now to pull the latest.` : "Sync activity shows here."}</p>}
              {log.map((l, i) => (
                <div key={`${l.at}-${i}`} className="grid grid-cols-[86px_minmax(0,1fr)] gap-[8px] px-[8px] py-[5px] text-[12.5px] leading-[17px]">
                  <span className="font-mono text-[11px] leading-[17px] text-[#28191080]">{timeOf(l.at)}</span>
                  <span className="text-[#281910CC]">{l.text}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <LinkDiagram vendor={vendor} linked={linked} linking={linking} focus={focus} onFocus={setFocus} />

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-[10px] md:gap-[12px] mt-[10px] md:mt-[12px] items-start">
        <Card tone="#F4EEDF" className="!p-[6px]">
          <div className="px-[12px] pt-[10px] pb-[6px]">
            <CardTitle title="Primitives" note={vendor ? `What flows between Doe and ${vendor.name}` : "Pick your software to choose what links"} />
          </div>
          <div className="flex flex-col gap-[4px]">
            {PRIMITIVES.map((p) => {
              const supported = Boolean(vendor?.supports.includes(p.id));
              const on = isOn(p.id);
              return (
                <div
                  key={p.id}
                  className={`flex items-center gap-[12px] min-h-[68px] p-[10px_12px] md:p-[12px_14px] rounded-[18px] transition-colors duration-150 ${supported ? "bg-[#FFFCF1]" : "bg-[#FFFCF180]"} ${focus === p.id ? "outline outline-[1.5px] -outline-offset-[1.5px] outline-[#140C04]" : ""}`}
                >
                  <button type="button" onClick={() => setFocus(p.id)} className="flex items-center gap-[12px] grow min-w-0 text-left">
                    <span className={`w-[38px] h-[38px] shrink-0 flex items-center justify-center rounded-[12px] ${on ? "bg-[#140C04] text-[#FFFCF1]" : "bg-[#F4EEDF] text-[#281910]"}`}>
                      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                        {p.icon}
                      </svg>
                    </span>
                    <span className="grow min-w-0">
                      <span className={`flex items-center gap-[8px] text-[14.5px] leading-[19px] font-[600] ${supported ? "" : "text-[#2819109E]"}`}>
                        <span className="truncate">{p.name}</span>
                        <span className="hidden sm:inline shrink-0 font-mono text-[10.5px] font-[500] text-[#28191080]">{p.resource}</span>
                      </span>
                      <span className="block text-[12.5px] leading-[17px] text-[#2819109E] line-clamp-2">
                        {!vendor ? p.detail : !supported ? `Not offered by ${vendor.name}` : on ? `${DIRECTION[p.direction]} · ${pending[p.id]}` : p.detail}
                      </span>
                    </span>
                  </button>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={on}
                    aria-label={`${p.name} ${on ? "on" : "off"}`}
                    disabled={!supported || linking}
                    onClick={() => toggle(p)}
                    className="shrink-0 p-[6px] -m-[6px] disabled:opacity-40"
                  >
                    <Switch on={on} />
                  </button>
                </div>
              );
            })}
          </div>
        </Card>

        <Card tone="#FAF6EC" className="lg:sticky lg:top-[30px]">
          <CardTitle title={focused.name} note={`${DIRECTION[focused.direction]} · FHIR ${focused.resource}`} right={<DirectionTag d={focused.direction} />} />
          <p className="text-[13.5px] leading-[19px] text-[#281910CC] mb-[12px]">{focused.detail}</p>
          <div className="flex flex-col gap-[4px] rounded-[16px] bg-[#FFFCF1CC] p-[6px]">
            <div className="grid grid-cols-[minmax(0,1fr)_20px_minmax(0,1fr)] gap-[8px] px-[8px] pt-[4px] pb-[2px] text-[11px] font-[600] uppercase tracking-[0.06em] text-[#28191080]">
              <span>Doe</span>
              <span />
              <span className="truncate">{vendor?.name ?? "Your software"}</span>
            </div>
            {focused.map.map(([a, b]) => (
              <div key={a} className="grid grid-cols-[minmax(0,1fr)_20px_minmax(0,1fr)] items-center gap-[8px] px-[8px] py-[7px] rounded-[10px] odd:bg-[#F4EEDF80]">
                <span className="font-mono text-[11.5px] leading-[16px] break-words">{a}</span>
                <span className="text-center text-[#2819109E]">{focused.direction === "in" ? "←" : focused.direction === "out" ? "→" : "↔"}</span>
                <span className="font-mono text-[11.5px] leading-[16px] break-words">{b}</span>
              </div>
            ))}
          </div>
          <p className="mt-[12px] text-[11.5px] leading-[16px] text-[#28191080]">
            Demo only. Vendor names and icons belong to their owners and are shown to identify the software; capabilities are illustrative, and no data leaves this demo.
          </p>
        </Card>
      </div>
    </>
  );
}

const DIRECTION: Record<Direction, string> = { in: "Into Doe", out: "Into your software", both: "Both ways" };

function DirectionTag({ d }: { d: Direction }) {
  return <Tag tone={d === "both" ? "sage" : d === "out" ? "salmon" : undefined}>{d === "in" ? "← In" : d === "out" ? "Out →" : "↔ Both"}</Tag>;
}

/** Doe on the left, the clinic's software on the right, and one moving line per linked primitive between them. */
function LinkDiagram({
  vendor,
  linked,
  linking,
  focus,
  onFocus,
}: {
  vendor: Vendor | null;
  linked: Primitive[];
  linking: boolean;
  focus: PrimitiveId;
  onFocus: (id: PrimitiveId) => void;
}) {
  const rows = vendor && !linking ? linked : [];
  return (
    <div className="relative overflow-hidden rounded-[24px] md:rounded-[28px] bg-[#140C04] p-[14px] md:p-[22px]">
      <HalftoneDisc size={260} step={8} color="#E8A585" opacity={0.12} className="absolute left-[-90px] bottom-[-120px]" />
      <HalftoneDisc size={220} step={8} color="#C2A987" opacity={0.1} className="absolute right-[-70px] top-[-90px]" />
      <div className="relative grid grid-cols-[64px_minmax(0,1fr)_64px] sm:grid-cols-[120px_minmax(0,1fr)_120px] md:grid-cols-[170px_minmax(0,1fr)_170px] items-center gap-[8px] md:gap-[14px] min-h-[220px]">
        <Node label="Doe" sub="Agents and inbox">
          <span className={`${lora.className} text-[28px] md:text-[34px] leading-none font-[600] text-[#140C04]`}>D</span>
        </Node>

        <div className="flex flex-col justify-center gap-[6px] md:gap-[8px] min-w-0 py-[6px]">
          {!vendor && <Line state="idle" label="Pick your clinic software above" />}
          {vendor && linking && <Line state="linking" label={`Linking ${vendor.name}…`} />}
          {vendor && !linking && rows.length === 0 && <Line state="idle" label="Turn on a primitive below" />}
          {rows.map((p) => (
            <Line key={p.id} state="live" direction={p.direction} label={p.short} icon={p.icon} active={focus === p.id} onClick={() => onFocus(p.id)} />
          ))}
        </div>

        {vendor ? (
          <Node label={vendor.name} sub={vendor.kind} linked={!linking}>
            <Logo v={vendor} size={48} className="md:!w-[60px] md:!h-[60px]" />
          </Node>
        ) : (
          <Node label="Your software" sub="Not linked" empty>
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 5v14M5 12h14" fill="none" stroke="#FFFCF180" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </Node>
        )}
      </div>
    </div>
  );
}

function Node({ label, sub, children, linked, empty }: { label: string; sub: string; children: ReactNode; linked?: boolean; empty?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-[8px] text-center min-w-0">
      <span
        className={`relative flex items-center justify-center w-[56px] h-[56px] md:w-[84px] md:h-[84px] rounded-[18px] md:rounded-[24px] ${empty ? "border-[1.5px] border-dashed border-[#FFFCF140]" : "bg-[#FFFCF1]"}`}
      >
        {children}
        {linked && <span className="absolute -right-[3px] -bottom-[3px] w-[16px] h-[16px] rounded-full bg-[#9DBF8A] border-[3px] border-solid border-[#140C04]" />}
      </span>
      <span className="flex flex-col min-w-0 max-w-full">
        <span className="truncate text-[12.5px] md:text-[14px] leading-[17px] font-[600] text-[#FFFCF1]">{label}</span>
        <span className="hidden sm:block truncate text-[11.5px] md:text-[12px] leading-[15px] text-[#FFFCF180]">{sub}</span>
      </span>
    </div>
  );
}

function Line({
  state,
  label,
  direction = "both",
  icon,
  active,
  onClick,
}: {
  state: "idle" | "linking" | "live";
  label: string;
  direction?: Direction;
  icon?: ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  const color = state === "live" ? (active ? "#FCCFB8" : "#E8A585") : "#FFFCF140";
  const flow = state !== "idle";
  const dash = (reverse: boolean, y: number) => (
    <line
      x1="0"
      y1={y}
      x2="100%"
      y2={y}
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray="2 5"
      className={flow ? "doe-flow" : undefined}
      style={reverse ? { animationDirection: "reverse" } : undefined}
    />
  );
  return (
    <button type="button" onClick={onClick} disabled={!onClick} className="relative flex items-center justify-center h-[32px] md:h-[34px] min-w-0 disabled:cursor-default doe-menu-in">
      <svg className="absolute inset-x-0 top-1/2 -translate-y-1/2 w-full h-[10px] overflow-visible" aria-hidden="true">
        {direction === "both" ? (
          <>
            {dash(false, 2)}
            {dash(true, 8)}
          </>
        ) : (
          dash(direction === "in", 5)
        )}
      </svg>
      <span
        className={`relative flex items-center gap-[6px] h-[28px] md:h-[30px] px-[10px] md:px-[12px] rounded-full text-[11.5px] md:text-[12.5px] font-[600] whitespace-nowrap max-w-full transition-colors duration-150 ${
          state === "live" ? (active ? "bg-[#FCCFB8] text-[#140C04]" : "bg-[#2A1C12] text-[#FFFCF1] hover:bg-[#3A2920]") : "bg-[#140C04] text-[#FFFCF199] border border-solid border-[#FFFCF126]"
        }`}
      >
        {state === "linking" && <span className="w-[6px] h-[6px] rounded-full bg-[#E8A585] doe-ripple" />}
        {icon && (
          <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" className="hidden sm:block shrink-0">
            {icon}
          </svg>
        )}
        <span className="truncate">{label}</span>
        {state === "live" && <span className="hidden md:inline opacity-60">{direction === "in" ? "←" : direction === "out" ? "→" : "↔"}</span>}
      </span>
    </button>
  );
}

/** The software dropdown: grouped by country, searchable, each system shown with its own icon. */
function VendorPicker({ value, onChange }: { value: Vendor | null; onChange: (v: Vendor) => void }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const box = useRef<HTMLDivElement>(null);
  const search = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !box.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    if (window.matchMedia("(pointer: fine)").matches) search.current?.focus();
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const term = q.trim().toLowerCase();
  const list = VENDORS.filter((v) => !term || `${v.name} ${v.sub} ${v.kind} ${COUNTRY[v.country]}`.toLowerCase().includes(term));

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center gap-[12px] min-h-[64px] p-[10px_14px_10px_10px] rounded-[18px] bg-[#FFFCF1] text-left border-[1.5px] border-solid transition-colors duration-150 ${open ? "border-[#140C04]" : "border-transparent hover:border-[#28191026]"}`}
      >
        {value ? (
          <Logo v={value} size={44} />
        ) : (
          <span className="w-[44px] h-[44px] shrink-0 rounded-[12px] border-[1.5px] border-dashed border-[#28191033]" />
        )}
        <span className="grow min-w-0">
          <span className="block truncate text-[15px] leading-[20px] font-[600]">{value?.name ?? "Choose your clinic software"}</span>
          <span className="block truncate text-[12.5px] leading-[17px] text-[#2819109E]">{value ? `${value.sub} · ${COUNTRY[value.country]}` : `${VENDORS.length} systems in Canada and the US`}</span>
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0 transition-transform duration-200" style={{ transform: open ? "rotate(180deg)" : "none" }}>
          <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="doe-menu-in absolute left-0 right-0 top-[calc(100%+6px)] z-30 flex flex-col p-[6px] rounded-[22px] bg-[#FFFCF1] border border-solid border-[#2819101F] shadow-[0_24px_60px_-24px_rgba(40,25,16,0.45)]">
          <label className="flex items-center gap-[8px] h-[42px] mx-[2px] mb-[4px] px-[14px] rounded-full bg-[#F4EEDF] text-[#2819109E]">
            <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
              <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M16 16l4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              ref={search}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search Epic, Jane, OSCAR…"
              className="grow min-w-0 bg-transparent outline-none text-[16px] md:text-[14px] font-[500] text-[#281910] placeholder:text-[#2819109E]"
            />
          </label>
          <div role="listbox" aria-label="Clinic software" className="max-h-[min(420px,55dvh)] overflow-y-auto overscroll-contain">
            {list.length === 0 && <p className="p-[14px] text-[13px] text-[#2819109E]">No match. Doe can also link through FHIR R4 or HL7 v2.</p>}
            {(["CA", "US"] as const).map((c) => {
              const group = list.filter((v) => v.country === c);
              if (!group.length) return null;
              return (
                <div key={c} className="flex flex-col">
                  <span className="sticky top-0 z-[1] px-[12px] pt-[10px] pb-[6px] bg-[#FFFCF1] text-[11px] font-[600] uppercase tracking-[0.08em] text-[#28191080]">{COUNTRY[c]}</span>
                  {group.map((v) => {
                    const selected = v.id === value?.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        role="option"
                        aria-selected={selected}
                        onClick={() => {
                          onChange(v);
                          setOpen(false);
                          setQ("");
                        }}
                        className={`flex items-center gap-[12px] min-h-[58px] px-[8px] rounded-[14px] text-left transition-colors duration-150 ${selected ? "bg-[#F4EEDF]" : "hover:bg-[#F4EEDF99]"}`}
                      >
                        <Logo v={v} size={40} />
                        <span className="grow min-w-0">
                          <span className="block truncate text-[14px] leading-[18px] font-[600]">{v.name}</span>
                          <span className="block truncate text-[12px] leading-[16px] text-[#2819109E]">
                            {v.sub} · {v.via}
                          </span>
                        </span>
                        <span className={`w-[20px] h-[20px] shrink-0 flex items-center justify-center rounded-full ${selected ? "bg-[#140C04]" : "border-[1.5px] border-solid border-[#28191033]"}`}>
                          {selected && (
                            <svg width="11" height="11" viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#FFFCF1" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

