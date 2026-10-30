"use client";

/**
 * /demo/clinic — Dr. Brooks' side of /demo: a simple /doehealthproduct with a brown rail and a cream shell. The
 * clinic sees the personal agents working on its patients' behalf, answers and counters them, and reviews the
 * forms they pass back.
 */
import { type ReactNode, useState } from "react";

import "@/lib/doehealthproduct/doehealthproduct.css";
import { Check, DISPLAY } from "@/components/demo/DemoFrame";
import { DemoSphere } from "@/components/demo/DemoSphere";
import { ASSESSMENTS } from "@/lib/demo/demo-assessments";
import { BUNDLES, CLINIC, INTAKE_FIELDS, SERVICES, money } from "@/lib/demo/demo-clinic";
import { dmSans, lora } from "@/lib/home/fonts";

type Tab = "overview" | "inbox" | "schedule" | "services" | "forms";
type Status = "Negotiating" | "Holding" | "Question" | "Ready to confirm" | "Booked";

type Line = { from: "agent" | "clinic"; text: string };
type Request = {
  id: string;
  user: string;
  want: string;
  status: Status;
  detail: string;
  time: string;
  value: number;
  network: boolean;
  thread: Line[];
};

const STATUS_TONE: Record<Status, string> = {
  Negotiating: "#FCCFB8",
  Holding: "#F3E7C9",
  Question: "#E9DCC7",
  "Ready to confirm": "#E3E9D9",
  Booked: "#DCE5D0",
};

const REQUESTS: Request[] = [
  {
    id: "alex",
    user: "Alex Rivera",
    want: "Botox for chronic migraine",
    status: "Negotiating",
    detail: "Proposed $1,275 · you countered $1,335",
    time: "2 min ago",
    value: 1335,
    network: true,
    thread: [
      { from: "agent", text: "Can you do $1,275 for Botox for chronic migraine?" },
      { from: "clinic", text: "Dr. Brooks can't go to $1,275, but I can do $1,335 if it's booked this week." },
    ],
  },
  {
    id: "priya",
    user: "Priya Nair",
    want: "Start bundle",
    status: "Holding",
    detail: "Held Wed Nov 4, 10:00 am · Dr. Brooks",
    time: "6 min ago",
    value: 1650,
    network: true,
    thread: [
      { from: "agent", text: "Holding Wednesday at 10:00 am for my user while they confirm." },
      { from: "clinic", text: "Held for 10 minutes. Send the request when they're ready." },
    ],
  },
  {
    id: "marcus",
    user: "Marcus Lee",
    want: "Year of relief",
    status: "Question",
    detail: "Asked about splitting the payment",
    time: "14 min ago",
    value: 5200,
    network: false,
    thread: [{ from: "agent", text: "Can my user split the Year of relief bundle into monthly payments instead of four?" }],
  },
  {
    id: "sofia",
    user: "Sofia García",
    want: "Occipital nerve block",
    status: "Ready to confirm",
    detail: "Intake returned · slot held Thu 9:45 am",
    time: "21 min ago",
    value: 295,
    network: true,
    thread: [
      { from: "agent", text: "Passing back the new patient intake, signed by my user." },
      { from: "agent", text: "Booking request: Occipital nerve block, Thu Nov 5 at 9:45 am with Dr. Lin Chen." },
    ],
  },
  {
    id: "daniel",
    user: "Daniel Kim",
    want: "Headache consultation",
    status: "Booked",
    detail: "Mon Nov 2, 9:00 am · Dr. Brooks",
    time: "1 hr ago",
    value: 350,
    network: false,
    thread: [
      { from: "agent", text: "Booking request: Headache consultation, Mon Nov 2 at 9:00 am." },
      { from: "clinic", text: "Confirmed. Reminders go to you 48 and 2 hours before." },
    ],
  },
];

