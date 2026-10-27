"use client";

/**
 * Transit tab — every document moving in and out of the practice: referrals, records, results, forms and payer
 * letters, to and from patients' personal agents, other clinics, payers and labs. A stats strip up top, a filterable
 * pair of tables, Inbound and Outbound side by side, and an inspector that slides in from the right for the selected
 * document: its details, attachment, what Doe read out of it, and its activity from arrival to the chart (or from
 * the chart to its recipient). The first inbound document is open by default.
 */
import { Fragment, type ReactNode, useEffect, useState } from "react";

import { TransitFillModal } from "@/components/doehealth-product/DoeHealthProductTransitFill";

const DISPLAY = "font-['P22MackinacPro-Medium','P22_Mackinac_Pro',system-ui,sans-serif] font-[500]";
const SANS = "font-['DM_Sans',system-ui,sans-serif]";
/** The inspector slides in from the side with the same motion as the Payments panel. */
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const MOVE = `420ms ${EASE}`;
const PANEL_W = 440;

type Party = "agent" | "clinic" | "payer" | "lab";
type Direction = "in" | "out";

const PARTIES: Record<Party, { label: string; one: string; tone: string }> = {
  agent: { label: "Personal agents", one: "Personal agent", tone: "#F8DCCB" },
  clinic: { label: "Clinics", one: "Clinic", tone: "#E3E9D9" },
  payer: { label: "Payers", one: "Payer", tone: "#F3E7C9" },
  lab: { label: "Labs & imaging", one: "Lab", tone: "#EEE6D6" },
};

type Status = "filed" | "review" | "sign" | "delivered" | "read" | "filling" | "stalled";

const STATUS: Record<Status, { label: string; background: string; color: string }> = {
  filed: { label: "Filed to chart", background: "#D6DEC6", color: "#2F3B2A" },
  review: { label: "Needs a look", background: "#FCCFB8", color: "#140C04" },
  sign: { label: "Needs signature", background: "#F3E2B4", color: "#281910" },
  delivered: { label: "Delivered", background: "#ECE6DA", color: "#281910" },
  read: { label: "Read by agent", background: "#D6DEC6", color: "#2F3B2A" },
  filling: { label: "Agent filling", background: "#F3E2B4", color: "#281910" },
  stalled: { label: "No reply, 3 days", background: "#F6D2C4", color: "#140C04" },
};

type Step = { label: string; detail: string; time: string; state: "done" | "now" | "next" };

export type Doc = {
  id: string;
  dir: Direction;
  party: Party;
  who: string;
  kind: string;
  title: string;
  patient: string;
  time: string;
  status: Status;
  steps: Step[];
  fields: { label: string; value: string }[];
  actions: [string, string];
};

