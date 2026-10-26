"use client";

/**
 * Payments tab — one path for the money behind every visit: prior auth with the payer when a service needs it, then
 * invoiced, sent to the patient's agent, approved and collected. Collected sits on the left of the stage row, the
 * stages to its right double as the table's filter, each row says what covers it, and clicking a row opens its whole
 * journey in a panel on the right while the page reflows beside it.
 */
import { useEffect, useState } from "react";

const DISPLAY = "font-['P22MackinacPro-Medium','P22_Mackinac_Pro',system-ui,sans-serif] font-[500]";
const SANS = "font-['DM_Sans',system-ui,sans-serif]";
/** Same motion as the Services detail panel. */
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const MOVE = `420ms ${EASE}`;
const PANEL_W = 420;

type Auth = "drafting" | "submitted" | "review" | "info" | "appeal" | "approved";
type Stage = "auth" | "sent" | "waiting" | "paid";

type Row = {
  id: string;
  date: string;
  name: string;
  service: string;
  payer: string;
  amount: string;
  /** Prior auth state, or null when the service doesn't need one. */
  auth: Auth | null;
  stage: Stage;
  method: string;
  note: string;
};

const ROWS: Row[] = [
  { id: "james-botox", date: "Oct 14", name: "James Lisondra", service: "Botox for Chronic Migraine", payer: "Self-pay", amount: "$1,500.00", auth: null, stage: "sent", method: "—", note: "Muse has the bill at the $1,500 self-pay offer price and is paying from James’s card on file." },
  { id: "leo-eeg", date: "Oct 14", name: "Leo Jacobs", service: "48-Hour EEG", payer: "Harbor Mutual", amount: "$1,840", auth: "info", stage: "auth", method: "—", note: "Harbor Mutual asked for the last EEG report. Doe found the Jun 12 one and it’s ready to attach." },
  { id: "paul-botox", date: "Oct 14", name: "Paul Greene", service: "Botox for Chronic Migraine", payer: "Cigna", amount: "$640", auth: "drafting", stage: "auth", method: "—", note: "Pulling his headache diary and the last two visit notes into Cigna’s form." },
  { id: "priya-mri", date: "Oct 13", name: "Priya Raman", service: "MRI, Brain", payer: "UnitedHealthcare", amount: "$410", auth: "submitted", stage: "auth", method: "—", note: "Filed on UnitedHealthcare’s portal. Doe checks it tomorrow morning." },
  { id: "elena-cgrp", date: "Oct 11", name: "Elena Cho", service: "CGRP Injection", payer: "Harbor Mutual", amount: "$980", auth: "appeal", stage: "auth", method: "—", note: "Denied for needing two preventives tried first. Appeal sent Oct 13 with her topiramate history." },
  { id: "leo-consult", date: "Oct 14", name: "Leo Jacobs", service: "Seizure Consult", payer: "Harbor Mutual", amount: "$40.00", auth: null, stage: "sent", method: "HSA •••• 4417", note: "Mia’s agent has the bill and pays from Leo’s HSA on Fridays." },
  { id: "henry-mri", date: "Oct 12", name: "Henry Walsh", service: "MRI, Brain", payer: "Aetna", amount: "$310.00", auth: "approved", stage: "waiting", method: "—", note: "Henry’s agent asked him to approve $310 after Aetna’s share. A reminder goes out tonight." },
  { id: "maya-nerve", date: "Oct 11", name: "Maya Chen", service: "Occipital Nerve Block", payer: "Blue Cross", amount: "$85.00", auth: "approved", stage: "sent", method: "—", note: "Maya’s agent has the link and is checking her FSA balance." },
  { id: "ben-emg", date: "Oct 13", name: "Ben Torres", service: "EMG and Nerve Study", payer: "Blue Cross", amount: "$65.00", auth: null, stage: "paid", method: "Visa •••• 2290", note: "Paid by Ben’s agent four minutes after the visit." },
  { id: "noah-sleep", date: "Oct 13", name: "Noah Bennett", service: "Sleep Consult", payer: "Aetna", amount: "$25.00", auth: "approved", stage: "paid", method: "HSA •••• 0912", note: "Aetna approved in a day, and Noah’s agent paid the copay at checkout." },
  { id: "grace-follow", date: "Oct 12", name: "Grace Kim", service: "Parkinson’s Follow-Up", payer: "Cigna", amount: "$120.00", auth: null, stage: "paid", method: "Amex •••• 3005", note: "Paid by Grace’s agent." },
  { id: "daniel-eeg", date: "Oct 11", name: "Daniel Okafor", service: "Routine EEG", payer: "Aetna", amount: "$30.00", auth: null, stage: "paid", method: "Visa •••• 7731", note: "Paid by Daniel’s agent." },
  { id: "hannah-follow", date: "Oct 10", name: "Hannah Lee", service: "MS Follow-Up", payer: "Blue Cross", amount: "$25.00", auth: null, stage: "paid", method: "Visa •••• 1184", note: "Paid at the front desk." },
];

