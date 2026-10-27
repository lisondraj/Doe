"use client";

/**
 * Transit's fill view — a light sheet over the whole content panel for finishing a document that needs you. Doe has already filled
 * what it can from the chart, the payer's letter and your automations; each field says where its answer came from.
 * Pick a template on the left, edit the document in the middle, and ask the patient's personal agent on the right
 * for anything the chart doesn't know. Asking from a missing field sends the question and fills in the answer.
 */
import { type ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import type { Doc } from "@/components/doehealth-product/DoeHealthProductTransit";

const DISPLAY = "font-['P22MackinacPro-Medium','P22_Mackinac_Pro',system-ui,sans-serif] font-[500]";
const SANS = "font-['DM_Sans',system-ui,sans-serif]";
const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

type Source = "chart" | "automation" | "agent" | "letter" | "you" | "missing";

type Field = { id: string; label: string; value: string; source: Source; note: string; wide?: boolean };
type Section = { title: string; fields: Field[] };
type Line = { from: "doe" | "agent"; text: string };

type Draft = {
  heading: string;
  to: string;
  send: string;
  agent: string;
  templates: { name: string; note: string }[];
  automations: { name: string; note: string }[];
  sections: Section[];
  chat: Line[];
  /** The question Doe asks the agent for the one field the chart can't answer, and what comes back. */
  ask?: { field: string; question: string; answer: string; value: string };
  suggestions: string[];
};

const DRAFTS: Record<string, Draft> = {
  "mia-form": {
    heading: "Lincoln Elementary seizure action plan",
    to: "Mia’s agent",
    send: "Sign and send",
    agent: "Mia’s agent",
    templates: [
      { name: "Lincoln Elementary seizure action plan", note: "Sent by the school" },
      { name: "Massachusetts school medication form", note: "State form" },
      { name: "Seizure first aid handout", note: "Practice template" },
    ],
    automations: [
      { name: "Fill school forms from the last visit", note: "Forms" },
      { name: "Add seizure first aid to every action plan", note: "Forms" },
      { name: "Return finished forms to the sender’s agent", note: "Transit" },
    ],
    sections: [
      {
        title: "Student",
        fields: [
          { id: "name", label: "Name", value: "Leo Jacobs", source: "chart", note: "Demographics" },
          { id: "dob", label: "Date of birth", value: "Mar 3, 2020", source: "chart", note: "Demographics" },
          { id: "grade", label: "Grade", value: "1st grade", source: "agent", note: "Told at intake" },
          { id: "guardian", label: "Guardian", value: "Mia Jacobs", source: "chart", note: "Contacts" },
        ],
      },
      {
        title: "Seizures",
        fields: [
          { id: "type", label: "Type", value: "Possible absence seizures", source: "chart", note: "Oct 26 visit" },
          { id: "looks", label: "What they look like", value: "Staring and blinking, a few seconds", source: "chart", note: "Oct 26 visit" },
          { id: "eeg", label: "Last EEG", value: "Jun 12, normal", source: "chart", note: "EEG report" },
          { id: "rescue", label: "Rescue medication", value: "None needed", source: "chart", note: "Med list" },
        ],
      },
      {
        title: "At school",
        fields: [
          { id: "allergies", label: "Allergies", value: "None known", source: "chart", note: "Allergy list" },
          { id: "firstaid", label: "First aid", value: "Note the time, keep him safe, call Mia", source: "automation", note: "Practice template" },
          { id: "call", label: "Call 911 if", value: "A seizure lasts over 5 minutes", source: "automation", note: "Practice template" },
          { id: "limits", label: "Limits on recess or gym", value: "", source: "missing", note: "Not in the chart" },
        ],
      },
      {
        title: "Sign-off",
        fields: [{ id: "sign", label: "Clinician", value: "Dr. Sarah Brooks, MD", source: "automation", note: "Signature block", wide: true }],
      },
    ],
    chat: [
      { from: "agent", text: "Hi, Lincoln Elementary needs a seizure action plan for Leo by Friday. I’ve attached their PDF." },
      { from: "doe", text: "Got it. Everything but one field is filled from Leo’s chart. Dr. Brooks will sign today." },
    ],
    ask: {
      field: "limits",
      question: "Should Leo have any limits on recess or gym while we wait for the EEG?",
      answer: "Recess and gym are fine. Mia would like an adult nearby when he climbs, and no swimming without one.",
      value: "None. Adult nearby for climbing and swimming",
    },
    suggestions: ["Is Mia okay with us sharing the EEG result with the school?", "Which email should the school copy go to?"],
  },
  "harbor-letter": {
    heading: "Reply to Leo’s agent with his EEG report",
    to: "Leo’s agent",
    send: "Send to Leo’s agent",
    agent: "Leo’s agent",
    templates: [
      { name: "Records reply", note: "Practice template" },
      { name: "Letter of medical necessity", note: "Practice template" },
      { name: "Records release cover sheet", note: "Practice template" },
    ],
    automations: [
      { name: "Attach the latest EEG report to records requests", note: "Records" },
      { name: "Pull visit notes for the dates an agent asks about", note: "Records" },
      { name: "Log shared records to the chart", note: "Chart" },
    ],
    sections: [
      {
        title: "Request",
        fields: [
          { id: "ref", label: "Consent", value: "Signed in agent", source: "letter", note: "Leo’s agent" },
          { id: "asks", label: "Asked for", value: "EEG report, last 6 months", source: "letter", note: "Leo’s agent" },
          { id: "due", label: "Due", value: "Oct 21", source: "letter", note: "Leo’s agent" },
          { id: "code", label: "Procedure", value: "48-hour ambulatory EEG", source: "chart", note: "Auth request" },
        ],
      },
      {
        title: "Clinical",
        fields: [
          { id: "dx", label: "Diagnosis", value: "Possible absence seizures, R56.9", source: "chart", note: "Problem list" },
          { id: "episodes", label: "Episodes", value: "About 10 spells a day since Oct 22", source: "chart", note: "Visit history" },
          { id: "prior", label: "Prior EEG", value: "Jun 12, routine, normal", source: "automation", note: "Attached" },
          { id: "why", label: "Why 48 hours", value: "Spells not caught on a routine EEG", source: "chart", note: "Dr. Brooks’ note" },
          { id: "missed", label: "School days missed", value: "", source: "missing", note: "Not in the chart" },
          { id: "exam", label: "Exam", value: "Normal neuro exam, Oct 26", source: "chart", note: "Oct 26 visit" },
        ],
      },
      {
        title: "Sign-off",
        fields: [{ id: "sign", label: "Clinician", value: "Dr. Sarah Brooks, MD", source: "automation", note: "Signature block", wide: true }],
      },
    ],
    chat: [{ from: "doe", text: "Leo’s agent asked for his latest EEG report. I’m putting the reply together now." }],
    ask: {
      field: "missed",
      question: "How many school days has Leo missed because of the spells?",
      answer: "Two days this month, going by the school’s attendance app. The nurse sent him home both times.",
      value: "2 this month, per school attendance",
    },
    suggestions: ["Has Leo had any spells at home since Oct 26?", "Can Mia share the teacher’s notes?"],
  },
  "quest-labs": {
    heading: "Note to Ava about her labs",
    to: "Ava’s agent",
    send: "Send to Ava’s agent",
    agent: "Ava’s agent",
    templates: [
      { name: "Result, explained plainly", note: "Practice template" },
      { name: "Result with a visit request", note: "Practice template" },
      { name: "Medication change notice", note: "Practice template" },
    ],
    automations: [
      { name: "Explain lab results in plain language", note: "Results" },
      { name: "Ask about diet and supplements when B12 is low", note: "Results" },
      { name: "Offer a visit when a result is out of range", note: "Schedule" },
    ],
    sections: [
      {
        title: "Result",
        fields: [
          { id: "b12", label: "B12", value: "180 pg/mL, low", source: "chart", note: "Quest, Oct 24" },
          { id: "a1c", label: "A1C", value: "5.4%, normal", source: "chart", note: "Quest, Oct 24" },
          { id: "tsh", label: "Thyroid", value: "TSH 2.1, normal", source: "chart", note: "Quest, Oct 24" },
          { id: "diet", label: "Diet and supplements", value: "", source: "missing", note: "Not in the chart" },
        ],
      },
      {
        title: "Plan",
        fields: [
          { id: "med", label: "Medication", value: "Vitamin B12, 1,000 mcg a day", source: "chart", note: "Dr. Brooks’ plan" },
          { id: "recheck", label: "Recheck", value: "B12 again in 3 months", source: "automation", note: "Results" },
          { id: "visit", label: "Visit offered", value: "Thu, Oct 29 at 10:30", source: "automation", note: "Schedule" },
          { id: "by", label: "From", value: "Dr. Sarah Brooks", source: "automation", note: "Signature block" },
        ],
      },
    ],
    chat: [{ from: "doe", text: "Ava’s B12 came back low at 180. Dr. Brooks thinks it explains the tingling, so I’m writing her a short note." }],
    ask: {
      field: "diet",
      question: "Does Ava eat meat or dairy, or take any supplements?",
      answer: "She’s been vegan for two years and doesn’t take a B12 supplement.",
      value: "Vegan for 2 years, no B12 supplement",
    },
    suggestions: ["Does Thursday at 10:30 work for Ava?", "Is the tingling any worse this week?"],
  },
};

/** Any other document gets a simple draft from what Doe already read out of it. */
function draftFor(doc: Doc): Draft {
  const known = DRAFTS[doc.id];
  if (known) return known;
  const first = doc.patient.split(" ")[0];
  return {
    heading: doc.title,
    to: doc.dir === "in" ? "Chart" : doc.who,
    send: doc.dir === "in" ? "File to chart" : `Send to ${doc.who}`,
    agent: `${first}’s agent`,
    templates: [
      { name: doc.kind, note: "Practice template" },
      { name: "Blank document", note: "Start from scratch" },
    ],
    automations: [{ name: "Fill documents from the chart", note: "Forms" }],
    sections: [
      {
        title: "Details",
        fields: [
          { id: "patient", label: "Patient", value: doc.patient, source: "chart", note: "Demographics" },
          ...doc.fields.map((f) => ({ id: f.label, label: f.label, value: f.value, source: "chart" as const, note: "Chart" })),
        ],
      },
    ],
    chat: [{ from: "doe", text: `Everything on this ${doc.kind.toLowerCase()} came from ${first}’s chart.` }],
    suggestions: [`Anything ${first} wants us to add?`],
  };
}

const SOURCE: Record<Source, { label: string; tone: string }> = {
  chart: { label: "Chart", tone: "#E3E9D9" },
  automation: { label: "Automation", tone: "#F3E7C9" },
  agent: { label: "Agent", tone: "#F8DCCB" },
  letter: { label: "Letter", tone: "#ECE6DA" },
  you: { label: "You", tone: "#EEEADF" },
  missing: { label: "Needs an answer", tone: "#FCCFB8" },
};

function Dot({ tone, size = 8 }: { tone: string; size?: number }) {
  return <span className="shrink-0 rounded-[999px]" style={{ width: size, height: size, backgroundColor: tone }} />;
}

function SourceChip({ field, agent }: { field: Field; agent: string }) {
  const s = SOURCE[field.source];
  return (
    <span className={`flex items-center gap-[6px] h-[22px] px-[8px] rounded-[999px] text-[11px] leading-[14px] ${SANS} font-[600] text-walnut whitespace-nowrap`} style={{ backgroundColor: s.tone }}>
      {field.source === "agent" ? agent : s.label}
      {field.source !== "missing" && <span className="font-[500] text-sub">· {field.note}</span>}
    </span>
  );
}

function Close({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" aria-label="Close" onClick={onClick} className="w-[40px] h-[40px] shrink-0 flex items-center justify-center rounded-[999px] bg-[#28191014] hover:bg-[#2819101F] transition-colors duration-150">
      <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
        <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="#281910" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    </button>
  );
}

function Panel({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col gap-[10px] p-[18px] rounded-[24px] bg-[#FAF6EC] ${className}`}>
      <span className={`text-[11px] leading-[14px] ${SANS} font-[600] uppercase tracking-[0.06em] text-sub`}>{title}</span>
      {children}
    </div>
  );
}

function FieldBox({ field, agent, asking, onChange, onAsk }: { field: Field; agent: string; asking: boolean; onChange: (v: string) => void; onAsk: () => void }) {
  const missing = field.source === "missing";
  return (
    <label
      className={`flex flex-col gap-[8px] min-w-[0px] p-[14px] rounded-[18px] cursor-text transition-colors duration-300 ${field.wide ? "col-span-2" : ""} ${missing ? "bg-[#FBEDE4] border-[1.5px] border-dashed border-[#E8A585]" : "bg-[#FAF6EC] hover:bg-[#F4EEDF] border-[1.5px] border-solid border-transparent focus-within:border-[#140C04]"}`}
    >
      <span className={`text-[12px] leading-[16px] ${SANS} font-[500] text-sub`}>{field.label}</span>
      {missing ? (
        <span className="flex items-center justify-between gap-[10px]">
          <span className={`text-[15px] leading-[20px] ${SANS} text-sub`}>{asking ? `Asking ${agent}…` : "The chart doesn’t say"}</span>
          {!asking && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onAsk();
              }}
              className={`shrink-0 h-[32px] px-[14px] rounded-[999px] bg-ink hover:bg-[#2B1D12] transition-colors duration-150 text-[13px] leading-[16px] ${SANS} font-[500] [color:#FFFCF1]`}
            >
              Ask {agent}
            </button>
          )}
        </span>
      ) : (
        <textarea
          value={field.value}
          rows={1}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full min-w-[0px] resize-none [field-sizing:content] bg-transparent outline-none text-[15px] leading-[20px] ${SANS} font-[500] text-walnut`}
        />
      )}
      <span className="flex">
        <SourceChip field={field} agent={agent} />
      </span>
    </label>
  );
}

export function TransitFillModal({ doc, onClose }: { doc: Doc; onClose: () => void }) {
  const draft = draftFor(doc);
  const [template, setTemplate] = useState(0);
  const [automations, setAutomations] = useState(() => draft.automations.map(() => true));
  const [sections, setSections] = useState(draft.sections);
  const [chat, setChat] = useState<Line[]>(draft.chat);
  const [asking, setAsking] = useState(false);
  const [typing, setTyping] = useState(false);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const fields = sections.flatMap((s) => s.fields);
  const filled = fields.filter((f) => f.source !== "missing").length;
  const left = fields.length - filled;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [chat, typing]);

  const update = (id: string, patch: Partial<Field>) =>
    setSections((prev) => prev.map((s) => ({ ...s, fields: s.fields.map((f) => (f.id === id ? { ...f, ...patch } : f)) })));

  /** Send a question to the agent; if it's the missing field's question, the answer fills that field. */
  const ask = (question: string) => {
    const known = draft.ask && question === draft.ask.question ? draft.ask : null;
    setChat((c) => [...c, { from: "doe", text: question }]);
    setTyping(true);
    if (known) setAsking(true);
    window.setTimeout(() => {
      setTyping(false);
      setAsking(false);
      setChat((c) => [...c, { from: "agent", text: known ? known.answer : "Let me check with them. I’ll reply here within the hour." }]);
      if (known) update(known.field, { value: known.value, source: "agent", note: "Just now" });
    }, 1600);
  };

  const sendTyped = () => {
    const text = message.trim();
    if (!text) return;
    setMessage("");
    ask(text);
  };

  const shell = document.querySelector<HTMLElement>("[data-doe-shell]");

  return createPortal(
    <div
      className={`doe-menu-in ${shell ? "absolute rounded-[24px] overflow-clip" : "fixed"} inset-0 z-[60] flex flex-col bg-paper [font-synthesis:none] antialiased`}
      role="dialog"
      aria-modal="true"
      aria-label={draft.heading}
    >
      <div className="flex items-center justify-between gap-[24px] h-[96px] shrink-0 px-[36px]">
        <span className="flex items-center gap-[18px] min-w-[0px]">
          <Close onClick={onClose} />
          <span className="flex flex-col min-w-[0px]">
            <span className={`text-[13px] leading-[16px] ${SANS} font-[500] text-sub`}>
              {doc.kind} from {doc.dir === "in" ? doc.who : "the chart"} · {doc.patient}
            </span>
            <span className={`truncate text-[34px] leading-[40px] tracking-[-0.02em] ${DISPLAY} text-walnut`}>{draft.heading}</span>
          </span>
        </span>
        <span className="flex items-center gap-[10px] shrink-0">
          <span className={`flex items-center gap-[8px] h-[40px] px-[16px] rounded-[999px] text-[14px] leading-[18px] ${SANS} font-[500] text-walnut`} style={{ backgroundColor: left ? "#FBEDE4" : "#E3E9D9" }}>
            <Dot tone={left ? "#E8A585" : "#6E9A5B"} />
            {left ? `${left} ${left === 1 ? "field" : "fields"} left` : "Ready to send"}
          </span>
          <button type="button" className={`h-[40px] px-[18px] rounded-[999px] bg-[#28191014] hover:bg-[#2819101F] transition-colors duration-150 text-[14px] leading-[18px] ${SANS} font-[500] text-walnut`}>
            Save draft
          </button>
          <button
            type="button"
            disabled={left > 0 || sent}
            onClick={() => setSent(true)}
            className={`h-[40px] px-[20px] rounded-[999px] text-[14px] leading-[18px] ${SANS} font-[500] transition-colors duration-150 ${left > 0 ? "bg-[#28191014] text-sub" : sent ? "bg-[#D6DEC6] text-[#2F3B2A]" : "bg-ink hover:bg-[#2B1D12] [color:#FFFCF1]"}`}
          >
            {sent ? `Sent to ${draft.to}` : draft.send}
          </button>
        </span>
      </div>

      <div className="grid grid-cols-[300px_1fr_380px] gap-[16px] grow min-h-[0px] px-[36px] pb-[28px]">
        <div className="flex flex-col min-h-[0px] gap-[12px] overflow-y-auto overscroll-y-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex flex-col gap-[12px] p-[20px] rounded-[24px]" style={{ backgroundColor: left ? "#F8D9C6" : "#D6DEC6" }}>
            <span className={`text-[13px] leading-[16px] ${SANS} font-[500] text-[rgba(40,25,16,0.7)]`}>Filled by Doe</span>
            <span className="flex items-baseline gap-[8px]">
              <span className={`text-[44px] leading-[46px] tracking-[-0.03em] ${DISPLAY} text-ink`}>{filled}</span>
              <span className={`text-[20px] leading-[24px] ${DISPLAY} text-sub`}>of {fields.length}</span>
            </span>
            <span className="h-[6px] rounded-[99px] bg-[#FFFCF18C] overflow-hidden">
              <span className="block h-full rounded-[99px] bg-ink" style={{ width: `${(filled / fields.length) * 100}%`, transition: `width 600ms ${EASE}` }} />
            </span>
            <span className="flex flex-wrap gap-[6px]">
              {(["chart", "automation", "agent", "letter"] as const)
                .map((s) => ({ s, n: fields.filter((f) => f.source === s).length }))
                .filter((x) => x.n > 0)
                .map(({ s, n }) => (
                  <span key={s} className={`flex items-center gap-[6px] h-[24px] px-[9px] rounded-[999px] bg-[#FFFCF1A6] text-[12px] leading-[16px] ${SANS} font-[500] text-walnut`}>
                    <Dot tone={s === "chart" ? "#8DAA7C" : s === "automation" ? "#D9B860" : s === "agent" ? "#E8A585" : "#C2A987"} size={6} />
                    {n} {s === "agent" ? "from agent" : `from ${SOURCE[s].label.toLowerCase()}`}
                  </span>
                ))}
            </span>
          </div>

          <Panel title="Template">
            <div className="flex flex-col gap-[6px]">
              {draft.templates.map((t, i) => (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => setTemplate(i)}
                  className={`flex items-center gap-[12px] p-[12px] rounded-[16px] text-left transition-colors duration-150 ${template === i ? "bg-paper" : "hover:bg-[#F4EEDF]"}`}
                >
                  <span className={`w-[18px] h-[18px] shrink-0 flex items-center justify-center rounded-[999px] border-[1.5px] border-solid ${template === i ? "border-ink" : "border-[#28191033]"}`}>
                    {template === i && <span className="w-[8px] h-[8px] rounded-[999px] bg-ink" />}
                  </span>
                  <span className="flex flex-col min-w-[0px]">
                    <span className={`text-[14px] leading-[18px] ${SANS} font-[500] text-walnut`}>{t.name}</span>
                    <span className={`text-[12px] leading-[16px] ${SANS} text-sub`}>{t.note}</span>
                  </span>
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Your automations">
            <div className="flex flex-col gap-[6px]">
              {draft.automations.map((a, i) => (
                <div key={a.name} className="flex items-center gap-[12px] p-[12px] rounded-[16px] bg-paper">
                  <span className="flex flex-col grow min-w-[0px]">
                    <span className={`text-[14px] leading-[18px] ${SANS} font-[500] text-walnut`}>{a.name}</span>
                    <span className={`text-[12px] leading-[16px] ${SANS} text-sub`}>Automations · {a.note}</span>
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={automations[i]}
                    aria-label={a.name}
                    onClick={() => setAutomations((prev) => prev.map((on, j) => (j === i ? !on : on)))}
                    className={`relative w-[38px] h-[22px] shrink-0 rounded-[999px] transition-colors duration-200 ${automations[i] ? "bg-ink" : "bg-[#28191026]"}`}
                  >
                    <span className="absolute top-[3px] w-[16px] h-[16px] rounded-[999px] bg-paper" style={{ left: automations[i] ? 19 : 3, transition: `left 200ms ${EASE}` }} />
                  </button>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="min-w-[0px] min-h-[0px] rounded-[28px] bg-[#F4EEDF] overflow-y-auto overscroll-y-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex flex-col gap-[22px] max-w-[760px] mx-auto my-[24px] p-[36px] rounded-[24px] bg-paper">
            <div className="flex items-start justify-between gap-[16px]">
              <span className="flex flex-col gap-[4px]">
                <span className={`text-[12px] leading-[16px] ${SANS} font-[600] uppercase tracking-[0.06em] text-sub`}>Brooks Neurology</span>
                <span className={`text-[28px] leading-[32px] tracking-[-0.02em] ${DISPLAY} text-walnut`}>{draft.templates[template]!.name}</span>
                <span className={`text-[14px] leading-[18px] ${SANS} text-sub`}>
                  To {draft.to} · Re: {doc.patient}
                </span>
              </span>
              <span className={`flex items-center h-[28px] px-[12px] rounded-[999px] bg-[#EEEADF] text-[12px] leading-[16px] ${SANS} font-[500] text-walnut`}>Draft</span>
            </div>

            {sections.map((s) => (
              <div key={s.title} className="flex flex-col gap-[10px]">
                <span className={`text-[11px] leading-[14px] ${SANS} font-[600] uppercase tracking-[0.06em] text-sub`}>{s.title}</span>
                <div className="grid grid-cols-2 gap-[8px]">
                  {s.fields.map((f) => (
                    <FieldBox
                      key={f.id}
                      field={f}
                      agent={draft.agent}
                      asking={asking && draft.ask?.field === f.id}
                      onChange={(v) => update(f.id, { value: v })}
                      onAsk={() => draft.ask && ask(draft.ask.question)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col min-h-[0px] rounded-[28px] bg-[#FAF6EC]">
          <div className="flex items-center gap-[12px] p-[18px] pb-[14px]">
            <span className="w-[40px] h-[40px] shrink-0 flex items-center justify-center rounded-[999px] bg-[#F8DCCB] text-[15px] leading-[18px] font-['DM_Sans',system-ui,sans-serif] font-[600] text-walnut">
              {draft.agent[0]}
            </span>
            <span className="flex flex-col grow min-w-[0px]">
              <span className={`text-[16px] leading-[20px] ${SANS} font-[600] text-walnut`}>{draft.agent}</span>
              <span className={`flex items-center gap-[6px] text-[12px] leading-[16px] ${SANS} text-sub`}>
                <Dot tone="#6E9A5B" size={6} />
                Personal agent for {doc.patient}
              </span>
            </span>
          </div>

          <div ref={chatRef} className="flex flex-col grow min-h-[0px] gap-[8px] px-[18px] overflow-y-auto overscroll-y-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {chat.map((l, i) => (
              <div key={i} className={`doe-menu-in flex flex-col gap-[4px] max-w-[86%] ${l.from === "doe" ? "self-end items-end" : "self-start items-start"}`}>
                <span className={`text-[11px] leading-[14px] ${SANS} font-[600] text-sub`}>{l.from === "doe" ? "Doe, for you" : draft.agent}</span>
                <span
                  className={`px-[14px] py-[10px] text-[14px] leading-[20px] ${SANS} ${l.from === "doe" ? "rounded-[18px] rounded-br-[6px] bg-ink [color:#FFFCF1]" : "rounded-[18px] rounded-bl-[6px] bg-paper text-walnut"}`}
                >
                  {l.text}
                </span>
              </div>
            ))}
            {typing && (
              <span className="self-start flex items-center gap-[4px] h-[36px] px-[14px] rounded-[18px] rounded-bl-[6px] bg-paper">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="w-[6px] h-[6px] rounded-[999px] bg-[#28191066] animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-[10px] p-[18px] pt-[14px]">
            <span className="flex flex-wrap gap-[6px]">
              {[...(draft.ask && fields.some((f) => f.id === draft.ask!.field && f.source === "missing") ? [draft.ask.question] : []), ...draft.suggestions].map((q) => (
                <button
                  key={q}
                  type="button"
                  disabled={typing}
                  onClick={() => ask(q)}
                  className={`text-left px-[12px] py-[7px] rounded-[14px] bg-paper hover:bg-[#F4EEDF] disabled:opacity-50 transition-colors duration-150 text-[13px] leading-[18px] ${SANS} font-[500] text-walnut`}
                >
                  {q}
                </button>
              ))}
            </span>
            <span className="flex items-center gap-[8px] h-[48px] pl-[16px] pr-[5px] rounded-[999px] bg-paper">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendTyped()}
                placeholder={`Ask ${draft.agent}…`}
                className={`grow min-w-[0px] bg-transparent outline-none text-[14px] leading-[18px] ${SANS} text-walnut placeholder:text-sub`}
              />
              <button
                type="button"
                aria-label="Send"
                onClick={sendTyped}
                className="w-[38px] h-[38px] shrink-0 flex items-center justify-center rounded-[999px] bg-ink hover:bg-[#2B1D12] transition-colors duration-150"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
                  <path d="M12 19V5M6 11l6-6 6 6" fill="none" stroke="#FFFCF1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>,
    shell ?? document.body,
  );
}