const DOCS: Doc[] = [
  {
    id: "james-auth",
    dir: "in",
    party: "payer",
    who: "Blue Cross",
    kind: "Prior auth",
    title: "Prior Auth Approval",
    patient: "James Lisondra",
    time: "9:58",
    status: "filed",
    steps: [
      { label: "Received", detail: "From Blue Cross’s portal", time: "9:58", state: "done" },
      { label: "Matched", detail: "James Lisondra, visit Thu Oct 29 at 9:30", time: "9:58", state: "done" },
      { label: "Read", detail: "Approved for the visit, valid 90 days", time: "9:59", state: "done" },
      { label: "Filed", detail: "Attached to the booking, Muse notified", time: "9:59", state: "done" },
    ],
    fields: [
      { label: "Reference", value: "BC-4471-2093" },
      { label: "Valid", value: "90 days" },
      { label: "Visit", value: "Worsening headache" },
    ],
    actions: ["Mark As Complete", "Message James"],
  },
  {
    id: "harbor-letter",
    dir: "in",
    party: "agent",
    who: "Leo’s agent",
    kind: "Records",
    title: "Asks for the latest EEG report",
    patient: "Leo Jacobs",
    time: "10:12",
    status: "review",
    steps: [
      { label: "Received", detail: "Leo’s agent sent a records request", time: "10:12", state: "done" },
      { label: "Matched", detail: "Leo Jacobs, guardian Mia Jacobs", time: "10:12", state: "done" },
      { label: "Read", detail: "Wants the most recent EEG report", time: "10:13", state: "done" },
      { label: "Your call", detail: "Doe found the Jun 12 EEG, ready to send", time: "Now", state: "now" },
    ],
    fields: [
      { label: "Asks for", value: "EEG report, last 6 months" },
      { label: "Due", value: "Oct 21" },
      { label: "Consent", value: "Signed in agent" },
    ],
    actions: ["Send report", "Message Leo’s agent"],
  },
  {
    id: "maya-mri",
    dir: "in",
    party: "agent",
    who: "Maya’s agent",
    kind: "Records",
    title: "Brain MRI from Newton Imaging",
    patient: "Maya Chen",
    time: "9:41",
    status: "filed",
    steps: [
      { label: "Received", detail: "Maya’s agent shared it before her visit", time: "9:41", state: "done" },
      { label: "Matched", detail: "Name, date of birth and member ID", time: "9:41", state: "done" },
      { label: "Read", detail: "3 findings pulled out", time: "9:42", state: "done" },
      { label: "Filed", detail: "In the chart, Dr. Chen notified", time: "9:42", state: "done" },
    ],
    fields: [
      { label: "Study", value: "MRI brain, no contrast" },
      { label: "Impression", value: "No acute findings" },
      { label: "Read by", value: "Newton Imaging, Oct 9" },
    ],
    actions: ["Mark As Complete", "Thank Maya’s agent"],
  },
  {
    id: "quest-labs",
    dir: "in",
    party: "agent",
    who: "Ava’s agent",
    kind: "Lab results",
    title: "B12, A1C and thyroid panel",
    patient: "Ava Morales",
    time: "9:20",
    status: "review",
    steps: [
      { label: "Received", detail: "Ava’s agent shared her Quest results", time: "9:20", state: "done" },
      { label: "Matched", detail: "Ava Morales, ordered Oct 6", time: "9:20", state: "done" },
      { label: "Read", detail: "B12 low at 180", time: "9:21", state: "done" },
      { label: "Your call", detail: "Flagged for Dr. Brooks before it goes back to Ava’s agent", time: "Now", state: "now" },
    ],
    fields: [
      { label: "B12", value: "180 pg/mL  ↓" },
      { label: "A1C", value: "5.4%, normal" },
      { label: "TSH", value: "2.1, normal" },
    ],
    actions: ["Review result", "Draft note to Ava’s agent"],
  },
  {
    id: "mia-form",
    dir: "in",
    party: "agent",
    who: "Mia’s agent",
    kind: "Form",
    title: "School seizure action plan",
    patient: "Leo Jacobs",
    time: "8:55",
    status: "sign",
    steps: [
      { label: "Received", detail: "Leo’s mom’s agent sent the school’s form", time: "8:55", state: "done" },
      { label: "Matched", detail: "Leo Jacobs, guardian Mia Jacobs", time: "8:55", state: "done" },
      { label: "Filled", detail: "Doe filled 14 of 15 fields from the chart", time: "8:56", state: "done" },
      { label: "Sign", detail: "Waiting on Dr. Brooks’ signature", time: "Now", state: "now" },
    ],
    fields: [
      { label: "School", value: "Lincoln Elementary" },
      { label: "Filled", value: "14 of 15 fields" },
      { label: "Goes back to", value: "Mia’s agent" },
    ],
    actions: ["Sign and return", "Preview form"],
  },
  {
    id: "bi-consult",
    dir: "in",
    party: "agent",
    who: "Victor’s agent",
    kind: "Visit summary",
    title: "Cardiology consult after stroke",
    patient: "Victor Lane",
    time: "8:30",
    status: "filed",
    steps: [
      { label: "Received", detail: "Victor’s agent shared the Beth Israel summary", time: "8:30", state: "done" },
      { label: "Matched", detail: "Victor Lane, referral from Sep 30", time: "8:30", state: "done" },
      { label: "Read", detail: "Heart monitor found atrial fibrillation", time: "8:31", state: "done" },
      { label: "Filed", detail: "Referral marked complete", time: "8:31", state: "done" },
    ],
    fields: [
      { label: "Seen by", value: "Dr. Okonkwo" },
      { label: "Plan", value: "Apixaban 5 mg" },
      { label: "Referral", value: "Complete" },
    ],
    actions: ["Mark As Complete", "Message Victor’s agent"],
  },
  {
    id: "grace-card",
    dir: "in",
    party: "agent",
    who: "Grace’s agent",
    kind: "Insurance card",
    title: "New Cigna card",
    patient: "Grace Kim",
    time: "Yesterday",
    status: "filed",
    steps: [
      { label: "Received", detail: "Grace’s agent sent it when her plan changed", time: "4:18", state: "done" },
      { label: "Matched", detail: "Grace Kim", time: "4:18", state: "done" },
      { label: "Checked", detail: "Eligibility confirmed with Cigna", time: "4:19", state: "done" },
      { label: "Filed", detail: "Coverage updated for her Oct 27 visit", time: "4:19", state: "done" },
    ],
    fields: [
      { label: "Plan", value: "Cigna Open Access" },
      { label: "Copay", value: "$25" },
      { label: "Active", value: "Since Oct 1" },
    ],
    actions: ["Open coverage", "Thank Grace’s agent"],
  },
  {
    id: "bch-referral",
    dir: "out",
    party: "agent",
    who: "Mia’s agent",
    kind: "Referral",
    title: "EEG referral, staring spells",
    patient: "Leo Jacobs",
    time: "10:02",
    status: "delivered",
    steps: [
      { label: "Drafted", detail: "From Dr. Brooks’ visit note", time: "9:58", state: "done" },
      { label: "Packed", detail: "Note, June EEG, teacher’s report", time: "9:59", state: "done" },
      { label: "Delivered", detail: "To Mia’s agent, who books Boston Children’s", time: "10:02", state: "done" },
      { label: "Booked", detail: "Usually within a day", time: "Next", state: "next" },
    ],
    fields: [
      { label: "Specialty", value: "Pediatric EEG" },
      { label: "Attached", value: "3 documents" },
      { label: "Goes to", value: "Boston Children’s EEG Lab" },
    ],
    actions: ["View packet", "Message Mia’s agent"],
  },
  {
    id: "priya-avs",
    dir: "out",
    party: "agent",
    who: "Priya’s agent",
    kind: "Visit summary",
    title: "After-visit summary and MRI order",
    patient: "Priya Raman",
    time: "9:35",
    status: "read",
    steps: [
      { label: "Drafted", detail: "From the signed note", time: "9:30", state: "done" },
      { label: "Delivered", detail: "To Priya’s agent", time: "9:35", state: "done" },
      { label: "Read", detail: "Agent booked the MRI for Oct 28", time: "9:37", state: "done" },
      { label: "Closed", detail: "Nothing left to do", time: "9:37", state: "done" },
    ],
    fields: [
      { label: "Includes", value: "Summary, MRI order, diary" },
      { label: "Agent did", value: "Booked MRI, Oct 28" },
      { label: "Questions", value: "None" },
    ],
    actions: ["View summary", "Message Priya"],
  },
  {
    id: "mgh-sleep",
    dir: "out",
    party: "agent",
    who: "Noah’s agent",
    kind: "Referral",
    title: "Sleep study and MSLT referral",
    patient: "Noah Bennett",
    time: "Oct 21",
    status: "stalled",
    steps: [
      { label: "Drafted", detail: "From Dr. Alvarez’s visit note", time: "Oct 21", state: "done" },
      { label: "Delivered", detail: "To Noah’s agent, who sent it to Mass General", time: "Oct 21", state: "done" },
      { label: "Accepted", detail: "Mass General hasn’t replied in 3 days", time: "Now", state: "now" },
      { label: "Scheduled", detail: "Noah’s agent will book it", time: "Next", state: "next" },
    ],
    fields: [
      { label: "Specialty", value: "Sleep medicine" },
      { label: "Waiting", value: "3 days" },
      { label: "Fallback", value: "Brigham Sleep, 6 day wait" },
    ],
    actions: ["Nudge Noah’s agent", "Send to Brigham"],
  },
  {
    id: "aetna-packet",
    dir: "out",
    party: "agent",
    who: "Henry’s agent",
    kind: "Prior auth",
    title: "Prior auth packet, brain MRI",
    patient: "Henry Walsh",
    time: "Oct 12",
    status: "delivered",
    steps: [
      { label: "Drafted", detail: "Built from the chart", time: "Oct 12", state: "done" },
      { label: "Delivered", detail: "To Henry’s agent, who filed it with Aetna", time: "Oct 12", state: "done" },
      { label: "Review", detail: "Aetna, day 2 of 5", time: "Now", state: "now" },
      { label: "Decision", detail: "Henry’s agent checks daily", time: "Next", state: "next" },
    ],
    fields: [
      { label: "Code", value: "CPT 70553" },
      { label: "Attached", value: "Note, memory test scores" },
      { label: "Est. cost", value: "$310" },
    ],
    actions: ["View packet", "Open in Payments"],
  },
  {
    id: "lily-intake",
    dir: "out",
    party: "agent",
    who: "Lily’s agent",
    kind: "Form",
    title: "EEG intake form",
    patient: "Lily Park",
    time: "Oct 23",
    status: "filling",
    steps: [
      { label: "Sent", detail: "Ahead of her Oct 29 EEG", time: "Oct 23", state: "done" },
      { label: "Opened", detail: "Lily’s agent started it", time: "Oct 23", state: "done" },
      { label: "Filling", detail: "9 of 12 answered from Lily’s records", time: "Now", state: "now" },
      { label: "Back", detail: "Files to the chart when done", time: "Next", state: "next" },
    ],
    fields: [
      { label: "Answered", value: "9 of 12" },
      { label: "Asked Lily", value: "3 questions" },
      { label: "Visit", value: "Oct 29, 1:30" },
    ],
    actions: ["Preview answers", "Message Lily"],
  },
  {
    id: "daniel-level",
    dir: "out",
    party: "agent",
    who: "Daniel’s agent",
    kind: "Lab results",
    title: "Levetiracetam level, explained",
    patient: "Daniel Okafor",
    time: "Oct 22",
    status: "read",
    steps: [
      { label: "Reviewed", detail: "Signed off by Dr. Patel", time: "Oct 22", state: "done" },
      { label: "Delivered", detail: "With a plain-language note", time: "Oct 22", state: "done" },
      { label: "Read", detail: "Daniel’s agent shared it with him", time: "Oct 22", state: "done" },
      { label: "Closed", detail: "No follow-up needed", time: "Oct 22", state: "done" },
    ],
    fields: [
      { label: "Level", value: "22 mcg/mL, in range" },
      { label: "Note", value: "No change, recheck in a year" },
      { label: "Questions", value: "None" },
    ],
    actions: ["View results", "Message Daniel"],
  },
];

