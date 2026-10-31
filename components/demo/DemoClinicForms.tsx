"use client";

/**
 * /demo/clinic Forms library, in /doehealthproduct's Forms layout: the forms patients' agents fill in at /demo, grouped
 * on the left (Intake, Assessments, Consent), the open form's fields in the middle, and on the right how agents send
 * and complete it, where it lands, and who has sent it back. The forms are the real ones /demo uses (intake fields,
 * ID-Migraine, MIDAS, HIT-6, ICHD-3 and the Botox consent), and the returns come from live agent sessions.
 */
import { type ReactNode, useEffect, useMemo, useState } from "react";

import { AgentAvatar } from "@/components/demo/DemoClinicLive";
import { DISPLAY } from "@/components/demo/DemoFrame";
import { ASSESSMENTS } from "@/lib/demo/demo-assessments";
import { CLINIC, INTAKE_FIELDS } from "@/lib/demo/demo-clinic";
import type { ClinicStatePayload } from "@/lib/demo/demo-service";

type Session = ClinicStatePayload["sessions"][number];
const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

type FieldType = "text" | "date" | "yesno" | "choice" | "days" | "scale" | "upload" | "signature";
const TYPES: Record<FieldType, { label: string; tone: string }> = {
  text: { label: "Short answer", tone: "#EEEADF" },
  date: { label: "Date", tone: "#F3E7C9" },
  yesno: { label: "Yes / No", tone: "#E9DCC7" },
  choice: { label: "Choice", tone: "#E3E9D9" },
  days: { label: "Days", tone: "#F3E7C9" },
  scale: { label: "Scale 0–10", tone: "#F6DED0" },
  upload: { label: "Upload", tone: "#F7DCCB" },
  signature: { label: "Signature", tone: "#FCCFB8" },
};

type Field = { id: string; type: FieldType; label: string; detail?: string; options?: string[]; required: boolean; agent: boolean };
type Category = "Intake" | "Assessments" | "Consent";
const CATEGORIES: Category[] = ["Intake", "Assessments", "Consent"];
type Send = "booking" | "before" | "manual";
type Dest = "chart" | "inbox";

type Form = {
  id: string;
  name: string;
  sub: string;
  category: Category;
  tile: string;
  fields: Field[];
  /** Whether a session has sent this form back, and whether it has started it. */
  done: (s: Session) => boolean;
  started: (s: Session) => boolean;
  defaults: { send: Send; review: boolean; dest: Dest };
};

const INTAKE_TYPE: Record<string, FieldType> = { dob: "date", pregnant: "yesno", neuro: "yesno" };
const CONSENT_TEXT = `I consent to onabotulinumtoxinA (Botox) injections for chronic migraine by ${CLINIC.doctor} or a clinic provider. The benefits, risks and alternatives have been explained to me, including neck pain, eyelid droop and temporary weakness, and I may withdraw consent at any time.`;
const agentUploads = (s: Session) => (s.forms.uploads ?? []).filter((u) => u.by === "agent").length;

