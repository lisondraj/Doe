"use client";

/**
 * Interface tab — where patients' personal agents reach the practice directly, without calls or email. Agents send
 * structured requests (book, reschedule, refill, a billing or prep question) and Doe answers or acts on them; calls
 * from people who still phone in are answered by the voice agents and land here too. A strip up top shows who is
 * answering right now. Below, a two-sided ledger: each exchange is one row, the request on the left and the
 * practice's answer on the right, and opening a row shows the whole exchange with a reply box.
 */
import { useState } from "react";

const DISPLAY = "font-['P22MackinacPro-Medium','P22_Mackinac_Pro',system-ui,sans-serif] font-[500]";
const SANS = "font-['DM_Sans',system-ui,sans-serif]";

type Channel = "agent" | "voice";
type Status = "resolved" | "you" | "progress" | "live";

const STATUS: Record<Status, { label: string; background: string; color: string; tone: string }> = {
  resolved: { label: "Resolved by Doe", background: "#D6DEC6", color: "#2F3B2A", tone: "#EEF1E6" },
  you: { label: "Needs you", background: "#FCCFB8", color: "#140C04", tone: "#FBEDE4" },
  progress: { label: "In progress", background: "#F3E2B4", color: "#281910", tone: "#F8F0DA" },
  live: { label: "Live call", background: "#140C04", color: "#FFFCF1", tone: "#FAF6EC" },
};

type Message =
  | { kind: "request"; fields: [string, string][] }
  | { kind: "them" | "doe"; text: string }
  | { kind: "event"; text: string };

type Thread = {
  id: string;
  /** How fast the practice answered, or how long the call ran. */
  speed: string;
  channel: Channel;
  from: string;
  patient: string;
  intent: string;
  summary: string;
  status: Status;
  time: string;
  messages: Message[];
  actions: [string, string];
};