const CHANNEL: Record<Party, string> = {
  agent: "Doe agent network",
  clinic: "Kno2 Direct",
  payer: "Payer portal",
  lab: "Kno2 Direct",
};

const needsYou = (d: Doc) => d.status === "review" || d.status === "sign";
const pagesOf = (d: Doc) => (d.title.length % 5) + 1;
const fileOf = (d: Doc) => `${d.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}.pdf`;

/** The inspector takes the tone of the document's status, like a visit box in Schedule. */
const STATUS_TONE: Record<Status, string> = {
  filed: "#EEF1E6",
  review: "#FBEDE4",
  sign: "#F8F0DA",
  delivered: "#FAF6EC",
  read: "#EEF1E6",
  filling: "#F8F0DA",
  stalled: "#FBEDE4",
};

function Arrow({ dir, size = 14 }: { dir: Direction; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
      <path d={dir === "in" ? "M17 7L7 17M7 9v8h8" : "M7 17L17 7M9 7h8v8"} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Caret() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
      <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** A sender or recipient: a soft square with their initial, tinted by what kind of party they are. */
/** A sender or recipient: a soft round mark with their initial, tinted by what kind of party they are. */
function Avatar({ doc, size = 32 }: { doc: Doc; size?: number }) {
  return (
    <span
      className={`shrink-0 flex items-center justify-center rounded-[999px] text-[13px] leading-[16px] ${SANS} font-[600] text-walnut`}
      style={{ width: size, height: size, backgroundColor: PARTIES[doc.party].tone }}
    />
  );
}

function Pill({ status }: { status: Status }) {
  const s = STATUS[status];
  return (
    <span className={`flex items-center h-[28px] px-[12px] rounded-[999px] text-[13px] leading-[18px] ${SANS} font-[500] whitespace-nowrap`} style={{ backgroundColor: s.background, color: s.color }}>
      {s.label}
    </span>
  );
}

/** A filter pill that opens a short list of choices in a soft box below it. */
function Menu<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: { id: T; label: string }[]; onChange: (v: T) => void }) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.id === value)!;
  return (
    <span className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-[8px] h-[38px] px-[16px] rounded-[999px] bg-[#28191014] hover:bg-[#2819101F] transition-colors duration-150 text-[14px] leading-[18px] ${SANS} font-[500] text-walnut`}
      >
        <span className="text-sub">{label}</span>
        {current.label}
        <Caret />
      </button>
      {open && <button type="button" aria-label="Close menu" className="fixed inset-0 z-[4] cursor-default" onClick={() => setOpen(false)} />}
      {open && (
        <span className="absolute z-[5] top-[44px] right-0 min-w-[200px] flex flex-col gap-[2px] p-[6px] rounded-[20px] bg-[#F4EEDF]">
          {options.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => {
                onChange(o.id);
                setOpen(false);
              }}
              className={`flex items-center justify-between h-[36px] px-[12px] rounded-[14px] text-left text-[14px] leading-[18px] ${SANS} font-[500] text-walnut transition-colors duration-150 ${o.id === value ? "bg-paper" : "hover:bg-[#FAF6EC]"}`}
            >
              {o.label}
              {o.id === value && (
                <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
                  <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          ))}
        </span>
      )}
    </span>
  );
}