const FORMS: Form[] = [
  {
    id: "intake",
    name: "New patient intake",
    sub: "About you, headache history and safety",
    category: "Intake",
    tile: "#FCCFB8",
    fields: INTAKE_FIELDS.filter((f) => f.id !== "consent").map((f) => ({
      id: f.id,
      type: INTAKE_TYPE[f.id] ?? "text",
      label: f.label,
      detail: f.section,
      required: !["allergies", "acute"].includes(f.id),
      agent: true,
    })),
    done: (s) => s.forms.status === "sent",
    started: (s) => INTAKE_FIELDS.some((f) => f.id !== "consent" && f.id !== "name" && s.forms.intake[f.id]?.trim()),
    defaults: { send: "booking", review: true, dest: "chart" },
  },
  {
    id: "uploads",
    name: "Supporting documents",
    sub: "Diary, referral and past prescriptions",
    category: "Intake",
    tile: "#F7DCCB",
    fields: [
      { id: "diary", type: "upload", label: "Migraine diary, last 30 days", detail: "Text, PDF or a photo", required: false, agent: true },
      { id: "referral", type: "upload", label: "Referral letter", required: false, agent: true },
      { id: "rx", type: "upload", label: "Past prescriptions", required: false, agent: true },
    ],
    done: (s) => agentUploads(s) > 0,
    started: (s) => agentUploads(s) > 0,
    defaults: { send: "booking", review: true, dest: "chart" },
  },
  ...ASSESSMENTS.map(
    (a): Form => ({
      id: a.id,
      name: a.name,
      sub: `${a.full} · ${a.window}`,
      category: "Assessments",
      tile: "#E3E9D9",
      fields: a.questions.map((q) => ({
        id: q.id,
        type: q.kind === "choice" ? (q.options.length === 2 ? "yesno" : "choice") : q.kind,
        label: q.prompt,
        detail: q.kind === "days" ? `0 to ${q.max} days` : q.kind === "scale" ? "0 no pain, 10 worst imaginable" : undefined,
        options: q.kind === "choice" && q.options.length > 2 ? q.options.map((o) => o.label) : undefined,
        required: true,
        agent: true,
      })),
      done: (s) => Boolean(s.scores.find((x) => x.id === a.id)?.complete),
      started: (s) => Object.keys(s.forms.assessments[a.id] ?? {}).length > 0,
      defaults: { send: "booking", review: false, dest: "chart" },
    }),
  ),
  {
    id: "consent",
    name: "Consent to Botox treatment",
    sub: "Signed by the patient",
    category: "Consent",
    tile: "#E9DCC7",
    fields: [
      { id: "statement", type: "yesno", label: "Understands benefits, risks and alternatives", detail: CONSENT_TEXT, required: true, agent: false },
      { id: "signature", type: "signature", label: "Signature of patient", required: true, agent: false },
      { id: "date", type: "date", label: "Date signed", required: true, agent: true },
    ],
    done: (s) => Boolean(s.forms.signedBy),
    started: (s) => Boolean(s.forms.signedBy),
    defaults: { send: "booking", review: true, dest: "chart" },
  },
];

const SEND_OPTIONS: { id: Send; label: string }[] = [
  { id: "booking", label: "On booking" },
  { id: "before", label: "Day before" },
  { id: "manual", label: "When asked" },
];
const DEST_OPTIONS: { id: Dest; label: string }[] = [
  { id: "chart", label: "Chart" },
  { id: "inbox", label: "Inbox" },
];
const STORE = "doe-clinic-forms";
type Prefs = Record<string, { send?: Send; review?: boolean; dest?: Dest; agent?: Record<string, boolean>; required?: Record<string, boolean> }>;

function Toggle({ on, onChange, label, small }: { on: boolean; onChange: () => void; label: string; small?: boolean }) {
  const w = small ? 36 : 46;
  const h = small ? 22 : 28;
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={onChange} className={`relative shrink-0 rounded-full transition-colors duration-200 ${on ? "bg-[#140C04]" : "bg-[#E1D9C8]"}`} style={{ width: w, height: h }}>
      <span className="absolute top-[3px] left-[3px] rounded-full bg-[#FFFCF1]" style={{ width: h - 6, height: h - 6, transform: `translateX(${on ? w - h : 0}px)`, transition: `transform 260ms ${EASE}` }} />
    </button>
  );
}

