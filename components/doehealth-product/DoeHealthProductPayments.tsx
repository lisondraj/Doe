"use client";

/**
 * Payments tab — a charge's path in one row (invoiced, sent to the patient's agent, awaiting approval, collected),
 * then every payment in a table with who paid and where it stands. Prior auth is docked as a column beside the
 * payments, one card per auth with its four steps.
 */
import { type ReactNode, useState } from "react";

const DISPLAY = "font-['P22MackinacPro-Medium','P22_Mackinac_Pro',system-ui,sans-serif] font-[500]";
const SANS = "font-['DM_Sans',system-ui,sans-serif]";

type PayStatus = "paid" | "sent" | "waiting";

const ROWS: { date: string; name: string; service: string; clinician: string; amount: string; method: string; status: PayStatus }[] = [
  { date: "Oct 14", name: "Leo Jacobs", service: "Ear Tube Consult", clinician: "Dr. Alvarez", amount: "$40.00", method: "HSA •••• 4417", status: "sent" },
  { date: "Oct 13", name: "Ava Thompson", service: "Hearing Test", clinician: "Dr. Lin", amount: "$65.00", method: "Visa •••• 2290", status: "paid" },
  { date: "Oct 13", name: "Noah Kim", service: "Follow-Up Visit", clinician: "Dr. Patel", amount: "$25.00", method: "HSA •••• 0912", status: "paid" },
  { date: "Oct 12", name: "Grace Patel", service: "Allergy Panel", clinician: "Dr. Alvarez", amount: "$120.00", method: "Amex •••• 3005", status: "paid" },
  { date: "Oct 12", name: "Henry Walsh", service: "Sinus CT", clinician: "Dr. Lin", amount: "$310.00", method: "—", status: "waiting" },
  { date: "Oct 11", name: "Maya Chen", service: "Hearing Aid Fitting", clinician: "Dr. Patel", amount: "$85.00", method: "—", status: "sent" },
  { date: "Oct 11", name: "Daniel Okafor", service: "Ear Cleaning", clinician: "Dr. Alvarez", amount: "$30.00", method: "Visa •••• 7731", status: "paid" },
  { date: "Oct 10", name: "Priya Raman", service: "Tympanometry", clinician: "Dr. Lin", amount: "$45.00", method: "HSA •••• 5520", status: "paid" },
  { date: "Oct 10", name: "Tom Halvorsen", service: "Follow-Up Visit", clinician: "Dr. Patel", amount: "$25.00", method: "Visa •••• 1184", status: "paid" },
];

const PILL: Record<PayStatus, { label: string; background: string; color: string }> = {
  paid: { label: "Paid by Agent", background: "#D6DEC6", color: "#2F3B2A" },
  sent: { label: "Sent to Agent", background: "#FCCFB8", color: "#140C04" },
  waiting: { label: "Awaiting Approval", background: "#28191014", color: "#281910" },
};

const COLS = { date: 64, name: 190, amount: 96, status: 168 };

const FILTERS = ["All", "Paid", "Pending"] as const;
const CLINICIANS = ["All Clinicians", "Dr. Alvarez", "Dr. Lin", "Dr. Patel"];

type Stage = { id: string; label: string; count: string; value: string; note: string; tone: string; fill: number; bar: string };

/** The four stages a charge passes through, left to right. */
const STAGES: Stage[] = [
  { id: "invoiced", label: "Invoiced", count: "14 visits", value: "$1,860", note: "Charged after the visit", tone: "#F4EEDF", fill: 1, bar: "#28191055" },
  { id: "sent", label: "Sent to agent", count: "4", value: "$510", note: "Patient’s agent has the link", tone: "#F8D9C6", fill: 0.27, bar: "#140C04" },
  { id: "waiting", label: "Awaiting approval", count: "1", value: "$310", note: "Patient approves in the agent", tone: "#ECE6DA", fill: 0.17, bar: "#140C04" },
];

type AuthStatus = "drafting" | "submitted" | "review" | "info" | "approved" | "appeal";

