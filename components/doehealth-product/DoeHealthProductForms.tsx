"use client";

/**
 * Forms tab — build the forms patients' agents send, complete, and return. Pick a form on the left,
 * shape its fields in the middle, and decide on the right when agents send it, how much they fill in
 * for the patient, and where the finished form lands.
 */
import { useState, type ReactNode } from "react";

const DISPLAY = "font-['P22MackinacPro-Medium','P22_Mackinac_Pro',system-ui,sans-serif] font-[500]";
const SANS = "font-['DM_Sans',system-ui,sans-serif]";
const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

type FieldType = "text" | "choice" | "date" | "yesno" | "upload" | "signature";

const TYPES: { id: FieldType; label: string; tone: string }[] = [
  { id: "text", label: "Short answer", tone: "#EEEADF" },
  { id: "choice", label: "Choice", tone: "#E3E9D9" },
  { id: "date", label: "Date", tone: "#F3E7C9" },
  { id: "yesno", label: "Yes / No", tone: "#E9DCC7" },
  { id: "upload", label: "Upload", tone: "#F7DCCB" },
  { id: "signature", label: "Signature", tone: "#FCCFB8" },
];
const typeOf = (t: FieldType) => TYPES.find((x) => x.id === t)!;

type Field = { id: string; type: FieldType; label: string; required: boolean; agent: boolean };

type Send = "booking" | "before" | "manual";
type Dest = "chart" | "inbox";

type Form = {
  id: string;
  name: string;
  tile: string;
  sent: number;
  returned: number;
  send: Send;
  review: boolean;
  dest: Dest;
  fields: Field[];
};

let nextId = 100;
const f = (type: FieldType, label: string, required = true, agent = true): Field => ({ id: `f${nextId++}`, type, label, required, agent });

const FORMS: Form[] = [
  {
    id: "intake",
    name: "New patient intake",
    tile: "#FCCFB8",
    sent: 48,
    returned: 44,
    send: "booking",
    review: true,
    dest: "chart",
    fields: [
      f("text", "Full name"),
      f("date", "Date of birth"),
      f("choice", "Insurance plan"),
      f("upload", "Insurance card", true, false),
      f("text", "Current medications", false),
      f("yesno", "Any allergies?"),
      f("signature", "Consent to treat", true, false),
    ],
  },
  {
    id: "visit",
    name: "Pre-visit check-in",
    tile: "#E3E9D9",
    sent: 132,
    returned: 127,
    send: "before",
    review: false,
    dest: "chart",
    fields: [f("text", "Reason for visit"), f("yesno", "Any changes since last visit?"), f("text", "Pharmacy"), f("yesno", "Need a refill?", false)],
  },
  {
    id: "refill",
    name: "Medication refill",
    tile: "#F3E7C9",
    sent: 37,
    returned: 35,
    send: "manual",
    review: false,
    dest: "inbox",
    fields: [f("choice", "Medication"), f("text", "Dose"), f("text", "Pharmacy"), f("date", "Last dose", false)],
  },
  {
    id: "consent",
    name: "Telehealth consent",
    tile: "#E9DCC7",
    sent: 21,
    returned: 18,
    send: "booking",
    review: true,
    dest: "chart",
    fields: [f("yesno", "Understands telehealth limits"), f("signature", "Signature", true, false)],
  },
  {
    id: "records",
    name: "Records release",
    tile: "#EEEADF",
    sent: 9,
    returned: 6,
    send: "manual",
    review: true,
    dest: "inbox",
    fields: [f("text", "Previous practice"), f("date", "Dates of care", false), f("signature", "Authorization", true, false)],
  },
  {
    id: "referral",
    name: "Referral request",
    tile: "#F6DED0",
    sent: 16,
    returned: 14,
    send: "manual",
    review: true,
    dest: "inbox",
    fields: [f("choice", "Specialty"), f("text", "Reason for referral"), f("yesno", "Urgent?"), f("signature", "Authorization", true, false)],
  },
  {
    id: "aftervisit",
    name: "After-visit summary",
    tile: "#DCE5D0",
    sent: 64,
    returned: 58,
    send: "before",
    review: false,
    dest: "chart",
    fields: [f("text", "What we covered"), f("text", "Home instructions"), f("yesno", "Questions for the doctor?")],
  },
  {
    id: "hipaa",
    name: "HIPAA authorization",
    tile: "#E9DCC7",
    sent: 28,
    returned: 22,
    send: "booking",
    review: true,
    dest: "chart",
    fields: [f("text", "Who may receive records"), f("choice", "What to share"), f("signature", "Signature", true, false)],
  },
  {
    id: "financial",
    name: "Financial policy",
    tile: "#F3E7C9",
    sent: 41,
    returned: 39,
    send: "booking",
    review: true,
    dest: "chart",
    fields: [f("yesno", "Understands payment terms"), f("choice", "Preferred payment"), f("signature", "Agreement", true, false)],
  },
  {
    id: "pediatric",
    name: "Pediatric history",
    tile: "#E3E9D9",
    sent: 19,
    returned: 17,
    send: "before",
    review: false,
    dest: "chart",
    fields: [f("text", "Guardian name"), f("date", "Date of birth"), f("text", "Allergies", false), f("yesno", "Up to date on vaccines?")],
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

function Toggle({ on, onChange, label, small }: { on: boolean; onChange: () => void; label: string; small?: boolean }) {
  const w = small ? 36 : 46;
  const h = small ? 22 : 28;
  const knob = h - 6;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onChange}
      className={`relative shrink-0 rounded-[999px] transition-colors duration-200 ${on ? "bg-ink" : "bg-[#E1D9C8]"}`}
      style={{ width: w, height: h }}
    >
      <span
        className="absolute top-[3px] left-[3px] rounded-[999px] bg-paper"
        style={{ width: knob, height: knob, transform: `translateX(${on ? w - h : 0}px)`, transition: `transform 260ms ${EASE}` }}
      />
    </button>
  );
}