const THREADS: Thread[] = [
  {
    id: "ruth-call",
    speed: "On call 2:14",
    channel: "voice",
    from: "(617) 555-0142",
    patient: "Ruth Alvarez",
    intent: "Book",
    summary: "Left leg numb since Friday, wants to be seen this week",
    status: "live",
    time: "Now",
    messages: [
      { kind: "them", text: "Hi, my left leg has been numb since Friday and my lower back aches. It’s not getting better." },
      { kind: "doe", text: "I’m sorry, Ruth. I can get you in with Dr. Brooks tomorrow at 3:00 or Thursday at 11:15. Which is better?" },
      { kind: "them", text: "Tomorrow at three, please." },
      { kind: "event", text: "June, your voice agent, is on the call" },
    ],
    actions: ["Open call", "Take over"],
  },
  {
    id: "henry-bill",
    speed: "Replied in 6s",
    channel: "agent",
    from: "Henry’s agent",
    patient: "Henry Walsh",
    intent: "Billing",
    summary: "Asks why the brain MRI bill is $310, wants a payment plan",
    status: "you",
    time: "10:31",
    messages: [
      { kind: "request", fields: [["Asks", "Explain the $310 brain MRI bill"], ["Visit", "Oct 12"], ["Plan", "Aetna"]] },
      { kind: "doe", text: "Aetna paid $1,890 of the $2,200 scan. The $310 left is Henry’s deductible. Itemized bill attached." },
      { kind: "them", text: "Thanks. Henry would like to split it over three months." },
      { kind: "event", text: "Payment plans need someone at the practice to approve" },
    ],
    actions: ["Offer 3-month plan", "Call Henry"],
  },
  {
    id: "maya-move",
    speed: "Replied in 4s",
    channel: "agent",
    from: "Maya’s agent",
    patient: "Maya Chen",
    intent: "Reschedule",
    summary: "Moved her migraine follow-up to Thu Oct 29 at 9:30",
    status: "resolved",
    time: "10:24",
    messages: [
      { kind: "request", fields: [["Wants", "Move the Nov 4 follow-up"], ["Times", "Thu or Fri, before noon"], ["Why", "Work travel"]] },
      { kind: "doe", text: "Dr. Chen has Thu Oct 29 at 9:30 or Fri Oct 30 at 10:15." },
      { kind: "them", text: "Thursday at 9:30 works." },
      { kind: "event", text: "Booked Thu Oct 29, 9:30 with Dr. Chen. Nov 4 released." },
    ],
    actions: ["Open in Schedule", "Message Maya"],
  },
  {
    id: "marcus-refill",
    speed: "Replied in 9s",
    channel: "agent",
    from: "Marcus’s agent",
    patient: "Marcus Webb",
    intent: "Refill",
    summary: "Gabapentin refill, 6 days of pills left",
    status: "you",
    time: "10:02",
    messages: [
      { kind: "request", fields: [["Medication", "Gabapentin 300 mg"], ["Left", "6 days"], ["Pharmacy", "CVS, Beacon St"]] },
      { kind: "doe", text: "Dr. Brooks raised Marcus to 600 mg at bedtime on Oct 24. I’ve drafted the refill at the new dose." },
      { kind: "event", text: "Refill drafted for Dr. Brooks to sign" },
    ],
    actions: ["Sign and send", "Open chart"],
  },
  {
    id: "lily-prep",
    speed: "Replied in 3s",
    channel: "agent",
    from: "Lily’s agent",
    patient: "Lily Park",
    intent: "Question",
    summary: "How much should she sleep before her EEG?",
    status: "resolved",
    time: "9:47",
    messages: [
      { kind: "request", fields: [["Asks", "Sleep the night before the EEG?"], ["Visit", "Oct 29, 1:30"]] },
      { kind: "doe", text: "It’s a sleep-deprived EEG, so keep Lily up until midnight and wake her at 5. No caffeine that morning, and wash her hair with no conditioner." },
      { kind: "them", text: "Got it, I’ve set a reminder for Lily." },
      { kind: "event", text: "Answered from Dr. Patel’s EEG prep instructions" },
    ],
    actions: ["View instructions", "Message Lily"],
  },
  {
    id: "noah-sleep",
    speed: "Replied in 5s",
    channel: "agent",
    from: "Noah’s agent",
    patient: "Noah Bennett",
    intent: "Book",
    summary: "Wants the sleep study booked once Mass General accepts",
    status: "progress",
    time: "9:30",
    messages: [
      { kind: "request", fields: [["Wants", "Sleep study, as soon as possible"], ["Days", "Any weekday after 4"]] },
      { kind: "doe", text: "The referral is with Mass General. I’ll book as soon as they accept and let you know." },
      { kind: "event", text: "Waiting on Mass General, nudged this morning" },
    ],
    actions: ["Open in Transit", "Message Noah"],
  },
  {
    id: "theo-call",
    speed: "Call, 2:41",
    channel: "voice",
    from: "(617) 555-0188",
    patient: "Theo Haddad",
    intent: "Reschedule",
    summary: "Dad moved Theo’s tic follow-up to Monday at 4:15",
    status: "resolved",
    time: "9:12",
    messages: [
      { kind: "them", text: "Hi, Theo has a soccer game Thursday, can we move his tic follow-up?" },
      { kind: "doe", text: "Of course. Monday at 4:15 with Dr. Shah is open. Shall I book it?" },
      { kind: "them", text: "Yes, thanks." },
      { kind: "event", text: "June booked Mon Nov 2, 4:15 and texted a confirmation" },
    ],
    actions: ["Open call", "Open in Schedule"],
  },
  {
    id: "grace-records",
    speed: "Replied in 7s",
    channel: "agent",
    from: "Grace’s agent",
    patient: "Grace Kim",
    intent: "Records",
    summary: "Sent her last two years of notes to her new physical therapist",
    status: "resolved",
    time: "8:58",
    messages: [
      { kind: "request", fields: [["Wants", "Visit notes, last 2 years"], ["Send to", "Brookline Physical Therapy"], ["Consent", "Signed in agent"]] },
      { kind: "doe", text: "Sent 6 visit notes to Brookline Physical Therapy through Transit." },
      { kind: "event", text: "Delivered, logged to Grace’s chart" },
    ],
    actions: ["Open in Transit", "Message Grace"],
  },
  {
    id: "cvs-call",
    speed: "Call, 1:12",
    channel: "voice",
    from: "CVS Pharmacy, Beacon St",
    patient: "Elena Cho",
    intent: "Question",
    summary: "Pharmacist asking to confirm topiramate dose",
    status: "you",
    time: "8:40",
    messages: [
      { kind: "them", text: "We have a topiramate script for Elena Cho, 25 mg at night. Can you confirm the dose?" },
      { kind: "doe", text: "I’ll have a clinician confirm and call you back within the hour." },
      { kind: "event", text: "Dose questions go to a clinician" },
    ],
    actions: ["Confirm 25 mg", "Open call"],
  },
];

