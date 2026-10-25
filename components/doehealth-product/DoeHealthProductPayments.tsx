"use client";

/**
 * Payments tab — a charge's path in one row (invoiced, sent to the patient's agent, awaiting approval, collected),
 * then every payment in a table with who paid, with what, and where it stands.
 */
import { useState } from "react";

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

const COLS = { date: 64, name: 190, clinician: 120, amount: 96, method: 170, status: 168 };

const FILTERS = ["All", "Paid", "Pending"] as const;
const CLINICIANS = ["All Clinicians", "Dr. Alvarez", "Dr. Lin", "Dr. Patel"];

/** The four stages a charge passes through, left to right. */
const STAGES = [
  { id: "invoiced", label: "Invoiced", count: "14 visits", value: "$1,860", note: "Charged after the visit", tone: "#F4EEDF", fill: 1, bar: "#28191055" },
  { id: "sent", label: "Sent to agent", count: "4", value: "$510", note: "Patient’s agent has the link", tone: "#F8D9C6", fill: 0.27, bar: "#140C04" },
  { id: "waiting", label: "Awaiting approval", count: "1", value: "$310", note: "Patient approves in the agent", tone: "#ECE6DA", fill: 0.17, bar: "#140C04" },
] as const;

function Chevron() {
  return (
    <span className="absolute z-[2] top-1/2 -right-[22px] -mt-[17px] w-[34px] h-[34px] flex items-center justify-center rounded-[999px] bg-paper" aria-hidden="true">
      <svg width="18" height="18" viewBox="0 0 24 24" style={{ display: "block" }}>
        <path d="M9 6l6 6-6 6" fill="none" stroke="#281910" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function DoeHealthProductPaymentsPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [clinician, setClinician] = useState(0);

  const rows = ROWS.filter((r) => {
    if (filter === "Paid" && r.status !== "paid") return false;
    if (filter === "Pending" && r.status === "paid") return false;
    return clinician === 0 || r.clinician === CLINICIANS[clinician];
  });

  return (
    <div className="relative [font-synthesis:none] h-full w-full flex flex-col gap-[20px] pt-[36px] px-[40px] pb-[28px] rounded-[24px] overflow-clip bg-paper antialiased">
      <div className="relative flex items-end justify-between">
        <span className={`text-[58px] leading-[62px] tracking-[-0.03em] ${DISPLAY} text-walnut`}>Payments</span>
        <span className="flex gap-[10px]">
          <span className={`flex items-center h-[40px] px-[18px] rounded-[999px] bg-[#28191014] text-[14px] leading-[18px] ${SANS} font-[500] text-walnut`}>Export</span>
          <span className={`flex items-center h-[40px] px-[18px] rounded-[999px] bg-ink text-[14px] leading-[18px] ${SANS} font-[500] [color:#FFFCF1]`}>New charge</span>
        </span>
      </div>

      <div className="relative grid grid-cols-[1fr_1fr_1fr_1.25fr] gap-[10px] h-[172px] shrink-0">
        {STAGES.map((s, i) => (
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
        <div className="relative flex flex-col p-[18px_20px] rounded-l-[4px] rounded-r-[24px] bg-[#D6DEC6]">
          <span className={`flex items-center justify-between text-[13px] leading-[16px] ${SANS} font-[500] text-[#2F3B2A]`}>
            Collected
            <span className="flex items-center h-[24px] px-[10px] rounded-[999px] bg-[#FFFCF1A6] text-[12px]">+18% this week</span>
          </span>
          <span className={`mt-[8px] text-[56px] leading-[58px] tracking-[-0.03em] ${DISPLAY} text-ink`}>$1,240</span>
          <span className={`mt-[8px] flex gap-[14px] text-[12.5px] leading-[16px] ${SANS} text-[#2F3B2A]`}>
            <span><b className="font-[600]">72%</b> paid by agent</span>
            <span><b className="font-[600]">18%</b> card on file</span>
            <span><b className="font-[600]">10%</b> front desk</span>
          </span>
          <span className="mt-auto flex gap-[3px] h-[6px] rounded-[99px] overflow-hidden bg-[#FFFCF18C]">
            <span className="h-full bg-[#2F3B2A]" style={{ width: "72%" }} />
            <span className="h-full bg-[#6E9A5B]" style={{ width: "18%" }} />
            <span className="h-full bg-[#9DB387]" style={{ width: "10%" }} />
          </span>
        </div>
      </div>

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

      <div className="relative flex flex-col grow min-h-[0px] pt-[8px] px-[8px] rounded-[18px] bg-[#F4EEDF] overflow-y-auto overscroll-y-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className={`flex items-center gap-[16px] shrink-0 px-[16px] pt-[12px] pb-[10px] text-[13px] leading-[18px] ${SANS} text-sub`}>
          <span style={{ width: COLS.date }} className="shrink-0">Date</span>
          <span style={{ width: COLS.name }} className="shrink-0">Patient</span>
          <span className="grow min-w-[0px]">Service</span>
          <span style={{ width: COLS.clinician }} className="shrink-0">Clinician</span>
          <span style={{ width: COLS.amount }} className="shrink-0">Amount</span>
          <span style={{ width: COLS.method }} className="shrink-0">Paid With</span>
          <span style={{ width: COLS.status }} className="shrink-0">Status</span>
        </div>
        <div className="flex flex-col gap-[4px] pb-[8px]">
          {rows.map((r) => {
            const pill = PILL[r.status];
            return (
              <div key={r.name} className="flex items-center gap-[16px] h-[62px] shrink-0 px-[16px] rounded-[12px] bg-paper">
                <span style={{ width: COLS.date }} className={`shrink-0 text-[16px] leading-[20px] ${SANS} font-[500] text-walnut`}>{r.date}</span>
                <span style={{ width: COLS.name }} className={`shrink-0 truncate text-[17px] leading-[22px] tracking-[-0.02em] ${SANS} text-ink`}>{r.name}</span>
                <span className={`grow min-w-[0px] truncate text-[15px] leading-[20px] ${SANS} text-[rgba(40,25,16,0.78)]`}>{r.service}</span>
                <span style={{ width: COLS.clinician }} className={`shrink-0 text-[15px] leading-[20px] ${SANS} text-sub`}>{r.clinician}</span>
                <span style={{ width: COLS.amount }} className={`shrink-0 text-[16px] leading-[20px] ${SANS} font-[500] text-walnut [font-variant-numeric:tabular-nums]`}>{r.amount}</span>
                <span style={{ width: COLS.method }} className={`shrink-0 text-[15px] leading-[20px] ${SANS} text-sub`}>{r.method}</span>
                <span style={{ width: COLS.status }} className="shrink-0 flex">
                  <span
                    className={`flex items-center h-[28px] px-[12px] rounded-[999px] text-[13px] leading-[18px] ${SANS} font-[500] whitespace-nowrap`}
                    style={{ backgroundColor: pill.background, color: pill.color }}
                  >
                    {pill.label}
                  </span>
                </span>
              </div>
            );
          })}
          {rows.length === 0 ? <span className={`px-[16px] py-[24px] text-[14px] ${SANS} text-sub`}>No payments match.</span> : null}
        </div>
      </div>
    </div>
  );
}