const TODAY = [
  { time: "8:30 am", user: "Hannah Ortiz", service: "Botox for chronic migraine", provider: "Dr. Sarah Brooks", source: "Agent" },
  { time: "9:15 am", user: "Leo Martin", service: "Follow-up visit", provider: "Dr. Lin Chen", source: "Phone" },
  { time: "10:00 am", user: "Ama Owusu", service: "Start bundle", provider: "Dr. Sarah Brooks", source: "Agent" },
  { time: "11:30 am", user: "Grace Liu", service: "Occipital nerve block", provider: "Dr. Lin Chen", source: "Agent" },
  { time: "1:00 pm", user: "Omar Haddad", service: "Botox for chronic migraine", provider: "Dr. Sarah Brooks", source: "Agent" },
  { time: "2:45 pm", user: "Emma Wilson", service: "Virtual follow-up", provider: "Dr. Sarah Brooks", source: "Web" },
  { time: "4:00 pm", user: "Noah Singh", service: "Trigger point injections", provider: "Dr. Lin Chen", source: "Agent" },
];

type Score = { name: string; score: string; band: string; tone: string };

/** Each patient's own answers where they differ from the demo intake. */
const FORMS_IN: { user: string; status: "In progress" | "Returned"; when: string; own?: Record<string, string>; scores: Score[] }[] = [
  { user: "Alex Rivera", status: "In progress", when: "Now", scores: [] },
  {
    user: "Sofia García",
    status: "Returned",
    when: "21 min ago",
    own: { dob: "1994-09-02", phone: "(416) 555-0163", email: "sofia.garcia@example.com", tried: "Amitriptyline", acute: "Rizatriptan 10 mg as needed" },
    scores: [
      { name: "ID-Migraine", score: "3 of 3", band: "Positive", tone: "#FCCFB8" },
      { name: "MIDAS", score: "14", band: "Grade III", tone: "#F3E7C9" },
      { name: "HIT-6", score: "58", band: "Substantial", tone: "#F3E7C9" },
      { name: "ICHD-3", score: "Not met", band: "Episodic", tone: "#E3E9D9" },
    ],
  },
  {
    user: "Priya Nair",
    status: "Returned",
    when: "1 hr ago",
    own: { dob: "1985-01-23", phone: "(905) 555-0127", email: "priya.nair@example.com", tried: "Topiramate, candesartan, erenumab", acute: "Eletriptan 40 mg as needed" },
    scores: [
      { name: "ID-Migraine", score: "2 of 3", band: "Positive", tone: "#FCCFB8" },
      { name: "MIDAS", score: "23", band: "Grade IV", tone: "#FCCFB8" },
      { name: "HIT-6", score: "64", band: "Severe", tone: "#FCCFB8" },
      { name: "ICHD-3", score: "Meets", band: "Botox eligible", tone: "#FCCFB8" },
    ],
  },
];

const ASSESSMENT_NAMES = ASSESSMENTS.map((a) => a.name);