/** Four soft tiles in a row, joined like the stage row in Payments. */
function Stats() {
  const stats = [
    { label: "Received today", value: String(DOCS.filter((d) => d.dir === "in").length), note: `${DOCS.filter((d) => d.dir === "in" && d.party === "agent").length} from personal agents`, tone: "#F4EEDF" },
    { label: "Sent today", value: String(DOCS.filter((d) => d.dir === "out").length), note: "2 read within the hour", tone: "#F8D9C6" },
    { label: "Time to file", value: "1m 12s", note: "Median, arrival to chart", tone: "#ECE6DA" },
    { label: "Filed without you", value: "83%", note: "Up from 71% last month", tone: "#D6DEC6" },
  ];
  return (
    <div className="grid grid-cols-4 gap-[10px] h-[132px] shrink-0">
      {stats.map((t, i) => (
        <div
          key={t.label}
          className={`flex flex-col p-[18px_20px] ${i === 0 ? "rounded-l-[24px] rounded-r-[4px]" : i === stats.length - 1 ? "rounded-l-[4px] rounded-r-[24px]" : "rounded-[4px]"}`}
          style={{ backgroundColor: t.tone }}
        >
          <span className={`text-[13px] leading-[16px] ${SANS} font-[500] text-[rgba(40,25,16,0.7)]`}>{t.label}</span>
          <span className={`mt-[10px] text-[38px] leading-[40px] tracking-[-0.03em] ${DISPLAY} text-ink`}>{t.value}</span>
          <span className={`mt-auto text-[13px] leading-[18px] ${SANS} text-sub`}>{t.note}</span>
        </div>
      ))}
    </div>
  );
}