function Slide<T extends string>({ value, options, onChange }: { value: T; options: { id: T; label: string }[]; onChange: (v: T) => void }) {
  const index = options.findIndex((o) => o.id === value);
  return (
    <div className="relative grid h-[38px] p-[4px] rounded-full bg-[#EEEADF]" style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
      <span className="absolute top-[4px] bottom-[4px] rounded-full bg-[#FFFCF1]" style={{ left: 4, width: `calc((100% - 8px) / ${options.length})`, transform: `translateX(${index * 100}%)`, transition: `transform 300ms ${EASE}` }} />
      {options.map((o) => (
        <button key={o.id} type="button" onClick={() => onChange(o.id)} className={`relative rounded-full text-[13px] leading-[16px] font-[500] transition-colors duration-150 ${value === o.id ? "text-[#281910]" : "text-[#2819109E] hover:text-[#281910]"}`}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

function StepCard({ step, title, children }: { step: number; title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col shrink-0 gap-[12px] p-[16px] rounded-[18px] bg-[#FFFCF1]">
      <span className="flex items-center gap-[10px]">
        <span className={`w-[26px] h-[26px] shrink-0 flex items-center justify-center rounded-full bg-[#F4EEDF] text-[13px] leading-[16px] ${DISPLAY}`}>{step}</span>
        <span className="text-[16px] leading-[20px] font-[500]">{title}</span>
      </span>
      {children}
    </div>
  );
}

const when = (iso: string) => {
  const d = new Date(iso);
  const today = new Date().toDateString() === d.toDateString();
  return today ? d.toLocaleTimeString("en-CA", { hour: "numeric", minute: "2-digit" }) : d.toLocaleDateString("en-CA", { month: "short", day: "numeric" });
};

export function FormsLibrary({ sessions, onOpenReturn }: { sessions: Session[]; onOpenReturn: (sessionId: string) => void }) {
  const [activeId, setActiveId] = useState(FORMS[0]!.id);
  /** Below lg, the list and the open form are separate pages. */
  const [detail, setDetail] = useState(false);
  const [collapsed, setCollapsed] = useState<Partial<Record<Category, boolean>>>({});
  const [prefs, setPrefs] = useState<Prefs>({});
  useEffect(() => {
    try {
      setPrefs(JSON.parse(window.localStorage.getItem(STORE) ?? "{}") as Prefs);
    } catch {
      /* Starts from the defaults. */
    }
  }, []);
  const save = (next: Prefs) => {
    setPrefs(next);
    window.localStorage.setItem(STORE, JSON.stringify(next));
  };

  const form = FORMS.find((x) => x.id === activeId) ?? FORMS[0]!;
  const p = prefs[form.id] ?? {};
  const set = (patch: Prefs[string]) => save({ ...prefs, [form.id]: { ...p, ...patch } });
  const send = p.send ?? form.defaults.send;
  const review = p.review ?? form.defaults.review;
  const dest = p.dest ?? form.defaults.dest;
  const agentOn = (f: Field) => p.agent?.[f.id] ?? f.agent;
  const requiredOn = (f: Field) => p.required?.[f.id] ?? f.required;
  const agentCount = form.fields.filter(agentOn).length;

  const stats = useMemo(() => {
    const of = (x: Form) => ({ sent: sessions.length, back: sessions.filter(x.done).length });
    return Object.fromEntries(FORMS.map((x) => [x.id, of(x)])) as Record<string, { sent: number; back: number }>;
  }, [sessions]);
  const st = stats[form.id]!;
  const out = st.sent - st.back;
  const returns = [...sessions]
    .filter((s) => form.done(s) || form.started(s))
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
    .slice(0, 6);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[240px_minmax(0,1fr)] lg:grid-cols-[250px_minmax(0,1fr)_300px] gap-[12px] md:gap-[16px] items-start">
      {/* The forms, by category. */}
      <div className={`flex-col md:sticky md:top-[30px] ${detail ? "hidden md:flex" : "flex"}`}>
        {CATEGORIES.map((category, index) => {
          const items = FORMS.filter((x) => x.category === category);
          const expanded = !collapsed[category];
          return (
            <div key={category} className={`flex flex-col gap-[2px] ${index === 0 ? "" : "mt-[14px]"}`}>
              <button
                type="button"
                aria-expanded={expanded}
                onClick={() => setCollapsed((prev) => ({ ...prev, [category]: !prev[category] }))}
                className="flex items-center gap-[6px] w-full h-[28px] px-[12px] mb-[2px] text-left"
              >
                <span className="text-[12px] leading-[16px] font-[500] text-[#2819109E]">{category}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0 text-[#2819109E]" style={{ transform: expanded ? "none" : "rotate(-90deg)", transition: `transform 200ms ${EASE}` }}>
                  <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="ml-auto w-[22px] h-[22px] shrink-0 flex items-center justify-center rounded-full text-[11px] font-[500] [font-variant-numeric:tabular-nums] shadow-[inset_0_0_0_1px_rgba(40,25,16,0.22)]">{items.length}</span>
              </button>
              {expanded &&
                items.map((x) => {
                  const on = x.id === form.id;
                  const s = stats[x.id]!;
                  return (
                    <button
                      key={x.id}
                      type="button"
                      onClick={() => {
                        setActiveId(x.id);
                        setDetail(true);
                      }}
                      className={`flex items-center gap-[12px] p-[10px] md:p-[12px] rounded-[22px] text-left transition-colors duration-200 ${on ? "md:bg-[#F4EEDF] bg-[#F4EEDF80]" : "hover:bg-[#F8F3E6]"}`}
                    >
                      <span className="w-[44px] h-[44px] shrink-0 rounded-[16px] flex items-center justify-center" style={{ backgroundColor: x.tile }}>
                        <span className={`${DISPLAY} text-[15px] text-[#281910B3]`}>{x.fields.length}</span>
                      </span>
                      <span className="flex flex-col min-w-0 gap-[2px] grow">
                        <span className="truncate text-[15px] leading-[20px] font-[500]">{x.name}</span>
                        <span className="text-[12px] leading-[16px] text-[#2819109E] [font-variant-numeric:tabular-nums]">{s.sent ? `${s.back} of ${s.sent} returned` : "Not sent yet"}</span>
                      </span>
                      <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" className="md:hidden shrink-0 text-[#28191066]">
                        <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  );
                })}
            </div>
          );
        })}
      </div>

      {/* The open form. */}
      <div className={`flex-col gap-[12px] min-w-0 ${detail ? "flex" : "hidden md:flex"}`}>
        <button type="button" onClick={() => setDetail(false)} className="md:hidden self-start flex items-center gap-[6px] h-[36px] pl-[10px] pr-[14px] rounded-full bg-[#F4EEDF] text-[13.5px] font-[500]">
          <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          All forms
        </button>
        <div key={form.id} className="doe-menu-in flex flex-col rounded-[24px] md:rounded-[28px] bg-[#F4EEDF] p-[14px] md:p-[22px] gap-[14px]">
          <div className="flex flex-wrap items-start justify-between gap-[10px]">
            <span className="min-w-0">
              <span className={`block text-[24px] leading-[30px] md:text-[28px] md:leading-[34px] tracking-[-0.02em] ${DISPLAY}`}>{form.name}</span>
              <span className="block mt-[2px] text-[13px] text-[#2819109E]">{form.sub}</span>
            </span>
            <span className="shrink-0 flex items-center gap-[6px] h-[30px] px-[12px] rounded-full bg-[#FFFCF1] text-[12px] font-[500]">
              <span className="w-[6px] h-[6px] rounded-full bg-[#6E9A5B]" />
              Agents fill {agentCount} of {form.fields.length}
            </span>
          </div>
          <div className="flex flex-col gap-[8px]">
            {form.fields.map((f, i) => {
              const t = TYPES[f.type];
              const req = requiredOn(f);
              const ag = agentOn(f);
              return (
                <div key={f.id} className="flex flex-col sm:flex-row sm:items-center gap-[8px] sm:gap-[12px] min-h-[60px] p-[10px] sm:pl-[10px] sm:pr-[12px] rounded-[20px] bg-[#FFFCF1]">
                  <span className="flex items-center gap-[8px] sm:contents">
                    <span className="h-[30px] w-[104px] shrink-0 flex items-center justify-center rounded-full text-[12px] font-[500]" style={{ backgroundColor: t.tone }}>
                      {t.label}
                    </span>
                    <span className="sm:hidden ml-auto font-mono text-[11px] text-[#28191066]">{i + 1}</span>
                  </span>
                  <span className="grow min-w-0 flex flex-col gap-[4px]">
                    <span className="text-[14.5px] leading-[20px] font-[500]">{f.label}</span>
                    {f.detail && <span className="text-[12.5px] leading-[17px] text-[#2819109E]">{f.detail}</span>}
                    {f.options && (
                      <span className="flex flex-wrap gap-[4px] pt-[2px]">
                        {f.options.map((o) => (
                          <span key={o} className="h-[24px] px-[9px] flex items-center rounded-full bg-[#F4EEDF] text-[11.5px] font-[500]">
                            {o}
                          </span>
                        ))}
                      </span>
                    )}
                  </span>
                  <span className="flex items-center gap-[10px] shrink-0">
                    <button
                      type="button"
                      onClick={() => set({ required: { ...p.required, [f.id]: !req } })}
                      className={`h-[26px] px-[10px] shrink-0 rounded-full text-[12px] font-[500] transition-colors duration-150 ${req ? "bg-[#F6D2C4]" : "text-[#2819109E] hover:bg-[#F4EEDF]"}`}
                    >
                      Required
                    </button>
                    <span className="flex items-center gap-[8px]">
                      <span className="text-[12px] text-[#2819109E]">Agent</span>
                      <Toggle small on={ag} label={`Agent fills ${f.label}`} onChange={() => set({ agent: { ...p.agent, [f.id]: !ag } })} />
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-[12px] leading-[17px] text-[#2819109E]">
            {form.category === "Assessments"
              ? "Agents ask each question in the patient's words, one at a time, and record the answer."
              : form.category === "Consent"
                ? "Signatures stay with the patient; their agent asks them to sign."
                : "Agents fill what they already know and confirm the rest with the patient."}
          </p>
        </div>
      </div>

      {/* How it goes out, how it comes back, and who sent it. */}
      <div className={`md:col-start-2 lg:col-start-auto flex-col gap-[10px] p-[10px] md:p-[14px] rounded-[24px] md:rounded-[28px] bg-[#FAF6EC] lg:sticky lg:top-[30px] ${detail ? "flex" : "hidden md:flex"}`}>
        <StepCard step={1} title="Agents send it">
          <Slide value={send} options={SEND_OPTIONS} onChange={(v) => set({ send: v })} />
        </StepCard>
        <StepCard step={2} title="Agents complete it">
          <span className="flex items-center justify-between gap-[12px]">
            <span className="text-[14px] leading-[18px]">Patient reviews first</span>
            <Toggle on={review} label="Patient reviews first" onChange={() => set({ review: !review })} />
          </span>
          <span className="flex h-[8px] rounded-full overflow-hidden bg-[#EEEADF]">
            <span className="h-full rounded-full bg-[#6E9A5B]" style={{ width: `${(agentCount / form.fields.length) * 100}%`, transition: `width 400ms ${EASE}` }} />
          </span>
          <span className="text-[12px] leading-[16px] text-[#2819109E]">Signatures and uploads stay with the patient</span>
        </StepCard>
        <StepCard step={3} title="It comes back to">
          <Slide value={dest} options={DEST_OPTIONS} onChange={(v) => set({ dest: v })} />
        </StepCard>

        <div className="flex flex-col shrink-0 gap-[12px] p-[16px] rounded-[18px] bg-[#FFFCF1]">
          <span className="flex flex-col gap-[2px]">
            <span className={`text-[34px] leading-[38px] tracking-[-0.02em] ${DISPLAY} [font-variant-numeric:tabular-nums]`}>{st.sent ? `${Math.round((st.back / st.sent) * 100)}%` : "—"}</span>
            <span className="text-[13px] leading-[18px] text-[#2819109E]">Returned complete by agents</span>
          </span>
          <span className="grid grid-cols-3 gap-[8px]">
            {[
              ["Sent", st.sent],
              ["Back", st.back],
              ["Out", out],
            ].map(([label, value]) => (
              <span key={label} className="flex flex-col gap-[2px] px-[12px] py-[10px] rounded-[14px] bg-[#FAF6EC]">
                <span className="text-[12px] leading-[16px] text-[#2819109E]">{label}</span>
                <span className={`text-[18px] leading-[22px] ${DISPLAY} [font-variant-numeric:tabular-nums]`}>{value}</span>
              </span>
            ))}
          </span>
        </div>

        <div className="flex flex-col gap-[6px] p-[16px] rounded-[18px] bg-[#FFFCF1]">
          <span className="flex items-center justify-between pb-[4px]">
            <span className="text-[15px] leading-[20px] font-[600]">Latest returns</span>
            {out > 0 && <span className="text-[12px] font-[500] text-[#2819109E]">{out} still out</span>}
          </span>
          {returns.length === 0 && <span className="text-[13px] leading-[18px] text-[#2819109E]">Nothing back yet. Returns show here as agents send them.</span>}
          {returns.map((s) => {
            const done = form.done(s);
            return (
              <button key={s.id} type="button" onClick={() => onOpenReturn(s.id)} className="flex items-center gap-[10px] -mx-[6px] p-[6px] rounded-[12px] text-left hover:bg-[#FAF6EC] transition-colors duration-150">
                <AgentAvatar name={s.agentName} size={28} />
                <span className="flex flex-col grow min-w-0">
                  <span className="truncate text-[14px] leading-[18px] font-[500]">{s.userName}</span>
                  <span className={`truncate text-[12px] leading-[16px] ${done ? "text-[#2819109E]" : "text-[#B4572F]"}`}>
                    {done ? `Filled by ${s.agentName}` : form.id === "consent" ? "Waiting on a signature" : "In progress"}
                  </span>
                </span>
                <span className="shrink-0 text-[12px] text-[#2819109E] [font-variant-numeric:tabular-nums]">{when(s.updatedAt)}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