const AUTHS: { filed: string; name: string; service: string; payer: string; code: string; status: AuthStatus; next: string }[] = [
  { filed: "Oct 14", name: "Leo Jacobs", service: "Ear Tube Surgery", payer: "Harbor Mutual", code: "69436", status: "info", next: "Payer asked for the audiogram, attaching it" },
  { filed: "Oct 14", name: "Grace Patel", service: "Allergy Immunotherapy", payer: "Cigna", code: "95165", status: "drafting", next: "Pulling the allergy panel and visit note" },
  { filed: "Oct 13", name: "Priya Raman", service: "MRI, Inner Ear", payer: "UnitedHealthcare", code: "70553", status: "submitted", next: "Filed on the payer portal, checking tomorrow" },
  { filed: "Oct 12", name: "Henry Walsh", service: "Sinus CT", payer: "Aetna", code: "70486", status: "review", next: "Day 2 of 5, payer is reviewing" },
  { filed: "Oct 11", name: "Omar Haddad", service: "Sleep Endoscopy", payer: "Harbor Mutual", code: "42975", status: "appeal", next: "Denied once, appeal letter sent Oct 13" },
  { filed: "Oct 11", name: "Maya Chen", service: "Hearing Aid Fitting", payer: "Blue Cross", code: "V5011", status: "approved", next: "Approved, valid through Jan 9" },
  { filed: "Oct 10", name: "Noah Kim", service: "Balance Testing", payer: "Aetna", code: "92540", status: "approved", next: "Approved, visit booked Oct 21" },
];

/** `step` is how far along Drafted → Submitted → Review → Decision the auth is. */
const AUTH_PILL: Record<AuthStatus, { label: string; background: string; color: string; step: number }> = {
  drafting: { label: "Agent Drafting", background: "#28191014", color: "#281910", step: 0 },
  submitted: { label: "Submitted", background: "#ECE6DA", color: "#281910", step: 1 },
  review: { label: "Payer Review", background: "#F3E2B4", color: "#281910", step: 2 },
  info: { label: "Needs You", background: "#FCCFB8", color: "#140C04", step: 2 },
  appeal: { label: "Appealing", background: "#F6D2C4", color: "#140C04", step: 2 },
  approved: { label: "Approved", background: "#D6DEC6", color: "#2F3B2A", step: 3 },
};

const TABLE = "relative flex flex-col grow min-h-[0px] pt-[8px] px-[8px] rounded-[18px] bg-[#F4EEDF] overflow-y-auto overscroll-y-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";
const HEAD = `flex items-center gap-[16px] shrink-0 px-[16px] pt-[12px] pb-[10px] text-[13px] leading-[18px] ${SANS} text-sub`;
const ROW = "flex items-center gap-[16px] h-[62px] shrink-0 px-[16px] rounded-[12px] bg-paper";