/** A white box in the inspector: a small title, then its contents. */
function Box({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col gap-[10px] p-[16px] rounded-[18px] bg-paper ${className}`}>
      <span className={`text-[13px] leading-[16px] ${SANS} font-[500] text-sub`}>{label}</span>
      {children}
    </div>
  );
}

/** The selected document in the same grey panel Payments opens: header, white boxes, then the two actions. */
function Inspector({ doc, onOpen, onClose }: { doc: Doc; onOpen: () => void; onClose: () => void }) {
  const meta = [
    { label: "From", value: doc.dir === "in" ? doc.who : "Brooks Neurology" },
    { label: "To", value: doc.dir === "in" ? "Chart" : doc.who },
    { label: "Patient", value: doc.patient },
    { label: "Channel", value: CHANNEL[doc.party] },
  ];
  const done = doc.steps.filter((x) => x.state === "done").length;

  return (
    <div className="flex flex-col min-h-[0px] h-full gap-[12px] p-[20px] rounded-[28px] bg-[#FAF6EC]">
      <div className="flex items-center gap-[12px]">
        <Avatar doc={doc} size={44} />
        <span className="flex flex-col grow min-w-[0px]">
          <span className={`truncate text-[26px] leading-[30px] tracking-[-0.02em] ${DISPLAY} text-walnut`}>{doc.patient}</span>
          <span className={`flex items-center gap-[6px] truncate text-[13px] leading-[17px] ${SANS} text-sub`}>
            <Arrow dir={doc.dir} size={12} />
            {doc.dir === "in" ? "Received" : "Sent"} {doc.time}
          </span>
        </span>
        <button type="button" aria-label="Close" onClick={onClose} className="w-[34px] h-[34px] shrink-0 flex items-center justify-center rounded-[999px] bg-[#28191014] hover:bg-[#2819101F] transition-colors duration-150">
          <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
            <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="#281910" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-[12px] shrink-0 p-[14px] rounded-[18px] bg-paper">
        <span className="w-[10px] h-[36px] shrink-0 rounded-[99px] bg-[#E8A585]" />
        <span className="flex flex-col grow min-w-[0px] gap-[2px]">
          <span className={`text-[12px] leading-[16px] ${SANS} font-[500] text-sub`}>{doc.who}</span>
          <span className={`truncate text-[18px] leading-[22px] tracking-[-0.01em] ${DISPLAY} text-walnut`}>{doc.title}</span>
        </span>
      </div>

      <div className="flex flex-col grow min-h-[0px] gap-[12px] overflow-y-auto overscroll-y-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="grid grid-cols-2 gap-x-[16px] gap-y-[10px] shrink-0 p-[16px] rounded-[18px] bg-paper">
          {meta.map((m) => (
            <span key={m.label} className="flex flex-col gap-[2px] min-w-[0px]">
              <span className={`text-[12px] leading-[16px] ${SANS} text-sub`}>{m.label}</span>
              <span className={`truncate text-[14px] leading-[18px] ${SANS} font-[500] text-walnut`}>{m.value}</span>
            </span>
          ))}
        </div>

        <Box label="Attachment" className="shrink-0">
          <div className="flex items-center gap-[12px]">
            <span className={`w-[36px] h-[44px] shrink-0 flex items-end justify-center pb-[6px] rounded-[10px] bg-sand text-[10px] leading-[12px] ${SANS} font-[700] tracking-[0.04em] text-walnut`}>PDF</span>
            <span className="flex flex-col grow min-w-[0px]">
              <span className={`truncate text-[14px] leading-[20px] ${SANS} font-[500] text-walnut`}>{fileOf(doc)}</span>
              <span className={`text-[13px] leading-[18px] ${SANS} text-sub`}>
                {pagesOf(doc)} {pagesOf(doc) === 1 ? "page" : "pages"}
              </span>
            </span>
            <button type="button" aria-label="Open attachment" className="w-[24px] h-[24px] shrink-0 flex items-center justify-center text-walnut opacity-70 hover:opacity-100 transition-opacity duration-150">
              <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
                <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" fill="none" stroke="#281910" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </Box>

        <div className="flex flex-col grow gap-[12px] p-[16px] rounded-[18px] bg-paper">
          <span className="flex items-center gap-[12px] shrink-0">
            <span className="flex grow gap-[3px]">
              {doc.steps.map((x) => (
                <span key={x.label} className="grow h-[4px] rounded-[99px]" style={{ backgroundColor: x.state === "done" ? "#6E9A5B" : x.state === "now" ? "#E8A585" : "#2819100F" }} />
              ))}
            </span>
            <span className={`shrink-0 text-[12px] leading-[16px] ${SANS} font-[500] text-sub [font-variant-numeric:tabular-nums]`}>
              {done} of {doc.steps.length} done
            </span>
          </span>
          <span className="flex flex-col grow">
            {doc.steps.map((x, i) => (
              <span key={x.label} className={`flex grow gap-[12px] px-[10px] -mx-[10px] rounded-[12px] ${x.state === "now" ? "bg-[#FBEDE4]" : ""}`}>
                <span className="flex flex-col items-center w-[12px] shrink-0 pt-[13px]">
                  <span
                    className="w-[12px] h-[12px] shrink-0 rounded-[999px]"
                    style={{
                      backgroundColor: x.state === "done" ? "#6E9A5B" : x.state === "now" ? "#E8A585" : "transparent",
                      border: x.state === "next" ? "1.5px solid #28191033" : undefined,
                    }}
                  />
                  {i < doc.steps.length - 1 && <span className="grow w-[1.5px] mt-[3px] -mb-[13px]" style={{ backgroundColor: x.state === "done" ? "#6E9A5B" : "#2819101A" }} />}
                </span>
                <span className="flex flex-col grow min-w-[0px] py-[9px]">
                  <span className={`flex items-center gap-[8px] text-[14px] leading-[20px] ${SANS} font-[500] ${x.state === "next" ? "text-sub" : "text-walnut"}`}>
                    <span className="truncate">{x.label}</span>
                    <span className="ml-auto shrink-0">
                      {x.state === "now" ? (
                        <span className={`flex items-center h-[20px] px-[8px] rounded-[999px] bg-[#E8A585] text-[11px] leading-[14px] ${SANS} font-[600] text-ink`}>Now</span>
                      ) : (
                        <span className={`text-[12px] leading-[16px] ${SANS} font-[400] text-sub [font-variant-numeric:tabular-nums]`}>{x.time}</span>
                      )}
                    </span>
                  </span>
                  <span className={`text-[13px] leading-[18px] ${SANS} ${x.state === "now" ? "text-[#B4572F]" : x.state === "next" ? "text-[#2819105C]" : "text-sub"}`}>{x.detail}</span>
                </span>
              </span>
            ))}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 gap-[8px]">
        <button type="button" onClick={onOpen} className={`grow h-[44px] rounded-[999px] bg-ink hover:bg-[#2B1D12] transition-colors duration-150 text-[14px] leading-[18px] ${SANS} font-[500] [color:#FFFCF1]`}>
          {needsYou(doc) ? "Open and fill" : doc.actions[0]}
        </button>
        <button type="button" className={`h-[44px] px-[18px] rounded-[999px] bg-[#28191014] hover:bg-[#2819101F] transition-colors duration-150 text-[14px] leading-[18px] ${SANS} font-[500] text-walnut`}>
          {doc.actions[1]}
        </button>
      </div>
    </div>
  );
}