const TABS: { id: Tab; label: string; icon: ReactNode }[] = [
  {
    id: "overview",
    label: "Overview",
    icon: (
      <>
        <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <rect x="13" y="3.5" width="7.5" height="7.5" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <rect x="3.5" y="13" width="17" height="7.5" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
      </>
    ),
  },
  {
    id: "inbox",
    label: "Agent inbox",
    icon: (
      <>
        <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h7A2.5 2.5 0 0 1 16 6.5v4a2.5 2.5 0 0 1-2.5 2.5H9l-3.5 3v-3h0A1.5 1.5 0 0 1 4 11.5z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M19 9.5a1.5 1.5 0 0 1 1 1.4v4.6a1.5 1.5 0 0 1-1.5 1.5H18v3l-3.5-3H12" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    id: "schedule",
    label: "Schedule",
    icon: (
      <>
        <rect x="3.5" y="5" width="17" height="15" rx="3" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <path d="M3.5 10h17M8 3v4M16 3v4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </>
    ),
  },
  {
    id: "services",
    label: "Services",
    icon: (
      <>
        <path d="M9 7h10M9 12h10M9 17h10" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <circle cx="5" cy="7" r="1.2" fill="currentColor" />
        <circle cx="5" cy="12" r="1.2" fill="currentColor" />
        <circle cx="5" cy="17" r="1.2" fill="currentColor" />
      </>
    ),
  },
  {
    id: "forms",
    label: "Forms",
    icon: (
      <>
        <rect x="5" y="3.5" width="14" height="17" rx="3" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <path d="M8.5 8.5h7M8.5 12h7M8.5 15.5h4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </>
    ),
  },
];

export function DemoClinicDashboard() {
  const [tab, setTab] = useState<Tab>("overview");
  const [requests, setRequests] = useState(REQUESTS);
  const [openId, setOpenId] = useState(REQUESTS[0]!.id);
  const [agentBookable, setAgentBookable] = useState(() => Object.fromEntries([...SERVICES, ...BUNDLES].map((s) => [s.id, s.id !== "virtual"])));
  const waiting = requests.filter((r) => r.status !== "Booked").length;

  const update = (id: string, patch: Partial<Request>, line?: Line) =>
    setRequests((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch, time: "Just now", thread: line ? [...r.thread, line] : r.thread } : r)));

  const openRequest = (id: string) => {
    setOpenId(id);
    setTab("inbox");
  };

  const page: Record<Tab, ReactNode> = {
    overview: <Overview requests={requests} onOpen={openRequest} />,
    inbox: <Inbox requests={requests} openId={openId} onOpen={setOpenId} onUpdate={update} />,
    schedule: <Schedule />,
    services: <Services bookable={agentBookable} onToggle={(id) => setAgentBookable((b) => ({ ...b, [id]: !b[id] }))} />,
    forms: <Forms />,
  };

  return (
    <div
      className={`${dmSans.className} doehealth-product-page fixed inset-0 flex bg-[#140C04] text-[#281910] antialiased [font-synthesis:none]`}
      style={{
        paddingTop: "max(8px, env(safe-area-inset-top))",
        paddingBottom: "max(8px, env(safe-area-inset-bottom))",
        paddingRight: "max(8px, env(safe-area-inset-right))",
        paddingLeft: "env(safe-area-inset-left)",
      }}
    >
      {/* Desktop rail, as in /doehealthproduct: icons, with labels on wide screens. */}
      <nav className="hidden md:flex flex-col shrink-0 w-[64px] lg:w-[220px] px-[12px] pt-[18px] pb-[16px] gap-[8px]">
        <div className="flex items-center gap-[10px] h-[40px] mb-[24px]">
          <span className={`${lora.className} w-[40px] text-center text-[28px] leading-[28px] font-[600] text-[#FFFCF1]`}>D</span>
          <span className="hidden lg:flex flex-col min-w-0">
            <span className="truncate text-[13px] leading-[16px] font-[600] text-[#FFFCF1]">Brooks Migraine</span>
            <span className="truncate text-[11.5px] leading-[14px] text-[#FFFCF180]">Toronto</span>
          </span>
        </div>
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            aria-current={tab === t.id ? "page" : undefined}
            onClick={() => setTab(t.id)}
            className={`flex items-center h-[40px] rounded-[10px] transition-colors duration-200 ${tab === t.id ? "bg-[#FFFCF11A] text-[#FFFCF1]" : "text-[#FFFCF1B3] hover:text-[#FFFCF1]"}`}
          >
            <span className="w-[40px] h-[40px] shrink-0 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                {t.icon}
              </svg>
            </span>
            <span className="hidden lg:block text-[14px] font-[500]">{t.label}</span>
            {t.id === "inbox" && waiting > 0 && (
              <span className="hidden lg:flex ml-auto mr-[10px] min-w-[20px] h-[20px] px-[6px] items-center justify-center rounded-full bg-[#E8704A] text-[11px] font-[700] text-[#FFFCF1]">{waiting}</span>
            )}
          </button>
        ))}
        <div className="mt-auto flex items-center gap-[10px] h-[48px]">
          <span className="w-[40px] flex justify-center">
            <span className="w-[32px] h-[32px] rounded-full bg-[#E8A585] flex items-center justify-center text-[12px] font-[700] text-[#281910]">SB</span>
          </span>
          <span className="hidden lg:flex flex-col min-w-0">
            <span className="truncate text-[14px] leading-[18px] font-[600] text-[#FFFCF1]">{CLINIC.doctor}</span>
            <span className="truncate text-[12px] leading-[16px] text-[#FFFCF199]">Owner</span>
          </span>
        </div>
      </nav>

      <div className="relative grow min-w-0 h-full ml-[8px] md:ml-0 overflow-clip rounded-[38px] md:rounded-[24px] bg-[#FFFCF1]">
        <div className="absolute inset-0 overflow-y-auto overscroll-contain">
          {/* Phone: Doe mark and the tabs as pills. */}
          <div className="md:hidden sticky top-0 z-20 bg-[#FFFCF1E6] backdrop-blur-[12px]">
            <div className="flex items-center justify-between h-[60px] px-[22px]">
              <span className={`${lora.className} text-[26px] leading-[30px] font-[600]`}>Doe</span>
              <span className="text-[12px] font-[600] text-[#2819109E]">Clinic view</span>
            </div>
            <div className="flex gap-[6px] overflow-x-auto px-[16px] pb-[10px] [scrollbar-width:none]">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`shrink-0 h-[34px] px-[14px] rounded-full text-[13px] font-[600] ${tab === t.id ? "bg-[#140C04] text-[#FFFCF1]" : "bg-[#F4EEDF]"}`}
                >
                  {t.label}
                  {t.id === "inbox" && waiting > 0 ? ` · ${waiting}` : ""}
                </button>
              ))}
            </div>
          </div>
          <div key={tab} className="doe-menu-in px-[16px] md:px-[28px] pt-[8px] md:pt-[28px] pb-[32px] max-w-[1320px]">
            {page[tab]}
          </div>
        </div>
      </div>
    </div>
  );
}