function Chevron() {
  return (
    <span className="absolute z-[2] top-1/2 -right-[22px] -mt-[17px] w-[34px] h-[34px] flex items-center justify-center rounded-[999px] bg-paper" aria-hidden="true">
      <svg width="18" height="18" viewBox="0 0 24 24" style={{ display: "block" }}>
        <path d="M9 6l6 6-6 6" fill="none" stroke="#281910" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function Pill({ label, background, color }: { label: string; background: string; color: string }) {
  return (
    <span className={`flex items-center h-[28px] px-[12px] rounded-[999px] text-[13px] leading-[18px] ${SANS} font-[500] whitespace-nowrap`} style={{ backgroundColor: background, color }}>
      {label}
    </span>
  );
}

function StageRow({ stages, last }: { stages: Stage[]; last: ReactNode }) {
  return (
    <div className="relative grid grid-cols-[1fr_1fr_1fr_1.25fr] gap-[10px] h-[172px] shrink-0">
      {stages.map((s, i) => (
        <div key={s.id} className={`relative flex flex-col p-[18px_20px] ${i === 0 ? "rounded-l-[24px] rounded-r-[4px]" : "rounded-[4px]"}`} style={{ backgroundColor: s.tone }}>
          <span className={`flex items-center justify-between text-[13px] leading-[16px] ${SANS} font-[500] text-[rgba(40,25,16,0.7)]`}>
            {s.label}
            <span className="text-sub">{s.count}</span>
          </span>
          <span className={`mt-[14px] text-[42px] leading-[44px] tracking-[-0.03em] ${DISPLAY} text-ink`}>{s.value}</span>
          <span className={`mt-[6px] text-[13px] leading-[18px] ${SANS} text-sub`}>{s.note}</span>
          <span className="mt-auto h-[6px] rounded-[99px] bg-[#2819101A] overflow-hidden">
            <span className="block h-full rounded-[99px]" style={{ width: `${s.fill * 100}%`, backgroundColor: s.bar }} />
          </span>
          <Chevron />
        </div>
      ))}
      {last}
    </div>
  );
}

/** The green end card; `split` is the line under the figure and the segmented bar under that. */
function EndCard({ label, badge, value, split, bar }: { label: string; badge: string; value: string; split: ReactNode; bar: { width: number; color: string }[] }) {
  return (
    <div className="relative flex flex-col p-[18px_20px] rounded-l-[4px] rounded-r-[24px] bg-[#D6DEC6]">
      <span className={`flex items-center justify-between text-[13px] leading-[16px] ${SANS} font-[500] text-[#2F3B2A]`}>
        {label}
        <span className="flex items-center h-[24px] px-[10px] rounded-[999px] bg-[#FFFCF1A6] text-[12px]">{badge}</span>
      </span>
      <span className={`mt-[8px] text-[56px] leading-[58px] tracking-[-0.03em] ${DISPLAY} text-ink`}>{value}</span>
      <span className={`mt-[8px] flex gap-[14px] text-[12.5px] leading-[16px] ${SANS} text-[#2F3B2A]`}>{split}</span>
      <span className="mt-auto flex gap-[3px] h-[6px] rounded-[99px] overflow-hidden bg-[#FFFCF18C]">
        {bar.map((b) => (
          <span key={b.color} className="h-full" style={{ width: `${b.width}%`, backgroundColor: b.color }} />
        ))}
      </span>
    </div>
  );
}

function PaymentsBody() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [clinician, setClinician] = useState(0);

  const rows = ROWS.filter((r) => {
    if (filter === "Paid" && r.status !== "paid") return false;
    if (filter === "Pending" && r.status === "paid") return false;
    return clinician === 0 || r.clinician === CLINICIANS[clinician];
  });

  return (
    <>
      <StageRow
        stages={STAGES}
        last={
          <EndCard
            label="Collected"
            badge="+18% this week"
            value="$1,240"
            split={
              <span><b className="font-[600]">72%</b> paid by agent</span>
            }
            bar={[
              { width: 72, color: "#2F3B2A" },
              { width: 18, color: "#6E9A5B" },
              { width: 10, color: "#9DB387" },
            ]}
          />
        }
      />

      <div className="relative flex items-center gap-[10px] h-[38px] shrink-0">
        <span className="flex p-[3px] gap-[2px] rounded-[999px] bg-[#F4EEDF]">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`h-[32px] px-[16px] rounded-[999px] text-[13px] leading-[16px] ${SANS} font-[500] transition-colors duration-150 ${filter === f ? "bg-paper text-ink" : "text-sub hover:text-walnut"}`}
            >
              {f}
            </button>
          ))}
        </span>
        <span className="grow" />
        <button
          type="button"
          onClick={() => setClinician((c) => (c + 1) % CLINICIANS.length)}
          className={`flex items-center gap-[8px] h-[38px] px-[16px] rounded-[999px] bg-[#28191014] hover:bg-[#2819101F] transition-colors duration-150 text-[14px] leading-[18px] ${SANS} font-[500] text-walnut`}
        >
          {CLINICIANS[clinician]}
          <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
            <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className={TABLE}>
        <div className={HEAD}>
          <span style={{ width: COLS.date }} className="shrink-0">Date</span>
          <span style={{ width: COLS.name }} className="shrink-0">Patient</span>
          <span className="grow min-w-[0px]">Service</span>
          <span style={{ width: COLS.amount }} className="shrink-0">Amount</span>
          <span style={{ width: COLS.status }} className="shrink-0">Status</span>
        </div>
        <div className="flex flex-col gap-[4px] pb-[8px]">
          {rows.map((r) => (
            <div key={r.name} className={ROW}>
              <span style={{ width: COLS.date }} className={`shrink-0 text-[16px] leading-[20px] ${SANS} font-[500] text-walnut`}>{r.date}</span>
              <span style={{ width: COLS.name }} className={`shrink-0 truncate text-[17px] leading-[22px] tracking-[-0.02em] ${SANS} text-ink`}>{r.name}</span>
              <span className={`grow min-w-[0px] truncate text-[15px] leading-[20px] ${SANS} text-[rgba(40,25,16,0.78)]`}>{r.service}</span>
              <span style={{ width: COLS.amount }} className={`shrink-0 text-[16px] leading-[20px] ${SANS} font-[500] text-walnut [font-variant-numeric:tabular-nums]`}>{r.amount}</span>
              <span style={{ width: COLS.status }} className="shrink-0 flex">
                <Pill {...PILL[r.status]} />
              </span>
            </div>
          ))}
          {rows.length === 0 ? <span className={`px-[16px] py-[24px] text-[14px] ${SANS} text-sub`}>No payments match.</span> : null}
        </div>
      </div>
    </>
  );
}