const FILTERS: { id: "all" | Channel | "you"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "agent", label: "Agents" },
  { id: "voice", label: "Calls" },
  { id: "you", label: "Needs you" },
];

function Pill({ status }: { status: Status }) {
  const s = STATUS[status];
  return (
    <span className={`flex items-center gap-[6px] h-[26px] px-[10px] rounded-[999px] text-[12px] leading-[16px] ${SANS} font-[500] whitespace-nowrap`} style={{ backgroundColor: s.background, color: s.color }}>
      {status === "live" && <span className="w-[6px] h-[6px] rounded-[99px] bg-salmon" />}
      {s.label}
    </span>
  );
}

function Phone({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
      <path d="M5 4.5h3.2l1.6 4-2 1.3a10.5 10.5 0 0 0 6.4 6.4l1.3-2 4 1.6V19a1.5 1.5 0 0 1-1.6 1.5C10.6 20 4 13.4 3.5 6.1A1.5 1.5 0 0 1 5 4.5z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

/** Who's on the other end: a personal agent (their initial) or a phone call. */
function Mark({ t, size = 32 }: { t: Thread; size?: number }) {
  return (
    <span
      className={`shrink-0 flex items-center justify-center rounded-[999px] text-[13px] leading-[16px] ${SANS} font-[600] text-walnut`}
      style={{ width: size, height: size, backgroundColor: t.channel === "agent" ? "#F8DCCB" : "#E3E9D9" }}
    >
      {t.channel === "agent" ? t.from[0] : <Phone size={size * 0.44} />}
    </span>
  );
}

function Search({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <span className="flex items-center gap-[8px] w-[260px] h-[38px] px-[14px] rounded-[999px] bg-[#F4EEDF] text-sub">
      <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block", flexShrink: 0 }}>
        <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M16 16l4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search patients or agents"
        className={`grow min-w-[0px] bg-transparent outline-none text-[14px] leading-[18px] ${SANS} text-walnut placeholder:text-sub`}
      />
    </span>
  );
}

/** Who is answering right now, a few live numbers, and what's waiting on staff. */
function StatusBar({ needYou, onNeedYou }: { needYou: number; onNeedYou: () => void }) {
  const voice = [
    { name: "June", line: "On a call · 2:14", busy: true },
    { name: "Theo", line: "Ready", busy: false },
  ];
  const numbers = [
    { value: "312", label: "agents connected" },
    { value: "128", label: "requests today" },
    { value: "8s", label: "median reply" },
    { value: "91%", label: "resolved by Doe" },
  ];
  return (
    <div className="flex items-center gap-[24px] h-[68px] shrink-0 pl-[10px] pr-[12px] rounded-[22px] bg-[#FAF6EC]">
      <span className="flex items-center gap-[6px]">
        {voice.map((v) => (
          <span key={v.name} className="flex items-center gap-[10px] h-[48px] pl-[6px] pr-[14px] rounded-[16px] bg-paper">
            <span className="relative w-[36px] h-[36px] flex items-center justify-center rounded-[999px] bg-[#E3E9D9] text-walnut">
              <Phone />
              <span className={`absolute -right-[1px] -bottom-[1px] w-[11px] h-[11px] rounded-[999px] border-[2px] border-solid border-paper ${v.busy ? "bg-[#E8A585]" : "bg-[#6E9A5B]"}`} />
            </span>
            <span className="flex flex-col">
              <span className={`text-[14px] leading-[18px] ${SANS} font-[600] text-walnut`}>{v.name}</span>
              <span className={`text-[12px] leading-[16px] ${SANS} text-sub [font-variant-numeric:tabular-nums]`}>{v.line}</span>
            </span>
          </span>
        ))}
      </span>
      <span className="flex items-center gap-[28px] grow min-w-[0px]">
        {numbers.map((n) => (
          <span key={n.label} className="flex items-baseline gap-[8px] whitespace-nowrap">
            <span className={`text-[24px] leading-[28px] tracking-[-0.02em] ${DISPLAY} text-walnut [font-variant-numeric:tabular-nums]`}>{n.value}</span>
            <span className={`text-[13px] leading-[16px] ${SANS} text-sub`}>{n.label}</span>
          </span>
        ))}
      </span>
      <button
        type="button"
        onClick={onNeedYou}
        className={`flex items-center gap-[8px] h-[40px] px-[16px] rounded-[999px] bg-[#FCCFB8] hover:bg-[#F8C2A8] transition-colors duration-150 text-[14px] leading-[18px] ${SANS} font-[500] text-ink`}
      >
        <span className={`${DISPLAY} text-[16px]`}>{needYou}</span>
        waiting on staff
      </button>
    </div>
  );
}

function Check({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block", flexShrink: 0 }}>
      <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Clock({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block", flexShrink: 0 }}>
      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M12 8v4.5l3 2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const firstOf = (t: Thread, kind: "them" | "doe") => t.messages.find((m) => m.kind === kind) as { text: string } | undefined;
const outcomeOf = (t: Thread) => [...t.messages].reverse().find((m) => m.kind === "event") as { text: string } | undefined;
const requestOf = (t: Thread) => t.messages.find((m) => m.kind === "request") as { fields: [string, string][] } | undefined;

/** The whole exchange under an opened row, with a reply box and the row's two actions. */
function Exchange({ t, onOpenCall }: { t: Thread; onOpenCall?: () => void }) {
  const [reply, setReply] = useState("");
  const [sent, setSent] = useState<string[]>([]);
  const them = t.channel === "agent" ? t.from : t.patient.split(" ")[0]!;
  const doe = t.channel === "agent" ? "Doe" : "June";
  const send = () => {
    const text = reply.trim();
    if (!text) return;
    setSent((s) => [...s, text]);
    setReply("");
  };
  const act = (label: string) => label === "Open call" && onOpenCall?.();

  return (
    <div className="doe-menu-in grid grid-cols-[1fr_300px] gap-[16px] mt-[8px] p-[16px] rounded-[20px] bg-[#FAF6EC]">
      <div className="flex flex-col gap-[10px] min-w-[0px]">
        {t.messages
          .filter((m) => m.kind === "them" || m.kind === "doe")
          .map((m, i) => (
            <div key={i} className={`flex flex-col gap-[4px] max-w-[80%] ${m.kind === "doe" ? "self-end items-end" : "self-start items-start"}`}>
              <span className={`text-[11px] leading-[14px] ${SANS} font-[600] text-sub`}>{m.kind === "doe" ? doe : them}</span>
              <span
                className={`px-[14px] py-[10px] text-[14px] leading-[20px] ${SANS} ${m.kind === "doe" ? "rounded-[18px] rounded-br-[6px] bg-ink [color:#FFFCF1]" : "rounded-[18px] rounded-bl-[6px] bg-paper text-walnut"}`}
              >
                {(m as { text: string }).text}
              </span>
            </div>
          ))}
        {sent.map((text, i) => (
          <div key={`sent-${i}`} className="doe-menu-in flex flex-col gap-[4px] max-w-[80%] self-end items-end">
            <span className={`text-[11px] leading-[14px] ${SANS} font-[600] text-sub`}>You</span>
            <span className={`px-[14px] py-[10px] rounded-[18px] rounded-br-[6px] bg-walnut text-[14px] leading-[20px] ${SANS} [color:#FFFCF1]`}>{text}</span>
          </div>
        ))}
        <span className="flex items-center gap-[8px] h-[44px] mt-[4px] pl-[16px] pr-[4px] rounded-[999px] bg-paper">
          <input
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder={t.channel === "agent" ? `Reply to ${t.from}` : "Note for June"}
            className={`grow min-w-[0px] bg-transparent outline-none text-[14px] leading-[18px] ${SANS} text-walnut placeholder:text-sub`}
          />
          <button type="button" aria-label="Send" onClick={send} className="w-[36px] h-[36px] shrink-0 flex items-center justify-center rounded-[999px] bg-ink hover:bg-[#2B1D12] transition-colors duration-150">
            <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
              <path d="M12 19V5M6 11l6-6 6 6" fill="none" stroke="#FFFCF1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </span>
      </div>
      <div className="flex flex-col gap-[8px]">
        {requestOf(t) && (
          <div className="flex flex-col gap-[6px] p-[14px] rounded-[16px] bg-paper">
            {requestOf(t)!.fields.map(([k, v]) => (
              <span key={k} className="flex justify-between gap-[10px]">
                <span className={`text-[13px] leading-[18px] ${SANS} text-sub`}>{k}</span>
                <span className={`text-right text-[13px] leading-[18px] ${SANS} font-[500] text-walnut`}>{v}</span>
              </span>
            ))}
          </div>
        )}
        <button type="button" onClick={() => act(t.actions[0])} className={`h-[42px] rounded-[999px] bg-ink hover:bg-[#2B1D12] transition-colors duration-150 text-[14px] leading-[18px] ${SANS} font-[500] [color:#FFFCF1]`}>
          {t.actions[0]}
        </button>
        <button type="button" onClick={() => act(t.actions[1])} className={`h-[42px] rounded-[999px] bg-[#28191014] hover:bg-[#2819101F] transition-colors duration-150 text-[14px] leading-[18px] ${SANS} font-[500] text-walnut`}>
          {t.actions[1]}
        </button>
      </div>
    </div>
  );
}

function LedgerRow({ t, open, onToggle, onOpenCall }: { t: Thread; open: boolean; onToggle: () => void; onOpenCall?: () => void }) {
  const asked = firstOf(t, "them")?.text;
  const answer = firstOf(t, "doe")?.text;
  const outcome = outcomeOf(t)?.text;
  const waiting = t.status === "you";
  const done = t.status === "resolved";

  return (
    <div className="flex flex-col shrink-0">
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onToggle())}
        className="grid grid-cols-[1fr_96px_1fr] items-stretch text-left cursor-pointer outline-none group"
      >
        <span
          className={`flex flex-col gap-[10px] min-w-[0px] p-[16px] rounded-[20px] outline outline-[1.5px] -outline-offset-[1.5px] transition-[outline-color] duration-150 ${open ? "outline-ink" : "outline-transparent group-hover:outline-[#28191026]"}`}
          style={{ backgroundColor: t.channel === "agent" ? "#FBEDE4" : "#EEF1E6" }}
        >
          <span className="flex items-center gap-[10px] min-w-[0px]">
            <Mark t={t} size={28} />
            <span className={`truncate text-[14px] leading-[18px] ${SANS} font-[600] text-walnut`}>{t.channel === "agent" ? t.from : t.patient}</span>
            <span className={`truncate text-[12px] leading-[16px] ${SANS} text-sub`}>{t.channel === "agent" ? t.patient : t.from}</span>
            <span className={`ml-auto flex items-center h-[22px] px-[9px] shrink-0 rounded-[999px] bg-[#FFFCF1B3] text-[12px] leading-[16px] ${SANS} font-[500] text-walnut`}>{t.intent}</span>
          </span>
          {requestOf(t) ? (
            <span className="grid grid-cols-[auto_1fr] gap-x-[12px] gap-y-[3px]">
              {requestOf(t)!.fields.map(([k, v]) => (
                <span key={k} className="contents">
                  <span className={`text-[13px] leading-[19px] ${SANS} text-sub`}>{k}</span>
                  <span className={`truncate text-[14px] leading-[19px] ${SANS} font-[500] text-ink`}>{v}</span>
                </span>
              ))}
            </span>
          ) : (
            <span className={`text-[14px] leading-[20px] ${SANS} text-ink`}>“{asked}”</span>
          )}
        </span>

        <span className="relative flex flex-col items-center justify-center gap-[2px]">
          <span className="absolute left-[10px] right-[10px] top-1/2 h-[2px] rounded-[99px] bg-[#2819100F]" />
          <span className={`relative flex flex-col items-center px-[8px] py-[4px] rounded-[12px] bg-paper`}>
            <span className={`text-[13px] leading-[16px] ${SANS} font-[600] text-walnut [font-variant-numeric:tabular-nums]`}>{t.time}</span>
            <span className={`text-[11px] leading-[14px] ${SANS} text-sub whitespace-nowrap`}>{t.speed.replace("Replied in ", "")}</span>
          </span>
        </span>

        <span
          className={`flex flex-col gap-[10px] min-w-[0px] p-[16px] rounded-[20px] ${waiting ? "border-[1.5px] border-dashed border-[#E8A585]" : "border-[1.5px] border-solid border-transparent"}`}
          style={{ backgroundColor: waiting ? "#FFFCF1" : "#FAF6EC" }}
        >
          <span className="flex items-center gap-[10px]">
            <span className={`w-[28px] h-[28px] shrink-0 flex items-center justify-center rounded-[999px] ${t.channel === "agent" ? "bg-ink" : "bg-[#E3E9D9]"}`}>
              {t.channel === "agent" ? <span className={`text-[13px] leading-[13px] ${DISPLAY} [color:#FFFCF1]`}>D</span> : <span className="text-walnut"><Phone size={12} /></span>}
            </span>
            <span className={`text-[14px] leading-[18px] ${SANS} font-[600] text-walnut`}>{t.channel === "agent" ? "Doe" : "June"}</span>
            <span className={`text-[12px] leading-[16px] ${SANS} text-sub`}>{t.channel === "agent" ? "for your clinic" : "voice agent"}</span>
            <span className="ml-auto">
              <Pill status={t.status} />
            </span>
          </span>
          <span className={`text-[14px] leading-[20px] ${SANS} text-[rgba(40,25,16,0.82)] line-clamp-2`}>{t.status === "live" ? "Booking Ruth with Dr. Brooks, tomorrow at 3:00" : answer}</span>
          <span className="flex items-center justify-between gap-[12px] mt-auto">
            {outcome && (
              <span className={`flex items-center gap-[6px] min-w-[0px] text-[13px] leading-[18px] ${SANS} font-[500] ${done ? "text-[#3F6431]" : "text-walnut"}`}>
                {done ? <Check /> : <Clock />}
                <span className="truncate">{outcome}</span>
              </span>
            )}
            {(waiting || t.status === "live") && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (t.actions[0] === "Open call") onOpenCall?.();
                  else onToggle();
                }}
                className={`shrink-0 h-[32px] px-[14px] rounded-[999px] bg-ink hover:bg-[#2B1D12] transition-colors duration-150 text-[13px] leading-[16px] ${SANS} font-[500] [color:#FFFCF1]`}
              >
                {t.actions[0]}
              </button>
            )}
          </span>
        </span>
      </div>
      {open && <Exchange t={t} onOpenCall={onOpenCall} />}
    </div>
  );
}

export function DoeHealthProductInterfacePage({ onOpenCall }: { onOpenCall?: () => void } = {}) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const q = query.trim().toLowerCase();
  const threads = THREADS.filter(
    (t) => (filter === "all" || (filter === "you" ? t.status === "you" : t.channel === filter)) && (!q || `${t.from} ${t.patient} ${t.intent}`.toLowerCase().includes(q)),
  );
  const needYou = THREADS.filter((t) => t.status === "you").length;
  const sections = [
    { label: "Live", rows: threads.filter((t) => t.status === "live") },
    { label: "Today", rows: threads.filter((t) => t.status !== "live") },
  ].filter((x) => x.rows.length);

  return (
    <div className="relative [font-synthesis:none] h-full w-full flex flex-col gap-[18px] pt-[36px] px-[40px] pb-[28px] rounded-[24px] overflow-clip bg-paper antialiased">
      <div className="relative flex items-end justify-between">
        <span className={`text-[58px] leading-[62px] tracking-[-0.03em] ${DISPLAY} text-walnut`}>Interface</span>
        <span className="flex items-center gap-[10px]">
          <span className={`flex items-center h-[40px] px-[18px] rounded-[999px] bg-[#28191014] text-[14px] leading-[18px] ${SANS} font-[500] text-walnut`}>Response rules</span>
          <button type="button" className={`flex items-center h-[40px] px-[18px] rounded-[999px] bg-ink hover:bg-[#2B1D12] transition-colors duration-150 text-[14px] leading-[18px] ${SANS} font-[500] [color:#FFFCF1]`}>
            Add voice agent
          </button>
        </span>
      </div>

      <StatusBar needYou={needYou} onNeedYou={() => setFilter("you")} />

      <div className="flex items-center justify-between gap-[12px] shrink-0">
        <span className="flex p-[3px] gap-[2px] rounded-[999px] bg-[#F4EEDF]">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`flex items-center gap-[8px] h-[32px] px-[16px] rounded-[999px] text-[13px] leading-[16px] ${SANS} font-[500] transition-colors duration-150 ${filter === f.id ? "bg-paper text-ink" : "text-sub hover:text-walnut"}`}
            >
              {f.label}
              {f.id === "you" && <span className="flex items-center h-[18px] px-[7px] rounded-[999px] bg-[#FCCFB8] text-[12px] leading-[14px] text-ink">{needYou}</span>}
            </button>
          ))}
        </span>
        <Search value={query} onChange={setQuery} />
      </div>

      <div className="flex flex-col grow min-h-[0px] gap-[10px] overflow-y-auto overscroll-y-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className={`grid grid-cols-[1fr_96px_1fr] shrink-0 px-[4px] text-[13px] leading-[16px] ${SANS} font-[500] text-sub`}>
          <span>Request</span>
          <span className="text-center">Time</span>
          <span>Response</span>
        </div>
        {sections.map((sec) => (
          <div key={sec.label} className="flex flex-col gap-[10px] shrink-0">
            <span className={`flex items-center gap-[10px] pt-[4px] text-[15px] leading-[20px] ${SANS} font-[600] text-walnut`}>
              {sec.label === "Live" && <span className="w-[7px] h-[7px] rounded-[99px] bg-salmon" />}
              {sec.label}
              <span className={`text-[13px] font-[500] text-sub`}>{sec.rows.length}</span>
            </span>
            {sec.rows.map((t) => (
              <LedgerRow key={t.id} t={t} open={open === t.id} onToggle={() => setOpen((cur) => (cur === t.id ? null : t.id))} onOpenCall={onOpenCall} />
            ))}
          </div>
        ))}
        {threads.length === 0 && <span className={`px-[4px] py-[16px] text-[14px] leading-[18px] ${SANS} text-sub`}>Nothing matches.</span>}
      </div>
    </div>
  );
}