type KindFilter = "all" | string;
type PartyFilter = "all" | Party;

const KINDS = Array.from(new Set(DOCS.map((d) => d.kind)));

/** One column of the pair: a header with the direction and count, then a compact table row per document. */
function Column({ dir, docs, selected, open, onPick }: { dir: Direction; docs: Doc[]; selected: string; open: boolean; onPick: (id: string) => void }) {
  return (
    <div className="flex flex-col min-w-[0px] min-h-[0px] rounded-[18px] bg-[#F4EEDF] overflow-hidden">
      <div className="flex items-center gap-[10px] shrink-0 px-[20px] pt-[16px] pb-[12px]">
        <span className={`w-[28px] h-[28px] shrink-0 flex items-center justify-center rounded-[999px] ${dir === "in" ? "bg-[#EEEADF] text-walnut" : "bg-ink [color:#FFFCF1]"}`}>
          <Arrow dir={dir} size={14} />
        </span>
        <span className={`text-[15px] leading-[20px] ${SANS} font-[600] text-walnut`}>{dir === "in" ? "Inbound" : "Outbound"}</span>
        <span className={`text-[13px] leading-[18px] ${SANS} font-[500] text-sub [font-variant-numeric:tabular-nums]`}>{docs.length}</span>
      </div>
      <div className="flex flex-col grow min-h-[0px] gap-[4px] px-[8px] pb-[8px] overflow-y-auto overscroll-y-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {docs.map((d) => {
          const on = open && d.id === selected;
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => onPick(d.id)}
              className={`flex items-center gap-[12px] h-[62px] shrink-0 px-[14px] rounded-[12px] bg-paper text-left outline outline-[1.5px] -outline-offset-[1.5px] transition-[outline-color] duration-150 ${on ? "outline-ink" : "outline-transparent hover:outline-[#28191026]"}`}
            >
              <Avatar doc={d} size={30} />
              <span className="flex flex-col grow min-w-[0px]">
                <span className={`truncate text-[15px] leading-[20px] tracking-[-0.01em] ${SANS} font-[500] text-ink`}>{d.title}</span>
                <span className={`truncate text-[12px] leading-[16px] ${SANS} text-sub`}>
                  {d.patient} · {d.who} · {d.time}
                </span>
              </span>
              <Pill status={d.status} />
            </button>
          );
        })}
        {docs.length === 0 && <span className={`px-[12px] py-[20px] text-[14px] leading-[18px] ${SANS} text-sub`}>No documents match these filters.</span>}
      </div>
    </div>
  );
}