/** Prior auth docked beside the payments: one card per auth, with its four steps and the agent's latest note. */
function PriorAuthRail() {
  const open = AUTHS.filter((a) => a.status !== "approved").length;
  return (
    <div className="flex flex-col min-h-[0px] gap-[12px] p-[18px] rounded-[24px] bg-[#F4EEDF]">
      <div className="flex items-end justify-between px-[4px]">
        <span className={`text-[28px] leading-[32px] tracking-[-0.02em] ${DISPLAY} text-walnut`}>Prior auth</span>
        <span className={`text-[13px] leading-[18px] ${SANS} font-[500] text-sub`}>{open} open · 1.8 days avg</span>
      </div>
      <div className="flex flex-col grow min-h-[0px] gap-[6px] p-[2px] -m-[2px] overflow-y-auto overscroll-y-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {AUTHS.map((a) => {
          const pill = AUTH_PILL[a.status];
          return (
            <div key={a.name} className={`flex flex-col gap-[8px] p-[14px_16px] rounded-[16px] bg-paper ${a.status === "info" ? "outline outline-[1.5px] outline-[#E8A585]" : ""}`}>
              <div className="flex items-center justify-between gap-[10px]">
                <span className="flex flex-col min-w-[0px]">
                  <span className={`truncate text-[16px] leading-[20px] tracking-[-0.01em] ${SANS} font-[500] text-ink`}>{a.name}</span>
                  <span className={`truncate text-[13px] leading-[18px] ${SANS} text-sub`}>
                    {a.service} · {a.payer}
                  </span>
                </span>
                <Pill {...pill} />
              </div>
              <span className="flex gap-[4px]">
                {["Drafted", "Submitted", "Review", "Decision"].map((step, i) => (
                  <span key={step} className="h-[4px] grow rounded-[99px]" style={{ backgroundColor: i <= pill.step ? (a.status === "approved" ? "#6E9A5B" : "#140C04") : "#2819101A" }} />
                ))}
              </span>
              <span className={`truncate text-[13px] leading-[18px] ${SANS} text-[rgba(40,25,16,0.78)]`}>{a.next}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function DoeHealthProductPaymentsPage() {
  return (
    <div className="relative [font-synthesis:none] h-full w-full flex flex-col gap-[20px] pt-[36px] px-[40px] pb-[28px] rounded-[24px] overflow-clip bg-paper antialiased">
      <div className="relative flex items-end justify-between">
        <span className={`text-[58px] leading-[62px] tracking-[-0.03em] ${DISPLAY} text-walnut`}>Payments</span>
        <span className="flex gap-[10px]">
          <span className={`flex items-center h-[40px] px-[18px] rounded-[999px] bg-[#28191014] text-[14px] leading-[18px] ${SANS} font-[500] text-walnut`}>Export</span>
          <span className={`flex items-center h-[40px] px-[18px] rounded-[999px] bg-ink text-[14px] leading-[18px] ${SANS} font-[500] [color:#FFFCF1]`}>New charge</span>
        </span>
      </div>

      <div className="grid grid-cols-[1fr_400px] gap-[12px] grow min-h-[0px]">
        <div className="flex flex-col min-w-[0px] min-h-[0px] gap-[20px]">
          <PaymentsBody />
        </div>
        <PriorAuthRail />
      </div>
    </div>
  );
}