const AUTH: Record<Auth, { label: string; background: string; color: string }> = {
  drafting: { label: "Agent Drafting", background: "#28191014", color: "#281910" },
  submitted: { label: "With Payer", background: "#ECE6DA", color: "#281910" },
  review: { label: "Payer Review", background: "#F3E2B4", color: "#281910" },
  info: { label: "Needs You", background: "#FCCFB8", color: "#140C04" },
  appeal: { label: "Appealing", background: "#F6D2C4", color: "#140C04" },
  approved: { label: "Approved", background: "#D6DEC6", color: "#2F3B2A" },
};

const PAY: Record<Exclude<Stage, "auth">, { label: string; background: string; color: string }> = {
  sent: { label: "Sent to Agent", background: "#FCCFB8", color: "#140C04" },
  waiting: { label: "Awaiting Approval", background: "#28191014", color: "#281910" },
  paid: { label: "Paid by Agent", background: "#D6DEC6", color: "#2F3B2A" },
};

const pillFor = (r: Row) => (r.stage === "auth" ? AUTH[r.auth!] : PAY[r.stage]);

type Filter = "all" | "auth" | "invoiced" | "sent" | "waiting" | "paid";

const matches = (r: Row, f: Filter) => f === "all" || (f === "invoiced" ? r.stage !== "auth" : r.stage === f);

/** Left to right: what's still with the payer, then the charge's path to collected. */
const TILES: { id: Filter; label: string; value: string; tone: string }[] = [
  { id: "auth", label: "Prior Auth", value: "$3,870", tone: "#FAF6EC" },
  { id: "invoiced", label: "Invoiced", value: "$3,360", tone: "#F4EEDF" },
  { id: "sent", label: "Sent to Agent", value: "$2,010", tone: "#F8D9C6" },
  { id: "waiting", label: "Awaiting Approval", value: "$310", tone: "#ECE6DA" },
];

const COLS = { date: 56, name: 140, coverage: 170, amount: 84, status: 148 };

function Pill({ label, background, color }: { label: string; background: string; color: string }) {
  return (
    <span className={`flex items-center h-[28px] px-[12px] rounded-[999px] text-[13px] leading-[18px] ${SANS} font-[500] whitespace-nowrap`} style={{ backgroundColor: background, color }}>
      {label}
    </span>
  );
}