export function DoeHealthProductTransitPage() {
  const [onlyYou, setOnlyYou] = useState(false);
  const [kind, setKind] = useState<KindFilter>("all");
  const [party, setParty] = useState<PartyFilter>("all");
  const first = DOCS.find((d) => d.dir === "in")!.id;
  const [open, setOpen] = useState<string | null>(first);
  const [shown, setShown] = useState(first);
  const [filling, setFilling] = useState<string | null>(null);

  const matches = (d: Doc) => (!onlyYou || needsYou(d)) && (kind === "all" || d.kind === kind) && (party === "all" || d.party === party);
  const inbound = DOCS.filter((d) => d.dir === "in" && matches(d));
  const outbound = DOCS.filter((d) => d.dir === "out" && matches(d));
  const doc = DOCS.find((d) => d.id === shown)!;
  const select = (id: string) => {
    setShown(id);
    setOpen(id);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !filling && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filling]);

  return (
    <div className="relative [font-synthesis:none] h-full w-full flex rounded-[24px] overflow-clip bg-paper antialiased">
      <div className="flex flex-col grow min-w-[0px] gap-[20px] pt-[36px] px-[40px] pb-[28px]">
        <div className="relative flex items-end justify-between">
          <span className={`text-[58px] leading-[62px] tracking-[-0.03em] ${DISPLAY} text-walnut`}>Transit</span>
          <span className="flex items-center gap-[10px]">
            <span className={`flex items-center gap-[8px] h-[40px] px-[16px] rounded-[999px] bg-[#EEEADF] text-[14px] leading-[18px] ${SANS} font-[500] text-walnut`}>
              <span className="w-[7px] h-[7px] rounded-[99px] bg-[#6E9A5B]" />
              Synced with Kno2
            </span>
            <span className={`flex items-center h-[40px] px-[18px] rounded-[999px] bg-ink text-[14px] leading-[18px] ${SANS} font-[500] [color:#FFFCF1]`}>Send document</span>
          </span>
        </div>

        <Stats />

        <div className="flex items-center justify-between gap-[12px] h-[38px] shrink-0">
          <button
            type="button"
            aria-pressed={onlyYou}
            onClick={() => setOnlyYou((v) => !v)}
            className={`flex items-center gap-[8px] h-[38px] px-[16px] rounded-[999px] text-[14px] leading-[18px] ${SANS} font-[500] transition-colors duration-150 ${onlyYou ? "bg-ink [color:#FFFCF1]" : "bg-[#28191014] hover:bg-[#2819101F] text-walnut"}`}
          >
            Needs you
            <span className={`flex items-center h-[20px] px-[7px] rounded-[999px] text-[12px] leading-[14px] text-ink ${onlyYou ? "bg-paper" : "bg-[#FCCFB8]"}`}>{DOCS.filter(needsYou).length}</span>
          </button>
          <span className="flex items-center gap-[8px]">
            <Menu<KindFilter> label="Type" value={kind} onChange={setKind} options={[{ id: "all", label: "All" }, ...KINDS.map((k) => ({ id: k, label: k }))]} />
            <Menu<PartyFilter>
              label="With"
              value={party}
              onChange={setParty}
              options={[{ id: "all", label: "Anyone" }, ...(Object.keys(PARTIES) as Party[]).filter((p) => DOCS.some((d) => d.party === p)).map((p) => ({ id: p, label: PARTIES[p].label }))]}
            />
          </span>
        </div>

        <div className="grid grid-cols-2 gap-[12px] grow min-h-[0px]">
          <Column dir="in" docs={inbound} selected={shown} open={open !== null} onPick={select} />
          <Column dir="out" docs={outbound} selected={shown} open={open !== null} onPick={select} />
        </div>
      </div>

      <div className="h-full shrink-0 overflow-hidden" style={{ width: open ? PANEL_W + 12 : 0, transition: `width ${MOVE}` }} aria-hidden={!open}>
        <div
          role="dialog"
          aria-label={doc.title}
          className="h-full py-[12px] pr-[12px]"
          style={{ width: PANEL_W + 12, opacity: open ? 1 : 0, transition: `opacity ${MOVE}`, pointerEvents: open ? "auto" : "none" }}
        >
          <Inspector key={doc.id} doc={doc} onOpen={() => setFilling(doc.id)} onClose={() => setOpen(null)} />
        </div>
      </div>

      {filling && <TransitFillModal key={filling} doc={DOCS.find((d) => d.id === filling)!} onClose={() => setFilling(null)} />}
    </div>
  );
}