function Title({ kicker, children, right }: { kicker?: string; children: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-[12px] mb-[16px]">
      <div className="flex flex-col gap-[2px] min-w-0">
        {kicker && <span className="text-[12px] leading-[16px] font-[500] text-[#28191080]">{kicker}</span>}
        <h1 className={`${DISPLAY} text-[28px] leading-[32px] md:text-[34px] md:leading-[38px] tracking-[-0.02em]`}>{children}</h1>
      </div>
      {right}
    </div>
  );
}

function Card({ title, children, className = "" }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-[22px] bg-[#F4EEDF] p-[6px] ${className}`}>
      {title && <div className="px-[12px] pt-[10px] pb-[8px] text-[13px] font-[600]">{title}</div>}
      {children}
    </div>
  );
}

function StatusChip({ status }: { status: Status }) {
  return (
    <span className="shrink-0 h-[24px] px-[10px] flex items-center rounded-full text-[11.5px] font-[700]" style={{ backgroundColor: STATUS_TONE[status] }}>
      {status}
    </span>
  );
}

function Overview({ requests, onOpen }: { requests: Request[]; onOpen: (id: string) => void }) {
  const open = requests.filter((r) => r.status !== "Booked");
  return (
    <>
      <Title kicker={CLINIC.name} right={<DemoSphere size={64} className="hidden sm:block" />}>
        Good afternoon, Dr. Brooks
      </Title>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-[6px]">
        {[
          ["Agent sessions", "38"],
          ["Agent bookings", "12 / 17"],
          ["Booked revenue", money(14820)],
          ["Reply to agents", "2m 40s"],
        ].map(([k, v]) => (
          <div key={k} className="rounded-[20px] bg-[#F4EEDF] p-[16px]">
            <div className="text-[12px] leading-[16px] text-[#2819109E]">{k}</div>
            <div className={`${DISPLAY} mt-[6px] text-[28px] leading-[32px]`}>{v}</div>
          </div>
        ))}
      </div>
      <div className="mt-[12px] grid grid-cols-1 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-[12px]">
        <Card title={`Waiting on you · ${open.length}`}>
          <div className="flex flex-col gap-[4px]">
            {open.map((r) => (
              <button key={r.id} type="button" onClick={() => onOpen(r.id)} className="flex items-center gap-[12px] p-[12px] rounded-[16px] bg-[#FFFCF1] text-left hover:bg-[#FFFCF1CC] transition-colors duration-150">
                <span className="grow min-w-0">
                  <span className="block truncate text-[14px] font-[600]">
                    {r.user} <span className="font-[500] text-[#2819109E]">· {r.want}</span>
                  </span>
                  <span className="block truncate text-[12.5px] text-[#2819109E]">{r.detail}</span>
                </span>
                <StatusChip status={r.status} />
              </button>
            ))}
          </div>
        </Card>
        <Card title="Today">
          <div className="flex flex-col gap-[4px]">
            {TODAY.slice(0, 5).map((a) => (
              <div key={a.time} className="flex items-center gap-[12px] p-[12px] rounded-[16px] bg-[#FFFCF1]">
                <span className="w-[64px] shrink-0 text-[13px] font-[700]">{a.time}</span>
                <span className="grow min-w-0">
                  <span className="block truncate text-[13.5px] font-[600]">{a.user}</span>
                  <span className="block truncate text-[12px] text-[#2819109E]">{a.service}</span>
                </span>
                {a.source === "Agent" && <span className="shrink-0 h-[22px] px-[8px] flex items-center rounded-full bg-[#F4EEDF] text-[11px] font-[600]">Agent</span>}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

function Inbox({
  requests,
  openId,
  onOpen,
  onUpdate,
}: {
  requests: Request[];
  openId: string;
  onOpen: (id: string) => void;
  onUpdate: (id: string, patch: Partial<Request>, line?: Line) => void;
}) {
  const r = requests.find((x) => x.id === openId) ?? requests[0]!;
  const [counter, setCounter] = useState("");
  const [reply, setReply] = useState("");
  return (
    <>
      <Title>Agent inbox</Title>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-[12px]">
        <Card>
          <div className="flex flex-col gap-[4px]">
            {requests.map((x) => (
              <button
                key={x.id}
                type="button"
                onClick={() => onOpen(x.id)}
                className={`flex items-start gap-[12px] p-[12px] rounded-[16px] text-left transition-colors duration-150 ${x.id === r.id ? "bg-[#FFFCF1] ring-[1.5px] ring-[#140C04]" : "bg-[#FFFCF1] hover:bg-[#FFFCF1CC]"}`}
              >
                <span className="grow min-w-0">
                  <span className="flex items-baseline justify-between gap-[8px]">
                    <span className="truncate text-[14px] font-[600]">{x.user}</span>
                    <span className="shrink-0 text-[11.5px] text-[#28191080]">{x.time}</span>
                  </span>
                  <span className="block truncate text-[12.5px] text-[#2819109E]">
                    {x.want} · {x.detail}
                  </span>
                </span>
                <StatusChip status={x.status} />
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <div className="rounded-[18px] bg-[#FFFCF1] p-[16px]">
            <div className="flex items-start justify-between gap-[12px]">
              <div className="min-w-0">
                <div className={`${DISPLAY} text-[22px] leading-[26px]`}>{r.user}</div>
                <div className="mt-[2px] text-[13px] text-[#2819109E]">
                  {r.want} · {money(r.value)}
                  {r.network ? " · Doe network" : ""}
                </div>
              </div>
              <StatusChip status={r.status} />
            </div>
            <div className="mt-[14px] flex flex-col gap-[8px]">
              {r.thread.map((l, i) => (
                <div key={i} className={`flex flex-col max-w-[88%] gap-[3px] ${l.from === "clinic" ? "self-end items-end" : "self-start items-start"}`}>
                  <span className="px-[4px] text-[11px] font-[600] text-[#28191073]">{l.from === "clinic" ? "Your clinic agent" : `${r.user}'s agent`}</span>
                  <span className={`px-[14px] py-[10px] rounded-[18px] text-[14px] leading-[20px] ${l.from === "clinic" ? "bg-[#140C04] text-[#FFFCF1] rounded-br-[6px]" : "bg-[#F4EEDF] rounded-bl-[6px]"}`}>{l.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-[6px] p-[6px] pt-[8px]">
            {(r.status === "Negotiating" || r.status === "Ready to confirm" || r.status === "Holding") && (
              <div className="flex flex-wrap gap-[6px]">
                <button
                  type="button"
                  onClick={() =>
                    onUpdate(r.id, { status: "Booked", detail: "Confirmed by clinic" }, { from: "clinic", text: r.status === "Negotiating" ? `Accepted at ${money(r.value)}. Send the booking request and I'll confirm it.` : "Confirmed. Reminders go to you 48 and 2 hours before." })
                  }
                  className="h-[42px] px-[18px] rounded-full bg-[#140C04] text-[#FFFCF1] text-[13.5px] font-[600]"
                >
                  {r.status === "Negotiating" ? `Accept ${money(r.value)}` : "Confirm booking"}
                </button>
                {r.status === "Negotiating" && (
                  <form
                    className="flex gap-[6px] grow"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const n = Number(counter.replace(/[^\d]/g, ""));
                      if (!n) return;
                      onUpdate(r.id, { value: n, detail: `You countered ${money(n)}` }, { from: "clinic", text: `The best Dr. Brooks can do is ${money(n)}.` });
                      setCounter("");
                    }}
                  >
                    <input
                      value={counter}
                      onChange={(e) => setCounter(e.target.value)}
                      placeholder="Counter, e.g. 1,350"
                      inputMode="numeric"
                      className="grow min-w-0 h-[42px] px-[14px] rounded-full bg-[#FFFCF1] border border-solid border-[#2819101F] text-[16px] md:text-[13.5px] outline-none"
                    />
                    <button type="submit" className="h-[42px] px-[16px] rounded-full bg-[#FFFCF1] border border-solid border-[#2819101F] text-[13.5px] font-[600]">
                      Counter
                    </button>
                  </form>
                )}
              </div>
            )}
            <form
              className="flex gap-[6px]"
              onSubmit={(e) => {
                e.preventDefault();
                if (!reply.trim()) return;
                onUpdate(r.id, r.status === "Question" ? { status: "Holding", detail: "Answered · waiting on patient" } : {}, { from: "clinic", text: reply.trim() });
                setReply("");
              }}
            >
              <input
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder={`Reply to ${r.user}'s agent`}
                className="grow min-w-0 h-[42px] px-[14px] rounded-full bg-[#FFFCF1] border border-solid border-[#2819101F] text-[16px] md:text-[13.5px] outline-none"
              />
              <button type="submit" className="h-[42px] px-[16px] rounded-full bg-[#140C04] text-[#FFFCF1] text-[13.5px] font-[600]">
                Send
              </button>
            </form>
          </div>
        </Card>
      </div>
    </>
  );
}

function Schedule() {
  return (
    <>
      <Title kicker="Fri, Oct 30">Schedule</Title>
      <Card>
        <div className="flex flex-col gap-[4px]">
          {TODAY.map((a) => (
            <div key={a.time} className="grid grid-cols-[70px_minmax(0,1fr)_auto] md:grid-cols-[90px_minmax(0,1.2fr)_minmax(0,1fr)_auto] items-center gap-[12px] p-[14px] rounded-[16px] bg-[#FFFCF1]">
              <span className="text-[14px] font-[700]">{a.time}</span>
              <span className="min-w-0">
                <span className="block truncate text-[14px] font-[600]">{a.user}</span>
                <span className="block truncate text-[12.5px] text-[#2819109E]">{a.service}</span>
              </span>
              <span className="hidden md:block truncate text-[13px] text-[#2819109E]">{a.provider}</span>
              <span className={`h-[24px] px-[10px] flex items-center rounded-full text-[11.5px] font-[600] ${a.source === "Agent" ? "bg-[#FCCFB8]" : "bg-[#F4EEDF]"}`}>{a.source}</span>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

function Services({ bookable, onToggle }: { bookable: Record<string, boolean>; onToggle: (id: string) => void }) {
  const rows = [
    ...SERVICES.map((s) => ({ id: s.id, name: s.name, sub: s.duration, price: s.price })),
    ...BUNDLES.map((b) => ({ id: b.id, name: b.name, sub: "Bundle", price: b.price })),
  ];
  return (
    <>
      <Title kicker="Private pay">Services & pricing</Title>
      <Card>
        <div className="flex flex-col gap-[4px]">
          {rows.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => onToggle(r.id)}
              className="grid grid-cols-[minmax(0,1fr)_auto_auto] md:grid-cols-[minmax(0,1fr)_120px_140px_auto] items-center gap-[12px] p-[14px] rounded-[16px] bg-[#FFFCF1] text-left"
            >
              <span className="min-w-0">
                <span className="block truncate text-[14px] font-[600]">{r.name}</span>
                <span className="block text-[12px] text-[#2819109E]">{r.sub}</span>
              </span>
              <span className="text-[14px] font-[700]">{money(r.price)}</span>
              <span className="hidden md:block text-[12.5px] text-[#2819109E]">Floor {money(Math.round((r.price * 0.92) / 5) * 5)}</span>
              <span className="flex items-center gap-[8px] text-[12px] font-[600]">
                <span className="hidden sm:inline">{bookable[r.id] ? "Bookable" : "Request"}</span>
                <Check on={Boolean(bookable[r.id])} size={20} />
              </span>
            </button>
          ))}
        </div>
      </Card>
    </>
  );
}

function Forms() {
  const [open, setOpen] = useState(1);
  const f = FORMS_IN[open]!;
  const returned = f.status === "Returned";
  return (
    <>
      <Title>Forms</Title>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-[12px]">
        <Card>
          <div className="flex flex-col gap-[4px]">
            {FORMS_IN.map((x, i) => (
              <button
                key={x.user}
                type="button"
                onClick={() => setOpen(i)}
                className={`flex items-center gap-[12px] p-[12px] rounded-[16px] bg-[#FFFCF1] text-left ${i === open ? "ring-[1.5px] ring-[#140C04]" : ""}`}
              >
                <span className="grow min-w-0">
                  <span className="block truncate text-[14px] font-[600]">{x.user}</span>
                  <span className="block truncate text-[12.5px] text-[#2819109E]">Intake + 4 assessments · {x.when}</span>
                </span>
                <span className={`shrink-0 h-[24px] px-[10px] flex items-center rounded-full text-[11.5px] font-[700] ${x.status === "Returned" ? "bg-[#DCE5D0]" : "bg-[#F3E7C9]"}`}>{x.status}</span>
              </button>
            ))}
          </div>
        </Card>
        <Card>
          <div className="rounded-[18px] bg-[#FFFCF1] p-[16px]">
            <div className="flex items-baseline justify-between gap-[12px]">
              <div className={`${DISPLAY} text-[21px] leading-[25px]`}>{f.user}</div>
              <span className="text-[12px] font-[600] text-[#28191080]">{f.when}</span>
            </div>
            <div className="mt-[14px] grid grid-cols-2 gap-[6px]">
              {(returned ? f.scores : ASSESSMENT_NAMES.map((name) => ({ name, score: "…", band: "Agent asking", tone: "#F4EEDF" }))).map((x) => (
                <div key={x.name} className="flex flex-col gap-[4px] p-[12px] rounded-[14px] bg-[#F4EEDF99]">
                  <span className="text-[11.5px] font-[600] text-[#28191099]">{x.name}</span>
                  <span className={`${DISPLAY} text-[22px] leading-[26px]`}>{x.score}</span>
                  <span className="self-start h-[20px] px-[8px] flex items-center rounded-full text-[10.5px] font-[700]" style={{ backgroundColor: x.tone }}>
                    {x.band}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-[10px] grid grid-cols-1 sm:grid-cols-2 gap-[6px]">
              {INTAKE_FIELDS.filter((x) => x.id !== "consent").map((x) => (
                <div key={x.id} className="flex flex-col gap-[2px] p-[10px] rounded-[12px] bg-[#F4EEDF99]">
                  <span className="text-[11.5px] font-[600] text-[#28191099]">{x.label}</span>
                  <span className="text-[14px] font-[500]">{x.id === "name" ? f.user : returned ? (f.own?.[x.id] ?? x.value) : "…"}</span>
                </div>
              ))}
            </div>
            <div className="mt-[10px] flex items-center gap-[10px] p-[12px] rounded-[12px] border-[1.5px] border-dashed border-[#28191033]">
              <Check on={returned} size={20} />
              <span className="text-[13px]">{returned ? "Consent signed · PHI provided via Doe" : "Awaiting signature"}</span>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