function Shield({ color = "currentColor", size = 14 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
      <path d="M12 3.5l7 2.6v5.4c0 4.3-2.9 7.6-7 9-4.1-1.4-7-4.7-7-9V6.1l7-2.6z" fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 12l2.2 2.2L15.5 10" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Chevron() {
  return (
    <span className="absolute z-[2] top-1/2 -right-[22px] -mt-[17px] w-[34px] h-[34px] flex items-center justify-center rounded-[999px] bg-paper" aria-hidden="true">
      <svg width="18" height="18" viewBox="0 0 24 24" style={{ display: "block" }}>
        <path d="M9 6l6 6-6 6" fill="none" stroke="#281910" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function StageRow({ filter, onFilter }: { filter: Filter; onFilter: (f: Filter) => void }) {
  const count = (f: Filter) => ROWS.filter((r) => matches(r, f)).length;
  const ring = (f: Filter) => (filter === f ? "shadow-[inset_0_0_0_1.5px_#140C04]" : "");

  return (
    <div className="grid grid-cols-[260px_1fr] gap-[28px] h-[176px] shrink-0">
      <button
        type="button"
        onClick={() => onFilter(filter === "paid" ? "all" : "paid")}
        className={`flex flex-col justify-center gap-[8px] text-left rounded-[20px] -m-[10px] p-[10px] transition-colors duration-150 ${filter === "paid" ? "bg-[#D6DEC659]" : "hover:bg-[#2819100A]"}`}
      >
        <span className={`flex items-center gap-[10px] text-[14px] leading-[18px] ${SANS} font-[500] text-sub`}>
          Collected
          <span className="flex items-center h-[24px] px-[10px] rounded-[999px] bg-[#D6DEC6] text-[12px] text-[#2F3B2A]">+18%</span>
        </span>
        <span className={`text-[58px] leading-[60px] tracking-[-0.03em] ${DISPLAY} text-ink`}>$1,240</span>
        <span className="flex gap-[3px] w-full h-[6px] rounded-[99px] overflow-hidden bg-[#2819100F]">
          <span className="h-full bg-[#2F3B2A]" style={{ width: "72%" }} />
          <span className="h-full bg-[#6E9A5B]" style={{ width: "18%" }} />
          <span className="h-full bg-[#9DB387]" style={{ width: "10%" }} />
        </span>
        <span className={`flex gap-[14px] text-[12.5px] leading-[16px] ${SANS} text-sub`}>
          <span>
            <b className="font-[600] text-walnut">72%</b> Paid by Agent
          </span>
          <span>
            <b className="font-[600] text-walnut">18%</b> Card on File
          </span>
        </span>
      </button>

      <div className="relative grid grid-cols-4 gap-[10px] min-w-[0px]">
        {TILES.map((t, i) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onFilter(filter === t.id ? "all" : t.id)}
            className={`relative flex flex-col min-w-[0px] p-[20px_22px] text-left [container-type:inline-size] transition-shadow duration-150 ${i === 0 ? "rounded-l-[24px] rounded-r-[4px] border-dashed border-[#2819102E]" : i === TILES.length - 1 ? "rounded-l-[4px] rounded-r-[24px] border-transparent" : "rounded-[4px] border-transparent"} border-[1.5px] ${ring(t.id)}`}
            style={{ backgroundColor: t.tone }}
          >
            <span className={`flex items-start justify-between gap-[8px] w-full text-[min(16px,9cqw)] leading-[1.3] ${SANS} font-[500] text-[rgba(40,25,16,0.7)]`}>
              <span className="flex items-center gap-[6px] min-w-[0px] whitespace-nowrap">
                {t.id === "auth" && <Shield size={16} />}
                {t.label}
              </span>
              <span className="shrink-0 text-sub">{count(t.id)}</span>
            </span>
            <span className={`mt-auto text-[min(46px,24cqw)] leading-[1.1] tracking-[-0.03em] ${DISPLAY} text-ink`}>{t.value}</span>
            {i < TILES.length - 1 && <Chevron />}
          </button>
        ))}
      </div>
    </div>
  );
}

type Step = { label: string; detail: string; state: "done" | "now" | "next"; auth?: boolean; when?: string };

/** The visit's full path: prior auth when it needs one, then the charge. */
function journey(r: Row): Step[] {
  const first = r.name.split(" ")[0];
  const steps: Step[] = [];
  if (r.auth) {
    const approved = r.auth === "approved";
    const stuck = r.auth === "info" || r.auth === "appeal";
    steps.push({ label: "Packet Drafted", detail: `From the chart, for ${r.payer}`, state: r.auth === "drafting" ? "now" : "done", auth: true });
    steps.push({ label: "Filed with Payer", detail: `On ${r.payer}’s portal`, state: r.auth === "drafting" ? "next" : r.auth === "submitted" ? "now" : "done", auth: true });
    steps.push({
      label: approved ? "Approved" : r.auth === "info" ? "Payer Asked for More" : r.auth === "appeal" ? "Appealing a Denial" : "Decision",
      detail: approved ? "Valid for 90 days" : r.auth === "info" ? "EEG report from the last 6 months" : r.auth === "appeal" ? "Preventive history attached" : "Doe checks daily",
      state: approved ? "done" : stuck ? "now" : "next",
      auth: true,
    });
  }
  const after = r.stage !== "auth";
  const selfPay = r.payer === "Self-pay";
  const share = selfPay ? `${r.amount} at the self-pay price` : `${r.amount} after ${r.payer}’s share`;
  steps.push({ label: "Visit", detail: after ? r.service : "Books once approved", state: after ? "done" : "next", when: after ? r.date : undefined });
  steps.push({ label: "Invoiced", detail: after ? share : `About ${share}`, state: after ? "done" : "next", when: after ? r.date : undefined });
  steps.push({ label: `Sent to ${first}’s Agent`, detail: "Link and itemized bill", state: r.stage === "sent" ? "now" : r.stage === "waiting" || r.stage === "paid" ? "done" : "next" });
  steps.push({ label: `${first} Approves`, detail: "In their agent", state: r.stage === "waiting" ? "now" : r.stage === "paid" ? "done" : "next" });
  steps.push({ label: "Collected", detail: r.stage === "paid" ? r.method : "Lands in your account", state: r.stage === "paid" ? "done" : "next" });
  return steps;
}

const ACTION: Record<string, [string, string]> = {
  info: ["Attach EEG Report", "Call Payer"],
  drafting: ["Review Packet", "Pause"],
  submitted: ["View Packet", "Check Now"],
  review: ["View Packet", "Check Now"],
  appeal: ["View Appeal", "Peer-to-Peer"],
  approved: ["View Approval", "Book Visit"],
  sent: ["Nudge Agent", "Card on File"],
  waiting: ["Send Reminder", "Payment Plan"],
  paid: ["View Receipt", "Refund"],
};

const AUTH_LABEL = (r: Row) => (r.auth ? AUTH[r.auth].label : "Not Needed");

/** A visit's money in one panel: what's owed, the facts behind it, its path so far, and the next thing to do. */
function JourneyPanel({ row, onClose }: { row: Row; onClose: () => void }) {
  const steps = journey(row);
  const [primary, secondary] = ACTION[row.stage === "auth" ? row.auth! : row.stage]!;
  const pill = pillFor(row);
  const facts: [string, string][] = [
    ["Date", row.date],
    ["Coverage", row.payer],
    ["Prior Auth", AUTH_LABEL(row)],
    ["Paid With", row.method === "—" ? "Not Yet" : row.method],
  ];

  return (
    <div key={row.id} className="flex flex-col h-full gap-[12px] p-[20px] rounded-[28px] bg-[#FAF6EC]">
      <div className="flex items-center gap-[12px]">
        <span className="w-[44px] h-[44px] shrink-0 rounded-[50%]" style={{ backgroundColor: pill.background.length === 9 ? "#ECE6DA" : pill.background }} />
        <span className="flex flex-col grow min-w-[0px]">
          <span className={`truncate text-[26px] leading-[30px] tracking-[-0.02em] ${DISPLAY} text-walnut`}>{row.name}</span>
          <span className={`truncate text-[13px] leading-[17px] ${SANS} text-sub`}>{row.service}</span>
        </span>
        <button type="button" aria-label="Close" onClick={onClose} className="w-[34px] h-[34px] shrink-0 flex items-center justify-center rounded-[999px] bg-[#28191014] hover:bg-[#2819101F] transition-colors duration-150">
          <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
            <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="#281910" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col gap-[14px] p-[16px] rounded-[18px] bg-paper">
        <span className="flex items-start justify-between gap-[12px]">
          <span className="flex flex-col gap-[2px]">
            <span className={`text-[13px] leading-[16px] ${SANS} font-[500] text-sub`}>{row.stage === "auth" ? "Est. After Insurance" : "Patient Owes"}</span>
            <span className={`text-[40px] leading-[44px] tracking-[-0.03em] ${DISPLAY} text-ink [font-variant-numeric:tabular-nums]`}>{row.amount}</span>
          </span>
          <Pill {...pill} />
        </span>
        <span className="grid grid-cols-2 gap-x-[16px] gap-y-[10px] pt-[12px] border-t border-solid border-[#2819100F]">
          {facts.map(([k, v]) => (
            <span key={k} className="flex flex-col gap-[2px] min-w-[0px]">
              <span className={`text-[12px] leading-[16px] ${SANS} text-sub`}>{k}</span>
              <span className={`truncate text-[14px] leading-[18px] ${SANS} font-[500] text-walnut`}>{v}</span>
            </span>
          ))}
        </span>
      </div>

      <div className="flex flex-col grow min-h-[0px] gap-[14px] p-[16px] rounded-[18px] bg-paper overflow-y-auto overscroll-y-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <span className="flex flex-col gap-[8px] shrink-0">
          <span className="flex items-center justify-between">
            <span className={`text-[15px] leading-[20px] ${SANS} font-[600] text-walnut`}>Journey</span>
            <span className={`text-[12px] leading-[16px] ${SANS} font-[500] text-sub [font-variant-numeric:tabular-nums]`}>
              {steps.filter((x) => x.state === "done").length} of {steps.length} Done
            </span>
          </span>
          <span className="flex gap-[3px]">
            {steps.map((x) => (
              <span key={x.label} className="grow h-[4px] rounded-[99px]" style={{ backgroundColor: x.state === "done" ? "#6E9A5B" : x.state === "now" ? "#E8A585" : "#2819100F" }} />
            ))}
          </span>
        </span>
        <span className="flex flex-col">
          {steps.map((x, i) => (
            <span key={x.label} className={`flex gap-[12px] px-[10px] -mx-[10px] rounded-[12px] ${x.state === "now" ? "bg-[#FBEDE4]" : ""}`}>
              <span className="flex flex-col items-center w-[12px] shrink-0 pt-[13px]">
                <span
                  className="w-[12px] h-[12px] shrink-0 rounded-[999px]"
                  style={{
                    backgroundColor: x.state === "done" ? "#6E9A5B" : x.state === "now" ? "#E8A585" : "transparent",
                    border: x.state === "next" ? "1.5px solid #28191033" : undefined,
                  }}
                />
                {i < steps.length - 1 && <span className="grow w-[1.5px] mt-[3px] -mb-[13px]" style={{ backgroundColor: x.state === "done" ? "#6E9A5B" : "#2819101A" }} />}
              </span>
              <span className="flex flex-col grow min-w-[0px] py-[9px]">
                <span className={`flex items-center gap-[8px] text-[14px] leading-[20px] ${SANS} font-[500] ${x.state === "next" ? "text-sub" : "text-walnut"}`}>
                  <span className="truncate">{x.label}</span>
                  {x.auth && i === 0 && (
                    <span className={`flex items-center gap-[4px] h-[20px] px-[8px] shrink-0 rounded-[999px] bg-[#F4EEDF] text-[11px] leading-[14px] ${SANS} text-walnut`}>
                      <Shield size={11} />
                      Prior Auth
                    </span>
                  )}
                  <span className="ml-auto shrink-0">
                    {x.state === "now" ? (
                      <span className={`flex items-center h-[20px] px-[8px] rounded-[999px] bg-[#E8A585] text-[11px] leading-[14px] ${SANS} font-[600] text-ink`}>Now</span>
                    ) : x.when ? (
                      <span className={`text-[12px] leading-[16px] ${SANS} font-[400] text-sub [font-variant-numeric:tabular-nums]`}>{x.when}</span>
                    ) : null}
                  </span>
                </span>
                <span className={`truncate text-[13px] leading-[18px] ${SANS} ${x.state === "now" ? "text-[#B4572F]" : x.state === "next" ? "text-[#2819105C]" : "text-sub"}`}>{x.detail}</span>
              </span>
            </span>
          ))}
        </span>
      </div>

      <div className="flex gap-[10px] p-[14px] rounded-[16px] bg-[#F4EEDF]">
        <span className="mt-[6px] w-[7px] h-[7px] shrink-0 rounded-[99px] bg-[#E8A585]" />
        <span className={`text-[13px] leading-[19px] ${SANS} text-walnut`}>{row.note}</span>
      </div>

      <div className="flex gap-[8px] shrink-0">
        <button type="button" className={`grow h-[44px] rounded-[999px] bg-ink hover:bg-[#2B1D12] transition-colors duration-150 text-[14px] leading-[18px] ${SANS} font-[500] [color:#FFFCF1]`}>
          {primary}
        </button>
        <button type="button" className={`h-[44px] px-[18px] rounded-[999px] bg-[#28191014] hover:bg-[#2819101F] transition-colors duration-150 text-[14px] leading-[18px] ${SANS} font-[500] text-walnut`}>
          {secondary}
        </button>
      </div>
    </div>
  );
}

/** The status slider above the table; it shares the filter with the stage tiles. */
const STATUS_FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "auth", label: "Prior Auth" },
  { id: "invoiced", label: "Invoiced" },
  { id: "paid", label: "Collected" },
];

export function DoeHealthProductPaymentsPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState<string | null>(ROWS[0]!.id);
  // Keeps the last row in the panel while it slides shut.
  const [shown, setShown] = useState(ROWS[0]!.id);

  const rows = ROWS.filter((r) => matches(r, filter));
  const row = ROWS.find((r) => r.id === shown)!;
  const select = (id: string) => {
    setShown(id);
    setOpen(id);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="relative [font-synthesis:none] h-full w-full flex rounded-[24px] overflow-clip bg-paper antialiased">
      <div className="flex flex-col grow min-w-[0px] gap-[24px] pt-[36px] px-[40px] pb-[28px]">
      <div className="relative flex items-end justify-between">
        <span className={`text-[58px] leading-[62px] tracking-[-0.03em] ${DISPLAY} text-walnut`}>Payments</span>
        <span className="flex gap-[8px]">
          <button type="button" className={`flex items-center gap-[6px] h-[40px] pr-[18px] pl-[14px] rounded-[999px] bg-[#28191014] hover:bg-[#2819101F] transition-colors duration-150 text-[14px] leading-[18px] ${SANS} font-[500] text-walnut`}>
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
              <path d="M7 3.5h7l4.5 4.5v12a.5.5 0 0 1-.5.5H7a.5.5 0 0 1-.5-.5V4a.5.5 0 0 1 .5-.5zM14 3.5V8h4.5" fill="none" stroke="#281910" strokeWidth="1.8" strokeLinejoin="round" />
              <path d="M9.5 17v-3M12.5 17v-5M15.5 17v-2" fill="none" stroke="#281910" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            Reports
          </button>
          <button type="button" className={`flex items-center gap-[6px] h-[40px] pr-[18px] pl-[14px] rounded-[999px] bg-ink hover:bg-[#2B1D12] transition-colors duration-150 text-[14px] leading-[18px] ${SANS} font-[500] [color:#FFFCF1]`}>
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" style={{ display: "block" }}>
              <path d="M7 2.5v9M2.5 7h9" fill="none" stroke="#FFFCF1" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            Transaction
          </button>
        </span>
      </div>

      <StageRow filter={filter} onFilter={setFilter} />

      <span className="flex w-[360px] shrink-0 p-[3px] gap-[2px] rounded-[999px] bg-[#F4EEDF]" role="tablist">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={`grow flex items-center justify-center h-[32px] px-[10px] rounded-[999px] text-[13px] leading-[16px] ${SANS} font-[500] whitespace-nowrap transition-colors duration-150 ${filter === f.id ? "bg-paper text-ink" : "text-sub hover:text-walnut"}`}
          >
            {f.label}
          </button>
        ))}
      </span>

      <div className="flex flex-col grow min-w-[0px] min-h-[0px] rounded-[18px] bg-[#F4EEDF] overflow-hidden">
        <div className={`flex items-center gap-[16px] h-[44px] shrink-0 px-[24px] text-[13px] leading-[18px] ${SANS} text-sub`}>
          <span style={{ width: COLS.date }} className="shrink-0">Date</span>
          <span style={{ width: COLS.name }} className="shrink-0">Patient</span>
          <span className="grow min-w-[0px]">Service</span>
          <span style={{ width: COLS.coverage }} className="shrink-0">Coverage</span>
          <span style={{ width: COLS.amount }} className="shrink-0">Amount</span>
          <span style={{ width: COLS.status }} className="shrink-0 flex items-center justify-between">
            Status
            {filter !== "all" && (
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={`flex items-center h-[26px] px-[10px] rounded-[999px] bg-[#28191014] hover:bg-[#2819101F] transition-colors duration-150 text-[12px] leading-[16px] ${SANS} font-[500] text-walnut`}
              >
                Show All
              </button>
            )}
          </span>
        </div>
        <div className="flex flex-col grow min-h-[0px] gap-[4px] px-[8px] pb-[8px] overflow-y-auto overscroll-y-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {rows.map((r) => {
            const on = open === r.id;
            const pending = r.auth !== null && r.auth !== "approved";
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => select(r.id)}
                className={`flex items-center gap-[16px] h-[62px] shrink-0 px-[16px] rounded-[12px] bg-paper text-left outline outline-[1.5px] -outline-offset-[1.5px] transition-[outline-color] duration-150 ${on ? "outline-ink" : "outline-transparent hover:outline-[#28191026]"}`}
              >
                <span style={{ width: COLS.date }} className={`shrink-0 text-[15px] leading-[20px] ${SANS} font-[500] text-walnut`}>{r.date}</span>
                <span style={{ width: COLS.name }} className={`shrink-0 truncate text-[16px] leading-[22px] tracking-[-0.01em] ${SANS} font-[500] text-ink`}>{r.name}</span>
                <span className={`grow min-w-[0px] truncate text-[15px] leading-[20px] ${SANS} text-[rgba(40,25,16,0.78)]`}>{r.service}</span>
                <span style={{ width: COLS.coverage }} className="shrink-0 flex flex-col min-w-[0px]">
                  <span className={`truncate text-[14px] leading-[18px] ${SANS} text-walnut`}>{r.payer}</span>
                  <span className={`flex items-center gap-[4px] text-[12px] leading-[16px] ${SANS} ${pending ? "text-[#B4572F]" : "text-sub"}`}>
                    {r.auth ? <Shield size={12} /> : null}
                    {r.auth ? (pending ? "Auth in Progress" : "Auth Approved") : "No Auth Needed"}
                  </span>
                </span>
                <span style={{ width: COLS.amount }} className={`shrink-0 text-[15px] leading-[20px] ${SANS} font-[500] [font-variant-numeric:tabular-nums] ${r.stage === "auth" ? "text-sub" : "text-walnut"}`}>
                  {r.stage === "auth" ? `~${r.amount}` : r.amount}
                </span>
                <span style={{ width: COLS.status }} className="shrink-0 flex">
                  <Pill {...pillFor(r)} />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      </div>

      <div className="h-full shrink-0 overflow-hidden" style={{ width: open ? PANEL_W + 12 : 0, transition: `width ${MOVE}` }} aria-hidden={!open}>
        <div
          role="dialog"
          aria-label={`${row.name}, ${row.service}`}
          className="h-full py-[12px] pr-[12px]"
          style={{ width: PANEL_W + 12, opacity: open ? 1 : 0, transition: `opacity ${MOVE}`, pointerEvents: open ? "auto" : "none" }}
        >
          <JourneyPanel row={row} onClose={() => setOpen(null)} />
        </div>
      </div>
    </div>
  );
}