function Segmented<T extends string>({ value, options, onChange }: { value: T; options: { id: T; label: string }[]; onChange: (v: T) => void }) {
  const index = options.findIndex((o) => o.id === value);
  return (
    <div className="relative grid h-[38px] p-[4px] rounded-[999px] bg-[#EEEADF]" style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
      <span
        className="absolute top-[4px] bottom-[4px] rounded-[999px] bg-paper"
        style={{ left: 4, width: `calc((100% - 8px) / ${options.length})`, transform: `translateX(${index * 100}%)`, transition: `transform 300ms ${EASE}` }}
      />
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={`relative rounded-[999px] text-[13px] leading-[16px] ${SANS} font-[500] transition-colors duration-150 ${value === o.id ? "text-walnut" : "text-sub hover:text-walnut"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function IconButton({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled?: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="w-[30px] h-[30px] shrink-0 flex items-center justify-center rounded-[999px] text-walnut hover:bg-[#FFFCF1] disabled:opacity-30 disabled:hover:bg-transparent transition-colors duration-150"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
        {children}
      </svg>
    </button>
  );
}

function StepCard({ step, title, children }: { step: number; title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-[12px] p-[18px] rounded-[24px] bg-sand">
      <span className="flex items-center gap-[10px]">
        <span className={`w-[26px] h-[26px] shrink-0 flex items-center justify-center rounded-[999px] bg-paper text-[13px] leading-[16px] ${DISPLAY} text-walnut`}>{step}</span>
        <span className={`text-[16px] leading-[20px] ${SANS} font-[500] text-walnut`}>{title}</span>
      </span>
      {children}
    </div>
  );
}

export function DoeHealthProductFormsPage() {
  const [forms, setForms] = useState<Form[]>(FORMS);
  const [activeId, setActiveId] = useState(FORMS[0]!.id);
  const form = forms.find((x) => x.id === activeId) ?? forms[0]!;

  const update = (patch: Partial<Form>) => setForms((all) => all.map((x) => (x.id === form.id ? { ...x, ...patch } : x)));
  const updateField = (id: string, patch: Partial<Field>) => update({ fields: form.fields.map((x) => (x.id === id ? { ...x, ...patch } : x)) });
  const move = (i: number, dir: -1 | 1) => {
    const next = [...form.fields];
    const [item] = next.splice(i, 1);
    next.splice(i + dir, 0, item!);
    update({ fields: next });
  };
  const addField = (type: FieldType) => update({ fields: [...form.fields, f(type, typeOf(type).label, false, type !== "signature" && type !== "upload")] });
  const newForm = () => {
    const id = `form${nextId++}`;
    setForms((all) => [...all, { id, name: "Untitled form", tile: "#EEEADF", sent: 0, returned: 0, send: "manual", review: true, dest: "inbox", fields: [f("text", "Full name")] }]);
    setActiveId(id);
  };

  const agentCount = form.fields.filter((x) => x.agent).length;

  return (
    <div className="relative [font-synthesis:none] h-full w-full flex flex-col gap-[24px] pt-[36px] px-[40px] pb-[28px] rounded-[24px] overflow-clip bg-paper antialiased">
      <div className="flex items-end justify-between gap-[16px]">
        <span className={`text-[58px] leading-[62px] tracking-[-0.03em] ${DISPLAY} text-walnut`}>Forms</span>
        <button
          type="button"
          onClick={newForm}
          className={`flex items-center gap-[8px] h-[40px] px-[16px] rounded-[999px] bg-ink hover:bg-[#2B1D12] transition-colors duration-150 text-[14px] leading-[18px] ${SANS} font-[500] [color:#FFFCF1]`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
            <path d="M12 5v14M5 12h14" fill="none" stroke="#FFFCF1" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          New form
        </button>
      </div>

      <div className="grow min-h-[0px] grid grid-cols-[260px_1fr_300px] gap-[16px]">
        <div className="flex flex-col gap-[8px] min-h-[0px] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {forms.map((x) => {
            const on = x.id === form.id;
            return (
              <button
                key={x.id}
                type="button"
                onClick={() => setActiveId(x.id)}
                className={`flex items-center gap-[12px] p-[12px] rounded-[22px] text-left transition-colors duration-200 ${on ? "bg-sand" : "hover:bg-[#F8F3E6]"}`}
              >
                <span className="w-[44px] h-[44px] shrink-0 rounded-[16px]" style={{ backgroundColor: x.tile }} />
                <span className="flex flex-col min-w-[0px] gap-[2px]">
                  <span className={`truncate text-[15px] leading-[20px] ${SANS} font-[500] text-walnut`}>{x.name}</span>
                  <span className={`text-[12px] leading-[16px] ${SANS} text-sub [font-variant-numeric:tabular-nums]`}>
                    {x.sent ? `${x.returned} of ${x.sent} returned` : "Not sent yet"}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col min-h-[0px] rounded-[28px] bg-sand p-[22px] gap-[16px]">
          <div className="flex items-center justify-between gap-[12px]">
            <input
              value={form.name}
              onChange={(e) => update({ name: e.target.value })}
              aria-label="Form name"
              className={`grow min-w-[0px] bg-transparent outline-none text-[28px] leading-[34px] tracking-[-0.02em] ${DISPLAY} text-walnut`}
            />
            <span className={`shrink-0 flex items-center gap-[6px] h-[30px] px-[12px] rounded-[999px] bg-paper text-[12px] leading-[16px] ${SANS} font-[500] text-walnut`}>
              <span className="w-[6px] h-[6px] rounded-[99px] bg-[#6E9A5B]" />
              Agents fill {agentCount} of {form.fields.length}
            </span>
          </div>

          <div className="grow min-h-[0px] flex flex-col gap-[8px] overflow-y-auto overscroll-y-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {form.fields.map((field, i) => (
              <div key={field.id} className="flex items-center gap-[12px] h-[60px] shrink-0 pl-[10px] pr-[8px] rounded-[20px] bg-paper" style={{ animation: "doe-menu-in 160ms ease" }}>
                <span
                  className={`h-[30px] w-[104px] shrink-0 flex items-center justify-center rounded-[999px] text-[12px] leading-[16px] ${SANS} font-[500] text-walnut`}
                  style={{ backgroundColor: typeOf(field.type).tone }}
                >
                  {typeOf(field.type).label}
                </span>
                <input
                  value={field.label}
                  onChange={(e) => updateField(field.id, { label: e.target.value })}
                  aria-label="Field label"
                  className={`grow min-w-[0px] bg-transparent outline-none text-[15px] leading-[20px] ${SANS} font-[500] text-walnut`}
                />
                <button
                  type="button"
                  onClick={() => updateField(field.id, { required: !field.required })}
                  className={`h-[26px] px-[10px] shrink-0 rounded-[999px] text-[12px] leading-[16px] ${SANS} font-[500] transition-colors duration-150 ${field.required ? "bg-[#F6D2C4] text-walnut" : "text-sub hover:bg-sand"}`}
                >
                  Required
                </button>
                <span className="flex items-center gap-[8px] shrink-0">
                  <span className={`text-[12px] leading-[16px] ${SANS} text-sub`}>Agent</span>
                  <Toggle small on={field.agent} label={`Agent fills ${field.label}`} onChange={() => updateField(field.id, { agent: !field.agent })} />
                </span>
                <span className="flex items-center shrink-0">
                  <IconButton label="Move up" disabled={i === 0} onClick={() => move(i, -1)}>
                    <path d="M6 15l6-6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </IconButton>
                  <IconButton label="Move down" disabled={i === form.fields.length - 1} onClick={() => move(i, 1)}>
                    <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </IconButton>
                  <IconButton label="Remove" disabled={form.fields.length === 1} onClick={() => update({ fields: form.fields.filter((x) => x.id !== field.id) })}>
                    <path d="M7 7l10 10M17 7L7 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </IconButton>
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-[6px] pt-[4px]">
            <span className={`mr-[4px] text-[13px] leading-[16px] ${SANS} font-[500] text-sub`}>Add</span>
            {TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => addField(t.id)}
                className={`h-[32px] px-[12px] rounded-[999px] border-[1.5px] border-dashed border-[#28191026] hover:bg-paper hover:border-transparent transition-colors duration-150 text-[13px] leading-[16px] ${SANS} font-[500] text-walnut`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-[10px] min-h-[0px] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <StepCard step={1} title="Agents send it">
            <Segmented value={form.send} options={SEND_OPTIONS} onChange={(send) => update({ send })} />
          </StepCard>
          <StepCard step={2} title="Agents complete it">
            <span className="flex items-center justify-between gap-[12px]">
              <span className={`text-[14px] leading-[18px] ${SANS} text-walnut`}>Patient reviews first</span>
              <Toggle on={form.review} label="Patient reviews first" onChange={() => update({ review: !form.review })} />
            </span>
            <span className="flex h-[8px] rounded-[99px] overflow-hidden bg-paper">
              <span className="h-full rounded-[99px] bg-[#6E9A5B]" style={{ width: `${(agentCount / form.fields.length) * 100}%`, transition: `width 400ms ${EASE}` }} />
            </span>
            <span className={`text-[12px] leading-[16px] ${SANS} text-sub`}>Signatures and uploads stay with the patient</span>
          </StepCard>
          <StepCard step={3} title="It comes back to">
            <Segmented value={form.dest} options={DEST_OPTIONS} onChange={(dest) => update({ dest })} />
          </StepCard>
          <div className="flex items-center gap-[14px] p-[18px] rounded-[24px] border-[1.5px] border-dashed border-[#2819101F]">
            <span className={`text-[34px] leading-[38px] tracking-[-0.02em] ${DISPLAY} text-walnut [font-variant-numeric:tabular-nums]`}>
              {form.sent ? `${Math.round((form.returned / form.sent) * 100)}%` : "—"}
            </span>
            <span className={`text-[13px] leading-[18px] ${SANS} text-sub`}>returned complete this month</span>
          </div>
        </div>
      </div>
    </div>
  );
}
